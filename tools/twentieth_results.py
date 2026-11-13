"""Compact common-hardware results with complete calibration and program scopes."""
from fractions import Fraction
from twelfth_results import interval
NAMES=('coherent_native_architecture','coherent_native_propagation','active_native_charge','native_charge_readout','native_coherent_clock','native_calibrated_energy','native_euclidean_transfer')

def project(r):
 a=r[NAMES[0]];w=r[NAMES[1]];q=r[NAMES[2]];z=r[NAMES[3]];c=r[NAMES[4]];e=r[NAMES[5]];t=r[NAMES[6]]
 assert all(r[n]['verdict'].startswith('PASS')for n in NAMES)
 assert w['construction']==a['construction']==c['shared_charge_clock_program']['common_hardware']==z['shared_construction']
 assert not a['official_OpenWave_row_award']and not w['physical_OpenWave_row_award']
 assert not w['original_unread_quantum_channel_equals_swap_trace']and not w['physical_clock_or_speed']
 assert not q['scope']['physical_electric_charge_identified']and not q['scope']['physical_quark_identified']
 assert not z['matching_clock_recovery_join']['uncompensated_clock_theorem_transferred']
 assert z['matching_clock_recovery_join']['nonzero_charge_witness']['coherence_multiplier_real_exact']=='85/96'
 assert z['actual_coupled_source_records']['unconditional_label_record_covariance_exact']=='3/8'
 assert z['altered_voltage_control']['unconditional_label_record_covariance_exact']=='0'
 assert not c['scope']['literal_OpenWave_row3_complete']and not c['scope']['three_spectator_values_are_three_lepton_species']
 assert e['energy_attachment']['absolute_gap_ratios_exact']==['1','3','12']
 assert not e['energy_attachment']['physical_rest_pole_or_particle_identification']and not e['energy_attachment']['new_independent_GeV_prediction']
 assert not e['energy_attachment']['literal_three_lepton_ratio_match']
 assert all(not t['scope'][k]for k in ('four_dimensional_field_limit','uniform_physical_continuum_gap','pure_yang_mills_identification','OpenWave_criterion_awarded'))
 packet=[]
 for item in w['packets']:
  if item['radius']==2:
   row=item['records'][-1]
   packet.append({'ports':item['ports'],'steps':row['coherent_steps'],'outside_ball':interval(row['outside_preparation_ball_probability_interval']),'distance':interval(row['mean_graph_distance_interval'])})
 members=[t['two_load_twelve_port_member']]+t['one_load_spatial_members']
 return {'architecture':{'local_addresses':a['coherent_event_address_dimension'],'raw_slots':a['native_complete_raw_alphabet'],'common_hardware':True,'one_interchangeable_evolution':False},
  'charge':{'characters':q['algebra']['commutant_complex_dimension'],'active_dimension':q['complete_local_instruments']['full_active_carrier_dimension'],'compiled_columns':z['matching_clock_recovery_join']['padding_and_initialization'],'covariance':z['actual_coupled_source_records']['unconditional_label_record_covariance_exact'],'control_covariance':'0','uncompensated_coherence':'85/96','feedback_columns':c['shared_charge_clock_program']['all_source_memory_columns'],'maximum_added_pulses':c['shared_charge_clock_program']['maximum_added_native_pulses_per_event'],'physical_charge':False},
  'clock':{'signed_gaps':c['signed_gaps_exact'],'records':len(c['repeated_records']),'blocks':2,'physical_self_starting_clock':False},
  'energies':[{'spectator':x['spectator'],'source_gap':x['absolute_source_gap_exact'],'calibrated_GeV':float(Fraction(x['anchor_scaled_gap_GeV_exact'])),'inferred_GeV':interval(x['record_inferred_anchor_scaled_gap_GeV_interval_exact'])}for x in e['energy_attachment']['rows']],
  'interaction':[{'law':x['law'],'negativity_lower':float(Fraction(x['complete_binary_vs_spectator_syndrome_negativity_lower_exact'])),'negativity_lower_interval':interval([x['complete_binary_vs_spectator_syndrome_negativity_lower_exact']]*2)}for x in e['interaction']['finite_entanglement_controls']],
  'packet':{'rows':packet,'fine_reflection_compiled':w['fine_graph_full_reflection_compiled'],'zero_mode':True,'physical_speed':False},
  'euclidean':{'members':[{'states':x['states'],'gap':interval([x['event_hamiltonian_gap_lower_exact'],x['event_hamiltonian_gap_upper_exact']])}for x in members],'fourth_cumulant':t['non_gaussian_stationary_occupation_fourth_cumulant_exact'],'four_dimensional_Yang_Mills':False},
  'calibrated_transitions_are_physical_rest_masses':False,'lepton_hierarchy_matched':False,'joint_spatial_charged_particle_and_clock_implemented':False,'new_GeV_rest_masses':[],'new_independent_nature_validation':False,'official_untested_rows':31}
