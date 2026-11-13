"""Guard exact interfaces, outward display bounds and physical scope."""
import copy,json,os,unittest
from fractions import Fraction as F
from pathlib import Path
from twentyfirst_results import NAMES,project
R=Path(os.environ.get('OPH_RER',Path(__file__).resolve().parents[2]/'reverse-engineering-reality'))
class JointNativeProjectionTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.data={n:json.loads((R/'model'/n/'results.json').read_text())for n in NAMES}
 def test_same_program_is_required_and_not_a_physical_award(self):
  p=project(self.data);self.assertTrue(p['same_local_source_field_clock_interface']);self.assertEqual(p['official_untested_rows'],31);self.assertEqual(p['new_GeV_rest_masses'],[])
  d=copy.deepcopy(self.data);d['native_gauss_clock']['common_program_sha256']='unrelated'
  with self.assertRaises(AssertionError):project(d)
  d=copy.deepcopy(self.data);d['native_gauss_clock']['integer_extension_descriptor']['electric_energy_coefficient']='1/9'
  with self.assertRaises(AssertionError):project(d)
  d=copy.deepcopy(self.data);d['native_criterion_packet']['criterion1']['physical_acceptance_complete']=True
  with self.assertRaises(AssertionError):project(d)
 def test_tracking_complement_and_alternative_instruments_remain(self):
  p=project(self.data);self.assertEqual(p['joint']['canonical_dressing'],'48179/81000');self.assertEqual(p['localization']['fixed_code_failure'],'23/90');self.assertFalse(p['clock']['decoder_compiled'])
  d=copy.deepcopy(self.data);d['native_gauss_clock']['same_joint_two_time_records'][0]['alternative_measurements_inserted_into_clock_protocol']=True
  with self.assertRaises(AssertionError):project(d)
  d=copy.deepcopy(self.data);d['native_gauss_clock']['scope']['local_autonomous_clock_proved']=True
  with self.assertRaises(AssertionError):project(d)
 def test_phase_energies_cannot_be_promoted_to_joint_particle_masses(self):
  p=project(self.data);self.assertFalse(p['spectrum']['physical_rest_mass']);self.assertFalse(p['spectrum']['joint_electric_spectrum'])
  for path in('physical_rest_mass_assignment','spectrum_of_flux_dressed_joint_electric_program'):
   d=copy.deepcopy(self.data);part='unit_contract'if path=='physical_rest_mass_assignment'else'scope';d['native_transport_spectrum'][part][path]=True
   with self.assertRaises(AssertionError):project(d)
  self.assertEqual(p['contact']['identity'],'L3=dGamma(L)-2P_adj');self.assertIsNone(p['contact']['additional_interaction_parameter'])
 def test_all_displayed_intervals_are_outward_and_scalar_scope_preserved(self):
  p=project(self.data);pairs=[]
  for a,b in zip(p['spectrum']['rows'],self.data['native_transport_spectrum']['rows']):pairs.extend([(a['laplacian'],b['compression_L_min_interval_exact']),(a['phase_energy_GeV'],b['conditional_phase_energy_GeV_interval_exact'])])
  for a,b in zip(p['spatial']['refinements'],self.data['native_spatial_refinement']['refinement_family']):pairs.append((a['omega_squared'],b['continuum_frequency_squared_interval_exact']))
  for a,b in pairs:self.assertLessEqual(F(a[0]),F(b[0]));self.assertGreaterEqual(F(a[1]),F(b[1]))
  self.assertEqual(p['spatial']['ports'],[96,324,768]);self.assertFalse(p['spatial']['fine_reflection_compiled']);self.assertFalse(p['spatial']['physical_light_speed'])
  d=copy.deepcopy(self.data);d['native_spatial_refinement']['scope']['four_dimensional_Yang_Mills_mass_gap']=True
  with self.assertRaises(AssertionError):project(d)
if __name__=='__main__':unittest.main()
