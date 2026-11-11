"""Thermal projection preserves measured inputs and rejects stale receipts or missing scope anchors."""
import copy
import json
from pathlib import Path
import shutil
import subprocess
import hashlib
import tempfile
import unittest

from sync_thermal_scope import (ROOT, DEFAULT_RECEIPT, CHANGED_PATHS, HEADLINE_FIELDS,
                                REWRITES, load_receipt, project, rewrite, sync, remove_complete_lift_progress)

SIM = ROOT.parent / 'oph-physics-sim/oph_defects/viewer2'


class ThermalScopeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.receipt, cls.digest = load_receipt()
        cls.viewer = json.loads((ROOT/'site/rl/EW/ew_transition.json').read_text())

    def prepare(self, temporary):
        target=Path(temporary)
        (target/'rl/EW').mkdir(parents=True)
        (target/'rl/EW/ew_transition.json').write_text(json.dumps(self.viewer))
        for name in REWRITES:
            shutil.copyfile(SIM/name,target/name)
        return target

    def test_central_value_ranges_and_control_are_source_bound(self):
        out=project(self.viewer,self.receipt,self.digest)
        for key in HEADLINE_FIELDS:
            if key not in ('T_c_err', 'T_c_err_lattice'):
                self.assertEqual(out['oph'][key],self.viewer['oph'][key])
        self.assertIsNone(out['oph']['T_c_err'])
        self.assertIsNone(out['oph']['T_c_err_lattice'])
        self.assertEqual(out['oph']['retained_headline']['T_c_err_lattice'],.13)
        self.assertEqual(out['oph']['T_c_err_lattice_range'],self.receipt['rows']['declared']['T_c_err_lattice_range'])
        self.assertEqual(out['comparison_budget'],self.receipt['comparison_budget'])
        for variant in out['oph']['variants']:
            self.assertIsNone(variant['T_c_err'])
            self.assertIsNone(variant['T_c_err_lattice'])
            self.assertEqual(variant['T_c_err_lattice_range'],self.receipt['rows'][variant['id']]['T_c_err_lattice_range'])
        self.assertIn('[0.118, 0.137]',out['oph']['scope_note'])
        self.assertIn('[0.000, 0.276]',out['oph']['scope_note'])
        self.assertEqual(out['finite_size_cutoff'],self.receipt['finite_size_cutoff'])
        self.assertEqual(out['analysis_source']['sha256'],self.digest)
        self.assertIn('0.349 GeV',out['oph']['scope_note'])
        self.assertIn('no native clock transfer',out['oph']['clock_scope'])
        self.assertEqual(project(out,self.receipt,self.digest),out)

    def test_all_actual_source_anchors_are_replaced_once_idempotently(self):
        for name, replacements in REWRITES.items():
            source=(SIM/name).read_text();updated=rewrite(source,name)
            for old,new in replacements:
                self.assertEqual(source.count(old),1,name)
                self.assertNotIn(old,updated)
                self.assertEqual(updated.count(new),1)
            self.assertEqual(rewrite(updated,name),updated)

    def test_missing_or_duplicated_required_anchors_fail_closed(self):
        for name,replacements in REWRITES.items():
            source=(SIM/name).read_text()
            for anchor,_ in replacements:
                for mutation in (source.replace(anchor,''),source+anchor):
                    with self.assertRaises(ValueError):rewrite(mutation,name)

    def test_fail_closed_before_any_file_write(self):
        with tempfile.TemporaryDirectory() as temp:
            target=self.prepare(temp)
            (target/'cosmos.js').write_text('missing all expected anchors')
            before={path:(target/path).read_bytes() for path in CHANGED_PATHS}
            with self.assertRaises(ValueError):sync(target)
            self.assertEqual(before,{path:(target/path).read_bytes() for path in CHANGED_PATHS})

    def test_projection_is_byte_idempotent(self):
        with tempfile.TemporaryDirectory() as temp:
            target=self.prepare(temp);sync(target)
            before={path:(target/path).read_bytes() for path in CHANGED_PATHS}
            sync(target)
            self.assertEqual(before,{path:(target/path).read_bytes() for path in CHANGED_PATHS})

    def test_modified_retained_headline_and_failed_receipt_are_rejected(self):
        bad=copy.deepcopy(self.viewer);bad['oph']['T_c_GeV']+=1
        with self.assertRaises(ValueError):project(bad,self.receipt,self.digest)
        with tempfile.TemporaryDirectory() as temp:
            path=Path(temp)/'results.json';bad=copy.deepcopy(self.receipt);bad['checks']['mutation']=False
            path.write_text(json.dumps(bad))
            with self.assertRaises(ValueError):load_receipt(path)

    def test_completed_integer_lift_does_not_fetch_missing_progress(self):
        for prefix in ('rl/', '/rl/', './rl/'):
            source = "export const FILES = {\n  il: '" + prefix + "IL/il_census.json', ilp: '" + prefix + "IL/progress.json',\n};"
            fixed = remove_complete_lift_progress(source)
            self.assertNotIn('IL/progress.json', fixed)
            self.assertIn('IL/il_census.json', fixed)
            self.assertEqual(remove_complete_lift_progress(fixed), fixed)
        with self.assertRaises(ValueError):
            remove_complete_lift_progress("export const FILES = {\n ilp: 'elsewhere.json',\n};")

    def test_source_binding_mutation_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            directory=Path(temp)
            self.copy_receipt(directory)
            (directory/'finite_size.py').write_text('changed scientific source')
            with self.assertRaises(ValueError):load_receipt(directory/'results.json')


    def copy_receipt(self, directory):
        for name in list(self.receipt['input_sha256']) + ['results.json', 'comparison_budget.json']:
            destination = directory/name
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(DEFAULT_RECEIPT.parent/name,destination)

    def test_nested_bindings_replay_and_traversal_absolute_symlinks_fail(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp); directory=root/'owner'; directory.mkdir()
            self.copy_receipt(directory)
            self.assertEqual(load_receipt(directory/'results.json')[1],self.digest)
            outside=root/'outside.py';outside.write_text('outside')
            (directory/'escape.py').symlink_to(outside)
            for key in ('../outside.py',str(outside),'escape.py'):
                bad=copy.deepcopy(self.receipt)
                bad['input_sha256'][key]=hashlib.sha256(outside.read_bytes()).hexdigest()
                (directory/'results.json').write_text(json.dumps(bad))
                with self.assertRaisesRegex(ValueError,'invalid source binding'):
                    load_receipt(directory/'results.json')

    def test_mismatched_standalone_covariance_budget_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            directory=Path(temp);self.copy_receipt(directory)
            budget=copy.deepcopy(self.receipt['comparison_budget'])
            budget['rows']['declared']['T_c_GeV']+=1
            (directory/'comparison_budget.json').write_text(json.dumps(budget))
            with self.assertRaisesRegex(ValueError,'covariance budget'):
                load_receipt(directory/'results.json')

    def test_published_finite_size_overlay_migrates_without_losing_control(self):
        old=copy.deepcopy(self.viewer);o=old['oph']
        o['retained_headline']={key:o[key] for key in HEADLINE_FIELDS}
        o['scope_note']=("The retained 161.13 GeV headline has statistical error 0.13 GeV "
            "within the declared joint cutoff/size fit and reduction estimate 1.6 GeV. "
            "A separate matched-volume cutoff comparison has 0.349 GeV finite-design sensitivity. "
            "These estimates do not bound omitted cutoff powers or the infinite-volume limit.")
        old['statements'][0]['text']=o['scope_note']
        out=project(old,self.receipt,self.digest)
        self.assertEqual(out['oph']['retained_headline'],o['retained_headline'])
        self.assertIsNone(out['oph']['T_c_err_lattice'])
        self.assertEqual(project(out,self.receipt,self.digest),out)
        out['oph']['T_c_err']=0
        with self.assertRaises(ValueError):project(out,self.receipt,self.digest)

    def test_projected_javascript_preserves_unknown_error_and_no_significance(self):
        with tempfile.TemporaryDirectory() as temp:
            directory=self.prepare(temp);sync(directory)
            (directory/'results_data.mjs').write_bytes((directory/'results_data.js').read_bytes())
            script = """
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as D from './results_data.mjs';
const ew = JSON.parse(fs.readFileSync('rl/EW/ew_transition.json','utf8'));
const value=D.electroweak(ew);
assert.equal(value.err,null);
assert.deepEqual(value.statisticalRange,ew.oph.T_c_err_lattice_range);
assert.equal(D.electroweak({oph:{T_c_GeV:161.13}}).err,null);
const row=D.board({ew}).groups.find(g=>g.id==='lattice').rows.find(r=>r.id==='ew');
assert.equal(row.sModel,null);
assert.equal(row.cmp.sigma,null);
assert.equal(row.cmp.relSigma,null);
assert.equal(row.cmp.abs,161.13-159.5);
assert.match(row.text,/linearized statistical SD/);
assert.match(row.what,/linearized statistical SD/);
assert.match(row.what,/0[.]118, 0[.]137/);
assert.ok(!Object.values(D.FILES).includes('rl/IL/progress.json'));
"""
            subprocess.run(['node','--input-type=module','-e',script],cwd=directory,check=True,capture_output=True,text=True)


if __name__=='__main__':unittest.main()
