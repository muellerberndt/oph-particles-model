> Working note of a worker that ended before its report was reviewed. Its statements are unreviewed; the lattice lanes of the viewer check what they take from it.

# FOR_SIM: porting the gauge-Higgs system into the run

Worker HR, 2026-11-11. Definition: `SPEC.md`. Reference code: `hr_lib.py`, `hr_u1.py`, `hr_compact.py`.
Labels: EXACT, MEASURED, ARGUED, IMPORTED, DECLARED. Units: one cell, one tick, E_cell.

## 1. Why the present runs show no electroweak crossover

1. The Z6 register stores the flux class of a face. A Higgs regime is a condensate of the conjugate variable, the
   amplitude beta of the class-3 register. A state diagonal in flux has register expectation zero: it gives a
   conversion probability and no rest phase (R8, result 6). The runs hold no amplitude variable.
2. No seam carries a weak link. The cost table (0, 5, 8, 10, 8, 5) with kappa 5 lets no proposal move a class-3
   face (TR: all 60 proposals raise the cost).
3. The register never changes a load (the run's `DATASET.md`). No mass step reads it.
4. With links and doublet added at cell resolution and the source's own coefficients, the bosonic system sits on
   the confined side of its Higgs line at a distance of cell size (section 5). The measured crossover lies at a
   temperature of 1.7e-17 E_cell (section 6).

## 2. Variables to add

| Where | Variable | Storage | Meaning | Cold start |
| --- | --- | --- | --- | --- |
| cell x of the cubic family | `phi[x]`, quaternion (4 reals), `phi = rho * alpha` | (N, 4) float64 | doublet `Phi_L`, the amplitude of the class-3 register in lattice normalization: `theta_x = g_t beta_x = (g/2) sqrt(kappa_H) Phi_L,x` | Gaussian, variance 1/2 per component |
| frame seam (x, i), i = 1, 2, 3 | `U[i][x]`, unit quaternion | (3, N, 4) | weak link V between carriers x and x + e_i (replaces the link sign z of CF1 section 8; the sign is the centre of V) | (1, 0, 0, 0) |
| frame seam (x, i) | `a[i][x]`, angle | (3, N) | hypercharge angle, phases exp(i 6Y a); 6Y = 3 on the doublet | 0 |
| tick link (x, 0) | `U[0][x]`, `a[0][x]` | as above | time-like link of the Euclidean ensemble; absent in a real-time run in temporal gauge, where the Gauss law is the constraint | (1, 0, 0, 0), 0 |

- Quaternion convention: `V = a0 + i (a1 sigma_1 + a2 sigma_2 + a3 sigma_3)`. The doublet is the second column of the
  matrix of `phi`: `Phi = (phi2 + i phi1, phi0 - i phi3)`. Then `Re Phi_x^dag V Phi_y = dot(phi_x, qmul(V, phi_y))`.
  Hypercharge acts from the right: `Phi -> exp(i w) Phi` is `phi -> phi * (cos w, 0, 0, -sin w)`.
- Relation to the Z6 register of the runs. The class of a plaquette is the centre class of its holonomy
  `(a_P, V_P)` under (a, C, V) ~ (a + pi/3, omega C, -V). Class 3 is the weak centre element `V_P = -1`. Its cost in
  the action of `SPEC.md` is `2 beta_G = 10.34` per plaquette, so a thin class-3 face has weight exp(-10.34) = 3.2e-5
  per plaquette at the cell coupling. The register of the runs is the centre projection of the links.
- Storage per cell of the three-dimensional family: 16 reals for the weak system (three unit quaternions and the
  doublet) and 3 angles; a tick link adds 5. The 24 internal seams of a carrier keep their link bits (the internal
  flux register of CF1 section 8); the gauge-Higgs system lives on the three frame seams per cell.

## 3. Ensemble and update

Weight `exp(-S)`, S of `SPEC.md` section 6, Haar measure per link, flat measure per doublet.

- E4: the four-dimensional lattice `N_t x N^3`, periodic. It is the equilibrium ensemble of the quantum system at
  temperature `T = E_cell / N_t`; `N_t = N` is the vacuum. All reference numbers of this directory are E4.
- E3: the static three-dimensional ensemble of run H4 (`N_t = 1`, no tick link). It is the classical limit at
  temperatures above E_cell. Its line is a separate measurement; no number here applies to it.

One sweep (`hr_lib.Lattice.sweep`, `hr_u1.LatticeU1.update_links`):

1. Links, per direction and per parity of the cell (links of one direction on cells of equal parity share no
   plaquette). Local weight of the weak link: `exp((1/2) tr(V W))`,
   `W = beta_G sum over the six staples of cos(3 a_P) A_staple + 2 kappa_H (phi_(x+mu) R(3a)) phi_x^dag`.
   W is a positive multiple of an SU(2) element: Kennedy-Pendleton heat bath, `V = X W^^dag`.
   Angle: Metropolis on
   `-(3 beta_G/2) sum cos 2(a + c_j) - beta_G sum t_j cos 3(a + c_j) - 2 kappa_H [h_c cos 3a + h_s sin 3a]`,
   c_j the rest of each plaquette angle, t_j = tr V_P / 2, step 0.1, two hits (acceptance 0.63).
2. Doublet, per parity. Local weight `exp(-rho^2 - lambda_L (rho^2 - 1)^2 + 2 kappa_H dot(phi, b))`,
   `b = sum_mu [V_(x,mu) phi_(x+mu) R(3a) + V_(x-mu,mu)^dag phi_(x-mu) R(-3a)]`. Heat bath: Gaussian with centre
   `kappa_H b / alpha` and variance `1/(2 alpha)` per component, accepted with `exp(-lambda_L (rho^2 - v)^2)`,
   `v = 1 + (alpha - 1)/(2 lambda_L)`, alpha the positive root of
   `alpha^3 - (1 - 2 lambda_L) alpha^2 - 4 lambda_L alpha - 2 lambda_L kappa_H^2 b^2 = 0`. A rejected proposal
   keeps the old value. For lambda_L = 0 the Gaussian with alpha = 1 is exact.
3. One global move `phi -> exp(s) phi` on all cells, s uniform in +-1/sqrt(N), accepted with
   `exp(-Delta S + 4 N s)`.

Parameters at the source's cell coupling: `beta_G = 5.1710`; kappa_H is the scanned coupling; lambda_L is a
declared positive stabilizer (the source's own value is zero at tree level and negative at one loop). The compact
form (`hr_compact.py`) needs no stabilizer: the doublet is the point `n = (cos|theta|, sin|theta| theta^)` of the unit
four-sphere, hop coefficient `beta_H = 2 beta_G`, exact heat bath on the sphere.

## 4. Observables that show the Higgs field acting on the loads

1. Port test first: the residual `<rho^2> - 8 kappa_H <L_phi> + 2 lambda_L <rho^4 - rho^2> - 2` vanishes within errors at
   every point. Gauge invariance of every observable under random g_x and chi_x (1e-15 here).
2. Order of the doublet: `L_phi`, `L_alpha`, `rho^2` and their susceptibilities (definitions in `SPEC.md` section 8).
3. Mass angle of the toggle. The mass step of CF-1 (option M2) at cell x is `exp(-i K(theta_x))`,
   `K(theta) = sum_k (theta_k c_k^dag + conj(theta_k) c_k)` on the two doublet levels,
   `theta_x = (g/2) sqrt(kappa_H) Phi_L,x`, g = 0.87951. Port: gauge-fix to unit doublets,
   `V'_(x,i) = alpha_x^dag V_(x,i) alpha_(x+i)`; then the toggle is the engine's neutral-level toggle with the angle
   `|theta_x| = (g/2) sqrt(kappa_H) rho_x` per cell (`Engine.mass_field` with one angle per cell), and the routing
   reflector of a charged level takes the matrix `exp(i 6Y a) V'` on the doublet levels in place of the link sign.
   Readout: the rest phase of a routed quantum from the engine's dispersion, `cos E = cos(theta) cos(p)` on an axis.
   - Confined side: |theta_x| is nonzero cell by cell (rms 0.24 rad at the point S1) with links that scramble the
     doublet direction between neighbours (`L_alpha` 0.15). Expected readout (ARGUED from R8, result 3): conversion
     between the handedness classes and a finite mean free path, no common rest phase.
   - Higgs side: `L_alpha` above 0.6; a common rest phase `theta = M_W / sqrt 2` for every leg with y = g/2.
4. W and Z screening lengths: correlators in x0 of the slice-averaged vector part of
   `alpha_x^dag V_(x,i) alpha_(x+i) R(3a)` (`hr_corr.py`). With the weak factor alone the nine components are one
   triplet (W). With the hypercharge angle the third component is the Z channel and is gauge invariant; the first
   two carry the unbroken charge and need a string. Tree level with the cell couplings: `M_W = sqrt 2 theta`,
   `M_Z = sqrt(8/5) M_W`; screening lengths 1/M in cells. Measured reference values: section 5.
5. The scalar channel (slice average of rho^2, connected) gives the screening mass of the Higgs excitation.

## 5. Reference numbers for the port (this directory, E4)

Results are filled from `scan_summary.json`, `series_summary.json`, `corr_*.json`, `compact_*.json`: see section 10
of `SPEC.md`. The list below holds the gates.

| Gate | Value here |
| --- | --- |
| lambda_L = 0, kappa_H = 0: rho^2 | 2.0037 (0.0022), exact 2 |
| unit links, lambda_L = 0, kappa_H = 0.12, 6^4: rho^2 | 2.3955 (0.0018), exact 2.39513 |
| plaquette at kappa_H = 0: beta_G = 2.3, 2.5, 4.0, 5.171, 6.5 (6^4) | 0.6028, 0.6530, 0.7997, 0.8479, 0.8805 |
| with hypercharge, kappa_H = 0, beta_G = 5.171 (4^4): tr V_P/2, cos 2 a_P, cos 3 a_P | 0.8425, 0.98541, 0.96748 |
| compact form, beta_H = 0: sin^2 theta, |cos theta| | 0.8005 (0.0005), 0.3747; exact 4/5, 3/8 |

## 6. What a run in cosmic time needs beyond this

1. A temperature. In E4 it is the tick extent, `T = E_cell / N_t`. A cooling history is a sequence of ensembles
   with growing N_t, or a real-time run with an expansion rule that lowers the occupation of the link and doublet
   waves. The source supplies no such rule to this lane; the run's own clock and record density are the
   simulation session's inputs.
2. The scale gap. The measured ratio v / E_cell = 2.6e-17 (NOT BLIND, quoted from the brief) puts the crossover
   temperature, about 160 GeV for the measured Higgs mass (IMPORTED from memory of lattice studies of the Standard
   Model, NOT BLIND), at 1.7e-17 E_cell. One thermal wavelength is 6e16 cells, and a box of a few magnetic screening
   lengths 1/(g^2 T) is about 1e18 cells per side. No run at cell resolution reaches it.
3. A blocked lattice. The route is a lattice of blocks with flowed coefficients (beta_G, kappa_H, lambda_L at the
   block scale). It needs the flow of the mass term from the cell to the weak scale, which is the open hierarchy
   item: the doublet's mass squared has to sit at 1.7e-34 E_cell^2 (for 125 GeV, NOT BLIND), against a distance of
   order 0.3 E_cell^2 between the source's coefficients and the line (section 10 of `SPEC.md`).
4. What runs now. A thermal scan at cell-scale coefficients: fixed spatial size, N_t = 2, 4, 6, kappa_H on the Higgs
   side of the vacuum line. It shows the restoration of the symmetric regime with temperature in the source's
   system at the cell scale. It is the same mechanism at a scale 1e17 times the measured one and carries no
   statement about the measured crossover.
5. Fermions. The routing fermions enter the doublet's mass term at one loop with a sign opposite to the links
   (`SPEC.md` section 4.3). A run with links, doublet and occupied routing modes on one clock is the direct
   measurement of the side on which the full system sits; it needs the cone census (T3, T5) settled.
