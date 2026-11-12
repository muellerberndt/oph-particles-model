"""Write the data of the viewer page "OpenWave status" from the project's criterion-by-criterion assessment.

    python tools/sync_openwave_status.py [--check]

Source: ../openwave-tuning/application_assessment.json (31 criteria of the OpenWave comparison, the project's own
estimate for each, its reason, the next validation test and the evidence packages of the theory repository).
Output: ../oph-physics-sim/oph_defects/viewer2/openwave_data.js, a viewer source file. Only evidence that is on the
public main branch of the theory repository is linked. The estimates are the project's; OpenWave awards its own cells.
"""
from __future__ import annotations
import argparse, hashlib, json, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
META = ROOT.parent
SOURCE = META / 'openwave-tuning' / 'application_assessment.json'
RER = META / 'reverse-engineering-reality'
OUT = META / 'oph-physics-sim' / 'oph_defects' / 'viewer2' / 'openwave_data.js'
WORD = {'validated': 'met', 'partial': 'part', 'negative': 'fails', 'untested': 'untested'}


def build(source: Path = SOURCE, rer: Path = RER) -> str:
    d = json.loads(source.read_text())
    revision = d['evaluated_RER_commit']
    subprocess.run(['git', 'merge-base', '--is-ancestor', revision, 'origin/main'], cwd=rer, check=True, capture_output=True)
    public = set(subprocess.run(['git', 'ls-tree', '-r', '--name-only', revision, 'model'], cwd=rer, check=True,
                                capture_output=True, text=True).stdout.splitlines())
    rows = []
    for r in d['rows']:
        proofs = []
        for e in r['evidence']:
            if e.endswith('/PROOF.md') and e in public and e not in proofs:
                proofs.append(e)
        rows.append({'id': r['id'], 'criterion': r['criterion'],
                     'status': WORD[r['estimates']['central']],
                     'low': WORD[r['estimates']['conservative']], 'high': WORD[r['estimates']['permissive']],
                     'reason': r['reason'], 'next': r['next_validation_test'],
                     'proofs': [p.split('/')[1] for p in proofs]})
    if len(rows) != 31 or [r['id'] for r in rows] != list(range(1, 32)):
        raise ValueError('expected the 31 criteria in order')
    counts = {k: sum(r['status'] == k for r in rows) for k in ('met', 'part', 'fails', 'untested')}
    data = {'assessment_sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'upstream_commit': d['upstream_commit'], 'evaluated_RER_commit': d['evaluated_RER_commit'], 'counts': counts, 'rows': rows}
    head = ('// The 31 criteria of the OpenWave comparison with this project\'s own estimate for each (page "OpenWave status").\n'
            '// Written by oph-particles-model/tools/sync_openwave_status.py from the criterion-by-criterion assessment;\n'
            '// do not edit by hand. status: met, part, fails, untested (the central estimate); low and high: the\n'
            '// conservative and the permissive reading. proofs: packages model/<name> of the theory repository.\n'
            '// OpenWave has awarded OPH no cells: every status here is an estimate of this project.\n')
    return head + 'export const OPENWAVE = ' + json.dumps(data, indent=1, ensure_ascii=False) + ';\n'


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('--check', action='store_true')
    p.add_argument('--source', type=Path, default=SOURCE)
    p.add_argument('--rer', type=Path, default=RER)
    p.add_argument('--out', type=Path, default=OUT)
    a = p.parse_args()
    body = build(a.source, a.rer)
    if a.check:
        if not a.out.exists() or a.out.read_text() != body:
            raise SystemExit('stale openwave_data.js: run tools/sync_openwave_status.py')
        print('openwave_data.js is current')
    else:
        a.out.write_text(body)
        print(f'wrote {a.out}')


if __name__ == '__main__':
    main()
