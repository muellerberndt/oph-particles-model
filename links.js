// Public sources behind each derivation shown in the viewer. Every link opens in a new page.
// Theory repository: github.com/FloatingPragma/observer-patch-holography (public, branch main).
// Viewer and simulation code as published with the site: github.com/muellerberndt/oph-particles-model (branch gh-pages).
export const RER = 'https://github.com/FloatingPragma/observer-patch-holography/blob/main/';
export const SITE = 'https://github.com/muellerberndt/oph-particles-model/blob/gh-pages/';
export const DER = 'https://github.com/muellerberndt/oph-particles-model/blob/main/derivations/';
export const PAPER = (f) => RER + 'paper/' + f + '.pdf';
export const PAPERS = [
  ['Finite predictions and error bounds', './finite_results.html'],
  ['Synthesis paper (PhilPapers)', 'https://philpapers.org/rec/MUEFOC'],
  ['Execution model: an executable observer for OPH', PAPER('executable_observer_construction')],
  ['Particles from native overlap transport', PAPER('deriving_the_particle_zoo_from_observer_consistency')],
  ['Standard Model gauge structure', PAPER('deriving_standard_model_gauge_structure_from_observer_overlap_consistency')],
];
export const SRC = {
  classes: [['Paper: particles from native overlap transport', PAPER('deriving_the_particle_zoo_from_observer_consistency')], ['Derivation: defect classes are the centre classes 6Y mod 6', DER + 'MATCH.md'], ['Check script', DER + 'work/MATCH/match.py'],
    ['Proof: centre classes of the particle catalogue', RER + 'model/particle_catalogue_correspondence/PROOF.md'],
    ['Certificate: defect classes are centre classes (61 exact checks)', RER + 'model/defect_particle_classes/PROOF.md']],
  spin: [['Derivation: spin and statistics', DER + 'reports/SS.md']],
  gauge: [['Paper: Standard Model gauge structure', PAPER('deriving_standard_model_gauge_structure_from_observer_overlap_consistency')], ['Derivation: gauge group, equal couplings, gauge waves', DER + 'reports/GL.md'],['Proof: the five-level code and its gauge algebra s(u(3)+u(2))', RER + 'model/coherent_seam_repair/PROOF.md'],
    ['Lean: the 120-element frame cover SL(2,5)', RER + 'Lean/Screen/SL2F5PortCover.lean']],
  coupling: [['Paper: Standard Model gauge structure', PAPER('deriving_standard_model_gauge_structure_from_observer_overlap_consistency')], ['Derivation: the corrected coupling chain', DER + 'COUPLING_FIX.md'], ['Check script', DER + 'work/COUPLING/closure_check.py'],['Paper: the gauge closure and the fine-structure constant', RER + 'extra/fine_structure_constant_derivation.tex'],
    ['Paper: edge sectors and the compact-gauge layer', RER + 'paper/screen_microphysics_and_observer_synchronization.tex'],
    ['Status of every mass lane', RER + 'code/particles/MASS_CANDIDATE_STATUS.md']],
  lepton: [['Paper: particles from native overlap transport', PAPER('deriving_the_particle_zoo_from_observer_consistency')], ['Derivation: the lepton family register', DER + 'reports/FR.md'], ['Its open steps', DER + 'LEPTON_STEPS.md'], ['Reference engine of the mass readout', DER + 'work/LEPTON_READOUT/lepton_readout.py'],['Proof: the finite family clock (one-tick circulant, repeated tick)', RER + 'model/finite_family_clock/PROOF.md'],
    ['Code: the mass readout used on this site', SITE + 'lepton_readout.js']],
  yukawa: [['Derivation: Yukawa strengths at the cell', DER + 'reports/YC.md'], ['Up against down', DER + 'reports/UD.md'],['Proof: all quark and lepton Yukawa channels on one scalar', RER + 'model/coherent_defect_wave/chiral_joint/family_cell/PROOF.md']],
  higgs: [['Derivation: the Higgs register', DER + 'reports/UH.md'], ['Higgs and top', DER + 'reports/HT.md'],['Proof: Higgs composites of the quantum source', RER + 'model/coherent_defect_wave/chiral_joint/higgs_composites/PROOF.md']],
  neutral: [['Neutrinos', DER + 'reports/NM.md'],['Proof: Peter–Weyl links and the fifth-order neutral transfer', RER + 'model/coherent_defect_wave/chiral_joint/peter_weyl_links/PROOF.md']],
  spectrum: [['The whole spectrum, sector by sector', DER + 'SPECTRUM.md'], ['All derivations', DER + 'README.md']],
  hadrons: [['Derivation: hadron masses from the colour coupling', DER + 'reports/HD.md'], ['Colour and weak centre in the register ensemble', DER + 'reports/MA.md']],
  electroweak: [['Derivation: W, Z and v', DER + 'reports/LW.md']],
  mixing: [['Quark mixing', DER + 'reports/CM3.md'], ['Neutrino mixing', DER + 'reports/PM.md']],
  fields: [['Guide: complete finite field records', RER + 'docs/research/OPH_FINITE_FIELD_RECORDS.md']],
  run: [['Paper: the execution model', PAPER('executable_observer_construction')], ['Executable model: the federated observer source', RER + 'model/federated_observer/source.py'],
    ['Data format of the runs', SITE + 'DATASET.md'], ['The complete runs, for download', 'https://oph-particles-data-20261111.s3.amazonaws.com/index.html']],
  continuum: [['Code: the continuum Dirac field of the box', SITE + 'readout_field.js'], ['Code: the routing tick (CF-1)', SITE + 'cf1_engine.js']],
  register: [['Certificate: the charged-lepton generation register (80 checks)', RER + 'model/lepton_register_round/PROOF.md']],
  scope: [['Proof: scope of the particle constructions', RER + 'model/particle_construction_scope/PROOF.md']],
  tables: [['Source table: candidate confirmation', RER + 'model/particle_candidate_confirmation/results.json'], ['Source table: internal gauge weights', RER + 'model/standard_model_source_map/candidates/correspondence.json']],
  status: [['Status of every lane', DER + 'CONSOLIDATED_STATUS.md']],
  lift: [['Proof: defect classes are centre classes', RER + 'model/defect_particle_classes/PROOF.md'], ['Data format of the runs', SITE + 'DATASET.md']],
  couplingChain: [['Derivation: the anchor at the first freeze of the weak currents', DER + 'reports/CA_ANCHOR.md'], ['Derivation: the unification scale and the power of P', DER + 'reports/CU_UNIFICATION.md'],
    ['Derivation: the hypercharge slope and the exact ratio', DER + 'reports/CH_HYPERCHARGE.md'], ['Derivation: the collar law', DER + 'reports/CG_COLLAR.md'],
    ['Derivation: the law for v and the count 4', DER + 'reports/LV.md'], ['Audit: the dictionary between heat time and coupling', DER + 'reports/CC.md'],
    ['Certificate: plaquette cost of each flux class', RER + 'model/defect_particle_classes/flux_costs.py'], ['Proof: defect classes and particle classes', RER + 'model/defect_particle_classes/PROOF.md'],
    ['Code: the chain solver of this page', SITE + 'couplings_chain.js'], ['Its check against the reference tables', SITE + 'couplings_check.mjs']],
};

// What to read for each page: the papers and the chapters of the book, shown in the strip below the header.
const BOOK = (file) => RER + 'book/' + file;
const CH = (n, file, title) => [`Book ch. ${n}`, BOOK(file), title];
const P = {
  synthesis: ['Synthesis paper', 'https://philpapers.org/rec/MUEFOC', 'From observer consensus to standard physics'],
  execution: ['Execution model', PAPER('executable_observer_construction'), 'An executable observer for OPH'],
  consensus: ['Consensus paper', PAPER('reality_as_consensus_protocol'), 'Reality as a consensus protocol'],
  observers: ['Observers paper', PAPER('observers_are_all_you_need'), 'Observers are all you need'],
  particles: ['Particle paper', PAPER('deriving_the_particle_zoo_from_observer_consistency'), 'Particles from native overlap transport'],
  gauge: ['Gauge paper', PAPER('deriving_standard_model_gauge_structure_from_observer_overlap_consistency'), 'Standard Model gauge structure'],
  koide: ['Lepton paper', RER + 'extra/koide_identity_from_positive_c3_face_circulants.pdf', 'The charged-lepton register and Koide identity'],
  alpha: ['Coupling paper', RER + 'extra/fine_structure_constant_derivation.pdf', 'The gauge closure and the fine-structure constant'],
};
export const BOOK_PDF = BOOK('reverse-engineering-reality-book.pdf');
const READ_STEP = {
  journey: [P.synthesis, CH(1, '02-chapter-01.md', 'Why is the universe so hard to reverse engineer?'), CH(35, '36-chapter-35.md', 'What is anything made of?')],
  screen: [P.execution, P.consensus, CH(9, '10-chapter-09.md', 'What move does reality actually make?'), CH(13, '14-chapter-13.md', 'What is one piece of reality actually made of?')],
  defects: [P.consensus, CH(6, '07-chapter-06.md', "Why isn't agreeing with your neighbors enough?"), CH(28, '29-chapter-28.md', 'What is a particle, what is a wave?')],
  lattice: [P.gauge, CH(26, '27-chapter-26.md', 'Why exactly these forces?'), CH(31, '32-chapter-31.md', 'What is a Lagrangian?')],
  field: [P.particles, CH(28, '29-chapter-28.md', 'What is a particle, what is a wave, and why does it look like both?'), CH(17, '18-chapter-17.md', 'Why is there a speed limit?')],
  nowave: [P.observers, P.consensus, CH(5, '06-chapter-05.md', 'Why do you and I see the same table?'), CH(19, '20-chapter-19.md', "Why can't you ask everything at once?")],
  early: [P.gauge, CH(27, '28-chapter-27.md', 'Why this exact list of matter, and why three times over?'), CH(36, '37-chapter-36.md', 'Why these laws and not others?')],
  particles: [P.particles, P.gauge, CH(27, '28-chapter-27.md', 'Why this exact list of matter, and why three times over?')],
  masses: [P.koide, P.particles, CH(30, '31-chapter-30.md', 'Why do the masses land where they do?')],
  couplings: [P.alpha, P.gauge, CH(29, '30-chapter-29.md', 'Why 1/137?')],
  results: [P.synthesis, CH(33, '34-chapter-33.md', 'Why was every open problem the same problem?'), ['Book appendix D', BOOK('47-appendix-d.md'), 'Run it yourself']],
};
const STEP_OF = { journey: 'journey', universe: 'screen', carrier: 'screen', observer: 'screen', defects: 'defects', lattice: 'lattice',
  readout: 'field', nowave: 'nowave', space: 'field', cosmos: 'early', timeline: 'early', transitions: 'early',
  classes: 'particles', decoder: 'particles', map: 'particles', masses: 'masses', cosmology: 'early', leptons: 'masses', spectrum: 'masses', couplings: 'couplings', results: 'results', matches: 'results', constructions: 'results', openwave: 'results' };
export function readLinks(page) { return READ_STEP[STEP_OF[page]] || []; }
export function linkList(keys) {
  const items = [].concat(...keys.map((k) => SRC[k] || []));
  if (!items.length) return '';
  return `<div class="src-links">${items.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join('')}</div>`;
}
const st = document.createElement('style');
st.textContent = `.src-links{display:flex;flex-wrap:wrap;gap:6px 14px;margin:8px 0 2px}.src-links a{font-size:12px;color:#7fb8ff;text-decoration:none;border-bottom:1px solid rgba(127,184,255,.3)}
.src-links a:hover{color:#3fe0d0;border-color:#3fe0d0}`;
document.head.appendChild(st);

// a "papers" menu in the header bar, on every page
function papersMenu() {
  const top = document.getElementById('top'); if (!top || document.getElementById('papers-btn')) return;
  const wrap = document.createElement('div'); wrap.id = 'papers-btn';
  wrap.innerHTML = `<button title="the papers behind this site">papers</button><div class="papers-pop"><a href="https://oph-book.floatingpragma.ai/" target="_blank" rel="noopener"><b>Read the book online</b> ↗</a><a href="https://notebooklm.google.com/notebook/d5249760-6ce8-44a0-927b-ccf90402711a" target="_blank" rel="noopener"><b>Ask the OPH Notebook</b> ↗</a>${PAPERS.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join('')}<a href="https://github.com/muellerberndt/oph-particles-model/blob/main/derivations/README.md" target="_blank" rel="noopener">All derivations behind this site ↗</a><a href="${BOOK_PDF}" target="_blank" rel="noopener">The book: Reverse Engineering Reality (PDF) ↗</a><a href="https://oph-particles-data-20261111.s3.amazonaws.com/index.html" target="_blank" rel="noopener">The complete simulation runs, for download ↗</a></div>`;

  const pop = wrap.querySelector('.papers-pop'); document.body.appendChild(pop);   // outside the header, whose blur would clip it
  pop.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', () => pop.classList.remove('open'));
  wrap.querySelector('button').onclick = (e) => {   // the header scrolls sideways, so the menu is placed in fixed position
    e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect();
    pop.style.left = Math.min(r.left, innerWidth - 350) + 'px'; pop.style.top = (r.bottom + 6) + 'px'; pop.classList.toggle('open');
  };
  const about = document.createElement('a'); about.id = 'about-link'; about.href = 'about.html'; about.textContent = 'about';
  about.title = 'what OPH is, with the paper, the book and the repository';
  top.appendChild(about);
  top.appendChild(wrap);
  const st2 = document.createElement('style');
  st2.textContent = `#about-link{background:rgba(20,30,52,.85);color:var(--text);border:1px solid var(--edge);border-radius:9px;padding:6px 11px;font-size:13px;text-decoration:none;white-space:nowrap}#about-link:hover{border-color:#3a5586;background:#17233b}#papers-btn{position:relative}#papers-btn>button{border-color:rgba(63,224,208,.45);color:#3fe0d0}.papers-pop{display:none;position:fixed;z-index:30;min-width:330px;padding:8px;border-radius:12px;background:rgba(9,14,26,.97);border:1px solid #2b3d63;box-shadow:0 18px 50px -20px #000}
.papers-pop.open{display:flex;flex-direction:column}.papers-pop a{padding:7px 10px;border-radius:8px;color:#dfe6f5;text-decoration:none;font-size:13px}.papers-pop a:hover{background:rgba(63,224,208,.12);color:#3fe0d0}`;
  document.head.appendChild(st2);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', papersMenu); else papersMenu();
