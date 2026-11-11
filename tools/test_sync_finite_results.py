import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from sync_finite_results import RER, SOURCES, load_receipt, projection, sync


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
            self.assertEqual(len(summary['sources']),6)
            self.assertTrue(all(abs(r['p0']+r['p1']+r['p2']+r['p3']-1)<1e-12 for r in summary['epochs']['rows']))
            (root/'finite/lepton.json').write_text('{}')
            with self.assertRaisesRegex(ValueError,'stale finite-result'):
                sync(root,check=True)

    def test_population_mutation_cannot_be_displayed_as_normalized(self):
        receipts = {key:load_receipt(RER/'model'/relative,RER) for key,(relative,_) in SOURCES.items()}
        receipts['epochs']['trajectory'][0]['class_shares'][0]['value'] = 2
        with self.assertRaisesRegex(ValueError,'not normalized'):
            projection(receipts,[])


if __name__ == '__main__':
    unittest.main()
