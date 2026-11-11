// Hover help for the Space page (space.js, space_forces.js, gauge_wave.js, cone_symbol.js). Entry format: see help.js.
// Rewritten containers (#sp-legend, #sp-numbers, #sp-scale, #gx-scat-num) are explained with after: true or on their label;
// table headers are rebuilt with their tables and get their badges back.
// the live description of the current choice, folded out of the page into this badge (design pass B)
const live = (id, label) => { const el = document.getElementById(id), t = el ? el.innerHTML.trim() : ''; return t ? `<b>${label}</b> ${t}<br><br>` : ''; };

export default [
  { sel: '#sp-left .car-head h2', text: '<b>Quanta on a cubic lattice of carriers.</b> Experiments 1 to 6 run the routing tick of the candidate CF-1 (cf1_engine.js) live in your browser: three axis shifts plus a rest rotation per tick, two alternating ticks per period. Experiment 7 replays supplied data of the field session. Rest angles are imported from one-carrier calculations or declared. Nothing here is read from the selected universe run.' },
  { sel: '.gx-jump', text: 'Jumps to the second section of this page, force carriers on the same cone, and starts its calculations.' },
  { sel: '#sp-gl', text: '<b>The lattice in 3D.</b> Each glowing dot is one cell, coloured by its quantum (key below) and brighter where that quantum is more likely found, scaled to its brightest cell. Side-by-side boxes hold one quantum each; in the strip layouts (experiments 2, 5 and 7) each strip is one quantum, summed across the box. In experiment 3 only the flux dots are drawn: yellow classes 1 and 5, light blue 2 and 4, pink 3. Grey-blue lines are box frames; the small wireframe icosahedra in one corner are carriers; a yellow tick in experiment 4 marks the flux line. Drag to turn, scroll to zoom.' },
  { sel: '#sp-plot', text: '<b>The measured quantity against ticks, one line per quantum in its colour.</b> Experiment 1: probability still within 5 cells of the start. 2 and 5: distance travelled in cells, with the dashed line at one cell per tick. 3: probability that the record is written. 4: probability across the line (horizontal axis in cells), the yellow dashed line at the flux line. 6: share of the packet in a moving window where a free quantum would be. 7 plots supplied data from R8_register_line.json, not a live run.' },
  { sel: '#sp-legend', after: true, text: 'Key of the colours: each quantum of the current experiment, with its rest angle or charge where it has one. In experiment 3 also the flux classes of the background dots.' },
  { sel: '#sp-side > .k', nth: 0, text: 'Seven experiments. Each rebuilds its lattice and packets from scratch when chosen or reset.' },
  { sel: '#sp-exp', text: () => live('sp-text', 'This experiment.') + '1: free spreading with and without rest angle. 2: four centre-charge candidates crossing a uniform flux background. 3: a random flux gas. 4: interference at a Z2 flux line. 5: a protected flux pair routed as a whole. 6: coherence of charges and rigid pairs in random Z3 flux. 7: the mass step with its register, from supplied data.' },
  { sel: '#sp-k', text: 'The flux class assigned to every carrier in experiment 2. With the candidate\'s centre charge q6 it fixes the angle α = k·q6 mod 6, folded to 0 to 3 sixths, which selects the imported rest angle. α = 0 gives zero rest angle.' },
  { sel: '#sp-d', text: 'Face separation of the flux pair on a carrier, 1 to 5. It picks the column of the imported one-carrier rest angle table (repair-law work DIRAC defect_phases).' },
  { sel: '#sp-dens', text: 'Share of carriers that hold a flux pair in experiment 3. Their classes are drawn with the rounded L10 class shares 0.241, 0.196, 0.127, 0.196, 0.241 for classes 1 to 5.' },
  { sel: '#sp-a', text: 'Lattice spacing a in experiment 5. The flux pair gets rest angle 2a, and the packet wave number is set near 1.5 a, so a smaller spacing tests the joint-scaling Dirac limit.' },
  { sel: '#sp-speed', text: 'Ticks computed per animation frame while running.' },
  { sel: '#sp-carriers', text: 'Shows or hides the small wireframe carriers drawn at one corner of the first box.' },
  { sel: '#sp-reset', text: 'Rebuilds the current experiment at tick 0.' },
  { sel: '#sp-step', text: 'One tick for every quantum. In experiment 7 it steps through the supplied ticks 0, 20, 40 and 60.' },
  { sel: '#sp-run', text: 'Runs until the experiment\'s natural end (28 to 190 ticks), or pauses.' },
  { sel: '#sp-side > .k', nth: 1, text: '<b>Live numbers of the current experiment.</b> First line: tick and lattice size in carriers. The table measures each quantum: mean distance and share near the start (1), measured speed against the tick\'s group velocity dE/dp (2, 5), sample mean angle against the angle inferred from record occupation (3), share in a strip at the line (4), share on the free path relative to the free control (6), or the supplied register results (7).' },
  { sel: '#sp-side > .k', nth: 2, text: 'Results of the same tick on large lattices, read from JSON files of the compute box (/rl/SIM/cf1/…), not computed here. Conformance suite, forward-and-back reversibility and spreading on 128³ and 256³ carriers, rest phases in a flux sample, coherence lengths in a link-flux gas, and scattering on one carrier with flux.' },
  { sel: '#sp-side > .k', nth: 3, text: 'What is declared and what is computed: the cubic arrangement, the spin pointer, the record reflection and the mass step are declared. Rest angles are numbers of one carrier at lattice scale, not masses in physical units.' },

  // ---- force carriers on the same cone (space_forces.js)
  { sel: '#gx-forces > h2', text: '<b>Classical gauge waves and the matter walk\'s cones.</b> Computed here: a port of worker GL\'s small-field link waves (gauge_wave.js) and the two-tick phase symbols of worker T3 (cone_symbol.js). Grey values beside them are the Python numbers read from /rl/GL/s3_waves.json and /rl/T3/cones.json. The field and the walk are not coupled.' },
  { sel: '.gx-claim .gx-tag', nth: 0, text: 'Tag colours of the statements. <em>Green</em>: an exact property of the finite walk symbol. <em>Amber</em>: holds for a declared classical link action or a declared seam weight. <em>Pink</em>: open.' },
  { sel: '#gx-beside', text: '<b>Two space-time pictures, 48 cells across, ticks 0 to 30 downward.</b> Left, amber: electric-field energy of a classical colour packet (gluon λ1, polarization y, amplitude 10⁻³, wave number 0.6). Right, teal: probability of the CF-1 walk without rest phase, started in the same cell. White dashed: one cell per tick from cell 12. Brightness is the square root of the value, scaled to its maximum.' },
  { sel: '#gx-beside-run', text: 'Replays both pictures from tick 0. The label beside it is the tick shown.' },
  { sel: '#gx-vel th', nth: 0, text: 'Which wave or quantum: four classical gauge packets (gluon λ1, W1, B, gluon λ8), the speed predicted by the field step\'s dispersion, and the CF-1 quantum.' },
  { sel: '#gx-vel th', nth: 1, text: 'Speed computed here in cells per tick, fitted to the centroid over ticks 5 to 24.' },
  { sel: '#gx-vel th', nth: 2, text: 'The same speed from GL\'s Python run, for comparison.' },
  { sel: '#gx-vel th', nth: 3, text: 'The Gauss-law residual after 24 ticks of the run here: a floating-point check of the classical evolution.' },
  { sel: '#gx-scat', text: '<b>Head-on classical packets, 96 cells across, ticks 0 to 50 downward.</b> Top row: gluon λ1 against gluon λ2, which do not commute. Bottom row: gluon λ1 against B, which commute. Left panels: amber, energy of the λ1 packet starting at cell 24; violet, the partner starting at cell 72; dashed lines at one cell per tick. Right panels, pink: the squared change of the λ1 field compared with a run without the partner, magnified four times.' },
  { sel: '#gx-eps', text: 'Amplitude ε of both packets. Changing it recomputes the crossing; the readout below reports the change divided by ε².' },
  { sel: '#gx-scat-run', text: 'Replays the crossing from tick 0.' },
  { sel: '#gx-scat-num', after: true, text: 'Outcome of the crossing at the end: relative change of the λ1 field, its delay in cells behind a free packet and its phase shift, change / ε², the same for the commuting control, and the Gauss-law residual.' },
  { sel: '#gx-gl th', nth: 0, text: 'Packet amplitude ε of GL\'s partner test.' },
  { sel: '#gx-gl th:not(:first-child)', all: true, text: 'Relative change of the main packet\'s field after 16 ticks side by side with this partner. First number: computed here; after the dot: GL\'s Python value. The first two pairs do not commute, the last two are commuting controls.' },
  { sel: '#gx-map-a', corner: true, text: '<b>Phase per period of the CF-1 routing tick</b> over p₁ (across) and p₂ (up), each −π to π, at the third wave number set below. Teal turning white: phase near zero, where a cone sits. Pink: phase near π. Dark blue between, with faint lines every π/8. White circles: cones of the full-zone count that lie in this slice. The dashed line p₂ = 0 is the cut drawn in the line plot.' },
  { sel: '#gx-map-b', corner: true, text: '<b>The same map for T3\'s member B</b> at φ = 5π/16, a lazy seam step with declared weights. It has one cone in the whole zone, at p = 0. No mass angle in either map.' },
  { sel: '#gx-k3', text: 'The third wave number p₃ of the slice, in steps of π/64. Drag for a quick low-resolution view; release for full resolution.' },
  { sel: '#gx-k3-0', text: 'Slice at p₃ = 0.' },
  { sel: '#gx-k3-h', text: 'Slice at p₃ = π/2.' },
  { sel: '#gx-k3-p', text: 'Slice at p₃ = π (shown as −π, the same point of the zone).' },
  { sel: '#gx-line', text: '<b>Phase per period along p₁</b> at p₂ = 0 and the chosen p₃, the dashed line of the maps. Teal: CF-1 routing tick. Amber: member B. Vertical axis 0 to π; the dashed lines mark phase π and p₁ = 0.' },
  { sel: '#gx-cones th', nth: 0, text: 'Quantities counted over the whole zone of wave numbers.' },
  { sel: '#gx-cones th', nth: 1, text: 'The CF-1 routing tick: computed here on a 32³ grid with refined minima, with T3\'s value in grey.' },
  { sel: '#gx-cones th', nth: 2, text: 'T3\'s member B at φ = 5π/16, computed the same way, with T3\'s value in grey.' },
];
