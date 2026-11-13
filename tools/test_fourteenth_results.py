"""Complete source projection, outward intervals and physical scope guards."""
import copy, json, os, unittest
from pathlib import Path
from fractions import Fraction as F
from fourteenth_results import project
RER=Path(os.environ.get('OPH_RER',Path(__file__).resolve().parents[2]/'reverse-engineering-reality'))
NAMES=('baryon_poles','pole_weak_current','strange_shell_current','coupled_haar_source','coupled_haar_spectrum','euclidean_refinement','source_ward','einstein_error','radiation_capacity')
class SourceCompletionTests(unittest.TestCase):
 def setUp(self):
  self.data={k:json.loads((RER/'model'/('openwave_'+k)/'results.json').read_text())for k in NAMES}
 def test_poles_currents_and_outward_endpoints(self):
  p=project(self.data); source=next(x for x in self.data['baryon_poles']['momentum_fibre_records']if x['assignment']=='neutron'and x['cosine']=='1'and x['sine']=='0')
  for displayed,raw in [(p['poles']['neutron_GeV'],source['source_pole_GeV_interval']), (p['strange']['shell_momentum_GeV'],self.data['strange_shell_current']['same_source_energy_shell']['opposite_momentum_GeV_interval'])]:
   self.assertLessEqual(F(displayed[0]),F(raw[0])); self.assertGreaterEqual(F(displayed[1]),F(raw[1]))
  self.assertGreater(p['poles']['neutron_prepared_weight_lower'],.9999997)
  self.assertEqual(p['poles']['rest_vector_exact'],'1');self.assertFalse(p['poles']['physical_4D_poles'])
  self.assertFalse(p['strange']['on_shell_decay_amplitude']);self.assertFalse(p['strange']['normalizable_wavepacket_transfer'])
 def test_failed_continuum_trajectory_and_supplied_cosmology_retained(self):
  p=project(self.data);self.assertFalse(p['gauge']['fixed_coupling_graph_limit_noncollapsed'])
  self.assertFalse(p['gauge']['physical_GeV']);self.assertFalse(p['gauge']['Clay_solved'])
  self.assertGreater(p['gauge']['connected_Wilson_covariance'][0],0)
  self.assertEqual(p['radiation']['rows'][-1]['redshift'],1000000)
  self.assertEqual(p['radiation']['validated_steps'],1772)
  self.assertFalse(p['radiation']['particle_abundances']);self.assertFalse(p['radiation']['independent_nature_validation'])
  self.assertFalse(p['geometry']['physical_metric_derived']);self.assertFalse(p['geometry']['nonlinear_Einstein_derived'])
 def test_mutation_guards_reject_false_physical_promotions(self):
  changes=[('baryon_poles',('physical_3plus1_Lorentz_particle_pole_identification',)),('pole_weak_current',('autonomous_weak_decay_or_neutron_lifetime_proved',)),('strange_shell_current',('physical_on_shell_decay_amplitude_proved',)),('strange_shell_current',('complete_component_probe','normalizable_wave_packet_transfer_executed')),('coupled_haar_spectrum',('scope','Clay_problem_solved')),('euclidean_refinement',('continuum_acceptance','fixed_graph_fixed_coupling_trajectory_admitted')),('source_ward',('scope','physical_metric_assignment_derived')),('einstein_error',('scope','cosmological_constant_fixed_by_null_records')),('radiation_capacity',('scope','early_universe_abundances_calculated'))]
  for name,path in changes:
   with self.subTest(name=name,path=path):
    d=copy.deepcopy(self.data);x=d[name]
    for key in path[:-1]:x=x[key]
    x[path[-1]]=True
    with self.assertRaises(AssertionError):project(d)
 def test_native_current_requires_identical_pole_source(self):
  d=copy.deepcopy(self.data); row=next(x for x in d['pole_weak_current']['momentum_records']if x['cosine']=='1'and x['sine']=='0');row['neutron_source_pole_GeV_interval'][0]='0'
  with self.assertRaises(AssertionError):project(d)
if __name__=='__main__':unittest.main()
