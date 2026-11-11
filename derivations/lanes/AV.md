## RESULT

Form of every row: `<A> = M exp(-c S)`, `S = 2 pi/(4 alpha)`, `S_U = 38.1964` at `1/alpha_U = 24.3166`. The count of LV is `4/c`. The working law is `c = 1` with `b M = 1`.

**1. No lattice ensemble has the working law. The coefficient 1 belongs to one pinned link.**

- `c = 1` holds exactly for one free link in its one-tick thermal law with the heat-kernel weight. There the seam's plaquette cannot move. `M = 2` on the Cartan circle and `M = 2 (2S - 1) = 150.79` on the full link (EXACT).
- With the Gauss law and a moving link the half turn is shared with the surroundings. Then `c = 1 - Pi`, where `Pi g^2` is the flux variance of the seam's time-like plaquette (EXACT on the Cartan circle, MEASURED for SU(2)).
- Measured coefficients lie between 0.32 and 0.50. `b M = 1` at `c = 1` needs `b = 1/2` on the Cartan circle or `b = 1/150.79` on the full link.

**2. The identity (EXACT).** With one tick written as `T = K^(1/2) exp(-W) K^(1/2) P`, `A` commutes with the electric kernel `K` and the Gauss projector `P`. So `<A> = Z[the seam's time-like plaquette with weight k(-V_P)]/Z`. Heat kernel: `k = K_tau`, `tau = g^2/2`. Wilson: `k = exp((beta/2) tr V)`. `A` is read at the midpoint of the electric step (DECLARED).

**3. One register, by weight power (EXACT, chain coupling).**

| Register | weight power | heat time | `<A>` | c | M |
| --- | --- | --- | --- | --- | --- |
| Cartan circle | none | `g^2/2` | 5.1586e-17 | 1 | 2 (12 digits) |
| full link | 2 | `g^2/2` | 3.8892e-15 | 1 | 150.786 |
| one-sided register | 1 | `g^2/2` | 0.03378 | no exponential | leading form `tau/8` |
| labels alone | 0 | `g^2/2` | 0.16740 | no exponential | `1/(2 sqrt(pi/tau) - 1)` |

Weight powers 1 and 0 give power laws at every heat time. At heat time `tau/c` the power-1 values are 0.071 (`c = 1/2`) and 0.113 (`c = 1/3`).

**4. Cartan circle on each complex (EXACT, Villain weight). `<A> = 2 exp(-c S)`, `M = 2`.**

| Complex | c | count | `<A>` at `S_U` |
| --- | --- | --- | --- |
| one free link, one tick, no Gauss projection | 1 | 4 | 5.159e-17 |
| icosahedral space, one tick with the Gauss law | 19/30 | 6.32 | 6.24e-11 |
| two faces on one seam, outer links pinned (Euclidean) | 1/2 | 8 | 1.016e-8 |
| cubic lattice, four dimensions | 1/2 | 8 | 1.016e-8 |
| icosahedral space, many ticks | 0.398231 | 10.044 | 4.954e-7 |
| face pair as space, many ticks | 1/(2 sqrt 2) | 11.31 | 2.73e-6 |
| cubic lattice, three dimensions | 1/3 | 12 | 5.909e-6 |
| icosahedral surface as a Euclidean two-complex | 1/20 | 80 | 0.296 |
| two-dimensional complex with a free boundary | 0 | infinite | 1 |

- Cubic side `L`: `Pi = (2/d)(1 - L^-d)`, checked in rational arithmetic.
- Icosahedral space: `c = (1/30) sum sqrt(lam/(lam + 4))` over the face Laplacian (`3 - sqrt 5`, 2, 3, 5, `3 + sqrt 5`).
- Corrections beyond the two orientations are below 2e-10 at `S_U`.

**5. LV's statements.**

- Reproduced as stated (EXACT): 12 corners, 30 seams, 20 faces, rank 19, face variance `(19/20) g^2`. One seam at `2 pi` gives `(+2 pi, -2 pi)` with action `4 pi^2/g^2`. The joint density of the pair is the square of the one-face density, 2.66e-33 at `S_U`. Cubic plaquette variance `2 g^2/d`.
- These are densities of the plaquette flux at a half turn: `2 exp(-S/Pi)`. The class balance is `2 exp(-S (1 - Pi))`. The count `8/d` is the density count. The class-balance count is `4d/(d - 2)`: 12 and 8.
- LV row N8 for `d = 3` used `c_E = 2/3`. The electric variance is `(1 - Pi)/g^2`, so `c_E = 1/3` and `<A> = 5.9e-6` in place of 1.7e-11. The row for `d = 4` stands.

**6. SU(2) Monte Carlo, electric-step reading (MEASURED).** Seven couplings, `beta = 2.5` to 9, fit `ln <A> = ln M0 + p ln S - c S` over `beta >= 4`.

| Complex | Weight | weight power (measured) | c, p = 1 | c, p free | p | predicted c | `ln <A>` at `S_U` | `M_U` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cubic `6^4` | heat kernel | 2.005 (0.002) | 0.5001 (0.0008) | 0.4978 (0.0067) | 0.93 (0.20) | 0.5004 | -13.921 (0.018) | 179.7 (3.3) |
| cubic `8^3` | heat kernel | 2.00 (0.06) | 0.3347 (0.0012) | 0.3447 (0.0112) | 1.30 (0.34) | 0.3346 | -7.795 (0.021) | 146.5 (3.1) |
| icosahedral space, 8 ticks | heat kernel | 1.93 (0.05) | 0.3988 (0.0005) | 0.3968 (0.0044) | 0.94 (0.13) | 0.3983 | -10.292 (0.012) | 137.4 (1.7) |
| cubic `6^4` | Wilson | 1.961 (0.012) | 0.4196 (0.0014), chi2 18.0/3 | 0.3999 (0.0049) | 0.40 (0.15) | 0.4053 | -11.612 (0.013) | 47.9 (0.6) |
| cubic `8^3` | Wilson | 1.95 (0.04) | 0.3197 (0.0013) | 0.3381 (0.0081) | 1.55 (0.24) | 0.3193 | -7.042 (0.021) | 172.9 (3.6) |
| icosahedral space, 8 ticks | Wilson | 1.96 (0.04) | 0.3693 (0.0005) | 0.3655 (0.0045) | 0.89 (0.13) | 0.3664 | -9.162 (0.012) | 125.7 (1.5) |

- `M_U = <A>(S_U) exp(c S_U)` with c at its prediction. With the fitted c: 178 (6), 147 (7), 140 (3) for the heat kernel.
- Heat kernel: all three coefficients agree with `1 - Pi` within one standard error and 0.2 percent. This is the registered agreement.
- Wilson: predicted c is the classical minimum of the twisted action over `2 pi^2`: 8.000, 6.302, 7.233. In four dimensions the minimum is the pinned configuration, LV's "Wilson form, 8/g^2". The `8^3` value agrees. On `6^4` the fit with `p = 1` is excluded and the free fit agrees (-1.1 standard errors). On the icosahedral space the fit with `p = 1` is 0.8 percent and 5.7 standard errors high and the free fit agrees.
- Registered candidates that fail on every scan: `c = 1` (50 to 68 percent off), LV's density counts `d/2`. LV's N8 value 1/2 agrees for `d = 4` and its 2/3 fails for `d = 3`.
- Multiplicity. In four dimensions `M_U` equals the Gaussian-link value `2 (2cS - 1) = 74.5` times the heat-kernel measure factors on the classical half turn, 2.375: 176.8 against 179.7 (3.3) (ARGUED, computed after the measurement). On `8^3` and the icosahedral space this form gives 86 and 115 against 147 and 137.

**7. Sector law of the lattice link (MEASURED).** `p_n` from the untwisted ensemble, fit `n^w exp(-t (n^2-1)/4)`.

- Weight power 2 for both weights (table above). The link is a full link.
- Heat time: `tau/t` = 0.4763 (0.0003), 0.3038 (0.0028), 0.3780 (0.0035) for the heat kernel at `S_U`, five to nine percent below c. On `6^4` it rises with `beta`: 0.4505, 0.4621, 0.4691, 0.4763, 0.4807.
- So the lattice link has the right weight power and a heat time longer than `g^2/2` by about `1/c`: a factor 2.1 in four dimensions, 3.3 in three, 2.6 on the icosahedral space.
- Wilson: the bulk of the law has nearly the same width (0.4700 on `6^4`), and the class balance follows the classical minimum 0.405. The balance is set by the tail of the law.

**8. With the doublet (MEASURED, compact form, `4^4`, `beta_G` at the chain coupling, `beta_H = 2 beta_G`).**

| Side | heat kernel `ln <A>` | Wilson `ln <A>` |
| --- | --- | --- |
| symmetric, h = 0, 0.5, 1.5 | -13.985 (17), -13.983 (17), -14.111 (17) | -11.640 (11), -11.633 (12), -11.635 (12) |
| Higgs, h = 1.5, 3, 4 | -18.234 (13), -18.262 (13), -18.274 (13) | -13.328 (6), -13.335 (5), -13.345 (5) |
| Higgs, `beta_H/beta_G` = 8, 32 | -24.044 (7), -29.476 (4) | -14.505 (2), -15.152 (1) |
| one pinned link | -33.181 | -15.480 |

- The class balance changes across the line. Heat kernel: by -4.230 (0.012) in the logarithm, a factor 0.015. Wilson: by -1.700 (0.007), a factor 0.18. Gaussian estimate with the link mass `m^2 = 2 sin^2 theta`: -3.91.
- At `h = 0` and 0.5 the symmetric side agrees with the pure-gauge value on `4^4` within about two standard errors: -13.936 (15) and -11.615 (11). At `h = 1.5` the heat-kernel value is 0.13 lower.
- A stiffer doublet pins the link and moves `<A>` toward the one-link law. At `beta_H = 32 beta_G` the Gaussian form with the link mass gives -29.54 against -29.476 (4).

**9. Second reading: `A` at the midpoint of the face step.** The faces of the seam are half twisted in addition.

- Cartan circle (EXACT): c = 1.2874 (`4^4`), 0.7008 (`6^3`), 0.7424 (icosahedral space). The engine reproduces these at `S_U` within one standard error.
- SU(2) heat kernel (MEASURED): 1.2919 (0.0016), 0.7046 (0.0022), 0.7443 (0.0007). Wilson: 1.0830 (0.0015), 0.5976 (0.0013), 0.6397 (0.0007).
- Clock (EXACT, Cartan circle), c for n electric steps per tick, electric and face reading:

| Steps per tick | cubic, 3 space dimensions | cubic, 2 space dimensions | icosahedral space |
| --- | --- | --- | --- |
| 1 | 0.500, 1.284 | 0.333, 0.698 | 0.398, 0.742 |
| 2 | 0.673, 0.944 | 0.424, 0.543 | 0.489, 0.598 |
| 4 | 0.758, 0.836 | 0.463, 0.496 | 0.526, 0.556 |
| continuous | 0.796 | 0.479 | 0.541 |

- No whole number of steps gives 1 in either reading. Nearest rows: two steps per tick, face reading, three space dimensions, 0.944 (5.6 percent low); Wilson, `4^4`, face reading, 1.083 (8 percent high). Both lie outside the registered margin.
- LV's N5 (continuous time, 0.796) is reproduced. LV's argued N6 (two field steps, 0.607) has the exact discrete-time values 0.673 and 0.944.

**10. Value at the chain coupling and v (task 5).** `E_cell = 9.5599e18 GeV`. The staged ratio measures `<A>` at `1/alpha_U` directly. Fits were hashed at 13:18:55 and the comparison ran once after it. NOT BLIND against 246.22 GeV (PDG 2024, from `G_F`).

| Law | c | v at `b M = 1` (GeV) | v at `b = 1` (GeV) |
| --- | --- | --- | --- |
| one pinned link, Cartan circle (EXACT) | 1 | 246.6 | 493.2 |
| one pinned link, full link (EXACT) | 1 | 246.6 | 3.72e4 |
| heat kernel, `6^4` | 0.5001 (8) | 4.83e10 | 8.60e12 |
| heat kernel, `8^3` | 0.3347 (12) | 2.68e13 | 3.94e15 |
| heat kernel, icosahedral space | 0.3988 (5) | 2.32e12 | 3.24e14 |
| Wilson, `6^4` | 0.3999 (49) | 2.2e12 | 8.66e13 |
| Wilson, `8^3` | 0.3197 (13) | 4.75e13 | 8.36e15 |
| Wilson, icosahedral space | 0.3693 (5) | 7.15e12 | 1.00e15 |
| face reading, heat kernel, `4^4` | 1.2919 (16) | 3.6e-3 | 43.9 |
| face reading, Wilson, `4^4` | 1.0830 (15) | 10.4 | 8.2e4 |

- Error of v at `b M = 1`: a factor `exp(38.2 x error of c)`, 2 to 5 percent for the heat-kernel rows, 19 percent for Wilson `6^4`.
- Wilson `6^4` uses the free fit. Its coefficient with `p = 1`, 0.4196, gives 1.05e12 GeV.
- The measured v needs `c = 1.00004` at `b M = 1`.
- Every electric-step row is 8 to 14 orders above the measured scale.
- One row lies within a factor of ten: heat kernel, `4^4`, face reading, `b = 1`, 43.9 GeV (0.18 of the measured value), with `c = 1.29` and `M = 1.2e4`. It is one of 22 law rows and counts as a look.

**11. Checks of the unreviewed HR files.** The hop term has unit kinetic coefficient on `Phi = (2/g) theta` (checked). An independent Metropolis engine reproduces HR's compact numbers at HR's point: plaquette 0.84835 (17) against 0.84824, `sin^2 theta` 0.0586 (3) against 0.0592, at `h = 3` 0.88467 (14) against 0.88428 and 0.98598 (12) against 0.9852. `beta_H = 0` gives 0.7996 (3) against 4/5.

## EVIDENCE

All files are in `work/SIM/phase2/AV/`. `run_all.sh` lists the rebuild. Local scripts run with `PYTHONDONTWRITEBYTECODE=1 python <script>`.

- **Registration.** `METHOD_PREREG.md` and `CANDIDATES_PREREG.md` as hashed at 12:26:28 before any script ran (`PREREG.sha256`). `METHOD.md` section 10 holds three corrections. `CANDIDATES.md` Addendum 1 records what was on file before each later run. 23 registered rows.
- **Exact gate.** `av_abelian.py` (9 s) writes `abelian.json`: one-register laws, projectors, LV's statements, face-step exponents, Wilson minima. `av_clock.py` writes `clock.json`.
- **Engine.** `av_complex.py`, `av_engine.py` (numba, generic two-complex, quaternion links, multi-hit Metropolis, compact doublet), `av_run.py` (staged ratio), `av_engine_fm.py` and `av_run_fm.py` (second reading), `av_tasks.py`.
- **Estimator.** Twisted plaquette with `ln W = (1 - lam) ln k(V) + lam ln k(-V)`, 24 to 40 stages. Each step uses `ln<exp(D/2N)>_k - ln<exp(-D/2N)>_(k+1)`, exact without quadrature. Forward, backward and Simpson estimates agree with it in every task (`prod_*.log`).
- **Direct average.** It is biased low where the spread of D exceeds a few units, at every size of `<A>`. On the icosahedral two-complex the exact value is 0.85 and the direct average 0.002. It served as a check only.
- **Gates (`gates.json`, `av_gates.py`, 18 verdict rows pass, 0 fail).**
  - Heat-kernel dual form against the character sum: 5.9e-13.
  - Migdal on the icosahedral two-complex: pulls -1.46, +1.37 (heat kernel), -1.00, +1.46 (Wilson).
  - Cartan circle through the engine against the exact form: pulls +0.41, -1.83, +0.15, +1.08, and at `S_U` -0.32 (`6^4`), -0.66 (`8^3`), -0.22 (icosahedral space).
  - Wilson plaquette on `6^4`: 0.6032 (6) and 0.6540 (4) against 0.6024 and 0.6520 (IMPORTED; HR measured 0.6530 (4)).
  - Local weights against total weight 9e-12, gauge invariance 9e-13.
  - Direct average against staged ratio at `beta = 2.5`: -1.6271 (48) against -1.6187 (49).
- **Runs (compute box, four cores, `~/av`).** `gates_out` (14 tasks), `prod_out` (71 tasks, 32 minutes), `fm_out` (28 tasks, 16 minutes). All copied back, 11 MB. Nothing is running on the box.
- **Fits.** `av_fit.py` writes `fits.json` and `FITS_TABLE.md`. `FITS_BEFORE_COMPARISON.sha256` holds their hashes. `av_compare.py` is the only script that reads a measured value: `compare.json`, `compare.log`.
- **Size and tick checks at `S_U`.** Heat kernel: `4^4` -13.936 (15) against `6^4` -13.921 (18); `6^3` -7.860 (20) against `8^3` -7.795 (22), Gaussian shift -0.068; icosahedral space with 4, 8, 16 ticks -10.269 (13), -10.292 (12), -10.299 (12), with 2 ticks -10.860 (29).
- **Candidate package.** `rer_package/seam_class_balance/`: README.md, PROOF.md (13 sections, labelled), exact.py, fits.py, mini.py, certificate.py, engine and drivers, measured_points.json (110 reduced points with hashes of the raw files), results.json, test_class_balance.py. `python -m seam_class_balance --check` passes 73 named checks. `pytest` passes 12 tests in 10 s without numba. The package names no private report and holds no retired value.
- **Custody.** No git command was run. RER was only read. One file was written outside the lane: the site data below. One local job (`av_abelian.py`, first version) ran four minutes before it was stopped and replaced by the sparse version.

## WHAT THIS DOES NOT ESTABLISH

- **A source law with `c = 1`.** The result says where the coefficient 1 lives. It does not supply the construction that pins the seam's plaquette at the smallest collar.
- **Which reading the mass step uses.** The electric-step reading is declared. The face-step reading gives different coefficients. The mechanism of LV does not fix the point of the tick at which `A` acts.
- **The clock.** Every lattice has one electric step per tick and the tick equal to the cell. The clock table is exact for the Cartan circle only. No SU(2) run used two steps per tick.
- **The full link of G.** Only the weak factor was simulated. Hypercharge and colour links and the 5-trace action are absent.
- **The prefactor.** `p = 1` is argued. On Wilson `6^4` it fails. The multiplicity carries a factor from charged fluctuations that was not computed. `b` and the bare angle are untouched.
- **Volume.** `6^4`, `8^3` and 8 ticks. Size checks exist at one coupling. The icosahedral space with 2 ticks differs by 0.57 in the logarithm, and the tick dependence of M was not separated from c.
- **The doublet system.** HR's compact form with its declared measure and `beta_H = 2 beta_G`, on `4^4`, six points per weight. The line itself was not located. At `h = 1.5` both sides were stable for the run.
- **The row at 43.9 GeV.** It is NOT BLIND, a look, with a coefficient 29 percent above 1.
- **The sector-law fit.** The form `n^w exp(-t C)` describes the bulk. The class balance of the Wilson link is not given by the fitted w and t.

## NEXT

1. **For the theory session.** The working law is the law of a seam whose time-like plaquette is pinned for one tick: a one-tick thermal link without Gauss averaging at its ends. State the collar construction that does this, and its multiplicity: 2 needs `b = 1/2`, 150.79 needs `b = 1/150.79`. A one-sided register (weight power 1) cannot carry it.
2. **Two steps per tick.** Add per-type plaquette weights to `av_engine.py` and measure the face reading on an anisotropic `4^3 x 8` lattice. The exact Gaussian value is 0.9436. This tests the nearest row.
3. **Decide the reading.** Execute R8's face variant on a two-link model and read at which point of the tick `A` acts. This selects one column of the clock table.
4. **Full link.** Add the hypercharge angle (HR section 6 form) and twist by `z_3`. The engine needs one more link field.
5. **Multiplicity.** Compute the charged-mode determinant on the classical half turn, or measure `M` on `8^4` and `12^3`.

## FOR THE SITE

- **File.** `oph-physics-sim/oph_defects/viewer2/research/AV/class_balance.json` (64 kB), fetched as `'/rl/AV/class_balance.json'`. No page module was written.
- **Fields (documented inside under `fields`).**
  - `series[]`: six measured curves with `points[]` (`x = 1/alpha`, `S`, `lnA`, `err`, `in_fit`), `fit` (adopted c, error, p, count), both fits, `c_predicted`, `M_at_x_U_with_predicted_c`, `sector_law` (w, heat time), `candidates`.
  - `one_register[]`: exact curves for the Cartan circle and weight powers 2, 1, 0.
  - `exact_counts[]`, `flux_density_statements[]`, `wilson_classical`, `doublet[]`, `doublet_change`, `second_reading[]`, `clock`, `gates`, `statements[]` (text, label, status), `comparison_not_blind`.
- **Hook lines for a page.** `const d = await (await fetch('/rl/AV/class_balance.json')).json();` Plot `series[].points` as `lnA` against `x` with the lines `-c S` for c = 1, 1/2, 1/3. Show `statements[]` with their status words.
- **Links.** Existing backing on the public main branch: `RER/model/defect_particle_classes/PROOF.md` (the plaquette cost 4 of class 3). The package `seam_class_balance` is a candidate and has no public path yet.
- **Wording.** The status of the working law's sector law stays "open". The measured statement is: the lattice link has `c = 1 - Pi`. The comparison block is NOT BLIND and names PDG 2024.
- **One caution.** The fitted count of the icosahedral space is 10.03 (0.01). It is a different quantity from the retired value 10.03 of the addendum. Show the exact count 10.044.
