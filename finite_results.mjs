export function weakRound(N, p = 2 / 9) {
  if (!Number.isSafeInteger(N) || N < 1 || !(p > 0 && p < 1)) throw new Error('Positive integer rounds and a probability are required');
  const halfSin = Math.sin(1 / (2 * N)), phase = N * Math.atan2(p * Math.sin(1 / N), 1 - 2 * p * halfSin ** 2);
  const factor = 4 * halfSin ** 2;
  const probabilities = [1 - factor * p * (1 - p), factor * 11 / 324, factor * 125 / 1296, factor * 55 / 1296];
  if (p !== 2 / 9) throw new Error('The outcome weights belong to the declared pair with p=2/9');
  return {phase, probabilities, coherence: Math.exp(N * Math.log1p(-factor * p * (1 - p)) / 2),
          halfDiamondBound: Math.min(1, p * (1 - p) / N)};
}

export function asymmetryBound(p, attempts, initial = 0) {
  if (![p, initial].every(x => Number.isFinite(x) && x >= 0 && x <= 1) || !Number.isSafeInteger(attempts) || attempts < 0) throw new Error('Invalid bias budget');
  const defect = Math.abs(2 * p - 1);
  if (attempts === 0 || defect === 0) return initial;
  if (initial === 1 || defect === 1) return 1;
  return -Math.expm1(Math.log1p(-initial) + attempts * Math.log1p(-defect));
}

const COLORS = ['#54d6c7', '#ffc36b', '#83b5ff', '#f49eac'];
const format = (x, digits = 6) => Number(x).toPrecision(digits);
const RER = 'https://github.com/FloatingPragma/observer-patch-holography/blob/main/';

function chart(element, rows, series, {zero = true, xLabel = 'Attempted repairs'} = {}) {
  const w = Math.max(240, Math.min(700, Math.round(element.getBoundingClientRect().width) || 700)), h = 235, l = 55, r = 18, t = 15, b = 42;
  const xs = rows.map(row => row.x), vals = series.flatMap(s => rows.map(row => row[s.key]));
  const xmin = Math.min(...xs), xmax = Math.max(...xs);
  let ymin = zero ? Math.min(0, ...vals) : Math.min(...vals), ymax = Math.max(...vals);
  if (ymax === ymin) ymax = ymin + 1;
  const X = x => l + (x - xmin) / (xmax - xmin || 1) * (w - l - r), Y = y => t + (ymax - y) / (ymax - ymin) * (h - t - b);
  const axis = [0, 0.5, 1].map(f => {const y = ymin + f * (ymax - ymin); return `<line x1="${l}" x2="${w-r}" y1="${Y(y)}" y2="${Y(y)}" stroke="#26364c"/><text x="${l-9}" y="${Y(y)+4}" fill="#a3b1c5" font-size="11" text-anchor="end">${Number(y.toPrecision(3))}</text>`;}).join('');
  const lines = series.map((s, i) => `<polyline points="${rows.map(row => `${X(row.x)},${Y(row[s.key])}`).join(' ')}" fill="none" stroke="${s.color || COLORS[i]}" stroke-width="2.3" ${s.dash ? 'stroke-dasharray="5 4"' : ''}/>`).join('');
  element.innerHTML = `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true">${axis}${lines}<text x="${l}" y="${h-20}" fill="#a3b1c5" font-size="11">${xmin}</text><text x="${w-r}" y="${h-20}" fill="#a3b1c5" font-size="11" text-anchor="end">${xmax}</text><text x="${w/2}" y="${h-3}" fill="#a3b1c5" font-size="11" text-anchor="middle">${xLabel}</text></svg>`;
}

function proofLinks(element, paths) {
  for (const [label, path] of paths) {
    const a = document.createElement('a'); a.textContent = label + ' ↗'; a.href = RER + path; element.append(a);
  }
}

async function mount() {
  const $ = id => document.getElementById(id);
  try {
    const response = await fetch('./finite/results.json');
    if (!response.ok) throw new Error(`Receipt load failed (${response.status})`);
    const data = await response.json();
    if (data.schema !== 'oph.viewer.finite_results.v1') throw new Error('Unexpected receipt schema');
    $('content').hidden = false; // Measure each visible chart at its rendered width.
    const updateRounds = () => {
      const n = Math.round(10 ** Number($('rounds').value)), v = weakRound(n);
      $('round-count').textContent = n.toLocaleString();
      $('phase').textContent = format(v.phase, 9);
      $('coherence').textContent = format(v.coherence, 9);
      $('probability').textContent = v.probabilities.reduce((a,b) => a+b, 0).toFixed(12);
      $('cycle-bound').textContent = `At one declared clock unit, the half-diamond error is at most ${format(v.halfDiamondBound, 4)} for generator eigenvalues −1, 0, 1. This includes arbitrary untouched references.`;
      $('outcomes').replaceChildren();
      v.probabilities.forEach((q, i) => {
        const row = document.createElement('div'), label = document.createElement('div'); label.className = 'bar-label';
        const name = document.createElement('span'), value = document.createElement('span');
        name.textContent = ['Both return', 'First does not return', 'Second does not return', 'Neither returns'][i];
        value.textContent = q > 0.001 ? q.toFixed(7) : q.toExponential(3); label.append(name, value);
        const track = document.createElement('div'), fill = document.createElement('div'); track.className = 'track'; fill.className = 'fill'; fill.style.width = `${100*q}%`; fill.style.background = COLORS[i]; track.append(fill); row.append(label, track); $('outcomes').append(row);
      });
    };
    $('rounds').addEventListener('input', updateRounds); updateRounds();
    $('lepton-shape').textContent = data.lepton.finding;
    proofLinks($('lepton-source'), [['Complete cycles and sensitivities', 'model/lepton_cycle/PROOF.md']]);
    $('epoch-description').textContent = data.epochs.description;
    $('epoch-findings').textContent = data.epochs.finding;
    const epochSeries = [{key:'p0',name:'Class 0'}, {key:'p1',name:'Classes 1 / 5'}, {key:'p2',name:'Classes 2 / 4'}, {key:'p3',name:'Class 3'}];
    const updateEpochs = () => {
      const classes = $('epoch-view').value === 'classes';
      const series = classes ? epochSeries : [{key:'energy', name:'Expected finite cost'}];
      const title = classes ? 'Class-pair probabilities' : 'Load plus register cost';
      $('epoch-chart').closest('.panel').querySelector('h3').textContent = title;
      $('epoch-chart').setAttribute('aria-label', title + ' versus attempted repairs');
      chart($('epoch-chart'), data.epochs.rows, series);
      $('epoch-legend').innerHTML = series.map((s,i) => `<span style="--color:${COLORS[i]}">${s.name}</span>`).join('');
    };
    $('epoch-view').addEventListener('change', updateEpochs); updateEpochs();
    proofLinks($('epoch-source'), [['Exact population law', 'model/native_abundance_epochs/PROOF.md']]);
    const updateBias = () => {
      const p = Number($('coin-bias').value), n = Number($('attempts').value);
      $('coin-value').textContent = p.toFixed(4); $('attempt-value').textContent = n;
      $('bias-bound').textContent = format(asymmetryBound(p,n));
    };
    $('coin-bias').addEventListener('input', updateBias); $('attempts').addEventListener('input', updateBias); updateBias();
    const updateSymmetry = () => chart($('symmetry-chart'), data.symmetry.rows, [{key:'single',name:'Single history'}, {key:'paired',name:'Paired mean',dash:true}]);
    updateSymmetry();
    window.addEventListener('resize', () => {updateEpochs(); updateSymmetry();});
    $('symmetry-findings').textContent = data.symmetry.finding;
    proofLinks($('symmetry-source'), [['Native symmetry and bias proof', 'model/charge_conjugation_dynamics/PROOF.md'], ['Finite-kernel Lean theorem', 'Lean/Dynamics/ChargeConjugation.lean']]);
    for (const row of data.hadron.rows) {
      const tr = document.createElement('tr');
      for (const value of [row.label, format(row.value), format(row.statistical,4), format(row.systematic,4)]) {const td = document.createElement('td'); td.textContent = value; tr.append(td);}
      $('hadron-table').append(tr);
    }
    $('covariance-finding').textContent = data.hadron.finding;
    $('crossover-finding').textContent = data.crossover.finding;
    proofLinks($('lattice-source'), [['Hadron covariance and scale', 'model/quenched_hadron_binding/PROOF.md'], ['Crossover sensitivity', 'model/electroweak_crossover/PROOF.md']]);
    $('repair-finding').textContent = data.repair.finding;
    proofLinks($('repair-source'), [['Record reconstruction and relaxation', 'model/repair_sector_bridge/PROOF.md']]);
    for (const source of data.sources) {
      const a = document.createElement('a'); a.href = `finite/${source.file}`; a.textContent = source.label + ' ↗';
      const sub = document.createElement('small'); sub.textContent = 'SHA-256 ' + source.sha256; a.append(sub); $('source-list').append(a);
    }
    $('loading').hidden = true; $('content').hidden = false;
  } catch (error) {
    $('content').hidden = true;
    $('loading').hidden = false;
    $('loading').textContent = `The calculation receipts could not be loaded. ${error.message}`;
    $('loading').setAttribute('role', 'alert');
  }
}

if (typeof document !== 'undefined') mount();
