// Checks of lattice_mc.js, the engines of the Lattice page. Run: node lattice_check.mjs
// Reference values: report MA of the theory side (run H4) and the public proofs of the coherent seam repair.
// Seeds and sweep counts are fixed here; the planned comparisons and their pass rules were written down before the
// first run (repair-law/work/SIM/phase2/LATTICE/CANDIDATES.md). Each line prints PASS or FAIL with its numbers.
import { readFileSync, existsSync } from 'node:fs';
import { LinkEnsemble, REF, PLANES, onePlaquette, z2TorusDensity, z2TorusMean, centreCost, icosahedron, cubicFrames, portKernel, CoherentWalk,
  coherentPopulations, classicalPopulations, meshValence, chooseTrack, buildWindow, classesOnCuts, solveLinks, carrierLinksAt, carrierClasses, pickFaceStory } from './lattice_mc.js';

let fails = 0, passes = 0;
const line = (ok, name, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}${detail ? ' · ' + detail : ''}`); if (ok) passes++; else fails++; };
const stat = (xs, nb = 20) => {                              // mean and error from nb block means
  const m = Math.floor(xs.length / nb), b = []; for (let i = 0; i < nb; i++) { let s = 0; for (let j = 0; j < m; j++) s += xs[i * m + j]; b.push(s / m); }
  const mean = b.reduce((a, c) => a + c, 0) / nb, v = b.reduce((a, c) => a + (c - mean) ** 2, 0) / (nb - 1);
  return [mean, Math.sqrt(v / nb), b];
};
const pm = (x, e, d = 4) => `${x.toFixed(d)}(${Math.round(e * 10 ** d)})`;
function sample({ N, shape, kappa, seed, therm, sweeps, loops = 0 }) {
  const E = new LinkEnsemble({ N, shape, kappa, seed, start: 'hot' }); E.sweep(therm);
  const w = [], f = [], W = [];
  for (let i = 0; i < sweeps; i++) { E.sweep(1); const o = E.plaquettes(); w.push(o.w); f.push(o.f); if (loops) W.push(E.wilson(loops)); }
  return { w, f, W, E };
}

// ---------------------------------------------------------------- the link ensemble against report MA
{
  const t0 = performance.now(), hist = z2TorusDensity(), exact = z2TorusMean(0.5, hist), states = hist.reduce((a, b) => a + b, 0);
  line(states === 16777216 && Math.abs(exact - REF.checks.z2_torus_05) < 5e-7, 'C1 exact enumeration, Z2 on the 2^3 torus at kappa 0.5', `mean Re W = ${exact.toFixed(6)}, reference 0.654778, ${states} states, ${((performance.now() - t0) / 1000).toFixed(1)} s`);
  const r = sample({ N: 2, shape: [2, 2, 2], kappa: 0.5, seed: 11, therm: 500, sweeps: 40000 }), [m, e] = stat(r.w);
  line(Math.abs(m - exact) <= 4 * e, 'C2 heat bath on the 2^3 torus against the enumeration', `${pm(m, e)} against ${exact.toFixed(6)}, ${((m - exact) / e).toFixed(2)} errors`);
}
{
  const r = sample({ N: 2, shape: [8, 8, 8], kappa: 0.15, seed: 12, therm: 300, sweeps: 6000 }), [m, e] = stat(r.w), [ref, re] = REF.checks.z2_8_015, one = onePlaquette(2, 0.15);
  line(Math.abs(m - ref) <= 3 * Math.hypot(e, re) && Math.abs(m - one) <= 4 * e + 2e-4, 'C3 Z2 on 8^3 at kappa 0.15', `mean Re W = ${pm(m, e)}, MA 0.1487(15), one plaquette ${one.toFixed(6)}`);
}
{
  const r = sample({ N: 3, shape: [8, 8, 8], kappa: 0.2, seed: 13, therm: 300, sweeps: 6000 }), [m, e] = stat(r.w), [ref, re] = REF.checks.z3_8_02, one = onePlaquette(3, 0.2);
  line(Math.abs(m - ref) <= 3 * Math.hypot(e, re), 'C4 Z3 on 8^3 at kappa 0.2', `mean Re W = ${pm(m, e)}, MA 0.1054(18), one plaquette ${one.toFixed(6)}`);
}
for (const N of [2, 3]) {                                    // exact invariances
  const E = new LinkEnsemble({ N, shape: [6, 4, 8], kappa: 0.6, seed: 20 + N, start: 'hot' }); E.sweep(20);
  const p0 = new Uint8Array(3 * E.V), a = E.plaquettes(p0), W0 = E.wilson(3), P0 = E.polyakov();
  const g = new Int8Array(E.V); for (let i = 0; i < E.V; i++) g[i] = Math.floor(E.rnd() * N);
  E.gaugeTransform(g);
  const p1 = new Uint8Array(3 * E.V), b = E.plaquettes(p1), W1 = E.wilson(3);
  let dW = 0; for (let i = 0; i < 9; i++) dW = Math.max(dW, Math.abs(W0[i] - W1[i]));
  line(p0.every((x, i) => x === p1[i]) && dW < 1e-12 && Math.abs(W0[0] - a.w) < 1e-12, `C5 gauge invariance, Z${N}`, `plaquettes identical, Wilson loops change by ${dW.toExponential(1)}, W(1,1) - plaquette = ${Math.abs(W0[0] - a.w).toExponential(1)}`);
  // net flux through every full lattice plane is trivial
  let bad = 0; const [L0, L1, L2] = E.shape, sh = [L0, L1, L2];
  for (let k = 0; k < 3; k++) { const rho = 3 - PLANES[k][0] - PLANES[k][1]; for (let c = 0; c < sh[rho]; c++) { let s = 0; for (let x = 0; x < E.V; x++) if (E.coord[rho][x] === c) s += p1[k * E.V + x]; if (s % N) bad++; } }
  line(bad === 0, `C7 the flux through every full lattice plane is trivial, Z${N}`, `${L0 + L1 + L2} planes of a hot field`);
  // a centre transformation of one layer: no plaquette changes, the Polyakov loop along that axis turns by omega^k
  E.centreTwist(1, 2, 1); const p2 = new Uint8Array(3 * E.V); E.plaquettes(p2); const P1 = E.polyakov(), c = Math.cos(2 * Math.PI / N), s = Math.sin(2 * Math.PI / N);
  const dP = Math.hypot(P1[2] - (c * P0[2] - s * P0[3]), P1[3] - (s * P0[2] + c * P0[3])) + Math.hypot(P1[0] - P0[0], P1[1] - P0[1]) + Math.hypot(P1[4] - P0[4], P1[5] - P0[5]);
  line(p1.every((x, i) => x === p2[i]) && dP < 1e-12, `C13 centre transformation of one layer, Z${N}`, `plaquettes identical, Polyakov loop turns by omega (defect ${dP.toExponential(1)})`);
  line(Math.abs(b.w - (N === 2 ? 1 - 2 * b.f : 1 - 1.5 * b.f)) < 1e-12, `C14 mean Re W from the share of nontrivial faces, Z${N}`, N === 2 ? '<Re W> = 1 - 2f' : '<Re W> = 1 - 3f/2');
  // flux lines never end: the oriented flux out of every cube is trivial (they close for Z2 and may branch in threes for Z3)
  let open = 0;
  for (let x = 0; x < E.V; x++) { const s = (p2[E.xp[2][x]] - p2[x]) + (p2[2 * E.V + E.xp[0][x]] - p2[2 * E.V + x]) - (p2[E.V + E.xp[1][x]] - p2[E.V + x]); if (((s % N) + N) % N) open++; }
  line(open === 0, `C22 flux lines never end, Z${N}`, `the flux out of each of the ${E.V} cubes of a hot field is trivial`);
  const C = new LinkEnsemble({ N, shape: [4, 4, 4] }); C.n[C.V + 21] = 1;
  line(Math.round(C.plaquettes().f * 3 * C.V) === 4, `C6 one changed link on an ordered lattice, Z${N}`, '4 nontrivial plaquettes');
}
for (const [N, kappa, seed, ref] of [[2, 0.5, 14, 0.2488], [3, 0.5, 15, 0.4835], [3, 0.8, 16, 0.3486]]) {
  const r = sample({ N, shape: [12, 12, 12], kappa, seed, therm: 500, sweeps: 3000 }), [m, e] = stat(r.f);
  line(Math.abs(m - ref) <= 3 * Math.hypot(e, 1e-4) + 3e-4, `C8 share of nontrivial faces, Z${N} on 12^3 at kappa ${kappa}`, `${pm(m, e, 5)}, MA on 48^3: ${ref}`);
}
{
  const r = sample({ N: 3, shape: [12, 12, 12], kappa: 0.9305, seed: 17, therm: 800, sweeps: 4000, loops: 2 }), [m, e] = stat(r.f);
  const nb = 20, per = Math.floor(r.W.length / nb), sum = new Float64Array(4), blocks = [];
  for (let b = 0; b < nb; b++) { const s = new Float64Array(4); for (let i = 0; i < per; i++) for (let q = 0; q < 4; q++) s[q] += r.W[b * per + i][q]; blocks.push(s); for (let q = 0; q < 4; q++) sum[q] += s[q]; }
  const chiOf = (s) => -Math.log(s[3] * s[0] / (s[1] * s[1])), chi = chiOf(sum), jk = blocks.map((b) => chiOf(sum.map((x, q) => x - b[q])));
  const jm = jk.reduce((a, c) => a + c, 0) / nb, ce = Math.sqrt((nb - 1) / nb * jk.reduce((a, c) => a + (c - jm) ** 2, 0));
  line(Math.abs(m - 0.26781) <= 3 * Math.hypot(e, 3e-5) + 3e-4, 'C9 Z3 on 12^3 at kappa 0.9305: share of nontrivial faces', `${pm(m, e, 5)}, MA on 96 x 48 x 48: 0.26781(3)`);
  line(Math.abs(chi - 0.455) <= 3 * Math.hypot(ce, 0.002) + 0.005, 'C9 Z3 on 12^3 at kappa 0.9305: Creutz ratio chi(2,2)', `${pm(chi, ce, 3)}, MA: 0.455(2)`);
}

// ---------------------------------------------------------------- the action on the central elements
{
  const want = [0, 17 / 10, 9 / 10, 4 / 5, 9 / 10, 17 / 10]; let bad = 0;
  for (let k = 0; k < 6; k++) {
    const c = centreCost(k), w3 = Math.cos(2 * Math.PI * k / 3), w2 = k % 2 ? -1 : 1;
    if (Math.abs(c.total - want[k]) > 1e-12 || Math.abs(c.total - (1 - (3 * w3 + 2 * w2) / 5)) > 1e-12 || Math.abs(c.colour + c.weak - c.total) > 1e-12) bad++;
  }
  line(bad === 0, 'C10 plaquette cost of the central element of class k', '(0, 17/10, 9/10, 4/5, 9/10, 17/10) = 9/10 [colour part nontrivial] + 4/5 [weak part nontrivial]');
  // the central elements z_k = diag(w^k, w^k, w^k, (-1)^k, (-1)^k) form a cyclic group of order six: z_j z_k = z_(j+k)
  let ok = true; const z = (k) => [((k % 3) + 3) % 3, ((k % 2) + 2) % 2];
  for (let j = 0; j < 6; j++) for (let k = 0; k < 6; k++) { const a = z(j), b = z(k), c = z((j + k) % 6); if ((a[0] + b[0]) % 3 !== c[0] || (a[1] + b[1]) % 2 !== c[1]) ok = false; }
  const distinct = new Set([0, 1, 2, 3, 4, 5].map((k) => z(k).join())).size;
  line(ok && distinct === 6, 'C18 the central elements multiply as Z6', 'six distinct elements, z_j z_k = z_(j+k): the class of a face of central links is the sum of the link classes mod 6');
}

// ---------------------------------------------------------------- the carrier: five cubic frames, the cubic family
{
  const ico = icosahedron(), fr = cubicFrames(ico), adj = Array.from({ length: 12 }, () => []);
  ico.E.forEach(([a, b], i) => { adj[a].push([b, i]); adj[b].push([a, i]); });
  const matchings = [], used = new Uint8Array(12), cur = [];
  (function rec() {
    let v = 0; while (v < 12 && used[v]) v++;
    if (v === 12) { matchings.push(cur.slice()); return; }
    used[v] = 1; for (const [u, e] of adj[v]) if (!used[u]) { used[u] = 1; cur.push(e); rec(); cur.pop(); used[u] = 0; } used[v] = 0;
  })();
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], m2 = ico.phi * ico.phi;
  const cubic = matchings.filter((M) => M.every((e) => M.every((f) => { const d = dot(ico.mid[e], ico.mid[f]); return e === f || Math.abs(d + m2) < 1e-9 || Math.abs(d) < 1e-9; })) && M.every((e) => M.some((f) => Math.abs(dot(ico.mid[e], ico.mid[f]) + m2) < 1e-9)));
  const cover = new Uint8Array(30); cubic.forEach((M) => M.forEach((e) => cover[e]++));
  const same = cubic.length === 5 && cubic.every((M) => fr.frames.some((F) => F.slice().sort((a, b) => a - b).join() === M.slice().sort((a, b) => a - b).join()));
  line(ico.E.length === 30 && ico.F.length === 20 && matchings.length === 125 && cubic.length === 5 && cover.every((c) => c === 1) && same, 'C11 five cubic frames',
    `${matchings.length} perfect matchings of the seam graph, ${cubic.length} with six seams centred on three perpendicular axes, and these partition the ${ico.E.length} seams`);
  // carriers in the orientation of the frame on the cubic lattice of spacing 2 phi
  const key = (p) => p.map((x) => Math.round(x * 1e6)).join(), own = new Map(ico.V.map((p, i) => [key(p), i])), count = new Uint8Array(12), a = 2 * ico.phi; let ok = true;
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) {
    const shared = ico.V.map((p) => own.get(key([p[0] + a * i, p[1] + a * j, p[2] + a * k]))).filter((x) => x !== undefined);
    shared.forEach((x) => count[x]++);
    const axis = Math.abs(i) + Math.abs(j) + Math.abs(k) === 1;
    if (!i && !j && !k) continue;
    if (axis) { const e = ico.E.findIndex((s) => s.includes(shared[0]) && s.includes(shared[1])); if (shared.length !== 2 || e < 0 || fr.frame[e] !== 0) ok = false; } else if (shared.length) ok = false;
  }
  line(ok && count.every((c) => c === 2), 'C12 the cubic family of carriers', 'each carrier touches each of its six neighbours along exactly one seam of the frame, and every port lies in two carriers');
}

// ---------------------------------------------------------------- repair as a random step and its unitary completion
{
  const ico = icosahedron(), K = portKernel(ico), c = 1 / Math.sqrt(60); let d1 = 0, d2 = 0, d3 = 0;
  for (let p = 0; p < 12; p++) {
    const w = new CoherentWalk(ico).embed(p), x0 = w.psi.slice(); w.step(); const a = w.project();
    for (let q = 0; q < 12; q++) d1 = Math.max(d1, Math.abs(a[q] - K[12 * q + p]));
    const wi = new CoherentWalk(ico); wi.psi.set(x0); wi.applyR(wi.applyQ(wi.psi));                          // W^-1 = R Q
    for (let k = 0; k < 60; k++) for (let r = 0; r < 2; r++) for (let q = 0; q < 12; q++) { const i = CoherentWalk.index(q, r, k); d2 = Math.max(d2, Math.abs(x0[i] - (w.psi[i] + wi.psi[i]) / 2 - (r ? 0 : c * ((q === p ? 1 : 0) - K[12 * q + p])))); }
    let n = 0; for (const v of w.psi) n += v * v; d3 = Math.max(d3, Math.abs(n - 1));
  }
  line(d1 < 1e-12 && d2 < 1e-12 && d3 < 1e-12, 'C15 the unitary tick on all twelve ports', `|A†WA - K| = ${d1.toExponential(1)}, |(1 - Re W)A - A(1 - K)| = ${d2.toExponential(1)}, norm defect ${d3.toExponential(1)}`);
  // spectrum of K: 1, 11/12 + sqrt5/60, 11/12 - sqrt5/60, 9/10 with multiplicities 1, 3, 3, 5 (power traces)
  const lam = [[1, 1], [11 / 12 + Math.sqrt(5) / 60, 3], [11 / 12 - Math.sqrt(5) / 60, 3], [9 / 10, 5]]; let M = Float64Array.from(K), dt = 0;
  const mul = (A, B) => { const C = new Float64Array(144); for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) { let s = 0; for (let k = 0; k < 12; k++) s += A[12 * i + k] * B[12 * k + j]; C[12 * i + j] = s; } return C; };
  for (let n = 1; n <= 6; n++) { let tr = 0; for (let i = 0; i < 12; i++) tr += M[13 * i]; dt = Math.max(dt, Math.abs(tr - lam.reduce((a, [l, m]) => a + m * l ** n, 0))); M = mul(M, K); }
  line(dt < 1e-12, 'C16 the kernel K = 1 - L/60', `traces of K^1..K^6 equal those of the spectrum 1, 11/12 ± sqrt5/60, 9/10 with multiplicities 1, 3, 3, 5 (defect ${dt.toExponential(1)})`);
  const co = coherentPopulations(2), cl = classicalPopulations(2);
  line(Math.abs(co[13] - 11 / 12) < 1e-12 && Math.abs(cl[12] - 11 / 12) < 1e-12 && Math.abs(co[26] - 643 / 900) < 1e-12 && Math.abs(cl[24] - 101 / 120) < 1e-12 && Math.abs(co[25] - 1 / 12) < 1e-12,
    'C17 return to the start port', `after one tick 11/12 for both; after two ticks 643/900 coherent and 101/120 for the repair; record weight after one tick 1/12`);
}

// ---------------------------------------------------------------- the stored run read as a link field (needs the run on disk)
{
  const RUN = '/Users/muellerberndt/Projects/oph-meta/oph-physics-sim/runs/universe/L6/';
  if (!existsSync(RUN + 'run.json')) console.log('SKIP: C19 to C21, the stored run L6 is not on this disk');
  else {
    globalThis.fetch = async (p) => new Response(readFileSync(p));
    const { loadNpz } = await import('./npz.js');
    const meta = JSON.parse(readFileSync(RUN + 'run.json')), geo = meta.geometry, sp = geo.cell_spacing, N = geo.carriers;
    const disp = await loadNpz(RUN + 'view/display.npz'), D = await loadNpz(RUN + 'view/observer_defects.npz');
    const pick = chooseTrack(D, meta.observers, disp.cell_xyz, sp), c = pick.c;
    const O = await loadNpz(`${RUN}observers/obs_${c}.npz`, ['patch_cells', 'cut_depth', 'tape_slot', 'tape_twist', 'tape_current', 'tape_depth']);
    const win = buildWindow({ tri: disp.tri, meshXyz: disp.mesh_xyz, cellXyz: disp.cell_xyz, valence: meshValence(disp.tri, disp.mesh_xyz.length / 3), patchCells: O.patch_cells, centre: pick.centre, half: Math.max(4, pick.ext + 1.8), sp, aspect: 2.5 });
    let last = O.cut_depth.length - 1; while (last > 0 && O.cut_depth[last] < 0) last--;
    const j0 = Math.max(1, pick.first - 3), j1 = Math.min(last, pick.last + 3), { K } = classesOnCuts(win, D['o' + c + '_cut'], D['o' + c + '_cls'], D['o' + c + '_id'], D['o' + c + '_xyz'], j0, j1);
    const sol = solveLinks(win, K), moved = sol.changed.slice(1).reduce((a, x) => a + x.length, 0), hops = pick.hops;
    line(sol.bad === 0 && win.faces > 20, 'C19 links of the patch from the stored classes', `observer ${c}, cuts ${j0} to ${j1}: ${win.faces} faces, ${win.ns} seams, ${sol.bad} class mismatches, ${moved} link changes for ${hops} hops of the followed defect`);
    // the orientation rule against the geometry of the run: glue_fp is the face around which a -> b runs counterclockwise
    const G = await loadNpz(RUN + 'geometry.npz', ['glue_a', 'glue_b', 'glue_fp', 'glue_fm']), at = new Map(win.cells.map((cell, i) => [cell, i])); let seen = 0, wrong = 0;
    const seamOf = new Map(); for (let s = 0; s < win.ns; s++) seamOf.set(Math.min(win.seamA[s], win.seamB[s]) * 1e6 + Math.max(win.seamA[s], win.seamB[s]), s);
    for (let gI = 0; gI < G.glue_a.length; gI++) {
      const a = at.get(Math.floor(G.glue_a[gI] / 12)), b = at.get(Math.floor(G.glue_b[gI] / 12)); if (a === undefined || b === undefined) continue;
      const s = seamOf.get(Math.min(a, b) * 1e6 + Math.max(a, b)); if (s === undefined) continue; seen++;
      const plusVertex = win.verts[win.seamA[s] === a ? win.plus[s] : win.minus[s]];                           // the face that reads a -> b positively
      if (plusVertex !== G.glue_fp[gI] - 20 * N) wrong++;
    }
    line(seen > 100 && wrong === 0, 'C20 orientation rule of the faces', `${seen} glue seams of the window: the face glue_fp of the run is the face around which a -> b runs counterclockwise (${wrong} exceptions)`);
    // one carrier from its own tape against the stored classes of its twenty faces
    const cuts = [3, 10, 25, 60, 100, 140, last].filter((j) => j <= last); let cmp = 0, diff = 0;
    for (const j of cuts) {
      const Z = await loadNpz(`${RUN}cuts/cut_${String(j).padStart(5, '0')}.npz`, ['intra_face', 'intra_cls']), stored = new Int8Array(20);
      for (let i = 0; i < Z.intra_face.length; i++) { const f = Z.intra_face[i] - 20 * c; if (f >= 0 && f < 20) stored[f] = Z.intra_cls[i]; }
      const cls = carrierClasses(carrierLinksAt(O, O.cut_depth[j]), geo); for (let f = 0; f < 20; f++) { cmp++; if (cls[f] !== stored[f]) diff++; }
    }
    const story = pickFaceStory(geo, O);
    line(diff === 0 && story && story.steps.length > 3, 'C21 one carrier from its tape', `observer ${c}: the links summed from the tape give the stored classes of its twenty faces on ${cuts.length} cuts (${cmp} comparisons, ${diff} differences); richest face ${story.face} with ${story.applied} applied link changes`);
  }
}
console.log(`${fails ? 'FAILED' : 'ALL PASS'}: ${passes} passed, ${fails} failed`);
process.exit(fails ? 1 : 0);
