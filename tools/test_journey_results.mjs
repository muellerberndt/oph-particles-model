import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
const site=path.resolve(process.argv[2]||'site');
const {renderJourneyResults}=await import(pathToFileURL(path.join(site,'journey_results.js')));
const {JOURNEY_RESULTS:D}=await import(pathToFileURL(path.join(site,'journey_results_data.js')));
const html=renderJourneyResults();
const journeySource=fs.readFileSync(path.join(site,'journey.js'),'utf8');
assert(!journeySource.includes('journey-matches')&&!journeySource.includes("import('./matches.js')"),'Journey must not duplicate the matches wall');
assert(!journeySource.includes('mountJourneyResults('),'Journey must not duplicate numerical result cards');
assert(journeySource.includes('data-page="matches"')&&journeySource.includes('jy-film')&&journeySource.includes('jy-cards'),'Keep Journey navigation, story and map cards');
assert.match(D.source_revision,/^[0-9a-f]{40}$/);
assert.notEqual(D.uncommitted_preview,true,'An uncommitted local preview cannot pass publication checks');
assert.equal((html.match(/<article /g)||[]).length,70);
assert.equal((html.match(/<details>/g)||[]).length,70);
assert.equal(D.current_tasks.task_count,10);
assert.equal(D.latest_tasks.task_count,10);
for(let i=1;i<=10;i++)assert.equal((html.match(new RegExp(`data-calibration-task="${i}"`,'g'))||[]).length,1);
for(let i=1;i<=10;i++)assert.equal((html.match(new RegExp(`data-task="${i}"`,'g'))||[]).length,1);
for(const r of D.leptons.rows)assert(html.includes(Number(r.mass_GeV).toPrecision(r.name==='electron'?11:13)));
for(const phrase of ['conditional masses','not an experimental mass-fit uncertainty','exactly identical','not physical positron annihilation rates','At source time 50/m','prior exposure to lepton masses','exceeds the reference measurement uncertainty'])assert(html.includes(phrase),phrase);
assert(html.includes('3.544%')&&html.includes('2.865%'));
for(const phrase of ['J² = ¾','g ≈ 1.998275354','charged-energy floor','14 charged internal coordinates','-19.638622','nonlinear Einstein dynamics','observed PMNS angles','source box and preparation are supplied','not a precision prediction'])assert(html.includes(phrase),phrase);
assert(html.includes('[1.998275353408, 1.998275354507]'));
assert(html.includes('2.44135 × 10<sup>-32</sup>'));
assert(D.compiler.cycle_reduction_factor>1e34);
assert.equal(D.quantum.physical_electron_identity_proved,false);
assert.equal(D.higgs.observed_quark_mass_fit,false);
assert.equal(D.gravity.physical_G_or_clock_calibrated,false);
assert.equal(D.weak.physical_lifetime_or_weak_scale_derived,false);
assert.equal((html.match(/id="particle-results"/g)||[]).length,1);
assert.equal(Object.keys(D.source_sha256).length,86);
for(const phrase of ['q = −1','photon-cap removal','Quantum Larmor precession','Neutrino-like flight','GeV width','Bound three-quark','Bound meson','Geometry mediates','finite packet bends','rejected hadron assignments','not an independent mass fit','not running masses','γ=−1 has zero principal-ray bending'])assert(html.includes(phrase),phrase);
for(const r of D.previous_tasks.common_scale.rows)assert(html.includes(Number(r.conditional_GeV).toPrecision(10)));
assert.equal(D.previous_tasks.common_scale.physical_hadron_mass_fit,false);
assert.equal(D.previous_tasks.geometry.physical_G_identified,false);
assert.equal(D.previous_tasks.infinite_photon.independent_mass_fit,false);
assert(html.includes('8.278 × 10<sup>-16</sup>'));
for(let i=1;i<=10;i++)assert.equal((html.match(new RegExp(`data-prior-task="${i}"`,'g'))||[]).length,1);
for(const r of D.reference_tasks.vectorlike.rows){assert(html.includes(Number(r.conditional_light_GeV).toPrecision(10)));assert(html.includes(Number(r.conditional_heavy_GeV).toPrecision(10)));}
for(const r of D.reference_tasks.baryon_ordering.rows)assert(html.includes(Number(r.conditional_GeV_interval[0]).toPrecision(10)));
for(const phrase of ['one explicit OPH implementation','Gauss-constrained','without a photon cap','release of the trap','16/25','semileptonic conversion','every heavy partner','beta decay is energetically forbidden','operational delay','finite oscillator boundary correction','positive quadrupole','not a deuteron mass','not relabelled as the intrinsic'])assert(html.includes(phrase),phrase);
assert.equal(D.reference_tasks.baryon_ordering.beta_decay_energetically_allowed,false);
assert.equal(D.reference_tasks.dynamic_stress.finite_strength_exact_universality,false);
assert(!html.includes('undefined')&&!html.includes('NaN'));
for(let i=1;i<=10;i++)assert.equal((html.match(new RegExp(`data-reference-task="${i}"`,'g'))||[]).length,1);
for(const r of D.current_tasks.calibrated_hadrons.fits)assert(html.includes(Number(r.computed_GeV).toFixed(11)));
assert.equal(D.current_tasks.calibrated_hadrons.independent_mass_prediction,false);
assert.equal(D.current_tasks.nuclear_exchange.physical_deuteron_fit,false);
assert.equal(D.current_tasks.beta.observed_neutron_lifetime_matched,false);
assert(D.current_tasks.beta.conditional_one_electron_probability>.96);
assert(D.current_tasks.beta.unconditional_one_electron_probability<.33);
assert(D.current_tasks.geometry_refinement.cap_three_arrival_TV_upper<.000358);
assert(D.current_tasks.relational_clock.delay_cycles_interval[0]>0);
assert(html.includes('class="jr-supporting"')&&!html.includes('class="jr-supporting" open'));
for(const phrase of ['Calibration target','not three independent predictions','strong/free endpoint','Filled-neutral reference contact shifts','full weak interacting pole masses','held out and fails','2⁴² times larger','not a measured neutrino-mass','full master','not an observed neutron lifetime'])assert(html.includes(phrase),phrase);
assert.equal(D.latest_tasks.neutrino_calibration.oscillation_parameters_are_calibration,true);
assert.equal(D.latest_tasks.neutrino_calibration.rigid_charged_hierarchy_fits_splittings,false);
assert(D.latest_tasks.neutrino_calibration.complete_record_TV_bound<4.1e-9);
assert.equal(D.latest_tasks.nuclear_distance.fixed_four_input_source_is_bound,false);
assert.equal(D.latest_tasks.hadron_spin_constraints.one_common_spin_force_fits_both,false);
assert.equal(D.latest_tasks.platform_kernel.official_award,false);
assert(D.latest_tasks.beta_parity.conditional_parity_upper<0);
assert(D.latest_tasks.common_mass_source.window_probability_lower>.96);
for(const phrase of ['gA = 1.2753','not independently predicted','not one recovered hadron spectrum','one-dimensional polarized source','1500λ','38,880','calibrated mean','0.0010000000','0.050139805'])assert(html.includes(phrase),phrase);
const {matches}=await import(pathToFileURL(path.join(site,'matches_data.js')));
const {OPENWAVE}=await import(pathToFileURL(path.join(site,'openwave_data.js')));
assert.equal(OPENWAVE.evaluated_RER_commit,D.source_revision,'Status and numbers must use the same committed RER source');
assert.match(OPENWAVE.assessment_sha256,/^[0-9a-f]{64}$/);
for(const key of ['met','part','fails','untested'])assert.equal(OPENWAVE.counts[key],OPENWAVE.rows.filter(r=>r.status===key).length);
const M=matches(), rows=M.groups.flatMap(g=>g.rows);
for(const id of ['gen','boost','confine','baryon','order','meson','deuteron','neutrino','slow','bend','beta']){
 const r=rows.find(x=>x.id===id);assert(r,id);
 assert.equal(r.kind,OPENWAVE.rows.find(o=>o.id===r.ow).status==='met'?'seen':'part',id);
}
for(const r of D.current_tasks.calibrated_hadrons.fits){const x=rows.find(x=>x.id==='calibrated_'+r.comparison);assert.equal(x.value,Number(r.computed_GeV).toFixed(11));assert.equal(x.dev,'calibrated');assert.equal(x.natureWord,'fit target');}
assert(M.groups.find(g=>g.id==='cosmos').rows.some(r=>r.page==='cosmology'));
assert(!JSON.stringify(M.open).includes('energetically forbidden'));
assert(rows.find(r=>r.id==='confine').open.includes('1 GeV/fm'));
assert(rows.find(r=>r.id==='boost').open.includes('nonlocal'));
assert(rows.find(r=>r.id==='gen').open.includes('retrospective ancestry'));
console.log('Results projection, Fable data hooks and scientific scope checks PASS');

assert.equal(D.particle_results.task_count,10);
for(let i=1;i<=10;i++)assert.equal((html.match(new RegExp(`data-particle-task=\"${i}\"`,'g'))||[]).length,1);
assert(html.indexOf('data-particle-task="9"')>html.indexOf('class="jr-supporting"'));
assert(html.indexOf('data-task="1"')>html.indexOf('class="jr-supporting"'));
assert.equal(D.particle_results.widths.ratio.used_in_parameter_selection,false);
assert.equal(D.particle_results.electromagnetism.transverse_photons,false);
assert.equal(D.particle_results.boost.full_interacting_Lorentz_covariance,false);

assert.equal(D.frontier_results.task_count,10);
assert.equal(D.frontier_results.additional_pure_gauge_tasks,3);
assert.equal(D.current_results.task_count,10);
assert.equal((html.match(/data-current-card=/g)||[]).length,10);
assert(html.indexOf('data-current-card="strange"')<html.indexOf('class="jr-supporting"'));
for(const id of ['strange','bulk','nuclei','string','core','pauli','clock','photon-gravity','uniform-gap','cosmology'])assert(html.includes(`data-current-card="${id}"`));
assert(!html.includes('data-frontier-card='),'Replace the ten visible cards without growing the wall');
assert.equal(D.current_results.yang_mills.Clay_solved,false);
assert.equal(D.current_results.cosmology.Lambda_amplitude_derived,false);
assert.equal(D.current_results.core.physical_running_fit,false);
assert.equal(D.current_results.electromagnetism.physical_pole_fit,false);
assert.equal(D.current_results.clock.autonomous_phase_onset_established,false);
assert.equal(D.current_results.gravity.physical_G,false);
assert.equal(D.current_results.strange.on_shell_strange_channel_open,false);
for(const r of D.current_results.strange.masses.filter(x=>x.comparison_role==='calibration'))assert(html.includes(r.computed_GeV.toFixed(6)));
for(const phrase of ['Two additional','held-out','not physical pole fits','autonomous phase onset','tested common-unit map fails','Clay solution','dark-energy amplitude is calibrated'])assert(html.includes(phrase),phrase);
assert(rows.find(r=>r.id==='strange_K+').natureWord==='fit target');
assert(rows.find(r=>r.id==='triton_calibrated').dev==='calibrated interval');
assert(rows.find(r=>r.id==='bend').src.some(x=>x[1].includes('openwave_transverse_gravity')));
assert(!journeySource.includes('journey-matches'),'New data must not restore Journey duplication');
const {outwardBox}=await import(pathToFileURL(path.join(site,'twelfth_results.js')));
const currentIntervals=[
 [D.current_results.bulk.neutron_GeV_interval,9],[D.current_results.bulk.proton_GeV_interval,9],
 [D.current_results.bulk.axial_interval,6],
 ...D.current_results.nuclear.masses.map(r=>[r.GeV_interval,7]),
 [D.current_results.core.rows[0].radius_cells_interval,9],
 [D.current_results.core.rows[0].response[0].interval,12],
 [D.current_results.core.rows[0].response.at(-1).interval,12],
 ...D.current_results.electromagnetism.rest_rows.map(r=>[r.source_reference_energy_GeV_interval,12]),
 [D.current_results.clock.bands.at(-1).linewidth_interval,10],
 ...D.current_results.gravity.records.same_joint_native_clock_phase_ratio_intervals.map(r=>[r,7]),
];
for(const [source,places]of currentIntervals){
 const display=outwardBox(source,places),[lo,hi]=display.split(', ').map(Number);
 assert(lo<=source[0]&&source[1]<=hi,display);
 assert(html.includes('['+display+']'),display);
}
// Binary64 0.1 lies strictly above its one-place decimal; the negative control reverses this.
assert.equal(outwardBox([.1,.1],1),'0.1, 0.2');
assert.equal(outwardBox([-.1,-.1],1),'-0.2, -0.1');
assert.equal(outwardBox([Number.MIN_VALUE,Number.MIN_VALUE],12),'0.000000000000, 0.000000000001');
assert.equal(outwardBox([-Number.MIN_VALUE,-Number.MIN_VALUE],12),'-0.000000000001, 0.000000000000');
assert.equal(outwardBox([.5,.5],1),'0.5, 0.5');
assert.throws(()=>outwardBox([1,0]),/Invalid/);
assert.throws(()=>outwardBox([0,Infinity]),/Invalid/);
console.log('Current ten cards, actual GeV outputs and retained physical failures PASS');

const {board}=await import(pathToFileURL(path.join(site,'results_data.js')));
const {applyConstructionNumbers}=await import(pathToFileURL(path.join(site,'construction_matches.js')));
const boardData=applyConstructionNumbers(board()),numberRows=boardData.groups.flatMap(g=>g.rows);
assert.equal(boardData.groups.filter(g=>g.id==='native_masses').length,1);
const once=JSON.stringify(boardData);assert.equal(JSON.stringify(applyConstructionNumbers(boardData)),once,'Results overlay is idempotent');
for(const r of D.frontier_results.strong.mass_fits){const row=numberRows.find(x=>x.id==='native_'+r.name);assert.equal(row.model,r.computed_GeV??((r.interval_GeV[0]+r.interval_GeV[1])/2));assert.equal(row.cmp,null);assert.equal(row.refWord,'calibration target');assert(row.none.includes('OW '));}
for(const r of D.current_results.strange.masses.filter(x=>x.comparison_role==='calibration'))assert.equal(numberRows.find(x=>x.id==='native_'+r.name).model,r.computed_GeV);
assert.equal(numberRows.find(x=>x.id==='native_tau_ratio').model,D.particle_results.widths.ratio.native_ratio);
assert.equal(numberRows.find(x=>x.id==='native_tau_ratio').refWord,'held-out comparison');
for(const [id,particle]of [['m_mu','muon'],['m_tau','tau']]){const row=numberRows.find(x=>x.id===id);assert.equal(row.unit,'GeV');assert.equal(row.model,D.particle_results.leptons.rows.find(x=>x.particle===particle).mass_GeV);}
for(const row of numberRows.filter(x=>x.id.startsWith('native_')))assert(row.more.every(x=>x[2].includes(D.source_revision)));
assert(fs.readFileSync(path.join(site,'results.js'),'utf8').includes('B = applyConstructionNumbers(board(LIVE));'));
assert(!JSON.stringify(boardData).includes('NaN'));
console.log('Compact Results page: source-bound GeV values, held-out ratio and calibration labels PASS');
