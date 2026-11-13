"""Typed source-pole and field evidence for the existing Results cards."""
from fractions import Fraction as F
from math import nextafter, inf
from twelfth_results import scalar, interval


def pole_projection(r):
    poles = r['baryon_poles']
    weak = r['pole_weak_current']
    assert poles['mass_refit_performed'] is False
    assert poles['physical_3plus1_Lorentz_particle_pole_identification'] is False
    assert poles['matrix_spectral_measure']['spectral_complement_discarded'] is False
    assert poles['matrix_spectral_measure']['zeroth_moment_exact'] == 'I_5'
    assert poles['complete_observer_instrument']['preparation_success_exact'] == '1/5'
    assert poles['complete_observer_instrument']['preparation_failure_exact'] == '4/5'
    assert weak['new_empirical_current_or_mass_input'] is False
    assert weak['autonomous_weak_decay_or_neutron_lifetime_proved'] is False
    assert weak['physical_3plus1_current_or_particle_dictionary_proved'] is False
    assert weak['exact_native_current']['current_flavour_or_spin_output_discarded'] is False
    rest = {x['assignment']: x for x in poles['momentum_fibre_records']
            if x['cosine'] == '1' and x['sine'] == '0'}
    current = next(x for x in weak['momentum_records']
                   if x['cosine'] == '1' and x['sine'] == '0')
    assert current['currents']['vector']['actual_source_pole_amplitude_magnitude_interval'] == ['1', '1']
    assert current['neutron_source_pole_GeV_interval'] == rest['neutron']['source_pole_GeV_interval']
    assert current['proton_source_pole_GeV_interval'] == rest['proton']['source_pole_GeV_interval']
    return {'poles': {
        'neutron_GeV': interval(rest['neutron']['source_pole_GeV_interval']),
        'proton_GeV': interval(rest['proton']['source_pole_GeV_interval']),
        'neutron_prepared_weight_lower': nextafter(scalar(rest['neutron']['pole']['prepared_trial_pole_weight_lower']), -inf),
        'rest_axial': interval(current['currents']['axial']['actual_source_pole_amplitude_magnitude_interval']),
        'rest_vector_exact': '1',
        'preparation_success_exact': '1/5', 'preparation_failure_exact': '4/5',
        'current_success_exact': weak['complete_native_instrument']['rest_vector_success_probability_exact'],
        'current_failure_exact': weak['complete_native_instrument']['rest_vector_failure_probability_exact'],
        'mean_current_work_GeV': scalar(weak['complete_native_instrument']['rest_vector_mean_intervention_work_GeV_exact']),
        'source_dimension': poles['source_dimension'],
        'calibration_ancestry': poles['input_ancestry'],
        'physical_4D_poles': False, 'autonomous_beta_decay': False,
        'new_independent_nature_validation': False,
    }}


def field_projection(r):
    source = r['coupled_haar_source']; spectrum = r['coupled_haar_spectrum']
    euclid = r['euclidean_refinement']
    assert source['complete_source_properties']['all_Haar_representations'] is True
    assert spectrum['empirical_fit_inputs'] == []
    assert spectrum['proved']['full_complement_retained_in_every_certificate'] is True
    assert spectrum['scope']['Clay_problem_solved'] is False
    assert spectrum['scope']['uniform_volume_gap'] is False
    assert euclid['scope']['four_dimensional_interacting_continuum_constructed'] is False
    assert euclid['scope']['imaginary_time_filter_is_real_time_observer'] is False
    assert euclid['continuum_acceptance']['fixed_graph_fixed_coupling_trajectory_admitted'] is False
    record = next(x for x in spectrum['records'] if x['g_squared_exact'] == '2'
                  and x['shared_edge'] and x['diagnostic_max_twice_loop_spin'] == 8)
    refined = next(x for x in euclid['representation_refinement_records']
                   if x['proof_coordinate_key'] == 'shared_g2_2_cap8')
    assert refined['source_Haar_representations_truncated'] is False
    time = next(x for x in refined['correlations'] if x['Euclidean_time_exact'] == '1/4')
    return {'gauge': {
        'coupling_squared': 2, 'spacing': 1,
        'gap_source_units': interval(record['full_Haar_gap_interval_exact']),
        'connected_Wilson_covariance': interval(record['connected_Wilson_covariance_interval_exact']),
        'euclidean_quarter_time': interval(time['full_source_connected_correlation_interval_exact']),
        'complete_instrument_work': interval(record['complete_joint_observer_instrument']['nonselective_ground_preparation_energy_gain_interval_exact']),
        'full_Haar': True, 'physical_GeV': False, 'Clay_solved': False,
        'fixed_coupling_graph_limit_noncollapsed': False,
    }}


def geometry_projection(r):
    ward = r['source_ward']; tensor = r['einstein_error']
    assert ward['scope']['native_clock_derivative_derived'] is True
    assert ward['scope']['finite_linearized_bianchi_derived'] is True
    assert ward['scope']['physical_Newton_strength_matched'] is False
    assert ward['scope']['physical_metric_assignment_derived'] is False
    assert tensor['scope']['finite_error_premise_closed'] is True
    assert tensor['scope']['cosmological_constant_fixed_by_null_records'] is False
    assert tensor['scope']['continuum_or_nonlinear_einstein_theorem'] is False
    return {'geometry': {
        'source_lapse_derivative': ward['native_clock_response']['formula'],
        'q_exact': ward['source_q_exact'],
        'profile_relative_error_upper': nextafter(scalar(ward['native_clock_response']['relative_profile_error_upper_exact']), inf),
        'tensor_error_multiplier': tensor['sharp_maximum_entry_error_constant'],
        'actual_profile_sites': ward['source_sites'],
        'physical_metric_derived': False, 'nonlinear_Einstein_derived': False,
    }}


def cosmology_projection(r):
    c = r['radiation_capacity']
    for key in ('horizon_selection_derived', 'cosmological_amplitude_predicted',
                'standard_model_thermal_history_derived', 'early_universe_abundances_calculated',
                'independent_observational_validation'):
        assert c['scope'][key] is False
    assert c['scope']['maximum_redshift'] == 1000000
    assert c['inputs']['new_empirical_fits'] == 0
    return {'radiation': {
        'inputs': c['inputs'],
        'input_values': {k: scalar(c['inputs'][k]) for k in ('H0_km_s_Mpc', 'Omega_m0', 'Omega_r0')},
        'validated_steps': c['accepted_taylor_steps'],
        'rows': [{'redshift': x['redshift'], 'dark_fraction': interval(x['Omega_dark_interval']),
                  'expansion_ratio': interval(x['H_over_same_matter_radiation_background_interval'])}
                 for x in c['future_event_branch']],
        'early_scaling': c['early_scaling'], 'particle_abundances': False,
        'independent_nature_validation': False,
    }}


def project(r):
    return {**pole_projection(r), **field_projection(r),
            **geometry_projection(r), **cosmology_projection(r), **strange_projection(r)}


def strange_projection(r):
    x = r['strange_shell_current']
    assert x['new_mass_or_current_calibration'] is False
    assert x['physical_Lambda_lifetime_proved'] is False
    assert x['physical_on_shell_decay_amplitude_proved'] is False
    assert x['complete_component_probe']['normalizable_wave_packet_transfer_executed'] is False
    assert x['complete_component_probe']['probabilities_are_fixed_total_momentum_fibre_quantities'] is True
    assert x['exact_native_vertex']['all_compact_native_N5_outputs_retained'] is True
    assert x['exact_native_vertex']['fitted_mass_vectors_used_for_current'] is False
    return {'strange': {
        'Lambda_GeV': interval(x['Lambda_source_pole']['full_ground_GeV_interval']),
        'current_norm_squared': interval(x['full_pole_to_complete_compact_N5_response']['amplitude_norm_squared_interval']),
        'shell_momentum_GeV': interval(x['same_source_energy_shell']['opposite_momentum_GeV_interval']),
        'raw_output_occupations': x['exact_native_vertex']['raw_N5_output_occupations'],
        'compact_Gram_inequality': x['exact_native_vertex']['Gram_order_exact'],
        'on_shell_decay_amplitude': False, 'physical_lifetime': False,
        'normalizable_wavepacket_transfer': False,
    }}
