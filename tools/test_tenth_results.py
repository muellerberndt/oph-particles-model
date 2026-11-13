"""Prevent calibration and source-join promotion in the displayed particle data."""
import copy,json,unittest
from pathlib import Path
from tenth_results import project

RER=Path(__file__).resolve().parents[2]/'reverse-engineering-reality'
NAMES=('mass_catalogue','lepton_widths','beta_angular','spin_gradient_nuclei','common_electromagnetism','boosted_records','neutrino_matter','single_valley_leptons','rest_spectroscopy','colour_string')

class ParticleProjectionTest(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.receipts={name:json.loads((RER/'model'/('openwave_'+name)/'results.json').read_text())for name in NAMES}
 def test_physical_roles_and_complete_fits(self):
  p=project(self.receipts)
  self.assertEqual(len(p['leptons']['rows']),3);self.assertEqual(len(p['neutrinos']['rows']),3)
  self.assertEqual(len(p['strong']['mass_fits']),3)
  self.assertGreater(p['strong']['partner_above_threshold_MeV_interval'][0],0)
  self.assertFalse(p['catalogue']['source_joins']['all_sources_identified_as_one_interacting_theory'])
  self.assertFalse(p['widths']['muon_normalization_comparison']['independent_prediction'])
  self.assertGreater(p['electromagnetism']['bare_self_energy_shift_GeV'],0)
 def test_fitted_or_disjoint_results_cannot_be_promoted(self):
  for name,path in [('mass_catalogue',('source_joins','all_sources_identified_as_one_interacting_theory')),('lepton_widths',('muon_normalization_comparison','independent_prediction')),('lepton_widths',('held_out_tau_mu_over_e','used_in_parameter_selection')),('common_electromagnetism',('architecture','transverse_photons_or_magnetic_loops')),('colour_string',('unit_elimination_control','simultaneous_benchmark_match_possible_with_nonnegative_adjusted_U'))]:
   changed=copy.deepcopy(self.receipts);changed[name][path[0]][path[1]]=True
   with self.subTest(source=name,path=path),self.assertRaises(AssertionError):project(changed)

if __name__=='__main__':unittest.main()
