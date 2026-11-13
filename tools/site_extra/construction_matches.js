// Source-bound data hooks preserve the existing Fable renderer and navigation.
import { JOURNEY_RESULTS as D } from './journey_results_data.js';
import { OPENWAVE } from './openwave_data.js';
const T=D.particle_results,F=D.frontier_results;
const proof=key=>['Proof and complete records',D.source_repository+D.source_paths[key].replace(/results\.json$/, 'PROOF.md')];
const status=id=>OPENWAVE.rows.find(r=>r.id===id)?.status;
const kind=id=>status(id)==='met'?'seen':status(id)==='fails'?'fails':'part';
const computed=r=>r.computed_GeV??((r.interval_GeV[0]+r.interval_GeV[1])/2);
const mass=name=>computed(F.strong.mass_fits.find(r=>r.name===name)).toFixed(11);
const mid=xs=>(xs[0]+xs[1])/2;
export const CONSTRUCTION_SUMMARIES={
 9:'Three calibrated Dirac mass branches occur in the native current and complete neutral records. Right-handed components share these masses; the lightest mass is declared.',
 10:'The calibrated family tensor reproduces its vacuum law and native electron-medium response, with all flavour, sterile and failure outputs retained.',
 11:`Exactly three colourless charged minima have rest energies ${T.leptons.rows.map(r=>r.mass_GeV.toPrecision(12)).join(', ')} GeV. The electron anchors the unit; the analyzer phase has retrospective ancestry.`,
 13:'The seven-input positive native strong source has bound colour-singlet three-quark channels with complete sector and fragment bounds.',
 14:'The neutron-assigned channel is heavier and has positive inner and negative outer signed charge records. The radius-zero contribution is zero. The unused charge-radius magnitudes fail a common-length comparison.',
 15:`Proton ${mass('proton')} GeV and neutron ${mass('neutron')} GeV are fitted strong-sector energies; full interacting poles require their stated spectral tests.`,
 16:`Seven-input positive strong action: deuteron binding ${F.strong.binding_target_MeV.toFixed(8)} MeV is calibrated. The complete tested nuclear census has no additional bound channel; this does not identify all physical nuclei.`,
 17:'Complete finite nuclear channels and source-matched rest-energy instruments retain all extra levels and failures. A physical heavier-nuclear spectrum is not identified.',
 18:`Charged pion ${mass('charged_pion')} GeV and neutral vector ${mass('neutral_vector')} GeV are calibrated. The held-out neutral pion fails; resonance widths, kaons and physical strange decay remain open.`,
 21:'The shared longitudinal matter source has moving complete records with an explicit quadratic continuum error. Its square-root kinetic is nonlocal and retains a finite preferred frame.',
 22:`A sharp full-Fock bound permits the same strong source to attach length ${F.length.fm.toFixed(9)} fm/cell and tension ${F.length.tension_GeV_per_fm.toFixed(0)} GeV/fm. Both the quadrupole and tension select this attachment. Pure-SU(2) finite-volume gaps do not establish continuum Yang–Mills.`,
 24:`The native tau leptonic ratio is ${T.widths.ratio.native_ratio.toFixed(8)}, versus ${T.widths.ratio.PDG2025_comparison}±${T.widths.ratio.PDG2025_uncertainty}. Massive muon survival has a controlled finite-time bound; G_F is a supplied normalization with lifetime ancestry.`,
 25:`A complete native spin contraction gives A=${Number(T.beta.coefficients.A).toFixed(8)} and actual 3D cubes certify parity-odd beta records. Axial strength is calibrated; a physical neutron lifetime is not claimed.`,
 27:'Joint native clocks and wave arrivals share quantum geometry. A weak-probe theorem gives a common operational clock limit; physical G and seconds are uncalibrated.'
};
export function applyConstructionEvidence(groups){
 const updates={
  gen:{ow:11,value:'3',tip:'The complete native Higgs-Wilson source has exactly three colourless charged minima, with the stated electron, muon and tau assignments.',open:'The electron fixes the energy unit and the analyzer phase has retrospective ancestry. Neutral regulator valleys remain in this source.',src:[proof('single_valley_leptons')]},
  boost:{ow:21,value:'controlled complete records',tip:'The longitudinal matter source has moving complete detector records with a proved continuum error and an actual OpenWave Taichi execution.',open:'The square-root kinetic is nonlocal and the finite regulator has a preferred frame. Full interacting Lorentz covariance is not proved.',src:[proof('boosted_records')]},
  confine:{ow:22,name:'Native colour-string energy',value:F.length.tension_GeV_per_fm.toFixed(0)+' GeV/fm, calibrated',tip:`The complete ${F.strong_steps.pinned_dimension}-state pinned quark/diquark potential has this total-source slope at common length ${F.length.fm.toFixed(9)} fm/cell.`,open:'External position constraints are declared. The quadrupole and illustrative 1 GeV/fm benchmark jointly calibrate the length and gauge coefficient; the constrained potential is not the freely evolving ground energy, continuum confinement or a Clay solution.',src:[proof('strong_step_scaling'),proof('string_positive_cone'),proof('common_hyperfine_spectrum')]},
  baryon:{ow:13,tip:'Bound colour-neutral three-quark channels of charge 0 and +1 belong to the complete positive strong source.',open:'Seven disclosed inputs calibrate the stated hadron, axial-current and nuclear construction; these fitted energies are not independent predictions.',src:[proof('common_hyperfine_spectrum')]},
  order:{ow:14,tip:'The same native source has a heavier neutron-assigned channel and positive inner/negative outer signed charge records.',open:`Profile source: ${F.profiles.source}. The mass difference is calibrated; unused proton/neutron charge radii cannot both be fitted by one length.`,src:[proof('baryon_form_factors')]},
  meson:{ow:18,tip:`Charged pion ${mass('charged_pion')} GeV and neutral-vector ${mass('neutral_vector')} GeV are calibrated on the same action.`,open:'The held-out neutral-pion mass fails. Finite eigenenergies do not determine vector resonance poles or widths; kaons and physical strange decays remain unassigned.',src:[proof('common_hyperfine_spectrum')]},
  deuteron:{ow:16,value:F.strong.binding_target_MeV.toFixed(8)+'MeV binding, fitted',tip:`Rest energy≈${mid(F.strong.deuteron_GeV_interval).toFixed(11)} GeV. Complete retained nuclear channels exclude the tested spin-zero and spin-three partners.`,open:'The deuteron binding is fitted. The spin-gradient architecture has retrospective unwanted-channel ancestry, and the quadrupole and tension calibrate the length. The observed heavier-nuclear spectrum remains open.',src:[proof('common_hyperfine_spectrum')]},
  neutrino:{ow:9,value:'3 calibrated Dirac mass branches',tip:T.neutrinos.rows.map((r,i)=>`m${i+1}=${r.mass_GeV.toPrecision(8)} GeV`).join('; '),open:'Oscillation inputs and the declared lightest mass set these conditional values. Right-handed components do not add a heavy sterile species.',src:[proof('neutrino_calibration'),proof('neutrino_matter')]},
  muondecay:{ow:24,value:'native inclusive weak decay',tip:`Tree width ${T.widths.rows[0].width_GeV.toPrecision(7)} GeV; characteristic time ${(T.widths.rows[0].characteristic_seconds*1e6).toFixed(6)} μs with supplied G_F. Massive survival has a controlled four-lifetime window.`,open:'G_F has muon-lifetime ancestry. Electromagnetic radiative terms are absent, so the precision observed lifetime is not independently reproduced.',src:[proof('lepton_widths')]},
  slow:{ow:27,value:'joint native clock phase responds',tip:'Complete native clocks and scalar-wave arrivals share one quantum geometry source.',open:'Physical seconds and G are not calibrated; finite-strength clock ratios differ, with a controlled common weak-probe limit.',src:[proof('common_gravity_records')]},
  bend:{ow:27,value:F.gravity.records.transverse_position_difference_at_parameter4.toFixed(8)+' graph units',tip:'The same finite source shifts the transverse wave record and delays conditional arrival; all clock, geometry and field outputs remain.',open:'The massless scalar comparator is not the reconstructed photon. No observed lensing angle, physical G or Einstein continuum is derived.',src:[proof('universal_energy_geometry'),proof('common_gravity_records')]}
 };
 for(const g of groups)for(const r of g.rows){const u=updates[r?.id];if(u)Object.assign(r,u,{kind:kind(u.ow)});}
 const numbers=groups.find(g=>g.id==='numbers');
 const names={proton:'Proton strong energy, calibrated',neutron:'Neutron strong energy, calibrated',charged_pion:'Charged-pion energy, calibrated',neutral_vector:'ρ⁰-assigned energy, calibrated',Delta_plus:'Δ⁺-assigned energy, calibrated'};
 for(const r of F.strong.mass_fits)numbers.rows.push({id:'calibrated_'+r.name,ow:r.name==='charged_pion'?18:15,kind:'number',name:names[r.name],value:computed(r).toFixed(11),unit:'GeV',nature:r.target_GeV,natureWord:'fit target',dev:'calibrated',page:'constructions',tip:'One positive native strong action uses seven disclosed mass/current/binding inputs. These fitted energies are not full interacting pole predictions.',src:[proof('common_hyperfine_spectrum')]});
 numbers.rows.push({id:'axial_calibrated',ow:25,kind:'number',name:'Native axial magnitude, calibrated',value:mid(F.strong.gA_interval).toFixed(4),unit:'',nature:1.2753,natureWord:'fit target',dev:'calibrated',page:'constructions',tip:'The native current is unchanged; the seven-input calibrated source changes its baryon state.',src:[proof('common_hyperfine_spectrum')]});
 numbers.rows.push({id:'tau_leptonic_ratio',ow:24,kind:'number',name:'Tau leptonic partial-width ratio',value:T.widths.ratio.native_ratio.toFixed(8),unit:'',nature:T.widths.ratio.PDG2025_comparison,natureWord:'held-out comparison',dev:Math.abs(T.widths.ratio.difference_in_reported_uncertainties_diagnostic).toFixed(2)+'σ',page:'constructions',tip:'The tau-to-muon/electron leptonic ratio cancels the supplied weak normalization; its comparison did not select a source parameter. Radiative corrections are absent.',src:[proof('lepton_widths')]});
 const composite=groups.find(g=>g.rows.some(r=>r?.id==='baryon'));
 composite.rows.push({id:'beta',ow:25,kind:kind(25),name:'Native parity-violating beta records',value:'A='+Number(T.beta.coefficients.A).toFixed(8),text:true,page:'constructions',tip:'The native point-contact spin coefficient and complete 3D momentum records use the calibrated baryon current; all preparation and Fock complements remain.',open:'The finite angular source is not identified with a physical continuum neutron beam or measured lifetime.',src:[proof('beta_angular')]});
}
export function updateConstructionOpenItems(open){
 const updates={
  nucleon_mass:{title:'Independent interacting hadron masses',sub:'fitted strong energies and complete rest-energy records coexist; physical contact-dressed poles and held-out meson assignments require their own comparison'},
  beta:{title:'A physical neutron lifetime',sub:'native 3D parity records and angular coefficients use calibrated axial strength; a measured lifetime and outgoing continuum identification are not supplied'},
  nuclei:{title:'The observed nuclear spectrum',sub:'the selected seven-input source fits deuteron binding and excludes the tested spin-zero/spin-three partners; other physical nuclei and a controlled spatial continuum remain open'}
 };
 for(const r of open)if(updates[r.id])Object.assign(r,updates[r.id]);
}
