# Defects as particles: the match

> Note, 2026-11-17. This is a research record. The model derives no particle mass: every mass value in the OPH
> work so far is calibrated to a measurement, imported from the literature, set by a declared construction, or
> open. The executable model is a calibrated test candidate, not yet a production-level model.

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
