# Consolidated status: source-derived spectrum and obstruction map (2026-11-11 07:45, +07)

Covers three teams: the theory session (this directory), the audit team (Codex; public repository, now at
`repair-law/reverse-engineering-reality`, head cb7eaa293), and the simulation session (closed at midnight, handed
to Codex; `work/SIM/HANDOVER.md`). Detail per lane: `SPECTRUM.md`, `FINAL_STEPS.md`, `reports/`. Scoreboard:
`work/FZ/SCOREBOARD.md`.

## Audit consolidation and execution-domain boundary

The audit team's detailed result catalogue is
[CODEX_CONSOLIDATED_SPECTRUM.md](CODEX_CONSOLIDATED_SPECTRUM.md#complete-field-records-and-controlled-charged-energies).
Its public counterpart is the
[finite-field guide](../reverse-engineering-reality/docs/research/OPH_FINITE_FIELD_RECORDS.md).
Eleven public packages have actual producer replays and a combined 110-test
pass. They supply finite charged spectral records, controlled preparation,
fixed-spacing local-record limits, a nonzero interaction witness and complete
reference accounting. The interactive laboratory has six experiment views.

A separate exact min-max audit isolates the lowest rank-two charged cluster
of the unchanged c=21/2 orthogonal cube and gives
(E_charged - E_neutral - 4)/m in [1.1113460359,1.1227855904].
Its full-source separation exceeds 0.1717518525739329m. This is a
finite-cube energy statement, not a GeV mass or an identified lepton. The
public rank-eight energy instrument instead uses c=23/2. The growing
charged-family result concerns a prepared state, not that finite-cube
interacting ground.

The second-order virtual-photon calculation has binary64 diagnostic values
near 1.11809m. Its rational-power evaluator is repaired and the contraction
replay succeeds, with all frozen scientific hash checks retained. Its
many-body transfer allowance and Feshbach remainder are uncertified, so it
supplies no certified self-energy or physical mass. The
[source-to-particle audit](audit/SOURCE_TO_PARTICLE_AUDIT.md) and
[mass audit](audit/MASS_READOUT_AUDIT.md) give the exact arithmetic result,
remaining bounds and experimental interpretation requirements.

The theory-session tables below describe their named registers and declared
extensions. Their centre-class matches are exact representation comparisons;
centre class alone does not identify an elementary particle, Lorentz spin,
chirality, three generations or empirical mass. Continuous gauge controls,
spin pointers, scalar backgrounds, clock phases and unit choices retain their
own ancestry. In particular, exact B-L in a specified register does not
establish a Dirac-neutrino interpretation of a massless neutral composite.
The quantum-source audit provides no end-to-end transfer identifying those
register constructions with all physical Standard Model species.

## 1. Where the reconstruction stands

1. **Centre-class correspondence (EXACT within the stated register).** A defect of flux class k in
   Z6 = Z3 x Z2 carries the centre class 6Y mod 6 of a Standard Model multiplet: 1 and 5 left quarks, 4 and 2 right
   quarks, 3 lepton doublet and Higgs, 0 right leptons and gauge fields. The flux defects are bosons; the fermions
   are the quanta whose five-level pattern carries the class (`MATCH.md`, `reports/SS.md`).
2. **Source-level structure:** the gauge group (SU(3) x SU(2) x U(1))/Z6 with equal couplings at the cell, gauge
   waves with two polarizations, the spin-statistics grading, exact B - L (Dirac neutrinos), the cell scale
   E_cell = E* P^(-1/2), a tick with one Dirac cone per species, colour-centre confinement in the register ensemble.
3. **No measured rest mass, mixing angle or coupling value is derived by the consolidated source-to-field chain.** The frozen comparison (45 rows) has no
   source-class row that matches a measurement; 27 rows are open. The audit team's public papers state the same:
   "No result in this paper derives a measured particle mass."
4. **Closest lane: the charged-lepton ratios.** An exact unitary two-object register inside the coherent law
   compresses to the Koide circulant; with the read count 2/9 as clock phase it gives mu/e = 206.7703 (+9.83 ppm)
   and tau/e = 3477.47 (+0.61 sigma). Parts of the register are declared and the structure holds for one tick.
5. **The coupling sector reduces to one number:** the strong coupling at the cell, 1/alpha_3(E_cell) in MSbar,
   which must be at least 18.24; the source's closure gives 16.25.

## 2. What each team established

### Theory session (`repair-law/`, 40 worker reports since 2026-11-10 21:00)

| Topic | Result | Reports |
| --- | --- | --- |
| Names | class = 6Y mod 6 on all 32 patterns; reactions of the runs are the annihilation, Yukawa and mass vertices; pair kinds are positions on a carrier | `MATCH.md` |
| Spin and statistics | the 2 pi rotation equals (-1)^(number of quanta); one grading survives: 32 patterns fermions; defects, links, Higgs register bosons | SS |
| Gauge sector | port phases read on the code give exactly (SU(3) x SU(2) x U(1))/Z6; plaquette action = seam cost around a plaquette; couplings equal at the cell, sin^2 theta_W = 3/8 there; 24 transverse wave modes on one cone | GL |
| Scales | E_cell derived; only the cut-scale coupling enters a cell's closure (1/alpha = 16.2453); R(P) excluded (R = 0); observer-relative area law consistent, closes at the cell; colour bound 1/alpha_3(E_cell) >= 18.24 | DC, DC2, DC3, SC |
| Running | the source's census is Standard Model or vector-like; gauginos excluded by four routes; edge-sector slope shift excluded (the supplement's numbers are not reproducible) | DB, DB2, DB3, EB |
| W, Z, v | zero-selector law selected; the hypercharge slice is target-informed and removed; v attaches through G_F | LW |
| Higgs, top | criticality scale not derived; bounded Higgs registers give m_H 166 to 172 GeV; criticality at the cell gives m_H 131.9, m_t 175.0 GeV | HT |
| Leptons | branch weights 1/6 : 1/12 : 1/12 (EXACT); register with exact compression (sqrt2/3) C(theta); the seam event is a SWAP that records the source endpoint; scale reduced to one number y_J; dressing reduced to one rule | DA 1-3, FR, LS, LS2, TR, DR, DR2 |
| Quarks | Z6 cannot tell up from down; phases cap Koide Q at 2/3; the seam junction gives x = 1/2 on every leg; CP violation appears when up and down junctions are recorded on different seam objects | DF, DF2, QM, QM2, CM, CM2 |
| Neutrinos | B - L exact, Dirac; y_nu/y_e = 1 at first order; the neutral composite is massless at every order; PMNS a permutation | DG, DG2, NU3, PM |
| Hadrons | m_h = c_h Lambda^(3) with lattice c_h: nucleon 0.933(47), rho 0.773(42) GeV, conditional | DE, HD |
| Bookkeeping | obstruction map (69 rows), frozen comparison protocol and harness | OM, FZ |

Clock premise (worker CK stopped before its report; results in `work/CK/ck_results.json`): the identity
<I - Re U> = P(record 1) holds for every blank-record input (EXACT), so the energy clock reads read probabilities;
a weak-kick clock gives theta_N = 2/9 - 35/(2187 N^2), exactly 2/9 in the continuous limit; "one nat per read" in
modular energy needs p = 1/(1 + e), which no algebraic read probability has; a dressing that commutes with the
oriented current leaves the clock phase exact at every order.

### Audit team (Codex; 25 commits between 00:32 and 07:24)

- One finite interacting source with native chiral fields, quantum gauge links (Peter-Weyl, 119 states), a quantum
  Higgs memory and Yukawa terms; complete constrained spectra on two cells (unique neutral ground, certified gap);
  periodic sources with translation records in three directions; neutral composite transfer at fifth order;
  all quark and lepton Yukawa channels on one scalar (family cell).
- Overnight: complete native quark spectral records and first-hop transfer (code contraction P0/128); charged
  energy windows near 1.7816 and 1.7820 source units; rank-eight charged energy clusters per charge sector;
  Wilson-Maxwell and orthogonal-regulator cubes with prepared grounds, finite photon cutoffs and growing
  fixed-spacing families; a nonzero interaction witness; complete detector records with every outcome kept;
  papers consolidated as r2064.
- Its own boundary, unchanged: the constructions "do not yet identify Standard Model species or produce
  source-derived GeV masses"; Yukawa coefficients, the scalar background, generations and the unit are inputs.
- It now also owns the simulation and web app (`oph-physics-sim`, field-records page, commits through 07:24).
- Not yet taken up from this session (list handed to the owner on 2026-11-10): the class map, the circulant
  weights and the clock argument, exact B - L, the resonance at equal scalar and link penalties, the one-cone
  requirement, the cell-scale closure.

### Simulation session (closed 2026-11-11 00:00)

- Universe runs L3 to L10 (10.5 million observers), the defect catalogue and census, the CF-1 engines with 256^3
  validation, a web app with Readout, Spectrum, Space, Story, Cosmos and Map tabs.
- Lanes: GEN (no three-way split of any class in 1,048 tests), KOI (no algebraic copy matrix has phase 2/9;
  rational triples never give Q = 2/3), LNAT 1 to 3 (the coherent walk alone gives degenerate generations; V is
  native; the circulant does not persist past one tick), LEW (chain traced link by link), MAUD (every agreeing mass
  row uses fitted or target-informed inputs), D1, D3, T3 (member B: one Dirac cone), H4 (Z3 area law, Z2
  deconfined).

## 3. Spectrum, sector by sector

| Sector | Best current value | Standing | The one thing missing |
| --- | --- | --- | --- |
| e, mu, tau ratios | 206.7703, 3477.47 (measured 206.7683, 3477.37) | conditional | a law that keeps the register's structure every tick (native coupling of the generation register, entangled readout, re-prepared source); the -0.79 ppm dressing |
| e, mu, tau scale | none | open | the weight of one unrewarded read (y_J = 0.0108 needed) |
| u, d, s, c, b | none; every reading gives up = down | open | a junction magnitude law that reads T3 or integer 6Y (x_u 0.832, x_d 0.622; y_t/y_b about 59) |
| CKM | abs(V_us) 0.080, abs(V_cb) 0.023, abs(V_ub) 0.019, J 3.4e-5 (native reading; fails) | open | a bond junction that suppresses V_ub; quark base spectra |
| neutrinos | Dirac; masses none; mixing a permutation | open | a neutrino-specific amplitude or a B - L-violating register; a second lepton-family structure |
| W, Z | 80.539, 91.362 GeV (+0.22 %, +0.19 %) | conditional on the declared chain | slopes and scale forms the source does not supply; in the source's own frame, 1/alpha_3(E_cell) >= 18.24 |
| Higgs, top | 131.9, 175.0 GeV at the source's scale (+5.4 %, +1.7 %); 125.8, 172.0 at the declared midpoint | conditional | an unbounded Higgs register with a quartic law, or a derived scale three e-folds below the cell |
| proton, neutron, rho | 0.933(47), 0.773(42) GeV | conditional, lattice ratio imported | the colour coupling at the cell; quark masses for pion, kaon and n - p |
| photon, gluon | massless waves on the cone | conditional | a law that writes the continuous port phases |

## 4. Statements retired during the campaign

- "Koide Q = 2/3 is source-derived": the weights are; the circulant needs the register (OM note N2, LNAT2, LNAT3).
- "{4,4,4} is a baryon" and "{3,3} is a lepton with Higgs": flux contents are bosons (SS).
- "The source has a boson partner for every fermion" (census B): it rested on a grading the source lacks (SS).
- "The fifth-order neutral transfer makes the neutrino light": it is a hopping term (NU3).
- The m_Z reading of the pixel closure, R(P), the hypercharge slice, the edge-sector slope shift, the nucleon ratio
  2.775 as a lattice result (DC2, SC, LW, EB, HD).

## 5. Operational state

- The session ended near 00:05 and six workers stopped with it: FR round 2 (native register pieces; construction
  registered in `work/FR/ROUND2_REGISTER.md`), CM round 3 (bond junction), CK (results on file, no report), BF
  (the cell coupling of the truncated links; not started), UH (unbounded Higgs register; not started), OM (map
  rebuild and scoreboard rerun; not done). The obstruction map and scoreboard are at their 23:36 and 23:52 states.
- The public checkout is at the workspace root, `reverse-engineering-reality`. Research links use that canonical location; the old repair-law-local path is absent.
- AWS boxes A and B are stopped with volumes kept (simulation handover).

## 6. Decisions for the owner

1. Resume the six stopped lanes, or redirect.
2. The location of the public checkout: keep it where the audit team now works, or move it back and fix paths.
3. Whether the audit team should take up the findings listed in section 2, in particular the generation register
   and the clock, as a three-family version of its interacting source.
