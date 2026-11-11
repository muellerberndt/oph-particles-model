## RESULT

No operation of the source enters the double-load cycle, two hexagons on one carrier do not reproduce 2/9, and the clock phase separates the two winding generations only by an order-one ratio. Of the three phase values evaluated, only the tick-1 count 2/9 gives the lepton ratios.

Everything was registered in `ROUND5_REGISTER.md` before computing. One prediction was incomplete: the two-tick hold term of the pair transport depends on the phase (r = 1/9 − (5/72)(z + 1/z), not −1/36). The transfer terms were as predicted.

**1. Entries to the cycle (EXACT).**

| Candidate | Weight per tick | Reason |
|---|---|---|
| Glue seam, shared port occupations | 0 | the local unitary maps no state without a doubly loaded port and with record 0 or 1 into a double or into record 2, 3 |
| Detectors and quarter-turns | 0 | both are diagonal, so they conserve the weight of every record value; the one-load program's record has values 0 and 1 only |
| Class-3 flux (link sign) | 0 | the both-ends-loaded seam stays kept |
| Glue seam with carrier-labelled loads read jointly | not defined in the repository | under that declared reading two uniform loads coincide on a shared port with weight 1/144, 1/12 per carrier |

- The cycle sector is invariant, so its occupation is whatever the preparation puts there.
- In the tracial state of two loads that is 2/13 on a carrier and 2/7 on a hexagon.
- Inside the cycle the period average is double 13/27, in-dimer 7/27, forward 7/54, backward 7/54.

**2. Two hexagons on one carrier (EXACT).**
- Hexagons of two face axes share 2 ports and no seam (six axes) or 4 ports and 2 seams (three axes).
- Test case: the f hexagon with dimer {10, 2}, and the hexagon {5, 6, 8, 9, 10, 11} with dimer {8, 9}. They share ports 9 and 10.
- With one address register the reads are exclusive, so the count is a plain sum:

| Address register | Hold | Forward | Backward | Count |
|---|---|---|---|---|
| Carrier's sixty addresses | 1/30 | 1/60 | 1/60 | 1/20 |
| Union of the two hexagons (24 addresses) | 1/12 | 1/24 | 1/24 | 1/8 |
| Separate instances (round 4) | 1/6 | 1/12 | 1/12 | 2/9 |

- The 2 : 1 : 1 ratio holds in every case. The value 2/9 needs independent address registers.

**3. Clock phase on the plain-law pair transport (EXACT polynomials).**
- At two ticks the transfer terms are z/72 and 1/(72z), and the hold is 1/9 − (5/72)(z + 1/z).
- The two winding generations now separate. The ratio of their moduli, |λ₁|/|λ₂|:

| Tick | θ = 2/9 | θ = 8/27 |
|---|---|---|
| 2 | 1.325 | 1.502 |
| 4 | 1.300 | 1.428 |
| 6 | 0.861 | 0.822 |
| 8 | 1.259 | 1.369 |

- The separation is of order one and changes from tick to tick. It is not the lepton hierarchy.

**4. Phase per tick from the counts, and the ratios (energy reading m ∝ λ²; NOT BLIND comparison read last).**

| Phase per tick | Origin | In positive chamber | μ/e | τ/e |
|---|---|---|---|---|
| 2/9 | count at ticks 1 and 5 | yes | 206.770316 | 3477.4728 |
| 8/27 | period average (16/9 per period) | no, one eigenvalue is −0.0138 | 404.03 | 4817.46 |
| 4/27 | period average, one step per two ticks | yes | 16.13 | 400.52 |
| measured | | | 206.768283 | 3477.370 |

- The period average 8/27 exceeds π/12 = 0.2618 and gives Q = 0.6375.
- Only the count of the first tick out of the double-load configuration matches.

## EVIDENCE

- `work/FR/fr11_round5.py` → `fr11_round5.json` (about 2 s), run from that directory with `PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python -B fr11_round5.py`.
- Registration: `ROUND5_REGISTER.md`, including the third phase value 4/27 added before the run.
- Repository read at `reverse-engineering-reality` with the manifest hash guard passing.
- `run_all.sh` lists the script; the full chain was not rerun.

## WHAT THIS DOES NOT ESTABLISH

- Any entry to the cycle. The one open candidate is a federation law in which a glue seam reads the total occupation of a shared port, and the repository does not define it.
- Why a clock would read the first tick only. The 2/9 count belongs to that tick; the period average does not give the lepton ratios.
- Two independent address registers on one carrier beyond tick 1 (stated, not computed).
- A lepton hierarchy from the pair transport. With the clock its generations split by a factor between 0.82 and 1.50.
- θ itself, the mass reading and the dressing, which stay with CK and DR.

## NEXT

1. CK: the weak-round clock uses fresh records each round. Check that on the two double-load objects every fresh round has the tick-1 weights (2/3, 1/6, 1/12, 1/12), so that the count per unit clock time is 2/9 and the period average never enters.
2. Define the glue-seam event on a shared port with the audit team, then compute its entry weight and the resulting occupation. It is the only candidate left for a source of the double load.
3. Run two walkers with separate address registers on the two hexagons past tick 1, to see how long the reads stay independent.
