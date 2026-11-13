"""Guard physical scope and outward rendering of independently certified intervals."""
import copy,json,os,unittest
from fractions import Fraction as F
from pathlib import Path
from seventeenth_results import NAMES,project
R=Path(os.environ.get('OPH_RER',Path(__file__).resolve().parents[2]/'reverse-engineering-reality'))
class OperationalProjectionTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.data={n:json.loads((R/'model'/('openwave_'+n)/'results.json').read_text())for n in NAMES}
 def test_outward_numeric_and_observation_roles(self):
  p=project(self.data);c=self.data['capacity_normalization_transfer']['validated_metric_quadrature']['records'][0]
  pairs=[(p['lambda']['current_mean_GeV'],self.data['lambda_spectral_measure']['actual_successful_current_energy']['mean_GeV_interval']),
   (p['capacity']['metric'],c['capacity']['metric_transfer_interval']),(p['capacity']['lambda_metric'],c['lambda']['metric_transfer_interval']),
   (p['capacity']['metric_ratio'],c['capacity_to_lambda_metric_ratio_interval'])]
  pairs += [(x['gap'],y['full_gap_interval_exact'])for x,y in zip(p['gauge'],self.data['energy_schur']['records'])]
  pairs += [(x['GeV'],y['full_dynamic_ground_GeV_interval'])for x,y in zip(p['nuclear'],self.data['nuclear_em_transfer']['complete_ground_bounds'])]
  for shown,exact in pairs:self.assertLessEqual(F(shown[0]),F(exact[0]));self.assertGreaterEqual(F(shown[1]),F(exact[1]))
  self.assertFalse(p['lambda']['rest_mass']);self.assertFalse(p['capacity']['density_growth_or_CMB'])
  self.assertEqual(p['clock']['controls'],6);self.assertEqual(p['fock']['modes'],192)
 def test_physical_promotion_mutations_rejected(self):
  for name,path in [('finite_phase_clock',('scope','literal_openwave_row3_validated')),('lambda_spectral_measure',('on_shell_native_weak_density_proved',)),
    ('nuclear_em_transfer',('new_mass_fit',)),('energy_schur',('nontrivial_continuum_or_Clay_result',)),
    ('gravity_noise_normalization',('scope','physical_metric_noise_identified')),('capacity_normalization_transfer',('mode_and_observation_scope','metric_ratio_is_parent_finite_k_matter_growth_ratio'))]:
   d=copy.deepcopy(self.data);x=d[name]
   for key in path[:-1]:x=x[key]
   x[path[-1]]=True
   with self.assertRaises(AssertionError):project(d)
 def test_calibration_removal_and_hidden_nuclear_failures_rejected(self):
  d=copy.deepcopy(self.data);d['collective_finite_strength']['scope']['N_inherited_from_observed_G_calibration']=False
  with self.assertRaises(AssertionError):project(d)
  d=copy.deepcopy(self.data);next(x for x in d['nuclear_em_transfer']['complete_ground_bounds']if x['name']=='alpha')['target_in_certified_interval']=True
  with self.assertRaises(AssertionError):project(d)
if __name__=='__main__':unittest.main()
