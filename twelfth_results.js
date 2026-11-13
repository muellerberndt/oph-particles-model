import { JOURNEY_RESULTS as D } from './journey_results_data.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mid=x=>(x[0]+x[1])/2;
const sci=(v,n=4)=>{const[a,b]=Number(v).toExponential(n).split('e');return `${a} × 10<sup>${Number(b)}</sup>`;};
export function outwardBox(x,n=9){
 const endpoint=(value,upper)=>{
  if(!Number.isFinite(value)||!Number.isInteger(n)||n<0)throw new Error('Invalid certified interval');
  const view=new DataView(new ArrayBuffer(8));view.setFloat64(0,value);
  const bits=view.getBigUint64(0),e=Number((bits>>52n)&2047n),fraction=bits&((1n<<52n)-1n);
  const power=e?e-1075:-1074,mantissa=e?fraction+(1n<<52n):fraction;
  let numerator=(bits>>63n?-mantissa:mantissa)*10n**BigInt(n),denominator=1n;
  if(power>=0)numerator<<=BigInt(power);else denominator<<=BigInt(-power);
  let units=numerator/denominator;const remainder=numerator%denominator;
  if(upper&&remainder>0n)units++;if(!upper&&remainder<0n)units--;
  const sign=units<0n?'-':'',digits=(units<0n?-units:units).toString().padStart(n+1,'0');
  return sign+(n?digits.slice(0,-n)+'.'+digits.slice(-n):digits);
 };
 if(x.length!==2||x[0]>x[1])throw new Error('Invalid certified interval');
 return endpoint(x[0],false)+', '+endpoint(x[1],true);
}
const box=outwardBox;
const proof=k=>`<a href="${D.source_repository}${D.source_paths[k].replace(/results\.json$/, 'PROOF.md')}">Proof & complete records ↗</a>`;
const ow=ids=>`<div class="jr-criteria">${ids.map(i=>`<a href="?page=openwave&ow=${i}">OW ${i}</a>`).join('')}</div>`;
const card=(id,label,title,number,body,detail,keys,ids)=>`<article class="jr-card jr-current" data-current-card="${id}"><div class="jr-label">${label}</div><h4>${title}</h4><div class="jr-number">${number}</div><p>${body}</p>${ow(ids)}<details><summary>Source, inputs and limits</summary><p>${detail}</p><p>${keys.map(proof).join(' · ')}</p></details></article>`;
const table=(head,rows)=>`<div class="jr-table-wrap"><table><thead><tr>${head.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((x,i)=>i?`<td>${x}</td>`:`<th scope="row">${x}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
export function twelfthResults(){
 const C=D.current_results,F=D.frontier_results,S=C.strange,N=C.nuclear,G=C.gravity,Y=C.yang_mills;
 const k=S.masses.find(x=>x.name==='K+'),lambda=S.masses.find(x=>x.name==='Lambda'),triton=N.masses.find(x=>x.name==='triton');
 const core=C.core.rows.find(x=>x.family==='electron'&&x.Wilson==='1/16');
 const bc=C.cosmology.comparisons[0],m11=C.cosmology.comparisons[1];
 const older=F.strong.mass_fits.map(x=>[esc(x.name),(x.computed_GeV??mid(x.interval_GeV)).toFixed(x.name==='Delta_plus'?6:11),'Calibrated strong energy']);
 const light=D.particle_results.leptons.rows.map(x=>[esc(x.particle),Number(x.mass_GeV).toPrecision(x.particle==='electron'?11:13),x.particle==='electron'?'Electron anchor':'Native analyzer ratio']);
 return [
 card('strange','Two additional strong mass targets · complete native sectors','Kaon and Λ energies join the catalogue',`${k.computed_GeV.toFixed(6)} / ${lambda.computed_GeV.toFixed(6)}<small> GeV · K⁺ / Λ, calibrated</small>`,
 `The native strong action retains ${S.baryon_singlets} baryon and ${S.meson_singlets} meson singlets. Charge conjugation gives the same K⁻ energy. The tested two-cell Λ→p+π⁻ channel is closed; no strange lifetime is claimed.`,
 `Two additional coefficients fit K⁺ and Λ. Cabibbo is a separate empirical input for current interventions. Held-out K⁰, Σ, Ξ and Ω assignments fail; the nonleptonic floor is ${S.nonleptonic_floor_GeV.toFixed(9)} GeV, with a certified gap above Λ of at least ${(Math.floor(S.nonleptonic_gap_GeV*1e9)/1e6).toFixed(6)} MeV. These are finite source energies, not a complete observed hadron spectrum. ${table(['Inherited strong candidate','GeV','Role'],older)}${table(['Charged lepton','GeV','Role'],light)} The lepton branches belong to a separate Higgs-Wilson member; they are not inferred from these strong fits.`,['strange_composites','common_hyperfine_spectrum'],[13,15,18]),
 card('bulk','Infinite one-dimensional Gauss chain · exact complement bounds','A certified bulk nucleon rest band',`[${box(C.bulk.neutron_GeV_interval,9)}]<small> GeV · neutron-assigned band</small>`,
 `The proton-assigned interval is [${box(C.bulk.proton_GeV_interval,9)}] GeV. The full native axial interval is [${box(C.bulk.axial_interval,6)}]. Complete relative positions and the high-spectrum complement remain.`,
 `Two degree-dependent coefficients reuse the neutron-mass and axial targets. These agreements are calibrated enclosures, not independent predictions. The seven two-cell calibration domains are unchanged. The transfer is an infinite one-dimensional rest-band result; no three-dimensional scattering pole, continuum Lorentz symmetry or full bulk hadron spectrum is claimed.`,['hadron_refinement_flow'],[13,15,17,25]),
 card('nuclei','One additional triton calibration · complete finite nuclear sectors','A light-nuclear spectrum with held-out tests',`[${box(triton.GeV_interval,7)}]<small> GeV · triton-assigned channel</small>`,
 `The three- and four-cell calculations retain all low magnetic multiplets and bounded high-state complements. The helion and alpha comparisons fail; the source does not reproduce the full nuclear binding curve.`,
 `${table(['Assigned nucleus','Source interval / GeV','Role'],N.masses.map(x=>[esc(x.name),'['+box(x.GeV_interval,7)+']',x.role==='calibration'?'Calibration':'Held out, fails']))} These finite-box spectra do not identify an asymptotic breakup threshold, halo lifetime or infinite-volume nuclear mass. The three-body coefficient has triton-target ancestry.`,['light_nuclear_curve'],[16,17]),
 card('string','Actual native quotient group · dynamical Gauss string','Fractional charge has a discrete string phase','Q = ⅔, −⅓',
 'The complete native current obeys the colour-centre/electric quotient on every Fock occupation. Two- and three-cell executions retain every electric flux, colour triality and preparation failure.',
 'The measured dual-electric phase is exp(2πi n/3)=exp(−2πi triality/3). A quark changes that phase by its fractional charge; integer-charge leptons give the control. The zero U(1) electric-energy coefficient preserves the strong-source isometry. This is a discrete dual-electric dictionary, without a proved continuous conjugate-link-angle texture or physical free-quark mass.', ['native_centre_string'],[12,22]),
 card('core','Same dressed Pauli/Maxwell source · physical charge probes','A measured core and a calculated current response',`[${box(core.radius_cells_interval,9)}]<small> cells · electron x-radius</small>`,
 `Exact ground and resolvent bounds enclose the current response in [${box(core.response[0].interval,12)}] and [${box(core.response.at(-1).interval,12)}] at imaginary probe frequencies ${core.response[0].frequency} and ${core.response.at(-1).frequency} in source units. The core is smaller than one cell.`,
 `The physical-Q probe retains its compensating reference, both spin branches, terminal position/flux measurements and their work. Maximum spatial suppression is ${(100*mid(core.largest_suppression_interval)).toFixed(5)}% in the first Brillouin zone. An order-one core onset is unresolved. Response errors are bounded by 10⁻⁹; no all-orders physical QED running law or radius fit is claimed.`,['dressed_core_response'],[23]),
 card('pauli','Complete Pauli magnetic term · all compact fluxes','Mass-dependent matter and Maxwell propagation',`[${box(C.electromagnetism.rest_rows[0].source_reference_energy_GeV_interval,12)}]<small> GeV · charged/reference sector</small>`,
 `The same source retains the Pauli magnetic commutator and a common free speed squared ${C.electromagnetism.common_speed_squared}. Free three-dimensional refinement and the interacting finite records have controlled errors.`,
 `${table(['Branch','Source/reference energy / GeV'],C.electromagnetism.rest_rows.map(x=>[esc(x.family),'['+box(x.source_reference_energy_GeV_interval,12)+']']))} These energies include the compensating reference and cavity dressing; they are not physical pole fits. The declared source is positive and number preserving. Vacuum pair production, a signed-Dirac unitary transfer and an interacting Lorentz limit are not inferred.`,['dirac_maxwell_refinement'],[2,21,29]),
 card('clock','Actual collision pump · complete battery accounting','A native mass-frequency clock with an onset control',`${sci(C.clock.masses[0].Hz,6)}<small> cycles/s · inherited electron gap</small>`,
 'The collision channel pumps occupation from vacuum without a supplied phase. Its complete coherence bands rotate at the inherited constituent mass; all battery and failure records remain.',
 `The first probe itself creates the conditional phase, and the zero-pump control retains the oscillation. These records therefore do not establish autonomous phase onset. Array linewidths narrow to [${box(C.clock.bands.at(-1).linewidth_interval,10)}] source units at ${C.clock.bands.at(-1).array_size} constituents; this is not the rest energy of a single particle. Seconds use the electron anchor and SI conversion.`,['autonomous_clock_channel'],[3]),
 card('photon-gravity','One electromagnetic, native-clock and geometry source','Transverse light bends and arrives later',`${G.records.separate_Fourier_direction_deflection.toFixed(8)}<small> rad · finite Fourier-direction difference</small>`,
 `All ${G.transverse_modes} transverse modes, both polarizations and the photon vacuum share ${G.dimensions.toLocaleString('en-US')} vacuum/one-photon sector dimensions with native clocks. Arrival is delayed by ${G.records.conditional_arrival_delay.toFixed(8)} source units, with certified positive sign.`,
 `The same-record clock-ratio intervals are ${G.records.same_joint_native_clock_phase_ratio_intervals.map(x=>'['+box(x,7)+']').join(' and ')}. Complete detector failures and preparation/readout work are retained. This is a declared positive-frequency Maxwell constitutive source, not a canonical metric-QED equivalence. The tested common-unit map fails: G=${G.unit_test.conditional_G_natural_GeV_minus2.toFixed(4)} GeV⁻² and c_model=${G.unit_test.conditional_photon_speed_over_observed_c.toFixed(7)}c. No physical lensing angle or Newton strength is claimed.`,['transverse_gravity'],[26,27]),
 card('uniform-gap','Pure SU(2) · every link representation · fixed spacing','A gauge-gap theorem uniform in spatial volume','Uniform above a strong-coupling threshold',
 'An exact local-source reduction supplies the hypotheses of the stability theorem. It gives unique finite-volume ground states, a thermodynamic ground-state limit, a volume-independent gap and exponential clustering at sufficiently strong coupling.',
 `The threshold and numerical gap are existential, not computed. The theorem retains full Haar links and the physical Gauss restriction; nonzero Wilson variance exceeds ${Y.curvature_variance_lower}. Time is continuous at fixed spatial spacing. A renormalized four-dimensional continuum, spatial-continuum positive gap, GeV glueball mass and Clay solution are not established.`,['su2_volume_gap'],[22]),
 card('cosmology','Finite capacity work + conditional external comparison','A correlated 15-point expansion test',`χ² ∈ [${bc.chi_square.join(', ')}]<small> 15 BC03 chronometer rows</small>`,
 'The capacity-dependent volume term has exact negative pressure and complete controller work. The expansion comparison uses fixed Planck inputs and the full correlated covariance, with no chronometer fit or row removal.',
 `H₀=${bc.anchors.H0_km_s_Mpc} km/s/Mpc and Ωm=${bc.anchors.Omega_m} are supplied. The M11 stellar-model control gives χ²∈[${m11.chi_square.join(', ')}]; it is not an independent dataset to pool. The dark-energy amplitude is calibrated. No source-derived Lambda amplitude, cosmic horizon or common metric-stress identification is claimed.`,['capacity_stress'],[28])
 ].join('');
}
