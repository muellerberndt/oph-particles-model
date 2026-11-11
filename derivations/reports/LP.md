## RESULT

**Derived.** Around a class-3 defect the source keeps exactly one two-load content: the pair on one port (double load) with its own emission states. Three independent statements select it, FR's count gives 2/9 on it, and LK's crossing is exact on it and blind to the defect.

**Still missing, one item:** a source operation that brings two separated loads onto one port. Every idle operation has entry weight zero, so the source selects the pair without producing it.

Your message is addressed in items 4 to 6 (one-port target, crossing, lead A, the CK2 correction). No coupling value is used anywhere.

**1. Class 3 selects the pair (public law; exact for classes 0 and 3, float for 1, 2, 4, 5).**

Consensus states are the fixed vectors of the discriminant with uniform address, which are the zeros of A = I − Re W on the cyclic subspace of the blank preparations.

| Class of the defect | Hexagon (separated loads, pair) | Carrier, string f to f′ |
|---|---|---|
| 0 | (2, 1) | (1, 1) |
| 1, 2, 4, 5 | (0, 0) | (0, 0) |
| 3 | (0, 1) | (0, 1) |

- A single load sees the holonomy and a double load sees its square, which is 1 only for classes 0 and 3.
- The class-3 consensus state is unique and uniform over the doubles and their emission states. Its blank-record part is the uniform double load, with weight 1/3 (1/6 on the carrier).
- Separated loads around the defect have lowest A = 0.035165 (hexagon) and 0.026665 (carrier).
- Iterated public filter on the blank embedded preparations: the pair's share of what is kept tends to 1 with the defect, against 1/4 (hexagon) and 1/7 (carrier) without it. One double-load preparation is kept with weight 1/18 (1/72 on the carrier).
- In FR's native frame the selection fails: six fixed vectors of separated loads survive, and the limit is 2/5.

**2. Gauss law (exact).**
- With a definite link word the positive branch has weight 1/32 for all 21 configurations. A definite class-3 flux therefore forces no occupation, so direction 2 as stated is negative.
- On the charge-free link state (that of the public empty-wave vacuum), two embedded loads are accepted with weight 1 on one port and 0 on two ports.
- The tick with the link register commutes with all six Gauss operators. The constraint at the six hexagon ports is my extension; the public program has it at one vertex.
- Public code, executed:
  - `gamma` gives 1 for two doublet quanta on port 5 and 0 for one.
  - The parity control leaves a defect unmoved exactly when both interior edges of its face see an even number of loads. With a load on the face, that happens only for a double on one of its three ports.
  - In the public two-wave step, the pair is intact given the unmoved defect with weight 801025/801036; the converse is 1.

**3. Stationary states (exact).**
- The stationary states of the tick with weight one on a double load are exactly the doubles with a written record and uniform address (18 on the hexagon, 36 on the carrier). They write nothing. The record reset of the public weak round turns one into the bare double.
- In the pair sector every stationary state has double-load weight between 1/3 and 1/2, and the consensus pair counts 7/18. The bare pair is therefore no stationary state of the tick. It stands under the round (inverse tick exact) and, on the E seam's own walk, as an orbit of period four.
- Return test on the consensus pair: the uniform double is found with weight 1/3, and 25/27 with one retry after three ticks. The double at a given port is found with weight 1/18.
- The committed law has no transition into a double. Around the defect its stationary state on separated loads is unique and mixed, with jump weight 4/45 per attempt at every address.

**4. Count (exact, with the class-3 sign and with the link register).**
- One-port target: D_2 gives forward 1/6 and in-dimer 1/6; D_10 gives backward 1/6 and in-dimer 1/6. The round coefficients are 5/18 and 1/6, mean 2/9. The non-return weights 65/324 and 5/36 reproduce LK, and every non-return component keeps the double at its port.
- The uniform double, S and any double with half its weight on orbit A give (2/3, 1/6, 1/12, 1/12) and P(R+ xor H) = 2/9 directly. In general the count is 1/6 + w_A/9. FR's own module returns the same.
- CK2's round on the uniform double gives overlaps 1/12 and 1/6 and non-return norms 11/144 and 5/36, all on blank doubles. I did not split the 11/144 by location, so your CK2 correction is not checked beyond that.

**5. Crossing (exact; other classes in floats).**
- Plain law, E seam with its two addresses: two ticks carry D_2 to D_10 with amplitude +1, and four ticks return it.
- The class-3 sign on the seam changes nothing. With the link register, the state is Gauss invariant after each tick and the register is unchanged.
- Classes 1, 2, 4, 5 pick up a phase of ∓2π/3 per crossing and +1 per return.
- There is no crossing in the native frame. With the object's own twelve addresses the amplitude is 1/36, so the seam's own register is needed (L4).

**6. Lead A.**
- With UH's quanta read as loads (three dictionaries), no Higgs state reaches weight one on S: at most e⁻² for coherent states, 8/27 for squeezed states, and 0 for the five-state truncation.
- LK's dictionary (Higgs bit = flag parity) is a different one and is not tested here. Under it the requirement on the source is unchanged: the bare double.
- Charges: both spinor levels on one port, {s1, s2}, have 6Y = 6, class 0, weak singlet, and form the complement of the right-handed charged lepton pattern. One quantum has class 3. One emission is then the vertex 0 → 3 + 3 (argued reading).

**7. Federation.** The public rule (`port_pair`, declared, not source-derived) shares no port and keeps a seam with one load at each end. The weight of a double after a glue-seam event is 0. The integer law forms a load of two only at a seam total of at least three.

**8. Second form of the pair (lead; its register is declared).** Two quanta on one port of the defect face, each with its own record and a six-address register on the face, give P(R+) = P(R−) = 1/12, P(H) = 1/6 and a count of 2/9. This needs neither S nor the crossing. With sixty addresses the count is 89/3600.

Of 52 registered items, three failed in detail (S4, F2, T3) and one rough guess was off (P2). No measured value was read and no comparison with measurement was made.

## EVIDENCE

Everything is in `work/LP/`.

- Rebuild (one minute): `sh work/LP/run_all.sh`
- Single scripts, from that directory: `PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=../FR python -B <script>`

| Script | Covers |
|---|---|
| `lp1_lead_a.py` | lead A |
| `lp2_gauss.py`, `lp2b_public.py` | Gauss law on the hexagon; public `FockObserver` |
| `lp3_stationary.py`, `lp3b_carrier.py` | stationary states, vacuum, filter; carrier |
| `lp4_federation.py` | federation |
| `lp5_construction.py` | derived standing state, FR's count, CK2's round |
| `lp6_classes.py` | the six classes |
| `lp7_idle.py`, `lp8_return.py`, `lp9_pump.py` | written-record doubles; return tests; committed law |
| `lp10_face_pair.py` | pair on the defect face |
| `lp11_crossing.py` | one-port target and crossing |

- Each script writes a `.json` of the same name. `lp_common.py` is the engine; it equals FR's model on the discriminant and on S.
- Order on record: `CANDIDATES.md` (registration, six addenda each written before its script, outcomes). Construction and item list: `DEFINITION.md`.
- The public checkout, `work/FR` and `work/LK` were only read. No byte code was written.

## WHAT THIS DOES NOT ESTABLISH

- **An entry.** The coherent law keeps the three sectors, the committed law only splits doubles, and the federation keeps a loaded seam.
- **The Gauss premise.** The statement needs the constraint at the pair's port and the charge-free link state. The public program has the constraint at one vertex, and a definite link word forces nothing.
- **Relaxation.** The consensus state is selected by a criterion. The coherent law conserves A and the sector, so separated loads never become the pair.
- **Uniqueness beyond the blank cyclic subspace.** States with written records that block every event, and stationary states with non-uniform address, also have A = 0. The selection also fails in the native frame.
- **The carrier and independence of two objects (L4).** The twelve-address hexagon, the seam's own register and the six-address face register are model inputs.
- **The dictionaries.** The pattern reading and LK's flag-parity reading are argued.

## NEXT

1. **Coordinator or audit team:** decide whether the class-3 Gauss constraint holds at every port on the vacuum's link state. If so, the pair on one port is the only accepted embedding, and L1 reduces to the two-load embedded preparation.
2. **LC:** test the pair on a port of the defect face (item 8). The public parity control ties the resting defect to it, and it needs no crossing.
3. **LK:** use the return detector for the double at one port on the consensus pair (1/18 per port), and the record reset of the written-record double as the round's fresh blank preparation.
4. **FR and CK:** use the public law for the double-load register. The selection and the crossing hold there and fail in the native frame.
5. **Neutrino lane (untested lead):** separated loads around a class-3 defect have no 3 + 3 → 0 vertex and no consensus state.
