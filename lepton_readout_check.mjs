// Checks lepton_readout.js against the theory session's fixtures (repair-law/work/LEPTON_READOUT/lepton_readout.json).
import { readFileSync } from 'node:fs';
import { definitePosition, evolve, positions, readMass, weights, Y } from './lepton_readout.js';
const F = JSON.parse(readFileSync(new URL('./fixtures/lepton_readout.json', import.meta.url)));
let worst = 0;
for (const row of F.defect_at_definite_position.circulation) {
  const p = positions(evolve(definitePosition(0), row.tick));
  worst = Math.max(worst, ...p.map((x, j) => Math.abs(x - row.position_probabilities[j])));
}
console.log('circulation vs fixture: max deviation', worst.toExponential(2), worst < 2e-6 ? 'pass' : 'FAIL');
console.log('ratios', (Y[2] / Y[1]).toFixed(6), (Y[0] / Y[1]).toFixed(4));
let s = 7; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
for (const T of [32, 512, 4096]) {
  const N = T > 1000 ? 300 : 1500; let same = 0, tally = [0, 0, 0], purity = 0;
  for (let i = 0; i < N; i++) {
    const r = readMass(definitePosition(0), T, rnd), w = weights(r.state), k = w.indexOf(Math.max(...w));
    tally[k]++; purity += Math.max(...w);
    const r2 = readMass(r.state, T, rnd), w2 = weights(r2.state); if (w2.indexOf(Math.max(...w2)) === k) same++;
  }
  console.log(`T=${T}: shares tau/e/mu ${tally.map((x) => (100 * x / N).toFixed(1)).join('/')} %, mean top posterior ${(purity / N).toFixed(4)}, repeat same ${(100 * same / N).toFixed(2)} %`);
}
