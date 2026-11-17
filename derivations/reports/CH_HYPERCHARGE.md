## RESULT

**Derived (EXACT unless marked).** The source as built runs the one-loop slopes **(81/10, 5/6, -3)** from M_U to m_Z with **no threshold**, and its twelve links gauge hypercharge with the SU(5) normalisation **c_Y = 5/3**.

- **Content.** 32 Weyl blocks per copy (16 + 16bar), three copies, twelve links, one complex doublet.
- **Why the hypercharge fails.** The 16bar half is a sum of complete multiplets and adds (4, 4, 4). The slope differences are therefore the Standard Model's, (b1 - b2, b2 - b3) = (109/15, 23/6). At one loop with equal couplings at M_U, (1/a2 - 1/a3)/(1/a1 - 1/a2) at m_Z equals (b2 - b3)/(b1 - b2) = 115/218. This holds whatever the closure, the law for v, or any threshold of the 16bar half. The declared slopes give 5/7. The measured couplings give 0.717 (NOT BLIND, look 19).
- **Chain with LV's law (m = 2).** 1/alpha_U = 24.822, v = 222.9 GeV (229.2 GeV with theta_0 = g/(2 sqrt2)), 1/alpha_2 = 29.24, alpha_s = 0.1123, sin^2 = 0.2056, 1/alpha_em = 142.25.
- **Against measurement (NOT BLIND).** v -9.5 %, alpha_s -4.8 %, sin^2 -11.1 %, 1/alpha_em +11.2 %.

**The single item still missing: incomplete multiplets in the running.**
- The declared chain uses differences (28/5, 4); the source supplies (109/15, 23/6). The gap is (-5/3, +1/6).
- **The +1/6 needs a second complex doublet.** Each Weyl pattern multiplet moves b2 - b3 in steps of 1/3, and a complex doublet moves it by 1/6.
- **The rest needs either of two things.** One option is 8/5 less in b1, for example four fewer charged class-0 Weyl blocks. The other is c_Y = 1.087 in place of 5/3.
- Nothing on file supplies either part.

**Results by task:**

1. **Census coefficients are confirmed.**
   - All 26 censuses on file (DB, DB2, DB3) equal the values computed from the charges in `match.py`.
   - CEN-1 gives (8 + n_H/10, 2/3 + n_H/6, -3).
   - All 16 handedness functions give the same slopes.
2. **LV's one-doublet statement holds, checked independently.**
   - DO-1 and DO-2 ran before I read LV's report: UH's four oscillators carry one normal doublet operator, and the ring Hamiltonian has two positive-frequency branches per wave number.
   - DO-10, run afterwards: the +3 and -3 orientations are quantum and antiquantum of one field.
   - One register serves all four channel types. A second class-3 unit is absent.
3. **No mass term pairs a 16 with a 16bar.**
   - The current-invariant bilinears between a pattern and its complement are 12 pairings and one hop between 00000 and 11111. All are Z6 class 0, so the class rule adds nothing beyond the twelve currents.
   - DG's B - L permits the pairings (they change B - L by 0) and forbids only the hop (it changes B - L by 2).
   - What forbids the pairings is the number of quanta N: they change it by 2. Every operation commutes with n3, the complement sends n3 to 3 - n3, and every operation acts on one quantum (MT-6).
   - **No threshold between m_Z and M_U is on file.**
     - Toggle masses are electroweak, and each mirror species has its partner's angle.
     - The M3 tower sits at 118 to 226 M_U, the M1 option at 16 to 66 M_U, and the register's induced mass at 193 to 379 M_U.
   - **The chain needs the 16bar running down to m_Z.** If it leaves anywhere from 300 GeV to 1e12 GeV, the chain has no physical root (scan TS-1). The reason: the coefficient of 1/alpha_U in 1/alpha_3 at the reading scale is 1 + b3/4. That is +1/4 with the 16bar running and -3/4 with the Standard Model slope.
4. **The U(1) is hypercharge**, the one-dimensional centre of the algebra the twelve currents generate: Y = diag(-1/3 x3, 1/2 x2). c_Y by trace:

| Trace | c_Y |
| --- | --- |
| Every complete trace, including GL's 5-trace and 15-trace actions | 5/3 |
| Doublet block | 1 |
| Colour block | 2/3 |
| N10 (native link sectors of the 15-state module; also c3/c2 = 9/10) | 4/5 |
| Port metric | 1/3 |
| Block-wise swap test | 0 |
| GL's bare equality at M_U plus BF's matching shifts (V14) | 1.75 to 1.89 effective |

5. **1/alpha_1(m_Z) = 59.22** needs b1 = 33/5 at c_Y = 5/3, or c_Y = 1.0867 (two doublets, m = 1), or c_Y = 1.0922 (one doublet, m = 2, solved inside the chain).
   - The first run's linear estimate of 1.1229 used the declared chain's 1/alpha_U and logarithm; the in-chain solve corrects it to 1.0922.
   - No trace on file has these values.
6. **Outputs per variant (GeV; NOT BLIND percentages for sin^2 and 1/alpha_em):**

| Variant | 1/alpha_U | v | alpha_s | sin^2 | 1/alpha_em |
| --- | --- | --- | --- | --- | --- |
| one doublet, m = 2, c_Y 5/3 (source as built) | 24.822 | 222.9 | 0.1123 | 0.2056 (-11.1 %) | 142.25 (+11.2 %) |
| one doublet, m = 2, c_Y 1 | 24.819 | 224.1 | 0.1122 | 0.2327 (+0.6 %) | 125.64 (-1.8 %) |
| two doublets, m = 1, c_Y 5/3 | 24.319 | 245.9 | 0.1184 | 0.2079 (-10.1 %) | 142.46 (+11.3 %) |
| two doublets, m = 1, c_Y 1 | 24.316 | 246.7 | 0.1183 | 0.2346 (+1.5 %) | 126.19 (-1.4 %) |
| no doublet below M_U (register at the cell), m = 2, c_Y 5/3 | 25.457 | 82.2 | 0.1104 | 0.2015 | 144.40 |
| declared (33/5, 1, -3) | 24.317 | 246.6 | 0.1183 | 0.2307 | 128.31 |

- V13, V14 and V16 fail by 4 to 22 % in sin^2.
- V5 (one doublet, c_Y = 1, prefactor 1) passes the hypercharge rule, but its v is 91 GeV (-63 %).

## EVIDENCE

Everything is in `work/CH/`. Run each script there with `env PYTHONDONTWRITEBYTECODE=1 python <script>`.

- **This run:**
  - `ch_r2_checks.py`: the census cross-check, MT-6 and MT-7 (0.4 s).
  - `ch_chain3.py`: V14, V15, V16 and FA' (2 s; gated on the SA and SB rows to 1e-9).
  - `ch_compare3.py`: comparison run 3, NOT BLIND.
  - `ch_threshold.py`: TS-1 and comparison run 4, NOT BLIND, no weight.
- **First run (cited, not rerun):** `census`, `massterm`, `doublet` 1 to 3, `u1`, `chain`, `outer`, `compare`, `chain2`.
- **`run_all.sh`** lists the exact scripts in order. It was not executed as a whole in this run.
- **Registration.** `CANDIDATES.md` holds sections 1 to 7, addenda 1 to 5, and section 8 (Outcomes, written in this run). Hashes and times are in `PREREG.sha256` (09:44, 10:00, 11:32, 11:38, 11:43) and `ROWS_BEFORE_COMPARISON.sha256` (10:05 and 11:35); all of them verify. Script hashes are in `SCRIPTS.sha256`.
- **Count.** 19 mental looks and 4 comparison runs. The first execution of `ch_threshold.py` stopped on a JSON error before printing anything.
- **Read only.** `work/MATCH`, `DB`, `BF`, `DG`, `LV`, `COUPLING`, `UH`. The RER checkout was not touched.

## WHAT THIS DOES NOT ESTABLISH

- **One loop only.** v needs 1/alpha_U to 0.006, which two-loop and threshold terms exceed.
- **The census reading needs the empty reference.** CEN-1 counts all 32 patterns as independent species. With complements read as holes (R1's filled reference), the slopes are the Standard Model's and the chain has no root.
- **The mass-term verdict rests on DG's operation list.** A register that changes N by 2 would change it.
- **The mirror half is unresolved.** The chain needs it running to m_Z, and collider data exclude it (brief, NOT BLIND).
- **Mirror masses.** Each mirror species has its partner's mass only under the one-amplitude vertex. Gauge invariance allows four amplitudes (R8).
- **v's miss mixes two effects.** The -9.5 % in v combines LV's open b·m with b2 = 5/6.
- **Partial traces have no action on file.** This covers the doublet block, N10 and the port metric.

## NEXT

1. **Coordinator or owner: the chain's content premise.** The source as built fails sin^2 and alpha_s for any threshold of the 16bar half. The declared slopes stand for incomplete multiplets that the source does not contain.
2. **Second doublet.** The only route on file is an integer lift of the class-3 register (flux ±9 against ±3; SS NEXT 2, DB3 G3), which needs the twist records on box A. With m = 2, two doublets give v = 576 GeV, so the doublet count and the multiplicity have to be decided together with LV2.
3. **Hypercharge.** Look for a source reason that removes 8/5 from b1, or for a U(1) stiffness of the smallest collar near 1.09/alpha_U. Neither has a candidate on file.
4. **CA and CU (reading scale).** A root needs 1 + b3/4 > 0 above the reading scale. Changing the reading scale or the beta of the law for v changes this condition.
