// The 31 criteria of the OpenWave comparison with this project's own estimate for each (page "OpenWave status").
// Written by oph-particles-model/tools/sync_openwave_status.py from the criterion-by-criterion assessment;
// do not edit by hand. status: met, part, fails, untested (the central estimate); low and high: the
// conservative and the permissive reading. proofs: packages model/<name> of the theory repository.
// OpenWave has awarded OPH no cells: every status here is an estimate of this project.
export const OPENWAVE = {
 "assessment_sha256": "8dc1cee563ea257642c1f44fa180b75d25f5023c93015482cd1a469f08da1415",
 "upstream_commit": "ef55175d04737e73c92f33f9f9cf3d17c593da54",
 "evaluated_RER_commit": "bc3d986c0f32e3b0351ba06efa058ed9a0784e62",
 "counts": {
  "met": 18,
  "part": 13,
  "fails": 0,
  "untested": 0
 },
 "rows": [
  {
   "id": 1,
   "criterion": "Charge quantization",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The complete native Fock charge lattice forbids half-unit splitting, and actual PW119 charged arrivals carry the same quantized central current and regional Gauss flux with every failure/reference outcome retained. This supports the compact-current charge-protection criterion; texture winding is a separate invariant and observed electromagnetic identification is separate.",
   "next": "Reproduce the complete current/flux experiment in-platform. For a strictly texture-topological interpretation, supply an accepted compact-charge index dictionary; do not impose the refuted winding=current identity.",
   "proofs": [
    "defect_integer_lift",
    "compact_defect_transport",
    "defect_particle_classes",
    "openwave_charge_protection",
    "openwave_native_charge_flux",
    "openwave_local_gauss_quantum"
   ]
  },
  {
   "id": 2,
   "criterion": "Electron rest energy (mass)",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The same 192-CAR matter action has a unique positive massive reference and exact full charge±1 floor at the electron unit. All charged/neutral branches coexist with the calibrated strong source, and native localized/electromagnetic controls retain their separate proved joins. The electron value is the disclosed energy anchor, not a predicted absolute scale.",
   "next": "Complete localization, field and source-clock transfer for the full interacting construction; keep photon-containing gap claims distinct.",
   "proofs": [
    "native_abelian_field_join",
    "native_block_dirac",
    "openwave_common_mass_source",
    "openwave_energy_resolved_transport",
    "openwave_factorized_compiler",
    "openwave_full_higgs_floor",
    "openwave_infinite_photon",
    "openwave_kinetic_phase_cycle",
    "openwave_lepton_mass_shell",
    "openwave_local_gauss_quantum",
    "openwave_localized_rest_packet",
    "openwave_native_quantum_charge",
    "openwave_particle_readouts",
    "openwave_quantum_rotational",
    "openwave_spatial_completion"
   ]
  },
  {
   "id": 3,
   "criterion": "de Broglie clock (Zitterbewegung)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The same localized charged packet has prepared autonomous target-Hamiltonian phase with visibility above 0.9997728 and a quantitative rest-frequency bound. Dephasing removes its quadratures and a differential scalar drive shifts its frequency. The analyzer compiler uses continuing controls and transfers sampled records, not between-pulse derivatives. Passive onset and drive rigidity are unproved.",
   "next": "Establish passive onset and rigidity for an uncontrolled microscopic source, retaining the reference and comparing frequency with its same-source rest energy.",
   "proofs": [
    "lepton_clock_energy",
    "native_exchange_clock",
    "openwave_joint_native_clocks",
    "openwave_localized_rest_packet",
    "openwave_native_beat_clock",
    "openwave_particle_readouts",
    "openwave_relational_clock",
    "openwave_single_valley_leptons",
    "openwave_mass_catalogue"
   ]
  },
  {
   "id": 4,
   "criterion": "Particle stability (Derrick escape)",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The finite charged packet retains its proved persistence domain. A separate full spatial/photon positive source has an isolated spin-half band under its stated trap condition and controlled shell convergence. Removing that trap gives threshold16 with no normalizable minimizing state, so no self-bound localized particle is inferred from the trapped result.",
   "next": "Reproduce the exact moments and complete small-box dynamics in-platform, then control local interactions and preparation at practical sizes.",
   "proofs": [
    "compact_defect_transport",
    "openwave_infinite_photon",
    "openwave_lepton_mass_shell",
    "openwave_localized_rest_packet",
    "openwave_neutral_stationary",
    "openwave_particle_readouts",
    "openwave_platform_kernel",
    "openwave_reference_binding",
    "openwave_spatial_completion",
    "spin_dynamical_localization"
   ]
  },
  {
   "id": 5,
   "criterion": "Magnetic moment μ (g ≈ 2, magnetostatics)",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "Complete native Gauss dressing preserves the quantum current. Global divided-difference and differentiated moment bounds enclose the infinite-photon static coefficient in[1.99827530667,1.99827540121] and control finite-time precession. The trap, regulator and uncalibrated external field remain explicit; this is not a fit to the observed anomaly.",
   "next": "Port the complete infinite-photon current/precession records; establish the physical external-field, coupling and observed-particle dictionary without refitting the energy anchor.",
   "proofs": [
    "openwave_angular_torque",
    "openwave_intrinsic_magnetic",
    "openwave_larmor_dynamics",
    "openwave_magnetic_refinement",
    "openwave_magnetic_response",
    "openwave_native_quantum_charge",
    "openwave_quantum_larmor",
    "openwave_quantum_rotational",
    "openwave_rotational_g_limit",
    "openwave_local_gauss_quantum",
    "openwave_infinite_current"
   ]
  },
  {
   "id": 6,
   "criterion": "Angular momentum J (spin ℏ/2)",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The actual native-charge CAR map and complete longitudinal Gauss isometry retain an isolated dressed spin-half band. Infinite-photon moments and full spatial-shell form convergence extend the representation in their stated trap domain. Complete complementary sectors and field angular momentum are retained; physical electron identification is separate.",
   "next": "Reproduce the native-current, full-field angular and calibrated records in-platform; control spatial trap removal and the observed-particle dictionary.",
   "proofs": [
    "openwave_angular_torque",
    "openwave_infinite_photon",
    "openwave_lepton_mass_shell",
    "openwave_native_quantum_charge",
    "openwave_particle_readouts",
    "openwave_quantum_larmor",
    "openwave_quantum_rotational",
    "openwave_rotational_g_limit",
    "openwave_spin_frame_records",
    "particle_primary_composite_spin",
    "openwave_local_gauss_quantum",
    "openwave_infinite_current",
    "openwave_spatial_completion"
   ]
  },
  {
   "id": 7,
   "criterion": "Spin-½ statistics (720° double cover)",
   "status": "met",
   "low": "untested",
   "high": "met",
   "reason": "Literal proper cube rotations preserve the kinetic/pairing source and its filled reference. Complete oriented spin-frame records return at 2pi; a declared two-copy apolar tensor law returns atpi. The odd source returns at 4pi relative to an idle reference. This meets the static field/frame precedent, with no fundamental nematic field or exchange-statistics claim.",
   "next": "Port the actual spatial rotations, complete tensor/frame laws and pointer controls. Keep the two-copy observer-field convention distinct from the entire microscopic quantum state.",
   "proofs": [
    "particle_primary_composite_spin",
    "openwave_particle_readouts",
    "openwave_spin_frame_records"
   ]
  },
  {
   "id": 8,
   "criterion": "Antimatter + annihilation",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "Actual native CAR current, rather than an inserted pair-transition projector, converts a neutral particle-hole pair into two transverse quantum modes with a positive full-H probability bound, complete observations and conserved energy/charge/momentum. Central credit follows the literal pair-to-radiation minimum. Supplied resonance, free-reference quench, cap dependence and measurement work remain explicit; no physical positron or outgoing scattering rate is inferred.",
   "next": "Reproduce the current-derived finite conversion in-platform, then control the interacting reference, photon/volume limits and outgoing channels. Positronium2γ/3γ remains a separate follow-on.",
   "proofs": [
    "particle_primary_charge_conjugation",
    "charge_conjugation_dynamics",
    "openwave_radiative_pair"
   ]
  },
  {
   "id": 9,
   "criterion": "Neutrinos (neutral states)",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "Actual native light charge-zero Dirac states occur in all nine massive-neutral pair channels of the positive-frequency charged-decay source. A spectral-amplitude theorem controls release/parent relaxation over one and four calibrated weak lifetimes. Native weak-current readouts distinguish neutrino, antineutrino and sterile coordinates. Oscillation inputs, normal ordering and m1=.001eV are disclosed calibrations/choices; no independent absolute-mass prediction is claimed.",
   "next": "Reproduce the complete emitted-neutral source and current instruments inside OpenWave; a measured beam-event likelihood and unfiltered-contact transfer are additional physical-completion tests.",
   "proofs": [
    "neutrino_mass_response",
    "openwave_baryon_beta",
    "openwave_beta_outgoing",
    "openwave_common_mass_source",
    "openwave_current_averaging",
    "openwave_dirac_neutral_current",
    "openwave_inclusive_decay",
    "openwave_meson_memory_window",
    "openwave_meson_ring",
    "openwave_meson_weak_current",
    "openwave_neutral_candidate",
    "openwave_neutral_dispersion",
    "openwave_neutral_flight",
    "openwave_neutral_preparation",
    "openwave_neutral_stationary",
    "openwave_neutral_transfer",
    "openwave_neutrino_calibration",
    "openwave_reachable_averaging",
    "openwave_weak_decay",
    "openwave_lepton_widths",
    "openwave_neutrino_matter"
   ]
  },
  {
   "id": 10,
   "criterion": "Neutrino oscillations (PMNS)",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The actual calibrated Dirac family tensor, native weak-flavour preparation/detection and complete vacuum flight reproduce three-flavour oscillations with the supplied PMNS angles and mass splittings. Native electron-current contractions additionally give the matter potential and complete finite medium records with a controlled mean-law limit. Fitted angles are allowed disclosed inputs; this literal mechanism is executed rather than only postulated.",
   "next": "Reproduce the native flavour instruments and vacuum/matter laws in-platform, retaining calibration ancestry, all electron-spin/sterile outputs and the forward-port source boundary; physical beam data comparison is separate.",
   "proofs": [
    "native_flavour_transport",
    "neutrino_mass_observables",
    "openwave_dirac_neutral_current",
    "openwave_neutral_flight",
    "openwave_neutrino_calibration",
    "openwave_neutrino_oscillation",
    "openwave_neutrino_matter",
    "openwave_lepton_widths"
   ]
  },
  {
   "id": 11,
   "criterion": "Lepton mass spectrum (μ, τ)",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The full native Higgs-Wilson source proves exactly one charged minimum per family and exactly three colourless charged Dirac families. Its ratios1:206.77031597:3477.47283710 meet the stated approximate1:207:3477 target. All neutral valleys and charged corner saddles are retained. Electron anchoring and retrospective phase2/9 are disclosed; the9.83ppm muon discrepancy and physical pole identification are separate precision tests.",
   "next": "Reproduce the complete charged-minimum census and instruments in-platform. Derive or test interaction corrections against the precision muon ratio without reusing that target to claim an independent prediction.",
   "proofs": [
    "lepton_mass_compiler",
    "lepton_register_round",
    "openwave_common_mass_source",
    "openwave_composite_scale",
    "openwave_full_higgs_floor",
    "openwave_kinetic_phase_cycle",
    "openwave_lepton_mass_shell",
    "openwave_lepton_phase_cycle",
    "openwave_vectorlike_flavour",
    "openwave_single_valley_leptons",
    "openwave_mass_catalogue"
   ]
  },
  {
   "id": 12,
   "criterion": "Quarks",
   "status": "part",
   "low": "untested",
   "high": "part",
   "reason": "Native quark-hole strings carry charges2/3 and−1/3 with complete Gauss/arrival records. A declared vectorlike free extension resolves the equal-up/down gap obstruction through actual native hypercharge mixing, with exact Ward identities, a charged floor, complete failure records and conditional GeV gaps. It does not identify physical quark masses, transfer the local quark-string source, or establish fractional spatial winding.",
   "next": "Join the unequal native free gaps to the complete Gauss quark source and establish physical mass/renormalization and spatial-winding readouts where claimed.",
   "proofs": [
    "defect_particle_classes",
    "native_quark_response",
    "openwave_composite_scale",
    "openwave_full_higgs_floor",
    "openwave_quark_strings",
    "particle_primary_charged_string",
    "openwave_vectorlike_flavour",
    "openwave_colour_string",
    "openwave_common_electromagnetism"
   ]
  },
  {
   "id": 13,
   "criterion": "Baryons: bound state (p, n)",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "An actual native three-quark colour singlet is a stationary bound composite, with complete baryon spectra and constituent-fragment controls. Exact Gauss elimination gives a linear relative-separation cost and a chain-length-independent confinement bound. Fixed-law2–5-cell executions retain all120/364/816/1540singlet states, preparation failures and unresolved edge clusters. This meets the literal stable-three-quark minimum; graph-dependent masses/gA and continuum poles are not identified with nature.",
   "next": "Reproduce the full three-quark carrier, fragment and Gauss-string records in-platform. Extend to pair creation, common physical lengths and scattering before claiming a physical continuum nucleon.",
   "proofs": [
    "correlated_hadron_spectrum",
    "openwave_axial_state",
    "openwave_baryon_ordering",
    "openwave_calibrated_hadrons",
    "openwave_composite_scale",
    "openwave_native_composites",
    "openwave_nuclear_distance",
    "quenched_hadron_binding",
    "openwave_spin_gradient_nuclei",
    "openwave_colour_string",
    "openwave_rest_spectroscopy"
   ]
  },
  {
   "id": 14,
   "criterion": "Baryons: mass ordering + charge profile",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The calibrated native action retains n>p and native charge operators. The unequal-free-gap member supplies unfitted ordering but fails physical masses; the calibrated member fits n/p masses. Positive inner/negative outer graph charge belongs its proved source domain and is not an observed neutron form factor.",
   "next": "Compute the complete charge profile on the axial/common-source state with physical length and electromagnetic corrections, then compare held-out form factors.",
   "proofs": [
    "openwave_baryon_ordering",
    "openwave_calibrated_hadrons",
    "openwave_composite_scale",
    "openwave_vectorlike_flavour",
    "quark_flavour_resolution",
    "openwave_rest_spectroscopy",
    "openwave_common_electromagnetism"
   ]
  },
  {
   "id": 15,
   "criterion": "Baryons: exact masses",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "Proton/neutron/pion strong energies are calibrated on one electron unit. Adding the full weak contact gives complete neutron lines near0.9395478469,0.9395707312,0.9395801015GeV and a dominant proton line0.93827994174GeV, read through complete finite Fourier instruments. These calculated spectra are not identified physical continuum poles or independent calibrated-mass predictions.",
   "next": "Establish physical rest/pole records, source/reference and volume transfer with fitted covariance; keep filled-reference lines distinct from Gaussian-reference means.",
   "proofs": [
    "correlated_hadron_spectrum",
    "openwave_axial_state",
    "openwave_baryon_ordering",
    "openwave_calibrated_hadrons",
    "openwave_common_mass_source",
    "openwave_composite_scale",
    "openwave_dressed_baryon_lines",
    "openwave_hadron_spin_constraints",
    "openwave_vectorlike_flavour",
    "openwave_rest_spectroscopy",
    "openwave_mass_catalogue",
    "openwave_common_electromagnetism"
   ]
  },
  {
   "id": 16,
   "criterion": "Deuteron (binding + quadrupole)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The five-input positive spin-gradient member fits the2.22456640MeV deuteron binding and has a positive graph quadrupole. Both targeted odd channels are above compatible two-nucleon thresholds, but an unassigned spin-three bound channel is retained. The shared-length quadrupole/string-tension test fails in this transfer family; no complete physical deuteron assignment is claimed.",
   "next": "Resolve the extra bound state and derive binding/quadrupole on one physically calibrated spatial interaction; retain failed four-input and fitted fifth-input controls.",
   "proofs": [
    "openwave_nuclear_distance",
    "openwave_nuclear_exchange",
    "openwave_nuclear_refinement",
    "openwave_six_quark",
    "openwave_spin_gradient_nuclei",
    "openwave_colour_string"
   ]
  },
  {
   "id": 17,
   "criterion": "Nuclear structure (levels, halos)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "Exact native projectors resolve all 2520 six-quark colour-singlet states and 240 fixed-projection states into spin,isospin and cell-parity sectors. Complete finite graph spectra/thresholds include the extra odd channel and all low bands. This supplies levels evidence; no physical nuclear binding curve, halo or decay lifetime is derived.",
   "next": "Extend the common spatial action over particle numbers with physical lengths and thresholds; compare all level, halo and lifetime data including extra states.",
   "proofs": [
    "openwave_nuclear_distance",
    "openwave_nuclear_exchange",
    "openwave_nuclear_refinement",
    "openwave_six_quark",
    "openwave_spin_gradient_nuclei",
    "openwave_colour_string"
   ]
  },
  {
   "id": 18,
   "criterion": "Mesons (π, K)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The native strong source fits charged pion as an input. A common spin-current addition cannot simultaneously fit rho and Delta; fitting one rejects the other. A fifth electric-current input fits a neutral scalar at.1349768 GeV without proving neutral-pion identity. Actual meson current has a certified infinite-line finite emission window; kaon/strange physical identity is unproved.",
   "next": "Identify complete pion/kaon states and match held-out neutral/vector/strange channels on one action, preserving all fit ancestry and failed common-spin controls.",
   "proofs": [
    "openwave_calibrated_hadrons",
    "openwave_composite_scale",
    "openwave_hadron_spin_constraints",
    "openwave_meson_memory_window",
    "openwave_meson_ring",
    "openwave_meson_weak_current",
    "openwave_native_composites",
    "pion_mass_readout",
    "quenched_hadron_binding",
    "openwave_colour_string",
    "openwave_spin_gradient_nuclei"
   ]
  },
  {
   "id": 19,
   "criterion": "Dark matter candidate",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The periodic link-penalty-two source has an isolated stationary neutral band and exact location conservation. Known local states plus finite polynomial/polar services prepare its reduced density with success above 0.99999999999639 and stationarity error below 4.000002e-16. It satisfies the finite stable-neutral-state precedent; its exact momentum flatness prevents an inferred moving relativistic mass or cosmological identity.",
   "next": "Reproduce the neutrality, isolation, preparation and exact flatness certificates in-platform. A mobile dark-matter interpretation needs a different source member, coupling and cosmological tests.",
   "proofs": [
    "neutrino_mass_response",
    "openwave_neutral_candidate",
    "openwave_neutral_stationary",
    "openwave_neutral_dispersion",
    "openwave_neutral_preparation"
   ]
  },
  {
   "id": 20,
   "criterion": "Electric force (Coulomb 1/r, electrostatics)",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The native Green energy gives exact constrained separation differences and the static inverse-square limit. A declared axial changed-action member now removes position pinning: all 18 physical states and circulations obey autonomous hopping, exact continuity and an inward electric current-acceleration term -19sqrt(2)/5120. Other hopping and Yukawas are zero; empirical alpha and original ground/clock bounds are not transferred.",
   "next": "Reproduce static Green and autonomous current-force identities in-platform; restore justified full interactions and attach an independently fixed physical strength.",
   "proofs": [
    "native_wilson_maxwell",
    "native_quantum_gauss",
    "maxwell_local_selection",
    "openwave_field_observables",
    "openwave_native_charge_flux",
    "openwave_reference_binding",
    "openwave_current_coulomb",
    "openwave_pinned_coulomb",
    "openwave_autonomous_coulomb"
   ]
  },
  {
   "id": 21,
   "criterion": "Lorentz covariance (+ Coulomb = EM)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The common longitudinal matter member has an exact charged one-particle reducing sector with executed complete Taichi records, speed bound and quadratic mass-shell/record refinement errors. The positive square-root kinetic law is declared; its preferred frame is retained. No unitary finite-grid Lorentz action, interacting contraction or physical continuum is established.",
   "next": "Demonstrate boosted interacting particle readouts and common speed with controlled regulator errors.",
   "proofs": [
    "source_mass_shell",
    "openwave_field_observables",
    "openwave_boosted_records",
    "openwave_single_valley_leptons",
    "openwave_common_electromagnetism"
   ]
  },
  {
   "id": 22,
   "criterion": "Strong force: confinement",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The native Gauss source gives exactly V=(4kappa/3)span on every three-quark singlet, with complete fixed-law chain spectra and a uniform relative-confinement bound. A common physical-length test fails: quadrupole matching gives0.00360537GeV/fm at kappa4, and every positive transferred local coefficient gives tension below0.428678GeV/fm versus the illustrative1GeV/fm benchmark. This is a scoped strong-source result, not the physical tension match.",
   "next": "Construct a common spatial strong source that passes both physical quadrupole and tension scales, with pair creation/string breaking and refinement; do not independently choose lengths for the two observables.",
   "proofs": [
    "colour_deconfinement",
    "openwave_nuclear_distance",
    "quenched_hadron_binding",
    "openwave_colour_string"
   ]
  },
  {
   "id": 23,
   "criterion": "Running coupling",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "Six independent native-seam-derived colour Wilson chains at sides6,8,10 retain 2400 loop records at beta6. Common-block covariance, hot/cold and split-history comparisons and nonlinear influence autocorrelation test finite-scale coupling with explicit volume/sampling effects. These are fixed-bare-action volume controls; continuum matching, physical scale and core onset remain unestablished.",
   "next": "Vary the bare scale with matched reference coupling and controlled volume/correlations, then identify the source particle core and physical renormalization dictionary.",
   "proofs": [
    "source_strong_coupling",
    "yukawa_source_running",
    "openwave_scale_coupling",
    "openwave_coupling_volume"
   ]
  },
  {
   "id": 24,
   "criterion": "Weak force: muon decay",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The unchanged native family current of the declared positive-frequency source produces a lighter charged state and all massive neutrino/antineutrino channels. Exact spin/phase-space factors give the GeV width; a squared-mass spectral bound transfers controlled finite-lifetime relaxation to the massive source. GF is calibrated with muon-lifetime ancestry; the tree lifetime differs by-0.4247percent without radiative corrections. The literal decay mechanism is satisfied without claiming an independent precision lifetime.",
   "next": "Reproduce complete finite decay records and the massive survival certificate in-platform; add electromagnetic radiative terms on the same source and test a held-out normalization. Do not treat GF-calibrated lifetime agreement as an independent prediction.",
   "proofs": [
    "native_weak_current_response",
    "openwave_current_averaging",
    "openwave_dirac_neutral_current",
    "openwave_inclusive_decay",
    "openwave_meson_memory_window",
    "openwave_meson_ring",
    "openwave_neutrino_calibration",
    "openwave_reachable_averaging",
    "openwave_weak_decay",
    "openwave_lepton_widths",
    "openwave_mass_catalogue"
   ]
  },
  {
   "id": 25,
   "criterion": "Weak force: beta decay (n → p)",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The selected calibrated spin-gradient baryon state and unchanged native current execute the energetically allowed electron/antineutral channel with a certified parity-odd full-unitary statistic on3D cubes. Actual native vector/axial contractions give point-contact a,A,B,D, with precision discrepancies retained. Complete energy-line and Fourier-pointer records include every preparation/virtual complement. This satisfies the literal channel-plus-parity minimum; neither a physical878s lifetime nor a continuum pole is inferred.",
   "next": "Reproduce the selected-source3D current, full-Fock parity certificate and complete energy records in-platform. Derive a physical outgoing neutron lifetime and recoil/radiative angular corrections on one reference; do not substitute point-contact coefficients for finite-contact records.",
   "proofs": [
    "openwave_axial_state",
    "openwave_baryon_beta",
    "openwave_baryon_ordering",
    "openwave_baryon_weak_formfactors",
    "openwave_beta_outgoing",
    "openwave_dressed_baryon_lines",
    "openwave_vectorlike_flavour",
    "openwave_beta_angular",
    "openwave_rest_spectroscopy",
    "openwave_spin_gradient_nuclei"
   ]
  },
  {
   "id": 26,
   "criterion": "Gravity: Newton limit (GEM)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The declared positive energy-lapse geometry retains finite attractive pair energies and supplied strength. A complete autonomous native/geometry/wave source derives its actual scalar force by Sylvester differentiation and keeps the finite oscillator boundary correction in Ehrenfest dynamics. No covariant Einstein stress, universal physical G or unrestricted geometry limit is inferred.",
   "next": "Test one fixed matter/geometry mechanism against physical force strength and spatial scaling, and close any claimed regional Einstein/covariant-stress premises on that implementation.",
   "proofs": [
    "matched_einstein_limit",
    "matter_geometry_response",
    "native_gravity_response",
    "openwave_energy_lapse",
    "openwave_gravity_capacity",
    "openwave_native_force",
    "openwave_quantum_geometry",
    "openwave_dynamic_wave",
    "openwave_dynamic_stress"
   ]
  },
  {
   "id": 27,
   "criterion": "Gravity: local metric phenomena",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "Two actual native clock occupations share the 80000-state geometry/wave source and complete arrival records. Their normalized responses differ by31.37–32.87 ppm on the stated finite event, with an exact entanglement witness and a common weak-probe limit. Positive delay and bending remain controlled native observables, without physical seconds or Einstein metric identification.",
   "next": "Close physical clock/length/gravity calibration and universal source-to-metric transfer over spatial/geometry refinement, retaining finite probe dependence.",
   "proofs": [
    "native_clock_comparison",
    "openwave_dynamic_stress",
    "openwave_dynamic_wave",
    "openwave_energy_lapse",
    "openwave_geometry_refinement",
    "openwave_gravity_capacity",
    "openwave_joint_native_clocks",
    "openwave_lapse_observations",
    "openwave_metric_observables",
    "openwave_quantum_geometry",
    "openwave_relational_clock",
    "openwave_wave_deflection",
    "particle_primary_gravity_premises"
   ]
  },
  {
   "id": 28,
   "criterion": "Cosmology: Λ / cosmic acceleration",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "Capacity-density evolution gives exact normalized expansion identities and fixed-capacity w=-1; cosmic capacity and the physical horizon/absolute scale remain unselected.",
   "next": "Predict cosmic capacity or an independent capacity-history observable and retain the physical horizon/falsifier conditions.",
   "proofs": [
    "matched_einstein_limit",
    "openwave_gravity_capacity"
   ]
  },
  {
   "id": 29,
   "criterion": "EM waves (Maxwell)",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "Two transverse Maxwell modes, exact finite-occupation dynamics and independent real-space propagation pass on the declared cochain source; source choices remain explicit, as permitted by the M6 precedent.",
   "next": "Reproduce the declared finite Maxwell evolution and refinement in-platform; attach a common physical particle/source clock only for the stronger joint electromagnetic interpretation.",
   "proofs": [
    "maxwell_local_selection",
    "native_wilson_maxwell",
    "openwave_field_observables"
   ]
  },
  {
   "id": 30,
   "criterion": "Quantum wave equation (Klein-Gordon)",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The full native Clifford kinetic/analyzer source has exact massive second-order dispersion with all bands and valleys. Its90-CAR-per-site Taichi kernel executes inside pinned OpenWave, with complete 180-row doubled symbol, independent dense/Fourier controls and a contractive fourth-order step. At t 1,n20 the record discrepancy is below 6.85e-8 and exact-arithmetic error1.667e-6.",
   "next": "Reproduce the complete kernel in the submission and extend its free-source result to the claimed interacting physical domain; retain lattice and floating-error boundaries.",
   "proofs": [
    "openwave_field_observables",
    "openwave_kinetic_phase_cycle",
    "openwave_lepton_mass_shell",
    "openwave_platform_kernel",
    "source_mass_shell",
    "openwave_boosted_records"
   ]
  },
  {
   "id": 31,
   "criterion": "Orbital quantization (atomic structure)",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The declared Gauss atom produces negative discrete standing-wave levels with independently varied volume and spacing. Its first gap approaches 3/8 and second-shell splitting falls to 0.000410646363. This meets the finite hydrogen-like level criterion; mass, kinetic law and coupling are supplied, with no precision physical-hydrogen claim.",
   "next": "Reproduce the finite Gauss atom in-platform. Physical precision requires volume/spacing enclosures and a source particle/coupling dictionary beyond this finite standing-wave criterion.",
   "proofs": [
    "native_abelian_field_join",
    "openwave_field_observables",
    "openwave_atomic_refinement"
   ]
  }
 ]
};
