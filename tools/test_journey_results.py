"""Projection integrity, calibration ancestry and fail-closed overlay checks."""
import copy,json,os,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
from sync_journey_results import project,read_bound,check_placement,digest,IMPORT,LEGACY_HOOK,RER,SOURCES,apply_data_hooks,remove_journey_matches

class JourneyProjectionTest(unittest.TestCase):
 def test_source_ancestry_and_distinct_accuracy_meanings(self):
  p=project(Path(os.environ.get('OPH_RER',RER)))
  rows=p['leptons']['rows'];e,mu,tau=[float(r['mass_GeV'])for r in rows]
  self.assertAlmostEqual(mu/e,float(p['leptons']['muon_electron_ratio']),places=10)
  self.assertAlmostEqual(tau/e,float(p['leptons']['tau_electron_ratio']),places=9)
  self.assertEqual(e,.00051099895069)
  self.assertGreater(float(p['leptons']['muon_residual_ppm']),9)
  self.assertLess(p['localized']['energy_excess_ppm_upper'],.003014)
  self.assertFalse(p['leptons']['physical_interacting_identity_proved'])
  self.assertFalse(p['localized']['full_volume_enumerated'])
  self.assertGreater(p['radiation']['caps'][0]['pair_probability'],p['radiation']['caps'][1]['pair_probability'])
  self.assertGreater(p['radiation']['caps'][1]['vacuum_probability'],0)
  self.assertGreater(p['compiler']['cycle_reduction_factor'],1e34)
  self.assertFalse(p['compiler']['full_large_carrier_executed'])
  self.assertEqual(p['higgs']['massive_internal_rank'],14)
  self.assertTrue(p['higgs']['shared_quark_spectra_equal'])
  self.assertFalse(p['higgs']['observed_quark_mass_fit'])
  self.assertLess(p['gravity']['clock_shift_ppm_interval'][1],0)
  self.assertEqual(p['gravity']['clock_gap_count'],7)
  self.assertLess(p['quantum']['g_interval'][1],2)
  self.assertEqual(p['quantum']['electron_anchor_GeV'],e)
  self.assertFalse(p['quantum']['muon_tau_spectrum_transferred'])
  self.assertEqual(p['oscillation']['record_count'],36)
  self.assertGreater(p['weak']['receiver_probability_interval'][0],0)
  self.assertGreater(p['neutral_transfer']['receiver_probability_interval'][0],0)
  self.assertFalse(p['neutral_transfer']['earlier_flat_band_transferred'])
  self.assertEqual(len(p['source_sha256']),132)
  self.assertEqual(p['particle_results']['task_count'],10)
  self.assertFalse(p['particle_results']['catalogue']['source_joins']['all_sources_identified_as_one_interacting_theory'])
  self.assertFalse(p['particle_results']['widths']['muon_normalization_comparison']['independent_prediction'])
  current=p['previous_tasks'];self.assertEqual(current['task_count'],10)
  self.assertEqual(current['native_charge']['neutral_reference_charge'],'0')
  self.assertLess(current['infinite_photon']['photon_tail_above_three_upper'],8.278e-16)
  self.assertTrue(current['quantum_larmor']['same_rest_current_state_clock'])
  self.assertFalse(current['inclusive_decay']['physical_weak_lifetime_fit'])
  self.assertEqual(current['baryon']['singlet_dimension'],120)
  self.assertEqual(current['meson']['singlet_dimension'],64)
  self.assertFalse(current['common_scale']['physical_hadron_mass_fit'])
  self.assertEqual(len(current['common_scale']['rows']),13)
  self.assertLess(current['geometry']['witness_interval'][1],0)
  self.assertLess(current['wave']['transverse_shift'],0)
  self.assertGreater(current['wave']['gamma_minus_one_shift'],0)
  latest=p['reference_tasks'];self.assertEqual(latest['task_count'],10)
  self.assertFalse(latest['gauss']['intrinsic_electron_mass'])
  self.assertLess(latest['infinite_current']['g_interval'][1],2)
  self.assertFalse(latest['spatial']['normalizable_threshold_state'])
  self.assertLess(latest['averaging']['peak_interval'][0],.64)
  self.assertGreater(latest['averaging']['peak_interval'][1],.64)
  self.assertLess(latest['meson_current']['unconditional_pair_probability'],latest['meson_current']['conditional_pair_probability'])
  self.assertEqual(len(latest['vectorlike']['rows']),6)
  self.assertFalse(latest['vectorlike']['physical_quark_mass_fit'])
  self.assertFalse(latest['baryon_ordering']['beta_decay_energetically_allowed'])
  self.assertTrue(latest['dynamic_wave']['shared_autonomous_source'])
  self.assertGreater(latest['dynamic_wave']['delay_interval'][0],0)
  self.assertLess(latest['dynamic_wave']['bending_interval'][1],0)
  self.assertGreater(latest['dynamic_stress']['clock_spread_ppm_interval'][0],87)
  self.assertGreater(latest['six_quark']['binding_lower'],.246)
  self.assertGreater(latest['six_quark']['quadrupole_interval'][0],0)
  self.assertFalse(latest['six_quark']['physical_deuteron_fit'])
  new=p['current_tasks'];self.assertEqual(new['task_count'],10)
  self.assertEqual(len(new['calibrated_hadrons']['fits']),3)
  self.assertFalse(new['calibrated_hadrons']['independent_mass_prediction'])
  self.assertFalse(new['nuclear_exchange']['physical_deuteron_fit'])
  self.assertGreater(new['beta']['conditional_one_electron_probability'],.96)
  self.assertLess(new['beta']['unconditional_one_electron_probability'],.33)
  self.assertGreater(new['relational_clock']['delay_cycles_interval'][0],0)
  self.assertLess(new['geometry_refinement']['cap_three_arrival_TV_upper'],.000358)
  self.assertFalse(new['geometry_refinement']['compression_domain_is_the_right_cell_clock_superposition'])
  ninth=p['latest_tasks'];self.assertEqual(ninth['task_count'],10)
  self.assertTrue(ninth['neutrino_calibration']['oscillation_parameters_are_calibration'])
  self.assertFalse(ninth['neutrino_calibration']['rigid_charged_hierarchy_fits_splittings'])
  self.assertLess(ninth['neutrino_calibration']['complete_record_TV_bound'],4.1e-9)
  self.assertFalse(ninth['nuclear_distance']['fixed_four_input_source_is_bound'])
  self.assertFalse(ninth['hadron_spin_constraints']['one_common_spin_force_fits_both'])
  self.assertLess(ninth['beta_parity']['conditional_parity_upper'],0)
  self.assertGreater(ninth['common_mass_source']['window_probability_lower'],.96)
  self.assertEqual(ninth['platform_kernel']['Nambu_dimensions'],[11520,38880])
 def test_small_data_hooks_are_idempotent_and_fail_closed(self):
  original="const RER = 'https://github.com/FloatingPragma/observer-patch-holography/blob/main/'; const PLAIN = { }; const s = `${PLAIN[r.id] || ''}`; This is where OPH stands on each, by this project’s own assessment of its public evidence. OpenWave has not scored OPH."
  out=apply_data_hooks('openwave.js',original)
  self.assertEqual(out,apply_data_hooks('openwave.js',out))
  self.assertIn('CONSTRUCTION_SUMMARIES',out)
  with self.assertRaisesRegex(ValueError,'Fable data hook changed'):
   apply_data_hooks('openwave.js','a changed Fable renderer')
 def test_results_hook_preserves_standalone_data_and_is_idempotent(self):
  original="import { STATUS, TICKS, FILES, REF, PLACEHOLDER_LABEL, INCOMPLETE_LABEL, axisX, board, fmtDev, fmtPct, fmtSigma } from './results_data.js';\n  B = board(LIVE);\n<div class=\"rs-wrap\">${r.sym}${r.unit ?}"
  out=apply_data_hooks('results.js',original)
  self.assertEqual(out,apply_data_hooks('results.js',out))
  self.assertIn('applyConstructionNumbers(board(LIVE))',out)
  with self.assertRaisesRegex(ValueError,'Fable data hook changed'):
   apply_data_hooks('results.js',original.replace('B = board(LIVE)','B = changedBoard(LIVE)'))
 def test_matches_lead_retains_mixed_comparison_scope(self):
  original='<div class="mx-lead">One row per match. Left: what the simulation gives. Right: our universe.</div>'
  out=apply_data_hooks('matches.js',original)
  self.assertIn('Includes calibrated fits and conditional results.',out)
  self.assertEqual(out,apply_data_hooks('matches.js',out))
  with self.assertRaisesRegex(ValueError,'Fable data hook changed'):
   apply_data_hooks('matches.js','a changed lead')
 def test_changed_display_domains_are_rejected(self):
  mutations=[
   ('openwave_localized_rest_packet',lambda x:x['near_rest_localized_source'].__setitem__('source_time_horizon',100)),
   ('openwave_rotational_g_limit',lambda x:next(r for r in x['rows']if r['mass']==16384)['analytic_rational_bounds'].__setitem__('static_g_error_from_two','1')),
   ('openwave_neutral_preparation',lambda x:x['finite_filter_and_polar_service'].__setitem__('conditional_reduced_density_trace_error_decimal_upper',1e-6)),
   ('openwave_neutral_dispersion',lambda x:x['neutral_band_flatness_and_records'].__setitem__('exact_all_order_momentum_splitting','1')),
   ('openwave_full_higgs_floor',lambda x:x['countercontrols'].__setitem__('unequal_observed_quark_masses_derived',True)),
   ('openwave_factorized_compiler',lambda x:x['resources']['state_sensitive_same_packet'].__setitem__('full_large_carrier_executed',True)),
   ('openwave_lapse_observations',lambda x:x.__setitem__('physical_gravitational_redshift_or_Einstein_completion_claimed',True)),
   ('openwave_quantum_rotational',lambda x:x['calibration'].__setitem__('muon_tau_spectrum_transferred',True)),
   ('openwave_neutrino_oscillation',lambda x:x.__setitem__('measured_PMNS_fit_or_observed_neutrino_identification',True)),
   ('openwave_weak_decay',lambda x:x.__setitem__('observed_muon_lifetime_weak_scale_or_continuum_S_matrix_derived',True)),
   ('openwave_neutral_transfer',lambda x:x.__setitem__('same_side_two_low_energy_band_or_ground_transferred',True)),
   ('openwave_native_quantum_charge',lambda x:x.__setitem__('exact_filled_reference_electric_charge','1')),
   ('openwave_infinite_photon',lambda x:x['analytic_infinite_field'].__setitem__('finite_spatial_regulator_retained',False)),
   ('openwave_quantum_larmor',lambda x:x.__setitem__('field_strength_and_source_couplings_physically_calibrated',True)),
   ('openwave_inclusive_decay',lambda x:x['controlled_finite_time_survival'].__setitem__('large_bin_model_executed',True)),
   ('openwave_composite_scale',lambda x:x.__setitem__('physical_particle_rest_mass_claim',True)),
   ('openwave_quantum_geometry',lambda x:x.__setitem__('static_minimum_controller_used',True)),
   ('openwave_wave_deflection',lambda x:x.__setitem__('quantum_geometry_package_source_transfer_claimed',True)),
   ('openwave_local_gauss_quantum',lambda x:x['same_quantum_charged_block'].__setitem__('star_field_energy_is_intrinsic_isolated_electron_rest_mass',True)),
   ('openwave_current_averaging',lambda x:x.__setitem__('added_occupation_penalty_or_two_state_source',True)),
   ('openwave_meson_weak_current',lambda x:x.__setitem__('physical_kaon_decay_or_lifetime_identified',True)),
   ('openwave_vectorlike_flavour',lambda x:x.__setitem__('extra_branches_retained',0)),
   ('openwave_baryon_ordering',lambda x:x['exact_beta_threshold_obstruction'].__setitem__('n_to_p_e_antinu_ground_channel_energetically_allowed',True)),
   ('openwave_dynamic_wave',lambda x:x.__setitem__('geometry_refresh_or_static_profile_service_used',True)),
   ('openwave_dynamic_stress',lambda x:x['stress_backreaction'].__setitem__('finite_CCR_boundary_correction_discarded',True)),
   ('openwave_six_quark',lambda x:x['conditional_common_electron_unit'].__setitem__('physical_deuteron_mass_or_binding_identified',True))]
  rer=Path(os.environ.get('OPH_RER',RER))
  verified={path:read_bound(rer/path,rer)for path in SOURCES.values()}
  for package,mutate in mutations:
   def changed(path,rer):
    value=copy.deepcopy(verified[str(path.relative_to(rer))])
    if path.parent.name==package:mutate(value)
    return value
   with patch('sync_journey_results.read_bound',side_effect=changed):
    with self.assertRaises(AssertionError):project(Path(os.environ.get('OPH_RER',RER)))
 def test_changed_evidence_is_rejected(self):
  with tempfile.TemporaryDirectory()as tmp:
   r=Path(tmp);(r/'model').mkdir();source=r/'model/source.py';source.write_text('source=1\n')
   receipt=r/'receipt.json';receipt.write_text(json.dumps({'verdict':'PASS_TEST','source_sha256':{'model/source.py':digest(source)}}))
   read_bound(receipt,r);source.write_text('source=2\n')
   with self.assertRaisesRegex(ValueError,'stale source'):read_bound(receipt,r)
 def test_results_render_on_the_constructions_page_only(self):
  consumer='export function mount(host) { '+IMPORT+'.then((m) => m.renderJourneyResults()); }\n'
  check_placement(consumer,'export function mount(host) {}\n')
  with self.assertRaisesRegex(ValueError,'does not import'):check_placement('an unrelated viewer','export function mount(host) {}\n')
  with self.assertRaisesRegex(ValueError,'still mounts the results'):check_placement(consumer,'export function mount(host) {\n  '+LEGACY_HOOK+';\n}\n')
 def test_journey_removes_only_duplicate_matches_wall(self):
  story='<button data-page="matches">Results</button><div class="jy-film"></div>\n'
  maps='<div class="jy-cards">Maps and canvases</div>\n'
  container='  <div class="mw" id="journey-matches"></div>\n'
  mount="  import('./matches.js').then((m) => { const el = host.querySelector('#journey-matches'); if (el) m.wall(el); }).catch(() => {});\n"
  original=story+container+maps+mount
  cleaned=remove_journey_matches(original)
  self.assertEqual(cleaned,story+maps)
  self.assertEqual(remove_journey_matches(cleaned),cleaned)
  with self.assertRaisesRegex(ValueError,'matches mount changed'):remove_journey_matches(original.replace('m.wall(el)','m.different(el)'))
  with self.assertRaisesRegex(ValueError,'duplicates the matches wall'):check_placement(IMPORT,original)
if __name__=='__main__':unittest.main()
