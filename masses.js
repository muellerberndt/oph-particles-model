// The Masses overview (page "masses"): the relative masses and the rest masses of the model beside the measured values.
// Hero: the three charged leptons on one logarithmic axis with the electron as 1, and the table of rest masses.
// Below: every Standard Model particle at its measured mass on one axis from eV to TeV. A particle with a model value
// carries a filled mark on the axis, a particle without one a hollow mark below it. Every number opens its backing page.
//
// No value is typed here that the site exports elsewhere. Lepton ratios, lepton masses, W, Z and Higgs come from
// results_data.js with the arithmetic and the number formats of its board(), so they equal the rows of the Results page.
// The top quark, the quark masses and the neutrino band are the values of the Full spectrum page (spectrum.js, ROWS),
// which exports nothing: they are typed below, each with its row.
// Comparison rows and tiles: match.js. Help texts: help/masses.js. Style: style/masses.css.
// The dials and the marks move by CSS only, so a hidden page costs nothing. The axis of the strip is drawn at the
// width of its box and again when that width changes.
import { MEAS, CHAIN, HIGGS, register, derivedMeasured, compare, fmtPct, paren } from './results_data.js';
import { matchStyle, table, tiles, devText } from './match.js';

// ---------------------------------------------------------------- values
const R = register(), D = derivedMeasured(), M = MEAS, ME = M.m_e.v;
const rel = (model, m) => compare(model, m.v, m.s).rel;
// agreement as a plain fraction, by the rule of leptons.js: 9.83 ppm is 1 part in 100,000
const partsIn = (r) => { const n = 1 / Math.abs(r), p = 10 ** (Math.floor(Math.log10(n)) - 1); return '1 part in ' + (Math.round(n / p) * p).toLocaleString('en-US'); };

// spectrum.js, ROWS. Set SHOW_TOP to false to list the top quark without a model value.
const SHOW_TOP = true;
const TOP = { model: 171.98782, meas: 172.56, err: 0.31 };                          // row "top", GeV
const QUARKS = [                                                                     // rows "up" to "bottom", GeV
  ['u', 'up quark', 2.16e-3, '2.16 MeV'], ['d', 'down quark', 4.70e-3, '4.70 MeV'], ['s', 'strange quark', 93.5e-3, '93.5 MeV'],
  ['c', 'charm quark', 1.2730, '1.273 GeV'], ['b', 'bottom quark', 4.183, '4.183 GeV'],
];
const NU_BAND = [5e-11, 4.5e-10];                                                    // row "three neutrinos", GeV: 0.05 eV to 0.45 eV

const m_mu = R.mu_e * ME, m_tau = R.tau_e * ME;                                      // MeV, with the measured electron mass
const LEPTONS = [
  { id: 'e', sym: 'e', name: 'electron', c: 'teal', ratio: 1 },
  { id: 'mu', sym: 'μ', name: 'muon', c: 'violet', ratio: R.mu_e, text: R.mu_e.toFixed(6), meas: M.mu_e },
  { id: 'tau', sym: 'τ', name: 'tau', c: 'amber', ratio: R.tau_e, text: R.tau_e.toFixed(4), meas: D.tau_e },
];
const higgsDev = `${fmtPct(rel(HIGGS.lo, M.m_H))} to ${fmtPct(rel(HIGGS.hi, M.m_H))} %`;
const higgsText = `${HIGGS.lo.toFixed(2)} to ${HIGGS.hi.toFixed(2)}`;
const topRel = TOP.model / TOP.meas - 1, topMeas = paren(TOP.meas, TOP.err, 2);

// the rest masses: one list for the table and for the strip. at: measured mass in GeV, the place on the axis.
const REST = [
  { id: 'e', sym: 'e', name: 'electron', unit: 'MeV', at: ME * 1e-3, input: true, measText: M.m_e.text, page: 'leptons' },
  { id: 'mu', sym: 'μ', name: 'muon', unit: 'MeV', at: M.m_mu.v * 1e-3, model: m_mu * 1e-3, modelText: m_mu.toFixed(6), measText: M.m_mu.text, rel: rel(m_mu, M.m_mu), page: 'leptons' },
  { id: 'tau', sym: 'τ', name: 'tau', unit: 'MeV', at: M.m_tau.v * 1e-3, model: m_tau * 1e-3, modelText: m_tau.toFixed(3), measText: M.m_tau.text, rel: rel(m_tau, M.m_tau), page: 'leptons' },
  { id: 'W', sym: 'W', name: 'W boson', note: 'tree level', unit: 'GeV', at: M.m_W.v, model: CHAIN.m_W, modelText: CHAIN.m_W.toFixed(3), measText: M.m_W.text, rel: rel(CHAIN.m_W, M.m_W), page: 'couplings' },
  { id: 'Z', sym: 'Z', name: 'Z boson', note: 'tree level', unit: 'GeV', at: M.m_Z.v, model: CHAIN.m_Z, modelText: CHAIN.m_Z.toFixed(3), measText: M.m_Z.text, rel: rel(CHAIN.m_Z, M.m_Z), page: 'couplings' },
  { id: 'H', sym: 'H', name: 'Higgs', note: 'range', unit: 'GeV', at: M.m_H.v, model: Math.sqrt(HIGGS.lo * HIGGS.hi), modelText: higgsText, measText: M.m_H.text, dev: higgsDev, page: 'spectrum' },
  SHOW_TOP
    ? { id: 't', sym: 't', name: 'top quark', unit: 'GeV', at: TOP.meas, model: TOP.model, modelText: TOP.model.toFixed(2), measText: topMeas, rel: topRel, page: 'spectrum' }
    : { id: 't', sym: 't', name: 'top quark', unit: 'GeV', at: TOP.meas, measText: topMeas, page: 'spectrum' },
];
const devOf = (p) => p.dev || devText(p.rel);
// every particle of the strip: the rows above, the five lighter quarks and the neutrino band
const LADDER = [
  { id: 'nu', sym: 'ν', label: 'neutrinos', name: 'neutrinos', band: NU_BAND, measLine: 'mass scale near 0.05 eV, below 0.45 eV', page: 'spectrum' },
  ...REST.map((p) => ({ ...p, page: p.page === 'couplings' ? 'spectrum' : p.page, measLine: `${p.measText} ${p.unit}` })),
  ...QUARKS.map(([sym, name, at, text]) => ({ id: sym, sym, name, at, measLine: text, page: 'spectrum' })),
];

// ---------------------------------------------------------------- colours: the tokens of index.html, as paint attributes
const C = { teal: '#3fe0d0', muted: '#93a3c0', faint: '#62718f', text: '#eef2fb', surface: '#070b16' };
function readTokens() {
  const cs = getComputedStyle(document.documentElement);
  for (const k of ['teal', 'muted', 'faint', 'text']) { const v = (cs.getPropertyValue('--' + k) || '').trim(); if (/^#[0-9a-f]{6}$/i.test(v)) C[k] = v; }
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

// ---------------------------------------------------------------- relative masses: three leptons on one logarithmic axis
const DECADES = 4;                                                                   // the axis runs from 1 to 10,000
const TICKS = ['1', '10', '100', '1,000', '10,000'];
const pct = (ratio) => (100 * Math.log10(ratio) / DECADES).toFixed(3) + '%';
// one turn of a dial: the speed grows with the logarithm of the ratio; the electron takes 14 seconds
const period = (ratio) => (14 / (1 + 0.9 * Math.log10(ratio))).toFixed(2) + 's';
function leptonRow(l) {
  const d = l.meas ? rel(l.ratio, l.meas) : null;
  const num = l.meas
    ? `<b>${l.text}</b><span class="ms-sub">measured <i>${l.meas.text}</i></span><span class="ms-dev">agrees to ${partsIn(d)}<em>${devText(d)}</em></span>`
    : '<b>1</b><span class="ms-sub">the unit</span>';
  const label = l.meas ? `${l.name} over electron: OPH ${l.text}, measured ${l.meas.text}, ${devText(d)}` : 'electron: the unit';
  return `<button type="button" class="ms-lep" data-page="leptons" data-id="${l.id}" aria-label="${esc(label)}" style="--c:var(--${l.c});--x:${pct(l.ratio)};--xm:${pct(l.meas ? l.meas.v : 1)};--d:${period(l.ratio)}">
    <span class="ms-who"><span class="ms-dial" aria-hidden="true"><i class="ms-hand"></i></span><span class="ms-id"><span class="ms-sym">${l.sym}</span><span class="ms-nm">${l.name}</span></span></span>
    <span class="ms-track" aria-hidden="true"><i class="ms-stem"></i>${l.meas ? '<i class="ms-meas"></i>' : ''}<i class="ms-dot"></i></span>
    <span class="ms-num">${num}</span></button>`;
}
function relativeCard() {
  const more = tiles([
    { name: 'tau / muon', value: R.tau_mu.toFixed(6), nature: D.tau_mu.text, rel: rel(R.tau_mu, D.tau_mu), page: 'leptons' },
    { name: 'Koide Q', value: '2/3', nature: D.koide.text, rel: rel(2 / 3, D.koide), page: 'leptons' },
  ]);
  return `<section class="ms-card ms-rel" aria-label="Relative masses">
    <div class="ms-kick"><span>Relative masses</span><em>electron = 1 · logarithmic axis</em></div>
    <div class="ms-leps">${LEPTONS.map(leptonRow).join('')}</div>
    <div class="ms-axis" aria-hidden="true"><div class="ms-ticks">${TICKS.map((t, i) => `<span style="left:${100 * i / DECADES}%">${t}</span>`).join('')}</div></div>
    ${more}</section>`;
}

// ---------------------------------------------------------------- rest masses: the comparison table
function restCard() {
  const row = (p) => (p.input
    ? { sym: p.sym, name: p.name, value: '<span class="ms-input">input</span>', nature: `${p.measText}<i>${p.unit}</i>`, page: p.page }
    : p.modelText
      ? { sym: p.sym, name: p.name, note: p.note, value: p.modelText, unit: p.unit, nature: p.measText, rel: p.rel, dev: p.dev, page: p.page }
      : { sym: p.sym, name: p.name, nature: `${p.measText}<i>${p.unit}</i>`, open: 'not derived yet', page: p.page });
  const rows = [{ group: 'Charged leptons' }, ...REST.slice(0, 3).map(row), { group: 'W, Z, Higgs, top' }, ...REST.slice(3).map(row)];
  return `<section class="ms-card ms-rest" aria-label="Rest masses">
    <div class="ms-kick"><span>Rest masses</span></div>
    ${table(rows)}</section>`;
}

// ---------------------------------------------------------------- the mass ladder: one logarithmic axis from eV to TeV
const LMIN = -11, LMAX = 3.2;                                                        // log10 of GeV: 0.01 eV to 1.6 TeV
const UNITS = { '-9': '1 eV', '-6': '1 keV', '-3': '1 MeV', 0: '1 GeV', 3: '1 TeV' };
const HAIR = 'rgba(140,170,230,.3)';
// least-squares places for labels that must lie at least gap apart inside [lo, hi]; xs ascending
function spread(xs, gap, lo, hi) {
  const blocks = [];
  xs.forEach((x, i) => {
    blocks.push({ n: 1, sum: x - i * gap });
    while (blocks.length > 1 && blocks[blocks.length - 2].sum / blocks[blocks.length - 2].n > blocks[blocks.length - 1].sum / blocks[blocks.length - 1].n) {
      const b = blocks.pop(), a = blocks[blocks.length - 1]; a.n += b.n; a.sum += b.sum;
    }
  });
  const out = []; let i = 0;
  for (const b of blocks) for (let k = 0; k < b.n; k++, i++) out.push(b.sum / b.n + i * gap);
  for (let j = out.length - 1, lim = hi; j >= 0; j--) { out[j] = Math.min(out[j], lim); lim = out[j] - gap; }
  for (let j = 0, lim = lo; j < out.length; j++) { out[j] = Math.max(out[j], lim); lim = out[j] + gap; }
  return out;
}
const f1 = (x) => x.toFixed(1);
function stripSvg(W) {
  const H = 158, base = 80, pad = W < 560 ? 18 : 30, gap = W < 560 ? 19 : 24;
  const X = (gev) => pad + (W - 2 * pad) * (Math.log10(gev) - LMIN) / (LMAX - LMIN);
  const items = LADDER.map((p, i) => ({ ...p, i, x: p.band ? (X(p.band[0]) + X(p.band[1])) / 2 : X(p.at) })).sort((a, b) => a.x - b.x);
  const up = items.filter((p) => p.model || p.input), down = items.filter((p) => !(p.model || p.input));
  for (const lane of [up, down]) spread(lane.map((p) => p.x), gap, pad - 8, W - pad + 8).forEach((lx, k) => { lane[k].lx = lx; });
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="group" aria-label="Every Standard Model particle at its measured mass, on a logarithmic axis from eV to TeV">`;
  for (let e = Math.ceil(LMIN); e <= Math.floor(LMAX); e++) {
    const x = f1(X(10 ** e));
    if (UNITS[e] === undefined) { s += `<line x1="${x}" y1="${base - 3}" x2="${x}" y2="${base + 3}" stroke="${HAIR}" stroke-width="1"/>`; continue; }
    s += `<line x1="${x}" y1="32" x2="${x}" y2="${base + 54}" stroke="rgba(140,170,230,.16)" stroke-width="1" stroke-dasharray="2 5"/>
      <text x="${x}" y="${base + 70}" text-anchor="middle" class="ms-ax" fill="${C.muted}" font-size="11">${UNITS[e]}</text>`;
  }
  s += `<line x1="${pad - 10}" y1="${base}" x2="${W - pad + 10}" y2="${base}" stroke="${HAIR}" stroke-width="1.2"/>`;
  const group = (p, body, x0, x1, y0, y1) => `<g class="ms-p" data-i="${p.i}" data-page="${p.page}" tabindex="0" role="button" aria-label="${esc(aria(p))}">
    <rect x="${f1(Math.min(x0, x1) - 12)}" y="${y0}" width="${f1(Math.abs(x1 - x0) + 24)}" height="${y1 - y0}" fill="transparent"/>${body}</g>`;
  // without a model value: a hollow mark below the axis, at the measured mass
  for (const p of down) {
    const ly = base + 44;
    let g = '';
    if (p.band) {
      const a = X(p.band[0]), b = X(p.band[1]);
      g += `<rect x="${f1(a)}" y="${base + 12}" width="${f1(b - a)}" height="10" rx="5" fill="rgba(147,163,192,.14)" stroke="${C.muted}" stroke-opacity=".75" stroke-width="1.2" stroke-dasharray="2.4 2.2"/>`;
      if (Math.abs(p.lx - p.x) > 1) g += `<path d="M${f1(p.x)} ${base + 23}L${f1(p.lx)} ${base + 30}" fill="none" stroke="${HAIR}" stroke-width="1"/>`;
    } else {
      g += `<line x1="${f1(p.x)}" y1="${base + 2}" x2="${f1(p.x)}" y2="${base + 11}" stroke="${HAIR}" stroke-width="1"/>
        <circle cx="${f1(p.x)}" cy="${base + 17}" r="5.4" fill="none" stroke="${C.muted}" stroke-width="1.4" stroke-dasharray="2.4 2.2"/>`;
      if (Math.abs(p.lx - p.x) > 1) g += `<path d="M${f1(p.x)} ${base + 23.5}L${f1(p.lx)} ${base + 30}" fill="none" stroke="${HAIR}" stroke-width="1"/>`;
    }
    g += `<text x="${f1(p.lx)}" y="${ly}" text-anchor="middle" class="ms-lb ms-lbo" fill="${C.muted}" font-size="${p.label ? 12.5 : 14}" font-weight="600">${p.label || p.sym}</text>`;
    s += group(p, g, p.x, p.lx, base + 2, ly + 8);
  }
  // with a model value: the measured value as a white line and the model value as a filled mark, on the axis
  for (const p of up) {
    const xm = p.model ? X(p.model) : p.x;
    let g = `<path d="M${f1(p.x)} ${base - 13}V${base - 24}L${f1(p.lx)} 40V28" fill="none" stroke="${HAIR}" stroke-width="1"/>
      <line x1="${f1(p.x)}" y1="${base - 10}" x2="${f1(p.x)}" y2="${base + 10}" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>`;
    g += p.input
      ? `<circle cx="${f1(xm)}" cy="${base}" r="5.4" fill="${C.surface}" stroke="${C.teal}" stroke-width="2"/>`
      : `<circle class="ms-glow" cx="${f1(xm)}" cy="${base}" r="5.6" fill="${C.teal}" stroke="${C.surface}" stroke-width="1.5" style="filter:drop-shadow(0 0 5px ${C.teal})"/>`;
    g += `<text x="${f1(p.lx)}" y="20" text-anchor="middle" class="ms-lb" fill="${C.text}" font-size="15" font-weight="700">${p.sym}</text>`;
    if (p.input) g += `<text x="${f1(p.lx - 10)}" y="19.5" text-anchor="end" class="ms-cap" fill="${C.muted}" font-size="10.5">input</text>`;
    s += group(p, g, p.x, p.lx, 4, base + 12);
  }
  return s + '</svg>';
}
const aria = (p) => `${p.name}: ` + (p.modelText ? `OPH ${p.modelText} ${p.unit}, measured ${p.measLine}, ${devOf(p)}` : p.input ? `measured ${p.measLine}, input` : `${p.measLine}, not derived yet`);
function tipHtml(p) {
  const head = `<div class="ms-th"><b>${p.sym}</b>${p.name}${p.note ? `<i>${p.note}</i>` : ''}</div>`;
  if (p.modelText) return `${head}<div><span>OPH</span>${p.modelText} ${p.unit}</div><div><span>measured</span>${p.measLine}</div><div><span>deviation</span>${devOf(p)}</div>`;
  if (p.input) return `${head}<div><span>measured</span>${p.measLine}</div><div class="ms-tn">input: the unit of the lepton masses</div>`;
  return `${head}<div><span>measured</span>${p.measLine}</div><div class="ms-tn">not derived yet</div>`;
}
const KEY_MODEL = () => `<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><line x1="9" y1="1.5" x2="9" y2="16.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="9" r="4.8" fill="${C.teal}" stroke="${C.surface}" stroke-width="1.2"/></svg>`;
const KEY_OPEN = () => `<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="5.2" fill="none" stroke="${C.muted}" stroke-width="1.4" stroke-dasharray="2.4 2.2"/></svg>`;
function stripCard() {
  return `<section class="ms-card ms-strip" aria-label="Mass ladder">
    <div class="ms-kick"><span>Mass ladder</span><span class="ms-keys"><span class="ms-key">${KEY_MODEL()}model value</span><span class="ms-key">${KEY_OPEN()}not derived yet</span></span></div>
    <div class="ms-plot"><div class="ms-svg"></div><div class="ms-tip" role="status"></div></div></section>`;
}

// ---------------------------------------------------------------- page
let HOST = null, drawn = 0, inTimer = 0;
function draw() {
  const box = HOST && HOST.querySelector('.ms-plot'); if (!box) return;
  const W = Math.round(box.clientWidth);
  if (W < 160 || W === drawn) return;                                 // a hidden page has no width and keeps its drawing
  drawn = W; box.querySelector('.ms-svg').innerHTML = stripSvg(W);
}
function wire(host) {
  const open = (el) => import('./app.js').then((m) => m.showPage(el.dataset.page));
  host.addEventListener('click', (e) => { const el = e.target.closest('[data-page]'); if (el && host.contains(el)) open(el); });
  host.addEventListener('keydown', (e) => { const el = e.target; if ((e.key === 'Enter' || e.key === ' ') && el.matches && el.matches('g.ms-p')) { e.preventDefault(); open(el); } });
  // one tooltip for the marks of the strip
  const box = host.querySelector('.ms-plot'), tip = box.querySelector('.ms-tip');
  const place = (x, y) => { tip.style.left = Math.max(4, Math.min(box.clientWidth - tip.offsetWidth - 4, x + 14)) + 'px'; tip.style.top = Math.max(-6, y - tip.offsetHeight - 12) + 'px'; };
  const lit = (g) => { tip.innerHTML = tipHtml(LADDER[+g.dataset.i]); tip.style.display = 'block'; box.classList.add('hov'); box.querySelectorAll('.ms-p.on').forEach((o) => o.classList.remove('on')); g.classList.add('on'); };
  const dark = () => { tip.style.display = 'none'; box.classList.remove('hov'); box.querySelectorAll('.ms-p.on').forEach((o) => o.classList.remove('on')); };
  const at = (e) => { const b = box.getBoundingClientRect(); place(e.clientX - b.left, e.clientY - b.top); };
  box.addEventListener('mouseover', (e) => { const g = e.target.closest('.ms-p'); if (g) { lit(g); at(e); } });
  box.addEventListener('mousemove', (e) => { if (e.target.closest('.ms-p')) at(e); });
  box.addEventListener('mouseout', (e) => { const g = e.target.closest('.ms-p'); if (g && !g.contains(e.relatedTarget)) dark(); });
  box.addEventListener('focusin', (e) => { const g = e.target.closest('.ms-p'); if (!g) return; lit(g); const b = box.getBoundingClientRect(), r = g.getBoundingClientRect(); place(r.left - b.left + r.width / 2, r.top - b.top + 8); });
  box.addEventListener('focusout', dark);
  if (window.ResizeObserver) new ResizeObserver(draw).observe(box); else window.addEventListener('resize', draw);
}
export function mount(host) {
  if (!document.getElementById('ms-css')) { const l = document.createElement('link'); l.id = 'ms-css'; l.rel = 'stylesheet'; l.href = new URL('./style/masses.css', import.meta.url); l.onload = draw; document.head.appendChild(l); }
  matchStyle(); readTokens(); HOST = host;
  host.innerHTML = `<div class="ms-wrap">
    <div class="ms-head"><h2>Masses</h2><div class="ms-lead">Relative masses and rest masses of the model beside the measured values.</div></div>
    <div class="ms-hero">${relativeCard()}${restCard()}</div>
    ${stripCard()}
    <nav class="ms-foot" aria-label="Detail pages">
      <button type="button" class="ms-go" data-page="leptons">How the lepton ratios arise ›</button>
      <button type="button" class="ms-go" data-page="spectrum">Every particle, by status ›</button>
      <button type="button" class="ms-go" data-page="couplings">The coupling chain ›</button></nav></div>`;
  wire(host);
  // help.js attaches its badges when the page changes, and the entries of this page can arrive after the page is drawn:
  // one change of a class on the page, once the entries are there, brings the badges
  import('./help/masses.js').then(() => setTimeout(() => host.firstElementChild && host.firstElementChild.classList.add('ms-hq'), 40)).catch(() => {});
}
// every time the page opens: the marks of the three leptons slide to their places, and the strip takes the width on screen
export function shown(host) {
  const wrap = host.querySelector('.ms-wrap'); if (!wrap) return;
  clearTimeout(inTimer); wrap.classList.remove('ms-in'); void wrap.offsetWidth;
  inTimer = setTimeout(() => wrap.classList.add('ms-in'), 60);
  draw();
}
