// The journey of the particle viewer: the overview page, the map panels and the compact journey bar.
//
// The page shows the whole chain as one animated picture: the steps (holographic screen, defects, lattice, field, early
// universe, particles, masses, results) and, between them, the maps that carry one step into the next. Every step
// is a small live graphic. Every map is a connector with its own small animation and opens a panel with a larger
// picture (before, rule, after), one sentence, the formula and the source links.
//
// Exports
//   mount(host), shown(host)        the page (registered by app.js under the name 'journey')
//   openMap(id), closeMap()         the map panel; it builds its own overlay on document.body and works on every page
//   journeyBar()                    a compact strip (33 px) with the steps as dots and the maps on the connectors
//   setJourneyPage(pageName)        highlights the step of a page in every bar (the bars also follow body[data-page])
//   STEPS, MAPS, STEP_OF_PAGE       the data
//   ENGINES                         the small exact engines behind the graphics (checked by journey_check.mjs)
//
// Sources, verified statement by statement: oph_defects/DATASET.md section 1 (federation, law C, the declared Z6
// register); repair-law/MATCH.md and RER model/defect_particle_classes/PROOF.md (centre classes, flux costs);
// repair-law/candidates/CF1.md with readout_field.js and cf1_engine.js (routing tick, continuum limit);
// repair-law/LEPTON_STEPS.md with reports LC, CK2, LT and RER model/lepton_register_round (read counts and rates);
// reports GL and MA with work/HR/SPEC.md and FOR_SIM.md (links, plaquette action, ensemble, temperature);
// COUPLING_FIX.md with reports LV and HD (scales). Status words follow ADDENDUM_THEORY.md of the second phase.
import { SRC, RER, SITE, DER, PAPER } from './links.js';
import { tex, typeset } from './math.js';
import { MAP_HELP, STATUS_HELP } from './help/journey.js';

// ================================================================================================ steps and maps
// Order of the steps as the owner set it: holographic screen, defects, lattice, field, early universe, particles,
// masses, then the results. Page lists follow the header groups of app.js.
export const STEPS = [
  { id: 'screen', n: 1, name: 'Holographic screen', line: 'observers on a closed screen, one repair law', pages: [['universe', 'Screen'], ['carrier', 'One carrier'], ['observer', 'One observer']] },
  { id: 'defects', n: 2, name: 'Defects', line: 'faces of nonzero class, born in neutral sets', pages: [['defects', 'Catalogue']] },
  { id: 'lattice', n: 3, name: 'Lattice', line: 'links, plaquettes and the weight exp(−S)', pages: [['lattice', 'From defects to the lattice']] },
  { id: 'field', n: 4, name: 'Field', line: 'the Dirac equation and gauge waves in 3 + 1', pages: [['readout', 'Continuum field'], ['nowave', 'No wave function'], ['space', 'Forces']] },
  { id: 'early', n: 5, name: 'Early universe', line: 'cooling, then quarks bind into hadrons', pages: [['cosmos', 'First defects'], ['timeline', 'Timeline'], ['transitions', 'Phase transitions']] },
  { id: 'particles', n: 6, name: 'Particles', line: 'class k is the centre class 6Y mod 6', pages: [['classes', 'Classes'], ['decoder', 'Decoder'], ['map', 'Map']] },
  { id: 'masses', n: 7, name: 'Masses', line: 'rest mass is a rest phase per tick', pages: [['leptons', 'Leptons'], ['spectrum', 'Spectrum'], ['couplings', 'Couplings']] },
  { id: 'results', n: 8, name: 'Results', line: 'derived, conditional and open, with every number', pages: [['results', 'Board']] },
];
export const STEP_OF_PAGE = {};
for (const s of STEPS) for (const [p] of s.pages) STEP_OF_PAGE[p] = s.id;
const STEP = Object.fromEntries(STEPS.map((s) => [s.id, s]));

// Status words of the site. 'conditional' is the group of ADDENDUM_THEORY.md for a construction with stated premises.
export const STATUS = {
  derived: { label: 'derived', rgb: '63,224,208' }, premise: { label: 'one premise', rgb: '111,177,255' }, conditional: { label: 'conditional', rgb: '111,177,255' },
  declared: { label: 'declared', rgb: '255,180,74' }, imported: { label: 'imported', rgb: '169,149,255' }, open: { label: 'open', rgb: '255,100,128' },
};
const T = String.raw;
// The six maps of the main line in order, then the two secondary maps: refine inside the first step, and scale from
// the masses back to the early universe.
export const MAPS = [
  { id: 'twist', from: 'screen', to: 'defects', name: 'twist', status: ['declared'],
    say: 'A repair on a seam moves the current j between its two ports, and the register adds j mod 6 to the face on one side and subtracts it on the other, so the classes of a closed carrier always sum to zero mod 6.',
    tex: [T`t = x_a + x_b,\qquad x_a' = \lceil t/2\rceil \ \text{or}\ \lfloor t/2\rfloor \ \text{by a fair coin},\qquad j = x_a - x_a'`,
      T`k_{f_+}\to k_{f_+} + j,\qquad k_{f_-}\to k_{f_-} - j \pmod 6,\qquad \sum_{f} k_f \equiv 0 \pmod 6`],
    src: ['run'], panes: ['carrier: loads on the ports', 'rule: law C and the register', 'defects: classes on the faces'] },
  { id: 'links', from: 'defects', to: 'lattice', name: 'links', label: 'how repair becomes a quantum lattice', status: ['declared', 'premise'], wide: true,
    say: 'Every seam carries a link of the gauge group, the class of a face is the centre class of the product of its links, the seam cost around a face is the plaquette action, and the least-biased ensemble with that cost is the weight exp(−S) that a lattice computation samples.',
    tex: [T`k_f \;=\; \text{centre class of}\ \prod_{e\,\in\,\partial f} U_e,\qquad S \;=\; \beta_5 \sum_{P}\Bigl(1 - \tfrac{1}{5}\,\mathrm{Re}\,\mathrm{tr}_5\,U_P\Bigr),\qquad w[U] \;\propto\; e^{-S[U]}`],
    src: [['Derivation: links, gauge group, plaquette action', DER + 'reports/GL.md'], ['Derivation: the register ensemble with the plaquette weight', DER + 'reports/MA.md'],
      ['Specification: the lattice gauge-Higgs system of the source', DER + 'work/HR/SPEC.md'], ['Porting the system into the run', DER + 'work/HR/FOR_SIM.md'],
      ['Candidate program CF-1: the cubic family', DER + 'candidates/CF1.md'], ['Data format of the runs', SITE + 'DATASET.md'],
      ['Paper: Standard Model gauge structure', PAPER('deriving_standard_model_gauge_structure_from_observer_overlap_consistency')]],
    panes: ['a defect wanders on the carrier net', 'a link on every seam', 'the cubic lattice with plaquettes', 'configurations with weight exp(−S)'],
    rules: [['what moves is a link', 'declared'], ['frames become axes', 'declared'], ['cost becomes weight', 'premise']] },
  { id: 'continuum', from: 'lattice', to: 'field', name: 'continuum', status: ['declared'],
    say: 'On the cubic lattice the routing tick moves a quantum from cell to cell, two ticks act as exp(−2i(α·p + θβ)) up to order p³, which is the Dirac equation with m c² = θ E<sub>cell</sub>, and the waves of the links are the gauge fields.',
    tex: [T`U_{\rm 2\,ticks} \;=\; e^{-2i(\alpha\cdot p \,+\, \theta\beta)} + O(p^3),\qquad \alpha_i = X\otimes\sigma_i,\quad \beta = Y\otimes 1`,
      T`i\,\partial_t\psi = (\alpha\cdot p + m\beta)\,\psi,\qquad m c^2 = \theta\,E_{\rm cell},\qquad \cos E = \cos\theta\,\cos p \ \ \text{on an axis}`],
    src: ['continuum', ['Candidate program CF-1: the routing tick', DER + 'candidates/CF1.md'], ['Derivation: gauge group, equal couplings, gauge waves', DER + 'reports/GL.md']],
    panes: ['lattice: one routing tick at a time', 'rule: the walk against the Dirac shell', 'field: packets on the cone'] },
  { id: 'heat', from: 'field', to: 'early', name: 'heat', status: ['declared'],
    say: 'A lattice with N<sub>t</sub> ticks in the time direction is the equilibrium state of the fields at temperature E<sub>cell</sub>/N<sub>t</sub>, the couplings run from the cell to the GeV range along the declared chain, and the transitions sit where the ensemble changes phase.',
    tex: [T`T \;=\; \frac{E_{\rm cell}}{N_t},\qquad E_{\rm cell} = 9.5599\times 10^{18}\ \mathrm{GeV}`],
    src: [['Porting the system into the run: ensemble and temperature', DER + 'work/HR/FOR_SIM.md'], ['Derivation: the corrected coupling chain', DER + 'COUPLING_FIX.md'],
      ['Derivation: the register ensemble with the plaquette weight', DER + 'reports/MA.md'], ['Derivation: hadron masses from the colour coupling', DER + 'reports/HD.md']],
    panes: ['fields on a lattice with N_t ticks', 'rule: T = E_cell / N_t', 'early universe: what the ensemble holds'] },
  { id: 'centre', from: 'early', to: 'particles', name: 'centre', status: ['derived'],
    say: 'What the cooled universe holds is named by its centre class: the flux of a class-k defect is the central element exp(2πi kY) of the gauge group (SU(3) × SU(2) × U(1))/Z6, a quantum of hypercharge Y carried around it picks up that phase, and the class of a multiplet is 6Y mod 6 on all 32 patterns.',
    tex: [T`k \;=\; 6Y \bmod 6 \;=\; 3\,(n_2 \bmod 2) - 2\,(n_3 \bmod 3) \bmod 6,\qquad \text{phase} \;=\; e^{2\pi i\,kY}`],
    src: [['Certificate: defect classes are centre classes (61 checks)', RER + 'model/defect_particle_classes/PROOF.md'], 'classes', 'spin'],
    panes: ['defect: a flux of class k', 'rule: carry a quantum around it', 'particles: class = 6Y mod 6'] },
  { id: 'reads', from: 'particles', to: 'masses', name: 'reads', status: ['conditional'],
    say: 'On the declared clock the rest phase per tick is the expected number of reads per tick: two cells give the count 2/9, and the three characters of the face third-turn give three rates.',
    tex: [T`\theta \;=\; p + q - 2pq \;=\; \tfrac{2}{9},\qquad p = \tfrac{1}{12},\quad q = \tfrac{1}{6}`,
      T`y_k \;=\; \tfrac{1}{27}\Bigl(1 + \sqrt{2}\,\cos\bigl(\theta + \tfrac{2\pi k}{3}\bigr)\Bigr)^{2},\qquad m_k \propto y_k`],
    src: [['Certificate: the charged-lepton register (99 checks)', RER + 'model/lepton_register_round/PROOF.md'], ['State and open steps of the lepton lane', DER + 'LEPTON_STEPS.md'],
      ['Derivation: the count 2/9 on sixty addresses', DER + 'reports/LC.md'], ['Derivation: the weak round', DER + 'reports/CK2.md'], ['Derivation: the clock unit', DER + 'reports/LT.md'],
      ['Paper: particles from native overlap transport', PAPER('deriving_the_particle_zoo_from_observer_consistency')]],
    panes: ['reads: two cells, two flags', 'rule: the count is the phase', 'masses: three rates'] },
  { id: 'refine', from: 'screen', to: 'screen', name: 'refine', status: ['declared'], secondary: true, inside: ['Screen', 'One carrier'],
    say: 'The screen is refined L times into 20 · 4<sup>L</sup> cells, and every cell is the same twelve-port carrier, joined to three neighbours by glue seams.',
    tex: [T`N = 20\cdot 4^{L},\qquad c\;\mapsto\;\{4c,\;4c+1,\;4c+2,\;4c+3\},\qquad L = 6:\; N = 81{,}920`],
    src: ['run'], panes: ['screen at level L', 'one cell becomes four', 'screen at level L + 1'] },
  { id: 'scale', from: 'masses', to: 'early', name: 'scale', status: ['declared'], secondary: true,
    say: 'The declared chain sets the electroweak scale v = E<sub>cell</sub> exp(−2π/(4α<sub>U</sub>)) and the colour scale Λ<sup>(3)</sup> = 0.340 GeV, and these two scales place the two transitions on the temperature axis.',
    tex: [T`v \;=\; E_{\rm cell}\,e^{-2\pi/(4\alpha_U)} \;=\; 246.60\ \mathrm{GeV}\quad \text{at}\quad 1/\alpha_U = 24.3166,\qquad \Lambda^{(3)} = 0.340\ \mathrm{GeV}`],
    src: [['Derivation: the law for v', DER + 'reports/LV.md'], ['Derivation: the corrected coupling chain', DER + 'COUPLING_FIX.md'], ['Derivation: hadron masses from the colour coupling', DER + 'reports/HD.md'],
      ['Certificate: central flux costs (section 9)', RER + 'model/defect_particle_classes/PROOF.md']],
    panes: ['one flux quantum of each class', 'rule: the exponent of the chain', 'scales: from the cell to the GeV range'] },
];
const MAP = Object.fromEntries(MAPS.map((m) => [m.id, m]));
const MAIN = MAPS.filter((m) => !m.secondary);

// ================================================================================================ engines
// Small exact engines behind the graphics. No DOM. Checked by repair-law/work/SIM/phase2/JOURNEY/journey_check.mjs.
const TAU = 2 * Math.PI, PHI = (1 + Math.sqrt(5)) / 2;
const mod = (a, n) => ((a % n) + n) % n;
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const n = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / n, a[1] / n, a[2] / n]; };

// a small deterministic generator (mulberry32), so that every picture is reproducible
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// The twelve-port carrier: 12 ports, 30 seams, 20 faces oriented outward. FP[s] is the face that traverses seam s
// from its first end to its second, FM[s] the face that traverses it the other way (DATASET.md section 2).
function buildIcosa() {
  const V = [];
  for (const a of [-1, 1]) for (const b of [-1, 1]) V.push([0, a, b * PHI], [a, b * PHI, 0], [b * PHI, 0, a]);
  const n = Math.hypot(1, PHI); for (const v of V) for (let i = 0; i < 3; i++) v[i] /= n;
  const near = (a, b) => Math.abs(Math.hypot(V[a][0] - V[b][0], V[a][1] - V[b][1], V[a][2] - V[b][2]) - 2 / n) < 1e-9;
  const E = [], F = [];
  for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) if (near(a, b)) E.push([a, b]);
  for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) for (let c = b + 1; c < 12; c++) if (near(a, b) && near(b, c) && near(a, c)) {
    const ctr = [V[a][0] + V[b][0] + V[c][0], V[a][1] + V[b][1] + V[c][1], V[a][2] + V[b][2] + V[c][2]];
    F.push(dot3(cross(sub3(V[b], V[a]), sub3(V[c], V[a])), ctr) > 0 ? [a, b, c] : [a, c, b]);
  }
  const FP = new Int8Array(30).fill(-1), FM = new Int8Array(30).fill(-1);
  E.forEach(([a, b], s) => F.forEach((f, i) => { for (let q = 0; q < 3; q++) { if (f[q] === a && f[(q + 1) % 3] === b) FP[s] = i; if (f[q] === b && f[(q + 1) % 3] === a) FM[s] = i; } }));
  const FC = F.map(([a, b, c]) => [(V[a][0] + V[b][0] + V[c][0]) / 3, (V[a][1] + V[b][1] + V[c][1]) / 3, (V[a][2] + V[b][2] + V[c][2]) / 3]);
  return { V, E, F, FP, FM, FC };
}
const ICO = buildIcosa();

// The cells of the geodesic icosahedral tower: 20 * 4^level triangles. The children of cell c are 4c .. 4c + 3 and the
// central child is 4c + 3. N lists the pairs of cells that share an edge: every cell has three neighbours.
function buildGeodesic(level) {
  let V = ICO.V.map((v) => v.slice()), Tr = ICO.F.map((f) => f.slice());
  for (let l = 0; l < level; l++) {
    const mid = new Map(), next = [];
    const m = (a, b) => { const k = a < b ? a * 65536 + b : b * 65536 + a; let i = mid.get(k); if (i === undefined) { i = V.length; V.push(unit([V[a][0] + V[b][0], V[a][1] + V[b][1], V[a][2] + V[b][2]])); mid.set(k, i); } return i; };
    for (const [a, b, c] of Tr) { const ab = m(a, b), bc = m(b, c), ca = m(c, a); next.push([a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]); }
    Tr = next;
  }
  const C = Tr.map(([a, b, c]) => unit([V[a][0] + V[b][0] + V[c][0], V[a][1] + V[b][1] + V[c][1], V[a][2] + V[b][2] + V[c][2]]));
  const edge = new Map(), N = [];
  Tr.forEach((tri, i) => { for (let q = 0; q < 3; q++) { const a = tri[q], b = tri[(q + 1) % 3], k = a < b ? a * 65536 + b : b * 65536 + a; if (edge.has(k)) N.push([edge.get(k), i]); else edge.set(k, i); } });
  return { level, V, T: Tr, C, N };
}

// Law C with the declared Z6 register on one closed carrier, exactly as the run's kernel (oph_defects/kernels.py):
//   t = x_a + x_b; x_a' = ceil(t/2) if the coin is 1, else floor(t/2); x_b' = t - x_a'; current j = x_a - x_a';
//   a repair with j != 0 and contrast d = x_a - x_b proposes delta = j mod 6: class[FP] += delta, class[FM] -= delta;
//   it is applied when cost[new] - cost[old] <= kappa * j * (d - j), with cost (0, 5, 8, 10, 8, 5) and kappa = 5.
const COST = [0, 5, 8, 10, 8, 5], KAPPA = 5;
class CarrierRun {
  constructor(seed = 1) { this.rand = rng(seed); this.x = new Int8Array(12); this.reg = new Int8Array(30); this.cls = new Int8Array(20); this.prepare(); }
  prepare() { for (let p = 0; p < 12; p++) this.x[p] = Math.floor(this.rand() * 6); this.reg.fill(0); this.cls.fill(0); this.attempts = 0; this.moved = 0; return this; }
  attempt() {
    const { x, reg, cls } = this, s = Math.floor(this.rand() * 30), coin = this.rand() < 0.5 ? 1 : 0, [a, b] = ICO.E[s];
    const xi = x[a], xj = x[b], tot = xi + xj, lo = tot >> 1, hi = tot - lo, ni = coin ? hi : lo, nj = tot - ni, d = xi - xj, cur = xi - ni;
    const ev = { s, a, b, coin, xi, xj, ni, nj, tot, d, cur, delta: 0, twist: 0, de: 0, work: 0, fp: ICO.FP[s], fm: ICO.FM[s], k1: 0, k2: 0, n1: 0, n2: 0 };
    this.attempts++;
    if (cur !== 0) {
      x[a] = ni; x[b] = nj; this.moved++;
      const delta = mod(cur, 6), k1 = cls[ev.fp], k2 = cls[ev.fm], n1 = (k1 + delta) % 6, n2 = mod(k2 - delta, 6);
      ev.delta = delta; ev.k1 = k1; ev.k2 = k2; ev.n1 = n1; ev.n2 = n2;
      ev.de = COST[n1] + COST[n2] - COST[k1] - COST[k2]; ev.work = KAPPA * cur * (d - cur);
      if (ev.de <= ev.work) { reg[s] = (reg[s] + delta) % 6; cls[ev.fp] = n1; cls[ev.fm] = n2; ev.twist = delta; } else ev.twist = -delta;
    }
    return ev;
  }
  // the next attempt that moves a current; holds are counted and skipped
  repair(limit = 400) { let holds = 0, ev = this.attempt(); while (ev.cur === 0 && holds < limit) { holds++; ev = this.attempt(); } ev.holds = holds; return ev; }
  total() { let s = 0; for (let p = 0; p < 12; p++) s += this.x[p]; return s; }
  V() { let s = 0; for (let p = 0; p < 12; p++) s += this.x[p] * this.x[p]; return s; }
  classSum() { let s = 0; for (let f = 0; f < 20; f++) s += this.cls[f]; return s % 6; }
  defects() { let n = 0; for (let f = 0; f < 20; f++) if (this.cls[f]) n++; return n; }
}

// A honeycomb patch of the screen: vertices are carriers, edges are glue seams, hexagons are the screen plaquettes.
// The Z6 register has one link per glue seam, and the class of a plaquette is the oriented sum of its links mod 6.
function buildHoneycomb(R) {
  const hexes = [], verts = [], edges = [], vid = new Map(), eid = new Map();
  const key = (x, y) => Math.round(x * 1000) + ',' + Math.round(y * 1000);
  for (let q = -R; q <= R; q++) for (let r = Math.max(-R, -q - R); r <= Math.min(R, -q + R); r++) {
    const cx = Math.sqrt(3) * (q + r / 2), cy = 1.5 * r, vs = [];
    for (let i = 0; i < 6; i++) { const a = TAU * i / 6 + TAU / 12, x = cx + Math.cos(a), y = cy + Math.sin(a), k = key(x, y); if (!vid.has(k)) { vid.set(k, verts.length); verts.push([x, y]); } vs.push(vid.get(k)); }
    hexes.push({ q, r, cx, cy, vs, es: [], sg: [], nb: [], ring: Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) });
  }
  hexes.forEach((h, hi) => { for (let i = 0; i < 6; i++) {
    const a = h.vs[i], b = h.vs[(i + 1) % 6], k = Math.min(a, b) + ':' + Math.max(a, b);
    if (!eid.has(k)) { eid.set(k, edges.length); edges.push({ a: Math.min(a, b), b: Math.max(a, b), h: [] }); }
    const e = eid.get(k); edges[e].h.push(hi); h.es.push(e); h.sg.push(a < b ? 1 : -1);
  } });
  for (const h of hexes) h.nb = h.es.map((e, i) => { const o = edges[e].h; return o.length === 2 ? (hexes[o[0]] === h ? o[1] : o[0]) : -1; });
  return { R, hexes, verts, edges };
}
class PatchRegister {
  constructor(R = 3) { this.g = buildHoneycomb(R); this.reg = new Int8Array(this.g.edges.length); }
  cls(h) { const H = this.g.hexes[h]; let s = 0; for (let i = 0; i < 6; i++) s += H.sg[i] * this.reg[H.es[i]]; return mod(s, 6); }
  twist(e, delta) { this.reg[e] = mod(this.reg[e] + delta, 6); }
  // a pair birth across side i of hexagon h: this hexagon gets class k, its neighbour the conjugate class
  birth(h, i, k) { const H = this.g.hexes[h]; this.twist(H.es[i], H.sg[i] * k); }
  // the whole class of hexagon h crosses its side i into the neighbouring hexagon
  hop(h, i) { const H = this.g.hexes[h]; this.twist(H.es[i], -H.sg[i] * this.cls(h)); }
  sum() { let s = 0; for (let h = 0; h < this.g.hexes.length; h++) s += this.cls(h); return s % 6; }
  defects() { const out = []; for (let h = 0; h < this.g.hexes.length; h++) { const k = this.cls(h); if (k) out.push([h, k]); } return out; }
}

// A Z_N link ensemble on a periodic cubic lattice of L^3 sites with the plaquette weight exp(kappa * sum_p Re W_p),
// sampled by heat bath (the weight and the measurements of repair-law/work/SIM/cf1/gauge/gauge_mc.py, report MA).
class GaugeZN {
  constructor(N, L, kappa, seed = 7) {
    this.N = N; this.L = L; this.kappa = kappa; this.rand = rng(seed); const V = this.V = L * L * L;
    this.u = new Int8Array(3 * V); this.sweeps = 0;
    this.cos = Float64Array.from({ length: N }, (_, n) => Math.cos(TAU * n / N));
    this.fwd = [new Int32Array(V), new Int32Array(V), new Int32Array(V)]; this.bwd = [new Int32Array(V), new Int32Array(V), new Int32Array(V)];
    for (let z = 0; z < L; z++) for (let y = 0; y < L; y++) for (let x = 0; x < L; x++) {
      const i = (z * L + y) * L + x;
      this.fwd[0][i] = (z * L + y) * L + (x + 1) % L; this.bwd[0][i] = (z * L + y) * L + (x + L - 1) % L;
      this.fwd[1][i] = (z * L + (y + 1) % L) * L + x; this.bwd[1][i] = (z * L + (y + L - 1) % L) * L + x;
      this.fwd[2][i] = (((z + 1) % L) * L + y) * L + x; this.bwd[2][i] = (((z + L - 1) % L) * L + y) * L + x;
    }
    this.cnt = new Int32Array(N); this.p = new Float64Array(N);
  }
  site(x, y, z) { const L = this.L; return (mod(z, L) * L + mod(y, L)) * L + mod(x, L); }
  // exponent of the plaquette at site i in the plane (mu, nu): W = exp(2 pi i * plaq / N)
  plaq(i, mu, nu) { const u = this.u; return mod(u[3 * i + mu] + u[3 * this.fwd[mu][i] + nu] - u[3 * this.fwd[nu][i] + mu] - u[3 * i + nu], this.N); }
  update(i, mu) {
    const { u, N, fwd, bwd, cnt, p, cos, kappa } = this; cnt.fill(0);
    for (let nu = 0; nu < 3; nu++) if (nu !== mu) {
      cnt[mod(u[3 * fwd[mu][i] + nu] - u[3 * fwd[nu][i] + mu] - u[3 * i + nu], N)]++;          // the plaquette above the link
      const j = bwd[nu][i]; cnt[mod(u[3 * j + nu] - u[3 * j + mu] - u[3 * fwd[mu][j] + nu], N)]++;   // the plaquette below it
    }
    let tot = 0;
    for (let n = 0; n < N; n++) { let s = 0; for (let m = 0; m < N; m++) if (cnt[m]) s += cnt[m] * cos[(n + m) % N]; tot += (p[n] = Math.exp(kappa * s)); }
    let r = this.rand() * tot, n = 0; while (n < N - 1 && r >= p[n]) { r -= p[n]; n++; }
    u[3 * i + mu] = n;
  }
  sweep(k = 1) { for (let q = 0; q < k; q++) { for (let i = 0; i < this.V; i++) for (let mu = 0; mu < 3; mu++) this.update(i, mu); this.sweeps++; } return this; }
  // mean Re W, the number of nontrivial plaquettes and the action S = kappa * sum_p (1 - Re W_p)
  measure() {
    let re = 0, non = 0; const planes = [[0, 1], [0, 2], [1, 2]];
    for (let i = 0; i < this.V; i++) for (const [mu, nu] of planes) { const w = this.plaq(i, mu, nu); re += this.cos[w]; if (w) non++; }
    const P = 3 * this.V; return { reW: re / P, nontrivial: non, plaquettes: P, S: this.kappa * (P - re) };
  }
}

// The routing tick on one axis: a two-component walk with the shift (right mover, left mover) and the mass step
// exp(-i theta beta). Its dispersion is exactly cos E = cos(theta) cos(p) (CF1.md section 4 item 2).
class DiracWalk {
  constructor(n, theta) { this.n = n; this.theta = theta; this.ar = new Float64Array(n); this.ai = new Float64Array(n); this.br = new Float64Array(n); this.bi = new Float64Array(n);
    this.t = [new Float64Array(n), new Float64Array(n), new Float64Array(n), new Float64Array(n)]; this.ticks = 0; this.peak0 = 1; }
  energy(p) { return Math.acos(Math.cos(this.theta) * Math.cos(p)); }
  velocity(p) { const E = this.energy(p); return E < 1e-12 ? 1 : Math.cos(this.theta) * Math.sin(p) / Math.sin(E); }
  // a Gaussian packet of rms width sigma around x0 with wave number p0 on the positive branch of the tick at p0
  packet(x0, sigma, p0) {
    const { n, theta } = this, c = Math.cos(theta), s = Math.sin(theta), E = this.energy(p0);
    let v2r = 0, v2i = 0;                                   // v = (1, v2) with (c e^{-ip} - e^{-iE}) - i s e^{ip} v2 = 0
    if (Math.abs(s) > 1e-12) { const nr = c * Math.cos(p0) - Math.cos(E), ni = -c * Math.sin(p0) + Math.sin(E), dr = -s * Math.sin(p0), di = s * Math.cos(p0);
      const den = dr * dr + di * di; v2r = (nr * dr + ni * di) / den; v2i = (ni * dr - nr * di) / den; }
    let norm = 0;
    for (let x = 0; x < n; x++) {
      let dx = x - x0; dx -= n * Math.round(dx / n);
      const g = Math.exp(-dx * dx / (4 * sigma * sigma)), cr = g * Math.cos(p0 * dx), ci = g * Math.sin(p0 * dx);
      this.ar[x] = cr; this.ai[x] = ci; this.br[x] = cr * v2r - ci * v2i; this.bi[x] = cr * v2i + ci * v2r;
      norm += this.ar[x] ** 2 + this.ai[x] ** 2 + this.br[x] ** 2 + this.bi[x] ** 2;
    }
    const f = 1 / Math.sqrt(norm); for (let x = 0; x < n; x++) { this.ar[x] *= f; this.ai[x] *= f; this.br[x] *= f; this.bi[x] *= f; }
    this.ticks = 0; this.peak0 = 0; for (let x = 0; x < n; x++) this.peak0 = Math.max(this.peak0, this.density(x)); return this;
  }
  tick() {
    const { n, ar, ai, br, bi } = this, [sr, si, tr, ti] = this.t, c = Math.cos(this.theta), s = Math.sin(this.theta);
    for (let x = 0; x < n; x++) { const m = x === 0 ? n - 1 : x - 1, q = x === n - 1 ? 0 : x + 1; sr[x] = ar[m]; si[x] = ai[m]; tr[x] = br[q]; ti[x] = bi[q]; }
    for (let x = 0; x < n; x++) { ar[x] = c * sr[x] + s * ti[x]; ai[x] = c * si[x] - s * tr[x]; br[x] = c * tr[x] + s * si[x]; bi[x] = c * ti[x] - s * sr[x]; }
    this.ticks++; return this;
  }
  density(x) { return this.ar[x] ** 2 + this.ai[x] ** 2 + this.br[x] ** 2 + this.bi[x] ** 2; }
  norm() { let s = 0; for (let x = 0; x < this.n; x++) s += this.density(x); return s; }
  mean() { let c = 0, s = 0; const w = TAU / this.n; for (let x = 0; x < this.n; x++) { const d = this.density(x); c += d * Math.cos(w * x); s += d * Math.sin(w * x); } return mod(Math.atan2(s, c) / w, this.n); }
}

// The three rest rates of the charged-lepton register: characters 1, w, w^2 of the face third-turn are tau,
// electron, muon; at theta = 2/9 the ratios are 206.770316 and 3477.4728 (LEPTON_STEPS.md, lepton_register_round).
const leptonRate = (k, theta = 2 / 9) => (1 + Math.SQRT2 * Math.cos(theta + TAU * k / 3)) ** 2 / 27;
const leptonRates = (theta = 2 / 9) => ({ tau: leptonRate(0, theta), e: leptonRate(1, theta), mu: leptonRate(2, theta) });
const READ = { p: 1 / 12, q: 1 / 6, count: 1 / 12 + 1 / 6 - 2 * (1 / 12) * (1 / 6) };

// class of a multiplet of hypercharge Y, and the plaquette count 8 pi^2 / tr H^2 of one flux quantum of class k:
// the shortest traceless lift of the central element exp(2 pi i k Y), Y = diag(-1/3, -1/3, -1/3, 1/2, 1/2)
const classOf = (Y) => mod(Math.round(6 * Y), 6);
function fluxCount(k) {
  const ph = [-2 * k / 3, -2 * k / 3, -2 * k / 3, k, k]; let best = Infinity;
  const go = (i, sum, sq) => {
    if (i === 5) { if (Math.abs(sum) < 1e-9 && sq < best) best = sq; return; }
    for (let m = -4; m <= 4; m++) { const x = ph[i] + 2 * m; go(i + 1, sum + x, sq + x * x); }
  };
  go(0, 0, 0); return 8 / best;
}
// the declared chain (COUPLING_FIX.md section 2, reports LV and HD); energies in GeV
// v is the chain's stated value; the rounded inputs printed here reproduce it within 0.01 percent (vFromInputs)
const CHAIN = { Ecell: 9.5599e18, invAlphaU: 24.3166, MU: 2.4736e16, v: 246.60, Lambda3: 0.340 };
CHAIN.vFromInputs = CHAIN.Ecell * Math.exp(-TAU * CHAIN.invAlphaU / 4);

export const ENGINES = { rng, ICO, buildGeodesic, CarrierRun, COST, KAPPA, buildHoneycomb, PatchRegister, GaugeZN, DiracWalk, leptonRate, leptonRates, READ, classOf, fluxCount, CHAIN };

// ================================================================================================ drawing kit
const FONT = 'Inter,"SF Pro Text","Helvetica Neue",Helvetica,Arial,sans-serif';
const C = { teal: '63,224,208', amber: '255,180,74', violet: '169,149,255', green: '95,227,161', red: '255,100,128', blue: '111,177,255',
  text: '238,242,251', soft: '197,208,230', muted: '147,163,192', line: '120,150,215', hot: '255,157,74', cold: '77,141,255', birth: '255,228,92' };
const KRGB = { 0: '159,176,207', 1: '255,122,69', 5: '255,122,69', 4: '255,179,71', 2: '255,179,71', 3: '62,230,168' }, KRIM = '76,195,255';
const KSHAPE = { 0: 'flat', 1: 'disc', 5: 'ring', 4: 'disc', 2: 'ring', 3: 'duo' };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rgba = (c, a) => `rgba(${c},${clamp(a, 0, 1).toFixed(3)})`;
const ease = (f) => { f = clamp(f, 0, 1); return f * f * (3 - 2 * f); };
const ramp = (x, a, b) => ease((x - a) / (b - a));                              // 0 below a, 1 above b
const band = (x, a, b, e) => ramp(x, a, a + e) * (1 - ramp(x, b - e, b));        // 1 inside [a, b] with soft edges of width e

const shrink = (w, max) => (max && w > max ? Math.max(0.6, max / w) : 1);     // o.max: the largest width a text may take
function text(g, s, x, y, o = {}) {
  let size = o.size || 11; g.font = `${o.weight || 500} ${size}px ${FONT}`;
  if (o.max) { const k = shrink(g.measureText(s).width, o.max); if (k < 1) { size *= k; g.font = `${o.weight || 500} ${size}px ${FONT}`; } }
  g.textAlign = o.align || 'left'; g.textBaseline = o.base || 'alphabetic'; g.fillStyle = o.color || rgba(C.soft, 0.85); g.fillText(s, x, y);
}
function cap(g, s, x, y, o = {}) {          // a small caption in capitals
  const up = String(s).toUpperCase(); let size = o.size || 9;
  g.save(); g.font = `650 ${size}px ${FONT}`; try { g.letterSpacing = '1.3px'; } catch (e) { /* older canvas */ }
  if (o.max) { const k = shrink(g.measureText(up).width, o.max); if (k < 1) { size *= k; g.font = `650 ${size}px ${FONT}`; } }
  g.textAlign = o.align || 'left'; g.textBaseline = 'alphabetic'; g.fillStyle = o.color || 'rgba(160,178,210,.6)'; g.fillText(up, x, y); g.restore();
}
function rich(g, s, x, y, o = {}) {         // text with _{sub} and ^{sup}
  const size = o.size || 11, parts = [], re = /([_^])\{([^}]*)\}|([^_^]+)|([_^])/g; let m;
  while ((m = re.exec(s))) parts.push(m[1] ? [m[2], m[1]] : [m[3] || m[4], '']);
  const font = (k) => `${o.weight || 500} ${k ? size * 0.72 : size}px ${FONT}`;
  let w = 0; for (const [tx, k] of parts) { g.font = font(k); w += g.measureText(tx).width; }
  if (o.max && w > o.max) return rich(g, s, x, y, { ...o, size: size * shrink(w, o.max), max: 0 });
  let cx = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillStyle = o.color || rgba(C.soft, 0.9);
  for (const [tx, k] of parts) { g.font = font(k); g.fillText(tx, cx, y + (k === '_' ? size * 0.28 : k === '^' ? -size * 0.38 : 0)); cx += g.measureText(tx).width; }
  return w;
}
const sprites = new Map();
function glow(rgb) {
  let s = sprites.get(rgb); if (s) return s;
  s = document.createElement('canvas'); s.width = s.height = 64; const q = s.getContext && s.getContext('2d');
  if (q) { const gr = q.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(0.22, `rgba(${rgb},.85)`); gr.addColorStop(0.5, `rgba(${rgb},.22)`); gr.addColorStop(1, `rgba(${rgb},0)`); q.fillStyle = gr; q.fillRect(0, 0, 64, 64); }
  sprites.set(rgb, s); return s;
}
function spot(g, rgb, x, y, r, a = 1) { if (a <= 0.004 || r <= 0) return; g.globalAlpha = clamp(a, 0, 1); g.drawImage(glow(rgb), x - r, y - r, 2 * r, 2 * r); g.globalAlpha = 1; }
function glyph(g, k, x, y, r, a = 1) {       // the class symbols of the site: disc, ring, two-tone, dashed
  if (a <= 0.004) return; const rgb = KRGB[k], sh = KSHAPE[k];
  g.save(); g.globalAlpha = clamp(a, 0, 1); g.shadowColor = `rgb(${rgb})`; g.shadowBlur = sh === 'flat' ? 0 : 10;
  if (sh === 'ring') { g.strokeStyle = `rgb(${rgb})`; g.lineWidth = r * 0.42; g.beginPath(); g.arc(x, y, r * 0.8, 0, TAU); g.stroke(); }
  else if (sh === 'duo') { g.fillStyle = `rgb(${rgb})`; g.beginPath(); g.arc(x, y, r * 0.6, 0, TAU); g.fill(); g.strokeStyle = `rgb(${KRIM})`; g.lineWidth = r * 0.24; g.beginPath(); g.arc(x, y, r * 1.02, 0, TAU); g.stroke(); }
  else if (sh === 'flat') { g.strokeStyle = `rgb(${rgb})`; g.lineWidth = Math.max(1, r * 0.16); g.setLineDash([2.5, 2.5]); g.beginPath(); g.arc(x, y, r * 0.8, 0, TAU); g.stroke(); g.setLineDash([]); }
  else { g.fillStyle = `rgb(${rgb})`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
  g.restore();
}
function arrowHead(g, x, y, ang, s, col) { g.save(); g.translate(x, y); g.rotate(ang); g.fillStyle = col; g.beginPath(); g.moveTo(0, 0); g.lineTo(-s, -s * 0.5); g.lineTo(-s, s * 0.5); g.closePath(); g.fill(); g.restore(); }
function camera(yaw, pitch) {
  const ca = Math.cos(yaw), sa = Math.sin(yaw), cb = Math.cos(pitch), sb = Math.sin(pitch);
  return (v) => { const x = v[0] * ca + v[2] * sa, z = -v[0] * sa + v[2] * ca; return [x, v[1] * cb - z * sb, v[1] * sb + z * cb]; };
}
// the screen as a globe of cells joined by glue seams; P receives the projected cells (x, y, depth)
function drawGlobe(g, geo, P, cx, cy, R, yaw, o = {}) {
  const cam = camera(yaw, o.pitch ?? 0.38);
  for (let i = 0; i < geo.C.length; i++) { const p = cam(geo.C[i]); P[3 * i] = cx + p[0] * R; P[3 * i + 1] = cy - p[1] * R; P[3 * i + 2] = p[2]; }
  g.globalCompositeOperation = 'lighter'; spot(g, C.cold, cx, cy, R * 1.55, 0.13); g.globalCompositeOperation = 'source-over';
  g.lineWidth = o.lw || 0.7;
  for (const pass of [0, 1]) {
    g.strokeStyle = rgba(C.line, pass ? (o.seam || 0.36) : 0.07); g.beginPath();
    for (const [i, j] of geo.N) { if ((P[3 * i + 2] + P[3 * j + 2] > 0) !== !!pass) continue; g.moveTo(P[3 * i], P[3 * i + 1]); g.lineTo(P[3 * j], P[3 * j + 1]); }
    g.stroke();
  }
  const s = o.dot || 1.1;
  for (let i = 0; i < geo.C.length; i++) { const z = P[3 * i + 2]; g.fillStyle = rgba(C.text, z > 0 ? 0.3 + 0.55 * z : 0.09); g.beginPath(); g.arc(P[3 * i], P[3 * i + 1], z > 0 ? s : s * 0.7, 0, TAU); g.fill(); }
}

// ================================================================================================ the picture
// One continuous picture in a fixed coordinate system of VW x VH units, scaled to the canvas. From left to right:
// the screen with its observers, the defects, the lattice reading, the field, the cooling universe, the particle
// classes and the masses. Z are the boundaries of the seven zones; their widths are in the ratio 2:1:1:2:1:1:1.
const VW = 1620, VH = 384, Z = [0, 360, 540, 720, 1080, 1260, 1440, 1620], UNITS = [2, 1, 1, 2, 1, 1, 1];
const Y0 = 236, WD = 80, SKEW = 0.56, TILT = 0.5, R3 = Math.sqrt(3);
const pr = (u, w, h = 0) => [u + SKEW * w, Y0 + TILT * w - h];                 // the ribbon plane in oblique projection
const NET = { u0: 172, s: 12.8, cols: 18, rows: 8 }, LAT = { u0: 540, a: 20, cols: 10, rows: 8 }, SUR = { u0: 706, u1: 1262 }, FIELD = { u0: 730, len: 520 };
const GLOBE = { x: 92, y: 128, r: 76 }, WHEEL = { x: 1350, y: 186, r: 50 }, CLOCK = { x: 1542, ys: [92, 186, 280], r: 25 };
const CYCLE = 46, EW_U = 1128, QCD_U = 1196;

function buildStrip(cols, rows) {            // a strip of the honeycomb net: vertices are observers, edges glue seams, hexagons plaquettes
  const hexes = [], verts = [], edges = [], vid = new Map(), eid = new Map();
  const key = (x, y) => Math.round(x * 1000) + ',' + Math.round(y * 1000);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const cx = R3 * (c + 0.5 * (r & 1)), cy = 1.5 * r, vs = [];
    for (let i = 0; i < 6; i++) { const a = TAU * i / 6 + TAU / 12, x = cx + Math.cos(a), y = cy + Math.sin(a), k = key(x, y); if (!vid.has(k)) { vid.set(k, verts.length); verts.push([x, y]); } vs.push(vid.get(k)); }
    hexes.push({ col: c, row: r, cx, cy, vs, es: [], sg: [], nb: [] });
  }
  hexes.forEach((h, hi) => { for (let i = 0; i < 6; i++) {
    const a = h.vs[i], b = h.vs[(i + 1) % 6], k = Math.min(a, b) + ':' + Math.max(a, b);
    if (!eid.has(k)) { eid.set(k, edges.length); edges.push({ a: Math.min(a, b), b: Math.max(a, b), h: [] }); }
    const e = eid.get(k); edges[e].h.push(hi); h.es.push(e); h.sg.push(a < b ? 1 : -1);
  } });
  hexes.forEach((h, hi) => { h.nb = h.es.map((e) => { const o = edges[e].h; return o.length === 2 ? (o[0] === hi ? o[1] : o[0]) : -1; }); });
  return { cols, rows, hexes, verts, edges };
}
function makeScene(seed = 20261111) {
  const S = { rand: rng(seed), last: null, acc: 0, c0: 0, cycles: 0, nAtt: 0, nRep: 0 };
  S.geo = buildGeodesic(2); S.gP = new Float32Array(3 * S.geo.C.length); S.gPulse = [];
  const net = S.net = buildStrip(NET.cols, NET.rows), n = net.verts.length;
  S.U = new Float32Array(n); S.Wp = new Float32Array(n); S.PX = new Float32Array(n); S.PY = new Float32Array(n); S.nA = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const u = NET.u0 + NET.s * (net.verts[i][0] + R3 / 2), w = -WD + NET.s * (net.verts[i][1] + 1), p = pr(u, w);
    S.U[i] = u; S.Wp[i] = w; S.PX[i] = p[0]; S.PY[i] = p[1]; S.nA[i] = band(u, NET.u0 - 6, NET.u0 + NET.s * R3 * (NET.cols + 0.6), 44);
  }
  for (const h of net.hexes) { h.u = NET.u0 + NET.s * (h.cx + R3 / 2); h.w = -WD + NET.s * (h.cy + 1); const p = pr(h.u, h.w); h.px = p[0]; h.py = p[1]; }
  S.eBin = net.edges.map((e) => Math.round(3 * Math.min(S.nA[e.a], S.nA[e.b])));
  S.x = new Int8Array(n); S.reg = new Int8Array(net.edges.length); S.pulses = [];
  S.obs = [[236, -36], [288, 30], [338, -10]].map(([u, w]) => { let best = 0, bd = 1e9; for (let i = 0; i < n; i++) { const d = (S.U[i] - u) ** 2 + (S.Wp[i] - w) ** 2; if (d < bd) { bd = d; best = i; } } return { node: best, tape: [], last: -9 }; });
  S.obsOf = new Map(S.obs.map((o, i) => [o.node, i]));
  S.fobs = [[810, -36, 118], [864, 28, 150], [977, -12, 130]].map(([u, w, h]) => ({ u, w, h, tape: [0, 0, 0, 0, 0, 0, 0], click: -9 }));
  S.tapeAt = 0;
  S.hadrons = Array.from({ length: 7 }, (_, i) => ({ u: Z[4] + 10 + i * 24.5, w: -52 + ((i * 37) % 104), ph: i * 1.7, h: 34 + ((i * 23) % 26) }));
  newCycle(S, 0);
  return S;
}
function newCycle(S, t) {
  S.c0 = t; S.cycles++;
  for (let i = 0; i < S.x.length; i++) S.x[i] = Math.floor(S.rand() * 6);          // the preparation of the runs: loads 0 to 5
  S.reg.fill(0); S.pulses.length = 0; S.mob = null; S.par = null; S.trail = []; S.lat = null; S.birth = null;
  S.sheets = [0, 1].map(() => Array.from({ length: 3 }, () => [1 + Math.floor(S.rand() * (LAT.cols - 3)), Math.floor(S.rand() * LAT.rows), 1 + Math.floor(S.rand() * 5)]));
}
const netCls = (S, h) => { const H = S.net.hexes[h]; let s = 0; for (let i = 0; i < 6; i++) s += H.sg[i] * S.reg[H.es[i]]; return mod(s, 6); };
const fieldU = (t) => FIELD.u0 + ((t * 52) % FIELD.len);                                    // where the excitation of the field is
function fieldH(u, w, t) {                                                        // height of the field surface
  const up = fieldU(t), du = u - up, env = band(up, FIELD.u0, FIELD.u0 + FIELD.len, 40);
  let h = 30 * env * Math.exp(-(du * du) / 1800 - (w * w) / 2300) * (0.72 + 0.28 * Math.cos(0.21 * du));
  const hot = 1 - ramp(u, Z[4], Z[4] + 150); if (u > Z[4] - 20) h += ramp(u, Z[4] - 20, Z[4] + 15) * hot * 3.4 * Math.sin(0.11 * u + 2.3 * t + 0.07 * w) * Math.cos(0.09 * w - 1.7 * t);
  return h;
}
function attempt(S, t) {                                                          // one attempt of law C on a seam of the net
  const net = S.net, e = Math.floor(S.rand() * net.edges.length), E = net.edges[e], coin = S.rand() < 0.5 ? 1 : 0;
  const xi = S.x[E.a], xj = S.x[E.b], tot = xi + xj, lo = tot >> 1, hi = tot - lo, ni = coin ? hi : lo, d = xi - xj, cur = xi - ni;
  S.nAtt++; if (!cur) return;
  S.x[E.a] = ni; S.x[E.b] = tot - ni; S.nRep++;
  if (S.pulses.length < 240) S.pulses.push({ e, t, big: Math.abs(d) >= 2, dir: cur > 0 ? 1 : -1 });
  for (const node of [E.a, E.b]) { const oi = S.obsOf.get(node); if (oi !== undefined) { const o = S.obs[oi]; if (t - o.last > 0.22) { o.last = t; o.tape.push({ t, j: node === E.a ? cur : -cur }); if (o.tape.length > 9) o.tape.shift(); } } }
}
function advance(S, t) {
  if (S.last === null) { S.last = t - 1 / 60; S.c0 = t; } else if (t === S.last) return;      // several canvases may draw the same frame
  const dt = clamp(t - S.last, 0, 0.1); S.last = t;
  if (t - S.c0 > CYCLE) newCycle(S, t);
  const tc = t - S.c0, net = S.net;
  S.acc += dt * 950; let guard = 0; while (S.acc >= 1 && guard++ < 400) { S.acc -= 1; attempt(S, t); }
  if (S.acc > 400) S.acc = 0;
  while (S.pulses.length && t - S.pulses[0].t > 0.7) S.pulses.shift();
  // the followed pair: born across one seam, then the class-1 defect wanders and enters the lattice reading
  if (!S.mob && !S.lat && tc > 2.2) {
    const hb = 4 * NET.cols + 8, H = net.hexes[hb], i = H.nb.findIndex((nb) => nb >= 0 && net.hexes[nb].cx - H.cx > 1.5);
    S.reg[H.es[i]] = mod(-H.sg[i], 6); S.par = { h: hb }; S.mob = { h: H.nb[i], from: hb, t }; S.birth = { t, x: (H.px + net.hexes[H.nb[i]].px) / 2, y: (H.py + net.hexes[H.nb[i]].py) / 2 };
  } else if (S.mob && !S.lat && t - S.mob.t > 0.85) {
    const H = net.hexes[S.mob.h];
    if (H.col >= 15) { S.lat = { c: 0, r: clamp(Math.floor((H.w + WD) / LAT.a), 0, LAT.rows - 1), t, from: [H.px, H.py], path: [], t0: t }; }
    else {
      const opts = []; let sum = 0;
      for (let i = 0; i < 6; i++) { const nb = H.nb[i]; if (nb < 0 || nb === S.par.h) continue; const G = net.hexes[nb]; if (G.row < 1 || G.row > NET.rows - 2 || G.col < 1) continue;
        const dx = G.cx - H.cx, w = dx > 1.5 ? 3.4 : dx > 0.5 ? 2 : dx < -1.5 ? 0.15 : 0.45; opts.push([i, w]); sum += w; }
      let r = S.rand() * sum, pick = opts[0][0]; for (const [i, w] of opts) { if (r < w) { pick = i; break; } r -= w; }
      S.reg[H.es[pick]] = mod(S.reg[H.es[pick]] - H.sg[pick], 6);                 // the class crosses this seam: one link changes
      S.trail.push({ x: H.px, y: H.py, t }); if (S.trail.length > 16) S.trail.shift();
      S.mob = { h: H.nb[pick], from: S.mob.h, t };
    }
  } else if (S.lat && S.lat.c < 4 && t - S.lat.t > 1.05) { S.lat.path.push({ c: S.lat.c + 1, r: S.lat.r }); S.lat.c++; S.lat.t = t; }
  // the records of the field observers: one discrete value per interval
  if (t - S.tapeAt > 0.42) { S.tapeAt = t; for (const o of S.fobs) { o.tape.shift(); o.tape.push(Math.round(3 * clamp(fieldH(o.u, o.w, t) / 26, 0, 1))); if (fieldH(o.u, o.w, t) > 21 && t - o.click > 2) o.click = t; } }
  // pulses on the globe
  if (S.gPulse.length < 26 && S.rand() < dt * 16) S.gPulse.push({ k: Math.floor(S.rand() * S.geo.N.length), t });
  while (S.gPulse.length && t - S.gPulse[0].t > 0.8) S.gPulse.shift();
}

function drawJourney(g, t, S) {
  advance(S, t);
  const net = S.net, tc = t - S.c0, fadeC = band(tc, 0, CYCLE, 1.6);
  // ---- the screen as a whole, and the patch that the ribbon magnifies
  drawGlobe(g, S.geo, S.gP, GLOBE.x, GLOBE.y, GLOBE.r, t * 0.16);
  for (const p of S.gPulse) { const [i, j] = S.geo.N[p.k], P = S.gP; if (P[3 * i + 2] < 0.05 || P[3 * j + 2] < 0.05) continue; const f = (t - p.t) / 0.8;
    g.strokeStyle = rgba(C.teal, 0.9 * (1 - f)); g.lineWidth = 1.5; g.beginPath(); g.moveTo(P[3 * i], P[3 * i + 1]); g.lineTo(P[3 * j], P[3 * j + 1]); g.stroke(); }
  { const px = GLOBE.x + 40, py = GLOBE.y + 36, a = pr(NET.u0 + 6, -WD), b = pr(NET.u0 + 6, WD);
    g.strokeStyle = rgba(C.teal, 0.55); g.lineWidth = 1; g.beginPath(); g.arc(px, py, 11, 0, TAU); g.stroke();
    g.strokeStyle = rgba(C.teal, 0.2); g.setLineDash([3, 4]); g.beginPath(); g.moveTo(px + 6, py - 9); g.lineTo(a[0], a[1]); g.moveTo(px - 4, py + 10); g.lineTo(b[0], b[1]); g.stroke(); g.setLineDash([]); }
  // ---- a faint ground under the whole ribbon
  { const a = pr(NET.u0, -WD), b = pr(SUR.u1, -WD), c = pr(SUR.u1, WD), d = pr(NET.u0, WD), gr = g.createLinearGradient(a[0], 0, b[0], 0);
    gr.addColorStop(0, 'rgba(70,110,200,0)'); gr.addColorStop(0.08, 'rgba(70,110,200,.07)'); gr.addColorStop(0.9, 'rgba(70,110,200,.06)'); gr.addColorStop(1, 'rgba(70,110,200,0)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(c[0], c[1]); g.lineTo(d[0], d[1]); g.closePath(); g.fill(); }
  // ---- the net of observers: glue seams, repairs, loads
  g.lineWidth = 0.9;
  for (let bin = 1; bin <= 3; bin++) { g.strokeStyle = rgba(C.line, 0.1 * bin); g.beginPath(); net.edges.forEach((E, e) => { if (S.eBin[e] !== bin) return; g.moveTo(S.PX[E.a], S.PY[E.a]); g.lineTo(S.PX[E.b], S.PY[E.b]); }); g.stroke(); }
  // links that carry a twist: the string behind the wandering defect, brighter toward the lattice reading
  net.edges.forEach((E, e) => { if (!S.reg[e]) return; const u = (S.U[E.a] + S.U[E.b]) / 2, a = (0.18 + 0.62 * ramp(u, Z[1] + 30, Z[2] - 20)) * fadeC * Math.min(S.nA[E.a], S.nA[E.b]);
    g.strokeStyle = rgba(C.teal, a); g.lineWidth = 2; g.beginPath(); g.moveTo(S.PX[E.a], S.PY[E.a]); g.lineTo(S.PX[E.b], S.PY[E.b]); g.stroke(); });
  g.globalCompositeOperation = 'lighter';
  let mean = 0; for (let i = 0; i < S.x.length; i++) mean += S.x[i]; mean /= S.x.length;
  for (let i = 0; i < S.x.length; i++) { const v = (S.x[i] - mean) / 2.5, a = Math.min(1, Math.abs(v)); if (a > 0.08) spot(g, v > 0 ? C.hot : C.cold, S.PX[i], S.PY[i], 4 + 7 * a, (0.2 + 0.6 * a) * S.nA[i]); }
  for (const p of S.pulses) { const E = net.edges[p.e], f = (t - p.t) / (p.big ? 0.7 : 0.35); if (f >= 1) continue; const al = Math.min(S.nA[E.a], S.nA[E.b]) * (1 - f) * (p.big ? 1 : 0.34);
    const from = p.dir > 0 ? E.a : E.b, to = p.dir > 0 ? E.b : E.a, q = ease(f), x = S.PX[from] + (S.PX[to] - S.PX[from]) * q, y = S.PY[from] + (S.PY[to] - S.PY[from]) * q;
    g.strokeStyle = rgba(C.teal, al * 0.9); g.lineWidth = p.big ? 1.8 : 1; g.beginPath(); g.moveTo(S.PX[E.a], S.PY[E.a]); g.lineTo(S.PX[E.b], S.PY[E.b]); g.stroke();
    if (p.big) spot(g, C.teal, x, y, 7, al); }
  g.globalCompositeOperation = 'source-over';
  for (let i = 0; i < S.x.length; i++) { if (S.nA[i] < 0.05) continue; g.fillStyle = rgba(C.text, 0.62 * S.nA[i]); g.beginPath(); g.arc(S.PX[i], S.PY[i], 1.25, 0, TAU); g.fill(); }
  // ---- three observers with their patch and their record tape
  S.obs.forEach((o, k) => {
    const x = S.PX[o.node], y = S.PY[o.node], top = y - 62 - 16 * (k % 2);
    g.save(); g.translate(x, y); g.transform(1, 0, SKEW, TILT, 0, 0); g.strokeStyle = rgba(C.blue, 0.3); g.lineWidth = 1.2; g.beginPath(); g.arc(0, 0, 34, 0, TAU); g.stroke(); g.restore();
    g.strokeStyle = rgba(C.blue, 0.35); g.lineWidth = 1; g.beginPath(); g.moveTo(x, y - 3); g.lineTo(x, top + 9); g.stroke();
    g.fillStyle = rgba(C.blue, 0.95); g.beginPath(); g.arc(x, y, 2.6, 0, TAU); g.fill();
    for (let c = 0; c < 9; c++) { const en = o.tape[o.tape.length - 9 + c], cx = x - 31 + c * 7;
      g.fillStyle = 'rgba(140,170,230,.10)'; g.fillRect(cx, top, 6, 8);
      if (en) { g.fillStyle = rgba(en.j > 0 ? C.teal : C.amber, clamp(1.1 - (t - en.t) / 9, 0.25, 1)); g.fillRect(cx, top + (en.j > 0 ? 0 : 4), 6, 4); } }
  });
  // ---- the followed pair on the net
  if (S.birth) { const f = (t - S.birth.t) / 1.5; if (f < 1) { g.strokeStyle = rgba(C.birth, 1 - f); g.lineWidth = 2; g.beginPath(); g.arc(S.birth.x, S.birth.y, 6 + 26 * f, 0, TAU); g.stroke(); } }
  if (S.par) glyph(g, 5, net.hexes[S.par.h].px, net.hexes[S.par.h].py, 6.5, fadeC);
  let mobXY = null;
  if (S.mob) {
    const A = net.hexes[S.mob.from], B = net.hexes[S.mob.h], f = ease((t - S.mob.t) / 0.5); mobXY = [A.px + (B.px - A.px) * f, A.py + (B.py - A.py) * f];
    const pts = S.trail.map((p) => [p.x, p.y, p.t]).concat([[A.px, A.py, S.mob.t], [mobXY[0], mobXY[1], t]]);
    for (let i = 1; i < pts.length; i++) { const age = (t - pts[i][2]) / 9; if (age > 1) continue; g.strokeStyle = rgba(KRGB[1], 0.7 * (1 - age) * fadeC); g.lineWidth = 1 + 2.4 * (1 - age); g.lineCap = 'round'; g.beginPath(); g.moveTo(pts[i - 1][0], pts[i - 1][1]); g.lineTo(pts[i][0], pts[i][1]); g.stroke(); }
  }
  // ---- the lattice reading: links on the seams, the defect as the face whose links do not multiply to one
  const la = (u) => band(u, LAT.u0 - 12, LAT.u0 + LAT.a * (LAT.cols - 1) + 14, 30);
  const sheet = (h, alpha) => {
    for (let j = 0; j < LAT.cols; j++) { const u = LAT.u0 + LAT.a * j, a = pr(u, -WD, h), b = pr(u, WD, h); g.strokeStyle = rgba(C.line, 0.44 * alpha * la(u)); g.lineWidth = 0.9; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    for (let i = 0; i <= LAT.rows; i++) { const w = -WD + LAT.a * i; for (let j = 0; j < LAT.cols - 1; j++) { const u = LAT.u0 + LAT.a * j, a = pr(u, w, h), b = pr(u + LAT.a, w, h); g.strokeStyle = rgba(C.line, 0.44 * alpha * la(u + LAT.a / 2)); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); } }
  };
  const plaq = (c, r, h, rgb, alpha) => { const u = LAT.u0 + LAT.a * c, w = -WD + LAT.a * r, p = [pr(u, w, h), pr(u + LAT.a, w, h), pr(u + LAT.a, w + LAT.a, h), pr(u, w + LAT.a, h)];
    g.fillStyle = rgba(rgb, alpha); g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let q = 1; q < 4; q++) g.lineTo(p[q][0], p[q][1]); g.closePath(); g.fill(); };
  S.sheets.forEach((sh, k) => { const h = 34 * (2 - k) + 4, al = 0.5 - 0.14 * (1 - k);
    sheet(h, al); for (const [c, r, kk] of sh) plaq(c, r, h, KRGB[kk], 0.5 * al * 2);
    const e = pr(LAT.u0 + LAT.a * (LAT.cols - 1) + 10, -WD, h), wgt = [0.34, 0.62][k]; g.fillStyle = rgba(C.violet, 0.2); g.fillRect(e[0], e[1] - 3, 34, 3); g.fillStyle = rgba(C.violet, 0.85); g.fillRect(e[0], e[1] - 3, 34 * wgt, 3); });
  sheet(0, 1);
  { const e = pr(LAT.u0 + LAT.a * (LAT.cols - 1) + 10, -WD, 0); g.fillStyle = rgba(C.violet, 0.2); g.fillRect(e[0], e[1] - 3, 34, 3); g.fillStyle = rgba(C.violet, 0.85); g.fillRect(e[0], e[1] - 3, 34, 3);
    const tp = pr(LAT.u0 + LAT.a * (LAT.cols - 1) + 10, -WD, 76); rich(g, 'weight e^{−S}', tp[0] - 2, tp[1] - 8, { size: 9.5, color: rgba(C.violet, 0.9) }); }
  if (S.lat) {
    const L = S.lat, f = ease((t - L.t) / 0.6), cx = (c) => LAT.u0 + LAT.a * (c + 0.5), w = -WD + LAT.a * (L.r + 0.5);
    const cur = L.c === 0 ? null : pr(cx(L.c - 1) + (cx(L.c) - cx(L.c - 1)) * f, w), here = pr(cx(L.c), w);
    mobXY = L.c === 0 ? [L.from[0] + (here[0] - L.from[0]) * f, L.from[1] + (here[1] - L.from[1]) * f] : cur;
    g.strokeStyle = rgba(C.teal, 0.85 * fadeC); g.lineWidth = 2.2;                 // the links it crossed
    for (const p of [{ c: 0, r: L.r }].concat(L.path)) { const u = LAT.u0 + LAT.a * p.c, a = pr(u, -WD + LAT.a * p.r), b = pr(u, -WD + LAT.a * (p.r + 1)); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    plaq(L.c, L.r, 0, KRGB[1], 0.34 * f * fadeC);
    if (L.c >= 4 && f >= 1) { const a0 = t * 1.6; g.strokeStyle = rgba(C.text, 0.8 * fadeC); g.lineWidth = 1.3; g.save(); g.translate(here[0], here[1]); g.transform(1, 0, SKEW, TILT, 0, 0); g.beginPath(); g.arc(0, 0, 17, a0, a0 + 4.6); g.stroke(); g.restore();
      rich(g, '∏ U ≠ 1', here[0], here[1] + 30, { size: 10, align: 'center', color: rgba(C.text, 0.85 * fadeC) }); }
  }
  if (mobXY) glyph(g, 1, mobXY[0], mobXY[1], 7, fadeC);
  // ---- the field: a smooth surface through the values on which the observers' records agree
  const up = fieldU(t), sa = (u) => band(u, SUR.u0, SUR.u1, 36);
  const tint = (u) => (u < Z[4] ? C.teal : u < EW_U ? '190,236,255' : u < QCD_U ? C.amber : '255,128,96');
  for (let w = -WD; w <= WD + 0.1; w += 10) {
    let seg = null, col = null;
    for (let u = SUR.u0; u <= SUR.u1 + 0.1; u += 8) {
      const p = pr(u, w, fieldH(u, w, t)), c = tint(u) + '|' + Math.round(4 * sa(u));
      if (c !== col) { if (seg) { g.lineTo(p[0], p[1]); g.stroke(); } g.strokeStyle = rgba(tint(u), 0.12 + 0.4 * sa(u) * (0.45 + 0.55 * (1 - Math.abs(w) / WD))); g.lineWidth = 1; g.beginPath(); g.moveTo(p[0], p[1]); seg = 1; col = c; } else g.lineTo(p[0], p[1]);
    }
    if (seg) g.stroke();
  }
  { const crest = pr(up, 0, fieldH(up, 0, t)), env = band(up, FIELD.u0, FIELD.u0 + FIELD.len, 40); g.globalCompositeOperation = 'lighter'; spot(g, tint(up), crest[0], crest[1], 30, 0.5 * env); g.globalCompositeOperation = 'source-over';
    const near = band(up, Z[3] - 10, Z[4] - 30, 36);
    S.fobs.forEach((o, k) => {
      const foot = pr(o.u, o.w, fieldH(o.u, o.w, t)), x = foot[0], y = pr(o.u, o.w)[1] - o.h;
      g.strokeStyle = rgba(C.soft, 0.22); g.lineWidth = 1; g.setLineDash([2, 4]); g.beginPath(); g.moveTo(x, y + 9); g.lineTo(foot[0], foot[1]); g.stroke(); g.setLineDash([]);
      g.fillStyle = rgba(C.text, 0.95); g.beginPath(); g.arc(foot[0], foot[1], 2.4, 0, TAU); g.fill();                                   // the agreed value under this observer
      g.strokeStyle = rgba(C.text, 0.5 * near); g.lineWidth = 0.9; g.beginPath(); g.moveTo(x + 24, y + 2); g.lineTo(crest[0], crest[1]); g.stroke();   // its record points at the same event
      g.strokeStyle = rgba(C.blue, 0.9); g.lineWidth = 1.4; g.beginPath(); for (let q = 0; q < 6; q++) { const a = TAU * q / 6 + TAU / 12; g[q ? 'lineTo' : 'moveTo'](x + 8 * Math.cos(a), y + 8 * Math.sin(a)); } g.closePath(); g.stroke();
      g.fillStyle = rgba(C.blue, 0.95); g.beginPath(); g.arc(x, y, 2.2, 0, TAU); g.fill();
      for (let c = 0; c < 7; c++) { const v = o.tape[c], bx = x + 14 + c * 7; g.fillStyle = 'rgba(140,170,230,.12)'; g.fillRect(bx, y - 8, 6, 12); if (v) { g.fillStyle = rgba(C.teal, 0.5 + 0.16 * v); g.fillRect(bx, y + 4 - 4 * v, 6, 4 * v); } }
      const cf = (t - o.click) / 0.9; if (cf >= 0 && cf < 1) { g.strokeStyle = rgba(C.birth, 1 - cf); g.lineWidth = 2; g.beginPath(); g.arc(x, y, 9 + 16 * cf, 0, TAU); g.stroke(); }
    });
    g.fillStyle = rgba(C.text, near); g.beginPath(); g.arc(crest[0], crest[1], 3, 0, TAU); g.fill(); }
  // ---- the cooling universe: the crossover, then quarks bind into hadrons
  for (const [u, rgb] of [[EW_U, '190,236,255'], [QCD_U, C.amber]]) { const a = pr(u, -WD), b = pr(u, WD), gr = g.createLinearGradient(0, a[1] - 86, 0, b[1]);
    gr.addColorStop(0, rgba(rgb, 0)); gr.addColorStop(1, rgba(rgb, 0.2)); g.fillStyle = gr; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(b[0], b[1] - 86); g.lineTo(a[0], a[1] - 86); g.closePath(); g.fill();
    g.strokeStyle = rgba(rgb, 0.4); g.lineWidth = 1; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
  g.globalCompositeOperation = 'lighter';
  for (const q of S.hadrons) {
    const u = Z[4] + 10 + ((q.u - Z[4] - 10 + t * 13) % 172), bound = ramp(u, QCD_U - 10, QCD_U + 22), al = band(u, Z[4] + 6, Z[5] + 4, 20), c = pr(u, q.w, q.h + fieldH(u, q.w, t));
    const rad = 17 - 11.5 * bound, sp = 1.1 + 1.4 * bound;
    [C.red, C.green, C.blue].forEach((rgb, i) => { const a = q.ph + t * sp + i * TAU / 3 + (1 - bound) * Math.sin(t * 1.3 + i * 2 + q.ph) * 1.2; spot(g, rgb, c[0] + rad * Math.cos(a), c[1] + rad * 0.62 * Math.sin(a), 5.5, 0.9 * al); });
    if (bound > 0.5) { g.globalCompositeOperation = 'source-over'; g.strokeStyle = rgba(C.text, 0.3 * al * bound); g.lineWidth = 1; g.beginPath(); g.ellipse(c[0], c[1], 11, 8, 0, 0, TAU); g.stroke(); g.globalCompositeOperation = 'lighter'; }
  }
  g.globalCompositeOperation = 'source-over';
  // ---- the particle classes and the masses
  { const a = pr(SUR.u1 - 4, 0), x1 = WHEEL.x - WHEEL.r - 22; g.strokeStyle = rgba(C.line, 0.4); g.lineWidth = 1.2; g.setLineDash([2, 5]); g.lineDashOffset = -t * 14; g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo((a[0] + x1) / 2, a[1] - 14, x1, WHEEL.y); g.stroke();
    g.beginPath(); g.moveTo(WHEEL.x + WHEEL.r + 24, WHEEL.y); g.lineTo(CLOCK.x - CLOCK.r - 12, WHEEL.y); g.stroke(); g.setLineDash([]); g.lineDashOffset = 0;
    arrowHead(g, x1 + 4, WHEEL.y, 0.25, 7, rgba(C.line, 0.7)); arrowHead(g, CLOCK.x - CLOCK.r - 8, WHEEL.y, 0, 7, rgba(C.line, 0.7)); }
  drawWheel(g, WHEEL.x, WHEEL.y, WHEEL.r, t);
  drawClocks(g, t);
  // four small captions for the parts that carry the idea
  { const o = S.obs[1], f0 = S.fobs[0], f1 = S.fobs[1], e = pr(EW_U, WD), q = pr(QCD_U, WD);
    cap(g, 'record tape', S.PX[o.node] + 36, S.PY[o.node] - 73, { size: 9 });
    cap(g, 'records of one event', pr(f0.u, f0.w)[0] - 8, pr(f0.u, f0.w)[1] - f0.h - 15, { size: 9 });
    cap(g, 'agreed values', pr(f1.u, WD)[0], pr(f1.u, WD)[1] + 15, { size: 9, align: 'center' });
    cap(g, 'crossover', e[0] - 5, e[1] + 15, { size: 9, align: 'right' }); cap(g, 'hadrons', q[0] + 5, q[1] + 15, { size: 9 }); }
}
const WSYM = { 0: 'e_{R} ν_{R}', 1: 'Q', 2: 'q̄_{R}', 3: 'L · H', 4: 'q_{R}', 5: 'Q̄' };
function drawWheel(g, cx, cy, R, t, o = {}) {      // the six classes on a hexagon; conjugate classes face each other across the vertical axis
  const on = o.on ?? Math.floor(t / 1.7) % 6, P = (k, r) => [cx + r * Math.sin(TAU * k / 6), cy - r * Math.cos(TAU * k / 6)];
  g.strokeStyle = rgba(C.line, 0.3); g.lineWidth = 1; g.beginPath(); for (let k = 0; k < 6; k++) { const p = P(k, R); g[k ? 'lineTo' : 'moveTo'](p[0], p[1]); } g.closePath(); g.stroke();
  g.setLineDash([2, 4]); g.strokeStyle = rgba(C.line, 0.22); g.beginPath(); for (const [a, b] of [[1, 5], [2, 4]]) { const p = P(a, R), q = P(b, R); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); } g.stroke(); g.setLineDash([]);
  for (let k = 0; k < 6; k++) {
    const p = P(k, R), q = P(k, R + (o.lab || 17)), hot = k === on;
    if (hot) { g.globalCompositeOperation = 'lighter'; spot(g, KRGB[k], p[0], p[1], 22, 0.55); g.globalCompositeOperation = 'source-over'; }
    glyph(g, k, p[0], p[1], hot ? 7.5 : 6, hot ? 1 : 0.8);
    rich(g, WSYM[k], q[0], q[1] + 3.5, { size: o.size || 10, weight: 600, align: Math.abs(Math.sin(TAU * k / 6)) < 0.1 ? 'center' : Math.sin(TAU * k / 6) > 0 ? 'left' : 'right', color: rgba(hot ? C.text : C.soft, hot ? 1 : 0.7) });
  }
  text(g, 'k = 6Y mod 6', cx, cy + 3.5, { size: o.size || 10, weight: 600, align: 'center', color: rgba(C.soft, 0.8) });
}
function drawClocks(g, t) {                        // three rest phases per tick; the hands turn faster for the larger rate
  const y = leptonRates(), rate = [y.tau, y.mu, y.e], sym = ['τ', 'μ', 'e'], rgb = [C.violet, C.teal, C.amber];
  for (let k = 0; k < 3; k++) {
    const cx = CLOCK.x, cy = CLOCK.ys[k], w = 0.45 + 0.34 * Math.log10(rate[k] / y.e), a = -Math.PI / 2 + w * t;
    g.strokeStyle = rgba(rgb[k], 0.55); g.lineWidth = 1.4; g.beginPath(); g.arc(cx, cy, CLOCK.r, 0, TAU); g.stroke();
    for (let q = 0; q < 12; q++) { const b = TAU * q / 12; g.strokeStyle = rgba(rgb[k], 0.35); g.lineWidth = 1; g.beginPath(); g.moveTo(cx + (CLOCK.r - 4) * Math.cos(b), cy + (CLOCK.r - 4) * Math.sin(b)); g.lineTo(cx + CLOCK.r * Math.cos(b), cy + CLOCK.r * Math.sin(b)); g.stroke(); }
    g.strokeStyle = rgba(rgb[k], 0.95); g.lineWidth = 2; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + (CLOCK.r - 6) * Math.cos(a), cy + (CLOCK.r - 6) * Math.sin(a)); g.stroke();
    g.globalCompositeOperation = 'lighter'; spot(g, rgb[k], cx + (CLOCK.r - 6) * Math.cos(a), cy + (CLOCK.r - 6) * Math.sin(a), 8, 0.7); g.globalCompositeOperation = 'source-over';
    text(g, sym[k], cx - CLOCK.r - 9, cy + 5, { size: 15, weight: 600, align: 'right', color: rgba(rgb[k], 1) });
  }
}
ENGINES.scene = { makeScene, advance, netCls, fieldH, fieldU, VW, VH, Z };

// ================================================================================================ the rule of every map
// One small running picture per map: the rule that carries the step on its left into the step on its right.
// r = { x, y, w, h } in CSS pixels, R the state of the card.
const fmtE = (x) => { if (x >= 1e4 || x < 0.01) { const e = Math.floor(Math.log10(x)); return `${(x / 10 ** e).toFixed(2)} × 10^{${e}} GeV`; } return `${x >= 100 ? x.toFixed(1) : x >= 1 ? x.toFixed(2) : x.toFixed(3)} GeV`; };
const sgn = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v);
function wire(g, cx, cy, R, cam) {            // the carrier as a wire frame; returns its projected ports
  const P = ICO.V.map(cam), X = (i) => cx + P[i][0] * R, Y = (i) => cy - P[i][1] * R;
  for (const pass of [0, 1]) { g.lineWidth = pass ? 1.1 : 0.8; g.strokeStyle = rgba(C.line, pass ? 0.5 : 0.14); g.beginPath();
    for (const [a, b] of ICO.E) { if ((P[a][2] + P[b][2] > 0) !== !!pass) continue; g.moveTo(X(a), Y(a)); g.lineTo(X(b), Y(b)); } g.stroke(); }
  return { P, X, Y };
}
function ruleTwist(g, r, t, R) {              // law C on one carrier, event by event, with the register
  if (!R.run) { R.run = new CarrierRun(5); R.t0 = -9; R.n = 0; }
  if (t - R.t0 > 3.2) {
    if (R.n++ % 22 === 21) R.run.prepare();
    R.yaw = t * 0.2; const cam0 = camera(R.yaw, 0.32); let ev = null;
    for (let q = 0; q < 40; q++) { const x0 = Int8Array.from(R.run.x); ev = R.run.repair(); ev.x0 = x0; const [a, b] = ICO.E[ev.s]; if (cam0(ICO.V[a])[2] + cam0(ICO.V[b])[2] > 0.5) break; }
    R.ev = ev; R.t0 = t;
  }
  const ev = R.ev, f = (t - R.t0) / 3.2, run = R.run, cam = camera(R.yaw + (t - R.t0) * 0.04, 0.32);
  const cx = r.x + r.w * 0.26, cy = r.y + r.h * 0.52, Rr = Math.min(r.w * 0.2, r.h * 0.34), { P, X, Y } = wire(g, cx, cy, Rr, cam);
  if (f > 0.58 && ev.twist > 0) for (const [fc, k] of [[ev.fp, ev.n1], [ev.fm, ev.n2]]) { const [a, b, c] = ICO.F[fc]; g.fillStyle = rgba(KRGB[k], 0.32 * ramp(f, 0.58, 0.7)); g.beginPath(); g.moveTo(X(a), Y(a)); g.lineTo(X(b), Y(b)); g.lineTo(X(c), Y(c)); g.closePath(); g.fill(); }
  for (let fc = 0; fc < 20; fc++) { const k = f > 0.58 || (fc !== ev.fp && fc !== ev.fm) ? run.cls[fc] : fc === ev.fp ? ev.k1 : ev.k2; if (!k) continue; const c = cam(ICO.FC[fc]); glyph(g, k, cx + c[0] * Rr, cy - c[1] * Rr, 5.5, c[2] > 0 ? 1 : 0.2); }
  g.strokeStyle = rgba(C.teal, 0.95); g.lineWidth = 2.2; g.beginPath(); g.moveTo(X(ev.a), Y(ev.a)); g.lineTo(X(ev.b), Y(ev.b)); g.stroke();
  if (f > 0.3 && f < 0.52) { const q = ease((f - 0.3) / 0.22), from = ev.cur > 0 ? ev.a : ev.b, to = ev.cur > 0 ? ev.b : ev.a; g.globalCompositeOperation = 'lighter'; spot(g, C.teal, X(from) + (X(to) - X(from)) * q, Y(from) + (Y(to) - Y(from)) * q, 10, 1); g.globalCompositeOperation = 'source-over'; }
  for (let i = 0; i < 12; i++) {
    const front = P[i][2] > 0, x = f < 0.42 ? ev.x0[i] : run.x[i], hot = i === ev.a || i === ev.b;
    g.fillStyle = hot ? 'rgba(12,44,52,.95)' : 'rgba(10,16,30,.9)'; g.beginPath(); g.arc(X(i), Y(i), front ? 8.5 : 6, 0, TAU); g.fill();
    g.strokeStyle = rgba(hot ? C.teal : C.line, front ? 0.85 : 0.25); g.lineWidth = 1; g.stroke();
    text(g, String(x), X(i), Y(i) + (front ? 3.8 : 3), { size: front ? 10.5 : 8.5, weight: 700, align: 'center', color: rgba(C.text, front ? 1 : 0.4) });
  }
  text(g, 'a', X(ev.a) - 14, Y(ev.a) - 9, { size: 11, weight: 700, color: rgba(C.teal, 1) }); text(g, 'b', X(ev.b) + 9, Y(ev.b) - 9, { size: 11, weight: 700, color: rgba(C.teal, 1) });
  const x = r.x + r.w * 0.52, mx = r.x + r.w - x - 2, y0 = r.y + r.h * 0.2, dy = Math.min(27, r.h * 0.108), sz = Math.min(13, r.w * 0.036);
  const ok = ev.twist > 0, L = [
    [0, `x_{a} = ${ev.xi},  x_{b} = ${ev.xj}`], [0.1, `t = x_{a} + x_{b} = ${ev.tot}`], [0.25, `coin ${ev.coin}:  x_{a}′ = ${ev.ni},  x_{b}′ = ${ev.nj}`],
    [0.42, `j = x_{a} − x_{a}′ = ${sgn(ev.cur)}`], [0.56, `twist ${ev.delta}:  ${ev.k1} → ${ev.n1},  ${ev.k2} → ${ev.n2}`],
    [0.7, `cost ${sgn(ev.de)} ${ok ? '≤' : '>'} work ${ev.work}:  ${ok ? 'applied' : 'blocked'}`]];
  L.forEach(([at, tx], i) => { if (f < at) return; rich(g, tx, x, y0 + dy * i, { size: sz, max: mx, weight: i >= 3 ? 600 : 500, color: i === 5 ? rgba(ok ? C.green : C.red, 0.95) : rgba(C.text, 0.72 + 0.28 * ramp(f, at, at + 0.06)) }); });
  rich(g, `Σ classes mod 6 = ${run.classSum()}  ·  attempt ${run.attempts}`, x, y0 + dy * 6.4, { size: sz * 0.84, max: mx, color: rgba(C.muted, 0.9) });
}
function miniCubic(g, cx, cy, s, lat, yaw, pa) {   // a block of the link lattice; plaquettes with nontrivial holonomy glow
  const n = lat.L, cam = camera(yaw, 0.5), P = (x, y, z) => { const p = cam([x - (n - 1) / 2, y - (n - 1) / 2, z - (n - 1) / 2]); return [cx + p[0] * s, cy - p[1] * s]; };
  const D = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], PL = [[0, 1], [0, 2], [1, 2]];
  g.strokeStyle = rgba(C.line, 0.3); g.lineWidth = 0.8; g.beginPath();
  for (let z = 0; z < n; z++) for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const p = P(x, y, z); for (const d of D) { if (x + d[0] >= n || y + d[1] >= n || z + d[2] >= n) continue; const q = P(x + d[0], y + d[1], z + d[2]); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); } }
  g.stroke();
  for (let z = 0; z < n; z++) for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const i = lat.site(x, y, z);
    PL.forEach(([mu, nu], q) => { const a = D[mu], b = D[nu]; if (x + a[0] + b[0] >= n || y + a[1] + b[1] >= n || z + a[2] + b[2] >= n) return;
      const k = 3 * i + q; pa[k] += ((lat.plaq(i, mu, nu) ? 1 : 0) - pa[k]) * 0.12; if (pa[k] < 0.03) return;
      const p0 = P(x, y, z), p1 = P(x + a[0], y + a[1], z + a[2]), p2 = P(x + a[0] + b[0], y + a[1] + b[1], z + a[2] + b[2]), p3 = P(x + b[0], y + b[1], z + b[2]);
      g.fillStyle = rgba(KRGB[4], 0.55 * pa[k]); g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.lineTo(p3[0], p3[1]); g.closePath(); g.fill(); }); }
  for (let z = 0; z < n; z++) for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const p = P(x, y, z); g.fillStyle = rgba(C.text, 0.55); g.beginPath(); g.arc(p[0], p[1], 1.2, 0, TAU); g.fill(); }
}
function ruleLinks(g, r, t, R) {              // product around a face, cost as action, sampled configurations
  if (!R.lat) { R.lat = new GaugeZN(3, 4, 1.04, 3); R.lat.sweep(20); R.next = 0; R.S = []; R.pa = new Float32Array(3 * 64); }
  if (t > R.next) { R.next = t + 0.4; R.lat.sweep(1); R.S.push(R.lat.measure().S); if (R.S.length > 16) R.S.shift(); }
  const yb = r.y + r.h * 0.9, sz = Math.min(12, r.w * 0.03);
  { const cx = r.x + r.w * 0.17, cy = r.y + r.h * 0.44, rho = Math.min(r.w * 0.12, r.h * 0.24), V = (i) => [cx + rho * Math.cos(TAU * i / 6 + TAU / 12), cy + rho * Math.sin(TAU * i / 6 + TAU / 12)];
    for (let i = 0; i < 6; i++) { const a = V(i), b = V(i + 1), hot = i === 1; g.strokeStyle = rgba(hot ? C.teal : C.line, hot ? 0.95 : 0.5); g.lineWidth = hot ? 2.2 : 1.1; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      arrowHead(g, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.atan2(b[1] - a[1], b[0] - a[0]), 6, rgba(hot ? C.teal : C.line, 0.9)); g.fillStyle = rgba(C.text, 0.7); g.beginPath(); g.arc(a[0], a[1], 1.6, 0, TAU); g.fill(); }
    glyph(g, 1, cx, cy, 8); g.strokeStyle = rgba(C.text, 0.7); g.lineWidth = 1.2; g.beginPath(); g.arc(cx, cy, rho * 0.52, t * 1.5, t * 1.5 + 4.6); g.stroke();
    rich(g, '∏ U_{e} ≠ 1', cx, yb, { size: sz, align: 'center', max: r.w * 0.3, color: rgba(C.text, 0.9) }); }
  miniCubic(g, r.x + r.w * 0.52, r.y + r.h * 0.44, Math.min(r.w * 0.052, r.h * 0.085), R.lat, t * 0.15, R.pa);
  rich(g, 'cost = action S', r.x + r.w * 0.52, yb, { size: sz, align: 'center', max: r.w * 0.3, color: rgba(C.text, 0.9) }); cap(g, `sweep ${R.lat.sweeps}`, r.x + r.w * 0.52, r.y + r.h * 0.1, { size: 8, align: 'center' });
  { const x0 = r.x + r.w * 0.74, w = r.w * 0.23, top = r.y + r.h * 0.2, H = r.h * 0.5, mn = Math.min(...R.S), mx = Math.max(...R.S, mn + 1);
    R.S.forEach((S, i) => { const h = H * (0.25 + 0.75 * (S - mn) / (mx - mn)); g.fillStyle = rgba(C.violet, 0.25 + 0.7 * Math.exp(-(S - mn) / 8)); g.fillRect(x0 + (w * i) / 16, top + H - h, w / 16 - 2, h); });
    rich(g, 'weight e^{−S}', x0 + w / 2, yb, { size: sz, align: 'center', max: w, color: rgba(C.text, 0.9) }); cap(g, 'S per sample', x0, top - 8, { size: 8, max: w }); }
}
function ruleContinuum(g, r, t, R) {          // the dispersion of the tick against the Dirac shell, and one packet
  const th = 0.35;
  if (!R.walk) { R.walk = new DiracWalk(120, th).packet(14, 6, 0.6); R.next = 0; }
  if (t > R.next) { R.next = t + 0.07; R.walk.tick(); if (R.walk.ticks > 165) R.walk.packet(14, 6, 0.6); }
  const px = r.x + 40, pw = r.w - 64, py = r.y + r.h * 0.6, ph = r.h * 0.44, X = (p) => px + pw * p / 1.5, Y = (E) => py - ph * E / 1.62;
  g.strokeStyle = rgba(C.line, 0.5); g.lineWidth = 1; g.beginPath(); g.moveTo(px, py - ph - 6); g.lineTo(px, py); g.lineTo(px + pw + 6, py); g.stroke();
  text(g, 'E', px - 14, py - ph + 2, { size: 11, color: rgba(C.muted, 1) }); text(g, 'p', px + pw + 2, py + 15, { size: 11, color: rgba(C.muted, 1) });
  g.setLineDash([4, 4]); g.strokeStyle = rgba(C.text, 0.8); g.lineWidth = 1.2; g.beginPath(); for (let p = 0; p <= 1.5001; p += 0.03) g[p ? 'lineTo' : 'moveTo'](X(p), Y(Math.hypot(p, th))); g.stroke(); g.setLineDash([]);
  g.strokeStyle = rgba(C.teal, 0.95); g.lineWidth = 2; g.beginPath(); for (let p = 0; p <= 1.5001; p += 0.03) g[p ? 'lineTo' : 'moveTo'](X(p), Y(Math.acos(Math.cos(th) * Math.cos(p)))); g.stroke();
  const pm = 0.06 + 0.7 * (1 + Math.sin(t * 0.55)), Ew = Math.acos(Math.cos(th) * Math.cos(pm)), Ed = Math.hypot(pm, th);
  g.strokeStyle = rgba(C.amber, 0.7); g.lineWidth = 1; g.beginPath(); g.moveTo(X(pm), py); g.lineTo(X(pm), Y(Ed)); g.stroke();
  g.fillStyle = rgba(C.text, 1); g.beginPath(); g.arc(X(pm), Y(Ed), 3, 0, TAU); g.fill(); g.fillStyle = rgba(C.teal, 1); g.beginPath(); g.arc(X(pm), Y(Ew), 3.4, 0, TAU); g.fill();
  const sz = Math.min(12, r.w * 0.031);
  rich(g, 'tick:   cos E = cos θ · cos p', px + 12, r.y + r.h * 0.16, { size: sz, weight: 600, color: rgba(C.teal, 1) });
  rich(g, 'Dirac:   E^{2} = p^{2} + θ^{2}', px + 12, r.y + r.h * 0.16 + sz * 1.6, { size: sz, weight: 600, color: rgba(C.text, 0.92) });
  rich(g, `p = ${pm.toFixed(2)}:   ${Ew.toFixed(4)}  against  ${Ed.toFixed(4)}`, px + 12, r.y + r.h * 0.16 + sz * 3.2, { size: sz * 0.92, color: rgba(C.amber, 0.95) });
  const base = r.y + r.h * 0.93, amp = r.h * 0.2, w = R.walk; g.beginPath(); g.moveTo(px, base);
  for (let i = 0; i < w.n; i++) g.lineTo(px + pw * (i + 0.5) / w.n, base - amp * Math.min(1.15, w.density(i) / w.peak0));
  g.lineTo(px + pw, base); g.closePath(); const gr = g.createLinearGradient(0, base - amp, 0, base); gr.addColorStop(0, rgba(C.teal, 0.8)); gr.addColorStop(1, rgba(C.teal, 0.04)); g.fillStyle = gr; g.fill();
  for (let i = 0; i < w.n; i += 3) { g.fillStyle = rgba(C.line, 0.5); g.fillRect(px + pw * (i + 0.5) / w.n - 0.6, base + 3, 1.2, 1.2); }
  cap(g, `one quantum on a row of cells, tick ${w.ticks}`, px, base - amp - 8, { size: 8 });
}
function ruleHeat(g, r, t, R) {               // the tick extent of the lattice against its temperature
  const n = 1 + ((t * 4.2) % 72), lT = Math.log10(CHAIN.Ecell) - n * Math.log10(2), ax = r.x + r.w * 0.6, top = r.y + r.h * 0.12, H = r.h * 0.78, Yl = (l) => top + H * (19.3 - l) / 20.6;
  const k = Math.min(13, Math.floor(n)), bx = r.x + r.w * 0.25, by = r.y + r.h * 0.94, sw = Math.min(r.w * 0.17, 84), st = (r.h * 0.56) / 13;
  for (let i = 0; i <= k; i++) { const y = by - i * st, a = 0.25 + 0.6 * (i / Math.max(1, k)); g.strokeStyle = rgba(i === k ? C.teal : C.line, a); g.fillStyle = rgba(C.cold, 0.05); g.lineWidth = 1; g.beginPath(); g.moveTo(bx - sw, y); g.lineTo(bx + sw * 0.5, y); g.lineTo(bx + sw, y - 12); g.lineTo(bx - sw * 0.5, y - 12); g.closePath(); g.fill(); g.stroke(); }
  g.strokeStyle = rgba(C.teal, 0.55); g.lineWidth = 1.2; g.beginPath(); g.ellipse(bx - sw - 6, by - (k * st) / 2 - 6, 9, Math.max(8, (k * st) / 2), 0, Math.PI * 0.5, Math.PI * 1.5); g.stroke(); arrowHead(g, bx - sw - 6, by - 6, 0, 6, rgba(C.teal, 0.8));
  rich(g, `N_{t} = 2^{${Math.floor(n)}} ticks`, bx, r.y + r.h * 0.11, { size: Math.min(13, r.w * 0.036), weight: 600, align: 'center', max: r.w * 0.5, color: rgba(C.text, 0.95) });
  rich(g, `T = ${fmtE(10 ** lT)}`, bx, r.y + r.h * 0.11 + Math.min(18, r.h * 0.08), { size: Math.min(12, r.w * 0.034), weight: 600, align: 'center', max: r.w * 0.5, color: rgba(C.teal, 1) });
  const gr = g.createLinearGradient(0, top, 0, top + H); gr.addColorStop(0, 'rgba(190,236,255,.9)'); gr.addColorStop(0.75, rgba(C.amber, 0.9)); gr.addColorStop(1, 'rgba(255,128,96,.9)');
  g.strokeStyle = gr; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(ax, top); g.lineTo(ax, top + H); g.stroke(); g.lineCap = 'butt';
  for (const [v, s] of [[CHAIN.Ecell, 'E_{cell}'], [CHAIN.MU, 'M_{U}'], [CHAIN.v, 'v = 246.60 GeV'], [CHAIN.Lambda3, 'Λ^{(3)} = 0.340 GeV']]) { const y = Yl(Math.log10(v)); g.strokeStyle = rgba(C.text, 0.6); g.lineWidth = 1; g.beginPath(); g.moveTo(ax - 6, y); g.lineTo(ax + 6, y); g.stroke(); rich(g, s, ax + 13, y + 4, { size: Math.min(11.5, r.w * 0.032), max: r.x + r.w - ax - 15, color: rgba(C.soft, 0.9) }); }
  const y = Yl(lT); g.globalCompositeOperation = 'lighter'; spot(g, C.teal, ax, y, 13, 1); g.globalCompositeOperation = 'source-over';
}
const MULT = [['Q', 1 / 6], ['u_{R}', 2 / 3], ['d_{R}', -1 / 3], ['L', -1 / 2], ['e_{R}', -1], ['ν_{R}', 0], ['H', 1 / 2]];
function ruleCentre(g, r, t, R) {             // quanta carried around a flux of class k, and the class of every multiplet
  const per = 3.8, k = 1 + (Math.floor(t / per) % 5), u = clamp(((t % per) / per) / 0.8, 0, 1), cx = r.x + r.w * 0.25, cy = r.y + r.h * 0.56, rho = Math.min(r.w * 0.2, r.h * 0.36), sz = Math.min(12, r.w * 0.031);
  glyph(g, k, cx, cy, 9); rich(g, `a flux of class ${k}`, cx, r.y + r.h * 0.1, { size: sz, weight: 600, align: 'center', color: rgba(C.text, 0.95) });
  [['Q', 1 / 6, C.hot, 1], ['L', -1 / 2, C.green, 0.72], ['e_{R}', -1, C.muted, 0.45]].forEach(([s, Yv, rgb, f]) => {
    const a = -Math.PI / 2 + TAU * u, x = cx + rho * f * Math.cos(a), y = cy + rho * f * Math.sin(a), ph = -Math.PI / 2 + TAU * k * Yv * u;
    g.strokeStyle = rgba(rgb, 0.25); g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, rho * f, 0, TAU); g.stroke();
    g.strokeStyle = rgba(rgb, 1); g.lineWidth = 1.8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 14 * Math.cos(ph), y + 14 * Math.sin(ph)); g.stroke(); arrowHead(g, x + 14 * Math.cos(ph), y + 14 * Math.sin(ph), ph, 5, rgba(rgb, 1));
    g.fillStyle = rgba(rgb, 1); g.beginPath(); g.arc(x, y, 3, 0, TAU); g.fill(); rich(g, s, cx + 5, cy - rho * f + 13, { size: sz * 0.9, color: rgba(rgb, 0.95) });
  });
  const tx = r.x + r.w * 0.53, ty = r.y + r.h * 0.2, dy = Math.min(26, r.h * 0.105);
  cap(g, 'multiplet', tx, ty - dy * 0.75, { size: 8 }); cap(g, '6Y', tx + r.w * 0.13, ty - dy * 0.75, { size: 8, align: 'center' }); cap(g, 'class', tx + r.w * 0.2, ty - dy * 0.75, { size: 8 }); cap(g, 'phase', tx + r.w * 0.32, ty - dy * 0.75, { size: 8 });
  MULT.forEach(([s, Yv], i) => { const kk = classOf(Yv), turn = mod(k * Math.round(6 * Yv), 6), y = ty + dy * i, col = rgba(turn ? C.text : C.muted, turn ? 0.95 : 0.6);
    rich(g, s, tx, y, { size: sz, weight: 600, color: col }); text(g, sgn(Math.round(6 * Yv)), tx + r.w * 0.13, y, { size: sz, color: col, align: 'center' });
    glyph(g, kk, tx + r.w * 0.22, y - 4, 5); text(g, String(kk), tx + r.w * 0.26, y, { size: sz, color: col }); text(g, turn ? `${turn}/6 turn` : 'none', tx + r.w * 0.32, y, { size: sz, color: turn ? rgba(C.teal, 1) : col }); });
}
function ruleReads(g, r, t, R) {              // two cells and two flags: the exclusive read count, then the three rates
  if (!R.rand) { R.rand = rng(9); R.n = 0; R.hit = 0; R.next = 0; R.fa = -9; R.fb = -9; R.A = 0; R.B = 0; }
  const PA = 2, PB = 7, ends = (a) => { const [p, q] = ICO.E[a >> 1]; return a & 1 ? [q, p] : [p, q]; };
  if (t > R.next) { R.next = t + 0.14; R.A = Math.floor(R.rand() * 60); R.B = Math.floor(R.rand() * 60); const [ta] = ends(R.A), [tb, hb] = ends(R.B), rp = ta === PA, hh = tb === PB || hb === PB; if (rp) R.fa = t; if (hh) R.fb = t; R.n++; if (rp !== hh) R.hit++; }
  const rho = Math.min(r.w * 0.085, r.h * 0.17), cy = r.y + r.h * 0.28, sz = Math.min(12, r.w * 0.031), cam = camera(0.5 + t * 0.12, 0.3);
  [[r.x + r.w * 0.13, R.A, PA, 'R+', R.fa, C.teal, '1/12'], [r.x + r.w * 0.34, R.B, PB, 'H', R.fb, C.amber, '1/6']].forEach(([cx, adr, port, flag, at, rgb, wgt]) => {
    const { P, X, Y } = wire(g, cx, cy, rho, cam), [ta, he] = ends(adr), lit = t - at < 0.4;
    g.strokeStyle = rgba(C.text, 0.9); g.lineWidth = 1.6; g.beginPath(); g.moveTo(X(ta), Y(ta)); g.lineTo(X(he), Y(he)); g.stroke(); g.fillStyle = rgba(C.text, 1); g.beginPath(); g.arc(X(he), Y(he), 2.4, 0, TAU); g.fill();
    g.globalCompositeOperation = 'lighter'; spot(g, rgb, X(port), Y(port), lit ? 16 : 9, P[port][2] > 0 ? 1 : 0.45); g.globalCompositeOperation = 'source-over';
    text(g, flag, cx, cy + rho + 22, { size: sz * 1.25, weight: 700, align: 'center', color: rgba(rgb, lit ? 1 : 0.35) }); text(g, wgt, cx, cy + rho + 22 + sz * 1.35, { size: sz * 0.9, align: 'center', color: rgba(C.muted, 0.9) });
  });
  rich(g, `reads: ${R.hit} of ${R.n} = ${(R.hit / Math.max(1, R.n)).toFixed(3)}`, r.x + r.w * 0.03, r.y + r.h * 0.84, { size: sz, max: r.w * 0.45, color: rgba(C.soft, 0.95) });
  rich(g, 'p + q − 2pq = 2/9 = 0.222', r.x + r.w * 0.03, r.y + r.h * 0.84 + sz * 1.6, { size: sz, weight: 600, max: r.w * 0.45, color: rgba(C.teal, 1) });
  const s = Math.min(r.w * 0.11, r.h * 0.17), ox = r.x + r.w * 0.6, oy = r.y + r.h * 0.36, th = 2 / 9, y = leptonRates();
  g.strokeStyle = rgba(C.line, 0.5); g.lineWidth = 1; g.beginPath(); g.moveTo(ox - 0.55 * s, oy); g.lineTo(ox + 2.6 * s, oy); g.moveTo(ox, oy - 1.55 * s); g.lineTo(ox, oy + 1.55 * s); g.stroke();
  g.strokeStyle = rgba(C.violet, 0.6); g.beginPath(); g.arc(ox + s, oy, Math.SQRT2 * s, 0, TAU); g.stroke();
  [['τ', C.violet], ['e', C.amber], ['μ', C.teal]].forEach(([sym, rgb], k) => { const a = th + TAU * k / 3, x = ox + s + Math.SQRT2 * s * Math.cos(a), yy = oy - Math.SQRT2 * s * Math.sin(a);
    g.strokeStyle = rgba(rgb, 0.5); g.setLineDash([2, 3]); g.beginPath(); g.moveTo(x, yy); g.lineTo(x, oy); g.stroke(); g.setLineDash([]); g.strokeStyle = rgba(rgb, 1); g.lineWidth = 3; g.beginPath(); g.moveTo(ox, oy); g.lineTo(x, oy); g.stroke(); g.lineWidth = 1;
    g.fillStyle = rgba(rgb, 1); g.beginPath(); g.arc(x, yy, 3.6, 0, TAU); g.fill(); text(g, sym, x + (k === 0 ? 8 : -14), yy + (k === 2 ? 16 : -7), { size: sz * 1.15, weight: 700, color: rgba(rgb, 1) }); });
  rich(g, `m_{μ}/m_{e} = ${(y.mu / y.e).toFixed(6)}`, r.x + r.w * 0.53, r.y + r.h * 0.84, { size: sz, weight: 600, max: r.w * 0.46, color: rgba(C.text, 1) });
  rich(g, `m_{τ}/m_{e} = ${(y.tau / y.e).toFixed(4)}`, r.x + r.w * 0.53, r.y + r.h * 0.84 + sz * 1.6, { size: sz, weight: 600, max: r.w * 0.46, color: rgba(C.text, 1) });
}
function ruleRefine(g, r, t, R) {             // one cell becomes four, level by level
  const per = 3.4, L = Math.floor(t / per) % 4, f = ease(((t % per) / per) / 0.6), cx = r.x + r.w * 0.34, cy = r.y + r.h * 0.56, s = Math.min(r.w * 0.3, r.h * 0.44);
  const A = [cx, cy - s], B = [cx - s * 0.98, cy + s * 0.7], D = [cx + s * 0.98, cy + s * 0.7], mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const tri = (a, b, c, d, al, dots) => {
    if (d === 0) { g.strokeStyle = rgba(C.line, al); g.lineWidth = 1; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(c[0], c[1]); g.closePath(); g.stroke(); if (dots) { g.fillStyle = rgba(C.teal, al * 1.6); g.beginPath(); g.arc((a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, dots, 0, TAU); g.fill(); } return; }
    const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a); tri(a, ab, ca, d - 1, al, dots); tri(ab, b, bc, d - 1, al, dots); tri(ca, bc, c, d - 1, al, dots); tri(ab, bc, ca, d - 1, al, dots);
  };
  tri(A, B, D, L, 0.6 * (1 - 0.6 * f), f < 0.5 ? 3 - 0.5 * L : 0); if (f > 0) tri(A, B, D, L + 1, 0.6 * f, f > 0.5 ? 2.6 - 0.5 * L : 0);
  const tx = r.x + r.w * 0.7, ty = r.y + r.h * 0.2, dy = Math.min(26, r.h * 0.105), sz = Math.min(12.5, r.w * 0.032), now = L + (f > 0.5 ? 1 : 0);
  cap(g, 'level · carriers', tx, ty - dy * 0.75, { size: 8, max: r.x + r.w - tx });
  for (let l = 0; l <= 6; l++) rich(g, `L = ${l}      ${(20 * 4 ** l).toLocaleString('en-US')}`, tx, ty + dy * l, { size: sz, max: r.x + r.w - tx, weight: l === now || l === 6 ? 700 : 500, color: l === now ? rgba(C.teal, 1) : l === 6 ? rgba(C.amber, 1) : rgba(C.soft, 0.7) });
  cap(g, 'one face of the screen', cx, cy + s * 0.7 + 22, { size: 8, align: 'center' });
}
function ruleScale(g, r, t, R) {              // the count of each flux class, and the exponent that carries the cell down to v
  const bx = r.x + r.w * 0.04, bw = r.w * 0.42, by = r.y + r.h * 0.7, bh = r.h * 0.46, sz = Math.min(12, r.w * 0.031);
  for (let k = 1; k <= 5; k++) { const c = fluxCount(k), x = bx + bw * (k - 0.5) / 5, h = bh * c / 4, hot = k === 3;
    g.fillStyle = rgba(hot ? C.teal : C.line, hot ? 0.8 : 0.3); g.fillRect(x - 12, by - h, 24, h); glyph(g, k, x, by + 15, 5.5);
    text(g, Math.abs(c - 4) < 1e-9 ? '4' : Math.abs(c - 3) < 1e-9 ? '3' : '12/5', x, by - h - 7, { size: sz, weight: 700, align: 'center', color: rgba(hot ? C.teal : C.soft, 1) }); }
  cap(g, 'cost of one flux quantum', bx, r.y + r.h * 0.08, { size: 8, max: bw + r.w * 0.06 }); rich(g, '8π^{2} / tr H_{k}^{2}', bx + bw / 2, by + 42, { size: sz, align: 'center', max: bw, color: rgba(C.soft, 0.9) });
  const ax = r.x + r.w * 0.6, top = r.y + r.h * 0.22, H = r.h * 0.6, Yl = (l) => top + H * (19.3 - l) / 20.6;
  g.strokeStyle = rgba(C.line, 0.6); g.lineWidth = 2; g.beginPath(); g.moveTo(ax, top); g.lineTo(ax, top + H); g.stroke();
  for (const [v, s, rgb] of [[CHAIN.Ecell, 'E_{cell}', C.text], [CHAIN.MU, 'M_{U}', C.muted], [CHAIN.v, 'v = 246.60 GeV', C.teal], [CHAIN.Lambda3, 'Λ^{(3)} = 0.340 GeV', C.amber]]) { const y = Yl(Math.log10(v)); g.strokeStyle = rgba(rgb, 0.9); g.lineWidth = 1.2; g.beginPath(); g.moveTo(ax - 6, y); g.lineTo(ax + 6, y); g.stroke(); rich(g, s, ax + 13, y + 4, { size: sz * 0.95, max: r.x + r.w - ax - 15, color: rgba(rgb, 0.95) }); }
  const f = ease(((t % 4.6) / 4.6) / 0.62), y = Yl(Math.log10(CHAIN.Ecell) + f * (Math.log10(CHAIN.v) - Math.log10(CHAIN.Ecell))); g.globalCompositeOperation = 'lighter'; spot(g, C.teal, ax, y, 12, 1); g.globalCompositeOperation = 'source-over';
  rich(g, 'v = E_{cell} · e^{−2π/(4 α_{U})}', r.x + r.w - 2, r.y + r.h * 0.08, { size: sz, weight: 600, align: 'right', max: r.w * 0.46, color: rgba(C.text, 1) });
  rich(g, `e^{−${(TAU * CHAIN.invAlphaU / 4).toFixed(3)}} = 2.58 × 10^{−17}`, r.x + r.w - 2, r.y + r.h * 0.97, { size: sz * 0.92, align: 'right', max: r.w * 0.5, color: rgba(C.teal, 0.95) });
}
const RULES = { twist: ruleTwist, links: ruleLinks, continuum: ruleContinuum, heat: ruleHeat, centre: ruleCentre, reads: ruleReads, refine: ruleRefine, scale: ruleScale };
const RULE_CAP = { twist: 'law C and the register', links: 'holonomy, action, weight', continuum: 'the tick against the Dirac shell', heat: 'ticks in time are temperature',
  centre: 'carry a quantum around the flux', reads: 'the read count is the phase', refine: 'one cell becomes four', scale: 'the exponent of the chain' };

// ================================================================================================ canvases and the loop
const SEEK_SPAN = 90;               // seconds of the picture the seek bar spans
// The pictures move slowly: 30 frames a second are enough, and halve the work of 60. A machine that draws fewer than
// about 19 a second (no GPU: the canvases are rasterised on the main thread) drops to 15 and one backing pixel per CSS pixel.
const QUALITY = { frameMs: 1000 / 30, dpr: 1.5, gap: 0 };
const Loop = {
  items: new Set(), raf: 0, clock: { on: true, v: 0, last: null }, bar: null, drawn: -1e9,
  kick() { if (!this.raf && typeof requestAnimationFrame === 'function') this.raf = requestAnimationFrame((n) => this.frame(n)); },
  frame(now) {
    this.raf = 0; let live = false;
    if (now - this.drawn < QUALITY.frameMs - 2) { for (const it of this.items) if (it.active()) { this.kick(); return; } return; }
    const gap = now - this.drawn; this.drawn = now;
    if (gap < 400) { QUALITY.gap = QUALITY.gap ? 0.9 * QUALITY.gap + 0.1 * gap : gap;      // a pause (hidden tab) does not count
      if (QUALITY.dpr > 1 && QUALITY.gap > 1.6 * QUALITY.frameMs) { QUALITY.frameMs = 1000 / 15; QUALITY.dpr = 1; QUALITY.gap = 0; } }
    const c = this.clock; if (c.last === null) c.last = now; if (c.on) c.v += Math.min(100, now - c.last); c.last = now;
    if (this.bar) this.bar.pos((c.v / 1000 % SEEK_SPAN) / SEEK_SPAN);
    for (const it of this.items) { if (!it.active()) continue; live = true; try { it.draw(c.v / 1000); } catch (e) { if (!it.failed) { it.failed = true; console.error('journey: ' + it.name, e); } } }
    if (live) this.kick();
  },
};
let SC = null;
const scene = () => SC || (SC = makeScene());
function fitCanvas(cv) {            // the backing store follows the CSS box; null while the canvas has no size
  const W = cv.clientWidth, H = cv.clientHeight; if (!W || !H) return null;
  // at most 1.5 backing pixels per CSS pixel and 3 megapixels per canvas: on a wide high-density screen a full 2x store
  // is four times the fill work of 1x for little visible gain
  let r = Math.min(QUALITY.dpr, (typeof devicePixelRatio === 'number' && devicePixelRatio) || 1); r = Math.min(r, Math.sqrt(3e6 / (W * H)));
  const w = Math.round(W * r), h = Math.round(H * r);
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  const g = cv.getContext('2d'); if (!g) return null;
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); return { g, W, H, r };
}
function paintRow(pic, t) {         // one row of the page: the window [x0, x1, y0, y1] of the picture
  const f = fitCanvas(pic.cv); if (!f) return; const [x0, x1, y0] = pic.win, k = f.W / (x1 - x0);
  f.g.setTransform(f.r * k, 0, 0, f.r * k, -x0 * k * f.r, -y0 * k * f.r); drawJourney(f.g, t, scene());
}
// the part of the picture around one map, magnified: centre and width of the window in picture units
const WINDOW = { twist: [360, 660], links: [552, 660], continuum: [900, 720], heat: [1100, 660], centre: [1280, 640], reads: [1445, 560], refine: [210, 580], scale: [1340, 800] };
function paintPanel(cv, t, m, R) {    // left (or top): the journey around the map, running; right (or bottom): its rule
  const f = fitCanvas(cv); if (!f) return; const { g, W, H, r } = f, narrow = W < 760, want = narrow ? '560px' : '';
  if (cv.parentElement && cv.parentElement.style.height !== want) cv.parentElement.style.height = want;
  const ww = narrow ? W : Math.round(W * 0.58), wh = narrow ? Math.round(H * 0.46) : H, [cx, wv] = WINDOW[m.id] || [VW / 2, VW];
  const k = Math.min(ww / wv, wh / 260), span = ww / k, x0 = clamp(cx - span / 2, 0, Math.max(0, VW - span));
  g.save(); g.setTransform(r, 0, 0, r, 0, 0); g.beginPath(); g.rect(0, 0, ww, wh); g.clip();
  g.setTransform(r * k, 0, 0, r * k, -x0 * k * r, (wh / 2 - 190 * k) * r); drawJourney(g, t, scene()); g.restore();
  g.setTransform(r, 0, 0, r, 0, 0);
  cap(g, fromName(m), 16, 22, { size: 9.5 }); cap(g, toName(m), ww - 16, 22, { size: 9.5, align: 'right' });
  const rr = narrow ? { x: 0, y: wh, w: W, h: H - wh } : { x: ww, y: 0, w: W - ww, h: H };
  g.fillStyle = 'rgba(4,7,15,.62)'; g.fillRect(rr.x, rr.y, rr.w, rr.h);
  g.strokeStyle = 'rgba(140,170,230,.14)'; g.lineWidth = 1; g.beginPath(); if (narrow) { g.moveTo(0, wh + 0.5); g.lineTo(W, wh + 0.5); } else { g.moveTo(ww + 0.5, 0); g.lineTo(ww + 0.5, H); } g.stroke();
  cap(g, 'rule: ' + RULE_CAP[m.id], rr.x + 16, rr.y + 22, { size: 9.5, color: 'rgba(63,224,208,.85)' });
  g.save(); g.beginPath(); g.rect(rr.x, rr.y, rr.w, rr.h); g.clip(); RULES[m.id](g, { x: rr.x + 10, y: rr.y + 28, w: rr.w - 20, h: rr.h - 36 }, t, R); g.restore();
}
// all eight rules side by side on one canvas (a check of the cards)
const CARDS = {};
function paintCards(cv, t) {
  const f = fitCanvas(cv); if (!f) return; const { g, W, H, r } = f; g.setTransform(r, 0, 0, r, 0, 0); g.fillStyle = '#04060d'; g.fillRect(0, 0, W, H);
  MAPS.forEach((m, i) => { const w = W / 4, h = H / 2, x = (i % 4) * w, y = Math.floor(i / 4) * h; g.strokeStyle = 'rgba(140,170,230,.14)'; g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    cap(g, m.name + ': ' + RULE_CAP[m.id], x + 12, y + 20, { size: 9.5, color: 'rgba(63,224,208,.85)' });
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); RULES[m.id](g, { x: x + 8, y: y + 26, w: w - 16, h: h - 34 }, t, CARDS[m.id] || (CARDS[m.id] = {})); g.restore(); });
}
ENGINES.paintCards = paintCards;

// ================================================================================================ shared pieces of the interface
let cssDone = false;
function css() {                    // the stylesheet of the page, the panel and the bar; the pieces stay hidden until it has loaded
  if (cssDone || typeof document === 'undefined') return; cssDone = true;
  const root = document.documentElement, done = () => root.classList.add('jy-css');
  const st = document.createElement('style'); st.textContent = 'html:not(.jy-css) :is(.jm,.jbar,.jy-wrap){visibility:hidden}'; document.head.appendChild(st);
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = new URL('./style/journey.css', import.meta.url).href; l.onload = done; l.onerror = done; document.head.appendChild(l);
  setTimeout(done, 1500);
}
function go(page) {                 // open a page of the viewer
  if (typeof document === 'undefined' || !document.getElementById('page-' + page)) return;
  closeMap(); import('./app.js').then((m) => m.showPage && m.showPage(page)).catch(() => {});
}
const chip = (st) => `<span class="jy-chip" data-st="${st}" style="--c:rgb(${STATUS[st].rgb})">${STATUS[st].label}</span>`;
function srcLinks(items) {
  const seen = new Set(), out = [];
  for (const it of items) for (const [tt, u] of (typeof it === 'string' ? SRC[it] || [] : [it])) { if (seen.has(u)) continue; seen.add(u); out.push(`<a href="${u}" target="_blank" rel="noopener">${tt} ↗</a>`); }
  return `<div class="src-links">${out.join('')}</div>`;
}
const fromName = (m) => (m.inside ? m.inside[0] : STEP[m.from].name), toName = (m) => (m.inside ? m.inside[1] : STEP[m.to].name);

// ================================================================================================ the map panel
// One overlay on document.body for all maps. It works on every page and without the journey page.
let M = null, tipEl = null, tipPinned = false;
function tipBox() {
  if (!tipEl) {
    tipEl = document.createElement('div'); tipEl.id = 'jm-tip'; document.body.appendChild(tipEl);
    tipEl.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => { if (tipPinned) hideTip(); });
  }
  return tipEl;
}
function showTip(e, html, pin) {
  const el = tipBox(); el.innerHTML = html; el.style.display = 'block'; el.classList.toggle('pinned', !!pin); tipPinned = !!pin;
  const r = el.getBoundingClientRect(), pad = 14; let x = e.clientX + pad, y = e.clientY + pad;
  if (x + r.width > innerWidth - 8) x = Math.max(8, e.clientX - r.width - pad);
  if (y + r.height > innerHeight - 8) y = Math.max(8, e.clientY - r.height - pad);
  el.style.left = x + 'px'; el.style.top = y + 'px';
}
function hideTip() { if (tipEl) { tipEl.style.display = 'none'; tipEl.classList.remove('pinned'); } tipPinned = false; }
function qText(q) {
  const m = MAP[M.id], h = MAP_HELP[m.id] || {};
  if (q === 'pic') return h.pic || '';
  if (q === 'more') return (h.more || '') + srcLinks(m.src);
  return m.status.map((s) => `<b>${STATUS[s].label}.</b> ${STATUS_HELP[s] || ''}`).join('<br><br>') + (h.status ? '<br><br>' + h.status : '');
}
function buildModal() {
  css();
  const el = document.createElement('div'); el.className = 'jm'; el.id = 'journey-map'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'a map of the journey');
  el.innerHTML = `<div class="jm-box">
    <div class="jm-top"><span class="jm-kick"></span><span class="jm-grow"></span><button class="jm-prev" title="previous map (left arrow)">‹</button><button class="jm-next" title="next map (right arrow)">›</button><button class="jm-x" title="close (Esc)">×</button></div>
    <h3 class="jm-title"></h3>
    <div class="jm-ext-body"></div>
    <div class="jm-stage"><canvas></canvas><span class="hq hq-corner jm-q" data-q="pic">?</span></div>
    <p class="jm-say"></p><div class="jm-tex"></div><div class="jm-src"></div><div class="jm-lane"></div><div class="jm-go"></div></div>`;
  document.body.appendChild(el);
  const cv = el.querySelector('canvas');
  const item = { name: 'map panel', active: () => el.classList.contains('open') && !el.classList.contains('jm-ext-on'), draw: (t) => paintPanel(cv, t, MAP[M.id], M.R) };
  el.addEventListener('click', (e) => {
    if (e.target === el) return closeMap();
    const q = e.target.closest && e.target.closest('.jm-q'); if (q) { e.stopPropagation(); return showTip(e, qText(q.dataset.q), true); }
    const p = e.target.closest && e.target.closest('[data-page]'); if (p) return go(p.dataset.page);
    const n = e.target.closest && e.target.closest('[data-map]'); if (n) return openMap(n.dataset.map);
  });
  el.addEventListener('mouseover', (e) => { const q = e.target.closest && e.target.closest('.jm-q'); if (q && !tipPinned) showTip(e, qText(q.dataset.q), false); });
  el.addEventListener('mouseout', (e) => { const q = e.target.closest && e.target.closest('.jm-q'); if (q && !tipPinned) hideTip(); });
  el.querySelector('.jm-x').onclick = (e) => { e.stopPropagation(); closeMap(); };
  el.querySelector('.jm-prev').onclick = (e) => { e.stopPropagation(); stepMap(-1); };
  el.querySelector('.jm-next').onclick = (e) => { e.stopPropagation(); stepMap(1); };
  document.addEventListener('keydown', (e) => {
    if (!M || !M.el.classList.contains('open')) return;
    if (e.key === 'Escape') closeMap(); else if (e.key === 'ArrowRight') stepMap(1); else if (e.key === 'ArrowLeft') stepMap(-1); else return;
    e.stopPropagation(); e.preventDefault();
  }, true);
  return { el, cv, item, id: null, R: {} };
}
function stepMap(d) { const i = MAPS.findIndex((m) => m.id === M.id); openMap(MAPS[(i + d + MAPS.length) % MAPS.length].id); }
function fillModal(m) {
  const el = M.el, i = MAIN.indexOf(m), from = STEP[m.from], to = STEP[m.to];
  el.querySelector('.jm-kick').textContent = i >= 0 ? `map ${i + 1} of ${MAIN.length}` : m.inside ? 'inside the ' + from.name.toLowerCase() : 'secondary map';
  el.querySelector('.jm-title').innerHTML = `<span>${fromName(m)}</span><i>→</i><span>${toName(m)}</span><em>${m.name}</em><span class="jm-chips jm-q" data-q="status">${m.status.map(chip).join('')}</span>`;
  el.querySelector('.jm-say').innerHTML = m.say + '<span class="hq jm-q" data-q="more">?</span>';
  el.querySelector('.jm-tex').innerHTML = m.tex.map((s) => tex(s, true)).join('');
  el.querySelector('.jm-src').innerHTML = srcLinks(m.src);
  el.querySelector('.jm-go').innerHTML = (m.inside ? from.pages.slice(0, 2) : [from.pages[0], to.pages[0]]).map(([p, label], k) => `<button data-page="${p}">${m.inside ? label : (k ? to : from).name}<i>${k ? '›' : '‹'}</i></button>`).join('')
    + `<span class="jm-grow"></span><button data-page="journey">the whole journey</button>`;
  typeset(el);
  // the map heat names the binding of quarks into hadrons: the lane that computes it on the lattice reports its progress here
  const lane = el.querySelector('.jm-lane'); lane.innerHTML = '';
  if (m.id === 'heat') import('./progress.js').then((pg) => { if (M.id === 'heat' && !lane.firstChild) lane.appendChild(pg.laneProgress('HAD', { label: 'static potential and hadron masses on the lattice' })); }).catch(() => {});
  // The map links is the popup "how repair becomes a quantum lattice": its body is the guided explainer of the
  // lattice page. When that module or its function is missing, the panel keeps its own picture and text.
  el.classList.toggle('jm-ext', m.id === 'links'); el.classList.remove('jm-ext-on');
  if (m.id === 'links') {
    const body = el.querySelector('.jm-ext-body');
    if (M.ext) el.classList.add('jm-ext-on');
    else if (!M.extTried) {
      M.extTried = true;
      import('./lattice.js').then((mod) => {
        if (typeof mod.mountExplainer !== 'function') return;
        mod.mountExplainer(body); M.ext = true; if (M.id === 'links') el.classList.add('jm-ext-on');
      }).catch(() => { body.innerHTML = ''; });
    }
  }
}
export function openMap(id) {
  const m = MAP[id]; if (!m || typeof document === 'undefined') return false;
  if (!M) M = buildModal();
  hideTip(); if (M.id !== id) M.R = {}; M.id = id; fillModal(m); M.el.classList.add('open'); M.el.scrollTop = 0; Loop.items.add(M.item); Loop.kick();
  return true;
}
export function closeMap() { if (M) M.el.classList.remove('open'); hideTip(); Loop.kick(); }
const mapOpen = () => !!(M && M.el.classList.contains('open'));

// ================================================================================================ the journey bar
const bars = new Set(); let barPage = null, barWatch = false;
export function journeyBar() {
  css();
  const el = document.createElement('nav'); el.className = 'jbar'; el.setAttribute('aria-label', 'the journey');
  const stepB = (s) => `<button class="jb-step" data-step="${s.id}" data-page="${s.pages[0][0]}" title="${s.pages.map((p) => p[1]).join(' · ')}"><i></i><span>${s.name}</span></button>`;
  const mapB = (m) => `<button class="jb-map" data-map="${m.id}" title="the map ${m.name}: ${fromName(m)} to ${toName(m)}"><u></u><span>${m.name}</span><u></u></button>`;
  let html = '<button class="jb-home" data-page="journey" title="the whole chain on one page">Journey</button>';
  STEPS.forEach((s, i) => {
    if (i) { const m = MAIN.find((x) => x.to === s.id && x.from === STEPS[i - 1].id); html += m ? mapB(m) : '<span class="jb-gap"><u></u></span>'; }
    html += stepB(s);
    if (s.id === 'screen') html += '<button class="jb-sec" data-map="refine" title="the map refine: the screen is refined into carriers">refine</button>';
    if (s.id === 'masses') html += '<button class="jb-sec" data-map="scale" title="the map scale: the chain sets the two transition scales of the early universe">↩ scale</button>';
  });
  el.innerHTML = `<div class="jbar-in">${html}</div>`;
  el.addEventListener('click', (e) => {
    const m = e.target.closest && e.target.closest('[data-map]'); if (m) return openMap(m.dataset.map);
    const p = e.target.closest && e.target.closest('[data-page]'); if (!p) return;
    const s = STEP[p.dataset.step], here = s && s.pages.findIndex((x) => x[0] === barPage);   // a second click on the current step opens its next page
    go(s && here >= 0 ? s.pages[(here + 1) % s.pages.length][0] : p.dataset.page);
  });
  bars.add(el);
  if (!barWatch && typeof MutationObserver === 'function' && document.body) {     // every bar follows the page that app.js writes into body[data-page]
    barWatch = true; new MutationObserver(() => setJourneyPage(document.body.dataset.page)).observe(document.body, { attributes: true, attributeFilter: ['data-page'] });
  }
  setJourneyPage(barPage || (document.body && document.body.dataset.page) || null);
  return el;
}
export function setJourneyPage(page) {
  barPage = page || null; const step = STEP_OF_PAGE[barPage];
  for (const el of bars) {
    if (el.isConnected) el.__live = true; else if (el.__live) { bars.delete(el); continue; }      // a bar that was removed from the page is forgotten
    el.querySelectorAll('.jb-step').forEach((b) => b.classList.toggle('on', b.dataset.step === step));
    el.querySelectorAll('.jb-map, .jb-sec').forEach((b) => b.classList.toggle('on', !!step && MAP[b.dataset.map].to === step && !MAP[b.dataset.map].inside));
    const home = el.querySelector('.jb-home'); if (home) home.classList.toggle('on', barPage === 'journey');
    const on = el.querySelector('.jb-step.on'), box = el.querySelector('.jbar-in');
    if (on && box && box.scrollWidth > box.clientWidth) box.scrollLeft = on.offsetLeft - (box.clientWidth - on.offsetWidth) / 2;
  }
}

// ================================================================================================ the page
// The idea in three statements. Wording after the public repository: README.md ("compare records on shared
// boundaries, repair their disagreements", "protected defects that local repairs cannot undo", "effective descriptions
// of the records", "the public record, what survives every comparison") and the consensus paper ("the protected
// defects ... carry the centre classes of the Standard Model particles").
const IDEA = [
  ['Observers', 'Observers on a holographic screen compare records and repair their disagreements.'],
  ['Particles', 'What no repair can undo are <b>protected defects</b>: they carry the classes of the Standard Model particles.'],
  ['Field', 'What survives every comparison is the public record, and <b>the field</b> is its effective description.'],
];
// One row on wide screens, two rows below 1100 px, one step per row below 700 px.
const modeOf = (w) => (w >= 1100 ? 1 : w >= 700 ? 2 : 3);
const ROWS = { 1: [[0, 6]], 2: [[0, 2], [3, 6]], 3: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]] };
function rowWindow([i0, i1], mode) {          // the part of the picture a row shows: x0, x1, y0, y1 in picture units
  if (mode === 1) return [0, VW, 0, VH];
  if (mode === 2) return [i0 ? Z[i0] + 28 : 0, i1 < 6 ? Z[i1 + 1] + 32 : VW, 26, VH];      // the weights of the lattice sheets stay with the lattice
  const one = UNITS[i0] === 1; return [Math.max(0, Z[i0] - (one ? 62 : 14)), Math.min(VW, Z[i1 + 1] + (one ? 62 : 14)), one ? 58 : 30, one ? 322 : 330];
}
const mapBtn = (m, style, cls = '', arrow = '›') => `<button class="jy-mapb${m.label ? ' jy-key' : ''}${cls}" data-map="${m.id}" style="${style}--c:rgb(${STATUS[m.status[0]].rgb})" title="${fromName(m)} to ${toName(m)}"><span>${m.label || m.name}</span><i>${arrow}</i></button>`;
const SEP = '<span class="jy-sep"></span>';
const secChip = (id, label) => `<span class="jy-secwrap">${SEP}<button class="jy-secchip" data-map="${id}" title="the map ${id}: ${fromName(MAP[id])} to ${toName(MAP[id])}">${label}</button></span>`;
const stepCell = (s) => `<div class="jy-step" data-step="${s.id}"><button class="jy-name" data-page="${s.pages[0][0]}"><b>${s.n}</b><span>${s.name}</span></button><div class="jy-line">${s.line}</div>
  <div class="jy-pages">${s.pages.map(([p, label]) => `<button data-page="${p}">${label}</button>`).join(SEP)}${s.id === 'screen' ? secChip('refine', 'refine') : s.id === 'masses' ? secChip('scale', '↩ scale') : ''}</div></div>`;
let PG = null;
function buildFilm() {                        // the rows of the picture for the current width
  const { film, mode } = PG, rows = ROWS[mode];
  if (PG.io) PG.io.disconnect();
  film.className = 'jy-film jy-m' + mode;
  film.innerHTML = rows.map(([i0, i1], r) => {
    const [x0, x1, y0, y1] = rowWindow([i0, i1], mode), w = x1 - x0, at = (x) => (100 * (x - x0) / w).toFixed(2);
    const cols = STEPS.slice(i0, i1 + 1).map((s, k) => `${Math.round((i0 + k === i1 ? x1 : Z[i0 + k + 1]) - (k === 0 ? x0 : Z[i0 + k]))}fr`).join(' ');
    const inner = MAIN.slice(i0, i1).map((m, k) => mapBtn(m, `left:${at(Z[i0 + k + 1])}%;`)).join('');
    const sec = mode === 1 ? mapBtn(MAP.refine, 'left:5.7%;top:64%;', ' jy-sec') + mapBtn(MAP.scale, 'left:83.4%;top:6%;', ' jy-sec', '↩') : '';
    return `<div class="jy-row" data-row="${r}"><div class="jy-pic${x0 > 0 ? ' jy-cutl' : ''}${x1 < VW ? ' jy-cutr' : ''}" style="aspect-ratio:${Math.round(w)}/${y1 - y0}"><canvas></canvas>${inner}${sec}</div>
      <div class="jy-steps" style="grid-template-columns:${cols}">${STEPS.slice(i0, i1 + 1).map(stepCell).join('')}</div></div>`
      + (rows[r + 1] ? `<div class="jy-between">${mapBtn(MAIN[i1], '', ' jy-down', '↓')}</div>` : '');
  }).join('');
  PG.pics = [...film.querySelectorAll('.jy-row')].map((row, r) => { const cv = row.querySelector('canvas'), pic = { cv, win: rowWindow(rows[r], mode), vis: true }; cv.__pic = pic; if (PG.io) PG.io.observe(cv); return pic; });
  if (PG.io) for (const c of PG.cards || []) PG.io.observe(c.cv);
}
function paintPage(t) {                       // every visible row, and the counter of the live run
  for (const pic of PG.pics) if (pic.vis) paintRow(pic, t);
  for (const c of PG.cards || []) { if (!c.vis) continue; const f = fitCanvas(c.cv); if (!f) continue; f.g.setTransform(f.r, 0, 0, f.r, 0, 0); RULES[c.id](f.g, { x: 4, y: 2, w: f.W - 8, h: f.H - 6 }, t, c.R); }
  if (t - PG.told > 0.5) { PG.told = t; const S = scene(), n = (v) => v.toLocaleString('en-US'); PG.live.textContent = `law C on the drawn net: ${n(S.nAtt)} attempts, ${n(S.nRep)} repairs · preparation ${S.cycles}`; }
}
export function mount(host) {
  css();
  host.innerHTML = `<div class="jy-wrap">
    <div class="jy-head"><h2>Journey</h2><button class="jy-results" data-page="results" title="the board of results"><b>8</b><span>Results</span><i>›</i></button></div>
    <div class="jy-idea">${IDEA.map(([k, t]) => `<div><div class="jy-kick">${k}</div><div class="jy-say">${t}</div></div>`).join('')}</div>
    <div class="jy-ownbar"></div>
    <div class="jy-film"></div>
    <h3 class="jy-sec-title">The maps between the steps</h3>
    <div class="jy-cards">${MAPS.map((m, i) => `<div class="jy-card" data-map="${m.id}" role="button" tabindex="0" title="open the map ${m.name}">
      <div class="jy-card-h"><span class="jy-kick">${i < MAIN.length ? 'map ' + (i + 1) : 'secondary map'} · ${m.name}</span><span class="jy-card-chips">${m.status.map(chip).join('')}</span></div>
      <div class="jy-card-t">${fromName(m)} <i>→</i> ${toName(m)}</div>
      <div class="jy-card-pic"><canvas></canvas></div>
      <div class="jy-card-f"><span>${RULE_CAP[m.id]}</span><i>›</i></div></div>`).join('')}</div>
    <div class="jy-foot"><div class="jy-legend">${Object.keys(STATUS).map(chip).join('')}</div><div class="jy-live"><i></i><span></span></div></div></div>`;
  const wrap = host.querySelector('.jy-wrap'), page = host.closest ? host.closest('.page') : null;
  PG = { host, wrap, film: host.querySelector('.jy-film'), own: host.querySelector('.jy-ownbar'), live: host.querySelector('.jy-live span'), mode: modeOf(wrap.clientWidth || 1200), pics: [], told: -9, io: null };
  if (typeof IntersectionObserver === 'function') PG.io = new IntersectionObserver((es) => es.forEach((e) => { if (e.target.__pic) e.target.__pic.vis = e.isIntersecting; }));
  buildFilm();
  PG.cards = [...host.querySelectorAll('.jy-card')].map((el) => { const cv = el.querySelector('canvas'), card = { cv, id: el.dataset.map, R: {}, vis: true }; cv.__pic = card; if (PG.io) PG.io.observe(cv); return card; });
  PG.item = { name: 'picture', active: () => host.isConnected && (!page || page.classList.contains('on')) && !mapOpen(), draw: paintPage };
  Loop.items.add(PG.item);
  if (typeof ResizeObserver === 'function') new ResizeObserver(() => {      // the rows follow the width of the page; a new size is drawn at once
    const w = wrap.clientWidth; if (!w) return; const m = modeOf(w); if (m !== PG.mode) { PG.mode = m; buildFilm(); }
    if (PG.item.active()) { try { paintPage(Loop.clock.v / 1000); } catch (e) { /* the loop reports it */ } }
  }).observe(wrap);
  host.addEventListener('click', (e) => {
    if (e.target.closest && e.target.closest('.hq')) return;
    const m = e.target.closest && e.target.closest('[data-map]'); if (m) return openMap(m.dataset.map);
    const p = e.target.closest && e.target.closest('[data-page]'); if (p) go(p.dataset.page);
  });
  host.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('jy-card')) { e.preventDefault(); openMap(e.target.dataset.map); } });
  PG.own.appendChild(journeyBar());
  import('./player.js').then(({ bar }) => {          // play/pause and seek for the picture
    if (!PG || PG.host.querySelector('.jy-player')) return;
    Loop.bar = bar({ playing: Loop.clock.on, onToggle: (on) => { Loop.clock.on = on; Loop.kick(); },
      onSeek: (f) => { const c = Loop.clock, base = Math.floor(c.v / 1000 / SEEK_SPAN) * SEEK_SPAN; c.v = (base + f * SEEK_SPAN) * 1000; SC = null; if (PG) PG.told = -9; Loop.kick(); } });
    Loop.bar.el.classList.add('jy-player'); PG.film.insertAdjacentElement('afterend', Loop.bar.el);
  });
  try { paintPage(Loop.clock.v / 1000); } catch (e) { /* the first frame comes with the loop */ }
  Loop.kick();
}
export function shown(host) {
  if (!PG) return;
  // the page shows its own journey bar where the header has no journey navigation, and on request with ?bar=1
  const other = [...document.querySelectorAll('.jbar')].some((b) => !PG.host.contains(b)), nav = document.getElementById('nav');
  let asked = false; try { asked = new URLSearchParams(location.search).has('bar'); } catch (e) { /* no location */ }
  PG.own.style.display = asked || (!other && !(nav && nav.children.length)) ? '' : 'none';
  const m = modeOf(PG.wrap.clientWidth || 1200); if (m !== PG.mode) { PG.mode = m; buildFilm(); }
  setJourneyPage((document.body && document.body.dataset.page) || 'journey');
  Loop.kick();
}
