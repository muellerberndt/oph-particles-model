"""Project current strong, gauge and gravity receipts with their source domains."""
from fractions import Fraction as F


def scalar(x):return float(F(x))
def interval(xs):return [scalar(x)for x in xs]


def project(r):
    strong=r['common_hyperfine_spectrum'];profile=r['baryon_form_factors'];cone=r['string_positive_cone']
    em=r['transverse_completion'];running=r['native_running_response'];clock=r['passive_clock_records'];flux=r['quark_flux_records']
    ym=r['pure_su2_source'];transfer=r['su2_transfer'];spectrum=r['su2_spectral']
    gravity=r['universal_energy_geometry'];wave=r['common_gravity_records'];steps=r['strong_step_scaling']
    assert strong['all_unassigned_bound_nuclear_channels']==[]
    assert strong['held_out_neutral_pion_control']['matches'] is False
    assert profile['shared_length_comparison']['no_single_length_matches_both_radii_in_comparison_box'] is True
    assert profile['shared_length_comparison']['physical_radius_target_used_to_fit_source_or_length'] is False
    assert em['architecture']['interacting_Lorentz_covariance_or_physical_photon_claimed'] is False
    assert em['infinite_loop_charged_rest_certificate']['physical_isolated_electron_pole_or_measured_mass_fit'] is False
    assert running['input_ancestry']['Standard_Model_beta_function_inserted'] is False
    assert clock['passive_ground_state_time_crystal_or_self_starting_one_point_clock'] is False
    assert flux['fractional_spatial_texture_winding_or_stable_quark_identity_proved'] is False
    assert flux['physical_quark_masses_or_confinement_derived'] is False
    assert flux['preparation_and_failure']['native_pump']['exact_complete_Gram_sum']=='I_64'
    for item in (ym,transfer,spectrum):assert item['scope']['Clay_problem_solved'] is False
    assert ym['full_cube_certificate']['strict_positive_gap_certificate'] is True
    assert ym['full_cube_certificate']['all_link_representations_retained'] is True
    assert ym['scope']['finite_graph_unique_vacuum'] is True
    assert transfer['scope']['Y2_finite_regulator_positive_transfer_instantiated'] is True
    assert transfer['scope']['same_finite_graph_Hamiltonian_clock_identified'] is True
    assert ym['scope']['uniform_infinite_volume_gap_proved'] is False
    assert spectrum['scope']['physical_GeV_glueball_mass_claimed'] is False
    assert gravity['scope']['physical_G_or_Einstein_dynamics_derived'] is False
    assert wave['scope']['native_clock_and_wave_are_joint_observables_of_one_source'] is True
    assert wave['scope']['finite_native_clock_ratios_exactly_universal'] is False
    assert steps['same_two_cell_seven_calibrations_preserved'] is True
    assert steps['higher_graph_fit_preserved'] is False
    nuclear=next(x for x in strong['complete_nuclear_channels']if(x['spin'],x['isospin'],x['cell_parity'])==(1,0,1))
    excluded=[x for x in strong['complete_nuclear_channels']if(x['spin'],x['isospin'],x['cell_parity'])in((0,0,-1),(3,0,-1),(3,0,1))]
    assert all(x['strictly_above_compatible_breakup'] for x in excluded)
    masses=[]
    for x in strong['five_mass_calibrations']:
        masses.append({'name':x['candidate'],'target_GeV':scalar(x['target_GeV']),
            'computed_GeV':x.get('energy_GeV'),
            'interval_GeV':interval(x['energy_GeV_interval'])if'energy_GeV_interval'in x else None,'role':x['role']})
    finite=next(x for x in em['complete_native_executions']if(x['family'],x['cap'],x['time_exact'])==('electron',24,'4'))
    return {'task_count':10,'additional_pure_gauge_tasks':3,'visible_card_count':10,
        'strong':{'mass_fits':masses,'gA_interval':interval(strong['native_axial_ground']['gA_interval']),
            'binding_MeV_interval':[1000*x for x in interval(strong['deuteron_binding_calibration'])],
            'binding_target_MeV':1000*scalar(strong['input_ancestry']['deuteron_binding_calibration_target_GeV']),
            'deuteron_GeV_interval':interval(nuclear['ground_GeV_interval']),
            'complete_nuclear_dimension':sum(x['full_magnetic_dimension']for x in strong['complete_nuclear_channels']),
            'excluded_channels':[{'spin':x['spin'],'isospin':x['isospin'],'parity':x['cell_parity'],
                'above_breakup_MeV_interval':[-1000*z for z in reversed(interval(x['binding_GeV_interval']))]}for x in excluded],
            'unassigned_bound_channels':strong['all_unassigned_bound_nuclear_channels'],
            'neutral_pion_control':strong['held_out_neutral_pion_control'],
            'input_ancestry':strong['input_ancestry']['ancestry'],'boundaries':strong['boundaries']},
        'length':{'fm':scalar(strong['common_length_attachment']['a_fm']),
            'quadrupole_fm2_interval':interval(strong['common_length_attachment']['quadrupole_fm2_interval']),
            'tension_GeV_per_fm':scalar(strong['common_length_attachment']['illustrative_tension_GeV_per_fm']),
            'ancestry':strong['common_length_attachment']['ancestry'],
            'all_occupations_positive':strong['common_length_attachment']['full_Fock_positivity']['all_chain_lengths_and_all_local_occupations'],
            'local_irrep_count':len(cone['local_colour_census']['irreducible_rows'])},
        'profiles':{'source':profile['source'],'length_fm':scalar(profile['physical_length_fm_exact']),
            'mass_ordering_GeV':scalar(profile['mass_ordering_GeV_exact']),
            'rows':[{'name':x['assigned_channel'],'energy_GeV':scalar(x['trial_rest_energy_GeV']),
                'radius_squared_fm2_interval':interval(x['mean_square_charge_radius_fm2_interval']),
                'radial_charge':[{'radius_graph':y['radius_graph'],'radius_fm':scalar(y['radius_fm']),
                    'charge':scalar(y['trial_charge_exact']),'charge_interval':interval(y['ground_charge_interval'])}for y in x['native_signed_radial_charge']]}for x in profile['native_states']],
            'radius_ratio_interval':interval(profile['shared_length_comparison']['minus_neutron_over_proton_radius_squared_interval']),
            'observed_ratio_interval':interval(profile['shared_length_comparison']['observed_one_sigma_box_interval']),
            'physical_radius_fit':False,'success':scalar(profile['complete_physical_instrument']['filter_success_exact'])},
        'transverse':{'rest_GeV_interval':interval(em['infinite_loop_charged_rest_certificate']['charged_rest_minus_full_field_vacuum_GeV_interval_exact']),
            'truncation_TV_upper':scalar(finite['infinite_source_exact_Galerkin_original_record_TV_truncation_upper_exact']),
            'position_flux_table_error_upper':scalar(finite['infinite_source_original_position_flux_table_L1_half_error_upper_exact']),
            'record_count':len(em['complete_native_executions']),'native_rows':96,'physical_electron_pole':False},
        'running':{'alpha_inverse_input':scalar(running['input_ancestry']['alpha_inverse_supplied_exact']),
            'finest_rows':running['fixed_box_cutoff_controls'][-1]['rows'],
            'finest_side':running['fixed_box_cutoff_controls'][-1]['side'],
            'Ward':running['exact_gauge_Ward_and_diamagnetic_control'],'scope':running['scope']},
        'clocks':{'rows':[{'name':x['species'],'GeV':scalar(x['rest_energy_GeV_exact']),
            'frequency_Hz':x['clock_cycles_per_second_diagnostic']}for x in clock['native_rest_clock_rows']],
            'passive_onset':False,'measurement_work':'m/2','arbitrary_drive_rigidity':False},
        'flux':{'native_charges':[x['native_charge_exact']for x in flux['actual_native_hole_current_attachment']],
            'packet_visibility':next(x for x in flux['phase_visibility_refinement']if x['K']==4),
            'monodromy':flux['combined_monodromy_controls'],'texture_winding':False,'physical_quark_mass':False},
        'yang_mills':{'cube_gap_source_units':interval(ym['full_cube_certificate']['vacuum_gap_interval_exact']),
            'cube_side':ym['full_cube_certificate']['side'],'cube_links':ym['full_cube_certificate']['links'],
            'curvature_variance_lower':scalar(ym['full_cube_certificate']['plaquette_variance_lower_exact']),
            'volume_controls':[{'side':x['side'],'gap_lower':scalar(x['gap_lower_candidate_exact']),
                'strict_gap':x['strict_positive_gap_certificate']}for x in ym['fixed_coupling_volume_controls']],
            'plaquette_rows':[{'g_squared':scalar(x['g_squared_exact']),'gap':x['full_gap_interval_decimal']}for x in spectrum['executions']],
            'positive_transfer':True,'Clay_solved':False,'uniform_infinite_volume_gap':False,'GeV_glueball_mass':False},
        'gravity':{'positive_pairs':147,'all_attractive':gravity['exact_attraction']['all_147_positive_energy_pair_interactions_attractive'],
            'Newton_source_coefficient':gravity['dimensionless_Newton_coefficient_numeric'],
            'sites':wave['source']['field_vacuum_plus_sites']-1,'complete_dimension':wave['source']['full_source_dimension_without_idle_reference'],
            'records':wave['same_source_wave_comparison'],
            'clock_limit_interval':interval(wave['common_weak_probe_clock_bound']['limiting_common_clock_ratio_interval_exact']),
            'physical_G':False,'Einstein_dynamics':False,'finite_strength_universal_clocks':False},
        'strong_steps':{'chains':[{'cells':x['cells'],'singlets':x['complete_colour_singlet_dimension'],
            'GeV':x['ground_energy_GeV_diagnostic'],'gA':x['native_gA'],
            'coarse_gA':x['unrenormalized_compressed_axial_control'],
            'current_error_bound':scalar(x['isometric_current_compression_norm_error_upper'])}for x in steps['chains']],
            'higher_graph_fit_preserved':steps['higher_graph_fit_preserved'],
            'pinned_slope_GeV_per_fm':scalar(steps['full_source_constrained_potential']['exact_slope_GeV_per_fm']),
            'pinned_dimension':steps['full_source_constrained_potential']['complete_internal_singlet_dimension'],
            'scope':steps['bounds_and_scope']},
    }
