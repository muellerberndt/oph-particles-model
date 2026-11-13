"""Source-bound spectrum, current, photon and fixed-spacing gauge results."""
from fractions import Fraction as F
from math import nextafter,inf


def scalar(x):return float(F(x))
def interval(x):return[nextafter(scalar(x[0]),-inf),nextafter(scalar(x[1]),inf)]


def project(r):
    strange=r['strange_composites'];nuclear=r['light_nuclear_curve'];bulk=r['hadron_refinement_flow']
    centre=r['native_centre_string'];core=r['dressed_core_response'];clock=r['autonomous_clock_channel']
    em=r['dirac_maxwell_refinement'];gravity=r['transverse_gravity'];ym=r['su2_volume_gap'];cosmo=r['capacity_stress']
    assert strange['native_nonleptonic_vertex_and_obstruction']['strong_channel_is_kinematically_open'] is False
    assert nuclear['mass_comparisons']['triton']['role']=='calibration'
    assert nuclear['mass_comparisons']['helion']['matches']is False and nuclear['mass_comparisons']['alpha']['matches']is False
    assert ym['scope_limits']['Clay_Yang_Mills_problem_solved']is False
    assert ym['scope_limits']['spatial_continuum_positive_mass_gap_proved']is False
    assert ym['scope_limits']['numerical_uniform_gap_or_threshold_provided']is False
    assert em['construction']['is_canonical_signed_Dirac_plus_Maxwell_unitary_transfer']is False
    assert core['physical_QED_running_or_resolved_electron_core_fit']is False
    assert all(x['complete_core_probe']['order_one_core_onset_resolved']is False for x in core['members'])
    assert clock['scope']['autonomous_internal_phase_onset_established_by_these_records']is False
    assert centre['scope']['continuous_order_parameter_winding_derived']is False
    assert gravity['scope']['physical_Newton_strength_derived']is False
    assert gravity['independent_energy_length_attachment']['physical_G_strength_match']is False
    assert cosmo['openwave_row28_promotion']is False
    emrows=[]
    for name in ('electron','muon','tau'):
        rows=[x for x in em['complete_executions']if x['family']==name]
        boxes=[interval(x['conditional_GeV_rest_interval_exact'])for x in rows]
        box=[max(x[0]for x in boxes),min(x[1]for x in boxes)];assert box[0]<box[1]
        emrows.append({'family':name,'source_reference_energy_GeV_interval':box,'caps':[x['cap']for x in rows]})
    return {'task_count':10,'visible_card_count':10,
        'strange':{'masses':[{k:x[k]for k in('name','computed_GeV','comparison_GeV','comparison_role','difference_GeV')}for x in strange['mass_rows']],
            'ancestry':strange['calibration_ancestry'],'scope':strange['scope'],
            'nonleptonic_floor_GeV':scalar(strange['native_nonleptonic_vertex_and_obstruction']['strong_N4q_1antiquark_channel_floor_GeV']),
            'nonleptonic_gap_GeV':scalar(strange['native_nonleptonic_vertex_and_obstruction']['rigorous_channel_gap_above_Lambda_ground_GeV']),
            'on_shell_strange_channel_open':False,'baryon_singlets':strange['source_sector_sizes']['baryon_colour_singlets'],
            'meson_singlets':strange['source_sector_sizes']['meson_colour_singlets']},
        'bulk':{'neutron_GeV_interval':interval(bulk['selected_bulk_neutron']['full_source_GeV_interval']),
            'proton_GeV_interval':interval(bulk['selected_bulk_proton_GeV_interval']),
            'axial_interval':interval(bulk['selected_bulk_neutron']['full_source_axial_interval']),
            'vector_current_exact':bulk['native_vector_current_exact'],'ancestry':bulk['calibration_ancestry'],'scope':bulk['scope']},
        'nuclear':{'masses':[{'name':name,'GeV_interval':interval(x['source_GeV_interval']),'target_GeV':scalar(x['target_GeV']),
            'role':x['role'],'matches':x.get('matches')}for name,x in nuclear['mass_comparisons'].items()],
            'graphs':[{'cells':x['cells'],'full_dimension':x['complete_physical_N3A_colour_singlet_dimension'],
                'low_dimension':x['complete_low_magnetic_dimension'],'error_GeV':scalar(x['uniform_low_energy_error_GeV'])}for x in nuclear['complete_graphs']],
            'scope':nuclear['scope'],'additional_calibration':nuclear['additional_calibration']},
        'centre':{'rows':[{'cells':x['cells'],'charge':x['native_total_charge_exact'],'singlets':x['complete_singlet_dimension'],
            'nontrivial_ground_string_diagnostic':x['ground_nontrivial_string_probability_diagnostic'],
            'continuous_texture_winding':x['continuous_order_parameter_texture_winding_proved']}for x in centre['complete_spatial_executions']],
            'architecture':centre['architecture'],'scope':centre['scope']},
        'core':{'rows':[{'family':x['family'],'Wilson':x['ground_certificate']['Wilson_energy_coefficient_exact'],
            'radius_cells_interval':interval(x['complete_core_probe']['radius_x_cells_interval_exact']),
            'largest_suppression_interval':interval(x['complete_core_probe']['largest_first_Brillouin_zone_suppression_interval_exact']),
            'resolved_core_onset':x['complete_core_probe']['order_one_core_onset_resolved'],
            'response':[{'frequency':scalar(y['imaginary_frequency_exact']),'interval':interval(y['full_infinite_source_response_interval_exact'])}
                for y in x['native_current_response']['certified_infinite_response']]}for x in core['members']],
            'physical_running_fit':False},
        'clock':{'masses':[{'name':x['species'],'GeV':scalar(x['rest_energy_GeV_exact']),'Hz':x['clock_cycles_per_second_diagnostic']}for x in clock['native_single_branch_masses_and_frequencies']],
            'bands':[{'array_size':x['cap'],'linewidth_interval':interval(x['linewidth_source_units_interval_exact'])}for x in clock['exact_complete_coherence_bands']if x['coherence_order']==1],
            'scope':clock['scope'],'battery':clock['battery'],'autonomous_phase_onset_established':False},
        'electromagnetism':{'rest_rows':emrows,'common_speed_squared':scalar(em['construction']['common_free_speed_squared_exact']),
            'full_flux_and_Pauli_commutator':em['construction']['Pauli_magnetic_commutator_retained'],
            'physical_pole_fit':False,'interacting_Lorentz_limit':False,'refinement':em['free_three_dimensional_refinement']['scope']},
        'gravity':{'records':gravity['same_source_photon_comparison'],'dimensions':gravity['source']['complete_vacuum_one_photon_native_dimension'],
            'transverse_modes':gravity['source']['transverse_one_photon_dimension'],'unit_test':gravity['independent_energy_length_attachment'],
            'physical_G':False,'scope':gravity['scope']},
        'yang_mills':{'source':ym['source'],'proved':ym['proved_conclusions'],'scope':ym['scope_limits'],
            'curvature_variance_lower':scalar(ym['physical_nontriviality']['existential_neighborhood_variance_strict_lower_exact']),
            'graph_sides':[x['side']for x in ym['complete_graph_audits']],
            'numeric_threshold':False,'Clay_solved':False},
        'cosmology':{'comparisons':[{k:x[k]for k in('table','rows','sps_column','chi_square','anchors','fitted_chronometer_parameters','conditional_chi_square_tail_diagnostic')}for x in cosmo['comparisons']],
            'calibration':cosmo['calibration_boundary'],'source':cosmo['source'],'Lambda_amplitude_derived':False}}
