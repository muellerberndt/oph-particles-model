"""Compact complete-source advances, with calibration and instrument roles retained."""
from math import nextafter,inf
from fractions import Fraction
from twelfth_results import scalar,interval
NAMES=('lambda_spectral_measure','finite_phase_clock','localized_quark_record','nuclear_em_transfer',
       'fock_field_transport','energy_schur','collective_finite_strength','gravity_noise_normalization','capacity_normalization_transfer')
def project(r):
 def require(n,path,value):
  x=r[n]
  for k in path:x=x[k]
  assert x is value,(n,path)
 for n,p in [('lambda_spectral_measure',('on_shell_native_weak_density_proved',)),
  ('lambda_spectral_measure',('new_match_with_nature',)),
  ('lambda_spectral_measure',('actual_successful_current_energy','conditioned_energy_change_is_nonselective_probe_work')),
  ('finite_phase_clock',('scope','literal_openwave_row3_validated')),
  ('localized_quark_record',('self_sustained_fractional_texture_winding_proved',)),
  ('localized_quark_record',('physical_quark_rest_mass_GeV_derived',)),
  ('nuclear_em_transfer',('new_mass_fit',)),
  ('nuclear_em_transfer',('physical_nuclear_spectrum_or_common_alpha_attachment_proved',)),
  ('fock_field_transport',('inherited_GeV_energies_changed',)),
  ('fock_field_transport',('interacting_continuum_or_physical_particle_dictionary_proved',)),
  ('energy_schur',('nontrivial_continuum_or_Clay_result',)),
  ('energy_schur',('uniform_global_offblock_bound_claimed',)),
  ('collective_finite_strength',('scope','independent_G_prediction')),
  ('gravity_noise_normalization',('scope','independent_Newton_prediction')),
  ('gravity_noise_normalization',('scope','physical_metric_noise_identified')),
  ('capacity_normalization_transfer',('mode_and_observation_scope','new_Nature_match')),
  ('capacity_normalization_transfer',('mode_and_observation_scope','OpenWave_row28_never_fitted_amplitude_obligation_met')),
  ('capacity_normalization_transfer',('mode_and_observation_scope','metric_ratio_is_parent_finite_k_matter_growth_ratio'))]:require(n,p,False)
 for n,p in [('localized_quark_record',('gauge_invariant_localized_order_parameter_record_constructed',)),
  ('fock_field_transport',('full_native_H_current_charge_reference_work_transport',)),
  ('collective_finite_strength',('scope','N_inherited_from_observed_G_calibration')),
  ('gravity_noise_normalization',('scope','observed_G_selects_inherited_N'))]:require(n,p,True)
 l=r['lambda_spectral_measure'];c=r['finite_phase_clock']['autonomous_finite_clock_controller'];f=r['fock_field_transport'];g=r['collective_finite_strength'];q=r['gravity_noise_normalization']['conditional_calibrated_member']
 nuclear=[{'name':x['name'],'GeV':interval(x['full_dynamic_ground_GeV_interval']),
  'target_GeV':scalar(x['target_GeV']),'role':x['target_role'],'matches':x['target_in_certified_interval']}for x in r['nuclear_em_transfer']['complete_ground_bounds']]
 assert all(not x['matches']for x in nuclear if x['name']in ('helion','alpha'))
 return {'lambda':{'current_mean_GeV':interval(l['actual_successful_current_energy']['mean_GeV_interval']),
    'rest_mass':False,'on_shell_density':False},
   'clock':{'carrier':c['executed_reducing_carrier_dimension'],'controls':len(c['native_charged_mass_controls']),
    'maximum_drift_diagnostic':max(x['native_frequency_demodulated_drift_diagnostic']for x in c['native_charged_mass_controls']),
    'self_starting_sustained':False,'interval_certificate':False},
   'nuclear':nuclear,'localized_string':True,
   'fock':{'modes':f['native_transport']['native_CAR_modes'],'implementers':f['native_transport']['commuting_even_pair_implementers'],
     'same_carrier_rotor_equivalence':False},
   'gauge':[{'source':x['source'],'gap':interval(x['full_gap_interval_exact']),
    'width_improvement_diagnostic':x['gap_interval_width_improvement_factor']}for x in r['energy_schur']['records']],
   'gravity':{'pairs':g['complete_native_force']['positive_native_source_probe_pairs'],
    'mutual_error_upper':nextafter(scalar(g['native_finite_energy_certificate']['mutual_energy_relative_error_upper_exact']),inf),
    'quench_error_upper':nextafter(scalar(g['two_time_coarse_record']['relative_error_upper_exact']),inf),
    'rms_Q':interval(q['rms_Q_interval_exact']),'observed_G_calibration':True,'physical_noise_match':False},
   'capacity':{'metric':interval(r['capacity_normalization_transfer']['validated_metric_quadrature']['records'][0]['capacity']['metric_transfer_interval']),
    'lambda_metric':interval(r['capacity_normalization_transfer']['validated_metric_quadrature']['records'][0]['lambda']['metric_transfer_interval']),
    'metric_ratio':interval(r['capacity_normalization_transfer']['validated_metric_quadrature']['records'][0]['capacity_to_lambda_metric_ratio_interval']),
    'density_growth_or_CMB':False,'absolute_amplitude_derived':False},'new_independent_nature_validation':False}
