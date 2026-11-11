## RESULT

No hadron mass comes out of the source alone. The furthest complete chain is m_h/E* = c_h × Λ^(3)/E*:
- **Λ^(3)/E* = 2.785e-20** (Λ^(3) = 0.3400 GeV). CONDITIONAL on the D10 colour coupling.
- **c_h is a number of QCD.** It is IMPORTED from lattice results. It applies to the source only if the source's derived gauge sector below the cell scale is QCD, which has not been shown.

With that status, the nucleon and rho rows are complete. Pion, kaon and the n - p splitting are OPEN, because QM supplies no quark mass. QM's furthest derivation, translated into hadron terms, is EXCLUDED. The source's own cut coupling puts every hadron at 4e4 to 9e15 GeV, so it is EXCLUDED too.

**Housekeeping (not my doing).** At 23:18 the RER working tree moved from `oph-meta/reverse-engineering-reality` to `oph-meta/repair-law/reverse-engineering-reality`. I ran RER code from the new place, read only, and nothing in RER changed. The RER path in CAMPAIGN.md is stale until it is moved back.

**Step 1: inputs and their status**

| Input | Status |
| --- | --- |
| E* = 1.22089e19 GeV | Declared display unit; the outputs are m/E* |
| α_3(m_Z_run) = 0.118336 at 91.588 GeV | CONDITIONAL: D10 at P_fwd. Declared parts: slopes (33/5, 1, -3) as a SUSY proxy, pixel closure at m_Z, M_U form. Thomson transport 2h uses phenomenological masses (MAUD) |
| 4-loop running, 3-loop decoupling | IMPORTED (perturbative QCD) |
| m_b(m_b) = 4.18, m_c(m_c) = 1.27 GeV | IMPORTED, measured; source OPEN. d ln Λ/d ln m = 0.092 for m_b, 0.115 for m_c |
| Continuous SU(3) links | CONDITIONAL. GL M1 gives S(U(3)×U(2)) from port phases, but no law writes those phases. Today's native group is finite (EXACT) |
| Plaquette action, equal bare couplings, 1/α(E_cell) = 16.2453 | CONDITIONAL: GL A1, with the overall value resting on DC's premises |
| One Dirac cone per species (b0 = 7) | CONDITIONAL: T3 member B, whose seam weight is declared |
| Running from E_cell to m_Z with the source's content | OPEN; it fails (cut rows below) |
| m_u, m_d, m_s | OPEN (QM: x = 1/2, Y_u ∝ Y_d ∝ lepton circulant) |
| θ̄ | Zero in every import; source OPEN. A Hermitian mass matrix with positive spectrum has arg det = 0 (EXACT) |

**Step 2: imports.** Values below were read in the original papers unless marked; scheme and scale setting are in `CANDIDATES.md` B. All of them are numbers of QCD.
- Λ^(3)_MSbar = 341(12) MeV. ALPHA 17 (Bruno et al., PRL 119, 102001, eq. 17). Nf = 3; scale from f_πK = 147.6 MeV via μ*_ref = 478(7) MeV.
- Cross-checks for Λ^(3): FLAG 2024 gives 338(10) MeV (eq. 402). ALPHA 22 gives 336(12) MeV; that value is as quoted in FLAG 2024 eq. (330), and I did not open the primary paper.
- m_N = 936(25)(22) MeV and m_ρ = 775(29)(13) MeV. BMW 08 (Science 322, 1224, Table 1), Ξ set. Nf = 2+1; quark masses tuned to M_π/M_Ξ and M_K/M_Ξ; scale from M_Ξ.
- B(2 GeV) = 2.682(36)(39) GeV, f = 122.72 MeV, Λ_3 = 653 MeV. BMW 13 (PRD 88, 014513, eqs. 17, 18, 34); scale from f_π.
- n - p = 1.51 MeV, split into QCD part 2.52(17)(24) MeV and QED part -1.00(07)(14) MeV. BMW 14 (Science 347, 1452).
- σ_πN = 42.2(2.4) MeV and σ_s = 44.9(6.4) MeV. FLAG 2024 Nf = 2+1 averages.

DE's open item 4 is settled. The repository's 0.338 is FLAG 2024's Λ^(3), quoted at α_s = 0.1183, and the RER chain gives 0.3383 GeV at that α_s (0.3323 at 0.1179). So 2.775 is the measured nucleon mass divided by a lattice average, with no lattice nucleon computation in it.

**Steps 3 and 4: rows (primary set C-1, D10 unit)**

| Row | Formula | Value | m/E* | Status |
| --- | --- | --- | --- | --- |
| Λ^(3) | D10 α_3, 4-loop chain | 0.3400 GeV (threshold corners 0.3251 to 0.3547) | 2.785e-20 | CONDITIONAL |
| nucleon, also p and n | c_N Λ, c_N = 2.745(137) | 0.933 ± 0.047 GeV (corners 0.892 to 0.973) | 7.645e-20 | CONDITIONAL × IMPORTED |
| n - p | 0.984 (m_d - m_u) - 1.00 α/α_ref MeV | none | | OPEN (needs m_d - m_u) |
| pion | M_π² = 2 B m_ud, B = 7.865(318) Λ = 2.674 GeV | none | | OPEN (needs m_ud) |
| kaon | M_K² = B (m_s + m_ud) | none | | OPEN (needs m_s) |
| ρ(770) | c_ρ Λ, c_ρ = 2.273(123) | 0.773 ± 0.042 GeV (corners 0.739 to 0.806) | 6.330e-20 | CONDITIONAL × IMPORTED |
| QM's furthest result as mesons (m_u = m_d, m_s/m_d = 206.77) | M_K/M_π = sqrt((m_s/m_ud + 1)/2) | 10.19 | | EXCLUDED |
| QM's furthest result for n - p | QED part only | -1.00(16) MeV | | EXCLUDED: wrong sign |
| Source cut coupling (9 rows) | from 1/α_3(E_cell) | colour scale 1.6e4 to 3.3e15 GeV | | EXCLUDED |

- **Alternative import sets:** m_N 0.950 / 0.942 / 0.947 GeV and m_ρ 0.776 / 0.780 / 0.784 GeV (Ω set; FLAG Λ; ALPHA 22 Λ).
- **The nucleon barely depends on the open quark lane:** shifting m_ud and m_s by 10% moves m_N by 8.7 MeV (0.93%, Feynman-Hellmann).
- **All rows depend sharply on the colour slope.** With the closure at the cut, d ln Λ/d b3 = -3.27, so every hadron mass moves 3.3% per 0.01 in Δb3. The printed Δb3 = 3.97 would give +10.3%.
- **With the D10 m_Z closure re-solved instead,** the slope is only +0.50, but m_Z_run drops to 80.9 GeV at Δb3 = 3.97.
- **The SM slope b3 = -7** at the D10 α_U puts the colour pole at 8.2e6 GeV.
- **What the D10 α_3 would need at the cell:** 1/α_3(E_cell) = 27.2, 39.6 or 52.1 for b3 = -3, -5 or -7 (β_SU3 = 13.0, 18.9, 24.9). The source gives 16.25 (β = 7.76).
- **Z3 scale clash (ARGUED):** H4's area law, sqrt(σ) = 0.173 per cell, is 2.1e18 GeV, which is 6.2e18 times Λ^(3). A light nucleon needs a centre-flux density of order 2e-39 per plaquette; the census gives 0.0898. H4's confined phase is cell-scale confinement, the wrong phase for GeV hadrons.

**Step 5: comparison (NOT BLIND)**
- **Nucleon:** -0.60% against (m_p + m_n)/2 (pull -0.12), -0.53% against p, -0.67% against n.
- **ρ:** -0.32% (pull -0.06).
- **Only one source number is actually tested:** Λ^(3)(D10)/Λ^(3)(ALPHA 17) = 0.997. Equivalently, the D10 α_3 = 0.11834 against the lattice 0.1183(7). The ratio c_h reproduces experiment by construction, so the agreement is retrospective.
- **QM's furthest result:** M_K/M_π comes out 2.84 times the measured 3.59, and m_n - m_p is 14.7σ from the measured +1.293 MeV.
- **Quark masses QM would need (D10 unit, 2 GeV):** m_ud = 3.41 MeV at LO and 3.49 MeV at NLO (2.86e-22 E*); m_s = 88.5 MeV at LO; m_s/m_ud = 26.0 at LO (lattice 27.2 to 27.4).
- **Closure check:** at FLAG quark masses, LO GMOR overshoots the kaon by 2.3%.

## EVIDENCE

RER is the moved tree under `repair-law/`. HD is `work/HD`.
- `cd <RER>/code/particles && PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=.:<HD> /tmp/oph-completion-venv/bin/python <HD>/hd_lambda.py <HD>/lambda.json` (12 s).
  - It uses the RER producer unchanged.
  - `d10_copy.py` is a verbatim copy of the legacy D10 producer with the slopes varied; it reproduces α_3 to 7e-12.
- `cd <HD> && PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python hd_rows.py lambda.json rows.json` reads no measured value.
- `... hd_compare.py rows.json lambda.json compare.json` is NOT BLIND. It reads PDG 2026 values from RER `code/particles/data/particle_reference_values.json`; the charged π and K values were typed from memory.
- `world_chain_check.log` holds the 0.338 reconciliation.
- `CANDIDATES.md` was registered before any value. Appendices E and F are two dated added tries, and section A records the looks taken beforehand.

## WHAT THIS DOES NOT ESTABLISH

- **Any source-only hadron mass, or that the source's gauge sector is QCD.**
- **That the D10 α_3 is the source's coupling.** It rests on declared slopes and closure, and the matching of the one-loop D10 α_3 to MSbar was not computed.
- **Precision of c_h.** It mixes two scale settings (M_Ξ and f_πK), is about 5% wide, and carries measured tuning inputs. The ρ value is a finite-volume resonance mass, not a pole.
- **Kaon and pion precision.** NLO SU(3) terms and the electromagnetic meson splittings were not imported.
- **The Z3 statement is ARGUED**, and θ̄ = 0 in the source is not shown.

## NEXT

1. **Colour coupling (DC, GL, EB, SC).** Supply 1/α_3(E_cell) of about 27 to 52, or derive Δb3 = 4.00 to two decimals. This single number moves every hadron row.
2. **Quark masses (QM).** Supply m_ud and m_s at 2 GeV; test them through M_K/M_π. The n - p splitting needs m_d - m_u ≈ 2.6 MeV, and above 1.5 MeV for hydrogen to be stable (NOT BLIND).
3. **QCD premises.** A law that writes the port phases (GL M1), the port-level origin of member B's seam weight (T3), and θ̄.
4. **Owner decision.** In RER, 2.775 can be replaced by c_N = 2.745(137) with these citations. A tighter c_N would come from a nucleon mass and Λ on one scale (CLS ensembles in √(8t0)), without building ensembles.
5. **Coordinator.** Restore the RER path, or update CAMPAIGN.md.

Files are in `work/HD/`; `rows.json` is the input for the S3 web app.
