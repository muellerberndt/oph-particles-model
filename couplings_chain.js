// The gauge-coupling chain, computed live. Pure functions with no DOM: the Couplings page (couplings_page.js) and the
// node check (couplings_check.mjs) run the same code.
//
// Ported from the reference implementation of the chain, repair-law/work/COUPLING/closure_check.py and
// closure_variants.py, with the options of the worker chains (CH: normalisation of the U(1) coupling at M_U and the
// prefactor of the law for v; CU: the form of M_U and the reading scale). The closure is the one of the paper
// extra/fine_structure_constant_derivation.tex of the theory repository:
//   E_cell = E*/sqrt(P)                                    one radian of phase per tick
//   M_U    = E_cell exp(-2 pi) P^c                         declared c = 2/3; the stack's own form has c = 0
//   v      = f E_cell exp(-2 pi / (4 alpha_U))             the 4 is the plaquette count of the class-3 flux; declared f = 1
//   1/alpha_i(mu) = c_i/alpha_U + (b_i / 2 pi) ln(M_U/mu)  one loop; c_1 = (3/5) c_Y, c_2 = c_3 = 1
//   mu_A = m_Z(mu_A),  m_Z(mu) = v sqrt(pi (alpha_2 + alpha_Y)),  alpha_Y = (3/5) alpha_1      the electroweak anchor
//   ellbar_SU(2)(4 pi^2 alpha_2(mu_A)) + ellbar_SU(3)(4 pi^2 alpha_3(mu_A)) = P/4               solved for alpha_U
// Status of the chain: declared forms that fit; the derivation is open (reports CA, CU, CH, CG of the theory session).
// No measured value enters the solver. The constant MEASURED is used for the comparison only, which is not blind.

const TWO_PI = 2 * Math.PI;

export const E_STAR = 1.220890e19;             // GeV: the chain's energy unit, the Planck energy
export const PHI = (1 + Math.sqrt(5)) / 2;
export const P_FIXED = 1.6309721;              // the pixel ratio a_cell / l*^2 at the chain's fixed point (paper: 1.630972095858897)
export const BETA_EW = 4;                      // 8 pi^2 / tr H_3^2, the count of the weak-centre flux

// ---------------------------------------------------------------- exact fractions [numerator, denominator]
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
export const frac = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
export const fsub = (a, b) => frac(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
export const fdiv = (a, b) => frac(a[0] * b[1], a[1] * b[0]);
export const fval = (a) => a[0] / a[1];
export const fstr = (a) => (a[1] === 1 ? String(a[0]) : `${a[0]}/${a[1]}`);

// ---------------------------------------------------------------- one-loop slopes
// Source census with n_H Higgs doublets: 16 + 16bar Weyl patterns per copy, three copies, twelve gauge currents.
export const censusSlopes = (nH) => [frac(80 + nH, 10), frac(4 + nH, 6), frac(-3)];
export const SLOPES = {
  declared: [frac(33, 5), frac(1), frac(-3)],
  none: censusSlopes(0), one: censusSlopes(1), two: censusSlopes(2), three: censusSlopes(3),
  standardModel: [frac(41, 10), frac(-19, 6), frac(-7)],
};
// (b2 - b3)/(b1 - b2): with equal couplings at M_U this is (1/alpha_2 - 1/alpha_3)/(1/alpha_1 - 1/alpha_2) at every scale below M_U
export const slopeRatio = (b) => fdiv(fsub(b[1], b[2]), fsub(b[0], b[1]));
export const ratioOf = (inv) => (inv[1] - inv[2]) / (inv[0] - inv[1]);

// ---------------------------------------------------------------- heat-kernel sector sums of the closure
// ellbar_G(t) = sum_R d_R exp(-t C2(R)) ln d_R / sum_R d_R exp(-t C2(R)); terms below the smallest double are skipped
export function ell2(t, N = 120) {
  let z = 0, s = 0;
  for (let n = 0; n <= N; n++) {
    const j = n / 2, d = 2 * j + 1, w = d * Math.exp(-t * j * (j + 1));
    z += w; s += w * Math.log(d);
  }
  return s / z;
}
export function ell3(t, N = 60) {
  let z = 0, s = 0;
  for (let p = 0; p <= N; p++) {
    if (t * (p * p + 3 * p) / 3 > 745) break;
    for (let q = 0; q <= N; q++) {
      const c = (p * p + q * q + p * q + 3 * p + 3 * q) / 3;
      if (t * c > 745) break;
      const d = (p + 1) * (q + 1) * (p + q + 2) / 2, w = d * Math.exp(-t * c);
      z += w; s += w * Math.log(d);
    }
  }
  return s / z;
}

// ---------------------------------------------------------------- the chain
// Options: P, slopes (three fractions or numbers), c (power of P in M_U), pref (prefactor f of the law for v), cY (U(1)
// normalisation at M_U, SU(5) value 5/3), rho (the closure is read at mu = rho m_Z(mu)), read ('mZ' or 'mW'), beta.
export function setup(o = {}) {
  if (o.Ecell) return o;
  const P = o.P ?? P_FIXED, c = o.c ?? 2 / 3, slopes = o.slopes ?? SLOPES.declared;
  const Ecell = E_STAR / Math.sqrt(P), MU = Ecell * Math.exp(-TWO_PI) * Math.pow(P, c);
  return { P, c, slopes, b: slopes.map((s) => (Array.isArray(s) ? fval(s) : s)), beta: o.beta ?? BETA_EW, pref: o.pref ?? 1,
    cY: o.cY ?? 5 / 3, rho: o.rho ?? 1, read: o.read ?? 'mZ', Ecell, MU, R: Math.log(Ecell / MU) };
}
// inverse couplings a logarithm L = ln(M_U/mu) below M_U, for the unified inverse coupling x
export const runInverse = (s, x, L) => [0.6 * s.cY * x + s.b[0] * L / TWO_PI, x + s.b[1] * L / TWO_PI, x + s.b[2] * L / TWO_PI];
const positive = (i) => i[0] > 0 && i[1] > 0 && i[2] > 0;

// the chain at a trial unified coupling x = 1/alpha_U: v, the anchor, the couplings there, the left side of the closure
export function chainAt(x, o = {}) {
  const s = setup(o), v = s.pref * s.Ecell * Math.exp(-TWO_PI * x / s.beta);
  let mu = 91.0, i = null;
  for (let n = 0; n < 600; n++) {
    i = runInverse(s, x, Math.log(s.MU / mu));
    if (!positive(i)) return null;
    const m = s.rho * v * Math.sqrt(Math.PI * (s.read === 'mW' ? 1 / i[1] : 1 / i[1] + 0.6 / i[0]));
    if (!(m > 0) || !Number.isFinite(m)) return null;
    const done = Math.abs(m - mu) < 1e-13 * mu;
    mu = m;
    if (done) break;
  }
  i = runInverse(s, x, Math.log(s.MU / mu));
  if (!positive(i)) return null;
  const a2 = 1 / i[1], a3 = 1 / i[2], aY = 0.6 / i[0], l2 = ell2(4 * Math.PI * Math.PI * a2), l3 = ell3(4 * Math.PI * Math.PI * a3);
  return { ...s, x, v, mu, mZ: v * Math.sqrt(Math.PI * (a2 + aY)), mW: v * Math.sqrt(Math.PI * a2), inv: i, alphaS: a3,
    sin2: aY / (aY + a2), aemInv: i[1] + i[0] / 0.6, ell2: l2, ell3: l3, lhs: l2 + l3, target: s.P / 4 };
}
function bisect(f, a, b, fa) {
  for (let n = 0; n < 80; n++) {
    const m = 0.5 * (a + b), fm = f(m);
    if (m === a || m === b) break;
    if ((fm < 0) === (fa < 0)) { a = m; fa = fm; } else b = m;
  }
  return 0.5 * (a + b);
}
// every root of the closure in x = 1/alpha_U on the scanned interval, each as a solved chain (empty list: no root)
export function solveChain(o = {}, scan = {}) {
  const s = setup(o), lo = scan.lo ?? 6, hi = scan.hi ?? 80, n = scan.n ?? 600;
  const f = (x) => { const c = chainAt(x, s); return c ? c.lhs - c.target : NaN; };
  const roots = [];
  let x0 = lo, f0 = f(lo);
  for (let k = 1; k < n; k++) {
    const x1 = lo + (hi - lo) * k / (n - 1), f1 = f(x1);
    if (Number.isFinite(f0) && Number.isFinite(f1) && f0 * f1 < 0) roots.push(chainAt(bisect(f, x0, x1, f0), s));
    x0 = x1; f0 = f1;
  }
  return roots;
}
// inverse couplings of a solved chain at the scale mu. Between M_U and the cell the chain holds them at their M_U
// values: its law for v reads alpha_U at the cell.
export function inverseAt(sol, mu) { return runInverse(sol, sol.x, Math.max(0, Math.log(sol.MU / mu))); }
export function readAt(sol, mu) {
  const i = inverseAt(sol, mu), a2 = 1 / i[1], aY = 0.6 / i[0], t = 4 * Math.PI * Math.PI;
  return { mu, inv: i, alphaS: 1 / i[2], sin2: aY / (aY + a2), aemInv: i[1] + i[0] / 0.6, lhs: ell2(t * a2) + ell3(t / i[2]) };
}

// ---------------------------------------------------------------- the variants of the page
// declared: the paper's chain. source: the source as built (one Higgs doublet, 16 + 16bar per copy) with the multiplicity
// 2 of its law for v (reports CH and LV). two: the source census with a second doublet. stack: the declared slopes with
// the stack's own form of M_U, one modular period below the cell (report CU).
export const VARIANTS = {
  declared: { slopes: SLOPES.declared, c: 2 / 3, pref: 1 },
  source: { slopes: SLOPES.one, c: 2 / 3, pref: 2 },
  two: { slopes: SLOPES.two, c: 2 / 3, pref: 1 },
  stack: { slopes: SLOPES.declared, c: 0, pref: 1 },
};
const solved = new Map();
export function variant(key) {
  if (!solved.has(key)) { const r = solveChain(VARIANTS[key]); solved.set(key, r.length === 1 ? r[0] : null); }
  return solved.get(key);
}

// ---------------------------------------------------------------- measured values (comparison only, not blind)
// Particle Data Group, Review of Particle Physics 2024: table "Physical Constants" (m_W, m_Z, alpha_s, sin^2 theta_W) and
// the review "Electroweak Model and Constraints on New Physics" (1/alpha_em(m_Z), v from the Fermi constant). sin^2 theta_W
// and 1/alpha_em are MS-bar values at m_Z. Earlier editions had sin^2 theta_W = 0.23122(4) and 1/alpha_em(m_Z) = 127.951(9),
// the values the theory reports compared with. Deviations computed here can differ from theirs in the last printed digit.
export const MEASURED = {
  v: { value: 246.22, err: 0 },
  alphaS: { value: 0.1180, err: 0.0009 },
  sin2: { value: 0.23129, err: 0.00004 },
  aemInv: { value: 127.930, err: 0.008 },
  mZ: { value: 91.1880, err: 0.0020 },
  mW: { value: 80.3692, err: 0.0133 },
  alpha0Inv: { value: 137.035999177, err: 0.000000021 },      // CODATA 2022, the inverse fine-structure constant at zero momentum
};
export const MEASURED_SOURCE = { name: 'Particle Data Group 2024', url: 'https://pdg.lbl.gov/' };
export const CODATA_SOURCE = { name: 'CODATA 2022', url: 'https://physics.nist.gov/cuu/Constants/' };
// inverse couplings at m_Z from the measured mixing angle, electromagnetic and strong coupling, SU(5)-normalised alpha_1,
// and the ratio of their differences, with errors propagated in quadrature
export function measuredCouplings(m = MEASURED) {
  const at = (s, A, a3) => { const inv = [0.6 * (1 - s) * A, s * A, 1 / a3]; return { inv, ratio: ratioOf(inv) }; };
  const c = at(m.sin2.value, m.aemInv.value, m.alphaS.value);
  const up = [at(m.sin2.value + m.sin2.err, m.aemInv.value, m.alphaS.value), at(m.sin2.value, m.aemInv.value + m.aemInv.err, m.alphaS.value),
    at(m.sin2.value, m.aemInv.value, m.alphaS.value + m.alphaS.err)];
  const q = (get) => Math.hypot(...up.map((u) => get(u) - get(c)));
  return { inv: c.inv, invErr: [0, 1, 2].map((k) => q((u) => u.inv[k])), ratio: c.ratio, ratioErr: q((u) => u.ratio) };
}

// ---------------------------------------------------------------- flux classes and their counts
// Port of model/defect_particle_classes/flux_costs.py of the theory repository. The class-k element is exp(2 pi i k Y)
// on the five-level code: eigenphases -2k/3 (three colour levels) and k (two weak levels) in units of pi, each modulo 2.
// The shortest traceless generator H_k has tr H^dag H = pi^2 sum x_j^2, and the count is 8 pi^2 / tr H^dag H.
export function fluxClasses(span = 3) {
  const rows = [], lexLess = (a, b) => { for (let j = 0; j < 5; j++) if (a[j] !== b[j]) return a[j] < b[j]; return false; };
  for (let k = 0; k < 6; k++) {
    const base = [-2 * k, -2 * k, -2 * k, 3 * k, 3 * k];          // in units of pi/3
    let best = null;
    const n = [-span, -span, -span, -span, -span];
    for (;;) {
      const x = base.map((b, j) => b + 6 * n[j]);
      if (x.reduce((a, b) => a + b, 0) === 0) {
        const s = x.reduce((a, b) => a + b * b, 0);
        if (!best || s < best.s || (s === best.s && lexLess(x, best.x))) best = { s, x };
      }
      let j = 4;
      while (j >= 0 && n[j] === span) { n[j] = -span; j--; }
      if (j < 0) break;
      n[j]++;
    }
    rows.push({ k, phases: best.x.map((v) => frac(v, 3)), trace: frac(best.s, 9), count: best.s ? frac(72, best.s) : null });
  }
  return rows;
}

// ---------------------------------------------------------------- the paper's outer fixed point of the pixel ratio
// P = phi + sqrt(pi) / A(P), A(P) = 1/alpha_em(m_Z; P) + transport(P). The transport from m_Z to zero momentum is the
// paper's declared one: exact one-loop kernels on a supplied charged spectrum (Koide roots at phase 2/9, powers of 1/6)
// and a declared screening factor on the five light quarks. It is a declared map; the page takes its fixed point as input.
const kernel = (z) => { const a = z / 4; return -5 / 18 + 1 / (6 * a) + (2 * a - 1) * Math.sqrt(1 + a) * Math.asinh(Math.sqrt(a)) / (6 * Math.pow(a, 1.5)); };
const loop = (Q2, m, q, n) => 2 * n * q * q / Math.PI * kernel(Q2 / (m * m));
export function thomsonTransport(sol) {
  const v = sol.v, Q2 = sol.mZ * sol.mZ, h = v / Math.SQRT2, eps = 1 / 6, exps = [7, 4, 3];
  const r = [0, 1, 2].map((k) => 1 + Math.SQRT2 * Math.cos(2 / 9 + TWO_PI * k / 3)).sort((a, b) => a - b);
  const logg = r.reduce((s, ra, a) => s + Math.log(ra * ra * Math.SQRT2 * Math.pow(6, exps[a]) / v), 0) / 3;
  const scale = Math.exp(-logg) * Math.pow(2, 1 / 6), leptons = r.map((ra) => scale * ra * ra);
  const lep = leptons.reduce((s, m) => s + loop(Q2, m, 1, 1), 0);
  const quarks = [[h * eps ** 6, 2 / 3], [h * eps ** 6, -1 / 3], [h * eps ** 4, -1 / 3], [h * eps ** 3, 2 / 3], [h * eps ** 2, -1 / 3]];
  const naive = quarks.reduce((s, [m, q]) => s + loop(Q2, m, q, 3), 0), screen = 1 - 3 * sol.alphaS / Math.PI;
  const delta = lep + screen * naive;
  return { leptons, lep, naive, screen, delta, AZ: sol.aemInv, AT: sol.aemInv + delta };
}
export function pixelFixedPoint(o = {}, P0 = P_FIXED) {
  let P = P0, out = null;
  for (let n = 0; n < 60; n++) {
    const r = solveChain({ ...o, P }, { lo: 20, hi: 30, n: 40 });
    if (r.length !== 1) return null;
    const t = thomsonTransport(r[0]), next = PHI + Math.sqrt(Math.PI) / t.AT;
    out = { sol: r[0], ...t };
    const done = Math.abs(next - P) < 1e-15;
    P = next;
    if (done) break;
  }
  return { P, ...out };
}
