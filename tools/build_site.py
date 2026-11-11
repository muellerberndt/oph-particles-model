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
GENERATED = ('index.html', 'api', 'runs', 'lab', 'rl', 'help', 'particle_map.json', 'findings.json', 'DATASET.md')


def copy_viewer(viewer: Path, out: Path) -> int:
    n = 0
    for f in viewer.rglob('*'):
        rel = f.relative_to(viewer)
        if f.is_dir() or rel.parts[0] in SKIP or f.name.endswith('.mjs') or '__pycache__' in rel.parts:
            continue
        dst = out / rel; dst.parent.mkdir(parents=True, exist_ok=True)
        if f.suffix in ('.js', '.html', '.css'):
            dst.write_text(ABS.sub(r'\1', f.read_text()))
        else:
            shutil.copy2(f, dst)
        n += 1
    return n


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
    shutil.copytree(viewer / 'research', out / 'rl')
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
    (out / '.nojekyll').write_text('')
    size = sum(f.stat().st_size for f in out.rglob('*') if f.is_file() and '.git' not in f.parts)
    print(f'{n} viewer files, runs {", ".join(published)}, site {size / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
