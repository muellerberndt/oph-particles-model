## RESULT

I built the round-2 carrier and ran all ten registered readings. None derives the quark branch magnitudes or the per-sector normalizations, and none passes the determinant test. The carrier does produce the first source quantity in this lane where colour enters a magnitude and separates down from lepton.

**The carrier (registered in section H of `CANDIDATES.md` before any script ran).**
- The seam event on the native code supplies the lepton's 1/2 (activity 1/3; agree 1/2, repair 1/4 per orientation).
- The family cell's scalar serves as R8's register: k = 1 is the neutral member, k = 0 the charged one.
- CF-1's chiral reading: the record reflection is the neutral toggle T_1 = a*_{s2}φ_1 + h.c., and the gauge-invariant vertex is V = T_0 + T_1.
- Two branch assignments: A1 puts the neutral member on the agree branch and the charged member on the repair branch; A2 is the reverse.

**1. The two Higgs members weigh the same everywhere except one term (EXACT; ground MEASURED).**
- First order per member: up 6, 6; down 6, 6; lepton 2, 2.
- Second-order member-diagonal transfers: up 48, 48; down 36, 36; lepton 12, 12.
- Ground register populations: π(H_1) = π(H_2) = 0.116733, π(H̄_1) = π(H̄_2) = 0.122529, π(0) = 0.521476.
- So A1 and A2 give identical numbers in all ten readings. The only quantity that tells the branches apart is the member interference X.

**2. X exists only between the two quark legs (EXACT).**
- X = 12 y_d² for up (from the down partner), 12 y_u² for down, and 0 for the lepton. Each leg's first-order weight is 12 y_s² (4 y_e² for the lepton).
- X comes from the colour and Pauli structure of the shared left doublet Q.

**3. x values (EXACT).**
- W2a (X counted in the repair branch):
  - x_e = 1/2 and x_d = 2/3 for every coefficient choice.
  - x_u = (1/2)(1 + 1/(3 + y_e²/y_d²)), which never exceeds x_d. It is 5/8 at the declared point; checked at five coefficient points.
  - The measured order x_u > x_d cannot be reached in this reading: the lepton partner dilutes up's interference.
  - Against measurement (NOT BLIND): down is +7.2 percent off, up −24.8 percent. Both fail the 2 percent rule.
- W2b (X split between branches): x = 1/2 for all three.
- W2c (X in the agree branch): x_u = 2/5, x_d = 3/8.
- W1 (register populations): x = 1/2 for all, by SU(2) symmetry of the ground.

**4. Normalizations: every reading fails.**

| Reading | y₃ᵤ/y₃d (target 59 at M_Z) | tr Y_e / tr Y_u (target 0.0104 at Q0) |
| --- | --- | --- |
| W1-H | 0.99 | 1.01 |
| W1-R | 0.22 | 4.5 |
| W2a, W2b, W2c | 1.28 to 1.30 | 2/3 |

- In R8's one-quantum register (the R-version), up must absorb a quantum and down and lepton must emit one. That gives the right qualitative pattern (up much larger than down, down close to lepton), but only if the register is mostly occupied.
- The family cell's ground has it mostly empty (π_H/π_0 = 0.224 per member), so the factor points the wrong way.
- R8 result 3 adds a constraint: a register bounded on one side cannot hold a common-phase state.

**5. Determinant test: every reading fails all four scale tables.**
- R_u misses by factors of 26 to 1.4e5.
- W2a's R_d = 6.72 lies within a factor 1.27 of 5.28 at M_Z, but its R_u misses by 209.

**6. Mixing:** V_CKM is the identity in every round-2 reading (circulants on one register).

**7. RER location.** The checkout moved at 23:18 to `reverse-engineering-reality`. CAMPAIGN.md still names the old path, and scripts with the old path hardcoded (for example DF's `dflib.py`) fail when run on their own. My scripts find either location through `qm_paths.py`. I moved nothing.

## EVIDENCE

- `sh work/QM/run_all.sh` rebuilds rounds 1 and 2 in 2:52 wall time on the loaded machine.
  - Round-2 producer: `qm_r2.py` (reads no measured value) writes `r2.json` and `values2.json`.
  - Round-2 comparison: `qm_r2_compare.py` (NOT BLIND) writes `r2_compare.json`. Its inputs are the RER M_Z Yukawas, LS's three scale tables (imported by LS from memory) and the coordinator's two targets.
- The member split reproduces the packet's Hamiltonian on all 97,878 keys, and the ground energy −11.14102996 matches the packet's certified interval.
- The W2a coefficient formula was checked at five coefficient points.
- `CANDIDATES.md` section H was registered before the first round-2 script. It counts 12 looks, including a W2a estimate I made in my head beforehand. Outcomes are in H4.

## WHAT THIS DOES NOT ESTABLISH

- That the branch-to-member assignment, or the rule placing X in a branch, is the source's law. Both are declared readings; W2a's rule is argued from the neutral record basis.
- Any normalization law. The family cell's ground is one declared state with declared coefficients.
- Blindness. All targets were seen before registration.
- Coverage of the spinor lift, which belongs to worker CM.

## NEXT

1. **Normalization.** No one-cell reading reaches y₃ᵤ/y₃d ≈ 59. In the R-version, the register occupation ratio plays the role of tan β in a type-II two-doublet structure: up reads the occupied register, down and lepton the empty one. With equal junction amplitudes it would have to equal the measured m_t/m_b at M_Z, about 59. The test is whether the second doublet DB needs for its one-loop slopes has the type-II assignment and fixes that ratio.
2. **Shape.** Within the cell, W2a gives x_u ≤ x_d exactly. Reaching x_u > x_d needs an interference on the up leg that the down leg lacks. The up vertex fills all five levels (u^c ∧ Q ∧ H is the top form), while down and lepton overlap at s2; that difference is the remaining source structure to test. Stated in W2a's terms, the measured values require X/T ≈ 0.66 for up and 0.24 for down, against the cell's 1/4 and 1/3.
3. **CAMPAIGN.md path.** The RER path should be updated, or the checkout restored to its old location.

Files are in `work/QM/`:
- `CANDIDATES.md` (sections A to H)
- `run_all.sh`, `qm_paths.py`
- `qm_seam.py`, `qm_cell.py`, `qm_cand.py`, `qm_compare.py`, `qm_det.py`, `qm_r2.py`, `qm_r2_compare.py`
- `seam.json`, `cell.json`, `values.json`, `compare.json`, `det.json`, `r2.json`, `values2.json`, `r2_compare.json`
