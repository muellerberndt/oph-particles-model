// One visual language for "the model beside our universe", used by the Journey, Results, Masses and Early universe
// pages. No numbers live here: every page passes its own values, typed from the report or data file it names.
//
//   tile(o)        a compact card: name, the model's value, and either "same in our universe" or the measured value
//                  with the deviation. o = { name, value, unit, text, same, part, nature, dev, rel, page, href, tip, id }
//   tiles(list)    a grid of tiles
//   table(rows, o) a comparison table: quantity, OPH, our universe, match
//                  row = { sym, name, value, unit, nature, natureNote, same, dev, rel, page, href, open, note }
//   devText(rel)   signed relative deviation: parts per million below 0.1 percent, percent above
//   matchStyle()   loads style/match.css once
const MINUS = '−';
const sig3 = (a) => (a >= 100 ? a.toFixed(0) : a >= 10 ? a.toFixed(1) : a.toFixed(2));
export function devText(rel) {
  if (rel === null || rel === undefined || !Number.isFinite(rel)) return '';
  const a = Math.abs(rel), sign = rel < 0 ? MINUS : '+';
  if (a === 0) return 'exact';
  if (a < 1e-3) return sign + sig3(a * 1e6) + ' ppm';
  return sign + (a < 0.01 ? (a * 100).toFixed(2) : (a * 100).toFixed(1)) + ' %';
}
// how close a deviation is, as a class: the mark of a tile or row takes its colour from it
export function closeness(rel) {
  const a = Math.abs(rel);
  return !Number.isFinite(a) ? '' : a === 0 ? 'mt-x' : a < 1e-3 ? 'mt-a' : a < 1e-2 ? 'mt-b' : 'mt-c';
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
let styled = false;
export function matchStyle() {
  if (styled || typeof document === 'undefined') return; styled = true;
  if (document.querySelector('link[data-match-css]')) return;
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'style/match.css'; l.dataset.matchCss = '1'; document.head.appendChild(l);
}
const attrs = (o) => (o.page ? ` data-page="${esc(o.page)}"` : '') + (o.map ? ` data-map="${esc(o.map)}"` : '') + (o.tip ? ` title="${esc(o.tip)}"` : '');
// the tag of a value that answers a criterion of the OpenWave comparison
export const owTag = (n) => `<span class="ow-tag" title="OpenWave target ${n}">OW ${n}</span>`;
export const PART = '<svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 1.6a4.4 4.4 0 0 1 0 8.8z" fill="currentColor"/></svg>';
export const SAME = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.2 6.4l2.5 2.5 5.1-5.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
export function tile(o) {
  const dev = o.dev || (Number.isFinite(o.rel) ? devText(o.rel) : '');
  const nat = o.nature !== undefined && o.nature !== null && o.nature !== '' ? `<span class="mt-nat">${o.natureWord || 'measured'} <b>${o.nature}</b></span>` : '';
  const foot = o.part ? `<span class="mt-part">${PART}${o.partText || 'in part'}</span>${nat && dev ? `<span class="mt-dev ${Number.isFinite(o.rel) ? closeness(o.rel) : ''}">${dev}</span>` : ''}`
    : o.same ? `<span class="mt-same">${SAME}${o.sameText || 'same in our universe'}</span>`
      : `${nat}${dev ? `<span class="mt-dev ${Number.isFinite(o.rel) ? closeness(o.rel) : ''}">${dev}</span>` : ''}`;
  const tag = o.href ? 'a' : 'button', link = o.href ? ` href="${esc(o.href)}" target="_blank" rel="noopener"` : ' type="button"';
  return `<${tag} class="mt${o.same ? ' mt-is-same' : ''}${o.part ? ' mt-is-part' : ''}"${link}${attrs(o)}${o.id ? ` data-id="${esc(o.id)}"` : ''}><span class="mt-n">${o.name}</span>${o.ow ? owTag(o.ow) : ''}<span class="mt-v${o.text ? ' mt-t' : ''}">${o.value}${o.unit ? `<i>${o.unit}</i>` : ''}</span><span class="mt-f">${foot}</span></${tag}>`;
}
export const tiles = (list) => `<div class="mt-grid">${list.map(tile).join('')}</div>`;
export function table(rows, o = {}) {
  const head = `<div class="mr mr-h"><span>${o.first || ''}</span><span>${o.modelWord || 'OPH'}</span><span>${o.natureWord || 'our universe'}</span><span>${o.matchWord || 'match'}</span></div>`;
  const body = rows.map((r) => {
    if (r.group) return `<div class="mr-g">${r.group}${r.groupNote ? `<i>${r.groupNote}</i>` : ''}</div>`;
    const dev = r.dev || (Number.isFinite(r.rel) ? devText(r.rel) : '');
    const match = r.open ? `<span class="mr-open">${r.open}</span>`
      : r.same ? `<span class="mt-same">${SAME}${r.sameText || 'same'}</span>`
        : dev ? `<span class="mt-dev ${Number.isFinite(r.rel) ? closeness(r.rel) : ''}">${dev}</span>` : '';
    const tag = r.href ? 'a' : r.page ? 'button' : 'div', link = r.href ? ` href="${esc(r.href)}" target="_blank" rel="noopener"` : r.page ? ' type="button"' : '';
    return `<${tag} class="mr${r.open ? ' mr-is-open' : ''}${r.lead ? ' mr-lead' : ''}"${link}${attrs(r)}>
      <span class="mr-q">${r.sym ? `<b>${r.sym}</b>` : ''}<span>${r.name || ''}${r.note ? `<i>${r.note}</i>` : ''}</span></span>
      <span class="mr-v">${r.value ?? ''}${r.unit && r.value ? `<i>${r.unit}</i>` : ''}</span>
      <span class="mr-m">${r.nature ?? ''}${r.unit && r.nature && !r.noNatureUnit ? `<i>${r.unit}</i>` : ''}${r.natureNote ? `<em>${r.natureNote}</em>` : ''}</span>
      <span class="mr-d">${match}</span></${tag}>`;
  }).join('');
  return `<div class="mr-table${o.cls ? ' ' + o.cls : ''}">${head}${body}</div>`;
}
