// Hover help for the Defects catalogue (defects.js). Entry format: see help.js.
// Two badges per card: the picture (its track in words, written by defects.js into data-track of the stage) and the title
// (the class). The numbers of all cards and the line under the picture are explained once, at the page title.
const track = (k) => () => {
  const el = document.querySelector(`#page-defects .df-card[data-k="${k}"] .df-stage`);
  return (el && el.dataset.track ? el.dataset.track + '<br><br>' : '') + PICTURE;
};
const PICTURE = 'Nodes: carriers of the patch, each a glow coloured by its load against the patch mean on that cut (orange above, blue below, brighter further away). Lines: glue seams between carriers. Cyan pulses: repairs on the way to the next cut, on every carrier whose summed load change between the two cuts exceeds the patch mean of that change. Glyph: the defect on its stored positions, eased between consecutive cuts, with a fading trail and its whole path dashed. Yellow ring and cross: birth. Red ring and cross: ending. Faint glyphs: other defects passing through the window. The line at the bottom left names the observer and the causal depth of the cut on screen. The thin bar runs through the shown cuts, then the animation starts again.';
const IDENT = 'Each defect class k equals the centre class 6Y mod 6 of Standard Model multiplets, exact on all 32 patterns of the five-level code (three colour levels, two weak levels). The defect is the flux of its class, a boson. The fermions are the quanta whose pattern carries the class. The class does not carry the generation or the mass.';
const NUMBERS = '<b>The three numbers of a card</b> count the class over the whole selected run, from its view/class_stats.json: defect identities of the class on the screen, the share of them that ever changed position, and how many ended by annihilation with a conjugate. Classes 1 and 5 keep moving. Classes 2, 4 and 3 almost never move once the screen has settled.';
const H3 = {
  1: '<b>Class 1: the left-handed quark class.</b> u<sub>L</sub> and d<sub>L</sub> in three colours, hypercharge +1/6. The generations u, c, t and d, s, b sit in the same class. Its conjugate is class 5.',
  5: '<b>Class 5: the conjugate of class 1.</b> The antiparticles of u<sub>L</sub> and d<sub>L</sub>, hypercharge −1/6.',
  4: '<b>Class 4: the right-handed quark class.</b> u<sub>R</sub> (+2/3) and d<sub>R</sub> (−1/3) in three colours. Both have 6Y = 4 mod 6, so the class does not tell up from down. Its conjugate is class 2.',
  2: '<b>Class 2: the conjugate of class 4.</b> The antiparticles of u<sub>R</sub> and d<sub>R</sub>.',
  3: '<b>Class 3: the lepton doublet and Higgs class.</b> e<sub>L</sub> and ν<sub>L</sub> (hypercharge −1/2) and their antiparticles. The class is its own conjugate. The Higgs doublet (+1/2, a boson) has the same class.',
  0: '<b>Class 0: no defect.</b> The right-handed leptons e<sub>R</sub>, ν<sub>R</sub> and the gauge fields: gluons, W, and B (the photon and the Z after mixing). A face of class 0 carries no flux, so it leaves no defect on the screen. A carrier that holds only fluxes, for example {2,2,2} or {4,4,4}, is not a baryon.',
};

export default [
  { sel: '.df-head h2', links: ['classes', 'run'], text: '<b>Every defect class, moving on the screen of the selected run.</b> Each card follows one defect identity through the stored cuts of the run, inside the patch of one of the 32 featured observers, beside the particle class it equals. Positions, loads and repairs are read from view/observer_defects.npz and observers/obs_<i>carrier</i>.npz, births and endings from the catalogue of the run. Per class the page picks, from all 32 patches, the identity with the largest product of consecutive cuts followed and distinct positions visited. Click a card for the full class card.<br><br><b>The map into this step</b> is the twist: a repair on a seam moves the current j between its two ports, and the register adds j mod 6 to the face on one side and subtracts it on the other. The register is declared and does not act back on the loads.<br><br>' + IDENT + '<br><br>' + NUMBERS },
  { sel: '.df-legend', text: PICTURE },
  ...[1, 5, 4, 2, 3, 0].map((k) => ({ sel: `.df-card[data-k="${k}"] canvas`, corner: true, links: ['run'], text: track(k) })),
  ...[1, 5, 4, 2, 3, 0].map((k) => ({ sel: `.df-card[data-k="${k}"] h3`, links: ['classes'], text: H3[k] + '<br><br>' + IDENT })),
];
