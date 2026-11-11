// Engine of the page "No wave function": a double slit executed with the routing tick on a sheet of carriers.
// The tick is the one of cf1_engine.js, unchanged (class Routing, shifts S_i = P+ T_i + P- T_i* with the link variable
// they cross). Check: node nowave_check.mjs. No DOM here. The same file runs as a module worker (end of the file).
//
// The sheet has n1 cells along the beam and n2 across it and is one cell thick, so the third shift is the identity
// and one tick is S_2 S_1. This is the ordered routing law of the public proof (S_3 S_2 S_1) at rest angle zero. On a
// sheet both helicities have the phase cos E = cos p1 cos p2 per tick, one cone per sublattice.
//
// Declared instruments, supplied to the walk (none of them is derived from the repair law):
//   recording cells   the wall outside the two openings, the detector wall, a wall behind the source and one row at
//                     the edge of the sheet. After every tick each of these cells reads "is the quantum here". The
//                     weight found in the cell is the probability of that record (Born weight), and the amplitude in
//                     the cell is removed from the alternatives that stay open (Lueders rule).
//   opening recorder  one record register (blank, written) owned by the cells of the upper opening. It is reflected
//                     by V(phi) = [[cos phi, sin phi], [sin phi, -cos phi]] whenever the quantum crosses the seam
//                     from one of these cells to the cell behind it, in either direction. V is a Hermitian
//                     involution, the type of the seam repair with an owned record. phi = 0 writes nothing,
//                     phi = pi/2 writes a full record.
//
// Exact reduction used here. V(phi) has the eigenvalues +1 and -1 with eigenvectors e+ = (cos phi/2, sin phi/2) and
// e- = (-sin phi/2, cos phi/2), and blank = cos(phi/2) e+ - sin(phi/2) e-. On e+ the recorder does nothing. On e-
// the crossing changes the sign of the amplitude: the seams behind the upper opening carry the link sign -1, which
// the shift of the engine reads. So two runs of the tick give every strength:
//   F+   both openings open
//   F-   both openings open, link sign -1 on the seams behind the upper opening
//   state at strength phi:  cos(phi/2) F+ (x) e+  -  sin(phi/2) F- (x) e-
// With the accumulated weights pp = sum |F+|^2, mm = sum |F-|^2 and pm = sum Re(conj(F+) F-) of a recording cell:
//   record in the cell, register unread        cos^2(phi/2) pp + sin^2(phi/2) mm
//   record in the cell and register written    (1/4) sin^2(phi) (pp + mm - 2 pm)
//   record in the cell and register blank      the difference of the two
// psiA = (F+ - F-)/2 is the part that crossed behind the upper opening an odd number of times, psiB = (F+ + F-)/2
// the rest. Behind the wall psiB is the mirror image of psiA.
import { Routing, phases } from './cf1_engine.js';

export const SETUP = Object.freeze({
  n1: 264, n2: 288,        // cells along the beam and across it
  xb: 2,                   // recording wall behind the source
  xs: 67, wx: 64, wy: 143, // preparation: centre along the beam, half length along it and half width across it
  k: 0.4,                  // wave number per cell along the beam
  xw: 132,                 // the wall
  a: 11, d: 64,            // width of an opening and distance between the two centres, in cells (a odd, d even)
  xd: 260,                 // the detector wall
  every: 3,                // a picture of the open alternatives is kept every so many ticks
  gd: 4, gw: 2,            // cell blocks of the two kinds of picture (weight on the registers, bookkeeping wave)
  maxTicks: 340, floor: 2e-7,
});
// the prepared register state of every cell: record register in the +1 state of X, spin along the beam. It is the
// +1 state of alpha_1 = X (x) sigma_1 that is unchanged by the mirror across the beam.
const COIN = 0.5;

export function openings(S = SETUP) {
  const y0 = S.n2 >> 1, h = (S.a - 1) >> 1;
  return { y0, h, A: [y0 + S.d / 2 - h, y0 + S.d / 2 + h], B: [y0 - S.d / 2 - h, y0 - S.d / 2 + h] };
}

// the prepared state: a cos^2 envelope of half length wx along the beam and half width wy across it (compact support:
// no weight on any recording cell at the start), wave number k along the beam. The weight is the square, cos^4, with
// standard deviations 0.283 wx and 0.283 wy.
function prepare(eng, S) {
  const { n1, n2 } = S, y0 = S.n2 >> 1, h = Math.PI / 2;
  eng.clear();
  for (let a = 0; a < n1; a++) {
    const dx = a - S.xs; if (Math.abs(dx) >= S.wx) continue;
    const gx = Math.cos(h * dx / S.wx) ** 2, cr = Math.cos(S.k * dx) * gx * COIN, ci = Math.sin(S.k * dx) * gx * COIN;
    for (let b = 1; b < n2; b++) {
      const dy = b - y0; if (Math.abs(dy) >= S.wy) continue;
      const g = Math.cos(h * dy / S.wy) ** 2, o = 4 * (a * n2 + b);
      for (let q = 0; q < 4; q++) { eng.re[o + q] = cr * g; eng.im[o + q] = ci * g; }
    }
  }
  eng.normalize();
}

export class DoubleSlit {
  // opts.open: which openings are open, 'both' (default), 'A' or 'B' (used by the check); opts.pictures: keep pictures
  constructor(S = SETUP, opts = {}) {
    this.S = S; const { n1, n2 } = S;
    this.P = new Routing(n1, n2, 1); this.M = new Routing(n1, n2, 1);
    prepare(this.P, S); this.M.copyFrom(this.P);
    const op = openings(S), open = opts.open || 'both';
    this.op = op; this.wallCell = new Uint8Array(n2).fill(1);
    // run F-: the engine's static link signs, -1 on the seams from the cells of the upper opening to the cells behind them
    const ones = () => new Float64Array(n1 * n2).fill(1), links = [ones(), ones(), ones()];
    // (the two wall cells beside the opening are included: within one tick a backward step can land on them and slip into the opening)
    if (open !== 'B') { for (let y = op.A[0]; y <= op.A[1]; y++) this.wallCell[y] = 0; for (let y = op.A[0] - 1; y <= op.A[1] + 1; y++) links[0][S.xw * n2 + y] = -1; }
    if (open !== 'A') for (let y = op.B[0]; y <= op.B[1]; y++) this.wallCell[y] = 0;
    this.M.links = links;
    const acc = () => ({ pp: new Float64Array(n2), mm: new Float64Array(n2), pm: new Float64Array(n2) });
    this.det = acc(); this.wall = acc();
    this.back = { pp: 0, mm: 0, pm: 0 }; this.side = { pp: 0, mm: 0, pm: 0 };
    this.timeDet = new Float64Array(S.maxTicks + 1); this.timeWall = new Float64Array(S.maxTicks + 1);
    this.t = 0; this.done = false; this.left = 1;
    this.pictures = opts.pictures !== false;
    if (this.pictures) {
      const dw = Math.floor(n1 / S.gd), dh = Math.floor(n2 / S.gd), ww = Math.floor(n1 / S.gw), wh = Math.floor(n2 / S.gw), cap = Math.ceil(S.maxTicks / S.every) + 2;
      this.pic = { every: S.every, count: 0, dw, dh, ww, wh, ticks: new Int32Array(cap),
        dP: new Uint8Array(cap * dw * dh), dM: new Uint8Array(cap * dw * dh), dX: new Int8Array(cap * dw * dh), dScale: new Float32Array(cap),
        wP: new Int8Array(cap * ww * wh), wM: new Int8Array(cap * ww * wh), wScale: new Float32Array(cap), weight: new Float32Array(cap) };
      this._tmpD = [new Float32Array(dw * dh), new Float32Array(dw * dh), new Float32Array(dw * dh)]; this._tmpW = [new Float32Array(ww * wh), new Float32Array(ww * wh)];
      this.picture();
    }
  }
  // the recording cell (x, y): add its weights to the accumulators and remove its amplitude from both runs
  _read(x, y, into, i) {
    const o = 4 * (x * this.S.n2 + y), pr = this.P.re, pi = this.P.im, mr = this.M.re, mi = this.M.im;
    let pp = 0, mm = 0, pm = 0;
    for (let q = o; q < o + 4; q++) {
      pp += pr[q] * pr[q] + pi[q] * pi[q]; mm += mr[q] * mr[q] + mi[q] * mi[q]; pm += pr[q] * mr[q] + pi[q] * mi[q];
      pr[q] = 0; pi[q] = 0; mr[q] = 0; mi[q] = 0;
    }
    if (i === undefined) { into.pp += pp; into.mm += mm; into.pm += pm; } else { into.pp[i] += pp; into.mm[i] += mm; into.pm[i] += pm; }
    return pp;
  }
  tick() {
    const S = this.S, { n1, n2 } = S;
    for (const e of [this.P, this.M]) { if (S.alternate && (e.t & 1)) { e.shift(1); e.shift(0); } else { e.shift(0); e.shift(1); } e.t++; }
    this.t++;
    // the recording cells
    let dT = 0, wT = 0;
    for (let y = 0; y < n2; y++) {
      if (this.wallCell[y]) wT += this._read(S.xw, y, this.wall, y);
      dT += this._read(S.xd, y, this.det, y);
      this._read(S.xb, y, this.back);
    }
    for (let x = 0; x < n1; x++) if (x !== S.xw && x !== S.xd && x !== S.xb) this._read(x, 0, this.side);
    this.timeDet[this.t] = dT; this.timeWall[this.t] = wT;
    if (this.pictures && this.t % S.every === 0) this.picture();
    if (this.t % 8 === 0 || this.t >= S.maxTicks) {
      this.left = this.P.norm2();
      if (this.left < S.floor || this.t >= S.maxTicks) this.done = true;
    }
    return this.done;
  }
  // a picture of the alternatives that are open after this tick: per block of cells the weights pp and mm of the two
  // runs and their cross term pm, and the amplitude of both runs along the prepared register state (the scalar wave
  // of the usual calculation). Stored with square-root companding relative to the largest value of the picture.
  picture() {
    const S = this.S, { n2 } = S, p = this.pic, f = p.count; if (f >= p.ticks.length) return;
    const pr = this.P.re, pi = this.P.im, mr = this.M.re, mi = this.M.im, [DP, DM, DX] = this._tmpD, fields = [this.P, this.M];
    let dmax = 0, wmax = 0, weight = 0;
    for (let gx = 0; gx < p.dw; gx++) for (let gy = 0; gy < p.dh; gy++) {
      let a = 0, b = 0, c = 0;
      for (let i = 0; i < S.gd; i++) { const row = 4 * ((gx * S.gd + i) * n2 + gy * S.gd);
        for (let q = row; q < row + 4 * S.gd; q++) { a += pr[q] * pr[q] + pi[q] * pi[q]; b += mr[q] * mr[q] + mi[q] * mi[q]; c += pr[q] * mr[q] + pi[q] * mi[q]; } }
      const j = gx * p.dh + gy; DP[j] = a; DM[j] = b; DX[j] = c; weight += a; if (a > dmax) dmax = a; if (b > dmax) dmax = b;
    }
    for (let s = 0; s < 2; s++) {
      const re = fields[s].re, Wv = this._tmpW[s];
      for (let gx = 0; gx < p.ww; gx++) for (let gy = 0; gy < p.wh; gy++) {
        let v = 0;
        for (let i = 0; i < S.gw; i++) { const row = 4 * ((gx * S.gw + i) * n2 + gy * S.gw); for (let q = row; q < row + 4 * S.gw; q++) v += re[q]; }
        v *= COIN / (S.gw * S.gw); Wv[gx * p.wh + gy] = v; if (Math.abs(v) > wmax) wmax = Math.abs(v);
      }
    }
    const offD = f * p.dw * p.dh, offW = f * p.ww * p.wh, id = dmax > 0 ? 1 / dmax : 0, iw = wmax > 0 ? 1 / wmax : 0;
    for (let j = 0; j < DP.length; j++) {
      p.dP[offD + j] = Math.round(255 * Math.sqrt(DP[j] * id)); p.dM[offD + j] = Math.round(255 * Math.sqrt(DM[j] * id));
      const x = Math.max(-1, Math.min(1, DX[j] * id)); p.dX[offD + j] = Math.round(127 * Math.sign(x) * Math.sqrt(Math.abs(x)));
    }
    const outW = [p.wP, p.wM];
    for (let s = 0; s < 2; s++) { const Wv = this._tmpW[s], ow = outW[s]; for (let j = 0; j < Wv.length; j++) { const v = Wv[j] * iw; ow[offW + j] = Math.round(127 * Math.sign(v) * Math.sqrt(Math.abs(v))); } }
    p.dScale[f] = dmax; p.wScale[f] = wmax; p.weight[f] = weight; p.ticks[f] = this.t; p.count = f + 1;
  }
  run(onProgress) {
    const expect = Math.min(this.S.maxTicks, this.S.xd - this.S.xs + 2 * this.S.wx);
    while (!this.done) { this.tick(); if (onProgress && this.t % 8 === 0) onProgress(Math.min(0.99, this.t / expect), this.t); }
    return this.result();
  }
  result() {
    const S = this.S, T = this.t, r = { setup: { ...S }, openings: this.op, ticks: T, left: this.left,
      det: this.det, wall: this.wall, back: this.back, side: this.side,
      timeDet: this.timeDet.slice(0, T + 1), timeWall: this.timeWall.slice(0, T + 1) };
    if (this.pictures) {
      const p = this.pic, n = p.count;
      r.pic = { every: p.every, count: n, dw: p.dw, dh: p.dh, ww: p.ww, wh: p.wh, ticks: p.ticks.slice(0, n),
        dP: p.dP.slice(0, n * p.dw * p.dh), dM: p.dM.slice(0, n * p.dw * p.dh), dX: p.dX.slice(0, n * p.dw * p.dh), dScale: p.dScale.slice(0, n),
        wP: p.wP.slice(0, n * p.ww * p.wh), wM: p.wM.slice(0, n * p.ww * p.wh), wScale: p.wScale.slice(0, n), weight: p.weight.slice(0, n) };
    }
    return r;
  }
}

// ---------------------------------------------------------------- the odds of records at a strength phi
const sum = (a) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i]; return s; };
// weights of every record of one run of the experiment. Arrays run over the cells across the beam.
export function weights(R, phi = 0) {
  const c2 = Math.cos(phi / 2) ** 2, s2 = 1 - c2, q = 0.25 * Math.sin(phi) ** 2, n = R.det.pp.length;
  const mix = (acc, i) => (i === undefined ? c2 * acc.pp + s2 * acc.mm : c2 * acc.pp[i] + s2 * acc.mm[i]);
  const wr = (acc, i) => Math.max(0, i === undefined ? q * (acc.pp + acc.mm - 2 * acc.pm) : q * (acc.pp[i] + acc.mm[i] - 2 * acc.pm[i]));
  const det = new Float64Array(n), detWritten = new Float64Array(n), wall = new Float64Array(n), wallWritten = new Float64Array(n);
  for (let i = 0; i < n; i++) { det[i] = mix(R.det, i); detWritten[i] = Math.min(det[i], wr(R.det, i)); wall[i] = mix(R.wall, i); wallWritten[i] = Math.min(wall[i], wr(R.wall, i)); }
  const back = mix(R.back), side = mix(R.side), pDet = sum(det), pWall = sum(wall);
  return { phi, det, detWritten, wall, wallWritten, back, side, pDet, pWall, pDetWritten: sum(detWritten),
    pWritten: sum(detWritten) + sum(wallWritten) + wr(R.back) + wr(R.side), rest: Math.max(0, 1 - pDet - pWall - back - side) };
}
// the two alternatives at the detector wall: the weight that crossed behind the upper opening an odd number of times
// and the rest, and their sum, which is the pattern without any interference between the two
export function alternatives(R) {
  const n = R.det.pp.length, A = new Float64Array(n), B = new Float64Array(n), E = new Float64Array(n);
  for (let i = 0; i < n; i++) { A[i] = Math.max(0, 0.25 * (R.det.pp[i] + R.det.mm[i] - 2 * R.det.pm[i])); B[i] = Math.max(0, 0.25 * (R.det.pp[i] + R.det.mm[i] + 2 * R.det.pm[i])); E[i] = 0.5 * (R.det.pp[i] + R.det.mm[i]); }
  return { A, B, E, wA: sum(A), wB: sum(B) };
}
// neighbouring cells across the beam belong to different sublattices of the walk: average them with weights 1/4, 1/2, 1/4
export function smooth(p) { const n = p.length, o = new Float64Array(n); for (let i = 1; i < n - 1; i++) o[i] = 0.25 * p[i - 1] + 0.5 * p[i] + 0.25 * p[i + 1]; o[0] = p[0]; o[n - 1] = p[n - 1]; return o; }
// the fringe function of a weight curve p: p / E - 1 with E the pattern without interference. At strength phi it is
// cos(phi) times the fringe function at strength zero.
export function fringeFunction(R, p) {
  const P = smooth(p), E = smooth(alternatives(R).E), v = new Float64Array(P.length);
  for (let i = 0; i < v.length; i++) v[i] = E[i] > 0 ? P[i] / E[i] - 1 : 0;
  return v;
}
// extrema of the fringe function at strength zero within reach cells of the centre, refined by a parabola through three points
export function fringeFrame(R, reach = 120) {
  const y0 = R.openings.y0, v = fringeFunction(R, weights(R, 0).det), ext = [];
  for (let i = Math.max(2, y0 - reach); i <= Math.min(v.length - 3, y0 + reach); i++) {
    const a = v[i - 1], b = v[i], c = v[i + 1], isMax = b > a && b >= c, isMin = b < a && b <= c; if (!isMax && !isMin) continue;
    const den = a - 2 * b + c, dx = den === 0 ? 0 : 0.5 * (a - c) / den;
    ext.push({ y: i + dx - y0, cell: i, v: b - 0.25 * (a - c) * dx, max: isMax });
  }
  const centre = ext.reduce((best, e) => (e.max && (!best || Math.abs(e.y) < Math.abs(best.y)) ? e : best), null);
  const up = ext.filter((e) => e.y > centre.y + 2), down = ext.filter((e) => e.y < centre.y - 2).reverse();
  // bright and dark fringes above and below the centre, in order: dark 1, bright 1, dark 2, bright 2
  const pick = (list) => { const out = []; let want = false; for (const e of list) { if (e.max === want) { out.push(e); want = !want; } if (out.length === 4) break; } return out; };
  const U = pick(up), L = pick(down);
  return { y0, centre, cellMax: centre.cell, cellMin: [L[0].cell, U[0].cell], dark1: 0.5 * (U[0].y - L[0].y), bright1: 0.5 * (U[1].y - L[1].y),
    dark2: U[2] && L[2] ? 0.5 * (U[2].y - L[2].y) : NaN, bright2: U[3] && L[3] ? 0.5 * (U[3].y - L[3].y) : NaN, extrema: ext };
}
// visibility of the fringes at the centre for a weight curve p: half the difference of the fringe function between
// the cell of the central bright fringe and the cells of the two dark fringes beside it
export function visibility(R, p, frame) {
  const v = fringeFunction(R, p);
  return 0.5 * (v[frame.cellMax] - 0.5 * (v[frame.cellMin[0]] + v[frame.cellMin[1]]));
}
// distinguishability of the two openings from the record register: the trace norm of wA rhoA - wB rhoB over the total
// weight, for the register states V(phi)|blank> and |blank>. Equal weights give sin(phi).
export function distinguishability(phi, wA = 1, wB = 1) {
  const g = Math.cos(phi), t = wA + wB;
  return Math.sqrt(Math.max(0, t * t - 4 * wA * wB * g * g)) / t;
}

// ---------------------------------------------------------------- the textbook numbers for the same geometry
// position of the m-th bright fringe for two point sources d apart at distance D: path difference m wavelengths
export function textbookFringe(S, m = 1, lambda = 2 * Math.PI / S.k) {
  const D = S.xd - S.xw, f = (y) => Math.hypot(D, y + S.d / 2) - Math.hypot(D, y - S.d / 2) - m * lambda;
  let lo = 0, hi = 4 * D; for (let i = 0; i < 80; i++) { const mid = 0.5 * (lo + hi); if (f(mid) > 0) hi = mid; else lo = mid; }
  return 0.5 * (lo + hi);
}
// the same with the phases of the tick itself: the phase from an opening to a point is the largest p.r over the
// wave vectors of the tick's phase E = k (stationary phase), and bright fringes sit where the two phases differ by 2 pi m
export function walkFringe(S, m = 1) {
  const alt = !!S.alternate, D = S.xd - S.xw, E = phases([S.k, 0, 0], 0, 'Y', alt)[0], curve = [];
  for (let j = -600; j <= 600; j++) {                       // wave vectors with the same phase per tick: solve E(p1, p2) = E for p1
    const p2 = j * 0.0015; let lo = 0, hi = Math.PI / 2;
    if (phases([lo, p2, 0], 0, 'Y', alt)[0] > E) continue;
    for (let i = 0; i < 50; i++) { const mid = 0.5 * (lo + hi); if (phases([mid, p2, 0], 0, 'Y', alt)[0] > E) hi = mid; else lo = mid; }
    curve.push([0.5 * (lo + hi), p2]);
  }
  const phase = (dy) => { let best = -Infinity; for (const [p1, p2] of curve) { const v = p1 * D + p2 * dy; if (v > best) best = v; } return best; };
  const f = (y) => phase(y + S.d / 2) - phase(y - S.d / 2) - 2 * Math.PI * m;
  let lo = 0, hi = 3 * D; for (let i = 0; i < 60; i++) { const mid = 0.5 * (lo + hi); if (f(mid) > 0) hi = mid; else lo = mid; }
  return 0.5 * (lo + hi);
}

// ---------------------------------------------------------------- sampling single runs
export function rng(seed = 1) {                              // mulberry32
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
// outcomes of one run at strength phi: kind 'det' or 'wall' with the cell across the beam, 'lost' for the wall behind
// the source, the edge row and the weight still open at the end. written: the register of the upper opening reads written.
export function sampler(R, phi = 0, random = Math.random) {
  const w = weights(R, phi), n = w.det.length, cum = new Float64Array(4 * n + 1);
  let s = 0;
  for (let i = 0; i < n; i++) { s += w.det[i] - w.detWritten[i]; cum[i] = s; }
  for (let i = 0; i < n; i++) { s += w.detWritten[i]; cum[n + i] = s; }
  for (let i = 0; i < n; i++) { s += w.wall[i] - w.wallWritten[i]; cum[2 * n + i] = s; }
  for (let i = 0; i < n; i++) { s += w.wallWritten[i]; cum[3 * n + i] = s; }
  cum[4 * n] = 1;
  const cdf = (t) => { const c = new Float64Array(t.length); let a = 0; for (let i = 0; i < t.length; i++) { a += t[i]; c[i] = a; } return c; };
  const cd = cdf(R.timeDet), cw = cdf(R.timeWall);
  const find = (c, u) => { let lo = 0, hi = c.length - 1; while (lo < hi) { const mid = (lo + hi) >> 1; if (c[mid] < u) lo = mid + 1; else hi = mid; } return lo; };
  return () => {
    const j = find(cum, random());
    if (j >= 4 * n) return { kind: 'lost', y: -1, written: false, tick: R.ticks };
    const kind = j < 2 * n ? 'det' : 'wall', written = (j >= n && j < 2 * n) || j >= 3 * n, c = kind === 'det' ? cd : cw;
    return { kind, y: j % n, written, tick: find(c, random() * c[c.length - 1]) };
  };
}

// ---------------------------------------------------------------- as a module worker: run the two fields, report progress
if (typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
  self.onmessage = (ev) => {
    const S = { ...SETUP, ...(ev.data && ev.data.setup) }, run = new DoubleSlit(S);
    const R = run.run((frac, t) => self.postMessage({ type: 'progress', frac, tick: t }));
    const move = [R.det.pp.buffer, R.det.mm.buffer, R.det.pm.buffer, R.wall.pp.buffer, R.wall.mm.buffer, R.wall.pm.buffer, R.timeDet.buffer, R.timeWall.buffer,
      R.pic.ticks.buffer, R.pic.dP.buffer, R.pic.dM.buffer, R.pic.dX.buffer, R.pic.dScale.buffer, R.pic.wP.buffer, R.pic.wM.buffer, R.pic.wScale.buffer, R.pic.weight.buffer];
    self.postMessage({ type: 'done', result: R }, move);
  };
}
