## RESULT

**Short answer.** The unbounded class-3 register is built and passes the Gauss law. The source gives it no quartic at tree level, and the quartic induced at the cell is negative (−1.4e-3 to −3.1e-3 on the source's own dispersions), so it lies outside HT's window. That quartic fixes only a relation m_H(m_t). With the reference m_t as input it gives m_H between 125.04 and 126.02 GeV (reference 125.13, NOT BLIND). The missing item is one number: y_t(E_cell).

**1. The register (definition written before computing).**
- Per cell there are four oscillators: a_k for orientation +3 and b_k for orientation −3, k over the two doublet levels. The lowering operator is B_k = a_k + b_k†, with R8's charges.
- EXACT (sympy, on states below the truncation edge):
  - B is normal and all B commute.
  - Truncation to at most one quantum is the audit's five-state memory, fields and energy. With b = 0 it is R8's register.
  - The register charges transform B as the doublet levels.
  - The toggle V = Σ_k (c†_{s_k} B_k + h.c.) commutes with pattern plus register charges.
- New identity (EXACT): V² = Σ_k B_k† B_k. The mass step exp(−igV) therefore rotates every pattern by the operator angle g|B|, which is g|β| on a Higgs state. The same amplitude applies to all four legs.
- Gauss law with the five-level code and GL's link (MEASURED): two cells, one 27-state link, 194,400 states. Toggle, register transport through the doublet block, electric term, oscillator energy and (B†B)² commute with G_x and G_y for all twelve generators (1.1e-16). Without the register's charge the commutator is 0.219.

**2. Tree level: the coherent law supplies no (Φ†Φ)² term (EXACT).**

| Candidate cost of an occupation | Two-quanta energy U_2 | Verdict |
| --- | --- | --- |
| A1: oscillator ladder ωN | 0 | λ_0 = 0; this is the definition of the register (DECLARED) |
| A2: reflection about the vacuum, ω(1 − δ_N0) | −ω | bounded; no cost beyond the first quantum |
| A3: central-flux cost c_3 (N mod 2), c_3 = 4/5 | −2c_3 | the Z2 bit of HT's C1 |
| A4: Gauss electric energy | none | zero on static states; Coulomb part of gauge exchange |
| A5: swap test, normalized | none | no modulus term |
| A5: swap test, unnormalized | order one per link | HT's nonlinear end |

- The plaquette cost gives a derived cost table by class: (0, 17/10, 9/10, 4/5, 9/10, 17/10). The swap-test form gives (0, 1/5, 3/5, 4/5, 3/5, 1/5).

**3. Induced quartic at the cell.** With λ_0 = 0 and one-loop matching of the zero-point energies to MSbar at μ = E_cell = ħ/tick (ARGUED; MSbar constants IMPORTED):

λ(E_cell) = (1/16π²) [ −3 y_t⁴ (3/2 − c_f) + (3/16) X (5/6 − c_V) ], with X = 2g2⁴ + (g2² + gY²)².

Chart (i) is the declared D10 packet run to E_cell; chart (ii) is GL's cell couplings. Values are at the critical Yukawa of each chart.

| Regulator | c_f | c_V | λ, chart (i) | λ, chart (ii) |
| --- | --- | --- | --- | --- |
| One constant for all species (B1 to B3) | any | same | −2.84e-4 | −2.16e-3 |
| B4: CF-1 tick on the cone cell; GL link waves | 0.772 | 5.012 | −2.09e-3 | −1.59e-2 |
| B4t: same; links with two field steps per tick | 0.772 | 3.464 | −1.43e-3 | −1.09e-2 |
| B6t: member B (even part); GL link waves | −1.646 | 5.012 | −3.12e-3 | −2.37e-2 |

- With one constant for all species the value is exactly −X/(128π²), independent of the regulator.
- The full CF-1 zone has 32 cones, so it changes β_λ and is no threshold.
- Member B's spectrum is odd in the mass angle. Its zero-point sum has a linear term (−0.0169 per cell, tick and degree of freedom), which is a tadpole for the register.

**4. Flows (SMDR two loops, G_F attachment; gate reproduces HT's C4 row 131.90378, 174.97624).** No Yukawa condition passes; the percentages are against the references H 125.13, t 172.1 (NOT BLIND).

| Condition for y_t(E_cell) | m_H (GeV) | m_t (GeV) | vs reference |
| --- | --- | --- | --- |
| β_λ(E_cell) = 0 kept, quartic B1 / B4 / B6t | 131.92 / 132.02 / 132.09 | 175.02 / 175.32 / 175.49 | +5.4 to +5.6 %, +1.7 to +2.0 % |
| No induced register mass (Veltman), one regulator | 116.47 | 167.54 | −6.9 %, −2.7 % |
| Same, source's dispersions | no usable solution | | y_t = 1.57, or none for member B |
| YC's logged values 0.2531 / 0.4257 (D11 engine, top leg only) | 53.6 / 146.0 | 140.5 / 182.8 | −57 % / +17 % |
| Compositeness (D11 engine) | 239 to 243 | 235 to 238 | +91 % |

- Sensitivities: m_H moves 2.06 GeV per GeV of m_t and 0.33 GeV per 1e-3 of λ(E_cell).

**5. Comparison of the relation (NOT BLIND, run once).**

| Quartic law | m_H at m_t = 172.1 | Deviation |
| --- | --- | --- |
| λ(E_cell) = 0 | 126.015 | +0.71 % |
| B1 | 125.935 | +0.64 % |
| B4t | 125.56 | +0.34 % |
| B4 | 125.345 | +0.17 % |
| B6t | 125.043 | −0.07 % |

- Three loops move the relation by −0.32 GeV at fixed m_t. The D11 engine reads 1.1 % lower.
- The reference pair implies λ(E_cell) = −2.74e-3 and y_t(E_cell) = 0.37368, which is 0.7382 g2(E_cell) and 0.9625 of the one-loop critical value.
- The data do not separate the laws: 0.43 GeV of m_t covers the whole spread.
- On these trajectories λ is negative from 3.0e13 GeV (B4) or 1.1e16 GeV (λ = 0) up to the cell. There is no double-critical point.

## EVIDENCE

Everything is in `work/UH`. `sh run_all.sh` rebuilds all of it in about 8 minutes; single scripts run as `PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python <script>`.

- **Order on record.** `DEFINITION.md` and the candidate list are hashed in `PREREG.sha256` (08:00:50), before any script. `CANDIDATES_PREREG.md` is the list as hashed. `CANDIDATES.md` carries Addendum 1 (YC's values, SMDR rows), Addendum 2 (B4t) and the outcomes. The header times in both files were estimates.
- **Register.** `uh_register.py` writes `register.json` (10 s).
- **Constants.** `uh_constants.py` writes `constants.json` (110 s); `uh_constants_b4t.py` adds B4t. Gates:
  - cube closed form agrees to 1e-15;
  - finite-mass residuals fall as M⁶ (`uh_gate_vector.py`, and in `constants.json` for the fermions);
  - member B Taylor coefficients converge as h² (`uh_gate_memberB.py`);
  - member B at φ = 0 reproduces the CF-1 tick to 1e-16.
- **Flows.** `gate_d11.py` (deviation 0.0), `uh_flows_d11.py`, `uh_y3_d11.py`, `uh_smdr_row.py <label> <quartic> <yukawa> <loops> <out>`, `run_smdr_rows.sh` (14 rows, `smdr_*.json`).
- **Comparison.** `uh_not_blind.py` is the only script that reads measured values; it ran once, after `ROWS_BEFORE_COMPARISON.sha256`. `uh_stability.py` uses its output.
- Nothing was written outside this directory except SMDR scratch files in the session scratchpad. RER, `work/GL`, `work/HT` and `work/YC` were only read. Nothing is still running.

## WHAT THIS DOES NOT ESTABLISH

- **m_t or m_H from the source.** The lane delivers one relation; y_t(E_cell) is open.
- **λ_0 = 0 as a native fact.** It holds for the oscillator ladder, which is my construction. The source's two native cost forms give bounded registers.
- **The constants c_f and c_V as the source's.** Three steps are declared: restricting fermions to one cone cell, reading the filled branch's zero-point sum as the potential, and taking the even part for member B. The spread between regulators is 1.7e-3 in λ. No lattice perturbation theory of the full tick with the register was done.
- **The chart.** All flows use the declared D10 packet as Standard Model couplings, LW's G_F attachment and the declared v. GL's cell couplings have no flow to m_Z, so their values are cell values only.
- **The register's quadratic term.** Frequency, transport coefficient and the hierarchy are untouched. In B4 the induced mass term is positive and of cell size.
- **YC's values** were read from its logs before its report existed, and were run with the top leg only.

## NEXT

1. **YC:** the target is y_t(E_cell) = 0.7382 g2(E_cell) = 0.3737 on the declared chart (NOT BLIND). One common toggle amplitude gives equal legs, so the top needs a leg-dependent amplitude.
2. **Replace the declared law.** For the Higgs and top row, use "λ(E_cell) = induced quartic of the free register" in place of double criticality; the row then needs only y_t.
3. **T3:** a one-cone routing that keeps a light register must have a spectrum even in the mass angle; member B does not. Either the lazy term carries the register, or another gapping letter is needed.
4. **Fix c_f and c_V** by one-loop lattice perturbation theory of the adopted tick with GL's links and this register. This also gives the induced mass term.
5. **Audit team:** replace the five-state memory by this register with an occupation cutoff, and read the two-quanta energy at fourth order in the Yukawa as a direct check of the induced quartic's sign.
