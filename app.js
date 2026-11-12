// OPH universe viewer: slices of synchronised observer time of an exact law C run, the declared
// register defects on them with candidate names, one observer's records, and the particle table.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { loadNpz } from './npz.js';
// Every page module loads when its page first opens: the landing page (Journey) evaluates none of them, creates no
// WebGL context and loads no run. The universe renderer is created the first time the Screen page draws.
const mod = (f) => import(f);
let labReady = null;
const labModule = () => labReady || (labReady = mod('./lab.js').then((m) => { m.initLab(); return m; }));

export const $ = (id) => document.getElementById(id);
export const S = { name: '', base: '', meta: null, stats: null, display: null, cat: null, catRow: null, classStats: null,
  pmap: null, frames: [], cache: new Map(), runs: [] };
export const fmt = (v) => (typeof v === 'number' ? v.toLocaleString('en-US') : v);
export function row(k, v) { return `<div class="row"><span>${k}</span><b>${v}</b></div>`; }
export function marker(k, size = 16) {             // the screen marker of a register class as inline SVG
  const f = FAM[k], h = size / 2;
  if (!f) return '';
  const body = f.shape === 'ring' ? `<circle cx="${h}" cy="${h}" r="${h * 0.62}" fill="none" stroke="${f.color}" stroke-width="${size * 0.17}"/>`
    : f.shape === 'duo' ? `<circle cx="${h}" cy="${h}" r="${h * 0.78}" fill="none" stroke="${f.rim}" stroke-width="${size * 0.13}"/><circle cx="${h}" cy="${h}" r="${h * 0.42}" fill="${f.color}"/>`
    : `<circle cx="${h}" cy="${h}" r="${h * 0.7}" fill="${f.color}"/>`;
  return `<svg width="${size}" height="${size}" style="flex:none;filter:drop-shadow(0 0 ${size * 0.25}px ${f.color});margin-top:2px">${body}</svg>`;
}
// views of the run that are drawn once per run, the first time their page opens
const RUN_DONE = new Set();
const once = (k, f) => () => { if (RUN_DONE.has(k)) return; RUN_DONE.add(k); return f(); };
const RUN_VIEWS = {
  particles: once('particles', async () => { const [c, t] = await Promise.all([mod('./chart.js'), mod('./tables.js')]); c.renderChart(); await t.renderParticles(); }),
  data: once('data', async () => (await mod('./tables.js')).renderData()),
  findings: once('findings', async () => (await mod('./findings.js')).renderFindings()),
};
let runResolve; const runLoaded = new Promise((r) => { runResolve = r; });
let FAM_READY = false, helpStarted = false;
const startHelp = () => { if (helpStarted) return; helpStarted = true; mod('./help.js').then((m) => m.initHelp()).catch(() => {}); };
const CAUSE = ['alive', 'annihilation', 'fusion', 'split', 'exchange'];
export const FAM = {};            // class -> {id, color, anti}
let frameIndex = 0, playing = false, selected = -1, view = '3d', showIntra = false, showNames = true, showDensity = true;

// ------------------------------------------------------------------ data
export function classInfo(k) { return S.pmap.classes[k]; }
export function candidateName(k) {
  const c = classInfo(k), d = (l) => (S.pmap.multiplets.find((m) => m.label === l) || {}).description || l;
  if (c.multiplets.length) return c.multiplets.map(d).join(' or ');
  return 'conjugate of ' + c.conjugate_multiplets.map(d).join(' or ');
}
export const closedLoop = () => !!(S.meta && S.meta.config.twists);
export function chargeText(q) { return (q > 0 ? '+' : '−') + Math.abs(q); }
function chargeOfClass(k) { return k <= 3 ? k : k - 6; }       // residue mod 6 back to a signed charge (|q| <= 3; 3 keeps no sign)
export function sweepOfDepth(T) {
  // fractional solver sweep at which the mean causal depth reaches T (the sweep index is a solver counter)
  const d = S.stats.depth_mean;
  if (T <= 0) return 0;
  let lo = 0, hi = d.length - 1;
  if (T >= d[hi]) return d.length;
  while (lo < hi) { const m = (lo + hi) >> 1; if (d[m] < T) lo = m + 1; else hi = m; }
  const prev = lo ? d[lo - 1] : 0;
  return lo + (T - prev) / Math.max(1e-9, d[lo] - prev);
}
async function loadFrame(i) {
  const key = i + (showIntra ? 0.5 : 0);
  if (S.cache.has(key)) return S.cache.get(key);
  const f = S.frames[i];
  const z = await loadNpz(S.base + f.file);
  if (!z.intra_cls && !z.intra_id) { const l = $('intraLbl'); if (l) l.style.display = 'none'; showIntra = false; }   // the site copy keeps only the screen tier
  const parts = [['screen', 1]];
  if (showIntra && z.intra_cls) parts.push(['intra', 0]);
  let n = 0; for (const [p] of parts) n += z[p + '_cls'].length;
  const cls = new Uint8Array(n), ids = new Int32Array(n), pos = new Float32Array(3 * n), tier = new Uint8Array(n), birth = new Int32Array(n), face = new Int32Array(n);
  const charge = z.screen_charge ? new Int8Array(n) : null;
  if (charge) charge.set(z.screen_charge, 0);
  let o = 0;
  for (const [p, t] of parts) {
    const m = z[p + '_cls'].length;
    cls.set(z[p + '_cls'], o); ids.set(z[p + '_id'], o); pos.set(z[p + '_xyz'], 3 * o); birth.set(z[p + '_birth_depth'], o); face.set(z[p + '_face'], o);
    tier.fill(t, o, o + m); o += m;
  }
  const byId = new Map(); for (let j = 0; j < n; j++) byId.set(ids[j], j);
  const snap = { index: i, depth: f.depth, count: n, cls, ids, pos, tier, birth, face, byId, charge, loadMap: z.load_map, loads: z.loads || null, ticks: z.ticks || null };
  S.cache.set(key, snap);
  if (S.cache.size > 64) S.cache.delete(S.cache.keys().next().value);      // decoded slices held in memory (a trail reads 81 at most, re-read on demand)
  return snap;
}
function catRowOf(id) { const r = S.catRow.get(id); return r === undefined ? -1 : r; }

// ------------------------------------------------------------------ 3D scene
const canvas = $('gl');
let renderer = null, composer = null;      // created by ensureGL() when the Screen page first draws
const scene = new THREE.Scene();
scene.background = new THREE.Color('#04060d');
const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 90);
camera.position.set(0.4, 0.5, 3.05);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 1.06; controls.maxDistance = 8;
controls.autoRotate = true; controls.autoRotateSpeed = 0.32;
scene.add(new THREE.AmbientLight('#ffffff', 1.0));
let surface = null, wire = null, pointsFilled, pointsRing, pointsDuo, highlight, trail, bulkGroup = null;
// far stars, a soft halo around the screen, and bloom on the bright markers
(function backdrop() {
  const n = 2600, pos = new Float32Array(3 * n), col = new Float32Array(3 * n);
  let seed = 12345; const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let i = 0; i < n; i++) {
    const u = 2 * rnd() - 1, t = 2 * Math.PI * rnd(), r = 38 + 30 * rnd(), q = Math.sqrt(1 - u * u);
    pos[3 * i] = r * q * Math.cos(t); pos[3 * i + 1] = r * u; pos[3 * i + 2] = r * q * Math.sin(t);
    const w = 0.35 + 0.65 * rnd() ** 3, tint = rnd();
    col[3 * i] = w * (0.75 + 0.25 * tint); col[3 * i + 1] = w * 0.85; col[3 * i + 2] = w * (1.0 - 0.2 * tint);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const stars = new THREE.Points(g, new THREE.PointsMaterial({ size: 1.5, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false }));
  stars.frustumCulled = false; stars.renderOrder = -2; scene.add(stars);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1.0, 96, 64), new THREE.ShaderMaterial({
    vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'varying vec3 vN; void main(){ float i = pow(clamp(0.66 - dot(vN, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 3.2); gl_FragColor = vec4(0.16, 0.42, 0.95, 1.0) * i * 0.85; }',
    side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
  halo.scale.setScalar(1.13); halo.renderOrder = -1; scene.add(halo);
  scene.userData.halo = halo;
})();
// Without a hardware GPU the browser would emulate WebGL in software, and the screen with its bloom pass then blocks the
// tab for minutes. failIfMajorPerformanceCaveat refuses such a context; the page shows the flat map instead (?gl=any
// forces the 3D view).
let glFailed = false;
function ensureGL() {
  if (renderer) return true;
  if (glFailed) return false;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, failIfMajorPerformanceCaveat: !/[?&]gl=any/.test(location.search) }); }
  catch (e) {
    console.warn('no hardware WebGL: the screen is shown as a flat map', e); renderer = null; glFailed = true;
    for (const id of ['view3d', 'viewbulk']) { const b = $(id); if (b) { b.disabled = true; b.title = 'the 3D view needs hardware graphics (WebGL with a GPU)'; } }
    runLoaded.then(() => setView('map'));
    return false;
  }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(1024, 1024), 0.6, 0.5, 0.42)); composer.addPass(new OutputPass());
  resize(); return true;
}
let idleSince = 0;
canvas.addEventListener('pointerdown', () => { controls.autoRotate = false; idleSince = performance.now(); });

function sprite(kind, core, rim) {
  // soft glowing markers: a disc, a ring (antiparticle) and a two-tone marker (core and rim in two colours)
  // drawn at 256 px with a crisp edge and a soft outer glow; the core is lifted towards white so markers read as lights
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'), m = 128;
  const glow = (r0, r1, col, a0) => { const gr = g.createRadialGradient(m, m, r0, m, m, r1); gr.addColorStop(0, col.replace('A', a0)); gr.addColorStop(0.45, col.replace('A', (a0 * 0.35).toFixed(3))); gr.addColorStop(1, col.replace('A', '0')); g.fillStyle = gr; g.beginPath(); g.arc(m, m, r1, 0, Math.PI * 2); g.fill(); };
  if (kind === 'disc') {
    glow(46, 124, 'rgba(255,255,255,A)', 0.34);
    const core = g.createRadialGradient(m - 14, m - 14, 4, m, m, 54); core.addColorStop(0, '#ffffff'); core.addColorStop(0.55, 'rgba(255,255,255,.96)'); core.addColorStop(1, 'rgba(255,255,255,.82)');
    g.fillStyle = core; g.beginPath(); g.arc(m, m, 52, 0, Math.PI * 2); g.fill();
  } else if (kind === 'ring') { glow(50, 124, 'rgba(255,255,255,A)', 0.26); g.lineWidth = 22; g.strokeStyle = '#fff'; g.beginPath(); g.arc(m, m, 54, 0, Math.PI * 2); g.stroke(); }
  else { const hex = (h) => { const v = parseInt(h.slice(1), 16); return `${v >> 16},${(v >> 8) & 255},${v & 255}`; };
    glow(60, 124, `rgba(${hex(rim)},A)`, 0.36); g.lineWidth = 15; g.strokeStyle = rim; g.beginPath(); g.arc(m, m, 71, 0, Math.PI * 2); g.stroke();
    g.fillStyle = core; g.beginPath(); g.arc(m, m, 46, 0, Math.PI * 2); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function buildSurface() {
  for (const o of [surface, wire]) if (o) { scene.remove(o); o.geometry.dispose(); o.material.dispose(); }
  const tri = S.display.tri, xyz = S.display.mesh_xyz, n = tri.length / 3;
  const pos = new Float32Array(9 * n), col = new Float32Array(9 * n);
  for (let c = 0; c < n; c++) for (let k = 0; k < 3; k++) {
    const v = tri[3 * c + k];
    pos[9 * c + 3 * k] = xyz[3 * v] * 0.993; pos[9 * c + 3 * k + 1] = xyz[3 * v + 1] * 0.993; pos[9 * c + 3 * k + 2] = xyz[3 * v + 2] * 0.993;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: false });
  mat.onBeforeCompile = (sh) => {        // a soft blue rim towards the limb (display only; the cell colours are unchanged in the centre)
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vRimN; varying vec3 vRimV;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvRimN = normalize(normalMatrix * normalize(position)); vRimV = -mvPosition.xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vRimN; varying vec3 vRimV;')
      .replace('#include <opaque_fragment>', 'float rimF = pow(1.0 - clamp(dot(normalize(vRimN), normalize(vRimV)), 0.0, 1.0), 2.6);\noutgoingLight += vec3(0.08, 0.22, 0.55) * rimF * 0.6;\n#include <opaque_fragment>');
  };
  surface = new THREE.Mesh(g, mat);
  surface.renderOrder = 0; scene.add(surface);
  if (n <= 5200) {
    wire = new THREE.LineSegments(new THREE.WireframeGeometry(g), new THREE.LineBasicMaterial({ color: '#4cc3ff', transparent: true, opacity: 0.07 }));
    wire.scale.setScalar(1.002); scene.add(wire);
  } else wire = null;
}
function colorSurface(loadMap) {
  const col = surface.geometry.getAttribute('color');
  const n = col.count / 3;
  const base = [0.020, 0.040, 0.085];
  if (!showDensity || !loadMap) { for (let i = 0; i < col.count; i++) col.setXYZ(i, base[0], base[1], base[2]); col.needsUpdate = true; return null; }
  let mean = 0; for (let c = 0; c < n; c++) mean += loadMap[c]; mean /= n;
  let sd = 0; for (let c = 0; c < n; c++) sd += (loadMap[c] - mean) ** 2; sd = Math.sqrt(sd / n) || 1;
  for (let c = 0; c < n; c++) {
    const t = Math.max(-1, Math.min(1, (loadMap[c] - mean) / (2.5 * sd)));
    // above the mean: amber tint; below: blue tint
    const r = base[0] + (t > 0 ? 0.19 * t : 0.00), g = base[1] + (t > 0 ? 0.05 * t : 0.06 * -t), b = base[2] + (t > 0 ? 0.03 * t : 0.21 * -t);
    for (let k = 0; k < 3; k++) col.setXYZ(3 * c + k, r, g, b);
  }
  col.needsUpdate = true;
  return { mean, sd };
}
function buildPoints() {
  const mk = (kind, tex) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(0), 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(0), 3));
    const m = new THREE.PointsMaterial({ size: 0.03, vertexColors: true, map: tex, transparent: true, alphaTest: 0.04, sizeAttenuation: true, depthWrite: false });
    const p = new THREE.Points(g, m); p.frustumCulled = false; p.renderOrder = 3; p.userData.kind = kind; scene.add(p); return p;
  };
  const duo = Object.values(FAM).find((f) => f.shape === 'duo') || { color: '#3ee6a8', rim: '#4cc3ff' };
  pointsFilled = mk('disc', sprite('disc')); pointsRing = mk('ring', sprite('ring')); pointsDuo = mk('duo', sprite('duo', duo.color, duo.rim || '#4cc3ff'));
  highlight = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.028, 32), new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide, transparent: true, opacity: 0.95 }));
  highlight.visible = false; scene.add(highlight);
  trail = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.8 }));
  trail.visible = false; scene.add(trail);
}
function markerScale(count) {
  const level = S.meta.geometry.level;
  return parseFloat($('sizeSel').value) * Math.pow(2, (6 - Math.min(level, 9)) * 0.42) * Math.min(1, Math.sqrt(40000 / Math.max(1, count)));
}
let current = null;
function shapeOf(snap, i) { return snap.charge ? (snap.charge[i] < 0 ? 'ring' : 'disc') : FAM[snap.cls[i]].shape; }
function showFrame(snap) {
  current = snap;
  const B = { disc: [[], [], []], ring: [[], [], []], duo: [[], [], []] };
  for (let i = 0; i < snap.count; i++) {
    const f = FAM[snap.cls[i]]; const r = snap.tier[i] ? 1.004 : 1.002;
    const kind = shapeOf(snap, i), [P, C, I] = B[kind];
    P.push(snap.pos[3 * i] * r, snap.pos[3 * i + 1] * r, snap.pos[3 * i + 2] * r); I.push(i);
    if (kind === 'duo') C.push(1, 1, 1); else C.push(f.rgb.r, f.rgb.g, f.rgb.b);
  }
  snap.pick = { disc: B.disc[2], ring: B.ring[2], duo: B.duo[2] };
  for (const [pts, [P, C], k] of [[pointsFilled, B.disc, 1], [pointsRing, B.ring, 1.05], [pointsDuo, B.duo, 1.25]]) {
    pts.geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(P), 3));
    pts.geometry.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(C), 3));
    pts.geometry.boundingSphere = null; pts.geometry.boundingBox = null;      // picking tests the ray against these; they must follow the new positions
    pts.material.size = 0.046 * k * markerScale(snap.count);
  }
  const dens = colorSurface(snap.loadMap);
  updateHighlight(snap); drawMap(snap); updateNow(snap, dens); drawTimeline(); pickLabels();
  if (view === 'bulk') showBulk(snap.index);
}
function updateHighlight(snap) {
  if (selected < 0 || !snap.byId.has(selected)) { highlight.visible = false; return; }
  const i = snap.byId.get(selected);
  const p = new THREE.Vector3(snap.pos[3 * i], snap.pos[3 * i + 1], snap.pos[3 * i + 2]);
  highlight.position.copy(p.clone().multiplyScalar(1.007)); highlight.lookAt(p.clone().multiplyScalar(2));
  highlight.scale.setScalar(1.5 * markerScale(snap.count)); highlight.visible = view !== 'map';
}
async function drawTrail(id) {
  const pts = [];
  const lo = Math.max(0, frameIndex - 40), hi = Math.min(S.frames.length - 1, frameIndex + 40);
  for (let k = lo; k <= hi; k++) {
    const s = await loadFrame(k);
    if (s.byId.has(id)) { const i = s.byId.get(id); pts.push(s.pos[3 * i] * 1.006, s.pos[3 * i + 1] * 1.006, s.pos[3 * i + 2] * 1.006); }
  }
  trail.geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(pts), 3));
  trail.visible = pts.length >= 6 && selected === id && view !== 'map';
}
const BULK = 28;
async function showBulk(k) {
  if (!bulkGroup) { bulkGroup = new THREE.Group(); scene.add(bulkGroup); }
  while (bulkGroup.children.length) { const c = bulkGroup.children.pop(); c.geometry.dispose(); c.material.dispose(); }
  for (let j = k - 1; j >= Math.max(0, k - BULK); j--) {
    const s = await loadFrame(j);
    if (view !== 'bulk' || frameIndex !== k) return;
    const lag = (k - j) / BULK, r = 0.985 - 0.86 * lag;
    const P = new Float32Array(3 * s.count), C = new Float32Array(3 * s.count);
    for (let i = 0; i < s.count; i++) {
      P[3 * i] = s.pos[3 * i] * r; P[3 * i + 1] = s.pos[3 * i + 1] * r; P[3 * i + 2] = s.pos[3 * i + 2] * r;
      const c = FAM[s.cls[i]].rgb; C[3 * i] = c.r; C[3 * i + 1] = c.g; C[3 * i + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.014 * markerScale(s.count), vertexColors: true, transparent: true, opacity: 0.9 - 0.75 * lag, depthWrite: false }));
    pts.frustumCulled = false; bulkGroup.add(pts);
  }
}

// ------------------------------------------------------------------ labels
let labelRows = [];
const _v = new THREE.Vector3();
function pickLabels() {
  const host = $('labels'); host.innerHTML = ''; labelRows = [];
  if (!showNames || !current || view === 'map') return;
  const dir = camera.position.clone().normalize();
  const cand = [];
  for (let i = 0; i < current.count; i++) {
    const d = current.pos[3 * i] * dir.x + current.pos[3 * i + 1] * dir.y + current.pos[3 * i + 2] * dir.z;
    if (d > 0.55) cand.push([d + (current.ids[i] === selected ? 10 : 0) + (current.tier[i] ? 0.05 : 0), i]);
  }
  cand.sort((a, b) => b[0] - a[0]);
  // keep labels apart on the screen: take candidates from the centre outwards, skip those too close to one already taken
  const w = canvas.clientWidth, h = canvas.clientHeight, taken = [], chosen = [];
  for (const [, i] of cand.slice(0, 4000)) {
    _v.set(current.pos[3 * i], current.pos[3 * i + 1], current.pos[3 * i + 2]).project(camera);
    const x = (_v.x + 1) / 2 * w, y = (1 - _v.y) / 2 * h;
    if (taken.some((t) => Math.abs(t[0] - x) < 58 && Math.abs(t[1] - y) < 24)) continue;
    taken.push([x, y]); chosen.push(i);
    if (chosen.length >= 40) break;
  }
  for (const i of chosen) {
    const k = current.cls[i], el = document.createElement('div');
    el.className = 'lab'; el.style.color = FAM[k].color;
    el.textContent = closedLoop() ? chargeText(current.charge ? current.charge[i] : chargeOfClass(k)) : FAM[k].short;
    el.title = closedLoop() ? 'charge: integer holonomy of the seam offsets around this plaquette' : 'class ' + k + ': ' + FAM[k].label + ' (best guess by charge)';
    el.style.borderColor = FAM[k].color + '66';
    host.appendChild(el); labelRows.push([i, el]);
  }
}
function placeLabels() {
  if (!labelRows.length || !current) return;
  const w = canvas.clientWidth, h = canvas.clientHeight, cam = camera.position;
  for (const [i, el] of labelRows) {
    _v.set(current.pos[3 * i], current.pos[3 * i + 1], current.pos[3 * i + 2]);
    const facing = _v.x * cam.x + _v.y * cam.y + _v.z * cam.z > 1.0 / Math.max(1.0001, cam.length()) * 0.98;
    _v.multiplyScalar(1.004).project(camera);
    if (!facing || _v.z > 1) { el.style.display = 'none'; continue; }
    el.style.display = ''; el.style.left = ((_v.x + 1) / 2 * w) + 'px'; el.style.top = ((1 - _v.y) / 2 * h) + 'px';
  }
}
controls.addEventListener('end', pickLabels);

// ------------------------------------------------------------------ picking
const ray = new THREE.Raycaster();
canvas.addEventListener('pointerdown', (ev) => { canvas._down = [ev.clientX, ev.clientY]; });
canvas.addEventListener('pointerup', (ev) => {
  if (!canvas._down || Math.hypot(ev.clientX - canvas._down[0], ev.clientY - canvas._down[1]) > 4 || !current) return;
  const rect = canvas.getBoundingClientRect();
  ray.setFromCamera(new THREE.Vector2(((ev.clientX - rect.left) / rect.width) * 2 - 1, -((ev.clientY - rect.top) / rect.height) * 2 + 1), camera);
  ray.params.Points.threshold = 0.012 * markerScale(current.count) * camera.position.length() / 3;
  const hits = ray.intersectObjects([pointsFilled, pointsRing, pointsDuo]).filter((h) => h.point.dot(camera.position) > 0.9);
  if (!hits.length) return;
  hits.sort((a, b) => a.distanceToRay - b.distanceToRay);
  const hit = hits[0], i = current.pick[hit.object.userData.kind][hit.index];
  if (i !== undefined) select(current.ids[i]);
});

// ------------------------------------------------------------------ map
const map = $('map');
const lonlat = (x, y, z) => [Math.atan2(y, x), Math.asin(Math.max(-1, Math.min(1, z)))];
function drawMap(snap) {
  if (view !== 'map') return;
  const g = map.getContext('2d');
  const W = map.width = map.clientWidth * devicePixelRatio, H = map.height = map.clientHeight * devicePixelRatio;
  g.fillStyle = '#090d16'; g.fillRect(0, 0, W, H);
  const X = (lon) => (lon / Math.PI + 1) / 2 * W, Y = (lat) => (1 - (lat / (Math.PI / 2) + 1) / 2) * H;
  g.strokeStyle = 'rgba(34,48,77,.9)'; g.lineWidth = devicePixelRatio;
  for (let k = -2; k <= 2; k++) { const y = Y(k * Math.PI / 6); g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  for (let k = -5; k <= 6; k++) { const x = X(k * Math.PI / 6); g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  const r = Math.max(1.1, 2.6 * markerScale(snap.count)) * devicePixelRatio;
  map._pts = [];
  for (let i = 0; i < snap.count; i++) {
    const [lo, la] = lonlat(snap.pos[3 * i], snap.pos[3 * i + 1], snap.pos[3 * i + 2]);
    const f = FAM[snap.cls[i]], x = X(lo), y = Y(la);
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2);
    const kind = shapeOf(snap, i);
    if (kind === 'ring') { g.lineWidth = 1.4 * devicePixelRatio; g.strokeStyle = f.color; g.stroke(); } else { g.fillStyle = f.color; g.fill(); }
    if (kind === 'duo') { g.beginPath(); g.arc(x, y, r * 1.7, 0, Math.PI * 2); g.lineWidth = 1.2 * devicePixelRatio; g.strokeStyle = f.rim || '#4cc3ff'; g.stroke(); }
    if (snap.ids[i] === selected) { g.beginPath(); g.arc(x, y, r * 2.6, 0, Math.PI * 2); g.lineWidth = 1.6 * devicePixelRatio; g.strokeStyle = '#fff'; g.stroke(); }
    map._pts.push([x, y, snap.ids[i]]);
  }
}
map.addEventListener('click', (ev) => {
  if (!map._pts) return;
  const rect = map.getBoundingClientRect();
  const mx = (ev.clientX - rect.left) * devicePixelRatio, my = (ev.clientY - rect.top) * devicePixelRatio;
  let best = null, bd = 1e9;
  for (const p of map._pts) { const d = Math.hypot(p[0] - mx, p[1] - my); if (d < bd) { bd = d; best = p; } }
  if (best && bd < 16 * devicePixelRatio) select(best[2]);
});

// ------------------------------------------------------------------ side panel
const idLink = (i) => (i < 0 ? '–' : `<a href="#" data-id="${i}">#${i}</a>`);
function frameOfDepth(T) { let best = 0; for (let k = 0; k < S.frames.length; k++) { const d = S.frames[k].depth; if (d !== null && d <= T) best = k; } return best; }
export function select(id) {
  selected = id; renderCard(); controls.autoRotate = false; idleSince = performance.now();
  if (current) { updateHighlight(current); drawMap(current); pickLabels(); }
  drawTrail(id);
  zoomModule().then((z) => z && z.showZoom(id));      // the neighbourhood of the selected defect, in the look of the Defects page
}
let zoomPromise = null;
function zoomModule() {
  if (!zoomPromise) zoomPromise = import('./zoom.js').then((z) => { z.mountZoom(); return z; }).catch((e) => { console.error('zoom', e); return null; });
  return zoomPromise;
}
function faceText(f) {
  const g = S.meta.geometry;
  return f < g.intra_faces ? `inside carrier ${fmt(Math.floor(f / 20))}, template face ${f % 20}` : `screen plaquette ${fmt(f - g.intra_faces)}`;
}
function renderCard() {
  const el = $('selected');
  const r = selected < 0 ? -1 : catRowOf(selected);
  if (r < 0) { el.innerHTML = '<span style="color:var(--faint)">click a defect</span>'; return; }
  const c = S.cat, k = c.cls[r], f = FAM[closedLoop() ? ((((k > 127 ? k - 256 : k) % 6) + 6) % 6) || 1 : k], ci = classInfo(closedLoop() ? 0 : k);
  const alive = c.death_sweep[r] < 0;
  const endDepth = S.classStats.depth_at_end;
  const life = (alive ? endDepth : c.death_depth[r]) - c.birth_depth[r];
  const born = c.parent1[r] < 0 ? 'as one of a conjugate pair' : 'from ' + idLink(c.parent1[r]) + (c.parent2[r] >= 0 ? ' and ' + idLink(c.parent2[r]) : '');
  if (closedLoop()) {
    const q = k > 127 ? k - 256 : k;
    const col = FAM[((q % 6) + 6) % 6].color;
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <span class="${q < 0 ? 'ring' : 'dot'}" style="background:${q < 0 ? 'transparent' : col};border-color:${col}"></span>
        <div><div style="font-weight:700;font-size:16px">Charge #${fmt(selected)} <span class="cand">q = ${chargeText(q)}</span></div>
        <div style="color:var(--muted);font-size:12.5px">integer holonomy of the seam offsets around a screen plaquette</div></div>
      </div>
      <div class="row" style="display:block"><span>what it does</span><div class="note" style="color:var(--soft)">It drives a permanent circulation of the committed current, ${Math.abs(q)}/2 units per sweep around every loop that encloses it,
        and keeps repairs working around it. Opposite charges attract and annihilate; equal charges repel. No particle name is attached.</div></div>
      ${row('status', alive ? '<span style="color:var(--green)">alive at the end of the run</span>' : CAUSE[c.cause[r]] + ' at depth ' + fmt(c.death_depth[r]))}
      ${row('born', 'depth ' + fmt(c.birth_depth[r]) + ' (sweep ' + c.birth_sweep[r] + ') ' + born)}
      ${row('lifetime', fmt(life) + ' depth units')}${row('hops', fmt(c.hops[r]))}
      ${row('partner', idLink(c.partner[r]))}${row('children', (c.child1[r] >= 0 ? idLink(c.child1[r]) : '–') + (c.child2[r] >= 0 ? ', ' + idLink(c.child2[r]) : ''))}
      ${row('born on', faceText(c.birth_face[r]))}${row('last on', faceText(c.last_face[r]))}
      <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button data-depth="${c.birth_depth[r]}">go to birth</button>
        ${alive ? '' : `<button data-depth="${Math.max(0, c.death_depth[r] - 1)}">go to end</button>`}</div>`;
    el.querySelectorAll('a[data-id]').forEach((a) => a.onclick = (e) => { e.preventDefault(); select(parseInt(a.dataset.id)); });
    el.querySelectorAll('button[data-depth]').forEach((b) => b.onclick = () => setFrame(frameOfDepth(parseInt(b.dataset.depth)) + (b.textContent.includes('birth') ? 1 : 0)));
    return;
  }
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      ${marker(k, 22)}
      <div><div style="font-weight:700;font-size:16px">Defect #${fmt(selected)} <span class="cand" style="color:${f.color};border-color:${f.color}55">flux ${f.short}</span></div>
      <div style="color:var(--muted);font-size:12.5px">register class ${k} · family ${f.id} · ${c.tier[r] ? 'screen tier' : 'internal tier of one carrier'}</div></div>
    </div>
    <div class="row" style="display:block"><span>reading</span><div style="color:${f.color};font-weight:700;margin-top:2px;font-size:15px">${f.label}</div>
      <div class="note">${f.detail}. ${ci.reading}. A flux is not a particle of matter: matter would be a quantum with internal levels, which these runs do not carry.</div></div>
    ${ci.targets.length ? row('comparison targets with a component of this class', ci.targets.join(', ')) : ''}
    ${row('gives a phase to', ci.visible_to.join(', ') || 'none')}
    ${row('invisible to', ci.invisible_to.join(', ') || 'none')}
    ${row('status', alive ? '<span style="color:var(--green)">alive at the end of the run</span>' : CAUSE[c.cause[r]] + ' at depth ' + fmt(c.death_depth[r]))}
    ${row('born', 'depth ' + fmt(c.birth_depth[r]) + ' (sweep ' + c.birth_sweep[r] + ') ' + born)}
    ${row('lifetime', fmt(life) + ' depth units')}
    ${row('hops', fmt(c.hops[r]))}
    ${row('partner', idLink(c.partner[r]))}
    ${row('children', (c.child1[r] >= 0 ? idLink(c.child1[r]) : '–') + (c.child2[r] >= 0 ? ', ' + idLink(c.child2[r]) : ''))}
    ${row('born on', faceText(c.birth_face[r]))}
    ${row('last on', faceText(c.last_face[r]))}
    <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
      <button data-depth="${c.birth_depth[r]}">go to birth</button>
      ${alive ? '' : `<button data-depth="${Math.max(0, c.death_depth[r] - 1)}">go to end</button>`}
      <button data-table="${k}">table row</button>
    </div>`;
  el.querySelectorAll('a[data-id]').forEach((a) => a.onclick = (e) => { e.preventDefault(); select(parseInt(a.dataset.id)); });
  el.querySelectorAll('button[data-depth]').forEach((b) => b.onclick = () => setFrame(frameOfDepth(parseInt(b.dataset.depth)) + (b.textContent.includes('birth') ? 1 : 0)));
  el.querySelectorAll('button[data-table]').forEach((b) => b.onclick = () => { showPage('particles'); const t = document.getElementById('class-row-' + b.dataset.table); if (t) t.scrollIntoView({ block: 'center' }); });
}
function phaseOf(f) {
  if (f.depth === 0) return '<span style="color:var(--violet)">the preparation: no repair has happened</span>';
  if (closedLoop()) {
    const n = f.counts_screen.slice(1).reduce((a, b) => a + b, 0);
    return n ? `<span style="color:var(--amber)">${fmt(n)} charges keep currents circulating</span>` : '<span style="color:var(--teal)">no charge left: the offsets are a pure relabelling</span>';
  }
  if (f.unsettled_ports > 0) return `<span style="color:var(--amber)">settling: ${fmt(f.unsettled_ports)} ports outside the balanced band</span>`;
  return '<span style="color:var(--teal)">balanced class: only tie swaps move units</span>';
}
function updateNow(snap, dens) {
  const f = S.frames[snap.index], m = S.meta, cs = f.counts_screen, ci = f.counts_intra;
  const end = f.depth === null;
  const T = end ? S.classStats.depth_at_end : f.depth;
  const sw = end ? m.sweeps : sweepOfDepth(T);
  let more = row('solver sweep, for orientation', '≈ ' + sw.toFixed(sw < 10 ? 2 : 1) + ' of ' + m.sweeps)
    + row('scaled time τ', (sw * m.scaled_time.tau_per_sweep).toExponential(2))
    + row('observer clocks on this slice', `${fmt(f.ticks_min)} to ${fmt(f.ticks_max)} ticks`);
  let h = row('synchronised time', end ? 'end of the run (every record)' : 'causal depth ' + fmt(T))
    + row('phase', phaseOf(f))
    + (closedLoop() ? row('charges of size 1 / 2 / 3', `${fmt(cs[1] + cs[5])} / ${fmt(cs[2] + cs[4])} / ${fmt(cs[3])}`)
      : row('left-handed quark classes · right-handed quark classes · class 3', `<span style="color:${FAM[1].color}">${fmt(cs[1] + cs[5])}</span> · <span style="color:${FAM[4].color}">${fmt(cs[2] + cs[4])}</span> · <span style="color:${FAM[3].color}">${fmt(cs[3])}</span>`)
        + row('of these, antiparticles', `<span style="color:${FAM[5].color}">${fmt(cs[5])}</span> · <span style="color:${FAM[2].color}">${fmt(cs[2])}</span> · <span style="color:var(--faint)">own conjugate</span>`));
  if (m.display_sample > 1) more += row('markers drawn', `1 in ${m.display_sample} identities (counts are exact)`);
  if (ci) more += row('inside carriers, same three kinds', `${fmt(ci[1] + ci[5])} · ${fmt(ci[2] + ci[4])} · ${fmt(ci[3])}`);
  more += row('descent functional above its minimum', fmt(f.V - m.totals.V_minimum));
  if (dens) more += row('load per display cell', `${dens.mean.toFixed(1)} ± ${dens.sd.toFixed(2)}`);
  const now = $('now');
  if (!now.dataset.wired) { now.dataset.wired = '1'; now.addEventListener('click', (e) => { if (e.target.closest('.adv-toggle')) { now.classList.toggle('adv-open'); const t = now.querySelector('.adv-toggle'); if (t) t.textContent = now.classList.contains('adv-open') ? 'less' : 'details'; } }); }
  now.innerHTML = h + `<div class="adv">${more}</div><button class="adv-toggle">${now.classList.contains('adv-open') ? 'less' : 'details'}</button>`;
  $('framelabel').textContent = end ? `end of the run · sweep ${m.sweeps}` : `synchronised time ${fmt(T)} · ≈ sweep ${sw.toFixed(1)} · slice ${snap.index + 1} of ${S.frames.length}`;
}
function renderLegend() {
  let h = '';
  if (closedLoop()) {
    for (const fam of S.pmap.families) {
      const q = fam.classes[0];
      h += `<div><span class="dot" style="background:${fam.color}"></span><span><b style="color:${fam.color}">+${q}</b> and <span class="ring" style="border-color:${fam.color};display:inline-block;vertical-align:-2px"></span>
        <b style="color:${fam.color}">−${q}</b> charges of size ${q}</span></div>`;
    }
    $('legend').innerHTML = h + `<div class="note">Closed-loop run (declared extension, not the exact layer): every seam carries an integer offset and compares one end with the transported other end.
      A charge is a screen plaquette whose offsets have nonzero holonomy. It acts back on the loads: currents circulate around it, opposite charges attract and annihilate, equal charges repel.
      Charges are integers, not Z6 classes, and carry no particle names.</div>`;
    return;
  }
  for (const k of [1, 5, 4, 2, 3]) {
    const f = FAM[k];
    h += `<div style="cursor:pointer" title="open the ${f.label} card" onclick="window.__openClass && window.__openClass(${k})">${marker(k, 16)}<span><b style="color:${f.color}">${f.label}</b> <span style="color:var(--faint)">· class ${k} · open</span></span></div>`;
  }
  const G = Object.fromEntries(S.pmap.groups.map((g) => [g.id, g]));
  h += `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #16213a;display:block;color:var(--muted);font-size:12.5px">Not on the screen as defects:
    <b style="color:${G.photon.color}">photon</b>, <b style="color:${G.gluon.color}">gluons</b>, <b style="color:${G.weak.color}">W and Z</b>
    and the right-handed <b style="color:${G.lepton.color}">charged leptons</b> carry class 0. The <b style="color:${G.higgs.color}">Higgs</b> doublet shares class 3 with the lepton doublet (<a href="#" onclick="window.__openClass && window.__openClass(0); return false">the neutral class</a>). <a href="#" id="toChart">Open the particle chart</a>.</div>`;
  h += `<div class="note">Each defect class is exactly the centre class 6Y mod 6 of a Standard Model multiplet (exact on all 32 code patterns). The defect is the flux of its class; the quarks and leptons are the fermionic quanta that carry it. A disc is a particle class, a ring its antiparticle, the two-tone marker the lepton doublet and Higgs class. The register is declared and does not act back on the loads; generation and mass are not carried by the class. Click a class for its card.</div>`;
  $('legend').innerHTML = h;
  $('toChart').onclick = (e) => { e.preventDefault(); showPage('particles'); };
}
function renderAbout() {
  const g = S.meta.geometry, c = S.meta.config, t = S.meta.totals;
  $('about').innerHTML = row('observers (carriers)', fmt(g.carriers)) + row('ports / seams', fmt(g.ports) + ' / ' + fmt(g.seams))
    + row('law', closedLoop() ? 'transported contrast with twists (extension)' : 'law C, exact') + row('preparation', S.meta.preparation.name) + row('schedule seed', c.seed)
    + row('sweeps', fmt(S.meta.sweeps)) + row('balanced after', t.balanced ? fmt(t.attempts_to_balanced_class) + ' attempts' : 'not reached')
    + row('slices', S.frames.length) + row('identities', fmt(S.meta.identities)) + row('backend', c.backend)
    + `<div class="note">${S.meta.regime}</div>`;
}

// ------------------------------------------------------------------ timeline
const tl = $('tl');
let tlHover = -1;
const rgbaOf = (col, a) => { if (col.startsWith('rgba')) return col.replace(/[\d.]+\)$/, a + ')'); const v = parseInt(col.slice(1), 16); return `rgba(${v >> 16},${(v >> 8) & 255},${v & 255},${a})`; };
function tlSeries() {
  return [[(f) => f.counts_screen[1] + f.counts_screen[5], FAM[1].color, closedLoop() ? 'charges of size 1' : 'left-handed quark classes 1 + 5'],
    [(f) => f.counts_screen[2] + f.counts_screen[4], FAM[4].color, closedLoop() ? 'charges of size 2' : 'right-handed quark classes 4 + 2'],
    [(f) => f.counts_screen[3], FAM[3].color, closedLoop() ? 'charges of size 3' : 'lepton doublet and Higgs class 3'],
    [(f) => f.unsettled_ports, 'rgba(147,163,192,.55)', 'ports outside the balanced band']];
}
function drawTimeline() {
  // counts per slice on a log scale: glowing curves over soft area fills, the played part lit, the slice shown as a bright cursor
  const g = tl.getContext('2d'), dpr = devicePixelRatio;
  const W = tl.width = tl.clientWidth * dpr, H = tl.height = tl.clientHeight * dpr;
  g.clearRect(0, 0, W, H);
  const n = S.frames.length, pad = 10 * dpr;
  const X = (i) => pad + i / Math.max(1, n - 1) * (W - 2 * pad);
  const series = tlSeries();
  let max = 1; for (const f of S.frames) for (const [sel] of series) max = Math.max(max, sel(f));
  const lm = Math.log10(1 + max), Y = (v) => H - 5 * dpr - Math.log10(1 + v) / lm * (H - 14 * dpr);
  g.font = `${9.5 * dpr}px Inter, Helvetica, Arial`;
  const every = Math.max(1, Math.ceil(13 * dpr / Math.max(1, Y(0) - Y(9))));      // label only decades that have room
  for (let e = 0; e <= Math.floor(lm); e++) {
    const y = Y(10 ** e - 1 + (e ? 1 : 0)); g.strokeStyle = 'rgba(120,150,215,.07)'; g.lineWidth = dpr; g.beginPath(); g.moveTo(pad, y); g.lineTo(W - pad, y); g.stroke();
    if (e % every === 0) { g.fillStyle = 'rgba(147,163,192,.38)'; g.fillText('10' + '⁰¹²³⁴⁵⁶⁷⁸⁹'[e], W - pad - 22 * dpr, y - 2 * dpr); }
  }
  const xc = X(frameIndex);
  g.fillStyle = 'rgba(111,177,255,.04)'; g.fillRect(pad, 0, xc - pad, H);
  for (const [sel, col] of series) {
    const grey = col.startsWith('rgba');
    g.beginPath(); S.frames.forEach((f, i) => { const y = Y(sel(f)); i ? g.lineTo(X(i), y) : g.moveTo(X(i), y); });
    if (!grey) {
      g.save(); g.lineTo(X(n - 1), H); g.lineTo(X(0), H); g.closePath();
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, rgbaOf(col, 0.16)); gr.addColorStop(1, rgbaOf(col, 0)); g.fillStyle = gr; g.fill(); g.restore();
      g.beginPath(); S.frames.forEach((f, i) => { const y = Y(sel(f)); i ? g.lineTo(X(i), y) : g.moveTo(X(i), y); });
    }
    g.strokeStyle = col; g.lineWidth = (grey ? 1.2 : 1.7) * dpr; g.lineJoin = 'round'; g.shadowColor = grey ? 'transparent' : col; g.shadowBlur = grey ? 0 : 7 * dpr;
    g.stroke(); g.shadowBlur = 0;
  }
  if (tlHover >= 0) { const xh = X(tlHover); g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = dpr; g.beginPath(); g.moveTo(xh, 0); g.lineTo(xh, H); g.stroke(); }
  const gl = g.createLinearGradient(0, 0, 0, H); gl.addColorStop(0, 'rgba(255,255,255,0)'); gl.addColorStop(0.5, 'rgba(255,255,255,.95)'); gl.addColorStop(1, 'rgba(255,255,255,.25)');
  g.strokeStyle = gl; g.lineWidth = 1.5 * dpr; g.shadowColor = '#9fd0ff'; g.shadowBlur = 10 * dpr; g.beginPath(); g.moveTo(xc, 0); g.lineTo(xc, H); g.stroke(); g.shadowBlur = 0;
  for (const [sel, col] of series) { if (col.startsWith('rgba')) continue; g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 8 * dpr; g.beginPath(); g.arc(xc, Y(sel(S.frames[frameIndex])), 3 * dpr, 0, 2 * Math.PI); g.fill(); g.shadowBlur = 0; }
}
const tlIndex = (ev) => { const rect = tl.getBoundingClientRect(); return Math.max(0, Math.min(S.frames.length - 1, Math.round((ev.clientX - rect.left - 10) / (rect.width - 20) * (S.frames.length - 1)))); };
tl.addEventListener('click', (ev) => setFrame(tlIndex(ev)));
tl.addEventListener('mousemove', (ev) => {        // every count of the hovered slice
  if (!S.frames.length) return;
  const i = tlIndex(ev), f = S.frames[i], tip = $('tl-tip') || Object.assign(document.createElement('div'), { id: 'tl-tip' });
  if (!tip.parentNode) $('timeline').appendChild(tip);
  tip.innerHTML = `<b>${f.depth === null ? 'end of the run' : 'causal depth ' + fmt(f.depth)}</b> <span>slice ${i + 1} of ${S.frames.length}</span>`
    + tlSeries().map(([sel, col, name]) => `<div><i style="background:${col}"></i>${name}<b>${fmt(sel(f))}</b></div>`).join('');
  const rect = $('timeline').getBoundingClientRect(), x = ev.clientX - rect.left;
  tip.style.display = 'block'; tip.style.left = Math.min(rect.width - tip.offsetWidth - 8, Math.max(8, x + 14)) + 'px';
  if (tlHover !== i) { tlHover = i; drawTimeline(); }
});
tl.addEventListener('mouseleave', () => { tlHover = -1; const tip = $('tl-tip'); if (tip) tip.style.display = 'none'; if (S.frames.length) drawTimeline(); });
export async function setFrame(k) {
  frameIndex = Math.max(0, Math.min(S.frames.length - 1, k));
  $('frame').value = frameIndex;
  const snap = await loadFrame(frameIndex);
  if (snap.index !== frameIndex) return;
  showFrame(snap);
  if (zoomPromise) zoomPromise.then((z) => z && z.zoomFrame(frameIndex));
  if (frameIndex + 1 < S.frames.length) loadFrame(frameIndex + 1);
}
function buildEpochs() {
  const F = S.frames, tot = (f) => f.counts_screen.slice(1).reduce((a, b) => a + b, 0);
  let hot = 0; F.forEach((f, i) => { if (tot(f) > tot(F[hot])) hot = i; });
  const first = F.findIndex((f) => f.depth === 1);
  const settled = F.findIndex((f) => f.depth !== null && f.depth > 0 && f.unsettled_ports === 0);
  const half = F.findIndex((f, i) => i > hot && tot(f) < tot(F[hot]) / 2);
  const items = [['preparation', 0], ['first records', first], ['hottest', hot], ['cooling', half], ['balanced', settled], ['end', F.length - 1]];
  $('epochs').innerHTML = items.filter((x) => x[1] >= 0).map(([n, i]) => `<button data-i="${i}">${n}</button>`).join('');
  $('epochs').querySelectorAll('button').forEach((b) => b.onclick = () => setFrame(parseInt(b.dataset.i)));
}

// ------------------------------------------------------------------ controls and pages
$('frame').addEventListener('input', (e) => setFrame(parseInt(e.target.value)));
$('play').onclick = () => { playing = !playing; $('play').textContent = playing ? '❚❚ pause' : '▶ play'; if (playing) step(); };
async function step() {
  if (!playing) return;
  const sp = parseInt($('speed').value);
  if (frameIndex + sp >= S.frames.length) { playing = false; $('play').textContent = '▶ play'; return; }
  await setFrame(frameIndex + sp); setTimeout(step, 140);
}
function setView(v) {
  if (glFailed) v = 'map';
  view = v;
  for (const [id, name] of [['view3d', '3d'], ['viewmap', 'map'], ['viewbulk', 'bulk']]) $(id).classList.toggle('on', name === v);
  canvas.style.display = v === 'map' ? 'none' : ''; map.style.display = v === 'map' ? 'block' : 'none';
  if (bulkGroup) bulkGroup.visible = v === 'bulk';
  surface.material.transparent = v === 'bulk'; surface.material.opacity = v === 'bulk' ? 0.10 : 1; surface.material.depthWrite = v !== 'bulk'; surface.material.needsUpdate = true;
  if (wire) wire.visible = v !== 'bulk';
  controls.minDistance = v === 'bulk' ? 0.3 : 1.06;
  $('hint').textContent = v === '3d' ? 'drag to orbit · wheel to zoom · click a defect for its card · space plays · arrows step'
    : v === 'map' ? 'equal-angle map of the screen · click a defect'
    : 'the selected slice is the surface; each shell inward is an earlier slice of synchronised time · zoom in to enter';
  if (current) showFrame(current);
}
// side panel: clicking a heading folds its card; the run facts start folded
document.querySelectorAll('#side > .k').forEach((k, i) => {
  k.classList.add('fold-k'); if (i === 3) k.classList.add('shut');
  k.addEventListener('click', (e) => { if (!e.target.closest('.hq')) k.classList.toggle('shut'); });
});
$('view3d').onclick = () => setView('3d'); $('viewmap').onclick = () => setView('map'); $('viewbulk').onclick = () => setView('bulk');
$('namesChk').onchange = (e) => { showNames = e.target.checked; pickLabels(); };
$('densChk').onchange = (e) => { showDensity = e.target.checked; if (current) showFrame(current); };
$('intraChk').onchange = (e) => { showIntra = e.target.checked; setFrame(frameIndex); };
$('sizeSel').onchange = () => current && showFrame(current);
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || !$('page-universe').classList.contains('on')) return;
  if (e.code === 'Space') { e.preventDefault(); $('play').click(); }
  if (e.code === 'ArrowRight') setFrame(frameIndex + 1);
  if (e.code === 'ArrowLeft') setFrame(frameIndex - 1);
});
// The journey: step groups from left to right, each with its pages. A connector between two steps is the map that
// carries one into the next (opened from journey.js).
const GROUPS = [
  { id: 'journey', label: 'Journey', pages: [['journey', 'The chain', 'the whole chain from the holographic screen to the particles and their masses, with the maps between the steps']] },
  { id: 'screen', label: 'Holographic screen', step: 1, pages: [['universe', 'Screen', 'the run: every observer on the screen, with its defects, cut by cut'], ['carrier', 'One carrier', 'one cell of the screen: twelve ports, thirty seams, twenty faces'], ['observer', 'One observer', 'one observer with its own clock and record tape']] },
  { id: 'defects', label: 'Defects', step: 1, map: 'twist', pages: [['defects', 'Catalogue', 'every defect class moving on the screen, beside the particle class it represents']] },
  { id: 'lattice', label: 'Lattice', step: 1, map: 'links', pages: [['lattice', 'From defects to the lattice', 'how wandering defects become a lattice computation']] },
  { id: 'field', label: 'Field', step: 1, map: 'continuum', pages: [['readout', 'Continuum field', 'defects of the run beside the relativistic field in 3+1 dimensions'], ['nowave', 'No wave function', 'the double slit on the model: a position becomes real when an observer writes a record of it'], ['space', 'Forces', 'quanta and gauge waves moving through the cubic family of carriers']] },
  { id: 'early', label: 'Early universe', step: 1, map: 'heat', pages: [['cosmos', 'First defects', 'the first defects of the run beside the early plasma'], ['cosmology', 'Against ΛCDM', 'the early universe and the cosmos of the model beside the measured sky and the standard model of cosmology'], ['timeline', 'Timeline', 'from the first tick to the first second'], ['transitions', 'Phase transitions', 'the electroweak crossover, colour confinement and the binding of quarks into hadrons, on the lattice']] },
  { id: 'particles', label: 'Particles', step: 1, map: 'centre', pages: [['classes', 'Classes', 'the six classes and the Standard Model multiplets they are'], ['decoder', 'Decoder', 'from a pattern of the five-level code to the particle and its charges'], ['map', 'Map', 'every known particle beside its object in the model']] },
  { id: 'masses', label: 'Masses', step: 1, map: 'reads', pages: [['masses', 'Masses', 'relative masses and rest masses beside the measured values'], ['leptons', 'Lepton derivation', 'the charged-lepton mass hierarchy from the read count of the carrier, against CODATA and PDG'], ['spectrum', 'Full spectrum', 'every particle from its class to a mass in GeV, by status'], ['couplings', 'Couplings', 'the coupling chain from the cell to the electroweak scale']] },
  { id: 'results', label: 'Results', sep: 1, pages: [['matches', 'Matches to nature', 'every match of the model with our universe in one list'], ['results', 'Numbers and status', 'every number of the model beside the measured value, with its status'], ['constructions', 'Finite constructions', 'the executable constructions behind the matches, with proofs and complete records'], ['openwave', 'OpenWave status', 'the 31 criteria of the OpenWave comparison and where the model stands on each']] },
  // not in the navigation, reachable by address: story, detector, particles (tables), findings, data
];
const PAGE_GROUP = {}, LAST = {};
for (const g of GROUPS) for (const [p] of g.pages) PAGE_GROUP[p] = g;
const openMap = (id) => import('./journey.js').then((m) => m.openMap && m.openMap(id)).catch(() => {});
// papers and book chapters for the page on screen, at the right end of the strip below the header
function renderRead(p) {
  let box = $('readlinks');
  if (!box) { box = document.createElement('span'); box.id = 'readlinks'; const sub = $('subnav'); if (!sub) return; sub.insertBefore(box, $('uni-controls') || null); }
  import('./links.js').then(({ readLinks }) => {
    const L = readLinks(p);
    box.innerHTML = L.length ? '<span class="rl-k">read</span>' + L.map(([t, u, title]) => `<a href="${u}" target="_blank" rel="noopener" title="${title}">${t} ↗</a>`).join('') : '';
  });
}
function buildNav() {
  const nav = $('nav'); if (!nav || nav.dataset.built) return; nav.dataset.built = '1';
  for (const g of GROUPS) {
    if (g.sep) { const s = document.createElement('span'); s.className = 'nav-sep'; nav.appendChild(s); }
    if (g.map) { const m = document.createElement('button'); m.className = 'nav-map'; m.textContent = '›'; m.title = 'the map into this step'; m.onclick = () => openMap(g.map); nav.appendChild(m); }
    const b = document.createElement('button'); b.className = 'tab'; b.dataset.group = g.id; b.textContent = g.label; b.title = g.pages.map((x) => x[1]).join(' · ');
    b.onclick = () => showPage(LAST[g.id] || g.pages[0][0]); nav.appendChild(b);
  }
}
function renderSub(g, p) {
  const host = $('subpages'); if (!host) return;
  host.innerHTML = '';
  renderRead(p);
  if (!g) return;
  if (g.map) { const m = document.createElement('span'); m.className = 'sub-map'; m.textContent = 'how we got here ›'; m.onclick = () => openMap(g.map); host.appendChild(m); }
  for (const [name, label, tip] of g.pages) {
    const b = document.createElement('button'); b.className = 'sub' + (name === p ? ' on' : ''); b.textContent = label; b.title = tip; b.onclick = () => showPage(name); host.appendChild(b);
  }
}
// pages that live in their own module: each exports mount(host) and optionally shown(host)
const EXTRA = { matches: './matches.js', constructions: './constructions.js', openwave: './openwave.js', cosmology: './cosmology.js', masses: './masses.js', results: './results.js', decoder: './decoder.js', leptons: './leptons.js', couplings: './couplings_page.js', timeline: './timeline.js', transitions: './transitions.js', lattice: './lattice.js', journey: './journey.js', nowave: './nowave.js' };
const EXTRA_FAILED = {};
export function showPage(p) {
  if (!$('page-' + p)) p = 'universe';
  if (!EXTRA[p] && p !== 'journey') { window.__runWanted = true; if (window.__needRun) { const f = window.__needRun; window.__needRun = null; f(); } }
  buildNav();
  const g = PAGE_GROUP[p];
  document.querySelectorAll('#nav .tab').forEach((b) => b.classList.toggle('on', !!g && b.dataset.group === g.id));
  if (g) LAST[g.id] = p;
  renderSub(g, p);
  document.body.dataset.page = p;
  try { const u = new URL(location.href); if (u.searchParams.get('page') !== p) { u.searchParams.set('page', p); history.replaceState(null, '', u); } } catch (e) { /* file urls */ }
  document.querySelectorAll('.page').forEach((d) => d.classList.toggle('on', d.id === 'page-' + p));
  $('uni-controls').style.display = p === 'universe' ? 'flex' : 'none';
  const SHOWN = { observer: ['./observer.js', 'observerShown'], carrier: ['./carrier.js', 'carrierShown'], space: ['./space.js', 'spaceShown'],
    cosmos: ['./cosmos.js', 'cosmosShown'], map: ['./mapview.js', 'mapShown'], story: ['./story.js', 'storyShown'], readout: ['./readout.js', 'readoutShown'],
    classes: ['./classes.js', 'classesShown'], spectrum: ['./spectrum.js', 'spectrumShown'] };
  const RUN_PAGES = new Set(['observer', 'cosmos', 'map', 'readout', 'classes']);      // these read the run: they draw once it is there
  if (SHOWN[p]) (RUN_PAGES.has(p) ? runLoaded : Promise.resolve()).then(() => mod(SHOWN[p][0])).then((m) => { if (document.body.dataset.page === p) m[SHOWN[p][1]](); }).catch((e) => console.error('page ' + p, e));
  if (p === 'detector') labModule().then((m) => m.labShown()).catch((e) => console.error('page detector', e));
  if (RUN_VIEWS[p]) runLoaded.then(() => RUN_VIEWS[p]()).catch((e) => console.error('page ' + p, e));
  if (p === 'defects') runLoaded.then(() => import('./defects.js')).then((m) => { if (document.body.dataset.page === 'defects') m.defectsShown(); });
  if (EXTRA[p]) import(EXTRA[p] + (EXTRA_FAILED[p] ? '?retry=' + EXTRA_FAILED[p] : '')).then((m) => { const h = $(p + '-host'); if (!h.dataset.mounted) { h.dataset.mounted = '1'; h.innerHTML = ''; m.mount(h); } if (m.shown) m.shown(h); })
    .catch((e) => {      // the module is not there yet, or it failed: say so on the page instead of showing nothing
      EXTRA_FAILED[p] = Date.now();      // a failed import stays cached under its address: the next visit asks under a fresh one
      console.error('page ' + p, e); const h = $(p + '-host'), g = PAGE_GROUP[p], row = g && g.pages.find((x) => x[0] === p);
      if (h && !h.dataset.mounted) h.innerHTML = `<div style="max-width:640px;margin:14vh auto 0;padding:0 24px;text-align:center"><div style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--amber)">in preparation</div><h2 style="margin:10px 0 8px;font-size:26px">${row ? row[1] : p}</h2><p style="color:var(--muted);font-size:15px">This page will show ${row ? row[2] : 'its part of the journey'}.</p></div>`;
    });
  if (p === 'universe') { resize(); if (!animating && FAM_READY) animate(); }
  import('./equations.js').then((m) => m.mountEquations(p, $('page-' + p))).catch(() => {});
  import('./player.js').then((m) => m.enhance(p)).catch(() => {});     // large play button, seek bar, autoplay     // main equations and their sources, at the foot of the page
}
// Fewer controls on screen: secondary controls sit behind one toggle per card, the view options of the screen behind
// one button, and the federation level of the detector lab is fixed.
function declutter() {
  const adv = (ids) => ids.forEach((id) => { const el = $(id), r = el && el.closest('.lab-ctl'); if (r) r.classList.add('adv'); });
  adv(['car-port', 'car-level', 'car-speed', 'sp-k', 'sp-d', 'sp-dens', 'sp-a', 'sp-speed', 'lab-width', 'lab-k', 'lab-clock', 'lab-phi', 'lab-speed']);
  const lv = $('lab-level'); if (lv && lv.closest('.lab-ctl')) lv.closest('.lab-ctl').style.display = 'none';
  document.querySelectorAll('.card').forEach((card) => {
    if (!card.querySelector('.lab-ctl.adv') || card.querySelector(':scope > .adv-toggle')) return;
    const t = document.createElement('button'); t.className = 'adv-toggle'; t.textContent = 'more controls';
    t.onclick = () => { t.textContent = card.classList.toggle('adv-open') ? 'fewer controls' : 'more controls'; };
    card.appendChild(t);
  });
  const uc = $('uni-controls');
  if (uc && !$('uni-more')) {
    const pop = document.createElement('span'); pop.id = 'uni-more';
    [...uc.querySelectorAll('label.chk'), $('sizeSel')].forEach((el) => el && pop.appendChild(el));
    const b = document.createElement('button'); b.id = 'uni-more-btn'; b.textContent = 'view'; b.title = 'what is drawn: spin, names, load field, internal tier, marker size';
    b.onclick = (e) => { e.stopPropagation(); const r = b.getBoundingClientRect(); pop.style.top = (r.bottom + 6) + 'px'; pop.style.right = Math.max(8, innerWidth - r.right) + 'px'; pop.classList.toggle('open'); };
    pop.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => pop.classList.remove('open'));
    uc.appendChild(b); document.body.appendChild(pop);
  }
}
declutter();
const FIRST = (() => { const p = new URLSearchParams(location.search).get('page'); return p && document.getElementById('page-' + p) ? p : 'journey'; })();
buildNav(); renderSub(PAGE_GROUP[FIRST], FIRST); document.querySelectorAll('#nav .tab').forEach((b) => b.classList.toggle('on', !!PAGE_GROUP[FIRST] && b.dataset.group === PAGE_GROUP[FIRST].id));
document.querySelectorAll('.page').forEach((d) => d.classList.toggle('on', d.id === 'page-' + FIRST));
$('uni-controls').style.display = FIRST === 'universe' ? 'flex' : 'none';
if (FIRST === 'journey' || EXTRA[FIRST]) showPage(FIRST);          // pages that need no run open before the run has loaded
function resize() {
  const r = $('stage').getBoundingClientRect();
  if (!r.width) return;
  if (renderer) { renderer.setSize(r.width, r.height, false); composer.setSize(r.width, r.height); }
  camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
  if (S.meta) { drawTimeline(); if (current) drawMap(current); }
}
window.addEventListener('resize', resize);
document.addEventListener('visibilitychange', () => { if (!document.hidden && !animating && FAM_READY) animate(); });
let lastRelabel = 0;
let animating = false;
function animate() {               // runs only while the Screen page is open; showPage('universe') starts it again
  if (!$('page-universe').classList.contains('on') || document.hidden) { animating = false; return; }
  animating = true; requestAnimationFrame(animate);
  if (!renderer && !ensureGL()) { animating = false; return; }
  const now = performance.now();
  if (!controls.autoRotate && $('spinChk').checked && now - idleSince > 9000 && selected < 0 && view !== 'map') controls.autoRotate = true;
  if (!$('spinChk').checked) controls.autoRotate = false;
  controls.update();
  if (view === 'map') return;
  if (highlight && highlight.visible && current) {         // the selection ring breathes
    const s = 0.5 + 0.5 * Math.sin(now / 420);
    highlight.scale.setScalar((1.35 + 0.35 * s) * markerScale(current.count)); highlight.material.opacity = 0.65 + 0.35 * s;
  }
  composer.render();
  if (controls.autoRotate && now - lastRelabel > 1400) { lastRelabel = now; pickLabels(); }
  placeLabels();
}

// ------------------------------------------------------------------ boot
async function loadRun(name) {
  $('loading').style.display = '';
  S.name = name; S.base = `runs/${name}/`; S.cache.clear(); selected = -1; current = null;
  S.meta = await (await fetch(S.base + 'run.json')).json();
  [S.stats, S.display, S.cat, S.classStats] = await Promise.all([loadNpz(S.base + S.meta.stats_file), loadNpz(S.base + 'view/display.npz'),
    loadNpz(S.base + 'view/catalogue.npz'), (await fetch(S.base + 'view/class_stats.json')).json()]);
  S.catRow = new Map(); for (let i = 0; i < S.cat.id.length; i++) S.catRow.set(S.cat.id[i], i);
  S.frames = S.meta.cuts.slice().sort((a, b) => a.k - b.k).concat([S.meta.end]);
  $('frame').max = S.frames.length - 1;
  $('intraLbl').style.display = S.meta.config.track_intra ? '' : 'none';
  if (!S.meta.config.track_intra) { showIntra = false; $('intraChk').checked = false; }
  buildSurface(); renderLegend(); renderAbout(); buildEpochs(); renderCard();
  $('legendTitle').textContent = closedLoop() ? 'Charges' : 'Defect families of the run, named by charge';
  RUN_DONE.clear();
  await (await mod('./observer.js')).initObserver();
  resize();
  $('loading').style.display = 'none';
  runResolve();
  const p = document.body.dataset.page; if (RUN_VIEWS[p]) RUN_VIEWS[p]();      // a run chosen anew redraws the open view
}
(async function boot() {
  S.pmap = await (await fetch('particle_map.json')).json();
  for (const [k, st] of Object.entries(S.pmap.class_style)) FAM[k] = { id: st.family, color: st.color, rgb: new THREE.Color(st.color), anti: st.anti, shape: st.shape, short: st.short, label: st.label, detail: st.detail, group: st.group, rim: st.rim };
  S.runs = await (await fetch('api/runs')).json();
  const q = new URLSearchParams(location.search);
  const sel = $('runSel');
  for (const r of S.runs) { const o = document.createElement('option'); o.value = r.name; o.textContent = `${r.name}: level ${r.level}, ${fmt(r.carriers)} observers, ${r.twists ? 'closed-loop extension' : 'exact law C'}, ${r.preparation}`; sel.appendChild(o); }
  const start = q.get('run') && S.runs.find((r) => r.name === q.get('run')) ? q.get('run') : ([...S.runs].reverse().find((r) => r.register && !r.twists && r.cuts > 0 && r.level <= 6) || S.runs[0]).name;
  sel.value = start;
  {                                    // one run is shown, without a selector (a run can still be chosen with ?run=NAME)
    const r = S.runs.find((x) => x.name === start) || S.runs[0], lab = document.createElement('span'); lab.id = 'runLabel';
    lab.style.cssText = 'font-size:13px;color:var(--muted);white-space:nowrap';
    lab.innerHTML = `${fmt(r.carriers)} observers · law C`;
    lab.title = `One run of the executable model: level ${r.level}, ${fmt(r.carriers)} carriers (observers), law C with the declared Z6 register, preparation ${r.preparation}. ` +
      (r.level !== 6 ? '' : 'Size: the level nearest the candidate screen of one bare modular period, a great circle of exp(2π) = 535.5 cell lengths, N = L²/π = 91,276 cells (theory session, argued; the unification-scale form it uses is declared). Screens come in sizes 20 · 4^L, so 81,920 is the nearest. The size was fixed before the class shares were read.');
    sel.style.display = 'none'; lab.style.display = 'none'; sel.insertAdjacentElement('afterend', lab);      // kept in the page for its tooltip data, not shown
  }
  sel.onchange = async () => { await loadRun(sel.value); await setFrame(0); };
  buildPoints(); FAM_READY = true; if ($('page-universe').classList.contains('on')) animate();
  if ((FIRST === 'journey' || EXTRA[FIRST]) && !window.__runWanted) {      // the first page needs no run: it loads when a page that reads it opens
    setTimeout(startHelp, 1500);
    await new Promise((r) => { window.__needRun = r; });
  }
  await loadRun(start);
  if (['map', 'bulk'].includes(q.get('view'))) setView(q.get('view'));
  if (q.has('intra')) { showIntra = true; $('intraChk').checked = true; }
  await setFrame(q.has('frame') ? parseInt(q.get('frame')) : 0);
  if (q.has('id')) select(parseInt(q.get('id')));
  for (const [key, id] of [['lablevel', 'lab-level'], ['labk', 'lab-k'], ['labdist', 'lab-dist'], ['labwidth', 'lab-width'], ['labclock', 'lab-clock'], ['labspeed', 'lab-speed'], ['labdet', 'lab-det'], ['labphi', 'lab-phi']]) if (q.has(key)) $(id).value = q.get(key);
  if (q.has('labtwo')) $('lab-two').checked = true;
  if (!(FIRST === 'journey' || EXTRA[FIRST])) showPage(FIRST);      // a page that reads the run opens once the run has loaded
  if (q.get('page') === 'detector') {
    await (await labModule()).labShown();
    if (q.has('labtwo') || q.has('labk') || q.has('labdist') || q.has('labwidth') || q.has('labclock') || q.has('labphi')) window.__lab.prepare();
    if (q.has('labsteps')) {                              // deterministic stepping for screenshots and timing
      const t0 = performance.now(), n = parseInt(q.get('labsteps'));
      for (let i = 0; i < n; i++) window.__lab.advance();
      console.log(`lab: ${n} steps, ${((performance.now() - t0) / Math.max(1, n)).toFixed(1)} ms per step`);
      if (q.get('labread') === 'pos') window.__lab.readPosition();
      if (q.get('labread') === 'mom') window.__lab.readMomentum();
      if (q.has('labafter')) for (let i = 0; i < parseInt(q.get('labafter')); i++) window.__lab.advance();
      window.__lab.refresh(true);
    }
    if (q.has('labauto')) window.__lab.auto(parseInt(q.get('labauto')), q.get('labread'));
  }
  if (q.get('page') === 'observer' && S.meta.observers.length) {
    await window.__observerLoad(q.has('obs') ? parseInt(q.get('obs')) : undefined);
    if (q.has('omode') || q.has('otick')) window.__observerMode(q.get('omode') || 'records', q.has('otick') ? parseInt(q.get('otick')) : undefined);
  }
  startHelp();
  window.__ready = true;
})();
