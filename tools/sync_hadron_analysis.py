"""Bind the viewer's hadron ratios to the replayable analysis in the theory repository.

The simulator's research bundle contains reduced production records. This projection uses the audited analysis
receipt for normalized mass uncertainties and keeps its statistical and fit-choice components visible.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_RECEIPT = ROOT.parent / 'reverse-engineering-reality/model/quenched_hadron_binding/results.json'
SOURCE = 'https://github.com/FloatingPragma/observer-patch-holography/blob/main/model/quenched_hadron_binding/'
RATIOS = {
    'm_N/m_rho (chiral limit)': 'mN_over_mrho_chiral',
    'm_N/m_rho (physical m_pi/m_rho)': 'mN_over_mrho_phys',
    'm_rho/sqrt(sigma) (chiral limit)': 'mrho_over_sqrtsigma_chiral',
    'm_N/sqrt(sigma) (chiral limit)': 'mN_over_sqrtsigma_chiral',
    'm_rho/sqrt(sigma) (physical m_pi/m_rho)': 'mrho_over_sqrtsigma_phys',
    'm_N/sqrt(sigma) (physical m_pi/m_rho)': 'mN_over_sqrtsigma_phys',
}


def project(viewer, receipt, digest):
    """Return a JSON-safe viewer projection; reject failed or mismatched scientific inputs."""
    if (receipt.get('schema') != 'oph.quenched_hadron_binding.v1'
            or receipt.get('all_checks_pass') is not True
            or not receipt.get('checks') or not all(v is True for v in receipt['checks'].values())):
        raise ValueError('hadron analysis receipt must contain passing named checks')
    headline = receipt['headline']
    if headline['lattice'] != viewer['hadron_lattice']['size']:
        raise ValueError('viewer and analysis refer to different lattices')
    if headline['configurations'] != viewer['hadron_lattice']['configurations']:
        raise ValueError('viewer and analysis refer to different ensembles')
    out = json.loads(json.dumps(viewer))
    if {r['name'] for r in out['ratios']} != set(RATIOS):
        raise ValueError('viewer ratio list differs from its declared projection')
    for row in out['ratios']:
        values = headline[RATIOS[row['name']]]
        row.update(value=values['value'], err=values['err'], err_stat=values['stat'], err_syst=values['syst'])
    out['ratios_note'] = (
        'NOT BLIND. Statistical errors use the same-stream jackknife. Systematic errors are the largest shifts '
        'over crossed hadron and potential fit choices; they do not bound finite-volume, quenching or continuum '
        'effects. Measured values: PDG 2024 masses; the string tension root 440 MeV is a convention.')
    out['analysis_source'] = {'url': SOURCE + 'results.json', 'sha256': digest,
                              'proof': SOURCE + 'PROOF.md', 'replay': 'python -m model.quenched_hadron_binding --check'}
    for row in out['statements']:
        if row['text'].startswith('Quark-antiquark and three-quark states'):
            row['text'] = ('Quark-antiquark and three-quark correlators give lattice masses. At kappa = 0.1600: '
                           'pion 0.690, rho 0.811, nucleon 1.306. The nucleon is heavier at the three resolved '
                           'quark masses; its mass at kappa = 0.1675 is unresolved.')
        if row['text'].startswith('In the chiral limit m_N/m_rho'):
            row['text'] = ('In the chiral limit m_N/m_rho = 1.45(13), against 1.211 measured. The coarse lattice, '
                           'finite volume and omitted quark loops are uncontrolled sources of error; their '
                           'contributions are not quantified here.')
    return out


def sync(site, receipt=DEFAULT_RECEIPT, check=False):
    path = Path(site) / 'rl/HAD/hadrons.json'
    raw = Path(receipt).read_bytes()
    stored = json.loads(path.read_text())
    fresh = project(stored, json.loads(raw), hashlib.sha256(raw).hexdigest())
    if check:
        if stored != fresh:
            raise ValueError('viewer hadron values differ from the theory analysis receipt')
    else:
        path.write_text(json.dumps(fresh, indent=2, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, default=ROOT / 'site')
    parser.add_argument('--receipt', type=Path, default=DEFAULT_RECEIPT)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    sync(args.site, args.receipt, args.check)
