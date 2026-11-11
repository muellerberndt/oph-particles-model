> Working document of the campaign. One correction applies throughout: the cell coupling 1/alpha = 16.2453 and every statement built on it are retired. The current state of the coupling chain is in [COUPLING_FIX.md](../COUPLING_FIX.md) and the reports CA_ANCHOR, CU_UNIFICATION, CH_HYPERCHARGE and CG_COLLAR.

## RESULT

**Derived.** The working law has the structure `v = E_cell · b · <A>`, and its exponent with the count 4 follows exactly once one law is supplied for the seam link.

- **E_cell** is the tick unit of a rest phase (DC).
- **b = (2√2/g)·tan θ0** comes from GL's functional. At base angle θ: m_f = θ, M_W² = 2 sin²θ, M_Z² = (16/5) sin²θ, photon and gluons massless, sum over the four broken directions 8·C_H·sin²θ with C_H = 9/10 (EXACT, finite differences on GL's pattern space). θ0 is the bare angle of the mass step.
- **A** is the flip of one seam by the class-3 central element.
  - In R8's consistent face variant the mass step is exp(−i θ0 (toggle × A)).
  - Read on GL's continuous link, A is the shift of the link variable by z3, diagonal in the electric sectors with eigenvalue (−1)^(6Y) (EXACT).
  - So `<A> = Σ_R p_R (−1)^(6Y)`, the class balance of the link's sector law.
  - Checked: flip amplitude per step is sin θ0·<A> (EXACT); splitting of a slow pattern on a fast link is 2θ0·<0|A|0> (diagonalisation, agreement 1e-8).
- **Exponent and count.** For the one-tick Gaussian law of GL's electric term (heat time g²/2): `<A> = m · exp(−(2π)²/(2g²)) = m · exp(−2π/(4α))`.
  - m = 2 on the Cartan circle of the weak factor (EXACT, 12 digits).
  - m = 2(2S−1) = 150.79 on the full weak factor with weights d² (EXACT).
  - Class 3 is a half turn of the weak factor: shortest geodesic tr5 H² = 2π², so β_k = 8π²/tr H_k² = (12/5, 3, 4, 3, 12/5) for classes 1 to 5. The 4 belongs to class 3 alone; for the centre of SU(N) it is 2N/(N−1).
  - SC's N_c + 1 is a separate count that equals 4 only at N_c = 3.
- **Why the action's own cost survives.** Only on a two-dimensional complex are faces independent.
  - On the icosahedral carrier surface one seam flip creates the pair (+2π, −2π) on its two faces, with weight equal to the square of the one-face weight (EXACT in the Gaussian ensemble).
  - On cubic complexes the plaquette variance is 2g²/d and the count becomes 8/d.
- **Link to the closure.** The collar's heat time t = 4π²α is 2π times the unit heat time g²/2 (DC's rows T1/T3 against T2). The closure uses the first and the law the second, so the exponent is 2π³/t.

**Value.**

| Coupling | v/E_cell with b·m = 1 | v |
| --- | --- | --- |
| 1/α_U = 24.3166 (main) | 2.5793e-17 | 246.60 GeV in the chain |
| 16.2453 (retired) | 8.2727e-12 | 7.9e7 GeV |
| needed by measured v (NOT BLIND) | 1/α = 24.3175 at b·m = 1, or b·m = 0.9985 at 24.3166 | |

**The single missing item: the sector law of the seam link that the mass step flips, at the smallest collar.** It fixes the exponent's coefficient c_E (<E_a²> = c_E/g²) and the multiplicity m. The working law needs c_E = 1 on the full link and b·m = 1. Other laws, with b = 1 at 24.3166:

| Sector law of the seam link | c_E | <A> | v (GeV) |
| --- | --- | --- | --- |
| one-tick heat kernel, Cartan circle (m = 2) | 1 | 5.16e-17 | 493 |
| one-tick heat kernel, full link, weights d² | 1 | 3.89e-15 | 3.7e4 |
| link vacuum of GL's action, continuous time | 0.796 | 1.26e-13 | 1.2e6 |
| link vacuum, two field steps per tick | 0.607 | 1.7e-10 | 1.65e9 |
| cubic complex with the tick as an axis, d = 3 / 4 | 2/3, 1/2 | 1.7e-11, 1.0e-8 | 1.7e8, 9.7e10 |
| paper's collar law, weights d·exp(−tC), at t(m_Z) / t_U | | 0.227, 0.300 | no hierarchy |
| weights d at the unit heat time | | 0.034 | no hierarchy |

The exponential needs both the unit heat time and a law on the full link; the edge form with one power of d gives a power law.

**Doublet count.** UH's register is one complex doublet (EXACT).
- It has four oscillators, forming two complex canonical pairs.
- Its one-quantum space is (6Y, T3) = (±3, ±1/2), which is the audit's five-state memory without the vacuum.
- B†B creates a (+3, −3) pair from the vacuum, so the two orientations are quantum and antiquantum of one relativistic field, with indices (1/10, 1/6).
- Each orientation alone has no Higgs state (R8's condition, HT's C1), and one seam operation creates both.
- Two independent doublets would need a second class-3 unit (DB3's G3), which the Z6 register cannot label.
- UH's induced quartic stands, and β does not depend on the count.

Chain solved again with the law inside (GeV, NOT BLIND):

| Law | declared (33/5, 1, −3) | one doublet | two doublets |
| --- | --- | --- | --- |
| m = 1, b = 1 | 246.60 | 91.03 | 245.86 |
| m = 2, b = 1 | 578.4 | 222.9 | 576.3 |
| m = 2, θ0 = g/(2√2) | 594.6 | 229.2 | 592.4 |

- Prefactor the measured v needs: 0.9987 (declared), 1.0012 (two doublets), 2.157 (one doublet).
- Inside the chain d ln v/d ln(prefactor) = 1.205.
- So the source's own count (one doublet) with the exact multiplicity 2 lands 7 to 9.5 percent low; the unit prefactor needs two doublets or the declared slopes.

**Scale and form rows at the chain's solution (NOT BLIND).**

| Reading | v |
| --- | --- |
| α2 at the cell along the chain's slope | 1093 GeV (1608 with the chain solved again) |
| α2 at m_Z | 0.061 GeV |
| unit M_U in place of E_cell | 0.638 GeV |
| GL's action as derived (Wilson form, 8/g²) | 1.8e12 GeV |
| three- / four-dimensional Gaussian form | 1.25e-6 / 6.4e-15 GeV |

Of the 42 registered flux rows at 24.3166 one passes, the working law itself, and none is near. At 16.2453 the three-dimensional form (look 4, 227.5 GeV) is near; lead F's 3/2 is that form's variance factor 2g²/3.

**Compatibility tests.**
- **Induced mass term (direction 1).** K = 24·C_H·A_V − 32·s·n_fam·A_f, and g drops out of the sign.
  - Positive for B4, B4t, B6: m_h² = +0.25 to +0.96 E_cell² at g_U, minimum at θ = 0.
  - Negative for one common constant and for the full CF-1 zone (A_f = 0.2797): minimum at θ = π/2, v = 3.9 E_cell.
  - No selection rule cancels it: the four-sphere shift fails; the even spectrum removes only the linear term; the Gauss constraint fixes nothing; the supertrace vanishes only at s·n_fam = 27/40.
  - The chart needs −9.86e-35 E_cell², a factor 8.6e31 or more below every computed value (NOT BLIND).
- **Radiative breaking (direction 2).** No minimum at the electroweak scale for any y_t(E_cell) from 0.30 to 0.40 with the induced quartics.
  - A Coleman-Weinberg minimum at the measured hierarchy needs y_t(E_cell) ≤ 0.10: top below 58 GeV, Higgs 7 to 10 GeV.
  - With the chain's couplings and y = g_U/2 at M_U the top pole mass is 224 GeV (top only), 201 GeV (equal legs), 255 GeV (top alone at √(2/3)·g) (NOT BLIND).
- **Tadpole (direction 4).** Member B's preferred angle is −0.058 to −0.170, giving v/E_cell = 0.23 to 0.66.

## EVIDENCE

Everything is in `work/LV/`. `sh run_all.sh` rebuilds it; single scripts run there with `PYTHONDONTWRITEBYTECODE=1 python <script>`.

- **Registration.** `CANDIDATES.md`: list at 09:12:52, Addendum 1 (your change of premise) at 09:24:07, Addendum 2 at 09:44:45, Addendum 3 later; times and hashes in `PREREG.sha256`. Each addendum lists the estimates made beforehand. `CANDIDATES_PREREG.md` is the first list as hashed.
- **Exact items.** `lv_exact.py` (115 s under load): classes, geodesics, icosahedral surface, cubic variances, character sums at 80 digits.
- **Compatibility.** `lv_potential.py` (60 s): dictionary, curvature, potential, selection rules, tadpole; gates agree with UH's constants (A_f to 1e-16, A1 −0.016896 against −0.016890). `lv_cw.py` (20 s): radiative breaking on YC's two-loop library.
- **Main line.** `lv_main.py` (18 s): flux table, prefactors, scale rows, doublet tests; gate reproduces 24.31655 and 246.5967 GeV. `lv_link.py`, `lv_link2.py`: the mechanism and the sector laws. `lv_chain.py` is the chain copied from `work/COUPLING/closure_check.py` with a prefactor option.
- **Comparison.** `lv_compare.py` and `lv_compare2.py` are the only scripts that read measured values; each ran once after `ROWS_BEFORE_COMPARISON.sha256`.
- **Write-up.** `DERIVATION.md`.
- **Custody.** `work/GL`, `work/UH`, `work/YC`, `work/COUPLING` were imported read only, and the public checkout was only read. Its `git status` shows modified files from another process. Nothing is running.

## WHAT THIS DOES NOT ESTABLISH

- **The sector law.** c_E = 1 and b·m = 1 are requirements. The link vacuum of GL's own action gives c_E = 0.796, and the exact Cartan multiplicity is 2.
- **The bare angle θ0.** R8 leaves the law for the angle open; it enters as a factor of order one.
- **Three readings inside the mechanism.** The Z2 seam flip read as the centre shift of GL's link; R8's pair-parity label (declared there); a fast link against a slow pattern (the splitting formula is first order).
- **Face independence.** Verified here in the Gaussian ensemble only; for the non-abelian heat-kernel form it rests on Migdal's result (IMPORTED).
- **The coupling of the smallest collar inside the law.** It is taken from your chain.
- **The radial excitation.** A bounded register pins the modulus (HT: 166 to 171.5 GeV, excluded there). UH's unbounded register has a cell-size zero-point curvature that no rule on file removes.
- **The 223 to 229 GeV row.** It is NOT BLIND, one of 24 chain rows, and v moves by 10 percent for a shift of 0.06 in 1/α_U.
- **The chain-coupling flows.** They use Standard Model Yukawa and quartic equations with the chain's gauge couplings imposed; the 16bar patterns are not included.
- **The two-field-step variance.** Its form is argued.

## NEXT

1. **Compute the missing item directly.** Execute R8's face variant with GL's Peter-Weyl link and read <A> = Σ p_R (−1)^(6Y) in the stationary state. The target is <E_a²> = 1/g_U² on the full link. BF's link-vacuum distributions (mean Casimir 10 to 12) give the first number with no new code.
2. **CH.** The slope count and the multiplicity are one decision: one doublet with m = 2 (223 to 229 GeV) or two doublets with m = 1 (245.9 GeV). UH's register and the audit's memory are one doublet.
3. **CU and CA.** The law reads the coupling of the smallest collar. Running above M_U along the weak slope makes v 4.4 to 6.5 times too large, which supports no running between the cell and M_U.
4. **The curvature.** If UH's unbounded register is kept, it needs K = 0 (with one regulator, s·n_fam = 27/40). Otherwise adopt the pair register and derive the radial excitation separately.
