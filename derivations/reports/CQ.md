# CQ report: run queue A to G for the executable CF-1

Brief: `repair-law/work/SIM/cf1/QUEUE_BRIEF.md`. Engine: `work/SIM/cf1/cf1_lib.py` (alternating order, mass option M1, kind Y).
Scripts in `work/SIM/cf1/queue/`, outputs in `work/SIM/cf1/runs/`. Units: cells and ticks, phases in radians per tick.
Labels: EXACT (closed form or exact arithmetic / dense diagonalisation to rounding), MEASURED (executed tick, residual
given), ARGUED. Sections are appended in the order the runs finished.

Complex link phases: `queue/cq_common.py` (`EngineC`) transports forward hops x -> x + e_i with conj(z(x)) and backward
hops with z(x). It equals `Routing.shift` (seam form) to 4e-17 for random phases, U(1) gauge covariance 6e-17, and it is
identical (difference 0.0) to the coordinator's updated `Engine.shift_fast` / `shift_inverse` / `step_inverse`.

Sublattices: a quantum moves by (+-1, +-1, +-1) per tick, so (x1 - x2) mod 2 and (x2 - x3) mod 2 are conserved and an even
periodic lattice splits into four invariant sublattices. Each section says which ones the preparation fills.

## Run B: uniform field through link phases (finished 2026-11-10 ~19:50 local)

File `runs/B_landau.json` (script `queue/b_landau.py`, post-analysis `queue/b_post.py` adds `post_levels_by_order`,
`post_orbit_classical_ensemble`, `sublattices`). Lattice 128 x 128 x 2; links of axis 2 carry exp(i B x1),
B = 2 pi k / 128, k = 1, 2, 4 (0.049087, 0.098175, 0.196350). All preparations uniform along axis 3 (p3 = 0).

**Checks.** EXACT: in the Landau gauge p2 is conserved; the two-tick operator in each p2 sector is a dense 512 x 512 matrix,
equal to the executed engine to 2e-15 to 4e-15 (relative) for all six (k, theta). MEASURED: the executed return amplitude
(4096 two-tick samples) equals the reconstruction from the exact block spectrum and weights to 1.1e-13 to 2.6e-13;
executed line positions equal the exact levels to about 1e-9.

**(i) Spectral lines.** Preparation: one cell column (64, 64), blank record, spin up and spin down (identical line sets
and weights; fills the two sublattices with (x1 - x2) mod 2 = 0). At k = 1 every level n >= 1 of the exact block
spectrum carries weight 1/16 of the preparation (both signs of the phase together) and n = 0 carries 1/32.
Levels by order (main multiplicity group), against sqrt(theta^2 + 2 n B) (EXACT lattice numbers, executed lines agree):

| k | theta | n=0 | n=1 | n=2 | n=3 | n=4 | n=5 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0 | 0 (zero mode, spread 1.7e-9) | 0.31042 (0.31333, -0.93%) | 0.43476 (0.44311, -1.89%) | 0.52666 (0.54270, -2.96%) | 0.60058 (0.62666, -4.16%) | 0.66178 (0.70062, -5.54%) |
| 1 | 0.087847 | 0.0878470000 (exact) | 0.32223 (-0.98%) | 0.44299 (-1.94%) | 0.53326 (-3.00%) | 0.60619 (-4.20%) | 0.66671 (-5.58%) |
| 2 | 0 | 0, spread 6e-5 | 0.43367 (0.44311, -2.13%) | 0.59821 (-4.54%) | 0.70768 (-7.79%) | 0.78540 (-11.4%) | 0.86311 (-12.9%) |
| 2 | 0.087847 | 0.087847 | 0.44192 (-2.17%) | 0.60384 (-4.57%) | 0.71218 (-7.81%) | 0.78925 (-11.4%) | 0.86641 (-12.9%) |
| 4 | 0 | 0, satellites to 0.0092 | 0.58905 = 3B, band 0.562-0.631 (-6.0%) | 0.78540 = 4B (-11.4%) | 0.98175 = 5B (-9.6%) | none | none |
| 4 | 0.087847 | 0.0878-0.0883 | 0.59479, band 0.568-0.636 (-6.0%) | 0.78925 (-11.4%) | 0.98432 (-9.6%) | none | none |

Readings (MEASURED/EXACT numbers, ARGUED interpretation):
- The n = 0 line is present and sits exactly at theta (k = 1: 0.0878470000; theta = 0: phase 0) for both spin
  preparations. Its spread grows with the field: 1.7e-9 (k = 1), 6e-5 (k = 2), 9e-3 (k = 4).
- At k = 1 the lines are sharp (n = 1 to 3: spreads 4e-8, 7e-7, 8e-6) and lie below the relativistic levels by a relative
  amount close to -0.1 E^2 (theta = 0, n = 1, 2, 3: -0.096, -0.100, -0.107 times E^2, the coefficient growing slowly with
  n). The lattice levels are compressed: the dispersion of the walk itself bends below the cone (run A).
- The two-tick spectrum is symmetric about E = pi/4 per tick (levels mirror under E -> pi/2 - E), so the Landau fan folds
  at pi/4. At k = 2 level 4 sits at pi/4 exactly; at k = 4 the levels are a ladder at 3B, 4B, 5B (0.58905, 0.78540,
  0.98175) with broad satellite bands of width about 0.07, and no level near the relativistic n = 4, 5. This is the
  strong-field regime of the program (magnetic length 2.26 cells at k = 4): it does not keep the relativistic Landau fan.

**(ii) Packet at p0 (orbit).** Gaussian, amplitude width w = sqrt(2/B) (density width = magnetic length), coin
positive_coin((p0,0,0), theta), projected on the eigenstates with phase >= 0 (keeps 0.4999998 to 0.5000000 of the norm),
600 ticks; fills all four sublattices. p0 = 0.3 is the requested row; 0.6 and 0.9 are added. Two references: the single
classical circle (radius p0/B, half period pi E/B) and a classical relativistic ensemble drawn from the packet's Wigner
function (ARGUED; 40000 members, seed 20261110), because a relativistic packet's mean position does not follow one circle
(period depends on |p|). Half the first maximum distance from the start, and its time:

| k | theta | p0 | executed | ensemble | single circle | rms(executed - ensemble), first period |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0 | 0.3 | 5.74 at t=30 | 5.11 at 20 | 6.11 at 19.2 | 2.8 |
| 1 | 0 | 0.6 | 9.36 at 42 | 11.33 at 38 | 12.22 at 38.4 | 6.8 |
| 1 | 0 | 0.9 | 8.42 at 42 | 17.69 at 56 | 18.33 at 57.6 | 14.2 |
| 2 | 0 | 0.3 | 1.92 at 8 | 2.45 at 12 | 3.06 at 9.6 | 1.6 |
| 2 | 0 | 0.6 | 3.73 at 20 | 5.36 at 18 | 6.11 at 19.2 | 4.0 |
| 4 | 0 | 0.3 | 1.06 at 6 | 1.18 at 6 | 1.53 at 4.8 | 0.4 |
| 4 | 0 | 0.6 | 1.05 at 6 | 2.55 at 10 | 3.06 at 9.6 | 3.1 |

theta = 0.087847 rows agree with theta = 0 to a few percent (file). Dominant oscillation frequency of the mean position
(MEASURED) at k = 1: p0 = 0.3: 0.1241 per tick (period 50.6 against 2 pi E/B = 38.4), equal to the lattice spacing
E_2 - E_1 = 0.1243, because the packet sits on levels 0 to 3 (weights 0.13, 0.37, 0.35, 0.13); p0 = 0.6: 0.0801
(period 78.5 against 76.8, +2.2%). At k = 2 (p0 >= 0.6) and k = 4 the strongest component is a slow drift of the centre
(period ~ 560 to 590 ticks, the window length), not a cyclotron line.

Readings: at p0 = 0.3 the packet is in the quantum regime (p0^2/2B = 0.92 at k = 1), and the executed period is the lattice
level spacing, 32% longer than 2 pi E/B. The cleanest semiclassical row, k = 1, p0 = 0.6, gives a period within 2.2% of
2 pi E/B but a first-orbit size 17% below the relativistic ensemble. At p0 = 0.9 the orbit stops at half the classical
size: the walk's constant-phase contours are not circles at that momentum (EXACT symbol: phase 0.900 along an axis,
0.821 at 22.5 degrees, 0.742 along the diagonal of the plane). Contradiction with "an interaction with a background
field keeps the relativistic behaviour": it holds at weak field and low level (k = 1, n <= 3: within 3%, deviations
growing as E^2); it fails at strong field (k = 4: ladder at multiples of B, broad bands) and for orbits at |p| >= 0.6
(orbit size 17 to 55% short of the relativistic ensemble). Nothing was tuned.

## Run G: Z2 flux line, charged and neutral pattern (finished 2026-11-10)

File `runs/G_aharonov_bohm.json` (script `queue/g_ab.py`). Lattice 96 x 96 x 2. Flux line: x-links from (47, y) to
(48, y) carry -1 for y >= 48, so the plaquette at (47.5, 47.5) has holonomy -1; on the torus its partner sits at
(47.5, 95.5), 48 cells away across the direction of motion. Packet: Gaussian, amplitude widths 8 x 8, centre 30 cells
before the line at impact parameter 0, uniform along axis 3, coin positive_coin((p0,0,0), theta); fills all four
sublattices. 56 ticks; probability in 10-degree bins of the scattering angle, radii 6 to 46 around the line.
Reference: scalar Aharonov-Bohm cross-section for alpha = 1/2, d sigma/d phi = 1/(2 pi k sin^2(phi/2)), times the
incident fluence F (free run, column density at the line's y when the centre crosses) and <1/k> over the packet (ARGUED:
continuum, scalar, no spinor).

- EXACT: a random Z2 gauge transformation of all links leaves the executed density unchanged (difference 0.0).
- Null result for the neutral pattern: it sees z = 1 on every link, so its tick is the free tick (EXACT by the program's
  rule). MEASURED background: probability at |phi| >= 90 degrees is 2.3e-4 (p0 = 0.5) and 1.6e-4 (p0 = 0.8), the free
  packet's own spreading; charged pattern at |phi| >= 90: 0.091 and 0.087.
- Charged, p0 = 0.5, theta = 0 (MEASURED, charged minus neutral): bins 60 to 150 degrees sum 0.1086 against AB 0.1108
  (-2.0%); per bin ratios 0.69 to 1.17. Backward bins are above AB: 150-160 1.29, 160-170 1.71, 170-180 2.29 times AB.
  theta = 0.087847: same to 1% (60-150: 0.1095 against 0.1114).
- Charged, p0 = 0.8: 60 to 150 degrees 0.0577 against 0.0799 (-28%), with peaks in the bins 80-100 and 170-180
  (8.5 times AB in 170-180) and dips between: the scattered wave is concentrated toward the lattice axes (ARGUED: the
  symbol at |p| = 0.8 is 0.80 along an axis and lower off axis, run A). theta = 0.087847 agrees to 1%.
- Left/right symmetry (AB at alpha = 1/2 is symmetric): asymmetry of the charged probability at |phi| >= 60 below 1e-3.
- Forward bins (|phi| < 60) hold the unscattered packet and its interference with the scattered wave; they are listed but
  not compared.

Reading: at p0 = 0.5 the program reproduces the half-flux AB scattering of a charged pattern within 2% over 60 to 150
degrees and gives exactly nothing for the neutral pattern. Deviation: backscattering above the scalar AB curve (factor 2.3
in the last bin at p0 = 0.5), and at p0 = 0.8 an axis-locked angular pattern. The continuum Dirac AB amplitude at
alpha = 1/2 depends on the boundary condition at the line and was not computed; the backward excess is reported, not
explained.

## Run C: mass barrier on a line (finished 2026-11-10)

File `runs/C_barrier.json` (script `queue/ce_line.py C`). Line of 512 cells (shape (512,1,1); one sublattice),
background theta0 = 0.087847, slab of 1, 4, 16 cells at theta1 = 0.171237.
- EXACT lattice stationary scattering: on the line the tick splits into two copies of a two-state walk; transfer matrix
  T_x = [[e^{iE}/c, s/c], [s/c, e^{-iE}/c]] (c = cos theta(x), s = +-sin theta(x)). Unitarity |T + R - 1| <= 4e-15; both
  copies give the same T (difference 0). p from 0.05 to 0.6 in steps of 0.01.
- MEASURED: positive-branch packets (width 24 cells) for p0 = 0.05 to 0.6. Probability on the far half equals the packet
  average of the exact T to 1e-6 or better for p0 >= 0.15 (n = 16: 2e-6; worst 1.1e-4 at p0 = 0.15, n = 1, where 8e-4 is
  still near the slab). At p0 = 0.05 and 0.1 the packet does not separate from the slab on 512 cells (0.29 and 0.04 still
  within 30 cells at the readout), so those packet rows do not measure T; the stationary rows do.
- Against the continuum Dirac equation with a mass step of width n cells (relativistic expectation, same p):

| slab | p = 0.05 T lattice (continuum) | p = 0.2 | p = 0.3 | p = 0.6 | max abs T difference over p | max rel. T difference |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.97192 (0.97219) | 0.99165 (0.99182) | 0.99240 (0.99267) | 0.99284 (0.99370) | 8.6e-4 | 8.7e-4 |
| 4 | 0.66285 (0.66535) | 0.89068 (0.89269) | 0.92110 (0.92363) | 0.98779 (0.98901) | 2.7e-3 | 3.7e-3 |
| 16 | 0.03129 (0.03199) | 0.76289 (0.76482) | 0.92053 (0.92390) | 0.99984 (0.99971) | 4.5e-3 | 2.2e-2 |

  The 16-cell slab shows the Fabry-Perot transmission maxima of the continuum at the same momenta (T = 0.99792 against
  0.99832 at p = 0.25; 0.99484 against 0.99447 at p = 0.40). The lattice reflects slightly more than the continuum in
  every row (R = 0.00716 against 0.00630 at p = 0.6, n = 1, the largest relative excess, 14%, on a reflection of 0.7%).
Reading: the mass barrier behaves as a relativistic mass step to 3e-3 absolute (n <= 4) and 4.5e-3 (n = 16) in T, with the
slab width read as n cells. No contradiction with the relativistic expectation at these momenta.

## Run M: mass option M3, the public walk as mass step (finished 2026-11-10)

File `runs/M_m3_internal_sectors.json` (script `queue/m_m3.py`). The box copy of the repository lacks
`model/coherent_seam_repair`, so `queue/public_copy/coherent_seam_program.py` is a verbatim copy of
`reverse-engineering-reality/model/coherent_seam_repair/program.py` (last commit 4af32419); it is used only to check the
vectorised W and R.

Readings executed (the definition leaves them open): (a) a hop carries the whole internal register (port, record, address)
and the spin unchanged to the neighbouring carrier; (b) S_i = P+ T + P- T*, P+- = (1 +- R (x) sigma_i)/2, R = the public
address reflection 2AA* - I acting on the address register only; (c) tick = W on every cell, then the shifts in the
alternating order (two-tick operator conjugate by W to the engine's shifts-then-mass order, same phases).

**Part 1, one carrier (float64; EXACT structure was certified rationally by KD for 9/10, 14/15, 1, 5/6).**
- Vectorised W and R equal `Observer.step` / `Observer.reflect` to 2.2e-15 / 1.3e-15 on an integer test vector;
  W orthogonal to 2e-15; R W R W = 1 to 5e-15. Spectrum of W: +1 x 38, -1 x 1356, 46 other eigenvalues whose phases are
  exactly the five angles 0.304708437, 0.367208021, 0.451026812, 0.496198260, 0.585685543 (46 = 2 x (1+3+3+5+5+3+3)).
- Embedded rest states e = x (x) |record> (x) uniform address, x an adjacency eigenvector (mu), all eight (mu, record):

| sector (mu, record) | multiplicity | lambda = <e, W e> | mass angle | span dim | invariance residual W, R | phases vs +-omega |
| --- | --- | --- | --- | --- | --- | --- |
| mu=5, blank | 1 | 1 | 0 (W e = e) | 1 | 3e-15, 3e-15 | - |
| mu=5, recorded | 1 | 5/6 | 0.585685543 | 2 | 6e-15, 2e-15 | 1e-16 |
| mu=+sqrt5, blank | 3 | 0.953934466 (11/12 + sqrt5/60) | 0.304708437 | 6 | 1.3e-14, 1.0e-14 | 7e-15 |
| mu=+sqrt5, recorded | 3 | 0.879398867 (11/12 - sqrt5/60) | 0.496198260 | 6 | 1.2e-14, 1.0e-14 | 3e-15 |
| mu=-1, blank | 5 | 9/10 | 0.451026812 | 10 | 2.6e-14, 1.2e-14 | 1.4e-14 |
| mu=-1, recorded | 5 | 14/15 | 0.367208021 | 10 | 2.5e-14, 1.8e-14 | 1.6e-14 |
| mu=-sqrt5, blank | 3 | 0.879398867 | 0.496198260 | 6 | 1.4e-14, 1.0e-14 | 1e-14 |
| mu=-sqrt5, recorded | 3 | 0.953934466 | 0.304708437 | 6 | 1.9e-14, 1.3e-14 | 9e-15 |

  On every span R e = e, R has eigenvalues +1 and -1 in equal numbers (a reflection on each plane) and R W R = W^-1.
  All six claimed angles confirmed (MEASURED to 1e-14; the claim is EXACT per KD). Precision on the table's wording: the
  "slow triplet" is (mu = +sqrt5, blank) and (mu = -sqrt5, recorded); the "fast triplet" is the other two pairings, so
  "either record" holds for the pair of triplets jointly, not for one triplet.

**Part 2, executed lattice 8^3 (psi[cell, 1440, spin], 1.47e6 amplitudes).** Plane waves at n = (0,0,0), (1,0,0),
(2,0,0), (1,1,0), (1,1,1), (2,1,0) (p = 2 pi n/8) on each of the eight sector states, spin up and down, plus a random
vector of each eigenspace at (1,1,0): 104 runs. Largest weight outside span{e, f} (x) spin over 96 ticks: 2.0e-14 (no
sector leaves its plane). Phase estimation equals the alternating-order Dirac symbol with theta = arccos(lambda) to
4.3e-11 in all runs (the one larger number, 7e-8, is the symbol evaluated at theta = 3e-8 from lambda = 1 - 4e-16 against
the measured 0). On axis it equals arccos(cos theta cos p): e.g. at p = pi/4: 0.7853981634 (uniform, blank),
0.8304636713 (slow triplet), 0.8500223839 (quintet recorded), 0.8809792367 (quintet blank), 0.8997204765 (fast
triplet), 0.9406590807 (uniform, recorded); at p = pi/2 every sector gives pi/2.
No failing sector and no failing momentum. The lattice momenta of 8^3 are at the lattice scale (|p| >= 0.785); there the
symbol gives the same phase at (1,0,0), (1,1,0), (1,1,1) and (2,1,0) for every sector (e.g. pi/4 for the massless
sector at |p| = 0.785 and 1.360): the executed tick reproduces this symbol property; it is far from sqrt(p^2 + theta^2)
at these momenta (run A covers |p| <= 0.6). Label: MEASURED (executed), with the Dirac structure ARGUED by KD and
confirmed here numerically.

## Run E: double-slab resonance on a line (finished 2026-11-10)

File `runs/E_resonance.json` (scripts `queue/ce_line.py E`, addendum `queue/e_survival.py`). Line of 512 cells (one
sublattice); background 0.087847; slabs of 4 cells at 0.171237 at cells 246-249 and 262-265, well of 12 cells (250-261).
- EXACT lattice stationary scattering (transfer matrix as in run C, p = 0.02 to 0.70 in steps of 0.0025) and Wigner delay
  tau = d arg t / dE relative to free propagation; continuum Dirac reference with the same geometry.
- Delay peaks (resonances):

| p | E lattice (continuum) | delay lattice (continuum), ticks | T at peak lattice (continuum) | 2/tau lattice (continuum) |
| --- | --- | --- | --- | --- |
| 0.0925 | 0.127481 (0.127567) | 16.700 (16.509) | 0.8474 (0.8492) | 0.1198 (0.1211) |
| 0.295 | 0.307436 (0.307802) | 3.550 (3.416) | 0.9945 (0.9943) | 0.563 (0.585) |
| 0.485 | 0.492267 (0.492892) | 1.453 (1.345) | 0.9954 (0.9955) | 1.38 (1.49) |
| 0.6625 | 0.667427 (0.668299) | 0.476 (0.415) | 0.9958 (0.9962) | 4.2 (4.8) |

  The lowest one (E = 0.1275 < theta1, tunnelling through both slabs) is the only sharp feature; its delay agrees with
  the continuum to 1.2% and its position to 7e-4 in E. The others are broad above-barrier maxima.
- MEASURED packets (width 24 cells, p0 = 0.05 to 0.6): transmitted probability equals the packet average of the exact T
  to 1e-5 or better for p0 >= 0.15 (p0 = 0.1: 1.1e-3; p0 = 0.05 not separated on 512 cells). Extra dwell in the well
  relative to the free packet: 7.1 ticks at p0 = 0.1 (packet-averaged lattice delay 13.5), 3.8 at 0.15 (4.6), and below
  1.5 ticks in absolute value for p0 >= 0.2 (negative at 0.2 and 0.4, where the delay is negative too).
- Survival (addendum): a state prepared inside the well (uniform or lowest sine over the 12 cells, positive-branch coin at
  rest) keeps 0.45 (0.35) after 10 ticks, 0.084 (0.076) after 40, 2.9e-4 (2.5e-4) after 120; fitted decay rate over ticks
  20-120: 0.0721 (0.0729) per tick, against 2/tau = 0.120 of the lowest delay peak (Breit-Wigner reading, ARGUED). The
  survival is not one exponential (the prepared state is not the resonance alone); the late packet decay rates (0.018 to
  0.21) mix the slow tails of the packets and are listed, not interpreted.
Reading: resonance positions, delays and transmissions follow the relativistic double-barrier problem to 1 to 4% for the
sharp tunnelling resonance and within 15% for the broad ones (delays below 4 ticks); no contradiction.

## Run F: momentum readout by phase estimation of the translation (finished 2026-11-10)

File `runs/F_momentum_readout.json` (script `queue/f_momentum.py`). 32^3 lattice; Gaussian packets (amplitude width 3,
centre (16,16,16), fills all four sublattices), p0 = (0.3, 0.2, 0.1) (off the 32-grid) and (2 pi 3/32, 0, 0) = (0.589, 0,
0), theta = 0 and 0.087847. Apparatus per axis: clock of M = 8, 16, 32 states prepared uniform, controlled T^-c, inverse
QFT, clock read; all M branches kept (probabilities sum to 1 to rounding).
- EXACT checks: executed one-axis readouts equal the marginals of the joint three-register distribution computed from the
  momentum amplitudes with the Fejer kernel to 2.7e-15; readouts before and after 32 ticks agree to 2.8e-15 (the
  translation commutes with the tick).
- MEASURED distributions (means and spreads of p = 2 pi j / M folded to (-pi, pi]; packet: means p0, sd 0.2357 per axis):

| packet | M = 8 mean (sd) | M = 16 | M = 32 |
| --- | --- | --- | --- |
| (0.3, 0.2, 0.1) | 0.289, 0.186, 0.098 (0.67, 0.63, 0.59) | 0.297, 0.200, 0.103 (0.476) | 0.300, 0.200, 0.100 (0.2357) |
| (0.589, 0, 0) | 0.603, 0.021, 0.021 (0.63, 0.57, 0.57) | 0.577, 0.006, 0.006 (0.48) | 0.589, 0.000, 0.000 (0.2357) |

  With M = 32 = L the readout is the packet's momentum distribution exactly; with M = 8 and 16 the outcome distribution is
  the packet distribution smeared by the Fejer kernel of width 2 pi / M, with mean shifts up to 0.014 (M = 8) and spreads
  set by the register (0.48 to 0.67). theta does not change any readout.
Reading: the translation register is a complete momentum instrument; its resolution is the clock size, its distribution
is independent of the rest angle and of the evolution time. No relativistic expectation is involved beyond momentum
conservation, which holds to rounding.

## Run A: free dispersion, shell, and the cones of the two-tick symbol (finished 2026-11-10)

File `runs/A_dispersion.json` (script `queue/a_dispersion.py` modes disp, shell, merge; `queue/a_cones.py`; parts
`runs/A_part_disp.json`, `A_part_shell.json`, `A_part_cones.json`). Plane waves and Gaussians fill all four sublattices.

**Dispersion (64^3, executed).** Lattice momenta with |p| <= 0.6 along 100, 110, 111 and twenty random directions (seed
20261110; on 64^3 the lattice momentum nearest a random direction deviates from it, angles listed per row), theta = 0,
0.087847, 0.157935; 117 momenta per theta; phase estimation from plane waves with blank record, spin up and down.
MEASURED: estimated phases equal the alternating-order symbol to 5e-11 (worst over all 351 momenta). Relative error
against sqrt(|p|^2 + theta^2) (EXACT symbol curves along each direction, |p| = 0.02 to 0.6, in the file):

| direction | norm of p = 0.1 | 0.3 | 0.6 |
| --- | --- | --- | --- |
| 100 (theta = 0) | 0 (exact: E = p on the axis) | 0 | 0 |
| 110 (theta = 0) | -0.00167 | -0.0155 | -0.0679 |
| 111 (theta = 0) | -0.00223 | -0.0204 | -0.0852 |
| all 23 directions, theta = 0 | 0 to -0.00223 | 0 to -0.0204 | 0 to -0.0852 |
| all directions, theta = 0.087847 | -0.0007 to -0.0020 | | -0.0013 to -0.0845 |
| all directions, theta = 0.157935 | -0.0012 to -0.0018 | | -0.0040 to -0.0830 |

Executed lattice momenta binned by |p| (theta = 0): |p| <= 0.15: 0 to -0.0032; 0.15-0.3: to -0.0175; 0.3-0.45: to
-0.0344; 0.45-0.6: to -0.0741. The walk is never above the cone. Leading behaviour (ARGUED from the 110 and 111 curves at
small p): relative error = -(2/3) |p|^2 sum_{i<j} u_i^2 u_j^2 (u the unit direction): -1/6 p^2 along 110, -2/9 p^2 along
111, 0 on the axes; this is the size of the Landau-level compression of run B.

**Shell after 64 ticks (208^3, Gaussian at rest, blank spin-up coin).** Weight on the lattice faces at most 3e-9.

| theta | width | cubic ratio (isotropic 0.6) | mean radius 100 / 110 / 111 (cone 10 deg) | ratio 111/100 mean (peak) |
| --- | --- | --- | --- | --- |
| 0 | 3 | 0.6525 | 61.70 / 58.54 / 58.09 | 0.9416 (0.9384) |
| 0 | 6 | 0.6118 | 64.26 / 63.25 / 62.98 | 0.9801 (0.9738) |
| 0 | 12 | 0.6019 | 66.13 / 65.99 / 65.95 | 0.9971 (0.9920) |
| 0.087847 | 3 | 0.6591 | 59.48 / 55.25 / 54.51 | 0.9165 (0.8292) |
| 0.087847 | 6 | 0.6152 | 55.76 / 54.24 / 53.81 | 0.9651 (0.7865) |
| 0.087847 | 12 | 0.6029 | 45.94 / 45.66 / 45.59 | 0.9924 (0.9896) |
| 0.157935 | 3 | 0.6671 | 55.93 / 50.41 / 49.39 | 0.8831 (0.8139) |
| 0.157935 | 6 | 0.6179 | 46.63 / 44.89 / 44.40 | 0.9522 (0.9786) |
| 0.157935 | 12 | 0.6026 | 34.10 / 33.94 / 33.88 | 0.9938 (density peaks at the centre) |

The shell of a low-momentum preparation becomes isotropic as the width grows (cubic excess 0.0525, 0.0118, 0.0019 at
w = 3, 6, 12, close to the 1/w^2 scaling expected from the p^2 anisotropy); the massless shell moves at one cell per
tick (peak radii 50 to 60 depend on width through the profile, mean radii 59.5, 63.5, 66.0). MEASURED.

**Cones of the massless two-tick symbol (coordinator's addition, worker R7's count).** X_record commutes with every
alpha_i, so U2 = S_rev S_fwd splits into the arrow sectors s = +-1 ((|0> +- |1>)/sqrt2), each an SU(2) matrix; the phase
per tick vanishes where U2_s = 1. Search on the 96^3 grid plus Newton refinement of all local minima (no zero off the
grid was found): EXACT to rounding (residual 0 at every zero).
- Full zone: 32 zeros per sector, at p/pi in {0, 1}^3 (8 points) and at the 24 points with one component in {0, 1} and
  the other two in {1/2, 3/2}. Every zero is an isotropic Weyl cone: the linearisation A has singular values 1, 1, 1
  (velocity 1 in every direction), |det A| = 1.
- Chirality in sector +1: +1 at the eight corners {0, pi}^3 and at the eight points (1/2, {0,1}, 1/2) type with the
  zero component in axis 2 [classes (1/2, 0, 1/2)]; -1 at the classes (0, 1/2, 1/2) and (1/2, 1/2, 0). Sector -1: all
  signs reversed. Net chirality 0 in each sector.
- Per sublattice of the two-tick walk (two ticks move by components in {-2, 0, 2}, so x mod 2 per axis is conserved:
  eight sublattices, reduced zone p mod pi): four cones per sector, at p/pi = (0,0,0), (0,1/2,1/2), (1/2,0,1/2),
  (1/2,1/2,0) with chiralities +, -, +, - (sector +1) and -, +, -, + (sector -1), net zero: R7's count confirmed.
  Per sublattice of the one-tick walk (four body-centred sublattices, reciprocal vectors (pi,pi,0), (pi,0,pi), (0,pi,pi)):
  eight cone classes per sector, chiralities +, +, -, -, +, +, -, -, net zero.
- Populations: a low-momentum preparation (Gaussian of width w) sits on the p = 0 cone of both arrow sectors (blank
  record = equal superposition of the sectors); its weight at another cone p* is about exp(-w^2 |p*|^2) (w = 3:
  exp(-9 pi^2/2) ~ 5e-20 for the (0, pi/2, pi/2) cones; the corner cones such as (pi,0,0) are also reached only through
  that tail). A single-cell preparation has equal momentum weight at every p, so it populates all 32 zeros of both
  sectors equally; it sits on one sublattice, where the 32 zeros fold to 4 cones per sector (two-tick sublattice) or 8
  (one-tick sublattice).

### Run E, addition: twelve-cell slabs (theory session's change; half-step frame)

Key `narrow_12_cell_slabs` in `runs/E_resonance.json` (script `queue/e2_narrow.py`). Line of 2048 cells, slabs of 12
cells at 0.171237 at [1006,1018) and [1030,1042), well [1018,1030), background 0.087847; tick `Engine.step_half`
(half-step frame). R6's targets (pole 0.137204, width 0.008995) were not used in the analysis; the readout window is
the gap (theta0, theta1).
- MEASURED clock spectrum, blank record spin up, lowest sine over the well, return amplitude for 1500 ticks, matrix pencil
  (rank 12) on t >= 60: line at |phase| 0.1372040 with width (twice the amplitude decay rate) 0.0089955. Positive-branch
  coin at rest: 0.1372039, 0.0089944 (weight of the line in the return amplitude 3e-4 instead of 0.05).
- MEASURED survival: decay rate of the probability in the well 0.0089982 per tick and in the whole structure 0.0089985
  (fit over ticks 150 to 900); 100-tick local rates 0.0085 to 0.0093 up to tick 1100, 0.0095 and 0.0103 after (escaped
  waves start to matter). P(structure) after 400 ticks: in the file.
- EXACT lattice stationary scattering (frame independent): Wigner delay peak 195.15 ticks at E = 0.137181 (T = 0.989);
  2/tau = 0.010248 (14% above the clock width; the delay FWHM is 0.007975). Continuum Dirac with the same geometry: delay
  peak at E = 0.137286, 191.29 ticks, 2/tau = 0.010455.
Reading: centre 0.137204 and width 0.008995 from the clock and 0.008998 from the survival agree with R6's pole to 1e-6
and 3e-6. The relativistic continuum puts the resonance 1.0e-4 higher in E (relative 7.6e-4) with a 2% shorter delay.
Frames: the four-cell-slab rows above used the mass-last frame (`Engine.step`); stationary T, R and delays are frame
independent.

### Run A, addition: points at two-tick phase pi; frames

- Same census for U2_s = -1 (two-tick phase pi, pi/2 per tick), stored under `phase_pi_points` in
  `runs/A_part_cones.json` and in `runs/A_dispersion.json`: 32 points per arrow sector (64 in all), every one an isotropic
  Weyl node (singular values 1, 1, 1), at p/pi with exactly one component in {1/2, 3/2} and two in {0, 1} (24 points)
  or all three in {1/2, 3/2} (8 points); per two-tick sublattice (p mod pi) the classes (0,0,1/2), (0,1/2,0), (1/2,0,0), (1/2,1/2,1/2) with chiralities +, -, +, -
  in sector +1 (reversed in sector -1), eight full-zone points per class, net chirality zero.
- So the census confirms the theory session's count: 32 rest points of the two-tick product at zero phase and 32 at
  phase pi in each arrow sector (EXACT to rounding; no zero off the 96^3 grid). A one-cell preparation (or a one-cell
  cavity) sits on one sublattice and has equal weight on all cones of that sublattice: it couples them.
- Frames: runs A (dispersion phases, shells), B, C, G and the four-cell rows of E used the mass-last frame
  (`Engine.step`). Phases per tick, transmissions and the shell densities of preparations defined in that frame are
  what is reported; phases are frame independent, densities of a given preparation differ between frames only by the
  coin rotation M^(1/2) applied to the preparation.

### Run F, rerun in the half-step frame

`runs/F_momentum_readout.json` was rewritten with the 32 ticks of the before/after check executed by `Engine.step_half`
(field `frame`). All distributions are unchanged; before/after agreement 2.4e-15 at worst; executed against joint
marginals 2.1e-15.

## Run D: bound states in a cavity of the flux gas (main file finished 2026-11-10; additions below)

File `runs/D_bound.json` (script `queue/d_bound.py`). Background theta0 = 0.171237, cavity at theta = 0. Frame: the
two-tick operators of the mass-last and half-step frames are conjugate by M^(1/2), so eigenphases and cell weights are
the same in both (EXACT).

**Line of 256 cells (one sublattice), cavity of n cells; dense one-tick matrix (unitarity 1e-15), Schur form.** Exactly
one bound level below theta0 for every n (multiplicity 4: two copies times +-E; staggered copies at pi - |E|); no odd
state (pi/n > theta0 for n <= 8). EXACT lattice numbers against the continuum Dirac well of width n:

| n | bound phase | weight in the cavity | continuum (width n) | relative difference |
| --- | --- | --- | --- | --- |
| 1 | 0.16877453 | 0.028 | 0.16880313 | -1.7e-4 |
| 2 | 0.16222179 | 0.099 | 0.16229524 | -4.5e-4 |
| 3 | 0.15329662 | 0.187 | 0.15341802 | -7.9e-4 |
| 4 | 0.14356186 | 0.272 | 0.14371413 | -1.06e-3 |
| 5 | 0.13397695 | 0.348 | 0.13414313 | -1.24e-3 |
| 6 | 0.12500359 | 0.413 | 0.12517181 | -1.34e-3 |
| 7 | 0.11680832 | 0.467 | 0.11697156 | -1.40e-3 |
| 8 | 0.10940916 | 0.513 | 0.10956377 | -1.41e-3 |

These equal R6's exact lattice targets (0.168775, 0.162222, 0.153297, 0.143562, 0.133977, 0.125004, 0.116808,
0.109409) to all quoted digits. The width that would make the continuum formula reproduce the lattice is n + 0.006 to
n + 0.022 (diagnostic only).

**Cube, L^3 with L = 24 and 32, side s = 1 to 4; Lanczos on A = (U2 + U2^dagger)/2 (top 80 eigenvalues; residuals
<= 1.3e-11).** The lowest phases below theta0:

| s | L = 24 lowest phase | cavity weight | L = 32 lowest phase | cavity weight | volume fraction (24, 32) |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.171025908 | 0.0013 | 0.171147727 | 0.00056 | 7.2e-5, 3.1e-5 |
| 2 | 0.170913448 | 0.0021 | 0.171099988 | 0.00088 | 5.8e-4, 2.4e-4 |
| 3 | 0.170569437 | 0.0045 | 0.170953199 | 0.0019 | 2.0e-3, 8.2e-4 |
| 4 | 0.170342281 | 0.0060 | 0.170855644 | 0.0026 | 4.6e-3, 2.0e-3 |

The L = 24 values equal R6's targets (0.17102591, 0.17091345, 0.17056944, 0.17034228). The shift below theta0 falls
with the volume: for s = 4, 8.95e-4 at L = 24 and 3.81e-4 at L = 32, ratio 2.35 against (32/24)^3 = 2.37; the cavity
weight scales the same way. These are the zero-momentum states of the box pulled down by the cavity, not bound states
(MEASURED). Continuum reference (ARGUED, sphere of the cavity's volume): a bound s-state needs m R >= 1.1656; here
m R = 0.11 to 0.42, no bound state, in agreement. The Lanczos cluster multiplicities are not reliable (degenerate
clusters of up to 32 states; the top-80 window is filled before the cluster at theta0 closes); the complete counts come
from the dense addition below.

### Run D, addition: large cavities (theory session's R6 targets)

File `runs/D_part_big.json` (script `queue/d_big.py`). Lanczos on A restricted to one two-tick sublattice (blocks
r = (0,0,0) and (1,1,1), identical lowest phases to 1e-8), residuals <= 4e-12. MEASURED:

| L | side | lowest phase | theta0 - E | cavity weight (block 000) | volume fraction | continuum sphere, equal volume (ARGUED) |
| --- | --- | --- | --- | --- | --- | --- |
| 48 | 8 | 0.16993248 | 1.31e-3 | 0.0134 | 0.0046 | none (m R = 0.85 < 1.166) |
| 48 | 12 | 0.16340301 | 7.83e-3 | 0.118 | 0.0156 | 0.169188 (m R = 1.275) |
| 48 | 16 | 0.14616316 | 2.51e-2 | 0.345 | 0.0370 | 0.148537 (m R = 1.70) |
| 64 | 16 | 0.14859645 | 2.26e-2 | 0.409 | 0.0156 | 0.148537 |

R6's targets for side 16 (0.14616 on 48^3, 0.14860 on 64^3) are reproduced. Side 8 on 48^3 has the same volume fraction
as side 4 on 24^3 but twice the relative cavity weight (2.9 against 1.3 times the fraction) and a larger shift (1.31e-3
against 8.95e-4): it is still a box state pulled down, not separated from the volume scaling by these two sizes alone.
Side 12 holds 7.6 times its volume share: bound. Side 16 on 64^3 lies 6e-5 (4e-4 relative) above the continuum Dirac
sphere of the same volume; on 48^3 the periodic images (32 cells apart) push it 2.4e-3 lower. Threshold: between side 8
and 12, consistent with the continuum sphere threshold m R = 1.1656 at side 10.97 and with R6's "about 11". In three
dimensions the flux-gas hole binds only above that size; on the line it always binds (table above). No contradiction
with the relativistic expectation.

### Run D, addition: complete counts by dense diagonalisation (L = 16 and 24)

File `runs/D_part_dense.json` (script `queue/d_dense.py`). U2 built as a sparse matrix (equal to the executed engine to
2.2e-15), restricted to each of the eight two-tick sublattices x = r + 2Z^3 (leak out of a block exactly 0), A densely
diagonalised: the complete spectrum, EXACT to rounding.
- Uniform background: no state below theta0; 128 states of U2 sit exactly at |E| = theta0 (16 per two-tick block): the 32
  zero-phase points of each arrow sector (run A) pair into massive points under the mass step, four states each.
- Counts below theta0 (L = 16 and 24 equal): s = 1: 8; s = 2: 64; s = 3: 128; s = 4: 128. Lowest phase and multiplicity at
  L = 24: 0.1710259077 (8), 0.1709134484 (32), 0.1705694371 (8), 0.1703422811 (32), equal to the Lanczos values and to
  R6's targets. L = 16: 0.1705281123, 0.1701533227, 0.1690182228, 0.1682777196 (shifts 3.32 to 3.36 times those at L = 24,
  (24/16)^3 = 3.375): box states, not bound.
- A one-cell cavity at a cell of class r acts on two two-tick blocks: r (end of the two-tick step) and r + (1,1,1)
  (middle of the step), i.e. on one one-tick sublattice. It pulls 4 of the 16 threshold states of each of these two blocks
  down to one common phase (0.1710259077 at L = 24) and leaves the other six blocks exactly at theta0: it couples the
  cones of its sublattice into one level. Cubes of side >= 2 contain cells of every class and act on all blocks.
