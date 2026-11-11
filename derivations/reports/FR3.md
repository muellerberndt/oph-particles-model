## RESULT

The lepton balance can be a periodic property of the law, in one state: two loads on one port of an E seam, taken symmetrically over its two ends. The E-kept dimer is not stationary and loses the form after one tick. The 2/9 phase count and a Gauss-neutral carrier of the generation index are still missing.

All constructions were registered in `ROUND3_REGISTER.md` before computing. Two predictions failed in detail: eigenvalue 1 is not simple on the sector with records 0 and 1 (multiplicity 8), and the dimer's stationary weight is 1/12, of which 1/15 sits on the uniform state.

**1. The two-load hexagon walk (EXACT; spectrum listing in floats).**
- Model: six ports, twelve addresses, four-valued record, the law's own local unitary, native-frame record transported by the third-turn.
- The sector with distinct ports and records 0, 1 is closed (30 states). Its discriminant eigenvalues are 0.0731, 0.1890, 0.7018, 0.7603, 5/6, 0.9426 and 1; there is no eigenvalue −1.
- The E-kept dimer {10, 2} is not stationary. Half its weight sits on eigenvalue 5/6, and its return amplitudes are 5/6, 4/9, 1/27, −23/81, −1/2, −5/9.
- With the two loads themselves as the generation index (no added register), transfer to the neighbouring dimers is zero for three ticks, then 1/162, 1/27, 77/729. It is real and equal in both directions, so the w and w² generations stay degenerate.

**2. One tick from the dimer (EXACT).**

| Read | Weight |
|---|---|
| E addressed, kept (hold) | 1/6 |
| C repair from port 2 (forward) | 1/12 |
| C′ repair from port 10 (backward) | 1/12 |
| C agrees, C′ agrees | 1/12 each |
| address on the other three seams | 1/2 |

- These are DA3's numbers with no activity factor: the twelve hexagon addresses supply them.
- The three-flag compression is C(θ)/√3 only in a record frame oriented away from the dimer. In the native and screen frames the backward repair carries a minus sign and the result is the quadrature form. In the plain law both repairs cancel.
- The form does not repeat. At tick 2, abs(b)/a = 9/(4√2); at tick 3 the powers y and y² mix.

**3. Read counts when the reads are exclusive.**
- P(R+ xor H) = 1/4, and P(exactly one of the three reads) = 1/3, which equals tr(M†M) for this analyzer.
- 2/9 does not occur. CK's equality of the exclusive count with tr Y holds only for two independent objects.
- The native-frame odd-tick form from round 2 advances the phase by θ per two ticks, so θ/2 per tick.

**4. Emission from a double load (EXACT).**
- Two loads at port 2: the subspace (double load, emitted across C, emitted across E) is invariant, with discriminant eigenvalues 1, 1/2 and 5/6. The double load is therefore periodic with period six ticks.
- Over ticks 1 to 6, in the uniform-address states, the hold amplitude is 2/3, 0, −1/3, 0, 2/3, 1 and each emission amplitude is 1/6, 1/2, 2/3, 1/2, 1/6, 0.
- At two ticks the hold amplitude is 0 and each emission amplitude is 1/2. By weight, hold is 2/9 and each emission 7/18.
- Emission moves the load and writes the direction into orthogonal record values. Across C the emitted load lands in the next dimer (step ρ_f); across E it stays in the same dimer (identity).
- Symmetric double state (|2,2⟩ + |10,10⟩)/√2:
  - one tick gives the E-kept dimer with weight 1/6, forward 1/12, backward 1/12, no event 2/3;
  - all emission amplitudes are positive in every record frame, so no frame convention is needed;
  - the three-flag amplitude is C(θ)/√3 exactly;
  - the ratio identity : forward : backward = 1 : 1/√2 : 1/√2 holds at every tick of the period.
- With a class-3 defect on f the hexagon holonomy is −1. The dimer index of one emitted load therefore turns projectively (R³ = −1), which shifts the phase by π/3. A pair of loads turns with R³ = +1.

## EVIDENCE

- From `work/FR`, with `PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python -B <script>`:
  - `fr9_hexagon.py` → `fr9_hexagon.json` (about 2 s)
  - `fr9b_supplement.py` → `fr9b_supplement.json` (spectral weights, invariant subspace, twelve ticks)
- `run_all.sh` now lists both scripts; I ran them individually and did not rerun the whole script.
- Registration: `ROUND3_REGISTER.md`. Repository read at `repair-law/reverse-engineering-reality` with the manifest hash guard passing.

## WHAT THIS DOES NOT ESTABLISH

- A source of the symmetric double state. The native matching code has no doubly loaded port.
- The Fourier sum over the three emission flags as an outcome the law performs. Only its address part is the law's own consensus.
- A phase. The exclusive counts are 1/4 and 1/3; θ and the clock remain CK's.
- A Gauss-neutral generation index with order-one transfer. The single emitted load is charged, and the neutral pair index moves only at fourth order.
- The period-six statement beyond the uniform-address states of the hexagon model; the sixty-address carrier was not run.

## NEXT

1. Test whether iterates of W on the period-six subspace supply the flag sum. Their discrete Fourier transform over the cycle is a spectral projector built from operations the program has.
2. CK: put the clock on the emission record. The double-load mode has its own walk phase π/3 per tick (cos ω = 1/2); compare it with the counts 1/4 and 1/3.
3. Look for a neutral carrier: emission from a double load at each end (four loads), or a pair emitted together, and compute its transfer amplitudes.
4. Find what in the law produces two loads on one port. In the local unitary a double load forms from a both-ends-loaded seam only when the record already reads 2 or 3.
