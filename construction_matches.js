// Source-bound additions to the existing Fable data model. No layout or simulation changes.
import { JOURNEY_RESULTS as D } from './journey_results_data.js';
import { OPENWAVE } from './openwave_data.js';
const C=D.current_tasks;
const proof=(key)=>['Proof and complete records',D.source_repository+D.source_paths[key].replace(/results\.json$/, 'PROOF.md')];
const status=(id)=>OPENWAVE.rows.find(r=>r.id===id)?.status;
const kind=(id)=>status(id)==='met'?'seen':'part';
const pct=(v)=>(100*v).toFixed(3);
const fitMass=(name)=>Number(C.calibrated_hadrons.fits.find(r=>r.comparison===name).computed_GeV).toFixed(11);
const bindingMeV=()=> (1000*C.nuclear_exchange.binding_lower_GeV).toFixed(4);
const observedBindingMeV=()=> (1000*C.nuclear_exchange.deuteron_reference_binding_GeV).toFixed(4);
export const CONSTRUCTION_SUMMARIES={
 9:'Three Dirac neutral mass branches and all helicity channels exist at a stated scale; measured neutrino masses and mixing are not fitted.',
 13:'The calibrated strong source retains colour-neutral spin-½ bound three-quark channels of charge 0 and +1.',
 14:'The neutron-assigned channel is heavier; proton and neutron masses are fitted in the same strong construction.',
 15:`Proton ${fitMass('proton')} GeV and neutron ${fitMass('neutron')} GeV are calibration targets, together with the charged pion. Held-out hadron tests still fail.`,
 16:`A spin-one/isospin-zero six-quark state binds after the nucleon calibration. Its ≈${bindingMeV()} MeV binding misses the deuteron’s ${observedBindingMeV()} MeV; its graph quadrupole is positive.`,
 17:'Complete low six-quark spectra are controlled on five small graphs. An extra unassigned bound channel remains; heavier nuclei are not recovered.',
 18:`The charged-pion mass is calibrated to ${fitMass('charged_pion')} GeV. Neutral-pion and vector-meson tests fail; finite weak conversion changes strongly with volume.`,
 24:'The native lepton transition now has a useful error bound at a coupling 2⁴² times stronger. Physical lifetimes remain open.',
 25:`The new calibrated source executes ${pct(C.beta.conditional_one_electron_probability)}% conditional one-electron conversion. This is not a neutron lifetime fit; the axial current still misses.`,
 27:'One quantum geometry and wave source yields bending, complete arrival records and a positive delay measured in native clock cycles; physical scales remain open.'
};
export function applyConstructionEvidence(groups){
 const updates={
  baryon:{ow:13,tip:'Three quarks bind in the calibrated strong source into colour-neutral spin-½ channels of charge zero and one.',open:'Masses use three measured calibration targets; held-out hadron assignments fail.',src:[proof('calibrated_hadrons')]},
  order:{ow:14,tip:'The same calibrated strong action gives the heavier neutron-assigned channel and the proton–neutron mass gap.',open:'The ordering and mass gap are fitted inputs here; a physical weak pole and decay lifetime are not established.',src:[proof('calibrated_hadrons'),proof('baryon_beta')]},
  meson:{ow:18,tip:`The charged-pion assignment is calibrated to ${fitMass('charged_pion')} GeV. A separate full-ring weak-current calculation retains all conversion outputs.`,open:'Neutral-pion, vector and Delta held-out assignments fail; a physical meson lifetime is not reproduced.',src:[proof('calibrated_hadrons'),proof('meson_ring')]},
  deuteron:{ow:16,value:'bind, positive graph quadrupole',tip:`After nucleon calibration the spin-one/isospin-zero six-quark energy lies near ${C.nuclear_exchange.energy_GeV_interval[0].toFixed(9)} GeV. The two-cell source lifts its spin-zero/isospin-one partners above breakup.`,open:`Binding near ${bindingMeV()} MeV misses ${observedBindingMeV()} MeV; physical length and deuteron identity are not established.`,src:[proof('nuclear_exchange'),proof('nuclear_refinement')]},
  neutrino:{ow:9,value:'3 Dirac neutral branches',tip:'A declared 2⁻³² neutral scale gives three conditional mass branches; neutrino, antineutrino and both helicity channels remain in the source.',open:'Measured neutrino masses and PMNS mixing are not fitted.',src:[proof('dirac_neutral_current')]},
  muondecay:{ow:24,tip:'The unchanged native current has a certified receiver peak near 16/25 at G=2⁻³⁰, 2⁴² stronger than the previous estimate allowed.',open:'The coupling is specified; the physical muon lifetime remains open.',src:[proof('reachable_averaging')]},
  slow:{ow:27,value:'native clock phase responds',tip:'The full quantum source measures a positive arrival-clock phase response. Its complete clock and wave records share the same master source.',open:'Physical seconds and Einstein proper time are not calibrated; finite-strength clock shifts are not exactly universal.',src:[proof('relational_clock'),proof('geometry_refinement')]},
  bend:{ow:27,tip:'The same quantum geometry and wave source bends a packet and delays its arrival. A native clock measures a positive arrival delay in cycles.',open:'No observed lensing angle or physical G is fitted.',src:[proof('geometry_refinement'),proof('relational_clock')]}
 };
 for(const g of groups)for(const r of g.rows){const u=updates[r?.id];if(u)Object.assign(r,u,{kind:kind(u.ow)});}
 const numberGroup=groups.find(g=>g.id==='numbers');
 const names={proton:'Proton mass, calibrated',neutron:'Neutron mass, calibrated',charged_pion:'Charged-pion mass, calibrated'};
 for(const r of C.calibrated_hadrons.fits)numberGroup.rows.push({id:'calibrated_'+r.comparison,ow:r.comparison==='charged_pion'?18:15,kind:'number',name:names[r.comparison],value:Number(r.computed_GeV).toFixed(11),unit:'GeV',nature:r.target_GeV,natureWord:'fit target',dev:'calibrated',page:'constructions',tip:'Three masses fix three coefficients of one stated strong action. Reproducing these inputs is a calibration, not an independent prediction. Held-out neutral-pion, vector and Delta assignments fail.',src:[proof('calibrated_hadrons')]});
 const composite=groups.find(g=>g.rows.some(r=>r?.id==='baryon'));
 composite.rows.push({id:'beta',ow:25,kind:kind(25),name:'Native neutron-channel conversion',value:pct(C.beta.conditional_one_electron_probability)+'% conditional',text:true,page:'constructions',tip:`Original-input probability ${pct(C.beta.unconditional_one_electron_probability)}% at source parameter ${C.beta.source_parameter}. The strong/free endpoint is ${(1000*C.beta.endpoint_GeV).toFixed(11)} MeV; filled-neutral weak-contact shifts are retained.`,open:'A finite conversion, not an observed neutron lifetime. The axial-current comparison fails.',src:[proof('baryon_beta'),proof('baryon_weak_formfactors')]});
}
export function updateConstructionOpenItems(open){
 const updates={
  nucleon_mass:{title:'Independent hadron mass predictions',sub:'three strong masses now calibrate the source; neutral-pion, vector and Delta held-out assignments still fail'},
  beta:{title:'Neutron lifetime and axial current',sub:'finite beta conversion is now allowed and executed; the lifetime is open and the axial-current strength misses'},
  nuclei:{title:'The observed nuclear spectrum',sub:'six-quark binding survives five graphs, but its binding energy misses and an extra unassigned bound channel remains'}
 };
 for(const r of open)if(updates[r.id])Object.assign(r,updates[r.id]);
}
