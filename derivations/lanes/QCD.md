# Lane QCD: report

State of 13:20, interim: the runs stop at about 14:05 and the numbers below are replaced then.

## RESULT

**Headline (MEASURED).** The transition temperature of the colour links in units of the string tension, both from
this lane's own lattice code at N_t = 4:

- T_c / sqrt(sigma) = 1 / (4 a sqrt(sigma)) = **0.603(27)** (statistical 0.013, systematic 0.024).
- a sqrt(sigma) = 0.415(19) at beta = 5.6925 on 12^4 from 660 smeared-loop measurements.
- Published lattice values, same theory (IMPORTED): 0.5983(30) at this lattice spacing and 0.629(3) in the continuum
  limit (Boyd et al. 1996, Table 2 and abstract); 0.633(6) at this spacing from a sqrt(sigma) = 0.395(4) (Teper 1998);
  0.646(5) in the continuum limit (Lucini, Teper, Wenger 2004).
- This is a pure number of pure SU(3) gauge theory. No imported conversion enters it.

**1. Action (EXACT, with one DECLARED premise).** GL's seam cost 1 - Re tr5(U_P)/5 restricted to a colour holonomy
is (3/5)(1 - Re tr V/3). With beta_5 = 10/g^2 the colour factor is the Wilson plaquette action with beta = 6/g^2.
Continuous links with this weight are GL's declared step. No coupling value at the cell is used. Every curve is an
ensemble scan in the coupling.

**2. Kernel and gates (all pass).** Cabibbo-Marinari heat bath with Kennedy-Pendleton or Creutz generator and four
overrelaxation sweeps per heat-bath sweep, numba, 2.9 microseconds per link per compound sweep on a free core.

| Gate | Result | Reference | Label |
| --- | --- | --- | --- |
| gauge invariance of plaquette, Polyakov loop, Wilson loops | 2e-16 | 0 | EXACT |
| centre transformation on one time slice: plaquette change, loop mismatch | 1e-16 | 0 | EXACT |
| overrelaxation: change of the action | 2e-16 | 0 | EXACT |
| unitarity drift after 200 compound sweeps | 8e-14 | below 1e-10 | MEASURED |
| plaquette, 8^4, beta = 5.7 | 0.54886(29); heat bath alone 0.54934(22) | 0.5492 (IMPORTED) | MEASURED |
| plaquette, beta = 6.0 | 0.59371(6) on 12^4; 0.59411(12) on 8^4 | 0.5937 (IMPORTED) | MEASURED |
| strong coupling, 6^4, beta = 1.0 | 0.06014(9) | 0.06013 (EXACT one-plaquette value plus cube term) | MEASURED |
| strong coupling, 6^4, beta = 2.0 | 0.12890(14) | 0.12877 (EXACT one-plaquette value plus cube term) | MEASURED |
| smeared loops gauge invariant; smeared links covariant and unitary | 3e-15; 8e-16; 9e-16 | 0 | EXACT |

The 8^4 plaquette at beta = 6.0 lies 3.4 statistical errors above the reference. The 12^4 run removes the shift.
The published plaquette values are quoted from memory of Lepage and Mackenzie 1993 and were not opened.

**3. Transition at N_t = 4 (MEASURED).** 20 runs, 232500 compound sweeps in total. beta_c(N_s) is the
maximum of chi = N_s^3 (<|L|^2> - <|L|>^2) from multi-histogram reweighting, jackknife errors.

| N_s | runs, couplings | sweeps used | beta_c(N_s) | chi_max |
| --- | --- | --- | --- | --- |
| 8 | 7, 5.65 to 5.72 | 78200 | 5.6881(10) | 1.314(14) |
| 12 | 5, 5.686 to 5.696 | 61116 | 5.6896(5) | 3.60(6) |
| 16 | 6, 5.687 to 5.7 | 55254 | 5.6911(4) | 7.82(21) |

- Infinite volume, form beta_c(N_s) = beta_c - h (4/N_s)^3: **5.6912(5)** through the three sizes (h = 0.028(10), chi^2 = 1.8 for one degree of freedom); **5.6922(8)** through N_s = 12 and 16 (h = 0.069).
- Published (IMPORTED): 5.6925(2) in infinite volume and 5.6908(2) on 16^3 x 4 (Boyd et al. 1996); 5.69226(41) and
  h at most 0.1 (Iwasaki et al. 1992).
- Check A3: equal weight of the two peaks at N_s = 16 at beta = 5.6899.

**4. Order (MEASURED).** chi_max grows as N_s^x with x = 2.54(4) (pairs 2.48 for 8 to 12 and 2.70 for 12 to 16). First order means x = 3 asymptotically.
The histogram of |L| at the peak has two maxima at N_s = 16 (dip 0.47 of the lower maximum) and at N_s = 12 (dip 0.67); none is resolved at N_s = 8.
The five long 16^3 x 4 runs pass between the confined phase (|L| near 0.03) and the deconfined phase (|L| near 0.11) 30 to 43 times each. Each deconfined stretch sits in one of the three Z3 sectors, and all three occur.

**6. Centre symmetry (EXACT; checks in the package).**
- A centre transformation multiplies every time-like link leaving one time slice by z = exp(2 pi i/3). A plaquette
  based on that slice holds one such link and one conjugate, so every plaquette is unchanged. The Polyakov loop crosses
  the slice once: L -> z L.
- The transformation is a symmetry of action and measure and no gauge transformation. In a finite volume the
  distribution of L is invariant under a third of a turn. <L> = exp(-F/T) for a static colour charge (IMPORTED:
  Polyakov, Susskind): L = 0 is confinement, a nonzero L breaks the symmetry.
- Classes. The central element of flux class f is exp(2 pi i f Y). Classes 2 and 4 act on the colour levels only
  (1/3 and 2/3 of a turn), class 3 on the weak levels only. A static quantum of class k turns by f k/6 of a turn: under
  the colour centre by k/3. The charged classes are 1, 2, 4, 5, the quark classes. Classes 0 and 3 are neutral.
- Flux. The same transformation on a spatial region R only turns the loops inside R and changes exactly the time-like
  plaquettes of the slice that straddle the boundary of R: their holonomy gets z or z^2, a class-2 or class-4 flux.
  On the cold lattice a 3 x 2 x 4 block gives 52 flux plaquettes for 52 boundary links, and the flux surface is closed
  (cube sums zero modulo 3). A class-2 or class-4 flux sheet is the wall between two centre sectors of the loop.
- A plaquette whose holonomy is the centre element costs 9/10 in the seam cost, 3 beta/2 in the Wilson action.

**7. String tension (MEASURED).** 12^4, beta = 5.6925, 660 measurements in 2 chains, APE smearing (coefficient 0.4, gauge-covariant projection), thin time-like links, V(R) = ln[W(R,T)/W(R,T+1)].

| Fit | a sqrt(sigma) | sigma a^2 | e | chi^2/dof |
| --- | --- | --- | --- | --- |
| primary: 12 steps, T=3, R=2..6, three parameters | 0.415(9) | 0.172(8) | 0.295 | 0.68/2 |
| check: T=2 | 0.398(4) | 0.1587(30) | 0.381 | 0.10/2 |
| check: 6 steps, T=3 | 0.417(10) | 0.174(8) | 0.276 | 1.04/2 |
| check: e = pi/12 fixed, R=3..6 | 0.418(5) | 0.175(4) | 0.262 | 0.81/2 |
| check: R=2..5 | 0.415(9) | 0.172(8) | 0.293 | 0.67/1 |
| extra: T=4 | 0.39(3) | 0.155(26) | 0.359 | 1.96/2 |

V(R) for R = 1..6 (12 steps, T = 3): 0.5083(3), 0.8143(12), 1.035(3), 1.235(5), 1.414(11), 1.600(21).
Systematic error: the largest difference of the four checks from the primary, 0.0165 in a sqrt(sigma). The uncertainty of beta_c shifts a sqrt(sigma) by 0.3 per cent (slope from Necco and Sommer 2002, IMPORTED) and is covered.
Earlier lower estimate from unsmeared Creutz ratios (500 measurements): chi(4,4) = 0.200(13), T_c/sqrt(sigma) above 0.559(18). Superseded.

**8. Register ensemble (MEASURED; three-dimensional Z_N link fields, weight exp(kappa sum Re W_p), scripts of run H4).**

| Group | L | C_max = max 3V var(e) | kappa of the maximum | 2/3 - Binder minimum | dip of the energy histogram |
| --- | --- | --- | --- | --- | --- |
| Z3 | 8 | 7.20(13) | 1.0668(8) | 8.5e-03 | 0.57 |
| Z3 | 12 | 12.1(4) | 1.0781(6) | 3.9e-03 | 0.41 |
| Z3 | 16 | 19.6(12) | 1.08085(17) | 2.6e-03 | 0.31 |
| Z3 | 24 | 31.3(23) | 1.08315(16) | 1.2e-03 | 0.20 |
| Z2 | 8 | 3.566(28) | 0.7323(7) | 4.0e-03 | 0.93 |
| Z2 | 12 | 4.01(13) | 0.7455(8) | 1.3e-03 | 1.00 |
| Z2 | 16 | 4.40(14) | 0.7505(5) | 5.7e-04 | 1.00 |
| Z2 | 24 | 4.2(4) | 0.7584(7) | 1.6e-04 | 1.00 |

- Z3: growth exponents between successive sizes 1.27(10), 1.69(26), 1.16(24). Extrapolated kappa_c = 1.08387(20); duality value 1.0843 (IMPORTED spin-model coupling).
- Z2: growth exponents between successive sizes 0.29(8), 0.32(16), -0.10(27). Extrapolated kappa_c = 0.7636(11); duality value 0.761413 (IMPORTED spin-model coupling).
- Verdict: the colour centre Z3 is first order (two-peak histogram that deepens with L, a Binder minimum that stays
  away from 2/3, coexisting branches at the largest size). Its growth exponent is far below 3 at these sizes: the
  transition is weakly first order. The weak centre Z2 is continuous (one peak, Binder minimum going to 2/3, growth
  compatible with the Ising value 0.17).
- MA's numbers for comparison (48^3): Z3 first order with kappa_c in (1.082, 1.086) and a jump of 0.06 to 0.07 in
  <Re W>; area law below it, sqrt(sigma) = 0.173(3) per cell at kappa = 1.0797; Z2 continuous at 0.7614.

**9. Scale (IMPORTED; no computed route; kept out of the site statements).**
- Chain (declared forms): alpha_s(m_Z) = 0.11834, Lambda3 = 0.3400 GeV (corners 0.3251 to 0.3547), report HD.
- Lattice QCD with physical quarks: T_pc = 156.5(1.5) MeV (HotQCD 2019), Lambda3 = 338(12) MeV (FLAG 2021). Ratio 0.463(17).
- Product: 157.4 MeV, error 5.8 from the ratio and 6.9 from the chain's corners, total 9.0. NOT BLIND: the product is the imported temperature times Lambda3(chain)/Lambda3(lattice) = 1.0059.
  Alternatives: 158.9 MeV (Borsanyi et al. 2020), 156.0 MeV (ALPHA 2017 Lambda3), error 4.9 MeV with FLAG 2024.
- Radiation-era time: 1.243e-05 s with g* = 61.75 and 2.351e-05 s with g* = 17.25; 1.805e+38 and 3.415e+38 ticks (tick = 6.8851e-44 s). T/E_cell = 1.647e-20.
- Pure gauge theory (IMPORTED): T_c/sqrt(sigma) = 0.629(3) and 0.646(5); T_c/Lambda0_MSbar = 1.25(10) from
  T_c r_0 = 0.7498(50) and r_0 Lambda0 = 0.602(48).
- With light quarks the transition is a crossover (IMPORTED, Aoki et al. 2006). The first-order transition
  measured here is that of the links alone.

**10. Whose numbers.**

| Item | Status |
| --- | --- |
| group (SU(3) x SU(2) x U(1))/Z6, colour centre = classes 2 and 4 | source, derived (ADDENDUM items 1, 3) |
| plaquette action and its colour factor beta = 6/g^2 | source; continuous links are a declared step (GL) |
| beta_c, order, sectors, a sqrt(sigma), T_c/sqrt(sigma) | computed here, pure SU(3) links |
| alpha_s(m_Z) = 0.11834, Lambda3 = 0.3400 GeV | chain, declared forms; running IMPORTED |
| T_pc = 156.5 MeV, Lambda3 = 338 MeV, g*, radiation-era relation, E_Planck | IMPORTED |
| crossover with quarks | IMPORTED |

**11. Additional task, M2 link register.** The M2 register of BF is a Hamiltonian menu theory: 3380 link states,
H = (g^2/2) sum C + beta_F sum [1 - Re tr_F(projected plaquette)/N_F]. A scan with Wilson loops needs two things
that are not on file: the state (ground state or thermal ensemble of that Hamiltonian on a lattice), and a method
for it. The menu projector acts in the representation basis, so the Euclidean weight in the group basis is not
positive, and the representation-basis weights carry signs. BF has the product-state level: colour links are
disordered below a bare 1/alpha of 20.3 (5-trace) and 34.4 (15-trace). An ordered product link gives the perimeter
law, a disordered one no loop at this level. No Monte Carlo of M2 was run.
The planned scan of the full register on 8^4 did not finish.

## EVIDENCE

Lane directory `RL/work/SIM/phase2/QCD/`.
- Plan and log: `METHOD.md`, `CANDIDATES.md` (candidates before values; every added try and every change of plan with its time).
- Kernel: `su3_lib.py` (numba), `su3_smear.py`, drivers `su3_run.py`, `su3_sigma.py`, `su3_t0scan.py`, gates `su3_gates.py`
  (`gates.json`, `gates.log`), `su3_sigma.py gate` (`gates_smear.json`).
- Launchers as run on the box in `~/qcd`: `launch_wave1.py`, `launch_reg.sh`, `rechain.sh`, `chain_c10b.sh`, `pool_sigma.py`,
  `reg_fss.py` (with `work/SIM/cf1/gauge/gauge_mc.py` unchanged), `stop_all.sh`.
- Raw series: `data/nt4/*.npz` (plaquette and complex Polyakov loop per compound sweep), `data/sym/*.npz` and
  `data/sym/t0scan_8.json` (Wilson loops), `data/reg/*.npz` (register energy per sweep). All below 100 MB; nothing stays on the box.
- Analysis: `analyze.py su3 data/nt4 analysis_su3_nt4.json`, `analyze.py reg data/reg analysis_reg.json`,
  `sigma_analyze.py data/sym "sigma_b5.6925_s*.npz" sigma.json`, `scale.py`, `build_outputs.py "status"`, `fill_docs.py`,
  `make_result.py`. Python: `python`.
- Package: `rer_package/colour_deconfinement/` with `README.md`, `PROOF.md`, `su3.py`, `su3_numba.py`, `centre.py`,
  `register.py`, `scale.py`, `certificate.py`, `lattice_tables.json`, `results.json`, `test_colour_deconfinement.py`.
- Web checks of imported numbers are listed in `CANDIDATES.md` (12:31 and 13:15).

## WHAT THIS DOES NOT ESTABLISH

- That the source's links are continuous SU(3) variables with the Wilson weight. That step is declared in GL.
- Where the source sits on the coupling axis. No coupling at the cell is used. The scan is an ensemble scan.
- A temperature in MeV from the source. The MeV value exists only through the imported ratio T_pc/Lambda3.
- The transition of the early universe with quarks. The simulation holds the links alone; with light quarks the
  transition is a crossover (IMPORTED).
- A continuum limit. N_t = 4 is one coarse lattice spacing. The published continuum ratio lies 5 per cent above the
  published N_t = 4 ratio. N_t = 6 was not run: the box was shared at a load of 30 and the cores went to the string tension.
- First-order asymptotics. The volume exponent is 2.54 at N_s up to 16, below 3. The verdict rests on the
  two-peak histograms and the flip-flops as well. The far points of N_s = 16 were dropped; N_s = 16 covers 5.687 to 5.70.
- A string tension beyond on-axis loops with R up to 6 on 12^4. The fit form dominates the error.
- The register verdicts beyond L = 32. The Z3 exponent is far below 3; at L = 32 the Z3 runs do not equilibrate between
  the branches, so no C_max is quoted there. At L = 24 the Z3 runs change branch only a few times.
- Anything for the M2 register beyond BF's product-state statement.
- The plaquette reference values and three literature attributions are from memory (marked in `CANDIDATES.md`).

## NEXT

1. N_t = 6 and 8 with zero-temperature string tensions at their beta_c (16^4 and 24^4): the continuum limit of the
   computed ratio T_c/sqrt(sigma). Exact next step: `su3_run.py 16 6 beta ...` for beta = 5.87 to 5.91 and
   `su3_sigma.py 16 5.8941 ...` with loops up to R = 8.
2. Cross-check of a sqrt(sigma) with lane HAD's static potential at beta = 5.7 once it is on file (none at report time).
3. N_s = 24 and 32 at N_t = 4 with longer runs: the exponent toward 3 and the latent heat.
4. The routing fermions on these links: the crossover with quarks, and with it a computed ratio T_pc over a hadron
   mass or over sqrt(sigma) that replaces the imported ratio.
5. A source statement for the coupling: the law that writes the port phases (GL, NEXT 1).
6. M2: fix the ensemble (ground state of BF's Hamiltonian) and a sign-free or tensor-network method, or keep the
   product-state statement.

## FOR THE SITE

- `SIM/oph_defects/viewer2/research/QCD/colour_transition.json`, fetched as `/rl/QCD/colour_transition.json`. Measured
  data only, no field `placeholder`. Size below 400 kB.
- `SIM/oph_defects/viewer2/research/QCD/progress.json` (status `done`).
- Fields of the brief's schema are all present. `hist[].bins` are bin centres. Added fields:
  - `su3.Tc_over_sqrt_sigma` {value, err, err_stat, err_sys, N_t, a_sqrt_sigma, a_sqrt_sigma_err, literature, literature_err,
    cite, literature_same_spacing {value, err, cite}, literature_other[]}: the headline.
  - `scale.route_computed` = false, `scale.route_note`. The MeV value and the cosmic time are in `scale` and in no statement.
  - `su3.series[].curve` {beta, absL, chi, chi_err} (reweighted curve), `su3.series[].beta_c`, `chi_max`; `su3.beta_c_fit`;
    `su3.beta_c_literature_Ns16`; `su3.chi_max_scaling`; `su3.hist[].kind`; `su3.scatter[].where`; `su3.sectors_above`;
    `su3.trace` {every, absL, re, im}: the flip-flop series of one 16^3 x 4 run at beta = 5.691; `su3.gates[]`.
  - `register.Z3|Z2`: `kappa_c`, `kappa_c_err`, `kappa_c_literature`, `order`, `series[]` {L, kappa, C, C_err, e, kappa_peak,
    C_max, metastable, points[]}, `scaling` {L, C_max, C_max_err, exponent_pairs, exponent_pairs_err}, `hist[]`, `metastable[]`.
  - `coupling_scan` (if present): Wilson loops against area and perimeter, full register, labelled as an ensemble scan.
  - `string_tension_unsmeared_check`: the earlier Creutz-ratio estimate.
- Hook lines for `links.js` (all targets exist; the RER path was checked in the checkout):
  `colour: [['Derivation: gauge group, plaquette action, equal couplings', DER + 'reports/GL.md'],`
  `['Colour and weak centre in the register ensemble', DER + 'reports/MA.md'],`
  `['Certificate: defect classes are centre classes', RER + 'model/defect_particle_classes/PROOF.md'],`
  `['Published lattice value, same theory: Boyd et al. 1996', 'https://arxiv.org/abs/hep-lat/9602007'],`
  `['Published lattice value, same theory: Lucini, Teper, Wenger 2004', 'https://arxiv.org/abs/hep-lat/0307017']],`
- Status words for the page: colour centre and classes "derived"; continuous links and action "declared"; beta_c, order,
  T_c/sqrt(sigma) are numbers the model's own lattice run computed for pure SU(3) links; MeV placement "imported", not shown as a result.
- The candidate package `rer_package/colour_deconfinement/` is not in RER. No link to it until it is merged.
