"""Project verified RER particle results for the page "Finite constructions" (Results group).

The overlay can update an existing published site without rebuilding unrelated
simulation files. Every displayed value is projected from a bound source receipt.
The Journey page shows the story and its maps, with navigation to Results.
The duplicate embedded matches wall is removed. The viewer page
constructions.js imports journey_results.js and renders it.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import subprocess
from fractions import Fraction
from pathlib import Path
from ninth_results import project as ninth_projection
from tenth_results import project as tenth_projection
from eleventh_results import project as eleventh_projection
from twelfth_results import project as twelfth_projection
from thirteenth_results import project as thirteenth_projection
from fourteenth_results import project as fourteenth_projection
from fifteenth_results import project as fifteenth_projection
from sixteenth_results import project as sixteenth_projection
from seventeenth_results import project as seventeenth_projection

ROOT=Path(__file__).resolve().parents[1]
RER=ROOT.parent/'reverse-engineering-reality'
EXTRA=ROOT/'tools/site_extra'
SOURCES={
 'lambda_spectral_measure':'model/openwave_lambda_spectral_measure/results.json',
 'finite_phase_clock':'model/openwave_finite_phase_clock/results.json',
 'localized_quark_record':'model/openwave_localized_quark_record/results.json',
 'nuclear_em_transfer':'model/openwave_nuclear_em_transfer/results.json',
 'fock_field_transport':'model/openwave_fock_field_transport/results.json',
 'energy_schur':'model/openwave_energy_schur/results.json',
 'collective_finite_strength':'model/openwave_collective_finite_strength/results.json',
 'gravity_noise_normalization':'model/openwave_gravity_noise_normalization/results.json',
 'capacity_normalization_transfer':'model/openwave_capacity_normalization_transfer/results.json',

 'full_strong_current':'model/openwave_full_strong_current/results.json',
 'lambda_wavepacket':'model/openwave_lambda_wavepacket/results.json',
 'cluster_weyl_sequence':'model/openwave_cluster_weyl_sequence/results.json',
 'refined_haar_source':'model/openwave_refined_haar_source/results.json',
 'refined_haar_spectrum':'model/openwave_refined_haar_spectrum/results.json',
 'haar_memory_closure':'model/openwave_haar_memory_closure/results.json',
 'tensor_record_transport':'model/openwave_tensor_record_transport/results.json',
 'collective_gravity_strength':'model/openwave_collective_gravity_strength/results.json',
 'capacity_transfer':'model/openwave_capacity_transfer/results.json',
 'uniform_pole_bands':'model/openwave_uniform_pole_bands/results.json',
 'normalizable_particle_records':'model/openwave_normalizable_particle_records/results.json',
 'scattering_current_support':'model/openwave_scattering_current_support/results.json',
 'haar_coupling_flow':'model/openwave_haar_coupling_flow/results.json',
 'cubic_haar_source':'model/openwave_cubic_haar_source/results.json',
 'gauge_refinement_clock':'model/openwave_gauge_refinement_clock/results.json',
 'staggered_ward':'model/openwave_staggered_ward/results.json',
 'replicated_geometry':'model/openwave_replicated_geometry/results.json',
 'capacity_perturbations':'model/openwave_capacity_perturbations/results.json',

 'packet':'model/openwave_localized_rest_packet/results.json',
 'comparison':'model/lepton_cycle/physical_comparison.json',
 'magnetic':'model/openwave_rotational_g_limit/results.json',
 'neutral':'model/openwave_neutral_preparation/results.json',
 'flatness':'model/openwave_neutral_dispersion/results.json',
 'radiation':'model/openwave_radiative_pair/results.json',
 'compiler':'model/openwave_factorized_compiler/results.json',
 'higgs':'model/openwave_full_higgs_floor/results.json',
 'gravity':'model/openwave_energy_lapse/results.json',
 'clocks':'model/openwave_lapse_observations/results.json',
 'quantum':'model/openwave_quantum_rotational/results.json',
 'oscillation':'model/openwave_neutrino_oscillation/results.json',
 'weak':'model/openwave_weak_decay/results.json',
 'transfer':'model/openwave_neutral_transfer/results.json',
 'native_charge':'model/openwave_native_quantum_charge/results.json',
 'infinite_photon':'model/openwave_infinite_photon/results.json',
 'quantum_larmor':'model/openwave_quantum_larmor/results.json',
 'neutral_flight':'model/openwave_neutral_flight/results.json',
 'inclusive_decay':'model/openwave_inclusive_decay/results.json',
 'composites':'model/openwave_native_composites/results.json',
 'composite_scale':'model/openwave_composite_scale/results.json',
 'dynamic_geometry':'model/openwave_quantum_geometry/results.json',
 'wave_deflection':'model/openwave_wave_deflection/results.json',
 'local_gauss_quantum':'model/openwave_local_gauss_quantum/results.json',
 'infinite_current':'model/openwave_infinite_current/results.json',
 'spatial_completion':'model/openwave_spatial_completion/results.json',
 'current_averaging':'model/openwave_current_averaging/results.json',
 'meson_weak_current':'model/openwave_meson_weak_current/results.json',
 'vectorlike_flavour':'model/openwave_vectorlike_flavour/results.json',
 'baryon_ordering':'model/openwave_baryon_ordering/results.json',
 'dynamic_wave':'model/openwave_dynamic_wave/results.json',
 'dynamic_stress':'model/openwave_dynamic_stress/results.json',
 'six_quark':'model/openwave_six_quark/results.json',
 'calibrated_hadrons':'model/openwave_calibrated_hadrons/results.json',
 'nuclear_exchange':'model/openwave_nuclear_exchange/results.json',
 'nuclear_refinement':'model/openwave_nuclear_refinement/results.json',
 'baryon_weak_formfactors':'model/openwave_baryon_weak_formfactors/results.json',
 'baryon_beta':'model/openwave_baryon_beta/results.json',
 'reachable_averaging':'model/openwave_reachable_averaging/results.json',
 'meson_ring':'model/openwave_meson_ring/results.json',
 'dirac_neutral_current':'model/openwave_dirac_neutral_current/results.json',
 'geometry_refinement':'model/openwave_geometry_refinement/results.json',
 'relational_clock':'model/openwave_relational_clock/results.json',
 'axial_state':'model/openwave_axial_state/results.json',
 'dressed_baryon_lines':'model/openwave_dressed_baryon_lines/results.json',
 'hadron_spin_constraints':'model/openwave_hadron_spin_constraints/results.json',
 'nuclear_distance':'model/openwave_nuclear_distance/results.json',
 'neutrino_calibration':'model/openwave_neutrino_calibration/results.json',
 'beta_parity':'model/openwave_beta_outgoing/results.json',
 'meson_memory_window':'model/openwave_meson_memory_window/results.json',
 'common_mass_source':'model/openwave_common_mass_source/results.json',
 'joint_native_clocks':'model/openwave_joint_native_clocks/results.json',
 'platform_kernel':'model/openwave_platform_kernel/results.json',
 'beta_angular':'model/openwave_beta_angular/results.json',
 'lepton_widths':'model/openwave_lepton_widths/results.json',
 'neutrino_matter':'model/openwave_neutrino_matter/results.json',
 'spin_gradient_nuclei':'model/openwave_spin_gradient_nuclei/results.json',
 'rest_spectroscopy':'model/openwave_rest_spectroscopy/results.json',
 'colour_string':'model/openwave_colour_string/results.json',
 'common_electromagnetism':'model/openwave_common_electromagnetism/results.json',
 'boosted_records':'model/openwave_boosted_records/results.json',
 'single_valley_leptons':'model/openwave_single_valley_leptons/results.json',
 'mass_catalogue':'model/openwave_mass_catalogue/results.json',
 'string_positive_cone':'model/openwave_string_positive_cone/results.json',
 'common_hyperfine_spectrum':'model/openwave_common_hyperfine_spectrum/results.json',
 'strong_step_scaling':'model/openwave_strong_step_scaling/results.json',
 'transverse_completion':'model/openwave_transverse_completion/results.json',
 'native_running_response':'model/openwave_native_running_response/results.json',
 'passive_clock_records':'model/openwave_passive_clock_records/results.json',
 'quark_flux_records':'model/openwave_quark_flux_records/results.json',
 'universal_energy_geometry':'model/openwave_universal_energy_geometry/results.json',
 'common_gravity_records':'model/openwave_common_gravity_records/results.json',
 'baryon_form_factors':'model/openwave_baryon_form_factors/results.json',
 'pure_su2_source':'model/openwave_pure_su2_source/results.json',
 'su2_transfer':'model/openwave_su2_transfer/results.json',
 'su2_spectral':'model/openwave_su2_spectral/results.json',
 'strange_composites':'model/openwave_strange_composites/results.json',
 'light_nuclear_curve':'model/openwave_light_nuclear_curve/results.json',
 'hadron_refinement_flow':'model/openwave_hadron_refinement_flow/results.json',
 'native_centre_string':'model/openwave_native_centre_string/results.json',
 'dressed_core_response':'model/openwave_dressed_core_response/results.json',
 'autonomous_clock_channel':'model/openwave_autonomous_clock_channel/results.json',
 'dirac_maxwell_refinement':'model/openwave_dirac_maxwell_refinement/results.json',
 'transverse_gravity':'model/openwave_transverse_gravity/results.json',
 'su2_volume_gap':'model/openwave_su2_volume_gap/results.json',
 'capacity_stress':'model/openwave_capacity_stress/results.json',
 'baryon_dispersion':'model/openwave_baryon_dispersion/results.json',
 'cluster_bandwidth':'model/openwave_cluster_bandwidth/results.json',
 'nuclear_isospin':'model/openwave_nuclear_isospin/results.json',
 'clock_phase_resource':'model/openwave_clock_phase_resource/results.json',
 'quotient_homotopy':'model/openwave_quotient_homotopy/results.json',
 'resolved_core':'model/openwave_resolved_core/results.json',
 'dirac_field_connection':'model/openwave_dirac_field_connection/results.json',
 'gravity_unit_constraint':'model/openwave_gravity_unit_constraint/results.json',
 'horizon_capacity':'model/openwave_horizon_capacity/results.json',
 'su2_propagation':'model/openwave_su2_propagation/results.json',
 'baryon_poles':'model/openwave_baryon_poles/results.json',
 'pole_weak_current':'model/openwave_pole_weak_current/results.json',
 'strange_shell_current':'model/openwave_strange_shell_current/results.json',
 'coupled_haar_source':'model/openwave_coupled_haar_source/results.json',
 'coupled_haar_spectrum':'model/openwave_coupled_haar_spectrum/results.json',
 'euclidean_refinement':'model/openwave_euclidean_refinement/results.json',
 'source_ward':'model/openwave_source_ward/results.json',
 'einstein_error':'model/openwave_einstein_error/results.json',
 'radiation_capacity':'model/openwave_radiation_capacity/results.json',



}
CONSUMER='constructions.js'        # the viewer page that renders journey_results.js
IMPORT="import('./journey_results.js')"
LEGACY_HOOK='mountJourneyResults(host)'  # the retired hook inside journey.js

def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()

def read_bound(path,rer):
 value=json.loads(path.read_text())
 allowed={
  'oph.full_Haar_pure_SU2_finite_cube.v1':'PURE_SU2_FULL_LINK_SOURCE_AND_FINITE_CUBE_GAP',
  'oph.pure_SU2_positive_transfer_same_clock.v1':'FULL_COMPACT_GAUGE_TRANSFER_POSITIVITY_AND_COMMON_CLOCK',
  'oph.untruncated_SU2_plaquette_spectral.v1':'FULL_SU2_CHARACTER_GAPS_AND_CURVATURE_CORRELATIONS'}
 if 'verdict'in value and not value['verdict'].startswith('PASS'):
  if allowed.get(value.get('schema'))!=value['verdict']:raise ValueError(f'failed source: {path}')
  if value.get('scope',{}).get('Clay_problem_solved') is not False:raise ValueError(f'changed pure-gauge scope: {path}')
 bindings=value.get('source_sha256',value.get('input_sha256',value.get('source_bindings')))
 if not isinstance(bindings,dict)or not bindings:raise ValueError(f'unbound source: {path}')
 for name,expected in bindings.items():
  p=(rer/name).resolve()
  if not p.is_relative_to(rer.resolve())or digest(p)!=expected:raise ValueError(f'stale source: {name}')
 return value

def project(rer=RER):
 receipts={key:read_bound(rer/path,rer)for key,path in SOURCES.items()}
 revision=subprocess.run(['git','rev-parse','HEAD'],cwd=rer,check=True,capture_output=True,text=True).stdout.strip()
 if len(revision)!=40 or any(c not in '0123456789abcdef'for c in revision):raise ValueError('invalid source revision')
 required=set(SOURCES.values())
 for receipt in receipts.values():
  required.update(receipt.get('source_sha256',receipt.get('input_sha256',receipt.get('source_bindings',{}))))
 names=sorted(required)
 committed=set(subprocess.run(['git','ls-tree','-r','--name-only',revision,'--',*names],cwd=rer,check=True,capture_output=True,text=True).stdout.splitlines())
 changed=subprocess.run(['git','diff','--name-only',revision,'--',*names],cwd=rer,check=True,capture_output=True,text=True).stdout.strip()
 if committed!=required or changed:raise ValueError('Journey evidence must be committed at its linked source revision')
 packet=receipts['packet'];p=packet['near_rest_localized_source'];c=receipts['comparison']
 g=next(row for row in receipts['magnetic']['rows']if row['mass']==16384)
 n=receipts['neutral']['finite_filter_and_polar_service'];radiation=receipts['radiation']
 energy=float(Fraction(p['mean_relative_rest_energy_excess_upper']))*1e6
 outside=float(Fraction(p['conditional_outside_cube_uniform_time_upper']))
 precession=float(Fraction(g['analytic_rational_bounds']['quasistatic_precession_g_error_from_two']))
 assert energy<.003014 and outside<1.103e-7 and precession<.004863
 assert n['corrected_original_input_success_decimal_lower']>.99999999999639
 assert p['source_time_horizon']==10**9 and p['length']==2**30 and p['periodic_side']==4*(2**30+1)
 assert float(Fraction(g['analytic_rational_bounds']['static_g_error_from_two']))<.001832
 assert g['coupling']==16384**-6
 assert n['conditional_reduced_density_trace_error_decimal_upper']<2.000001e-16
 assert n['source_H_evaluations_per_success_vector']==30546
 flat=receipts['flatness']['neutral_band_flatness_and_records']
 assert flat['exact_all_order_momentum_splitting']=='0'
 assert flat['reduced_algebra']['all_momentum_sector_ranks']==[128]*8
 assert flat['stationary_neutral_energy_reinterpreted_as_a_moving_particle_mass']is False
 assert p['finite_full_Fock_compiler']['full_enlarged_volume_time_evolution_executed']is False
 assert p['autonomous_clock']['passive_self_start_proved']is False
 assert packet['calibration']['observed_interacting_lepton_identification_proved']is False
 caps=[]
 for cap in (1,2):
  experiment=radiation['complete_cap_experiments'][str(cap)]
  pair=next(r for r in experiment['pair']if r['time_in_inverse_native_mass']==50)
  vacuum=next(r for r in experiment['vacuum_control']if r['time_in_inverse_native_mass']==50)
  caps.append({'cap':cap,'pair_probability':pair['two_photon_no_fermion_probability'],
               'vacuum_probability':vacuum['two_photon_no_fermion_probability']})
 return {
  'schema':'oph.journey_verified_results.v1',
  'date':'2026-11-13',
  'source_revision':revision,
  'source_repository':f'https://github.com/FloatingPragma/observer-patch-holography/blob/{revision}/',
  'scope':'Conditional finite constructions; calibration, preparation and physical identification are separate.',
  'leptons':{
   'rows':[{'name':r['species'],'mass_GeV':r['electron_anchored_GeV']}for r in packet['calibration']['rows']],
   'muon_electron_ratio':c['architecture']['muon_electron_ratio'],
   'tau_electron_ratio':c['architecture']['tau_electron_ratio'],
   'muon_residual_ppm':c['muon']['relative_residual_ppm'],
   'tau_residual_ppm':c['tau']['relative_residual_ppm'],
   'comparison_type':c['exposure']['comparison_type'],
   'empirical_anchor':'CODATA 2022 electron energy; muon and tau are comparison targets only.',
   'physical_interacting_identity_proved':False,
  },
  'localized':{'energy_excess_ppm_upper':energy,'outside_probability_upper':outside,
   'time_horizon':p['source_time_horizon'],'support_side':p['length'],'periodic_side':p['periodic_side'],
   'visibility_lower':float(Fraction(p['autonomous_clock']['visibility_uniform_lower'])),
   'full_volume_enumerated':False,'bound_scope':'Analytic finite-carrier certificate with smaller-box execution; the full analyzer compiler uses continuing controls.'},
  'magnetic':{'precession_g_error_upper':precession,'mass_parameter':g['mass'],
   'static_g_error_upper':float(Fraction(g['analytic_rational_bounds']['static_g_error_from_two'])),
   'coupling_rule':'kappa=m^-6','physical_mass_or_alpha_matched':False},
  'neutral':{'success_probability_lower':n['corrected_original_input_success_decimal_lower'],
   'reduced_density_trace_error_upper':n['conditional_reduced_density_trace_error_decimal_upper'],
   'formal_H_applications':n['source_H_evaluations_per_success_vector'],
   'momentum_spectrum':'exactly flat across all eight momenta on the periodic side-two source',
   'observed_neutrino_identity_proved':False},
  'radiation':{'time_in_inverse_native_mass':50,'caps':caps,
   'full_evolution_probability_lower':radiation['exact_short_time_certificate']['original_two_photon_radiation_probability_lower_float'],
   'lower_bound_time_in_inverse_native_mass':'1e-8','physical_scattering_rate_proved':False},
  **frontier(receipts),
  'previous_tasks':previous_tasks(receipts),
  'reference_tasks':reference_tasks(receipts),
  'current_tasks':current_tasks(receipts),
  'latest_tasks':ninth_projection(receipts),
  'particle_results':tenth_projection(receipts),
  'frontier_results':eleventh_projection(receipts),
  'current_results':twelfth_projection(receipts),
  'completion_results':thirteenth_projection(receipts),
  'source_completion':fourteenth_projection(receipts),
  'normalizable_completion':fifteenth_projection(receipts),
  'complete_dynamics':sixteenth_projection(receipts),
  'operational_results':seventeenth_projection(receipts),
  'source_sha256':{path:digest(rer/path)for path in SOURCES.values()},
  'source_paths':SOURCES,
 }

def current_tasks(receipts):
 hadron=receipts['calibrated_hadrons'];form=receipts['baryon_weak_formfactors'];beta=receipts['baryon_beta']
 assert hadron['three_calibrated_coefficients']==['mbar','delta','A']
 assert all(r['status']=='CALIBRATION_INPUT_REPRODUCED_NOT_INDEPENDENT_PREDICTION'for r in hadron['fits'])
 assert all(r['physical_assignment_supported']is False for r in hadron['held_out_comparisons'])
 assert form['observed_axial_ratio_reproduced']is False
 assert form['native_vector_charge_normalization_proved']is True
 b=next(r for r in beta['records']if r['source_parameter']==512)
 assert beta['calibrated_threshold']['target_independent_mass_prediction']is False
 assert beta['calibrated_threshold']['virtual_two_electron_channel_retained']is True
 assert beta['calibrated_threshold']['on_shell_two_electron_channel_allowed']is False
 nuclear=receipts['nuclear_exchange'];refinement=receipts['nuclear_refinement'];averaging=receipts['reachable_averaging']
 assert nuclear['physical_deuteron_binding_reproduced']is False
 assert all(not r['bound_below_two_baryons']for r in nuclear['complete_spin_zero_isotriplet_partners'])
 assert averaging['source_truncation_or_added_penalty']is False
 assert averaging['source_unchanged_except_supplied_G']is True
 assert averaging['physical_weak_coupling_lifetime_or_irreversibility_claimed']is False
 assert len(refinement['same_source_graphs'])==5
 ring=receipts['meson_ring'];dirac=receipts['dirac_neutral_current'];dm=dirac['conditional_GeV_catalogue']
 assert ring['physical_strange_decay_lifetime_or_observed_meson_identity_claimed']is False
 assert ring['initial_quadratic_emission_coefficient_exact']=='3/512'
 assert dm['declared_neutral_to_charged_mass_scale']=='1/4294967296'
 assert dm['physical_neutrino_mass_identity_or_oscillation_fit_claimed']is False
 assert dm['active_and_sterile_chiralities_share_each_Dirac_mass']is True
 assert dm['source_scale_or_mixing_fitted_to_neutrino_data']is False
 assert all(r['independent_sterile_mass_branch']is False for r in dm['rows'])
 assert dirac['same_native_current_added_sterile_entries_zero']is True
 geometry=receipts['geometry_refinement'];clock=receipts['relational_clock']
 assert geometry['infinite_geometry_cap_or_spatial_continuum_limit_proved']is False
 assert geometry['same_matter_field_reference_and_observer_source']is True
 assert clock['same_master_source']=='model/openwave_geometry_refinement/source.py'
 assert clock['physical_seconds_Einstein_proper_time_or_fundamental_global_clock_assumed']is False
 assert clock['phase_statistic_is_a_circular_coherence_statistic_not_the_mean_arrival_time']is True
 assert clock['finite_sampling_guarantee']['large_repetition_experiment_executed']is False
 return {
  'task_count':10,
  'calibrated_hadrons':{'fits':hadron['fits'],'held_out':hadron['held_out_comparisons'],
   'fitted_coefficients':hadron['three_calibrated_coefficients'],
   'beta_available_energy_GeV':float(Fraction(hadron['exact_beta_available_energy_GeV'])),
   'independent_mass_prediction':False},
  'nuclear_exchange':{'energy_GeV_interval':[float(Fraction(v))for v in nuclear['stationary_energy_GeV_interval']],
   'binding_lower_GeV':float(Fraction(nuclear['binding_lower_GeV'])),
   'deuteron_reference_binding_GeV':float(Fraction(nuclear['held_out_deuteron_binding_GeV'])),
   'partner_threshold_gaps':[float(Fraction(r['ground_above_same_charge_two_baryon_threshold_lower']))for r in nuclear['complete_spin_zero_isotriplet_partners']],
   'quadrupole_interval':[float(Fraction(v))for v in nuclear['complete_original_records']['stationary_ground_quadrupole_interval']],
   'physical_deuteron_fit':False},
  'nuclear_refinement':{'graphs':[{'graph':r['graph'],'vertices':r['vertices'],
   'complete_low_dimension':r['nuclear_total_low_dimension_including_magnetic_components'],
   'binding_channels':[{'spin':c['spin'],'isospin':c['isospin'],'strictly_bound':c['strictly_bound'],
    'excluded_below_two_baryons':c['excluded_below_two_baryons'],
    'binding_GeV_interval':[float(Fraction(v))for v in c['binding_GeV_interval']]}for c in r['binding_channels']]}for r in refinement['same_source_graphs']],
   'unassigned_bound_channel':refinement['additional_unassigned_bound_channel']},
  'reachable_averaging':{'scenarios':averaging['coupling_scenarios'],'native_CAR_modes':averaging['full_native_CAR_modes'],
   'source_truncation_or_added_penalty':False,'physical_weak_lifetime':False},
  'meson_ring':{'ring_probabilities':[{'length':r['ring_sites'],
    'probability':next(t for t in r['complete_coarse_time_records']if t['time']==720)['conditional_pair_probability'],
    'original_input_probability':next(t for t in r['complete_coarse_time_records']if t['time']==720)['original_input_pair_probability'],
    'preparation_success':r['prepared_parent_success_probability']}for r in ring['finite_rings']],
   'initial_quadratic_emission_coefficient':ring['initial_quadratic_emission_coefficient_exact'],
   'physical_meson_lifetime':False},
  'dirac_neutral_current':{'masses_GeV':[float(r['conditional_neutrino_and_antineutrino_GeV'])for r in dm['rows']],
   'masses_eV':[float(r['conditional_eV'])for r in dm['rows']],
   'neutral_to_charged_mass_scale':dm['declared_neutral_to_charged_mass_scale'],
   'autonomous_short_time_probability_interval':[float(Fraction(v))for v in dirac['autonomous_unfiltered_short_time_control']['total_three_body_probability_interval']],
   'physical_neutrino_fit':False,'independent_heavy_sterile_particles':False},
  'formfactors':{'gV':form['exact_local_current_algebra']['gV'],
   'axial_ratio_interval':form['finite_hopping_certificate']['axial_ratio_interval'],
   'comparison_magnitude':form['comparison']['axial_ratio_magnitude'],
   'comparison_uncertainty':form['comparison']['quoted_uncertainty'],'physical_axial_fit':False},
  'beta':{'source_parameter':b['source_parameter'],'conditional_one_electron_probability':b['conditional_electron_count_probability'][1],
   'unconditional_one_electron_probability':b['original_electron_count_probability'][1],
   'preparation_success_probability':b['preparation_success_probability'],
   'endpoint_GeV':beta['calibrated_threshold']['electron_endpoint_GeV'],
   'complete_charge_sector_dimension':beta['construction']['complete_charge_zero_dimension'],
   'filled_neutral_reference_contact_shifts':beta['filled_neutral_reference_contact_shifts'],
   'virtual_two_electron_channels_retained':True,'observed_neutron_lifetime_matched':False},
  'geometry_refinement':{'master_dimension':geometry['full_source_dimension'],
   'cap_three_arrival_TV_upper':next(r for r in geometry['certified_compression_comparisons']if r['nested_cap']==3)['full_arrival_instrument_reference_stable_TV_upper'],
   'delay_interval':geometry['master_same_source_arrival_delay_interval'],
   'bending_interval':geometry['master_time4_bending_interval'],
   'infinite_cap_limit_proved':False,'compression_domain_is_the_right_cell_clock_superposition':False},
  'relational_clock':{'delay_cycles_interval':clock['delay_in_calibrated_native_clock_cycles_interval'],
   'arrival_phase_response_cycles_interval':clock['actual_aggregate_arrival_clock_phase_response_cycles_interval'],
   'arrival_clock_visibilities':[r['total_arrival_clock_visibility']for r in clock['complete_experiments']],
   'sampling_trials_per_background':clock['finite_sampling_guarantee']['independent_prepared_trials_per_background'],
   'sampling_phase_cycles_interval':clock['finite_sampling_guarantee']['positive_arrival_phase_response_cycles_interval_with_sampling'],
   'physical_proper_time_identified':False},
 }

def reference_tasks(receipts):
 gauss=receipts['local_gauss_quantum'];pair=gauss['same_quantum_charged_block']
 assert gauss['all_reference_and_flux_outcomes_retained']is True
 assert pair['star_field_energy_is_intrinsic_isolated_electron_rest_mass']is False
 infinite=receipts['infinite_current'];spatial=receipts['spatial_completion']['analytic_full_source']
 assert infinite['all_photon_field_reference_and_failure_outputs_retained']is True
 assert spatial['untrapped_threshold_is_normalizable_eigenstate']is False
 assert spatial['translation_invariant_physical_electron_dispersion_derived']is False
 averaging=receipts['current_averaging'];a=averaging['uniform_complete_source_comparison']
 assert averaging['added_occupation_penalty_or_two_state_source']is False
 assert averaging['all_native_current_spectators_retained']is True
 assert a['original_G_1_over_64_averaging_certified']is False
 meson=receipts['meson_weak_current'];mr=next(r for r in meson['complete_records']if r['source_time']==720)
 assert meson['physical_kaon_decay_or_lifetime_identified']is False
 assert len(meson['empirical_hadron_mass_lifetime_or_mixing_inputs'])==0
 flavour=receipts['vectorlike_flavour'];baryon=receipts['baryon_ordering']
 assert flavour['extra_branches_retained']==6
 assert flavour['source_parameters']=={'heavy_mass':1,'hypercharge_mixing':1,'neutral_Higgs_background_norm':1}
 assert baryon['exact_beta_threshold_obstruction']['n_to_p_e_antinu_ground_channel_energetically_allowed']is False
 wave=receipts['dynamic_wave'];stress=receipts['dynamic_stress'];clocks=stress['dressed_clocks']
 assert wave['native_geometry_wave_reference_and_clock_shared']is True
 assert wave['geometry_refresh_or_static_profile_service_used']is False
 assert wave['physical_G_or_observed_lensing_or_Einstein_dynamics_claimed']is False
 assert stress['stress_backreaction']['finite_CCR_boundary_correction_discarded']is False
 assert clocks['exact_universal_finite_strength_clock_ratio']is False
 nuclear=receipts['six_quark'];units=nuclear['conditional_common_electron_unit']
 assert nuclear['inserted_composite_projector_or_transition_action']is False
 assert units['physical_deuteron_mass_or_binding_identified']is False
 return {
  'task_count':10,
  'gauss':{'pair_energy_GeV':pair['conditional_GeV_using_unchanged_electron_unit'],
   'electric_energy_increment':pair['star_exact_electric_energy_increment'],'intrinsic_electron_mass':False},
  'infinite_current':{'g_interval':infinite['rest_energy_normalized_infinite_g_interval'],
   'current_interval':infinite['actual_infinite_current_derivative_interval'],
   'remainder_upper':infinite['global_differentiated_remainder_upper']},
  'spatial':{'threshold_GeV_interval':spatial['threshold_GeV_interval_unchanged_cap_two_electron_unit'],
   'threshold_source':spatial['untrapped_infimum_exact'],'normalizable_threshold_state':False,
   'spin_band_domain':spatial['uniform_exact_spin_half_band_domain']},
  'averaging':{'peak_interval':a['original_receiver_peak_probability_decimal_interval'],
   'ideal_peak':averaging['exact_resonant_orbit']['first_peak_receiver_probability'],
   'coupling':a['declared_source_G'],'full_unitary_error_upper':float(Fraction(a['uniform_full_source_unitary_error_upper'])),
   'contact_words':averaging['full_source_frequency_certificate']['native_quartic_words'],
   'full_large_carrier_executed':False},
  'meson_current':{'time':mr['source_time'],'conditional_pair_probability':mr['conditional_total_lepton_pair_probability'],
   'unconditional_pair_probability':mr['unconditional_total_lepton_pair_probability'],
   'preparation_success_probability':mr['preparation_success_probability'],
   'conditional_bound_target_probability':mr['conditional_light_bound_spin_zero_receiver_probability'],
   'untuned_box_conditional_pair_probability':meson['untuned_free_gap_box_control']['conditional_total_lepton_pair_probability'],
   'physical_decay_fit':False},
  'vectorlike':{'rows':[{k:r[k]for k in('family','channel','conditional_light_GeV','conditional_heavy_GeV')}for r in flavour['quark_branches']],
   'light_down_minus_up_GeV':flavour['light_down_minus_up_conditional_GeV'],
   'added_heavy_branches':flavour['extra_branches_retained'],'physical_quark_mass_fit':False},
  'baryon_ordering':{'rows':baryon['baryon_energies'],
   'neutral_minus_charged_GeV':baryon['neutron_like_minus_proton_like_conditional_GeV'],
   'neutral_inner_charge_interval':next(r for r in baryon['complete_intrinsic_records']if r['charge']==0)['intrinsic_charge_profile']['1/3']['ground_interval'],
   'beta_decay_energetically_allowed':False,'physical_nucleon_mass_fit':False},
  'dynamic_wave':{'source_dimension':wave['full_source_dimension'],
   'bending_interval':next(r for r in wave['same_source_bending_intervals']if r['time']==4)['source_minus_zero_native_control_shift_interval'],
   'delay_interval':wave['same_source_operational_delay_interval'],'shared_autonomous_source':True,'physical_lensing_fit':False},
  'dynamic_stress':{'clock_spread_ppm_interval':clocks['strict_clock_ratio_spread_ppm_interval'],
   'clock_count':len(clocks['all7_same_source_clock_ratios']),
   'weak_probe_error_upper':float(Fraction(clocks['exact_test_clock_theorem']['at_probe_coefficient_one_thousandth_error_upper'])),
   'finite_boundary_correction_retained':True,'finite_strength_exact_universality':False},
  'six_quark':{'source_energy':nuclear['positive_bound_state']['Rayleigh_energy_diagnostic'],
   'binding_lower':float(Fraction(nuclear['strict_binding_below_two_baryons_lower'])),
   'quadrupole_interval':[float(Fraction(x))for x in nuclear['positive_bound_state']['ground_quadrupole_interval']],
   'conditional_equal_bare_mass_energy_GeV':units['baseline_equal_bare_mass_six_quark_energy_GeV'],
   'binding_lower_GeV':float(Fraction(units['binding_gap_lower_GeV'])),
   'complete_fixed_sector':nuclear['exact_dimensions']['fixed_N6_Nu3_Nspinup4'],
   'physical_deuteron_fit':False},
 }

def previous_tasks(receipts):
 charge=receipts['native_charge'];attachment=charge['same_quantum_block_attachment']
 assert charge['exact_filled_reference_electric_charge']=='0'
 assert attachment['native_lowest_charged_band_is_global_within_fixed_charge_sector']is True
 assert attachment['old_16_Clifford_rows_all_identified_with_one_native_family']is False
 infinity=receipts['infinite_photon'];trial=next(x for x in infinity['certified_trials']if x['trial_photon_cap']==3)
 assert infinity['analytic_infinite_field']['finite_spatial_regulator_retained']is True
 assert trial['infinite_ground_photon_tail_above_trial_cap_upper']<8.278e-16
 larmor=receipts['quantum_larmor'];lg=larmor['certified_finite_field_splittings'][0]['finite_field_precession_g_interval']
 assert larmor['same_rest_unit_current_state_field_and_clock']is True
 assert larmor['field_strength_and_source_couplings_physically_calibrated']is False
 flight=receipts['neutral_flight'];decay=receipts['inclusive_decay'];survival=decay['controlled_finite_time_survival']
 assert flight['mass_tag_control_spatially_summed_flavour_difference']==0
 assert survival['large_bin_model_executed']is False
 assert decay['conditional_units']['electron_anchor_is_empirical']is True
 assert decay['conditional_units']['calibration_source']['empirical_weak_scale_or_Higgs_normalization_matched']is False
 bound=receipts['composites'];scale=receipts['composite_scale']
 baryon=next(x for x in bound['states']if x['kind']=='baryon'and x['charge']==1 and x['internal_spin']==.5)
 meson=next(x for x in bound['states']if x['kind']=='meson'and x['charge']==1 and x['internal_spin']==0)
 assert baryon['co_location_probability']>.99 and meson['co_location_probability']>.99
 for state in bound['states']:
  complete=state['complete_unconditional_records'];assert abs(sum(complete['preparation_success_and_every_full_sector_occupation'])+complete['preparation_failure']-1)<1e-9
 assert scale['physical_particle_rest_mass_claim']is False
 assert scale['calibration']['parameters_fitted_to_hadrons']is False
 assert all(x['verdict'].startswith('REJECTED')for x in scale['physical_assignment_tests'])
 geometry=receipts['dynamic_geometry'];cap=next(x for x in geometry['cap_comparisons']if x['cap']==4)
 assert geometry['static_minimum_controller_used']is False
 assert geometry['physical_G_clock_length_or_observed_gravity_identified']is False
 assert cap['entanglement']['witness_decimal_interval'][1]<0
 assert len(cap['all49_positive_energy_source_pair_interactions'])==49
 wave=receipts['wave_deflection'];variant=next(x for x in wave['variants']if x['side']==31 and x['gamma']==1 and x['transverse_preparation_offset']==6)
 row=next(x for x in variant['all_mode_rows']if x['source_time']==16)
 minus=next(x for x in wave['variants']if x['gamma']==-1)['all_mode_rows'][1]
 assert wave['quantum_geometry_package_source_transfer_claimed']is False
 assert wave['gamma_minus1_ray_deflection_zero_but_finite_wave_residual_retained']is True
 assert wave['physical_G_lensing_angle_or_gravity_strength_identified']is False
 return {
  'task_count':10,
  'native_charge':{'charge':'-1','neutral_reference_charge':'0','native_pairs':len(charge['native_pairs']),
   'full_conjugate_CAR_modes':attachment['two_charge_conjugate_native_copies_CAR'],'spin_Casimir':attachment['dressed_total_Casimir'],
   'physical_particle_identity_proved':False},
  'infinite_photon':{'source_energy_interval':infinity['joint_infinite_ground_energy_interval'],
   'conditional_GeV_interval':trial['GeV_interval_using_identical_cap_two_electron_unit'],
   'photon_tail_above_three_upper':trial['infinite_ground_photon_tail_above_trial_cap_upper'],
   'finite_spatial_regulator_retained':True,'independent_mass_fit':False},
  'quantum_larmor':{'finite_field_g_interval':lg,'complete_time_experiments':len(larmor['complete_finite_time_records']),
   'same_rest_current_state_clock':True,'physical_field_calibrated':False},
  'neutral_flight':{'sites':flight['sites'],'CAR_modes':flight['physical_CAR_modes'],
   'mass_phase_contrast':flight['coherent_mass_phase_contrast_in_spatially_summed_family_records'],
   'source_success_rule':flight['exact_source_success'],'physical_neutrino_GeV_identified':False},
  'inclusive_decay':{'width_GeV':decay['conditional_units']['width_GeV'],
   'contact_G_GeV_inverse_squared':decay['conditional_units']['G_GeV_inverse_squared'],
   'one_lifetime_survival_interval':survival['rows'][0]['survival_interval_diagnostic'],
   'one_lifetime_probability_error_upper':float(Fraction(survival['rows'][0]['total_survival_probability_error_upper'])),
   'phase_space_law':decay['exact_phase_space']['rate'],'large_finite_carrier_executed':False,'physical_weak_lifetime_fit':False},
  'baryon':{'ground_energy':baryon['ground_energy'],'co_location_probability':baryon['co_location_probability'],
   'singlet_dimension':bound['sector_sizes']['baryon']['exact_colour_singlet_dimension'],
   'binding_gap_lower':bound['uniform_graph_bounds']['baryon_binding_gap_lower'],'proton_neutron_degenerate':True},
  'meson':{'ground_energy':meson['ground_energy'],'co_location_probability':meson['co_location_probability'],
   'singlet_dimension':bound['sector_sizes']['meson']['exact_colour_singlet_dimension'],
   'binding_gap_lower':bound['uniform_graph_bounds']['meson_binding_gap_lower'],'neutral_singlet_and_spin_partners_retained':True},
  'geometry':{'carrier_dimension':cap['complete_native_matter_geometry_dimension'],
   'witness_interval':cap['entanglement']['witness_decimal_interval'],'source_time':cap['entanglement']['source_time'],
   'mutual_attractive_pairs':49,'energy_conserved':True,'physical_G_identified':False},
  'wave':{'modes':variant['field_carrier_dimension']-1,'source_time':row['source_time'],
   'transverse_shift':row['conditional_transverse_position_shift'],'transverse_velocity_shift':row['transverse_velocity_shift'],
   'gamma_minus_one_shift':minus['conditional_transverse_position_shift'],
   'independent_second_order_discrepancy':row['independent_full_second_order_wave_discrepancy'],
   'static_scalar_plane':True,'physical_lensing_fit':False},
  'common_scale':{'rows':scale['energy_rows'],'comparisons':scale['physical_assignment_tests'],
   'binding_family_offset_GeV':scale['exact_obstructions']['light_second_meson_energy_difference_GeV'],
   'physical_hadron_mass_fit':False},
 }

def frontier(receipts):
 compiler=receipts['compiler']['resources']['state_sensitive_same_packet']
 higgs=receipts['higgs'];gravity=receipts['gravity'];clocks=receipts['clocks']
 assert compiler['same_physical_record_and_energy_guarantees']is True
 assert compiler['all_ancilla_outputs_retained']is True
 assert compiler['full_large_carrier_executed']is False
 assert compiler['cycle_reduction_factor']>1e34
 assert higgs['exact_native_symbol']['native_internal_rank']==14
 assert higgs['charged_sector_theorem']['all_neutral_zero_modes_retained']is True
 assert higgs['countercontrols']['shared_up_down_mass_spectrum_equal']is True
 assert higgs['countercontrols']['unequal_observed_quark_masses_derived']is False
 assert higgs['architecture']['relative_channel_choice_source_forced']is False
 force=[float(Fraction(v))for v in gravity['attractive_central_difference_force_at_six']]
 assert 0<force[0]<=force[1]<1.534e-7
 assert gravity['geometry_register_has_autonomous_relaxation']is False
 assert clocks['clock_records']['all64_joint_clock_outcomes_retained']is True
 assert len(clocks['clock_records']['rows'])==7
 assert clocks['physical_gravitational_redshift_or_Einstein_completion_claimed']is False
 assert clocks['metric_and_curvature']['isotropic_gamma_one_wave_gluing_is_declared']is True
 quantum=receipts['quantum'];qb=next(r for r in quantum['interval_certificates']if r['cap']==2)
 assert quantum['declared_source']['charge']==-1
 assert all(r['Casimir_residual']<1e-9 and r['Jz_residual']<1e-9 for r in quantum['stationary_records'])
 assert quantum['calibration']['physical_electron_identity_proved']is False
 assert quantum['calibration']['muon_tau_spectrum_transferred']is False
 assert quantum['calibration']['other_caps_reuse_same_unit']is True
 assert quantum['calibration']['electron_anchor_GeV']==.00051099895069
 gi=qb['rest_energy_normalized_static_g_interval']
 assert 1.99827<gi[0]<=gi[1]<1.99828
 oscillation=receipts['oscillation'];weak=receipts['weak']
 assert oscillation['imported_PMNS_angles_mass_splittings_or_neutrino_GeV_scale']is False
 assert oscillation['measured_PMNS_fit_or_observed_neutrino_identification']is False
 assert oscillation['full45_mass_kernel_and90_CAR_pairing_retained']is True
 assert len(oscillation['complete_records'])==36
 assert weak['observed_muon_lifetime_weak_scale_or_continuum_S_matrix_derived']is False
 wp=weak['original_receiver_probability_decimal_interval']
 assert 0<wp[0]<=wp[1]<1
 assert weak['neutral_masses']=='0'
 transfer=receipts['transfer']
 assert transfer['same_side_two_low_energy_band_or_ground_transferred']is False
 assert transfer['relativistic_mass_or_observed_neutrino_identified']is False
 tp=transfer['original_receiver_probability_decimal_interval']
 assert 0<tp[0]<=tp[1]<1e-120
 return {
  'neutral_transfer':{'receiver_probability_interval':tp,'source_sites':64,'total_spin_Casimir':'3/4',
   'earlier_flat_band_transferred':False,'physical_neutrino_identified':False},
  'quantum':{'g_interval':gi,'total_spin_Casimir':'3/4','total_spin_z':'1/2',
   'cap':2,'source_rest_energy_interval':qb['actual_ground_energy_interval'],
   'electron_anchor_GeV':quantum['calibration']['electron_anchor_GeV'],
   'finite_cap_comparisons':quantum['finite_cap_comparisons'],
   'physical_electron_identity_proved':False,'muon_tau_spectrum_transferred':False},
  'oscillation':{'maximum_contrast':oscillation['maximum_executed_neutral_antineutral_probability_contrast'],
   'record_count':len(oscillation['complete_records']),'declared_port_word':oscillation['declared_port_word'],
   'mixing_parameters':oscillation['model_mixing_parameters'],'physical_neutrino_fit':False},
  'weak':{'receiver_probability_interval':wp,'source_time':float(Fraction(weak['time'])),
   'contact_coefficient':weak['architecture_contact_coefficient_G'],
   'native_CAR_modes':270,'physical_lifetime_or_weak_scale_derived':False},
  'compiler':{'cycle_reduction_factor':compiler['cycle_reduction_factor'],
   'certified_cycles':str(compiler['cycles']),'full_large_carrier_executed':False,
   'same_physical_record_and_energy_guarantees':True,'continuing_controls_required':True},
  'higgs':{'massive_internal_rank':14,'native_internal_dimension':15,
   'charged_floor':higgs['charged_sector_theorem']['operator_bound'],
   'neutral_zero_modes_retained':True,'shared_quark_spectra_equal':True,
   'observed_quark_mass_fit':False,'shared_family_coefficients_declared':True},
  'gravity':{'attractive_force_source_units_interval':force,
   'clock_shift_ppm_interval':clocks['clock_records']['relative_frequency_shift_ppm_interval'],
   'clock_gap_count':len(clocks['clock_records']['rows']),
   'metric_ray_delay_source_units_interval':clocks['isotropic_piecewise_metric_delay_decimal'],
   'complete_wave_TV_by_time':[{'time':r['curved']['duration'],'TV':r['complete_probability_total_variation']}for r in clocks['wave_runs']],
   'energy_lapse_and_isotropic_gluing_declared':True,'physical_G_or_clock_calibrated':False},
 }

def check_placement(consumer,journey):
 """The constructions page renders the results; the Journey page carries none."""
 if IMPORT not in consumer:raise ValueError('constructions.js does not import journey_results.js; inspect before overlaying')
 if LEGACY_HOOK in journey:raise ValueError('journey.js still mounts the results; numerical records belong on the dedicated Results pages')
 if 'journey-matches' in journey or "import('./matches.js')" in journey:raise ValueError('journey.js still duplicates the matches wall')

def remove_journey_matches(body):
 """Remove only the duplicated matches wall; retain Fable story/navigation."""
 container='  <div class="mw" id="journey-matches"></div>\n'
 mount="  import('./matches.js').then((m) => { const el = host.querySelector('#journey-matches'); if (el) m.wall(el); }).catch(() => {});\n"
 if 'journey-matches' not in body and "import('./matches.js')" not in body:return body
 if body.count(container)!=1 or body.count(mount)!=1:
  raise ValueError('Journey matches mount changed; inspect before removing it')
 body=body.replace(container,'').replace(mount,'')
 old='  // The page: the journey as one running picture, then every match with nature (matches.js), then the maps between\n  // the steps. No result block is mounted here: results live on the pages of the Results group.'
 new='  // The page: the journey as one running picture, then the maps between the steps.\n  // Matches and numerical results live on their dedicated Results pages.'
 return body.replace(old,new)

def apply_data_hooks(name,body):
 """Small idempotent data hooks preserve the current Fable renderer and layout."""
 if name=='matches_data.js':
  patches=[
   ("import { COSMOLOGY_LEDGER, TILT_COMPARISONS } from './cosmos_evidence.js';", "import { COSMOLOGY_LEDGER, TILT_COMPARISONS } from './cosmos_evidence.js';\nimport { applyConstructionEvidence, updateConstructionOpenItems } from './construction_matches.js';"),
   ('  for (const g of groups) g.rows = g.rows.filter(Boolean);','  applyConstructionEvidence(groups);\n  for (const g of groups) g.rows = g.rows.filter(Boolean);'),
   ('  for (const o of open) if (OW[o.id]) o.ow = OW[o.id];','  updateConstructionOpenItems(open);\n  for (const o of open) if (OW[o.id]) o.ow = OW[o.id];')]
 elif name=='results.js':
  patches=[
   ("import { STATUS, TICKS, FILES, REF, PLACEHOLDER_LABEL, INCOMPLETE_LABEL, axisX, board, fmtDev, fmtPct, fmtSigma } from './results_data.js';", "import { STATUS, TICKS, FILES, REF, PLACEHOLDER_LABEL, INCOMPLETE_LABEL, axisX, board, fmtDev, fmtPct, fmtSigma } from './results_data.js';\nimport { applyConstructionNumbers } from './construction_matches.js';"),
   ('  B = board(LIVE);','  B = applyConstructionNumbers(board(LIVE));'),
   ('${r.sym}${r.unit ?', '${r.sym}${r.mobileValue ? `<small class="rs-native-mobile">${esc(r.mobileValue)}</small>` : ""}${r.unit ?'),
   ('<div class="rs-wrap">', '<style>.rs-native-mobile{display:none}@media(max-width:699px){#page-results .rs-native-mobile{display:block;font-size:12px;font-weight:600;line-height:1.5;overflow-wrap:anywhere;color:var(--fg)}#page-results .rs-native-mobile+em{display:none}}</style><div class="rs-wrap">')]
 elif name=='openwave.js':
  patches=[("const RER = 'https://github.com/FloatingPragma/observer-patch-holography/blob/main/';", "const RER = 'https://github.com/FloatingPragma/observer-patch-holography/blob/' + OPENWAVE.evaluated_RER_commit + '/';"),
   ('This is where OPH stands on each, by this project’s own assessment of its public evidence. OpenWave has not scored OPH.', 'This is the central application estimate, conditional on admission, platform reproduction and review. OpenWave has not scored OPH.'),
   ('const PLAIN = {',"import { CONSTRUCTION_SUMMARIES } from './construction_matches.js';\nconst PLAIN = {"),
   ("${PLAIN[r.id] || ''}","${esc(CONSTRUCTION_SUMMARIES[r.id] || PLAIN[r.id] || '')}")]
 elif name=='matches.js':
  patches=[('One row per match. Left: what the simulation gives. Right: our universe.',
   'One row per match. Left: what the simulation gives. Right: our universe. Includes calibrated fits and conditional results.')]
 else:raise ValueError(name)
 for old,new in patches:
  if new in body:continue
  if body.count(old)!=1:raise ValueError(f'Fable data hook changed in {name}; review its current source')
  body=body.replace(old,new)
 return body

def sync(out,rer=RER,check=False):
 data=project(rer);body=json.dumps(data,indent=2,ensure_ascii=False)+'\n'
 outputs={'journey_results.json':body,'journey_results_data.js':'export const JOURNEY_RESULTS = '+body.rstrip()+';\n'}
 for name in ('journey_results.js','journey_results.css','construction_matches.js','ninth_results.js','tenth_results.js','eleventh_results.js','twelfth_results.js','thirteenth_results.js'):outputs[name]=(EXTRA/name).read_text()
 outputs['journey.js']=remove_journey_matches((out/'journey.js').read_text())
 check_placement((out/CONSUMER).read_text(),outputs['journey.js'])
 for name in ('matches_data.js','openwave.js','results.js','matches.js'):
  outputs[name]=apply_data_hooks(name,(out/name).read_text())
 for name,body in outputs.items():
  p=out/name
  if check:
   if not p.exists()or p.read_text()!=body:raise ValueError(f'stale Journey projection: {p}')
  else:p.write_text(body)
 return data

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--out',type=Path,default=ROOT/'site');p.add_argument('--rer',type=Path,default=RER);p.add_argument('--check',action='store_true');a=p.parse_args()
 result=sync(a.out,a.rer,a.check);print(f"Journey projection {'verified'if a.check else 'written'}: {len(result['source_sha256'])} bound receipts")
if __name__=='__main__':main()
