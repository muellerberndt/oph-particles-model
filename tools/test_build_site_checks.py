"""Published checker routes resolve to the fixtures shipped in the site."""
import tempfile
import unittest
from pathlib import Path

from build_site import ROOT, SIM, copy_check_fixtures, rewrite_source
from sync_particle_reference import MAP_SOURCE, metadata


class PublishedCheckTests(unittest.TestCase):
    def test_relative_research_routes_follow_the_static_bundle(self):
        source = "new URL('./research/PD/decoder.json', import.meta.url); load('research/HAD/hadrons.json');"
        converted = rewrite_source(source, 'decoder_check.mjs')
        self.assertIn("'./rl/PD/decoder.json'", converted)
        self.assertIn("'rl/HAD/hadrons.json'", converted)
        self.assertNotIn('research/', converted)

    def test_required_fixtures_keep_their_original_bytes(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            copy_check_fixtures(SIM / 'oph_defects/viewer2', out)
            self.assertEqual((out / 'fixtures/lepton_readout.json').read_bytes(),
                             (ROOT / 'derivations/work/LEPTON_READOUT/lepton_readout.json').read_bytes())
            self.assertEqual((out / 'references/cosmology_postdiction_ledger.json').read_bytes(),
                             (SIM / 'oph_defects/references/cosmology_postdiction_ledger.json').read_bytes())

    def test_mandatory_lepton_fixture_does_not_require_a_private_path(self):
        source = "readFileSync('/Users/muellerberndt/Projects/oph-meta/repair-law/work/LEPTON_READOUT/lepton_readout.json')"
        converted = rewrite_source(source, 'lepton_readout_check.mjs')
        self.assertNotIn('/Users/', converted)
        self.assertIn("new URL('./fixtures/lepton_readout.json', import.meta.url)", converted)

    def test_lepton_certificate_requires_all_executed_checks(self):
        source = "Object.keys(R.checks).length === 80; '80 checks';"
        converted = rewrite_source(source, 'lepton_round_check.mjs')
        self.assertIn('length === 99', converted)
        self.assertIn('Object.values(R.checks).every(v => v === true)', converted)
        self.assertIn('99 checks', converted)
        self.assertEqual(rewrite_source(source, 'unrelated_check.mjs'), source)

    def test_number_conservation_is_not_promoted_to_particle_identity(self):
        source = 'Every operation of the source conserves it. Neutrinos are Dirac.'
        converted = rewrite_source(source, 'equations_data.js')
        self.assertIn('declared operations', converted)
        self.assertIn('physical neutrino identity requires a separate attachment', converted)

    def test_scientific_text_overlay_matches_the_source_viewer(self):
        for name, old in (
            ('classes.js', 'B − L is exact, so neutrinos are Dirac.'),
            ('equations_data.js', 'Every operation of the source conserves it. Neutrinos are Dirac.'),
            ('results_data.js', 'Exact B − L: neutrinos are Dirac.'),
            ('spectrum.js', 'Neutrinos are Dirac as the source stands, with no mass derived (NM).'),
            ('help/timeline.js', 'Neutrinos are Dirac by exact B − L; their masses are open.'),
            ('help/decoder.js', 'Derived consequence: neutrinos are Dirac.'),
        ):
            with self.subTest(source=name):
                source = (SIM / 'oph_defects/viewer2' / name).read_text()
                self.assertIn(old, source)
                self.assertNotIn(old, rewrite_source(source, Path(name).name))

    def test_reference_binding_rejects_even_a_whitespace_mutation(self):
        raw = MAP_SOURCE.read_bytes()
        self.assertEqual(metadata(raw)['rows'], 69)
        with self.assertRaises(ValueError):
            metadata(raw + b' ')


if __name__ == '__main__':
    unittest.main()
