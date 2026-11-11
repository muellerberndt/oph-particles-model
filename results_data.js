// The landmark results board (page "results"): the data of every cell, card and row and the arithmetic of the
// comparisons. No DOM and no imports. results.js draws it; results_data_check.mjs runs it in node against the sources.
//
// Groups and sentences follow the theory session's addendum: derived, conditional, open. The board shows comparisons
// only for values the model computes; a value that needs an imported coefficient or conversion has no row. Model values
// are typed from the report named beside them and were read there row by row. Measured values are typed from CODATA 2022
// and from the Review of Particle Physics 2024. Every deviation, every sigma and every derived measured value is
// computed here. Comparison with measurement is not blind unless a row says so.

// ---------------------------------------------------------------- status vocabulary
// Colour is the site's status colour; every status also has its own mark shape and its word.
export const STATUS = {
  derived: { label: 'derived', long: 'derived', css: 'var(--teal)', shape: 'circle' },
  conditional: { label: 'conditional', long: 'conditional: stated premises', css: 'var(--blue)', shape: 'diamond' },
  declared: { label: 'declared', long: 'declared forms that fit', css: 'var(--amber)', shape: 'square' },
  open: { label: 'open', long: 'open', css: 'var(--red)', shape: 'cross' },
};
// A mass that is not yet correctly derived carries this chip and one sentence on what is missing. A ratio that uses
// no measured mass and a number that the model's own lattice run computed carry no such chip.
export const INCOMPLETE_LABEL = 'derivation incomplete';
const MISSING = {
  lepton: 'The common scale of the three rates is open: a mass in MeV with no measured input needs the lepton scale y<sub>J</sub>, and the source gives no value for it yet.',
  chain: 'The forms of the coupling chain are declared and fit; the hypercharge slope, the power in the unification scale, the anchor and the collar law have no derivation yet.',
  higgs: 'The relation needs the top mass as a measured input, and the mass term of the Higgs register is of cell size in every regulator.',
};
export const CHAIN_LABEL = 'declared forms that fit; derivation open';
export const PLACEHOLDER_LABEL = 'placeholder data, run in progress';
// A lane row whose file is missing or a placeholder stays on the board with its chip and without numbers.
// Set to false to drop such rows until measured data are on file.
export const SHOW_PENDING = true;

// ---------------------------------------------------------------- the deviation axis: 0.1 ppm to 100 percent
export const AXIS = { min: -7, max: 0 };
export const TICKS = [[-7, '0.1 ppm'], [-6, '1'], [-5, '10'], [-4, '100'], [-3, '0.1 %'], [-2, '1'], [-1, '10'], [0, '100']];
// position of a relative deviation on the axis, 0 to 1; under and over say that the value lies outside the axis
export function axisX(rel) {
  const a = Math.abs(rel);
  if (!(a > 0)) return { x: 0, under: true, over: false };
  const t = (Math.log10(a) - AXIS.min) / (AXIS.max - AXIS.min);
  return { x: Math.min(1, Math.max(0, t)), under: t < 0, over: t > 1 };
}

// ---------------------------------------------------------------- measured values and their sources
export const REF = {
  codata: { name: 'CODATA 2022 (NIST)', url: 'https://physics.nist.gov/cuu/Constants/' },
  pdg: { name: 'Particle Data Group 2024', url: 'https://pdg.lbl.gov/' },
  pdg26: { name: 'Particle Data Group 2026', url: 'https://pdg.lbl.gov/' },
  both: { name: 'CODATA 2022 and Particle Data Group 2024', url: 'https://pdg.lbl.gov/' },
  ew: { name: 'D’Onofrio and Rummukainen, Phys. Rev. D 93 (2016) 025003', url: 'https://arxiv.org/abs/1508.07161' },
  qcd: { name: 'HotQCD, Phys. Lett. B 795 (2019) 15', url: 'https://arxiv.org/abs/1812.08235' },
};
export const MEAS = {
  m_e: { v: 0.51099895069, s: 0.00000000016, text: '0.51099895069(16)', ref: 'codata' },      // MeV
  m_mu: { v: 105.6583755, s: 0.0000023, text: '105.6583755(23)', ref: 'codata' },              // MeV
  mu_e: { v: 206.7682827, s: 0.0000046, text: '206.7682827(46)', ref: 'codata' },
  alpha0: { v: 137.035999177, s: 0.000000021, text: '137.035999177(21)', ref: 'codata' },
  m_p: { v: 938.27208943, s: 0.00000029, text: '938.27208943(29)', ref: 'codata' },            // MeV
  m_n: { v: 939.56542194, s: 0.00000048, text: '939.56542194(48)', ref: 'codata' },            // MeV
  m_tau: { v: 1776.93, s: 0.09, text: '1776.93(9)', ref: 'pdg' },                              // MeV
  m_rho: { v: 775.26, s: 0.23, text: '775.26(23)', ref: 'pdg' },                               // MeV, neutral rho(770)
  m_Z: { v: 91.1880, s: 0.0020, text: '91.1880(20)', ref: 'pdg' },                             // GeV
  m_W: { v: 80.3692, s: 0.0133, text: '80.3692(133)', ref: 'pdg' },                            // GeV
  alpha_s: { v: 0.1180, s: 0.0009, text: '0.1180(9)', ref: 'pdg' },
  // The 2024 review lists 0.23129(4) and 127.930(8). The addendum's 0.23122(4) and 127.951(9) are the values of the
  // 2022 and 2023 editions.
  sin2: { v: 0.23129, s: 0.00004, text: '0.23129(4)', ref: 'pdg' },
  alpha_mz: { v: 127.930, s: 0.008, text: '127.930(8)', ref: 'pdg' },
  v: { v: 246.22, s: 0, text: '246.22', ref: 'pdg' },                                          // GeV, from the Fermi constant
  // The Higgs report compares with the 2026 values; the 2024 review lists 125.20(11).
  m_H: { v: 125.13, s: 0.11, text: '125.13(11)', ref: 'pdg26' },                               // GeV
  T_ew: { v: 159.5, s: 1.5, text: '159.5(1.5)', ref: 'ew' },                                   // GeV, Standard Model on the lattice
  T_qcd: { v: 156.5, s: 1.5, text: '156.5(1.5)', ref: 'qcd' },                                 // MeV, lattice QCD with physical quarks
};
export const koideQ = (a, b, c) => (a + b + c) / (Math.sqrt(a) + Math.sqrt(b) + Math.sqrt(c)) ** 2;
// value with its standard uncertainty in the last digits, at dec decimals
export const paren = (v, s, dec) => v.toFixed(dec) + '(' + Math.round(s * 10 ** dec) + ')';
// measured values that follow from the ones above
export function derivedMeasured(M = MEAS) {
  const tau_e = M.m_tau.v / M.m_e.v, s_tau_e = tau_e * Math.hypot(M.m_tau.s / M.m_tau.v, M.m_e.s / M.m_e.v);
  const tau_mu = M.m_tau.v / M.m_mu.v, s_tau_mu = tau_mu * Math.hypot(M.m_tau.s / M.m_tau.v, M.m_mu.s / M.m_mu.v);
  const Q = koideQ(M.m_e.v, M.m_mu.v, M.m_tau.v);
  const sQ = Math.abs(koideQ(M.m_e.v, M.m_mu.v, M.m_tau.v + M.m_tau.s) - koideQ(M.m_e.v, M.m_mu.v, M.m_tau.v - M.m_tau.s)) / 2;
  const N = (M.m_p.v + M.m_n.v) / 2000;                                                        // GeV
  const n_rho = 1000 * N / M.m_rho.v, s_n_rho = n_rho * M.m_rho.s / M.m_rho.v;
  return {
    tau_e: { v: tau_e, s: s_tau_e, text: paren(tau_e, s_tau_e, 3), ref: 'both' },
    tau_mu: { v: tau_mu, s: s_tau_mu, text: paren(tau_mu, s_tau_mu, 6), ref: 'both' },
    koide: { v: Q, s: sQ, text: paren(Q, sQ, 7), ref: 'both' },
    nucleon: { v: N, s: 0, text: N.toFixed(5), ref: 'codata' },
    n_rho: { v: n_rho, s: s_n_rho, text: paren(n_rho, s_n_rho, 4), ref: 'both' },
  };
}

// ---------------------------------------------------------------- model values
// The generation register (repair-law LEPTON_STEPS.md section 1; theory repository model/lepton_register_round):
// rest rates y_k = (1/27)(1 + sqrt2 cos(theta + 2 pi k/3))^2 at the read count theta = 2/9; k = 0 tau, 1 electron, 2 muon.
export const THETA = 2 / 9;
export function register(theta = THETA) {
  const amp = [0, 1, 2].map((k) => 1 + Math.SQRT2 * Math.cos(theta + 2 * Math.PI * k / 3)), y = amp.map((a) => a * a / 27);
  const sum = y[0] + y[1] + y[2];
  return { y, amp, sum, mu_e: y[2] / y[1], tau_e: y[0] / y[1], tau_mu: y[0] / y[2], Q: sum / (amp.reduce((s, a) => s + Math.abs(a), 0) / Math.sqrt(27)) ** 2 };
}
// The coupling chain: the paper's declared forms with the closure read at m_Z (COUPLING_FIX.md section 2; CA_ANCHOR.md,
// table "Chain outputs for R1"; the audit report MAUD gives the same zero-momentum value to more digits).
export const CHAIN = { alphaU_inv: 24.3166, M_U: 2.4736e16, v: 246.60, alpha_s: 0.11834, sin2: 0.23074, alpha_mz_inv: 128.308, alpha0_inv: 136.994835, m_Z: 91.588, m_W: 80.330 };
// What the source gives today (CH_HYPERCHARGE.md, variant "source as built"; CU_UNIFICATION.md, row "Stack, slopes (33/5, 1, -3)").
export const SOURCE_BUILT = { slopes: '(81/10, 5/6, −3)', sin2: 0.2056, alpha_s: 0.1123, v: 222.9, alphaU_inv: 24.822 };
export const STACK_FORM = { v: 264.63, M_U: 1.7853e16, alphaU_inv: 24.2716 };
// Higgs relation (UH.md section 5): m_H between these values at the top mass m_t.
export const HIGGS = { lo: 125.04, hi: 126.02, m_t: 172.1 };
// Residual of the muon ratio after the two-loop vacuum polarization by the lighter families (LD.md, rows R2 and R4), ppm.
export const MUON_RESIDUAL = { R2: 0.578, R4: 0.626 };
// Needed values, read from measurement (LEPTON_STEPS.md step L6; LV.md, compatibility tests).
export const NEEDED = { y_J: 0.010816, mass_term_factor: 8.6e31 };
// The level-6 run of the executable model (run.json, view/class_stats.json, view/early_universe.json of runs/universe/L6).
export const RUN_L6 = { level: 6, carriers: 81920, identities: 786662, channels: 57, screen_events: 32800, internal_events: 514363, violations: 0,
  occupied: 24758, not_neutral: 0, t444: 334, t222: 335, poisson: 25.865 };

// ---------------------------------------------------------------- comparison arithmetic and number formats
export function compare(model, meas, sMeas = 0, sModel = 0) {
  const s = Math.hypot(sMeas, sModel);
  return { rel: model / meas - 1, abs: model - meas, sigma: s > 0 ? (model - meas) / s : null, relSigma: s > 0 ? s / Math.abs(meas) : null };
}
const MINUS = '−';
const sig3 = (a) => (a >= 100 ? a.toFixed(0) : a >= 10 ? a.toFixed(1) : a.toFixed(2));
// signed relative deviation: parts per million below 0.1 percent, percent above
export function fmtDev(rel) {
  if (!Number.isFinite(rel)) return '';
  const a = Math.abs(rel), sign = rel < 0 ? MINUS : '+';
  if (a === 0) return '0';
  if (a < 1e-3) return sign + sig3(a * 1e6) + ' ppm';
  return sign + (a < 0.01 ? (a * 100).toFixed(2) : (a * 100).toFixed(1)) + ' %';
}
// the same in percent with two decimals, for the ends of a range
export const fmtPct = (rel) => (rel < 0 ? MINUS : '+') + (Math.abs(rel) * 100).toFixed(2);
export function fmtSigma(sigma) {
  if (sigma === null || sigma === undefined || !Number.isFinite(sigma)) return '';
  const a = Math.abs(sigma);
  if (a >= 1e4) { const e = Math.floor(Math.log10(a)); return (a / 10 ** e).toFixed(1) + ' × 10<sup>' + e + '</sup> σ'; }
  return (a >= 100 ? a.toFixed(0) : a >= 10 ? a.toFixed(1) : a.toFixed(2)) + ' σ';
}
export const fmtInt = (n) => Number(n).toLocaleString('en-US');
// a charge as text: explicit sign, true minus
export const signed = (s) => { const t = String(s).trim(); return (/^[0-9]/.test(t) && t !== '0' ? '+' + t : t).replace(/-/g, MINUS); };

// ---------------------------------------------------------------- the matrix of exact matches
// One generation of matter and the gauge fields, as the five-level code gives them (theory repository
// model/defect_particle_classes; decoder file of the lane PD). The antiparticle of each state has the conjugate
// representations and the opposite charges. given: exact given a stated construction (the Higgs register is declared).
const PARTICLES = [
  { id: 'u_L', sym: 'u<sub>L</sub>', name: 'left-handed up quark', group: 'quarks', bits: '10010', n: 3, su3: '3', su2: '2', Y: '1/6', T3: '1/2', Q: '2/3', k: 1, BL: '1/3', stat: 'fermion' },
  { id: 'd_L', sym: 'd<sub>L</sub>', name: 'left-handed down quark', group: 'quarks', bits: '10001', n: 3, su3: '3', su2: '2', Y: '1/6', T3: '-1/2', Q: '-1/3', k: 1, BL: '1/3', stat: 'fermion' },
  { id: 'u_R', sym: 'u<sub>R</sub>', name: 'right-handed up quark', group: 'quarks', bits: '10011', n: 3, su3: '3', su2: '1', Y: '2/3', T3: '0', Q: '2/3', k: 4, BL: '1/3', stat: 'fermion' },
  { id: 'd_R', sym: 'd<sub>R</sub>', name: 'right-handed down quark', group: 'quarks', bits: '10000', n: 3, su3: '3', su2: '1', Y: '-1/3', T3: '0', Q: '-1/3', k: 4, BL: '1/3', stat: 'fermion' },
  { id: 'nu_L', sym: 'ν<sub>L</sub>', name: 'left-handed neutrino', group: 'leptons', bits: '11110', n: 1, su3: '1', su2: '2', Y: '-1/2', T3: '1/2', Q: '0', k: 3, BL: '-1', stat: 'fermion' },
  { id: 'e_L', sym: 'e<sub>L</sub>', name: 'left-handed electron', group: 'leptons', bits: '11101', n: 1, su3: '1', su2: '2', Y: '-1/2', T3: '-1/2', Q: '-1', k: 3, BL: '-1', stat: 'fermion' },
  { id: 'nu_R', sym: 'ν<sub>R</sub>', name: 'right-handed neutrino', group: 'leptons', bits: '11111', n: 1, su3: '1', su2: '1', Y: '0', T3: '0', Q: '0', k: 0, BL: '-1', stat: 'fermion' },
  { id: 'e_R', sym: 'e<sub>R</sub>', name: 'right-handed electron', group: 'leptons', bits: '11100', n: 1, su3: '1', su2: '1', Y: '-1', T3: '0', Q: '-1', k: 0, BL: '-1', stat: 'fermion' },
  { id: 'g', sym: 'g', name: 'gluons', group: 'gauge fields', n: 8, su3: '8', su2: '1', Y: '0', T3: '0', Q: '0', k: 0, BL: '0', stat: 'boson' },
  { id: 'W', sym: 'W', name: 'W fields', group: 'gauge fields', n: 3, su3: '1', su2: '3', Y: '0', T3: '±1, 0', Q: '±1, 0', k: 0, BL: '0', stat: 'boson' },
  { id: 'B', sym: 'B', name: 'B field', group: 'gauge fields', n: 1, su3: '1', su2: '1', Y: '0', T3: '0', Q: '0', k: 0, BL: '0', stat: 'boson' },
  { id: 'H', sym: 'H', name: 'Higgs register', group: 'Higgs', n: 2, su3: '1', su2: '2', Y: '1/2', T3: '±1/2', Q: '+1, 0', k: 3, BL: '0', stat: 'boson', given: true },
];
export const QUANTITIES = [
  { id: 'n', label: 'states', note: '' }, { id: 'su3', label: 'colour', note: 'SU(3)' }, { id: 'su2', label: 'weak', note: 'SU(2)' },
  { id: 'Y', label: 'hypercharge', note: 'Y', sign: true }, { id: 'T3', label: 'isospin', note: 'T<sub>3</sub>', sign: true },
  { id: 'Q', label: 'charge', note: 'Q = T<sub>3</sub> + Y', sign: true }, { id: 'k', label: 'class', note: '6Y mod 6' },
  { id: 'BL', label: 'B − L', note: '', sign: true }, { id: 'stat', label: 'statistics', note: '', given: true },
];
const embedded = () => PARTICLES.map((p) => ({ ...p }));
// the columns of the matrix: from the decoder file when it is on file and real, from the embedded table otherwise
export function matrix(file) {
  let cols = embedded(), source = 'embedded', checks = 0;
  if (file && typeof file === 'object' && file.placeholder !== true && Array.isArray(file.patterns) && file.patterns.length === 32) {
    try {
      for (const c of cols.filter((x) => x.stat === 'fermion')) {
        const ps = file.patterns.filter((p) => p && p.name === c.id);
        if (!ps.length) throw new Error('state ' + c.id);
        const p = ps[0]; Object.assign(c, { n: ps.length, su3: String(p.su3), su2: String(p.su2), Y: String(p.Y), T3: String(p.T3), Q: String(p.Q), k: p.k, BL: String(p.B_minus_L), stat: String(p.statistics), bits: String(p.bits) });
      }
      for (const g of (file.bosons && file.bosons.groups) || []) {
        const c = cols.find((x) => x.id === g.symbol), m = /^\((\w+),(\w+)\)_(.+)$/.exec(g.rep || '');
        if (c && m) Object.assign(c, { n: g.count, su3: m[1], su2: m[2], Y: m[3], k: g.k, stat: String(g.statistics) });
      }
      const h = file.bosons && file.bosons.higgs, H = cols.find((x) => x.id === 'H');
      if (h && H) Object.assign(H, { su3: String(h.su3), su2: String(h.su2), Y: String(h.Y), k: h.k, stat: String(h.statistics), n: Array.isArray(h.components) && h.components.length ? h.components.length : H.n });
      source = 'file'; checks = file.checks && typeof file.checks === 'object' ? Object.values(file.checks).filter((v) => v === true).length : 0;
    } catch (e) { cols = embedded(); source = 'embedded'; }
  }
  const rows = QUANTITIES.map((q) => ({ ...q, cells: cols.map((c) => ({ col: c.id, text: q.sign ? signed(c[q.id]) : String(c[q.id]).replace(/-/g, MINUS), given: !!(q.given || c.given) })) }));
  const cells = rows.length * cols.length, given = rows.reduce((s, r) => s + r.cells.filter((x) => x.given).length, 0);
  return { cols, rows, source, checks, cells, exact: cells - given, given };
}

// ---------------------------------------------------------------- optional files of the research lanes
// Fetched by results.js. A file with placeholder === true never shows its numbers.
export const FILES = {
  pd: 'rl/PD/decoder.json', ew: 'rl/EW/ew_transition.json', qcd: 'rl/QCD/colour_transition.json', had: 'rl/HAD/hadrons.json',
  il: 'rl/IL/il_census.json', lr: 'rl/LR/lepton_run.json', av: 'rl/AV/class_balance.json', run: 'runs/L6/view/early_universe.json',
  lrp: 'rl/LR/progress.json', avp: 'rl/AV/progress.json',
};
// a lane whose result file is not on file yet, and whose progress file says that its run is under way
const waiting = (p) => !!p && typeof p === 'object' && (p.status === 'running' || p.status === 'failed');
const pos = (x) => typeof x === 'number' && Number.isFinite(x) && x > 0;
const str = (x) => (typeof x === 'string' ? x : '');
// the electroweak crossover temperature of the lane EW: state 'missing', 'placeholder' or 'ok'
export function electroweak(file) {
  const ref = MEAS.T_ew, out = { state: 'missing', ref: { ...ref }, cite: REF[ref.ref].name };
  if (!file || typeof file !== 'object') return out;
  if (file.placeholder === true) return { ...out, state: 'placeholder' };
  const b = file.oph;
  if (!b || !pos(b.T_c_GeV)) return { ...out, status: str(file.status) };
  const r = b.reference;
  if (r && pos(r.T_c_GeV)) { out.ref = { v: r.T_c_GeV, s: pos(r.err) ? r.err : 0, text: String(r.T_c_GeV) + (pos(r.err) ? '(' + r.err + ')' : ''), ref: ref.ref }; if (str(r.cite)) out.cite = r.cite; }
  return { ...out, state: 'ok', value: b.T_c_GeV, err: pos(b.T_c_err) ? b.T_c_err : null, statisticalRange: b.T_c_err_lattice_range || null, unrestrictedRange: b.T_c_err_lattice_unrestricted_range || null, uncertaintyScope: str(b.statistical_error_scope), kind: str(b.kind), status: str(file.status) };
}
// the colour transition of the lane QCD. A temperature in MeV is compared only when the file marks the route to MeV as
// computed (scale.route_computed === true). Otherwise the row states what the lane measured about the order of the
// transition and the critical temperature in units of the string tension root: su3.order or the growth exponent of the
// susceptibility maximum (su3.chi_max_scaling), and string_tension.Tc_over_sqrt_sigma or its lower estimate.
const pair = (x) => (Array.isArray(x) && pos(x[0]) ? [x[0], pos(x[1]) ? x[1] : 0] : pos(x) ? [x, 0] : null);
export function colour(file) {
  const ref = MEAS.T_qcd, out = { state: 'missing', ref: { ...ref }, cite: REF[ref.ref].name };
  if (!file || typeof file !== 'object') return out;
  if (file.placeholder === true) return { ...out, state: 'placeholder' };
  const sc = file.scale || {}, su = file.su3 || {}, st = file.string_tension || {}, own = (sc.pure_gauge && sc.pure_gauge.own_run) || {}, status = str(file.status);
  if (sc.route_computed === true && pos(sc.T_pc_MeV)) {
    const r = sc.reference;
    if (r && pos(r.T_pc_MeV)) { out.ref = { v: r.T_pc_MeV, s: pos(r.err) ? r.err : 0, text: String(r.T_pc_MeV) + (pos(r.err) ? '(' + r.err + ')' : ''), ref: ref.ref }; if (str(r.cite)) out.cite = r.cite; }
    return { ...out, state: 'ok', value: sc.T_pc_MeV, err: pos(sc.T_pc_err) ? sc.T_pc_err : 0, status };
  }
  const g = su.chi_max_scaling || {};
  const o = { order: str(su.order) || str(sc.order), exponent: pos(g.exponent) ? [g.exponent, pos(g.exponent_err) ? g.exponent_err : 0, pos(g.first_order_value) ? g.first_order_value : 0] : null,
    tc: pair(st.Tc_over_sqrt_sigma) || pair(su.Tc_over_sqrt_sigma) || pair(sc.Tc_over_sqrt_sigma), tcLower: pair(st.Tc_over_sqrt_sigma_lower_estimate) || pair(own.Tc_over_sqrt_sigma_lower_estimate),
    betaC: pos(su.beta_c) ? [su.beta_c, pos(su.beta_c_err) ? su.beta_c_err : 0] : null, Nt: pos(su.N_t) ? su.N_t : 0, routeNote: str(sc.route_note) };
  if (!o.order && !o.exponent && !o.tc && !o.tcLower) return { ...out, status };
  return { ...out, ...o, state: 'order', status };
}
// the hadron lane HAD. kind 'ratio': the entry m_N/m_rho of the field ratios. kind 'GeV': the entry nucleon of the
// field GeV, used only when that entry carries route_computed === true. The reference is the measured value held here.
export function hadron(kind, file) {
  const D = derivedMeasured(), ref = kind === 'ratio' ? D.n_rho : D.nucleon, out = { state: 'missing', ref: { ...ref } };
  if (!file || typeof file !== 'object') return out;
  if (file.placeholder === true) return { ...out, state: 'placeholder' };
  const status = str(file.status), list = kind === 'ratio' ? file.ratios : file.GeV, want = kind === 'ratio' ? 'm_n/m_rho' : 'nucleon';
  const e = (Array.isArray(list) ? list : []).find((x) => x && typeof x.name === 'string' && x.name.toLowerCase().replace(/\s+/g, '') === want);
  if (!e || !pos(e.value) || (kind === 'GeV' && e.route_computed !== true)) return { ...out, status };
  return { ...out, state: 'ok', value: e.value, err: pos(e.err) ? e.err : 0, status, route: str(e.route) };
}
// the labelled statements of a lane file, for a card: state 'missing', 'placeholder' or 'ok'
export function laneCard(file) {
  if (!file || typeof file !== 'object') return { state: 'missing', statements: [] };
  if (file.placeholder === true) return { state: 'placeholder', statements: [] };
  const st = Array.isArray(file.statements) ? file.statements.filter((s) => s && typeof s.text === 'string').map((s) => ({ text: s.text, label: str(s.label) })) : [];
  return { state: 'ok', statements: st, title: str(file.title), status: str(file.status) };
}
// the run card and the matter-antimatter item: the verified constants, replaced by the run's own file when it loads
export function runFacts(early, identities) {
  const f = { ...RUN_L6 };
  if (pos(identities)) f.identities = identities;
  if (early && typeof early === 'object' && early.level === 6) {
    if (pos(early.channels)) f.channels = early.channels;
    if (pos(early.channel_events)) f.screen_events = early.channel_events;
    if (Array.isArray(early.class_violations)) f.violations = early.class_violations.length;
    if (early.census && pos(early.census.occupied_carriers)) { f.occupied = early.census.occupied_carriers; f.not_neutral = early.census.not_neutral | 0; }
    if (early.baryon_like && pos(early.baryon_like['444'])) { f.t444 = early.baryon_like['444']; f.t222 = early.baryon_like['222']; f.poisson = early.baryon_like.poisson_scale; }
  }
  return f;
}

// ---------------------------------------------------------------- links
// keys: entries of SRC in links.js. more: [label, base, path] with base RER (theory repository), DER (published
// derivation reports), SITE (this site's files) or URL.
const L = {
  cert: [['Certificate: defect classes and particle classes (61 checks)', 'RER', 'model/defect_particle_classes/README.md'],
    ['Its proof, statement by statement', 'RER', 'model/defect_particle_classes/PROOF.md'], ['Its results file', 'RER', 'model/defect_particle_classes/results.json']],
  certProof: [['Certificate: defect classes and particle classes', 'RER', 'model/defect_particle_classes/PROOF.md']],
  reg: [['Certificate: the charged-lepton generation register (99 checks)', 'RER', 'model/lepton_register_round/README.md'],
    ['Its proof, statement by statement', 'RER', 'model/lepton_register_round/PROOF.md'], ['Its results file', 'RER', 'model/lepton_register_round/results.json']],
  steps: [['Charged leptons: state, comparison, remaining steps', 'DER', 'LEPTON_STEPS.md']],
  LD: [['Report: the residual of the muon ratio', 'DER', 'reports/LD.md']],
  LV: [['Report: the law for v and the count 4', 'DER', 'reports/LV.md']],
  CA: [['Report: the anchor at m_Z', 'DER', 'reports/CA_ANCHOR.md']],
  CH: [['Report: the hypercharge slope', 'DER', 'reports/CH_HYPERCHARGE.md']],
  CU: [['Report: the unification scale', 'DER', 'reports/CU_UNIFICATION.md']],
  CG: [['Report: the collar law', 'DER', 'reports/CG_COLLAR.md']],
  CQ: [['Report: Landau levels and flux-line scattering of the tick', 'DER', 'reports/CQ.md']],
  DG: [['Report: B − L and the neutrino mass term', 'DER', 'reports/DG.md']],
  MAUD: [['Audit of every mass value', 'DER', 'reports/MAUD.md']],
  early: [['Run file: class conservation and carrier census at level 6', 'SITE', 'runs/L6/view/early_universe.json']],
  pd: [['Decoder file: every pattern with its charges', 'SITE', 'rl/PD/decoder.json']],
};
const cat = (...a) => [].concat(...a);

// ---------------------------------------------------------------- the lines "what this is"
const WHAT = {
  ratio: 'Ratios of the three rest rates of the generation register around a lepton-class defect. A rest rate is the expected number of reads per tick of one of the three states. These are not yet the measured rest masses: one common scale is open, and reading a rate as a mass is a premise of the model. What is compared is the dimensionless ratio. Agreement for muon/electron: 9.8 ppm, one part in 100,000. The measurement is known to 0.02 ppm, so the gap is many times its error: the model value is leading order, and radiative corrections of order (α/π)² ≈ 5 ppm are not in it yet.',
  koide: 'A combination of the same three rates that is 2/3 for every phase of the register.',
  mass: 'The ratio times the measured electron mass. One measured number in, two out.',
  chain: 'Outputs of the declared coupling chain, read at m<sub>Z</sub>. Declared forms that fit; their derivation is open. The source as built gives sin<sup>2</sup>θ<sub>W</sub> = 0.206.',
  tree: 'Tree-level values from the chain’s v and couplings.',
  alphaU: 'The unified coupling of the declared chain, at its unification scale. It has no measured counterpart.',
  higgs: 'One relation between the Higgs mass and the top mass, from the quartic induced at the cell. The top mass is a measured input.',
  ew: 'A conditional electroweak crossover temperature from a separate Euclidean lattice ensemble and an imported reduction map using the declared chain’s couplings. Statistical, reduction and cutoff sensitivity estimates have distinct scopes.',
  qcd: 'The colour transition of the gauge sector the source defines, computed on the lattice.',
  had: 'The nucleon mass over the rho mass, computed on the lattice in the colour sector the source defines. A ratio needs no scale.',
  hadGeV: 'The nucleon mass of the same lattice computation in GeV, on a scale the lane computes.',
};

// ---------------------------------------------------------------- the board
export function board(live = {}) {
  const R = register(), D = derivedMeasured(), M = MEAS, me = M.m_e.v;
  const run = runFacts(live.run, live.identities);
  const cmp = (model, m, sModel = 0) => compare(model, m.v, m.s, sModel);
  const c_mu_e = cmp(R.mu_e, M.mu_e), c_tau_e = cmp(R.tau_e, D.tau_e);

  // ------------------------------------------------ derived: exact statements with an executable certificate
  const statements = [
    { id: 'gauge', status: 'derived', pict: 'gauge', page: 'carrier', title: 'The gauge group',
      formula: '(SU(3) × SU(2) × U(1)) / Z<sub>6</sub>', tex: '\\bigl(SU(3)\\times SU(2)\\times U(1)\\bigr)/\\mathbb{Z}_6', sub: 'from port phases on the five-level code',
      text: 'The global gauge group is (SU(3) × SU(2) × U(1))/Z<sub>6</sub> from port phases. Its centre is U(1). Z<sub>6</sub> is the kernel of the quotient. The defect alphabet is the order-six central subgroup generated by exp(2πiY). The plaquette action of the seam cost has equal bare couplings at the cell.',
      keys: ['gauge'], more: [] },
    { id: 'classes', status: 'derived', pict: 'classes', page: 'classes', title: 'Defect classes are particle classes',
      formula: 'k = 6Y mod 6', tex: 'k = 6Y \\bmod 6', sub: 'exact on all 32 patterns · 61 checks',
      text: 'Every protected defect class equals the Standard Model centre class 6Y mod 6 on all 32 matter patterns: classes 1/5 left quarks, 4/2 right quarks, 3 lepton doublet and Higgs, 0 right leptons and gauge fields. The executable certificate passes 61 checks.',
      keys: ['classes'], more: L.cert },
    { id: 'statistics', status: 'derived', pict: 'statistics', page: 'classes', title: 'Quanta are fermions',
      formula: 'rotation by 2π = (−1)<sup>N</sup>', tex: 'R(2\\pi) = (-1)^{N}', sub: 'defects, links and the Higgs register are bosons',
      text: 'Quanta are fermions; defects, links and the Higgs register are bosons. On the Gauss sector the rotation by 2π equals −1 to the number N of quanta, and one grading is consistent with it.',
      premises: ['a spin doublet per quantum', 'the Gauss law', 'antisymmetric occupation'],
      keys: ['spin'], more: L.certProof },
    { id: 'bl', status: 'derived', pict: 'bl', page: 'spectrum', title: 'B − L is exact',
      formula: 'Majorana pairing excluded in this sector', sub: 'conserved by every operation of the source',
      text: 'Every declared operation conserves B − L and excludes number-violating Majorana pairing in that sector. This does not alone identify a physical Dirac neutrino or its mass.',
      keys: ['neutral'], more: L.DG },
    { id: 'count4', status: 'derived', pict: 'count4', page: 'couplings', title: 'The 4 in the electroweak scale',
      formula: 'v = E<sub>cell</sub> e<sup>−2π/(<b>4</b> α<sub>U</sub>)</sup>', tex: 'v = E_{\\rm cell}\\, e^{-2\\pi/(\\mathbf{4}\\,\\alpha_U)}', sub: 'the plaquette cost of one class-3 flux quantum',
      text: 'The 4 in v = E<sub>cell</sub> exp(−2π/(4 α<sub>U</sub>)) is the plaquette cost of one weak-centre (class 3) flux quantum; the other classes give 12/5 and 3. The value of v belongs to the coupling chain below.',
      keys: [], more: cat(L.certProof, L.LV) },
    { id: 'run', status: 'derived', evidence: 'measured in the run', pict: 'run', page: 'defects', title: 'The run keeps the class rule',
      formula: fmtInt(run.identities) + ' identities · ' + fmtInt(run.violations) + ' violations', sub: fmtInt(run.occupied) + ' occupied carriers, ' + (run.not_neutral ? fmtInt(run.not_neutral) + ' not neutral' : 'all class neutral'),
      text: 'Level ' + run.level + ' of the executable model follows ' + fmtInt(run.identities) + ' defect identities. Each of its ' + run.channels + ' reaction types conserves the class modulo 6, in ' + fmtInt(run.screen_events) + ' events on the screen tier and ' + fmtInt(run.internal_events) + ' on the internal tier. All ' + fmtInt(run.occupied) + ' occupied carriers at the end are class neutral. The register conserves the class by construction; the run is the executed check.',
      keys: ['run'], more: cat(L.early, L.certProof) },
  ];

  // ------------------------------------------------ conditional: constructions with stated premises
  const constructions = [
    { id: 'register', status: 'conditional', pict: 'koide', page: 'leptons', title: 'Three generations from one register',
      formula: 'e, μ, τ = ω, ω<sup>2</sup>, 1', sub: 'Koide Q = 2/3 for every phase · 99 checks',
      text: 'A generation register in the repair law gives Koide Q = 2/3 and, from its read count 2/9, muon/electron ' + R.mu_e.toFixed(6) + ' (' + fmtDev(c_mu_e.rel) + ') and tau/electron ' + R.tau_e.toFixed(4) + ' (+' + fmtSigma(c_tau_e.sigma) + '), with no measured mass as input. Electron, muon and tau are the characters ω, ω<sup>2</sup>, 1 of the face third-turn.',
      openInside: ['what creates the pair', 'the source event for the kick', 'one partner per unit time'],
      tex: 'y_k = \\tfrac{1}{27}\\bigl(1+\\sqrt2\\,\\cos(\\theta+\\tfrac{2\\pi k}{3})\\bigr)^2,\\qquad \\theta=\\tfrac29', texPanel: true,
      keys: ['lepton'], more: cat(L.reg, L.steps) },
    { id: 'dirac', status: 'conditional', evidence: 'measured', pict: 'dirac', page: 'readout', title: 'The routing tick becomes the Dirac equation',
      formula: 'two ticks = e<sup>−2i(α·p + θβ)</sup> + O(p<sup>3</sup>)', tex: 'U^2 = e^{-2i(\\alpha\\cdot p+\\theta\\beta)} + O(p^3)', sub: 'first Landau level −0.9 % · flux-line scattering −2.0 %',
      text: 'On a plane wave two ticks of the routing walk act as exp(−2i(α·p + θβ)) up to order p<sup>3</sup>. That is the free Dirac equation with one cell per tick as the speed of light and the rest angle θ as the mass. In a uniform field the first Landau level lies 0.9 percent below √(2B). Scattering at a half-flux line lies 2.0 percent below the Aharonov-Bohm formula between 60 and 150 degrees. The walk is the declared candidate CF-1.',
      keys: ['continuum'], more: L.CQ },
  ];

  // ------------------------------------------------ conditional: numbers against measurement
  const cRow = (o) => ({ ...o, cmp: o.meas ? compare(o.model, o.meas.v, o.meas.s, o.sModel || 0) : null });
  const second = (label, value, valueText, meas, status, text) => ({ label, valueText, status, text, cmp: compare(value, meas.v, meas.s) });
  const lattice = [electroweakRow(live.ew), colourRow(live.qcd), hadronRow('ratio', live.had), hadronRow('GeV', live.had)]
    .filter((r) => r && (SHOW_PENDING || r.state === 'ok' || r.state === 'order'));
  const groups = [
    { id: 'leptons', title: 'Charged leptons', note: 'rest rates of the generation register · the common scale is open', status: 'conditional', page: 'leptons', rows: [
      cRow({ id: 'mu_e', hero: true, sym: 'muon / electron', name: 'muon over electron', model: R.mu_e, modelText: R.mu_e.toFixed(6), meas: M.mu_e, what: WHAT.ratio,
        text: 'The register gives the three rates y<sub>k</sub> = (1/27)(1 + √2 cos(θ + 2πk/3))<sup>2</sup> at the read count θ = 2/9. Their ratios need no measured mass. The model value is the ratio of the muon rate to the electron rate; the measured value is the mass ratio of CODATA. Each step of the derivation has one premise left.',
        second: { label: 'after two-loop vacuum polarization', hollow: true, status: 'conditional', cmp: { rel: MUON_RESIDUAL.R2 * 1e-6, sigma: MUON_RESIDUAL.R2 * 1e-6 * M.mu_e.v / M.mu_e.s },
          text: 'Hollow mark: the residual has the order and sign of two-loop vacuum polarization by lighter families. The closest registered reading leaves +' + MUON_RESIDUAL.R2.toFixed(2) + ' ppm. Not derived.' },
        keys: [], more: cat(L.steps, L.LD, L.reg) }),
      cRow({ id: 'tau_e', hero: true, sym: 'tau / electron', name: 'tau over electron', model: R.tau_e, modelText: R.tau_e.toFixed(4), meas: D.tau_e, what: WHAT.ratio,
        text: 'The ratio of the tau rate to the electron rate of the same register. The measured ratio is the tau mass of the Particle Data Group over the electron mass of CODATA.',
        keys: [], more: cat(L.steps, L.reg) }),
      cRow({ id: 'tau_mu', sym: 'tau / muon', name: 'tau over muon', model: R.tau_mu, modelText: R.tau_mu.toFixed(6), meas: D.tau_mu, what: WHAT.ratio,
        text: 'The ratio of the two larger rates of the register. It follows from the two rows above.', keys: [], more: cat(L.steps, L.reg) }),
      cRow({ id: 'koide', sym: 'Koide Q', name: 'Koide’s Q', model: 2 / 3, modelText: '2/3', meas: D.koide, what: WHAT.koide,
        text: 'Q is the sum of the three rates over the square of the sum of their square roots. The circulant of the register has Q = 2/3 for every phase of its positive chamber. The measured value follows from the three measured masses.',
        keys: [], more: cat(L.reg, L.steps) }),
      cRow({ id: 'm_mu', incomplete: MISSING.lepton, sym: 'muon mass', unit: 'MeV', name: 'muon mass', model: R.mu_e * me, modelText: (R.mu_e * me).toFixed(6), meas: M.m_mu, what: WHAT.mass,
        text: 'The muon over electron ratio of the register times the electron mass of CODATA. The deviation is that of the ratio.', keys: [], more: L.steps }),
      cRow({ id: 'm_tau', incomplete: MISSING.lepton, sym: 'tau mass', unit: 'MeV', name: 'tau mass', model: R.tau_e * me, modelText: (R.tau_e * me).toFixed(3), meas: M.m_tau, what: WHAT.mass,
        text: 'The tau over electron ratio of the register times the electron mass of CODATA. The deviation is that of the ratio.', keys: [], more: L.steps }),
    ] },
    { id: 'chain', title: 'Coupling chain', note: CHAIN_LABEL, status: 'declared', page: 'couplings', rows: [
      cRow({ id: 'alpha_U', sym: '1/α<sub>U</sub>', name: 'unified coupling', model: CHAIN.alphaU_inv, modelText: CHAIN.alphaU_inv.toFixed(4), meas: null, none: 'no measured counterpart', what: WHAT.alphaU,
        text: 'The closure read at m<sub>Z</sub> fixes the unified coupling at M<sub>U</sub> = 2.47 × 10<sup>16</sup> GeV. Every other row of the chain follows from it by the declared forms.',
        keys: ['coupling'], more: [] }),
      cRow({ id: 'v', sym: 'v', unit: 'GeV', name: 'electroweak scale v', model: CHAIN.v, modelText: CHAIN.v.toFixed(2), meas: M.v, what: WHAT.chain,
        text: 'v = E<sub>cell</sub> exp(−2π/(4 α<sub>U</sub>)) with the chain’s coupling. The count 4 is derived from the weak-centre flux; the form is declared. The measured value follows from the Fermi constant.',
        second: second('the stack’s own unification scale', STACK_FORM.v, STACK_FORM.v.toFixed(2), M.v, 'open', 'Red cross: the stack’s own form M<sub>U</sub> = E<sub>cell</sub> exp(−2π) gives ' + STACK_FORM.v.toFixed(2) + ' GeV. The declared factor P<sup>2/3</sup> has no source reading.'),
        keys: ['coupling'], more: cat(L.LV, L.CU) }),
      cRow({ id: 'alpha_s', sym: 'α<sub>s</sub>(m<sub>Z</sub>)', name: 'strong coupling at m<sub>Z</sub>', model: CHAIN.alpha_s, modelText: CHAIN.alpha_s.toFixed(5), meas: M.alpha_s, what: WHAT.chain,
        text: 'One-loop running from M<sub>U</sub> to m<sub>Z</sub> with the declared slopes (33/5, 1, −3).',
        second: second('the source as built', SOURCE_BUILT.alpha_s, SOURCE_BUILT.alpha_s.toFixed(4), M.alpha_s, 'open', 'Red cross: the source as built runs ' + SOURCE_BUILT.slopes + ' and gives ' + SOURCE_BUILT.alpha_s.toFixed(4) + '.'),
        keys: ['coupling'], more: L.CH }),
      cRow({ id: 'sin2', sym: 'sin<sup>2</sup>θ<sub>W</sub>(m<sub>Z</sub>)', name: 'weak mixing angle at m<sub>Z</sub>', model: CHAIN.sin2, modelText: CHAIN.sin2.toFixed(5), meas: M.sin2, what: WHAT.chain,
        text: 'The weak mixing angle at m<sub>Z</sub> with the declared slopes (33/5, 1, −3).',
        second: second('the source as built', SOURCE_BUILT.sin2, SOURCE_BUILT.sin2.toFixed(4), M.sin2, 'open', 'Red cross: the source as built runs ' + SOURCE_BUILT.slopes + ' and gives ' + SOURCE_BUILT.sin2.toFixed(4) + '. The declared slopes are not yet the source’s.'),
        keys: ['coupling'], more: L.CH }),
      cRow({ id: 'alpha_mz', sym: '1/α<sub>em</sub>(m<sub>Z</sub>)', name: 'electromagnetic coupling at m<sub>Z</sub>', model: CHAIN.alpha_mz_inv, modelText: CHAIN.alpha_mz_inv.toFixed(3), meas: M.alpha_mz, what: WHAT.chain,
        text: 'The inverse electromagnetic coupling at m<sub>Z</sub>, from the chain’s weak and hypercharge couplings.', keys: ['coupling'], more: [] }),
      cRow({ id: 'alpha_0', sym: '1/α(0)', name: 'fine-structure constant', model: CHAIN.alpha0_inv, modelText: CHAIN.alpha0_inv.toFixed(3), meas: M.alpha0, what: WHAT.chain,
        text: 'The inverse fine-structure constant at zero momentum, at the chain’s fixed point. The transport from m<sub>Z</sub> down is a declared one-loop kernel on a phenomenological continuation of the particle masses.',
        keys: ['coupling'], more: cat(L.CA, L.MAUD) }),
      cRow({ id: 'm_Z', incomplete: MISSING.chain, sym: 'm<sub>Z</sub> tree', unit: 'GeV', name: 'Z mass at tree level', model: CHAIN.m_Z, modelText: CHAIN.m_Z.toFixed(3), meas: M.m_Z, what: WHAT.tree,
        text: 'm<sub>Z</sub> = (v/2) √(g<sub>2</sub><sup>2</sup> + g<sub>Y</sub><sup>2</sup>) at the scale m<sub>Z</sub>. That scale is also the anchor where the closure is read. Loop corrections are left out.',
        keys: ['coupling', 'electroweak'], more: L.CA }),
      cRow({ id: 'm_W', incomplete: MISSING.chain, sym: 'm<sub>W</sub> tree', unit: 'GeV', name: 'W mass at tree level', model: CHAIN.m_W, modelText: CHAIN.m_W.toFixed(3), meas: M.m_W, what: WHAT.tree,
        text: 'm<sub>W</sub> = (v/2) g<sub>2</sub> with the chain’s weak coupling at m<sub>Z</sub>. Loop corrections are left out.', keys: ['coupling', 'electroweak'], more: [] }),
    ] },
    { id: 'higgs', title: 'Higgs', note: 'one relation m<sub>H</sub>(m<sub>t</sub>) · the top mass is a measured input', status: 'declared', page: 'spectrum', rows: [
      { id: 'm_H', incomplete: MISSING.higgs, sym: 'm<sub>H</sub>', unit: 'GeV', name: 'Higgs mass', modelText: HIGGS.lo.toFixed(2) + ' to ' + HIGGS.hi.toFixed(2), meas: M.m_H, what: WHAT.higgs,
        range: [compare(HIGGS.lo, M.m_H.v, M.m_H.s), compare(HIGGS.hi, M.m_H.v, M.m_H.s)], cmp: null,
        text: 'An unbounded class-3 register has no tree-level quartic. The quartic induced at the cell gives one relation: m<sub>H</sub> between ' + HIGGS.lo.toFixed(2) + ' and ' + HIGGS.hi.toFixed(2) + ' GeV at the top mass ' + HIGGS.m_t.toFixed(1) + ' GeV, over the quartic laws tried. The comparison is not blind.',
        keys: ['higgs'], more: [] },
    ] },
    { id: 'lattice', title: 'On the lattice', note: 'computed from the chain’s couplings and in the source’s colour sector', status: 'declared', page: 'transitions', rows: lattice },
  ].filter((g) => g.rows.length);

  // ------------------------------------------------ optional cards of the research lanes
  const lanes = [];
  const lane = (key, o) => { const c = laneCard(live[key]); if (c.state !== 'missing' || waiting(live[key + 'p'])) lanes.push({ ...o, laneId: key.toUpperCase(), lane: c }); };
  lane('il', { id: 'il', band: 'conditional', status: 'conditional', pict: 'lift', page: 'defects', title: 'The integer lift of the register', sub: 'census of the run beyond the class modulo 6', keys: ['run'], more: [] });
  lane('lr', { id: 'lr', band: 'conditional', status: 'conditional', pict: 'dial', page: 'leptons', title: 'The register, executed', sub: 'phase per unit clock time over many ticks', keys: ['lepton'], more: [] });
  lane('av', { id: 'av', band: 'conditional', status: 'conditional', pict: 'balance', page: 'couplings', title: 'The class balance behind v', sub: 'measured in the gauge ensemble', keys: ['coupling'], more: L.LV });

  // ------------------------------------------------ open: what the source does not give yet (no comparisons)
  const c_sin = compare(SOURCE_BUILT.sin2, M.sin2.v), c_stack = compare(STACK_FORM.v, M.v.v);
  const pctWord = (rel) => (Math.abs(rel) * 100).toFixed(1) + ' percent ' + (rel < 0 ? 'low' : 'high');
  const open = [
    { id: 'hypercharge', title: 'The hypercharge slope', sub: 'the source as built gives sin<sup>2</sup>θ<sub>W</sub> = ' + SOURCE_BUILT.sin2.toFixed(4) + ', ' + pctWord(c_sin.rel), marks: ['sin2', 'alpha_s'], page: 'couplings',
      text: 'The source as built, with one Higgs doublet and 16 + 16̅ per copy, runs the slopes ' + SOURCE_BUILT.slopes + '. It gives sin<sup>2</sup>θ<sub>W</sub> = ' + SOURCE_BUILT.sin2.toFixed(4) + ' and α<sub>s</sub> = ' + SOURCE_BUILT.alpha_s.toFixed(4) + '. The declared slopes need a second doublet and 8/5 less in b<sub>1</sub>, or a U(1) normalisation near 1.09. The source contains neither.',
      keys: ['coupling'], more: L.CH },
    { id: 'mu_power', title: 'The power P<sup>2/3</sup> in the unification scale', sub: 'the stack’s own form gives v = ' + STACK_FORM.v.toFixed(1) + ' GeV, ' + pctWord(c_stack.rel), marks: ['v'], page: 'couplings',
      text: 'The stack gives M<sub>U</sub> = E<sub>cell</sub> exp(−2π), which puts v at ' + STACK_FORM.v.toFixed(2) + ' GeV. The declared extra factor P<sup>2/3</sup> has no source reading.',
      keys: ['coupling'], more: L.CU },
    { id: 'anchor', title: 'The anchor and the collar law', sub: 'the anchor at m<sub>Z</sub> has one premise · the collar law is declared', marks: [], page: 'couplings',
      text: 'The anchor at m<sub>Z</sub> is the first freeze of the weak currents, with one premise. The collar law’s weight d<sub>R</sub> and shape number 1 close the chain. They are declared and have no construction in the source yet.',
      keys: ['coupling'], more: cat(L.CA, L.CG) },
    { id: 'quarks', title: 'Quark masses and mixing', sub: 'excluded in all 30 readings tried', marks: [], page: 'spectrum',
      text: 'The lepton circulant moved to the quark junction gives equal up and down spectra and no mixing. It is excluded in all 30 readings tried. Open: the quark masses, the split between up and down, and the CKM matrix.',
      keys: ['spectrum', 'yukawa', 'mixing'], more: [] },
    { id: 'neutrinos', title: 'Neutrino masses and mixing', sub: 'Dirac with the common lepton amplitude is excluded', marks: [], page: 'spectrum',
      text: 'In the declared number-conserving sector, the common lepton amplitude would give a neutrino the electron’s mass, which is excluded. No physical neutrino identity, mass or mixing angle is derived.',
      keys: ['neutral', 'mixing'], more: L.DG },
    { id: 'lepton_scale', title: 'The lepton scale', sub: 'masses in MeV with no measured input need one number, y<sub>J</sub>', marks: [], page: 'leptons',
      text: 'The register gives ratios. Masses in MeV with no measured input need one more number, the lepton scale y<sub>J</sub>. The measured masses need y<sub>J</sub> = ' + NEEDED.y_J + '. The source gives no value yet.',
      keys: [], more: L.steps },
    { id: 'mass_term', title: 'The Higgs mass term', sub: 'of cell size in every regulator', marks: [], page: 'couplings',
      text: 'The mass term induced for the Higgs register is of cell size in every regulator. No rule on file removes it. The electroweak scale needs a value 8.6 × 10<sup>31</sup> times smaller.',
      keys: ['higgs'], more: L.LV },
    { id: 'asymmetry', title: 'Matter over antimatter', sub: 'the run gives equal numbers: ' + fmtInt(run.t444) + ' against ' + fmtInt(run.t222) + ' triples at level 6', marks: [], page: 'cosmos',
      text: 'The run gives equal numbers: ' + fmtInt(run.t444) + ' carriers {4,4,4} against ' + fmtInt(run.t222) + ' carriers {2,2,2} at level 6, where the Poisson scale is ' + Math.round(run.poisson) + '. The asymmetry is open.',
      keys: ['run'], more: L.early },
  ];
  const mx = matrix(live.pd);
  mx.more = cat(L.cert, mx.source === 'file' ? L.pd : []);
  return { matrix: mx, statements, constructions, groups, lanes, open, run };
}

// ---------------------------------------------------------------- rows of the lattice lanes
const laneBase = (t, o) => ({ ...o, state: t.state, meas: t.ref, cite: t.cite, lane: true, cmp: null, modelText: '', more: [], note: t.status || '' });
function electroweakRow(file) {
  const t = electroweak(file);
  const row = laneBase(t, { id: 'ew', laneId: 'EW', sym: 'T<sub>c</sub> electroweak', unit: 'GeV', name: 'electroweak crossover temperature', refWord: 'reference', refUrl: REF.ew.url, what: WHAT.ew + ' ' + str(file && file.oph && file.oph.scope_note), keys: ['coupling'],
    text: 'The chain’s declared couplings and v enter an imported three-dimensional effective theory simulated on the lattice. The Standard Model comparison is not blind. ' + str(file && file.oph && file.oph.scope_note) });
  if (t.state !== 'ok') return row;
  return { ...row, model: t.value, sModel: t.err, statisticalRange: t.statisticalRange, modelText: t.value.toFixed(2), cmp: { rel: t.value / t.ref.v - 1, abs: t.value - t.ref.v, sigma: null, relSigma: null }, kind: t.kind };
}
function colourRow(file) {
  const t = colour(file);
  const row = laneBase(t, { id: 'qcd', laneId: 'QCD', sym: 'colour transition', unit: '', name: 'colour transition', refWord: 'reference', refUrl: REF.qcd.url, what: WHAT.qcd, keys: ['hadrons'],
    text: 'Pure SU(3) gauge theory with the plaquette action, the colour sector of the source, at finite temperature. A temperature in MeV is compared only when the lane computes the route to MeV. Otherwise the row states the order of the transition and the critical temperature in units of the string tension root.' });
  if (t.state === 'order') {
    const parts = [], num = (q, dec) => (q[1] ? paren(q[0], q[1], dec) : q[0].toFixed(dec)), facts = [];
    if (t.order) parts.push(t.order + ' order');
    else if (t.exponent) parts.push('χ<sub>max</sub> ∝ N<sub>s</sub><sup>' + num(t.exponent, 2) + '</sup>' + (t.exponent[2] ? ', first order: ' + t.exponent[2] : ''));
    if (t.tc) parts.push('T<sub>c</sub>/√σ = ' + num(t.tc, 3)); else if (t.tcLower) parts.push('T<sub>c</sub>/√σ ≥ ' + num(t.tcLower, 3));
    if (t.betaC) facts.push('critical coupling β<sub>c</sub> = ' + num(t.betaC, 4) + (t.Nt ? ' at N<sub>t</sub> = ' + t.Nt : ''));
    return { ...row, meas: null, none: parts.join(' · '), facts, routeNote: t.routeNote };
  }
  if (t.state !== 'ok') return t.state === 'missing' || t.state === 'placeholder' ? { ...row, meas: null } : row;
  return { ...row, unit: 'MeV', model: t.value, sModel: t.err, modelText: t.err ? t.value.toFixed(1) + '(' + t.err.toFixed(1) + ')' : t.value.toFixed(1), cmp: compare(t.value, t.ref.v, t.ref.s, t.err) };
}
function hadronRow(kind, file) {
  const t = hadron(kind, file), ratio = kind === 'ratio';
  if (!ratio && t.state !== 'ok') return null;                  // a GeV value only when the lane computes its route
  const row = laneBase(t, { id: ratio ? 'had_ratio' : 'had_nucleon', laneId: 'HAD', sym: ratio ? 'm<sub>N</sub> / m<sub>ρ</sub>' : 'm<sub>N</sub>', unit: ratio ? '' : 'GeV', name: ratio ? 'nucleon over rho mass' : 'nucleon mass',
    status: 'conditional', what: ratio ? WHAT.had : WHAT.hadGeV, keys: ['hadrons'],
    text: ratio ? 'The gauge group SU(3), the plaquette action and the colour triplet are the source’s. The Wilson fermion and the quenched approximation are choices of the computation. The quark masses are open in the model, so the ratio is taken in the chiral limit. The measured ratio is the mean nucleon mass over the rho mass.'
      : 'The nucleon mass of the same lattice computation in GeV. The row appears only when the lane computes the route to GeV.' });
  if (t.state !== 'ok') return row;
  return { ...row, model: t.value, sModel: t.err, modelText: t.err ? paren(t.value, t.err, 3) : t.value.toFixed(3), cmp: compare(t.value, t.ref.v, t.ref.s, t.err), route: t.route };
}
