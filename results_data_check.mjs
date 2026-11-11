// Checks results_data.js, the data of the Results board, against its sources. Run: node results_data_check.mjs
// Sources on this machine: the theory working area (reports), the public theory repository (certificates), the run
// L6, the research files of the viewer, and the couplings engine of the site. A source that is absent prints SKIP.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as D from './results_data.js';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const META = '/Users/muellerberndt/Projects/oph-meta';
const RL = META + '/repair-law', RER = META + '/reverse-engineering-reality', DER = META + '/oph-particles-model/derivations', RUN = META + '/oph-physics-sim/runs/universe/L6';
const text = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);
const json = (p) => { const t = text(p); return t === null ? null : JSON.parse(t); };
let passed = 0, skipped = 0;
const ok = (name) => { passed++; console.log('PASS: ' + name); };
const skip = (name) => { skipped++; console.log('SKIP: ' + name); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;

// ---------------------------------------------------------------- the register and its comparisons
{
  const R = D.register();
  assert.ok(near(R.y[0], 0.2096935560, 5e-11) && near(R.y[2], 0.0124683656, 5e-11) && near(R.y[1], 0.0000603006, 5e-11));
  assert.ok(near(R.sum, 2 / 9, 1e-15) && near(R.Q, 2 / 3, 1e-14));
  assert.equal(R.mu_e.toFixed(6), '206.770316'); assert.equal(R.tau_e.toFixed(4), '3477.4728'); assert.equal(R.tau_mu.toFixed(6), '16.818047');
  ok('register: rates 0.2096935560, 0.0124683656, 0.0000603006, sum 2/9, Q = 2/3, ratios 206.770316, 3477.4728, 16.818047');
  const M = D.derivedMeasured();
  assert.equal(M.tau_e.text, '3477.365(176)'); assert.equal(M.tau_mu.text, '16.817692(852)'); assert.equal(M.koide.text, '0.6666645(51)');
  assert.equal(M.nucleon.text, '0.93892'); assert.equal(M.n_rho.text, '1.2111(4)');
  ok('measured values that follow from CODATA and PDG: 3477.365(176), 16.817692(852), 0.6666645(51), nucleon 0.93892 GeV, m_N/m_rho 1.2111(4)');
  const B = D.board({}), row = (id) => B.groups.flatMap((g) => g.rows).find((r) => r.id === id);
  const dev = (id) => D.fmtDev(row(id).cmp.rel), sig = (id) => D.fmtSigma(row(id).cmp.sigma);
  assert.equal(dev('mu_e'), '+9.83 ppm'); assert.equal(sig('mu_e'), '442 σ');
  assert.equal(dev('tau_e'), '+30.9 ppm'); assert.equal(sig('tau_e'), '0.61 σ');
  assert.equal(dev('tau_mu'), '+21.1 ppm'); assert.equal(sig('tau_mu'), '0.42 σ');
  assert.equal(dev('koide'), '+3.30 ppm'); assert.equal(sig('koide'), '0.43 σ');
  assert.equal(row('m_mu').modelText, '105.659414'); assert.ok(near(row('m_mu').cmp.abs * 1000, 1.04, 0.005));
  assert.equal(row('m_tau').modelText, '1776.985'); assert.ok(near(row('m_tau').cmp.abs, 0.055, 0.0005));
  ok('lepton rows: +9.83 ppm (442 sigma), +30.9 ppm (0.61 sigma), +21.1 ppm (0.42 sigma), Koide +0.43 sigma, 105.659414 MeV (+1.04 keV), 1776.985 MeV (+0.055 MeV)');
  assert.equal(dev('v'), '+0.15 %'); assert.equal(dev('alpha_s'), '+0.29 %'); assert.equal(dev('sin2'), '−0.24 %'); assert.equal(dev('alpha_mz'), '+0.30 %');
  assert.equal(dev('alpha_0'), '−300 ppm'); assert.equal(dev('m_Z'), '+0.44 %'); assert.equal(dev('m_W'), '−488 ppm');
  assert.equal(D.fmtDev(row('sin2').second.cmp.rel), '−11.1 %'); assert.equal(D.fmtDev(row('v').second.cmp.rel), '+7.5 %'); assert.equal(D.fmtDev(row('alpha_s').second.cmp.rel), '−4.8 %');
  assert.equal(D.fmtDev(row('mu_e').second.cmp.rel), '+0.58 ppm');
  assert.equal(D.fmtPct(row('m_H').range[0].rel), '−0.07'); assert.equal(D.fmtPct(row('m_H').range[1].rel), '+0.71');
  ok('chain rows: v +0.15 %, alpha_s +0.29 %, sin2 -0.24 %, 1/alpha(m_Z) +0.30 %, 1/alpha(0) -300 ppm, m_Z +0.44 %, m_W -488 ppm; second readings -11.1 %, +7.5 %, -4.8 %, +0.58 ppm; Higgs range -0.07 to +0.71 %');
  for (const g of B.groups) for (const r of g.rows) { assert.ok(r.what && r.what.length > 20, 'what line of ' + r.id); assert.ok(r.text && r.name && r.sym, 'texts of ' + r.id); assert.ok(D.STATUS[r.status || g.status], 'status of ' + r.id); }
  assert.ok(row('mu_e').what.includes('These are not yet the measured rest masses') && row('mu_e').what.includes('What is compared is the dimensionless ratio.'));
  assert.ok(row('sin2').what.includes('Declared forms that fit; their derivation is open.'));
  assert.deepEqual(Object.keys(D.STATUS), ['derived', 'conditional', 'declared', 'open']);
  assert.ok(!B.groups.flatMap((g) => g.rows).some((r) => r.id === 'nucleon'), 'no row with an imported coefficient');
  ok('every row has its line "what this is", its long text and a status of the four-word vocabulary; no row needs an imported coefficient');
  const all = B.groups.flatMap((g) => g.rows);
  assert.deepEqual(all.slice(0, 2).map((r) => r.id + ':' + !!r.hero), ['mu_e:true', 'tau_e:true']);
  assert.deepEqual(all.filter((r) => r.incomplete).map((r) => r.id), ['m_mu', 'm_tau', 'm_Z', 'm_W', 'm_H']);
  assert.ok(all.filter((r) => r.incomplete).every((r) => r.incomplete.length > 40 && /\.$/.test(r.incomplete)));
  assert.equal(D.INCOMPLETE_LABEL, 'derivation incomplete'); assert.equal(D.PLACEHOLDER_LABEL, 'placeholder data, run in progress');
  assert.ok(!JSON.stringify(B).includes('imported') || !Object.keys(D.STATUS).includes('imported'));
  ok('the two lepton ratios are the first rows and the largest; the absolute lepton masses, W, Z and the Higgs carry "derivation incomplete"');
}

// ---------------------------------------------------------------- formats and the axis
{
  assert.equal(D.axisX(1e-7).x, 0); assert.equal(D.axisX(1).x, 1); assert.ok(near(D.axisX(9.834e-6).x, (Math.log10(9.834e-6) + 7) / 7, 1e-12));
  assert.ok(D.axisX(2e-8).under && D.axisX(3).over && D.axisX(0).under);
  assert.equal(D.fmtDev(9.834e-6), '+9.83 ppm'); assert.equal(D.fmtDev(-0.002378), '−0.24 %'); assert.equal(D.fmtDev(0.0748), '+7.5 %'); assert.equal(D.fmtDev(-2.99e-4), '−299 ppm');
  assert.equal(D.fmtSigma(1952341), '2.0 × 10<sup>6</sup> σ'); assert.equal(D.fmtSigma(13.75), '13.8 σ'); assert.equal(D.paren(0.93333, 0.04658, 3), '0.933(47)');
  assert.equal(D.signed('1/6'), '+1/6'); assert.equal(D.signed('-1/3'), '−1/3'); assert.equal(D.signed('0'), '0'); assert.equal(D.signed('±1, 0'), '±1, 0');
  assert.equal(D.TICKS.length, 8);
  ok('axis from 0.1 ppm to 100 percent and the number formats');
}

// ---------------------------------------------------------------- model values against the reports they are typed from
{
  const need = [
    ['COUPLING_FIX.md', ['24.3166', '2.4736e16', '246.60', '0.11834', '0.23074', '128.308', '91.588, 80.330']],
    ['reports/CA_ANCHOR.md', ['136.995']], ['reports/MAUD.md', ['136.994835']],
    ['reports/CH_HYPERCHARGE.md', ['(81/10, 5/6, -3)', '0.2056', '0.1123', '222.9', '24.822']],
    ['reports/CU_UNIFICATION.md', ['264.63', '1.7853e16', '24.2716']],
    ['reports/UH.md', ['125.04', '126.02', '172.1']], ['reports/LD.md', ['+0.578', '+0.626']],
    ['LEPTON_STEPS.md', ['206.770316', '3477.4728', '16.818047', '0.010816', '105.659414', '1776.985']],
    ['reports/LV.md', ['8.6e31']], ['SPECTRUM.md', ['all 30 readings']], ['reports/CQ.md', ['-0.93%', 'within 2%']],
  ];
  let all = true;
  for (const [file, strings] of need) {
    const t = text(RL + '/' + file);
    if (t === null) { all = false; skip('report ' + file + ' is not on this machine'); continue; }
    for (const s of strings) assert.ok(t.includes(s), `${file} does not contain ${s}`);
  }
  assert.equal(D.CHAIN.alphaU_inv, 24.3166); assert.equal(D.CHAIN.v, 246.60); assert.equal(D.CHAIN.alpha_s, 0.11834); assert.equal(D.CHAIN.sin2, 0.23074);
  assert.equal(D.CHAIN.alpha_mz_inv, 128.308); assert.equal(D.CHAIN.m_Z, 91.588); assert.equal(D.CHAIN.m_W, 80.330); assert.equal(D.CHAIN.alpha0_inv.toFixed(3), '136.995');
  assert.equal(D.SOURCE_BUILT.sin2, 0.2056); assert.equal(D.SOURCE_BUILT.alpha_s, 0.1123); assert.equal(D.STACK_FORM.v, 264.63);
  assert.equal(D.HIGGS.lo, 125.04); assert.equal(D.HIGGS.hi, 126.02); assert.equal(D.MUON_RESIDUAL.R2, 0.578); assert.equal(D.NEEDED.y_J, 0.010816);
  if (all) ok('every typed model value stands in the report it is typed from'); else ok('typed model values equal the constants of the brief; some reports were skipped');
}

// ---------------------------------------------------------------- the couplings engine of the site gives the same chain
{
  let E = null; try { E = await import('./couplings_chain.js'); } catch (e) { E = null; }
  if (!E || !E.variant) skip('couplings_chain.js is not present');
  else {
    const d = E.variant('declared'), s = E.variant('source'), k = E.variant('stack');
    assert.equal(d.x.toFixed(4), '24.3166'); assert.equal(d.v.toFixed(2), '246.60'); assert.equal(d.alphaS.toFixed(5), '0.11834'); assert.equal(d.sin2.toFixed(5), '0.23074');
    assert.equal(d.aemInv.toFixed(3), '128.308'); assert.equal(d.mZ.toFixed(3), '91.588'); assert.equal(d.mW.toFixed(3), '80.330'); assert.equal((d.MU / 1e16).toFixed(4), '2.4736');
    assert.equal(s.sin2.toFixed(4), '0.2056'); assert.equal(s.alphaS.toFixed(4), '0.1123'); assert.equal(s.v.toFixed(1), '222.9'); assert.equal(k.v.toFixed(2), '264.63');
    assert.equal(E.MEASURED.sin2.value, D.MEAS.sin2.v); assert.equal(E.MEASURED.aemInv.value, D.MEAS.alpha_mz.v); assert.equal(E.MEASURED.mZ.value, D.MEAS.m_Z.v);
    assert.equal(E.MEASURED.mW.value, D.MEAS.m_W.v); assert.equal(E.MEASURED.alphaS.value, D.MEAS.alpha_s.v); assert.equal(E.MEASURED.v.value, D.MEAS.v.v);
    ok('the couplings engine reproduces the declared chain, the source as built and the stack form, and uses the same measured values');
  }
}

// ---------------------------------------------------------------- the run L6
{
  const run = json(RUN + '/run.json'), cs = json(RUN + '/view/class_stats.json'), eu = json(RUN + '/view/early_universe.json');
  if (!run || !cs || !eu) skip('run L6 is not on this machine');
  else {
    const cons = (c) => { const [l, r] = c.split('->'); const side = (x) => x.replace(/\+/g, ' ').split(/\s+/).filter(Boolean).reduce((a, b) => a + parseInt(b, 10), 0) % 6; return side(l) === side(r); };
    const ev = (t) => Object.values(cs.tiers[t].channels).reduce((a, b) => a + b, 0), bad = (t) => Object.keys(cs.tiers[t].channels).filter((c) => !cons(c)).length;
    const ever = (t) => Object.values(cs.tiers[t].classes).reduce((a, c) => a + c.ever, 0);
    const F = D.RUN_L6;
    assert.equal(run.identities, F.identities); assert.equal(ever('screen') + ever('internal'), F.identities); assert.equal(run.geometry.carriers, F.carriers);
    assert.equal(Object.keys(cs.tiers.screen.channels).length, F.channels); assert.equal(Object.keys(cs.tiers.internal.channels).length, F.channels);
    assert.equal(ev('screen'), F.screen_events); assert.equal(ev('internal'), F.internal_events); assert.equal(bad('screen') + bad('internal'), F.violations);
    assert.equal(eu.class_violations.length, 0); assert.equal(eu.census.occupied_carriers, F.occupied); assert.equal(eu.census.not_neutral, F.not_neutral);
    assert.equal(eu.baryon_like['444'], F.t444); assert.equal(eu.baryon_like['222'], F.t222);
    const live = D.runFacts(eu, run.identities); assert.deepEqual({ ...live, poisson: 0 }, { ...F, poisson: 0 });
    ok('run L6: 786,662 identities, 57 reaction types, 32,800 + 514,363 events, 0 violations, 24,758 occupied carriers all neutral, 334 against 335 triples');
  }
}

// ---------------------------------------------------------------- certificates of the theory repository
{
  const c1 = json(RER + '/model/defect_particle_classes/results.json'), c2 = json(RER + '/model/lepton_register_round/results.json');
  if (!c1 || !c2) skip('the theory repository is not on this machine');
  else {
    const n = (c) => Object.values(c.checks).filter((v) => v === true).length;
    assert.equal(n(c1), 61); assert.equal(Object.keys(c1.checks).length, 61); assert.equal(n(c2), 99); assert.equal(Object.keys(c2.checks).length, 99);
    assert.equal(c1.central_flux_costs['3'].beta, '4'); assert.equal(c1.central_flux_costs['1'].beta, '12/5'); assert.equal(c1.central_flux_costs['2'].beta, '3');
    ok('certificates: 61 of 61 and 80 of 99 checks pass; flux costs 12/5, 3, 4');
    // the matrix against the certificate, state by state
    const mx = D.matrix(null), cell = (r, c) => mx.rows.find((x) => x.id === r).cells.find((x) => x.col === c).text;
    for (const col of mx.cols.filter((x) => x.stat === 'fermion')) {
      const ps = c1.patterns.filter((p) => p.name === col.id); assert.equal(ps.length, col.n, 'states of ' + col.id);
      for (const p of ps) { assert.equal(D.signed(p.Y), cell('Y', col.id)); assert.equal(D.signed(p.T3), cell('T3', col.id)); assert.equal(D.signed(p.Q), cell('Q', col.id)); assert.equal(String(p.k), cell('k', col.id)); }
      const f = c1.fields.find((x) => x.name === (col.id === 'u_L' || col.id === 'd_L' ? 'Q' : col.id === 'nu_L' || col.id === 'e_L' ? 'L' : col.id));
      assert.ok(f, 'field of ' + col.id); assert.equal(f.su3, cell('su3', col.id)); assert.equal(f.su2, cell('su2', col.id));
    }
    ok('matrix: colour, weak, Y, T3, Q and class of the eight matter states equal the certificate on every pattern');
  }
}

// ---------------------------------------------------------------- the decoder file and the matrix
{
  const pd = json(HERE + 'rl/PD/decoder.json');
  if (!pd) skip('rl/PD/decoder.json is not present');
  else {
    const a = D.matrix(pd), b = D.matrix(null);
    assert.equal(a.source, 'file'); assert.equal(b.source, 'embedded'); assert.equal(a.cols.length, 12); assert.equal(a.rows.length, 9);
    a.rows.forEach((r, i) => r.cells.forEach((x, j) => { assert.equal(x.text, b.rows[i].cells[j].text, `${r.id} of ${x.col}`); assert.equal(x.given, b.rows[i].cells[j].given); }));
    assert.equal(a.cells, 108); assert.equal(a.exact, 88); assert.equal(a.given, 20);
    for (const p of pd.patterns) { const [n, d] = String(p.Q).split('/').map(Number), [a3, b3] = String(p.T3).split('/').map(Number), [ay, by] = String(p.Y).split('/').map(Number); assert.ok(near(n / (d || 1), a3 / (b3 || 1) + ay / (by || 1), 1e-12), 'Q = T3 + Y on ' + p.bits); assert.equal(((p.six_Y % 6) + 6) % 6, p.k); }
    const W = pd.bosons.currents.filter((c) => /^W/.test(c.boson)), g = pd.bosons.currents.filter((c) => c.boson === 'gluon'), Bc = pd.bosons.currents.filter((c) => c.boson === 'B');
    assert.equal(g.length, 8); assert.equal(W.length, 3); assert.equal(Bc.length, 1);
    assert.deepEqual(W.map((c) => c.dT3).sort(), ['-1', '0', '1']); assert.deepEqual(W.map((c) => c.dQ).sort(), ['-1', '0', '1']); assert.ok(g.concat(Bc).every((c) => c.dT3 === '0' && c.dQ === '0'));
    assert.deepEqual(pd.bosons.higgs.components.map((c) => c.Q), ['1', '0']); assert.equal(D.matrix({ ...pd, placeholder: true }).source, 'embedded');
    ok('matrix: the decoder file and the embedded table agree in all 108 cells; Q = T3 + Y and k = 6Y mod 6 on all 32 patterns; 8 gluons, 3 W, 1 B');
  }
}

// ---------------------------------------------------------------- the lane readers
{
  const ph = { placeholder: true, oph: { T_c_GeV: 160 }, scale: { T_pc_MeV: 157, route_computed: true }, ratios: [{ name: 'm_N/m_rho', value: 1.37 }], GeV: [{ name: 'nucleon', value: 0.95, route_computed: true }], statements: [{ text: 'x', label: 'PLACEHOLDER' }] };
  assert.equal(D.electroweak(ph).state, 'placeholder'); assert.equal(D.electroweak(ph).value, undefined);
  assert.equal(D.colour(ph).state, 'placeholder'); assert.equal(D.colour(ph).value, undefined);
  assert.equal(D.hadron('ratio', ph).state, 'placeholder'); assert.equal(D.hadron('GeV', ph).state, 'placeholder'); assert.equal(D.laneCard(ph).statements.length, 0);
  for (const f of [null, undefined, {}, { oph: { T_c_GeV: 0 } }, { scale: {} }]) { assert.equal(D.electroweak(f).state, 'missing'); assert.equal(D.colour(f).state, 'missing'); assert.equal(D.hadron('ratio', f).state, 'missing'); }
  const e = D.electroweak({ oph: { T_c_GeV: 161.2, T_c_err: 1.9, reference: { T_c_GeV: 159.5, err: 1.5, cite: 'c' } } });
  assert.equal(e.state, 'ok'); assert.equal(e.value, 161.2); assert.equal(e.ref.v, 159.5);
  assert.equal(D.colour({ scale: { T_pc_MeV: 157, T_pc_err: 6 } }).state, 'missing');                              // no route marked as computed, no order on file
  assert.equal(D.colour({ scale: { T_pc_MeV: 157 }, su3: { order: 'first', Tc_over_sqrt_sigma: 0.63 } }).state, 'order');
  const q = D.colour({ scale: { T_pc_MeV: 157, route_computed: false }, su3: { chi_max_scaling: { exponent: 2.502, exponent_err: 0.042, first_order_value: 3 }, beta_c: 5.68974, beta_c_err: 0.00048, N_t: 4 }, string_tension: { Tc_over_sqrt_sigma_lower_estimate: [0.5589, 0.01846] } });
  assert.equal(q.state, 'order'); assert.equal(q.value, undefined); assert.deepEqual(q.exponent, [2.502, 0.042, 3]); assert.deepEqual(q.tcLower, [0.5589, 0.01846]);
  const qr = D.board({ qcd: { scale: { T_pc_MeV: 157, route_computed: false }, su3: { chi_max_scaling: { exponent: 2.502, exponent_err: 0.042, first_order_value: 3 } }, string_tension: { Tc_over_sqrt_sigma_lower_estimate: [0.5589, 0.01846] } } }).groups.find((g) => g.id === 'lattice').rows.find((r) => r.id === 'qcd');
  assert.ok(qr.cmp === null && qr.modelText === '' && !/157/.test(qr.none) && qr.none.includes('2.50(4)') && qr.none.includes('≥ 0.559(18)'));
  const c = D.colour({ scale: { T_pc_MeV: 157, T_pc_err: 6, route_computed: true } }); assert.equal(c.state, 'ok'); assert.equal(c.value, 157); assert.equal(c.ref.v, 156.5);
  assert.equal(D.hadron('ratio', { ratios: [{ name: 'm_N / m_rho', value: 1.33, err: 0.06 }] }).value, 1.33);
  assert.equal(D.hadron('GeV', { GeV: [{ name: 'nucleon', value: 0.95, route: 'r' }] }).state, 'missing');           // a GeV value only with a computed route
  assert.equal(D.hadron('GeV', { GeV: [{ name: 'nucleon', value: 0.95, route_computed: true }] }).state, 'ok');
  const rows = (live) => D.board(live).groups.find((g) => g.id === 'lattice').rows.map((r) => r.id + ':' + r.state + ':' + (r.cmp ? 'mark' : 'none'));
  assert.deepEqual(rows({ ew: ph, qcd: ph, had: ph }), ['ew:placeholder:none', 'qcd:placeholder:none', 'had_ratio:placeholder:none']);
  assert.deepEqual(rows({}), ['ew:missing:none', 'qcd:missing:none', 'had_ratio:missing:none']);
  for (const r of D.board({ ew: ph, qcd: ph, had: ph }).groups.find((g) => g.id === 'lattice').rows) assert.equal(r.modelText, '', 'a placeholder shows no number');
  ok('lane files: a placeholder shows no number and no mark; a missing file is a run in progress; MeV and GeV values need a computed route');
  for (const [name, file, f] of [['EW', 'rl/EW/ew_transition.json', D.electroweak], ['QCD', 'rl/QCD/colour_transition.json', D.colour], ['HAD', 'rl/HAD/hadrons.json', (x) => D.hadron('ratio', x)]]) {
    const j = json(HERE + file); if (!j) { skip(file + ' is not present'); continue; }
    console.log(`INFO: ${name} file on disk is ${j.placeholder === true ? 'a placeholder' : 'measured data'}; the row state is ${f(j).state}`);
  }
}

// ---------------------------------------------------------------- links and words
{
  const src = ['results_data.js', 'results.js', 'style/results.css', 'help/results.js'].map((f) => [f, text(HERE + f)]).filter(([, t]) => t !== null);
  for (const [f, t] of src) for (const bad of ['16.25', '16.2453', '10.03', '7e9', 'centre Z6', 'center Z6', 'Z6 centre', 'onest', '—']) assert.ok(!t.includes(bad), `${f} contains "${bad}"`);
  ok('no retired value, no "centre Z6", no em dash and no banned word in ' + src.map(([f]) => f).join(', '));
  const t = text(HERE + 'results_data.js'), paths = [...t.matchAll(/\['[^']+', '(RER|DER|SITE)', '([^']+)'\]/g)].map((m) => [m[1], m[2]]);
  const missing = [];
  for (const [base, p] of paths) {
    const at = base === 'RER' ? RER + '/' + p : base === 'DER' ? DER + '/' + p : p.startsWith('rl/') ? HERE + 'rl/' + p.slice(3) : p.startsWith('runs/L6/') ? RUN + '/' + p.slice(8) : HERE + p;
    if (!existsSync(at)) { if (base === 'DER') missing.push(p); else assert.fail(`${base} path ${p} does not exist`); }
  }
  ok(`${paths.length} link targets: every path of the theory repository and of the site exists`);
  console.log('INFO: derivation reports linked and not yet published: ' + (missing.length ? [...new Set(missing)].join(', ') : 'none'));
}
console.log(`\n${passed} checks passed, ${skipped} skipped`);
