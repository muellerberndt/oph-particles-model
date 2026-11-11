// The Lattice page: how the repair dynamics of the carrier network become a quantum lattice.
// One stage, one timeline. Six chapters play as one animation and loop; the scrubber moves through them:
//   1 defects wander (a patch of the stored run)            4 the patch becomes a lattice (one cubic frame of the carrier)
//   2 every seam carries a link (the same patch as links)    5 all histories at once, and cooling (live link ensemble)
//   3 repair becomes a unitary step (K = 1 - L/60 = A†WA)    6 what the large runs measure (tiles)
// mountExplainer(el) renders the short guided version (six steps and the limits) for the popup of the Journey page.
// Data: view/observer_defects.npz, observers/obs_<carrier>.npz, view/display.npz of the selected run; the live ensemble
// is lattice_mc.js in a web worker (checked by `node lattice_check.mjs`); the tiles read the files under /rl/.
// Sources: repair-law reports LT (attempt count), GL (links, group, plaquette action), CC and LV (electric term),
// MA (register ensemble, run H4), work/HR/SPEC.md and FOR_SIM.md (tick extent as temperature), leads L28, L29, L37,
// candidates/CF1.md section 8; public proofs model/coherent_seam_repair and model/lepton_register_round.
import { $, S, showPage } from './app.js';
import { loadNpz } from './npz.js';
import { linkList, RER, SITE, DER } from './links.js';
import { tex, typeset } from './math.js';
import { laneProgress, busy } from './progress.js';
import { CLASSES } from './classes.js';
import { REF, PLANES, LiveRun, LinkEnsemble, centreCost, meshValence, chooseTrack, buildWindow, classesOnCuts, solveLinks, icosahedron, cubicFrames, classicalPopulations, coherentPopulations } from './lattice_mc.js';

// ---------------------------------------------------------------- constants and small helpers
const DUR = [12, 13, 14, 11, 22, 9];                         // seconds per chapter
const START = DUR.map((_, i) => DUR.slice(0, i).reduce((a, b) => a + b, 0)), TOTAL = DUR.reduce((a, b) => a + b, 0);
const CHAPTERS = [
  { name: 'Defects wander', short: 'Defects wander', cap: 'A patch of the stored run. Every carrier repairs its seams, and defects hop from face to face between the stored cuts.', nums: ['stored cut', 'defects in view', 'hops so far'] },
  { name: 'Every seam carries a link', short: 'Links on the seams', cap: 'The same patch as a field of links. The class of a face is the product of the links around it. A nontrivial product is the defect.', nums: ['nontrivial links', 'faces equal to their link product', 'followed face'] },
  { name: 'Repair becomes a unitary step', short: 'A unitary step', cap: `One attempt makes the two ports of a seam agree. The unitary tick W gives the same populations and keeps a record: ${tex('A^\\dagger W A=K=1-L/60')}.`, nums: ['ticks', 'return, repair', 'return, unitary tick'] },
  { name: 'The patch becomes a lattice', short: 'The lattice', cap: 'On one of its five cubic frames a carrier shares six seams with its neighbours. Cells are sites, frame seams are links, faces are plaquettes, ticks are the time direction.', nums: ['cubic frames', 'sites', 'links'] },
  { name: 'All histories at once, and cooling', short: 'Cooling', cap: `Every link field at once, each with weight ${tex('e^{-S}')}, S the sum of the plaquette costs, sampled sweep by sweep. As the coupling κ rises the lattice cools and orders.`, nums: ['coupling κ', 'nontrivial faces', 'Polyakov loop'] },
  { name: 'What the large runs measure', short: 'Large runs', cap: 'The same weight on large lattices: the register ensemble of the theory side, and three runs of the research lanes.', nums: ['', '', ''] },
];
const LINKCOL = { 1: '#ff7a45', 2: '#ffb347', 3: '#3ee6a8' };
const FLUXCOL = { 2: [null, '#3ee6a8'], 3: [null, '#ffb347', '#ff8a5c'] };
const FRAMECOL = ['#3fe0d0', '#a995ff', '#6fb1ff', '#ffb44a', '#ff6480'];
const LL = 10;                                               // side of the live lattice of the stage
const rgb = (h) => { const n = parseInt(h.slice(1), 16); return `${n >> 16},${(n >> 8) & 255},${n & 255}`; };
const ease = (f) => f * f * (3 - 2 * f);
const clamp = (x) => Math.max(0, Math.min(1, x));
const ramp = (x, a, b) => ease(clamp((x - a) / (b - a)));
const bump = (x, a, b, e = 0.8) => ramp(x, a, a + e) * (1 - ramp(x, b - e, b));
const lerp = (a, b, t) => a + (b - a) * t;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pageOn = () => { const p = $('page-lattice'); return !!(p && p.classList.contains('on')); };
const EXTRA = [                                              // links beyond the keys of links.js (listed in the lane report)
  ['Proof: the coherent seam repair and its kernel', RER + 'model/coherent_seam_repair/PROOF.md'],
  ['Proof: one attempt per tick', RER + 'model/lepton_register_round/PROOF.md'],
  ['Derivation: the plaquette cost of every class', DER + 'reports/LV.md'],
  ['The routing walk on cubic boxes', RER + 'model/coherent_defect_wave/spatial/ROUTE.md'],
  ['Code: the link ensemble of this page', SITE + 'lattice_mc.js'],
  ['Its check script', SITE + 'lattice_check.mjs'],
];

function fit(cv, cap = 2) {
  let dpr = Math.min(cap, window.devicePixelRatio || 1);
  if (cv.clientWidth * cv.clientHeight * dpr * dpr > 3.6e6) dpr = Math.max(1, Math.sqrt(3.6e6 / (cv.clientWidth * cv.clientHeight)));
  const W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
  if (!W || !H) return null;
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
  return { g: cv.getContext('2d'), W, H, dpr };
}
function backdrop(g, W, H) {
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  const bg = g.createRadialGradient(W / 2, H * 0.46, 4, W / 2, H * 0.46, Math.max(W, H) * 0.7); bg.addColorStop(0, '#0d1a38'); bg.addColorStop(0.55, '#070d1f'); bg.addColorStop(1, '#02040a');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
}
function vignette(g, W, H, k = 0.9) {
  g.globalAlpha = 1; const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.42, W / 2, H / 2, Math.max(W, H) * 0.62); v.addColorStop(0, 'rgba(2,4,10,0)'); v.addColorStop(1, `rgba(2,4,10,${k})`);
  g.fillStyle = v; g.fillRect(0, 0, W, H);
}
const sprites = {};
function glow(c) {
  if (sprites[c]) return sprites[c];
  const s = document.createElement('canvas'); s.width = s.height = 64; const g = s.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, `rgba(${c},1)`); gr.addColorStop(0.22, `rgba(${c},.85)`); gr.addColorStop(0.5, `rgba(${c},.22)`); gr.addColorStop(1, `rgba(${c},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return (sprites[c] = s);
}
function glyph(g, k, x, y, r, dpr) {
  const C = CLASSES[k]; if (!C) return;
  g.shadowColor = C.color; g.shadowBlur = 14 * dpr;
  if (C.shape === 'ring') { g.strokeStyle = C.color; g.lineWidth = r * 0.42; g.beginPath(); g.arc(x, y, r * 0.8, 0, 2 * Math.PI); g.stroke(); }
  else if (C.shape === 'duo') { g.fillStyle = C.color; g.beginPath(); g.arc(x, y, r * 0.6, 0, 2 * Math.PI); g.fill(); g.strokeStyle = C.rim; g.lineWidth = r * 0.24; g.beginPath(); g.arc(x, y, r * 1.02, 0, 2 * Math.PI); g.stroke(); }
  else { g.fillStyle = C.color; g.beginPath(); g.arc(x, y, r, 0, 2 * Math.PI); g.fill(); }
  g.shadowBlur = 0;
}
function label(g, text, x, y, dpr, col = 'rgba(160,178,210,.75)', size = 9, align = 'left', weight = 650) {
  g.font = `${weight} ${size * dpr}px Inter, Helvetica, Arial, sans-serif`; g.textAlign = align; g.textBaseline = 'alphabetic'; g.fillStyle = col; g.fillText(text, x, y);
}
function numeral(g, text, x, y, px, col, halo = true) {
  g.font = `700 ${px}px ui-monospace, Menlo, monospace`; g.textAlign = 'center'; g.textBaseline = 'middle';
  if (halo) { g.lineWidth = px * 0.32; g.strokeStyle = 'rgba(3,5,11,.9)'; g.strokeText(text, x, y); }
  g.fillStyle = col; g.fillText(text, x, y); g.textBaseline = 'alphabetic';
}
function rotation(yaw, pitch) { const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch); return [cy, 0, sy, sy * sp, cp, -cy * sp, -sy * cp, sp, cy * cp]; }
const apply = (R, p) => [R[0] * p[0] + R[1] * p[1] + R[2] * p[2], R[3] * p[0] + R[4] * p[1] + R[5] * p[2], R[6] * p[0] + R[7] * p[1] + R[8] * p[2]];

// ================================================================= the stored patch (chapters 1 and 2)
const P = { ready: false, busy: false, err: '', run: '', cam: [0, 0] };
async function loadPatch() {
  if (P.busy || (P.ready && P.run === S.name)) return;
  P.busy = true; P.ready = false; P.err = ''; P.run = S.name;
  try {
    const disp = S.display, geo = S.meta.geometry, sp = geo.cell_spacing;
    if (!disp || disp.tri.length / 3 !== geo.carriers) throw new Error('this run stores no full screen mesh for the viewer');
    const D = await loadNpz(S.base + 'view/observer_defects.npz');
    const pick = chooseTrack(D, S.meta.observers, disp.cell_xyz, sp);
    if (!pick) throw new Error('no hopping defect inside a stored patch');
    const O = await loadNpz(`${S.base}observers/obs_${pick.c}.npz`, ['patch_cells', 'cut_depth', 'cut_patch_loads']);
    const half = Math.max(4, pick.ext + 1.8);
    const win = buildWindow({ tri: disp.tri, meshXyz: disp.mesh_xyz, cellXyz: disp.cell_xyz, valence: meshValence(disp.tri, disp.mesh_xyz.length / 3), patchCells: O.patch_cells, centre: pick.centre, half, sp, aspect: 2.5 });
    let last = O.cut_depth.length - 1; while (last > 0 && O.cut_depth[last] < 0) last--;
    const j0 = Math.max(1, pick.first - 3), j1 = Math.min(last, pick.last + 3), c = pick.c;
    const { K, I } = classesOnCuts(win, D['o' + c + '_cut'], D['o' + c + '_cls'], D['o' + c + '_id'], D['o' + c + '_xyz'], j0, j1);
    const sol = solveLinks(win, K);
    // loads of the window cells on the shown cuts: against the window mean, and the summed change since the previous cut
    const q = new Map(); for (let i = 0; i < O.patch_cells.length; i++) q.set(O.patch_cells[i], i);
    const m = win.cells.length, row = 12 * O.patch_cells.length, Ld = O.cut_patch_loads, nj = j1 - j0 + 1;
    const dev = new Float32Array(nj * m), act = new Float32Array(nj * m), sum = new Float32Array(m);
    for (let j = j0; j <= j1; j++) {
      let mean = 0, sd = 0, am = 0;
      for (let a = 0; a < m; a++) { const o = j * row + 12 * q.get(win.cells[a]); let s = 0; for (let p = 0; p < 12; p++) s += Ld[o + p]; sum[a] = s; mean += s / m; }
      for (let a = 0; a < m; a++) sd += (sum[a] - mean) ** 2; sd = Math.sqrt(sd / m) || 1;
      for (let a = 0; a < m; a++) dev[(j - j0) * m + a] = Math.max(-1, Math.min(1, (sum[a] - mean) / (2.2 * sd)));
      for (let a = 0; a < m; a++) { const o = j * row + 12 * q.get(win.cells[a]); let s = 0; for (let p = 0; p < 12; p++) s += Math.abs(Ld[o + p] - Ld[o - row + p]); act[(j - j0) * m + a] = s; am += s / m; }
      am = am || 1; for (let a = 0; a < m; a++) act[(j - j0) * m + a] = Math.min(1, act[(j - j0) * m + a] / (3 * am));
    }
    const where = I.map((ids) => { const w = new Map(); ids.forEach((id, i) => { if (id >= 0) w.set(id, i); }); return w; });
    const hops = [0]; for (let j = 1; j < where.length; j++) { const a = where[j - 1].get(pick.id), b = where[j].get(pick.id); hops.push(hops[j - 1] + (a !== undefined && b !== undefined && a !== b ? 1 : 0)); }
    Object.assign(P, { pick, win, j0, j1, K, I, sol, dev, act, where, hops, ready: true, cam: [0, 0] });
    diag().patch = { run: S.name, observer: c, id: pick.id, cls: pick.k, hops: pick.hops, cuts: [j0, j1], cells: m, faces: win.faces, seams: win.ns, mismatches: sol.bad };
  } catch (e) { P.err = String((e && e.message) || e); console.error('lattice page, stored patch:', e); }
  P.busy = false;
}
const diag = () => (window.__lattice = window.__lattice || {});
// a faint honeycomb drawn while the stored run is loading, so the stage is never empty
function sceneSkeleton(g, W, H, dpr, o) {
  const s = H / 11, now = performance.now();
  g.globalAlpha = o.al * 0.5; g.strokeStyle = 'rgba(120,150,215,.3)'; g.lineWidth = dpr; g.beginPath();
  for (let r = -8; r <= 8; r++) for (let c = -22; c <= 22; c++) {
    const x = W / 2 + (c + (r & 1) * 0.5) * s * 1.732, y = H / 2 + r * s * 1.5;
    for (const [dx, dy] of [[0.866, 0.5], [-0.866, 0.5], [0, -1]]) { g.moveTo(x, y); g.lineTo(x + dx * s, y + dy * s); }
  }
  g.stroke();
  g.globalAlpha = o.al * (0.5 + 0.3 * Math.sin(now / 400));
  label(g, P.err ? 'the stored run is not available' : 'reading the stored run', W / 2, H / 2, dpr, 'rgba(200,214,240,.9)', 12, 'center');
  g.globalAlpha = 1;
}
// The patch is seen at a slant: far carriers are smaller and dimmer. The view straightens when it closes in on a face.
// Returns the projection (u, v) -> [x, y, pixels per cell at that depth].
function patchCam(W, H, zoom) {
  const zc = Math.min(1, zoom), tilt = 0.7 * (1 - zc), ct = Math.cos(tilt), st = Math.sin(tilt), d = 18;
  const sc = (H / 2) / (P.win.half + 0.35) * (1 + 0.42 * zoom) * lerp(1.2, 1, zc), cu = P.cam[0] * zc * 0.8, cv = P.cam[1] * zc * 0.8, y0 = H * lerp(0.46, 0.5, zc);
  return (u, v) => { const dv = v - cv, k = d / (d + dv * st); return [W / 2 + (u - cu) * sc * k, y0 - dv * ct * sc * k, sc * k]; };
}
function scenePatch(g, W, H, dpr, o) {      // o: al, T (cut clock), loads, links, focus, zoom
  if (!P.ready) { sceneSkeleton(g, W, H, dpr, o); return; }
  const { win, K, where, dev, act, pick, sol } = P, span = P.j1 - P.j0, T = Math.max(0, Math.min(span, o.T));
  const ja = Math.min(span, Math.floor(T)), jb = Math.min(span, ja + 1), f = jb > ja ? T - ja : 0, m = win.cells.length, cuv = win.cuv, vuv = win.vuv;
  const A = (x) => { g.globalAlpha = clamp(x * o.al); };
  // where the followed defect is, eased between the two cuts
  const ia = where[ja].get(pick.id), ib = where[jb].get(pick.id); let fu = null, fv = 0, fal = 1;
  if (ia !== undefined && ib !== undefined) { fu = lerp(vuv[2 * ia], vuv[2 * ib], ease(f)); fv = lerp(vuv[2 * ia + 1], vuv[2 * ib + 1], ease(f)); }
  else if (ia !== undefined) { fu = vuv[2 * ia]; fv = vuv[2 * ia + 1]; fal = jb > ja ? 1 - f : 1; }
  else if (ib !== undefined) { fu = vuv[2 * ib]; fv = vuv[2 * ib + 1]; fal = f; }
  if (fu !== null) { P.cam[0] += (fu - P.cam[0]) * 0.07; P.cam[1] += (fv - P.cam[1]) * 0.07; }
  const cam = patchCam(W, H, o.zoom), C = new Float32Array(3 * m), Q = new Float32Array(3 * win.nv);
  for (let a = 0; a < m; a++) { const q = cam(cuv[2 * a], cuv[2 * a + 1]); C[3 * a] = q[0]; C[3 * a + 1] = q[1]; C[3 * a + 2] = q[2]; }
  for (let i = 0; i < win.nv; i++) { const q = cam(vuv[2 * i], vuv[2 * i + 1]); Q[3 * i] = q[0]; Q[3 * i + 1] = q[1]; Q[3 * i + 2] = q[2]; }
  const sc0 = cam(0, 0)[2], fog = (s) => clamp(0.28 + 0.72 * (s / sc0 - 0.72) / 0.42);      // nearer is brighter
  const jd = f < 0.5 ? ja : jb, L = sol.L[jd], flash = jb > ja ? Math.max(0, 1 - Math.abs(f - 0.5) / 0.4) : 0, hot = new Set(jb > ja ? sol.changed[jb] : []);
  const poly = (i) => { g.beginPath(); win.inc[i].forEach((a, q) => (q ? g.lineTo(C[3 * a], C[3 * a + 1]) : g.moveTo(C[3 * a], C[3 * a + 1]))); g.closePath(); };
  // faces of nonzero class: the polygon through the carriers around the face
  if (o.links > 0.01) for (let i = 0; i < win.nv; i++) {
    const k = K[jd][i]; if (!k || !win.complete[i]) continue;
    const col = CLASSES[k].color; poly(i);
    A(0.26 * o.links); g.fillStyle = col; g.fill(); A(0.7 * o.links); g.strokeStyle = col; g.lineWidth = 1.3 * dpr; g.stroke();
  }
  // seams: faint lines; as a link field the nontrivial links are coloured by the size of their value
  g.strokeStyle = '#7896d7'; g.lineWidth = dpr; g.lineCap = 'round';
  for (let s = 0; s < win.ns; s++) { const a = win.seamA[s], b = win.seamB[s]; A(0.26 * fog((C[3 * a + 2] + C[3 * b + 2]) / 2)); g.beginPath(); g.moveTo(C[3 * a], C[3 * a + 1]); g.lineTo(C[3 * b], C[3 * b + 1]); g.stroke(); }
  if (o.links > 0.01) for (let s = 0; s < win.ns; s++) {
    const l = L[s], isHot = flash && hot.has(s); if (!l && !isHot) continue;
    const a = win.seamA[s], b = win.seamB[s], x0 = C[3 * a], y0 = C[3 * a + 1], x1 = C[3 * b], y1 = C[3 * b + 1], near = (C[3 * a + 2] + C[3 * b + 2]) / (2 * sc0);
    if (l) {
      const mag = Math.min(l, 6 - l), col = LINKCOL[mag];
      A(o.links); g.strokeStyle = col; g.lineWidth = 3 * dpr * near; g.shadowColor = col; g.shadowBlur = 10 * dpr; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.shadowBlur = 0;
      if (mag < 3) {                                        // chevron: the sense in which the value is +mag
        const pv = win.plus[s], mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
        const cr = (cuv[2 * a] - vuv[2 * pv]) * (cuv[2 * b + 1] - vuv[2 * pv + 1]) - (cuv[2 * a + 1] - vuv[2 * pv + 1]) * (cuv[2 * b] - vuv[2 * pv]);
        let dx = x1 - x0, dy = y1 - y0; const n = Math.hypot(dx, dy) || 1; dx /= n; dy /= n;
        if ((cr > 0) !== (l <= 3)) { dx = -dx; dy = -dy; }
        const h = 4.4 * dpr * near; g.fillStyle = '#04060d'; g.beginPath(); g.moveTo(mx + dx * h, my + dy * h); g.lineTo(mx - dx * h * 0.6 - dy * h * 0.7, my - dy * h * 0.6 + dx * h * 0.7); g.lineTo(mx - dx * h * 0.6 + dy * h * 0.7, my - dy * h * 0.6 - dx * h * 0.7); g.closePath(); g.fill();
      }
    }
    if (isHot) { A(flash * o.links); g.strokeStyle = '#c4f6ff'; g.lineWidth = (3 + 6 * flash) * dpr; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
  }
  // carriers: load against the window mean, and the repairs on the way to the next cut
  g.globalCompositeOperation = 'lighter';
  if (o.loads > 0.01) for (let a = 0; a < m; a++) {
    const v = (1 - f) * dev[ja * m + a] + f * dev[jb * m + a], av = Math.abs(v), sc = C[3 * a + 2], R = Math.max(3 * dpr, (0.17 + 0.32 * av) * sc);
    A((0.16 + 0.72 * av) * o.loads * fog(sc)); g.drawImage(glow(v > 0 ? '255,157,74' : '77,141,255'), C[3 * a] - R, C[3 * a + 1] - R, 2 * R, 2 * R);
  }
  g.globalCompositeOperation = 'source-over';
  g.fillStyle = '#dce6fa';
  for (let a = 0; a < m; a++) { const sc = C[3 * a + 2]; A(0.75 * fog(sc)); g.beginPath(); g.arc(C[3 * a], C[3 * a + 1], Math.max(1, 0.028 * sc), 0, 2 * Math.PI); g.fill(); }
  if (jb > ja && o.loads > 0.01) for (let a = 0; a < m; a++) {
    const w = act[jb * m + a]; if (w < 0.34) continue;
    A((1 - f) * Math.min(1, 6 * f) * w * 0.85 * o.loads); g.strokeStyle = '#a0f0ff'; g.lineWidth = 1.3 * dpr; g.beginPath(); g.ellipse(C[3 * a], C[3 * a + 1], (0.12 + 0.42 * f) * C[3 * a + 2], (0.12 + 0.42 * f) * C[3 * a + 2] * lerp(0.78, 1, Math.min(1, o.zoom)), 0, 0, 2 * Math.PI); g.stroke();
  }
  // the defects: glyphs while the patch is read as defects, class numerals once it is read as links
  const Aw = where[ja], Bw = where[jb], gl = 1 - o.links, col = CLASSES[pick.k].color, pts = [];
  for (let j = 0; j <= span; j++) { const i = where[j].get(pick.id); if (i !== undefined) pts.push([j, vuv[2 * i], vuv[2 * i + 1]]); }
  if (gl > 0.02) {
    A(0.2 * gl); g.strokeStyle = col; g.lineWidth = 1.2 * dpr; g.setLineDash([2 * dpr, 4 * dpr]); g.beginPath(); pts.forEach(([, u, v], i) => { const q = cam(u, v); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }); g.stroke(); g.setLineDash([]);
    for (const [id, i] of Aw) {
      if (id === pick.id) continue;
      const e = Bw.get(id), q = e !== undefined ? cam(lerp(vuv[2 * i], vuv[2 * e], ease(f)), lerp(vuv[2 * i + 1], vuv[2 * e + 1], ease(f))) : [Q[3 * i], Q[3 * i + 1], Q[3 * i + 2]];
      A(0.7 * gl * (e !== undefined || jb === ja ? 1 : 1 - f) * fog(q[2])); glyph(g, K[ja][i], q[0], q[1], Math.max(4 * dpr, 0.22 * q[2]), dpr);
    }
    if (jb > ja) for (const [id, i] of Bw) if (!Aw.has(id) && id !== pick.id) { A(0.7 * gl * f * fog(Q[3 * i + 2])); glyph(g, K[jb][i], Q[3 * i], Q[3 * i + 1], Math.max(4 * dpr, 0.22 * Q[3 * i + 2]), dpr); }
  }
  if (fu !== null && gl > 0.02) {
    const F = cam(fu, fv), trail = pts.filter(([j]) => j <= ja && j > ja - 9); g.lineCap = 'round';
    for (let i = 1; i <= trail.length; i++) {
      const p0 = cam(trail[i - 1][1], trail[i - 1][2]), last = i === trail.length, p1 = last ? F : cam(trail[i][1], trail[i][2]), age = (ja + f - (last ? ja + f : trail[i][0])) / 9;
      A(0.8 * Math.max(0, 1 - age) * fal * gl); g.strokeStyle = col; g.lineWidth = (1 + 2.8 * Math.max(0, 1 - age)) * dpr; g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.stroke();
    }
    A(fal * gl); glyph(g, pick.k, F[0], F[1], Math.max(6 * dpr, 0.36 * F[2]), dpr);
  }
  P.sum = '';
  if (o.links > 0.01) {
    const fi = where[jd].get(pick.id);
    for (let i = 0; i < win.nv; i++) { const k = K[jd][i]; if (!k || !win.complete[i]) continue; A(o.links); numeral(g, String(k), Q[3 * i], Q[3 * i + 1], Math.max(11 * dpr, (i === fi ? 0.34 : 0.26) * Q[3 * i + 2]), CLASSES[k].color); }
    if (fi !== undefined && win.complete[fi]) {
      const parts = [];
      for (const [nb, s] of win.adj[fi]) {
        const read = win.plus[s] === fi ? L[s] : (6 - L[s]) % 6; parts.push(read);
        if (o.focus > 0.01) { const q = cam(lerp(vuv[2 * fi], vuv[2 * nb], 0.36), lerp(vuv[2 * fi + 1], vuv[2 * nb + 1], 0.36)); A(o.focus); numeral(g, String(read), q[0], q[1], Math.max(10 * dpr, 0.2 * q[2]), read ? '#ffffff' : 'rgba(170,186,214,.8)'); }
      }
      P.sum = `${parts.join('+')} = ${K[jd][fi]}`;
      if (o.focus > 0.01) { A(0.8 * o.focus); g.strokeStyle = '#ffffff'; g.lineWidth = 1.4 * dpr; g.setLineDash([3 * dpr, 3 * dpr]); poly(fi); g.stroke(); g.setLineDash([]); }
    }
  }
  g.globalAlpha = 1;
  P.now = { cut: P.j0 + jd, defects: [...where[jd].values()].filter((i) => win.complete[i]).length, hops: P.hops[jd], links: L.reduce((a, b) => a + (b ? 1 : 0), 0) };
}
// where the cells of the patch sit on the stage at the resting camera (sources of the flight into the lattice)
function patchPoints(W, H) {
  if (!P.ready) return null;
  const cam = patchCam(W, H, 0), out = new Float32Array(P.win.cells.length * 2);
  for (let a = 0; a < P.win.cells.length; a++) { const q = cam(P.win.cuv[2 * a], P.win.cuv[2 * a + 1]); out[2 * a] = q[0]; out[2 * a + 1] = q[1]; }
  return out;
}

// ================================================================= one carrier: repair and the unitary tick (chapter 3), frames (chapter 4)
const ICO = icosahedron(), FR = cubicFrames(ICO), NT = 40, CL = classicalPopulations(NT), CO = coherentPopulations(NT);
const SEAM0 = ICO.E.findIndex((e) => e.includes(0)), MATE0 = ICO.E[SEAM0][0] === 0 ? ICO.E[SEAM0][1] : ICO.E[SEAM0][0];
function popAt(arr, stride, n) {            // populations at a fractional tick
  const a = Math.min(NT, Math.floor(n)), b = Math.min(NT, a + 1), f = n - a, out = new Float64Array(12);
  for (let p = 0; p < 12; p++) out[p] = lerp(arr[a * stride + p], arr[b * stride + p], f);
  return out;
}
function carrier(g, cx, cy, s, R, dpr, al, o = {}) {   // o: pop (12 weights), tint 'r,g,b', frames (alpha of the frame colours), lit (frame index), seam (edge index), seamGlow
  const V = ICO.V.map((p) => apply(R, p)), Q = V.map((q) => { const k = 9 / (9 - q[2]); return [cx + s * k * q[0], cy - s * k * q[1], q[2]]; });
  const order = ICO.E.map((e, i) => [i, (V[e[0]][2] + V[e[1]][2]) / 2]).sort((a, b) => a[1] - b[1]);
  g.lineCap = 'round';
  for (const [i, z] of order) {
    const e = ICO.E[i], a = Q[e[0]], b = Q[e[1]], front = 0.4 + 0.6 * (z + 1.7) / 3.4, fr = FR.frame[i];
    let col = '#8ea8e0', w = 1.1, a0 = 0.5, blur = 0;
    if (o.frames) { const main = fr === 0, on = fr === o.lit; col = FRAMECOL[fr]; w = lerp(1.1, main ? 3.2 : on ? 2.6 : 1.1, o.frames); a0 = lerp(0.5, main ? 1 : on ? 0.95 : 0.3, o.frames); blur = (main || on ? 10 : 0) * o.frames; }
    if (o.seam === i && o.seamGlow) { col = '#c4f6ff'; w = 1.1 + 3.4 * o.seamGlow; a0 = 0.5 + 0.5 * o.seamGlow; blur = 12 * o.seamGlow; }
    g.globalAlpha = clamp(al * a0 * front); g.strokeStyle = col; g.lineWidth = w * dpr; g.shadowColor = col; g.shadowBlur = blur * dpr; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
  }
  g.shadowBlur = 0;
  for (let p = 0; p < 12; p++) {
    const q = Q[p], depth = 0.45 + 0.55 * (q[2] + 1.9) / 3.8;
    if (o.pop) {
      const w = o.pop[p], r = s * (0.1 + 1.05 * Math.sqrt(Math.max(0, w)));
      g.globalCompositeOperation = 'lighter'; g.globalAlpha = clamp(al * depth * (0.25 + 0.75 * Math.sqrt(Math.max(0, w)))); g.drawImage(glow(o.tint), q[0] - r, q[1] - r, 2 * r, 2 * r); g.globalCompositeOperation = 'source-over';
    }
    g.globalAlpha = clamp(al * depth); g.fillStyle = '#e6eeff'; g.beginPath(); g.arc(q[0], q[1], 1.9 * dpr, 0, 2 * Math.PI); g.fill();
  }
  g.globalAlpha = 1;
  return Q;
}
// the two readings of one carrier and the return curve. o: al, x0 (centre before the split), split, intro (0..1), n (ticks), rect [x, y, w, h]
function sceneRepair(g, dpr, now, o) {
  const [rx, ry, rw, rh] = o.rect, tall = rw / rh < 1.35, R = rotation(0.5 + now / 9000, 0.38 + 0.05 * Math.sin(now / 4700));
  const s = tall ? Math.min(rw * 0.1, rh * 0.12) : Math.min(rw * 0.07, rh * 0.145), cy = ry + rh * (tall ? 0.36 : 0.47), single = o.single;
  const xl = single ? rx + rw / 2 : lerp(o.x0, rx + rw * (tall ? 0.27 : 0.2), o.split), xr = lerp(o.x0, rx + rw * (tall ? 0.73 : 0.8), o.split);
  let pl, pc, rec = 0, seam = -1, seamGlow = 0;
  if (o.intro < 1) {                                        // one attempt on one seam: the load at a port, then agreement of its two ports
    const u = ramp(o.intro, 0.3, 0.75); pl = new Float64Array(12); pl[0] = 1 - u / 2; pl[MATE0] = u / 2; pc = pl; rec = u / 2; seam = SEAM0; seamGlow = bump(o.intro, 0.1, 0.95, 0.25);
  } else { pl = popAt(CL, 12, o.n); pc = popAt(CO, 13, o.n); const a = Math.min(NT, Math.floor(o.n)); rec = CO[a * 13 + 12]; if (o.n < NT) { seam = Math.floor(o.n * 7.3) % 30; seamGlow = 0.5 * (1 - (o.n * 7.3) % 1); } }
  carrier(g, xl, cy, s, R, dpr, o.al, { pop: pl, tint: '255,180,74', seam, seamGlow });
  if (!single && o.split > 0.02) carrier(g, xr, cy, s, R, dpr, o.al * o.split, { pop: pc, tint: '63,224,208', seam: o.intro < 1 ? seam : -1, seamGlow });
  const A = (x) => { g.globalAlpha = clamp(x * o.al * (single ? 1 : o.split)); }, ly = cy + s * 2.55;
  const brief = tall || rw / dpr < 780;
  A(1); label(g, brief && !single ? 'REPAIR' : 'REPAIR · POPULATIONS OF ONE LOAD', xl, ly, dpr, 'rgba(255,196,112,.95)', 9.5, 'center');
  if (!single) label(g, brief ? 'UNITARY TICK W' : 'UNITARY TICK W · WITH A RECORD', xr, ly, dpr, 'rgba(120,236,224,.95)', 9.5, 'center');
  const mx = (xl + xr) / 2, ey = tall ? cy : ry + rh * 0.3;
  if (o.intro < 1) {
    A(ramp(o.intro, 0.55, 0.8)); numeral(g, '=', mx, ey, 30 * dpr, '#ffffff', false); if (!tall) label(g, brief ? 'the same populations' : 'the same populations: ½ and ½', mx, ey + 32 * dpr, dpr, 'rgba(220,230,250,.9)', 11.5, 'center', 500);
    label(g, `record weight ${rec.toFixed(2)}`, xr, ly + 15 * dpr, dpr, 'rgba(120,236,224,.85)', 10, 'center', 500);
  } else {
    const one = single ? 0 : 1 - ramp(o.n, 1.6, 3.2);
    if (one > 0.01) { A(one); numeral(g, '=', mx, ey, 30 * dpr, '#ffffff', false); if (!tall) label(g, brief ? 'A†WA = K' : 'after one tick: A†WA = K', mx, ey + 32 * dpr, dpr, 'rgba(220,230,250,.9)', 11.5, 'center', 500); }
    // return to the start port against the ticks: between the two carriers
    const px = rx + rw * (tall || single ? 0.14 : 0.37), pw = rw * (tall || single ? 0.72 : 0.26), py = ry + rh * (tall || single ? 0.94 : 0.8), ph = rh * (tall || single ? 0.19 : 0.36) * (single ? 0.9 : 1), Xn = (n) => px + pw * n / NT, Yp = (p) => py - ph * p;
    A(0.5); g.strokeStyle = 'rgba(140,170,230,.5)'; g.lineWidth = dpr; g.beginPath(); g.moveTo(px, py - ph); g.lineTo(px, py); g.lineTo(px + pw, py); g.stroke();
    g.setLineDash([3 * dpr, 4 * dpr]); g.beginPath(); g.moveTo(px, Yp(1 / 12)); g.lineTo(px + pw, Yp(1 / 12)); g.stroke(); g.setLineDash([]);
    A(0.8); label(g, 'RETURN TO THE START PORT', px, py - ph - 7 * dpr, dpr, 'rgba(160,178,210,.9)', 8.5); label(g, '1/12', px + pw + 5 * dpr, Yp(1 / 12) + 3 * dpr, dpr, 'rgba(160,178,210,.8)', 8.5); label(g, 'ticks', px + pw, py + 13 * dpr, dpr, 'rgba(160,178,210,.8)', 8.5, 'right');
    for (const [arr, st, col] of single ? [[CL, 12, '#ffb44a']] : [[CL, 12, '#ffb44a'], [CO, 13, '#3fe0d0']]) {
      A(1); g.strokeStyle = col; g.lineWidth = 2 * dpr; g.shadowColor = col; g.shadowBlur = 8 * dpr; g.beginPath(); g.moveTo(Xn(0), Yp(arr[0]));
      const nn = Math.min(NT, o.n); for (let n = 1; n <= Math.floor(nn); n++) g.lineTo(Xn(n), Yp(arr[n * st]));
      const a = Math.floor(nn), v = a < NT ? lerp(arr[a * st], arr[(a + 1) * st], nn - a) : arr[NT * st]; g.lineTo(Xn(nn), Yp(v)); g.stroke(); g.shadowBlur = 0;
      g.fillStyle = col; g.beginPath(); g.arc(Xn(nn), Yp(v), 3.4 * dpr, 0, 2 * Math.PI); g.fill();
    }
  }
  g.globalAlpha = 1;
  return { n: o.intro < 1 ? 0 : Math.min(NT, Math.floor(o.n)), xl, xr, cy, s };
}

// ================================================================= the cubic lattice and the live ensemble (chapters 4 to 6)
const LV = { N: 3, frame: null, frames: 0, send: null, where: '', on: false, sentK: -1, trace: [], lastS: -1, fE: null, pE: null, yaw: 0.62, pitch: 0.4, drag: null, pass: -1 };
function startLive() {
  if (LV.send) return;
  const onMsg = (m) => { if (m.type !== 'frame' || m.N !== LV.N) return; LV.frame = m; LV.frames++; LV.fE = LV.fE === null ? m.f : LV.fE + (m.f - LV.fE) * 0.25; LV.pE = LV.pE === null ? m.pabs : LV.pE + (m.pabs - LV.pE) * 0.25; };
  const local = () => { const run = new LiveRun((m) => onMsg(m)); LV.send = (m) => run.handle(m); LV.where = 'main thread'; };
  try {
    const w = new Worker(new URL('./lattice_mc_worker.js', import.meta.url), { type: 'module' });
    w.onmessage = (e) => onMsg(e.data);
    w.onerror = (e) => { if (e.preventDefault) e.preventDefault(); w.terminate(); local(); LV.sentK = -1; LV.on = false; };
    LV.send = (m) => w.postMessage(m); LV.where = 'web worker';
  } catch (e) { local(); }
  LV.send({ type: 'config', N: LV.N, L: LL, kappa: 3, batch: 3, settle: 120 });
}
function progressBars(ch) {                 // work in the browser that takes time shows a bar: reading the run, warming up the ensemble
  const host = $('lt-busy'); if (!host) return;
  const reading = !P.ready && !P.err && ch <= 1;
  if (reading && !P.bar) P.bar = busy(host, 'reading the stored run'); else if (!reading && P.bar) { P.bar.done(); P.bar = null; }
  const m = LV.frame, warming = ch === 4 && (!m || m.warm < 1);
  if (warming) { if (!LV.bar) LV.bar = busy(host, 'warming up the ensemble'); if (m) LV.bar.set(m.warm, `warming up the ensemble · sweep ${m.sweep}`); } else if (LV.bar) { LV.bar.done(); LV.bar = null; }
  const cnt = $('lt-count'), txt = ch >= 3 && m ? `sweep ${m.sweep.toLocaleString('en-US')}` : ch === 2 ? '' : P.ready && P.now ? `cut ${P.now.cut}` : '';
  if (cnt && cnt.__t !== txt) { cnt.__t = txt; cnt.textContent = txt; }
}
const KSCHED = { 3: [0.55, 0.98, 1.2, 1.45], 2: [0.35, 0.66, 0.86, 1.1] };
function kappaAt(s, N) {                    // the coupling along chapter 5: hold, approach, slow passage of the transition, hold
  const [a, b, c, d] = KSCHED[N];
  if (s < 3) return a; if (s < 7) return lerp(a, b, (s - 3) / 4); if (s < 16.5) return lerp(b, c, (s - 7) / 9.5); if (s < 19.5) return lerp(c, d, (s - 16.5) / 3); return d;
}
function driveLive(ch, s) {                 // the timeline drives the ensemble
  if (!LV.send) return;
  const want = ch >= 3 && pageOn() && (TL.playing || TL.dragging);
  if (want !== LV.on) { LV.on = want; LV.send({ type: 'run', on: want }); }
  if (!want) return;
  const k = ch === 3 ? 3 : ch === 4 ? kappaAt(s, LV.N) : KSCHED[LV.N][3];
  if (ch === 4 && (LV.pass !== TL.loops || s < LV.lastS - 0.5)) { LV.pass = TL.loops; LV.trace = []; if (s < 2) { LV.send({ type: 'restart', start: 'cold' }); LV.sentK = -1; } }
  LV.lastS = ch === 4 ? s : -1;
  if (Math.abs(k - LV.sentK) > 0.0025) { LV.sentK = k; LV.send({ type: 'config', kappa: k, soft: true }); }
  if (ch === 4 && LV.frame && Math.abs(LV.frame.kappa - k) < 0.02) LV.trace[Math.floor(s * 5)] = [k, LV.frame.f];
}
function sceneLattice(g, W, H, dpr, now, o) {   // o: al, cx, cy, fly, links, plaq, ghost, flux, hub (the six links of one cell), src (patch points)
  const L = LL, n1 = L + 1, R = rotation(LV.yaw, LV.pitch), sc = (W / H < 1.35 ? Math.min(W * 0.27, H * 0.2) : Math.min(W * 0.17, H * 0.265)) / (L / 2), dist = 3.3 * L, h = L / 2;
  const pr = (x, y, z) => { const q = apply(R, [x - h, y - h, z - h]), k = dist / (dist - q[2]); return [o.cx + sc * k * q[0], o.cy - sc * k * q[1], q[2]]; };
  const pts = new Float32Array(n1 * n1 * n1 * 3), src = o.src, ns = src ? src.length / 2 : 0;
  for (let a = 0; a < n1; a++) for (let b = 0; b < n1; b++) for (let d = 0; d < n1; d++) {
    const i = (a * n1 + b) * n1 + d, q = pr(a, b, d), j = i * 3;
    if (o.fly < 1) {                                       // on the way from the cells of the patch to the sites of the lattice
      const r = Math.hypot(a - h, b - h, d - h) / (h * 1.74), e = ramp(o.fly * 1.55 - r * 0.55, 0, 1), k2 = (i * 37) % Math.max(1, ns);
      const sx = ns ? src[2 * k2] : W / 2 + Math.cos(i * 2.4) * W * 0.3, sy = ns ? src[2 * k2 + 1] : H / 2 + Math.sin(i * 2.4) * H * 0.3;
      pts[j] = lerp(sx, q[0], e); pts[j + 1] = lerp(sy, q[1], e); pts[j + 2] = q[2];
    } else { pts[j] = q[0]; pts[j + 1] = q[1]; pts[j + 2] = q[2]; }
  }
  const at = (a, b, d) => ((a * n1 + b) * n1 + d) * 3, A = (x) => { g.globalAlpha = clamp(x * o.al); };
  { const rad = sc * L * 1.05, gl = g.createRadialGradient(o.cx, o.cy, 0, o.cx, o.cy, rad); gl.addColorStop(0, 'rgba(84,132,235,.26)'); gl.addColorStop(0.6, 'rgba(60,100,210,.08)'); gl.addColorStop(1, 'rgba(60,100,210,0)');
    A(Math.max(o.links, 0.7 * o.fly)); g.fillStyle = gl; g.fillRect(o.cx - rad, o.cy - rad, 2 * rad, 2 * rad); }      // light behind the lattice
  if (o.ghost > 0.01) for (const t of [-2, -1, 1, 2]) {       // neighbouring ticks: copies of the lattice along the time direction
    A(o.ghost * (Math.abs(t) === 1 ? 0.5 : 0.22)); g.strokeStyle = '#a995ff'; g.lineWidth = dpr; g.beginPath();
    const dx = t * sc * 1.7 * o.ghost, dy = -t * sc * 1.1 * o.ghost;
    for (const e of CUBE) { const p = at(e[0] * L, e[1] * L, e[2] * L), q = at(e[3] * L, e[4] * L, e[5] * L); g.moveTo(pts[p] + dx, pts[p + 1] + dy); g.lineTo(pts[q] + dx, pts[q + 1] + dy); }
    g.stroke();
  }
  if (o.links > 0.01) {
    A(0.1 * o.links); g.strokeStyle = '#8ea8e0'; g.lineWidth = dpr * 0.8; g.beginPath();
    for (let a = 0; a < n1; a++) for (let b = 0; b < n1; b++) { let p = at(0, a, b), q = at(L, a, b); g.moveTo(pts[p], pts[p + 1]); g.lineTo(pts[q], pts[q + 1]); p = at(a, 0, b); q = at(a, L, b); g.moveTo(pts[p], pts[p + 1]); g.lineTo(pts[q], pts[q + 1]); p = at(a, b, 0); q = at(a, b, L); g.moveTo(pts[p], pts[p + 1]); g.lineTo(pts[q], pts[q + 1]); }
    g.stroke();
    A(0.45 * o.links); g.strokeStyle = '#8ea8e0'; g.lineWidth = dpr; g.beginPath();
    for (const e of CUBE) { const p = at(e[0] * L, e[1] * L, e[2] * L), q = at(e[3] * L, e[4] * L, e[5] * L); g.moveTo(pts[p], pts[p + 1]); g.lineTo(pts[q], pts[q + 1]); }
    g.stroke();
  }
  const pa = Math.max(o.fly > 0 ? 0.35 + 0.65 * o.fly : 0, o.links), zs = L * 0.9; g.fillStyle = '#dce6fa';
  for (let j = 0; j < pts.length; j += 3) { const near = clamp((pts[j + 2] + zs) / (2 * zs)), ds = (1.1 + 1.1 * near) * dpr; A(pa * (0.2 + 0.65 * near)); g.fillRect(pts[j] - ds / 2, pts[j + 1] - ds / 2, ds, ds); }      // nearer sites are brighter and larger
  const c0 = Math.floor(h);
  if (o.hub > 0.01) {                                        // one cell and its six frame seams, now the six links of a site
    for (const d of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) { const p = at(c0, c0, c0), q = at(c0 + d[0], c0 + d[1], c0 + d[2]); A(o.hub); g.strokeStyle = '#3fe0d0'; g.lineWidth = 2.4 * dpr; g.shadowColor = '#3fe0d0'; g.shadowBlur = 10 * dpr; g.beginPath(); g.moveTo(pts[p], pts[p + 1]); g.lineTo(pts[q], pts[q + 1]); g.stroke(); }
    g.shadowBlur = 0; const p = at(c0, c0, c0); g.fillStyle = '#3fe0d0'; g.beginPath(); g.arc(pts[p], pts[p + 1], 4.5 * dpr, 0, 2 * Math.PI); g.fill();
  }
  if (o.plaq > 0.01) {                                       // one plaquette: the closed loop of four links
    const q = [at(c0, c0, c0), at(c0 + 1, c0, c0), at(c0 + 1, c0 + 1, c0), at(c0, c0 + 1, c0)];
    g.beginPath(); q.forEach((p, i) => (i ? g.lineTo(pts[p], pts[p + 1]) : g.moveTo(pts[p], pts[p + 1]))); g.closePath();
    A(0.3 * o.plaq); g.fillStyle = '#ffb44a'; g.fill(); A(o.plaq); g.strokeStyle = '#ffb44a'; g.lineWidth = 2.4 * dpr; g.shadowColor = '#ffb44a'; g.shadowBlur = 12 * dpr; g.stroke(); g.shadowBlur = 0;
  }
  const m = LV.frame;
  if (o.flux > 0.01 && m && m.L === L) {                     // nontrivial plaquettes: a glowing face and the flux line through it
    g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
    const V = L * L * L, cols = FLUXCOL[m.N], span = L * 0.9;
    for (let k = 0; k < 3; k++) {
      const mu = PLANES[k][0], nu = PLANES[k][1], rho = 3 - mu - nu, e0 = [0, 0, 0], e1 = [0, 0, 0]; e0[mu] = 1; e1[nu] = 1;
      for (let x = 0; x < V; x++) {
        const p = m.plaq[k * V + x]; if (!p) continue;
        const a = Math.floor(x / (L * L)), b = Math.floor(x / L) % L, d = x % L;
        const o0 = at(a, b, d), o1 = at(a + e0[0], b + e0[1], d + e0[2]), o2 = at(a + e0[0] + e1[0], b + e0[1] + e1[1], d + e0[2] + e1[2]), o3 = at(a + e1[0], b + e1[1], d + e1[2]);
        const z = (pts[o0 + 2] + pts[o2 + 2]) / 2, al = 0.28 + 0.6 * clamp((z + span) / (2 * span));
        g.fillStyle = cols[p]; A(0.34 * al * o.flux); g.beginPath(); g.moveTo(pts[o0], pts[o0 + 1]); g.lineTo(pts[o1], pts[o1 + 1]); g.lineTo(pts[o2], pts[o2 + 1]); g.lineTo(pts[o3], pts[o3 + 1]); g.closePath(); g.fill();
        const cc = [a + (e0[0] + e1[0]) / 2, b + (e0[1] + e1[1]) / 2, d + (e0[2] + e1[2]) / 2], lo = cc.slice(), hi = cc.slice(); lo[rho] -= 0.5; hi[rho] += 0.5;
        const q0 = pr(lo[0], lo[1], lo[2]), q1 = pr(hi[0], hi[1], hi[2]);
        g.strokeStyle = cols[p]; A(0.95 * al * o.flux); g.lineWidth = 1.7 * dpr; g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.stroke();
      }
    }
    g.globalCompositeOperation = 'source-over';
  }
  g.globalAlpha = 1;
}
const CUBE = [[0, 0, 0, 1, 0, 0], [0, 1, 0, 1, 1, 0], [0, 0, 1, 1, 0, 1], [0, 1, 1, 1, 1, 1], [0, 0, 0, 0, 1, 0], [1, 0, 0, 1, 1, 0], [0, 0, 1, 0, 1, 1], [1, 0, 1, 1, 1, 1], [0, 0, 0, 0, 0, 1], [1, 0, 0, 1, 0, 1], [0, 1, 0, 0, 1, 1], [1, 1, 0, 1, 1, 1]];
// nontrivial faces against the coupling: the reference of report MA (48^3 cells), the transition, and the live trace
function sceneCurve(g, x, y, w, h, dpr, al, N) {
  const ref = REF['Z' + N], sch = KSCHED[N], k0 = sch[0] - 0.08, k1 = sch[3] + 0.05, fmax = N === 3 ? 0.56 : 0.42, X = (k) => x + w * (k - k0) / (k1 - k0), Y = (f) => y + h - h * f / fmax, A = (v) => { g.globalAlpha = clamp(v * al); };
  A(0.6); g.fillStyle = 'rgba(3,6,14,.72)'; g.beginPath(); g.roundRect(x - 34 * dpr, y - 26 * dpr, w + 50 * dpr, h + 54 * dpr, 14 * dpr); g.fill();
  A(0.6); g.strokeStyle = 'rgba(140,170,230,.5)'; g.lineWidth = dpr; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + h); g.lineTo(x + w, y + h); g.stroke();
  A(0.9); label(g, 'NONTRIVIAL FACES AGAINST THE COUPLING κ', x, y - 9 * dpr, dpr, 'rgba(180,196,226,.9)', 8.5);
  for (const f of N === 3 ? [0.2, 0.4] : [0.1, 0.3]) label(g, f.toFixed(1), x - 5 * dpr, Y(f) + 3 * dpr, dpr, 'rgba(160,178,210,.7)', 8, 'right');
  for (let k = Math.ceil(k0 * 5) / 5; k < k1; k += 0.2) label(g, k.toFixed(1), X(k), y + h + 12 * dpr, dpr, 'rgba(160,178,210,.7)', 8, 'center');
  A(0.9); g.strokeStyle = '#ff6480'; g.setLineDash([3 * dpr, 3 * dpr]); g.beginPath(); g.moveTo(X(ref.kc), y + h); g.lineTo(X(ref.kc), y + 4 * dpr); g.stroke(); g.setLineDash([]);
  label(g, 'transition', X(ref.kc) - 4 * dpr, y + 10 * dpr, dpr, '#ff8098', 8.5, 'right', 500);
  const pts = ref.f48.filter(([k]) => k >= k0 && k <= k1);
  A(0.85); g.strokeStyle = '#6fb1ff'; g.lineWidth = 1.3 * dpr; g.beginPath(); pts.forEach(([k, f], i) => (i ? g.lineTo(X(k), Y(f)) : g.moveTo(X(k), Y(f)))); g.stroke();
  g.fillStyle = '#6fb1ff'; for (const [k, f] of pts) { g.beginPath(); g.arc(X(k), Y(f), 2.1 * dpr, 0, 2 * Math.PI); g.fill(); }
  label(g, 'measured on 48³ cells', x + w, y + 22 * dpr, dpr, '#8fc2ff', 8.5, 'right', 500);
  const tr = LV.trace.filter(Boolean);
  if (tr.length) {
    A(1); g.strokeStyle = '#3fe0d0'; g.lineWidth = 2 * dpr; g.shadowColor = '#3fe0d0'; g.shadowBlur = 8 * dpr; g.beginPath(); tr.forEach(([k, f], i) => (i ? g.lineTo(X(k), Y(Math.min(f, fmax))) : g.moveTo(X(k), Y(Math.min(f, fmax))))); g.stroke();
    const e = tr[tr.length - 1]; g.fillStyle = '#ffffff'; g.beginPath(); g.arc(X(e[0]), Y(Math.min(e[1], fmax)), 3.6 * dpr, 0, 2 * Math.PI); g.fill(); g.shadowBlur = 0;
    label(g, `this browser, ${LL}³ cells`, x + w, y + 34 * dpr, dpr, '#7cece0', 8.5, 'right', 500);
  }
  g.globalAlpha = 1;
}

// ================================================================= the timeline and the director of the stage
const TL = { tau: 0, playing: true, prev: 0, dragging: false, ch: -1, loops: 0, clock: 0 };     // clock: milliseconds of play, the time of every animated element
function chapterAt(tau) { let c = 5; for (let i = 0; i < 6; i++) if (tau < START[i] + DUR[i]) { c = i; break; } return { c, s: tau - START[c] }; }
const trackOf = (tau) => { const { c, s } = chapterAt(tau); return (c + s / DUR[c]) / 6; };                     // every chapter has one sixth of the track
const tauOf = (p) => { const x = clamp(p) * 6, c = Math.min(5, Math.floor(x)); return START[c] + Math.min(DUR[c] - 0.02, (x - c) * DUR[c]); };
function renderStage(g, W, H, dpr, tau, now) {
  backdrop(g, W, H);
  const { c, s } = chapterAt(tau), span = P.ready ? P.j1 - P.j0 : 1, cut = (x, d) => clamp(x / (d - 1.6)) * span;
  const info = { c, s };
  // the patch: chapters 1 and 2, leaving at the start of 3, returning at the end of 6
  let pa = 0, po = null;
  if (c === 0) { pa = ramp(s, 0, 1.2); po = { T: cut(s, DUR[0]), loads: 1, links: 0, focus: 0, zoom: 0 }; }
  else if (c === 1) { const lk = ramp(s, 0.5, 2.8); pa = 1; po = { T: cut(s, DUR[1]), loads: 1 - 0.72 * lk, links: lk, focus: ramp(s, 5, 6.6), zoom: ramp(s, 4.6, 7.6) }; }
  else if (c === 2) { pa = 1 - ramp(s, 0, 1.5); po = { T: span, loads: 0.28, links: 1, focus: 1, zoom: 1 + 1.6 * ramp(s, 0, 1.5) }; }
  else if (c === 5) { pa = ramp(s, DUR[5] - 1.1, DUR[5]); po = { T: 0, loads: 1, links: 0, focus: 0, zoom: 0 }; }
  if (pa > 0.004) { po.al = pa; scenePatch(g, W, H, dpr, po); }
  // one carrier read two ways: chapter 3; its frames: the start of chapter 4
  if (c === 2) {
    const r = sceneRepair(g, dpr, now, { al: ramp(s, 0.4, 1.7), x0: W / 2, split: ramp(s, 1.0, 2.6) * (1 - ramp(s, DUR[2] - 1.3, DUR[2] - 0.1)), intro: clamp((s - 2.4) / 3.2), n: Math.max(0, (s - 5.7) * 4.6), rect: [0, 0, W, H] });
    info.n = r.n;
  }
  const lat = c === 3 ? { fly: ramp(s, 2.9, 6.6), links: ramp(s, 5.6, 7.4), plaq: bump(s, 7.0, 10.9), ghost: bump(s, 8.3, 10.9, 1.1), flux: 0, hub: bump(s, 4.6, 8.4), al: ramp(s, 2.7, 3.6) }
    : c === 4 ? { fly: 1, links: 1, plaq: 0, ghost: 0, flux: ramp(s, 0.2, 1.4), hub: 0, al: 1 }
      : c === 5 ? { fly: 1, links: 1, plaq: 0, ghost: 0, flux: 1, hub: 0, al: (1 - 0.55 * ramp(s, 0.2, 1.4)) * (1 - ramp(s, DUR[5] - 1.3, DUR[5] - 0.2)) } : null;
  if (c === 3) {
    const fr = 1 - ramp(s, 3.4, 5.0), R = rotation(LV.yaw, LV.pitch), size = Math.min(W * 0.085, H * 0.2) * lerp(0.07, 1, fr);
    if (fr > 0.01) {
      const ph = s / 0.62, lit = s < 2.6 ? 1 + (Math.floor(ph) % 4) : 0;
      for (const ax of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) { const a = apply(R, ax.map((x) => x * 2.7)), b = apply(R, ax.map((x) => -x * 2.7)); g.globalAlpha = 0.45 * fr * ramp(s, 0.3, 1.2); g.strokeStyle = '#3fe0d0'; g.lineWidth = dpr; g.setLineDash([3 * dpr, 4 * dpr]); g.beginPath(); g.moveTo(W / 2 + size * a[0], H / 2 - size * a[1]); g.lineTo(W / 2 + size * b[0], H / 2 - size * b[1]); g.stroke(); g.setLineDash([]); }
      carrier(g, W / 2, H / 2, size, R, dpr, fr, { frames: ramp(s, 0.1, 0.9), lit });
      g.globalAlpha = fr * ramp(s, 0.3, 1.2); for (let q = 0; q < 5; q++) { g.fillStyle = FRAMECOL[q]; g.globalAlpha = fr * (q === 0 || q === lit ? 1 : 0.35); g.beginPath(); g.arc(W / 2 + (q - 2) * 15 * dpr, H / 2 + size * 2.5, (q === 0 ? 4.5 : 3.2) * dpr, 0, 2 * Math.PI); g.fill(); }
      g.globalAlpha = 1;
    }
  }
  if (lat) {
    const tall = W / H < 1.35, side = c === 4 ? ramp(s, 0.2, 1.6) : c === 5 ? 1 : 0;
    Object.assign(lat, { cx: tall ? W / 2 : W * lerp(0.5, 0.4, side), cy: tall ? H * lerp(0.5, 0.39, side) : H * 0.53, src: c === 3 ? (P.pts && P.ptsW === W ? P.pts : (P.ptsW = W, P.pts = patchPoints(W, H))) : null });
    sceneLattice(g, W, H, dpr, now, lat);
    const ca = c === 4 ? ramp(s, 0.6, 1.8) : c === 5 ? 1 - ramp(s, 0, 0.9) : 0;
    if (ca > 0.01) { if (tall) sceneCurve(g, W * 0.17, H * 0.735, W * 0.7, H * 0.115, dpr, ca, LV.N); else sceneCurve(g, W * 0.68, H * 0.55, W * 0.21, H * 0.29, dpr, ca, LV.N); }
  }
  vignette(g, W, H, 0.82);
  return info;
}

// ================================================================= tiles of the large runs (chapter 6)
const pm = (v, e, d = 1) => `${Number(v).toFixed(d)}${e !== undefined && e !== null ? ' ± ' + Number(e).toFixed(d) : ''}`;
const biggest = (a, key) => (a && a.length ? a.slice().sort((p, q) => (q[key] || 0) - (p[key] || 0))[0] : null);
const TILES = [
  { id: 'h4', name: 'The register ensemble', get: () => fetch('rl/SIM/cf1/runs/H4_wilson_draws.json'),
    read(d) {
      const z3 = (d.points || []).find((p) => p.label === 'Z3_carrier'), z2 = (d.points || []).find((p) => p.label === 'Z2_carrier');
      const diagW = (p) => (p && p.W_mean ? p.W_mean.slice(0, 8).map((r, i) => Math.log10(Math.max(r[i], 1e-6))) : null), s3 = z3 && z3.sigma_from_creutz_R5to8;
      return { title: 'The register ensemble on 96 × 48 × 48 cells', value: s3 ? `√σ = ${s3.sqrt_sigma.toFixed(3)} <small>per cell: colour centre, area law</small>` : '', text: 'At the flux density of the stored runs the colour centre Z3 sits on the confined side, with an area law. The weak centre Z2 is deconfined, with a perimeter law.', tag: 'MEASURED',
        curves: [diagW(z3) && { x: [1, 4, 9, 16, 25, 36, 49, 64], y: diagW(z3), col: '#ffb347' }, diagW(z2) && { x: [1, 4, 9, 16, 25, 36, 49, 64], y: diagW(z2), col: '#3ee6a8' }].filter(Boolean), note: 'Wilson loops against area, logarithmic: Z3 falls, Z2 stays' };
    } },
  { id: 'ew', lane: 'EW', name: 'Electroweak crossover', get: () => fetch('rl/EW/ew_transition.json', { cache: 'no-store' }),
    read(d) {
      const o = d.oph || {}, s = biggest(o.series, 'L'), ref = o.reference;
      return { value: isFinite(o.T_c_GeV) ? `T<sub>c</sub> = ${pm(o.T_c_GeV, o.T_c_err)} GeV${ref ? ` <small>reference ${pm(ref.T_c_GeV, ref.err)}, not blind</small>` : ''}` : '', curves: s && s.t ? [{ x: s.t, y: s.chi || s.order, mark: o.T_c_GeV }] : [], note: 'susceptibility against temperature' };
    } },
  { id: 'qcd', lane: 'QCD', name: 'Colour deconfinement', get: () => fetch('rl/QCD/colour_transition.json', { cache: 'no-store' }),
    read(d) {
      const u = d.su3 || {}, s = biggest(u.series, 'N_s');
      return { value: isFinite(u.beta_c) ? `β<sub>c</sub> = ${pm(u.beta_c, u.beta_c_err, 3)}${isFinite(u.beta_c_literature) ? ` <small>literature ${u.beta_c_literature}</small>` : ''}` : '', curves: s && s.beta ? [{ x: s.beta, y: s.absL, mark: u.beta_c }] : [], note: 'Polyakov loop against the coupling', gate: 'Gate passed: SU(3) plaquette on 12⁴ cells 0.54886(29) at β = 5.7 and 0.59371(6) at β = 6.0; literature 0.5492 and 0.5937.' };
    } },
  { id: 'had', lane: 'HAD', name: 'Quarks binding into hadrons', get: () => fetch('rl/HAD/hadrons.json', { cache: 'no-store' }),
    read(d) {
      const p = d.potential || {}, f = p.fit || {};
      return { value: isFinite(f.sigma) ? `σ a² = ${pm(f.sigma, f.sigma_err, 3)}` : '', curves: p.r ? [{ x: p.r, y: p.V }] : [], note: 'static potential against distance' };
    } },
];
async function loadTiles() {
  for (const t of TILES) {
    const el = $('lt-tile-' + t.id); if (!el) continue;
    let d = null;
    try { const r = await t.get(); if (r.ok) d = await r.json(); } catch (e) { d = null; }
    if (!d) { el.className = 'lt-tile wait'; el.innerHTML = `<h4>${t.name}</h4><div class="lt-prog"></div>`; el.__curves = null; if (t.lane) el.querySelector('.lt-prog').appendChild(laneProgress(t.lane)); continue; }
    const v = t.read(d), ph = d.placeholder === true, st = (d.statements || [])[0], text = v.text || (st && st.text) || '', tag = ph ? 'PLACEHOLDER' : v.tag || (st && st.label) || '';
    el.className = 'lt-tile' + (ph ? ' ph' : '');
    el.innerHTML = `<div class="lt-tilehead">${ph ? '<span class="lt-ph">placeholder data, not a measurement</span>' : `<span class="lt-real">${esc(tag.toLowerCase())}</span>`}<div class="lt-prog"></div></div><h4>${esc(v.title || d.title || t.name)}</h4>
      ${v.value ? `<div class="lt-tv">${v.value}</div>` : ''}${text ? `<p>${esc(text)}</p>` : ''}<canvas title="${esc(v.note || '')}"></canvas>${v.gate ? `<p class="lt-gate">${esc(v.gate)}</p>` : ''}`;
    el.__curves = v.curves; el.__ph = ph; spark(el);
    if (t.lane && (ph || !d.statements)) el.querySelector('.lt-prog').appendChild(laneProgress(t.lane));
  }
}
function spark(el) {
  const cv = el.querySelector('canvas'), cs = el.__curves; if (!cv || !cs || !cs.length) return;
  const c = fit(cv); if (!c) return; const { g, W, H, dpr } = c; g.clearRect(0, 0, W, H);
  const all = cs.map((cu) => cu.x.map((x, i) => [x, cu.y[i]]).filter((p) => isFinite(p[0]) && p[1] !== null && isFinite(p[1]))), flat = [].concat(...all); if (flat.length < 2) return;
  const xs = flat.map((p) => p[0]), ys = flat.map((p) => p[1]), xa = Math.min(...xs), xb = Math.max(...xs), ya = Math.min(...ys), yb = Math.max(...ys);
  const X = (x) => 3 * dpr + (W - 6 * dpr) * (x - xa) / (xb - xa || 1), Y = (y) => H - 4 * dpr - (H - 9 * dpr) * (y - ya) / (yb - ya || 1);
  cs.forEach((cu, i) => {
    if (isFinite(cu.mark) && cu.mark >= xa && cu.mark <= xb) { g.strokeStyle = 'rgba(255,100,128,.75)'; g.lineWidth = dpr; g.setLineDash([3 * dpr, 3 * dpr]); g.beginPath(); g.moveTo(X(cu.mark), 2 * dpr); g.lineTo(X(cu.mark), H); g.stroke(); }
    g.setLineDash(el.__ph ? [5 * dpr, 4 * dpr] : []); g.strokeStyle = el.__ph ? '#ffb44a' : cu.col || '#3fe0d0'; g.lineWidth = 1.8 * dpr; g.beginPath(); all[i].forEach((p, q) => (q ? g.lineTo(X(p[0]), Y(p[1])) : g.moveTo(X(p[0]), Y(p[1])))); g.stroke(); g.setLineDash([]);
  });
}

// ================================================================= the page
function render(host) {
  host.innerHTML = `<div class="lt-wrap">
  <div class="lt-head"><div class="lt-headrow"><h2>From repair to a quantum lattice</h2>
    <button class="lt-open" id="lt-open"><i></i>How repair becomes a quantum lattice</button></div>
    <div class="lt-into" id="lt-in"><b>map in · links</b>From Defects: every seam carries a link, the defect is the face whose links multiply to a nontrivial central element, and the seam cost is the plaquette action.</div></div>
  <div class="lt-stagewrap"><div class="lt-stagebox" id="lt-stagebox">
    <canvas id="lt-stage"></canvas>
    <div class="lt-title" id="lt-title"><span id="lt-chno"></span><b id="lt-chname"></b></div>
    <div class="lt-nums" id="lt-nums"><div><b id="lt-n0"></b><span id="lt-l0"></span></div><div><b id="lt-n1"></b><span id="lt-l1"></span></div><div><b id="lt-n2"></b><span id="lt-l2"></span></div></div>
    <div class="lt-seg" id="lt-group"><button data-n="3">Z3<span> · colour centre</span></button><button data-n="2">Z2<span> · weak centre</span></button></div>
    <div class="lt-busy" id="lt-busy"></div>
  </div>
  <div class="lt-tiles" id="lt-tiles">${TILES.map((t) => `<div class="lt-tile" id="lt-tile-${t.id}"><h4>${t.name}</h4></div>`).join('')}</div></div>
  <div class="lt-caps" id="lt-caps">${CHAPTERS.map((c, i) => `<div class="lt-capline" data-c="${i}">${c.cap}</div>`).join('')}</div>
  <div class="lt-timeline" id="lt-tl">
    <div class="lt-playbox"><button class="lt-play" id="lt-play" title="play or pause (space)" aria-label="play or pause"></button>
      <div class="lt-playtext"><b id="lt-playname"></b><span id="lt-playhint"></span><span class="lt-count" id="lt-count"></span></div></div>
    <div class="lt-track" id="lt-track"><div class="lt-fill" id="lt-fill"></div><div class="lt-knob" id="lt-knob"></div>
      ${CHAPTERS.map((c, i) => `<button class="lt-mark" data-c="${i}" style="left:${100 * i / 6}%;width:${100 / 6}%" title="${c.name}"><i>${i + 1}</i><span>${c.short}</span></button>`).join('')}</div>
  </div>
  <div class="lt-limits" id="lt-limits"><b>limits</b>The stored run is a quench of the classical law and does not sample this ensemble. The Z6 register is a declared layer. The couplings of the action come from the declared chain.</div>
  <div class="lt-foot"><div class="lt-into" id="lt-out"><b>map out · continuum</b>To Field: on the cubic lattice of cells, quanta routed over many cells obey the Dirac equation, and waves of the links are the gauge fields.</div>
    <div class="lt-src"><span>sources</span>${linkList(['gauge', 'run', 'hadrons'])}<div class="src-links">${EXTRA.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join('')}</div></div></div>
</div>`;
  typeset(host);
}
function setChapter(c) {
  if (TL.ch === c) return; TL.ch = c;
  const box = $('lt-stagebox'); if (!box) return;
  box.dataset.chapter = c;
  $('lt-chno').textContent = `${c + 1} of 6`; $('lt-chname').textContent = CHAPTERS[c].name; $('lt-playname').textContent = `${c + 1} · ${CHAPTERS[c].name}`;
  $('lt-title').classList.remove('in'); void $('lt-title').offsetWidth; $('lt-title').classList.add('in');
  document.querySelectorAll('#lt-caps .lt-capline').forEach((el) => el.classList.toggle('on', Number(el.dataset.c) === c));
  document.querySelectorAll('#lt-track .lt-mark').forEach((el) => el.classList.toggle('on', Number(el.dataset.c) === c));
  for (let i = 0; i < 3; i++) $('lt-l' + i).textContent = CHAPTERS[c].nums[i];
  $('lt-nums').classList.toggle('off', c === 5); $('lt-group').classList.toggle('on', c === 4); $('lt-tiles').classList.toggle('on', c === 5);
  NUM.at = 0;
}
const NUM = { at: 0 };
function numbers(info, now) {
  if (now - NUM.at < 180) return; NUM.at = now;
  const set = (i, t) => { const el = $('lt-n' + i); if (el && el.__t !== t) { el.__t = t; el.innerHTML = t; } }, c = info.c, pn = P.now;
  if (c === 0) { set(0, P.ready && pn ? String(pn.cut) : '…'); set(1, P.ready && pn ? String(pn.defects) : '…'); set(2, P.ready && pn ? String(pn.hops) : '…'); }
  else if (c === 1) { set(0, P.ready && pn ? String(pn.links) : '…'); set(1, P.ready ? `${P.win.faces - P.sol.bad} <small>of ${P.win.faces}</small>` : '…'); set(2, P.ready && P.sum ? `<i>${P.sum}</i> <small>mod 6</small>` : '…'); }
  else if (c === 2) { const n = info.n || 0; set(0, String(n)); set(1, CL[n * 12].toFixed(3)); set(2, CO[n * 13].toFixed(3)); }
  else if (c === 3) { set(0, '5'); set(1, (LL ** 3).toLocaleString('en-US')); set(2, (3 * LL ** 3).toLocaleString('en-US')); }
  else if (c === 4) { set(0, LV.sentK > 0 && LV.sentK < 2.5 ? LV.sentK.toFixed(3) : '…'); set(1, LV.fE !== null ? (100 * LV.fE).toFixed(1) + ' <small>%</small>' : '…'); set(2, LV.pE !== null ? LV.pE.toFixed(2) : '…'); }
}
function paint(now) {
  const cv = $('lt-stage'); if (!cv) return;
  const dt = Math.min(0.1, Math.max(0, (now - TL.prev) / 1000)); TL.prev = now;
  if (TL.playing && !TL.dragging) { TL.tau += dt; TL.clock += dt * 1000; if (!LV.drag) LV.yaw += dt * 0.075; if (TL.tau >= TOTAL) { TL.tau -= TOTAL; TL.loops++; } }
  const c = fit(cv); if (!c) return;
  const { c: ch, s } = chapterAt(TL.tau);
  setChapter(ch); driveLive(ch, s);
  const info = renderStage(c.g, c.W, c.H, c.dpr, TL.tau, TL.clock);
  numbers(info, now); progressBars(ch);
  const p = 100 * trackOf(TL.tau); $('lt-fill').style.width = p + '%'; $('lt-knob').style.left = p + '%';
  const tiles = $('lt-tiles'), ta = ch === 5 ? ramp(s, 0.5, 1.6) * (1 - ramp(s, DUR[5] - 1.4, DUR[5] - 0.4)) : 0;
  if (tiles.__a !== ta) { tiles.__a = ta; tiles.style.opacity = ta; tiles.style.pointerEvents = ta > 0.5 ? 'auto' : 'none'; if (ta > 0 && !tiles.__drawn) { tiles.__drawn = true; TILES.forEach((t) => spark($('lt-tile-' + t.id))); } if (!ta) tiles.__drawn = false; }
}
let raf = 0, failed = 0;
function loop(now) {
  raf = requestAnimationFrame(loop);
  if (!pageOn()) { if (LV.on) { LV.on = false; LV.send({ type: 'run', on: false }); } return; }
  try { paint(now); } catch (e) { if (failed++ < 3) console.error('lattice page, drawing:', e); }
}
function controls() {
  const track = $('lt-track'), seek = (e) => { const r = track.getBoundingClientRect(); TL.tau = tauOf((e.clientX - r.left) / r.width); };
  track.addEventListener('pointerdown', (e) => { TL.dragging = true; track.setPointerCapture(e.pointerId); seek(e); });
  track.addEventListener('pointermove', (e) => { if (TL.dragging) seek(e); });
  const up = () => { TL.dragging = false; }; track.addEventListener('pointerup', up); track.addEventListener('pointercancel', up);
  const play = $('lt-play'), sync = () => { play.classList.toggle('paused', !TL.playing); $('lt-playhint').innerHTML = TL.playing ? 'playing · <kbd>space</kbd> pauses' : 'paused · <kbd>space</kbd> plays'; };
  play.onclick = () => { TL.playing = !TL.playing; sync(); }; sync();
  $('lt-group').querySelectorAll('button').forEach((b) => { b.classList.toggle('on', Number(b.dataset.n) === LV.N); b.onclick = () => {
    const N = Number(b.dataset.n); if (N === LV.N) return; LV.N = N; LV.frame = null; LV.fE = LV.pE = null; LV.trace = []; LV.sentK = -1;
    $('lt-group').querySelectorAll('button').forEach((x) => x.classList.toggle('on', Number(x.dataset.n) === N));
    LV.send({ type: 'config', N, L: LL, kappa: kappaAt(chapterAt(TL.tau).s, N), batch: 3, settle: 120 }); if (TL.ch === 4) TL.tau = START[4] + 0.05;
  }; });
  const stage = $('lt-stagebox');
  stage.addEventListener('pointerdown', (e) => { if (e.target.closest('.lt-tile, .lt-seg, .hq')) return; LV.drag = [e.clientX, e.clientY, LV.yaw, LV.pitch]; });
  window.addEventListener('pointermove', (e) => { if (!LV.drag) return; LV.yaw = LV.drag[2] + (e.clientX - LV.drag[0]) * 0.008; LV.pitch = Math.max(-1.2, Math.min(1.2, LV.drag[3] + (e.clientY - LV.drag[1]) * 0.008)); });
  window.addEventListener('pointerup', () => { LV.drag = null; });
  for (const t of TILES) { const el = $('lt-tile-' + t.id); el.onclick = () => showPage('transitions'); }
  $('lt-in').onclick = (e) => { if (!e.target.closest('.hq')) showPage('defects'); };
  $('lt-out').onclick = (e) => { if (!e.target.closest('.hq')) showPage('readout'); };
  $('lt-open').onclick = () => openExplainer();
  const keys = (e) => pageOn() && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) && !document.querySelector('.lx-over, .jm.open');
  window.addEventListener('keyup', (e) => { if (e.code === 'Space' && keys(e)) e.preventDefault(); });      // a focused button must not fire a second time
  window.addEventListener('keydown', (e) => { if (!keys(e)) return; if (e.code === 'Space') { e.preventDefault(); if (e.repeat) return; if (e.target.blur && e.target.tagName === 'BUTTON') e.target.blur(); play.click(); } if (e.code === 'ArrowRight') TL.tau = START[Math.min(5, TL.ch + 1)] + 0.01; if (e.code === 'ArrowLeft') TL.tau = START[Math.max(0, TL.ch - (chapterAt(TL.tau).s < 1.5 ? 1 : 0))] + 0.01; });
}
function css() { if (!document.getElementById('lt-css')) { const l = document.createElement('link'); l.id = 'lt-css'; l.rel = 'stylesheet'; l.href = new URL('./style/lattice.css', import.meta.url).href; document.head.appendChild(l); } }
export function mount(host) {
  css(); render(host); controls(); startLive();
  if (window.ResizeObserver) new ResizeObserver(() => TILES.forEach((t) => { const el = $('lt-tile-' + t.id); if (el) spark(el); })).observe($('lt-tiles'));
  TL.prev = performance.now(); setChapter(0);
  try { paint(TL.prev); } catch (e) { console.error('lattice page, first frame:', e); }      // the first frame, before any data has arrived
  if (!raf) raf = requestAnimationFrame(loop);
  Object.assign(diag(), { seek: (tau) => { TL.tau = ((tau % TOTAL) + TOTAL) % TOTAL; }, timeline: TL, live: LV, starts: START, sheet, ink, hash, openExplainer });
}
export function shown() {
  if (!raf) raf = requestAnimationFrame(loop);
  loadTiles();
  const wait = () => {                        // the run is loaded by the app: look again shortly while the page is open
    if (!S.meta || !S.display) { setTimeout(wait, 400); return; }
    if (P.run !== S.name || (!P.ready && !P.busy && !P.err)) loadPatch();
  };
  wait();
}
// Checks. sheet(): every chapter of the stage and every scene of the explainer drawn at once into one canvas.
// ink(): share of bright pixels of every canvas of the page. hash(): a number that changes when the stage changes.
function sheet(times = [6, 20, 23.5, 30, 36, 40.5, 46, 49, 53, 62, 70, 76], w = 500, h = 200, cols = 4) {
  const rows = Math.ceil(times.length / cols), ew = Math.floor(cols * w / STEPS.length), eh = Math.round(ew / 1.36), cv = document.createElement('canvas');
  cv.width = w * cols; cv.height = h * rows + eh; const g = cv.getContext('2d'), now = TL.clock;
  const cell = (x, y, cw, ch, draw) => { g.save(); g.translate(x, y); g.beginPath(); g.rect(0, 0, cw, ch); g.clip(); try { draw(); } catch (e) { g.fillStyle = '#ff6480'; g.fillText(String(e), 8, 20); console.error('lattice sheet:', e); } g.restore(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.shadowBlur = 0; g.setLineDash([]); };
  times.forEach((t, i) => cell((i % cols) * w, Math.floor(i / cols) * h, w, h, () => { renderStage(g, w, h, 1, t, now + i * 700); g.fillStyle = '#fff'; g.font = '11px monospace'; g.textAlign = 'left'; g.fillText(`t = ${t} s`, 6, h - 6); }));
  STEPS.forEach((st, i) => cell(i * ew, h * rows, ew, eh, () => explainerScene(g, ew, eh, 1, performance.now(), st.scene, [9, 9, 5.2, 3, 2, 4, 3][i])));
  return cv;
}
function inked(cv) {
  try {
    const w = cv.width, h = cv.height; if (!w || !h) return 0;
    const d = cv.getContext('2d').getImageData(0, 0, w, h).data, step = Math.max(1, Math.floor(Math.sqrt(w * h / 6000))); let n = 0, on = 0, sum = 0;
    for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) { const i = 4 * (y * w + x), v = d[i] + d[i + 1] + d[i + 2]; n++; sum += v * ((x * 7 + y * 13) % 31); if (d[i + 3] > 20 && v > 200) on++; }
    return { ink: +(on / n).toFixed(4), hash: sum };
  } catch (e) { return { ink: -1, hash: 0 }; }
}
const ink = () => [...document.querySelectorAll('#page-lattice canvas, .lx canvas')].map((c) => [c.id || (c.closest('[id]') || {}).id || c.className || 'canvas', inked(c).ink]);
const hash = () => inked($('lt-stage')).hash;

// ================================================================= the guided explainer (popup of the Journey page and of this page)
const STEPS = [
  { title: 'Repair is a random step', label: ['EXACT'], scene: 'repair',
    text: 'One attempt picks one of the sixty ordered seams of a carrier and makes its two ports agree. On the populations of one load this is a random step.',
    formula: 'K=1-\\tfrac{1}{60}\\,L', note: 'L is the Laplacian of the twelve-port graph.', src: ['Proof: the coherent seam repair', RER + 'model/coherent_seam_repair/PROOF.md'] },
  { title: 'The step has a unitary completion', label: ['EXACT'], scene: 'unitary',
    text: 'The coherent program has a unitary tick W on port, record and address. Read on the populations after one tick, it is the repair. Kept coherent, every decay rate becomes a frequency.',
    formula: '\\begin{aligned}A^\\dagger W A&=K\\\\(1-{\\rm Re}\\,W)\\,A&=A\\,(1-K)\\end{aligned}', note: 'A embeds a port with a blank record and the uniform address. On these states the onsite term 1 − Re W of the declared clock generates the attempts: one attempt per tick. The coherent program is declared.', src: ['Proof: one attempt per tick', RER + 'model/lepton_register_round/PROOF.md'] },
  { title: 'A phase at every port needs a link', label: ['EXACT', 'DECLARED'], scene: 'links',
    text: 'The record law is covariant under an independent phase at every port. Comparing two ports across a seam then needs a transporter, the link. A defect is a face whose links do not multiply to the identity.',
    formula: '\\begin{aligned}G&=S\\bigl(U(3)\\times U(2)\\bigr)\\\\&=\\bigl(SU(3)\\times SU(2)\\times U(1)\\bigr)/\\mathbb{Z}_6\\end{aligned}', note: 'The group is exact on the five-level code. The link as a register on the seam is declared; the Z6 register of the runs holds its central part.', src: ['Derivation: links, group, action', DER + 'reports/GL.md'] },
  { title: 'The cost of a face is the action', label: ['EXACT'], scene: 'action',
    text: 'The seam cost around a face, averaged over the code, is the plaquette term, with equal bare couplings of the three factors. The spread of a link in one tick is the electric term.',
    formula: '\\begin{aligned}S&=\\beta\\sum_{\\rm faces}\\bigl(1-\\tfrac15\\,{\\rm Re}\\,{\\rm tr}_5\\,U_{\\rm face}\\bigr)\\\\H_E&=\\tfrac{g^2}{2}\\,C_2,\\qquad \\beta=10/g^2\\end{aligned}', note: 'C₂ is the Casimir of the link. The value of g comes from the declared chain.', src: ['Derivation: links, group, action', DER + 'reports/GL.md'] },
  { title: 'A cubic frame makes the lattice', label: ['EXACT', 'DECLARED'], scene: 'frames',
    text: 'The carrier has five cubic frames. Cells on one frame form a cubic lattice: cells are sites, frame seams are links, ticks are the time direction. The complete tick commutes with every Gauss operator.',
    formula: '[\\,U_{\\rm tick},\\,G_x\\,]=0\\quad\\text{for every site }x', note: 'Frames and fit are exact, and the commutator is exactly zero in the executed candidate tick. The arrangement of the cells and the choice of the frame are declared.', src: ['The routing walk on cubic boxes', RER + 'model/coherent_defect_wave/spatial/ROUTE.md'] },
  { title: 'Closed ticks are a temperature', label: ['DECLARED'], scene: 'ensemble',
    text: 'A lattice closed after N_t ticks is the equilibrium state at temperature E_cell / N_t. Its weight is what a lattice computation samples.',
    formula: '\\begin{aligned}T&=E_{\\rm cell}/N_t\\\\P[U]&\\propto e^{-S[U]}\\end{aligned}', note: 'The identity is the one of lattice field theory. One tick per cell is the declared clock.', src: ['Report: the register ensemble', DER + 'reports/MA.md'] },
  { title: 'Limits', label: ['MEASURED', 'DECLARED'], scene: 'limits',
    text: 'The stored run is a quench of the classical law: its flux is a frozen relic of the preparation, and it does not sample this ensemble. The Z6 register is a declared layer. The couplings of the action come from the declared chain.',
    formula: '', note: 'What connects the run and the ensemble today: the same links and classes, the form of the action, and the flux density that fixes the coupling of the register ensemble.', src: ['Data format and regime of the runs', SITE + 'DATASET.md'] },
];
const MINI = { E: null, frozen: null, slices: [], at: 0 };
function miniEnsemble(now) {                 // a small ensemble on the main thread for the explainer: a few sweeps per second
  if (!MINI.E) { MINI.E = new LinkEnsemble({ N: 3, shape: [6, 6, 6], kappa: 0.98, seed: 7, start: 'hot' }); MINI.E.sweep(60); MINI.at = 0; }
  if (now - MINI.at > 420) {
    MINI.at = now; MINI.E.sweep(6);
    const p = new Uint8Array(3 * 216); MINI.E.plaquettes(p); const s = p.slice(0, 216).filter((_, i) => i % 6 === (MINI.slices.length % 6)).slice(0, 36);
    if (!MINI.frozen) MINI.frozen = s; MINI.slices.unshift({ s, at: now }); if (MINI.slices.length > 6) MINI.slices.pop();
  }
}
function tileOf(g, x, y, w, s, dpr, al, frame = 'rgba(140,170,230,.3)') {
  g.globalAlpha = al; g.fillStyle = 'rgba(3,5,11,.75)'; g.strokeStyle = frame; g.lineWidth = dpr; g.beginPath(); g.rect(x, y, w, w); g.fill(); g.stroke();
  if (!s) return; const c = w / 6;
  for (let i = 0; i < 36; i++) if (s[i]) { g.fillStyle = FLUXCOL[3][s[i]]; g.fillRect(x + (i % 6) * c + 1, y + Math.floor(i / 6) * c + 1, c - 2, c - 2); }
  g.globalAlpha = 1;
}
function explainerScene(g, W, H, dpr, now, scene, t) {   // t: seconds since the step opened
  backdrop(g, W, H);
  const loopT = (d) => t % d;
  if (scene === 'repair' || scene === 'unitary') {
    const s = loopT(13), both = scene === 'unitary';
    sceneRepair(g, dpr, now, { al: 1, x0: W / 2, single: !both, split: 1, intro: both ? clamp(s / 2.6) : 1, n: both ? Math.max(0, (s - 3) * 4) : s * 3.2, rect: [0, both ? 0 : -H * 0.1, W, both ? H : H * 1.08] });
  } else if (scene === 'links') {
    // three ports of one face; a phase at a port turns its two links and leaves the product; one link alone changes it
    const cx = W / 2, cy = H * 0.55, r = Math.min(W, H) * 0.3, s = loopT(12), pt = [0, 1, 2].map((i) => { const a = Math.PI / 2 + i * 2 * Math.PI / 3; return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; });
    const gauge = s < 4 ? ease(clamp(s / 3)) : s < 8 ? 1 : 1 + ease(clamp((s - 8) / 3)), twist = s < 4.6 ? 0 : s < 6 ? ease((s - 4.6) / 1.4) : 1;
    const ph = [gauge * 2, 0, 0], lk = [twist * 2, 0, 0];                 // phases at the ports (sixths of a turn), the repair on seam 0
    const link = [0, 1, 2].map((i) => lk[i] + ph[(i + 1) % 3] - ph[(i + 2) % 3]), prod = ((link[0] + link[1] + link[2]) % 6 + 6) % 6, k = Math.round(prod) % 6;
    g.beginPath(); pt.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.globalAlpha = k ? 0.26 : 0.06; g.fillStyle = k ? CLASSES[k].color : '#8ea8e0'; g.fill(); g.globalAlpha = 1;
    const dial = (x, y, rad, turn, col, w) => { g.strokeStyle = 'rgba(140,170,230,.35)'; g.lineWidth = dpr; g.beginPath(); g.arc(x, y, rad, 0, 2 * Math.PI); g.stroke(); const a = -Math.PI / 2 + turn * Math.PI / 3; g.strokeStyle = col; g.lineWidth = w * dpr; g.shadowColor = col; g.shadowBlur = 8 * dpr; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + rad * Math.cos(a), y + rad * Math.sin(a)); g.stroke(); g.shadowBlur = 0; };
    for (let i = 0; i < 3; i++) {
      const p = pt[(i + 1) % 3], q = pt[(i + 2) % 3], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, on = Math.abs(((link[i] % 6) + 6) % 6) > 0.02 && Math.abs(((link[i] % 6) + 6) % 6 - 6) > 0.02;
      g.strokeStyle = on ? '#ffb347' : 'rgba(150,170,220,.5)'; g.lineWidth = (on ? 3 : 1.6) * dpr; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke();
      dial(mx + (mx - cx) * 0.34, my + (my - cy) * 0.34, 13 * dpr, link[i], '#ffb347', 2.4);
    }
    for (let i = 0; i < 3; i++) { g.fillStyle = '#02040a'; g.beginPath(); g.arc(pt[i][0], pt[i][1], 17 * dpr, 0, 2 * Math.PI); g.fill(); dial(pt[i][0], pt[i][1], 15 * dpr, ph[i], '#3fe0d0', 2.8); }
    if (k) { g.shadowColor = CLASSES[k].color; g.shadowBlur = 18 * dpr; } numeral(g, String(k), cx, cy, 30 * dpr, k ? CLASSES[k].color : 'rgba(170,186,214,.75)', false); g.shadowBlur = 0;
    label(g, s < 4 ? 'A NEW PHASE AT A PORT TURNS ITS TWO LINKS. THE PRODUCT STAYS.' : s < 8 ? 'A REPAIR CHANGES ONE LINK. THE PRODUCT CHANGES: A DEFECT.' : 'NO PHASE AT A PORT REMOVES IT.', cx, H * 0.1, dpr, 'rgba(200,214,240,.9)', 9.5, 'center');
    label(g, 'teal: phase at a port   ·   amber: link on a seam   ·   middle: class of the face', cx, H * 0.95, dpr, 'rgba(160,178,210,.8)', 9, 'center', 500);
  } else if (scene === 'action') {
    const s = loopT(12), k = Math.floor(s / 2) % 6, x0 = W * 0.08, bw = W * 0.4 / 6, by = H * 0.8, bh = H * 0.5;
    label(g, 'COST OF A FLUX OF CLASS k', x0, H * 0.14, dpr, 'rgba(180,196,226,.9)', 9);
    for (let q = 0; q < 6; q++) {
      const c = centreCost(q), x = x0 + q * bw, hc = bh * c.colour / 1.7, hw = bh * c.weak / 1.7, on = q === k;
      g.globalAlpha = on ? 1 : 0.45; g.fillStyle = '#ffb347'; g.fillRect(x + 4 * dpr, by - hc, bw - 8 * dpr, hc); g.fillStyle = '#3ee6a8'; g.fillRect(x + 4 * dpr, by - hc - hw, bw - 8 * dpr, hw);
      numeral(g, String(q), x + bw / 2, by + 13 * dpr, 12 * dpr, on ? '#ffffff' : 'rgba(170,186,214,.8)', false); if (c.total) numeral(g, c.total.toFixed(1), x + bw / 2, by - hc - hw - 10 * dpr, 10.5 * dpr, '#dfe6f5', false);
    }
    g.globalAlpha = 1; label(g, 'colour centre 9/10', x0, H * 0.93, dpr, '#ffb347', 9, 'left', 500); label(g, 'weak centre 4/5', x0 + W * 0.25, H * 0.93, dpr, '#3ee6a8', 9, 'left', 500);
    // the electric term: a link spreads in one tick
    const cx = W * 0.76, cy = H * 0.5, r = Math.min(W * 0.16, H * 0.3), width = 0.12 + 0.75 * (0.5 - 0.5 * Math.cos(2 * Math.PI * s / 6));
    label(g, 'ONE TICK SPREADS A LINK', cx, H * 0.14, dpr, 'rgba(180,196,226,.9)', 9, 'center');
    g.strokeStyle = 'rgba(140,170,230,.35)'; g.lineWidth = dpr; g.beginPath(); g.arc(cx, cy, r, 0, 2 * Math.PI); g.stroke();
    g.strokeStyle = '#a995ff'; g.lineWidth = 2.2 * dpr; g.shadowColor = '#a995ff'; g.shadowBlur = 10 * dpr; g.beginPath();
    for (let i = 0; i <= 120; i++) { const a = -Math.PI + 2 * Math.PI * i / 120, d = Math.exp(-a * a / (2 * width * width)), rr = r * (1 + 0.55 * d), x = cx + rr * Math.sin(a), y = cy - rr * Math.cos(a); if (i) g.lineTo(x, y); else g.moveTo(x, y); }
    g.stroke(); g.shadowBlur = 0; label(g, 'heat time g²/2', cx, cy + 4 * dpr, dpr, 'rgba(200,190,255,.95)', 10, 'center', 500);
  } else if (scene === 'frames') {
    const s = loopT(11), R = rotation(0.55 + now / 11000, 0.4 + 0.06 * Math.sin(now / 5200)), lit = s < 5 ? 1 + (Math.floor(s / 0.9) % 4) : 0, ox = W * 0.28, oy = H * 0.52, size = Math.min(W * 0.11, H * 0.2);
    for (const ax of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) { const a = apply(R, ax.map((x) => x * 2.6)), b = apply(R, ax.map((x) => -x * 2.6)); g.globalAlpha = 0.4; g.strokeStyle = '#3fe0d0'; g.lineWidth = dpr; g.setLineDash([3 * dpr, 4 * dpr]); g.beginPath(); g.moveTo(ox + size * a[0], oy - size * a[1]); g.lineTo(ox + size * b[0], oy - size * b[1]); g.stroke(); g.setLineDash([]); }
    carrier(g, ox, oy, size, R, dpr, 1, { frames: 1, lit });
    label(g, 'ONE CARRIER · FIVE FRAMES', ox, H * 0.1, dpr, 'rgba(180,196,226,.9)', 9, 'center'); label(g, 'CELLS AS SITES', W * 0.72, H * 0.1, dpr, 'rgba(180,196,226,.9)', 9, 'center');
    const lx = W * 0.72, s2 = Math.min(W * 0.085, H * 0.15), Q = (x, y, z) => { const q = apply(R, [x, y, z]), k = 9 / (9 - q[2] * 0.7); return [lx + s2 * k * q[0], oy - s2 * k * q[1], q[2]]; };
    g.lineWidth = dpr; for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (const [p, q] of [[Q(-1, a, b), Q(1, a, b)], [Q(a, -1, b), Q(a, 1, b)], [Q(a, b, -1), Q(a, b, 1)]]) { g.globalAlpha = 0.2 + 0.12 * ((p[2] + q[2]) / 2 + 1.5) / 3; g.strokeStyle = '#8ea8e0'; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); }
    const sq = [Q(0, 0, 0), Q(1, 0, 0), Q(1, 1, 0), Q(0, 1, 0)]; g.globalAlpha = 0.2 + 0.12 * Math.sin(now / 600); g.fillStyle = '#ffb44a'; g.beginPath(); sq.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.fill(); g.globalAlpha = 1; g.strokeStyle = '#ffb44a'; g.lineWidth = 2 * dpr; g.stroke();
    for (const d of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) { const a = Q(0, 0, 0), b = Q(d[0], d[1], d[2]); g.strokeStyle = '#3fe0d0'; g.lineWidth = 2 * dpr; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let d = -1; d <= 1; d++) { const q = Q(a, b, d), mid = !a && !b && !d; g.fillStyle = mid ? '#3fe0d0' : '#dce6fa'; g.globalAlpha = mid ? 1 : 0.4 + 0.4 * (q[2] + 1.8) / 3.6; g.beginPath(); g.arc(q[0], q[1], (mid ? 4.5 : 2.2) * dpr, 0, 2 * Math.PI); g.fill(); }
    g.globalAlpha = 1; g.strokeStyle = 'rgba(63,224,208,.6)'; g.lineWidth = 1.3 * dpr; const a0 = W * 0.46, a1 = W * 0.54; g.beginPath(); g.moveTo(a0, oy); g.lineTo(a1, oy); g.moveTo(a1 - 5 * dpr, oy - 4 * dpr); g.lineTo(a1, oy); g.lineTo(a1 - 5 * dpr, oy + 4 * dpr); g.stroke();
  } else if (scene === 'ensemble' || scene === 'limits') {
    miniEnsemble(now);
    if (scene === 'ensemble') {
      const phase = (t / 3.2) % 3, nt = [8, 4, 2][Math.floor(phase)], col = ['#6fb1ff', '#ffb44a', '#ff6480'][Math.floor(phase)], fade = clamp(Math.min(phase % 1, 1 - (phase % 1)) * 6), cx = W * 0.27, cy = H * 0.52, r = Math.min(W * 0.17, H * 0.3), turn = (now / 2600) % 1;
      label(g, 'TICKS CLOSED TO A CIRCLE', cx, H * 0.1, dpr, 'rgba(180,196,226,.9)', 9, 'center'); label(g, 'FIELDS WITH WEIGHT e⁻ˢ', W * 0.72, H * 0.1, dpr, 'rgba(180,196,226,.9)', 9, 'center');
      g.strokeStyle = 'rgba(140,170,230,.25)'; g.lineWidth = dpr; g.beginPath(); g.arc(cx, cy, r, 0, 2 * Math.PI); g.stroke();
      for (let i = 0; i < nt; i++) {
        const a = -Math.PI / 2 + 2 * Math.PI * i / nt, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a), sz = Math.min(20 * dpr, r * 0.4), near = 1 - Math.min(1, Math.abs(((i / nt - turn + 1.5) % 1) - 0.5) * nt * 0.9);
        g.save(); g.translate(x, y); g.rotate(a + Math.PI / 2); g.globalAlpha = fade * (0.14 + 0.55 * Math.max(0, near)); g.fillStyle = col; g.fillRect(-sz / 2, -sz / 2, sz, sz); g.globalAlpha = fade; g.strokeStyle = col; g.lineWidth = 1.3 * dpr; g.strokeRect(-sz / 2, -sz / 2, sz, sz); g.restore();
      }
      g.globalAlpha = fade; numeral(g, `${nt} ticks`, cx, cy - 10 * dpr, 13 * dpr, '#eef2fb', false); numeral(g, `T = E / ${nt}`, cx, cy + 12 * dpr, 12 * dpr, col, false); g.globalAlpha = 1;
      const tw = Math.min(W * 0.12, H * 0.26), gx = W * 0.72 - 1.5 * tw - 8 * dpr, gy = cy - tw - 6 * dpr;
      for (let q = 0; q < 6; q++) tileOf(g, gx + (q % 3) * (tw + 8 * dpr), gy + Math.floor(q / 3) * (tw + 8 * dpr), tw, MINI.slices[q] && MINI.slices[q].s, dpr, MINI.slices[q] ? (q ? 1 : clamp((now - MINI.slices[0].at) / 350)) : 1);
    } else {
      const tw = Math.min(W * 0.2, H * 0.44), cy = H * 0.52, x1 = W * 0.2 - tw / 2;
      label(g, 'THE RUN: ONE HISTORY', W * 0.2, H * 0.12, dpr, 'rgba(255,196,112,.95)', 9, 'center'); label(g, 'THE ENSEMBLE: ALL FIELDS', W * 0.68, H * 0.12, dpr, 'rgba(120,236,224,.95)', 9, 'center');
      tileOf(g, x1, cy - tw / 2, tw, MINI.frozen, dpr, 1, 'rgba(255,180,74,.7)');
      const sw = tw * 0.47, gx = W * 0.68 - 1.5 * sw - 6 * dpr;
      for (let q = 0; q < 6; q++) tileOf(g, gx + (q % 3) * (sw + 6 * dpr), cy - sw - 3 * dpr + Math.floor(q / 3) * (sw + 6 * dpr), sw, MINI.slices[q] && MINI.slices[q].s, dpr, MINI.slices[q] ? (q ? 1 : clamp((now - MINI.slices[0].at) / 350)) : 1, 'rgba(63,224,208,.45)');
      numeral(g, '≠', W * 0.42, cy, 30 * dpr, '#ff8098', false);
    }
  }
  vignette(g, W, H, 0.7);
}
export function mountExplainer(el, startAt = 0) {
  css();
  el.innerHTML = `<div class="lx"><div class="lx-top"><div class="lx-steps">${STEPS.map((s, i) => `<button data-i="${i}" title="${esc(s.title)}">${i < 6 ? i + 1 : '!'}</button>`).join('<i></i>')}</div>
    <div class="lx-ctl"><button data-a="back" title="back">‹</button><button data-a="play" title="play or pause"></button><button data-a="next" title="next">›</button></div></div>
    <div class="lx-body"><div class="lx-stage"><canvas></canvas><div class="lx-bar"><i></i></div></div>
      <div class="lx-text"><div class="lx-k"></div><h3></h3><p class="lx-p"></p><div class="lx-formula"></div><p class="lx-note"></p><a class="lx-src" target="_blank" rel="noopener"></a></div></div></div>`;
  const root = el.querySelector('.lx'), cv = root.querySelector('canvas'), st = { i: -1, t0: performance.now(), auto: true, hold: 11 };
  const go = (i) => {
    st.i = (i + STEPS.length) % STEPS.length; st.t0 = performance.now(); const s = STEPS[st.i];
    root.querySelectorAll('.lx-steps button').forEach((b) => b.classList.toggle('on', Number(b.dataset.i) === st.i));
    root.querySelector('.lx-k').innerHTML = `${st.i < 6 ? `step ${st.i + 1} of 6` : 'what this does not show'} ${s.label.map((l) => `<span class="lx-label ${l}">${l}</span>`).join('')}`;
    root.querySelector('h3').textContent = s.title; root.querySelector('.lx-p').textContent = s.text;
    root.querySelector('.lx-formula').innerHTML = s.formula ? tex(s.formula, true) : ''; root.querySelector('.lx-note').textContent = s.note;
    const a = root.querySelector('.lx-src'); a.textContent = s.src[0] + ' ↗'; a.href = s.src[1];
    typeset(root);
  };
  root.querySelectorAll('.lx-steps button').forEach((b) => (b.onclick = () => go(Number(b.dataset.i))));
  const play = root.querySelector('[data-a="play"]'), sync = () => play.classList.toggle('paused', !st.auto);
  root.querySelector('[data-a="back"]').onclick = () => go(st.i - 1); root.querySelector('[data-a="next"]').onclick = () => go(st.i + 1);
  play.onclick = () => { st.auto = !st.auto; st.t0 = performance.now(); sync(); }; sync();
  go(startAt);
  const draw = (now) => {
    const c = fit(cv); if (!c) return;
    const t = (now - st.t0) / 1000;
    if (st.auto && t > st.hold) { go(st.i + 1); return; }
    explainerScene(c.g, c.W, c.H, c.dpr, now, STEPS[st.i].scene, t);
    root.querySelector('.lx-bar i').style.width = (st.auto ? 100 * clamp(t / st.hold) : 0) + '%';
  };
  let bad = 0;
  const frame = (now) => { if (!root.isConnected) return; requestAnimationFrame(frame); if (root.offsetParent === null) return; try { draw(now); } catch (e) { if (bad++ < 3) console.error('lattice explainer:', e); } };
  try { draw(performance.now()); } catch (e) { console.error('lattice explainer, first frame:', e); }
  requestAnimationFrame(frame);
  return { go, state: st };
}
// the popup: the overlay of the Journey page when it offers one, else an overlay of this page
export function openExplainer(step = 0) {
  const own = () => {
    if (document.querySelector('.lx-over')) return;
    css();
    const o = document.createElement('div'); o.className = 'lx-over'; o.innerHTML = '<div class="lx-box"><div class="lx-boxhead"><b>How repair becomes a quantum lattice</b><button class="lx-close" title="close" aria-label="close">×</button></div><div class="lx-host"></div></div>';
    document.body.appendChild(o);
    const close = () => { o.remove(); window.removeEventListener('keydown', key); }, key = (e) => { if (e.code === 'Escape') close(); };
    o.addEventListener('click', (e) => { if (e.target === o) close(); }); o.querySelector('.lx-close').onclick = close; window.addEventListener('keydown', key);
    mountExplainer(o.querySelector('.lx-host'), step);
  };
  import('./journey.js').then((m) => { if (m && typeof m.openMap === 'function') { try { const r = m.openMap('links'); if (r === false) own(); } catch (e) { own(); } } else own(); }).catch(own);
}
