## RESULT

I built the two-object generation register inside the coherent seam repair law as an exact unitary tick with records. Its one-tick compression onto the characters of the face third-turn is exactly the target circulant with |b|/a = 1/√2 (EXACT). With CK's premise (one radian per read) and the register's own read count P(R+ xor H) = 2/9, it gives m_μ/m_e = 206.770316 and m_τ/m_e = 3477.4728. The register, its records and the analyzer are DECLARED; the list is in the second section below.

1. **The coherent event is a SWAP, so the source endpoint is recorded (EXACT, new).** On the repository's own `Observer.repair`, at all 60 addresses, U_k swaps the seam parity (p_k, m_k) with the owned record.
   - U_k|a,0⟩ = |p_k⟩|+⟩ and U_k|b,0⟩ = |p_k⟩|−⟩: read in its conjugate basis, the record is the source endpoint relative to the address.
   - This corrects LNAT2 item D1 ("the coherent law records no source"). The source is recorded in the conjugate basis, and the Z basis (repaired or not) is complementary to it.
   - The Gram obstruction still holds for keying inside the repair branch. A unitary key on the conjugate basis also acts on the agreeing branch, as (R + R⁻¹)/2.

2. **Definition.** It is in `DEFINITION.md` and was written before computing; the alternatives are in `CANDIDATES.md`.
   - Objects: C on seam {2,3} and E on seam {2,10}, each with its own load, record and two-orientation address.
   - Screen orientation (outward normal of f = {4,5,11}): C runs 2→3, E runs 10→2. Both are edges of the hexagon 2→3→9→1→0→10 around the f axis; ρ_f = g⁻¹ moves it two steps.
   - Generation register F: a neutral register on the ports of f, with R = ρ_f.
   - Tick: U = K_θ·T·V·(W_C⊗W_E). V is the oriented record (Z_r at the reversed address). T applies R^{±1} when C repairs in orientation ±. K_θ = exp(iθJ), with J = |1⟩⟨1|_{r_C}⊗σ_z(o_C) the oriented current.
   - Preparation: activity 1/3 for each seam (recomputed: 12/36 for both C and E), with each load at its seam's screen tail.
   - Analyzer: Φ is the Fourier zero over three flags: {E agrees ⊗ C idle, C repairs + ⊗ E idle, C repairs − ⊗ E idle}.

3. **Compression (EXACT).**
   - Every factor is unitary, and so is the full 432-state tick (integer arithmetic).
   - M(θ) = (√2/3)·C(θ), with C(θ) = √(1/6) I + √(1/12)(e^{iθ}R + e^{−iθ}R⁻¹), and M commutes with R.
   - Eigenvalues: λ_k = (√2/3)(1/√6 + (1/√3)cos(θ + 2πk/3)) on R v_k = w^k v_k; Q = 2/3 for every θ in the positive chamber.
   - At θ = 0 the electron and muon levels are equal (both a − b). The oriented phase is what separates them.

4. **The oriented record keeps the repair branch (EXACT).**
   - Full 1440-state walk: the plain law's consensus block (record 1 ← record 0) is exactly 0. With the oriented record it is (1/30)Σ_seams |p⟩⟨m_ref|.
   - Walk analogue on the C seam: (S − S⁻¹)/120 becomes (S + S⁻¹)/120.
   - In the register, the plain record gives the quadrature form of LNAT2 (Q ≤ 0.3463). An orientation-blind coupling cancels the repair branch at θ = 0.
   - V·Q equals the law with the screen address's unitary at both addresses, for every link phase.

5. **Conditions found.**
   - C load at the screen head gives C(θ+π): one negative eigenvalue, ratios 14.0 and 26.7.
   - A coherent symmetric C source gives b = 0. A tail/head mixture gives 1.633 and 2.468.
   - The E source (tail or head) drops out. An E load in the symmetric superposition breaks the balance.
   - The activities must be equal: (b/a)² = α_C(1−α_E)/(2α_E(1−α_C)).

6. **Analyzer alternatives.**
   - Same circulant shape: the exclusive matched analyzer gives √(5/18)·C, the marginal reading C/√3, and one object (C agreeing as the hold) C/√3.
   - The balance therefore needs no second object. Two objects are needed for the phase count: one object gives 1/4, excluded.
   - These fail the balance: precedence rules ((b/a)² = 3/5 and 5/12), the product readout (1/8), and LNAT2's two-flag analyzer (1/4).

7. **Gauss compatibility (EXACT).**
   - All 36 link-phase pairs on the two seams give the same M.
   - Routing the class-k string through the C seam or the E seam (class 3: link −1) leaves M unchanged; the hexagon holonomy equals k.
   - A Z6 quantum link commutes with G_tail, G_head and Z_link; the wrong-shift control fails.
   - Because F is neutral, there is no Aharonov-Bohm shift. LNAT2's 2/9 + π/3 for "hops around f" does not arise.

8. **Rotation covariance (EXACT).**
   - All 60 rotations carry ρ, the screen orientations, the tails and the F basis consistently.
   - The three half-turns mapping f to f′ reverse the phase in g's frame: λ^f_k(θ) = λ^{f′}_k(−θ).
   - For a defect on f, the electron is the g-character w², the muon w and the tau trivial; on f′ the electron and muon labels swap.
   - Class-3 link phases are real, so only the screen normal can orient J.

9. **Phase (read counts EXACT; the premise is CK's).** It enters only through K_θ on the oriented current, as the circulant phase δ = θ.
   - P(R+) = P(R−) = 1/12, P(H) = 1/6, P(R+ and H) = 1/72.
   - P(R+ xor H) = 2/9, with variance 14/81 per carrier.
   - The alternative counts are excluded: exactly one of three reads gives 5/18 (μ/e = 1712), one object gives 1/4 (μ/e = 2710).

10. **Geometric reading of F (EXACT geometry, ARGUED reading).**
    - ρ_f cycles the three E-type hexagon seams {2,10} → {9,3} → {0,1}, and each screen-oriented C seam joins one of them to its ρ_f image.
    - So F reads as the E seam the circulating current has reached: a C repair moves it by ρ_f^{±1} and the E agreeing half holds it.
    - The native current +1 (2→3) and the native reset port 2 agree with f's screen orientation and disagree with f′'s.

11. **Ratios (A-clock).**
    - λ = (0.9714016, 0.0164728, 0.2368705), Q = 2/3.
    - NOT BLIND, against the repository's PDG 2026 table:

    | Quantity | Predicted | Measured | Offset |
    |---|---|---|---|
    | m_μ/m_e | 206.770316 | 206.7682827 | +9.83 ppm (452σ) |
    | m_τ/m_e | 3477.4728 | 3477.370 ± 0.169 | +0.61σ |
    | m_τ from m_e | 1776.985 MeV | 1776.932 MeV | |

    - FIT: θ = 2/9 − 1.7515e−7 (−0.788 ppm) makes μ/e exact and gives τ/e = 3477.4416 (+0.42σ).
    - The Floquet readout gives 14.38 and 58.97, excluded.

## EVIDENCE

**Operational problem for every worker:** the RER working tree `reverse-engineering-reality` has been gone since about 23:18; oph-meta `git status` shows ` D reverse-engineering-reality`. My scripts import read-only from the snapshot `/private/tmp/claude-501/lew_repo` instead. Its `coherent_seam_repair` files match that package's own manifest hashes (program.py 0a53aa71…, walk.py 088a135d…). `FR_RER=<path>` forces another path.

- Everything: `sh work/FR/run_all.sh` (about 100 s, no byte code written).
- Each script runs from `work/FR` as `PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python -B <script>`:
  - `fr1_native.py` → `fr1_native.json`: SWAP structure, activity, geometry, walk consensus blocks.
  - `fr2_register.py` → `fr2_register.json`: unitarity, compression, controls, analyzers, read counts.
  - `fr3_covariance.py` → `fr3_covariance.json`: Gauss checks, 60 rotations, half-turn sign, dimer reading.
  - `fr4_ratios.py` → `fr4_ratios.json`: ratios and the NOT BLIND comparison.
- Definition and tries on record: `DEFINITION.md` (one correction appended after computing, about the reflector wording when a link phase is present) and `CANDIDATES.md`.

## WHAT THIS DOES NOT ESTABLISH

- **Declared, not derived:**
  - the neutral register F and coupling T (LNAT M1);
  - the oriented record V (M2);
  - the clock coefficient θ (M3; CK owns it);
  - the analyzer Φ, including its "other object idle" consensus;
  - the preparation with each load at its screen tail.
  - The SWAP structure, the native current sign and the reset port are consistent with these choices; they do not derive them.
- **Imported:** activity 1/3 (DA3's native matching code).
- **Premises:** "one radian per read" and the federation mean are CK's. The A-clock mass readout is a premise from LNAT2 T2.
- **One tick only:** after the tick the load sits in the agreeing state |p⟩, so the next tick's source is not definite. Multi-tick behaviour is not computed.
- **Open:** the 9.83 ppm dressing (S5); the absolute scale; why f is selected over f′; that the characters are physically the generations; quarks and neutrinos.

## NEXT

1. CK: derive the clock premise with J taken as this register's oriented current.
2. DR (S5): compute the pole shift as a perturbation of K_θ in this register.
3. Make V native. Build the coherent completion of the native signed current record (coin 0, raw 1 means 2→3) and test whether it reduces exactly to V on the C seam.
4. Iterate the tick with the walk's address reflection, and test whether the per-tick compression stays (√2/3)·C(θ). That decides whether a definite source is maintained.
5. Replace the "other object idle" consensus with a derived one. The exclusive form E2 holds only with both loads at their screen tails.
6. PM (S11) can reuse the register and its dimer reading for neutrino mixing.
