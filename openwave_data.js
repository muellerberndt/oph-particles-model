// The 31 criteria of the OpenWave comparison with this project's own estimate for each (page "OpenWave status").
// Written by oph-particles-model/tools/sync_openwave_status.py from the criterion-by-criterion assessment;
// do not edit by hand. status: met, part, fails, untested (the central estimate); low and high: the
// conservative and the permissive reading. proofs: packages model/<name> of the theory repository.
// OpenWave has awarded OPH no cells: every status here is an estimate of this project.
export const OPENWAVE = {
 "assessment_sha256": "94dcb8728e781ee5a9b6c7579a6ec7524f41c161019d6f09b0f24bc466963590",
 "upstream_commit": "ef55175d04737e73c92f33f9f9cf3d17c593da54",
 "evaluated_RER_commit": "3e37845a2f63f09fc0b4a95a776c0b53a1eb2ef4",
 "counts": {
  "met": 12,
  "part": 19,
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
   "reason": "Actual native local Gauss constraints and root flux attach to the positive quantum source through an exact full-CAR isometry. The equal-depth star adds its explicit reference-field energy. A full spatial/photon extension establishes a trapped spin-half band and a trap-release energy threshold16, conditionally0.000509529040252GeV in the unchanged electron unit. Calibration, trapping and physical electron identification are explicit.",
   "next": "Port the complete local-Gauss/energy records; identify the physical charged particle and connect its trap-release threshold to a common spatial source with controlled field/reference energy.",
   "proofs": [
    "native_abelian_field_join",
    "native_block_dirac",
    "openwave_energy_resolved_transport",
    "openwave_factorized_compiler",
    "openwave_full_higgs_floor",
    "openwave_infinite_photon",
    "openwave_kinetic_phase_cycle",
    "openwave_lepton_mass_shell",
    "openwave_localized_rest_packet",
    "openwave_native_quantum_charge",
    "openwave_particle_readouts",
    "openwave_quantum_rotational",
    "openwave_local_gauss_quantum",
    "openwave_spatial_completion"
   ]
  },
  {
   "id": 3,
   "criterion": "de Broglie clock (Zitterbewegung)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The same localized charged packet has prepared autonomous target-Hamiltonian phase with visibility above0.9997728 and a quantitative rest-frequency bound. Dephasing removes its quadratures and a differential scalar drive shifts its frequency. The analyzer compiler uses continuing controls and transfers sampled records, not between-pulse derivatives. Passive onset and drive rigidity are unproved.",
   "next": "Establish passive onset and rigidity for an uncontrolled microscopic source, retaining the reference and comparing frequency with its same-source rest energy.",
   "proofs": [
    "lepton_clock_energy",
    "native_exchange_clock",
    "openwave_localized_rest_packet",
    "openwave_native_beat_clock",
    "openwave_particle_readouts",
    "openwave_relational_clock"
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
    "openwave_reference_binding",
    "spin_dynamical_localization",
    "openwave_spatial_completion"
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
   "reason": "Literal proper cube rotations preserve the kinetic/pairing source and its filled reference. Complete oriented spin-frame records return at2pi; a declared two-copy apolar tensor law returns atpi. The odd source returns at4pi relative to an idle reference. This meets the static field/frame precedent, with no fundamental nematic field or exchange-statistics claim.",
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
   "status": "part",
   "low": "part",
   "high": "met",
   "reason": "One288-CAR Dirac construction joins light neutral masses, the actual native charged current, both helicities and active/sterile records. Its complete144-channel current isometry, controlled free flight and positive unfiltered short-time three-body probability close the neutral/ejecta identity. Central credit is partial because autonomous released-packet relaxation is unproved; the permissive scenario accepts the literal finite native-release minimum. The declared neutral scale is no observed mass or PMNS fit.",
   "next": "Port the complete source and establish autonomous release/propagation on the same interaction and reference, retaining the current-apparatus controls and physical scale ancestry.",
   "proofs": [
    "neutrino_mass_response",
    "openwave_baryon_beta",
    "openwave_current_averaging",
    "openwave_dirac_neutral_current",
    "openwave_inclusive_decay",
    "openwave_meson_ring",
    "openwave_meson_weak_current",
    "openwave_neutral_candidate",
    "openwave_neutral_dispersion",
    "openwave_neutral_flight",
    "openwave_neutral_preparation",
    "openwave_neutral_stationary",
    "openwave_neutral_transfer",
    "openwave_reachable_averaging",
    "openwave_weak_decay"
   ]
  },
  {
   "id": 10,
   "criterion": "Neutrino oscillations (PMNS)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The288-CAR Dirac source uses one gauge-compatible neutral tensor for all144 native release channels and complete production/flight/detection records, including wrong helicities, antiparticles, charged recoil and quantum sterile failures. Three family phases produce changing weak-readout probabilities. The neutral scale and native port word are declared, and observed PMNS angles/splittings are not fitted or matched.",
   "next": "Compare all angles, phases and splittings with data, preserving declared inputs; control autonomous interacting production and propagation without replacing the source by the current instrument.",
   "proofs": [
    "native_flavour_transport",
    "neutrino_mass_observables",
    "openwave_dirac_neutral_current",
    "openwave_neutral_flight",
    "openwave_neutrino_oscillation"
   ]
  },
  {
   "id": 11,
   "criterion": "Lepton mass spectrum (μ, τ)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "Native charged-family mass branches retain the conditional electron-anchored lepton values and9.83ppm muon residual. A separately declared anomaly-cancelling vectorlike extension uses actual hypercharge mixing to give exact unequal up/down light singular gaps while retaining thirteen charged Dirac channels per family, every heavy partner, neutral modes and valleys. Extra architecture and calibration are allowed; the observed complete particle dictionary and interacting poles are not established.",
   "next": "Identify physical species and valley multiplicity on one implementation; derive its interacting energy records and test all retained heavy channels without fitting each output independently.",
   "proofs": [
    "lepton_mass_compiler",
    "lepton_register_round",
    "openwave_composite_scale",
    "openwave_full_higgs_floor",
    "openwave_kinetic_phase_cycle",
    "openwave_lepton_mass_shell",
    "openwave_lepton_phase_cycle",
    "openwave_vectorlike_flavour"
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
    "openwave_vectorlike_flavour"
   ]
  },
  {
   "id": 13,
   "criterion": "Baryons: bound state (p, n)",
   "status": "part",
   "low": "part",
   "high": "met",
   "reason": "Complete native three-quark spin-half colour singlets have strict breakup and perturbation certificates. A common positive baryon-density action fits the actual strong-source proton, neutron and charged-pion eigenenergies with three disclosed calibration inputs. This supplies stable native composites; physical continuum identification and full weak-contact pole masses are unproved. The rejected common-free-scale assignments remain explicit controls.",
   "next": "Port the exact complete composite/charge experiment and establish the same-source physical baryon dictionary and interaction corrections with retained competitors and calibration ancestry.",
   "proofs": [
    "correlated_hadron_spectrum",
    "openwave_baryon_ordering",
    "openwave_calibrated_hadrons",
    "openwave_composite_scale",
    "openwave_native_composites",
    "quenched_hadron_binding"
   ]
  },
  {
   "id": 14,
   "criterion": "Baryons: mass ordering + charge profile",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "Native composites retain exact n>p and positive inner/negative outer graph charge, with zero co-location charge. The vectorlike free-gap member supplies unfitted ordering but fails physical masses and beta threshold. The calibrated hadron member fits n/p ordering and keeps the same native charge operators; this fitted ordering is not an independent prediction or measured neutron form factor.",
   "next": "Compare complete charge form factors and ordering across common spatial refinements, with electromagnetic corrections, empirical length scale and fitted inputs explicit.",
   "proofs": [
    "openwave_baryon_ordering",
    "openwave_calibrated_hadrons",
    "openwave_composite_scale",
    "openwave_vectorlike_flavour",
    "quark_flavour_resolution"
   ]
  },
  {
   "id": 15,
   "criterion": "Baryons: exact masses",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The actual positive native-current strong action calibrates three common coefficients to proton0.93827208943GeV, neutron0.93956542194GeV and charged pion0.13957039GeV. These are exact-source fitted comparisons, supporting partial mass credit under the permitted-calibration precedent. Full weak-contact poles are unproved and reference expectations shift by∓Gme≈∓7.984keV. The failed0.0017100/0.0017696GeV free-gap assignment remains a rejected source control.",
   "next": "Control full interacting pole/rest records, graph/continuum and electromagnetic corrections on the calibrated action; retain fit covariance and test held-out masses without counting fitted values as predictions.",
   "proofs": [
    "correlated_hadron_spectrum",
    "openwave_baryon_ordering",
    "openwave_calibrated_hadrons",
    "openwave_composite_scale",
    "openwave_vectorlike_flavour"
   ]
  },
  {
   "id": 16,
   "criterion": "Deuteron (binding + quadrupole)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The calibrated native action binds its complete fixed-spin-projection +1 S1,I0 six-quark sector with positive intrinsic graph quadrupole. An exact edge-current shift excludes the two-site S0,I1 partner; partner exclusion is not uniform across larger graphs; some certified enclosures overlap breakup and an extra S0,I0 bound state is retained. Held-out binding about0.766497MeV fails the physical2.22456640MeV. Partial credit covers binding/quadrupole mechanisms, not physical deuteron identification.",
   "next": "Test a common spatial/length dictionary and force law against binding magnitude, quadrupole magnitude, partner spectrum and graph refinement; preserve the excluded empirical binding comparison.",
   "proofs": [
    "openwave_nuclear_exchange",
    "openwave_nuclear_refinement",
    "openwave_six_quark"
   ]
  },
  {
   "id": 17,
   "criterion": "Nuclear structure (levels, halos)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "Exact local native colour irreps and complement floors certify every low six-quark level on five fixed two-to-four-cell paths/cycles, with complete dimensions500,1350,2600 and retained extra bound channels. This executes the levels part of the literal criterion. No nuclear binding curve, halo configuration or halo lifetime is derived.",
   "next": "Extend one calibrated interaction across particle numbers and physical spatial refinements; compare levels, thresholds, binding curve and halo lifetimes with all extra states retained.",
   "proofs": [
    "openwave_nuclear_exchange",
    "openwave_nuclear_refinement",
    "openwave_six_quark"
   ]
  },
  {
   "id": 18,
   "criterion": "Mesons (π, K)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "One native action fits the charged-pion energy with the nucleons and retains failed neutral-pion/vector comparisons. Its actual meson charged current has exact volume-independent short-time injection3/512 and a complete six-parent memory kernel. The time720 pair probability changes from.994908 atL2 to.023513 atL8, rejecting an irreversible-rate reading of the small-box peak. Physical kaon/Lambda decay and a meson continuum dictionary are unproved.",
   "next": "Identify complete pion/kaon states and a physical strange baryon channel on one source, controlling outgoing volume, resonance ancestry, neutral splitting and all failed records.",
   "proofs": [
    "openwave_calibrated_hadrons",
    "openwave_composite_scale",
    "openwave_meson_ring",
    "openwave_meson_weak_current",
    "openwave_native_composites",
    "pion_mass_readout",
    "quenched_hadron_binding"
   ]
  },
  {
   "id": 19,
   "criterion": "Dark matter candidate",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The periodic link-penalty-two source has an isolated stationary neutral band and exact location conservation. Known local states plus finite polynomial/polar services prepare its reduced density with success above0.99999999999639 and stationarity error below4.000002e-16. It satisfies the finite stable-neutral-state precedent; its exact momentum flatness prevents an inferred moving relativistic mass or cosmological identity.",
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
   "reason": "The native Green energy gives exact constrained separation differences and the static inverse-square limit. A declared axial changed-action member now removes position pinning: all18 physical states and circulations obey autonomous hopping, exact continuity and an inward electric current-acceleration term -19sqrt(2)/5120. Other hopping and Yukawas are zero; empirical alpha and original ground/clock bounds are not transferred.",
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
   "reason": "A controlled eight-valley relativistic limit and finite dynamical error bounds exist; the regulator has a preferred frame.",
   "next": "Demonstrate boosted interacting particle readouts and common speed with controlled regulator errors.",
   "proofs": [
    "source_mass_shell",
    "openwave_field_observables"
   ]
  },
  {
   "id": 22,
   "criterion": "Strong force: confinement",
   "status": "part",
   "low": "untested",
   "high": "part",
   "reason": "The declared colour Wilson plaquette action follows exactly from the five-level seam trace cost, and its Wilson loops give a measured linear potential. Physical tension scale and native-law transfer remain open; the outside-native Wilson fermion used for hadron comparisons is not needed here.",
   "next": "Regenerate the potential, bind the colour-source mechanism and supply its physical tension calibration/derivation.",
   "proofs": [
    "colour_deconfinement",
    "quenched_hadron_binding"
   ]
  },
  {
   "id": 23,
   "criterion": "Running coupling",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "Six independent native-seam-derived colour Wilson chains at sides6,8,10 retain2400 loop records at beta6. Common-block covariance, hot/cold and split-history comparisons and nonlinear influence autocorrelation test finite-scale coupling with explicit volume/sampling effects. These are fixed-bare-action volume controls; continuum matching, physical scale and core onset remain unestablished.",
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
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "Prepared-domain CAR/Wick bounds control all31464 unfiltered native current words at G=2^-30, certifying coherent peak16/25 within.00628, a2^42 improvement in allowed coupling; G=2^-44 gives error below4e-7. A separate288-CAR Dirac member joins neutral channels and positive short-time release. G=1/64 averaging and transfer to a physical irreversible muon lifetime are unproved.",
   "next": "Establish a controlled physical momentum-volume relaxation window and weak calibration on the full unfiltered source, preserving the separate positive-frequency reservoir result and all apparatus work.",
   "proofs": [
    "native_weak_current_response",
    "openwave_current_averaging",
    "openwave_dirac_neutral_current",
    "openwave_inclusive_decay",
    "openwave_meson_ring",
    "openwave_reachable_averaging",
    "openwave_weak_decay"
   ]
  },
  {
   "id": 25,
   "criterion": "Weak force: beta decay (n → p)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The calibrated hadron source plus actual native semileptonic current executes full neutron-like conversion with complete1400-state charge/398-state spin sectors, including two-electron virtual channels. At source parameter512, electron probability.96855747 and proton-band probability.96246817 retain original prep1/3. Partial credit replaces the rejected free-gap member as the strongest candidate. The bare axial ratio fails; physical interacting endpoint, parity observable and lifetime are unproved.",
   "next": "Repair the held-out axial ratio through a justified state/current construction; control interacting poles, outgoing spectrum, parity and lifetime on that same source. Retain old threshold rejection and fitted strong/free endpoint ancestry.",
   "proofs": [
    "openwave_baryon_beta",
    "openwave_baryon_ordering",
    "openwave_baryon_weak_formfactors",
    "openwave_vectorlike_flavour"
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
   "reason": "A fixed80000-state native/geometry/wave source controls cap-three complete arrival records within.000358 of cap four and yields bounded bending and delay. The same source reads a native Ramsey clock at arrival, giving delay[.0013506,.0013547] calibrated native cycles with every timeout and work record. Finite partial-order-compatible instruments are proved; no physical seconds, infinite geometry limit or Einstein dictionary is supplied.",
   "next": "Derive common physical length/time and gravitational calibration, control full spatial and geometry refinements, and compare universal native clocks and metric observables on one implementation.",
   "proofs": [
    "native_clock_comparison",
    "openwave_dynamic_stress",
    "openwave_dynamic_wave",
    "openwave_energy_lapse",
    "openwave_geometry_refinement",
    "openwave_gravity_capacity",
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
   "reason": "The same full native kinetic/pairing source has exact charged frames with h_k squared=(sum sin(ap_i)^2/a^2+e_k^2)I and executed spatial wave records. The controlled low-momentum limit gives the massive second-order wave law, retaining every valley and spectator. Interacting masses and physical elapsed time are separate claims.",
   "next": "Port the full native wave calculation and finite momentum/spacing bounds; test interaction corrections and physical species only for the stronger joint interpretation.",
   "proofs": [
    "source_mass_shell",
    "openwave_field_observables",
    "openwave_kinetic_phase_cycle",
    "openwave_lepton_mass_shell"
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
