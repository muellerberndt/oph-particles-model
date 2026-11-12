// The Results board (page "results"): every value the model recovers, in the three groups of the theory session.
// Derived: the matrix of exact matches, particle by quantity, and the exact statements, each with an executable
// certificate. Conditional: every number the model computes against its measured value on one logarithmic deviation
// axis from 0.1 ppm to 100 percent, the two lepton ratios first and largest; the selected row says in plain words
// what it is. Open: what the source does not give yet, as a short list. Details open on click, and every item links
// to its backing. A mass that is not yet correctly derived carries the chip "derivation incomplete".
// All values and sentences live in results_data.js; this file only draws them. Files of the research lanes are read
// when they exist; a file marked placeholder never shows its numbers, and a lane that is still running shows its
// progress bar.
import { linkList, SRC, RER, SITE, DER } from './links.js';
import { tex, typeset } from './math.js';
import { S, showPage } from './app.js';
import { laneProgress, busy } from './progress.js';
import { STATUS, TICKS, FILES, REF, PLACEHOLDER_LABEL, INCOMPLETE_LABEL, axisX, board, fmtDev, fmtPct, fmtSigma } from './results_data.js';

const BASE = { RER, DER, SITE, URL: '' };
const SURFACE = '#070b16';
// where each result is shown on this site: label, and the module that must exist for pages added later
const PAGES = {
  classes: ['Particles · Classes'], decoder: ['Particles · Decoder', './decoder.js'], carrier: ['Holographic screen · One carrier'], defects: ['Defects · Catalogue'],
  readout: ['Field · Continuum field'], spectrum: ['Masses · Spectrum'], cosmos: ['Early universe · First defects'], leptons: ['Masses · Leptons', './leptons.js'],
  couplings: ['Masses · Couplings', './couplings_page.js'], transitions: ['Early universe · Phase transitions', './transitions.js'],
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let LIVE = {}, signature = '', tip = null, selected = 'mu_e', B = null;

// ---------------------------------------------------------------- glyphs: one shape per status
function glyph(shape, hollow = false, size = 14) {
  const fill = hollow ? SURFACE : 'currentColor', stroke = hollow ? 'currentColor' : SURFACE, w = hollow ? 1.8 : 1.4;
  const a = `fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"`;
  const body = shape === 'diamond' ? `<path d="M0 -5.6L5.6 0L0 5.6L-5.6 0Z" ${a}/>`
    : shape === 'square' ? `<rect x="-4.3" y="-4.3" width="8.6" height="8.6" rx="1.4" ${a}/>`
      : shape === 'cross' ? `<path d="M-4 -4L4 4M4 -4L-4 4" fill="none" stroke="${SURFACE}" stroke-width="5" stroke-linecap="round"/><path d="M-4 -4L4 4M4 -4L-4 4" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/>`
        : `<circle r="4.7" ${a}/>`;
  return `<svg width="${size}" height="${size}" viewBox="-7 -7 14 14" aria-hidden="true">${body}</svg>`;
}
// status chips: the same pill on every page of the site
const chip = (status, text) => `<span class="rs-chip" style="--c:${STATUS[status].css}">${text || STATUS[status].label}</span>`;
const incChip = () => `<span class="rs-chip rs-inc" style="--c:var(--red)">${INCOMPLETE_LABEL}</span>`;
const phChip = () => `<span class="rs-chip rs-phc" style="--c:var(--amber)"><i class="rs-phd"></i>${PLACEHOLDER_LABEL}</span>`;
const prog = (lane) => `<span class="rs-prog" data-lane="${lane}"></span>`;      // filled with the lane's progress bar after the draw

// ---------------------------------------------------------------- pictograms of the cards (viewBox 72 x 52)
const CLS = { 1: ['#ff7a45', 'disc'], 5: ['#ff7a45', 'ring'], 4: ['#ffb347', 'disc'], 2: ['#ffb347', 'ring'], 3: ['#3ee6a8', 'duo'], 0: ['#9fb0cf', 'flat'] };
function node(k, x, y, r = 4.4) {
  const [c, s] = CLS[k];
  return s === 'ring' ? `<circle cx="${x}" cy="${y}" r="${r - 0.9}" fill="none" stroke="${c}" stroke-width="1.9"/>`
    : s === 'duo' ? `<circle cx="${x}" cy="${y}" r="${r - 1.7}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#4cc3ff" stroke-width="1.2"/>`
      : s === 'flat' ? `<circle cx="${x}" cy="${y}" r="${r - 0.9}" fill="none" stroke="${c}" stroke-width="1.1" stroke-dasharray="2 2"/>`
        : `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
}
const PICT = {
  classes() {
    const p = [0, 1, 2, 3, 4, 5].map((k) => { const a = (-90 + 60 * k) * Math.PI / 180; return [36 + 19 * Math.cos(a), 26 + 19 * Math.sin(a)]; });
    const chord = (a, b) => `<line x1="${p[a][0]}" y1="${p[a][1]}" x2="${p[b][0]}" y2="${p[b][1]}" stroke="currentColor" stroke-opacity=".35" stroke-width="1"/>`;
    return `<circle cx="36" cy="26" r="19" fill="none" stroke="currentColor" stroke-opacity=".22"/>${chord(1, 5)}${chord(2, 4)}${p.map(([x, y], k) => node(k, x.toFixed(1), y.toFixed(1))).join('')}`;
  },
  statistics() {
    const turn = (x) => `<path d="M${x + 10.5} 21A11 11 0 1 0 ${x + 9.4} 28.2" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="1.2" stroke-linecap="round"/><path d="M${x + 7.2} 22.2L${x + 10.6} 20.6L${x + 12.2} 24" fill="none" stroke="currentColor" stroke-opacity=".8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `${turn(19)}<circle cx="19" cy="23" r="3.6" fill="currentColor"/><text x="19" y="47" text-anchor="middle" class="rs-pt">−1</text>
      ${turn(53)}<path d="M53 18.4L57 20.7V25.3L53 27.6L49 25.3V20.7Z" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="53" y="47" text-anchor="middle" class="rs-pt">+1</text>`;
  },
  gauge() {
    const hand = (x, i) => `<line class="rs-hand" style="--d:${[9, 13, 7, 11, 16][i]}s;--a:${[20, 140, 260, 75, 200][i]}deg;transform-origin:${x}px 26px" x1="${x}" y1="26" x2="${x}" y2="20.5" stroke="#fff" stroke-opacity=".85" stroke-width="1.2" stroke-linecap="round"/>`;
    return [9, 22, 35].map((x, i) => `<circle cx="${x}" cy="26" r="5.6" fill="rgba(255,122,69,.10)" stroke="#ff7a45" stroke-width="1.3"/>${hand(x, i)}`).join('')
      + [50, 63].map((x, i) => `<rect x="${x - 5.6}" y="20.4" width="11.2" height="11.2" rx="2.6" fill="rgba(177,151,255,.10)" stroke="#b197ff" stroke-width="1.3"/>${hand(x, i + 3)}`).join('')
      + '<path d="M3.5 39H40.5M44.5 39H68.5" stroke="currentColor" stroke-opacity=".4" stroke-width="1"/><text x="22" y="48" text-anchor="middle" class="rs-pt">3</text><text x="56.5" y="48" text-anchor="middle" class="rs-pt">2</text>';
  },
  count4() {
    const v = [12 / 5, 3, 4, 3, 12 / 5], lab = ['12/5', '3', '4', '3', '12/5'];
    return v.map((h, i) => { const x = 6 + 13 * i, hh = h * 8.6; return `<rect x="${x}" y="${44 - hh}" width="8.5" height="${hh}" rx="2" fill="currentColor" fill-opacity="${i === 2 ? 1 : 0.3}"/><text x="${x + 4.25}" y="${40 - hh}" text-anchor="middle" class="rs-pt"${i === 2 ? ' style="fill:#fff;font-weight:700"' : ''}>${lab[i]}</text>`; }).join('')
      + '<line x1="3" y1="44.5" x2="69" y2="44.5" stroke="currentColor" stroke-opacity=".35"/>';
  },
  bl() {
    return `<circle cx="20" cy="22" r="6.2" fill="currentColor"/><circle cx="52" cy="22" r="5.3" fill="none" stroke="currentColor" stroke-width="1.9"/>
      <path d="M31.5 19.6H40.5M31.5 24.4H40.5M38.6 16.5L33.4 27.5" fill="none" stroke="currentColor" stroke-opacity=".7" stroke-width="1.3" stroke-linecap="round"/>
      <text x="20" y="44" text-anchor="middle" class="rs-pt">ν</text><text x="52" y="44" text-anchor="middle" class="rs-pt">ν̅</text>`;
  },
  run() {
    return `<path d="M13 12L35 26L13 40" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="1.2" stroke-linejoin="round"/><path d="M35 26H47M43.5 22.8L47 26L43.5 29.2" fill="none" stroke="currentColor" stroke-opacity=".7" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      ${node(4, 11, 11, 4.8)}${node(2, 11, 41, 4.8)}${node(0, 58, 26, 6.4)}`;
  },
  koide() {
    const x0 = 13, u = 14, cx = x0 + u, cy = 22, r = Math.SQRT2 * u, th = 2 / 9;
    const pt = [0, 1, 2].map((k) => { const a = th + 2 * Math.PI * k / 3; return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; });
    const name = ['τ', 'e', 'μ'], dx = [6, -1, 7], dy = [-4, -5, 4];
    return `<line x1="${x0}" y1="1" x2="${x0}" y2="48" stroke="currentColor" stroke-opacity=".3"/><line x1="${x0}" y1="47.5" x2="70" y2="47.5" stroke="currentColor" stroke-opacity=".3"/>
      <circle cx="${cx}" cy="${cy}" r="${r.toFixed(2)}" fill="none" stroke="currentColor" stroke-opacity=".3"/>
      <path d="M${pt.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L')}Z" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-opacity=".4" stroke-width="1"/>
      ${pt.map((q, k) => `<line x1="${q[0].toFixed(1)}" y1="${q[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="47.5" stroke="#fff" stroke-opacity=".28" stroke-width="1"/><circle cx="${q[0].toFixed(1)}" cy="47.5" r="1.7" fill="#fff"/><circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="3.4" fill="currentColor"/><text x="${(q[0] + dx[k]).toFixed(1)}" y="${(q[1] + dy[k] + 3).toFixed(1)}" text-anchor="middle" class="rs-pt">${name[k]}</text>`).join('')}`;
  },
  dirac() {
    const m = 8, pts = []; for (let p = -27; p <= 27; p += 3) pts.push([36 + p, 44 - Math.sqrt(p * p + m * m)]);
    return `<path d="M9 17L36 44L63 17" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1"/><line x1="5" y1="44.5" x2="67" y2="44.5" stroke="currentColor" stroke-opacity=".3"/>
      <path d="M${pts.map((q) => q[0] + ' ' + q[1].toFixed(1)).join('L')}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
      ${pts.filter((q, i) => i % 3 === 0).map((q) => `<circle cx="${q[0]}" cy="${q[1].toFixed(1)}" r="2" fill="${SURFACE}" stroke="currentColor" stroke-width="1.2"/>`).join('')}`;
  },
  lift() {
    return '<line x1="6" y1="30" x2="66" y2="30" stroke="currentColor" stroke-opacity=".4"/>' + [-6, -3, 0, 3, 6].map((n, i) => `<circle cx="${10 + 13 * i}" cy="30" r="${n ? 3 : 4}" fill="${n ? SURFACE : 'currentColor'}" stroke="currentColor" stroke-width="1.3"/><text x="${10 + 13 * i}" y="45" text-anchor="middle" class="rs-pt">${n > 0 ? '+' + n : n < 0 ? '−' + -n : 0}</text>`).join('')
      + '<path d="M36 25Q49 6 62 25" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-dasharray="2 2"/><path d="M36 25Q23 6 10 25" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-dasharray="2 2"/>';
  },
  dial() {
    const a = 2 / 9;
    return `<circle cx="36" cy="26" r="19" fill="none" stroke="currentColor" stroke-opacity=".3"/><line x1="36" y1="26" x2="55" y2="26" stroke="#fff" stroke-opacity=".3"/>
      <line x1="36" y1="26" x2="${(36 + 19 * Math.cos(a)).toFixed(1)}" y2="${(26 - 19 * Math.sin(a)).toFixed(1)}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="36" cy="26" r="2.2" fill="currentColor"/><text x="36" y="42" text-anchor="middle" class="rs-pt">2/9</text>`;
  },
  balance() {
    return '<path d="M36 10V40M24 44H48" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="1.3" stroke-linecap="round"/><path d="M14 18L58 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
      + '<path d="M8 30A6 6 0 0 0 20 30Z" fill="currentColor" fill-opacity=".5"/><path d="M52 26A6 6 0 0 0 64 26Z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M14 18V30M58 14V26" stroke="currentColor" stroke-opacity=".5"/>';
  },
};
const pict = (name) => `<svg viewBox="0 0 72 52" aria-hidden="true">${PICT[name] ? PICT[name]() : ''}</svg>`;

// ---------------------------------------------------------------- links and panels
function links(keys = [], more = []) {
  const extra = more.length ? `<div class="src-links">${more.map(([t, b, p]) => `<a href="${BASE[b] + p}" target="_blank" rel="noopener">${t} ↗</a>`).join('')}</div>` : '';
  return extra + linkList(keys.filter((k) => SRC[k]));
}
const refLink = (m, cite, url) => { const r = REF[m.ref] || {}; return `<a href="${url || r.url}" target="_blank" rel="noopener">${esc(cite || r.name)} ↗</a>`; };
const goLink = (page) => (PAGES[page] ? `<button class="rs-go" data-page="${page}" hidden>${PAGES[page][0]} ›</button>` : '');
const lanePanel = (l) => (l.status ? `<div class="rs-p rs-pre">${esc(l.status)}</div>` : '')
  + l.statements.slice(0, 10).map((s) => `<div class="rs-stm"><i>${esc(s.label || 'statement')}</i><span>${esc(s.text)}</span></div>`).join('');
function cardPanel(c) {
  let h = c.text ? `<div class="rs-p">${c.text}</div>` : '';
  if (c.texPanel && c.tex) h += tex(c.tex, true);
  if (c.premises) h += `<div class="rs-p rs-pre"><b>Premises</b> ${c.premises.join(' · ')}</div>`;
  if (c.openInside) h += `<div class="rs-p rs-pre"><b>Open inside it</b> ${c.openInside.join(' · ')}</div>`;
  if (c.lane && c.lane.state === 'ok') h += lanePanel(c.lane);
  if (c.lane && c.lane.state === 'placeholder') h += '<div class="rs-p">The lane file holds placeholder data. Its statements are not shown.</div>';
  return h + links(c.keys, c.more) + goLink(c.page);
}
const formulaOf = (c) => (c.tex && !c.texPanel ? `<span class="tex" data-tex="${esc(c.tex)}">${c.formula}</span>` : c.formula || '');

// ---------------------------------------------------------------- the matrix of exact matches
function matrixHtml(mx) {
  const groups = []; mx.cols.forEach((c) => { const g = groups[groups.length - 1]; if (g && g.name === c.group) g.n++; else groups.push({ name: c.group, n: 1 }); });
  const start = new Set(); let at = 0; groups.forEach((g) => { if (at) start.add(at); at += g.n; });
  const gs = (j) => (start.has(j) ? ' rs-gs' : '');
  let h = `<div class="rs-mxs"><div class="rs-mx" style="--n:${mx.cols.length}" role="table" aria-label="one generation of matter and the gauge fields: every quantity the code gives exactly"><span></span>`;
  h += groups.map((g, i) => `<span class="rs-mgrp${i ? ' rs-gs' : ''}" style="grid-column:span ${g.n}">${g.name}</span>`).join('') + '<span></span>';
  h += mx.cols.map((c, j) => `<span class="rs-mhead${gs(j)}" data-c="${c.id}" style="--j:${j}"><svg width="12" height="12" viewBox="-6 -6 12 12" aria-hidden="true">${node(c.k, 0, 0, 4.2)}</svg><b>${c.sym}</b></span>`).join('');
  for (const r of mx.rows) {
    h += `<span class="rs-mlab" data-r="${r.id}"><b>${r.label}</b>${r.note ? `<i>${r.note}</i>` : ''}</span>`
      + r.cells.map((x, j) => `<span class="rs-cell${x.given ? ' rs-given' : ''}${gs(j)}" data-r="${r.id}" data-c="${x.col}" style="--j:${j}">${x.text}</span>`).join('');
  }
  const base = `One generation of matter and the gauge fields. <b>${mx.exact}</b> cells exact, <b>${mx.given}</b> exact given stated premises.`;
  return h + `</div></div>
    <div class="rs-mfoot"><span class="rs-mread" data-base="${esc(base)}">${base}</span>
      <span class="rs-mkey"><i class="rs-dot"></i>exact<i class="rs-dot rs-dotg"></i>exact given stated premises</span>
      <button class="rs-more" aria-expanded="false">details</button></div>
    <div class="rs-panel"><div class="rs-p">The 32 occupation patterns of the five-level code are one generation of quarks and leptons with a right-handed neutrino, and their antiparticles, with these representations and charges. The antiparticle of each state has the conjugate representations and the opposite charges. The twelve currents are eight gluons, three W fields and one B field. The anomaly sums vanish.</div>
      <div class="rs-p rs-pre"><b>Given</b> statistics: a spin doublet per quantum · the Gauss law · antisymmetric occupation. Higgs column: the register is a declared construction.</div>
      ${links(['classes'], mx.more)}${goLink('decoder')}</div>`;
}

// ---------------------------------------------------------------- statements, cards, open items
function statement(c) {                  // one row of the list of exact statements
  const note = c.premises ? c.premises.length + ' premises' : c.evidence || '';
  return `<article class="rs-li" data-id="${c.id}" style="--c:${STATUS[c.status].css}" tabindex="0" role="button" aria-expanded="false">
    <div class="rs-pic">${pict(c.pict)}</div>
    <div class="rs-ct"><h4>${c.title}</h4><div class="rs-f">${formulaOf(c)}</div></div>
    <div class="rs-lic">${chip(c.status)}${note ? `<span class="rs-s">${note}</span>` : ''}</div>
    <div class="rs-panel"><div class="rs-p rs-pre">${c.sub}</div>${cardPanel(c)}</div></article>`;
}
function card(c, cls) {
  const st = c.lane ? c.lane.state : 'ok';
  const foot = st === 'placeholder' ? phChip() + prog(c.laneId) : st === 'missing' ? prog(c.laneId)
    : chip(c.status) + (c.lane ? `<span class="rs-s">${c.lane.statements.length} statements</span>` : c.evidence ? `<span class="rs-s">${c.evidence}</span>` : '');
  return `<article class="rs-card rs-box${cls}" data-id="${c.id}" style="--c:${STATUS[c.status].css}" tabindex="0" role="button" aria-expanded="false">
    <div class="rs-ch"><div class="rs-pic">${pict(c.pict)}</div><div class="rs-ct"><h4>${c.title}</h4>${c.formula ? `<div class="rs-f">${formulaOf(c)}</div>` : ''}</div></div>
    <div class="rs-s rs-sub">${c.sub || ''}</div>
    <div class="rs-foot">${foot}</div>
    <div class="rs-panel">${cardPanel(c)}</div></article>`;
}
// equal cards in a row: thirds, or four across; a last row of one card spans the row, a last row of two shares it
function cards(list) {
  const n = list.length, four = n === 4;
  return list.map((c, i) => card(c, (four ? '' : n % 3 === 1 && i === n - 1 ? ' rs-full' : n % 3 === 2 && i >= n - 2 ? ' rs-half' : '') + (n % 2 === 1 && i === n - 1 ? ' rs-oddlast' : ''))).join('');
}
function openItem(o) {
  return `<article class="rs-oi" data-id="${o.id}" data-marks="${o.marks.join(' ')}" style="--c:${STATUS.open.css}" tabindex="0" role="button" aria-expanded="false">
    <span class="rs-ox">${glyph('cross', false, 13)}</span><div class="rs-ct"><h4>${o.title}</h4><div class="rs-s">${o.sub}</div></div>
    <div class="rs-panel">${cardPanel(o)}</div></article>`;
}

// ---------------------------------------------------------------- the deviation chart
const pct = (x) => (100 * x).toFixed(2) + '%';
let markIndex = 0;
function mark(cmp, status, { hollow = false, second = false, label = '' } = {}) {
  const p = axisX(cmp.rel), s = STATUS[status];
  return `<i class="rs-m${second ? ' rs-m2' : ''}${p.under || p.over ? ' rs-off' : ''}" style="left:${pct(p.x)};--c:${s.css};--i:${markIndex++}" data-dev="${fmtDev(cmp.rel)}" data-sig="${cmp.sigma !== null && cmp.sigma !== undefined ? esc(fmtSigma(cmp.sigma)) : ''}" data-label="${esc(label)}">${glyph(s.shape, hollow)}</i>`;
}
function track(r, status) {
  let h = '';
  if (r.range) {
    const hi = r.range.reduce((a, b) => (Math.abs(a.rel) > Math.abs(b.rel) ? a : b)), lo = r.range.reduce((a, b) => (Math.abs(a.rel) > Math.abs(b.rel) ? b : a));
    const inside = r.range[0].rel * r.range[1].rel <= 0, x1 = axisX(hi.rel).x, x0 = inside ? 0 : axisX(lo.rel).x;
    const band = hi.relSigma ? axisX(hi.relSigma) : null;
    if (band && !band.under) h += `<b class="rs-sig" style="width:${pct(band.x)}"></b>`;
    h += `<b class="rs-range" style="left:${pct(x0)};width:${pct(x1 - x0)};--c:${STATUS[status].css}"></b>` + mark(hi, status, { label: 'far end of the range' });
    if (!inside) h += mark(lo, status, { label: 'near end of the range' });
    return h;
  }
  if (!r.cmp) return h;
  if (r.cmp.relSigma) { const b = axisX(r.cmp.relSigma); if (!b.under) h += `<b class="rs-sig" style="width:${pct(b.x)}"></b>`; }
  if (r.second) h += mark(r.second.cmp, r.second.status, { hollow: !!r.second.hollow, second: true, label: r.second.label + (r.second.valueText ? ': ' + r.second.valueText : '') });
  return h + mark(r.cmp, status, { label: 'model against measured' });
}
const devText = (r) => (r.cmp ? fmtDev(r.cmp.rel) : r.range ? `${fmtPct(r.range[0].rel)} to ${fmtPct(r.range[1].rel)} %` : '');
function chart(groups) {
  markIndex = 0;
  const n = TICKS.length - 1;
  let h = `<div class="rs-chart rs-box" role="table" aria-label="model values, measured values and deviations">
    <div class="rs-row rs-axis" role="row"><span></span><span class="rs-th rs-right rs-hm" data-h="model">model</span><span class="rs-th rs-right rs-hm" data-h="measured">measured</span>
      <div class="rs-ticks"><em style="left:0;width:${pct(3 / n)}">parts per million</em><em style="left:${pct(4 / n)};width:${pct(3 / n)}">percent</em>
        ${TICKS.map(([, t], i) => `<i style="left:${pct(i / n)}" class="${i === 0 ? 'rs-t0' : i === n ? 'rs-t1' : ''}">${t.replace(/ (ppm|%)/, '')}</i>`).join('')}
        <u class="rs-t0" style="left:0">0.1 ppm</u><u style="left:${pct(4 / n)}">0.1 %</u><u class="rs-t1" style="left:100%">100 %</u></div>
      <span class="rs-th rs-right" data-h="deviation">deviation</span><span class="rs-th rs-stc" data-h="status">status</span></div>`;
  for (const g of groups) {
    h += `<div class="rs-g" data-g="${g.id}" style="--c:${STATUS[g.status].css}"><b>${g.title}</b><span>${g.note}</span></div>`;
    for (const r of g.rows) {
      const st = r.status || g.status, wait = r.state === 'placeholder' || r.state === 'missing';
      const cls = (r.hero ? ' rs-hero' : '') + (wait ? ' rs-waitrow' : '') + (r.id === selected ? ' sel' : '');
      const first = `<div class="rs-sym">${r.sym}${r.unit ? `<em>${r.unit}</em>` : ''}</div><div class="rs-num">${r.modelText || '–'}</div><div class="rs-num rs-meas">${r.meas ? r.meas.text : '–'}</div>`;
      const rest = wait ? `<div class="rs-track rs-wide">${r.state === 'placeholder' ? phChip() : ''}${prog(r.laneId)}</div>`
        : r.none ? `<div class="rs-track rs-t2"><span class="rs-none">${r.none}</span></div><div class="rs-stc">${chip(st)}</div>`
          : `<div class="rs-track">${track(r, st)}</div><div class="rs-dev">${devText(r)}</div><div class="rs-stc">${r.incomplete ? incChip() : chip(st)}</div>`;
      h += `<div class="rs-row rs-r${cls}" role="row" data-id="${r.id}" style="--c:${STATUS[st].css}" tabindex="0" aria-expanded="${r.id === selected}">${first}${rest}</div>`;
    }
  }
  return h + '</div>';
}
// the strip under the selected row: what the row is, in plain words; its numbers; its sources
function stripHtml(r, g) {
  const st = r.status || g.status, f = [];
  let nums = `<div class="rs-wn"><span>model</span><b>${r.modelText || '–'}${r.modelText && r.unit ? `<em>${r.unit}</em>` : ''}</b></div>`;
  if (r.meas) nums += `<div class="rs-wn"><span>${r.refWord || 'measured'}</span><b>${r.meas.text}${r.unit ? `<em>${r.unit}</em>` : ''}</b></div>`;
  if (r.cmp) nums += `<div class="rs-wn rs-wd"><span>deviation</span><b>${fmtDev(r.cmp.rel)}</b></div>` + (r.cmp.sigma !== null ? `<div class="rs-wn" title="the gap in units of the measurement's own uncertainty; a leading-order model value carries no radiative corrections yet"><span>in measurement errors</span><b>${fmtSigma(r.cmp.sigma).replace(' σ', '')}</b></div>` : '');
  if (r.range) nums += `<div class="rs-wn rs-wd"><span>deviation</span><b>${devText(r)}</b></div>`;
  if (r.state === 'placeholder') f.push('<span>The lane file holds placeholder data. Its numbers are not shown.</span>');
  else if (r.state === 'missing') f.push('<span>The lane has no value on file yet.</span>');
  if (r.meas) f.push(`<span>${r.refWord || 'measured'} value: ${refLink(r.meas, r.cite, r.refUrl)}</span>`);
  if (r.id === 'm_H') f.push(`<span>top mass 172.1 GeV: ${refLink({ ref: 'pdg26' })}</span>`);
  if (r.none && r.lane) f.push(`<span>${r.none}</span>`);
  for (const x of r.facts || []) f.push(`<span>${x}</span>`);
  if (r.routeNote) f.push(`<span>${esc(r.routeNote)}</span>`);
  if (r.route && r.state === 'ok') f.push(`<span>route: ${esc(r.route)}</span>`);
  if (r.note && r.state !== 'placeholder') f.push(`<span>${esc(r.note)}</span>`);
  return `<div class="rs-strip" data-id="${r.id}" style="--c:${STATUS[st].css}">
    <div class="rs-sl"><div class="rs-wk">what this is</div><div class="rs-wt">${r.what || ''}</div>
      ${r.incomplete ? `<div class="rs-p rs-w2">${incChip()}<span>${r.incomplete}</span></div>` : ''}
      ${r.second ? `<div class="rs-p rs-w2"><i style="color:${STATUS[r.second.status].css}">${glyph(STATUS[r.second.status].shape, !!r.second.hollow, 13)}</i><span>${r.second.text} <b>${fmtDev(r.second.cmp.rel)}</b></span></div>` : ''}</div>
    <div class="rs-sr"><div class="rs-wnums">${nums}</div><div class="rs-facts">${f.join('')}</div>${links(r.keys, r.more)}${goLink(g.page)}</div>
    <div class="rs-long" hidden>${r.text || ''}</div></div>`;
}

// ---------------------------------------------------------------- page
function findRow(id) { for (const g of B.groups) for (const r of g.rows) if (r.id === id) return [r, g]; return null; }
function render(host) {
  B = board(LIVE);
  if (selected && !findRow(selected)) selected = B.groups[0].rows[0].id;
  const key = (shape, hollow, colour, text) => `<span><i style="color:${colour}">${glyph(shape, hollow, 12)}</i>${text}</span>`;
  host.innerHTML = `<div class="rs-wrap">
    <div class="rs-head"><div><h2>Numbers and status</h2><div class="rs-lead">Every value of the model beside the Standard Model and the measured value.</div></div>
      <div class="rs-legend">${Object.keys(STATUS).map((k) => `<span class="rs-st" data-s="${k}">${chip(k, STATUS[k].long)}</span>`).join('')}</div></div>

    <section class="rs-sec" data-b="derived" style="--c:var(--teal)"><div class="rs-bh"><h3>The same as the Standard Model</h3><span>every cell equals the Standard Model value · exact, with an executable certificate</span></div>
      <div class="rs-two"><div class="rs-mxwrap rs-box">${matrixHtml(B.matrix)}</div>
        <div class="rs-list rs-box">${B.statements.map(statement).join('')}</div></div></section>

    <section class="rs-sec" data-b="conditional" style="--c:#dfe6f5"><div class="rs-bh"><h3>Numbers beside measurement</h3><span>what the model computes, against the measured value</span>
        <span class="rs-key">${key('diamond', false, 'var(--blue)', 'conditional')}${key('square', false, 'var(--amber)', 'declared')}${key('diamond', true, 'var(--blue)', 'second reading')}${key('cross', false, 'var(--red)', 'the source as built')}<span><b class="rs-sigkey"></b>one σ</span></span></div>
      ${chart(B.groups)}
      <div class="rs-thirds${B.constructions.length + B.lanes.length === 4 ? ' rs-n4' : ''}">${cards(B.constructions.concat(B.lanes))}</div></section>

    <section class="rs-sec" data-b="open" style="--c:var(--red)"><div class="rs-bh"><h3>Open</h3><span>what the model does not give</span></div>
      <div class="rs-olist rs-box">${B.open.map(openItem).join('')}</div></section>
  </div>`;
  wire(host);
  if (selected) select(host, selected);
  typeset(host);
}
async function pageExists(p) {
  if (!PAGES[p] || !document.getElementById('page-' + p)) return false;
  if (!PAGES[p][1]) return true;
  if (PAGES[p][2] === undefined) PAGES[p][2] = fetch(new URL(PAGES[p][1], import.meta.url), { method: 'HEAD' }).then((r) => r.ok).catch(() => false);
  return PAGES[p][2];
}
function activate(root) {                // formulas and the links into the site, for a panel that has just become visible
  typeset(root);
  root.querySelectorAll('.rs-go[hidden]').forEach(async (b) => { if (await pageExists(b.dataset.page)) { b.hidden = false; b.onclick = (e) => { e.stopPropagation(); showPage(b.dataset.page); }; } });
}
function toggle(el, panel) {
  const open = !el.classList.contains('open');
  el.classList.toggle('open', open); el.setAttribute('aria-expanded', String(open));
  if (open) activate(panel);
}
// one row of the chart is open at a time: its strip sits directly under it
function select(host, id, focus = false) {
  const old = host.querySelector('.rs-strip'); if (old) old.remove();
  const hit = id ? findRow(id) : null; selected = hit ? id : '';
  host.querySelectorAll('.rs-r').forEach((r) => { const on = r.dataset.id === selected; r.classList.toggle('sel', on); r.setAttribute('aria-expanded', String(on)); if (on && focus) r.focus(); });
  if (!hit) return;
  const row = host.querySelector(`.rs-r[data-id="${id}"]`);
  row.insertAdjacentHTML('afterend', stripHtml(hit[0], hit[1])); activate(row.nextElementSibling);
}
function wire(host) {
  // statements, cards and open items open in place
  host.querySelectorAll('.rs-li, .rs-card, .rs-oi').forEach((el) => {
    const panel = el.querySelector('.rs-panel');
    el.addEventListener('click', (e) => { if (e.target.closest('a, .hq, .rs-go') || panel.contains(e.target)) return; toggle(el, panel); });
    el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); toggle(el, panel); } });
  });
  // the matrix: a crosshair on hover, the reading of the cell below it, details on click
  const mx = host.querySelector('.rs-mxwrap'), read = mx.querySelector('.rs-mread'), more = mx.querySelector('.rs-more');
  const cross = (r, c) => mx.querySelectorAll('.rs-mx > [data-r], .rs-mx > [data-c]').forEach((el) => el.classList.toggle('hl', (!!r && el.dataset.r === r) || (!!c && el.dataset.c === c)));
  mx.querySelectorAll('.rs-cell, .rs-mhead, .rs-mlab').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const r = el.dataset.r, c = el.dataset.c; cross(r, c);
      const col = c && B.matrix.cols.find((x) => x.id === c), row = r && B.matrix.rows.find((x) => x.id === r);
      if (col && row) { const x = row.cells.find((y) => y.col === c); read.innerHTML = `<b>${col.sym}</b> ${col.name}: ${row.label}${row.note ? ' ' + row.note : ''} <b>${x.text}</b> · ${x.given ? 'exact given stated premises' : 'exact'}`; }
      else if (col) read.innerHTML = `<b>${col.sym}</b> ${col.name}${col.bits ? ' · pattern ' + col.bits + ' on the five levels' : ''}`;
      else if (row) read.innerHTML = `<b>${row.label}</b>${row.note ? ' ' + row.note : ''}: ${row.given ? 'exact given stated premises' : 'exact'} in every column`;
    });
  });
  mx.querySelector('.rs-mx').addEventListener('mouseleave', () => { cross('', ''); read.innerHTML = read.dataset.base; });
  more.addEventListener('click', () => { const open = !mx.classList.contains('open'); mx.classList.toggle('open', open); more.setAttribute('aria-expanded', String(open)); more.textContent = open ? 'close' : 'details'; if (open) activate(mx.querySelector('.rs-panel')); });
  // the chart: a click or the arrow keys open a row; a second click closes it
  const rows = [...host.querySelectorAll('.rs-r')];
  rows.forEach((r, i) => {
    r.addEventListener('click', (e) => { if (!e.target.closest('.hq')) select(host, r.dataset.id === selected ? '' : r.dataset.id); });
    r.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(host, r.dataset.id === selected ? '' : r.dataset.id, true); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const n = rows[i + (e.key === 'ArrowDown' ? 1 : -1)]; if (n) select(host, n.dataset.id, true); }
    });
  });
  // lanes that are still running show their progress
  host.querySelectorAll('.rs-prog[data-lane]').forEach((el) => el.appendChild(laneProgress(el.dataset.lane)));
  // an open item lights the marks that show its number
  host.querySelectorAll('.rs-oi[data-marks]').forEach((c) => {
    const lit = (on) => c.dataset.marks.split(' ').filter(Boolean).forEach((id) => { const r = host.querySelector(`.rs-r[data-id="${id}"]`); if (r) r.classList.toggle('lit', on); });
    c.addEventListener('mouseenter', () => lit(true)); c.addEventListener('mouseleave', () => lit(false));
    c.addEventListener('focus', () => lit(true)); c.addEventListener('blur', () => lit(false));
  });
  // one tooltip for every mark: the value first
  if (!tip) { tip = document.createElement('div'); tip.className = 'rs-tip'; document.body.appendChild(tip); }
  host.querySelectorAll('.rs-m').forEach((m) => {
    const sym = m.closest('.rs-r').querySelector('.rs-sym').innerHTML;
    const html = `<div class="rs-tv" style="color:${m.style.getPropertyValue('--c')}">${m.dataset.dev}</div><div class="rs-tl">${sym} · ${m.dataset.label}</div>${m.dataset.sig ? `<div class="rs-tl">${m.dataset.sig} of the comparison</div>` : ''}`;
    const move = (e) => { const r = tip.getBoundingClientRect(); tip.style.left = Math.max(8, Math.min(innerWidth - r.width - 8, e.clientX + 14)) + 'px'; tip.style.top = Math.max(8, e.clientY - r.height - 12) + 'px'; };
    m.addEventListener('mouseenter', (e) => { tip.innerHTML = html; tip.style.display = 'block'; move(e); });
    m.addEventListener('mousemove', move);
    m.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
  });
}
async function refresh(host) {
  const keys = Object.keys(FILES);
  const vals = await Promise.all(keys.map(async (k) => { try { const r = await fetch(FILES[k], { cache: 'no-store' }); return r.ok ? await r.json() : null; } catch (e) { return null; } }));
  const live = {}; keys.forEach((k, i) => { live[k] = vals[i]; });
  if (S.meta && S.name === 'L6' && S.meta.geometry && S.meta.geometry.level === 6) live.identities = S.meta.identities;
  const sig = JSON.stringify([live.identities, ...keys.map((k) => (live[k] ? [live[k].placeholder === true, live[k].status || '', JSON.stringify(live[k]).length] : null))]);
  if (sig === signature && host.querySelector('.rs-wrap')) return;
  signature = sig; LIVE = live; render(host);
}
export function mount(host) {
  if (!document.getElementById('rs-css')) { const l = document.createElement('link'); l.id = 'rs-css'; l.rel = 'stylesheet'; l.href = new URL('./style/results.css', import.meta.url); document.head.appendChild(l); }
  // shown() draws the board once the result files have answered. A slow answer shows a progress bar first, and after
  // a longer wait the board is drawn from the verified constants.
  setTimeout(() => { if (!host.firstChild) busy(host, 'reading the result files'); }, 300);
  setTimeout(() => { if (!host.querySelector('.rs-wrap')) render(host); }, 2500);
}
export function shown(host) { refresh(host); }
