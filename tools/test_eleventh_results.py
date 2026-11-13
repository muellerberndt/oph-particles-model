"""Current result domains and nonstandard gauge-verdict admission."""
import copy,hashlib,json,tempfile,unittest
from pathlib import Path
from eleventh_results import project
from sync_journey_results import RER,SOURCES,read_bound


class CurrentResultsTest(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.receipts={k:json.loads((RER/p).read_text())for k,p in SOURCES.items()}
 def test_projected_calibrations_and_distinct_sources(self):
  x=project(self.receipts)
  self.assertEqual(len(x['strong']['mass_fits']),5)
  self.assertEqual(x['strong']['unassigned_bound_channels'],[])
  self.assertFalse(x['strong']['neutral_pion_control']['matches'])
  self.assertEqual(x['length']['tension_GeV_per_fm'],1)
  self.assertEqual(x['strong_steps']['pinned_slope_GeV_per_fm'],1)
  self.assertFalse(x['strong_steps']['higher_graph_fit_preserved'])
  self.assertLess(x['yang_mills']['volume_controls'][-1]['gap_lower'],0)
  self.assertFalse(x['yang_mills']['uniform_infinite_volume_gap'])
  self.assertGreater(x['transverse']['position_flux_table_error_upper'],x['transverse']['truncation_TV_upper'])
  self.assertGreater(x['profiles']['radius_ratio_interval'][0],x['profiles']['observed_ratio_interval'][1])
  self.assertEqual(x['gravity']['sites'],343)
 def test_false_physical_promotions_fail_closed(self):
  mutations=[('pure_su2_source',lambda x:x['scope'].__setitem__('Clay_problem_solved',True)),
   ('common_hyperfine_spectrum',lambda x:x['held_out_neutral_pion_control'].__setitem__('matches',True)),
   ('baryon_form_factors',lambda x:x['shared_length_comparison'].__setitem__('physical_radius_target_used_to_fit_source_or_length',True)),
   ('passive_clock_records',lambda x:x.__setitem__('passive_ground_state_time_crystal_or_self_starting_one_point_clock',True)),
   ('quark_flux_records',lambda x:x.__setitem__('fractional_spatial_texture_winding_or_stable_quark_identity_proved',True)),
   ('common_gravity_records',lambda x:x['scope'].__setitem__('finite_native_clock_ratios_exactly_universal',True))]
  for name,mutate in mutations:
   values=dict(self.receipts);values[name]=copy.deepcopy(values[name]);mutate(values[name])
   with self.subTest(name=name),self.assertRaises(AssertionError):project(values)
 def test_gauge_verdict_requires_exact_schema_and_bound_scope(self):
  with tempfile.TemporaryDirectory()as tmp:
   root=Path(tmp);source=root/'source.py';source.write_text('declared source\n')
   receipt=root/'results.json'
   value={'schema':'oph.full_Haar_pure_SU2_finite_cube.v1',
    'verdict':'PURE_SU2_FULL_LINK_SOURCE_AND_FINITE_CUBE_GAP',
    'scope':{'Clay_problem_solved':False},'source_sha256':{'source.py':hashlib.sha256(source.read_bytes()).hexdigest()}}
   receipt.write_text(json.dumps(value));self.assertEqual(read_bound(receipt,root),value)
   for key,bad in [('schema','unknown'),('verdict','UNREVIEWED_GAP')]:
    changed=dict(value);changed[key]=bad;receipt.write_text(json.dumps(changed))
    with self.assertRaises(ValueError):read_bound(receipt,root)
   value['scope']['Clay_problem_solved']=True;receipt.write_text(json.dumps(value))
   with self.assertRaises(ValueError):read_bound(receipt,root)

if __name__=='__main__':unittest.main()
