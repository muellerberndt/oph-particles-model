"""Projection integrity, calibration ancestry and fail-closed overlay checks."""
import json,os,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
from sync_journey_results import project,read_bound,patched_journey,digest,ANCHOR,IMPORT,HOOK,RER

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
  self.assertEqual(len(p['source_sha256']),23)
  current=p['current_tasks'];self.assertEqual(current['task_count'],10)
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
   ('openwave_wave_deflection',lambda x:x.__setitem__('quantum_geometry_package_source_transfer_claimed',True))]
  for package,mutate in mutations:
   def changed(path,rer):
    value=read_bound(path,rer)
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
 def test_complete_overlay_is_idempotent_and_structure_checked(self):
  old='export function mount(host) {\n'+ANCHOR+'\n}\n'
  patched=patched_journey(old)
  self.assertEqual(patched_journey(patched),patched)
  self.assertEqual(patched.count(IMPORT),1);self.assertEqual(patched.count(HOOK),1)
  with self.assertRaisesRegex(ValueError,'mount structure changed'):patched_journey('an unrelated viewer')
if __name__=='__main__':unittest.main()
