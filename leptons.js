// The Leptons page (Masses, Leptons): the charged-lepton mass hierarchy from the read count of the carrier.
// First screen: the two ratios, very large, each against its measured value; what exactly is shown; the ladder of the
// three levels and the comparison table. Below: what a lepton is in the model; the chain of four steps computed in this
// browser (sixty addresses, the count 2/9, the weak round, the three rates); the residual; the executed register of lane
// LR; the open items.
// Map into this step: the rest phase per tick is the expected number of reads per tick.
// Sources: repair-law LEPTON_STEPS.md, MATCH.md and reports LC, CK2, LK, LT, LP, LD, FR; the public executables
// RER/model/lepton_register_round (99 checks) and RER/model/defect_particle_classes (61 checks).
// Engine: lepton_round.js (check: lepton_round_check.mjs). Help texts: help/leptons.js. Style: style/leptons.css.
// Every SVG element carries its paint as attributes, so a missing stylesheet rule cannot leave it black.
// Live numbers are written into text nodes and canvases, so the page does not rebuild DOM while it runs.
import { linkList, RER, DER, SITE } from './links.js';
import { tex, typeset } from './math.js';
import { laneProgress } from './progress.js';
import * as L from './lepton_round.js';

if (!document.getElementById('lp-css')) { const l = document.createElement('link'); l.id = 'lp-css'; l.rel = 'stylesheet'; l.href = 'style/leptons.css'; l.onload = () => layout(); document.head.appendChild(l); }

// ---------------------------------------------------------------- colours (from the CSS variables of index.html)
const C = { blue: '#6fb1ff', red: '#ff6480', green: '#5fe3a1', teal: '#3fe0d0', violet: '#a995ff', amber: '#ffb44a', ink: '#eef2fb', soft: '#c5d0e6', muted: '#93a3c0', faint: '#62718f' };
function readTokens() {
  const cs = getComputedStyle(document.documentElement), get = (n, fb) => { const v = (cs.getPropertyValue(n) || '').trim(); return /^#[0-9a-f]{6}$/i.test(v) ? v : fb; };
  for (const k of ['blue', 'red', 'green', 'teal', 'violet', 'amber', 'soft', 'muted', 'faint']) C[k] = get('--' + k, C[k]);
  C.ink = get('--text', C.ink);
}
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const lepCol = (k) => (k === 1 ? C.teal : k === 2 ? C.violet : C.amber);          // electron, muon, tau
const FONT = 'Inter, "SF Pro Text", Helvetica, Arial, sans-serif';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const pow10 = (e) => (e === 0 ? '1' : '10' + String(e).split('').map((c) => SUP[c]).join(''));
const sci = (x) => { if (!(x > 0)) return '0'; const e = Math.floor(Math.log10(x)); return e >= -3 ? x.toPrecision(4) : (x / 10 ** e).toFixed(2) + '×' + pow10(e); };
const signed = (x, d) => (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(d);
const minus = (s) => String(s).replace(/^-/, '−');
const ppmText = (r) => signed(r.ppm, Math.abs(r.ppm) < 10 ? 2 : 0), sigText = (r) => signed(r.sigma, Math.abs(r.sigma) < 10 ? 2 : 0);
// agreement as a plain fraction: 9.83 ppm is one part in about 100,000
const partsIn = (r) => { const n = 1e6 / Math.max(1e-9, Math.abs(r.ppm)); const p = Math.pow(10, Math.floor(Math.log10(n)) - 1); return '1 part in ' + (Math.round(n / p) * p).toLocaleString('en-US'); };
const sigmaWhy = (r) => Math.abs(r.sigma) >= 5
  ? 'The gap is many times the uncertainty of the measurement, which is known to about 0.02 ppm. The model value is the leading-order value of the register: radiative corrections of order (α/π)² ≈ 5 ppm are not in it yet. The two-loop vacuum polarization by lighter families has the order and sign of the gap (report LD); not derived.'
  : 'The gap is smaller than the uncertainty of the measurement.';

// ---------------------------------------------------------------- SVG pieces with their paint as attributes
const LAB = '#93a3c0', HAIR = 'rgba(140,170,230,.12)', DARK = '#070b16', FF = 'font-family="Inter, Helvetica, Arial, sans-serif"';
const sText = (x, y, s, o = {}) => `<text x="${x}" y="${y}" ${FF} font-size="${o.size || 11}" font-weight="${o.weight || 500}" fill="${o.fill || LAB}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.cls ? ` class="${o.cls}"` : ''}>${s}</text>`;
const sLine = (x1, y1, x2, y2, stroke = HAIR, w = 1, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"${extra}/>`;

// ---------------------------------------------------------------- state
const SPEEDS = [['×1', 3], ['×10', 30], ['×1000', 3000]];
const S = { host: null, port: 2, portY: 2, seed: 20261111, sam: null, cur: null, trail: [], recent: [], hist: [], acc: 0, last: 0, speed: 0, playing: true, rot: [0.5, 0.4], hold: 0,
  drag: null, theta: L.THETA, raf: 0, proj: [], grid: null, run: undefined, runAt: 0, open: null, phaseHover: null, runHover: null, pg: null };
const Q = {}, T = {};        // canvases by name, live text nodes by name
const M = L.MEASURED, SRCM = L.SOURCES_MEASURED;
const srcA = (id) => `<a href="${SRCM[id].url}" target="_blank" rel="noopener">${SRCM[id].name} ↗</a>`;

// ---------------------------------------------------------------- small pieces of the page
const pill = (s, word) => `<span class="lp-st" data-s="${s}">${word}</span>`;
const kick = (text, right = '') => `<div class="lp-kick"><span>${text}</span>${right}</div>`;
const src = (url, label = 'derivation') => `<a class="lp-src" href="${url}" target="_blank" rel="noopener">${label} ↗</a>`;

// the measured band and the model mark on one ppm axis; used large in the ratio cards and small in the table
function meter(r, big) {
  const W = big ? 360 : 240, H = big ? 42 : 22, mid = W / 2, half = W / 2 - 8, x = (ppm) => mid + (clamp(ppm, -60, 60) / 60) * half;
  const y = big ? 14 : 11, bh = big ? 16 : 12, x0 = x(-r.uncPpm), bw = x(r.uncPpm) - x0, xm = x(r.ppm);
  return `<svg class="lp-meter${big ? ' lp-big' : ''}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="model ${signed(r.ppm, 2)} ppm from the measured value; one standard deviation of the measurement is ${r.uncPpm.toPrecision(2)} ppm">
    ${sLine(8, y, W - 8, y, 'rgba(140,170,230,.24)')}${bw > 1.4 ? `<rect x="${x0.toFixed(2)}" y="${y - bh / 2}" width="${bw.toFixed(2)}" height="${bh}" rx="${big ? 4 : 3}" fill="rgba(238,242,251,.2)"/>` : ''}
    ${sLine(mid, y - bh / 2 - 3, mid, y + bh / 2 + 3, 'rgba(238,242,251,.85)', 1.3)}<rect class="lp-mark" x="${(xm - (big ? 2.25 : 1.75)).toFixed(2)}" y="${y - bh / 2 - 4}" width="${big ? 4.5 : 3.5}" height="${bh + 8}" rx="2" fill="${C.teal}"/>
    ${big ? [-50, 0, 50].map((v) => sLine(x(v), 27, x(v), 31, 'rgba(140,170,230,.42)') + sText(x(v), 41, (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + (v === 50 ? ' ppm' : ''), { anchor: 'middle', size: 10.5 })).join('') : ''}</svg>`;
}
function meterAxis() {
  const W = 240, mid = W / 2, half = W / 2 - 8, x = (ppm) => mid + (ppm / 60) * half;
  return `<svg class="lp-meter" viewBox="0 0 ${W} 22" aria-hidden="true">${[-50, 0, 50].map((v) => sText(x(v), 11, (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v), { anchor: 'middle', size: 10.5 }) + sLine(x(v), 15, x(v), 21, 'rgba(140,170,230,.42)')).join('')}${sLine(8, 21, W - 8, 21, 'rgba(140,170,230,.24)')}</svg>`;
}

// ---------------------------------------------------------------- first screen
function head() {
  return `<div class="lp-head">
    <div><h2>Charged leptons</h2>
      <div class="lp-map"><b>map into this step</b><span>The rest phase per tick is the expected number of reads per tick.</span></div></div>
    <div class="lp-headr">
      <a class="lp-pill" data-s="derived" href="${RER}model/lepton_register_round/README.md" target="_blank" rel="noopener"><i></i><em>executable certificate</em><b>99 checks ↗</b></a>
      <a class="lp-pill" data-s="derived" href="${RER}model/lepton_register_round/PROOF.md" target="_blank" rel="noopener"><i></i><em>its proof</em><b>↗</b></a>
      <span class="lp-pill lp-nomass"><i></i><em>no measured mass as input</em></span>
    </div>
  </div>`;
}
// the ratio itself, very large, against its measured value
function ratioCard(r, name, formula) {
  return `<section class="lp-card lp-ratio" data-r="${r.id}">
    ${kick(name, `<em>${tex(formula)}</em>`)}
    <div class="lp-giant">${r.modelText}</div>
    <div class="lp-against"><span>against</span><b>${r.measuredText}</b><em>${r.sources.map(srcA).join(' ÷ ')}</em></div>
    <div class="lp-vis lp-vis-meter">${meter(r, true)}</div>
    <div class="lp-dev"><b>${ppmText(r)} ppm</b><b class="lp-agree">agrees to ${partsIn(r)}</b><span class="lp-grow"></span>${pill('blind', 'not blind')}</div>
    <div class="lp-sigma" title="${sigmaWhy(r)}">${Math.abs(r.sigma) >= 5 ? `the measurement is far more precise than this gap: ${sigText(r).replace('+', '')} of its errors · leading order, radiative corrections not yet included` : `within ${sigText(r).replace('+', '')} measurement errors`}</div>
  </section>`;
}
// what is shown, in the words of the theory session (LEPTON_STEPS sections 1 and 3; LD item 1: the pole reading is a premise)
function statement() {
  return `<section class="lp-card lp-what">
    ${kick('what is shown', '<a class="lp-src" data-a="toscale" href="#">the open items ↓</a>')}
    <div class="lp-body"><b>The ratios of the three rest rates</b> of the generation register around a lepton-class defect. A rest rate is the expected number of reads per tick of one of the three states, the three characters of the face's third-turn.</div>
    <div class="lp-body">These are <b>not yet the measured rest masses</b> of the electron, muon and tau: one common scale is open, and reading a rate as a mass is a premise of the model.</div>
    <div class="lp-body">What is compared with CODATA and PDG is <b>the dimensionless ratio</b>, and the model's value of it uses no measured mass.</div>
  </section>`;
}
// one logarithmic ladder: the three rest rates at theta = 2/9 as ratios to the lowest; diamonds mark the measured mass ratios
const HY = (ratio) => 270 - Math.log10(ratio) * 60;
function ladderCard(by) {
  const rat = L.ratios(), [el, mu, tau] = L.LEPTONS;
  const lv = [{ q: tau, ratio: rat.tauE, text: by.tauE.modelText, cap: 'character 1', meas: by.tauE.measured }, { q: mu, ratio: rat.muE, text: by.muE.modelText, cap: 'character ω²', meas: by.muE.measured }, { q: el, ratio: 1, text: '1', cap: 'character ω · the unit', meas: null }];
  const dia = (x, y, r) => `<path d="M ${x} ${(y - r).toFixed(1)} l ${r} ${r} l ${-r} ${r} l ${-r} ${-r} z" fill="${DARK}" stroke="rgba(238,242,251,.92)" stroke-width="1.5" stroke-linejoin="round"/>`;
  const svg = `<svg class="lp-hsvg" viewBox="0 0 420 312" role="img" aria-label="three levels on a logarithmic scale: ${lv.map((x) => x.q.name + ' ' + x.text).join(', ')} times the lowest rest rate">
    ${[0, 1, 2, 3, 4].map((e) => sLine(46, HY(10 ** e), 414, HY(10 ** e), 'rgba(140,170,230,.1)') + sText(38, HY(10 ** e) + 3.5, pow10(e), { anchor: 'end' })).join('')}
    ${sLine(74, HY(1), 74, HY(rat.tauE).toFixed(1), 'rgba(140,170,230,.26)')}
    ${lv.map(({ q, ratio, text, cap, meas }) => { const y = HY(ratio), c = lepCol(q.k); return `<g class="lp-lvl" data-l="${q.name}" style="--c:${c}">${sLine(90, y.toFixed(1), 252, y.toFixed(1), c, 3)}${meas ? dia(232, HY(meas), 6.5) : ''}
      <circle cx="74" cy="${y.toFixed(1)}" r="13.5" fill="${DARK}" stroke="${c}" stroke-width="2"/>${sText(74, (y + 5).toFixed(1), q.sym, { anchor: 'middle', size: 15, weight: 700, fill: C.ink })}${sText(265, (y + 8).toFixed(1), text, { size: 27, weight: 700, fill: '#ffffff', ls: '-.5' })}${sText(266, (y + 25).toFixed(1), cap, { size: 10.5 })}</g>`; }).join('')}
    ${sText(46, 308, 'rest rate ÷ lowest rest rate, logarithmic')}${dia(304, 304, 5)}${sText(314, 308, 'measured ratio')}</svg>`;
  return `<section class="lp-card lp-lad">
    <header><h3>The hierarchy</h3><span class="lp-hsub">from the read count 2/9 of the carrier</span></header>
    <div class="lp-vis lp-vis-lad">${svg}</div>
  </section>`;
}
function tableCard(rows) {
  const row = (r) => `<tr data-id="${r.id}"><td class="lp-q">${tex(r.tex)}</td><td class="lp-m"><b>${r.modelText}</b>${r.unit ? `<span>${r.unit}</span>` : ''}<em class="lp-mm">measured ${r.measuredText}${r.unit ? ' ' + r.unit : ''}</em></td>
      <td class="lp-x">${r.measuredText}${r.unit ? `<span>${r.unit}</span>` : ''}</td><td class="lp-s">${r.sources.map(srcA).join(`<span>${r.id === 'koide' ? '·' : '÷'}</span>`)}</td>
      <td class="lp-v">${meter(r, false)}</td><td class="lp-p">${signed(r.ppm, Math.abs(r.ppm) < 10 ? 2 : 1)}</td><td class="lp-g${Math.abs(r.sigma) >= 5 ? ' lp-far' : ''}">${sigText(r)}</td></tr>`;
  return `<section class="lp-card lp-cmp lp-s2">
    <header><h3>Comparison with measurement</h3>${pill('blind', 'not blind')}<span class="lp-hsub">register at θ = 2/9</span><span class="lp-grow"></span>
      <a class="lp-pill" href="${SRCM.codata.url}" target="_blank" rel="noopener"><i></i><em>CODATA 2022</em><b>↗</b></a><a class="lp-pill" href="${SRCM.pdg.url}" target="_blank" rel="noopener"><i></i><em>PDG 2024</em><b>↗</b></a></header>
    <div class="lp-tscroll"><table class="lp-table">
      <thead><tr><th>quantity</th><th class="lp-r">model</th><th class="lp-r lp-xh">measured</th><th class="lp-sh">source</th><th class="lp-vh">${meterAxis()}</th><th class="lp-r lp-lc">ppm</th><th class="lp-r lp-lc">σ</th></tr></thead>
      <tbody><tr class="lp-sep"><td colspan="7"><div><span>dimensionless · no measured mass in the model column</span></div></td></tr>
        ${rows.filter((r) => !r.anchor).map(row).join('')}
        <tr class="lp-sep lp-inc"><td colspan="7"><div><span>with the electron mass as the one measured input</span>${pill('open', 'derivation incomplete')}</div></td></tr>
        ${rows.filter((r) => r.anchor).map(row).join('')}</tbody>
    </table></div>
  </section>`;
}

// ---------------------------------------------------------------- what a lepton is in the model
// The lepton doublet and the right-handed electron as patterns of the five-level code; charges computed by the engine.
function patternSvg() {
  const LC = [C.red, C.green, C.blue, C.violet, C.violet], ids = L.CODE_LEVELS.map((l) => l.id), ys = [34, 56, 78, 112, 134], xs = [150, 255, 360];
  const pats = L.LEPTON_PATTERNS.map((p) => ({ ...p, ...L.pattern(p.mask) }));
  const slot = (cx, y, i, on) => `<rect x="${cx - 38}" y="${y - 8}" width="76" height="16" rx="8" fill="${on ? rgba(LC[i], 0.2) : 'rgba(255,255,255,.02)'}" stroke="${on ? LC[i] : 'rgba(140,170,230,.24)'}" stroke-width="1.2"/><circle cx="${cx + 26}" cy="${y}" r="4.6" fill="${on ? LC[i] : 'none'}" stroke="${on ? LC[i] : 'rgba(140,170,230,.4)'}" stroke-width="1.2"/>`;
  return `<svg class="lp-psvg" viewBox="0 0 420 196" role="img" aria-label="${pats.map((p) => `${p.name}: levels ${p.occupied.join(' ')}, charge ${p.Q}, class ${p.k}`).join('; ')}">
    ${sText(0, 60, 'COLOUR', { size: 9.5, weight: 700, ls: '1.3' })}${sText(0, 127, 'WEAK', { size: 9.5, weight: 700, ls: '1.3' })}
    ${ids.map((id, i) => sText(84, ys[i] + 4, id, { anchor: 'end', size: 11.5, fill: '#c5d0e6' })).join('')}
    ${sLine(112, 14, 293, 14, 'rgba(95,227,161,.55)', 1.2)}${sText(202.5, 9, 'LEPTON DOUBLET · CLASS 3', { anchor: 'middle', size: 9.5, weight: 700, ls: '1.1', fill: C.green })}
    ${sLine(322, 14, 398, 14, 'rgba(160,178,210,.5)', 1.2)}${sText(360, 9, 'CLASS 0', { anchor: 'middle', size: 9.5, weight: 700, ls: '1.1' })}
    ${pats.map((p, c) => ids.map((_, i) => slot(xs[c], ys[i], i, p.bits[i] === '1')).join('') +
      `<text x="${xs[c]}" y="165" ${FF} font-size="16" font-weight="700" fill="${C.ink}" text-anchor="middle">${p.sym}<tspan dy="4" font-size="10.5">${p.hand}</tspan></text>` +
      sText(xs[c], 186, `Q = ${minus(p.Q)} · Y = ${minus(p.Y)}`, { anchor: 'middle', size: 11 })).join('')}</svg>`;
}
function leptonCard() {
  const line = (k, chip, text) => `<div class="lp-line">${kick(k, chip)}<div class="lp-body">${text}</div></div>`;
  return `<section class="lp-card lp-lep lp-s3">
    <header><h3>What a lepton is in the model</h3><span class="lp-grow"></span><button class="lp-linkbtn" data-a="decoder">open in the decoder →</button></header>
    <div class="lp-lepgrid">
      <div class="lp-vis lp-vis-pat">${patternSvg()}</div>
      <div class="lp-lines">
        ${line('a quantum', pill('derived', 'derived'), 'A lepton is a quantum: a pattern of the five-level code that is a colour singlet. All three colour levels are occupied; in the antilepton none is.')}
        ${line('its class', pill('derived', 'derived'), 'The lepton doublet has centre class 3, the class of the weak-centre flux. A class-3 defect is the flux boson of that class. The lepton is the quantum that carries the class.')}
        ${line('its generation', pill('declared', 'declared'), 'Around a class-3 defect the source keeps one pair on one port. The three characters of the face\'s third-turn are the three generations: electron ω, muon ω², tau 1.')}
        ${line('its mass', pill('open', 'scale open'), 'The rest rate of that character: the expected number of reads per tick. The ratios follow from the read count 2/9. The common scale is open.')}
      </div>
    </div>
  </section>`;
}

// ---------------------------------------------------------------- the chain of four steps
function chain(rows) {
  const w = L.doubleTick(S.port).weights, cells = L.twoCells(S.port, S.portY);
  const top = (n, mapText, title, status, word, url) => `<div class="lp-ctop">${kick(mapText, src(url))}</div><header><b>${n}</b><h3>${title}</h3><span class="lp-grow"></span>${pill(status, word)}</header>`;
  return `
    <section class="lp-card" data-step="1">
      ${top(1, 'start: the defect\'s pair on one port', 'Sixty addresses', 'derived', 'derived', DER + 'reports/LC.md')}
      <div class="lp-c1">
        <div class="lp-vis lp-vis-carrier"><canvas data-c="carrier"></canvas></div>
        <div class="lp-side">
          <div class="lp-stat"><span><i style="--c:var(--rp)"></i>record 2</span><b data-x="w2">${w.record2}</b></div>
          <div class="lp-stat"><span><i style="--c:var(--rm)"></i>record 3</span><b data-x="w3">${w.record3}</b></div>
          <div class="lp-stat"><span><i class="lp-hollow"></i>blank</span><b data-x="w0">${w.blank}</b></div>
          <div class="lp-sub"><span>tick <i data-t="tick">0</i></span><span>address <i data-t="addr">none</i></span><span>pair on port <i data-t="port">${S.port}</i></span></div>
        </div>
      </div>
    </section>
    <section class="lp-card" data-step="2">
      <i class="lp-node"></i>
      ${top(2, 'map: the record is the flag', 'The count', 'premise', 'one premise', DER + 'reports/LC.md')}
      <div class="lp-vis lp-vis-cells"><canvas data-c="cells"></canvas></div>
      <div class="lp-countrow">
        <div class="lp-gridcol"><div class="lp-vis lp-vis-grid"><canvas data-c="grid"></canvas></div><div class="lp-cap">3,600 pairs</div></div>
        <div class="lp-exact">${kick('exact')}<b class="lp-bignum" data-x="count">${cells.count}</b><div class="lp-sum" data-x="sum">${cells.pR} + ${cells.pH} − 2 × ${cells.joint}</div><div class="lp-cap">800 of 3,600 pairs</div></div>
        <div class="lp-samp">${kick('sampled')}<b class="lp-bignum lp-sm"><i data-t="mean">0.0000</i></b><div class="lp-cap">an illustration</div>
          <div class="lp-vis lp-vis-spark"><canvas data-c="spark"></canvas></div></div>
        <div class="lp-play"><button data-a="play" title="pause or run the ticks" aria-label="pause or run">❚❚</button><button data-a="speed" title="ticks per second">×1</button><button data-a="reset" title="restart the sample" aria-label="restart the sample">↺</button><em><i data-t="n">0</i> ticks</em></div>
      </div>
    </section>
    <section class="lp-card" data-step="3">
      <i class="lp-node"></i>
      ${top(3, 'map: the count weighs the kick', 'The weak round', 'declared', 'declared', DER + 'reports/CK2.md')}
      <div class="lp-round"><span>tick</span><span>kick</span><span>inverse tick</span><span>return</span></div>
      <div class="lp-tex">${tex('1-\\tfrac29+\\tfrac29\\,e^{-ihj}')}</div>
      <div class="lp-vis lp-vis-phase"><canvas data-c="phase"></canvas></div>
      <div class="lp-tiles">
        <div class="lp-stat"><span>N = 1</span><b>${L.phasePerUnit(1).toFixed(6)}</b></div><div class="lp-stat"><span>N = 10</span><b>${L.phasePerUnit(10).toFixed(6)}</b></div><div class="lp-stat"><span>N → ∞</span><b>2/9</b></div>
      </div>
    </section>
    <section class="lp-card lp-s3" data-step="4">
      <i class="lp-node lp-nodedown"></i>
      ${top(4, 'map: the phase turns the circulant', 'Three rates', 'declared', 'declared', DER + 'reports/FR.md')}
      <div class="lp-c4">
        <div class="lp-vis lp-vis-dial"><canvas data-c="dial"></canvas></div>
        <div class="lp-vis lp-vis-ladder"><canvas data-c="ladder"></canvas></div>
        <div class="lp-readout">
          <div class="lp-tex">${tex('y_k=\\tfrac{1}{27}\\bigl(1+\\sqrt2\\cos(\\theta+\\tfrac{2\\pi k}{3})\\bigr)^2')}</div>
          <div class="lp-ctl"><span>θ</span><input type="range" data-a="theta" min="0" max="${L.NODE}" step="any" value="${L.THETA}" aria-label="phase theta"><b><i data-t="theta">2/9</i></b><button data-a="snap">2/9</button></div>
          <div class="lp-statrow" data-q="mue"><span>${tex('m_\\mu/m_e')}</span><b><i data-t="mue">0</i></b><em>measured ${M.muE.text}</em></div>
          <div class="lp-statrow" data-q="taue"><span>${tex('m_\\tau/m_e')}</span><b><i data-t="taue">0</i></b><em>measured ${rows[1].measuredText}</em></div>
          <div class="lp-statrow" data-q="koide"><span>Koide ${tex('Q')}</span><b><i data-t="koide">0</i></b><div class="lp-vis lp-vis-q"><canvas data-c="qtrace"></canvas></div></div>
        </div>
      </div>
    </section>`;
}

// ---------------------------------------------------------------- residual: the registered readings on one ppm axis
function residualSvg(compact) {
  const G = compact ? { W: 356, H: 172, x0: 30, k: 13.9, y0: 112, r: 5.5, lift: 15, fs: 11, big: 12 } : { W: 920, H: 196, x0: 70, k: 35.5, y0: 126, r: 6.5, lift: 17, fs: 11.5, big: 13 };
  const { W, H, y0 } = G, x = (p) => G.x0 + (p + 2) * G.k, rows = L.RESIDUAL.rows.filter((r) => !r.excluded).slice().sort((a, b) => a.ppm - b.ppm);
  let last = -99, lift = 0; const pts = rows.map((r) => { lift = r.ppm - last < 0.75 ? lift + 1 : 0; last = r.ppm; return { r, x: x(r.ppm), y: y0 - G.lift * lift }; });
  const reg = pts.find((p) => p.r.role === 'register'), close = pts.filter((p) => p.r.role === 'closest'), cx = close.reduce((t, p) => t + p.x, 0) / close.length, sc = L.RESIDUAL.scale;
  const mark = (p) => { const role = p.r.role, fill = role === 'register' ? C.teal : role === 'closest' ? C.amber : '#060a14', stroke = role ? '#060a14' : 'rgba(160,178,210,.85)';
    return `<g class="lp-pt${role ? ' lp-' + role : ''}" data-id="${p.r.id}" tabindex="0"><circle cx="${p.x.toFixed(1)}" cy="${p.y}" r="14" fill="transparent"/><circle class="lp-rdot" cx="${p.x.toFixed(1)}" cy="${p.y}" r="${G.r}" fill="${fill}" stroke="${stroke}" stroke-width="${role ? 2 : 1.5}"/></g>`; };
  const ax = compact ? cx + 84 : cx + 118, ay = compact ? y0 - 40 : y0 - 50, top = compact ? y0 - 92 : y0 - 112;      // the arrow ends at the label of the two closest readings
  const c1 = compact ? [reg.x - 12, y0 - 62] : [reg.x - 86, top], c2 = compact ? [ax + 26, ay - 22] : [ax + 118, top];
  const flow = `<path d="M ${(reg.x - 8).toFixed(1)} ${reg.y - 11} C ${c1[0].toFixed(1)} ${c1[1]}, ${c2[0].toFixed(1)} ${c2[1]}, ${ax.toFixed(1)} ${ay}" fill="none" stroke="rgba(197,208,230,.5)" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M ${(ax + 11).toFixed(1)} ${ay - 8} L ${ax.toFixed(1)} ${ay} L ${(ax + 13).toFixed(1)} ${ay + 3}" fill="none" stroke="rgba(197,208,230,.6)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>`;
  const flowLabel = compact ? sText(8, 12, 'two-loop vacuum polarization by the lighter families', { size: 11, fill: '#c5d0e6' })
    : sText(((reg.x + ax) / 2 + 16).toFixed(1), y0 - 102, 'two-loop vacuum polarization by the lighter families', { anchor: 'middle', size: 12, fill: '#c5d0e6' });
  return `<svg viewBox="0 0 ${W} ${H}" class="lp-ressvg ${compact ? 'lp-res-n' : 'lp-res-w'}" role="img" aria-label="residual of the muon to electron ratio in ppm under each registered reading">
    ${[5, 10, 15, 20].map((v) => sLine(x(v), y0 + 20, x(v), y0 + 26, 'rgba(140,170,230,.42)') + sText(x(v), y0 + 44, '+' + v, { anchor: 'middle', size: G.fs })).join('')}
    ${compact ? '' : sText(W - 4, y0 + 44, 'ppm', { anchor: 'end', size: G.fs })}${sLine(x(-1.6), y0 + 20, x(21.6), y0 + 20, 'rgba(140,170,230,.3)')}
    ${sLine(x(0), y0 - 28, x(0), y0 + 26, 'rgba(238,242,251,.85)', 1.3)}${sText(x(0), y0 + 44, 'measured', { anchor: 'middle', size: G.fs, fill: '#c5d0e6' })}
    ${flow}${flowLabel}
    ${pts.map(mark).join('')}
    ${sText((reg.x + (compact ? 12 : 15)).toFixed(1), reg.y + 4.5, 'register +' + reg.r.ppm.toFixed(2), { size: G.big, weight: 700, fill: C.ink })}
    ${sText((cx - 7).toFixed(1), y0 - (compact ? 30 : 38), '+' + close[0].r.ppm.toFixed(2) + ' · +' + close[1].r.ppm.toFixed(2), { size: G.big, weight: 700, fill: C.ink })}
    ${sLine(x(14.2), y0 - (compact ? 52 : 44), x(14.2 + sc.ppm), y0 - (compact ? 52 : 44), 'rgba(197,208,230,.75)', 1.5)}${sText(x(14.2 + sc.ppm / 2), y0 - (compact ? 60 : 52), sc.label + ' = ' + sc.ppm + ' ppm', { anchor: 'middle', size: G.fs })}
  </svg>`;
}
function residualTable() {
  return `<table class="lp-rt"><thead><tr><th></th><th>the register rate is</th><th class="lp-r">coefficient</th><th class="lp-r">μ/e residual, ppm</th><th class="lp-r">m<sub>τ</sub>, MeV</th><th class="lp-r">Q − 2/3</th></tr></thead><tbody>${L.RESIDUAL.rows.map((r) =>
    `<tr${r.role ? ` class="lp-${r.role}"` : ''}><td>${r.id}</td><td>${esc(r.reading)}</td><td class="lp-r">${minus(r.coefficient)}</td><td class="lp-r">${r.ppm > 0 ? '+' : '−'}${Math.abs(r.ppm)}${r.note ? ` (${r.note})` : ''}</td><td class="lp-r">${r.mTau}</td><td class="lp-r">${minus(r.dQ)}</td></tr>`).join('')}</tbody></table>`;
}
function low() {
  return `
    <section class="lp-card lp-res lp-s2" data-step="5">
      <div class="lp-ctop">${kick('the muon to electron ratio, model minus measured', src(DER + 'reports/LD.md'))}</div>
      <header><b>5</b><h3>The residual</h3><span class="lp-hsub">bounded, not derived</span><span class="lp-grow"></span>${pill('open', 'open')}</header>
      <div class="lp-vis lp-vis-res">${residualSvg(false)}${residualSvg(true)}</div>
      <div class="lp-resfoot"><button data-a="restable" aria-pressed="false">table of the readings</button><span>with standard QED and the measured hadronic terms; not derived</span><span class="lp-grow"></span><span class="lp-need">needed coefficient ${minus(L.RESIDUAL.needed)}</span>${pill('blind', 'not blind')}</div>
      <div class="lp-restable" hidden><div class="lp-rtcap"><span>the tau mass of each reading uses the measured electron mass</span>${pill('open', 'derivation incomplete')}</div>${residualTable()}</div>
    </section>
    <section class="lp-card lp-run">
      <div class="lp-ctop">${kick('the register run over many ticks')}</div>
      <header><h3>Executed register</h3><span class="lp-grow"></span><span data-x="runstate"></span></header>
      <div class="lp-runbody" data-x="runbody"></div>
    </section>
    <section class="lp-card lp-open lp-s3">
      <header><h3>Open</h3><span class="lp-hsub">one item per step</span></header>
      <div class="lp-chips">${L.OPEN_STEPS.map((o) => `<button class="lp-chip" data-id="${o.id}" data-step="${o.step}" aria-pressed="false"><i></i><b>${o.id}</b><em>${esc(o.chip)}</em></button>`).join('')}</div>
      <div class="lp-openbox" hidden></div>
    </section>`;
}
function skeleton() {
  const rows = L.comparison(), by = Object.fromEntries(rows.map((r) => [r.id, r]));
  const more = [['Executable certificate: the lepton register round (99 checks)', RER + 'model/lepton_register_round/README.md'], ['Its proof', RER + 'model/lepton_register_round/PROOF.md'],
    ['Its results', RER + 'model/lepton_register_round/results.json'], ['Proof: defect classes are centre classes', RER + 'model/defect_particle_classes/PROOF.md'], ['Derivation: the register on the sixty-address carrier', DER + 'reports/LC.md'],
    ['The weak round', DER + 'reports/CK2.md'], ['The kick', DER + 'reports/LK.md'], ['The clock unit', DER + 'reports/LT.md'], ['The standing pair', DER + 'reports/LP.md'], ['The residual', DER + 'reports/LD.md'],
    ['Code: the engine of this page', SITE + 'lepton_round.js'], ['Its check script', SITE + 'lepton_round_check.mjs'], ['CODATA 2022 (NIST)', SRCM.codata.url], ['Particle Data Group', SRCM.pdg.url]];
  return `<div class="lp-wrap">
  ${head()}
  <div class="lp-g3 lp-top">${ratioCard(by.muE, 'muon to electron', 'm_\\mu/m_e')}${ratioCard(by.tauE, 'tau to electron', 'm_\\tau/m_e')}${statement()}</div>
  <div class="lp-g3 lp-hero">${ladderCard(by)}${tableCard(rows)}</div>
  <div class="lp-g3">${leptonCard()}</div>
  <div class="lp-band"><h3>Where the ratios come from</h3><span class="lp-hsub">four steps and the maps between them, computed in this browser</span></div>
  <div class="lp-g3 lp-chain">${chain(rows)}</div>
  <div class="lp-down"><span>a rest rate is read as a mass, a premise of the model · the ratios of the rates are the ratios compared above</span></div>
  <div class="lp-g3 lp-low">${low()}</div>
  <div class="lp-links">${linkList(['lepton'])}<div class="src-links">${more.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join('')}</div></div>
  <div class="lp-tip"></div>
</div>`;
}

// ---------------------------------------------------------------- canvases
function fit(cv) {
  if (!cv) return null;
  const dpr = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return null;
  const W = Math.round(w * dpr), H = Math.round(h * dpr);
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
  const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
  return { g, w, h };
}
function project(cx, cy, R) {
  const { xyz } = L.carrier(), [yaw, pitch] = S.rot, ca = Math.cos(yaw), sa = Math.sin(yaw), cb = Math.cos(pitch), sb = Math.sin(pitch);
  return xyz.map(([x, y, z]) => { const x1 = ca * x + sa * z, z1 = -sa * x + ca * z, y1 = cb * y - sb * z1, z2 = sb * y + cb * z1, k = 1 + 0.16 * z2; return [cx + R * x1 * k, cy - R * y1 * k, z2]; });
}
function arrow(g, A, B, col, alpha, width) {
  g.strokeStyle = rgba(col, alpha); g.lineWidth = width; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.stroke();
  const t = 0.62, x = A[0] + (B[0] - A[0]) * t, y = A[1] + (B[1] - A[1]) * t, a = Math.atan2(B[1] - A[1], B[0] - A[0]), s = 4 + 1.6 * width;
  g.beginPath(); g.moveTo(x - s * Math.cos(a - 0.5), y - s * Math.sin(a - 0.5)); g.lineTo(x, y); g.lineTo(x - s * Math.cos(a + 0.5), y - s * Math.sin(a + 0.5)); g.stroke();
}
// one carrier: seams, ports, the port that holds the pair, the address of the current tick and the load it moves
function carrierPicture(g, cx, cy, R, o) {
  const P = project(cx, cy, R), { seams, addresses } = L.carrier(), mini = o.mini, depth = (z) => (z + 1) / 2;
  if (o.face) {
    const f = L.FACE.map((p) => P[p]), z = (f[0][2] + f[1][2] + f[2][2]) / 3;
    g.beginPath(); g.moveTo(f[0][0], f[0][1]); g.lineTo(f[1][0], f[1][1]); g.lineTo(f[2][0], f[2][1]); g.closePath();
    g.fillStyle = rgba(C.green, 0.04 + 0.08 * depth(z)); g.fill(); g.strokeStyle = rgba(C.green, 0.12 + 0.2 * depth(z)); g.lineWidth = 1; g.stroke();
  }
  g.lineWidth = 1; g.lineCap = 'round';
  for (const [a, b] of seams) { g.strokeStyle = `rgba(150,176,230,${(0.07 + 0.3 * depth((P[a][2] + P[b][2]) / 2)).toFixed(3)})`; g.beginPath(); g.moveTo(P[a][0], P[a][1]); g.lineTo(P[b][0], P[b][1]); g.stroke(); }
  if (o.trail) o.trail.forEach((k, i) => { const [a, b] = addresses[k]; arrow(g, P[a], P[b], C.ink, 0.13 - 0.03 * i, 1); });
  let moving = null;
  if (o.k !== null && o.k !== undefined) {
    const [a, b] = addresses[o.k], rec = o.record, col = rec === 0 ? C.ink : o.hold ? C.ink : rec === 2 ? C.blue : C.red, fade = 1 - 0.55 * o.age;
    if (rec !== 0) { g.shadowColor = col; g.shadowBlur = mini ? 6 : 12; }
    arrow(g, P[a], P[b], col, (rec === 0 ? 0.42 : 0.95) * fade, rec === 0 ? (mini ? 1.2 : 1.5) : mini ? 1.8 : 2.6);
    g.shadowBlur = 0;
    if (rec !== 0) { const from = P[o.pair], to = P[a === o.pair ? b : a], u = 0.92 * Math.sin(Math.PI * clamp(o.age, 0, 1)) ** 0.8; moving = { x: from[0] + (to[0] - from[0]) * u, y: from[1] + (to[1] - from[1]) * u, col }; }
  }
  const order = [...P.keys()].sort((i, j) => P[i][2] - P[j][2]);
  for (const p of order) {
    const [x, y, z] = P[p], d = depth(z), r = (mini ? 1.5 : 2.4) + (mini ? 1 : 1.6) * d;
    if (p === o.pair) {
      const rr = mini ? 5 : 8.5; g.shadowColor = C.green; g.shadowBlur = mini ? 8 : 16; g.strokeStyle = rgba(C.green, 0.95); g.lineWidth = mini ? 1.4 : 1.8; g.beginPath(); g.arc(x, y, rr, 0, 2 * Math.PI); g.stroke(); g.shadowBlur = 0;
      const dx = mini ? 1.9 : 3; g.fillStyle = C.green; g.beginPath(); g.arc(x - dx, y, mini ? 1.4 : 2.1, 0, 2 * Math.PI); g.fill();
      if (!moving) { g.beginPath(); g.arc(x + dx, y, mini ? 1.4 : 2.1, 0, 2 * Math.PI); g.fill(); }
    } else { g.fillStyle = `rgba(214,224,244,${(0.3 + 0.6 * d).toFixed(3)})`; g.beginPath(); g.arc(x, y, r, 0, 2 * Math.PI); g.fill(); }
    if (o.labels) { const ux = x - cx, uy = y - cy, n = Math.hypot(ux, uy) || 1, off = p === o.pair ? 17 : 10; g.fillStyle = `rgba(160,178,210,${(0.25 + 0.55 * d).toFixed(3)})`; g.font = `500 10px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(p), x + (ux / n) * off, y + (uy / n) * off); }
  }
  if (moving) { g.shadowColor = moving.col; g.shadowBlur = 10; g.fillStyle = moving.col; g.beginPath(); g.arc(moving.x, moving.y, mini ? 1.8 : 2.8, 0, 2 * Math.PI); g.fill(); g.shadowBlur = 0; }
  return P;
}
function tickAge(now) { if (!S.cur) return 1; const period = Math.max(140, 1000 / SPEEDS[S.speed][1]); return clamp((now - S.cur.t0) / period, 0, 1); }
function drawCarrier(now) {
  const f = fit(Q.carrier); if (!f) return; const { g, w, h } = f, cur = S.cur;
  S.proj = carrierPicture(g, w / 2, h / 2, Math.min(w, h) * 0.41, { pair: S.port, face: true, labels: true, k: cur ? cur.kx : null, record: cur ? S.sam.cells.recordX[cur.kx] : 0, age: tickAge(now), trail: S.trail });
}
function lamp(g, x, y, col, on, label, right) {
  g.beginPath(); g.arc(x, y, 4.4, 0, 2 * Math.PI);
  if (on > 0.02) { g.shadowColor = col; g.shadowBlur = 10 * on; g.fillStyle = rgba(col, 0.25 + 0.75 * on); g.fill(); g.shadowBlur = 0; }
  g.strokeStyle = rgba(col, 0.6); g.lineWidth = 1.2; g.stroke();
  g.fillStyle = 'rgba(197,208,230,.9)'; g.font = `600 11.5px ${FONT}`; g.textAlign = right ? 'right' : 'left'; g.textBaseline = 'middle'; g.fillText(label, right ? x - 9 : x + 9, y + 0.5);
}
function drawCells(now) {
  const f = fit(Q.cells); if (!f) return; const { g, w, h } = f, cur = S.cur, age = tickAge(now), half = w / 2, R = Math.min(half * 0.5, (h - 44) * 0.5) * 0.86, on = 1 - age, cy = 18 + (h - 44) / 2, cells = S.sam.cells;
  carrierPicture(g, half / 2, cy, R, { mini: true, pair: S.port, k: cur ? cur.kx : null, record: cur ? cells.recordX[cur.kx] : 0, age });
  carrierPicture(g, half + half / 2, cy, R, { mini: true, pair: S.portY, k: cur ? cur.ky : null, record: cur ? cells.recordY[cur.ky] : 0, age, hold: true });
  g.fillStyle = 'rgba(147,163,192,.95)'; g.font = `700 10px ${FONT}`; g.textAlign = 'left'; g.textBaseline = 'top';
  g.fillText('CELL X · THE DEFECT', 0, 1); g.fillText('CELL Y · A SECOND CELL', half, 1);
  lamp(g, 6, h - 9, C.blue, cur && cur.rPlus ? on : 0, 'R+'); lamp(g, 54, h - 9, C.red, cur && cur.rMinus ? on : 0, 'R−'); lamp(g, half + 6, h - 9, C.ink, cur && cur.hold ? on : 0, 'H');
  lamp(g, w - 6, h - 9, C.green, cur && cur.exclusive ? on : 0, 'R+ xor H', true);
}
// the 60 x 60 address pairs of the two cells: lit where exactly one of R+ and H fires (800 of 3600)
function gridBase() {
  const c = document.createElement('canvas'); c.width = c.height = 60; const g = c.getContext('2d'), im = g.createImageData(60, 60), { recordX, recordY } = S.sam.cells;
  const hex = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }, blue = hex(C.blue), ink = hex(C.ink);
  for (let ky = 0; ky < 60; ky++) for (let kx = 0; kx < 60; kx++) {
    const rp = recordX[kx] === 2, hd = recordY[ky] !== 0;
    im.data.set(rp && hd ? [70, 84, 122, 255] : rp ? [...blue, 240] : hd ? [...ink, 150] : [17, 25, 43, 255], 4 * (ky * 60 + kx));
  }
  g.putImageData(im, 0, 0); return c;
}
function drawGrid() {
  const f = fit(Q.grid); if (!f) return; const { g, w, h } = f, s = Math.min(w, h), c = s / 60;
  g.imageSmoothingEnabled = false; g.drawImage(S.grid, 0, 0, s, s); g.imageSmoothingEnabled = true;
  const n = S.recent.length;
  S.recent.forEach((p, i) => { if (i === n - 1) return; const a = 0.75 * ((i + 1) / n) ** 2; g.fillStyle = p.exclusive ? rgba(C.green, a) : `rgba(120,140,180,${a})`; g.beginPath(); g.arc((p.kx + 0.5) * c, (p.ky + 0.5) * c, 1.6, 0, 2 * Math.PI); g.fill(); });
  if (S.cur) {
    const px = (S.cur.kx + 0.5) * c, py = (S.cur.ky + 0.5) * c, col = S.cur.exclusive ? C.green : C.muted;
    g.strokeStyle = 'rgba(238,242,251,.28)'; g.lineWidth = 1; g.beginPath(); g.moveTo(px, 0); g.lineTo(px, s); g.moveTo(0, py); g.lineTo(s, py); g.stroke();
    g.fillStyle = '#04070f'; g.beginPath(); g.arc(px, py, 5.2, 0, 2 * Math.PI); g.fill(); g.shadowColor = col; g.shadowBlur = 8; g.fillStyle = col; g.beginPath(); g.arc(px, py, 3.2, 0, 2 * Math.PI); g.fill(); g.shadowBlur = 0;
  }
}
function drawSpark() {
  const f = fit(Q.spark); if (!f) return; const { g, w, h } = f, n = S.sam.stats.n, top = Math.max(2, Math.log10(Math.max(n, 1))), X = (v) => 2 + (Math.log10(v) / top) * (w - 8), lo = 0, hi = 0.46, Y = (v) => 2 + (1 - (clamp(v, lo, hi) - lo) / (hi - lo)) * (h - 4), p = 2 / 9;
  g.fillStyle = 'rgba(238,242,251,.07)'; g.beginPath();                                   // one standard error of the sampled mean around 2/9
  for (let i = 0; i <= 40; i++) { const v = 10 ** ((top * i) / 40), se = Math.sqrt((p * (1 - p)) / v); i ? g.lineTo(X(v), Y(p + se)) : g.moveTo(X(v), Y(p + se)); }
  for (let i = 40; i >= 0; i--) { const v = 10 ** ((top * i) / 40), se = Math.sqrt((p * (1 - p)) / v); g.lineTo(X(v), Y(p - se)); }
  g.closePath(); g.fill();
  g.strokeStyle = 'rgba(238,242,251,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(2, Y(p)); g.lineTo(w - 2, Y(p)); g.stroke();
  if (S.hist.length) {
    const xe = X(Math.max(n, 1)), ye = Y(S.sam.mean());
    g.strokeStyle = C.green; g.lineWidth = 1.6; g.lineJoin = 'round'; g.beginPath(); S.hist.forEach((q, i) => (i ? g.lineTo(X(q.n), Y(q.m)) : g.moveTo(X(q.n), Y(q.m)))); g.lineTo(xe, ye); g.stroke();
    g.fillStyle = '#04070f'; g.beginPath(); g.arc(xe, ye, 4, 0, 2 * Math.PI); g.fill(); g.fillStyle = C.green; g.beginPath(); g.arc(xe, ye, 2.4, 0, 2 * Math.PI); g.fill();
  }
}
// phase per unit clock time against the number of rounds
const PH = { l: 46, r: 34, t: 10, b: 32, lo: 0.2035, hi: 0.2236 };
function drawPhase() {
  const f = fit(Q.phase); if (!f) return; const { g, w, h } = f, { l, r, t, b, lo, hi } = PH, X = (N) => l + (Math.log10(N) / 3) * (w - l - r), Y = (v) => t + (1 - (v - lo) / (hi - lo)) * (h - t - b);
  g.font = `500 10.5px ${FONT}`; g.textBaseline = 'middle';
  for (const v of [0.205, 0.21, 0.215, 0.22]) { g.strokeStyle = 'rgba(140,170,230,.1)'; g.lineWidth = 1; g.beginPath(); g.moveTo(l, Y(v)); g.lineTo(w - r, Y(v)); g.stroke(); g.fillStyle = 'rgba(147,163,192,.95)'; g.textAlign = 'right'; g.fillText(v.toFixed(3), l - 7, Y(v)); }
  g.textAlign = 'center'; g.textBaseline = 'top';
  for (const N of [1, 10, 100, 1000]) { g.fillStyle = 'rgba(147,163,192,.95)'; g.fillText(String(N), X(N), h - b + 6); g.strokeStyle = 'rgba(140,170,230,.2)'; g.beginPath(); g.moveTo(X(N), h - b); g.lineTo(X(N), h - b + 4); g.stroke(); }
  g.fillText('rounds per unit clock time N', l + (w - l - r) / 2, h - 13);
  g.strokeStyle = 'rgba(238,242,251,.55)'; g.lineWidth = 1; g.beginPath(); g.moveTo(l, Y(2 / 9)); g.lineTo(w - r, Y(2 / 9)); g.stroke();
  g.fillStyle = C.ink; g.textAlign = 'left'; g.textBaseline = 'top'; g.font = `700 11px ${FONT}`; g.fillText('2/9', l + 6, Y(2 / 9) + 5);
  g.strokeStyle = C.teal; g.lineWidth = 2; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath();
  for (let i = 0; i <= 150; i++) { const N = 10 ** ((3 * i) / 150); i ? g.lineTo(X(N), Y(L.phasePerUnit(N))) : g.moveTo(X(N), Y(L.phasePerUnit(N))); }
  g.stroke();
  for (const N of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 50, 100, 200, 500, 1000]) { const x = X(N), y = Y(L.phasePerUnit(N)), big = N === 1 || N === 10; g.fillStyle = '#060a14'; g.beginPath(); g.arc(x, y, big ? 5.5 : 3.6, 0, 2 * Math.PI); g.fill(); g.fillStyle = C.teal; g.beginPath(); g.arc(x, y, big ? 3.6 : 2, 0, 2 * Math.PI); g.fill(); }
  g.fillStyle = C.ink; g.font = `700 11px ${FONT}`; g.textAlign = 'left'; g.textBaseline = 'middle';
  g.fillText(L.phasePerUnit(1).toFixed(6), X(1) + 10, Y(L.phasePerUnit(1)) + 1); g.textBaseline = 'top'; g.fillText(L.phasePerUnit(10).toFixed(6), X(10) - 6, Y(L.phasePerUnit(10)) + 10);
  if (S.phaseHover) { const N = S.phaseHover, x = X(N), y = Y(L.phasePerUnit(N)); g.strokeStyle = 'rgba(238,242,251,.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, t); g.lineTo(x, h - b); g.stroke(); g.strokeStyle = C.ink; g.lineWidth = 1.5; g.beginPath(); g.arc(x, y, 5, 0, 2 * Math.PI); g.stroke(); }
  Q.phase.__geo = { l, r, w };
}
// the dial: three points on a circle of radius sqrt2 about 1, turned by theta. The distance of a point from the zero
// line is the amplitude of its lepton; the bars at the right repeat the three amplitudes with their values.
function drawDial() {
  const f = fit(Q.dial); if (!f) return; const { g, w, h } = f, th = S.theta, r = Math.SQRT2;
  const wide = w / h > 1.45, units = wide ? 5.75 : 3.3, sc = Math.min((w - 12) / units, (h - 20) / 3.0), x0 = wide ? (w - units * sc) / 2 : (w - 3.3 * sc) / 2;
  const X = (x) => x0 + (x + 0.68) * sc, Y = (y) => h / 2 - 1 - y * sc;
  const pt = (k) => { const a = th + (2 * Math.PI * k) / 3; return [1 + r * Math.cos(a), r * Math.sin(a)]; };
  g.fillStyle = 'rgba(238,242,251,.07)'; g.beginPath(); g.moveTo(X(1), Y(0)); g.arc(X(1), Y(0), r * sc, 0, -L.NODE, true); g.closePath(); g.fill();           // the positive chamber of the tau point
  g.strokeStyle = 'rgba(140,170,230,.24)'; g.lineWidth = 1; g.beginPath(); g.arc(X(1), Y(0), r * sc, 0, 2 * Math.PI); g.stroke();
  g.strokeStyle = 'rgba(140,170,230,.16)'; g.beginPath(); g.moveTo(X(-0.62), Y(0)); g.lineTo(X(2.58), Y(0)); g.stroke();
  g.strokeStyle = 'rgba(238,242,251,.6)'; g.beginPath(); g.moveTo(X(0), Y(1.46)); g.lineTo(X(0), Y(-1.46)); g.stroke();
  g.fillStyle = 'rgba(147,163,192,.95)'; g.font = `500 10.5px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'top'; g.fillText('0', X(0), Y(-1.46) + 2);
  const a29 = L.THETA; g.strokeStyle = C.ink; g.lineWidth = 1.5; g.beginPath(); g.moveTo(X(1 + (r + 0.05) * Math.cos(a29)), Y((r + 0.05) * Math.sin(a29))); g.lineTo(X(1 + (r + 0.17) * Math.cos(a29)), Y((r + 0.17) * Math.sin(a29))); g.stroke();   // the read count 2/9
  const P = [0, 1, 2].map(pt);
  g.strokeStyle = 'rgba(197,208,230,.38)'; g.lineWidth = 1.2; g.lineJoin = 'round'; g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y)))); g.closePath(); g.stroke();
  g.strokeStyle = 'rgba(197,208,230,.26)'; g.beginPath(); g.moveTo(X(1), Y(0)); g.lineTo(X(P[0][0]), Y(P[0][1])); g.stroke();
  g.strokeStyle = 'rgba(238,242,251,.6)'; g.lineWidth = 1; g.beginPath(); g.arc(X(1), Y(0), 0.5 * sc, 0, -th, true); g.stroke();
  g.fillStyle = 'rgba(197,208,230,.9)'; g.font = `italic 500 12px ${FONT}`; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('θ', X(1.57), Y(0.07) - 5);
  [0, 2, 1].forEach((k) => {                                   // the amplitude of a lepton: the distance of its point from the zero line
    const [x, y] = P[k], col = lepCol(k);
    g.shadowColor = col; g.shadowBlur = 6; g.strokeStyle = col; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(X(0), Y(y)); g.lineTo(X(x), Y(y)); g.stroke(); g.shadowBlur = 0;
  });
  [0, 2, 1].forEach((k) => {
    const [x, y] = P[k], col = lepCol(k), name = L.LEPTONS.find((q) => q.k === k).sym;
    g.fillStyle = '#060a14'; g.beginPath(); g.arc(X(x), Y(y), 7.5, 0, 2 * Math.PI); g.fill(); g.shadowColor = col; g.shadowBlur = 10; g.fillStyle = col; g.beginPath(); g.arc(X(x), Y(y), 5, 0, 2 * Math.PI); g.fill(); g.shadowBlur = 0;
    const off = k === 0 ? [-3, -16] : k === 1 ? [-14, 0] : [13, 13]; g.fillStyle = C.ink; g.font = `700 13.5px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(name, X(x) + off[0], Y(y) + off[1]);
  });
  if (wide) {                                                   // the three amplitudes as bars, with the eigenvalues of C
    const c = L.amplitudes(th), bx = X(3.25), bw = 1.55 * sc;
    g.fillStyle = 'rgba(147,163,192,.95)'; g.font = `700 10px ${FONT}`; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillText('AMPLITUDES', bx - 0.3 * sc, Y(1.2));
    [0, 2, 1].forEach((k, i) => {
      const yy = Y(0.62 - 0.62 * i), col = lepCol(k), name = L.LEPTONS.find((q) => q.k === k).sym, len = Math.max(1.5, (Math.abs(c[k]) / 0.99) * bw);
      g.fillStyle = C.ink; g.font = `700 13px ${FONT}`; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(name, bx - 0.3 * sc, yy);
      g.strokeStyle = 'rgba(140,170,230,.14)'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx, yy); g.lineTo(bx + bw, yy); g.stroke();
      g.shadowColor = col; g.shadowBlur = 6; g.strokeStyle = col; g.beginPath(); g.moveTo(bx, yy); g.lineTo(bx + len, yy); g.stroke(); g.shadowBlur = 0;
      g.fillStyle = 'rgba(214,224,244,.95)'; g.font = `500 11.5px ${FONT}`; g.textBaseline = 'middle'; g.fillText(c[k].toFixed(4), bx, yy + 15);
    });
  }
  Q.dial.__pts = P.map(([x, y]) => [X(x), Y(y)]); Q.dial.__c = [X(1), Y(0)];
}
// the three rates on a logarithmic ladder; hollow diamonds: where the measured masses sit when their sum is the trace 2/9
function drawLadder() {
  const f = fit(Q.ladder); if (!f) return; const { g, w, h } = f, l = 44, r = Math.min(120, w * 0.3), t = 30, b = 30, Y = (v) => t + (clamp(-Math.log10(v), 0, 6.25) / 6.25) * (h - t - b), y = L.rates(S.theta), ms = L.measuredShares();
  g.font = `500 10.5px ${FONT}`; g.textBaseline = 'middle';
  for (let e = 0; e >= -6; e--) { g.strokeStyle = 'rgba(140,170,230,.1)'; g.lineWidth = 1; g.beginPath(); g.moveTo(l, Y(10 ** e)); g.lineTo(w - r, Y(10 ** e)); g.stroke(); g.fillStyle = 'rgba(147,163,192,.95)'; g.textAlign = 'right'; g.fillText(pow10(e), l - 7, Y(10 ** e)); }
  g.fillStyle = 'rgba(147,163,192,.95)'; g.font = `700 10px ${FONT}`; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillText('RATE PER UNIT CLOCK TIME', l, 16);
  [0, 2, 1].forEach((k) => {
    const col = lepCol(k), yy = Y(Math.max(y[k], 1e-300)), below = y[k] < 10 ** -6.25, name = L.LEPTONS.find((q) => q.k === k).sym;
    g.strokeStyle = 'rgba(238,242,251,.9)'; g.lineWidth = 1.3; const mx = l + 14, my = Y(ms[k]); g.beginPath(); g.moveTo(mx, my - 5.5); g.lineTo(mx + 5.5, my); g.lineTo(mx, my + 5.5); g.lineTo(mx - 5.5, my); g.closePath(); g.stroke();
    g.shadowColor = col; g.shadowBlur = 9; g.strokeStyle = col; g.lineWidth = 2.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(l + 28, yy); g.lineTo(w - r - 6, yy); g.stroke(); g.shadowBlur = 0;
    g.fillStyle = C.ink; g.font = `700 13.5px ${FONT}`; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(name, w - r + 6, yy);
    g.fillStyle = 'rgba(214,224,244,.95)'; g.font = `500 11.5px ${FONT}`; g.fillText((below ? '↓ ' : '') + sci(y[k]), w - r + 22, yy + 0.5);
  });
  g.strokeStyle = 'rgba(238,242,251,.9)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(l + 14, h - 15.5); g.lineTo(l + 18.5, h - 11); g.lineTo(l + 14, h - 6.5); g.lineTo(l + 9.5, h - 11); g.closePath(); g.stroke();
  g.fillStyle = 'rgba(147,163,192,.95)'; g.font = `500 10.5px ${FONT}`; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('measured, not blind', l + 26, h - 10.5);
}
function drawQ() {
  const f = fit(Q.qtrace); if (!f) return; const { g, w, h } = f, x = 6 + (S.theta / L.NODE) * (w - 12), y = h / 2;
  g.strokeStyle = 'rgba(238,242,251,.5)'; g.lineWidth = 1.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(6, y); g.lineTo(w - 6, y); g.stroke();
  g.fillStyle = '#060a14'; g.beginPath(); g.arc(x, y, 5.5, 0, 2 * Math.PI); g.fill(); g.fillStyle = C.ink; g.beginPath(); g.arc(x, y, 3.4, 0, 2 * Math.PI); g.fill();
}
function drawRun() {
  const cv = Q.run, run = S.run; if (!cv || !run || !run.phase) return; const f = fit(cv); if (!f) return;
  const { g, w, h } = f, { x, y } = run.phase, l = 52, r = 14, t = 10, b = 32, logx = x[0] > 0 && x[x.length - 1] / x[0] > 50, fx = (v) => (logx ? Math.log10(v) : v), x0 = fx(x[0]), x1 = fx(x[x.length - 1]) || 1;
  let lo = Math.min(2 / 9, ...y), hi = Math.max(2 / 9, ...y); const pad = (hi - lo) * 0.12 || 0.002; lo -= pad; hi += pad;
  const X = (v) => l + ((fx(v) - x0) / (x1 - x0 || 1)) * (w - l - r), Y = (v) => t + (1 - (v - lo) / (hi - lo)) * (h - t - b);
  g.font = `500 10.5px ${FONT}`; g.textBaseline = 'middle'; g.fillStyle = 'rgba(147,163,192,.95)'; g.textAlign = 'right';
  for (const v of [lo + pad, (lo + hi) / 2, hi - pad]) { g.strokeStyle = 'rgba(140,170,230,.1)'; g.lineWidth = 1; g.beginPath(); g.moveTo(l, Y(v)); g.lineTo(w - r, Y(v)); g.stroke(); g.fillText(v.toFixed(4), l - 7, Y(v)); }
  g.textAlign = 'center'; g.textBaseline = 'top'; g.fillText(String(x[0]), X(x[0]), h - b + 6); g.textAlign = 'right'; g.fillText(Number(x[x.length - 1]).toLocaleString('en-US'), w - r, h - b + 6); g.textAlign = 'center'; g.fillText(run.phase.xKey.replace(/_/g, ' '), l + (w - l - r) / 2, h - 13);
  g.strokeStyle = 'rgba(238,242,251,.55)'; g.lineWidth = 1; g.beginPath(); g.moveTo(l, Y(2 / 9)); g.lineTo(w - r, Y(2 / 9)); g.stroke(); g.fillStyle = C.ink; g.font = `700 11px ${FONT}`; g.textAlign = 'right'; g.textBaseline = 'bottom'; g.fillText('2/9', w - r, Y(2 / 9) - 3);
  g.strokeStyle = C.teal; g.lineWidth = 2; g.lineJoin = 'round'; g.beginPath(); x.forEach((v, i) => (i ? g.lineTo(X(v), Y(y[i])) : g.moveTo(X(v), Y(y[i])))); g.stroke();
  if (x.length <= 40) x.forEach((v, i) => { g.fillStyle = '#060a14'; g.beginPath(); g.arc(X(v), Y(y[i]), 3.6, 0, 2 * Math.PI); g.fill(); g.fillStyle = C.teal; g.beginPath(); g.arc(X(v), Y(y[i]), 2, 0, 2 * Math.PI); g.fill(); });
  if (S.runHover !== null && S.runHover !== undefined) { const i = S.runHover; g.strokeStyle = 'rgba(238,242,251,.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(X(x[i]), t); g.lineTo(X(x[i]), h - b); g.stroke(); g.strokeStyle = C.ink; g.lineWidth = 1.5; g.beginPath(); g.arc(X(x[i]), Y(y[i]), 5, 0, 2 * Math.PI); g.stroke(); }
  cv.__X = X;
}

// ---------------------------------------------------------------- live numbers
function setTheta(th) {
  S.theta = clamp(th, 0, L.NODE);
  const at = Math.abs(S.theta - L.THETA) < 1e-12, r = L.ratios(S.theta), big = (v, p) => (Number.isFinite(v) && v < 1e9 ? v.toPrecision(p) : Number.isFinite(v) ? v.toExponential(3) : '∞');
  T.theta.data = at ? '2/9' : S.theta.toFixed(4);
  T.mue.data = at ? r.muE.toFixed(6) : big(r.muE, 9); T.taue.data = at ? r.tauE.toFixed(4) : big(r.tauE, 8); T.koide.data = L.koide(S.theta).toFixed(9);
  const sl = S.host.querySelector('input[data-a="theta"]'); if (sl && Math.abs(+sl.value - S.theta) > 1e-9) sl.value = S.theta;
  drawDial(); drawLadder(); drawQ();
}
const snap = (t) => (Math.abs(t - L.THETA) < 0.0045 ? L.THETA : t);
function newSample() {
  S.sam = L.sampler(S.seed, S.port, S.portY); S.cur = null; S.trail = []; S.recent = []; S.hist = []; S.acc = 0; S.grid = gridBase();
  if (T.tick) { T.tick.data = '0'; T.n.data = '0'; T.mean.data = '0.0000'; T.addr.data = 'none'; T.port.data = String(S.port); }
}
function step(now) {
  if (S.cur) { S.trail.unshift(S.cur.kx); S.trail.length = Math.min(S.trail.length, 3); }
  const d = S.sam.next(); d.t0 = now; S.cur = d; S.recent.push(d); if (S.recent.length > 48) S.recent.shift();
  const n = S.sam.stats.n, lastH = S.hist[S.hist.length - 1]; if (!lastH || n >= lastH.n * 1.04 + 1) S.hist.push({ n, m: S.sam.mean() });
}
function writeLive() {
  const st = S.sam.stats, [a, b] = L.carrier().addresses[S.cur.kx];
  T.tick.data = st.n.toLocaleString('en-US'); T.n.data = st.n.toLocaleString('en-US'); T.mean.data = S.sam.mean().toFixed(4); T.addr.data = a + ' → ' + b;
}
function frame(now) {
  const page = document.getElementById('page-leptons');
  if (!page || !page.classList.contains('on') || !S.sam) { S.raf = 0; return; }
  const dt = Math.min(0.25, (now - (S.last || now)) / 1000); S.last = now;
  if (now > S.hold && !S.drag) S.rot[0] += dt * 0.16;
  let k = 0;
  if (S.playing) { S.acc += dt * SPEEDS[S.speed][1]; while (S.acc >= 1 && k < 120) { step(now); S.acc -= 1; k++; } if (S.acc > 1) S.acc = 0; }
  if (k) { writeLive(); drawGrid(); drawSpark(); }
  drawCarrier(now); drawCells(now);
  S.raf = requestAnimationFrame(frame);
}
function layout() {
  if (!S.host || !S.sam) return;
  drawGrid(); drawSpark(); drawPhase(); drawDial(); drawLadder(); drawQ(); drawRun(); drawCarrier(performance.now()); drawCells(performance.now());
}

// ---------------------------------------------------------------- hover texts
function tip(html, e) {
  const el = S.host.querySelector('.lp-tip'); if (!el) return;
  if (!html) { el.style.display = 'none'; return; }
  el.innerHTML = html; el.style.display = 'block';
  const r = el.getBoundingClientRect(); let x = e.clientX + 14, y = e.clientY + 14;
  if (x + r.width > innerWidth - 8) x = Math.max(8, e.clientX - r.width - 14);
  if (y + r.height > innerHeight - 8) y = Math.max(8, e.clientY - r.height - 14);
  el.style.left = x + 'px'; el.style.top = y + 'px';
}
function rowTip(r) {
  const u = r.unit ? ' ' + r.unit : '';
  return `<div class="lp-th">${esc(r.how)}</div><div><span>model</span><b>${r.id === 'koide' ? '2/3' : r.model.toPrecision(12)}${u}</b></div><div><span>measured</span><b>${r.measuredText}${u}</b></div>
    <div><span>model − measured</span><b>${signed(r.diff, 0).slice(0, 1)}${Math.abs(r.diff).toPrecision(4)}${u}</b></div><div><span>relative</span><b>${signed(r.ppm, 3)} ppm</b></div><div><span>in standard deviations</span><b>${signed(r.sigma, 2)}</b></div>
    <div><span>one standard deviation</span><b>${r.uncPpm.toPrecision(3)} ppm</b></div>`;
}

// ---------------------------------------------------------------- the executed run of lane LR
const relDiff = (v, ref) => { const d = v / ref - 1; if (d === 0) return '0'; const e = Math.floor(Math.log10(Math.abs(d))); return (d > 0 ? '+' : '−') + (Math.abs(d) / 10 ** e).toFixed(1) + '×' + pow10(e); };
async function loadRun() {
  S.runAt = Date.now(); let json = null;
  try { const res = await fetch('rl/LR/lepton_run.json', { cache: 'no-store' }); if (res.ok) json = await res.json(); } catch (e) { json = null; }
  const next = json ? L.parseRun(json) : null, sig = JSON.stringify(next);
  if (sig === S.runSig) return; S.runSig = sig; S.run = next; renderRun();
}
function renderRun() {
  const state = S.host.querySelector('[data-x="runstate"]'), body = S.host.querySelector('[data-x="runbody"]'), run = S.run; if (!state || !body) return;
  if (!S.pg) S.pg = laneProgress('LR', { label: 'lane LR on the compute box' });
  Q.run = null;
  const card = body.closest('.lp-run'); card.dataset.statements = run && run.statements.length ? run.statements.map((s) => (s.label ? `<b>${esc(s.label)}</b>${s.status ? ' · ' + esc(s.status) : ''}: ` : '') + esc(s.text)).join('<br>') : '';
  const has = run && (run.phase || run.rates), y = L.rates(), last = has && run.phase ? run.phase.y[run.phase.y.length - 1] : null;
  state.innerHTML = has ? pill('derived', 'executed') : '';
  body.innerHTML = !has ? `<div class="lp-wait"><div>phase per unit clock time against ticks</div><div>the three rates from the executed register</div></div>`
    : `${run.phase ? `<div class="lp-vis lp-vis-run"><canvas data-c="run"></canvas></div><div class="lp-cap">${run.limit !== null ? `limit of the executed values ${run.limit.toFixed(12)} · minus 2/9: ${(run.limit - 2 / 9).toExponential(1)}` : `last point ${last.toFixed(9)} · minus 2/9: ${(last - 2 / 9).toExponential(2)}`}</div>` : ''}
    ${run.rates ? `<div class="lp-tscroll"><table class="lp-rt lp-rates"><thead><tr><th></th><th class="lp-r">executed rate</th><th class="lp-r">formula</th><th class="lp-r">difference</th></tr></thead><tbody>${L.LEPTONS.slice().reverse().map((q) => { const v = run.rates[q.name], ref = run.formula ? run.formula[q.name] : y[q.k];
      return `<tr><td><i style="--c:${lepCol(q.k)}"></i>${q.sym}</td><td class="lp-r">${v.toPrecision(10)}</td><td class="lp-r">${ref.toPrecision(10)}</td><td class="lp-r">${relDiff(v, ref)}</td></tr>`; }).join('')}</tbody></table></div>` : ''}`;
  body.insertBefore(S.pg, body.firstChild);                       // the progress of the run on the compute box; it hides itself when the run is done
  Q.run = body.querySelector('canvas[data-c="run"]');
  if (Q.run) {
    Q.run.addEventListener('pointermove', (e) => { const X = Q.run.__X; if (!X) return; const px = e.offsetX, xs = run.phase.x; let best = 0; xs.forEach((v, i) => { if (Math.abs(X(v) - px) < Math.abs(X(xs[best]) - px)) best = i; });
      S.runHover = best; drawRun(); tip(`<div class="lp-th">${esc(run.phase.xKey.replace(/_/g, ' '))} ${Number(xs[best]).toLocaleString('en-US')}</div><div><span>phase per unit clock time</span><b>${run.phase.y[best].toFixed(9)}</b></div><div><span>minus 2/9</span><b>${(run.phase.y[best] - 2 / 9).toExponential(3)}</b></div>`, e); });
    Q.run.addEventListener('pointerleave', () => { S.runHover = null; drawRun(); tip(null); });
  }
  drawRun();
}

// ---------------------------------------------------------------- open items
function showOpen(id) {
  const box = S.host.querySelector('.lp-openbox'), o = L.OPEN_STEPS.find((x) => x.id === id);
  S.open = S.open === id ? null : id;
  S.host.querySelectorAll('.lp-chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.id === S.open)));
  if (!S.open || !o) { box.hidden = true; box.innerHTML = ''; return; }
  const code = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
  let text = code(o.state); if (o.missing) text = text.replace(code(o.missing), `<mark>${code(o.missing)}</mark>`);
  box.hidden = false;
  box.innerHTML = `<div class="lp-oh"><b>${o.id}</b><span>${esc(o.item)}</span>${pill('open', 'open')}<span class="lp-grow"></span>${src(DER + 'LEPTON_STEPS.md', 'steps table')}${src(DER + 'reports/' + o.report + '.md', 'report ' + o.report)}</div><div class="lp-ot">${text}</div>`;
}

// ---------------------------------------------------------------- mount
export function mount(host) {
  S.host = host; readTokens(); S.sam = L.sampler(S.seed, S.port, S.portY); S.grid = gridBase();
  host.innerHTML = skeleton();
  host.querySelectorAll('canvas[data-c]').forEach((c) => { Q[c.dataset.c] = c; });
  host.querySelectorAll('[data-t]').forEach((el) => { const n = document.createTextNode(el.textContent); el.textContent = ''; el.appendChild(n); T[el.dataset.t] = n; });
  typeset(host);

  // step 1: turn the carrier, click a port to move the pair
  const cv = Q.carrier; let down = null;
  cv.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, rot: S.rot.slice(), moved: 0 }; S.drag = true; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - down.x, dy = e.clientY - down.y; down.moved = Math.max(down.moved, Math.hypot(dx, dy)); S.rot = [down.rot[0] + dx * 0.012, clamp(down.rot[1] + dy * 0.012, -1.3, 1.3)]; });
  const up = (e) => {
    if (!down) return; S.drag = null; S.hold = performance.now() + 5000;
    if (down.moved < 4 && S.proj.length) {
      const r = cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top; let best = -1, bd = 16;
      S.proj.forEach(([x, y, z], p) => { const d = Math.hypot(x - px, y - py) - 2 * z; if (d < bd) { bd = d; best = p; } });
      if (best >= 0 && best !== S.port) { S.port = best; newSample(); const w = L.doubleTick(S.port).weights, c = L.twoCells(S.port, S.portY);       // recomputed for the new port: the same weights
        host.querySelector('[data-x="w2"]').textContent = w.record2; host.querySelector('[data-x="w3"]').textContent = w.record3; host.querySelector('[data-x="w0"]').textContent = w.blank;
        host.querySelector('[data-x="count"]').textContent = c.count; host.querySelector('[data-x="sum"]').textContent = `${c.pR} + ${c.pH} − 2 × ${c.joint}`; layout(); }
    }
    down = null;
  };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', () => { down = null; S.drag = null; });

  // step 2: run or pause, tick rate, restart
  host.querySelector('[data-a="play"]').onclick = (e) => { S.playing = !S.playing; e.currentTarget.textContent = S.playing ? '❚❚' : '▶'; };
  host.querySelector('[data-a="speed"]').onclick = (e) => { S.speed = (S.speed + 1) % SPEEDS.length; e.currentTarget.textContent = SPEEDS[S.speed][0]; };
  host.querySelector('[data-a="reset"]').onclick = () => { S.seed = (S.seed * 1103515245 + 12345) >>> 0; newSample(); layout(); };

  // step 3: read the curve
  Q.phase.addEventListener('pointermove', (e) => { const geo = Q.phase.__geo; if (!geo) return; const N = Math.max(1, Math.min(1000, Math.round(10 ** (clamp((e.offsetX - geo.l) / (geo.w - geo.l - geo.r), 0, 1) * 3))));
    S.phaseHover = N; drawPhase(); tip(`<div class="lp-th">N = ${N} round${N > 1 ? 's' : ''} per unit clock time</div><div><span>phase per unit clock time</span><b>${L.phasePerUnit(N).toFixed(9)}</b></div><div><span>2/9 minus the phase</span><b>${(2 / 9 - L.phasePerUnit(N)).toExponential(3)}</b></div><div><span>amplitude kept</span><b>${L.modulusKept(N).toFixed(6)}</b></div>`, e); });
  Q.phase.addEventListener('pointerleave', () => { S.phaseHover = null; drawPhase(); tip(null); });

  // step 4: the dial
  const dial = Q.dial; let grab = null;
  const turn = (e) => { const [cx, cy] = dial.__c, a = Math.atan2(-(e.offsetY - cy), e.offsetX - cx); let th = a - (2 * Math.PI * grab) / 3; th = Math.atan2(Math.sin(th), Math.cos(th)); setTheta(snap(clamp(th, 0, L.NODE))); };
  dial.addEventListener('pointerdown', (e) => { const pts = dial.__pts || []; grab = 0; let bd = 1e9; pts.forEach(([x, y], k) => { const d = Math.hypot(x - e.offsetX, y - e.offsetY); if (d < bd) { bd = d; grab = k; } }); dial.setPointerCapture(e.pointerId); turn(e); });
  dial.addEventListener('pointermove', (e) => { if (grab !== null) turn(e); });
  const drop = () => { grab = null; }; dial.addEventListener('pointerup', drop); dial.addEventListener('pointercancel', drop);
  host.querySelector('input[data-a="theta"]').addEventListener('input', (e) => setTheta(snap(+e.target.value)));
  host.querySelector('[data-a="snap"]').onclick = () => setTheta(L.THETA);

  // comparison rows, residual marks
  const rows = Object.fromEntries(L.comparison().map((r) => [r.id, r]));
  host.querySelectorAll('.lp-table tbody tr[data-id]').forEach((tr) => { tr.addEventListener('pointermove', (e) => { if (e.target.closest('a')) return tip(null); tip(rowTip(rows[tr.dataset.id]), e); }); tr.addEventListener('pointerleave', () => tip(null)); });
  const res = Object.fromEntries(L.RESIDUAL.rows.map((r) => [r.id, r]));
  host.querySelectorAll('.lp-ressvg .lp-pt').forEach((pt) => {
    const show = (e) => { const r = res[pt.dataset.id], b = pt.getBoundingClientRect(); tip(`<div class="lp-th">${r.id} · ${esc(r.reading)}</div><div><span>coefficient of (α/π)²</span><b>${minus(r.coefficient)}</b></div><div><span>residual of μ/e</span><b>${signed(r.ppm, r.ppm < 1 ? 3 : 2)} ppm</b></div><div><span>tau mass</span><b>${r.mTau} MeV</b></div><div><span>Q − 2/3</span><b>${minus(r.dQ)}</b></div>`, e.clientX ? e : { clientX: b.right, clientY: b.bottom }); };
    pt.addEventListener('pointermove', show); pt.addEventListener('focus', show); pt.addEventListener('pointerleave', () => tip(null)); pt.addEventListener('blur', () => tip(null));
  });
  host.querySelector('[data-a="restable"]').onclick = (e) => { const t = host.querySelector('.lp-restable'); t.hidden = !t.hidden; e.currentTarget.setAttribute('aria-pressed', String(!t.hidden)); };

  // open items: a chip opens its sentence and lights its step
  host.querySelectorAll('.lp-chip').forEach((c) => {
    c.onclick = () => showOpen(c.dataset.id);
    const card = host.querySelector(`.lp-card[data-step="${c.dataset.step}"]`);
    c.addEventListener('pointerenter', () => card && card.style.setProperty('--lit', 1)); c.addEventListener('pointerleave', () => card && card.style.setProperty('--lit', 0));
  });
  host.querySelector('[data-a="toscale"]').onclick = (e) => { e.preventDefault(); if (S.open !== 'L6') showOpen('L6'); host.querySelector('.lp-open').scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  host.querySelector('[data-a="decoder"]').onclick = () => import('./app.js').then((m) => m.showPage('decoder')).catch(() => {});

  const ro = new ResizeObserver(() => layout()); ro.observe(host.querySelector('.lp-wrap')); host.querySelectorAll('.lp-vis').forEach((v) => ro.observe(v));
  setTheta(L.THETA); renderRun(); loadRun();
  window.__leptons = { state: S, engine: L, renderRun };
}
export function shown() {
  if (!S.host) return;
  layout();
  if (!S.raf) { S.last = 0; S.raf = requestAnimationFrame(frame); }
  if (Date.now() - S.runAt > 15000) loadRun();
}
