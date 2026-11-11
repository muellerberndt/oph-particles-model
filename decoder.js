// The Decoder page: from a pattern of the five-level code to the particle name and its quantum numbers.
// Map into this step: a quantum is a pattern on a carrier's port, and the defect class it sees is 6Y mod 6.
//
// The first half of this file is the engine: pure integer arithmetic, no DOM, importable from node
// (decoder_check.mjs compares it with research/PD/decoder.json, which the exact Python script of lane PD writes).
// Conventions: reverse-engineering-reality/model/defect_particle_classes/model.py. Levels v1 v2 v3 s1 s2, bit i of
// the mask is level i, hypercharge -1/3 on a colour level and +1/2 on a weak level, T3 = (s1 - s2)/2, Q = T3 + Y,
// class k = 6Y mod 6. The decoder carries no mass, no coupling value and no mixing.
// The second half is the page: mount(host). Modules that touch the document are loaded inside mount.

// ---------------------------------------------------------------- engine: one pattern
export const LEVELS = ['v1', 'v2', 'v3', 's1', 's2'];
export const COLOURS = ['red', 'green', 'blue'];
const SIX_Y = [-2, -2, -2, 3, 3];        // six times the hypercharge of each level
const TWO_T3 = [0, 0, 0, 1, -1];         // twice the weak isospin of each level
const THREE_Q = [-1, -1, -1, 3, 0];      // three times the electric charge of each level
const SU3 = ['1', '3', '3b', '1'], SU2 = ['1', '2', '1'];
const MULTIPLET_OF = { u_L: 'Q', d_L: 'Q', u_R: 'u_R', d_R: 'd_R', nu_L: 'L', e_L: 'L', e_R: 'e_R', nu_R: 'nu_R' };
const LEFT_NAME = { Q: 'Q', 'anti-u_R': 'u^c', 'anti-d_R': 'd^c', L: 'L', 'anti-e_R': 'e^c', 'anti-nu_R': 'nu^c' };
// copy names are a label: the decoder carries no mass and cannot order the copies
export const SPECIES = {
  u: { syms: ['u', 'c', 't'], names: ['up', 'charm', 'top'] },
  d: { syms: ['d', 's', 'b'], names: ['down', 'strange', 'bottom'] },
  e: { syms: ['e', 'μ', 'τ'], names: ['electron', 'muon', 'tau'] },
  nu: { syms: ['ν', 'ν', 'ν'], subs: ['e', 'μ', 'τ'], names: ['electron neutrino', 'muon neutrino', 'tau neutrino'] },
};
const ANTI_LEPTON = ['positron', 'antimuon', 'antitau'];
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
export function frac(n, d = 1) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1; n /= g; d /= g;
  return d === 1 ? String(n) : `${n}/${d}`;
}
function baseName(n3, n2, s1) {
  if (n3 === 1) return n2 === 0 ? 'd_R' : n2 === 2 ? 'u_R' : s1 ? 'u_L' : 'd_L';
  return n2 === 0 ? 'e_R' : n2 === 2 ? 'nu_R' : s1 ? 'nu_L' : 'e_L';
}
function copiesOf(base, anti) {
  const [key, hand] = base.split('_'), s = SPECIES[key], handed = hand === 'L' ? 'left-handed' : 'right-handed';
  return [0, 1, 2].map((g) => {
    let row;
    if (key === 'u' || key === 'd') row = { sym: s.syms[g], sub: '', sup: '', bar: anti, flavour: s.syms[g], particle: s.names[g] + (anti ? ' antiquark' : ' quark') };
    else if (key === 'e') row = { sym: s.syms[g], sub: '', sup: anti ? '+' : '−', bar: false, flavour: null, particle: anti ? ANTI_LEPTON[g] : s.names[g] };
    else row = { sym: 'ν', sub: s.subs[g], sup: '', bar: anti, flavour: null, particle: anti ? s.names[g].replace('neutrino', 'antineutrino') : s.names[g] };
    const species = s.names[g] + (key === 'u' || key === 'd' ? ' quark' : '');
    row.long = anti ? `antiparticle of the ${handed} ${species}` : `${handed} ${species}`;
    return row;
  });
}
const CACHE = new Array(32);
export function decode(mask) {
  if (CACHE[mask]) return CACHE[mask];
  const bits = LEVELS.map((_, i) => (mask >> i) & 1);
  const n3 = bits[0] + bits[1] + bits[2], n2 = bits[3] + bits[4], degree = n3 + n2;
  const sum = (w) => bits.reduce((s, b, i) => s + b * w[i], 0);
  const sixY = sum(SIX_Y), twoT3 = sum(TWO_T3), threeQ = sum(THREE_Q);
  const anti = n3 % 2 === 0, cb = anti ? bits.map((b) => 1 - b) : bits;
  const base = baseName(cb[0] + cb[1] + cb[2], cb[3] + cb[4], cb[3]);
  const multiplet = (anti ? 'anti-' : '') + MULTIPLET_OF[base];
  let colour = null, colourIndex = null;
  if (n3 === 1) { colourIndex = bits.indexOf(1) + 1; colour = COLOURS[colourIndex - 1]; }
  if (n3 === 2) { colourIndex = bits.slice(0, 3).indexOf(0) + 1; colour = 'anti-' + COLOURS[colourIndex - 1]; }
  const threeB = n3 === 1 ? 1 : n3 === 2 ? -1 : 0, lep = n3 === 3 ? 1 : n3 === 0 ? -1 : 0;
  const currents = [];
  for (const [i, j] of [[0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1]]) {
    if (bits[j] && !bits[i]) currents.push({ boson: 'g', move: `${LEVELS[j]}>${LEVELS[i]}`, to: mask ^ (1 << i) ^ (1 << j) });
  }
  if (bits[4] && !bits[3]) currents.push({ boson: 'W+', move: 's2>s1', to: mask ^ 24 });
  if (bits[3] && !bits[4]) currents.push({ boson: 'W-', move: 's1>s2', to: mask ^ 24 });
  const toggles = [[3, 'H+', 'H-'], [4, 'H0', 'H0bar']].map(([lev, add, rem]) => (
    { register: bits[lev] ? rem : add, level: LEVELS[lev], adds: !bits[lev], to: mask ^ (1 << lev) }));
  const Y = frac(sixY, 6);
  return (CACHE[mask] = {
    mask, bits: bits.join(''), occupied: LEVELS.filter((_, i) => bits[i]), n3, n2, degree, six_Y: sixY, Y, T3: frac(twoT3, 2),
    Q: frac(threeQ, 3), k: ((sixY % 6) + 6) % 6, su3: SU3[n3], su2: SU2[n2], rep: `(${SU3[n3]},${SU2[n2]})_${Y}`,
    name: (anti ? 'anti-' : '') + base, base, anti, multiplet, species: base.split('_')[0],
    left_handed_name: LEFT_NAME[multiplet] || null, weyl: degree % 2 === 0 ? 'L' : 'R', half: degree % 2 === 0 ? '16' : '16bar',
    colour, colour_index: colourIndex, B: frac(threeB, 3), L: frac(lep), B_minus_L: frac(threeB - 3 * lep, 3),
    statistics: 'fermion', spin: '1/2', ab_sixths: [0, 1, 2, 3, 4, 5].map((f) => (((f * sixY) % 6) + 6) % 6),
    complement: 31 - mask, copies: copiesOf(base, anti), currents, toggles,
    num: { sixY, twoT3, threeQ, threeB, lep },          // integers for sums; not part of the data file
  });
}
// the exact identities the decoder rests on, recomputed in integers (used by the check script)
export function identities() {
  const P = Array.from({ length: 32 }, (_, m) => decode(m));
  const half = (h) => P.filter((p) => p.half === h);
  const an = (rows) => ({
    sum_6Y: rows.reduce((s, p) => s + p.num.sixY, 0),
    sum_6Y_cubed: rows.reduce((s, p) => s + p.num.sixY ** 3, 0),
    SU2_squared_U1: rows.filter((p) => p.n2 === 1).reduce((s, p) => s + p.num.sixY, 0),
    SU3_squared_U1: rows.filter((p) => p.n3 === 1 || p.n3 === 2).reduce((s, p) => s + p.num.sixY, 0),
    SU3_cubed: rows.reduce((s, p) => s + (p.n3 === 1 ? 1 : p.n3 === 2 ? -1 : 0), 0),
  });
  return {
    class_rule: P.every((p) => p.k === (((3 * (p.n2 % 2) - 2 * (p.n3 % 3)) % 6) + 6) % 6),
    Q_is_T3_plus_Y: P.every((p) => 2 * p.num.threeQ === 3 * p.num.twoT3 + p.num.sixY),
    kernel: P.every((p) => (2 * p.n3 + 3 * p.n2 + p.num.sixY) % 6 === 0),
    multiplicities: [0, 1, 2, 3, 4, 5].map((k) => P.filter((p) => p.k === k).length),
    anomalies_16: an(half('16')), anomalies_16bar: an(half('16bar')),
    complement_is_conjugate: P.every((p) => { const c = decode(p.complement); return c.num.sixY === -p.num.sixY && c.num.twoT3 === -p.num.twoT3 && c.num.threeQ === -p.num.threeQ && c.num.threeB === -p.num.threeB && c.num.lep === -p.num.lep && c.k === (6 - p.k) % 6 && c.half !== p.half && c.base === p.base && c.anti !== p.anti; }),
    B_minus_L: P.every((p) => p.num.threeB - 3 * p.num.lep === 3 - 2 * p.n3),
    currents: P.reduce((s, p) => s + p.currents.length, 0), toggles: P.reduce((s, p) => s + p.toggles.filter((t) => t.adds).length, 0),
  };
}

// ---------------------------------------------------------------- engine: sets of quanta
const ORDER = 'udscbt';
const FQ3 = { u: 2, c: 2, t: 2, d: -1, s: -1, b: -1 };       // three times the charge of a quark flavour
const SUP = { 2: '⁺⁺', 1: '⁺', 0: '⁰', '-1': '⁻', '-2': '⁻⁻' };
const BAR = '\u0304';       // combining macron: the bar of an antiparticle name
const MESON = { ud: 'π⁺', du: 'π⁻', us: 'K⁺', su: 'K⁻', ds: 'K⁰', sd: 'K' + BAR + '⁰', cu: 'D⁰', uc: 'D' + BAR + '⁰', cd: 'D⁺', dc: 'D⁻', cs: 'D_s⁺', sc: 'D_s⁻',
  ub: 'B⁺', bu: 'B⁻', db: 'B⁰', bd: 'B' + BAR + '⁰', sb: 'B_s⁰', bs: 'B' + BAR + '_s⁰', cb: 'B_c⁺', bc: 'B_c⁻' };
const NEUTRAL = { u: ['π⁰', 'η', 'η′'], d: ['π⁰', 'η', 'η′'], s: ['η', 'η′'], c: ['η_c'], b: ['η_b'] };
// names of the lowest states by flavour content: names of the quark model, naming scheme of the Particle Data Group
export function mesonNames(q, aq) {
  if (q === 't' || aq === 't') return [];
  return q === aq ? NEUTRAL[q] : [MESON[q + aq]];
}
export function baryonNames(flavours, anti = false) {
  const fl = [...flavours].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  if (fl.includes('t')) return { spin_1_2: [], spin_3_2: [] };
  const charge = fl.reduce((s, f) => s + FQ3[f], 0) / 3 * (anti ? -1 : 1), sup = SUP[charge];
  const light = fl.filter((f) => f === 'u' || f === 'd'), rest = fl.filter((f) => f !== 'u' && f !== 'd');
  const heavy = rest.filter((f) => f === 'c' || f === 'b').join(''), sub = heavy ? '_' + heavy : '';
  const distinct = new Set(fl).size, bar = anti ? BAR : '';
  const nm = (letter, { star = false, prime = false, show = true } = {}) => letter + bar + (prime ? '′' : '') + sub + (star ? '*' : '') + (show ? sup : '');
  if (light.length === 3) return { spin_1_2: distinct === 1 ? [] : [(Math.abs(charge) === 1 ? 'p' : 'n') + bar], spin_3_2: [nm('Δ')] };
  if (light.length === 2) {
    if (light[0] === light[1]) return { spin_1_2: [nm('Σ')], spin_3_2: [nm('Σ', { star: true })] };
    return { spin_1_2: [nm('Λ', { show: !!sub }), nm('Σ')], spin_3_2: [nm('Σ', { star: true })] };
  }
  if (light.length === 1) {
    if (rest[0] === rest[1]) return { spin_1_2: [nm('Ξ')], spin_3_2: [nm('Ξ', { star: true })] };
    return { spin_1_2: [nm('Ξ'), nm('Ξ', { prime: true })], spin_3_2: [nm('Ξ', { star: true })] };
  }
  if (distinct === 1) return { spin_1_2: [], spin_3_2: [nm('Ω')] };
  if (distinct === 2) return { spin_1_2: [nm('Ω')], spin_3_2: [nm('Ω', { star: true })] };
  return { spin_1_2: [nm('Ω'), nm('Ω', { prime: true })], spin_3_2: [nm('Ω', { star: true })] };
}
// a quark quantum of the builder: flavour, antiparticle or not, handedness of the quark, colour level 0..2
export function quarkMask(flavour, anti, hand, colour) {
  const up = 'uct'.includes(flavour);
  const q = (1 << colour) | (up ? (hand === 'L' ? 8 : 24) : (hand === 'L' ? 16 : 0));
  return anti ? 31 - q : q;
}
export const flavourCopy = (flavour) => Math.max('uct'.indexOf(flavour), 'dsb'.indexOf(flavour));
// a set of two or three quanta, each { mask, copy }: colour singlet component, class sum, charges, name
export function composite(quanta) {
  const rows = quanta.map((q) => decode(q.mask));
  const occupation = [0, 1, 2].map((i) => rows.reduce((s, p) => s + ((p.mask >> i) & 1), 0));
  const singlet = occupation[0] === occupation[1] && occupation[1] === occupation[2];
  const classSum = rows.reduce((s, p) => s + p.k, 0) % 6;
  const tot = (key) => rows.reduce((s, p) => s + p.num[key], 0);
  const quarks = rows.filter((p) => p.n3 === 1).length, antiquarks = rows.filter((p) => p.n3 === 2).length, n = rows.length;
  const fl = rows.map((p, i) => p.copies[quanta[i].copy || 0].flavour);
  let kind = 'other', names = { spin_0: [], spin_1_2: [], spin_3_2: [] }, content = '';
  if (n === 2 && quarks === 1 && antiquarks === 1) {
    kind = 'meson'; const qi = rows[0].n3 === 1 ? 0 : 1;
    names.spin_0 = mesonNames(fl[qi], fl[1 - qi]); content = fl[qi] + ' ' + fl[1 - qi] + BAR;
  } else if (n === 3 && (quarks === 3 || antiquarks === 3)) {
    kind = quarks === 3 ? 'baryon' : 'antibaryon';
    const sorted = [...fl].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
    Object.assign(names, baryonNames(sorted, kind === 'antibaryon')); content = sorted.map((f) => f + (kind === 'antibaryon' ? BAR : '')).join(' ');
  }
  return {
    quanta: n, occupation, singlet, class_sum: classSum, class_neutral: classSum === 0, doublets: rows.filter((p) => p.n2 === 1).length,
    Q: frac(tot('threeQ'), 3), B: frac(tot('threeB'), 3), L: frac(tot('lep')), kind, content, names,
    statistics: n % 2 ? 'fermion' : 'boson',
  };
}
// split a class-neutral carrier content into neutral parts of at most three members, largest number of parts first
export function decompose(content) {
  const c = [...content].sort((a, b) => a - b);
  if (!c.length) return [];
  const first = c[0], rest = c.slice(1); let best = null;
  const cmpT = (x, y) => { for (let i = 0; i < Math.min(x.length, y.length); i++) if (x[i] !== y[i]) return x[i] - y[i]; return x.length - y.length; };
  const cmp = (a, b) => { for (let i = 0; i < Math.min(a.length, b.length); i++) { const d = cmpT(a[i], b[i]); if (d) return d; } return a.length - b.length; };
  const pick = (idx) => {
    const part = [first, ...idx.map((i) => rest[i])].sort((a, b) => a - b);
    if (part.reduce((s, x) => s + x, 0) % 6) return;
    const tail = decompose(rest.filter((_, i) => !idx.includes(i)));
    if (tail === null) return;
    const cand = [part, ...tail].sort(cmpT);
    if (!best || cand.length > best.length || (cand.length === best.length && cmp(cand, best) < 0)) best = cand;
  };
  for (let i = 0; i < rest.length; i++) { pick([i]); for (let j = i + 1; j < rest.length; j++) pick([i, j]); }
  return best;
}
export const setLabel = (s) => '{' + s.join(',') + '}';

// ---------------------------------------------------------------- page
const FALLBACK = { 0: { color: '#9fb0cf', shape: 'flat' }, 1: { color: '#ff7a45', shape: 'disc' }, 2: { color: '#ffb347', shape: 'ring' },
  3: { color: '#3ee6a8', rim: '#4cc3ff', shape: 'duo' }, 4: { color: '#ffb347', shape: 'disc' }, 5: { color: '#ff7a45', shape: 'ring' } };
const LEVEL_COLOR = ['#ff6480', '#5fe3a1', '#6fb1ff', '#a995ff', '#a995ff'];
const CERT_URL = 'model/defect_particle_classes/PROOF.md';
const ST = { mask: 9, copy: 0, set: [], pick: 0, hand: 'L', data: null, C: FALLBACK, host: null };
const el = (id) => ST.host.querySelector(id);
const sgn = (s) => (s.startsWith('-') ? '−' + s.slice(1) : s === '0' ? '0' : '+' + s);
const nameHtml = (n) => n.replace(/_([a-z]+)/g, '<sub>$1</sub>');
// a bar over a whole symbol: the antiparticle of what stands under it; the bar sits lower over letters without ascender
const bar = (html) => `<span class="dc-bar${/^[ucsνeμτ]/.test(html) ? ' lo' : ''}">${html}</span>`;
const REP = { 1: '1', 3: '3', '3b': bar('3'), 2: '2' };
// status chip (derived, one premise, declared, open) and the header row of a card: kicker left, status or note right
const chip = (status) => `<span class="dc-st ${status === 'one premise' ? 'premise' : status}">${status}</span>`;
const head = (title, right = '', cls = '') => `<div class="dc-kr"><div class="dc-k${cls ? ' ' + cls : ''}">${title}</div>${right}</div>`;

function symHtml(p, copy) {
  const c = p.copies[copy], inner = `${c.sym}<sub>${c.sub}${p.base.slice(-1)}</sub>`;
  return (p.anti ? bar(inner) : inner) + (c.sup ? `<sup>${c.sup}</sup>` : '');
}
function colourDot(p, size = 12) {
  if (!p.colour_index) return '';
  const col = LEVEL_COLOR[p.colour_index - 1];
  return `<i class="dc-cdot${p.n3 === 2 ? ' anti' : ''}" style="--c:${col};width:${size}px;height:${size}px" title="${p.colour}"></i>`;
}
function nodeBody(k, r) {
  const C = ST.C[k];
  if (C.shape === 'ring') return `<circle r="${r * 0.8}" fill="none" stroke="${C.color}" stroke-width="${r * 0.3}"/>`;
  if (C.shape === 'duo') return `<circle r="${r * 0.56}" fill="${C.color}"/><circle r="${r * 0.94}" fill="none" stroke="${C.rim}" stroke-width="${r * 0.15}"/>`;
  if (C.shape === 'flat') return `<circle r="${r}" fill="rgba(159,176,207,.05)" stroke="${C.color}" stroke-opacity=".75" stroke-width="1.4" stroke-dasharray="3 4"/>`;
  return `<circle r="${r}" fill="${C.color}"/>`;
}
function miniClass(k, size = 20) {
  const h = size / 2, C = ST.C[k], dark = C.shape === 'disc';
  return `<svg class="dc-mini" width="${size}" height="${size}" viewBox="${-h} ${-h} ${size} ${size}">${nodeBody(k, h * 0.82)}<text y="${size * 0.17}" text-anchor="middle" font-size="${size * 0.46}" font-weight="700" fill="${dark || C.shape === 'duo' ? '#08101e' : C.color}">${k}</text></svg>`;
}

// ---- the five levels: the colour block on the left edge of the card, the weak block on the right edge
function levelsSvg() {
  const p = decode(ST.mask);
  const slot = (i, x, y) => {
    const on = p.bits[i] === '1', c = LEVEL_COLOR[i];
    return `<g class="dc-lev${on ? ' on' : ''}" data-i="${i}" style="--c:${c}" tabindex="0" role="button" aria-pressed="${on}" aria-label="level ${LEVELS[i]}">
      <rect x="${x + 0.6}" y="${y + 0.6}" width="158.8" height="35" rx="17.5"/>
      <circle class="dc-ball" cx="${x + 141}" cy="${y + 18}" r="9"/>
      <text class="dc-lid" x="${x + 16}" y="${y + 22}">${LEVELS[i]}</text>
      <text class="dc-lq" x="${x + 122}" y="${y + 21.5}" text-anchor="end">${i < 3 ? '−2' : '+3'}</text></g>`;
  };
  return `<div class="dc-lvh"><span>colour levels</span><span>weak levels</span></div>
    <svg class="dc-levels" viewBox="0 0 340 129" role="group" aria-label="the five levels">${[0, 1, 2].map((i) => slot(i, 0, 46 * i)).join('')}${[3, 4].map((i) => slot(i, 180, 23 + 46 * (i - 3))).join('')}</svg>`;
}
// ---- the 32 patterns in their 12 blocks: columns n3 = 0..3, rows n2 = 0..2
function gridHtml() {
  let h = '';
  for (let n2 = 0; n2 < 3; n2++) for (let n3 = 0; n3 < 4; n3++) {
    const rows = []; for (let m = 0; m < 32; m++) { const p = decode(m); if (p.n3 === n3 && p.n2 === n2) rows.push(p); }
    const k = rows[0].k, C = ST.C[k], lab = rows[0].multiplet.replace('anti-', '').replace('nu', 'ν').replace(/_([LR])/, '<sub>$1</sub>');
    h += `<div class="dc-cell" style="--c:${C.color}"><div class="dc-dots n${Math.min(rows.length, 3)}">${rows.map((p) => `<button class="dc-dot${p.anti ? ' anti' : ''}${p.mask === ST.mask ? ' on' : ''}${p.mask === 31 - ST.mask ? ' conj' : ''}" data-m="${p.mask}" title="${p.name} ${p.bits}" aria-label="${p.name} ${p.bits}"></button>`).join('')}</div>
      <span>${rows[0].anti ? bar(lab) : lab}</span></div>`;
  }
  return h;
}
// ---- the particle
const BOS = { g: 'g', 'W+': 'W<sup>+</sup>', 'W-': 'W<sup>−</sup>', 'H+': 'H<sup>+</sup>', 'H-': 'H<sup>−</sup>', H0: 'H<sup>0</sup>', H0bar: bar('H') + '<sup>0</sup>' };
function particleHtml() {
  const p = decode(ST.mask), c = p.copies[ST.copy], C = ST.C[p.k];
  const tile = (label, v, cls = '') => `<div class="dc-tile ${cls}"><b>${v}</b><span>${label}</span></div>`;
  const target = (m) => `<span>${symHtml(decode(m), ST.copy)}</span>` + colourDot(decode(m), 9);
  const moves = [...p.currents.map((m) => `<button class="dc-move" data-m="${m.to}" title="current ${m.move.replace('>', ' to ')}"><em>${BOS[m.boson]}</em>${target(m.to)}</button>`),
    ...p.toggles.map((t) => `<button class="dc-move reg" data-m="${t.to}" title="register ${t.adds ? 'adds' : 'removes'} ${t.level}"><em>${BOS[t.register]}</em>${target(t.to)}</button>`)].join('');
  return `${head('particle', chip('derived'), 'dc-kp')}
    <div class="dc-sym" style="--c:${C.color}"><span>${symHtml(p, ST.copy)}</span>${colourDot(p, 15)}</div>
    <div class="dc-name">${c.long}</div>
    <div class="dc-tags"><span class="dc-tag">(${REP[p.su3]}, ${REP[p.su2]})<sub>${p.Y.replace('-', '−')}</sub></span><span class="dc-tag ${p.half === '16' ? 'a' : 'b'}">${p.half === '16' ? '16' : bar('16')}</span><span class="dc-tag">${p.weyl === 'L' ? 'left' : 'right'}-handed field</span><span class="dc-tag">fermion · spin ½</span>${p.colour ? `<span class="dc-tag">${p.colour}</span>` : ''}</div>
    <div class="dc-k dc-k2 dc-kc">charges</div>
    <div class="dc-nums">${tile('Q', sgn(p.Q), 'big')}${tile('T<sub>3</sub>', sgn(p.T3))}${tile('Y', sgn(p.Y))}${tile('6Y', sgn(String(p.six_Y)))}${tile('B', sgn(p.B))}${tile('L', sgn(p.L))}${tile('B − L', sgn(p.B_minus_L))}</div>
    <div class="dc-k dc-k2 dc-km">currents and Higgs register</div><div class="dc-moves">${moves}</div>`;
}
// ---- the wheel: the class of the pattern, and the phase it picks up around a defect of each class
function wheelSvg() {
  const p = decode(ST.mask), N = 420, c = N / 2, R = 104, RD = 168, C = ST.C[p.k];
  const at = (k, r) => { const a = -Math.PI / 2 + k * Math.PI / 3; return [c + r * Math.cos(a), c + r * Math.sin(a)]; };
  const TURN = ['0', '1/6', '1/3', '1/2', '2/3', '5/6'];
  let s = `<svg class="dc-wheel" viewBox="34 74 352 346" role="img" aria-label="class ${p.k} on the wheel of six classes">
    <defs><filter id="dcGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="rgba(140,170,230,.18)" stroke-dasharray="1.5 7"/>
    <polygon points="${[0, 1, 2, 3, 4, 5].map((k) => at(k, R).map((v) => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="rgba(140,170,230,.1)"/>`;
  const [px, py] = at(p.k, R - 27), [qx, qy] = at(p.k, 54);       // a short pointer outside the centre text
  s += `<line class="dc-hand" x1="${qx.toFixed(1)}" y1="${qy.toFixed(1)}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="${C.color}"/>
    <text x="${c}" y="${c - 20}" text-anchor="middle" class="dc-wc">class</text>
    <text x="${c}" y="${c + 22}" text-anchor="middle" class="dc-wk" fill="${C.color}">${p.k}</text>
    <text x="${c}" y="${c + 42}" text-anchor="middle" class="dc-wc">6Y = ${String(p.six_Y).replace('-', '−')}</text>`;
  for (let f = 0; f < 6; f++) {
    const [x, y] = at(f, R), [dx, dy] = at(f, RD), Cf = ST.C[f], own = f === p.k, t = p.ab_sixths[f], seen = t !== 0;
    const dark = Cf.shape === 'disc';
    s += `<g class="dc-node${own ? ' own' : ''}${seen ? '' : ' blind'}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      ${own ? `<circle r="31" fill="${Cf.color}" opacity=".16"/><circle r="27" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/>` : ''}
      <g ${own ? 'filter="url(#dcGlow)"' : ''}>${nodeBody(f, 19)}</g>
      <text y="5" text-anchor="middle" font-size="14" font-weight="700" fill="${dark || Cf.shape === 'duo' ? '#08101e' : Cf.color}">${f}</text></g>`;
    if (f === 0) continue;
    // the phase dial: a hand at t sixths of a turn, clockwise from the top
    const a = -Math.PI / 2 + t * Math.PI / 3, r = 15, hx = r * Math.cos(a), hy = r * Math.sin(a);
    const arc = t ? `<path d="M0 ${-r} A${r} ${r} 0 ${t > 3 ? 1 : 0} 1 ${hx.toFixed(2)} ${hy.toFixed(2)}" fill="none" stroke="${Cf.color}" stroke-width="3" stroke-linecap="round"/>` : '';
    s += `<g class="dc-dial${seen ? '' : ' blind'}" transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)})">
      <circle r="${r}" fill="rgba(8,12,22,.9)" stroke="rgba(160,178,210,.28)"/>${arc}
      <line x1="0" y1="0" x2="${hx.toFixed(2)}" y2="${hy.toFixed(2)}" stroke="${seen ? '#fff' : 'rgba(160,178,210,.5)'}" stroke-width="1.6" stroke-linecap="round"/><circle r="1.8" fill="#fff"/>
      <text y="${dy > c ? 30 : -21}" text-anchor="middle" class="dc-turn">${TURN[t]}</text></g>`;
  }
  return s + '</svg>';
}
function wheelRead() {
  const p = decode(ST.mask), seen = [1, 2, 3, 4, 5].filter((f) => p.ab_sixths[f]);
  if (!seen.length) return 'class 0 · no defect turns its phase';
  const blind = [1, 2, 3, 4, 5].filter((f) => !p.ab_sixths[f]);
  return `class ${p.k} · phase turned by defect classes ${seen.join(', ')}${blind.length ? ' · unturned by ' + blind.join(', ') : ''}`;
}

// ---- composite builder
function quantumOf(q) { return { mask: quarkMask(q.flavour, q.anti, q.hand, q.colour), copy: flavourCopy(q.flavour) }; }
function addQuark(flavour, anti) {
  if (ST.set.length >= 3) ST.set.shift();
  const used = ST.set.filter((q) => q.anti === anti && q.kind !== 'pattern').map((q) => q.colour);
  let colour = [0, 1, 2].find((i) => !used.includes(i)); if (colour === undefined) colour = 0;
  if (anti) { const open = ST.set.filter((q) => !q.anti && q.kind !== 'pattern' && !ST.set.some((a) => a.anti && a.colour === q.colour)); if (open.length) colour = open[0].colour; }
  else { const open = ST.set.filter((q) => q.anti && q.kind !== 'pattern' && !ST.set.some((a) => !a.anti && a.kind !== 'pattern' && a.colour === q.colour)); if (open.length && ST.set.length < 2) colour = open[0].colour; }
  ST.set.push({ flavour, anti, hand: ST.hand, colour });
}
const PRESETS = { 'π⁺': [['u', 0, 'L', 0], ['d', 1, 'L', 0]], 'K⁰': [['d', 0, 'R', 1], ['s', 1, 'R', 1]], p: [['u', 0, 'L', 0], ['u', 0, 'L', 1], ['d', 0, 'R', 2]],
  n: [['u', 0, 'R', 0], ['d', 0, 'R', 1], ['d', 0, 'R', 2]], Λ: [['u', 0, 'L', 0], ['d', 0, 'L', 1], ['s', 0, 'R', 2]], 'Ω⁻': [['s', 0, 'R', 0], ['s', 0, 'R', 1], ['s', 0, 'R', 2]],
  'class 3': [['u', 0, 'L', 0], ['d', 1, 'R', 0]] };
function setQuanta() { return ST.set.map((q) => (q.kind === 'pattern' ? { mask: q.mask, copy: q.copy } : quantumOf(q))); }
function builderHtml() {
  const quanta = setQuanta(), r = quanta.length >= 2 ? composite(quanta) : null;
  const slots = [0, 1, 2].map((i) => {
    const q = ST.set[i]; if (!q) return '<div class="dc-slot empty"><span>+</span></div>';
    const p = decode(quanta[i].mask);
    return `<div class="dc-slot" style="--c:${ST.C[p.k].color}"><button class="dc-x" data-rm="${i}" title="remove" aria-label="remove">×</button>
      <div class="dc-qsym">${symHtml(p, quanta[i].copy)}</div>
      <div class="dc-qctl">${q.kind === 'pattern' ? `<span class="dc-qp">${p.bits}</span>` : `<button data-hand="${i}" title="handedness of the quark">${q.hand}</button><button class="dc-cbtn" data-col="${i}" title="colour level" aria-label="colour level">${colourDot(p, 11)}</button>`}${miniClass(p.k, 18)}</div></div>`;
  }).join('');
  let out = '<div class="dc-res idle">choose two or three quanta</div>';
  if (r) {
    const all = [...r.names.spin_0, ...r.names.spin_1_2, ...r.names.spin_3_2];
    const named = r.singlet && all.length;
    const title = named ? all.map(nameHtml).join(' <i>·</i> ') : r.singlet ? (r.kind === 'other' ? 'no hadron' : 'no entry') : 'no colour singlet';
    const spins = r.kind === 'meson' ? 'spin 0' : [r.names.spin_1_2.length ? 'spin ½: ' + r.names.spin_1_2.map(nameHtml).join(', ') : '', r.names.spin_3_2.length ? 'spin 3⁄2: ' + r.names.spin_3_2.map(nameHtml).join(', ') : ''].filter(Boolean).join(' · ');
    const mx = Math.max(1, ...r.occupation);
    out = `<div class="dc-res${r.singlet ? (r.class_neutral ? ' ok' : ' half') : ' no'}">
      <div class="dc-rname">${title}</div>
      <div class="dc-rsub">${named ? `${r.kind}${r.content ? ' · ' + r.content : ''}${spins ? ' · ' + spins : ''}` : r.singlet ? 'a colour singlet outside the names of the quark model' : 'the colour levels are not equally occupied'}</div>
      <div class="dc-flags">
        <div class="dc-flag ${r.singlet ? 'y' : 'n'}"><span class="dc-occ">${r.occupation.map((o, i) => `<i style="--c:${LEVEL_COLOR[i]};height:${4 + 14 * o / mx}px"></i>`).join('')}</span><b>${r.singlet ? 'colour singlet' : 'coloured'}</b></div>
        <div class="dc-flag ${r.class_neutral ? 'y' : 'n'}">${miniClass(r.class_sum, 20)}<b>${r.class_neutral ? 'class neutral' : 'class sum ' + r.class_sum}</b></div>
        <div class="dc-flag"><b>Q ${sgn(r.Q)}</b></div><div class="dc-flag"><b>B ${sgn(r.B)}</b></div><div class="dc-flag"><b>${r.statistics}</b></div>
      </div></div>`;
  }
  const fb = (f, anti) => `<button class="dc-fb${anti ? ' anti' : ''}" data-f="${f}" data-anti="${anti ? 1 : 0}" aria-label="${anti ? 'antiquark ' : 'quark '}${f}">${anti ? bar(f) : f}</button>`;
  return `${head('composite', '<span class="dc-meta">names of the quark model</span>')}
    <div class="dc-pal"><span class="dc-palrow">${[...ORDER].map((f) => fb(f, false)).join('')}</span><span class="dc-palrow">${[...ORDER].map((f) => fb(f, true)).join('')}</span>
      <span class="dc-palrow"><button class="dc-hsel${ST.hand === 'L' ? ' on' : ''}" data-h="L" title="the next quark is left-handed">L</button><button class="dc-hsel${ST.hand === 'R' ? ' on' : ''}" data-h="R" title="the next quark is right-handed">R</button><button class="dc-addp" title="add the pattern decoded above">+ pattern</button></span></div>
    <div class="dc-build"><div class="dc-slots">${slots}</div><div class="dc-arrow">→</div>${out}</div>
    <div class="dc-presets">${Object.keys(PRESETS).map((k) => `<button data-pre="${k}">${k}</button>`).join('')}<button data-pre="">clear</button></div>`;
}
// ---- bosons: the twelve currents as moves between levels (row: the level moved to, column: the level left),
// and the register. A lit cell is a move open to the decoded pattern.
function bosonsHtml() {
  const p = decode(ST.mask);
  const hd = (i) => `<span class="dc-mxh" style="--c:${LEVEL_COLOR[i]}">${LEVELS[i]}</span>`;
  const cell = (to, from) => {
    const colour = to < 3 && from < 3, weak = to >= 3 && from >= 3;
    if (!colour && !weak) return `<i class="dc-mx none" title="no current: a move from ${LEVELS[from]} to ${LEVELS[to]} would change 6Y by 5"></i>`;
    if (to === from) return `<i class="dc-mx diag${weak ? ' w' : ''}" title="diagonal: ${weak ? 'W3 and B' : 'two gluons and B'}"></i>`;
    const sym = colour ? '<span>g</span>' : to === 3 ? '<span>W<sup>+</sup></span>' : '<span>W<sup>−</sup></span>', what = `${colour ? 'gluon' : to === 3 ? 'W+' : 'W-'}: from ${LEVELS[from]} to ${LEVELS[to]}`;
    if (p.bits[from] === '1' && p.bits[to] === '0') return `<button class="dc-mx live${weak ? ' w' : ''}" data-m="${p.mask ^ (1 << to) ^ (1 << from)}" title="${what}, open to this pattern">${sym}</button>`;
    return `<i class="dc-mx${weak ? ' w' : ''}" title="${what}">${sym}</i>`;
  };
  let mx = '<span></span>' + [0, 1, 2, 3, 4].map(hd).join('');
  for (let to = 0; to < 5; to++) mx += hd(to) + [0, 1, 2, 3, 4].map((from) => cell(to, from)).join('');
  const g = (sym, q, k, n = 1) => `<div class="dc-bos" style="--c:${ST.C[k].color}"><b>${sym}${n > 1 ? `<small>×${n}</small>` : ''}</b><span>Q ${q}</span></div>`;
  return `${head('bosons')}
    <div class="dc-bosbody"><div class="dc-mxw" role="group" aria-label="moves between levels">${mx}</div>
      <div class="dc-bosside">
        <div class="dc-bh"><span>twelve currents · class 0</span>${chip('derived')}</div>
        <div class="dc-boswrap">${g('g', '0', 0, 8)}${g('W<sup>+</sup>', '+1', 0)}${g('W<sup>−</sup>', '−1', 0)}${g('W<sup>3</sup>', '0', 0)}${g('B', '0', 0)}</div>
        <div class="dc-bh"><span>Higgs register · class 3</span>${chip('declared')}</div>
        <div class="dc-boswrap">${g('H<sup>+</sup>', '+1', 3)}${g('H<sup>0</sup>', '0', 3)}</div>
      </div></div>
    <div class="dc-bnote">row: the level moved to · column: the level left · γ and Z mix W<sup>3</sup> and B</div>`;
}
// ---- the run's carrier contents
function runHtml() {
  const R = ST.data.run, max = Math.log(R.contents[0].carriers + 1);
  const glyphs = (set) => set.map((k) => miniClass(k, 19)).join('');
  const one = (set, n, i, cls = '') => `<button class="dc-chip${cls}${ST.pick === i ? ' on' : ''}" data-c="${i}" aria-label="content ${setLabel(set)}"><span class="dc-cg">${glyphs(set)}</span><b>${n.toLocaleString('en-US')}</b><i style="width:${Math.max(4, 100 * Math.log(n + 1) / max).toFixed(0)}%"></i></button>`;
  const early = R.primitives.filter((p) => !p.end_carriers);
  const items = [...R.contents.map((c) => ({ set: c.set, label: c.label, n: c.carriers, parts: c.parts, share: c.share_text })),
    ...early.map((p) => ({ set: p.set, label: p.label, n: 0, parts: [p.label], early: p }))];
  const cur = items[Math.min(ST.pick, items.length - 1)];
  const prim = (lab) => R.primitives.find((p) => p.label === lab);
  const F = (n) => n.replace('anti-', '¬').replace('nu', 'ν').replace(/_([LR])/, '<sub>$1</sub>').replace(/¬(.+)/, (m, x) => bar(x));
  const parts = [...new Set(cur.parts)].map((lab) => { const q = prim(lab); return `<div class="dc-part"><span class="dc-cg">${glyphs(q.set)}</span><div><b>${q.centre_classes_of}</b>
      <span>${q.vertex.join(', ')}${q.colour_epsilon ? ' (colour ε), no renormalizable vertex' : ''}: ${q.fields.slice(0, 4).map((f) => `<span class="dc-nb">${f.map(F).join(' ')}</span>`).join(' · ')}${q.fields.length > 4 ? ' · …' : ''}</span>${q.ss_note ? `<em>${q.ss_note}</em>` : ''}</div></div>`; }).join('');
  return `${head(`carrier contents of run ${R.run}`, `<span class="dc-meta">register of the run ${chip('declared')}</span>`)}
    <div class="dc-strip">${items.map((it, i) => one(it.set, it.n, i, it.early ? ' early' : '')).join('')}</div>
    <div class="dc-read"><div class="dc-rhead"><b>${cur.label}</b>${cur.early ? `absent at the end · peak ${cur.early.peak_carriers.toLocaleString('en-US')} carriers at depth ${cur.early.peak_depth}` : `${cur.n.toLocaleString('en-US')} carrier${cur.n === 1 ? '' : 's'} · ${cur.share} of the occupied`} · boson, integer spin${cur.parts.length > 1 ? ' · ' + cur.parts.join(' + ') : ''}</div>${parts}</div>
    <div class="dc-bnote">${R.occupied_carriers.toLocaleString('en-US')} of ${R.carriers.toLocaleString('en-US')} carriers hold defects at the end · ${R.distinct_contents_over_stored_cuts} contents over ${R.stored_cuts} stored cuts · every one class neutral</div>`;
}

// ---- rendering and events
function drawCode() {
  el('.dc-levbox').innerHTML = levelsSvg(); el('.dc-grid32').innerHTML = gridHtml();
  const p = decode(ST.mask);
  el('.dc-copy').innerHTML = p.copies.map((c, g) => `<button class="${g === ST.copy ? 'on' : ''}" data-g="${g}" aria-label="copy ${g + 1}: ${c.particle}">${c.bar ? bar(c.sym) : c.sym}${c.sub ? `<sub>${c.sub}</sub>` : ''}${c.sup ? `<sup>${c.sup}</sup>` : ''}</button>`).join('');
  el('.dc-bits').textContent = p.bits;
  el('.dc-particle').innerHTML = particleHtml();
  el('.dc-wsvg').innerHTML = wheelSvg(); el('.dc-wheel-read').textContent = wheelRead();
  el('.dc-bosons').innerHTML = bosonsHtml();
}
function drawAll() { drawCode(); el('.dc-builder').innerHTML = builderHtml(); el('.dc-run').innerHTML = runHtml(); }
function setMask(m) { ST.mask = m & 31; drawCode(); }
function onClick(e) {
  const t = (sel) => e.target.closest(sel);
  let b;
  if ((b = t('.dc-lev'))) return setMask(ST.mask ^ (1 << Number(b.dataset.i)));
  if ((b = t('.dc-dot')) || (b = t('.dc-move')) || (b = t('.dc-mx[data-m]'))) return setMask(Number(b.dataset.m));
  if ((b = t('.dc-copy button'))) { ST.copy = Number(b.dataset.g); return drawCode(); }
  if (t('.dc-conj')) return setMask(31 - ST.mask);
  if ((b = t('.dc-chip'))) { ST.pick = Number(b.dataset.c); el('.dc-run').innerHTML = runHtml(); return; }
  if ((b = t('.dc-fb'))) addQuark(b.dataset.f, b.dataset.anti === '1');
  else if ((b = t('.dc-hsel'))) ST.hand = b.dataset.h;
  else if (t('.dc-addp')) { if (ST.set.length >= 3) ST.set.shift(); ST.set.push({ kind: 'pattern', mask: ST.mask, copy: ST.copy }); }
  else if ((b = t('[data-rm]'))) ST.set.splice(Number(b.dataset.rm), 1);
  else if ((b = t('[data-hand]'))) { const q = ST.set[Number(b.dataset.hand)]; q.hand = q.hand === 'L' ? 'R' : 'L'; }
  else if ((b = t('[data-col]'))) { const q = ST.set[Number(b.dataset.col)]; q.colour = (q.colour + 1) % 3; }
  else if ((b = t('[data-pre]'))) ST.set = (PRESETS[b.dataset.pre] || []).map(([flavour, anti, hand, colour]) => ({ flavour, anti: !!anti, hand, colour }));
  else return;
  el('.dc-builder').innerHTML = builderHtml();
}

export async function mount(host) {
  ST.host = host;
  if (!document.getElementById('dc-css')) { const l = document.createElement('link'); l.id = 'dc-css'; l.rel = 'stylesheet'; l.href = 'style/decoder.css'; document.head.appendChild(l); }
  host.innerHTML = '<div class="dc-wrap"><div class="dc-head"><h2>Decoder</h2></div><div class="dc-load"></div></div>';
  const prog = await import('./progress.js').catch(() => null);
  if (prog) prog.busy(host.querySelector('.dc-load'), 'loading the decoder table');
  const [links, cls, math, data] = await Promise.all([
    import('./links.js'), import('./classes.js').catch(() => null), import('./math.js').catch(() => null),
    fetch('rl/PD/decoder.json').then((r) => (r.ok ? r.json() : null)).catch(() => null)]);
  if (cls && cls.CLASSES) ST.C = cls.CLASSES;
  ST.data = data;
  if (!data) { host.querySelector('.dc-load').textContent = 'The decoder table research/PD/decoder.json is missing.'; return; }
  ST.set = PRESETS.p.map(([flavour, anti, hand, colour]) => ({ flavour, anti: !!anti, hand, colour }));
  const rules = ['k = 6Y \\bmod 6', '6Y = 3n_2 - 2n_3', 'Q = T_3 + Y'];
  const rule = rules.map((r) => (math ? math.tex(r) : `<span>${r.replace('\\bmod', 'mod')}</span>`)).join('');
  // these links are added here until links.js lists them under one of the three keys
  const src = links.linkList(['classes', 'spin', 'gauge']);
  const extra = [['Certificate: defect classes are centre classes (61 exact checks)', links.RER + CERT_URL],
    ['Derivation: exact B − L, Dirac neutrinos', links.DER + 'reports/DG.md'], ['Derivation: 32 Weyl blocks per copy, three copies', links.DER + 'reports/CH_HYPERCHARGE.md']]
    .filter(([, u]) => !src.includes(u));
  const more = extra.length ? `<div class="src-links">${extra.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join('')}</div>` : '';
  host.innerHTML = `<div class="dc-wrap">
    <header class="dc-head"><h2>Decoder</h2><div class="dc-map">A quantum is a pattern on a carrier's port, and the defect class it sees is <span class="dc-nb">6Y mod 6.</span></div></header>
    <div class="dc-grid">
      <section class="dc-panel dc-code">${head('five-level code', '<span class="dc-bits" title="the pattern in the order v1 v2 v3 s1 s2"></span>')}<div class="dc-levbox"></div>
        <div class="dc-ctl"><span class="dc-copyw"><span class="dc-copy" role="group" aria-label="copy"></span>${chip('declared')}</span><span class="dc-conjw"><button class="dc-conj" title="fill the empty levels and empty the filled ones">conjugate</button></span></div>
        <div class="dc-k dc-gk">the 32 patterns</div><div class="dc-grid32"></div></section>
      <section class="dc-panel dc-particle"></section>
      <section class="dc-panel dc-wheelbox">${head('class and flux phases', chip('derived'), 'dc-kw')}<div class="dc-wsvg"></div><div class="dc-wheel-read"></div><div class="dc-rule">${rule}</div></section>
      <section class="dc-panel dc-builder"></section>
      <section class="dc-panel dc-bosons"></section>
      <section class="dc-panel dc-run"></section>
    </div>
    <footer class="dc-src">${src}${more}</footer></div>`;
  drawAll();
  host.addEventListener('click', onClick);
  host.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.dc-lev')) { e.preventDefault(); setMask(ST.mask ^ (1 << Number(e.target.closest('.dc-lev').dataset.i))); } });
  if (math) math.typeset(host);
}
