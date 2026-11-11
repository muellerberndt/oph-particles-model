## RESULT

**Short answer.** None of my candidates derives why the Higgs quartic and its beta function vanish at a boundary scale.
- **What the source does fix.** Its class-3 register either pins the Higgs field's magnitude at the cell, or fixes nothing at all; neither case gives lambda = 0. Every criticality trajectory below the cell needs an almost free Higgs at the cell, lambda(E_cell) between 1.9e-4 and 1.2e-2.
- **Your C4 row** (criticality at E_cell under R = 0, v attached through G_F), SMDR:

  | Loops | m_H (GeV) | m_t (GeV) | W (GeV) | Z (GeV) | v(Q0) (GeV) |
  | --- | --- | --- | --- | --- | --- |
  | 2 | 131.904 | 174.976 | 80.545 | 91.355 | 248.860 |
  | 3 | 131.966 | 175.158 | 80.545 | 91.354 | 248.868 |

- **Against the midpoint row.** With the same G_F attachment, moving the boundary from the post-exposure midpoint to E_cell raises m_H by 6.06 GeV and m_t by 2.99 GeV. W and Z barely move.

**C4: criticality at E_cell (R = 0) with the G_F attachment. Computed; the boundary law itself stays declared.**
- SC's R = 0 puts the midpoint sqrt(E_cell M_U) at E_cell. This is the same point as LEW's K1 and as my C2a after GL.
- The G_F routine is gated: on LEW's midpoint packet it reproduces LEW's control F (v(Q0) 248.748274) to 8e-12. That control gives W 80.53911, Z 91.36191, H 125.84492, t 171.98782 GeV.
- The other attachments at E_cell (SMDR, two loops):

  | Attachment | m_H (GeV) | m_t (GeV) |
  | --- | --- | --- |
  | A1 (v at Q0) | 130.79 | 173.50 |
  | A2 (v at m_t) | 131.65 | 174.63 |
  | D11 engine (top-only, v at m_t) | 131.81 | 175.66 |

- C1 below also applies here: a register-type Higgs cannot supply lambda(E_cell) = 0 exactly at the cell.

**C1: the self-coupling fixed by the two flux orientations. EXCLUDED.**
- **Bounded registers (EXACT, sympy, using R8's Higgs-state condition).**
  - The Z2 bit, where +3 and -3 are one class, and the cyclic Z3 and Z6 counters have Higgs states only with |beta| = 1.
  - A two-level memory, an oscillator, and R8's empty-or-one register have no Higgs state with beta nonzero.
  - On any finite register, tr[phi, pi] = 0, so it carries no canonical field pair and no free scalar.
- **Unbounded register (EXACT).** With one oscillator per orientation, B = a + b† is normal (the commutator is 0 after the canonical commutation relations). Higgs states then exist for every complex beta, and the register fixes nothing.
- **The dichotomy.** The orientations either fix the field's modulus, which is the infinite-quartic end (identification IMPORTED from lattice phi^4), or fix nothing.
- **Flow from that end (MEASURED, D11 engine).** Starting from lambda(E_cell) in {1, 2, 4}, lambda stays at or above 0.206 all the way down to m_t, and m_H runs from 165 to 180 GeV.
- **Gap to criticality (MEASURED).** The criticality trajectories need these values of lambda at E_cell:

  | Trajectory | lambda(E_cell) |
  | --- | --- |
  | Midpoint | 1.9e-4 |
  | C3c | 4.8e-4 |
  | M_U | 7.3e-4 |
  | C3b | 3.4e-3 |
  | C3d | 1.2e-2 |

- **C1b** (an orientation flip acting as a boson-fermion symmetry): excluded by the argument that such a symmetry needs gauginos, which GL excludes (ARGUED).
- **C1c** (D-flat direction, tan beta = 1): excluded by DB3.

**C2: geometric mean of two descriptions of one cut. NOT DERIVED.**
- No pair among E*, E_cell, v_D10 and v_cell has the midpoint as its geometric mean (EXACT). The midpoint needs exactly the declared M_U (agreement to 2e-16).
- C2a (cell and unification, after GL) and C2d (the two sides of the cut) both give E_cell.
- C2b (cell and Planck area) gives E* P^(-1/4) = 1.080e19 GeV.
- C2c (U(1)_Y self-duality) needs alpha_Y = 9/pi, which is never reached.

**C3: equal edge-sector weights of the Higgs representation. NOT DERIVED.**
- On the source's own chart (unified at the cell), no reading equalizes, for any census.
- On the D11 chart:
  - C3a has no root;
  - C3b gives 1.820e13 GeV;
  - C3c (doublet against the triplet block of the code) gives 7.851e16 GeV;
  - C3d gives 8.20e7 GeV.
- No source mechanism links the gauge edge weights to lambda.

**Conditional rows.** Values are m_H, m_t in GeV; SMDR columns are at two loops.

| Scale | mu_c (GeV) | SMDR G_F | SMDR A1 | D11 engine |
| --- | --- | --- | --- | --- |
| C4 = E_cell | 9.560e18 | 131.90, 174.98 | 130.79, 173.50 | 131.81, 175.66 |
| C2b | 1.080e19 | 132.15, 175.09 | 131.03, 173.62 | 132.05, 175.78 |
| C3c | 7.851e16 | 121.96, 170.05 | 121.02, 168.74 | 121.90, 170.66 |
| C3b | 1.820e13 | not run | 101.34, 158.74 | 101.96, 160.21 |
| C3d | 8.20e7 | not run | 63.05, 136.76 | 63.24, 137.40 |
| Midpoint (reference) | 4.863e17 | 125.84, 171.99 | 124.84, 170.61 | 125.77, 172.63 |

Going from two to three loops moves every row by +0.06 GeV in m_H and +0.16 to +0.18 GeV in m_t, so the three-loop step changes no conclusion.

**Part 0.** This was computed before your correction and was SC's item; it stays on file. The transmutation at the cell contains no slope, so v/E* lies in [3.97e-12, 8.08e-12] for every reachable P. In a chain unified at the cell, M_U enters no equation.

**NOT BLIND comparison** (run once after the rows were on file; LEW's stored references H 125.13, t 172.1, W 80.3625, Z 91.1879 GeV):

| Row | m_H | m_t | W | Z |
| --- | --- | --- | --- | --- |
| C4, G_F, 2 loops | +5.41 % | +1.67 % | +0.227 % | +0.183 % |
| C4, G_F, 3 loops | +5.46 % | +1.78 % | | |
| C2b, G_F | +5.61 % | +1.74 % | | |
| C3c, G_F | -2.53 % | -1.19 % | | |
| Midpoint, G_F | +0.571 % | -0.065 % | | |

- C1's infinite-quartic end gives m_H 166.1 to 171.5 GeV at the measured top.
- No candidate row matches.

## EVIDENCE

All files are in `work/HT`. Run each script as `PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python <script>`.

- **Candidate record.** `CANDIDATES.md` was written at 23:21, before any computed value; Addendum 1 (C4) was appended at 23:41, before the G_F rows. Its sha256 is `7d7ccce8...`. Script hashes are in `SCRIPTS.sha256` and `SOURCES.sha256`.
- **Gates.**
  - `gate_d11.py`: the private copy of the D11 engine reproduces the stored values with deviation 0.0.
  - `gate_smdr.py`: reproduces LEW's K4 row with deviation 0.0.
  - `part2_gf_gate.py`: reproduces LEW's control F to 8e-12.
- **Parts 0 to 2.** `part0_rebuilt.py`, `part1_scales.py`, `part1_c1.py`, `part1_c1_oscillator.py`, `part2_d11.py`, `part2_extra.py`.
- **SMDR rows.** `part2_smdr.py <C2b|C3b|C3c|C3d> <out>` and `part2_gf.py <label> <mu_c> <loops> <out>`. Run these one at a time, because they share one scratch input file.
- **Comparison.** `part3_not_blind.py` and `part3b_not_blind_gf.py` are the only scripts that read measured values.
- **Run times.** The load average reached 43, so one SMDR readout took 63 s and the G_F rows took 57 to 200 s each. That is above the two-minute guideline.
- **Sources.** The RER checkout has been missing since about 23:20 and is still absent. Producers were copied from LEW's private copy `/tmp/claude-501/lew_repo` and gated against values printed from RER before it disappeared.

## WHAT THIS DOES NOT ESTABLISH

- The double-criticality law (lambda = beta_lambda = 0) has no source derivation at any scale. C4 evaluates the declared law at the only scale the source leaves.
- C4 inherits the premises of its inputs:
  - R = 0 rests on GL's and SC's premises.
  - The G_F attachment rests on LW's reading.
  - The packet is the declared D10 packet, read as Standard Model couplings.
- R8's register is DECLARED. The oscillator-pair register is my construction and is not found in the source.
- The flows use the D11 chart, which GL's couplings contradict above about 1e13 GeV.
- The C3 readings are not exhaustive, and the SMDR truncations have no certified error bound.

## NEXT

1. **Decide the type of the class-3 register.** If it is bounded, retire double criticality: the infinite-quartic end is excluded NOT BLIND. The measured Higgs then needs an unbounded class-3 register (one oscillator per orientation, carrying R8's charges and Gauss law) plus a law for its quartic that gives lambda(E_cell) between 2e-4 and 1e-2.
2. **Find a new scale or a new boundary law.** Under the declared law, the source's only scale E_cell misses m_H by +5.4 % (NOT BLIND). Any repair needs either a derived scale about three e-folds below the cell or a different boundary law.
3. **When EB reports,** rerun `part1_scales.py` with its census.
4. **Restore the RER checkout** for the other workers.
