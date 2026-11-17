> Working note of a worker that ended before its report was reviewed. Its statements are unreviewed; the lattice lanes of the viewer check what they take from it.

# HR: the lattice gauge-Higgs system of the source, specified for a Monte Carlo run

Worker HR, 2026-11-11. Rules: `RL/CAMPAIGN.md`. Labels: EXACT, MEASURED, ARGUED, IMPORTED, DECLARED.
Standing of a coefficient: derived (follows from GL's functional or UH's register by exact algebra, under the
construction named in the row), induced (one loop), declared (chosen, no law of the source fixes it).
Inputs: `reports/GL.md` (links, plaquette action, cell coupling), `reports/YC.md` (the toggle in GL's functional),
`reports/UH.md` and `work/UH/DEFINITION.md` (the unbounded class-3 register), `reports/R8.md` (toggle, register
charges), `reports/BF.md` (link vacuum, matching). No measured value enters this file.

Units: one cell and one tick; energies in units of E_cell.

## 1. Lattice and variables

| Object | Variable | Transformation under g_x in SU(2), chi_x real |
| --- | --- | --- |
| site x = (x0; x1, x2, x3) | x0 counts ticks (Euclidean time), x1 to x3 the cells of the cubic family | |
| link (x, mu), weak factor | V in SU(2) | V -> g_x V g_(x+mu)^dag |
| link (x, mu), hypercharge | angle a, phases exp(i 6Y a) | a -> a + chi_x - chi_(x+mu) |
| cell x | doublet Phi in C^2, hypercharge 6Y = 3 | Phi -> exp(3 i chi_x) g_x Phi |

- The full link of GL acts on the five-level code as `U = diag(exp(-2 i a) C, exp(3 i a) V)`, C in SU(3). The
  identification of the global form is (a, C, V) ~ (a + pi/3, omega C, -V). Colour links enter the doublet only
  through the hypercharge angle, so this file sets C = 1.
- The lattice is the isotropic four-direction lattice of YC: one tick per cell (DECLARED). Section 4.2 gives the
  form with two hop coefficients for a different clock.
- The doublet is the eigenvalue of the register's lowering operators (UH D1, D4): on a Higgs state
  `B_k |beta> = beta_k |beta>`, the mass step `exp(-i g_t V)` acts on the patterns of the cell as `exp(-i K_theta)`,
  `K_theta = sum_k (theta_k c_k^dag + conj(theta_k) c_k)`, `theta = g_t beta`, `K_theta^2 = |theta|^2`. The mass
  angle of every pattern is |theta|. The canonical field of section 3 is `Phi = (2/g) theta`.

## 2. Gauge term

GL's functional A1 (seam cost of a code state carried around a plaquette, averaged over the code):

    S_G = beta_5 sum_P [1 - Re tr_5 U_P / 5],   beta_5 = 10/g^2.

With C = 1:

    S_G = (2/g^2) sum_P [5 - 3 cos(2 a_P) - cos(3 a_P) tr V_P]
        = beta_G sum_P [1 - cos(3 a_P) tr V_P / 2] + (3 beta_G / 2) sum_P [1 - cos(2 a_P)],   beta_G = 4/g^2,

`V_P = V_(x,mu) V_(x+mu,nu) V_(x+nu,mu)^dag V_(x,nu)^dag`, `a_P = a_(x,mu) + a_(x+mu,nu) - a_(x+nu,mu) - a_(x,nu)`.
Weak factor alone (a = 0): the Wilson action `beta_G sum_P (1 - tr V_P / 2)`.

| Item | Value | Standing |
| --- | --- | --- |
| form of the weak term | Wilson plaquette | derived: EXACT trace of A1; the same function follows on the pattern carriers of YC (`beta_lat = 8/g^2`, dimensions 16 and 32), checked to 1.6e-15 (`checks.json`, T1). The continuous link register is DECLARED (GL: no law writes the port phases) |
| form of the hypercharge term | `3 cos 2 a_P` and the factor `cos 3 a_P` on the weak plaquette | derived from the 5-trace; the pattern carriers give the same second-order term (30/g^2) a_P^2 and a different function beyond (EXACT, T1) |
| g^2 | 0.77354 (1/alpha = 16.2453) | IMPORTED from GL B1 and DC's cut closure (premises P1 to P4 of DC) |
| beta_G | 5.1710 | derived from g^2 |
| hypercharge coupling | gY^2 = 3 g^2 / 5, sin^2 theta_W = 3/8 at the cell | derived (GL: equal Hessians in the twelve directions) |

## 3. Hop term of the doublet through the link

YC's Higgs plaquette `W = Lambda(U) exp(-i K_theta') Lambda(U)^dag exp(i K_theta)` on UH's register (UH S1, EXACT):

    S_hop = beta_lat sum_(x,mu) [1 - n(theta_x) . n(U theta_(x+mu))],   n(theta) = (cos|theta|, sin|theta| theta^),
    beta_lat = 8/g^2,   U theta = exp(3 i a) V theta.

n is a point of the unit four-sphere; the link acts on its last four components. At second order in theta:

    S_hop = (4/g^2) sum_(x,mu) |theta_x - U theta_(x+mu)|^2 = sum_(x,mu) |Phi_x - U Phi_(x+mu)|^2,   Phi = (2/g) theta,

which is UH's transport D5, `T_xy = Phi_x^dag U Phi_y + h.c.`, with coefficient one per link on the canonical field
and the on-site part `8 |Phi_x|^2`. In the register's eigenvalues the coefficient of
`beta_x^dag U beta_y + h.c.` is `4 g_t^2 / g^2`.

| Item | Value | Standing |
| --- | --- | --- |
| hop coefficient on theta | 4/g^2 = 5.1710 per link, all four directions | derived (YC F1, UH S1 to S3, EXACT traces) under the construction: one toggle direction with the lattice coefficient of the gauge plaquettes, register in Higgs states, isotropic lattice |
| hop coefficient on Phi | 1 | definition of the canonical field |
| Yukawa coupling | mass angle |theta| = (g/2) |Phi|, y = g/2 = 0.43976 on every leg | derived under the same construction (YC, UH S3); the leg amplitudes are open (R8: four are allowed, the sum rule sum N_c y^2 = 2 g^2 per family holds for every choice, UH S4) |
| toggle amplitude g_t | open | DECLARED; it drops out when the functional is the register's whole quadratic part |

## 4. On-site terms

### 4.1 Tree level of the functional

A covariantly constant amplitude costs nothing at every amplitude (UH S2, EXACT). The functional gives the doublet
no mass term and no quartic: `m0^2 = 0`, `lambda0 = 0` (derived).

### 4.2 The oscillator energy of the register (DECLARED)

UH's quadratic form `omega N_x - kappa_R sum_links T_xy` (frequency omega, register hop kappa_R on the three
frame seams) in Euclidean time with one step per tick, in the variable theta:

    Z_own,t = 1/(2 omega g_t^2),   Z_own,s = kappa_R / g_t^2,   M^2 = (omega/2 - 6 kappa_R) / g_t^2,
    S = sum_x [ (4/g^2 + Z_own,t) |D_0 theta|^2 + (4/g^2 + Z_own,s) sum_i |D_i theta|^2 + M^2 |theta|^2 ].

Canonical field `Phi = sqrt(4/g^2 + Z_own,t) theta`: speed squared `c^2 = (4/g^2 + Z_own,s)/(4/g^2 + Z_own,t)`,
`m0^2 = M^2/(4/g^2 + Z_own,t)`, Yukawa `y = (g/2) sqrt(s)` with `s = (4/g^2)/(4/g^2 + Z_own,t)` (UH S5).
The audit's memory has omega = 1 and kappa_R = 0: `c^2 = s`, `m0^2 = (1 - s) omega^2`, positive for every g_t.
A light doublet with unit speed and no functional needs `2 omega kappa_R = 1` and `omega^2 = 6`.

### 4.3 Terms induced at one loop (UH)

`V = m_ind^2 |Phi|^2 + lambda_ind |Phi|^4`, matching of zero-point sums at mu = E_cell (ARGUED; MSbar constants
IMPORTED there). Values with the source's couplings and y = g/2 on every leg:

| Term | Value | Sign | Standing |
| --- | --- | --- | --- |
| vector part of the mass term, Hamiltonian clock, `(3/2) A_V (3 g^2 + gY^2)` | 0.476 (GL link waves), 0.595 (two field steps per tick); weak factor alone 0.396, 0.496 | positive | induced |
| vector part, isotropic Euclidean lattice, `(9/4) g^2 J`, J = 0.154933 | 0.2697 (weak factor), 0.3236 (with hypercharge) | positive | induced; the Monte Carlo generates it |
| fermion part of the mass term, `-8 A_f g^2` per cone and family, A_f = 0.0057097 | -0.0353 | negative | induced; the multiplicity (cones times families) is DECLARED |
| induced quartic, equal legs | -1.33e-3 (B1), -9.90e-3 (B4t), -1.49e-2 (B4), -1.95e-2 (B6t) | negative | induced |
| fermion part of the quartic alone, one cone | -1.38e-3 | negative | induced |

- UH's statement "the induced mass term is positive and of cell size" is the first row minus the third.
- A lattice run of links and doublet generates the vector and scalar loops itself. Only the fermion zero-point
  terms are entered as on-site terms when the routing fermions are not simulated.
- The multiplicity that cancels the vector term: 7.6 (Euclidean, weak factor), 9.2 (Euclidean, with hypercharge),
  11.2 to 16.8 (Hamiltonian clock). The cone count of the CF-1 zone is 1 by UH's declaration, 4 per parity class
  (T5), 32 per arrow block (R1).

## 5. Measure

- Links: Haar measure per link (the full Peter-Weyl register L^2(G) of GL and BF). BF: the menus M1 and M2 hold
  0.013 and 0.110 of the link vacuum at this coupling, so a run uses the continuous group. EXACT given the register.
- Doublet: flat measure d^4 Phi per cell (the joint spectral measure of the commuting normal operators B_k of UH's
  oscillators is Lebesgue measure on C^2). EXACT given the register.

## 6. Standard lattice parameters

    S = beta_G sum_P [1 - cos(3 a_P) tr V_P / 2] + (3 beta_G / 2) sum_P [1 - cos(2 a_P)]
      + sum_x [ rho_x^2 + lambda_L (rho_x^2 - 1)^2 ] - 2 kappa_H sum_(x,mu) Re Phi_L,x^dag exp(3 i a) V Phi_L,(x+mu),

`rho^2 = Phi_L^dag Phi_L`. Map from the canonical form `sum |D Phi|^2 + m0^2 |Phi|^2 + lambda0 |Phi|^4`:

    Phi = sqrt(kappa_H) Phi_L,   m0^2 = (1 - 2 lambda_L - 8 kappa_H)/kappa_H,   lambda0 = lambda_L / kappa_H^2,   beta_G = 4/g^2.

Convention: `V = lambda0 |Phi|^4`, so `m_H^2 = 2 lambda0 v^2` with `|Phi|^2 = v^2/2`. With two hop coefficients
(section 4.2): `c^2 = kappa_s/kappa_t`, `m0^2 = (1 - 2 lambda_L - 2 kappa_t - 6 kappa_s)/kappa_t`.
Tree-level relations on the Higgs side, rho_v^2 the condensate part of rho^2:
mass angle `theta = (g/2) sqrt(kappa_H) rho_v`, `M_W = sqrt(2) theta`, `M_Z = sqrt(8/5) M_W`,
`m_H^2 = 4 lambda_L rho_v^2 / kappa_H`.

The source's coefficients in these parameters (`source_points.json`):

| Point | m0^2 | lambda0 | kappa_H | lambda_L | Standing |
| --- | --- | --- | --- | --- | --- |
| S1 functional only, tree level | 0 | 0 | 0.12500 | 0 | derived |
| S2 with the oscillator energy omega = 1, share s = 0.9, 0.5, 0.1 | 0.1, 0.5, 0.9 | 0 | 0.12346, 0.11765, 0.11236 | 0 | omega and s DECLARED |
| S3 with the fermion term, one cone, 1 and 3 families | -0.0353, -0.1060 | 0 | 0.12555, 0.12668 | 0 | induced; multiplicity DECLARED |
| S4 four cones, 1 and 3 families | -0.1413, -0.4240 | 0 | 0.12725, 0.13200 | 0 | induced; multiplicity DECLARED |
| S4 thirty-two cones, 1 and 3 families | -1.131, -3.392 | 0 | 0.14557, 0.21702 | 0 | induced; multiplicity DECLARED |
| S6 induced quartic at kappa_H = 1/8 | | -1.3e-3 to -1.9e-2 | | -2.1e-5 to -3.0e-4 | induced |

The polynomial action has no ensemble for lambda_L below zero, and none for lambda_L = 0 with kappa_H above 1/8
(the quadratic form of the doublet is negative on flat links). The source's quartic is zero at tree level and
negative at one loop. A run on the Higgs side therefore needs one of two stabilizers:
- a positive lambda_L (DECLARED regulator; the scans use 0.0002, 0.002 and 0.02, which are lambda0 about 0.012,
  0.12 and 1.0);
- the exact functional on a compact register (section 7).
The polynomial hop term is the second-order expansion of the functional. It holds where the mass angle is small:
`|theta|^2 = (g^2/4) kappa_H rho^2`, so rho^2 well below 41 at kappa_H = 1/8.

## 7. The exact functional on a compact register

    S_C = beta_G sum_P (1 - tr V_P / 2) + beta_H sum_(x,mu) [1 - n0_x n0_(x+mu) - Re q_x^dag V q_(x+mu)] - h sum_x |q_x|^2,

`n = (n0, q)`, `n0 = cos|theta|`, `q = sin|theta| theta^`, on the unit four-sphere. Source value
`beta_H = 8/g^2 = 2 beta_G = 10.342` (derived, section 3). The sphere's invariant measure per cell is DECLARED:
the flat measure of the unbounded register is not normalizable against a cost that is periodic in |theta|.
`h sin^2|theta|` is the leading harmonic of the fermion zero-point term, `h = 32 A_f n_cone n_fam` (0.1827 per cone
and family); the completion beyond second order is DECLARED.
Relations: `M_W^2 = 2 sin^2|theta|` at tree level, mass angle |theta| between 0 and pi, gauge symmetry unbroken at
both poles. The doublet's field range in cell units is `f = 2/g = 2.27`.

## 8. Observables

| Name | Definition | Role |
| --- | --- | --- |
| plaquette | mean of tr V_P / 2 | gauge order |
| L_phi | mean over links of Re Phi_L,x^dag U Phi_L,(x+mu) | the gauge-invariant link of the brief |
| L_alpha | the same with unit doublets alpha = Phi_L/rho | order of the doublet's direction along the link |
| rho^2 | mean of Phi_L^dag Phi_L | size of the doublet |
| chi(O) | (number of terms) times the variance of the lattice average of O | susceptibilities |
| SD residual | `<rho^2> - 8 kappa_H <L_phi> + 2 lambda_L <rho^4 - rho^2> - 2` | exact identity, zero; a test of every port |
| mass angle | `theta_x = (g/2) sqrt(kappa_H) Phi_L,x`; coherent part from rho_v or from M_W / sqrt 2 | what the toggle applies to the patterns |
| W channel | slice average of the vector part of `alpha_x^dag V alpha_(x+i)`, i spatial; correlator in x0 | screening mass M_W |
| Z channel | with hypercharge: third component of the vector part of `alpha_x^dag V alpha_(x+i) R(3a)` | screening mass M_Z; components 1 and 2 carry the unbroken charge |
| scalar channel | slice average of rho^2, connected | Higgs screening mass |

## 9. Reference implementation

Files in `RL/work/HR/`. Interpreter `python` through `hr_py.sh`.

| File | Content |
| --- | --- |
| `hr_lib.py` | weak links and doublet: Kennedy-Pendleton heat bath for links, Bunk-type heat bath for the doublet, global rescaling move, observables |
| `hr_u1.py` | the same with the hypercharge angle (Metropolis for the angle) |
| `hr_compact.py` | the compact form of section 7 (exact heat bath on the four-sphere) |
| `hr_checks.py`, `hr_checks2.py` | gates (`checks.json`, `checks2.json`) |
| `hr_scan.py`, `hr_scan2.py`, `hr_chain.sh` | hysteresis scans; chained jobs under a wall-time budget |
| `hr_corr.py` | screening masses from time-slice correlators |
| `hr_source_points.py` | section 6's table |
| `hr_table.py`, `hr_series.py` | `SCAN_TABLE.md`, `SERIES_TABLE.md`, `scan_summary.json`, `series_summary.json` |

Results: section 10. Tables: `SCAN_TABLE.md` (every scan point), `SERIES_TABLE.md`, `THERMAL_TABLE.md`, `CORR_TABLE.md`,
`COMPACT_TABLE.md`. Headline numbers: `results.json`.

## 10. Results of the reference implementation (MEASURED unless tagged)

### 10.1 Gates

| Gate | Result |
| --- | --- |
| T1: pattern-carrier trace against the 5-trace, weak factor | equal to 1.6e-15 on the carriers of dimension 5, 16, 16, 32 (EXACT) |
| G1: lambda_L = 0, kappa_H = 0 | rho^2 = 2.0037 (0.0022); exact 2 |
| G2: unit links, lambda_L = 0 | 2.2159 (0.0015) against 2.21788 (kappa_H 0.10, 4^4); 2.4989 (0.0053) against 2.50268 (0.12, 4^4); 2.3955 (0.0018) against 2.39513 (0.12, 6^4) |
| G3: Schwinger-Dyson residual | 377 stationary scan points: mean pull -0.06, rms 1.20, 1.3 percent above three |
| G4: plaquette at kappa_H = 0 (6^4) | 0.6028 (0.0008) at beta_G = 2.3 and 0.6530 (0.0004) at 2.5 (recalled 0.602 and 0.652, IMPORTED from memory); 0.7997, 0.8479, 0.8805 at 4.0, 5.171, 6.5 |
| G5: gauge invariance of all observables | 4e-16 |
| G6: local weights of the updates against differences of the total action | 8e-12 for the three engines (`checks3.json`) |
| hypercharge engine | invariance under both factors 4e-16; cos 2 a_P = 0.98541 (0.00008) against the leading estimate 0.98576 |
| compact engine | beta_H = 0: sin^2 theta = 0.8005 (0.0005), |cos theta| = 0.3747; exact 4/5 and 3/8 |

### 10.2 The Higgs line at the source's cell coupling, beta_G = 5.171 (weak factor alone)

The doublet link L_alpha is 0.15 to 0.20 on the symmetric side and rises on the Higgs side. "Crossing": the
kappa_H at which L_alpha passes 0.30.

| lambda_L | Size | Crossing, descending branch | Crossing, ascending branch | Branches differ at | rho^2 on the two branches there |
| --- | --- | --- | --- | --- | --- |
| 0.0002 | 4^4 | 0.12955 | 0.13006 | none at the five-error level | |
| 0.0002 | 6^4 | 0.12957 | 0.13011 | 0.1300 | 2.59 and 20.5 |
| 0.0002 | 8^4 | 0.12951 | 0.13006 | 0.1300 | 2.75 and 21.5 |
| 0.002 | 4^4 | 0.13143 | 0.13216 | 0.1320 | 2.71 and 3.62 |
| 0.002 | 6^4 | 0.13159 | 0.13310 | 0.1320 to 0.1330 | 2.55 and 6.27 at 0.1330 (sector artefact, see below) |
| 0.002 | 8^4 | 0.13163 | 0.13173 | none | |
| 0.02 | 4^4 | 0.14457 | 0.14350 | none | |
| 0.02 | 6^4 | 0.14385 | 0.14459 | none | |
| 0.02 | 8^4 | 0.14390 | 0.14392 | none | |

| lambda_L (lambda0) | Line kappa_c | m0^2 at the line | One-loop line `m0^2 = -[(9/4) g^2 + 6 lambda0] J` | Character on these volumes |
| --- | --- | --- | --- | --- |
| 0.0002 (0.012) | 0.1300 (0.0005) | -0.31 | 0.12949 | first order: two states at 0.1300 |
| 0.002 (0.12) | 0.1317 (0.0003) | -0.44 | 0.13068 | one state; steep continuous turn-on |
| 0.02 (1.0) | 0.1439 (0.0005); L_alpha passes 0.40 at 0.1456 | -1.33 | 0.14122 | one state; smooth turn-on |

- On the Higgs side rho^2 reaches 61 (lambda_L 0.0002, kappa_H 0.1310), 8.6 (0.002, 0.1340), 3.4 (0.02, 0.1470); L_alpha
  0.95, 0.77, 0.47; the plaquette rises from 0.8483 to 0.897, 0.857, 0.850.
- Finite-size sectors (ARGUED from `hr_spinodal.py`, `hr_toron.py`; Addendum 7 of `CANDIDATES.md`). On the symmetric
  side of a small torus the weak Polyakov lines flip between centre sectors and the hypercharge lines wander. A
  flipped line shifts the doublet's lowest momentum by pi/L in that direction and delays the turn-on of an
  ascending branch. Evidence: at lambda_L = 0 on 4^4 the symmetric side ends at 0.1300 for one seed (four positive
  lines) and at 0.1335 for another (lines -0.42 and 0.00 in two directions); five symmetric starts on 6^4 at
  (0.002, 0.1325) with positive lines all reach rho^2 = 4.7 to 5.1 within 150 sweeps. Ascending-branch crossings on
  4^4 and 6^4 are therefore upper bounds. The line is read from descending branches, from 8^4 and from fixed-kappa_H
  starts with recorded lines.

### 10.3 Order of the transition, as far as these volumes allow

- lambda_L = 0.0002: first order. (a) The Higgs branch ends at rho^2 = 20.5 (6^4) and 21.5 (8^4) at kappa_H = 0.1300
  and is on the symmetric side at 0.1295 (2.6, 3.0): a jump by a factor of about eight. (b) Two states at 0.1300:
  the Higgs state persists for 700 (6^4) and 340 (8^4) sweeps; five symmetric starts on 6^4 with positive lines
  stay at rho^2 = 2.6 to 2.9 for 500 sweeps each. (c) On 4^4 the two states are not separated at 0.1300 (the
  descending branch passes through 5.4 during the run); at 0.1302 both starts give 31.2 (0.9) and 31.2 (0.6).
- lambda_L = 0.002: no discontinuity resolved. On 8^4 the two branches agree from 0.1315 to 0.1340, and at 0.1320 a
  symmetric and a Higgs start give 3.69 (0.11) and 3.82 (0.07) (1500 sweeps each). On 6^4 at 0.1322 the two starts
  give 4.23 (0.06) and 4.30 (0.13) (3200 sweeps each). On 4^4 at 0.1318 the series switches between values near
  2.7 and 3.7 (bimodality coefficient 0.57). rho^2 rises from 2.6 to 6.3 between 0.1315 and 0.1330. A weak first
  order transition is not excluded.
- lambda_L = 0.02: continuous turn-on. No branch difference on 8^4; both starts agree on 4^4 and 6^4 at 0.1435;
  the largest chi(L_alpha) is 6 to 7 (4^4), 5 to 11 (6^4), 6 to 10 (8^4), without growth in volume.
- The source's quartic (zero at tree level, negative at one loop) lies below the smallest stabilizer, in the
  first-order range.

### 10.4 Neighbouring couplings (lambda_L = 0.002)

| beta_G | g^2 | Line kappa_c | From | One-loop line | Excess over one loop |
| --- | --- | --- | --- | --- | --- |
| 4.0 | 1.000 | 0.1337 (0.0005) | 6^4 descending 0.13357; ascending 0.13414 (upper bound); 4^4 0.1331 to 0.1340 | 0.13201 | 0.0017 |
| 5.171 | 0.774 | 0.1317 (0.0003) | 8^4 both branches | 0.13068 | 0.0010 |
| 6.5 | 0.615 | 0.1306 (0.0005) | 6^4 descending 0.13056; ascending 0.13156 (upper bound); 4^4 0.1302 to 0.1307 | 0.12977 | 0.0008 |

The line moves to larger kappa_H with growing g^2, as the vector term `(9/4) g^2 J` requires; the excess over one
loop scales roughly with g^4.

### 10.5 The hypercharge angle

| lambda_L | Readout | With hypercharge | Weak factor alone | Shift |
| --- | --- | --- | --- | --- |
| 0.002 | 6^4 descending crossing | 0.13276 | 0.13159 | +0.0012 |
| 0.0002 | end of the Higgs branch (4^4 and 6^4 descending) | between 0.1305 and 0.1310 | between 0.1295 and 0.1300 | +0.0010 |
| 0.0002 | symmetric starts on 6^4 with recorded lines | persist at 0.1310 (3 of 3), leave at 0.1320 (3 of 3) | persist at 0.1300 (5 of 5); ascending scans leave by 0.1305 | +0.0010 to +0.0015 |

Line with hypercharge at the smallest stabilizer: 0.1310 (0.0005). One-loop shift `(3/4) gY^2 J kappa^2`: +0.0009.
Ascending scans with hypercharge leave the symmetric side later (0.1325 on 4^4, 0.1335 on 6^4): the phases of the
hypercharge lines wander on the small torus (rms 0.5 to 1.5 rad on 4^4), a finite-size effect of the same kind as
in 10.2.

### 10.6 Position of the source

Verdict rule (fixed in `CANDIDATES.md` before the scans): below the measured line at the smallest stabilizer is the
confined side, above it the Higgs side, inside its width "on the line". Line: 0.1300 (0.0005) for the weak factor,
0.1310 (0.0005) with hypercharge.

| Point | kappa_H | Against the line (weak factor / with hypercharge) | Side |
| --- | --- | --- | --- |
| S1 functional only, tree level | 0.12500 | -0.0050 / -0.0060 | confined |
| S2 with oscillator energy omega = 1 (share 0.9, 0.5, 0.1) | 0.1235, 0.1176, 0.1124 | -0.007 to -0.019 | confined |
| S3 fermion term, one cone, 1 and 3 families | 0.12555, 0.12668 | -0.0044, -0.0033 / -0.0054, -0.0043 | confined |
| S4 four cones, one family | 0.12725 | -0.0028 / -0.0038 | confined |
| S4 four cones, three families | 0.13200 | +0.0020 / +0.0010 | Higgs side on this clock; see below |
| S4 thirty-two cones, 1 and 3 families | 0.14557, 0.21702 | +0.016, +0.087 | Higgs |

- Direct run at S1 (lambda_L = 0, kappa_H = 1/8): rho^2 = 2.4085 (0.0042), 2.4196 (0.0026), 2.42 to 2.43 on 4^4, 6^4,
  8^4; L_alpha = 0.150, 0.153, 0.155; plaquette 0.8480 (pure gauge 0.8479). No light state in the vector channel
  (the correlator is gone after one step). The doublet's mass squared at S1 is the distance to the line,
  0.31 E_cell^2 (weak factor) to 0.37 (with hypercharge): a mass of 0.56 to 0.61 E_cell.
- The compact form gives the same verdict (10.9): at the source's beta_H and h = 0 the doublet part is aligned to zero.
- S4 with four cones and three families is the one registered row near the line. Its fermion constant A_f is
  UH's Hamiltonian-clock sum; the line is measured on the Euclidean isotropic lattice. On UH's own clock the
  multiplicity that cancels the vector term is 13.5 to 16.8, which puts 12 on the confined side. The row is
  undecided between the clocks. No row sits on the line within its width.
- In every row the distance to the line is of order 0.1 to 1 E_cell^2. Nothing in the source's coefficients tunes it.

### 10.7 Screening masses (beta_G = 5.171)

| Point | Channel | Lattice | Sweeps | Effective mass at t = 1, 2, 3 | Tree level with rho_v^2 = rho^2 |
| --- | --- | --- | --- | --- | --- |
| Higgs side, lambda_L 0.02, kappa_H 0.152 (rho^2 4.51) | W | 8^3 x 16 | 1350 | 0.494 (0.016), 0.462 (0.017), 0.474 (0.026) | 0.515 |
| same | W | 6^3 x 12 | 2000 | 0.502 (0.020), 0.465 (0.022), 0.513 (0.045) | 0.515 |
| same, with hypercharge (rho^2 4.23) | Z | 6^3 x 12 | 2000 | 0.531 (0.028), 0.551 (0.053), 0.495 (0.069) | 0.631 |
| same, with hypercharge | Z | 8^3 x 16 | 600 | 0.617 (0.079), 0.70 (0.19) | 0.631 |
| Higgs side, lambda_L 0.002, kappa_H 0.136 (rho^2 13.2) | W | 6^3 x 12 | 600 | 0.872 (0.040), 0.899 (0.083) | 0.832 |
| same, with hypercharge (rho^2 11.0) | Z | 6^3 x 12 | 3000 | 0.905 (0.039), 0.921 (0.071) | 0.963 |
| symmetric side, lambda_L 0.02, kappa_H 0.135 | W | 6^3 x 12 | 2000 | 3.6 at t = 0, no signal beyond | |
| source point S1 | W | 6^3 x 12 | 2000 | 3.5 at t = 0, no signal beyond | |

- W screening length on the Higgs side: 2.0 cells at (0.02, 0.152), 1.1 cells at (0.002, 0.136). The tree-level relation
  `M_W^2 = g^2 kappa_H rho^2 / 2` holds within 5 percent. Mass angle of the toggle there: `M_W / sqrt 2` = 0.35 and
  0.62 rad per tick.
- Z channel: 0.84 (0.05) and 0.94 (0.04) of tree level on 6^3 x 12, 0.98 (0.13) on 8^3 x 16. Z over W: 1.06 (0.07) on
  6^3 x 12 and 1.25 (0.17) on 8^3 x 16 at (0.02, 0.152), against 1.22 at tree level. The splitting is seen with the
  right sign and is not resolved to better than 15 percent. A cosh fit with a free constant raises the Z mass to
  0.60 (6^3 x 12).
- Scalar channel on the Higgs side: 1.0 to 1.2 at (0.02, 0.152), 0.8 at (0.002, 0.136).

### 10.8 Thermal lattices 8^3 x N_t (temperature E_cell / N_t)

| lambda_L | kappa_H at which L_alpha passes 0.40: N_t = 8 | N_t = 4 | N_t = 2 |
| --- | --- | --- | --- |
| 0.002 | 0.1319 | 0.1319 to 0.1323 | 0.1324 to 0.1327 |
| 0.02 | 0.1456 | 0.1457 | 0.1468 to 0.1471 |

At (0.002, 0.1325) L_alpha is 0.60 on N_t = 8, 0.54 to 0.58 on N_t = 4 and 0.32 to 0.42 on N_t = 2: the hot lattice is
on the symmetric side of its line. The system has a temperature-driven change of regime; with cell-scale
coefficients it sits at temperatures of order E_cell.

### 10.9 The compact form (section 7), beta_G = 5.171

| Scan | Size | Result |
| --- | --- | --- |
| h at the source's beta_H = 10.342, ascending | 4^4, 6^4 | aligned at the pole up to h = 2.0, 2.25 (sin^2 theta 0.059 to 0.065, L_alpha 0.16 to 0.19); on the equator from h = 2.25, 2.5 (sin^2 theta 0.986, L_alpha 0.937, plaquette 0.8845) |
| h, descending from the equator | 4^4, 6^4 | on the equator down to h = 1.25, 1.0; aligned from h = 1.0, 0.75 |
| beta_H at h = 0, from 0.5 to 12.5 | 4^4, 6^4 | sphere disordered at 0.5 (sin^2 theta 0.80); aligned at the pole from 1.5 on; L_alpha at most 0.18: no Higgs regime at any hop coefficient |

- The source point (beta_H = 2 beta_G, h = 0) is aligned at the pole: mass angle 0.23 rad rms without coherence.
- The Higgs regime of the compact form is the equator: mass angle pi/2, `M_W = sqrt 2` E_cell. The change is first
  order with a coexistence interval that widens with volume (h from 1.0 to 2.25 on 4^4, 0.75 to 2.5 on 6^4). Its
  middle, h about 1.6, agrees with the polynomial line (`(4/g^2) |m0^2| = 1.6`).
- In cones times families (h = 0.1827 per unit): pole only up to 4; both states from about 5 to 13; equator only
  beyond. No state with a small coherent mass angle exists with the single harmonic sin^2 theta.

### 10.10 Limits of these results

- Volumes 4^4 to 8^4 and 8^3 x 16; 240 to 1500 measurement sweeps per point; errors from ten blocks. Finite-size
  sectors of the lines affect ascending branches (10.2).
- The bosonic system only. The routing fermions enter through UH's one-loop constants.
- lambda_L, the isotropic clock, the sphere measure and the sin^2 completion are DECLARED.
- Two early jobs and three correlator jobs ran above two minutes under the machine's load (list in `CANDIDATES.md`).
