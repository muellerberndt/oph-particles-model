// node nowave_check.mjs : the double slit of the page "No wave function" (nowave_engine.js) against its statements.
//   1. the tick used is the ordered routing tick of cf1_engine.js, and every weight is accounted for
//   2. the two-run reduction equals a direct simulation of the quantum together with the record register
//   3. both openings open, no record: fringes, at the positions the phases of the tick give
//   4. a full record at the opening: the fringes vanish
//   5. a record of any strength: V^2 + D^2 <= 1
//   6. sampled runs converge to the computed weights
//   7. reference numbers of the setup shown on the page
// Runs in about 20 seconds.
import { Routing } from './cf1_engine.js';
import { SETUP, DoubleSlit, openings, weights, alternatives, smooth, fringeFunction, fringeFrame, visibility, distinguishability, textbookFringe, walkFringe, sampler, rng } from './nowave_engine.js';

let bad = 0;
const line = (ok, name, detail = '') => { if (!ok) bad++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? '   ' + detail : '')); };
const near = (x, y, name, tol) => line(Math.abs(x - y) <= tol, name, `${(+x).toPrecision(10)} against ${(+y).toPrecision(10)}, tolerance ${tol}`);
const below = (x, lim, name) => line(x <= lim, name, `${(+x).toExponential(3)}, limit ${lim}`);
const sum = (a) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i]; return s; };

// ---------------------------------------------------------------- 1. the tick and the bookkeeping of weight
{ const a = new Routing(10, 12, 1), b = new Routing(10, 12, 1); let seed = 11; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648 - 0.5; };
  for (let j = 0; j < a.re.length; j++) { a.re[j] = rnd(); a.im[j] = rnd(); } a.normalize(); b.copyFrom(a);
  a.tick(0, 'Y', false); b.shift(0); b.shift(1);
  let d = 0; for (let j = 0; j < a.re.length; j++) d = Math.max(d, Math.abs(a.re[j] - b.re[j]), Math.abs(a.im[j] - b.im[j]));
  below(d, 1e-15, 'on a sheet the ordered tick S3 S2 S1 of the engine equals S2 S1');
  near(b.norm2(), 1, 'the tick keeps the norm', 1e-13); }

const small = { ...SETUP, n1: 110, n2: 80, xs: 26, wx: 23, wy: 39, k: 0.5, xw: 50, a: 5, d: 22, xd: 104, maxTicks: 150 };
const runSmall = new DoubleSlit(small, { pictures: false }), Rs = runSmall.run();
{ const w = weights(Rs, 0), tot = w.pDet + w.pWall + w.back + w.side + Rs.left;
  near(tot, 1, 'run F+: records at the wall, the detector wall, behind the source, at the edge, and the open rest add to one', 1e-12);
  const totM = sum(Rs.det.mm) + sum(Rs.wall.mm) + Rs.back.mm + Rs.side.mm + runSmall.M.norm2();
  near(totM, 1, 'run F-: the same sum', 1e-12);
  const al = alternatives(Rs); near(al.wA / al.wB, 1, 'the two alternatives carry equal weight to the detector wall', 1e-12);
  const y0 = Rs.openings.y0; let d = 0, m = 0; for (let j = 1; j < y0; j++) { d = Math.max(d, Math.abs(al.A[y0 + j] - al.B[y0 - j])); m = Math.max(m, al.A[y0 + j]); }
  below(d / m, 1e-12, 'behind the wall the second alternative is the mirror image of the first'); }

// ---------------------------------------------------------------- 2. the reduction against the quantum with its register
// State: two fields, register blank and register written. Per tick: S1 with the register reflected by V(phi) on the
// amplitude that crosses a seam behind the upper opening, then S2, then the recording cells.
function direct(S, phi, open = 'both') {
  const { n1, n2 } = S, N = 4 * n1 * n2, op = openings(S), c = Math.cos(phi), s = Math.sin(phi);
  const seed = new DoubleSlit(S, { pictures: false, open });                       // preparation, wall cells and link signs of the engine
  const plus = new Routing(n1, n2, 1), minus = new Routing(n1, n2, 1); minus.links = seed.M.links;
  let b = { re: Float64Array.from(seed.P.re), im: new Float64Array(seed.P.im) }, w = { re: new Float64Array(N), im: new Float64Array(N) };
  const S1 = (f, eng) => { eng.re.set(f.re); eng.im.set(f.im); eng.shift(0); return { re: Float64Array.from(eng.re), im: Float64Array.from(eng.im) }; };
  const S2 = (f) => { plus.re.set(f.re); plus.im.set(f.im); plus.shift(1); return { re: Float64Array.from(plus.re), im: Float64Array.from(plus.im) }; };
  const out = { blank: new Float64Array(n2), written: new Float64Array(n2), reg: [0, 0, 0, 0] };   // reg: sums of |b|^2, |w|^2, Re conj(b) w, Im conj(b) w at the detector wall
  for (let t = 0; t < S.maxTicks; t++) {
    const bp = S1(b, plus), bm = S1(b, minus), wp = S1(w, plus), wm = S1(w, minus), nb = { re: new Float64Array(N), im: new Float64Array(N) }, nw = { re: new Float64Array(N), im: new Float64Array(N) };
    for (const part of ['re', 'im']) for (let j = 0; j < N; j++) {
      const Nb = 0.5 * (bp[part][j] + bm[part][j]), Cb = 0.5 * (bp[part][j] - bm[part][j]), Nw = 0.5 * (wp[part][j] + wm[part][j]), Cw = 0.5 * (wp[part][j] - wm[part][j]);
      nb[part][j] = Nb + c * Cb + s * Cw; nw[part][j] = Nw + s * Cb - c * Cw;
    }
    b = S2(nb); w = S2(nw);
    const read = (x, y, isDet) => { const o = 4 * (x * n2 + y);
      for (let q = o; q < o + 4; q++) {
        if (isDet) { out.blank[y] += b.re[q] ** 2 + b.im[q] ** 2; out.written[y] += w.re[q] ** 2 + w.im[q] ** 2;
          out.reg[0] += b.re[q] ** 2 + b.im[q] ** 2; out.reg[1] += w.re[q] ** 2 + w.im[q] ** 2; out.reg[2] += b.re[q] * w.re[q] + b.im[q] * w.im[q]; out.reg[3] += b.re[q] * w.im[q] - b.im[q] * w.re[q]; }
        b.re[q] = 0; b.im[q] = 0; w.re[q] = 0; w.im[q] = 0; } };
    for (let y = 0; y < n2; y++) { if (seed.wallCell[y]) read(S.xw, y, false); read(S.xd, y, true); read(S.xb, y, false); }
    for (let x = 0; x < n1; x++) if (x !== S.xw && x !== S.xd && x !== S.xb) read(x, 0, false);
  }
  return out;
}
for (const phi of [0.7, Math.PI / 2]) {
  const D = direct(small, phi), w = weights(Rs, phi); let d1 = 0, d2 = 0;
  for (let y = 0; y < small.n2; y++) { d1 = Math.max(d1, Math.abs(D.written[y] - w.detWritten[y])); d2 = Math.max(d2, Math.abs(D.blank[y] - (w.det[y] - w.detWritten[y]))); }
  below(d1, 1e-13, `strength ${phi.toFixed(4)}: weights with the register written, reduction against the direct simulation`);
  below(d2, 1e-13, `strength ${phi.toFixed(4)}: weights with the register blank, reduction against the direct simulation`);
}
{ // the register states behind each single opening, from the direct simulation: half the trace norm of their difference
  const phi = 0.7, rho = (o) => { const t = o.reg[0] + o.reg[1]; return [o.reg[0] / t, o.reg[1] / t, o.reg[2] / t, o.reg[3] / t]; };
  const ra = rho(direct(small, phi, 'A')), rb = rho(direct(small, phi, 'B'));
  const dz = 0.5 * ((ra[0] - ra[1]) - (rb[0] - rb[1])), dx = ra[2] - rb[2], dy = ra[3] - rb[3], Dnum = Math.hypot(dz, dx, dy);
  near(Dnum, Math.sin(phi), 'distinguishability of the two openings from the simulated register equals sin(phi)', 1e-12);
  near(distinguishability(phi), Math.sin(phi), 'the same from the closed form of the engine', 1e-15); }

// ---------------------------------------------------------------- the setup of the page
const t0 = Date.now(), run = new DoubleSlit(SETUP, { pictures: true }), R = run.run();
console.log(`     (the setup of the page: ${SETUP.n1} x ${SETUP.n2} cells, ${R.ticks} ticks, ${((Date.now() - t0) / 1000).toFixed(1)} s)`);
const w0 = weights(R, 0), wF = weights(R, Math.PI / 2), al = alternatives(R), frame = fringeFrame(R), V0 = visibility(R, w0.det, frame);

// ---------------------------------------------------------------- 3. fringes
line(V0 > 0.9, 'both openings open, no record: fringes at the centre', `visibility ${V0.toFixed(4)}`);
{ const names = ['first dark fringe', 'first bright fringe', 'second dark fringe', 'second bright fringe'], got = [frame.dark1, frame.bright1, frame.dark2, frame.bright2];
  const lattice = SETUP.k / Math.tan(SETUP.k);
  [0.5, 1, 1.5, 2].forEach((m, i) => {
    const walk = walkFringe(SETUP, m), text = textbookFringe(SETUP, m);
    line(Math.abs(got[i] / walk - 1) < 0.03, `${names[i]} at the position the phases of the tick give, within 3 percent`, `${got[i].toFixed(2)} cells against ${walk.toFixed(2)}`);
    line(Math.abs(got[i] / text - 1) < 0.08, `${names[i]} at the textbook position for two sources, within 8 percent`, `${got[i].toFixed(2)} cells against ${text.toFixed(2)}, ratio ${(got[i] / text).toFixed(4)}`);
  });
  line(Math.abs(frame.bright1 / textbookFringe(SETUP, 1) / lattice - 1) < 0.02, 'the difference from the textbook position is the lattice factor k / tan k of the tick, within 2 percent', `ratio ${(frame.bright1 / textbookFringe(SETUP, 1)).toFixed(4)} against ${lattice.toFixed(4)}`); }

// ---------------------------------------------------------------- 4. the record removes the fringes
{ const VF = visibility(R, wF.det, frame); below(Math.abs(VF), 1e-12, 'full record at the opening: visibility at the centre');
  const v = fringeFunction(R, wF.det); let m = 0; for (let y = 8; y < SETUP.n2 - 8; y++) m = Math.max(m, Math.abs(v[y]));
  below(m, 1e-12, 'full record: largest fringe function anywhere on the detector wall');
  let d = 0; for (let y = 0; y < SETUP.n2; y++) d = Math.max(d, Math.abs(wF.det[y] - (al.A[y] + al.B[y])));
  below(d, 1e-15, 'full record: the pattern is the sum of the patterns of the two alternatives');
  const half = wF.pDetWritten / wF.pDet; near(half, 0.5, 'full record: half of the runs that reach the detector wall carry a written register', 1e-12); }

// ---------------------------------------------------------------- 5. duality
{ let worst = 0, least = 2;
  for (let i = 0; i <= 24; i++) { const phi = (Math.PI / 2) * i / 24, V = visibility(R, weights(R, phi).det, frame), D = distinguishability(phi, al.wA, al.wB), q = V * V + D * D; worst = Math.max(worst, q); least = Math.min(least, q);
    if (i % 6 === 0) console.log(`     strength ${phi.toFixed(3)}: V ${V.toFixed(4)}  D ${D.toFixed(4)}  V^2 + D^2 ${q.toFixed(4)}`); }
  below(worst - 1, 1e-12, 'V^2 + D^2 <= 1 at 25 strengths from no record to a full record (largest value minus one)');
  near(least, V0 * V0, 'the smallest value is at no record and equals the square of the visibility there', 1e-12);
  const V = visibility(R, weights(R, 0.9).det, frame); near(V / V0, Math.cos(0.9), 'the visibility falls as cos(phi)', 1e-12); }

// ---------------------------------------------------------------- 6. sampled runs converge to the computed weights
{ const phi = 0, draw = sampler(R, phi, rng(20261111)), n = SETUP.n2, bins = n / 4, target = new Float64Array(bins); for (let y = 0; y < n; y++) target[y >> 2] += w0.det[y] / w0.pDet;
  const hist = new Float64Array(bins); let hits = 0, sent = 0; const tv = [];
  for (const N of [2000, 8000, 32000, 128000]) {
    while (hits < N) { const o = draw(); sent++; if (o.kind === 'det') { hist[o.y >> 2]++; hits++; } }
    let d = 0; for (let i = 0; i < bins; i++) d += Math.abs(hist[i] / hits - target[i]); tv.push(0.5 * d);
    console.log(`     ${String(hits).padStart(6)} records at the detector wall after ${sent} runs: distance to the computed weights ${(0.5 * d).toFixed(4)}`);
  }
  line(tv[3] < tv[2] && tv[2] < tv[1] && tv[1] < tv[0], 'the distance between the sampled records and the computed weights falls with the number of records');
  line(tv[3] / tv[0] < 0.25 && tv[3] / tv[0] > 0.06, 'it falls as one over the square root of the number (factor 8 expected over a factor 64)', `factor ${(tv[0] / tv[3]).toFixed(2)}`);
  let chi = 0, dof = 0; for (let i = 0; i < bins; i++) { const e = hits * target[i]; if (e > 20) { chi += (hist[i] - e) ** 2 / e; dof++; } }
  line(chi / dof > 0.5 && chi / dof < 1.6, 'chi square per bin of the sampled pattern against the weights', `${(chi / dof).toFixed(3)} over ${dof} bins`);
  const frac = hits / sent, sig = Math.sqrt(w0.pDet * (1 - w0.pDet) / sent);
  line(Math.abs(frac - w0.pDet) < 4 * sig, 'the share of runs recorded at the detector wall', `${frac.toFixed(5)} against ${w0.pDet.toFixed(5)}, one sigma ${sig.toFixed(5)}`);
  // visibility of the sampled pattern, read with the same function as the computed one
  const fine = new Float64Array(n), d2 = sampler(R, phi, rng(7)); let h2 = 0;
  while (h2 < 800000) { const o = d2(); if (o.kind === 'det') { fine[o.y]++; h2++; } }
  for (let y = 0; y < n; y++) fine[y] *= w0.pDet / h2;
  const Vs = visibility(R, fine, frame);
  line(Math.abs(Vs - V0) < 0.03, 'visibility of 800000 sampled records against the computed one', `${Vs.toFixed(4)} against ${V0.toFixed(4)}`);
  const dF = sampler(R, Math.PI / 2, rng(99)); let wr = 0, hd = 0; for (let i = 0; i < 400000; i++) { const o = dF(); if (o.kind === 'det') { hd++; if (o.written) wr++; } }
  line(Math.abs(wr / hd - 0.5) < 4 * Math.sqrt(0.25 / hd), 'full record, sampled: share of written registers among the records at the detector wall', `${(wr / hd).toFixed(4)} against 0.5`); }

// ---------------------------------------------------------------- 7. reference numbers of the page's setup
const REF = { pDet: 0.1281630856, pWall: 0.8507279131, V0: 0.9428703456, dark1: 15.28850, bright1: 31.39912, wA: 0.06407730319 };
near(w0.pDet, REF.pDet, 'reference: share of runs recorded at the detector wall', 2e-9);
near(w0.pWall, REF.pWall, 'reference: share of runs recorded at the wall', 2e-9);
near(V0, REF.V0, 'reference: visibility at the centre without a record', 2e-9);
near(frame.dark1, REF.dark1, 'reference: first dark fringe, cells from the centre', 2e-4);
near(frame.bright1, REF.bright1, 'reference: first bright fringe, cells from the centre', 2e-4);
near(al.wA, REF.wA, 'reference: weight of one alternative at the detector wall', 2e-10);
console.log(`     values: pDet ${w0.pDet.toFixed(10)} pWall ${w0.pWall.toFixed(10)} V0 ${V0.toFixed(10)} dark1 ${frame.dark1.toFixed(5)} bright1 ${frame.bright1.toFixed(5)} wA ${al.wA.toFixed(11)} written at full record ${wF.pWritten.toFixed(6)} pictures ${R.pic.count}`);

console.log(bad ? `\n${bad} CHECK(S) FAILED` : '\nall checks pass');
process.exit(bad ? 1 : 0);
