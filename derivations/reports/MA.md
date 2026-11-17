# MA report: the link field of CF-1 in the plaquette-action Gibbs ensemble at the census densities (run H4)

Brief: `repair-law/work/SIM/cf1/GAUGE_BRIEF.md`. Scripts: `repair-law/work/SIM/cf1/gauge/`. Results:
`repair-law/work/SIM/cf1/runs/H4_*.json`. Labels: EXACT, MEASURED (error from independent configurations or binning),
ARGUED. Nothing here is a claim about quantum chromodynamics. This file is appended after every finished part.

## Part 0. The Monte Carlo code and its checks

Code: `gauge_mc.py`. Links n in 0..N-1 (U = omega^n), the link from x to x + e_mu as in `cf1_lib.Engine`. Weight
exp(kappa sum_p Re W_p). Heat bath, checkerboard by direction (links of direction mu with equal parity of the transverse
coordinate sum share no plaquette, so each such set is drawn exactly from its conditional distribution). Two
implementations: numpy (vectorised over the checkerboard set) and numba (loop over the same set). Measurements: share
f of nontrivial plaquettes (per carrier: 3f), mean Re W, Wilson loops W(R, T) averaged over all positions, the three
planes and both orientations, Polyakov loops, flux clusters on the dual lattice (a nontrivial plaquette is the dual link
between the two cubes that share it; size = number of plaquettes; wrapping found by a breadth-first search with
unwrapped coordinates).

Checks (`gauge_selftest.py`, box log of 13:30 UTC):
- EXACT: plaquettes and all Wilson loops are unchanged by a random gauge transformation (Z2, Z3); W(1, 1) equals the
  mean plaquette to 1e-12.
- EXACT: cluster bookkeeping on hand-made fields: one flipped link gives one cluster of 4 plaquettes; a sheet of
  flipped links across the torus gives two clusters of 8 that wrap along the line direction and no other; a finite
  4 x 3 sheet gives one closed cluster of 14 = its perimeter, not wrapping.
- MEASURED: exact enumeration of Z2 on the 2^3 torus (2^24 states) at kappa = 0.5: <Re W> = 0.654778 (EXACT);
  numpy heat bath 0.6539(25), numba heat bath 0.6533(11).
- MEASURED: strong coupling, 8^3: Z2 at kappa 0.15: 0.1487(15) against the one-plaquette value 0.1489 (corrections
  O(kappa^5)); Z3 at kappa 0.2: 0.1054(18) against 0.1044.
- MEASURED: numpy against numba on 12^3 from cold starts, 3,000 sweeps: Z2 at 0.74: 0.8898(41) and 0.8814(39);
  Z3 at 1.0: 0.6856(10) and 0.6868(8).
- A trap found on the way (MEASURED): hot starts at large kappa freeze pairs of winding flux lines (Z2 at kappa = 1.0
  on 8^3: <Re W> 0.965 from a hot start against 0.9966 from a cold start after 300 sweeps). The net flux through any
  full lattice plane is trivial (EXACT: every link enters the product of all plaquettes of a plane twice), so these are
  not sectors but slow relaxation. Above the transition the scans use cold starts, below it hot starts; near it both.

## Part 1. Validation against the known transitions

Scripts `gauge_scan.py` (plans `validate`, `refine`), analysis `gauge_analyze.py`, table `runs/H4_scan.json`
(`Z2_validation`, `Z3_transition`). Runs: 2,000 thermalisation sweeps, 10,000 to 40,000 measurement sweeps, errors
from 20 bins.

Z2 (critical coupling kappa_c = 0.761413, dual of the 3D Ising model, tanh K_c = exp(-2 kappa_c), K_c = 0.22165463):
- Plaquette at kappa_c (MEASURED against an EXACT relation). The duality gives <Re W> = tanh k + (1 - u)/sinh 2k with u
  the Ising bond energy at the dual coupling (EXACT given the duality; derived in the analysis script). With the
  literature value u_c = 0.330 this is 0.94875 at kappa_c. Measured at kappa = 0.7614: 0.94926 (L = 16), 0.94931
  (24), 0.94926 (32), 0.94906 (48), errors about 1e-4. Agreement to 4e-4; the curve is steep there (d<Re W>/dkappa
  = 1.5 to 5), so this fixes the coupling scale to about 1e-3.
- Specific heat 3V var(Re W) peaks (MEASURED, parabola through the grid maximum) at 0.7551 (L = 24), 0.7571 (32),
  0.7582 (48), approaching from below; extrapolation with L^(-1/nu), nu = 0.630, gives 0.7595 +- 0.002 (ARGUED error).
- Polyakov-loop Binder cumulant (MEASURED): about 0 (confined) for kappa <= 0.757 at every size, 0.638 to 0.640 at
  kappa = 0.7614 for L = 24, 32, 48 and 0.65 to 0.66 above (deconfined value 2/3). Between 0.757 and 0.7605 the
  cold-start runs are not monotonic in L (the loop sector relaxes slowly there), so the crossing is only bracketed:
  0.757 < kappa_c <= 0.7614.
- Hot against cold starts on 48^3: equal within errors except at 0.760 to 0.770, where the hot start relaxes slowly
  (example 0.765: 0.9493 hot, 0.9542 cold). No metastability in the equilibrium sense: a continuous transition.
- Verdict (MEASURED): the program reproduces the Z2 transition at the literature coupling to about 2e-3 in kappa.

Z3 (first-order; dual of the 3D three-state Potts model, K_c = 0.550565 (literature), (e^K - 1)(e^K* - 1) = 3,
Re W in {1, -1/2} so the Potts coupling is 3 kappa / 2; this gives kappa_c = 1.0843, ARGUED):
- Hysteresis (MEASURED, 48^3, 1,000 + 8,000 sweeps, <Re W>): kappa 1.080: cold 0.8674, hot 0.8666 (both confined);
  1.082: cold 0.9393, hot 0.8800, half-hot half-cold start 0.8802; 1.084: cold 0.9488, hot 0.9034 (drifting, tau 523),
  mixed 0.8989; 1.086: cold 0.9511, hot 0.9199 (drifting), mixed 0.9374; 1.090: cold 0.9551, hot 0.9502 (tau 1,297).
  The two branches coexist from 1.082 to at least 1.086 on 48^3; the jump in <Re W> is about 0.06 to 0.07, in the
  nontrivial-plaquette share f from about 0.080 to 0.035. Specific heat on the hot branch at 1.084: 30 (tunnelling).
- Verdict (MEASURED): first-order transition with kappa_c in (1.082, 1.086), consistent with the duality value 1.0843.

## Part 2. Scans, the couplings kappa*, phases, string tension, flux clusters

Scans on 48^3 (`gauge_scan.py` plans `scan`, `kstar`; Z2 kappa 0.2 to 1.2, Z3 0.3 to 2.0; 6,000 to 10,000 sweeps; flux
clusters every 300 sweeps) in `runs/H4_scan.json` (`curves_48`). kappa* by interpolation of log f between bracketing
points, then 5 independent configurations drawn at kappa* on 96 x 48 x 48 (`gauge_draw.py`: 3,000 thermalisation
sweeps, 1,000 sweeps between draws, plaquette every sweep; `runs/H4_draw.json`), Wilson loops up to 12 x 12 on each draw
(`gauge_post.py`, errors from the five configurations; `runs/H4_wilson_draws.json`). f = nontrivial plaquettes per
plaquette; per carrier = 3f.

Selected points of f(kappa) on 48^3 (MEASURED, errors below 1 in the last digit unless stated):
Z2: 0.50: 0.2488; 0.60: 0.1863; 0.70: 0.1053; 0.74: 0.0609; 0.752: 0.0434; 0.754: 0.04024(18); 0.76: 0.026; 0.78:
0.0174; 0.797: 0.01365; 0.799: 0.01328; 0.82: 0.0102; 0.90: 0.0043; 1.0: 0.0017.
Z3: 0.50: 0.4835; 0.80: 0.3486; 0.925: 0.2718; 0.930: 0.2682; 0.935: 0.2645; 1.00: 0.2095; 1.06: 0.1347; 1.078: 0.0944;
1.080: 0.0887; (jump) 1.09: 0.030; 1.12: 0.020; 1.20: 0.0095; 1.50: 0.0011.

The four points (draws on 96 x 48 x 48, five configurations; MEASURED):

| point | target | kappa* | f measured (per carrier) | phase |
| --- | --- | --- | --- | --- |
| Z3, per carrier | 0.2678 per carrier | 1.0797 | 0.08976(24) (0.2693(7)) | confined, 0.002 to 0.006 below the first-order kappa_c |
| Z3, per plaquette | 0.2678 per plaquette | 0.9305 | 0.26781(3) | confined, strong coupling |
| Z2, per carrier | 0.0403 per carrier | 0.7982 | 0.013429(13) (0.04029(4)) | deconfined (above kappa_c = 0.7614) |
| Z2, per plaquette | 0.0403 per plaquette | 0.7540 | 0.04004(22) | confined, near-critical (0.0074 below kappa_c) |

(The Z3 per-carrier draw is 2 sigma above the target, 0.5 per cent; at the local slope this is 2e-4 in kappa.)

Wilson loops at kappa* (MEASURED on the draws; errors from five configurations; Creutz ratio chi(R, R)):
- Z3 per carrier, kappa 1.0797: AREA LAW. chi = 0.0744(13), 0.0481(12), 0.0376(12), 0.0310(14), 0.0279(19) for
  R = 2..6, flat beyond; sigma (chi, R = 5..8, weighted) = 0.0300(11), sqrt(sigma) = 0.173(3) per cell; fit
  ln W = -sigma RT - mu(R+T) - c over R, T = 2..8: sigma = 0.034(2).
- Z3 per plaquette, kappa 0.9305: AREA LAW, strong. chi(2,2) = 0.455(2), chi(3,3) = 0.416(26); W(4,4) = 5e-4 and larger
  loops are below the noise (2e-4). sigma about 0.42(3), sqrt(sigma) about 0.65 per cell (from R <= 3; upper loops
  unmeasurable).
- Z2 per carrier, kappa 0.7982: PERIMETER LAW. chi = 0.0038(1), 0.0007(1), 0.0003(0) for R = 2, 3, 4, then 0 within
  1e-4; sigma (R = 5..8) = -0.6(4.3) x 1e-5, upper bound sigma < 9e-5, sqrt(sigma) < 0.009 per cell.
- Z2 per plaquette, kappa 0.7540: AREA LAW, small. chi = 0.0346(8), 0.0201(7), 0.0147(7), 0.0132(13), 0.0104(10),
  0.0121(18), 0.0102(11) for R = 2..8; sigma (R = 5..8) = 0.0112(6), sqrt(sigma) = 0.106(3) per cell. At this distance
  from kappa_c the correlation length is several cells (ARGUED), so the area law sets in only beyond R of about 4.

Flux clusters on the dual lattice at kappa* (MEASURED, five draws on 96 x 48 x 48, 221,184 carriers):
- Z2 per carrier: no cluster wraps. About 1,590 clusters per draw (0.0072 per carrier), mean size 5.6 plaquettes,
  largest 38 to 56. 1,012 of them are the elementary loop of 4 plaquettes around one link (45 per cent of all flux),
  296 of size 6, 122 of size 8. The flux is a dilute gas of short closed loops.
- Z2 per plaquette: one wrapping cluster holds 39 to 46 per cent of the flux (sizes 9,826 to 12,628 plaquettes); the
  rest is short loops (1,186 of size 4 per draw) and a tail of mid-size clusters up to a few hundred. Percolating.
- Z3 per carrier: one wrapping cluster holds 83 to 85 per cent of the flux (48,400 to 51,600 plaquettes); the rest is
  about 1,570 small clusters (1,012 of size 4). Percolating.
- Z3 per plaquette: one wrapping cluster holds 99.3 per cent of the flux. Percolating.
- Across the scan (48^3): percolating (wrapping in every measured configuration) in the confined phase, no wrapping
  cluster at any measured deconfined point; the largest-cluster share falls from 0.999 (Z2, 0.2) to 0.4 at the
  near-critical Z2 point and to 0.008 to 0.03 in the deconfined phase.

## Part 3. The H2/H3 readouts in the drawn link fields (`gauge_walk.py`, `runs/H4_walk.json`)

Set-up identical to `cf1_h2.py` / `cf1_h3.py`: lattice 96 x 48 x 48, packet width 5 at wave number 2 pi 8/96 along
axis 0, positive-branch coin, 48 ticks, alternating order, no rest angle, ballistic window of the free packet; mean
free path = -1/slope of log(ballistic/free); pair at separation s along axis 1 with effective link u(x) conj(u(x + s e1)).
Only the links differ: the five draws at each kappa*, a quantum of charge 1 sees omega^n.

Frame (ARGUED, and a trap found on the way). The Monte Carlo field is gauge-random (every link is uniformly distributed
by Elitzur's theorem), while the packet of H2/H3 is prepared in the frame where most links are 1, and the H3 pair link
is a strip flux only if the short sides are near 1. Run in the raw Monte Carlo gauge the readout would measure the gauge
noise. The draws are therefore brought to the Z_N Landau gauge (links as close to 1 as possible): complete axial
gauge, then annealing of the site variables (best of four annealing copies by mean Re U), plaquettes checked unchanged
(EXACT). Leftover flat pure-gauge walls are removed by a slab transformation, and a uniform holonomy (Polyakov sector,
gauge invariant, cannot be removed) is translated to a link layer away from the packet. A pure-gauge wall that does not
cross the initial packet has no effect on the density at all (EXACT, gauge covariance of the tick). Shares of
nontrivial links after fixing: Z2 per carrier 0.0048 to 0.0050 (configurations 3, 4: 0.0118 and 0.0079, partial
curved walls remain), Z2 per plaquette 0.040 to 0.044, Z3 per carrier 0.083 to 0.086, Z3 per plaquette 0.179 to 0.180.
Each configuration is read at four translations (the ensemble is translation invariant): 20 samples per kind. Errors:
from the five configuration means. Earlier passes are kept for comparison: `H4_walk_singlecopy.json` (one annealing
copy), `H4_walk_wallsinplace.json`, `H4_walk_translated_once.json`.

Results (MEASURED; rate per tick, mean free path = 1/rate in cells; pair column = pair rate / mean single rate):

| field (kappa*) | single mean free path | s = 0 | s = 1 | s = 2 | s = 4 | s = 8 | s = 16 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Z3 per carrier (1.0797), Z3 charge | 5.81 (5.74 to 5.88) | 0 | 0.98(1) | 1.08(1) | 1.12(0) | 1.13(0) | 1.13(1) |
| Z3 per plaquette (0.9305), Z3 charge | 5.17 (5.16 to 5.18) | 0 | 1.00(0) | 0.94(0) | 0.93(0) | 0.94(0) | 0.93(0) |
| Z2 per carrier (0.7982), Z2 charge | 60.2 (57.8 to 62.8) | 0 | 1.44(6) | 1.95(9) | 2.27(10) | 1.89(9) | 2.02(5) |
| Z2 per plaquette (0.7540), Z2 charge | 9.44 (9.34 to 9.55) | 0 | 0.87(4) | 1.27(4) | 1.53(2) | 1.61(2) | 1.62(2) |
| Z3 x Z2 per carrier, both charges | 5.64 (5.56 to 5.72) | 0 | 1.02(1) | 1.07(1) | 1.09(0) | 1.10(0) | 1.10(0) |
| Z3 x Z2 per plaquette, both charges | 5.25 (5.24 to 5.26) | 0 | 1.00(0) | 0.94(0) | 0.94(0) | 0.95(0) | 0.94(0) |

s = 0 is EXACT (u conj(u) = 1). Z2 per carrier, configuration means of the mean free path 67.5, 60.5, 57.3, 64.1,
53.5 (configurations 3 and 4 carry the leftover walls; the three clean ones give 61.7).

Comparison with the declared arrangements (same readout, same densities per carrier):
- Z2 per carrier (deconfined, dilute short loops): mean free path 60 against 123 for independent random links (H2);
  the pair curve is the H3 pattern (free at s = 0, about twice the single rate for s >= 2). The Gibbs ensemble at this
  density is a gas of small closed loops like H2, with larger loops than single-link flips (mean cluster 5.6
  plaquettes against 4), which halves the mean free path.
- Z3 per carrier (confined, percolating flux network): mean free path 5.8 against 12 (H2) and 5.5 (straight lines,
  H3b). Pair over single 0.98 at s = 1, rising to 1.13 for s >= 4: the pair is lost at about the single rate at every
  separation >= 1; not twice (H3), not below (H3b at 0.61 to 0.80), no growth with s beyond s = 4.
- Z3 per plaquette (deep confined): mean free path 5.2; pair over single 0.93 to 1.00.
- Z2 per plaquette (near-critical, confined, 40 per cent of the flux percolating): mean free path 9.4; pair over single
  rises from 0.87 at s = 1 to 1.62 at s = 8 and 16.
- Observation (ARGUED): both Z3 points give rates 0.17 to 0.19 per tick although their flux densities differ by a
  factor of three; a fully scrambled packet leaves the window at about this rate, so these mean free paths are at the
  resolution of the readout (packet width 5, window 2.5 widths) rather than set by the flux density.

## Part 4. The energy of separating a pair

V(R) = ln W(R, T-1)/W(R, T) at T = 8 (and 12 as a check), on the draws, five configurations (MEASURED). V is the decay
per unit length along T of a static loop in a three-dimensional static field (in units of the inverse cell; reading it
as an energy in the tick unit of CF-1 is ARGUED and not fixed here).
- Z3 per carrier (confined): V(R) - V(1) = 0.054(2), 0.094(3), 0.127(4), 0.156(7), 0.185(12), 0.243(27), 0.33(4) for
  R = 2, 3, 4, 5, 6, 8, 10; linear growth at large R with sigma = 0.0300(11): sqrt(sigma) = 0.173(3) per cell.
- Z3 per plaquette (confined, strong coupling): Wilson loops beyond 3 x 3 are below the noise; V(2) - V(1) about 0.4,
  sigma about 0.42(3), sqrt(sigma) about 0.65 per cell (from R <= 3 only).
- Z2 per carrier (deconfined): NO AREA LAW. V(R) - V(1) = 0.0021(1) at R = 2 and saturates at 0.0024 to 0.0029 for
  R = 4 to 12 (T = 8 and T = 12 agree within 2e-4). Separating the pair to any distance costs at most about 0.003 per
  unit length; sigma < 9e-5 (2 errors), sqrt(sigma) < 0.009 per cell.
- Z2 per plaquette (confined, near critical): V(R) - V(1) = 0.024(1), 0.053(2), 0.095(7), 0.129(12) for R = 2, 4, 8,
  12 (T = 12: 0.156(16) at R = 12); sigma = 0.0112(6), sqrt(sigma) = 0.106(3) per cell.

## Summary

- Normalisation "per carrier" (the census definition): Z3 sits at kappa* = 1.0797, on the confined side, 0.002 to
  0.006 below its first-order transition (the census density, f = 0.0893, lies on the confined branch close to its end:
  at the transition f drops from about 0.08 to 0.035); area law, sqrt(sigma) = 0.173(3) per cell; flux
  percolates (84 per cent in one wrapping cluster). Z2 sits at kappa* = 0.7982, deconfined; perimeter law, sigma <
  9e-5; flux in short closed loops, none wrapping.
- Normalisation "per plaquette": Z3 at 0.9305, deep confined, sqrt(sigma) about 0.65; Z2 at 0.7540, confined but
  near-critical, sqrt(sigma) = 0.106(3); both percolate.
- Walk: single mean free paths 5.8 (Z3) and 60 (Z2) per carrier; pair loss rate about equal to the single rate at every
  s >= 1 for Z3 (0.98 to 1.13), about twice for Z2 (1.4 to 2.3). The Gibbs ensemble does not produce a pair that stays
  coherent at small separation and decoheres with growing separation: for Z3 the confinement shows up in the Wilson
  loops (static), not in the loss rate of the moving rigid pair.

Files: scripts `repair-law/work/SIM/cf1/gauge/gauge_mc.py`, `gauge_selftest.py`, `gauge_scan.py`, `gauge_draw.py`,
`gauge_post.py`, `gauge_walk.py`, `gauge_analyze.py`; per-run outputs `gauge/out/{validate,refine,scan,kstar,draw}/`,
configurations `gauge/configs/` (draws and their Landau-gauge copies); results `cf1/runs/H4_selftest.json`,
`H4_scan.json`, `H4_kstar.json`, `H4_draw.json`, `H4_wilson_draws.json`, `H4_walk.json` (and the three earlier walk
passes named in Part 3). No jobs left running.
