// The Map tab: every known particle beside the object of the model that matches it best by type, group and charge.
// A best guess by structure (repair-law/MAP.md, version 0), with the evidence from the runs and the open issues.
// Data: particle_map.json key defect_map (built by oph_defects/particle_table.py), the frozen reference bundle under /rl/,
// and the selected run read live: run.json and view/class_stats.json (loaded by app.js), view/early_universe.json, and the
// kinds census /rl/REFRESH/kinds.json (the X3 register on the last checkpoint of the current runs L6 and L7).
import { $, S, FAM, marker } from './app.js';
import { linkList, SRC, RER, DER } from './links.js';

// Source links. linkList keys of links.js where they fit; these further links are built from its bases and are left out
// where a key of links.js already lists the same address.
const XL = {
  cert: [['Certificate: defect classes are centre classes, statistics, flux costs (61 checks)', RER + 'model/defect_particle_classes/PROOF.md']],
  register: [['Certificate: the charged-lepton generation register (99 checks)', RER + 'model/lepton_register_round/PROOF.md']],
  scope: [['Proof: scope of the particle constructions', RER + 'model/particle_construction_scope/PROOF.md']],
  status: [['Status of every lane', DER + 'CONSOLIDATED_STATUS.md']],
};
const src = (keys = [], extra = []) => {
  const have = new Set(keys.flatMap((k) => (SRC[k] || []).map((x) => x[1]))), more = extra.flatMap((k) => XL[k]).filter(([, u]) => !have.has(u));
  return linkList(keys) + (more.length ? `<div class="src-links">${more.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join('')}</div>` : '');
};
const fmt = (v) => Number(v).toLocaleString('en-US');

const esc = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const COL = { quark: '#ff7a45', lepton: '#b197ff', neutrino: '#3fe0d0', gluon: '#ffcf5c', photon: '#7dd3fc', weak: '#f0abfc', higgs: '#ffe45c', dark: '#8f9bd6' };
// The source map of the theory session (repair-law/work/MAP/source_map.json, built by work/MAP/build_source_map.py):
// every fermion kind as a pattern of the five levels, left and right, with its properties.
let SM = null, BOS = null, MC = null, KINDS = null, EU = null, picked = 'u0';
const KEY = (f) => (f.symbol === 'ν' || /neutrino/.test(f.name) ? 'nu' : /lepton/.test(f.name) ? 'e' : f.symbol);
const TARGET = { u: ['2.16 MeV', '1.27 GeV', '172.6 GeV'], d: ['4.70 MeV', '93.5 MeV', '4.18 GeV'], nu: ['individual mass unknown', 'individual mass unknown', 'individual mass unknown'], e: ['0.511 MeV', '105.7 MeV', '1.777 GeV'] };
const NAME3 = { u: ['up', 'charm', 'top'], d: ['down', 'strange', 'bottom'], nu: ['electron neutrino', 'muon neutrino', 'tau neutrino'], e: ['electron', 'muon', 'tau'] };
const SYM3 = { u: ['u', 'c', 't'], d: ['d', 's', 'b'], nu: ['ν<sub>e</sub>', 'ν<sub>μ</sub>', 'ν<sub>τ</sub>'], e: ['e', 'μ', 'τ'] };
const ROW = { u: 2, d: 3, e: 4, nu: 5 }, GCOL = { u: COL.quark, d: COL.quark, e: COL.lepton, nu: COL.neutrino };
const FREE = { quarkL: 'about 10 carriers', quarkR: 'about 12 carriers', leptonL: 'about 123 carriers', leptonR: 'no limit' };
const ISSUES = [
  ['The catalogue belongs to the earlier rule', 'The defect classes were recorded under the committed integer rule with a declared register. Under the coherent law the protected objects have to be listed again.', 'theory worker X1'],
  ['Defects are fluxes, matter are charges', 'The objects with the family charges are the charged quanta. The catalogued defects are neutral under the gauge currents.', 'theory worker X2 scores the readings'],
  ['The register is too coarse', 'It records the charge modulo 6. It cannot tell up from down singlets, the lepton doublet from the Higgs, or copies.', 'theory worker X3: finer geometric register done; census on the current levels 6 and 7 above'],
  ['Nothing in the catalogue moves with a velocity', 'The frozen classes sit still. The mobile ones wander and annihilate. A charged quantum travels, and it can carry a defect as cargo.', 'theory worker R2 done; observer cards from the runs (running)'],
  ['Spin and statistics', 'Derived with three premises: quanta are fermions; defects, links and the Higgs register are bosons. The premises are a spin doublet per quantum, the Gauss law and antisymmetric occupation.', 'theory worker SS; certificate defect_particle_classes'],
  ['Three copies', 'For the charged leptons a generation register gives three characters of the face third-turn, with stated premises. Quarks and neutrinos have no such register yet. Four older candidates are listed above.', 'theory workers X4, T5; certificate lepton_register_round'],
  ['Force carriers and the Higgs are operators', 'They are not yet excitations that travel.', 'theory worker X5'],
  ['Mass', 'The law gives a massless family and a tower at the scale of the lattice. The flux background of the runs is a relic of the preparation.', 'theory workers R8, R6, T3, T5; this session executes'],
  ['Unit and comparison', 'One measured anchor, then a frozen comparison.', 'theory worker R7: protocol frozen'],
];
const boxes = (levels) => '<span class="mp-lv5">' + ['v1', 'v2', 'v3', 's1', 's2'].map((l) => `<i class="${l[0]}${levels.includes(l) ? ' on' : ''}${l === 's2' ? ' tog' : ''}" title="${l}${l === 's2' ? ': the level the mass step toggles' : ''}"></i>`).join('') + '</span>';
const cls = (k) => (k ? `<span class="mp-cls" title="register class ${k}">${marker(k, 15)}</span>` : '<span class="mp-cls flat" title="no register class: a flat face">∅</span>');
function fermiTile(f, g) {
  const k = KEY(f);
  return `<div class="mp-tile${g ? ' later' : ''}${picked === k + g ? ' sel' : ''}" data-k="${k}${g}" style="--c:${GCOL[k]};grid-column:${g + 2};grid-row:${ROW[k]}">
    <div class="mp-top"><span class="mp-sym">${SYM3[k][g]}</span><span class="mp-mass" title="measured value: a target, not an output">${TARGET[k][g]}</span></div>
    <div class="mp-name">${NAME3[k][g]} · charge ${esc(f.electric_charge)} · spin ½</div>
    <div class="mp-row"><em>left</em>${boxes(f.left.pattern.levels)}${cls(f.left.pattern.Q6_mod_6)}</div><div class="mp-row"><em>right</em>${boxes(f.right.pattern.levels)}${cls(f.right.pattern.Q6_mod_6)}</div>
    <div class="mp-tag">${g === 0 ? 'charges exact · mass open' : 'copy ' + (g + 1) + ' · carrier of the copy open'}</div></div>`;
}
function detail() {
  const k = picked.slice(0, -1), g = parseInt(picked.slice(-1)), f = SM.fermion_types.find((x) => KEY(x) === k); if (!f) return '';
  const L = f.left.pattern, R = f.right.pattern, quark = f.group === 'quark', tag = (t, c) => `<span class="cos-tag ${c}">${t}</span>`;
  const seen = (o) => Object.entries(o).filter(([, v]) => v !== '0').map(([c, v]) => `class ${c}: ${v} turn`).join(', ') || 'none';
  const rows = [
    ['Pattern, left-handed', `${boxes(L.levels)} ${L.levels.join(', ')} · ${L.colour}, weak ${L.weak}, 6Y = ${L.six_Y}, T3 = ${L.T3}`, tag('exact label', 'ok')],
    ['Pattern, right-handed', `${boxes(R.levels)} ${R.levels.join(', ')} · ${R.colour}, weak ${R.weak}, 6Y = ${R.six_Y}, T3 = ${R.T3}`, tag('exact label', 'ok')],
    ['Electric charge', esc(f.electric_charge) + ' for both', tag('exact label', 'ok')],
    ['Handedness', 'the candidate walk assigns opposite low-momentum Weyl blocks to the two pattern parities; full interacting Lorentz chirality requires its own proof', tag('candidate free walk', 'open')],
    ['Spin', 'one half: the cover of the frame group acts on a pointer doublet. The pointer is declared: the native doublet of the carrier is spent on the weak index', tag('exact at rest; pointer declared', 'open')],
    ['Statistics', 'fermion: the rotation by 2π gives −1 per quantum. Premises: a spin doublet per quantum, the Gauss law, antisymmetric occupation', tag('derived, three premises', 'ok')],
    ['Antiparticle', 'the complement pattern: ' + f.antiparticle_left.levels.join(', ') + ' and ' + f.antiparticle_right.levels.join(', '), tag('exact', 'ok')],
    ['Speed', 'the declared free walk has a common leading low-momentum cone. Its finite lattice is anisotropic: axis and diagonal packets do not have identical finite-step speeds', tag('finite walk; not a physical speed fit', 'open')],
    ['Flux classes it sees, left', seen(f.flux_seen_left) + ' · gets ' + FREE[quark ? 'quarkL' : 'leptonL'] + ' through the flux gas', tag('exact phases; path measured', 'ok')],
    ['Flux classes it sees, right', seen(f.flux_seen_right) + ' · gets ' + FREE[quark ? 'quarkR' : 'leptonR'] + ' through the flux gas', tag('exact phases; path measured', 'ok')],
    ['Magnetic factor', '2, with a declared link phase: in a uniform field the lowest level stays at the rest angle', tag('declared extension, executed', 'open')],
    ['Mass link', 'the toggle of the level s2 joins the left and the right pattern', tag('representation', 'open')],
    ['Copy', (g + 1) + ' of 3: which object carries the copy is open, best guess the band of three resolved along the axes of the fixed frame', tag('open', 'open')],
    ['Mass', 'target ' + TARGET[k][g] + '. This displayed free-walk member has zero rest phase without an added mass step; other native quantum constructions have positive source energy windows', tag('open', 'bad')],
    ['Lifetime and decays', 'needs the weak field as a link that moves', tag('open', 'open')],
  ];
  return `<div class="card"><div class="k" style="margin-top:0">${NAME3[k][g]} · everything the map says</div><table class="t" style="width:100%">${rows.map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table>${src(['gauge', 'spin'], ['cert'])}</div>`;
}
function hero() {
  const F = SM.fermion_types, B = SM.bosons, G = SM.generations;
  return `<div class="mp-grid5">
      <div class="mp-lab" style="grid-column:2;grid-row:1">copy 1</div><div class="mp-lab" style="grid-column:3;grid-row:1">copy 2</div><div class="mp-lab" style="grid-column:4;grid-row:1">copy 3</div>
      <div class="mp-side" style="grid-column:1;grid-row:2 / span 2"><span>quarks</span></div><div class="mp-side" style="grid-column:1;grid-row:4 / span 2"><span>leptons</span></div>
      ${F.map((f) => [0, 1, 2].map((g) => fermiTile(f, g)).join('')).join('')}
    </div>
    <div class="mp-key"><span>${boxes(['v1', 's1'])} five levels: three vector levels (colour) and two spinor levels (weak charge); filled is occupied</span><span><span class="mp-lv5"><i class="s tog"></i></span> the level s2: the mass step toggles it, which turns left into right</span><span>${cls(1)}${cls(4)}${cls(3)} register class of the run with the same charge</span><span><span class="mp-cls flat">∅</span> no class</span></div>
    <div class="note" style="margin:6px 0 10px">Which object carries the copy is open. Best guess: ${esc(G.candidates[0].label)}. The measured masses are targets, not outputs. Click a tile.</div>
    <div id="mp-detail">${detail()}</div>
    <h2 style="margin:26px 0 6px">Gauge and scalar operators: candidate particle roles</h2>
    <div class="mp-bosons">${B.map((b) => `<div class="mp-tile bose" style="--c:${/gluon/.test(b.name) ? COL.gluon : /photon/.test(b.name) ? COL.photon : /Higgs/i.test(b.name) ? COL.higgs : COL.weak}"><div class="mp-top"><span class="mp-sym" style="font-size:22px">${esc(b.name)}</span><span class="mp-mass">${b.count > 1 ? '× ' + b.count : ''}</span></div>
        <div class="mp-what">${esc(b.source)}</div><div class="mp-name">charge ${esc(b.charge)} · ${esc(b.colour)} · acts on ${esc(b.acts_on)}</div><div class="mp-tag">travels: ${esc(b.travelling_excitation)}</div><div class="mp-tag" style="color:#c5d0e6">mass: ${esc(b.mass)}</div></div>`).join('')}
      <div class="mp-tile bose" style="--c:${COL.dark}"><div class="mp-top"><span class="mp-sym" style="font-size:22px">dark part</span><span class="mp-mass">best guess</span></div><div class="mp-what">the flux pair that travels from carrier to carrier, or a quantum with a flux pair as cargo</div><div class="mp-name">no gauge charge · protected</div><div class="mp-tag">not in the standard list</div></div></div>
    <h2 style="margin:26px 0 6px">Which object is a copy: four candidates</h2>
    <p class="small" style="max-width:1100px;margin:0 0 8px">${esc(G.required)}. ${esc(G.public_theorem)}</p>
    <div class="mp-cands">${G.candidates.map((c, i) => `<div class="card"${i === 0 ? ' style="border-color:rgba(255,228,92,.5)"' : ''}><b>${esc(c.id)}${i === 0 ? ' · best guess' : ''}</b><p>${esc(c.label)}</p><span>${esc(c.status)}</span></div>`).join('')}</div>
    <div class="card" style="margin-top:12px;border-color:rgba(125,211,252,.5)"><b>G-e · the second index of the frame group on the ports</b> <span class="cos-tag ok">finite port structure</span>
      <p style="margin:6px 0 6px;font-size:13.5px">Fix one cubic frame. Its twelve rotations move the twelve ports one onto another without a fixed port, so the ports are the elements of that group. Then a second action exists that commutes with the rotations and that the seams do not respect. Fixing the frame creates a threefold label, and the seams split it with no free number. In the frame axes of the second index the seam matrix is</p>
      <div class="mono" style="font-size:13px;margin:0 0 6px 12px">[−1, 0, 0] · [0, −1, 2] · [0, 2, 1] &nbsp; with levels √5, −1, −√5</div>
      <p style="margin:0;font-size:13px;color:var(--soft)">One axis stays unmixed. The other two are turned by 31.7 degrees, with squared components 0.7236 and 0.2764. This is the owner’s suggestion that fixing the gauge can explain three copies, in exact form. Its weakness: the three levels differ by factors of order one, 0.3047, 0.4510 and 0.4962 per tick, where nature needs factors up to 3,500.</p>${src([], ['status'])}</div>
    ${BOS ? `<h2 style="margin:26px 0 6px">What it takes for a force carrier to travel</h2><table class="t" style="width:100%"><tr><th>carrier</th><th>as an excitation</th><th>mass</th><th>declared for it</th><th>native link alphabet can carry it</th></tr>${BOS.bosons.map((b) => `<tr><td><b>${esc(b.boson)}</b></td><td>${esc(b.excitation)}</td><td>${esc(b.mass)}</td><td class="small">${esc((b.declared || []).join('; '))}</td><td><span class="cos-tag ${b.native_alphabet_can_carry_it ? 'ok' : 'bad'}">${b.native_alphabet_can_carry_it ? 'yes' : 'no'}</span></td></tr>`).join('')}</table><div class="note">This table concerns the specified finite link alphabet. A gauge-generator count alone does not construct travelling bosons. An extended finite quantum carrier can instead be tested through its complete field records and controlled refinement; no infinite variable is required at a finite capacity.</div>${src(['gauge', 'fields'])}` : ''}
    <div class="note" style="margin-top:8px">Mixing: ${esc(G.mixing)}. ${esc(G.owner)}.</div>`;
}
// Names and readings of the four kinds of face: the class names of the site, and what each kind does in the selected run.
const KIND = {
  qd: ['left-handed quark class and its conjugate', 'the quark doublet Q and its antiparticles'],
  qs: ['right-handed quark class and its conjugate', 'u<sub>R</sub>, d<sub>R</sub> and their antiparticles'],
  ld: ['lepton doublet and Higgs class', 'the lepton doublet L, its conjugate and the Higgs doublet'],
  ls: ['class 0', 'right-handed leptons and the gauge fields'],
};
function kindFacts(id, F) {
  const p3 = (x) => (x === null ? '–' : x.toFixed(3)), mv = (k) => (100 * (F.cl(k).moved_fraction || 0)).toFixed(1), end = (k, w) => fmt((F.cl(k).ended || {})[w] || 0);
  const hl = F.KK && F.KK.decay_of_classes_1_5 ? `; the population halves every ${F.KK.decay_of_classes_1_5.half_life_sweeps.toFixed(0)} sweeps (run ${F.KK.run})` : '';
  if (id === 'qd') return [`${fmt(F.cl(1).ever)} and ${fmt(F.cl(5).ever)} identities on the screen over run ${F.name}; ${mv(1)} % and ${mv(5)} % of them moved`,
    `${p3(F.per(1) === null ? null : F.per(1) + F.per(5))} faces per carrier inside the carriers at the end, falling${hl}`,
    `ends by annihilation with its conjugate (${end(1, 'annihilation')}) or by fusion (${end(1, 'fusion')} and ${end(5, 'fusion')})`,
    'archived runs of 2026-11-10: every step was to the left of the local load flow for class 1 and to the right for class 5'];
  if (id === 'qs') return [`${p3(F.pairs24)} pairs per carrier at the end of run ${F.name}`, 'never alone: only in class-neutral groups, exact on a closed carrier',
    `frozen: ${mv(4)} % and ${mv(2)} % of the screen identities ever moved`, 'born as a pair, or when two of class 1 or two of class 5 fuse'];
  if (id === 'ld') return [`${p3(F.pairs33)} pairs per carrier at the end of run ${F.name}`, `frozen once made: ${mv(3)} % of the screen identities ever moved`,
    'its own conjugate: the lepton doublet and the Higgs doublet share this class', 'the flux itself is a boson'];
  return ['carries no register class: a flat face', 'invisible to the defect register', 'in the coherent model: the four patterns that see no flux of any class'];
}
function kindCard(k, maxPath, F) {
  const c = COL[k.group], marks = k.classes.map((x) => (x ? marker(x, 26) : '<span class="mp-flat">∅</span>')).join('');
  const fp = k.free_path, bar = k.id === 'ls' ? 100 : fp ? Math.max(3, 100 * fp / maxPath) : 0, [name, same] = KIND[k.id] || [k.name, k.guess];
  return `<div class="mp-kind" style="--c:${c}"><div class="mp-kind-head">${marks}<div><b>${name}</b><span>${k.classes[0] ? 'class ' + k.classes.join(' and ') + ' · ' + esc(k.name) : 'flat face, no flux'} · colour charge: ${k.colour} · weak charge: ${k.weak}</span></div></div>
    <div class="mp-guess">same centre class as: ${same}</div><ul>${kindFacts(k.id, F).map((r) => `<li>${r}</li>`).join('')}</ul>
    <div class="small" style="margin-bottom:5px;color:#7dd3fc">${esc(k.law || '')}</div><div class="mp-path"><div style="width:${bar}%"></div></div><div class="small">${k.id === 'ls' ? 'gets through the flux gas without limit' : fp ? 'gets about ' + fp.toFixed(0) + ' carriers through the flux gas' : 'path through the flux gas not loaded'}</div></div>`;
}
// The reaction types of the register beside the Standard Model vertex with the same classes (certificate
// model/defect_particle_classes, section 5). Counts are read from the selected run: view/class_stats.json, screen tier.
const REACTIONS = [
  ['1 + 5 -> 0', 'q<sub>L</sub> + q̄<sub>L</sub>', 'class 0', 'gauge current: a quark and an antiquark into a gluon, W or B'],
  ['1 + 1 -> 2', 'q<sub>L</sub> + q<sub>L</sub>', 'q̄<sub>R</sub>', 'three quark classes in a colour singlet; no renormalizable vertex'],
  ['1 + 4 -> 5', 'q<sub>L</sub> + q<sub>R</sub>', 'q̄<sub>L</sub>', 'the same, with one of each handedness'],
  ['1 + 2 -> 3', 'q<sub>L</sub> + q̄<sub>R</sub>', 'class 3', 'Yukawa: Q with d<sup>c</sup> or u<sup>c</sup> into the Higgs class'],
  ['1 + 3 -> 4', 'q<sub>L</sub> + class 3', 'q<sub>R</sub>', 'Yukawa: Q with the Higgs into u<sub>R</sub> or d<sub>R</sub>'],
  ['3 -> 1 + 2', 'class 3', 'q<sub>L</sub> + q̄<sub>R</sub>', 'the reverse of the fourth row'],
  ['2 -> 1 + 1', 'q̄<sub>R</sub>', 'q<sub>L</sub> + q<sub>L</sub>', 'the reverse of the second row'],
  ['3 + 3 -> 0', 'class 3 + class 3', 'class 0', 'Yukawa: L with the Higgs into e<sub>R</sub> or ν<sub>R</sub>; also the gauge currents of L and of H with their conjugates'],
];
// Each row: a pair of conjugate classes beside the multiplets of the same centre class. smShare: states of that class among
// the 28 states of one generation with a nonzero class (6, 6, 6, 6, 4). The run shares are read live.
const SMFAM = [
  { fam: 'A', cls: [1, 5], col: COL.quark, charges: 'colour and weak charge', run: 'moves; annihilates with its conjugate; fuses',
    sm: 'Left-handed quark class and its conjugate', gens: [['u<sub>L</sub>', 'd<sub>L</sub>'], ['c<sub>L</sub>', 's<sub>L</sub>'], ['t<sub>L</sub>', 'b<sub>L</sub>']], extra: 'three colours each, and their antiquarks in class 5', smShare: 21.4 },
  { fam: 'B', cls: [4, 2], col: '#ff5f7a', charges: 'colour charge only', run: 'frozen; only in class-neutral groups',
    sm: 'Right-handed quark class and its conjugate', gens: [['u<sub>R</sub>', 'd<sub>R</sub>'], ['c<sub>R</sub>', 's<sub>R</sub>'], ['t<sub>R</sub>', 'b<sub>R</sub>']], extra: 'three colours each, and their antiquarks in class 2', smShare: 21.4 },
  { fam: 'C', cls: [3], col: COL.lepton, charges: 'weak charge only', run: 'frozen pairs of class-3 bosons',
    sm: 'Lepton doublet and Higgs class', gens: [['ν<sub>eL</sub>', 'e<sub>L</sub>'], ['ν<sub>μL</sub>', 'μ<sub>L</sub>'], ['ν<sub>τL</sub>', 'τ<sub>L</sub>']], extra: 'and their antileptons; the Higgs doublet has the same class', smShare: 14.3 },
  { fam: '·', cls: [0], col: COL.neutrino, charges: 'no charge the register can see', run: 'leaves no defect',
    sm: 'Class 0: right-handed leptons and gauge fields', gens: [['ν<sub>eR</sub>', 'e<sub>R</sub>'], ['ν<sub>μR</sub>', 'μ<sub>R</sub>'], ['ν<sub>τR</sub>', 'τ<sub>R</sub>']], extra: 'and gluons, W and B', smShare: null },
];
// Reading of each carrier content. A content of pure fluxes is a boson (repair-law reports/SS.md; certificate section 7):
// {4,4,4} and {2,2,2} have the centre classes of three quarks and are no baryons; {3,3} is a pair of class-3 bosons.
const CONTENT = {
  '{2,4}': ['a class-2 flux with a class-4 flux', 'centre classes of a quark with an antiquark; a boson', 'quark'],
  '{1,5}': ['a class-1 flux with a class-5 flux', 'centre classes of a left-handed quark with its antiquark; still annihilating', 'quark'],
  '{3,3}': ['a pair of class-3 bosons', 'centre classes of a lepton with an antilepton, or of the Higgs with its conjugate', 'lepton'],
  '{2,2,4,4}': ['two colour pairs', 'two class-neutral pairs on one carrier', 'quark'],
  '{2,2,2}': ['three class-2 fluxes', 'centre classes of three antiquarks; a boson, not an antibaryon', 'gluon'],
  '{4,4,4}': ['three class-4 fluxes', 'centre classes of three quarks; a boson, not a baryon', 'gluon'],
  '{2,3,3,4}': ['a colour pair and a class-3 pair', 'two class-neutral groups on one carrier', 'lepton'],
  '{1,2,3}': ['mixed triple', 'the classes of the quark Yukawa vertex 1 + 2 → 3', 'weak'],
  '{3,4,5}': ['mixed triple', 'the classes of the conjugate vertex 4 + 5 → 3', 'weak'],
};
// The selected run, read live. Class shares and reactions: view/class_stats.json. End densities and event totals: run.json.
// Carrier contents: the kinds census of the run's last checkpoint (levels 6 and 7), or the run's view/early_universe.json.
const conserves = (ch) => { const [l, r] = ch.split('->').map((x) => x.split('+').reduce((a, t) => a + (parseInt(t) || 0), 0) % 6); return l === r; };
function runFacts() {
  const m = S.meta, g = m.geometry, tiers = (S.classStats && S.classStats.tiers) || {}, scr = tiers.screen || {};
  const cl = (k) => (scr.classes && (scr.classes[k] || scr.classes[String(k)])) || { ever: 0, alive_at_end: 0, moved_fraction: 0, ended: {} };
  const tot = [1, 2, 3, 4, 5].reduce((a, k) => a + cl(k).ever, 0) || 1;
  let events = 0, broken = 0;
  for (const t of Object.values(tiers)) for (const [c, v] of Object.entries(t.channels || {})) { events += v; if (!conserves(c)) broken += v; }
  const own = KINDS && KINDS.levels ? KINDS.levels[String(g.level)] : null, K = own && own.run === S.name ? own : null, KK = K || (KINDS && KINDS.levels ? KINDS.levels['6'] : null);
  const ci = m.end && m.end.counts_intra ? m.end.counts_intra : null, eu = EU && EU.run === S.name && EU.census ? EU.census : null;
  const comp = K ? K.compositions : eu ? Object.fromEntries(eu.contents.map((c) => [c.set, c.carriers])) : null;
  return { name: S.name, level: g.level, carriers: g.carriers, sweeps: m.sweeps, cl, share: (k) => cl(k).ever / tot, channels: scr.channels || {}, events, broken,
    per: (k) => (ci ? ci[k] / g.carriers : null), pairs24: ci ? (ci[2] + ci[4]) / 2 / g.carriers : null, pairs33: ci ? ci[3] / 2 / g.carriers : null,
    tracker: m.tracker_totals || {}, comp, occupied: K ? K.carriers_with_defects : eu ? eu.occupied_carriers : 0, K, KK };
}
function massCheckSection(F) {
  if (!MC) return '';
  const E = MC.readings['end of the level-10 run'], Lm = MC.readings['classes 1 and 5 gone (limit)'];
  const fmt = (mev) => (mev >= 1000 ? (mev / 1000).toPrecision(4) + ' GeV' : mev >= 1 ? mev.toPrecision(4) + ' MeV' : mev >= 1e-3 ? (mev * 1000).toPrecision(3) + ' keV' : (mev * 1e6).toPrecision(2) + ' eV');
  const verdict = (r) => { const q = r.model_over_measured; if (r.upper_limit) return '<span class="cos-tag bad">more than 10⁶ too heavy</span>'; if (Math.abs(r.symbol === 'e' ? 0 : Math.log10(q)) < 0.2) return r.symbol === 'e' ? '<span class="cos-tag open">anchor</span>' : '<span class="cos-tag ok">within 1.6</span>'; if (Math.abs(Math.log10(q)) < 0.55) return '<span class="cos-tag open">within 3.5</span>'; const n = (x) => Number(x.toPrecision(2)).toLocaleString('en-US'); return `<span class="cos-tag bad">${q < 1 ? n(1 / q) + ' times too light' : n(q) + ' times too heavy'}</span>`; };
  const rows = E.rows.map((r, i) => { const l = Lm.rows[i]; return `<tr><td><b>${r.symbol}</b> ${r.name}</td><td class="num">${r.rest_phase_left.toFixed(5)} · ${r.rest_phase_right.toFixed(5)}</td><td class="num">${fmt(r.model_MeV_left)}</td><td class="num">${fmt(l.model_MeV_left)}</td><td class="num">${r.upper_limit ? 'below ' : ''}${fmt(r.measured_MeV)}</td><td>${verdict(r)}</td><td>${verdict(l)}</td></tr>`; }).join('');
  return `<h2 style="margin:30px 0 4px">Masses in GeV: the check <span class="mp-badge" style="background:rgba(255,95,122,.16);color:#ff9db0">calibrated comparison; full spectrum fails</span> <span class="mp-badge" style="background:rgba(147,163,192,.16);color:#c5d0e6">archived level-10 run</span></h2>
    <p class="small" style="max-width:1150px;margin:0 0 8px">This declared background-walk reading assigns rest angles from the frozen flux of the archived level-10 run of 2026-11-10 (20,971,520 carriers, retired). The rest phases are measured on that run and were not recomputed on the current runs. For orientation: run ${esc(F.name)} ends with ${F.pairs24 === null ? '–' : F.pairs24.toFixed(3)} pairs of classes 2 and 4 and ${F.pairs33 === null ? '–' : F.pairs33.toFixed(3)} pairs of class 3 per carrier; the archived fit used 0.268 and 0.040. Its numerical flux estimate uses 16.8 million carriers at the quoted 0.3 percent precision. These angles are not the source energies of the separate interacting quantum calculation in the Spectrum tab. <b>SI units:</b> one cell per tick is the speed of light, so a cell is c times a tick, and a rest phase θ per tick is a rest energy ħθ divided by the tick. The tick is not derived, so it is set by one anchor: the electron. That gives a tick of ${E.tick_s.toExponential(2)} s and a cell of ${E.cell_fm.toFixed(2)} fm. The largest energy on this chosen principal phase branch is ${E.heaviest_mass_the_clock_holds_MeV.toFixed(0)} MeV. A tick phase alone aliases energies modulo 2πħ per tick; it does not prove a universal maximum physical mass.</p>
    <table class="t" style="width:100%"><tr><th>particle</th><th>rest phase per tick, left · right</th><th>model, end of the archived run</th><th>model, frozen limit</th><th>measured (PDG 2024, as rounded in the check)</th><th>end of the archived run</th><th>limit</th></tr>${rows}
      ${MC.bosons.map((b) => `<tr><td><b>${b.name}</b></td><td colspan="3">${b.model}</td><td class="num">${b.measured}</td><td colspan="2">${/exact/.test(b.model) ? '<span class="cos-tag open">model zero; physical comparison required</span>' : '<span class="cos-tag open">no value</span>'}</td></tr>`).join('')}</table>
    <div class="mp-two" style="margin-top:12px">
      <div class="card" style="border-color:rgba(63,224,208,.5)"><div class="k" style="margin-top:0;color:#7ff0e2">Calibrated scale comparison</div><p style="margin:4px 0 0;font-size:13.5px">With the electron as anchor, the proposed up/down reading gives about 1.6 MeV at the end of the archived run and 3.3 MeV in the frozen limit, compared with running-mass references of 2.16 and 4.70 MeV (Particle Data Group 2024, MS-bar at 2 GeV). The comparison is not blind. Factor-level similarity is not agreement within measurement errors or a proved scheme match. Zero photon/gluon mass is a target of the supplied gauge action; photon mass has experimental upper bounds, and a confined gluon is not an isolated measured particle.</p></div>
      <div class="card" style="border-color:rgba(255,95,122,.5)"><div class="k" style="margin-top:0;color:#ff9db0">What does not fit</div><p style="margin:4px 0 0;font-size:13.5px">All three generations get the same value, because the defect class cannot tell them apart: the strange, charm, bottom and top quarks, the muon and the tau miss by factors of 20 to 100,000. Up equals down. The neutrino gets the electron's mass, a million times too heavy. The right-handed electron gets zero. The quark-to-electron ratio changes with how the run was prepared. <b>The test that needs no anchor:</b> if the masses fitted, every particle would need the same tick. They need ticks from ${E.needed_tick_min_s.toExponential(1)} s to ${E.needed_tick_max_s.toExponential(1)} s, a spread of ${E.needed_ticks_span.toExponential(1)}.</p></div></div>
    <div class="note" style="margin-top:8px"><b>Second reading, from the run's own energy bookkeeping.</b> When a defect appears, the repair that makes it pays the energy stored in its face, the register cost: 5 for a defect of the left-handed quark class or its conjugate, 8 for the right-handed quark class or its conjugate, 10 for the lepton doublet and Higgs class, in units of the load mismatch. That is register bookkeeping cost. Equating it with a relativistic rest energy would require a Hamiltonian, clock and dispersion map; a stationary register label does not supply that map. The cost table is a declared choice among four in the code (the runs used the binding table; additive, flat and Wilson tables exist). Read as rest energies it makes class 3 twice as heavy as class 1, the wrong way round for leptons against quarks, and again gives all three generations one value.</div>
    <div class="note" style="margin-top:8px"><b>Unit choice and comparison:</b> assigning a Planck-scale tick gives lattice-scale energies, not a match to measured leptons. Changing a common unit cannot repair equal generation ratios. The separate particle formulas are target-informed or conditional on declared response parameters. Their printed values do not reproduce the complete measured spectrum within the printed intervals. The audited candidate calculations keep fitted parameters and failed comparisons explicit. Measured values: <a href="https://pdg.lbl.gov/" target="_blank" rel="noopener">Particle Data Group 2024</a> and <a href="https://physics.nist.gov/cuu/Constants/" target="_blank" rel="noopener">CODATA 2022</a>.</div>${src(['spectrum'], ['scope'])}`;
}
function kindsRows(F) {
  const K = F.KK; if (!K) return '<tr><td colspan="3" class="small">the kinds census could not be loaded</td></tr>';
  const P = K.pairs, T = K.triples;
  const word = (k) => (!k.chirality ? '' : k.separation === 2 ? (k.chirality > 0 ? 'turning left ' : 'turning right ') : (k.chirality > 0 ? 'left then right ' : 'right then left '));
  const list = (p) => p.kinds.filter((k) => k.separation > 1).map((k, i, a) => (!i || a[i - 1].separation !== k.separation ? k.separation + (i ? '' : ' faces') + ' apart' + (k.chirality ? ', ' : ' ') : '') + word(k) + fmt(k.count)).join(' · ');
  const bySep = (p) => [1, 2, 3, 4, 5].map((d) => fmt(p.kinds.filter((k) => k.separation === d).reduce((a, k) => a + k.count, 0))).join(' · ');
  const hl = [6, 7].map((l) => KINDS.levels[String(l)]).filter((x) => x && x.decay_of_classes_1_5).map((x) => `${x.decay_of_classes_1_5.half_life_sweeps.toFixed(0)} sweeps at level ${x.level}`).join(' and ');
  return `<tr><td><b>{2,4}: a class-2 flux with a class-4 flux</b><div class="small">centre classes of a quark with an antiquark; a boson</div></td><td class="num">${P['{2,4}'].lasting_kinds_occupied}</td><td>${list(P['{2,4}'])}</td></tr>
      <tr><td><b>{3,3}: a pair of class-3 bosons</b><div class="small">centre classes of a lepton with an antilepton, or of the Higgs with its conjugate</div></td><td class="num">${P['{3,3}'].lasting_kinds_occupied}</td><td>${list(P['{3,3}'])}</td></tr>
      <tr><td><b>{4,4,4} and {2,2,2}: three fluxes of one colour class</b><div class="small">centre classes of three quarks or three antiquarks; a boson, not a baryon</div></td><td class="num">${T['{4,4,4}'].lasting_shapes}</td><td>${T['{4,4,4}'].lasting_shapes_occupied} of ${T['{4,4,4}'].lasting_shapes} shapes present for {4,4,4} and ${T['{2,2,2}'].lasting_shapes_occupied} of ${T['{2,2,2}'].lasting_shapes} for {2,2,2}, with unequal shares. ${fmt(T['{4,4,4}'].carriers)} carriers hold {4,4,4} and ${fmt(T['{2,2,2}'].carriers)} hold {2,2,2}</td></tr>
      <tr><td><b>{1,5}: a class-1 flux with a class-5 flux</b><div class="small">centre classes of a left-handed quark with its antiquark</div></td><td class="num">not lasting</td><td>all separations occur, 1 to 5: ${bySep(P['{1,5}'])}; the population halves every ${hl}</td></tr>`;
}
function familiesSection(F) {
  const pct = (x) => (100 * x).toFixed(1), K = F.KK;
  const row = (f) => { const sh = f.cls[0] ? f.cls.map((k) => F.share(k)) : null, mean = sh ? sh.reduce((a, b) => a + b, 0) / sh.length : 0; return `<div class="fm-row" style="--c:${f.col}">
      <div class="fm-def"><div class="fm-marks">${f.cls.map((k) => (k ? marker(k, 30) : '<span class="mp-flat">∅</span>')).join('')}</div>
        <div><b>${f.fam === '·' ? 'no defect' : 'defect family ' + f.fam}</b><span>${f.cls[0] ? 'class ' + f.cls.join(' and ') : 'flat face'} · ${f.charges}</span><em>${f.run}</em></div></div>
      <div class="fm-link"><i></i></div>
      <div class="fm-sm"><b>${f.sm}</b><div class="fm-gens">${f.gens.map((g, i) => `<div><span class="fm-gl">${i + 1}</span>${g.map((x) => `<span class="fm-sym">${x}</span>`).join('')}</div>`).join('')}</div><em>${f.extra}</em></div>
      <div class="fm-share">${sh === null ? '<span class="small">class 0 leaves no defect to count</span>' : `<div class="fm-bar"><i style="width:${(f.smShare * 3).toFixed(1)}%;background:#93a3c0"></i></div><div class="fm-bar"><i style="width:${(300 * mean).toFixed(1)}%;background:var(--c)"></i></div><span class="small">${f.smShare} % of the 28 states of a generation with a nonzero class${sh.length > 1 ? ', each sign' : ''} · ${sh.map(pct).join(' % and ')} % of the defect identities of run ${esc(F.name)}</span>`}</div></div>`; };
  const shares = [1, 5, 4, 2, 3].map((k) => Math.round(100 * F.share(k))).join(' : ');
  const sep = (name) => (K ? [2, 3, 4, 5].map((d) => Math.round(100 * (K.pairs[name].share_by_separation[String(d)] || 0))) : null), s24 = sep('{2,4}'), s33 = sep('{3,3}');
  const mz = K ? ['(2,4) d=2', '(2,4) d=3', '(3,3) d=3'].map((k) => Math.abs(K.mirror_pairs[k].z).toFixed(1)).join(', ') : '';
  return `<h2 style="margin:0 0 4px">Defect families and Standard Model families <span class="mp-badge" style="background:rgba(63,224,208,.16);color:#7ff0e2">derived: class k = 6Y mod 6</span></h2>
    <p class="small" style="max-width:1150px;margin:0 0 10px">Every protected defect class equals the Standard Model centre class 6Y mod 6 of the multiplets in its row, exact on all 32 patterns of the five-level code. The class holds colour triality and weak centre parity. It does not hold the generation, the member inside the class or the mass, so one class covers several particles. The defect is the flux boson of its class; the quarks and leptons are the fermionic quanta that carry it. Run ${esc(F.name)}, ${fmt(F.carriers)} carriers.</p>
    <div class="fm-head"><span>in the run</span><span></span><span>in the Standard Model, generations 1, 2, 3</span><span>how many</span></div>
    ${SMFAM.map(row).join('')}
    ${src(['classes', 'spin'], ['cert'])}
    <div class="note" style="margin-top:10px"><b>Why the three defect families are not the three generations.</b> The three generations carry identical charges, and the three defect families carry different ones. A generation needs information beyond the centre class. For the charged leptons a generation register of the repair law supplies it: electron, muon and tau are the characters of the face third-turn (a construction with stated premises). <b>The shares</b> are quench-remnant counts, not a derived thermal occupation law. The displayed ${shares} against 21 : 21 : 21 : 21 : 14 compares the identities of run ${esc(F.name)} with an equal count per internal state. It is no statement about early-Universe abundances.</div>
    <div class="card" style="margin-top:12px"><div class="k" style="margin-top:0">Testing a geometric generation candidate</div>
      <p style="margin:4px 0 6px;font-size:13.5px">The finer geometric register tells pairs apart by how far apart their two faces sit on the carrier. ${s24 ? `Frozen {2,4} pairs come at separations 2, 3, 4 and 5 in shares ${s24.slice(0, 3).join(', ')} and ${s24[3]} percent; {3,3} pairs in ${s33.slice(0, 3).join(', ')} and ${s33[3]} percent (run ${K.run}).` : ''} Guess: separation 2, 3, 4 are generations 1, 2, 3, the commonest being the lightest. A quantum carrying such a pair gets rest phases that rise with the separation, in ratios 1 : 1.15 : 1.22 for the colour pairs and 1 : 1.20 : 1.34 for the class-3 pairs.</p>
      <p style="margin:0;font-size:13.5px"><span class="cos-tag bad">fails</span> Measured: 1 : 206.77 : 3,477.4 for the electron, muon and tau (CODATA 2022 and Particle Data Group 2024; the comparison is not blind). Separation 5 gives another geometric label; identifying it with an extra active neutrino would need an additional field and mass assignment before the Z-width constraint applies. <b>Verdict of the field session, checked on every kind:</b> mirror kinds are one placement seen from two sides, and the counts fall smoothly with separation as local creation predicts. The kinds are positions of a pair on its carrier. The defect class carries no generation.</p>${src(['lepton'], ['register'])}</div>
    <h3 style="margin:18px 0 4px;font-size:15px">Kinds inside each family</h3>
    <p class="small" style="max-width:1150px;margin:0 0 6px">A defect never sits alone on a carrier. The finer geometric register tells the groups apart by how far the two faces are from each other on the carrier and by whether the path between them turns left or right. Only groups whose faces are not neighbours last. ${K ? `Counts on the last stored state of run ${K.run} (sweep ${K.sweep}, ${fmt(K.carriers)} carriers).` : ''} Every group of pure fluxes is a boson.</p>
    <table class="t" style="width:100%"><tr><th>group on one carrier</th><th>kinds that last</th><th>the kinds and how many carriers hold each</th></tr>
      ${kindsRows(F)}</table>
    <div class="note" style="margin-top:6px">Mirror kinds are equally frequent within their errors${mz ? `: the three mirror pairs of run ${K.run} differ by ${mz} standard errors` : ''}. That agreement does not exclude every parity-breaking observable. A kind is a placement of a group on its carrier. It is not a kind of particle. The archived level-10 run of 2026-11-10 (20,971,520 carriers) gave the same 6, 5 and 13 lasting kinds, with shares equal within 1 percentage point.</div>
    ${src(['spin', 'run'], ['cert'])}
    <h3 style="margin:18px 0 4px;font-size:15px">Class addition in the recorded repair events</h3>
    <table class="t" style="width:100%"><tr><th>what meets</th><th>what comes out</th><th>classes</th><th>times seen in run ${esc(F.name)}, screen tier</th><th>Standard Model vertex with the same classes</th></tr>
      ${REACTIONS.map((r) => `<tr><td><b>${r[1]}</b></td><td><b>${r[2]}</b></td><td class="mono">${r[0].replace('->', '→')}</td><td class="num">${fmt(F.channels[r[0]] || 0)}</td><td>${r[3]}</td></tr>`).join('')}</table>
    <div class="note" style="margin-top:8px">Counts of the screen tier. Every recorded reaction of run ${esc(F.name)} conserves the class sum modulo 6: ${fmt(F.broken)} exceptions among ${fmt(F.events)} events. Opposite-class pairs and triples can be neutral under the colour centre. Centre neutrality is weaker than a full colour singlet, and this census does not measure a quantum scattering amplitude or exchange statistics.</div>
    ${src(['classes'], ['cert'])}
    <div class="note" style="margin-top:6px"><b>What the class does not tell:</b> up from down, the three colours, the electron from the neutrino, and the three copies. The register records only the class modulo 6. The finer geometric register finds 20 kinds of pair and 13 shapes of a {4,4,4} or {2,2,2} group; no theorem identifies those geometric labels with generations. <b>Statistics:</b> a defect is the flux boson of its class. The quarks and leptons of the class are the fermionic quanta whose pattern carries it. This is derived with three premises: a spin doublet per quantum, the Gauss law and antisymmetric occupation.</div>`;
}
export async function mapShown() {
  const host = $('map-host'); if (!host || !S.pmap || !S.pmap.defect_map) return;
  if (!SM) { try { SM = await (await fetch('rl/MAP/source_map.json')).json(); } catch (e) { host.innerHTML = '<p class="small">the source map could not be loaded</p>'; return; }
    try { const r = await fetch('rl/X5/bosons.json'); if (r.ok) BOS = await r.json(); } catch (e) { BOS = null; }
    try { const r = await fetch('rl/SIM/cf1/runs/MASS_CHECK.json'); if (r.ok) MC = await r.json(); } catch (e) { MC = null; }
    try { const r = await fetch('rl/REFRESH/kinds.json'); if (r.ok) KINDS = await r.json(); } catch (e) { KINDS = null; } }
  if (!S.meta) return;
  const own = KINDS && KINDS.levels ? KINDS.levels[String(S.meta.geometry.level)] : null;
  if (!(own && own.run === S.name) && !(EU && EU.run === S.name)) {    // a run without a kinds census: its own carrier census
    try { const r = await fetch(S.base + 'view/early_universe.json'); EU = r.ok ? await r.json() : null; } catch (e) { EU = null; } }
  const D = S.pmap.defect_map, maxPath = Math.max(...D.kinds.map((k) => k.free_path || 0)), F = runFacts();
  // carrier contents of the selected run: every content with at least one carrier in a thousand, the rest summed
  const comp = F.comp ? Object.entries(F.comp).sort((a, b) => b[1] - a[1]) : [], occ = F.occupied || 1;
  const main = comp.filter(([, c]) => c / occ >= 0.001), restN = comp.filter(([, c]) => c / occ < 0.001).reduce((a, [, c]) => a + c, 0);
  const groups = main.map(([set, c]) => ({ set, carriers: c, share: c / occ, name: (CONTENT[set] || ['class-neutral group'])[0], reading: (CONTENT[set] || ['', 'classes add to zero modulo 6'])[1], group: (CONTENT[set] || ['', '', 'dark'])[2] }));
  if (restN) groups.push({ set: 'other', carriers: restN, share: restN / occ, name: 'rarer class-neutral groups', reading: 'classes add to zero modulo 6', group: 'dark' });
  const groupsBar = groups.map((g) => `<i style="width:${(100 * g.share).toFixed(2)}%;background:${COL[g.group]}" title="${esc(g.name)}"></i>`).join('');
  const groupsRows = groups.map((g) => `<tr><td><i class="dot" style="background:${COL[g.group]}"></i><b>${esc(g.name)}</b></td><td class="mono">${esc(g.set)}</td><td>${esc(g.reading)}</td><td class="num">${fmt(g.carriers)}</td><td class="num">${(100 * g.share).toFixed(2)} %</td></tr>`).join('');
  const n444 = F.comp ? F.comp['{4,4,4}'] || 0 : 0, n222 = F.comp ? F.comp['{2,2,2}'] || 0 : 0, tt = F.tracker;
  const events = [['pair births', tt.births, 'a defect and its conjugate appear together'], ['annihilations', tt.annihilations, 'a defect meets its conjugate'], ['fusions', tt.fusions, 'two classes add to one'],
    ['splits', tt.splits, 'one class breaks into two'], ['exchanges', tt.exchanges, 'two defects trade class'], ['moves', tt.moves, 'a defect steps to a neighbouring face']];
  const upE = MC ? MC.readings['end of the level-10 run'].rows[0].model_MeV_left / 0.51099895 : null, upL = MC ? MC.readings['classes 1 and 5 gone (limit)'].rows[0].model_MeV_left / 0.51099895 : null;
  const A = [
    ['Quarks and leptons', 'the occupation patterns of the five internal levels of a quantum: three vector levels, two spinor levels', 'colour, weak charge, hypercharge and electric charge of all sixteen states: exact', 'spin, three copies, mass'],
    ['Antiparticles', 'the complementary pattern: every filled level empty, every empty level filled', 'opposite charges: exact', ''],
    ['Gluons, W, Z, photon', 'the twelve responses of a carrier on the five levels: 8 + 3 + 1', 'the algebra: exact', 'they do not travel yet'],
    ['Higgs', 'the toggle of the neutral spinor level: the one operator that keeps colour and electric charge and links left to right', 'one common link for all four kinds of fermion', 'a state and a strength'],
    ['The defect classes', 'vortices of the fields: colour-centre flux (classes 2, 4), weak-centre flux (class 3), generating flux (classes 1, 5)', 'each is the flux boson of a centre class, seen by exactly the patterns that carry the matching charge', 'the generation, the member inside the class, the mass'],
  ];
  host.innerHTML = `
  <div class="mp-wrap">
    <h2 style="margin:0">The particle map <span class="mp-badge">best guess</span></h2>
    <p class="small" style="max-width:1100px;margin:4px 0 14px">The map into this page: the centre class k = 6Y mod 6 takes every protected defect class to its Standard Model multiplets. Candidate assignments connect the register classes and internal representations to familiar particle names. Each column distinguishes an observed target from a computed source property. The Spectrum tab gives the authenticated quantum energy, current and detector results on their declared sources.</p>
    ${familiesSection(F)}
    ${massCheckSection(F)}
    <h2 style="margin:34px 0 8px">The candidate internal representation: patterns of five levels</h2>
    <div class="mp-two" style="margin-bottom:14px">
      <div class="card" style="border-color:rgba(63,224,208,.5)"><div class="k" style="margin-top:0;color:#7ff0e2">Exact internal weights in the declared lift</div>
        <ul style="margin:4px 0 0 18px;padding:0;font-size:13.5px;color:#dfe6f5"><li>the gauge weights of one fermion family, with an optional sterile singlet</li><li>the two handedness classes of each, and a weak current that acts on the left-handed class only</li><li>antiparticles as complement patterns</li><li>a common leading cone in the separate free-walk construction</li><li>the algebra of the forces: 8 + 3 + 1</li></ul>${src(['gauge'])}</div>
      <div class="card" style="border-color:rgba(255,95,122,.5)"><div class="k" style="margin-top:0;color:#ff9db0">Not selected by the law as it stands</div>
        <ul style="margin:4px 0 0 18px;padding:0;font-size:13.5px;color:#dfe6f5"><li>this candidate walk does not select the observed masses; four independent mass-step strengths are allowed</li><li>three copies: a generation register gives the charged-lepton mass ratios, with stated premises; quarks and neutrinos are open</li><li>physical force-carrier propagation and interaction on the same quantum source</li><li>the heavy tower of the carrier is not W, Z, Higgs and top: a blind test misses by 6 percent</li></ul></div>
    </div>
    ${hero()}

    <h2 style="margin:30px 0 4px">What the particle comparison establishes</h2>
    <p class="small" style="max-width:1100px;margin:0 0 8px">A representation match is useful evidence about internal quantum numbers. It does not identify the measured particle before its propagation, statistics and interaction records are connected on the same source.</p>
    <table class="t" style="width:100%"><tr><th>comparison</th><th>exact finite content</th><th>physical interpretation</th></tr>
      ${[
        ['One fermion family', 'the declared current lift has the fifteen Standard Model Weyl weights; a sixteen-state extension adds a singlet', 'a sterile right-handed neutrino is an option, not an observed extra state required by oscillations'],
        ['Electric charge', 'Q = T3 + Y gives the conventional quark and lepton weights in this representation', 'a proton or neutron also needs a physical composite state and its current'],
        ['Gauge algebra', 'the complete matrices realize the 8 + 3 + 1 Lie algebra in the declared lift', 'the generator count does not establish twelve propagating particles'],
        ['Anomaly sums', 'the family weights have the usual vanishing gauge-anomaly sums', 'the complete chiral regulated dynamics and its limit require their own construction'],
        ['Weak currents', 'the source current map acts on the designated left components', 'a weak decay or scattering prediction also needs the interacting relativistic field map'],
        ['Spin and magnetic response', 'a declared free spinor/link construction gives the corresponding finite comparison', 'a tree-level magnetic factor is not the complete measured anomalous moment'],
        ['Masses and generations', 'native source energy windows and calibrated candidate ratios are distinct results', 'no complete source-derived Standard Model GeV spectrum is established'],
      ].map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}
    </table>
    <div class="note" style="margin-top:8px">Particle targets: <a href="https://pdg.lbl.gov/2025/reviews/rpp2025-rev-standard-model.pdf" target="_blank" rel="noopener">PDG electroweak review</a> and <a href="https://pdg.lbl.gov/2025/reviews/rpp2025-rev-neutrino-mixing.pdf" target="_blank" rel="noopener">neutrino review</a>. Neutrino flavour labels are mixtures of mass states; their individual masses and Dirac/Majorana nature are not fixed by the displayed family tiles. Quark mass comparisons require an explicit renormalization scheme and scale. Replayed finite candidate calculations and their exact scope are linked below.</div>
    ${src(['gauge', 'fields'], ['scope'])}

    <h2 style="margin:30px 0 4px">The protected defects of the run</h2>
    <p class="small" style="max-width:1100px;margin:0 0 10px">${esc(D.rule)} A defect is the flux boson of its class. It is not itself a quark or a lepton: those are the fermionic quanta that carry the class. The passive register is gauge-neutral in the audited implementation. The numbers on the cards are read from run ${esc(F.name)}; they are quench counts, not thermal abundances.</p>
    <div class="mp-kinds">${D.kinds.map((k) => kindCard(k, maxPath, F)).join('')}</div>
    ${src(['classes', 'spin', 'run'], ['cert'])}
    <div class="note" style="margin-top:8px">${esc(D.h2.note)} The densities are those of the archived level-10 run of 2026-11-10. ${esc(D.h2.composite)} Colour flux of the gas: ${(D.h2.plaquettes_per_carrier.Z3 || 0).toFixed(3)} per carrier, weak flux ${(D.h2.plaquettes_per_carrier.Z2 || 0).toFixed(3)}. The working law has one bit per link, so only the weak flux is its own; the colour flux of these runs uses a declared link register of order six. Of the 32 patterns 28 see some flux.</div>

    <h2 style="margin:30px 0 4px">What sits together on a carrier</h2>
    <p class="small" style="max-width:1100px;margin:0 0 8px">The classes on the twenty faces of a carrier sum to zero modulo 6, because the carrier is a closed screen. So no colour class sits alone on a carrier: only class-neutral groups occur, and every such group of pure fluxes is a boson. ${F.comp ? `Run ${esc(F.name)}, last stored state: ${fmt(F.carriers)} carriers, ${(100 * (1 - F.occupied / F.carriers)).toFixed(1)} % of them empty. Shares are of the ${fmt(F.occupied)} carriers that hold defects.` : `Run ${esc(F.name)} stores no carrier census.`}</p>
    <div class="cos-bar" style="height:22px">${groupsBar}</div>
    <table class="t" style="width:100%;margin-top:8px"><tr><th>content of the carrier</th><th>classes</th><th>centre classes and statistics</th><th>carriers</th><th>share</th></tr>${groupsRows}</table>
    <div class="note" style="margin-top:8px">${F.comp ? `Conjugate contents in run ${esc(F.name)}: ${fmt(n444)} carriers hold {4,4,4} and ${fmt(n222)} hold {2,2,2}. They differ by ${(Math.abs(n444 - n222) / Math.sqrt(Math.max(1, n444 + n222))).toFixed(2)} standard errors on a Poisson scale. ` : ''}The archived level-10 run of 2026-11-10 had 86,476 against 86,788. The register has no baryon number, and neither content is a baryon. Every recorded reaction of run ${esc(F.name)} conserves the class modulo 6: ${fmt(F.broken)} exceptions among ${fmt(F.events)} events.${F.KK ? ` On the last stored state of run ${F.KK.run} ${fmt(F.KK.carriers_with_class_total_nonzero_mod6)} carriers have a class total other than zero modulo 6.` : ''}</div>
    <div class="mp-react">${events.map((r) => `<div><b>${r[1] === undefined ? '–' : fmt(r[1])}</b><span>${esc(r[0])}</span><em>${esc(r[2])}</em></div>`).join('')}</div>
    <div class="small" style="margin-top:4px">Events of run ${esc(F.name)} over ${fmt(F.sweeps)} sweeps${S.meta.config && S.meta.config.track_intra ? ', screen and internal tier' : ', screen tier'}.</div>
    ${src(['classes', 'spin', 'run'], ['cert'])}

    <h2 style="margin:30px 0 4px">Two readings of the same catalogue</h2>
    <div class="mp-two">
      <div class="card"><div class="k" style="margin-top:0">Reading A · particles are charged quanta, defects are vortices</div>
        <table class="t" style="width:100%"><tr><th>in nature</th><th>in the model</th><th>match</th><th>missing</th></tr>${A.map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td class="small">${r[3]}</td></tr>`).join('')}</table>${src(['gauge', 'spin'])}</div>
      <div class="card"><div class="k" style="margin-top:0">Reading B · a defect of class k has the centre class of these multiplets <span class="cos-tag ok">derived: k = 6Y mod 6</span></div>
        <table class="t" style="width:100%"><tr><th>class</th><th>multiplet with the same charge class</th><th>as a flux</th></tr>
        ${[[1, 'left-handed quark class: the quark doublet'], [5, 'its conjugate: the antiquark doublet'], [4, 'right-handed quark class: up and down quark, right-handed'], [2, 'its conjugate: their antiparticles'], [3, 'lepton doublet and Higgs class: the lepton doublet, its antiparticle and the Higgs doublet']].map(([k, n]) => `<tr><td>${marker(k, 18)} ${k}</td><td><b>${n}</b></td><td class="small">${esc(FAM[k].detail)}</td></tr>`).join('')}
        <tr><td><span class="mp-cls flat">∅</span> 0</td><td><b>class 0: right-handed leptons and the gauge fields</b></td><td class="small">flat face, no flux</td></tr></table>
        ${src(['classes'], ['cert'])}
        <div class="note"><b>What the class match establishes:</b> the centre class of every defect, exact on all 32 patterns. The defect of a class is its flux boson; the class does not fix the full representation, the generation or the mass. <b>What the scoring establishes:</b> the recorded quench shares differ from the proposed equal-per-internal-state census. The quoted score uses variation across five lattice levels, not a demonstrated thermal ensemble or independent particle-production samples. It does not exclude every possible particle assignment. The exact obstruction is information loss: a centre class does not fix the full representation or physical parity. Neutrality also does not decide between the readings. <b>Reading C</b>, a quantum carrying a flux pair, remains a declared candidate construction, without a quantified probability of identification.</div></div>
    </div>

    <div class="card" style="margin-top:14px;border-color:rgba(255,228,92,.45)"><div class="k" style="margin-top:0">Reading C · a quantum that carries a defect <span class="mp-badge">closest to "a particle that is a defect"</span></div>
      <p style="margin:6px 0 8px;font-size:13.5px">A flux pair of a carrier does not travel by itself: it has no pointer and no charge. A charged quantum can carry it as cargo, with one added declared gate. Then the pattern gives the charges, and the defect gives a conserved label and a rest phase. On a line of 256 carriers its speed equals the prediction to 1 part in 10⁸.</p>
      <table class="t" style="width:100%"><tr><th>cargo: a flux pair whose two faces are</th><th>1 apart</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
        <tr><td>charge phase 1/6 (a quark doublet on classes 1, 5)</td><td class="num">0.0424</td><td class="num">0.0510</td><td class="num">0.0562</td><td class="num">0.0583</td><td class="num">0.0593</td></tr>
        <tr><td>charge phase 1/3 (any quark on classes 2, 4)</td><td class="num">0.0751</td><td class="num">0.0928</td><td class="num">0.1064</td><td class="num">0.1131</td><td class="num">0.1169</td></tr>
        <tr><td>charge phase 1/2 (a weak doublet on class 3)</td><td class="num">0.0878</td><td class="num">0.1106</td><td class="num">0.1324</td><td class="num">0.1478</td><td class="num">0.1712</td></tr></table>
      <div class="note">Rest phase per tick of the composite. Each row is a ladder of five levels of one kind of particle. These are numbers of one carrier at the scale of the lattice, not masses in physical units. Stationary pairs of the run never sit one face apart.</div>${src(['continuum'])}</div>

    <h2 style="margin:30px 0 4px">Mass, and what is not in the standard list</h2>
    <div class="mp-two">
      <div class="card">${D.mass.map((m) => `<p style="margin:0 0 8px;font-size:13.5px">${esc(m)}</p>`).join('')}</div>
      <div class="card"><div class="k" style="margin-top:0">${esc(D.dark.name)} · best guess: ${esc(D.dark.guess)}</div><ul style="margin:4px 0 10px 18px;padding:0;font-size:13px;color:var(--soft)">${D.dark.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
        <div class="k">${esc(D.tower.name)} · best guess: ${esc(D.tower.guess)}</div>
        <div class="mp-tower">${D.tower.angles.map((a) => `<div><b>${a[1].toFixed(4)}</b><span>${esc(a[0])}</span></div>`).join('')}</div><div class="small">rest phase per tick, no free parameter</div></div>
    </div>
    ${src(['yukawa', 'higgs'])}


    <h2 style="margin:30px 0 4px">Electron comparison for this candidate walk</h2>
    <p class="small" style="max-width:1100px;margin:0 0 8px">This table compares a specified candidate walk with known electron properties. It is a retrospective comparison, not a blind test or a statement about every native quantum construction.</p>
    <table class="t" style="width:100%"><tr><th>property</th><th>model</th><th>verdict</th></tr>
      ${[['Electric charge, colour, weak charge, hypercharge', 'both handedness classes carry the electron’s values, as labels of the pattern', 'ok', 'equal'],
         ['Spin and statistics', 'spin one half by the routing; a fermion by the rotation by 2π, with three premises: a spin doublet per quantum, the Gauss law, antisymmetric occupation', 'ok', 'derived, three premises'],
         ['Charge as a coupling, stability, magnetic moment', 'no electromagnetic link is coupled to the charge yet. With declared link phases the lowest level in a field stays at the rest angle, which is the value 2 of the magnetic factor', 'open', 'not comparable'],
         ['Mass', 'no option gives it: the law leaves the family massless', 'bad', 'fails'],
         ['Mass from the frozen flux of the archived level-10 run', 'the right-handed electron stays massless, the neutrino gets the electron’s angle, up equals down. Quark to lepton ratio ' + (upE ? upE.toFixed(1) + ' at the end of that run and ' + upL.toFixed(1) + ' in the limit' : 'not loaded') + ', against 4.2 for up and 9.2 for down over the electron (Particle Data Group 2024, not blind)', 'bad', 'fails'],
        ].map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td><span class="cos-tag ${r[2]}">${r[3]}</span></td></tr>`).join('')}
    </table>
    ${src(['lepton', 'spin'], ['register'])}
    <div class="note" style="margin-top:8px"><b>What a passing mass row needs:</b> one angle that joins the two handedness classes of a particle; a register that takes the charge the toggle moves; a strength per particle; a law for the electron’s angle, which is below 10⁻⁵ per tick if the top quark shares the clock, four orders below every carrier number so far; and one cone per particle.</div>

    <h2 style="margin:30px 0 4px">Three copies of every particle</h2>
    <div class="card" style="margin-bottom:14px;border-color:rgba(63,224,208,.5)"><div class="k" style="margin-top:0;color:#7ff0e2">Charged leptons: the generation register <span class="cos-tag open">construction with stated premises</span></div>
      <p style="margin:6px 0 4px;font-size:13.5px">A generation register in the repair law makes electron, muon and tau the characters ω, ω² and 1 of the face third-turn. Its read count 2/9 gives Koide Q = 2/3, m<sub>μ</sub>/m<sub>e</sub> = 206.770316 and m<sub>τ</sub>/m<sub>e</sub> = 3477.4728, with no measured mass as input.</p>
      <p style="margin:0;font-size:13px;color:var(--soft)">Measured: 206.7682827(46), CODATA 2022, so the muon ratio is 9.83 parts per million high; 3477.365(176) with the Particle Data Group 2024 tau mass, so the tau ratio is 0.61 standard errors high. The comparison is not blind. Open inside it: what creates the pair, the source event for the kick, one partner per unit time. The absolute lepton scale, the quark masses and the neutrino masses are open.</p>${src(['lepton'], ['register'])}</div>
    <div class="mp-two">
      <div class="card"><div class="k" style="margin-top:0">What the finite theorem stack offers</div>
        <ul style="margin:4px 0 0 18px;padding:0;font-size:13.5px;color:var(--soft)">
          <li><b>The candidate:</b> the band of three port vectors of the twelve-port carrier, at seam cost 5 − √5. A machine-checked theorem selects it, under three premises that are not proved: one complete faithful band, a size between 3 and 5, and comparison by seam cost.</li>
          <li><b>Gauge fixing does not give the number three.</b> The stack says so itself: the cancellation of anomalies holds copy by copy and does not fix the number of copies. In its own registers three copies stay a selection.</li>
          <li><b>Equal masses unless something breaks the symmetry.</b> If the three copies are the unbroken band and the Higgs does not tell them apart, all three get the same mass. A background has to split them.</li>
        </ul></div>
      <div class="card"><div class="k" style="margin-top:0">Finite calculation: a flux pair on the carrier splits the band</div>
        <table class="t" style="width:100%"><tr><th>faces of the pair</th><th>copy 1</th><th>copy 2</th><th>copy 3</th><th>spread</th></tr>
          <tr><td>1 apart</td><td class="num">0.2772</td><td class="num">0.3047</td><td class="num">0.3360</td><td class="num">38 %</td></tr>
          <tr><td>2 apart</td><td class="num">0.2525</td><td class="num">0.3047</td><td class="num">0.3555</td><td class="num">66 %</td></tr>
          <tr><td>3 apart</td><td class="num">0.2192</td><td class="num">0.3179</td><td class="num">0.3768</td><td class="num">96 %</td></tr>
          <tr><td>4 apart</td><td class="num">0.1979</td><td class="num">0.3316</td><td class="num">0.3856</td><td class="num">110 %</td></tr></table>
        <div class="note">Rest phase per tick of the three levels that grow out of the band, for a pattern that sees the pair with half a turn. Spread is the difference of the seam costs over their mean. Without the pair all three sit at 0.3047. So a defect does give three copies three different values, by 17 to 120 percent. Nature needs factors of 17 to 3,500 between copies. The invariant that measures a difference between matter and antimatter is zero for one pair.</div></div>
    </div>

    <div class="card" style="margin-top:14px"><div class="k" style="margin-top:0">Finite calculation: a point-like source of mass makes the copies unequal</div>
      <p style="margin:6px 0 8px;font-size:13.5px">The tick has four copies of every species on one lattice, its four candidate low-energy cones. A source of mass that sits on single carriers does not treat them alike. Exact calculation on 8³ carriers:</p>
      <table class="t" style="width:100%"><tr><th>source carriers in the box</th><th>copies that get a rest phase</th><th>their values, in units of the average</th></tr>
        <tr><td>1</td><td>1 of 4</td><td class="mono">4 · 0 · 0 · 0</td></tr>
        <tr><td>2</td><td>2 of 4</td><td class="mono">3 · 1 · 0 · 0</td></tr>
        <tr><td>4</td><td>3 of 4</td><td class="mono">2.4 · 1.3 · 0.3 · 0</td></tr>
        <tr><td>every carrier</td><td>4 of 4</td><td class="mono">1 · 1 · 1 · 1</td></tr></table>
      <div class="note">One heavy copy and lighter ones is the pattern of nature. Here it appears when the state that gives mass is sparse or ordered with a period of four carriers, and it disappears when that state is uniform. The heavy copy is a pair of both handedness classes, as a massive particle must be. Two species whose sources sit on the same cells mix by a plain reordering; on the other half of the cells every mixing entry is one quarter; a split between the two gives angles in between. This is a mechanism to test, not a derivation: the model has four copies where nature has three, two of them mirror copies, and nothing yet fixes the order of the vacuum.</div>${src(['spectrum'], ['status'])}</div>

    <h2 style="margin:30px 0 4px">What a rest mass needs, premise by premise</h2>
    <p class="small" style="max-width:1100px;margin:0 0 8px">Dependencies for this candidate walk, compared with the public source constructions. Its table of source-derived Standard Model GeV masses is empty. Finite source energies and controlled free-field rest frequencies have their own proved entries.</p>
    <table class="t" style="width:100%"><tr><th>premise</th><th>what it supplies</th><th>status in the register</th></tr>
      ${[['one clock and one unit of energy', 'the anchor that turns a rest phase into a mass', 'imported', 'open'],
         ['rules that select the band of three', 'three copies', 'built on declared inputs', 'open'],
         ['spin and handedness', 'fermions with the right chirality', 'declared', 'open'],
         ['the Higgs carrier and its kinetic term', 'the field that gives mass', 'declared', 'open'],
         ['the Higgs potential and the breaking', 'the value of the field in the vacuum', 'declared', 'open'],
         ['the Yukawa matrices', 'one mass per particle and copy', 'declared', 'open'],
         ['propagation, frames, comparison', 'a moving particle with a cone', 'proved on distinct free-field constructions; same-source interacting attachment required', 'open'],
         ['gauge fields, currents and action', 'finite physical Gauss/current and field-response constructions exist; observed interaction matching is separate', 'finite results; common field limit required', 'open'],
         ['the effective field sector and its physical scale', 'controlled free Dirac and Proca record limits on declared finite families', 'interacting limit and physical scale required', 'open'],
        ].map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td><span class="cos-tag ${r[3]}">${r[2]}</span></td></tr>`).join('')}
    </table>
    ${src(['fields', 'spectrum'], ['status'])}
    <div class="mp-issues" style="margin-top:12px">${[
      ['A reference state with interaction', 'One state under the gauge constraints on which the native repair acts.', 'audit; theory worker R1'],
      ['A coupling that is not zero', 'The native repair acts as zero on the fifteen-state module. A mass needs a coupling that does not, and that passes the charge it moves to a register.', 'audit; theory worker R8; proposal: the class-3 faces'],
      ['Handedness without mirror partners', 'A chiral family, not a vector-like one.', 'audit; theory worker R4'],
      ['An interacting limit with a cone', 'The interaction must keep the relativistic behaviour.', 'theory workers R3, R5; runs A, B, G of this session'],
      ['The state of the Higgs and the strengths', 'A vacuum value that belongs to a stationary state and one strength per particle.', 'open; the flux of the runs is a relic of the start'],
      ['The readout of a mass', 'A pole or a stable resonance from complete detector records, on the interacting program.', 'theory worker R6; runs D, E'],
      ['The unit', 'One measured anchor.', 'theory worker R7'],
      ['Three copies with different masses', 'A background that splits the band strongly, and a nonzero difference between matter and antimatter.', 'theory worker X4; band splitting executed: 17 to 120 percent'],
    ].map((x, i) => `<div class="card"><b>${i + 1}. ${x[0]}</b><p>${x[1]}</p><span>${x[2]}</span></div>`).join('')}</div>
    <h2 style="margin:30px 0 4px">Finite outputs of these declared candidate programs</h2>
    <p class="small" style="max-width:1100px;margin:0 0 8px">Rest phases per tick, exact or executed. The clock is the period of two ticks. No row is a mass of a known particle.</p>
    <table class="t" style="width:100%"><tr><th>object</th><th>rest phase per tick</th><th>preparation and readout</th><th>status</th></tr>
      ${[['every species of the map, no mass step', '0', 'blank packet; shell radius and record statistics', 'executed to 16.8 million carriers', 'ok'],
         ['internal sectors of a carrier as the mass step', '0 · 0.3047 · 0.3672 · 0.4510 · 0.4962 · 0.5857', 'rest state of each sector; record after one tick. From sampled records: 0.3015 ± 0.0030 and 0.4510 ± 0.0045', 'no free number; lattice scale; executed', 'open'],
         ['a quantum with a flux pair as cargo', '0.042 to 0.171 by charge phase and face separation', 'packet on a line of 256 carriers; speed equals the prediction to 1 part in 10⁸', 'declared gate; lattice scale', 'open'],
         ['a quantum in the frozen flux of the archived level-10 run', 'quark doublets 0.0351 · quark singlets 0.0323 · lepton doublets 0.0114 · singlets 0', 'plane wave at rest; return amplitude. Density times angle to 0.3 percent at 16.8 million carriers', 'four declared readings stacked; set by the preparation; fails for the electron', 'bad'],
         ['the travelling flux pair of the audit', '2 source units', 'particle and hole of a filled reference; energy instrument with 36 records', 'declared face-count rule; gauge singlet', 'open'],
         ['the toggle of the level s2 with its register (the Higgs reading)', 'not fixed', 'one bit per carrier takes the charge the toggle moves; the tick then commutes with the constraint to 2 × 10⁻¹⁶. A register in number states converts handedness and gives no rest phase; a rest phase needs a register state with a common phase', 'four strengths allowed, one each for up type, down type, charged lepton and neutrino; none fixed; no flux background can supply them', 'bad'],
        ].map((r) => `<tr><td><b>${r[0]}</b></td><td class="mono">${r[1]}</td><td class="small">${r[2]}</td><td><span class="cos-tag ${r[4]}">${r[3]}</span></td></tr>`).join('')}
    </table>

    ${src(['continuum', 'spectrum'])}

    <h2 style="margin:30px 0 4px">What keeps this from being a literal table</h2>
    <div class="mp-issues">${ISSUES.map((x, i) => `<div class="card"><b>${i + 1}. ${x[0]}</b><p>${x[1]}</p><span>${x[2]}</span></div>`).join('')}</div>
  </div>`;
  host.querySelectorAll('.mp-tile[data-k]').forEach((el) => el.onclick = () => { picked = el.dataset.k; host.querySelectorAll('.mp-tile[data-k]').forEach((t) => t.classList.toggle('sel', t.dataset.k === picked)); $('mp-detail').innerHTML = detail(); });
}
