// Every match of the model with nature, in one list. Pure data: no DOM. matches.js draws the page "Matches to nature"
// and the wall of tiles on the Journey page from it, so both show the same rows and the same count.
//
// kind of a row
//   exact    the value of the model equals the value in nature exactly (charges, counts, groups)
//   number   a number of the model beside the measured number, with the deviation
//   seen     the phenomenon occurs in the model as it does in nature
//   part     the phenomenon occurs in the model; a part of the comparison with nature is open (stated in `open`)
// A row counts as a match when its kind is exact, number or seen. Rows of kind part are counted separately.
//
// Sources. Numbers of the groups "table" and "numbers" come from results_data.js (the Results board), which types
// them from the reports named there and computes every deviation. Lattice numbers come from the files of the lanes
// EW, QCD and HAD (research/<LANE>/, served as rl/<LANE>/); the constants LATTICE below are those files' values and
// are replaced by the live files when they load. Cosmology numbers come from the public comparison ledger
// (cosmos_evidence.js and references/cosmology_postdiction_ledger.json, row ids in the comments). Rows on
// phenomena follow the theory repository's executable packages model/<name> (results.json and PROOF.md); the package
// of each row is its `src`. Whether such a row is `seen` or `part` follows the project's own criterion-by-criterion
// assessment of those packages: a criterion assessed as met is `seen`, one assessed as met in part is `part`.
import { board, MEAS, RUN_L6, fmtInt } from './results_data.js';
import { COSMOLOGY_LEDGER, TILT_COMPARISONS } from './cosmos_evidence.js';
// addresses of the public sources (the same as in links.js, which needs a document and is not imported here)
const RER = 'https://github.com/FloatingPragma/observer-patch-holography/blob/main/';
const SITE = 'https://github.com/muellerberndt/oph-particles-model/blob/gh-pages/';

const PKG = (name, label) => [label || 'Proof and records: ' + name.replace(/_/g, ' '), RER + 'model/' + name + '/PROOF.md'];
const BOOK = (file, label) => [label, RER + 'book/' + file];
const PAPER = (file, label) => [label, RER + 'paper/' + file + '.pdf'];

// Values of the lattice lanes as their files state them (research/EW/ew_transition.json: oph.T_c_GeV;
// research/QCD/colour_transition.json: su3.Tc_over_sqrt_sigma and its literature_same_spacing;
// research/HAD/hadrons.json: ratios[0]).
export const LATTICE = {
  ew: { value: 161.13, ref: MEAS.T_ew.v, refText: MEAS.T_ew.text },
  tc: { value: 0.614, err: 0.018, ref: 0.5982, refErr: 0.0034 },
  nRho: { value: 1.4495, err: 0.132, ref: 1.211 },
};
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
function lattice(live = {}) {
  const L = JSON.parse(JSON.stringify(LATTICE));
  try { const t = live.ew && live.ew.placeholder !== true && live.ew.oph && live.ew.oph.T_c_GeV; if (fin(t)) L.ew.value = t; } catch (e) { /* the typed value stays */ }
  try {
    const s = live.qcd && live.qcd.placeholder !== true && live.qcd.su3;
    if (s && s.Tc_over_sqrt_sigma && fin(s.Tc_over_sqrt_sigma.value)) {
      const t = s.Tc_over_sqrt_sigma; L.tc.value = t.value; if (fin(t.err)) L.tc.err = t.err;
      if (t.literature_same_spacing && fin(t.literature_same_spacing.value)) { L.tc.ref = t.literature_same_spacing.value; L.tc.refErr = t.literature_same_spacing.err; }
    }
  } catch (e) { /* the typed values stay */ }
  try { const r = live.had && live.had.placeholder !== true && live.had.ratios && live.had.ratios[0]; if (r && fin(r.value) && fin(r.measured)) { L.nRho.value = r.value; L.nRho.err = r.err; L.nRho.ref = r.measured; } } catch (e) { /* the typed values stay */ }
  return L;
}
const paren = (v, s, dec) => v.toFixed(dec) + '(' + Math.round(s * 10 ** dec) + ')';

// plain names of the rows of the Results board
const SHORT = { mu_e: 'Muon ÷ electron mass', tau_e: 'Tau ÷ electron mass', tau_mu: 'Tau ÷ muon mass', koide: 'Koide relation Q', alpha_s: 'Strong coupling α<sub>s</sub>',
  sin2: 'Weak mixing sin²θ<sub>W</sub>', alpha_0: 'Fine structure 1/α', m_Z: 'Z mass, tree level', m_W: 'W mass, tree level' };
const NAME = {
  mu_e: 'Muon mass ÷ electron mass', tau_e: 'Tau mass ÷ electron mass', tau_mu: 'Tau mass ÷ muon mass', koide: 'Koide relation Q of the leptons',
  m_mu: 'Muon mass', m_tau: 'Tau mass', v: 'Electroweak scale v', alpha_s: 'Strong coupling α<sub>s</sub> at m<sub>Z</sub>', sin2: 'Weak mixing angle sin²θ<sub>W</sub>',
  alpha_mz: '1/α at the Z mass', alpha_0: 'Fine-structure constant 1/α', m_Z: 'Z boson mass, tree level', m_W: 'W boson mass, tree level', m_H: 'Higgs boson mass',
};
const NUMBER_TIP = {
  m_mu: 'The muon over electron ratio of the model times the measured electron mass.', m_tau: 'The tau over electron ratio of the model times the measured electron mass.',
  m_H: 'One relation between the Higgs mass and the top mass, read at the measured top mass.',
};

// Rows that answer a criterion of the OpenWave comparison (openwave_data.js lists the 31 criteria): row id -> criterion.
export const OW = { quant: 1, rest: 2, clock: 3, stable: 4, g: 5, spin: 6, turn: 7, anti: 8, annih: 8, neutrino: 9, osc: 10,
  mu_e: 11, tau_e: 11, tau_mu: 11, koide: 11, m_mu: 11, m_tau: 11, q_u: 12, q_d: 12, baryon: 13, order: 14, nucleon_mass: 15, deuteron: 16, nuclei: 17,
  meson: 18, dark: 19, coulomb: 20, boost: 21, confine: 22, running: 23, muondecay: 24, decaylaw: 24, beta: 25, attract: 26, slow: 27, bend: 27,
  w: 28, lambda: 28, maxwell: 29, shell: 30, atom: 31, gap: 31 };

export function matches(live = {}) {
  const B = board(live), L = lattice(live), mx = B.matrix;
  const cell = (q, col) => { const r = mx.rows.find((x) => x.id === q), c = r && r.cells.find((x) => x.col === col); return c ? c.text : ''; };
  const number = (r, g) => ({ id: r.id, kind: 'number', name: NAME[r.id], short: SHORT[r.id] || '', value: r.modelText, unit: r.unit || '', nature: r.meas.text, rel: r.cmp ? r.cmp.rel : null,
    dev: r.range ? r.range.map((c) => (c.rel < 0 ? '−' : '+') + (Math.abs(c.rel) * 100).toFixed(2)).join(' to ') + ' %' : '', page: g.page, tip: NUMBER_TIP[r.id] || '' });
  const numbers = B.groups.filter((g) => g.id !== 'lattice').flatMap((g) => g.rows.filter((r) => NAME[r.id] && r.meas && (r.cmp || r.range)).map((r) => number(r, g)));
  const tilt = TILT_COMPARISONS[0];                  // row ns_edge_center_P_C_planck2018_vi_ns
  const ledger = [['The cosmology comparison ledger', COSMOLOGY_LEDGER.url]];

  const groups = [
    { id: 'space', title: 'Space, time and motion', rows: [
      { id: 'dim', kind: 'seen', name: 'Dimensions of space', value: '3', page: 'readout',
        tip: 'The slow band of every carrier has three axes, and routing over many carriers gives three directions of space.',
        src: [BOOK('23-chapter-22.md', 'Book ch. 22'), PAPER('recovering_observer_spacetime_and_einstein_dynamics_from_overlap_consistency', 'Paper: observer spacetime')] },
      { id: 'time', kind: 'seen', name: 'Dimensions of time', value: '1', page: 'observer',
        tip: 'Every repair attempt has a causal depth, one more than the deepest attempt it depends on. That order is time.', src: [PAPER('executable_observer_construction', 'Paper: the execution model')] },
      { id: 'c', kind: 'seen', name: 'A speed limit for everything', value: '1 cell per tick', text: true, page: 'space',
        tip: 'Nothing moves faster than one cell per tick, and massless quanta move at exactly that speed. It is the speed of light.', src: [BOOK('18-chapter-17.md', 'Book ch. 17')] },
      { id: 'shell', kind: 'seen', name: 'Energy and momentum', value: 'E² = p² + m²', page: 'readout',
        tip: 'The energy of a quantum of the model obeys the relation of special relativity at wavelengths long against one cell.', src: [PKG('openwave_field_observables'), PKG('openwave_lepton_mass_shell')] },
      { id: 'dirac', kind: 'seen', name: 'Wave equation of matter', value: 'Dirac equation', text: true, page: 'readout',
        tip: 'Two ticks of the routing walk act on a plane wave as the free Dirac equation, up to third order in the momentum.', src: [['Code: the routing tick', SITE + 'cf1_engine.js']] },
      { id: 'landau', kind: 'number', short: 'Landau level in a magnetic field', name: 'Lowest Landau level in a magnetic field', value: '0.991', unit: '× √(2B)', nature: '1', natureWord: 'formula', rel: -0.009, page: 'space',
        tip: 'A quantum of the model in a uniform field: its first level lies 0.9 percent below the textbook value √(2B).' },
      { id: 'ab', kind: 'number', name: 'Aharonov–Bohm scattering', value: '0.980', unit: '× formula', nature: '1', natureWord: 'formula', rel: -0.02, page: 'space',
        tip: 'Scattering of a quantum at a half-flux line, between 60 and 150 degrees, lies 2.0 percent below the Aharonov–Bohm formula.' },
      { id: 'boost', kind: 'part', short: 'Moving observers', name: 'Moving observers (Lorentz boosts)', value: 'long-wave limit', text: true, page: 'readout',
        open: 'The lattice keeps a preferred frame at the scale of one cell.', tip: 'A relativistic limit with finite error bounds exists.', src: [PKG('source_mass_shell')] },
    ] },
    { id: 'quantum', title: 'A particle like the electron', rows: [
      { id: 'quant', kind: 'seen', name: 'Electric charge', value: 'whole units only', text: true, page: 'classes',
        tip: 'The charge lattice of the model has no half units, and charged arrivals carry the same quantized current and flux.', src: [PKG('openwave_charge_protection'), PKG('openwave_native_charge_flux')] },
      { id: 'q_e', kind: 'exact', name: 'Charge of the electron', value: cell('Q', 'e_L') || '−1', page: 'decoder', tip: 'Q = T₃ + Y on the pattern of the electron.', src: [PKG('openwave_native_quantum_charge'), PKG('defect_particle_classes')] },
      { id: 'spin', kind: 'seen', name: 'Spin of the electron', value: '½', page: 'classes', tip: 'The dressed charged state has total angular momentum J² = ¾, field and matter together.', src: [PKG('openwave_quantum_rotational'), PKG('openwave_local_gauss_quantum')] },
      { id: 'turn', kind: 'seen', short: 'Full turn of a spin-½ particle', name: 'One full turn of a spin-½ particle', value: 'sign flips, 720° returns', text: true, page: 'classes',
        tip: 'Rotations of the cube act on the source. An odd number of quanta returns to itself after two full turns.', src: [PKG('openwave_spin_frame_records')] },
      { id: 'stat', kind: 'seen', name: 'Matter and force particles', value: 'fermions · bosons', text: true, page: 'matches', tip: 'Quanta are fermions. Defects, links and the Higgs register are bosons.', src: [PKG('particle_primary_composite_spin')] },
      { id: 'g', kind: 'number', short: 'Magnetic moment g', name: 'Magnetic moment g of the electron', value: '1.99828', nature: '2.00232', rel: 1.9982753 / 2.00231930436 - 1, page: 'constructions',
        tip: 'The static magnetic response and the precession of the dressed charged state. The value of Dirac’s equation is 2.', src: [PKG('openwave_infinite_current'), PKG('openwave_quantum_larmor')] },
      { id: 'stable', kind: 'seen', name: 'A particle at rest', value: 'stays in one piece', text: true, page: 'constructions',
        tip: 'A localized charged packet stays localized: the probability outside its cube stays below 1.1 × 10⁻⁷ through a billion ticks.', src: [PKG('openwave_localized_rest_packet'), PKG('openwave_spatial_completion')] },
      { id: 'rest', kind: 'seen', name: 'Mass of a particle', value: 'its energy at rest', text: true, page: 'constructions',
        tip: 'The dressed charged spin-½ state of the model has a definite energy at rest, with its field included.', src: [PKG('openwave_local_gauss_quantum'), PKG('openwave_spatial_completion')] },
      { id: 'clock', kind: 'part', short: 'Internal clock', name: 'Internal clock of a particle', value: 'ticks at its rest energy', text: true, page: 'constructions',
        open: 'The clock is prepared; that it starts by itself is not shown.', tip: 'The localized packet carries a phase at its rest frequency with visibility above 0.9997.', src: [PKG('openwave_native_beat_clock')] },
      { id: 'anti', kind: 'exact', name: 'Antiparticles', value: 'one for every particle', text: true, page: 'classes', tip: 'Every class has a conjugate class with the opposite charges.', src: [PKG('particle_primary_charge_conjugation')] },
      { id: 'annih', kind: 'seen', name: 'Particle meets antiparticle', value: 'two photons', text: true, page: 'constructions',
        tip: 'A neutral particle–hole pair converts into two transverse quanta of the field. Energy, charge and momentum are conserved.', src: [PKG('openwave_radiative_pair')] },
      { id: 'cons', kind: 'exact', short: 'Charge conservation', name: 'Charge conservation in the run', value: '0 violations', text: true, page: 'defects',
        tip: fmtInt(RUN_L6.identities) + ' defects followed from birth to end in the level-6 run. Every reaction conserves the class, and every carrier ends neutral.', src: [PKG('defect_particle_classes')] },
    ] },
    { id: 'em', title: 'Electricity, light and atoms', rows: [
      { id: 'coulomb', kind: 'seen', short: 'Two charges', name: 'Force between two charges', value: '1/r² (Coulomb)', text: true, page: 'space', tip: 'The energy of two separated charges gives the inverse-square force in the static limit.', src: [PKG('openwave_current_coulomb'), PKG('openwave_autonomous_coulomb')] },
      { id: 'maxwell', kind: 'seen', name: 'Light', value: '2 polarizations', text: true, page: 'space', tip: 'The field has two transverse wave modes that propagate as Maxwell’s equations say.', src: [PKG('native_wilson_maxwell'), PKG('openwave_field_observables')] },
      { id: 'atom', kind: 'seen', name: 'Atoms', value: 'discrete levels', text: true, page: 'constructions', tip: 'A charge bound to a source has discrete standing-wave levels of negative energy.', src: [PKG('openwave_atomic_refinement')] },
      { id: 'gap', kind: 'seen', short: 'First level gap of hydrogen', name: 'First level gap of hydrogen', value: '3/8', unit: 'atomic units', page: 'constructions', tip: 'The gap between the first two levels of the model atom approaches 3/8 as the lattice is refined. Hydrogen has 3/8.', src: [PKG('openwave_atomic_refinement')] },
    ] },
    { id: 'table', title: 'The particle table', rows: [
      { id: 'group', kind: 'exact', name: 'Symmetry of the forces', value: 'SU(3) × SU(2) × U(1)', text: true, page: 'carrier', tip: 'The gauge group of the Standard Model, with the same quotient by Z₆.', src: [PAPER('deriving_standard_model_gauge_structure_from_observer_overlap_consistency', 'Paper: gauge structure')] },
      { id: 'gluons', kind: 'exact', name: 'Gluons', value: cell('n', 'g') || '8', page: 'matches' },
      { id: 'wb', kind: 'exact', short: 'W and B fields', name: 'Weak and hypercharge fields', value: (cell('n', 'W') || '3') + ' + ' + (cell('n', 'B') || '1'), page: 'matches', tip: 'Three W fields and one B field. They mix into W⁺, W⁻, Z and the photon.' },
      { id: 'higgs', kind: 'exact', name: 'Higgs field', value: 'one doublet, Y = ½', text: true, page: 'matches', tip: 'Two components with charges +1 and 0.' },
      { id: 'q_u', kind: 'exact', name: 'Charge of the up quark', value: cell('Q', 'u_L') || '+2/3', page: 'decoder' },
      { id: 'q_d', kind: 'exact', name: 'Charge of the down quark', value: cell('Q', 'd_L') || '−1/3', page: 'decoder' },
      { id: 'q_nu', kind: 'exact', name: 'Charge of the neutrino', value: cell('Q', 'nu_L') || '0', page: 'decoder' },
      { id: 'colours', kind: 'exact', name: 'Colours of a quark', value: cell('n', 'u_L') || '3', page: 'decoder' },
      { id: 'chiral', kind: 'exact', name: 'The weak force acts on', value: 'left-handed particles', text: true, page: 'decoder', tip: 'Left-handed quarks and leptons are weak doublets. Right-handed ones are singlets.' },
      { id: 'hyper', kind: 'exact', short: 'Hypercharges', name: 'Hypercharges of one generation', value: 'all 16 states', text: true, page: 'matches', tip: 'Quark doublet +1/6, up +2/3, down −1/3, lepton doublet −1/2, electron −1, right-handed neutrino 0.' },
      { id: 'bl', kind: 'exact', short: 'B − L', name: 'Baryon minus lepton number', value: 'conserved', text: true, page: 'matches', tip: 'Every operation of the source conserves B − L.' },
      { id: 'proton', kind: 'exact', short: 'Proton charge (u u d)', name: 'Charge of the proton (u u d)', value: '+1', page: 'decoder', tip: '2/3 + 2/3 − 1/3. It equals the charge of the electron with the opposite sign, exactly.' },
      { id: 'neutron', kind: 'exact', short: 'Neutron charge (u d d)', name: 'Charge of the neutron (u d d)', value: '0', page: 'decoder', tip: '2/3 − 1/3 − 1/3.' },
      { id: 'gen', kind: 'seen', name: 'Generations of leptons', value: '3', unit: 'e · μ · τ', page: 'leptons', tip: 'The three characters of one register of the carrier are the electron, the muon and the tau.', src: [PKG('lepton_register_round')] },
      { id: 'cells', kind: 'exact', short: 'All quantum numbers', name: 'Quantum numbers of one generation', value: mx.cells + ' of ' + mx.cells, text: true, page: 'matches',
        tip: 'Colour, weak isospin, hypercharge, charge, B − L and statistics of all matter states, the gauge fields and the Higgs field.', src: [PKG('defect_particle_classes')] },
    ] },
    { id: 'numbers', title: 'Masses and couplings', rows: numbers },
    { id: 'forces', title: 'Strong and weak forces', rows: [
      { id: 'ew', kind: 'number', short: 'Electroweak crossover', name: 'Temperature of the electroweak crossover', value: L.ew.value.toFixed(1), unit: 'GeV', nature: L.ew.refText, natureWord: 'Standard Model', rel: L.ew.value / L.ew.ref - 1, page: 'transitions',
        tip: 'Computed on the lattice from the couplings of the model. The reference is the lattice value for the Standard Model.' },
      { id: 'tc', kind: 'number', name: 'Colour transition T<sub>c</sub> / √σ', value: paren(L.tc.value, L.tc.err, 3), nature: paren(L.tc.ref, L.tc.refErr, 4), natureWord: 'lattice QCD', rel: L.tc.value / L.tc.ref - 1, page: 'transitions',
        tip: 'The temperature at which colour is set free, in units of the string tension, against the published lattice value at the same spacing.', src: [PKG('colour_deconfinement')] },
      { id: 'nrho', kind: 'number', name: 'Nucleon mass ÷ rho mass', value: paren(L.nRho.value, L.nRho.err, 2), nature: L.nRho.ref.toFixed(3), rel: L.nRho.value / L.nRho.ref - 1, page: 'transitions',
        tip: 'Three quarks and a quark–antiquark pair bound on the lattice of the colour links, in the limit of light quarks.', src: [PKG('quenched_hadron_binding')] },
      { id: 'decaylaw', kind: 'seen', short: 'Unstable particles', name: 'Decay of an unstable particle', value: 'exponential law', text: true, page: 'constructions',
        tip: 'After one lifetime the survival probability lies between 0.36783 and 0.36793. The exponential law gives 1/e = 0.36788.', src: [PKG('openwave_inclusive_decay')] },
      { id: 'dark', kind: 'seen', name: 'Stable neutral matter', value: 'exists', text: true, page: 'constructions', tip: 'A neutral state that stays where it is and does not decay: a candidate for dark matter.', src: [PKG('openwave_neutral_stationary'), PKG('openwave_neutral_preparation')] },
      { id: 'confine', kind: 'part', name: 'Force between two quarks', value: 'grows with distance', text: true, page: 'transitions',
        open: 'The strength of the force in physical units is not derived.', tip: 'The energy of a separated colour pair rises linearly with the distance. Quarks are confined.', src: [PKG('colour_deconfinement'), PKG('quenched_hadron_binding')] },
      { id: 'baryon', kind: 'part', name: 'Three quarks', value: 'bind, colour neutral', text: true, page: 'constructions',
        open: 'The masses of the bound states are far from the proton and the neutron.', tip: 'Three quarks bind into colour-neutral spin-½ states of charge 0 and +1.', src: [PKG('openwave_native_composites')] },
      { id: 'order', kind: 'part', name: 'Neutron and proton', value: 'the neutron is heavier', text: true, page: 'constructions',
        open: 'The masses themselves do not match.', tip: 'In the construction with unequal up and down quarks the neutral three-quark state is the heavier one.', src: [PKG('openwave_baryon_ordering')] },
      { id: 'meson', kind: 'part', name: 'Quark and antiquark', value: 'bind into mesons', text: true, page: 'constructions',
        open: 'The pion and kaon masses are not derived.', tip: 'A quark and an antiquark bind into colour-neutral states, with charged, neutral and spin-one partners.', src: [PKG('openwave_native_composites'), PKG('openwave_meson_weak_current')] },
      { id: 'deuteron', kind: 'part', name: 'Two nucleons', value: 'bind, like the deuteron', text: true, page: 'constructions',
        open: 'Lengths and species are not matched to the physical deuteron.', tip: 'Six quarks bind below two separate three-quark states, with a positive quadrupole moment.', src: [PKG('openwave_six_quark')] },
      { id: 'running', kind: 'part', short: 'Strong force strength', name: 'Strength of the strong force', value: 'changes with scale', text: true, page: 'couplings',
        open: 'The physical scale is not fixed.', tip: 'The coupling of the colour links is measured at several volumes of the lattice.', src: [PKG('openwave_scale_coupling')] },
      { id: 'muondecay', kind: 'part', name: 'A heavy lepton decays', value: 'light lepton + 2 neutrals', text: true, page: 'constructions',
        open: 'The lifetime of the muon is not derived.', tip: 'The weak current of the model turns a heavy charged lepton into a light one and two neutral particles.', src: [PKG('openwave_weak_decay'), PKG('openwave_inclusive_decay')] },
      { id: 'neutrino', kind: 'part', name: 'Neutrinos', value: 'neutral, spin ½', text: true, page: 'constructions',
        open: 'No neutrino mass is derived.', tip: 'Decays of the model emit neutral spin-½ particles.', src: [PKG('openwave_neutral_flight'), PKG('openwave_weak_decay')] },
      { id: 'osc', kind: 'part', name: 'Neutrinos in flight', value: 'oscillate, 3 families', text: true, page: 'constructions',
        open: 'The mixing angles of the model are not the measured ones.', tip: 'Three neutral families are produced, fly and are detected, and their records show appearance and disappearance.', src: [PKG('openwave_neutrino_oscillation')] },
    ] },
    { id: 'cosmos', title: 'Gravity and the cosmos', rows: [
      { id: 'ns', kind: 'number', short: 'Primordial tilt n<sub>s</sub>', name: 'Tilt of the primordial spectrum n<sub>s</sub>', value: COSMOLOGY_LEDGER.P_C_tilt.toFixed(4), nature: tilt.measurement.value.toFixed(4) + ' ± ' + tilt.measurement.sigma, natureWord: 'Planck', rel: COSMOLOGY_LEDGER.P_C_tilt / tilt.measurement.value - 1, page: 'cosmos',
        tip: 'The slope of the first density ripples, against the Planck 2018 measurement. The distance is ' + tilt.sigma_distance.toFixed(2) + ' standard deviations.', src: ledger },
      // row running_zero_planck2018_running: 0 against -0.0045 +- 0.0067
      { id: 'running_ns', kind: 'number', name: 'Running of the tilt', value: '0', nature: '−0.0045 ± 0.0067', natureWord: 'Planck', dev: 'within 0.7 σ', page: 'cosmos', src: ledger },
      // row tensor_zero_bk18_r_0p05: 0 against < 0.036 at 95 percent
      { id: 'r', kind: 'number', short: 'Primordial waves r', name: 'Primordial gravitational waves r', value: '0', nature: '< 0.036', natureWord: 'BICEP/Keck', dev: 'within the bound', page: 'cosmos', src: ledger },
      // row curvature_zero_planck2018_vi_omegak_bao: 0 against 0.0007 +- 0.0019
      { id: 'flat', kind: 'number', name: 'Curvature of space Ω<sub>K</sub>', value: '0', nature: '0.0007 ± 0.0019', natureWord: 'Planck + BAO', dev: 'within 0.4 σ', page: 'cosmos', src: ledger },
      // row fnl_zero_planck2018_ix_fnl_local: 0 against -0.9 +- 5.1
      { id: 'fnl', kind: 'number', name: 'Non-Gaussianity f<sub>NL</sub>', value: '0', nature: '−0.9 ± 5.1', natureWord: 'Planck', dev: 'within 0.2 σ', page: 'cosmos', src: ledger },
      // row isocurvature_zero_planck2018_x_cdi_general_100beta_klow: 0 against < 2.5 at 95 percent
      { id: 'iso', kind: 'number', short: 'Isocurvature share', name: 'Isocurvature share of the ripples', value: '0', nature: '< 2.5 %', natureWord: 'Planck', dev: 'within the bound', page: 'cosmos', src: ledger },
      { id: 'attract', kind: 'part', name: 'Masses', value: 'attract each other', text: true, page: 'constructions',
        open: 'The strength G is not derived.', tip: 'Two sources of energy lower their energy by approaching: an attractive force in the model’s geometry.', src: [PKG('openwave_energy_lapse'), PKG('openwave_quantum_geometry')] },
      { id: 'slow', kind: 'part', name: 'Clocks near a mass', value: 'run slower', text: true, page: 'constructions',
        open: 'The size of the effect is not calibrated.', tip: 'All seven clock gaps of the model shift together near a source.', src: [PKG('openwave_lapse_observations'), PKG('openwave_dynamic_stress')] },
      { id: 'bend', kind: 'part', name: 'A wave passing a mass', value: 'bends toward it, arrives late', text: true, page: 'constructions',
        open: 'No measured lensing angle is derived.', tip: 'A wave packet passing a source is deflected toward it and arrives later than in empty space.', src: [PKG('openwave_wave_deflection'), PKG('openwave_dynamic_wave')] },
      // rows w0wa_fixed_capacity_*: (w0, wa) = (-1, 0), the value of LambdaCDM
      { id: 'w', kind: 'part', name: 'Dark energy', value: 'w = −1', page: 'cosmos', open: 'The capacity of the cosmos is not derived.', tip: 'The equation of state of a cosmological constant, the same as in ΛCDM.', src: ledger },
      // row lambda_capacity_candidate_a_planck2018_central: 1.0959e-52 against 1.0891e-52 per square metre
      { id: 'lambda', kind: 'part', name: 'Cosmological constant Λ', value: '1.096 × 10⁻⁵²', unit: 'm⁻²', nature: '1.089 × 10⁻⁵²', natureWord: 'Planck', rel: 1.0959 / 1.0891 - 1, page: 'cosmos',
        open: 'The capacity that sets Λ is chosen with the measured value in view.', src: ledger },
    ] },
  ];
  for (const g of groups) g.rows = g.rows.filter(Boolean);
  const all = groups.flatMap((g) => g.rows);
  for (const r of all) if (OW[r.id]) r.ow = OW[r.id];
  const isMatch = (r) => r.kind !== 'part';
  const counts = { match: all.filter(isMatch).length, part: all.filter((r) => r.kind === 'part').length, exact: all.filter((r) => r.kind === 'exact').length,
    number: all.filter((r) => r.kind === 'number').length, seen: all.filter((r) => r.kind === 'seen').length };
  // what the model does not give: the open items of the Results board and three tested or untested targets
  const open = B.open.map((o) => ({ id: o.id, title: o.title, sub: o.sub, page: o.page })).concat([
    { id: 'nucleon_mass', title: 'Proton and neutron masses', sub: 'the bound three-quark states of the model lie near 1.7 MeV, against 938 MeV', page: 'constructions' },
    { id: 'beta', title: 'Beta decay of the neutron', sub: 'energetically forbidden in the construction tested', page: 'constructions' },
    { id: 'nuclei', title: 'Nuclei beyond the deuteron', sub: 'not computed', page: 'constructions' },
    { id: 'btfr', title: 'Rotation of galaxies', sub: 'the model’s Tully–Fisher exponent is 4, the measured one 3.75 ± 0.09', page: 'cosmos' },
  ]);
  for (const o of open) if (OW[o.id]) o.ow = OW[o.id];
  counts.open = open.length;
  counts.ow = all.filter((r) => r.ow).length;
  return { groups, counts, open, isMatch, board: B };
}
