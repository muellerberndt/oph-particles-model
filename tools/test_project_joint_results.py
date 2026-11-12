import copy
import unittest

from project_joint_results import SOURCES,project
from sync_finite_results import RER,load_receipt


class JointProjectionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.receipts={key:load_receipt(RER/'model'/path,RER) for key,(path,_) in SOURCES.items()}

    def test_complete_joint_and_service_laws(self):
        value=project(self.receipts)
        self.assertEqual(len(value['joint']['groups']),112)
        self.assertEqual(len(value['joint']['records']),570)
        self.assertEqual(len(value['joint']['targets']),17)
        self.assertAlmostEqual(sum(r['probability'] for r in value['joint']['records']),1)
        self.assertEqual([len(r['records']) for r in value['compiler']['cycles']],[4,16,64])
        self.assertEqual(value['compiler']['total_modes'],102)
        self.assertEqual(len(value['thermal']['rows']),14)

    def test_lost_records_or_physical_promotions_rejected(self):
        for key,path,bad in [
            ('joint_identity',('scope','calibrated_masses_are_independent_predictions'),True),
            ('compiler_compression',('scope','any_outcomes_or_archives_discarded'),True),
            ('service_compiler',('scope','autonomous_reset_or_hardware_pulse_precision_derived'),True),
            ('thermal_history',('physical_admission','physical_abundances_or_freezeout_predicted'),True),
            ('thermal_completion',('scope','unchanged_native_repair_claimed_thermal'),True),
            ('flavour_identity',('scope','source_selects_all_flavour_parameters'),True)]:
            changed=copy.deepcopy(self.receipts);target=changed[key]
            for name in path[:-1]:target=target[name]
            target[path[-1]]=bad
            with self.subTest(key=key),self.assertRaises(ValueError):project(changed)
        changed=copy.deepcopy(self.receipts)
        changed['joint_identity']['complete_calibrated_joint_instrument']['complete_records'].pop()
        with self.assertRaises(ValueError):project(changed)


if __name__=='__main__':unittest.main()
