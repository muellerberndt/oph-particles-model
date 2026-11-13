"""Outward projections of bounded source results and the actual M10 review gate."""
from math import nextafter,inf
from twelfth_results import scalar,interval
NAMES=('lambda_narrow_weight','repeated_native_clock','quark_string_transport','nuclear_field_attraction',
 'matter_flux_source','local_gauge_memory','stress_curvature_instruments','geometry_covariance_protocol',
 'capacity_finite_wavelength','m10_review_gate')
def project(r):
 def require(name,path,value):
  x=r[name]
  for k in path:x=x[k]
  assert x is value,(name,path)
 for name,path in [('repeated_native_clock',('scope','literal_openwave_row3_validated')),
  ('repeated_native_clock',('scope','native_twelve_port_process_attachment')),
  ('repeated_native_clock',('scope','static_controller_exact_strength_independent_frequency')),
  ('repeated_native_clock',('scope','sustained_replenished_clock')),
  ('lambda_narrow_weight',('on_shell_density_or_outgoing_wave_operator_proved',)),
  ('lambda_narrow_weight',('new_match_with_nature',)),('quark_string_transport',('physical_quark_pole_or_GeV_rest_mass_proved',)),
  ('quark_string_transport',('classical_winding_texture_or_spontaneous_soliton_proved',)),
  ('nuclear_field_attraction',('held_out_helion_or_alpha_reproduced',)),('nuclear_field_attraction',('new_empirical_fit',)),
  ('nuclear_field_attraction',('necessary_alpha_strength','bound_used_to_choose_source_coefficient')),
  ('matter_flux_source',('scope','native_process_compilation_proved')),
  ('matter_flux_source',('rest_operator_comparison','physical_GeV_prediction')),
  ('matter_flux_source',('optional_charged_counterterm','physical_mass_prediction_or_native_process_closure')),
  ('matter_flux_source',('optional_charged_counterterm','unchanged_current_Ward_work_or_many_body_decay_transferred')),
  ('matter_flux_source',('optional_charged_counterterm','choice_of_counterterm_forced_by_native_process')),
  ('local_gauge_memory',('scope','continuum_or_Clay_mass_gap_proved')),
  ('stress_curvature_instruments',('scope','native_12_port_process_compilation_proved')),
  ('stress_curvature_instruments',('tensor_transfer','Einstein_equation_enforced_by_acquisition')),
  ('geometry_covariance_protocol',('scope','physical_Newton_strength_independently_validated')),
  ('geometry_covariance_protocol',('scope','native_twelve_port_process_realization')),
  ('capacity_finite_wavelength',('scope','absolute_amplitude_predicted')),
  ('capacity_finite_wavelength',('scope','full_Boltzmann_or_CMB_match')),
  ('capacity_finite_wavelength',('scope','late_preparation_is_early_primordial_solution'))]:require(name,path,False)
 require('matter_flux_source',('optional_charged_counterterm','all_six_charged_particle_and_antiparticle_family_sector_rest_coefficients_exactly_restored'),True)
 require('matter_flux_source',('optional_charged_counterterm','whole_source_ground_equals_same_cycle_vacuum'),True)
 l=r['lambda_narrow_weight'];q=r['quark_string_transport'];n=r['nuclear_field_attraction'];f=r['matter_flux_source'];g=r['local_gauge_memory'];t=r['stress_curvature_instruments'];v=r['geometry_covariance_protocol'];c=r['capacity_finite_wavelength'];m=r['m10_review_gate']
 assert 'no fixed-time ultraviolet convergence follows' in g['iteration']['fixed_time_continuum_bound']
 nuclear=[{'name':x['name'],'GeV':interval(x['full_ground_GeV_interval']),'target_GeV':scalar(x['target_GeV']),
   'role':x['target_role'],'matches':x['target_in_certified_interval']}for x in n['complete_ground_bounds']]
 assert all(not x['matches']for x in nuclear if x['name']in ('helion','alpha'))
 assert m['official_status']['oph_admitted']is True and m['official_status']['oph_model_id']=='M10'
 assert m['official_status']['upstream_counts']['M10']==dict(negative=0,partial=0,scored=0,untested=31,validated=0)
 assert m['official_status']['oph_official_rank']==7
 assert m['upstream_certification']['criterion_cells_awarded']==0
 assert len(m['upstream_certification']['compared_values'])==7 and all(x['verdict']=='agree'for x in m['upstream_certification']['compared_values'])
 clock=r['repeated_native_clock'];controls=clock['static_controller']['complete_native_mass_and_changed_strength_controls']
 assert clock['scope']['two_complete_preparation_readout_cycles_executed'] is True
 assert clock['exact_two_cycle_resource_theorem']['source_frequency_over_mass_both_flights_exact']=='1'
 assert all(f['continuous_phase_branch_without_winding_certified'] is True for x in controls for f in x['two_free_flight_certificates'])
 return {'clock':{'cycles':2,'carrier':clock['static_controller']['executed_reducing_dimension'],'controls':len(controls),
   'second_flight':[{'mass_source_units':scalar(x['native_mass_exact']),'strength':scalar(x['preparation_exchange_strength_over_scale_exact']),
    'frequency':interval(x['two_free_flight_certificates'][1]['certified_actual_phase_frequency_interval_exact'])}for x in controls],
   'reset_excitation_upper':nextafter(max(x['reset_source_excitation_conditioned_upper']for x in controls),inf),
   'exact_strength_independent_detector_frequency':False,'new_GeV_rest_masses':False},
  'lambda':{'windows':[{'half_width_GeV':scalar(x['half_width_GeV_exact']),
   'probability':interval(x['selected_conditional_window_interval'])}for x in l['windows']],
   'columns':l['variational_frame']['columns'],'positive_lower_bound':False,'on_shell_density':False},
  'strings':{'charges':[scalar(x['native_charge_exact'])for x in q['native_families']],
   'displacement_upper':{k:nextafter(scalar(x),inf)for k,x in q['exact_reduction']['mean_displacement_all_time_upper_exact'].items()},
   'physical_quark_mass':False},'nuclear':nuclear,
  'matter':{'CAR_modes':f['native_inventory']['native_CAR_modes'],'source_terms':f['native_inventory']['native_source_terms'],
   'positive_spatial_squares':f['native_inventory']['spatial_positive_quadratic_terms'],
   'charged_architecture_shift_GeV':interval(f['rest_operator_comparison']['common_charged_one_lepton_gap_offset_GeV_exact']),
   'physical_mass_fit':False,'native_process_transfer':False,
   'optional_common_counterterm_restores_inherited_coefficients':f['optional_charged_counterterm']['all_six_charged_particle_and_antiparticle_family_sector_rest_coefficients_exactly_restored'],
   'optional_counterterm_is_native_law_or_new_prediction':False},
  'gauge':{'records':[{'L':x['subdivision'],'representation':x['representation'],
    'source_time':scalar(x['time_exact']),'correlation':interval(x['normalized_interacting_real_correlation_interval_exact'])}for x in g['refinement_records']],
   'fixed_time_continuum':False},
  'stress':{'prepared_copies':t['same_state_sampling']['total_prepared_copies'],
   'mean_error':scalar(t['same_state_sampling']['per_native_mean_error_exact']),
   'failure_upper':nextafter(scalar(t['same_state_sampling']['simultaneous_failure_upper_exact']),inf),'Einstein_equation_derived':False},
  'covariance':{'count_pairs':v['all_N_statistical_theorem']['sample_plan']['total_independent_count_pairs'],
   'N_independent_sample_bound':v['all_N_statistical_theorem']['sample_plan']['count_N_independent_sample_bound'],
   'independent_G':False,'physical_noise_match':False},
  'capacity':{'records':[{'k_H0':scalar(x['k_over_H0_exact']),'metric':interval(x['metric_transfer_interval']),
    'comoving_dust':interval(x['comoving_dust_interval'])}for x in c['fine']['finite_wavelength_records']],
   'early_primordial_solution':False,'absolute_amplitude_derived':False,'CMB_match':False},
  'openwave':{'admitted':True,'model':'M10','official_untested':31,'official_validated':0,'rank':7,
   'exact_arithmetic_values':7,'arithmetic_awards_physics_rows':False,'upstream_commit':m['upstream_commit']},
  'new_independent_nature_validation':False}
