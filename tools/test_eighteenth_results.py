"""Reject silent physics promotion and preserve exact outward source intervals."""
import copy,json,os,unittest,tempfile
from unittest.mock import patch
from types import SimpleNamespace
from fractions import Fraction
from pathlib import Path
from eighteenth_results import NAMES,project
R=Path(os.environ.get('OPH_RER',Path(__file__).resolve().parents[2]/'reverse-engineering-reality'))
class BoundedSourceProjectionTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.data={n:json.loads((R/'model'/('openwave_'+n)/'results.json').read_text())for n in NAMES}
 def test_outward_bounds_and_observable_identity(self):
  p=project(self.data)
  pairs=[(x['probability'],y['selected_conditional_window_interval'])for x,y in zip(p['lambda']['windows'],self.data['lambda_narrow_weight']['windows'])]
  pairs +=[(x['GeV'],y['full_ground_GeV_interval'])for x,y in zip(p['nuclear'],self.data['nuclear_field_attraction']['complete_ground_bounds'])]
  pairs +=[(p['matter']['charged_architecture_shift_GeV'],self.data['matter_flux_source']['rest_operator_comparison']['common_charged_one_lepton_gap_offset_GeV_exact'])]
  for x,y in zip(p['capacity']['records'],self.data['capacity_finite_wavelength']['fine']['finite_wavelength_records']):pairs.extend([(x['metric'],y['metric_transfer_interval']),(x['comoving_dust'],y['comoving_dust_interval'])])
  for shown,exact in pairs:self.assertLessEqual(Fraction(shown[0]),Fraction(exact[0]));self.assertGreaterEqual(Fraction(shown[1]),Fraction(exact[1]))
  self.assertEqual(p['clock']['carrier'],32768);self.assertEqual(p['clock']['cycles'],2);self.assertFalse(p['clock']['new_GeV_rest_masses'])
  pairs_clock=[(a['frequency'],b['two_free_flight_certificates'][1]['certified_actual_phase_frequency_interval_exact'])for a,b in zip(p['clock']['second_flight'],self.data['repeated_native_clock']['static_controller']['complete_native_mass_and_changed_strength_controls'])]
  for shown,exact in pairs_clock:self.assertLessEqual(Fraction(shown[0]),Fraction(exact[0]));self.assertGreaterEqual(Fraction(shown[1]),Fraction(exact[1]))
  self.assertEqual(p['matter']['CAR_modes'],192);self.assertEqual(p['matter']['source_terms'],114)
  self.assertEqual(p['stress']['prepared_copies'],3239348495);self.assertEqual(p['covariance']['count_pairs'],65307)
  self.assertFalse(p['matter']['physical_mass_fit']);self.assertFalse(p['capacity']['CMB_match'])
 def test_native_physical_and_calibration_promotions_fail(self):
  paths=[('repeated_native_clock',('scope','static_controller_exact_strength_independent_frequency')),('lambda_narrow_weight',('on_shell_density_or_outgoing_wave_operator_proved',)),('quark_string_transport',('physical_quark_pole_or_GeV_rest_mass_proved',)),('nuclear_field_attraction',('necessary_alpha_strength','bound_used_to_choose_source_coefficient')),('matter_flux_source',('scope','native_process_compilation_proved')),('matter_flux_source',('optional_charged_counterterm','unchanged_current_Ward_work_or_many_body_decay_transferred')),('stress_curvature_instruments',('tensor_transfer','Einstein_equation_enforced_by_acquisition')),('geometry_covariance_protocol',('scope','physical_Newton_strength_independently_validated')),('capacity_finite_wavelength',('scope','late_preparation_is_early_primordial_solution'))]
  for name,path in paths:
   d=copy.deepcopy(self.data);x=d[name]
   for k in path[:-1]:x=x[k]
   x[path[-1]]=True
   with self.assertRaises(AssertionError):project(d)
 def test_nuclear_failures_and_official_untested_gate(self):
  d=copy.deepcopy(self.data);next(x for x in d['nuclear_field_attraction']['complete_ground_bounds']if x['name']=='alpha')['target_in_certified_interval']=True
  with self.assertRaises(AssertionError):project(d)
  for kind in ('validated','partial'):
   d=copy.deepcopy(self.data);d['m10_review_gate']['official_status']['upstream_counts']['M10'][kind]=1
   with self.assertRaises(AssertionError):project(d)
  d=copy.deepcopy(self.data);d['m10_review_gate']['upstream_certification']['criterion_cells_awarded']=1
  with self.assertRaises(AssertionError):project(d)
 def test_status_export_rejects_any_positive_scenario(self):
  from sync_openwave_status import build
  a={'evaluated_RER_commit':'a'*40,'upstream_commit':'b'*40,'native_process_gate':'unestablished',
    'live_upstream_check':{'M10_admitted':True,'official_cells':{'untested':31,'validated':0,'partial':0,'negative':0,'scored':0},'official_rank':7},
    'rows':[{'id':i,'criterion':str(i),'evidence':[],'estimates':{s:'untested'for s in ('central','conservative','permissive')},'reason':'source','next_validation_test':'native transfer'}for i in range(1,32)]}
  with tempfile.TemporaryDirectory()as tmp,patch('sync_openwave_status.subprocess.run',return_value=SimpleNamespace(stdout='')):
   p=Path(tmp)/'assessment.json';p.write_text(json.dumps(a));self.assertIn('"official_model": "M10"',build(p,R))
   for scenario in ('central','conservative','permissive'):
    bad=copy.deepcopy(a);bad['rows'][0]['estimates'][scenario]='validated';p.write_text(json.dumps(bad))
    with self.assertRaises(ValueError):build(p,R)
if __name__=='__main__':unittest.main()
