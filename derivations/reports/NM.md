## RESULT

**Neither the neutrino masses nor the lepton mixing come out of the source.** The source's symmetry allows the top-form step, but no operation generates it at any order. All 48 registered mixing tuples fail. One splitting-ratio row lands on the measured value; it is a recorded coincidence candidate, with the caveats in item 2.

**1. Top-form step: allowed by symmetry, absent from the dynamics (EXACT)**
- **Native transports** (cover of order 120 with the Z60 central alphabets):
  - Every element has determinant one on the code, and the scalars among them are exactly the fifth roots of unity, so the realized subgroup of U(1)_N is Z5.
  - That Z5 lies inside hypercharge: n = 2·6Y mod 5 on all 32 patterns.
  - The commutant on the patterns has dimension 14: twelve sector projectors plus the link 11111 ↔ 00000 and its adjoint. The top form is the only number-changing operator the symmetry allows.
- **Continuous port phases** (GL M1): tr X_p = 0, determinant one, same Z5.
- **Seam reflectors** (GL M1b):
  - Fractional reflectors realize a U(1) under which the top form has charge tr S = 0.148143, which is irrational. If that U(1) is part of the law, the top form is forbidden.
  - The full reflectors of the public law, compressed to the code, have det(1 − 2S) = 0.7256 > 0, so every word has a unitary part of determinant one.
  - **Correction to GL:** its M1b seam state uses A[a,b] where the covariant state needs A[b,a]. With the covariant state the closure of the seam projectors alone has dimension 12, not 13; with the port phases it is 13.
- **Walk phases:** if levels are read as flux multiplets, 11111 gets 3ω_t + 2ω_d = 1.2093 rad per tick, which is not a root of unity. In CF-1's pattern reading both singlet patterns have phase 0.
- **Coherent program with the toggle:** n3 commutes with every generator. The generated algebra has dimension 320, a direct sum over n3, and 00000 and 11111 sit in different blocks. The top-form amplitude is zero at every order.
- **Audit's interacting source:** all 112 Yukawa words and all kinetic words conserve B and L separately, and the module has no neutral singlet. Every amplitude that changes B − L by two is zero at every order.
- **Consequence:** number conservation holds because every operation is a one-level transport or a doublet toggle, not because a symmetry requires it. The source as it stands gives Dirac neutrinos.
- **Declared pairing weights** (registered first; M = θ_M E*; the data need θ_M = 4.97e-5 (a) or 9.94e-5 (b) at y = 1, and 2.8e-6 with YC's amplitude):

| Weight | θ_M per tick | m_ν at y = 1, (a) / (b) | m_ν3 with YC's 41.17 GeV |
| --- | --- | --- | --- |
| Reflection about (00000 + 11111)/√2 | π/2 | 1.2e-6 / 2.5e-6 eV | 6.9e-8 eV |
| p_t³ p_d² | 1.9e-8 | 130 / 261 eV | 7.3 eV |
| √(p_t³ p_d²) | 1.38e-4 (M = 1.69e15 GeV) | 0.018 / 0.036 eV | 1.0e-3 eV |
| sin³ω_t sin²ω_d | 7.5e-4 | 0.0033 / 0.0066 eV | 1.8e-4 eV |

   - The third row reaches 0.36 (a) or 0.72 (b) of the atmospheric floor at y = 1, and 0.02 of it with YC's amplitude. It has no mechanism, and I had a rough mental value for it when I registered it.

**2. PM's number x (EXACT on the audit's packet with a second lepton doublet)**
- Fifth-order moments in units of −i/32: own composite 31, closed loop (spectator family) 20, exchange 11, down loop 60, up loop 60.
- The closed loop of one lepton family equals one colour of the down loop, and the spectator reproduces NU3's down channel exactly, so the hops are family-blind.
- **x for the lepton channel alone is 20/11.** With gaps, x(ρ) = 4ρ(3ρ − 2)/(6ρ² − 4ρ + 1), ρ = Δ_l/Δ_s: 4/3 at the audit's point (the double pole cancels), 2 at large ρ.
- **In general** x = 20/11 + (60/11)(q_d + q_u), with q the quark Yukawa traces over the lepton one. At the source's equal Yukawas x = 140/11.
- PM's form T = X·1 + σ Y_e Y_e† is exact on this packet, by family covariance of the hops.
- **Splitting ratio** (NOT BLIND; measured 0.029988 ± 0.000456):

| x | Reading | r | Pull |
| --- | --- | --- | --- |
| 20/11 (lepton channel, bare) | square | 0.029763 | −0.5σ |
| 20/11 | linear | 0.04772 | +39σ |
| 4/3 (audit's gap point) | square | 0.02378 | −13.6σ |
| 140/11 (all channels, equal Yukawas) | square | 0.05335 | +51σ |

- **The 20/11 square row is not a derivation.** Reasons:
  - It leaves out the source's own quark loops.
  - T is a hopping term (NU3), and neither mass reading is derived.
  - With the scale fitted to Δm²31 the masses are 0.0241, 0.0256, 0.0556 eV, sum 0.105 eV, above the cosmology bound of 0.064 to 0.072 eV.
  - The mixing stays a permutation.
  - I knew PM's inverse value 1.8426 before computing.
  - It is one of 48 looks at x. The two other rows within 3σ are the same structure at ρ = 2 and ρ = 4.

**3. Second lepton-family structure**
- **Three exact statements:**
  - **Position permutations cannot mix the tau.** Every operator built from the third-turn and the half-turn mirrors has f_0 as eigenvector, so with τ on f_0 two angles are 0 or 90°. On the three positions the E and C half-turns act as such mirrors (read from FR's hexagon, not computed here).
  - **A third-turn-covariant pairing gives a degenerate pair** on the electron and muon characters. Pairing a copy with its half-turn image gives masses λ_k² and a permutation.
  - **Each mirror combined with complex conjugation is a symmetry of the charged circulant.** A neutral structure invariant under one of them gives J = 0. A marked position, a mirror and the frame sign are each of this kind; an oriented marked link is not. This sharpens the brief's requirement: breaking the third-turn and time reversal is not enough.
- **Registered candidates:** ten Dirac structures and four Majorana pairings, all with the charged vertex's weights a, b, θ. Of the 48 tuples none has the three angles within 3σ; the smallest worst pull is 34.
- **Masses with YC's amplitude** (y_ν = y_τ = g/2, third-family Dirac mass 41.17 GeV):
  - Dirac rows: (0.70, 10.0, 41.2) GeV for the source as it stands, similar for the others. That is about 9e10 times the KATRIN limit.
  - Seesaw rows with the √(p_t³ p_d²) weight: heaviest 1.0e-3 eV.
- **Fits (NOT BLIND):**
  - The measured operator in the counter basis has a third-turn-breaking part as large as the invariant part (ratio 0.9985).
  - Adding a marked position or the C link to the circulant with any weight leaves χ² ≥ 1126 on the angles.
  - A marked position with a phase χ on the opposite link is the tri-bimaximal form at χ = 60°. Its best fit is χ = 39.2° with pulls +5.5σ (θ12), −5.8σ (θ23), −0.8σ (θ13), and J = 0.

**Looks:** 110 in this lane (5 pairing weights, 48 for x, 48 mixing tuples, 9 fit rows), on top of PM's 108.

## EVIDENCE

```
sh work/NM/run_all.sh    # 2 min 42 s, every job under one minute
```

- `nm1_symmetry.py` writes `symmetry.json` (step 1; 29 checks pass).
- `nm2_transfer.py {own|spectator} y_u y_d y_e out.json` runs from the RER root and uses `nm2_lib.py` (the audit packet with the doublet L′) and NU3's `nu3_lib.py`. Receipts: `x0_own_e.json` (control, reproduces NU3's −31i/32, plus the B and L check), `x1_spectator_e.json` (−5i/8), `x2_spectator_d.json` (−15i/8).
- `nm2_x.py` writes `x.json`; `nm3_mixing.py` writes `mixing.json` (58 checks); `nm4_compare.py` writes `compare.json` and `looks.json` (NOT BLIND).
- `CANDIDATES.md` was written at 08:03 before any computation; the addendum at 08:18 records what was added after seeing values.
- The RER checkout moved back to `reverse-engineering-reality` during the run, and its head advanced twice. The imported packages are unchanged between the first two heads, the full rerun passed at the third, and `git status` there is clean. `run_all.sh` resolves whichever path exists.

All files are in `work/NM/`.

## WHAT THIS DOES NOT ESTABLISH

- No neutrino mass, mixing angle, CP phase or pairing scale from the source.
- The pairing weights in item 1 are declared constructions, and y = 1 is the unit toggle, not a derived amplitude.
- The second doublet in item 2 is a declared extension of the audit's packet. Results are on the two-cell torus with both edges, and at the audit's equal penalties no perturbative effective Hamiltonian exists (NU3).
- The mixing candidates place FR's objects on the register by declared readings.
- Closed forms for the seam weights and leading factors are checked against numerics to 1e-12, not proved symbolically.
- Pulls use central values and Gaussian widths from `reports/LIT.md`; the cosmology bound is imported from NU3 and DG's files.

## NEXT

1. **Mass reading of the neutral composite.** Decide whether the family-universal part X is observable. If T is a kinetic term, X is a field normalization and r depends on the exchange part alone. Then compute the composite's dispersion with a scalar hop (NU3's next step) for two families and read the splitting there. This settles whether 20/11 means anything.
2. **Pairing.** Take up YC's lead that a toggle amplitude reading the pattern degree is link-invariant. The neutrino junction is the only one adjacent to 00000 and 11111. Build the reference of the pattern register on the invariant plane spanned by those two patterns and derive its angle from stationarity under the tick. The data need θ_M = 2.8e-6 with YC's amplitude.
3. **Mixing.** The structure must break all three mirror-conjugations and mix f_0. The smallest native object that does is FR's C and E pair on non-adjacent seams of the hexagon with an oriented link phase. Compute its compression in FR's register tick (`work/FR/fr2_register.py`) with the E object on {2,10} and the C object on {9,1}.
4. **For GL:** rerun M1b with the covariant seam state.
