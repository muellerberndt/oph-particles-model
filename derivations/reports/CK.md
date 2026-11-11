## RESULT

**"One radian per read" is not derived from the stack.** It reduces to one undeclared item: unit clock time per tick in a continuous clock whose generator is the read projector with coefficient one. Under that premise the phase is exactly 2/9, the masses are read on the same clock (energy reading, Q = 2/3), and a branch keeps its clock energy during a virtual excitation. The theorem with its four premises is in `THEOREM.md`.

**1. Status of the radian.**
- **Modular routes fail (EXACT).** The stack fixes one nat to one radian per unit modular parameter (KMS at β = 1, proved in Lean), so LNAT2's imported Wick step is a stack theorem. The input "one nat per read" is what fails:
  - A binary read of probability p carries modular energy log((1−p)/p): 2.3979, 1.6094, 1.2528 for p = 1/12, 1/6, 2/9.
  - One nat needs p = 1/(1+e), which is transcendental.
  - No common modular parameter per tick serves all read types (0.417, 0.621, 0.798).
  - The area law's crossing count is a deterministic integer, so its modular flow is the identity.
  - The 2π of the cap flow is a supplied receipt, and KMS selects no temperature.
- **What carries the phase.** Two pieces together:
  - The energy-clock identity ⟨I − Re U⟩ = P(record 1). It holds exactly on the repository's `Observer.step` for blank records with the uniform address: 1/12 on all 12 ports, and 8 random inputs.
  - A continuous clock. Coupling J ⊗ Q (Q = exclusive read, ⟨Q⟩ = 2/9) as N fresh weak rounds gives [(1−P) + P·e^(−iJ/N)]^N, which tends to exp(−i(2/9)J) with error at most 1/N.
- **Finite N.** θ_N = 2/9 − 35/(2187 N²), and the current branches keep amplitude Z_N = exp(−7/(81N)). One strong kick per tick gives 0.205334 (μ/e = 19.06, excluded).
- **Stack support for a continuous clock.**
  - Sole time convention U(t) = exp(−itH): `particle_common_contract/PROOF.md:90`.
  - Primary clock in ħ = 1 units: `particle_primary_mass_readout/PROOF.md:204`.
  - Declared continuous evolution with coefficient one: `coherent_defect_wave/energy/PROOF.md:17`.
  - Weak-round theorem ‖A0(h)^N − exp(−itX⊗Y)‖ ≤ t²/N, with Y the effect of the read: `KOIDE_SOURCE.md:80–100`.
- **What the stack refuses.** Equating clock time with ticks (`KOIDE_SOURCE.md:147`; `PhysicalCalibrationImport.lean:80`, "No source-derived clock"). That item, t = 1 per tick, is the radian.
- **Which read is coupled is FR's choice, not the clock's.** The joint tick's energy clock counts 11/36 (at least one record 1), which lies outside the positive chamber. The exclusive count is 2/9 under both read conventions, because the agreeing and repairing halves of an active seam weigh 1/6 each.

**2. Mass clock: K1, the energy clock** (NOT BLIND comparison; measured μ/e 206.768283, τ/e 3477.370 ± 0.169).

| Clock | Q | μ/e | τ/e | Verdict |
|---|---|---|---|---|
| K1 energy, m ∝ λ² | 2/3 | 206.770316 | 3477.4728 | +9.83 ppm, +0.61σ |
| K2 Floquet | 0.478035 | 14.3795 | 58.9701 | excluded |
| K3 Euclidean transfer | → K1 as c → 0 | 206.770322 at c = 1e-6 | 3477.4745 | equals K1 only in the continuous limit |
| K4 modular | 0.483208 | 49.64 | 141.51 | excluded |

Grounds for K1:
- The stack defines rest mass as the coherent rest angular frequency of exp(−itH) (`executable_observer_construction.tex:4378`, `InternalClockRestFrequency.lean`).
- The lepton lane reads eigenvalues of the weak-kick generator Y (`PHASE_AND_PREMISES.md:133,150,156`). On FR's analyzer, Y = M†M = (2/9)C(θ)².
- The coherent-defect clock refuses Floquet phases as energies (`energy/PROOF.md:21–23`).
- The energy and Floquet values are not affinely related on the walk spectrum (smallest determinant 2.2e-4), and one tick has one clock.
- DR's memory pole is 2y²/ω at second order, quadratic in the amplitude.

**3. DR's rule: the branch keeps its clock energy.**
- **Why.** The clock is a Hamiltonian term −θJ in a time-independent generator, and J depends only on the record r_C and address o_C. The transport link and the load-coupled memory act on other registers, so they commute with J and exp(−i(H₀+V−θJ)t) = exp(iθJt)·exp(−i(H₀+V)t) at every order. `KOIDE_SOURCE.md` states its identities hold "on all logical target inputs and external references".
- **Check.** In a toy with a random J-blind dressing, "kept" gives θ_eff = 0.2222222222 with even phase 0; "absent" gives 0.223127.
- **Consequence.** With DR's selection rule (one common weight on all three flags), the native point is undressed: δ = 2/9, μ/e stays at +9.83 ppm.
- **Same action for repair and hold reads.** The even phase E_H − (E₊+E₋)/2 is exactly 0, so D12's φ is not part of the premise.
- **What can produce −1.75e-7.**
  - A coupling to J, or to o_C inside the repair sector: an odd phase, which shifts θ directly.
  - A coupling to the repair record r_C: the even D12 form, φ = 1.293e-4 per tick (DR's size).
  - A change of the read statistics: correlation 8.76e-8 or dilution 7.88e-7 (DR's sizes).
  - A departure from t = 1.
- **Finite N cannot do it through the phase.** N = 302.28 gives the size but lowers Q to 0.666476, which is 38.7σ below the measured 0.6666646 ± 0.0000049, with μ/e = 204.07. Q within 2σ needs N ≥ 4876, where the phase correction is at most 6.7e-10.
- **Finite N can fit through the balance.** N = 405,310.5 fits μ/e, with τ/e at +0.39σ and Q − 2/3 = −1.42e-7. This is a one-parameter FIT with zero weight.

**Observation (EXACT, found after computing, no weight as a derivation).** tr(M†M) = α(1−α) and P(R+ xor H) = α(3−α)/4 agree only at the native activity α = 1/3, where both are 2/9. At the native point the premise reads θ = tr Y: the current's phase per tick equals the summed rest rate of the three family modes.

## EVIDENCE

- Rebuild everything (about 5 s): `sh work/CK/run_all.sh`
- Stack statements S1 to S7: `work/CK/STATEMENTS.md`. It has 76 entries with file and line, each machine-matched by `ck_statements.py` against the checkout at `33fe70e5d`, 0 unmatched. The checkout changed overnight, so line numbers are those of the current tree.
- Candidates: `work/CK/CANDIDATES.md`, written 23:57 before the first script. C7 was added 07:50 before its computation. Outcomes are in sections 5a and 5b. There are 19 looks; the only fitted numbers are N in C3 and C7.
- Theorem: `work/CK/THEOREM.md`
- Scripts and outputs, all in `work/CK/`:
  - `ck_clock.py` → `ck_results.json` (sections A to G)
  - `ck_repo_check.py` → `repo_check.json` (identity on the repository's own program, run from RER read-only)
  - `ck_statements.py` → `statements_check.json`, `c7.json`
  - `ck_render.py` → `STATEMENTS.md`

## WHAT THIS DOES NOT ESTABLISH

- Unit clock time per tick. It is a premise with no stack statement behind it.
- That the energy clock is the law's own evolution. The stack calls it a declared replacement clock; the coherent walk's own phases are the Floquet ones.
- Which read projector couples to J, the register, the oriented record, the analyzer, or that a definite source persists over many ticks. These are FR's declared items.
- Any value of the dressing. The "kept" rule is exact only for environments commuting with J and acting alike on the three flags.
- A stack basis for the weak rounds on J. The transfer of the `KOIDE_SOURCE` bound to J ⊗ Q uses only that both generators have norm at most one; the fresh, uncomputed read records are a declared apparatus.
- Refinement invariance of a read-count action. Two half ticks of the walk carry 0.503 to 0.511 of one tick's energy-clock action, so the read must be the unit event.
- Mass comparisons are NOT BLIND.

## NEXT

1. Derive t = 1 per tick. The one concrete lead is the observation θ = tr Y at α = 1/3: test whether the law forces the current's clock energy to equal the trace of the mass generator, for instance as a Ward identity of the oriented current.
2. GL with FR: couple a dynamical link to J or to o_C in the repair sector, since only that shifts θ. The target odd phase is −1.7515e-7 per tick; a coupling to r_C gives the even form.
3. FR: iterate the tick and check that J stays conserved by the post-read generator, which the dressing rule assumes.
4. If a finite N is physical, the source must supply about 4.05e5 rounds per tick. That reading predicts Q − 2/3 = −1.42e-7, against exactly 2/3 for a pure phase dressing.
