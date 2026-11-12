// The page "Finite constructions" (Results group): the executable constructions behind the matches, each with its
// number, its stated assumptions and its proof with complete records.
//
// The cards are projected from the theory repository by the site build (oph-particles-model, tools/
// sync_journey_results.py), which writes journey_results.js, its data and its style sheet beside the viewer files.
// The local development server has no such projection: the page then shows the links only.
//   mount(host), shown(host)   registered by app.js under the name 'constructions'
const go = (page) => import('./app.js').then((m) => m.showPage && m.showPage(page)).catch(() => {});
const CSS = `
.cx-wrap{max-width:1600px;margin:0 auto;padding:22px 24px 56px}
.cx-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px 24px;margin:0 0 16px}
.cx-head h2{margin:0;font-size:26px;font-weight:700;letter-spacing:-.015em;color:#f3f6fc;display:flex;align-items:center}
.cx-lead{margin:6px 0 0;max-width:820px;font-size:14px;line-height:1.5;color:var(--muted,#93a3c0)}
.cx-links{display:flex;flex-wrap:wrap;gap:8px}
.cx-links :is(a,button){padding:7px 14px;border-radius:999px;font:inherit;font-size:13px;color:var(--teal,#3fe0d0);border:1px solid rgba(63,224,208,.4);background:none;text-decoration:none;cursor:pointer}
.cx-links :is(a,button):hover{background:rgba(63,224,208,.1);box-shadow:none}
.cx-body .jr{margin-top:0}.cx-body .jr-grid{grid-template-columns:repeat(auto-fill,minmax(420px,1fr))}
.cx-body .jr-heading .jr-all{display:none}
.cx-none{padding:26px;border:1px solid var(--edge,#1f2c48);border-radius:16px;font-size:14px;color:var(--muted,#93a3c0)}
@media (max-width:720px){.cx-wrap{padding:16px 12px 44px}.cx-body .jr-grid{grid-template-columns:1fr}}`;
export function mount(host) {
  if (!document.getElementById('cx-css')) { const st = document.createElement('style'); st.id = 'cx-css'; st.textContent = CSS; document.head.appendChild(st); }
  host.innerHTML = `<div class="cx-wrap">
    <div class="cx-head"><div><h2>Finite constructions</h2><div class="cx-lead">The executable constructions behind the matches. Each card: one number, what was assumed, and the proof with its records.</div></div>
      <div class="cx-links"><button type="button" data-page="matches">‹ Matches to nature</button><a href="finite_results.html">All finite results and receipts ↗</a></div></div>
    <div class="cx-body"></div></div>`;
  host.addEventListener('click', (e) => { const p = e.target.closest && e.target.closest('[data-page]'); if (p) go(p.dataset.page); });
  const body = host.querySelector('.cx-body');
  // the block of current measurements that the site build writes into this page sits below the head
  const hl = document.querySelector('#page-constructions > #current-highlights'); if (hl) { hl.style.maxWidth = 'none'; hl.style.margin = '0 0 18px'; body.before(hl); }
  import('./journey_results.js').then((m) => {
    if (!document.getElementById('journey-results-css')) { const l = document.createElement('link'); l.id = 'journey-results-css'; l.rel = 'stylesheet'; l.href = new URL('./journey_results.css', import.meta.url).href; document.head.appendChild(l); }
    body.innerHTML = m.renderJourneyResults();
    for (const a of body.querySelectorAll('a[href^="http"]')) { a.target = '_blank'; a.rel = 'noopener'; }
  }).catch(() => { body.innerHTML = '<div class="cx-none">The cards of this page are written by the site build. They are on the published site.</div>'; });
}
export function shown() { /* static */ }
