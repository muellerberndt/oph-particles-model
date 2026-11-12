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
 def test_changed_display_domains_are_rejected(self):
  mutations=[
   ('openwave_localized_rest_packet',lambda x:x['near_rest_localized_source'].__setitem__('source_time_horizon',100)),
   ('openwave_rotational_g_limit',lambda x:next(r for r in x['rows']if r['mass']==16384)['analytic_rational_bounds'].__setitem__('static_g_error_from_two','1')),
   ('openwave_neutral_preparation',lambda x:x['finite_filter_and_polar_service'].__setitem__('conditional_reduced_density_trace_error_decimal_upper',1e-6)),
   ('openwave_neutral_dispersion',lambda x:x['neutral_band_flatness_and_records'].__setitem__('exact_all_order_momentum_splitting','1'))]
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
