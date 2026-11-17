// The main equations of every step of the viewer, with status and sources. Rendered by equations.js at the foot of
// each main page. Every formula was compared with its source before it was entered here; the source and the check
// are named in the comment above each card. Checks V1 to V15: repair-law/work/SIM/phase2/EQUATIONS/verify_equations.py
// (25 checks, all pass, 2026-11-11). Help texts: help/equations.js.
//
// Card: { tex, name, what, status, links }.  tex: KaTeX source of one display formula.  name: the card title.
// what: one line of HTML.  status: a key of STATUS.  links: [kind, title, url] with kind one of paper, proof, code,
// report, data, source.  standard: true marks a standard relation of physics that a page uses: it is no statement of
// the model, carries no status chip and is labelled "standard relation" (owner's ruling: nothing "imported").
// Wording and statuses follow repair-law/work/SIM/phase2/ADDENDUM_THEORY.md.
import { RER, SITE, DER, PAPER } from './links.js';

export const STATUS = {
  derived: { label: 'derived', color: 'var(--teal,#3fe0d0)', title: 'Exact, with a proof or an executable certificate in the sources.' },
  conditional: { label: 'conditional', color: 'var(--blue,#6fb1ff)', title: 'A construction with stated premises, executable. What is shown is exact given them.' },
  premise: { label: 'one premise', color: 'var(--blue,#6fb1ff)', title: 'Follows from the sources given one stated premise.' },
  declared: { label: 'declared', color: 'var(--amber,#ffb44a)', title: 'A declared form or construction. What is shown is exact given it. Its derivation from the source is open.' },
  open: { label: 'open', color: 'var(--red,#ff6480)', title: 'The source does not give it yet.' },
};

const T = String.raw;
const EXEC = PAPER('executable_observer_construction');
const ZOO = PAPER('deriving_the_particle_zoo_from_observer_consistency');
const CARRIER = RER + 'paper/screen_microphysics_and_observer_synchronization.pdf';
const ALPHA = RER + 'extra/fine_structure_constant_derivation.pdf';
const DPC = RER + 'model/defect_particle_classes/';
const LRR = RER + 'model/lepton_register_round/';
const DATASET = SITE + 'DATASET.md';

export const CARDS = {
  // ---------------------------------------------------------------------------------------------- network and law
  // Source: DATASET.md section 1 (N = 20 * 4^level, 33 seams per carrier: 30 own, 3 glue); execution paper, carrier
  // section ("twelve primitive ports ... thirty seams and twenty faces"); model/federated_observer/source.py
  // (cells = 20 * 4^level, seams = 63 cells / 2). Check V4 against run.json of levels 3 to 7.
  counts: {
    tex: T`\begin{gathered}N=20\cdot 4^{L}\ \ \text{carriers}\\[3pt] 12\ \text{ports},\quad 30\ \text{seams},\quad 20\ \text{faces}\end{gathered}`,
    name: 'The network',
    what: 'A closed screen at refinement level L. Every carrier is the same icosahedral cell, joined to its neighbours by three glue seams.',
    status: 'declared',
    links: [['paper', 'Execution model', EXEC], ['code', 'Federation of carriers', RER + 'model/federated_observer/source.py'], ['data', 'Data format of the runs', DATASET]],
  },
  // Source: run.json field law.formula; DATASET.md section 1 "Law C"; execution paper eq. (native) and Proposition
  // "The classical seam rule"; model/observer/native.py. Checks V1 (three forms agree) and V3b (80,640 stored attempts).
  lawC: {
    tex: T`\begin{gathered}t=x_a+x_b,\qquad x_a'=\begin{cases}\lceil t/2\rceil & c=1\\ \lfloor t/2\rfloor & c=0\end{cases}\\[3pt] x_b'=t-x_a',\qquad j=x_a-x_a'\end{gathered}`,
    name: 'Law C',
    what: 'One repair attempt on the seam (a, b) with a fair coin c. The record is (c, j).',
    status: 'derived',
    links: [['paper', 'Execution model: native repair', EXEC], ['proof', 'Carrier paper: the seam rule is unique', CARRIER], ['code', 'The native rule', RER + 'model/observer/native.py']],
  },
  // Source: execution paper, Proposition "Native repair instrument" item (ii): no branch increases sum x_p^2;
  // DATASET.md section 1: j (d - j) is the drop of 1/2 sum x^2; section 4: V = sum of squared loads. Check V2.
  descent: {
    tex: T`\begin{gathered}V=\sum_{p}x_p^{2}\\[3pt] \Delta V=-2\,j\,(d-j)\ \le\ 0,\qquad d=x_a-x_b\end{gathered}`,
    name: 'Descent',
    what: 'No repair raises V. A tie swap leaves it unchanged.',
    status: 'derived',
    links: [['paper', 'Execution model: native repair instrument', EXEC], ['data', 'Data format: V and released potential', DATASET]],
  },
  // Source: DATASET.md section 1, declared layers "Causal depth" and "Consistent cuts"; run.json field layers.
  depth: {
    tex: T`\begin{gathered}T(e)=1+\max_{e'\prec e}T(e')\\[3pt] \text{slice}_T=\{\,e:\ T(e)\le T\,\}\end{gathered}`,
    name: 'Synchronised time',
    what: 'The causal depth of an attempt e. Earlier attempts e′ share a port or a plaquette with it.',
    status: 'declared',
    links: [['data', 'Data format: causal depth and cuts', DATASET], ['paper', 'Execution model', EXEC]],
  },
  // Source: DATASET.md section 7: displacement x(n) = sum_p n_p u_p, axial Z_n = sum (u_a x u_b) j, own tick = row + 1.
  tape: {
    tex: T`\begin{gathered}x(n)=\sum_{p=1}^{12}x_p(n)\,u_p\\[3pt] Z(n)=\sum_{\text{records}\,\le\,n}\big(u_a\times u_b\big)\,j\end{gathered}`,
    name: 'One observer\'s tape',
    what: 'Load-weighted position and axial circulation against its own tick n.',
    status: 'declared',
    links: [['data', 'Data format: observer files', DATASET], ['paper', 'Execution model', EXEC]],
  },
  // Source: model/coherent_seam_repair/PROOF.md, "Walk and reference": Q, R = 2AA* - I, W = QR,
  // A*QA = diag(P, P_sign), P = I - L/60, A* W^t A = T_t(A*QA).
  walk: {
    tex: T`\begin{gathered}W=QR,\qquad R=2AA^{\dagger}-I\\[3pt] A^{\dagger}W^{t}A=T_t\!\big(A^{\dagger}QA\big),\qquad A^{\dagger}QA\,\big|_{\text{blank}}=I-\tfrac{L}{60}\end{gathered}`,
    name: 'The coherent walk',
    what: 'Its consensus block is a Chebyshev polynomial of the committed one-load kernel.',
    status: 'declared',
    links: [['proof', 'Finite coherent repair', RER + 'model/coherent_seam_repair/PROOF.md'], ['code', 'The public program', RER + 'model/coherent_seam_repair/program.py'], ['code', 'Walk engine of this site', SITE + 'walk_engine.js']],
  },
  // Source: execution paper eq. (kraus) and Proposition "Native repair instrument" item (i) (the squared effects sum
  // to the identity; the channel is completely positive and trace preserving). Check V14 on the 78 configurations.
  record: {
    tex: T`\begin{gathered}L^{e}_{(c,j)}=\tfrac{1}{\sqrt2}\sum_{x:\ j(x,c)=j}|\,y(x,c)\rangle\langle x\,|\\[3pt] \rho\ \mapsto\ \sum_{r}L^{e}_{r}\,\rho\,L^{e\dagger}_{r},\qquad \sum_{r}L^{e\dagger}_{r}L^{e}_{r}=I\end{gathered}`,
    name: 'The record law',
    what: 'One repair attempt as a quantum instrument. Every record r = (c, j) has one operator. y(x, c) is the repaired configuration.',
    status: 'derived',
    links: [['paper', 'Execution model: native repair and its record laws', EXEC], ['code', 'The native rule', RER + 'model/observer/native.py'], ['code', 'Detector engine of this site', SITE + 'lab.js']],
  },

  // ---------------------------------------------------------------------------------------------- defects
  // Source: DATASET.md section 1 "Register (declared extension)"; run.json layers.register.rule. Check V3c.
  twist: {
    tex: T`\begin{gathered}\delta=j \bmod 6\\[3pt] k_{+}\to k_{+}+\delta,\qquad k_{-}\to k_{-}-\delta \pmod 6\end{gathered}`,
    name: 'The register',
    what: 'A repair with current j proposes a twist of the two faces that traverse its seam in opposite directions.',
    status: 'declared',
    links: [['data', 'Data format: the register', DATASET], ['paper', 'Which defect is which particle', ZOO]],
  },
  // Source: run.json layers.register (cost [0,5,8,10,8,5], kappa 5); DATASET.md section 1. The cost change is the sum
  // over both faces (SIM oph_defects/kernels.py: de = cost[n1] + cost[n2] - cost[k1] - cost[k2]; applied when
  // de <= kappa * cur * (d - cur)). Check V3a and V3c (5,782 accepted and 23,926 blocked twists of the level-3 run).
  accept: {
    tex: T`\begin{gathered}c(k_+')+c(k_-')-c(k_+)-c(k_-)\ \le\ \kappa\,j\,(d-j)\\[3pt] c=(0,\,5,\,8,\,10,\,8,\,5),\qquad \kappa=5\end{gathered}`,
    name: 'Acceptance of a twist',
    what: 'The twist is applied when the mismatch potential released by the repair covers the change of the register cost.',
    status: 'declared',
    links: [['data', 'Data format: the register', DATASET]],
  },
  // Source: defect_particle_classes/PROOF.md section 6 (every seam bounds two faces with opposite orientation);
  // DATASET.md section 11. Check V5 on the end cut of the level-3 run.
  neutral: {
    tex: T`\sum_{f=1}^{20}k_f\equiv 0 \pmod 6`,
    name: 'No lone class',
    what: 'Every seam bounds two faces with opposite orientation, so the classes on a closed carrier add to zero.',
    status: 'derived',
    links: [['proof', 'Defect classes: closed carriers', DPC + 'PROOF.md'], ['data', 'Data format: checks', DATASET]],
  },
  // Source: defect_particle_classes/PROOF.md section 5 (16 reaction types and the pair channels conserve the class).
  reactions: {
    tex: T`a+b\to c:\qquad k_a+k_b\equiv k_c \pmod 6`,
    name: 'Reactions',
    what: 'Every birth, fusion, split and annihilation conserves the class. Pairs are born as (1, 5), (2, 4) or (3, 3).',
    status: 'derived',
    links: [['proof', 'Defect classes: reactions', DPC + 'PROOF.md'], ['report', 'Defects as particles: the match', DER + 'MATCH.md']],
  },

  // ---------------------------------------------------------------------------------------------- classes
  // Source: defect_particle_classes/PROOF.md section 1; tex fragment DEFECT_PARTICLE_CLASSES.tex, Theorem
  // "Defect classes are particle classes"; RL/MATCH.md "The rule". Check V6 (32 patterns, multiplicities 4,6,6,4,6,6).
  rule: {
    tex: T`\begin{gathered}k\equiv 6Y \pmod 6\\[3pt] 6Y=3n_2-2n_3,\qquad Q=T_3+Y\end{gathered}`,
    name: 'The class rule',
    what: 'A pattern with n₃ colour levels and n₂ weak levels occupied. Exact on all 32 patterns.',
    status: 'derived',
    links: [['proof', 'Defect classes are centre classes', DPC + 'PROOF.md'], ['paper', 'Which defect is which particle', ZOO], ['code', 'Certificate, 61 checks', DPC + 'certificate.py']],
  },
  // Source: PROOF.md sections 4 and 9 (the class-k element (exp(2 pi i Y))^k; phase exp(2 pi i f k / 6)); tex fragment.
  flux: {
    tex: T`\begin{gathered}z_k=e^{2\pi i\,kY},\qquad Y=\operatorname{diag}\!\big(-\tfrac13,-\tfrac13,-\tfrac13,\tfrac12,\tfrac12\big)\\[3pt] \text{around a flux of class } f:\quad e^{2\pi i\,fk/6}\end{gathered}`,
    name: 'The flux of a defect',
    what: 'A class-k defect carries a central element of the gauge group. A quantum of class k taken around a flux picks up this phase.',
    status: 'derived',
    links: [['proof', 'Defect classes: flux visibility', DPC + 'PROOF.md'], ['report', 'Defects as particles: the match', DER + 'MATCH.md']],
  },
  // Source: tex fragment, subsection "Gauge group, couplings and lepton number"; PROOF.md section 2 (the kernel
  // element); RL/reports/GL.md. Check V6 (the element acts as the identity on all 32 patterns).
  group: {
    tex: T`G=\mathrm{S}\big(\mathrm{U}(3)\times\mathrm{U}(2)\big)=\frac{\mathrm{SU}(3)\times\mathrm{SU}(2)\times\mathrm{U}(1)}{\mathbb{Z}_6}`,
    name: 'The gauge group',
    what: 'It follows from independent port phases on the five-level code. Z₆ is the kernel of the quotient.',
    status: 'derived',
    links: [['paper', 'Gauge group, couplings and lepton number', ZOO], ['report', 'Gauge group from port phases', DER + 'reports/GL.md'], ['proof', 'The Z6 kernel', DPC + 'PROOF.md']],
  },
  // Source: PROOF.md section 7 and premises P1, P2, P4; tex fragment "Spin and statistics"; RL/reports/SS.md.
  spin: {
    tex: T`\begin{gathered}R(2\pi)=(-1)^{N}\\[3pt] \rho(z)=\operatorname{diag}(1,1,1,-1,-1)=e^{\,i\pi\cdot 6Y}\end{gathered}`,
    name: 'Spin and statistics',
    what: 'N counts the quanta. Quanta are fermions; defects, links and the Higgs register are bosons.',
    status: 'derived',
    links: [['proof', 'Defect classes: spin and statistics', DPC + 'PROOF.md'], ['report', 'Spin and statistics', DER + 'reports/SS.md'], ['code', 'Gradings', DPC + 'statistics.py']],
  },
  // Source: tex fragment ("Every operation of the source conserves B - L = N - (2/3)(N_c1 + N_c2 + N_c3)");
  // RL/reports/DG.md item 2. Check V6 (values +-1/3 and +-1 on the 32 patterns).
  bl: {
    tex: T`B-L=N-\tfrac23\,\big(N_{c1}+N_{c2}+N_{c3}\big)`,
    name: 'Exact B − L',
    what: 'The declared operations conserve it and exclude Majorana pairing in that sector. A physical neutrino identity requires a separate attachment.',
    status: 'derived',
    links: [['paper', 'Gauge group, couplings and lepton number', ZOO], ['report', 'B − L and the neutrino sector', DER + 'reports/DG.md']],
  },

  // ---------------------------------------------------------------------------------------------- field
  // Source: cf1_engine.js header (one tick: mass(theta) . (Q_3 R)(Q_2 R)(Q_1 R), Q_i R = P+ T_i + P- T_i*,
  // alpha_i = X_record sigma_i, mass exp(-i theta Y_record)); RL/candidates/CF1.md sections 2 and 3. Check V8a.
  tick: {
    tex: T`\begin{gathered}U_{\rm tick}=e^{-i\theta\beta}\,S_3S_2S_1\\[3pt] S_i=Q_iR=P_i^{+}T_i+P_i^{-}T_i^{\dagger},\qquad P_i^{\pm}=\tfrac12\,(1\pm\alpha_i)\\[3pt] \alpha_i=X\otimes\sigma_i,\qquad \beta=Y\otimes 1\end{gathered}`,
    name: 'The routing tick',
    what: 'Candidate program CF-1: three seam steps oriented by the spin, then the mass step. The axis order alternates.',
    status: 'declared',
    links: [['code', 'The routing tick', SITE + 'cf1_engine.js'], ['report', 'Candidate program CF-1', DER + 'candidates/CF1.md']],
  },
  // Source: readout_field.js header; readout.js step 4 ("If both p and theta scale as epsilon, it agrees with
  // exp(-2i(alpha.p + theta beta)) up to O(epsilon^3). Holding theta fixed while only shrinking p is a different
  // limit."). Checks V8b (orders 2.99, 3.00, 3.00) and V8c (order 1 in p alone at fixed theta).
  twoticks: {
    tex: T`\begin{gathered}U_{\rm tick}'\,U_{\rm tick}=\exp\!\big[-2i\,(\boldsymbol{\alpha}\!\cdot\!\mathbf{p}+\theta\beta)\big]+O(\epsilon^{3})\\[3pt] |\mathbf{p}|,\ \theta\sim\epsilon\end{gathered}`,
    name: 'Two ticks',
    what: 'Taken in the half-step frame on a plane wave. The error is of third order in momentum and rest angle together.',
    status: 'declared',
    links: [['code', 'The continuum field of the box', SITE + 'readout_field.js'], ['source', 'Finite routing bound and scope', SITE + 'readout_limit.md']],
  },
  // Source: readout_field.js header (i d(psi)/dt = (alpha.p + m beta) psi, c = one cell per tick, m = theta per tick).
  dirac: {
    tex: T`\begin{gathered}i\,\partial_t\psi=\big(\boldsymbol{\alpha}\!\cdot\!\mathbf{p}+m\,\beta\big)\,\psi\\[3pt] c=1\ \text{cell per tick},\qquad m=\theta\ \text{per tick}\end{gathered}`,
    name: 'The Dirac equation',
    what: 'The limit of the tick for wavelengths long against one cell.',
    status: 'declared',
    links: [['code', 'The continuum field of the box', SITE + 'readout_field.js'], ['report', 'Candidate program CF-1', DER + 'candidates/CF1.md']],
  },
  // Source: readout.js card "Rest mass" (E0 = hbar theta / tau, tau = hbar / E_cell); RL/MATCH.md (unit correction by
  // worker DC: the tick is hbar / E_cell); RL/candidates/CF1.md section 6 (mass step and the unit of the tick declared).
  // Source: RL/candidates/CF1.md section 4 item 2 ("One axis, exactly cos E = cos(theta) cos(p)") and its five
  // numbers; RL/work/HR/FOR_SIM.md section 4 item 3. Check V8d (difference to the CF-1 numbers below 4e-7).
  dispersion: {
    tex: T`\cos E=\cos\theta\,\cos p \qquad\Longrightarrow\qquad E^{2}\simeq p^{2}+\theta^{2}`,
    name: 'Dispersion on one axis',
    what: 'Exact for the tick. For small p and θ it is the relation of special relativity.',
    status: 'declared',
    links: [['report', 'Candidate program CF-1', DER + 'candidates/CF1.md'], ['code', 'The routing tick', SITE + 'cf1_engine.js']],
  },

  // ---------------------------------------------------------------------------------------------- lattice
  // Source: RL/reports/GL.md item 4 (A1: the seam cost of a code state carried around a plaquette, averaged over the
  // code, is 1 - Re tr5(U_P)/5); RL/work/HR/SPEC.md section 2 (beta_5 = 10/g^2); tex fragment (the continuous port
  // phases are the extension that makes the links continuous). Check V11.
  plaquette: {
    tex: T`\begin{gathered}S_G=\beta_5\sum_{P}\Big[1-\tfrac15\,\operatorname{Re}\operatorname{tr}_5U_P\Big]\\[3pt] \beta_5=\frac{10}{g^{2}},\qquad U_P=\prod_{\ell\in\partial P}U_\ell\end{gathered}`,
    name: 'The plaquette action',
    what: 'The seam cost of a code state carried around a face, averaged over the code. The continuous links are a declared extension.',
    status: 'declared',
    links: [['report', 'Links, action and bare couplings', DER + 'reports/GL.md'], ['paper', 'Gauge group, couplings and lepton number', ZOO], ['source', 'The gauge-Higgs system, specification', DER + 'work/HR/SPEC.md']],
  },
  // Source: RL/work/HR/FOR_SIM.md section 3 ("Weight exp(-S) ... Haar measure per link, flat measure per doublet");
  // RL/reports/MA.md part 0 (links U = omega^n, weight exp(kappa sum_p Re W_p)).
  weight: {
    tex: T`\begin{gathered}w[U]=e^{-S[U]}\\[3pt] \text{register ensemble:}\quad w=\exp\!\Big(\kappa\sum_{P}\operatorname{Re}W_P\Big)\end{gathered}`,
    name: 'The ensemble',
    what: 'What a lattice computation samples. A run follows one history of repairs. The lattice samples all link configurations.',
    status: 'declared',
    links: [['report', 'The register ensemble', DER + 'reports/MA.md'], ['source', 'Porting the gauge-Higgs system into the run', DER + 'work/HR/FOR_SIM.md']],
  },
  // Source: RL/work/HR/FOR_SIM.md section 2 ("The class of a plaquette is the centre class of its holonomy ... Class 3
  // is the weak centre element V_P = -1. Its cost ... is 2 beta_G per plaquette ... The register of the runs is the
  // centre projection of the links."). Check V11 (class-3 cost 2 beta_G).
  pclass: {
    tex: T`\begin{gathered}U_P=e^{2\pi i\,kY}\quad\Longleftrightarrow\quad \text{class } k\\[3pt] (a,\,C,\,V)\sim\big(a+\tfrac{\pi}{3},\ \omega C,\ -V\big)\end{gathered}`,
    name: 'The class of a face',
    what: 'It is the centre class of the holonomy. The Z₆ register of the runs is the centre projection of the links.',
    status: 'declared',
    links: [['source', 'Porting the gauge-Higgs system into the run', DER + 'work/HR/FOR_SIM.md'], ['proof', 'Central flux costs', DPC + 'PROOF.md']],
  },
  // Source: RL/work/HR/FOR_SIM.md section 3 (E4: the equilibrium ensemble at T = E_cell / N_t; N_t = N is the vacuum)
  // and section 6 item 1; SPEC.md section 1 (one tick per cell, DECLARED).
  temperature: {
    tex: T`T=\frac{E_{\rm cell}}{N_t}`,
    name: 'Temperature',
    what: 'Ticks in the time direction are temperature. A periodic lattice of N<sub>t</sub> ticks is the equilibrium ensemble at T.',
    status: 'declared',
    links: [['source', 'Porting the gauge-Higgs system into the run', DER + 'work/HR/FOR_SIM.md'], ['source', 'The gauge-Higgs system, specification', DER + 'work/HR/SPEC.md']],
  },
  // Source: RL/work/HR/SPEC.md section 6 "Standard lattice parameters" (this action, beta_G = 4/g^2,
  // rho^2 = Phi_L^dag Phi_L); section 2 (reduction of the 5-trace with C = 1). Check V11.
  gaugehiggs: {
    tex: T`\begin{aligned}S=\ &\beta_G\sum_{P}\Big[1-\cos(3a_P)\,\tfrac12\operatorname{tr}V_P\Big]+\tfrac32\,\beta_G\sum_{P}\big[1-\cos(2a_P)\big]\\[2pt] &+\sum_{x}\Big[\rho_x^{2}+\lambda_L\big(\rho_x^{2}-1\big)^{2}\Big]-2\kappa_H\sum_{x,\mu}\operatorname{Re}\,\Phi_x^{\dagger}\,e^{3ia}\,V\,\Phi_{x+\mu}\end{aligned}`,
    name: 'The gauge-Higgs action',
    what: 'On the cubic family: weak links V, hypercharge angle a, doublet Φ with ρ² = Φ<sup>†</sup>Φ, β<sub>G</sub> = 4/g². λ<sub>L</sub> is a declared stabilizer.',
    status: 'declared',
    wide: true,
    links: [['source', 'The gauge-Higgs system, specification', DER + 'work/HR/SPEC.md'], ['report', 'The Higgs register', DER + 'reports/UH.md'], ['report', 'Links, action and bare couplings', DER + 'reports/GL.md']],
  },

};

// The steps of the navigation bar. title: the name of the step. lead: the one line under the heading. src: keys of SRC
// in links.js for the row of further sources.
export const GROUPS = {
  network: { title: 'Holographic screen', lead: 'Every observer is one carrier. All of them run the same seam law.', cards: ['counts', 'lawC', 'descent', 'depth'], src: ['run'] },
  defects: { title: 'Defects', lead: 'Map into this step: a repair current twists the two faces of its seam.', cards: ['twist', 'accept', 'neutral', 'reactions'], src: ['run', 'classes'] },
  lattice: { title: 'Lattice', lead: 'Map into this step: the seam cost around a face is the action, and ticks in the time direction are temperature.', cards: ['plaquette', 'weight', 'pclass', 'temperature', 'gaugehiggs'], src: ['gauge'] },
  field: { title: 'Field', lead: 'Map into this step: the routing tick of the candidate program CF-1 has the Dirac equation as its long-wave limit.', cards: ['tick', 'twoticks', 'dirac', 'dispersion'], src: ['continuum', 'fields'] },
  classes: { title: 'Particles', lead: 'Map into this step: the flux of a defect is a central element of the gauge group.', cards: ['rule', 'flux', 'group', 'spin', 'bl'], src: ['classes', 'spin', 'gauge'] },
};

// Which cards each page shows. A page names one group and may replace its card list, lead and sources. The page
// 'journey' shows every group in the order of the navigation bar.
export const PAGES = {
  universe: { group: 'network' },
  carrier: { group: 'network', cards: ['counts', 'lawC', 'descent', 'walk'] },
  observer: { group: 'network', cards: ['lawC', 'depth', 'tape', 'descent'] },
  defects: { group: 'defects' },
  lattice: { group: 'lattice' },
  readout: { group: 'field' },
  nowave: { group: 'field', cards: ['record', 'lawC', 'walk'], lead: 'What one repair attempt writes: the record law, the committed rule and its reversible version.', src: ['run'] },
  space: { group: 'field' },
  classes: { group: 'classes' },
  decoder: { group: 'classes' },
  journey: { groups: ['network', 'defects', 'lattice', 'field', 'classes'] },
};

// Cards that are written and checked as mathematics but not shown, with the reason. To show one, add its id to a page.
// duality: the two-path relation of visibility and distinguishability. The sources named in the brief NOWAVE (the
// three papers and the research notes on records) do not state it, and the page's own check did not exist when this
// file was written. It is a standard relation of quantum mechanics (check V15). Add 'duality' to PAGES.nowave.cards
// once nowave_check.mjs confirms it on the model's tick.
export const PENDING = {
  duality: {
    tex: T`V^{2}+D^{2}\ \le\ 1`,
    name: 'Visibility and distinguishability',
    what: 'V is the visibility of the fringes and D the distinguishability of the two openings in the record. Equality holds for a pure record.',
    standard: true,
    links: [['paper', 'Execution model: native repair and its record laws', EXEC]],
  },
};

// Blocks of one page: [{ key, title, lead, cards, src }]. One block for a step page, eight for the journey.
export function blocksOf(pageName) {
  const p = PAGES[pageName]; if (!p) return null;
  if (p.groups) return p.groups.map((g) => ({ key: g, ...GROUPS[g] }));
  const g = GROUPS[p.group];
  return [{ key: p.group, title: g.title, lead: p.lead || g.lead, cards: p.cards || g.cards, src: p.src || g.src }];
}
