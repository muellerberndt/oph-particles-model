## RESULT

**Yes: in the weak round with the inverse tick, every round reads the tick-1 weights, the count per unit clock time is exactly 2/9 in the limit, and the period average 8/27 never enters.** Computed in FR's hexagon model with two independent symmetric double loads; all registered predictions held (EXACT).

- **The round.** One tick W on each object, the kick exp(−ihJ⊗Qx) on the exclusive-read projector, the inverse tick W⁻¹, then a return test.
- **Tick-1 weights each round.** W⁻¹W S = S exactly. One tick from S gives (2/3, 1/6, 1/12, 1/12), so P = 2/9. The zero-return amplitude is 1 − P + P·e^(−ihj), and a zero return leaves the pair in S⊗S, so round n+1 starts as round 1.
- **Phase per unit clock time.** 0.205334 at N = 1, 0.222062 at N = 10, 0.222222206 at N = 1000, limit 2/9. The object never advances along its six-tick period.
- **Controls.**
  - Forward only on the same objects gives FR's counts 2/9, 35/81, 38/81, 35/81, 2/9, 0, mean 8/27.
  - With the inverse tick but no return read between rounds, the rounds compose to one strong kick: 0.205334 at t = 1.

**What "fresh" requires of the source.** Neither re-preparation of the double load nor a reservoir of them.

- The kick only flags the address at which the double would emit. The inverse tick restores a double load with a blank record in every branch.
- The whole non-return vector therefore has a blank record: a record read detects nothing. This is stronger than I predicted.
  - Object A: norm 11/144, of which 10/144 has a non-uniform address and 1/144 the antisymmetric double location.
  - Object B: norm 5/36, all with a non-uniform address.
- So the source must supply three things:
  1. the inverse tick, which the public program has (`Observer.inverse_step`, `model/coherent_seam_repair/program.py:115`);
  2. a return test on the address register and on the symmetric location after each round;
  3. a reset of the address consensus on a non-return, needed 14/(81N) times per unit clock time, which tends to zero.
- One standing pair in S, independent of the clocked register, serves every round. A forward-only round would instead consume N pairs per unit clock time.

**Theorem premises.** (E), (C), (T), (J) keep their form. (C) and (J) gain the explicit resource statements above; they are added as an addendum to `THEOREM.md`.

## EVIDENCE

- Registration before computing: `work/CK/FRESH_REGISTER.md` (08:30; outcomes appended after the run).
- Script and output: `work/CK/ck_fresh.py` → `ck_fresh.json`. Run from that directory with `PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=../FR /tmp/oph-completion-venv/bin/python -B ck_fresh.py` (about 3 s; FR's model imported read-only, manifest hashes matching).
- Full rebuild: `sh work/CK/run_all.sh`. `STATEMENTS.md` was re-matched against the checkout at `reverse-engineering-reality`, commit `3ee5e0652`: 76 entries, 0 unmatched.

## WHAT THIS DOES NOT ESTABLISH

- A source of the standing pair. FR found no entry to the double-load cycle.
- The return test for two-load objects as a repository operation. The public program has it only for the one-load preparation (`embedded_return_measurement`, `program.py:159`).
- Unit clock time per tick, premise (T). It is still undeclared in the stack.
- Independence of the standing pair from the clocked register on one carrier. FR5 shows hexagons share ports and that 2/9 needs independent address registers.
- The sixty-address carrier. The computation is in FR's twelve-address hexagon model, native frame.
- That the source performs the kick coupling J to the pair's flag projector. It remains declared apparatus.
