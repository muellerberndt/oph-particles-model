// Checks the engine of the Timeline page (timeline.js) against values computed by hand, and the plots of the Phase
// transitions page (transitions.js) against the lane files on disk and against files with fields removed.
//   node epochs_check.mjs
import { readFileSync, existsSync } from 'node:fs';
import * as T from './timeline.js';
import * as P from './transitions.js';

let fails = 0;
const ok = (name, cond, detail = '') => { if (!cond) fails++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`); };
const near = (name, got, want, rel) => ok(name, Math.abs(got - want) <= rel * Math.abs(want), `${got.toPrecision(7)} against ${want}`);

// ---- units and the chain's scales (hand values: hbar = 6.582119569e-25 GeV s, E* = 1.220890e19 GeV, P = 1.6309721)
near('one tick = hbar / E_cell in seconds', T.TICK_S, 6.88513e-44, 1e-5);
near('E_cell = E* P^(-1/2)', T.E_STAR / Math.sqrt(T.P_FWD), 9.5599e18, 1e-5);
near('M_U = E* exp(-2 pi) P^(1/6)', T.E_STAR * Math.exp(-2 * Math.PI) * T.P_FWD ** (1 / 6), 2.4736e16, 1e-4);
near('M_U = E_cell exp(-2 pi) P^(2/3)', T.E_CELL * Math.exp(-2 * Math.PI) * T.P_FWD ** (2 / 3), T.M_U, 1e-4);
near('v = E_cell exp(-2 pi / (4 alpha_U))', T.E_CELL * Math.exp(-2 * Math.PI * T.INV_ALPHA_U / 4), 246.60, 2e-4);
near('radiation coefficient sqrt(45 / 16 pi^3) hbar E* in s MeV^2', Math.sqrt(45 / (16 * Math.PI ** 3)) * (T.E_STAR * 1e3) * (T.HBAR_GEV_S * 1e3), T.RAD_COEF, 2e-4);

// ---- the count of relativistic states
ok('count of the model content: 24 + 4 + 90 * 7/8 = 106.75', 24 + 4 + 90 * 7 / 8 === 106.75 && T.G_ALL === 106.75);
const env = { ...T.defaultEnv(), T_EW: 160, T_QCD: 0.157, ewLocated: true, qcdLocated: true };
const steps = [[1e3, 106.75], [160, 106.75], [150, 96.25], [100, 95.25], [85, 92.25], [10, 86.25], [2, 75.75], [1.5, 72.25], [1, 61.75], [0.16, 61.75], [0.15, 17.25], [0.12, 14.25], [0.05, 10.75]];
ok('g* steps: ' + steps.map((s) => s[1]).join(', '), steps.every(([x, g]) => T.gstar(x, env) === g), steps.filter(([x, g]) => T.gstar(x, env) !== g).map(([x]) => `T=${x}: ${T.gstar(x, env)}`).join('; '));
ok('g* with the default boundaries: 106.75 above the top mass, 61.75 above the colour scale', T.gstar(300) === 106.75 && T.gstar(0.5) === 61.75 && T.gstar(0.3) === 17.25);

// ---- time from temperature: t = 2.42 s / sqrt(g*) / (T/MeV)^2
near('t(160 GeV), g* = 106.75', T.timeOfTemperature(160, env), 9.14938e-12, 1e-5);
near('the same in ticks', T.timeOfTemperature(160, env) / T.TICK_S, 1.32886e32, 1e-5);
near('t(159.5 GeV), g* = 106.75', T.radiationTime(159.5, 106.75), 9.20683e-12, 1e-5);
near('t(157 MeV), g* = 61.75', T.timeOfTemperature(0.157, env), 1.24939e-5, 1e-5);
near('t(157 MeV), g* = 17.25', T.radiationTime(0.157, 17.25), 2.36386e-5, 1e-5);
near('t(M_U) in ticks', T.timeOfTemperature(T.M_U, env) / T.TICK_S, 5559.81, 1e-5);
near('temperature at the first tick, GeV', T.temperatureOfTime(T.TICK_S, env), 1.84442e18, 1e-4);
near('a temperature E_cell would lie at this many ticks', T.radiationTime(T.E_CELL, 106.75) / T.TICK_S, 0.0372231, 1e-4);
const back = [1e15, 1e9, 500, 120, 20, 3, 0.5, 0.11];
ok('inverse: T(t(T)) = T away from the steps', back.every((x) => Math.abs(T.temperatureOfTime(T.timeOfTemperature(x, env), env) / x - 1) < 1e-9));
ok('at a step the temperature waits: T = 157 MeV from 1.25e-5 s to 2.36e-5 s', [1.3e-5, 1.8e-5, 2.3e-5].every((t) => Math.abs(T.temperatureOfTime(t, env) / 0.157 - 1) < 1e-9));
ok('time grows as the temperature falls', (() => { let last = 0; for (let k = 18; k >= -1.3; k -= 0.01) { const t = T.timeOfTemperature(10 ** k, env); if (t < last) return false; last = t; } return true; })());

// ---- the declared chain at m_Z (COUPLING_FIX.md: 29.605, 0.11834, 0.23074, 128.308)
const c = T.chainAtMZ();
near('1/alpha_2(m_Z)', c.inv2, 29.605, 2e-5); near('alpha_s(m_Z)', c.alpha_s, 0.11834, 5e-5); near('sin^2 theta_W(m_Z)', c.sin2, 0.23074, 5e-5); near('1/alpha_em(m_Z)', c.invEm, 128.308, 2e-5);
ok('one coupling at and above M_U', T.inverseCouplings(T.M_U).every((v) => v === T.INV_ALPHA_U) && T.inverseCouplings(1e18).every((v) => v === T.INV_ALPHA_U));

// ---- numbers as text
ok('sci, num, fmtEnergy, fmtTime, fmtTicks', T.sci(9.5599e18, 3) === '9.56 × 10¹⁸' && T.sci(6.88513e-44, 3) === '6.89 × 10⁻⁴⁴' && T.num(246.6, 4) === '246.6' && T.fmtEnergy(0.157) === '157 MeV' && T.fmtEnergy(2.4736e16) === '2.47 × 10¹⁶ GeV'
  && T.fmtTime(9.1494e-12) === '9.1 × 10⁻¹² s' && T.fmtTicks(1) === '1 tick' && T.fmtTicks(5559.8) === '5,560 ticks' && T.fmtTicks(1.32886e32) === '1.3 × 10³² ticks',
  [T.sci(9.5599e18, 3), T.num(246.6, 4), T.fmtEnergy(0.157), T.fmtEnergy(2.4736e16), T.fmtTime(9.1494e-12), T.fmtTicks(1), T.fmtTicks(5559.8), T.fmtTicks(1.32886e32)].join(' | '));

// ---- what the ribbon takes from the lane files
const e0 = T.envFromFiles(null, null);
ok('no files: boundaries at the chain\'s scales v and Lambda(3), nothing located', e0.T_EW === T.V_CHAIN && e0.T_QCD === T.LAMBDA3 && !e0.ewLocated && !e0.qcdLocated);
const e1 = T.envFromFiles({ oph: { T_c_GeV: 160, T_c_err: 2 }, placeholder: true }, { scale: { T_pc_MeV: 157, route_computed: false } });
ok('a colour temperature without a computed route is not used', e1.T_EW === 160 && e1.ewLocated && e1.placeholder && e1.T_QCD === T.LAMBDA3 && !e1.qcdLocated);
const e2 = T.envFromFiles(null, { scale: { T_pc_MeV: 157, T_pc_err: 6, route_computed: true } });
ok('with a computed route it is', Math.abs(e2.T_QCD - 0.157) < 1e-12 && e2.qcdLocated);
const marks = T.ribbonMarks(e1, 16500);
ok('marks in order of time: cell, unification, run, scale, ew, colour', marks.map((m) => m.id).join() === 'cell,unification,run,scale,ew,colour' && marks.every((m, i) => !i || m.t >= marks[i - 1].t), marks.map((m) => m.id).join());
ok('the ribbon ends after the colour mark', marks.every((m) => Math.log10(m.t) < T.RIBBON.L1) && Math.abs(T.RIBBON.L0 - Math.log10(T.TICK_S)) < 1e-12);

// ---- the plots of the transitions page
const here = new URL('./rl/', import.meta.url), load = (f) => (existsSync(new URL(f, here)) ? JSON.parse(readFileSync(new URL(f, here))) : null);
const files = { ew: load('EW/ew_transition.json'), qcd: load('QCD/colour_transition.json'), had: load('HAD/hadrons.json') };
const KEYS = [...Object.keys(P.PLOTS), 'had-ratio-0', 'had-ratio-1', 'had-gev-0'];
const lane = (k) => (k.startsWith('ew') ? 'ew' : k.startsWith('qcd') ? 'qcd' : 'had');
const clean = (s) => !/NaN|undefined|Infinity|\[object|>null</.test(s);
const drawAll = (d) => { let n = 0; for (const k of KEYS) for (const W of [200, 420, 900]) { const r = P.drawPlot(k, d[lane(k)], W, {}); if (!clean(r.svg || '')) throw new Error(k + ' at ' + W); if (r.svg) n++; } if (!clean(P.pageMarkup(d.ew, d.qcd, d.had, {}))) throw new Error('page markup'); return n; };
for (const [k, d] of Object.entries(files)) ok(`lane file ${k}: ${d ? (d.placeholder === true ? 'placeholder' : 'measured') : 'absent'}`, true);
let drawn = 0, threw = '';
try { drawn = drawAll(files); } catch (e) { threw = String(e.message || e); }
ok('every plot draws from the files on disk without a broken number', !threw, threw || `${drawn} drawings`);
threw = ''; let variants = 0;
try {
  drawAll({ ew: null, qcd: null, had: null }); drawAll({ ew: {}, qcd: {}, had: {} });
  for (const [k, d] of Object.entries(files)) {
    if (!d) continue;
    for (const f of Object.keys(d)) { const cut = { ...d }; delete cut[f]; drawAll({ ...files, [k]: cut }); variants++; }
    for (const f of Object.keys(d)) if (d[f] && typeof d[f] === 'object' && !Array.isArray(d[f])) for (const g of Object.keys(d[f])) { const cut = { ...d, [f]: { ...d[f] } }; delete cut[f][g]; drawAll({ ...files, [k]: cut }); variants++; }
    for (const f of Object.keys(d)) if (Array.isArray(d[f])) { drawAll({ ...files, [k]: { ...d, [f]: [] } }); drawAll({ ...files, [k]: { ...d, [f]: [{}] } }); variants += 2; }
  }
} catch (e) { threw = String(e.message || e); }
ok('the page draws with any field of any file missing', !threw, threw || `${variants} reduced files`);
ok('names set as symbols', P.pretty('m_N/m_rho') === 'm<sub>N</sub>/m<sub>ρ</sub>' && P.pretty('sin^2 theta_W(m_Z)') === 'sin² θ<sub>W</sub>(m<sub>Z</sub>)' && P.pretty('m_rho/sqrt(sigma)') === 'm<sub>ρ</sub>/√σ');
ok('value with error: digits follow the error', P.pm(160, 2) === '160.0 ± 2.0' && P.pm(5.68974, 0.00048) === '5.68974 ± 0.00048' && P.pm(157, 6) === '157.0 ± 6.0', [P.pm(160, 2), P.pm(5.68974, 0.00048)].join(' | '));
const mev = P.colourCheck({ su3: { beta_c: 5.69, beta_c_literature: 5.6925 }, scale: { T_pc_MeV: 157, reference: { T_pc_MeV: 156.5 } } });
ok('colour comparison without a computed route: no MeV', mev && mev.what === 'beta');
ok('colour comparison with a computed route: MeV', P.colourCheck({ scale: { route_computed: true, T_pc_MeV: 157, reference: { T_pc_MeV: 156.5 } } }).what === 'MeV');
if (files.had) { const b = P.bindingOf(files.had); ok('binding strength of the animation from the measured potential: 1 cold, near 0 hot', !b || (b.step ? b.at(0.9) === 1 && b.at(1.1) === 0 : Math.abs(b.at(b.Tlo) - 1) < 1e-12 && b.at(b.Thi) < 0.2), b ? (b.step ? 'string tension below the transition, none above' : `${b.at(b.Tlo).toFixed(3)} at ${b.Tlo} T_c, ${b.at(b.Thi).toFixed(3)} at ${b.Thi} T_c`) : 'no potential in the file'); }
ok('without melting curves the animation takes the string tension', (() => { const b = P.bindingOf({ potential: { fit: { sigma: 0.16 } } }); return b && b.step && b.at(0.7) === 1 && b.at(1.3) === 0 && P.bindingOf({}) === null; })());
ok('GeV masses are shown only with a computed route', !/data-plot="had-gev-/.test(P.panelHAD({ GeV: [{ name: 'nucleon', value: 0.95, err: 0.1, measured: 0.939 }] }, {})) && /data-plot="had-gev-0"/.test(P.panelHAD({ GeV: [{ name: 'nucleon', value: 0.95, err: 0.1, measured: 0.939, route_computed: true }] }, {})));

console.log(fails ? `${fails} FAILED` : 'ALL PASS');
process.exit(fails ? 1 : 0);
