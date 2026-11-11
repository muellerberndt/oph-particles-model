// The Classes page: the six classes on a wheel beside one card per class, and the side panel of a class, openable
// from anywhere with openClass(k). Also the status chips and the mark of a mass whose derivation is incomplete, which
// the Continuum field, Forces and Spectrum pages import from here.
// Sources: repair-law/MATCH.md and work/MATCH/match.json (class table, 32 patterns; exact checks in match.py), the
// theory repository model/defect_particle_classes (61 checks) and model/lepton_register_round (99 checks),
// repair-law/SPECTRUM.md and LEPTON_STEPS.md (masses), and the selected run's view/class_stats.json.
// Measured values: CODATA 2022 and the Review of Particle Physics 2024. Comparisons are not blind.
import { $, S, fmt } from './app.js';
import { linkList } from './links.js';
import { busy } from './progress.js';
import { definitePosition, evolve, positions, readMass, weights, SYMS, NAMES } from './lepton_readout.js';

// ---------------------------------------------------------------- status chips (the same pill on every page)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const chip = (kind, label) => `<span class="q2-chip q2-${kind}">${label || kind}</span>`;
// a small "?" that shows one text on hover, focus or tap; used where the page help cannot reach (side panels, rows built late)
export const hint = (html) => `<span class="hq q2-hq" tabindex="0" role="button" aria-label="explanation" data-q2tip="${esc(html)}">?</span>`;
// What is missing behind a mass that is not yet derived, one sentence each (SPECTRUM.md, LEPTON_STEPS.md, the theory addendum).
export const MISSING = {
  lepton: 'The common scale of the three rest rates is open: a mass in MeV with no measured input needs one number, the lepton scale, and the source gives no value for it yet.',
  chain: 'W and Z come from declared forms of the coupling chain that fit: the hypercharge slope, the power of P in the unification scale and the weight of the collar law are declared, and their derivation is open.',
  higgs: 'The register gives one relation between the Higgs mass and the top mass, so one of the two is a measured input, and the mass term of the Higgs register is of cell size in every regulator.',
  quark: 'Quark masses are open: every law that reads only the class gives up equal to down, and the magnitude law of the junction that would split them has no derivation.',
  neutrino: 'The declared source conserves B − L and excludes a number-violating Majorana term in that sector. A physical neutrino identity, mass and mixing are not derived.',
  hadron: 'A hadron mass in GeV goes through the declared coupling chain and through a coefficient that the lattice run of the model has to supply.',
  rest: 'The rest angle is a benchmark on a frozen flux background and the tick is set by the measured electron mass, so the value in MeV is a calibration: the common scale is open.',
};
export const INCOMPLETE = 'derivation incomplete';
export const incomplete = (key) => `<span class="q2-incw"><span class="q2-chip q2-inc">${INCOMPLETE}</span>${hint(MISSING[key] || key)}</span>`;

let tipEl = null;
function tipShow(el) {
  if (!tipEl) { tipEl = document.createElement('div'); tipEl.id = 'q2-tip'; document.body.appendChild(tipEl); }
  tipEl.innerHTML = el.dataset.q2tip; tipEl.style.display = 'block';
  const r = el.getBoundingClientRect(), t = tipEl.getBoundingClientRect();
  let x = r.left + r.width / 2 - t.width / 2, y = r.bottom + 8;
  x = Math.max(8, Math.min(innerWidth - t.width - 8, x)); if (y + t.height > innerHeight - 8) y = Math.max(8, r.top - t.height - 8);
  tipEl.style.left = x + 'px'; tipEl.style.top = y + 'px';
}
const tipHide = () => { if (tipEl) { tipEl.style.display = 'none'; tipEl.classList.remove('pin'); } };
const hq = (e) => (e.target && e.target.closest ? e.target.closest('.q2-hq') : null);
document.addEventListener('mouseover', (e) => { const el = hq(e); if (el && !(tipEl && tipEl.classList.contains('pin'))) tipShow(el); });
document.addEventListener('mouseout', (e) => { if (hq(e) && tipEl && !tipEl.classList.contains('pin')) tipHide(); });
document.addEventListener('focusin', (e) => { const el = hq(e); if (el) tipShow(el); });
document.addEventListener('focusout', (e) => { if (hq(e) && tipEl && !tipEl.classList.contains('pin')) tipHide(); });
document.addEventListener('click', (e) => {
  const el = hq(e);
  if (el) { e.stopPropagation(); e.preventDefault(); tipShow(el); tipEl.classList.add('pin'); } else if (tipEl && !tipEl.contains(e.target)) tipHide();
}, true);

// ---------------------------------------------------------------- the six classes
const IDENT = 'Every protected defect class equals the Standard Model centre class 6Y mod 6 on all 32 matter patterns of the five-level code: classes 1 and 5 left-handed quarks, 4 and 2 right-handed quarks, 3 the lepton doublet and the Higgs, 0 the right-handed leptons and the gauge fields. The class does not carry the generation, the member inside a class, or the mass.';
const STATS = 'Quanta are fermions; defects, links and the Higgs register are bosons. Premises: a spin doublet per quantum, the Gauss law, antisymmetric occupation.';
const NOTBLIND = 'not blind';
const QUARK_MASS = [['Quark masses', 'open', chip('open'), 'Every law that reads only the class gives up equal to down. The magnitude law of the junction 1 + 3 → 4 that would split them is not derived.']];

export const CLASSES = {
  1: { title: 'Left-handed quark class', short: 'qL', color: '#ff7a45', shape: 'disc', conj: 5, colour: 'triplet', weak: 'doublet',
    card: 'u<sub>L</sub>, d<sub>L</sub> · c<sub>L</sub>, s<sub>L</sub> · t<sub>L</sub>, b<sub>L</sub>',
    members: 'u<sub>L</sub> and d<sub>L</sub> in three colours: 6 states per generation, the quark doublet with hypercharge +1/6',
    gens: [['u, d', 'generation 1'], ['c, s', 'generation 2'], ['t, b', 'generation 3']],
    sees: 'Every charged quantum: all classes 1 to 5 read its flux with the phase exp(2πi kY)',
    vertex: '1 + 3 → 4: a left-handed quark meets the Higgs class and turns into a right-handed quark. This is the mass vertex of every quark.',
    massRows: QUARK_MASS },
  5: { title: 'Conjugate of the left-handed quark class', short: 'q̄L', color: '#ff7a45', shape: 'ring', conj: 1, colour: 'antitriplet', weak: 'doublet',
    card: 'antiparticles of u<sub>L</sub>, d<sub>L</sub> · c<sub>L</sub>, s<sub>L</sub> · t<sub>L</sub>, b<sub>L</sub>',
    members: 'The antiparticles of u<sub>L</sub> and d<sub>L</sub>: 6 states per generation, hypercharge −1/6',
    gens: [['ū, d̄', 'generation 1'], ['c̄, s̄', 'generation 2'], ['t̄, b̄', 'generation 3']],
    sees: 'Every charged quantum, as class 1',
    vertex: '1 + 5 → 0: a quark and its antiquark annihilate. 3 + 5 → 2: the conjugate of the quark mass vertex.',
    massRows: [['Quark masses', 'open', chip('open'), 'Antiparticles have the masses of their particles. See class 1.']] },
  4: { title: 'Right-handed quark class', short: 'qR', color: '#ffb347', shape: 'disc', conj: 2, colour: 'triplet', weak: 'singlet',
    card: 'u<sub>R</sub>, d<sub>R</sub> · c<sub>R</sub>, s<sub>R</sub> · t<sub>R</sub>, b<sub>R</sub>',
    members: 'u<sub>R</sub> with hypercharge +2/3 and d<sub>R</sub> with −1/3 in three colours: 6 states per generation. Both have 6Y = 4 mod 6, so the class does not tell up from down',
    gens: [['u, d', 'generation 1'], ['c, s', 'generation 2'], ['t, b', 'generation 3']],
    sees: 'Quarks only: colour flux is read by classes 1, 2, 4 and 5 and never by leptons',
    vertex: 'The end point of the quark mass vertex 1 + 3 → 4. A carrier that holds the fluxes {4,4,4} has the centre classes of three quarks. It is a boson and it is not a baryon.',
    massRows: QUARK_MASS },
  2: { title: 'Conjugate of the right-handed quark class', short: 'q̄R', color: '#ffb347', shape: 'ring', conj: 4, colour: 'antitriplet', weak: 'singlet',
    card: 'antiparticles of u<sub>R</sub>, d<sub>R</sub> · c<sub>R</sub>, s<sub>R</sub> · t<sub>R</sub>, b<sub>R</sub>',
    members: 'The antiparticles of u<sub>R</sub> and d<sub>R</sub>: 6 states per generation',
    gens: [['ū, d̄', 'generation 1'], ['c̄, s̄', 'generation 2'], ['t̄, b̄', 'generation 3']],
    sees: 'Quarks only, as class 4',
    vertex: '1 + 2 → 3: a left-handed quark and a right-handed antiquark give the Higgs class, the quark Yukawa vertex. A carrier that holds the fluxes {2,2,2} is a boson and it is not a baryon.',
    massRows: [['Quark masses', 'open', chip('open'), 'Antiparticles have the masses of their particles. See class 4.']] },
  3: { title: 'Lepton doublet and Higgs class', short: 'ℓL', color: '#3ee6a8', rim: '#4cc3ff', shape: 'duo', conj: 3, colour: 'singlet', weak: 'doublet',
    card: 'e<sub>L</sub>, ν<sub>e</sub> · μ<sub>L</sub>, ν<sub>μ</sub> · τ<sub>L</sub>, ν<sub>τ</sub> · Higgs doublet',
    members: 'e<sub>L</sub> and ν<sub>L</sub>, the lepton doublet with hypercharge −1/2, and their antiparticles: 4 states per generation. The Higgs doublet, a boson with hypercharge +1/2, has the same class. Class 3 is its own conjugate',
    gens: [['e, ν<sub>e</sub>', 'generation 1'], ['μ, ν<sub>μ</sub>', 'generation 2'], ['τ, ν<sub>τ</sub>', 'generation 3']],
    sees: 'Left-handed doublets only: weak flux is read by classes 1, 3 and 5',
    vertex: '3 + 3 → 0: the lepton mass vertex, a lepton doublet with the Higgs gives a right-handed lepton.',
    massRows: [
      ['m<sub>μ</sub> / m<sub>e</sub>', '206.770316', chip('conditional'), `Measured 206.7682827(46), CODATA 2022: +9.83 ppm, ${NOTBLIND}.`],
      ['m<sub>τ</sub> / m<sub>e</sub>', '3477.4728', chip('conditional'), `Measured 3477.365(176) with the tau mass of the Particle Data Group 2024: +0.61 σ, ${NOTBLIND}.`],
      ['Masses in MeV', 'open', chip('open'), 'The two numbers above are ratios of rest rates and use no measured mass. They are not yet the measured rest masses: one common scale is open.'],
      ['Higgs mass', '125.04 to 126.02 GeV', incomplete('higgs'), `One relation, read at the top mass 172.1 GeV. Measured 125.20(11) GeV, Particle Data Group 2024, ${NOTBLIND}.`],
      ['Neutrino masses', 'open', chip('open'), 'B − L is conserved in the declared sector. A physical neutrino identity, mass and mixing are not derived.']] },
  0: { title: 'Class 0', short: '0', color: '#9fb0cf', shape: 'flat', conj: 0, colour: 'singlet', weak: 'singlet',
    card: 'e<sub>R</sub>, μ<sub>R</sub>, τ<sub>R</sub>, ν<sub>R</sub> · gluons, W, B',
    members: 'e<sub>R</sub> and ν<sub>R</sub> and their antiparticles, 4 states per generation, and the gauge fields: 8 gluons, 3 W and B, which mix into the photon and the Z. A face of class 0 carries no flux, so these leave no defect on the screen',
    gens: [['e<sub>R</sub>, ν<sub>R</sub>', 'generation 1'], ['μ<sub>R</sub>, ν<sub>μR</sub>', 'generation 2'], ['τ<sub>R</sub>, ν<sub>τR</sub>', 'generation 3']],
    sees: 'Nothing: class 0 is invisible to every flux',
    vertex: 'The end point of the lepton mass vertex 3 + 3 → 0 and of every annihilation 1 + 5 → 0 and 2 + 4 → 0.',
    massRows: [
      ['Photon and gluons', 'massless', chip('conditional'), 'The unbroken gauge fields have no mass term in the declared action. The global gauge group is (SU(3) × SU(2) × U(1))/Z6 from port phases.'],
      ['W mass, tree level', '80.330 GeV', incomplete('chain'), `Declared forms that fit; derivation open. Measured 80.3692(133) GeV, Particle Data Group 2024, ${NOTBLIND}.`],
      ['Z mass, tree level', '91.588 GeV', incomplete('chain'), `Declared forms that fit; derivation open. Measured 91.1880(20) GeV, Particle Data Group 2024, ${NOTBLIND}.`]] },
};

// ---------------------------------------------------------------- data
let MATCH = null, STATSJ = null;
async function load() {
  if (!MATCH) { try { MATCH = await (await fetch('rl/MATCH/match.json')).json(); } catch (e) { MATCH = null; } }
  if (S.base && (!STATSJ || STATSJ.base !== S.base)) {
    try { STATSJ = { base: S.base, d: await (await fetch(S.base + 'view/class_stats.json', { cache: 'no-store' })).json() }; } catch (e) { STATSJ = null; }
  }
}
function glyph(k, size = 26) {
  const c = CLASSES[k], h = size / 2;
  const body = c.shape === 'ring' ? `<circle cx="${h}" cy="${h}" r="${h * 0.62}" fill="none" stroke="${c.color}" stroke-width="${size * 0.15}"/>`
    : c.shape === 'duo' ? `<circle cx="${h}" cy="${h}" r="${h * 0.42}" fill="${c.color}"/><circle cx="${h}" cy="${h}" r="${h * 0.76}" fill="none" stroke="${c.rim}" stroke-width="${size * 0.1}"/>`
      : c.shape === 'flat' ? `<circle cx="${h}" cy="${h}" r="${h * 0.62}" fill="none" stroke="${c.color}" stroke-width="${size * 0.07}" stroke-dasharray="3 3"/>`
        : `<circle cx="${h}" cy="${h}" r="${h * 0.62}" fill="${c.color}"/>`;
  return `<svg width="${size}" height="${size}" style="flex:none;filter:drop-shadow(0 0 ${c.shape === 'flat' ? 0 : 6}px ${c.color})">${body}</svg>`;
}
export const classGlyph = glyph;

function runRows(k) {
  const d = STATSJ && STATSJ.d && STATSJ.d.tiers && STATSJ.d.tiers.screen;
  if (!d || !d.classes || !d.classes[k]) return '<p class="q2-small">The run has no defects of this class: class 0 carries no flux.</p>';
  const c = d.classes[k], born = c.born || {}, end = c.ended || {}, ch = d.channels || {};
  const mine = Object.entries(ch).filter(([r]) => r.split(/[ +\->]+/).filter(Boolean).includes(String(k))).sort((a, b) => b[1] - a[1]).slice(0, 8);
  return `<div class="q2-scroll"><table class="q2-t">
    <tr><td>defect identities on the screen over the run</td><td class="num">${fmt(c.ever)}</td></tr>
    <tr><td>born as a pair from a blank face</td><td class="num">${fmt(born.conjugate_pair || 0)}</td></tr>
    <tr><td>born from a split or a fusion</td><td class="num">${fmt((born.split_product || 0) + (born.fusion_or_exchange_product || 0))}</td></tr>
    <tr><td>ended by annihilation</td><td class="num">${fmt(end.annihilation || 0)}</td></tr>
    <tr><td>ended by fusion, split or exchange</td><td class="num">${fmt((end.fusion || 0) + (end.split || 0) + (end.exchange || 0))}</td></tr>
    <tr><td>alive at the end of the run</td><td class="num">${fmt(c.alive_at_end)}</td></tr>
    <tr><td>share of identities that ever moved</td><td class="num">${c.moved_fraction !== undefined ? (100 * c.moved_fraction).toFixed(1) + ' %' : '–'}</td></tr>
    ${mine.map(([r, n]) => `<tr><td class="mono">${r}</td><td class="num">${fmt(n)}</td></tr>`).join('')}</table></div>
    <p class="q2-small">Register events of the run ${S.name}. Every reaction conserves the class modulo 6.</p>`;
}
function patternRows(k) {
  if (!MATCH) return '<p class="q2-small">The pattern table is not on file.</p>';
  const rows = MATCH.patterns.filter((p) => p.k === Number(k));
  return `<div class="q2-scroll"><table class="q2-t"><tr><th>pattern</th><th>field</th><th class="num">Q</th><th class="num">T<sub>3</sub></th><th class="num">Y</th><th>colour</th><th>weak</th></tr>
    ${rows.map((p) => `<tr><td class="mono">${p.bits}</td><td>${p.name}</td><td class="num">${p.Q}</td><td class="num">${p.T3}</td><td class="num">${p.Y}</td><td>${p.colour}</td><td>${p.weak}</td></tr>`).join('')}</table></div>
    <p class="q2-small">Patterns of the five-level code, three colour levels and two weak levels, whose class is ${k}; one generation. Exact: k = 3 (n<sub>2</sub> mod 2) − 2 (n<sub>3</sub> mod 3) on all 32 patterns.</p>`;
}
const massBlock = (k) => `<div class="q2-mass">${CLASSES[k].massRows.map(([label, value, mark, note]) =>
  `<div class="q2-mrow"><span class="q2-ml">${label}</span><b class="q2-mv">${value}</b><span class="q2-mm">${mark}</span><span class="q2-mn">${note}</span></div>`).join('')}</div>`;

// which class-3 defect is which charged lepton: the generation register (theory repository model/lepton_register_round)
function leptonGenerations() {
  const th = 2 / 9;
  const lam = [0, 1, 2].map((k) => 1 / Math.sqrt(6) + Math.cos(th + 2 * Math.PI * k / 3) / Math.sqrt(3));
  const rows = [[0, 'τ', 'tau', 'character 1'], [2, 'μ', 'muon', 'character ω²'], [1, 'e', 'electron', 'character ω']];
  const tot = lam.reduce((a, x) => a + x * x, 0);
  return `<div class="cl-sec"><div class="k">Which defect is which lepton ${chip('conditional')}</div>
    <p>Electron, muon and tau are the characters ω, ω² and 1 of the third-turn of the face. A defect at a definite position is an equal mix of the three. A read of the rest rate makes it one of them.</p>
    <div class="q2-scroll"><table class="q2-t"><tr><th>lepton</th><th>character</th><th class="num">eigenvalue</th><th class="num">share of the summed rate</th></tr>
    ${rows.map(([kk, sym, name, what]) => `<tr><td><b>${sym}</b> ${name}</td><td>${what}</td><td class="num">${lam[kk].toFixed(7)}</td><td class="num">${(100 * lam[kk] ** 2 / tot).toPrecision(4)} %</td></tr>`).join('')}</table></div>
    <div class="lr-box"><canvas id="lr-face" width="560" height="300"></canvas>
      <div class="lr-ctl"><button id="lr-reset">new defect</button><button id="lr-run">▶ run</button>
        <label for="lr-T">clock levels</label><input type="range" id="lr-T" min="5" max="12" step="1" value="9"><b id="lr-Tv">512</b><button id="lr-read">read the rest rate</button></div>
      <div id="lr-out" class="lr-out"></div></div></div>`;
}

// ---------------------------------------------------------------- the lepton readout widget
const LR = { c: null, t: 0, running: false, last: 0, hist: [], raf: 0 };
function leptonWidget() {
  LR.c = definitePosition(0); LR.t = 0; LR.hist = []; LR.running = false;
  const T = () => 2 ** Number($('lr-T').value);
  $('lr-T').oninput = () => { $('lr-Tv').textContent = T(); };
  $('lr-reset').onclick = () => { LR.c = definitePosition(Math.floor(Math.random() * 3)); LR.t = 0; LR.hist = []; out(); };
  $('lr-run').onclick = () => { LR.running = !LR.running; $('lr-run').textContent = LR.running ? '❚❚ pause' : '▶ run'; };
  $('lr-read').onclick = () => {
    const r = readMass(LR.c, T()); LR.c = r.state; const w = weights(r.state), k = w.indexOf(Math.max(...w));
    LR.hist.unshift({ T: T(), m: r.m, f: r.freq, k, p: w[k] }); LR.hist = LR.hist.slice(0, 4); out();
  };
  cancelAnimationFrame(LR.raf); LR.last = performance.now();
  const loop = (now) => {
    if (!document.getElementById('lr-face')) return;
    if (LR.running) { LR.t += (now - LR.last) / 1000 * 12; }
    LR.last = now; draw(); LR.raf = requestAnimationFrame(loop);
  };
  out(); LR.raf = requestAnimationFrame(loop);
}
function current() { return evolve(LR.c, LR.t); }
function out() {
  const ratio = [3477.4728, 1, 206.770316];
  const h = LR.hist.map((r, i) => {
    const sure = r.p > 0.98, mev = 0.51099895069 * ratio[r.k];
    return `<div class="lr-row"><span>${i === 0 ? 'last read' : 'earlier'}, ${r.T} levels</span><b>${sure ? NAMES[r.k] : 'mostly ' + NAMES[r.k] + ', ' + (100 * r.p).toFixed(1) + ' %'}</b><span class="num">${r.f.toFixed(6)} per tick</span>
      ${sure && r.k !== 1 ? `<span class="lr-mev"><span class="num">${mev.toFixed(3)} MeV with the electron as anchor</span> ${incomplete('lepton')}</span>` : ''}</div>`;
  }).join('');
  $('lr-out').innerHTML = h || '<div class="lr-row"><span>no read yet</span><b>one third tau, one third muon, one third electron</b></div>';
}
function draw() {
  const cv = document.getElementById('lr-face'); if (!cv) return;
  const g = cv.getContext('2d'), W = cv.width, H = cv.height, c = current(), pos = positions(c), w = weights(c);
  g.clearRect(0, 0, W, H);
  // the face: a triangle with the three positions of the repair current at its sides
  const cx = 150, cy = 160, R = 105, P = [0, 1, 2].map((j) => [cx + R * Math.cos(-Math.PI / 2 + 2 * Math.PI * j / 3), cy + R * Math.sin(-Math.PI / 2 + 2 * Math.PI * j / 3)]);
  g.fillStyle = 'rgba(62,230,168,.08)'; g.strokeStyle = 'rgba(62,230,168,.5)'; g.lineWidth = 1.5;
  g.beginPath(); P.forEach((p, j) => (j ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.fill(); g.stroke();
  P.forEach((p, j) => {
    const a = pos[j]; g.shadowColor = '#3ee6a8'; g.shadowBlur = 24 * a;
    g.fillStyle = `rgba(62,230,168,${0.15 + 0.85 * a})`; g.beginPath(); g.arc(p[0], p[1], 10 + 26 * Math.sqrt(a), 0, 2 * Math.PI); g.fill(); g.shadowBlur = 0;
    g.fillStyle = '#c5d0e6'; g.font = '12px Inter, Helvetica, Arial'; g.textAlign = 'center'; g.fillText((100 * a).toFixed(0) + ' %', p[0], p[1] + 46);
  });
  g.fillStyle = '#93a3c0'; g.textAlign = 'center'; g.fillText(`where the repair current is · tick ${LR.t.toFixed(0)}`, cx, 22);
  // the three characters
  const x0 = 330, bw = 56, cols = ['#ffd166', '#4cc3ff', '#b197ff'];
  g.fillText('which lepton', x0 + 1.5 * bw + 15, 22);
  [0, 2, 1].forEach((k, i) => {
    const x = x0 + i * (bw + 15), h = 200 * w[k];
    g.fillStyle = 'rgba(147,163,192,.15)'; g.fillRect(x, 50, bw, 200);
    g.fillStyle = cols[k]; g.shadowColor = cols[k]; g.shadowBlur = 12; g.fillRect(x, 250 - h, bw, h); g.shadowBlur = 0;
    g.fillStyle = '#eef2fb'; g.font = '700 16px Inter, Helvetica, Arial'; g.fillText(SYMS[k], x + bw / 2, 275);
    g.font = '11px Inter, Helvetica, Arial'; g.fillStyle = '#c5d0e6'; g.fillText((100 * w[k]).toFixed(1) + ' %', x + bw / 2, 292);
  });
}

// ---------------------------------------------------------------- the side panel of one class
function ensureModal() {
  if ($('cl-modal')) return;
  const m = document.createElement('div'); m.id = 'cl-modal';
  m.innerHTML = '<div id="cl-box" role="dialog" aria-modal="true" aria-label="class card"></div>';
  m.onclick = (e) => { if (e.target === m) m.classList.remove('on'); };
  document.body.appendChild(m);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') m.classList.remove('on'); });
}
export async function openClass(k) {
  ensureModal();
  const box = $('cl-box'), c = CLASSES[k];
  $('cl-modal').classList.add('on'); box.scrollTop = 0;
  box.innerHTML = `<button class="q2-x" id="cl-x" aria-label="close">×</button><div class="q2m-head">${glyph(k, 30)}<div><h2 style="color:${c.color}">${c.title}</h2></div></div><div class="q2-load"></div>`;
  $('cl-x').onclick = () => $('cl-modal').classList.remove('on');
  const wait = busy(box.querySelector('.q2-load'), 'loading the patterns and the run statistics of the class');
  await load(); wait.done();
  box.innerHTML = `<button class="q2-x" id="cl-x" aria-label="close">×</button>
    <div class="q2m-head">${glyph(k, 30)}<div><h2 style="color:${c.color}">${c.title}</h2>
      <p class="q2-small">class ${k} · conjugate class ${c.conj} · colour ${c.colour} · weak ${c.weak}</p></div></div>
    <div class="cl-sec"><div class="k">What it is ${chip('derived')}${hint(IDENT)}</div><p>${c.members}.</p>
      <div class="cl-gens">${c.gens.map(([a, b]) => `<span>${a}<em>${b}</em></span>`).join('')}</div></div>
    <div class="cl-sec"><div class="k">Mass</div>${massBlock(k)}</div>
    ${k === 3 ? leptonGenerations() : ''}
    <div class="cl-sec"><div class="k">Its vertex</div><p>${c.vertex}</p></div>
    <div class="cl-sec"><div class="k">Who reads its flux</div><p>${c.sees}.</p></div>
    <div class="cl-sec"><div class="k">Spin and statistics ${chip('derived')}</div><p>${STATS}</p></div>
    <details class="q2-exp"><summary>In the run ${S.name || ''}</summary>${runRows(k)}</details>
    <details class="q2-exp"><summary>The patterns that carry it</summary>${patternRows(k)}</details>
    <div class="cl-sec"><div class="k">Backing</div>${linkList(['classes', 'spin', 'gauge', ...({ 3: ['lepton', 'higgs', 'neutral'], 0: ['coupling'], 1: ['yukawa'], 4: ['yukawa'] }[k] || []), 'run'])}</div>`;
  $('cl-x').onclick = () => $('cl-modal').classList.remove('on');
  if (k === 3) leptonWidget();
}
window.__openClass = openClass;

// ---------------------------------------------------------------- the wheel: the six classes at k sixths of a turn
// Node size: defect identities of the class on the screen over the selected run (class_stats.json); chords join k and 6 − k.
function wheel(d) {
  const N = 460, c = N / 2, R = 160, q = (s) => String(s).replace(/"/g, '&quot;');
  const pos = (k) => { const a = -Math.PI / 2 + k * Math.PI / 3; return [c + R * Math.cos(a), c + R * Math.sin(a)]; };
  const ever = (k) => (d && d[k] ? d[k].ever : 0), mx = Math.max(1, ...[1, 2, 3, 4, 5].map(ever));
  const rad = (k) => (k === 0 ? 19 : 19 + 15 * Math.sqrt(ever(k) / mx));
  const total = [1, 2, 3, 4, 5].reduce((a, k) => a + ever(k), 0);
  const hex = [0, 1, 2, 3, 4, 5].map((k) => pos(k).map((v) => v.toFixed(1)).join(',')).join(' ');
  let s = `<div class="cl-wheel"><svg id="cl-wheel" viewBox="0 0 ${N} ${N}" role="img" aria-label="The six classes on a circle">
    <defs><filter id="clGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <radialGradient id="clCore"><stop offset="0" stop-color="#3b5cb0" stop-opacity=".28"/><stop offset="1" stop-color="#3b5cb0" stop-opacity="0"/></radialGradient></defs>
    <circle cx="${c}" cy="${c}" r="${R + 70}" fill="url(#clCore)"/>
    <circle cx="${c}" cy="${c}" r="${R + 38}" fill="none" stroke="rgba(140,170,230,.07)"/>
    <g class="cl-orbit" style="transform-origin:${c}px ${c}px"><circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="rgba(140,170,230,.2)" stroke-dasharray="1.5 7"/>
      <circle cx="${c}" cy="${c - R - 38}" r="2.4" fill="#cfe0ff" filter="url(#clGlow)"/></g>
    <polygon points="${hex}" fill="none" stroke="rgba(140,170,230,.13)" stroke-width="1"/>
    ${[[1, 5], [2, 4]].map(([a, b]) => { const [x1, y1] = pos(a), [x2, y2] = pos(b); return `<line class="cl-chord" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${CLASSES[a].color}" stroke-opacity=".38" stroke-width="1.2" stroke-dasharray="3 6"/>`; }).join('')}
    <text x="${c}" y="${c + 8}" text-anchor="middle" font-size="22" font-weight="700" fill="rgba(220,230,250,.13)">6Y mod 6</text>`;
  for (const k of [0, 1, 2, 3, 4, 5]) {
    const [x, y] = pos(k), C = CLASSES[k], r = rad(k), dark = C.shape === 'disc';
    const body = C.shape === 'ring' ? `<circle r="${r * 0.78}" fill="none" stroke="${C.color}" stroke-width="${r * 0.3}" filter="url(#clGlow)"/>`
      : C.shape === 'duo' ? `<circle r="${r * 0.56}" fill="${C.color}" filter="url(#clGlow)"/><circle r="${r * 0.94}" fill="none" stroke="${C.rim}" stroke-width="${r * 0.15}" filter="url(#clGlow)"/>`
        : C.shape === 'flat' ? `<circle r="${r}" fill="rgba(159,176,207,.04)" stroke="${C.color}" stroke-opacity=".7" stroke-width="1.4" stroke-dasharray="3 4"/>`
          : `<circle r="${r}" fill="${C.color}" filter="url(#clGlow)"/>`;
    const read = `<b style="color:${C.color}">class ${k}</b> · conjugate ${C.conj} · ${ever(k) ? fmt(ever(k)) + ' defect identities' : 'no flux, no defect'}`;
    const ly = k === 0 ? -r - 10 : k === 3 ? r + 22 : r + 19;
    s += `<g class="cl-node" data-k="${k}" data-read="${q(read)}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})" style="--c:${C.color};--d:${(k * 0.55).toFixed(2)}s" tabindex="0" role="button" aria-label="${q(C.title)}">
      <circle class="cl-halo" r="${r + 14}" fill="${C.color}"/>${body}
      <text y="5" text-anchor="middle" font-size="14" font-weight="700" fill="${dark || C.shape === 'duo' ? '#08101e' : C.color}">${k}</text>
      ${k ? `<text y="${ly}" text-anchor="middle" font-size="13" font-weight="600" fill="${C.color}" class="cl-sym">${C.short}</text>` : ''}</g>`;
  }
  return s + `</svg><div class="cl-wheel-read"><span>${total ? fmt(total) + ' defect identities on the screen of ' + S.name : 'no run statistics on file'}</span></div></div>`;
}

// ---------------------------------------------------------------- the page
const head = () => `<header class="q2-head"><div><h2 class="q2-title">The particle classes</h2>
  <div class="q2-lead"><span>A quantum of hypercharge Y carried around a class-k defect picks up the phase exp(2πi kY): the class of a multiplet is 6Y mod 6.</span> ${chip('derived')}</div></div></header>`;
export async function classesShown() {
  ensureModal();
  const host = $('cl-host'); if (!host) return;
  let wait = null;
  if (!host.querySelector('.q2c-hero')) {
    host.innerHTML = `<div class="q2-wrap q2c">${head()}<div class="q2-load"></div></div>`;
    wait = busy(host.querySelector('.q2-load'), 'loading the class statistics of the run');
  }
  await load(); if (wait) wait.done();
  const d = STATSJ && STATSJ.d && STATSJ.d.tiers && STATSJ.d.tiers.screen && STATSJ.d.tiers.screen.classes;
  const card = (k) => {
    const c = CLASSES[k], n = d && d[k] ? fmt(d[k].ever) + ' defects in ' + S.name : 'no flux, no defect';
    return `<div class="q2-card q2c-card" style="--c:${c.color}" data-k="${k}" role="button" tabindex="0" aria-label="${c.title}: open the class card">
      <div class="q2c-top">${glyph(k, 24)}<h4>${c.title}</h4><span class="q2c-k">class ${k}</span></div>
      <div class="q2c-part">${c.card}</div>
      <div class="q2c-meta"><span>colour ${c.colour} · weak ${c.weak}</span><span class="q2c-n">${n}</span></div></div>`;
  };
  // rows: a class beside its conjugate; the last row holds the two classes that are their own conjugates
  host.innerHTML = `<div class="q2-wrap q2c">${head()}
    <div class="q2c-hero"><div class="q2-card q2c-wheelbox">${wheel(d)}</div>
      <div class="q2c-cards">${[1, 5, 4, 2, 3, 0].map(card).join('')}</div></div>
    <footer class="q2-foot">${linkList(['classes', 'spin', 'run'])}</footer></div>`;
  host.querySelectorAll('.q2c-card').forEach((el) => {
    const open = () => openClass(Number(el.dataset.k));
    el.onclick = (e) => { if (!e.target.closest('.hq')) open(); };
    el.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
  });
  const read = host.querySelector('.cl-wheel-read > span'), idle = read ? read.innerHTML : '';
  host.querySelectorAll('.cl-node').forEach((el) => {
    const k = Number(el.dataset.k), on = (v) => {
      host.querySelector('.cl-wheel').classList.toggle('hov', v); el.classList.toggle('on', v); if (read) read.innerHTML = v ? el.dataset.read : idle;
      const cd = host.querySelector(`.q2c-card[data-k="${k}"]`); if (cd) cd.classList.toggle('lit', v);
    };
    el.onclick = () => openClass(k);
    el.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openClass(k); } };
    el.onmouseenter = () => on(true); el.onmouseleave = () => on(false); el.onfocus = () => on(true); el.onblur = () => on(false);
  });
}
