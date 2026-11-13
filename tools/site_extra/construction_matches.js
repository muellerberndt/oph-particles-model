// Source-bound data hooks preserve the existing Fable renderer and navigation.
import { JOURNEY_RESULTS as D } from './journey_results_data.js';
import { OPENWAVE } from './openwave_data.js';
const T=D.particle_results;
const proof=key=>['Proof and complete records',D.source_repository+D.source_paths[key].replace(/results\.json$/, 'PROOF.md')];
const status=id=>OPENWAVE.rows.find(r=>r.id===id)?.status;
const kind=id=>status(id)==='met'?'seen':status(id)==='fails'?'fails':'part';
const mass=name=>T.strong.mass_fits.find(r=>r.name===name).target_GeV.toFixed(11);
const mid=xs=>(xs[0]+xs[1])/2;
export const CONSTRUCTION_SUMMARIES={
 9:'Three calibrated Dirac mass branches occur in the native current and complete neutral records. Right-handed components share these masses; the lightest mass is declared.',
 10:'The calibrated family tensor reproduces its vacuum law and native electron-medium response, with all flavour, sterile and failure outputs retained.',
 11:`Exactly three colourless charged minima have rest energies ${T.leptons.rows.map(r=>r.mass_GeV.toPrecision(12)).join(', ')} GeV. The electron anchors the unit; the analyzer phase has retrospective ancestry.`,
 13:'The positive spin-gradient source has colour-singlet native three-quark channels, with complete sector and fragment bounds.',
 14:'The neutron-assigned channel is heavier. The proton/neutron masses and their difference are calibrated inputs of the same strong construction.',
 15:`Proton ${mass('proton')} GeV and neutron ${mass('neutron')} GeV are fitted strong-sector energies; full interacting poles require their stated spectral tests.`,
 16:`Five-input positive strong action: deuteron binding ${T.strong.binding_target_MeV.toFixed(8)} MeV is calibrated. The tested spin-zero partner is above breakup; an unassigned spin-three bound channel is retained.`,
 17:'Complete finite nuclear channels and source-matched rest-energy instruments retain all extra levels and failures. A physical heavier-nuclear spectrum is not identified.',
 18:`The charged pion is fitted to ${mass('charged_pion')} GeV. This does not close the neutral-pion, vector-meson, kaon or strange-decay dictionary.`,
 21:'The shared longitudinal matter source has moving complete records with an explicit quadratic continuum error. Its square-root kinetic is nonlocal and retains a finite preferred frame.',
 22:`Native Gauss elimination gives an exact linear colour-string cost of ${T.colour_string.slope_GeV_per_cell.toFixed(9)} GeV per graph cell. The shared quadrupole/length test cannot reach the 1 GeV/fm tension benchmark within this positivity-preserving transfer family.`,
 24:`The native tau leptonic ratio is ${T.widths.ratio.native_ratio.toFixed(8)}, versus ${T.widths.ratio.PDG2025_comparison}±${T.widths.ratio.PDG2025_uncertainty}. Massive muon survival has a controlled finite-time bound; G_F is a supplied normalization with lifetime ancestry.`,
 25:`A complete native spin contraction gives A=${Number(T.beta.coefficients.A).toFixed(8)} and actual 3D cubes certify parity-odd beta records. Axial strength is calibrated; a physical neutron lifetime is not claimed.`,
 27:'Joint native clocks and wave arrivals share quantum geometry. A weak-probe theorem gives a common operational clock limit; physical G and seconds are uncalibrated.'
};
export function applyConstructionEvidence(groups){
 const updates={
  gen:{ow:11,value:'3',tip:'The complete native Higgs-Wilson source has exactly three colourless charged minima, with the stated electron, muon and tau assignments.',open:'The electron fixes the energy unit and the analyzer phase has retrospective ancestry. Neutral regulator valleys remain in this source.',src:[proof('single_valley_leptons')]},
  boost:{ow:21,value:'controlled complete records',tip:'The longitudinal matter source has moving complete detector records with a proved continuum error and an actual OpenWave Taichi execution.',open:'The square-root kinetic is nonlocal and the finite regulator has a preferred frame. Full interacting Lorentz covariance is not proved.',src:[proof('boosted_records')]},
  confine:{ow:22,name:'Native colour-string energy',value:T.colour_string.slope_GeV_per_cell.toFixed(9)+' GeV/cell',tip:'Exact Gauss elimination gives a linear separation cost in the declared one-dimensional colour-chain source, with complete native spectra and position records.',open:'The shared quadrupole/length test cannot reach the supplied 1 GeV/fm tension benchmark in this positivity-preserving transfer family; this is not a continuum QCD identification.',src:[proof('colour_string')]},
  baryon:{ow:13,tip:'Colour-neutral three-quark channels of charge 0 and +1 belong to the complete positive strong source.',open:'Five inputs calibrate the stated hadron/nuclear construction; these fits are not independent mass predictions.',src:[proof('spin_gradient_nuclei')]},
  order:{ow:14,tip:'The native neutron-assigned energy exceeds the proton-assigned energy on the same strong action.',open:'The mass difference is a calibration input; strong energies are distinct from full weak-contact poles.',src:[proof('spin_gradient_nuclei'),proof('rest_spectroscopy')]},
  meson:{ow:18,tip:`The charged-pion assignment is calibrated to ${mass('charged_pion')} GeV. Complete meson charge spectra retain every channel.`,open:'The neutral-pion/vector/kaon spectrum and physical strange decay are not identified.',src:[proof('spin_gradient_nuclei')]},
  deuteron:{ow:16,value:T.strong.binding_target_MeV.toFixed(8)+'MeV binding, fitted',tip:`Rest energy≈${mid(T.strong.deuteron_energy_GeV_interval).toFixed(11)} GeV. The tested spin-zero/isospin-zero partner lies ${mid(T.strong.partner_above_threshold_MeV_interval).toFixed(5)} MeV above breakup.`,open:'The deuteron binding is fitted, and λ=5/2 was selected retrospectively using unwanted-channel tests. The quadrupole is positive in graph units without a femtometre assignment; an unassigned spin-three bound channel is retained.',src:[proof('spin_gradient_nuclei')]},
  neutrino:{ow:9,value:'3 calibrated Dirac mass branches',tip:T.neutrinos.rows.map((r,i)=>`m${i+1}=${r.mass_GeV.toPrecision(8)} GeV`).join('; '),open:'Oscillation inputs and the declared lightest mass set these conditional values. Right-handed components do not add a heavy sterile species.',src:[proof('neutrino_calibration'),proof('neutrino_matter')]},
  muondecay:{ow:24,value:'native inclusive weak decay',tip:`Tree width ${T.widths.rows[0].width_GeV.toPrecision(7)} GeV; characteristic time ${(T.widths.rows[0].characteristic_seconds*1e6).toFixed(6)} μs with supplied G_F. Massive survival has a controlled four-lifetime window.`,open:'G_F has muon-lifetime ancestry. Electromagnetic radiative terms are absent, so the precision observed lifetime is not independently reproduced.',src:[proof('lepton_widths')]},
  slow:{ow:27,value:'native clock phase responds',tip:'Complete clock and wave-arrival records share one quantum source.',open:'Physical seconds and G are not calibrated; finite-strength clock shifts are not exactly universal.',src:[proof('joint_native_clocks'),proof('relational_clock')]},
  bend:{ow:27,tip:'Quantum geometry bends a finite packet and delays its arrival, with native clock records.',open:'No observed lensing angle or physical G is fitted.',src:[proof('geometry_refinement'),proof('relational_clock')]}
 };
 for(const g of groups)for(const r of g.rows){const u=updates[r?.id];if(u)Object.assign(r,u,{kind:kind(u.ow)});}
 const numbers=groups.find(g=>g.id==='numbers');
 const names={proton:'Proton strong energy, calibrated',neutron:'Neutron strong energy, calibrated',charged_pion:'Charged-pion energy, calibrated'};
 for(const r of T.strong.mass_fits)numbers.rows.push({id:'calibrated_'+r.name,ow:r.name==='charged_pion'?18:15,kind:'number',name:names[r.name],value:r.target_GeV.toFixed(11),unit:'GeV',nature:r.target_GeV,natureWord:'fit target',dev:'calibrated',page:'constructions',tip:'One positive native strong action uses five disclosed mass/current/binding inputs. These fitted energies are not full interacting pole predictions.',src:[proof('spin_gradient_nuclei')]});
 numbers.rows.push({id:'axial_calibrated',ow:25,kind:'number',name:'Native axial magnitude, calibrated',value:mid(T.strong.gA_interval).toFixed(4),unit:'',nature:1.2753,natureWord:'fit target',dev:'calibrated',page:'constructions',tip:'The native current is unchanged; the calibrated source changes its baryon state.',src:[proof('spin_gradient_nuclei')]});
 numbers.rows.push({id:'tau_leptonic_ratio',ow:24,kind:'number',name:'Tau leptonic partial-width ratio',value:T.widths.ratio.native_ratio.toFixed(8),unit:'',nature:T.widths.ratio.PDG2025_comparison,natureWord:'held-out comparison',dev:Math.abs(T.widths.ratio.difference_in_reported_uncertainties_diagnostic).toFixed(2)+'σ',page:'constructions',tip:'The tau-to-muon/electron leptonic ratio cancels the supplied weak normalization; its comparison did not select a source parameter. Radiative corrections are absent.',src:[proof('lepton_widths')]});
 const composite=groups.find(g=>g.rows.some(r=>r?.id==='baryon'));
 composite.rows.push({id:'beta',ow:25,kind:kind(25),name:'Native parity-violating beta records',value:'A='+Number(T.beta.coefficients.A).toFixed(8),text:true,page:'constructions',tip:'The native point-contact spin coefficient and complete 3D momentum records use the calibrated baryon current; all preparation and Fock complements remain.',open:'The finite angular source is not identified with a physical continuum neutron beam or measured lifetime.',src:[proof('beta_angular')]});
}
export function updateConstructionOpenItems(open){
 const updates={
  nucleon_mass:{title:'Independent interacting hadron masses',sub:'fitted strong energies and complete rest-energy records coexist; physical contact-dressed poles and held-out meson assignments require their own comparison'},
  beta:{title:'A physical neutron lifetime',sub:'native 3D parity records and angular coefficients use calibrated axial strength; a measured lifetime and outgoing continuum identification are not supplied'},
  nuclei:{title:'The observed nuclear spectrum',sub:'the selected source fits deuteron binding and excludes the tested spin-zero partner; an unassigned spin-three channel and physical length calibration require resolution'}
 };
 for(const r of open)if(updates[r.id])Object.assign(r,updates[r.id]);
}
