"""Compact exact native-process results, with source and physical scopes retained."""
from fractions import Fraction
from twelfth_results import interval
NAMES=('native_process','native_response','native_defect_records','native_event_clock','native_packet_propagation','native_interaction','native_rest_energy','native_geometry_readout','native_capacity_history','native_platform_gate')
def project(r):
 p=r['native_process'];s=r['native_response'];d=r['native_defect_records'];c=r['native_event_clock'];w=r['native_packet_propagation'];i=r['native_interaction'];e=r['native_rest_energy'];g=r['native_geometry_readout'];a=r['native_capacity_history'];o=r['native_platform_gate']
 assert all(r[n]['verdict'].startswith('PASS') for n in NAMES)
 assert p['architecture']['target_Hamiltonian_accepted'] is False
 assert s['scope']['continuum_dispersion_or_physical_particle_identification'] is False
 assert d['local_source_algebra']['extra_coherent_memory_included'] is False
 assert c['scope']['physical_mass_phase_or_GeV_assignment'] is False
 assert e['rest_energy_test']['energy_clock_attachment_proved'] is False
 assert e['rest_energy_test']['physical_rest_mass_interval_GeV'] is None
 assert w['physics']['persistent_coherent_moving_packet'] is False
 assert g['coherent_extension']['native_repair_alone_implements_coherent_service'] is False
 assert g['geometry_join']['Einstein_continuum_proved'] is False
 assert a['normalization_symmetries']['H0_or_Lambda_or_primordial_amplitude_selected'] is False
 assert o['scope']['new_official_awards']==0 and o['execution']['maintainer_run_or_upstream_acceptance'] is False
 assert o['official_status']['upstream_counts']['M10']==dict(negative=0,partial=0,scored=0,untested=31,validated=0)
 assert c['mode_records'][0]['event_multiplier_exact']==['11/12','1/60']
 assert [x['operational_zero_imbalance_difference_exact']for x in i['two_recording_block_results']]==['1/4','3/64']
 packet=[{'ports':x['ports'],'radius':x['packet_graph_radius'],'held_out':x['held_out_width'],'attempts':t['original_attempt_count'],'time':float(Fraction(t['intensity_time_exact'])),'arrival':interval(t['first_current_record_arrival_distance_four_interval_exact']),'distance':interval(t['mean_graph_distance_interval_exact'])}for x in w['packets']for t in x['times']]
 return {'process':{'ports':[x['ports']for x in p['complete_federation_tapes']],'histories':[x['output']['complete_raw_blocks']for x in p['complete_federation_tapes']],'causal_order_equal':all(x['complete_terminal_instrument_equal_after_event_relabelling']for x in p['complete_federation_tapes'])},
 'response':{'ports':[x['ports']for x in s['graphs']],'cell_memory':[interval([x['two_step_uniform_cell_memory_l1_exact']]*2)for x in s['graphs']],'native_cosine_transfer':False},
 'charge':{'algebra':d['local_source_algebra']['generated_star_algebra'],'protected_fractional_charge':False},
 'clock':{'multipliers':[x['event_multiplier_exact']for x in c['mode_records']],'basis_columns':c['complete_basis_current_control']['basis_columns'],'raw_basis_checks':c['complete_basis_current_control']['raw_nonhold_slots_checked'],'events':4,'expanded_four_event_tree':False,'physical_rest_mass':False},
 'interaction':{'rows':[{'blocks':x['two_event_blocks'],'pair_difference':x['pair_density_difference_exact'],'record_difference':x['operational_zero_imbalance_difference_exact']}for x in i['two_recording_block_results']],'current_covariance':i['actual_record_current_moments_exact']['connected_current_correlation'],'matrix_units':i['complete_operator_control']['matrix_units_checked'],'physical_field_unitary':False},
 'packet':{'records':packet,'local_powers':w['reduction']['exact_local_power_count'],'coherent_translation':False,'physical_speed':False},
 'geometry':{'repair_phase_TV':g['repair_only']['phase_twin_total_variation_exact'],'extended_phase_TV_diagnostic':g['coherent_extension']['phase_twin_total_variation'],'matrix_units':g['coherent_extension']['matrix_units_checked'],'coherent_service_supplied':True,'Einstein_continuum':False},
 'capacity':{'kernel_identical':a['exported_archive_plus_FIFO_kernel_identical'],'complete_history_blocks':a['all_history_blocks'],'physical_normalization':False},
 'platform':{'raw_slots':o['native_execution']['complete_raw_slots'],'operator_columns':len(o['native_execution']['all_endpoint_matrix_units']),'author_side_execution':True,'official_validated':0,'official_untested':31},
 'new_GeV_rest_masses':[],'new_independent_nature_validation':False}
