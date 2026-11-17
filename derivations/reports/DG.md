## RESULT

**1. T6 is finished and reproduces exactly.** I reran all four of T6's producers into `work/DG/t6_rerun/` without touching T6's files. Terms, seesaw and native results match in every entry; engine results match except two CPU-time fields. T6's results:
- No pairing bilinear of the level operators conserves colour and charge.
- The only mass term invariant under the twelve responses is the singlet pairing N^c N^c, which is the top form 11111 <-> 00000. It commutes with every Gauss charge.
- The lattice seesaw has the exact form th_l = arccos(cos θ_D cos(θ_M/2)) − θ_M/2.
- Nothing in the programs fixes θ_M.

T6's one open item, the stationary reference with a pairing step, is now built on one cell (`reference.json`). It is unique and stationary to within 5e-16 to 7e-14. Its weights on 0, 2 and 4 quanta tend to 1/4, 1/2, 1/4, so it has no definite B − L.

**2. Mechanism (EXACT, `mechanism.json`): the source does not contain the pairing, and its own conserved charge forbids it.**
- **Correction to T6, item 5.** T6 wrote "no charge forbids the pairing". One does: B − L = 1 − (2/3) n3 per quantum, which equals N − (2/3)(N_v1 + N_v2 + N_v3). That is a combination of the number of quanta and three level numbers, all of which every public program conserves.
- **Every operation conserves B − L.** It commutes with the twelve responses, the five level numbers and the toggle. Routing, field step, mass options M0, M1, M3 and the native tick act diagonally on patterns. The eight toggles carry B − L = 0; the singlet link carries +2 and the doublet link −2.
- **It is the only non-gauge charge that survives the one-family reading.** The charges odd under the complement are the five centred level numbers: four gauge Cartans plus B − L. The native degree and the number of quanta do not survive separately; their odd combination does, X = 2n − 5N = −5(B − L) + 4Y.
- **The Dirac sector keeps exactly this charge.** The four Dirac channels with one Higgs doublet leave exactly X conserved. Adding the singlet pairing leaves nothing conserved.
- **Anomalies.** B − L is anomaly-free on 16 states. On the audit's 15-state module its gravitational and cubic anomalies are −1 per family.

**Selection, by field content:**

| Field content | B − L exact (source as it stands) | B − L broken by one declared step |
| --- | --- | --- |
| 16 states (CF-1's 32 patterns) | Dirac (toggle 11110 <-> 11111) | Majorana, type I seesaw |
| 15 states (the audit's module) | massless | Majorana, dimension-five operator |

No construction in the source ties a B − L-violating step to E_cell, M_U or the criticality scale.

**3. Seesaw values if a pairing is declared (no measured value used, `scale.json`).** Inputs are P and α_U from the strict source branch, Yukawa y = 1 (the unit toggle), and v = v_EW/√2 in the audit's convention (a) or v = v_EW in the repository's convention (b).

| Pairing scale M | m_ν, convention (a) | m_ν, convention (b) |
| --- | --- | --- |
| M_U | 1.229 meV | 2.458 meV |
| criticality scale | 0.0625 meV | 0.125 meV |
| E_cell | 3.18 μeV | 6.36 μeV |
| lattice tower angles (T6) | 4.3 to 8.2 μeV | 8.5 to 16 μeV |

- In units of E*, the M_U value is (1/2) exp(2π − π/α_U) P^(−7/6).
- T6's exact lattice formula agrees with the continuum seesaw to 3.4e-7 at M_U, and is 5 to 8 percent lower at the lattice scale.
- The repository's existing anchor v²/μ_U matches the M_U value in convention (b) to 0.14 percent.

**4. Comparison with measurement (NOT BLIND, `compare.json`).** The measured floor is the heaviest neutrino mass of at least 0.0501 eV from NuFIT 6.1. Every option the source supports fails it:

| Option | Result |
| --- | --- |
| Seesaw at M_U, y = 1 | reaches 0.025 (a) or 0.049 (b) of the floor |
| Seesaw at the other scales | reaches 5e-5 to 2.5e-3 of the floor |
| Seesaw at M_U, largest perturbative Yukawa √(4π) | reaches 0.31 (a) or 0.62 (b) of the floor |
| Dirac with the one common amplitude | m_ν = m_e, which is 1.1e6 times the KATRIN limit |
| Massless (15 states) | excluded: oscillations need two nonzero masses |
| Same amplitude for all three generations | excluded: zero splittings at every scale |

- Reaching the floor needs M = 6.07e14 GeV (a) or 1.21e15 GeV (b) at y = 1, about 20 to 41 times below M_U. At M_U it needs y = 6.38 (a) or 4.51 (b).
- A generous bound on the loop running of the neutrino mass operator gives at most a factor 3.93, so M_U stays below 9.7 meV.
- All y = 1 tries pass the KATRIN and DESI cosmology bounds.
- Three combinations land near the target but were found while looking at it, so they count as fits, not results: α_U·M_U, M_U·e^(−π) and M_U^(3/2)/E_cell^(1/2) give 0.024 to 0.060 eV.
- The count of tries is on record in `CANDIDATES.md`: 12 tries, 6 bounds, 7 post hoc combinations.

## EVIDENCE

```
cd work/DG && sh run_all.sh   # about 19 CPU s, everything regenerates
```

The individual steps run from the RER directory with `env PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python`:
- `rerun_t6.sh` reruns T6 and calls `compare_t6.py`.
- `dg_mechanism.py` (step 2, exact; all assertions pass).
- `dg_scale.py` (step 3, mpmath at 140 digits).
- `dg_reference.py` (T6's open item).
- `dg_compare.py` (step 4, NOT BLIND).

Files in `work/DG/`: `CANDIDATES.md` (written before computing), `MECHANISM.md` (results note), `mechanism.json`, `scale.json`, `reference.json`, `compare.json`, `t6_rerun/comparison.json`.

## WHAT THIS DOES NOT ESTABLISH

- No mass, particle or unit.
- No source for any B − L-violating step or its scale, and none for the neutrino's own Dirac amplitude.
- y = 1 is the unit toggle amplitude, not a derived physical Yukawa.
- The scale forms and P, α_U are declared items (targets DB and DC).
- Three generations, splittings and mixing are untouched (the repository's W5 orbit program).
- The running bound uses the Standard Model form from memory, not the source's own particle content.
- The paired reference on the lattice beyond one cell is argued, not computed.

## NEXT

1. **Owner decision:** keep B − L exact, which means Dirac neutrinos and a neutrino amplitude near 2.9e-13 for which the source has no number, or declare one B − L-violating step, which means Majorana neutrinos.
2. **If Majorana:** find a source construction for the top-form step. The candidate is a register carrying the determinant charge; T6 noted the audit's Higgs memory has exactly these charges in the pattern presentation. Its coherent amplitude would set θ_M. The data asks for θ_M ≈ 5.0e-5·y² per tick of ħ/E*, a scale the source does not yet contain.
3. **Generations:** splittings need the generation label (campaign items GEN and KOI).
4. **For the repository's neutrino lane:** its "native anchor" v²/μ_U is the M_U value in convention (b). It needs a factor of 20.4 to reach the atmospheric scale, which is the factor its compare-only bridge supplies.
