// "Equations and sources": the main equations of a page, each typeset, with a status chip and links to paper, proof
// and code. Content: equations_data.js. Look: style/equations.css. Help texts: help/equations.js.
//
//   import { mountEquations } from './equations.js';
//   mountEquations(pageName, document.getElementById('page-' + pageName));     // in showPage, every time a page opens
//
// equationsSection(pageName) returns the section element, or null when the page has no entry.
// mountEquations(pageName, pageElement) places it and returns the placed element, or null:
//   - a page that scrolls gets the section as the last element of its scroll container, set on the page's own
//     content column, so that the edges of title, cards and footer line up with the content above;
//   - a fixed full-height page (SHEET_PAGES, and any page whose canvas fills it) gives up a slim strip at its foot
//     for a centred chip that opens the section in a bottom sheet. The sheet content is built when first opened.
// The call is idempotent. Page modules mount after it and their style sheets arrive later, so the placement is looked
// at again shortly after every call and whenever the content above changes size.
import { tex, typeset } from './math.js';
import { linkList } from './links.js';
import { CARDS, STATUS, blocksOf } from './equations_data.js';

const SHEET_PAGES = new Set(['universe', 'carrier', 'readout', 'space', 'observer', 'journey']);     // journey: the entry page keeps its equations behind the chip
const ORDER = ['derived', 'conditional', 'premise', 'declared', 'open'];
const SIDES = ['maxWidth', 'marginLeft', 'marginRight', 'paddingLeft', 'paddingRight'];
const mounted = new WeakMap();          // page element -> { name, mode, section, dock, ro, ref }
const live = new Set();                 // sections in the document, lined up and refitted when sizes change

if (!document.getElementById('eq-css')) {
  const l = document.createElement('link'); l.id = 'eq-css'; l.rel = 'stylesheet';
  l.href = new URL('./style/equations.css', import.meta.url).href; document.head.appendChild(l);
}

const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const chip = (key) => { const s = STATUS[key]; return `<span class="eq-st" data-status="${key}" style="--c:${s.color}" title="${attr(s.title)}">${s.label}</span>`; };
const STANDARD = '<span class="eq-std" title="A standard relation of physics that the page uses. It is no statement of the model and carries no status.">standard relation</span>';

function card(id) {
  const c = CARDS[id], st = c.standard ? null : STATUS[c.status];
  return `<div class="eq-card${c.wide ? ' eq-wide' : ''}" data-eq="${id}" data-status="${st ? c.status : 'standard'}"${st ? ` style="--c:${st.color}"` : ''}>
    <div class="eq-top"><span class="eq-name">${c.name}</span>${st ? chip(c.status) : STANDARD}</div>
    <div class="eq-math">${tex(c.tex, true)}</div>
    <div class="eq-what">${c.what}</div>
    <div class="eq-links">${c.links.map(([k, t, u]) => `<a href="${attr(u)}" target="_blank" rel="noopener"><i>${k}</i>${t} ↗</a>`).join('')}</div>
  </div>`;
}

// A formula wider than its card is scaled down until it fits. Below 72 percent of its size it scrolls in its own box.
function fit(sec) {                // all resets, then all reads, then all writes: one layout instead of one per formula
  const boxes = [...sec.querySelectorAll('.eq-math')].filter((box) => box.clientWidth);   // hidden: keep what was found while visible
  for (const box of boxes) box.style.fontSize = '';
  const sizes = boxes.map((box) => { const over = box.scrollWidth / box.clientWidth; return over > 1.005 ? parseFloat(getComputedStyle(box).fontSize) * Math.max(0.72, 0.985 / over) : 0; });
  boxes.forEach((box, i) => { if (sizes[i]) box.style.fontSize = sizes[i].toFixed(2) + 'px'; });
}
let again = 0;
function settle() { clearTimeout(again); again = setTimeout(() => { for (const s of live) if (s.isConnected) { if (s.eqAlign) s.eqAlign(); fit(s); } }, 160); }
window.addEventListener('resize', settle);
if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', settle);   // the math fonts arrive after the first layout

export function hasEquations(pageName) { return !!blocksOf(pageName); }

export function equationsSection(pageName) {
  const blocks = blocksOf(pageName); if (!blocks) return null;
  const sec = document.createElement('div'); sec.className = 'eq-sec'; sec.dataset.page = pageName; sec.setAttribute('role', 'region'); sec.setAttribute('aria-label', 'Equations and sources');
  const used = new Set(blocks.flatMap((b) => b.cards.filter((id) => !CARDS[id].standard).map((id) => CARDS[id].status)));
  const many = blocks.length > 1, src = [...new Set(blocks.flatMap((b) => b.src || []))];
  sec.innerHTML = `<div class="eq-head"><div class="eq-title" role="heading" aria-level="2">Equations and sources</div>
      <div class="eq-legend">${ORDER.filter((k) => used.has(k)).map(chip).join('')}</div></div>
    ${many ? '' : `<div class="eq-lead">${blocks[0].lead}</div>`}
    ${blocks.map((b, i) => `${many ? `<div class="eq-sub" role="heading" aria-level="3"><i>step ${i + 1}</i><b>${b.title}</b><span>${b.lead}</span></div>` : ''}
      <div class="eq-grid" data-group="${b.key}">${b.cards.map(card).join('')}</div>`).join('')}
    <div class="eq-more"><i>further sources</i>${linkList(src)}</div>`;
  for (const g of sec.querySelectorAll('.eq-grid')) {     // no orphan card: the last card of a broken row takes the rest of it
    const n = g.children.length, units = [...g.children].reduce((u, c) => u + (c.classList.contains('eq-wide') ? 2 : 1), 0), last = g.lastElementChild;
    if (n === 2 || (n === 4 && units === 4)) g.dataset.cols = '2';               // one row of two, or two rows of two
    else if (units % 3 === 1) last.classList.add('eq-l3');                      // three columns: the last card takes the row
    else if (units % 3 === 2) last.classList.add('eq-l2');                      // three columns: the last card takes two thirds
    if (units % 2 === 1) last.classList.add('eq-m2');                           // two columns: the last card takes the row
  }
  live.add(sec);
  typeset(sec).then(() => { fit(sec); setTimeout(() => fit(sec), 1500); });
  return sec;
}

const scrolls = (el) => { const o = getComputedStyle(el).overflowY; return o === 'auto' || o === 'scroll'; };
const flows = (el) => { const p = getComputedStyle(el).position; return el.offsetWidth > 0 && p !== 'absolute' && p !== 'fixed'; };

// The scroll container of a page, or null when the page is a fixed canvas.
function findScroller(page) {
  const pw = page.clientWidth, ph = page.clientHeight;
  if (pw && ph) for (const el of page.children) {           // a child laid over the whole page decides
    if (el.classList.contains('eq-sec') || el.classList.contains('eq-dock')) continue;
    const cs = getComputedStyle(el);
    if ((cs.position !== 'absolute' && cs.position !== 'fixed') || cs.display === 'none') continue;
    if (el.offsetWidth < 0.9 * pw || el.offsetHeight < 0.9 * ph) continue;
    return scrolls(el) ? el : null;
  }
  return scrolls(page) ? page : null;
}

// The inner edges of the page's own content column: the block above the section, followed down through wrappers that
// hold a single wide child.
function columnOf(sec) {
  let el = sec.previousElementSibling; while (el && !flows(el)) el = el.previousElementSibling;
  if (!el) return null;
  for (let depth = 0; depth < 5; depth++) {
    const kids = [...el.children].filter(flows);
    if (kids.length !== 1 || kids[0].offsetWidth < 0.6 * el.clientWidth) break;
    el = kids[0];
  }
  const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
  return { el, left: r.left + parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth), right: r.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth) };
}

// Set the section on the page's column when the page has one that is centred and wide. Otherwise the default column
// of the style sheet stays: 1600 px wide with 24 px at the sides. Returns the element that defines the column.
function align(sec, host) {
  for (const k of SIDES) sec.style[k] = '';
  const hs = getComputedStyle(host), padL = parseFloat(hs.paddingLeft), padR = parseFloat(hs.paddingRight);
  sec.classList.toggle('eq-pad', padL < 12);
  const col = columnOf(sec); if (!col || !host.clientWidth) return null;
  const hr = host.getBoundingClientRect(), inL = hr.left + padL, inR = hr.left + host.clientWidth - padR;
  const l = col.left - inL, r = inR - col.right, w = col.right - col.left;
  if (l < 8 && r < 8 && padL < 12) return col.el;                                  // the content above has no column of its own
  if (l < -1 || r < -1 || Math.abs(l - r) > 6 || w < Math.min(900, 0.6 * (inR - inL))) return col.el;   // off centre or narrow
  sec.style.maxWidth = 'none'; sec.style.marginLeft = sec.style.marginRight = '0';
  sec.style.paddingLeft = Math.max(0, l).toFixed(1) + 'px'; sec.style.paddingRight = Math.max(0, r).toFixed(1) + 'px';
  return col.el;
}

function buildDock(m, page) {
  const dock = document.createElement('div'); dock.className = 'eq-dock'; dock.dataset.page = m.name;
  dock.innerHTML = `<div class="eq-open" role="button" tabindex="0" aria-expanded="false" title="the main equations of this page, with paper, proof and code"><span>∑</span>equations and sources</div>
    <div class="eq-back"></div>
    <div class="eq-sheet" role="dialog" aria-label="Equations and sources" aria-hidden="true">
      <div class="eq-sheet-bar"><i></i><div class="eq-close" role="button" tabindex="0" aria-label="close" title="close (Esc)">×</div></div>
      <div class="eq-sheet-body"></div></div>`;
  const open = dock.querySelector('.eq-open'), sheet = dock.querySelector('.eq-sheet'), body = dock.querySelector('.eq-sheet-body'), back = dock.querySelector('.eq-back');
  const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); set(false); open.focus(); } };
  function set(on) {
    if (on) {
      if (!m.section) m.section = equationsSection(m.name);
      if (m.section.parentElement !== body) {
        m.section.eqAlign = null; for (const k of SIDES) m.section.style[k] = '';
        m.section.classList.remove('eq-pad'); m.section.classList.add('eq-in-sheet'); body.appendChild(m.section);
      }
      const top = Math.max(0, page.getBoundingClientRect().top);     // the sheet never covers the header
      back.style.top = top + 'px'; sheet.style.maxHeight = Math.round(innerHeight - top - 28) + 'px';
      body.scrollTop = 0;
    }
    dock.classList.toggle('open', on); open.setAttribute('aria-expanded', String(on)); sheet.setAttribute('aria-hidden', String(!on));
    document[on ? 'addEventListener' : 'removeEventListener']('keydown', onKey, true);
    if (on) { requestAnimationFrame(() => fit(m.section)); dock.querySelector('.eq-close').focus({ preventScroll: true }); }
  }
  const act = (el, fn) => {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); fn(); } });
  };
  act(open, () => set(!dock.classList.contains('open')));
  act(dock.querySelector('.eq-close'), () => set(false));
  back.addEventListener('click', () => set(false));
  // keys pressed inside the open sheet stay there (the Universe page steps and plays on the arrow keys and the space bar)
  dock.addEventListener('keydown', (e) => { if (dock.classList.contains('open') && (e.key === ' ' || e.key.startsWith('Arrow'))) e.stopPropagation(); });
  open.addEventListener('pointerenter', () => typeset(document.createElement('span')), { once: true });   // load the math library ahead of the click
  dock.setOpen = set;
  return dock;
}

// The strip at the foot of a fixed page: the page ends 34 px higher (style sheet), and its canvases take the new size.
function strip(page, on) {
  if (page.classList.contains('eq-docked') === on) return;
  page.classList.toggle('eq-docked', on); window.dispatchEvent(new Event('resize'));
}

function place(m, page) {
  if (!page.isConnected || (m.mode && !page.clientWidth)) return;      // a hidden page keeps its placement
  const host = SHEET_PAGES.has(m.name) ? null : findScroller(page);
  if (host) {                                             // the page scrolls: the section closes its scroll container
    if (m.dock) { m.dock.setOpen(false); m.dock.remove(); m.dock = null; strip(page, false); }
    if (!m.section) m.section = equationsSection(m.name);
    m.section.classList.remove('eq-in-sheet');
    if (m.section.parentElement !== host || host.lastElementChild !== m.section) host.appendChild(m.section);
    if (!m.ro && window.ResizeObserver) m.ro = new ResizeObserver(settle);     // the content above arrives and changes: line up again
    m.section.eqAlign = () => {
      const ref = align(m.section, host);
      if (m.ro && ref && ref !== m.ref) { if (m.ref) m.ro.unobserve(m.ref); m.ro.observe(ref); m.ref = ref; }
    };
    m.section.eqAlign(); m.mode = 'foot'; fit(m.section);
    const more = m.section.querySelector('.eq-more');      // a page that lists its sources itself needs no second list
    if (more) more.hidden = [...host.querySelectorAll('.src-links')].some((l) => !m.section.contains(l) && l.offsetWidth > 0);
  } else {                                                // a fixed canvas: a strip with the chip, and the bottom sheet
    if (m.mode === 'foot' && m.section) m.section.remove();
    if (!m.dock || m.dock.parentElement !== page) { m.dock = buildDock(m, page); page.appendChild(m.dock); }
    strip(page, true); m.mode = 'sheet';
  }
}

export function mountEquations(pageName, pageElement) {
  if (!pageElement || !hasEquations(pageName)) return null;
  let m = mounted.get(pageElement);
  if (!m || m.name !== pageName) {
    if (m) { if (m.section) m.section.remove(); if (m.dock) m.dock.remove(); if (m.ro) m.ro.disconnect(); }
    m = { name: pageName, mode: null, section: null, dock: null, ro: null, ref: null }; mounted.set(pageElement, m);
  }
  place(m, pageElement);
  clearTimeout(m.t1); clearTimeout(m.t2);
  m.t1 = setTimeout(() => place(m, pageElement), 500); m.t2 = setTimeout(() => place(m, pageElement), 2500);
  return m.mode === 'foot' ? m.section : m.dock;
}
