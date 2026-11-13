"""Source-bound current propagation, core and horizon results; no status awards."""
from twelfth_results import scalar, interval


def project(r):
    core=r['resolved_core'];clock=r['clock_phase_resource'];quotient=r['quotient_homotopy']
    field=r['dirac_field_connection'];gravity=r['gravity_unit_constraint'];cosmo=r['horizon_capacity'];ym=r['su2_propagation']
    assert core['scope']['same_source_static_charge_core_scale_join_certified'] is True
    assert core['scope']['physical_QED_or_QCD_beta_function_derived'] is False
    assert core['scope']['reference_bound_energies_are_observed_particle_poles'] is False
    assert core['regulator_selection']['selection_uses_resolution_outcome'] is True
    assert core['regulator_selection']['selection_uses_empirical_radius_or_running_data'] is False
    assert clock['scope']['autonomous_rest_mass_phase_onset_established'] is False
    assert clock['general_theorem']['no_go_for_all_OPH_architectures'] is False
    assert quotient['scope']['continuous_gauge_group_homotopy_proved'] is True
    assert quotient['scope']['source_state_contains_a_localized_classical_angle_texture'] is False
    assert field['scope']['interacting_Lorentz_covariance'] is False
    assert field['source']['native_Fock_source_equivalence_proved'] is False
    assert gravity['fixed_source']['length_alone_can_match_both'] is False
    assert gravity['source_stiffness_calibrated_to_G'] is False
    assert cosmo['physical_horizon_or_Lambda_amplitude_derived'] is False
    assert cosmo['same_data_alternatives_are_independent'] is False
    assert ym['scope']['Clay_problem_solved'] is False
    assert ym['scope']['spatial_continuum_QFT'] is False
    baryon=r['baryon_dispersion'];cluster=r['cluster_bandwidth'];nuclear=r['nuclear_isospin']
    prop=baryon['positive_correlated_propagation'];shell=cluster['energy_shell_bracket']
    assert baryon['source_parameters_refitted'] is False
    assert baryon['physical_relativistic_mass_or_3D_scattering_pole_proved'] is False
    assert prop['k0_complete_N3_operator_change_exact']=='0'
    assert prop['other_full_Fock_spectra_transferred'] is False
    assert prop['k0_cancellation_for_higher_number_sectors_claimed'] is False
    assert cluster['finite_range_source']['global_minimum_is_used'] is False
    assert cluster['finite_range_source']['strange_mass_parameters_refitted'] is False
    assert cluster['native_weak_scope']['complete_outgoing_weak_decay_or_lifetime_proved'] is False
    assert cluster['native_weak_scope']['new_on_shell_weak_matrix_element_certified'] is False
    assert scalar(shell['above_margin_GeV_exact'])>0 and scalar(shell['below_margin_GeV_exact'])>0
    assert nuclear['declared_electrostatic_member']['additional_nuclear_mass_fits']==0
    assert nuclear['declared_electrostatic_member']['full_positive_Gauss_field_equivalence_proved'] is False
    assert nuclear['physical_nuclear_mass_spectrum_closed'] is False
    nrest=next(x for x in prop['phase_records']if x['cosine']=='1')
    prest=next(x for x in prop['proton_repaired_phase_records']if x['cosine']=='1')
    rows=[]
    for member in core['members']:
        c=member['complete_core_probe'];j=member['same_source_scalar_probe_coupling']
        assert c['half_suppression_onset_resolved'] is True
        assert j['reference_subtracted_particle_derivative']=='Q F(k); total neutral source derivative is Q F(k)+R'
        assert j['scale_join_uses_no_frequency_to_momentum_dictionary'] is True
        assert j['static_effective_charge_is_universal_renormalized_charge'] is False
        rows.append({'family':member['family'],'radius_cells':interval(c['radius_x_cells_interval_exact']),
            'suppression':interval(c['largest_first_Brillouin_zone_suppression_interval_exact']),
            'onset_k_over_pi':interval(c['half_suppression_wavevector_over_pi_interval_exact']),
            'onset_k_radius':interval(c['half_suppression_wavevector_times_measured_radius_interval_exact']),
            'GeV_interval':interval(member['reference_bound_energy_GeV_interval_exact'])})
    return {'task_count':10,
        'baryon':{'neutron_rest_GeV':interval(nrest['all_five_full_source_GeV_intervals'][0]),
            'proton_rest_GeV':interval(prest['all_five_full_source_GeV_intervals'][0]),
            'inertial_mass_GeV':interval(prop['repaired_inertial_mass_GeV_interval']),
            'bandwidth_GeV':interval(prop['available_ground_bandwidth_GeV_interval']),
            'length_fm':scalar(baryon['unit_dictionary']['cell_fm']),
            'native_CAR_dimension':prop['complete_native_correlated_rule']['actual_native_fixed_N3_carrier_dimension'],
            'native_shape_channels':prop['complete_native_correlated_rule']['complete_light_triquark_shape_channels'],
            'ancestry':prop['calibration_ancestry'],'higher_number_transfer':False,'physical_pole_proved':False},
        'cluster':{'Lambda_GeV':interval(cluster['Lambda_rest']['full_Lambda_ground_GeV_interval']),
            'pion_GeV':interval(cluster['pion_rest']['full_ground_GeV_interval']),
            'kaon_GeV':interval(cluster['kaon_rest']['full_ground_GeV_interval']),
            'shell_momentum_GeV':interval(shell['opposite_momenta_GeV_interval']),
            'pair_below_GeV':interval(shell['below']['complete_pair_energy_GeV_interval']),
            'pair_above_GeV':interval(shell['above']['complete_pair_energy_GeV_interval']),
            'energy_shell_open':True,'outgoing_weak_decay_proved':False,
            'source':cluster['finite_range_source'],'ancestry':cluster['bulk_energies_role']},
        'nuclear':{'rows':[{'name':x['name'],'cells':x['cells'],'GeV_interval':interval(x['ground_GeV_interval']),
            'target_GeV':scalar(x['target_GeV']),'matches':x['target_in_interval'],'role':x['target_role']}for x in nuclear['complete_finite_spectra']],
            'required_charge_breaking_norm_GeV':scalar(nuclear['exact_isospin_obstruction']['minimum_charge_breaking_operator_norm_GeV']),
            'member':nuclear['declared_electrostatic_member'],'physical_spectrum_closed':False,'halo_proved':False},
        'core':{'rows':rows,'Wilson':core['architecture']['Wilson_coefficient_exact'],'selection':core['regulator_selection'],
            'scope':core['scope'],'static_charge_core_join':True,'physical_running_curve':False},
        'clock':{'scope':clock['scope'],'general_theorem':clock['general_theorem'],
            'word_counts':[x['retained_word_count']for x in clock['complete_energy_basis_battery_records']],
            'relational_dimension':clock['two_copy_relational_control']['complete_dimension'],
            'relative_free_frequency':clock['two_copy_relational_control']['free_native_frequency_of_relative_coherence_exact'],
            'readout_requires_phase_resource':clock['energy_incompatible_battery_readout']['readout_requires_phase_resource']},
        'quotient':{'winding':quotient['continuous_native_lift']['generator_determinant_winding_exact'],
            'group':quotient['continuous_native_lift']['quotient_fundamental_group'],
            'fractional_phase_lifts':quotient['continuous_native_lift']['native_quark_phase_lifts_exact'],
            'full_Fock_loop_closes':quotient['continuous_native_lift']['full_native_Fock_lift_closes'],
            'scope':quotient['scope'],'complete_dimensions':[x['complete_singlet_dimension']for x in quotient['complete_spatial_lifts']]},
        'field':{'connection':field['exact_connection'],'transformed_field':field['correct_transformed_field'],
            'scope':field['scope'],'source':field['source'],'cases':len(field['cases']),
            'complete_flux':field['all_flux_blocks_retained_analytically'],
            'missing_connection_error':max(x['naive_field_spectrum_error']for case in field['cases']for x in case['records'])},
        'gravity':{'formula':gravity['formula'],'light_length_fm':scalar(gravity['fixed_source']['light_matched_length_fm']),
            'light_matched_G':interval(gravity['light_matched_G_interval']),
            'required_stiffness_factor':interval(gravity['required_stiffness_ratio_interval_exact']),
            'alternative_energy_unit_GeV':interval(gravity['energy_unit_required_if_electron_anchor_abandoned_GeV']),
            'scope':gravity['scope'],'length_only_repair':False},
        'cosmology':{'comparisons':[{'branch':x['branch'],'table':x['table'],'rows':x['rows'],
            'chi_square':interval(x['chi_square_interval']),'fitted_chronometer_parameters':x['fitted_chronometer_parameters']}for x in cosmo['comparisons']],
            'anchors':cosmo['anchors'],'branch_consequences':cosmo['branch_consequences'],
            'Lambda_amplitude_derived':False,'alternatives_independent':False},
        'yang_mills':{'bounds':[{'g_squared':scalar(x['g_squared_exact']),'spacing':scalar(x['spacing_exact']),
            'time':scalar(x['time_exact']),'buffer':x['distance_or_boundary_buffer'],
            'commutator_upper':interval([x['commutator_norm_upper']]*2)[1],'volume_error_upper':interval([x['finite_box_to_infinite_dynamics_norm_upper']]*2)[1]}for x in ym['full_flux_propagation_bounds']],
            'groups':[x['N']for x in ym['SU_N_full_Haar_maps']],
            'proved':ym['proved'],'scope':ym['scope'],'Clay_solved':False}}
