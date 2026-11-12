"""Source-domain guards and compact displays for joined finite measurements."""
from fractions import Fraction as F
import math


SOURCES = {
    'joint_identity': ('particle_joint_mass_identity/results.json','Joint particle identity and mass records'),
    'compiler_compression': ('lepton_compiler_compression/results.json','Exact compiler compression and archive bound'),
    'service_compiler': ('lepton_service_compiler/results.json','Native prepared lepton cycles and full archives'),
    'thermal_admission': ('native_thermal_admission/results.json','Exact native equilibrium classification'),
    'freezeout_response': ('native_freezeout_response/results.json','Complete native absorption and lifetime response'),
    'thermal_history': ('particle_thermal_history/results.json','Conditional finite and continuum thermal histories'),
    'correlated_hadrons': ('correlated_hadron_spectrum/results.json','Correlated archived hadron fits'),
    'flavour_identity': ('source_flavour_identifiability/results.json','Exact family invariants and current-loop records'),
    'thermal_completion': ('native_thermal_completion/results.json','Explicit reversible bath completion'),
    'frequency_vertex': ('frequency_yukawa_vertex/results.json','Frequency-dependent native Higgs vertex'),
    'thermal_particles': ('thermal_particle_records/results.json','Same-source thermal particle number records'),
}


def require(condition,message):
    if not condition:raise ValueError(message)


def rational(x):
    result=float(F(x));require(math.isfinite(result),'finite rational display required');return result


def project(receipts):
    for key,(path,_) in SOURCES.items():
        require(receipts[key]['schema']=='oph.'+path.split('/')[0]+'.v1','joint result schema differs: '+key)
    j=receipts['joint_identity'];c=receipts['compiler_compression'];service=receipts['service_compiler']
    t=receipts['thermal_history'];a=receipts['thermal_admission'];f=receipts['freezeout_response']
    h=receipts['correlated_hadrons'];fl=receipts['flavour_identity'];bath=receipts['thermal_completion'];vertex=receipts['frequency_vertex']
    require(j['scope']['actual_same_source_joint_observable_constructed'] is True and
            j['scope']['physical_Standard_Model_particle_dictionary_derived'] is False and
            j['scope']['calibrated_masses_are_independent_predictions'] is False,'joint mass calibration domain differs')
    instrument=j['complete_calibrated_joint_instrument'];groups=instrument['joint_groups']
    require(len(groups)==112 and len(instrument['complete_records'])==570 and instrument['positive_records']==113 and
            sum(F(r['probability_exact']) for r in instrument['complete_records'])==1 and
            instrument['joint_color_components_unresolved_and_coherent'] is True,'complete joint mass records differ')
    targets=j['conditional_GeV_targets'];require(len(targets)==17 and all(r['native_prediction'] is False for r in targets),'conditional mass targets differ')
    group_rows=[]
    for g in groups:
        lo,hi=map(F,g['rest_coefficient_GeV_interval']);require(0<=lo<=hi,'ordered mass enclosure required')
        group_rows.append({'index':g['joint_index'],'species':g['candidate_species'],'orientation':g['orientations'],
            'charge':g['charge'],'color':g['color_C2'],'helicity':g['helicity_twice']/2,'momentum':g['momentum_z_GeV'],
            'mass':float((lo+hi)/2),'energy':rational(sum(map(F,g['energy_GeV_interval']))/2),
            'rank':g['projector_rank'],'source_sector':g['source_sector']})
    require(c['exact_reduction']['total_modes_per_site']==102 and c['scope']['any_outcomes_or_archives_discarded'] is False and
            c['exact_reduction']['arbitrary_physical_occupation_and_untouched_reference'] is True,'full occupation or quantum archive compression differs')
    require(service['scope']['complete_up_to_three_cycle_native_service_implementation'] is True and
            service['scope']['coherent_service_and_blank_reset_are_supplied'] is True and
            service['scope']['autonomous_reset_or_hardware_pulse_precision_derived'] is False,'bounded source services exceed their domain')
    cycles=[]
    for run in service['quantum_archive_execution']['bounded_runs']:
        n=run['cycles'];rows=run['complete_return_histories']
        require(len(rows)==4**n and abs(sum(r['probability_maximally_entangled_register_reference'] for r in rows)-1)<3e-8,'complete service histories differ')
        cycles.append({'cycles':n,'records':[{'history':r['record_history'],'probability':r['probability_maximally_entangled_register_reference']} for r in rows],
                       'archive_dimension':run['source_archive_dimension_exact']})
    require(t['physical_admission']['physical_abundances_or_freezeout_predicted'] is False and
            a['acceptance_flags']['physical_thermal_abundances'] is False and
            f['acceptance_flags']['native_cosmological_freezeout_or_relic_abundances'] is False and
            bath['scope']['law_is_explicit_bath_extension'] is True and
            bath['scope']['unchanged_native_repair_claimed_thermal'] is False,'thermal source or cosmological domain differs')
    require(len(a['recurrent_classes'])==46 and bath['weak_components']==26 and bath['reverse_edges_added']==3924 and
            all(r['stationarity_exact'] and r['detailed_balance_exact'] for r in bath['temperature_rows']),
            'native recurrent classes or explicit bath balance differs')
    thermal=[]
    for row in t['temperature_history']:
        fractions=row['aggregate_fractions'];require(abs(sum(fractions[k]['number'] for k in ('quark','lepton','boson'))-1)<1e-9,'thermal number fractions differ')
        thermal.append({'temperature':row['temperature_GeV'],'g_energy':row['g_energy'],'g_entropy':row['g_entropy'],
            'fractions':{k:fractions[k] for k in ('quark','lepton','boson')},'sound_speed_squared':row['sound_speed_squared'],
            'scale_factor_relative_to_T10':row['conditional_adiabatic_expansion']['scale_factor_relative_to_T10']})
    require(fl['scope']['source_selects_all_flavour_parameters'] is False and
            fl['scope']['complete_declared_current_loop_records'] is True and
            h['scope']['independent_particle_prediction'] is False and
            h['rule']['target_mass_used_to_choose_rules'] is False and
            vertex['physical_Yukawa_or_on_shell_mass_identification'] is False,'flavour, hadron or vertex input ancestry differs')
    primary=h['gev']['primary'];hadron=[{'label':k.replace('_',' '),'GeV':v,'stat':primary['statistical'][k],'fit_sensitivity':h['gev_fit_sensitivity'][k]} for k,v in primary['central'].items()]
    frequency=[{'frequencies':r['fermion_frequencies'],
                'coefficients':[v['canonically_normalized_amputated_coefficient']['real'] for v in r['components']]}
               for r in vertex['frequency_rows']]
    number=receipts['thermal_particles'];ns=number['scope']
    require(ns['same_calibrated_quadratic_source_and_original_global_boson_cap'] is True and
            ns['color_coherences_within_count_blocks_preserved'] is True and
            ns['native_temperature_or_Universe_abundances_identified'] is False and
            ns['continuum_ideal_gas_substituted_for_finite_source'] is False,'same-source thermal count domain differs')
    finite_counts=[]
    for r in number['finite_temperature_count_laws']:
        require(len(r['fermion_group_factor_records'])==84 and len(r['boson_joint_group_count_records'])==435 and
                abs(sum(x['fraction_of_expected_counts'] for x in r['species_expected_counts'])-1)<1e-10 and
                r['pre_probe_one_excitation_detector']['evaluated_before_any_probe'] is True,'complete finite thermal count law differs')
        finite_counts.append({'temperature':r['temperature_GeV'],'mean_number':r['full_expected_particle_number'],
            'at_most_one':r['pre_probe_one_excitation_detector']['at_most_one_probability'],
            'species':r['species_expected_counts']})
    return {
        'joint':{'groups':group_rows,'targets':[r['species'] for r in targets],
            'records':[dict(r,probability=rational(r['probability_exact'])) for r in instrument['complete_records']],
            'scope':'Charge, color Casimir, helicity, momentum and energy are measured together on the calibrated quadratic source. The 112 one-excitation groups retain color degeneracy; vacuum and the full many-excitation complement complete the detector. All masses retain their empirical action inputs and conventions.',
            'resolution':f"Without energy there are {instrument['without_energy_readout']['class_count']} measured classes. A 10⁻⁶ GeV half-bin gives {instrument['finite_energy_binning']['class_count']} classes and does not resolve the three neutrino mass labels. Ideal 10⁻²⁶ GeV half-bins give 112; hardware resolution is not certified.",
            'compiled_rest_records':j['compiled_lepton_joint']['complete_record_count_per_family']},
        'compiler':{'physical_modes':90,'ancillary_modes':12,'total_modes':102,'original_modes':324000,
            'resource_examples':[{k:r[k] for k in ('sites','rounds','round_reduction_factor','total_exported_ancillary_reduction_factor')} for r in c['precision_resource_examples']],
            'cycles':cycles,'service_resources':service['resources'],
            'scope':'The exact neutral-background reduction retains all physical occupations, classical flags and quantum archives. Its 12 ancillary modes are minimal within the stated number-preserving mode-embedding class. Separately, native pulse words implement up to three prepared lepton cycles using supplied coherent loading, blank reset, routing and binary readout. These are distinct protocols; the three-cycle execution is not an execution of the trillion-round precision campaign. Exact target equality belongs to the ideal real-angle synthesis recipe. Stored binary64 pulse angles and replay provide an approximation with numerical diagnostics, not a certified tolerance. Physical precision and autonomous reset are separate premises.'},
        'thermal':{'rows':thermal,'high_temperature':t['high_temperature_limit'],
            'scope':t['interpretation']+' The finite capped-source Gibbs calculations are separate from this continuum phase-space comparison.',
            'native_mean_absorption_attempts':rational(f['native_uniform_initial_lifetime']['mean']),
            'native_max_mean_attempts':rational(f['native_uniform_initial_lifetime']['maximum_state_mean']),
            'stationary_classes':len(a['recurrent_classes']),'bath_components':bath['weak_components'],'bath_reverse_edges':bath['reverse_edges_added']},
        'thermal_particles':{'rows':finite_counts,
            'scope':'The same calibrated finite source has a declared complete group-number measurement service on every occupation, with 84 fermion count factors and 435 nonzero boson count groups. Its full 1,653-state polarization change preserves the Gibbs state before helicity labels are assigned. Color coherence and all quantum references are retained. Temperature and Gibbs preparation are supplied; these measured finite counts are not continuum-gas or early-Universe abundances.'},
        'hadron':{'rows':hadron,'scope':'Correlated fits reconstruct the 32-stream covariance and refit every deletion. Rho-anchored pion and rho values are calibration inputs. The separate fit-sensitivity column is a finite-design allowance, not a confidence interval or total uncertainty. One-spacing quenched systematics and the physical source clock are unbounded.'},
        'flavour':{'charged_invariants':fl['exact_family_quotient']['charged_invariant_parameters'],
            'weinberg_invariants':fl['exact_family_quotient']['Weinberg_generic_invariant_parameters'],
            'rank_two_invariants':fl['exact_family_quotient']['rank_two_Weinberg_invariant_parameters'],
            'scope':'Exact family-basis quotient counts do not select the invariant values. The complete native current-loop instrument measures a CP-sensitive contrast with every original record retained.'},
        'frequency':{'rows':frequency,'scope':vertex['scope']+' The table summarizes four selected components; the linked receipt retains the complete 72-component first-frequency tensor, including zeros.'},
    }
