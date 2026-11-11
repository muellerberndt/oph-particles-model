## RESULT

Of the five D10 forms, I derived E_cell outright and most of the pixel closure. beta_EW = 4 is derived only as an integer count. phi is derived as a number. M_U and sqrt(pi) are not derived. The piece of the closure that makes the electroweak hierarchy work, reading the couplings at m_Z, has no derivation, and the reading I can derive fails against nature.

- **E_cell = E* P^(-1/2): DERIVED (EXACT, given three premises).** The premises are: carriers on the cubic arrangement, with a screen cell being the face dual to one crossing link (so a_cell = l_link^2); one link per tick at light speed (R3, result 5); and E* = hbar c/l*. Then E_cell = hbar/tick = E* P^(-1/2). Of five registered constructions, only this one assigns the Planck area the energy E*.
  - Side finding: MATCH.md converts rest phases with E*, which amounts to P = 1. The correct unit is E_cell, a factor 0.78303 lower at P_fwd. Its verdict does not change.
- **Pixel closure.**
  - P/4 follows from the area law, which RER itself lists as a premise.
  - Leaving U(1) out is forced, not a choice: every U(1) irrep has dimension 1, so it contributes nothing to <log d> (EXACT).
  - The weights d_R exp(-t C2) come from RER's own edge-sector theorem.
  - The heat time t = 4 pi^2 alpha is derived two ways: modular inverse temperature 2 pi times the lattice electric energy g^2/2, or 2D Yang-Mills on a disk of area 2 pi. Both give EXACT identities; the physical premises are ARGUED.
  - Both derivations put the coupling at the cut (the cell scale). The code reads it at m_Z, and nothing in RER or here yields m_Z.
  - At the cut, the closure alone fixes alpha_cut = 0.0615563 at P_fwd (0.0617696 at P = phi). The code's own alpha_U = 0.0411242 gives a cut-scale left side 2.1387 times P/4. With beta_EW = 4, the cut-scale chain gives v/E* = 6.478e-12 whatever M_U is.
- **beta_EW = 4: the integer has two exact source counts; the law stays declared.**
  - The 32-pattern code has 4 left-handed doublets per generation (N_c + 1).
  - E_cell exp(-2 pi/(4 alpha)) is exactly the fourth root of one instanton weight per cell four-volume (4 = 3 axes + tick). That mechanism is ARGUED only.
  - Reading 4 as the fermion part of the SU(2) coefficient has the wrong sign for a transmutation, so it is excluded.
  - Cross-lane: if 4 is the spacetime dimension, the paper's exclusion theorem rules out the minimal SM census with this closure. That matters for DB's slopes.
- **phi: the number is derived; P = phi at balance is not.** The balance gives x = phi (EXACT). The carrier carries the same proportion exactly: (5 - sqrt5) + 2 sqrt5 = 5 + sqrt5, with both ratios equal to phi. Nothing in the source identifies the cell area P with the balance ratio.
- **sqrt(pi): not derived.** RER states it as a definition, and I found no carrier mechanism for it.
- **M_U: not derived, but reduced to one item.**
  - E* and any common factor on both anchors cancel bit-for-bit (40 digits) in every dimensionless output and in the full outer map. The only scale input is R(P) = ln(E_cell/M_U) = 2 pi - (2/3) ln P (5.95707 at P_fwd).
  - Given E_cell, M_U is the same declared item as DE's double-criticality midpoint: M_U = M_D^2/E_cell (EXACT).
  - Setting M_U = E_cell inside the code's chain barely moves the hierarchy (v/E* = 2.008e-17, alpha_U changes by 1.5e-4). It does move sin^2 theta_W(m_Z) to 0.2187 and the outer-map alpha^-1 to 148.1. So M_U carries the gauge couplings and alpha; the m_Z closure carries the hierarchy.
  - Imposing both closures together has only the degenerate root L = 0.
- **Comparison with measured values (NOT BLIND, run once after all source values were on file):**

| Chain | v/E* (measured 2.0167e-17) | sin^2 theta_W(m_Z) (measured 0.23122) | alpha_em^-1(m_Z) (measured 127.951) |
| --- | --- | --- | --- |
| Derived cut-scale reading | 6.478e-12 (3.21e5 too high) | needs M_U | needs M_U |
| Declared code chain | 2.0198e-17 (factor 1.0015) | 0.23074 | 128.31 |
| M_U = E_cell in the code chain | 2.0083e-17 | 0.21869 | 139.75 |

## EVIDENCE

All in `work/DC/`. The candidate list was written before any value was computed (`CANDIDATES.md`, four rows added later with timestamps). RER was read at 5c7a8281b. The solver is an unchanged copy of `paper_math.py` (`paper_math_dc.py`, same sha256), subclassed where an anchor moves.
- `cd work/DC && PYTHONDONTWRITEBYTECODE=1 python dc_exact.py`: 20 exact checks pass in about 4 s (spectrum, golden identities, E1 to E5, P/4, U(1), heat-time constructions, doublet count, instanton identity, sign check, M_U rewritings, and the L identity on the printed D10 point, residual 2e-33).
- `.../python dc_numeric.py` (about 20 s): cut-scale closure rows, the code-alpha_U diagnostic, the two-closure test, and the anchor-cancellation checks.
- `.../python dc_u1b.py` (about 15 s): the code chain with M_U = E_cell.
- `.../python dc_not_blind.py`: the single measured-value comparison, run after the two above.
- The full write-up (step-1 table with file:line citations for every form, derivations, status table) is in `work/DC/FORMS.md`.

## WHAT THIS DOES NOT ESTABLISH

- The cubic arrangement is CF-1's declared architecture. "Screen cell = dual face of a crossing link" and the area law are premises.
- The modular-temperature and Kogut-Susskind ingredients are imported continuum and lattice physics. The carrier has no native link variable that carries a gauge boson (X5), and the d_R weight law is a premise of RER's own theorem.
- The beta_EW counts do not derive the transmutation law. The instanton mechanism with unit prefactor is argued only.
- The golden proportion in the carrier costs follows from the ±sqrt5 eigenvalues. It does not tie P to phi.
- M_U as a function R(P), sqrt(pi), the m_Z evaluation scale, the slopes (DB) and the Thomson transport all remain declared or open. The scale reduction is a reduction, not a derivation.
- The M_U = E_cell comparison is a single evaluation at P_fwd; no fixed point was solved.

## NEXT

1. **Evaluation scale of the closure.** It sets the hierarchy through alpha_U = 0.04112, where the derivable cut-scale reading gives 0.06156. The next step is a source construction of the edge-sector state of one cut link whose weights carry the coupling at the electroweak anchor scale, or a proof that only the cut-scale coupling exists, which would retire the m_Z closure.
2. **R(P) = 2 pi - (2/3) ln P.** The next step is the lattice-to-continuum matching of the carrier's gauge action between E_cell and the scale where the three couplings meet. This needs carrier link variables, and should be done jointly with DE, since the midpoint scale is the same item.
