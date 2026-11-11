## RESULT

**Not derived: the source gives no lepton mixing, and this round finds the exact reason.** On FR's generation register (the three characters of the face third-turn), the neutral composite's fifth-order effective Hamiltonian is diagonal in the same basis as the complex charged-lepton circulant. So U_PMNS is a permutation matrix:
- normal-ordering labelling: θ12 = θ23 = θ13 = 0, J = 0, δ undefined;
- NuFIT 6.1 excludes this with angle pulls of about 40.

The splitting ratio comes down to one number, x, which is not yet computed. None of the 108 looks at the mixing candidates passes. FR's compression (`fr2_register.json`: M(θ) = (√2/3)C(θ), which commutes with R) uses exactly my conventions.

**1. Family content of NU3's fifth-order transfer** (argued from NU3's files; the algebra after it is exact)
- The channels add exactly with no cross terms: the transfer with up and lepton couplings both on equals the up transfer plus the lepton transfer. I checked the numerators by hand: both give 54Δl⁴ − 24Δl³Δs − …
- Every path has two Yukawa vertices of one channel and three hops.
- **Quark channels:** the Higgs is carried by a quark pair that is created and annihilated together. On the lepton index this is a number times the identity.
- **Lepton channel:** the Higgs turns into an (L e^c) pair, and all three fermions hop. The last vertex annihilates either the created pair (closed loop, tr(Y_e Y_e†)·1) or the composite's own L with the e^c (exchange, Y_e Y_e†).
- **Hops:** FR's register carries no load or charge, so hops do not act on it. The passage between carriers is the proper rotation FP, which keeps each character.
- So T = X·1 + σ Y_e Y_e†.

**2. Exact statements** (`pm_theorems.py`, 26 checks pass)
- **A0:** τ sits on the axial character f₀ whenever θ lies in (−π/3, π/3). At ±2/9, e and μ sit on the conjugate pair f₁, f₂.
- **A1 (alignment):** T commutes with Y_e Y_e†. It holds to all orders as long as Y_e is the only lepton-family structure, and DG2 showed the neutrino junction is the other half of the same vertex. Hence U is a permutation and J = 0.
- **A2:** any neutrino basis that is real in the counter basis gives |U_ei| = |U_μi|. NOT BLIND: measured |U_e3|² = 0.0225 against |U_μ3|² ≈ 0.46, so every real neutrino structure is excluded.
- **A3:** the counter basis gives |U|² = 1/3 everywhere.
- **A4:** only if e sat on f₀ (a declared phase 2/9 + 2π/3, with no source) would real bases give θ23 = 45° and δ = 90° or 270°.

**3. Splitting ratio:** T_k ∝ x + λ_k², with x the ratio of the universal part to the exchange part.

| Reading | r | Status |
| --- | --- | --- |
| x = 0, linear | 0.003535 | |
| x = 0, A-clock square | 1.25e-5 | |
| \|x\| → ∞, both readings | 0.05919 = (m_μ − m_e)/(m_τ − m_e) | |
| x from the source | not computed | open |

Inverse reading (NOT BLIND, a fit, not a derivation): the measured r = 0.030016 needs x = 0.4284 (linear) or 1.8426 (square). The PMNS stays a permutation on every branch.

**4. Repair candidates** (one native second structure on the neutrino side; values computed before reading the data):

| Candidate | Result |
| --- | --- |
| Counter basis | trimaximal |
| Half-turn reflection | e and μ rows (0, ½, ½), τ decoupled |
| Kernel copies (M3) | e–μ symmetric, \|J\| = 1/(6√15) |
| Twisted kernels A₂, A₄ | J² = (3 ∓ √5)/2430 exactly |
| Kernel copies with e on f₀ (declared) | θ12 = 36° exactly, sin²θ13 = (2−φ)/(3(2+φ)) = 0.0352, θ23 = 45°, δ = 90° or 270° |

**5. Comparison** (NOT BLIND; 108 looks, made up of 96 value tuples and 12 inverse branches)
- No tuple has all three angles within 3σ, and no tuple has r within 3σ.
- Best tuple (the declared e-on-f₀ case): pulls +6.4 (θ12), +1.8 (θ23), +22.7 (θ13), +2.2 (δ); r = 0.721 against 0.030.
- Post hoc, not a result: the A₂ pair at −2/9 gives δ = 211.35° and J = −0.01773, close to the central 212° and −0.0179, but its angles miss by 22, 17 and 59σ.

## EVIDENCE

```
cd work/PM && sh run_all.sh   # about 20 CPU s
```
- `pm_theorems.py` writes `theorems.json`.
- `pm_compute.py` writes `results.json` (82 checks pass). It confirms that D1's matrix at flux 0 equals M3 and that the twisted levels match D1's closed forms.
- `pm_jexact.py` writes `jexact.json` (exact J², reproduces 1/540 at flux 0).
- `pm_compare.py` writes `compare.json` and `looks.json` (NOT BLIND).

Other files in `work/PM/`: `CANDIDATES.md` (23:27, before any computation; additions recorded at 23:39), `NOTES.md`, `pm_lib.py`.

**Provenance problem:** `oph-meta/reverse-engineering-reality` disappeared from its path at about 23:20. A full checkout showed up at `repair-law/reverse-engineering-reality`, and FR used `/private/tmp/claude-501/lew_repo`. I read `slow_geometry` and the NuFIT packet read-only from `oph-meta/oph-completion-2026-11-02`, which matches `oph-pr-merge`.

## WHAT THIS DOES NOT ESTABLISH

- No mixing angle, CP phase or splitting ratio of nature comes from the source.
- The family content of the fifth-order transfer is argued from NU3's path census, not computed in a packet with more than one family.
- The source's value of x is not computed. The splitting ratio is reduced to x, not derived.
- Candidates C3, C4 and D place second-index objects on the register through a declared identification (S = C+). The e-on-f₀ phase used in D has no source.
- Neither mass reading (linear or A-clock square) is derived for the neutrino, and the mass ordering is not selected.
- The pulls use central values and Gaussian widths from LIT.md; the δ widths are crude.

## NEXT

1. **Compute x.** Give NU3's packet a second lepton family (L′, e^c′ with the same hops and links, Y = diag(1, 0)). The fifth-order transfer of the spectator composite is the closed loop alone; the coupled composite gives closed loop plus exchange. Add the quark loops using the junction weights from TR and QM. If the quark terms dominate, r tends to 0.0592, which is excluded.
2. **Mixing needs a second lepton-family structure,** and the source has none. It must break the face third-turn and, by A2, time reversal on the neutral side. The native candidates that break the third-turn are the C and E half-turns and the CF-1 frame routing. The law must fix the weight of whichever is used before any comparison.
3. **Coordinator:** put RER back at its canonical path. NU3, FR and this lane currently read different copies.
