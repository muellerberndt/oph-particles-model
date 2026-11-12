// Source-bound additions to the existing Fable data model. No layout or simulation changes.
import { JOURNEY_RESULTS as D } from './journey_results_data.js';
import { OPENWAVE } from './openwave_data.js';
const C=D.current_tasks,N=D.latest_tasks;
const proof=(key)=>['Proof and complete records',D.source_repository+D.source_paths[key].replace(/results\.json$/, 'PROOF.md')];
const status=(id)=>OPENWAVE.rows.find(r=>r.id===id)?.status;
const kind=(id)=>status(id)==='met'?'seen':'part';
const pct=(v)=>(100*v).toFixed(3);
const fitMass=(name)=>Number(C.calibrated_hadrons.fits.find(r=>r.comparison===name).computed_GeV).toFixed(11);
const bindingMeV=()=> (1000*C.nuclear_exchange.binding_lower_GeV).toFixed(4);
const observedBindingMeV=()=> (1000*C.nuclear_exchange.deuteron_reference_binding_GeV).toFixed(4);
export const CONSTRUCTION_SUMMARIES={
 9:'A calibrated Dirac family tensor reproduces the named oscillation inputs in native current/flight records. Its three absolute masses use a declared lightest-mass choice; right-handed coordinates share those masses.',
 13:'The calibrated strong source retains colour-neutral spin-½ bound three-quark channels of charge 0 and +1.',
 14:'The neutron-assigned channel is heavier; proton and neutron masses are fitted in the same strong construction.',
 15:`Proton ${fitMass('proton')} GeV and neutron ${fitMass('neutron')} GeV are calibration targets, together with the charged pion. A fourth calibration input gives native gA=1.2753 through a changed baryon state; other hadron tests retain their separate failures.`,
 16:`A separate fifth-input source fits the deuteron binding ${N.nuclear_distance.deuteron_target_binding_MeV.toFixed(8)} MeV but also binds an unassigned spin-zero/isospin-zero partner. The four-input source is unbound in this channel.`,
 17:'Finite graph controls reveal distance-dependent attraction and retained unassigned channels. Changing the graph also changes the fitted baryon state; the observed heavier-nuclear spectrum is not reproduced.',
 18:`The charged-pion mass is calibrated to ${fitMass('charged_pion')} GeV. Neutral-pion and vector-meson tests fail; finite weak conversion changes strongly with volume.`,
 24:'The native lepton transition now has a useful error bound at a coupling 2⁴² times stronger. Physical lifetimes remain open.',
 25:'The unchanged native current gives calibrated gA=1.2753 in a split-site baryon state. Contact-dressed energy lines and a certified parity-odd beta momentum record are calculated; a physical neutron lifetime is not fitted.',
 27:'Joint native clocks and wave arrivals share one quantum geometry. Finite-strength responses differ, while an exact weak-probe theorem gives a common operational clock limit; physical G and seconds are uncalibrated.'
};
export function applyConstructionEvidence(groups){
 const updates={
  baryon:{ow:13,tip:'Three quarks bind in the calibrated strong source into colour-neutral spin-½ channels of charge zero and one.',open:'Three masses and the axial magnitude calibrate the stated four-input action; other hadron assignments retain their failures.',src:[proof('axial_state')]},
  order:{ow:14,tip:'The same calibrated strong action gives the heavier neutron-assigned channel and the proton–neutron mass gap.',open:'The ordering and mass gap are fitted inputs here; a physical weak pole and decay lifetime are not established.',src:[proof('calibrated_hadrons'),proof('baryon_beta')]},
  meson:{ow:18,tip:`The charged-pion assignment is calibrated to ${fitMass('charged_pion')} GeV. A separate full-ring weak-current calculation retains all conversion outputs.`,open:'Neutral-pion, vector and Delta held-out assignments fail; a physical meson lifetime is not reproduced.',src:[proof('calibrated_hadrons'),proof('meson_ring')]},
  deuteron:{ow:16,value:'binding fit, extra partner',tip:`A separate fifth-input source fits ${N.nuclear_distance.deuteron_target_binding_MeV.toFixed(8)} MeV binding and retains an unassigned partner near ${N.nuclear_distance.unassigned_partner_binding_MeV.toFixed(8)} MeV.`,open:'The four-input source is unbound in this channel. The added fit does not reproduce the complete observed nuclear spectrum or identify a physical deuteron.',src:[proof('nuclear_distance')]},
  neutrino:{ow:9,value:'3 oscillation-calibrated Dirac branches',tip:'A named six-parameter oscillation calibration gives masses 0.001, 0.00871206 and 0.05013980 eV for the declared lightest-mass choice. Native current and flight retain neutrinos, antineutrinos, both helicities and sterile coordinates.',open:'Mixing and mass splittings are fitted inputs; absolute lightest mass, physical beam, matter response and lifetimes need their own comparison.',src:[proof('neutrino_calibration')]},
  muondecay:{ow:24,tip:'The unchanged native current has a certified receiver peak near 16/25 at G=2⁻³⁰, 2⁴² stronger than the previous estimate allowed.',open:'The coupling is specified; the physical muon lifetime remains open.',src:[proof('reachable_averaging')]},
  slow:{ow:27,value:'native clock phase responds',tip:'The full quantum source measures a positive arrival-clock phase response. Its complete clock and wave records share the same master source.',open:'Physical seconds and Einstein proper time are not calibrated; finite-strength clock shifts are not exactly universal.',src:[proof('joint_native_clocks'),proof('relational_clock')]},
  bend:{ow:27,tip:'The same quantum geometry and wave source bends a packet and delays its arrival. A native clock measures a positive arrival delay in cycles.',open:'No observed lensing angle or physical G is fitted.',src:[proof('geometry_refinement'),proof('relational_clock')]}
 };
 for(const g of groups)for(const r of g.rows){const u=updates[r?.id];if(u)Object.assign(r,u,{kind:kind(u.ow)});}
 const numberGroup=groups.find(g=>g.id==='numbers');
 const names={proton:'Proton mass, calibrated',neutron:'Neutron mass, calibrated',charged_pion:'Charged-pion mass, calibrated'};
 for(const r of C.calibrated_hadrons.fits)numberGroup.rows.push({id:'calibrated_'+r.comparison,ow:r.comparison==='charged_pion'?18:15,kind:'number',name:names[r.comparison],value:Number(r.computed_GeV).toFixed(11),unit:'GeV',nature:r.target_GeV,natureWord:'fit target',dev:'calibrated',page:'constructions',tip:'Three masses fix three coefficients of one stated strong action. Reproducing these inputs is a calibration, not an independent prediction. Held-out neutral-pion, vector and Delta assignments fail.',src:[proof('calibrated_hadrons')]});
 numberGroup.rows.push({id:'axial_calibrated',ow:25,kind:'number',name:'Native axial strength, calibrated',value:'1.2753',unit:'',nature:1.2753,natureWord:'fit target',dev:'calibrated',page:'constructions',tip:'A fourth empirical input selects the split-site baryon state; the native weak current itself is unchanged.',src:[proof('axial_state')]});
 const composite=groups.find(g=>g.rows.some(r=>r?.id==='baryon'));
 composite.rows.push({id:'beta',ow:25,kind:kind(25),name:'Native neutron-channel conversion',value:pct(C.beta.conditional_one_electron_probability)+'% conditional',text:true,page:'constructions',tip:`Original-input probability ${pct(C.beta.unconditional_one_electron_probability)}% at source parameter ${C.beta.source_parameter}. The strong/free endpoint is ${(1000*C.beta.endpoint_GeV).toFixed(11)} MeV; filled-neutral weak-contact shifts are retained.`,open:'This mass-only-source conversion is a separate control. The four-input source fits gA and has a certified parity-odd momentum record, without a physical lifetime fit.',src:[proof('baryon_beta'),proof('axial_state'),proof('beta_parity')]});
}
export function updateConstructionOpenItems(open){
 const updates={
  nucleon_mass:{title:'Independent hadron mass predictions',sub:'three strong masses now calibrate the source; neutral-pion, vector and Delta held-out assignments still fail'},
  beta:{title:'A physical neutron lifetime',sub:'the native axial strength is calibrated by changing the baryon state; outgoing parity and full energy lines are calculated, without a lifetime fit'},
  nuclei:{title:'The observed nuclear spectrum',sub:'a separate binding fit retains an extra unassigned bound partner; graph changes alter the baryon state and masses'}
 };
 for(const r of open)if(updates[r.id])Object.assign(r,updates[r.id]);
}
