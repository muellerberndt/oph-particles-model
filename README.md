# OPH particles model

**OPH is a rigorous, consistent and complete description of the unified, self-creating computational Universe we inhabit.**

The interactive viewer of the OPH particle model, served with GitHub Pages: defects appearing in repair on the
screen, the particle classes they carry, the observer's readout and the spectrum.

The site is built from the simulation repository by `tools/build_site.py` and published to the `gh-pages` branch:

```sh
python tools/build_site.py --only L6 --out site
tools/publish.sh
```

The site build projects hadron ratios from the replayable theory analysis in the sibling
`reverse-engineering-reality` checkout. To refresh or verify that projection:

```sh
python tools/sync_hadron_analysis.py
python tools/sync_hadron_analysis.py --check
python tools/sync_particle_reference.py
python tools/sync_thermal_scope.py
python tools/sync_finite_results.py
python tools/sync_finite_results.py --check
python -m unittest discover -s tools -p 'test_*.py'
node tools/test_finite_results.mjs
```

The reference adapter binds the inspected version-two obstruction map in `derivations/work/OM/` by SHA-256 and preserves its 69 model
rows, including their status and input ancestry. Unknown map bytes fail the build. The downloadable Node checks
use the published `rl/` paths and include their required cosmology and lepton fixtures. Scientific text
projections keep the declared number-conserving sector distinct from physical neutrino identification.

The [full universe runs](https://oph-particles-data-20261111.s3.amazonaws.com/index.html) are separate from the
viewer copies, which retain the screen tier of the stored cuts and catalogue. The lattice hadron package
retains reduced measurement tables; these universe archives do not supply its gauge configurations.

The [finite predictions page](https://particles.floatingpragma.ai/finite_results.html) presents complete
lepton-cycle outcomes, reference-inclusive error budgets, exact closed-cell population dynamics, native
conjugation symmetry, correlated hadron errors and cutoff sensitivity. Its data projector rejects stale RER
source bindings. All reported clocks, preparations and physical interpretations retain their stated domains.

The [Journey page](https://particles.floatingpragma.ai/) shows the journey from the holographic screen to the
particles, and every match of the model with nature as one wall of tiles. The Results group holds the full list
([Matches to nature](https://particles.floatingpragma.ai/?page=matches)), the board of numbers and status, the
[finite constructions](https://particles.floatingpragma.ai/?page=constructions) with their proofs, and the
[OpenWave status](https://particles.floatingpragma.ai/?page=openwave) of the 31 OpenWave criteria. Values that
answer an OpenWave criterion carry the tag OW n. Refresh the finite constructions on an existing site
without copying pending simulation changes:

```sh
python tools/sync_journey_results.py --out site
python tools/sync_journey_results.py --out site --check
python -m unittest discover -s tools -p 'test_journey_results.py'
node tools/test_journey_results.mjs site
```

The normal full-site builder applies the same overlay. It validates every
source hash before writing, and it refuses a site whose Journey page mounts the results.
The OpenWave status data come from the project's assessment:

```sh
python tools/sync_openwave_status.py
python tools/sync_openwave_status.py --check
```

The current projection binds 53 RER receipts to one committed source revision. The finite-constructions page
shows ten current tasks and the charged-lepton comparison; 39 supporting constructions stay available in a
collapsed section. Highlights include the four-input hadron/axial calibration, complete weak-contact energy
lines, distinct strong and nuclear fit controls, a native beta momentum-parity bound, oscillation-calibrated
Dirac masses, controlled outgoing meson emission, one positive 192-mode semileptonic source, joint native
clocks and an executed full-carrier Taichi kernel in a pinned OpenWave checkout. Calibration targets,
independent comparisons and actual failed fits are labelled separately.

The overlay preserves the Fable viewer and Journey layout. Small, fail-closed data hooks update its existing
Matches rows and OpenWave summaries; calibrated masses and axial strength carry visible calibration labels.
The neutrino table presents both GeV and eV without adding unmeasured absolute masses to the match count.
Match kinds read the final assessment rather than duplicating its statuses. OpenWave tags identify relevant
criteria and do not imply an official award. The platform execution names its pinned upstream member;
the criterion assessment can track a later upstream revision. Separate rigid neutral-hierarchy and
balanced-source mass/threshold failures stay available as controls.

For a clean publication worktree, write the assessment to that same worktree before testing:

```sh
python tools/sync_openwave_status.py --source /path/to/openwave-tuning/application_assessment.json --rer /path/to/reverse-engineering-reality --out /path/to/site/openwave_data.js
python tools/sync_journey_results.py --rer /path/to/reverse-engineering-reality --out /path/to/site
```

Use a current published checkout when applying the overlay: it updates only the bound Results assets and data
hooks. It must not replace concurrently edited simulation files or revert the Early Universe/cosmology page.
