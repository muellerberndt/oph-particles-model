// Math rendering for the viewer: KaTeX from jsdelivr, loaded once on first use. Until it has loaded, and when the
// network is not reachable, the TeX source stays visible as text.
//   import { tex, typeset } from './math.js';
//   host.innerHTML = `... ${tex('m c^2 = \\theta\\,E_{\\rm cell}', true)} ...`; typeset(host);
const VER = '0.16.11';
const BASE = `https://cdn.jsdelivr.net/npm/katex@${VER}/dist/`;
let ready = null;
function load() {
  if (ready) return ready;
  ready = new Promise((res) => {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = BASE + 'katex.min.css'; document.head.appendChild(l);
    const s = document.createElement('script'); s.src = BASE + 'katex.min.js';
    s.onload = () => res(window.katex || null); s.onerror = () => res(null); document.head.appendChild(s);
  });
  return ready;
}
// HTML for one formula; display = true for a centred display formula. Call typeset(root) after inserting it.
export function tex(src, display = false) {
  const esc = String(src).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<span class="tex${display ? ' tex-d' : ''}" data-tex="${esc.replace(/"/g, '&quot;')}">${esc}</span>`;
}
export async function typeset(root = document.body) {
  const k = await load(); if (!k) return;
  root.querySelectorAll('.tex[data-tex]:not([data-done])').forEach((el) => {
    try { k.render(el.dataset.tex, el, { displayMode: el.classList.contains('tex-d'), throwOnError: false }); el.dataset.done = '1'; } catch (e) { /* the source text stays */ }
  });
}
const st = document.createElement('style');
st.textContent = '.tex{font-family:ui-monospace,Menlo,monospace;font-size:.92em;color:#cfe3ff}.tex[data-done]{font-family:inherit;font-size:1em}.tex-d{display:block;margin:10px 0;text-align:center;overflow-x:auto}';
document.head.appendChild(st);
