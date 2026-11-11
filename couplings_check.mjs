// Node check of the coupling chain (couplings_chain.js): node couplings_check.mjs
// Every reference number below is copied from the file named beside it. A computed value passes when it rounds to the
// printed digits of the reference. Sources, all in the theory working area repair-law/:
//   work/COUPLING/closure_check.out, closure_variants.out      the reference implementation of the chain
//   COUPLING_FIX.md section 3                                  the slope table
//   reports/CH_HYPERCHARGE.md, table "Outputs per variant"
//   reports/CU_UNIFICATION.md, table "Chain outputs of the derived variants"
//   reports/CA_ANCHOR.md                                       the anchor in the chain's variables
// and in the public theory repository: model/defect_particle_classes/results.json (flux costs) and
// extra/fine_structure_constant_derivation.tex (the outer fixed point of the pixel ratio).
import { E_STAR, PHI, P_FIXED, SLOPES, VARIANTS, MEASURED, censusSlopes, chainAt, ell2, ell3, fluxClasses, frac, fstr, fval, measuredCouplings,
  pixelFixedPoint, ratioOf, readAt, runInverse, setup, slopeRatio, solveChain, thomsonTransport, variant } from './couplings_chain.js';

let fails = 0, count = 0;
function ok(name, cond, detail = '') { count++; if (!cond) fails++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`); }
// a value against a printed reference: fixed decimals as printed, or the printed mantissa digits for an exponent form
function printedAs(value, printed) {
  const e = /^(-?\d+(?:\.(\d+))?)e([+-]?\d+)$/.exec(printed);
  if (e) { const [m, x] = value.toExponential((e[2] || '').length).split('e'); return m === e[1] && Number(x) === Number(e[3]); }
  return value.toFixed((printed.split('.')[1] || '').length) === printed;
}
// the reference cell is the rounding of an already rounded print (one decimal more) of the value
function doubleRounded(value, printed) {
  const d = (printed.split('.')[1] || '').length, once = value.toFixed(d + 1);
  return /5$/.test(once) && (Number(once.slice(0, -1)) + Math.pow(10, -d)).toFixed(d) === printed;
}
function cells(row, list) {
  const bad = [], notes = [];
  for (const [name, value, printed] of list) {
    if (printedAs(value, printed)) continue;
    if (doubleRounded(value, printed)) { notes.push(`${name}: the table prints ${printed}, the chain value is ${value.toFixed(5)} (the table rounds an already rounded print)`); continue; }
    bad.push(`${name}: computed ${value}, reference ${printed}`);
  }
  ok(row, !bad.length, [...bad, ...notes].join('; ') || list.map(([n, , p]) => `${n} ${p}`).join(', '));
}
const one = (o) => { const r = solveChain(o); return r.length === 1 ? r[0] : null; };
const P = P_FIXED, decl = one({});

// ---------------------------------------------------------------- 1. the declared row
console.log('--- declared row (COUPLING_FIX.md section 2; closure_check.out, paper reading at mZ)');
cells('declared row', [['1/alpha_U', decl.x, '24.3166'], ['v', decl.v, '246.60'], ['1/alpha_2', decl.inv[1], '29.605'], ['alpha_s', decl.alphaS, '0.11834'],
  ['sin2', decl.sin2, '0.23074'], ['1/alpha_em', decl.aemInv, '128.31']]);
cells('closure_check.out, reading at mZ', [['1/alpha_U', decl.x, '24.3166'], ['M_U', decl.MU, '2.4736e+16'], ['v', decl.v, '246.597'], ['v/E*', decl.v / E_STAR, '2.0198e-17'],
  ['mZ', decl.mZ, '91.588'], ['mW', decl.mW, '80.330'], ['1/a1', decl.inv[0], '59.222'], ['1/a2', decl.inv[1], '29.605'], ['1/a3', decl.inv[2], '8.451'],
  ['sin2', decl.sin2, '0.23074'], ['1/a_em', decl.aemInv, '128.308'], ['alpha_s', decl.alphaS, '0.11834'], ['ell2', decl.ell2, '0.39488'], ['ell3', decl.ell3, '0.01286'], ['P/4', decl.target, '0.40774']]);
const mw = one({ read: 'mW' });
cells('closure_check.out, reading at mW', [['1/alpha_U', mw.x, '24.3332'], ['M_U', mw.MU, '2.4736e+16'], ['v', mw.v, '240.242'], ['v/E*', mw.v / E_STAR, '1.9678e-17'],
  ['mZ', mw.mZ, '89.148'], ['mW', mw.mW, '78.205'], ['1/a1', mw.inv[0], '59.404'], ['1/a2', mw.inv[1], '29.647'], ['1/a3', mw.inv[2], '8.392'],
  ['sin2', mw.sin2, '0.23044'], ['1/a_em', mw.aemInv, '128.654'], ['alpha_s', mw.alphaS, '0.11917'], ['ell2', mw.ell2, '0.39543'], ['ell3', mw.ell3, '0.01232']]);
ok('the closure holds at the root', Math.abs(decl.lhs - P / 4) < 1e-12, `left side ${decl.lhs.toFixed(12)}, P/4 ${(P / 4).toFixed(12)}`);
ok('the anchor is the fixed point mu = m_Z(mu)', Math.abs(decl.mu / decl.mZ - 1) < 1e-12, `mu = ${decl.mu.toFixed(6)} GeV`);
cells('CA_ANCHOR.md: the anchor in the chain\'s variables', [['mu_A/E*', decl.mu / E_STAR, '7.50177e-18'], ['ln(M_U/mu_A)', Math.log(decl.MU / decl.mu), '33.2297'],
  ['t1', 4 * Math.PI ** 2 / decl.inv[0], '0.66662'], ['t2', 4 * Math.PI ** 2 / decl.inv[1], '1.33349'], ['t3', 4 * Math.PI ** 2 / decl.inv[2], '4.67171']]);
// the left side along the chain's running (closure_check.out, last block): the closure selects one scale
const along = [[decl.MU, '24.317', '24.317', '0.87204'], [1e12, '25.927', '19.487', '0.69813'], [1e6, '28.125', '12.890', '0.47824'], [1e3, '29.225', '9.592', '0.41660'],
  [decl.mu, '29.605', '8.451', '0.40774'], [30, '29.783', '7.918', '0.40568']];
cells('closure_check.out: left side along the running', along.flatMap(([mu, a2, a3, l]) => { const r = readAt(decl, mu); const t = mu.toExponential(2);
  return [[`1/a2(${t})`, r.inv[1], a2], [`1/a3(${t})`, r.inv[2], a3], [`lhs(${t})`, r.lhs, l]]; }));
{ const i = runInverse(decl, decl.x, Math.log(decl.MU / decl.Ecell)), t = 4 * Math.PI ** 2;      // slopes extended above M_U, as the reference prints
  cells('closure_check.out: slopes extended to the cell', [['1/a2', i[1], '23.368'], ['1/a3', i[2], '27.161'], ['lhs', ell2(t / i[1]) + ell3(t / i[2]), '0.96856']]); }
ok('between M_U and the cell the chain holds the couplings', readAt(decl, decl.Ecell).inv.every((v) => Math.abs(v - decl.x) < 1e-12), `1/alpha(E_cell) = ${readAt(decl, decl.Ecell).inv[1].toFixed(4)}`);
cells('COUPLING_FIX.md: left side with the measured couplings 1/alpha_2 = 29.58, alpha_s = 0.1180 (not blind)', [['lhs', ell2(4 * Math.PI ** 2 / 29.58) + ell3(4 * Math.PI ** 2 * 0.1180), '0.407641'], ['P/4', P / 4, '0.407743']]);

// ---------------------------------------------------------------- 2. slope variants
console.log('--- closure_variants.out and COUPLING_FIX.md section 3');
const VAR = [
  ['(33/5, 1, -3)', SLOPES.declared, ['24.3166', '246.6', '91.59', '59.222', '29.605', '8.451', '0.23074', '128.308'], ['24.3166', '246.60', '29.605', '0.11834', '0.23074', '128.31']],
  ['(41/5, 1, -3)', SLOPES.two, ['24.3185', '245.9', '89.98', '67.709', '29.610', '8.444', '0.20785', '142.458'], ['24.3185', '245.9', '29.610', '0.11843', '0.20785', '142.46']],
  ['(81/10, 5/6, -3)', SLOPES.one, ['24.9510', '91.03', '33.3', '69.094', '29.492', '8.602', '0.20389', '144.648'], ['24.9510', '91.0', '29.492', '0.11625', '0.20389', '144.65']],
  ['(83/10, 7/6, -3)', SLOPES.three, ['23.7163', '633.1', '231.8', '66.385', '29.714', '8.294', '0.21170', '140.356'], ['23.7163', '633.1', '29.714', '0.12057', '0.21170', '140.36']],
];
for (const [name, slopes, a, b] of VAR) {
  const r = solveChain({ slopes }), s = r[0];
  ok(`slopes ${name}: one root`, r.length === 1);
  cells(`closure_variants.out ${name}`, [['1/aU', s.x, a[0]], ['v', s.v, a[1]], ['mZ', s.mZ, a[2]], ['1/a1', s.inv[0], a[3]], ['1/a2', s.inv[1], a[4]], ['1/a3', s.inv[2], a[5]], ['sin2', s.sin2, a[6]], ['1/aem', s.aemInv, a[7]]]);
  cells(`COUPLING_FIX.md table ${name}`, [['1/alpha_U', s.x, b[0]], ['v', s.v, b[1]], ['1/alpha_2', s.inv[1], b[2]], ['alpha_s', s.alphaS, b[3]], ['sin2', s.sin2, b[4]], ['1/alpha_em', s.aemInv, b[5]]]);
}
ok('Standard Model slopes (41/10, -19/6, -7): no root', solveChain({ slopes: SLOPES.standardModel }).length === 0);
ok('census slopes (8 + n/10, 2/3 + n/6, -3) for n = 0..3', [0, 1, 2, 3].map((n) => censusSlopes(n).map(fstr).join(' ')).join(' | ') === '8 2/3 -3 | 81/10 5/6 -3 | 41/5 1 -3 | 83/10 7/6 -3');

// ---------------------------------------------------------------- 3. CH's table "Outputs per variant"
console.log('--- reports/CH_HYPERCHARGE.md, table "Outputs per variant"');
const CH = [
  ['one doublet, m = 2, c_Y 5/3 (source as built)', { slopes: SLOPES.one, pref: 2 }, ['24.822', '222.9', '0.1123', '0.2056', '142.25']],
  ['one doublet, m = 2, c_Y 1', { slopes: SLOPES.one, pref: 2, cY: 1 }, ['24.819', '224.1', '0.1122', '0.2327', '125.64']],
  ['two doublets, m = 1, c_Y 5/3', { slopes: SLOPES.two }, ['24.319', '245.9', '0.1184', '0.2079', '142.46']],
  ['two doublets, m = 1, c_Y 1', { slopes: SLOPES.two, cY: 1 }, ['24.316', '246.7', '0.1183', '0.2346', '126.19']],
  ['no doublet below M_U, m = 2, c_Y 5/3', { slopes: SLOPES.none, pref: 2 }, ['25.457', '82.2', '0.1104', '0.2015', '144.40']],
  ['declared (33/5, 1, -3)', {}, ['24.317', '246.6', '0.1183', '0.2307', '128.31']],
];
for (const [name, o, p] of CH) {
  const s = one(o);
  if (!s) { ok(`CH ${name}`, false, 'no single root'); continue; }
  cells(`CH ${name}`, [['1/alpha_U', s.x, p[0]], ['v', s.v, p[1]], ['alpha_s', s.alphaS, p[2]], ['sin2', s.sin2, p[3]], ['1/alpha_em', s.aemInv, p[4]]]);
}
{ const s = one({ slopes: SLOPES.one, pref: 2 });
  cells('CH RESULT line: chain with LV\'s law (m = 2)', [['1/alpha_U', s.x, '24.822'], ['v', s.v, '222.9'], ['1/alpha_2', s.inv[1], '29.24'], ['alpha_s', s.alphaS, '0.1123'], ['sin2', s.sin2, '0.2056'], ['1/alpha_em', s.aemInv, '142.25']]); }

// ---------------------------------------------------------------- 4. CU's table "Chain outputs of the derived variants"
console.log('--- reports/CU_UNIFICATION.md, table "Chain outputs of the derived variants"');
const CU = [
  ['Stack, slopes (33/5, 1, -3)', { c: 0 }, ['1.7853e16', '24.2716', '264.63', '98.51', '29.497', '0.11633', '0.23148', '127.43']],
  ['Stack, source with two doublets', { c: 0, slopes: SLOPES.two }, ['1.7853e16', '24.2738', '263.74', '96.75', '29.502', '0.11642', '0.20863', '141.41']],
  ['Stack, one doublet, b m = 1', { c: 0, slopes: SLOPES.one }, ['1.7853e16', '24.8932', '99.68', '36.55', '29.379', '0.11436', '0.20468', '143.54']],
  ['Stack, one doublet, b m = 2', { c: 0, slopes: SLOPES.one, pref: 2 }, ['1.7853e16', '24.7540', '248.06', '91.47', '29.118', '0.11058', '0.20640', '141.07']],
  ['R = 2 pi with the anchor at P^(-2/3) m_Z', { c: 0, rho: Math.pow(P, -2 / 3) }, ['1.7853e16', '24.3166', '246.60', '91.59', '29.553', '0.11619', '0.23145', '127.69']],
];
for (const [name, o, p] of CU) {
  const s = one(o);
  if (!s) { ok(`CU ${name}`, false, 'no single root'); continue; }
  const r = readAt(s, s.mZ);                       // the couplings at m_Z (the reading point itself unless rho differs from 1)
  cells(`CU ${name}`, [['M_U', s.MU, p[0]], ['1/alpha_U', s.x, p[1]], ['v', s.v, p[2]], ['m_Z', s.mZ, p[3]], ['1/alpha_2', r.inv[1], p[4]], ['alpha_s', r.alphaS, p[5]], ['sin2', r.sin2, p[6]], ['1/alpha_em', r.aemInv, p[7]]]);
}
{ const s = one({ c: 0, rho: Math.pow(P, -2 / 3) });
  ok('CU G6: R = 2 pi read at P^(-2/3) m_Z gives the declared alpha_U, v, m_Z, m_W', Math.abs(s.x - decl.x) < 1e-10 && Math.abs(s.v / decl.v - 1) < 1e-10 && Math.abs(s.mZ / decl.mZ - 1) < 1e-10 && Math.abs(s.mW / decl.mW - 1) < 1e-10,
    `reading point ${s.mu.toFixed(1)} GeV`); }
cells('forms of M_U: R = ln(E_cell/M_U)', [['R declared', setup({}).R, '5.957'], ['R stack', setup({ c: 0 }).R, '6.283'], ['M_U declared', setup({}).MU, '2.4736e+16'], ['M_U stack', setup({ c: 0 }).MU, '1.7853e+16'], ['E_cell', setup({}).Ecell, '9.560e+18']]);

// ---------------------------------------------------------------- 5. the exact ratio test (CH)
console.log('--- the exact ratio (1/alpha_2 - 1/alpha_3)/(1/alpha_1 - 1/alpha_2) below M_U');
ok('declared slopes: (b2 - b3)/(b1 - b2) = 5/7', fstr(slopeRatio(SLOPES.declared)) === '5/7');
ok('source as built (81/10, 5/6, -3): (b2 - b3)/(b1 - b2) = 115/218', fstr(slopeRatio(SLOPES.one)) === '115/218');
ok('two doublets (41/5, 1, -3): (b2 - b3)/(b1 - b2) = 5/9', fstr(slopeRatio(SLOPES.two)) === '5/9');
{ // equal couplings at M_U and the slopes (81/10, 5/6, -3): the ratio at m_Z is 115/218 for every unified coupling and every M_U
  const b = SLOPES.one.map(fval), s = { b, cY: 5 / 3 }, target = 115 / 218;
  let worst = 0, n = 0;
  for (const x of [3, 8, 16, 24.3166, 24.951, 40, 80, 200]) for (const MU of [1e4, 1e8, 1e12, 1.7853e16, 2.4736e16, 1e19, 1e25]) for (const mu of [MEASURED.mZ.value, 33.3, 81.95, 1e3]) {
    if (mu >= MU) continue;
    worst = Math.max(worst, Math.abs(ratioOf(runInverse(s, x, Math.log(MU / mu))) - target)); n++;
  }
  ok('numerical: 115/218 at m_Z for every unified coupling and every M_U', worst < 1e-12, `${n} points, largest deviation ${worst.toExponential(1)}`);
  let w2 = 0;
  for (const o of [{ slopes: SLOPES.one }, { slopes: SLOPES.one, pref: 2 }, { slopes: SLOPES.one, c: 0 }, { slopes: SLOPES.one, c: 0, pref: 2 }, { slopes: SLOPES.one, read: 'mW' }]) w2 = Math.max(w2, Math.abs(ratioOf(one(o).inv) - target));
  ok('the solved chains with these slopes give 115/218 for every prefactor, M_U form and reading scale', w2 < 1e-12, `largest deviation ${w2.toExponential(1)}`);
  ok('the solved declared chain gives 5/7', Math.abs(ratioOf(decl.inv) - 5 / 7) < 1e-12);
  ok('a U(1) normalisation other than 5/3 changes the ratio (CH\'s second option)', Math.abs(ratioOf(one({ slopes: SLOPES.one, pref: 2, cY: 1 }).inv) - target) > 0.1);
}
{ const m = measuredCouplings();
  ok('measured ratio from the PDG 2024 couplings (not blind)', Math.abs(m.ratio - 0.718) < 0.0005, `${m.ratio.toFixed(4)} +- ${m.ratioErr.toFixed(4)}; inverse couplings at m_Z ${m.inv.map((v) => v.toFixed(3)).join(', ')}`);
  const old = measuredCouplings({ ...MEASURED, sin2: { value: 0.23122, err: 0.00004 }, aemInv: { value: 127.951, err: 0.009 } });
  ok('with the earlier inputs sin2 = 0.23122 and 1/alpha_em = 127.951 the ratio is CH\'s 0.717', old.ratio.toFixed(3) === '0.717', old.ratio.toFixed(4)); }

// ---------------------------------------------------------------- 6. flux classes
console.log('--- flux classes: counts 8 pi^2 / tr H_k^2 (model/defect_particle_classes/results.json, central_flux_costs)');
const REF_FLUX = { 0: ['0,0,0,0,0', '0', null], 1: ['-2/3,-2/3,-2/3,1,1', '10/3', '12/5'], 2: ['-4/3,2/3,2/3,0,0', '8/3', '3'], 3: ['0,0,0,-1,1', '2', '4'], 4: ['-2/3,-2/3,4/3,0,0', '8/3', '3'], 5: ['2/3,2/3,2/3,-1,-1', '10/3', '12/5'] };
const flux = fluxClasses();
for (const r of flux) {
  const [ph, tr, be] = REF_FLUX[r.k];
  ok(`class ${r.k}: shortest generator, trace and count`, r.phases.map(fstr).join(',') === ph && fstr(r.trace) === tr && (r.count ? fstr(r.count) : null) === be,
    `eigenphases/pi ${r.phases.map(fstr).join(',')}; tr H^2 = ${fstr(r.trace)} pi^2; count ${r.count ? fstr(r.count) : 'none'}`);
}
ok('counts for classes 1 to 5 are (12/5, 3, 4, 3, 12/5)', flux.slice(1).map((r) => fstr(r.count)).join(' ') === '12/5 3 4 3 12/5');
ok('only class 3 gives the 4 of v = E_cell exp(-2 pi/(4 alpha_U))', flux.filter((r) => r.count && fval(r.count) === 4).map((r) => r.k).join() === '3');
ok('exponent of v equals the plaquette action tr H_3^2 / g^2 of one class-3 flux', Math.abs(2 * Math.PI * decl.x / 4 - fval(flux[3].trace) * Math.PI ** 2 / (4 * Math.PI / decl.x)) < 1e-12,
  `2 pi/(4 alpha_U) = ${(2 * Math.PI * decl.x / 4).toFixed(4)}`);
cells('LV.md: v/E_cell at 1/alpha_U = 24.3166 with unit prefactor', [['v/E_cell', Math.exp(-2 * Math.PI * 24.3166 / 4), '2.5793e-17']]);

// ---------------------------------------------------------------- 7. the outer fixed point of the pixel ratio (paper)
console.log('--- extra/fine_structure_constant_derivation.tex: P = phi + sqrt(pi)/A(P) with the declared transport');
const fp = pixelFixedPoint();
cells('paper: fixed point of the pixel ratio', [['P', fp.P, '1.630972095859'], ['1/alpha(0)', fp.AT, '136.9948351774'], ['1/alpha_em(m_Z)', fp.AZ, '128.3082680580'], ['transport', fp.delta, '8.6865671194']]);
ok('P = phi + sqrt(pi)/A at the fixed point', Math.abs(fp.P - (PHI + Math.sqrt(Math.PI) / fp.AT)) < 1e-14);
ok('the chain\'s input P = 1.6309721 is this fixed point to its printed digits', fp.P.toFixed(7) === String(P_FIXED));
cells('CA_ANCHOR.md: A_T at the input P', [['A_T', thomsonTransport(decl).AT, '136.995']]);
cells('CA_ANCHOR.md: 1/alpha(0) minus the CODATA 2022 value (not blind)', [['difference', thomsonTransport(decl).AT - MEASURED.alpha0Inv.value, '-0.041']]);
ok('readout row 1/alpha(0): the declared chain against CODATA 2022 (not blind)', (100 * (thomsonTransport(decl).AT / MEASURED.alpha0Inv.value - 1)).toFixed(3) === '-0.030',
  `${thomsonTransport(decl).AT.toFixed(3)} against ${MEASURED.alpha0Inv.value}; other variants at the same P: ${['source', 'two', 'stack'].map((k) => k + ' ' + thomsonTransport(variant(k)).AT.toFixed(3)).join(', ')}`);

// ---------------------------------------------------------------- 8. the variants of the page
console.log('--- the variants drawn on the page');
for (const [key, v] of Object.entries(VARIANTS)) {
  const s = variant(key);
  ok(`variant ${key}: one root`, !!s, s ? `1/alpha_U ${s.x.toFixed(4)}, v ${s.v.toFixed(2)} GeV, m_Z ${s.mZ.toFixed(3)}, m_W ${s.mW.toFixed(3)}, alpha_s ${s.alphaS.toFixed(5)}, sin2 ${s.sin2.toFixed(5)}, 1/alpha_em ${s.aemInv.toFixed(3)}, ratio ${fstr(slopeRatio(v.slopes))}` : '');
}
ok('variant declared is the reference row', Math.abs(variant('declared').x - decl.x) < 1e-12);
ok('variant source is CH\'s row "source as built"', variant('source').x.toFixed(3) === '24.822' && variant('source').sin2.toFixed(4) === '0.2056');
ok('variant two is CH\'s row "two doublets, m = 1"', variant('two').v.toFixed(1) === '245.9' && variant('two').sin2.toFixed(4) === '0.2079');
ok('variant stack is CU\'s row "Stack, slopes (33/5, 1, -3)"', variant('stack').v.toFixed(2) === '264.63' && variant('stack').MU.toExponential(4) === '1.7853e+16');
ok('theory session statement: the source as built gives sin2 = 0.206 and alpha_s = 0.112', variant('source').sin2.toFixed(3) === '0.206' && variant('source').alphaS.toFixed(3) === '0.112');
ok('theory session statement: the stack\'s own M_U form gives v 7.5 percent high (not blind)', (100 * (variant('stack').v / MEASURED.v.value - 1)).toFixed(1) === '7.5');
{ // the solver reads no measured value: scaling every entry of MEASURED leaves the solved chain unchanged
  const keep = JSON.stringify(MEASURED);
  for (const k of Object.keys(MEASURED)) MEASURED[k].value *= 1.5;
  const again = one({});
  Object.assign(MEASURED, JSON.parse(keep));
  ok('no measured value enters the solver', again.x === decl.x && again.v === decl.v && again.sin2 === decl.sin2, 'the solved chain is identical with every measured value scaled by 1.5');
}

console.log(`${fails ? 'FAILED' : 'ALL PASS'}: ${count - fails} of ${count} checks`);
process.exit(fails ? 1 : 0);
