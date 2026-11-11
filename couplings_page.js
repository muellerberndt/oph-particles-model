// The Couplings page: the coupling chain, computed live in the browser by couplings_chain.js.
// One plot of the three inverse couplings against the energy from the electroweak anchor to the cell, redrawn for each
// matter content; a readout against measured values (not blind); the flux classes with the counts behind the
// electroweak scale; the exact ratio test of the slopes; the status of every item: derived, declared or open.
// Sources: repair-law/COUPLING_FIX.md and the reports CA_ANCHOR, CU_UNIFICATION, CH_HYPERCHARGE, CG_COLLAR, CC, LV;
// model/defect_particle_classes/flux_costs.py and extra/fine_structure_constant_derivation.tex of the theory repository.
// Status of the chain: declared forms that fit; derivation open. Check: node couplings_check.mjs.
// Layout: style/couplings.css. Every solve takes a few milliseconds, so the page needs no progress indicator.
import { linkList, SRC, RER, SITE, DER } from './links.js';
import { tex, typeset } from './math.js';
import { CLASSES, classGlyph } from './classes.js';
import { CODATA_SOURCE, MEASURED, MEASURED_SOURCE, P_FIXED, VARIANTS, fluxClasses, fstr, fval, measuredCouplings, ratioOf, readAt, slopeRatio, thomsonTransport, variant } from './couplings_chain.js';

// the links of this page, also held by links.js under the key couplingChain
export const CP_LINKS = [
  ['Derivation: the anchor at the first freeze of the weak currents', DER + 'reports/CA_ANCHOR.md'],
  ['Derivation: the unification scale and the power of P', DER + 'reports/CU_UNIFICATION.md'],
  ['Derivation: the hypercharge slope and the exact ratio', DER + 'reports/CH_HYPERCHARGE.md'],
  ['Derivation: the collar law', DER + 'reports/CG_COLLAR.md'],
  ['Derivation: the law for v and the count 4', DER + 'reports/LV.md'],
  ['Audit: the dictionary between heat time and coupling', DER + 'reports/CC.md'],
  ['Certificate: plaquette cost of each flux class', RER + 'model/defect_particle_classes/flux_costs.py'],
  ['Proof: defect classes and particle classes', RER + 'model/defect_particle_classes/PROOF.md'],
  ['Code: the chain solver of this page', SITE + 'couplings_chain.js'],
  ['Its check against the reference tables', SITE + 'couplings_check.mjs'],
];

const ORDER = ['declared', 'source', 'two', 'stack'];
const UI = {
  declared: { label: 'declared slopes', what: 'the paper’s chain' },
  source: { label: 'source as built', what: 'one Higgs doublet · 16 + 16̄ per copy · multiplicity 2 in v' },
  two: { label: 'two doublets', what: 'the source census with a second doublet' },
  stack: { label: 'stack’s own M<sub>U</sub>', what: 'declared slopes · M<sub>U</sub> one modular period below the cell' },
};
const SERIES = [{ name: 'U(1)', c: 'var(--u1)' }, { name: 'SU(2)', c: 'var(--su2)' }, { name: 'SU(3)', c: 'var(--su3)' }].map((s, i) => ({ ...s, sym: `1/α<sub>${i + 1}</sub>` }));
const STATUS = [   // focus key, status, item, words on the chip
  ['chain', 'declared', 'coupling chain', 'declared forms that fit; derivation open'],
  ['anchor', 'premise', 'anchor at m<sub>Z</sub>', 'one premise'],
  ['mu', 'open', 'M<sub>U</sub>: the power P<sup>2/3</sup>', 'open'],
  ['hyper', 'open', 'hypercharge slope', 'open'],
  ['collar', 'declared', 'collar law', 'declared'],
  ['count', 'derived', 'the count 4', 'derived'],
];
const withErr = (m, d) => m.value.toFixed(d) + (m.err ? `(${Math.round(m.err * 10 ** d)})` : '');
const ROWS = [   // key in MEASURED, label, value of the solved chain, its digits, text of the measured value
  ['v', 'v', (s) => s.v, 2, (m) => withErr(m, 2)],
  ['alphaS', 'α<sub>s</sub>(m<sub>Z</sub>)', (s) => s.alphaS, 5, (m) => withErr(m, 4)],
  ['sin2', 'sin²θ<sub>W</sub>(m<sub>Z</sub>)', (s) => s.sin2, 5, (m) => withErr(m, 5)],
  ['aemInv', '1/α<sub>em</sub>(m<sub>Z</sub>)', (s) => s.aemInv, 3, (m) => withErr(m, 3)],
  ['alpha0Inv', '1/α(0)', (s) => thomsonTransport(s).AT, 3, (m) => m.value.toFixed(6)],
  ['mZ', 'm<sub>Z</sub>, tree', (s) => s.mZ, 3, (m) => withErr(m, 4)],
  ['mW', 'm<sub>W</sub>, tree', (s) => s.mW, 3, (m) => withErr(m, 4)],
];

// ---------------------------------------------------------------- formats
// numbers as HTML, and as SVG text (sub and superscripts as shifted tspans, each followed by a tspan that returns)
const sci = (v, d = 2) => { const [m, e] = v.toExponential(d).split('e'); return `${m} × 10<sup>${Number(e)}</sup>`; };
const gev = (v) => (v >= 1e4 ? sci(v) : v.toFixed(v >= 100 ? 1 : 2)) + ' GeV';
const lo = (t) => `<tspan class="cp-sup" dy="3">${t}</tspan>`, hi = (t) => `<tspan class="cp-sup" dy="-4.5">${t}</tspan>`;
const afterLo = (t, dx = 0, cls = '') => `<tspan dy="-3"${dx ? ` dx="${dx}"` : ''}${cls ? ` class="${cls}"` : ''}>${t}</tspan>`;
const afterHi = (t, dx = 0, cls = '') => `<tspan dy="4.5"${dx ? ` dx="${dx}"` : ''}${cls ? ` class="${cls}"` : ''}>${t}</tspan>`;
const gevSvg = (v) => (v >= 1e4 ? (() => { const [m, e] = v.toExponential(2).split('e'); return `${m} × 10${hi(Number(e))}${afterHi('GeV', 4)}`; })() : v.toFixed(v >= 100 ? 1 : 2) + ' GeV');
const minus = (s) => String(s).replace(/-/g, '−');
const slopeText = (b) => minus(`(${b.map(fstr).join(', ')})`);
const devPercent = (chain, m) => 100 * (chain / m.value - 1);
function devText(d) { const a = Math.abs(d); return (d < 0 ? '−' : '+') + a.toFixed(a >= 1 ? 1 : a >= 0.1 ? 2 : 3) + ' %'; }
// the last word of a line in a span that does not wrap: a help badge appended to it never stands alone on a line
const lastWord = (html) => { const i = html.lastIndexOf(' '); return `${html.slice(0, i + 1)}<span class="cp-last">${html.slice(i + 1)}</span>`; };

let host = null, cur = 'declared', G = null, FLUX = null;

// ---------------------------------------------------------------- skeleton
function skeleton() {
  FLUX = fluxClasses();
  const dial = (x, col) => {      // one level: the eigenphase of the shortest generator as an arc, a full circle is 2 pi
    const a = Math.PI * fval(x), r = 6.6, c = 9, ex = c + r * Math.sin(a), ey = c - r * Math.cos(a);
    return `<svg width="18" height="18" viewBox="0 0 18 18"><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="rgba(160,180,220,.18)" stroke-width="1.5"/>${
      a ? `<path d="M ${c} ${(c - r).toFixed(2)} A ${r} ${r} 0 ${Math.abs(a) > Math.PI ? 1 : 0} ${a > 0 ? 1 : 0} ${ex.toFixed(2)} ${ey.toFixed(2)}" fill="none" stroke="${col}" stroke-width="2.3" stroke-linecap="round"/>` : ''
    }<circle cx="${ex.toFixed(2)}" cy="${ey.toFixed(2)}" r="1.8" fill="${a ? col : 'rgba(160,180,220,.55)'}"/></svg>`;
  };
  const tile = (r) => `<div class="cp-tile" data-k="${r.k}" style="--c:${CLASSES[r.k].color}">
      <div class="cp-tk cp-kick">${classGlyph(r.k, 16)}<span>class ${r.k}</span></div>
      <div class="cp-dials">${r.phases.slice(0, 3).map((x) => dial(x, 'var(--su3)')).join('')}<span class="gap"></span>${r.phases.slice(3).map((x) => dial(x, 'var(--su2)')).join('')}</div>
      <div class="cp-tr">tr H<sup>†</sup>H = <b>${fstr(r.trace)}</b> π²</div>
      <div class="cp-count">${r.count ? fstr(r.count) : 'none'}</div><div class="cp-cl cp-kick">${r.count ? 'count' : 'no flux'}</div></div>`;
  const links = SRC.couplingChain ? linkList(['coupling', 'gauge', 'electroweak', 'couplingChain'])
    : linkList(['coupling', 'gauge', 'electroweak']).replace(/<\/div>$/, CP_LINKS.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join('') + '</div>');
  return `<div class="cp-wrap">
    <header class="cp-head">
      <h2>Couplings</h2>
      <div class="cp-map"><b class="cp-kick">map into this step</b><span>${lastWord('The couplings are equal at the cell and are read where the weak currents first freeze.')}</span></div>
      <div class="cp-status">${STATUS.map(([f, s, item, word]) => `<span class="cp-st" data-f="${f}" data-s="${s}"><em>${item}</em><span class="cp-stc"><b class="cp-chip">${word}</b></span></span>`).join('')}</div>
    </header>
    <div class="cp-row cp-hero">
      <section class="cp-card cp-plotcard">
        <div class="cp-bar"><span class="cp-kick cp-segk">matter content</span><div class="cp-seg">${ORDER.map((k) => `<button data-v="${k}">${UI[k].label}</button>`).join('')}</div></div>
        <div class="cp-what"></div>
        <div class="cp-plot"><svg id="cp-svg" role="img" aria-label="The three inverse couplings against the energy from the electroweak anchor to the cell"></svg>
          <div class="cp-striplab cp-kick">closure, left side</div><div class="cp-tip"></div></div>
        <div class="cp-legend">${SERIES.map((s) => `<span style="--c:${s.c}"><i></i><span>${s.sym} ${s.name}</span></span>`).join('')}<span class="cp-lg-meas"><i class="ring"></i><span>measured at m<sub>Z</sub>, PDG 2024, not blind</span></span><span class="cp-lg-ghost"><i class="ghost"></i><span>declared chain</span></span></div>
      </section>
      <section class="cp-card cp-side">
        <div class="cp-readout"><div class="cp-k"><span class="cp-kick">readout</span><span class="cp-chip" data-s="blind">not blind</span></div>
          <div class="cp-tablebox"><table class="cp-table"><thead><tr><th class="cp-kick">quantity</th><th class="cp-kick">chain</th><th class="cp-kick">measured</th><th class="cp-kick">deviation</th></tr></thead><tbody></tbody></table></div>
          <div class="cp-src">Measured: <a href="${MEASURED_SOURCE.url}" target="_blank" rel="noopener">${MEASURED_SOURCE.name} ↗</a> and <span class="cp-last"><a href="${CODATA_SOURCE.url}" target="_blank" rel="noopener">${CODATA_SOURCE.name} ↗</a></span></div></div>
        <div class="cp-sep"></div>
        <div class="cp-formsbox"><div class="cp-k cp-fk"><span class="cp-kick">forms of the chain</span></div>
          <div class="cp-forms"></div></div>
      </section>
    </div>
    <div class="cp-row cp-lower">
      <section class="cp-card cp-flux">
        <div class="cp-ph"><h3>Flux classes and the count 4</h3>
          <div class="cp-sub"><span style="--c:var(--su3)"><i></i><span>three colour levels</span></span><span style="--c:var(--su2)"><i></i><span>two weak levels</span></span></div></div>
        <div class="cp-tiles">${FLUX.map(tile).join('')}</div>
        <div class="cp-fluxcap"><span class="cp-fluxf"></span><span class="cp-fluxn"></span></div>
      </section>
      <section class="cp-card cp-ratio">
        <div class="cp-ph"><h3>The exact ratio test</h3><span class="cp-chip" data-s="blind">measured: PDG 2024 · not blind</span></div>
        <div class="cp-ratio-f">${tex('\\frac{\\alpha_2^{-1}-\\alpha_3^{-1}}{\\alpha_1^{-1}-\\alpha_2^{-1}}\\bigg|_{m_Z}=\\;\\frac{b_2-b_3}{b_1-b_2}', true)}</div>
        <div class="cp-ratio-plot"><svg id="cp-ratio-svg" role="img" aria-label="The ratio of the differences of the inverse couplings for each matter content against the measured ratio"></svg></div>
      </section>
    </div>
    <footer class="cp-foot">${links}</footer>
  </div>`;
}

// ---------------------------------------------------------------- readout, forms, captions (rebuilt for each variant)
function renderSide() {
  const s = variant(cur), v = VARIANTS[cur];
  host.querySelectorAll('.cp-seg button').forEach((b) => { b.classList.toggle('on', b.dataset.v === cur); b.setAttribute('aria-pressed', String(b.dataset.v === cur)); });
  host.querySelector('.cp-what').innerHTML = lastWord(`slopes <b>${slopeText(v.slopes)}</b> · ${UI[cur].what}`);
  host.querySelector('.cp-lg-ghost').style.display = cur === 'declared' ? 'none' : '';
  host.querySelector('.cp-table tbody').innerHTML = ROWS.map(([k, label, get, dc, mt]) => {
    const val = get(s), d = devPercent(val, MEASURED[k]), len = 16 * Math.max(0, Math.min(1, (Math.log10(Math.abs(d)) + 2) / 4));
    return `<tr data-q="${k}"><td>${label}</td><td class="cp-c">${val.toFixed(dc)}</td><td>${mt(MEASURED[k])}</td>
      <td class="cp-d"><span class="cp-dev"><span>${devText(d)}</span><span class="cp-devbar"><i style="left:${(17 + Math.sign(d) * len - 2).toFixed(1)}px"></i></span></span></td></tr>`;
  }).join('');
  const mu = v.c ? 'M_U=E_{\\rm cell}\\,e^{-2\\pi}P^{2/3}' : 'M_U=E_{\\rm cell}\\,e^{-2\\pi}';
  const f2 = v.pref === 1 ? '' : v.pref + '\\,';
  const forms = [
    ['pix', 'P=\\varphi+\\sqrt{\\pi}\\,\\alpha(0)', String(P_FIXED)],
    ['cell', 'E_{\\rm cell}=E_\\star/\\sqrt{P}', gev(s.Ecell)],
    ['mu', mu, gev(s.MU)],
    ['closure', '\\bar\\ell_{SU(2)}(t_2)+\\bar\\ell_{SU(3)}(t_3)=\\tfrac{P}{4}', `1/α<sub>U</sub> = ${s.x.toFixed(4)}`],
    ['v', `v=${f2}E_{\\rm cell}\\,e^{-2\\pi/(\\textcolor{#3fe0d0}{\\mathbf{4}}\\alpha_U)}`, `${s.v.toFixed(2)} GeV`],
    ['anchor', '\\mu_A=m_Z(\\mu_A),\\;\\;t_i=4\\pi^2\\alpha_i(\\mu_A)', `${s.mu.toFixed(3)} GeV`],
  ];
  host.querySelector('.cp-forms').innerHTML = forms.map(([f, t, val]) => `<div class="cp-form" data-f="${f}"><span class="cp-fx">${tex(t)}</span><b>${val}</b></div>`).join('');
  host.querySelector('.cp-fluxf').innerHTML = tex(`v=${f2}E_{\\rm cell}\\,\\exp\\!\\Big[-\\frac{2\\pi}{\\textcolor{#3fe0d0}{\\mathbf{4}}\\,\\alpha_U}\\Big]=${f2}E_{\\rm cell}\\,e^{-{\\rm tr}_5H_3^\\dagger H_3/g^2}`);
  host.querySelector('.cp-fluxn').innerHTML = `${v.pref === 1 ? '' : v.pref + ' × '}${sci(s.Ecell, 3)} GeV × e<sup>−${(2 * Math.PI * s.x / 4).toFixed(3)}</sup> = <b>${s.v.toFixed(2)} GeV</b>`;
  // formulas change the height of rows while they typeset, so the drawings are repeated once the layout has settled
  typeset(host).then(redraw);
}

// ---------------------------------------------------------------- the plot
// The drawing fills its box exactly: tick labels start at the left edge, the grid ends at the right edge, the scale
// labels sit in the top band, the energy axis at the bottom. Below 600 px of width the labels take a compact arrangement.
function drawPlot() {
  const box = host.querySelector('.cp-plot'), svg = host.querySelector('#cp-svg'), W = box.clientWidth, H = box.clientHeight;
  if (!W || !H) return;
  const s = variant(cur), ref = variant('declared'), meas = measuredCouplings(), v = VARIANTS[cur], narrow = W < 600;
  const x0 = 28, x1 = W, yTop = narrow ? 70 : 48, gap = narrow ? 68 : 52, stripH = Math.max(54, Math.min(78, H * 0.14));
  const sBot = H - 24, sTop = sBot - stripH, yBot = sTop - gap;
  const LX0 = 0.6, LX1 = 19.6, X = (lg) => x0 + (lg - LX0) / (LX1 - LX0) * (x1 - x0), lx = (mu) => X(Math.log10(mu));
  const YMAX = 72, Y = (val) => yBot - val / YMAX * (yBot - yTop);
  const S0 = 0.3, S1 = 0.93, YS = (val) => sBot - (val - S0) / (S1 - S0) * (sBot - sTop);
  G = { x0, x1, yTop, sBot, LX0, LX1, X, Y, YS, s, W, H };
  const f = (n) => n.toFixed(1), xA = lx(s.mu), xM = lx(s.MU), xE = lx(s.Ecell), xV = lx(s.v), atA = s.inv, yU = Y(s.x);
  let o = '';
  // grid and axes
  for (const val of [0, 20, 40, 60]) o += `<line class="cp-grid" x1="${x0}" x2="${x1}" y1="${f(Y(val))}" y2="${f(Y(val))}"/><text class="cp-ax" x="0" y="${f(Y(val) + 4)}">${val}</text>`;
  o += `<text class="cp-ax" x="0" y="${f(yTop - 10)}">1/α</text>`;
  o += `<line class="cp-grid" x1="${x0}" x2="${x1}" y1="${f(sBot)}" y2="${f(sBot)}"/>`;
  for (let e = 2; e <= 18; e += narrow ? 4 : 2) o += `<line class="cp-grid" x1="${f(X(e))}" x2="${f(X(e))}" y1="${f(sBot)}" y2="${f(sBot + 4)}"/><text class="cp-ax" x="${f(X(e))}" y="${f(sBot + 18)}" text-anchor="middle">10${hi(e)}${e === 2 ? afterHi('GeV', 4) : ''}</text>`;
  // the three marked scales: anchor, M_U, E_cell
  if (narrow) {       // one row per scale, each label on top of its line
    o += `<line class="cp-mark" x1="${f(xE)}" x2="${f(xE)}" y1="18" y2="${f(sBot)}"/><text class="cp-mk" x="${f(W)}" y="12" text-anchor="end">E${lo('cell')}<tspan class="v" dy="-3" dx="6">${gevSvg(s.Ecell)}</tspan></text>`;
    o += `<line class="cp-mark cp-f-mu" x1="${f(xM)}" x2="${f(xM)}" y1="35" y2="${f(sBot)}"/><text class="cp-mk" x="${f(xM - 6)}" y="29" text-anchor="end">M${lo('U')}<tspan class="v" dy="-3" dx="6">${gevSvg(s.MU)}</tspan></text>`;
    o += `<line class="cp-mark cp-f-anchor" x1="${f(xA)}" x2="${f(xA)}" y1="52" y2="${f(sBot)}"/><text class="cp-mk" x="${f(xA + 6)}" y="46">anchor<tspan class="v" dx="6">${gevSvg(s.mu)}</tspan></text>`;
  } else {
    o += `<line class="cp-mark cp-f-anchor" x1="${f(xA)}" x2="${f(xA)}" y1="2" y2="${f(sBot)}"/><text class="cp-mk" x="${f(xA + 7)}" y="12">anchor<tspan dx="7">μ = m</tspan>${lo('Z')}${afterLo('(μ)')}</text><text class="cp-mv" x="${f(xA + 7)}" y="29">${gevSvg(s.mu)}</text>`;
    o += `<line class="cp-mark cp-f-mu" x1="${f(xM)}" x2="${f(xM)}" y1="2" y2="${f(sBot)}"/><text class="cp-mk" x="${f(xM - 7)}" y="12" text-anchor="end">M${lo('U')}</text><text class="cp-mv" x="${f(xM - 7)}" y="29" text-anchor="end">${gevSvg(s.MU)}</text>`;
    o += `<line class="cp-mark" x1="${f(xE)}" x2="${f(xE)}" y1="36" y2="${f(sBot)}"/><text class="cp-mk" x="${f(W)}" y="12" text-anchor="end">E${lo('cell')}</text><text class="cp-mv" x="${f(W)}" y="29" text-anchor="end">${gevSvg(s.Ecell)}</text>`;
  }
  // the declared chain as a faint reference under every other variant
  if (cur !== 'declared') {
    const rA = lx(ref.mu), rM = lx(ref.MU);
    SERIES.forEach((se, i) => { o += `<line class="cp-ghost" stroke="${se.c}" x1="${f(rA)}" y1="${f(Y(ref.inv[i]))}" x2="${f(rM)}" y2="${f(Y(ref.x))}"/>`; });
    o += `<line class="cp-ghost" stroke="#dfe6f5" x1="${f(rM)}" y1="${f(Y(ref.x))}" x2="${f(lx(ref.Ecell))}" y2="${f(Y(ref.x))}"/>`;
    if (Math.abs(rM - xM) > 1) o += `<line class="cp-ghost" stroke="#dfe6f5" stroke-dasharray="2 4" x1="${f(rM)}" x2="${f(rM)}" y1="${f(yTop)}" y2="${f(yBot)}"/>`;
  }
  // between M_U and the cell the chain holds the couplings: one dotted line
  o += `<line class="cp-win" x1="${f(xM)}" y1="${f(yU)}" x2="${f(xE)}" y2="${f(yU)}"/>`;
  { const at = narrow ? `x="${f(W)}" y="${f(yU + 28)}" text-anchor="end"` : `x="${f((xM + xE) / 2)}" y="${f(yU + 21)}" text-anchor="middle"`;
    o += `<text class="cp-brt" ${at}><tspan class="n">1/α</tspan><tspan class="cp-sup n" dy="3">U</tspan>${afterLo('= ' + s.x.toFixed(4), 5)}</text>`; }
  // the form of M_U as a bracket between the cell and M_U
  { const yb = yU - 17, at = narrow ? `x="${f(W)}" text-anchor="end"` : `x="${f((xM + xE) / 2)}" text-anchor="middle"`;
    o += `<path class="cp-br cp-f-mu" d="M ${f(xM)} ${f(yb + 5)} V ${f(yb)} H ${f(xE)} V ${f(yb + 5)}"/><text class="cp-brt" ${at} y="${f(yb - 8)}">× e${hi('−2π')}${v.c ? afterHi('P', 4) + hi('2/3') : ''}</text>`; }
  // the three couplings from the anchor to M_U
  SERIES.forEach((se, i) => { o += `<line class="cp-ln${i === 0 ? ' cp-f-hyper' : ''}" stroke="${se.c}" x1="${f(xA)}" y1="${f(Y(atA[i]))}" x2="${f(xM)}" y2="${f(yU)}"/>`; });
  // measured values at m_Z (rings), the chain's values at its anchor (dots), the meeting point
  const xZ = lx(MEASURED.mZ.value);
  meas.inv.forEach((val) => { o += `<circle class="cp-meas" cx="${f(xZ)}" cy="${f(Y(val))}" r="6.5"/>`; });
  SERIES.forEach((se, i) => {
    o += `<circle class="cp-dot" cx="${f(xA)}" cy="${f(Y(atA[i]))}" r="4.5" fill="${se.c}"/>`;
    // a label sits on the side its line moves away from: above the two falling lines, below the rising one
    o += `<text class="cp-lab" x="${f(xA + 13)}" y="${f(Y(atA[i]) + (i === 2 ? 19 : -10))}"><tspan class="n">1/α</tspan><tspan class="cp-sup n" dy="3">${i + 1}</tspan>${afterLo(atA[i].toFixed(3), 6)}</text>`;
  });
  o += `<circle class="cp-dot" cx="${f(xM)}" cy="${f(yU)}" r="4.5" fill="#eef2fb"/>`;
  // the law for v as the bracket between the cell and v
  { const yb = yBot + 15, law = `v = ${v.pref === 1 ? '' : v.pref + ' '}E${lo('cell')}${afterLo('exp(−2π /', 4)}<tspan class="four" dx="3">4</tspan><tspan dx="2">α</tspan>${lo('U')}${afterLo(') = ' + s.v.toFixed(2) + ' GeV')}`;
    const span = `${(Math.log10(s.Ecell / s.v)).toFixed(2)} decades below the cell`;
    o += `<path class="cp-br cp-f-count" d="M ${f(xV)} ${f(yb - 7)} V ${f(yb)} H ${f(xE)} V ${f(yb - 7)}"/>`;
    if (narrow) {
      const mid = Math.max(132, Math.min(W - 132, (xV + xE) / 2));
      o += `<text class="cp-brt" x="${f(mid)}" y="${f(yb + 17)}" text-anchor="middle">${law}</text><text class="cp-brt" x="${f(mid)}" y="${f(yb + 34)}" text-anchor="middle"><tspan class="n">${span}</tspan></text>`;
    } else {
      const mid = Math.max(250, Math.min(W - 250, (xV + xE) / 2));
      o += `<text class="cp-brt" x="${f(mid)}" y="${f(yb + 18)}" text-anchor="middle">${law}<tspan class="n" dx="14">${span}</tspan></text><text class="cp-mv" x="${f(xV)}" y="${f(yb + 18)}" text-anchor="middle">v</text>`;
    } }
  // the closure's left side along the running: it meets P/4 at the anchor
  { let d = '';
    const n = 48, la = Math.log10(s.mu), lm = Math.log10(s.MU);
    for (let k = 0; k <= n; k++) { const lg = la + (lm - la) * k / n, r = readAt(s, 10 ** lg); d += `${k ? 'L' : 'M'} ${f(X(lg))} ${f(YS(r.lhs))} `; }
    const top = readAt(s, s.MU).lhs;
    o += `<line class="cp-p4" x1="${x0}" x2="${x1}" y1="${f(YS(s.target))}" y2="${f(YS(s.target))}"/><text class="cp-mv" x="${f(x1)}" y="${f(YS(s.target) - 6)}" text-anchor="end">P/4 = ${s.target.toFixed(4)}</text>`;
    o += `<path class="cp-strip cp-f-collar" d="${d}"/><line class="cp-win" x1="${f(xM)}" y1="${f(YS(top))}" x2="${f(xE)}" y2="${f(YS(top))}"/>`;
    o += `<circle class="cp-dot" cx="${f(xA)}" cy="${f(YS(s.target))}" r="4.5" fill="var(--amber)"/><text class="cp-mv" x="${f(xM + (narrow ? 5 : 8))}" y="${f(YS(top) + 16)}">${top.toFixed(3)}${narrow ? '' : ' at M' + lo('U')}</text>`;
    const lab = host.querySelector('.cp-striplab'); lab.style.left = (xA + 10).toFixed(1) + 'px'; lab.style.top = (sTop - 6) + 'px'; }
  // crosshair layer and the hit area
  o += `<g id="cp-cross" style="display:none"><line class="cp-cross" y1="${f(yTop)}" y2="${f(sBot)}"/>${SERIES.map((se) => `<circle class="cp-dot" r="4" fill="${se.c}"/>`).join('')}<circle class="cp-dot" r="4" fill="#eef2fb"/></g>`;
  o += `<rect class="cp-hit" x="${x0}" y="${yTop}" width="${x1 - x0}" height="${sBot - yTop}"/>`;
  svg.innerHTML = o;
}
function plotPointer() {
  const box = host.querySelector('.cp-plot'), tip = host.querySelector('.cp-tip');
  const hide = () => { tip.style.display = 'none'; const g = host.querySelector('#cp-cross'); if (g) g.style.display = 'none'; };
  box.addEventListener('pointerleave', hide);
  box.addEventListener('pointermove', (e) => {
    if (!G) return;
    const r = box.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top, g = host.querySelector('#cp-cross');
    if (!g || px < G.x0 || px > G.x1 || py < G.yTop || py > G.sBot) { hide(); return; }
    const s = G.s, lg = Math.max(Math.log10(s.mu), Math.min(Math.log10(s.Ecell), G.LX0 + (px - G.x0) / (G.x1 - G.x0) * (G.LX1 - G.LX0)));
    const rd = readAt(s, 10 ** lg), x = G.X(lg), kids = g.children;
    g.style.display = '';
    kids[0].setAttribute('x1', x); kids[0].setAttribute('x2', x);
    rd.inv.forEach((val, i) => { kids[1 + i].setAttribute('cx', x); kids[1 + i].setAttribute('cy', G.Y(val)); });
    kids[4].setAttribute('cx', x); kids[4].setAttribute('cy', G.YS(rd.lhs));
    tip.innerHTML = `<div class="cp-th">μ = ${gev(10 ** lg)}</div>${SERIES.map((se, i) => `<div style="--c:${se.c}"><i></i><span>${se.sym} ${se.name}</span><b>${rd.inv[i].toFixed(3)}</b></div>`).join('')}<div style="--c:#eef2fb"><i></i><span>closure, left side</span><b>${rd.lhs.toFixed(4)}</b></div>`;
    tip.style.display = 'block';
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    tip.style.left = Math.max(0, Math.min(G.W - tw, px + 16 + tw > G.W ? px - tw - 14 : px + 16)) + 'px';
    tip.style.top = Math.max(0, Math.min(py - th / 2, G.sBot - th)) + 'px';
  });
}

// ---------------------------------------------------------------- the ratio test
function drawRatio() {
  const box = host.querySelector('.cp-ratio-plot'), svg = host.querySelector('#cp-ratio-svg'), W = box.clientWidth, H = box.clientHeight;
  if (!W || !H) return;
  const meas = measuredCouplings(), rows = [['declared', 'declared slopes', 'var(--amber)'], ['source', 'source as built', 'var(--red)'], ['two', 'two doublets', '#c5d0e6']];
  const xl = 128, xr = W - 14, R0 = 0.5, R1 = 0.74, X = (r) => xl + (r - R0) / (R1 - R0) * (xr - xl), f = (n) => n.toFixed(1);
  const top = 30, rowH = (H - top - 24) / rows.length, yAxis = top + rowH * rows.length, sel = cur === 'stack' ? 'declared' : cur;
  let o = '';
  // the measured ratio: a band of one standard deviation through all rows
  o += `<rect x="${f(X(meas.ratio - meas.ratioErr))}" y="${top - 6}" width="${f(X(meas.ratio + meas.ratioErr) - X(meas.ratio - meas.ratioErr))}" height="${f(yAxis - top + 6)}" fill="rgba(238,242,251,.16)"/>`;
  o += `<line x1="${f(X(meas.ratio))}" x2="${f(X(meas.ratio))}" y1="${top - 6}" y2="${f(yAxis)}" stroke="rgba(238,242,251,.9)" stroke-width="1.2"/>`;
  o += `<text class="cp-rt" x="${f(W)}" y="12" text-anchor="end"><tspan class="cp-rs">measured</tspan><tspan dx="6">${meas.ratio.toFixed(3)} ± ${meas.ratioErr.toFixed(3)}</tspan></text>`;
  o += `<line class="cp-grid" x1="${xl}" x2="${f(W)}" y1="${f(yAxis)}" y2="${f(yAxis)}"/>`;
  for (const t of [0.5, 0.55, 0.6, 0.65, 0.7]) o += `<line class="cp-grid" x1="${f(X(t))}" x2="${f(X(t))}" y1="${f(yAxis)}" y2="${f(yAxis + 4)}"/><text class="cp-ax" x="${f(X(t))}" y="${f(yAxis + 18)}" text-anchor="middle">${t.toFixed(2)}</text>`;
  rows.forEach(([key, label, col], i) => {
    const fr = slopeRatio(VARIANTS[key].slopes), r = ratioOf(variant(key).inv), y = top + rowH * (i + 0.5), on = key === sel;
    o += `<text class="${on ? 'cp-rt' : 'cp-rs'}" x="0" y="${f(y - 3)}">${label}</text><text class="cp-rs" x="0" y="${f(y + 13)}"><tspan class="cp-rt">${fstr(fr)}</tspan><tspan dx="5">= ${r.toFixed(4)}</tspan></text>`;
    o += `<line class="cp-grid" x1="${xl}" x2="${f(W)}" y1="${f(y)}" y2="${f(y)}"/>`;
    if (key === 'source') o += `<path class="cp-ropen" d="M ${f(X(r) + 9)} ${f(y)} H ${f(X(meas.ratio) - 4)}"/><text class="cp-ropent" x="${f((X(r) + X(meas.ratio)) / 2)}" y="${f(y - 7)}" text-anchor="middle">open</text>`;
    o += `<circle class="cp-rm" cx="${f(X(r))}" cy="${f(y)}" r="${on ? 6.5 : 4.5}" fill="${col}"/>`;
  });
  svg.innerHTML = o;
}

// ---------------------------------------------------------------- page
function redraw() { drawPlot(); drawRatio(); }
function settle() {       // a size change that happened between two frames is not reported by the resize observer
  const box = host && host.querySelector('.cp-plot');
  if (box && G && (box.clientWidth !== G.W || box.clientHeight !== G.H)) redraw();
}
function select(key) { cur = key; renderSide(); redraw(); requestAnimationFrame(settle); }
export function mount(h) {
  host = h;
  if (!document.querySelector('link[href$="style/couplings.css"]')) { const l = document.createElement('link'); l.id = 'cp-css'; l.rel = 'stylesheet'; l.href = 'style/couplings.css'; l.onload = () => redraw(); document.head.appendChild(l); }
  h.innerHTML = skeleton();
  const wrap = h.querySelector('.cp-wrap'), seen = new Set();
  h.querySelectorAll('.cp-foot .src-links a').forEach((a) => { if (seen.has(a.href)) a.remove(); else seen.add(a.href); });     // two source lists share a paper
  h.querySelectorAll('.cp-seg button').forEach((b) => { b.onclick = () => select(b.dataset.v); });
  h.querySelectorAll('.cp-st').forEach((c) => {
    c.addEventListener('pointerenter', () => { wrap.dataset.focus = c.dataset.f; });
    c.addEventListener('pointerleave', () => { delete wrap.dataset.focus; });
  });
  h.querySelectorAll('.cp-tile').forEach((t) => { t.onclick = (e) => { if (!e.target.closest('.hq') && window.__openClass) window.__openClass(Number(t.dataset.k)); }; });
  const ro = new ResizeObserver(redraw);
  ro.observe(h.querySelector('.cp-plot')); ro.observe(h.querySelector('.cp-ratio-plot'));
  plotPointer();
  select(cur);
  window.__couplings = { select, state: () => ({ variant: cur, chain: variant(cur) }) };
}
export function shown() { if (host) { redraw(); typeset(host).then(redraw); } }
