// Checks lepton_round.js against the reference numbers of the theory session.
// References: repair-law reports LC, CK2, LK, FR5, LEPTON_STEPS; the public executable
// RER/model/lepton_register_round (results.json, 99 checks). Run: node lepton_round_check.mjs
// The reference numbers are written out below. Files of the two repositories are compared in addition when they
// are reachable at their paths on this machine; a missing file skips that block and fails nothing.
import { existsSync, readFileSync } from 'node:fs';
import * as L from './lepton_round.js';

const RL = '/Users/muellerberndt/Projects/oph-meta/repair-law', RER = '/Users/muellerberndt/Projects/oph-meta/reverse-engineering-reality';
const VIEWER = new URL('.', import.meta.url).pathname;
let fails = 0, passes = 0;
const ok = (cond, name, detail = '') => { if (cond) passes++; else fails++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  [' + detail + ']' : ''}`); };
const eq = (frac, text) => String(frac) === text;
const near = (x, ref, tol) => Math.abs(x - ref) <= tol;
const section = (t) => console.log('\n' + t);

// ------------------------------------------------------------------ carrier
section('Carrier (public chart, exact in Z[sqrt5])');
const C = L.carrier();
const SEAMS = '0,1 0,5 0,7 0,10 0,11 1,5 1,7 1,8 1,9 2,3 2,4 2,6 2,10 2,11 3,4 3,6 3,8 3,9 4,5 4,9 4,11 5,9 5,11 6,7 6,8 6,10 7,8 7,10 8,9 10,11';
ok(C.seams.length === 30 && C.addresses.length === 60 && C.faces.length === 20, 'twelve ports, 30 seams, 60 addresses, 20 faces');
ok(C.seams.map((s) => s.join(',')).join(' ') === SEAMS, 'seams equal the list of the public source chart, in its order');
ok(C.addresses.every(([a, b], k) => (k % 2 === 0 ? a < b : a > b) && C.neighbours[a].has(b)), 'addresses are the ordered seams in the order of Observer.addresses');
ok(C.neighbours.every((s) => s.size === 5), 'every port has five seams');
ok(C.antipode.every((p, i) => C.antipode[p] === i && !C.neighbours[i].has(p)), 'antipodes pair the ports');
const HX = L.hexagon();
ok(HX.loop.join(',') === '2,3,9,1,0,10' && HX.antipodal.join(',') === '6,7,8', 'hexagon of the face (4, 5, 11) in the screen sense: 2, 3, 9, 1, 0, 10');
const sk = (list) => list.map((s) => [...s].sort((x, y) => x - y).join(',')).sort().join(' ');
ok(sk(HX.eType) === '0,1 2,10 3,9' && sk(HX.cType) === '0,10 1,9 2,3' && [...HX.orbit].sort((x, y) => x - y).join(',') === '0,2,9', 'E-type seams (0,1) (2,10) (3,9), C-type seams (0,10) (1,9) (2,3), orbit of port 2 is 0, 2, 9');
ok(L.screenSign(L.FACE, 2, 3) === 1 && L.screenSign(L.FACE, 10, 2) === 1, 'screen orientations: C runs 2 to 3, E runs 10 to 2');

// ------------------------------------------------------------------ address statistics, record weights
section('Sixty addresses and the record (LC items 1 and 2)');
ok([...Array(12).keys()].every((p) => { const s = L.addressStats(p); return eq(s.tail, '1/12') && eq(s.head, '1/12') && eq(s.touches, '1/6'); }), 'tail 1/12, head 1/12, touches 1/6 at each of the twelve ports');
const U = L.completion();
let invol = true; for (let i = 0; i < 24; i++) for (let j = 0; j < 24; j++) { let s = L.F(0); for (let k = 0; k < 24; k++) s = s.add(U[i][k].mul(U[k][j])); if (!s.eq(i === j ? 1 : 0)) invol = false; }
ok(invol, 'the local completion is an involution (exact)');
ok([...new Set(U.flat().map(String))].sort().join(' ') === '-1/2 0 1 1/2', 'entries of the completion are 0, 1 and +-1/2');
let sym = true; for (let i = 0; i < 24; i++) for (let j = 0; j < 24; j++) if (!U[i][j].eq(U[j][i])) sym = false;
ok(sym, 'the completion is symmetric');
const ticks = [...Array(12).keys()].map((p) => L.doubleTick(p));
ok(ticks.every((t) => eq(t.weights.blank, '5/6') && eq(t.weights.record2, '1/12') && eq(t.weights.record3, '1/12') && t.weights.other.isZero()), 'blank 5/6, record 2 with 1/12, record 3 with 1/12 at each of the twelve ports');
ok(ticks.every((t) => t.positive && t.oneBranchPerAddress), 'one branch per address, every emission amplitude is +1/sqrt60');
ok(ticks.every((t) => C.addresses.every(([a, b], k) => t.record[k] === (a === t.port ? 2 : b === t.port ? 3 : 0))), 'record 2 where the port is the tail of the address, record 3 where it is the head (the two signs of the native current)');
ok(ticks.every((t) => [...t.ticked.values()].every((b) => b.rec === 0 ? b.cfg === L.config(t.port, t.port) : b.cfg === L.config(...C.addresses[b.k]))), 'after an emission one load sits on each end of the addressed seam');

// ------------------------------------------------------------------ two cells
section('Two cells with independent address registers (LC item 3)');
const cells = [...Array(12).keys()].map((p) => L.twoCells(p, p));
ok(cells.every((c) => eq(c.pR, '1/12') && eq(c.pH, '1/6') && eq(c.joint, '1/72')), 'P(R+) = 1/12, P(H) = 1/6, P(R+ and H) = 1/72 at each of the twelve ports');
ok(cells.every((c) => eq(c.count, '2/9') && c.exclusivePairs === 800 && c.pairs === 3600 && eq(c.countByPairs, '2/9')), 'count of exclusive reads 2/9: 800 of the 3600 address pairs');
ok(cells.every((c) => c.ratio.map(String).join(':') === '2:1:1'), 'ratio H : R+ : R- = 2 : 1 : 1');
ok([[2, 7], [0, 3], [5, 10], [11, 4]].every(([x, y]) => eq(L.twoCells(x, y).count, '2/9')), 'the same count with the two pairs on different ports');
ok(eq(L.countFormula(12), '2/9') && eq(L.countFormula(6), '7/18') && eq(L.countFormula(60), '11/225'), '3/n - 4/n^2: 2/9 at n = 12 (7/18 at 6, 11/225 at 60)');
let mult = true; const W = L.carrierWalk();
for (let a = 0; a < 12; a++) for (let b = a; b < 12; b++) for (const br of W.step(W.uniform(L.config(a, b))).values()) if (br.amp.mul(br.amp).mul(4).d !== 1n) mult = false;
ok(mult && L.F(2, 9).mul(240).d !== 1n, 'one register: every branch weight of the 78 two-load configurations is a multiple of 1/240, and 2/9 is not (LC item 4)');

// ------------------------------------------------------------------ weak round
section('Weak round on sixty addresses (CK2, LC item 6)');
for (const port of [2, 10]) {
  const r = L.weakRound(port), p = L.weakRoundPair(port);
  ok(r.inverseExact, `port ${port}: the inverse tick restores the standing state exactly`);
  ok(eq(r.sA, '1/12') && eq(r.sB, '1/6') && eq(r.P, '2/9'), `port ${port}: overlaps 1/12 and 1/6, P = 2/9`);
  ok(eq(r.nonReturnA.norm2, '11/144') && eq(r.nonReturnB.norm2, '5/36') && r.nonReturnA.outside.isZero() && r.nonReturnB.outside.isZero() && r.nonReturnA.uniformAddress.isZero() && r.nonReturnB.uniformAddress.isZero(),
    `port ${port}: non-return norms 11/144 and 5/36, blank record, initial configuration, no uniform-address part`);
  ok(eq(p.overlap, '2/9') && eq(p.norm, '2/9') && p.flaggedPairs === 800, `port ${port}: on the product of the two cells <start|X> = <X|X> = 2/9`);
}
const fo = L.forwardOnly(2, 4);
ok(fo.map((r) => String(r.count)).join(' ') === '2/9 3544109/7290000 21968948741/41006250000 1396558119030851/2989355625000000', 'forward only, no inverse tick: 2/9, then 0.486, 0.536, 0.467 (exact fractions of lc3_round.json)');
const z1 = L.zeroReturn(1);
ok(near(z1[0], 7 / 9 + (2 / 9) * Math.cos(1), 1e-15) && near(z1[1], -(2 / 9) * Math.sin(1), 1e-15), 'zero-return amplitude 1 - 2/9 + (2/9) exp(-i h j)');
const PH = { 1: 0.205334030970278, 10: 0.222062099670503, 100: 0.22222062184783, 1000: 0.222222206218563 };
ok(Object.entries(PH).every(([N, v]) => near(L.phasePerUnit(+N), v, 2e-13)), 'phase per unit clock time: 0.205334030970278 (N = 1), 0.222062099670503 (N = 10), 0.222222206218563 (N = 1000)');
ok(L.phasePerUnit(1).toFixed(6) === '0.205334' && L.phasePerUnit(10).toFixed(6) === '0.222062', 'as shown on the page: 0.205334 (N = 1) and 0.222062 (N = 10)');
ok([1, 2, 10, 100, 1000].every((N) => Math.abs(L.phasePerUnit(N) - 2 / 9) <= 1 / N) && near(L.phasePerUnit(1e7), 2 / 9, 1e-13), 'the phase tends to 2/9, distance at most 1/N');
ok([10, 100, 1000].every((N) => Math.abs(L.phasePerUnit(N) - L.phaseSeries(N)) < 2 / N ** 4), 'series 2/9 - 35/(2187 N^2) up to order 1/N^4');
ok(near(L.modulusKept(1), 0.917110764911, 1e-12) && near(L.modulusKept(1000), 0.999913583981, 1e-12) && near(1000 * Math.log(L.modulusKept(1000)), -7 / 81, 1e-6), 'modulus kept: 0.917110764911 (N = 1), 0.999913583981 (N = 1000), N log -> -7/81');
const hm = L.hexagonModel();
ok(eq(hm.port2.forward, '1/6') && eq(hm.port2.inDimer, '1/6') && eq(hm.port2.double, '2/3') && eq(hm.port10.backward, '1/6') && eq(hm.port10.inDimer, '1/6') && hm.port10.forward.isZero(), 'hexagon model: the double at port 2 emits 1/6 forward and 1/6 in-dimer, at port 10 1/6 backward and 1/6 in-dimer');
ok(eq(hm.cA, '5/18') && eq(hm.cB, '1/6') && eq(hm.mean, '2/9'), 'round coefficients with the crossing: 5/18 and 1/6, mean 2/9 (LK)');
ok(near(L.phaseCrossing(2), 0.218386466745768, 2e-13) && near(L.phaseCrossing(10), 0.222070680996425, 2e-13) && near(L.phaseCrossing(1000), 0.222222207075902, 2e-13) && L.phaseCrossing(1000).toFixed(9) === '0.222222207',
  'LK\'s round with the crossing: 0.218386 (N = 2), 0.222071 (N = 10), 0.222222207 (N = 1000) by the definition of lk_echo_pulse.py');

// ------------------------------------------------------------------ rates
section('From the phase to the three rates (FR, LEPTON_STEPS section 1)');
const y = L.rates(), r = L.ratios();
ok(y[0].toFixed(10) === '0.2096935560' && y[2].toFixed(10) === '0.0124683656' && y[1].toFixed(10) === '0.0000603006', 'rates at theta = 2/9: tau 0.2096935560, muon 0.0124683656, electron 0.0000603006');
ok(near(y[0] + y[1] + y[2], 2 / 9, 1e-15), 'the three rates sum to 2/9');
ok(near(r.muE, 206.770315972729, 2e-10) && near(r.tauE, 3477.4728371046, 5e-9) && near(r.tauMu, 16.8180467334, 1e-9), 'ratios 206.770315972729 and 3477.4728371046 (values of the public certificate)');
ok(r.muE.toFixed(6) === '206.770316' && r.tauE.toFixed(4) === '3477.4728' && r.tauMu.toFixed(6) === '16.818047', 'as shown on the page: 206.770316, 3477.4728, 16.818047');
const amp = L.amplitudes();
ok(near(amp[0], 0.971401565834, 1e-12) && near(amp[1], 0.0164727810509, 1e-13) && near(amp[2], 0.236870524507, 1e-12), 'eigenvalues of C at 2/9: 0.971401565834, 0.0164727810509, 0.236870524507');
let qdev = 0, plain = 0; for (let i = 0; i <= 200; i++) { const t = (L.NODE * i) / 200, a = L.amplitudes(t); qdev = Math.max(qdev, Math.abs(L.koide(t) - 2 / 3)); plain = Math.max(plain, Math.abs(a[1] - (1 + Math.SQRT2 * Math.cos(t + 2 * Math.PI / 3)) / Math.sqrt(6))); }
ok(qdev < 1e-14, 'Koide Q = 2/3 at 201 phases between 0 and pi/12', 'largest deviation ' + qdev.toExponential(1));
ok(plain < 1e-15, 'the cancellation-free electron amplitude equals (1 + sqrt2 cos(theta + 2 pi/3))/sqrt6');
ok(Math.abs(L.amplitudes(L.NODE)[1]) < 1e-17 && near(L.amplitudes(0)[1], L.amplitudes(0)[2], 1e-15), 'the electron amplitude vanishes at pi/12; electron and muon are equal at theta = 0');
ok(near(L.koide(8 / 27), 0.6375, 5e-5) && near(L.ratios(8 / 27).muE, 404.03, 0.01) && near(L.ratios(8 / 27).tauE, 4817.46, 0.01) && near(L.ratios(4 / 27).muE, 16.13, 0.01) && near(L.ratios(4 / 27).tauE, 400.52, 0.01),
  'FR5 controls: 8/27 lies outside the chamber (Q = 0.6375, ratios 404.03 and 4817.46); 4/27 gives 16.13 and 400.52');
const dl = (f) => (Math.log(f(2 / 9 + 1e-6)) - Math.log(f(2 / 9 - 1e-6))) / 2e-6;
ok(near(dl((t) => L.ratios(t).muE), 56.14, 0.01) && near(dl((t) => L.ratios(t).tauE), 51.23, 0.01), 'sensitivities d ln(mu/e)/d theta = 56.14 and d ln(tau/e)/d theta = 51.23');

// ------------------------------------------------------------------ sampled count
section('Sampled count (illustration)');
const s = L.sampler(20261111); for (let i = 0; i < 200000; i++) s.next();
const st = s.stats, sig = (k, p) => Math.abs(k / st.n - p) / Math.sqrt(p * (1 - p) / st.n);
ok(sig(st.exclusive, 2 / 9) < 4 && sig(st.rPlus, 1 / 12) < 4 && sig(st.rMinus, 1 / 12) < 4 && sig(st.hold, 1 / 6) < 4 && sig(st.both, 1 / 72) < 4, '200,000 seeded draws: every flag frequency within four standard errors of its exact weight', `count ${s.mean().toFixed(5)} against 0.22222`);
const s2 = L.sampler(20261111); let same = true; const s3 = L.sampler(20261111); for (let i = 0; i < 500; i++) { const a = s2.next(), b = s3.next(); if (a.kx !== b.kx || a.ky !== b.ky) same = false; }
ok(same, 'the generator is deterministic for a given seed');

// ------------------------------------------------------------------ comparison (NOT BLIND)
section('Comparison with CODATA 2022 and PDG 2024 (NOT BLIND; model minus measured)');
const rows = Object.fromEntries(L.comparison().map((x) => [x.id, x]));
ok(rows.muE.modelText === '206.770316' && rows.muE.measuredText === '206.7682827(46)' && near(rows.muE.ppm, 9.83, 0.005) && near(rows.muE.sigma, 442, 0.5), 'm_mu/m_e: 206.770316 against 206.7682827(46), +9.83 ppm, 442 standard deviations', `${rows.muE.ppm.toFixed(3)} ppm, ${rows.muE.sigma.toFixed(1)} sigma`);
ok(rows.tauE.modelText === '3477.4728' && rows.tauE.measuredText === '3477.365(176)' && near(rows.tauE.ppm, 31, 0.5) && near(rows.tauE.sigma, 0.61, 0.005), 'm_tau/m_e: 3477.4728 against 3477.365(176), +31 ppm, +0.61 sigma', `${rows.tauE.ppm.toFixed(2)} ppm, ${rows.tauE.sigma.toFixed(3)} sigma`);
ok(rows.tauMu.modelText === '16.818047' && rows.tauMu.measuredText === '16.817692(852)' && near(rows.tauMu.ppm, 21, 0.5) && near(rows.tauMu.sigma, 0.42, 0.005), 'm_tau/m_mu: 16.818047 against 16.817692(852), +21 ppm, +0.42 sigma', `${rows.tauMu.ppm.toFixed(2)} ppm, ${rows.tauMu.sigma.toFixed(3)} sigma`);
ok(rows.koide.measuredText === '0.6666645(51)' && near(rows.koide.sigma, 0.43, 0.005), 'Koide Q: 2/3 against 0.6666645(51), 0.43 sigma above the measured value', `${rows.koide.ppm.toFixed(2)} ppm, ${rows.koide.sigma.toFixed(3)} sigma`);
ok(rows.mMu.modelText === '105.659414' && near(rows.mMu.diff * 1000, 1.04, 0.005), 'm_mu with the electron mass as the anchor: 105.659414 MeV, +1.04 keV', `${rows.mMu.sigma.toFixed(1)} sigma`);
ok(rows.mTau.modelText === '1776.985' && near(rows.mTau.diff, 0.055, 0.0005) && near(rows.mTau.sigma, 0.61, 0.005), 'm_tau with the electron mass as the anchor: 1776.985 MeV, +0.055 MeV, +0.61 sigma');
ok(near(L.ratios(2 / 9 - 1.7515e-7).muE, 206.7682827, 3e-7) && near(L.ratios(2 / 9 - 1.7515e-7).tauE * 0.51099895069, 1776.969, 0.0005), 'the phase 2/9 - 1.7515e-7 reproduces mu/e and gives m_tau = 1776.969 MeV (a fit, on file in LEPTON_STEPS)');
ok(L.concise(206.7682827, 0.0000046) === '206.7682827(46)' && L.concise(1776.93, 0.09, 1) === '1776.93(9)', 'concise notation of value and uncertainty');

// ------------------------------------------------------------------ what a lepton is
section('Lepton patterns of the five-level code (defect_particle_classes, decoder data)');
const pat = Object.fromEntries(L.LEPTON_PATTERNS.map((x) => [x.id, L.pattern(x.mask)]));
ok(pat.nu_L.bits === '11110' && eq(pat.nu_L.Y, '-1/2') && eq(pat.nu_L.T3, '1/2') && eq(pat.nu_L.Q, '0') && pat.nu_L.k === 3, 'left-handed neutrino: levels v1 v2 v3 s1, Y = -1/2, T3 = +1/2, Q = 0, class 3');
ok(pat.e_L.bits === '11101' && eq(pat.e_L.Y, '-1/2') && eq(pat.e_L.T3, '-1/2') && eq(pat.e_L.Q, '-1') && pat.e_L.k === 3, 'left-handed electron: levels v1 v2 v3 s2, Y = -1/2, T3 = -1/2, Q = -1, class 3');
ok(pat.e_R.bits === '11100' && eq(pat.e_R.Y, '-1') && eq(pat.e_R.Q, '-1') && pat.e_R.k === 0, 'right-handed electron: levels v1 v2 v3, Y = -1, Q = -1, class 0');
const all = [...Array(32).keys()].map((m) => L.pattern(m)), classCount = [0, 0, 0, 0, 0, 0]; all.forEach((x) => classCount[x.k]++);
ok(all.every((x) => x.sixY === 3 * x.n2 - 2 * x.n3 && x.k === (((3 * (x.n2 % 2) - 2 * (x.n3 % 3)) % 6) + 6) % 6) && classCount.join(',') === '4,6,6,4,6,6', 'class rule k = 3 (n2 mod 2) - 2 (n3 mod 3) on all 32 patterns, multiplicities 4, 6, 6, 4, 6, 6');
ok(all.filter((x) => x.n3 === 0 || x.n3 === 3).every((x) => x.k === 0 || x.k === 3) && all.filter((x) => x.k === 3).every((x) => x.n3 % 3 === 0 && x.n2 === 1), 'colour singlets (three colour levels occupied or none) carry class 0 or 3; class 3 has one weak level occupied');
const dec = VIEWER + 'rl/PD/decoder.json';
if (existsSync(dec)) {
  const D = JSON.parse(readFileSync(dec, 'utf8')), by = Object.fromEntries(D.patterns.map((x) => [x.mask, x]));
  ok(all.every((x) => by[x.mask].bits === x.bits && by[x.mask].Y === String(x.Y) && by[x.mask].T3 === String(x.T3) && by[x.mask].Q === String(x.Q) && by[x.mask].k === x.k), 'charges and classes of all 32 patterns equal the decoder data');
  ok(L.LEPTON_PATTERNS.every((x) => by[x.mask].name === x.id), 'the three shown patterns are named nu_L, e_L, e_R in the decoder data');
} else console.log('SKIP  research/PD/decoder.json is not reachable');
ok(L.comparison().filter((x) => x.incomplete).map((x) => x.id).join(' ') === 'mMu mTau', 'the two values in MeV carry the mark "derivation incomplete"');

// ------------------------------------------------------------------ reader of the executed run
section('Reader of /rl/LR/lepton_run.json (three layouts)');
const pA = L.parseRun({ fields: { a: 'x' }, phase_against_ticks: [{ ticks: 10, phase_per_unit_clock_time: 0.21, modulus: 0.9 }, { ticks: 1, phase_per_unit_clock_time: 0.2 }, { ticks: 100, phase_per_unit_clock_time: 0.222 }],
  rates: { executed: { tau: 0.21, muon: 0.0125, electron: 0.00006 }, formula: { tau: 0.2097, muon: 0.01247, electron: 0.0000603 } }, counts: { tau: 10, electron: 11, muon: 9 }, statements: [{ label: 'EXACT', text: 'a' }, 'b'] });
ok(pA.phase && pA.phase.x.join(',') === '1,10,100' && pA.phase.y[2] === 0.222 && pA.rates.tau === 0.21 && pA.formula.electron === 0.0000603 && pA.statements.length === 2 && pA.doc, 'rows with ticks and phase, rates grouped as executed and formula');
const pB = L.parseRun({ run: { N: [1, 2, 3], phase: [0.2, 0.21, 0.22], phase_limit: 0.2222 }, three_rates: { electron: { executed: 6e-5, formula: 6.03e-5 }, muon: { executed: 0.0124, formula: 0.01247 }, tau: { executed: 0.2096, formula: 0.2097 } } });
ok(pB.phase && pB.phase.y.length === 3 && pB.rates.muon === 0.0124 && pB.formula.muon === 0.01247 && pB.limit === 0.2222, 'parallel arrays, rates with executed and formula inside each entry');
const pC = L.parseRun({ rows: [{ N: 1, 'phase per unit clock time': 0.2053 }, { N: 10, 'phase per unit clock time': 0.2221 }], rates_per_tick: { e: 6e-5, mu: 0.0125, tau: 0.21 }, masses_MeV: { e: 0.5, mu: 105, tau: 1777 } });
ok(pC.phase && pC.phase.xKey === 'N' && pC.rates.electron === 6e-5 && pC.rates.tau === 0.21 && pC.formula === null, 'a phase key that contains the word time, short lepton names, a mass table that is skipped');
const pD = L.parseRun({ note: 'nothing here' });
ok(pD.phase === null && pD.rates === null, 'a file without the expected content yields nothing');
const runFile = VIEWER + 'rl/LR/lepton_run.json';
if (existsSync(runFile)) { const p = L.parseRun(JSON.parse(readFileSync(runFile, 'utf8')));
  ok(!!p.phase && p.phase.x.every((N, i) => near(p.phase.y[i], L.phasePerUnit(N), 1e-10)), 'run file of lane LR: the executed phase equals the closed form at every number of rounds', p.phase ? p.phase.x.length + ' runs, N up to ' + p.phase.x[p.phase.x.length - 1] : 'no series');
  ok(!!p.rates && L.LEPTONS.every((q) => Math.abs(p.rates[q.name] / L.rates()[q.k] - 1) < 1e-9), 'run file of lane LR: the three executed rates equal y_k within one part in a billion');
  console.log(`INFO  ${runFile}: series ${p.phase ? p.phase.x.length + ' points (' + p.phase.xKey + ', ' + p.phase.yKey + ')' : 'none'}, rates ${p.rates ? JSON.stringify(p.rates) : 'none'}, formula ${p.formula ? 'yes' : 'no'}, statements ${p.statements.length}`); }
else console.log('INFO  research/LR/lepton_run.json does not exist yet: the page says that the run is in progress');

// ------------------------------------------------------------------ imported texts and tables
section('Imported texts and tables');
ok(L.OPEN_STEPS.map((x) => x.id).join(' ') === 'L1 L2 L3 L4 L5 L6' && L.OPEN_STEPS.every((x) => !x.missing || x.state.includes(x.missing)), 'six open items L1 to L6, each gap sentence is part of its state text');
const RETIRED = new RegExp(['16', '2[45]'].join('\\.') + '|' + ['10', '03'].join('\\.') + '|7e' + '9');   // the retired values of ADDENDUM_THEORY.md, spelled in parts
ok(!RETIRED.test(JSON.stringify(L.OPEN_STEPS) + JSON.stringify(L.RESIDUAL) + JSON.stringify(L.comparison())), 'no retired value of the theory addendum in the texts and tables of the engine');
const steps = RL + '/LEPTON_STEPS.md';
if (existsSync(steps)) {
  const t = readFileSync(steps, 'utf8');
  ok(L.OPEN_STEPS.every((x) => t.includes(`| ${x.id} | ${x.item} | ${x.state} |`)), 'steps L1 to L6 are word for word the rows of LEPTON_STEPS.md section 4');
} else console.log('SKIP  LEPTON_STEPS.md is not reachable');
const ld = RL + '/reports/LD.md';
if (existsSync(ld)) {
  const t = readFileSync(ld, 'utf8'), tab = Object.fromEntries(t.split('\n').filter((l) => /^\| R\d \|/.test(l)).map((l) => { const c = l.split('|').map((x) => x.trim()); return [c[1], c]; }));
  ok(L.RESIDUAL.rows.every((x) => tab[x.id] && tab[x.id][2].startsWith(x.reading) && tab[x.id][3] === x.coefficient && tab[x.id][5] === x.mTau && tab[x.id][6] === x.dQ && Math.abs(parseFloat(tab[x.id][4].replace('+', '')) - x.ppm) < 1e-9), 'residual rows R0 to R8 equal the table of LD.md section 6');
  ok(t.includes('needed coefficient -1.8215(41)'), 'needed coefficient -1.8215(41) as in LD.md');
} else console.log('SKIP  reports/LD.md is not reachable');

// ------------------------------------------------------------------ the public executable
section('Public executable RER/model/lepton_register_round (results.json)');
const res = RER + '/model/lepton_register_round/results.json';
if (existsSync(res)) {
  const R = JSON.parse(readFileSync(res, 'utf8')), c2 = L.twoCells(2, 2), w2 = L.weakRound(2);
  ok(R.all_checks_pass === true && Object.keys(R.checks).length === 99 && Object.values(R.checks).every(v => v === true), 'the certificate reports 99 checks, all passing');
  ok(R.carrier.double_load_at_port_2.blank === String(ticks[2].weights.blank) && R.carrier.double_load_at_port_2['record 2'] === String(ticks[2].weights.record2) && R.carrier.double_load_at_port_2['record 3'] === String(ticks[2].weights.record3), 'record weights at port 2 equal the certificate');
  ok(R.carrier.two_cells_at_port_2.p_r === String(c2.pR) && R.carrier.two_cells_at_port_2.p_h === String(c2.pH) && R.carrier.two_cells_at_port_2.joint === String(c2.joint) && R.carrier.two_cells_at_port_2.count === String(c2.count), 'two-cell weights and count equal the certificate');
  ok(R.carrier.weak_round_port_2['<D|W^-1 Pi_R+ W|D>'] === String(w2.sA) && R.carrier.weak_round_port_2['<D|W^-1 Pi_H W|D>'] === String(w2.sB) && R.carrier.weak_round_port_2.non_return_X.norm2 === String(w2.nonReturnA.norm2) && R.carrier.weak_round_port_2.non_return_Y.norm2 === String(w2.nonReturnB.norm2), 'weak-round overlaps and non-return norms equal the certificate');
  ok(['1', '10', '100', '1000'].every((N) => near(L.phasePerUnit(+N), parseFloat(R.weak_round.rounds[N]['phase per unit clock time']), 2e-13) && near(L.modulusKept(+N), parseFloat(R.weak_round.rounds[N]['modulus kept']), 2e-12)), 'phases and moduli at N = 1, 10, 100, 1000 equal the certificate');
  ok(near(r.muE, parseFloat(R.register.register_outputs.mu_over_e), 2e-10) && near(r.tauE, parseFloat(R.register.register_outputs.tau_over_e), 5e-9), 'ratios equal the register outputs of the certificate');
  ok(R.kick.one_port_round['A at port 2, B at port 2'].coefficient === String(hm.cA) && R.kick.one_port_round['A at port 10, B at port 2'].coefficient === String(hm.cB), 'crossing coefficients equal the certificate');
  ok(R.double_loads.hexagon_ports.join(',') === HX.loop.join(',') && [...R.double_loads.third_turn_orbit].sort().join(',') === [...HX.orbit].sort().join(','), 'hexagon and orbit equal the certificate');
} else console.log('SKIP  the public results.json is not reachable');

console.log(`\n${fails ? 'FAIL' : 'PASS'}  ${passes} checks passed, ${fails} failed`);
process.exit(fails ? 1 : 0);
