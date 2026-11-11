// Exercise the actual thermal illustration, without replacing it by a dynamics claim.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { hotWeights } from './cosmos_evidence.js';
const code = readFileSync(new URL('./cosmos.js', import.meta.url), 'utf8');
const hash = code.match(/^const fpHash = .*$/m)?.[0];
const start = code.indexOf('function fpStdBuild()');
const end = code.indexOf('function fpDrawStd(', start);
assert.ok(hash && start >= 0 && end > start);
const sandbox = { hotWeights, FP: {}, FP_STAGES: Array(7).fill(null) };
vm.runInNewContext(hash + '\n' + code.slice(start, end) + '\nfpStdBuild();', sandbox);
const heavy = sandbox.FP.std.filter(p => p.ks[0] === 'W' || p.ks[0] === 'H');
assert.ok(heavy.length > 0, 'fixture must contain electroweak/Higgs field markers');
for (const particle of heavy) {
  assert.equal(particle.ks[1], particle.ks[0], 'crossover must not instantly turn every W/H marker into a photon');
  assert.equal(particle.ks[2], 'gam', 'later cold-era conversion is retained as a declared illustration');
}
assert.equal(sandbox.FP.std.length, 2200);
console.log(`PASS: ${heavy.length} heavy-field markers retained through the schematic crossover; no instantaneous W/H decay`);
