// The page "Against ΛCDM" (Early universe group): what the model gives for the early universe and the cosmos,
// beside the measured sky and the standard model of cosmology.
//
// Sky values are the frozen rows of the public comparison ledger (references/cosmology_postdiction_ledger.json,
// projected in cosmos_evidence.js); each row below names its row_id. Thermal values are those of the lattice lanes
// (matches_data.js LATTICE, results_data.js MEAS.T_ew). Times on the axis are the standard radiation-era times of
// the events (Timeline page; research/QCD/colour_transition.json scale.t_seconds), with 380,000 years for the
// microwave background and 13.8 billion years for today.
//   mount(host), shown(host)   registered by app.js under the name 'cosmology'
import { COSMOLOGY_LEDGER, TILT_COMPARISONS } from './cosmos_evidence.js';
import { LATTICE } from './matches_data.js';
import { MEAS } from './results_data.js';
import { tiles, table, matchStyle, devText } from './match.js';

const go = (page) => import('./app.js').then((m) => m.showPage && m.showPage(page)).catch(() => {});
const sci = (m, e) => `${m} × 10<sup>${e}</sup>`;
const tilt = TILT_COMPARISONS.find((r) => r.row_id === 'ns_edge_center_P_C_planck2018_vi_ns') || TILT_COMPARISONS[0];
const actLB = TILT_COMPARISONS.find((r) => /act_dr6_p_act_lb/.test(r.row_id));
const paren = (v, s, dec) => v.toFixed(dec) + '(' + Math.round(s * 10 ** dec) + ')';

// the six primordial measurements: Planck 2018 and BICEP/Keck
const SKY = [
  { name: 'Tilt of the ripples n<sub>s</sub>', value: COSMOLOGY_LEDGER.P_C_tilt.toFixed(4), nature: tilt.measurement.value.toFixed(4) + ' ± ' + tilt.measurement.sigma, natureWord: 'Planck',
    dev: Math.abs(tilt.sigma_distance).toFixed(2) + ' σ', rel: 1e-4,
    tip: 'How the strength of the first density ripples changes with their size. Against ACT DR6 with lensing and DESI the distance is ' + (actLB ? Math.abs(actLB.sigma_distance).toFixed(1) : '2.4') + ' σ.' },
  // running_zero_planck2018_running: 0 against -0.0045 +- 0.0067
  { name: 'Running of the tilt', value: '0', nature: '−0.0045 ± 0.0067', natureWord: 'Planck', dev: '0.67 σ', rel: 1e-4 },
  // tensor_zero_bk18_r_0p05: 0 against < 0.036 at 95 percent
  { name: 'Primordial gravitational waves r', value: '0', nature: '< 0.036', natureWord: 'BICEP/Keck', dev: 'within bound', rel: 1e-4 },
  // isocurvature_zero_planck2018_x_cdi_general_100beta_klow: 0 against < 2.5 at 95 percent
  { name: 'Isocurvature share 100 β', value: '0', nature: '< 2.5', natureWord: 'Planck', dev: 'within bound', rel: 1e-4 },
  // fnl_zero_planck2018_ix_fnl_local: 0 at the source against -0.9 +- 5.1
  { name: 'Non-Gaussianity f<sub>NL</sub>', value: '0', nature: '−0.9 ± 5.1', natureWord: 'Planck', dev: '0.18 σ', rel: 1e-4 },
  // curvature_zero_planck2018_vi_omegak_bao: 0 against 0.0007 +- 0.0019
  { name: 'Curvature of space Ω<sub>K</sub>', value: '0', nature: '0.0007 ± 0.0019', natureWord: 'Planck+BAO', dev: '0.37 σ', rel: 1e-4 },
];
const L = LATTICE;
const EXPANSION = [
  // lambda_capacity_candidate_a_planck2018_central: 1.0959e-52 against 1.0891e-52 per square metre
  { sym: 'Λ', name: 'Cosmological constant', note: 'the capacity that sets it is chosen with the measured value in view', ow: 28, value: sci('1.096', '−52'), unit: 'm<sup>−2</sup>', nature: sci('1.089', '−52'), natureNote: 'Planck 2018', rel: 1.0959 / 1.0891 - 1, lead: true },
  // w0wa_fixed_capacity_*: (w0, wa) = (-1, 0) exact; DESI DR2 chains 2.6 to 3.9 sigma
  { sym: 'w', name: 'Dark energy, equation of state', ow: 28, value: '−1, 0', nature: '−1, 0', natureNote: 'ΛCDM · DESI DR2 prefers an evolving w at 2.6 to 3.9 σ', same: true, sameText: 'same as ΛCDM', noNatureUnit: true },
  // btfr_exponent_four_sparc_ols: 4 against 3.753 +- 0.093
  { sym: 'x', name: 'Rotation of galaxies', note: 'baryonic Tully–Fisher exponent', value: '4', nature: '3.753 ± 0.093', natureNote: 'SPARC, 123 galaxies', dev: '2.7 σ', rel: 4 / 3.753 - 1 },
];
const THERMAL = [
  { sym: 'T<sub>EW</sub>', name: 'Electroweak crossover', page: 'transitions', value: L.ew.value.toFixed(1), unit: 'GeV', nature: L.ew.refText, natureNote: 'Standard Model on the lattice', rel: L.ew.value / L.ew.ref - 1 },
  { sym: 'T<sub>c</sub>/√σ', name: 'Colour sets quarks free', page: 'transitions', value: paren(L.tc.value, L.tc.err, 3), nature: paren(L.tc.ref, L.tc.refErr, 4), natureNote: 'lattice QCD, same spacing', rel: L.tc.value / L.tc.ref - 1 },
  { sym: 'm<sub>N</sub>/m<sub>ρ</sub>', name: 'Quarks bind into hadrons', note: 'nucleon over rho mass', page: 'transitions', value: paren(L.nRho.value, L.nRho.err, 2), nature: L.nRho.ref.toFixed(3), natureNote: 'measured', rel: L.nRho.value / L.nRho.ref - 1 },
  { sym: 'BBN', name: 'Light nuclei form', value: '', nature: 'H, He, Li', natureNote: 'nucleosynthesis at 3 minutes', open: 'no model value', noNatureUnit: true },
];

// ---------------------------------------------------------------- the timeline: two lanes on one axis of cosmic time
const T0 = -44, T1 = 18, X0 = 60, X1 = 1150;
const X = (t) => X0 + ((Math.log10(t) - T0) / (T1 - T0)) * (X1 - X0);
const YR = 3.156e7;
// time, label, value of the model (top lane), value of ΛCDM or the measurement (bottom lane), side of the label
const EVENTS = [
  { t: 6.89e-44, name: 'first tick', oph: 'E<tspan dy="3" font-size="9">cell</tspan><tspan dy="-3"> = 9.56 × 10¹⁸ GeV</tspan>', lcdm: 'no model', faintL: true },
  { t: 9.0e-12, name: 'electroweak crossover', oph: L.ew.value.toFixed(1) + ' GeV', lcdm: '159.5 GeV' },
  { t: 1.24e-5, name: 'quarks bind', oph: 'T<tspan dy="3" font-size="9">c</tspan><tspan dy="-3">/√σ ' + L.tc.value.toFixed(3) + '</tspan>', lcdm: L.tc.ref.toFixed(3) },
  { t: 180, name: 'light nuclei', oph: '', lcdm: 'H · He · Li', faintO: true },
  { t: 380000 * YR, name: 'microwave background', oph: 'n<tspan dy="3" font-size="9">s</tspan><tspan dy="-3"> ' + COSMOLOGY_LEDGER.P_C_tilt.toFixed(4) + '</tspan>', lcdm: tilt.measurement.value.toFixed(4) },
  { t: 13.8e9 * YR, name: 'today', oph: 'Λ 1.096 · w −1', lcdm: '1.089 · w −1' },
];
const TICKS = [[1e-40, '10⁻⁴⁰ s'], [1e-30, '10⁻³⁰ s'], [1e-20, '10⁻²⁰ s'], [1e-10, '10⁻¹⁰ s'], [1, '1 s'], [YR, '1 year'], [1e6 * YR, ''], [1e10 * YR, '']];
function timeline() {
  const yO = 92, yL = 178;
  const ev = EVENTS.map((e, i) => {
    const x = X(e.t), both = !e.faintO && !e.faintL, up = i % 2 === 0;
    return `<g class="cs-ev${both ? ' cs-both' : ''}" transform="translate(${x.toFixed(1)},0)">
      ${both ? `<line class="cs-tie" x1="0" x2="0" y1="${yO}" y2="${yL}"/>` : ''}
      <text class="cs-name" x="0" y="${up ? 40 : 54}" text-anchor="middle">${e.name}</text>
      ${e.faintO ? `<circle class="cs-dot cs-faint" cx="0" cy="${yO}" r="4"/>` : `<circle class="cs-glow cs-o" cx="0" cy="${yO}" r="11"/><circle class="cs-dot cs-o" cx="0" cy="${yO}" r="5.5"/>`}
      ${e.faintL ? `<circle class="cs-dot cs-faint" cx="0" cy="${yL}" r="4"/>` : `<circle class="cs-glow cs-l" cx="0" cy="${yL}" r="11"/><circle class="cs-dot cs-l" cx="0" cy="${yL}" r="5.5"/>`}
      ${e.oph ? `<text class="cs-v cs-vo" x="0" y="${yO - 16}" text-anchor="middle">${e.oph}</text>` : ''}
      <text class="cs-v cs-vl${e.faintL ? ' cs-dim' : ''}" x="0" y="${yL + 26}" text-anchor="middle">${e.lcdm}</text></g>`;
  }).join('');
  const ticks = TICKS.map(([t, s]) => `<g transform="translate(${X(t).toFixed(1)},0)"><line class="cs-tk" y1="222" y2="230"/>${s ? `<text class="cs-tl" y="246" text-anchor="middle">${s}</text>` : ''}</g>`).join('');
  return `<div class="cs-tlwrap"><svg class="cs-tlsvg" viewBox="0 0 1200 262" role="img" aria-label="The model and standard cosmology on one axis of cosmic time">
    <defs><linearGradient id="cs-sweep-g" x1="0" x2="1"><stop offset="0" stop-color="#3fe0d0" stop-opacity="0"/><stop offset=".9" stop-color="#3fe0d0" stop-opacity=".06"/><stop offset="1" stop-color="#3fe0d0" stop-opacity="0"/></linearGradient></defs>
    <text class="cs-lane cs-lo" x="${X0 - 14}" y="${yO + 4}" text-anchor="end">OPH</text>
    <text class="cs-lane cs-ll" x="${X0 - 14}" y="${yL + 4}" text-anchor="end">ΛCDM</text>
    <line class="cs-rail cs-ro" x1="${X0}" x2="${X1}" y1="${yO}" y2="${yO}"/>
    <line class="cs-rail cs-rl" x1="${X0}" x2="${X1}" y1="${yL}" y2="${yL}"/>
    <g class="cs-sweep"><rect x="-160" y="${yO - 8}" width="160" height="${yL - yO + 16}" fill="url(#cs-sweep-g)"/><line x1="-14" x2="-14" y1="${yO}" y2="${yL}" stroke="#bdfbf3" stroke-opacity=".35" stroke-width="1.2"/></g>
    <line class="cs-axis" x1="${X0}" x2="${X1}" y1="226" y2="226"/>${ticks}
    <text class="cs-tl cs-today" x="${X1}" y="246" text-anchor="end">13.8 billion years</text>
    ${ev}</svg></div>`;
}

const CSS_URL = new URL('./style/cosmology.css', import.meta.url).href;
export function mount(host) {
  matchStyle();
  if (!document.getElementById('cs-css')) { const l = document.createElement('link'); l.id = 'cs-css'; l.rel = 'stylesheet'; l.href = CSS_URL; document.head.appendChild(l); }
  const within = SKY.length;
  host.innerHTML = `<div class="cs-wrap">
    <div class="cs-head"><div><h2>Against ΛCDM</h2><div class="cs-lead">The early universe and the cosmos of the model, beside the measured sky and the standard model of cosmology.</div></div>
      <div class="cs-band"><b>${within} of ${within}</b><span>measurements of the first ripples within 1 σ or inside the bound</span></div></div>
    <section class="cs-card cs-hero">${timeline()}</section>
    <section class="cs-card"><div class="cs-k">The first ripples <i>Planck 2018 · BICEP/Keck 2018</i></div>${tiles(SKY)}</section>
    <div class="cs-two">
      <section class="cs-card"><div class="cs-k">Expansion and dark energy</div>${table(EXPANSION, { first: '', natureWord: 'measured' })}</section>
      <section class="cs-card"><div class="cs-k">Thermal history</div>${table(THERMAL, { first: '', natureWord: 'reference' })}</section>
    </div>
    <div class="cs-foot"><span>No model value: the sum of neutrino masses (&lt; 0.064 eV, DESI DR2), the number of light species N<sub>eff</sub> (2.99 ± 0.17, Planck), the galaxy acceleration scale a<sub>0</sub>.</span>
      <span class="cs-links"><a href="${COSMOLOGY_LEDGER.url}" target="_blank" rel="noopener">The comparison ledger ↗</a><button type="button" data-page="timeline">Timeline ›</button><button type="button" data-page="transitions">Phase transitions ›</button></span></div>
  </div>`;
  for (const r of host.querySelectorAll('.mr-table .mr')) { const sym = r.querySelector('.mr-q b'); if (sym && /^(Λ|w)$/.test(sym.textContent)) { const n = r.querySelector('.mr-q>span'); if (n && !n.querySelector('.ow-tag')) n.insertAdjacentHTML('beforeend', '<span class="ow-tag">OW 28</span>'); } }
  host.addEventListener('click', (e) => {
    const t = e.target.closest ? e.target : null; if (!t || t.closest('a') || t.closest('.hq')) return;
    const ow = t.closest('.ow-tag'); if (ow) { window.__owRow = '28'; return go('openwave'); }
    const p = t.closest('[data-page]'); if (p) go(p.dataset.page);
  });
}
export function shown() { /* the sweep is a CSS animation: it runs only while the page is displayed */ }
export { devText };
