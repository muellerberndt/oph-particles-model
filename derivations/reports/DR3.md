## RESULT (round 3)

**NOT DERIVED.** None of the 17 round-3 evaluations passes (57 looks in total for this worker), and every source coupling overshoots its target by at least a factor of 400. Three sign statements and one selection rule are exact.

**1. Selection rule for the odd phase (T5, EXACT).** Take a coupling J ⊗ X + r_C ⊗ Y. If the environment and its reference state are symmetric under X → −X, then E(+1) = E(−1) at every order. The link can therefore shift θ only through a background that is odd under orientation reversal. For class 3 the link phases are real, so the only such element in FR's register is the preparation (the load at the screen tail).

**2. GL's link coupled to J** (flux on the C seam shifted by J; t = 1 per tick). Source values: g² = 0.773539, and ε = (g²/2)·C2 = 0.348 for the lepton doublet (0.232 for e^c, 0.145 for the electromagnetic part).

| Row | Odd phase (θ_eff − θ) | Even phase | Read statistics | Against target (NOT BLIND) |
|---|---|---|---|---|
| E1 bare string | 0 | −0.34809 | none | 2692× too large |
| E2 field relaxed on the carrier | 0 | −0.12763 | none | 987× too large |
| E3 as E2, with the load's own field at the screen tail | +0.12763 | −0.12763 | none | odd: 7.3e5× too large, wrong sign |
| E4 flags taken on the relaxed link | 0 | 0 | current flags diluted to Z = 0.86622 | 3.6e5× too large |

- Carrier-graph facts used (EXACT): every seam has effective resistance 11/30; the transverse fluctuation factor is c_T = 0.412574 on every link; the transverse weight of a link is 19/30.
- **Sign of E3:** for any positive coupling the own-field odd phase raises θ, while the target needs θ to fall. With the load at the screen tail, the link coupled to J cannot supply the odd phase.
- The even phase and the dilution both lower μ/e, which is the target's direction. The even target needs ε·R_eff = 1.2930e-4, that is ε = 3.526e-4 per tick.
- Scale variants of E2: e^c gives −0.08509 (658×) and the electromagnetic part −0.05318 (411×).
- With the low-energy α as comparison scale only (ε = 2πα_P), the relaxed even phase is still 130× too large.

**3. Higgs memory coupled to r_C.** The odd phase is exactly 0.
- H1, declared y = ω = 1: even phase 1.56155 (second-order value 4), current flags diluted to Z = 0.62127. That is 12,077× too large.
- H2, y²/ω fixed by the measured lepton mass sum in cell units: even phase 3.94e-19, which is 3e-15 of the target.
- The target would need y²/ω = 3.2325e-5 per tick; no source rule supplies it.

**4. E and C reads on one carrier sharing port 2** (two hard-core loads, FR's own event matrices, an activity bit per object).

| Ensemble, order | P(R+) | P(H) | P(R+ and H) | P(R+ xor H) | cov |
|---|---|---|---|---|---|
| Independent objects (FR) | 1/12 | 1/6 | 1/72 | 2/9 | 0 |
| C or E code, C event first | 1/12 | 11/72 | 1/48 | 7/36 | +7/864 |
| C or E code, E event first | 11/144 | 1/6 | 1/48 | 29/144 | +7/864 |
| All 66 pairs, either order | 5/66 | 5/33 | 5/264 | 25/132 | +65/8712 |

- The correlation is positive, which is the target's sign, but 85,200 to 92,519 times too large.
- With the E event first a shared carrier lowers μ/e. With the C event first it raises μ/e, because the balance moves to 6/11.
- One-parameter FIT, zero weight: sharing one carrier in a fraction 3.181e-6 of ticks, E event first, fits μ/e with τ/e at +0.42σ and Q − 2/3 = −8.8e-8.

**Where this leaves CK's four options.**
- (a) Odd phase from the link: excluded by sign in E3, and zero otherwise by T5.
- (b) Even phase: right direction, but it needs an energy on the repair record of 1.29e-4 per tick, against a cell value 987 to 2692 times larger.
- (c) Read statistics: right direction for the dilution and for the E-first correlation, but 1e5 times too large at source values.
- (d) Departure from t = 1: not computed here.

## EVIDENCE

- Round 3 alone (about 4 s): `cd work/DR && PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=work/FR /tmp/oph-completion-venv/bin/python -B dr_round3.py round3.json`
- Everything: `sh work/DR/run_all.sh` (exit 0 at 08:11).
  - It now reads the repository at `reverse-engineering-reality`.
  - The earlier checks still pass on that checkout: family 0 equals `quantum_lepton_block`, 88 periodic columns match, and the bare register equals (√2/3)C.
- Candidates: `work/DR/CANDIDATES.md`. Section 8 was written at 08:05:31, before `dr_round3.py` existed; outcomes are in section 9.
- Results: `work/DR/round3.json`.
- Runner change: the shared venv now takes sympy from the user site, so the runner uses `-B` where it used `-I`.

## WHAT THIS DOES NOT ESTABLISH

- Any dressing value from the source.
- That the link's flux follows J. In FR's register the load moves from tail to the agreeing state at both addresses, so a link coupled to the physical transport is blind to J (round 2). E1 to E4 take your reading, in which orientation ± carries the charge across the seam in direction ±.
- The link energies use the Gaussian (weak-coupling) theory on one carrier with uniform compensation, and assume one tick equals one unit of the link clock. GL's compact dynamics, its two field steps per tick, and the non-abelian terms are not computed.
- The single-carrier rows use a classical mixture over code pairs with a declared activity bit. Both objects on one carrier with one shared load pair is itself a declared setting.
- The memory coupling to r_C is declared; the source supplies neither y nor ω.
- Option (d) and the finite-N route remain CK's.

## NEXT

1. **FR and CK:** decide whether orientation − is a physical transport in the reverse sense (the hexagon reading) or the same transport read at the reversed address. In the second case the link is blind to J and only options (b) to (d) remain.
2. **Option (b):** the source needs an energy on the repair record of 1.29e-4 per tick. The cell-scale link gives 0.13 to 0.35 and the memory at the lepton scale gives 4e-19. A candidate must sit between these scales, and none is on record.
3. **Option (c):** the shared-carrier fit needs a sharing fraction of 3.18e-6 with the E event first. A source count of how often the two objects sit on one carrier would test it; the event order must come from the law's scheduler.
4. **Option (d):** CK's lead θ = tr Y at activity 1/3 is the remaining route that does not need a small coupling.
