// Hover help for the zoom view of the Screen page (zoom.js). Entry format: see help.js.
// The view lives inside #page-universe, so these entries join the list of the page 'universe'.
// The picture badge reads the description of the selection that zoom.js writes into data-track of the picture;
// the class badge reads the class that zoom.js writes into data-k of the view.
const zoomOf = () => document.querySelector('#page-universe .zm.on');
const track = () => { const z = zoomOf(), v = z && z.querySelector('.zm-view'); return v && v.dataset.track ? v.dataset.track + '<br><br>' : ''; };
const PICTURE = 'Nodes: the carriers around the defect. Each glow is coloured by the summed load of its twelve ports on this slice against the mean of the whole screen: orange above, blue below, brighter further away. '
  + 'Lines: glue seams, one for every two carriers that share an edge of the screen mesh. '
  + 'Cyan pulses: repairs. A carrier pulses when the loads of its ports changed since the slice before by more than the mean change of the neighbourhood. The pulses repeat while the timeline rests. '
  + 'Marker with label: the selected defect on its face, in the colour of its class. It moves when the timeline moves, and the picture follows it. '
  + 'Solid trail: its positions on the earlier slices. Dashed path: its positions on the slices around this one that are in memory. '
  + 'Dashed white line: its partner, the other defect born in the same event. Dim markers: the other defects of the slice. Click one to select it. '
  + 'Yellow cross: where it was born. Red cross: where it ended. A ring marks a birth or an ending inside the step into this slice. Dashed ring: the face it will be born on, shown before its birth. '
  + 'Bar at the bottom: the part of its life that has passed. The line above it names the causal depth of the slice. One unit of length is the spacing of neighbouring carriers.'
  + '<br><br>Every mark is read from the files of the run: the slice files, the screen mesh and the catalogue. A run stores the screen on its slices only, so the path of a defect between two slices is not shown.';
const IDENT = 'Each defect class k equals the centre class 6Y mod 6 of Standard Model multiplets, exact on all 32 patterns of the five-level code. The defect is the flux of its class, a boson. The fermions are the quanta whose pattern carries the class. The class does not carry the generation or the mass.';
const CLASS = {
  1: '<b>Class 1: the left-handed quark class.</b> u<sub>L</sub> and d<sub>L</sub> in three colours, hypercharge +1/6. The generations u, c, t and d, s, b sit in the same class. Its conjugate is class 5.',
  5: '<b>Class 5: the conjugate of class 1.</b> The antiparticles of u<sub>L</sub> and d<sub>L</sub>, hypercharge −1/6.',
  4: '<b>Class 4: the right-handed quark class.</b> u<sub>R</sub> with hypercharge +2/3 and d<sub>R</sub> with −1/3, in three colours. Both have 6Y = 4 mod 6, so the class does not tell up from down. Its conjugate is class 2.',
  2: '<b>Class 2: the conjugate of class 4.</b> The antiparticles of u<sub>R</sub> and d<sub>R</sub>.',
  3: '<b>Class 3: the lepton doublet and Higgs class.</b> e<sub>L</sub> and ν<sub>L</sub> with hypercharge −1/2, and their antiparticles. The class is its own conjugate. The Higgs doublet, a boson with hypercharge +1/2, has the same class.',
};
const klass = () => { const z = zoomOf(), k = z ? z.dataset.k : ''; return (CLASS[k] ? CLASS[k] + '<br><br>' : '') + IDENT; };
const FACTS = 'Where the defect sits on this slice. A plaquette is the face of the screen around one vertex of its mesh, bounded by glue seams. Before its birth the line names the face it is born on, after its end the face it sat on last. '
  + 'Lived: the causal depth from its birth to its end, or to the end of the run while it is alive. Hops: how often it moved to a neighbouring face. Lifetime and hops are the catalogue values of the card below.';

export default [
  { sel: '.zm-view canvas', corner: true, all: true, links: ['run'], text: () => '<b>The neighbourhood of the selected defect on the slice shown.</b> ' + track() + PICTURE },
  { sel: '.zm-name', all: true, links: ['classes'], text: klass },
  { sel: '.zm-hops', all: true, text: FACTS },
];
