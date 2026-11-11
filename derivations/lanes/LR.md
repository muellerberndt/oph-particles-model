## RESULT

**The two-cell register on the sixty-address carrier with record flags was executed over 10^4 to 2 x 10^6 rounds. The phase per unit clock time is N atan(P sin(1/N)/(1 - P + P cos(1/N))) with P = 2/9 at every number N of rounds per unit clock time and at every elapsed number of rounds. The limit of the executed values is 2/9 + 9 x 10^-14. Every round reads the count 2/9. The three characters of the face third-turn are the eigenvectors of the executed mass round, with the rest rates of the formula to 10^-13.**

Labels: EXACT is rational arithmetic through the public package. MEASURED is float64 on executed state vectors; its error is the stated distance from the closed form, or a standard error for sampled rows.

**1. Gates (EXACT).** All 15 pass, from the public package at commit 736c6d929 and from worker LC's module.
- Blank 5/6, record 2 with 1/12, record 3 with 1/12 at each of the twelve ports.
- P(R+) = 1/12, P(H) = 1/6, P(R+ and H) = 1/72, count 2/9, ratio 2 : 1 : 1 at each port.
- Weak-round phases 0.205334030970 at N = 1 and 0.222062099671 at N = 10.
- The public receipt has 80 checks and all pass.

**2. The protocol.** It is fixed in `CANDIDATES.md` before any run.
- Clocked system: a current J with values +1, 0, -1 that the round does not change. Pair: two cells X and Y with independent sixty-address registers, each a blank double at port 2.
- One round: tick both cells, kick exp(-i (1/N) J Qx) on the exclusive read "X reads record 2 xor Y is written", inverse tick both cells, one return test per cell on its uniform address state, reset of a cell after a "no".
- N rounds are one unit of clock time, which is one tick of the declared clock.
- Three forms agree. The public package's `Walk.step` and `Walk.inverse_step` on dictionaries agree with the array engine within 3.6e-13 in the round amplitude and 6.3e-15 in the state over 40 rounds at N = 1, 10, 1000. One round in rational arithmetic gives <start|X> = <X|X> = 2/9 with X on blank doubles.

**3. Phase per unit clock time against the number of ticks (MEASURED).**

| N | Executed rounds | Phase per unit clock time | Minus 2/9 | Series -35/(2187 N^2) | Minus closed form |
|---|---|---|---|---|---|
| 1 | 10^4 | 0.205334030970 | -1.6888e-2 | -1.6004e-2 | 0 |
| 2 | 10^4 | 0.218167184002 | -4.0550e-3 | -4.0009e-3 | -6e-17 |
| 10 | 10^4 | 0.222062099671 | -1.60123e-4 | -1.60037e-4 | 6e-17 |
| 100 | 10^4 | 0.222220621848 | -1.600374e-6 | -1.600366e-6 | -7e-16 |
| 1000 | 10^4 | 0.222222206219 | -1.600365e-8 | -1.600366e-8 | 5e-15 |
| 10^4 | 2 x 10^4 | 0.222222222062 | -1.6013e-10 | -1.6004e-10 | -9e-14 |
| 10^5 | 2 x 10^5 | 0.222222222221 | -1.3e-12 | -1.6e-12 | 3e-13 |
| 10^6 | 2 x 10^6 | 0.222222222224 | +2.2e-12 | -1.6e-14 | 2.2e-12 |

- Float64 resolves the phase to 2.2e-12. The deviation from 2/9 is resolved down to N = 10^4.
- Limit: Richardson extrapolation of the executed values at N = 100 and 1000 gives 0.22222222222231, which is 2/9 + 9.2e-14.
- Against elapsed rounds the value is flat. At N = 10 it is 0.22206209967050 after 1 round and after 10^4 rounds, within 3e-15.
- The amplitude of a round changes by at most 9e-15 over a run. The count read by every checked round is 2/9 within 1.1e-16.
- Kept modulus per unit clock time: exp(-0.086527) at N = 1, exp(-8.6420e-4) at N = 100, in line with exp(-7/(81 N)).
- Through the public package alone: 10^4 rounds at N = 100 give 0.22222062184783, the closed form within 4e-15, with the count within 1.8e-14 of 2/9.
- 31 further values of N between 1 and 10^4 agree with the closed form within 7.7e-14. They form the curve on the site.
- Controls of the port: both doubles at port 10 and the mixed case give the same value at N = 10 within 2e-16.

**4. The complete record (EXACT weights, MEASURED samples).**
- The two return tests have four outcomes. Their weights in the vector X of the round are 4/81, 11/324, 125/1296, 55/1296. The three "no" weights sum to 14/81.
- The non-return vectors do not depend on j, within 6e-14 in the executed states. Every outcome therefore acts on the clocked system as a function of J. A "no" removes the branch j = 0.
- With every outcome kept and the reset applied, the coherence between j and j' is multiplied per round by 1 - P + P exp(-i (j - j')/N). The executed states give this within 1.5e-14. The phase 2/9 per unit clock time holds on the complete record. No selection of the returned branch is needed.
- Sampled check, 2 x 10^5 trajectories each, seed 20261111: the coherence between j = +1 and j = -1 agrees with the exact value within 2 standard errors at all 17 clock times up to 1000 units. The largest distance is 1.96 standard errors.
- Resets per unit clock time from (|+1> + |0> + |-1>)/sqrt3: 0.011527(20) at N = 10 against 0.011513, and 0.0011621(79) at N = 100 against 0.0011523. On a current branch the rate is N 4 sin^2(1/(2N)) 14/81.

**5. Alternative orderings (MEASURED, 10^4 rounds each).**

| Id | Ordering | Executed phase per unit clock time | Limit |
|---|---|---|---|
| O2 | n = 2, 3 partners in turn, every round complete | equal to one partner within 4e-14 | 2/9 |
| O3 | n partners in one round, kick shared | n = 2: 0.215732955808 (N = 1), 0.222158623247 (N = 10). n = 3: 0.217602641007 (N = 1). n = 6: 0.218715911051 (N = 1), 0.222222218721 (N = 1000) | 2/9 for every n |
| O4 | partners read one at a time inside one round of X | equal to O3 within 2e-15 in the round amplitude | 2/9 |
| O5 | X ticked again for each partner | equal to one partner at n N rounds within 1.3e-13 | 2/9 |
| O6 | control: partners read at once | n = 2: 0.33796295 at N = 1000. n = 3: 0.43441357 | 73/216, 563/1296 |
| O7 | control: full kick for every partner | n = 2: 0.44444439 at N = 1000. n = 3: 0.66666654 | 4/9, 6/9 |

- O3 and O4 for two partners are brute-force runs over 60^3 addresses. Three partners are checked by brute force over 60^4 addresses on three rounds.
- Partners read one at a time with a shared kick give 2/9 for every number of partners. This confirms LC's item A16 by execution. The executed runs do not select the shared kick over O6 or O7.

**6. Controls that leave 2/9.**
- **Forward only (LC item 6).** Full two-load sector of a cell, 18720 states, 10^4 ticks. Count 2/9 at tick 1, then 3544109/7290000 = 0.486160, 0.535746, 0.467177 (EXACT for ticks 1 to 4), then 0.353, 0.403, 0.502, 0.500, 0.361, 0.218, 0.340, 0.503. Mean over 10^4 ticks 0.40334, range 0.0142 to 0.5372. The count is within 0.001 of 2/9 at 10 later ticks. The largest return amplitude after tick 1 is 0.9385 at tick 4218, so there is no period within 10^4 ticks.
- **No return test.** n rounds act as one kick of angle n/N, within 4e-13. The angle is 0.205334 at t = 1 for N = 10 and N = 100, 0.2867 at t = 2, -0.1156 at t = 100. It stays below asin(2/7) = 0.28975. The phase per unit clock time falls as 1/t.
- **No reset.** The pair stays in four test states, within 1.8e-13. The count read is 2/9, 7/9, 7/9, 2/9 in the states "both returned", "X not", "Y not", "neither" (EXACT). A non-returned cell reads its flag with weight 11/12 or 5/6. The mean count read tends to 1/2. At N = 10 it is 0.4795 after 100 units and 0.5000 after 1000 units, running mean 0.48934. Sampled brute force: 0.4910(61) with 150 trajectories. At N = 100 over 100 units the exact running mean is 0.25549. Sampled: the first sample of 150 trajectories gives 0.2401(61), which is 2.5 standard errors low. The second sample of 450 trajectories, registered before it ran, gives 0.2579(49). The union of 600 gives 0.2535(40), 0.5 standard errors from the exact value.
- **Current read from the pair's own cell (added as O11).** With J the record of X in the same round the phase per unit clock time is 0.055486 at N = 10 and tends to 1/18. The count 2/9 needs the current on a system that the round does not change.

**7. The three characters (MEASURED).** Register: two cells on sixty addresses, the register F with three positions, tick U = K T V (W x W), analyzer over the flags hold, repair +, repair -, mass round "U, gate exp(-i h |Phi><Phi|), U^-1, return test".
- **Eigenvectors.** With F explicit the executed return operator is 1 + (exp(-i h) - 1) M^dag M within 3e-15. Its off-diagonal part on the three characters is 2.6e-16. The compression is sqrt(5/18) C(2/9) within 6e-16 for double loads.
- **Rates, native pairs with the oriented record.** Executed rest rates, limit of many mass rounds: tau 0.209693556023, muon 0.012468365640, electron 0.0000603005590. Distance from y_k = (1/27)(1 + sqrt2 cos(2/9 + 2 pi k/3))^2: 8e-14, 2e-15, 1e-16. Sum 2/9.
- **Rates, double loads with record flags.** tau 0.262116945029, muon 0.015585457050, electron 0.0000753756988. Each is 5/4 of y_k within 1e-13. Sum 5/18.
- **Ratios.** muon/electron 206.770316 and tau/electron 3477.4728 for both objects. Koide Q = 2/3 within 4e-16.
- **Many rounds.** Through the public package: 10^4 mass rounds per character at 100 and at 1000 rounds per unit, both objects, round amplitude constant within 8e-15. Array engine: 2,097,152 rounds per character at 1024 rounds per unit.
- **A definite position.** 524,288 rounds with F explicit from the position x_0. The position probability circulates with the beat periods 25.5 and 405 units for double loads. The run agrees with the closed returned-branch form within 2.4e-12. In the returned branch the heavier character loses weight: tau 0.333 to 0.313 after 512 units at 1024 rounds per unit.

**8. The rates when the phase of the current is executed (MEASURED).** K is the amplitude that N_p executed phase rounds leave on the current branches: angle 2/9 - 35/(2187 N_p^2), modulus exp(-7/(81 N_p)).

| N_p | muon/electron | tau/electron | Koide Q |
|---|---|---|---|
| 1 | 19.0554 | 278.089 | 0.613697 |
| 10 | 143.184 | 2356.52 | 0.660955 |
| 100 | 198.760 | 3335.26 | 0.666091 |
| 1000 | 205.9486 | 3462.873 | 0.6666091 |
| 10^4 | 206.68793 | 3476.0089 | 0.66666091 |
| 10^5 | 206.762075 | 3477.32641 | 0.666666091 |
| 10^6 | 206.769492 | 3477.45820 | 0.6666666091 |
| limit | 206.770316 | 3477.4728 | 2/3 |

- To leading order muon/electron is 206.770316 - 824/N_p and Q is 2/3 - 0.0576/N_p. The modulus of the current branches carries the effect, as CK stated. The value at N_p = 1 reproduces CK's 19.06.
- The source does not fix N_p.

**9. Separation by the readout (MEASURED).** Instrument of `LEPTON_READOUT`: a clock register of T levels, T in units of the register clock. The fixture is reproduced: all three identified with 0.666388 at T = 32 and 0.999777 at T = 512. With the return tests kept, the executed returned-branch amplitude is the coherence of the clock register, so the distributions below are those of the complete record.

| Pair, confidence | Native pairs, 1024 mass rounds per unit | Double loads, 1024 mass rounds per unit | Closed formula |
|---|---|---|---|
| tau from muon, 95 percent | 23 | 18 | 23 |
| tau from muon, 99 percent | 28 first, 381 for every larger T | 22 first, 305 | 28 first, 380 |
| tau from muon, 99.9 percent | 449 first, 3916 for every larger T | 359 first, 1959 | 270 first, 3915 |
| muon from electron, 95 percent | 373 | 298 | 372 |
| muon from electron, 99 percent | 441 first, 870 for every larger T | 353 first, 696 | 441 first, 869 |
| muon from electron, 99.9 percent | 485 first, not held up to 4096 | 388 first, 1979 | 483 first, not held up to 4096 |

- The probability oscillates with T because the three frequencies fall between the bins of the clock register. "First" is the smallest T that reaches the confidence. The scan runs to T = 4096 for native pairs and the closed formula and to T = 2048 for double loads.
- With 16 mass rounds per unit the returned branch loses coherence and 99.9 percent is never reached.

**10. Comparison with measurement (NOT BLIND, read after `RESULTS.sha256` was written).**

| Executed setting | muon/electron | Against CODATA 2022, 206.7682827(46) | tau/electron | Against 3477.365(176) |
|---|---|---|---|---|
| angle 2/9, both objects | 206.770316 | +9.83 ppm, 442 standard deviations | 3477.4728 | +0.61 standard deviations |
| N_p = 10^6 | 206.769492 | +5.85 ppm | 3477.4582 | +0.53 |
| N_p = 10^5 | 206.762075 | -30.0 ppm | 3477.3264 | -0.22 |
| N_p = 10^4 | 206.687929 | -389 ppm | 3476.0089 | -7.7 |
| N_p = 1000 | 205.948566 | -3964 ppm | 3462.8728 | -82 |

- One row per executed setting. No row is chosen by its agreement. A value of N_p picked from this family by its agreement is a fit, as CK recorded.
- Sources checked at the time of the comparison: NIST shows 206.768 2827(46) and 0.510 998 950 69(16) MeV for CODATA 2022. PDG live shows 1776.93(9) MeV for the tau mass and names its edition 2026. The value equals the one the addendum quotes for PDG 2024.

**11. Candidate addition to the public package.** `rer_package/` holds a new module with 19 checks and a pytest of 7 tests that passes in 5 s of CPU. It certifies items 4, 5, 6 and 7 in exact arithmetic where they are rational. Details in the section FOR THE SITE and in `rer_package/WHERE.md`.

**12. Registered hand values.** All held except these.
- C7: the 99 percent time for tau from muon is 28 at first reach and 380 for every larger T. The registered range 28 to 64 holds for the first reach only. The first reach for muon from electron is 441, below the registered 450.
- O10 at N = 100: the first sample of 150 trajectories lies 2.5 standard errors below the exact mean. A second sample was registered as addendum 1 before it ran and lies 0.5 standard errors above it. The fraction of trajectories with a non-return is 62 of 450 against the leading-order 0.159.
- No hand value was registered for the long-run mean of the forward-only count.

## EVIDENCE

Everything is in `work/SIM/phase2/LR/`.

- Registration: `CANDIDATES.md` with two addenda, hashed before each run in `PREREG.sha256`. First hash 12:24:19, before any multi-round script existed.
- Result hashes: `RESULTS.sha256`, written 13:26:18 before `lr5_compare.py` ran for the first time.
- Rebuild, local: `sh run_all.sh local` runs the gates, the candidate's pytest, the comparison and the site file.
- Rebuild, box: `sh run_all.sh box` in `~/lr/lane` with `LR_RER=~/lr/rer`. It runs `lr2_phase_run.py --full --e1-long 10000 100` in 21 min, `lr3_orderings.py --full` in 20 min and `lr4_characters.py --full` in 24 min, one core each.
- Scripts and outputs:
  - `lr_engine.py`: the three forms of the round.
  - `lr1_gates.py` → `lr1_gates.json`: 15 gates.
  - `lr2_phase_run.py` → `lr2_phase_run.json`: sections A to E of item 3 and 4. `lr2_phase_run_first.json` is the first run of the same script before one inner product was replaced. The two differ only in the long public-walk run, by at most 8.2e-14.
  - `lr2b_phase_curve.py` → `lr2b_phase_curve.json`: 31 further values of N.
  - `lr3_orderings.py` → `lr3_orderings.json`: O2 to O10. `lr3b_no_reset_sample.py` → `lr3b_no_reset_sample.json`. `lr3c_self_current.py` → `lr3c_self_current.json`.
  - `lr4_characters.py` → `lr4_characters.json`: items 7 to 9.
  - `lr5_compare.py` → `lr5_compare.json`: item 10. It refuses to run without matching hashes.
  - `lr6_site.py` → `lepton_run.json` and the site copy. `lr_progress.py` → the site's `progress.json`.
- Candidate package: `cd rer_package && PYTHONDONTWRITEBYTECODE=1 python -B -m pytest -q -W error -p no:cacheprovider test_rounds.py` gives 7 passed.
- Checks that pass: the 15 gates; the 5 exact gates of section A; E1 against E2; the public receipt's 80 checks, replayed with `python -B -m model.lepton_register_round --check` from the repository root in 21 s; the fixture numbers of `LEPTON_READOUT`; the page's own parser reads the site file.
- The public repository was only read, with no byte code written. The files this lane imports are identical to commit 736c6d929 (`git diff --stat HEAD` on them is empty). At 13:35 its working tree shows changes of another session in `.github/workflows/coherent-seam-repair.yml`, `claims/active_surface_inventory.json` and a new `model/defect_integer_lift/`; none of them is imported here. No commit was made anywhere. Nothing above 100 MB was produced. The box holds copies of all outputs in `~/lr/lane`.

## WHAT THIS DOES NOT ESTABLISH

- **The partner rule.** The runs show which orderings give 2/9. They do not derive that partners share the kick or that one partner is read per unit clock time.
- **The number of rounds.** The source fixes neither N nor N_p. At finite N_p the ratios move by the table of item 8.
- **The return test and the reset as source operations.** They are declared. Without the reset the count leaves 2/9 at the rate 169/(1296 N) per unit clock time and tends to 1/2.
- **Which system carries the current.** In the runs J sits on a system that the round does not change, and the pair is two further cells. The reports do not fix whether the pair's cells are the register's cells. Item O11 shows that the pair cell's own record as current gives 1/18.
- **The register's parts.** F, T, the analyzer, the gate of the mass round, the oriented record for native pairs and the clock register of the readout are declared. The run executes them and does not derive them.
- **Which object stands.** Double loads give rates that sum to 5/18 and native pairs give 2/9. The ratios are the same.
- **The joint state of register cells and pair.** The phase rounds enter the register tick through their executed amplitude on the current branches. The product space of four cells was not evolved as one vector.
- **The returned branch against the complete record for the rates.** The executed rates are phases of the returned branch. The complete-record statement is proved here for the phase clock and used for the readout through the coherence of the clock register.
- **Precision.** Float64 limits the phase to 2.2e-12. The sampled rows carry their standard errors. The sampled coherence between j = +1 and j = 0 has one mark at 2.2 standard errors; its phase is exact because a "no" removes the branch j = 0.
- **The lepton scale, a source of the double load, the source event of the kick.** They stay open as in `LEPTON_STEPS.md`.
- **The comparison with measurement.** It is NOT BLIND.

## NEXT

1. **Theory session:** state the partner rule as "the kick is the generator (1/n) sum_l Qx_l". The executed table separates it from "at once" with 73/216 and from "full kick" with 2n/9.
2. **Theory session:** decide which system carries J. With the pair cell's own record the phase is 1/18.
3. **Owner of the public package:** place `rer_package/rounds.py` and `test_rounds.py` in `model/lepton_register_round/`, append `PROOF_SECTION_8.md`, and wire the 19 checks as `WHERE.md` lists. Note for `walk.py`: `dot` returns the conjugate for complex amplitudes when its first argument is longer.
4. **LK or LT:** a source event for the reset of the address consensus, needed 14/(81 N) times per unit clock time.
5. **CK:** a rule for N_p. The executed table gives muon/electron = 206.770316 - 824/N_p.
6. **Simulation session:** if the pair's cells are to be the register's cells, evolve the four-cell state on the box. 60^4 x 3 amplitudes are 622 MB per vector.

## FOR THE SITE

- **Files.**
  - `SIM/oph_defects/viewer2/research/LR/lepton_run.json`, fetched as `/rl/LR/lepton_run.json`. It has 112,673 bytes, sha256 `fd1ca1b20bcde5a3a9b061a375c4e969fbe2678d28571b333a47560916294d7e`, and its status line reads "done". The same bytes are kept as `lepton_run.json` in the lane directory.
  - `SIM/oph_defects/viewer2/research/LR/progress.json`, status "done".
- **What the page reads.** The parser `parseRun` of `lepton_round.js` was run on the file with node. It finds the series `phase_against_ticks` with 33 points, x = `ticks_per_unit_clock_time`, y = `phase_per_unit_clock_time`; `phase_limit`; the group `executed_rates` with `executed`, `formula` and `one_round` for tau, muon and electron; nine statements; the field documentation under `fields`.
- **Other documented fields.** `status`, `gates`, `run_by_elapsed_rounds`, `limits`, `public_walk_run`, `complete_record`, `orderings`, `forward_only`, `no_return_test`, `no_reset`, `double_load_register`, `native_pair_register`, `mass_rounds`, `with_executed_current`, `separation` with thresholds and three curves, `circulation`, `comparison_not_blind`.
- **Hook lines for the coordinator.**
  - No change to `index.html` or `app.js` is needed. The Leptons page already fetches the file.
  - `viewer2/research/manifest.json`, one entry: `{ "source": "LR/lepton_run.json", "sha256": "fd1ca1b20bcde5a3a9b061a375c4e969fbe2678d28571b333a47560916294d7e", "bytes": 112673 }`.
  - `links.js`, key `lepton`, two links that exist on the public main branch: `['Executable: the lepton register, its weak round and its read counts', RER + 'model/lepton_register_round/README.md']` and `['Proof: the register, the weak round, the read counts', RER + 'model/lepton_register_round/PROOF.md']`.
  - A link to this report needs a public copy first. Suggested path: `DER + 'work/SIM/phase2/LR/RESULT.md'`.
- **Wording for the page.** The executed rates are labelled "one premise" at most. The comparison rows are labelled not blind, with CODATA 2022 and PDG as sources. The separation times are a property of the declared readout instrument.
- **Candidate for the public package.** `rer_package/rounds.py`, `test_rounds.py`, `PROOF_SECTION_8.md`, with the placement in `WHERE.md`. Nothing was written to the public repository.
