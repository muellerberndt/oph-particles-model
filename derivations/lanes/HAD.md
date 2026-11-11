# Lane HAD: report (in progress, updated as results arrive)

## RESULT

State at 13:36 local time. Lattice A (8^3 x 16) is complete and frozen. Lattice B (12^3 x 24) and the melting
runs are in production. Numbers of lattice A are final. The headline numbers will come from lattice B.

1. Code and gates (final). Wilson-Dirac operator, even-odd BiCGStab, APE smearing, off-axis Wilson loops, Gaussian
   source smearing, pion, rho and nucleon contractions. All gates pass (`gates.json`, `had_gates.log`):
   - lane QCD gates rerun on this box: all pass, plaquette 0.54921(27) on 8^4 at beta = 5.7 (MEASURED);
   - fast kernel against the explicit-gamma reference: 2.4e-16 (EXACT to rounding);
   - gamma5-hermiticity: operator 4.9e-16, propagator from two sources 8.8e-10;
   - even-odd solve: true residual 7.9e-11, equal to conjugate gradient on the normal equations to 2.9e-10;
   - free field: pion and rho correlators against the momentum-space sum 3.1e-12, propagator 8.3e-14;
   - gauge covariance of the propagator 1.7e-11, invariance of pion, rho, nucleon correlators below 4.6e-10
     for point, smeared-point and smeared-smeared correlators;
   - nucleon contraction against the brute-force Wick sum: 7.7e-16;
   - free nucleon on 8^3 x 32 at kappa = 0.110: effective mass 1.3075 at t = 11, three quark pole masses 1.3060;
   - APE links in SU(3) to 3e-15, smeared loops gauge invariant to 1.7e-15, loops equal to the lane QCD routine 3e-15.
2. Configurations (MEASURED). beta = 5.7, 32 independent streams per lattice, 500 compound sweeps of thermalisation,
   50 between configurations. Lattice A: 160 configurations, plaquette 0.54928(15). Literature 0.5492 (IMPORTED).
   Integrated autocorrelation time of the plaquette 3.5(3) compound sweeps. Hot and cold starts agree after 23 sweeps.
   Lag-one correlation of saved configurations: plaquette -0.11(9), smeared loop -0.11(9), pion correlator 0.00(9).
3. Static potential on lattice A (MEASURED). V(r) = 0.5054(8), 0.8069(16), 1.0192(38), 1.2054(77) at r = 1, 2, 3, 4.
   It rises at every step. Fit V0 + sigma r - e/r over r >= sqrt(2): a^2 sigma = 0.174(4)(18), e = 0.170(12),
   r0/a = 2.91(2)(9). The first error is statistical, the second is half the spread of the four fits.
   sigma is 9.3 combined standard errors from zero. chi2 = 186 on 6 degrees of freedom: the points are precise
   enough to show the breaking of rotational symmetry at this lattice spacing.
4. Hadrons on lattice A (MEASURED). kappa = 0.1600: a m_pi = 0.685(5)(7), a m_rho = 0.800(7)(4), a m_N = 1.334(13)(31).
   kappa = 0.1663: 0.357(19)(13), 0.627(17)(9), 1.041(54)(12). The pion correlators at kappa = 0.1650 and 0.1675 are
   dominated by exceptional configurations (one at 100 medians, eleven above 10 medians). The rule fixed in the log
   drops both hopping parameters. Lattice A is too small for a chiral fit with a test of its form.
5. Lattice B, melting: running.

## EVIDENCE

Files in this directory: `METHOD.md`, `CANDIDATES.md`, `su3_lib.py`, `had_lib.py`, `had_gates.py`, `gates.json`,
`had_gen.py`, `had_meas.py`, `had_analyze.py`, `had_melt.py`, `had_melt_analyze.py`, `had_site.py`,
`analysis_A.json` (sha256 1ec6ad92...296b30), `jk_A.json`, `sigma.json`.

## WHAT THIS DOES NOT ESTABLISH

To be written with the final numbers.

## NEXT

To be written with the final numbers.


## Addendum: lattice B and the melting runs (completed after the lane's last report)

The production of lattice B and of the melting runs finished on the compute box. The lane's own scripts were run
unchanged: `had_analyze.py B 12 24 measB cfgB analysis_B.json`, `had_melt_analyze.py melt melting.json`, then
`had_site.py`. No configuration was excluded (`excluded` is empty).

**Lattice B (MEASURED).** beta = 5.7, 12^3 x 24, 128 configurations, 32 streams.
Static potential: a^2 sigma = 0.1667 (stat 0.0017, syst 0.0135), r0/a = 2.946.

| kappa | a m_pi | a m_rho | a m_N |
| --- | --- | --- | --- |
| 0.1600 | 0.6897(18) | 0.8109(26) | 1.3065(91) |
| 0.1650 | 0.4584(21) | 0.6626(40) | 1.0270(117) |
| 0.1663 | 0.3809(34) | 0.6231(64) | 0.9358(159) |
| 0.1675 | 0.2317(322) | 0.5817(188) | 0.5186(2180) |

Chiral fit over the four hopping parameters: kappa_c = 0.16919(6), a m_rho = 0.5440(70)
and a m_N = 0.7886(162) in the chiral limit. The physical point uses the measured m_pi/m_rho = 0.178 as input.

Ratios as published on the site:
- m_N/m_rho (chiral limit): 1.4495 +- 0.132 (measured 1.211, not blind)
- m_N/m_rho (physical m_pi/m_rho): 1.4544 +- 0.124 (measured 1.211, not blind)
- m_rho/sqrt(sigma) (chiral limit): 1.3326 +- 0.0183
- m_N/sqrt(sigma) (chiral limit): 1.9317 +- 0.177
- m_rho/sqrt(sigma) (physical m_pi/m_rho): 1.3458 +- 0.0184
- m_N/sqrt(sigma) (physical m_pi/m_rho): 1.9572 +- 0.168

The comparisons with sqrt(sigma) use no measured value on the site; the conventional sqrt(sigma) = 440 MeV is not used there.

**Melting (MEASURED, N_t = 4).** Polyakov-loop correlators, F/T = -ln C(r): slope for r >= 2 is
0.9896(51) per lattice unit at beta = 5.6 (below the transition) and
0.00107(1) at beta = 5.85 (above it): the binding melts.

**Not established.** Masses in GeV: they need the light-quark mass (open in the model; the physical point is set by the
measured m_pi/m_rho) and the lattice spacing in GeV (through the chain's colour scale only with imported relations).
The Wilson fermion is a discretisation chosen here; quark loops are dropped; one lattice spacing.
