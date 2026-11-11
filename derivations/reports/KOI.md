# KOI report: effective mass matrices on three copies, against the Koide circulant

Task KOI (simulation session, 2026-11-10). Scripts and results: `work/SIM/koide/` (`koide_lib.py`, `koi_carrier.py`,
`koi_band.py`, `koi_second.py`, `koi_second_scan.py`, `koi_cones.py`, `koi_cones_engine.py`, `koi_cones_counts.py`,
`koi_cones_counts_cov.py`, `koi_two_ninths.py`, `koi_two_ninths_shift.py`, `koi_summary.py`; all numbers in
`koide.json`, regenerated in one pass by running the scripts in this order). Sections are appended in the order the
parts finished. Labels: EXACT (exact arithmetic over Q(sqrt5, sqrt-3) or Q(i), or a closed form),
MEASURED (float64 or executed tick, residual given), ARGUED (written argument). Nothing below was tuned toward the
measured masses; the lepton values (Q = 0.6666645, delta = 0.2222248, `reports/LIT.md` B2) are used only for readback.

## Conventions (EXACT)

- Three real numbers l_k (eigenvalues of a copy matrix) are written l_k = a + 2|b| cos(delta + 2 pi k/3), a = mean.
  Then sum (l - a)^2 = 6|b|^2, sum (l - a)^3 = 6|b|^3 cos 3delta and Q = sum l^2 / (sum l)^2 = 1/3 + (2/3)|b|^2/a^2.
  Q = 2/3 if and only if |b|/a = 1/sqrt2. The consensus weight of lead L40 is w = 1/(3Q); 1/2 is balance.
- delta is defined modulo 2 pi/3 and up to sign; the canonical value is delta in [0, pi/3] with 3 delta = arccos(cos 3delta).
  For a circulant a + bP + conj(b)P^2 (P the cyclic permutation of the copies) the canonical delta is arg b reduced
  the same way, so delta is a spectral invariant: cos 3delta = tr((M - a)^3) / (6|b|^3).
- Two readings of the eigenvalues of a copy matrix: "sqrt" (the eigenvalues are sqrt m, the reading of the task) and
  "mass" (the eigenvalue is the rest phase, which is the mass in tick units, so sqrt m = sqrt l). Both are reported.
- Lemma 1 (EXACT). Three rational numbers, not all zero, never have Q = 2/3. Proof: scale to integers n_k with sum s;
  Q = 2/3 means 3 sum n^2 = 2 s^2, i.e. x^2 + xy + y^2 = s^2/2 with x = n_1 - n_2, y = n_2 - n_3. The left side is a
  Loeschian number. So s = 2k and 2k^2 must be Loeschian, but the prime 2 (= 2 mod 3) occurs in 2k^2 to an odd
  power. Hence k = 0, s = 0, x = y = 0, n = 0.
- Lemma 2 (EXACT). If all entries of a Hermitian copy matrix are algebraic numbers (any number field: Q(sqrt5), the flux
  phases exp(2 pi i k/6), the spin lifts in Q(i)), then cos 3delta is algebraic. cos(2/3) is transcendental
  (Lindemann-Weierstrass: exp(2i/3) is transcendental, and cos(2/3) algebraic would make exp(2i/3) a root of
  z^2 - 2cos(2/3) z + 1). So delta = 2/9 (in any of its equivalent forms +-2/9 + 2 pi k/3) is impossible for every copy
  matrix with algebraic entries. Q = 2/3 is not excluded by Lemma 2 and is tested case by case.

## Part 1. Copy space G-a: the band resolved along the frame axes (`koi_band.py`, key `G-a`)

Copy space: the rank-three band of the carrier (adjacency sqrt5), in the basis of the three axes of the fixed cubic
frame. The eight thirds of a turn of the frame stabilizer act on it as signed cyclic permutations; the turn about
(1, 1, 1) is the cyclic permutation P, so this basis is the third-turn-covariant basis. A port operator O acts on the
band as V^T O V / (4(phi + 2)). EXACT checks: adjacency = sqrt5 times 1 on the band; uniform port operator = 1; the
frame group acts freely on the ports.

(i) Uniform rest angle. Copy matrix theta times 1: a = theta, b = 0, Q = 1/3, delta undefined. EXACT.

(iv) Carrier walk as mass step (M3). The band is one eigenspace of the walk: copy matrix (11/12 + sqrt5/60) times 1,
mass angle 0.304708 for all three copies. b = 0, Q = 1/3. EXACT.

(ii) Point source and a few. A load on port p acts on the band as (1/4) n_p n_p^T: eigenvalues 1/4, 0, 0, Q = 1 (one
massive copy). No port lies on a three-fold axis, so one port is never third-turn covariant. For every one of the 4095
sets S of ports with unit loads, Q = (|S|^2 + 4|S| + 8A)/(5|S|^2) with A the number of antipodal pairs in S (EXACT,
derived from (n_p . n_q)^2 in {1, 1/5}; checked on all 4095 sets and against the exact band compression on 40 of them).
Q = 2/3 would need 7|S|^2 - 12|S| = 24A, which has no solution with 1 <= |S| <= 12, 0 <= A <= |S|/2: no port set gives
Q = 2/3 (EXACT). The 21 values that occur run from 1/3 to 1; the nearest to 2/3 are 29/45 = 0.6444 and 3/5. In the mass reading
the nearest value is 0.542513 (three ports, one antipodal pair; float64).

Third-turn-covariant port sets (unions of the four orbits of the turn about (1,1,1): two faces, two belt triples),
circulant parameters in the covariant basis (EXACT):

| port set | a | b | abs(b)/a | delta | Q |
| --- | --- | --- | --- | --- | --- |
| one face | 1/4 | sqrt5/20 | 1/sqrt5 | 0 | 7/15 |
| one belt triple | 1/4 | -sqrt5/20 | 1/sqrt5 | pi/3 | 7/15 |
| two faces, or two belts | 1/2 | +-sqrt5/10 | 1/sqrt5 | 0 or pi/3 | 7/15 |
| a face and a belt | 1/2 | 0 | 0 | | 1/3 |
| three orbits | 3/4 | +-sqrt5/20 | 1/(3 sqrt5) | 0 or pi/3 | 47/135 |
| all twelve | 1 | 0 | 0 | | 1/3 |

Load operators are real, so b is real and delta is 0 or pi/3: two copies are always equal.

For comparison, the port responses of worker T5 (rank-one projectors on a circular state about each port; tr R_p R_q =
(1 + n_p . n_q)^2/4 in Q(sqrt5)): no set of ports gives Q = 2/3 (EXACT, all 4095 sets). The face sum is T5's circulant
a = 1, abs(b) = (5 + sqrt5)/10, delta = pi/15 = 0.209440, Q = (8 + sqrt5)/15 = 0.682405 (reproduced, float64); the belt
triple gives delta = pi/5, Q = 0.384262; a face with a belt triple gives delta = pi/6, Q = 0.379399.

(iii) Flux pair on the carrier. Flux +alpha on face f1 and -alpha on face f2, string along a shortest dual path
(convention of `family/family_band.py`), all 380 ordered face pairs and alpha = 1/6, 1/3, 1/2: the spectrum depends only
on (alpha, separation) (15 classes; EXACT matrices, levels at 40 digits; equal to `family_band.json` to 7e-15). The copy
levels are the three eigenspaces with the largest band weight. The first-order band compression of the string is gauge
dependent (two shortest strings give different 3 x 3 matrices at separation 4) and far from the exact levels at large
separation (alpha = 1/2, d = 5: compression 1.764, 4.382, 4.382 against levels 0.878, 3.816, 4.586), so the copy matrix
is given by its exact levels. A pair is fixed by a third-turn of the frame only at separation 5 with both faces on a
body diagonal of the frame (4 of the 10 antipodal pairs); only these give a turn-covariant copy matrix.

| alpha | d | copy levels (cost) | Q costs | Q rest phases, sqrt | Q rest phases, mass | delta rest phases | turn-covariant |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/6 | 1 | 2.541506, 2.763932, 3.004846 | 0.334888 | 0.333729 | 0.333432 | 0.5124 | no |
| 1/6 | 3 | 2.222618, 2.818488, 3.290018 | 0.341578 | 0.335485 | 0.333878 | 0.6174 | no |
| 1/6 | 5 | 2.103842, 2.890154, 3.408138 | 0.345552 | 0.336588 | 0.334165 | 0.6728 | yes |
| 1/3 | 1 | 2.363981, 2.763932, 3.237552 | 0.338799 | 0.334727 | 0.333682 | 0.4970 | no |
| 1/3 | 5 | 1.459844, 3.254571, 4.018264 | 0.378573 | 0.347141 | 0.337079 | 0.8016 | yes |
| 1/2 | 1 | 2.290725, 2.763932, 3.355148 | 0.341376 | 0.335387 | 0.333847 | 0.4863 | no |
| 1/2 | 4 | 1.171573, 3.267949, 4.585786 | 0.406126 | 0.356785 | 0.339845 | 0.7321 | no |
| 1/2 | 5 | 0.877514, 3.816211, 4.585786 | 0.422288 | 0.366850 | 0.343326 | 0.9006 | yes |

All 15 rows are in `koide.json`. Rest phase = arccos(1 - lambda/60) of the carrier walk. Over all classes: Q of the
costs 0.3349 to 0.4223, of the rest phases 0.3337 to 0.3669 (sqrt reading) and 0.3334 to 0.3433 (mass reading); delta of
the rest phases 0.486 to 0.901. The middle copy stays at 5 - sqrt5 at separations 1 and 2 for every alpha. Two
irregular cases (MEASURED from the exact matrices): at alpha = 1/2 and separation 5 every level is doubly degenerate,
so each copy level is a pair (band weights 0.928, 0.845, 0.869 per pair); at alpha = 1/2 and separation 4 the heaviest
copy is split between the levels 4.406728 (band weight 0.460) and 4.585786 (0.543), so the copy picture is ambiguous
there (the table uses 4.585786).

Reading (ARGUED from the EXACT numbers). The flux pair splits the band by a fraction of its common level 5 - sqrt5, so
abs(b)/a stays between 0.048 and 0.365 (costs) and Q stays near 1/3. No source on the band gives Q = 2/3. Every band matrix has
entries in Q(sqrt5, sqrt-3), so by Lemma 2 none has delta = 2/9; the rest phases (arccos of algebraic numbers) give
delta between 0.486 and 0.901 (MEASURED from the closed forms). The natural phase closest to 2/9 = 0.2222 is T5's face
sum of responses, delta = pi/15 = 0.2094, with Q = 0.6824.

## Part 2. Copy space G-e: the second index of the regular representation (`koi_second.py`, `koi_second_scan.py`; keys `G-e`, `G-e scan`)

Copy space: with the frame fixed, port g.p0 is the group element g (p0 = (0, 1, phi)); the triplet sector of the port
space has the basis |i, j> = (1/2) sum_g D(g)_ij |g.p0>. The left index i carries the rotations, the right index j is the
second index (the three copies). EXACT checks: the basis is orthonormal; the adjacency acts as 1 (x) M3 with
M3 = [[-1,0,0],[0,-1,2],[0,2,1]] (the DESIGN.md form, for this base port); the right action of the third-turn about
(1,1,1) acts on j as the cyclic permutation P, so the frame-axis basis of the second index is the covariant basis.

(i) Uniform rest angle: theta times 1, Q = 1/3. EXACT.

(iv) Carrier walk as mass step (M3). The copy matrix is the kernel 1 - (5 - M3)/60, or as a mass matrix arccos of it.
No third-turn of the frame commutes with M3 (EXACT), so it is not a circulant in the covariant basis: its circulant
part is -1/3 + (2/3)(P + P^2) and the rest carries 0.853 of the norm (for the arccos matrix: a = 0.417311,
b = -0.028546, rest 0.167). Koide parameters of the three copies (EXACT where algebraic):

| copy values | Q (sqrt reading) | delta | Q (mass reading) |
| --- | --- | --- | --- |
| adjacency sqrt5, -1, -sqrt5 | 11 (signed; 0.367349 with absolute values) | (1/3) arccos(11/16) = 0.270919 | no reading (negative) |
| costs 5 - sqrt5, 6, 5 + sqrt5 | 3/8, abs(b)/a = 1/4 | (1/3) arccos(-11/16) = 0.776279 | 0.345818 |
| kernel levels 11/12 -+ sqrt5/60, 9/10 | 561/1681 = 0.333730 | 0.270919 | |
| mass angles 0.304708, 0.451027, 0.496198 | 0.346119 | 0.819602 | 0.336795 |

(ii) Point source and a few. The load on port g, seen by a particle with left state v, acts on the copies as
(1/4) w_g w_g^T with w_g = D(g)^T v: rank one. Averaged over the left index it is (1/12) times 1 (EXACT), so for an
unoriented particle every port set gives a scalar, Q = 1/3. For a left state on a frame axis, w_g = +-e_k and a port
set gives (1/4) diag(n_1, n_2, n_3) with integer counts: Q takes 21 rational values (among them 5/8, 17/25) and never
2/3 (Lemma 1; EXACT, all 4095 sets and three axes).

Scan over the left state along every symmetry axis of the carrier (6 port axes, 10 face axes, 15 edge axes) and all
4095 port sets, exact test of 3 tr C^2 = 2 (tr C)^2 in Q(sqrt5): Q = 2/3 occurs in exactly 144 of the 126,945 cases,
all of one kind (EXACT):

- the left state lies on one of the four body diagonals of the frame (a face axis on the third-turn axis); then w_g runs
  over the four diagonals s_t of one tetrahedron, three ports per diagonal (a face or a belt triple), and with
  multiplicities m_t the quotient is Q = (1/9)(1 + 8 sum m^2/(sum m)^2) (from s_t . s_u = -1, |s|^2 = 3);
- Q = 2/3 needs sum m^2/(sum m)^2 = 5/8, whose only solution with m_t <= 3 is m = (3, 1, 0, 0): the three ports of one
  class (a face or a belt triple) plus one more port, 36 sets per diagonal;
- copy matrix (1/12)(3 s_1 s_1^T + s_2 s_2^T), eigenvalues (3 + sqrt3)/6, (3 - sqrt3)/6, 0: a = 1/3,
  abs(b) = 1/(3 sqrt2), delta = pi/12 exactly. This is the spectrum of the balanced circulant at the node where the
  lightest copy is massless (lead L40: node at delta = pi/12);
- none of these matrices commutes with any third-turn (the pair {s_1, s_2} with weights 3 and 1 has no symmetry in the
  frame group); the balance comes from the integer counts 3 and 1 alone;
- mass reading: Q = 0.5505. In the sqrt reading the two massive copies have m_2/m_3 = (2 - sqrt3)^2 = 0.0718
  (NOT BLIND: m_mu/m_tau = 0.0595; m_e/m_tau = 2.9e-4 against 0).

(iii) Flux pair on the carrier. The flux pair acts on the left index as well, so the copies of one left state are not
conserved. Method: exact twelve-port levels, each level assigned to the copy (M3 eigenvector, any left state) or the
singlets that holds most of its weight (projections in the shortest-string gauge; MEASURED). In 7 of the 15 classes
every copy receives three levels; there the copy means give Q = 0.3700 to 0.3751 (costs) and 0.3444 to 0.3462 (rest
phases, sqrt reading), within 0.005 of the M3 values 3/8 and 0.3461. In the other 8 classes (alpha = 1/6 at d = 2, 4;
alpha = 1/3 at d = 1, 2, 3; alpha = 1/2 at d = 2, 4, 5) the flux pair mixes the copies (smallest assignment weight
0.36 to 0.50) and no three-copy matrix exists.

Reading (ARGUED from the EXACT numbers). On the second index the copy splitting is fixed by M3 (order one, no
hierarchy), and M3 has Q = 3/8 for the costs and 0.346 for the mass angles. The one exact Q = 2/3 found is the
four-port family above: it needs a particle oriented along a body diagonal, it sits at delta = pi/12 with a massless
copy, and it has no third-turn covariance. All matrices of this part have entries in Q(sqrt5) or Q(sqrt5, sqrt-3),
so by Lemma 2 none has delta = 2/9. The natural phase of the kernel is (1/3) arccos(11/16) = 0.2709.

## Part 3. Copy space G-b: the four cones of the two-tick period (`koi_cones.py`, `koi_cones_engine.py`, `koi_cones_counts.py`; keys `G-b`, `G-b engine`, `G-b counts`)

Copy space: on one body-centred lattice, the rest states of the period are the plane waves exp(i K.x) on the even
cells and on the odd cells, K in {0, K1, K2, K3}, times the coin (record, spin). EXACT: at the cones the forward tick
is 1_record (x) a_K with a_K = 1, i sigma_1, -i sigma_2, i sigma_3; it maps the even copy K to the odd copy K. The
third-turn about (1, 1, 1), W: psi(x) -> u psi(R^-1 x) with u = (1 - i(sigma_1 + sigma_2 + sigma_3))/2 (u^3 = -1), maps
K1 -> K2 -> K3. The turned program (axis order 2, 3, 1) has the forward tick u a_(R^-1 K) u^dagger = Z_K a_K with
Z = (1, 1, -1, -1) on (0, K1, K2, K3) (EXACT). So the turn acts on the even copies as W and, carried through one tick,
as ZW: two different actions, which is the statement of R1 that the turn is no symmetry of the alternating tick, seen
on the copies.

Effective copy matrix (EXACT, first order in the source angles). With mass angles theta_x on cells, the period on the
even rest space is 1 - i Y_record (x) M with

    M = sum_(even x) (theta_x/N) s(x) s(x)^T (x) 1_spin + sum_(odd x) (theta_x/N) w(x) w(x)^dagger,
    s_K(x) = exp(i K.x) = +-1,  w(x) = sum_K s_K(x) |K> (x) a_K^dagger,

N the number of even cells; phases per tick are the eigenvalues of M/2, each twice (spin) and with both signs. M is a
4 x 4 matrix of quaternions (entries real combinations of 1 and i sigma_k), so its eigenvalues come in spin pairs, and
it depends on a cell only through its class (parity, kind of the period-four pattern). Engine check (MEASURED, 8^3,
one body-centred lattice, half-step frame, `cf1_lib.Engine`): the first-order operator on the 32 rest states equals
Y_record (x) M to 2e-8 (finite difference 1e-6) in six configurations; at the source angle 0.171237 the lifted phases
per tick differ from first order by at most 0.2% (one source 0.0053597 against 0.0053512; one even plus one odd
0.0026802 and 0.0080241 against 0.0026756 and 0.0080267, which are the values of `family/rank_one.json`).

Sources (levels of M in units theta/N per period; Q3 for the three axis cones = the 3 x 3 quaternion block with the
origin cone deleted; Q4 for the four cones; all EXACT):

| source | four-cone levels | Q4 | axis-cone levels | Q3 | delta (axis) | turn-covariant |
| --- | --- | --- | --- | --- | --- | --- |
| (i) uniform angle, every cell | 2N each (theta per tick) | 1/4 | 2N each | 1/3 | | yes |
| (ii) one cell, any class | 4, 0, 0, 0 | 1 | 3, 0, 0 | 1 | 0 | E0, O2 under W; E2, O0 under ZW: a = 1, b = U_A or U_B, abs(b) = 1, arg b = 2 pi/3 |
| two cells, same class | 8, 0, 0, 0 | 1 | 6, 0, 0 | 1 | 0 | as one cell, doubled |
| two even cells, different kinds | 4, 4, 0, 0 | 1/2 | 4, 2, 0 | 5/9 | pi/6 | no |
| one even and one odd cell | 6, 2, 0, 0 | 5/8 | 3 + sqrt3, 3 - sqrt3, 0 | **2/3** | **pi/12** | E0 + O2 (W), E2 + O0 (ZW): a = 2, b = -(1 + i sigma_1), abs(b) = sqrt2, arg b = 3 pi/4; the other 14 pairs no |
| three even cells, three kinds | 4, 4, 4, 0 | 1/3 | 4, 4, 1 | 11/27 | pi/3 | E1 + E2 + E3 (W), E0 + E1 + E3 (ZW): a = 3, b = -U_A, arg b = pi/3 |
| two even (two kinds) and one odd | 6.8284, 4, 1.1716, 0 | 4/9 | 5.7785, 2.7108, 0.5107 | 41/81 | 0.4288 | no |
| two even (one kind) and one odd | 6 + 2 sqrt3, 6 - 2 sqrt3, 0, 0 | 2/3 | 7.3723, 1.6277, 0 | 19/27 | 0.2117 | E0 + E0 + O2, E0 + O2 + O2 (W) and mirrors (ZW): a = 3, abs(b) = sqrt5, cos arg b = -3/(2 sqrt5) |
| (iii) flux pair on a carrier | as (ii) with theta = rest angle of the class (defect_phases.json) | | | | | |
| (iv) carrier walk (M3) on every carrier | as (i) with theta = 0.304708 ... 0.585686 | | | 1/3 | | yes |

General formula (EXACT, from the Gram matrix of the eight classes: tr B_c = 6, tr B_c B_c = 18, tr B_c B_d = 2 within
a parity and 6 across): for n_c equal-angle sources in class c, S_E and S_O the even and odd totals, S = S_E + S_O,

    Q3 = (16 sum n_c^2 + 2 S_E^2 + 2 S_O^2 + 12 S_E S_O) / (18 S^2),

so Q3 = 2/3 exactly when 16 sum n_c^2 = 10 S_E^2 + 12 S_E S_O + 10 S_O^2. Scan of all 125,969 count vectors with
S <= 12: 296 solutions; 168 of rank two (one even and one odd source, or multiples, delta = pi/12) and 128 of rank three,
first at 10 sources (seven on one even kind and one on each of three odd kinds, levels 24.0905, 4, 1.9095,
delta = 0.085450; 32 vectors) and at 12 sources (delta = 0.175718; 96 vectors). For one even and one odd source with
different angles t_E, t_O: Q3 = 1 - (4/3) t_E t_O / (t_E + t_O)^2, which is 2/3 only for t_E = t_O (EXACT; checked
numerically, e.g. the doublet and triplet angles 0.157935 and 0.215043 give 0.674481).

Why one even and one odd source balance (EXACT). On the axis cones the even source is the rank-two term s s^T (x) 1
with |s|^2 = 3, the odd source w w^dagger with w^dagger w = 3; their overlap is (1/3) sum_K s_K t_K a_K^dagger, a sum of
three anticommuting quaternion units, with squared norm 1/3. Two equal terms meeting at cos^2 = 1/3 have eigenvalues
3(1 +- 1/sqrt3) and Q = (1 + cos^2)/2 = 2/3. Lemma 3 (EXACT): a copy matrix of rank two has Q = 2/3 exactly when its
nonzero eigenvalues are in the ratio 2 - sqrt3, and then delta = pi/12 (from l^2 - 4 l l' + l'^2 = 0). The G-e family
of Part 2 is the same case with weights 3 and 1 meeting at cos^2 = 1/9: 6 w_1 w_2 (1 - cos^2) = (w_1 + w_2)^2.

Turn-covariant copy matrices (EXACT; covariance tested after simplification, full four-cone matrices and axis blocks
agree). Covariant basis on the axis cones: e_i = T'^i (|K1> (x) spin) with T' = -T, T = W or ZW (T'^3 = 1); there M is
the block circulant [[A0, B1^dagger, B1], [B1, A0, B1^dagger], [B1^dagger, B1, A0]] with A0 = a times 1 and B1 = b a
quaternion; its levels are a + 2|b| cos(arg b + 2 pi k/3) with arg b = arccos(Re b / |b|). Under W the covariant
sources are combinations of four blocks: an even cell on the turn axis (E0), an odd cell of kind 2 (O2), the even axis
orbit (E1 + E2 + E3) and the odd orbit (O0 + O1 + O3); under ZW the mirror set (E2, O0, E0 + E1 + E3, O1 + O2 + O3).
With angle t_A on E0, t_B on O2, t_C on each cell of the even orbit and t_D on each cell of the odd orbit:

    a = t_A + t_B + 3 t_C + 3 t_D,   b = x U_A + y U_B,   x = t_A - t_C,  y = t_B - t_D,
    U_A = -(1 + i(sigma_1 + sigma_2 + sigma_3))/2,   U_B = -(1 + i(sigma_1 - sigma_2 - sigma_3))/2,

two orthogonal unit quaternions (spin lifts of thirds of a turn about body diagonals, scalar part -1/2). So
abs(b)^2 = x^2 + y^2, cos(arg b) = -(x + y)/(2 sqrt(x^2 + y^2)) and Q3 = 1/3 + (2/3)(x^2 + y^2)/a^2. A source that is
geometrically turn invariant on both parities, E0 + O0 (both cells on the axis), gives a matrix that is covariant under
neither W nor ZW: the turn acts on the odd copies with the extra sign Z.

Lemma 3' (EXACT): on a copy matrix of rank two (lightest copy massless) Q and delta are tied,
Q = 1/3 + 1/(6 cos^2(delta + 2 pi/3)); delta = pi/12 gives 2/3, delta = 2/9 gives Q = 0.695325. So Q = 2/3 and
delta = 2/9 together need rank three.

Reading (ARGUED from the EXACT results). The cone copies are four, with handedness +, -, +, -, and the turn is no
symmetry of the tick; covariant copy matrices exist for the source patterns above, and their circulant b is a
quaternion built from third-turn spin lifts. A point-like source is rank one and democratic on the four cones.
Q = 2/3 on the three axis cones occurs for the most natural two-source configuration, one source on each parity with
equal angle, at the rank-two node: delta = pi/12 and a massless lightest copy, in the sqrt reading only (mass reading
Q = 0.5505), with the origin cone deleted by hand (on the four cones the same source gives Q4 = 5/8, levels 6, 2, 0, 0).
For two of the sixteen pairs (E0 + O2 and E2 + O0) the matrix is a covariant circulant: a = 2, abs(b) = sqrt2,
arg b = 3 pi/4, which is delta = pi/12 modulo 2 pi/3. Rank three at Q = 2/3 with equal angles needs at least ten
sources; among the 128 rank-three solutions up to twelve sources, four are covariant (for example 7 E0 + O0 + O1 + O3:
x = 7, y = -1, a = 10, abs(b) = 5 sqrt2, delta = 0.085450). In the covariant family Q = 2/3 is the condition
2(x^2 + y^2) = a^2 and delta = 2/9 a second condition on the same three weight ratios: both hold on a one-parameter
set of tuned source angles, which this task does not construct. With equal angles every first-order matrix is theta/N
times a Gaussian-integer matrix, so delta = 2/9 never occurs (Lemma 2).

## Part 4. The body-diagonal 2/9 and the third-turn (`koi_two_ninths.py`, `koi_two_ninths_shift.py`; keys `two_ninths`, `two_ninths_shift`)

1. Dispersion (EXACT, sympy series). For the massless period cos 2E = prod cos 2p_i, and at every one of the 32 rest
   points K the product prod cos 2(K_i + q_i) equals prod cos 2q_i identically: all copies share one dispersion
   function. Along a unit direction u, E = q (1 - (1/3)(1 - sum u_i^4) q^2 + O(q^4)) (symbolic difference 0): 0 on the
   axes, -1/6 along 110, -2/9 along 111 at all 32 rest points. The coefficient is the cubic harmonic (1/3)(1 - sum u^4)
   on the turn axis; it is invariant under all 48 signed permutations of the axes.
2. Two different 2/9 (EXACT). One ordered tick in an arrow sector chi is the D'Ariano-Perinotti body-centred Weyl
   automaton, cos w = c_1 c_2 c_3 + chi s_1 s_2 s_3. Along the diagonal w^2 = q^2 (1 - chi (2 sqrt3/9) q + ...) in cell
   units; in their units k = sqrt3 |p| this is (k^2/3)(1 - chi (2/9) k), the 2/9 of LIT.md B2. The alternating period
   cancels this odd term; its even coefficient, -2/9 per cell^2 (CQ run A), is -2/27 in the units k. So the two quoted
   2/9 are different coefficients in different units. A relative q^n coefficient scales as lambda^n under p -> lambda p;
   a phase in radians does not scale.
3. The third-turn is no symmetry of the period (EXACT). Linear equations for a constant 4 x 4 matrix V on record (x)
   spin, at four rational momenta (tan(p/2) rational, exact over Q(i)): V U2(p) = U2(Rp) V; V U2(p) = U2'(Rp) V with U2'
   the period that starts with the reverse tick; the inverse turn; the antiunitary forms V conj(U2(p)) = U2(-Rp) V and
   onto U2'. Each has only V = 0. The same holds for the turn and its inverse combined with every staggered phase
   exp(i K.x), K in {0, pi/2}^3, in unitary and antiunitary form (32 cases, only V = 0). Control: the half-turn about axis
   3 has a two-dimensional solution space. Since the half-turns are symmetries, none of the eight thirds of a turn of the
   frame is one. The spectrum is invariant under all 48 signed permutations, so an intertwiner exists for each p
   separately; no local one exists.
4. Obstruction (answer to the question).
   - (a) Trivial channel (EXACT). On any set of copies related by the turn (the axis cones, or momenta q, Rq, R^2 q),
     and at every rest point, the free tick contributes E(q) times 1, because its spectrum is a function on the cubic
     group and identical at all rest points. Adding a multiple of 1 changes a and leaves b, abs(b) and delta unchanged.
     The coefficient 2/9 sits in E(q), so it reaches a and never b or delta.
   - (b) Order (EXACT). delta is read off the copy matrix at q = 0; 2/9 multiplies q^3 in E. The first-order copy matrix
     of every source is built from the rest states at the cones (theta/N times Gaussian-integer matrices) and contains no
     dispersion coefficient.
   - (c) Arithmetic (EXACT). Lemma 2: algebraic copy matrices never have delta = 2/9. This covers every first-order
     cone matrix with equal angles and every carrier matrix in Q(sqrt5, sqrt-3).
   - (d) Units (EXACT). Item 2: the number 2/9 belongs to one choice of momentum unit; the radian has none.
   - (e) Symmetry (EXACT). Item 3: CF-1 has no third-turn, so a covariant copy matrix needs a declared turn-symmetric
     source, and (a) to (c) apply to it.
   - Beyond first order (ARGUED): the dispersion enters through real energy denominators of intermediate states, as
     weights of lattice sums; no step isolates its q^3 coefficient.
   So the body-diagonal 2/9 cannot enter a third-turn-covariant phase: it is a common level of the copies.
5. What the body diagonal does put into the copy matrices (EXACT): the forward tick at the three axis cones is three
   anticommuting quaternion units (phases between cones are multiples of pi/2); the spin lift of the turn has u^3 = -1
   and shifts circulant phases by pi/3; the overlap 1/3 of a scalar unit with the average of the three units (the
   squared cosine between an axis and a body diagonal) balances the even-odd source pair, Q = (1 + 1/3)/2 = 2/3, at rank
   two, where Lemma 3 forces delta = pi/12. The same 1/3 stands in 2/9 = (2/3)(1/3); in the copy matrix it fixes Q and
   leaves delta at the node.

## Part 5. Answers

Circulant parameters and Q per copy space and source (sqrt reading; mass reading in the parts above):

| copy space | source | covariant (circulant) | a, abs(b)/a, delta | Q |
| --- | --- | --- | --- | --- |
| G-a band | (i) uniform; (iv) M3 | yes, b = 0 | theta; 0 | 1/3 |
| G-a band | (ii) one port | no | levels 1/4, 0, 0 | 1 |
| G-a band | (ii) turn-invariant port sets | yes, b real | e.g. face: 1/4, 1/sqrt5, 0 | 7/15, 47/135, 1/3 |
| G-a band | (ii) all 4095 port sets | mostly no | | 21 values in [1/3, 1], never 2/3 |
| G-a band | (iii) flux pair, 15 classes | only d = 5 on a frame diagonal | delta (rest phases) 0.49 to 0.90 | 0.334 to 0.422 |
| G-e second index | (i) uniform | yes, b = 0 | | 1/3 |
| G-e second index | (iv) M3 | no (rest 0.85 of the norm) | costs: 16/3, 1/4, 0.776; kernel delta = (1/3) arccos(11/16) = 0.2709 | 3/8 (costs), 0.3337 (kernel), 0.3461 (angles) |
| G-e second index | (ii) ports, left-averaged | yes, b = 0 | | 1/3 |
| G-e second index | (ii) ports, left state on a body diagonal, 3 + 1 ports | no | 1/3, 1/sqrt2, pi/12 | **2/3** (rank two) |
| G-e second index | (iii) flux pair | no | | 0.370 to 0.375 (costs), 0.344 to 0.346 (angles), 7 of 15 classes |
| G-b cones | (i) uniform; (iv) M3 | yes, b = 0 | | 1/3 (three), 1/4 (four) |
| G-b cones | (ii) one point source | E0, O2 (W); E2, O0 (ZW) | a = 1, abs(b) = 1, arg b = 2 pi/3: levels 3, 0, 0 (axis) | 1 |
| G-b cones | (ii)/(iii) one even + one odd source, equal angle | E0 + O2 (W), E2 + O0 (ZW); 14 pairs no | a = 2, abs(b) = sqrt2, arg b = 3 pi/4: delta = pi/12 | **2/3** on the axis cones (rank two), 5/8 on four |
| G-b cones | (ii) at most three sources, all classes | the W- and ZW-blocks and their sums | delta in {0, pi/12, 0.2117, 0.3764, 0.4288, pi/6, pi/3} | 11/27 to 1 |
| G-b cones | rank three at Q3 = 2/3, equal angles | 4 of 128 (up to 12 sources) | delta 0.0855 (10 sources), 0.1757 (12) | 2/3 |

1. Does Q = 2/3 arise for a natural source? Yes, exactly, and only at rank two (lightest copy massless), where
   Lemma 3 fixes delta = pi/12. Two families: on the cone copies G-b, one point source on an even cell and one on an
   odd cell with equal angles (origin cone deleted; 16 pairs, of which E0 + O2 and E2 + O0 are third-turn-covariant
   circulants with a = 2, abs(b) = sqrt2, arg b = 3 pi/4); on the second index G-e, a particle along a body diagonal
   with loads on a face (or belt triple) plus one port (not covariant). Both hold in the sqrt reading only (mass
   reading 0.5505). With three massive copies, Q = 2/3 needs at least ten equal sources in one class pattern (G-b; four
   such patterns up to twelve sources are covariant, delta = 0.0855) or tuned angles. The band G-a never gives 2/3.
   (EXACT)
2. Does delta = 2/9 arise? No. Every copy matrix with algebraic entries has delta different from 2/9 (Lemma 2, EXACT);
   the readings through rest phases (arccos) give delta from 0.27 to 0.90 (MEASURED from closed forms). The natural
   phases nearest to 2/9 = 0.2222 are pi/15 = 0.2094 (T5's face sum of responses, Q = 0.6824), 0.2117 (G-b, two even
   sources of one kind and one odd, a covariant rank-two circulant, Q = 19/27) and 0.2709 (the M3 kernel on the second
   index). Lemma 3' shows that a rank-two matrix with delta = 2/9 has Q = 0.695325, so the lepton point needs rank three.
3. Can the body-diagonal 2/9 enter a third-turn-covariant phase? No (Part 4, items (a) to (e), EXACT; higher orders
   ARGUED). It is a coefficient of the common dispersion of all copies, so in any copy matrix it lands in a; it is a
   q^3 coefficient while delta is a q^0 quantity; algebraic copy matrices cannot reach 2/9; the number depends on the
   momentum unit (the 2/9 of the period and the 2/9 of the one-tick automaton are different coefficients); and the
   alternating tick has no third-turn symmetry, local or staggered, unitary or antiunitary.

Not done: sources with unequal angles beyond the even-odd pair formula (a continuum; any delta is reachable by tuning
two weights, which this task excludes); second-order (all-order) copy matrices for the deleted-origin axis block,
which is no executable object of CF-1 as defined; box B was not used (every run took under 90 CPU seconds locally).

Custody: `work/SIM/koide/` lies inside the tree that `lib/box.sh B SIM pull` rewrites with `rsync -az` (box copies
replace newer local files; logs excluded). A pull during this task restored older copies of `koi_cones.py`,
`koi_cones_counts.py` and `koide.json`; the fixes were re-applied and all results regenerated in one pass in the
script order of the header. A pull of the SIM tree that does not exclude `koide/` can restore those older copies
again.
