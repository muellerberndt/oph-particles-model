// One observer: its own clock, its record tape and readouts, the history of its neighbourhood on the
// slices of synchronised time, and the declared wave reading of its patch (the 1+3 scalar description).
// Layout: style/qa1.css, section "One observer". The side panel is built once per observer and only its values change
// with the tick. The 3D view and the plots follow the size of their boxes (ResizeObserver). Progress bars (progress.js)
// show while the record tape loads and while the wave reading is computed; the tick counter sits beside the play control.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadNpz } from './npz.js';
import { $, S, FAM, fmt, row } from './app.js';
import { busy } from './progress.js';

let O = null, mode = 'records', tick = 0, playing = false, hooked = false, loadedFor = '';
let renderer, scene, camera, controls, group, nowPlane, dot;
const cutDefects = new Map();
let wave = null, waveJob = 0;

function setup() {
  if (renderer) return;
  const canvas = $('obsgl');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio)); renderer.setClearColor(0x000000, 0);
  scene = new THREE.Scene();        // transparent: the page draws the stage gradient behind the canvas
  const c = document.createElement('canvas'); c.width = c.height = 64; const g2 = c.getContext('2d'), gr = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.32, 'rgba(255,255,255,.9)'); gr.addColorStop(0.62, 'rgba(255,255,255,.25)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g2.fillStyle = gr; g2.fillRect(0, 0, 64, 64); dot = new THREE.CanvasTexture(c);
  camera = new THREE.PerspectiveCamera(40, 1, 0.01, 500);
  camera.position.set(26, -34, 24); camera.up.set(0, 0, 1);
  controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.target.set(0, 0, 8);
  group = new THREE.Group(); scene.add(group);
  const wait = document.createElement('div'); wait.id = 'obs-wait'; $('obs-left').appendChild(wait);      // progress bars sit over the 3D view
  const ro = new ResizeObserver(resize); ro.observe(canvas); ro.observe($('obsPlot'));                    // the view and the plots follow their boxes
  (function loop() { requestAnimationFrame(loop); if ($('page-observer').classList.contains('on')) { controls.update(); renderer.render(scene, camera); } })();
}
function resize() {
  if (!renderer) return;
  const c = $('obsgl'), w = c.clientWidth, h = c.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.render(scene, camera); drawPlots();
}
function clearGroup() { while (group.children.length) { const c = group.children.pop(); c.geometry.dispose(); c.material.dispose(); } }
function points(P, C, size, opacity = 1, glow = false) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
  // round soft markers; glowing ones add up where they overlap
  const p = new THREE.Points(g, new THREE.PointsMaterial({ size: size * 1.35, map: dot, vertexColors: true, transparent: true, opacity, depthWrite: false, sizeAttenuation: true, blending: glow ? THREE.AdditiveBlending : THREE.NormalBlending }));
  p.frustumCulled = false; group.add(p); return p;
}
function line(P, color, opacity = 1) {
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity })); group.add(l); return l;
}
const HEIGHT = 22;           // drawing height of the whole tape

// ------------------------------------------------------------------ geometry of the patch
function prepare() {
  const m = O.patch_cells.length, sp = S.meta.geometry.cell_spacing, fr = O.frame;
  O.m = m; O.uv = new Float32Array(2 * m);
  for (let c = 0; c < m; c++) {
    const x = O.patch_cell_xyz[3 * c], y = O.patch_cell_xyz[3 * c + 1], z = O.patch_cell_xyz[3 * c + 2];
    O.uv[2 * c] = (x * fr[0] + y * fr[3] + z * fr[6]) / sp; O.uv[2 * c + 1] = (x * fr[1] + y * fr[4] + z * fr[7]) / sp;
  }
  O.n = O.tape_sweep.length;
  O.radius = 0; for (let c = 0; c < m; c++) O.radius = Math.max(O.radius, Math.hypot(O.uv[2 * c], O.uv[2 * c + 1]));
  // cell loads on every slice, as deviations from the slice mean over the patch
  const K = O.cut_depth.length, P = 12 * m;
  O.K = K; O.cellDev = new Float32Array(K * m); O.cutSd = new Float32Array(K);
  for (let j = 0; j < K; j++) {
    let mean = 0;
    for (let c = 0; c < m; c++) { let s = 0; for (let p = 0; p < 12; p++) s += O.cut_patch_loads[j * P + 12 * c + p]; O.cellDev[j * m + c] = s; mean += s; }
    mean /= m; let sd = 0;
    for (let c = 0; c < m; c++) { O.cellDev[j * m + c] -= mean; sd += O.cellDev[j * m + c] ** 2; }
    O.cutSd[j] = Math.sqrt(sd / m) || 1;
  }
  tick = O.n; $('obsTick').max = O.n; $('obsTick').value = tick;
}
const zOfTick = (t) => HEIGHT * t / Math.max(1, O.n);
function tangent(x, y, z) {
  const fr = O.frame, sp = S.meta.geometry.cell_spacing;
  return [(x * fr[0] + y * fr[3] + z * fr[6]) / sp, (x * fr[1] + y * fr[4] + z * fr[7]) / sp, x * fr[2] + y * fr[5] + z * fr[8]];
}

// ------------------------------------------------------------------ records view: the neighbourhood on every slice
async function buildRecords() {
  clearGroup();
  const m = O.m, K = O.K, P = [], C = [];
  const stride = Math.max(1, Math.floor(K / 70));
  for (let j = 0; j < K; j += stride) {
    if (O.cut_depth[j] < 0) continue;
    const z = zOfTick(O.cut_ticks[j]), sd = O.cutSd[j];
    for (let c = 0; c < m; c++) {
      const t = Math.max(-1, Math.min(1, O.cellDev[j * m + c] / (2.5 * sd)));
      if (Math.abs(t) < 0.45) continue;
      P.push(O.uv[2 * c], O.uv[2 * c + 1], z);
      if (t > 0) C.push(0.95, 0.62, 0.20); else C.push(0.25, 0.55, 0.98);
    }
  }
  points(new Float32Array(P), new Float32Array(C), 0.34, 0.5);
  line(new Float32Array([0, 0, 0, 0, 0, HEIGHT]), '#ffffff', 0.9);                       // the observer's own history
  const ring = []; for (let a = 0; a <= 64; a++) ring.push(O.radius * Math.cos(a / 32 * Math.PI), O.radius * Math.sin(a / 32 * Math.PI), 0);
  line(new Float32Array(ring), '#3fe0d0', 0.5);
  nowPlane = new THREE.Mesh(new THREE.RingGeometry(0, O.radius, 64), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false }));
  group.add(nowPlane); placeNow();
  // defects of the screen tier inside the patch, slice by slice: their worldlines (precomputed in view/observer_defects.npz)
  const key = S.name + ':' + O.carrier[0];
  if (!cutDefects.has(S.name)) {
    try { cutDefects.set(S.name, await loadNpz(S.base + 'view/observer_defects.npz')); } catch (e) { cutDefects.set(S.name, null); }
  }
  const D = cutDefects.get(S.name), c0 = O.carrier[0];
  if (D && D['o' + c0 + '_cut'] && loadedFor === key && mode === 'records') {
    const cut = D['o' + c0 + '_cut'], cls = D['o' + c0 + '_cls'], xyz = D['o' + c0 + '_xyz'];
    const DP = new Float32Array(3 * cut.length), DC = new Float32Array(3 * cut.length);
    for (let i = 0; i < cut.length; i++) {
      const t = tangent(xyz[3 * i], xyz[3 * i + 1], xyz[3 * i + 2]);
      DP[3 * i] = t[0]; DP[3 * i + 1] = t[1]; DP[3 * i + 2] = zOfTick(O.cut_ticks[cut[i]]);
      const k = ((cls[i] % 6) + 6) % 6 || 1, c = FAM[k].rgb;
      DC[3 * i] = c.r; DC[3 * i + 1] = c.g; DC[3 * i + 2] = c.b;
    }
    points(DP, DC, 0.55, 0.95, true);
  }
}
function placeNow() { if (nowPlane) nowPlane.position.z = zOfTick(tick); }

// ------------------------------------------------------------------ wave reading: the declared 1+3 scalar description
const KMODES = 6, RSAMPLES = 14;
async function buildWave() {
  // leapfrog integration of d^2 phi / dN^2 = -(L / M + m_k^2) phi on the patch port graph, in observer ticks N.
  // L is the Laplacian of the seams inside the patch, M the number of seams of the whole screen (one tick advances
  // the admitted coherent continuation cos(N arccos K), K = I - L / (2M)); m_k^2 = k^2 / (630 * 16^level) is the
  // declared radial mode k of the product interval (0, pi). Source: a unit kick at the observer's twelve ports at r = pi/2.
  // The sum runs in slices of about 25 ms with a progress bar, so the page keeps painting.
  const job = ++waveJob, m = O.m, P = 12 * m, sm = O.patch_seams, ns = sm.length / 3, M = S.meta.geometry.seams, level = S.meta.geometry.level;
  const dt = Math.max(1, Math.floor(0.5 * Math.sqrt(M / 6)));
  const steps = Math.max(2, Math.ceil(O.n / dt));
  const frames = new Float32Array((steps + 1) * KMODES * m);
  const modes = []; for (let k = 1; k <= KMODES; k++) if (Math.abs(Math.sin(k * Math.PI / 2)) > 1e-9) modes.push(k);
  let bar = null, since = performance.now(), done = 0; const t0 = since, total = modes.length * steps;
  for (const k of modes) {
    const amp = Math.sin(k * Math.PI / 2), mk2 = k * k / (630 * Math.pow(16, level));
    let prev = new Float64Array(P), cur = new Float64Array(P), next = new Float64Array(P), lap = new Float64Array(P);
    for (let p = 0; p < 12; p++) cur[p] = amp * dt * (6 / 33);  // phi(dt) = dt * velocity, phi(0) = 0
    for (let s = 1; s <= steps; s++) {
      for (let c = 0; c < m; c++) { let a = 0; for (let p = 0; p < 12; p++) a += cur[12 * c + p]; frames[(s * KMODES + (k - 1)) * m + c] = a / 12; }
      lap.fill(0);
      for (let e = 0; e < ns; e++) { const a = sm[3 * e], b = sm[3 * e + 1], d = cur[a] - cur[b]; lap[a] += d; lap[b] -= d; }
      const f = dt * dt * (6 / 33) ** 2;                        // the walk steps once per incident event at a glued port (6 seams); the carrier counts 33 ticks for 6 such events
      for (let p = 0; p < P; p++) next[p] = 2 * cur[p] - prev[p] - f * (lap[p] / M + mk2 * cur[p]);
      const t = prev; prev = cur; cur = next; next = t;
      done++;
      if ((s & 7) === 0 && performance.now() - since > 25) {
        if (!bar && performance.now() - t0 > 120) bar = busy($('obs-wait'), 'computing the wave reading');
        if (bar) bar.set(done / total, `computing the wave reading, mode ${k}`);
        await new Promise((r) => setTimeout(r)); since = performance.now();
        if (job !== waveJob) { if (bar) bar.done(); return false; }          // another observer or another request took over
      }
    }
  }
  if (bar) bar.done();
  let peak = 1e-12; for (let i = 0; i < frames.length; i++) peak = Math.max(peak, Math.abs(frames[i]));
  wave = { dt, steps, frames, peak };
  return true;
}
function showWave() {
  if (!wave) return;
  clearGroup();
  const m = O.m, s = Math.max(1, Math.min(wave.steps, Math.round(tick / wave.dt)));
  const P = [], C = [];
  const L = HEIGHT * 0.8;
  let localPeak = 1e-12;
  const val = new Float32Array(RSAMPLES * m);
  for (let j = 0; j < RSAMPLES; j++) {
    const r = (j + 0.5) / RSAMPLES * Math.PI;
    for (let c = 0; c < m; c++) {
      let a = 0; for (let k = 1; k <= KMODES; k++) a += Math.sin(k * r) * wave.frames[(s * KMODES + (k - 1)) * m + c];
      val[j * m + c] = a; localPeak = Math.max(localPeak, Math.abs(a));
    }
  }
  for (let j = 0; j < RSAMPLES; j++) for (let c = 0; c < m; c++) {
    const t = val[j * m + c] / localPeak;
    if (Math.abs(t) < 0.06) continue;
    P.push(O.uv[2 * c], O.uv[2 * c + 1], (j + 0.5) / RSAMPLES * L);
    const a = Math.min(1, Math.abs(t) * 1.6);
    if (t > 0) C.push(0.25 + 0.75 * a, 0.2 + 0.5 * a, 0.1); else C.push(0.1, 0.25 + 0.4 * a, 0.3 + 0.7 * a);
  }
  points(new Float32Array(P), new Float32Array(C), 0.5, 0.85, true);
  line(new Float32Array([0, 0, 0, 0, 0, L]), '#ffffff', 0.5);
  for (const z of [0, L]) { const ring = []; for (let a = 0; a <= 64; a++) ring.push(O.radius * Math.cos(a / 32 * Math.PI), O.radius * Math.sin(a / 32 * Math.PI), z); line(new Float32Array(ring), '#3fe0d0', 0.4); }
  const src = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), new THREE.MeshBasicMaterial({ color: '#ffffff' })); src.position.set(0, 0, L / 2); group.add(src);
}

// ------------------------------------------------------------------ plots and panel
const PLOTS = [
  ['position x(n) − x(0)', (O) => { const D = O.displacement, d0 = [D[0], D[1], D[2]]; return [0, 1, 2].map((k) => (t) => D[3 * t + k] - d0[k]); }, ['#ffb44a', '#3fe0d0', '#a995ff']],
  ['circulation Z(n)', (O) => [0, 1, 2].map((k) => (t) => O.axial[3 * t + k]), ['#ffb44a', '#3fe0d0', '#a995ff']],
  ['clock offset against the screen', (O) => { const rate = O.n ? O.tape_depth[O.n - 1] / O.n : 1; return [(t) => (t ? O.tape_depth[t - 1] - rate * t : 0)]; }, ['#5fe3a1']],
];
function drawPlots() {       // three readouts against the own tick: side by side, stacked when the box is narrow
  const cv = $('obsPlot'); if (!O || !cv.clientWidth || !cv.clientHeight) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1), g = cv.getContext('2d');
  const W = cv.width = Math.round(cv.clientWidth * dpr), H = cv.height = Math.round(cv.clientHeight * dpr);
  g.clearRect(0, 0, W, H);
  const n = O.n, stack = cv.clientWidth < 640, cols = stack ? 1 : 3, rows = stack ? 3 : 1, gap = 16 * dpr, pw = (W - (cols - 1) * gap) / cols, ph = (H - (rows - 1) * gap) / rows, stride = Math.max(1, Math.floor(n / 600));
  g.font = `${12 * dpr}px Inter, Helvetica, Arial`; g.textBaseline = 'alphabetic';
  PLOTS.forEach(([title, make, colors], i) => {
    const series = make(O), x0 = (stack ? 0 : i) * (pw + gap), x1 = x0 + pw, top = (stack ? i : 0) * (ph + gap), y0 = top + 24 * dpr, y1 = top + ph;
    let lo = Infinity, hi = -Infinity;
    for (const s of series) for (let t = 0; t <= n; t += stride) { const v = s(t); lo = Math.min(lo, v); hi = Math.max(hi, v); }
    if (hi - lo < 1e-9) { hi += 1; lo -= 1; }
    g.fillStyle = 'rgba(255,255,255,.024)'; g.beginPath(); g.roundRect(x0, y0, x1 - x0, y1 - y0, 10 * dpr); g.fill();
    const pad = 6 * dpr, Y = (v) => y1 - pad - (y1 - y0 - 2 * pad) * (v - lo) / (hi - lo);
    series.forEach((s, k) => {
      g.strokeStyle = colors[k]; g.lineWidth = 1.4 * dpr; g.lineJoin = 'round'; g.shadowColor = colors[k]; g.shadowBlur = 6 * dpr; g.beginPath();
      for (let t = 0, first = true; t <= n; t += stride) { const x = x0 + (x1 - x0) * t / Math.max(1, n), y = Y(s(t)); first ? g.moveTo(x, y) : g.lineTo(x, y); first = false; }
      g.stroke(); g.shadowBlur = 0;
    });
    const xt = x0 + (x1 - x0) * tick / Math.max(1, n);
    g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = dpr; g.beginPath(); g.moveTo(xt, y0); g.lineTo(xt, y1); g.stroke();
    g.fillStyle = '#a9b5cc'; g.textAlign = 'left'; g.fillText(title, x0, top + 14 * dpr);
    g.fillStyle = '#7f8dab'; g.textAlign = 'right'; g.fillText(`${lo.toFixed(1)} to ${hi.toFixed(1)}`, x1, top + 14 * dpr);
  });
  g.textAlign = 'left';
}
function renderPanel() {     // the frame of the side panel, once per observer; updateValues() fills the numbers
  const ob = S.meta.observers.find((x) => x.carrier === O.carrier[0]);
  $('obs-side').innerHTML = `
    <div class="k">Observer</div>
    <div class="card ob-who">
      <div class="ob-title">Carrier ${fmt(O.carrier[0])}</div>
      <div class="ob-role">${ob ? ob.role : ''}</div>
      ${row('patch', fmt(O.m) + ' carriers, ' + Math.max(...O.patch_dist) + ' glue steps')}${row('record tape', fmt(O.n) + ' records')}
      <div class="ob-view"><button id="mRec">Records</button><button id="mWave">Wave reading</button><span class="q1-chip q1-declared">declared</span></div>
    </div>
    <div class="k">Clock</div>
    <div class="card ob-clock">
      <div class="ob-tick"><b id="ob-tick"></b><span id="ob-of"></span></div>
      <div class="ob-bar"><i id="ob-bar"></i></div>
      <div class="row"><span>synchronised depth</span><b id="ob-depth"></b></div>
      <div class="adv">
        <div class="row"><span>solver sweep</span><b id="ob-sweep"></b></div>
        <div class="row"><span>wave time of the declared reading</span><b id="ob-wt"></b></div>
        <div class="row"><span>position readout x(n)</span><b id="ob-x"></b></div>
        <div class="row"><span>axial circulation Z(n)</span><b id="ob-z"></b></div>
        <div class="row"><span>|Z|² / n</span><b id="ob-z2"></b></div>
      </div>
      <button class="adv-toggle" id="ob-more">more numbers</button>
    </div>
    <div class="k">Loads of its twelve ports</div>
    <div class="card ob-ports"><div class="ob-bars" id="ob-ports">${'<i></i>'.repeat(12)}</div></div>
    <div class="k">Last records of the tape</div>
    <div class="card ob-tape" id="ob-tape"></div>`;
  $('mRec').onclick = () => setMode('records'); $('mWave').onclick = () => setMode('wave');
  $('ob-more').onclick = (e) => { e.target.textContent = e.target.closest('.card').classList.toggle('adv-open') ? 'fewer numbers' : 'more numbers'; };
}
function updatePanel() {     // the values of the selected tick
  if (!$('ob-tick')) renderPanel();
  const i = Math.max(0, Math.min(O.n - 1, tick - 1)), sweep = O.n ? O.tape_sweep[i] : 0, depth = O.n ? O.tape_depth[i] : 0, lvl = S.meta.geometry.level;
  const waveTime = tick * (6 / 33) / (Math.sqrt(630) * Math.pow(4, lvl));     // one walk step per incident event at a port of degree 6
  const three = (A) => [0, 1, 2].map((k) => A[3 * tick + k].toFixed(2)).join(', '), Z = O.axial;
  $('mRec').classList.toggle('on', mode === 'records'); $('mWave').classList.toggle('on', mode === 'wave');
  $('ob-tick').textContent = fmt(tick); $('ob-of').textContent = `of ${fmt(O.n)} own ticks`; $('ob-bar').style.width = (100 * tick / Math.max(1, O.n)).toFixed(2) + '%';
  $('ob-depth').textContent = fmt(depth); $('ob-sweep').textContent = sweep; $('ob-wt').textContent = waveTime.toExponential(3);
  $('ob-x').textContent = three(O.displacement); $('ob-z').textContent = three(Z);
  $('ob-z2').textContent = tick ? ((Z[3 * tick] ** 2 + Z[3 * tick + 1] ** 2 + Z[3 * tick + 2] ** 2) / tick).toFixed(4) : '–';
  const bars = $('ob-ports').children;
  for (let p = 0; p < 12; p++) { const v = O.loads_by_tick[12 * tick + p]; bars[p].style.height = (8 + 9 * v) + 'px'; bars[p].title = `port ${p}: load ${v}`; }
  let recent = '';
  for (let j = Math.max(0, tick - 5); j < tick; j++) recent += `<div class="row"><span>${fmt(j + 1)} · ${O.tape_slot[j] < 30 ? 'own seam ' + O.tape_slot[j] : 'glue seam ' + (O.tape_slot[j] - 30)}</span><b>coin ${O.tape_coin[j]} · current ${O.tape_current[j]}</b></div>`;
  $('ob-tape').innerHTML = recent || '<div class="row"><span>the preparation</span><b>no record yet</b></div>';
  $('obsLabel').textContent = `tick ${fmt(tick)} of ${fmt(O.n)}`;           // the live counter beside the play control
}
async function setMode(mo) {
  mode = mo;
  if (mode === 'records') { waveJob++; await buildRecords(); }
  else { if (!wave && !(await buildWave())) return; if (mode === 'wave') showWave(); }
  updatePanel();
}
function setTick(t) {
  tick = Math.max(0, Math.min(O.n, t)); $('obsTick').value = tick;
  if (mode === 'records') placeNow(); else showWave();
  updatePanel(); drawPlots();
}
async function loadObserver(carrier) {
  setup();
  const key = S.name + ':' + carrier; loadedFor = key; waveJob++;
  const bar = busy($('obs-wait'), `reading the record tape of carrier ${fmt(carrier)}`);
  let data; try { data = await loadNpz(`${S.base}observers/obs_${carrier}.npz`); } finally { bar.done(); }
  if (loadedFor !== key) return;                    // another observer was chosen meanwhile
  O = data; wave = null; prepare(); $('obs-side').innerHTML = ''; resize();
  if (mode === 'records') buildRecords(); else if (await buildWave()) showWave();
  updatePanel(); drawPlots();
}
export async function initObserver() {
  const sel = $('obsSel'); sel.innerHTML = '';
  for (const ob of S.meta.observers) { const o = document.createElement('option'); o.value = ob.carrier; o.textContent = `carrier ${ob.carrier}: ${ob.role}`; sel.appendChild(o); }
  O = null; loadedFor = '';
  if (!hooked) {
    hooked = true;
    sel.onchange = () => loadObserver(parseInt(sel.value));
    $('obsTick').addEventListener('input', (e) => { if (O) setTick(parseInt(e.target.value)); });
    $('obsPlay').onclick = () => { if (!O) return; playing = !playing; $('obsPlay').textContent = playing ? '❚❚ pause' : '▶ play'; if (playing) { if (tick >= O.n) tick = 0; play(); } };
  }
  if ($('page-observer').classList.contains('on') && S.meta.observers.length) await loadObserver(parseInt(sel.value));
  window.__observerLoad = async (c) => { await loadObserver(c ?? parseInt(sel.value)); };
  window.__observerMode = async (mo, t) => { await setMode(mo); if (t !== undefined) setTick(t); };
}
export function observerShown() {
  const sel = $('obsSel');
  if (!S.meta.observers.length) { $('obs-side').innerHTML = '<div class="k">Observer</div><div class="card">This run stored no observer files.</div>'; return; }
  if (!O) loadObserver(parseInt(sel.value)); else resize();
}
function play() {
  if (!playing || !O) return;
  if (tick >= O.n) { playing = false; $('obsPlay').textContent = '▶ play'; return; }
  setTick(tick + Math.max(1, Math.floor(O.n / 400))); setTimeout(play, 60);
}
