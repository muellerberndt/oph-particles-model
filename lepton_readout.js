// A class-3 defect becoming a definite electron, muon or tau when its mass is read.
// Port of repair-law/work/LEPTON_READOUT/lepton_readout.py (theory session; FR, FR2, CK, LNAT3). No DOM in the engine.
// Register: three positions j of the repair current around the face; characters v_k(j) = w^(-jk)/sqrt3, w = e^(2 pi i/3);
// rates per tick y_k for k = 0 tau, 1 electron, 2 muon. A defect at a definite position starts as (1, 0, 0).
// Mass read: phase estimation with a clock of T levels; outcome m has amplitude a_m(y) = (1/T) sum_t e^{i t (2 pi m / T - y)}.
export const Y = [0.2096935560, 0.0000603006, 0.0124683656];
export const NAMES = ['tau', 'electron', 'muon'];
export const SYMS = ['τ', 'e', 'μ'];
const W = (k) => [Math.cos(2 * Math.PI * k / 3), Math.sin(2 * Math.PI * k / 3)];
const cm = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];

// state in the character basis: c_k (complex); position amplitudes psi_j = sum_k v_k(j) c_k
export function definitePosition(j = 0) { return [0, 1, 2].map((k) => { const w = W((j * k) % 3); return [w[0] / Math.sqrt(3), w[1] / Math.sqrt(3)]; }); }  // c_k = conj(v_k(j))
export function evolve(c, t) { return c.map((z, k) => cm(z, [Math.cos(-t * Y[k]), Math.sin(-t * Y[k])])); }
export function positions(c) {
  return [0, 1, 2].map((j) => { let re = 0, im = 0; for (let k = 0; k < 3; k++) { const v = W((3 - (j * k) % 3) % 3), z = cm(v, c[k]); re += z[0] / Math.sqrt(3); im += z[1] / Math.sqrt(3); } return re * re + im * im; });
}
export const weights = (c) => c.map((z) => z[0] * z[0] + z[1] * z[1]);
// amplitude of clock outcome m for rate y (closed form of the geometric sum)
export function amp(m, y, T) {
  const ph = 2 * Math.PI * m / T - y;
  if (Math.abs(Math.sin(ph / 2)) < 1e-14) return [1, 0];
  const num = [Math.cos(T * ph) - 1, Math.sin(T * ph)], den = [Math.cos(ph) - 1, Math.sin(ph)];
  const d = den[0] * den[0] + den[1] * den[1];
  return [(num[0] * den[0] + num[1] * den[1]) / (d * T), (num[1] * den[0] - num[0] * den[1]) / (d * T)];
}
// one complete mass read: outcome distribution over all m, a drawn outcome, and the posterior state
export function readMass(c, T, rand = Math.random) {
  const P = new Float64Array(T); let tot = 0;
  for (let m = 0; m < T; m++) { let p = 0; for (let k = 0; k < 3; k++) { const a = amp(m, Y[k], T); p += (c[k][0] ** 2 + c[k][1] ** 2) * (a[0] ** 2 + a[1] ** 2); } P[m] = p; tot += p; }
  let u = rand() * tot, m = 0; for (; m < T - 1; m++) { u -= P[m]; if (u <= 0) break; }
  const post = c.map((z, k) => cm(z, amp(m, Y[k], T))); const n = Math.sqrt(weights(post).reduce((a, b) => a + b, 0));
  return { m, freq: 2 * Math.PI * m / T, prob: P[m] / tot, total: tot, state: post.map((z) => [z[0] / n, z[1] / n]) };
}
