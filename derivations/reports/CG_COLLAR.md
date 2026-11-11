## RESULT

**What is derived.** The source's collar generator is a declared Metropolis chain. Its stationary law is m_R exp(-β C2(R)): the exponent is the β in its acceptance rule, which the source leaves free, and the weight is the measure m that the proposal is reversible for, which the source assumes. The Gibbs parameter follows as t = 2π × (g²/2) × κ = 4π²κα.
- **2π** is the modular period (IMPORTED).
- **g²/2** is the electric coefficient of GL's action (EXACT, CC row B1).
- **κ**, the shape number, is scale-free (EXACT).

The source's declared values (weight d_R, κ = 1) are the only pair that closes. Every other derived variant misses v by a factor of 6 or more (NOT BLIND).

**Single item still missing:** the collar element as a source object. It needs two properties:
- it holds the gauge label one-sidedly at the cut, with each irrep of G once (this gives weight power 1);
- the label's flux crosses the patch with proper cross-section L² (this gives κ = 1).

The source supplies both only by declaration: EH-2 for the first; for the second, "A = 2π" (gauge paper) and "electric energy (g²/2)C2 at unit distance from the cut" (fine-structure paper, RER commit 5fe553bfc, which landed at 11:47 during this lane).

1. **The chain as the source defines it (task 1).** It is in the screen paper's section "Edge heat-kernel / Casimir theorem" (commits 10d88f502 to c74a7f5e2^). The 2026-05-17 rewrite removed it; gauge paper line 1239 still cites it.
   - Moves: a proposal "induced by the local generator menu", with the declared condition d_a q_ab = d_b q_ba.
   - Acceptance: min(1, exp(-β ΔC2)). Penalty: C2. β: "the overlap inverse temperature parameter of the branch".
   - Exact rational checks on SU(2) (2j ≤ 12) and SU(3) (p,q ≤ 4 and p+q ≤ 6), each at two values of β:

   | Proposal | Weight power | Source's condition |
   | --- | --- | --- |
   | Link operator D^(1/2) from GL's plaquette term; q(j→J) = d_J/(2d_j) by exact Clebsch-Gordan | 2 | fails |
   | Symmetric hop on a one-sided register (Schwinger pair; N(d+d') for SU(3)) | 1 | holds |
   | Symmetric walk on the labels | 0 | fails |

   - In every row the exponent equals the acceptance's β exactly.
   - The source's own S3 menu (translations, face moves, Refresh) commutes with every electric-sector projector. It never changes a sector, so the chain is reducible and every law is stationary.
2. **Where the exponent comes from.** The native repair is uniform resampling at constant energy. Applied to a collar label plus a bath of N units, it gives the label d^w Ω_bath(E − E_R). This tends to d^w exp(−β_bath E_R): the log deviation falls from 4.09 to 0.00033 for N = 10² to 10⁶, and the fitted power tends to w. So the power is the register's own count and the exponent is the bath's inverse temperature.
3. **The Gibbs parameter (task 2).** In a static patch of radius L, take the flux from the horizon to the observer with constant cross-section A⊥.
   - Killing energy (g²/2)C2·L/A⊥ at β = 2πL gives t = πg²L²/A⊥.
   - The 2D heat time on the swept Euclidean hemisphere (area 2πL²) gives the same number exactly.
   - "A = 2π" is that hemisphere measured in units of A⊥ = L².
   - Other elements: adjacent cube 1/2, half link 1/8, port cap 3/π, hemispherical cap 1/(2π).
4. **The executable observer (task 3).**
   - The native one-sided register is the twelve-port density module of the 60 rotations. It holds the irreps (1, 3, 3', 4, 5) with multiplicities (1, 1, 1, 0, 1). The image algebra has dimension 44, and the projector ranks are d_R with constant diagonal d_R/12.
   - Native repair K_12 = I − L/60 is doubly stochastic. Every classical port law has p_R = d_R/12: weight power 1, exponent 0.
   - A positive exponent appears only from a supplied count: t = mean attempts/60 in the Poissonized semigroup, or t = 1/30 in the source's heralded filter. That filter's law, d_R(1−λ_R/120)⁴, sits 1.2 to 3.1 percent off the Casimir-linear exponent.
   - For the gauge group the observer has no one-sided register; GL's links are two-sided. A tracial count of a patch side's extended space gives per-cell power 1.977 at 128 cells, tending to 2.
5. **Scale (task 4).** With κ scale-free, α is read at μ = 1/√A⊥ = 1/L. The construction does not select L; CA's premise F sets L = 1/m_Z(μ).
6. **Closure rows (task 5, source side):**

   | Row | (w, κ) | 1/α_U | v (GeV) |
   | --- | --- | --- | --- |
   | V1 | (1, 1) | 24.3166 | 246.60 (reproduces the producer exactly) |
   | V2 | (2, 1) | 16.7135 | 3.8e7 |
   | V3 | (1, ½) | 11.4378 | 1.5e11 |
   | V4 | (2, ½) | 7.7991 | 4.6e13 |
   | V5 | (1, 3/π) | 23.1870 | 1454 |
   | V6 | (1, 1/(2π)) | no root | |

   Moving κ by ±0.001 moves v by ∓4 percent.
7. **NOT BLIND (run once, last).**
   - V1 against measurement: v 1.0015, α_s 1.0028, sin²θ_W 0.9979, 1/α_em 1.0028.
   - The κ that closes with measured couplings is 0.99992 (0.9986 to 1.0013 from α_s) for w = 1, and 1.4585 for w = 2.

## EVIDENCE

Every file is in `work/CG/`; each job ran in under 20 s.
- `cd RER && PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=.:<CG> python <CG>/cg_chain.py` → `cg_chain.json` (C1–C7)
- the same form for `cg_observer.py` → `cg_observer.json` (C8; calls RER's `edge_generator_audit()` and `prepared_edge_gibbs()`)
- run in CG: `cg_beta.py` → `cg_beta.json`; `cg_cut.py` → `cg_cut.json`; `cg_closure.py` → `cg_closure.json`; `cg_not_blind.py` → `cg_not_blind.json`
- `closure_check_copy.py` is an unchanged copy of the coordinator's producer; its output `closure_check_copy.out` matches the original byte for byte.
- `CANDIDATES.md` holds the registered list (11:41), the C9 addendum (11:49) and the run log; `COLLAR.md` is the full write-up.
- Nothing was written outside `work/CG`. The untracked `model/lepton_register_round/` in RER belongs to another session.

## WHAT THIS DOES NOT ESTABLISH

- **No source construction of either property.** Neither the one-sided gauge register nor A⊥ = L² is built anywhere in the source. The constant cross-section L² is a model: near the observer it would need more than the full solid angle (for r < L/(2√π)).
- **The bath temperature is argued.** Equating it with the patch's KMS temperature is ARGUED, and 2π and β_GH are IMPORTED. The source's own receipt marks its attempt parameter as not modular time.
- **C7 and C9 are models.** C7 uses an Einstein bath. C9 uses SU(2) with one interior vertex, and its power 2 is reached only asymptotically.
- **The w = 2 rows use one log d per label** (CC's convention). A register with two hidden indices would count two; that reading came up after the comparison and has no computed value.
- **Inherited declarations.** The rows keep the declared slopes and the declared forms of M_U and v.

## NEXT

1. **Build the one-sided gauge register** on the executable observer: a carrier holding each irrep of G once at each cut cell, coupled to GL's links by the charged hop of C4. Then test whether constant-energy repair leaves it with power 1, or whether the observer's record fixes the interior end of each label's flux.
2. **Derive A⊥.** Compute the minimal Killing energy of a label's flux with GL's action, comparing a fixed-cross-section tube with a field that spreads. The abelian field that spreads has boost energy of order g²Φ²/(k² ln(1/kε)) (ARGUED from the solution x K₁(kx)), so it is not scale-free; a fixed tube is.
3. **For CA:** add the register's Higgs term to this chain and follow one factor through m/μ = 1. This tests premise F.
4. **Note for the audit team:** gauge paper line 1239 cites a chain that the screen paper's 2026-05-17 rewrite removed, and that chain's kernel condition is itself the weight-power hypothesis.
