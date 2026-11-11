// The Defects catalogue: one animated card per defect class, each next to the particle class it equals.
// Every picture is the run's own record, nothing is invented: from view/observer_defects.npz (every screen defect inside
// each featured observer's patch on every stored cut) the page picks, per class, the identity that is followed over the
// most consecutive cuts and visits the most distinct positions, then draws a window of the observer's patch around that
// track from observers/obs_<carrier>.npz: carriers (nodes, coloured by load against the patch mean on that cut), glue
// seams (lines), repairs between consecutive cuts (pulses: summed load change on the carrier), and the defect moving
// along its stored positions with a fading trail. Births and endings come from the run's catalogue (view/catalogue.npz).
// Identification of classes with particle classes: centre class 6Y mod 6, exact on all 32 code patterns (derived).
// Layout: style/defects.css. Each picture fills its box (the window covers the long side), shows a progress bar while
// its files load and a live counter (observer, causal depth of the cut on screen) while it plays.
import { $, S, fmt } from './app.js';
import { loadNpz } from './npz.js';
import { CLASSES, classGlyph } from './classes.js';
import { busy } from './progress.js';

const ORDER = [1, 5, 4, 2, 3, 0];
const SEC_PER_CUT = 0.24, HOLD = 6, GAP = 3, TRAIL = 14, FOLLOW = 5.5, MARGIN = 3.2;
const CAUSE = { 1: 'annihilation', 2: 'fusion', 3: 'split', 4: 'exchange' };
const PART = {     // title in two lines, so every card has the same title block
  1: { name: ['Left-handed', 'quark class'], sym: 'u<sub>L</sub> · d<sub>L</sub>', sub: 'three colours', gen: 'u c t · d s b' },
  5: { name: ['Left-handed', 'antiquark class'], sym: 'ū · d̄', sub: 'the conjugate of class 1', gen: 'ū c̄ t̄ · d̄ s̄ b̄' },
  4: { name: ['Right-handed', 'quark class'], sym: 'u<sub>R</sub> · d<sub>R</sub>', sub: 'three colours', gen: 'u c t · d s b' },
  2: { name: ['Right-handed', 'antiquark class'], sym: 'ū · d̄', sub: 'the conjugate of class 4', gen: 'ū c̄ t̄ · d̄ s̄ b̄' },
  3: { name: ['Lepton doublet', 'and Higgs class'], sym: 'e · ν', sub: 'its own conjugate', gen: 'e μ τ · ν<sub>e</sub> ν<sub>μ</sub> ν<sub>τ</sub>' },
  0: { name: ['Class 0', 'no defect'], sym: 'γ · g · W · Z', sub: 'and the right-handed leptons', gen: 'e<sub>R</sub> μ<sub>R</sub> τ<sub>R</sub> · ν<sub>R</sub>' },
};

let runFor = '', D = null, picks = null, building = null, raf = 0, io = null;
const obsCache = new Map(), cards = new Map();

// ---------------------------------------------------------------- choosing the tracks (once per run)
function choose() {
  const best = {};
  for (const ob of S.meta.observers) {
    const c = ob.carrier, cut = D['o' + c + '_cut'], cls = D['o' + c + '_cls'], ids = D['o' + c + '_id'], xyz = D['o' + c + '_xyz'];
    if (!cut) continue;
    const by = new Map(), mid = [0, 0, 0];
    for (let i = 0; i < cut.length; i++) { let a = by.get(ids[i]); if (!a) by.set(ids[i], (a = [])); a.push(i); for (let q = 0; q < 3; q++) mid[q] += xyz[3 * i + q] / cut.length; }
    const off = (seg) => { let s = 0; for (const i of seg) s += Math.hypot(xyz[3 * i] - mid[0], xyz[3 * i + 1] - mid[1], xyz[3 * i + 2] - mid[2]); return s / seg.length; };
    for (const [id, rows] of by) {
      rows.sort((a, b) => cut[a] - cut[b]);
      let s = 0;
      for (let e = 1; e <= rows.length; e++) {        // segments: consecutive cuts inside the patch, gaps of at most GAP cuts
        if (e < rows.length && cut[rows[e]] - cut[rows[e - 1]] <= GAP) continue;
        const seg = rows.slice(s, e), pos = new Set(seg.map((i) => `${Math.round(xyz[3 * i] * 1e4)},${Math.round(xyz[3 * i + 1] * 1e4)},${Math.round(xyz[3 * i + 2] * 1e4)}`));
        const n = cut[seg[seg.length - 1]] - cut[seg[0]] + 1, k = ((cls[seg[0]] % 6) + 6) % 6, score = pos.size * n;
        if (!k || (best[k] && (score < best[k].score || (score === best[k].score && (n < best[k].n || (n === best[k].n && off(seg) >= best[k].off)))))) { s = e; continue; }
        best[k] = { k, c, id, rows: seg, score, n, places: pos.size, off: off(seg) };
        s = e;
      }
    }
  }
  return best;
}
async function observer(c) {
  if (!obsCache.has(c)) obsCache.set(c, loadNpz(`${S.base}observers/obs_${c}.npz`, ['frame', 'patch_cells', 'patch_cell_xyz', 'patch_seams', 'cut_patch_loads', 'cut_depth']));
  return obsCache.get(c);
}

// ---------------------------------------------------------------- one window of a patch
function geometry(O) {
  if (O.uv) return O;
  const m = O.patch_cells.length, sp = S.meta.geometry.cell_spacing, fr = O.frame;
  O.m = m; O.tan = (x, y, z) => [(x * fr[0] + y * fr[3] + z * fr[6]) / sp, (x * fr[1] + y * fr[4] + z * fr[7]) / sp];
  O.uv = new Float32Array(2 * m); O.radius = 0;
  for (let c = 0; c < m; c++) { const [u, v] = O.tan(O.patch_cell_xyz[3 * c], O.patch_cell_xyz[3 * c + 1], O.patch_cell_xyz[3 * c + 2]); O.uv[2 * c] = u; O.uv[2 * c + 1] = v; O.radius = Math.max(O.radius, Math.hypot(u, v)); }
  O.K = O.cut_depth.length; O.last = O.K - 1; while (O.last > 0 && O.cut_depth[O.last] < 0) O.last--;
  // load per carrier on every cut, against the patch mean (in units of 2.2 patch standard deviations), and the summed load
  // change since the previous cut, against the patch mean of that change
  const P = 12 * m, L = O.cut_patch_loads;
  O.dev = new Float32Array(O.K * m); O.act = new Float32Array(O.K * m);
  const sum = new Float32Array(m);
  for (let j = 0; j < O.K; j++) {
    let mean = 0, sd = 0, am = 0;
    for (let c = 0; c < m; c++) { let s = 0; for (let q = 0; q < 12; q++) s += L[j * P + 12 * c + q]; sum[c] = s; mean += s; }
    mean /= m; for (let c = 0; c < m; c++) sd += (sum[c] - mean) ** 2; sd = Math.sqrt(sd / m) || 1;
    for (let c = 0; c < m; c++) O.dev[j * m + c] = Math.max(-1, Math.min(1, (sum[c] - mean) / (2.2 * sd)));
    if (!j) continue;
    for (let c = 0; c < m; c++) { let s = 0; for (let q = 0; q < 12; q++) s += Math.abs(L[j * P + 12 * c + q] - L[(j - 1) * P + 12 * c + q]); O.act[j * m + c] = s; am += s; }
    am = am / m || 1; for (let c = 0; c < m; c++) O.act[j * m + c] = Math.min(1, O.act[j * m + c] / (3 * am));
  }
  return O;
}
function windowOf(O, carrier, box, j0, j1, followId) {    // box [u0, u1, v0, v1]: what the window can ever show
  const m = O.m, cells = [], at = new Map(), inBox = (u, v, pad) => u >= box[0] - pad && u <= box[1] + pad && v >= box[2] - pad && v <= box[3] + pad;
  for (let c = 0; c < m; c++) if (inBox(O.uv[2 * c], O.uv[2 * c + 1], MARGIN)) { at.set(c, cells.length); cells.push(c); }
  const seams = [], seen = new Set();
  for (let e = 0; e < O.patch_seams.length / 3; e++) {
    const a = Math.floor(O.patch_seams[3 * e] / 12), b = Math.floor(O.patch_seams[3 * e + 1] / 12);
    if (a === b || !at.has(a) || !at.has(b)) continue; const key = Math.min(a, b) * m + Math.max(a, b); if (seen.has(key)) continue; seen.add(key); seams.push(at.get(a), at.get(b));
  }
  // the other defects that pass through the window on the shown cuts (drawn faint)
  const others = new Map(), cut = D['o' + carrier + '_cut'], cls = D['o' + carrier + '_cls'], ids = D['o' + carrier + '_id'], xyz = D['o' + carrier + '_xyz'];
  for (let i = 0; i < cut.length; i++) {
    if (cut[i] < j0 || cut[i] > j1 || ids[i] === followId) continue;
    const [u, v] = O.tan(xyz[3 * i], xyz[3 * i + 1], xyz[3 * i + 2]); if (!inBox(u, v, MARGIN - 0.4)) continue;
    let f = others.get(cut[i]); if (!f) others.set(cut[i], (f = new Map())); f.set(ids[i], { k: ((cls[i] % 6) + 6) % 6, u, v });
  }
  return { O, carrier, j0, j1, cells, seams, others };
}
function track(p, O) {
  const cut = D['o' + p.c + '_cut'], xyz = D['o' + p.c + '_xyz'], at = new Map(), pts = [];
  for (const i of p.rows) { const [u, v] = O.tan(xyz[3 * i], xyz[3 * i + 1], xyz[3 * i + 2]); at.set(cut[i], [u, v]); pts.push([cut[i], u, v]); }
  const first = pts[0][0], last = pts[pts.length - 1][0];
  let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
  for (const [, u, v] of pts) { u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
  let hops = 0, lastMove = first; for (let i = 1; i < pts.length; i++) if (Math.hypot(pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]) > 1e-3) { hops++; lastMove = pts[i][0]; }
  // birth and ending from the run's catalogue: inside the interval just before the first shown cut, or just after the last
  const r = S.catRow ? S.catRow.get(p.id) : undefined, cd = O.cut_depth;
  const bd = r !== undefined ? S.cat.birth_depth[r] : -1, dd = r !== undefined ? S.cat.death_depth[r] : -1, cause = r !== undefined ? S.cat.cause[r] : 0;
  const born = bd >= 0 && bd <= cd[first] && (first === 0 || bd > cd[first - 1]);
  const ended = dd >= 0 && last < O.last && dd > cd[last] && dd <= cd[last + 1];
  const alive = dd < 0 && last === O.last;
  const j0 = Math.max(1, first - 3), j1 = Math.min(O.last, last + 3);
  // the view: a fixed window around a short path, pulled toward the patch centre while the path stays inside; a long
  // path is followed by a window of FOLLOW cells half-width whose centre is the track smoothed over a few cuts
  let half = Math.max(3.6, Math.max(u1 - u0, v1 - v0) / 2 + 2), cam = new Float32Array(2 * (j1 - j0 + 1)), box;
  if (half <= FOLLOW) {
    let c = [(u0 + u1) / 2, (v0 + v1) / 2]; const r = Math.hypot(c[0], c[1]), lim = O.radius - half - 0.4;
    if (r > lim && lim > 0) for (let s = 1; s >= 0; s -= 0.1) {
      const t = 1 + s * (lim / r - 1), q = [c[0] * t, c[1] * t];
      if (pts.every(([, u, v]) => Math.abs(u - q[0]) <= half - 0.7 && Math.abs(v - q[1]) <= half - 0.7)) { c = q; break; }
    }
    for (let j = j0; j <= j1; j++) { cam[2 * (j - j0)] = c[0]; cam[2 * (j - j0) + 1] = c[1]; }
    box = [c[0] - half, c[0] + half, c[1] - half, c[1] + half];
  } else {
    half = FOLLOW; box = [Infinity, -Infinity, Infinity, -Infinity];
    for (let j = j0; j <= j1; j++) {
      let su = 0, sv = 0, sw = 0;
      for (const [q, u, v] of pts) { const wq = Math.exp(-(((q - j) / 4) ** 2)); su += wq * u; sv += wq * v; sw += wq; }
      let cu = sw > 1e-9 ? su / sw : pts[j < first ? 0 : pts.length - 1][1], cvv = sw > 1e-9 ? sv / sw : pts[j < first ? 0 : pts.length - 1][2];
      const here = at.get(j); if (here) { cu = Math.max(here[0] - half + 1.2, Math.min(here[0] + half - 1.2, cu)); cvv = Math.max(here[1] - half + 1.2, Math.min(here[1] + half - 1.2, cvv)); }
      cam[2 * (j - j0)] = cu; cam[2 * (j - j0) + 1] = cvv;
      box[0] = Math.min(box[0], cu - half); box[1] = Math.max(box[1], cu + half); box[2] = Math.min(box[2], cvv - half); box[3] = Math.max(box[3], cvv + half);
    }
  }
  const w = windowOf(O, p.c, box, j0, j1, p.id);
  return Object.assign(w, { half, cam, k: p.k, id: p.id, at, pts, first, last, hops, lastMove, born, ended, alive, cause: CAUSE[cause] || '', places: p.places });
}
// class 0: a window of a loaded patch that no defect enters over the longest stretch of late cuts
function blank(loaded) {
  let best = null; const half = 4;
  for (const [carrier, O] of loaded) {
    const cut = D['o' + carrier + '_cut'], xyz = D['o' + carrier + '_xyz'], uv = new Float32Array(2 * cut.length);
    for (let i = 0; i < cut.length; i++) { const [u, v] = O.tan(xyz[3 * i], xyz[3 * i + 1], xyz[3 * i + 2]); uv[2 * i] = u; uv[2 * i + 1] = v; }
    for (let c = 0; c < O.m; c++) {
      const cu = O.uv[2 * c], cv = O.uv[2 * c + 1]; if (Math.hypot(cu, cv) > O.radius - half - 1.5) continue;
      let lastHit = 0;
      for (let i = 0; i < cut.length; i++) if (cut[i] > lastHit && Math.abs(uv[2 * i] - cu) <= half + 1 && Math.abs(uv[2 * i + 1] - cv) <= half + 1) lastHit = cut[i];
      if (!best || lastHit < best.lastHit) best = { carrier, O, c, cu, cv, lastHit };
    }
  }
  if (!best) return null;
  const j0 = Math.max(1, Math.min(best.O.last - 20, best.lastHit + 1)), j1 = best.O.last, cam = new Float32Array(2 * (j1 - j0 + 1));
  for (let j = 0; j <= j1 - j0; j++) { cam[2 * j] = best.cu; cam[2 * j + 1] = best.cv; }
  const w = windowOf(best.O, best.carrier, [best.cu - half, best.cu + half, best.cv - half, best.cv + half], j0, j1, -1);
  return Object.assign(w, { k: 0, half, cam, pts: [], at: new Map() });
}

// ---------------------------------------------------------------- drawing
const sprites = {};
function glow(rgb) {
  if (sprites[rgb]) return sprites[rgb];
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(0.22, `rgba(${rgb},.85)`); gr.addColorStop(0.5, `rgba(${rgb},.22)`); gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return (sprites[rgb] = c);
}
const ease = (f) => f * f * (3 - 2 * f);
function glyph(g, k, x, y, r, alpha, dpr) {
  const C = CLASSES[k]; g.globalAlpha = alpha; g.shadowColor = C.color; g.shadowBlur = 14 * dpr;
  if (C.shape === 'ring') { g.strokeStyle = C.color; g.lineWidth = r * 0.42; g.beginPath(); g.arc(x, y, r * 0.8, 0, 2 * Math.PI); g.stroke(); }
  else if (C.shape === 'duo') { g.fillStyle = C.color; g.beginPath(); g.arc(x, y, r * 0.6, 0, 2 * Math.PI); g.fill(); g.strokeStyle = C.rim; g.lineWidth = r * 0.24; g.beginPath(); g.arc(x, y, r * 1.02, 0, 2 * Math.PI); g.stroke(); }
  else { g.fillStyle = C.color; g.beginPath(); g.arc(x, y, r, 0, 2 * Math.PI); g.fill(); }
  g.shadowBlur = 0; g.globalAlpha = 1;
}
function draw(card, now) {
  const cv = card.cv, dpr = Math.min(2, devicePixelRatio || 1), W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
  if (!W || !H) return;
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
  const g = cv.getContext('2d'), w = card.w, C = CLASSES[card.k];
  const bg = g.createRadialGradient(W / 2, H / 2, 4, W / 2, H / 2, Math.max(W, H) * 0.72); bg.addColorStop(0, '#0c1630'); bg.addColorStop(1, '#03050b');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  if (!w) return;                                        // still loading: the backdrop, under the progress bar of the card
  const span = w.j1 - w.j0, loop = (span + HOLD) * SEC_PER_CUT * 1000;
  const T = Math.min(span, ((now - card.t0) % loop) / (SEC_PER_CUT * 1000)), j = Math.min(w.j1, w.j0 + Math.floor(T)), j2 = Math.min(w.j1, j + 1), f = j2 > j ? T - Math.floor(T) : 0;
  if (card.j !== j) { card.j = j; card.cap.textContent = `observer ${w.carrier} · depth ${fmt(w.O.cut_depth[j])}`; }   // the live counter of the picture
  const a0 = 2 * (j - w.j0), a1 = 2 * (j2 - w.j0), cu = w.cam[a0] + (w.cam[a1] - w.cam[a0]) * f, cvv = w.cam[a0 + 1] + (w.cam[a1 + 1] - w.cam[a0 + 1]) * f;
  // the window covers the long side of the picture; on the short side the track stays in view (carriers are loaded MARGIN cells beyond the window)
  const O = w.O, m = O.m, sc = Math.min(Math.max(W, H) / 2 / (w.half + 0.6), Math.min(W, H) / 2 / Math.max(1, w.half - 0.3)), X = (u) => W / 2 + (u - cu) * sc, Y = (v) => H / 2 - (v - cvv) * sc;
  // glue seams
  g.strokeStyle = 'rgba(120,150,215,.16)'; g.lineWidth = dpr; g.beginPath();
  for (let e = 0; e < w.seams.length; e += 2) { const a = w.cells[w.seams[e]], b = w.cells[w.seams[e + 1]]; g.moveTo(X(O.uv[2 * a]), Y(O.uv[2 * a + 1])); g.lineTo(X(O.uv[2 * b]), Y(O.uv[2 * b + 1])); }
  g.stroke();
  // carriers: load against the patch mean
  g.globalCompositeOperation = 'lighter';
  for (const c of w.cells) {
    const v = (1 - f) * O.dev[j * m + c] + f * O.dev[j2 * m + c], a = Math.abs(v), R = Math.max(3 * dpr, (0.16 + 0.3 * a) * sc);
    g.globalAlpha = 0.18 + 0.72 * a; g.drawImage(glow(v > 0 ? '255,157,74' : '77,141,255'), X(O.uv[2 * c]) - R, Y(O.uv[2 * c + 1]) - R, 2 * R, 2 * R);
  }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  for (const c of w.cells) { g.fillStyle = 'rgba(220,230,250,.55)'; g.beginPath(); g.arc(X(O.uv[2 * c]), Y(O.uv[2 * c + 1]), 1.3 * dpr, 0, 2 * Math.PI); g.fill(); }
  // repairs on the way to the next cut: a pulse on every carrier whose load changes
  if (j2 > j) for (const c of w.cells) {
    const a = O.act[j2 * m + c]; if (a < 0.34) continue;           // more than the patch mean of the load change
    const r = (0.12 + 0.42 * f) * sc;
    g.strokeStyle = `rgba(160,240,255,${(1 - f) * Math.min(1, 6 * f) * a * 0.85})`; g.lineWidth = 1.3 * dpr; g.beginPath(); g.arc(X(O.uv[2 * c]), Y(O.uv[2 * c + 1]), r, 0, 2 * Math.PI); g.stroke();
  }
  // other defects passing through the window, faint
  const A = w.others.get(j), B = w.others.get(j2);
  if (A) for (const [id, d] of A) { const e = B && B.get(id), uu = e ? d.u + (e.u - d.u) * ease(f) : d.u, vv = e ? d.v + (e.v - d.v) * ease(f) : d.v; glyph(g, d.k, X(uu), Y(vv), 0.2 * sc, e ? 0.3 : 0.3 * (1 - f), dpr); }
  if (B && j2 > j) for (const [id, d] of B) if (!A || !A.has(id)) glyph(g, d.k, X(d.u), Y(d.v), 0.2 * sc, 0.3 * f, dpr);
  if (card.k === 0) { vignette(g, W, H); bar(g, W, H, T / span, dpr, '#9fb0cf'); return; }
  // the followed defect: faint whole path, fading trail, glyph, birth and ending
  const rgb = hex(C.color);
  g.strokeStyle = `rgba(${rgb},.09)`; g.lineWidth = 1.2 * dpr; g.setLineDash([2 * dpr, 4 * dpr]); g.beginPath();
  w.pts.forEach(([, u, v], i) => (i ? g.lineTo(X(u), Y(v)) : g.moveTo(X(u), Y(v)))); g.stroke(); g.setLineDash([]);
  const pa = w.at.get(j), pb = w.at.get(j2);
  let cur = null, alpha = 1;
  if (pa && pb) cur = [pa[0] + (pb[0] - pa[0]) * ease(f), pa[1] + (pb[1] - pa[1]) * ease(f)];
  else if (pa) { cur = pa; alpha = j2 > j ? 1 - f : 1; }               // ends or leaves the patch on the way to the next cut
  else if (pb) { cur = pb; alpha = f; }                                  // is born or enters
  else if (j > w.first && j < w.last) {                                  // a short gap: outside the patch on this cut
    let q = j; while (q > w.first && !w.at.get(q)) q--; cur = w.at.get(q); alpha = 0.18;
  }
  const trail = w.pts.filter(([q]) => q <= j && q > j - TRAIL);
  if (cur && trail.length) {
    for (let i = 1; i <= trail.length; i++) {
      const p0 = trail[i - 1], p1 = i < trail.length ? [trail[i][0], trail[i][1], trail[i][2]] : [j + f, cur[0], cur[1]];
      const age = (j + f - p1[0]) / TRAIL; g.strokeStyle = `rgba(${rgb},${0.75 * Math.max(0, 1 - age) * alpha})`; g.lineWidth = (1 + 2.6 * Math.max(0, 1 - age)) * dpr; g.lineCap = 'round';
      g.beginPath(); g.moveTo(X(p0[1]), Y(p0[2])); g.lineTo(X(p1[1]), Y(p1[2])); g.stroke();
    }
  }
  const R = Math.max(5 * dpr, 0.34 * sc);
  if (cur) glyph(g, card.k, X(cur[0]), Y(cur[1]), R, alpha, dpr);
  const ring = (u, v, t, col) => { if (t < 0 || t > 1.6) return; const a = 1 - t / 1.6; g.strokeStyle = `rgba(${col},${a})`; g.lineWidth = 2 * dpr; g.beginPath(); g.arc(X(u), Y(v), R + t * 0.9 * sc, 0, 2 * Math.PI); g.stroke(); };
  const tt = w.j0 + T;
  if (w.born) { const [u, v] = w.at.get(w.first); ring(u, v, tt - (w.first - 1), '255,228,92'); if (tt > w.first) mark(g, X(u), Y(v), '255,228,92', 'birth', dpr); }
  if (w.ended) { const [u, v] = w.at.get(w.last); ring(u, v, tt - w.last, '255,95,122'); if (tt > w.last + 1) mark(g, X(u), Y(v), '255,95,122', 'end', dpr); }
  vignette(g, W, H); bar(g, W, H, T / span, dpr, C.color);
}
function mark(g, x, y, rgb, kind, dpr) {
  g.strokeStyle = `rgba(${rgb},.7)`; g.lineWidth = 1.4 * dpr; const s = 4 * dpr; g.beginPath();
  if (kind === 'birth') { g.moveTo(x - s, y); g.lineTo(x + s, y); g.moveTo(x, y - s); g.lineTo(x, y + s); } else { g.moveTo(x - s, y - s); g.lineTo(x + s, y + s); g.moveTo(x + s, y - s); g.lineTo(x - s, y + s); }
  g.stroke();
}
function vignette(g, W, H) {
  const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.32, W / 2, H / 2, Math.max(W, H) * 0.62); v.addColorStop(0, 'rgba(3,5,11,0)'); v.addColorStop(1, 'rgba(3,5,11,.92)');
  g.fillStyle = v; g.fillRect(0, 0, W, H);
}
function bar(g, W, H, p, dpr, col) { g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(0, H - 2 * dpr, W, 2 * dpr); g.fillStyle = col; g.globalAlpha = 0.55; g.fillRect(0, H - 2 * dpr, W * Math.max(0, Math.min(1, p)), 2 * dpr); g.globalAlpha = 1; }
const hex = (h) => { const n = parseInt(h.slice(1), 16); return `${n >> 16},${(n >> 8) & 255},${n & 255}`; };

// ---------------------------------------------------------------- the page
function stat(k) {
  const d = S.classStats && S.classStats.tiers && S.classStats.tiers.screen && S.classStats.tiers.screen.classes && S.classStats.tiers.screen.classes[k];
  const r = (name, v) => `<div><span>${name}</span><b>${v}</b></div>`;
  if (!d) return r('identities', '0') + r('moved', '–') + r('flux', 'none');
  return r('identities', fmt(d.ever)) + r('moved', (100 * d.moved_fraction).toFixed(d.moved_fraction < 0.1 ? 1 : 0) + ' %') + r('annihilated', fmt((d.ended && d.ended.annihilation) || 0));
}
function describe(w) {                     // the track in words, for the help badge of the picture
  if (!w) return '';
  if (w.k === 0) return `<b>A blank window.</b> Observer ${w.carrier}, cuts ${w.j0} to ${w.j1} of the run ${S.name}: the stretch of its patch that no defect enters for the longest run of late cuts. A face of class 0 carries no flux and leaves nothing on the screen, so there is nothing to follow; the carriers keep repairing all the same.`;
  const n = w.last - w.first + 1;
  const start = w.born ? `born on cut ${w.first}` : `enters the observer's patch on cut ${w.first}`;
  const end = w.ended ? `ends by ${w.cause} after cut ${w.last}` : w.alive ? `still alive at the end of the run (cut ${w.last})` : `leaves the patch after cut ${w.last}`;
  const moved = w.hops > 3 ? `It hops ${w.hops} times between ${w.places} distinct positions.` : w.hops ? `It hops ${w.hops} time${w.hops > 1 ? 's' : ''} up to cut ${w.lastMove}, then sits for ${w.last - w.lastMove} cuts while the carriers around it keep repairing.` : 'It never moves; the carriers around it keep repairing.';
  const view = w.half === FOLLOW ? ' The window follows the track, smoothed over a few cuts.' : '';
  return `<b>Defect identity ${w.id}</b>, class ${w.k}, in the patch of observer ${w.carrier} of the run ${S.name}: ${start}, followed over ${n} consecutive cuts, ${end}. ${moved}${view} Chosen from all ${S.meta.observers.length} featured patches as the identity with the largest product of cuts followed and distinct positions visited.`;
}
const LEAD = 'Map into this step, the twist: a repair adds its current j mod 6 to one face of its seam and subtracts it on the other. Every class equals a Standard Model centre class 6Y mod 6';
function render() {
  const host = $('df-host'); if (!host) return;
  host.innerHTML = `<div class="df-wrap">
    <div class="df-head"><h2>Defects</h2>
      <div class="df-lead">${LEAD} <span class="q1-chip q1-derived">derived</span></div>
      <div class="df-legend"><span><i style="background:#ff9d4a"></i>load above the mean</span><span><i style="background:#4d8dff"></i>below</span><span><i class="ring"></i>repair</span><span><i class="ring y"></i>birth</span><span><i class="ring r"></i>end</span></div></div>
    <div class="df-grid">${ORDER.map((k) => {
      const C = CLASSES[k], P = PART[k];
      return `<div class="df-card" data-k="${k}" style="--c:${C.color}" tabindex="0" role="button" aria-label="${P.name.join(' ')}: open the class card">
        <div class="df-stage"><canvas></canvas><div class="df-wait"></div><div class="df-cap"></div></div>
        <div class="df-side"><div class="df-k">class ${k}</div>
          <h3>${classGlyph(k, 22)}<span><span>${P.name[0]}</span><span>${P.name[1]}</span></span></h3>
          <div class="df-sym">${P.sym}</div><div class="df-sub">${P.sub}</div><div class="df-gen">${P.gen}</div>
          <div class="df-nums">${stat(k)}</div></div></div>`;
    }).join('')}</div></div>`;
  cards.clear();
  import('./player.js').then(({ bar }) => {         // play/pause and seek for all six pictures at once
    const grid = host.querySelector('.df-grid'); if (!grid || host.querySelector('.df-player')) return;
    PL = bar({ playing: CLK.on, onToggle: (on) => { CLK.on = on; }, onSeek: (f) => seekAll(f) }); PL.el.classList.add('df-player'); grid.insertAdjacentElement('beforebegin', PL.el);
  });
  if (io) io.disconnect();
  io = new IntersectionObserver((es) => es.forEach((e) => { const c = cards.get(Number(e.target.dataset.k)); if (c) c.vis = e.isIntersecting; }));
  host.querySelectorAll('.df-card').forEach((el) => {
    const k = Number(el.dataset.k), open = () => window.__openClass && window.__openClass(k);
    cards.set(k, { k, el, cv: el.querySelector('canvas'), cap: el.querySelector('.df-cap'), wait: busy(el.querySelector('.df-wait'), 'reading the stored cuts'), w: null, j: -1, t0: CLK.v, vis: true });
    el.onclick = (e) => { if (!e.target.closest('.hq')) open(); };
    el.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
    io.observe(el);
  });
}
function attach(k, w) {
  const c = cards.get(k); if (!c) return;
  c.w = w; c.j = -1; c.t0 = CLK.v;
  if (c.wait) { c.wait.done(); c.wait = null; }
  if (!w) c.cap.textContent = k ? 'no track of this class in the stored patches' : 'no window without a defect in the stored patches';
  c.el.querySelector('.df-nums').innerHTML = stat(k);
  c.el.querySelector('.df-stage').dataset.track = describe(w);
}
function progress(done, total) {      // one bar per picture that still waits, all with the same count
  for (const c of cards.values()) if (c.wait) c.wait.set(done / total);
}
async function build() {
  render();
  if (!D) D = await loadNpz(S.base + 'view/observer_defects.npz');
  if (!picks) picks = choose();
  const need = [...new Set(Object.values(picks).map((p) => p.c))];
  const loaded = new Map(); let done = 1; progress(done, need.length + 1);
  await Promise.all(need.map(async (c) => {
    const O = geometry(await observer(c)); loaded.set(c, O); progress(++done, need.length + 1);
    for (const p of Object.values(picks)) if (p.c === c) attach(p.k, track(p, O));
  }));
  attach(0, blank(loaded));
  for (const c of cards.values()) if (c.wait) attach(c.k, null);          // a class without a stored track
  window.__defects = { picks: Object.fromEntries([...cards].map(([k, c]) => [k, c.w && { observer: c.w.carrier, id: c.w.id, first: c.w.first, last: c.w.last, hops: c.w.hops, places: c.w.places, born: c.w.born, ended: c.w.ended, cause: c.w.cause, alive: c.w.alive, j0: c.w.j0, j1: c.w.j1, cells: c.w.cells.length }])) };
}
const CLK = { on: true, v: 0, last: 0 };          // the cards share one clock that the play button stops and the seek bar moves
let PL = null;
const loopOf = (c) => (c.w.j1 - c.w.j0 + HOLD) * SEC_PER_CUT * 1000;
function seekAll(frac) { for (const c of cards.values()) if (c.w) c.t0 = CLK.v - frac * loopOf(c); }
function frame(now) {
  const page = $('page-defects');
  if (!page || !page.classList.contains('on')) { raf = 0; CLK.last = 0; return; }
  if (!CLK.last) CLK.last = now; if (CLK.on) CLK.v += Math.min(100, now - CLK.last); CLK.last = now;
  for (const c of cards.values()) if (c.vis) draw(c, CLK.v);
  if (PL) { const c = [...cards.values()].find((x) => x.w); if (c) { const L = loopOf(c), f = (((CLK.v - c.t0) % L) + L) % L / L; PL.pos(f); } }
  raf = requestAnimationFrame(frame);
}
export async function defectsShown() {
  if (!raf) raf = requestAnimationFrame(frame);
  if (!S.meta || !S.cat || !S.classStats) {     // the run is still loading: look again shortly while the page is open
    if (!$('df-host').firstChild) render();
    setTimeout(() => { if ($('page-defects').classList.contains('on')) defectsShown(); }, 600); return;
  }
  if (runFor !== S.name) {
    runFor = S.name; D = null; picks = null; obsCache.clear();
    building = build().catch((e) => { console.error('defects page:', e); });
  }
  await building;
}
