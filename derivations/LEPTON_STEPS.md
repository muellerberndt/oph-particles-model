# Charged-lepton rest masses: state, comparison, remaining steps (2026-11-11 09:00)

Rules for workers: `CAMPAIGN.md`. Lane history: the rows "e, mu, tau" of `SPECTRUM.md`; reports FR to FR5, CK, CK2,
DR to DR3, LS, LS2, TR, YC, UD, UH, SC, LW, BF in `reports/`; executed readout in `work/LEPTON_READOUT/`.

## 1. What the source gives

- **Three states.** A class-3 defect on a face carries the face third-turn. Its three characters are the three
  charged leptons: tau the trivial character, electron and muon the two windings (`work/LEPTON_READOUT/README.md`).
- **Shape.** FR's register of two objects compresses to M = (sqrt2/3) C(theta) with
  C(theta) = sqrt(1/6) I + sqrt(1/12) (e^{i theta} R + e^{-i theta} R^-1), tr C^2 = 1 (EXACT given the register).
  The weights 1/6, 1/12, 1/12 are the branch weights of the coherent seam event (SOURCE).
- **Rates.** The read effect is Y = M^dag M = (2/9) C^2. Its eigenvalues are the rest rates per unit clock time:
  y_k = (1/27) (1 + sqrt2 cos(theta + 2 pi k/3))^2, with sum 2/9. Mass ratios are ratios of the y_k.
- **Phase.** theta = P(R+ xor H) = 2/9, the count of exclusive reads per unit clock time on two independent
  symmetric double loads. CK2: in the weak round with the inverse tick every round reads the tick-1 weights and
  the limit is exactly 2/9 (EXACT in FR's twelve-address hexagon model).

| Character | Lepton | y_k at theta = 2/9 |
| --- | --- | --- |
| trivial | tau | 0.2096935560 |
| winding | muon | 0.0124683656 |
| winding | electron | 0.0000603006 |

## 2. Comparison with measurement (NOT BLIND)

Measured: m_e = 0.51099895069 MeV, m_mu = 105.6583755(23) MeV, m_tau = 1776.93(9) MeV, m_mu/m_e = 206.7682827(46).

| Quantity | Register at theta = 2/9 | Measured | Deviation |
| --- | --- | --- | --- |
| mu/e | 206.770316 | 206.7682827(46) | +9.83 ppm (442 times the measurement uncertainty) |
| tau/e | 3477.4728 | 3477.365(176) | +31 ppm, +0.61 sigma |
| tau/mu | 16.818047 | 16.817692(852) | +21 ppm, +0.42 sigma |
| Koide Q | 2/3 | 0.6666645(51) | -0.43 sigma |
| m_mu, electron mass as the anchor | 105.659414 MeV | 105.6583755(23) MeV | +1.04 keV |
| m_tau, electron mass as the anchor | 1776.985 MeV | 1776.93(9) MeV | +0.055 MeV |

- The phase that reproduces mu/e at Q = 2/3 is 2/9 - 1.7515e-7 (-0.79 ppm). It gives m_tau = 1776.969 MeV
  (+0.43 sigma).
- Sensitivities: d ln(mu/e)/d theta = 56.14, d ln(tau/e)/d theta = 51.23.

## 3. What a mass in MeV needs

m_k = F E_cell y_k, with E_cell = 0.78303 E* = 9.5599e18 GeV (derived, DC). F is one number:

- measured value (NOT BLIND): F = 8.8640e-19;
- electroweak dictionary: F = (9/2) (y_J/sqrt2) (v/E_cell), where the sum of the three masses is
  y_J v/sqrt2 = 1.883099 GeV. With v = 246.21965 GeV from G_F: y_J = 0.010816 and v/E_cell = 2.5755e-17;
- as a clock unit: one unit of rate is 8.4739 GeV.

With the electron mass as the only measured input the register gives the muon and tau masses of section 2. With no
measured input it needs F, which is steps L6 to L8.

## 4. Steps and workers

| Step | Missing item | State on file | Worker |
| --- | --- | --- | --- |
| L1 | Standing pair: one pair of independent symmetric double loads, present with weight one whenever the defect is there | FR5: no source operation enters the double-load sector; the sector is invariant and its occupation is set by the preparation | LP |
| L2 | Round operations: return test for two-load objects, reset of the address consensus, the kick exp(-i h J x Q) as a source interaction | CK2: inverse tick is in the public program; the return test only for one load; the kick is declared apparatus | LK |
| L3 | Clock unit: premise (T), unit clock time per tick | CK: the stack has no statement | LT |
| L4 | One carrier: the pair and the clocked register on the sixty-address carrier | FR5: one address register gives 1/20 or 1/8; 2/9 needs independent address registers | LC |
| L5 | Residual +9.83 ppm in mu/e | LD (`reports/LD.md`): bounded. The only family-dependent diagram at order (alpha/pi)^2 is the vacuum polarization of the photon line by pairs of the lighter families (EXACT); with the charge read at the lepton's own rest frequency the sign is the measured one. The two closest registered readings leave +0.58 and +0.63 ppm (rows R2, R4; hadronic term imported) and give m_tau = 1776.92(1) MeV. A common-scale reading is excluded (-1.85 percent). Missing: the pair rates contained in the family-blind dressing, that is the constant B of the lighter families (needed -1.833(4), NOT BLIND; registered values -1.006 to -1.717), and the rule that each rate is read on its own clock | LD done; next round on the reference vacuum |
| L6 | Lepton scale y_J = 0.010816 (NOT BLIND) | YC: g/2 on every leg gives m_tau 46 to 57 GeV; TR: the lepton vertex needs exactly one cost-raising read; LS2: det Y_e = sqrt2 6^-14 fits to 0.27 percent and the same construction fails on the quarks | LY |
| L7 | Gauge coupling | corrected (`COUPLING_FIX.md`): the cell value 16.2453 is retired; the paper's closure read at the electroweak anchor gives 1/alpha_U = 24.3166 at M_U. Open: the anchor (CA), the M_U form (CU), the hypercharge slope and doublet count (CH), the dictionary on the collar (CC) | CC, CA, CU, CH |
| L8 | v from the cell scale | with the corrected coupling the transmutation law gives v = 246.60 GeV (245.9 GeV with the source's slopes for two doublets; 91 and 633 GeV for one and three). Open: the derivation of the law and the doublet count | LV |
| L9 | Assembly: masses in MeV with uncertainties, frozen comparison (`work/FZ/harness.py`) | waits for L1 to L8 | coordinator |

## 5. Leads from the coordinator (ARGUED, to be tested; none is a result)

- **A. Two class-3 objects.** The lepton mass vertex is 3 + 3 -> 0: a lepton doublet and a Higgs object. They are
  two class-3 objects with separate carriers and address registers until they meet. Candidate reading of FR's C and
  E objects: the two objects of the vertex. The standing object is then the Higgs condensate (UH's register in a
  state with nonzero amplitude at every cell), which serves every round as CK2 requires.
- **B. Weight one.** If the pair is present with weight w, the count is 2w/9 and the phase moves. The pair has to be
  part of the defect or of the vacuum around it.
- **C. Kick strength is the scale.** In the round, the kick strength per cell tick is F. With F of order 1e-18 the
  number of rounds per unit clock time is of order 1e18, and the finite-round terms (35/(2187 N^2) in the phase,
  7/(81 N) in the amplitude) vanish.
- **D. Fourteen.** TR's cheapest routes for the (3,3) annihilation take 6, 10, 14, 18 reads at separations 2 to 5.
  LS2's basepoint has fourteen primitive sectors of trace weight 1/6. Noted after seeing both numbers.
- **E. Residual and electromagnetic vacuum polarization.** A family-blind environment leaves the ratios exact
  (CK theorem, item 4). The first electromagnetic effect that tells the families apart is the vacuum polarization
  of the photon link by pairs of the lighter families, of order (alpha/pi)^2 = 5.4e-6. The residual in mu/e is
  1.8 (alpha/pi)^2.
- **F. Cell coupling.** 16.2453 x 3/2 = 24.368; the declared chain needs 24.3166 and BF requires 24.45. The closure
  ties its heat time to the coupling by the declared dictionary t = 4 pi^2 alpha. BF: at t = 2.43 the closure's
  edge distribution holds 99.88 percent in the lowest menu, while the Hamiltonian link vacuum of the action at the
  same coupling sits at mean Casimir 10 to 12. The two objects are different distributions.

## 6. Looks by the coordinator (unregistered, NOT BLIND, no weight; count them)

1. Rounds per unit clock time from theta_N: N = 302.28(34). Excluded by CK through Q.
2. Circulant read as MSbar masses at each lepton's own scale, coupling run to that scale: mu/e moves to +20.65 ppm.
3. Thomson-limit coupling with the constant two-loop term of one lighter lepton loop,
   -(71/96 + pi^2/12) (alpha/pi)^2 plus the finite-mass term (formula from memory): mu/e moves to +1.47 ppm,
   m_tau to 1776.956 MeV (+0.29 sigma).
4. v = E_cell exp(-(3 pi/4) x 16.2453) = 227.5 GeV (-7.6 percent).
5. The count of fourteen in lead D.
