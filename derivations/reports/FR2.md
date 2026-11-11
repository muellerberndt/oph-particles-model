## RESULT

V is native. Of the three open pieces, none exists in the form the register needs: the law re-prepares a definite source only at two ticks and then gives a different compression, it has an oriented current but that current does not implement T, and it performs no entangled two-object analyzer. A one-instance variant (the dimer chain below) keeps the circulant without any cross-object analyzer, but loses the 2/9 count.

All round-2 constructions were registered in `ROUND2_REGISTER.md` before computing. Every registered prediction held except one label: under the one-sided V it is address − that hops and address + that holds.

**1. V is native (EXACT, own construction).**
- The native signed current (coin 0, raw 1 means 2→3) fixes the coherent record's frame. Requiring the law's agreeing branch, record 1 carrying the sign of the native current, and U² = 1 leaves one reflection: the law's unitary of the native-order address, used at both addresses.
- On blank records this equals V·Q, which is also LNAT3's squared quarter-turns. On written records it is the conjugation Z·U·Z, which differs from a V applied after every event.
- On the C seam the native order 2→3 is the f screen orientation, so the completion is V exactly. On the E seam it differs by a global record sign, and the compression is unchanged.
- The repository's `transported_record` reverses the current exactly when the coherent frame flips (120 of 120 cases).
- Port 2, the native reset port, is the native-frame tail of both seams.

**2. Source mechanisms (EXACT).**

| Mechanism | Definite source restored | Compression |
|---|---|---|
| Native-frame law, records reused | yes, every second tick: (Q_or R₂)² = 1 | odd tick 2j+1: (√2/3)[√(1/6) I + √(1/12)(z^(j+1) R^(j+1) + h.c.)]; even ticks (√3/9) I |
| Plain law | alternates: (Q R₂)² exchanges tail and head, period 4 | sign of the pair reversed |
| One-sided V every tick | address − hops, address + holds | quadrature (LNAT3) |
| Program's return detector after two ticks | yes, by the outcome | K₀ = (5/6) I + (1/12)(zR + z⁻¹R⁻¹) every cycle, abs(b)/a = 1/10 |
| Sixty-address walk | no | return amplitude 11/12, 41/60, 1871/5400, −1109/40500, …; mean 1/12 |
| Fresh register per tick (declared) | yes | (√2/3) C(θ) every tick, by construction |

- With the native-frame record the balance 1/√2 holds at every odd tick, while the phase and the step accumulate. Tick 5 is a scalar because R³ = 1.
- A re-preparation that keeps (√2/3) C(θ) per tick is found only as the declared reset. The first-order amplitudes sit on the record-1 flags, and reading them leaves the load in the agreeing state.

**3. Native coupling for T (EXACT).**
- The law has an oriented current with load motion in the total-two sector: |20,0⟩ → |11,2⟩ and |02,0⟩ → |11,3⟩ with amplitude one, and a seam with both ends loaded is kept. Record values 2 and 3 are orthogonal records of the emitting endpoint.
- The plain law's two-tick exchange also moves a single load across the seam.
- Neither gives the pair ρ_f, ρ_f⁻¹ from one source. F and T stay declared.
- Dimer chain (ports 0, 10, 2, 3; one load at each end of E; one address register): one tick gives E kept 1/3, C repair 1/6 from port 2 (forward), C′ repair 1/6 from port 10 (backward). That is 2 : 1 : 1 from the address weights alone, with both sources definite and no activity factor.

**4. Analyzer (EXACT).**
- Across two independent objects none is native, as LNAT3 showed. My derived consensus (the other object read in the uniform state of its non-designated outcomes) gives (1/2) C(θ) with both loads at port 2 in the native frame. It still has rank 2 across the two objects.
- In the dimer chain the three flags are states of one instance's registers. The flag vector with the repaired load in its agreeing state gives √(2/3) C(θ) exactly, but only in a record frame oriented away from the dimer. The screen frame gives the quadrature form.
- The law's own projectors on that instance miss the balance:
  - uniform address with the record in (|0⟩+|1⟩)/√2 and the loads returned gives abs(b)/a = 1/4;
  - the record-0 consensus is the scalar 2/3;
  - the two-tick return is 1/3 − (1/6)(zR + z⁻¹R⁻¹).
- The three reads are exclusive in one instance, so P(R+ xor H) = 1/2 with six addresses. LNAT3's dichotomy stands: 2/9 needs independent objects, and the one-instance form loses it.

**5. CK's results on record (recomputed, `fr8_ck_record.json`).**
- ⟨I − Re U⟩ = P(record 1) on blank records, which is (α − β)²/2 from the SWAP form.
- θ_N = N·arg(7/9 + (2/9)e^(i/N)) = 2/9 − 35/(2187 N²); checked up to N = 10000.

## EVIDENCE

- Repository read at `reverse-engineering-reality`, with the manifest hash guard passing.
- Everything: `sh work/FR/run_all.sh`. I ran the three round-2 scripts individually; the combined script was not rerun after adding them.
- Round 2, from `RL/work/FR` with `PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python -B <script>`:
  - `fr5_native_record.py` → `fr5_native_record.json` (item 1)
  - `fr6_source.py` → `fr6_source.json` (item 2)
  - `fr7_coupling_analyzer.py` → `fr7_coupling_analyzer.json` (items 3 and 4)
- Registration: `ROUND2_REGISTER.md`, including the addendum written after LNAT3.

## WHAT THIS DOES NOT ESTABLISH

- F, T and the three-flag vector remain declared. The dimer-chain vector is not an outcome the law itself performs, and its away-from-dimer record frame is a new declared convention.
- The 2/9 count for the one-instance register; θ, the dressing and the mass readout were left to CK and DR.
- The chain beyond two ticks, a two-load walk on the full hexagon, and any stationary state of it. Only local facts and one or two ticks were computed.
- That the accumulating phase at odd ticks is the clock.

## NEXT

1. Build the two-load walk on the hexagon (six ports, twelve addresses, four-valued record) and test whether the E-kept dimer is stationary, with √(2/3) C(θ) as its per-tick compression.
2. CK: evaluate the clock on the one-instance register, where the reads are exclusive, against the two-object count.
3. CK and DR: assess the native-frame odd-tick form, with phase (j+1)θ and the balance kept, as a phase per two ticks.
4. Construct F as the dimer index of a load emitted by a double load, and compute the emission and hold amplitudes over two ticks.
