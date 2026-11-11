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

export function overlapReadout(overlap, profile) {
  if (!Object.hasOwn(overlap.profiles, profile)) throw new RangeError('Unknown scalar profile');
  const row = overlap.profiles[profile], strengths = row.strengths;
  if (!Array.isArray(strengths) || strengths.length !== 4 ||
      !strengths.every(x => Number.isFinite(x) && x > 0) ||
      Math.abs(strengths[0]/strengths[1]-1) > 1e-9 || Math.abs(strengths[2]/strengths[3]-1) > 1e-9) {
    throw new Error('Four complete doubled scalar strengths required');
  }
  const ratio = Math.max(...strengths)/Math.min(...strengths);
  if (!Number.isFinite(row.ratio) || Math.abs(ratio/row.ratio-1) > 1e-10 ||
      !Number.isFinite(row.complement_leakage_norm) || row.complement_leakage_norm < 0) {
    throw new Error('Scalar ratio or complete leakage differs');
  }
  return {ratio, strengths:[strengths[0], strengths[2]], leakage:row.complement_leakage_norm,
    widths:[strengths[0], strengths[2]].map(x => 100*Math.max(0,Math.min(1,(Math.log10(x)+6)/6)))};
}

export function scalarModeReadout(sea, index) {
  if (!Number.isInteger(index) || index < 0 || index >= sea.modes.length || sea.modes.length !== 343) throw new RangeError('Complete scalar mode index required');
  const row=sea.modes[index],conditional=row.conditional_first_image_probability,original=row.original_pointer_and_mode_probability;
  if (row.mode!==index || !Number.isFinite(conditional) || conditional<0 || conditional>1 || !Number.isFinite(original) || original<0 || Math.abs(original-sea.pointer.success_probability*conditional)>1e-14) throw new Error('Original scalar weight differs');
  return {conditional,original};
}

export function catalogueRows(catalogue, filter='all') {
  if (!['all','charged','neutral','bosons'].includes(filter)) throw new RangeError('Unknown catalogue filter');
  if (catalogue.rows.length!==17 || new Set(catalogue.rows.map(r=>r.species)).size!==17 || catalogue.rows.some(r=>r.physical_source_rest_mass_GeV!==null || r.native_source_prediction!==false || !Number.isFinite(r.empirically_calibrated_action_parameter_GeV))) throw new Error('Explicit physical and empirical columns required');
  return catalogue.rows.filter(row=>filter==='all' || (filter==='charged' ? Boolean(row.native_channel) : filter==='neutral' ? row.species.startsWith('neutrino_') : !row.native_channel && !row.species.startsWith('neutrino_')));
}

export function compilerMassReadout(compiler,index) {
  if(!Number.isInteger(index)||index<0||index>=3||compiler.rows.length!==3||compiler.records.length!==36)throw new RangeError('Complete compiled family and 36 records required');
  const family=compiler.rows[index];
  if(!(family.source_mass>0&&family.GeV>0)||Math.abs(compiler.records.reduce((x,r)=>x+r.probability,0)-1)>1e-12)throw new Error('Complete original compiled mass law required');
  return {family,records:compiler.records.map(r=>({...r,source_energy:r.energy_in_units_of_same_m*family.source_mass,GeV_energy:r.energy_in_units_of_same_m*family.GeV}))};
}

export function originalIntervalTotal(records) {
  if(!Array.isArray(records)||!records.length)throw new Error('Original probability records required');
  const totals=[0,0];
  for(const r of records) {
    const p=r.probability;
    if(!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite)||p[0]<0||p[0]>p[1]||p[1]>1)throw new Error('Valid original probability interval required');
    totals[0]+=p[0];totals[1]+=p[1];
  }
  if(totals[0]>1+2e-12||totals[1]<1-2e-12)throw new Error('Original records do not sum to one');
  return totals;
}

export function quarkRecordReadout(quarks,key,label) {
  let rows;
  if(key==='electric_dressing') {
    const channel=quarks.dressed.find(r=>r.label===label);if(!channel)throw new RangeError('Unknown dressed channel');
    rows=channel.records.map((r,i)=>({label:`Energy ${i}`,source_energy:null,total_energy:r.energy,probability:r.probability}));
    rows.push({label:'Failure',source_energy:null,total_energy:null,probability:[channel.failure_probability,channel.failure_probability]});
  } else {
    const mechanism=quarks.mechanisms.find(r=>r.key===key),channel=mechanism?.channels.find(r=>r.label===label);
    if(!channel)throw new RangeError('Unknown response mechanism or channel');
    rows=[...channel.records,{label:'Failure',source_energy:null,total_energy:null,probability:[channel.failure_probability,channel.failure_probability]}];
  }
  originalIntervalTotal(rows);return rows;
}

function mountMassSources(data,$) {
  const all=data.mass_sources;
  if(!all)throw new Error('Source-separated mass constructions required');
  const bounds=p=>p===null?'Not measured':p[0]===p[1]?format(p[0],9):`[${format(p[0],9)}, ${format(p[1],9)}]`;
  const row=(target,values,zero=false)=>{const tr=document.createElement('tr');if(zero)tr.dataset.zero='true';for(const value of values){const td=document.createElement('td');td.textContent=value;tr.append(td);}target.append(tr);};
  const option=(target,value,label)=>{const element=document.createElement('option');element.value=value;element.textContent=label;target.append(element);};
  const c=all.compiler;
  $('compiler-scope').textContent=c.scope;$('compiler-mode-count').textContent=c.enlarged_modes_per_site.toLocaleString();
  $('compiler-precision').textContent=`At source time 1 and one site, N=${BigInt(c.steps).toLocaleString()} rounds bounds the complete unhalved trace error by ${c.trace_error.toExponential(2)} and the rest-frequency error by ${c.energy_error.toExponential(2)} source units.`;
  $('compiler-precision-scope').textContent=c.precision_scope;
  $('compiler-scale').textContent=`One electron anchor sets the source energy unit to ${format(c.source_energy_unit_GeV,12)} GeV. Converting the declared unit scalar background literally gives that same value; matching the empirical weak scale and dynamical Higgs normalization is unproved.`;
  c.rows.forEach((r,i)=>option($('compiler-family'),i,r.label));
  const updateCompiler=()=>{
    const {family,records}=compilerMassReadout(c,Number($('compiler-family').value));
    $('compiler-family-summary').textContent=`${family.label}: source rest coefficient ${format(family.source_mass,12)}, electron-anchored free mass ${family.display_GeV} GeV.`;
    const range=c.ratio_intervals.find(r=>r.label===family.label);
    $('compiler-ratio-range').textContent=range?`The finite-compiler ratio lies in ${bounds(range.ratio_interval)}. Conditional GeV interval ${bounds(range.electron_anchored_GeV_interval)}; empirical-anchor uncertainty is separate.`:'The electron value fixes the one empirical energy unit.';
    $('compiler-records').replaceChildren();for(const r of records)row($('compiler-records'),[`${r.setting} / ${r.reservoir_out}${r.success?' / success':' / failure'}`,r.native_electric_charge,format(r.source_energy,10),format(r.GeV_energy,10),format(r.probability,9)],r.probability===0);
  };
  $('compiler-family').addEventListener('change',updateCompiler);updateCompiler();
  proofLinks($('compiler-source'),[['Full analyzer, family map, CAR law and mass readout','model/lepton_mass_compiler/PROOF.md']]);
  const action=all.quadratic;$('action-scope').textContent=action.scope;$('action-clock').textContent=`Declared clock: ${action.clock}. Source energy subtracts the stated reference cost once.`;
  for(const r of action.targets)row($('action-targets'),[r.species.replace('neutrino_mass_eigenstate_','Neutrino ν'),format(r.rest_coefficient_GeV.numeric,12),`${r.mass_convention}. ${r.missing_physical_attachment}.`]);
  action.readouts.forEach((r,i)=>option($('action-readout'),i,r.label));
  const updateAction=()=>{
    const readout=action.readouts[Number($('action-readout').value)];$('action-records').replaceChildren();
    const probability=readout.records.reduce((x,r)=>x+r.probability.numeric,0),zeros=readout.records.filter(r=>r.probability.numeric===0).length;
    $('action-readout-summary').textContent=`${readout.records.length} original rows, ${zeros} with zero probability; total ${probability.toFixed(12)}. The fermion pointer rows also retain their explicitly zero outside-energy complement. Color/reference components remain coherent. Approximate displayed energies do not resolve the tiny neutrino splittings at momentum 1 GeV; the exact source blocks do.`;
    for(const r of readout.records)row($('action-records'),[`${r.species??r.flavour} / ${r.orientation}`,`${r.pointer}${r.outside?' / outside':r.mass_eigenstate?` / ν${r.mass_eigenstate}`:r.energy_projector_index!==undefined?` / ${r.energy_projector_index}`:''}`,r.source_energy_GeV===null?'Outside':format(r.source_energy_GeV.numeric,12),r.reference_energy_GeV??readout.reference_cost_GeV,format(r.probability.numeric,10)],r.probability.numeric===0);
  };
  $('action-readout').addEventListener('change',updateAction);updateAction();
  for(const r of action.extra_candidates){const p=document.createElement('p');p.textContent=`${r.candidate}: ${r.classification}`;$('action-extra').append(p);}
  proofLinks($('action-source'),[['Complete quadratic action and original instruments','model/conditional_particle_spectrum/PROOF.md'],['Empirical common-scale inputs','model/common_source/calibrated_matter_parameters.json']]);
  const neutral=all.neutrinos;$('neutral-scope').textContent=neutral.scope;$('neutral-clock').textContent=neutral.clock;
  $('neutral-calibration').textContent=`Optional empirical-unit comparison: ${neutral.conditional_GeV.map(x=>x.toExponential(9)+' GeV').join(' and ')}. Neither value is assigned to an active or sterile species; these are not independent predictions.`;
  neutral.controls.forEach((r,i)=>option($('neutral-control'),i,r.label));
  const updateNeutral=()=>{
    const control=neutral.controls[Number($('neutral-control').value)];
    const index=Number($('neutral-probe').value)||0,probe=control.probes[index];originalIntervalTotal(probe.records);
    $('neutral-summary').textContent=`Physical Gauss ground ${bounds(control.ground)}, ${control.energy_count} target energies, ${probe.records.length} complete preparation-plus-probe records. Ground preparation weight 1/80 is retained.`;
    $('neutral-records').replaceChildren();for(const r of probe.records)row($('neutral-records'),[r.label,r.energy_kind,bounds(r.energy),bounds(r.probability)],r.probability[1]===0);
  };
  const chooseNeutral=()=>{const control=neutral.controls[Number($('neutral-control').value)];$('neutral-probe').replaceChildren();control.probes.forEach((r,i)=>option($('neutral-probe'),i,r.label));updateNeutral();};
  $('neutral-control').addEventListener('change',chooseNeutral);$('neutral-probe').addEventListener('change',updateNeutral);chooseNeutral();
  proofLinks($('neutral-source'),[['Neutral transport, complete coupled spectra and scale ancestry','model/neutrino_mass_response/PROOF.md']]);
  const density=all.scalar_density;originalIntervalTotal(density.records);$('density-gap').textContent=bounds(density.gap);$('density-weight').textContent=bounds(density.weight);$('density-scope').textContent=density.scope;
  for(const r of density.records)row($('density-records'),[r.label,bounds(r.energy),bounds(r.probability)],r.probability[1]===0);
  proofLinks($('density-source'),[['Exact density pole and all six records','model/native_scalar_density_pole/PROOF.md']]);
  const quarks=all.quarks;$('resolution-scope').textContent=quarks.scope;
  quarks.mechanisms.forEach(r=>option($('resolution-mechanism'),r.key,r.label));option($('resolution-mechanism'),'electric_dressing','Positive Gauss electric dressing');
  for(const r of quarks.dressed){const p=document.createElement('p');p.textContent=`${r.label}, hypercharge ${r.charge}: positive electric energy ${format(r.electric_energy,11)} source units.`;$('dressing-summary').append(p);}
  const updateQuarks=()=>{
    const key=$('resolution-mechanism').value,label=$('resolution-channel').value,records=quarkRecordReadout(quarks,key,label),mechanism=quarks.mechanisms.find(r=>r.key===key);
    $('resolution-law').textContent=mechanism?mechanism.law:'Positive longitudinal field energy from the complete cone Gauss problem; one common coefficient.';
    $('resolution-result').textContent=mechanism?`Selected up/down response ratio ${format(mechanism.ratio,10)}, frozen running-target ratio ${format(quarks.target_ratio,10)}. One shared scale does not match both targets. With the up anchor, the conditional down value is ${format(mechanism.u_anchored_d_GeV,11)} GeV.`:`The corresponding up-minus-down electric shift is ${format(quarks.electric_shift_difference,11)} source units. This is a static dressing difference, with no rest-mass or GeV assignment.`;
    $('resolution-record-summary').textContent=`All ${records.length} selected energy/branch records, including failure probability 1/2. Energies on failure are unmeasured. Source/relational and total-with-reference columns retain their distinct definitions; the Gauss extension displays the total dressed gap.`;
    $('resolution-records').replaceChildren();for(const r of records)row($('resolution-records'),[r.label,bounds(r.source_energy),bounds(r.total_energy),bounds(r.probability)],r.probability[1]===0);
  };
  $('resolution-mechanism').addEventListener('change',updateQuarks);$('resolution-channel').addEventListener('change',updateQuarks);updateQuarks();
  proofLinks($('resolution-source'),[['Complete response measures and shared-scale tests','model/quark_flavour_resolution/PROOF.md'],['Positive electric dressing and native symmetry','model/quark_gauge_dressing/PROOF.md']]);
  const composites=all.composites;$('composite-scope').textContent=composites.scope;
  const updateComposites=()=>{
    const key=$('composite-anchor').value;$('composite-records').replaceChildren();
    for(const r of composites.rows){const v=r[key];row($('composite-records'),[r.particle,format(v.value_GeV,11),format(v.statistical_GeV,5),format(v.fit_sensitivity_GeV,5),r.experimental_reference?format(r.experimental_reference.value_GeV,10):'No extra reference inserted']);}
    $('composite-inputs').textContent=`Declared tuning mπ/mρ=${composites.empirical_inputs.light_quark_tuning_mpi_over_mrho}; rho anchor ${composites.empirical_inputs.rho_anchor_GeV} GeV; alternative √σ=${composites.empirical_inputs.alternative_sqrt_sigma_GeV} GeV. Statistical errors are paired jackknife errors; fit sensitivity is a finite choice envelope. Total anchor/model uncertainty is not supplied.`;
  };
  $('composite-anchor').addEventListener('change',updateComposites);updateComposites();
  $('composite-splitting').textContent=`The degenerate-isospin source gives zero charged/neutral pion splitting. The quoted measured difference is ${format(composites.splitting.experimental_difference_GeV,9)} GeV; electromagnetic and nondegenerate up/down terms are absent.`;
  proofLinks($('composite-source'),[['Pion triplet, nucleon comparison and two scale choices','model/pion_mass_readout/PROOF.md'],['Archived lattice measurements','model/quenched_hadron_binding/README.md']]);
}

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
    const joined = data.joined_defect;
    if (!joined || joined.physical_mass_map_proved !== false) throw new Error('Conditional mass-map boundary required');
    mountMassSources(data,$);
    for (const row of data.mass_sources.compiler.rows) {
      const card=document.createElement('article'), title=document.createElement('span'), value=document.createElement('strong'), role=document.createElement('small');
      card.className='mass-card'; title.textContent=row.label[0].toUpperCase()+row.label.slice(1); value.textContent=row.display_GeV+' GeV';
      role.textContent=row.label==='electron'?'Empirical electron anchor':'Compiled free-source mass'; card.append(title,value,role); $('conditional-lepton-cards').append(card);
    }
    $('conditional-lepton-scope').textContent='A declared full fermion source compiles the native analyzer effect into free Dirac rest energies. The same-source mass readout is proved in its controlled limit. Identification with observed interacting leptons, a physical clock and the Higgs weak scale remains conditional; the fixed phase and architecture retain their retrospective ancestry.';
    $('conditional-comparison').textContent=`Fixed-reference comparison: muon +${format(joined.lepton_comparison.muon_residual_ppm,7)} ppm; tau +${format(joined.lepton_comparison.tau_residual_ppm,7)} ppm. ${joined.lepton_comparison.uncertainty}.`;
    proofLinks($('conditional-source'),[['Compiled free-source mass and complete readout','model/lepton_mass_compiler/PROOF.md'],['Fixed lepton comparison','model/lepton_cycle/COMPARISON.md']]);
    $('joined-finding').textContent=joined.joined_source.finding;
    const selectedProfiles={profiles:{...data.defect_response.overlap.profiles,...joined.selected_scalar.profiles}};
    const updateSelectedScalar=()=>{
      const key=$('selected-scalar-profile').value,row=overlapReadout(selectedProfiles,key);
      $('selected-scalar-ratio').textContent=key==='positive_core_patch'?row.ratio.toLocaleString(undefined,{maximumFractionDigits:1}):format(row.ratio,11);
      $('selected-scalar-strengths').replaceChildren();
      row.strengths.forEach((value,i)=>{
        const item=document.createElement('div'), label=document.createElement('div'), name=document.createElement('span'), number=document.createElement('span');label.className='bar-label';
        name.textContent=['First strength × 2','Second strength × 2'][i];number.textContent=format(value,11);label.append(name,number);
        const track=document.createElement('div'),fill=document.createElement('div');track.className='track';fill.className='fill';fill.style.width=`${row.widths[i]}%`;fill.style.background=COLORS[i];track.append(fill);item.append(label,track);$('selected-scalar-strengths').append(item);
      });
      $('selected-scalar-detail').textContent=key==='source_lowest'?`Free frequency ${format(joined.selected_scalar.frequency,10)}. Canonical blank-reference strengths ${format(joined.selected_scalar.canonical_strengths[0],10)} and ${format(joined.selected_scalar.canonical_strengths[2],10)} use √(2ω) times the ladder overlap. Exterior leakage ${format(row.leakage,7)}.`:`Profile diagnostic; complete exterior leakage ${format(row.leakage,7)}. Logarithmic bars span 10⁻⁶ to 1.`;
    };
    $('selected-scalar-profile').addEventListener('change',updateSelectedScalar);updateSelectedScalar();
    const sea=joined.backreaction;
    $('sea-reference').textContent=sea.reference;
    $('sea-odd-share').textContent=(100*sea.modes[1].conditional_first_image_probability).toFixed(6)+'%';
    $('sea-even-share').textContent=(100*sea.modes[0].conditional_first_image_probability).toFixed(6)+'%';
    for (const row of sea.modes) {const option=document.createElement('option');option.value=row.mode;option.textContent=`Mode ${row.mode}${row.mode===0?' · even bound':row.mode===1?' · odd bound':''} · ω ${format(row.frequency,9)}`;$('sea-mode').append(option);}
    $('sea-mode').value='1';
    const updateSea=()=>{const row=scalarModeReadout(sea,Number($('sea-mode').value));$('sea-mode-detail').textContent=`Conditional weight ${(100*row.conditional).toPrecision(7)}%; original attempt probability ${row.original.toExponential(8)}.`;};
    $('sea-mode').addEventListener('change',updateSea);updateSea();
    $('sea-pointer').textContent=`Original success ${sea.pointer.success_probability.toExponential(8)}, failure ${sea.pointer.failure_probability.toPrecision(12)}. All 343 modes plus failure are retained. ${sea.scope}`;
    $('sea-ritz').textContent=`The two-vector Ritz energy is ${format(sea.Ritz_relative_energy,11)} relative to the sea. A separate rational bound proves a strict lowering of at least ${sea.strict_lowering} source-energy units.`;
    proofLinks($('selected-scalar-source'),[['Scalar spectrum, complete sea response and strict bound','model/defect_scalar_modes/PROOF.md'],['Chosen-patch overlap control','model/defect_mode_overlap/PROOF.md']]);
    $('joined-pulse').textContent=`At source time ${joined.joined_source.pulse_time}, distant-pair probability lies in [${joined.joined_source.pulse_probability_bounds.map(x=>x.toExponential(6)).join(', ')}].`;
    $('joined-pulse-scope').textContent=joined.joined_source.pulse_scope;
    proofLinks($('joined-source'),[['Full Hamiltonian and actual propagation control','model/defect_mass_join/PROOF.md']]);
    const native=joined.native_vertices;
    $('native-moment').textContent=format(native.scalar_first_moment,10);$('native-contact').textContent=format(native.canonical_unit_contact,10);
    $('native-finding').textContent=native.finding;$('native-scope').textContent=native.scope;
    $('native-complete').textContent=`Each of four scalar probe branches has original weight ${format(native.branch_weight,10)}; the no-operation branch has weight ${format(native.no_operation_probability,10)}. Together they sum to one.`;
    proofLinks($('native-source'),[['Native contact and scalar energy records','model/defect_family_vertices/PROOF.md']]);
    joined.dispersion.cases.forEach((row,i)=>{const option=document.createElement('option');option.value=i;option.textContent=`Side ${row.side}, texture amplitude ${row.texture_mass}, all ${row.dimension} rows`;$('dispersion-case').append(option);});
    $('dispersion-case').value=String(joined.dispersion.cases.length-1);
    const updateDispersion=()=>{
      const row=joined.dispersion.cases[Number($('dispersion-case').value)];$('dispersion-table').replaceChildren();
      for (const record of row.rows) {
        const tr=document.createElement('tr'),axis=record.axis===null?'Γ':`${['x','y','z'][record.axis]} · ${format(record.phase,4)}`;
        for (const text of [axis,...record.low_energies.slice(2).map(x=>format(x,12)),...record.energy_change.map(x=>x.toExponential(5))]) {const td=document.createElement('td');td.textContent=text;tr.append(td);}$('dispersion-table').append(tr);
      }
    };
    $('dispersion-case').addEventListener('change',updateDispersion);updateDispersion();$('dispersion-scope').textContent=joined.dispersion.scope;
    proofLinks($('dispersion-source'),[['Bloch blocks and complete addition/removal records','model/defect_dispersion/PROOF.md']]);
    $('catalogue-scope').textContent=joined.catalogue.scope;$('catalogue-clock').textContent=joined.catalogue.clock_test;
    const updateCatalogue=()=>{
      const rows=catalogueRows(joined.catalogue,$('catalogue-filter').value);$('catalogue-table').replaceChildren();$('catalogue-count').textContent=`Showing ${rows.length} of 17 target species. All 17 physical source rest masses are unresolved.`;
      for (const row of rows) {
        const tr=document.createElement('tr'),label=row.species.replace('neutrino_mass_eigenstate_','Neutrino ν');
        for (const value of [label,'Unproved',format(row.empirically_calibrated_action_parameter_GeV,10)]) {const td=document.createElement('td');td.textContent=value;if(value==='Unproved')td.className='unresolved';tr.append(td);}
        const detail=document.createElement('td'),convention=document.createElement('div'),attachment=document.createElement('small');convention.textContent=row.parameter_convention;attachment.textContent=row.attachment;detail.append(convention,attachment);tr.append(detail);$('catalogue-table').append(tr);
      }
    };
    $('catalogue-filter').addEventListener('change',updateCatalogue);updateCatalogue();
    for (const row of joined.catalogue.extra_modes) {const p=document.createElement('p');p.className='small';p.textContent=`${row.sector}: ${row.count}. ${row.meaning}.`;$('catalogue-extra').append(p);}
    proofLinks($('catalogue-source'),[['All target labels, clock test and calibration ancestry','model/defect_mass_catalogue/PROOF.md']]);

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
    proofLinks($('lepton-source'), [['Complete cycles and sensitivities', 'model/lepton_cycle/PROOF.md'], ['Fixed references and residual budget', 'model/lepton_cycle/COMPARISON.md']]);
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
    $('species-finding').textContent = data.species.finding;
    $('thermal-scope').textContent = data.species.thermal_scope;
    const updateSpecies = () => {
      const row = data.species.cases[$('species-menu').value];
      $('species-rank').textContent = `${row.rank} of ${row.components}`;
      $('species-nullity').textContent = row.nullity;
      $('species-labels').textContent = row.family_label_values;
      $('species-detail').textContent = `All selected up/down and charged/neutral aggregates require ${row.all_label_values} extra label values, with the original class retained. This is a dictionary information bound; the readout is not a physical instrument.`;
    };
    $('species-menu').addEventListener('change', updateSpecies); updateSpecies();
    for (const row of data.species.thermal_rows) {
      const tr = document.createElement('tr');
      for (const value of [row.label, `${(100*row.number).toFixed(4)}%`, `${(100*row.energy).toFixed(4)}%`]) {const td = document.createElement('td'); td.textContent = value; tr.append(td);}
      $('thermal-table').append(tr);
    }
    proofLinks($('species-source'), [['Sharp bounds, minimum labels and thermal reference', 'model/native_abundance_epochs/SPECIES_PROOF.md']]);
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
    const defect = data.defect_response;
    $('defect-principle').textContent = defect.principle;
    $('overlap-finding').textContent = defect.overlap.finding;
    $('overlap-scope').textContent = defect.overlap.scope;
    $('defect-domains').textContent = defect.source_domains;
    const updateOverlap = () => {
      const row = overlapReadout(defect.overlap, $('overlap-profile').value);
      $('overlap-ratio').textContent = row.ratio.toLocaleString(undefined,{maximumFractionDigits:1});
      $('overlap-strengths').replaceChildren();
      row.strengths.forEach((value,i) => {
        const container=document.createElement('div'), label=document.createElement('div'); label.className='bar-label';
        const name=document.createElement('span'), number=document.createElement('span');
        name.textContent=['Strong channel × 2','Weak channel × 2'][i]; number.textContent=format(value,9); label.append(name,number);
        const track=document.createElement('div'), fill=document.createElement('div'); track.className='track'; fill.className='fill';
        fill.style.width=`${row.widths[i]}%`; fill.style.background=COLORS[i]; track.append(fill); container.append(label,track); $('overlap-strengths').append(container);
      });
      $('overlap-strengths').setAttribute('aria-label',`Two doubled strengths: ${row.strengths.join(' and ')}; ratio ${row.ratio}.`);
      $('overlap-leakage').textContent=`Complete complementary-mode leakage norm: ${row.leakage < 1e-10 ? 'below 10⁻¹⁰' : format(row.leakage,7)}. The exterior is retained in the response calculation.`;
    };
    $('overlap-profile').addEventListener('change',updateOverlap); updateOverlap();
    proofLinks($('overlap-source'), [['Complete site kernel and exterior residue','model/defect_mode_overlap/PROOF.md']]);
    $('vertex-finding').textContent=defect.vertex.finding;
    $('vertex-dimension').textContent=defect.vertex.source_dimension;
    $('vertex-moment').textContent=defect.vertex.scalar_spectral_moment;
    $('vertex-contact').textContent=defect.vertex.normalized_contact_coefficient_display;
    $('vertex-slope').textContent=defect.vertex.pair_pointer_slope;
    $('vertex-scope').textContent=defect.vertex.scope;
    proofLinks($('vertex-source'), [['Quantum scalar insertion and complete records','model/yukawa_defect_vertex/PROOF.md']]);
    $('scalar-finding').textContent=defect.scalar.finding;
    $('scalar-formula').textContent=defect.scalar.formula;
    $('scalar-scope').textContent=defect.scalar.scope;
    for (const row of defect.scalar.rows) {
      const tr=document.createElement('tr');
      for (const value of [row.label,format(row.moment,10),format(row.derivative,10)]) {const td=document.createElement('td'); td.textContent=value; tr.append(td);}
      $('scalar-table').append(tr);
    }
    proofLinks($('scalar-source'), [['Exact ground-following scalar-cost susceptibility','model/defect_scalar_response/PROOF.md']]);
    $('yukawa-finding').textContent=data.yukawa.finding;
    $('yukawa-scope').textContent=data.yukawa.scope;
    for (const row of data.yukawa.rows) {
      const card=document.createElement('article'); card.className='panel';
      const title=document.createElement('h3'), result=document.createElement('p'), links=document.createElement('p');
      title.textContent=row.title; result.textContent=row.result; links.className='source';
      proofLinks(links,[['Source proof',row.proof]]); card.append(title,result,links); $('yukawa-cards').append(card);
    }
    $('quark-finding').textContent = data.calibrated_quarks.finding;
    $('quark-scope').textContent = data.calibrated_quarks.scope;
    $('quark-convention').textContent = `${data.calibrated_quarks.scheme} · μ = ${data.calibrated_quarks.scale_GeV} GeV`;
    for (const row of data.calibrated_quarks.rows) {
      const tr = document.createElement('tr');
      for (const value of [row.label, format(row.value_GeV, 8)]) {const td = document.createElement('td'); td.textContent = value; tr.append(td);}
      $('quark-table').append(tr);
    }
    proofLinks($('quark-source'), [['Calibrated action and input ancestry', 'model/particle_joint_reconstruction/CANDIDATE.md'], ['Exact conditional mass-action proof', 'model/conditional_standard_model/PROOF.md'], ['Calibrated parameter packet', 'model/common_source/calibrated_matter_parameters.json']]);
    $('repair-finding').textContent = data.repair.finding;
    proofLinks($('repair-source'), [['Record reconstruction and relaxation', 'model/repair_sector_bridge/PROOF.md'], ['Explicit assumption inventory', 'model/completion/assumption_closure.json']]);
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
