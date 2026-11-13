"""Reject false physical promotions and enforce outward source projections."""
import copy,json,os,unittest
from fractions import Fraction as F
from pathlib import Path
from fifteenth_results import project
RER=Path(os.environ.get('OPH_RER',Path(__file__).resolve().parents[2]/'reverse-engineering-reality'))
NAMES=('uniform_pole_bands','normalizable_particle_records','scattering_current_support','haar_coupling_flow','cubic_haar_source','gauge_refinement_clock','staggered_ward','replicated_geometry','capacity_perturbations')
class NormalizableCompletionTests(unittest.TestCase):
 def setUp(self):self.data={n:json.loads((RER/'model'/('openwave_'+n)/'results.json').read_text())for n in NAMES}
 def test_intervals_and_bounds_are_outward(self):
  p=project(self.data);cube=self.data['cubic_haar_source']['records'][-1]
  for shown,exact in [(p['cube']['gap_source_units'],cube['full_source_gap_interval_exact']),(p['cube']['adjacent_covariance'],next(x for x in cube['all_fifteen_connected_covariances']if not x['opposite'])['connected_covariance_interval_exact'])]:
   self.assertLessEqual(F(shown[0]),F(exact[0]));self.assertGreaterEqual(F(shown[1]),F(exact[1]))
  for member in self.data['normalizable_particle_records']['members']:
   self.assertLessEqual(F(p['packets']['band_probability_lower']),F(member['uniform_band_projector_probability_lower']))
   self.assertLessEqual(F(p['packets']['inside_probability_lower']),F(member['position_record']['band_conditioned_inside_probability_lower']))
  exact=self.data['replicated_geometry']['complete_register_records'][-1]['vacuum_lapse']['relative_variance_upper_interval'][1]
  self.assertGreaterEqual(F(p['geometry']['relative_vacuum_variance_upper']),F(exact))
  self.assertGreaterEqual(F(p['cosmology']['barotropic_sound_speed_upper']),F('-1/5'))
 def test_source_probabilities_are_not_physical_identifications(self):
  p=project(self.data);self.assertGreater(p['packets']['band_probability_lower'],.9999614)
  self.assertGreater(p['packets']['inside_probability_lower'],.984025)
  self.assertEqual(p['strange']['independent_proton_pion_fields'],23)
  self.assertGreater(p['cube']['adjacent_covariance'][0],0)
  self.assertEqual(p['cosmology']['scalar_curvature_bounds'],[2,6])
  self.assertFalse(p['new_independent_nature_validation'])
  self.assertFalse(p['packets']['finite_local_band_filter']);self.assertFalse(p['strange']['normalizable_Lambda_packet'])
 def test_physical_and_continuum_promotions_are_rejected(self):
  changes=[('uniform_pole_bands',('physical_four_dimensional_particle_dictionary_proved',)),('normalizable_particle_records',('physical_four_dimensional_particle_identification',)),('normalizable_particle_records',('complete_protocol','finite_local_compilation_of_exact_band_filter_proved')),('scattering_current_support',('complete_Lambda_pole_transfer','normalizable_Lambda_packet_executed')),('scattering_current_support',('interacting_spectral_test','Moller_wave_operator_constructed')),('cubic_haar_source',('physical_gap_GeV_or_continuum_identification',)),('gauge_refinement_clock',('scope','autonomous_full_Hamiltonian_RG_derived')),('replicated_geometry',('scope','physical_Newton_strength_matched')),('staggered_ward',('scope','physical_metric_or_stress_derived')),('capacity_perturbations',('canonical_scalar_completion','source_scalar_transfer_proved')),('capacity_perturbations',('scope','new_observational_match'))]
  for name,path in changes:
   with self.subTest(name=name,path=path):
    d=copy.deepcopy(self.data);x=d[name]
    for key in path[:-1]:x=x[key]
    x[path[-1]]=True
    with self.assertRaises(AssertionError):project(d)
 def test_complete_carrier_and_outcomes_required(self):
  for name,path,value in [('normalizable_particle_records',('normalizable_packet','finite_ring_or_delta_momentum_substitution'),True),('cubic_haar_source',('representation_projection_is_source_cutoff',),True),('replicated_geometry',('complete_register_records',-1,'complete_geometry_dimension'),256)]:
   d=copy.deepcopy(self.data);x=d[name]
   for key in path[:-1]:x=x[key]
   x[path[-1]]=value
   with self.assertRaises(AssertionError):project(d)
if __name__=='__main__':unittest.main()
