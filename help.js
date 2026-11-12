// Hover help: a "?" badge on every explained element of every page. Entries live in help/<page>.js, one file per page:
//   export default [{ sel: 'CSS selector inside #page-<page>', text: 'HTML shown on hover', corner: false, all: false }, ...]
// sel is matched inside the page div (page 'top' matches the header bar). corner: true pins the badge to the top-right
// corner of the element's parent (for canvases and SVGs that fill a panel); otherwise the badge is placed after the
// element (void elements, canvases, inputs) or appended inside it. all: true badges every match, nth: i the i-th match,
// otherwise the first.
// Pages re-render their content often, so a MutationObserver re-attaches badges in the same frame.
import { linkList } from './links.js';
import top from './help/top.js';
import universe from './help/universe.js';
import readout from './help/readout.js';
import classes from './help/classes.js';
import spectrum from './help/spectrum.js';
import story from './help/story.js';
import carrier from './help/carrier.js';
import space from './help/space.js';
import cosmos from './help/cosmos.js';
import observer from './help/observer.js';
import detector from './help/detector.js';
import map from './help/map.js';
import particles from './help/particles.js';
import findings from './help/findings.js';
import data from './help/data.js';
import defects from './help/defects.js';

const REG = { top, universe, readout, classes, spectrum, story, carrier, space, cosmos, observer, detector, map, particles, findings, data, defects };
// pages added later register their entries when their help file exists (a missing file is not an error);
// the entries of the equations section apply on every page
let EQ = [];
for (const p of ['results', 'decoder', 'leptons', 'couplings', 'timeline', 'transitions', 'lattice', 'journey', 'nowave', 'masses', 'cosmology', 'matches', 'constructions', 'openwave']) {
  import(`./help/${p}.js`).then((m) => { REG[p] = (m.default || []).concat(EQ); }).catch(() => {});
}
import('./help/zoom.js').then((m) => { REG.universe = REG.universe.concat(m.default || []); }).catch(() => {});      // the zoom view lives on the Screen page
import('./help/equations.js').then((m) => { EQ = m.default || []; for (const k of Object.keys(REG)) if (k !== 'top') REG[k] = REG[k].concat(EQ); }).catch(() => {});
const VOID = new Set(['CANVAS', 'INPUT', 'SELECT', 'IMG', 'SVG', 'svg', 'TEXTAREA', 'BUTTON', 'VIDEO']);
let tip = null;

function style() {
  const st = document.createElement('style');
  st.textContent = `
.hq{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;margin-left:5px;font:700 10.5px/1 Inter,Helvetica,Arial,sans-serif;
  color:#0b1222 !important;background:#7fa6e0;cursor:help;vertical-align:middle;flex:none;opacity:.78;box-shadow:0 0 0 2px rgba(4,7,15,.6);position:relative;z-index:6;user-select:none;letter-spacing:0;text-transform:none}
.hq:hover{opacity:1;background:#3fe0d0}
.hq.hq-corner{position:absolute;top:8px;right:8px;margin:0;z-index:7}
.hq-folded{display:none!important}
body.hq-full .hq-folded{display:block!important}body.hq-full .hq-fold{display:none}
.hq.hq-fold{display:inline-flex;margin:2px 0 6px 0}
body.hq-off .hq{display:none}
#top .hq{display:none}
.hq{opacity:.38;background:#5f7db0;width:14px;height:14px;font-size:9.5px}.hq:hover{opacity:1}
h1>.hq,h2>.hq,h3>.hq,.k>.hq,.hq.hq-corner{opacity:.6;width:16px;height:16px;font-size:10.5px}
:is(button,input,select,label)+.hq{margin-left:3px}
#hq-tip{position:fixed;z-index:100;max-width:380px;padding:10px 12px;border-radius:12px;background:rgba(9,14,26,.97);border:1px solid #2b3d63;color:#dfe6f5;
  font:13px/1.45 Inter,Helvetica,Arial,sans-serif;box-shadow:0 18px 50px -20px #000;pointer-events:none;display:none;text-transform:none;letter-spacing:0;font-weight:400}
#hq-tip.pinned{pointer-events:auto;border-color:#3fe0d0}#hq-tip .pin-note{display:none}
#hq-tip b{color:#fff}#hq-tip em{color:#3fe0d0;font-style:normal}
#hq-toggle{margin-left:4px}`;
  document.head.appendChild(st);
  tip = document.createElement('div'); tip.id = 'hq-tip'; document.body.appendChild(tip);
}
function show(e, html) {
  tip.innerHTML = html; tip.style.display = 'block';
  const r = tip.getBoundingClientRect(), pad = 14;
  let x = e.clientX + pad, y = e.clientY + pad;
  if (x + r.width > innerWidth - 8) x = Math.max(8, e.clientX - r.width - pad);
  if (y + r.height > innerHeight - 8) y = Math.max(8, e.clientY - r.height - pad);
  tip.style.left = x + 'px'; tip.style.top = y + 'px';
}
let pinned = null;
function badge(text, corner, links) {
  const b = document.createElement('span'); b.className = 'hq' + (corner ? ' hq-corner' : ''); b.textContent = '?';
  const t = () => [typeof text === 'function' ? text() : text, ...(b.__extra || []).map((x) => x.innerHTML)].join('<br><br>') + (links ? linkList(links) : '');
  b.addEventListener('mouseenter', (e) => { if (!pinned) show(e, t()); }); b.addEventListener('mousemove', (e) => { if (!pinned) show(e, t()); });
  b.addEventListener('mouseleave', () => { if (!pinned) tip.style.display = 'none'; });
  b.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); pinned = null; show(e, t()); pinned = b; tip.classList.add('pinned'); });
  return b;
}
function attach(rootSel, entries) {
  const root = rootSel === 'top' ? document.getElementById('top') : document.getElementById('page-' + rootSel);
  if (!root) return;
  entries.forEach((en, i) => {
    const key = rootSel + ':' + i;
    const els = en.all ? [...root.querySelectorAll(en.sel)] : en.nth !== undefined ? [root.querySelectorAll(en.sel)[en.nth]].filter(Boolean) : [root.querySelector(en.sel)].filter(Boolean);
    for (const el of els) {
      // skip only if this element's badge is still where it was put (content rebuilt in place loses it)
      const host = en.corner ? el.parentElement : el;
      const present = en.corner ? host.querySelector(`:scope > .hq[data-hk="${key}"]`)
        : (VOID.has(el.tagName) || en.after) ? (el.nextElementSibling && el.nextElementSibling.dataset.hk === key)
          : el.querySelector(`:scope > .hq[data-hk="${key}"]`);
      if (present) continue;
      el.dataset.hq = key;
      const b = badge(en.text, en.corner, en.links); b.dataset.hk = key;
      if (en.corner) { const p = el.parentElement; if (getComputedStyle(p).position === 'static') p.style.position = 'relative'; p.appendChild(b); }
      else if (VOID.has(el.tagName) || en.after) el.insertAdjacentElement('afterend', b);
      else el.appendChild(b);
    }
  });
}
// Minimal mode: long explanatory paragraphs are folded into a "?" at their place; the header button shows them again.
const FOLD = 'p.small, p.note, div.note, p.lead, .lead, .ro-cap, .cl-ident, #ro-head p, .sp-head p, .page h2 + p, .cos-fp-lead, .st-wrap > p, .cl-wrap > p';
const KEEP = '#cl-modal, #hq-tip, .om-panel, .ro-info, #lr-out, .sp-why, table, .nw-lead, .nw-note';
function fold(root) {
  for (const el of root.querySelectorAll(FOLD)) {
    if (el.closest(KEEP)) continue;
    const prev = el.previousElementSibling, ok = prev && prev.classList.contains('hq-fold') && prev.__for === el;
    if (ok) continue;
    if (el.__folded || (el.textContent || '').trim().length < 70) continue;
    el.__folded = true; el.classList.add('hq-folded');
    // fold into the heading just above when there is one: its "?" then shows the heading help and this text together
    let h = el.previousElementSibling; while (h && h.classList.contains('hq-fold')) h = h.previousElementSibling;
    if (h && /^(H1|H2|H3|H4)$/.test(h.tagName) || (h && h.classList.contains('k'))) {
      const own = h.querySelector(':scope > .hq');
      if (own) { (own.__extra = own.__extra || []).push(el); continue; }
      const b = badge(() => el.innerHTML, false); b.__extra = []; h.appendChild(b); continue;
    }
    const b = badge(() => el.innerHTML, false); b.classList.add('hq-fold'); b.__for = el;
    el.insertAdjacentElement('beforebegin', b);
  }
}
let busy = false;
function attachAll() { for (const [page, entries] of Object.entries(REG)) attach(page, entries); }
function attachVisible() {       // only the header and the page on screen: cheap enough to run on every DOM change
  if (busy) return; busy = true;
  try {
    attach('top', REG.top);
    const on = document.querySelector('.page.on'); const page = on && on.id.replace('page-', '');
    if (page && REG[page]) attach(page, REG[page]);
    if (on) fold(on);
  } finally { busy = false; }
}
export function initHelp() {
  style(); attachAll();
  document.addEventListener('click', (e) => { if (pinned && !tip.contains(e.target)) { pinned = null; tip.classList.remove('pinned'); tip.style.display = 'none'; } });
  // mutation callbacks run before the next paint, so a panel that re-renders its HTML gets its badges back in the same frame
  // a change that only replaces text (live counters, clocks) cannot need a badge: skip it, it fires every half second
  const textOnly = (r) => r.type === 'childList' && ![...r.addedNodes, ...r.removedNodes].some((n) => n.nodeType === 1);
  const mo = new MutationObserver((recs) => { if (!recs.every(textOnly)) attachVisible(); });
  mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  const t = document.getElementById('top');
  if (t && !document.getElementById('hq-toggle')) {
    const btn = document.createElement('button'); btn.id = 'hq-toggle'; btn.textContent = '?'; btn.title = 'explanations: hover any ? (click here to show all texts)';
    btn.onclick = () => { document.body.classList.toggle('hq-full'); btn.classList.toggle('on', document.body.classList.contains('hq-full')); };
    t.appendChild(btn);
  }
}
