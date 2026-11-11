// The charged-lepton chain, executed in the browser. No DOM in this file.
//
//   sixty addresses  ->  record weights  ->  two-cell count 2/9  ->  weak round, phase per unit clock time
//   ->  C(theta), three rates  ->  mass ratios.
//
// Ports of the public executable RER/model/lepton_register_round (geometry.py, walk.py, carrier.py; 99 checks) and of
// the lane reports LC (sixty-address carrier), CK2 (weak round), LK (kick, crossing), FR (register) in repair-law.
// Exact parts use rationals over BigInt and the ring Z[sqrt5]; phases and rates use doubles.
// Sections 1 to 7 take no measured value. Section 8 holds the measured values and is used by comparison() only.
// Check: node lepton_round_check.mjs

// ------------------------------------------------------------------ 1. exact rationals
const gcd = (a, b) => { if (a < 0n) a = -a; if (b < 0n) b = -b; while (b) [a, b] = [b, a % b]; return a; };
export class Frac {
  constructor(n, d = 1n) {
    n = BigInt(n); d = BigInt(d);
    if (d === 0n) throw new RangeError('zero denominator');
    if (d < 0n) { n = -n; d = -d; }
    const g = gcd(n, d) || 1n; this.n = n / g; this.d = d / g;
  }
  add(o) { o = F(o); return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { o = F(o); return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { o = F(o); return new Frac(this.n * o.n, this.d * o.d); }
  div(o) { o = F(o); return new Frac(this.n * o.d, this.d * o.n); }
  neg() { return new Frac(-this.n, this.d); }
  eq(o) { o = F(o); return this.n === o.n && this.d === o.d; }
  isZero() { return this.n === 0n; }
  toNumber() { return Number(this.n) / Number(this.d); }
  toString() { return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`; }
}
export const F = (n, d = 1) => (n instanceof Frac ? n : new Frac(n, d));
const ZERO = F(0), ONE = F(1);

// ------------------------------------------------------------------ 2. the carrier: twelve ports, thirty seams, sixty addresses
// Doubled coordinates of the public chart (model/common_source/slow_geometry.py, raw_frame): the pair [u, v] is the
// number (u + v sqrt5)/2. Port i is (x, y, z) with entries 0, +-1 and +-phi, phi = (1 + sqrt5)/2.
const P = [1, 1], M = [-1, -1], I = [2, 0], J = [-2, 0], O = [0, 0];
const RAW = [[J, P, O], [I, P, O], [J, M, O], [I, M, O], [O, J, P], [O, I, P], [O, J, M], [O, I, M], [P, O, J], [P, O, I], [M, O, J], [M, O, I]];
const zadd = (a, b) => [a[0] + b[0], a[1] + b[1]], zsub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const zmul = (a, b) => [a[0] * b[0] + 5 * a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const zsign = ([u, v]) => (u === 0 && v === 0 ? 0 : u >= 0 && v >= 0 ? 1 : u <= 0 && v <= 0 ? -1 : u * u > 5 * v * v ? Math.sign(u) : Math.sign(v));
const zdot = (a, b) => a.reduce((s, x, i) => zadd(s, zmul(x, b[i])), [0, 0]);
const zcross = (a, b) => [zsub(zmul(a[1], b[2]), zmul(a[2], b[1])), zsub(zmul(a[2], b[0]), zmul(a[0], b[2])), zsub(zmul(a[0], b[1]), zmul(a[1], b[0]))];
export const FACE = [4, 5, 11], C_SEAM = [2, 3], E_SEAM = [2, 10];

let _carrier = null;
export function carrier() {
  if (_carrier) return _carrier;
  const seams = [];
  for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) {
    const d = RAW[a].map((x, i) => zsub(x, RAW[b][i])), d2 = zdot(d, d);
    if (d2[0] === 16 && d2[1] === 0) seams.push([a, b]);            // squared length 4 in the chart's units
  }
  const addresses = [].concat(...seams.map(([a, b]) => [[a, b], [b, a]]));   // the order of Observer.addresses
  const neighbours = Array.from({ length: 12 }, () => new Set());
  for (const [a, b] of seams) { neighbours[a].add(b); neighbours[b].add(a); }
  const faces = [];
  for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) for (let c = b + 1; c < 12; c++) if (neighbours[a].has(b) && neighbours[b].has(c) && neighbours[a].has(c)) faces.push([a, b, c]);
  const antipode = RAW.map((x) => RAW.findIndex((y) => y.every((t, i) => t[0] === -x[i][0] && t[1] === -x[i][1])));
  const s5 = Math.sqrt(5), norm = Math.hypot(1, (1 + s5) / 2);
  const xyz = RAW.map((row) => row.map(([u, v]) => (u + v * s5) / 2 / norm));  // unit vectors, for drawing only
  return (_carrier = { seams, addresses, neighbours, faces, antipode, xyz });
}
// sign of n_f . (x_a x x_b): +1 when a -> b runs in the sense of the face third-turn about its axis
export function screenSign(face, a, b) {
  const n = [0, 1, 2].map((i) => face.reduce((s, p) => zadd(s, RAW[p][i]), [0, 0]));
  return zsign(zdot(n, zcross(RAW[a], RAW[b])));
}
// the hexagon around the axis of a face, in the screen sense, with its seam types and the third-turn orbit of the start
export function hexagon(face = FACE, start = 2, eSeam = E_SEAM) {
  const { seams, antipode } = carrier(), anti = face.map((p) => antipode[p]);
  const ports = new Set([...Array(12).keys()].filter((p) => !face.includes(p) && !anti.includes(p))), next = {};
  for (const [a, b] of seams) if (ports.has(a) && ports.has(b)) { if (screenSign(face, a, b) > 0) next[a] = b; else next[b] = a; }
  const loop = [start]; while (loop.length < ports.size) loop.push(next[loop[loop.length - 1]]);
  if (next[loop[loop.length - 1]] !== start) throw new Error('hexagon is not a closed loop');
  const ring = loop.map((p, i) => [p, loop[(i + 1) % 6]]), key = (s) => [...s].sort((x, y) => x - y).join(',');
  const e0 = ring.findIndex((s) => key(s) === key(eSeam));
  const eType = [0, 2, 4].map((t) => ring[(e0 + t) % 6]), cType = ring.filter((s) => !eType.includes(s));   // the third-turn advances the loop by two
  return { face, antipodal: anti.sort((x, y) => x - y), loop, ring, eType, cType, orbit: [loop[0], loop[2], loop[4]] };
}
// weights of the uniform address: the tail is the port, the head is the port, the address touches the port
export function addressStats(port) {
  const { addresses } = carrier(), tail = [], head = [];
  addresses.forEach(([a, b], k) => { if (a === port) tail.push(k); if (b === port) head.push(k); });
  const n = addresses.length;
  return { tail: F(tail.length, n), head: F(head.length, n), touches: F(tail.length + head.length, n), tailAddresses: tail, headAddresses: head, addresses: n };
}

// ------------------------------------------------------------------ 3. the local completion and the walk of a cell
// model/coherent_seam_repair/common.py, local_repair_unitary: on (source in 00, 10, 01, 11, 20, 02) x (record 0..3) the
// product of three reflections that exchange (minus, 0) with (plus, 1), (20, 0) with (11, 2), (02, 0) with (11, 3).
const SOURCES = ['00', '10', '01', '11', '20', '02'];
let _U = null;
export function completion() {
  if (_U) return _U;
  const n = 24, U = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? ONE : ZERO)));
  const at = (src, rec) => 4 * SOURCES.indexOf(src) + rec;
  const sub = (v, scale) => { for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (v[i] && v[j]) U[i][j] = U[i][j].sub(F(v[i] * v[j], scale)); };
  let v = new Array(n).fill(0); v[at('10', 0)] = 1; v[at('01', 0)] = -1; v[at('10', 1)] = -1; v[at('01', 1)] = -1; sub(v, 2);   // (left - right) has the factor 1/sqrt2
  v = new Array(n).fill(0); v[at('20', 0)] = 1; v[at('11', 2)] = -1; sub(v, 1);
  v = new Array(n).fill(0); v[at('02', 0)] = 1; v[at('11', 3)] = -1; sub(v, 1);
  return (_U = U);
}
export const config = (...ports) => { const c = new Array(12).fill(0); for (const p of ports) c[p]++; return c.join(''); };
const keyOf = (cfg, rec, k) => cfg + '|' + rec + '|' + k;
const put = (state, cfg, rec, k, amp) => {
  const key = keyOf(cfg, rec, k), old = state.get(key), v = old ? old.amp.add(amp) : amp;
  if (v.isZero()) state.delete(key); else state.set(key, { cfg, rec, k, amp: v });
};
// One address register over `addresses`; at address k the completion acts on the ordered seam in the order of the
// address. This is the plain law of Observer.repair. A state is a Map of branches {cfg, rec, k, amp} with exact amp.
export class Walk {
  constructor(addresses) { this.addresses = addresses; this.size = addresses.length; this.cache = new Map(); }
  images(cfg, rec, a, b) {
    const ck = cfg + rec + ':' + a + ':' + b; let out = this.cache.get(ck);
    if (out) return out;
    const na = +cfg[a], nb = +cfg[b];
    if (na + nb > 2) throw new RangeError('a seam with more than two loads lies outside the local completion');
    const U = completion(), col = 4 * SOURCES.indexOf('' + na + nb) + rec; out = [];
    for (let row = 0; row < 24; row++) {
      const u = U[row][col]; if (u.isZero()) continue;
      const src = SOURCES[row >> 2], c2 = cfg.split(''); c2[a] = src[0]; c2[b] = src[1];
      out.push([c2.join(''), row & 3, u]);
    }
    this.cache.set(ck, out); return out;
  }
  repair(state) {
    const out = new Map();
    for (const { cfg, rec, k, amp } of state.values()) { const [a, b] = this.addresses[k]; for (const [c2, r2, u] of this.images(cfg, rec, a, b)) put(out, c2, r2, k, amp.mul(u)); }
    return out;
  }
  reflect(state) {                                  // 2 A A^dag - 1 about the uniform address state
    const blocks = new Map();
    for (const br of state.values()) { const bk = br.cfg + '|' + br.rec; let b = blocks.get(bk); if (!b) blocks.set(bk, (b = { cfg: br.cfg, rec: br.rec, at: new Map() })); b.at.set(br.k, br.amp); }
    const out = new Map();
    for (const b of blocks.values()) {
      let sum = ZERO; for (const v of b.at.values()) sum = sum.add(v);
      const twice = sum.mul(F(2, this.size));
      for (let k = 0; k < this.size; k++) { const v = twice.sub(b.at.get(k) || ZERO); if (!v.isZero()) out.set(keyOf(b.cfg, b.rec, k), { cfg: b.cfg, rec: b.rec, k, amp: v }); }
    }
    return out;
  }
  step(state) { return this.repair(this.reflect(state)); }           // Observer.step
  inverseStep(state) { return this.reflect(this.repair(state)); }    // Observer.inverse_step
  uniform(cfg, rec = 0) { const s = new Map(); for (let k = 0; k < this.size; k++) s.set(keyOf(cfg, rec, k), { cfg, rec, k, amp: ONE }); return s; }   // norm squared = size
}
export const norm2 = (s) => { let t = ZERO; for (const b of s.values()) t = t.add(b.amp.mul(b.amp)); return t; };
export const dot = (u, v) => { let t = ZERO; for (const [key, b] of u) { const o = v.get(key); if (o) t = t.add(b.amp.mul(o.amp)); } return t; };
export const restrict = (s, pred) => new Map([...s].filter(([, b]) => pred(b)));
export const combine = (u, v, coef) => { const out = new Map(u); for (const b of v.values()) put(out, b.cfg, b.rec, b.k, b.amp.mul(coef)); return out; };
export const sameState = (u, v) => u.size === v.size && [...u].every(([key, b]) => v.has(key) && v.get(key).amp.eq(b.amp));
let _walk = null;
export const carrierWalk = () => _walk || (_walk = new Walk(carrier().addresses));

// ------------------------------------------------------------------ 4. one tick of a cell that holds the pair on one port
// LC item 2: blank 5/6, record 2 with 1/12, record 3 with 1/12. Record 2: a load leaves along the address (the port
// is its tail, native current +1). Record 3: a load leaves against the address (the port is its head, current -1).
export function doubleTick(port, walk = carrierWalk()) {
  const start = walk.uniform(config(port, port)), ticked = walk.step(start), n = F(walk.size);
  const weights = { blank: ZERO, record2: ZERO, record3: ZERO, other: ZERO }, record = new Uint8Array(walk.size);
  let positive = true, oneBranchPerAddress = ticked.size === walk.size;
  for (const b of ticked.values()) {
    const w = b.amp.mul(b.amp).div(n), name = b.rec === 0 ? 'blank' : b.rec === 2 ? 'record2' : b.rec === 3 ? 'record3' : 'other';
    weights[name] = weights[name].add(w); record[b.k] = b.rec;
    if (b.rec !== 0 && !b.amp.eq(ONE)) positive = false;
  }
  return { port, start, ticked, weights, record, positive, oneBranchPerAddress };
}

// ------------------------------------------------------------------ 5. two cells with independent address registers
// LC item 3. Cell X holds the defect's register: R+ is record 2, R- is record 3. A second cell Y: H is a written record.
// The count is the weight of the exclusive read "R+ xor H", by the explicit sum over the 60 x 60 address pairs.
export function twoCells(portX = 2, portY = 2) {
  const X = doubleTick(portX), Y = doubleTick(portY), n = X.record.length, total = n * n;
  let r = 0, h = 0, both = 0, exclusive = 0;
  for (let kx = 0; kx < n; kx++) for (let ky = 0; ky < n; ky++) {
    const rp = X.record[kx] === 2, hold = Y.record[ky] === 2 || Y.record[ky] === 3;
    r += rp; h += hold; both += rp && hold; exclusive += rp !== hold;
  }
  const pR = F(r, total), pH = F(h, total), joint = F(both, total);
  return { portX, portY, pR, pH, joint, count: pR.add(pH).sub(joint.mul(2)), exclusivePairs: exclusive, pairs: total, countByPairs: F(exclusive, total),
    recordX: X.record, recordY: Y.record, pRminus: X.weights.record3, ratio: [pH.div(pR), ONE, X.weights.record3.div(pR)] };
}
export const countFormula = (n) => F(3, n).sub(F(4, n * n));     // 3/n - 4/n^2 with P(R+) = 1/n and P(H) = 2/n

// ------------------------------------------------------------------ 6. the weak round
// CK2 and LC item 6: tick, kick exp(-i h J (x) Qx) on the exclusive read, inverse tick, return test.
// s_A = <D|W^-1 Pi_R+ W|D>, s_B = <D|W^-1 Pi_H W|D>, P = s_A (1 - s_B) + (1 - s_A) s_B. A zero return leaves the pair in
// its standing state, so every round reads the first-tick weights. Zero-return amplitude 1 - P + P exp(-i h j).
export function weakRound(port = 2, walk = carrierWalk()) {
  const start = walk.uniform(config(port, port)), n = F(walk.size), ws = walk.step(start), cfg0 = config(port, port);
  const a = walk.inverseStep(restrict(ws, (b) => b.rec === 2)), b = walk.inverseStep(restrict(ws, (x) => x.rec === 2 || x.rec === 3));
  const sA = dot(start, a).div(n), sB = dot(start, b).div(n);
  const content = (v, s) => {                        // the non-return vector W^-1 Pi W D - s D
    const perp = combine(v, start, s.neg());
    let off = ZERO, sum = ZERO;
    for (const x of perp.values()) { if (x.rec !== 0 || x.cfg !== cfg0) off = off.add(x.amp.mul(x.amp)); else sum = sum.add(x.amp); }
    return { norm2: norm2(perp).div(n), outside: off.div(n), uniformAddress: sum.mul(sum).div(n).div(n) };
  };
  return { port, inverseExact: sameState(walk.inverseStep(ws), start), sA, sB, P: sA.mul(ONE.sub(sB)).add(ONE.sub(sA).mul(sB)),
    nonReturnA: content(a, sA), nonReturnB: content(b, sB) };
}
// the same round on the product of two cells, branch pair by branch pair: <start|X> and <X|X> (used by the check script)
export function weakRoundPair(port = 2, walk = carrierWalk()) {
  const start = walk.uniform(config(port, port)), ws = walk.step(start), n2 = F(walk.size * walk.size);
  const flagged = []; for (const x of ws.values()) for (const y of ws.values()) if ((x.rec === 2) !== (y.rec === 2 || y.rec === 3)) flagged.push([x, y]);
  // apply the inverse tick to the first factor, then to the second
  const byY = new Map(); for (const [x, y] of flagged) { const ky = keyOf(y.cfg, y.rec, y.k); let g = byY.get(ky); if (!g) byY.set(ky, (g = { y, s: new Map() })); put(g.s, x.cfg, x.rec, x.k, x.amp.mul(y.amp)); }
  const byX = new Map(); for (const { y, s } of byY.values()) for (const x of walk.inverseStep(s).values()) { const kx = keyOf(x.cfg, x.rec, x.k); let g = byX.get(kx); if (!g) byX.set(kx, (g = { x, s: new Map() })); put(g.s, y.cfg, y.rec, y.k, x.amp); }
  let overlap = ZERO, norm = ZERO;
  for (const { x, s } of byX.values()) {
    const inStart = start.has(keyOf(x.cfg, x.rec, x.k));
    for (const y of walk.inverseStep(s).values()) { norm = norm.add(y.amp.mul(y.amp)); if (inStart && start.has(keyOf(y.cfg, y.rec, y.k))) overlap = overlap.add(y.amp); }
  }
  return { overlap: overlap.div(n2), norm: norm.div(n2), flaggedPairs: flagged.length };
}
// forward only (no inverse tick): the exclusive count at ticks 1..ticks. LC item 6: 2/9, then 0.486, 0.536, 0.467.
export function forwardOnly(port = 2, ticks = 4, walk = carrierWalk()) {
  let s = walk.uniform(config(port, port)); const n = F(walk.size), out = [];
  for (let t = 1; t <= ticks; t++) {
    s = walk.step(s);
    let p = ZERO, q = ZERO; for (const b of s.values()) { const w = b.amp.mul(b.amp).div(n); if (b.rec === 2) p = p.add(w); if (b.rec === 2 || b.rec === 3) q = q.add(w); }
    out.push({ tick: t, pRplus: p, pH: q, count: p.add(q).sub(p.mul(q).mul(2)) });
  }
  return out;
}
// the twelve-address hexagon model of FR and LK: a double at one hexagon port, flags by the seam of the emission.
// LK item 1: with the crossing the round coefficients alternate c_a = 5/18 (A at port 2) and c_b = 1/6 (A at port 10).
export function hexagonModel() {
  const hx = hexagon(), walk = new Walk([].concat(...hx.ring.map(([a, b]) => [[a, b], [b, a]]))), n = F(walk.size);
  const key = (a, b) => (a < b ? a + ',' + b : b + ',' + a), eKeys = new Set(hx.eType.map(([a, b]) => key(a, b)));
  const weights = (port) => {
    const w = { double: ZERO, forward: ZERO, inDimer: ZERO, backward: ZERO };
    for (const b of walk.step(walk.uniform(config(port, port))).values()) {
      const [x, y] = walk.addresses[b.k], from = b.rec === 2 ? x : y, wt = b.amp.mul(b.amp).div(n);
      const name = b.rec === 0 ? 'double' : eKeys.has(key(x, y)) ? 'inDimer' : hx.orbit.includes(from) ? 'forward' : 'backward';
      w[name] = w[name].add(wt);
    }
    return w;
  };
  const d2 = weights(hx.loop[0]), d10 = weights(hx.loop[5]), xor = (f, i) => f.mul(ONE.sub(i)).add(ONE.sub(f).mul(i));
  const cA = xor(d2.forward, d2.inDimer), cB = xor(d10.forward, d2.inDimer);       // B stays a double at port 2, read for the in-dimer flag
  return { hexagon: hx, port2: d2, port10: d10, cA, cB, mean: cA.add(cB).div(2) };
}
export const THETA = 2 / 9;                                                        // the count, as a phase per unit clock time
export const zeroReturn = (h, j = 1, p = THETA) => [1 - p + p * Math.cos(h * j), -p * Math.sin(h * j)];   // 1 - P + P exp(-i h j)
// N rounds per unit clock time, h = 1/N: minus the argument of (1 - P + P exp(-i/N))^N
export const phasePerUnit = (N, p = THETA) => N * Math.atan2(p * Math.sin(1 / N), 1 - p + p * Math.cos(1 / N));
export const modulusKept = (N, p = THETA) => Math.exp(0.5 * N * Math.log((1 - p + p * Math.cos(1 / N)) ** 2 + (p * Math.sin(1 / N)) ** 2));
export const phaseSeries = (N) => 2 / 9 - 35 / (2187 * N * N);                     // exact series to order 1/N^2 at P = 2/9
// LK's round with the two-tick crossing: coefficients c_a and c_b in alternate rounds (work/LK/lk_echo_pulse.py)
export const phaseCrossing = (N, ca = 5 / 18, cb = 1 / 6) => (N / 2) * (Math.atan2(ca * Math.sin(1 / N), 1 - ca + ca * Math.cos(1 / N)) + Math.atan2(cb * Math.sin(1 / N), 1 - cb + cb * Math.cos(1 / N)));

// ------------------------------------------------------------------ 7. from the phase to the three rates
// C(theta) = sqrt(1/6) I + sqrt(1/12) (e^{i theta} R + e^{-i theta} R^-1) on the characters R v_k = w^k v_k of the face
// third-turn: c_k = (1 + sqrt2 cos(theta + 2 pi k/3))/sqrt6. Read effect Y = (2/9) C^2, rates y_k = (2/9) c_k^2.
// k = 0 tau (character 1), k = 1 electron (w), k = 2 muon (w^2).
export const NODE = Math.PI / 12;                                                  // the electron amplitude vanishes here
export const LEPTONS = [{ k: 1, name: 'electron', sym: 'e' }, { k: 2, name: 'muon', sym: 'μ' }, { k: 0, name: 'tau', sym: 'τ' }];
export function amplitudes(theta = THETA) {
  const d = NODE - theta, s = Math.sin(d / 2);
  const e = 2 * s * (s + Math.cos(d / 2));                                         // 1 + sqrt2 cos(theta + 2 pi/3) without cancellation
  return [1 + Math.SQRT2 * Math.cos(theta), e, 1 + Math.SQRT2 * Math.cos(theta + 4 * Math.PI / 3)].map((x) => x / Math.sqrt(6));
}
export const rates = (theta = THETA) => amplitudes(theta).map((c) => (2 / 9) * c * c);
export function ratios(theta = THETA) { const [t, e, m] = rates(theta); return { muE: m / e, tauE: t / e, tauMu: t / m }; }
export function koide(theta = THETA) { const c = amplitudes(theta), s = c.reduce((a, x) => a + Math.abs(x), 0); return c.reduce((a, x) => a + x * x, 0) / (s * s); }

// ------------------------------------------------------------------ 8. measured values (comparison only, NOT BLIND)
export const SOURCES_MEASURED = {
  codata: { name: 'CODATA 2022', url: 'https://physics.nist.gov/cuu/Constants/' },
  pdg: { name: 'PDG 2024', url: 'https://pdg.lbl.gov/' },
};
export const MEASURED = {
  muE: { value: 206.7682827, unc: 0.0000046, text: '206.7682827(46)', source: 'codata' },
  mE: { value: 0.51099895069, unc: 0.00000000016, text: '0.51099895069(16)', unit: 'MeV', source: 'codata' },
  mMu: { value: 105.6583755, unc: 0.0000023, text: '105.6583755(23)', unit: 'MeV', source: 'codata' },
  mTau: { value: 1776.93, unc: 0.09, text: '1776.93(9)', unit: 'MeV', source: 'pdg' },
};
const koideOf = (a, b, c) => (a + b + c) / (Math.sqrt(a) + Math.sqrt(b) + Math.sqrt(c)) ** 2;
// value(uncertainty) with the uncertainty in units of the last shown digit, two significant digits of it
export function concise(value, unc, sig = 2) {
  const dec = Math.max(0, sig - 1 - Math.floor(Math.log10(unc) + 1e-12));
  return `${value.toFixed(dec)}(${Math.round(unc * 10 ** dec)})`;
}
// rows of the comparison: model at theta = 2/9 against measurement. Every deviation is model minus measured.
export function comparison(theta = THETA) {
  const r = ratios(theta), { muE, mE, mMu, mTau } = MEASURED;
  const tauE = mTau.value / mE.value, dTauE = tauE * Math.hypot(mTau.unc / mTau.value, mE.unc / mE.value);
  const tauMu = mTau.value / mMu.value, dTauMu = tauMu * Math.hypot(mTau.unc / mTau.value, mMu.unc / mMu.value);
  const m = [mE.value, mMu.value, mTau.value], q = koideOf(...m), s1 = m[0] + m[1] + m[2], s2 = Math.sqrt(m[0]) + Math.sqrt(m[1]) + Math.sqrt(m[2]);
  const dq = Math.hypot(...m.map((x, i) => (1 / (s2 * s2) - s1 / (s2 ** 3 * Math.sqrt(x))) * [mE.unc, mMu.unc, mTau.unc][i]));
  const row = (id, tex, model, modelText, measured, unc, measuredText, sources, how, unit = '', anchor = false) => ({
    id, tex, model, modelText, measured, unc, measuredText, sources, how, unit, anchor, incomplete: anchor,
    diff: model - measured, ppm: (model / measured - 1) * 1e6, sigma: (model - measured) / unc, uncPpm: (unc / measured) * 1e6 });
  return [
    row('muE', 'm_\\mu/m_e', r.muE, r.muE.toFixed(6), muE.value, muE.unc, muE.text, ['codata'], 'Ratio of the muon rate to the electron rate against the CODATA 2022 muon-electron mass ratio.'),
    row('tauE', 'm_\\tau/m_e', r.tauE, r.tauE.toFixed(4), tauE, dTauE, concise(tauE, dTauE, 3), ['pdg', 'codata'], 'Ratio of the tau rate to the electron rate against the PDG 2024 tau mass over the CODATA 2022 electron mass. Independence-control uncertainty; covariance bounds for tau/e are supplied in the fixed comparison. No physical theory uncertainty is assigned.'),
    row('tauMu', 'm_\\tau/m_\\mu', r.tauMu, r.tauMu.toFixed(6), tauMu, dTauMu, concise(tauMu, dTauMu, 3), ['pdg', 'codata'], 'Ratio of the tau rate to the muon rate against the PDG 2024 tau mass over the CODATA 2022 muon mass. Independence-control uncertainty; covariance bounds for tau/e are supplied in the fixed comparison. No physical theory uncertainty is assigned.'),
    row('koide', 'Q', koide(theta), '2/3', q, dq, concise(q, dq), ['pdg', 'codata'], 'Koide ratio Q = (sum of the masses) / (sum of their square roots) squared. The register gives 2/3 for every phase in the positive chamber. Measured: from the three masses, uncertainties propagated.'),
    row('mMu', 'm_\\mu', r.muE * mE.value, (r.muE * mE.value).toFixed(6), mMu.value, mMu.unc, mMu.text, ['codata'], 'The model ratio times the CODATA 2022 electron mass against the CODATA 2022 muon mass.', 'MeV', true),
    row('mTau', 'm_\\tau', r.tauE * mE.value, (r.tauE * mE.value).toFixed(3), mTau.value, mTau.unc, mTau.text, ['pdg'], 'The model ratio times the CODATA 2022 electron mass against the PDG 2024 tau mass.', 'MeV', true),
  ];
}
// rates at which the measured masses would sit on the ladder if their sum were the trace 2/9 (markers only, NOT BLIND)
export function measuredShares() { const { mE, mMu, mTau } = MEASURED, s = mE.value + mMu.value + mTau.value; return [mTau.value, mE.value, mMu.value].map((m) => (2 / 9) * m / s); }

// ------------------------------------------------------------------ 8b. what a lepton is: a pattern of the five-level code
// model/defect_particle_classes (PROOF section 1, 61 checks): a quantum occupies n3 of the three colour levels
// (Y = -1/3 each) and n2 of the two weak levels (Y = 1/2, T3 = +1/2 and -1/2). 6Y = 3 n2 - 2 n3, Q = T3 + Y, and the
// class it carries is k = 6Y mod 6. Bit i of the mask is level i in the order v1, v2, v3, s1, s2.
export const CODE_LEVELS = [{ id: 'v1', kind: 'colour', Y: F(-1, 3), T3: F(0) }, { id: 'v2', kind: 'colour', Y: F(-1, 3), T3: F(0) }, { id: 'v3', kind: 'colour', Y: F(-1, 3), T3: F(0) },
  { id: 's1', kind: 'weak', Y: F(1, 2), T3: F(1, 2) }, { id: 's2', kind: 'weak', Y: F(1, 2), T3: F(-1, 2) }];
export function pattern(mask) {
  let Y = ZERO, T3 = ZERO, n3 = 0, n2 = 0; const occupied = [];
  CODE_LEVELS.forEach((lv, i) => { if ((mask >> i) & 1) { Y = Y.add(lv.Y); T3 = T3.add(lv.T3); occupied.push(lv.id); if (lv.kind === 'colour') n3++; else n2++; } });
  const sixY = Number(Y.mul(6).n);
  return { mask, bits: CODE_LEVELS.map((_, i) => ((mask >> i) & 1 ? '1' : '0')).join(''), occupied, n3, n2, sixY, Y, T3, Q: T3.add(Y), k: ((sixY % 6) + 6) % 6 };
}
// the lepton doublet (left-handed neutrino and electron) and the right-handed electron
export const LEPTON_PATTERNS = [{ mask: 15, id: 'nu_L', sym: 'ν', hand: 'L', name: 'neutrino, left-handed' }, { mask: 23, id: 'e_L', sym: 'e', hand: 'L', name: 'electron, left-handed' }, { mask: 7, id: 'e_R', sym: 'e', hand: 'R', name: 'electron, right-handed' }];

// ------------------------------------------------------------------ 9. the sampled count (an illustration)
// Two independent uniform addresses per tick from a seeded generator. The phase is the exact expectation of section 5.
export function sampler(seed = 20261111, portX = 2, portY = 2) {
  const cells = twoCells(portX, portY), n = cells.recordX.length;
  let a = seed >>> 0;
  const rnd = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const st = { n: 0, rPlus: 0, rMinus: 0, hold: 0, both: 0, exclusive: 0 };
  return {
    cells, stats: st,
    next() {
      const kx = Math.floor(rnd() * n), ky = Math.floor(rnd() * n), rx = cells.recordX[kx], ry = cells.recordY[ky];
      const rPlus = rx === 2, rMinus = rx === 3, hold = ry !== 0, exclusive = rPlus !== hold;
      st.n++; st.rPlus += rPlus; st.rMinus += rMinus; st.hold += hold; st.both += rPlus && hold; st.exclusive += exclusive;
      return { kx, ky, rPlus, rMinus, hold, exclusive };
    },
    mean() { return st.n ? st.exclusive / st.n : NaN; },
    standardError() { return st.n ? Math.sqrt((2 / 9) * (7 / 9) / st.n) : NaN; },
  };
}

// ------------------------------------------------------------------ 10. the executed run of lane LR (optional file)
// Reads /rl/LR/lepton_run.json whatever its exact layout: finds a phase-against-ticks series and three rates by name.
//   series: an array of rows that each hold a number under a key like ticks, rounds, N, t and one under a key with
//           "phase" or "theta"; or an object with two parallel number arrays under such keys. The longest one is used.
//   rates:  an object with entries for electron, muon and tau (or e, mu, tau), each a number or an object that holds one
//           under a key like executed, measured, read, rate, value. A group named formula, expected or exact beside it
//           (or such a key inside each entry) is read as the closed formula.
const X_KEY = /^(n|t)$|tick|round|step|time/i, Y_KEY = /phase|theta/i, isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const LEP_KEY = { electron: /^(e|el|electron)$/i, muon: /^(mu|muon|μ)$/i, tau: /^(tau|τ)$/i };
const FORMULA_KEY = /formula|expected|exact|closed|target|theory|predict/i, EXEC_KEY = /execut|measured|read|estimat|register|run|sampled/i;
const NOT_RATE = /ratio|mev|mass|share|prior|fraction|count|sigma|ppm|separat|probab|weight|error|deviat|differ/i;
export function parseRun(json) {
  const out = { phase: null, rates: null, formula: null, statements: [], doc: null, limit: null };
  if (!json || typeof json !== 'object') return out;
  const series = [], triples = [];
  const pick = (o, re) => {
    if (isNum(o)) return re ? null : o;
    if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
    const keys = Object.keys(o).filter((k) => isNum(o[k]));
    const k = re ? keys.find((x) => re.test(x)) : keys.find((x) => EXEC_KEY.test(x)) || keys.find((x) => /rate|value|^y/i.test(x) && !FORMULA_KEY.test(x)) || keys.find((x) => !FORMULA_KEY.test(x) && !NOT_RATE.test(x));
    return k === undefined ? null : o[k];
  };
  const visit = (node, path) => {
    if (Array.isArray(node)) {
      if (node.length >= 2 && node.every((r) => r && typeof r === 'object' && !Array.isArray(r))) {
        const keys = Object.keys(node[0]).filter((k) => isNum(node[0][k]));
        const yk = keys.filter((k) => Y_KEY.test(k)).sort((a, b) => /per|unit/i.test(b) - /per|unit/i.test(a))[0], xk = keys.find((k) => X_KEY.test(k) && !Y_KEY.test(k));
        if (xk && yk) { const rows = node.filter((r) => isNum(r[xk]) && isNum(r[yk])); series.push({ x: rows.map((r) => r[xk]), y: rows.map((r) => r[yk]), xKey: xk, yKey: yk, path }); }
      }
      if (/statement/i.test(path) && !out.statements.length) out.statements = node.map((s) => (typeof s === 'string' ? { label: '', text: s } : s && typeof s === 'object' ? { label: String(s.label || ''), status: String(s.status || ''), text: String(s.text || s.statement || '') } : { label: '', text: '' })).filter((s) => s.text);
      node.forEach((v, i) => visit(v, path + '[' + i + ']'));
      return;
    }
    if (!node || typeof node !== 'object') return;
    const keys = Object.keys(node), numArr = (k) => Array.isArray(node[k]) && node[k].length >= 2 && node[k].every(isNum);
    const xk = keys.find((k) => X_KEY.test(k) && !Y_KEY.test(k) && numArr(k));
    const yk = xk && keys.filter((k) => Y_KEY.test(k) && numArr(k) && node[k].length === node[xk].length).sort((a, b) => /per|unit/i.test(b) - /per|unit/i.test(a))[0];
    if (xk && yk) series.push({ x: node[xk].slice(), y: node[yk].slice(), xKey: xk, yKey: yk, path });
    const lk = {}; for (const [name, re] of Object.entries(LEP_KEY)) lk[name] = keys.find((k) => re.test(k));
    if (lk.electron && lk.muon && lk.tau && !NOT_RATE.test(path)) {
      const get = (re) => { const v = { electron: pick(node[lk.electron], re), muon: pick(node[lk.muon], re), tau: pick(node[lk.tau], re) }; return isNum(v.electron) && isNum(v.muon) && isNum(v.tau) ? v : null; };
      const v = get(null), f = get(FORMULA_KEY);
      if (v) triples.push({ v, f, path, formula: FORMULA_KEY.test(path), score: (/rate|y_k/i.test(path) ? 2 : 0) + (EXEC_KEY.test(path) ? 1 : 0) });
    }
    for (const k of keys) {
      if (/^(doc|fields|description|about|readme)$/i.test(k) && !out.doc) out.doc = node[k];
      if (/limit/i.test(k) && isNum(node[k]) && out.limit === null && (Y_KEY.test(k) || Y_KEY.test(path))) out.limit = node[k];
      visit(node[k], path ? path + '.' + k : k);
    }
  };
  visit(json, '');
  if (series.length) {
    const best = series.sort((a, b) => (Y_KEY.test(b.path) - Y_KEY.test(a.path)) || (b.x.length - a.x.length))[0];
    const order = best.x.map((_, i) => i).sort((a, b) => best.x[a] - best.x[b]);
    out.phase = { x: order.map((i) => best.x[i]), y: order.map((i) => best.y[i]), xKey: best.xKey, yKey: best.yKey, path: best.path };
  }
  const exec = triples.filter((t) => !t.formula).sort((a, b) => b.score - a.score)[0], form = triples.filter((t) => t.formula).sort((a, b) => b.score - a.score)[0];
  if (exec) { out.rates = { ...exec.v, path: exec.path }; out.formula = exec.f || (form ? form.v : null); }
  return out;
}

// ------------------------------------------------------------------ 11. imported tables and texts shown on the page
// These are copies, labelled IMPORTED on the page. The engine does not recompute them.
// repair-law/reports/LD.md, section 6: residual of m_mu/m_e under each registered reading of the register rate.
// Needed coefficient -1.8215(41). Hadronic terms imported there. Comparison not blind.
export const RESIDUAL = {
  needed: '-1.8215(41)', unit: 'ppm', scale: { label: '(α/π)²', ppm: 5.4 },
  rows: [
    { id: 'R0', reading: 'pole in the real vacuum', coefficient: '0', ppm: 9.83, mTau: '1776.985', dQ: '0', role: 'register' },
    { id: 'R1', reading: 'own-scale MSbar mass, Thomson charge', coefficient: '+1.84', ppm: 19.77, mTau: '1777.030', dQ: '+1.6e-6' },
    { id: 'R2', reading: 'MSbar charge at own frequency', coefficient: '-1.714', ppm: 0.578, mTau: '1776.926', dQ: '-2.5e-6', role: 'closest', note: '26 sigma' },
    { id: 'R3', reading: 'MSbar mass at e^(-2/3) M', coefficient: '-1.214', ppm: 3.28, mTau: '1776.945', dQ: '-1.7e-6' },
    { id: 'R4', reading: 'lighter families at the reader\'s own rate, scheme-free', coefficient: '-1.7055', ppm: 0.626, mTau: '1776.921', dQ: '-2.8e-6', role: 'closest', note: '28 sigma' },
    { id: 'R5', reading: 'all families degenerate, fixed short-distance parameters', coefficient: '-56.9', ppm: -297, mTau: '1776.355', dQ: 'excluded', excluded: true },
    { id: 'R6', reading: 'massless pairs', coefficient: '+0.012', ppm: 9.90, mTau: '1776.990', dQ: '+2.6e-7' },
    { id: 'R7', reading: 'physical charge at own frequency', coefficient: '-1.204', ppm: 3.33, mTau: '1776.945', dQ: '-1.7e-6' },
    { id: 'R8', reading: 'common scale', coefficient: 'first order', ppm: -18508, mTau: '1727.4', dQ: 'excluded', excluded: true },
  ],
};
// repair-law/LEPTON_STEPS.md, section 4, steps L1 to L6, word for word (columns "Missing item" and "State on file").
// `step` is the card of the chain the item belongs to. `missing` repeats the sentence of `state` that names the gap.
export const OPEN_STEPS = [
  { id: 'L1', step: 1, chip: 'entry of the pair', item: 'Standing pair', report: 'LP',
    state: 'LP (`reports/LP.md`): derived up to the entry. Around a class-3 defect the source keeps exactly one two-load content, the pair on one port (double load) with its emission states. Three statements select it: the class-3 consensus state is unique (a single load sees the holonomy, a double load its square, which is 1 only for classes 0 and 3); on the charge-free link state the Gauss law accepts two embedded loads on one port with weight 1 and on two ports with weight 0; the public parity control leaves a defect unmoved exactly for a double on one of its face\'s ports. FR\'s count gives 2/9 on it and LK\'s crossing is exact on it. Charges: both doublet levels on one port have 6Y = 6, class 0, weak singlet; one emission is the vertex 0 -> 3 + 3. Missing: an operation that brings two separated loads onto one port (every idle operation has entry weight zero). Coordinator\'s reading (ARGUED): the double load is the pattern of the charged weak singlet, so the standing object is the right-handed charged lepton itself and the entry is particle creation',
    missing: 'Missing: an operation that brings two separated loads onto one port (every idle operation has entry weight zero).' },
  { id: 'L2', step: 3, chip: 'source event of the toggle', item: 'Round operations and the kick', report: 'LK',
    state: 'LK (`reports/LK.md`): derived up to one item. The round runs on operations of the public program (tick, inverse tick, address return test, reset); with a two-tick crossing of the double load on its own seam the symmetric location and its return test drop out, and a double at one port serves. The kick is the commutator of an oriented toggle T(eta) = exp(i eta J x Z_F Z_I) with the tick of the standing pair, h = 2 eta (EXACT). The Z2 toggle of the lepton vertex becomes this toggle with the orientation sign, which is in the public repair law. Missing: a source event that applies the toggle across the clocked register and the pair at a small angle. Scale: F = 2 g abs(beta)/tau; on the electroweak dictionary the bare toggle amplitude is y_0 = (9/2) y_J = 0.0487 (NOT BLIND)',
    missing: 'Missing: a source event that applies the toggle across the clocked register and the pair at a small angle.' },
  { id: 'L3', step: 3, chip: 'rule for the read kick', item: 'Clock unit', report: 'LT',
    state: 'LT (`reports/LT.md`): (T) follows from (E). On the stack\'s declared positive clock (onsite I - Re U with coefficient one, hopping (pi/4) dGamma(I - S)) the edge gate is reproduced only for clock time 1 + 4Z per tick and the attempt count gives one attempt per tick; the principal branch leaves t = 1 (EXACT; `energy/PROOF.md` lines 17 to 20, `spatial/PROOF.md` line 19). CK\'s theorem then needs (E), (C), (J) only. Missing: the rule by which the read kick enters the generator. The onsite rule gives coefficient 1 and theta = 2/9; the edge rule gives pi/2 and theta = pi/9, which lies outside the positive chamber',
    missing: 'Missing: the rule by which the read kick enters the generator.' },
  { id: 'L4', step: 2, chip: 'rule that reads one second cell', item: 'The register on the carrier: two cells, record flags', report: 'LC',
    state: 'LC (`reports/LC.md`): derived given FR\'s declared register. On the sixty-address carrier the count 2/9 comes from two cells with independent address registers read by the law\'s own record: the defect\'s cell has R+ = record 2 and R- = record 3 (the two signs of the native current, weights 1/12 each, blank 5/6), one second cell has H = record written (1/6); count 2/9, ratio 2 : 1 : 1, the same at each of the twelve ports (EXACT). One carrier with one register cannot give it (every weight is a multiple of 1/240). With record flags the round needs no symmetric location and no crossing; CK2\'s weak round and LK\'s kick identity hold on sixty addresses. Standing objects: double loads give tr Y = 5/18, native pairs on non-adjacent ports give tr Y = 2/9; ratios are the same. Missing: a source rule that reads exactly one second cell as the hold per unit clock time (n cells read at once give other counts; partners read one at a time with a shared kick give 2/9 for every n)',
    missing: 'Missing: a source rule that reads exactly one second cell as the hold per unit clock time (n cells read at once give other counts; partners read one at a time with a shared kick give 2/9 for every n)' },
  { id: 'L5', step: 5, chip: 'the residual', item: 'Residual +9.83 ppm in mu/e', report: 'LD',
    state: 'LD (`reports/LD.md`): bounded. The only family-dependent diagram at order (alpha/pi)^2 is the vacuum polarization of the photon line by pairs of the lighter families (EXACT); with the charge read at the lepton\'s own rest frequency the sign is the measured one. The two closest registered readings leave +0.58 and +0.63 ppm (rows R2, R4; hadronic term imported) and give m_tau = 1776.92(1) MeV. A common-scale reading is excluded (-1.85 percent). Missing: the pair rates contained in the family-blind dressing, that is the constant B of the lighter families (needed -1.833(4), NOT BLIND; registered values -1.006 to -1.717), and the rule that each rate is read on its own clock',
    missing: 'Missing: the pair rates contained in the family-blind dressing, that is the constant B of the lighter families (needed -1.833(4), NOT BLIND; registered values -1.006 to -1.717), and the rule that each rate is read on its own clock' },
  { id: 'L6', step: 4, chip: 'the lepton scale', item: 'Lepton scale y_J = 0.010816 (NOT BLIND)', report: 'YC',
    state: 'YC: g/2 on every leg gives m_tau 46 to 57 GeV; TR: the lepton vertex needs exactly one cost-raising read; LS2: det Y_e = sqrt2 6^-14 fits to 0.27 percent and the same construction fails on the quarks',
    missing: '' },
];
