"""Check every external link of the OPH particle viewer.

    python tools/check_links.py [--viewer DIR] [--rer DIR] [--json report.json] [--offline]

The script collects every absolute URL from the viewer's ``.js``, ``.html`` and ``.css`` files, its help files and the
JSON documents the pages render (``findings.json``, ``particle_map.json`` and the JSON files beside the viewer modules).
It also resolves the URLs that the code builds: ``RER + 'path'``, ``SITE + 'path'``, ``DER + 'path'``, ``PAPER('name')``
and any other string constant that holds a URL base (for example the CDN base of ``math.js``).

Each URL must answer with HTTP 200. For a blob URL of ``FloatingPragma/observer-patch-holography`` on branch ``main``
the path must also exist on ``origin/main`` of the local checkout (``git cat-file -e``, a read-only command); a blob URL
that names a commit is checked against that commit when the checkout has it. For the
viewer's own repository the script compares with the local checkout and the local site build, to tell a missing file
from a file that is not published yet.

The client sends a generic User-Agent and nothing else: no cookies, no credentials, no contact details.
Exit status: 0 when every link answers 200, 1 when a link is dead, 2 when the only failures are refusals (403, 429).
"""
from __future__ import annotations

import argparse
import concurrent.futures
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
META = ROOT.parent
VIEWER = META / 'oph-physics-sim' / 'oph_defects' / 'viewer2'
RER_CHECKOUT = META / 'reverse-engineering-reality'
UA = 'link-checker/1.0 (python-urllib)'
RER_BLOB = re.compile(r'^https://github\.com/FloatingPragma/observer-patch-holography/(?:blob|tree|raw)/([^/]+)/(.*)$')
OWN_BLOB = re.compile(r'^https://github\.com/muellerberndt/oph-particles-model/(?:blob|tree|raw)/(main|gh-pages)/(.*)$')
LITERAL = re.compile(r'''https?://(?:\$\{[A-Za-z_][\w.]*\}|[^\s'"`<>\\)\]{}|^])+''')
CONST = re.compile(r'''(?:export\s+)?const\s+([A-Za-z_]\w*)\s*=\s*(['"`])((?:(?!\2).)*)\2\s*[;,]''')
CONCAT = re.compile(r'''(?<![\w.$])([A-Za-z_]\w*)\s*\+\s*(['"])([^'"\n]*)\2(?!\s*\+)''')
INTERP = re.compile(r'''\$\{([A-Za-z_]\w*)\}([^\s'"`<>$\\]+)''')
PAPER = re.compile(r'''\bPAPER\(\s*(['"])([^'"]+)\1\s*\)''')
NAMESPACES = ('http://www.w3.org/',)                       # XML namespace names, not links
LOCAL = ('http://localhost', 'http://127.0.0.1', 'https://localhost')


def source_files(viewer: Path) -> list[Path]:
    files = []
    for f in sorted(viewer.rglob('*')):
        rel = f.relative_to(viewer)
        if not f.is_file() or rel.parts[0] == 'research' or f.name.endswith('.mjs'):
            continue
        if f.suffix in ('.js', '.html', '.css') or (f.suffix == '.json' and len(rel.parts) == 1):
            files.append(f)
    for name in ('findings.json', 'particle_map.json'):      # documents the pages render, kept beside the viewer
        if (viewer.parent / name).is_file():
            files.append(viewer.parent / name)
    return files


def constants(files: list[Path]) -> tuple[dict, dict]:
    """String constants per file and the exported ones. A value may use ${NAME} of an earlier constant."""
    per_file, exported = {}, {}
    for f in files:
        if f.suffix not in ('.js', '.html'):
            continue
        local = {}
        text = f.read_text(errors='replace')
        for m in CONST.finditer(text):
            value = re.sub(r'\$\{([A-Za-z_]\w*)\}', lambda x: local.get(x.group(1), x.group(0)), m.group(3))
            local[m.group(1)] = value
            if m.group(0).startswith('export'):
                exported[m.group(1)] = value
        per_file[f] = local
    return per_file, exported


def paper_rule(viewer: Path, exported: dict):
    """The PAPER(name) rule of links.js: base + prefix + name + suffix."""
    text = (viewer / 'links.js').read_text() if (viewer / 'links.js').is_file() else ''
    m = re.search(r'''export const PAPER = \(f\) => (\w+) \+ '([^']*)' \+ f \+ '([^']*)';''', text)
    if m and m.group(1) in exported:
        return lambda name: exported[m.group(1)] + m.group(2) + name + m.group(3)
    return None


def clean(url: str) -> str:
    return url.rstrip('.,;:!?')


def collect(viewer: Path) -> tuple[dict, list]:
    """URL -> list of (file, line, how). Second value: URL templates that could not be resolved."""
    files = source_files(viewer)
    per_file, exported = constants(files)
    paper = paper_rule(viewer, exported)
    found, unresolved = defaultdict(list), []
    is_url = lambda v: isinstance(v, str) and v.startswith(('http://', 'https://'))
    for f in files:
        names = dict(exported); names.update(per_file.get(f, {}))
        bases = {k: v for k, v in names.items() if is_url(v)}
        rel = str(f.relative_to(viewer.parent))
        for no, line in enumerate(f.read_text(errors='replace').splitlines(), 1):
            for m in LITERAL.finditer(line):
                url = re.sub(r'\$\{([A-Za-z_]\w*)\}', lambda x: names.get(x.group(1), x.group(0)), m.group(0))
                if '${' in url or (url.endswith('$') and line[m.end():m.end() + 1] == '{'):     # a template with an expression in it
                    unresolved.append((rel, no, line[m.start():m.end() + 60].split('`')[0].split("'")[0])); continue
                url = clean(url)
                if url in bases.values() and url.endswith('/'):
                    continue                                   # a base constant; the composed URLs are checked
                found[url].append((rel, no, 'literal'))
            if f.suffix in ('.js', '.html'):
                for m in CONCAT.finditer(line):
                    if m.group(1) in bases and m.group(3):
                        found[clean(bases[m.group(1)] + m.group(3))].append((rel, no, f"{m.group(1)} + '{m.group(3)}'"))
                for m in INTERP.finditer(line):
                    if m.group(1) in bases:
                        found[clean(bases[m.group(1)] + m.group(2))].append((rel, no, '${' + m.group(1) + '}' + m.group(2)))
                if paper:
                    for m in PAPER.finditer(line):
                        found[paper(m.group(2))].append((rel, no, f"PAPER('{m.group(2)}')"))
    for skip in [u for u in found if u.startswith(NAMESPACES) or u.startswith(LOCAL)]:
        del found[skip]
    return found, unresolved


def git_has(repo: Path, ref: str, path: str):
    """True or False when the ref exists in the checkout, None when the checkout or the ref is missing. Read only."""
    if not (repo / '.git').exists():
        return None
    env = {'GIT_OPTIONAL_LOCKS': '0', 'PATH': '/usr/bin:/bin:/usr/local/bin:/opt/homebrew/bin'}
    if subprocess.run(['git', '-C', str(repo), 'rev-parse', '--verify', '--quiet', ref], capture_output=True, env=env).returncode:
        return None
    return subprocess.run(['git', '-C', str(repo), 'cat-file', '-e', f'{ref}:{path.rstrip("/")}'], capture_output=True, env=env).returncode == 0


def git_paths(repo: Path, ref: str) -> list[str]:
    env = {'GIT_OPTIONAL_LOCKS': '0', 'PATH': '/usr/bin:/bin:/usr/local/bin:/opt/homebrew/bin'}
    r = subprocess.run(['git', '-C', str(repo), 'ls-tree', '-r', '--name-only', ref], capture_output=True, text=True, env=env)
    return r.stdout.splitlines() if r.returncode == 0 else []


def http_status(url: str, timeout: float = 25.0) -> tuple[int | None, str]:
    """Status of the final response after redirects. HEAD first, GET when the server does not answer HEAD properly."""
    last = (None, 'no answer')
    for method in ('HEAD', 'GET'):
        for attempt in range(2):
            req = urllib.request.Request(url.split('#')[0], method=method, headers={'User-Agent': UA, 'Accept': '*/*'})
            try:
                with urllib.request.urlopen(req, timeout=timeout) as r:
                    return r.status, r.geturl() if r.geturl() != url.split('#')[0] else ''
            except urllib.error.HTTPError as e:
                last = (e.code, '')
                if e.code == 429 and attempt == 0:
                    time.sleep(8); continue
                break
            except Exception as e:                              # DNS, TLS, timeout
                last = (None, type(e).__name__ + ': ' + str(e)[:120])
                break
        if last[0] in (200, 404, 410):
            return last
    return last


def rer_ref(ref: str) -> str:
    return 'origin/main' if ref == 'main' else ref           # a branch of the public repository, or a commit


def propose(url: str, rer: Path, viewer: Path, rer_tree: list[str]) -> str:
    m = RER_BLOB.match(url)
    if m:
        name = m.group(2).rstrip('/').split('/')[-1]
        same = [p for p in rer_tree if p.split('/')[-1] == name]
        stem = [p for p in rer_tree if Path(p).stem == Path(name).stem and p not in same]
        if same:
            return 'same file name on origin/main: ' + ', '.join(same[:4])
        if stem:
            return 'same name with another extension on origin/main: ' + ', '.join(stem[:4])
        return 'no file of that name on origin/main; remove the link or name the file that replaced it'
    m = OWN_BLOB.match(url)
    if m:
        branch, path = m.groups()
        if branch == 'main':
            local = ROOT / path
            if local.exists():
                return f'the file exists in the local checkout ({path}) and is not on the public main branch: commit and push it'
            base = [str(p.relative_to(ROOT)) for p in (ROOT / 'derivations').rglob(Path(path).name)] if (ROOT / 'derivations').is_dir() else []
            src = META / 'repair-law' / path.replace('derivations/', '', 1)
            return ('same file name in the checkout: ' + ', '.join(base[:4])) if base else (f'not in the published derivations; the source exists at repair-law/{path.replace("derivations/", "", 1)}: publish it or remove the link' if src.exists() else 'not in the published derivations: publish the file or remove the link')
        if path.endswith('.mjs'):
            return ('tools/build_site.py does not copy .mjs files to the site: lift that exclusion or remove the link'
                    + ('' if (viewer / path).exists() else '; the file is also missing in the viewer source'))
        if (ROOT / 'site' / path).exists() or (viewer / path).exists() or (viewer.parent / path).exists():
            return 'the file exists in the viewer source and is not on the gh-pages branch: rebuild and publish the site'
        return 'no such file in the viewer source: correct the path or remove the link'
    return 'check the address by hand'


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('--viewer', type=Path, default=VIEWER, help='the viewer source directory (default: the simulation repository beside this one)')
    p.add_argument('--rer', type=Path, default=RER_CHECKOUT, help='local checkout of FloatingPragma/observer-patch-holography')
    p.add_argument('--json', type=Path, default=None, help='write the full report as JSON')
    p.add_argument('--offline', action='store_true', help='only the local checks, no HTTP request')
    p.add_argument('--workers', type=int, default=4)
    a = p.parse_args(argv)
    found, unresolved = collect(a.viewer)
    urls = sorted(found)
    rer_tree = git_paths(a.rer, 'origin/main')
    status = {}
    if not a.offline:
        by_host = defaultdict(list)
        for u in urls:
            by_host[u.split('/')[2]].append(u)

        def host_job(batch):                                    # one host at a time, politely
            out = {}
            for u in batch:
                out[u] = http_status(u)
                time.sleep(0.25)
            return out
        with concurrent.futures.ThreadPoolExecutor(max_workers=a.workers) as ex:
            for part in ex.map(host_job, by_host.values()):
                status.update(part)
    rows = []
    for u in urls:
        code, note = status.get(u, (None, 'not requested'))
        local = None
        m = RER_BLOB.match(u)
        if m:
            local = git_has(a.rer, rer_ref(m.group(1)), m.group(2))
        m2 = OWN_BLOB.match(u)
        own = None
        if m2:
            own = git_has(ROOT, 'origin/' + m2.group(1), m2.group(2))
        if a.offline:
            verdict = 'dead' if local is False or own is False else 'unchecked'
        elif code == 200 and local is not False:
            verdict = 'ok'
        elif code == 200:
            verdict = 'dead'                                    # answers on the web and is missing on origin/main of the checkout
        elif code in (401, 403, 429, 999):
            verdict = 'refused'
        else:
            verdict = 'dead'
        rows.append({'url': u, 'http': code, 'note': note, 'on_origin_main_of_theory_checkout': local, 'on_origin_of_viewer_checkout': own, 'verdict': verdict,
                     'used': [{'file': f, 'line': n, 'as': how} for f, n, how in found[u]],
                     'proposal': propose(u, a.rer, a.viewer, rer_tree) if verdict == 'dead' else ''})
    counts = defaultdict(int)
    for r in rows:
        counts[r['verdict']] += 1
    print(f"{len(rows)} distinct URLs in {len({x['file'] for r in rows for x in r['used']})} files, {sum(len(r['used']) for r in rows)} uses: "
          + ', '.join(f'{v} {k}' for k, v in sorted(counts.items())))
    hosts = defaultdict(lambda: defaultdict(int))
    for r in rows:
        hosts[r['url'].split('/')[2]][r['verdict']] += 1
    for h, c in sorted(hosts.items()):
        print(f"  {h}: " + ', '.join(f'{v} {k}' for k, v in sorted(c.items())))
    for verdict, title in (('dead', 'DEAD'), ('refused', 'REFUSED TO THIS CLIENT (not verified)')):
        bad = [r for r in rows if r['verdict'] == verdict]
        if bad:
            print(f'\n{title}: {len(bad)}')
        for r in bad:
            extra = '' if r['on_origin_main_of_theory_checkout'] is None else f", in the theory checkout at that ref: {'yes' if r['on_origin_main_of_theory_checkout'] else 'no'}"
            print(f"- {r['url']}\n    HTTP {r['http']}{(' ' + r['note']) if r['note'] and r['http'] != 200 else ''}{extra}")
            for x in r['used']:
                print(f"    {x['file']}:{x['line']}  ({x['as']})")
            if r['proposal']:
                print(f"    proposal: {r['proposal']}")
    if unresolved:
        print(f'\nURL TEMPLATES NOT RESOLVED: {len(unresolved)}')
        for f, n, t in unresolved:
            print(f'- {f}:{n}  {t}')
    if a.json:
        a.json.write_text(json.dumps({'schema': 'oph.viewer.link_check.v1', 'checked': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'user_agent': UA,
                                      'counts': counts, 'links': rows, 'unresolved_templates': [{'file': f, 'line': n, 'template': t} for f, n, t in unresolved]}, indent=1) + '\n')
    if counts['dead']:
        return 1
    return 2 if counts['refused'] else 0


if __name__ == '__main__':
    sys.exit(main())
