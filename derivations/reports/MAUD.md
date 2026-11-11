# MAUD: trace of every mass value the theory repository reports as agreeing with measurement

Worker report, appended section by section. Subject: `reverse-engineering-reality` at commit
`5c7a8281bf5633ae957c9fdc634f31cbdd65ed4e`. The working tree had uncommitted edits under `model/coherent_defect_wave`,
`model/PREMISES.md`, `tracking/` and `docs/research/OPH_FIELD_RECONSTRUCTION.md`; none of the files traced here.
All scripts were run in a private copy `/tmp/claude-501/maud_repo/` (rsync of the working tree without `.git` and
`.lake`) with `/tmp/oph-completion-venv/bin/python` (Python 3.13.7; nothing installed). Git history was read with
read-only commands on the original. The original repository was not modified. Helper scripts:
`/tmp/claude-501/maud_work/`; worker notes for the electroweak and quark/neutrino lanes:
`/tmp/claude-501/maud_repo/_maud_notes/{EW,QN}.md`, reruns in `/tmp/claude-501/maud_repo/_maud_runs_ew/`.

Input classes:

- DERIVED: follows from a named theorem or exact construction (file and line given).
- MEASURED: a laboratory value enters the computation (which one is named).
- DECLARED: a stated choice in a file (file and line given), with no recorded use of the target.
- TARGET-INFORMED: chosen with knowledge of the measured value, per the repository's own provenance records (quoted)
  or by evidence found here (git history, numerical coincidence at a level a free choice cannot produce).

Line numbers refer to that snapshot (copy taken 21:47 +0700). The theory session edited the original during this
audit (38 files by 22:41, none under `code/particles`, `code/P_derivation` or `model/particle_spectrum_audit`); in the
particle paper the twelve-value table has moved from lines 3807-3818 to 3867-3878, with the same content.

Status: COMPLETE (2026-11-10). Machine-readable companion: `repair-law/work/SIM/cf1/runs/MAUD_mass_lanes.json`.
Not replayed here: the SMDR multiloop outputs of the paper table (SMDR v1.3 is not on this machine and was not
installed; the arithmetic downstream of them was reproduced) and the NuFIT 6.1 scorer (tables not shipped).
Hadron rows (Lambda_QCD, nucleon) are outside the requested scope and were not traced.

## 1. Priority check: W and Z on the strict branch, and the ratio MW/MZ

Requested first by the coordinator (theory-session view: closest lane to source-only; conditional on P and on the
discrete law choice; MW/MZ independent of P). Result: both statements hold numerically, with the qualifications below.
Neither W nor Z, nor their ratio, lies inside its experimental interval.

### 1.1 Reported values and measurement

`code/particles/MASS_CANDIDATE_STATUS.md:67-86` (artifact `code/particles/runs/calibration/wzh_residual_elimination_boundary.json`,
script `code/particles/calibration/derive_wzh_residual_elimination_boundary.py`). Measured references are PDG 2026 as
pinned in `code/particles/data/particle_reference_values.json`: MW = 80.3625 +- 0.0077 GeV (S043M), MZ = 91.1879 +- 0.0020 GeV
(S044M); their ratio is 0.8812847 +- 0.0000866 (errors combined as uncorrelated). The repository defines no physical
residual for these rows ("No physical residual or pull is defined because the renormalized-vev, tadpole, threshold,
matching, uncertainty, and complex-pole map is incomplete", MASS_CANDIDATE_STATUS.md:69). The pulls below use the
experimental error only and are mine.

| Law | MW (GeV) | MZ (GeV) | MW/MZ | W residual | Z residual | Ratio residual |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| zero-selector (tau2 = delta_n = 0) | 80.33006348366054 | 91.11911830689765 | 0.881593950603 | -32.44 MeV (-4.0e-4, -4.2 sigma) | -68.78 MeV (-7.5e-4, -34 sigma) | +3.51e-4 (+3.6 sigma) |
| nonzero carrier law | 80.32077863093059 | 91.12418820254928 | 0.881443008879 | -41.72 MeV (-5.4 sigma) | -63.71 MeV (-32 sigma) | +1.80e-4 (+1.8 sigma) |
| zero-selector without the eta slice (control) | 80.33006 | 91.58834 | 0.877077431 | -32 MeV | +400 MeV | -4.8e-3 (-48 sigma) |

Reproduced: yes, bit-exact (both laws, all digits), by `build()` of the producer in the copy
(`/tmp/claude-501/maud_work/strict_ratio.py`); the subagent rerun of the full script gives the same file
(`_maud_notes/EW.md` section 7). Hand form: MW = E_disp (v/E) sqrt(pi alpha2), MZ = E_disp (v/E) sqrt(pi (alpha2 + alphaY (1 - 2 eta)))
(producer lines 198-207).

### 1.2 Dependence on P

Computed by re-running the D10 basis (`derive_d10_ew_observable_family.build_artifact(P)` and
`derive_d10_ew_source_transport_pair`) at each P with v/E from the same transmutation law
(`/tmp/claude-501/maud_work/strict_pdep.py`):

| P | origin | MW (GeV) | MZ (GeV) | MW/MZ |
| --- | --- | ---: | ---: | ---: |
| 1.63094 | legacy pixel, "extracted from data" (initial commit a0b64d5a9, `paper/PAPER.md:4609`) | 80.386300 | 91.182914 | 0.881593893 |
| 1.630968209403959 | P_C = phi + sqrt(pi)/137.035999177 (CODATA) | 80.336871 | 91.126841 | 0.881593944 |
| 1.630971465307864 | paper comparison packet | 80.331168 | 91.120371 | 0.881593949 |
| 1.630972095858897 | P_fwd, declared closure root | 80.330063 | 91.119118 | 0.881593951 |

- Absolute values depend on P: dMW/dP = -1751.6 GeV and dMZ/dP = -1987.1 GeV per unit P. Using P_C instead of P_fwd
  raises MW by 6.81 MeV and MZ by 7.72 MeV. Through P = phi + sqrt(pi)/A_T this is +0.1654 GeV (W) and +0.1877 GeV (Z)
  per unit of the Thomson inverse coupling A_T.
- The ratio does not depend on P in practice: it moves by 8e-9 between P_C and P_fwd and by 2.0e-7 over
  1.63094 <= P <= 1.63105. E_star cancels in the ratio. The ratio is therefore fixed by the declared forms alone:
  with the MSSM-like slopes and beta_EW = 4 one has x = alpha_U ln(M_U/m_Z)/(2 pi) = 1/beta_EW + O(alpha_U) = 0.21749,
  so the running sin^2 = (1 + x)/(8/3 + 12 x) = 0.230736; the eta slice then multiplies alphaY by (1 - 2 eta) = 0.95571,
  which gives the chart value 1 - (MW/MZ)^2 = 0.222792 (measured on-shell value 1 - (80.3625/91.1879)^2 = 0.223337).

### 1.3 Inputs (zero-selector law)

| # | Input | Class | Where declared or sourced |
| --- | --- | --- | --- |
| 1 | GeV scale E_disp = h nu_Cs/(eps_Cs e) = 1.2208901289579266e19 GeV | MEASURED anchor (Planck energy; the clock lane calls eps_Cs a "calibration checksum reproducing displayed G") | producer lines 508-511; `code/particles/hierarchy/certificates/R_gamma_noG_DAG_certificate.json`; MASS_CANDIDATE_STATUS.md:15, 222-226 |
| 2 | P = P_fwd = 1.6309720958588973769... | fixed point of the declared map 2a-2h; the solver "inserts no measured endpoint" | `code/particles/hierarchy/certificates/R_P_source_audit_pixel_certificate.json` (status `source_audit_branch_witness_not_full_endpoint_proof`); `code/P_derivation/README.md:55-71` |
| 2a | P = phi + sqrt(pi) alpha (outer closure premise) | DECLARED ("a separate same-quantity premise") | `paper/observers_are_all_you_need.tex:3260-3266`; `code/P_derivation/paper_math.py:668` |
| 2b | M_U = E* e^{-2 pi} P^{1/6} | DECLARED | `paper/observers_are_all_you_need.tex:3288`; `paper_math.py:209-212`; `code/particles/calibration/legacy_d10/particle_masses_paper_d10_d11.py:89-90`; `code/P_derivation/README.md:66-69` ("the M_U and E_cell forms above are declared") |
| 2c | E_cell = E* P^{-1/2} and v = E_cell exp(-2 pi/(beta_EW alpha_U)) | DECLARED | `observers_are_all_you_need.tex:3289`; `paper_math.py:214-223`; `legacy_d10/...:97-99` |
| 2d | beta_EW = N_c + 1 = 4 | DECLARED ("The coefficient beta is a design choice, not the weak beta-function coefficient") | `observers_are_all_you_need.tex:3294-3295`; `paper_math.py:156`; `legacy_d10/...:93-94` |
| 2e | one-loop slopes (33/5, 1, -3) from M_U to m_Z | DECLARED ("supersymmetric running ansatz ... as a proxy; its extra supersymmetric fields are not instantiated"). With the model's own census slopes (41/10, -19/6, -7) and beta = 4 the equations have no solution | `paper_math.py:155`; `legacy_d10/...:31-32`; `code/P_derivation/README.md:66-71`; `model/pixel_mass_closure/PROOF.md:65-104`; `observers_are_all_you_need.tex:3291-3297` |
| 2f | pixel closure ellbar_SU2(4 pi^2 alpha2) + ellbar_SU3(4 pi^2 alpha3) = P/4 | DECLARED | `paper_math.py:582-588`; `legacy_d10/...:134-137` |
| 2g | tree Z closure m_Z = (v/2) sqrt(g2^2 + gY^2) at mu = m_Z | DECLARED | `legacy_d10/...:127-131, 219-247`; `paper_math.py:242` |
| 2h | Thomson transport A_T: exact one-loop fermion kernel on the "Stage-5" continuation masses, quark screening 1 - N_c alpha3/pi | DECLARED; the paper calls the masses "a phenomenological continuation, not an OPH-derived mass theorem" and the Koide balance inside it "a target-informed premise" | `extra/fine_structure_constant_derivation.tex:519-539, 553-575`; `paper_math.py:268-345, 453` |
| 3 | alpha_U(P), alpha2(m_Z), alphaY(m_Z), v/E | DERIVED from 2a-2g at P | `derive_d10_ew_observable_family.py`, `legacy_d10/...:219-296` |
| 4 | eta slice: alphaY -> alphaY (1 - 2 eta), eta = alpha_U cos 2 theta_W0 = 0.0221466 | TARGET-INFORMED by timing. No repository text gives its origin. It entered in 0ac276683 (2026-03-29 13:46 +0700), three days after 13d5b69ca (2026-03-26) whose `code/particles/RESULTS_STATUS.md` lines 17-18 showed Z = 91.6524603 against 91.1880 (+0.4645 GeV) and W = 80.3862917. On the strict branch it moves MZ from 91.5883 to 91.1191 GeV and the ratio from 0.87708 to 0.88159 | `code/particles/calibration/derive_d10_ew_source_transport_pair.py:57-69` |
| 5 | law choice: zero selector tau2 = delta_n = 0 versus the nonzero carrier | DECLARED discrete choice; "SOURCE_LAW_SELECTION_PRINCIPLE_ABSENT" | producer lines 575-580; MASS_CANDIDATE_STATUS.md:67-86 |
| 5' | (carrier law only) tau2, delta_n from the D10 value-law coefficients 2/3, 1 - beta/6, 4/3, 2 - beta/6 | TARGET-INFORMED (fitted on 2026-03-29 to the PDG-API pair 80.377 / 91.18797809193725, see section 4); the producer labels the carrier "prospective_post_exposure_candidate_not_current_source_evidence" | producer line 326; section 4 below |

Count: two outputs (MW, MZ) from one measured anchor and no fitted continuous parameter, on top of eight declared forms
(2a-2h), one target-timed slice (4) and one discrete law choice (5). The ratio needs no anchor and no measured input
of any kind: it is a pure number of the declared forms 2b-2g and the slice 4.

Step that would make it source-derived. The repository: "T3 once the discrete law selection is a theorem"
(MASS_CANDIDATE_STATUS.md:68) with blocking objects SOURCE_LAW_SELECTION_PRINCIPLE, BRST-complete pole kernels and the
operational clock (line 76). The trace adds: a source derivation of the slice (4) and of the forms 2a-2h, which the
paper itself calls a design (2d, 2e) and a premise (2a); and a chart-to-pole map, since 1.1 compares tree chart
coordinates with Breit-Wigner pole masses.

## 2. Charged leptons (e, mu, tau)

### 2.1 One finding covers all the near-agreeing lepton rows

The paper table (-70.5 ppm), the MCPR row (-84 ppm) and the icosahedral face-incidence branches (0.0003 ppm and
-0.42 ppm) are the same formula, the "MCPR" circulant law, evaluated at different pixel values P. I evaluated it at
each P with alpha_U(P) from the D10 chain and v/E from the transmutation law, E* = 1.220890e19 GeV
(`/tmp/claude-501/maud_work/lepton_pscan.py`, using the repository's own `response_fixed_point` and `charged_triple`):

| P | origin | m_e, m_mu, m_tau (MeV) | residual vs PDG 2026 (ppm) |
| --- | --- | --- | --- |
| 1.6309681897 | "alex_p" (`calibration/test_d10_ew_common_transport_gap_report.py:28`), the pixel of the submitted icosahedral archive and of the "truncated D10 comparison probe"; 1.97e-8 below P_C (it corresponds to alpha^-1 = 137.0362079 under P = phi + sqrt(pi) alpha) | 0.510998950849, 105.658375502, 1776.93000003 | +0.0003, +0.0000, +0.0000 |
| 1.630968209403959 | P_C from CODATA alpha | 0.51099873405, 105.658330721, 1776.92924685 | -0.424, -0.424, -0.424 |
| 1.630971465307864 | paper boundary packet | 0.510962911231, 105.650931342, 1776.80479525 | -70.53, -70.46, -70.46 |
| 1.630971514159316 | the repository's own pixel-feedback root (`model/pixel_mass_closure`, MSSM proxy) | 0.510962373766, 105.650820326, 1776.80292805 | -71.58, -71.51, -71.51 |
| 1.630972095858897 | P_fwd, declared closure root | 0.510955973931, 105.649498409, 1776.78069447 | -84.10, -84.02, -84.02 |
| 1.63094 | legacy pixel, extracted from gauge couplings | 0.511309209722, 105.722461056, 1778.00786731 | +607.2, +606.5, +606.6 |

The residual is a common scale that moves by -21.53 ppm per 1e-6 change of P (through v(P)); the ratios hardly move.
It vanishes at P = 1.630968189714, which equals alex_p, the pixel on which the submitted archive was built, to
1.4e-11. The formula's three coordinates were therefore set so that the measured triple comes out on that pixel,
which sits 1.97e-8 below the measured-alpha pixel P_C (hence -0.42 ppm at P_C); the -70.5 and -84 ppm rows are the same
fitted law moved to other pixel values. The repository's own adversarial review says the same
for the coordinates: "The three post-hoc equalizers match the three independently target-inferred spectral
coordinates to roughly one part per million or better. Runtime separation does not remove this historical discrete
formula selection" (`code/particles/runs/leptons/charged_icosahedral_completion_v1_review.json`,
`/three_coordinate_inverse_audit`; relative differences kappa 1.3e-7, chi 1.4e-6, zeta -5.0e-7).

The law (`model/particle_spectrum_audit/PROOF.md:13-27`, `code/particles/leptons/derive_charged_mcpr_completion_conditional.py:133-250`):
kappa = (u/50)/(1 + u/31 + u^2/310), chi = (u^2/512)/(1 - u/77), zeta = ((P - phi)^2/(21 pi))/(1 - u/27 - u^2/135),
rho = sqrt(2) e^{-chi}, delta = 2/9 + zeta, q_j = [1 + rho cos(delta + 2 pi j/3)]^2, product of masses / v^3 =
e^{3 kappa}/(2 * 6^14), u = alpha_U(P), v = E* P^{-1/2} e^{-2 pi/(4 u)}.

Inputs common to L1-L3:

| Input | Class | Where |
| --- | --- | --- |
| 8 register integers 50, 31, 10, 512, 77, 21, 27, 5 (read as icosahedral incidence counts) | TARGET-INFORMED: "The architecture was historically selected after exposure to the charged spectrum" (MCPR script docstring, lines 11-13); "Its response constants 50,31,310,512,77,21,27,135, its determinant exponent and the pole reading are target-informed" (`paper/deriving_the_particle_zoo_from_observer_consistency.tex:3830-3834`) | `derive_charged_mcpr_completion_conditional.py:133-153` |
| phase offset 2/9, amplitude sqrt(2) (Koide balance), determinant weight 1/(2 * 6^14) | TARGET-INFORMED (same sources; the Koide balance is "a target-informed premise", `extra/fine_structure_constant_derivation.tex:542`) | script lines 217-227 |
| pole-mass reading of the outputs | DECLARED premise ("Reading the outputs as pole masses is an adopted modeling premise", paper line 3840) | |
| P | depends on row: MEASURED (P_C via CODATA alpha), DECLARED (paper packet, P_fwd closure), MEASURED (1.63094) | see table |
| alpha_U(P), v(P)/E* | DERIVED from P through the declared D10 forms of section 1.3 (2b-2g) | |
| E* = 1.220890e19 GeV | MEASURED anchor (Planck energy) | MCPR script line 91 (display constant) |

Count for each row: three outputs from three fitted coordinates (kappa for the scale, chi for the modulus, zeta for the
phase), realised by eight integers plus 2/9 and 2 * 6^14, plus one real number P that sets the common scale. This is a
fit of three numbers to three numbers.

### 2.2 Per-row notes

- L1, paper table (`paper/deriving_the_particle_zoo_from_observer_consistency.tex:3807-3809`): e 0.000510962911,
  mu 0.105650931342, tau 1.77680479525 GeV against 0.00051099895069, 0.1056583755, 1.77693; -70.53, -70.45, -70.46 ppm.
  Reproduced to every printed digit by `python -m model.particle_spectrum_audit.derive --check` ("verified") and by
  the scan above. Ratio residuals mu/e +0.0725 ppm (outside the printed rectangle), tau/e +0.0662 ppm (inside). P,
  alpha_U and v come from the frozen boundary packet `model/particle_spectrum_audit/inputs.json`, whose ancestry files
  (`source_closure_round2/...`) are not in the repository; "No proof here selects these values from finite repair"
  (paper line 3790). No script in the repository reproduces P = 1.630971465307864; the repository's own feedback root
  is 4.9e-8 higher and gives -71.6 ppm.
- L2, MCPR completed-response candidate (`MASS_CANDIDATE_STATUS.md:19-32`): about -84 ppm. Reproduced bit-exact
  (`leptons/derive_charged_mcpr_completion_conditional.py --output ...`, identical to the stored artifact except
  timestamps): 0.510955973930992, 105.649498408667, 1776.780694465489 MeV. P = P_fwd.
- L3, icosahedral face-incidence branches (`leptons/README.md:116-139`, numbers at 129-134): submitted hybrid 0.000300 ppm, coherent public
  0.424 ppm, source audit 84.10 ppm. The archive itself (`correspondence/oph_charged_icosahedral_completion_v1.zip`) is
  not in the repository; the three numbers are reproduced by the scan above (alex_p, P_C, P_fwd). The hybrid row mixes
  alpha_U(P_C) with v(alex_p), "branch_tuple_coherent": false.
- L4, frozen Stage-5 formula (`leptons/README.md:14-22`): (0.510882243295, 105.635282871, 1776.579124017) MeV, max
  0.02284 %. Reproduced bit-exact (`leptons/derive_charged_stage5_frozen_candidate.py` and the audit script; residuals
  -228.4, -218.6, -197.5 ppm). Inputs: P = 1.63094 and v = 246.767 GeV, MEASURED ("The pixel area a_cell ~ 1.63094 l_p^2
  is extracted from data, not predicted", initial commit a0b64d5a9, `paper/PAPER.md:4609`); Koide balance Q = 2/3,
  TARGET-INFORMED premise; delta = 2/9, epsilon = 1/6, exponents (7,4,3), the 2^{1/6} normalisation and
  det M_e = v^3/(2 * 6^14), DECLARED ("declared phenomenological transport inputs", `extra/fine_structure_constant_derivation.tex:582-586`).
  On alex_p (the "truncated D10 comparison probe") the same formula misses by 0.083 %.
- L5, Koide conditional tau (`docs/POSTDICTION_LEDGER.md:118, 347`): [1776.968991, 1776.969063] MeV, 0.4336 sigma.
  Reproduced (`leptons/koide_balance_comparison_certificate.py --out ...`, and by hand: 1776.969027 MeV). Inputs: m_e
  and m_mu MEASURED (PDG); Q = 2/3 is Koide's published empirical relation (the repository: "The premise class carries
  measured-target ancestry"); ordering DECLARED. Two measured inputs and one empirical relation give one output. It is
  exactly Koide's formula (`docs/EMPIRICAL_STATUS.md:449`) and contains no OPH-specific input.
- L6, exact current-family witness and target-anchored intervals (`EXACT_FITS_ONLY.md:22-35`,
  `MASS_CANDIDATE_STATUS.md:42-57`, `POSTDICTION_LEDGER.md:341-346`): the witness reads the PDG masses and solves its
  coefficients from them (`leptons/derive_lepton_current_family_exact_readout.py:30-41`); rerun gives the PDG values
  to 6.7e-16. The kappa intervals (central 0.000508857, 0.105216, 1.769483 GeV, reproduced) consume the target shape,
  measured alpha, the KNT19 hadronic payload and a remainder "calibrated at the measured charged triple" (artifact
  guards). The anchor-gap value 0.6379 is the inversion that "closes the lane exactly on the measured triple". All
  three are calibrations by construction (MEASURED inputs equal to the outputs).

Step that would make the lepton values source-derived. Repository: "A5/W5 source selection remains open"
(`MASS_CANDIDATE_STATUS.md:21`) and blocking objects A5_FAM, DET_CAN, PROV, QFT_POLE, SCALE, W5_ORB (line 32); for the
absolute scale, the determinant trace-lift attachment `3 mu(r) = sum_e M_e^ch log q_e(r)` (`RESULTS_STATUS.md:66`). From
the trace: a source selection of the eight registers, the phase, the amplitude and the determinant weight, made before
evaluation, and a P that does not come from the measured alpha.

## 3. A provenance fact that bears on W, Z, Higgs and top

`code/particles/data/particle_reference_values.json`, the file the comparison rows read as "measured", carried from
its creation in 13d5b69ca (2026-03-26) until 648704739 (2026-07-11) the values W = 80.377 (its own display text read
"80.3692 +- 0.0133"), Z = 91.18797809193725, Higgs = 125.1995304097179, top = 172.3523553288312. These are unrounded
raw values returned by the PDG Python API (first fetched in 0b50d6d93, 2026-02-22, `pdg_data/particle_masses.csv`:
`Higgs boson,H,125.1995304097179`, `Z boson,Z0,91.18797809193725`, `W boson,W+,80.377`; checked here with `git show`).
From 648704739 (2026-07-11) the file carries PDG 2026 values (80.3625, 91.1879, 125.13, 172.1). The D10 and D11 formulas
below were written while the older numbers were the references, and they reproduce those numbers to 1e-8 GeV
(W, Z) or bit for bit (Higgs, top). Against today's references the same outputs sit at W +14.5 MeV, Z +0.08 MeV,
Higgs +69.5 MeV, top +252 MeV.

## 4. W and Z: the other lanes

Reproduced by the electroweak subagent in the copy, bit-exact for every value (commands and reruns in
`_maud_notes/EW.md` sections 2-8, `_maud_runs_ew/`); I re-checked the provenance items quoted here with `git show`.

- W2, D10 "target-free repair value law", MW 80.37700001539531, MZ 91.18797807794321 GeV (`CONDITIONAL_CANDIDATES.md:30-31`,
  `MASS_CANDIDATE_STATUS.md:88-96`). Against PDG 2026: +14.5 MeV (+1.9 sigma), +0.08 MeV (+0.04 sigma). Inputs:
  P = 1.63094, MEASURED (extracted from gauge couplings, see 2.2 L4); E_P = 1.220890e19 GeV, MEASURED; the declared D10
  forms 2b-2g of section 1.3; the eta slice (TARGET-INFORMED by timing, 1.3 row 4); the value-law coefficients
  lambda = eta^2/(4 beta), 2/3, 1 - beta/6, 4/3, 2 - beta/6 (`calibration/derive_d10_ew_target_free_repair_value_law.py:69-78`),
  TARGET-INFORMED. Evidence: the formula entered in 0ac276683 (2026-03-29) in
  `derive_d10_ew_target_emitter_candidate.py`, described as the "strongest current source-only target-emitter
  candidate above the freeze-once electroweak repair surface", in the same commit as the frozen-target artifact built
  from the PDG-API pair (80.377, 91.18797809193725), whose chart point (tau2 = -2.3116268e-4, delta_n = 2.3463639e-4)
  the formula reproduces to 3.8e-10 and 5.1e-10. In that commit the public rows read "W | calibration | 80.377 | 80.377
  +- 0.012 GeV | 0" and "Z | calibration | 91.1879781 | ... | 0" (`git show 0ac276683:code/particles/RESULTS_STATUS.md`,
  lines 26-27). The script itself says "The current corpus does not yet derive or uniquely select this chart" (lines
  10-11) and "At the repo default P this candidate nearly coincides numerically with the frozen benchmark surface"
  (line 230). Count: two outputs, two fitted coefficient terms (plus the lambda law). Classification: fit.
  Missing step (repository): "The archived value law is an exact implication of the QT1--QT5 quotient-path
  certificate. The repository does not emit that certificate" (`code/particles/README.md:306-311`).
- Candidate B, "color-balanced quadratic descent", MW 80.36921677537332, MZ 91.1880067442454
  (`runs/calibration/d10_repair_tuple_selection_theorem.json`). Its two numbers (c, d) = (sqrt(3)/2, 3/2) come from
  "selection axioms" A2, A3 that are stated, not derived ("the source derivation of A2 and A3 ... is the open step").
  The values implied by the then-current reference pair (80.3692, 91.188) are (0.866876, 1.500346), within 9.8e-4 and
  2.3e-4; the candidate hits that pair to 17 keV and 7 keV. Both appeared in 0ac276683 next to that target
  diagnostic. Two numbers for two outputs: TARGET-INFORMED by evidence.
- Postdiction-ledger chart rows MW 80.373383 [80.369217, 80.37755], MZ 91.19486 [91.187978, 91.201743]
  (`docs/POSTDICTION_LEDGER.md:357-358`, status NOT_EVALUABLE): the envelope of the two candidates above at P = 1.63094 and
  at the empirical-hadron pixel interval 1.631031-1.631052 (MEASURED payload); central = midpoint
  (`calibration/emit_conditional_ew_predictions.py:45-68`). Inherits the classification of its parents.
- W1, paper table, W 79.8563905 (-0.630 %), Z 90.5845168 (-0.662 %) (paper lines 3816-3817): frozen SMDR outputs in
  `model/particle_spectrum_audit/inputs.json` ("imported_readouts"). Not replayed: the replay needs a built SMDR v1.3
  tree (`replay_smdr.py --smdr-dir`), which is not on this machine and was not installed. Inputs: gauge couplings and
  Q0 = 91.5896 GeV from the D10 forms at the packet P (DECLARED), v = 246.60010 GeV = E* (v/E)(P), the attachment
  "v_Landau_MSbar(Q0) = v_source" (DECLARED, `inputs.json` "physical_attachment"), SMDR two-loop electroweak
  corrections (standard physics). No fitted coefficient enters; both lie far outside their intervals (-66 sigma,
  -302 sigma); substituting the reference v at Q0 moves them to +0.08 % and +0.05 % (paper Table vev-controls), which
  locates the miss in the v attachment.

## 5. Higgs and top

Same reproduction note as section 4.

- H3, declared calibration surface / live-exact split pair, mH 125.1995304097179, mt 172.3523553288312 GeV
  (`RESULTS_STATUS.md:60`, `EXACT_NONHADRON_MASSES.md:14`, `CONDITIONAL_CANDIDATES.md:28-29`): bit-identical to the raw
  PDG-API values that were the reference entries until 2026-07-11 (section 3). Against PDG 2026: +69.5 MeV (+0.6 sigma),
  +252 MeV (+0.4 sigma). The measured pair enters through exactifiers that read the reference file
  (feca1d288, `derive_d11_live_exact_higgs_promotion.py:49`: `higgs_target = float(references["higgs"]["value_gev"])`,
  line 61 solves `pi_h_exact = (m_h_core - higgs_target)/...`), then through residual selectors added two hours later
  (02d18608b, `derive_d11_live_exact_split_pair_theorem.py:55-57`: "These are the smallest source-only residual
  selectors found on the live D10 chart that make the forward D11 pair land exactly on the emitted Higgs/top codomain
  on the current float surface"). Further inputs: the D10 tuple of W2 (TARGET-INFORMED), a D11 core from a
  synchronization scale 6.8e11 GeV chosen by a scan whose objective contains the earlier published OPH pair 171.1/126.5
  (`calibration/legacy_d10/particle_masses_paper_d10_d11.py:52-56, 567-608`), rounded Jacobians 184.97/480.0,
  kappa = 16/9 (observed ratio 1.7788 against references 172.4/125.20 at 13d5b69ca), A_T = 3/2 + beta/4,
  B_H = 4/3 - beta/54 and eight residual-selector coefficients. At least fifteen selected numbers for two outputs.
  The repository's own label: "These values are back-solved from the measured Higgs and top ... They validate the
  formula stack and carry zero predictive content" (`MASS_CANDIDATE_STATUS.md:137`).
- H2, criticality at the log-midpoint boundary E* e^{-pi} P^{-1/6}, two-loop mt 172.62935892273643, mH 125.77115226639518
  (`MASS_CANDIDATE_STATUS.md:102-108`): mt +529 MeV (+0.9 sigma), mH +641 MeV (+5.8 sigma). Inputs: branch couplings from
  the D10 forms at P_fwd (DECLARED), lambda = beta_lambda = 0 at the boundary (DECLARED), standard two-loop SM running
  and QCD pole conversion, E* (MEASURED anchor), and the boundary scale, TARGET-INFORMED: "One candidate, the
  log-midpoint ... was identified after the two-loop implied scale was computed; it is therefore a post-exposure
  candidate" (`calibration/derive_d11_boundary_scale_selection_audit.py:17-22`); the lane landed in 961b2573c
  (2026-07-13) with four candidate scales listed beside the measured top (implied scale then 4.750e17 GeV from the
  direct top 172.6036; the midpoint is 4.863e17). One selected scale for two outputs. The same scale is used by the
  paper packet (its UV_GeV 4.8629e17 equals E* e^{-pi} P^{-1/6}) and by the conditional top coordinate
  `runs/calibration/conditional_top_fixed_p.json` (running 162.05945 GeV, inside the PDG m_t(m_t) range; quark
  subagent rerun identical).
- mH on the criticality curve at the measured top, 124.72560405075059 GeV (`MASS_CANDIDATE_STATUS.md:118-125`): one
  MEASURED input (mt = 172.1) gives one output with no tuned parameter; -404 MeV (-3.7 sigma experimental). The
  repository calls it within a declared 1.5 % matching tolerance. This is the cleanest test in the electroweak lanes
  and it does not agree within the experimental error.
- Postdiction-ledger rows mH 125.21291 [125.18329, 125.24253], mt 172.3074 [172.26243, 172.35236]
  (`docs/POSTDICTION_LEDGER.md:355-356`): envelope of the two D10 candidates at three P values; its endpoints include
  the former PDG-API values themselves. The ledger: "their agreement is built in and is not a prediction" (line 360).
- H1, paper table, H 124.842549 (-0.230 %, -2.6 sigma), t 170.611817 (-0.865 %, -2.5 sigma): frozen SMDR outputs from
  the packet, criticality at the same post-exposure boundary; not replayed (no SMDR). Substituting the reference v,
  y_t and lambda at Q0 gives +0.11 % and +0.25 % (paper Table vev-controls).

Missing step (repository): CRITICALITY_BOUNDARY_SCALE_SELECTION_THEOREM ("AR1 and AR3 have no derivation from the
axioms in the current corpus", `calibration/derive_d11_boundary_scale_midpoint_selection_theorem.py:30`), a
prospective three-loop packet, and for H3 source emission of the D11 core, Jacobian and residual selectors
(`code/particles/ledger.yaml:155-160`).

## 6. Quarks u, d, s, c, b

Traced by the quark/neutrino subagent (`_maud_notes/QN.md` sections 1-3); I re-checked the quoted guards and the
paper texture myself.

- Q1, paper six-power texture, Y_u = diag(6^-6, 6^-3, 1), Y_d = diag(6^-6, 6^-4, 6^-2) (paper lines 3784-3789, 3810-3814):
  u 0.00668144 (+209 %), d 0.00665065 (+41.5 %), s 0.239423 (+158 %), c 1.568449 (+23.2 %), b 6.590779 (+57.4 %).
  Reproduced (arithmetic and residuals) by `derive.py --check`; the SMDR running is a frozen input. Inputs: the texture
  (DECLARED; "No proof here selects these values from finite repair") plus the packet. Reported as disagreeing; the
  scale-free ratios s/d = 36.0 and u/d = 1.005 exclude it independently of any unit.
- Q3, conditional RSCC replay (`docs/POSTDICTION_LEDGER.md:374`: "All six individual quark coordinates lie within
  their separately quoted PDG 2026 marginal ranges"): u 0.002158958, d 0.004711035, s 0.09307006, c 1.2722596,
  b 4.1894578, t 172.06453 GeV, all inside; s/d 19.755755 (FLAG-derived 19.944 and 20.359), s/ud 27.094659, outside
  the PDG 90 % range [27.19, 27.51]. Reproduced (`flavor/conditional_quark_mass_replay.py --refresh-source --check`
  PASS, fresh gauge-root solve). Inputs: CODATA alpha (MEASURED, through P_C), E* (MEASURED), the D10 recipe 2a-2g
  (DECLARED), structural integers (DECLARED; the W5 dimensions 5, 4 and traces 1/5, 4/5, 4/15 are finite facts certified
  on 2026-10-03, after the formula of 2026-07-12), a menu of thirteen rational coefficients (79/15, 4/15, 29/5, 33/32,
  1/29, -1/432, 1/22, 1/420, 1/1008, 1/432, -1/1584, -rho/10, -1/4) and about eight equation forms, TARGET-INFORMED:
  `flavor/conditional_quark_mass_spec.json:96,98` `"formula_discovery_target_informed": true`,
  `"module_and_sign_ledger_target_informed": true`; `flavor/quark_rscc_completion_candidate.py:6-7` "Formula and
  module-ledger discovery was nevertheless informed by the known spectrum"; the audit shows the chosen denominators
  29, 22, 432, 840 next to the values 29.197, 21.906, 428.18, 836.48 implied by the earlier fitted template, "The
  declared composite dimensions closely track the already visible effective coordinates". A lower-order ablation
  without the seven quadratic terms also puts all six inside the ranges (`tracking/null_model_scorecard.md:7-11`).
  Count: six outputs from at least thirteen target-informed rationals plus two measured inputs. Classification:
  target-informed retrospective fit. Missing step (repository, `quark_rscc_completion_candidate.py:358-366`):
  "derive and uniquely select the RSCC carrier/module/effect ledger ... freeze prospectively before an independent
  comparison".
- Q2, exact current-family and selected-class audits (`EXACT_FITS_ONLY.md:37-71`): identity. The producer reads the six
  PDG masses and solves two shape coefficients and one geometric mean per sector from them
  (`flavor/derive_quark_current_family_exact_readout.py:39-58`); the seven-script chain reruns to the same digits.
  Six measured inputs, six outputs.
- Down-type register-Clebsch (rejected, ms/md 22.974 = MCPR m_mu/m_e divided by 9) and the up-type exponent scan
  (negative) are reported as failing and are not agreeing values.

Repository missing step for absolute quark masses: a source map that breaks the two-modulus spread action
(the fibre (R>0)^2 is non-identifiable on the current corpus), a no-target DAG, and one common-scale Yukawa conversion
(`RESULTS_STATUS.md:98`; `flavor/derive_quark_public_exact_yukawa_end_to_end_theorem.py:23-27`).

## 7. Neutrinos

Traced by the quark/neutrino subagent (`_maud_notes/QN.md` sections 5-7); I re-checked the ranking commit.

- N1, weighted-cycle candidate (`RESULTS_STATUS.md:77-85`): Delta m21^2/Delta m32^2 = 0.03072111 against 0.030721903
  (-2.58e-5 relative), theta12 34.2259 deg (+0.55 deg), theta13 8.68636 deg (+0.13 deg); theta23 49.72 deg and delta
  305.6 deg fail jointly (NuFIT 6.1 T23/DCP Delta chi^2 20.12 / 18.44 against 11.83): the repository rejects the
  candidate. Reproduced (`neutrino/derive_neutrino_weighted_cycle_repair.py`, ratio 0.030721110097966534; the NuFIT
  scorer was not rerun because the NuFIT tables are hash-pinned but not shipped). Inputs: a hand-written family kernel
  of two literal 3x3 complex matrices ("template", `flavor/derive_family_transport_kernel.py:73-85`, DECLARED) feeding
  eight effective numbers; discrete basis, orientation, row-order and ordering choices (DECLARED; five listed as
  `frozen_human_choices` in the lock); the exponent law p = 1 + gamma + eps/D_nu, TARGET-INFORMED. Evidence: commit
  802d93a08 (2026-03-30 13:19 +0700) adds `derive_neutrino_dimensionless_law_candidate_audit.py` with
  `representative_ratio = 7.49e-5 / 2.438e-3` (line 124) and ranks three candidate laws by `absolute_ratio_error`
  (lines 137-151), noting "The leading candidate may be numerically excellent without yet being derivable honestly from
  the current theorem surface" (line 178); commit decd4a9a2, 2.5 hours later, puts the ranked winner into the producer.
  The reported -2.58e-5 is the error of that winner against the ratio it was ranked on. The repository states it:
  "its exponent law was promoted after candidate laws had been ranked against the measured splitting ratio"
  (`neutrino/README.md:10-12`).
- N2, exact adapters (`EXACT_FITS_ONLY.md:73-125`): two fitted parameters (tau_nu, lambda_nu) for two measured
  splittings, exact by construction; m1, m2, m3 = 0.017457, 0.019484, 0.053081 eV have no measured counterpart.
  Single-splitting adapters: one parameter for one splitting; the other splitting then matches to 2.6e-5 only because
  of the ratio selection in N1. Reproduced.
- Absolute attachment (`code/particles/ledger.yaml:235-238`): 0.0174547, 0.0194820, 0.0530752 eV with splittings off by
  -0.026 % and -0.023 %; the factors P_nu and C_nu were found by monomial searches ranked against a scale fitted to the
  PDG splittings (git 53c937fd9; `runs/neutrino/neutrino_bridge_rigidity_theorem.json`: "The stored value is the
  distinguished optimizer on a declared family-assisted correction class"). TARGET-INFORMED.
- The minimal declared action (masses 0, 0, 0, `model/particle_spectrum_audit/derive.py:208`) and the finite-response
  attachment (ratio bound 0.0049872 against 0.0311) disagree with measurement and are reported as excluded.

Repository missing step: "source-emitted flavor kernel, source-derived cycle and label laws, a pre-reference hash
lock, and a new likelihood evaluation" (`runs/neutrino/precision_candidate_lock/v1.0.0/CLAIM.md:7`).

## 8. Fine-structure constant, the pixel number P, and the electroweak scale v

All mass rows depend on P through alpha_U(P) and v(P) (sections 1.2 and 2.1). Five alpha-related numbers appear:

| Quantity | Value | Against CODATA 2022 137.035999177(21) | Inputs | Classification |
| --- | --- | --- | --- | --- |
| P_C | 1.630968209403959324879... | equals it by construction | CODATA alpha (MEASURED) through P = phi + sqrt(pi) alpha (DECLARED premise 2a) | MEASURED; the "working value `P_C`, located from the measured fine-structure constant" (`code/particles/RESULTS_STATUS.md:7`; `code/P_derivation/README.md:89-92`) |
| forward closure root, P_fwd = 1.630972095858897 | alpha^-1 = 136.994835177412937 | -0.041164, -300.4 ppm | the declared map 2a-2h of section 1.3, no measured endpoint; interval-certified unique fixed point (`runtime/p_interval_contraction_certificate_2026-07-14.json`) | DECLARED-map output, no anchor; does not agree |
| gauge-width map | alpha^-1 = 137.035660136947, P = 1.6309682414045 | -0.000339, -2.474 ppm | the same map with alpha_U(P) added to the inverse-coupling readout | TARGET-INFORMED term (below) |
| entangled-pair spectral scalar | alpha^-1 = 137.035999189566155 (alpha = (79 + 48 sqrt2 + 42 sqrt3 + 3 sqrt6)/31104) | +1.26e-8, +0.598 sigma | an external construction (below); no measured input | DECLARED external construction; feeds no mass row |
| KNT19 empirical Thomson endpoint | 136.3827548 in [136.3670, 136.3985] | excludes CODATA | source anchor plus the measured hadronic payload 0.027609(112) | MEASURED payload; does not agree |

Notes:

- The root closure. Reproduced with the repository's mpmath point solver (`interval_contraction_certificate.PointSolver`,
  40 digits, cutoffs 120/90; `/tmp/claude-501/maud_work/pfwd_fast.py`, 21 s): alpha^-1 = 136.9948351774129372952894,
  P = 1.630972095858897376964514, alpha_U = 0.041124247441816685141, inside the stored certificate enclosure
  [136.99483517741293729528942588, 136.99483517741293729528943304]. The gauge-width map reproduces as
  137.0356601369465765688727 at P = 1.630968241404526601762526 (40 s). The map carries the Stage-5 continuation masses
  inside the Thomson transport (row 2h of section 1.3), which the fine-structure paper calls "a phenomenological
  continuation" with "a target-informed premise" (the Koide balance).
- The gauge-width term. The root value 136.994835 was in the repository from 2026-04-28 (a2ee0efaf, earliest commit
  containing the string), a gap of 0.041164 to CODATA. On 2026-06-27 (29fbfe16b) the README replaced it by a "best source prediction 137.0359595008, from
  alpha_root^-1 = 136.994835 plus bare alpha_U(P_star) ... low by 2.90e-7 relative", with alpha_U = 0.041124336195630495
  taken at the CODATA pixel, and wrote the remaining residual as "alpha_U C_{24,Q} with C_{24,Q} = 1.00096478597...".
  On 2026-07-14 (7e94eb43d) the closure ledger recorded that 137.0359595 "is a mixed-provenance packet (inner value at
  P_fwd plus alpha_U at the SL-3 pixel), not a fixed point of any single declared map", and the self-consistent
  gauge-width map was certified at 137.035660137. The added term (0.041124) was introduced after the gap (0.041164)
  was known and equals it to 1e-3: TARGET-INFORMED by timing and size. The null-model scan of 41 alternative constant
  pairs in the same map finds none within 2.5e-6, a threshold "set together with this scan, after that distance was
  known" (`tracking/null_model_scorecard.md:13-41`).
- The spectral scalar. `model/observer_particles/entangled_alpha.py` reconstructs A. D. Wissner-Gross's construction
  ("A Parameter-Free Candidate for the Fine-Structure Constant from Entangled Qudits", 2026): local dimensions
  (3, 2, 3, 2), exchange involutions on 172 records, gains (2 - x)(3 - y)/2 with multiplicities 79, 48, 42, 3, square-root
  weighting and the normalisation (3^2 - 1)(2^2 - 1)(3 * 2)^4 = 31104. I evaluated it: alpha^-1 = 137.0359991895661550,
  +0.5984 CODATA standard uncertainties, P = 1.630968209402773. It reads no measured value ("empirical_inputs": []).
  Its construction choices are the external author's, made for a candidate whose purpose is to equal alpha; the
  repository adds checks, not a derivation, and records "Thomson_photon_residue_identified": false,
  "same_cell_P_alpha_bridge_proved": false. It is used for the cross-scale tilt diagnostic and supplies "no observed
  mass value" (`code/particles/PARTICLE_PROVENANCE_LEDGER.md:62-75`). No mass row uses it; at its P the lepton law
  of section 2 would give the P_C row (-0.42 ppm).
- The electroweak scale v. v/E* = P^{-1/2} exp(-2 pi/(4 alpha_U(P))) (row 2c). At P_C, v = 246.6174 GeV
  (E* = 1.220890e19); at P_fwd 246.5968 GeV with the clock decimal. The Fermi-constant value
  (sqrt(2) G_F)^{-1/2} = 246.2197 GeV is 0.16 % lower. The conditional row `v_over_E_star = 2.0199803239725553e-17`
  (`CONDITIONAL_CANDIDATES.md:50`) is the P_C value. The paper notes that the packet's v = 246.60010 GeV equals the
  reference-model MS-bar v(172.4 GeV) = 246.60030 GeV within one part per million (line 3874); v moves by 21.5 ppm per
  1e-6 of P, so this equality holds at the packet P only, and the paper adds that it "supplies no scale-selection
  theorem".

## 9. Summary table

"Anchor" = E* (Planck energy from measured G). Pulls use the experimental error only (PDG 2026 pins in
`code/particles/data/particle_reference_values.json`); the repository itself assigns no physical pull to chart rows.

| Value | Reported vs measured | Reproduced | Free inputs vs outputs | Classification |
| --- | --- | --- | --- | --- |
| W, Z strict branch, zero selector | 80.3301, 91.1191 GeV: -32 MeV (-4.2 sigma), -69 MeV (-34 sigma) | yes, bit-exact | 0 fitted; 1 anchor; 8 declared forms, 1 target-timed slice, 1 discrete law -> 2 | declared-map output; outside errors |
| MW/MZ, zero selector | 0.881594 vs 0.881285(87): +3.6 sigma | yes | no anchor, no measured input; declared forms + slice -> 1 | declared-map output; outside errors |
| W, Z strict branch, carrier law | 80.3208, 91.1242: -42, -64 MeV | yes | as above + 2 target-informed coefficients | partly fitted; outside errors |
| W, Z D10 value law | 80.37700, 91.18798: +1.9, +0.04 sigma | yes | 2 fitted coefficients + measured P, E_P -> 2 | fit to the PDG-API pair (80.377, 91.18798) |
| W, Z candidate B | 80.36922, 91.18801 | yes | 2 numbers matched to target-implied (c, d) -> 2 | fit |
| W, Z ledger envelope | 80.3734, 91.1949 (NOT_EVALUABLE) | yes | envelope of the two fits | fit |
| W, Z paper (SMDR) | -0.630 %, -0.662 % | arithmetic yes; SMDR frozen | declared packet + attachment + anchor -> 2 | declared-map output; outside errors |
| H, t declared surface | 125.1995, 172.3524: +0.6, +0.4 sigma; bit-equal to the former PDG-API references | yes | >= 15 selected numbers -> 2 | target-anchored fit ("zero predictive content") |
| H, t criticality, log midpoint | 125.771, 172.629: +5.8, +0.9 sigma | yes | 1 post-exposure scale -> 2 | target-informed |
| mH at measured mt | 124.7256: -3.7 sigma | yes | 1 measured -> 1, nothing tuned | relation test; outside errors |
| H, t ledger envelope | 125.213, 172.307 | yes | envelope including the former references | "agreement is built in" (ledger) |
| H, t paper (SMDR) | -0.230 %, -0.865 % | arithmetic yes; SMDR frozen | post-exposure scale + packet | target-informed scale; outside errors |
| top running, fixed P | 162.059 GeV inside m_t(m_t) range | yes | post-exposure scale + measured alpha -> 1 | target-informed |
| e, mu, tau paper | -70.53, -70.45, -70.46 ppm | yes | 3 fitted coordinates + P -> 3 | fit, evaluated at a shifted P |
| e, mu, tau MCPR | -84.10, -84.02, -84.02 ppm | yes, bit-exact | same | fit, evaluated at P_fwd |
| e, mu, tau icosahedral | +0.0003 / -0.42 / -84.1 ppm | yes (P scan) | same | fit, at alex_p / P_C / P_fwd |
| e, mu, tau Stage-5 | max 0.0228 % | yes, bit-exact | Koide balance (empirical) + declared exponents + measured P -> 3 | target-informed premise + declared |
| tau from Koide | 1776.969 MeV, 0.43 sigma | yes | 2 measured + Koide relation -> 1 | Koide's empirical relation; no OPH input |
| e, mu, tau witness, kappa intervals, anchor gap | exact / contain the triple | yes | measured -> same | calibration identity |
| u, d, s, c, b paper texture | +23 % to +209 % | arithmetic yes | declared texture | disagrees |
| u, d, s, c, b, t RSCC | all six inside PDG ranges; s/ud outside | yes | >= 13 target-informed rationals + 2 measured -> 6 | target-informed fit |
| quark exact audits | exact | yes | 6 measured -> 6 | identity |
| neutrino ratio, theta12, theta13 | -2.58e-5; +0.55, +0.13 deg; joint test rejects | yes (scorer not rerun) | template + ratio-ranked exponent law | target-informed; rejected by the repository |
| neutrino adapters, absolute attachment | exact; -0.026 %, -0.023 % | yes | 2 -> 2, 1 -> 1; searched monomials | fits |
| alpha^-1 root closure | 136.994835: -300 ppm | yes, 25 digits | declared map, no anchor | declared-map output; disagrees |
| alpha^-1 gauge-width map | 137.035660: -2.47 ppm | yes, 25 digits | + term added after the gap was known | target-informed |
| alpha^-1 spectral scalar | 137.0359991896: +0.6 sigma | yes (evaluated) | external construction, no measured input | declared external candidate; feeds no mass |
| v | 246.617 GeV vs 246.220: +0.16 % | yes | D10 forms + measured P_C + anchor | declared-map output; disagrees |

## 10. Is any value derived without measured or declared inputs beyond one anchor?

No. Every particle-mass value in section 9 that agrees with measurement within its experimental uncertainty consumes
either a measured mass, a measured coupling through P_C, or coefficients that the repository's own provenance records
or its git history show were chosen with the measured value known. The only number in the corpus that agrees within
its uncertainty and reads no measured input is the entangled-pair scalar for alpha (+0.6 sigma, section 8); its
inputs are the construction choices of an outside author who proposed it as a candidate for alpha, OPH supplies no
derivation of those choices, its identification with the Thomson coupling is recorded as unproved, and no mass row
uses it. The values that use no measured mass and no fitted
continuous parameter are the strict-branch W and Z (one anchor, E*), their ratio and the forward fine-structure root
(no anchor). They rest on declared forms that the repository itself calls a design (beta_EW = 4, the MSSM-like slopes,
whose extra fields do not exist in the model and without which the equations have no solution), a premise
(P = phi + sqrt(pi) alpha) and a phenomenological continuation; the W/Z rows also carry a hypercharge slice introduced
three days after a 0.46 GeV Z discrepancy was on record. None of them lies inside its experimental interval:
W -4.2 sigma, Z -34 sigma, MW/MZ +3.6 sigma, alpha -300 ppm. The repository's own tiers agree: no lane in
`MASS_CANDIDATE_STATUS.md` carries T3 (source-only dimensionless) or T4 (source-only absolute) (tier table at lines
7-13; the strict branch is "T2 (T3 once the discrete law selection is a theorem)", line 68). The phrase "come from a
declared input packet" is accurate only for the paper's twelve-value table, whose packet is a frozen, partly
target-informed boundary tuple (section 2.2 L1); it does not describe the other surfaces, several of which consumed the
measured values directly.

## 11. Statement for a public web page

Every particle mass that the repository reports as agreeing with measurement is computed from inputs that include
measured values or coefficients chosen after the measured values were known: the energy unit is the measured Planck
energy, the pixel number P comes from the measured fine-structure constant or from a declared closure equation, and
the lepton, quark, Higgs, top, neutrino and earlier W/Z formulas contain numbers that the repository's own records or
its version history show were fitted to measurements. The quantities computed without any measured particle mass or
coupling, namely the W and Z masses on the strict branch (with the Planck energy as unit) and the fine-structure
constant from the closure equation, rest on declared modelling choices such as supersymmetric-type running slopes and
a fixed scale coefficient of four, and they differ from experiment by 0.04 % (W), 0.08 % (Z) and 0.03 % (fine-structure
constant), far outside the measurement uncertainties. No particle mass in the repository is yet derived from the
theory's axioms alone; the close agreements are fits and calibrations, and deriving the declared choices is the open
problem.

