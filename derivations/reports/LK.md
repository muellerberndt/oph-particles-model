## RESULT

**Derived.** CK2's weak round runs on operations of the public program plus one named interaction, and the kick is identified: it is the commutator of an oriented toggle with the tick of the standing pair. **Still missing, one item:** a source event that applies this toggle across the clocked register and the pair at a small angle η. Its angle per cell tick is the lepton scale, F = 2η/τ.

**1. Round operations** (EXACT in FR's twelve-address model, also executed in floats)

| Operation | Status against the public program |
|---|---|
| Tick | existing (`Observer.step`); for two loads a composition of `common.local_repair_unitary`, addressed as in `Observer.repair`, with the address reflection |
| Inverse tick | existing (`Observer.inverse_step`) |
| Return test, address register | existing: the address mean inside `embedded_return_measurement`, equal to (1 + R)/2 |
| Return test, symmetric double location | new as T_sym = (1 + X_E)/2; removed by the crossing below |
| Reset on a non-return | existing preparation (uniform address appended to a blank record) |

- **CK2's numbers reproduced:** P = 2/9, zero-return amplitude 1 − P + P·exp(−ihj), non-return norms 11/144 and 5/36, phase 0.205334 (N = 1) and 0.222062 (N = 10). They are identical in the plain frame, which is the law the public program executes; CK2 used the native frame.
- **Public one-load program, own methods only** (`embedded_port`, `step`, 20 `quarter_turn`, `inverse_step`, `embedded_return_measurement`): return amplitude 11/12 + i/12, "no" weight 11/72.
- **T_sym is needed in CK2's form.** In the native frame it lies outside the public operations (two disjoint block families). Without it the phase stays 2/9, but the current flags keep only cos(1/18) = 0.998457, giving Q = 0.665639 (NOT BLIND, 201σ low).
- **Repair that removes T_sym.** In the plain law, two ticks of the E seam's own two-address walk carry the double load from one end to the other with amplitude one. With this crossing between rounds:
  - a double at one port serves, with no superposition of locations;
  - the forward read has weight 1/6 and 0 in alternate rounds (mean 1/12), and the round coefficients 5/18 and 1/6 average to 2/9;
  - two rounds act as a scalar; phase per unit clock time 0.222071 (N = 10), 0.222222207 (N = 1000), modulus tending to 1;
  - the return test is the public return detector's form for the double at its current port, and the reset restores only the address consensus.
- **Correction to CK2:** with the pair in S, a non-return of object A sits at port 2 (10/144) plus 1/144 along the antisymmetric double. Its reset must also restore the symmetric location.

**2. The kick**

- **Exact forms:** J = (V₋ − V₊)/2, where V± is the record reflection at orientation ± and V₋ is FR's native oriented record. Qx = (1 − Z_F·Z_I)/2, with Z_F, Z_I the flag reflections of A and B.
- **Named interaction:** T(η) = exp(+iη J⊗Z_F Z_I). On every unflagged pair state, W⁻¹T(η)W T(η)⁻¹ = W⁻¹exp(−2iη J⊗Qx)W, so h = 2η. The pair identity is exact; executed rounds agree to 1e-12.
- **Public realisations:**
  - each factor of T is a product of squared public quarter-turns on one object's own register;
  - the strong kick (h = π/2) is a product of public quarter-turns on joint basis states;
  - the weak kick is four tensor-Z rotations of the public source controls (the service `KOIDE_SOURCE.md` uses for its own kick): 40 native pulses, distance 1.3e-15 to the ideal operator.
- **Yukawa toggle test (lead A).** R8's Z2 toggle Z_r⊗X_h, with X_h read as the flag parity Z_F Z_I, fails as it stands and works after two changes:

| Generator | Round | Odd phase | Even phase | Leak |
|---|---|---|---|---|
| J⊗Qx (CK2) | plain | 2/9 | 0 | 0 |
| Z_r⊗Z_F Z_I (Z2 toggle) | plain | 0 | −10/9 | 0 |
| σ_z(o)·Z_r⊗Z_F Z_I | plain | −5/9 | 0 | 5/9 on the hold flag |
| σ_z(o)·Z_r⊗Z_F Z_I | echo with the tick | 4/9 per unit η | 0 | 4/9 on the hold flag |
| −J⊗Z_F Z_I | echo with the tick | 4/9 per unit η | 0 | 0 |
| J⊗(forward read − backward read) | plain | 0 | 0 | 0 |

  - **Exact mismatch:** the toggle carries Z_r = V₊V₋, while the kick needs (V₋ − V₊)/2. Its first-order generator is (5/9)·Z_r, orientation-even and Hilbert-Schmidt orthogonal to J⊗Qx.
  - **Smallest change:** the orientation sign σ_z(o), plus the echo with the tick. The current flags then get exactly CK2's amplitude with h = 2η.
  - **The sign is in the public law:** on the two addresses of a seam, Q = 1 − K² + σ_z(o)·K, with K the exchange of |m,0⟩ and |p,1⟩ (EXACT on `Observer.repair`).
- **Lead A stands in this form** (ARGUED dictionary): the unflagged pair is the phase state of the flag-parity bit, and the count is half the drop of that amplitude in one tick, P = (1 − 5/9)/2.
- **h in source quantities:** h = 2η = 2g|β| (R8's mass step: toggle amplitude times Higgs amplitude).

**3. Lead C**

- F = h/τ = 2g|β|/τ, with τ = 2 ticks for CK2's form and 4 with the crossing. The source quantity that sets F is the toggle angle per application.
- NOT BLIND, at F = 8.864e-19 and τ = 2:
  - η = 8.86e-19 and N = 5.6e17 rounds per unit clock time;
  - finite-round terms 5e-38 (phase) and 1.5e-19 (amplitude);
  - recorded non-returns 3.9e6 per second and lepton.
- On the electroweak dictionary the bare toggle amplitude is y₀ = (9/2)·y_J = 0.0487. YC's g/2 is 5.2 and 9.0 times too large against y_J, and 5.8 and 10.0 times against the tau Yukawa at the cell.

Looks: 5 NOT BLIND comparisons (the four YC ratios and the Q value), no fitted number. All registered predictions held; one wording (R4) is corrected in the outcomes.

## EVIDENCE

Everything is in `work/LK/`.

- Rebuild (1 min 44 s wall on the loaded machine): `sh work/LK/run_all.sh`. Adding `word` also runs `lk_kick_word.py` (about 50 CPU s, 5 min wall under load).
- Single scripts, from that directory: `PYTHONDONTWRITEBYTECODE=1 python -B <script>`
  - `lk_round.py`: CK2's numbers, return test, non-return content, round without T_sym; cross-checked against FR's model on 50 random states.
  - `lk_public_round.py`: the round on the public `Observer`; the sign identity on `Observer.repair`.
  - `lk_kick.py`: the candidate table and the operator identities.
  - `lk_kick_word.py`: the kick as a word of the public source controls.
  - `lk_frames.py`: native against plain frame; the two-tick crossing.
  - `lk_echo_pulse.py`, `lk_exec.py`: the executable rounds, both variants.
  - `lk_scale.py`: the only script that reads measured values.
- Order on record: `CANDIDATES.md`, hashed at 09:17:36 before any script existed and again at 09:42:38 with three addenda (`PREREG.sha256`); outcomes are in its section 6. The round is defined in `ROUND.md`.
- The public checkout was only read (imports, `git status`, `git log`); no file was written there.

## WHAT THIS DOES NOT ESTABLISH

- **A source event for T(η).** The coherent seam program has no event across independent objects and no small angle. The public source controls supply continuous angles as specified apparatus and need a coherent load of the four bits.
- **The dictionary.** Record reflection as the toggle is R8's chart for the routing record; flag parity as the Higgs bit is lead A. Both are ARGUED.
- **The carrier.** The two-load model is FR's twelve-address hexagon; the public program executes one load on sixty addresses.
- **The crossing's address register.** It uses a two-orientation address of the E seam beside the object's twelve-address register (L4).
- **A source of the double load (L1).** The register's own amplitudes still need the symmetric double.
- **The clock unit (L3).** F = h/τ assumes rounds back to back at the cell rate. In the public weak round each mass round contains one full analyzer application; in that reading F is the mass-kick rate and the number of phase rounds is a separate number.
- **Any value of g or |β| (L6 to L8).**

## NEXT

1. **LY, LV:** one number, the oriented toggle's angle per application, η = g|β| = (τ/2)·F. Needed value (NOT BLIND): 8.86e-19 at τ = 2, or y₀ = 0.0487 on the electroweak dictionary.
2. **LP:** the phase clock needs a double load on an E seam plus the plain-law crossing, with no symmetric superposition.
3. **LC:** place the twelve-address register and the seam-local two-address register on one object, and check that the crossing holds on the sixty-address carrier.
4. **LT:** the same identity turns a toggle X⊗Z_flag in echo with the analyzer into the mass kick of `KOIDE_SOURCE.md` (algebra only, not executed). Test whether one toggle amplitude serves both clocks.
5. **Audit team:** the candidate event is R8's public-type reflector, with the two record states of the C object as ports and the pair's flag parity as record, run at the C object's address orientation.
