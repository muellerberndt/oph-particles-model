# Lane L-NAT round 3: the source endpoint and the cross-object analyzer

Worker LNAT3, simulation session, 2026-11-10 (23:20 to 23:55). The run stopped on the coordinator's wrap-up instruction.
Scripts and JSON: `work/SIM/derive/lnat3/`. Candidate list on record before any value: `candidates.json`. The theory
repository moved at 23:18. Every script reads it at `repair-law/reverse-engineering-reality` (the resolver in
`lnat3_common.py` also accepts the old path), read only and with no byte code written. The path used is in each JSON.
Round-1 and round-2 helpers (`../lnat`, `../lnat2`) are imported unchanged. Labels: EXACT (proved or computed in exact
arithmetic), MEASURED (floating point), ARGUED (reasoning or a hand calculation without a script), DECLARED (a premise
or an added element), IMPORTED (taken from another lane), OPEN. No measured mass enters before the last table.

Mid-task the coordinator added FR's result (`reports/FR.md`) and asked for (a) the native status of FR's declared
pieces, (b) the cross-object analyzer, (c) the multi-tick behaviour of FR's tick. Section 4 answers these.

## Verdict

NOT DERIVED. Both missing pieces fail inside the coherent law as defined.

- Source endpoint. The coherent event writes the source endpoint into its own record for every active pair, in the
  conjugate basis (EXACT, agrees with FR item 1). That basis is complementary to the agree/repair value that the
  family coupling and the analyzer use. In the native matching code every logical state has a balanced source. Native
  records fix the source for at most 1/3 of active pairs (the partner load). Operations that keep the agree/repair
  value cannot reach fraction 1 (EXACT bound).
- Cross-object analyzer. FR's analyzer has Schmidt rank 2 across the two objects (EXACT). Every operation the coherent
  program defines acts on one object, so every native readout is separable. A separable readout makes the E object a
  common scalar (EXACT). None of the named candidates is a Fourier analyzer over the copy index (EXACT or ARGUED per
  candidate).
- FR's tick does not keep its compression. M(theta)^n fails from the second tick on, in all three protocols tested:
  the rotations vanish at tick 2 and the three masses become equal (EXACT).

## 1. The source endpoint (task 1)

Script `t1_source.py`, result `lnat3_t1.json`.

### 1.1 The coherent event is a SWAP (EXACT)

- On the seam block of an oriented address (a, b) with p = (|a> + |b>)/sqrt2, m = (|a> - |b>)/sqrt2: in the basis
  (p0, m0, p1, m1) the event U_(a,b) is the SWAP of the port qubit (p, m) with the record qubit (0, 1). The reversed
  address gives U_(b,a) = Z_rec U_(a,b) Z_rec.
- On the repository's `Observer.repair`, all 30 seams, both orientations, both sources (120 cases):
  U|s,0> = |p> (x) (|0> + eps(o) eps(s) |1>)/sqrt2. The record's value in the basis (|0> +- |1>)/sqrt2 is
  eps(o) eps(s). Its agree/repair value has probability 1/2 each and carries no source information.
- So the source endpoint relative to the address is recorded for every active pair, in the conjugate basis. LNAT2's
  D1 sentence ("the coherent law records no source") holds only for the agree/repair basis.

### 1.2 The native matching code balances the source (EXACT)

- Every logical state |L> = 6^-1/2 sum over the pairs of matching L has, on every seam, exactly one pair containing
  each endpoint. Checked on all 30 seams, both colorings, all six logical states (360 cases).
- Reason: a matching is a perfect matching by non-edges, and a seam is an edge.
- Consequence: activity 1/3, source polarization 0 in every logical state, and the source entangled with the partner
  load. The activity 1/3 that gives 2/9 and the balanced source come from the same matching structure.

### 1.3 Native records of the source

| Register or record | Fixes the source for | Label |
|---|---|---|
| record in its conjugate basis | every active pair, eps(s) = eps(o) times the value; complementary to agree/repair | EXACT |
| partner load (L-independent rule) | 4 of 12 active components on every seam, both colorings: fraction 1/3 | EXACT |
| partner load within one logical state | both components (partners always distinct), but shared partners link logical states | EXACT |
| committed record (coin, current) | every active event, classical; the coherent law has no coin and no current | EXACT |
| twist register, committed rule | current events only (half of active events), when the twist is accepted | EXACT |
| twist register coupled to the coherent event | 0: its only unitary key is the address orientation, independent of the source | EXACT |
| tape_end, tape_pos | 0: functions of the schedule draw and the geometry (`universe.py` `_tape_rows`) | EXACT |
| consensus slice order (causal depth, cuts) | 0: functions of the schedule and the geometry | EXACT |
| address orientation alone | 0 | EXACT |

Shared partners: C object (coloring 0, seam {2,3}) {0, 1, 5, 7}; E object (coloring 1, seam {2,10}) {1, 5, 8, 9}. On
every seam and both colorings the shared partners join five logical states in a path; the sixth is isolated (EXACT).

### 1.4 Bounds on raising the fraction (EXACT)

- Partner-controlled operations on the record: for a shared partner the conditional record state is I/2 (tracial
  input), and every unitary keeps it at I/2. The tracial fraction is at most 1/3, attained by a sign on the exclusive
  partners.
- Operations controlled by the record's agree/repair value (any isometries on everything else): the tracial fraction
  is at most ||sum_L |w_L><u_L| ||_1 / 6 with u_L, w_L the record-0 and record-1 partner states. The nonzero spectrum
  of M^T M is that of I - A^2/4, A the adjacency of the shared-partner graph. Singular values sin(pi j/6), j = 1..5,
  and 1. Bound (3 + sqrt3)/6 = 0.788675 when the identity term uses the agree branch, on all 30 seams and both
  colorings.
- With the identity term on the idle branch (FR's and KOIDE_SOURCE's flag): bound (2 + sqrt3 + (1 + sqrt3)/sqrt2)/6 =
  0.943984. For any nonnegative mix the record-0 Gram is I + cA, c in [0, 1/2], the repair Gram I - A/2, and
  f <= (1/6) sum sqrt((1 + c lam)(1 - lam/2)) < 1 because tr A = 0 and A != 0.
- A postselected outcome can carry the exact form for every logical state only with weight at most
  lambda_min(I - A/2) = 1 - sqrt3/2 = 0.133975 of the repair weight. The contraction that does it acts on the twelve
  partner positions and is outside the program's operations.

### 1.5 Native compositions (EXACT)

- Second read, fresh record: after the first event the active load is |p> for both sources, and U|p,0> = |p,0>. The
  second record is 0 with probability 1 and the second event has no rotation amplitude.
- Second read, reused record: U^2 = I (echo).
- Record of a previous E event on the same object (seam {2,10}, sharing port 2), then the C event, tracial code:
  - E record 1: P(C source 2) = 11/144, P(C source 3) = 1/144, polarization 5/6.
  - E record 0: 11/144 and 21/144, polarization -5/16.
  - Fraction 5/11 when the E record is read in its agree/repair basis, 1/11 in its conjugate basis. The C activity
    changes to 11/36.
- Controlled half-turn (apply gC when the load sits on port 3): every moved component lands on an occupied source-2
  component (6 collisions). It is not unitary.
- Population invariant: an event with a blank record sets the occupations of its two endpoints to their mean. Every
  code state has occupation 1/6 on every port, so every reachable state keeps 1/6. The unconditional source
  polarization of any later event is 0. A fraction above 0 needs conditioning on a record correlated with the source.
- The source-2 subspace of the 66 pair states has dimension 10. No relabelling puts all 12 active components on one
  endpoint.

### 1.6 An added endpoint read

- A read of the endpoint occupation before the event gives fraction 1. Its effects on the code are 1/6 I, 1/6 I and
  2/3 I (source 2, source 3, inactive) on every seam and both colorings. Its images are orthogonal across logical
  states, so the code is correctable (EXACT).
- It is an added element (DECLARED): the program's apparatus lists single basis-state detectors and quarter-turns, and
  this detector is coarse (one port, all record and address values).
- It also reads the activity unless only one endpoint is read. In FR's model, a read of the record's conjugate value
  after the event and before T keeps b and halves a, so |b|/a goes from 1/sqrt2 to sqrt2 in the + outcome and b = 0 in
  the - outcome (ARGUED, hand calculation). A read that keeps the 2:1 balance needs an added coin on the inactive
  branch, the structure of the committed hold record (ARGUED).

### 1.7 The circulant at source fraction f (EXACT formulas)

With a = 1/sqrt6, b = 1/sqrt12, the sign known with fraction f and random otherwise, the A-clock operator is the
circulant H(f) = (1/3) I + ((sqrt2/6) f e^{i theta} + (1/12) e^{-2 i theta}) S + h.c., with eigenvalues
E_k = 1/3 + (1/6) cos 2 theta_k + (sqrt2/3) f cos theta_k and sum E_k = 1. Masses m_k ~ E_k. Values at theta = 2/9
(Koide parameters read from sqrt E_k):

| f | Q | effective abs(b)/a | effective delta | m2/m1 | m3/m1 |
|---|---|---|---|---|---|
| 0 (source unknown) | 0.344339 | 0.128486 | 0.508345 | 1.633134 | 2.467944 |
| 1/3 (partner) | 0.368749 | 0.230484 | 0.173304 | 1.429288 | 4.264426 |
| (3 + sqrt3)/6 (best record-preserving) | 0.460727 | 0.437139 | 0.043298 | 1.262375 | 12.471532 |
| 1 (source known) | 2/3 | 1/sqrt2 | 2/9 | 206.770316 | 3477.472837 |

- The clock phase stays 2/9 for every f. The effective phase of the masses moves away from it when f < 1.
- At f = 1/3, over all theta (MEASURED, 3001-point grid): Q in [0.333367, 0.372380], largest ratio 4.26457.
- At theta = 2/9, Q increases with f on [0, 1] (MEASURED, 201-point grid) and equals 2/3 at f = 1 (EXACT).

## 2. The cross-object analyzer (task 2)

Script `t2_analyzer.py`, result `lnat3_t2.json`.

### 2.1 Separable readouts (EXACT)

Objects in a product state, every E branch acting on F as I, C branch c acting as T_c. An outcome with product form
phi_E (x) phi_C gives the family operator <phi_E|psi_E> sum_c <phi_C|c> psi_C(c) T_c: a scalar times a C operator. The
identity coefficient is then a C branch (agree or idle), and the E agreeing half enters only as a common factor.
Separable instruments, including every LOCC readout, are mixtures of such outcomes. The flag analyzer that puts the E
hold on the identity and the C repair on the shifts has Schmidt rank 2.

### 2.2 Candidates

| Candidate | Unitary | In the program's operations | Fourier analyzer over the copy index | Label |
|---|---|---|---|---|
| third-turn Pi(g) | yes | yes (a symmetry) | no: a permutation, one nonzero entry in the flag-zero row; every rotation keeps the record value, so none maps the hold (record 0) to a rotation (record 1); C and E addresses lie in different g-orbits; no order-3 rotation maps (2,3) to (3,2) | EXACT |
| reading the third-turn character of F | | no detector in that basis | with the flags orthogonal every mode gets sum abs(c_j)^2 / 3: no interference | EXACT |
| modular flow rho^{it} | yes | no (PROOF.md: the apparatus does not implement every modular unitary) | no: rho commutes with all 60 rotations, so it is I (x) X_t on every isotypic component and the identity on the copy factor; equal spectra on the w and w^2 sectors; product across objects | EXACT |
| CF-1 alternating axis order | yes | a declared candidate program | no: block diagonal in its copy index (cones), no third-turn symmetry, no address superposition over axes; it does not act on the C and E records; gE gC has order 3, so gC and gE belong to no common frame | EXACT at the cones (KOI), ARGUED elsewhere |
| consensus A*, R = 2AA* - I | yes (R) | yes | no: orientation-even, the record-1 from record-0 block is 0; commutes with the rotations; product across objects | EXACT |
| heralded filter (2I + W)/3 | contraction | yes (preparation) | no: its terms are histories with zero and one step, and its identity term is the no-step history | ARGUED |

### 2.3 Native grammar (EXACT for the defined program, OPEN beyond it)

The coherent seam-repair program is a one-carrier, one-load program with a local double-load completion. Its
operations (W, Q, R, seam events on one object's loads and record, basis detectors, quarter-turns, the filter of one
walk, rotations) act on one object at a time or as identical simultaneous rotations. Two independent objects therefore
admit only separable readouts. A coherent federation with glue-seam events is not defined in the repository (OPEN). Its
seam activity between two independent code objects would be 5/18 = 1/6 + 1/6 - 2/36 by the population invariant, and
the hold and the repair share their load state, so no seam event reads them (EXACT).

### 2.4 Joint laws of the hold and one rotation component (EXACT, `t3_assemble.py`)

| Setting | P(rotation +) | P(hold) | P(both) | P(xor) |
|---|---|---|---|---|
| one seam event (K6) | 1/12 | 1/6 | 0 | 1/4 |
| one object, C event then E event | 1/12 | 11/72 | 1/48 | 7/36 |
| one object, E event then C event | 11/144 | 1/6 | 1/48 | 29/144 |
| two independent objects (K5) | 1/12 | 1/6 | 1/72 | 2/9 |

Records summed coherently; both colorings agree. Every port stays at occupation 1/6. 2/9 needs two independent
objects, and two independent objects admit only separable native readouts.

## 3. Assembly or obstruction (task 3)

### 3.1 Obstruction theorem

Premises: (i) the phase map of LNAT2 T2, with the clock phase counted between the rotation branch and the branch that
supplies the identity term (DECLARED in T2; premises (a) DECLARED and (b) IMPORTED for the radian); (ii) the native
weights 1/6 and 1/12 (EXACT); (iii) the operations defined by the coherent seam-repair program.

Statement: no readout built from (iii) produces C(2/9) with abs(b)/a = 1/sqrt2 on the native objects.

Proof outline (each step EXACT):
1. 2/9 = p + q - 2pq arises for two independent objects only (table 2.4).
2. On two independent objects every readout from (iii) is separable (2.3).
3. A separable readout makes the identity a C branch (2.1). The identity branch and the rotation branch are then
   exclusive outcomes of one event, and the count is K6's 1/4 (or 1/4 times a common E factor).
4. Separately, Q = 2/3 at theta = 2/9 requires source fraction 1 (1.7), and operations that keep the agree/repair
   value stay below 1 (1.4).

### 3.2 Conditional numbers (EXACT formulas; values from `lnat3_t3.json`)

- Declared cross-object analyzer, theta = 2/9: rows of table 1.7.
- Separable readout of one object (K6), theta = 1/4:

| Analyzer | f | Q | m2/m1 | m3/m1 |
|---|---|---|---|---|
| weighted odd, abs(b)/a = 1/sqrt2 | 1 | 2/3 | 2710.211 | 39882.26 |
| weighted odd | 1/3 | 0.367788 | 1.478397 | 4.253579 |
| unbiased odd, abs(b)/a = 1/2 | 1 | 1/2 | 5.867499 | 42.706682 |
| unbiased odd | 1/3 | 0.354319 | 1.145056 | 2.894843 |

## 4. Against FR's register (coordinator's refocus)

Script `t4_fr_multitick.py`, result `lnat3_t4.json`. FR's tick is reimplemented from `work/FR/DEFINITION.md` with
independent code: per object (load tail, head or idle; record; orientation), 432 states, tick
U = K_theta T V (W_C (x) W_E), written as z^-1 A_-1 + A_0 + z A_1 with integer A_m.

- Unitarity of the tick: EXACT.
- One tick: M = (sqrt2/3) C(theta), with a = sqrt3/9, b = sqrt6 z/18 on R and sqrt6/(18 z) on R^-1 (EXACT). This
  reproduces FR item 3.

### 4.1 (a) Native status of FR's pieces

| Piece | Status | Label |
|---|---|---|
| V (oriented record) | the product of squared quarter-turns V_i^2 on the states with record 1 at the reversed address; in the optional apparatus, applied every tick, oriented by the screen normal; after V W on a tail input the record's conjugate value is + at both addresses | EXACT |
| T and F | not native: the program has no operation controlled by a record value acting on a separate register; agree and repair leave the same load state |p>, so no load motion distinguishes them, including FR's hexagon reading of F | EXACT |
| analyzer Phi | not native: Schmidt rank 2 across C and E; in the native code it would also need coherent maps between each object's idle pairs and its active pairs, for every logical state | EXACT (rank), ARGUED (code) |
| preparation (load at the screen tail, one coherent idle state) | DECLARED: the native code gives activity 1/3 with a balanced source, the source entangled with the partner, and the idle part spread over four pairs (section 1) | EXACT (native code facts) |
| theta | CK's premise | DECLARED |

The record-as-endpoint fact does not make FR's preparation native. FR's tick needs the source definite before the
event. The record holds it only after the event and in the conjugate basis.

### 4.2 (b) Fourier readout over the copy index

Not native. This holds for the flag index (2.1, 2.3: rank 2, separable grammar) and for the character index of F (2.2:
no detector in that basis; the modular flow is the identity on the copy factor; the third-turn is a permutation;
CF-1 is block diagonal in its own copy index).

### 4.3 (c) Multi-tick behaviour (EXACT)

| Protocol | Tick 2 | Later ticks |
|---|---|---|
| unread, records reused: K_n = <Phi|U^n|in> | K_2 = (sqrt3/9) I: no rotation, equal masses | K_3 = (sqrt3/9) I + (sqrt6/18)(z^-2 R - z^2 R^-1), the quadrature form (Q = 0.343317, ratios 1.199350, 2.181091 at theta = 2/9); K_4 = (sqrt3/9) I |
| consensus outcome every tick, no re-preparation | G = <Phi|U|Phi> = (1/3) I | G^(n-1) M |
| records replaced by blank records after tick 1 | (1/3) I on one reset branch, 0 on the other; equal A-clock energies | |

Read counts with reused records: tick 1 gives P(R+) = 1/12, P(C record 1) = 1/6, P(H) = 1/6, P(xor) = 2/9. Tick 2
gives 0, 0, 1/3 and 1/3. Tick 3 returns to the tick-1 values, so the counts have period two. The C load has tail minus
head weight 0 after every tick.

Reason (EXACT, SWAP form): after one tick the active C load is in |p> for both record values. The next event sees a
symmetric source. With a fresh record its repair amplitude vanishes, and with the reused record it undoes the repair.
The compression stays M(theta) per tick only if the tail source is re-prepared every tick (DECLARED) or read every
tick (1.6).

## 5. Comparison with measurement (NOT BLIND, last)

LNAT2's values: m_mu/m_e = 206.7682830(46), m_tau/m_e = 3477.23 +- 0.23.

| Operator | m_mu/m_e | m_tau/m_e |
|---|---|---|
| f = 1/3, declared analyzer, theta = 2/9 | 1.429 | 4.264 (excluded) |
| f = (3 + sqrt3)/6, declared analyzer | 1.262 | 12.47 (excluded) |
| f = 1, declared analyzer (FR's tick at tick 1) | 206.770316 (+9.83 ppm) | 3477.4728 (+1.06 sigma) |
| separable K6, f = 1, weighted | 2710.2 | 39882 (excluded) |
| FR's tick at tick 2 and later | 1, 1 (tick 2), quadrature form at odd ticks | excluded |

FR quotes m_tau/m_e = 3477.370 +- 0.169 from the repository's PDG 2026 table (+0.61 sigma). This lane did not
recompute with that table.

## 6. Unfinished and OPEN

- A coherent federation (glue-seam events between carriers) is not defined. Whether such events, with the program's
  seam events, can realize an entangling analyzer with the K5 weights is OPEN.
- Multi-tick behaviour was computed for FR's seam-restricted tick only. The full 60-address carrier walk, with the load
  free to leave the seam, was not run.
- The effect of the conjugate-basis read and of the coin construction on FR's balance (1.6) is a hand calculation.
- The 5/11 composition (1.5) changes the weights; it was not assembled into a circulant.
- Per-logical-state values are given only at the record-preserving optimum (C object, MEASURED: 0.683, 0.683, 0.850,
  0.850, 0.667, 1).
- Premises unchanged from LNAT2 and CK: one radian per read, the federation mean, the A-clock readout.

## Files and reproduction

Directory `work/SIM/derive/lnat3/`: `candidates.json`,
`lnat3_common.py`, `t1_source.py` -> `lnat3_t1.json`, `t2_analyzer.py` -> `lnat3_t2.json`, `t3_assemble.py` ->
`lnat3_t3.json`, `t4_fr_multitick.py` -> `lnat3_t4.json`. Run each from that directory with
`PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python -B <script>`. Run times are about 15 s, 10 s, 40 s
and 10 s.
