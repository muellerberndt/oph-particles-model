# Derivations behind the viewer

> Note, 2026-11-17. The model derives no particle mass: every mass value in the OPH work so far is calibrated to a
> measurement, imported from the literature, set by a declared construction, or open. The executable model is a
> calibrated test candidate, not yet a production-level model. The reports on masses, couplings, hadrons and the
> spectrum were removed from this folder on that date, together with the site pages that showed them.

Working reports of the OPH particle campaign (November 2026) that the remaining pages of the viewer cite. Status
words in the reports: EXACT (proved or computed exactly), DERIVED (follows under the named premises), CONDITIONAL
(needs named declared items), DECLARED (a stated choice), OPEN (no source construction yet), NOT BLIND (compared
with measurement after the value was known).

| Statement in the viewer | Report |
| --- | --- |
| Defect classes are the Standard Model centre classes 6Y mod 6 | [MATCH.md](MATCH.md), [work/MATCH/match.py](work/MATCH/match.py) |
| Spin and statistics: quanta are fermions; defects, links and the Higgs register are bosons | [reports/SS.md](reports/SS.md) |
| Gauge group S(U(3)xU(2)), equal couplings at the cell, gauge waves | [reports/GL.md](reports/GL.md) |
| Colour and weak centre in the register ensemble | [reports/MA.md](reports/MA.md) |
| B − L is conserved; Dirac neutrinos | [reports/DG.md](reports/DG.md) |
| 32 Weyl blocks per copy, three copies | [reports/CH_HYPERCHARGE.md](reports/CH_HYPERCHARGE.md) |
| The routing tick of the candidate program CF-1 | [candidates/CF1.md](candidates/CF1.md) |
| The lattice gauge-Higgs system and its port into the run | [work/HR/SPEC.md](work/HR/SPEC.md), [work/HR/FOR_SIM.md](work/HR/FOR_SIM.md) |
| Decoder from the five-level code to particle names and charges | [lanes/PD.md](lanes/PD.md) |

The executable model, papers and Lean proofs are in the public theory repository
[FloatingPragma/observer-patch-holography](https://github.com/FloatingPragma/observer-patch-holography).
