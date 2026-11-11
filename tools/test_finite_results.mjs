import assert from 'node:assert/strict';
import {weakRound, asymmetryBound} from './site_extra/finite_results.mjs';

for (const n of [1, 2, 10, 100, 10000, 100000]) {
  const value = weakRound(n);
  assert.ok(Math.abs(value.probabilities.reduce((a,b) => a+b,0)-1) < 3e-15);
  assert.ok(value.probabilities.every(p => p >= 0 && p <= 1));
  assert.ok(value.phase > 0 && value.phase < 2/9);
  assert.ok(value.coherence > 0 && value.coherence < 1);
}
assert.ok(Math.abs(weakRound(100000).phase-2/9) < 2e-12);
assert.ok(Math.abs(weakRound(100).halfDiamondBound-14/8100) < 1e-17);
assert.equal(asymmetryBound(0.5,500),0);
assert.equal(asymmetryBound(1,1),1);
assert.ok(Math.abs(asymmetryBound(0.501,10)-(1-(499/500)**10)) < 1e-14);
assert.throws(() => weakRound(0));
assert.throws(() => weakRound(1.5));
assert.throws(() => asymmetryBound(0.5,-1));
for (const p of [0, 0.5, 1]) {
  for (const initial of [0, 0.25, 1]) assert.equal(asymmetryBound(p, 0, initial), initial);
}
assert.equal(asymmetryBound(0.5, 1000, 0.25), 0.25);
assert.equal(asymmetryBound(0, 1), 1);
assert.equal(asymmetryBound(0.51, 1000, 1), 1);
assert.throws(() => weakRound(Number.MAX_SAFE_INTEGER + 1));
assert.throws(() => asymmetryBound(0.51, Number.MAX_SAFE_INTEGER + 1));

// Independent gap-two Bell coherence: the half-diamond bound covers the
// full {-1,0,1} generator, even though the displayed coherence has gap one.
for (const n of [1, 10, 100, 1000]) {
  const p = 2/9, real = 1-2*p*Math.sin(1/n)**2, imaginary = -p*Math.sin(2/n);
  const modulus = Math.hypot(real, imaginary)**n, phase = n*Math.atan2(imaginary, real);
  const error = Math.hypot(modulus*Math.cos(phase)-Math.cos(2*p), modulus*Math.sin(phase)+Math.sin(2*p))/2;
  const bound = weakRound(n).halfDiamondBound;
  assert.ok(error <= bound + 2e-12);
  if (n === 1000) assert.ok(error > 0.999*bound);
}
console.log('Finite-result interactive calculations passed.');
