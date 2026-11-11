# Candidate CF-1: the coherent family program, executable specification

**Status: a candidate assembled from checked parts. Every operator below is defined and has a reference
implementation with validation numbers. It is not an accepted law: the list of declared items is in section 6, and
nothing here identifies a particle or gives a mass in physical units.**

Written for the simulation session, which builds the executable version, and for the audit team.

## 1. The program in six sentences

A carrier is the twelve-port icosahedral source. Carriers stand on a cubic lattice in the orientation of one of the
carrier's five cubic frames and share the six frame seams with their neighbours. A quantum carries a two-state
repair record, a spin doublet, and an internal pattern of the five-level code. One tick is a product of seam
operations of the public type, each followed by the reflection of an owned register about its reference state:
three across the frame seams, oriented by the spin (routing), and the carrier's internal step (mass). Massless
species move one cell per step along an axis and share one cone to third order in the wave number; a species whose internal state is corrected with probability p per
step has rest phase arccos(1 - p). Links and their flux defects are the field: they change the internal step of
the carrier that holds them.

## 2. Typed tuple

| Component | Content | Source |
| --- | --- | --- |
| Carrier | 12 ports, 30 seams, 20 faces, 60 rotations, cover of order 120, two port frames | NATIVE, public repository |
| Frame | one of the five matchings with stabilizer of order 12: three perpendicular two-fold axes, six frame seams, quaternion lifts sigma_1..3 on a spinor doublet | NATIVE (lead L28); which of the five: DECLARED |
| Family | simple cubic lattice of carriers sharing the six frame seams; every port in two carriers; all carriers translates | geometry exact (lead L29); that carriers are arranged so: DECLARED |
| Registers of a quantum | cell x; record r in {0,1}; spin doublet; internal pattern (occupation of the five levels, or one level) | record and levels: the audit's public programs; spin as pointer: DECLARED |
| Field register | thirty link bits per carrier (shared seams shared), flux on faces | the audit's public join |
| Operations | seam involution of the public type; reflection of a register about its reference state | the audit's `walk.py`; record reflection: DECLARED |
| Tick | mass step, then (Q_3 R)(Q_2 R)(Q_1 R) | DECLARED schedule |
| Preparation | blank record, plane wave or packet, coin on a branch; heralded reference of the audit for the internal step | declared apparatus |
| Readouts | translation eigenvalue; record after one tick; phase estimation; face syndrome; charge | complete instruments, all outcomes kept |
| Clock | ticks; one tick moves at most one cell per axis | |

## 3. Modules

| Module | Definition | State | Reference |
| --- | --- | --- | --- |
| Carrier and frames | five Klein groups, their matchings, axes and quaternion lifts | exact counts, identities to 2e-15 | `work/CLIFFORD/native_clifford.py` |
| Family | port classes, 27 seams per cell, addresses | exact | `work/CUBIC/cubic_tables.json` |
| Internal step | the public walk W = Q R_address on one carrier, with links | public, exact | `model/coherent_seam_repair`; `work/SIM/lib/family_walk.py` |
| Rest phase | cos(omega) = 1 - p, p = probability that the record is written in one tick from the rest state | exact identity (lead L30) | `work/FLIP/FLIP.md` |
| Routing | S_i = Q_i R: public reflector between neighbouring carriers, oriented by the spin along axis i, then reflection about the blank record; equals P^+ T + P^- T* with alpha_i = X_r sigma_i | identities to 1e-16 (lead L33); exact certificate with worker KD | `work/DIRAC/routing.py`, `DIRAC.md` |
| Mass step | M0 none; M1 exp(-i theta Y_r), cos(theta) = top kernel eigenvalue of the species' internal sector on the carrier of its cell; M2 exp(-i theta Z_r) read as a toggle of the neutral doublet level | M0 exact; M1 and M2 DECLARED, and they belong to two different readings of the record (section 9) | `routing.py` (`kind='Y'` or `'Z'`), `work/DIRAC/defect_phases.json` |
| Species | 32 patterns = 16 species x handedness; charge Q6 = 3 n2 - 2 n3; flux of class k seen as exp(2 pi i k Q6/6) | exact at representation level (leads L24, L31) | `work/FAMILY/` |
| Field | link register: on the family its gauge-invariant content is 19 face-flux bits per carrier (internal defects) plus a Z2 lattice gauge field on the cubic lattice of carriers (2 N - 2 plaquette fluxes, three torus holonomies); joint internal step with the wave | counts exact (GF(2) ranks); joint step public (audit), independent version in `work/JOIN/` | `work/CUBIC/gauge_count.py`; `model/coherent_defect_wave` |
| Routing in a link field | the reflector between carriers with the link sign of the shared seam, v = (a0 - z b0 - a1 - z b1)/sqrt2, for charged levels | gauge covariance of the tick exact | `routing.py`, argument `links` |
| Coupling of field to routing | version 1: a static flux class per cell sets theta of M1 for the species that see it. Version 2: the audit's occupation-controlled joint step in the occupied cell | version 1 defined here; version 2 is the audit's `spatial/ROUTE.md` coupling | `defect_phases.json`; `spatial/` |
| Comparison program | the port-level family walk (kernel 1 - L/NA); on this family loads have curvature 5/9 and speed 1/(6 sqrt3) | exact | `work/CUBIC/cubic_tables.json`, simulation session |

The routing between carriers and the port-level walk are two different programs with two different clocks. A
table never mixes their columns.

## 4. Numbers the executable version must reproduce (`work/DIRAC/routing.py`, `routing_validation.json`)

1. Identities on a 6 x 4 x 4 lattice with a random state: Q_i Q_i = 1, Q_i R = P^+ T + P^- T*, tick against
   symbol: all below 1e-15.
2. One axis, exactly cos E = cos(theta) cos(p). For theta = 0.157935: E = 0.157935, 0.165598, 0.186709, 0.254184,
   0.428482 at p = 0, 0.05, 0.1, 0.2, 0.4 (sqrt(p^2 + theta^2): 0.157935, 0.165661, 0.186932, 0.254840, 0.430051).
3. Off axis the ordered tick splits the two helicities at second order, also without mass: at p = (0.1, 0.1, 0.1)
   the phases are 0.167034 and 0.178606 (massless) and 0.220876 and 0.245779 (theta = 0.157935). Alternating the
   order of the three axes from tick to tick removes the splitting: 0.172043 per tick for both helicities
   (massless, |p| = 0.173205). The executable version uses the alternating order.
4. Record after one tick from a blank record: at rest sin^2(theta) = 0.024737 for theta = 0.157935; massless at
   p = (2 pi/64, 0, 0): 0.009607; both together at that p: 0.033869.
5. Packets on a 256-cell line, width 3 in momentum index around p0 = 0.2945, sixty ticks, coin = projection of the
   blank spin-up state on the positive branch (continuous in p): velocity 1.000000 (massless), 0.952986
   (theta = 0.087847) and 0.868897 (theta = 0.157935), equal to dE/dp averaged over the packet weights, 0.953061
   and 0.869004. (dE/dp at the central momentum is 0.956925 and 0.876719. An earlier version of this item used
   eigenvectors with arbitrary phases and gave 0.9525 and 0.8745; corrected after the simulation session's check.)
6. Internal rest phases for M1: sections in a uniform flux 0.157935 (doublet), 0.215043 (triplet); a level of
   charge phase alpha on a carrier with a flux pair at separation 1 to 5: alpha = 1/6: 0.042383, 0.051014, 0.056207,
   0.058279, 0.059322; alpha = 1/3: 0.075113, 0.092788, 0.106416, 0.113080, 0.116921; alpha = 1/2: 0.087847,
   0.110554, 0.132363, 0.147787, 0.171237. Consensus levels: 0.
7. Chart: twelve rows of `particle_map.json` (checked); one charge-conserving operator a + a* (neutral doublet
   level); anomaly sums zero on a class; sum T3^2 / sum Q^2 = 3/8.

## 5. Build order for the executable version

1. Routing engine: port `routing.py` (state psi[cell, record, spin]; three operations: record reflection, seam
   involution, mass step). Reproduce items 1 to 5.
2. Species layer: a quantum carries a pattern; patterns route identically. Show the sixteen species with their
   two handedness classes and the charge each carries.
3. Background, version 1: a flux class per cell (none, or class k at separation d); theta of each species from
   item 6 through alpha = k Q6/6 mod 1. Three runs: uniform background (dispersion of each species, one cone at
   high momentum, different rest phases); one defect cell (scattering and binding of a packet); dilute random
   background (effective rest phase against density).
4. Readouts by apparatus: momentum from the translation record (worker ST4), energy from phase estimation and from
   the record statistics of item 4, velocity from packets. One table: species, background, rest phase, clock,
   preparation.
5. Background, version 2: the audit's joint step in the occupied cell, so that the quantum moves the defect and
   the defect changes the quantum (the two-way coupling at scale, worker ST8).
6. The frozen comparison of step 10 only after 4 exists.

## 6. Declared items, each with what would remove it

| Declared | What would make it derived |
| --- | --- |
| Carriers arranged on the cubic lattice of one frame | a rule of the source that glues carriers through a matching; or a proof that the spherical federation of the runs reduces to it locally |
| Which of the five frames | a dynamical selection, or all five as sectors |
| Spin doublet as the pointer to the frame seams | an address register whose restriction to the six frame seams is this doublet (it must be the spinor of the frame, not six commuting labels) |
| Record reflection in the routing step | the public program reflecting the record (it reflects the address) |
| Schedule: three axes in order, the order alternating from tick to tick | an address superposition over the axes |
| Mass step and its angle (M1, M2) | M1: a proof that the internal walk and the routing share one two-level register; M2: a reservoir for the transferred charge and a source for the amplitude |
| Which internal sector belongs to which species | the join on the family, with populated states |
| Statistics (antisymmetric occupations) | open; in three dimensions a charge bound to a flux does not become a fermion by itself |
| The unit of the tick and of the cell | one measured anchor, after step 9 of the audit's list |

## 7. What CF-1 does not contain

No interacting tick on the family (the routing is free in a static field; the field enters through the link signs
of the routing and the angle of the mass step). No dynamics of the field and no Gauss constraint tied to the
quantum across cells. No selection among M0, M1, M2. No three generations. No continuum limit beyond
the free bound of the audit's routing note. No statement that the committed integer rule executes any of this:
the committed runs remain the reference for populations only.

## 8. The complete tick, with field and occupations (binding definition for workers R1 to R7)

One Hilbert space, one clock.

**Registers.** (a) Fermionic modes labelled (cell x, record r, spin s, pattern a); antisymmetric occupations are a
declared architecture. A pattern a of the family chart has charge Q6(a) = 3 n2 - 2 n3; its Z2 charge is n2 mod 2.
(b) One link bit z per link (x, i) of the cubic lattice of carriers, with Z = (-1)^z and X the flip: the lattice
gauge field of lead L34. (c) Per carrier an internal flux register: version 1 a static class label (none, or a flux
pair of class k at separation d); version 2 the audit's link words of the carrier.

**One-body operators** (reference engine `work/DIRAC/routing.py`):
- R: reflection about the blank record.
- Q_i(z): the public reflector between the carriers x and x + e_i, oriented by the spin along axis i, with the link
  sign of that link for Z2-charged patterns: v = (a0 - z b0 - a1 - z b1)/sqrt2. Neutral patterns use z = 1.
- S_fwd = (Q_3 R)(Q_2 R)(Q_1 R), S_rev = (Q_1 R)(Q_2 R)(Q_3 R); ticks alternate between them.
- M: mass step exp(-i theta_a(x) Y_r). Option M0: theta = 0. Option M1: theta_a(x) from the internal flux class of
  the carrier at x through alpha = k Q6(a)/6 mod 1 (table in section 4, item 6). Option M2: one declared angle,
  read as the toggle of the neutral doublet level (then the record is the handedness class of the pattern).

**Field step.** F = product over links of exp(-i eps X) times product over plaquettes of exp(-i kappa W), W the
product of the four Z of a plaquette. eps = kappa = 0 is the static field. eps and kappa are declared.

**Tick.** U = F . Gamma(M) . Gamma(S), Gamma the lift to the occupations (a product of local parity gates, since
every Q_i is a product of commuting reflectors and R is a sign on recorded modes).

**Constraint.** G_x = (product of X over the six links at x) times (-1)^(number of Z2-charged quanta at x).
[U, G_x] = 0 for every x: executed for one quantum on a 3 x 2 x 1 lattice with twelve quantum links
(`work/DIRAC/interaction_check.py`: commutator exactly zero, unitarity 1.6e-15). The routing step is diagonal in
the link word; only F changes plaquette holonomies.

**Reference and preparations.** Vacuum: no quanta (or the filled negative-phase branch, to be fixed by worker R1),
links in a Gauss-invariant flat state. Preparations: one-quantum packets on a branch of the symbol; a quantum and
a carrier with a flux class; pairs. The heralded stationary reference of the audit's programs applies to any unitary
tick ((2 + U)/3 filter).

**Clock and units.** One tick. One cell per axis per tick is the largest speed. No physical unit.

**Open by definition.** The values of eps, kappa and of the mass angles; version 2 of the internal flux register on
the family; Z6 links; which pattern carries which internal sector.

## 9. Two readings of the record, and what the first runs say (2026-11-10, with the simulation session)

- **Vector-like reading (M1).** The record is a second factor of the coin for every pattern separately. Each
  pattern is then a full four-component object with its own rest angle, and the two handedness classes of one
  species (which M2 links) get different angles: the charged-lepton singlet has charge 0 modulo 6 and sees no
  centre flux, its partner in the lepton doublet sees the odd classes. A Dirac pair needs one angle, so M1 with
  the flux table cannot be the mass step of the chart's species. If the angle is read from the four levels other
  than the neutral doublet level, the charges are d: -2, u: +1, neutrino: -3, electron: 0 modulo 6, so the
  electron is blind to every centre flux and the neutrino is not: the wrong way round. M1 stays in the program as
  a labelled option: the rest phase of a pattern on carriers with a flux class.
- **Chiral reading (M2).** The record is the handedness class of the pattern (the occupation of the neutral doublet
  level). The routing is the same; a mass is the toggle; its angle is not fixed by anything in the program. This is
  the reading compatible with the chart.
- **First runs of the simulation session** (its engines reproduce section 4): in a dilute random background of
  defect carriers on 32^3 cells the effective rest phase of a species equals density times angle within one
  percent (density 0.02 to 0.7), with decay below 5e-4 per tick; a single defect cell scatters a packet with
  probability 2.9e-4 to 1.1e-3 and does not trap it.

## 10. Exact certificate and a mass step without a free angle (worker KD, 2026-11-10; `reports/KD.md`)

- **Certificate.** Everything in sections 3 and 4 about the frames, the lifts and the routing identity holds in
  exact arithmetic over Q(sqrt5, i). Simplest statement of the routing step: a correction across the shared seam of
  axis i exchanges the antisymmetric blank component with the symmetric recorded one and turns the spin by the
  frame lift u_i when it sets the record (the record transition carries the link u_i); then the record is
  reflected about blank. Without the lift the three steps commute and the quantum moves along one diagonal: the
  lift is the one operation beyond the public set.
- **Radial transport.** Matching the two carriers' responses at a shared seam fixes the link to the lift of the
  half-turn about the seam direction up to a central sign; uniform lifts give a central flux through every
  plaquette, which only the doublet sees. For the routing tick this changes the tick by a position sign: the same
  cone.
- **Record statistics of the declared mass rotation.** From a blank plane wave the record is written after one
  tick with probability (1 - cos 2theta cos 2k_1 cos 2k_2 cos 2k_3)/2 (equal to the formula of section 4 item 4).
- **Option M3: the internal walk is the mass step.** Take the public tick W = Q R of the carrier that holds the
  quantum as the mass step, and control the conditional shift by the address reflection R times the spin
  (alpha_i = R x sigma_i; R is +1 on the rest space, blank or recorded with uniform address, and -1 on its
  complement). On the plane spanned by a rest state of kernel eigenvalue lambda and its image, W is the rotation by
  arccos(lambda) and R a reflection, so the tick is exactly the Dirac tick with mass angle arccos(lambda): the law
  of section 3, row "rest phase", with no declared angle. Every internal sector of the carrier is then a species:

  | Internal sector of the public walk | kernel eigenvalue | mass angle per tick |
  | --- | --- | --- |
  | uniform load, blank record | 1 | 0 |
  | slow triplet (either record) | 11/12 + sqrt5/60 | 0.304708 |
  | quintet, recorded | 14/15 | 0.367208 |
  | quintet, blank | 9/10 | 0.451027 |
  | fast triplet (either record) | 11/12 - sqrt5/60 | 0.496198 |
  | uniform load, recorded | 5/6 | 0.585686 |

  The 1,394 states of the walk outside these planes have no mass rotation. What this gives: a free theory with no
  mass parameter, in which a quantum on the uniform load state (with any pattern of the five levels and flat
  links) is massless, and the carrier's other load multiplets are a tower at the lattice scale (Compton lengths
  two to three cells). It agrees with the audit's result that the native repair acts as zero on the family module.
  What it does not give: a light nonzero mass. In the native program that has to be a property of a state, not
  of the law. Declared in M3: that the shift is controlled by R.

## 11. Corrections to section 8 and the first comparison (worker R7, 2026-11-10; `reports/R7.md`)

- **Handedness is the arrow state of the record.** The massless shift conserves X_r and not Z_r, so under the
  chiral reading the handedness class is the X_r eigenvalue, the record in the basis (|0> +- |1>)/sqrt2, not the
  value that R reflects. Section 8 and section 9 are to be read with this.
- **The constraint fails for M2.** [U, G_x] = 0 holds for M0 and M1. Under M2 the two handedness classes have
  different Z2 charge and the toggle changes it: the commutator of the mass step with G_x on the occupied cell has
  norm 2|sin theta| (executed). A chiral mass step needs a register that takes the transferred charge; without it
  the row "mass" of the chiral reading is not comparable. (Worker R8 has this.)
- **Cones over the whole zone.** The alternating tick has four cones per sublattice of the two-tick walk, with
  chiralities +, -, +, - in each arrow sector, net zero: no arrow sector is chiral over the zone (measured on a
  32^3 grid; full treatment with workers R3 and R4).
- **Comparison with the electron** (protocol frozen before the numbers, SHA-256 in `work/R7/`; retrospective, not
  blind). Charges, colour, weak isospin and hypercharge of both handedness classes: equal to the electron's, at the
  level of labels. Spin and statistics: by declaration. Electric charge as a coupling, stability, magnetic
  moment: not comparable (no U(1) link coupled to the charge). Mass: fails in every option. M1 and the background
  of the universe runs leave the right-handed electron massless in all 25 flux classes and give the neutrino the
  electron's angle; M2 with one amplitude gives 1 : 1 : 1 : 1 for neutrino, electron, up, down against measured
  ratios; M3 leaves the electron massless. With the electron mass as the unit anchor the cell would be 34 to 66 fm
  under M1 and the clock could not hold a mass above 9 to 18 MeV.
- **What a passing mass row needs** (R7): one angle joining the two handedness classes of a species; a register
  that takes the charge moved by the toggle; an amplitude per species; a law for the electron's angle (below
  9.3e-6 per tick if the top quark shares the clock, four orders below every carrier number in this file); one
  cone per species.

## 12. Which protected object travels (worker R2, 2026-11-10; `reports/R2.md`)

Corrections to section 8, adopted:
- One Z2-charged quantum on a periodic lattice cannot have G_x = +1 everywhere (the product of all G_x is the
  parity of the number of charged quanta). The constraint is G_x = g_x with fixed signs; a one-quantum preparation
  carries one background sign.
- The translation readout of a charged quantum is the covariant translation (the shift with the link variable);
  the bare shift does not commute with G_x.
- No operator of the tick moves the internal flux register of a carrier: a flux pair is static in CF-1 as defined.

Verdict, object by object:

| Object | Protected by | Travels in CF-1 | Readouts |
| --- | --- | --- | --- |
| Z2-charged quantum (16 of the 32 states; 28 have nonzero charge modulo 6, the four singlets see no centre flux) | the Gauss constraint: the charge parity of a region equals the electric flux through its boundary; the quantum ends the electric string (executed) | yes, on the cone, gauge covariant | position by cell projectors; momentum by phase estimation of the covariant translation with a clock of M levels, exact when the lattice size divides M, half-width following 2 pi/M |
| Flux pair of a carrier | pair number, under gates that move whole codes | no. The three frame half-turns commute on the 190 pairs (exact), so there is no spinor pointer: with a declared code-moving gate it runs on four body-diagonal lines, no cone. A cone needs the audit's declared lanes or a declared sign function | face parities of the carrier |
| Quantum carrying a flux pair (composite) | the charges of the quantum and the pair label | yes, with one added declared gate (the seam reflector conjugated by a swap of the two carriers' link codes on the crossing branch); its rest phase is that of the pair's separation class | as for the quantum |
| Plaquette flux of the lattice gauge field | nothing at eps > 0 (any flux configuration is an image of link flips); static at eps = 0 | no | |

A flux pair is annihilated by all twelve port responses and by the native currents: it is neutral (the audit's
result, confirmed). The audit's five-position code carries no rotation of the carrier.

## 13. The program after round 4 (workers R1, R3, R4; 2026-11-10; `reports/R1.md`, `R3.md`, `R4.md`)

Adopted corrections and results. Binding definition file: `work/R1/DEFINITION.md`; executable: `work/R1/cf1.py`.
- **Clock.** The tick is not one unitary: forward and reverse ticks differ. Reference state, branches and cones
  belong to the period of two ticks. Field step: plaquette phases first, then link rotations.
- **Charges.** Charges are functions of a label that no step changes: the 32-pattern for M0 and M1; for the chiral
  reading the Gauss charge is the Z2 charge of the four levels other than the neutral doublet level, so that the
  toggle commutes with G_x. One charged quantum on a periodic lattice needs one background sign.
- **Phases.** For the period: cos w = cos(theta) cos(rho), cos 2 rho = prod cos 2p_i, both helicities, both mass
  options; exact shell sin^2 w = sin^2 theta + |kappa|^2. Bounds: 0 <= E - w <= (2/9) E^3 (1 + 3.1 E^2) for E <= 1/2;
  the n-tick operator error grows at third order (the ordered product of the audit's routing note at second).
  Largest speed |cos theta|. Inertial mass tan(theta), rest phase theta.
- **Coin frame.** With the mass step at the end of the tick a blank quantum at rest drifts (0.0405 cells per tick
  at theta = 0.157935). The tick M^(1/2) S M^(1/2) has the same phases and no drift. Adopted.
- **Cones.** The period has 32 zero-phase cones per arrow block (the origin, corner images, and three further
  types per sublattice labelled by the frame axes, chirality -chi where the second wave-number component is
  +-pi/2) and 32 cones at phase pi that no mass angle gaps. A preparation with |p_i| < pi/4 stays on its cone in
  the free flat-link tick only.
- **Symmetry.** The tick commutes with the frame's quaternion group (half-turns) and not with the third of a turn;
  its spectrum is invariant under all 48 signed axis permutations. The sentence on the isotropy group in
  `work/DIRAC/DIRAC.md` was wrong for this tick and is corrected there.
- **Occupations.** The lifted tick is a circuit of local parity gates, depth ten layers. The cover's centre gives
  the number parity for either statistics. Antisymmetry is forced only by a filled reference. Exchange by routing
  gives -1 or +1 as declared.
- **Reference.** The empty state is stationary under every tick and coupling (adopted as the reference). A filled
  negative branch is stationary under the period only and undefined at the phase-pi cones; with it a hole is an
  antiparticle with positive phase (exact conjugation C = (Y_r sigma_2) K), and one family is the 16 odd patterns
  with complements as holes and the mass as a pairing.
- **Currents.** Exact continuity for number, pattern charge and Z2 charge; with quantum links a link's electric
  sign flips when an odd number of charged quanta cross.
- **Heralded reference.** Filter (2 + W)/3 on the period: success 5/9 - (4/9) sin^2(theta) for one quantum in a
  static field; values for small lattices with quantum links in `reports/R1.md`.

## 14. After rounds 4 and 5 (workers R8, X2, X3, X5; the simulation session; 2026-11-10)

- **Validation at scale** (simulation session): 256^3 carriers, 64 ticks forward and 64 back with random link signs
  and rest angles: return error 1.8e-15. Conformance suite of 26 items passes, including the reference of worker
  R1 against its engines (5.8e-16).
- **The toggle** (`reports/R8.md`). Handedness is X_r; the record reflection R is the toggle a + a* of the neutral
  doublet level, so R and each seam factor move hypercharge and weak isospin and only their product conserves
  them. One family is the 16 patterns with an odd number of vector levels; the other 16 are their conjugates.
  A register per cell with the charges of the two spinor levels restores the constraint exactly (executed); with it
  the mass step is exp(-i theta K), a fractional power of a reflector of the public type. A definite mass angle
  needs the register in a state with a common phase (a cyclic counter); with the register in number states there
  is conversion and no rest phase. Gauge invariance allows four amplitudes (not one): up type, down type,
  charged lepton, neutrino. Sources tried for the angle: the correction probability of lead L30 is zero on the
  family module; the audit's reference is a population without coherence; carrier overlaps are the same for all
  species; no function of flux operators has a toggle component, so no flux background can give the angle (class 3
  acts as an axial potential). A class-3 face as the register is not consistent as stated (face classes of every
  link word sum to zero). The angle and the four amplitudes remain inputs.
- **Gauss charge.** Two consistent choices: the record-independent charge (-1)^(n_s1), with its own declared link
  sign, vector-like, no register (adopted for the executable candidate); or the carrier's central link sign
  (-1)^(n2) together with a register bit per cell (needed for any chiral claim).
- **Field step** (`reports/X5.md`). With a link phase, one field step per tick cannot give a wave at the routing
  speed without instability. Corrected: n >= 2 field steps per tick with eps kappa = 1/n^2; n = 2, eps kappa = 1/4 is
  stable, and the wave and matter agree at long wavelength (packet 0.991587). Two polarizations; the coupling of a
  unit link charge is sqrt(eps/kappa)/(4 pi). No native link alphabet (the link sign, the sixth roots, the cover of
  order 120) carries a Standard Model boson: they give flux loops and string ends, no small-field wave. A photon,
  W or gluon needs a continuous link variable: a declared item. The photon's port weights are exact:
  w_p = -(1/6 + n'_p.a3/2), and sum_p w_p D_p is the electric charge of every pattern.
- **Readings of the defects** (`reports/X2.md`). The map uses reading A in every row: particles are patterns of
  quanta, defects are fluxes. Reading B (a defect of class k is the multiplet of charge k) is exact as a
  relabelling of a register of order six, excluded as a statement about the catalogued defects (no symmetry
  exchanges the labels; the produced shares miss the state counts by more than 52 standard errors; half of the
  events join or split defects). B's table survives as a column "charge class" of the matter rows: it is the label
  of the Gauss check of a cell. Reading C (a quark carrying a colour-centre pair) stays as a low-confidence option.
- **Finer labels** (`reports/X3.md`). A face is an ordered pair of cubic frames (20 = 5 x 4). A conjugate pair has a
  separation and, at separations 2 and 3, a chirality: 20 pair types. No label of a flux defect transforms as a
  colour triplet or a weak doublet. Extended register for the census: `work/X3/register.json`.


## 15. After round 6 (workers R5, T1, X4, T5; 2026-11-10 evening; `reports/R5.md`, `T1.md`, `X4.md`, `T5.md`)

Corrections to the definition, adopted:
- **Mass step only with the alternating order (R5, EXACT).** The forward-only tick with a mass step equals
  +-(cos theta X_r - sin theta Z_r) at p = (+-pi/2, +-pi/2, +-pi/2), eigenphases 0 and pi for every theta: it is
  not gapped. The alternating pair is gapped (smallest phase per tick theta on a 41^3 grid).
- **Half-step frame at preparation and readout (R5).** Second-order accuracy of the alternating order needs half
  a mass step at both ends; without it an error of order theta remains.
- **Scalar potential (R5).** Section 8 has no time-like link; the field tick takes exp(-i phi(x)) as a declared
  on-site phase.
- **Names in section 10 (X4, EXACT).** With the record set, angle 0.304708 belongs to the conjugate triplet and
  0.496198 to the triplet 3; section 10 lists kernel eigenvalues, not multiplets.
- **Cone copies (T5).** Four per parity class, the origin included, handedness +, -, +, -.

Results:
- **Interaction (R5).** In background fields the tick is the product formula of alpha.(p - A) + theta beta + phi with
  an explicit first-order bound; Landau levels E_n^2 = theta^2 + 2nB(1 - theta^2/3) - (2/3)(nB)^2; strict cone with
  speed one cell per tick per axis; slab transmission in closed form (reproduces the simulation's run C to 1e-14).
  With a dynamical link field the dressed branch breaks the relativistic form at order eps^2 unless eps is below
  0.002 to 0.017, and neutral patterns keep the free cone: the cone becomes species dependent.
- **Premises (T1).** 84 register rows; the rest mass depends on 40, of which 21 stand at nothing or label level. Most
  damaging: the gauge theorem's holonomy premise (closed paths of the family have central holonomy only); fixing
  one cubic frame is not a gauge fixing of the stack, and with the frame group in place of the sixty rotations the
  Lie-type theorem no longer forces the algebra (countermodule su(2)^4).
- **Mass matrices (T5, EXACT).** On the family band every operator invariant under the rotations, or under one
  frame's stabilizer, is a multiple of the identity; symmetry fixes eigenvectors and mixing and never a mass
  ratio. The carrier's face circulant lands on the audit's Koide phase class pi/15 with quotient 0.6824, not 2/3.
- **Generations (X4).** Best candidate: the second index (three copies, levels of order one, one angle of 31.7
  degrees). No candidate gives a hierarchy.
- **Defects as particles (`MATCH.md`).** The defect class is the particle's centre class; the class carries no
  generation, and the masses read from the data (6e17 to 2e18 GeV in the unit E*, spread 3.4) do not fit.
