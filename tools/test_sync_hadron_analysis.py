"""Mutation checks of the public projection of the theory's hadron analysis."""
import copy
import json
import unittest

from sync_hadron_analysis import DEFAULT_RECEIPT, ROOT, RATIOS, project, sync


class HadronProjectionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.viewer = json.loads((ROOT / 'site/rl/HAD/hadrons.json').read_text())
        cls.receipt = json.loads(DEFAULT_RECEIPT.read_text())

    def test_every_ratio_inherits_the_full_uncertainty(self):
        changed = copy.deepcopy(self.receipt)
        for key in RATIOS.values():
            changed['headline'][key]['syst'] = 0.25
            changed['headline'][key]['err'] = 0.3
        value = project(self.viewer, changed, 'test')
        self.assertTrue(all(r['err_syst'] == 0.25 and r['err'] == 0.3 for r in value['ratios']))

    def test_failed_check_or_different_ensemble_is_rejected(self):
        for mutate in (lambda r: r['checks'].update(broken=False),
                       lambda r: r['headline'].update(lattice=[8, 8, 8, 16]),
                       lambda r: r['headline'].update(configurations=1)):
            with self.subTest(mutation=mutate):
                changed = copy.deepcopy(self.receipt)
                mutate(changed)
                with self.assertRaises(ValueError):
                    project(self.viewer, changed, 'test')

    def test_published_projection_matches_theory_receipt(self):
        sync(ROOT / 'site', check=True)


if __name__ == '__main__':
    unittest.main()
