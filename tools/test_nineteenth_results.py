"""Protect native record identities, outward bounds and physical nonclaims."""
import copy,json,os,unittest
from pathlib import Path
from fractions import Fraction
from nineteenth_results import NAMES,project
R=Path(os.environ.get('OPH_RER',Path(__file__).resolve().parents[2]/'reverse-engineering-reality'))
class NativeExecutionTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.data={n:json.loads((R/'model'/('openwave_'+n)/'results.json').read_text())for n in NAMES}
 def test_record_assay_is_not_pair_density_with_collisions(self):
  p=project(self.data);self.assertEqual([x['record_difference']for x in p['interaction']['rows']],['1/4','3/64']);self.assertEqual([x['pair_difference']for x in p['interaction']['rows']],['1/4','9/64'])
  d=copy.deepcopy(self.data);d['native_interaction']['two_recording_block_results'][1]['operational_zero_imbalance_difference_exact']='9/64'
  with self.assertRaises(AssertionError):project(d)
 def test_complete_outward_native_arrival_intervals(self):
  p=project(self.data);records=[t for x in self.data['native_packet_propagation']['packets']for t in x['times']]
  for shown,exact in zip(p['packet']['records'],records,strict=True):
   for key,source in [('arrival','first_current_record_arrival_distance_four_interval_exact'),('distance','mean_graph_distance_interval_exact')]:
    self.assertLessEqual(Fraction(shown[key][0]),Fraction(exact[source][0]));self.assertGreaterEqual(Fraction(shown[key][1]),Fraction(exact[source][1]))
  self.assertEqual(max(x['attempts']for x in p['packet']['records']),80640);self.assertEqual(p['packet']['local_powers'],128)
 def test_source_clock_and_coherent_service_are_not_promoted(self):
  for n,path in [('native_event_clock',('scope','physical_mass_phase_or_GeV_assignment')),('native_response',('scope','continuum_dispersion_or_physical_particle_identification')),('native_packet_propagation',('physics','persistent_coherent_moving_packet')),('native_geometry_readout',('coherent_extension','native_repair_alone_implements_coherent_service')),('native_geometry_readout',('geometry_join','Einstein_continuum_proved')),('native_capacity_history',('normalization_symmetries','H0_or_Lambda_or_primordial_amplitude_selected'))]:
   d=copy.deepcopy(self.data);x=d[n]
   for k in path[:-1]:x=x[k]
   x[path[-1]]=True
   with self.assertRaises(AssertionError):project(d)
 def test_author_execution_does_not_award_rows(self):
  p=project(self.data);self.assertEqual(p['platform']['official_untested'],31);self.assertEqual(p['new_GeV_rest_masses'],[])
  d=copy.deepcopy(self.data);d['native_platform_gate']['scope']['new_official_awards']=1
  with self.assertRaises(AssertionError):project(d)
if __name__=='__main__':unittest.main()
