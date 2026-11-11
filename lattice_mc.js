// Z_N link ensembles on a periodic cubic lattice with the plaquette weight exp(kappa * sum_p Re W_p).
// A port of the reference Monte Carlo of the theory side (report MA, script gauge_mc.py): links U = omega^n with
// omega = exp(2 pi i / N), stored as integers n in 0..N-1; n[mu * V + x] is the link from x to x + e_mu, with
// x = (x0 * L1 + x1) * L2 + x2. Plaquette W_p = U_mu(x) U_nu(x + mu) U_mu(x + nu)^* U_nu(x)^*.
// Heat bath in the checkerboard order of the reference: links of direction mu whose transverse coordinate sum has
// equal parity share no plaquette; every link is drawn from its exact conditional distribution.
// Measurements: share of nontrivial plaquettes, mean Re W, Wilson loops W(R, T) averaged over all positions, the
// three planes and both assignments of R and T, Polyakov loops along the three axes.
// Nothing here is tuned to a target. Checks: node lattice_check.mjs.
export const PLANES = [[0, 1], [0, 2], [1, 2]];   // plane index k <-> (mu, nu); its normal is 3 - mu - nu

// Reference values of report MA (measured on 48^3 and 96 x 48 x 48 unless stated). f = nontrivial plaquettes per plaquette.
export const REF = {
  Z2: {
    name: 'Z2', centre: 'weak centre', kc: 0.761413, order: 'continuous',
    kcNote: 'dual of the three-dimensional Ising model, tanh K_c = exp(-2 kappa_c)',
    star: [{ k: 0.7982, f: 0.013429, per: 'carrier', phase: 'deconfined, perimeter law', chi22: 0.0038 },
      { k: 0.7540, f: 0.04004, per: 'plaquette', phase: 'confined, near critical', chi22: 0.0346 }],
    f48: [[0.50, 0.2488], [0.60, 0.1863], [0.70, 0.1053], [0.74, 0.0609], [0.752, 0.0434], [0.754, 0.04024], [0.76, 0.026],
      [0.78, 0.0174], [0.797, 0.01365], [0.799, 0.01328], [0.82, 0.0102], [0.90, 0.0043], [1.0, 0.0017]],
  },
  Z3: {
    name: 'Z3', centre: 'colour centre', kc: 1.0843, order: 'first order',
    kcNote: 'dual of the three-state Potts model; measured between 1.082 and 1.086',
    star: [{ k: 1.0797, f: 0.08976, per: 'carrier', phase: 'confined, area law', chi22: 0.0744 },
      { k: 0.9305, f: 0.26781, per: 'plaquette', phase: 'confined, strong coupling', chi22: 0.455 }],
    f48: [[0.50, 0.4835], [0.80, 0.3486], [0.925, 0.2718], [0.930, 0.2682], [0.935, 0.2645], [1.00, 0.2095], [1.06, 0.1347],
      [1.078, 0.0944], [1.080, 0.0887], [1.09, 0.030], [1.12, 0.020], [1.20, 0.0095], [1.50, 0.0011]],
  },
  checks: { z2_torus_05: 0.654778, z2_8_015: [0.1487, 0.0015], z3_8_02: [0.1054, 0.0018] },
};

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class LinkEnsemble {
  constructor({ N = 3, shape = [8, 8, 8], kappa = 0.5, seed = 1, start = 'cold' } = {}) {
    const [L0, L1, L2] = shape, V = L0 * L1 * L2;
    this.N = N; this.shape = [L0, L1, L2]; this.V = V; this.sweeps = 0;
    this.rnd = mulberry32(seed);
    this.n = new Int8Array(3 * V);
    this.xp = [new Int32Array(V), new Int32Array(V), new Int32Array(V)];
    this.xm = [new Int32Array(V), new Int32Array(V), new Int32Array(V)];
    this.par = [new Uint8Array(V), new Uint8Array(V), new Uint8Array(V)];
    this.coord = [new Int16Array(V), new Int16Array(V), new Int16Array(V)];
    const idx = (a, b, c) => (a * L1 + b) * L2 + c;
    for (let a = 0; a < L0; a++) for (let b = 0; b < L1; b++) for (let c = 0; c < L2; c++) {
      const i = idx(a, b, c);
      this.xp[0][i] = idx((a + 1) % L0, b, c); this.xm[0][i] = idx((a + L0 - 1) % L0, b, c);
      this.xp[1][i] = idx(a, (b + 1) % L1, c); this.xm[1][i] = idx(a, (b + L1 - 1) % L1, c);
      this.xp[2][i] = idx(a, b, (c + 1) % L2); this.xm[2][i] = idx(a, b, (c + L2 - 1) % L2);
      this.par[0][i] = (b + c) & 1; this.par[1][i] = (a + c) & 1; this.par[2][i] = (a + b) & 1;
      this.coord[0][i] = a; this.coord[1][i] = b; this.coord[2][i] = c;
    }
    this.ct = new Float64Array(N); this.st = new Float64Array(N);
    for (let g = 0; g < N; g++) { this.ct[g] = Math.cos(2 * Math.PI * g / N); this.st[g] = Math.sin(2 * Math.PI * g / N); }
    if (N === 2) { this.ct[1] = -1; this.st[1] = 0; }
    if (N === 3) { this.ct[1] = this.ct[2] = -0.5; }
    this.wt = new Float64Array(N); this.e = new Float64Array(N);
    this.setKappa(kappa);
    if (start === 'hot') this.hot();
  }
  setKappa(kappa) { this.kappa = kappa; for (let g = 0; g < this.N; g++) this.wt[g] = Math.exp(kappa * this.ct[g]); }
  cold() { this.n.fill(0); }
  hot() { for (let i = 0; i < this.n.length; i++) this.n[i] = Math.floor(this.rnd() * this.N); }

  // k heat-bath sweeps over all links
  sweep(k = 1) {
    const { N, V, n, xp, xm, wt, e, rnd } = this;
    const M = 4 * N;
    for (let it = 0; it < k; it++) {
      for (let mu = 0; mu < 3; mu++) {
        const nu1 = (mu + 1) % 3, nu2 = (mu + 2) % 3, P = this.par[mu], om = mu * V, o1 = nu1 * V, o2 = nu2 * V;
        const pm = xp[mu], p1 = xp[nu1], m1 = xm[nu1], p2 = xp[nu2], m2 = xm[nu2];
        for (let par = 0; par < 2; par++) {
          for (let x = 0; x < V; x++) {
            if (P[x] !== par) continue;
            const a = pm[x];
            // forward and backward staple in the two planes that hold the link
            let c = m1[x];
            const s0 = (n[o1 + a] - n[om + p1[x]] - n[o1 + x] + M) % N, s1 = (-n[o1 + pm[c]] - n[om + c] + n[o1 + c] + M) % N;
            c = m2[x];
            const s2 = (n[o2 + a] - n[om + p2[x]] - n[o2 + x] + M) % N, s3 = (-n[o2 + pm[c]] - n[om + c] + n[o2 + c] + M) % N;
            let tot = 0;
            for (let g = 0; g < N; g++) { const v = wt[(g + s0) % N] * wt[(g + s1) % N] * wt[(g + s2) % N] * wt[(g + s3) % N]; e[g] = v; tot += v; }
            const r = rnd() * tot;
            let acc = 0, nw = N - 1;
            for (let g = 0; g < N; g++) { acc += e[g]; if (r <= acc) { nw = g; break; } }
            n[om + x] = nw;
          }
        }
      }
    }
    this.sweeps += k;
  }

  // plaquette flux; fills out[k * V + x] (plane k of PLANES) when given. Returns the share of nontrivial plaquettes and mean Re W.
  plaquettes(out) {
    const { N, V, n, xp, ct } = this;
    let cnt = 0, tot = 0;
    for (let k = 0; k < 3; k++) {
      const mu = PLANES[k][0], nu = PLANES[k][1], om = mu * V, on = nu * V, pm = xp[mu], pn = xp[nu];
      for (let x = 0; x < V; x++) {
        const p = (n[om + x] + n[on + pm[x]] - n[om + pn[x]] - n[on + x] + 2 * N) % N;
        if (out) out[k * V + x] = p;
        if (p) cnt++;
        tot += ct[p];
      }
    }
    return { f: cnt / (3 * V), w: tot / (3 * V) };
  }

  // W[(R - 1) * Rmax + (T - 1)] for R, T = 1..Rmax: mean of Re W over all positions, the three planes and both assignments
  wilson(Rmax) {
    const { N, V, n, xp, ct } = this;
    if (!this._sh || this._sh.Rmax !== Rmax) {            // sh[mu][R][x] = x + R e_mu
      const sh = [];
      for (let mu = 0; mu < 3; mu++) {
        const rows = [new Int32Array(V)];
        for (let x = 0; x < V; x++) rows[0][x] = x;
        for (let R = 1; R <= Rmax; R++) { const r = new Int32Array(V), q = rows[R - 1]; for (let x = 0; x < V; x++) r[x] = xp[mu][q[x]]; rows.push(r); }
        sh.push(rows);
      }
      this._sh = { Rmax, sh, Ls: [0, 1, 2].map(() => Array.from({ length: Rmax + 1 }, () => new Uint8Array(V))) };
    }
    const { sh, Ls } = this._sh;
    for (let mu = 0; mu < 3; mu++) {                       // Ls[mu][R][x] = sum of n_mu over R links from x along mu
      Ls[mu][0].fill(0);
      for (let R = 1; R <= Rmax; R++) { const a = Ls[mu][R - 1], b = Ls[mu][R], q = sh[mu][R - 1], o = mu * V; for (let x = 0; x < V; x++) b[x] = (a[x] + n[o + q[x]]) % N; }
    }
    const W = new Float64Array(Rmax * Rmax);
    for (let mu = 0; mu < 3; mu++) for (let nu = 0; nu < 3; nu++) {
      if (mu === nu) continue;
      for (let R = 1; R <= Rmax; R++) for (let T = R; T <= Rmax; T++) {
        const LR = Ls[mu][R], LT = Ls[nu][T], sR = sh[mu][R], sT = sh[nu][T];
        let acc = 0;
        for (let x = 0; x < V; x++) acc += ct[(LR[x] + LT[sR[x]] - LR[sT[x]] - LT[x] + 2 * N) % N];
        W[(R - 1) * Rmax + (T - 1)] += acc / (6 * V);
      }
    }
    for (let R = 1; R <= Rmax; R++) for (let T = R + 1; T <= Rmax; T++) W[(T - 1) * Rmax + (R - 1)] = W[(R - 1) * Rmax + (T - 1)];
    return W;
  }

  // spatial mean of the Polyakov loop along each axis: [re0, im0, re1, im1, re2, im2]
  polyakov() {
    const { N, V, n, xp, ct, st, coord, shape } = this, out = new Float64Array(6);
    for (let mu = 0; mu < 3; mu++) {
      let re = 0, im = 0, cnt = 0;
      for (let x = 0; x < V; x++) {
        if (coord[mu][x] !== 0) continue;
        let h = 0, y = x;
        for (let s = 0; s < shape[mu]; s++) { h += n[mu * V + y]; y = xp[mu][y]; }
        h %= N; re += ct[h]; im += st[h]; cnt++;
      }
      out[2 * mu] = re / cnt; out[2 * mu + 1] = im / cnt;
    }
    return out;
  }

  // gauge transformation n_mu(x) -> n_mu(x) + g(x) - g(x + mu)
  gaugeTransform(g) {
    const { N, V, n, xp } = this;
    for (let mu = 0; mu < 3; mu++) for (let x = 0; x < V; x++) n[mu * V + x] = (n[mu * V + x] + g[x] - g[xp[mu][x]] + N) % N;
  }
  // centre transformation: every link of direction mu that leaves the layer x_mu = layer is multiplied by omega^k
  centreTwist(mu, layer, k) {
    const { N, V, n, coord } = this;
    for (let x = 0; x < V; x++) if (coord[mu][x] === layer) n[mu * V + x] = (n[mu * V + x] + k) % N;
  }
}

// mean Re W of one free plaquette: the leading order of the strong-coupling expansion (tanh kappa for Z2)
export function onePlaquette(N, kappa) {
  let num = 0, den = 0;
  for (let g = 0; g < N; g++) { const c = N === 2 ? (g ? -1 : 1) : Math.cos(2 * Math.PI * g / N), w = Math.exp(kappa * c); num += c * w; den += w; }
  return num / den;
}

// Exact enumeration of Z2 on the 2^3 torus: number of link states (of 2^24) at every value E = sum_p W_p, by a Gray code.
export function z2TorusDensity() {
  const E0 = new LinkEnsemble({ N: 2, shape: [2, 2, 2] }), V = 8, of = Array.from({ length: 24 }, () => []);
  for (let k = 0; k < 3; k++) {
    const [mu, nu] = PLANES[k];
    for (let x = 0; x < V; x++) { const p = k * V + x; for (const l of [mu * V + x, nu * V + E0.xp[mu][x], mu * V + E0.xp[nu][x], nu * V + x]) of[l].push(p); }
  }
  if (of.some((a) => a.length !== 4 || new Set(a).size !== 4)) throw new Error('2^3 torus: a link is not in four distinct plaquettes');
  const s = new Int8Array(24).fill(1), hist = new Float64Array(49);
  let E = 24; hist[E + 24] = 1;
  for (let i = 1; i < 16777216; i++) {
    const a = of[31 - Math.clz32(i & -i)];
    for (let q = 0; q < 4; q++) { const p = a[q]; s[p] = -s[p]; E += 2 * s[p]; }
    hist[E + 24]++;
  }
  return hist;
}
export function z2TorusMean(kappa, hist) {
  let num = 0, den = 0;
  for (let E = -24; E <= 24; E++) { const w = hist[E + 24] * Math.exp(kappa * (E - 24)); num += w * E / 24; den += w; }
  return num / den;
}

// plaquette cost 1 - Re tr5(z_k)/5 of the central element z_k = diag(w^k, w^k, w^k, (-1)^k, (-1)^k), w = exp(2 pi i/3)
export function centreCost(k) {
  const c3 = [1, -0.5, -0.5][((k % 3) + 3) % 3], c2 = k % 2 ? -1 : 1;
  return { colour: 3 * (1 - c3) / 5, weak: 2 * (1 - c2) / 5, total: 1 - (3 * c3 + 2 * c2) / 5 };
}

// Running means with errors from block means
class Acc {
  constructor(m, block = 8) { this.m = m; this.block = block; this.clear(); }
  clear() { this.n = 0; this.sum = new Float64Array(this.m); this.bs = new Float64Array(this.m); this.bn = 0; this.nb = 0; this.s1 = new Float64Array(this.m); this.s2 = new Float64Array(this.m); }
  add(v) {
    const { m, sum, bs, s1, s2 } = this;
    for (let i = 0; i < m; i++) { sum[i] += v[i]; bs[i] += v[i]; }
    this.n++;
    if (++this.bn === this.block) { for (let i = 0; i < m; i++) { const b = bs[i] / this.block; s1[i] += b; s2[i] += b * b; bs[i] = 0; } this.bn = 0; this.nb++; }
  }
  mean() { const out = new Float64Array(this.m); if (this.n) for (let i = 0; i < this.m; i++) out[i] = this.sum[i] / this.n; return out; }
  err() {
    const out = new Float64Array(this.m).fill(NaN), nb = this.nb;
    if (nb >= 4) for (let i = 0; i < this.m; i++) { const a = this.s1[i] / nb; out[i] = Math.sqrt(Math.max(0, this.s2[i] / nb - a * a) / (nb - 1)); }
    return out;
  }
}

// The live run of the Lattice page. It runs in a web worker (lattice_mc_worker.js) and, where module workers are
// not available, on the main thread. post(message, transferList) receives one frame per batch of sweeps.
export class LiveRun {
  constructor(post) {
    this.post = post; this.cfg = { N: 3, L: 8, kappa: 1.0, seed: 20261111, batch: 4, interval: 42, settle: 160 };
    this.on = false; this.timer = 0; this.reset();
  }
  reset(start = 'cold') {
    const c = this.cfg;
    this.E = new LinkEnsemble({ N: c.N, shape: [c.L, c.L, c.L], kappa: c.kappa, seed: c.seed, start });
    this.Rmax = Math.max(1, Math.floor(c.L / 2));
    this.acc = new Acc(3 + this.Rmax * this.Rmax);
    this.wait = this.wait0 = start === 'cold' ? Math.round(c.settle / 2) : c.settle;
  }
  handle(m) {
    if (m.type === 'config') {
      const regroup = (m.N !== undefined && m.N !== this.cfg.N) || (m.L !== undefined && m.L !== this.cfg.L);
      for (const k of ['N', 'L', 'kappa', 'batch', 'interval', 'settle']) if (m[k] !== undefined) this.cfg[k] = m[k];
      if (regroup) this.reset(m.start || 'cold');
      else if (m.soft) this.E.setKappa(this.cfg.kappa);      // a coupling that is swept: the statistics keep running
      else { this.E.setKappa(this.cfg.kappa); this.acc.clear(); this.wait = this.wait0 = this.cfg.settle; }
    } else if (m.type === 'restart') this.reset(m.start || 'cold');
    else if (m.type === 'run') {
      this.on = !!m.on; clearTimeout(this.timer);
      if (this.on) this.loop();
    }
  }
  loop() {
    if (!this.on) return;
    this.step();
    this.timer = setTimeout(() => this.loop(), this.cfg.interval);
  }
  step() {
    const c = this.cfg, E = this.E, R = this.Rmax;
    E.sweep(c.batch);
    const plaq = new Uint8Array(3 * E.V), { f, w } = E.plaquettes(plaq), pol = E.polyakov();
    const pabs = (Math.hypot(pol[0], pol[1]) + Math.hypot(pol[2], pol[3]) + Math.hypot(pol[4], pol[5])) / 3;
    const settling = this.wait > 0;
    if (settling) this.wait -= c.batch;
    else { const W = E.wilson(R), v = new Float64Array(3 + R * R); v[0] = f; v[1] = w; v[2] = pabs; v.set(W, 3); this.acc.add(v); }
    const mean = this.acc.mean(), err = this.acc.err();
    const warm = this.wait0 > 0 ? Math.max(0, Math.min(1, 1 - this.wait / this.wait0)) : 1;     // share of the warm-up sweeps done
    this.post({ type: 'frame', N: c.N, L: c.L, kappa: c.kappa, sweep: E.sweeps, settling, warm, plaq, f, w, pol, pabs, Rmax: R, samples: this.acc.n, mean, err }, [plaq.buffer]);
  }
}

// =====================================================================================================================
// The register of a stored run, read as a link field. Pure functions for the Lattice page and its node check.
// Screen tier of the run (DATASET.md): carriers are the cells (triangles) of the screen mesh, two cells that share a
// mesh edge are joined by one glue seam, and the screen face of a mesh vertex is bounded by the glue seams between the
// five or six cells around it. A link value l on a seam, read from cell A to cell B, adds +l to the class of the face
// around which A -> B runs counterclockwise (seen from outside) and -l to the other face of the seam. This is the
// orientation rule of the run (checked against geometry.npz: glue_fp is that face for the seam a -> b).

export function meshValence(tri, nVertices) { const v = new Uint8Array(nVertices); for (let i = 0; i < tri.length; i++) v[tri[i]]++; return v; }
const vkey = (x, y, z) => `${Math.round(x * 1e5)},${Math.round(y * 1e5)},${Math.round(z * 1e5)}`;

// The defect identity that hops most inside a compact region well inside one featured observer's patch.
// D: view/observer_defects.npz; observers: run.json observers; cellXyz: cell centres; sp: cell spacing.
export function chooseTrack(D, observers, cellXyz, sp, { gap = 3, maxExtent = 4.5, maxReach = 11, minRows = 6 } = {}) {
  let best = null;
  for (const ob of observers) {
    const c = ob.carrier, cut = D['o' + c + '_cut'], cls = D['o' + c + '_cls'], ids = D['o' + c + '_id'], xyz = D['o' + c + '_xyz'];
    if (!cut) continue;
    const by = new Map();
    for (let i = 0; i < cut.length; i++) { let a = by.get(ids[i]); if (!a) by.set(ids[i], (a = [])); a.push(i); }
    for (const [id, rows] of by) {
      rows.sort((a, b) => cut[a] - cut[b]);
      let s = 0;
      for (let e = 1; e <= rows.length; e++) {
        if (e < rows.length && cut[rows[e]] - cut[rows[e - 1]] <= gap) continue;
        const seg = rows.slice(s, e); s = e;
        if (seg.length < minRows) continue;
        const m = [0, 0, 0]; for (const i of seg) for (let q = 0; q < 3; q++) m[q] += xyz[3 * i + q] / seg.length;
        let ext = 0, hops = 0; const places = new Set();
        for (let q = 0; q < seg.length; q++) {
          const i = seg[q]; ext = Math.max(ext, Math.hypot(xyz[3 * i] - m[0], xyz[3 * i + 1] - m[1], xyz[3 * i + 2] - m[2]) / sp);
          places.add(vkey(xyz[3 * i], xyz[3 * i + 1], xyz[3 * i + 2]));
          if (q) { const p = seg[q - 1]; if (Math.hypot(xyz[3 * i] - xyz[3 * p], xyz[3 * i + 1] - xyz[3 * p + 1], xyz[3 * i + 2] - xyz[3 * p + 2]) > 1e-6) hops++; }
        }
        const off = Math.hypot(m[0] - cellXyz[3 * c], m[1] - cellXyz[3 * c + 1], m[2] - cellXyz[3 * c + 2]) / sp;
        if (ext > maxExtent || off + ext > maxReach || !hops) continue;
        const k = ((cls[seg[0]] % 6) + 6) % 6;
        if (best && (hops < best.hops || (hops === best.hops && (places.size < best.places || (places.size === best.places && ext >= best.ext))))) continue;
        best = { c, id, k, rows: seg, first: cut[seg[0]], last: cut[seg[seg.length - 1]], hops, places: places.size, ext, off, centre: m };
      }
    }
  }
  return best;
}

// A square window of a patch: its cells, the faces (mesh vertices) with the cells around them, and the seams.
export function buildWindow({ tri, meshXyz, cellXyz, valence, patchCells, centre, half, sp, pad = 1.5, aspect = 1 }) {
  const nn = Math.hypot(centre[0], centre[1], centre[2]), n = [centre[0] / nn, centre[1] / nn, centre[2] / nn];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  let e1 = cross([0, 0, 1], n); if (Math.hypot(...e1) < 0.3) e1 = cross([1, 0, 0], n);
  const l1 = Math.hypot(...e1); e1 = e1.map((x) => x / l1);
  const e2 = cross(n, e1);                                   // (e1, e2, n) is right handed: counterclockwise in (u, v) is counterclockwise seen from outside
  const tan = (x, y, z) => [(x * e1[0] + y * e1[1] + z * e1[2]) / sp, (x * e2[0] + y * e2[1] + z * e2[2]) / sp];
  const cells = [], cuv = [];
  for (let q = 0; q < patchCells.length; q++) {
    const c = patchCells[q], [u, v] = tan(cellXyz[3 * c], cellXyz[3 * c + 1], cellXyz[3 * c + 2]);
    if (Math.abs(u) <= (half + pad) * aspect && Math.abs(v) <= half + pad) { cells.push(c); cuv.push(u, v); }
  }
  const vid = new Map(), verts = [], vuv = [], inc = [], byKey = new Map();
  for (let a = 0; a < cells.length; a++) for (let q = 0; q < 3; q++) {
    const v = tri[3 * cells[a] + q]; let i = vid.get(v);
    if (i === undefined) {
      i = verts.length; vid.set(v, i); verts.push(v); inc.push([]);
      const [u, w] = tan(meshXyz[3 * v], meshXyz[3 * v + 1], meshXyz[3 * v + 2]); vuv.push(u, w);
      byKey.set(vkey(meshXyz[3 * v], meshXyz[3 * v + 1], meshXyz[3 * v + 2]), i);
    }
    inc[i].push(a);
  }
  const nv = verts.length, complete = new Uint8Array(nv);
  for (let i = 0; i < nv; i++) {
    complete[i] = inc[i].length === valence[verts[i]] ? 1 : 0;
    inc[i].sort((a, b) => Math.atan2(cuv[2 * a + 1] - vuv[2 * i + 1], cuv[2 * a] - vuv[2 * i]) - Math.atan2(cuv[2 * b + 1] - vuv[2 * i + 1], cuv[2 * b] - vuv[2 * i]));
  }
  const edge = new Map(), seamA = [], seamB = [], plus = [], minus = [], adj = Array.from({ length: nv }, () => []);
  for (let a = 0; a < cells.length; a++) for (let q = 0; q < 3; q++) {
    const i1 = vid.get(tri[3 * cells[a] + q]), i2 = vid.get(tri[3 * cells[a] + (q + 1) % 3]), key = Math.min(i1, i2) * nv + Math.max(i1, i2);
    if (!edge.has(key)) { edge.set(key, a); continue; }
    const A = edge.get(key), B = a, s = seamA.length;
    // the face around which A -> B runs counterclockwise
    const cr = (cuv[2 * A] - vuv[2 * i1]) * (cuv[2 * B + 1] - vuv[2 * i1 + 1]) - (cuv[2 * A + 1] - vuv[2 * i1 + 1]) * (cuv[2 * B] - vuv[2 * i1]);
    seamA.push(A); seamB.push(B); plus.push(cr > 0 ? i1 : i2); minus.push(cr > 0 ? i2 : i1);
    adj[i1].push([i2, s]); adj[i2].push([i1, s]);
  }
  for (let i = 0; i < nv; i++) adj[i].sort((p, q) => Math.atan2(vuv[2 * p[0] + 1] - vuv[2 * i + 1], vuv[2 * p[0]] - vuv[2 * i]) - Math.atan2(vuv[2 * q[0] + 1] - vuv[2 * i + 1], vuv[2 * q[0]] - vuv[2 * i]));
  return { cells, cuv, verts, vuv, inc, complete, seamA, seamB, plus, minus, adj, byKey, tan, half, nv, ns: seamA.length, faces: complete.reduce((a, b) => a + b, 0) };
}

// The stored classes on the faces of a window for the cuts j0..j1: K[j - j0][face] and the identity that sits there.
export function classesOnCuts(win, cut, cls, ids, xyz, j0, j1) {
  const K = [], I = [];
  for (let j = j0; j <= j1; j++) { K.push(new Int8Array(win.nv)); I.push(new Int32Array(win.nv).fill(-1)); }
  for (let r = 0; r < cut.length; r++) {
    const j = cut[r]; if (j < j0 || j > j1) continue;
    const i = win.byKey.get(vkey(xyz[3 * r], xyz[3 * r + 1], xyz[3 * r + 2])); if (i === undefined) continue;
    K[j - j0][i] = ((cls[r] % 6) + 6) % 6; I[j - j0][i] = ids[r];
  }
  return { K, I };
}
// class of a face from the links around it
export function faceClass(win, L, i) { let s = 0; for (const [, sm] of win.adj[i]) s += win.plus[sm] === i ? L[sm] : -L[sm]; return ((s % 6) + 6) % 6; }

function nearest(win, u, delta) {          // breadth first from u to the nearest face with a pending change, or to the rim of the window
  const prev = new Int32Array(win.nv).fill(-2), via = new Int32Array(win.nv), queue = [u]; prev[u] = -1;
  for (let h = 0; h < queue.length; h++) {
    const w = queue[h];
    for (const [x, s] of win.adj[w]) {
      if (prev[x] !== -2) continue;
      prev[x] = w; via[x] = s;
      if (delta[x] || !win.complete[x]) { const path = []; let y = x; while (prev[y] !== -1) { path.push([prev[y], y, via[y]]); y = prev[y]; } path.reverse(); return { end: x, path }; }
      queue.push(x);
    }
  }
  return null;
}
// One link assignment for every cut with exactly the stored classes on every complete face of the window.
// From one cut to the next it changes the fewest links it finds: a class that moves to a neighbouring face changes one
// link, as an accepted twist does in the run. The run's own link values differ from this assignment by a relabelling at
// the cells that changes no class (the window is simply connected). Returns the links per cut, the changed seams per
// cut and the number of faces whose class differs from its link sum (zero by construction, counted as a check).
export function solveLinks(win, K) {
  const L = new Int8Array(win.ns), cur = new Int8Array(win.nv), delta = new Int8Array(win.nv), out = [], changed = [];
  let bad = 0;
  for (let j = 0; j < K.length; j++) {
    const target = K[j], todo = new Set(), ch = [];
    for (let i = 0; i < win.nv; i++) { delta[i] = 0; if (!win.complete[i]) continue; const d = (target[i] - cur[i] + 12) % 6; if (d) { delta[i] = d; todo.add(i); } }
    while (todo.size) {
      let best = null;
      for (const u of todo) { const r = nearest(win, u, delta); if (r && (!best || r.path.length < best.path.length)) { best = r; best.u = u; if (r.path.length === 1) break; } }
      if (!best) break;
      const a = delta[best.u];
      for (const [w, , s] of best.path) { L[s] = (L[s] + (win.plus[s] === w ? a : 6 - a)) % 6; ch.push(s); }
      delta[best.u] = 0; todo.delete(best.u);
      const e = best.end;
      if (win.complete[e]) { delta[e] = (delta[e] + a) % 6; if (delta[e]) todo.add(e); else todo.delete(e); }
    }
    for (let i = 0; i < win.nv; i++) { cur[i] = target[i]; if (win.complete[i] && faceClass(win, L, i) !== target[i]) bad++; }
    out.push(L.slice()); changed.push(ch);
  }
  return { L: out, changed, bad };
}

// ---------------------------------------------------------------------------------------------------------------------
// One carrier from its own tape (internal tier, exact): the link of a seam is the sum of the accepted twists on it.
// geo: template_seams, template_faces, template_face_plus, template_face_minus of run.json; tape: tape_slot, tape_twist
// (positive: applied, negative: proposed and blocked by the cost rule), tape_current.
export function carrierClasses(reg, geo) {
  const c = new Int8Array(20);
  for (let k = 0; k < 30; k++) { c[geo.template_face_plus[k]] += reg[k]; c[geo.template_face_minus[k]] -= reg[k]; }
  for (let f = 0; f < 20; f++) c[f] = ((c[f] % 6) + 6) % 6;
  return c;
}
export function carrierLinksAt(tape, depthLimit) {            // links of the 33 seams after every attempt of depth <= depthLimit
  const reg = new Int8Array(33), { tape_slot: slot, tape_twist: tw, tape_depth: dep } = tape;
  for (let r = 0; r < slot.length; r++) if (tw[r] > 0 && (depthLimit < 0 || dep[r] <= depthLimit)) reg[slot[r]] = (reg[slot[r]] + tw[r]) % 6;
  return reg;
}
// The face of the carrier with the richest short history: up to maxSteps consecutive proposals on its three seams.
export function pickFaceStory(geo, tape, maxSteps = 12) {
  const { tape_slot: slot, tape_twist: tw, tape_current: cur } = tape, FP = geo.template_face_plus, FM = geo.template_face_minus;
  let best = null;
  for (let f = 0; f < 20; f++) {
    const ks = [], sg = {};
    for (let k = 0; k < 30; k++) { if (FP[k] === f) { ks.push(k); sg[k] = 1; } else if (FM[k] === f) { ks.push(k); sg[k] = -1; } }
    const rows = [], after = [], reg = {}; ks.forEach((k) => (reg[k] = 0));
    const cls = () => (((ks.reduce((a, k) => a + sg[k] * reg[k], 0)) % 6) + 6) % 6;
    for (let r = 0; r < slot.length; r++) { const k = slot[r]; if (sg[k] === undefined || tw[r] === 0) continue; if (tw[r] > 0) reg[k] = (reg[k] + tw[r]) % 6; rows.push(r); after.push(cls()); }
    for (let i0 = 0; i0 < rows.length; i0++) {
      const i1 = Math.min(rows.length, i0 + maxSteps), seams = new Set(), vals = new Set([i0 ? after[i0 - 1] : 0]);
      let applied = 0;
      for (let i = i0; i < i1; i++) { vals.add(after[i]); if (tw[rows[i]] > 0) { applied++; seams.add(slot[rows[i]]); } }
      const score = 10 * applied + 7 * seams.size + 3 * vals.size;
      if (!best || score > best.score) best = { score, f, ks, sg, r0: rows[i0], r1: rows[i1 - 1], applied };
    }
  }
  if (!best) return null;
  // second pass: every link of the carrier, to give the classes of the three neighbouring faces at every step
  const { f, ks, sg } = best, corners = Array.from(geo.template_faces[f]);
  const order = corners.map((p) => ks.find((k) => !geo.template_seams[k].includes(p)));     // seam i is opposite corner i
  const nb = order.map((k) => (FP[k] === f ? FM[k] : FP[k])), reg = new Int8Array(33), steps = [];
  const snap = () => { const c = carrierClasses(reg, geo); return { links: order.map((k) => reg[k]), read: order.map((k) => (((sg[k] * reg[k]) % 6) + 6) % 6), cls: c[f], nb: nb.map((g) => c[g]) }; };
  let start = null;
  for (let r = 0; r <= best.r1; r++) {
    if (r === best.r0) start = snap();
    if (tw[r] > 0 && slot[r] < 30) reg[slot[r]] = (reg[slot[r]] + tw[r]) % 6;
    if (r >= best.r0 && sg[slot[r]] !== undefined && tw[r] !== 0) steps.push(Object.assign({ tick: r + 1, seam: order.indexOf(slot[r]), current: cur[r], twist: Math.abs(tw[r]), applied: tw[r] > 0 }, snap()));
  }
  return { face: f, corners, seams: order, ports: order.map((k) => Array.from(geo.template_seams[k])), sign: order.map((k) => sg[k]), neighbours: nb, start, steps, applied: best.applied };
}

// ---------------------------------------------------------------------------------------------------------------------
// The carrier as an icosahedron in the orientation of one cubic frame, and its five cubic frames (lead L28):
// the five sets of six seams whose midpoints lie on three mutually perpendicular two-fold axes.
export function icosahedron() {
  const p = (1 + Math.sqrt(5)) / 2, V = [];
  for (const a of [1, -1]) for (const b of [p, -p]) V.push([0, a, b], [a, b, 0], [b, 0, a]);
  const E = [], F = [], d2 = (i, j) => (V[i][0] - V[j][0]) ** 2 + (V[i][1] - V[j][1]) ** 2 + (V[i][2] - V[j][2]) ** 2;
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) if (Math.abs(d2(i, j) - 4) < 1e-9) E.push([i, j]);
  const near = (i, j) => Math.abs(d2(i, j) - 4) < 1e-9;
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) for (let k = j + 1; k < 12; k++) if (near(i, j) && near(j, k) && near(i, k)) F.push([i, j, k]);
  const mid = E.map(([i, j]) => [(V[i][0] + V[j][0]) / 2, (V[i][1] + V[j][1]) / 2, (V[i][2] + V[j][2]) / 2]);
  return { V, E, F, mid, phi: p };
}
export function cubicFrames(ico = icosahedron()) {
  const { E, mid, phi } = ico, m2 = phi * phi, frame = new Int8Array(E.length).fill(-1), frames = [];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  for (let e = 0; e < E.length; e++) {
    if (frame[e] >= 0) continue;
    const set = [];
    for (let f = 0; f < E.length; f++) { const d = dot(mid[e], mid[f]); if (Math.abs(Math.abs(d) - m2) < 1e-9 || Math.abs(d) < 1e-9) set.push(f); }
    for (const f of set) frame[f] = frames.length;
    frames.push(set);
  }
  // the frame whose axes are the coordinate axes comes first
  const main = frames.findIndex((s) => s.every((f) => mid[f].filter((x) => Math.abs(x) > 1e-9).length === 1));
  if (main > 0) { const t = frames[0]; frames[0] = frames[main]; frames[main] = t; }
  frames.forEach((s, i) => s.forEach((f) => (frame[f] = i)));
  return { frames, frame };
}

// ---------------------------------------------------------------------------------------------------------------------
// Repair as a random step, and its unitary completion, on one carrier (public proof: coherent_seam_repair).
// Classical: one attempt picks one of the sixty ordered seams and makes its two ports agree; on the populations of one
// load this is the kernel K = 1 - L/60, L the Laplacian of the port graph.
// Coherent: state space C^12 (port) x C^2 (record) x C^60 (address). For the ordered seam k = (a, b) the local
// reflection U_k = 1 - v v^T, v = |->|0> - |+>|1>, |+-> = (|a> +- |b>)/sqrt 2, exchanges disagreement without a record
// and agreement with a record. Q = sum_k U_k x |k><k|, R = 2 A A^T - 1 with A the embedding with the uniform address,
// W = Q R. All matrices are real.
export function portKernel(ico = icosahedron()) {
  const K = new Float64Array(144);
  for (let p = 0; p < 12; p++) K[13 * p] = 1;
  for (const [a, b] of ico.E) { K[13 * a] -= 1 / 60; K[13 * b] -= 1 / 60; K[12 * a + b] += 1 / 60; K[12 * b + a] += 1 / 60; }
  return K;
}
export function classicalPopulations(steps, start = 0, ico = icosahedron()) {      // rows K^n e_start, n = 0..steps
  const K = portKernel(ico), out = new Float64Array((steps + 1) * 12); out[start] = 1;
  for (let n = 0; n < steps; n++) for (let p = 0; p < 12; p++) { let s = 0; for (let q = 0; q < 12; q++) s += K[12 * p + q] * out[n * 12 + q]; out[(n + 1) * 12 + p] = s; }
  return out;
}
export class CoherentWalk {
  constructor(ico = icosahedron()) {
    this.addr = []; for (const [a, b] of ico.E) this.addr.push([a, b], [b, a]);          // sixty ordered seams
    this.dim = 12 * 2 * 60; this.psi = new Float64Array(this.dim);
  }
  static index(p, r, k) { return (k * 2 + r) * 12 + p; }
  embed(port) { this.psi.fill(0); const c = 1 / Math.sqrt(60); for (let k = 0; k < 60; k++) this.psi[CoherentWalk.index(port, 0, k)] = c; return this; }   // A e_port
  applyQ(x) {
    const h = Math.SQRT1_2;
    for (let k = 0; k < 60; k++) {
      const [a, b] = this.addr[k], ia0 = CoherentWalk.index(a, 0, k), ib0 = CoherentWalk.index(b, 0, k), ia1 = CoherentWalk.index(a, 1, k), ib1 = CoherentWalk.index(b, 1, k);
      const d = h * (x[ia0] - x[ib0] - x[ia1] - x[ib1]);                                  // v . x
      x[ia0] -= h * d; x[ib0] += h * d; x[ia1] += h * d; x[ib1] += h * d;
    }
    return x;
  }
  applyR(x) {
    for (let p = 0; p < 12; p++) for (let r = 0; r < 2; r++) {
      let s = 0; for (let k = 0; k < 60; k++) s += x[CoherentWalk.index(p, r, k)];
      s /= 30; for (let k = 0; k < 60; k++) { const i = CoherentWalk.index(p, r, k); x[i] = s - x[i]; }
    }
    return x;
  }
  step() { this.applyQ(this.applyR(this.psi)); return this; }                             // W = Q R
  project(x = this.psi) {                                                                 // A^T x: the port amplitudes on the blank record and the uniform address
    const out = new Float64Array(12), c = 1 / Math.sqrt(60);
    for (let p = 0; p < 12; p++) { let s = 0; for (let k = 0; k < 60; k++) s += x[CoherentWalk.index(p, 0, k)]; out[p] = c * s; }
    return out;
  }
  populations() {                                                                         // port marginals, and the weight of record 1
    const out = new Float64Array(13);
    for (let k = 0; k < 60; k++) for (let r = 0; r < 2; r++) for (let p = 0; p < 12; p++) { const v = this.psi[CoherentWalk.index(p, r, k)] ** 2; out[p] += v; if (r) out[12] += v; }
    return out;
  }
}
export function coherentPopulations(steps, start = 0, ico = icosahedron()) {            // rows of 13: port marginals of W^n A e_start and the record-1 weight
  const w = new CoherentWalk(ico).embed(start), out = new Float64Array((steps + 1) * 13);
  out.set(w.populations(), 0);
  for (let n = 1; n <= steps; n++) { w.step(); out.set(w.populations(), n * 13); }
  return out;
}
