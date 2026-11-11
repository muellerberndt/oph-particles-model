// The Timeline page: the early universe as one logarithmic ribbon, from the first tick to the binding of quarks, with
// three aligned scales (seconds, ticks, GeV). Only what the model computes is marked: the cell and the stored run, the
// two scales of the coupling chain, and the transitions measured on the lattice.
// The top of this file is a pure engine (no DOM, importable in node; checked by epochs_check.mjs); the page itself
// starts at "the page".
//
// Sources. The chain's scales: repair-law/COUPLING_FIX.md (E_cell, M_U, 1/alpha_U, v; declared forms, closure read at
// m_Z), reports/DC.md (E_cell = E* P^(-1/2), derived given three premises), reports/LV.md (the law for v), reports/HD.md
// (Lambda^(3) = 0.3400 GeV from the chain's alpha_s). The transitions: the lattice files /rl/EW/ew_transition.json,
// /rl/QCD/colour_transition.json and /rl/HAD/hadrons.json (drawn only when present). The stored run: its run.json.
// Time from temperature: t = 2.42 s / sqrt(g*) / (T/MeV)^2, the radiation-era relation, with the count g* of the
// model's own matter content (twelve gauge bosons, one Higgs doublet, fifteen gauge-charged fermion states per copy in
// three copies: 106.75). Below the electroweak crossover a species leaves the count when the plasma is colder than its
// mass; those thresholds are the measured masses (the model's own quark masses are open).

// ---------------------------------------------------------------- constants
export const HBAR_GEV_S = 6.582119569e-25;       // hbar in GeV s (CODATA; exact in the SI)
export const E_STAR = 1.220890e19;               // GeV, the chain's display unit
export const P_FWD = 1.6309721;                  // the chain's fixed point
export const E_CELL = 9.5599e18;                 // GeV, E* P^(-1/2)
export const TICK_S = HBAR_GEV_S / E_CELL;       // one tick = hbar / E_cell = 6.8851e-44 s
export const M_U = 2.4736e16;                    // GeV, declared form E* exp(-2 pi) P^(1/6)
export const INV_ALPHA_U = 24.3166;              // declared chain, closure read at m_Z
export const SLOPES = [33 / 5, 1, -3];           // declared one-loop slopes (b1, b2, b3)
export const V_CHAIN = 246.60;                   // GeV, declared chain
export const MZ_CHAIN = 91.588, MW_CHAIN = 80.330;   // GeV, tree values of the chain
export const LAMBDA3 = 0.3400;                   // GeV, from the chain's alpha_s(m_Z) = 0.11834
export const K_PER_GEV = 1.160451812e13;         // kelvin per GeV
export const YEAR_S = 3.15576e7;                 // Julian year
// thresholds of the count g*(T) below the electroweak crossover: measured masses in GeV (PDG 2024)
export const MASS = { t: 172.57, H: 125.20, Z: 91.188, W: 80.369, b: 4.183, tau: 1.77693, c: 1.273, pi: 0.13957, mu: 0.105658, e: 0.000510999 };
export const RAD_COEF = 2.42;                    // seconds: t = 2.42 s / sqrt(g*) / (T/MeV)^2
export const G_ALL = 106.75;                     // 24 + 4 bosonic states, 90 fermionic states weighted 7/8

// ---------------------------------------------------------------- time and temperature
// env = { T_EW, T_QCD } in GeV: where the two phase boundaries sit. Defaults are the chain's scales v and Lambda^(3);
// the lattice files replace them by the measured transition temperatures where their route is computed.
export const defaultEnv = () => ({ T_EW: V_CHAIN, T_QCD: LAMBDA3, ewLocated: false, qcdLocated: false, placeholder: false });
// g*(T): the count of relativistic states, in steps. Above the electroweak crossover every species of the model's
// content counts (106.75); below it a species counts while the temperature exceeds its mass; quarks and gluons count
// above the colour transition, pions below it.
export function gstar(T, env = defaultEnv()) {
  const hot = T >= env.T_EW;
  let g = 2 + 5.25;                                             // photon; three neutrino species
  for (const m of [MASS.e, MASS.mu, MASS.tau]) if (hot || T >= m) g += 3.5;
  if (T >= env.T_QCD) { g += 16; for (const m of [0, 0, 0, MASS.c, MASS.b, MASS.t]) if (hot || T >= m) g += 10.5; }
  else if (T >= MASS.pi) g += 3;
  for (const [m, d] of [[MASS.W, 6], [MASS.Z, 3], [MASS.H, 1]]) if (hot || T >= m) g += d;
  return g;
}
export const radiationTime = (T, g) => RAD_COEF / Math.sqrt(g) / (T * 1e3) ** 2;     // seconds; T in GeV
export const timeOfTemperature = (T, env = defaultEnv()) => radiationTime(T, gstar(T, env));
// the inverse; across a step of g* the temperature stays at the threshold while the time runs on
export function temperatureOfTime(t, env = defaultEnv()) {
  let lo = -5, hi = 20.5;                                       // log10 GeV
  for (let i = 0; i < 70; i++) { const mid = (lo + hi) / 2; if (timeOfTemperature(10 ** mid, env) > t) lo = mid; else hi = mid; }
  return 10 ** ((lo + hi) / 2);
}
// the declared chain between M_U and m_Z: 1/alpha_i(mu) = 1/alpha_U + (b_i / 2 pi) ln(M_U / mu), U(1) in unified normalisation
export function inverseCouplings(mu) {
  const L = Math.log(M_U / Math.min(mu, M_U)) / (2 * Math.PI);
  return SLOPES.map((b) => INV_ALPHA_U + b * L);
}
export function chainAtMZ() {
  const [a1, a2, a3] = inverseCouplings(MZ_CHAIN);
  return { inv1: a1, inv2: a2, inv3: a3, alpha_s: 1 / a3, sin2: 1 / (1 + (5 / 3) * a1 / a2), invEm: a2 + (5 / 3) * a1 };
}

// ---------------------------------------------------------------- numbers as text
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export const sup = (n) => String(n).split('').map((c) => SUP[c] ?? c).join('');
export const pow10 = (e) => (e === 0 ? '1' : e === 1 ? '10' : '10' + sup(e));
export function sci(x, sig = 2) {                               // 9.6 × 10¹⁸
  if (!Number.isFinite(x)) return '–';
  if (x === 0) return '0';
  let e = Math.floor(Math.log10(Math.abs(x))), m = (x / 10 ** e).toFixed(sig - 1);
  if (Math.abs(parseFloat(m)) >= 10) { e += 1; m = (x / 10 ** e).toFixed(sig - 1); }
  return `${m} × 10${sup(e)}`;
}
export function num(x, sig = 3) {                               // plain digits between 0.001 and 100,000, else powers of ten
  if (!Number.isFinite(x)) return '–';
  if (x === 0) return '0';
  const a = Math.abs(x);
  if (a >= 1e5 || a < 1e-3) return sci(x, sig);
  const d = Math.max(0, sig - 1 - Math.floor(Math.log10(a)));
  const s = x.toFixed(Math.min(d, 8));
  return a >= 1000 ? Number(s).toLocaleString('en-US') : s;
}
export function fmtEnergy(GeV, sig = 3) {
  if (!Number.isFinite(GeV)) return '–';
  if (GeV >= 1e4) return sci(GeV, sig) + ' GeV';
  if (GeV >= 1) return num(GeV, sig) + ' GeV';
  if (GeV >= 1e-3) return num(GeV * 1e3, sig) + ' MeV';
  if (GeV >= 1e-6) return num(GeV * 1e6, sig) + ' keV';
  return num(GeV * 1e9, sig) + ' eV';
}
export function fmtTime(s, sig = 2) {
  if (!Number.isFinite(s)) return '–';
  if (s < 1e-2) return sci(s, sig) + ' s';
  if (s < 90) return num(s, sig) + ' s';
  if (s < 5400) return num(s / 60, sig) + ' min';
  if (s < 2 * 86400) return num(s / 3600, sig) + ' h';
  if (s < YEAR_S) return num(s / 86400, sig) + ' days';
  const y = s / YEAR_S;
  return (y < 1e6 ? Number(y.toPrecision(sig)).toLocaleString('en-US') : sci(y, sig)) + ' years';
}
export const fmtTicks = (n, sig = 2) => (n < 1e5 ? Math.round(n).toLocaleString('en-US') : sci(n, sig)) + (Math.round(n) === 1 ? ' tick' : ' ticks');
export const fmtKelvin = (GeV, sig = 2) => sci(GeV * K_PER_GEV, sig) + ' K';

// ---------------------------------------------------------------- the lattice files (shared with transitions.js)
export const FILES = { ew: 'rl/EW/ew_transition.json', qcd: 'rl/QCD/colour_transition.json', had: 'rl/HAD/hadrons.json' };
export async function loadJson(url) {
  try { const r = await fetch(url, { cache: 'no-store' }); if (!r.ok) return null; return await r.json(); } catch (e) { return null; }
}
const pos = (x) => (typeof x === 'number' && Number.isFinite(x) && x > 0 ? x : null);
// what the ribbon takes from the files: the crossover temperature of the electroweak run, and the colour transition
// temperature only when the colour file marks its route to MeV as computed
export function envFromFiles(ew, qcd) {
  const env = defaultEnv();
  const Tc = pos(ew && ew.oph && ew.oph.T_c_GeV), sc = (qcd && qcd.scale) || {}, Tp = sc.route_computed === true ? pos(sc.T_pc_MeV) : null;
  if (Tc) { env.T_EW = Tc; env.ewLocated = true; env.ewErr = pos(ew.oph.T_c_err); env.ewPlaceholder = ew.placeholder === true; }
  if (Tp) { env.T_QCD = Tp / 1e3; env.qcdLocated = true; env.qcdErr = pos(sc.T_pc_err) ? sc.T_pc_err / 1e3 : null; }
  env.qcdPlaceholder = !!(qcd && qcd.placeholder === true);
  env.placeholder = !!(env.ewPlaceholder || (env.qcdLocated && env.qcdPlaceholder));
  return env;
}
// the marks of the ribbon, left to right: id, temperature (GeV) or time (s), status
export function ribbonMarks(env = defaultEnv(), runTicks = null) {
  const at = (T) => timeOfTemperature(T, env);
  const m = [
    { id: 'cell', t: TICK_S, status: 'derived' },
    ...(runTicks > 1 ? [{ id: 'run', t: runTicks * TICK_S, status: 'run' }] : []),
    { id: 'unification', T: M_U, t: at(M_U), status: 'declared' },
    { id: 'scale', T: V_CHAIN, t: at(V_CHAIN), status: 'declared' },
  ];
  if (env.ewLocated) m.push({ id: 'ew', T: env.T_EW, t: at(env.T_EW), status: 'lattice' });
  m.push({ id: 'colour', T: env.T_QCD, t: at(env.T_QCD), status: 'lattice' });
  return m.sort((a, b) => a.t - b.t);
}
export const RIBBON = { L0: Math.log10(TICK_S), L1: -3.6 };     // log10 seconds at the two ends

// ---------------------------------------------------------------- the page
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const r1 = (v) => Math.round(v * 10) / 10;
const PH = { symmetric: ['#a995ff', 'symmetric'], broken: ['#3fe0d0', 'electroweak broken'], confined: ['#ffb44a', 'confined'] };
const CHIP = { derived: ['derived', 'derived'], declared: ['declared', 'declared forms that fit'], lattice: ['lattice', 'lattice'], open: ['open', 'open'], placeholder: ['placeholder', 'placeholder'], run: ['run', 'the run'] };
const PHTAG = '<i class="tl-ph">placeholder</i>';
const chip = (k) => `<i class="ep-chip ep-st-${CHIP[k][0]}">${CHIP[k][1]}</i>`;
const pmS = (v, e) => (fin(e) && e > 0 ? `${v.toFixed(Math.max(0, 1 - Math.floor(Math.log10(e))))} ± ${e.toFixed(Math.max(0, 1 - Math.floor(Math.log10(e))))}` : num(v, 4));

let ST = null;                                                  // everything the page holds
function runFacts(app) {                                        // the stored run: how many ticks it covers and its first defects
  const m = app && app.S && app.S.meta; if (!m || !m.end) return null;
  const first = (m.cuts || []).slice().sort((a, b) => a.depth - b.depth).find((c) => c.screen > 0), last = (m.cuts || []).reduce((a, c) => Math.max(a, c.depth || 0), 0);
  return { name: app.S.name, ticks: m.end.ticks_mean, depth: last, carriers: m.geometry && m.geometry.carriers, firstDepth: first ? first.depth : null, firstCount: first ? first.screen : null, firstTicks: first ? first.ticks_mean : null };
}
function epochAt(t) {
  const e = ST.env, B = ST.bounds;
  return t < B.tU ? 'cell' : t < B.tEW ? 'symmetric' : t < B.tC ? 'broken' : 'confined';
}
const phaseOf = (ep) => (ep === 'cell' || ep === 'symmetric' ? 'symmetric' : ep);

function markTexts() {
  const e = ST.env, ew = ST.files.ew, qcd = ST.files.qcd, had = ST.files.had, run = ST.run, o = (ew && ew.oph) || {}, u = (qcd && qcd.su3) || {};
  const f = (had && had.potential && had.potential.fit) || {}, rN = ((had && had.ratios) || []).find((q) => q && /m_?N\s*\/\s*m_?rho/i.test(String(q.name || '')) && fin(q.value));
  const tag = (d) => (d && d.placeholder === true ? ' ' + PHTAG : ''), waits = (d) => !d || d.placeholder === true;
  const col = [fin(u.beta_c) ? `β<sub>c</sub> = ${pmS(u.beta_c, u.beta_c_err)}${tag(qcd)}` : '', rN ? `m<sub>N</sub>/m<sub>ρ</sub> = ${pmS(rN.value, rN.err)}${tag(had)}` : fin(f.sigma) ? `string tension ${pmS(f.sigma, f.sigma_err)}${tag(had)}` : ''].filter(Boolean);
  return {
    cell: { name: 'The cell', chip: 'derived', line: `E<sub>cell</sub> = ${sci(E_CELL, 3)} GeV · one tick = ħ / E<sub>cell</sub> = ${sci(TICK_S, 3)} s` },
    run: { name: 'The stored run', chip: 'run', line: run ? `${fin(run.firstCount) ? `${run.firstCount.toLocaleString('en-US')} defects by causal depth ${run.firstDepth} · ` : ''}ends after ${Math.round(run.ticks).toLocaleString('en-US')} ticks` : '' },
    unification: { name: 'Unification scale', chip: 'declared', line: `M<sub>U</sub> = ${sci(M_U, 3)} GeV · 1/α<sub>U</sub> = ${INV_ALPHA_U}` },
    scale: { name: 'Electroweak scale', chip: 'declared', line: `v = ${V_CHAIN.toFixed(2)} GeV` },
    ew: { name: 'Electroweak crossover', chip: 'lattice', pg: waits(ew) ? 'EW' : '', line: e.ewLocated ? `${pmS(e.T_EW, e.ewErr)} GeV${tag(ew)} · ${fmtTime(timeOfTemperature(e.T_EW, e))}${o.kind ? ' · ' + esc(o.kind) : ''}` : 'temperature from the lattice run' },
    colour: { name: 'Colour confines, quarks bind', chip: 'lattice', pg: waits(qcd) ? 'QCD' : waits(had) ? 'HAD' : '', line: [...col, e.qcdLocated ? `${pmS(e.T_QCD * 1e3, e.qcdErr ? e.qcdErr * 1e3 : null)} MeV` : `at Λ<sup>(3)</sup> = ${LAMBDA3.toFixed(3)} GeV`].join(' · ') },
  };
}
const pinColor = (m) => (m.status === 'declared' ? '#ffb44a' : m.status === 'derived' ? '#3fe0d0' : m.status === 'run' ? '#eef2fb' : '#6fb1ff');
const labelHtml = (m, T, n) => `<div class="tl-mark" data-id="${m.id}">${n ? `<i class="tl-num" style="--k:${pinColor(m)}">${n}</i>` : ''}<div class="tl-mark-n"><span>${T[m.id].name}</span>${chip(T[m.id].chip)}</div><div class="tl-mark-l">${T[m.id].line}</div>${T[m.id].pg ? `<div class="tl-pg" data-pg="${T[m.id].pg}"></div>` : ''}</div>`;
function mountProgress(root) { if (ST.progress) for (const h of root.querySelectorAll('.tl-pg:empty')) h.appendChild(ST.progress(h.dataset.pg)); }
function shell() {
  return `<div class="tl-wrap">
    <div class="ep-head"><div><h2>From the first tick to bound quarks</h2>
      <div class="ep-sub">Map into this step: ticks in the time direction are temperature. One ribbon carries the model's scales in seconds, ticks and GeV.</div></div>
      <div class="tl-ctl"><button class="tl-play" title="move the marker along the ribbon">▶ play</button>
        <span class="tl-keys">${Object.values(PH).map(([c, n]) => `<span><i style="--k:${c}"></i>${n}</span>`).join('')}</span></div></div>
    <div class="ep-phline" hidden>placeholder data, not a measurement</div>
    <div class="tl-stage" tabindex="0" aria-label="the ribbon: drag the marker, or use the arrow keys"><div class="tl-labels"></div><svg class="ep-svg tl-svg"></svg>
      <div class="tl-read" data-row="0"></div><div class="tl-read" data-row="1"></div><div class="tl-read" data-row="2"></div></div>
    <div class="tl-list"></div>
    <div class="tl-panel"><div class="tl-card tl-now"></div><div class="tl-card tl-exists"></div><div class="tl-card tl-model"></div></div>
    <div class="tl-foot"></div></div>`;
}
// geometry of the ribbon for a stage width W. Below 760 px the labels leave the ribbon and become a numbered list.
function geom(W, tiers, narrow) {
  const L = narrow ? 50 : 78, R = narrow ? 14 : 30, tierH = 58, top = narrow ? 52 : 8 + tiers * tierH, bandH = narrow ? 38 : 46, gapH = 30, rowH = 24;
  const g = { W, L, R, tierH, top, narrow: !!narrow, bandY: top + 8, bandH, gapY: top + 8 + bandH + 6, axY: top + 8 + bandH + gapH + 10, rowH };
  g.H = g.axY + 3 * rowH + 8; g.w = W - L - R; g.ppd = g.w / (RIBBON.L1 - RIBBON.L0);
  g.X = (logt) => L + (logt - RIBBON.L0) / (RIBBON.L1 - RIBBON.L0) * g.w;
  g.logt = (X) => RIBBON.L0 + (Math.max(L, Math.min(W - R, X)) - L) / g.w * (RIBBON.L1 - RIBBON.L0);
  return g;
}
function placeLabels(host, W) {                                 // each label in the lowest row where it covers no other label and no pin
  const box = host.querySelector('.tl-labels'), list = host.querySelector('.tl-list'), T = markTexts(), marks = ST.marks, narrow = W < 760;
  list.classList.toggle('on', narrow);
  if (narrow) {
    box.innerHTML = ''; list.innerHTML = marks.map((m, i) => labelHtml(m, T, i + 1)).join(''); mountProgress(list);
    const g = geom(W, 0, true); let last = -99, row = 0;
    return { g, placed: marks.map((m, i) => { const pin = g.X(Math.log10(m.t)); row = pin - last < 22 ? 1 - row : 0; last = pin; return { id: m.id, pin, n: i + 1, row }; }) };
  }
  list.innerHTML = ''; box.innerHTML = marks.map((m) => labelHtml(m, T, 0)).join(''); mountProgress(box);
  // labels that open to the right are placed from the right, those that open to the left from the left, so no pin crosses a label
  const g0 = geom(W, 3), placed = [], pref = { cell: 1, run: 1, unification: 1, scale: -1, ew: -1, colour: -1 };
  const order = [...marks.filter((m) => pref[m.id] > 0).sort((a, b) => b.t - a.t), ...marks.filter((m) => pref[m.id] < 0).sort((a, b) => a.t - b.t)].map((m) => m.id);
  for (const id of order) {
    const m = marks.find((q) => q.id === id), el = box.querySelector(`.tl-mark[data-id="${id}"]`), w = Math.min(el.offsetWidth + 2, W - 12), pin = g0.X(Math.log10(m.t));
    let best = null;
    for (let tier = 0; tier < 5 && !best; tier++) for (const side of [pref[id], -pref[id]]) {
      let a = side > 0 ? pin - 6 : pin + 6 - w; a = Math.max(4, Math.min(W - 4 - w, a)); const b = a + w;
      const clash = placed.some((p) => (p.tier === tier && a < p.b + 12 && b > p.a - 12) || (p.tier < tier && pin > p.a - 5 && pin < p.b + 5) || (p.tier > tier && p.pin > a - 5 && p.pin < b + 5));
      if (!clash) { best = { id, a, b, tier, pin, side }; break; }
    }
    placed.push(best || { id, a: 4, b: 4 + w, tier: 4, pin, side: 1 });
  }
  const tiers = Math.max(...placed.map((p) => p.tier)) + 1, g = geom(W, tiers);
  for (const p of placed) {
    const el = box.querySelector(`.tl-mark[data-id="${p.id}"]`); p.y = g.top - (p.tier + 1) * g.tierH + 2;
    el.style.left = r1(p.a) + 'px'; el.style.top = r1(p.y) + 'px'; el.style.width = r1(p.b - p.a) + 'px'; el.dataset.side = p.side > 0 ? 'right' : 'left';
  }
  return { g, placed };
}
function drawRibbon(host) {
  const stage = host.querySelector('.tl-stage'), W = Math.floor(stage.clientWidth);
  if (!(W > 200)) return false;
  const { g, placed } = placeLabels(host, W), e = ST.env, B = ST.bounds, X = (t) => g.X(Math.log10(t)), by = g.bandY, bh = g.bandH;
  stage.style.height = g.H + 'px';
  // the band: colour follows the phase; each transition is a blend
  const frac = (x) => Math.max(0, Math.min(1, (x - g.L) / g.w)), xE = X(B.tEW), xC0 = X(B.tC), xC1 = X(B.tC1);
  const eA = e.ewLocated ? xE - 6 : X(timeOfTemperature(V_CHAIN, e)), eB = e.ewLocated ? xE + 6 : X(timeOfTemperature(V_CHAIN, e) * 30);
  const cA = e.qcdLocated ? Math.min(xC0, xC1 - 10) : X(B.tC / 6), cB = e.qcdLocated ? Math.max(xC1, xC0 + 10) : X(B.tC * 6);
  const stops = [[0, '#f4f1ff'], [frac(X(B.tU)), '#a995ff'], [frac(eA), '#a995ff'], [frac(eB), '#3fe0d0'], [frac(cA), '#3fe0d0'], [frac(cB), '#ffb44a'], [1, '#ffb44a']];
  let s = `<defs><linearGradient id="tlBand" gradientUnits="userSpaceOnUse" x1="${g.L}" x2="${g.L + g.w}" y1="0" y2="0">${stops.map(([o, c]) => `<stop offset="${(100 * o).toFixed(3)}%" stop-color="${c}"/>`).join('')}</linearGradient>
    <linearGradient id="tlRun" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".8" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient>
    <filter id="tlGlow" x="-5%" y="-150%" width="110%" height="400%"><feGaussianBlur stdDeviation="11"/></filter><clipPath id="tlClip"><rect x="${g.L}" y="${by}" width="${g.w}" height="${bh}" rx="${bh / 2}"/></clipPath></defs>`;
  s += `<rect x="${g.L}" y="${by + 2}" width="${g.w}" height="${bh - 4}" rx="${bh / 2}" fill="url(#tlBand)" filter="url(#tlGlow)" opacity=".62"/>`;
  s += `<rect x="${g.L}" y="${by}" width="${g.w}" height="${bh}" rx="${bh / 2}" fill="url(#tlBand)" opacity=".9"/><g clip-path="url(#tlClip)">`;
  s += `<rect x="${g.L}" y="${by}" width="${g.w}" height="${bh / 2}" fill="#fff" opacity=".1"/>`;
  // the three inverse couplings of the declared chain between M_U and m_Z, one line above M_U
  const yA = (v) => by + bh - 5 - Math.min(64, v) / 64 * (bh - 10), xU = X(B.tU), mus = Array.from({ length: 40 }, (_, i) => M_U * (MZ_CHAIN / M_U) ** (i / 39));
  s += `<line x1="${g.L}" x2="${r1(xU)}" y1="${r1(yA(INV_ALPHA_U))}" y2="${r1(yA(INV_ALPHA_U))}" stroke="#0a1024" stroke-width="1.4" opacity=".5"/>`;
  for (let k = 0; k < 3; k++) s += `<path d="${mus.map((mu, i) => `${i ? 'L' : 'M'}${r1(X(timeOfTemperature(mu, e)))} ${r1(yA(inverseCouplings(mu)[k]))}`).join('')}" fill="none" stroke="#0a1024" stroke-width="1.4" opacity=".5"/>`;
  // the stored run: the ticks it covers, at the left end
  const run = ST.run;
  if (run && fin(run.ticks) && run.ticks > 1) { const xr = X(run.ticks * TICK_S); s += `<rect x="${g.L}" y="${by}" width="${r1(xr - g.L)}" height="${bh}" fill="url(#tlRun)"/><line x1="${r1(xr)}" x2="${r1(xr)}" y1="${by}" y2="${by + bh}" stroke="#fff" stroke-width="1.5" opacity=".9"/>`; }
  s += '</g>';
  if (run && fin(run.ticks) && run.ticks > 1) {
    const xr = X(run.ticks * TICK_S), gy = g.gapY + 9, far = ST.marks.find((m) => m.id === 'ew') || ST.marks.find((m) => m.id === 'scale'), xf = X(far.t), xc = X(B.tC), dec = Math.log10(far.t / TICK_S / run.ticks);
    if (xr - g.L > 126) s += `<text class="tl-run" x="${r1(g.L + 10)}" y="${by + bh / 2 + 4}">the stored run</text>`;
    s += `<path d="M${r1(xr)} ${gy - 5}V${gy}H${r1(xc)}V${gy - 5}M${r1(xf)} ${gy - 5}V${gy}" fill="none" stroke="rgba(197,208,230,.5)" stroke-width="1"/>`;
    const span = xf - xr, txt = span > 720 ? `the run ends after ${Math.round(run.ticks).toLocaleString('en-US')} ticks · ${Math.round(dec)} more decades to the crossover · lattice ensembles are the instrument that reaches them`
      : span > 380 ? `${Math.round(dec)} decades beyond the stored run · reached by lattice ensembles` : span > 150 ? `${Math.round(dec)} decades beyond the run` : '';
    s += `<text class="tl-gap" x="${r1((xr + xf) / 2)}" y="${gy + 14}" text-anchor="middle">${txt}</text>`;
  }
  // pins from the labels to the band
  for (const p of placed) {
    const c = pinColor(ST.marks.find((q) => q.id === p.id)), y1 = g.narrow ? by - 14 - 21 * p.row : p.y + 40;
    s += `<line x1="${r1(p.pin)}" x2="${r1(p.pin)}" y1="${r1(y1)}" y2="${by + 3}" stroke="${c}" stroke-width="1" opacity=".7"/><circle cx="${r1(p.pin)}" cy="${by + 3}" r="3.5" fill="${c}" stroke="#04060d" stroke-width="1.5"/>`;
    if (g.narrow) s += `<circle cx="${r1(p.pin)}" cy="${r1(y1)}" r="9" fill="${c}" stroke="#04060d" stroke-width="1.5"/><text class="tl-pin-n" x="${r1(p.pin)}" y="${r1(y1 + 3.5)}" text-anchor="middle">${p.n}</text>`;
  }
  // three aligned scales
  const rows = g.narrow ? ['s', 'ticks', 'GeV'] : ['seconds', 'ticks', 'GeV'], ay = (i) => g.axY + i * g.rowH, ev = g.ppd >= 18 ? 5 : 10, evT = g.ppd >= 18 ? 3 : 6;
  rows.forEach((n, i) => { s += `<text class="tl-rowt" x="${g.L - 12}" y="${ay(i) + 15}" text-anchor="end">${n}</text><line class="ep-base" x1="${g.L}" x2="${g.L + g.w}" y1="${ay(i)}" y2="${ay(i)}"/>`; });
  const tick = (x, i, major, label) => `<line class="ep-base" x1="${r1(x)}" x2="${r1(x)}" y1="${ay(i)}" y2="${ay(i) + (major ? 6 : 3)}"/>` + (label ? `<text class="ep-ax" x="${r1(x)}" y="${ay(i) + 18}" text-anchor="${x < g.L + 34 ? 'start' : x > g.L + g.w - 34 ? 'end' : 'middle'}">${label}</text>` : '');
  for (let k = Math.ceil(RIBBON.L0); k <= Math.floor(RIBBON.L1); k++) s += tick(g.X(k), 0, k % 5 === 0, k % ev === 0 ? pow10(k) + ' s' : '');
  for (let k = 0; k <= Math.floor(RIBBON.L1 - RIBBON.L0); k++) s += tick(g.X(RIBBON.L0 + k), 1, k % 5 === 0, k % ev === 0 ? pow10(k) : '');
  for (let k = 18; k >= -1; k--) { const t = timeOfTemperature(10 ** k, e), x = X(t); if (x >= g.L && x <= g.L + g.w) s += tick(x, 2, k % 3 === 0, k % evT === 0 ? (k === 0 ? '1 GeV' : pow10(k) + (g.narrow ? '' : ' GeV')) : ''); }
  // the marker
  s += `<g class="tl-marker"><line x1="0" x2="0" y1="${by - 10}" y2="${g.H - 6}" stroke="#fff" stroke-width="1.2" opacity=".85"/><circle cx="0" cy="${by + bh / 2}" r="9" fill="#fff" stroke="#04060d" stroke-width="2.5"/><circle cx="0" cy="${by + bh / 2}" r="16" fill="#fff" opacity=".18"/></g>`;
  const svg = host.querySelector('.tl-svg'); svg.setAttribute('width', W); svg.setAttribute('height', g.H); svg.setAttribute('viewBox', `0 0 ${W} ${g.H}`); svg.innerHTML = s;
  ST.g = g; ST.W = W;
  return true;
}
const SP = (sym, name) => `<span class="tl-sp" title="${name}">${sym}</span>`;
const EXISTS = {
  hot: [['massless', [SP('g', 'eight gluons'), SP('W', 'three W fields'), SP('B', 'the hypercharge field'), SP('q', 'quarks of three copies'), SP('ℓ', 'leptons of three copies')]], ['massive', []], ['bound', []]],
  broken: [['massless', [SP('γ', 'the photon'), SP('g', 'eight gluons')]], ['massive', [SP('W<sup>±</sup>', 'the W bosons'), SP('Z', 'the Z boson'), SP('H', 'the Higgs boson'), SP('q', 'quarks'), SP('e μ τ', 'charged leptons'), SP('ν', 'neutrinos, Dirac; their masses are open')]], ['bound', []]],
  confined: [['massless', [SP('γ', 'the photon')]], ['massive', [SP('e μ', 'charged leptons'), SP('ν', 'neutrinos, Dirac; their masses are open')]], ['bound', [SP('q q̄', 'a quark and an antiquark in a pair: pions and other mesons'), SP('q q q', 'three quarks in a triple: protons and neutrons'), SP('g', 'gluons, inside the pairs and triples')]]],
};
const NOTE = { cell: 'One coupling. The Higgs doublet has four components and no condensate.', symmetric: 'Three couplings. The Higgs doublet has four components and no condensate.', broken: 'The condensate v gives rest masses. Quarks and gluons move freely.', confined: 'Colour charges exist only inside pairs and triples.' };
function modelRows(ep) {
  const e = ST.env, ew = ST.files.ew, qcd = ST.files.qcd, had = ST.files.had, run = ST.run, u = (qcd && qcd.su3) || {}, lat = (k) => chip(k), tag = (d) => (d && d.placeholder === true ? ' ' + PHTAG : '');
  const f = (had && had.potential && had.potential.fit) || {}, rN = ((had && had.ratios) || []).find((q) => q && /m_?N\s*\/\s*m_?rho/i.test(String(q.name || '')) && fin(q.value));
  const go = (page, text) => `<a href="?page=${page}" class="tl-go" data-go="${page}">${text} ›</a>`, pg = (lane) => ` <span class="tl-pg" data-pg="${lane}"></span>`;
  if (ep === 'cell') return [
    `${chip('derived')}the cell energy E<sub>cell</sub> = E* P<sup>−1/2</sup> = ${sci(E_CELL, 5)} GeV, and one tick = ħ / E<sub>cell</sub>`,
    `${chip('derived')}the gauge group (SU(3) × SU(2) × U(1)) / Z<sub>6</sub> from port phases`,
    `${chip('derived')}every defect class is the centre class 6Y mod 6 of a Standard Model multiplet`,
    run && fin(run.firstCount) ? `<i class="ep-chip ep-st-run">the run</i>${run.firstCount.toLocaleString('en-US')} defects by causal depth ${run.firstDepth}, in every part of the screen; the run ends after ${Math.round(run.ticks).toLocaleString('en-US')} ticks per observer ${go('universe', 'screen')} ${go('cosmos', 'first defects')}` : '',
  ];
  if (ep === 'symmetric') return [
    `${chip('declared')}unification scale M<sub>U</sub> = ${sci(M_U, 3)} GeV with 1/α<sub>U</sub> = ${INV_ALPHA_U}`,
    `${chip('declared')}three couplings run apart with slopes (33/5, 1, −3): the thin lines inside the band ${go('couplings', 'couplings')}`,
    `${chip('derived')}quanta are fermions; defects, links and the Higgs register are bosons`,
    `${chip('open')}the premises of the coupling chain`,
  ];
  if (ep === 'broken') return [
    `${chip('declared')}v = E<sub>cell</sub> exp(−2π / 4α<sub>U</sub>) = ${V_CHAIN.toFixed(2)} GeV; tree masses m<sub>W</sub> = ${MW_CHAIN.toFixed(3)} GeV, m<sub>Z</sub> = ${MZ_CHAIN} GeV`,
    `${chip('derived')}the 4 in that law is the plaquette cost of one class-3 flux quantum`,
    e.ewLocated ? `${lat('lattice')}crossover at ${pmS(e.T_EW, e.ewErr)} GeV${tag(ew)} with the chain's couplings ${go('transitions', 'the measurement')}${ew && ew.placeholder === true ? pg('EW') : ''}` : `${chip('lattice')}the crossover temperature ${pg('EW')}`,
    `${chip('open')}the Higgs mass term; the quark masses`,
  ];
  return [
    fin(u.beta_c) ? `${lat('lattice')}the SU(3) links confine below the critical coupling β<sub>c</sub> = ${pmS(u.beta_c, u.beta_c_err)}${tag(qcd)} ${go('transitions', 'the measurement')}${qcd && qcd.placeholder === true ? pg('QCD') : ''}` : `${chip('lattice')}the colour transition ${pg('QCD')}`,
    fin(f.sigma) || rN ? `${lat('lattice')}quarks bind: ${[fin(f.sigma) ? `string tension ${pmS(f.sigma, f.sigma_err)} per lattice unit` : '', rN ? `m<sub>N</sub>/m<sub>ρ</sub> = ${pmS(rN.value, rN.err)}` : ''].filter(Boolean).join(', ')}${tag(had)} ${go('transitions', 'the measurement')}${had && had.placeholder === true ? pg('HAD') : ''}` : `${chip('lattice')}the binding of quarks ${pg('HAD')}`,
    `${chip('declared')}the chain's colour scale Λ<sup>(3)</sup> = ${LAMBDA3.toFixed(3)} GeV from α<sub>s</sub>(m<sub>Z</sub>) = 0.1183`,
    `${chip('open')}the quark masses, the pion and the neutron–proton splitting`,
  ];
}
function setMarker(host, logt, force) {
  const g = ST.g; if (!g) return;
  logt = Math.max(RIBBON.L0, Math.min(RIBBON.L1, logt)); ST.logt = logt;
  const t = 10 ** logt, T = temperatureOfTime(t, ST.env), x = g.X(logt), ep = epochAt(t);
  const mk = host.querySelector('.tl-marker'); if (mk) mk.setAttribute('transform', `translate(${r1(x)} 0)`);
  const texts = [fmtTime(t, 2), fmtTicks(t / TICK_S, 2), fmtEnergy(T, 3)];
  host.querySelectorAll('.tl-read').forEach((el, i) => { el.textContent = texts[i]; const right = x > g.W - 190; el.style.left = right ? '' : r1(x + 12) + 'px'; el.style.right = right ? r1(g.W - x + 12) + 'px' : ''; el.style.top = (g.axY + i * g.rowH + 3) + 'px'; });
  const now = host.querySelector('.tl-now');
  if (!now.dataset.built) { now.dataset.built = '1'; now.innerHTML = `<div class="tl-k">At the marker</div><div class="tl-big"></div><div class="tl-rows"><div><span>ticks since the first</span><b data-n="ticks"></b></div><div><span>temperature</span><b data-n="T"></b></div><div><span>one thermal period, E<sub>cell</sub> / T</span><b data-n="Nt"></b></div><div><span>relativistic states counted</span><b data-n="g"></b></div></div>`; }
  now.querySelector('.tl-big').textContent = texts[0];
  const put = (k, v) => { const el = now.querySelector(`[data-n="${k}"]`); if (el.textContent !== v) el.textContent = v; };
  put('ticks', texts[1]); put('T', `${texts[2]} · ${fmtKelvin(T)}`); put('Nt', fmtTicks(E_CELL / T, 2)); put('g', String(gstar(T, ST.env)));
  if (ep !== ST.ep || force) {
    ST.ep = ep; const ph = phaseOf(ep), ex = EXISTS[ph === 'symmetric' ? 'hot' : ph];
    host.querySelector('.tl-exists').innerHTML = `<div class="tl-k">What exists</div><div class="tl-phase" style="--k:${PH[ph][0]}"><i></i>${ep === 'cell' ? 'before unification' : PH[ph][1]}</div>
      ${ex.map(([n, list]) => `<div class="tl-ex" data-ex="${n}"><span>${n}</span><div>${list.length ? list.join('') : '<em>nothing</em>'}</div></div>`).join('')}<div class="tl-ex-note">${NOTE[ep]}</div>`;
    host.querySelector('.tl-model').innerHTML = `<div class="tl-k">What the model computes here</div><ul>${modelRows(ep).filter(Boolean).map((r) => `<li>${r}</li>`).join('')}</ul>`;
    mountProgress(host.querySelector('.tl-model'));
  }
}
async function refresh(host, force) {
  const [ew, qcd, had] = await Promise.all([loadJson(FILES.ew), loadJson(FILES.qcd), loadJson(FILES.had)]);
  const run = runFacts(ST.app), stamp = JSON.stringify([ew && [ew.placeholder, ew.oph && ew.oph.T_c_GeV, ew.oph && ew.oph.T_c_err, ew.oph && ew.oph.kind], qcd && [qcd.placeholder, qcd.scale, qcd.su3 && qcd.su3.beta_c, qcd.su3 && qcd.su3.beta_c_err], had && [had.placeholder, had.potential && had.potential.fit, had.ratios], run]);
  const W = Math.floor(host.querySelector('.tl-stage').clientWidth);
  if (!force && stamp === ST.stamp && W === ST.W) return;
  ST.stamp = stamp; ST.files = { ew, qcd, had }; ST.run = run;
  const e = ST.env = envFromFiles(ew, qcd); ST.marks = ribbonMarks(e, run && fin(run.ticks) ? run.ticks : null);
  ST.bounds = { tU: timeOfTemperature(M_U, e), tEW: timeOfTemperature(e.T_EW, e), tC: timeOfTemperature(e.T_QCD, e), tC1: radiationTime(e.T_QCD, gstar(e.T_QCD * 0.999, e)) };
  const anyPh = [ew, qcd, had].some((d) => d && d.placeholder === true);
  host.querySelector('.ep-phline').hidden = !anyPh;
  if (!drawRibbon(host)) return;
  setMarker(host, fin(ST.logt) ? ST.logt : Math.log10(ST.bounds.tEW) + 0.3, true);
}
export function mount(host) {
  if (!document.getElementById('epochs-css')) { const l = document.createElement('link'); l.id = 'epochs-css'; l.rel = 'stylesheet'; l.href = new URL('./style/epochs.css', import.meta.url); document.head.appendChild(l); }
  host.innerHTML = shell();
  ST = { env: defaultEnv(), files: {}, marks: [], run: null, app: null, logt: null, ep: null, ready: null, play: 0 };
  const stage = host.querySelector('.tl-stage');
  const toLog = (ev) => ST.g.logt(ev.clientX - stage.getBoundingClientRect().left);
  const stop = () => { cancelAnimationFrame(ST.play); ST.play = 0; host.querySelector('.tl-play').textContent = '▶ play'; };
  stage.addEventListener('pointerdown', (ev) => { if (!ST.g || ev.target.closest('.tl-mark, .hq')) return; stop(); try { stage.setPointerCapture(ev.pointerId); } catch (e) { /* a synthetic pointer has no capture */ } ST.drag = true; setMarker(host, toLog(ev)); });
  stage.addEventListener('pointermove', (ev) => { if (ST.drag) setMarker(host, toLog(ev)); });
  for (const n of ['pointerup', 'pointercancel']) stage.addEventListener(n, () => { ST.drag = false; });
  stage.addEventListener('keydown', (ev) => { const d = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0; if (d && ST.g) { ev.preventDefault(); stop(); setMarker(host, ST.logt + d * (ev.shiftKey ? 1 : 0.2)); } });
  host.addEventListener('click', (ev) => {
    const mk = ev.target.closest('.tl-mark'), go = ev.target.closest('.tl-go');
    if (mk && mk.closest('.tl-list')) stage.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    if (go && ST.app && ST.app.showPage) { ev.preventDefault(); ST.app.showPage(go.dataset.go); return; }
    if (mk && !ev.target.closest('.hq') && ST.g) { stop(); const m = ST.marks.find((q) => q.id === mk.dataset.id); if (m) setMarker(host, Math.log10(m.t) + (m.id === 'cell' ? 0.6 : m.id === 'colour' || m.id === 'ew' ? 0.25 : m.id === 'unification' ? 0.4 : -0.05)); }
    if (ev.target.closest('.tl-play') && ST.g) {
      if (ST.play) { stop(); return; }
      host.querySelector('.tl-play').textContent = '❚❚ pause'; const t0 = performance.now(), from = ST.logt >= RIBBON.L1 - 0.5 ? RIBBON.L0 : ST.logt, dur = 16000 * (RIBBON.L1 - from) / (RIBBON.L1 - RIBBON.L0);
      const step = (now) => { const u = Math.min(1, (now - t0) / dur); setMarker(host, from + (RIBBON.L1 - from) * u); if (u < 1 && host.offsetParent) ST.play = requestAnimationFrame(step); else stop(); };
      ST.play = requestAnimationFrame(step);
    }
  });
  ST.ready = Promise.all([import('./app.js').catch(() => null), import('./links.js').catch(() => null), import('./progress.js').catch(() => null)]).then(([app, links, prog]) => {
    ST.app = app; ST.progress = prog && prog.laneProgress;
    if (links) { const foot = host.querySelector('.tl-foot'), seen = new Set(); foot.innerHTML = links.linkList(['heat', 'coupling', 'gauge', 'run']); for (const a of foot.querySelectorAll('a')) { if (seen.has(a.href)) a.remove(); else seen.add(a.href); } }
    return refresh(host, true);
  });
  let timer = 0;
  new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(() => { if (host.offsetParent && ST.ready) ST.ready.then(() => refresh(host, false)); }, 140); }).observe(stage);
}
export function shown(host) { if (ST && ST.ready) ST.ready.then(() => refresh(host, false)); }
