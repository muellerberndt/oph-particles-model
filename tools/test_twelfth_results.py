"""Actual numeric projection and explicit negative comparison boundaries."""
import copy,json,unittest
from sync_journey_results import RER,SOURCES
from twelfth_results import project


class ObservableProjectionTest(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.receipts={k:json.loads((RER/p).read_text())for k,p in SOURCES.items()}
 def test_actual_energies_and_certified_boundaries(self):
  p=project(self.receipts)
  self.assertEqual(p['task_count'],10)
  self.assertEqual(next(x for x in p['strange']['masses']if x['name']=='K+')['computed_GeV'],.493677)
  self.assertFalse(p['strange']['on_shell_strange_channel_open'])
  self.assertLess(p['bulk']['neutron_GeV_interval'][0],.93956542194)
  self.assertGreater(p['bulk']['neutron_GeV_interval'][1],.93956542194)
  self.assertFalse(p['core']['rows'][0]['resolved_core_onset'])
  self.assertLess(p['core']['rows'][0]['largest_suppression_interval'][1],1/16)
  self.assertTrue(p['yang_mills']['proved']['above_threshold_finite_volume_gap_uniform_in_side'])
  self.assertFalse(p['yang_mills']['numeric_threshold'])
  self.assertFalse(p['cosmology']['Lambda_amplitude_derived'])
  self.assertGreater(p['gravity']['unit_test']['conditional_to_observed_strength_ratio'],1e39)
  self.assertGreater(p['gravity']['records']['conditional_arrival_delay'],p['gravity']['records']['arrival_delay_error_upper'])
 def test_false_promotions_rejected(self):
  for key,path in [('strange_composites',('native_nonleptonic_vertex_and_obstruction','strong_channel_is_kinematically_open')),
                   ('su2_volume_gap',('scope_limits','Clay_Yang_Mills_problem_solved')),
                   ('light_nuclear_curve',('mass_comparisons','alpha','matches')),
                   ('transverse_gravity',('independent_energy_length_attachment','physical_G_strength_match'))]:
   r=dict(self.receipts);r[key]=copy.deepcopy(r[key]);x=r[key]
   for k in path[:-1]:x=x[k]
   x[path[-1]]=True
   with self.subTest(key=key),self.assertRaises(AssertionError):project(r)
 def test_computed_values_drive_projection(self):
  r=dict(self.receipts);r['strange_composites']=copy.deepcopy(r['strange_composites'])
  next(x for x in r['strange_composites']['mass_rows']if x['name']=='K+')['computed_GeV']+=.001
  p=project(r);row=next(x for x in p['strange']['masses']if x['name']=='K+')
  self.assertAlmostEqual(row['computed_GeV'],.494677)
  self.assertEqual(row['comparison_GeV'],'.493677')

if __name__=='__main__':unittest.main()
