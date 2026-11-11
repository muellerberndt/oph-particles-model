## RESULT

The exclusive count 2/9 and the 1 : 1/√2 : 1/√2 amplitudes do occur together in the law's own states, but only at one tick out of the double-load configuration, not at every tick of the period. The law has no source of the double load from blank records. A Gauss-neutral carrier with order-one transfer exists (the double load itself), and the w and w² generations do not split.

Everything was registered in `ROUND4_REGISTER.md` before computing, and every registered prediction held.

**1. Phase count (EXACT).** The arrangement is two independent symmetric double loads, each on its own hexagon. One is read for its emission across E (hold), the other for its emissions across the C-type seams (rotations).
- At one tick from the double-load configuration the object weights are 2/3, 1/6, 1/12, 1/12. These equal the round-1 weights, with no imported activity and no record frame.
- The round-1 analyzer then gives (√2/3) C(θ), and tr(M†M) = P(R+ xor H) = 2/9.
- The ratio in-dimer : forward : backward is 2 : 1 : 1 at every tick of the six-tick period. The count is not constant:

| Tick | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Emitted weight, in-dimer | 1/6 | 7/18 | 4/9 | 7/18 | 1/6 | 0 |
| Exclusive count, two objects | 2/9 | 35/81 | 38/81 | 35/81 | 2/9 | 0 |
| One object alone | 1/4 | 7/12 | 2/3 | 7/12 | 1/4 | 0 |

- Over the period the two-object count sums to 16/9, a mean of 8/27 per tick. It equals 2/9 exactly when the forward weight is 1/12, which is ticks 1 and 5.
- A double load paired with the round-1 E object as hold also gives 2/9 at tick 1. Both objects in the period-averaged state give 7/18.

**2. Source of the double load (EXACT).** Nothing in the law puts two loads on one port starting from blank records.
- The classical native rule never creates a doubly loaded port; doubles only split.
- In the coherent law a seam with both ends loaded and a blank record is kept. The sector with distinct ports and records 0, 1 is closed.
- A both-ends-loaded E seam is absorbed into a double load only when the record already reads 2 or 3, with weight 1/6 per tick on the hexagon. The symmetric record gives the symmetric double state, also with weight 1/6. That state and the E-kept dimer carrying such a record are two points of one cycle, and the cycle has no entry from blank records.
- A class-3 link sign changes nothing: the both-ends-loaded seam stays kept.
- Doubly loaded ports are in the native state space (12 of 78 total-two states, 2/13) and outside the native matching code.
- The reset port concerns memory labels, not loads: the native family memory sits at port 2 with stationary weight 1206/1291, and two independent memories are both there with weight 0.8727.

**3. Gauss-neutral carrier (EXACT).** It is the double load itself, which has charge two under a Z2 link.
- In the plain law the pair crosses a seam as a unit in two ticks with amplitude one. A gauge sign on the seam leaves that amplitude unchanged and flips the single-load crossing.
- In the native frame there is no crossing; the pair is re-absorbed at its port.
- Hexagon, plain law, transfer between the dimer-symmetric double states:

| Tick | Hold r | To each neighbour t |
|---|---|---|
| 2 | −1/36 | 1/72 |
| 3 | −49/108 | 13/216 |
| 4 | −20/81 | 10/81 |
| 6 | 8743/11664 | 2921/23328 |

- The transfer is equal in both directions at every tick, so the operator is r + t(R + R⁻¹) with real t, and the w and w² generations stay degenerate.
- The total r + 2t follows the same period-six function as the native-frame hold: 0 at tick 2, −1/3 at tick 3, 1 at tick 6.
- A double load at each end of one seam puts four loads on that seam, which the law's local unitary does not define.

**4. Flag sum as a spectral projector (EXACT).** The cycle's projectors do not perform it.
- The invariant block has eigenvectors (1,1,1), (−2,1,1), (0,−1,1) with eigenvalues 1, 1/2, 5/6.
- The period average sums the three flags with coefficients proportional to their amplitudes, (√2, 1, 1). That yields abs(b)/a = 1/2.
- The uniform sum that yields 1/√2 is not a spectral projector of the cycle.

## EVIDENCE

- `work/FR/fr10_round4.py` → `fr10_round4.json` (about 4 s), run from that directory with `PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python -B fr10_round4.py`.
- Registration: `ROUND4_REGISTER.md`. `run_all.sh` lists the script; I did not rerun the whole chain.
- The public checkout moved back to `reverse-engineering-reality` during this round. `fr_common.py` now accepts both paths and still falls back to the hash-checked snapshot. The final run read the checkout at the old path with the manifest hashes matching.

## WHAT THIS DOES NOT ESTABLISH

- A count of 2/9 at every tick, or which tick of the period the clock reads. θ stays with CK.
- Any source of the double load, or of a record reading 2 or 3 on an E-kept dimer, from blank-record states.
- Independence of two double-load objects on one carrier. Separate hexagon instances were assumed; hexagons of different face axes share ports.
- A split of the w and w² generations. Every walk here is real.
- The 2 : 1 : 1 occupation ratio beyond tick 1 in the plain law, where part of the weight moves to neighbouring doubles (round-3 two-tick weights 7/18 : 37/216 : 37/216).
- The uniform flag sum as an operation of the law.

## NEXT

1. CK: put the clock on the emission record of the two-object arrangement and state which tick it reads. The count is 2/9 at ticks 1 and 5 and 16/9 per period.
2. Find an entry to the cycle: an operation of the program that writes record 2 or 3 on an E-kept dimer. The apparatus detectors and quarter-turns act on the record, and a glue seam between carriers is the other candidate.
3. Compute the joint count for two hexagons on one carrier that share ports.
4. Add the clock phase to the plain-law pair transport and test whether the dimer circulant then separates w from w².
