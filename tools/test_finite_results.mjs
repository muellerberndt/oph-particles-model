import assert from 'node:assert/strict';
import {weakRound, asymmetryBound, overlapReadout, scalarModeReadout, catalogueRows, jointGroupRows, serviceHistoryRows} from './site_extra/finite_results.mjs';
import {readFileSync} from 'node:fs';

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
const source = JSON.parse(readFileSync(new URL('../../reverse-engineering-reality/model/defect_mode_overlap/results.json',import.meta.url),'utf8'));
const profiles = Object.fromEntries(['uniform','positive_core_patch'].map(key => {
  const row=source.profiles[key];
  return [key,{strengths:row.singular_values,ratio:Math.max(...row.singular_values)/Math.min(...row.singular_values),complement_leakage_norm:row.complement_leakage_norm}];
}));
const patch=overlapReadout({profiles},'positive_core_patch');
assert.ok(Math.abs(patch.ratio-16385)<0.001);
assert.equal(patch.strengths.length,2);
assert.ok(patch.widths[0]>99 && patch.widths[1]>25 && patch.widths[1]<35);
assert.ok(Math.abs(overlapReadout({profiles},'uniform').ratio-1)<1e-10);
assert.throws(()=>overlapReadout({profiles},'unknown'));
assert.throws(()=>overlapReadout({profiles:{patch:{...profiles.positive_core_patch,ratio:1}}},'patch'));
assert.throws(()=>overlapReadout({profiles:{patch:{...profiles.positive_core_patch,strengths:[1,0.5,0.1,0.1]}}},'patch'));
console.log('Finite-result interactive calculations passed.');

const scalarSource=JSON.parse(readFileSync(new URL('../../reverse-engineering-reality/model/defect_scalar_modes/results.json',import.meta.url),'utf8'));
const selected=scalarSource.lowest_mode;
assert.ok(Math.abs(overlapReadout({profiles:{selected:{strengths:selected.unit_ladder_strengths,ratio:selected.strong_to_weak_ratio,complement_leakage_norm:selected.complement_leakage_norm}}},'selected').ratio-1.000122033061)<1e-10);
const first=scalarSource.native_filled_sea_first_image,sea={modes:first.complete_scalar_mode_records,pointer:first.complete_pointer};
assert.ok(Math.abs(scalarModeReadout(sea,1).conditional-.964506586904)<1e-10);
assert.ok(scalarModeReadout(sea,1).original<1e-6);
assert.throws(()=>scalarModeReadout(sea,343));
assert.throws(()=>scalarModeReadout({...sea,modes:sea.modes.slice(0,2)},1));
const catalogueSource=JSON.parse(readFileSync(new URL('../../reverse-engineering-reality/model/defect_mass_catalogue/results.json',import.meta.url),'utf8'));
const catalogue={rows:catalogueSource.target_catalogue};
assert.equal(catalogueRows(catalogue).length,17);
assert.equal(catalogueRows(catalogue,'charged').length,9);
assert.equal(catalogueRows(catalogue,'neutral').length,3);
assert.equal(catalogueRows(catalogue,'bosons').length,5);
assert.throws(()=>catalogueRows(catalogue,'made-up'));
const promoted=structuredClone(catalogue);promoted.rows[0].physical_source_rest_mass_GeV=0;
assert.throws(()=>catalogueRows(promoted));
console.log('Joined-source scalar, mass-map and catalogue controls passed.');

const jointSource=JSON.parse(readFileSync(new URL('../../reverse-engineering-reality/model/particle_joint_mass_identity/results.json',import.meta.url),'utf8'));
const joint={targets:jointSource.conditional_GeV_targets.map(r=>r.species),groups:jointSource.complete_calibrated_joint_instrument.joint_groups.map(r=>({species:r.candidate_species,rank:r.projector_rank}))};
assert.equal(jointGroupRows(joint,'up').length,8);
assert.ok(jointGroupRows(joint,'up').every(r=>r.rank===3));
assert.ok(jointGroupRows(joint,'gluon').every(r=>r.rank===8));
assert.throws(()=>jointGroupRows(joint,'extra_particle'));
const cycles=[1,2,3].map(n=>({cycles:n,records:Array.from({length:4**n},()=>({probability:1/4**n}))}));
assert.equal(serviceHistoryRows({cycles},2).records.length,64);
assert.throws(()=>serviceHistoryRows({cycles},3));
const missing=structuredClone(cycles);missing[2].records.pop();
assert.throws(()=>serviceHistoryRows({cycles:missing},2));
console.log('Complete joint identity and service-history controls passed.');
