## RESULT

**No measured mass comes out.** GL's functional fixes the Yukawa strength at the cell at y = g/2, but it gives the same value on all four legs, so the bottom and tau come out as heavy as the top scale. Every registered row fails for m_b and m_tau by factors of 15 to 52, and the lepton scale y_J by factors of 16 to 42 (NOT BLIND).

**1. The Yukawa term in GL's functional (EXACT traces, finite-difference checked).**
- **Construction.** The toggle transport is exp(-i K_theta) with K_theta = theta a_s2† + conj(theta) a_s2 on the pattern space. The Higgs plaquette is W = Λ(U) V(x+mu) Λ(U)† V(x)†.
- **Kinetic term.** The plaquette cost is (H_theta/2)|U phi(x+mu) − phi(x)|², the kinetic term of the register doublet, with a fourth-order remainder. The transport identity holds to 4e-16.
- **Carrier.** The patterns generated from the code by links and toggle are the 16 with n3 ≤ 1. On them, on the family half and on all 32 patterns: H_g = 1/8 in all twelve directions, H_theta = 1.
- **Ratio.** With rest mass m = |theta| per tick, y²/g² = 2 H_g / H_theta, so **y(E_cell)/g(E_cell) = 1/2** and m_f = M_W/√2 at tree level at the cell. The W mass check gives 0.124996 against 1/8.
- **Sum rule.** Equivalent form: the sum of y² over Dirac species (colour counted) is 2 g² per family. The weights 3 : 3 : 1 : 1 are QM's 12 : 12 : 4 : 4.

Other readings, all registered before computing:

| Reading | y/g | Standing |
| --- | --- | --- |
| F1 (primary), same carrier for both terms | 1/2 | derived under the stated construction |
| F1b, GL's gauge term on the code, toggle on patterns | 1/√5 | scan |
| F2, code with empty register | 1 | has no gradient term |
| F3, seven-level code | per factor | excluded: gauge Hessians 1/14, 1/7, 4/35 break GL's equal couplings |
| F4, heat-kernel weight 3 : 1 | 1/√6 | a different functional |
| F7, both toggle orientations counted | 1/(2√2) | scan |

The coordinator's g/√2 is F4 with three copies and one heavy family; that row was not run. The lattice functional gives (√3/2) g there.

**2. Third-family Yukawas at the cell: the source does not split them.**
- The matrix element of K is 1 on the top, bottom, tau and neutrino legs, and [n_s1, K] = 0.
- One family (G1): y_t = y_b = y_tau = y_nu = g/2. That is 0.4398 with the source's g = 0.8795, and 0.2531 with g_2(E_cell) = 0.5062 on the declared chart.
- Three copies with the circulant (G3a, register declared): the sum of y_k² over copies is (3/4) g², and y_3 = 0.8413 g, again equal on the four legs.
- TR's cost-raising read weighted by the functional itself (L2) gives 7.8e-11, eight orders too small.

**3. Rest masses and lepton scale.** Two-loop SMDR equations, lambda(E_cell) = 0 declared, v through G_F. Masses in GeV; brackets are ratios to measurement.

| Row | y_3(E_cell) | m_t pole, tree G_F | m_t, SMDR G_F | m_b(m_b) | m_tau | y_J(Q0) |
| --- | --- | --- | --- | --- | --- | --- |
| F1 G1, declared chart, g_2 (primary) | 0.2531 | 131.6 [0.765] | 133.1 [0.773] | 119.9 [28.7] | 45.5 [25.6] | 0.263 [24.8] |
| F1 G1, declared chart, source g | 0.4398 | 166.3 [0.967] | 168.5 [0.979] | 152.6 [36.5] | 56.2 [31.6] | 0.326 [30.8] |
| F1 G3a, declared chart, g_2 | 0.4257 | 161.8 [0.940] | 163.7 [0.951] | 148.3 [35.4] | 54.7 [30.8] | 0.405 [38.2] |
| F1 G3a, declared chart, source g | 0.7399 | 182.2 [1.059] | 184.5 [1.072] | 167.9 [40.1] | 58.7 [33.1] | 0.441 [41.6] |
| F1 G1, HT's rebuilt chart (census BE) | 0.4398 | 235.6 [1.369] | not run | 219.4 [52.4] | 28.1 [15.8] | 0.173 [16.3] |
| F1 G3a, HT's rebuilt chart | 0.7399 | 235.0 [1.365] | not run | 219.3 [52.4] | 26.8 [15.1] | 0.213 [20.0] |

- **Source frame with Standard Model equations:** the flow from equal cell couplings ends at 2.1e13 GeV, where alpha_3 reaches 0.97. No low-energy mass exists in that frame.
- **Scan rows** (F1b, F2, F4, F7, G3b, g_1 or g_3 as reference): m_t 106.5 to 173.0, m_b(m_b) 96.7 to 159.0, m_tau 36.8 to 57.8.
- **Neutrino variation** (y_nu = y_tau at the cell, one-loop terms): Dirac neutrino at 41 and 51 GeV; m_t drops by 1.4 and 2.8.
- F2 lands m_t within 0.6 percent, but its bottom and tau fail like every other row, so it carries no weight.

**4. Reduction (NOT BLIND, declared chart).**
- The measured third family at E_cell has y_t = 0.3731, y_b = 0.00513, y_tau = 0.00919. Over g_2 these are 0.737, 0.0101, 0.0182.
- F1's 1/2 is 0.68 of the top value, and 49 and 28 times the bottom and tau values.
- The measured family fills 0.815 of the one-family sum rule.
- Post hoc, zero weight: the top leg alone at saturation, y_t = √(2/3) g_2 = 0.4133, gives m_t 179.5 (179.7 with SMDR), +4.3 percent.
- In the source frame, g/2 is 0.68 of HT's criticality value 0.6452.

**5. Structural lead for the split (EXACT, added after the rows were seen).**
- Classified by pattern degree N, the top joins degrees 2 and 3, bottom and tau join 1 and 2 (3 and 4), and the neutrino joins 0 and 1 (4 and 5).
- The degree commutes with the twelve link generators. A toggle amplitude that reads the degree is link-invariant and has three values: y_t; y_b = y_tau; y_nu.
- That is the measured grouping. It would need y_b/y_t = 0.0138 and y_tau/y_t = 0.0246, and it sets y_b/y_tau = 1 against 0.56.
- The top is the only leg a code state (degree 1) cannot reach by one toggle.

**Looks:** 13 before registration; 17 registered rows and 4 post hoc rows, compared once; 5 SMDR-attached top masses; 3 mental estimates after registration.

## EVIDENCE

Everything is in `work/YC/`. `sh run_all.sh` rebuilds all of it (estimated 4.5 minutes; not run end to end, each step was run on its own). Individual steps run as `PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python <script> <out.json>`:

- `CANDIDATES.md`: written 08:02:49, before the first script (08:04:24). Addendum 1 at 08:15, before its scripts; outcomes at 08:19. sha256 `8ba775ae6a5997a1…`.
- `yc_functional.py` (1 s): Hessians, Higgs plaquette, W mass check, legs, readings, circulant factors, L2. Imports `work/GL/gl_lib.py` read only.
- `yc_legs.py`: degree classification and the degree-dependent toggle.
- `yc_gate.py`: the ported beta functions match SMDR's own evaluation to 1.3e-16 with all nine Yukawas nonzero. The integrated trajectory matches LEW's `rg` driver on HT's C4 row to 1.0e-12.
- `yc_run.py` (7 s, 17 rows) and `yc_addendum.py` (4 post hoc rows); library `yc_rge.py`.
- `yc_smdr_row.py "<row>" <out> 3 [rows.json]`: SMDR G_F attachment through LEW's `heavy match` driver, 30 to 65 s per row, five rows. G_F residuals are 1e-8 to 2e-5.
- `yc_compare.py`: the only script that reads measured values (the audit package's `pdg2026_reference.json`, LS's `compare.json`).

The public checkout moved back from `repair-law/reverse-engineering-reality` to `reverse-engineering-reality` at 08:16 during my run. Another process did this; I only read it.

## WHAT THIS DOES NOT ESTABLISH

- **That y = g/2 is the source's value.** It rests on the register sitting in a Higgs state with unit amplitude (R8, declared), one toggle direction with the same beta as the gauge plaquettes, and a four-direction isotropic lattice. The registered readings span 0.35 g to g per family.
- **A value for g on the declared chart.** That chart has unequal couplings at the cell, which contradicts the functional. Taking g_2 as the reference is a choice; g_1 and g_3 move m_t by +13 and −2.5 GeV.
- **Any discrimination from the top mass.** The infrared quasi-fixed point compresses a factor 2.9 in y_3(E_cell) into a factor 1.4 in m_t.
- **The generation readings.** The circulant register is declared; one family and three copies differ by a factor 1.68.
- **Accuracy of the heavy-bottom rows.** SMDR's matching treats bottom and tau as light, so those top masses are a control. The 1.4 to 2.3 GeV gap to the tree attachment is the size of that uncertainty.
- **Complete two-loop terms.** Second-family terms use SMDR's light-flavour form, and the neutrino Yukawa enters at one loop only.
- **A source-frame mass.** HT's rebuilt chart uses census BE, which is not the source's census.
- **That a degree rule exists in the source.** The classification is exact; no law for the amplitude was found.
- **Blindness.** Nothing here is blind. The top-alone rows were chosen after the equal-leg rows were seen.

## NEXT

1. **Find the object that reads the degree.** GL's M1b already has a thirteenth current, the overall occupation phase of the code. Compute the toggle with a link for that current, or with the register quantum's degree charge, and test whether the 2↔3 transition is weighted against 1↔2. Targets (NOT BLIND): 0.0138 and 0.0246 relative to the top.
2. **Test the sum rule on the audit's family cell.** With QM's cell and the Peter-Weyl links, measure the register's wave-function weight against the link term at declared y, and check the sum over species of y² against 2 g². This replaces the mean-field register by the audit's memory.
3. **Decide the register state.** The ratio 1/2 needs unit amplitude. With HT's unbounded register the amplitude is free and only the sum rule's form survives.
4. **Source frame.** The Standard Model flow from the cell ends at 2e13 GeV, so no Yukawa prediction can be run down there until the colour coupling at the cell is settled (SC's bound 1/alpha_3 ≥ 18.24).
