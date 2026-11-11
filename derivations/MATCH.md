# Defects as particles: the match

Owner, 2026-11-10: the protected defects appear to observers as particles; name them. This file does that, with
the exact checks in `work/MATCH/match.py` (result `work/MATCH/match.json`, all assertions pass, one CPU second).

## The rule

A protected defect carries the flux class k of its face, an element of Z6 = Z3 (colour centre) x Z2 (weak
centre). Every Standard Model particle carries the same kind of label: k = 6Y mod 6 with Q = T3 + Y. On all 32
patterns of the five-level code k = 3 (n2 mod 2) - 2 (n3 mod 3), and the element (omega, -1, exp(2 pi i Y)) acts
as the identity on every pattern (EXACT). So the defect of class k is the particle of class k.

## What is what

| Defect class | Colour | Weak | Particle | In the level-10 run |
| --- | --- | --- | --- | --- |
| 1 | triplet | doublet | left-handed quark (u_L, d_L) | moves, annihilates with class 5 (e-folding 109 sweeps); 0.0502 per carrier |
| 5 | antitriplet | doublet | left-handed antiquark | as class 1 |
| 4 | triplet | singlet | right-handed quark (u_R, d_R) | frozen by sweep 15; 0.2676 per carrier |
| 2 | antitriplet | singlet | right-handed antiquark | as class 4 |
| 3 | singlet | doublet | left-handed lepton (nu_L, e_L) and its antiparticle; the Higgs doublet | frozen; 0.0818 per carrier |
| 0 | singlet | singlet | right-handed electron and neutrino; photon, gluons, W, Z | no defect |

States per generation in each class (patterns of the code): 6, 6, 6, 6 in classes 1, 5, 4, 2; 4 in class 3; 4 in
class 0.

## What follows from the label alone (EXACT, and true in nature)

1. **Who sees which flux.** Colour flux (classes 2, 4) is seen only by quarks; weak flux (class 3) only by
   left-handed doublets; classes 1 and 5 by every charged particle (Aharonov-Bohm phase exp(2 pi i f k / 6)).
2. **No lone quark.** The classes on one carrier add to zero modulo 6, because the carrier is a closed screen.
   Every carrier therefore holds a colour-neutral, weak-neutral content. The flux defects are bosons (worker SS,
   `reports/SS.md`: under the spin-statistics grading that the source's 2 pi rotation fixes, all 32 patterns of
   quanta are fermions and defects, links and the Higgs register are bosons), so a carrier content has the centre
   classes of a composite and the statistics of a boson. The centre-class reading:

   | Carrier content | Share | Centre classes of | Statistics of the flux content |
   | --- | --- | --- | --- |
   | {2,4} | 69.16 % | a meson of right-handed quarks | boson, as a meson |
   | {1,5} | 14.43 % | a meson of left-handed quarks | boson, as a meson |
   | {3,3} | 10.88 % | lepton with antilepton, or Higgs with anti-Higgs | boson (a fermionic "lepton with Higgs" is excluded) |
   | {2,2,4,4} | 1.93 % | two mesons | boson |
   | {4,4,4} and {2,2,2} | 1.20 % each (86,476 against 86,788, equal within 0.8 standard errors) | three quarks and three antiquarks | boson: a pure flux content is no baryon; a baryon is three fermionic quanta on the carrier |
   | {2,3,3,4} | 0.77 % | a meson with a lepton pair | boson |
   | {1,2,3} and {3,4,5} | 0.15 % each | quark, antiquark and Higgs: the quark mass term | boson |

   The fermionic quarks and leptons are the quanta whose five-level pattern carries the class; the defect of that
   class is the flux the pattern sees. The match of defects to particles is a match of centre classes.

3. **Reactions are the Standard Model vertices** (every one of the 16 reaction types conserves the class):

   | Reaction | Events | Vertex |
   | --- | --- | --- |
   | 1 + 5 -> 0 | 609,494 | quark-antiquark annihilation |
   | 1 + 3 -> 4 (conjugate 3 + 5 -> 2) | 238,523 (239,773) | a left-handed quark absorbs the Higgs and turns right-handed: the mass vertex of every quark |
   | 1 + 2 -> 3 (conjugate 4 + 5 -> 3) | 315,024 (314,514) | the quark Yukawa vertex Q dbar_R -> Hbar |
   | 3 + 3 -> 0 | (pair births 89,909) | the lepton mass vertex L H -> e_R |
   | 1 + 1 -> 2 (conjugate 5 + 5 -> 4) | 458,209 (456,755) | two quarks into the antitriplet: diquark |

4. **Pair kinds are positions, not flavours.** A conjugate pair on one carrier sits on two faces. The rotations of
   the carrier leave 7 kinds of ordered face pair (separations 1, 2, 2, 3, 3, 4, 5) and 6 of unordered pairs
   (1, 2, 3, 3, 4, 5). A pair on adjacent faces is removed by one seam move and never lasts, which leaves exactly
   the 6 lasting kinds of (2,4) pair and the 5 of (3,3) pair counted in the run. The two kinds at separation 2
   (and at 3) are mirror images; the run has them equally often (differences 1.4, 0.1 and 0.5 standard errors), and
   a mirror-symmetric law gives them equal rest phases. Quark flavours have no such equal pairs, so a kind is one
   placement of a meson on a carrier. Frame labels: faces are ordered pairs of the five cubic frames; faces at
   separation 1 or 4 share no frame, at 2 or 3 they share one, at 5 they carry the same two frames in reverse
   order (`work/MATCH/frames_of_kinds.py`).

## What the label does not carry

- **The generation.** All three generations sit in the same class. Electron, muon and tau are the same class-3
  defect with a class-0 partner; up, charm and top are the same class-1 defect with a class-4 partner.
- **Up against down, electron against neutrino inside a class.** These differ by T3, which a Z6 flux does not see.
- **The rest mass.** In the audit's chiral construction a mass is |v y| for each channel: v is the Higgs
  background, y the strength of the junction 1 + 3 -> 4 (quarks) or 3 + 3 -> 0 (leptons). Read from the run's own
  numbers (a charged level on a carrier with a flux pair), the rest phases of all classes and separations lie
  between 0.042 and 0.171 per tick: every species within a factor of about four of every other. Nature spans a
  factor of 340,000 from the electron to the top quark. The class match holds; the mass match needs the
  generation label and a junction strength per generation, which nothing computed so far supplies.

## Masses in GeV from the data (owner: "check the relative masses, attach SI units")

Script `work/MATCH/masses_from_data.py`, result `masses_from_data.json`. Unit: the external unit of the public
comparison branch, E* = 1.22089e19 GeV. One tick is hbar/E* = 5.39e-44 s, one cell 1.62e-35 m, and a rest phase
theta per tick is a rest energy theta E* (theta x 2.18e-8 kg). No measured mass enters; measured values are read
afterwards. Correction (worker DC, `reports/DC.md`): with one link crossed per tick on the cubic arrangement and the
screen cell dual to a crossing link, the tick is hbar/E_cell with E_cell = E* P^(-1/2) = 0.78303 E* at P_fwd, so the
GeV values below are to be multiplied by 0.78303 (6.9e-44 s per tick, 2.06e-35 m per cell). Ratios and the verdict
are unchanged.

The data holds two mass-like numbers per class: the rest phase of the class-k charge carried by a class-k defect pair
at the lasting separations 2 to 5 (option M1 of CF-1), and the declared register cost of a class-k defect in the
universe runs (5, 8, 10 cost units for classes {1,5}, {2,4}, 3).

| Named particle | Left-handed defect | Right-handed defect | Same value for the three generations | Measured (PDG 2026) |
| --- | --- | --- | --- | --- |
| up, charm, top | class 1: 0.051 to 0.059 per tick = 6.2e17 to 7.2e17 GeV | class 4: 1.1e18 to 1.4e18 GeV | yes | 0.00216, 1.2729, 172.1 GeV |
| down, strange, bottom | class 1: as above | class 4: as above | yes | 0.0047, 0.0929, 4.186 GeV |
| electron, muon, tau | class 3: 0.111 to 0.171 per tick = 1.4e18 to 2.1e18 GeV | class 0: 0 | yes | 0.000511, 0.10566, 1.77693 GeV |

Relative masses: the data's rest phases span a factor of 3.4 across all species and give electron, muon and tau
the same value (ratios 1 : 1 : 1); measured 1 : 206.77 : 3477.37, and the charged fermions span a factor of
336,791. With the unit anchored on the electron instead, the muon comes out at 0.000511 GeV against 0.1057 GeV
measured. The register costs give 5 : 8 : 10 and the same verdict. **The relative masses do not fit.** The data
contains one defect per class; nature has three particles of very different mass in each.

The repository's mass lanes for the same particles (tiers quoted from `code/particles/MASS_CANDIDATE_STATUS.md`):

| Particles | Lane | Values | Tier and what is still declared |
| --- | --- | --- | --- |
| W, Z | D10 strict branch | 80.330, 91.119 GeV (zero-selector law); 80.321, 91.124 (carrier value law) | T2: outputs of P and a discrete repair-law choice (T3 once the law selection is a theorem). v = E* P^(-1/2) exp(-pi/(2 alpha_U)) is computed. Declared: MSSM-like one-loop slopes (33/5, 1, -3), the forms of M_U and E_cell, beta_EW = 4, the law selection |
| P itself | alpha fixed point P = phi + sqrt(pi) alpha(P) | P = 1.6309721 | declared: the same slopes; open: hadronic spectral transport, scheme bridge |
| Higgs, top | double criticality at E* exp(-pi) P^(-1/6), the geometric mean of E_cell and M_U | 125.77, 172.63 GeV | T2: boundary scale identified after the implied scale was computed |
| e, mu, tau | MCPR completed response (circulant) | ratios within 0.09 ppm of measured | T2: circulant architecture historically target-informed; balance |b|/a = 1/sqrt2 from a finite GNS lane with premises abstracted from the measured triple; phase law open |
| quarks | strict lane | none: a continuous spread fiber per sector | the paper's comparison branch uses declared textures diag(6^-6, 6^-3, 1), diag(6^-6, 6^-4, 6^-2); the integer-exponent family for charm and up is removed (`runs/flavor/up_type_register_exponent_scan.json`) |
| neutrinos | none | | mechanism and scale open |

The declared items in this table are the campaign's derivation targets (`CAMPAIGN.md`).

What a fit needs from the law: a label that separates three copies of each defect, and a junction strength per copy
(1 + 3 -> 4 for quarks, 3 + 3 -> 0 for leptons). For the charged leptons the target is sharp (lead L40,
`work/MATCH/koide_balance.py`): Koide's relation Q = 2/3, measured 0.6666645, holds exactly when the square roots of
the three masses carry equal weight on consensus and on disagreement; with the relative phase 2/9 the ratios are
206.7703 and 3477.47 against 206.7683 and 3477.37 measured. A law that makes the three lepton copies by one
balanced step out of consensus, with phase 2/9, gives all three lepton masses from one unit. The phase is known
only from the measured masses so far. The repository has the same identity in circulant form
(Q = 2/3 iff |b|/a = 1/sqrt2, `runs/leptons/koide_circulant_identity.json`).

## Status of each row against nature

| Row | Against measurement |
| --- | --- |
| six classes and their content | equal (the Standard Model's Z6 structure) |
| who sees colour flux and weak flux | equal |
| no lone quark; integer charge of every carrier content | equal |
| mass and Yukawa vertices present as reactions | equal |
| matter and antimatter in the prepared run | equal within 0.8 standard errors (nature: 6e-10 excess, not resolvable here) |
| six quark flavours and six leptons as pair kinds | excluded (mirror pairs, positions on a carrier) |
| generations | not carried by the class |
| rest masses | do not fit: phases span a factor of 3.4 against 336,791; e, mu, tau equal in the data; lattice-scale values (1e17 to 1e18 GeV) in the paper's unit |
