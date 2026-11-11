// The Phase transitions page: the electroweak crossover, colour deconfinement and the binding of quarks into
// hadrons, as three replicated lattice measurements. Everything drawn is read from three files written by the
// research lanes EW, QCD and HAD (schemas in their briefs): /rl/EW/ew_transition.json, /rl/QCD/colour_transition.json
// and /rl/HAD/hadrons.json. A part is drawn only when its field exists; otherwise its frame shows the progress of the lane's run.
// A file with placeholder === true is marked as such on every panel that draws from it.
// The plots are this file's own SVG and canvas code (no chart library). The top of the file is pure (data in, markup
// out) and runs in node (epochs_check.mjs); the page itself starts at "the page".
import { FILES, loadJson, sci, num, fmtTime, fmtTicks, sup, TICK_S, E_CELL, radiationTime } from './timeline.js';

export const HAD_FILE = 'rl/HAD/hadrons.json';

// ---------------------------------------------------------------- small tools
export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const arr = (a) => (Array.isArray(a) ? a : []);
const nums = (a) => Array.isArray(a) && a.length > 0 && a.every(fin);
const f1 = (x) => (Math.round(x * 10) / 10).toFixed(1);
const plain = (x, sig = 6) => (fin(x) ? String(Number(x.toPrecision(sig))) : String(x ?? ''));
const INK = { text: '#eef2fb', soft: '#c5d0e6', muted: '#93a3c0', violet: '#a995ff', amber: '#ffb44a', teal: '#3fe0d0', rose: '#ff6480', blue: '#6fb1ff', green: '#5fe3a1', surface: '#070b14' };
// one hue per panel, light steps for the lattice volumes (the largest volume is the brightest)
const RAMP = { teal: ['#1f8f86', '#2fb9ac', '#3fe0d0', '#b4f5ee'], amber: ['#9c6a22', '#d18f33', '#ffb44a', '#ffe0b0'] };
const HADRON = { pion: [INK.blue, 'pion', 'π'], rho: [INK.amber, 'rho', 'ρ'], nucleon: [INK.rose, 'nucleon', 'N'] };
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export function ramp(name, n) {
  const r = RAMP[name] || RAMP.teal;
  if (n <= 3) return r.slice(3 - Math.max(n, 1), 3);
  if (n === 4) return r.slice();
  return Array.from({ length: n }, (_, i) => {
    const u = i / (n - 1) * 3, k = Math.min(2, Math.floor(u)), f = u - k, a = hex(r[k]), b = hex(r[k + 1]);
    return '#' + a.map((v, j) => Math.round(v + (b[j] - v) * f).toString(16).padStart(2, '0')).join('');
  });
}
export function niceTicks(lo, hi, target = 5) {
  if (!(hi > lo)) return { ticks: [lo], step: 1 };
  const raw = (hi - lo) / target, p = 10 ** Math.floor(Math.log10(raw)), m = raw / p;
  const step = (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p, out = [];
  for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + step * 1e-9; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  return { ticks: out, step };
}
const tickText = (v, step) => { const d = Math.max(0, Math.min(6, -Math.floor(Math.log10(step) + 1e-9))); return v.toFixed(d).replace(/^-0(\.0+)?$/, '0'); };
export function pm(v, e) {                                      // value ± error with the digits the error supports
  if (!fin(v)) return '–';
  if (!fin(e) || e <= 0) return plain(v, 4);
  const d = Math.max(0, Math.min(6, 1 - Math.floor(Math.log10(e))));
  return `${v.toFixed(d)} ± ${e.toFixed(d)}`;
}
const cube = (n) => `${n}${sup(3)}`;
const px = (v) => (Math.round(v * 10) / 10);
const WAIT = '<div class="ep-wait"></div>';                     // the page mounts the lane's progress bar in it
const NC = (s) => `<span class="ep-nc">${s}</span>`;             // keeps units and symbols out of the capitals of a title
// names written in plain characters by the research lanes, set as symbols: m_N/m_rho, sin^2 theta_W(m_Z), 1/alpha_2
export function pretty(name) {
  let s = esc(name);
  for (const [a, b] of [['alpha', 'α'], ['theta', 'θ'], ['sigma', 'σ'], ['lambda', 'λ'], ['Lambda', 'Λ'], ['beta', 'β'], ['kappa', 'κ'], ['rho', 'ρ'], ['pi', 'π'], ['tau', 'τ']]) s = s.replace(new RegExp('(^|[^A-Za-z])' + a + '(?![A-Za-z])', 'g'), '$1' + b);
  s = s.replace(/sqrt\(([^()]*)\)/g, '√$1').replace(/\^2/g, '²').replace(/\^\((\d)\)/g, '<sup>($1)</sup>');
  return s.replace(/_\{?([A-Za-z0-9ρπσ]+)\}?/g, '<sub>$1</sub>');
}
const pairs = (x, y, e) => {                                    // the finite points of a series; null entries are dropped
  const o = { x: [], y: [], e: [] };
  for (let i = 0; i < Math.min(arr(x).length, arr(y).length); i++) if (fin(x[i]) && fin(y[i])) { o.x.push(x[i]); o.y.push(y[i]); o.e.push(Array.isArray(e) && fin(e[i]) ? e[i] : 0); }
  if (!Array.isArray(e)) o.e = null;
  return o;
};
const interp = (xs, ys, x) => {                                 // linear between samples, flat outside
  if (!xs.length) return NaN;
  if (x <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) if (x <= xs[i]) return ys[i - 1] + (x - xs[i - 1]) / (xs[i] - xs[i - 1] || 1) * (ys[i] - ys[i - 1]);
  return ys[ys.length - 1];
};

// ---------------------------------------------------------------- plots (each returns { svg, model })
// Stacked panels on one shared x axis. cfg = { xLabel, domain, above, heights, marks: [{ x, err, label, color, side }],
// panels: [{ label, zero, bands: [{ y, err, color, label }], series: [{ name, color, x, y, e, points, line }] }] }
export function scanPlot(W, cfg) {
  const panels = arr(cfg.panels).filter((p) => arr(p.series).some((s) => nums(s.x) && nums(s.y)));
  if (!panels.length || !(W > 120)) return { svg: '', model: null };
  const mL = 44, mR = 12, mT = 4 + (cfg.above || 0), mB = 34, capH = 19, gap = 8, hs = panels.map((p, i) => (cfg.heights && cfg.heights[i]) || (i ? 140 : 180)), x0 = mL, x1 = W - mR;
  let lo = Infinity, hi = -Infinity;
  for (const p of panels) for (const s of p.series) if (nums(s.x)) for (const v of s.x) { if (v < lo) lo = v; if (v > hi) hi = v; }
  if (cfg.domain) { lo = Math.min(lo, cfg.domain[0]); hi = Math.max(hi, cfg.domain[1]); }
  const sx = (v) => x0 + (v - lo) / (hi - lo || 1) * (x1 - x0), xt = niceTicks(lo, hi, Math.max(3, Math.round((x1 - x0) / 90)));
  // flags of the marked positions sit in their own rows above the panels, so no label covers a curve
  const brief = (t) => (W < 480 ? String(t).replace('published lattice value', 'published').replace('Standard Model lattice', 'Standard Model') : String(t));
  const marks = arr(cfg.marks).filter((m) => fin(m.x) && m.x >= lo && m.x <= hi).map((m) => { const label = brief(m.label || ''); return { ...m, label, X: sx(m.x), w: label.length * 6.1 + 18 }; });
  const taken = [];
  for (const m of marks) {                                      // beside its line where it fits, else in a row of its own, kept inside the plot
    const fits = (side, row) => { const a = side > 0 ? m.X + 4 : m.X - 4 - m.w, b = a + m.w; return a >= 0 && b <= W && !taken.some((t) => t.row === row && a < t.b + 8 && b > t.a - 8); };
    const pref = m.side === 'left' ? -1 : 1, tries = [[pref, 0], [-pref, 0], [pref, 1], [-pref, 1]], hit = tries.find(([s, r]) => fits(s, r));
    m.dir = hit ? hit[0] : pref; m.row = hit ? hit[1] : (taken.length ? Math.max(...taken.map((t) => t.row)) + 1 : 0);
    m.a = Math.max(0, Math.min(W - m.w, m.dir > 0 ? m.X + 4 : m.X - 4 - m.w)); taken.push({ row: m.row, a: m.a, b: m.a + m.w });
  }
  const flagH = marks.length ? 16 * (1 + Math.max(...marks.map((m) => m.row))) : 0;
  const H = mT + flagH + hs.reduce((a, b) => a + b + capH, 0) + gap * (panels.length - 1) + mB;
  let out = '', top = mT + flagH;
  const model = { kind: 'x', W, H, x0, x1, lo, hi, xLabel: cfg.xLabel || '', panels: [] };
  panels.forEach((p, pi) => {
    const h = hs[pi], y0 = top + capH, yb = y0 + h; let ylo = Infinity, yhi = -Infinity;
    for (const s of p.series) if (nums(s.y)) s.y.forEach((v, i) => { const e = nums(s.e) && fin(s.e[i]) ? s.e[i] : 0; if (v - e < ylo) ylo = v - e; if (v + e > yhi) yhi = v + e; });
    for (const b of arr(p.bands)) if (fin(b.y)) { ylo = Math.min(ylo, b.y - (b.err || 0)); yhi = Math.max(yhi, b.y + (b.err || 0)); }
    if (p.zero) ylo = Math.min(0, ylo);
    const pad = (yhi - ylo || 1) * 0.08; yhi += pad; if (!p.zero || ylo < 0) ylo -= pad;
    const yt = niceTicks(ylo, yhi, 4), sy = (v) => yb - (v - ylo) / (yhi - ylo) * h;
    for (const v of yt.ticks) out += `<line class="ep-grid-l" x1="${x0}" x2="${x1}" y1="${px(sy(v))}" y2="${px(sy(v))}"/><text class="ep-ax" x="${x0 - 7}" y="${px(sy(v) + 3.5)}" text-anchor="end">${tickText(v, yt.step)}</text>`;
    for (const b of arr(p.bands)) if (fin(b.y)) {               // a fitted value as a level across the panel
      if (b.err > 0) out += `<rect x="${x0}" y="${px(sy(b.y + b.err))}" width="${x1 - x0}" height="${px(Math.max(1, sy(b.y - b.err) - sy(b.y + b.err)))}" fill="${b.color}" opacity=".16"/>`;
      out += `<line x1="${x0}" x2="${x1}" y1="${px(sy(b.y))}" y2="${px(sy(b.y))}" stroke="${b.color}" stroke-width="1" opacity=".75"/>`;
      if (b.label) out += `<text class="ep-mark" x="${x1 - 4}" y="${px(sy(b.y + (b.err || 0)) - 4)}" text-anchor="end">${esc(b.label)}</text>`;
    }
    const mp = { label: p.label, top: y0, bottom: yb, series: [] };
    p.series.forEach((s, si) => {
      if (!nums(s.x) || !nums(s.y)) return;
      const n = Math.min(s.x.length, s.y.length), last = si === p.series.length - 1, E = nums(s.e) ? s.e : null;
      if (s.points) {
        let g = '';
        for (let i = 0; i < n; i++) {
          const X = px(sx(s.x[i])), Y = px(sy(s.y[i]));
          if (E && E[i] > 0) g += `<line x1="${X}" x2="${X}" y1="${px(sy(s.y[i] - E[i]))}" y2="${px(sy(s.y[i] + E[i]))}" stroke="${s.color}" stroke-width="1.3" opacity=".8"/>`;
          g += `<circle cx="${X}" cy="${Y}" r="3.6" fill="${s.color}" stroke="${INK.surface}" stroke-width="1.6"/>`;
        }
        if (s.line) { let d = ''; for (let i = 0; i < n; i++) d += `${i ? 'L' : 'M'}${px(sx(s.x[i]))} ${px(sy(s.y[i]))}`; out += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="1.2" opacity=".45"/>`; }
        out += g;
      } else {
        if (E) {
          let up = '', dn = '';
          for (let i = 0; i < n; i++) { up += `${i ? 'L' : 'M'}${px(sx(s.x[i]))} ${px(sy(s.y[i] + E[i]))}`; dn = `L${px(sx(s.x[i]))} ${px(sy(s.y[i] - E[i]))}` + dn; }
          out += `<path d="${up}${dn}Z" fill="${s.color}" opacity=".13"/>`;
        }
        let d = ''; for (let i = 0; i < n; i++) d += `${i ? 'L' : 'M'}${px(sx(s.x[i]))} ${px(sy(s.y[i]))}`;
        out += `<path class="ep-line${s.thin ? ' ep-thin' : s.lead || (last && s.lead !== false) ? ' ep-lead' : ''}" d="${d}" stroke="${s.color}" style="--g:${s.color}"/>`;
      }
      mp.series.push({ name: s.name, color: s.color, x: s.x.slice(0, n), y: s.y.slice(0, n), e: E, quiet: !!s.quiet, px: Array.from({ length: n }, (_, i) => sx(s.x[i])), py: Array.from({ length: n }, (_, i) => sy(s.y[i])) });
    });
    out += `<text class="ep-cap" x="${x0}" y="${top + 12}">${esc(p.label || '')}</text>`;
    const named = p.series.filter((s) => s.name && !s.quiet);
    if (pi === 0 && named.length > 1) {                        // legend: keys in the series colour, names in text ink
      let lx = x1;
      [...named].reverse().forEach((s) => {
        const w = String(s.name).length * 6.4 + 26; lx -= w;
        out += (s.points ? `<circle cx="${px(lx + 13)}" cy="${top + 8.5}" r="3.6" fill="${s.color}"/>` : `<line x1="${px(lx + 6)}" x2="${px(lx + 20)}" y1="${top + 8.5}" y2="${top + 8.5}" stroke="${s.color}" stroke-width="2.4" stroke-linecap="round"/>`) + `<text class="ep-leg" x="${px(lx + 25)}" y="${top + 12}">${esc(s.name)}</text>`;
      });
    }
    model.panels.push(mp); top = yb + gap;
  });
  const yEnd = top - gap;
  for (const v of xt.ticks) out += `<line class="ep-base" x1="${px(sx(v))}" x2="${px(sx(v))}" y1="${yEnd}" y2="${yEnd + 4}"/><text class="ep-ax" x="${px(sx(v))}" y="${yEnd + 17}" text-anchor="middle">${tickText(v, xt.step)}</text>`;
  out += `<text class="ep-axt" x="${x1}" y="${yEnd + 32}" text-anchor="end">${esc(cfg.xLabel || '')}</text>`;
  let flags = '';
  for (const m of marks) {
    const c = m.color || '#fff', fy = mT + 16 * m.row;
    if (fin(m.err) && m.err > 0) flags += `<rect x="${px(sx(Math.max(lo, m.x - m.err)))}" y="${mT + flagH}" width="${px(Math.max(1, sx(Math.min(hi, m.x + m.err)) - sx(Math.max(lo, m.x - m.err))))}" height="${yEnd - mT - flagH}" fill="${c}" opacity=".07"/>`;
    flags += `<line x1="${px(m.X)}" x2="${px(m.X)}" y1="${fy + 2}" y2="${yEnd}" stroke="${c}" stroke-width="1" opacity=".6"/><circle cx="${px(m.X)}" cy="${fy + 3}" r="2.5" fill="${c}"/>`;
    flags += `<text class="ep-mark" x="${px(m.a + (m.dir > 0 ? 6 : m.w - 6))}" y="${fy + 7}" text-anchor="${m.dir > 0 ? 'start' : 'end'}">${esc(m.label || '')}</text>`;
  }
  const hov = `<line class="ep-cross" x1="0" x2="0" y1="${mT + flagH}" y2="${yEnd}"/>` + model.panels.map((p, pi) => p.series.map((s, si) => `<circle class="ep-hdot" data-p="${pi}" data-s="${si}" r="4" fill="${s.color}"/>`).join('')).join('');
  model.sx = sx; model.yTop = mT + flagH; model.yEnd = yEnd;
  return { svg: `<svg class="ep-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">${out}${flags}${hov}${cfg.extra ? cfg.extra(model) : ''}</svg>`, model };
}

// A histogram. bins: edges (one more than counts) or centres (as many as counts).
export function histPlot(W, H, cfg) {
  const c = cfg.counts, b = cfg.bins;
  if (!nums(c) || !nums(b) || !(W > 80)) return { svg: '', model: null };
  const n = c.length, edges = b.length === n + 1 ? b : (() => { const w = b.length > 1 ? b[1] - b[0] : 1; return [...b.map((v) => v - w / 2), b[b.length - 1] + w / 2]; })();
  if (edges.length !== n + 1) return { svg: '', model: null };
  const mL = 10, mR = 10, mT = 8, mB = 30, x0 = mL, x1 = W - mR, yb = H - mB, lo = edges[0], hi = edges[n], max = Math.max(...c) || 1;
  const sx = (v) => x0 + (v - lo) / (hi - lo || 1) * (x1 - x0), sy = (v) => yb - v / max * (yb - mT);
  const xt = niceTicks(lo, hi, Math.max(2, Math.round((x1 - x0) / 80)));
  let out = `<line class="ep-base" x1="${x0}" x2="${x1}" y1="${yb}" y2="${yb}"/>`;
  for (let i = 0; i < n; i++) {
    const a = sx(edges[i]), z = sx(edges[i + 1]), w = z - a, g = Math.min(2, w * 0.3), bw = Math.max(0.6, w - g), X = a + g / 2, Y = sy(c[i]), r = Math.min(2, bw / 2, (yb - Y) / 2);
    if (c[i] > 0) out += `<path d="M${px(X)} ${yb}V${px(Y + r)}Q${px(X)} ${px(Y)} ${px(X + r)} ${px(Y)}H${px(X + bw - r)}Q${px(X + bw)} ${px(Y)} ${px(X + bw)} ${px(Y + r)}V${yb}Z" fill="${cfg.color}" opacity=".9"/>`;
    out += `<rect class="ep-hit" x="${px(a)}" y="${mT}" width="${px(w)}" height="${yb - mT}" data-tip="${esc(`${plain(edges[i], 3)} to ${plain(edges[i + 1], 3)}: ${Number.isInteger(c[i]) ? c[i].toLocaleString('en-US') + ' configurations' : 'share ' + plain(c[i], 3)}`)}"/>`;
  }
  for (const v of xt.ticks) { const X = sx(v); out += `<text class="ep-ax" x="${px(X)}" y="${yb + 14}" text-anchor="${X < 16 ? 'start' : X > W - 16 ? 'end' : 'middle'}">${tickText(v, xt.step)}</text>`; }
  out += `<text class="ep-axt" x="${x1}" y="${yb + 27}" text-anchor="end">${esc(cfg.xLabel || '')}</text>`;
  return { svg: `<svg class="ep-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">${out}</svg>`, model: null };
}

// The complex Polyakov loop: one dot per configuration, with the three directions of the colour centre.
export function scatterPlot(W, cfg) {
  if (!nums(cfg.re) || !nums(cfg.im) || !(W > 80)) return { svg: '', model: null };
  const H = cfg.H || Math.min(W, 260), cx = W / 2, cy = H / 2, R = cfg.R || 1, k = (Math.min(W, H) / 2 - 16) / R, n = Math.min(cfg.re.length, cfg.im.length);
  let out = '';
  for (const f of [0.5, 1]) out += `<circle class="ep-ring" cx="${cx}" cy="${cy}" r="${px(f * R * k)}"/>`;
  for (let j = 0; j < 3; j++) { const a = j * 2 * Math.PI / 3; out += `<line class="ep-ray" x1="${cx}" y1="${cy}" x2="${px(cx + R * k * Math.cos(a))}" y2="${px(cy - R * k * Math.sin(a))}"/>`; }
  let pts = ''; for (let i = 0; i < n; i++) pts += `<circle cx="${px(cx + cfg.re[i] * k)}" cy="${px(cy - cfg.im[i] * k)}" r="1.5"/>`;
  out += `<g fill="${cfg.color}" opacity=".62">${pts}</g>`;
  out += `<text class="ep-cap" x="4" y="14">${esc(cfg.label || '')}</text><text class="ep-ax" x="${W - 4}" y="${H - 5}" text-anchor="end">outer ring |L| = ${plain(R, 2)}</text>`;
  return { svg: `<svg class="ep-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">${out}</svg>`, model: null };
}

// Values with errors on one number line. cfg = { unit, items: [{ v, e, color, ring, up, label }] }
export function compareStrip(W, cfg) {
  const items = arr(cfg.items).filter((i) => i && fin(i.v));
  if (!items.length || !(W > 120)) return { svg: '', model: null };
  const H = 78, mL = 12, mR = 12, y = 40, vs = [];
  for (const i of items) vs.push(i.v - 3 * (i.e || 0), i.v + 3 * (i.e || 0));
  for (const r of arr(cfg.ranges)) if (fin(r.lo) && fin(r.hi)) vs.push(r.lo, r.hi);
  let lo = Math.min(...vs), hi = Math.max(...vs); if (!(hi > lo)) { lo -= Math.abs(lo) * 0.05 || 1; hi += Math.abs(hi) * 0.05 || 1; }
  const padv = (hi - lo) * 0.14; lo -= padv; hi += padv;
  const sx = (v) => mL + (v - lo) / (hi - lo) * (W - mL - mR), t = niceTicks(lo, hi, Math.max(3, Math.round(W / 80)));
  let out = `<line class="ep-base" x1="${mL}" x2="${W - mR}" y1="${y}" y2="${y}"/>`;
  for (const v of t.ticks) out += `<line class="ep-base" x1="${px(sx(v))}" x2="${px(sx(v))}" y1="${y - 3}" y2="${y + 3}"/><text class="ep-ax" x="${px(sx(v))}" y="${H - 4}" text-anchor="middle">${tickText(v, t.step)}</text>`;
  for (const r of arr(cfg.ranges)) if (fin(r.lo) && fin(r.hi)) out += `<line x1="${px(sx(r.lo))}" x2="${px(sx(r.hi))}" y1="${y + 13}" y2="${y + 13}" stroke="${r.color}" stroke-width="6" stroke-linecap="round" opacity=".3"/><rect class="ep-hit" x="${px(sx(r.lo))}" y="${y + 3}" width="${px(Math.max(4, sx(r.hi) - sx(r.lo)))}" height="20" data-tip="${esc(`${r.label}: ${plain(r.lo, 4)} to ${plain(r.hi, 4)}`)}"/>`;
  for (const it of items) {
    const Y = y + (it.up ? -13 : 13), X = sx(it.v), e = it.e || 0, tip = esc(`${it.label}: ${pm(it.v, it.e)}${cfg.unit ? ' ' + cfg.unit : ''}`);
    if (e) out += `<line x1="${px(sx(it.v - e))}" x2="${px(sx(it.v + e))}" y1="${Y}" y2="${Y}" stroke="${it.color}" stroke-width="2" stroke-linecap="round" opacity=".85"/>`;
    out += it.ring ? `<circle cx="${px(X)}" cy="${Y}" r="4.5" fill="${INK.surface}" stroke="${it.color}" stroke-width="2"/>` : `<circle cx="${px(X)}" cy="${Y}" r="5" fill="${it.color}" stroke="${INK.surface}" stroke-width="2"/>`;
    out += `<rect class="ep-hit" x="${px(X - 14)}" y="${Y - 12}" width="28" height="24" data-tip="${tip}"/>`;
  }
  return { svg: `<svg class="ep-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">${out}</svg>`, model: null };
}

// The phase diagram of the electroweak theory along the Higgs mass: a first-order line, its endpoint, a crossover
// beyond it. The horizontal positions are data. The vertical direction only separates the two phases.
export function phasePlot(W, cfg) {
  const items = arr(cfg.items).filter((it) => fin(it.m));
  if (!items.length || !(W > 160)) return { svg: '', model: null };
  const ln = cfg.line;
  if (ln && nums(ln.m) && nums(ln.T) && ln.m.length === ln.T.length && ln.m.length > 1) return phasePlane(W, cfg, items, ln);
  const H = 206, mL = 14, mR = 14, lead = 26, yT = lead + 64, yA = H - 36, end = fin(cfg.endpoint) ? cfg.endpoint : null;
  const hi = Math.ceil((Math.max(...items.map((i) => i.m), end || 0) + 14) / 20) * 20, lo = 0;
  const sx = (v) => mL + (v - lo) / (hi - lo) * (W - mL - mR), xe = end !== null ? sx(end) : sx(lo), xR = W - mR;
  let out = `<defs><linearGradient id="epPhMix" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${INK.violet}" stop-opacity=".12"/><stop offset="1" stop-color="${INK.teal}" stop-opacity=".12"/></linearGradient></defs>`;
  out += `<rect x="${mL}" y="${lead}" width="${px(xe - mL)}" height="${yT - lead}" fill="${INK.violet}" opacity=".12"/><rect x="${mL}" y="${yT}" width="${px(xe - mL)}" height="${yA - yT - 8}" fill="${INK.teal}" opacity=".12"/>`;
  out += `<rect x="${px(xe)}" y="${lead}" width="${px(xR - xe)}" height="${yA - lead - 8}" fill="url(#epPhMix)"/>`;
  out += `<text class="ep-cap" x="${mL + 8}" y="${lead + 17}">symmetric · hot</text><text class="ep-cap" x="${mL + 8}" y="${yA - 16}">Higgs phase · cold</text>`;
  if (end !== null) {
    out += `<line x1="${mL}" x2="${px(xe)}" y1="${yT}" y2="${yT}" stroke="${INK.text}" stroke-width="2.6" stroke-linecap="round"/>`;
    out += `<line x1="${px(xe)}" x2="${xR}" y1="${yT}" y2="${yT}" stroke="${INK.text}" stroke-width="1.6" stroke-dasharray="2 6" stroke-linecap="round" opacity=".7"/>`;
    out += `<text class="ep-mark" x="${px(mL + (xe - mL) * 0.2)}" y="${yT - 9}" text-anchor="middle">first order</text><text class="ep-mark" x="${px(xe + (xR - xe) * 0.56)}" y="${yT - 9}" text-anchor="middle">crossover</text>`;
    if (cfg.bracket && fin(cfg.bracket[0]) && fin(cfg.bracket[1])) out += `<line x1="${px(sx(cfg.bracket[0]))}" x2="${px(sx(cfg.bracket[1]))}" y1="${yT}" y2="${yT}" stroke="${INK.amber}" stroke-width="7" stroke-linecap="round" opacity=".45"/>`;
    out += `<circle cx="${px(xe)}" cy="${yT}" r="5.5" fill="${INK.text}" stroke="${INK.surface}" stroke-width="2"/><text class="ep-mark" x="${px(xe)}" y="${yT - 13}" text-anchor="middle">endpoint ${plain(end, 3)}</text>`;
    out += `<rect class="ep-hit" x="${px(xe - 14)}" y="${yT - 14}" width="28" height="28" data-tip="${esc(cfg.endTip || '')}"/>`;
  } else out += `<line x1="${mL}" x2="${xR}" y1="${yT}" y2="${yT}" stroke="${INK.text}" stroke-width="1.6" stroke-dasharray="2 6" opacity=".6"/>`;
  for (const it of items) {
    const X = sx(it.m);
    if (fin(it.leadTo)) out += `<path d="M${px(it.leadTo * W)} 0C${px(it.leadTo * W)} ${lead + 18} ${px(X)} ${lead + 6} ${px(X)} ${yT - 8}" fill="none" stroke="${it.color}" stroke-width="1" opacity=".5"/>`;
    out += it.chain
      ? `<circle cx="${px(X)}" cy="${yT}" r="13" fill="${it.color}" opacity=".16"/><circle cx="${px(X)}" cy="${yT}" r="6.5" fill="${it.color}" stroke="${INK.surface}" stroke-width="2" style="filter:drop-shadow(0 0 8px ${it.color})"/>`
      : `<circle cx="${px(X)}" cy="${yT}" r="5" fill="${INK.surface}" stroke="${it.color}" stroke-width="2.2"/>`;
    out += `<text class="ep-mark${it.chain ? ' ep-strong' : ''}" x="${px(Math.min(xR - 4, X))}" y="${yT + (it.chain ? 30 : 21)}" text-anchor="${X > xR - 70 ? 'end' : 'middle'}">${esc(it.label)}</text>`;
    out += `<rect class="ep-hit" x="${px(X - 14)}" y="${yT - 14}" width="28" height="28" data-tip="${esc(it.tip || it.label)}"/>`;
  }
  const t = niceTicks(lo, hi, Math.max(3, Math.round(W / 90)));
  out += `<line class="ep-base" x1="${mL}" x2="${xR}" y1="${yA}" y2="${yA}"/>`;
  for (const v of t.ticks) out += `<line class="ep-base" x1="${px(sx(v))}" x2="${px(sx(v))}" y1="${yA}" y2="${yA + 4}"/><text class="ep-ax" x="${px(sx(v))}" y="${yA + 16}" text-anchor="middle">${tickText(v, t.step)}</text>`;
  out += `<text class="ep-axt" x="${xR}" y="${H - 5}" text-anchor="end">${esc(cfg.xLabel || '')}</text>`;
  return { svg: `<svg class="ep-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">${out}</svg>`, model: null };
}

// The same diagram as a plane, when the file carries the transition temperature against the Higgs mass: the line is
// solid where the transition is first order and dotted where it is a crossover; above it the symmetric phase.
function phasePlane(W, cfg, items, ln) {
  const H = 262, mL = 42, mR = 14, lead = 24, yA = H - 36, yB = yA - 6, end = fin(cfg.endpoint) ? cfg.endpoint : null;
  const ms = [...ln.m, ...items.map((i) => i.m)], lo = Math.max(0, Math.floor((Math.min(...ms) - 8) / 10) * 10), hi = Math.ceil((Math.max(...ms) + 8) / 10) * 10;
  const Ts = [...ln.T, ...items.filter((i) => fin(i.T)).map((i) => i.T)], padT = (Math.max(...Ts) - Math.min(...Ts) || 1) * 0.16, t0 = Math.min(...Ts) - padT, t1 = Math.max(...Ts) + padT;
  const sx = (v) => mL + (v - lo) / (hi - lo) * (W - mL - mR), sy = (v) => yB - (v - t0) / (t1 - t0) * (yB - lead - 6), xR = W - mR;
  const Tof = (m) => (m >= ln.m[0] && m <= ln.m[ln.m.length - 1] ? interp(ln.m, ln.T, m) : null), P = ln.m.map((m, i) => [px(sx(m)), px(sy(ln.T[i]))]);
  const first = (i) => /first/i.test(String(arr(ln.kind)[i] || '')) || (end !== null && !arr(ln.kind).length && ln.m[i] <= end);
  const path = P.map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`).join('');
  let out = `<path d="${path}L${P[P.length - 1][0]} ${lead}L${P[0][0]} ${lead}Z" fill="${INK.violet}" opacity=".11"/><path d="${path}L${P[P.length - 1][0]} ${yB}L${P[0][0]} ${yB}Z" fill="${INK.teal}" opacity=".11"/>`;
  out += `<text class="ep-cap" x="${px((P[0][0] + P[P.length - 1][0]) / 2)}" y="${lead + 18}" text-anchor="middle">symmetric · hot</text><text class="ep-cap" x="${P[P.length - 1][0] - 8}" y="${yB - 10}" text-anchor="end">Higgs phase · cold</text>`;
  for (const t of niceTicks(t0, t1, 4).ticks) out += `<line class="ep-grid-l" x1="${mL}" x2="${xR}" y1="${px(sy(t))}" y2="${px(sy(t))}"/><text class="ep-ax" x="${mL - 6}" y="${px(sy(t) + 3.5)}" text-anchor="end">${Math.round(t)}</text>`;
  for (let i = 1; i < P.length; i++) out += first(i - 1) && first(i)
    ? `<line x1="${P[i - 1][0]}" y1="${P[i - 1][1]}" x2="${P[i][0]}" y2="${P[i][1]}" stroke="${INK.text}" stroke-width="2.8" stroke-linecap="round"/>`
    : `<line x1="${P[i - 1][0]}" y1="${P[i - 1][1]}" x2="${P[i][0]}" y2="${P[i][1]}" stroke="${INK.text}" stroke-width="1.7" stroke-dasharray="1 6" stroke-linecap="round" opacity=".8"/>`;
  const Te = end !== null ? Tof(end) : null;
  if (Te !== null) {
    if (cfg.bracket && fin(cfg.bracket[0]) && fin(cfg.bracket[1])) { const a = Math.max(ln.m[0], Math.min(...cfg.bracket)), b = Math.min(ln.m[ln.m.length - 1], Math.max(...cfg.bracket)); if (b > a) out += `<line x1="${px(sx(a))}" y1="${px(sy(Tof(a)))}" x2="${px(sx(b))}" y2="${px(sy(Tof(b)))}" stroke="${INK.amber}" stroke-width="8" stroke-linecap="round" opacity=".32"/>`; }
    out += `<circle cx="${px(sx(end))}" cy="${px(sy(Te))}" r="5.5" fill="${INK.text}" stroke="${INK.surface}" stroke-width="2"/><text class="ep-mark" x="${px(sx(end) - 9)}" y="${px(sy(Te) - 9)}" text-anchor="end">endpoint ${plain(end, 3)} GeV</text>`;
    out += `<rect class="ep-hit" x="${px(sx(end) - 14)}" y="${px(sy(Te) - 14)}" width="28" height="28" data-tip="${esc(cfg.endTip || '')}"/>`;
  }
  for (const it of items) {
    const T = fin(it.T) ? it.T : Tof(it.m), X = sx(it.m), Y = T === null ? yB : sy(T);
    if (fin(it.leadTo)) out += `<path d="M${px(it.leadTo * W)} 0C${px(it.leadTo * W)} ${lead + 30} ${px(X)} ${px(Math.max(lead, Y - 70))} ${px(X)} ${px(Y - 8)}" fill="none" stroke="${it.color}" stroke-width="1" opacity=".5"/>`;
    out += it.chain
      ? `<circle cx="${px(X)}" cy="${px(Y)}" r="13" fill="${it.color}" opacity=".16"/><circle cx="${px(X)}" cy="${px(Y)}" r="6.5" fill="${it.color}" stroke="${INK.surface}" stroke-width="2" style="filter:drop-shadow(0 0 8px ${it.color})"/><text class="ep-mark ep-strong" x="${px(X - 12)}" y="${px(Y - 12)}" text-anchor="end">${esc(it.label)}</text>`
      : `<circle cx="${px(X)}" cy="${px(Y)}" r="5" fill="${INK.surface}" stroke="${it.color}" stroke-width="2.2"/><text class="ep-mark" x="${px(X + 9)}" y="${px(Math.min(yB - 4, Y + 16))}">${esc(it.label)}</text>`;
    out += `<rect class="ep-hit" x="${px(X - 14)}" y="${px(Y - 14)}" width="28" height="28" data-tip="${esc(it.tip || it.label)}"/>`;
  }
  const t = niceTicks(lo, hi, Math.max(3, Math.round(W / 90)));
  out += `<line class="ep-base" x1="${mL}" x2="${xR}" y1="${yA}" y2="${yA}"/>`;
  for (const v of t.ticks) out += `<line class="ep-base" x1="${px(sx(v))}" x2="${px(sx(v))}" y1="${yA}" y2="${yA + 4}"/><text class="ep-ax" x="${px(sx(v))}" y="${yA + 16}" text-anchor="middle">${tickText(v, t.step)}</text>`;
  out += `<text class="ep-axt" x="${xR}" y="${H - 5}" text-anchor="end">${esc(cfg.xLabel || '')}</text><text class="ep-axt" x="${mL}" y="${lead - 8}">${esc(cfg.yLabel || '')}</text>`;
  out += `<text class="ep-axt" x="${xR}" y="${lead - 8}" text-anchor="end">solid: first order · dotted: crossover</text>`;
  return { svg: `<svg class="ep-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">${out}</svg>`, model: null };
}

// ---------------------------------------------------------------- reading the files
const byVolume = (list, key) => arr(list).filter((s) => s && fin(s[key])).sort((a, b) => a[key] - b[key]);
export function peakGrowth(list, key) {                         // height of the susceptibility peak, smallest against largest volume
  const s = byVolume(list, key).filter((q) => nums(q.chi));
  if (s.length < 2) return null;
  const a = s[0], b = s[s.length - 1], pa = Math.max(...a.chi), pb = Math.max(...b.chi);
  return pa > 0 ? { from: a[key], to: b[key], ratio: pb / pa } : null;
}
const growthLine = (g) => (g ? `peak of the susceptibility: ×${g.ratio >= 10 ? Math.round(g.ratio) : f1(g.ratio)} from ${cube(g.from)} to ${cube(g.to)}` : '');
const pickPoint = (d, re) => arr(d && d.points).find((p) => p && re.test(String(p.kind || '')) && arr(p.hist).some((h) => nums(h.counts) && nums(h.bins))) || arr(d && d.points).find((p) => p && re.test(String(p.kind || '')));
const bestHist = (p) => arr(p && p.hist).filter((h) => h && nums(h.counts) && nums(h.bins)).sort((a, b) => (b.L || 0) - (a.L || 0))[0] || null;   // the largest volume
const growthOf = (d, x) => arr(d && d.endpoint && d.endpoint.growth).find((q) => q && fin(q.x) && fin(q.exponent) && fin(x) && Math.abs(q.x - x) < 0.006);
const growthNote = (d, x, fallback) => { const g = growthOf(d, x); return g ? `growth exponent of the susceptibility peak ${pm(g.exponent, g.err)}${g.volumes ? ` between the volumes ${g.volumes}` : ''}; 3 at a first-order transition, 0 at a crossover` : growthLine(fallback); };
function massOfChain(d) {
  if (d && d.oph && fin(d.oph.m_H_GeV)) return d.oph.m_H_GeV;
  const i = arr(d && d.inputs).find((q) => q && /^m[_ ]?H\b/i.test(String(q.name || '')) && fin(q.value));
  return i ? i.value : null;
}
function massOfX(d, x) {                                        // Higgs mass at a value of x, between the points that carry both
  const pr = arr(d.points).filter((p) => p && fin(p.x) && fin(p.m_H_GeV)).map((p) => [p.x, p.m_H_GeV]);
  if (d.endpoint && fin(d.endpoint.x_c_literature) && fin(d.endpoint.m_H_c_GeV)) pr.push([d.endpoint.x_c_literature, d.endpoint.m_H_c_GeV]);
  const mc = massOfChain(d); if (d.oph && fin(d.oph.x) && fin(mc)) pr.push([d.oph.x, mc]);
  pr.sort((a, b) => a[0] - b[0]);
  if (pr.length < 2 || x < pr[0][0] || x > pr[pr.length - 1][0]) return null;
  for (let i = 1; i < pr.length; i++) if (x <= pr[i][0]) { const [xa, ma] = pr[i - 1], [xb, mb] = pr[i]; return ma + (x - xa) / (xb - xa || 1) * (mb - ma); }
  return null;
}
// the binding strength the animation uses: the slope of the potential at the outer distances, at the two temperatures
// of the melting curves, as a share of the cold slope
export function bindingOf(d) {
  const m = arr(d && d.melting).filter((q) => q && fin(q.T_over_Tc) && nums(q.r) && nums(q.V)).sort((a, b) => a.T_over_Tc - b.T_over_Tc);
  const slope = (q) => { const n = q.r.length, i0 = Math.floor(n / 2); let k = 0, sx = 0, sy = 0, sxx = 0, sxy = 0; for (let i = i0; i < n; i++) { k++; sx += q.r[i]; sy += q.V[i]; sxx += q.r[i] ** 2; sxy += q.r[i] * q.V[i]; } return (k * sxy - sx * sy) / (k * sxx - sx * sx || 1); };
  if (m.length < 2) {                                           // no melting curves: the measured string tension below the transition, no pull above it
    const p = d && d.potential, sig = p && p.fit && fin(p.fit.sigma) ? p.fit.sigma : p && nums(p.r) && nums(p.V) && p.r.length === p.V.length && p.r.length > 3 ? slope(p) : null;
    return sig > 0 ? { Tlo: 1, Thi: 1, cold: sig, hot: 0, step: true, at: (T) => (T < 1 ? 1 : 0) } : null;
  }
  const a = m[0], b = m[m.length - 1], sa = slope(a), sb = slope(b);
  if (!(sa > 0)) return null;
  return { Tlo: a.T_over_Tc, Thi: b.T_over_Tc, cold: sa, hot: sb, at: (T) => Math.max(0, sa + (sb - sa) * Math.max(0, Math.min(1, (T - a.T_over_Tc) / (b.T_over_Tc - a.T_over_Tc || 1)))) / sa };
}
function cleanest(sets) {                 // the quark mass with the clearest nucleon plateau opens first
  let best = 0, bv = Infinity;
  sets.forEach((q, i) => { const m = q && q.mass && q.mass.nucleon; const v = m && m[0] > 0 ? m[1] / m[0] : Infinity; if (v < bv) { bv = v; best = i; } });
  return best;
}
const hadronSets = (d) => arr(d && d.hadrons).filter((q) => q && q.meff && nums(q.t)).sort((a, b) => (a.kappa || 0) - (b.kappa || 0));

// every plot of the page: key -> (data, width, state) -> { svg, model }
export const PLOTS = {
  'ew-scan': (d, W) => {
    const o = (d && d.oph) || {}, all = arr(o.series).filter((q) => q && fin(q.L) && nums(q.t)), Ls = [...new Set(all.map((q) => q.L))].sort((a, b) => a - b), col = ramp('teal', Ls.length), top = [], bot = [];
    const curves = all.some((q) => /reweight|curve/i.test(String(q.kind || '')));   // with reweighted curves in the file the runs are drawn as points
    const isRun = (q) => curves && !/reweight|curve/i.test(String(q.kind || ''));
    for (const q of [...all].sort((x, y) => (isRun(x) - isRun(y)) || x.L - y.L)) {
      const c = col[Ls.indexOf(q.L)], pts = isRun(q), name = cube(q.L) + (pts ? ' runs' : ''), lead = !pts && q.L === Ls[Ls.length - 1];
      if (nums(q.order)) top.push({ name, color: c, x: q.t, y: q.order, e: q.order_err, points: pts, quiet: pts, lead });
      if (nums(q.chi)) bot.push({ name, color: c, x: q.t, y: q.chi, e: q.chi_err, points: pts, quiet: pts, lead });
    }
    const T = all[0] && /T/.test(String(all[0].axis || 'T_GeV')), def = typeof o.order_def === 'string' ? o.order_def.split('=')[0].trim() : '';
    const marks = [];
    if (fin(o.T_c_GeV) && T) marks.push({ x: o.T_c_GeV, err: o.T_c_err, label: `this run ${pm(o.T_c_GeV, o.T_c_err)} GeV`, color: INK.text, side: 'right' });
    if (o.reference && fin(o.reference.T_c_GeV) && T) marks.push({ x: o.reference.T_c_GeV, label: `Standard Model lattice ${pm(o.reference.T_c_GeV, o.reference.err)}`, color: INK.violet, side: 'left' });
    return scanPlot(W, { xLabel: T ? 'temperature (GeV)' : 'y', marks, heights: [200, 164], panels: [{ label: `order parameter ${def && def.length < 16 ? def.replace(/\^2/g, '²') : '⟨φ†φ⟩'}`, series: top }, { label: 'susceptibility χ', zero: true, series: bot }] });
  },
  'ew-hist-first': (d, W) => { const h = bestHist(pickPoint(d, /first/i)); return h ? histPlot(W, 150, { bins: h.bins, counts: h.counts, color: RAMP.teal[2], xLabel: 'volume average of φ†φ' }) : { svg: '' }; },
  'ew-hist-cross': (d, W) => { const h = bestHist(pickPoint(d, /cross/i)); return h ? histPlot(W, 150, { bins: h.bins, counts: h.counts, color: RAMP.teal[1], xLabel: 'volume average of φ†φ' }) : { svg: '' }; },
  'ew-phase': (d, W) => {
    if (!d) return { svg: '' };
    const e = d.endpoint || {}, mc = massOfChain(d), pf = pickPoint(d, /first/i), pc = pickPoint(d, /cross/i), items = [];
    for (const p of arr(d.points)) if (p && fin(p.m_H_GeV)) items.push({ m: p.m_H_GeV, label: `${plain(p.m_H_GeV, 4)} GeV`, color: RAMP.teal[/first/i.test(p.kind || '') ? 2 : 1], leadTo: p === pf ? 0.25 : p === pc ? 0.75 : null,
      tip: `${p.label || p.id || 'point'}: Higgs mass ${plain(p.m_H_GeV, 4)} GeV, x = ${plain(p.x, 3)}, ${p.kind || ''}` });
    if (fin(mc)) items.push({ m: mc, T: d.oph && fin(d.oph.T_c_GeV) ? d.oph.T_c_GeV : null, chain: true, color: INK.teal, label: `the chain · ${plain(mc, 5)} GeV`, tip: `the chain's point: Higgs mass ${plain(mc, 5)} GeV${d.oph && fin(d.oph.x) ? `, x = ${plain(d.oph.x, 3)}` : ''}${d.oph && d.oph.kind ? ', ' + d.oph.kind : ''}` });
    const br = nums(e.x_c_bracket) && e.x_c_bracket.length === 2 ? e.x_c_bracket.map((x) => massOfX(d, x)) : null;
    const endTip = `endpoint of the first-order line${fin(e.m_H_c_GeV) ? `: Higgs mass ${plain(e.m_H_c_GeV, 4)} GeV` : ''}${nums(e.x_c_bracket) ? `; this run brackets x between ${e.x_c_bracket[0]} and ${e.x_c_bracket[1]}` : ''}${fin(e.x_c_literature) ? `; published lattice value, same theory: x = ${e.x_c_literature}` : ''}`;
    const sc = d.higgs_mass_scan || {}, line = nums(sc.m_H_GeV) && nums(sc.T_GeV) ? { m: sc.m_H_GeV, T: sc.T_GeV, kind: sc.kind } : null;
    return phasePlot(W, { items, line, endpoint: fin(e.m_H_c_GeV) ? e.m_H_c_GeV : null, bracket: br && br.every(fin) ? br : null, endTip, xLabel: 'Higgs mass (GeV)', yLabel: 'transition temperature (GeV)' });
  },
  'ew-compare': (d, W) => { const o = (d && d.oph) || {}, r = o.reference || {}; return compareStrip(W, { unit: 'GeV', items: [{ v: o.T_c_GeV, e: o.T_c_err, color: INK.teal, up: true, label: 'this run, the chain\'s couplings' }, { v: r.T_c_GeV, e: r.err, color: INK.violet, label: r.cite || 'reference' }] }); },
  'qcd-scan': (d, W) => {
    const u = (d && d.su3) || {}, s = byVolume(u.series, 'N_s'), col = ramp('amber', s.length), top = [], bot = [];
    s.forEach((q, i) => {                                       // a reweighted curve as a line when the file carries one, the runs themselves as points
      const c = q.curve || {}, curve = nums(c.beta), lead = i === s.length - 1, name = cube(q.N_s);
      if (curve && nums(c.absL)) top.push({ name, color: col[i], x: c.beta, y: c.absL, e: c.absL_err, lead });
      if (curve && nums(c.chi)) bot.push({ name, color: col[i], x: c.beta, y: c.chi, e: c.chi_err, lead });
      if (nums(q.beta) && nums(q.absL)) top.push({ name: curve ? name + ' runs' : name, color: col[i], x: q.beta, y: q.absL, e: q.absL_err, points: curve, quiet: curve, lead: !curve && lead });
      if (nums(q.beta) && nums(q.chi)) bot.push({ name: curve ? name + ' runs' : name, color: col[i], x: q.beta, y: q.chi, e: q.chi_err, points: curve, quiet: curve, lead: !curve && lead });
    });
    const marks = [];
    if (fin(u.beta_c)) marks.push({ x: u.beta_c, err: u.beta_c_err, label: `this run ${pm(u.beta_c, u.beta_c_err)}`, color: INK.text, side: 'left' });
    if (fin(u.beta_c_literature)) marks.push({ x: u.beta_c_literature, err: u.beta_c_literature_err, label: `published lattice value ${pm(u.beta_c_literature, u.beta_c_literature_err)}`, color: INK.violet, side: 'right' });
    return scanPlot(W, { xLabel: 'coupling β = 6/g²', marks, heights: W > 520 ? [268, 228] : [200, 164], panels: [{ label: 'Polyakov loop ⟨|L|⟩', zero: true, series: top }, { label: 'susceptibility χ', zero: true, series: bot }] });
  },
  'qcd-hist': (d, W) => { const h = colourHist(d); return h ? histPlot(W, Math.max(150, Math.min(W, 230)), { bins: h.bins, counts: h.counts, color: RAMP.amber[2], xLabel: '|L|' }) : { svg: '' }; },
  'qcd-trace': (d, W) => {
    const t = d && d.su3 && d.su3.trace;
    if (!t || !nums(t.absL)) return { svg: '' };
    const ev = fin(t.every) ? t.every : 1;
    return scanPlot(W, { xLabel: 'sweeps', heights: [Math.max(110, Math.min(W, 230) - 64)], panels: [{ label: '|L| along one run', zero: true, series: [{ name: 'run', color: RAMP.amber[2], x: t.absL.map((_, i) => i * ev), y: t.absL, thin: true }] }] });
  },
  'qcd-register-Z3': (d, W) => registerPlot(d, W, 'Z3'),
  'qcd-register-Z2': (d, W) => registerPlot(d, W, 'Z2'),
  // the transition against a published lattice value of the same theory: T_c over the root of the string tension when
  // the file carries it, else the critical coupling. A temperature in MeV is compared only when its route is computed.
  'qcd-compare': (d, W) => { const c = colourCheck(d); return c ? compareStrip(W, { unit: c.unit, items: c.items, ranges: c.ranges }) : { svg: '' }; },
  'qcd-scatter-0': (d, W) => scatterAt(d, W, 0),
  'qcd-scatter-1': (d, W) => { const n = scatters(d).length; return scatterAt(d, W, n > 1 ? n - 1 : 1); },
  // the static potential with the pair above it on the same distance axis: the antiquark is pulled along r, and the
  // dot on the curve below it reads the measured energy at that distance
  'had-potential': (d, W) => {
    const p = (d && d.potential) || {}, pts = pairs(p.r, p.V, p.V_err), fc = p.fit_curve ? pairs(p.fit_curve.r, p.fit_curve.V) : { x: [], y: [] };
    if (!pts.x.length) return { svg: '' };
    const series = [];
    if (fc.x.length > 1) series.push({ name: 'fit', color: INK.rose, x: fc.x, y: fc.y, lead: true, quiet: true });
    series.push({ name: 'measured', color: INK.text, x: pts.x, y: pts.y, e: pts.e, points: true, quiet: true });
    const rMax = Math.max(...pts.x, ...(fc.x.length ? fc.x : [0])), above = 86;
    const r = scanPlot(W, { xLabel: 'distance r in lattice units', domain: [0, rMax * 1.04], above, heights: [170], panels: [{ label: 'energy of the pair V(r)', series }],
      extra: (m) => `<g class="ep-tube"><path class="ep-tube-glow" d=""/><path class="ep-tube-core" d=""/><line class="ep-tube-drop" x1="0" x2="0" y1="${above - 26}" y2="${m.yEnd}"/>
        <circle class="ep-tube-q" cx="${px(m.sx(0))}" cy="${above - 38}" r="9"/><circle class="ep-tube-a" cx="0" cy="${above - 38}" r="8"/>
        <text class="ep-ax" x="${px(m.sx(0))}" y="${above - 14}" text-anchor="middle">quark</text><text class="ep-ax ep-tube-al" x="0" y="${above - 14}" text-anchor="middle">antiquark</text>
        <text class="ep-cap ep-tube-e" x="0" y="${above - 60}" text-anchor="middle"></text><circle class="ep-tube-dot" cx="0" cy="0" r="5.5"/></g>` });
    if (r.model) {
      const c = fc.x.length > 1 ? fc : pts, lo = Math.max(Math.min(...c.x), 0.2), hi = Math.max(...c.x);
      r.model.tube = { x: c.x, y: c.y, rLo: lo, rHi: hi, yq: above - 38, sigma: p.fit && fin(p.fit.sigma) ? p.fit.sigma : null };
    }
    return r;
  },
  'had-melting': (d, W) => {
    const m = arr(d && d.melting).filter((q) => q && nums(q.r) && nums(q.V)).sort((a, b) => (a.T_over_Tc || 0) - (b.T_over_Tc || 0));
    if (!m.length) return { svg: '' };
    const series = m.map((q, i) => { const hot = fin(q.T_over_Tc) ? q.T_over_Tc > 1 : i > 0; return { name: fin(q.T_over_Tc) ? `${q.T_over_Tc} × Tc` : (q.label || `curve ${i + 1}`), color: hot ? INK.rose : INK.blue, x: q.r, y: q.V, e: q.V_err, lead: true }; });
    return scanPlot(W, { xLabel: 'distance r in lattice units', heights: [170], panels: [{ label: 'V(r)', series }] });
  },
  'had-meff': (d, W, st) => {
    const sets = hadronSets(d), q = sets[Math.min(st && fin(st.kappa) ? st.kappa : cleanest(sets), sets.length - 1)];
    if (!q) return { svg: '' };
    const series = [], bands = [];
    for (const k of ['nucleon', 'rho', 'pion']) {
      const p = pairs(q.t.slice(0, arr(q.meff[k]).length), q.meff[k]), ms = q.mass && q.mass[k];
      if (p.x.length) series.push({ name: HADRON[k][1], color: HADRON[k][0], x: p.x, y: p.y, points: true, line: true });
      if (nums(ms) && fin(ms[0])) bands.push({ y: ms[0], err: ms[1] || 0, color: HADRON[k][0], label: `${HADRON[k][2]} ${pm(ms[0], ms[1])}` });
    }
    return scanPlot(W, { xLabel: 'time separation t in lattice units', heights: [226], panels: [{ label: 'effective mass', zero: true, series, bands }] });
  },
};
const pairOf = (q) => (Array.isArray(q) && fin(q[0]) ? [q[0], fin(q[1]) ? q[1] : null] : fin(q) ? [q, null] : q && typeof q === 'object' && fin(q.value) ? [q.value, fin(q.err) ? q.err : null] : null);
export function colourCheck(d) {
  const u = (d && d.su3) || {}, sc = (d && d.scale) || {}, pg = sc.pure_gauge || {}, own = pg.own_run || {}, st = (d && d.string_tension) || {};
  if (sc.route_computed === true && fin(sc.T_pc_MeV) && sc.reference && fin(sc.reference.T_pc_MeV)) return { what: 'MeV', unit: 'MeV', v: sc.T_pc_MeV, e: sc.T_pc_err, say: 'against the measured crossover · not blind',
    items: [{ v: sc.T_pc_MeV, e: sc.T_pc_err, color: INK.amber, up: true, label: 'this run' }, { v: sc.reference.T_pc_MeV, e: sc.reference.err, color: INK.violet, label: sc.reference.cite || 'measured crossover' }] };
  const uT = u.Tc_over_sqrt_sigma, full = pairOf(own.Tc_over_sqrt_sigma) || pairOf(st.Tc_over_sqrt_sigma) || (fin(uT) ? [uT, u.Tc_over_sqrt_sigma_err] : pairOf(uT));
  const low = full ? null : pairOf(own.Tc_over_sqrt_sigma_lower_estimate) || pairOf(st.Tc_over_sqrt_sigma_lower_estimate), mine = full || low;
  const pub = arr(pg.Tc_over_sqrt_sigma).filter((q) => q && fin(q.value)).map((q) => ({ v: q.value, e: q.err, color: INK.violet, ring: true, label: `published lattice value, same theory${q.cite ? ' (' + q.cite + ')' : ''}` }));
  if (fin(u.Tc_over_sqrt_sigma_literature)) pub.push({ v: u.Tc_over_sqrt_sigma_literature, color: INK.violet, ring: true, label: 'published lattice value, same theory' });
  if (!pub.length && uT && typeof uT === 'object' && fin(uT.literature)) pub.push({ v: uT.literature, e: uT.literature_err, color: INK.violet, ring: true, label: 'published lattice value, same theory' });
  const nt = nums(st.literature_Tc_over_sqrt_sigma_Nt4) && st.literature_Tc_over_sqrt_sigma_Nt4.length === 2 ? [{ lo: Math.min(...st.literature_Tc_over_sqrt_sigma_Nt4), hi: Math.max(...st.literature_Tc_over_sqrt_sigma_Nt4), color: INK.violet, label: `published at the same lattice spacing${fin(u.N_t) ? ', N_t = ' + u.N_t : ''}` }] : [];
  if (mine && (pub.length || nt.length)) return { what: 'Tsigma', unit: '', v: mine[0], e: mine[1], lower: !!low, ranges: nt, say: `${NC('T<sub>c</sub> / √σ')} against published lattice values, same theory`,
    items: [{ v: mine[0], e: mine[1], color: INK.amber, up: true, label: low ? 'this run, lower estimate' : 'this run' }, ...pub] };
  if (fin(u.beta_c) && fin(u.beta_c_literature)) return { what: 'beta', unit: '', v: u.beta_c, e: u.beta_c_err, say: 'critical coupling against the published lattice value, same theory',
    items: [{ v: u.beta_c, e: u.beta_c_err, color: INK.amber, up: true, label: 'this run' }, { v: u.beta_c_literature, e: u.beta_c_literature_err, color: INK.violet, ring: true, label: 'published lattice value, same theory' }] };
  return null;
}
export function colourHist(d) {                                 // the histogram at the transition on the largest volume
  const hs = arr(d && d.su3 && d.su3.hist).filter((q) => q && nums(q.counts) && nums(q.bins)), pk = hs.filter((q) => /peak|transition/i.test(String(q.kind || '')));
  return (pk.length ? pk : hs).sort((a, b) => (b.N_s || 0) - (a.N_s || 0))[0] || null;
}
const scatters = (d) => arr(d && d.su3 && d.su3.scatter).filter((q) => q && nums(q.re) && nums(q.im)).sort((a, b) => (a.beta || 0) - (b.beta || 0));
function scatterAt(d, W, i) {
  const all = scatters(d), q = all[i];
  if (!q) return { svg: '' };
  let R = 0; for (const s of all) for (let j = 0; j < s.re.length; j++) R = Math.max(R, Math.hypot(s.re[j], s.im[j] || 0));
  R = niceTicks(0, R * 1.08, 3).ticks.pop() || R || 1;
  return scatterPlot(W, { H: Math.max(150, Math.min(W, 230)), re: q.re, im: q.im, R, color: RAMP.amber[2], label: fin(q.beta) ? `β = ${q.beta}` : '' });
}
function registerPlot(d, W, k) {
  const r = d && d.register && d.register[k];
  if (!r) return { svg: '' };
  const s = arr(r.series).filter((q) => q && typeof q === 'object').sort((a, b) => (a.L || 0) - (b.L || 0)), col = ramp('amber', s.length);
  const xk = ['kappa', 'beta', 't', 'x'].find((q) => s.some((z) => nums(z[q])));
  const two = ['e', 'C'].filter((q) => s.some((z) => nums(z[q]))), one = ['order', 'plaq', 'ReW', 'loop', 'absL', 'binder', 'chi'].find((q) => s.some((z) => nums(z[q]))), keys = two.length ? two : one ? [one] : [];
  if (!xk || !keys.length) return { svg: '' };
  const LAB = { e: 'mean plaquette', C: 'specific heat', order: 'order parameter', plaq: 'mean plaquette', chi: 'susceptibility' };
  const panels = keys.map((yk) => ({ label: LAB[yk] || yk, zero: yk === 'C', series: s.flatMap((q, i) => {
    const out = [], name = fin(q.L) ? cube(q.L) : (q.label || `set ${i + 1}`), pts = arr(q.points).filter((z) => z && fin(z[xk]) && fin(z[yk]));
    if (nums(q[xk]) && nums(q[yk])) out.push({ name, color: col[i], x: q[xk], y: q[yk], e: q[yk + '_err'], lead: i === s.length - 1 });
    if (pts.length) out.push({ name: name + ' runs', color: col[i], x: pts.map((z) => z[xk]), y: pts.map((z) => z[yk]), e: pts.every((z) => fin(z[yk + '_err'])) ? pts.map((z) => z[yk + '_err']) : null, points: true, quiet: true });
    return out;
  }) }));
  const marks = [];
  if (fin(r.kappa_c)) marks.push({ x: r.kappa_c, err: r.kappa_c_err, label: `this run ${pm(r.kappa_c, r.kappa_c_err)}`, color: INK.text, side: 'left' });
  if (fin(r.kappa_c_literature)) marks.push({ x: r.kappa_c_literature, label: `duality value ${r.kappa_c_literature}`, color: INK.violet, side: 'right' });
  return scanPlot(W, { xLabel: xk === 'kappa' ? 'coupling κ' : xk, heights: keys.length > 1 ? [104, 104] : [150], marks, panels });
}
function ratioStrip(d, W, list, i, unit) {
  const q = arr(d && d[list])[i];
  if (!q || !fin(q.value)) return { svg: '' };
  const items = [{ v: q.value, e: q.err, color: INK.rose, up: true, label: 'this run' }];
  if (fin(q.measured)) items.push({ v: q.measured, color: INK.violet, label: 'measured' });
  if (fin(q.quenched_literature)) items.push({ v: q.quenched_literature, color: INK.violet, ring: true, label: 'published lattice value, same theory' });
  return compareStrip(W, { unit, items });
}
const plotFor = (key) => PLOTS[key] || (key.startsWith('had-ratio-') ? (d, W) => ratioStrip(d, W, 'ratios', +key.slice(10), '') : key.startsWith('had-gev-') ? (d, W) => ratioStrip(d, W, 'GeV', +key.slice(8), 'GeV') : null);
export const drawPlot = (key, data, W, st) => { const fn = plotFor(key); return fn ? fn(data, W, st) : { svg: '' }; };

// ---------------------------------------------------------------- the panels as markup
const fig = (key, title, span, extra = '') => `<figure class="ep-fig ep-s${span}" data-fig="${key}"><div class="ep-fig-title"><span>${title}</span></div><div class="ep-plot" data-plot="${key}">${WAIT}</div>${extra}</figure>`;
const stat = (key, value, label) => `<div class="ep-stat" data-stat="${key}"><b>${value}</b><span>${label}</span></div>`;
const big = (v, e, unit) => `${pm(v, e).replace(' ± ', ' <i>± ') + (fin(e) && e > 0 ? '</i>' : '')}${unit ? ` <i>${unit}</i>` : ''}`;
const LABEL = { MEASURED: 'measured', IMPORTED: 'published value', EXACT: 'exact', ARGUED: 'argued', DECLARED: 'declared', PLACEHOLDER: 'placeholder' };
function statements(d) {
  const s = arr(d && d.statements).filter((q) => q && q.text);
  if (!s.length) return '';
  const li = (q) => { const l = String(q.label || '').toUpperCase(); return `<li><i class="ep-chip ep-l-${esc((LABEL[l] || 'other'))}">${esc(LABEL[l] || String(q.label || '').toLowerCase())}</i>${esc(q.text)}</li>`; };
  return `<div class="ep-fig-title ep-says-k"><span>Statements of the run</span></div><ul class="ep-says">${s.slice(0, 6).map(li).join('')}</ul>` + (s.length > 6 ? `<details class="ep-more"><summary>${s.length - 6} more statements</summary><ul class="ep-says">${s.slice(6).map(li).join('')}</ul></details>` : '');
}
function inputs(d) {                                            // the inputs of the run, grouped by their status
  const s = arr(d && d.inputs).filter((q) => q && q.name && (fin(q.value) || (typeof q.value === 'string' && q.value)));
  if (!s.length) return '';
  const groups = [];
  for (const q of s) { const k = String(q.status || '').split(',')[0].trim(); if (!groups.length || groups[groups.length - 1].k !== k) groups.push({ k, items: [] }); groups[groups.length - 1].items.push(q); }
  return `<div class="ep-inputs">${groups.map((g, i) => `<span class="ep-in-k">${i ? '' : 'inputs · '}${esc(g.k || 'values')}</span>${g.items.map((q) => `<span class="ep-in" title="${esc(q.status || '')}">${pretty(q.name)} <b>${esc(fin(q.value) ? plain(q.value, 8) : q.value)}</b>${q.unit ? ' ' + esc(q.unit) : ''}</span>`).join('')}`).join('')}</div>`;
}
const refs = (d) => {
  const r = arr(d && d.references).filter((q) => q && q.cite).map((q) => (/^https?:\/\//.test(String(q.url || '')) ? `<a href="${esc(q.url)}" target="_blank" rel="noopener">${esc(q.cite)} ↗</a>` : `<span>${esc(q.cite)}</span>`));
  return r.slice(0, 4).join('') + (r.length > 4 ? `<details class="ep-more"><summary>${r.length - 4} more references</summary><div class="ep-refs">${r.slice(4).join('')}</div></details>` : '');
};
const phBadge = (d) => (d && d.placeholder === true ? '<span class="ep-ph-badge">placeholder data, not a measurement</span>' : '');
const progressSlot = (lane) => `<span class="ep-pg" data-pg="${lane}"></span>`;
const panelOpen = (d, lane, colour) => `<section class="ep-panel${d && d.placeholder === true ? ' ep-ph' : ''}" data-lane="${lane}" style="--c:var(--${colour})">`;

export function panelEW(d) {
  const o = (d && d.oph) || {}, first = pickPoint(d, /first/i), cross = pickPoint(d, /cross/i);
  const hTitle = (p, word) => { const h = bestHist(p); return p ? `${word} · ${fin(p.m_H_GeV) ? `Higgs mass ${NC(plain(p.m_H_GeV, 4) + ' GeV')}` : NC(`x = ${plain(p.x, 3)}`)}${h && fin(h.L) ? ' · ' + cube(h.L) : ''}` : word; };
  const g = peakGrowth(o.series, 'L'), gf = first && peakGrowth(first.series, 'L'), gc = cross && peakGrowth(cross.series, 'L');
  const t = fin(o.t_seconds) ? o.t_seconds : fin(o.T_c_GeV) ? radiationTime(o.T_c_GeV, 106.75) : null;
  return `${panelOpen(d, 'EW', 'teal')}
    <div class="ep-top">
      <div class="ep-lead"><div class="ep-kick"><span>Electroweak</span>${phBadge(d)}${progressSlot('EW')}</div><h3>The Higgs field switches on</h3>
        <div class="ep-map">Thermal comparison: a separate three-dimensional Euclidean lattice theory uses the declared chain's couplings and an imported dimensional-reduction map. ${fin(o.T_c_GeV) ? `The ratio E<sub>cell</sub>/T = ${esc(sci(E_CELL / o.T_c_GeV, 1))} expresses an imaginary-time thermal extent in an assumed cell-energy unit; it does not identify the native attempted-event clock.` : 'No native attempted-event clock is identified with a thermal time extent.'} ${esc(o.scope_note || '')}</div></div>
      <div class="ep-stats">
        ${stat('Tc', fin(o.T_c_GeV) ? big(o.T_c_GeV, o.T_c_err, 'GeV') : '<i class="ep-dim">–</i>', 'crossover temperature')}
        ${stat('time', fin(t) ? esc(fmtTime(t)) : '<i class="ep-dim">–</i>', fin(t) ? `radiation-era comparison · ${NC(esc(fmtTicks(fin(o.ticks) ? o.ticks : t / TICK_S)))} in the assumed calibration` : 'radiation-era comparison time')}
        ${stat('kind', o.kind ? esc(o.kind) : '<i class="ep-dim">–</i>', 'at the chain\'s point')}
        <div class="ep-stat ep-cmp" data-stat="compare"><div class="ep-plot" data-plot="ew-compare"></div><span>against the Standard Model lattice value · not blind</span></div>
      </div>
    </div>
    <div class="ep-grid">
      ${fig('ew-scan', 'The chain\'s point against temperature', 6, `<div class="ep-note">${esc(growthNote(d, o.x, g))}</div>`)}
      <div class="ep-col ep-s6">
        <div class="ep-pair">
          ${fig('ew-hist-first', hTitle(first, 'first order'), 6, `<div class="ep-note">${esc(growthNote(d, first && first.x, gf))}</div>`)}
          ${fig('ew-hist-cross', hTitle(cross, 'crossover'), 6, `<div class="ep-note">${esc(growthNote(d, cross && cross.x, gc))}</div>`)}
        </div>
        ${fig('ew-phase', 'Phase diagram in the Higgs mass', 12)}
      </div>
    </div>
    ${statements(d)}${inputs(d)}
    <div class="ep-foot" data-links="ewlattice coupling higgs"><div class="ep-refs">${refs(d)}</div></div>
  </section>`;
}
export function panelQCD(d) {
  const u = (d && d.su3) || {}, sc = (d && d.scale) || {}, sca = scatters(d), h = colourHist(d), reg = (d && d.register) || {}, fs = u.chi_max_scaling || {};
  const g = peakGrowth(arr(u.series).map((q) => ({ N_s: q && q.N_s, chi: q && q.curve && nums(q.curve.chi) ? q.curve.chi : q && q.chi })), 'N_s'), chk = colourCheck(d), mev = sc.route_computed === true && fin(sc.T_pc_MeV);
  const t = mev ? (fin(sc.t_seconds) ? sc.t_seconds : radiationTime(sc.T_pc_MeV / 1e3, 61.75)) : null;
  const where = (q) => esc(q.where || (fin(q.beta) && fin(u.beta_c) ? (Math.abs(q.beta - u.beta_c) < 0.004 ? 'at the transition' : q.beta < u.beta_c ? 'below' : 'above') : '')) + (fin(q.N_s) ? ' · ' + cube(q.N_s) : '');
  const ord = (k, name) => `the register's ${name}${reg[k] && reg[k].order ? ' · ' + esc(/first/i.test(reg[k].order) ? 'first order' : reg[k].order) : ''}`;
  const small = [];
  if (sca.length) small.push(['qcd-scatter-0', `the complex loop · ${where(sca[0])}`]);
  if (sca.length > 1) small.push(['qcd-scatter-1', `the complex loop · ${where(sca[sca.length - 1])}`]);
  if (!sca.length) small.push(['qcd-scatter-0', 'the complex loop']);
  small.push(['qcd-hist', `at the transition${h && fin(h.beta) ? ` · ${NC(`β = ${plain(h.beta, 5)}`)}` : ''}${h && fin(h.N_s) ? ' · ' + cube(h.N_s) : ''}`]);
  if (u.trace && nums(u.trace.absL)) small.push(['qcd-trace', `one run at the transition${fin(u.trace.N_s) ? ' · ' + cube(u.trace.N_s) : ''}`]);
  const span = small.length >= 4 ? 3 : small.length === 3 ? 4 : 6;
  const growth = fin(fs.exponent) ? `the peak of the susceptibility grows as ${NC(`N<sub>s</sub><sup>${pm(fs.exponent, fs.exponent_err)}</sup>`)}${fin(fs.first_order_value) ? `; a first-order transition gives ${fs.first_order_value}` : ''}` : esc(growthLine(g));
  const gates = arr(u.gates).filter((q) => q && q.name), okN = gates.filter((q) => q.ok === true).length;
  return `${panelOpen(d, 'QCD', 'amber')}
    <div class="ep-top">
      <div class="ep-lead"><div class="ep-kick"><span>Colour</span>${phBadge(d)}${progressSlot('QCD')}</div><h3>Colour confines</h3>
        <div class="ep-map">Map into this panel: the links around the time direction multiply to the Polyakov loop, and the colour centre Z<sub>3</sub> turns it by a third of a circle.</div></div>
      <div class="ep-stats">
        ${stat('betac', fin(u.beta_c) ? big(u.beta_c, u.beta_c_err, '') : '<i class="ep-dim">–</i>', `critical coupling ${NC('β<sub>c</sub>')}${fin(u.N_t) ? ` · ${NC(`N<sub>t</sub> = ${u.N_t}`)}` : ''}`)}
        ${chk && chk.what === 'Tsigma' ? stat('Tsigma', big(chk.v, chk.e, ''), `transition temperature over ${NC('√σ')}${chk.lower ? ' · lower estimate' : ''}`) : ''}
        ${fin(fs.exponent) ? stat('growth', big(fs.exponent, fs.exponent_err, ''), `growth exponent of the susceptibility peak${fin(fs.first_order_value) ? ` · first order gives ${fs.first_order_value}` : ''}`) : u.order ? stat('order', esc(/first/i.test(u.order) ? 'first order' : u.order), 'order of the transition') : ''}
        ${mev ? stat('Tpc', big(sc.T_pc_MeV, sc.T_pc_err, 'MeV'), 'transition temperature · route computed') + stat('time', esc(fmtTime(t)), `after the first tick · ${NC(esc(fmtTicks(fin(sc.ticks) ? sc.ticks : t / TICK_S)))}`) : ''}
        ${chk ? `<div class="ep-stat ep-cmp" data-stat="compare"><div class="ep-plot" data-plot="qcd-compare"></div><span>${chk.say}</span></div>` : ''}
      </div>
    </div>
    <div class="ep-grid">
      ${fig('qcd-scan', `SU(3) links${fin(u.N_t) ? ` · ${NC(`N<sub>t</sub> = ${u.N_t}`)}` : ''} · three volumes`, 6, `<div class="ep-note">${growth}</div>`)}
      <div class="ep-col ep-s6">
        <div class="ep-trio">${small.map(([k, t2]) => fig(k, t2, span)).join('')}</div>
        <div class="ep-pair">
          ${fig('qcd-register-Z3', ord('Z3', `colour centre ${NC('Z<sub>3</sub>')}`), 6)}
          ${fig('qcd-register-Z2', ord('Z2', `weak centre ${NC('Z<sub>2</sub>')}`), 6)}
        </div>
      </div>
    </div>
    ${statements(d)}${inputs(d)}${gates.length ? `<div class="ep-inputs"><span class="ep-in-k">gates</span><span class="ep-in" title="${esc(gates.map((q) => q.name).join('; '))}"><b>${okN} of ${gates.length}</b> pass</span></div>` : ''}
    <div class="ep-foot" data-links="colourlattice gauge hadrons"><div class="ep-refs">${refs(d)}</div></div>
  </section>`;
}
export function panelHAD(d, st) {
  const lat = (d && d.lattice) || {}, p = (d && d.potential) || {}, f = p.fit || {}, sets = hadronSets(d), ki = Math.min(st && fin(st.kappa) ? st.kappa : cleanest(sets), sets.length - 1);
  const rN = arr(d && d.ratios).find((q) => q && /m_?N\s*\/\s*m_?rho/i.test(String(q.name || '')) && fin(q.value)), rS = arr(d && d.ratios).find((q) => q && q !== rN && fin(q.value));
  const gev = arr(d && d.GeV).map((q, i) => [q, i]).filter(([q]) => q && fin(q.value) && q.route_computed === true);
  const size = nums(lat.size) && lat.size.length === 4 ? `${lat.size[0]}${sup(3)} × ${lat.size[3]}` : '';
  const row = (list, i, q, unit) => `<div class="ep-ratio" data-ratio="${list}-${i}"><div class="ep-ratio-h"><span>${pretty(q.name)}</span><b>${big(q.value, q.err, unit)}</b></div><div class="ep-plot" data-plot="had-${list === 'GeV' ? 'gev' : 'ratio'}-${i}"></div>
      <div class="ep-ratio-f">${fin(q.measured) ? `<span><i class="ep-key" style="--k:${INK.violet}"></i>measured ${plain(q.measured, 5)}</span>` : ''}${fin(q.quenched_literature) ? `<span><i class="ep-key ep-key-ring" style="--k:${INK.violet}"></i>published lattice value, same theory ${plain(q.quenched_literature, 5)}</span>` : ''}</div></div>`;
  const ratios = arr(d && d.ratios).map((q, i) => (q && fin(q.value) ? row('ratios', i, q, '') : '')).join('') + gev.map(([q, i]) => row('GeV', i, q, 'GeV')).join('');
  const kap = sets.length > 1 ? `<div class="ep-pills" data-pills="kappa">${sets.map((q, i) => `<button class="ep-pill${i === ki ? ' on' : ''}" data-kappa="${i}" title="hopping parameter of the quark">${NC(`κ = ${plain(q.kappa, 5)}`)}</button>`).join('')}</div>` : '';
  return `${panelOpen(d, 'HAD', 'red')}
    <div class="ep-top">
      <div class="ep-lead"><div class="ep-kick"><span>Hadrons</span>${phBadge(d)}${progressSlot('HAD')}</div><h3>Quarks bind into hadrons</h3>
        <div class="ep-map">Map into this panel: quarks hop on the same colour links, and two colour charges are joined by a tube of flux whose energy grows with its length.</div></div>
      <div class="ep-stats">
        ${stat('sigma', fin(f.sigma) ? big(f.sigma, f.sigma_err, '') : '<i class="ep-dim">–</i>', 'string tension · energy per lattice unit of tube')}
        ${rN ? stat('ratio', big(rN.value, rN.err, ''), `nucleon over rho${fin(rN.measured) ? ` · measured ${NC(plain(rN.measured, 5))} · not blind` : ''}`) : ''}
        ${rS ? stat('ratio2', big(rS.value, rS.err, ''), `${NC(pretty(rS.name))}${fin(rS.measured) ? ` · measured ${NC(plain(rS.measured, 5))} · not blind` : ''}`) : ''}
        ${stat('lattice', size ? NC(size) : '<i class="ep-dim">–</i>', `lattice${fin(lat.beta) ? ` · ${NC(`β = ${lat.beta}`)}` : ''}${fin(lat.configurations) ? ` · ${lat.configurations} configurations` : ''}`)}
      </div>
    </div>
    <div class="ep-grid">
      <figure class="ep-fig ep-s12" data-fig="had-plasma"><div class="ep-fig-title"><span>A hot plasma of colour charges cools and binds</span></div>
        <div class="ep-plasma"${d && bindingOf(d) ? '' : ' data-off="1"'}>${d && bindingOf(d) ? `<canvas></canvas><div class="ep-plasma-say"></div>
          <div class="ep-plasma-ctl"><button class="ep-pill ep-plasma-play" title="play or pause the cooling">❚❚ pause</button><span class="ep-plasma-t"></span><input type="range" class="ep-plasma-range" min="0.5" max="1.6" step="0.005" value="1.5" aria-label="temperature over the transition temperature"><span class="ep-plasma-key"><i style="--k:${INK.rose}"></i><i style="--k:${INK.green}"></i><i style="--k:${INK.blue}"></i> quarks <i class="ep-key-ring" style="--k:${INK.soft}"></i> antiquarks</span></div>` : WAIT}</div></figure>
      ${fig('had-potential', 'Pulling a pair apart', 4)}
      ${fig('had-melting', 'Heated above the transition, the tube melts', 4)}
      <figure class="ep-fig ep-s4" data-fig="had-meff"><div class="ep-fig-title"><span>Three bound states with definite masses</span>${kap}</div><div class="ep-plot" data-plot="had-meff">${WAIT}</div></figure>
      <figure class="ep-fig ep-s12" data-fig="had-ratios"><div class="ep-fig-title"><span>Mass ratios against the measured ones · not blind</span></div>${ratios ? `<div class="ep-ratios">${ratios}</div>` : WAIT}</figure>
    </div>
    ${statements(d)}${inputs(d)}
    <div class="ep-foot" data-links="hadronlattice hadrons"><div class="ep-refs">${refs(d)}</div></div>
  </section>`;
}
export function pageMarkup(ew, qcd, had, st) {
  const ph = [ew, qcd, had].some((d) => d && d.placeholder === true);
  return `<div class="ep-wrap">
    <div class="ep-head"><div><h2>Thermal physics: three lattice comparisons</h2>
      <div class="ep-sub">Separate lattice ensembles compare electroweak crossover, colour confinement and hadron binding. Their temperature maps use imported thermal physics. T = E<sub>cell</sub> / N<sub>t</sub> is an imaginary-time relation with an assumed cell-energy scale; it does not identify the native attempted-event clock or derive a cooling history.</div></div></div>
    ${ph ? '<div class="ep-phline">placeholder data, not a measurement</div>' : ''}
    ${panelEW(ew)}${panelQCD(qcd)}${panelHAD(had, st)}
    <div class="ep-tip" hidden></div></div>`;
}

// ---------------------------------------------------------------- the page
let DATA = { ew: null, qcd: null, had: null }, stamp = '', MODELS = new Map(), ready = null, links = null, raf = 0, PROG = null;
function waits(host) {                                          // the lane's progress bar beside each badge and in every frame whose data is still being computed
  if (!PROG) return;
  for (const h of host.querySelectorAll('.ep-pg:empty')) h.appendChild(PROG(h.dataset.pg));
  for (const w of host.querySelectorAll('.ep-wait:empty')) { const lane = w.closest('.ep-panel'); if (lane) w.appendChild(PROG(lane.dataset.lane, { label: 'this part comes with the run on the compute box' })); }
}
const STATE = { kappa: null, tubeHold: 0, tubeR: null };
const dataFor = (key) => (key.startsWith('ew') ? DATA.ew : key.startsWith('qcd') ? DATA.qcd : DATA.had);
function fill(host) {
  for (const el of host.querySelectorAll('.ep-plot[data-plot]')) {
    const key = el.dataset.plot, W = Math.floor(el.clientWidth);
    if (!(W > 0)) continue;
    let r = null; try { r = drawPlot(key, dataFor(key), W, STATE); } catch (e) { console.error('transitions plot ' + key, e); }
    if (r && r.svg) { el.innerHTML = r.svg; if (r.model) MODELS.set(key, r.model); else MODELS.delete(key); } else if (!el.closest('.ep-cmp, .ep-ratio')) { el.innerHTML = WAIT; MODELS.delete(key); }
  }
  plasmaSize(host); waits(host);
  try { const now = performance.now(); tubeFrame(host, now); plasmaFrame(host, now); } catch (e) { /* the loop draws the next frame */ }
}
function render(host) {
  host.innerHTML = pageMarkup(DATA.ew, DATA.qcd, DATA.had, STATE);
  if (links) for (const f of host.querySelectorAll('.ep-foot[data-links]')) { f.insertAdjacentHTML('beforeend', links(f.dataset.links.split(' '))); const seen = new Set(); for (const a of f.querySelectorAll('a')) { if (seen.has(a.href)) a.remove(); else seen.add(a.href); } }
  PLASMA = null; fill(host);
}
function hover(host) {
  const tip = () => host.querySelector('.ep-tip');
  const place = (ev, t) => { t.hidden = false; const r = t.getBoundingClientRect(); let x = ev.clientX + 14, y = ev.clientY + 14; if (x + r.width > innerWidth - 8) x = ev.clientX - r.width - 14; if (y + r.height > innerHeight - 8) y = ev.clientY - r.height - 14; t.style.left = Math.max(8, x) + 'px'; t.style.top = Math.max(8, y) + 'px'; };
  const clear = () => { const t = tip(); if (t) t.hidden = true; for (const c of host.querySelectorAll('.ep-cross.on, .ep-hdot.on')) c.classList.remove('on'); };
  host.addEventListener('pointerleave', clear);
  host.addEventListener('click', (ev) => {
    const k = ev.target.closest && ev.target.closest('.ep-pill[data-kappa]');
    if (k) { STATE.kappa = +k.dataset.kappa; for (const b of host.querySelectorAll('.ep-pill[data-kappa]')) b.classList.toggle('on', b === k); fill(host); }
    if (ev.target.closest && ev.target.closest('.ep-plasma-play') && PLASMA) {     // play and pause the cooling; from the cold end it starts hot again
      if (PLASMA.auto) PLASMA.auto = false; else { if (PLASMA.T <= 0.52) PLASMA.phase = 0; PLASMA.auto = true; }
      ev.target.closest('.ep-plasma-play').textContent = PLASMA.auto ? '❚❚ pause' : '▶ cool';
    }
  });
  host.addEventListener('input', (ev) => { if (ev.target.classList && ev.target.classList.contains('ep-plasma-range') && PLASMA) { PLASMA.auto = false; PLASMA.T = +ev.target.value; const b = host.querySelector('.ep-plasma-play'); if (b) b.textContent = '▶ cool'; } });
  host.addEventListener('pointermove', (ev) => {
    const t = tip(); if (!t) return;
    const hit = ev.target.closest && ev.target.closest('.ep-hit');
    if (hit) { t.textContent = hit.dataset.tip || ''; if (t.textContent) place(ev, t); else t.hidden = true; return; }
    const plot = ev.target.closest && ev.target.closest('.ep-plot'), m = plot && MODELS.get(plot.dataset.plot), svg = plot && plot.querySelector('svg');
    if (!m || !svg) { clear(); return; }
    const X = ev.clientX - svg.getBoundingClientRect().left;
    if (m.tube) { STATE.tubeR = Math.max(m.tube.rLo, Math.min(m.tube.rHi, m.lo + (X - m.x0) / (m.x1 - m.x0) * (m.hi - m.lo))); STATE.tubeHold = performance.now() + 2500; }
    if (X < m.x0 - 6 || X > m.x1 + 6) { clear(); return; }
    let best = null;                                           // the data position nearest to the pointer
    for (const p of m.panels) for (const s of p.series) for (let i = 0; i < s.px.length; i++) { const dd = Math.abs(s.px[i] - X); if (!best || dd < best.d) best = { d: dd, x: s.x[i], px: s.px[i] }; }
    if (!best) return;
    const cross = svg.querySelector('.ep-cross'); cross.setAttribute('x1', best.px); cross.setAttribute('x2', best.px); cross.classList.add('on');
    t.textContent = '';
    const head = document.createElement('div'); head.className = 'ep-tip-h'; head.textContent = `${m.xLabel}: ${plain(best.x, 5)}`; t.appendChild(head);
    m.panels.forEach((p, pi) => {
      const k = document.createElement('div'); k.className = 'ep-tip-k'; k.textContent = p.label; t.appendChild(k);
      p.series.forEach((s, si) => {
        let j = 0; for (let i = 1; i < s.px.length; i++) if (Math.abs(s.px[i] - best.px) < Math.abs(s.px[j] - best.px)) j = i;
        const dot = svg.querySelector(`.ep-hdot[data-p="${pi}"][data-s="${si}"]`), near = Math.abs(s.px[j] - best.px) < 12;
        if (dot) { dot.setAttribute('cx', s.px[j]); dot.setAttribute('cy', s.py[j]); dot.classList.toggle('on', near); }
        if (!near) return;
        const row = document.createElement('div'); row.className = 'ep-tip-r';
        const key = document.createElement('i'); key.style.background = s.color; const v = document.createElement('b'); v.textContent = s.e && s.e[j] > 0 ? pm(s.y[j], s.e[j]) : plain(s.y[j], 4);
        const nm = document.createElement('span'); nm.textContent = s.name; row.append(key, v, nm); t.appendChild(row);
      });
    });
    place(ev, t);
  });
}

// ---- the pair on the potential plot: the antiquark moves along r, the dot on the curve reads the energy
function tubeFrame(host, now) {
  const m = MODELS.get('had-potential'), svg = host.querySelector('.ep-plot[data-plot="had-potential"] svg');
  if (!m || !m.tube || !svg) return;
  const tb = m.tube, auto = tb.rLo + (tb.rHi - tb.rLo) * (0.5 - 0.5 * Math.cos(now / 1000 * 2 * Math.PI / 7));
  const r = STATE.tubeR !== null && now < STATE.tubeHold ? STATE.tubeR : auto, V = interp(tb.x, tb.y, r), X0 = m.sx(0), X = m.sx(r), y = tb.yq;
  const curve = m.panels[0].series.find((s) => s.x === tb.x) || m.panels[0].series[0], Y = interp(curve.px, curve.py, X);
  let d = `M${px(X0 + 9)} ${y}`; const n = 28, len = X - X0 - 18;
  for (let i = 1; i <= n; i++) { const u = i / n; d += `L${px(X0 + 9 + len * u)} ${px(y + 2.6 * Math.sin(u * len / 9 - now / 170) * Math.sin(Math.PI * u))}`; }
  const set = (sel, a) => { const el = svg.querySelector(sel); if (el) for (const k in a) el.setAttribute(k, a[k]); return el; };
  set('.ep-tube-glow', { d }); set('.ep-tube-core', { d }); set('.ep-tube-a', { cx: px(X) }); set('.ep-tube-al', { x: px(X) });
  set('.ep-tube-drop', { x1: px(X), x2: px(X), y2: px(Y) }); set('.ep-tube-dot', { cx: px(X), cy: px(Y) });
  const e = set('.ep-tube-e', { x: px(Math.max(m.x0 + 60, Math.min(m.x1 - 60, (X0 + X) / 2))) });
  if (e && !(now - (tb.said || 0) < 140)) { tb.said = now; const txt = `energy ${V.toFixed(2)} at r = ${r.toFixed(1)}`; if (e.textContent !== txt) e.textContent = txt; }   // text a few times a second: every change wakes the help layer
}

// ---- the plasma: an illustration driven by two measured numbers, the slope of the potential below and above the
// transition. Colour charges move freely while the slope is small; below the transition every charge is pulled to
// its nearest partners with a constant force (the linear potential), into pairs and triples without net colour.
let PLASMA = null;
const QC = [INK.rose, INK.green, INK.blue];
function plasmaSize(host) {
  const box = host.querySelector('.ep-plasma'), cv = box && box.querySelector('canvas');
  if (!cv) { PLASMA = null; return; }
  const W = Math.floor(box.clientWidth), H = 300, dpr = Math.min(2, window.devicePixelRatio || 1);
  if (!(W > 0)) return;
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  const bind = bindingOf(DATA.had);
  if (!bind) { PLASMA = null; return; }
  if (!PLASMA || PLASMA.cv !== cv) {
    let seed = 20261111; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const parts = [];
    for (let c = 0; c < 3; c++) { for (let i = 0; i < 9; i++) parts.push({ c, anti: false }); for (let i = 0; i < 3; i++) parts.push({ c, anti: true }); }
    for (const p of parts) { p.x = (0.03 + 0.94 * rnd()) * W; p.y = (0.1 + 0.72 * rnd()) * H; p.vx = (rnd() - 0.5) * 160; p.vy = (rnd() - 0.5) * 160; }
    PLASMA = { cv, parts, groups: [], T: 1.5, auto: true, phase: 0, last: 0, rnd, bound: false, W, H };
  } else for (const p of PLASMA.parts) { p.x *= W / PLASMA.W; }
  PLASMA.W = W; PLASMA.H = H; PLASMA.dpr = dpr; PLASMA.bind = bind;
}
function plasmaBind(P) {                                        // nearest partners first: an antiquark with a quark of its colour, then one quark of each colour
  const d2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2, free = new Set(P.parts), cand = [];
  for (const a of P.parts) if (a.anti) for (const q of P.parts) if (!q.anti && q.c === a.c) cand.push([d2(a, q), a, q]);
  cand.sort((x, y) => x[0] - y[0]); P.groups = [];
  for (const [, a, q] of cand) if (free.has(a) && free.has(q)) { free.delete(a); free.delete(q); P.groups.push([a, q]); }
  const rg = [];
  for (const r of free) if (r.c === 0) for (const g of free) if (g.c === 1) rg.push([d2(r, g), r, g]);
  rg.sort((x, y) => x[0] - y[0]);
  for (const [, r, g] of rg) {
    if (!free.has(r) || !free.has(g)) continue;
    let b = null, bd = Infinity; const mid = { x: (r.x + g.x) / 2, y: (r.y + g.y) / 2 };
    for (const q of free) if (q.c === 2) { const dd = d2(mid, q); if (dd < bd) { bd = dd; b = q; } }
    if (!b) break;
    free.delete(r); free.delete(g); free.delete(b); P.groups.push([r, g, b]);
  }
}
function plasmaFrame(host, now) {
  const P = PLASMA; if (!P) return;
  const real = Math.max(0, Math.min(0.3, (now - (P.last || now)) / 1000)), sub = Math.max(1, Math.ceil(real / 0.02)), dt = real / sub; P.last = now;
  if (P.auto) {                                                 // two seconds hot, ten seconds of cooling, six seconds bound, four seconds of reheating
    P.phase = (P.phase + real) % 22; const u = P.phase;
    P.T = u < 2 ? 1.5 : u < 12 ? 1.5 - (u - 2) / 10 * 0.9 : u < 18 ? 0.6 : 0.6 + (u - 18) / 4 * 0.9;
  }
  const b = P.bind.at(P.T), cold = P.T < 1, W = P.W, H = P.H;
  if (cold && !P.bound) { plasmaBind(P); P.bound = true; } else if (!cold && P.bound) { P.bound = false; P.groups = []; }
  const kick = (cold ? 260 : 900) * Math.sqrt(Math.max(0.3, P.T)), damp = cold ? 4.5 : 1.6;
  for (let k = 0; k < sub; k++) {
    for (const p of P.parts) { p.fx = (P.rnd() - 0.5) * kick; p.fy = (P.rnd() - 0.5) * kick; }
    for (const g of P.groups) {                                 // a constant pull towards the centre of the group (the linear potential), and a push that keeps its members apart
      let cx = 0, cy = 0; for (const p of g) { cx += p.x; cy += p.y; } cx /= g.length; cy /= g.length;
      for (const p of g) { const dx = cx - p.x, dy = cy - p.y, r = Math.hypot(dx, dy) || 1e-6, f = 1500 * b * Math.tanh((r - 11) / 9); p.fx += f * dx / r; p.fy += f * dy / r; }
    }
    for (const p of P.parts) {
      p.vx += (p.fx - damp * p.vx) * dt; p.vy += (p.fy - damp * p.vy) * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < 12) { p.x = 12; p.vx = Math.abs(p.vx); } if (p.x > W - 12) { p.x = W - 12; p.vx = -Math.abs(p.vx); }
      if (p.y < 44) { p.y = 44; p.vy = Math.abs(p.vy); } if (p.y > H - 50) { p.y = H - 50; p.vy = -Math.abs(p.vy); }
    }
  }
  const c = P.cv.getContext('2d'); c.setTransform(P.dpr, 0, 0, P.dpr, 0, 0); c.clearRect(0, 0, W, H);
  const heat = Math.max(0, Math.min(1, (P.T - 0.6) / 0.9)), bg = c.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W * 0.62);
  bg.addColorStop(0, `rgba(${Math.round(40 + 150 * heat)},${Math.round(40 + 30 * heat)},${Math.round(90 - 40 * heat)},${0.20 + 0.16 * heat})`); bg.addColorStop(1, 'rgba(4,6,13,0)');
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  c.lineCap = 'round';
  for (const g of P.groups) {                                   // flux tubes: a line for a pair, a star to the centre for a triple
    let cx = 0, cy = 0; for (const p of g) { cx += p.x; cy += p.y; } cx /= g.length; cy /= g.length;
    c.strokeStyle = `rgba(238,242,251,${0.2 + 0.6 * b})`; c.lineWidth = 2.4; c.shadowColor = 'rgba(255,255,255,.8)'; c.shadowBlur = 8;
    c.beginPath(); if (g.length === 2) { c.moveTo(g[0].x, g[0].y); c.lineTo(g[1].x, g[1].y); } else for (const p of g) { c.moveTo(p.x, p.y); c.lineTo(cx, cy); } c.stroke();
  }
  for (const p of P.parts) {
    c.shadowColor = QC[p.c]; c.shadowBlur = 12 + 10 * heat;
    c.beginPath(); c.arc(p.x, p.y, p.anti ? 5 : 5.5, 0, 2 * Math.PI);
    if (p.anti) { c.strokeStyle = QC[p.c]; c.lineWidth = 2.4; c.stroke(); } else { c.fillStyle = QC[p.c]; c.fill(); }
  }
  c.shadowBlur = 0;
  const say = host.querySelector('.ep-plasma-say'), tt = host.querySelector('.ep-plasma-t'), rg = host.querySelector('.ep-plasma-range');
  const text = cold ? `${P.groups.filter((g) => g.length === 2).length} pairs and ${P.groups.filter((g) => g.length === 3).length} triples, each without net colour` : `${P.parts.length} free colour charges`;
  if (say && say.textContent !== text) say.textContent = text;
  const tv = `T = ${P.T.toFixed(2)} T_c`; if (tt && tt.textContent !== tv && !(now - (P.said || 0) < 140)) { P.said = now; tt.textContent = tv; }
  if (rg && P.auto && Math.abs(+rg.value - P.T) > 0.004) rg.value = P.T.toFixed(3);
}
function loop(host) {
  cancelAnimationFrame(raf);
  const step = (now) => { raf = requestAnimationFrame(step); if (!host.offsetParent || document.hidden) return; try { tubeFrame(host, now); plasmaFrame(host, now); } catch (e) { cancelAnimationFrame(raf); console.error('transitions animation', e); } };
  raf = requestAnimationFrame(step);
}
async function refresh(host, force) {
  const [ew, qcd, had] = await Promise.all([loadJson(FILES.ew), loadJson(FILES.qcd), loadJson(HAD_FILE)]);
  const s = JSON.stringify([ew, qcd, had]);
  if (!force && s === stamp) return;
  stamp = s; DATA = { ew, qcd, had }; MODELS = new Map(); render(host);
}
export function mount(host) {
  if (!document.getElementById('epochs-css')) { const l = document.createElement('link'); l.id = 'epochs-css'; l.rel = 'stylesheet'; l.href = new URL('./style/epochs.css', import.meta.url); document.head.appendChild(l); }
  host.innerHTML = pageMarkup(null, null, null, STATE);
  hover(host);
  ready = Promise.all([import('./links.js').then((m) => { links = m.linkList; }).catch(() => {}), import('./progress.js').then((m) => { PROG = m.laneProgress; }).catch(() => {})]).then(() => refresh(host, true)).then(() => loop(host));
  let last = 0, timer = 0;
  new ResizeObserver(() => { const w = host.clientWidth; if (!w || w === last) return; last = w; clearTimeout(timer); timer = setTimeout(() => fill(host), 120); }).observe(host);
}
export function shown(host) { if (ready) ready.then(() => refresh(host, false)).then(() => fill(host)); }
