"""Bounded complete-dynamics records with explicit calibration and limit guards."""
from math import nextafter, inf
from fractions import Fraction
from twelfth_results import scalar, interval
NAMES=('full_strong_current','lambda_wavepacket','cluster_weyl_sequence','refined_haar_source','refined_haar_spectrum','haar_memory_closure','tensor_record_transport','collective_gravity_strength','capacity_transfer')
def lower(x): return nextafter(scalar(x),-inf)
def upper(x): return nextafter(scalar(x),inf)
def project(r):
    def false(name,*path):
        v=r[name]
        for k in path:v=v[k]
        assert v is False,(name,path)
    for name,path in [
      ('full_strong_current',('physical_3plus1_decay_or_lifetime_proved',)),
      ('full_strong_current',('outgoing_Moller_wave_operator_or_on_shell_weak_spectral_density_proved',)),
      ('lambda_wavepacket',('physical_3plus1_Lambda_identification',)),
      ('lambda_wavepacket',('calibrated_energy','mean_energy_is_rest_mass')),
      ('lambda_wavepacket',('new_independent_match_with_nature',)),
      ('cluster_weyl_sequence',('outgoing_wave_operator_constructed',)),
      ('cluster_weyl_sequence',('nonzero_native_weak_on_shell_spectral_density_proved',)),
      ('cluster_weyl_sequence',('constructive_Weyl_family','finite_local_observer_preparation_of_exact_spectral_vectors_compiled')),
      ('refined_haar_source',('uniform_repeated_refinement_or_4D_limit_proved',)),
      ('refined_haar_spectrum',('physical_GeV_calibration_or_new_Nature_validation',)),
      ('haar_memory_closure',('retained_201_modes_exactly_autonomous',)),
      ('tensor_record_transport',('scope','quantum_curvature_acquisition_from_native_source_proved')),
      ('collective_gravity_strength',('scope','independent_Newton_prediction')),
      ('collective_gravity_strength',('scope','new_Nature_validation')),
      ('capacity_transfer',('scope','CMB_large_scale_structure_likelihood')),
      ('capacity_transfer',('scope','new_Nature_validation'))]: false(name,*path)
    assert r['full_strong_current']['rigorous_finite_time']['nonzero_complete_autonomous_response_proved'] is True
    assert r['cluster_weyl_sequence']['energy_shell']['complete_interacting_H5_essential_spectrum_contains_native_Lambda_rest_energy'] is True
    p=r['lambda_wavepacket']; h=r['haar_memory_closure']; g=r['collective_gravity_strength']['calibrated_member']; c=r['capacity_transfer']
    assert p['normalizable_state']['actual_normalizable_Lambda_trial_constructed'] is True
    assert p['normalizable_state']['exact_L2_norm_squared']=='1'
    assert r['refined_haar_spectrum']['fine_interior_modes_are_retained'] is True
    assert h['actual_computed_self_energy']['all_Q_representations_and_multiplicities_in_remainder'] is True
    assert 'observed Newton' in g['calibration_input'] and g['electron_anchor_changed'] is False
    assert r['collective_gravity_strength']['all_N_theorem']['huge_carrier_enumerated_or_simulated'] is False
    mem=next(x for x in h['same_clock_semigroup_defect_controls']if x['time_exact']=='1/1024')
    assert mem['comparison_is_same_Haar_vacuum_probe'] is True
    frame=r['refined_haar_source']['source_checks']
    assert [frame[k] for k in ('vertices','links','elementary_faces','complete_frame_dimension','all_face_frame_columns_checked')]==[27,54,36,201,7236]
    assert 1/Fraction(mem['retained_upper_divided_by_boundary_lower_exact'])>225
    return {
      'strange':{'rest_GeV':interval(p['calibrated_energy']['source_rest_pole_GeV_interval']),
        'packet_mean_GeV':interval(p['calibrated_energy']['trial_packet_mean_GeV_interval']),
        'band_probability_lower':lower(p['complete_source_pole']['unfiltered_trial_ground_band_probability_lower']),
        'position_variance_cells_squared':scalar(p['normalizable_state']['position_variance_cells_squared_exact']),
        'normalizable_packet':True,'full_strong_local_response':True,'essential_breakup_spectrum':True,
        'on_shell_decay':False,'weyl_observer_preparation':False},
      'gauge':{'vertices':frame['vertices'],'links':frame['links'],'faces':frame['elementary_faces'],'frame':frame['complete_frame_dimension'],
        'records':[{'source':x['source'],'a':scalar(x['spacing_exact']),'g2':scalar(x['g_squared_exact']),'gap':interval(x['full_gap_interval_exact'])}for x in r['refined_haar_spectrum']['records']],
        'self_energy_entries':h['actual_computed_self_energy']['nonzero_entries'],
        'zero_energy_self_energy_error_upper':upper(h['actual_computed_self_energy']['full_Sigma0_minus_computed_matrix_norm_upper_exact']),
        'probe_memory_improvement_lower':lower(1/Fraction(mem['retained_upper_divided_by_boundary_lower_exact'])),
        'physical_GeV':False,'continuum_4D':False},
      'gravity':{'registers_exact':str(g['registers']), 'G_GeV_minus2':interval(g['conditional_Newton_GeV_minus2_interval_exact']),
        'readout_work_GeV':scalar(g['nonselective_coordinate_readout_work_GeV_exact']),
        'calibrated_to_observed_G':True,'independent_prediction':False,'quantum_curvature_acquisition':False},
      'cosmology':{'rows':[{'k_H0':x['capacity']['k_over_H0'],'matter_transfer_ratio':x['present_comoving_matter_transfer_ratio_to_lambda']}for x in c['numerical_transfer_comparisons']],
        'exact_constraint':'C_N = −(3 + 2h) C','observed_match':False,'interval_error_certificate':False,'CMB_fit':False},
      'new_independent_nature_validation':False,
    }
