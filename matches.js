// The page "Matches to nature": every match of the model with nature in one list, with the count on top.
// The same rows feed the wall of tiles on the Journey page (wall()). Data and counting: matches_data.js.
//
//   mount(host), shown(host)   the page (registered by app.js under the name 'matches')
//   wall(el)                   the compact wall of tiles for the Journey page; returns { counts }
import { matches } from './matches_data.js';
import { FILES } from './results_data.js';
import { tile, devText, closeness, matchStyle, SAME, PART, owTag } from './match.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const go = (page) => import('./app.js').then((m) => m.showPage && m.showPage(page)).catch(() => {});
function css() {
  matchStyle();
  if (document.getElementById('mx-css')) return;
  const l = document.createElement('link'); l.id = 'mx-css'; l.rel = 'stylesheet'; l.href = new URL('./style/matches.css', import.meta.url).href; document.head.appendChild(l);
}
// the files of the lattice lanes: their values replace the typed ones when they answer (the count does not change)
let LIVE = null, liveAsked = null;
function live() {
  if (liveAsked) return liveAsked;
  const get = (u) => fetch(u, { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  liveAsked = Promise.all([get(FILES.ew), get(FILES.qcd), get(FILES.had), get(FILES.pd)]).then(([ew, qcd, had, pd]) => { LIVE = { ew, qcd, had, pd }; return LIVE; });
  return liveAsked;
}
const markOf = (r) => (r.kind === 'part' ? `<span class="mt-part">${PART}in part</span>`
  : r.kind === 'number' ? `<span class="mt-dev ${Number.isFinite(r.rel) ? closeness(r.rel) : 'mt-a'}">${r.dev || devText(r.rel)}</span>`
    : `<span class="mt-same">${SAME}same</span>`);
const natureOf = (r) => (r.kind === 'part' ? (r.nature ? `${r.nature}${r.unit ? `<i>${r.unit}</i>` : ''}` : `<em>${r.open || ''}</em>`)
  : r.kind === 'number' ? `${r.nature}${r.unit && !/^×/.test(r.unit) ? `<i>${r.unit}</i>` : ''}<em>${r.natureWord || 'measured'}</em>`
    : `<span class="mx-eq">${r.value}${r.unit ? `<i>${r.unit}</i>` : ''}</span>`);
const PAGE_NAME = { readout: 'Field', observer: 'One observer', space: 'Forces', classes: 'Classes', decoder: 'Decoder', matches: 'the particle table below', constructions: 'Finite constructions',
  openwave: 'OpenWave status', defects: 'Defects', carrier: 'One carrier', leptons: 'Lepton derivation', couplings: 'Couplings', spectrum: 'Full spectrum', transitions: 'Phase transitions', cosmos: 'First defects', cosmology: 'Against ΛCDM', results: 'Numbers and status' };
function rowHtml(r) {
  const links = (r.src || []).map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${t} ↗</a>`).join('');
  const page = r.page && r.page !== 'matches' ? `<button type="button" class="mx-go" data-page="${esc(r.page)}">${PAGE_NAME[r.page] || r.page} ›</button>` : '';
  const more = [r.tip ? `<p>${r.tip}</p>` : '', r.kind === 'part' && r.open ? `<p class="mx-openline">Open: ${r.open}</p>` : '', page || links ? `<div class="mx-links">${page}${links}</div>` : ''].join('');
  return `<div class="mx-row mx-${r.kind}" data-id="${esc(r.id)}">
    <button type="button" class="mr${r.kind === 'part' ? ' mr-is-part' : ''}" aria-expanded="false">
      <span class="mr-q"><span>${r.name}${r.ow ? owTag(r.ow) : ''}</span></span>
      <span class="mr-v${r.text ? ' mx-t' : ''}">${r.value}${r.unit ? `<i>${r.unit}</i>` : ''}</span>
      <span class="mr-m">${natureOf(r)}</span>
      <span class="mr-d">${markOf(r)}</span></button>
    ${more ? `<div class="mx-more" hidden>${more}</div>` : ''}</div>`;
}
function render(host, M) {
  const c = M.counts;
  host.innerHTML = `<div class="mx-wrap">
    <div class="mx-hero">
      <div class="mx-count"><b data-n="${c.match}">${c.match}</b><span>matches<br>with our universe</span></div>
      <div class="mx-split">
        <div><b>${c.exact + c.seen}</b><span>properties and laws that are the same</span></div>
        <div><b>${c.number}</b><span>numbers beside their measured value</span></div>
        <div class="mx-part"><b>${c.part}</b><span>more that match in part</span></div>
        <button type="button" class="mx-opn" data-jump="open"><b>${c.open}</b><span>open ›</span></button>
        <button type="button" class="mx-opn mx-ow" data-page="openwave"><b>${c.ow}</b><span>rows are OpenWave targets ›</span></button>
      </div>
      <h2>Matches to nature</h2>
      <div class="mx-lead">One row per match. Left: what the simulation gives. Right: our universe.</div>
    </div>
    <div class="mx-nav">${M.groups.map((g) => `<button type="button" data-jump="${g.id}">${g.title}<i>${g.rows.length}</i></button>`).join('')}</div>
    <div class="mx-groups">${M.groups.map((g) => `<section class="mx-group" id="mx-${g.id}">
      <div class="mx-gh"><h3>${g.title}</h3><span>${g.rows.filter(M.isMatch).length} matches${g.rows.some((r) => !M.isMatch(r)) ? ' · ' + g.rows.filter((r) => !M.isMatch(r)).length + ' in part' : ''}</span></div>
      <div class="mr mr-h"><span></span><span>the model</span><span>our universe</span><span>match</span></div>
      ${g.rows.map(rowHtml).join('')}</section>`).join('')}</div>
    <section class="mx-open" id="mx-open"><div class="mx-gh"><h3>Open</h3><span>${c.open} things the model does not give</span></div>
      <div class="mx-olist">${M.open.map((o) => `<button type="button" class="mx-o"${o.page ? ` data-page="${esc(o.page)}"` : ''}><b>${o.title}${o.ow ? owTag(o.ow) : ''}</b><span>${o.sub}</span></button>`).join('')}</div></section>
    <div class="mx-foot"><button type="button" class="mx-go" data-page="openwave">OpenWave status ›</button><button type="button" class="mx-go" data-page="results">Numbers and status, row by row ›</button><button type="button" class="mx-go" data-page="constructions">The finite constructions ›</button></div>
  </div>`;
}
function wire(host) {
  if (host.dataset.wired) return; host.dataset.wired = '1';
  host.addEventListener('click', (e) => {
    const t = e.target.closest ? e.target : null; if (!t || t.closest('.hq') || t.closest('a')) return;
    const ow = t.closest('.ow-tag'); if (ow) { e.stopPropagation(); window.__owRow = ow.textContent.replace(/\D/g, ''); return go('openwave'); }
    const p = t.closest('[data-page]'); if (p) return go(p.dataset.page);
    const j = t.closest('[data-jump]'); if (j) { const el = host.querySelector('#mx-' + j.dataset.jump); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const b = t.closest('.mx-row > .mr'); if (b) { const more = b.parentElement.querySelector('.mx-more'); if (!more) return; const on = more.hidden; more.hidden = !on; b.setAttribute('aria-expanded', String(on)); b.parentElement.classList.toggle('mx-on', on); }
  });
}
function countUp(el) {                // the count runs up once, when the page first shows
  const n = +el.dataset.n; if (!n || el.dataset.done || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  el.dataset.done = '1'; const t0 = performance.now(), ms = 900;
  const step = (t) => { const f = Math.min(1, (t - t0) / ms), k = 1 - (1 - f) ** 3; el.textContent = String(Math.round(k * n)); if (f < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
export function mount(host) {
  css(); wire(host);
  render(host, matches(LIVE || {}));
  live().then((L) => { const open = [...host.querySelectorAll('.mx-on')].map((x) => x.dataset.id); render(host, matches(L)); for (const id of open) { const b = host.querySelector(`.mx-row[data-id="${id}"] > .mr`); if (b) b.click(); } });
}
export function shown(host) {
  const n = host.querySelector('.mx-count b'); if (n) countUp(n);
  // a row asked for by address (?row=id) or by a tile of the Journey page opens and scrolls into view
  let id = window.__matchRow || ''; window.__matchRow = '';
  if (!id) { try { id = new URLSearchParams(location.search).get('row') || ''; } catch (e) { /* no address */ } }
  if (id) { const row = host.querySelector(`.mx-row[data-id="${id.replace(/[^\w-]/g, '')}"]`); if (row) { const b = row.querySelector('.mr'); if (b && !row.classList.contains('mx-on')) b.click(); setTimeout(() => row.scrollIntoView({ block: 'center' }), 60); } }
}

// ---------------------------------------------------------------- the wall of tiles on the Journey page
export function wall(el) {
  css();
  const draw = (L) => {
    const M = matches(L || {}), c = M.counts;
    el.innerHTML = `<div class="mw-head">
        <div class="mw-count"><b data-n="${c.match}">${c.match}</b><span>matches with our universe</span></div>
        <div class="mw-sub"><span><b>${c.exact + c.seen}</b> properties and laws that are the same</span><span><b>${c.number}</b> numbers beside their measured value</span><span class="mw-p"><b>${c.part}</b> more in part</span></div>
        <button type="button" class="mw-all" data-page="matches">The full list ›</button>
      </div>
      ${M.groups.map((g) => `<div class="mw-g"><div class="mw-gt">${g.title}<i>${g.rows.length}</i></div>
        <div class="mt-grid">${g.rows.map((r) => tile({ id: r.id, ow: r.ow, name: r.short || r.name, value: r.value, unit: r.unit, text: r.text, same: r.kind === 'exact' || r.kind === 'seen', part: r.kind === 'part',
          nature: r.nature, natureWord: r.natureWord, rel: r.rel, dev: r.dev, tip: (r.tip || '').replace(/<[^>]+>/g, '') })).join('')}</div></div>`).join('')}`;
    return M;
  };
  const M = draw(LIVE);
  if (!el.dataset.wired) {
    el.dataset.wired = '1';
    el.addEventListener('click', (e) => {
      const ow = e.target.closest && e.target.closest('.ow-tag'); if (ow) { window.__owRow = ow.textContent.replace(/\D/g, ''); return go('openwave'); }
      const t = e.target.closest && e.target.closest('.mt[data-id]'); if (t) { window.__matchRow = t.dataset.id; return go('matches'); }
      const p = e.target.closest && e.target.closest('[data-page]'); if (p) go(p.dataset.page);
    });
    if (typeof IntersectionObserver === 'function') { const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { const n = el.querySelector('.mw-count b'); if (n) countUp(n); io.disconnect(); } }), { threshold: 0.2 }); io.observe(el); }
  }
  live().then((L) => draw(L));
  return { counts: M.counts };
}
