## RESULT

**Short answer.** The source's gauge sector runs with the continuum coefficient, and the colour bound fails for both censuses.
- **Coefficient:** on the lattice of the source action the one-loop coefficient per factor is −(11/3)·C_A within 1e-4, i.e. (−11.0001, −7.3334, 0) for SU(3), SU(2), U(1). There is no edge-sector term, so the edge route is retired.
- **MSbar coupling:** 1/α_3(E_cell) = 10.03 (5-trace) or 9.03 (15-trace) for the Hamiltonian, with a gauge matching computed here, where GL's value used imported constants.
- **Verdict:** SC's bound needs 18.24 (vector-like census) or 42.55 (Standard Model census). Every row fails.
- **Menus M1 and M2:** they hold 1.3 % and 11 % of the full register's link vacuum at the cell coupling, colour has no ordered link, and they lower 1/α_3 further.

**1. Theory (step 1, EXACT).** The definition was on file before computing (`CANDIDATES.md`, section A).
- H = (g²/2)·Σ C + β_F·Σ[1 − Re tr_F(Ũ₁Ũ₂Ũ₃†Ũ₄†)/N_F], Ũ = P_M·D^F·P_M, Gauss law with the 12 generators, g² = 0.77354.
- The menu theory is the compression P·H_full·P, with the same gauge action as the full register.
- On class functions the link operator is the fusion matrix; this agrees with the audit's explicit 119-state link on all 37 channels to 2e-16.
- Menu sizes are 119, 3380, 45500; the largest Casimir is 2.1 (M1) and 5.4 (M2).
- Only 1 of 119 states (M1) and 119 of 3380 (M2) lie below the menu boundary.

**2. Coefficient per factor.**
- **Method:** vacuum energy in a uniform flux along a generator of one factor. Checks:

  | Check | Result |
  | --- | --- |
  | plaquette quadratic form against finite differences of the SU(2) action | 1.9e-6 (sign control 1.57) |
  | gauge directions are zero modes | 2.6e-15 |
  | 3D separation into a 2D spectrum plus free directions (6×3×4 torus) | 2e-14 |

- **Full register (MEASURED):** the fitted logarithm over the continuum 11/(48π²) per charged field is:

  | Clock | Ratio |
  | --- | --- |
  | Hamiltonian | 1.000007 ± 0.00009 |
  | isotropic Euclidean | 1.000002 ± 0.00003 |
  | electric background, time step a/16 | 0.99987 ± 0.0002 |

  - Fluxes ran from 0.39 down to 0.0008.
  - The charged-field functions of the 5-trace and the 15-trace are identical (2e-16), and Σq² = C_A/2 exactly.
  - No generator carries hypercharge, so b₁ = 0 exactly.
  - EB's D* shift would give ratios 0.981 and 0.961; the supplement's would give 0.64 and 0.40. Both are excluded.
- **Menus (MEASURED, product-state level):** the loop expansion does not apply at any menu up to M4.

  | | M1 | M2 | M3 | M4 |
  | --- | --- | --- | --- | --- |
  | share of the full register's link vacuum, 5-trace | 0.013 | 0.110 | 0.366 | 0.678 |
  | same, 15-trace | 0.037 | 0.233 | 0.578 | 0.850 |

  - The pre-registered threshold was 0.99. GL's 99.88 % refers to the edge distribution at t = 2.43; the Hamiltonian link vacuum sits at ⟨C⟩ = 10.1 (product state) to 12.3 (harmonic), with rms 6Y = 7.9.
  - **Exact caps, 5-trace:** the triplet-block mean link is at most 0.308 (M1) and 0.519 (M2). One plaquette reaches at most 0.325 and 0.539, while the full register has 0.63 at one loop.
  - **Product states at the cell coupling:**
    - M1, 5-trace: confined.
    - M2, 5-trace: weak and hypercharge blocks ordered (u₂ = 0.656), colour blocks at zero.
    - 15-trace: colour blocks at zero for M1, M2 and M3.
  - **Bare 1/α needed for colour order:** 104 (M1, 5-trace), 20.3 (M2, 5-trace), 34.4 (M2, 15-trace). M1 with the 15-trace never orders down to g² = 0.01. The full register orders from 11.7 (5-trace) and 15.1 (15-trace).
  - Where a menu keeps massless gauge fields, the mean link rescales stiffness and frequencies together, so the coefficient stays the continuum one (ARGUED from exact gauge invariance). The menu changes the cell coupling and the wave speed only.

**3. MSbar couplings at μ = E_cell (1/α₁, 1/α₂, 1/α₃), full register.**

| Trace | Hamiltonian | time step a/2 (Euclidean) | isotropic Euclidean |
| --- | --- | --- | --- |
| 5 | 13.495, 12.185, 10.031 | 12.773, 12.080, 9.840 | 12.790, 12.288, 10.152 |
| 15 | 13.245, 9.935, 9.030 | 12.457, 9.239, 8.577 | 12.475, 9.461, 8.896 |

- **Colour shift, Hamiltonian:** −6.048 from the single factor (Λ_MSbar/Λ_H = 31.65) plus cross tadpoles of −0.167 (5-trace) or −1.167 (15-trace). Fit and extrapolation uncertainty is ±0.002.
- **Computed here:**
  - the charged-field constants: m_σ = −0.138745, m_τ = −0.104741 (time steps a/2 to a/16, extrapolated), m = −0.107456 isotropic;
  - the plaquette fluctuations;
  - the group traces tr_F(Ĉ·H²)/κ_F = 7/5, 9/10, 11/10 (5-trace) and 9/5, 9/5, 6/5 (15-trace);
  - the MSbar constant c = 1.0364764, derived and confirmed numerically.
- **Imported:** the bare 16.2453 (DC, GL), the E* unit, and GL's convention a = 1/E_cell.
- **Validation against values recalled from memory:**
  - Isotropic: Λ_MSbar/Λ_L = 19.823157 and 28.809334, against 19.823143 and 28.809314 (7e-7). This reproduces GL's 10.15 and 8.90 with no imported constant.
  - Hamiltonian: Λ_H/Λ_E = 0.8434 (SU(2)) and 0.9103 (SU(3)), against recalled 0.84 and 0.91.
  - GL's cross tadpoles are reproduced to 1e-9.
- **Menus:**
  - Mean-field rule: 1/α₃ = −0.83 (M1 and M2, 5-trace) and 0.35 (M1 to M3, 15-trace).
  - Exact plaquette bound: 1/α₃ ≤ 2.67 (M1) and 6.81 (M2) for the 5-trace; 3.25 and 7.22 for the 15-trace.

**4. Verdict and running (one loop, no thresholds).**

| Census | Needed | 5-trace | 15-trace | Colour pole, 5-trace / 15-trace |
| --- | --- | --- | --- | --- |
| vector-like, b₃ = −3 | 18.24 | 10.03 (short 8.21) | 9.03 (short 9.21) | 7.2e9 / 5.8e10 GeV |
| Standard Model, b₃ = −7 | 42.55 | short 32.5 | short 33.5 | 1.2e15 / 2.9e15 GeV |
| B, b₃ = −5 | 30.40 | short 20.4 | short 21.4 | |

- The largest |b₃| these cell values allow is 1.65 (5-trace) and 1.49 (15-trace); the bare value allowed 2.67.
- At the chain's m_Z (91.588 GeV), 5-trace Hamiltonian row: 1/α_i = (64.01, 17.38, −8.68) for the vector-like census and (39.07, −7.56, −33.63) for the Standard Model. Neither gives outputs.
- Moving the matching point cannot help: reaching 18.24 would need ln(a·E_cell) = 17.2.

**5. Comparison (NOT BLIND, read once after `bf_running.json`).**
- Slopes needed to reach (59.02, 29.58, 8.47):
  - from the bare values: (6.86, 2.14, −1.25);
  - from the matched 5-trace Hamiltonian row: (7.30, 2.79, −0.25);
  - from the matched 15-trace Hamiltonian row: (7.34, 3.15, −0.09).
- The measured α_s needs 1/α₃(E_cell) = 27.2 (vector-like) or 52.1 (Standard Model).
- Vector-like census at 91.1876 GeV: 1/α₁ = 64.0 (+5.0) and 1/α₂ = 17.4 (−12.2).

**6. Derived side result (MEASURED, one loop).** With one coupling for the electric and magnetic terms, the wave speeds differ per factor.
- Hamiltonian, 5-trace: c − 1 = (−0.169, −0.088, −0.140) for U(1), SU(2), SU(3).
- Hamiltonian, 15-trace: (−0.185, −0.226, −0.201).
- The spread between factors is 8.1 % and 4.2 %; at time step a/2 it is 2.8 % and 2.5 %; it is zero for the isotropic lattice.
- GL's single cone therefore holds at tree level only.

## EVIDENCE

Everything is in `work/BF/`. Run each there with `PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python <script>`:
- `bf_register.py` (1 s) writes `bf_register.json`.
- `bf_meanfield.py` (7 s) writes `bf_meanfield.json`.
- `bf_threshold.py <5|15> <1..4|ref>` (5 to 75 s per call) appends to `bf_threshold.json`.
- `bf_bg_validate.py` (26 s) writes `bf_bg_validate.json`.
- `bf_bg_compute.py iso` (79 s), `aniso 2|4|8|16` (50 to 70 s each) and `variant` (57 s) write `bf_bg_data_*.json`.
- `bf_bg_fit.py` (1 s) writes `bf_bg_fit.json`.
- `bf_checks.py` (24 s) writes `bf_checks.json`.
- `bf_running.py` writes `bf_running.json`; `bf_compare.py` (NOT BLIND, run once at 08:35) writes `bf_compare.json`; `bf_speed.py` writes `bf_speed.json`.
- From the public checkout: `PYTHONPATH=.:<BF> python <BF>/bf_checks.py audit <BF>/bf_checks_audit.json` (5 s).
- Shared code: `bf_lib.py`, `bf_bg_lib.py`. Derivations: `DERIVATION.md`.
- `CANDIDATES.md` was written before any value, with four timestamped addenda. Two of them correct my own earlier expectations: the first version omitted the electric part of the matching, and I had the orientation of the recalled Hamiltonian ratio wrong.
- Two first script versions ran past two minutes and were stopped; the delivered versions are the ones listed.
- The checkout was read at `repair-law/reverse-engineering-reality` (22478211a). At 08:36 it was back at `reverse-engineering-reality` (3ee5e0652), moved by another process. `git status` is clean and nothing was written there.

## WHAT THIS DOES NOT ESTABLISH

- **Matter in the matching:** the routing fermions and the register Higgs are not included. Meeting the bound would need a fermion constant k ≥ 6.45 (vector-like) or 51 (Standard Model) in 1/α₃ = 10.03 + (b_f/2π)·k. The measured α_s would need 13.5 or 66 (NOT BLIND).
- **Menus:** the M1 and M2 results are product-state (mean-field) statements plus exact caps. The true ground state of these quantum link models, their phase, and a coefficient computed inside them are not established. The mean-field menu correction is an estimate.
- **Clock:** the a/2 row is a Euclidean lattice with Wilson time-like plaquettes. A real-time split step of the Hamiltonian with step 1/2 is not computed. The three clocks span 9.84 to 10.15 (5-trace) and 8.58 to 9.03 (15-trace).
- **Order:** everything is one loop. At g² = 0.77 the full register's plaquette deficit is 0.37 to 0.49, so two-loop terms are not negligible.
- **Inputs:** the bare 16.2453, a = 1/E_cell and the E* unit are inherited. The Wilson and Hamiltonian ratios used for validation are recalled from memory, with the orientation of the latter not remembered.
- **Wave speeds:** first order in g², with shifts of 9 to 23 %.

## NEXT

1. **Routing-fermion constant.** Apply the same uniform-flux method to the CF-1 tick: eigenphases of the tick on a magnetic cell, sea energy, constant term. This also counts the cones that run. It can close the gap only if k ≥ 6.45.
2. **What the bound now requires.** With the computed shift of −6.21 (5-trace) or −7.21 (15-trace), the cut closure would have to give a bare 1/α ≥ 24.45 or 25.45 for b₃ = −3, or the census |b₃| < 1.65 or 1.49. That is the requirement to pass to DC, SC and DB.
3. **Register size.** If the source's link is literally M1 or M2, colour is not perturbative at the cell. A menu that carries the weak-coupling vacuum at this coupling must reach beyond M4 (Casimir above about 30).
4. **Wave-speed split.** Test it against GL's one-cone statement: either a space-time symmetric field step or a per-factor ratio of electric to magnetic coupling.
