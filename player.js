// One way to control every animation of the site: a large round play/pause button, a seek bar, and autoplay.
//   enhance(page)   turns the existing play button of a page into the large round button, styles its slider as the
//                   seek bar, and starts the animation once when the page first opens (the button then shows pause).
//   bar(opts)       a new control row for animations that had none: { onToggle(on), onSeek(frac), label } returns
//                   { el, set(on), pos(frac, text) }.
const st = document.createElement('style');
st.textContent = `
.pl-bar{display:flex;align-items:center;gap:14px;margin:12px 0}
.jy-player{margin:10px 24px 4px}.df-player{margin:4px 0 14px}
.pl-btn,.pl-big{flex:none;width:52px!important;min-width:52px!important;max-width:52px!important;height:52px!important;border-radius:50%!important;border:0!important;padding:0!important;background:var(--teal,#3fe0d0)!important;
  color:#04121a!important;font-size:0!important;line-height:0!important;box-shadow:0 0 26px -6px rgba(63,224,208,.85)!important;cursor:pointer!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;position:relative!important;box-sizing:border-box!important}
.pl-btn::before,.pl-big::before{content:'';display:block;width:0;height:0;border-style:solid;border-width:9px 0 9px 15px;border-color:transparent transparent transparent #04121a;margin-left:4px}
.pl-btn.pl-on::before,.pl-big.pl-on::before{width:14px;height:17px;border:0;margin:0;background:linear-gradient(90deg,#04121a 0 5px,transparent 5px 9px,#04121a 9px 14px)}
.pl-btn:hover,.pl-big:hover{background:#71f0e4!important}
.pl-seek,input[type=range].pl-seek{flex:1;min-width:120px;height:6px;accent-color:var(--teal,#3fe0d0);cursor:pointer}
.pl-time{font-size:12.5px;color:var(--muted,#93a3c0);font-variant-numeric:tabular-nums;white-space:nowrap;min-width:90px}
`;
document.head.appendChild(st);

// page -> the selector of its play button (inside #page-<page>)
const BIG = {
  universe: '#play', observer: '#obsPlay', readout: '#roPlay', cosmos: '#cos-fp-play', timeline: '.tl-play',
  transitions: '.ep-plasma-play', carrier: '#car-run', space: '#sp-run', leptons: '.lp-play [data-a="play"]',
};
const playingText = (b) => /❚❚|pause/i.test(b.textContent || '') || b.classList.contains('pl-on-native');
const started = new Set();
const userTouched = new Set();

function wire(b, page) {
  if (b.dataset.pl) return; b.dataset.pl = '1';
  b.classList.add('pl-big'); b.setAttribute('aria-label', 'play or pause'); if (!b.title) b.title = 'play or pause (space)';
  const sync = () => b.classList.toggle('pl-on', playingText(b));
  sync(); new MutationObserver(sync).observe(b, { childList: true, characterData: true, subtree: true });
  b.addEventListener('click', (e) => { if (e.isTrusted) userTouched.add(page); });
  const range = b.parentElement && b.parentElement.querySelector('input[type=range]');
  if (range) range.classList.add('pl-seek');
}
export function enhance(page) {
  const sel = BIG[page]; if (!sel) return;
  const t0 = performance.now();
  const look = () => {
    const root = document.getElementById('page-' + page); if (!root || !root.classList.contains('on')) return;
    const b = root.querySelector(sel);
    if (!b) { if (performance.now() - t0 < 12000) setTimeout(look, 300); return; }
    wire(b, page);
    if (!started.has(page) && !userTouched.has(page)) {        // autoplay: once, when the page first opens
      started.add(page);
      let tries = 0;                                          // the page's own setup may reset the button: look again a few times
      const go = () => { if (!root.classList.contains('on') || userTouched.has(page)) return; const bb = root.querySelector(sel) || b; if (!playingText(bb)) bb.click(); if (++tries < 4) setTimeout(go, 1500); };
      setTimeout(go, 500);
    }
  };
  look();
}

export function bar({ onToggle, onSeek, label = '', playing = true } = {}) {
  const el = document.createElement('div'); el.className = 'pl-bar';
  el.innerHTML = `<button class="pl-btn${playing ? ' pl-on' : ''}" type="button" aria-label="play or pause" title="play or pause"></button><input class="pl-seek" type="range" min="0" max="1000" value="0" aria-label="seek"><span class="pl-time"></span>`;
  const btn = el.querySelector('.pl-btn'), seek = el.querySelector('.pl-seek'), time = el.querySelector('.pl-time');
  let on = playing, dragging = false;
  btn.onclick = () => { on = !on; btn.classList.toggle('pl-on', on); if (onToggle) onToggle(on); };
  seek.addEventListener('pointerdown', () => { dragging = true; });
  window.addEventListener('pointerup', () => { dragging = false; });
  seek.oninput = () => { if (onSeek) onSeek(+seek.value / 1000); };
  if (label) time.textContent = label;
  return {
    el,
    set(v) { on = v; btn.classList.toggle('pl-on', on); },
    pos(frac, text) { if (!dragging && isFinite(frac)) seek.value = String(Math.round(1000 * Math.max(0, Math.min(1, frac)))); if (text !== undefined) time.textContent = text; },
    get playing() { return on; },
  };
}
