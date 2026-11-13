"""Source-bound packet, spatial-gauge and classical-limit records."""
from math import nextafter, inf
from twelfth_results import scalar, interval


def lower(x): return nextafter(scalar(x), -inf)
def upper(x): return nextafter(scalar(x), inf)


def project(r):
    b, p, s = (r[k] for k in ('uniform_pole_bands', 'normalizable_particle_records', 'scattering_current_support'))
    assert b['circle_cover']['every_real_momentum_covered'] is True
    assert b['mass_or_current_parameter_refitted'] is False
    assert b['physical_four_dimensional_particle_dictionary_proved'] is False
    assert b['full_source_spectrum_replaced_by_three_coordinates'] is False
    assert p['normalizable_packet']['exact_L2_norm_squared'] == '1'
    assert p['normalizable_packet']['finite_ring_or_delta_momentum_substitution'] is False
    assert p['complete_protocol']['finite_local_compilation_of_exact_band_filter_proved'] is False
    assert p['physical_four_dimensional_particle_identification'] is False
    assert p['autonomous_beta_decay_or_lifetime_proved'] is False
    assert p['new_empirical_parameter_or_mass_fit'] is False
    assert s['physical_Lambda_decay_amplitude_proved'] is False
    assert s['physical_Lambda_lifetime_proved'] is False
    assert s['complete_Lambda_pole_transfer']['normalizable_Lambda_packet_executed'] is False
    assert s['interacting_spectral_test']['Moller_wave_operator_constructed'] is False
    assert s['actual_kinetic_substep']['complete_autonomous_strong_Hamiltonian_used'] is False
    assert s['actual_kinetic_substep']['full_infinite_N5_kinetic_carrier_retained'] is True
    c, f, h = (r[k] for k in ('cubic_haar_source','haar_coupling_flow','gauge_refinement_clock'))
    assert c['representation_projection_is_source_cutoff'] is False
    assert c['physical_gap_GeV_or_continuum_identification'] is False
    assert c['graph']['spatial_coordinate_dimensions'] == 3
    assert c['new_empirical_fit_inputs'] == []
    assert f['Yang_Mills_continuum_constructed'] is False
    assert f['all_tested_gap_slopes_positive'] is True
    assert h['scope']['autonomous_full_Hamiltonian_RG_derived'] is False
    assert h['scope']['continuum_noncollapse_proved'] is False
    assert h['scope']['spatial_link_and_face_degrees_actually_added'] is True
    cube = next(x for x in c['records'] if x['g_squared_exact'] == '16')
    assert cube['all_source_representations_retained'] is True
    adjacent = [x for x in cube['all_fifteen_connected_covariances'] if not x['opposite']]
    assert len(adjacent) == 12
    assert len(cube['complete_joint_Wilson_instrument']['all_sixty_four_outcomes']) == 64
    w, g, v = (r[k] for k in ('staggered_ward','replicated_geometry','capacity_perturbations'))
    assert w['scope']['checkerboard_ambiguity_removed_on_declared_scalar_graph'] is True
    assert w['scope']['co_located_nine_null_observer_instrument_derived'] is False
    assert w['scope']['physical_metric_or_stress_derived'] is False
    assert g['scope']['physical_Newton_strength_matched'] is False
    assert g['scope']['physical_Einstein_spacetime'] is False
    assert g['complete_ground_to_classical_limit']['dynamical_or_spatial_classical_limit'] is False
    geo = next(x for x in g['complete_register_records'] if x['registers'] == 256)
    assert geo['complete_geometry_dimension'] == 2**256
    assert v['scope']['new_observational_match'] is False
    assert v['scope']['native_observer_perturbation_dynamics_derived'] is False
    assert v['required_completion']['adiabatic_barotropic_attachment_rejected'] is True
    scalar_completion = v['canonical_scalar_completion']
    assert scalar_completion['source_scalar_transfer_proved'] is False
    assert scalar_completion['full_gravity_perturbation_or_CMB_fit_proved'] is False
    assert scalar_completion['V_second_derivative_over_H_squared_bounds_exact'] == ['2','6']
    return {
      'packets': {
        'band_probability_lower': min(lower(x['uniform_band_projector_probability_lower']) for x in p['members']),
        'inside_probability_lower': min(lower(x['position_record']['band_conditioned_inside_probability_lower']) for x in p['members']),
        'position_radius_cells': p['members'][0]['position_record']['radius_cells'],
        'position_variance_cells_squared': scalar(p['normalizable_packet']['position_variance_cells_squared_exact']),
        'all_momentum_gap_lower': min(lower(x['all_momentum_gap_lower_source']) for x in b['members']),
        'packet_axial_interval': interval(p['uniform_native_weak_packet_records']['axial']['uniform_source_pole_amplitude_magnitude_interval']),
        'physical_4D_particles': False, 'finite_local_band_filter': False,
      },
      'strange': {
        'independent_proton_pion_fields': s['exact_CAR_channel']['independent_composite_rank'],
        'proton_pion_response_squared': interval(s['complete_Lambda_pole_transfer']['proton_pion_compact_response_norm_squared_interval']),
        'kinetic_words': s['actual_kinetic_substep']['literal_hopping_words'],
        'normalizable_Lambda_packet': False, 'on_shell_decay': False,
      },
      'cube': {
        'g_squared':16, 'spacing':1, 'gap_source_units':interval(cube['full_source_gap_interval_exact']),
        'adjacent_covariance':interval(adjacent[0]['connected_covariance_interval_exact']),
        'complete_instrument_outcomes':64, 'Haar_representations_complete':True,
        'physical_GeV':False, 'continuum_4D':False,
        'coupling_derivatives_certified':len(f['records']),
        'fine_vertices':h['geometry']['fine_vertices'], 'fine_links':h['geometry']['fine_links'], 'fine_faces':h['geometry']['fine_faces'],
        'coarse_Wilson_leading':'κ⁴/64', 'full_Hamiltonian_RG':False,
      },
      'geometry': {
        'registers':256, 'q_exact':g['architecture']['q_exact'],
        'relative_vacuum_variance_upper':upper(geo['vacuum_lapse']['relative_variance_upper_interval'][1]),
        'static_ground_error':g['complete_ground_to_classical_limit']['upper_error'],
        'physical_G_matched':False, 'spatial_Einstein_limit':False,
      },
      'cosmology': {
        'scalar_curvature_bounds':[2,6], 'rest_sound_speed_squared':1,
        'barotropic_sound_speed_upper':upper(v['uniform_past_certificate']['global_past_upper_exact']),
        'source_scalar_particle':False,'CMB_fit':False,'new_Nature_match':False,
      },
      'new_independent_nature_validation':False,
    }
