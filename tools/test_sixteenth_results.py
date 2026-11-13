"""Physical-promotion and outward-projection regression controls."""
import copy,json,os,unittest
from fractions import Fraction as F
from pathlib import Path
from sixteenth_results import project,NAMES
R=Path(os.environ.get('OPH_RER',Path(__file__).resolve().parents[2]/'reverse-engineering-reality'))
class CompleteDynamicsTests(unittest.TestCase):
 def setUp(self):self.d={n:json.loads((R/'model'/('openwave_'+n)/'results.json').read_text())for n in NAMES}
 def test_outward_bounds_and_distinct_energy_observables(self):
  p=project(self.d);e=self.d['lambda_wavepacket']['calibrated_energy']
  for shown,exact in [(p['strange']['rest_GeV'],e['source_rest_pole_GeV_interval']),(p['strange']['packet_mean_GeV'],e['trial_packet_mean_GeV_interval'])]+[(s['gap'],r['full_gap_interval_exact'])for s,r in zip(p['gauge']['records'],self.d['refined_haar_spectrum']['records'])]:
   self.assertLessEqual(F(shown[0]),F(exact[0]));self.assertGreaterEqual(F(shown[1]),F(exact[1]))
  self.assertLessEqual(F(p['strange']['band_probability_lower']),F(self.d['lambda_wavepacket']['complete_source_pole']['unfiltered_trial_ground_band_probability_lower']))
  m=self.d['haar_memory_closure'];self.assertGreaterEqual(F(p['gauge']['zero_energy_self_energy_error_upper']),F(m['actual_computed_self_energy']['full_Sigma0_minus_computed_matrix_norm_upper_exact']))
  self.assertLessEqual(F(p['gauge']['probe_memory_improvement_lower']),1/F(m['same_clock_semigroup_defect_controls'][1]['retained_upper_divided_by_boundary_lower_exact']))
  self.assertGreater(p['strange']['packet_mean_GeV'][0],p['strange']['rest_GeV'][1]);self.assertFalse(p['new_independent_nature_validation'])
 def test_unproved_physical_promotions_fail(self):
  for name,path in [('lambda_wavepacket',('physical_3plus1_Lambda_identification',)),('lambda_wavepacket',('calibrated_energy','mean_energy_is_rest_mass')),('cluster_weyl_sequence',('outgoing_wave_operator_constructed',)),('cluster_weyl_sequence',('constructive_Weyl_family','finite_local_observer_preparation_of_exact_spectral_vectors_compiled')),('refined_haar_spectrum',('physical_GeV_calibration_or_new_Nature_validation',)),('collective_gravity_strength',('scope','independent_Newton_prediction')),('capacity_transfer',('scope','new_Nature_validation'))]:
   with self.subTest(name=name,path=path):
    d=copy.deepcopy(self.d);x=d[name]
    for k in path[:-1]:x=x[k]
    x[path[-1]]=True
    with self.assertRaises(AssertionError):project(d)
 def test_calibration_and_full_complement_required(self):
  for name,path,value in [('full_strong_current',('rigorous_finite_time','nonzero_complete_autonomous_response_proved'),False),('cluster_weyl_sequence',('energy_shell','complete_interacting_H5_essential_spectrum_contains_native_Lambda_rest_energy'),False),('collective_gravity_strength',('calibrated_member','calibration_input'),'derived'),('refined_haar_spectrum',('fine_interior_modes_are_retained',),False),('haar_memory_closure',('actual_computed_self_energy','all_Q_representations_and_multiplicities_in_remainder'),False)]:
   d=copy.deepcopy(self.d);x=d[name]
   for k in path[:-1]:x=x[k]
   x[path[-1]]=value
   with self.assertRaises(AssertionError):project(d)
if __name__=='__main__':unittest.main()
