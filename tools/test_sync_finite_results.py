import hashlib
import copy
import math
import json
import re
from html.parser import HTMLParser
from pathlib import Path
import tempfile
import unittest

from sync_finite_results import RER, SOURCES, EXTRA, load_receipt, projection, sync, calibrated_quark_projection, defect_projection, yukawa_projection, joined_projection, extended_mass_projection


class FiniteProjectionTests(unittest.TestCase):
    def test_source_bindings_reject_stale_failed_and_escaping_receipts(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            package = root/'model/sample'
            package.mkdir(parents=True)
            source = package/'source.py'; source.write_text('source = 1\n')
            receipt = package/'results.json'
            value = {'checks': {'complete': True}, 'input_sha256': {'source.py': hashlib.sha256(source.read_bytes()).hexdigest()}}
            receipt.write_text(json.dumps(value))
            self.assertEqual(load_receipt(receipt,root),value)
            source.write_text('source = 2\n')
            with self.assertRaisesRegex(ValueError,'stale source'):
                load_receipt(receipt,root)
            value['checks']['complete'] = False; receipt.write_text(json.dumps(value))
            with self.assertRaisesRegex(ValueError,'nonpassing'):
                load_receipt(receipt,root)
            value['checks']['complete'] = True; value['input_sha256'] = {'../../../outside':'0'*64}
            receipt.write_text(json.dumps(value))
            with self.assertRaisesRegex(ValueError,'escapes'):
                load_receipt(receipt,root)

    def test_current_receipts_project_idempotently_and_detect_changed_output(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root/'links.js').write_text('export const PAPERS = [\n];\n')
            paths = sync(root)
            before = {p:(root/p).read_bytes() for p in paths}
            self.assertEqual(sync(root),paths)
            self.assertEqual(sync(root,check=True),paths)
            self.assertEqual(before,{p:(root/p).read_bytes() for p in paths})
            summary = json.loads((root/'finite/results.json').read_text())
            self.assertEqual(len(summary['sources']),50)
            self.assertEqual(len(summary['yukawa']['rows']),4)
            self.assertFalse(summary['defect_response']['physical_Yukawa_prediction'])
            self.assertTrue(all(abs(r['p0']+r['p1']+r['p2']+r['p3']-1)<1e-12 for r in summary['epochs']['rows']))
            (root/'finite/lepton.json').write_text('{}')
            with self.assertRaisesRegex(ValueError,'stale finite-result'):
                sync(root,check=True)

    def test_root_dependency_manifest_and_vertex_binding_key(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);package=root/'model/sample';package.mkdir(parents=True)
            manifest=root/'requirements.txt';manifest.write_text('numpy\n')
            receipt=package/'results.json'
            value={'source_files_sha256':{'requirements.txt':hashlib.sha256(manifest.read_bytes()).hexdigest()}}
            receipt.write_text(json.dumps(value))
            self.assertEqual(load_receipt(receipt,root),value)
            manifest.write_text('numpy\nscipy\n')
            with self.assertRaisesRegex(ValueError,'stale source'):
                load_receipt(receipt,root)

    def test_population_mutation_cannot_be_displayed_as_normalized(self):
        receipts = {key:load_receipt(RER/'model'/relative,RER) for key,(relative,_) in SOURCES.items()}
        receipts['epochs']['trajectory'][0]['class_shares'][0]['value'] = 2
        with self.assertRaisesRegex(ValueError,'not normalized'):
            projection(receipts,[])

    def test_comparison_guards_reject_unjustified_physical_inference(self):
        import copy
        receipts = {key:load_receipt(RER/'model'/relative,RER) for key,(relative,_) in SOURCES.items()}
        for key, path, bad in [('lepton_comparison', ('uncertainty_contract','joint_chi_squared'), 0),
                               ('species', ('physical_species_claim',), True),
                               ('crossover_budget', ('rows','declared','confidence_coverage_certified'), True)]:
            changed=copy.deepcopy(receipts); target=changed[key]
            for field in path[:-1]: target=target[field]
            target[path[-1]]=bad
            with self.assertRaises(ValueError): projection(changed,[])


    def test_calibrated_quark_table_preserves_input_role_and_common_scale(self):
        receipt=load_receipt(RER/'model/common_source/calibrated_matter_results.json',RER)
        table=calibrated_quark_projection(receipt)
        self.assertEqual([row['label'] for row in table['rows']],['Up','Down','Strange','Charm','Bottom','Top'])
        self.assertEqual(table['scale_GeV'],91.1876)
        self.assertEqual(table['native_predictions'],0)
        self.assertFalse(table['joint_uncertainty_available'])
        self.assertTrue(all(row['uncertainty_GeV'] is None and row['native_prediction'] is False for row in table['rows']))
        values={row['label']:row['value_GeV'] for row in table['rows']}
        self.assertTrue(math.isclose(values['Up'],.0012359411566124987,rel_tol=1e-14))
        self.assertTrue(math.isclose(values['Top'],169.88959799289776,rel_tol=1e-14))
        self.assertIn('require matching before comparison',table['scope'])
        self.assertIn('fitted inputs',table['finding'])

    def test_calibration_cannot_be_promoted_to_native_predictions_or_poles(self):
        receipt=load_receipt(RER/'model/common_source/calibrated_matter_results.json',RER)
        mutations=[
            (('calibration','role'),'prediction'),
            (('calibration','common_scale','reference_MZ_GeV'),'2'),
            (('calibration','common_scale','scheme'),'pole masses'),
            (('calibration','calibration_contract','all_nine_Yukawas_CKM_and_v_are_empirical_inputs'),False),
            (('calibration','calibration_contract','matched_parameter_joint_uncertainty_not_propagated'),False),
            (('calibration','calibration_contract','same_input_mass_recovery_is_held_out_validation'),True),
            (('scope','physical_parameters_derived_from_native_repair'),True),
            (('scope','quark_running_parameters_are_free_asymptotic_poles'),True),
            (('kinetic_contract','same_native_clock_or_reconstructed_spacetime_calibration_derived_here'),True)]
        for path,bad in mutations:
            changed=copy.deepcopy(receipt);target=changed
            for key in path[:-1]:target=target[key]
            target[path[-1]]=bad
            with self.subTest(path=path),self.assertRaises(ValueError):calibrated_quark_projection(changed)
        changed=copy.deepcopy(receipt);changed['running_mass_parameters_numeric_GeV']['up'][0]*=2
        with self.assertRaisesRegex(ValueError,'differs from the supplied Yukawa'):calibrated_quark_projection(changed)

    def test_embedded_calibration_must_equal_hash_bound_packet(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);package=root/'model/common_source';package.mkdir(parents=True)
            packet=package/'calibrated_matter_parameters.json';packet.write_text('{"role":"empirical"}')
            receipt=package/'calibrated_matter_results.json'
            value={'schema':'oph.calibrated_matter.v1','calibration':{'role':'empirical'},
                   'source_bindings':{'model/common_source/calibrated_matter_parameters.json':hashlib.sha256(packet.read_bytes()).hexdigest()}}
            receipt.write_text(json.dumps(value));self.assertEqual(load_receipt(receipt,root),value)
            value['calibration']['role']='native prediction';receipt.write_text(json.dumps(value))
            with self.assertRaisesRegex(ValueError,'bound empirical input'):load_receipt(receipt,root)

    def test_calibrated_table_cannot_change_existing_panels(self):
        receipts={key:load_receipt(RER/'model'/relative,RER) for key,(relative,_) in SOURCES.items()}
        before=projection(receipts,[])
        changed=copy.deepcopy(receipts);quarks=changed['calibrated_quarks']
        # A distinct, self-consistent calibration changes only its separate table.
        quarks['calibration']['matched_SM']['yukawa']['up'][0]=str(float(quarks['calibration']['matched_SM']['yukawa']['up'][0])*2)
        quarks['running_mass_parameters_numeric_GeV']['up'][0]*=2
        after=projection(changed,[])
        self.assertNotEqual(before.pop('calibrated_quarks'),after.pop('calibrated_quarks'))
        self.assertEqual(before,after)


    def test_defect_response_preserves_full_band_and_distinct_interventions(self):
        receipts={key:load_receipt(RER/'model'/relative,RER) for key,(relative,_) in SOURCES.items()}
        value=defect_projection(receipts)
        patch=value['overlap']['profiles']['positive_core_patch']
        self.assertEqual(len(patch['strengths']),4)
        self.assertAlmostEqual(patch['ratio'],16385,places=3)
        self.assertAlmostEqual(value['overlap']['profiles']['uniform']['ratio'],1,places=10)
        self.assertEqual(len(value['scalar']['rows']),5)
        self.assertEqual(value['vertex']['scalar_spectral_moment'],'14/5')
        self.assertEqual(value['vertex']['preparation_probability'],'1/160')
        self.assertIn('neither masses nor Yukawa',value['scalar']['scope'])
        self.assertIn('not three generations',value['overlap']['scope'])

    def test_four_coupling_receipts_keep_their_declared_domains(self):
        receipts={key:load_receipt(RER/'model'/relative,RER) for key,(relative,_) in SOURCES.items() if key.startswith('yukawa_')}
        value=yukawa_projection(receipts)
        self.assertEqual({row['key'] for row in value['rows']},{'operator','feedback','running','dynamics'})
        self.assertFalse(value['physical_Yukawa_spectrum_derived'])
        for name,path,bad in [
            ('operator',('physical_attachment','physical_charged_fermion_mass_prediction'),True),
            ('dynamics',('native_completion','exact_Schur_rank'),3),
            ('running',('status','source_selected_Higgs_coupling_scalar_energy_or_hopping'),True),
            ('feedback',('coherent_correction_operator',),'X tensor J')]:
            changed=copy.deepcopy(receipts);target=changed['yukawa_'+name]
            for field in path[:-1]:target=target[field]
            target[path[-1]]=bad
            with self.subTest(name=name),self.assertRaises(ValueError):yukawa_projection(changed)

    def test_defect_domains_reject_physical_or_incomplete_promotions(self):
        receipts={key:load_receipt(RER/'model'/relative,RER) for key,(relative,_) in SOURCES.items()}
        for name,path,bad in [
            ('overlap',('scope','selected_dynamical_scalar_mode'),True),
            ('overlap',('scope','physical_Yukawa_prediction'),True),
            ('overlap',('profiles','positive_core_patch','largest_to_smallest_ratio'),2),
            ('overlap',('profiles','uniform','singular_values'),[1,1,0.5,0.5]),
            ('scalar',('scope','scalar_cost_is_neutral_Higgs_field_amplitude'),True),
            ('scalar',('channels','uc','failure_probability'),'0'),
            ('vertex',('construction','supplied_family_matrix'),True),
            ('vertex',('vertex','normalized_unit_coefficient'),'1')]:
            changed=copy.deepcopy(receipts);target=changed['defect_'+name]
            for field in path[:-1]:target=target[field]
            target[path[-1]]=bad
            with self.subTest(name=name,path=path),self.assertRaises(ValueError):defect_projection(changed)

    def test_joined_receipts_preserve_scalar_modes_conditional_mass_map_and_all_species(self):
        receipts={key:load_receipt(RER/'model'/relative,RER) for key,(relative,_) in SOURCES.items()}
        value=joined_projection(receipts)
        self.assertEqual([row['display_GeV'] for row in value['conditional_leptons']],
                         ['0.00051099895069','0.1056594144959','1.7769849708134'])
        self.assertFalse(value['physical_mass_map_proved'])
        self.assertEqual(len(value['catalogue']['rows']),17)
        self.assertTrue(all(row['physical_source_rest_mass_GeV'] is None for row in value['catalogue']['rows']))
        self.assertEqual(len(value['backreaction']['modes']),343)
        self.assertAlmostEqual(value['selected_scalar']['ratio'],1.000122033061,places=10)
        self.assertEqual(value['native_vertices']['scalar_roots'],13)
        self.assertTrue(math.isclose(value['native_vertices']['branch_weight']*4+value['native_vertices']['no_operation_probability'],1))
        self.assertEqual(len(value['dispersion']['cases']),4)
        self.assertTrue(all(len(case['rows'])==7 for case in value['dispersion']['cases']))

    def test_joined_domains_reject_missing_outcomes_or_mass_promotions(self):
        receipts={key:load_receipt(RER/'model'/relative,RER) for key,(relative,_) in SOURCES.items()}
        mutations=[
            ('scalar_modes',('complete_scalar_modes_count',),2),
            ('scalar_modes',('native_filled_sea_first_image','complete_pointer','success_probability'),1),
            ('scalar_modes',('scope','full_interacting_ground_reconstructed'),True),
            ('mass_join',('scope','complete_spatial_interacting_ground_and_poles_executed'),True),
            ('family_vertices',('construction','three_family_source_constructed'),True),
            ('dispersion',('scope','relativistic_mass_assignment_established'),True),
            ('mass_catalogue',('conditional_electron_anchored_leptons',0,'source_to_relativistic_rest_map_proved'),True),
            ('mass_catalogue',('target_catalogue',0,'physical_source_rest_mass_GeV'),.001),
            ('mass_catalogue',('target_catalogue',0,'native_source_prediction'),True),
            ('mass_catalogue',('single_clock_quark_test','one_scale_matches_both'),True)]
        for name,path,bad in mutations:
            changed=copy.deepcopy(receipts);target=changed[name]
            for key in path[:-1]:target=target[key]
            target[path[-1]]=bad
            with self.subTest(name=name,path=path),self.assertRaises(ValueError):joined_projection(changed)
        changed=copy.deepcopy(receipts);changed['scalar_modes']['native_filled_sea_first_image']['complete_scalar_mode_records'].pop()
        with self.assertRaises(ValueError):joined_projection(changed)
        changed=copy.deepcopy(receipts);changed['dispersion']['cases'][0]['rows'][0]['complete_energies'].pop()
        with self.assertRaises(ValueError):joined_projection(changed)

    def test_added_sources_keep_complete_original_laws_and_scale_roles(self):
        receipts={key:load_receipt(RER/'model'/relative,RER) for key,(relative,_) in SOURCES.items()}
        data=extended_mass_projection(receipts)
        self.assertEqual([r['display_GeV'] for r in data['compiler']['rows']],['0.00051099895069','0.1056594144959','1.7769849708134'])
        self.assertEqual(len(data['compiler']['records']),36)
        self.assertEqual(sum(r['probability']==0 for r in data['compiler']['records']),30)
        self.assertEqual(len(data['quadratic']['targets']),17)
        self.assertEqual([len(r['records']) for r in data['quadratic']['readouts']],[84,375,96])
        self.assertEqual([len(c['probes'][0]['records']) for c in data['neutrinos']['controls']],[67,182])
        self.assertEqual(len(data['scalar_density']['records']),6)
        self.assertEqual(len(data['composites']['pion_rows']),3)
        self.assertEqual(len(data['composites']['rows']),6)
        self.assertTrue(all(not r['common_scale_matches'] for r in data['quarks']['mechanisms']))
        self.assertTrue(all(r['failure_probability']==.5 for r in data['quarks']['dressed']))

    def test_added_receipts_reject_physical_promotions_and_lost_records(self):
        receipts={key:load_receipt(RER/'model'/relative,RER) for key,(relative,_) in SOURCES.items()}
        changes=[('lepton_compiler',('scope','physical_Standard_Model_leptons_or_gauge_continuum_derived'),True),
            ('lepton_compiler',('same_source_kinetic_attachment','canonical_physical_Higgs_kinetic_residue_derived'),True),
            ('lepton_compiler',('electron_anchored_compiled_source','rows',1,'electron_anchored_GeV'),'2'),
            ('conditional_spectrum',('acceptance_flags','physical_target_acceptance'),True),
            ('conditional_spectrum',('fermion_readout','zero_outside_projector_retained_per_pointer'),False),
            ('neutrino_response',('scope','neutrino_rest_mass_or_Lorentz_limit_proved'),True),
            ('quark_resolution',('scope','one_scale_fixed_target_fit_obtained'),True),
            ('quark_dressing',('scope','physical_rest_mass_or_GeV_output'),True),
            ('scalar_density',('scope','observed_Higgs_identification'),True),
            ('pion',('particles',0,'physical_source_derived_mass_GeV'),.14)]
        for name,path,bad in changes:
            changed=copy.deepcopy(receipts);target=changed[name]
            for key in path[:-1]:target=target[key]
            target[path[-1]]=bad
            with self.subTest(name=name,path=path),self.assertRaises(ValueError):extended_mass_projection(changed)
        for name,path in [('lepton_compiler',('exact_limiting_rest_mass_instrument','complete_records')),
                          ('scalar_density',('complete_occupation_energy_records',)),
                          ('conditional_spectrum',('boson_readout','records'))]:
            changed=copy.deepcopy(receipts);target=changed[name]
            for key in path:target=target[key]
            target.pop()
            with self.subTest(name=name),self.assertRaises(ValueError):extended_mass_projection(changed)

    def test_every_page_mount_target_exists_once(self):
        class Elements(HTMLParser):
            def __init__(self): super().__init__();self.ids=[]
            def handle_starttag(self,tag,attrs):
                self.ids.extend(value for key,value in attrs if key=='id')
        parsed=Elements();parsed.feed((EXTRA/'finite_results.html').read_text())
        self.assertEqual(len(parsed.ids),len(set(parsed.ids)))
        targets=set(re.findall(r"\$\('([^']+)'\)",(EXTRA/'finite_results.mjs').read_text()))
        self.assertFalse(targets-set(parsed.ids),targets-set(parsed.ids))
        self.assertTrue({'overlap-profile','vertex-contact','scalar-table','yukawa-cards'}<=targets)


if __name__ == '__main__':
    unittest.main()
