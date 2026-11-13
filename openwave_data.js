// The 31 criteria of the OpenWave comparison with this project's own estimate for each (page "OpenWave status").
// Written by oph-particles-model/tools/sync_openwave_status.py from the criterion-by-criterion assessment;
// do not edit by hand. status: met, part, fails, untested (the central estimate); low and high: the
// conservative and the permissive reading. proofs: packages model/<name> of the theory repository.
// OpenWave has awarded OPH no cells: every status here is an estimate of this project.
export const OPENWAVE = {
 "assessment_sha256": "155804e0f6cc005a29deaf3fbe30abf58a4c65feec5aff9e4e3a279439205542",
 "upstream_commit": "ef55175d04737e73c92f33f9f9cf3d17c593da54",
 "evaluated_RER_commit": "da76715732c8448667b40aef066721d1137055aa",
 "counts": {
  "met": 23,
  "part": 8,
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
   "reason": "The full native pump/loss collision channel has exact rest-mass frequency bands, complete linewidths, energy-conserving batteries and all failed probe records. The first probe creates the measured phase, and the zero-pump control retains it. Thus the calculated oscillation does not establish autonomous onset; a nonzero ensemble mean or an attractor is not imposed as an extra criterion.",
   "next": "Execute a source that develops the required internal phase without the phase-creating first probe, then test complete single-particle onset, source-frequency rigidity and battery/reference work.",
   "proofs": [
    "lepton_clock_energy",
    "native_exchange_clock",
    "openwave_joint_native_clocks",
    "openwave_localized_rest_packet",
    "openwave_native_beat_clock",
    "openwave_particle_readouts",
    "openwave_relational_clock",
    "openwave_single_valley_leptons",
    "openwave_mass_catalogue",
    "openwave_passive_clock_records",
    "openwave_autonomous_clock_channel"
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
   "high": "met",
   "reason": "The complete native (SU3×U1)/Z3 quotient fixes fractional charges and a dual-electric string phase exp(2πin/3)=exp(-2πit/3). Actual Gauss-link shifts, weak exchanges and complete 120/364-state instruments are executed. A zero U1 electric coefficient preserves the strong masses. Central credit is partial because a continuous conjugate-link-angle texture is not proved; permissive credit accepts the executed discrete partial-winding invariant as the literal minimum.",
   "next": "Test an accepted continuous spatial or conjugate-link texture invariant on this same propagating source, or obtain platform acceptance of the proved discrete quotient phase. Free-quark GeV identification is a separate full-spectrum task.",
   "proofs": [
    "defect_particle_classes",
    "native_quark_response",
    "openwave_composite_scale",
    "openwave_full_higgs_floor",
    "openwave_quark_strings",
    "particle_primary_charged_string",
    "openwave_vectorlike_flavour",
    "openwave_colour_string",
    "openwave_common_electromagnetism",
    "openwave_quark_flux_records",
    "openwave_strong_step_scaling",
    "openwave_native_centre_string"
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
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The literal native isospin current on the same seven-input hyperfine action gives m_n−m_p=1.29333251MeV. Its certified neutron charge is zero at radius0, positive at graph radius1/3 and negative at2/3. Complete physical singlet instruments retain success1/120 and all failures. This meets the literal qualitative minimum; the unused proton/neutron charge-radius magnitudes fail for every common length.",
   "next": "Reproduce the same native current, mass ordering and complete radial-charge instruments in-platform. Repair the independent radius-ratio discrepancy and establish the relativistic spatial form-factor map before claiming a full physical nucleon identification.",
   "proofs": [
    "openwave_baryon_ordering",
    "openwave_calibrated_hadrons",
    "openwave_composite_scale",
    "openwave_vectorlike_flavour",
    "quark_flavour_resolution",
    "openwave_rest_spectroscopy",
    "openwave_common_electromagnetism",
    "openwave_common_hyperfine_spectrum",
    "openwave_baryon_form_factors",
    "openwave_hadron_refinement_flow"
   ]
  },
  {
   "id": 15,
   "criterion": "Baryons: exact masses",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "One seven-input native hyperfine action fits the p/n/pi+/rho0/Delta+ rest records, axial magnitude and deuteron binding. Two degree coefficients vanish on its whole two-cell operator and reuse the neutron/axial targets; exact five-band reduction and complete complement bounds enclose the infinite-chain zero-momentum neutron mass and axial response. These are calibrated static/source-band records, without three-dimensional scattering poles or interacting continuum refinement.",
   "next": "Reproduce the complete calibrated static records and the full-complement bulk interval in-platform. Derive the same-source propagating hadron dispersion and weak/transverse pole attachment; test the unused radii and other bulk species.",
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
    "openwave_common_electromagnetism",
    "openwave_common_hyperfine_spectrum",
    "openwave_strong_step_scaling",
    "openwave_baryon_form_factors",
    "openwave_transverse_completion",
    "openwave_hadron_refinement_flow"
   ]
  },
  {
   "id": 16,
   "criterion": "Deuteron (binding + quadrupole)",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "The same seven-input action has m_d≈1.87561294497GeV below p+n by the supplied2.22456640MeV and a recomputed native electric quadrupole. Its single conditional length≈.755908728746fm/cell matches the supplied.285699fm² quadrupole and illustrative1GeV/fm string tension. Every compatible nuclear breakup threshold is retained, with no extra bound nuclear channel. The binding and dimensional matches are disclosed calibrations.",
   "next": "Reproduce the complete2520-state nuclear source, quadrupole instrument and shared-length attachment in-platform. Physical scattering, volume-stable binding and orbital/spin identification require their own tests; the calibrated binding is not a held-out prediction.",
   "proofs": [
    "openwave_nuclear_distance",
    "openwave_nuclear_exchange",
    "openwave_nuclear_refinement",
    "openwave_six_quark",
    "openwave_spin_gradient_nuclei",
    "openwave_colour_string",
    "openwave_common_hyperfine_spectrum",
    "openwave_string_positive_cone",
    "openwave_strong_step_scaling"
   ]
  },
  {
   "id": 17,
   "criterion": "Nuclear structure (levels, halos)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "Exact local exterior characters and colour fusion retain complete 572572/176729280 singlet sectors in three/four-cell boxes. Rational low-band enclosures include all 64/256 quartet coordinates and full higher complements. One range-three coefficient calibrates a triton-like energy while preserving every total-number-at-most-six calibration domain. Both helium comparisons fail. No asymptotic breakup, halo or physical binding curve follows from these boxes.",
   "next": "Derive complete compatible fragment thresholds and outgoing halo records on the same spatial action; repair or explain the held-out helion/alpha failures and control the box-to-infinite-volume attachment.",
   "proofs": [
    "openwave_nuclear_distance",
    "openwave_nuclear_exchange",
    "openwave_nuclear_refinement",
    "openwave_six_quark",
    "openwave_spin_gradient_nuclei",
    "openwave_colour_string",
    "openwave_common_hyperfine_spectrum",
    "openwave_strong_step_scaling",
    "openwave_light_nuclear_curve"
   ]
  },
  {
   "id": 18,
   "criterion": "Mesons (π, K)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The complete native two-family source fits K+=K-=0.493677 and Lambda=1.115683 GeV using two additional strong inputs. A full strong C map preserves the light source, and actual Cabibbo-current records and an unfiltered nonleptonic vertex are executed. The complete outgoing five-body floor is 1.208108251046 GeV; an exact initial Lambda trial upper bound proves the channel closed even with the full weak norm allowance. Sigma/Xi/Omega/K0 and the separate neutral-pion control fail.",
   "next": "Construct common relativistic baryon/meson propagation and sufficient outgoing bandwidth, then execute a genuinely open same-source Lambda-to-proton/pion decay with complete energy/work records. A short-time off-shell vertex cannot replace the threshold test.",
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
    "openwave_spin_gradient_nuclei",
    "openwave_common_hyperfine_spectrum",
    "openwave_strange_composites"
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
   "reason": "The actual covariant Pauli operator and its positive square root retain every native spin/family branch and all compact fluxes. Certified reference-bound GeV intervals and complete position/flux records coexist with a controlled free three-dimensional dispersion limit. The number-preserving nonlocal root supplies neither an interacting Lorentz-covariant field theory nor boosted contraction of the complete charged source.",
   "next": "Prove interacting current/field boost covariance and contraction with common clocks, reference and regulator; control the nonlocal square-root law and infinite-flux/spacing limits without transferring a free dispersion theorem to the interaction.",
   "proofs": [
    "source_mass_shell",
    "openwave_field_observables",
    "openwave_boosted_records",
    "openwave_single_valley_leptons",
    "openwave_common_electromagnetism",
    "openwave_transverse_completion",
    "openwave_dirac_maxwell_refinement",
    "openwave_su2_volume_gap"
   ]
  },
  {
   "id": 22,
   "criterion": "Strong force: confinement",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "Exact full-Fock SU3 fusion expands the allowed positive domain. On the same seven-input action, all40 internal pinned quark/diquark singlets satisfy H_pin(r+1)−H_pin(r)=(4kappa/3)I beyond adjacent sites, including every source term. One shared quadrupole/string attachment gives slope1GeV/fm. This is a calibrated total constrained potential, meeting the literal linear-potential minimum; external position constraints and the fit ancestry are explicit.",
   "next": "Reproduce the total-source constrained potential and all internal/failure records in-platform, preserving the single length. Pair creation, string breaking and a physical continuum scattering potential are additional tests.",
   "proofs": [
    "colour_deconfinement",
    "openwave_nuclear_distance",
    "quenched_hadron_binding",
    "openwave_colour_string",
    "openwave_string_positive_cone",
    "openwave_common_hyperfine_spectrum",
    "openwave_strong_step_scaling"
   ]
  },
  {
   "id": 23,
   "criterion": "Running coupling",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The same dressed Pauli source has a certified nonconstant native current response, exact Ward cancellation and a complete physical core probe. Its measured radius is about 0.12118 cells; suppression stays below 2.94 percent across the entire Brillouin interval. This finite response does not resolve an order-one core-scale onset or a physical QED/QCD running curve. Every reference, phase-pointer and terminal-readout work term is retained.",
   "next": "Resolve the spatial core and its order-one onset on the same interacting current source with matched regulators and held-out physical scale points; retain contact terms, complete flux tails and calibration ancestry.",
   "proofs": [
    "source_strong_coupling",
    "yukawa_source_running",
    "openwave_scale_coupling",
    "openwave_coupling_volume",
    "openwave_native_running_response",
    "openwave_strong_step_scaling",
    "openwave_dressed_core_response"
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
   "reason": "Positive native energy gives a reciprocal attractive geometry response. The same finite photon/clock member has a dimensional comparison using the electron unit and independently strong-calibrated length. That specific attachment fails: the conditional Newton strength is about 1.18e40 times the observed value and photon speed is about 0.00196 c. The attraction supports partial credit, but the physical G/c attachment is tested and obstructed, not untested.",
   "next": "Derive a compatible common matter/geometry Hamiltonian and energy-length-clock map that passes both G and c without tuning G, then establish the far-field GEM law with boundary/refinement errors. Preserve the failed dimensional member as an explicit control.",
   "proofs": [
    "matched_einstein_limit",
    "matter_geometry_response",
    "native_gravity_response",
    "openwave_energy_lapse",
    "openwave_gravity_capacity",
    "openwave_native_force",
    "openwave_quantum_geometry",
    "openwave_dynamic_wave",
    "openwave_dynamic_stress",
    "openwave_universal_energy_geometry",
    "openwave_transverse_gravity"
   ]
  },
  {
   "id": 27,
   "criterion": "Gravity: local metric phenomena",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "One autonomous source contains all 540 transverse Maxwell modes, quantum geometry and native clocks. Complete joint records certify inward deflection, positive arrival delay and both native same-record redshift ratios, meeting the literal local-metric observable minimum. Central validation is a local forecast for this finite constitutive photon mechanism; no canonical metric-QED, measured lensing angle, Einstein continuum or physical G is inferred. The independent G/c attachment fails.",
   "next": "Reproduce the complete transverse photon/clock/geometry experiment in-platform. Additional physical completion requires a compatible metric-QED law, common units and controlled continuum/refinement, retaining all failures and the excluded G/c attachment.",
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
    "particle_primary_gravity_premises",
    "openwave_universal_energy_geometry",
    "openwave_common_gravity_records",
    "openwave_transverse_completion",
    "openwave_transverse_gravity"
   ]
  },
  {
   "id": 28,
   "criterion": "Cosmology: Λ / cosmic acceleration",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The declared finite capacity law H=epsilon V/k gives mechanical pressure P=-rho, exact volume/capacity work and an explicit energy exchange when k changes. A fixed-input Friedmann comparison uses all fifteen chronometer measurements with correlated covariance; exact bounds give chi-square about 6.19134 for the primary reduction and 7.97952 for its alternative. These shared-data reductions are not independent, and supplied Planck parameters do not determine cosmic capacity or a physical horizon.",
   "next": "Select and test a physical horizon/capacity amplitude without reusing the measured cosmological constant; separate mechanical pressure from the capacity-exchange effective equation of state and test an independently specified capacity history.",
   "proofs": [
    "matched_einstein_limit",
    "openwave_gravity_capacity",
    "openwave_capacity_stress"
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
