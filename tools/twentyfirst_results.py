"""Compact native source, electric-link, clock and scalar-refinement records."""
from fractions import Fraction as F
from twelfth_results import interval
NAMES=('native_observer_program','native_charged_propagation','native_moving_clock','native_electric_gauss','native_gauss_walk','native_gauss_clock','native_transport_spectrum','native_spatial_refinement','native_criterion_packet')

def point(x):return interval([x,x])

def project(r):
 p,w,c,e,g,t,s,v,q=(r[n]for n in NAMES)
 assert all(r[n]['verdict'].startswith('PASS')for n in NAMES)
 assert p['program_sha256']==g['common_program_sha256']==t['common_program_sha256']==q['common_program_sha256']==c['single_program_execution']['program_sha256']
 assert q['scope']['new_physical_criteria_validated']==0 and not q['criterion1']['physical_acceptance_complete']
 assert q['official_authority']['counts']=={'negative':0,'partial':0,'scored':0,'untested':31,'validated':0}
 assert len(q['official_authority']['all31_criteria'])==31 and all(x['upstream_status']['M10']=='🚧'for x in q['official_authority']['all31_criteria'])
 assert p['program']['carrier']['binary_configurations']==66
 assert e['extension_descriptor']==g['integer_extension']==t['integer_extension_descriptor']==p['integer_extension_protocol']['extension_descriptor']
 assert p['program']['hardware']==w['construction']==v['local_hardware']
 assert g['preparation']['link_limit']==p['program']['integer_extension']['link_window']==4
 assert g['preparation']['matching_labels']==[0,1] and g['preparation']['active_character']==1 and g['preparation']['uniform_events']==60
 assert p['physical_boundaries']['official_OpenWave_awards']==0
 assert not p['physical_boundaries']['physical_rest_masses_or_electric_units_derived']
 assert not w['scope']['physical_particle_spectrum_identified']and not w['scope']['OpenWave_physical_criterion_awarded']
 assert not c['scope']['local_autonomous_clock_proved']and not c['scope']['stationary_joint_generator_or_rest_pole_proved']
 assert e['physical_criterion_status']['OpenWave_row_promotions']==0
 assert g['scope']['same_evolved_source_tag_links_event_memory']and not g['scope']['undressed_source_spectrum_transferred']
 assert t['scope']['same_charged_source_field_and_clock']and not t['scope']['physical_rest_mass_identified']
 assert not t['scope']['native_dressing_decoder_compiled_by_this_package']and not t['scope']['local_autonomous_clock_proved']
 assert t['untracked_dressing_control']['canonical_dressing_probability']=='48179/81000'
 assert all(not x['alternative_measurements_inserted_into_clock_protocol']for x in t['same_joint_two_time_records'])
 assert not s['unit_contract']['physical_rest_mass_assignment']and not s['scope']['new_independent_GeV_prediction']
 assert not s['scope']['spectrum_of_flux_dressed_joint_electric_program']and not s['scope']['full_event_carrier_positive_gap']
 assert v['macro_dimension_declared']==3 and not v['original_geodesic_federation_modified']
 assert v['low_momentum_exact']['quadratic_coefficient']==[['1/8','0','0'],['0','1/8','0'],['0','0','1/8']]
 assert all(not v['scope'][x]for x in('four_dimensional_Yang_Mills_mass_gap','physical_light_speed_derived','physical_particle_masses_derived','OpenWave_criterion_awarded'))
 packets=[]
 for row in w['complete_source_packet_laws']:
  if row['character']==1:
   z=row['records'][-1];packets.append({'ports':row['ports'],'states':row['source_states'],'steps':z['steps'],'both_in_cell':interval(z['both_loads_in_first_cell_interval_exact']),'adjacent':interval(z['adjacent_pair_probability_interval_exact'])})
 tv=g['observed_electric_phase_response']
 retention=next(x for x in w['localization_protocol']['fixed_matching_code_retention']if x['character']==1)
 retained=next(x for x in retention['records']if x['steps']==1)
 assert retained['code_population_exact']=='67/90' and retained['source_code_failure_exact']=='23/90'
 dressing=g['electric_phase_joint_walk']['records'][-1]['canonical_dressing_readout']
 frames=t['exact_transported_matrix_units'];assert all(x['prepared_source_columns']==12 and x['complete_matrix_units']==144 and x['exact_complete_Gram_identity']for x in frames)
 assert all(x['full_inverse_basis_checks']==12 for x in frames)
 carrier=p['program']['carrier']
 return {'program':{'shape':[carrier['source_register'],carrier['memory_register'],carrier['event_register']],'primary_two_load_states':66,'same_program_sha256':p['program_sha256'],'original_commit_records':p['complete_protocols']['committed_event']['raw_records'],'compiler':[{'events':x['valid_events'],'padded':x['padded_events'],'pulses':x['reflection_native_pulses'],'operator_bound':point(x['reflection_bound']['full_word_operator_error_upper']),'direct_stored_columns':x['direct_stored_execution'].get('actual_stored_native_complete_columns',0)}for x in p['event_reflection_compilation']]},
  'joint':{'exact_gauss_zero':all(z['gauss_sector_probabilities']==[{'G':[0]*12,'probability':'1'}]for z in g['electric_phase_joint_walk']['records']),'source_field_rows':[x['nonzero_joint_arcs']for x in g['electric_phase_joint_walk']['records']],'electric_energy':[x['electric_energy_mean']for x in g['electric_phase_joint_walk']['records']],'outside_dressing':dressing['complete_outside_dressing_probability'],'canonical_dressing':dressing['canonical_dressing_probability'],'inverse_restores_full_state':all(x['full_state_exactly_restored']for x in g['electric_phase_joint_walk']['inverse_controls']),'third_step_source_TV':point(tv['three_step_source_pair_total_variation']),'third_step_response_lower':point(tv['three_step_response_lower_with_native_event_word_bound']),'tag_link_permutation_compiled':False},
  'clock':{'frames':[x['frame_index']for x in t['exact_transported_matrix_units']],'source_support_columns':frames[0]['prepared_source_columns'],'matrix_units_per_frame':frames[0]['complete_matrix_units'],'joint_coordinates':[x['nonzero_complete_source_tag_link_event_rows']for x in t['exact_transported_matrix_units']],'quadrature_axes':[x['axis']for x in t['same_joint_two_time_records']],'error_domain':'Initial two-word matching code, canonically dressed, with arbitrary untouched references; full apparatus implementation errors additional.','decoder_compiled':False,'local_autonomous_clock':False,'alternative_field_and_clock_instruments':True},
  'packets':packets,'contact':{'identity':w['native_contact_identity']['identity'],'rank':w['native_contact_identity']['contact_rank'],'additional_interaction_parameter':w['native_contact_identity']['added_interaction_parameter']},
  'localization':{'first_half_survival_steps':[{'character':x['character'],'steps':x['first_monitored_survival_below_half']}for x in w['localization_protocol']['continuous_first_exit_instruments']],'physical_lifetime':None,'fixed_code_population':retained['code_population_exact'],'fixed_code_failure':retained['source_code_failure_exact'],'compact_minus_modes':[x['complete_minus_one_band_compact_basis']['sum_equals_entire_minus_one_eigenspace']for x in w['compact_localized_apparatus_modes']['members']],'compact_preparation_overlap':w['compact_localized_apparatus_modes']['uniform_A_packet_population_exact'],'compact_modes_are_particles':False},
  'spectrum':{'rows':[{'character':x['character'],'laplacian':interval(x['compression_L_min_interval_exact']),'phase_energy_GeV':interval(x['conditional_phase_energy_GeV_interval_exact'])}for x in s['rows']],'clock':'1/sqrt(2M) source phase-time units per coherent event','electron_anchor_GeV':s['unit_contract']['electron_anchor_GeV_exact'],'full_event_gap':False,'joint_electric_spectrum':False,'physical_rest_mass':False,'even_character_gap_collapses_in_stated_enlargement':True},
  'spatial':{'ports':[x['ports']for x in v['source_members']],'quadratic_coefficient':'1/8','dimensionless_speed':'1/2','remainder':'(3/8)*max|k|^4','momentum_domain':'max|k|<=1/2','refinements':[{'size':x['periodic_size'],'omega_squared':interval(x['continuum_frequency_squared_interval_exact']),'limit':interval(x['continuum_limit_frequency_squared_interval_exact'])}for x in v['refinement_family']],'large_graphs_fully_enumerated':False,'fine_reflection_compiled':False,'physical_light_speed':False,'four_dimensional_Yang_Mills':False},
  'same_local_source_field_clock_interface':True,'all_sources_one_physical_theory':False,'new_GeV_rest_masses':[],'official_validated_rows':q['official_authority']['counts']['validated'],'official_untested_rows':q['official_authority']['counts']['untested'],'new_independent_nature_validation':False}
