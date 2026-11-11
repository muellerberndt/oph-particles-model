## RESULT

The determinant-line basepoint can be written in native weights and fits the leptons, but the quark test excludes it. I built it as registered, checked every input exactly, and answered the audit's objection. Relabelling the classes changes only phases, so it predicts the same determinant for the up, down and lepton sectors. The up quarks miss that prediction by factors of 106 to 4946.

**1. Construction (registered at 23:04, before any script of this round).**
- **D1:** the basepoint is the product over the 12 cone points of the trace weight τ(P_c) = 1/6, times one agree weight q = 1/6 and one repair weight p = 1/12.
  - This gives 6⁻¹²·q·p = 6⁻¹⁴/2 = 1/156728328192.
  - **D2** (Gauss-Bonnet form, 6^−(V+χ)/χ) has the same value.
- **Trace-lift form:** 3μ = 12 log(1/6) + log q + log p + (3/2) log 2 = (1/2) log 2 − 14 log 6. That is 14 primitive sectors, each with multiplicity 1.
- **Inputs checked exactly:**
  - The screen has 12 vertices, 30 edges and 20 faces; each vertex defect is π/3 = 2π/6, the total is 4π = 2πχ, and the defect rotation has order 6.
  - In the Z6 group algebra, every minimal projection has trace weight 1/6. Each leg's character multiplied over the 12 cone points gives ω^(12k) = 1 for every class.
  - The repository's 128-label menu gives p = 1/12 and q = 1/6.
  - The third-turn characters are orthonormal, so Z_L = Z_E = I₃.
- **Lepton readout (NOT BLIND):** 0.000510530, 0.105562 and 1.775353 GeV.
  - The measured product over v³ is 1.0027 times the basepoint with pole masses.
  - With running masses at M_Z it is 0.912.
  - D1 is the MCPR determinant law rewritten in native weights, so the lepton agreement inherits the MCPR's target-informed history and carries no weight as evidence.

**2. Answer to the audit's objection (argued, with exact checks).**
- The charged determinant line is a C* torsor, and C* splits into a phase (U(1)) and a modulus (positive reals). A Z6 character can only supply the phase, and over the closed screen the character product is 1 for every class.
- The modulus is the trace weight τ(P) = 1/6, which is the squared norm of a minimal projection.
- Y_e = y_J C² is quadratic in the native amplitudes, so a squared-norm modulus is the matching level, with q and p on the same footing.
- The kinetic factor is 1, because the generation states are orthonormal.
- Still declared: that the basepoint contains exactly 12 cone sectors plus one agree and one repair event, and that the physical identity mode equals the basepoint.

**3. Quark test.** Relabelling the junction legs (classes 1, 3, 4; H̃ on the up leg, H on the down leg) changes only the characters, whose product is 1. The trace weight is 1/6 for every class, DF showed the seam weights are class-blind, and reversing the Higgs orientation leaves the spectrum unchanged. So the prediction is R_u = R_d = 1, where R_f = |det Y_f| / |det Y_e| at the same scale.

| Scale (measured values from memory) | Leptons / basepoint | R_u | R_d | R_u/R_d | Smallest miss for any Z6-only rule |
| --- | --- | --- | --- | --- | --- |
| Own scales (PDG 2024) | 1.0027 | 4946 | 19.2 | 258 | 16.1 |
| M_Z (Xing, Zhang, Zhou 2008) | 0.912 | 1547 | 5.28 | 293 | 17.1 |
| 2e16 GeV | not computed (v not fixed there) | 106 | 0.32 | 333 | 18.2 |

- **D1 and D2 are excluded** at all three scales under the registered rule (miss by more than a factor of 3).
- **Class exclusion:** any construction that reads only Z6 labels, colour multiplicity, screen geometry, seam weights and the Higgs orientation predicts R_u = R_d. With the measured up/down ratio of 258 to 333, every such construction misses one quark sector by at least 16.
- **L7 (unregistered, recorded afterwards):** a cone-point weight of 6^(−|6Y_R|/6) from the right-handed leg fits the leptons by construction. It lands the up sector within 1.19 at M_Z, but misses the down sector by about 3×10⁵, so it is excluded.

**4. Looks counted.**
- I considered six constructions. D1 and D2 were registered. L4, L5, L7 and a spinor Z12 weight were not; the spinor weight was never evaluated.
- Before registering, I made ten data looks: the lepton target, two lepton running-mass products, and seven quark-ratio estimates. That means the outcome had been estimated before registration.
- After registering, I ran one comparison producing 8 values. The exclusion holds by a margin of 35 to 1650 over the factor-3 threshold, so it does not depend on that prior estimate.

## EVIDENCE

- `sh work/LS/run_all.sh` rebuilds both rounds in about 19 s wall.
- Round-2 scripts, run as `cd RER && PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=. /tmp/oph-completion-venv/bin/python -B <script>`:
  - `ls2_construct.py` reads no measured values and writes `ls2_construct.json`.
  - `ls2_compare.py` writes `ls2_compare.json`.
- Order on record:
  - section 5 of `CANDIDATES.md` registered at 23:04:06
  - construction run at 23:05
  - comparison at 23:06
  - outcomes (section 5.5) appended afterwards.
- Files: `work/LS/CANDIDATES.md` (sections 5.0 to 5.5), `ls2_construct.py`, `ls2_compare.py`. The round-1 files are unchanged.

## WHAT THIS DOES NOT ESTABLISH

- That the basepoint's premises follow from the source. The 12 cone sectors, the single agree and repair events, and the identity-mode equalizer remain declared, and the lepton fit is a fit of the form.
- Exact quark values: they are quoted from memory (PDG 2024 and the 2008 table), and the exclusion margins are 30 or larger.
- Anything about constructions that read T3 or integer hypercharge, which lie outside the class exclusion. L7 is one such construction, and it fails.
- Which mass scheme the basepoint refers to. It fits pole masses and misses running masses at M_Z by 9 percent.

## NEXT

1. **Separate up from down.** The determinant needs R_u/R_d ≈ 290, roughly 6^3.2. Only labels beyond Z6 can carry that: the two components of R8's Higgs register (T3) or the integer hypercharge. R8 leaves the four junction amplitudes open. A basepoint that reads one of these labels can be tested on all three sectors at once with `ls2_compare.py`.
2. **State the scheme first.** Any future determinant law should say which mass scheme it fixes before it is compared.
3. **Round-1 item still open.** The lepton junction needs a class-dependent weight, about 0.0104 of the up-sector trace at Q0.
