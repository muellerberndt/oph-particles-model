"""Project the source-bound thermal diagnostics and qualify the viewer's comparison clocks.

The central value and labelled independence control are preserved. Covariance-compatible
statistical ranges, reduction allowance and finite-design sensitivity retain separate scopes.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_RECEIPT = ROOT.parent / 'reverse-engineering-reality/model/electroweak_crossover/results.json'
SOURCE = 'https://github.com/FloatingPragma/observer-patch-holography/blob/main/model/electroweak_crossover/'
CHANGED_PATHS = ('rl/EW/ew_transition.json', 'results_data.js', 'transitions.js', 'cosmos.js')
HEADLINE_FIELDS = ('T_c_GeV', 'T_c_err', 'T_c_err_lattice', 'T_c_err_reduction', 't_seconds', 'ticks')
ORIGINAL_STATEMENT = 'For the declared chain the electroweak transition is a crossover at T = 161.1 +- 0.1 (lattice) +- 1.6 (reduction) GeV.'

REWRITES = {
    'results_data.js': [
        ("what: WHAT.ew, keys: ['coupling']",
         "what: WHAT.ew + ' ' + str(file && file.oph && file.oph.scope_note), keys: ['coupling']"),
        ('The temperature of the electroweak crossover, computed on the lattice from the chain’s couplings. It is compared with the lattice value of the Standard Model.',
         'A conditional electroweak crossover temperature from a separate Euclidean lattice ensemble and an imported reduction map using the declared chain’s couplings. Statistical, reduction and cutoff sensitivity estimates have distinct scopes.'),
        ("text: 'The chain’s couplings and v enter the three-dimensional effective theory of the hot electroweak sector, which is simulated on the lattice. The reference is the lattice result for the Standard Model.'",
         "text: 'The chain’s declared couplings and v enter an imported three-dimensional effective theory simulated on the lattice. The Standard Model comparison is not blind. ' + str(file && file.oph && file.oph.scope_note)"),
        ("return { ...out, state: 'ok', value: b.T_c_GeV, err: pos(b.T_c_err) ? b.T_c_err : 0, kind: str(b.kind), status: str(file.status) };",
         "return { ...out, state: 'ok', value: b.T_c_GeV, err: pos(b.T_c_err) ? b.T_c_err : null, statisticalRange: b.T_c_err_lattice_range || null, unrestrictedRange: b.T_c_err_lattice_unrestricted_range || null, uncertaintyScope: str(b.statistical_error_scope), kind: str(b.kind), status: str(file.status) };"),
        ("return { ...row, model: t.value, sModel: t.err, modelText: t.err ? t.value.toFixed(1) + '(' + t.err.toFixed(1) + ')' : t.value.toFixed(1), cmp: compare(t.value, t.ref.v, t.ref.s, t.err), kind: t.kind };",
         "return { ...row, model: t.value, sModel: t.err, statisticalRange: t.statisticalRange, modelText: t.value.toFixed(2), cmp: { rel: t.value / t.ref.v - 1, abs: t.value - t.ref.v, sigma: null, relSigma: null }, kind: t.kind };"),
    ],
    'transitions.js': [
        ('<h2>The universe cools: three lattice measurements</h2>',
         '<h2>Thermal physics: three lattice comparisons</h2>'),
        ('<div class="ep-sub">Map into this step: ticks in the time direction are temperature, T = E<sub>cell</sub> / N<sub>t</sub>. The Higgs field switches on, colour is confined, and quarks bind.</div>',
         '<div class="ep-sub">Separate lattice ensembles compare electroweak crossover, colour confinement and hadron binding. Their temperature maps use imported thermal physics. T = E<sub>cell</sub> / N<sub>t</sub> is an imaginary-time relation with an assumed cell-energy scale; it does not identify the native attempted-event clock or derive a cooling history.</div>'),
        ('''<div class="ep-map">Map into this panel: ${fin(o.T_c_GeV) ? `at this temperature the time direction is ${esc(sci(E_CELL / o.T_c_GeV, 1))} ticks long, so` : 'the time direction is too long for a lattice of cells, so'} the hot plasma is measured in its three-dimensional lattice theory with the chain's couplings.</div>''',
         '''<div class="ep-map">Thermal comparison: a separate three-dimensional Euclidean lattice theory uses the declared chain's couplings and an imported dimensional-reduction map. ${fin(o.T_c_GeV) ? `The ratio E<sub>cell</sub>/T = ${esc(sci(E_CELL / o.T_c_GeV, 1))} expresses an imaginary-time thermal extent in an assumed cell-energy unit; it does not identify the native attempted-event clock.` : 'No native attempted-event clock is identified with a thermal time extent.'} ${esc(o.scope_note || '')}</div>'''),
        ('''fin(t) ? `after the first tick · ${NC(esc(fmtTicks(fin(o.ticks) ? o.ticks : t / TICK_S)))}` : 'cosmic time' ''',
         '''fin(t) ? `radiation-era comparison · ${NC(esc(fmtTicks(fin(o.ticks) ? o.ticks : t / TICK_S)))} in the assumed calibration` : 'radiation-era comparison time' '''),
    ],
    'cosmos.js': [
        ('The first cuts of the run: defects appear in pairs, everywhere on the screen at once. The map into this step reads ticks in the time direction as temperature.',
         'The first stored cuts retain native defect births and their class records. Their event counts have no derived temperature or physical-time calibration; lattice temperatures belong to separate comparison ensembles.'),
        ('This run is the first few hundred ticks, each 10<sup>−43</sup> s. The electroweak crossover comes about 10<sup>32</sup> ticks later, the binding of quarks into hadrons about 10<sup>38</sup> ticks later. No run at the resolution of one cell reaches them. Lattice ensembles do.',
         'This run records a finite number of native events. The timeline uses an imported radiation-era relation and an assumed cell-energy clock to place separate electroweak and hadron lattice comparisons. Those placements do not supply a cooling history, physical temperature or elapsed seconds for this run.'),
    ],
}
# The selected expression ends immediately before the stat call's closing parenthesis.
REWRITES['transitions.js'][-1] = tuple(value.rstrip() for value in REWRITES['transitions.js'][-1])


def remove_complete_lift_progress(source):
    blocks = list(re.finditer(r"export const FILES = \{(?P<body>.*?)\n\};", source, re.S))
    if len(blocks) != 1:
        raise ValueError('results_data.js: expected one FILES declaration')
    block = blocks[0]; body = block['body']
    if len(re.findall(r"\bil: '(?:\./|/)?rl/IL/il_census\.json'", body)) != 1:
        raise ValueError('results_data.js: completed integer-lift census route is absent')
    route = re.compile(r" ilp: '(?:\./|/)?rl/IL/progress\.json',")
    matches = list(route.finditer(body))
    if len(matches) > 1 or (not matches and re.search(r'\bilp\s*:', body)):
        raise ValueError('results_data.js: unrecognized integer-lift progress route')
    fresh = route.sub('', body)
    return source[:block.start('body')] + fresh + source[block.end('body'):]


def rewrite(source, name):
    """Replace each inspected anchor once, or recognize its single completed replacement."""
    for old, new in REWRITES[name]:
        counts = source.count(old), source.count(new)
        if counts == (1, 0):
            source = source.replace(old, new, 1)
        elif counts != (0, 1):
            raise ValueError(f'{name}: thermal scope anchor missing or duplicated ({counts})')
    return remove_complete_lift_progress(source) if name == 'results_data.js' else source


def load_receipt(path=DEFAULT_RECEIPT):
    path = Path(path)
    raw = path.read_bytes()
    receipt = json.loads(raw)
    if (receipt.get('schema') != 'oph.electroweak_crossover.v1'
            or receipt.get('all_checks_pass') is not True or not receipt.get('checks')
            or any(value is not True for value in receipt['checks'].values())):
        raise ValueError('thermal receipt must contain passing named checks')
    bindings = receipt.get('input_sha256', {})
    if not {'production.json', 'finite_size.py', 'certificate.py', 'reduction.py', 'comparison_budget.py'} <= set(bindings):
        raise ValueError('thermal receipt lacks required source bindings')
    base = path.parent.resolve()
    for name, digest in bindings.items():
        relative = Path(name)
        source = (base / relative).resolve()
        if (relative.is_absolute() or '..' in relative.parts or not source.is_relative_to(base)
                or not re.fullmatch(r'[0-9a-f]{64}', digest)
                or hashlib.sha256(source.read_bytes()).hexdigest() != digest):
            raise ValueError(f'thermal receipt has a stale or invalid source binding: {name}')
    budget = receipt.get('comparison_budget', {})
    if (budget.get('schema') != 'oph.electroweak_comparison_budget.v1'
            or budget.get('all_checks_pass') is not True or not budget.get('checks')
            or any(value is not True for value in budget['checks'].values())
            or any(bindings.get(k) != v for k,v in budget.get('input_sha256', {}).items())
            or json.loads((base / 'comparison_budget.json').read_text()) != budget):
        raise ValueError('thermal covariance budget is absent, failed or differs from its receipt')
    row, linear = receipt['rows']['declared'], budget['rows']['declared']
    if (row['T_c_err_lattice'] is not None or row['T_c_err_total'] is not None
            or receipt['comparison_not_blind']['pull'] is not None
            or row['T_c_err_lattice_range'] != linear['independent_run_sets']['sd_range_GeV']
            or row['T_c_err_lattice_unrestricted_range'] != linear['unrestricted_cross_set_covariance']['sd_range_GeV']):
        raise ValueError('thermal covariance uncertainty contract differs')
    diagnostic = receipt['finite_size_cutoff']['matched_size_cutoff']['T_max']
    if (len(diagnostic['variants']) != 6 or len(diagnostic['points']) != 3
            or {p['size'] for p in diagnostic['points']} != {8.0}
            or not math.isfinite(diagnostic['sensitivity_envelope']) or diagnostic['sensitivity_envelope'] < 0):
        raise ValueError('thermal cutoff diagnostic differs from its declared comparison domain')
    return receipt, hashlib.sha256(raw).hexdigest()


def project(viewer, receipt, digest):
    out = json.loads(json.dumps(viewer))
    if out.get('lane') != 'EW' or out.get('oph', {}).get('kind') != 'crossover':
        raise ValueError('thermal projection requires the declared EW crossover')
    o = out['oph']
    active = {key: o[key] for key in HEADLINE_FIELDS}
    retained = o.get('retained_headline', active)
    expected = receipt['rows']['declared']
    if (set(retained) != set(HEADLINE_FIELDS)
            or any(type(retained[k]) not in (int, float) or not math.isfinite(retained[k]) for k in HEADLINE_FIELDS)
            or abs(retained['T_c_GeV'] - expected['T_c']) > .01
            or abs(retained['T_c_err_lattice'] - expected['T_c_err_lattice_independence_control']) > .01
            or abs(retained['T_c_err_reduction'] - expected['truncation_error']) > .02
            or abs(retained['T_c_err'] - expected['T_c_err_total_independence_control']) > .03):
        raise ValueError('retained viewer headline is not the rounded independence control')
    for key in HEADLINE_FIELDS:
        permitted = (retained[key], None) if key in ('T_c_err', 'T_c_err_lattice') else (retained[key],)
        if active[key] not in permitted:
            raise ValueError('retained thermal headline was changed after projection')
    o['retained_headline'] = retained
    o['retained_headline_scope'] = ('Rounded independence calculation control. Its statistical error and combined error '
                                    'are not the identified uncertainty of the covariance-aware comparison.')
    o['T_c_err'] = None
    o['T_c_err_lattice'] = None
    o['T_c_err_lattice_range'] = expected['T_c_err_lattice_range']
    o['T_c_err_lattice_unrestricted_range'] = expected['T_c_err_lattice_unrestricted_range']
    o['statistical_error_scope'] = expected['statistical_error_scope']
    o['reduction_allowance_GeV'] = expected['truncation_error']
    o['reduction_allowance_scope'] = expected['reduction_allowance_scope']
    sensitivity = receipt['finite_size_cutoff']['matched_size_cutoff']['T_max']['sensitivity_envelope']
    lo, hi = o['T_c_err_lattice_range']
    ulo, uhi = o['T_c_err_lattice_unrestricted_range']
    note = (f"The conditional crossover is {o['T_c_GeV']:.2f} GeV. Its linearized statistical SD lies in "
            f"[{lo:.3f}, {hi:.3f}] GeV if separately simulated run sets are independent; "
            f"allowing all cross-set covariance gives [{ulo:.3f}, {uhi:.3f}] GeV. "
            'The paired reference-peak covariance is unretained. '
            f"The one-percent reduction allowance {o['reduction_allowance_GeV']:.3f} GeV and matched-volume "
            f"cutoff sensitivity {sensitivity:.3f} GeV are separate. "
            'These quantities are not confidence intervals, a combined significance, or bounds on omitted cutoff powers and infinite volume.')
    legacy_note = (f"The retained {retained['T_c_GeV']:.2f} GeV headline has statistical error {retained['T_c_err_lattice']:.2f} GeV "
                   f"within the declared joint cutoff/size fit and reduction estimate {retained['T_c_err_reduction']:.1f} GeV. "
                   f"A separate matched-volume cutoff comparison has {sensitivity:.3f} GeV finite-design sensitivity. "
                   'These estimates do not bound omitted cutoff powers or the infinite-volume limit.')
    o['scope_note'] = note
    out['comparison_budget'] = receipt['comparison_budget']
    variants = o.get('variants', [])
    if {v.get('id') for v in variants} != {'one_doublet_A', 'one_doublet_B', 'standard_model'} or len(variants) != 3:
        raise ValueError('thermal map variants differ from the declared comparison domain')
    for variant in variants:
        row = receipt['rows'][variant['id']]
        fields = ('T_c_GeV', 'T_c_err', 'T_c_err_lattice')
        control = variant.get('retained_headline', {k:variant[k] for k in fields})
        if (set(control) != set(fields)
                or any(type(control[k]) not in (int,float) or not math.isfinite(control[k]) for k in fields)
                or abs(control['T_c_GeV']-row['T_c']) > .01
                or abs(control['T_c_err_lattice']-row['T_c_err_lattice_independence_control']) > .01
                or abs(control['T_c_err']-row['T_c_err_total_independence_control']) > .06):
            raise ValueError('thermal variant control differs from its rounded canonical value')
        if (variant['T_c_GeV'] != control['T_c_GeV']
                or any(variant[k] not in (control[k],None) for k in fields[1:])):
            raise ValueError('thermal variant headline changed after projection')
        variant['retained_headline'] = control
        variant['retained_headline_scope'] = o['retained_headline_scope']
        variant['T_c_err'] = None
        variant['T_c_err_lattice'] = None
        variant['T_c_err_lattice_range'] = row['T_c_err_lattice_range']
        variant['T_c_err_lattice_unrestricted_range'] = row['T_c_err_lattice_unrestricted_range']
        variant['statistical_error_scope'] = row['statistical_error_scope']
        variant['reduction_allowance_GeV'] = row['truncation_error']
        variant['reduction_allowance_scope'] = row['reduction_allowance_scope']
    o['clock_scope'] = ('Seconds use an imported radiation-dominated Friedmann relation with g*=106.75. '
                        'Tick labels additionally assume hbar/E_cell per tick; no native clock transfer is proved.')
    out['finite_size_cutoff'] = receipt['finite_size_cutoff']
    out['analysis_source'] = dict(url=SOURCE + 'results.json', sha256=digest, proof=SOURCE + 'PROOF.md',
                                  replay='python -m model.electroweak_crossover --check')
    statement = out['statements'][0]
    if statement['text'] not in (ORIGINAL_STATEMENT, legacy_note, note):
        raise ValueError('thermal headline statement anchor differs')
    if 'retained_statement' in out and out['retained_statement'] != ORIGINAL_STATEMENT:
        raise ValueError('retained thermal statement differs')
    out['retained_statement'] = ORIGINAL_STATEMENT
    statement['text'] = note
    return out


def sync(site, receipt=DEFAULT_RECEIPT):
    """Validate all inputs and anchors before writing any of the four projected files."""
    site = Path(site)
    value, digest = load_receipt(receipt)
    thermal = site / CHANGED_PATHS[0]
    projected = project(json.loads(thermal.read_text()), value, digest)
    outputs = {thermal: json.dumps(projected, indent=2, ensure_ascii=False) + '\n'}
    outputs.update({site / name: rewrite((site / name).read_text(), name) for name in REWRITES})
    for path, text in outputs.items():
        path.write_text(text)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, required=True)
    parser.add_argument('--receipt', type=Path, default=DEFAULT_RECEIPT)
    args = parser.parse_args()
    sync(args.site, args.receipt)
