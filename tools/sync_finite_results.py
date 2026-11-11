"""Project source-bound RER finite results into the particle explorer.

All displayed numbers come from replayable receipts. The mathematical
interactive controls are independently checked by test_finite_results.mjs.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RER = ROOT.parent / 'reverse-engineering-reality'
EXTRA = ROOT / 'tools/site_extra'
SOURCES = {
    'lepton': ('lepton_cycle/results.json', 'Complete lepton cycles'),
    'epochs': ('native_abundance_epochs/results.json', 'Exact population dynamics'),
    'symmetry': ('charge_conjugation_dynamics/results.json', 'Native conjugation symmetry'),
    'hadron': ('quenched_hadron_binding/results.json', 'Hadron covariance and scale'),
    'crossover': ('electroweak_crossover/results.json', 'Crossover size and cutoff sensitivity'),
    'repair': ('repair_sector_bridge/record_observer_results.json', 'Current-record distance observer'),
}


def load_receipt(path, rer):
    value = json.loads(path.read_text())
    if 'all_checks_pass' in value and value['all_checks_pass'] is not True:
        raise ValueError(f'failed receipt: {path}')
    if 'checks' in value and (not value['checks'] or any(v is not True for v in value['checks'].values())):
        raise ValueError(f'nonpassing checks: {path}')
    bindings = value.get('source_bindings', value.get('input_sha256', value.get('sources')))
    if not isinstance(bindings, dict) or not bindings:
        raise ValueError(f'source bindings absent: {path}')
    for name, expected in bindings.items():
        candidate = rer / name if name.startswith(('model/', 'Lean/', 'tools/')) else path.parent / name
        resolved = candidate.resolve()
        if not resolved.is_relative_to(rer.resolve()):
            raise ValueError('source binding escapes canonical repository')
        if hashlib.sha256(resolved.read_bytes()).hexdigest() != expected:
            raise ValueError(f'stale source binding: {candidate}')
    return value


def projection(receipts, sources):
    lepton, epochs, symmetry, hadron, crossover, repair = [receipts[k] for k in SOURCES]
    shape = lepton['viewer_projection']['sensitivity']
    native = symmetry['native_paired_history']
    if not symmetry['local']['every_branch_conjugates'] or not symmetry['abundance_kernel']['equivariant_kernel']:
        raise ValueError('missing conjugation premises')
    if repair['exhaustive_native_branch_checks'] != 3960 or repair['working_source_loads_exposed_to_controller'] is not False:
        raise ValueError('record readout source domain differs')
    contrast = hadron['production']['B']['chiral']['joint']['contrasts']['over_sqrt_sigma']
    cutoff = crossover['finite_size_cutoff']['matched_size_cutoff']['T_max']
    linear = cutoff['variants']['linear']
    memory = repair['memory_at_one_percent_horizon']
    rows = []
    for row in epochs['trajectory']:
        shares = [r['value'] for r in row['class_shares']]
        if abs(sum(shares)-1) > 1e-12:
            raise ValueError('population projection is not normalized')
        rows.append({'x': row['attempts'], 'p0': shares[0], 'p1': shares[1]+shares[5],
                     'p2': shares[2]+shares[4], 'p3': shares[3], 'energy': row['mean_energy']['value']})
    mass_rows = []
    for key, label in [('mrho_over_sqrtsigma_chiral','mρ / √σ'),
                       ('mN_over_sqrtsigma_chiral','mN / √σ'), ('mN_over_mrho_chiral','mN / mρ')]:
        row = hadron['headline'][key]
        mass_rows.append(dict(label=label, value=row['value'], statistical=row['stat'], systematic=row['syst']))
    return {
        'schema': 'oph.viewer.finite_results.v1', 'sources': sources,
        'lepton': {'finding':
            f"The squared-eigenvalue ratios are μ/e = {float(shape['muon_over_electron']):.6f} and "
            f"τ/e = {float(shape['tau_over_electron']):.6f}. The comparison-only muon residual is "
            f"+{float(shape['comparison_only']['relative_residual_ppm']):.5f} ppm. Two shape parameters "
            'have a nonsingular ratio Jacobian; common normalization cancels. Independence of the two '
            'prepared cells fixes the phase 2/9. No phase or round count is fitted here. The mass-read '
            'double-load effect has trace 5/18, a common factor 5/4 above the separate native-pair effect; '
            'their ratios coincide. A physical pole-mass interpretation is an additional premise.'},
        'epochs': {'rows': rows,
            'description': 'A closed triangular cell has three bounded loads and two opposite face classes. '
                'Its 1,296-state kernel executes the native repair and acceptance rule, with all 7,776 '
                'attempted records retained. This is a declared finite cell, with no abundance transfer to the full federation.',
            'finding': f"For independent uniform initial loads in 0–5 and initial flux zero, the exact persistent occupied-face share is {epochs['persistent_occupied_face_share']['exact_limit']['exact']} "
                f"({100*epochs['persistent_occupied_face_share']['exact_limit']['value']:.8f}%). The 128-attempt "
                f"bracket width is approximately {epochs['persistent_occupied_face_share']['width']['value']:.4g}. "
                'For every initial distribution, unresolved probability is at most 25^(−floor(n/32)). '
                'The cost is nonincreasing on every branch; it has no physical temperature or energy calibration.'},
        'symmetry': {'rows': [{'x': r['attempts'], 'single': r['single_history_odd_counts'][0],
                              'paired': r['paired_mean_odd_counts'][0]} for r in native['curve']],
            'finding': f"The solid curve is the class-1 minus class-5 count in one native history on {native['faces']} faces. "
                'The dashed curve is its exact paired mean with the conjugated history. The theorem covers '
                'all finite attempt counts under the stated symmetry premises.'},
        'hadron': {'rows': mass_rows, 'finding':
            f"The paired contrast (mN − mρ)/√σ is {contrast['value']:.6f} ± {contrast['stat']:.6f} statistically. "
            f"Discarding covariance gives {contrast['independent_stat_control']:.6f} for that error. "
            'The common scale cancels from mN/mρ in every replica. These one-spacing quenched results '
            'do not bound quenching, volume or continuum effects; the contrast has no fit-systematic allowance.'},
        'crossover': {'finding': f"At matched physical size Lg₃² = 8, the linear cutoff fit gives "
            f"{linear['value']:.4f} ± {linear['stat']:.4f} GeV statistically. The finite-design displacement "
            f"across fit variants reaches {cutoff['sensitivity_envelope']:.4f} GeV. A three-point linear-plus-quadratic "
            'fit has zero residual degrees of freedom. This sensitivity is separate from the declared reduction '
            'uncertainty and is not a controlled continuum or infinite-volume error bound.'},
        'repair': {'finding': f"A known binary preparation and complete addressed current records reconstruct "
            f"the pair distance using a seven-bit tracked-state index. Exact quotient powers reach 1% total-variation "
            f"accuracy after {repair['one_percent_relaxation']['attempts']} attempts for every initial distance law. "
            f"The bounded controller uses at most {memory['retained_register_bits_upper']} retained logical bits, "
            f"or {memory['total_including_incoming_packet_bits_upper']} including the incoming packet. "
            'Missing, incompatible or out-of-order records halt inference. The source halts at tape capacity. '
            'Preparation, scheduler, program storage and physical implementation are explicit separate inputs.'},
    }


def sync(site, *, rer=RER, check=False):
    site, rer = Path(site), Path(rer)
    receipts, sources, writes = {}, [], {}
    for key, (relative, label) in SOURCES.items():
        path = rer / 'model' / relative
        receipts[key] = load_receipt(path, rer)
        raw = path.read_bytes()
        sources.append({'file': key+'.json', 'label': label, 'path': 'model/'+relative,
                        'sha256': hashlib.sha256(raw).hexdigest()})
        writes['finite/'+key+'.json'] = raw
    writes['finite/results.json'] = (json.dumps(projection(receipts, sources), indent=2, ensure_ascii=False)+'\n').encode()
    for name in ('finite_results.html', 'finite_results.css', 'finite_results.mjs'):
        writes[name] = (EXTRA / name).read_bytes()
    links = (site / 'links.js').read_text()
    row = "  ['Finite predictions and error bounds', './finite_results.html'],\n"
    if row not in links:
        anchor = 'export const PAPERS = [\n'
        if links.count(anchor) != 1:
            raise ValueError('expected one papers-menu anchor')
        links = links.replace(anchor, anchor+row)
    writes['links.js'] = links.encode()
    for name, raw in writes.items():
        target = site / name
        if check:
            if not target.exists() or target.read_bytes() != raw:
                raise ValueError(f'stale finite-result projection: {target}')
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(raw)
    return sorted(writes)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, default=ROOT/'site')
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    print('\n'.join(sync(args.site, check=args.check)))
