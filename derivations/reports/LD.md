## RESULT

**NOT DERIVED; bounded.** QED fixes the order, the diagram, the function and the sign of the correction, and one item stays open: the vacuum to which the register rate refers. No registered definition passes; the two closest leave +0.58 and +0.63 ppm in mu/e.

**1. What L5 is.** The stack adopts the pole reading as a premise and asks for a matching theorem (`MASS_RESPONSE_BRIDGE.md`; particle paper lines 4003, 4012). L5 is that matching at order (alpha/pi)^2.

**2. Family-blind effects for one defect.**
- The defect's own photon cloud is blind at every order only on the defect's own clock (EXACT in perturbative QED: one species has one scale).
- Read at one common scale, the same cloud gives the first-order logarithm: mu/e = 202.977, which is -18508 ppm (excluded).
- Pairs of the defect's own family and the static screening that defines the Thomson charge are blind.
- CK item 4 holds in the one-face register. In the continuum the defect's rest rate sits in the denominators of its own cloud, so the lane needs the own-clock rule. The stack names no mechanism for it.

**3. Effects that are not family-blind.**
- Pairs of lighter families, through the vacuum polarization of the photon line: the only family-dependent diagram at order (alpha/pi)^2 (EXACT).
- Pairs of heavier families, through a power-suppressed remainder. Hadrons on the muon: -0.163(25), which is -0.88 ppm (IMPORTED).
- Hadronic pairs lighter than the tau: about half of the tau's shift (IMPORTED).

**4. The function.** The exact two-loop mass function was read in Bekavac et al. 2007 (quoting Gray et al. 1990), the constants in Melnikov and van Ritbergen 2000, the decoupling in Chetyrkin, Kniehl, Steinhauser 1997. A one-loop dispersive identity derived here reproduces the closed form to 7e-12 for mass ratios from 2.9e-4 to 3477.

**5. Sign (EXACT) and decision (ARGUED).**
- If the charge common to the three characters is the one at zero momentum transfer, the coefficient is +2.00 and mu/e rises to +19.8 ppm.
- If it is the charge at the reader's own rest frequency, the coefficient lies between -1.00 and -1.71 and mu/e falls.
- The source's charge is the seam's edge-sector heat time and the Thomson value is its transported endpoint, so the read sees the own-frequency charge. The measured sign agrees (NOT BLIND).

**6. Registered table** (needed coefficient -1.8215(41); hadronic terms imported; comparison NOT BLIND).

| Row | Register rate is | Coefficient | mu/e residual | m_tau (MeV) | Q - 2/3 |
|---|---|---|---|---|---|
| R0 | pole in the real vacuum | 0 | +9.83 ppm | 1776.985 | 0 |
| R1 | own-scale MSbar mass, Thomson charge (look 2) | +1.84 | +19.77 | 1777.030 | +1.6e-6 |
| R2 | MSbar charge at own frequency (look 3) | -1.714 | +0.578 (26 sigma) | 1776.926 | -2.5e-6 |
| R3 | MSbar mass at e^(-2/3) M | -1.214 | +3.28 | 1776.945 | -1.7e-6 |
| R4 | lighter families at the reader's own rate, scheme-free | -1.7055 | +0.626 (28 sigma) | 1776.921 | -2.8e-6 |
| R5 | all families degenerate, fixed short-distance parameters | -56.9 | -297 | 1776.355 | excluded |
| R6 | massless pairs | +0.012 | +9.90 | 1776.990 | +2.6e-7 |
| R7 | physical charge at own frequency | -1.204 | +3.33 | 1776.945 | -1.7e-6 |
| R8 | common scale | first order | -18508 | 1727.4 | excluded |

- R4 at next order: +0.491 ppm, m_tau 1776.917.
- With leptonic terms only, R2 gives +1.455 ppm and 1776.956, which reproduces look 3.
- R4's restriction to lighter families is declared, and the fully degenerate version R5 is excluded.

**7. Tau forecast.** No row survives the pass criterion. The two closest own-frequency rows (R2, R4) give 1776.92 to 1776.93 MeV, and the Q-preserving fits through mu/e give 1776.916 to 1776.929. I put this reading at 1776.92 ± 0.01 MeV, against 1776.985 (register) and 1776.969 (phase). The weaker rows R3 and R7 give 1776.945. Half of the shift is the imported hadronic term; with leptons only the value is 1776.951 to 1776.956.

**8. Missing item.** The pair rates that the family-blind dressing contains. This fixes the constant B of the lighter families (registered values -1.006, -1.062, -1.562, -1.717) and whether the heavier-family remainder counts. Needed (NOT BLIND): B = -1.833(4) without the remainder, -1.669(26) with it.

**9. Other sizes.**
- Three loops: 0.09 to 0.18 ppm (computed -0.135 ppm for R4).
- Weak: at most 0.03 ppm in mu/e and 4 ppm in the tau.
- Standard-Model Yukawa running from the cell scale, common-scale reading only: -38.8 ppm in tau/e.

**10. Looks.** 35 for this worker: 9 rows, 3 variants, 5 fit values, 18 hand estimates. Registered passes: 0. One unregistered combination (mean of R2 and R4 with the hadronic remainder) lands at +0.003 ppm; it has no definition and zero weight.

## EVIDENCE

- Rebuild (about 20 s): `sh work/LD/run_all.sh`
- Registration: `work/LD/CANDIDATES.md`. Sections 0 to 5 were written at 09:12 before any script; 5b at 09:26 before the table script; outcomes are in 6 to 8.
- Statements and the kernel derivation: `work/LD/READING_RULE.md`
- Coefficients with source and status: `work/LD/LITERATURE.md`. Seven arXiv TeX sources were fetched. Gray et al. 1990 and Broadhurst et al. 1991 were reached only as INSPIRE records; the Gray function was read in Bekavac et al.
- Scripts and outputs in the same directory: `ld_lib.py`, `ld_checks.py` → `checks.json`, `ld_hadronic.py` → `hadronic_validation.json`, `ld_table.py` → `table.json`, `ld_posthoc.py` → `posthoc.json`.
- Hadronic model validation: muon anomaly term 714e-10 against 693e-10; hadronic shift of alpha at m_Z 0.02771 against 0.0276.

## WHAT THIS DOES NOT ESTABLISH

- Any value of the correction from the source. The own-clock rule, the seam charge and the reference vacuum are ARGUED or open.
- That QED with three leptons and the hadronic spectrum is the source's effective theory between the lepton scale and the cell.
- The first-order protection. It is needed and has no stack statement.
- The hadronic terms: the model is held from memory and carries fifteen percent. The quoted 2.5 percent is what the muon's remainder would need for a row at the precision of the measurement.
- The weak remainder beyond its order of magnitude; three-loop terms with finite mass ratios; the QCD correction to the quark reference spectra.
- The alpha used is alpha_P, conditional on the D10 chain; the CODATA value changes mu/e by 0.005 ppm.

## NEXT

1. **Reference vacuum.** Compute in the source which pair rates enter the dressing of a class-3 defect read on its own clock. Target (NOT BLIND): B = -1.833(4), or -1.669(26) if the heavier remainder counts.
2. **Own-clock rule.** State why the register rates are rates on each character's own clock; a common-scale reading is excluded at -1.85 percent.
3. **Hadronic remainder.** If it counts, replace the model by a data compilation of R(s); the kernel is in `ld_lib.py`.
4. **Tau.** Enter 1776.92 ± 0.01 MeV in the frozen comparison as the forecast of this reading, beside 1776.985 and 1776.969. A tau mass to 0.02 MeV separates the three.
