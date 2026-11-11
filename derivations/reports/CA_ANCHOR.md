## RESULT

**What is derived (under labelled premises).** The pixel closure is read at the first freeze: the fixed point mu_A = m_Z(mu_A). This is row R1 of DC's table.

- **Anchor in the chain's variables:**
  - m_Z(mu) = E_cell exp(-pi/(2 alpha_U)) sqrt(pi (alpha_2(mu) + (3/5) alpha_1(mu)))
  - 1/alpha_i(mu) = 1/alpha_U + (b_i/2 pi) ln(M_U/mu)
  - At P_fwd: mu_A = 7.50177e-18 E* (91.588 GeV) and ln(M_U/mu_A) = 33.2297. The collar side is 1.0438e17 cells, so the collar holds 1.0895e34 cells.
- **Why m_Z (EXACT steps, ARGUED premise F):**
  - The class-3 register's mass form on the twelve currents has rank 3. The two charged directions get g2^2|beta|^2/4 each. The neutral direction, which contains hypercharge, gets (g2^2 + (3/5) g1^2)|beta|^2/4, so it is the heaviest and freezes first.
  - The law's hypothesis EH-1 needs all three weak directions with one coefficient. Below m_Z the only live generator is c(T1^2 + T2^2) + c_q Q^2, which splits the two doublet members by 2 Y c_q, so the law d exp(-t C2) fails there.
  - DC argued for m_W because the closure's observable cannot see hypercharge. The generator does see it, so that argument fails.
  - Colour is read at the same mu: a collar has one generator, and each label factor is one irrep of G.
- **Chain outputs for R1:**

  | 1/alpha_U | v | sin^2 theta_W(m_Z) | 1/alpha_em(m_Z) | A_T(P*) | P* |
  | --- | --- | --- | --- | --- | --- |
  | 24.3166 | 246.597 GeV | 0.23074 | 128.308 | 136.995 | P_fwd |

- **Excluded rows of DC's table:**
  - R0 reads at the cell, which is retired.
  - R2 (m_W) lies where the law already fails.
  - R3 and R4 sit at scales where no current freezes.
  - R5 and R6 use two collars for one factor. The R5-type colour singlet also violates the Z6 condition.
- **Item H decided:** one generator and one Gibbs parameter per collar, with one label factor per cell. "One label per collar" describes a different object, the collar's fused total, whose entropy grows only as (1/2) ln N.
- **Premise Q replaced** by three statements:
  - S4g, the readout G_geom = a_cell/(4 ellbar_shared): a conditional theorem in the spacetime paper.
  - The scale identification G_geom = l*^2: declared in the stack. The chain's unit E* is the Planck energy.
  - The freeze-out premise F.

  Together they give the closure at the anchor.
- **Second run: F split into three parts:**
  - **F3 (colour):** gluon processes change colour by the adjoint, which keeps triality (EXACT). Colour therefore relaxes monotonically inside a band of 1.49e-5 in the left side, between A1 (colour kept whole, which is R1) and A1c (colour fully relaxed). A1c gives 1/alpha_U = 24.3173 and v = 246.289 GeV.
  - **F2 (records after the freeze):** all records together resolve at most 4.8e-32 of the hidden index.
  - **F1** remains the only premise.
- **Common principle with the outer equation:** three constants are read on the largest cuts at zero momentum. Each returns the value where its law stopped changing:
  - Newton's constant through the label density, which freezes at m_Z.
  - alpha_em through the charge label, which never freezes.
  - v through the register amplitude, which is set at the smallest collar (LV) and does not run.

**The single item still missing:** a source law for F1. F1 says that below the anchor, the register's transport term and the charge term Q^2 act only on a collar's fused total and on no per-cell factor. The object that decides this is the collar generator below the anchor with the register's Higgs state in it.
- If Q^2 acted per cell, the per-cell hidden index on large cuts would fall to the colour part alone: 0.0129 against P/4 = 0.4077.
- The register's mass step changes no label (LV: diagonal, eigenvalue (-1)^(6Y)), so only these two terms are at stake.
- The same object fixes the exact freeze point: the step convention puts it at m/mu = 1, and the interval between m_W and m_Z is worth 2.6 percent in v.

## EVIDENCE

All files are in `work/CA/`. Write-up: `ANCHOR.md` (sections 1 to 12). Register: `CANDIDATES.md` (Addenda 1 to 5, outcomes, counts).

- **Rebuild:** `cd work/CA && sh anchor_run_all.sh` (about one minute). It ends with the first run's NOT BLIND script.
- **Second-run scripts:** `PYTHONDONTWRITEBYTECODE=1 python -B anchor_colour2.py` (E13, 0.5 s) and `... anchor_records.py` (E14, under 1 s).
- **Custody:** `shasum -a 256 -c anchor_ROWS_BEFORE_COMPARISON.sha256` passes for all six pre-comparison outputs after today's rebuild. The CANDIDATES.md entry fails by design: its hash was taken before Addenda 3 to 5. RER was read only, at 3ee5e0652.
- **Counts:**
  - First run: 14 chain rows computed, 3 cited from DC, 12 exact or measured statements, 6 tests in the executable observer, 6 principles.
  - Second run: 2 scripts, no chain row, no measured value, no new look.
  - My rebuild re-ran the NOT BLIND script on unchanged inputs. I deleted its output unread; this is recorded in CANDIDATES.md.
- **NOT BLIND (first run, one script run once, 13 rows × 4 quantities):**
  - R1/A1: v ratio 1.00153; alpha^-1(0) minus measured = -0.041; 1/alpha_em(m_Z) ratio 1.00279; sin^2 ratio 0.99790.
  - Within 3 percent in v there are only single-collar rows inside the m_W to m_Z interval.
  - A1c was registered after the comparison was seen; its ratio 1.00028 is arithmetic only and carries no weight.

## WHAT THIS DOES NOT ESTABLISH

- **F1 has no source law.** The decision between H-b and one label per collar, and therefore F, is argued.
- **The exact freeze point is a convention.** m/mu = 1 is the chain's one-loop step convention (IMPORTED). For mu = c m_Z, v moves by -11 percent at c = 1/2 and by +17 percent at c = 2. One percent in v needs the freeze point to about 6 percent.
- **The 0.15 percent agreement in v is not a test of the anchor alone.** It also rests on the declared slopes (33/5, 1, -3) and the declared forms of M_U and v. CH's slope and doublet-count question is outside this lane.
- **The position inside the colour band is undecided.** Whether gluon terms act on per-cell factors below the anchor depends on the same missing object.
- **Gravity side:**
  - S4g is conditional, and the scale identification is declared.
  - H-b implies that Newton's constant read on collars above the anchor is smaller: (P/4)/ellbar(mu) = 0.979 at 1 TeV. This consequence is untested.
- **Dictionary:** kappa = 1 and weight power 1 (CC's open numbers) are taken as given here.
- **Executable observer:** it supports the type of the left side and no value. With one load and one linked seam it cannot test the per-cell product law.
- **E14's inputs:** the record model is argued, and the extrapolation from N = 32 to 1e34 uses the imported local central limit form.

## NEXT

1. Build the missing object. Take RER's Casimir-acceptance chain (EH-1; worker CG's item, and `work/CG` is still empty). Add the register's transport term and the per-cell charge term, each weighted by (m_i/mu)^2. Then follow the per-cell weak law and the member entropy through m/mu = 1. F1 holds if both stop changing at the first freeze; the same run fixes the freeze point.
2. For CG: at the anchor the chain needs (t1, t2, t3) = (0.66662, 1.33349, 4.67171) and a left side of P/4 = 0.407743.
3. For the coordinator: R1 is the selected row. Its error budget is the colour band [A1c, A1] plus the freeze-point convention.
4. For CH: the anchor's definition holds for any number of doublets with 6Y = ±3, since the neutral current freezes first in every case. Changing the slopes moves the rows, not the anchor.
