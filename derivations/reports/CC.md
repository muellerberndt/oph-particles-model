> Working document of the campaign. One correction applies throughout: the cell coupling 1/alpha = 16.2453 and every statement built on it are retired. The current state of the coupling chain is in [COUPLING_FIX.md](../COUPLING_FIX.md) and the reports CA_ANCHOR, CU_UNIFICATION, CH_HYPERCHARGE and CG_COLLAR.

## RESULT

**What is derived, and the one item still missing**

On the corrected chain, the dictionary on a collar at scale mu is t_i(mu) = 4 pi^2 kappa alpha_i(mu), with weights d_R and one label R of G per collar.

- **4 pi/2 (EXACT).** GL's action gives the Laplacian coefficient g^2/2: the plaquette coefficient is 1/g^2 on the 5 and on the 15 (deviation below 1e-13), and unit wave speed fixes the electric term. alpha = g^2/(4 pi). The Casimir values of the code blocks (4/3, 3/4, (3/5) Y^2) are the closure's tables.
- **2 pi (IMPORTED).** The modular period.
- **kappa (EXACT that it is scale-free).** kappa = x l/A is a pure number of the collar element's shape, unchanged under (x, l, A) -> (s x, s l, s^2 A).
- **kappa = 1 (EXACT values, ARGUED geometry).** It holds for T1, for T3, and for a flux line of cross-section L^2 crossing a static patch of radius L. An element adjacent to the cut gives 1/2.
- **One label (EXACT).** The mean log-dimension of one label of G equals ellbar_SU(2)(t2) + ellbar_SU(3)(t3) for the product group. The Z6 condition changes it by -9.6e-12 at the anchor. Hypercharge is invisible.
- **The trace.** The 5-trace and the 15-trace give the same dictionary. The law has to be the Laplacian's: Wilson-form weights on SU(2) move the chain to 1/alpha_U = 25.26 and v = 56 GeV.

**Missing item:** a source construction of the collar's sector object, the one-sided edge algebra in a Gibbs state with heat time exactly 4 pi^2 alpha(mu). Its two open numbers are kappa = 1 and the weight power 1. The chain needs the factor to 2.5e-4 for one percent in v (d ln v/d ln f = -39.3). No Kogut-Susskind link and no vacuum flux is that object at any scale.

**Audit of `COUPLING_FIX.md` section 1**

| Reason | Verdict | Ground |
| --- | --- | --- |
| 1: the theorem's object is one overlap collar | confirmed | Screen paper 2934 to 2954: one declared collar, fixed cutoff, beta free, no cell, no scale |
| 1: the cell enters only on the right side | confirmed for the theorem and the fine-structure paper; refuted for the stack | Spacetime paper 520 to 528 reads the edge entropy as a density per cell of a shared cut and sets it to P/4. `docs/COMMON_OBJECTIONS.md` 229 to 239 identifies that density with the heat-kernel sum |
| 1: P4 compares a collar label with the total entropy of a cut | confirmed as logic | The proof in `SCALE.md` excludes only "the m_Z closure is the area law of a cut". The blocked label holds 9.2e-35 of its cut's budget |
| 2: the cell link is not in the closure's law | confirmed, with one correction | Like-for-like shares are 1.3 against 93.8 percent (menu M1) and 11.0 against 99.88 percent (menu M2). The quoted pair mixes the two menus |
| 2: this makes the cell reading inconsistent with the action | confirmed for DC's T1; it does not separate the cell from the anchor | The same link law at the anchor couplings gives 3.196 against 0.4077 |
| 3: the product is scale-free; scale enters through alpha(mu) | confirmed | t = 4 pi^2 alpha (x l/A), EXACT at tree level |
| 3: T1 picks the cell by hand | T1 picks no scale | `SCALE.md` selects the cell through P1 with P4, and P4 already states the scale-free law |

- **The paper's reading needs its own premise.** Q: "the sector label of the collar at the anchor scale has mean log-dimension equal to the entropy budget of one cell". The stack states Q only as the declared closure. No theorem implies it.
- **Is the cell reading defensible?**
  - Its object is: the per-cell density is the stack's own gravity readout.
  - Its number is not. 16.2453 rests on P3 (the per-cell law carries the cell's coupling), which is ARGUED and stated nowhere in the stack. The retirement stands on that point.
- **A reading that keeps both texts (ARGUED).** One generator and one beta per collar, one label factor per cell. Then P4's objection does not arise. It still needs the collar's beta to be set by the coupling at the collar's scale, which is item A.
- **Two normalisations in the stack.** Gauge paper line 1263 has g_ent^2 = t/(2 pi), which is the standard coupling only for area 4 pi. The closure uses area 2 pi. They agree only if g_ent^2 means g^2/2.

**Consistency test: the closure's left side in the link vacuum of GL's action**

P/4 = 0.4077. The ratio columns use the harmonic value.

| 1/alpha of the link (SU(2), SU(3)) | Harmonic | Product state (5-trace / 15-trace) | Collar law at the same coupling | Link over P/4 | Link over collar law |
| --- | --- | --- | --- | --- | --- |
| 16.2453 (retired) | 3.859 | 3.664 / 3.162 | 0.4077 | 9.5 | 9.5 |
| 24.3166 (alpha_U) | 4.660 | 4.742 / 4.531 | 0.8720 | 11.4 | 5.3 |
| (23.368, 27.161), slopes extended to the cell | 4.805 | | 0.9686 | 11.8 | 5.0 |
| (28.377, 30.532), bare equivalents | 5.076 | | 1.165 | 12.4 | 4.4 |
| anchor (29.605, 8.451), blocked link | 3.196 | | 0.4077 | 7.8 | 7.8 |

- At the chain's couplings near the cell the link's left side is 4.5 to 5.3. The trivial label has weight 1e-5 to 1e-4 against 0.2 to 0.3 in the collar law.
- The harmonic link law has heat time 3 g^2/(2 <omega>) and weight power 2. The collar's heat time is 5.0006 times larger at every coupling.
- At the anchor, SU(2) alone gives 1.374 against the collar's 0.395.
- The link vacuum would close only at strong coupling: 1/alpha = 2.43 (harmonic form) or 7.74 (leading strong-coupling series). The ordered product state just above BF's threshold has 2.47.

**Matching at M_U**

- **GL's equality concerns bare couplings.** It is the equality of the Hessians of the plaquette action. GL's own matched values differ per factor.
- **BF's shifts** (matched minus bare, for U(1), SU(2), SU(3)): (-2.750, -4.060, -6.215) for the 5-trace and (-3.000, -6.310, -7.215) for the 15-trace, Hamiltonian clock.
- **Equal continuum couplings need unequal bare ones.** 24.3166 at M_U corresponds to bare (27.07, 28.38, 30.53) on the 5-trace. GL's one-coupling action cannot carry them. A two-block action misses the U(1) value by 2.17.
- **Equal bare couplings never meet below the lattice scale.** The matched pair (2,3) meets at 29.5/a and the pair (1,2) at 4.3/a (5-trace).
- **The chain with equal bare couplings at M_U** gives v between 0.03 and 191 GeV and alpha_s between 0.131 and 0.373, depending on the trace, the clock and which coupling enters the law for v. For the 5-trace with the matched SU(2) coupling in the law: v = 85 GeV, alpha_s = 0.155.
- **Running between the cell and M_U.** Equal bare couplings at the cell become equal matched couplings at M_U only if the content gives b_1 - b_2 = -1.38 and b_2 - b_3 = -2.27 (5-trace). The links alone give +7.33 and +3.67.
- **Consequence.** The chain's "equal couplings at M_U" is a continuum statement. GL's result does not supply it.

**NOT BLIND (one script, run once)**

- With the measured couplings at m_Z (1/alpha_2 = 29.5848, alpha_s = 0.1180), the left side is 0.407704 against P/4 = 0.407743.
- With the factor 8 pi^2 it is 0.158. With weights d_R^2 it is 0.620.
- The factor that closes is 0.99992, with +-0.0013 from alpha_s.
- The reference chain's v sits 0.15 percent above the measured value, which equals a shift of the factor by -3.9e-5.

**Looks (no weight)**

Ten are on record in `CANDIDATES.md` sections 2 and 8. One belongs to the stopped search: by arithmetic on DC's filed value for weights d_R^2, a doubled heat time at the cell would give 1/alpha near 24.33. No script computed it, and no script ran under the first brief.

## EVIDENCE

Everything is in `work/CC/`. Run each there with `PYTHONDONTWRITEBYTECODE=1 python <script>`.

- `CANDIDATES.md`: registered list, written at 09:25 before any value; rows D6 and D7 added at 09:43 before computing; run log.
- `AUDIT.md`: the write-up, with line citations for every text.
- `cc_exact.py` (6 s): 14 exact checks pass. It reproduces 16.245298, the global-form 16.257442 and GL's menu shares.
- `cc_dictionary.py` (20 s): the reference chain, the one-label rows, the factor and weight-power rows, the Wilson-form row. The reference agrees with `work/COUPLING/closure_check.out` in every printed digit.
- `cc_linkvac.py harmonic` (3 s) and `cc_linkvac.py product` (17 s): the link-vacuum rows. The product state reproduces BF's mean Casimir 10.07 and menu shares.
- `cc_matching.py` (44 s) and `cc_matching2.py` (1 s): the matching rows. They read BF's `bf_running.json` and `bf_speed.json`.
- `cc_not_blind.py`: the single comparison with measured values, run at 09:36.
- `cc_lib.py`: shared library.
- The first run of `cc_matching.py` was stopped at 170 s. The rerun uses smaller tables with identical sums to 1e-15 and an unchanged reference root.
- RER was read at 3ee5e0652. Nothing was written outside `work/CC`.

## WHAT THIS DOES NOT ESTABLISH

- **The dictionary's open numbers.** kappa = 1, the weight power 1 and the anchor scale are not derived. The three geometries with kappa = 1 are argued.
- **The audit reads texts.** The link between the per-cell density and the heat-kernel sum goes through a docs file and a fragment that no current paper includes. The reading "one beta per collar, one factor per cell" is argued.
- **The link-vacuum rows** are at harmonic and product-state level. The true ground state is not computed. At the anchor the SU(3) coupling lies outside the harmonic range; the SU(2) row stands.
- **The matching rows** use BF's one-loop constants without matter. That complete multiplets cannot remove the split is argued.
- **The chain** is one loop without thresholds. A shift of 0.1 in 1/alpha_U moves v by 16 percent.
- **The closing factor 0.99992** holds for MSbar couplings at m_Z. A percent-level change of scheme moves it at the percent level.
- **The stopped search.** The value in the look above is arithmetic on filed numbers.

## NEXT

1. **The collar's sector object.** Compute the stationary Gibbs parameter of RER's Casimir-acceptance repair chain (EH-1) in terms of the action's coupling. The target is pi g^2 with weights d_R, to 2.5e-4.
2. **For worker CA.** Decide between "one label per collar" and "one beta per collar, one label factor per cell", and state Q or its replacement as an explicit premise. The gravity readout depends on the choice.
3. **For worker CU.** State in which scheme and at which scale the three couplings are equal. Keeping GL's bare equality at the cell needs b_1 - b_2 = -1.38 and b_2 - b_3 = -2.27 between the cell and M_U.
4. **For the run's link register.** Carrying the chain's couplings needs three independent bare couplings, near (27.1, 28.4, 30.5) at spacing 1/M_U for the 5-trace. BF's thresholds 11.7, 20.3 and 104 are bare values.
5. **Note for the audit team.** Gauge paper line 1263 and the closure differ by a factor 2 unless g_ent^2 is defined as g^2/2.
6. **Higher orders.** One percent in v needs 1/alpha_U to 0.006. Two-loop and threshold terms need control at that level.
