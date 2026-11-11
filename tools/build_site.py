"""Build the static GitHub Pages site of the OPH particle viewer from oph-physics-sim.

    python tools/build_site.py [--runs ../oph-physics-sim/runs/universe] [--only L6] [--keep-one-in 1]

The viewer in ``oph-physics-sim/oph_defects/viewer2`` is written for the local server ``oph_defects.serve``. This
script reproduces every route of that server as plain files, so the site needs no server:

* the viewer files themselves (index.html and its modules, help texts, the frozen research bundle under ``rl/``);
* ``api/runs`` and ``api/closed_loop`` as JSON files with the server's own contents;
* ``runs/<name>/`` as a viewer copy of each run (``dataset.lite``: no records, checkpoints or series);
* ``lab/L1.npz`` ... ``lab/L5.npz`` for the Detector page;
* ``particle_map.json``, ``findings.json``, ``DATASET.md``.

The server serves at the domain root; a project site lives below ``/oph-particles-model/``. Absolute paths in the
viewer's code (``'/rl/...'``, ``` `/runs/...` ```) are therefore rewritten to relative ones in the copies.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SIM = ROOT.parent / 'oph-physics-sim'
sys.path.insert(0, str(SIM))

PREFIXES = ('rl/', 'runs/', 'api/', 'lab/', 'particle_map.json', 'findings.json', 'DATASET.md')
ABS = re.compile(r"""(['"`])/(?=(?:%s))""" % '|'.join(re.escape(p) for p in PREFIXES))
SKIP = {'research'}                       # copied separately as rl/
DEV_ONLY = {'equations_dev.html'}         # development harnesses that are not part of the site
GENERATED = ('CNAME', 'index.html', 'fp-analytics.js', 'og.jpg', 'api', 'runs', 'lab', 'rl', 'help', 'particle_map.json', 'findings.json', 'DATASET.md')


def copy_viewer(viewer: Path, out: Path) -> int:
    n = 0
    for f in viewer.rglob('*'):
        rel = f.relative_to(viewer)
        if f.is_dir() or rel.parts[0] in SKIP or '__pycache__' in rel.parts or f.name in DEV_ONLY:   # check scripts (.mjs) are published: pages link them
            continue
        dst = out / rel; dst.parent.mkdir(parents=True, exist_ok=True)
        if f.suffix in ('.js', '.mjs', '.html', '.css'):
            dst.write_text(ABS.sub(r'\1', f.read_text()))
        else:
            shutil.copy2(f, dst)
        n += 1
    return n


EXTRA = Path(__file__).resolve().parent / 'site_extra'     # fp-analytics.js (GA, Ads, X pixel under one cookie choice), og.jpg
DESCRIPTION = 'Watch observer universes settle and read off the particles: the defects that no repair can remove.'


def add_tags(out: Path) -> None:
    """Copy the measurement script and share image, and put tags, description and share card into every top-level page."""
    for f in EXTRA.iterdir():
        shutil.copy2(f, out / f.name)
    for page in out.glob('*.html'):
        s = page.read_text()
        if 'fp-analytics.js' in s or '</title>' not in s:
            continue
        url = 'https://particles.floatingpragma.ai/' + ('' if page.name == 'index.html' else page.name)
        title = 'OPH universe viewer' if page.name == 'index.html' else 'OPH field records'
        head = (f'<link rel="canonical" href="{url}">\n<meta name="description" content="{DESCRIPTION}">\n'
                '<meta property="og:type" content="website">\n<meta property="og:site_name" content="Pragma Research">\n'
                f'<meta property="og:title" content="{title}">\n<meta property="og:description" content="{DESCRIPTION}">\n'
                f'<meta property="og:url" content="{url}">\n'
                '<meta property="og:image" content="https://particles.floatingpragma.ai/og.jpg">\n'
                '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'
                '<meta name="twitter:card" content="summary_large_image">\n'
                '<meta name="twitter:image" content="https://particles.floatingpragma.ai/og.jpg">\n'
                '<script src="fp-analytics.js"></script>\n')
        page.write_text(s.replace('</title>', '</title>\n' + head, 1))


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('--runs', type=Path, default=SIM / 'runs' / 'universe')
    p.add_argument('--only', nargs='*', default=None, help='run names to publish (default: all)')
    p.add_argument('--keep-one-in', type=int, default=1, help='1-in-k sample of defect identities on the stored slices')
    p.add_argument('--out', type=Path, default=ROOT)
    a = p.parse_args(argv)
    from oph_defects import dataset, serve, observer_lab
    out = a.out
    for name in GENERATED:                                # rebuild the generated part from scratch
        t = out / name
        if t.is_dir():
            shutil.rmtree(t)
        elif t.exists():
            t.unlink()
    viewer = SIM / 'oph_defects' / 'viewer2'
    n = copy_viewer(viewer, out)
    shutil.copytree(viewer / 'research', out / 'rl', ignore=shutil.ignore_patterns('_dev', '__pycache__'))
    for f in ('particle_map.json', 'findings.json', 'DATASET.md'):
        shutil.copy2(SIM / 'oph_defects' / f, out / f)
    runs = serve.find_runs(a.runs)
    if a.only:
        runs = {k: v for k, v in runs.items() if k in a.only}
    (out / 'runs').mkdir()
    for name, path in runs.items():
        dataset.lite(path, out / 'runs' / name, a.keep_one_in)
        for extra in ('early_universe.json',):
            if (path / 'view' / extra).is_file():
                shutil.copy2(path / 'view' / extra, out / 'runs' / name / 'view' / extra)
    (out / 'api').mkdir()
    published = serve.find_runs(out / 'runs')
    (out / 'api' / 'runs').write_text(json.dumps([serve.summary(k, v) for k, v in sorted(published.items(), key=lambda kv: serve.summary(*kv)['carriers'])]))
    (out / 'api' / 'closed_loop').write_text(json.dumps(serve.closed_loop_tables(a.runs.resolve().parent / 'closed_loop')))
    (out / 'lab').mkdir()
    for level in range(1, 6):
        observer_lab.export(level, out / 'lab' / f'L{level}.npz')
    add_tags(out)
    (out / '.nojekyll').write_text('')
    (out / 'CNAME').write_text('particles.floatingpragma.ai\n')        # the site's address; DNS: CNAME particles -> muellerberndt.github.io
    size = sum(f.stat().st_size for f in out.rglob('*') if f.is_file() and '.git' not in f.parts)
    print(f'{n} viewer files, runs {", ".join(published)}, site {size / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
