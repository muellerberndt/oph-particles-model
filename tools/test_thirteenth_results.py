"""Refuse scope promotion and retain outward scientific display enclosures."""
import copy,json,unittest
from pathlib import Path
from fractions import Fraction as F
from thirteenth_results import project

RER=Path(__file__).resolve().parents[2]/'reverse-engineering-reality'
NAMES=('baryon_dispersion','cluster_bandwidth','nuclear_isospin','clock_phase_resource','quotient_homotopy','resolved_core','gravity_unit_constraint',
       'horizon_capacity','dirac_field_connection','su2_propagation')

class CurrentProjectionTests(unittest.TestCase):
 def setUp(self):
  self.receipts={name:json.loads((RER/'model'/('openwave_'+name)/'results.json').read_text())for name in NAMES}

 def test_exact_endpoints_are_never_narrowed(self):
  result=project(self.receipts)
  for raw,row in zip(self.receipts['resolved_core']['members'],result['core']['rows']):
   for raw_key,key in [('radius_x_cells_interval_exact','radius_cells'),('largest_first_Brillouin_zone_suppression_interval_exact','suppression'),('half_suppression_wavevector_times_measured_radius_interval_exact','onset_k_radius')]:
    source=raw['complete_core_probe'][raw_key];self.assertLessEqual(F(row[key][0]),F(source[0]));self.assertGreaterEqual(F(row[key][1]),F(source[1]))
   for i in [0,1]:
    if i==0:self.assertLessEqual(F(row['GeV_interval'][i]),F(raw['reference_bound_energy_GeV_interval_exact'][i]))
    else:self.assertGreaterEqual(F(row['GeV_interval'][i]),F(raw['reference_bound_energy_GeV_interval_exact'][i]))
  for raw,row in zip(self.receipts['su2_propagation']['full_flux_propagation_bounds'],result['yang_mills']['bounds']):
   self.assertGreaterEqual(F(row['volume_error_upper']),F(raw['finite_box_to_infinite_dynamics_norm_upper']))

 def test_physical_promotion_and_selection_laundering_fail(self):
  changes=[('resolved_core','scope','physical_QED_or_QCD_beta_function_derived',True),
           ('baryon_dispersion','positive_correlated_propagation','other_full_Fock_spectra_transferred',True),
           ('cluster_bandwidth','native_weak_scope','new_on_shell_weak_matrix_element_certified',True),
           ('nuclear_isospin','declared_electrostatic_member','full_positive_Gauss_field_equivalence_proved',True),
           ('resolved_core','scope','reference_bound_energies_are_observed_particle_poles',True),
           ('resolved_core','regulator_selection','selection_uses_resolution_outcome',False),
           ('clock_phase_resource','scope','autonomous_rest_mass_phase_onset_established',True),
           ('quotient_homotopy','scope','source_state_contains_a_localized_classical_angle_texture',True),
           ('dirac_field_connection','scope','interacting_Lorentz_covariance',True),
           ('gravity_unit_constraint','fixed_source','length_alone_can_match_both',True),
           ('su2_propagation','scope','Clay_problem_solved',True)]
  for name,group,key,value in changes:
   with self.subTest(key=key):
    changed=copy.deepcopy(self.receipts);changed[name][group][key]=value
    with self.assertRaises(AssertionError):project(changed)

 def test_same_sample_alternatives_keep_calibration(self):
  p=project(self.receipts)
  self.assertEqual(len(p['cosmology']['comparisons']),8)
  self.assertTrue(all(x['rows']==15 and x['fitted_chronometer_parameters']==0 for x in p['cosmology']['comparisons']))
  self.assertFalse(p['cosmology']['alternatives_independent'])
  self.assertFalse(p['cosmology']['Lambda_amplitude_derived'])
  self.assertEqual(p['core']['Wilson'],'1/2')
  self.assertGreater(p['core']['rows'][0]['suppression'][0],.5)
  self.assertEqual(p['clock']['word_counts'],[81]*4)
  self.assertEqual(p['quotient']['winding'],'-1')

if __name__=='__main__':unittest.main()
