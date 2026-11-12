"""Compact, source-domain checked projection of the complete finite instruments."""
from fractions import Fraction as F
import math

SOURCES={
 'clock_energy':('lepton_clock_energy/results.json','Lepton cycles on a complete native clock'),
 'archive_compression':('lepton_archive_compression/results.json','Exact quantum archive compression'),
 'sector_measure':('quantum_sector_measure/results.json','Quantum sector measure and stationary algebra'),
 'finite_spectroscopy':('finite_particle_spectroscopy/results.json','Finite-time joint mass spectroscopy'),
 'neutrino_observables':('neutrino_mass_observables/results.json','Conditional neutrino mass observables'),
 'flavour_transport':('native_flavour_transport/results.json','Native transported family and CP readout'),
 'bath_mixing':('native_bath_mixing/results.json','Certified native bath mixing and cooling lag'),
 'quantum_relaxation':('quantum_thermal_relaxation/results.json','Complete quantum particle bath and cooling'),
 'expanding_particles':('expanding_quadratic_particles/results.json','Particle records under declared expansion'),
 'paired_quark_scale':('paired_hadron_quark_scale/results.json','Paired hadron scales and bare Wilson GeV values'),
}

def require(value,message):
 if not value:raise ValueError(message)

def interval(pair):return [float(F(x)) for x in pair]

def project(r):
 for key,(path,_) in SOURCES.items():
  require(r[key]['schema']=='oph.'+path.split('/')[0]+'.v1','current receipt schema differs: '+key)
  if key!='sector_measure':require(r[key].get('all_checks_pass') is True,'current receipt failed or success flag absent: '+key)
 a=r['archive_compression'];clock=r['clock_energy'];s=r['finite_spectroscopy'];n=r['neutrino_observables'];q=r['paired_quark_scale']
 require(a['scope']['exact_ideal_instrument_and_full_archive_isometry'] and not a['scope']['original_record_histories_erased_or_coarsened'] and
         not a['scope']['physical_work_or_autonomous_reset_derived'],'archive domain differs')
 archive=[]
 for run,cost in zip(a['complete_bounded_runs'],a['resources'],strict=True):
  require(len(run['all_original_histories'])==4**run['rounds'] and abs(run['complete_probability_sum']-1)<1e-11,'archive histories differ')
  archive.append({'rounds':run['rounds'],'ranks':run['rank_counts'],'original_qubits':run['padded_archive_qubits_without_compression'],
   'quantum_qubits':run['worst_case_quantum_archive_qubits'],'classical_bits':run['retained_classical_original_record_bits'],
   'compression_pulses':cost['additional_native_compression_pulses_worst_case'],
   'records':[{'history':h['original_history'],'rank':h['minimal_quantum_rank'],'probability':h['original_probability_maximally_entangled_input']} for h in run['all_original_histories']]})
 require(len(s['complete_records'])==8010 and s['finite_pointer_qubits']==5 and len(s['conditional_GeV_menu'])==17 and
         not s['scope']['neutrino_species_resolved_by_executed_five_qubit_pointer'] and
         not s['scope']['calibrated_action_coefficients_are_independent_predictions'],'finite spectroscopy scope or complete law differs')
 require(abs(math.fsum(x['probability'] for x in s['complete_records'])-1)<1e-12,'finite spectroscopy original law differs')
 confidence=s['uniform_confidence']
 require(confidence.get('coverage_domain')=='normalized one-excitation inputs at detector entrance' and
         confidence.get('all_input_bad_phase_effect_bound')=='F_bad <= (7/72) P_one' and
         confidence.get('complete_original_probe_bound')=='sum A^dagger F_bad A <= (7/72) sum A^dagger P_one A' and
         confidence.get('vacuum_many_excitation_outcomes_supply_mass_interval') is False and
         confidence.get('all_source_unconditional_65_over72_coverage_claimed') is False,'mass confidence domain or original-weight bound differs')
 require(F(confidence['original_good_mass_interval_weight_lower_exact'])==F(65,72)*F(confidence['original_one_excitation_weight_exact']) and
         F(confidence['original_one_excitation_weight_exact'])+F(confidence['original_terminal_no_mass_interval_weight_exact'])==1,'unconditional mass coverage bookkeeping differs')
 require(s['adaptive_pointer']['exact_all_input_instrument_equivalence'] and s['adaptive_pointer']['reusable_quantum_qubits']==1 and
         s['adaptive_pointer']['retained_original_classical_bits']==5 and len(s['adaptive_pointer']['all_original_histories'])==32 and
         not s['adaptive_pointer']['classical_history_erased'] and not s['adaptive_pointer']['postselection'],'adaptive pointer instrument or complete history differs')
 spectroscopy=[]
 for species,v in s['conditional_GeV_menu'].items():
  # A displayed conditional target uses the first matching parent joint group.
  parent=r['joint_identity']['complete_calibrated_joint_instrument']['joint_groups']
  group=next(g for g in parent if g['candidate_species']==[species]);ci=next(c for c in s['coarse_classes'] if group['joint_index'] in c['joint_group_indices'])
  pointer=next(x for x in ci['pointer_columns'] if x['joint_group']==group['joint_index'])
  lo,hi=interval(v['source_coefficient_GeV_interval']);records=[]
  for y,(prob,box) in enumerate(zip(pointer['probabilities'],ci['complete_pointer_confidence_intervals'],strict=True)):
   records.append({'bin':y,'probability':prob,'mass_interval':None if box is None else interval(box['mass_GeV_rational'])})
  spectroscopy.append({'species':species,'mass_GeV':(lo+hi)/2,'convention':v['calibration_ancestry']['input_convention'],
   'input_ancestry':v['calibration_ancestry']['empirical_inputs'],'range_GeV':float(F(ci['range_GeV'])),
   'exposure_GeV_inverse':float(ci['maximum_coherent_exposure_GeV_inverse']),'records':records,
   'modal_candidates':v['modal_record_compatible_source_species'],'planned_qubits':v['planning']['ideal_pointer_qubits_sufficient'],
   'planned_exposure_GeV_inverse':float(v['planning']['ideal_maximum_coherent_exposure_GeV_inverse'])})
 nu=n['mass_observables'];require(nu['all_masses_are_conditional_calibration'] and not n['physical_promotions'] and
  n['complete_instrument']['complete_record_count']==8 and not n['complete_instrument']['nuclear_or_beta_decay_rate_claimed'],'neutrino calibration domain differs')
 neutrino={'masses':[x['numeric'] for x in nu['neutrino_masses_GeV']],'sum':nu['mass_sum_GeV']['numeric'],
  'beta':nu['m_beta_GeV']['numeric'],'ee':nu['m_ee_at_packet_phases_GeV']['numeric'],
  'envelope':[x['numeric'] for x in nu['m_ee_phase_envelope_GeV']],
  'a':nu['envelope_terms_GeV']['a']['numeric'],'b':nu['envelope_terms_GeV']['b']['numeric']}
 require(q['paired_stream_count']==32 and not q['scope']['renormalized_MSbar_mass'] and not q['scope']['identified_up_down_or_strange_mass'] and
         not q['scope']['total_uncertainty_or_significance_claimed'],'bare Wilson scale scope differs')
 p=q['conditional_coordinates']['primary'];sens=q['crossed_fit_sensitivity'];scales=[];bare=[]
 for key,label in [('rho','Empirical rho anchor'),('string','Conventional √σ = 0.440 GeV'),('r0_benchmark','Benchmark r₀ = 0.5 fm')]:
  k='inverse_a_GeV/'+key;scales.append({'key':key,'label':label,'value':p['central'][k],'stat':p['statistical'][k],'fit':sens[k]})
  rows=[]
  for name in ['input_'+str(x) for x in q['all_input_kappas']]+['ratio_tuned','critical']:
   k='bare_Wilson_GeV/'+key+'/'+name
   rows.append({'label':name,'GeV':p['central'][k],'stat':p['statistical'][k],'fit':sens[k]})
  bare.append({'key':key,'label':label,'rows':rows})
 fl=r['flavour_transport'];sec=r['sector_measure'];bath=r['bath_mixing'];relax=r['quantum_relaxation'];exp=r['expanding_particles']
 require(not fl['physical_promotions'] and not fl['source_contract']['source_forces_chosen_word'] and
         fl['minimal_rank_one_pulse']['minimum_nonzero_pulse_count_in_predeclared_alphabet']==1,'flavour architecture scope differs')
 require(not sec['physical_promotions'] and not sec['stationarity']['family_weights_selected_by_channel'],'sector measure scope differs')
 require(bath['scope']['unchanged_bath_instrument'] and not bath['scope']['physical_temperature_or_cosmic_time_derived'] and
         not relax['scope']['physical_clock_or_Universe_abundances_derived'] and not relax['scope']['complete_archive_claimed_to_forget_initial_information'],
         'thermal scope differs')
 require(exp['scope']['same_native_calibrated_mass_kernel_and_CAR'] is True and
         exp['scope']['all_group_count_correlations_and_zero_branches_retained'] is True and
         exp['scope']['scale_factor_and_clock_are_supplied'] is True and
         exp['scope']['Einstein_backreaction_or_physical_cosmic_time_derived'] is False and
         exp['scope']['calibrated_mass_values_are_new_predictions'] is False and
         exp['scope']['finite_interval_pulse_results_identified_with_exact_continuous_ramp'] is False and
         exp['scope']['boson_production_calculated'] is False,'declared expansion source or physical scope differs')
 expansion=[]
 for row in exp['protocols']:
  require(len(row['species_production'])==12 and len(row['preparations'])==2,'expansion species or preparations differ')
  preps=[]
  for prep in row['preparations']:
   law=prep['complete_number_readout'];require(len(law['all181_total_number_probabilities'])==181 and len(law['all90_joint_count_factors'])==90 and len(law['complete84_group_count_marginals'])==84,'complete expansion count law differs')
   probabilities=law['all181_total_number_probabilities'];mean=law['expected_total_number']
   require(all(math.isfinite(x) and 0<=x<=1 for x in probabilities),'expansion count probability is outside its physical range')
   require(abs(math.fsum(probabilities)-1)<1e-8,'expansion probability differs')
   require(math.isfinite(mean) and 0<=mean<=180 and abs(math.fsum(i*x for i,x in enumerate(probabilities))-mean)<1e-8,'expansion count mean is inconsistent or outside 0–180')
   require(len(law['complete12_species_number_laws'])==12 and abs(math.fsum(x['mean_number'] for x in law['complete12_species_number_laws'])-mean)<1e-8,'expansion species means do not sum to the full count')
   for species_law in law['complete12_species_number_laws']:
    probabilities_species=species_law['probabilities'];mean_species=species_law['mean_number']
    require(all(math.isfinite(x) and 0<=x<=1 for x in probabilities_species) and abs(math.fsum(probabilities_species)-1)<1e-8,'individual expansion species law is invalid')
    require(math.isfinite(mean_species) and 0<=mean_species<=len(probabilities_species)-1 and abs(math.fsum(i*x for i,x in enumerate(probabilities_species))-mean_species)<1e-8,'individual expansion species mean is inconsistent or outside its capacity')
   preps.append({'label':prep['initial_state'],'mean_number':law['expected_total_number'],
    'continuous_mean_interval':interval(prep['continuous_ramp_mean_number_bounds']['total_exact_mean_interval']) if row['segments'] else None,
    'species':[{'species':x['species'],'mean':x['mean_number']} for x in law['complete12_species_number_laws']],
    'total_count_probabilities':law['all181_total_number_probabilities']})
  expansion.append({'law':row['law'],'duration':row['duration_in_declared_GeV_inverse_parameter'],'segments':row['segments'],
   'trace_error_bound':None if row['full_Fock_reference_extended_output_trace_error_bound'] is None else float(F(row['full_Fock_reference_extended_output_trace_error_bound'])),
   'pair_creation':[{'species':x['species'],'probability':x['vacuum_pair_production_probability_midpoint']} for x in row['species_production']],
   'preparations':preps})
 ordering=exp['certified_continuous_vacuum_mean_ordering']
 require(ordering['strict_slow_less_fast_less_quench'] is True and F(ordering['duration8_interval'][1])<F(ordering['duration1_interval'][0]) and F(ordering['duration1_interval'][1])<F(ordering['quench_interval'][0]),'continuous vacuum production ordering is not certified')
 bath_rows=[{'q':row['q_exp_minus_two_beta'],'max_steps':max(c['mixing_steps_for_TV_1e_minus3'] for c in row['components'])} for row in bath['temperature_rows']]
 quantum_rows=[{'temperature':row['temperature_GeV'],'sweeps':row['sufficient_sweeps_for_unhalved_source_reference_error_1e_minus6']} for row in relax['temperature_rows']]
 cards=[
  ('clock_energy','Complete native event timeline',f"Six controls retain {sum(x['complete_record_count'] for x in clock['timeline_runs']):,} clock/return/detector records. At full activity q=1 and cap three, timeout is 15806/16875. Fresh coherent services are supplied; an absolute GeV or SI clock is not derived."),
  ('archive_compression','48 archive qubits → at most 2','All 8 original classical bits and every quantum reference correlation survive. Exact rank certificates retain rare directions; compression costs 1,767,798 additional native pulses in the worst four-round history.'),
  ('sector_measure','The stationary quantum algebra is explicit',f"The admitted ten-dimensional Gauss source has a {sec['stationarity']['complex_fixed_operator_dimension']}-dimensional fixed operator algebra and a {sec['stationarity']['density_family_real_affine_dimension']}-dimensional density family. Sector weights remain preparation inputs; scalar sector counts do not close all coherences."),
  ('finite_spectroscopy','Finite-time mass confidence sets','An exactly equivalent adaptive pointer uses one reusable qubit plus five retained bits and preserves all 8,010 original records. Its ideal coverage is at least 65/72 for normalized one-excitation inputs at the phase detector. Vacuum and many-excitation records remain terminal without a mass interval. Neutrino labels remain unresolved; large precision plans are separate from execution.'),
  ('neutrino_observables','Conditional neutrino observables','The same calibrated Majorana block yields beta mass, mass sum and the full relative-phase envelope of mₑₑ. Six success outcomes, failure and the full spectator complement survive; no nuclear or beta-decay rate is computed.'),
  ('flavour_transport','One source phase pulse gives nonzero CP',f"A declared rank-one pulse gives J={fl['minimal_rank_one_pulse']['single_pulse_J_numeric']:.9g}; the three-pulse control gives {fl['primary']['J_numeric']:.9g}. All 18 current-loop records remain. The word is a declared architectural choice; no physical CKM match is claimed."),
  ('bath_mixing','Certified cooling lag on the finite bath','Rational spectral bounds control mixing within each of the 26 preserved components of the declared reversible repair-bath extension. Complete bath records retain initial information. Temperature and cooling schedule are supplied; no unique global Gibbs law is claimed.'),
  ('quantum_relaxation','A complete quantum bath for particle counts','The calibrated 180-fermion-mode source and globally capped boson space admit explicit collisions, cooling laws and reference-inclusive marginal mixing bounds. All bath coordinates survive; relaxation of the reduced source is not erasure of its archive.'),
  ('expanding_particles','Particle records under declared expansion','The same calibrated CAR source evolves all twelve fermion species under a supplied 1→4 expansion. Complete pair/count laws and interval evolution bounds survive. Boson production is not calculated; physical cosmic time and backreaction are not derived.'),
  ('paired_quark_scale','Paired bare Wilson masses in GeV','All 32 paired archive streams propagate critical/tuned hopping parameters and three scale assignments. Values below are bare Wilson action coordinates, not identified physical quark masses. Statistical and fit-sensitivity errors stay separate.'),
 ]
 return {'cards':[{'key':key,'title':title,'text':text,'proof':'model/'+SOURCES[key][0].replace('results.json','PROOF.md')} for key,title,text in cards],
  'archive':archive,'spectroscopy':spectroscopy,
  'confidence':{k:confidence[k] for k in ('coverage_domain','all_input_bad_phase_effect_bound','all_input_no_valid_mass_interval_effect_bound','complete_original_probe_bound','original_one_excitation_weight_exact','original_terminal_no_mass_interval_weight_exact','original_good_mass_interval_weight_lower_exact')},'neutrino':neutrino,'bare_quarks':bare,'scales':scales,
  'expansion':expansion,'expansion_ordering':{k:interval(ordering[k]) for k in ('duration8_interval','duration1_interval','quench_interval')},'bath_mixing':bath_rows,'quantum_mixing':quantum_rows,
  'counts':{'source_receipts':10,'spectroscopy_records':8010,'spectroscopy_zero_records':6533,'neutrino_records':8}}
