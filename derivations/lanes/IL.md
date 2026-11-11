## RESULT

**Furthest complete result.** The integer lift of the Z6 register is built from the full twist history of the universe
runs L4, L5, L6 and L7. Every exact gate passes. The census is complete on every stored cut and at the end. The
hypercharge-integer reading R1 holds as a statement about the value set on 99.7 percent of the defect faces and fails
as an exact law. The lift is no conserved label of the member inside a class: the law never reads the value, a value of
size 4 or more does not travel with its defect, and one composition carries several integer words. `CANDIDATES.md` was
saved before the first face value was computed, with the three coordinator constraints in it.

### 1. Gates (EXACT, all pass)

| Level | Carriers | Applied twists | Stored cuts | Face comparisons | Mismatches | Carrier states with total zero |
| --- | --- | --- | --- | --- | --- | --- |
| L4 | 5,120 | 374,750 | 282 | 29,599,284 | 0 | 1,443,840 of 1,443,840 |
| L5 | 20,480 | 1,462,772 | 215 | 90,266,030 | 0 | 4,403,200 of 4,403,200 |
| L6 | 81,920 | 5,900,072 | 181 | 303,964,522 | 0 | 14,827,520 of 14,827,520 |
| L7 | 327,680 | 23,149,983 | 146 | 23,920,932 | 0 | 47,841,280 of 47,841,280 |

- G1. Value mod 6 equals the stored class on every face of every stored cut and at the end. L7 stores the screen tier on
  its cuts. Its end state equals the stored checkpoint on all 6,717,442 faces and 10,321,920 seams by sha256.
- G2, Stokes. Every carrier total is zero. The registered count "carriers with a nonzero total" is 0 of 68,515,840.
  G3. The screen total is zero on every cut.
- G4. Every applied twist conserves the sum of its two faces. G5. |j| is at most 3, and every applied twist after the
  band is reached has |j| = 1. Applied twists by |j| at L5: 1,438,651, 21,608 and 2,513.
- G6. The twist list reproduces each run: applied twists per sweep, the six event counts, and all 14 catalogue columns
  of the identities rebuilt from the list (197,019 identities at L5, 786,662 at L6).
- The signed integer currents of sweeps 0 and 1 equal the stored record files at L4, L5 and L6.
- Negative control (L4, 200 trials each): a twist with flipped sign or a dropped twist fails G1 in 200 of 200 trials.
  A shift of one twist by 6 passes every gate. The gates fix the lift modulo 6. Its integer part rests on the recorded
  currents.
- The package's pure Python reference implementation equals the public engine at 80 and 320 carriers: loads, register,
  classes, and every applied twist with its current and depth.

### 2. Census at the end, carrier faces (MEASURED)

A = {0, +-1, +-2, +-3, +-4, +-6} is the set of 6Y on the 32 patterns. Within size 6 it excludes only +-5.

| | L5 | L6 | L7 |
| --- | --- | --- | --- |
| Defect faces | 12,859 | 51,843 | 215,988 |
| Inside A | 99.76 % | 99.67 % | 99.67 % |
| Outside A | 31 | 169 | 703 |
| Minimal value | 93.27 % | 92.88 % | 93.11 % |
| Size 4 | 6.49 % | 6.79 % | 6.56 % |
| Class 4 at -2, +4, other | 92.01, 7.67, 0.33 % | 91.66, 7.99, 0.35 % | 91.76, 7.97, 0.27 % |
| Class 2 at +2, -4, other | 92.48, 7.37, 0.14 % | 91.68, 8.09, 0.24 % | 91.61, 8.11, 0.28 % |
| Class 3 at +3, -3, size 9 | 832, 803, 5 | 3,360, 3,274, 25 | 13,227, 13,478, 100 |
| Class 1 at +1 | 63 of 63 | 681 of 689 | 6,415 of 6,474 |
| Flat faces at +-6, at +-12 | 4,031 and 7 | 16,445 and 9 | 66,299 and 39 |
| Share of the flat faces | 1.02 % | 1.04 % | 1.05 % |

(a) Histograms per class: the table, and every value in `census_L*.json`. The values outside A are 8, 9 and 10 in
size, with a few 5 and 7.

(b) Integer words at the end, with binomial errors on the shares:

| Composition | Word | L5 | L6 | L7 |
| --- | --- | --- | --- | --- |
| {4,4,4} | carriers | 66 | 334 | 1,325 |
| | (+4,-2,-2) | 40 (60.6 +- 6.0 %) | 191 (57.2 +- 2.7 %) | 707 (53.4 +- 1.4 %) |
| | (-2,-2,-2 with +6 on a flat face) | 12 (18.2 +- 4.8 %) | 70 (21.0 +- 2.2 %) | 321 (24.2 +- 1.2 %) |
| | (+4,+4,-2 with -6) | 8 | 38 | 157 |
| | other words | 6 | 35 | 140 |
| {2,2,2} | carriers | 84 | 335 | 1,376 |
| | (+2,+2,-4) | 47 | 179 | 779 |
| | (+2,+2,+2 with -6) | 21 | 78 | 294 |
| {3,3} | carriers | 768 | 3,073 | 12,438 |
| | signs opposite | 540 | 2,270 | 8,982 |
| | signs equal, with -+6 on a flat face | 223 | 778 | 3,362 |
| {1,5} | (+1,-1) of carriers | 53 of 63 | 619 of 688 | 5,776 of 6,433 |

(c) Identities and events (L6). Births: 156,394 of 156,400 are on two faces of value 0, and all of those are (j,-j).
Share of events that leave the flat faces unchanged: moves 97.93 %, annihilations 98.42 %, fusions 94.85 %, splits
99.71 %, exchanges 100 %. Per identity: of 134,122 class-1 identities that moved, 125,140 kept one value through every
move (93.3 %). Class 4: 1,430 of 1,435. A value changes only at a move, and always by a multiple of 6.
Values at birth: class 4 is born at -2 on 89.24 %, at +4 on 10.59 %, at -8 on 0.17 %. Class 1 is born at +1 on
94.88 %, at -5 on 5.05 %. Class 3 is born at +-3 on 99.88 %.

(d) Size 4 or more (L6). Class-4 identities born at +4 against those born at -2: median lifetime 85 against 105 depth
units, alive at the end 11.4 against 15.5 percent, moves 5 against 1,443. Every move of a +4 turned it into -2 and left
+6 behind (13 moves in both tiers). This is the registered statement K3 (EXACT): a face of size 4 or 5 that empties
keeps +-6. Valued flat faces: 16,454 carrier faces at the end of L6, of which 16,445 hold +-6. In both tiers such
values are created 79,162 times: by moves 69,317, by fusions 6,846, by annihilations 2,999, by births 0. 60,772 of
them receive a defect at the next twist on the face. 18,390 are never touched again, and these are the faces counted
at the end in both tiers.

(e) Time (L6). On the first stored cut all 129,966 defect faces are minimal and no flat face holds a value. Size 4
peaks at 7,238 faces at depth 108. Size 5 peaks at 2,675 faces at depth 192, which is 1.05 percent of the defect faces,
and ends at 8. Size 7 or more peaks at 611 at depth 1,024. The lowest share inside A over all cuts is 98.71 percent
(L4: 98.59). Words of {4,4,4} over time: on the cuts of depth 2 and 3 every {4,4,4} carrier holds (+4,-2,-2), 54 of 54
at L5, 181 of 181 at L6 and 867 of 867 at L7. The share falls as the valued flat faces grow and changes little after
depth 3,200.

(f) Screen against carrier faces (L6). Screen: 1,891 defect plaquettes, 83.3 % minimal, 15.7 % of size 4, 99.0 % inside
A, class 4 at +4 on 23.7 %. 1,936 of 39,071 flat plaquettes hold a value (4.96 %). Carrier faces: 92.9 %, 6.8 %, 99.7 %,
8.0 % and 1.04 %.

(g) Two words. {2,4}: (+2,-2) against (-4,+4) is 4,037 : 29, 15,650 : 126 and 62,706 : 548. The share of (-4,+4) is
0.71 +- 0.13, 0.80 +- 0.07 and 0.87 +- 0.04 percent. {1,2,3} on its most populated cut: L6, depth 1,088, 1,835 carriers:
(+1,+2,-3) on 1,183, (+1,-4,+3) on 69, (-5,+2,+3) on 18, other words on 565. Ratio 17.1 : 1. L7, depth 1,024, 7,278
carriers: 4,685, 325, 61 and 2,207. Ratio 14.4 : 1. Early in the quench the two words are comparable: 79 against 65 at
depth 6 of L5. {3,4,5} mirrors {1,2,3}: 4,763 against 318 at L7.

Mirror symmetry (MEASURED, pooled L4 to L7): +4 on class 4 against -4 on class 2 is 9,326 against 9,418 (-0.67 standard
errors). +3 against -3 is 17,607 against 17,777 (-0.90). +6 against -6 on flat faces is 43,997 against 43,834 (+0.55).
The census cannot separate R1 from its mirror reading.

### 3. Tests of the readings (MEASURED)

| Question | R1 | R2' | Null N2 | L6 | L7 |
| --- | --- | --- | --- | --- | --- |
| Defect faces outside A | 0 | 0 | 37.0 % | 0.33 % | 0.33 % |
| Class-4 faces at +4 | allowed | 0 | common | 7.99 % | 7.97 % |
| {4,4,4} with (+4,-2,-2) | all | none | mixed | 57.2 % | 53.4 % |
| {4,4,4} with (-2,-2,-2 and +6) | none | all | mixed | 21.0 % | 24.2 % |
| Flat faces with a value | none (strict) | on {4,4,4}, {2,2,2} only | 47.7 % | 1.04 % | 1.05 % |
| Minimal defect faces | | all | 32.1 % | 92.9 % | 93.1 % |

- R1 fails as an exact statement. R2 fails: Stokes excludes it on {4,4,4} and {2,2,2}, and 6.8 percent of the defect
  faces have size 4. Neither word of {4,4,4} is the rule.
- Null N1 (free sum of all currents): the value mod 6 equals the stored class on 16.65 percent of the faces, which is
  chance. Null N2 (random representative of each applied twist): far from the run. The lift is a narrow function of
  the path.
- EXACT reason for the narrowness: births are minimal (K2), and in the band a value +1 or -1 crosses faces of value 0
  unchanged (K4).
- Where the other values come from (L6): 329,729 of 390,763 reactions have minimal inputs and minimal outputs. 23,168
  create a non-minimal value from minimal inputs. The leading channels step a class-3 value away from zero or double a
  2: (+2)+(-3) to (-4)+(+3) 3,602, (+3)+(-3) to (-4)+(+4) 3,189, (+3) to (+4)+(-1) 2,131, (+1)+(+3) to (+4) 2,041,
  (+2) to (+4)+(-2) 1,271. One reaction creates a flat +-6 from minimal inputs. The chain is: the sign of a class-3
  value, then size 4, then size 5 on a mobile class, then +-6 left on a flat face.

### 4. Interpretation under R1 (ARGUED)

Every row is a flux. A pure flux content is a boson. The word (+4,-2,-2) is the flux that a u d d content sees. It is
not a neutron.

| Reading under R1 | Supports | Contradicts |
| --- | --- | --- |
| Class 4: -2 is the flux d_R sees, +4 the flux u_R sees | two values hold 99.65 % of the class-4 faces (L6) | -8 and +10 on 77 faces; the shares 92 : 8 follow from minimal births; the law treats both values alike (EXACT) |
| Class 2: +2 and -4, the conjugates | 99.76 % of the class-2 faces; mirror counts agree | +8 and -10 on 52 faces |
| Class 1: +1, the flux Q sees | 681 of 689 faces at the end | 5.05 % of the class-1 identities are born at -5; size 5 reaches 1.05 % of the defect faces at depth 192 |
| Class 3: +-3 | 99.62 % of the class-3 faces, signs in equal number | +-9 on 25 faces; the sign does not separate L from the Higgs doublet |
| Class 0: 0 or +-6 | 16,445 of 16,454 valued flat faces are +-6 | +-12 on 9 faces; R1 in its strict form has no valued flat face |
| {4,4,4} is (+4,-2,-2) | 53 to 61 % of the carriers | 18 to 24 % are (-2,-2,-2 with +6); 12 % are (+4,+4,-2 with -6) |
| {1,2,3}: the down-type word (+1,+2,-3) and the up-type word (+1,-4,+3) | both occur; total zero holds (EXACT) | (-5,+2,+3) on 1 %; 30 % of the carriers hold another word, most with a valued flat face |
| Two lifts of 1 + 3 to 4 are the down-type and up-type vertex | (+1)+(-3) to (-2): 16,289 and (+1)+(+3) to (+4): 7,979 at L7 | the lift is fixed by the sign of the class-3 value, which the law does not read |
| The value is carried by the member | constant between events | a +4 cannot move (K3); a mobile +1 takes the value of the face it sits on plus 1 |

Scope: the lift separates u_R from d_R. It does not separate u_L from d_L, both have 6Y = +1. It does not separate L
from the conjugate of H. T3 stays outside it.

Verdict (ARGUED): the lift is one integer winding per face, (m - minimal value) / 6. It records how often the applied
current wound around the face. It is no conserved member label.

Numbers the theory report SS asked for (MEASURED, L6 end): class-3 faces at +-3 against +-9: 6,634 against 25.
{3,3} pairs: opposite signs 73.9 %, equal signs 25.3 %. The size-4 face in {4,4,4}: exactly one +4 and no valued flat
face on 57.2 %. Flat faces of value +-6 exist in the lift, 0.2 per carrier.

### 5. Item (h): the class-3 pair check

Definitions as registered: H-par is equal parity of the three port loads, the control's own rule. H-double is the
triple (u, u, u+2).

- EXACT. In the band every load is 2 or 3. H-double has share 0 for every class on every band cut. A face with equal
  loads carries no current on any seam, so it cannot change at its next attempt.
- MEASURED, L6, 150 band cuts: H-par on 25.75 +- 0.04 % of the resting class-3 faces (1,015,890 face states) and on
  25.75 % of the flat faces. Classes 2 and 4: 25.79 %. Classes 1 and 5: 26.74 +- 0.03 %. L5, 184 cuts: 25.62 +- 0.08
  against 25.66 %.
- MEASURED, L6, 29 cuts before the band: H-double on 1.13 +- 0.02 % of the resting class-3 faces, 1.36 % of the flat
  faces, 2.24 +- 0.07 % of the class-3 faces that change before the next cut. On the cut of depth 1 no resting class-3
  face is parity-even (0 of 12,409): a class-3 pair is born on a seam that ends at loads 2 and 3.
- Answer: the runs show no double load at a resting class-3 defect. A class-3 defect rests because of the register
  cost, whatever its loads are. An excess of parity-even faces appears for the mobile classes 1 and 5 only.
- Small residual: resting class-3 faces carry a fraction of loads equal to 3 lower by 0.0012 (L6) and 0.0023 (L5) than
  flat faces. Chi-square of the four band triples: 19.9 and 22.4 for 3 degrees of freedom, with correlated cuts.

## EVIDENCE

Lane directory `work/SIM/phase2/IL/`.

- `CANDIDATES.md`: readings, predictions, definitions, the coordinator constraints, and the outcomes. One registered
  statement was wrong: K5, second sentence. Adjacent faces of classes 2, 3, 4 also react in the band.
- `il_history.py`: twist history from the declared preparation with the public engine. Ran on the box in 3, 15, 63 and
  296 seconds for L4 to L7.
- `il_lift.py`: lift, gates and census from the twist list and the stored run files. It imports no simulator module.
  Output `census_L4.json` to `census_L7.json`: values per class on every cut, all words at the end, and the words of
  the nine named compositions on every cut.
- `il_record_check.py` with `record_check.jsonl`, `il_gate_control.py` with `gate_control_L4.json`,
  `il_reference_check.py` with `reference_check_L1.json`, `reference_check_L2.json`, `reference_check_L1_200.json`.
- `il_crosscheck.py` with `crosscheck.jsonl`: a second computation by plain loops. The values per class in both tiers
  and the words of {4,4,4}, {2,2,2}, {2,4}, {3,3} equal the census files at L4, L5 and L6.
- `il_site.py`, `il_site_text.py`, `il_package_data.py`, `il_summary.json`, `run_all.sh`.
- Rebuild of the local steps: `sh work/SIM/phase2/IL/run_all.sh`.
  Its header lists the box commands. A rebuild of `census_L4.json` gave the identical file.
- Twist histories: `scratch`,
  `history_L5.npz`, `history_L6.npz` in the same directory (2.5, 10 and 42 MB). `history_L7.npz` has 168 MB and stays
  on the box at `~/il/out/` (sha256 7f31ca22...512c56). The box also holds the copied run files of L6 and L7 in `~/il/runs/`.
- Candidate package: `rer_package/defect_integer_lift/` with `README.md`, `PROOF.md`, `model.py`, `census.py`,
  `certificate.py`, `federation.json`, `imported_census.json`, `results.json`, `test_integer_lift.py`. From
  `rer_package/`: `python -m defect_integer_lift --check` passes 52 named checks, and
  `python -m pytest -q -W error defect_integer_lift` gives 9 passed in under 12 seconds.
- Simulator commit 476aff7219fe05592563cb0a1281aba4cffc9d96. The engine files equal that commit. Hashes of the engine
  files, of each `run.json`, `MANIFEST.sha256`, `catalogue.npz`, `cuts/end.npz` and of each twist history are in the
  census files and in `imported_census.json`.
- No measured value was read. No git command that changes state was run. SIM was changed only by the one site file.
  RER was not touched.

## WHAT THIS DOES NOT ESTABLISH

- The register is a declared layer. The counts are quench statistics of one preparation and one schedule per level.
- Nothing here concerns the coherent law or the source. The lift exists only where an integer current is recorded.
- R1 is a reading. The lift gives no T3, no generation and no mass, and it cannot separate R1 from its mirror.
- L7 stores no internal classes on its cuts. Its internal tier is gated at the end state and by Stokes on every cut.
- L8 to L10 were not run.
- Errors are binomial with carriers taken as independent. The load statistics pool correlated cuts.
- Item (h) does not test the public parity control program. The run's register is a different rule.
- The package is a candidate. Its commands were run from the lane with the package name `defect_integer_lift`. The
  form `python -m model.defect_integer_lift` inside RER is untested.

## NEXT

1. Coordinator and theory session: decide on the package. If it goes to RER, copy the directory to
   `model/defect_integer_lift/`, run the three commands of its README there, then add the link below.
2. Theory session: the reading of flat faces at +-6. The lift has them on 1.04 percent of the flat faces, where the
   report SS expected none. They are invisible to the register and to every Z6 charge.
3. If a member label is wanted, it must be a quantity the law reads. The closed-loop runs (`--twists`, DATASET
   section 12) carry signed integer charges with a cost beyond size 3 that act back on the loads. Exact next step: run
   `il_lift.py`-style counts on one closed-loop run at L5 and compare the value sets.
4. Larger levels: `il_history.py` needs one core and about 20 minutes for L8 on the box. The L8 geometry must be
   built or copied there first. The stored end checkpoint gives the gate by hash, as done for L7.

## FOR THE SITE

- Data file: `oph-physics-sim/oph_defects/viewer2/research/IL/il_census.json`,
  164,214 bytes, served and checked at `http://localhost:8777/rl/IL/il_census.json`. Fetch line for a page module:
  `const il = await (await fetch('/rl/IL/il_census.json')).json();`
- Fields, each described under `fields` in the file: `definition`, `runs` (gates and custody per level), `histograms`
  (values per class and tier, shares, mirror pairs, null N2), `words` (integer words per composition), `word_tests`,
  `words_at_peak`, `reading_table`, `comparison`, `events`, `two_lifts`, `identities`, `series` (L5 and L6 over the
  cuts), `loads_check`, `statements` (14 sentences with label and status), `map_into_this_step`.
- Status words used: `derived` for the exact identities, `declared` for the definition and for counts on the declared
  register, `open` for the reading. No page module was written. The brief asked for the data file.
- Binding wording, already in the file: a pure flux content is a boson; (+4,-2,-2) is the flux that a u d d content
  sees and is no neutron; the lift separates u_R from d_R and leaves u_L, d_L and T3 outside.
- Links for `links.js` (both targets exist):
  `lift: [['Proof: defect classes are centre classes', RER + 'model/defect_particle_classes/PROOF.md'], ['Data format of the runs', SITE + 'DATASET.md']],`
  After the package is merged, add `['Proof: the integer lift of the defect register', RER + 'model/defect_integer_lift/PROOF.md']`.
  That path does not exist on the public branch today.
- `research/manifest.json` is not updated. sha256 of the data file:
  e9ed9be50a4911897def92c8ccff796fcc464c9e289449ecd8c0858221838806.
