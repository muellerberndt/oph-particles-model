import assert from 'node:assert/strict';
import {neutrinoPhaseMass} from './site_extra/finite_results.mjs';
const n={a:2.620608836505021e-12,b:1.12647008588777e-12};
assert.ok(Math.abs(neutrinoPhaseMass(n,0)-(n.a+n.b))<1e-26);
assert.ok(Math.abs(neutrinoPhaseMass(n,180)-(n.a-n.b))<1e-26);
for(let phase=0;phase<=360;phase++){
 const mass=neutrinoPhaseMass(n,phase);assert.ok(mass>=n.a-n.b-1e-26&&mass<=n.a+n.b+1e-26);
}
assert.throws(()=>neutrinoPhaseMass(n,-1));assert.throws(()=>neutrinoPhaseMass(n,361));
console.log('PASS: full Majorana phase envelope and invalid-phase controls');
