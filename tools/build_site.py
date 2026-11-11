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
GENERATED = ('CNAME', 'index.html', 'fp-analytics.js', 'og.jpg', 'api', 'runs', 'lab', 'rl', 'help', 'references', 'fixtures', 'particle_map.json', 'findings.json', 'DATASET.md')
LEPTON_LABEL_FILES = {'classes.js', 'chart.js', 'equations_data.js', 'links.js', 'lepton_round.js', 'journey.js',
                     'leptons.js', 'mapview.js', 'map.js', 'results_data.js', 'lepton_round_check.mjs',
                     'results_data_check.mjs'}


def rewrite_source(source: str, name: str) -> str:
    """Use the published data routes in browser modules and downloadable Node checks."""
    source = ABS.sub(r'\1', source)
    if name in LEPTON_LABEL_FILES:
        source = source.replace('80 checks', '99 checks').replace('80 of 80', '99 of 99')
    # Number conservation is an exact statement of the declared register. The neutrino interpretation
    # requires a physical field attachment, as the theory contract and the Spectrum page state.
    for old, current in (
        ('No neutrino mass is derived: the source conserves B − L exactly, so neutrinos are Dirac, and no operation gives them an amplitude of their own.',
         'The declared source conserves B − L and excludes a number-violating Majorana term in that sector. A physical neutrino identity, mass and mixing are not derived.'),
        ('B − L is exact, so neutrinos are Dirac. No mass and no mixing is derived.',
         'B − L is conserved in the declared sector. A physical neutrino identity, mass and mixing are not derived.'),
        ('Every operation of the source conserves it. Neutrinos are Dirac.',
         'The declared operations conserve it and exclude Majorana pairing in that sector. A physical neutrino identity requires a separate attachment.'),
        ("formula: 'neutrinos are Dirac'", "formula: 'Majorana pairing excluded in this sector'"),
        ('Exact B − L: neutrinos are Dirac. Every operation of the source conserves B − L, and that charge forbids the Majorana pairing. The neutrino masses are open.',
         'Every declared operation conserves B − L and excludes number-violating Majorana pairing in that sector. This does not alone identify a physical Dirac neutrino or its mass.'),
        ('Neutrinos are Dirac. With the common lepton amplitude a neutrino has the electron’s mass, which is excluded. No neutrino mass and no mixing angle is derived.',
         'In the declared number-conserving sector, the common lepton amplitude would give a neutrino the electron’s mass, which is excluded. No physical neutrino identity, mass or mixing angle is derived.'),
        ('Neutrinos are Dirac as the source stands, with no mass derived (NM).',
         'The declared sector excludes Majorana pairing; no physical neutrino identity or mass is derived (NM).'),
        ('Neutrinos are Dirac by exact B − L; their masses are open.',
         'The declared B − L conservation excludes Majorana pairing in that sector; physical neutrino identities and masses require a separate attachment.'),
        ('Derived consequence: neutrinos are Dirac.',
         'This excludes number-violating Majorana pairing in the declared sector; a physical neutrino identity requires a separate attachment.'),
    ):
        source = source.replace(old, current)
    if name.endswith('_check.mjs'):
        source = re.sub(r"(['\"])(\./)?research/", r'\1\2rl/', source)
        source = source.replace('../references/cosmology_postdiction_ledger.json',
                                './references/cosmology_postdiction_ledger.json')
        source = source.replace("'/Users/muellerberndt/Projects/oph-meta/repair-law/work/LEPTON_READOUT/lepton_readout.json'",
                                "new URL('./fixtures/lepton_readout.json', import.meta.url)")
        if name == 'lepton_round_check.mjs':
            source = source.replace('Object.keys(R.checks).length === 80',
                                    'Object.keys(R.checks).length === 99 && Object.values(R.checks).every(v => v === true)')
        if name == 'results_data_check.mjs':
            source = source.replace('assert.equal(n(c2), 80)', 'assert.equal(n(c2), 99)')
            source = source.replace('assert.equal(Object.keys(c2.checks).length, 80)',
                                    'assert.equal(Object.keys(c2.checks).length, 99)')
    return source


def copy_check_fixtures(viewer: Path, out: Path) -> None:
    """Ship the immutable input bytes required by the public checks."""
    for source, relative in (
        (viewer.parent / 'references/cosmology_postdiction_ledger.json', 'references/cosmology_postdiction_ledger.json'),
        (ROOT / 'derivations/work/LEPTON_READOUT/lepton_readout.json', 'fixtures/lepton_readout.json'),
    ):
        destination = out / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)


def copy_viewer(viewer: Path, out: Path) -> int:
    n = 0
    for f in viewer.rglob('*'):
        rel = f.relative_to(viewer)
        if f.is_dir() or rel.parts[0] in SKIP or '__pycache__' in rel.parts or f.name in DEV_ONLY:   # check scripts (.mjs) are published: pages link them
            continue
        dst = out / rel; dst.parent.mkdir(parents=True, exist_ok=True)
        if f.suffix in ('.js', '.mjs', '.html', '.css'):
            dst.write_text(rewrite_source(f.read_text(), f.name))
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


DATA_URL = 'https://oph-particles-data-20261111.s3.amazonaws.com/index.html'   # the complete runs, for download
VIEW_ONLY_DROP = ('intra_', 'feat_ticks', 'load_hist', 'ticks')                   # arrays of a stored cut the site does not draw
ON_DEMAND = ('loads',)                     # read only by the zoom view: kept in <cut>_loads.npz, fetched when a zoom opens


def slim_cuts(run: Path) -> None:
    """Keep in every stored cut only the arrays the viewer draws. The defects inside carriers (the internal tier) stay
    in the complete run on S3; the viewer hides its internal-tier switch when a cut does not carry them. The port loads
    (12 per carrier, two thirds of a slice) go to a sibling file: playing the screen then fetches a third of the bytes."""
    import numpy as np
    for f in sorted((run / 'cuts').glob('*.npz')):
        if f.stem.endswith('_loads'):
            continue
        with np.load(f) as z:
            keep = {k: z[k] for k in z.files if not k.startswith(VIEW_ONLY_DROP) and k not in ON_DEMAND}
            later = {k: z[k] for k in z.files if k in ON_DEMAND}
        if later:
            np.savez_compressed(f.with_name(f.stem + '_loads.npz'), **later)
        tmp = f.with_name(f.stem + '.tmp.npz')
        np.savez_compressed(tmp, **keep)
        tmp.replace(f)


def slim_catalogue(run: Path) -> None:
    """The site draws defects of the screen tier only: keep their catalogue rows and the rows they point to (partners,
    parents, children), and drop the columns no page reads. The app finds rows by identity, so the order is free."""
    import numpy as np
    f = run / 'view' / 'catalogue.npz'
    if not f.is_file():
        return
    with np.load(f) as z:
        cat = {k: z[k] for k in z.files}
    keep = cat['tier'] == 1
    ids = cat['id']
    ref = np.concatenate([cat[c][keep] for c in ('partner', 'parent1', 'parent2', 'child1', 'child2') if c in cat])
    keep |= np.isin(ids, ref[ref >= 0])
    out = {k: v[keep] for k, v in cat.items() if k not in ('birth_xyz', 'last_xyz') and len(v) == len(ids)}
    tmp = f.with_name('catalogue.tmp.npz')
    np.savez_compressed(tmp, **out)
    tmp.replace(f)
    print(f'catalogue of {run.name}: {int(keep.sum()):,} of {len(ids):,} identities kept')


STATIC_IMPORT = re.compile(r"""(?:^|[;\n])\s*(?:import|export)\s[^'"`;]*?from\s*['"](\.{1,2}/[^'"]+\.js)['"]|(?:^|[;\n])\s*import\s*['"](\.{1,2}/[^'"]+\.js)['"]""")


def preload_graph(out: Path) -> int:
    """List every module of the static import graph of the entry scripts as a modulepreload link, so the browser
    fetches them all at once instead of one import level per round trip."""
    entries, seen = ['journey.js', 'app.js'], []
    stack = list(entries)
    while stack:
        f = stack.pop(0)
        if f in seen or not (out / f).is_file():
            continue
        seen.append(f)
        base = Path(f).parent
        for a, b in STATIC_IMPORT.findall((out / f).read_text()):
            dep = (base / (a or b)).as_posix()
            dep = str(Path(dep)).replace('\\', '/')
            if dep.startswith('./'):
                dep = dep[2:]
            stack.append(dep)
    html = (out / 'index.html').read_text()
    links = ''.join(f'<link rel="modulepreload" href="{m}">\n' for m in seen if m not in ('journey.js',))
    html = html.replace('<link rel="modulepreload" href="journey.js">', '<link rel="modulepreload" href="journey.js">\n' + links, 1)
    (out / 'index.html').write_text(html)
    return len(seen)


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
    copy_check_fixtures(viewer, out)
    from sync_hadron_analysis import sync
    sync(out)
    from sync_particle_reference import sync as sync_reference
    sync_reference(out)
    from sync_thermal_scope import sync as sync_thermal
    sync_thermal(out)
    from sync_finite_results import sync as sync_finite
    sync_finite(out)
    for f in ('particle_map.json', 'findings.json', 'DATASET.md'):
        shutil.copy2(SIM / 'oph_defects' / f, out / f)
    runs = serve.find_runs(a.runs)
    if a.only:
        runs = {k: v for k, v in runs.items() if k in a.only}
    (out / 'runs').mkdir()
    for name, path in runs.items():
        dataset.lite(path, out / 'runs' / name, a.keep_one_in)
        slim_cuts(out / 'runs' / name)
        slim_catalogue(out / 'runs' / name)
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
    print(f'{preload_graph(out)} modules preloaded')
    (out / '.nojekyll').write_text('')
    (out / 'CNAME').write_text('particles.floatingpragma.ai\n')        # the site's address; DNS: CNAME particles -> muellerberndt.github.io
    size = sum(f.stat().st_size for f in out.rglob('*') if f.is_file() and '.git' not in f.parts)
    print(f'{n} viewer files, runs {", ".join(published)}, site {size / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
