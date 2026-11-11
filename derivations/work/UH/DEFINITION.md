# Worker UH: the unbounded class-3 register on CF-1 (definition, written before any computation)

Written 2026-11-11 08:20 (+07). Rules: `RL/CAMPAIGN.md`. Labels: EXACT, MEASURED, ARGUED, IMPORTED, DECLARED.
Inputs read: `reports/HT.md`, `R8.md`, `SS.md`, `DR.md`, `GL.md`, `DB2.md`, `DB3.md`, `candidates/CF1.md`,
`work/R8/r8_toggle.py`, `work/GL/s3_gauss.py`, RER `model/coherent_defect_wave/chiral_higgs/model.py`
(`higgs_memory`: five states, fields `phi_k = |0><1+k| + |3+k><0|`, energy `number = diag(0,1,1,1,1)`).

## 1. Register

Per cell x of the cubic family of carriers, four oscillators: for each doublet index k in {1, 2} (the code's doublet
levels s1, s2; k = 2 is the neutral level) one oscillator per flux orientation,

- `a_{x,k}` (orientation +3): its quantum carries the charges of level s_k: colour singlet, weak doublet, 6Y = +3,
  Z2 charge 1, phase charges N_j = e_{3+k}, determinant weight +1 (R8, result 2);
- `b_{x,k}` (orientation -3): its quantum carries the conjugate charges.

Canonical commutators `[a_k, a_l^dag] = [b_k, b_l^dag] = delta_kl`, all others zero. Space of one cell: the Fock space
of the four oscillators. Statistics: bosonic, one register per cell, shared by the copies (SS).

Lowering operator (R8's b_k): `B_{x,k} = a_{x,k} + b_{x,k}^dag`. It lowers the register's charges by those of level
s_k (it removes a +3 quantum or adds a -3 quantum).

## 2. Statements to verify (script `uh_register.py`)

- D1. `[B_k, B_l^dag] = 0`: B is normal, so R8's Higgs-state condition (common eigenvector of B and B^dag) has a
  solution for every complex doublet beta (HT, repeated here for the doublet).
- D2. Truncation to total occupation at most one gives the audit's five-state memory: `P_1 B_k P_1 = phi_k`, and the
  oscillator energy `N = sum(a^dag a + b^dag b)` restricts to the audit's `number`. Truncation to b = 0 and occupation
  at most one gives R8's three-state register.
- D3. Charges. For a generator T of G = S(U(3) x U(2)) with doublet block t:
  `Q_reg(T) = sum_kl a_k^dag t_kl a_l - b_k^dag t_lk b_l`, so that `[Q_reg(T), B_k] = -sum_j t_kj B_j` (the audit's
  commutator of `higgs_memory`).
- D4. Toggle (R8's vertex): `V_x = sum_k (c^dag_{x,s_k} B_{x,k} + B^dag_{x,k} c_{x,s_k})`, c the level operators of
  the pattern at x. Claim: `[V_x, dGamma_x(T) + Q_reg,x(T)] = 0` for the twelve T. On a Higgs state with eigenvalue
  beta the mass step `exp(-i g V)` acts on the pattern as `exp(-i g (beta.c^dag + h.c.))`: mass angle g |beta|.
- D5. Transport: `T_xy = sum_kl B^dag_{x,k} U^(2)_kl B_{y,l} + h.c.`, U^(2) the doublet block of GL's link (truncated
  Peter-Weyl register of `work/GL/s3_gauss.py`). Gauss law with the five-level code and GL's links:
  `G_x(T) = dGamma_x(T) + Q_reg,x(T) + L(T)` on the link's source end, `R(T)` on its target end. Claim:
  `[V_x + T_xy + E_el + omega N, G_x(T)] = 0` and the same for G_y, for the twelve T (executed on two cells, one
  link, oscillators truncated, commutators evaluated on states below the truncation edge).
- D6. Z2 version (R8, result 2): `G_x = prod X(links at x) (-1)^(n2 of the quanta at x) (-1)^(N_a + N_b)`;
  `(-1)^(N_a+N_b)` anticommutes with every B_k.

## 3. Hamiltonian per cell and what is open

Quadratic part (DECLARED form, coefficients open): `omega N_x - kappa sum_links T_xy`. In field variables
`Phi_k = B_k / sqrt(2 omega)`, `Pi_k = i sqrt(omega/2) (a_k^dag - b_k)`: `omega (N + 2) = Pi^dag Pi + omega^2 Phi^dag Phi`.
The audit's memory has kappa = 0 (no hop, NU3) and is a static memory with energy omega per quantum. A light field
needs the on-site stiffness to cancel against the hop (the hierarchy, lanes LW and SC; not this worker's item).

The item of this worker: the coefficient of `(Phi^dag Phi)^2` at the cell, lambda(E_cell) in the convention
`V = lambda |H|^4`, `m_H^2 = 2 lambda v^2` (the convention of the D11 engine and of SMDR's `lambda`).
In occupation language a quartic is an energy of two quanta on one cell beyond twice the energy of one:
`U_2 = E(2) - 2 E(1) + E(0)`. The bounded registers (R8's, the audit's memory) are the limit U_2 = infinity.
