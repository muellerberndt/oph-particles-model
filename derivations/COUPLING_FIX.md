# The gauge coupling: the faulty step and the corrected chain (2026-11-11 09:40)

Owner, 2026-11-11: the first priority is the gauge coupling; there is an error in how it is derived.
Checks: `work/COUPLING/closure_check.py`, `closure_variants.py` (outputs next to them; about 2 s each).

## 1. The faulty step

**What the paper states.**
- Edge-sector theorem (`paper/screen_microphysics_and_observer_synchronization.tex`, section "Edge sectors and the
  compact-gauge layer"): the sector labels alpha live on one declared overlap collar, with the stationary law
  d_alpha exp(-beta C2(alpha)) of the collar's repair generator. One collar carries one label.
- Closure (`extra/fine_structure_constant_derivation.tex`, "Heat-Kernel Gauge Closure"):
  ellbar_SU(2)(t2) + ellbar_SU(3)(t3) = P/4 with t_i = 4 pi^2 alpha_i(m_Z; P, alpha_U), read at the self-consistent
  electroweak anchor mu = m_Z(mu) and solved for alpha_U, "the coupling at M_U(P) that makes the gauge
  representation entropy match the pixel".

**What this lane did.** Worker DC (`work/DC/FORMS.md` section 2.2, `work/DC/SCALE.md` section 2) replaced the overlap
collar by the boundary of one screen cell (premises C1 and P2: "one cell collar"), and read the generator's
coefficient as the bare coupling of the link that crosses that cell (premise P3, readings T1 and T3, ARGUED). With
GL's equal couplings at the cell the closure was then solved at the cell: 1/alpha = 16.2453. The lane carried this
number as "the source's coupling at the cell" into SC (v/E* = 6.5e-12), DC3 ("closes at the cell"), GL (overall
value) and BF (10.03 against 18.24).

**Why the replacement fails.**
1. The theorem's object is the overlap collar of two patches. Nothing in the paper places that collar around a
   single cell; the cell enters only on the right side, as the capacity P/4 that holds the collar's one label.
   Premise P4 of `SCALE.md` (a blocked cut has the budget of all the cells it crosses) compares the label of a
   collar with the total entropy of a cut, which is a different quantity.
2. The cell link is not in the law the closure uses. BF (`reports/BF.md`): at g^2 = 0.77354 the link vacuum of GL's
   action has mean Casimir 10 to 12 and 1.3 percent of its weight in the lowest menu, while the closure's law at
   t = 2.43 has 99.88 percent there (MEASURED). The cell reading is inconsistent with the source's own action.
3. The product of modular temperature and electric energy that gives t = 4 pi^2 alpha is scale-free. The law
   depends on scale only through the running coupling at the collar's own scale. "One link at unit distance" in T1
   picks the cell by hand.

The number 16.2453 is the solution of the closure under an added premise. It is retired as a statement about the
source.

## 2. The corrected chain: the paper's reading, recomputed independently

Inputs: P = 1.6309721 (the chain's fixed point), the declared forms M_U = E* exp(-2 pi) P^(1/6),
E_cell = E* P^(-1/2), v = E_cell exp(-2 pi/(4 alpha_U)), slopes (33/5, 1, -3), E* = 1.220890e19 GeV.

| Quantity | Cell reading (retired) | Paper's reading at m_Z | Measured (NOT BLIND) |
| --- | --- | --- | --- |
| unified coupling, 1/alpha | 16.2453 at E_cell | 24.3166 at M_U = 2.4736e16 GeV | |
| v | 7.9e7 GeV | 246.60 GeV | 246.22 GeV |
| m_Z, m_W (tree) | | 91.588, 80.330 GeV | 91.188, 80.37 GeV |
| 1/alpha_2(m_Z) | | 29.605 | 29.58 |
| alpha_s(m_Z) | | 0.11834 | 0.1180(9) |
| sin^2 theta_W(m_Z) | | 0.23074 | 0.23122 |
| 1/alpha_em(m_Z) | | 128.308 | 127.95 |

- Left side of the closure with the measured couplings at m_Z: 0.407641, against P/4 = 0.407743 (2.5e-4;
  NOT BLIND).
- Along the chain's running the left side falls from 0.872 at M_U to 0.4077 at m_Z. The closure selects one scale.
- Reading at m_W instead of m_Z: 1/alpha_U = 24.3332, v = 240.24 GeV.

## 3. What the source's own content gives for the slopes (EXACT one-loop identity)

The source has 32 fermion patterns per copy, 16 + 16bar (SS), three copies, twelve gauge currents (GL), and n_H
Higgs doublets. Its one-loop coefficients are (8 + n_H/10, 2/3 + n_H/6, -3). For n_H = 2 they are (41/5, 1, -3):
the weak and colour coefficients equal the chain's declared (1, -3).

| Slopes | 1/alpha_U | v (GeV) | 1/alpha_2(m_Z) | alpha_s(m_Z) | sin^2 theta_W(m_Z) | 1/alpha_em(m_Z) |
| --- | --- | --- | --- | --- | --- | --- |
| declared (33/5, 1, -3) | 24.3166 | 246.60 | 29.605 | 0.11834 | 0.23074 | 128.31 |
| source, two doublets (41/5, 1, -3) | 24.3185 | 245.9 | 29.610 | 0.11843 | 0.20785 | 142.46 |
| source, one doublet (81/10, 5/6, -3) | 24.9510 | 91.0 | 29.492 | 0.11625 | 0.20389 | 144.65 |
| source, three doublets (83/10, 7/6, -3) | 23.7163 | 633.1 | 29.714 | 0.12057 | 0.21170 | 140.36 |
| Standard Model (41/10, -19/6, -7) | no root | | | | | |

- With the paper's reading and the source's own content with two doublets, the unified coupling, v, the weak
  coupling and the strong coupling come out. No superpartner is needed for these four.
- The hypercharge coefficient is the one mismatch: 41/5 against the declared 33/5. With the source's 41/5 the
  measured hypercharge coupling needs 1/alpha_Y(M_U) = 1.073/alpha_U in place of the SU(5) value (5/3)/alpha_U
  (NOT BLIND). With 1/alpha_Y(M_U) = 1/alpha_U exactly: sin^2 theta_W(m_Z) = 0.2346, 1/alpha_em(m_Z) = 126.2.
- The doublet count decides v: one, two, three doublets give 91, 246, 633 GeV.
- The 16bar patterns running down to m_Z have the same standing against experiment as the declared proxy's
  partners. The identity changes the derivation status of the two slopes and leaves that question open.

## 4. What stands and what is retired

- Retired: "the source gives 1/alpha = 16.25 at the cell"; SC's verdict that the transmutation law fails at the
  source's coupling; DC3's "the closure closes at the cell"; BF's verdict "the colour bound fails" (it compared
  against the retired number).
- Stands: BF's coefficient result (the source action runs with the continuum coefficient), its matching constants
  and its menu statements; GL's equal couplings from the 5-trace action (at the scale where the collar description
  starts); DC's E_cell.
- Changed requirement for the link register of the run: at the chain's couplings (1/alpha between 23 and 27 near
  the cell) the full register and menu M2 order colour in the 5-trace; menu M1 does not (BF's thresholds 11.7,
  20.3, 104).

## 5. Open items and workers

| Item | Question | Worker |
| --- | --- | --- |
| A | Why the collar's law reads the couplings at the electroweak anchor: the scale at which the non-abelian sector label of an observers' overlap collar is exposed | CA |
| B | The unification scale as the smallest collar: M_U = E_cell exp(-2 pi) P^(2/3), one modular period below the cell; SC's exclusion assumed running between the cell and M_U | CU |
| C | The hypercharge coefficient 33/5 against the source's 41/5, the normalisation of the U(1) coupling at M_U, and the count of two doublets (the +3 and -3 orientations of the class-3 register) | CH |
| D | Dictionary t = 4 pi^2 alpha on the collar; matching of the collar description at M_U | CC (redirected) |
| E | v: the transmutation law with the corrected coupling | LV (redirected) |

## 6. Looks by the coordinator (NOT BLIND, no weight)

1. Standard Model couplings run to the cell with Standard Model slopes: 1/alpha_Y, 1/alpha_2, 1/alpha_3 =
   55.7, 49.3, 52.1.
2. The value c = 1.073 to 1.087 of section 3 compared mentally with 13/12 and 16/15.
3. 16.2453 x 3/2 = 24.368 (recorded in `LEPTON_STEPS.md`).
