## RESULT

**Derived (EXACT, given FR's declared register).** On the full carrier the count 2/9 comes from two cells with independent address registers, read by the law's own record. One carrier with one register cannot give it. The single missing item is a source rule that reads exactly one second cell as the hold.

1. **Address statistics.** With the uniform consensus over the sixty ordered seams, the tail of the address is a given port with weight 1/12 and the head with 1/12. The address touches the port with 1/6 and one of two non-adjacent ports with 1/3 (FR's imported activity, now 20/60).
2. **The record carries it.** A double load at any port, in the plain law of the public program:
   - blank 5/6, record 2 with 1/12, record 3 with 1/12, all amplitudes positive;
   - records 2 and 3 are the two signs of the native current in the order of the address (checked on all 12 × 60 cases);
   - the screen frame of every face gives the same weights (240 cases); a frame that orients every seam gives out-degree/30 and in-degree/30, unequal at every port.
3. **Configuration with 2/9.** The cell with the defect has R+ = record 2 and R− = record 3. One second cell has H = record written.
   - P(R+) = 1/12, P(H) = 1/6, P(R+ and H) = 1/72, count 2/9, ratio 2 : 1 : 1, the same at each of the twelve ports.
   - With n = 12 ports the count is 3/n − 4/n².
   - FR's analyzer gives M = √(5/18)·C(θ), balance 1/√2, mass ratios unchanged, tr Y = 5/18.
   - Native pairs on non-adjacent ports (the 36 pairs of the matching code) give 2/3, 1/6, 1/12, 1/12, M = (√2/3)·C(θ), tr Y = 2/9.
4. **Why two cells.**
   - With one register and a definite configuration every weight is a multiple of 1/240, and 2/9 is not.
   - A class-3 link sign changes no weight, so the flux does not reduce the sixty addresses to a hexagon.
   - The public spatial circuit gives every cell its own register (`model/coherent_defect_wave/spatial/PROOF.md` 5 to 21).
   - Its exchange gate has a + b = 1 and acts as the identity on cells in equal states (ARGUED for two-load cells).
5. **FR's hexagon model.** It is the carrier with the address prepared on the twelve hexagon addresses (weight 1/5 of the consensus) and reflected inside them.
   - That prepared state gives 2/9 with the hexagon flags and 7/18 with the record flags.
   - The consensus over sixty gives 11/225 with the hexagon flags and 2/9 with the record flags.
6. **Weak round on sixty addresses (CK2 ported).** Zero-return amplitude 1 − 2/9 + (2/9)e^(−ihj); phase 0.205334 (N = 1), 0.222062 (N = 10), limit 2/9. Non-return norms are 11/144 and 5/36, with blank record, same port and no uniform-address part, so only the address consensus is reset. Forward only, the count is 2/9 at tick 1 and 0.486, 0.536, 0.467 after.
7. **LK's additions.**
   - The kick as commutator of the oriented toggle holds on all 3600 branches (h = 2η).
   - The crossing holds on all 30 seams from both ends in the plain law, with a two-orientation register beside the sixty; in an echo frame the double returns.
   - With the sixty-address register alone the crossing has weight 1/30 from the consensus.
   - With record flags the coefficient is 2/9 at every port, so the round needs no symmetric location, no T_sym and no crossing.
   - With hexagon flags on sixty the coefficients alternate 29/450 and 1/30 (mean 11/225); LK's 5/18 and 1/6 are reproduced on twelve addresses.
   - Crossing by configuration: defined in two cells; defined for two double loads in one cell (120 of 300 land next to B from distance two); a symmetric double is unchanged by it.
   - CK2 correction on the carrier: hexagon forward flag 29/1800 plus 1/3600 antisymmetric; record flag 11/144 plus 0.

| Configuration | Reading | P(R+) | P(H) | P(R+ and H) | Count | 2 : 1 : 1 | Weak round |
|---|---|---|---|---|---|---|---|
| two cells, double load in each | record | 1/12 | 1/6 | 1/72 | **2/9** | yes | returns; "no" 14/81 |
| two cells, native pair in each | repair, agree | 1/12 | 1/6 | 1/72 | **2/9** | yes | returns |
| two cells, hexagon flags | FR | 1/60 | 1/30 | 1/1800 | 11/225 | yes | returns |
| two cells, one load each | FR | 1/24 | 1/12 | 1/288 | 17/144 | yes | returns |
| one carrier, two double loads, non-adjacent | record | 1/12 | 1/6 | 0 | 1/4 | yes | returns |
| one carrier, adjacent ports; two faces of one axis | any | | | | not defined | | |
| one carrier, hexagon flags, separations 1 to 4 | FR | 1/60 | 1/30 | 0 | 1/20 | yes | returns |
| one carrier, the two loads of one pair | FR | 1/24 | 1/12 | 0 | 1/8 | yes | returns |
| glue seam in both registers (62; 84 addresses) | record | 5/62; 1/14 | 5/31; 1/7 | product | 415/1922; 19/98 | yes | returns |
| one register over two carriers | record | 1/24 | 1/12 | 0 | 1/8 | yes | returns |
| one double load, two registers in sequence | record | 1/12 | 5/36 | 0 | **2/9** | 5 : 3 : 3 | returns |
| n hold cells read at once (n = 2, 3) | record | 1/12 | 11/36, 91/216 | product | 73/216, 563/1296 | no | returns |

All 50 rows are in `TABLE.md`: 46 are defined, 12 have 2/9, and 8 of those have 2 : 1 : 1.

**Missing item in detail.** A simultaneous read of n hold cells gives 1/12 + (5/6)(1 − (5/6)^n). Partners read one at a time with a shared kick give 2/9 for every n. Two source statements point at one partner: every edge layer of the spatial circuit is a matching, and the vertex 3 + 3 → 0 has two class-3 legs (lead A). Neither selects the cell or one read per unit clock time.

## EVIDENCE

Everything is in `work/LC/`.

- Rebuild: `sh run_all.sh` (exit 0; about one minute of CPU, each script under two minutes on the loaded machine).
- Single scripts, from that directory: `PYTHONDONTWRITEBYTECODE=1 python -B <script>`
  - `lc1_port.py`: one-object statistics
  - `lc2_configs.py`: configurations
  - `lc3_round.py`: weak round
  - `lc4_register.py`: compression, frames, ensembles
  - `lc5_checks.py`: model against `Observer.repair` on 1440 basis states; 26 repository statements matched, 0 unmatched, commit 3ee5e0652
  - `lc6_sequential.py`: current records, two events in sequence
  - `lc8_sensitivity.py`: sensitivities, shared kick
  - `lc9_crossing.py`: LK's crossing and kick
  - `lc7_table.py`: builds `TABLE.md`
- Registration: `CANDIDATES.md` with eight addenda, hashed before each script (`PREREG.sha256`, first hash 09:13:07; `CANDIDATES_PREREG.md` is the first version).
- Predictions that failed:
  - S10 in the screen frame: the cyclic space has dimension four, not two.
  - A14's per-cell split is −1/20 and −1/8, not −7/80 each.
- Not registered by hand: one glue-seam row (218/961) and B7 at port distance two (131/600). X7's hexagon numbers were already in `lc3_round.json` when the addendum was written.
- The target 2/9 was known, so choosing a row by its count is NOT BLIND. No measured value was read.
- Definitions and decision: `REGISTER60.md`, `DECISION.md`.
- RER and `work/FR` were only read.

## WHAT THIS DOES NOT ESTABLISH

- **One second cell.** The source does not select the partner cell, the layer, or one read per unit clock time.
- **Two loads per cell.** The public spatial circuit runs one load per cell. With FR's flags that gives 17/144. The two-load cell walk is my port of the local completion.
- **The family step.** T on the sign of the current, the analyzer and the kick remain FR's and CK's declared items. The public native cycle applies one rotation for a nonzero C current, with no sign rule.
- **The choice of two cells over one object read twice.** One object read twice also has 2/9, with ratio 5 : 3 : 3. The choice rests on the 2 : 1 : 1 balance, which is equivalent to Q = 2/3 and is NOT BLIND through the comparison on file.
- **The edge-sharing family of CF-1.** There each port sits in two carriers; only the one-object case was computed.
- **Later ticks without the inverse tick.** The double load has no period on sixty addresses.
- **Steps L3 and L5 to L8.** In the double-load form the rates sum to 5/18, so the scale F changes by 4/5.

## NEXT

1. **Coordinator:** restate L4 as "two cells, record flags", and decide whether the standing objects are double loads (tr Y = 5/18) or native pairs (tr Y = 2/9, needs FR's record sign).
2. **LP (L1):** any of 48 of the 78 total-two configurations of a cell gives 1/12, 1/12, 5/6, in the classical rule and in the completion. The double-load entry problem then concerns only the choice of form.
3. **LK (L2):** on the carrier the round takes two ticks, and the return test is the address consensus alone. The toggle couples the record of the defect's cell to the flag parity of two cells.
4. **LT (L3):** decide whether unit clock time is one two-cell event. Six matching layers per tick would give 4/3 per tick if each carries a full kick.
5. **LD (L5):** J is the same transport read at the reversed address, which is DR3's second case. Exact sensitivities of the count: −7/8 per relative register dilution, −7/40 per weight of adjacent pairs (−1/20 for the defect's cell, −1/8 for the hold cell), +7/8 per relative load number.
6. **Audit team:** a two-load cell program in the spatial circuit, meaning the local completion at every address.
