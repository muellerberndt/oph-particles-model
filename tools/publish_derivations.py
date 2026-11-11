"""Copy working reports of the theory campaign into ``derivations/`` with machine-local paths removed.

    python tools/publish_derivations.py --src <campaign directory> reports/LC.md reports/LK.md LEPTON_STEPS.md ...

Each named file is copied to the same relative path below ``derivations/``. Absolute paths of the machine the
reports were written on are rewritten to repository-relative ones, so the published text names no local directory.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RULES = [
    (re.compile(r'/Users/[A-Za-z0-9_.-]+/Projects/oph-meta/repair-law/reverse-engineering-reality/?'), 'observer-patch-holography/'),
    (re.compile(r'/Users/[A-Za-z0-9_.-]+/Projects/oph-meta/reverse-engineering-reality/?'), 'observer-patch-holography/'),
    (re.compile(r'/Users/[A-Za-z0-9_.-]+/Projects/oph-meta/oph-physics-sim/?'), 'oph-physics-sim/'),
    (re.compile(r'/Users/[A-Za-z0-9_.-]+/Projects/oph-meta/repair-law/?'), ''),
    (re.compile(r'/Users/[A-Za-z0-9_.-]+/Projects/oph-meta/?'), ''),
    (re.compile(r'/private/tmp/claude-[^\s`\'")]+'), 'scratch'),
    (re.compile(r'/tmp/oph-completion-venv/bin/python'), 'python'),
    (re.compile(r'/Users/[A-Za-z0-9_.-]+/'), '~/'),
]


def clean(text: str) -> str:
    for rx, rep in RULES:
        text = rx.sub(rep, text)
    return text


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('--src', type=Path, required=True)
    p.add_argument('--dest', type=Path, default=ROOT / 'derivations')
    p.add_argument('--as', dest='rename', default=None, help='destination path below derivations/ (single file only)')
    p.add_argument('files', nargs='+')
    a = p.parse_args(argv)
    for rel in a.files:
        src = a.src / rel
        dst = a.dest / (a.rename if a.rename else rel)
        dst.parent.mkdir(parents=True, exist_ok=True)
        if src.suffix in ('.md', '.py', '.json', '.txt', '.sh', '.sha256', '.csv'):
            dst.write_text(clean(src.read_text()))
        else:
            dst.write_bytes(src.read_bytes())
        print(f'{rel} -> {dst.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
