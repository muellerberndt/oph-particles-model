// The page "No wave function": the double slit executed on the model's own tick (nowave_engine.js, checked by
// nowave_check.mjs), drawn as two aligned layers. Left, the holographic screen: cells with their registers, the open
// alternatives as a faint shimmer on the registers, recording cells that write records and neighbours that agree on
// them. Right, the shared world: the laboratory as observers reconstruct it from agreed records. Between source and
// detector it is empty. A dot exists only once a record of it is written and agreed on.
import { SETUP, weights, alternatives, fringeFrame, visibility, distinguishability, sampler, rng } from './nowave_engine.js';
import { RER, SITE, PAPER } from './links.js';
import { busy } from './progress.js';
import { tex, typeset } from './math.js';

const CROP = 112;                       // cells shown on either side of the beam axis
const AGREE_MS = 420;                   // duration of the agreement pulse before a record becomes a dot of the shared world
const PACES = [                          // quanta per pass, duration of one pass in ms
  { n: 1, ms: 3600, label: 'one at a time' }, { n: 12, ms: 1500, label: 'faster' }, { n: 600, ms: 650, label: 'many' }];

const st = { R: null, frame: null, V0: 1, phi: 0, ghost: false, playing: true, pace: 0, passes: 0, sent: 0, det: 0, wall: 0,
  hits: [], flashes: [], openFlash: [], log: [], viewN: null, clock: 0, batch: [], last: 0, rand: rng(20261111), host: null, hist: null, histW: null, sample: null };

function css() {
  if (document.getElementById('nw-css')) return;
  const l = document.createElement('link'); l.id = 'nw-css'; l.rel = 'stylesheet'; l.href = 'style/nowave.css'; document.head.appendChild(l);
}

export function mount(host) {
  css(); st.host = host;
  host.innerHTML = `<div class="nw">
    <header class="nw-head">
      <div>
        <div class="nw-kicker">Field · the double slit</div>
        <h2>No wave function</h2>
        <p class="nw-lead">There is no wave travelling through space. There are records, and observers who agree on them.
          A position becomes part of the shared world when a record of it is written and agreed on.</p>
      </div>
      <div class="nw-chips">
        <span class="nw-chip nw-declared">routing tick · declared</span>
        <span class="nw-chip nw-declared">recording cells · declared</span>
        <span class="nw-chip nw-derived">Born weight · derived</span>
      </div>
    </header>
    <div class="nw-stage">
      <figure class="nw-panel" id="nw-screen-fig">
        <figcaption><b>The holographic screen</b><span>registers, open alternatives, records</span></figcaption>
        <canvas id="nw-screen"></canvas>
      </figure>
      <figure class="nw-panel" id="nw-world-fig">
        <figcaption><b>The shared world</b><span>what observers agree on</span></figcaption>
        <canvas id="nw-world"></canvas>
      </figure>
    </div>
    <div class="nw-busy" id="nw-busy"></div>
    <div class="nw-controls">
      <button class="nw-play" id="nw-play" aria-label="play or pause"><span>❚❚</span></button>
      <div class="nw-count" id="nw-count"></div>
      <div class="nw-switches">
        <label class="nw-switch"><input type="checkbox" id="nw-rec"><i class="nw-track"></i>record which opening</label>
        <label class="nw-slider">strength of the record <input type="range" id="nw-phi" min="0" max="1" step="0.01" value="0"><b id="nw-phi-v">0</b></label>
        <label class="nw-switch"><input type="checkbox" id="nw-ghost"><i class="nw-track"></i>show the calculation</label>
      </div>
      <div class="nw-pace" id="nw-pace">${PACES.map((p, i) => `<button data-i="${i}">${p.label}</button>`).join('')}<button id="nw-clear">clear</button></div>
    </div>
    <div class="nw-seek"><input class="pl-seek" type="range" id="nw-seek" min="0" max="1000" value="1000" aria-label="seek through the records"><span class="pl-time" id="nw-seek-t"></span></div>
    <div class="nw-duality">
      <div class="nw-bar"><span>fringe visibility V</span><div><i id="nw-V"></i></div><b id="nw-V-v"></b></div>
      <div class="nw-bar"><span>which opening, D</span><div><i id="nw-D"></i></div><b id="nw-D-v"></b></div>
      <div class="nw-rel" id="nw-rel"></div>
    </div>
    <p class="nw-note" id="nw-note">The statistics are the textbook ones: the same fringes, and no fringes once a record of the opening exists. What differs is the picture. Space is reconstructed from agreed records; it is not a container that holds things nobody has recorded.</p>
    <section class="nw-sources"><h3>Sources</h3><div class="src-links">
      <a href="${PAPER('reality_as_consensus_protocol')}" target="_blank" rel="noopener">Paper: reality as a consensus protocol ↗</a>
      <a href="${PAPER('observers_are_all_you_need')}" target="_blank" rel="noopener">Paper: observers, records and the Born weight ↗</a>
      <a href="${PAPER('executable_observer_construction')}" target="_blank" rel="noopener">Paper: the execution model ↗</a>
      <a href="${RER}code/born_frame/README.md" target="_blank" rel="noopener">The finite Born frame and its limits ↗</a>
      <a href="${SITE}nowave_engine.js" target="_blank" rel="noopener">Code: the double slit on the routing tick ↗</a>
      <a href="${SITE}nowave_check.mjs" target="_blank" rel="noopener">Its check ↗</a>
      <a href="${SITE}cf1_engine.js" target="_blank" rel="noopener">Code: the routing tick ↗</a></div></section>
  </div>`;
  const $ = (id) => host.querySelector('#' + id);
  $('nw-play').onclick = () => setPlaying(!st.playing);
  $('nw-rec').onchange = (e) => setPhi(e.target.checked ? 1 : 0, true);
  $('nw-phi').oninput = (e) => setPhi(parseFloat(e.target.value), false);
  $('nw-ghost').onchange = (e) => { st.ghost = e.target.checked; };
  host.querySelectorAll('#nw-pace [data-i]').forEach((b) => { b.onclick = () => { st.pace = +b.dataset.i; st.auto = false; paceUI(); }; });
  $('nw-clear').onclick = clearRecords;
  $('nw-seek').oninput = (e) => seekTo(+e.target.value / 1000);
  document.addEventListener('keydown', (e) => {
    if (e.code !== 'Space' || !host.closest('.page.on') || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    e.preventDefault(); setPlaying(!st.playing);
  });
  for (const id of ['nw-screen', 'nw-world']) new ResizeObserver(() => fit()).observe($(id));
  st.auto = true; paceUI(); fit(); compute(); requestAnimationFrame(loop);
}
export function shown() { fit(); }

function setPlaying(on) {
  if (on && st.viewN !== null) { st.log.length = st.viewN; st.viewN = null; st.batch = []; st.clock = 0; }   // play from the point the seek bar chose
  st.playing = on; st.host.querySelector('#nw-play span').textContent = on ? '❚❚' : '▶'; st.last = performance.now(); count();
}
// the seek bar runs over the records in the order they were agreed on: the pattern grows record by record
function seekTo(frac) {
  if (st.playing) setPlaying(false);
  const n = Math.round(frac * st.log.length); st.viewN = n;
  st.hits = []; if (st.hist) { st.hist.fill(0); st.histW.fill(0); } st.det = 0; st.wall = 0; st.flashes = []; st.openFlash = [];
  for (let i = 0; i < n; i++) { const e = st.log[i]; if (e.kind === 'det') { st.det++; st.hist[e.y]++; if (e.written) st.histW[e.y]++; st.hits.push({ y: e.y, j: e.j, written: e.written, t0: -1e9 }); } else st.wall++; }
  if (st.hits.length > 6000) st.hits.splice(0, st.hits.length - 6000);
  st.sent = n ? st.log[n - 1].sent : 0; count();
}
function paceUI() { st.host.querySelectorAll('#nw-pace [data-i]').forEach((b) => b.classList.toggle('on', +b.dataset.i === st.pace)); }
function setPhi(f, fromSwitch) {
  st.phi = f * Math.PI / 2;
  const $ = (id) => st.host.querySelector('#' + id);
  $('nw-phi').value = f; $('nw-phi-v').textContent = f === 0 ? 'none' : f === 1 ? 'full' : f.toFixed(2);
  if (!fromSwitch) $('nw-rec').checked = f > 0.5;
  clearRecords(); refreshDuality();
}
function clearRecords() {
  st.hits = []; st.flashes = []; st.openFlash = []; st.sent = 0; st.det = 0; st.wall = 0; st.batch = []; st.clock = 0; st.log = []; st.viewN = null;
  if (st.hist) { st.hist.fill(0); st.histW.fill(0); }
  if (st.R) st.sample = sampler(st.R, st.phi, st.rand);
  count();
}
function count() {
  const c = st.host && st.host.querySelector('#nw-count'); if (!c) return;
  const sk = st.host.querySelector('#nw-seek'), skt = st.host.querySelector('#nw-seek-t');
  if (sk && st.viewN === null) sk.value = '1000';
  if (skt) skt.textContent = st.viewN === null ? `${st.log.length.toLocaleString('en')} records` : `record ${st.viewN.toLocaleString('en')} of ${st.log.length.toLocaleString('en')}`;
  c.innerHTML = `<b>${st.sent.toLocaleString('en')}</b> quanta sent<span>·</span><b>${st.det.toLocaleString('en')}</b> records on the detector<span>·</span><b>${st.wall.toLocaleString('en')}</b> on the wall`;
}

// ---------------------------------------------------------------- the computation, in a worker
function compute() {
  const b = busy(st.host.querySelector('#nw-busy'), 'computing the open alternatives on the screen: two runs of the routing tick');
  const done = (R) => {
    st.R = R; st.frame = fringeFrame(R); st.V0 = visibility(R, weights(R, 0).det, st.frame);
    st.hist = new Float64Array(R.setup.n2); st.histW = new Float64Array(R.setup.n2);
    st.sample = sampler(R, st.phi, st.rand); b.done(); refreshDuality(); st.last = performance.now();
  };
  try {
    const w = new Worker(new URL('./nowave_engine.js', import.meta.url), { type: 'module' });
    w.onmessage = (ev) => { if (ev.data.type === 'progress') b.set(ev.data.frac, `tick ${ev.data.tick} of the routing walk`); else if (ev.data.type === 'done') { done(ev.data.result); w.terminate(); } };
    w.onerror = () => { w.terminate(); fallback(); };
    w.postMessage({});
  } catch (e) { fallback(); }
  async function fallback() {
    const { DoubleSlit } = await import('./nowave_engine.js'); const run = new DoubleSlit(SETUP);
    const step = () => { for (let i = 0; i < 6 && !run.done; i++) run.tick(); b.set(run.t / SETUP.maxTicks, `tick ${run.t} of the routing walk`); if (run.done) done(run.result()); else setTimeout(step, 0); };
    step();
  }
}
function refreshDuality() {
  if (!st.R) return;
  const $ = (id) => st.host.querySelector('#' + id), a = alternatives(st.R);
  const V = Math.max(0, visibility(st.R, weights(st.R, st.phi).det, st.frame)), D = distinguishability(st.phi, a.wA, a.wB);
  $('nw-V').style.width = (100 * V) + '%'; $('nw-V-v').textContent = V.toFixed(3);
  $('nw-D').style.width = (100 * D) + '%'; $('nw-D-v').textContent = D.toFixed(3);
  $('nw-rel').innerHTML = `${tex('V^2 + D^2 = ' + (V * V + D * D).toFixed(3) + ' \\le 1')}`; typeset($('nw-rel'));
}

// ---------------------------------------------------------------- geometry shared by the two panels
let G = null;
function fit() {
  const host = st.host; if (!host) return;
  for (const id of ['nw-screen', 'nw-world']) {
    const c = host.querySelector('#' + id), r = c.getBoundingClientRect(), d = devicePixelRatio || 1;
    if (r.width < 10) continue;
    c.width = Math.round(r.width * d); c.height = Math.round(r.height * d);
  }
  const c = host.querySelector('#nw-world'), W = c.width, H = c.height, S = SETUP, pad = 0.04 * W;
  const room = W - 2 * pad, sx = room * 0.80 / (S.n1 - 4);       // the right fifth of the world panel holds the histogram
  G = { W, H, pad, sx, sy: (H - 2 * pad) / (2 * CROP), y0: Math.floor(S.n2 / 2), hx: pad + sx * (S.n1 - 4) + 0.02 * W };
}
const X = (x) => G.pad + G.sx * (x - 2);
const Y = (y) => G.H / 2 - G.sy * (y - G.y0);                     // larger y is higher on the screen: opening A is the upper one

// ---------------------------------------------------------------- one pass: a batch of quanta emitted together
function newPass() {
  const p = PACES[st.pace]; st.batch = [];
  for (let i = 0; i < p.n; i++) { const r = st.sample(); st.batch.push(r); }
  st.sent += p.n; st.passes++; st.clock = 0;
  if (st.auto && st.pace === 0 && st.passes >= 4) { st.pace = 1; paceUI(); }
  if (st.auto && st.pace === 1 && st.passes >= 16) { st.pace = 2; paceUI(); }
}
function loop(now) {
  requestAnimationFrame(loop);
  if (!st.host || !st.host.closest('.page.on') || !G) { st.last = now; return; }
  const dt = Math.min(80, now - st.last); st.last = now;
  if (st.R && st.playing) {
    const p = PACES[st.pace], T = st.R.ticks;
    if (!st.batch.length && st.clock === 0) newPass();
    const before = st.clock; st.clock += dt / p.ms * T;
    for (const r of st.batch) if (r.tick > before && r.tick <= st.clock) record(r, now);
    if (st.clock >= T) { st.batch = []; st.clock = 0; }
  }
  drawScreen(now); drawWorld(now);
}
function record(r, now) {
  if (r.kind === 'lost') return;
  const x = r.kind === 'det' ? st.R.setup.xd : st.R.setup.xw;
  st.flashes.push({ x, y: r.y, t0: now, written: r.written });
  if (r.written) st.openFlash.push({ t0: now });
  if (st.flashes.length > 400) st.flashes.splice(0, st.flashes.length - 400);
  if (st.openFlash.length > 60) st.openFlash.splice(0, st.openFlash.length - 60);
  const sentAt = st.sent;
  setTimeout(() => {                                               // agreed: it becomes a fact of the shared world
    if (st.viewN !== null) return;                                  // the seek bar holds an earlier moment
    const j = Math.random(); if (st.log.length < 400000) st.log.push({ kind: r.kind, y: r.y, written: r.written, j, sent: sentAt });
    if (r.kind === 'det') { st.det++; st.hist[r.y]++; if (r.written) st.histW[r.y]++; st.hits.push({ y: r.y, j, written: r.written, t0: performance.now() }); if (st.hits.length > 6000) st.hits.splice(0, st.hits.length - 6000); }
    else st.wall++;
    count();
  }, AGREE_MS);
}

// ---------------------------------------------------------------- left: the holographic screen
function drawScreen(now) {
  const c = st.host.querySelector('#nw-screen'), g = c.getContext('2d'), { W, H } = G, d = devicePixelRatio || 1, S = SETUP;
  g.fillStyle = '#05080f'; g.fillRect(0, 0, W, H);
  // the cells of the sheet, as observers: a faint lattice of dots
  const step = 8;
  g.fillStyle = 'rgba(120,150,210,.16)';
  for (let x = 4; x < S.n1 - 2; x += step) for (let y = G.y0 - CROP; y <= G.y0 + CROP; y += step) g.fillRect(X(x) - 0.75 * d, Y(y) - 0.75 * d, 1.5 * d, 1.5 * d);
  // the open alternatives: weight on the registers, drawn as a shimmer of discrete cells
  const R = st.R;
  if (R && R.pic && st.batch.length) {
    const p = R.pic; let f = 0; while (f + 1 < p.count && p.ticks[f + 1] <= st.clock) f++;
    const c2 = Math.cos(st.phi / 2) ** 2, s2 = 1 - c2, off = f * p.dw * p.dh, bs = S.gd;
    for (let gx = 0; gx < p.dw; gx++) for (let gy = 0; gy < p.dh; gy++) {
      const y = gy * bs + bs / 2; if (Math.abs(y - G.y0) > CROP) continue;
      const j = off + gx * p.dh + gy, a = p.dP[j] / 255, b = p.dM[j] / 255, v = Math.sqrt(c2 * a * a + s2 * b * b);
      if (v < 0.03) continue;
      const fl = 0.6 + 0.4 * Math.sin(now * 0.011 + gx * 12.9898 + gy * 78.233), u = Math.pow(v, 0.65);
      g.fillStyle = `rgba(63,224,208,${Math.min(0.95, 0.95 * u * fl).toFixed(3)})`;
      const r = (0.8 + 1.6 * u) * d; g.fillRect(X(gx * bs + bs / 2) - r, Y(y) - r, 2 * r, 2 * r);
    }
  }
  walls(g, true);
  // records written by recording cells, and the agreement of their neighbours
  for (const f of st.flashes) {
    const age = now - f.t0; if (age > AGREE_MS + 500) continue;
    const x = X(f.x), y = Y(f.y), k = Math.min(1, age / AGREE_MS);
    g.fillStyle = f.written ? `rgba(255,180,74,${1 - 0.6 * k})` : `rgba(255,255,255,${1 - 0.6 * k})`;
    g.beginPath(); g.arc(x, y, 3.2 * d, 0, 7); g.fill();
    for (let n = 1; n <= 4; n++) {                                // neighbours along the recording wall light up in turn
      const a = Math.max(0, Math.min(1, k * 4 - n + 1)) * (1 - k * 0.7);
      if (a <= 0) continue; g.fillStyle = `rgba(63,224,208,${0.8 * a})`;
      for (const s of [-1, 1]) g.fillRect(x - 1.5 * d, Y(f.y + s * n * 3) - 1.5 * d, 3 * d, 3 * d);
    }
  }
  // the record register of the upper opening
  const op = R ? R.openings : null;
  if (op && st.phi > 0) {
    const yA = Y(op.A[1]) - 16 * d, xA = X(S.xw) - 9 * d, lit = st.openFlash.some((o) => now - o.t0 < 380);
    g.strokeStyle = lit ? '#ffb44a' : 'rgba(255,180,74,.55)'; g.lineWidth = 1.2 * d; g.strokeRect(xA, yA, 18 * d, 9 * d);
    if (lit) { g.fillStyle = 'rgba(255,180,74,.85)'; g.fillRect(xA + 2 * d, yA + 2 * d, 14 * d, 5 * d); }
  }
}
function walls(g, screen) {
  const d = devicePixelRatio || 1, S = SETUP, R = st.R, op = R ? R.openings : { A: [G.y0 + 27, G.y0 + 37], B: [G.y0 - 37, G.y0 - 27] };
  const inOpen = (y) => (y >= op.A[0] && y <= op.A[1]) || (y >= op.B[0] && y <= op.B[1]);
  if (screen) {                                                    // recording cells: small squares, the observers that write records
    g.fillStyle = 'rgba(169,149,255,.55)';
    for (let y = G.y0 - CROP; y <= G.y0 + CROP; y += 3) {
      if (!inOpen(y)) g.fillRect(X(S.xw) - 1.4 * d, Y(y) - 1.4 * d, 2.8 * d, 2.8 * d);
      g.fillRect(X(S.xd) - 1.4 * d, Y(y) - 1.4 * d, 2.8 * d, 2.8 * d);
    }
  } else {
    g.fillStyle = '#2a3a5c';
    const seg = (y1, y2) => g.fillRect(X(S.xw) - 3 * d, Y(y2), 6 * d, Y(y1) - Y(y2));
    seg(G.y0 - CROP, op.B[0] - 1); seg(op.B[1] + 1, op.A[0] - 1); seg(op.A[1] + 1, G.y0 + CROP);
    const grd = g.createLinearGradient(X(S.xd) - 2 * d, 0, X(S.xd) + 2 * d, 0); grd.addColorStop(0, 'rgba(111,177,255,.15)'); grd.addColorStop(1, 'rgba(111,177,255,.55)');
    g.fillStyle = grd; g.fillRect(X(S.xd) - 2 * d, Y(G.y0 + CROP), 4 * d, Y(G.y0 - CROP) - Y(G.y0 + CROP));
  }
}

// ---------------------------------------------------------------- right: the shared world
function drawWorld(now) {
  const c = st.host.querySelector('#nw-world'), g = c.getContext('2d'), { W, H } = G, d = devicePixelRatio || 1, S = SETUP, R = st.R;
  const bg = g.createRadialGradient(W * 0.4, H * 0.5, 0, W * 0.4, H * 0.5, W * 0.8); bg.addColorStop(0, '#0b1426'); bg.addColorStop(1, '#05080f');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  // the calculation, on request: the bookkeeping of the alternatives not yet recorded, as a ghost
  if (st.ghost && R && R.pic && st.batch.length) {
    const p = R.pic; let f = 0; while (f + 1 < p.count && p.ticks[f + 1] <= st.clock) f++;
    const c1 = Math.cos(st.phi / 2), s1 = Math.sin(st.phi / 2), off = f * p.ww * p.wh, bs = S.gw;
    for (let gx = 0; gx < p.ww; gx += 1) for (let gy = 0; gy < p.wh; gy += 1) {
      const y = gy * bs + bs / 2; if (Math.abs(y - G.y0) > CROP) continue;
      const j = off + gx * p.wh + gy, v = (c1 * p.wP[j] + s1 * p.wM[j]) / 127; if (Math.abs(v) < 0.08) continue;
      g.fillStyle = v > 0 ? `rgba(169,149,255,${(0.32 * v).toFixed(3)})` : `rgba(111,177,255,${(-0.32 * v).toFixed(3)})`;
      g.fillRect(X(gx * bs), Y(y + bs / 2), G.sx * bs + 0.5, G.sy * bs + 0.5);
    }
    g.fillStyle = 'rgba(169,149,255,.9)'; g.font = `${11 * d}px Inter, sans-serif`; g.textAlign = 'left';
    g.fillText('the calculation: odds of records not yet written, not a thing in space', G.pad, H - G.pad * 0.6);
  }
  // source
  const sx = X(S.xs - S.wx * 0.6), sy = Y(G.y0), glow = g.createRadialGradient(sx, sy, 0, sx, sy, 22 * d);
  glow.addColorStop(0, 'rgba(255,255,255,.95)'); glow.addColorStop(0.25, 'rgba(111,177,255,.55)'); glow.addColorStop(1, 'rgba(111,177,255,0)');
  g.fillStyle = glow; g.beginPath(); g.arc(sx, sy, 22 * d, 0, 7); g.fill();
  walls(g, false);
  // the opening record, as a fact of the shared world
  if (R && st.phi > 0) for (const o of st.openFlash) {
    const age = now - o.t0 - AGREE_MS; if (age < 0 || age > 900) continue;
    const a = 1 - age / 900, y = Y((R.openings.A[0] + R.openings.A[1]) / 2);
    g.fillStyle = `rgba(255,180,74,${a})`; g.beginPath(); g.arc(X(S.xw), y, 4 * d, 0, 7); g.fill();
  }
  // dots on the detector: each one a record that observers agreed on
  for (const h of st.hits) {
    const age = now - h.t0, x = X(S.xd) - (2 + 9 * h.j) * d, y = Y(h.y) + (h.j - 0.5) * G.sy * 0.8;
    g.fillStyle = h.written ? 'rgba(255,180,74,.85)' : 'rgba(63,224,208,.85)';
    const r = age < 250 ? (1 + 2.2 * (1 - age / 250)) * d : 1.05 * d;
    g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  // the pattern of the records, beside the detector
  if (st.hist) {
    const n = S.n2, bin = 4, bars = [], barsW = []; let mx = 1;
    for (let y = G.y0 - CROP; y <= G.y0 + CROP; y += bin) { let s = 0, w = 0; for (let k = 0; k < bin; k++) { s += st.hist[y + k] || 0; w += st.histW[y + k] || 0; } bars.push([y, s]); barsW.push(w); if (s > mx) mx = s; }
    const x0 = G.hx, len = W - G.pad - x0;
    bars.forEach(([y, s], i) => {
      const h = Math.max(1, G.sy * bin - 1.2 * d);
      g.fillStyle = 'rgba(63,224,208,.75)'; g.fillRect(x0, Y(y + bin), len * s / mx, h);
      if (barsW[i]) { g.fillStyle = 'rgba(255,180,74,.85)'; g.fillRect(x0, Y(y + bin), len * barsW[i] / mx, h); }
    });
    if (st.ghost && R) {                                             // the computed odds, as a thin line
      const w = weights(R, st.phi).det; let wm = 0; const acc = [];
      for (let y = G.y0 - CROP; y <= G.y0 + CROP; y += bin) { let s = 0; for (let k = 0; k < bin; k++) s += w[y + k] || 0; acc.push([y, s]); if (s > wm) wm = s; }
      g.strokeStyle = 'rgba(169,149,255,.95)'; g.lineWidth = 1.3 * d; g.beginPath();
      acc.forEach(([y, s], i) => { const px = x0 + len * s / wm, py = Y(y + bin / 2); i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.stroke();
    }
    g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = d; g.beginPath(); g.moveTo(x0, Y(G.y0 + CROP)); g.lineTo(x0, Y(G.y0 - CROP)); g.stroke();
  }
  if (!st.det) {
    g.fillStyle = 'rgba(147,163,192,.75)'; g.font = `${12 * d}px Inter, sans-serif`; g.textAlign = 'center';
    g.fillText('empty until a record is agreed on', (X(S.xw) + X(S.xd)) / 2, Y(G.y0) + 4 * d);
  }
}
