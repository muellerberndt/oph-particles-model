// The First defects page (step "Early universe", page name "cosmos"): the first cuts of the selected run.
// Only what the run and its rule compute is shown:
//   the screen, cut by cut   the stored cuts of the run (cuts/cut_*.npz: screen_id, screen_cls, screen_xyz,
//                            screen_birth_depth), the whole sphere projected with equal areas onto a disc
//   pair births              view/class_stats.json (screen tier, channels 0 -> a + b) and run.json (census of the cut at
//                            causal depth 1) of every plain law C run L3 ... L10 that is served
//   who moves, who stays     run.json of the selected run (census of every stored cut) and its view/class_stats.json;
//                            the exact barrier of a lasting class-3 pair: /rl/TR/tr_exact.json (report TR.md)
//   at the end               view/class_stats.json and view/early_universe.json (contents of the carriers at the end)
//   centre fields            the register ensemble with a declared plaquette action:
//                            /rl/SIM/cf1/runs/H4_wilson_draws.json (report MA.md)
// Layout and type: style/qa1.css, section "First defects". The charts are SVG drawn at the measured size of their box
// and drawn again when the box changes. Progress bars (progress.js) show while the runs and a cut load.
// Removed on 2026-11-11 (owner: only what the model computes is shown): the era explorer with its particle-mesh
// gravity picture, the ledger of the cosmology papers, and the textbook thermal history beside the run.
import { $, S, fmt, marker } from './app.js';
import { loadNpz } from './npz.js';
import { hotWeights, displayedCut } from './cosmos_evidence.js';
import { busy } from './progress.js';

const FP = { on: false, seen: true, lv: [], h4: null, tr: null, frames: null, R: null, T: [], k: 1, alive: [], xy: null, born: [],
  t0: 0, playing: false, last: 0, mr: 2.4, dirty: true, loading: false, cutCache: new Map(), cutRequest: 0, ro: null, cx: null, census: null };
const PAIRS = [     // the three kinds of pair birth, in the order of the charts
  { a: 1, b: 5, ch: '0 -> 1 + 5', ann: '1 + 5 -> 0', name: 'classes 1 + 5', long: 'left-handed quark class and its conjugate' },
  { a: 3, b: 3, ch: '0 -> 3 + 3', ann: '3 + 3 -> 0', name: 'classes 3 + 3', long: 'lepton doublet and Higgs class' },
  { a: 4, b: 2, ch: '0 -> 2 + 4', ann: '2 + 4 -> 0', name: 'classes 4 + 2', long: 'right-handed quark class and its conjugate' },
];
const chip = (t) => `<span class="q1-chip q1-${t}">${t}</span>`;        // status words of the site: derived, declared, open
const fpEsc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fpPct = (a, b, d = 1) => (b ? (100 * a / b).toFixed(d) : (0).toFixed(d)) + ' %';
const fpHash = (x) => { x = Math.imul((x ^ (x >>> 16)) >>> 0, 0x45d9f3b); x = Math.imul((x ^ (x >>> 16)) >>> 0, 0x45d9f3b); return (x ^ (x >>> 16)) >>> 0; };
const fpCol = (k) => S.pmap.class_style[String(k)].color;
const fpSum = (a) => a.reduce((s, v) => s + v, 0);
const fpPair = (P, s = 12) => marker(P.a, s) + marker(P.b, s);
const SUPER = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const fpSci = (v) => { const e = Math.floor(Math.log10(v)); return `${Math.ceil(v / 10 ** e - 1e-9)} × 10${String(e).split('').map((c) => SUPER[c]).join('')}`; };
function fpTicks(max, n = 4) {
  if (!(max > 0)) return [0, 1];
  const raw = max / n, p = 10 ** Math.floor(Math.log10(raw)), m = raw / p, step = (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p, out = [];
  for (let i = 0; i * step < max + step * 0.999; i++) out.push(+(i * step).toPrecision(10));
  return out;
}
const fpTickLab = (v, compact) => (compact && v >= 1e6 ? +(v / 1e6).toPrecision(3) + 'M' : compact && v >= 1e3 ? +(v / 1e3).toPrecision(3) + 'K' : fmt(+v.toPrecision(6)));
const fpProj = (x, y, z) => { const k = Math.sqrt(2 / Math.max(1e-9, 1 + z)) / 2; return [k * x, k * y]; };   // Lambert equal-area, whole sphere to the unit disc
const fpSelected = () => FP.lv.find((l) => l.name === S.name);     // the run chosen at the top, when it is a plain law C run

// ---- the runs L3 ... L10 and the two files of the repair-law search -----------------------------------------------------
async function fpLoad() {
  const get = (u) => fetch(u).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  let names = (S.runs || []).filter((r) => !r.twists && /^L\d+$/.test(r.name)).sort((a, b) => a.level - b.level).map((r) => r.name);
  if (!names.length) names = ['L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10'];
  const total = names.length + 1, bar = busy($('cos-fp-load'), 'reading the runs'); let done = 0;
  const step = () => bar.set(++done / total, `reading the runs, ${done} of ${total}`);
  const lv = await Promise.all(names.map(async (n) => {
    const [cs, rj, eu] = await Promise.all([get(`runs/${n}/view/class_stats.json`), get(`runs/${n}/run.json`), get(`runs/${n}/view/early_universe.json`)]);
    step();
    if (!cs || !rj || !cs.tiers || !cs.tiers.screen) return null;
    const ch = cs.tiers.screen.channels, cut1 = (rj.cuts || []).find((c) => c.depth === 1), f = cut1 ? cut1.counts_screen : null;
    return { name: n, level: rj.geometry.level, plaq: rj.geometry.screen_plaquettes, carriers: rj.geometry.carriers, cls: cs.tiers.screen.classes, ch,
      all: PAIRS.map((P) => ch[P.ch] || 0), ann: PAIRS.map((P) => ch[P.ann] || 0), first: f ? [f[1], f[3] / 2, f[2]] : null, firstDefects: cut1 ? cut1.screen : 0,
      prep: rj.preparation || {}, eu };
  }));
  FP.lv = lv.filter(Boolean);
  [FP.h4, FP.tr] = await Promise.all([get('rl/SIM/cf1/runs/H4_wilson_draws.json'), get('rl/TR/tr_exact.json')]);
  step(); bar.done();
}

// ---- the selected run: its stored cuts on the disc ---------------------------------------------------------------------
function fpBuildRun() {
  FP.frames = S.frames; FP.R = null; FP.xy = null; FP.cutCache = new Map(); FP.cutRequest = (FP.cutRequest || 0) + 1; FP.dirty = true;
  const g = S.meta.geometry;
  $('cos-fp-runlab').textContent = `level ${g.level} · ${fmt(g.carriers)} carriers`;
  if (S.meta.config && S.meta.config.twists) {      // the closed-loop extension is a different law
    $('cos-fp-count').textContent = ''; $('cos-fp-read').innerHTML = '<div class="fd-now"><span>This run is the closed-loop extension, a different law. The page reads the plain law C runs.</span></div>';
    fpCensusCard(); return;
  }
  FP.T = S.frames.map((f) => (f.depth == null ? S.classStats.depth_at_end : f.depth));
  const sample = Math.max(1, S.meta.display_sample || 1);
  let peak = 0; for (const f of S.frames) peak = Math.max(peak, f.screen || 0);
  const stride = Math.max(1, Math.ceil(peak / sample / 16000));
  FP.R = { sample, stride, cls: new Uint8Array(0), m: 0 };
  FP.mr = Math.max(1.5, Math.min(3.4, 0.46 * Math.sqrt(Math.PI * 300 * 300 / Math.max(1, peak / sample / stride))));     // marker radius on a 640 px disc
  FP.k = Math.min(FP.k, FP.T.length - 1);
  fpSetSlice(FP.k); fpCensusCard();
  if (FP.lv && FP.lv.length) fpTexts();   // the cards follow the run chosen at the top
}
async function fpSetSlice(k) {
  const R = FP.R; if (!R) return;
  k = Math.max(0, Math.min(FP.T.length - 1, k)); FP.k = k;
  const request = ++FP.cutRequest, base = S.base;
  FP.loading = true;
  const sl = $('cos-fp-slice'); sl.max = FP.T.length - 1; sl.value = k;
  fpReadout();
  let bar = null; const late = FP.cutCache.has(k) ? 0 : setTimeout(() => { bar = busy($('cos-fp-wait'), `reading cut ${k + 1} of ${FP.T.length}`); }, 250);   // a bar when the cut takes longer
  try {
    let cut = FP.cutCache.get(k);
    if (!cut) cut = await fpFetchCut(k);
    if (request !== FP.cutRequest || R !== FP.R || base !== S.base) return;
    FP.cutCache.set(k, cut); while (FP.cutCache.size > 6) FP.cutCache.delete(FP.cutCache.keys().next().value);
    if (k + 1 < FP.T.length && !FP.cutCache.has(k + 1)) fpFetchCut(k + 1).then((c) => { if (base === S.base) FP.cutCache.set(k + 1, c); }).catch(() => {});   // prefetch the next cut
    const d = displayedCut(cut, { stride: R.stride, hash: fpHash, previousDepth: k ? FP.T[k - 1] : -1 });
    R.cls = d.cls; R.m = d.ids.length; R.storedRows = d.storedRows; R.ids = d.ids;
    const xy = new Float32Array(2 * R.m);
    for (let i = 0; i < R.m; i++) { const [u, v] = fpProj(d.xyz[3 * i], d.xyz[3 * i + 1], d.xyz[3 * i + 2]); xy[2 * i] = u; xy[2 * i + 1] = v; }
    Object.assign(FP, { alive: Array.from({ length: R.m }, (_, i) => i), born: d.born, xy, t0: performance.now(), dirty: true });
    fpCursor();
  } catch (error) {
    if (request === FP.cutRequest) { fpPlay(false); $('cos-fp-read').innerHTML = `<div class="fd-now"><span>The stored positions of this cut are not served: ${fpEsc(error.message)}</span></div>`; }
  } finally { clearTimeout(late); if (bar) bar.done(); if (request === FP.cutRequest) FP.loading = false; }
}
const fpPending = new Map();
function fpFetchCut(k) {     // one request per cut, shared by playback and prefetch
  const key = S.base + ':' + k;
  if (!fpPending.has(key)) fpPending.set(key, loadNpz(S.base + FP.frames[k].file, ['screen_id', 'screen_cls', 'screen_xyz', 'screen_birth_depth']).finally(() => fpPending.delete(key)));
  return fpPending.get(key);
}
function fpReadout() {       // the live counter beside the play control, and the census of the cut on screen
  const f = FP.frames[FP.k], T = FP.T[FP.k], c = f.counts_screen, end = FP.k === FP.T.length - 1, g = S.meta.geometry;
  $('cos-fp-count').textContent = `cut ${FP.k + 1} of ${FP.T.length}`;
  $('cos-fp-read').innerHTML = `<div class="fd-now"><b>${end ? 'end of the run' : 'causal depth ' + fmt(T)}</b><span>${fmt(f.screen)} defects on ${fmt(g.screen_plaquettes)} plaquettes</span></div>` +
    `<div class="fd-counts">${[1, 5, 4, 2, 3].map((k) => `<span title="class ${k}">${marker(k, 12)}<b>${fmt(c[k])}</b></span>`).join('')}</div>`;
}

// ---- the disc ----------------------------------------------------------------------------------------------------------
function fpFit() {           // backing store at the displayed size times the device pixel ratio
  const cv = $('cos-fp-oph'); if (!cv) return false;
  const w = Math.round(cv.clientWidth * Math.min(2, window.devicePixelRatio || 1));
  if (w < 40 || cv.width === w) return false;
  cv.width = w; cv.height = w; return true;
}
function fpDisc(g, W, C, rad) {
  g.globalAlpha = 1; g.clearRect(0, 0, W, W);
  const gr = g.createRadialGradient(C, C, rad * 0.05, C, C, rad); gr.addColorStop(0, 'rgba(38,56,104,.40)'); gr.addColorStop(1, 'rgba(18,28,56,.28)');
  g.fillStyle = gr; g.beginPath(); g.arc(C, C, rad, 0, 2 * Math.PI); g.fill(); g.strokeStyle = 'rgba(147,163,192,.4)'; g.lineWidth = Math.max(1, W / 640); g.stroke();
}
function fpDrawOPH(now) {
  const cv = $('cos-fp-oph'); if (!cv) return;
  const g = cv.getContext('2d'), W = cv.width, u = W / 640, C = W / 2, rad = W / 2 - 2 * u;
  fpDisc(g, W, C, rad);
  if (!FP.R || !FP.xy) return;            // the empty disc is the first frame
  const r = FP.mr * u, xy = FP.xy, al = FP.alive, R = FP.R, rr0 = rad - r - u;
  for (const k of [2, 4, 3, 1, 5]) {            // frozen kinds first, the moving ones on top
    const st = S.pmap.class_style[String(k)], idx = []; for (let i = 0; i < al.length; i++) if (R.cls[al[i]] === k) idx.push(i);
    if (!idx.length) continue;
    const path = (rr) => { g.beginPath(); for (const i of idx) { const x = C + rr0 * xy[2 * i], y = C - rr0 * xy[2 * i + 1]; g.moveTo(x + rr, y); g.arc(x, y, rr, 0, 2 * Math.PI); } };
    if (st.shape === 'ring') { path(r * 0.9); g.strokeStyle = st.color; g.lineWidth = Math.max(1, r * 0.42); g.stroke(); }
    else if (st.shape === 'duo') { path(r * 0.6); g.fillStyle = st.color; g.fill(); path(r); g.strokeStyle = st.rim || st.color; g.lineWidth = Math.max(0.8, r * 0.3); g.stroke(); }
    else { path(r); g.fillStyle = st.color; g.fill(); }
  }
  const age = now - FP.t0;
  if (age < 1200 && FP.born.length) {     // white halos on the identities born since the previous stored cut
    const f = 1 - age / 1200; g.strokeStyle = `rgba(255,255,255,${(0.55 * f).toFixed(3)})`; g.lineWidth = u; g.beginPath();
    for (const i of FP.born) { const x = C + rr0 * xy[2 * i], y = C - rr0 * xy[2 * i + 1], rr = r + (1.6 + 3 * (1 - f)) * u; g.moveTo(x + rr, y); g.arc(x, y, rr, 0, 2 * Math.PI); }
    g.stroke();
  }
}

// ---- the charts, drawn at the size of their box --------------------------------------------------------------------------
function fpPairsSVG(W, H) {
  const L = FP.lv; if (!L.length) return '';
  const sel = fpSelected(), lab = 56, gap = 16, top = 20, bw = (W - lab - gap) / 2, x1 = lab, x2 = lab + bw + gap, rh = (H - top) / L.length, bh = Math.round(Math.max(8, Math.min(20, rh - 8)));
  let s = `<svg class="fd-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Shares of the three kinds of pair birth per level, on the first cut and over the whole run">` +
    `<text x="${x1}" y="12" class="fd-ax">first cut</text><text x="${x2.toFixed(1)}" y="12" class="fd-ax">whole run</text>`;
  L.forEach((l, i) => {
    const y = top + i * rh + (rh - bh) / 2, on = !!sel && l.name === sel.name;
    s += `<text x="${lab - 10}" y="${(y + bh / 2 + 4).toFixed(1)}" text-anchor="end" class="fd-ax${on ? ' fd-on' : ''}">level ${l.level}</text>`;
    for (const [v, x0, what] of [[l.first, x1, 'first cut'], [l.all, x2, 'whole run']]) {
      if (!v) continue; const tot = fpSum(v); let x = x0;
      PAIRS.forEach((P, j) => {
        const w = bw * v[j] / tot;
        if (w >= 1) {
          const ww = Math.max(1, w - 2);
          s += `<rect x="${x.toFixed(2)}" y="${y.toFixed(1)}" width="${ww.toFixed(2)}" height="${bh}" rx="3" fill="${fpCol(P.a)}" opacity="${on || !sel ? 1 : 0.5}" tabindex="0" data-tip="${fpEsc(`Level ${l.level}, ${what}: ${fmt(v[j])} pairs of ${P.name} of ${fmt(tot)}, ${fpPct(v[j], tot)}`)}"/>`;
          if (on && ww > 46 && bh >= 12) s += `<text x="${(x + 5).toFixed(1)}" y="${(y + bh / 2 + 3.5).toFixed(1)}" class="fd-in">${fpPct(v[j], tot)}</text>`;
        }
        x += w;
      });
    }
  });
  return s + '</svg>';
}
function fpCensusSVG(W, H) {
  const Q = FP.census; if (!Q || !FP.R) return '';
  const T = FP.T, ser = Q.ser, cols = Q.cols, l = 44, r = 56, t = 8, b = 34, pw = W - l - r, ph = H - t - b, Tmax = T[T.length - 1];
  const lx = (d) => l + pw * Math.log10(1 + d) / Math.log10(1 + Tmax); FP.cx = lx; Q.W = W;
  const ticks = fpTicks(Math.max(...ser.flat()), ph < 130 ? 2 : 4), ytop = ticks[ticks.length - 1], ly = (v) => t + ph * (1 - v / ytop), compact = ytop >= 1e4 || W < 420;
  let s = `<svg class="fd-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Number of defects of each kind on the screen at every stored cut">`;
  for (const v of ticks) s += `<line x1="${l}" x2="${l + pw}" y1="${ly(v).toFixed(1)}" y2="${ly(v).toFixed(1)}" stroke="rgba(147,163,192,.14)"/><text x="${l - 8}" y="${(ly(v) + 4).toFixed(1)}" text-anchor="end" class="fd-ax">${fpTickLab(v, compact)}</text>`;
  for (const d of [1, 10, 100, 1000, 10000, 100000].filter((d) => d <= Tmax)) s += `<line x1="${lx(d).toFixed(1)}" x2="${lx(d).toFixed(1)}" y1="${t + ph}" y2="${t + ph + 4}" stroke="rgba(147,163,192,.5)"/><text x="${lx(d).toFixed(1)}" y="${t + ph + 17}" text-anchor="middle" class="fd-ax">${fmt(d)}</text>`;
  s += `<text x="${l + pw / 2}" y="${H - 2}" text-anchor="middle" class="fd-ax">causal depth, log scale</text><line x1="${l}" x2="${l + pw}" y1="${t + ph}" y2="${t + ph}" stroke="rgba(147,163,192,.35)"/>`;
  ser.forEach((v, i) => { s += `<polyline fill="none" stroke="${cols[i]}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points="${v.map((y, j) => `${lx(T[j]).toFixed(1)},${ly(y).toFixed(1)}`).join(' ')}"/>`; });
  const ends = ser.map((v, i) => ({ i, y: ly(v[v.length - 1]), v: v[v.length - 1] })).sort((p, q) => p.y - q.y);
  for (let i = 1; i < ends.length; i++) ends[i].y = Math.max(ends[i].y, ends[i - 1].y + 14);
  for (const e of ends) s += `<circle cx="${l + pw + 9}" cy="${(e.y).toFixed(1)}" r="4" fill="${cols[e.i]}"/><text x="${l + pw + 18}" y="${(e.y + 4).toFixed(1)}" class="fd-ax fd-num">${fmt(e.v)}</text>`;
  s += `<line id="cos-fp-cur" x1="0" x2="0" y1="${t}" y2="${t + ph}" stroke="rgba(255,255,255,.55)" stroke-width="1"/><line id="cos-fp-hl" x1="0" x2="0" y1="${t}" y2="${t + ph}" stroke="rgba(255,255,255,.25)" stroke-width="1" visibility="hidden"/>`;
  return s + `<rect id="cos-fp-hov" x="${l}" y="${t}" width="${pw}" height="${ph}" fill="transparent"/></svg>`;
}
function fpConfSVG(W, H) {
  const pt = (lab) => FP.h4 && FP.h4.points && FP.h4.points.find((p) => p.label === lab), pts = [pt('Z3_carrier'), pt('Z2_carrier')]; if (!pts[0] || !pts[1]) return '';
  const cols = [fpCol(4), fpCol(3)], l = 44, r = 56, t = 8, b = 34, pw = W - l - r, ph = H - t - b, Rs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const ser = pts.map((p) => Rs.map((R) => p.V_minus_V1_T8[String(R)]));
  const ticks = fpTicks(Math.max(...ser.flat().map((v) => v[0] + (v[1] || 0))), ph < 130 ? 2 : 4), ytop = ticks[ticks.length - 1];
  const lx = (R) => l + pw * (R - 1) / 9, ly = (v) => t + ph * (1 - v / ytop);
  let s = `<svg class="fd-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Wilson-loop statistic of the colour centre and of the weak centre against the loop width">`;
  for (const v of ticks) s += `<line x1="${l}" x2="${l + pw}" y1="${ly(v).toFixed(1)}" y2="${ly(v).toFixed(1)}" stroke="rgba(147,163,192,.14)"/><text x="${l - 8}" y="${(ly(v) + 4).toFixed(1)}" text-anchor="end" class="fd-ax">${fpTickLab(v)}</text>`;
  for (const R of Rs) s += `<text x="${lx(R).toFixed(1)}" y="${t + ph + 17}" text-anchor="middle" class="fd-ax">${R}</text>`;
  s += `<line x1="${l}" x2="${l + pw}" y1="${t + ph}" y2="${t + ph}" stroke="rgba(147,163,192,.35)"/><text x="${l + pw / 2}" y="${H - 2}" text-anchor="middle" class="fd-ax">loop width R, in cells</text>`;
  ser.forEach((v, i) => {
    s += `<polyline fill="none" stroke="${cols[i]}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points="${v.map((p, j) => `${lx(Rs[j]).toFixed(1)},${ly(p[0]).toFixed(1)}`).join(' ')}"/>`;
    v.forEach((p, j) => {
      if (p[1]) s += `<line x1="${lx(Rs[j]).toFixed(1)}" x2="${lx(Rs[j]).toFixed(1)}" y1="${ly(p[0] - p[1]).toFixed(1)}" y2="${ly(p[0] + p[1]).toFixed(1)}" stroke="${cols[i]}" stroke-width="1.2" opacity=".7"/>`;
      s += `<circle cx="${lx(Rs[j]).toFixed(1)}" cy="${ly(p[0]).toFixed(1)}" r="4" fill="${cols[i]}" stroke="#101a2e" stroke-width="2" tabindex="0" data-tip="${fpEsc(`${i ? 'weak centre' : 'colour centre'}, R = ${Rs[j]}: ${p[0].toFixed(4)} ± ${(p[1] || 0).toFixed(4)}`)}"/>`;
    });
    const e = v[v.length - 1]; s += `<text x="${l + pw + 12}" y="${(ly(e[0]) + 4).toFixed(1)}" class="fd-ax">${i ? 'weak' : 'colour'}</text>`;
  });
  return s + '</svg>';
}
const CHARTS = { pairs: fpPairsSVG, census: fpCensusSVG, conf: fpConfSVG };
function fpDrawChart(host) {
  const W = Math.round(host.clientWidth), H = Math.round(host.clientHeight), fn = CHARTS[host.dataset.chart];
  if (!fn || W < 120 || H < 60) return;
  host.innerHTML = fn(W, H) || '';
  if (host.dataset.chart === 'census') fpCursor();
}
function fpWatchCharts() {   // every chart follows the size of its box
  if (!FP.ro) FP.ro = new ResizeObserver((es) => { for (const en of es) if (en.target.isConnected) fpDrawChart(en.target); });
  FP.ro.disconnect();
  document.querySelectorAll('#cos-first .fd-chart').forEach((h) => { fpDrawChart(h); FP.ro.observe(h); });
}
function fpCursor() {
  const c = $('cos-fp-cur'); if (!c || !FP.cx || !FP.R) return;
  const x = FP.cx(FP.T[FP.k]).toFixed(1); c.setAttribute('x1', x); c.setAttribute('x2', x);
}

// ---- the four cards ---------------------------------------------------------------------------------------------------
function fpPairsCard() {
  const el = $('cos-fp-pairs'), L = fpSelected() || FP.lv[FP.lv.length - 1];
  if (!L || !L.first) { el.innerHTML = '<div class="fd-ch"><h3>Pair births</h3></div><div class="fd-line">The served runs hold no census of the first cut.</div>'; return; }
  const ta = fpSum(L.all), tf = fpSum(L.first);
  el.innerHTML = `<div class="fd-ch"><h3>Pair births</h3></div>
    <div class="fd-key">${PAIRS.map((P) => `<span title="${P.long}">${fpPair(P)}${P.name}</span>`).join('')}</div>
    <div class="fd-chart" data-chart="pairs"></div>
    <div class="fd-line">Level ${L.level}: the first cut holds <b>${fpPct(tf, ta)}</b> of the ${fmt(ta)} pair births of the run.</div>`;
}
function fpCensusCard() {
  const el = $('cos-fp-census'); if (!el) return;
  if (!FP.R) { FP.census = null; el.innerHTML = '<div class="fd-ch"><h3>Who moves, who stays</h3></div><div class="fd-line">No census for this run.</div>'; return; }
  const F = FP.frames, C = S.classStats.tiers.screen.classes;
  const ser = [[1, 5], [3], [4, 2]].map((ks) => F.map((f) => ks.reduce((s, k) => s + f.counts_screen[k], 0)));
  const names = ['classes 1 + 5', 'class 3', 'classes 4 + 2'], cols = [fpCol(1), fpCol(3), fpCol(4)];
  FP.census = { ser, names, cols, W: 0 };
  const mv = (k) => { const v = C[String(k)].moved_fraction; return fpPct(v, 1, v < 0.01 ? 2 : 1); };
  el.innerHTML = `<div class="fd-ch"><h3>Who moves, who stays</h3></div>
    <div class="fd-key">${names.map((n, i) => `<span><i class="fd-dot" style="background:${cols[i]}"></i>${n}</span>`).join('')}</div>
    <div class="fd-chart" data-chart="census"></div>
    <div class="fd-line">Moved at least once: <b>${mv(1)}</b> of class 1, <b>${mv(4)}</b> of class 4, <b>${mv(3)}</b> of class 3.</div>
    <div class="fd-line" id="cos-fp-why"></div>`;
  fpWhy(); fpWatchCharts();
}
function fpWhy() {    // exact structure of the register rule on one carrier: /rl/TR/tr_exact.json (report TR.md)
  const el = $('cos-fp-why'), X = FP.tr, s = X && X.X1_superselection; if (!el) return;
  if (!s || !s.lasting_33_all_proposals_raise_cost) { el.innerHTML = ''; return; }
  el.innerHTML = `${chip('derived')} A lasting class-3 pair stays: on all ${fmt(X.lasting_placements.count)} placements each of the ${fmt(2 * X.source.seams)} unit twists raises the cost.`;
}
function fpBalanceCard() {
  const el = $('cos-fp-bal'), sel = fpSelected(), withEu = FP.lv.filter((l) => l.eu && l.eu.census), L = (sel && sel.eu && sel.eu.census ? sel : withEu[withEu.length - 1]) || sel || FP.lv[FP.lv.length - 1];
  if (!L) { el.innerHTML = '<div class="fd-ch"><h3>At the end of the run</h3></div>'; return; }
  const E = L.eu && L.eu.census, C = L.cls, al = (k) => C[String(k)].alive_at_end, G = E ? E.contents.slice(0, 5) : [];
  const find = (set) => E && E.contents.find((g) => g.set === set), g4 = find('{4,4,4}'), g2 = find('{2,2,2}');
  const sets = (str) => String(str).replace(/[{}\s]/g, '').split(',').map((x) => parseInt(x));
  const row = (mk, name, a, b) => `<div class="fd-brow"><span class="fd-mk">${mk}</span><span>${name}</span><b>${fmt(a)}</b><b>${fmt(b)}</b></div>`;
  const max = Math.max(1e-9, ...G.map((g) => g.share));
  el.innerHTML = `<div class="fd-ch"><h3>At the end of level ${L.level}</h3></div>
    <div class="fd-brow fd-bhead"><span></span><span>alive at the end</span><b>class</b><b>conjugate</b></div>
    ${row(marker(1, 12) + marker(5, 12), 'classes 1 and 5', al(1), al(5))}${row(marker(4, 12) + marker(2, 12), 'classes 4 and 2', al(4), al(2))}
    ${g4 && g2 ? row(marker(4, 10) + marker(4, 10) + marker(4, 10), 'carriers {4,4,4} and {2,2,2}', g4.carriers, g2.carriers) : ''}
    ${G.length ? `<div class="fd-brow fd-bhead fd-gap"><span></span><span>contents of one carrier</span><b></b><b>carriers</b></div>` : ''}
    ${G.map((g) => `<div class="fd-grp"><span class="fd-mk">${sets(g.set).map((k) => marker(k, 11)).join('')}</span><span class="fd-bar"><i style="width:${(100 * g.share / max).toFixed(1)}%"></i></span><b>${fmt(g.carriers)}</b><em>${fpPct(g.share, 1)}</em></div>`).join('')}
    ${E ? `<div class="fd-line">The classes of a carrier add to zero mod 6: <b>${fmt(E.not_neutral)}</b> exceptions among ${fmt(E.occupied_carriers)} occupied carriers.</div>` : ''}`;
}
function fpConfCard() {
  const el = $('cos-fp-conf'), pt = (lab) => FP.h4 && FP.h4.points && FP.h4.points.find((p) => p.label === lab), p3 = pt('Z3_carrier'), p2 = pt('Z2_carrier');
  const head = `<div class="fd-ch"><h3>Centre fields of the register</h3>${chip('declared')}</div>`;
  if (!p3 || !p2) { el.innerHTML = head + '<div class="fd-line">The file of the register ensemble is not served.</div>'; return; }
  const s3 = p3.sigma_from_creutz_R5to8, s2 = p2.sigma_from_creutz_R5to8, cols = [fpCol(4), fpCol(3)];
  el.innerHTML = `${head}
    <div class="fd-key"><span><i class="fd-dot" style="background:${cols[0]}"></i>colour centre, classes 2 and 4</span><span><i class="fd-dot" style="background:${cols[1]}"></i>weak centre, class 3</span></div>
    <div class="fd-chart" data-chart="conf"></div>
    <div class="fd-line">Colour centre: ${fpEsc(s3.law.split(' (')[0])} law${s3.sqrt_sigma ? `, √σ = <b>${s3.sqrt_sigma.toFixed(3)}</b> per cell` : ''}. Weak centre: ${fpEsc(s2.law.split(' (')[0])} law${s2.sqrt_sigma ? `, √σ = <b>${s2.sqrt_sigma.toFixed(3)}</b> per cell` : `, σ below ${fpSci(s2.sigma_upper_bound_2err)}`}.</div>`;
}
function fpTexts() {
  fpPairsCard(); fpBalanceCard(); fpConfCard(); fpWhy();
  const L = fpSelected() || FP.lv[FP.lv.length - 1]; if (L) fpTable(L);
  fpWatchCharts();
}
function fpTable(L) {         // the numbers behind the cards, row by row: [what, the run, status, source]
  const a = L.all, ta = fpSum(a), f = L.first || [0, 0, 0], tf = fpSum(f), C = L.cls, al = (k) => fmt(C[String(k)].alive_at_end), ch = L.ch, X = FP.tr, s = X && X.X1_superselection;
  const pt = (lab) => FP.h4 && FP.h4.points && FP.h4.points.find((p) => p.label === lab), p3 = pt('Z3_carrier'), p2 = pt('Z2_carrier'), p2p = pt('Z2_plaquette');
  const R = [
    ['Where they appear', `The first cut of level ${L.level} holds ${fmt(L.firstDefects)} defects on ${fmt(L.plaq)} plaquettes. The local clocks of that cut need not be equal.`, '', `run.json of level ${L.level}, cut at causal depth 1`],
    ['Preparation', `Every port starts with an independent load from 0 to 5. The register starts blank.`, 'declared', `run.json, preparation ${fpEsc(L.prep.name || '')}`],
    ['What comes first', `An accepted twist on two blank faces creates a conjugate pair. A current of one, two or three units gives classes 1 + 5, 4 + 2 or 3 + 3.`, '', 'view/class_stats.json, pair births'],
    ['In what proportion', `${PAIRS.map((P, j) => `${fpPct(a[j], ta)} ${P.name}`).join(', ')}, of ${fmt(ta)} pair births. On the first cut: ${PAIRS.map((P, j) => fpPct(f[j], tf)).join(', ')}.`, '', 'view/class_stats.json and run.json'],
    ['What happens next', `Classes 1 + 5: ${fmt(ch['1 + 5 -> 0'] || 0)} annihilations for ${fmt(a[0])} pair births. Classes 4 + 2 and 3 + 3: ${fmt(ch['2 + 4 -> 0'] || 0)} and ${fmt(ch['3 + 3 -> 0'] || 0)} annihilations. Most other endings are fusion, split or exchange.`, '', 'view/class_stats.json'],
    ['What is left', `Alive at the end: class 4 ${al(4)}, class 2 ${al(2)}, class 3 ${al(3)}, class 1 ${al(1)}, class 5 ${al(5)}. The end of the run cuts their lives short.`, '', 'view/class_stats.json'],
    ...(s && s.lasting_33_all_proposals_raise_cost ? [['Why class 3 stays', `Once the loads have settled, every unit twist on a lasting class-3 pair raises the cost, by at least ${s.min_rise_over_lasting_33} units, on all ${fmt(X.lasting_placements.count)} placements of one carrier. The rule applies none of them. A class-1 defect hops at zero cost. Exact for the register rule with its declared cost table.`, 'derived', 'rl/TR/tr_exact.json, report TR.md']] : []),
    ...(L.eu ? [
      ['Shares of the classes', `Of all defect identities: ${L.eu.shares.map((x) => `class ${x.class} ${(100 * x.run_share).toFixed(1)} %`).join(', ')}.`, '', 'view/early_universe.json'],
      ['Class conservation', `${L.eu.class_violations.length} of ${fmt(L.eu.channels)} reaction channels change the class modulo 6, over ${fmt(L.eu.channel_events)} events.`, '', 'view/early_universe.json'],
      ...(L.eu.census ? [['Contents of the carriers', `${fmt(L.eu.census.not_neutral)} of ${fmt(L.eu.census.occupied_carriers)} occupied carriers at the end hold classes that do not add to zero modulo 6. Commonest contents: ${L.eu.census.contents.slice(0, 5).map((c) => `${c.set} ${(100 * c.share).toFixed(1)} %`).join(', ')}. A carrier of fluxes only, such as {4,4,4} or {2,2,2}, is not a baryon.`, '', 'view/early_universe.json, carrier = face // 20']] : []),
      ...(L.eu.baryon_like ? [['Class and conjugate', `Carriers {4,4,4}: ${fmt(L.eu.baryon_like['444'])}. Carriers {2,2,2}: ${fmt(L.eu.baryon_like['222'])}. Alive at the end: classes 1 and 5 ${fmt(L.eu.alive_1_5.a)} and ${fmt(L.eu.alive_1_5.b)}, classes 4 and 2 ${fmt(L.eu.alive_4_2.a)} and ${fmt(L.eu.alive_4_2.b)}.`, '', 'view/early_universe.json']] : []),
    ] : []),
    ...(p3 && p2 ? [['Centre fields of the register', `A separate ensemble of the register with the plaquette weight, at the density of the run: the colour centre at κ = ${p3.kappa} follows the ${fpEsc(p3.sigma_from_creutz_R5to8.law.split(' (')[0])} law${p3.sigma_from_creutz_R5to8.sqrt_sigma ? ` with √σ = ${p3.sigma_from_creutz_R5to8.sqrt_sigma.toFixed(3)} per cell` : ''}, the weak centre at κ = ${p2.kappa} the ${fpEsc(p2.sigma_from_creutz_R5to8.law.split(' (')[0])} law.${p2p && p2p.sigma_from_creutz_R5to8.sqrt_sigma ? ` With the density counted per plaquette the weak centre is confined too, √σ = ${p2p.sigma_from_creutz_R5to8.sqrt_sigma.toFixed(3)}.` : ''} Lattice units of that ensemble.`, 'declared', 'rl/SIM/cf1/runs/H4_wilson_draws.json, report MA.md']] : []),
  ];
  $('cos-fp-table').innerHTML = '<tr><th></th><th>the run</th><th>source</th></tr>' +
    R.map((r) => `<tr><td><b>${r[0]}</b>${r[2] ? ' ' + chip(r[2]) : ''}</td><td>${r[1]}</td><td class="fd-src">${r[3]}</td></tr>`).join('');
}

// ---- page wiring --------------------------------------------------------------------------------------------------------
function fpSkeleton() {
  $('cos-first').innerHTML = `<div class="fd-head"><h2>First defects</h2><div class="fd-load" id="cos-fp-load"></div>
      <div class="fd-lead">The first cuts of the run: defects appear in pairs, everywhere on the screen at once. The map into this step reads ticks in the time direction as temperature.</div></div>
    <div class="fd-strip"><span>This run is the first few hundred ticks, each 10<sup>−43</sup> s. The electroweak crossover comes about 10<sup>32</sup> ticks later, the binding of quarks into hadrons about 10<sup>38</sup> ticks later. No run at the resolution of one cell reaches them. Lattice ensembles do.</span><button data-go="timeline">Timeline</button><button data-go="transitions">Phase transitions</button></div>
    <div class="fd-grid">
      <section class="card fd-run">
        <div class="fd-ch"><h3>The screen, cut by cut</h3><span class="fd-runlab" id="cos-fp-runlab"></span></div>
        <div class="fd-disc"><canvas id="cos-fp-oph" width="640" height="640"></canvas><div class="fd-wait" id="cos-fp-wait"></div></div>
        <div class="fd-ctl"><button id="cos-fp-play">▶ play</button><input type="range" id="cos-fp-slice" min="0" max="1" value="1" step="1" aria-label="stored cut of the run"><span class="fd-count" id="cos-fp-count"></span></div>
        <div class="fd-read" id="cos-fp-read"></div>
      </section>
      <section class="card fd-card" id="cos-fp-pairs"><div class="fd-ch"><h3>Pair births</h3></div></section>
      <section class="card fd-card" id="cos-fp-census"><div class="fd-ch"><h3>Who moves, who stays</h3></div></section>
      <section class="card fd-card" id="cos-fp-bal"><div class="fd-ch"><h3>At the end of the run</h3></div></section>
      <section class="card fd-card" id="cos-fp-conf"><div class="fd-ch"><h3>Centre fields of the register</h3></div></section>
    </div>
    <details class="bz fd-rows"><summary>the numbers, row by row</summary><div class="fd-tablebox"><table class="t" id="cos-fp-table"></table></div></details>
    <div class="cos-fp-tip" id="cos-fp-tip"></div>`;
}
function fpPlay(on) { FP.playing = on; $('cos-fp-play').textContent = on ? '❚❚ pause' : '▶ play'; }
function fpTipAt(e) {
  const tip = $('cos-fp-tip'), hov = e.target.closest && e.target.closest('#cos-fp-hov'), hl = $('cos-fp-hl');
  if (hov && FP.census && FP.cx) {
    const box = hov.ownerSVGElement.getBoundingClientRect(), px = (e.clientX - box.left) / box.width * FP.census.W;
    let best = 0; FP.T.forEach((T, i) => { if (Math.abs(FP.cx(T) - px) < Math.abs(FP.cx(FP.T[best]) - px)) best = i; });
    tip.textContent = `causal depth ${fmt(FP.T[best])}${best === FP.T.length - 1 ? ', end of the run' : ''}: ` + FP.census.names.map((n, i) => `${fmt(FP.census.ser[i][best])} ${n}`).join(', ');
    if (hl) { const x = FP.cx(FP.T[best]).toFixed(1); hl.setAttribute('x1', x); hl.setAttribute('x2', x); hl.setAttribute('visibility', 'visible'); }
  } else {
    if (hl) hl.setAttribute('visibility', 'hidden');
    const t = e.target.closest && e.target.closest('[data-tip]'); if (!t) { tip.style.display = 'none'; return; }
    tip.textContent = t.dataset.tip;
  }
  tip.style.display = 'block'; tip.style.left = Math.max(8, Math.min(window.innerWidth - 340, e.clientX + 14)) + 'px'; tip.style.top = (e.clientY + 16) + 'px';
}
function fpWire() {
  $('cos-fp-slice').oninput = (e) => { fpPlay(false); fpSetSlice(parseInt(e.target.value)); };
  $('cos-fp-play').onclick = () => { if (!FP.R) return; if (!FP.playing && FP.k >= FP.T.length - 1) fpSetSlice(0); fpPlay(!FP.playing); };
  const root = $('cos-first'), tip = $('cos-fp-tip');
  root.addEventListener('pointermove', fpTipAt);
  root.addEventListener('pointerleave', () => { tip.style.display = 'none'; });
  root.addEventListener('focusin', (e) => { const t = e.target.closest('[data-tip]'); if (!t) return; const b = t.getBoundingClientRect(); tip.textContent = t.dataset.tip; tip.style.display = 'block'; tip.style.left = Math.max(8, Math.min(window.innerWidth - 340, b.right + 8)) + 'px'; tip.style.top = (b.bottom + 6) + 'px'; });
  root.addEventListener('focusout', () => { tip.style.display = 'none'; });
  root.querySelectorAll('[data-go]').forEach((b) => { b.onclick = () => import('./app.js').then((m) => m.showPage(b.dataset.go)); });
  new IntersectionObserver((es) => { for (const en of es) { FP.seen = en.isIntersecting; if (FP.seen) FP.dirty = true; } }).observe(root.querySelector('.fd-run'));
}
function fpSync() { if (S.frames && S.frames.length && S.cat && S.classStats && S.meta && S.frames !== FP.frames) fpBuildRun(); }
function fpLoop(now) {
  requestAnimationFrame(fpLoop);
  if (!$('page-cosmos').classList.contains('on')) return;
  fpSync();
  if (FP.playing && !FP.loading && FP.R && now - FP.last > (FP.k < 12 ? 480 : 110)) { FP.last = now; if (FP.k < FP.T.length - 1) fpSetSlice(FP.k + 1); else fpPlay(false); }
  if (!FP.seen) return;
  if (fpFit() || FP.dirty || now - FP.t0 < 1300) { fpDrawOPH(now); FP.dirty = false; }
}
export function cosmosShown() {
  if (!$('cos-first')) return;
  if (!FP.on) {
    FP.on = true; fpSkeleton(); fpWire();
    const q = new URLSearchParams(location.search);
    if (q.has('cosslice')) FP.k = Math.max(0, parseInt(q.get('cosslice')) || 0);
    fpFit(); fpDrawOPH(performance.now());          // the empty disc at once
    fpLoad().then(fpTexts).catch((e) => { $('cos-fp-read').innerHTML = `<div class="fd-now"><span>The runs could not be read: ${fpEsc(e.message)}</span></div>`; });
    requestAnimationFrame(fpLoop);
  }
  fpSync(); FP.dirty = true;
}
window.__firstParticles = FP;

// ---- not on the page ----------------------------------------------------------------------------------------------------
// The schematic thermal history after reheating (textbook stages, drawn beside the run until 2026-11-11) is standard
// physics that the model does not compute, so the page no longer shows it. electroweak_audit_check.mjs reads the text
// of the two functions below and checks the one audited property of that drawing (no instantaneous W and Higgs decay
// at the crossover). Nothing below is called. Delete this block together with electroweak_audit_check.mjs.
const FP_STAGES = Array(7).fill(null);
const FP_KIND = {   // colour, name, marker type: f fermion (ring for the antiparticle), b boson, p photon, n nucleus, a atom
  qL: ['#ff7a45', 'left-handed quarks and antiquarks', 'f'], qR: ['#ffb347', 'right-handed quarks and antiquarks', 'f'], lep: ['#3ee6a8', 'leptons and antileptons', 'f'],
  g: ['#ff5fb0', 'gluons', 'b'], W: ['#b197ff', 'electroweak gauge fields', 'b'], H: ['#f4ead0', 'Higgs', 'b'], gam: ['#dfe9ff', 'photons', 'p'],
  nu: ['#4cc3ff', 'neutrinos, streaming freely', 'f'], e: ['#3ee6a8', 'electrons and positrons', 'f'], N: ['#ff9a6b', 'protons and neutrons', 'n'],
  p: ['#ff9a6b', 'protons and neutrons', 'n'], He: ['#ffe45c', 'helium-4 nuclei', 'n'], Ha: ['#ff9a6b', 'hydrogen atoms', 'a'], Hea: ['#ffe45c', 'helium atoms', 'a'],
};
function fpStdBuild() {             // fixed random places in the disc; the kind of each marker in each of the seven stages
  const N = 2200, P = [], shares = hotWeights('number'), tot = shares.reduce((sum, [, n]) => sum + n, 0);
  const h = (i, s) => fpHash(i * 7919 + s * 104729 + 17) / 4294967296;
  let nN = 0;                       // nucleons in index order: every 13th becomes a helium-4 nucleus, about 0.08 of the nuclei
  for (let i = 0; i < N; i++) {
    const rr = Math.sqrt(h(i, 1)), a = 2 * Math.PI * h(i, 2), anti = h(i, 4) < 0.5, w = h(i, 5), w2 = h(i, 6), w3 = h(i, 7), ks = [];
    let u = h(i, 3) * tot, k = 'H'; for (const [kk, sh] of shares) { if (u < sh) { k = kk; break; } u -= sh; }
    for (let s = 0; s < FP_STAGES.length; s++) {
      // No instantaneous W/H-to-photon conversion at the crossover.
      // Their later removal is a schematic low-temperature display choice, not a decay calculation.
      if (s === 2 && (k === 'W' || k === 'H')) k = 'gam';
      if (s === 2 && (k === 'qL' || k === 'qR' || k === 'g')) k = w < 0.025 ? 'N' : 'gam';
      if (s === 3 && k === 'lep') k = w2 < 0.5 ? 'nu' : 'e';
      if (s === 4 && k === 'e') k = !anti && w3 < 0.5 ? 'e' : 'gam';
      if (s === 5 && k === 'N') k = nN++ % 13 === 6 ? 'He' : 'p';
      if (s === 6) k = k === 'p' ? 'Ha' : k === 'He' ? 'Hea' : k === 'e' ? null : k;
      ks.push(k);
    }
    P.push({ x: rr * Math.cos(a), y: rr * Math.sin(a), anti, ks, ph: 2 * Math.PI * h(i, 8), om: 0.6 + 1.2 * h(i, 9) });
  }
  FP.std = P;
}
function fpDrawStd(now) {
  const cv = $('cos-fp-std'); if (!cv || !FP.std) return;
  const g = cv.getContext('2d'), W = cv.width, C = W / 2, rad = W / 2 - 16, t = now / 1000, s = FP.stage, groups = new Map();
  fpDisc(g, W, C, rad);
  const at = (P) => [C + rad * (P.x + 0.006 * Math.sin(t * P.om + P.ph)), C - rad * (P.y + 0.006 * Math.cos(t * P.om * 1.3 + P.ph))];
  FP.std.forEach((P, j) => { const k = P.ks[s]; if (!k) return; const key = k + (P.anti && FP_KIND[k][2] === 'f' && !(s >= 4 && k === 'e') ? '~' : ''); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(j); });
  for (const key of [...groups.keys()].sort((a, b) => (FP_KIND[a.replace('~', '')][2] === 'p' ? -1 : 0) - (FP_KIND[b.replace('~', '')][2] === 'p' ? -1 : 0))) {
    const k = key.replace('~', ''), anti = key.endsWith('~'), [col, , type] = FP_KIND[k], js = groups.get(key);
    const r = type === 'p' ? 1.2 : type === 'b' ? 1.8 : type === 'n' || type === 'a' ? (k === 'He' || k === 'Hea' ? 4.4 : 3.2) : 2.5;
    g.globalAlpha = k === 'nu' ? 0.45 : type === 'p' ? 0.55 : 0.92; g.beginPath();
    for (const j of js) { const [x, y] = at(FP.std[j]); g.moveTo(x + r, y); g.arc(x, y, r, 0, 2 * Math.PI); }
    if (anti) { g.strokeStyle = col; g.lineWidth = 1.2; g.stroke(); } else { g.fillStyle = col; g.fill(); }
    if (type === 'a') { g.globalAlpha = 0.35; g.beginPath(); for (const j of js) { const [x, y] = at(FP.std[j]); g.moveTo(x + r + 3, y); g.arc(x, y, r + 3, 0, 2 * Math.PI); } g.strokeStyle = '#dfe9ff'; g.lineWidth = 1; g.stroke(); }
  }
  g.globalAlpha = 1;
  const fl = FP.flash; if (fl && now - fl.t0 < 1100) {
    const f = 1 - (now - fl.t0) / 1100; g.strokeStyle = `rgba(255,255,255,${(0.8 * f).toFixed(3)})`; g.lineWidth = 1.2; g.beginPath();
    for (const j of fl.list) { const [x, y] = at(FP.std[j]), rr = 3 + 8 * (1 - f); g.moveTo(x + rr, y); g.arc(x, y, rr, 0, 2 * Math.PI); }
    g.stroke();
  }
}
