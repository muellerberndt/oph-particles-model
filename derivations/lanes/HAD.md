# Quark binding on a finite lattice

The colour links carry the Wilson plaquette action. Wilson quarks on these links, with quark loops omitted,
give a static potential, pion, rho and nucleon correlators, and a finite-temperature static-pair free energy.
The calculation uses one lattice spacing. The comparison with known measurements is not blind.

The replayable source is the theory repository's
[quenched hadron package](https://github.com/FloatingPragma/observer-patch-holography/tree/main/model/quenched_hadron_binding),
with its [proof and analysis conventions](https://github.com/FloatingPragma/observer-patch-holography/blob/main/model/quenched_hadron_binding/PROOF.md)
and [results](https://github.com/FloatingPragma/observer-patch-holography/blob/main/model/quenched_hadron_binding/results.json).
The viewer projects its ratio table from that receipt and records the receipt's SHA-256.

## Lattice and masses

Lattice `12^3 x 24` at `beta = 5.7`, 128 configurations in 32 independent streams.
The static potential rises at every on-axis separation used in the fit. Its string tension is
`a^2 sigma = 0.1667` with statistical error `0.0017` and fit sensitivity `0.0135`; `r0/a = 2.946`.

| kappa | a m_pi | a m_rho | a m_N |
| --- | --- | --- | --- |
| 0.1600 | 0.6897(18) | 0.8109(26) | 1.3065(91) |
| 0.1650 | 0.4584(21) | 0.6626(40) | 1.0270(117) |
| 0.1663 | 0.3809(34) | 0.6231(64) | 0.9358(159) |
| 0.1675 | 0.2317(322) | 0.5817(188) | 0.5186(2180), unresolved |

These brackets are statistical errors. The nucleon is heavier than the rho at the three resolved quark masses.
Its mass at the lightest quark mass is unresolved. All four points enter the chiral fit with their errors.
The chiral fit gives `kappa_c = 0.16919(6)`, `a m_rho = 0.5440(70)` and `a m_N = 0.7886(162)`.
The physical point uses the measured `m_pi/m_rho = 0.178` as input.

| Ratio | Chiral limit | Physical m_pi/m_rho |
| --- | --- | --- |
| m_N/m_rho | 1.4495 +- 0.132 | 1.4544 +- 0.124 |
| m_rho/sqrt(sigma) | 1.3326 +- 0.1220 | 1.3458 +- 0.1231 |
| m_N/sqrt(sigma) | 1.9317 +- 0.182 | 1.9572 +- 0.178 |

The statistical errors follow the same-stream jackknife through the mass and potential fits. The systematic
component is the largest displacement over crossed hadron and potential fit choices. Their quadrature totals
appear in the table. These fit sensitivities do not bound quenching, finite-volume or continuum errors.
The measured nucleon/rho ratio is `1.211`; no measured ratio enters the chiral-limit fit.

## Finite-temperature static pairs

At `N_t = 4`, the slope of `F/T = -ln C(r)` for `r >= 2` is `0.9896(51)` per lattice unit
at `beta = 5.6` and `0.00107(1)` at `beta = 5.85`. Above the transition the static-pair free energy is flat.
This is an ensemble comparison at separate couplings, not a simulated cosmological cooling trajectory.

## Reproduction and scope

The theory package contains the reduced Wilson-loop and correlator tables with delete-one-stream jackknife
samples, the analysis code, small-lattice kernel checks and production drivers. Replaying those tables and
checks does not rerun the production; the package does not store the configurations or raw measurement files.
The universe-run download archive is a separate dataset and supplies no missing hadron configurations.

The gauge group and colour triplet are attached to the declared code. Continuous links, the Wilson regulator
and the quenched approximation are construction choices. A mass in GeV requires a light-quark mass and a lattice
spacing in physical units; neither is derived by this calculation. The string-tension convention `440 MeV`
is imported and does not enter the dimensionless ratios.
