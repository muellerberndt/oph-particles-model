## RESULT

**(T) is derived from (E): on the stack's declared positive clock one tick lasts exactly one unit of clock time, so CK's theorem needs only (E), (C), (J) and gives θ = 2/9. The single item still missing is the rule by which the read kick enters the cell's generator. The onsite rule gives coefficient 1 (θ = 2/9); the edge rule gives π/2 (θ = π/9).**

Notation: θ = κP, with κ = (coefficient of the read coupling) × (clock time per tick) and P = 2/9.

**1. Theorem (EXACT, checked on the repository's own gates and program).**
- **Edge anchor.** The stack declares one generator with one t: onsite I − Re U with coefficient one and hopping (π/4)dΓ(I − S). Its tick is the seven-layer cycle with one root-SWAP E per edge. exp(−iτ(π/4)(I − S)) = E holds iff τ ∈ 1 + 4Z, and the principal branch leaves τ = 1. The stack states the identity at t = 1 (`energy/PROOF.md:17-20`, `spatial/PROOF.md:19`).
- **Attempt count.** On `Observer.step`, A†WA = K_12 = I − L/60 and (I − Re W)A = A(I − K_12) on all twelve ports. On the consensus sector the declared onsite clock is therefore the unitary continuation of the attempt semigroup with the same t. That semigroup runs one attempt per unit time, and one tick is one attempt. The proof uses only Q² = I and the address reflection, so it covers FR's hexagon model.
- **The declared pair is forced.** "One attempt per tick" and "the tick's edge gate" hold together iff c_hop/c_read ∈ π/4 + πZ. The principal solution is the declared pair (1, π/4).
- **Refinement.** Splitting the tick into N parts gives the edge gate E^τ and the phase τP within τ²/N. The edge layer is reproduced only for τ ∈ 1 + 4Z.

**2. Units (direction 2).** κ = (π/4)·c_read/c_hop for every overall scale. (E) and (T) are one statement: the read coupling has the energy E_cell = ħ/tick. DC's derivation supplies the tick-to-energy conversion with no lepton input, so nothing is circular. It says nothing about the coefficient, which is (E).

**3. Rate matching and its gap (direction 1).**
- The action form is exact: κ is the number of attempts the record clock runs per tick, and the law runs one.
- The record form gives π/2: the clock of the single repair event writes the record with weight P·sin²τ.
- For the tick itself the record form has no solution at any τ.
- The gap is the transfer from the record semigroup to the unitary clock, which is the stack's declared replacement clock, that is (E).

**4. Where coefficient one comes from (EXACT identity; its use is ARGUED).**
- I − Re((−i)^N) = N for a count N with spectrum in {0, 1, 2}.
- The public round `step`, `quarter_turn`, `inverse_step` has I − Re R = W⁻¹Π₁W, with expectation 1/12 = 1 − ⟨W⟩ and return amplitude 11/12 + i/12.
- With the count gate (−i)^(X⊗(I+J)) the functional is X_W⊗(I + J): CK's generator, coefficient one, zero even phase.
- The edge gate is also a quarter turn, and the stack gives it its logarithm, (π/2)Π₋. The same kick therefore gets 1 under the onsite rule and π/2 under the edge rule. Both uniform rules give π/2.
- Inside a joint onsite unitary with a co-factor U₀, the coefficient becomes Re⟨U₀⟩ and an even phase Im⟨U₀⟩ appears. With a tick of FR's object as co-factor the phase would be 4/27, so the round has to be a term of its own.
- The joint tick of independent objects holds no J⊗X term: ⟨S|W|S⟩ = 2/3 is real.

**5. Alternatives (direction 3).** 30 values of κ were registered. Positive chamber: |κ − 3πn| ≤ 3π/8 = 1.178.

| κ | Motivation | Source-side ground against it |
|---|---|---|
| π/2 | swap event reproduced; both uniform rules; weak-limit quarter turn | onsite rule of the declared clock; outside the chamber, Q = 0.5983 |
| (9/2)·atan(2/7) | one strong quarter turn per tick, θ = 0.2783 | (C); outside the chamber, Q = 0.6524 |
| 5, −3, 9, … | edge anchor without the principal branch | aliases of the edge logarithm |
| π/4, 2, 1/2 | hop coefficient on the read; record parity; half tick | attempt count differs from one |
| 2/π, 4/π | signal speed | the hopping band has no momentum-independent speed |
| 2π, 1/(2π) | cycles in place of radians | ħ = 1 with angular rates |
| 1.277, 0.783 | E* in place of E_cell | DC |
| 4/5, 3, 6, 60, … | Courant step, circulation, period, Poisson conventions | not a duration; CK2; coefficient × time per attempt is 1 in every convention |

Consistent t: (E), (C), (J) alone admit every t. The edge identity admits 1 + 4Z. The principal branch and the attempt count each admit only t = 1.

**6. Comparison with measurement (NOT BLIND, five events).**
- κ = 1 is the only registered value within one percent on both ratios. π/2 gives 81.9 and 780.7.
- The measured μ/e gives κ = 1 − 7.882e-7 (half width 1.8e-9). This is the L5 residual written as a clock time. The unit is exact, so the residual sits in the weight of the read or in the kick.
- The measured τ/e gives κ − 1 in [−7.2e-6, +1.7e-6].
- Outside the chambers μ/e is met at κ = 1.4038, with τ/e 6668σ low.

**7. Scale (direction 4).**
- (T) fixes only the phase clock's unit, E_cell. The mass clock's unit is free inside the theorem.
- The theorem holds two statements of type (T): accumulated kick angle per tick 1 for the phase coupling and h for the mass round exp(−ihX⊗P_U).
- They must differ: one common unit gives m_τ = 2.0e18 GeV (NOT BLIND). Both small gives θ = hP and degenerate light leptons. A mass kick of order one moves τ/e by 9.3 percent.
- The factor F is carried by the kick angle per tick of the X leg of the mass round. On the weak-kick clock h = F = 8.864e-19. Under the onsite rule F = 1 − cos h, so h = 1.33e-9 and h·E_cell = 1.27e10 GeV (NOT BLIND).
- Lead C's finite-round terms belong to the phase clock: N counts fresh reads of the pair per tick.
- `KOIDE_SOURCE.md:147` concerns an apparatus kick and the mass scale. `PhysicalCalibrationImport.lean:80` concerns seconds per tick, which cancel in θ.

**Residual premise, one sentence:** the read kick is an operation of the cell's tick that the declared clock counts by its onsite rule (I − Re of the gate) as a term of its own; the only alternative the stack's statements leave standing is the edge rule (the logarithm), with π/2.

## EVIDENCE

Everything is in `work/LT/`.

- Rebuild and check (about 35 s): `sh work/LT/run_all.sh`. It ends with `lt_verify.py`: 25 of 25 registered predictions pass.
- Theorem: `THEOREM.md`.
- Stack statements: `STATEMENTS.md` (65 entries with file and line, 0 unmatched, working tree at `3ee5e0652`), built by `lt_statements.py`.
- Registration: `CANDIDATES.md`. Sections 0 to 6 are frozen as `CANDIDATES_PREREG.md` with `PREREG.sha256`, written 09:18 before any script. D11 and D12 were added before the NOT BLIND step. D13, D14, C6 and two looks were added after it, each dated; they are algebraic identities with no new κ value.
- Scripts and outputs:
  - `lt_anchor.py` → `lt_anchor.json`: D1 to D5, D8, D11 to D14, on `spatial/family.py` `exchange` and `dressed_swap` and on `coherent_seam_repair` `Observer`, run from RER read-only.
  - `lt_refine.py` → `lt_refine.json`: D6 and D10 on FR's hexagon model, imported read-only.
  - `lt_spectrum.py` → `lt_spectrum.json`.
  - `lt_scale.py` → `lt_scale.json`.
  - `lt_not_blind.py` → `lt_not_blind.json`.
- Count: 14 routes, 30 values of κ, 6 scale readings, 5 NOT BLIND events, 2 unregistered looks. No measured value enters a derivation and nothing was fitted.
- One temporary output file was written to `/tmp/claude-501/` by mistake and removed. Nothing else was written outside the work directory.

## WHAT THIS DOES NOT ESTABLISH

- The declared positive clock itself. It is the stack's declaration (a replacement clock), and the theorem is a statement about it.
- That the current coupling is a term of that clock. If the kick stays an apparatus control, its angle per tick is an apparatus setting and `KOIDE_SOURCE.md:147` applies.
- The choice between the onsite rule and the edge rule for the kick. The onsite rule is ARGUED: the read is a record event, and the stack calls its energy laws free of logarithm ambiguity and declares a branch only for the edge. No stack statement classifies the kick.
- Any source-side exclusion of π/2 beyond that rule and the positive chamber. The decisive exclusion is NOT BLIND.
- The quarter-turn round as a source operation. The public quarter turn is apparatus, "absent from idle evolution". The count gate on X⊗(I + J) was checked as algebra and on the one-load program, not inside FR's register.
- (C) and (J). The fresh reads within a tick, or the read mean over many carriers, stay declared.
- The edge anchor for FR's register directly. It lives in the cubic architecture, and FR's register meets it through the clock that (E) cites.
- Any value of F or of the residual. GeV values are imported from DC.

## NEXT

1. **LK (L2):** build the round "tick, count gate (−i)^(X⊗(I+J)), inverse tick" on FR's pair and C register. Check that it gives K with zero even phase, and state it as a term of its own in the generator. With that, (E) and (T) both follow from the declared clock.
2. **Coordinator:** drop (T) from the premise list and cite `energy/PROOF.md:17-20` with `spatial/PROOF.md:19`. State the rule for the kick layer in one line. Re-attribute `KOIDE_SOURCE.md:147` to the mass scale.
3. **LD (L5):** the residual is κ − 1 = −7.88e-7 in the weight of the read. The dilution identity gives its form: coefficient Re⟨U₀⟩ and even phase Im⟨U₀⟩ for a co-factor of the kick. A finite mass kick has the wrong sign.
4. **Scale steps (L6 to L8):** decide whether the mass round is counted by the onsite rule (F = 1 − cos h) or runs on the weak-kick clock (F = h).
5. **Two looks for the scale steps (unregistered, NOT BLIND, no weight; count them):**
   - h·E_cell = 1.273e10 GeV against DC3's census-B colour pole at 1.301e10 GeV. The ratio is 0.978, and the pole would give a mass-clock unit of 8.86 GeV against 8.47 GeV.
   - With the coupling 16.2735 of DC2's fixed point the ratio is 1.013 and the unit 8.26 GeV. The measured unit corresponds to 1/α = 16.2632 in F = ½·exp(−(4π/5)/α).
