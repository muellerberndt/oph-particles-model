"""The reference-scope projection preserves every computed value and rejects unknown anchors."""
from pathlib import Path
import subprocess
import tempfile
import unittest

from sync_particle_reference import ROOT, REFERENCE_REWRITES, qualify_lepton_comparison


class LeptonReferenceScopeTests(unittest.TestCase):
    def test_source_and_projected_output_are_idempotent(self):
        source=(ROOT/'site/lepton_round.js').read_text()
        updated=qualify_lepton_comparison(source)
        self.assertEqual(qualify_lepton_comparison(updated),updated)
        for old,new in REFERENCE_REWRITES:
            self.assertNotIn(old,updated)
            self.assertEqual(updated.count(new),1)

    def test_each_missing_or_duplicated_anchor_is_rejected(self):
        source=(ROOT/'site/lepton_round.js').read_text()
        for old,new in REFERENCE_REWRITES:
            anchor=old if old in source else new
            for changed in (source.replace(anchor,''),source+anchor):
                with self.assertRaises(ValueError):qualify_lepton_comparison(changed)

    def test_computed_values_and_empirical_inputs_are_unchanged(self):
        source=(ROOT/'site/lepton_round.js').read_text()
        with tempfile.TemporaryDirectory() as temp:
            directory=Path(temp)
            (directory/'before.mjs').write_text(source)
            (directory/'after.mjs').write_text(qualify_lepton_comparison(source))
            script="""
import assert from 'node:assert/strict';
import * as before from './before.mjs';
import * as after from './after.mjs';
assert.deepEqual(before.MEASURED,after.MEASURED);
const withoutHow = rows => rows.map(({how,...row})=>row);
assert.deepEqual(withoutHow(before.comparison()),withoutHow(after.comparison()));
for (const row of after.comparison().filter(x=>['tauE','tauMu'].includes(x.id))) {
 assert.match(row.how,/Independence-control uncertainty/);
 assert.match(row.how,/No physical theory uncertainty/);
}
"""
            subprocess.run(['node','--input-type=module','-e',script],cwd=directory,check=True,capture_output=True,text=True)


if __name__=='__main__':unittest.main()
