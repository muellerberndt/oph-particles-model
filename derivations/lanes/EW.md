# Lane EW: the electroweak transition for the chain's couplings


## RESULT

**1. The declared chain gives a conditional crossover at T_c = 161.13 GeV.**

The linearized statistical standard deviation lies in **[0.11810, 0.13680] GeV**
when separately simulated run sets are independent. Allowing all cross-set
covariances gives **[0, 0.27631] GeV**. These are sharp covariance-compatible
ranges conditional on the retained marginal errors and the fixed weighted
fit. The paired reference-peak jackknife replicas are not retained, so a unique
standard deviation is unidentified. The one-percent reduction allowance
**1.61130 GeV** and finite-design sensitivity **0.34896 GeV** have separate
scopes. None is a confidence interval or a proved total continuum error.

The [canonical proof](https://github.com/FloatingPragma/observer-patch-holography/blob/main/model/electroweak_crossover/PROOF.md)
and [covariance receipt](https://github.com/FloatingPragma/observer-patch-holography/blob/main/model/electroweak_crossover/comparison_budget.json)
bind the calculation and its inputs.

- Inputs DECLARED: v = 246.60 GeV, 1/alpha_2(m_Z) = 29.605, sin^2 theta_W = 0.23074, alpha_s = 0.11834, tree masses
  80.330 and 91.588 GeV, declared midpoint m_H = 125.84 and m_t = 171.99 GeV. Label on every output: declared chain
  with two-doublet-equivalent slopes; the derivation of the chain is open.
- Map IMPORTED (Kajantie, Laine, Rummukainen, Shaposhnikov, hep-ph/9508379, relative order g^4): x = 0.2961,
  g3^2/T = 0.39083, y = 0 at 163.98 GeV. The first-order line ends at x_c = 0.0983(15)
  (IMPORTED). The chain sits at three times that value.
- MEASURED: maximum of the susceptibility of the volume average of phi^dag phi along the chain's curve (x(T), y(T)),
  53 runs at x = 0.296:

| beta_G | N | size (1/g3^2) | runs | y at maximum | chi_3 maximum | T at maximum (GeV) | chi maximum |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 6 | 12 | 8 | 7 | -0.10293(41) | 3.578(24) | 159.945(17) | 9.131(61) |
| 6 | 18 | 12 | 7 | -0.09700(89) | 3.841(32) | 160.168(33) | 9.805(83) |
| 8 | 16 | 8 | 7 | -0.09726(68) | 3.407(23) | 160.161(24) | 8.700(58) |
| 8 | 24 | 12 | 16 | -0.0908(11) | 3.736(52) | 160.406(43) | 9.54(13) |
| 8 | 32 | 16 | 5 | -0.0900(27) | 3.833(82) | 160.44(10) | 9.79(21) |
| 12 | 24 | 8 | 6 | -0.0906(11) | 3.320(41) | 160.414(44) | 8.48(10) |

- Linear cutoff/size extrapolation (MEASURED): fit T_max = T_c + C/beta_G + D(size): T_c = 161.12(12) GeV, C = -5.50(45) GeV,
  chi^2 = 0.31 for 2 degrees of freedom; size 12/g3^2 against 16/g3^2: -0.04(10) GeV; size 8/g3^2 against 16/g3^2: -0.27(10) GeV. The slope of the published Standard Model
  simulation is -5.1 GeV (IMPORTED, from 158.73 GeV at beta_G = 6 and 159.58 GeV in the continuum).
- Shape (MEASURED, 24^3, beta_G = 8): chi = V T <(delta phi^dag phi)^2> peaks at 9.54(13);
  it exceeds 80 percent of its maximum over 1.9 GeV, falls to half its maximum
  1.42 GeV above the peak, and stays near 5, about half the maximum, below the peak down to 148 GeV.
- Covariance budget: the central result uses y_c = y(T_lat) + fitted_y_intercept - reference_y_peak.
  The reference temperature and y peaks share jackknife blocks. Their covariance is unidentified by the
  retained marginal errors. The 0.13 GeV independent-error calculation is a labelled control, not the
  primary statistical uncertainty. A separate equal-size cutoff fit gives 160.85458 +- 0.07203 GeV
  under independence of the run sets; the six specified fit designs span 0.34896 GeV. This spread
  does not bound omitted cutoff powers or infinite volume. The reduction allowance is one percent;
  the hypercharge gauge field is not simulated, with an imported +0.3 GeV estimate not applied.
- Variants of the map at fixed lattice result (GeV): alpha_s run to m_W 161.35; product form of
  the one-loop factors at mu = pi T 161.82; hypercharge dropped from the map
  162.86; tree-level reduction 139.2.
- Sensitivity of T_c (GeV): +0.94 per GeV of m_H, -0.38 per GeV of m_t,
  +1.08 per percent of v, -0.22 per percent of g^2, +0.09 per 0.001 of
  alpha_s. The chain's Higgs mass, top mass and v account for most of its distance from the Standard Model value.
- NOT BLIND: Standard Model lattice result 159.5 +- 1.5 GeV (D'Onofrio, Rummukainen 2016, abstract). Difference
  +1.63 GeV. A combined significance is unidentified: the covariance is unretained and the
  reduction allowance has no calibrated probabilistic coverage.

**2. The pipeline checks selected published Standard Model observables.** MEASURED against IMPORTED, NOT BLIND.

- Standard Model inputs through the same code: maximum at 159.042(42) GeV on 24^3 at
  beta_G = 8. Published: 158.73 GeV at beta_G = 6, 159.01 GeV at beta_G = 9; 158.94 GeV interpolated to 8.
- Susceptibility at eleven temperatures from 156 to 161 GeV against the published points at beta_G = 9: ratios
  between 0.96 and 1.09.
- Continuum value of the pipeline for Standard Model inputs: 159.76 GeV. Published: 159.58(6) GeV.
- Map on Standard Model inputs: x = 0.2913, y = -0.0644, g3^2/T = 0.39246 at 160 GeV, y = 0 at
  162.54 GeV. Published curves: 0.2899, -0.0536, 0.39282, 162.1 GeV. The paper does not list its inputs; with
  m_t = 174.3 GeV this code gives -0.0546 and 162.14 GeV.
- Condensate in the broken phase at the point m_H* = 80, T* = 145 GeV of hep-lat/9510020, five lattice spacings:
  continuum value 0.7072(22). Published: 0.7061(7).
- Critical coupling at x = 0.0644, beta_G = 8 (MEASURED against IMPORTED): susceptibility maximum at beta_H = 0.347996 on 16^3 and 0.347982 on 24^3. Published infinite-volume value: 0.3479735(6).

**3. Phase structure at beta_G = 8.** MEASURED.

- First-order point x = 0.036:

| N | y at maximum | chi_3 maximum | histogram valley / peak |
| --- | --- | --- | --- |
| 8 | 0.01178(22) | 62.09(49) | 0.328 |
| 12 | 0.02283(18) | 149.3(15) | 0.0743 |
| 16 | 0.02406(40) | 341.9(80) | 0.00596 |

  Hysteresis, 300 sweeps per step of 0.004 in y: 16^3: down at y = 0.012, up at y = 0.032; 24^3: down at y = -0.004, up at y = 0.032. The volume average of R^2 jumps from 3.2 to about 10
  on the way down and from about 7 to 3.1 on the way up.
- Crossover point x = 0.13: chi_3 maximum 13.23(15) on 16^3, 20.17(33) on 24^3, 29.0(13) on 32^3.
- Growth exponent d ln chi_max / d ln N. First-order scaling is 3, the Ising value at the endpoint is 1.96, a crossover
  tends to 0:

| x | volumes | exponent |
| --- | --- | --- |
| 0.0360 | 12, 16 | 2.881(88) |
| 0.0644 | 16, 24 | 2.819(50) |
| 0.0897 | 16, 24 | 2.028(49) |
| 0.1150 | 16, 24 | 1.367(96) |
| 0.1300 | 16, 24 | 1.040(49) |
| 0.1300 | 24, 32 | 1.26(16) |
| 0.2960 | 16, 24 | 0.227(38) |
| 0.2960 | 24, 32 | 0.089(89) |

- Bracket of the end of the first-order signal at this lattice spacing, from exponents two errors above and below
  1.96: x between 0.064 and 0.115. IMPORTED: x_c = 0.0983(15) in the continuum, 0.1133(25) at
  beta_G = 5 (hep-lat/9805013).

**4. The source as built with one doublet.** Inputs of the row: v = 222.9 GeV, alpha_s = 0.1123, sin^2 = 0.2056,
1/alpha_em = 142.25, hence g^2 = 0.42967 and g'^2 = 0.11120 at m_Z, m_W = 73.05 and
m_Z = 81.96 GeV. Its Higgs and top masses are not derived. DECLARED assumptions:

- Assumption A, the quartic and top couplings of the declared row (m_H = 113.75, m_t = 155.46 GeV):
  x = 0.2930, T_c = 145.11 GeV, crossover. Conditional linear statistical SD [0.10755, 0.12407] GeV; separate one-percent reduction allowance 1.45114 GeV. MEASURED by
  reweighting the runs at x = 0.296.
- Assumption B, the masses of the declared row (m_H = 125.84, m_t = 171.99 GeV): x = 0.3600, T_c = 149.33 GeV, crossover. Conditional linear statistical SD 0.10421 GeV under independence of run sets; separate one-percent reduction allowance 1.49334 GeV. MEASURED on 24^3 at beta_G = 8 and x = 0.36, with the continuum shift of the main point.

**5. Higgs mass of the endpoint.** With the other inputs of the declared chain fixed, the map reaches x_c = 0.0983(15)
on the transition line at m_H = 72.5 +- 0.7 GeV (error of x_c; the
reduction adds about 1 GeV). Below this mass the chain gives a first-order transition. Standard Model inputs through
the same procedure: 72.3 GeV; published 72(2) GeV. IMPORTED endpoint with the map of item 1.

Scan of the Higgs mass with the other inputs of the declared chain fixed. Position of the susceptibility maximum at
beta_G = 8 from the measured y_max(x), interpolated linearly in x between the simulated values
0.036, 0.0644, 0.0897, 0.115, 0.13, 0.296, 0.36:

| m_H (GeV) | x at the transition | T (GeV) | kind |
| --- | --- | --- | --- |
| 50.00 | 0.0613 | 87.1 | first-order |
| 60.00 | 0.0746 | 96.6 | first-order |
| 70.00 | 0.0929 | 106.4 | first-order |
| 80.00 | 0.1164 | 116.4 | crossover |
| 90.00 | 0.1454 | 126.5 | crossover |
| 100.00 | 0.1800 | 136.4 | crossover |
| 110.00 | 0.2203 | 146.0 | crossover |
| 120.00 | 0.2665 | 155.2 | crossover |
| 125.84 | 0.2963 | 160.4 | crossover |
| 130.00 | 0.3188 | 164.1 | crossover |
| 140.00 | 0.3772 | 172.8 | crossover |
| 150.00 | 0.4420 | 181.5 | crossover |

**6. Cosmic-time comparison.** An imported radiation-era relation with g* = 106.75 (DECLARED)
gives t = 9.023e-12 s at T_c. With the additional assumed calibration hbar/E_cell = 6.8851e-44 s
per tick, this is 1.310e+32 ticks. One-doublet row A gives 1.112e-11 s. Neither map identifies
these quantities with attempted events in the native observer; no native cooling history is derived.

**7. Four-dimensional gauge-Higgs comparison scans at declared cell-scale coefficients:**

1. System: SU(2) links and a doublet on 8^3 x N_t at beta_G = 5.171, temperature E_cell/N_t, with a declared quartic
   stabilizer lambda_L. This parameter set is distinct from the electroweak coupling chain. The scans provide
   finite-regulator comparisons and do not transfer their scale to that chain.
2. Thermal restoration: the Higgs line moves to larger hopping as N_t falls. At lambda_L = 0.002: kappa_H = 0.13191
   (N_t = 8), 0.13208 (4), 0.13253 (2). At 0.02: 0.14560, 0.14572, 0.14695. A point between the lines is in the Higgs
   regime in the vacuum and symmetric at T = E_cell/2.
3. Hysteresis against the quartic on 8^4: the two sweep directions differ by 0.00055 in kappa_H at lambda_L = 0.0002,
   by 0.00011 at 0.002 and by 0.00004 at 0.02. The first-order signal weakens as the quartic grows.
4. The reduced-theory data support the same finite-regulator behaviors and a specified linear cutoff fit: a symmetric phase above a temperature, and
   a first-order line in the quartic that ends (x = 0.036 first order, x = 0.13 and 0.296 crossover).
5. Limits of the HR numbers: 240 to 350 measurements per point, one spatial size, no relation to continuum
   parameters. The scale is the cell scale, 1e17 above the measured crossover.

**8. Source checks.** Every formula was read in the TeX source of the arXiv version. Three differences:
arXiv:1508.07161 prints the quartic lattice coupling without the factor x; its abstract gives 159.5 +- 1.5 GeV and
its text 159.6 +- 0.1 +- 1.5 GeV; hep-lat/9510020 uses the rounded constants 0.09, 5.0, 5.2. The brief cites
159.5 +- 1.5 GeV, which is the abstract's value.

## EVIDENCE

- Canonical package `model/electroweak_crossover/` in
  [observer-patch-holography](https://github.com/FloatingPragma/observer-patch-holography/tree/main/model/electroweak_crossover):
  `production.json`, `certificate.py`, `reduction.py`, `finite_size.py`, `comparison_budget.py`,
  `results.json`, `comparison_budget.json` and `PROOF.md`.
- `inputs/input_manifest.json` binds 24 retained files, including 11 numerical JSON outputs and inert
  producer sources under `inputs/EW/`. The analysis producer evaluates y and T peaks on shared
  deleted blocks, but exports only the full vector and marginal errors. No raw simulation series
  or paired peak replicas are retained in this owning package.
- Gates of the production kernels, all PASS (`data/gates.json`, `data/gate_or.json`): gauge invariance 1.4e-16; free
  field <R^2> 2.46799(85) against 2.46774; plaquette at zero hopping 0.24190(18) against the strong-coupling series
  0.24179 and 0.12389(13) against 0.12378; Schwinger-Dyson identity 2.00021(70), 1.99981(55), 2.00064(50);
  heat bath alone against heat bath with overrelaxation: differences 0.01(12), 0.006(12) in <R^2>.
  Independent numpy implementation: plaquette at beta_G = 8 0.87068(16) against 0.870699(43).
- Replay from the canonical repository: `python -m model.electroweak_crossover --check` verifies
  51 named checks and `python -m model.electroweak_crossover.comparison_budget --check` verifies the
  shared-reference covariance receipt. `python -m pytest -q -W error model/electroweak_crossover`
  passes 35 tests.
- Map: the scale dependence of the transcribed vacuum relations equals the printed one-loop running of g^2, nu^2,
  lambda and g_Y^2 to 1e-9 (`test_reduction.py`).

## WHAT THIS DOES NOT ESTABLISH

- The chain's couplings are declared forms that fit. This lane takes them as inputs and adds no derivation.
- The Higgs mass term enters through m_H. Its cell-size problem is untouched.
- The reduction is perturbative. One percent of T_c is a declared allowance with no calibrated coverage.
- The U(1) gauge field of the reduced theory is not simulated.
- The endpoint x_c is imported. The runs bracket the end of the first-order signal at one lattice spacing and
  small volumes.
- The one-doublet rows rest on assumed Higgs and top masses.
- The four-dimensional gauge-Higgs comparisons use distinct regulator parameters and do not identify a common physical scale.
- Nothing here is a run at cell resolution. The reduced theory lives 1e17 below the cell scale.

## NEXT

1. Larger volumes at x = 0.13 and near x = 0.10 (48^3, 64^3) with multicanonical sampling to locate the endpoint at
   beta_G = 8 and 12.
2. The U(1) field in the lattice action (z = 0.33 for the chain), which removes the 0.3 GeV estimate.
3. A second fine lattice (beta_G = 16, 48^3) to tighten the continuum slope.
4. Two-loop vacuum relations for the top Yukawa coupling, the largest single term of the map.
5. When the chain derives m_H and m_t for the one-doublet row, rerun `ew_assemble.py` with those masses; the lattice
   data cover x from 0.29 to 0.36.

## FOR THE SITE

- Data file written: `SIM/oph_defects/viewer2/research/EW/ew_transition.json`, fetched as `/rl/EW/ew_transition.json`.
  It has no field "placeholder". Schema of the brief, with these additions: `points[].hysteresis` (list of
  {L, t, order, branch}), `points[].series[].chi_max`, `points[].growth_exponent_*`, `oph.series[].kind`
  ("reweighted" curve near the peak or "runs" over 148 to 174 GeV), `oph.continuum` (peak position per lattice),
  `oph.variants` (one-doublet rows A and B and the Standard Model check), `oph.T_c_err_lattice`,
  `oph.T_c_err_reduction`, `endpoint.growth`, `higgs_mass_scan`, `inputs[].row`.
  The canonical projection sets `oph.T_c_err` and `oph.T_c_err_lattice` to null; the statistical ranges
  are `oph.T_c_err_lattice_range` and `oph.T_c_err_lattice_unrestricted_range`. The rounded
  independent-error values are preserved only under `oph.retained_headline`, with an explicit
  control label. `comparison_budget`, `finite_size_cutoff` and `analysis_source` bind the
  calculation. No viewer may coerce an unidentified error to zero or use it for a combined pull.
- Units: `order` is <phi^dag phi>/g3^2 on y axes and v^2/T^2 on the temperature axis; `chi` is chi_3 on y axes and
  V T <(delta phi^dag phi)^2> on the temperature axis.
- Progress file: `SIM/oph_defects/viewer2/research/EW/progress.json`, status "done".
- Status words for the page: the transition temperature is "declared" (inputs) with a measured lattice part; the
  endpoint and the reduction are "imported"; the one-doublet rows are "one premise" (assumed masses).
- Links to add to `links.js` (external source references): https://arxiv.org/abs/hep-ph/9508379,
  https://arxiv.org/abs/hep-lat/9510020, https://arxiv.org/abs/hep-lat/9504001, https://arxiv.org/abs/hep-lat/9705003,
  https://arxiv.org/abs/hep-lat/9805013, https://arxiv.org/abs/1508.07161, https://arxiv.org/abs/1404.3565. The
  canonical package and receipt links are given above.
- Hook line for the coordinator: the transitions page reads `/rl/EW/ew_transition.json`; one line under the heading:
  "Map into this step: the chain's couplings at m_Z, reduced to three dimensions at temperature T."
