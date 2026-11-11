## RESULT

**(a) Repair-law selection: the source selects the zero-selector law, τ2 = δn = 0 (W 80.33006 GeV).** The carrier value law is excluded. The same principles also fix the hypercharge slice under both laws, at zero. So the chart the source supports is the unsliced one: W 80.33006, Z 91.58834 GeV (tree chart, MZ = Q0 exactly), which is what the SMDR branch already feeds.

**(b) VEV attachment: v is attached at zero momentum transfer, G_F = 1/(√2 v²), where it does not run.** Both Q0 (SMDR branch) and m_t (D11 engine) are readouts that use v; neither is where the source attaches it. In SMDR's terms this is v(Q0) = 248.74827 GeV, i.e. the running v at 200.736 GeV equals v_source (P_fwd).

### 1. The laws and the theorem, as the producers state them
- **Common base:** both laws start from the slice αY* = αY(1 − 2η), with η = α_U β and β = cos 2θ_W0 = (α2 − αY)/(α2 + αY). They then deform by (τ2, δn):
  - α2' = α2(1 + τ2)
  - αY' = αY* + αY(8ητ2² − τ2)/(1 + 4τ2²) + (α2 + αY)δn
  - MW = v√(π α2'), MZ = v√(π(α2' + αY'))
- **Carrier law:** τ2 = −λC2, δn = λCn, with λ = η²/(4β), C2 = 1 + (2/3)η + (1 − β/6)η², Cn = 1 + (4/3)η + (2 − β/6)η².
- **Rigidity theorem:** the relative-entropy minimizer under the emitted moments is a unique Gibbs law. Its selection gap is D(ν‖m) − D(μ*‖m) = D(ν‖μ*) ≥ ‖ν − μ*‖₁²/2. The only emitted moment is E[X] = (P − φ)/√π; the Standard-Model moment vector is absent.
- **New exact identity:** the archived selector J10 is the population selector J_pop_EW pulled back through the mass-pair chart, where J_pop_EW = Π_WW² + det(Π_neutral)² + (tr Π_neutral/2 + η)². On the chart, Π_WW = τ2. At the carrier point J_pop = 3.1204e-7.

### 2. Verdicts on the law-selection candidates

| Id | Principle | Verdict | Basis |
| --- | --- | --- | --- |
| LA1 | Repair execution | derived, conditional on J_pop | The seam pump is the identity on the agreeing states {\|00>, \|11>, \|+>} (exact), so it cannot move a point where J_pop = 0. |
| LA2 | One value per coupling | carrier law excluded (exact) | Its α2' breaks the pixel closure by 8.92e-5 at P_fwd. Every τ2 ≠ 0 member of the (c, d) family falls with it, including the colour-balanced one. |
| LA3 | Observer record reading | excluded as a selector | The record model's Gaussian readback returns the stored coordinate, so it acts the same on both laws. Selecting by reading would need measured W and Z. |
| LA4 | Projection with the moments the source emits | derived (one premise argued) | No source object emits a moment along (τ2, δn) or along the slice, so their multipliers are zero (exact finite check). |
| LA5 | C10 carrier as the SM moment vector | excluded (exact) | The Z6 centre acts trivially on every SM field and gauge adjoint, so the trace on the vacuum-polarization chart is 1, not 1/6. MAUD shows the coefficients were fitted. |
| LA6 | Z-scale self-consistency | both laws excluded, through the slice | MZ − μ_Z is −0.4692 GeV (zero law) and −0.4641 GeV (carrier law); it is 0 for the unsliced chart. |

### 3. The hypercharge slice (OM note N4)

**Where it enters** (RER at the new path, HEAD 22478211a).
- It is defined in two places:
  - `code/particles/calibration/derive_d10_ew_source_transport_pair.py:65` (`compact_eta = alpha_u * cos2_theta_w0`, with σ = −η and τ_Y = −2η);
  - `code/particles/calibration/derive_d11_forward_seed.py:58` (the same η divided by √π, which moves m_t and m_H on the D11 declared calibration surface).
- It is selected by J_pop's third term. `derive_d10_ew_population_evaluator.py:46` writes η_source as α_u_from_seed·β, but α_u_from_seed equals α_U identically (symbolic residual 0), so this adds no independent information.
- Both laws consume it:
  - `derive_d10_ew_target_free_repair_value_law.py:90` uses αY*, and η sets the carrier law's λ, C2 and Cn;
  - `derive_wzh_residual_elimination_boundary.py:200` and `derive_d10_repair_tuple_selection_theorem.py:102` use it as well.
- Other consumers: the D11 top and Higgs promotion scripts, the conditional electroweak prediction envelope, and one quark candidate (`p_driven_flavor_candidate.py:142`).
- The SMDR branch and the criticality lane do not use it.

**Provenance** (my own read-only git check; it confirms MAUD).
- The first commit containing the slice is 0ac276683 (2026-03-29 13:46 +0700).
- Three days earlier, 13d5b69ca recorded Z = 91.6524603 against a reference of 91.1880 ± 0.0020 (a gap of +0.4645 GeV) and W = 80.3862917.
- The slice commit itself shows W 80.377 and Z 91.1879781 as calibration rows with zero residual.
- At the pixel of that time (P = 1.63094) the slice moves Z by −0.46956 GeV, which is 101.1% of the recorded gap (−5.07 MeV left), and leaves W unchanged.
- It is therefore target-informed, by timing and by size.

**Does the law-selection derivation also fix it? Yes, at zero.**
- **No emitted moment (LA4):** no executable package emits η_source (LEW's census searched for that exact name and found no emitter).
- **Z-scale law (LA6):** with the slice, the chart's Z misses the source's own Z-mass readout by −0.4692 GeV.
- **Thomson outer map (LA2):** it reads the unsliced couplings. With the slice its input would move from 136.9948 to 141.5693, giving G(P_fwd) − P_fwd = −4.18e-4, so P_fwd would no longer be a fixed point.
- **No route leads to the nonzero value:**
  - The slice's term 2η sin²θ = 0.01022 uses gauge couplings only. The same packet's one-loop custodial term, 3y_t²/(32π²) = 0.00880, depends on the top Yukawa instead; the two share no factor.
  - The closure reads only SU(2) and SU(3) (every U(1) representation has log d = 0). That picks out the hypercharge direction but supplies no magnitude, and an unconstrained direction stays at zero.

### 4. Verdicts on the attachment candidates
- **Only one source statement defines v:** the transmutation formula (alpha paper, line 375), with no scale and no low-energy coupling. The Z-scale law (lines 418, 426) and the D11 readout (lines 210, 222) use v. The Q0 attachment is declared, and its spec says "not a source theorem".
- **The theory's text names the record:**
  - book chapter 28, line 143: "Its size is the reference's stiffness ... The strength of the weak interaction fixes it";
  - chapter 33, line 63, calls the transmutation output that stiffness, 246.22 GeV.
- **Exact tree identity:** both the charged-current and neutral-current amplitudes equal 1/(2v²) at q² = 0, whatever the couplings. MW, MZ, m_t and MH each contain a coupling.
- **Imported fact:** G_F does not run under QED.
- LB4 (Fermi) passes all three criteria I fixed before computing. The other candidates fail:
  - Q0, m_t, top pole, Higgs pole and W pole are readouts that use v together with a coupling.
  - μ = v, E_cell and M_U have no source record behind them.
- **Side fact:** the audit's "v(172.4 GeV) = 246.60030" is just the input line of SMDR's own `ReferenceModel.dat` (Q_in = 172.4), a model fitted to data.

### 5. Comparison with measurement (NOT BLIND, run once after all source values were on file)
- v_source = 246.59675 GeV against v_F = 246.21964 GeV: **+0.153%**.
- The derived configuration (unsliced couplings, G_F attachment, declared criticality scale), evaluated with SMDR:

| | W | Z | H | t |
| --- | --- | --- | --- | --- |
| Value (GeV) | 80.53911 | 91.36191 | 125.84492 | 171.98782 |
| Residual | +0.220% | +0.191% | +0.571% | −0.065% |

  W/Z = 0.88154 against 0.88128 measured.
- Other attachments, none derived (residuals W/Z/H/t):

| Attachment | W | Z | H | t |
| --- | --- | --- | --- | --- |
| Q0 | −0.631% | −0.663% | −0.231% | −0.866% |
| m_t, running (162.0 GeV) | −0.0005% | −0.030% | +0.364% | −0.273% |
| Top pole (171.73 GeV) | +0.060% | +0.031% | +0.421% | −0.215% |
| Higgs pole | −0.28% | −0.31% | +0.10% | −0.53% |
| W pole | −0.80% | −0.83% | −0.39% | −1.02% |

  The best row (m_t, running) is not derived and carries no evidential weight.
- Strict tree chart: unsliced W −0.040%, Z +0.439%, W/Z 0.87708. With the slice, Z −0.075%. The slice reproduces SMDR's radiative W/Z for the unsliced packet to 2.8e-5; on this branch it acts as a stand-in for the Standard-Model radiative correction.

## EVIDENCE
Everything is in `work/LW/`. Each script runs as `PYTHONDONTWRITEBYTECODE=1 /tmp/oph-completion-venv/bin/python <script>`.
- `CANDIDATES.md` was written at 23:23, before any computation. Addendum 1 (slice rows LS1 to LS5) was added at 23:43, before those checks ran; current sha256 `c0bd7b35...`.
- `lw_a_exact.py`: pullback identity, J_pop terms, seam pump, projection check, Z6 traces.
- `lw_a_chart.py`: closure, Z-scale law and Thomson map on the three charts, using the producer's own functions.
- `lw_slice.py`: census of where the slice is defined and used, the seed-route identity, the structure comparison, closure blindness, and git provenance with the legacy-pixel shift (about 5 minutes).
- `lw_b_exact.py`: tree identity and the file:line census of every statement that uses v.
- `lw_b_attach.py LB1|LB3|LB4|LB7|LB8`: SMDR runs using LEW's compiled binaries, inputs written to `smdr_work/`. LB1 reproduces LEW's A1 row and LB4 reproduces LEW's control F to every digit.
- `lw_b_equiv_and_gate.py`: the 200.736 GeV equivalent scale, plus a tool check that SMDR's G_F output matches its reference value to 2.8e-5.
- `lw_compare_not_blind.py`: the single comparison.
- **RER paths:** I read the old path at f21f461d5 until it vanished at about 23:17, then LEW's copy `/tmp/claude-501/lew_repo` (5c7a8281b), then the new path `reverse-engineering-reality` (22478211a) for the slice checks. I moved nothing.

## WHAT THIS DOES NOT ESTABLISH
- Every selection is relative to the declared D10 reference chart: its forms, the slopes DB finds absent from the source, P_fwd and E*. No W or Z value becomes source-only.
- LA4 assumes the repair directions are independent of the emitted moments (argued). Its "no emitter" rests on a search of the corpus. An emitted chart moment, if the Standard-Model moment vector work produces one, would change the answer.
- LA1 depends on J_pop, which is declared and contains the slice parameter η.
- The slice exclusion treats the chart's MZ and the Z-scale law's m_Z as the same tree Z mass, which is the paper's own wording. Read as part of the pole map instead, the slice belongs to the open BRST pole packet, where SMDR's Standard-Model corrections replace it.
- Part (b) rests on the book's identification (narrative text, not a theorem), an exact tree identity and an imported QED fact. It does not derive the value of v.
- The SMDR rows inherit the criticality scale chosen after exposure and SMDR truncations without certified error bounds.
- The colour measure 1/3 and four-slot measure 1/4 were not tested.

## NEXT
1. **(a):** only an emitted electroweak chart moment (the executable law's gauge response read on the D10 chart) could move the selection, the slice included. Until one exists, the strict-branch rows should read W 80.33006, Z 91.58834 GeV, or carry the slice as a named target-informed item. The D11 declared calibration surface inherits the slice through `derive_d11_forward_seed.py:58`.
2. **(b):** the SMDR branch, and the frozen comparison in S18, should attach v through G_F. Q0 then serves only as the hand-over scale for the gauge packet.
3. **The 0.153% excess of v_source over v_F** belongs to the transmutation chain (S14, plus the slope and b_above lanes): about dR = −0.0077 in R(P) on the producer's chain.
