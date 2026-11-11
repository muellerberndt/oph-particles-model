# Lepton mass readout on the coherent generation register

`lepton_readout.py` (about 20 s) writes `lepton_readout.json`. Run:
`PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python lepton_readout.py lepton_readout.json`

What it executes: a class-3 defect on a face carries three amplitudes over the three positions of the repair current
around the face (worker FR's register, one-tick compression (sqrt2/3) C(2/9)). The mass generator of the energy clock
is Y = (2/9) C^2 (worker CK). Its eigenvectors are the three characters of the face third-turn: tau (no winding),
muon and electron (the two winding senses).

Results (seed 20261111):
- A defect at a definite position is tau, muon or electron with probability 1/3 each.
- Before a readout the position probability circulates around the face: beat periods 30 to 32 ticks (tau against the
  light pair) and 506 ticks (muon against electron).
- Mass readout by phase estimation with a clock register of T levels, every outcome kept: T = 32 separates the tau
  (99.5 percent); T = 512 identifies all three (99.98 percent). Of 30,000 defects read with T = 4096: tau 33.31,
  electron 33.53, muon 33.17 percent; a second readout of the same defect returns the same lepton in 99.88 percent.
- Frequencies read per tick: 0.2096936 (tau), 0.0124684 (muon), 0.0000603 (electron); sum 2/9. Ratios 206.770316 and
  3477.4728. With the electron as the one unit anchor: muon 105.65941 MeV (+9.83 ppm), tau 1776.985 MeV (+0.61 sigma).

Declared in this demonstration: the generation register and its coupling, the analyzer, a fresh register per tick,
unit clock time per tick. In the register's own clock units the rates are of the lattice scale; the physical lepton
scale is not derived, so MeV values use one anchor. Comparison with measured masses is NOT BLIND.
