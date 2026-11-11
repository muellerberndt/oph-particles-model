// Hover help for the Story page (story.js, story_rule.js, story_lepton.js). Entry format: see help.js.
// Containers whose content is rewritten by the page (#st-born-side, #st-mass-num, #st-rec-num, #lk-num) are explained
// on their static label or with after: true, so the badge survives the rewrite.
export default [
  { sel: '.st-wrap > h2', text: '<b>Five steps, each executed in your browser.</b> Step 1 runs the committed integer rule of the universe runs, with its declared Z6 register, on one twelve-port carrier. Steps 2 and 3 run the routing tick of the candidate CF-1 on a line of cells. Step 4 is a table of what fixes each mass, step 5 a calculator for one charged-lepton ratio candidate. Nothing on this page is read from the selected run.' },

  // ---- 1. born
  { sel: '.st-ch h2', nth: 0, text: 'One carrier of the universe runs, run here with the same rule (story_rule.js): a fair-coin seam repair of integer loads, and a Z6 twist of the two faces next to the seam when the cost table allows it. Cost table [0, 5, 8, 10, 8, 5], κ = 5, the values of the runs. The register never acts back on the loads.' },
  { sel: '#st-born-svg', text: '<b>The carrier, live.</b> Twelve ports (cyan circles; the number is the integer load, the circle grows with it), thirty seams (grey lines) and twenty faces. A coloured face holds a register defect: <em>class 1</em> orange disc, <em>class 5</em> orange ring, <em>class 4</em> amber disc, <em>class 2</em> amber ring, <em>class 3</em> green disc with a blue rim. Each class is the centre class 6Y mod 6 of Standard Model multiplets: 1 and 5 left-handed quarks and antiquarks, 4 and 2 right-handed ones, 3 the lepton doublet and the Higgs. The highlighted seam and faces show the last event, coloured as in the event list. Drag to turn; faces behind are drawn faint.' },
  { sel: '#st-born-new', text: 'Starts a fresh carrier: twelve random loads from 0 to 5 and a blank register (every face class 0). Also happens on its own after 25 quiet sweeps while running.' },
  { sel: '#st-born-step', text: 'One sweep: thirty seam attempts at randomly chosen seams, each with a fair tie coin.' },
  { sel: '#st-born-run', text: 'Runs one sweep about every 0.4 seconds, or pauses.' },
  { sel: '#st-born-kick', text: 'Moves up to three units of load from one random port to another: a small local quench, so repair currents and twists start again.' },
  { sel: '.st-ch .k', nth: 0, text: '<b>Counts and event list of this carrier.</b> The six tiles count accepted twists by what they did to the two faces: a pair born on two blank faces, a pair annihilated to blank, a defect moved to the next face, two fused into one, one split into two, or two exchanging charge. Below: sweep number, defect faces now on the carrier, and whether all loads are within one unit (settled). The list shows recent events as face classes before → after; most moves are thinned out of it.' },
  { sel: '.st-ch .note', nth: 0, text: 'The pair-birth totals here are read from run_evidence.json, the audited counts of the L10 screen run, not from this carrier. The carrier above is an isolated drawing and does not reproduce those proportions.' },

  // ---- 2. rest angle
  { sel: '.st-ch h2', nth: 1, text: 'Two copies of the CF-1 routing tick (cf1_engine.js) on a line of 320 cells, computed here. The only difference is the rest rotation per tick. The rest angle is a chosen parameter, not a derived mass.' },
  { sel: '#st-mass-b', corner: true, text: '<b>Two space-time pictures.</b> Across: cell along the line. Down: tick, 0 to 150. Brightness: the square root of the probability per cell, scaled to the brightest cell of that tick. Left (teal): zero rest angle. Right (yellow): the selected rest angle. The white dashed lines run at one cell per tick from the start.' },
  { sel: '#st-mass-theta', text: 'The rest angle θ per tick of the right-hand walk, in radians. Changing it restarts both walks.' },
  { sel: '#st-mass-run', text: 'Advances both walks two ticks per frame up to 150 ticks, or pauses.' },
  { sel: '#st-mass-reset', text: 'Puts both packets back at the centre at tick 0.' },
  { sel: '#st-dial', text: 'The clock hand of the right-hand walk: the phase of its first component summed over all cells (its zero-momentum amplitude), relative to tick 0. Compare it with rest angle × ticks in the table.' },
  { sel: '.st-ch .k', nth: 1, text: '<b>Numbers of the right-hand walk.</b> Rest angle per tick; sin²θ, the probability that one rest rotation flips the record from a definite basis state; the same for zero angle (0); the tick; the measured phase of the dial; and θ × ticks modulo 2π for comparison. All computed live.' },

  // ---- 3. recorded
  { sel: '.st-ch h2', nth: 2, text: 'A CF-1 walk on a ring of 256 cells with rest angle 0.1, started as a packet on one branch with wave number 2π·12/256. Two declared detectors act on it here: a position record and a translation-phase (momentum) record.' },
  { sel: '#st-rec-x', text: '<b>Position distribution now.</b> One bar per cell, height the probability to find the quantum there, scaled to the tallest bar. A position record keeps only the recorded group of cells, so the bars outside it drop to zero.' },
  { sel: '#st-rec-p', text: '<b>Momentum distribution now.</b> The discrete Fourier transform of the four components, one bar per wave number from −π to π per cell; the grey line marks zero. A momentum record multiplies it by the detector\'s finite-clock window.' },
  { sel: '#st-rec-t', text: '<b>Track.</b> Each yellow dot is one position record: horizontal the centre of the recorded cell group, vertical the tick (down). The fitted slope of these dots is the "speed from the recorded track" in the table.' },
  { sel: '#st-rec-run', text: 'Runs the walk tick by tick up to tick 190, or pauses. With track on, it also records position automatically.' },
  { sel: '#st-rec-reset', text: 'Prepares the same packet again at cell 40 and clears all records.' },
  { sel: '#st-rec-pos', text: 'Records position once now: samples a group of detector-width cells with its Born probability, then removes the state outside that group and renormalizes.' },
  { sel: '#st-rec-mom', text: 'Records the translation phase once now with the finite clock: samples one of its outcomes and applies the declared real-amplitude update. The log shows the phase per cell and its probability.' },
  { sel: '#st-rec-track', text: 'Track mode: an automatic position record every detector-width ticks while the walk runs.' },
  { sel: '#st-rec-det', text: 'Width of the position detector in cells. It sets both the resolution of a record and, in track mode, the number of ticks between records.' },
  { sel: '#st-rec-clock', text: 'Number of clock states of the momentum detector. More states resolve the translation phase finer; 256 resolves every discrete wave number of this ring.' },
  { sel: '.st-ch .k', nth: 2, text: '<b>Records.</b> Tick; the slope fitted to the recorded track (needs three records); the group velocity the tick predicts for the starting wave number, cos θ sin p / sin E with cos E = cos θ cos p; and the rest angle. Below: the latest records, newest first.' },

  // ---- 4. mass table
  { sel: '.st-wrap > div:not(.st-ch) > h2', text: 'A fixed table written in story.js, not computed. It lists, particle by particle, which declared mechanism would fix the mass and what still has to be supplied. The class column uses the exact centre classes; the class does not carry generation or mass.' },
  { sel: '#st-mass-table th', nth: 0, text: 'The Standard Model particle or group used as a comparison target.' },
  { sel: '#st-mass-table th', nth: 1, text: 'Its centre class 6Y mod 6: 1 and 4 for quarks (left- and right-handed), 3 for the lepton doublet and the Higgs, 0 for right-handed charged leptons and the gauge fields. The register defect of that class is the flux; the particle is a quantum carrying it.' },
  { sel: '#st-mass-table th', nth: 2, text: 'The declared construction that would give the mass: a gauge mode, a chosen scalar background, a Yukawa operator Y or a one-tick reading.' },
  { sel: '#st-mass-table th', nth: 3, text: 'What that construction fixes exactly and which inputs remain open. Every row is marked open.' },
  { sel: '#st-mass-table th', nth: 4, text: 'Measured masses used as comparison targets, imported from the particle reference. The page derives no GeV scale.' },

  // ---- 5. lepton ratio candidate
  { sel: '#lk-lepton h2', text: 'A calculator for one declared reading: three amplitudes of a neutral circulant, squared, compared with the charged-lepton mass ratios. The amplitudes and ratios are computed here from the formula; the claims are summaries of the cited evidence files.' },
  { sel: '.lk-formula', text: 'The amplitude of character k at phase δ. The constant 1 is the agreement branch, √2 cos(δ + 2πk/3) the disagreement branch. Its square w<sub>k</sub> is the candidate weight.' },
  { sel: '.lk-claim .lk-tag', nth: 0, text: 'Tag colours of the claims. <em>Green</em>: an exact statement of a finite calculation. <em>Amber</em>: conditional on an additional declared construction, or a comparison. <em>Pink</em>: a limit or a negative result of the construction.' },
  { sel: '#lk-d', text: 'Sets the phase δ from 0 to π/6. Every picture and number on the right follows it.' },
  { sel: '#lk-29', text: 'Sets δ = 2/9, the value of the probability p + q − 2pq for flags p = 1/12 and q = 1/6, read as an angle.' },
  { sel: '#lk-fit', text: 'Finds by bisection the δ below π/12 at which the muon/electron ratio equals the reference value. A fitted δ is a calibration, not a prediction.' },
  { sel: '#lk-node', text: 'Sets δ = π/12, where the smallest amplitude is exactly zero and the ratios diverge.' },
  { sel: '#lk-zero', text: 'Sets δ = 0.' },
  { sel: '#lk-amp', text: '<b>The three amplitudes.</b> One row per character, sorted with the largest on top and labelled by the target it is compared with (e, μ, τ) and its index k. Teal bar: the agreement part, 1. Amber arrow: the disagreement part when it adds; pink when it subtracts. White dot: the sum √w. At the right: the amplitude and w ∝ its square.' },
  { sel: '.lk-lg', text: 'Key of the amplitude picture above.' },
  { sel: '#lk-ratio', text: '<b>Ratios against δ.</b> Horizontal: δ from 0 to π/6. Vertical: ratio on a log scale, 1 to 10⁵. Solid amber and violet curves: the candidate weight ratios w/w<sub>e</sub> for μ and τ. Dashed lines: the measured mass ratios. The white vertical line is the current δ; the grey dotted line is the node π/12.' },
  { sel: '#lk-num', after: true, text: 'The two candidate ratios at the current δ beside the measured ones, with the relative deviation (ppm when small). Koide Q = Σw / (Σ√w)², which stays 2/3 up to the node. Reference masses: electron, muon and tau values frozen in lepton_reading.js from the particle reference.' },
];
