"""Project verified RER particle results and install them on the Journey page.

The overlay can update an existing published site without rebuilding unrelated
simulation files. Every displayed value is projected from a bound source receipt.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import subprocess
from fractions import Fraction
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
RER=ROOT.parent/'reverse-engineering-reality'
EXTRA=ROOT/'tools/site_extra'
SOURCES={
 'packet':'model/openwave_localized_rest_packet/results.json',
 'comparison':'model/lepton_cycle/physical_comparison.json',
 'magnetic':'model/openwave_rotational_g_limit/results.json',
 'neutral':'model/openwave_neutral_preparation/results.json',
 'flatness':'model/openwave_neutral_dispersion/results.json',
 'radiation':'model/openwave_radiative_pair/results.json',
 'compiler':'model/openwave_factorized_compiler/results.json',
 'higgs':'model/openwave_full_higgs_floor/results.json',
 'gravity':'model/openwave_energy_lapse/results.json',
 'clocks':'model/openwave_lapse_observations/results.json',
 'quantum':'model/openwave_quantum_rotational/results.json',
 'oscillation':'model/openwave_neutrino_oscillation/results.json',
 'weak':'model/openwave_weak_decay/results.json',
 'transfer':'model/openwave_neutral_transfer/results.json',
 'native_charge':'model/openwave_native_quantum_charge/results.json',
 'infinite_photon':'model/openwave_infinite_photon/results.json',
 'quantum_larmor':'model/openwave_quantum_larmor/results.json',
 'neutral_flight':'model/openwave_neutral_flight/results.json',
 'inclusive_decay':'model/openwave_inclusive_decay/results.json',
 'composites':'model/openwave_native_composites/results.json',
 'composite_scale':'model/openwave_composite_scale/results.json',
 'dynamic_geometry':'model/openwave_quantum_geometry/results.json',
 'wave_deflection':'model/openwave_wave_deflection/results.json',
}
IMPORT="import { mountJourneyResults } from './journey_results.js';\n"
HOOK="  mountJourneyResults(host);\n"
ANCHOR="  const wrap = host.querySelector('.jy-wrap'), page = host.closest ? host.closest('.page') : null;"

def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()

def read_bound(path,rer):
 value=json.loads(path.read_text())
 if 'verdict'in value and not value['verdict'].startswith('PASS'):raise ValueError(f'failed source: {path}')
 bindings=value.get('source_sha256',value.get('input_sha256',value.get('source_bindings')))
 if not isinstance(bindings,dict)or not bindings:raise ValueError(f'unbound source: {path}')
 for name,expected in bindings.items():
  p=(rer/name).resolve()
  if not p.is_relative_to(rer.resolve())or digest(p)!=expected:raise ValueError(f'stale source: {name}')
 return value

def project(rer=RER):
 receipts={key:read_bound(rer/path,rer)for key,path in SOURCES.items()}
 revision=subprocess.run(['git','rev-parse','HEAD'],cwd=rer,check=True,capture_output=True,text=True).stdout.strip()
 if len(revision)!=40 or any(c not in '0123456789abcdef'for c in revision):raise ValueError('invalid source revision')
 required=set(SOURCES.values())
 for receipt in receipts.values():
  required.update(receipt.get('source_sha256',receipt.get('input_sha256',receipt.get('source_bindings',{}))))
 names=sorted(required)
 committed=set(subprocess.run(['git','ls-tree','-r','--name-only',revision,'--',*names],cwd=rer,check=True,capture_output=True,text=True).stdout.splitlines())
 changed=subprocess.run(['git','diff','--name-only',revision,'--',*names],cwd=rer,check=True,capture_output=True,text=True).stdout.strip()
 if committed!=required or changed:raise ValueError('Journey evidence must be committed at its linked source revision')
 packet=receipts['packet'];p=packet['near_rest_localized_source'];c=receipts['comparison']
 g=next(row for row in receipts['magnetic']['rows']if row['mass']==16384)
 n=receipts['neutral']['finite_filter_and_polar_service'];radiation=receipts['radiation']
 energy=float(Fraction(p['mean_relative_rest_energy_excess_upper']))*1e6
 outside=float(Fraction(p['conditional_outside_cube_uniform_time_upper']))
 precession=float(Fraction(g['analytic_rational_bounds']['quasistatic_precession_g_error_from_two']))
 assert energy<.003014 and outside<1.103e-7 and precession<.004863
 assert n['corrected_original_input_success_decimal_lower']>.99999999999639
 assert p['source_time_horizon']==10**9 and p['length']==2**30 and p['periodic_side']==4*(2**30+1)
 assert float(Fraction(g['analytic_rational_bounds']['static_g_error_from_two']))<.001832
 assert g['coupling']==16384**-6
 assert n['conditional_reduced_density_trace_error_decimal_upper']<2.000001e-16
 assert n['source_H_evaluations_per_success_vector']==30546
 flat=receipts['flatness']['neutral_band_flatness_and_records']
 assert flat['exact_all_order_momentum_splitting']=='0'
 assert flat['reduced_algebra']['all_momentum_sector_ranks']==[128]*8
 assert flat['stationary_neutral_energy_reinterpreted_as_a_moving_particle_mass']is False
 assert p['finite_full_Fock_compiler']['full_enlarged_volume_time_evolution_executed']is False
 assert p['autonomous_clock']['passive_self_start_proved']is False
 assert packet['calibration']['observed_interacting_lepton_identification_proved']is False
 caps=[]
 for cap in (1,2):
  experiment=radiation['complete_cap_experiments'][str(cap)]
  pair=next(r for r in experiment['pair']if r['time_in_inverse_native_mass']==50)
  vacuum=next(r for r in experiment['vacuum_control']if r['time_in_inverse_native_mass']==50)
  caps.append({'cap':cap,'pair_probability':pair['two_photon_no_fermion_probability'],
               'vacuum_probability':vacuum['two_photon_no_fermion_probability']})
 return {
  'schema':'oph.journey_verified_results.v1',
  'date':'2026-11-12',
  'source_revision':revision,
  'source_repository':f'https://github.com/FloatingPragma/observer-patch-holography/blob/{revision}/',
  'scope':'Conditional finite constructions; calibration, preparation and physical identification are separate.',
  'leptons':{
   'rows':[{'name':r['species'],'mass_GeV':r['electron_anchored_GeV']}for r in packet['calibration']['rows']],
   'muon_electron_ratio':c['architecture']['muon_electron_ratio'],
   'tau_electron_ratio':c['architecture']['tau_electron_ratio'],
   'muon_residual_ppm':c['muon']['relative_residual_ppm'],
   'tau_residual_ppm':c['tau']['relative_residual_ppm'],
   'comparison_type':c['exposure']['comparison_type'],
   'empirical_anchor':'CODATA 2022 electron energy; muon and tau are comparison targets only.',
   'physical_interacting_identity_proved':False,
  },
  'localized':{'energy_excess_ppm_upper':energy,'outside_probability_upper':outside,
   'time_horizon':p['source_time_horizon'],'support_side':p['length'],'periodic_side':p['periodic_side'],
   'visibility_lower':float(Fraction(p['autonomous_clock']['visibility_uniform_lower'])),
   'full_volume_enumerated':False,'bound_scope':'Analytic finite-carrier certificate with smaller-box execution; the full analyzer compiler uses continuing controls.'},
  'magnetic':{'precession_g_error_upper':precession,'mass_parameter':g['mass'],
   'static_g_error_upper':float(Fraction(g['analytic_rational_bounds']['static_g_error_from_two'])),
   'coupling_rule':'kappa=m^-6','physical_mass_or_alpha_matched':False},
  'neutral':{'success_probability_lower':n['corrected_original_input_success_decimal_lower'],
   'reduced_density_trace_error_upper':n['conditional_reduced_density_trace_error_decimal_upper'],
   'formal_H_applications':n['source_H_evaluations_per_success_vector'],
   'momentum_spectrum':'exactly flat across all eight momenta on the periodic side-two source',
   'observed_neutrino_identity_proved':False},
  'radiation':{'time_in_inverse_native_mass':50,'caps':caps,
   'full_evolution_probability_lower':radiation['exact_short_time_certificate']['original_two_photon_radiation_probability_lower_float'],
   'lower_bound_time_in_inverse_native_mass':'1e-8','physical_scattering_rate_proved':False},
  **frontier(receipts),
  'current_tasks':current_tasks(receipts),
  'source_sha256':{path:digest(rer/path)for path in SOURCES.values()},
  'source_paths':SOURCES,
 }

def current_tasks(receipts):
 charge=receipts['native_charge'];attachment=charge['same_quantum_block_attachment']
 assert charge['exact_filled_reference_electric_charge']=='0'
 assert attachment['native_lowest_charged_band_is_global_within_fixed_charge_sector']is True
 assert attachment['old_16_Clifford_rows_all_identified_with_one_native_family']is False
 infinity=receipts['infinite_photon'];trial=next(x for x in infinity['certified_trials']if x['trial_photon_cap']==3)
 assert infinity['analytic_infinite_field']['finite_spatial_regulator_retained']is True
 assert trial['infinite_ground_photon_tail_above_trial_cap_upper']<8.278e-16
 larmor=receipts['quantum_larmor'];lg=larmor['certified_finite_field_splittings'][0]['finite_field_precession_g_interval']
 assert larmor['same_rest_unit_current_state_field_and_clock']is True
 assert larmor['field_strength_and_source_couplings_physically_calibrated']is False
 flight=receipts['neutral_flight'];decay=receipts['inclusive_decay'];survival=decay['controlled_finite_time_survival']
 assert flight['mass_tag_control_spatially_summed_flavour_difference']==0
 assert survival['large_bin_model_executed']is False
 assert decay['conditional_units']['electron_anchor_is_empirical']is True
 assert decay['conditional_units']['calibration_source']['empirical_weak_scale_or_Higgs_normalization_matched']is False
 bound=receipts['composites'];scale=receipts['composite_scale']
 baryon=next(x for x in bound['states']if x['kind']=='baryon'and x['charge']==1 and x['internal_spin']==.5)
 meson=next(x for x in bound['states']if x['kind']=='meson'and x['charge']==1 and x['internal_spin']==0)
 assert baryon['co_location_probability']>.99 and meson['co_location_probability']>.99
 for state in bound['states']:
  complete=state['complete_unconditional_records'];assert abs(sum(complete['preparation_success_and_every_full_sector_occupation'])+complete['preparation_failure']-1)<1e-9
 assert scale['physical_particle_rest_mass_claim']is False
 assert scale['calibration']['parameters_fitted_to_hadrons']is False
 assert all(x['verdict'].startswith('REJECTED')for x in scale['physical_assignment_tests'])
 geometry=receipts['dynamic_geometry'];cap=next(x for x in geometry['cap_comparisons']if x['cap']==4)
 assert geometry['static_minimum_controller_used']is False
 assert geometry['physical_G_clock_length_or_observed_gravity_identified']is False
 assert cap['entanglement']['witness_decimal_interval'][1]<0
 assert len(cap['all49_positive_energy_source_pair_interactions'])==49
 wave=receipts['wave_deflection'];variant=next(x for x in wave['variants']if x['side']==31 and x['gamma']==1 and x['transverse_preparation_offset']==6)
 row=next(x for x in variant['all_mode_rows']if x['source_time']==16)
 minus=next(x for x in wave['variants']if x['gamma']==-1)['all_mode_rows'][1]
 assert wave['quantum_geometry_package_source_transfer_claimed']is False
 assert wave['gamma_minus1_ray_deflection_zero_but_finite_wave_residual_retained']is True
 assert wave['physical_G_lensing_angle_or_gravity_strength_identified']is False
 return {
  'task_count':10,
  'native_charge':{'charge':'-1','neutral_reference_charge':'0','native_pairs':len(charge['native_pairs']),
   'full_conjugate_CAR_modes':attachment['two_charge_conjugate_native_copies_CAR'],'spin_Casimir':attachment['dressed_total_Casimir'],
   'physical_particle_identity_proved':False},
  'infinite_photon':{'source_energy_interval':infinity['joint_infinite_ground_energy_interval'],
   'conditional_GeV_interval':trial['GeV_interval_using_identical_cap_two_electron_unit'],
   'photon_tail_above_three_upper':trial['infinite_ground_photon_tail_above_trial_cap_upper'],
   'finite_spatial_regulator_retained':True,'independent_mass_fit':False},
  'quantum_larmor':{'finite_field_g_interval':lg,'complete_time_experiments':len(larmor['complete_finite_time_records']),
   'same_rest_current_state_clock':True,'physical_field_calibrated':False},
  'neutral_flight':{'sites':flight['sites'],'CAR_modes':flight['physical_CAR_modes'],
   'mass_phase_contrast':flight['coherent_mass_phase_contrast_in_spatially_summed_family_records'],
   'source_success_rule':flight['exact_source_success'],'physical_neutrino_GeV_identified':False},
  'inclusive_decay':{'width_GeV':decay['conditional_units']['width_GeV'],
   'contact_G_GeV_inverse_squared':decay['conditional_units']['G_GeV_inverse_squared'],
   'one_lifetime_survival_interval':survival['rows'][0]['survival_interval_diagnostic'],
   'one_lifetime_probability_error_upper':float(Fraction(survival['rows'][0]['total_survival_probability_error_upper'])),
   'phase_space_law':decay['exact_phase_space']['rate'],'large_finite_carrier_executed':False,'physical_weak_lifetime_fit':False},
  'baryon':{'ground_energy':baryon['ground_energy'],'co_location_probability':baryon['co_location_probability'],
   'singlet_dimension':bound['sector_sizes']['baryon']['exact_colour_singlet_dimension'],
   'binding_gap_lower':bound['uniform_graph_bounds']['baryon_binding_gap_lower'],'proton_neutron_degenerate':True},
  'meson':{'ground_energy':meson['ground_energy'],'co_location_probability':meson['co_location_probability'],
   'singlet_dimension':bound['sector_sizes']['meson']['exact_colour_singlet_dimension'],
   'binding_gap_lower':bound['uniform_graph_bounds']['meson_binding_gap_lower'],'neutral_singlet_and_spin_partners_retained':True},
  'geometry':{'carrier_dimension':cap['complete_native_matter_geometry_dimension'],
   'witness_interval':cap['entanglement']['witness_decimal_interval'],'source_time':cap['entanglement']['source_time'],
   'mutual_attractive_pairs':49,'energy_conserved':True,'physical_G_identified':False},
  'wave':{'modes':variant['field_carrier_dimension']-1,'source_time':row['source_time'],
   'transverse_shift':row['conditional_transverse_position_shift'],'transverse_velocity_shift':row['transverse_velocity_shift'],
   'gamma_minus_one_shift':minus['conditional_transverse_position_shift'],
   'independent_second_order_discrepancy':row['independent_full_second_order_wave_discrepancy'],
   'static_scalar_plane':True,'physical_lensing_fit':False},
  'common_scale':{'rows':scale['energy_rows'],'comparisons':scale['physical_assignment_tests'],
   'binding_family_offset_GeV':scale['exact_obstructions']['light_second_meson_energy_difference_GeV'],
   'physical_hadron_mass_fit':False},
 }

def frontier(receipts):
 compiler=receipts['compiler']['resources']['state_sensitive_same_packet']
 higgs=receipts['higgs'];gravity=receipts['gravity'];clocks=receipts['clocks']
 assert compiler['same_physical_record_and_energy_guarantees']is True
 assert compiler['all_ancilla_outputs_retained']is True
 assert compiler['full_large_carrier_executed']is False
 assert compiler['cycle_reduction_factor']>1e34
 assert higgs['exact_native_symbol']['native_internal_rank']==14
 assert higgs['charged_sector_theorem']['all_neutral_zero_modes_retained']is True
 assert higgs['countercontrols']['shared_up_down_mass_spectrum_equal']is True
 assert higgs['countercontrols']['unequal_observed_quark_masses_derived']is False
 assert higgs['architecture']['relative_channel_choice_source_forced']is False
 force=[float(Fraction(v))for v in gravity['attractive_central_difference_force_at_six']]
 assert 0<force[0]<=force[1]<1.534e-7
 assert gravity['geometry_register_has_autonomous_relaxation']is False
 assert clocks['clock_records']['all64_joint_clock_outcomes_retained']is True
 assert len(clocks['clock_records']['rows'])==7
 assert clocks['physical_gravitational_redshift_or_Einstein_completion_claimed']is False
 assert clocks['metric_and_curvature']['isotropic_gamma_one_wave_gluing_is_declared']is True
 quantum=receipts['quantum'];qb=next(r for r in quantum['interval_certificates']if r['cap']==2)
 assert quantum['declared_source']['charge']==-1
 assert all(r['Casimir_residual']<1e-9 and r['Jz_residual']<1e-9 for r in quantum['stationary_records'])
 assert quantum['calibration']['physical_electron_identity_proved']is False
 assert quantum['calibration']['muon_tau_spectrum_transferred']is False
 assert quantum['calibration']['other_caps_reuse_same_unit']is True
 assert quantum['calibration']['electron_anchor_GeV']==.00051099895069
 gi=qb['rest_energy_normalized_static_g_interval']
 assert 1.99827<gi[0]<=gi[1]<1.99828
 oscillation=receipts['oscillation'];weak=receipts['weak']
 assert oscillation['imported_PMNS_angles_mass_splittings_or_neutrino_GeV_scale']is False
 assert oscillation['measured_PMNS_fit_or_observed_neutrino_identification']is False
 assert oscillation['full45_mass_kernel_and90_CAR_pairing_retained']is True
 assert len(oscillation['complete_records'])==36
 assert weak['observed_muon_lifetime_weak_scale_or_continuum_S_matrix_derived']is False
 wp=weak['original_receiver_probability_decimal_interval']
 assert 0<wp[0]<=wp[1]<1
 assert weak['neutral_masses']=='0'
 transfer=receipts['transfer']
 assert transfer['same_side_two_low_energy_band_or_ground_transferred']is False
 assert transfer['relativistic_mass_or_observed_neutrino_identified']is False
 tp=transfer['original_receiver_probability_decimal_interval']
 assert 0<tp[0]<=tp[1]<1e-120
 return {
  'neutral_transfer':{'receiver_probability_interval':tp,'source_sites':64,'total_spin_Casimir':'3/4',
   'earlier_flat_band_transferred':False,'physical_neutrino_identified':False},
  'quantum':{'g_interval':gi,'total_spin_Casimir':'3/4','total_spin_z':'1/2',
   'cap':2,'source_rest_energy_interval':qb['actual_ground_energy_interval'],
   'electron_anchor_GeV':quantum['calibration']['electron_anchor_GeV'],
   'finite_cap_comparisons':quantum['finite_cap_comparisons'],
   'physical_electron_identity_proved':False,'muon_tau_spectrum_transferred':False},
  'oscillation':{'maximum_contrast':oscillation['maximum_executed_neutral_antineutral_probability_contrast'],
   'record_count':len(oscillation['complete_records']),'declared_port_word':oscillation['declared_port_word'],
   'mixing_parameters':oscillation['model_mixing_parameters'],'physical_neutrino_fit':False},
  'weak':{'receiver_probability_interval':wp,'source_time':float(Fraction(weak['time'])),
   'contact_coefficient':weak['architecture_contact_coefficient_G'],
   'native_CAR_modes':270,'physical_lifetime_or_weak_scale_derived':False},
  'compiler':{'cycle_reduction_factor':compiler['cycle_reduction_factor'],
   'certified_cycles':str(compiler['cycles']),'full_large_carrier_executed':False,
   'same_physical_record_and_energy_guarantees':True,'continuing_controls_required':True},
  'higgs':{'massive_internal_rank':14,'native_internal_dimension':15,
   'charged_floor':higgs['charged_sector_theorem']['operator_bound'],
   'neutral_zero_modes_retained':True,'shared_quark_spectra_equal':True,
   'observed_quark_mass_fit':False,'shared_family_coefficients_declared':True},
  'gravity':{'attractive_force_source_units_interval':force,
   'clock_shift_ppm_interval':clocks['clock_records']['relative_frequency_shift_ppm_interval'],
   'clock_gap_count':len(clocks['clock_records']['rows']),
   'metric_ray_delay_source_units_interval':clocks['isotropic_piecewise_metric_delay_decimal'],
   'complete_wave_TV_by_time':[{'time':r['curved']['duration'],'TV':r['complete_probability_total_variation']}for r in clocks['wave_runs']],
   'energy_lapse_and_isotropic_gluing_declared':True,'physical_G_or_clock_calibrated':False},
 }

def patched_journey(source):
 if source.count(ANCHOR)!=1:raise ValueError('Journey mount structure changed; inspect before overlaying')
 if IMPORT not in source:source=IMPORT+source
 if HOOK not in source:source=source.replace(ANCHOR,HOOK+ANCHOR)
 return source

def sync(out,rer=RER,check=False):
 data=project(rer);body=json.dumps(data,indent=2,ensure_ascii=False)+'\n'
 outputs={'journey_results.json':body,'journey_results_data.js':'export const JOURNEY_RESULTS = '+body.rstrip()+';\n'}
 for name in ('journey_results.js','journey_results.css'):outputs[name]=(EXTRA/name).read_text()
 path=out/'journey.js';outputs['journey.js']=patched_journey(path.read_text())
 for name,body in outputs.items():
  p=out/name
  if check:
   if not p.exists()or p.read_text()!=body:raise ValueError(f'stale Journey projection: {p}')
  else:p.write_text(body)
 return data

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--out',type=Path,default=ROOT/'site');p.add_argument('--rer',type=Path,default=RER);p.add_argument('--check',action='store_true');a=p.parse_args()
 result=sync(a.out,a.rer,a.check);print(f"Journey projection {'verified'if a.check else 'written'}: {len(result['source_sha256'])} bound receipts")
if __name__=='__main__':main()
