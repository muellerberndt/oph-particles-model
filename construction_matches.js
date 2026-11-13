// Source-bound data hooks preserve the existing Fable renderer and navigation.
import { JOURNEY_RESULTS as D } from './journey_results_data.js';
import { OPENWAVE } from './openwave_data.js';
const T=D.particle_results,F=D.frontier_results,C=D.current_results;
const proof=key=>['Proof and complete records',D.source_repository+D.source_paths[key].replace(/results\.json$/, 'PROOF.md')];
const status=id=>OPENWAVE.rows.find(r=>r.id===id)?.status;
const kind=id=>status(id)==='met'?'seen':status(id)==='fails'?'fails':'part';
const computed=r=>r.computed_GeV??((r.interval_GeV[0]+r.interval_GeV[1])/2);
const mass=name=>computed(F.strong.mass_fits.find(r=>r.name===name)).toFixed(11);
const mid=xs=>(xs[0]+xs[1])/2;
export const CONSTRUCTION_SUMMARIES={
 3:'An autonomous collision pump creates occupation and preserves native mass-frequency coherence bands, with complete batteries. The probe creates the observed phase; zero-pump controls therefore leave autonomous phase onset unestablished.',
 12:'Native fractional charge is an exact discrete dual-electric phase on a dynamical quotient-group Gauss string. A continuous conjugate-link texture winding is not proved.',
 23:`The dressed Pauli/Maxwell source has certified current response and a measured electron x-radius near ${mid(C.core.rows[0].radius_cells_interval).toFixed(6)} cell. Its spatial core onset is unresolved on this grid.`,
 28:`All15 BC03 chronometer rows give chi-square in [${C.cosmology.comparisons[0].chi_square.join(', ')}] with full correlated covariance and supplied Planck anchors. This does not derive the Lambda amplitude.`,
 9:'Three calibrated Dirac mass branches occur in the native current and complete neutral records. Right-handed components share these masses; the lightest mass is declared.',
 10:'The calibrated family tensor reproduces its vacuum law and native electron-medium response, with all flavour, sterile and failure outputs retained.',
 11:`Exactly three colourless charged minima have rest energies ${T.leptons.rows.map(r=>r.mass_GeV.toPrecision(12)).join(', ')} GeV. The electron anchors the unit; the analyzer phase has retrospective ancestry.`,
 13:'The seven-input positive native strong source has bound colour-singlet three-quark channels with complete sector and fragment bounds.',
 14:'The neutron-assigned channel is heavier and has positive inner and negative outer signed charge records. The radius-zero contribution is zero. The unused charge-radius magnitudes fail a common-length comparison.',
 15:`Proton ${mass('proton')} GeV and neutron ${mass('neutron')} GeV are fitted strong-sector energies; full interacting poles require their stated spectral tests.`,
 16:`Seven-input positive strong action: deuteron binding ${F.strong.binding_target_MeV.toFixed(8)} MeV is calibrated. The complete tested nuclear census has no additional bound channel; this does not identify all physical nuclei.`,
 17:'Complete three- and four-cell nuclear spectra include a triton calibration and failed held-out helion/alpha comparisons. No complete binding curve, asymptotic breakup threshold or halo lifetime is claimed.',
 18:`Charged pion ${mass('charged_pion')} GeV and neutral vector ${mass('neutral_vector')} GeV are calibrated. Two additional inputs fit K+ and Lambda; held-out strange masses and the tested on-shell Lambda decay fail.`,
 21:'The shared longitudinal matter source has moving complete records with an explicit quadratic continuum error. Its square-root kinetic is nonlocal and retains a finite preferred frame.',
 22:`A sharp full-Fock bound permits the same strong source to attach length ${F.length.fm.toFixed(9)} fm/cell and tension ${F.length.tension_GeV_per_fm.toFixed(0)} GeV/fm. Both the quadrupole and tension select this attachment. Pure-SU(2) finite-volume gaps do not establish continuum Yang–Mills.`,
 24:`The native tau leptonic ratio is ${T.widths.ratio.native_ratio.toFixed(8)}, versus ${T.widths.ratio.PDG2025_comparison}±${T.widths.ratio.PDG2025_uncertainty}. Massive muon survival has a controlled finite-time bound; G_F is a supplied normalization with lifetime ancestry.`,
 25:`A complete native spin contraction gives A=${Number(T.beta.coefficients.A).toFixed(8)} and actual 3D cubes certify parity-odd beta records. Axial strength is calibrated; a physical neutron lifetime is not claimed.`,
 26:`Dimensionless attraction is proved; the tested electron-energy/strong-length attachment fails, giving G=${C.gravity.unit_test.conditional_G_natural_GeV_minus2.toFixed(4)} GeV^-2. No physical strength credit is claimed.`,
 27:'Complete transverse Maxwell photons and native clocks share one quantum geometry. Bending, positive delay and joint redshift signs are certified; the tested physical G/c unit attachment fails.'
};
export function applyConstructionEvidence(groups){
 const updates={
  gen:{ow:11,value:'3',tip:'The complete native Higgs-Wilson source has exactly three colourless charged minima, with the stated electron, muon and tau assignments.',open:'The electron fixes the energy unit and the analyzer phase has retrospective ancestry. Neutral regulator valleys remain in this source.',src:[proof('single_valley_leptons')]},
  boost:{ow:21,value:'controlled complete records',tip:'The longitudinal matter source has moving complete detector records with a proved continuum error and an actual OpenWave Taichi execution.',open:'The square-root kinetic is nonlocal and the finite regulator has a preferred frame. Full interacting Lorentz covariance is not proved.',src:[proof('boosted_records')]},
  confine:{ow:22,name:'Native colour-string energy',value:F.length.tension_GeV_per_fm.toFixed(0)+' GeV/fm, calibrated',tip:`The complete ${F.strong_steps.pinned_dimension}-state pinned quark/diquark potential has this total-source slope at common length ${F.length.fm.toFixed(9)} fm/cell.`,open:'External position constraints are declared. The quadrupole and illustrative 1 GeV/fm benchmark jointly calibrate the length and gauge coefficient; the constrained potential is not the freely evolving ground energy, continuum confinement or a Clay solution.',src:[proof('strong_step_scaling'),proof('string_positive_cone'),proof('common_hyperfine_spectrum')]},
  baryon:{ow:13,tip:'Bound colour-neutral three-quark channels of charge 0 and +1 belong to the complete positive strong source.',open:'Seven disclosed inputs calibrate the stated hadron, axial-current and nuclear construction; these fitted energies are not independent predictions.',src:[proof('common_hyperfine_spectrum')]},
  order:{ow:14,tip:'The same native source has a heavier neutron-assigned channel and positive inner/negative outer signed charge records.',open:`Profile source: ${F.profiles.source}. The mass difference is calibrated; unused proton/neutron charge radii cannot both be fitted by one length.`,src:[proof('baryon_form_factors')]},
  meson:{ow:18,tip:'Two additional native strong coefficients fit K+ and Lambda; exact strong charge conjugation retains K-.',open:'Held-out K0, Sigma, Xi and Omega masses fail. The two-cell Lambda to proton/pion channel is kinematically closed despite a nonzero native vertex; no physical strange width is supplied.',src:[proof('strange_composites'),proof('common_hyperfine_spectrum')]},
  deuteron:{ow:16,value:F.strong.binding_target_MeV.toFixed(8)+'MeV binding, fitted',tip:`Rest energy≈${mid(F.strong.deuteron_GeV_interval).toFixed(11)} GeV. Complete retained nuclear channels exclude the tested spin-zero and spin-three partners.`,open:'The deuteron binding is fitted. The spin-gradient architecture has retrospective unwanted-channel ancestry, and the quadrupole and tension calibrate the length. The observed heavier-nuclear spectrum remains open.',src:[proof('common_hyperfine_spectrum')]},
  neutrino:{ow:9,value:'3 calibrated Dirac mass branches',tip:T.neutrinos.rows.map((r,i)=>`m${i+1}=${r.mass_GeV.toPrecision(8)} GeV`).join('; '),open:'Oscillation inputs and the declared lightest mass set these conditional values. Right-handed components do not add a heavy sterile species.',src:[proof('neutrino_calibration'),proof('neutrino_matter')]},
  muondecay:{ow:24,value:'native inclusive weak decay',tip:`Tree width ${T.widths.rows[0].width_GeV.toPrecision(7)} GeV; characteristic time ${(T.widths.rows[0].characteristic_seconds*1e6).toFixed(6)} μs with supplied G_F. Massive survival has a controlled four-lifetime window.`,open:'G_F has muon-lifetime ancestry. Electromagnetic radiative terms are absent, so the precision observed lifetime is not independently reproduced.',src:[proof('lepton_widths')]},
  slow:{ow:27,value:'joint photon/clock redshift certified',tip:'Complete native clocks and transverse Maxwell photons share one autonomous geometry; both joint phase-ratio intervals lie below one.',open:'Finite-strength clocks are not exactly universal. The tested physical G and light-speed attachment fails; no physical seconds or Einstein continuum is inferred.',src:[proof('transverse_gravity')]},
  bend:{ow:27,value:C.gravity.records.separate_Fourier_direction_deflection.toFixed(8)+' rad',tip:'Actual transverse Maxwell records bend inward and arrive later on the same native-clock/geometry carrier, with complete errors and detector failures.',open:'This finite Fourier-direction difference is not an observed lensing angle. The positive-frequency constitutive source has no proved canonical metric-QED equivalence; the physical G/c attachment fails.',src:[proof('transverse_gravity')]}
 };
 for(const g of groups)for(const r of g.rows){const u=updates[r?.id];if(u)Object.assign(r,u,{kind:kind(u.ow)});}
 const numbers=groups.find(g=>g.id==='numbers');
 const names={proton:'Proton strong energy, calibrated',neutron:'Neutron strong energy, calibrated',charged_pion:'Charged-pion energy, calibrated',neutral_vector:'ρ⁰-assigned energy, calibrated',Delta_plus:'Δ⁺-assigned energy, calibrated'};
 for(const r of F.strong.mass_fits)numbers.rows.push({id:'calibrated_'+r.name,ow:r.name==='charged_pion'?18:15,kind:'number',name:names[r.name],value:computed(r).toFixed(11),unit:'GeV',nature:r.target_GeV,natureWord:'fit target',dev:'calibrated',page:'constructions',tip:'One positive native strong action uses seven disclosed mass/current/binding inputs. These fitted energies are not full interacting pole predictions.',src:[proof('common_hyperfine_spectrum')]});
 numbers.rows.push({id:'axial_calibrated',ow:25,kind:'number',name:'Native axial magnitude, calibrated',value:mid(F.strong.gA_interval).toFixed(4),unit:'',nature:1.2753,natureWord:'fit target',dev:'calibrated',page:'constructions',tip:'The native current is unchanged; the seven-input calibrated source changes its baryon state.',src:[proof('common_hyperfine_spectrum')]});
 numbers.rows.push({id:'tau_leptonic_ratio',ow:24,kind:'number',name:'Tau leptonic partial-width ratio',value:T.widths.ratio.native_ratio.toFixed(8),unit:'',nature:T.widths.ratio.PDG2025_comparison,natureWord:'held-out comparison',dev:Math.abs(T.widths.ratio.difference_in_reported_uncertainties_diagnostic).toFixed(2)+'σ',page:'constructions',tip:'The tau-to-muon/electron leptonic ratio cancels the supplied weak normalization; its comparison did not select a source parameter. Radiative corrections are absent.',src:[proof('lepton_widths')]});
 for(const name of ['K+','Lambda']){const r=C.strange.masses.find(x=>x.name===name);numbers.rows.push({id:'strange_'+name,ow:18,kind:'number',name:name+' native energy, calibrated',value:r.computed_GeV.toFixed(9),unit:'GeV',nature:Number(r.comparison_GeV),natureWord:'fit target',dev:'calibrated',page:'constructions',tip:'Two additional strong coefficients fit kaon and Lambda energies; held-out strange masses and the tested on-shell decay fail.',src:[proof('strange_composites')]});}
 const triton=C.nuclear.masses.find(x=>x.name==='triton');numbers.rows.push({id:'triton_calibrated',ow:17,kind:'number',name:'Triton finite-box energy, calibrated',value:mid(triton.GeV_interval).toFixed(8),unit:'GeV',nature:triton.target_GeV,natureWord:'fit target',dev:'calibrated interval',page:'constructions',tip:'The complete source interval is ['+triton.GeV_interval.join(', ')+'] GeV. One three-body coefficient uses the triton target; helion and alpha held-outs fail.',src:[proof('light_nuclear_curve')]});
 const composite=groups.find(g=>g.rows.some(r=>r?.id==='baryon'));
 composite.rows.push({id:'beta',ow:25,kind:kind(25),name:'Native parity-violating beta records',value:'A='+Number(T.beta.coefficients.A).toFixed(8),text:true,page:'constructions',tip:'The native point-contact spin coefficient and complete 3D momentum records use the calibrated baryon current; all preparation and Fock complements remain.',open:'The finite angular source is not identified with a physical continuum neutron beam or measured lifetime.',src:[proof('beta_angular')]});
}
export function updateConstructionOpenItems(open){
 const updates={
  nucleon_mass:{title:'Independent interacting hadron masses',sub:'fitted strong energies and complete rest-energy records coexist; physical contact-dressed poles and held-out meson assignments require their own comparison'},
  beta:{title:'A physical neutron lifetime',sub:'native 3D parity records and angular coefficients use calibrated axial strength; a measured lifetime and outgoing continuum identification are not supplied'},
  nuclei:{title:'The observed nuclear spectrum',sub:'finite-box triton calibration is retained with failed helion/alpha controls; a complete observed binding curve, halo lifetimes and asymptotic breakup thresholds are not supplied'}
 };
 for(const r of open)if(updates[r.id])Object.assign(r,updates[r.id]);
}

// Enrich Fable's compact Results board with the same authenticated source values.
// Calibrations deliberately have no deviation marker: reusing a target is not a test.
export function applyConstructionNumbers(board){
 const more=key=>{const [label,url]=proof(key);return [[label,'URL',url]];};
 const ancestry='The electron fixes the GeV unit. The analyzer phase 2/9 has retrospective mass ancestry; these free band minima are not identified with full interacting particle poles.';
 const leptons=board.groups.find(g=>g.id==='leptons');
 if(leptons){
  leptons.note='native charged band minima · electron calibration · OpenWave 11';
  for(const row of leptons.rows){
   row.facts=[...(row.facts||[]).filter(x=>x!==ancestry),ancestry];
   row.more=more('single_valley_leptons');
   if(row.id==='mu_e')row.text='The same native Higgs-Wilson family source has exactly three charged minima. Their ratios follow from its declared analyzer phase 2/9. '+ancestry;
   if(row.id==='m_mu'||row.id==='m_tau'){
    const particle=row.id==='m_mu'?'muon':'tau',source=T.leptons.rows.find(x=>x.particle===particle);
    row.unit='GeV';row.model=source.mass_GeV;row.modelText=source.mass_GeV.toPrecision(12);
    if(!row.nativeGeV){row.meas={...row.meas,v:row.meas.v/1000,s:row.meas.s/1000,text:(row.meas.v/1000).toPrecision(8)};row.nativeGeV=true;}
    row.incomplete=null;row.what='A native charged band minimum, converted using the measured electron mass.';row.text=ancestry;
   }
  }
 }
 const register=board.constructions.find(x=>x.id==='register');
 if(register){register.text='The declared analyzer gives three charged minima and Koide Q = 2/3. '+ancestry;register.more=more('single_valley_leptons');}
 const calibration=(id,name,value,target,ow,key,scope,extra=[])=>({id:'native_'+id,name,sym:name,unit:'GeV',model:value,modelText:value.toFixed(9),meas:{v:Number(target),s:0,text:Number(target).toFixed(9),ref:'pdg26'},cmp:null,status:'declared',none:'calibrated · OW '+ow,refWord:'calibration target',what:'A finite native-source energy assigned to '+name+'. '+scope,text:scope,keys:[],more:more(key),facts:['OpenWave criterion '+ow+' · calibration is not an independent mass prediction',...extra]});
 const labels={proton:['Proton',15],neutron:['Neutron',15],charged_pion:['Charged pion',18],neutral_vector:['Neutral rho',18],Delta_plus:['Delta plus',15]};
 const masses=F.strong.mass_fits.map(r=>{const[name,ow]=labels[r.name];return calibration(r.name,name,computed(r),r.target_GeV,ow,'common_hyperfine_spectrum','One positive strong source uses seven disclosed mass, current and binding targets. These fitted energies are not full interacting pole predictions.');});
 for(const name of ['K+','Lambda']){const r=C.strange.masses.find(x=>x.name===name);masses.push(calibration(name,name==='K+'?'Charged kaon':'Lambda',r.computed_GeV,r.comparison_GeV,18,'strange_composites','Two additional coefficients fit kaon and Lambda energies. Held-out strange masses and the tested on-shell Lambda decay fail.'));}
 const triton=C.nuclear.masses.find(x=>x.name==='triton');masses.push(calibration('triton','Triton',mid(triton.GeV_interval),triton.target_GeV,17,'light_nuclear_curve','The displayed midpoint summarizes a certified finite-box interval. One three-body coefficient uses the triton target; helion and alpha held-out comparisons fail.',['Certified source interval: ['+triton.GeV_interval.join(', ')+'] GeV']));
 const ratio=T.widths.ratio,delta=ratio.native_ratio-ratio.PDG2025_comparison;
 const width={id:'native_tau_ratio',name:'Tau leptonic width ratio',sym:'tau mu / e width',unit:'',model:ratio.native_ratio,modelText:ratio.native_ratio.toFixed(8),meas:{v:ratio.PDG2025_comparison,s:ratio.PDG2025_uncertainty,text:ratio.PDG2025_comparison+' ± '+ratio.PDG2025_uncertainty,ref:'pdg25'},cmp:{abs:delta,rel:delta/ratio.PDG2025_comparison,sigma:delta/ratio.PDG2025_uncertainty,relSigma:ratio.PDG2025_uncertainty/ratio.PDG2025_comparison},status:'conditional',refWord:'held-out comparison',cite:'Particle Data Group 2025',refUrl:'https://pdg.lbl.gov/2025/listings/rpp2025-list-tau.pdf',what:'The native tau-to-muon/electron leptonic partial-width ratio cancels the supplied weak normalization.',text:'This comparison did not select a source parameter. Electromagnetic radiative corrections and observed-beam identification are absent.',keys:[],more:more('lepton_widths'),facts:['OpenWave criterion 24 · held-out comparison',Math.abs(ratio.difference_in_reported_uncertainties_diagnostic).toFixed(2)+' reported measurement uncertainties from the target']};
 board.groups=board.groups.filter(g=>g.id!=='native_masses'&&g.id!=='native_width');
 board.groups.splice(Math.max(0,board.groups.findIndex(g=>g.id==='leptons')+1),0,
  {id:'native_masses',title:'Native hadron and nuclear energies',note:'GeV values · calibrated targets · source and limits on click',status:'declared',page:'constructions',rows:masses},
  {id:'native_width',title:'A held-out decay comparison',note:'tree level · OpenWave 24',status:'conditional',page:'constructions',rows:[width]});
 const neutrino=board.open.find(x=>x.id==='neutrinos');
 if(neutrino){neutrino.sub='three calibrated Dirac branches; independent masses and mixing remain open';neutrino.text=T.neutrinos.rows.map((r,i)=>'m'+(i+1)+' = '+r.mass_GeV.toPrecision(8)+' GeV').join('; ')+'. The lightest mass and oscillation inputs are supplied. Right-handed components share these masses; no additional heavy sterile particle is derived.';neutrino.more=more('neutrino_calibration');}
 return board;
}
