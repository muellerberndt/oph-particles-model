// The page "OpenWave status" (Results group): the 31 criteria of the OpenWave comparison of models of matter, with
// this project's own estimate for each and the evidence behind it.
//
// Data: openwave_data.js (written from the project's criterion-by-criterion assessment) and the rows of the list
// "Matches to nature" that answer a criterion (matches_data.js, OW). OpenWave awards its own cells and has awarded
// OPH none: every status on this page is an estimate of this project, and the page says so.
//   mount(host), shown(host)   registered by app.js under the name 'openwave'
import { OPENWAVE } from './openwave_data.js';
import { matches } from './matches_data.js';
import { matchStyle } from './match.js';

const UPSTREAM = 'https://github.com/openwave-labs/openwave/blob/' + OPENWAVE.upstream_commit + '/MODELS.md';
const RER = 'https://github.com/FloatingPragma/observer-patch-holography/blob/main/';
const ST = { met: ['met', 'var(--teal,#3fe0d0)'], part: ['in part', 'var(--blue,#6fb1ff)'], fails: ['fails', 'var(--red,#ff6480)'], untested: ['not computed', 'var(--faint,#62718f)'] };
// one plain sentence per criterion: what the model shows
const PLAIN = {
  1: 'Charge comes in whole units. The charge lattice of the model has no half units.',
  2: 'A charged spin-½ state has a definite energy at rest, with its field included.',
  3: 'A localized packet carries a phase at its rest frequency. That the clock starts by itself is not shown.',
  4: 'A localized charged packet stays localized for a billion ticks.',
  5: 'The magnetic response gives g = 1.99828. The measured value is 2.00232.',
  6: 'The dressed charged state has total angular momentum J² = ¾: spin ½.',
  7: 'An odd number of quanta returns to itself after two full turns.',
  8: 'A particle–hole pair converts into two transverse quanta of the field.',
  9: 'Decays of the model emit neutral spin-½ particles. No neutrino mass is derived.',
  10: 'Three neutral families oscillate in flight. The mixing angles are not the measured ones.',
  11: 'Muon and tau over electron land within 10 and 31 parts per million. The common scale uses the electron mass.',
  12: 'Quark strings carry the charges +2/3 and −1/3. The quark masses are not derived.',
  13: 'Three quarks bind into colour-neutral spin-½ states of charge 0 and +1.',
  14: 'The neutral three-quark state is the heavier one. The masses themselves do not match.',
  15: 'The bound three-quark states lie near 1.7 MeV. The proton has 938 MeV.',
  16: 'Six quarks bind below two separate three-quark states, with a positive quadrupole moment.',
  17: 'Nuclei beyond the deuteron are not computed.',
  18: 'A quark and an antiquark bind, and a bound state converts through the weak current. Pion and kaon masses are not derived.',
  19: 'A neutral state that stays where it is and does not decay.',
  20: 'Two charges attract or repel with the inverse-square law in the static limit.',
  21: 'A relativistic limit with error bounds exists. The lattice keeps a preferred frame at the scale of one cell.',
  22: 'The energy of a separated colour pair rises linearly with distance. The strength in physical units is not derived.',
  23: 'The coupling of the colour links is measured at several volumes. The physical scale is not fixed.',
  24: 'A heavy charged lepton turns into a light one and two neutral particles. The muon lifetime is not derived.',
  25: 'In the construction tested, the decay of the neutron is energetically forbidden.',
  26: 'Two sources of energy attract. The strength G is not derived.',
  27: 'A wave bends toward a source and arrives late, and clocks near it shift. The size of the effects is not calibrated.',
  28: 'The equation of state is w = −1. The capacity of the cosmos is not derived.',
  29: 'The field has two transverse wave modes that propagate as Maxwell’s equations say.',
  30: 'Quanta obey the massive wave equation at wavelengths long against one cell.',
  31: 'A bound charge has discrete levels. The first gap approaches 3/8, as in hydrogen.',
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const go = (page) => import('./app.js').then((m) => m.showPage && m.showPage(page)).catch(() => {});
const CSS = `
.ow-wrap{max-width:1600px;margin:0 auto;padding:22px 24px 56px}
.ow-head h2{margin:0;font-size:26px;font-weight:700;letter-spacing:-.015em;color:#f3f6fc;display:flex;align-items:center}
.ow-lead{margin:6px 0 0;max-width:900px;font-size:14px;line-height:1.5;color:var(--muted,#93a3c0)}
.ow-head a{color:#7fb8ff}
.ow-band{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:18px 0 8px}
.ow-band>div{padding:12px 16px 13px;border:1px solid var(--edge,#1f2c48);border-radius:14px;background:rgba(14,21,38,.6)}
.ow-band b{display:block;font-size:40px;line-height:1;font-weight:750;letter-spacing:-.03em;font-variant-numeric:tabular-nums;color:var(--c)}
.ow-band span{display:block;margin-top:5px;font-size:12.5px;color:var(--muted,#93a3c0)}
.ow-bar{display:flex;height:8px;margin:0 0 18px;border-radius:99px;overflow:hidden;background:rgba(255,255,255,.05)}
.ow-bar i{display:block;height:100%;background:var(--c);opacity:.9}
.ow-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 18px;align-items:start}
.ow-row{border-bottom:1px solid rgba(140,170,230,.09)}
.ow-row>button{display:grid;grid-template-columns:30px minmax(0,1fr) 96px;gap:10px;align-items:start;width:100%;padding:10px 8px;border:0;border-radius:8px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.ow-row>button:hover,.ow-row.ow-on>button{background:rgba(169,149,255,.07);box-shadow:none}
.ow-n{display:inline-flex;align-items:center;justify-content:center;width:26px;height:22px;border-radius:6px;font-size:11.5px;font-weight:700;font-variant-numeric:tabular-nums;color:#c9b8ff;background:rgba(169,149,255,.13);box-shadow:inset 0 0 0 1px rgba(169,149,255,.35)}
.ow-t b{display:block;font-size:14px;font-weight:650;color:#eef2fb}
.ow-t span{display:block;margin-top:2px;font-size:12.5px;line-height:1.45;color:var(--muted,#93a3c0)}
.ow-s{justify-self:end;display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;color:var(--c);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c) 45%,transparent)}
.ow-s::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--c)}
.ow-more{margin:0 8px 12px 48px;padding:10px 12px 11px;border-radius:10px;background:rgba(6,10,20,.6);box-shadow:inset 0 0 0 1px rgba(140,170,230,.08)}
.ow-more h4{margin:0 0 3px;font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--faint,#62718f);font-weight:700}
.ow-more p{margin:0 0 9px;font-size:12.5px;line-height:1.5;color:var(--soft,#c5d0e6)}
.ow-links{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center}
.ow-links a{font-size:12px;color:#7fb8ff;text-decoration:none;border-bottom:1px solid rgba(127,184,255,.3)}.ow-links a:hover{color:#3fe0d0;border-color:#3fe0d0}
.ow-links button{padding:3px 10px;border-radius:999px;font:inherit;font-size:12px;color:var(--teal,#3fe0d0);border:1px solid rgba(63,224,208,.4);background:none;cursor:pointer}
.ow-links button:hover{background:rgba(63,224,208,.1);box-shadow:none}
.ow-range{font-size:11.5px;color:var(--faint,#62718f)}
.ow-foot{margin-top:16px;font-size:12.5px;line-height:1.5;color:var(--faint,#62718f);max-width:980px}
@media (max-width:1100px){.ow-list{grid-template-columns:1fr}}
@media (max-width:720px){.ow-wrap{padding:16px 12px 44px}.ow-band{grid-template-columns:repeat(2,minmax(0,1fr))}.ow-band b{font-size:32px}.ow-row>button{grid-template-columns:28px minmax(0,1fr)}.ow-s{grid-column:2;justify-self:start}.ow-more{margin-left:8px}}`;
function rowHtml(r, rowsOf) {
  const [word, colour] = ST[r.status], mine = rowsOf[r.id] || [];
  const range = r.low !== r.high ? `<span class="ow-range">between “${ST[r.low][0]}” and “${ST[r.high][0]}”, by how strictly the criterion is read</span>` : '';
  return `<div class="ow-row" data-id="${r.id}"><button type="button" aria-expanded="false">
      <span class="ow-n">${r.id}</span><span class="ow-t"><b>${esc(r.criterion)}</b><span>${PLAIN[r.id] || ''}</span></span><span class="ow-s" style="--c:${colour}">${word}</span></button>
    <div class="ow-more" hidden><h4>Assessment</h4><p>${esc(r.reason)} ${range}</p><h4>Next test</h4><p>${esc(r.next)}</p>
      <div class="ow-links">${mine.map((m) => `<button type="button" data-row="${esc(m.id)}">${m.name.replace(/<[^>]+>/g, '')} ›</button>`).join('')}${r.proofs.slice(-6).map((p) => `<a href="${RER}model/${p}/PROOF.md" target="_blank" rel="noopener">${p.replace(/^openwave_/, '').replace(/_/g, ' ')} ↗</a>`).join('')}</div></div></div>`;
}
export function mount(host) {
  matchStyle();
  if (!document.getElementById('ow-css')) { const st = document.createElement('style'); st.id = 'ow-css'; st.textContent = CSS; document.head.appendChild(st); }
  const M = matches({}), rowsOf = {}, c = OPENWAVE.counts, n = OPENWAVE.rows.length;
  for (const r of M.groups.flatMap((g) => g.rows)) if (r.ow) (rowsOf[r.ow] = rowsOf[r.ow] || []).push(r);
  const half = Math.ceil(n / 2), col = (rows) => `<div>${rows.map((r) => rowHtml(r, rowsOf)).join('')}</div>`;
  host.innerHTML = `<div class="ow-wrap">
    <div class="ow-head"><h2>OpenWave status</h2>
      <div class="ow-lead"><a href="${UPSTREAM}" target="_blank" rel="noopener">OpenWave ↗</a> compares models of matter on ${n} criteria. This is where OPH stands on each, by this project’s own assessment of its public evidence. OpenWave has not scored OPH.</div></div>
    <div class="ow-band">${['met', 'part', 'fails', 'untested'].map((k) => `<div style="--c:${ST[k][1]}"><b>${c[k]}</b><span>${k === 'met' ? 'criteria met' : k === 'part' ? 'met in part' : k === 'fails' ? 'tested and failed' : 'not computed'}</span></div>`).join('')}</div>
    <div class="ow-bar">${OPENWAVE.rows.map((r) => `<i style="--c:${ST[r.status][1]};width:${100 / n}%" title="${r.id} · ${esc(r.criterion)}: ${ST[r.status][0]}"></i>`).join('')}</div>
    <div class="ow-list">${col(OPENWAVE.rows.slice(0, half))}${col(OPENWAVE.rows.slice(half))}</div>
    <div class="ow-foot">A criterion counts as met when its test passes on the model’s own construction. It does not say that OPH is a confirmed theory of nature. Values on the other pages that answer a criterion carry the tag <span class="ow-tag">OW n</span>.</div></div>`;
  host.addEventListener('click', (e) => {
    const t = e.target.closest ? e.target : null; if (!t || t.closest('.hq') || t.closest('a')) return;
    const m = t.closest('[data-row]'); if (m) { window.__matchRow = m.dataset.row; return go('matches'); }
    const b = t.closest('.ow-row > button'); if (b) { const row = b.parentElement, more = row.querySelector('.ow-more'), on = more.hidden; more.hidden = !on; b.setAttribute('aria-expanded', String(on)); row.classList.toggle('ow-on', on); }
  });
}
export function shown(host) {
  let id = window.__owRow || ''; window.__owRow = '';
  if (!id) { try { id = new URLSearchParams(location.search).get('ow') || ''; } catch (e) { /* no address */ } }
  const row = id && host.querySelector(`.ow-row[data-id="${String(id).replace(/\D/g, '')}"]`);
  if (row) { if (!row.classList.contains('ow-on')) row.querySelector('button').click(); setTimeout(() => row.scrollIntoView({ block: 'center' }), 60); }
}
