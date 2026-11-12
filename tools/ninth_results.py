"""Concise source-bound data for the coupled current and clock constructions."""
from fractions import Fraction as F

def numbers(values):return [float(F(v))for v in values]

def project(receipts):
 axial=receipts['axial_state'];neutral=receipts['neutrino_calibration'];clock=receipts['joint_native_clocks'];platform=receipts['platform_kernel']
 assert axial['native_current_changed']is False and axial['effective_axial_multiplier_installed']is False
 assert neutral['neutral_family_tensor_is_a_declared_calibration']is True
 assert neutral['rigid_charged_ratio_obstruction']['one_scale_fits_both_mass_splittings']is False
 assert neutral['native_current_tensor_unchanged']is True
 assert neutral['calibrated_neutral_catalogue']['independent_neutrino_mass_or_mixing_prediction']is False
 assert clock['exact_finite_strength_clock_universality']is False
 assert clock['physical_clock_G_or_equivalence_principle_violation_identified']is False
 assert clock['weak_probe_common_clock_theorem']['scaled_probe_family_executed_numerically']is False
 assert platform['official_admission_or_award']is False
 assert platform['negative_control_detected']is True
 lines=receipts['dressed_baryon_lines'];member=next(r for r in lines['members']if r['member']=='axial')
 assert lines['physical_interacting_nucleon_poles_or_neutron_lifetime_claimed']is False
 spin=receipts['hadron_spin_constraints'];controls={r['control']:r for r in spin['controls']}
 assert spin['common_spin_obstruction']['incompatible']is True
 assert spin['charge_square_control']['physical_neutral_pion_wavefunction_identified']is False
 memory=receipts['meson_memory_window'];window=next(r for r in memory['controlled_windows']if r['ring_sites']==128)
 assert memory['physical_strange_decay_or_irreversible_rate_claimed']is False
 common=receipts['common_mass_source'];energy=next(r for r in common['complete_coupled_baryon_energy_records']['complete_energy_window_instrument_bounds']if r['assigned_channel']=='neutron'and r['half_width_electron_units']=='1/2')
 assert common['positivity']['finite_matter_source_includes_photons']is False
 assert common['positivity']['colourful_sector_floor_exceeds_electron']is True
 nuclear=receipts['nuclear_distance']['nuclear'];fit=nuclear['deuteron_fit_control']
 partner=next(r for r in fit['channels']if r['spin']==0 and r['isospin']==0 and r['cell_parity']==-1)
 assert all(r['binding']<0 for r in nuclear['fixed_four_input_source_binding_comparisons'])
 assert partner['binding_GeV']>0
 beta=receipts['beta_parity'];bounds=beta['full_unfiltered_parity_certificates']
 assert beta['physical_neutron_lifetime_or_three_dimensional_angular_coefficient_claimed']is False
 assert all(r['strict_negative_exact_parity_difference_upper_decimal']<0 for r in bounds)
 assert all(len(r['all_first_pair_channels'])==24 for r in beta['finite_ring_executions'])
 return {
  'task_count':10,
  'axial_state':{'gA_interval':axial['current_ground_certificate']['native_ground_axial_interval'],
   'co_location_interval':axial['current_ground_certificate']['colocated_ground_probability_interval'],
   'fourth_empirical_input':axial['fourth_empirical_input'],'native_current_changed':False,
   'mass_fits':[{'name':r['comparison'],'target_GeV':float(F(r['target_GeV'])),'interval_GeV':numbers(r['same_source_energy_GeV_interval'])}for r in axial['three_mass_fits']]},
  'dressed_baryon_lines':{'leading_neutron_weight':max(r['conditional_probability_diagnostic']for r in member['neutron']['complete_spectral_clusters']),
   'leading_proton_weight_lower':float(F(member['proton_dominant_line_probability_interval'][0])),
   'neutron_spectrum_count':len(member['neutron']['complete_spectral_clusters']),'physical_nucleon_poles':False},
  'hadron_spin_constraints':{'neutral_scalar_target_GeV':controls['no_spin_fit_and_neutral_pion_fit']['rest_energies_GeV']['neutral_pion_candidate'],
   'rho_with_Delta_fit_GeV':controls['Delta_fit']['rest_energies_GeV']['rho_charged_candidate'],
   'Delta_with_rho_fit_GeV':controls['rho_fit']['rest_energies_GeV']['Delta_plus_candidate'],
   'one_common_spin_force_fits_both':False,'physical_neutral_pion_wavefunction_identified':False},
  'beta_parity':{'conditional_parity_upper':max(r['strict_negative_exact_parity_difference_upper_decimal']for r in bounds),
   'source_parameter':float(F(bounds[0]['source_time'])),
   'ring_sites':[r['ring_sites']for r in beta['finite_ring_executions']],
   'first_order_asymmetries':[r['selected_actual_proton_light_electron_all_neutrals']['conditional_first_order_asymmetry']for r in beta['finite_ring_executions']],
   'original_preparation_success':1/120,'physical_lifetime_or_3D_coefficient':False},
  'nuclear_distance':{'deuteron_target_binding_MeV':1000*float(F(fit['fifth_empirical_input_GeV'])),
   'unassigned_partner_binding_MeV':1000*partner['binding_GeV'],
   'fixed_four_input_source_is_bound':False,'complete_observed_nuclear_spectrum':False},
  'meson_memory_window':{'conditional_probability_lower':window['infinite_line_light_channel_probability_lower_decimal'],
   'original_probability_lower':window['original_input_probability_lower_decimal'],
   'source_parameter':float(F(window['source_time'])),'ring_sites':window['ring_sites'],
   'physical_rate':False},
  'common_mass_source':{'window_probability_lower':float(F(energy['conditional_inside_probability_lower'])),
   'original_probability_lower':float(F(energy['original_inside_probability_lower'])),
   'halfwidth_MeV':1000*float(F(energy['half_width_GeV'])),
   'exact_electron_charge_threshold_GeV':float(F(common['positivity']['full_charge_plus_and_minus_one_threshold_GeV_exact'])),
   'physical_nucleon_poles':False},
  'neutrino_calibration':{'rows':neutral['calibrated_neutral_catalogue']['rows'],
   'sum_masses_eV_interval':numbers(neutral['calibrated_neutral_catalogue']['sum_masses_eV_interval']),
   'effective_beta_mass_eV_interval':numbers(neutral['calibrated_neutral_catalogue']['effective_beta_mass_eV_interval']),
   'complete_record_TV_bound':float(F(neutral['complete_flight']['uniform_exact_complete_record_TV_bound'])),
   'nu_mu_e_probability_at_pi':neutral['complete_flight']['complete_records'][2]['neutrino_e_detection_probability'],
   'antinu_mu_e_probability_at_pi':neutral['complete_antiparticle_flight']['complete_records'][2]['antineutrino_e_detection_probability'],
   'CP_probability_contrast':neutral['actual_native_mu_neutral_vs_antimu_antineutral_e_detection_contrast_at_pi'],
   'oscillation_parameters_are_calibration':True,'rigid_charged_hierarchy_fits_splittings':False},
  'joint_native_clocks':{'response_difference_ppm_interval':clock['event16_relative_response_difference_ppm_interval'],
   'same_wave_delay_cycles_intervals':clock['same_arrival_law_delays_in_each_measured_clock_cycles_intervals'],
   'weak_probe_bounds':clock['weak_probe_common_clock_theorem']['finite_probe_bounds'],
   'exact_finite_strength_universality':False,'physical_clock_or_G_calibrated':False},
  'platform_kernel':{'twenty_step_record_TV':platform['maximum_twenty_step_record_TV'],
   'native_derivative_error':platform['independent_native_derivative_error'],
   'cube_sides':[r['side']for r in platform['full_native_execution']['runs']],
   'Nambu_dimensions':[r['Nambu_components']for r in platform['full_native_execution']['runs']],
   'OpenWave_commit':platform['upstream_commit'],'official_award':False},
 }
