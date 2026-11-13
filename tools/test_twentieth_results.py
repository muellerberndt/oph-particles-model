"""Protect same-source interfaces, physical boundaries and outward display data."""
import copy,json,os,unittest
from fractions import Fraction
from pathlib import Path
from twentieth_results import NAMES,project
R=Path(os.environ.get('OPH_RER',Path(__file__).resolve().parents[2]/'reverse-engineering-reality'))
class CoherentIntegrationTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.data={n:json.loads((R/'model'/('openwave_'+n)/'results.json').read_text())for n in NAMES}
 def test_actual_signal_and_compensation_are_separate(self):
  p=project(self.data);self.assertEqual(p['charge']['covariance'],'3/8');self.assertEqual(p['charge']['control_covariance'],'0');self.assertEqual(p['charge']['uncompensated_coherence'],'85/96')
  d=copy.deepcopy(self.data);d['native_charge_readout']['matching_clock_recovery_join']['uncompensated_clock_theorem_transferred']=True
  with self.assertRaises(AssertionError):project(d)
 def test_hardware_equality_does_not_promote_programs_or_mass(self):
  p=project(self.data);self.assertFalse(p['architecture']['one_interchangeable_evolution']);self.assertEqual(p['new_GeV_rest_masses'],[]);self.assertFalse(p['lepton_hierarchy_matched'])
  d=copy.deepcopy(self.data);d['native_coherent_clock']['shared_charge_clock_program']['common_hardware']['carrier']='different source'
  with self.assertRaises(AssertionError):project(d)
  d=copy.deepcopy(self.data);d['native_calibrated_energy']['energy_attachment']['physical_rest_pole_or_particle_identification']=True
  with self.assertRaises(AssertionError):project(d)
 def test_all_displayed_energy_packet_and_transfer_intervals_are_outward(self):
  p=project(self.data);pairs=[]
  for shown,exact in zip(p['energies'],self.data['native_calibrated_energy']['energy_attachment']['rows']):pairs.append((shown['inferred_GeV'],exact['record_inferred_anchor_scaled_gap_GeV_interval_exact']))
  for shown,exact in zip(p['packet']['rows'],[x for x in self.data['coherent_native_propagation']['packets']if x['radius']==2]):pairs.append((shown['outside_ball'],exact['records'][-1]['outside_preparation_ball_probability_interval']))
  t=self.data['native_euclidean_transfer'];members=[t['two_load_twelve_port_member']]+t['one_load_spatial_members']
  for shown,exact in zip(p['euclidean']['members'],members):pairs.append((shown['gap'],[exact['event_hamiltonian_gap_lower_exact'],exact['event_hamiltonian_gap_upper_exact']]))
  for shown,exact in pairs:self.assertLessEqual(Fraction(shown[0]),Fraction(exact[0]));self.assertGreaterEqual(Fraction(shown[1]),Fraction(exact[1]))
 def test_finite_transfer_never_awards_clay_or_nature(self):
  p=project(self.data);self.assertFalse(p['euclidean']['four_dimensional_Yang_Mills']);self.assertFalse(p['new_independent_nature_validation']);self.assertEqual(p['official_untested_rows'],31)
  for key in ('four_dimensional_field_limit','uniform_physical_continuum_gap','pure_yang_mills_identification','OpenWave_criterion_awarded'):
   d=copy.deepcopy(self.data);d['native_euclidean_transfer']['scope'][key]=True
   with self.assertRaises(AssertionError):project(d)
if __name__=='__main__':unittest.main()
