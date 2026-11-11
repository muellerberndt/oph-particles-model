## RESULT

None of the ten registered candidates derives the ratio. Every one fails at mu_c (needed 0.0243) and at Q0 (needed 0.0104). The furthest complete derivation is exact structure of the register:
- Under the committed rule, the lepton junction of every lasting (3,3) pair is exactly zero.
- A nonzero value needs exactly one cost-raising read, at every separation.
- So the ratio is linear in the weight of one unrewarded read, and the source does not supply that weight.

**Which label my candidates read (your 23:08 question).** Every candidate reads the Z6 class as a magnitude, through two features of the register dynamics:
- **Unit currents:** in the balanced band every current is ±1, so a class-k flux crosses a seam as k unit twists. That is 3 for the lepton junction and 1 for the quark junction.
- **Declared cost table:** (0, 5, 8, 10, 8, 5) with κ = 5. It freezes class 3 and lets class 1 move.

Both are magnitudes, so they lie outside the LS2 phase exclusion. Both are blind to T3: up and down are the same Z6 junction (1 + 3 → 4), so every candidate gives y_J^u = y_J^d.

**Exact structure** (carrier `oph_exact.carrier`, register rule of the runs):
- **Superselection:** from all 160 lasting placements, every one of the 60 proposals raises the cost (minimum +3). The rule applies none, at any order. The class 1 hops at zero cost and fuses 1 + 3 → 4 at −7.
- **Read counts:** annihilating a (3,3) pair at separation d takes 3d unit twists; 1 + 3 → 4 takes d. At adjacency the counts are 3 against 1.
- **One cost-raising read suffices at every d** (barrier 3 cost units):
  - A +3 split leaves a class 2 or 4 behind and a mobile class 1 or 5.
  - The mobile fragment pushes the left-behind face across the carrier by flat exchanges at cost 23.
  - All remaining fusions are downhill (20 → 16 → 10 → 0).
  - These routes take 6, 10, 14, 18 reads for d = 2 to 5. The shortest routes (3d reads) need 1, 2, 2, 2 cost-raising reads.
- **Your count holds:** reads made above the starting cost number d − 1. The cheapest route's Euclidean action is 3(d − 1) cost units.
- **Coherent leakage:** with H = τ Σ(T_e + T_e†) + ε Σ cost, a class-3 face hops at third order with t3 = (2/9) τ³/ε² on every placement (two routes, both intermediates at +3). The class 1 hops with τ at first order.
- **Placement weights:** 60, 60, 30, 10 lasting placements at d = 2 to 5, giving weights 3/8, 3/8, 3/16, 1/16.

**Candidates.** Registered 23:14, before any script ran. All ten were estimated mentally before registration. r is the lepton weight over the quark weight.

| Id | Reading | r | r / needed, mu_c | r / needed, Q0 |
| --- | --- | --- | --- | --- |
| A1 | e^-(3-1): junction reads at adjacency, one nat per read | 0.1353 | 5.57 | 13.0 |
| A2 | ⟨e^-(3d-1)⟩ | 0.00266 | 0.109 | 0.255 |
| A3 | ⟨e^-2d⟩, same separation | 0.00786 | 0.324 | 0.756 |
| A4 | ⟨e^-(d-1)⟩, reads above start | 0.199 | 8.20 | 19.2 |
| A5 | p² = 1/144 | 0.00694 | 0.286 | 0.668 |
| A6 | ⟨p^(d-1)⟩ | 0.0340 | 1.40 | 3.27 |
| B1 | ⟨e^-S(d)⟩, κ cost units per nat | 0.355 | 14.6 | 34.2 |
| B2 | e^-(3/κ) | 0.549 | 22.6 | 52.8 |
| C1 | ⟨(t3/τ)^(d-1)⟩, τ = √p, ε = 1/κ | 0.275 | 11.3 | 26.5 |
| C2 | same, τ = p, ε = 1/κ | 0.0150 | 0.619 | 1.45 |

The quark trace is tr Y_u = y_t/λ_max², with y_t = 0.38924 at mu_c and 0.96230 at Q0 (criticality lane) and λ_max² = 0.94362. No candidate passes, so I give no masses for any candidate.

**What each direction would need** (worked out after the comparison, so not blind):
- **A:** 3.72 excess nats at mu_c (4.57 at Q0). The junction at adjacency supplies 2 excess reads.
- **B:** 0.93 nats per cost unit at mu_c (1.20 at Q0). The declared κ gives 0.2.
- **C:** τ/ε = 0.52 at mu_c (0.35 at Q0). The A-clock reading (τ = p, ε = 1/κ) gives 0.417, between the two.

**A coincidence noticed after seeing the target (carries no weight).** (det C²)^(1/3) = 0.024310, the geometric mean of the lepton circulant's squared eigenvalues, lands at 1.0007 of the mu_c value (2.34 at Q0).
- I noticed it while reading LS.md, before registering, and it has no structural derivation.
- The agreement is inside the roughly 1 percent input uncertainty (one-loop running, imported running masses), so among 55 looks it is at chance level.
- Its masses are listed for the record only: 0.000502, 0.1038, 1.746 GeV at m_Z.

**Looks counted:** 22 mental estimates before registration, 26 scripted comparisons (13 rows at two scales), and 7 mental estimates of variants afterwards, 55 in total.

## EVIDENCE

- `sh work/TR/run_all.sh` rebuilds everything in about 3.5 min wall on the loaded machine. `tr_routes.py` is the slow step (75 s CPU).
- Individual scripts run from /tmp with `PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python -B`:
  - `tr_exact.py` (needs `PYTHONPATH=oph-physics-sim`, 25 s): superselection, read counts, barriers, t3, orbits.
  - `tr_candidates.py` reads no measured value.
  - `tr_compare.py` is the only script that reads measured values, via `work/LS/compare.json`.
  - `tr_reduction.py` computes the needed values above (not blind).
  - `tr_routes.py` reconstructs the explicit routes.
- Order on record in `CANDIDATES.md`:
  - list registered 23:14, ledger correction 23:21 (before any candidate value)
  - `tr_compare.py` 23:22:31, `tr_routes.py` 23:30, outcomes appended 23:31
- `oph_exact.carrier` was imported read-only. Nothing was written outside `work/TR`; RER and the audit were only read.

## WHAT THIS DOES NOT ESTABLISH

- **That the frozen/moving asymmetry sets the ratio.** The register is a declared bookkeeping layer, and the cost table and κ are simulator declarations. Only the 3-against-1 unit-twist count is free of them.
- **A source weight for a cost-raising read.** One nat per read, κ cost units per nat, and τ and ε are all declared readings.
- **Up against down.** Every candidate gives equal up and down weights.
- **The comparison scale.** The needed value differs by a factor 2.3 between mu_c and Q0.
- **The placement measure.** I used a uniform measure; the runs' separations are a preparation relic (L37).
- **Search scope.** The reads-above-start count and the action are minima within at most four defects and cost at most 30. The 3d read count, the single cost-raising read and the barrier of 3 are exact, and t3 is exact at third order only.
- **The C readings.** They omit route multiplicities and treat downhill reads as dissipative.
- **Blindness.** Nothing here is blind.

## NEXT

1. **Derive the weight w of one cost-raising register read.** Since one such read suffices at every separation, r = w·K. Possible sources:
   - a coherent completion of the acceptance rule (with t3 = (2/9) τ³/ε², this needs τ/ε = 0.52 at mu_c);
   - the cost table and κ expressed in reads (B needs about five times the declared conversion).
2. **Compute K once w exists.** K is the probability that one leak read ends at the vacuum under the allowed dynamics, normalized by the same chain's 1 + 3 → 4 rate. It is a small absorbing chain; the routes are in `tr_routes.json`.
3. **Separate up from down.** The register cannot; it needs T3 (R8's Higgs register components), as LS2 says.
4. **The (det C²)^(1/3) coincidence.** If pursued, register a structural reason first and test it blind on a second quantity.

All files are in work/TR:
- CANDIDATES.md
- run_all.sh
- tr_exact.py, tr_candidates.py, tr_compare.py, tr_reduction.py, tr_routes.py
- tr_exact.json, tr_candidates.json, tr_compare.json, tr_reduction.json, tr_routes.json
- tr_exact.log
