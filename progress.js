// Progress indicators. Wherever the site waits for a computation it shows one of these, never bare words.
//
//   import { laneProgress, busy } from './progress.js';
//   panel.appendChild(laneProgress('EW'));            // a run on the compute boxes: reads /rl/EW/progress.json
//   const b = busy(el, 'sampling the ensemble'); b.set(0.4, 'sweep 400 of 1000'); b.done();   // work in the browser
//
// progress.json of a lane: { "lane": "EW", "status": "running" | "done" | "failed", "stage": "production, volume 24",
//   "done": 37, "total": 120, "unit": "runs", "updated": "2026-11-11T06:10:00Z", "eta_minutes": 45 }
const st = document.createElement('style');
st.textContent = `.pg{display:flex;flex-direction:column;gap:5px;min-width:160px;font-size:12px;color:var(--muted,#93a3c0)}
.pg-row{display:flex;justify-content:space-between;gap:12px;align-items:baseline}.pg-row b{color:var(--text,#eef2fb);font-weight:600;font-variant-numeric:tabular-nums}
.pg-bar{position:relative;height:4px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}
.pg-fill{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:999px;background:linear-gradient(90deg,var(--teal,#3fe0d0),var(--blue,#6fb1ff));transition:width .6s ease}
.pg.pg-wait .pg-fill{width:32%!important;animation:pgslide 1.4s ease-in-out infinite}
.pg.pg-done .pg-fill{background:var(--green,#5fe3a1)}.pg.pg-failed .pg-fill{background:var(--red,#ff6480)}
@keyframes pgslide{0%{left:-32%}100%{left:100%}}
@media (prefers-reduced-motion:reduce){.pg.pg-wait .pg-fill{animation:none;left:0}}`;
document.head.appendChild(st);

function shell(label) {
  const el = document.createElement('div'); el.className = 'pg pg-wait';
  el.innerHTML = `<div class="pg-row"><span class="pg-label"></span><b class="pg-num"></b></div><div class="pg-bar"><div class="pg-fill"></div></div>`;
  el.querySelector('.pg-label').textContent = label || '';
  return el;
}
function paint(el, frac, label, num) {
  if (label !== undefined) el.querySelector('.pg-label').textContent = label;
  el.querySelector('.pg-num').textContent = num || (frac === null || frac === undefined ? '' : Math.round(100 * frac) + ' %');
  const known = frac !== null && frac !== undefined && isFinite(frac);
  el.classList.toggle('pg-wait', !known);
  if (known) el.querySelector('.pg-fill').style.width = Math.max(2, Math.min(100, 100 * frac)) + '%';
}

// work in the browser: indeterminate until set() is called with a fraction
export function busy(host, label) {
  const el = shell(label); if (host) host.appendChild(el);
  return { el, set(frac, text) { paint(el, frac, text); }, done() { el.remove(); } };
}

// a run on the compute boxes; refreshes itself; opts.keep keeps the bar after the run is done
export function laneProgress(lane, opts = {}) {
  const el = shell(opts.label || 'run on the compute box');
  let timer = null;
  async function tick() {
    if (!el.isConnected && el.dataset.seen) { clearInterval(timer); return; }
    if (el.isConnected) el.dataset.seen = '1';
    try {
      const r = await fetch('rl/' + lane + '/progress.json', { cache: 'no-store' }); if (!r.ok) throw new Error('none');
      const p = await r.json(), frac = p.total ? p.done / p.total : null;
      const eta = p.eta_minutes ? ` · about ${p.eta_minutes} min left` : '';
      el.classList.toggle('pg-done', p.status === 'done'); el.classList.toggle('pg-failed', p.status === 'failed');
      if (p.status === 'done') { paint(el, 1, 'computed', p.total ? `${p.total} ${p.unit || ''}`.trim() : 'done'); if (!opts.keep) el.style.display = 'none'; clearInterval(timer); return; }
      paint(el, frac, (p.stage || 'running') + eta, p.total ? `${p.done} of ${p.total} ${p.unit || ''}`.trim() : '');
    } catch (e) { paint(el, null, opts.label || 'run on the compute box: waiting for its first report'); }
  }
  tick(); timer = setInterval(tick, opts.every || 30000);
  return el;
}
