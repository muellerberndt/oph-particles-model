// The Spectrum tab's hero: every particle row with a mass on one logarithmic axis, from eV to TeV.
// It draws only what the table rows already hold (spectrum.js ROWS): white tick = measured target, filled dot = model value in the
// colour of the value's standing, ring = the unit (electron), dashed ring = no model value yet, bar = the neutrino comparison guide.
// Hover a particle for its numbers; click it to open its row in the table. Also makes the ledger items open on click.

export function mountLadder(host, { rows, ST, fmtGeV, devText, valueStatus, LMIN, LMAX }) {
  if (!host || host.querySelector('.spl')) return;
  const W = 1200, H = 262, x0 = 46, x1 = W - 46, base = 206;
  const X = (m) => x0 + (x1 - x0) * (Math.log10(m) - LMIN) / (LMAX - LMIN);
  const tableRows = rows.filter((r) => !r.fam);
  const items = tableRows.map((r, i) => ({ r, i })).filter(({ r }) => !r.mix && (r.range || r.meas > 0));
  // label lanes: each symbol takes the lowest lane whose previous label is far enough to the left
  const lanes = [];
  const placed = items.map((it) => ({ ...it, x: X(it.r.range ? Math.sqrt(it.r.range[0] * it.r.range[1]) : it.r.meas) })).sort((a, b) => a.x - b.x)
    .map((it) => { let l = 0; while (lanes[l] !== undefined && it.x - lanes[l] < 34) l++; lanes[l] = it.x; return { ...it, lane: l }; });
  const names = { '-9': 'eV', '-6': 'keV', '-3': 'MeV', '0': 'GeV', '3': 'TeV' };
  let s = `<svg class="spl-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Every particle target and model value on one mass axis">
    <defs><filter id="splGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="splAxis" x1="0" x2="1"><stop offset="0" stop-color="#6fb1ff" stop-opacity="0"/><stop offset=".25" stop-color="#6fb1ff" stop-opacity=".45"/><stop offset=".75" stop-color="#a995ff" stop-opacity=".45"/><stop offset="1" stop-color="#a995ff" stop-opacity="0"/></linearGradient>
      <linearGradient id="splBand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fb1ff" stop-opacity="0"/><stop offset="1" stop-color="#6fb1ff" stop-opacity=".07"/></linearGradient></defs>
    <rect x="${x0}" y="${base - 46}" width="${x1 - x0}" height="46" fill="url(#splBand)"/>`;
  for (let e = Math.ceil(LMIN); e <= Math.floor(LMAX); e++) {
    const x = X(10 ** e), major = names[e] !== undefined;
    s += `<line x1="${x}" y1="${base - (major ? 150 : 8)}" x2="${x}" y2="${base + (major ? 8 : 4)}" stroke="rgba(140,170,230,${major ? 0.1 : 0.12})" stroke-width="1"${major ? ' stroke-dasharray="2 5"' : ''}/>`;
    if (major) s += `<text x="${x}" y="${base + 30}" text-anchor="middle" class="spl-ax">1 ${names[e]}</text>`;
  }
  s += `<line x1="${x0}" y1="${base}" x2="${x1}" y2="${base}" stroke="url(#splAxis)" stroke-width="1.5"/>`;
  placed.forEach((it) => {
    const r = it.r, col = ST[valueStatus(r)].color, ly = 30 + it.lane * 25;
    let g = `<line x1="${it.x}" y1="${ly + 7}" x2="${it.x}" y2="${base - 10}" stroke="${col}" stroke-opacity=".22" stroke-width="1"/>`;
    if (r.range) g += `<rect x="${X(r.range[0])}" y="${base - 3.5}" width="${X(r.range[1]) - X(r.range[0])}" height="7" rx="3.5" fill="#e9eefb" fill-opacity=".5"/>`;
    else g += `<line x1="${X(r.meas)}" y1="${base - 13}" x2="${X(r.meas)}" y2="${base + 13}" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>`;
    if (r.model !== undefined && r.model > 0) {
      const xm = X(r.model);
      if (r.errModel) g += `<line x1="${X(r.model - r.err)}" y1="${base}" x2="${X(r.model + r.err)}" y2="${base}" stroke="${col}" stroke-width="4" stroke-linecap="round" stroke-opacity=".5"/>`;
      g += r.unit ? `<circle cx="${xm}" cy="${base}" r="7.5" fill="none" stroke="${col}" stroke-width="2.4" filter="url(#splGlow)"/>`
        : `<circle cx="${xm}" cy="${base}" r="6" fill="${col}" filter="url(#splGlow)"/>`;
    } else g += `<circle cx="${r.range ? X(r.range[0]) : X(r.meas)}" cy="${base}" r="6" fill="none" stroke="${ST.O.color}" stroke-width="1.6" stroke-dasharray="2 2"/>`;
    g += `<text x="${it.x}" y="${ly}" text-anchor="middle" class="spl-sym" fill="${col}">${r.sym}</text>`;
    s += `<g class="spl-it" data-i="${it.i}"><rect x="${it.x - 16}" y="${ly - 18}" width="32" height="${base - ly + 34}" fill="transparent"/>${g}</g>`;
  });
  s += '</svg>';
  const wrap = document.createElement('div'); wrap.className = 'spl'; wrap.id = 'sp-ladder';
  wrap.innerHTML = s + '<div class="spl-tip"></div>';
  const head = host.querySelector('.sp-head');
  if (head) head.after(wrap); else host.prepend(wrap);
  const tip = wrap.querySelector('.spl-tip');
  const rowEls = () => [...host.querySelectorAll('.sp-table .sp-row:not(.sp-hrow)')];
  wrap.querySelectorAll('.spl-it').forEach((el) => {
    const r = tableRows[+el.dataset.i], st = valueStatus(r);
    const meas = r.range ? 'Δm scale ≈ 0.05 eV; mβ < 0.45 eV' : fmtGeV(r.meas);
    const html = `<div class="spl-th"><b style="color:${ST[st].color}">${r.sym}</b> ${r.name}</div>
      <div><span>model</span>${r.model !== undefined ? fmtGeV(r.model) + (r.errModel ? ` ± ${Math.round(r.err * 1000)} MeV` : '') : '–'}</div>
      <div><span>measured</span>${meas}</div><div><span>model − measured</span>${devText(r)}</div>
      <div class="spl-st"><i style="background:${ST[st].color}"></i>${ST[st].label}</div>`;
    el.addEventListener('mouseenter', () => { tip.innerHTML = html; tip.style.display = 'block'; wrap.classList.add('hov'); el.classList.add('on'); });
    el.addEventListener('mousemove', (e) => {
      const b = wrap.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
      tip.style.left = Math.min(b.width - tip.offsetWidth - 6, Math.max(6, x + 16)) + 'px'; tip.style.top = Math.max(6, y - tip.offsetHeight - 12) + 'px';
    });
    el.addEventListener('mouseleave', () => { tip.style.display = 'none'; wrap.classList.remove('hov'); el.classList.remove('on'); });
    el.addEventListener('click', () => {
      const row = rowEls()[+el.dataset.i]; if (!row) return;
      row.classList.add('open', 'spl-flash'); row.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setTimeout(() => row.classList.remove('spl-flash'), 1600);
    });
  });
  // the three ledgers show item titles; a click opens an item's text (the header "?" button shows all)
  host.querySelectorAll('.sp-item').forEach((el) => { el.addEventListener('click', () => el.classList.toggle('open')); });
}
