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
assert.equal(Object.keys(D.source_sha256).length,142);
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
assert(html.indexOf('data-current-card="propagation"')<html.indexOf('class="jr-supporting"'));
for(const id of ['propagation','cluster','helium','phase','homotopy','resolved','field','units','horizons','haar'])assert(html.includes(`data-current-card="${id}"`));
assert(!html.includes('data-frontier-card='),'Replace the ten visible cards without growing the wall');
assert.equal(D.current_results.yang_mills.Clay_solved,false);
assert.equal(D.current_results.cosmology.Lambda_amplitude_derived,false);
assert.equal(D.current_results.core.physical_running_fit,false);
assert.equal(D.current_results.electromagnetism.physical_pole_fit,false);
assert.equal(D.current_results.clock.autonomous_phase_onset_established,false);
assert.equal(D.current_results.gravity.physical_G,false);
assert.equal(D.current_results.strange.on_shell_strange_channel_open,false);
const {twelfthResults}=await import(pathToFileURL(path.join(site,'twelfth_results.js')));
const priorHtml=twelfthResults();
for(const r of D.current_results.strange.masses.filter(x=>x.comparison_role==='calibration'))assert(priorHtml.includes(r.computed_GeV.toFixed(6)));
for(const phrase of ['Two additional','held-out','not physical pole fits','autonomous phase onset','tested common-unit map fails','Clay solution','dark-energy amplitude is calibrated'])assert(priorHtml.includes(phrase),phrase);
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
 assert(priorHtml.includes('['+display+']'),display);
}
// Binary64 0.1 lies strictly above its one-place decimal; the negative control reverses this.
assert.equal(outwardBox([.1,.1],1),'0.1, 0.2');
assert.equal(outwardBox([-.1,-.1],1),'-0.2, -0.1');
assert.equal(outwardBox([Number.MIN_VALUE,Number.MIN_VALUE],12),'0.000000000000, 0.000000000001');
assert.equal(outwardBox([-Number.MIN_VALUE,-Number.MIN_VALUE],12),'-0.000000000001, 0.000000000000');
assert.equal(outwardBox([.5,.5],1),'0.5, 0.5');
assert.throws(()=>outwardBox([1,0]),/Invalid/);
assert.throws(()=>outwardBox([0,Infinity]),/Invalid/);
console.log('Retained interval formatter and physical source limits PASS');

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

const N=D.completion_results;
assert.equal(N.task_count,10);assert.equal(N.core.static_charge_core_join,true);
assert.equal(N.core.physical_running_curve,false);assert.equal(N.cluster.energy_shell_open,true);
assert.equal(N.cluster.outgoing_weak_decay_proved,false);assert.equal(N.baryon.physical_pole_proved,false);
assert.equal(N.baryon.higher_number_transfer,false);assert.equal(N.nuclear.physical_spectrum_closed,false);
assert.equal(N.gravity.length_only_repair,false);assert.equal(N.yang_mills.Clay_solved,false);
assert.equal(N.cosmology.Lambda_amplitude_derived,false);assert.equal(N.cosmology.alternatives_independent,false);
for(const phrase of ['E→E+A','reference-subtracted ground-energy derivative','on-shell density and physical lifetime are unproved','No nuclear mass is refitted','model-scale effective charges','No nontrivial four-dimensional continuum or Clay result is claimed'])assert(html.includes(phrase),phrase);
for(const x of [D.source_completion.poles.neutron_GeV,D.source_completion.poles.proton_GeV,D.source_completion.strange.Lambda_GeV])assert(html.includes('['+outwardBox(x,9)+']'));
for(const r of N.core.rows)assert(html.includes('['+outwardBox(r.GeV_interval,12)+']'));
for(const r of numberRows.filter(x=>x.id.startsWith('native_')))assert(r.mobileValue,'inline mobile value '+r.id);
assert(numberRows.find(x=>x.id==='native_core_onset').what.includes('ground-energy derivative'));
assert(numberRows.find(x=>x.id==='native_horizon_chi').facts.some(x=>x.includes('Comoving dust interval:')));
assert(numberRows.find(x=>x.id==='native_coupled_gauge').text.includes('Clay problem remains open'));
assert.equal(D.source_completion.strange.on_shell_decay_amplitude,false);
assert.equal(D.source_completion.poles.physical_4D_poles,false);
assert.equal(D.source_completion.radiation.independent_nature_validation,false);
assert(html.includes('not percentages of agreement with nature'));
assert(html.includes('on-shell density and physical lifetime are unproved'));
const rs=fs.readFileSync(path.join(site,'results.js'),'utf8');assert(rs.includes('rs-native-mobile')&&rs.includes('@media(max-width:699px)'));
const {upperScientific}=await import(pathToFileURL(path.join(site,'thirteenth_results.js')));
for(const r of N.yang_mills.bounds.filter(x=>x.volume_error_upper<1))assert(Number(upperScientific(r.volume_error_upper))>=r.volume_error_upper);
for(const id of ['m_mu','m_tau']){const row=numberRows.find(x=>x.id===id);assert.equal(row.cmp.abs,row.model-row.meas.v);}
assert.equal(rows.find(x=>x.id==='running').kind,OPENWAVE.rows.find(x=>x.id===23).status==='met'?'seen':'part');
console.log('Current ten tasks, Results/mobile figures, calibrated source bands and explicit physical limits PASS');

assert(fs.readFileSync(path.join(site,'openwave.js'),'utf8').includes('OPH is admitted as M10. All 31 official physics criteria are untested.'));

for(const row of numberRows.filter(x=>x.refWord==='calibration target')){assert.equal(row.cite,'Declared source calibration');assert(row.refUrl.includes(D.source_revision));assert.equal(row.meas.ref,undefined);}
for(const id of ['native_neutral_vector','native_Delta_plus'])assert(numberRows.find(x=>x.id===id).facts.some(x=>x.includes('PDG 2025')&&x.includes('Breit–Wigner')));

const ewScope=rows.find(x=>x.id==='ew'),colourScope=rows.find(x=>x.id==='tc');
assert(ewScope.tip.includes('declared coupling chain')&&ewScope.tip.includes('not the actual one-doublet source output'));
assert(ewScope.open.includes('not blind')&&ewScope.src[0][1].includes(D.source_revision));
assert.equal(colourScope.natureWord,'pure SU(3) lattice');assert(colourScope.tip.includes('same-action'));
assert(colourScope.open.includes('not an independent physical-QCD')&&colourScope.open.includes('imported ratio'));
console.log('Thermal Matches retain declared-chain and same-action pure-colour benchmark scopes PASS');

// Fable displays r.open only for partial entries; scope must remain visible in r.tip after promotion.
assert(ewScope.tip.includes('not blind')&&ewScope.tip.includes('inputs are supplied'));
assert(colourScope.tip.includes('not an independent physical-QCD'));
assert(rows.find(x=>x.id==='running').tip.includes('selected for resolution')&&rows.find(x=>x.id==='running').tip.includes('not a measured QED/QCD'));

const {retainVisibleConstructionScopes}=await import(pathToFileURL(path.join(site,'construction_matches.js')));
const scopedIds=['gen','confine','baryon','order','deuteron','muondecay','neutrino','beta','slow','bend'];
for(const id of scopedIds){
 const row=rows.find(x=>x.id===id);assert(row.open&&(row.kind==='part'||row.tip.includes(row.open)),'visible source scope '+id);
}
assert(fs.readFileSync(path.join(site,'matches.js'),'utf8').includes("r.kind === 'part' && r.open"),'partial rows render their open scope directly');
const scoped=JSON.stringify(rows);retainVisibleConstructionScopes([{rows}]);
assert.equal(JSON.stringify(rows),scoped,'visible scopes are idempotent');
const promoted=structuredClone(rows);for(const row of promoted)if(scopedIds.includes(row.id))row.kind='seen';
retainVisibleConstructionScopes([{rows:promoted}]);
for(const id of scopedIds){const row=promoted.find(x=>x.id===id);assert(row.tip.includes(row.open),'promoted source scope '+id);}
const promotedOnce=JSON.stringify(promoted);retainVisibleConstructionScopes([{rows:promoted}]);
assert.equal(JSON.stringify(promoted),promotedOnce,'promoted scopes are idempotent');
console.log('Promoted rows retain their calibration and physical-domain limits in expanded Matches details PASS');
assert(fs.readFileSync(path.join(site,'matches.js'),'utf8').includes('Includes calibrated fits and conditional results.'));

const X=D.normalizable_completion;
assert.equal(X.new_independent_nature_validation,false);
assert.equal(X.packets.finite_local_band_filter,false);
assert.equal(X.strange.normalizable_Lambda_packet,false);
assert.equal(X.strange.on_shell_decay,false);
assert.equal(X.cube.Haar_representations_complete,true);
assert.equal(X.cube.full_Hamiltonian_RG,false);
assert.equal(X.geometry.physical_G_matched,false);
assert.deepEqual(X.cosmology.scalar_curvature_bounds,[2,6]);
assert.equal(X.cosmology.source_scalar_particle,false);
assert.equal(X.cosmology.CMB_fit,false);
for(const phrase of ['nonlocal spectral service','N is not fixed independently of observed G','not the early primordial solution','fixed local loop','normalizable Lambda trial'])assert(html.includes(phrase),phrase);
for(const [values,places]of [[X.cube.adjacent_covariance,13],[X.cube.gap_source_units,9],[X.strange.proton_pion_response_squared,9]]){
 const rendered=outwardBox(values,places),[lo,hi]=rendered.split(', ').map(Number);
 assert(lo<=values[0]&&hi>=values[1]);
}
assert(Number(upperScientific(X.geometry.relative_vacuum_variance_upper,6))>=X.geometry.relative_vacuum_variance_upper);
assert(numberRows.find(x=>x.id==='native_neutron').facts.some(x=>x.includes('nonlocal service')));
console.log('Normalizable source records, cubic Haar covariance and conditional scalar limits PASS');

const Z=D.complete_dynamics;
assert(Z.strange.normalizable_packet&&Z.strange.essential_breakup_spectrum);
assert.equal(Z.strange.on_shell_decay,false);assert.equal(Z.strange.weyl_observer_preparation,false);
assert.equal(Z.gauge.frame,201);assert.equal(Z.gauge.continuum_4D,false);
assert(Z.gravity.calibrated_to_observed_G&&!Z.gravity.independent_prediction);
assert.equal(Z.cosmology.observed_match,false);assert.equal(Z.cosmology.interval_error_certificate,false);
for(const phrase of ["99.97%","N is not fixed independently of observed G","existing complete-source gap intervals","supplied Einstein/scalar/fluid equations","mathematical Weyl"])assert(html.toLowerCase().includes(phrase.toLowerCase()),phrase);
for(const x of [Z.strange.rest_GeV,Z.strange.packet_mean_GeV])assert(html.includes("["+outwardBox(x,x===Z.strange.rest_GeV?9:12)+"]"));
for(const row of D.operational_results.gauge)assert(html.includes("["+outwardBox(row.gap,9)+"]"));
assert.equal(Z.new_independent_nature_validation,false);
console.log("Complete dynamics, exact constraints, calibrated gravity and scoped current Results PASS");

const O=D.operational_results;
assert.equal(O.new_independent_nature_validation,false);
assert.equal(O.clock.controls,6);assert.equal(O.clock.carrier,4096);
assert.equal(O.clock.self_starting_sustained,false);assert.equal(O.clock.interval_certificate,false);
assert.equal(O.lambda.rest_mass,false);assert.equal(O.lambda.on_shell_density,false);
assert.equal(O.fock.modes,192);assert.equal(O.fock.same_carrier_rotor_equivalence,false);
assert.equal(O.gravity.observed_G_calibration,true);assert.equal(O.gravity.physical_noise_match,false);
assert.equal(O.capacity.density_growth_or_CMB,false);assert.equal(O.capacity.absolute_amplitude_derived,false);
for(const r of O.nuclear.filter(x=>x.name==='helion'||x.name==='alpha'))assert.equal(r.matches,false);
assert(html.includes('All 114 native source terms'));assert(html.includes('1.302361802725'));
assert(numberRows.find(x=>x.id==='native_horizon_chi').modelText.includes(outwardBox(D.bounded_source_results.capacity.records[0].metric,6)));
assert(numberRows.find(x=>x.id==='native_coupled_gauge').modelText.includes(outwardBox(O.gauge[1].gap,9)));
console.log('Complete native clocks, shifted spectra and normalized metric observation roles PASS');

const V=D.bounded_source_results;
assert.equal(V.new_independent_nature_validation,false);
assert.equal(V.openwave.admitted,true);assert.equal(V.openwave.official_untested,31);assert.equal(V.openwave.exact_arithmetic_values,7);
assert.equal(V.openwave.arithmetic_awards_physics_rows,false);
assert.equal(OPENWAVE.official_admitted,true);assert.equal(OPENWAVE.official_model,'M10');assert(OPENWAVE.rows.every(r=>r.status==='untested'));
assert.equal(V.lambda.positive_lower_bound,false);assert.equal(V.lambda.on_shell_density,false);assert(V.lambda.windows[0].probability[1]<0.026622);
assert.equal(V.strings.physical_quark_mass,false);assert.equal(V.matter.native_process_transfer,false);assert.equal(V.matter.physical_mass_fit,false);
for(const x of V.nuclear.filter(x=>['helion','alpha'].includes(x.name))){assert.equal(x.matches,false);assert(html.includes('['+outwardBox(x.GeV,9)+']'));}
assert(html.includes('7.535487 keV'));assert(html.includes('65,307'));assert(html.includes('3,239,348,495'));
assert.equal(V.capacity.early_primordial_solution,false);assert.equal(V.capacity.absolute_amplitude_derived,false);assert.equal(V.capacity.CMB_match,false);
for(const r of V.capacity.records){assert(html.includes('['+outwardBox(r.metric,9)+']'));assert(html.includes('['+outwardBox(r.comoving_dust,9)+']'));}
assert.equal(V.gauge.fixed_time_continuum,false);assert.equal(V.stress.Einstein_equation_derived,false);assert.equal(V.covariance.independent_G,false);
console.log('Bounded source advances, finite-wavelength records and official M10 gate PASS');

assert.equal(V.clock.cycles,2);assert.equal(V.clock.carrier,32768);assert.equal(V.clock.new_GeV_rest_masses,false);assert.equal(V.clock.exact_strength_independent_detector_frequency,false);assert(html.includes('finite detector has a resolved frequency bias'));for(const r of V.clock.second_flight)assert(html.includes('['+outwardBox(r.frequency,6)+']'));
