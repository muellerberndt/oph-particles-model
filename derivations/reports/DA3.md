## RESULT

Neither item is derived from the source. The lepton scale y_J is not fixed by any clock examined. The coin question resolves differently than I reported last round: the coherent law gives the balance with no coin, and the 2/9 phase additionally needs two independent objects.

**The distinction you asked me to state.** My A-clock reading treats each family mode's expected read count per tick on the native menu as its energy. That is a property of the state on the consensus clock. LNAT instead tested eigenvalues of the coherent Hamiltonian H = I − Re W. Its spectrum is {0, 2, 1/15, 1/10, 1/6, (5 ± √5)/60}, which has no 2/9 and gives equal energies on the family band. The two results do not contradict each other. Mine holds only under premise B: one nat per read, continued to one radian per read, so that an expected count of n reads per tick is a phase of n radians per tick. Premise B is conditional throughout.

**Item 2, the lepton scale (not derived).**
- **Clock and mass definition.** The audit's `chiral_joint` clock has one generation and declared couplings (y_e = ω = κ = 1). It reads a mass as an isolated charged line above the neutral ground with a positive residue, which is a pole definition.
- **What that means for zeta.** Zeta is a pole shift, compared with pole masses. The target stays δ = 2/9 − 1.75148e-7 with Q = 2/3.
- **Junction computation (EXACT, 320-state block).** The one-tick conversion probability is 0.215133 at y_e = 1 and about 1.839 y_e² at small y_e. Candidates J0 to J5 come out 20 to 127 times too large. All of them depend on the declared y_e, so the clock does not fix the junction rate and I give no masses in GeV.
- **Under premise B (NOT BLIND).** The needed reads per tick are n_J = 0.0076364 in units of v, or 0.0107994 in units of v/√2. Of the ten entries, only one passed:

| Candidate | n_J | M / measured sum, unit v | unit v/√2 |
| --- | --- | --- | --- |
| B1 | pq = 1/72 | 1.819 | 1.286 |
| B2 | 2^-7 = 1/128 | 1.023 | 0.723 |
| B3 | (2/9) pq | 0.404 | 0.286 |
| B4 | p² = 1/144 | 0.909 | 0.643 |
| B5 | q² = 1/36 | 3.64 | 2.57 |

  B2 at unit v is the only pass, and it is a fit with no weight. I estimated its value before writing the list, and the unit was chosen between two options.

**Item 1, the coin rule.**
- **Correction to last round.** I withdraw the K4 sentence that said the coherent program's orientation sum gives Q = 1/2. That double-counted the hold.
- **What the coherent seam event gives (EXACT).** On an active seam, the agreeing branch (record 0) and the repair branch (record 1) each have weight 1/2. This holds for both load positions and both address orientations. The repair amplitude carries the sign of orientation times source endpoint. On the native code a seam is active with probability 1/3, so the weights are agree 1/6 and repair 1/12 + 1/12, on both the C and E seams.
- **Consequence for the coin.** The record bit gives |b|/a = 1/√2 with no coin. The E-coin-0 reading from last round (K1) is the native menu's numerical shadow of this agreeing half; both weigh 1/6. LNAT reached the same weights.
- **Where the phase comes from under B.**
  - K5, hold from the agreeing half of the E object and rotations from the repair components of the C object, read independently in one tick: P(xor) = 2/9 for both branches.
  - K6, everything from one seam event: P(xor) = 1/4. That gives m_μ/m_e = 2710, so it is excluded (NOT BLIND).

## EVIDENCE

- `sh work/DA/run_all.sh` rebuilds every result file in about 32 seconds.
- Candidates and outcomes are in sections 8 and 9 of `work/DA/CANDIDATES.md`.
- This round's script and output: `work/DA/da_round3.py` → `round3.json`. The junction and native-menu coin results are in `junction_clock.json` and `coin_rule.json`.

## WHAT THIS DOES NOT ESTABLISH

- Any value of y_J, or any lepton mass in GeV.
- Premise B itself.
- The two-object family register. It still needs the three pieces LNAT named: a register on which the repairs act as g and g⁻¹, a readout that keeps one orientation, and the chiral phase.

## NEXT

1. Build the two-object register: the C repair components act as g^±1, the E agreeing half acts as the identity, and both objects are read independently in one tick. Check whether the one-orientation readout survives the consensus.
2. Define which seam record is the 3 + 3 → 0 junction, together with its read count per tick.
3. Compute zeta as a pole shift, which needs a three-family clock.
