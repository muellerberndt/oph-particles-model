// The 31 criteria of the OpenWave comparison with this project's own estimate for each (page "OpenWave status").
// Written by oph-particles-model/tools/sync_openwave_status.py from the criterion-by-criterion assessment;
// do not edit by hand. status: met, part, fails, untested (the central estimate); low and high: the
// conservative and the permissive reading. proofs: packages model/<name> of the theory repository.
// OpenWave has awarded OPH no cells: every status here is an estimate of this project.
export const OPENWAVE = {
 "assessment_sha256": "0b1ba02b679c2324a2d545955acfd45ceb35f1c854fc4a4832eef52c8a3341ed",
 "upstream_commit": "ef55175d04737e73c92f33f9f9cf3d17c593da54",
 "evaluated_RER_commit": "4483a9ca4b736fa2ea7160d2ba44c2604e5f05f3",
 "counts": {
  "met": 22,
  "part": 9,
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
   "reason": "The native charged addition, retained quantum Gauss reference and memory give an exact stationary two-time rest correlation with frequency m. Eight complete records resolve it with first-measurement work m/2 and no continuing drive. Omitting that measurement leaves stationary one-point expectations constant; differential drives shift the frequency. This does not meet self-starting, frequency-rigid onset.",
   "next": "Execute autonomous single-particle internal onset in shared complete observer records at the same native rest-energy frequency, with perturbation controls and all preparation/reference/battery work. An observer-created phase or a pumped array frequency does not by itself meet this test; a nonzero ensemble mean and an attractor are not additional requirements.",
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
    "openwave_passive_clock_records"
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
   "reason": "Actual native quark charges2/3 and−1/3 couple to a spatial SU3×U1 loop. Exact Haar moments and complete corrected full-Fock instruments give reference-safe fractional phase records, with every colour/flux/failure output. These are controlled Wilson transport records, without an autonomous partial-winding quark texture or observed quark-mass assignment.",
   "next": "Derive a localized partial-winding quark/string excitation and its invariant on the same propagating source, then reproduce the native flux records with that preparation.",
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
    "openwave_strong_step_scaling"
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
    "openwave_baryon_form_factors"
   ]
  },
  {
   "id": 15,
   "criterion": "Baryons: exact masses",
   "status": "met",
   "low": "part",
   "high": "met",
   "reason": "One seven-input positive native hyperfine action fits p=.93827208943,n=.93956542194,pi+=.13957039,rho0=.77526,Delta+=1.232GeV, alongside axial and deuteron-binding data. Complete120/64/2520singlet spectra and instruments are retained. These calibrated native colour-singlet rest energies meet the literal static field-energy minimum; calibration is permitted. Physical resonance poles, common weak/transverse dressing and continuum refinement are separate additional obligations, not requirements silently added to this static row.",
   "next": "Reproduce the same seven-input field action, native quantum numbers, vacuum reference, electron unit and complete static mass records in-platform. Spatial refinement, interacting dressing and the independent axial/radius failures remain explicit full-spectrum tasks.",
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
    "openwave_transverse_completion"
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
   "reason": "The seven-input action resolves all2520 nuclear singlets and every spin/isospin-compatible two-baryon threshold. It calibrates deuteron binding and excludes additional bound nuclear channels in that finite census. Fixed-source longer-chain baryon calculations expose axial drift. A binding curve across nuclear number, halo states and halo lifetimes are absent.",
   "next": "Extend the same current and source to adjacent nuclear numbers, including complete fragment thresholds and outgoing halo detectors. Test volume/graph stability before comparing a binding curve or lifetime.",
   "proofs": [
    "openwave_nuclear_distance",
    "openwave_nuclear_exchange",
    "openwave_nuclear_refinement",
    "openwave_six_quark",
    "openwave_spin_gradient_nuclei",
    "openwave_colour_string",
    "openwave_common_hyperfine_spectrum",
    "openwave_strong_step_scaling"
   ]
  },
  {
   "id": 18,
   "criterion": "Mesons (π, K)",
   "status": "part",
   "low": "part",
   "high": "part",
   "reason": "The complete64-state meson spectrum calibrates charged pion and neutral rho-assigned energies on the common seven-input action. The unused neutral-pion candidate.13827705749GeV misses.1349768GeV by3.30025749MeV. Strange K states and the stated Lambda→p+pi channel are not constructed on this source; finite vector energies do not supply resonance poles or widths.",
   "next": "Add actual strange-family currents and K/Lambda channels with complete quantum numbers and common calibration; execute the allowed strange decay, retain competing channels and test the unused neutral-pion discrepancy.",
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
    "openwave_common_hyperfine_spectrum"
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
   "reason": "A full compact transverse four-cycle couples the complete192-mode matter source to all integer rotor fluxes. Exact Gauss reduction, full-Fock positivity and finite numerical and infinite-tail bounds certify complete position/flux tables. The complete native probe instrument is retained, with its floating weights diagnostic. The charged energy is reference-bound; the finite graph retains a preferred frame and lacks a Lorentz-invariant interacting limit.",
   "next": "Prove a common matter/transverse-photon refinement with covariant current records and controlled interacting boosts on the same source, reference and clock; test contraction rather than importing a kinetic mass shell.",
   "proofs": [
    "source_mass_shell",
    "openwave_field_observables",
    "openwave_boosted_records",
    "openwave_single_valley_leptons",
    "openwave_common_electromagnetism",
    "openwave_transverse_completion"
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
   "reason": "Complete native Gaussian current spectral sums, including all charged pairs and the diamagnetic Ward term, give a scale-dependent quadratic probe coefficient. With supplied infrared alpha, inverse response is about136.9895 at the electron frequency and136.0745 at16 times it on the stated finite regulator. A spectral threshold is not a localized core-radius onset; quark/lepton degeneracy prevents a physical QED/QCD curve.",
   "next": "Derive the coupling from the interacting transverse source with a physically identified charge/core, matched regulators and held-out scale points. Retain contact terms, higher cumulants and common-clock thresholds.",
   "proofs": [
    "source_strong_coupling",
    "yukawa_source_running",
    "openwave_scale_coupling",
    "openwave_coupling_volume",
    "openwave_native_running_response",
    "openwave_strong_step_scaling"
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
   "reason": "Positive ground-relative native energy couples reciprocally to autonomous geometry. Exact mixed derivatives and147 native pair/separation enclosures prove attraction. The harmonic profile and dimensionless strength follow from the declared stiffness. Physical Newton G is not derived, and finite-grid scalar response does not establish the full GEM or continuum1/r² criterion.",
   "next": "Attach the same energy, length and clock units without fitting G; extend the local geometry/stress source and verify the far-field GEM force with finite-volume and refinement bounds.",
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
    "openwave_universal_energy_geometry"
   ]
  },
  {
   "id": 27,
   "criterion": "Gravity: local metric phenomena",
   "status": "part",
   "low": "part",
   "high": "met",
   "reason": "One44032-state source gives all seven native clock redshifts, joint clock/arrival records, positive delay and inward3D bending with complete numerical bounds. Finite-strength clock ratios span about288ppm; a common weak-probe limit is proved. Its wave is a declared massless scalar comparator, not an identified photon, so the central forecast retains partial credit for the observed-light criterion.",
   "next": "Transport the actual transverse electromagnetic modes and detector into this same positive energy/geometry source, derive its spatial metric response and test common clock/light records against the physical local-metric convention.",
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
    "openwave_transverse_completion"
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
