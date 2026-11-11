## RESULT

The bond junction does not derive the CKM matrix. With the native weight and the family phase 2/9 it lowers |V_ub|/|V_cb| from 0.80 (site) to 0.364, against a measured 0.088. A bond phase can move the CP phase off 90°, but no single phase gives the measured ratio and δ = 65.7° together. Nothing passes on either base.

**Construction (registered 07:56, before any value)**
- **Family part:** FR's register, rebuilt with FR's own round-1 functions (read only): M = (√2/3)C(θ) on F = (4, 5, 11). FR's round-2 registration keeps this shape.
- **C junction:** the C seam's bond 11→4.
- **E partner bond:**
  - 5→11 (primary): the E seam's other hexagon neighbour, and the gE image of the C seam;
  - 4→5: the pair of dimers that gE exchanges;
  - 11→4, the same bond as C, as a control.
  - The two non-control choices give the same |V| with opposite sign of J.
- **Weights:**
  - WB3 (primary): the W3 deficit √(6/7) − 1 on the bond's own hop.
  - WBR and two clock variants (secondary): the record's repair components on the bond, weight hold/√2.

**Exact statements**
- **X9 (element formula, to 7e-51):** ⟨v_k|b_j(α)|v_l⟩ = (2/3)cos(α − 2π(k+l)/3)·ω^((1+j)(k−l)).
  - A bond carries the phases of the site opposite to it, with moduli that depend on the character pair.
  - The light-heavy element vanishes at α = π/6.
  - The first-order V built from it holds within 0.44 percent on random pairs.
- **Correction:** my registration wrote the phase exponent with j − 1. The code derivation gave 1 + j, found before any value was computed; the registered predictions do not depend on it.
- **Same bond in both sectors:** J = 0 (|J| < 1e-51), as predicted.
- **θ = 0:** J = 0.

**Item 1: suppression of V_ub (NOT BLIND)**

| Reading | \|V_us\| | \|V_cb\| | \|V_ub\| | ratio | \|J\| | δ |
|---|---|---|---|---|---|---|
| native, WB3 on the bond | 0.1117 | 0.0230 | 0.00837 | 0.364 | 2.12e-5 | 82.4° |
| conditional (measured charts as base) | 0.3425 | 0.0153 | 0.0142 | 0.933 | 6.8e-5 | 76.4° |
| conditional, self-consistent (appendix, 07:58) | 0.3843 | 0.0146 | 0.0148 | 1.009 | 7.4e-5 | 75.8° |
| measured | 0.2250 | 0.0418 | 0.00369 | 0.088 | 3.1e-5 | 65.7° |

- The native first-order limit of the ratio is 0.337, as predicted before computing (about 0.4).
- When the bond carries the base's own phase, the suppression factor is (a − λ_middle)/(a − λ_light). That is 0.44 for the lepton-like base and 0.7 to 0.83 for the measured hierarchies, so the measured masses give almost no suppression.
- The self-consistent row re-solves each sector's base so the measured mass ratios hold after the junction term.

**Item 2: the CP phase**
- With identical sector bases and equal bond phases, δ = 90° at first order for every θ. Scaling the weight to 1 percent gives 89.92°; the 82.4° at the native weight is a second-order effect.
- A bond phase α does move δ without a second breaking. On the native base δ runs from 88.7° at α = 0, through 62.2° at α = 0.436, to 17.8° at π/6.
- The same zero that suppresses V_ub also drives J to 0, so the two targets pull against each other.
- **Fit (one number, native base):** the ratio 0.088 needs α = 0.465 or 0.629. Then:
  - δ = 53.6° or 57.0°;
  - |V_us| = 0.105 or 0.096;
  - |V_cb| = 0.0285 or 0.0313;
  - |J| = 6.0e-6 or 6.9e-6.
  - All of these fail.
- **Conditional base:** the ratio never falls below 0.192 (0.165 self-consistent) for any α, so no fit exists there.
- **Scan observation (no verdict):** when the family and bond phases move together, the ratio reaches 0.088 near θ ≈ 0.416 with δ ≈ 70° (interpolated between scan points). There |V_us| is about 0.057 and |J| about 6e-6.

**Comparison:** 30 native, 24 conditional and 4 self-consistent readings. None passes the four CKM checks, the ratio, or δ. The only element-level passes are two same-bond controls, which have J = 0. The secondary WBR readings give |V_us| of 0.68 to 0.85.

**Furthest derivation:** exact bond elements; V_ub/V_cb = 0.364 and δ = 82.4° from the native deficit bond; and the tension between V_ub suppression and J in any single-bond junction.

## EVIDENCE
- Rebuild rounds 1 to 3 (1:54): `sh work/CM/run_all.sh`
- Round-3 scripts: `cm_r3_lib.py`; `cm_r3.py` → `r3.json` (reads no measured value); `cm_r3_compare.py` → `r3_compare.json`; `cm_r3_sc.py` → `r3_sc.json`. The last two read measured values.
- `CANDIDATES.md` sections R3-A to R3-G hold the looks, the hand predictions P1 to P4, the registration, the appendix and the outcomes.
- **Looks counted (R3-A):** all results of rounds 1 and 2, the two targets in the brief, and a hand derivation that predicted the outcome before computing (five numbers).
- FR's files were imported read only; nothing was written in `work/FR/`. The public repository was read at `reverse-engineering-reality`; FR's own code resolves it to its snapshot.

## WHAT THIS DOES NOT ESTABLISH
- That the junction is a bond, which bond is E's partner, or that the W3 deficit sits on the bond. These are declared choices.
- Anything for unequal sector bond phases at small weight. That case was tested only at the large WBR weight.
- Quark masses. The native base is lepton-like for both sectors, and the conditional bases take the measured masses as input.
- The sign of J, which flips with the assignment and with the choice of partner bond.
- Blindness. The targets and the expected outcome were known before registration.

## NEXT
1. **V_cb against V_us.** At the fit points |V_cb|/|V_us| = 0.27 to 0.32, against a measured 0.186. At first order this ratio does not depend on the weight, so no single bond with a free phase and weight reaches the measured matrix. A second structure is needed.
2. **Unequal sector phases.** The registered candidate is the deficit bond with C clocked and E unclocked, or E clocked in its native order, at the small deficit weight.
3. **Quark base.** With the measured hierarchies the bond's suppression factor is 0.7 to 0.83. A V_ub/V_cb of 0.088 therefore needs either QM's magnitude law to change the base, or a junction phase near π/6 that is independent of the base phase.

Files are in `work/CM/`:
- `CANDIDATES.md`
- `run_all.sh`
- `cm_r3_lib.py`, `cm_r3.py`, `cm_r3_compare.py`, `cm_r3_sc.py`
- `r3.json`, `r3_compare.json`, `r3_sc.json`
