import copy
import unittest
from sync_finite_results import RER,load_receipt,SOURCES,homepage_highlights
from project_current_results import SOURCES as CURRENT,project

class CurrentProjectionTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.receipts={key:load_receipt(RER/'model'/SOURCES[key][0],RER) for key in [*CURRENT,'joint_identity']}

 def test_complete_domains_and_retained_errors(self):
  v=project(self.receipts)
  self.assertEqual(len(v['cards']),10);self.assertEqual(len(v['spectroscopy']),17)
  for row in v['spectroscopy']:
   self.assertEqual(len(row['records']),32);self.assertAlmostEqual(sum(x['probability'] for x in row['records']),1)
  self.assertEqual([len(x['records']) for x in v['archive']],[4,16,256])
  self.assertEqual(v['archive'][-1]['ranks'],{'1':16,'2':64,'3':176})
  self.assertTrue(all(len(r['rows'])==6 for r in v['bare_quarks']))
  self.assertTrue(v['neutrino']['envelope'][0]<=v['neutrino']['ee']<=v['neutrino']['envelope'][1])

 def test_promotions_and_record_loss_rejected(self):
  for key,path,value in [
   ('finite_spectroscopy',('scope','neutrino_species_resolved_by_executed_five_qubit_pointer'),True),
   ('finite_spectroscopy',('adaptive_pointer','classical_history_erased'),True),
   ('finite_spectroscopy',('uniform_confidence','all_source_unconditional_65_over72_coverage_claimed'),True),
   ('archive_compression',('scope','original_record_histories_erased_or_coarsened'),True),
   ('neutrino_observables',('mass_observables','all_masses_are_conditional_calibration'),False),
   ('paired_quark_scale',('scope','identified_up_down_or_strange_mass'),True),
   ('quantum_relaxation',('scope','physical_clock_or_Universe_abundances_derived'),True)]:
   changed=copy.deepcopy(self.receipts);target=changed[key]
   for name in path[:-1]:target=target[name]
   target[path[-1]]=value
   with self.subTest(key=key),self.assertRaises(ValueError):project(changed)
  changed=copy.deepcopy(self.receipts);del changed['finite_spectroscopy']['all_checks_pass']
  with self.assertRaises(ValueError):project(changed)
  changed=copy.deepcopy(self.receipts);changed['finite_spectroscopy']['complete_records'].pop()
  with self.assertRaises(ValueError):project(changed)

 def test_invalid_expansion_point_law_rejected(self):
  for field,value in [('expected_total_number',181),('all181_total_number_probabilities',[-.1,1.1]+[0.]*179)]:
   changed=copy.deepcopy(self.receipts)
   changed['expanding_particles']['protocols'][0]['preparations'][0]['complete_number_readout'][field]=value
   with self.subTest(field=field),self.assertRaises(ValueError):project(changed)

 def test_cancelling_invalid_species_means_rejected(self):
  changed=copy.deepcopy(self.receipts);rows=changed['expanding_particles']['protocols'][0]['preparations'][0]['complete_number_readout']['complete12_species_number_laws']
  rows[0]['mean_number']+=200;rows[1]['mean_number']-=200
  with self.assertRaises(ValueError):project(changed)

 def test_homepage_values_and_idempotence(self):
  v=project(self.receipts);original='<main><div id="journey-host"></div><div id="constructions-host"></div></main>'
  html=homepage_highlights(original,v)
  self.assertEqual(homepage_highlights(html,v),html)
  self.assertIn('Bare Wilson, not identified quark masses',html)
  self.assertIn('8.899344e-12',html)
  self.assertEqual(html.count('id="current-highlights"'),1)

if __name__=='__main__':unittest.main()
