// The zoom view of the Screen page: the neighbourhood of the selected defect, in the look of the Defects page.
// It shows the slice the main timeline shows and follows the identity from slice to slice. Every mark is the run's own
// record, nothing is invented:
//   carriers   the cells of the screen mesh (view/display.npz: tri, cell_xyz), each a glow coloured by the summed load of
//              its twelve ports on the slice (load_map of the slice file) against the mean of the whole screen, in units
//              of 2.2 standard deviations
//   seams      one glue seam for every two carriers that share an edge of the mesh
//   repairs    pulses on the carriers whose port loads changed between the slice before and this one (loads of the two
//              slice files, summed absolute change over the twelve ports; load_map where a run stores no port loads),
//              shown where the change exceeds the mean change of the neighbourhood
//   defects    the stored positions of the slice (screen_xyz, and the internal tier when it is switched on): the selected
//              identity in its class colour with its label, the partner of its birth joined to it, the others dimmer;
//              trail and path join its stored positions on the slices in memory
//   births, endings, lifetime and hops: the catalogue of the run (view/catalogue.npz)
// All of this is in the viewer copy of a run (dataset.lite) and, apart from a slice that is not in memory yet, already
// loaded by the Screen page. The picture is an azimuthal equidistant map around a point that follows the defect; one unit
// of length is the spacing of neighbouring carriers.
//
//   mountZoom(container)   builds the view; without a container it sits between the heading and the card of the
//                          selected defect in the side panel; with the stage as container it floats over its lower left
//   showZoom(id)           opens the view on a defect identity; null closes it
//   zoomFrame(frameIndex)  the main timeline moved to this slice
import { $, S, fmt, select, showPage, closedLoop } from './app.js';
import { loadNpz } from './npz.js';
import { CLASSES, classGlyph } from './classes.js';
import { busy } from './progress.js';

const HALF = 5.5;                  // half height of the picture in carrier spacings (the following window of the Defects page)
const WIDE = 8.6;                  // the picture opens this wide and closes in
const REACH = 19;                  // carriers are collected within this many spacings of the followed point
const NEAR = 15.5;                 // other defects are taken within this many spacings
const JUMP = 9;                    // a move beyond this many spacings re-centres the picture at once
const TRAIL = 14;                  // slices of the fading trail
const SPAN = 40;                   // slices on either side joined by the dashed path (the page loads them for its own trail)
const PULSE = 640, BEAT = 2600;    // ms: one repair pulse, and its repeat while the timeline rests
const BLEND = 380;                 // ms: loads fade from the slice before to this one
const CAUSE = ['', 'annihilation', 'fusion', 'split', 'exchange'];
const ORANGE = '255,157,74', BLUE = '77,141,255', YELLOW = '255,228,92', RED = '255,95,122';

const views = [];                  // mounted copies of the view
const own = new Map(), pending = new Map();      // slices this view loaded itself
const STAT = new WeakMap();        // slice -> mean and standard deviation of its load map
let T = null;                      // the screen mesh of the current run: carriers around a vertex, neighbours of a carrier
let raf = 0, io = null, qx = 0, qy = 0;
const Z = { run: '', open: false, id: -1, row: -1, k: 1, shape: 'disc', label: '', title: '', mate: -1, frame: -1, snap: null, wait: -1, waitBar: null,
  present: false, target: null, face: -1, msg: '', cam: null, pos: null, alpha: 0, half: HALF, t0: 0, win: null, blendT0: 0, others: new Map(), mateFar: null,
  path: [], have: 0, haveAt: 0, span: 0, track: false, trackBar: null, pulse: null, beat: 0, born: false, ended: false, sinceBirth: false, sinceEnd: false, life: 0, tier: 1, last: 0, lively: 0, drawn: 0, prevTimer: 0, tasks: 0 };

// ---------------------------------------------------------------- small vector tools (unit vectors as [x, y, z])
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const n = Math.hypot(a[0], a[1], a[2]) || 1; a[0] /= n; a[1] /= n; a[2] /= n; return a; };
const angle = (a, b) => 2 * Math.asin(Math.min(1, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 2));
const toward = (a, b, k) => { a[0] += (b[0] - a[0]) * k; a[1] += (b[1] - a[1]) * k; a[2] += (b[2] - a[2]) * k; return a; };
const ease = (f) => f * f * (3 - 2 * f);
const hex = (h) => { const n = parseInt(h.slice(1), 16); return `${n >> 16},${(n >> 8) & 255},${n & 255}`; };
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ---------------------------------------------------------------- the screen mesh (once per run)
function topo() {
  if (T && T.run === S.name) return T;
  const tri = S.display.tri, nC = tri.length / 3, nV = S.display.mesh_xyz.length / 3, geo = S.meta.geometry;
  const start = new Int32Array(nV + 1);
  for (let i = 0; i < tri.length; i++) start[tri[i] + 1]++;
  for (let v = 0; v < nV; v++) start[v + 1] += start[v];
  const fill = start.slice(0, nV), vc = new Int32Array(tri.length);                  // the carriers around every mesh vertex
  for (let c = 0; c < nC; c++) for (let q = 0; q < 3; q++) vc[fill[tri[3 * c + q]]++] = c;
  const nb = new Int32Array(tri.length).fill(-1);                                    // the three carriers glued to every carrier
  for (let c = 0; c < nC; c++) for (let q = 0; q < 3; q++) {
    const a = tri[3 * c + q], b = tri[3 * c + (q + 1) % 3];
    for (let i = start[a]; i < start[a + 1]; i++) {
      const d = vc[i];
      if (d !== c && (tri[3 * d] === b || tri[3 * d + 1] === b || tri[3 * d + 2] === b)) { nb[3 * c + q] = d; break; }
    }
  }
  // exact: the display mesh is the mesh of the carriers themselves (true for every run up to level 7); otherwise a
  // node is a block of carriers and only its summed load is known
  const exact = geo.display_level === geo.level && nC === geo.carriers;
  T = { run: S.name, nC, nV, start, vc, nb, exact, sp: geo.cell_spacing * Math.pow(2, geo.level - (exact ? geo.level : geo.display_level)),
    mark: new Int32Array(nC), gen: 0, devA: new Float32Array(nC), devB: new Float32Array(nC), stamp: new Int32Array(nC), wgen: 0 };
  return T;
}
function nearCell(p, from) {              // walk over neighbours toward p
  const t = topo(), cx = S.display.cell_xyz, d = (c) => cx[3 * c] * p[0] + cx[3 * c + 1] * p[1] + cx[3 * c + 2] * p[2];
  let c = from >= 0 && from < t.nC ? from : 0, best = d(c);
  for (let it = 0; it < t.nC; it++) {
    let to = -1;
    for (let q = 0; q < 3; q++) { const n = t.nb[3 * c + q]; if (n >= 0) { const dn = d(n); if (dn > best) { best = dn; to = n; } } }
    if (to < 0) break; c = to;
  }
  return c;
}
function seedsAt(face, p) {               // carriers next to a face: around the vertex of a screen plaquette, or the carrier of an internal face
  const t = topo(), g = S.meta.geometry;
  if (t.exact && face >= g.intra_faces && face - g.intra_faces < t.nV) {
    const v = face - g.intra_faces, out = [];
    for (let i = t.start[v]; i < t.start[v + 1]; i++) out.push(t.vc[i]);
    if (out.length) return out;
  }
  if (t.exact && face >= 0 && face < g.intra_faces) return [Math.floor(face / 20)];
  return [nearCell(p, Z.win && Z.win.cells.length ? Z.win.cells[0] : 0)];
}
function collect(p, seeds) {              // the carriers within REACH spacings of p and the glue seams between them
  const t = topo(), cx = S.display.cell_xyz, cosR = Math.cos(Math.min(3, REACH * t.sp)), gen = ++t.gen, cells = [], stack = [];
  for (const c of seeds) if (t.mark[c] !== gen) { t.mark[c] = gen; stack.push(c); }
  while (stack.length) {
    const c = stack.pop();
    if (cx[3 * c] * p[0] + cx[3 * c + 1] * p[1] + cx[3 * c + 2] * p[2] < cosR) continue;
    cells.push(c);
    for (let q = 0; q < 3; q++) { const d = t.nb[3 * c + q]; if (d >= 0 && t.mark[d] !== gen) { t.mark[d] = gen; stack.push(d); } }
  }
  const at = new Map(), seams = [];
  cells.forEach((c, i) => at.set(c, i));
  for (let i = 0; i < cells.length; i++) for (let q = 0; q < 3; q++) { const d = t.nb[3 * cells[i] + q]; if (d > cells[i] && at.has(d)) seams.push(i, at.get(d)); }
  return { cells: Int32Array.from(cells), seams: Int32Array.from(seams) };
}
function placeOf(r, which) {              // where the catalogue puts the birth or the last face of an identity
  const c = S.cat, a = c[which + '_xyz'];
  if (a) return [a[3 * r], a[3 * r + 1], a[3 * r + 2]];
  const f = c[which + '_face'][r], g = S.meta.geometry, d = S.display, t = topo();
  if (t.exact && f >= g.intra_faces && f - g.intra_faces < t.nV) { const v = f - g.intra_faces; return [d.mesh_xyz[3 * v], d.mesh_xyz[3 * v + 1], d.mesh_xyz[3 * v + 2]]; }
  if (t.exact && f >= 0 && f < g.intra_faces) { const k = Math.floor(f / 20); return [d.cell_xyz[3 * k], d.cell_xyz[3 * k + 1], d.cell_xyz[3 * k + 2]]; }
  return null;
}
function adjacent(fa, fb) {               // two faces of one seam: plaquettes around the two ends of a mesh edge, or faces of one carrier
  const t = topo(), g = S.meta.geometry, tri = S.display.tri;
  if (!t.exact) return true;
  if (fa < g.intra_faces || fb < g.intra_faces) return fa < g.intra_faces && fb < g.intra_faces && Math.floor(fa / 20) === Math.floor(fb / 20);
  const va = fa - g.intra_faces, vb = fb - g.intra_faces;
  if (va >= t.nV || vb >= t.nV) return false;
  for (let i = t.start[va]; i < t.start[va + 1]; i++) { const c = t.vc[i]; if (tri[3 * c] === vb || tri[3 * c + 1] === vb || tri[3 * c + 2] === vb) return true; }
  return false;
}

// ---------------------------------------------------------------- the catalogue row of the selection
const signed = (k) => (k > 127 ? k - 256 : k);
function mateOf(r) {                      // the other identity born in the same event
  const c = S.cat, id = c.id[r];
  if (c.birth_sweep[r] < 0) return -1;                         // it stood in the preparation
  if (c.death_sweep[r] < 0) return c.partner[r];               // alive: the catalogue holds the partner of its birth
  let found = -1;                                              // ended: that column now holds the other party of the ending;
  for (const j of [id - 1, id + 1]) {                          // the partner of the birth is the neighbouring identity of the same event
    const q = S.catRow.get(j);
    if (q === undefined || c.parent2[r] >= 0) continue;
    if (c.birth_sweep[q] !== c.birth_sweep[r] || c.birth_depth[q] !== c.birth_depth[r] || c.parent1[q] !== c.parent1[r] || c.parent2[q] !== c.parent2[r] || c.tier[q] !== c.tier[r]) continue;
    if (c.parent1[r] < 0 && (closedLoop() ? signed(c.cls[q]) + signed(c.cls[r]) !== 0 : (c.cls[q] + c.cls[r]) % 6 !== 0)) continue;
    if (!adjacent(c.birth_face[q], c.birth_face[r])) continue;
    if (found >= 0) return -1;                                 // both neighbours fit: left undecided
    found = j;
  }
  return found;
}
const depthOf = (k) => { const d = S.frames[k].depth; return d === null || d === undefined ? S.classStats.depth_at_end : d; };
const shapeOf = (snap, i, k) => (snap.charge ? (snap.charge[i] < 0 ? 'ring' : 'disc') : (CLASSES[k] || CLASSES[1]).shape);

// ---------------------------------------------------------------- slices
function snapOf(i) {                      // the page's own slice in memory (with the internal tier when it is shown), else one loaded here
  const intra = !!($('intraChk') && $('intraChk').checked);
  return S.cache.get(i + (intra ? 0.5 : 0)) || S.cache.get(i + (intra ? 0 : 0.5)) || own.get(i) || null;
}
function startBusy(label) {               // a progress bar in every mounted view, shown when the work outlasts a moment
  let bars = null, last = [null, label], over = false;
  const timer = setTimeout(() => { if (over) return; bars = views.map((v) => busy(v.busy, label)); bars.forEach((b) => b.set(last[0], last[1])); }, 140);
  return { set(frac, text) { last = [frac, text]; if (bars) bars.forEach((b) => b.set(frac, text)); }, done() { over = true; clearTimeout(timer); if (bars) bars.forEach((b) => b.done()); } };
}
async function loadCounted(url, only, onFrac) {      // an npz with the fraction of its bytes that has arrived
  let blob = null;
  try {
    const r = await fetch(url);
    if (!r.ok || !r.body) throw new Error('no stream');
    const total = Number(r.headers.get('Content-Length')) || 0, coded = r.headers.get('Content-Encoding'), reader = r.body.getReader(), parts = [];
    for (let got = 0; ;) { const { done, value } = await reader.read(); if (done) break; parts.push(value); got += value.length; if (total && !coded) onFrac(Math.min(1, got / total)); }
    blob = URL.createObjectURL(new Blob(parts));
    return await loadNpz(blob, only);
  } catch (e) { return loadNpz(url, only); } finally { if (blob) URL.revokeObjectURL(blob); }
}
function fetchCut(i, why) {               // a slice that is not in memory: the screen tier, the load map and the port loads
  if (own.has(i)) return Promise.resolve(own.get(i));
  if (pending.has(i)) return pending.get(i);
  const f = S.frames[i], base = S.base, label = `loading slice ${i + 1} of ${S.frames.length}${why ? ': ' + why : ''}`, bar = startBusy(label);
  const job = loadCounted(base + f.file, ['screen_id', 'screen_cls', 'screen_xyz', 'screen_face', 'screen_charge', 'load_map', 'loads'], (fr) => bar.set(fr, label)).then((z) => {
    if (base !== S.base || !z.screen_id) return null;
    const ids = z.screen_id, n = ids.length, byId = new Map();
    for (let j = 0; j < n; j++) byId.set(ids[j], j);
    const snap = { index: i, depth: f.depth, count: n, ids, cls: z.screen_cls, pos: z.screen_xyz, face: z.screen_face, tier: null, byId, charge: z.screen_charge || null, loadMap: z.load_map || null, loads: z.loads || null };
    own.set(i, snap); if (own.size > 4) own.delete(own.keys().next().value);
    return snap;
  }).catch((e) => { console.error('zoom: slice ' + i, e); return null; }).finally(() => { bar.done(); pending.delete(i); });
  pending.set(i, job);
  return job;
}
function stats(snap) {                    // mean and standard deviation of the load per display cell on a slice
  let s = STAT.get(snap);
  if (s || !snap.loadMap) return s || null;
  const L = snap.loadMap, n = L.length; let mean = 0, sd = 0;
  for (let c = 0; c < n; c++) mean += L[c];
  mean /= n; for (let c = 0; c < n; c++) sd += (L[c] - mean) ** 2;
  s = { mean, sd: Math.sqrt(sd / n) || 1 }; STAT.set(snap, s);
  return s;
}

// ---------------------------------------------------------------- one slice of the selection
const blend = (now) => ease(Math.min(1, (now - Z.blendT0) / BLEND));
function frameAt(p) {                     // the picture looks straight at p; up is the north of the main view
  const map = !!($('viewmap') && $('viewmap').classList.contains('on'));
  let up = map ? [0, 0, 1] : [0, 1, 0];
  if (Math.abs(dot(up, p)) > 0.985) up = [1, 0, 0];
  const e1 = unit(cross(up, p));
  return { n: p.slice(), e1, e2: cross(p, e1) };
}
function setCut(k, fresh) {
  const now = performance.now(), c = S.cat, r = Z.row, t = topo();
  k = clamp(k | 0, 0, S.frames.length - 1);
  Z.frame = k;
  const snap = snapOf(k);
  if (!snap) {                             // the page is still loading this slice; fetch it here if that takes long
    if (Z.wait !== k) {
      if (Z.waitBar) Z.waitBar.done();
      Z.wait = k; Z.waitBar = startBusy(`loading slice ${k + 1} of ${S.frames.length}`);
      setTimeout(() => {
        if (!Z.open || Z.wait !== k) return;
        if (snapOf(k)) { setCut(k, fresh); return; }
        fetchCut(k, '').then((s) => {
          if (!Z.open || Z.wait !== k) return;
          if (s) { setCut(k, fresh); return; }
          Z.wait = -1; if (Z.waitBar) { Z.waitBar.done(); Z.waitBar = null; }
          for (const v of views) { put(v.state, 'this slice could not be loaded'); v.state.classList.add('on'); }
        });
      }, 450);
    }
    return;
  }
  if (Z.waitBar) { Z.waitBar.done(); Z.waitBar = null; }
  Z.wait = -1;
  if (snap === Z.snap && !fresh) return;
  Z.snap = snap;
  const depth = depthOf(k), i = snap.byId.get(Z.id);
  let p = null, face = -1, msg = '';
  if (i !== undefined) { Z.present = true; p = [snap.pos[3 * i], snap.pos[3 * i + 1], snap.pos[3 * i + 2]]; face = snap.face ? snap.face[i] : -1; }
  else {
    Z.present = false;
    if (c.birth_depth[r] > depth) { p = placeOf(r, 'birth'); face = c.birth_face[r]; msg = `born later, at depth ${fmt(c.birth_depth[r])}`; }
    else if (c.death_sweep[r] >= 0 && c.death_depth[r] <= depth) { p = placeOf(r, 'last'); face = c.last_face[r]; msg = `ended by ${CAUSE[c.cause[r]] || 'a reaction'} at depth ${fmt(c.death_depth[r])}`; }
    else { p = Z.target; face = Z.face; msg = 'not among the defects drawn on this slice'; }
    if (!p) { p = placeOf(r, 'last') || placeOf(r, 'birth') || [0, 0, 1]; face = c.last_face[r]; }
  }
  unit(p);
  const jump = fresh || !Z.cam || angle(Z.cam.n, p) > JUMP * t.sp;
  Z.target = p; Z.face = face; Z.msg = msg;
  if (jump) { Z.cam = frameAt(p); Z.pos = p.slice(); Z.alpha = Z.present ? 1 : 0; Z.half = WIDE; Z.t0 = now; Z.others.clear(); }
  // the carriers around the followed point; their loads fade from what was shown to this slice
  const win = collect(p, seedsAt(face, p)), st = stats(snap), f = blend(now), wg = ++t.wgen;
  for (let j = 0; j < win.cells.length; j++) {
    const cc = win.cells[j], to = st ? clamp((snap.loadMap[cc] - st.mean) / (2.2 * st.sd), -1, 1) : 0;
    t.devA[cc] = !jump && t.stamp[cc] === wg - 1 ? t.devA[cc] + (t.devB[cc] - t.devA[cc]) * f : to;
    t.devB[cc] = to; t.stamp[cc] = wg;
  }
  Z.win = win; Z.blendT0 = now;
  // the other defects of the slice near the point, and the partner of the birth wherever it is
  const cosN = Math.cos(Math.min(3, NEAR * t.sp)), seen = new Set();
  for (let j = 0; j < snap.count; j++) {
    const x = snap.pos[3 * j], y = snap.pos[3 * j + 1], z = snap.pos[3 * j + 2];
    if (x * p[0] + y * p[1] + z * p[2] < cosN || snap.ids[j] === Z.id) continue;
    const id = snap.ids[j], kk = snap.cls[j] % 6; let o = Z.others.get(id);
    seen.add(id);
    if (!o) Z.others.set(id, o = { id, p: [x, y, z], q: [x, y, z], a: 0, on: true });
    else { o.q[0] = x; o.q[1] = y; o.q[2] = z; o.on = true; }
    o.k = kk; o.shape = shapeOf(snap, j, kk); o.tier = snap.tier ? snap.tier[j] : 1;
  }
  for (const o of Z.others.values()) if (!seen.has(o.id)) o.on = false;
  const mi = Z.mate >= 0 ? snap.byId.get(Z.mate) : undefined;
  Z.mateFar = mi !== undefined && !seen.has(Z.mate) ? [snap.pos[3 * mi], snap.pos[3 * mi + 1], snap.pos[3 * mi + 2]] : null;
  // birth and ending inside the step into this slice, and the part of its life that has passed
  const before = k > 0 ? depthOf(k - 1) : -1, bd = c.birth_depth[r], dead = c.death_sweep[r] >= 0, dd = c.death_depth[r];
  Z.born = c.birth_sweep[r] >= 0 && bd > before && bd <= depth;
  Z.ended = dead && dd > before && dd <= depth;
  Z.life = clamp((depth - bd) / Math.max(1, (dead ? dd : S.classStats.depth_at_end) - bd), 0, 1);
  Z.sinceBirth = c.birth_sweep[r] >= 0 && bd <= depth; Z.sinceEnd = dead && dd <= depth;
  gather(now);
  if (!fresh) endTrack();
  repairs(k, now);
  Z.lively = now + 1800;
  caption();
}
function gather(now) {                    // the stored positions of the identity on the slices in memory around this one
  const lo = Math.max(0, Z.frame - SPAN), hi = Math.min(S.frames.length - 1, Z.frame + SPAN), pts = [];
  let have = 0;
  for (let q = lo; q <= hi; q++) {
    const s = snapOf(q); if (!s) continue;
    have++;
    const i = s.byId.get(Z.id);
    if (i !== undefined) pts.push([q, s.pos[3 * i], s.pos[3 * i + 1], s.pos[3 * i + 2]]);
  }
  if (have > Z.have) Z.haveAt = now;
  Z.path = pts; Z.have = have; Z.span = hi - lo + 1;
}
function endTrack() { Z.track = false; if (Z.trackBar) { Z.trackBar.done(); Z.trackBar = null; } }
function trackProgress(now) {             // after a selection the page brings the slices around this one into memory: show how far that is
  if (!Z.track) return;
  if (Z.have >= Z.span || now - Z.haveAt > 2600) { endTrack(); return; }
  const text = `loading the track: ${Z.have} of ${Z.span} slices`;
  if (!Z.trackBar) Z.trackBar = startBusy(text);
  Z.trackBar.set(Z.have / Z.span, text);
}
function pulseBatch(a, b) {               // per carrier of the window: the summed change of its port loads between two slices, against three times the mean
  const t = topo(), cells = Z.win.cells, m = cells.length, act = new Float32Array(m);
  let mean = 0;
  if (t.exact && a.loads && b.loads) for (let j = 0; j < m; j++) { const o = 12 * cells[j]; let s = 0; for (let q = 0; q < 12; q++) s += Math.abs(b.loads[o + q] - a.loads[o + q]); act[j] = s; mean += s; }
  else if (a.loadMap && b.loadMap) for (let j = 0; j < m; j++) { const s = Math.abs(b.loadMap[cells[j]] - a.loadMap[cells[j]]); act[j] = s; mean += s; }
  else return null;
  mean = mean / Math.max(1, m) || 1;
  for (let j = 0; j < m; j++) act[j] = Math.min(1, act[j] / (3 * mean));
  return { win: Z.win, a: act };
}
// The published site keeps the port loads of a slice in <cut>_loads.npz, so playing the screen does not fetch them: the
// zoom reads them for the two slices it compares (a few held in memory), and shows the load-map pulse until they are in.
const LOADS = new Map();
function loadsOf(snap) {
  if (snap.loads) return Promise.resolve(snap.loads);
  const key = S.base + snap.index;
  if (!LOADS.has(key)) {
    LOADS.set(key, loadNpz(S.base + S.frames[snap.index].file.replace(/\.npz$/, '_loads.npz'), ['loads']).then((z) => z.loads || null).catch(() => null));
    if (LOADS.size > 6) LOADS.delete(LOADS.keys().next().value);
  }
  return LOADS.get(key);
}
function pulseFor(a, b, k) {
  Z.pulse = pulseBatch(a, b);
  if ((a.loads && b.loads) || !topo().exact) return;
  Promise.all([loadsOf(a), loadsOf(b)]).then(([la, lb]) => {
    if (la && lb && Z.open && Z.frame === k && Z.snap === b) { Z.pulse = pulseBatch({ ...a, loads: la }, { ...b, loads: lb }); kick(); }
  });
}
function repairs(k, now) {
  clearTimeout(Z.prevTimer);
  Z.pulse = null; Z.beat = now;
  if (k < 1) return;
  const a = snapOf(k - 1);
  if (a) { pulseFor(a, Z.snap, k); return; }
  Z.prevTimer = setTimeout(async () => {   // the slice before is not in memory: load it once the timeline rests
    if (!Z.open || Z.frame !== k) return;
    const s = snapOf(k - 1) || await fetchCut(k - 1, 'the repairs since the slice before');
    if (s && Z.open && Z.frame === k && Z.snap && Z.snap.index === k) { pulseFor(s, Z.snap, k); Z.beat = performance.now(); Z.lively = Z.beat + 1800; kick(); }
  }, 260);
}

// ---------------------------------------------------------------- the line under the picture
function put(el, text) { if (el.textContent !== text) el.textContent = text; }
function describe() {                     // the selection in words, for the help badge of the picture
  const c = S.cat, r = Z.row, n = S.frames.length, end = S.frames[Z.frame].depth === null;
  const born = c.birth_sweep[r] < 0 ? 'present in the preparation' : `born at depth ${fmt(c.birth_depth[r])} ${c.parent1[r] < 0 ? 'as one of a conjugate pair' : 'out of a reaction'}`;
  const fate = c.death_sweep[r] < 0 ? 'alive at the end of the run' : `ended by ${CAUSE[c.cause[r]] || 'a reaction'} at depth ${fmt(c.death_depth[r])}`;
  const here = Z.present ? `It is on slice ${Z.frame + 1} of ${n}, ${end ? 'the end of the run' : 'causal depth ' + fmt(depthOf(Z.frame))}.` : `Slice ${Z.frame + 1} of ${n}: ${Z.msg}.`;
  const count = Z.win ? ` ${fmt(Z.win.cells.length)} carriers are collected around it; ${fmt([...Z.others.values()].filter((o) => o.on).length)} other defects of the slice are near.` : '';
  return `<b>Defect identity ${fmt(Z.id)}</b> of the run ${S.name}, ${Z.title.toLowerCase()}: ${born}, ${fate}, ${fmt(c.hops[r])} hop${c.hops[r] === 1 ? '' : 's'}. ${here}${count}`;
}
function caption() {
  const c = S.cat, r = Z.row, g = S.meta.geometry, C = CLASSES[Z.k] || CLASSES[1];
  const alive = c.death_sweep[r] < 0, life = (alive ? S.classStats.depth_at_end : c.death_depth[r]) - c.birth_depth[r], f = Z.face;
  const where = f >= g.intra_faces ? ['plaquette', fmt(f - g.intra_faces)] : f >= 0 ? ['inside carrier', fmt(Math.floor(f / 20))] : ['place', 'unknown'];
  const track = describe(), counter = !Z.snap ? '' : S.frames[Z.frame].depth === null ? 'end of the run' : 'depth ' + fmt(depthOf(Z.frame));
  for (const v of views) {
    v.root.style.setProperty('--c', C.color);
    if (v.root.dataset.k !== String(Z.k) || v.root.dataset.shape !== Z.shape) { v.root.dataset.k = String(Z.k); v.root.dataset.shape = Z.shape; v.glyph.innerHTML = classGlyph(Z.k, 16); }
    put(v.title, Z.title); put(v.whereK, where[0] + ' '); put(v.whereV, where[1]); put(v.lifeV, fmt(life)); put(v.hopsV, fmt(c.hops[r])); put(v.hopsK, c.hops[r] === 1 ? ' hop' : ' hops');
    put(v.state, Z.msg); v.state.classList.toggle('on', !!Z.msg); put(v.count, counter);
    v.view.dataset.track = track;
  }
}

// ---------------------------------------------------------------- drawing
const sprites = {};
function glow(rgb) {                      // the soft light of a carrier, as on the Defects page
  if (sprites[rgb]) return sprites[rgb];
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(0.22, `rgba(${rgb},.85)`); gr.addColorStop(0.5, `rgba(${rgb},.22)`); gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return (sprites[rgb] = c);
}
function glyphSprite(k, shape) {          // the marker of a class with its glow, drawn once at radius 22 in a 160 px tile
  const key = k + shape; if (sprites[key]) return sprites[key];
  const C = CLASSES[k] || CLASSES[1], c = document.createElement('canvas'); c.width = c.height = 160;
  const g = c.getContext('2d'), m = 80, r = 22;
  g.shadowColor = C.color; g.shadowBlur = 34;
  if (shape === 'ring') { g.strokeStyle = C.color; g.lineWidth = r * 0.42; g.beginPath(); g.arc(m, m, r * 0.8, 0, 2 * Math.PI); g.stroke(); }
  else if (shape === 'duo') { g.fillStyle = C.color; g.beginPath(); g.arc(m, m, r * 0.6, 0, 2 * Math.PI); g.fill(); g.strokeStyle = C.rim || '#4cc3ff'; g.lineWidth = r * 0.24; g.beginPath(); g.arc(m, m, r * 1.02, 0, 2 * Math.PI); g.stroke(); }
  else { g.fillStyle = C.color; g.beginPath(); g.arc(m, m, r, 0, 2 * Math.PI); g.fill(); }
  return (sprites[key] = c);
}
function glyph(g, k, shape, x, y, r, alpha) {
  if (alpha <= 0.01) return;
  const s = r / 22 * 80;
  g.globalAlpha = Math.min(1, alpha); g.drawImage(glyphSprite(k, shape), x - s, y - s, 2 * s, 2 * s); g.globalAlpha = 1;
}
function pill(g, text, x, y, color, alpha, dpr, W, H) {      // the short class label, as the labels on the sphere
  g.font = `700 ${10.5 * dpr}px Inter, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`;
  const w = g.measureText(text).width + 12 * dpr, h = 16 * dpr;
  x = clamp(x, 4 * dpr, W - w - 4 * dpr); y = clamp(y - h, 4 * dpr, H - h - 8 * dpr);
  g.globalAlpha = alpha; g.fillStyle = 'rgba(4,7,15,.74)';
  g.beginPath(); g.arc(x + h / 2, y + h / 2, h / 2, Math.PI / 2, 1.5 * Math.PI); g.arc(x + w - h / 2, y + h / 2, h / 2, -Math.PI / 2, Math.PI / 2); g.closePath(); g.fill();
  g.fillStyle = color; g.textBaseline = 'middle'; g.textAlign = 'left'; g.shadowColor = color; g.shadowBlur = 8 * dpr;
  g.fillText(text, x + 6 * dpr, y + h / 2 + 0.5 * dpr);
  g.shadowBlur = 0; g.globalAlpha = 1;
}
function cross4(g, x, y, rgb, kind, dpr) {                    // birth: an upright cross; ending: a diagonal one
  g.strokeStyle = `rgba(${rgb},.75)`; g.lineWidth = 1.4 * dpr; g.lineCap = 'round';
  const s = 4 * dpr; g.beginPath();
  if (kind === 'birth') { g.moveTo(x - s, y); g.lineTo(x + s, y); g.moveTo(x, y - s); g.lineTo(x, y + s); } else { g.moveTo(x - s, y - s); g.lineTo(x + s, y + s); g.moveTo(x + s, y - s); g.lineTo(x - s, y + s); }
  g.stroke();
}
function step(now) {                      // everything that moves eases toward where the slice puts it
  const dt = Math.max(0, now - (Z.last || now)), k = (tau) => 1 - Math.exp(-dt / tau);      // after a long pause everything arrives at once
  Z.last = now;
  if (Z.present) unit(toward(Z.pos, Z.target, k(85)));
  Z.alpha += ((Z.present ? 1 : 0) - Z.alpha) * k(150);
  const cam = Z.cam;
  unit(toward(cam.n, Z.target, k(260)));
  const s = dot(cam.e1, cam.n); cam.e1[0] -= s * cam.n[0]; cam.e1[1] -= s * cam.n[1]; cam.e1[2] -= s * cam.n[2]; unit(cam.e1); cam.e2 = cross(cam.n, cam.e1);
  Z.half += (HALF - Z.half) * k(240);
  for (const o of Z.others.values()) {
    toward(o.p, o.q, k(110)); o.a += ((o.on ? 1 : 0) - o.a) * k(160);
    if (!o.on && o.a < 0.02) Z.others.delete(o.id);
  }
  if ((Z.pulse || Z.born || Z.ended) && now - Z.beat > BEAT) { Z.beat = now; Z.lively = now + 1200; }
}
function draw(v, now) {
  const cv = v.cv, dpr = Math.min(2, window.devicePixelRatio || 1), W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
  if (!W || !H) return;
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
  const g = cv.getContext('2d'), C = CLASSES[Z.k] || CLASSES[1];
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.setLineDash([]); g.shadowBlur = 0;
  const bg = g.createRadialGradient(W / 2, H / 2, 4, W / 2, H / 2, Math.max(W, H) * 0.72); bg.addColorStop(0, '#0c1630'); bg.addColorStop(1, '#03050b');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const win = Z.win, cam = Z.cam;
  if (!win || !cam || !Z.pos) {            // the slice is still loading: a slow breathing ring
    const a = 0.25 + 0.2 * Math.sin(now / 380); g.strokeStyle = `rgba(140,170,230,${a.toFixed(3)})`; g.lineWidth = 1.2 * dpr;
    g.beginPath(); g.arc(W / 2, H / 2, 18 * dpr, 0, 2 * Math.PI); g.stroke(); return;
  }
  // the scale of the Defects page: the window of Z.half spacings covers the long side of the picture
  const t = T, sp = t.sp, sc = Math.min(Math.max(W, H) / 2 / (Z.half + 0.6), Math.min(W, H) / 2 / Math.max(1, Z.half - 0.3)), n = cam.n, e1 = cam.e1, e2 = cam.e2, cx = S.display.cell_xyz;
  v.sc = sc; v.dpr = dpr; v.W = W; v.H = H;
  // azimuthal equidistant map around the followed point: distances from the centre are true, in carrier spacings
  const P = (x, y, z) => { const a = x * e1[0] + y * e1[1] + z * e1[2], b = x * e2[0] + y * e2[1] + z * e2[2], s = Math.hypot(a, b), f = s > 1e-9 ? Math.atan2(s, x * n[0] + y * n[1] + z * n[2]) / s : 1; qx = W / 2 + a * f / sp * sc; qy = H / 2 - b * f / sp * sc; };
  const m = win.cells.length, pad = 1.1 * sc;
  if (!v.sx || v.sx.length < m) { v.sx = new Float32Array(m + 128); v.sy = new Float32Array(m + 128); v.in = new Uint8Array(m + 128); }
  const sx = v.sx, sy = v.sy, on = v.in;
  for (let j = 0; j < m; j++) { const c = win.cells[j]; P(cx[3 * c], cx[3 * c + 1], cx[3 * c + 2]); sx[j] = qx; sy[j] = qy; on[j] = qx > -pad && qx < W + pad && qy > -pad && qy < H + pad ? 1 : 0; }
  // glue seams
  g.strokeStyle = 'rgba(120,150,215,.16)'; g.lineWidth = dpr; g.beginPath();
  for (let e = 0; e < win.seams.length; e += 2) { const a = win.seams[e], b = win.seams[e + 1]; if (on[a] || on[b]) { g.moveTo(sx[a], sy[a]); g.lineTo(sx[b], sy[b]); } }
  g.stroke();
  // carriers: load against the mean of the screen
  const f = blend(now);
  g.globalCompositeOperation = 'lighter';
  for (let j = 0; j < m; j++) {
    if (!on[j]) continue;
    const c = win.cells[j], d = t.devA[c] + (t.devB[c] - t.devA[c]) * f, a = Math.abs(d), R = Math.max(3 * dpr, (0.16 + 0.3 * a) * sc);
    g.globalAlpha = 0.18 + 0.72 * a; g.drawImage(glow(d > 0 ? ORANGE : BLUE), sx[j] - R, sy[j] - R, 2 * R, 2 * R);
  }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  g.fillStyle = 'rgba(220,230,250,.55)'; g.beginPath();
  for (let j = 0; j < m; j++) if (on[j]) { g.moveTo(sx[j] + 1.3 * dpr, sy[j]); g.arc(sx[j], sy[j], 1.3 * dpr, 0, 2 * Math.PI); }
  g.fill();
  // repairs since the slice before: a pulse on every carrier whose loads changed by more than the mean of the neighbourhood
  const bt = now - Z.beat;
  if (Z.pulse && Z.pulse.win === win && bt >= 0 && bt < PULSE) {
    const fp = bt / PULSE, r = (0.12 + 0.42 * fp) * sc, env = (1 - fp) * Math.min(1, 6 * fp) * 0.85, pa = Z.pulse.a;
    g.lineWidth = 1.3 * dpr;
    for (let q = 0; q < 4; q++) {          // four strengths, one path each
      const lo = 0.34 + q * 0.165, hi = q === 3 ? 2 : lo + 0.165;
      g.strokeStyle = `rgba(160,240,255,${(env * Math.min(1, lo + 0.08)).toFixed(3)})`; g.beginPath();
      for (let j = 0; j < m; j++) if (on[j] && pa[j] >= lo && pa[j] < hi) { g.moveTo(sx[j] + r, sy[j]); g.arc(sx[j], sy[j], r, 0, 2 * Math.PI); }
      g.stroke();
    }
  }
  // the other defects of the slice, dim
  let mate = null;
  for (const o of Z.others.values()) {
    if (o.id === Z.mate) { mate = o; continue; }
    P(o.p[0], o.p[1], o.p[2]);
    if (qx < -pad || qx > W + pad || qy < -pad || qy > H + pad) continue;
    glyph(g, o.k, o.shape, qx, qy, (o.tier ? 0.2 : 0.12) * sc, 0.36 * o.a);
  }
  // the selected identity: its stored positions as a dashed path, a fading trail, the link to the partner of its birth, the marker
  const rgb = hex(C.color), path = Z.path, R = Math.max(5 * dpr, (Z.tier ? 0.34 : 0.24) * sc);
  if (path.length > 1) {
    g.strokeStyle = `rgba(${rgb},.12)`; g.lineWidth = 1.2 * dpr; g.setLineDash([2 * dpr, 4 * dpr]); g.beginPath();
    for (let i = 0; i < path.length; i++) { P(path[i][1], path[i][2], path[i][3]); if (i) g.lineTo(qx, qy); else g.moveTo(qx, qy); }
    g.stroke(); g.setLineDash([]);
  }
  P(Z.pos[0], Z.pos[1], Z.pos[2]);
  const mx = qx, my = qy;
  // where it was born and where it ended; a cross that the marker itself covers is left out
  const clear = (x, y) => Z.alpha < 0.5 || Math.hypot(x - mx, y - my) > R;
  let bx = 0, by = 0, ex = 0, ey = 0;
  if (Z.sinceBirth) { const b = placeOf(Z.row, 'birth'); if (b) { P(b[0], b[1], b[2]); bx = qx; by = qy; if (clear(bx, by)) cross4(g, bx, by, YELLOW, 'birth', dpr); } }
  if (Z.sinceEnd) { const b = placeOf(Z.row, 'last'); if (b) { P(b[0], b[1], b[2]); ex = qx; ey = qy; if (clear(ex, ey)) cross4(g, ex, ey, RED, 'end', dpr); } }
  if (!Z.present && !Z.sinceBirth) {       // before its birth: a dashed ring on the face it will be born on
    P(Z.target[0], Z.target[1], Z.target[2]);
    g.strokeStyle = `rgba(${rgb},.55)`; g.lineWidth = 1.2 * dpr; g.setLineDash([2 * dpr, 3 * dpr]); g.beginPath(); g.arc(qx, qy, R, 0, 2 * Math.PI); g.stroke(); g.setLineDash([]);
  }
  if (Z.alpha > 0.02) {
    g.lineCap = 'round';
    let px = 0, py = 0, has = false;
    for (let i = 0; i <= path.length; i++) {
      let x1 = mx, y1 = my, q1 = Z.frame;
      if (i < path.length) { q1 = path[i][0]; if (q1 >= Z.frame || q1 < Z.frame - TRAIL) continue; P(path[i][1], path[i][2], path[i][3]); x1 = qx; y1 = qy; }
      if (has) { const w = Math.max(0, 1 - (Z.frame - q1) / TRAIL); g.strokeStyle = `rgba(${rgb},${(0.75 * w * Z.alpha).toFixed(3)})`; g.lineWidth = (1 + 2.6 * w) * dpr; g.beginPath(); g.moveTo(px, py); g.lineTo(x1, y1); g.stroke(); }
      px = x1; py = y1; has = true;
    }
  }
  const far = mate ? mate.p : Z.mateFar, ma = mate ? mate.a : 1;
  if (far && Z.alpha > 0.02) {
    P(far[0], far[1], far[2]);
    g.strokeStyle = `rgba(255,255,255,${(0.34 * ma * Z.alpha).toFixed(3)})`; g.lineWidth = dpr; g.setLineDash([3 * dpr, 4 * dpr]); g.beginPath(); g.moveTo(mx, my); g.lineTo(qx, qy); g.stroke(); g.setLineDash([]);
    if (mate) glyph(g, mate.k, mate.shape, qx, qy, (mate.tier ? 0.27 : 0.18) * sc, 0.92 * mate.a);
  }
  if (Z.alpha > 0.02) {
    const br = 0.5 + 0.5 * Math.sin(now / 420);          // the selection ring breathes, as on the sphere
    g.strokeStyle = `rgba(255,255,255,${((0.2 + 0.22 * br) * Z.alpha).toFixed(3)})`; g.lineWidth = 1.2 * dpr; g.beginPath(); g.arc(mx, my, R * (1.8 + 0.22 * br), 0, 2 * Math.PI); g.stroke();
    glyph(g, Z.k, Z.shape, mx, my, R, Z.alpha);
    pill(g, Z.label, mx + R * 1.5, my - R * 1.25, C.color, Z.alpha, dpr, W, H);
  }
  // a ring when the birth or the ending lies inside the step into this slice
  const ring = (col, x, y) => { const tt = bt / 560; if (tt < 0 || tt > 1.6) return; g.strokeStyle = `rgba(${col},${(1 - tt / 1.6).toFixed(3)})`; g.lineWidth = 2 * dpr; g.beginPath(); g.arc(x, y, R + tt * 0.9 * sc, 0, 2 * Math.PI); g.stroke(); };
  if (Z.born && Z.sinceBirth) ring(YELLOW, bx, by);
  if (Z.ended && Z.sinceEnd) ring(RED, ex, ey);
  // soft edge, the part of its life that has passed, and the fade in after a selection
  const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.32, W / 2, H / 2, Math.max(W, H) * 0.62); vg.addColorStop(0, 'rgba(3,5,11,0)'); vg.addColorStop(1, 'rgba(3,5,11,.92)');
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(0, H - 2 * dpr, W, 2 * dpr);
  g.fillStyle = C.color; g.globalAlpha = 0.55; g.fillRect(0, H - 2 * dpr, W * Z.life, 2 * dpr); g.globalAlpha = 1;
  const fa = ease(Math.min(1, (now - Z.t0) / 380));
  if (fa < 1) { g.fillStyle = `rgba(3,5,11,${(1 - fa).toFixed(3)})`; g.fillRect(0, 0, W, H); }
}
const shown = () => { const pg = $('page-universe'); return (!pg || pg.classList.contains('on')) && !document.hidden; };
function tick(now) {
  raf = 0;
  if (!Z.open || !shown()) return;         // started again by showZoom and when the page comes back
  if (Z.cam) step(now);
  if (now - Z.tasks > 400) { Z.tasks = now; if (Z.snap) { gather(now); trackProgress(now); } }
  if (now < Z.lively || now - Z.drawn >= 45) { Z.drawn = now; for (const v of views) draw(v, now); }       // at rest about twenty frames a second are enough for the breathing ring
  raf = requestAnimationFrame(tick);
}
function kick() { if (Z.open && !raf && shown()) raf = requestAnimationFrame(tick); }

// ---------------------------------------------------------------- the view on the page
function css() {
  if (document.getElementById('zm-css')) return;
  const l = document.createElement('link'); l.id = 'zm-css'; l.rel = 'stylesheet'; l.href = new URL('./style/zoom.css', import.meta.url).href; document.head.appendChild(l);
}
const el = (tag, cls, parent, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; if (parent) parent.appendChild(e); return e; };
function hit(v, ev) {                     // the other defect under the pointer
  if (!Z.open || !Z.cam || !v.sc) return null;
  const rect = v.cv.getBoundingClientRect(), x = (ev.clientX - rect.left) * v.dpr, y = (ev.clientY - rect.top) * v.dpr, n = Z.cam.n, e1 = Z.cam.e1, e2 = Z.cam.e2, sp = T.sp;
  let best = null, bd = 13 * v.dpr;
  for (const o of Z.others.values()) {
    if (!o.on) continue;
    const a = dot(o.p, e1), b = dot(o.p, e2), s = Math.hypot(a, b), f = s > 1e-9 ? Math.atan2(s, dot(o.p, n)) / s : 1;
    const d = Math.hypot(v.W / 2 + a * f / sp * v.sc - x, v.H / 2 - b * f / sp * v.sc - y);
    if (d < bd) { bd = d; best = o; }
  }
  return best;
}
export function mountZoom(container) {
  css();
  const root = el('div', 'zm'), inner = el('div', 'zm-in', root), card = el('div', 'zm-card', inner), view = el('div', 'zm-view', card), cv = el('canvas', '', view);
  const foot = el('div', 'zm-foot', view), state = el('div', 'zm-state', foot), bars = el('div', 'zm-busy', foot), count = el('div', 'zm-count', foot);
  const x = el('button', 'zm-x', view, '×'); x.title = 'close the zoom'; x.setAttribute('aria-label', 'close the zoom');
  const cap = el('div', 'zm-cap', card), name = el('div', 'zm-name', cap), glyphEl = el('span', 'zm-gl', name), title = el('span', 'zm-title', name);
  const facts = el('div', 'zm-facts', cap), where = el('span', 'zm-where', facts), whereK = el('i', '', where), whereV = el('b', '', where);
  const life = el('span', 'zm-life', facts); el('i', '', life, 'lived '); const lifeV = el('b', '', life); el('i', '', life, ' depth units');
  const hops = el('span', 'zm-hops', facts), hopsV = el('b', '', hops), hopsK = el('i', '', hops);
  const link = el('a', 'zm-link', cap, 'open in the catalogue'); link.href = '?page=defects'; link.title = 'the Defects page: every defect class moving on the screen';
  const v = { root, view, cv, state, busy: bars, count, glyph: glyphEl, title, whereK, whereV, lifeV, hopsV, hopsK };
  x.addEventListener('click', (e) => { e.stopPropagation(); showZoom(null); });
  link.addEventListener('click', (e) => { e.preventDefault(); showPage('defects'); });
  cv.addEventListener('click', (e) => { const o = hit(v, e); if (o) select(o.id); });
  cv.addEventListener('mousemove', (e) => { cv.style.cursor = hit(v, e) ? 'pointer' : ''; });
  if (container) { if (container.id === 'stage') root.classList.add('zm-float'); container.appendChild(root); }
  else { const sel = $('selected'); sel.parentNode.insertBefore(root, sel); }
  views.push(v);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => { if (Z.open && Z.cam) draw(v, performance.now()); }).observe(view);
  if (typeof IntersectionObserver !== 'undefined') { if (!io) io = new IntersectionObserver(kick); io.observe(root); }
  if (views.length === 1) document.addEventListener('visibilitychange', kick);
  if (Z.open) { root.classList.add('on'); caption(); kick(); }
  return root;
}
function shut() {
  Z.open = false; Z.id = -1; Z.snap = null; Z.wait = -1; Z.win = null; Z.cam = null; Z.target = null; Z.pos = null; Z.pulse = null; Z.others.clear(); Z.path = [];
  clearTimeout(Z.prevTimer); endTrack();
  if (Z.waitBar) { Z.waitBar.done(); Z.waitBar = null; }
  for (const v of views) v.root.classList.remove('on');
}
export function showZoom(id) {
  if (Z.run !== S.name) { Z.run = S.name; T = null; own.clear(); shut(); }
  const r = id === null || id === undefined || id < 0 || !S.meta || !S.cat || !S.display || !S.frames.length ? undefined : S.catRow.get(id);
  if (r === undefined) { shut(); return; }
  if (!views.length) mountZoom();
  const c = S.cat, now = performance.now();
  shut();
  Z.open = true; Z.id = id; Z.row = r; Z.tier = c.tier[r];
  if (closedLoop()) { const q = signed(c.cls[r]); Z.k = (((q % 6) + 6) % 6) || 1; Z.shape = q < 0 ? 'ring' : 'disc'; Z.label = (q > 0 ? '+' : '−') + Math.abs(q); Z.title = 'Charge ' + Z.label; }
  else { Z.k = c.cls[r] % 6; const C = CLASSES[Z.k] || CLASSES[1]; Z.shape = C.shape; Z.label = C.short; Z.title = C.title; }
  Z.mate = mateOf(r);
  Z.have = 0; Z.haveAt = now; Z.track = true; Z.last = now; Z.t0 = now; Z.lively = now + 2200;
  for (const v of views) v.root.classList.add('on');
  setCut(parseInt($('frame').value) || 0, true);
  if (!Z.snap) caption0();
  kick();
}
function caption0() {                     // the slice is not in memory yet: the line under the picture from the catalogue alone
  Z.face = S.cat.last_face[Z.row]; Z.msg = '';
  caption();
}
export function zoomFrame(frameIndex) {
  if (!Z.open) return;
  if (Z.run !== S.name) { showZoom(null); return; }
  setCut(frameIndex, false);
  kick();
}
if (typeof window !== 'undefined') window.__zoom = {
  at(id) {                                // where an identity is drawn in the first view, in CSS pixels of its picture (for checks)
    const v = views[0], o = id === Z.id ? { p: Z.pos } : Z.others.get(id);
    if (!v || !v.sc || !o || !o.p || !Z.cam) return null;
    const a = dot(o.p, Z.cam.e1), b = dot(o.p, Z.cam.e2), s = Math.hypot(a, b), f = s > 1e-9 ? Math.atan2(s, dot(o.p, Z.cam.n)) / s : 1;
    return { x: (v.W / 2 + a * f / T.sp * v.sc) / v.dpr, y: (v.H / 2 - b * f / T.sp * v.sc) / v.dpr };
  },
  get state() {
  return { open: Z.open, id: Z.id, frame: Z.frame, present: Z.present, msg: Z.msg, mate: Z.mate, cells: Z.win ? Z.win.cells.length : 0, seams: Z.win ? Z.win.seams.length / 2 : 0,
    others: Z.others.size, path: Z.path.length, inMemory: Z.have, pulses: Z.pulse ? Array.from(Z.pulse.a).filter((a) => a >= 0.34).length : -1, born: Z.born, ended: Z.ended,
    life: Z.life, half: Z.half, views: views.length, exact: T ? T.exact : null, face: Z.face, sinceBeat: Math.round(performance.now() - Z.beat), bars: views.reduce((n, v) => n + v.busy.children.length, 0) };
  } };
