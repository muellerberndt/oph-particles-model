"""Bind the published reference adapter to the inspected version-two obstruction map.

The map's rows and empirical annotations remain input records. The reference adapter supplies its own shared
comparison catalogue without changing model predictions or source statuses. Unknown map bytes require review.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAP_SOURCE = ROOT / 'derivations/work/OM/obstruction_map.json'
MAP_SHA256 = '8b3a10f47155bf6edbe842876bf9311fc6db6705c68cc00bd6388707e154f135'
RETAINED = re.compile(r'export const RETAINED_OM = freeze\(\{.*?\}\);', re.S)


REFERENCE_REWRITES = tuple(
    (f'Ratio of the tau rate to the {lepton} rate against the PDG 2024 tau mass over the CODATA 2022 {lepton} mass, uncertainties combined.',
     f'Ratio of the tau rate to the {lepton} rate against the PDG 2024 tau mass over the CODATA 2022 {lepton} mass. Independence-control uncertainty; covariance bounds for tau/e are supplied in the fixed comparison. No physical theory uncertainty is assigned.')
    for lepton in ('electron', 'muon'))


def qualify_lepton_comparison(source):
    """Keep numerical comparisons fixed and identify their uncertainty assumption."""
    for old, new in REFERENCE_REWRITES:
        counts = source.count(old), source.count(new)
        if counts == (1, 0):
            source = source.replace(old, new, 1)
        elif counts != (0, 1):
            raise ValueError('lepton reference uncertainty anchor missing or duplicated')
    return source


def metadata(raw):
    if hashlib.sha256(raw).hexdigest() != MAP_SHA256:
        raise ValueError('unreviewed obstruction-map bytes; preserve and inspect the input before binding it')
    value = json.loads(raw)
    if value['version'] != 2 or len(value['rows']) != 69 or len({r['id'] for r in value['rows']}) != 69:
        raise ValueError('obstruction-map version or row identities differ')
    return {'path': 'rl/OM/obstruction_map.json', 'shippedPath': './rl/OM/obstruction_map.json',
            'sha256': MAP_SHA256, 'rows': 69}


def sync(site):
    site = Path(site)
    raw = MAP_SOURCE.read_bytes()
    retained = metadata(raw)
    adapter = site / 'particle_reference_adapter.js'
    source, matches = RETAINED.subn('export const RETAINED_OM = freeze(' + json.dumps(retained, indent=2) + ');',
                                   adapter.read_text())
    if matches != 1:
        raise ValueError('expected exactly one retained-map declaration in the reference adapter')
    catalog_path = site / 'particle_reference_catalog.json'
    catalog = json.loads(catalog_path.read_text())
    catalog['retainedInput'] = retained
    lepton_path = site / 'lepton_round.js'
    lepton_source = qualify_lepton_comparison(lepton_path.read_text())
    (site / 'rl/OM').mkdir(parents=True, exist_ok=True)
    (site / 'rl/OM/obstruction_map.json').write_bytes(raw)
    adapter.write_text(source)
    catalog_path.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + '\n')
    lepton_path.write_text(lepton_source)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, default=ROOT / 'site')
    sync(parser.parse_args().site)
