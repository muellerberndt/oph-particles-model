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

The [Journey page](https://particles.floatingpragma.ai/?page=journey#particle-results)
highlights the source-bound charged-lepton GeV branches, fixed comparison
residuals, localized-packet bound, magnetic response, neutral preparation and
finite radiation conversion. Each card separates its numerical result from
calibration and physical-identification assumptions. Refresh an existing site
without copying pending simulation changes:

```sh
python tools/sync_journey_results.py --out site
python tools/sync_journey_results.py --out site --check
python -m unittest discover -s tools -p 'test_journey_results.py'
node tools/test_journey_results.mjs site
```

The normal full-site builder applies the same overlay. It validates every
source hash before writing; a changed Journey mount contract requires review.
