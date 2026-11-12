"""Project source-bound RER finite results into the particle explorer.

All displayed numbers come from replayable receipts. The mathematical
interactive controls are independently checked by test_finite_results.mjs.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
from fractions import Fraction
from pathlib import Path
from project_joint_results import SOURCES as JOINT_SOURCES, project as project_joint
from project_current_results import SOURCES as CURRENT_SOURCES, project as project_current

ROOT = Path(__file__).resolve().parents[1]
RER = ROOT.parent / 'reverse-engineering-reality'
EXTRA = ROOT / 'tools/site_extra'
SOURCES = {
    'lepton': ('lepton_cycle/results.json', 'Complete lepton cycles'),
    'epochs': ('native_abundance_epochs/results.json', 'Exact population dynamics'),
    'symmetry': ('charge_conjugation_dynamics/results.json', 'Native conjugation symmetry'),
    'hadron': ('quenched_hadron_binding/results.json', 'Hadron covariance and scale'),
    'crossover': ('electroweak_crossover/results.json', 'Crossover size and cutoff sensitivity'),
    'repair': ('repair_sector_bridge/record_observer_results.json', 'Current-record distance observer'),
    'lepton_comparison': ('lepton_cycle/physical_comparison.json', 'Fixed lepton comparison and exposure'),
    'species': ('native_abundance_epochs/species_identifiability_results.json', 'Species identifiability and thermal comparison'),
    'crossover_budget': ('electroweak_crossover/comparison_budget.json', 'Crossover covariance budget'),
    'calibrated_quarks': ('common_source/calibrated_matter_results.json', 'Empirically calibrated common-scale matter action'),
    'yukawa_operator': ('yukawa_source_operator/results.json', 'Source Higgs derivatives and exact tensor extraction'),
    'yukawa_dynamics': ('yukawa_source_dynamics/results.json', 'Complete family dynamics and canonical residues'),
    'yukawa_running': ('yukawa_source_running/results.json', 'Finite coupling inverse and conditional running'),
    'yukawa_feedback': ('yukawa_source_feedback/results.json', 'Ordered source correlations and pairing correction'),
    'defect_overlap': ('defect_mode_overlap/results.json', 'Complete localized-mode scalar overlap'),
    'defect_scalar': ('defect_scalar_response/results.json', 'Native scalar-cost response of charge sectors'),
    'defect_vertex': ('yukawa_defect_vertex/results.json', 'Actual quantum-Higgs insertion and contact response'),
    'scalar_modes': ('defect_scalar_modes/results.json', 'Complete source-selected scalar modes and sea response'),
    'mass_join': ('defect_mass_join/results.json', 'Common defect and quantum Higgs source'),
    'family_vertices': ('defect_family_vertices/results.json', 'Full native contact vertices and scalar spectrum'),
    'dispersion': ('defect_dispersion/results.json', 'Complete periodic defect band controls'),
    'mass_catalogue': ('defect_mass_catalogue/results.json', 'Conditional GeV map and seventeen-species catalogue'),
    'lepton_compiler': ('lepton_mass_compiler/results.json', 'Native lepton analyzer compiled into free rest energies'),
    'quark_resolution': ('quark_flavour_resolution/results.json', 'Complete quark response splitting and scale tests'),
    'quark_dressing': ('quark_gauge_dressing/results.json', 'Positive Gauss-law electric dressing'),
    'scalar_density': ('native_scalar_density_pole/results.json', 'Exact neutral scalar-density pole and complete readout'),
    'pion': ('pion_mass_readout/results.json', 'Conditional pion triplet and archived scale choices'),
    'conditional_spectrum': ('conditional_particle_spectrum/results.json', 'Complete empirically calibrated quadratic particle spectrum'),
    'neutrino_response': ('neutrino_mass_response/results.json', 'Native neutral transport and coupled sterile controls'),
}

SOURCES.update(JOINT_SOURCES)
SOURCES.update(CURRENT_SOURCES)

def load_receipt(path, rer):
    value = json.loads(path.read_text())
    if 'all_checks_pass' in value and value['all_checks_pass'] is not True:
        raise ValueError(f'failed receipt: {path}')
    if 'checks' in value and (not value['checks'] or any(v is not True for v in value['checks'].values())):
        raise ValueError(f'nonpassing checks: {path}')
    bindings = value.get('source_bindings', value.get('input_sha256', value.get('sources', value.get('source_sha256', value.get('source_files_sha256')))))
    if not isinstance(bindings, dict) or not bindings:
        raise ValueError(f'source bindings absent: {path}')
    if 'implementation_sha256' in value:
        if not isinstance(value['implementation_sha256'], dict):
            raise ValueError('implementation bindings must be a mapping')
        bindings = {**bindings, **value['implementation_sha256']}
    for name, expected in bindings.items():
        repository_path = name.startswith(('model/', 'Lean/', 'tools/', 'code/', 'evidence/', 'paper/')) or name in {'requirements.txt', 'pyproject.toml', 'uv.lock'}
        candidate = rer / name if repository_path else path.parent / name
        resolved = candidate.resolve()
        if not resolved.is_relative_to(rer.resolve()):
            raise ValueError('source binding escapes canonical repository')
        if hashlib.sha256(resolved.read_bytes()).hexdigest() != expected:
            raise ValueError(f'stale source binding: {candidate}')
    if value.get('schema') == 'oph.calibrated_matter.v1':
        packet = 'model/common_source/calibrated_matter_parameters.json'
        if packet not in bindings or value.get('calibration') != json.loads((rer / packet).read_text()):
            raise ValueError('calibrated matter packet differs from its bound empirical input')
    return value


def defect_projection(receipts):
    overlap, scalar, vertex = [receipts['defect_'+key] for key in ('overlap', 'scalar', 'vertex')]
    scope = overlap['scope']
    if (overlap['schema'] != 'oph.defect_mode_overlap.v1' or overlap['sites'] != 343
            or overlap['complete_band_rank'] != 4 or overlap['one_body_rows'] != 686
            or scope['all_spatial_rows_and_scalar_site_insertions_retained'] is not True
            or scope['full_local_leakage_kernel_reconstructible'] is not True
            or any(scope[key] is not False for key in ('inserted_family_coefficients',
                'selected_dynamical_scalar_mode', 'scalar_kinetic_residue_supplied',
                'three_generations_derived', 'physical_Yukawa_prediction'))
            or scope['empirical_inputs']):
        raise ValueError('localized scalar overlap exceeds its finite source domain')
    profiles = {}
    for key, label in (('uniform', 'Uniform scalar'), ('positive_core_patch', 'Local 27-site scalar patch')):
        row = overlap['profiles'][key]
        values = row['singular_values']
        if (len(values) != 4 or any(type(x) not in (int, float) or not math.isfinite(x) or x <= 0 for x in values)
                or any(not math.isclose(values[i], values[i+1], rel_tol=1e-9) for i in (0, 2))
                or row['profile_normalization_is_physical_scalar_residue'] is not False):
            raise ValueError('complete doubled overlap strengths or scalar normalization differ')
        ratio = max(values)/min(values)
        if key == 'uniform' and (not math.isclose(ratio, 1, rel_tol=1e-9)
                                or row['complement_leakage_norm'] > 1e-9):
            raise ValueError('uniform source scalar must have no spatial hierarchy')
        if key == 'positive_core_patch' and not math.isclose(ratio, row['largest_to_smallest_ratio'], rel_tol=1e-12):
            raise ValueError('overlap ratio differs from complete singular values')
        profiles[key] = {'label': label, 'strengths': values, 'ratio': ratio,
                         'sites': row['site_count'], 'complement_leakage_norm': row['complement_leakage_norm']}
    ss = scalar['scope']
    if (scalar['schema'] != 'oph.defect_scalar_cost_response.v1'
            or ss['exact_local_source_calculation'] is not True
            or ss['scalar_cost_is_neutral_Higgs_field_amplitude'] is not False
            or ss['source_clock_converted_to_physical_time'] is not False
            or ss['physical_mass_predictions'] or ss['target_particle_data_inputs'] or ss['fitted_Yukawa_parameters']
            or scalar['statistic']['success_weight_is_not_divided_out'] is not True
            or scalar['statistic']['state_derivative_included'] is not True):
        raise ValueError('scalar-cost moment exceeds its native intervention domain')
    scalar_rows = []
    for key, label in [('uc', 'uᶜ'), ('dc', 'dᶜ'), ('Q', 'Q'), ('ec', 'eᶜ'), ('L', 'L')]:
        row = scalar['channels'][key]
        if row['success_probability'] != '1/2' or row['failure_probability'] != '1/2':
            raise ValueError('complete scalar-cost probe probabilities differ')
        statistic = row['complete_unconditioned_second_energy_transfer_moment']
        bounds = [list(map(Fraction, statistic[name])) for name in ('value_interval', 'derivative_interval')]
        if any(len(pair) != 2 or pair[0] > pair[1] for pair in bounds):
            raise ValueError('scalar response requires ordered exact enclosures')
        scalar_rows.append({'label': label, 'moment': float(sum(bounds[0])/2),
                            'derivative': float(sum(bounds[1])/2)})
    vs, construction = vertex['scope'], vertex['construction']
    if (vertex['schema'] != 'oph.yukawa_defect_vertex.v1' or construction['dimension'] != 320
            or construction['primitive_interaction_coefficient'] != '1'
            or construction['supplied_family_matrix'] is not False or construction['measured_mass_inputs']
            or vs['actual_charged_Higgs_insertion'] is not True
            or vs['complete_source_and_quantum_references_retained'] is not True
            or vs['equation_of_motion_contact_vertex_not_full_1PI_vertex'] is not True
            or vs['on_shell_pole_residue_or_relativistic_Higgs_kinetic_normalization'] is not False
            or vs['three_family_hierarchy_or_physical_particle_masses'] is not False
            or vertex['vertex']['scalar_first_moment'] != '14/5'
            or vertex['vertex']['normalized_unit_coefficient'] != 'sqrt(70)/5'):
        raise ValueError('finite Higgs contact response exceeds its source domain')
    intervention = vertex['actual_scalar_intervention']
    if (intervention['quantum_reference_coherences_retained'] is not True
            or intervention['scalar_cost_or_interaction_coefficient_differentiated'] is not False
            or intervention['total_Gauss_operator_identities'] != 24
            or Fraction(intervention['derivative_of_pair_expectation_at_zero_pulse']) == 0):
        raise ValueError('actual scalar pulse must retain its quantum charge reference and nonzero response')
    return {'physical_Yukawa_prediction': False,
        'principle': 'A particle assignment is a readout of how a defect propagates and responds. '
            'Its charge class constrains the allowed interaction; the coupling depends on the full mode and its response to a scalar intervention.',
        'overlap': {'profiles': profiles, 'retained_modes': 4, 'complete_scalar_sites': 343,
            'finding': 'One fixed 686-state spatial operator supplies four localized modes. '
                'Projecting every local unit scalar insertion onto their complete normalized band gives two doubled response strengths. '
                'The local patch reaches the other core through a hopping tail, producing a large overlap hierarchy without family-tagged coefficients.',
            'scope': 'These are finite profile diagnostics. The local patch is a declared intervention, not a scalar mode selected by the source. '
                'Uniform scalar response has no hierarchy. Four modes give two doubled strengths, not three generations. '
                'The common-source panel supplies its own selected free scalar mode and vacuum metric. Interacting poles and a physical generation assignment require their stated attachments.'},
        'scalar': {'rows': scalar_rows,
            'finding': 'On the separate thirty-mode quantum source, varying the scalar occupation cost changes the actual ground polarization '
                'and the complete second energy-transfer moment of each removal probe. Every target energy and the one-half failure probability enter the sum.',
            'formula': 'H(μ) = V + μN_H; M₂(μ) = Σⱼ wⱼ(μ)[Eⱼ(μ) − E₀(μ)]²',
            'scope': 'Decimal summaries of exact enclosed values at μ = 1, in source-clock units. '
                'The derivative follows the changed ground state. Scalar occupation cost is not a Higgs field amplitude; '
                'these values are neither masses nor Yukawa coefficients.'},
        'vertex': {'source_dimension': construction['dimension'],
            'preparation_probability': construction['ground_preparation_probability'],
            'scalar_spectral_moment': vertex['vertex']['scalar_first_moment'],
            'normalized_contact_coefficient': vertex['vertex']['normalized_unit_coefficient'],
            'normalized_contact_coefficient_display': '√(14/5)',
            'pair_pointer_slope': intervention['derivative_of_pair_expectation_at_zero_pulse'],
            'finding': 'The separate 320-state lepton-Higgs source has a declared unit interaction. '
                'Complete fermion and scalar records reconstruct its contact vertex, while an actual charged-scalar pulse produces a pair-pointer response '
                'with its quantum charge reference retained.',
            'scope': 'The scalar spectral moment is 14/5; its finite contact normalization is √(14/5). '
                'This is a measured normalization of the specified unit interaction, not an on-shell Yukawa coupling. '
                'The pair-pointer slope is measured at zero scalar-pulse angle on the prepared ground. '
                'The original ground-preparation probability is 1/160, with all other preparation outcomes retained.'},
        'source_domains': 'The overlap, local cost-response and 320-state contact controls retain their separate preparations. The common-source panel states their proved attachments and keeps the control-only normalizations distinct.'}


def yukawa_projection(receipts):
    operator, dynamics, running, feedback = [receipts['yukawa_'+key]
                                            for key in ('operator', 'dynamics', 'running', 'feedback')]
    if (operator['schema'] != 'oph.yukawa_source_operator.v1'
            or operator['operator_extraction']['complex_coefficient_dimension'] != 27
            or operator['operator_extraction']['all_27_symbolic_coordinates_recovered_exactly'] is not True
            or operator['physical_attachment']['source_selected_charged_fermion_Yukawa_matrix'] is not False
            or operator['physical_attachment']['physical_charged_fermion_mass_prediction'] is not False
            or operator['empirical_mass_or_Yukawa_inputs']):
        raise ValueError('Yukawa operator result exceeds its source and physical domain')
    if (dynamics['schema'] != 'oph.yukawa_source_dynamics.v1'
            or dynamics['native_completion']['exact_Schur_rank'] != 1
            or dynamics['complete_cyclic_instrument']['physical_mass_or_Yukawa_derived'] is not False
            or dynamics['empirical_or_calibrated_inputs']):
        raise ValueError('Yukawa dynamics result exceeds its complete finite domain')
    if (running['schema'] != 'oph.yukawa_source_running.v1'
            or running['status']['source_Y_reconstructed_from_complete_records'] is not True
            or running['status']['physical_mass_or_continuum_prediction'] is not False
            or running['status']['source_to_running_Yukawa_matching_derived'] is not False
            or running['status']['source_selected_Higgs_coupling_scalar_energy_or_hopping'] is not False
            or running['status']['empirical_particle_inputs']):
        raise ValueError('Yukawa coupling inverse or running exceeds its declared domain')
    scope = feedback['scope']
    if (scope['all_correlation_lags_summed_exactly'] is not True
            or scope['all_original_records_retained_by_source'] is not True
            or scope['phase_inserted_as_function_of_probability'] is not False
            or scope['computed_J_is_a_physical_Yukawa'] is not False
            or scope['physical_particle_spectrum_derived'] is not False
            or scope['empirical_mass_or_mixing_input'] is not False
            or feedback['coherent_correction_operator'] != 'I_2 tensor J'
            or len(feedback['second_order_pairing_correction_Y3_exact']) != 3):
        raise ValueError('Yukawa feedback result exceeds its complete source domain')
    return {
        'physical_Yukawa_spectrum_derived': False,
        'physical_quark_mass_prediction': False,
        'physical_neutrino_mass_prediction': False,
        'finding': 'The finite source supplies exact interaction tensors, complete response records and an ordered-correlation correction. '
            'These calculations expose how a specified Higgs variation becomes a family coupling, and which parts depend on a declared interaction.',
        'rows': [
            {'key': 'operator', 'title': 'Extract every family coefficient',
             'result': 'The native Higgs tensors admit an exact dual that recovers all 27 complex coefficients from a specified Higgs variation. '
                'It recovers the existing trial action exactly; a dynamical Higgs kinetic residue is a separate input.',
             'proof': 'model/yukawa_source_operator/PROOF.md'},
            {'key': 'feedback', 'title': 'Keep the order of source records',
             'result': 'Summing every correlation lag gives a nonzero coherent correction I ⊗ J without inserting a phase. '
                'The first-order term is not a Yukawa correction. The pairing sector receives the derived second-order term h²Y₃.',
             'proof': 'model/yukawa_source_feedback/PROOF.md'},
            {'key': 'running', 'title': 'Recover the specified finite coupling',
             'result': 'Complete source records invert the declared coupling. Conditional one-loop running and finite spectral controls '
                'retain their supplied interaction parameters; no source-to-physical Yukawa matching is inferred.',
             'proof': 'model/yukawa_source_running/PROOF.md'},
            {'key': 'dynamics', 'title': 'Normalize the complete response',
             'result': 'Restoring all twelve source modes gives two protected zero directions and a rank-one zero-frequency Schur response. '
                'The complete cyclic instrument is dephasing; its full record map has unit singular values.',
             'proof': 'model/yukawa_source_dynamics/PROOF.md'},
        ],
        'scope': 'No source-derived physical charged-fermion Yukawa spectrum is established. These finite results make no quark or neutrino mass prediction. '
            'A physical Higgs intervention, its kinetic residue and the same-source field and clock attachment are required.',
    }


def calibrated_quark_projection(receipt):
    """An empirical action table, with no native prediction or uncertainty promotion."""
    packet, scope = receipt['calibration'], receipt['scope']
    contract, common = packet['calibration_contract'], packet['common_scale']
    matched = packet['matched_SM']
    if (receipt.get('schema') != 'oph.calibrated_matter.v1'
            or packet['role'] != 'empirical_calibration_sanity_check_not_parameter_derivation'
            or common['scheme'] != 'MSbar Standard Model' or common['mu'] != 'M_Z'
            or common['reference_MZ_GeV'] != '91.1876'
            or common['matching_reexecuted_here'] is not True
            or matched['source'] != 'SMDR_forward_inverse_calibration'
            or contract['all_nine_Yukawas_CKM_and_v_are_empirical_inputs'] is not True
            or contract['matched_parameter_joint_uncertainty_not_propagated'] is not True
            or contract['same_input_mass_recovery_is_held_out_validation'] is not False
            or contract['running_action_masses_are_PDG_pole_masses'] is not False
            or contract['quark_confinement_widths_and_interacting_self_energies_computed'] is not False
            or scope['observed_parameters_are_calibrations'] is not True
            or scope['physical_parameters_derived_from_native_repair'] is not False
            or scope['quark_running_parameters_are_free_asymptotic_poles'] is not False
            or receipt['kinetic_contract']['same_native_clock_or_reconstructed_spacetime_calibration_derived_here'] is not False
            or receipt['identities']['same_action_mass_diagonalization_exact'] is not True):
        raise ValueError('calibrated quark role, scale or physical interpretation differs')
    rows = []
    for channel, labels in [('up', ('Up', 'Charm', 'Top')), ('down', ('Down', 'Strange', 'Bottom'))]:
        values, yukawas = receipt['running_mass_parameters_numeric_GeV'][channel], matched['yukawa'][channel]
        if len(values) != 3 or len(yukawas) != 3:
            raise ValueError('six calibrated quark parameters required')
        for label, value, yukawa in zip(labels, values, yukawas):
            expected = float(yukawa)*float(matched['v_SM_GeV'])/math.sqrt(2)
            if (type(value) not in (int,float) or not math.isfinite(value) or value <= 0
                    or not math.isclose(value,expected,rel_tol=2e-14,abs_tol=0)):
                raise ValueError('calibrated quark parameter differs from the supplied Yukawa and VEV')
            rows.append({'label': label, 'value_GeV': value, 'uncertainty_GeV': None,
                         'role': 'empirically calibrated running action parameter', 'native_prediction': False})
    order = ['Up','Down','Strange','Charm','Bottom','Top']
    rows.sort(key=lambda row:order.index(row['label']))
    return {'rows': rows, 'scale_GeV': float(common['reference_MZ_GeV']),
            'scheme': 'Tadpole-free pure MS-bar Standard Model',
            'empirically_calibrated': True, 'native_predictions': 0, 'joint_uncertainty_available': False,
            'finding': 'These six values belong to an empirically calibrated comparison extension. '
                'All nine charged Yukawa couplings and the Higgs scale are fitted inputs; each displayed parameter is y v/√2. '
                'The action checks the common mass and current conventions. It does not derive six native quark masses.',
            'scope': 'All entries use the tadpole-free pure MS-bar Standard Model scheme at μ = 91.1876 GeV. '
                'The pinned SMDR 1.3 calibration fits reference observables and checks its forward output. '
                'No joint uncertainty has been propagated, and the displayed digits are numerical values of the fixed calibration. '
                'These running action parameters are not isolated free-quark poles. Values quoted at 2 GeV, at a quark’s own scale, '
                'or in a direct-reconstruction top-mass convention require matching before comparison. '
                'No common native-clock or source-to-physical mass map is supplied.',
            'provenance': packet['sources']['SMDR_forward_inverse_calibration']}


def joined_projection(receipts):
    """Keep the five source attachments explicit in the displayed comparison."""
    scalar, joined, family, dispersion, catalogue = [receipts[key] for key in
        ('scalar_modes','mass_join','family_vertices','dispersion','mass_catalogue')]
    if scalar['schema'] != 'oph.defect_scalar_modes.v1' or scalar['complete_scalar_modes_count'] != 343:
        raise ValueError('complete source-selected scalar spectrum required')
    scope=scalar['scope'];first=scalar['native_filled_sea_first_image'];lowest=scalar['lowest_mode']
    if (scope['source_selected_free_scalar_mode'] is not True or scope['global_native_gauge_singlet'] is not True
            or any(scope[k] is not False for k in ('full_interacting_ground_reconstructed',
                'dressed_Higgs_pole_reconstructed','relativistic_particle_mass_or_physical_Yukawa_hierarchy','three_generations_derived'))
            or first['reference']['native_fermion_number'] != 5145
            or first['reference']['joint_interacting_ground'] is not False):
        raise ValueError('scalar first image exceeds its reference domain')
    modes=first['complete_scalar_mode_records'];pointer=first['complete_pointer']
    if (len(modes)!=343 or [r['mode'] for r in modes]!=list(range(343))
            or len(scalar['complete_scalar_frequencies'])!=343
            or pointer['complete_outcome_count']!=344
            or not math.isclose(sum(r['conditional_first_image_probability'] for r in modes),1,abs_tol=1e-12)
            or not math.isclose(pointer['failure_probability']+sum(r['original_pointer_and_mode_probability'] for r in modes),1,abs_tol=1e-12)
            or not math.isclose(pointer['success_probability'],first['interaction_image_norm_squared']/pointer['norm_bound']**2,rel_tol=1e-12)):
        raise ValueError('scalar mode or original pointer probabilities are incomplete')
    for row in modes:
        if (not math.isclose(row['original_pointer_and_mode_probability'],
                pointer['success_probability']*row['conditional_first_image_probability'],rel_tol=1e-10,abs_tol=1e-18)
                or row['conditional_first_image_probability']<0):
            raise ValueError('scalar modal weight differs from original probability')
    if (joined['schema']!='oph.defect_mass_join.v1' or joined['joined_source']['CAR_modes']!=10290
            or joined['joined_source']['scalar_dimension']!=1373
            or joined['scope']['complete_spatial_interacting_ground_and_poles_executed'] is not False
            or joined['scope']['physical_rest_mass_or_Lorentz_limit'] is not False
            or joined['state_reference_clock_and_complete_records']['ground_executed_for_complete_spatial_member'] is not False):
        raise ValueError('joined Hamiltonian is not a completed spatial ground calculation')
    pulse=joined['three_site_complete_source_propagation_control']
    if (pulse['source']['CAR_modes']!=90 or pulse['all_three_unit_channels_executed'] is not True
            or pulse['complete_record_has_positive_receiver_probability_proved'] is not True
            or pulse['preparation_is_interacting_ground'] is not False
            or pulse['full_spatial_ground_or_rest_mass_inferred'] is not False):
        raise ValueError('propagation control exceeds its three-site complete-source domain')
    if (family['schema']!='oph.defect_family_vertices.v1'
            or family['construction']['local_CAR_modes']!=30
            or family['construction']['three_family_source_constructed'] is not False
            or family['scope']['physical_particle_masses_or_neutrino_oscillations'] is not False
            or family['native_contact_vertices']['generation_copies_inferred_from_color'] is not False
            or family['complete_apparatus']['scalar_no_operation_retained'] is not True):
        raise ValueError('native vertex control cannot be promoted to three generations')
    readout=family['complete_scalar_readout'];energy=readout['complete_energy_records_per_component_orientation']
    if energy['full_target_root_count']!=13 or len(energy['records'])!=13:
        raise ValueError('all thirteen local scalar target roots required')
    def midpoint(interval):
        pair=list(map(Fraction,interval))
        if len(pair)!=2 or pair[0]>pair[1]:raise ValueError('ordered rational interval required')
        return float(sum(pair)/2)
    normalization=midpoint(readout['scalar_retarded_first_moment_each_component']['interval'])
    branch=readout['complete_scalar_branch_probabilities']
    branch_weight=midpoint(branch['each_of_four_component_orientation_records']['interval'])
    noop=midpoint(branch['no_operation']['interval'])
    if not math.isclose(4*branch_weight+noop,1,abs_tol=1e-12):
        raise ValueError('full native scalar instrument lost a branch')
    ds=dispersion['scope']
    if (dispersion['schema']!='oph.defect_dispersion.v1'
            or ds['geometry_is_open_compact_member'] is not False
            or ds['relativistic_mass_assignment_established'] is not False
            or ds['all_interacting_common_source_spectra_computed'] is not False
            or ds['all_crystal_momenta_sampled'] is not False or ds['GeV_calibration'] is not None):
        raise ValueError('Bloch controls do not supply an interacting rest-mass map')
    dispersion_rows=[]
    for case in dispersion['cases']:
        if case['isolated_band_dimension_exact']!=4:raise ValueError('complete four-mode Bloch band required')
        dimension=case['one_body_dimension']
        rows=[]
        for row in case['rows']:
            if (len(row['complete_energies'])!=dimension or len(row['low_energies'])!=4
                    or row['nonzero_probe_outcomes']+row['zero_probe_outcomes']!=2*dimension
                    or not math.isclose(row['uniform_eigenmode_add_remove_probability']*dimension,1,abs_tol=1e-12)):
                raise ValueError('complete selected Bloch block and zero outcomes required')
            rows.append({k:row[k] for k in ('axis','phase','low_energies')}
                        | {'energy_change':row.get('positive_branch_energy_change',[0,0]),
                           'E2_secant':row.get('positive_branch_E2_secant')})
        dispersion_rows.append({'side':case['side'],'texture_mass':case['texture_mass'],
                                'dimension':dimension,'rows':rows})
    cat_scope=catalogue['scope'];leptons=catalogue['conditional_electron_anchored_leptons']
    if (catalogue['schema']!='oph.defect_mass_catalogue.v1' or cat_scope['all_target_species_accounted_for'] is not True
            or cat_scope['all_physical_masses_derived'] is not False
            or cat_scope['single_source_SM_spectrum_established'] is not False
            or len(leptons)!=3 or [r['species'] for r in leptons]!=['electron','muon','tau']
            or any(r['source_to_relativistic_rest_map_proved'] is not False for r in leptons)
            or [r['role'] for r in leptons]!=['empirical_anchor','conditional_fixed_effect_ratio','conditional_fixed_effect_ratio']):
        raise ValueError('electron-anchored values require their unproved mass-map condition')
    targets=catalogue['target_catalogue']
    expected={'up','down','charm','strange','top','bottom','electron','muon','tau',
              'neutrino_mass_eigenstate_1','neutrino_mass_eigenstate_2','neutrino_mass_eigenstate_3','W','Z','Higgs','photon','gluon'}
    if (len(targets)!=17 or {r['species'] for r in targets}!=expected
            or any(r['physical_source_rest_mass_GeV'] is not None or r['native_source_prediction'] is not False for r in targets)):
        raise ValueError('all seventeen target species require explicit unresolved physical masses')
    scale=catalogue['single_clock_quark_test']
    if scale['one_scale_matches_both'] is not False or scale['common_scale_interval'] is not None:
        raise ValueError('the specified native u/d dictionary has no shared scale')
    return {'physical_mass_map_proved':False,
        'conditional_leptons':[dict(r,display_GeV=format(float(r['value_GeV']),'.14f' if r['species']=='electron' else '.13f')) for r in leptons],
        'lepton_scope':'The electron value is the empirical scale anchor. Muon and tau values multiply that anchor by the fixed finite-effect ratios. '
            'The map from those effects to relativistic rest masses is unproved. Displayed digits are fixed-model values; anchor-only uncertainty excludes model and attachment error.',
        'lepton_comparison':catalogue['lepton_comparison'],
        'selected_scalar':{'strengths':lowest['unit_ladder_strengths'],'canonical_strengths':lowest['vacuum_spectral_normalized_strengths'],
            'ratio':lowest['strong_to_weak_ratio'],'frequency':lowest['frequency'],
            'complement_leakage_norm':lowest['complement_leakage_norm'],
            'profiles':{'source_lowest':{'strengths':lowest['unit_ladder_strengths'],'ratio':lowest['strong_to_weak_ratio'],
                         'complement_leakage_norm':lowest['complement_leakage_norm']}}},
        'backreaction':{'modes':modes,'pointer':pointer,'reference':'Filled negative-energy sea, all fifteen native labels, scalar blank, retained idle conjugate reference.',
            'interaction_norm_squared':first['interaction_image_norm_squared'],
            'Ritz_relative_energy':first['two_vector_Ritz_energy_relative_to_sea'],
            'strict_lowering':first['strict_variational_bound']['ground_energy_lowering_at_least_exact'],
            'scope':'This is the first image under the full unit interaction. Its modal percentages are conditional on the declared pointer success; original success and failure probabilities remain in the record. The Ritz value is a variational estimate, not the exact interacting ground.'},
        'joined_source':{'CAR_modes':10290,'scalar_states':1373,'all_contacts':343,
            'finding':'One explicit finite Hamiltonian joins compact-defect hopping, all native unit Yukawa channels and the quantum scalar. Every occupation and all 343 scalar modes remain in its definition; the full spatial ground and charged poles are not evaluated.',
            'pulse_probability_bounds':pulse['receiver_probability_bounds_numeric'],'pulse_time':pulse['source_clock_time'],
            'pulse_scope':'A distinct three-site texture-off member executes all ninety fermion modes through complete H² and H³ actions. A quantum scalar pulse with its dual reference gives a strictly positive distant-pair record. The yes/no measurement retains its full complement; this is no rest-mass or light-cone derivation.'},
        'native_vertices':{'scalar_first_moment':normalization,'canonical_unit_contact':math.sqrt(normalization),
            'scalar_roots':13,'branch_weight':branch_weight,'no_operation_probability':noop,
            'finding':'The full thirty-mode local native ground supplies all 900 fermion-pair contact components and thirteen scalar target energies. The scalar moment is derived on that local state, independently of the lepton-only and free-blank controls.',
            'scope':'Three interaction channels and three color components do not count physical generations. The minimal neutral contact null directions and the optional sterile zero-energy spectator do not predict neutrino oscillations.'},
        'dispersion':{'cases':dispersion_rows,'scope':ds['claim']+'. These periodic quadratic controls use their own geometry and filled sea; all rows of each sampled Bloch block are retained, while the full momentum continuum and interacting joint source are not computed.'},
        'catalogue':{'rows':targets,'extra_modes':catalogue['extra_source_modes'],
            'scope':'Every Standard Model target type has an explicit entry. These seventeen labels do not close the physical catalogue or supply a gravity spectrum. The physical source rest-mass column is unresolved for all seventeen types. The adjacent numbers are empirically calibrated action parameters with their own conventions, including the optional neutrino extension; zero action parameters are not established zero physical masses.',
            'clock_test':'The specified record-zero uᶜ→up and dᶜ→down dictionary has disjoint GeV-per-source-energy intervals. One common scale cannot match both fixed calibrated targets. This excludes that dictionary, rather than assigning separate clocks.'}}


def extended_mass_projection(receipts):
    """Keep each added mass construction, preparation and calibration separate."""
    def interval(value):
        bounds=tuple(map(Fraction,value))
        if len(bounds)!=2 or bounds[0]>bounds[1]:raise ValueError('ordered rational enclosure required')
        return [float(x) for x in bounds]
    def complete(boxes,total=Fraction(1)):
        pairs=[tuple(map(Fraction,x)) for x in boxes]
        if any(len(x)!=2 or not 0<=x[0]<=x[1]<=1 for x in pairs) or not sum(x[0] for x in pairs)<=total<=sum(x[1] for x in pairs):
            raise ValueError('complete original probability intervals do not contain their total')
    c=receipts['lepton_compiler'];cs=c['scope'];rest=c['exact_limiting_rest_mass_instrument'];finite=c['finite_compiler_mass_readout']
    if (c['schema']!='oph.lepton_mass_compiler.v1'
            or cs['actual_lepton_effect_compiled_into_full_CAR_mass_coefficient'] is not True
            or cs['same_source_free_Dirac_limit_with_complete_archive_bound'] is not True
            or any(cs[k] is not False for k in ('finite_N_evolution_identified_with_exact_unitary_mass_spectrum','physical_Standard_Model_leptons_or_gauge_continuum_derived','programmed_phase_two_ninths_is_passive_source_prediction','neutral_background_is_selected_interacting_Higgs_VEV','quantum_archives_or_failure_records_discarded'))
            or len(rest['complete_records'])!=36 or rest['zero_probability_records']!=30
            or rest['full_16_state_CAR_intertwiner_energy_and_electric_charge_checked'] is not True
            or sum(Fraction(r['probability_exact']) for r in rest['complete_records'])!=1
            or len(c['same_source_kinetic_attachment']['all_eight_valleys'])!=8
            or any(len(r['complete_180_energy_rows'])!=180 for r in c['same_source_kinetic_attachment']['all_eight_valleys'])
            or c['existing_charged_family_frame_witness']['prepared_to_native_pair_factor_exact']!='5/4'
            or c['existing_charged_family_frame_witness']['admission']['literal_effect_to_existing_configured_action_frame_map'] is not True
            or c['same_source_kinetic_attachment']['canonical_physical_Higgs_kinetic_residue_derived'] is not False
            or c['electron_anchored_compiled_source']['observed_interacting_lepton_identification_proved'] is not False):
        raise ValueError('compiled free-mass bridge exceeds its verified source domain')
    compiler_rows=[]
    for row in c['electron_anchored_compiled_source']['rows']:
        compiler_rows.append({'label':row['species'],'character':row['character'],
            'source_mass':float(row['compiled_source_rest_energy']),'GeV':float(row['electron_anchored_GeV']),
            'display_GeV':format(float(row['electron_anchored_GeV']),'.14g')})
    if ([r['label'] for r in compiler_rows]!=['electron','muon','tau']
            or [r['character'] for r in compiler_rows]!=[1,2,0]
            or any(not math.isclose(r['GeV'],r['source_mass']*float(c['electron_anchored_compiled_source']['source_energy_unit_GeV']),rel_tol=2e-13) for r in compiler_rows)
            or not math.isclose(compiler_rows[0]['GeV'],float(Fraction(finite['electron_anchor_GeV_exact'])),rel_tol=1e-14)):
        raise ValueError('compiled masses lost the single electron anchor or family assignment')
    compiler_records=[]
    for row in rest['complete_records']:
        if Fraction(row['probability_exact']) and row['native_electric_charge']-row['reservoir_out']+row['idle_dual_charge_reference_occupation']!=0:
            raise ValueError('source, reservoir and reference charge accounting differs')
        compiler_records.append({**row,'probability':float(Fraction(row['probability_exact']))})
    epsilon=Fraction(finite['compiler']['complete_unhalved_trace_error_exact'])
    if (finite['compiler']['vacuum_postselection'] is not False or finite['finite_shot_noise_included'] is not False
            or finite['physical_model_error_included'] is not False
            or Fraction(finite['complete_channel_error_to_energy_error_exact'])>=Fraction(finite['certified_denominator_floor_exact'])):
        raise ValueError('finite compiler precision does not resolve its denominator')
    compiler={'rows':compiler_rows,'records':compiler_records,
        'steps':str(finite['compiler']['steps']),'trace_error':float(epsilon),
        'energy_error':float(Fraction(finite['complete_channel_error_to_energy_error_exact'])),
        'enlarged_modes_per_site':c['full_CAR_operator']['enlarged_modes_per_site'],
        'ratio_intervals':[{**r,'ratio_interval':interval(r['ratio_interval']),'electron_anchored_GeV_interval':interval(r['electron_anchored_GeV_interval'])} for r in finite['ratio_bounds']],
        'source_energy_unit_GeV':float(c['electron_anchored_compiled_source']['source_energy_unit_GeV']),
        'scope':'The literal analyzer is compiled into a declared free Dirac source, with m=e at background norm 1. The same source supplies the rest-frequency readout; one-fermion addition/removal reads m and a failed probe can read 2m. The fixed phase 2/9, background, fresh ancillary vacuum and pulse clock are supplied architecture. Eight valleys and 39 zero internal coefficients remain. Observed interacting leptons, the weak scale and a canonically normalized physical Higgs coupling are unproved.',
        'precision_scope':'The finite-round bound uses committed classical vacuum/nonvacuum flags and retains quantum coherence within each history. These are exact probability-law bounds, without finite-shot, anchor or physical-model uncertainty. The enormous round count is a resource formula, not an executed run at that precision.'}
    density=receipts['scalar_density'];dr=density['complete_occupation_energy_records']
    if (density['schema']!='oph.native_scalar_density_pole.v1' or len(dr)!=6
            or density['scope']['physical_rest_mass_GeV'] is not None
            or density['scope']['observed_Higgs_identification'] is not False
            or density['scope']['propagation_calculated'] is not False
            or density['outside_pair_weight_exact']!='0'):
        raise ValueError('neutral density pole is not an observed Higgs mass')
    complete([r['original_probability']['interval'] for r in dr])
    scalar_density={'gap':interval(density['positive_pole_source_energy']['interval']),
        'weight':interval(density['connected_positive_pole_weight']['interval']),
        'moment':interval(density['retarded_first_moment']['interval']),
        'records':[{'label':r['occupation_outcome']+' / '+r['energy_outcome'],
            'probability':interval(r['original_probability']['interval']),
            'energy':None if r['source_energy_transfer'] is None else interval(r['source_energy_transfer']['interval'])} for r in dr],
        'scope':'An exact neutral occupation-density pole of the interacting one-cell source. Its normalized response has unit oscillator residue. No propagation or physical Higgs mass is assigned, and it is distinct from the elementary charged scalar response.'}
    q=receipts['quark_resolution'];g=receipts['quark_dressing']
    if (q['schema']!='oph.quark_flavour_resolution.v1' or q['scope']['physical_quark_rest_masses_derived'] is not False
            or q['scope']['one_scale_fixed_target_fit_obtained'] is not False
            or g['schema']!='oph.quark_gauge_dressing.v1' or g['scope']['positive_Gauss_electric_energy_derived'] is not True
            or g['scope']['physical_rest_mass_or_GeV_output'] is not False
            or g['scope']['compact_343_internal_sites_locally_gauged'] is not False):
        raise ValueError('quark response controls exceed their finite source domain')
    mechanisms=[]
    for name,m in q['mechanisms'].items():
        test=m['one_scale_test'];channels=[]
        if test['one_scale_matches_frozen_two_targets'] is not False or test['dictionary_is_physical_mass_identification'] is not False:
            raise ValueError('the frozen quark scale obstruction was changed')
        for label,ch in m['channels'].items():
            records=ch['complete_records'];failure=Fraction(ch['failure_probability'])
            if failure!=Fraction(1,2) or ch['per_success_conditioning_applied'] is not False:raise ValueError('quark failure weight lost')
            complete([r['original_probability_interval'] for r in records],1-failure)
            channels.append({'label':label,'failure_probability':float(failure),
                'records':[{'label':str(r['native_energy_record'])+' / '+r['branch'],
                    'probability':interval(r['original_probability_interval']),
                    'source_energy':interval(r['source_or_relational_excitation_interval']),
                    'total_energy':interval(r['total_source_plus_reference_excitation_interval'])} for r in records]})
        mechanisms.append({'key':name,'label':name.replace('_',' '),'law':m['law'],'ratio':test['ratio_numeric'],
            'u_anchored_d_GeV':test['u_anchored_d_GeV_numeric'],'common_scale_matches':False,'channels':channels})
    dressed=[]
    for label,row in g['literal_one_cell_complete_energy_example']['channels'].items():
        complete([r['original_probability_interval'] for r in row['complete_energy_records']],Fraction(1,2))
        if row['pump_failure']!='1/2' or row['parent_reference_cost_four_imported'] is not False:raise ValueError('electric dressing reference was changed')
        dressed.append({'label':label,'charge':row['source_hypercharge_after_removal'],
            'electric_energy':float(Fraction(row['positive_electric_energy'])),'failure_probability':.5,
            'records':[{'energy':interval(r['energy_transfer_interval']),'probability':interval(r['original_probability_interval'])} for r in row['complete_energy_records']]})
    quarks={'mechanisms':mechanisms,'dressed':dressed,
        'target_ratio':float(Fraction(next(iter(q['mechanisms'].values()))['one_scale_test']['frozen_target_ratio'])),
        'electric_shift_difference':float(Fraction(g['literal_one_cell_complete_energy_example']['uc_minus_dc_corresponding_line_shift'])),
        'scope':'Shared unit-coefficient constructions split complete up/down response measures while preserving the stated current symmetries. None of the four frozen record dictionaries fits both calibrated running targets with one common scale. The positive Gauss-law energy is a geometry-dependent electrostatic dressing of one charge island; it supplies no quark rest mass, transverse photon or 343-site local gauge theory.'}
    n=receipts['neutrino_response'];ns=n['scope'];neutral_controls=[]
    if (n['schema']!='oph.neutrino_mass_response.v1' or ns['neutrino_rest_mass_or_Lorentz_limit_proved'] is not False
            or ns['three_observed_generations_or_mixing_matrix_derived'] is not False
            or ns['full32_all_unit_ground_or_spatial_neutral_poles_computed'] is not False):
        raise ValueError('neutral control gaps were promoted to neutrino rest masses')
    for name,key,energies in [('Dirac','complete_unit_Dirac_lepton_sterile_control',12),('Majorana option','complete_unit_sterile_Majorana_lepton_control',35)]:
        control=n[key];prepared=control['complete_original_preparation_energy_records'];probes=[]
        if (control['full_control_carrier_dimension']!=1280 or control['full_physical_Gauss_dimension']!=80
                or len(prepared)!=energies or sum(Fraction(r['original_preparation_probability']) for r in prepared)!=1
                or control['ground_original_preparation_probability']!='1/80'
                or control['same_scalar_ground_or_spectrum_transferred_to_full32_all_unit_source'] is not False):
            raise ValueError('complete neutral ground preparation differs')
        for label,probe in control['complete_neutral_probe_records'].items():
            records=[{'label':'Preparation / energy '+str(i+1),'energy':interval(r['energy_interval']),
                'energy_kind':'source energy','probability':[float(Fraction(r['original_preparation_probability']))]*2} for i,r in enumerate(control['terminal_preparation_records_before_ground_probe_refinement'])]
            boxes=[]
            for setting in probe['four_settings']:
                if len(setting['complete_energy_records'])!=energies or setting['outside_complete_physical_target_probability']!='0':raise ValueError('neutral target rows lost')
                prefix=setting['operation']+' / spin '+str(setting['spin'])
                for i,r in enumerate(setting['complete_energy_records']):
                    boxes.append(r['complete_preparation_joint_probability_interval'])
                    records.append({'label':prefix+' / energy '+str(i),'energy':interval(r['energy_transfer_interval']),
                        'energy_kind':'gap','probability':interval(r['complete_preparation_joint_probability_interval'])})
                failure=setting['joint_complete_preparation_failure_probability_interval'];boxes.append(failure)
                records.extend([{'label':prefix+' / failure','energy':None,'energy_kind':'not measured','probability':interval(failure)},
                    {'label':prefix+' / outside','energy':None,'energy_kind':'zero outside','probability':[0.,0.]}])
            complete(boxes,Fraction(1,80))
            if len(records)!=({12:67,35:182}[energies]):raise ValueError('neutral preparation tree was not fully refined')
            probes.append({'label':label.replace('_',' '),'records':records})
        neutral_controls.append({'label':name,'ground':interval(control['ground_energy_interval']),'energy_count':energies,'probes':probes})
    nc=n['conditional_one_scale_GeV_comparison'];cal=nc['comparison_calibration']
    if nc['physical_rest_pole_attachment_proved'] is not False or cal['independent_mass_prediction'] is not False or cal['active_or_sterile_species_assigned_to_either_value'] is not False:
        raise ValueError('neutral empirical scale became a species prediction')
    neutrinos={'controls':neutral_controls,'conditional_GeV':cal['conditional_GeV_values_numeric'],
        'scale_role':cal['role'],'scope':'These coupled lepton/sterile controls recompute the complete 80-state Gauss ground inside a 1,280-state carrier. The Dirac option has visible gaps 1 and 5; the Majorana option has 12 visible neutral roots among 35 target energies. All preparation failures, probe failures and zero rows remain. They are separate from the full 32-mode all-unit and spatial sources. No observed flavor, mixing matrix or neutrino rest-mass assignment follows.',
        'clock':'exp(-it H_control) in source units; the optional GeV unit uses one empirical oscillation splitting and assigns neither value to a species.'}
    p=receipts['conditional_spectrum'];flags=p['acceptance_flags'];inventory=p['mode_inventory']
    if (p['schema']!='oph.conditional_particle_spectrum.v1' or len(p['elementary_particles'])!=17
            or flags['conditional_construction_acceptance'] is not True
            or flags['physical_target_acceptance'] is not False
            or flags['all_yukawas_weak_background_and_gauge_parameters_are_empirical_inputs'] is not True
            or flags['common_source_native_clock_to_GeV_derived'] is not False
            or len(inventory['fermion_modes'])!=180 or len(inventory['boson_modes'])!=56
            or any(r['native_source_prediction'] is not False for r in p['elementary_particles'])):
        raise ValueError('conditional quadratic spectrum lost its empirical input boundary')
    if (p['fermion_readout']['zero_outside_projector_retained_per_pointer'] is not True
            or any(r['other_source_energy_projectors_probability']!='0' for r in p['fermion_readout']['records'])
            or p['boson_readout']['source_Hilbert_dimension']!=1653
            or p['boson_readout']['all_column_count']!=1653):
        raise ValueError('quadratic outside projectors or capped carrier were changed')
    readouts=[]
    for label,key,count in [('Fermions','fermion_readout',84),('Bosons','boson_readout',375),('Neutrino flavor','neutrino_flavour_readout',96)]:
        rows=list(p[key]['records'])
        if key=='neutrino_flavour_readout':
            if len(rows)!=72 or p[key]['outside_energy_projector_probability_per_pointer']!='0':
                raise ValueError('neutral-flavor outside outcome differs')
            pointers={(r['flavour'],r['orientation'],tuple(r['momentum_GeV']),r['pointer']):r for r in rows}
            if len(pointers)!=24:raise ValueError('neutral-flavor pointer alphabet differs')
            rows.extend({**r,'mass_eigenstate':'outside','source_energy_GeV':None,'probability':{'exact':'0','numeric':0.},'outside':True} for r in pointers.values())
        if len(rows)!=count or not math.isclose(sum(r['probability']['numeric'] for r in rows),1,abs_tol=2e-12):
            raise ValueError('quadratic original records are incomplete')
        if any(not math.isfinite(r['probability']['numeric']) or not 0<=r['probability']['numeric']<=1 for r in rows):
            raise ValueError('quadratic record probabilities are invalid')
        readouts.append({'label':label,'records':rows,'reference_cost_GeV':p[key]['reference_nonblank_energy_GeV']})
    pion=receipts['pion']
    if (pion['schema']!='oph.pion_mass_readout.v1' or len(pion['particles'])!=3
            or any(r['physical_source_derived_mass_GeV'] is not None for r in pion['particles'])
            or pion['calibrations']['anchor_and_model_uncertainty_GeV'] is not None
            or pion['pion_charged_neutral_splitting']['source_GeV']!=0
            or any(r['physical_source_derived_mass_GeV'] is not None or r['shares_calibrated_quadratic_elementary_source'] is not False for r in p['composite_controls'])):
        raise ValueError('conditional composite conversions became physical source masses')
    return {'compiler':compiler,'scalar_density':scalar_density,'quarks':quarks,'neutrinos':neutrinos,
        'quadratic':{'targets':p['elementary_particles'],'readouts':readouts,
            'fermion_modes':180,'boson_modes':56,'extra_candidates':p['extra_source_candidates'],
            'clock':p['source_state_reference_clock']['clock'],
            'scope':'One declared quadratic action gives conditional GeV coefficients for 17 Standard Model target types, with 180 fermion modes and 56 physical boson modes at two momenta. All Yukawas, the weak background and gauge parameters are empirical inputs; the optional neutrino action also uses a calibrated hierarchy and mixing prescription. This recovers supplied action parameters and supplies complete detector records, without deriving interacting poles, confinement or a physical source clock.'},
        'composites':{'rows':p['composite_controls'],'pion_rows':pion['particles'],'calibrations':pion['calibrations'],
            'empirical_inputs':pion['empirical_inputs'],'splitting':pion['pion_charged_neutral_splitting'],
            'scope':'This diagonal-fit control assigns the pion triplet, proton/neutron and rho labels using the archived quenched Wilson correlators. The correlated-covariance fit is displayed separately above. Rho and string anchors give different conditional GeV conversions. The pion/rho ratio is a tuning input; zero fit error at that calibrated point is not zero physical uncertainty. Quark loops, volume/continuum control, electromagnetic splitting and a native source/clock transfer are outside these fits.'}}


def projection(receipts, sources):
    lepton, epochs, symmetry, hadron, crossover, repair = [receipts[k] for k in ('lepton','epochs','symmetry','hadron','crossover','repair')]
    comparison = receipts['lepton_comparison']
    species = receipts['species']
    budget = receipts['crossover_budget']
    if species['physical_species_claim'] is not False or species['thermal_benchmark']['simulated_temperature'] is not False:
        raise ValueError('species inference exceeds its code-menu comparison domain')
    ew = budget['rows']['declared']
    if ew['confidence_coverage_certified'] is not False or ew['nonlinear_sampling_distribution_identified'] is not False:
        raise ValueError('crossover covariance range is not a confidence interval')
    sd = ew['independent_run_sets']['sd_range_GeV']
    unrestricted = ew['unrestricted_cross_set_covariance']['sd_range_GeV']
    species_cases = {key: {'label': label, 'components': len(species['cases'][key]['components']),
        'rank': species['cases'][key]['rank'], 'nullity': species['cases'][key]['nullity'],
        'family_label_values': species['cases'][key]['minimal_extra_labels']['family_totals']['minimum_alphabet_size'],
        'all_label_values': species['cases'][key]['minimal_extra_labels']['all_selected_aggregates']['minimum_alphabet_size']}
        for key,label in [('full32','Full 32-component fermion menu'),('restricted30','Restricted 30-component fermion menu'),
                          ('full32_bosons','Full menu plus Higgs and gauge components'),('restricted30_bosons','Restricted menu plus Higgs and gauge components')]}
    thermal_rows = []
    for name in ('quark','lepton','higgs','gauge'):
        row = {'label': name.capitalize()}
        for kind in ('number','energy'):
            row[kind] = float(Fraction(species['thermal_benchmark']['quantities'][kind]['aggregate_fractions'][name]))
        thermal_rows.append(row)
    if any(abs(sum(row[kind] for row in thermal_rows)-1)>1e-12 for kind in ('number','energy')):
        raise ValueError('thermal comparison normalization differs')
    if (comparison['architecture']['physical_pole_mass_map_proved'] is not False
            or comparison['exposure']['parameters_fitted_in_this_comparison']
            or comparison['exposure']['target_selected_round_count'] is not False
            or comparison['uncertainty_contract']['joint_chi_squared'] is not None):
        raise ValueError('lepton comparison exceeds its no-fit uncertainty contract')
    shape = lepton['viewer_projection']['sensitivity']
    native = symmetry['native_paired_history']
    if not symmetry['local']['every_branch_conjugates'] or not symmetry['abundance_kernel']['equivariant_kernel']:
        raise ValueError('missing conjugation premises')
    if repair['exhaustive_native_branch_checks'] != 3960 or repair['working_source_loads_exposed_to_controller'] is not False:
        raise ValueError('record readout source domain differs')
    contrast = hadron['production']['B']['chiral']['joint']['contrasts']['over_sqrt_sigma']
    cutoff = crossover['finite_size_cutoff']['matched_size_cutoff']['T_max']
    linear = cutoff['variants']['linear']
    memory = repair['memory_at_one_percent_horizon']
    rows = []
    for row in epochs['trajectory']:
        shares = [r['value'] for r in row['class_shares']]
        if abs(sum(shares)-1) > 1e-12:
            raise ValueError('population projection is not normalized')
        rows.append({'x': row['attempts'], 'p0': shares[0], 'p1': shares[1]+shares[5],
                     'p2': shares[2]+shares[4], 'p3': shares[3], 'energy': row['mean_energy']['value']})
    mass_rows = []
    for key, label in [('mrho_over_sqrtsigma_chiral','mρ / √σ'),
                       ('mN_over_sqrtsigma_chiral','mN / √σ'), ('mN_over_mrho_chiral','mN / mρ')]:
        row = hadron['headline'][key]
        mass_rows.append(dict(label=label, value=row['value'], statistical=row['stat'], systematic=row['syst']))
    return {
        'schema': 'oph.viewer.finite_results.v1', 'sources': sources,
        'joined_defect': joined_projection(receipts),
        'joint_measurements': project_joint(receipts),
        'current_measurements': project_current(receipts),
        'mass_sources': extended_mass_projection(receipts),
        'yukawa': yukawa_projection(receipts),
        'defect_response': defect_projection(receipts),
        'calibrated_quarks': calibrated_quark_projection(receipts['calibrated_quarks']),
        'lepton': {'finding':
            f"The squared-eigenvalue ratios are μ/e = {float(shape['muon_over_electron']):.6f} and "
            f"τ/e = {float(shape['tau_over_electron']):.6f}. The comparison-only muon residual is "
            f"+{float(comparison['muon']['relative_residual_ppm']):.5f} ppm against CODATA 2022, "
            f"or {float(comparison['muon']['reference_only_standardized_discrepancy']):.2f} experimental standard uncertainties. "
            f"The PDG 2024 tau comparison is {float(comparison['tau']['relative_residual_ppm']):.5f} ppm high "
            f"(about {float(comparison['tau']['reference_only_standardized_discrepancy_range'][0]):.3f} experimental standard uncertainties). "
            'These are reference-only discrepancies, with no joint likelihood or invented theory error. Two shape parameters '
            'have a nonsingular ratio Jacobian; common normalization cancels. Independence of the two '
            'prepared cells fixes the phase 2/9. No phase or round count is fitted here. The mass-read '
            'double-load effect has trace 5/18, a common factor 5/4 above the separate native-pair effect; '
            'their ratios coincide. A physical pole-mass interpretation is an additional premise.'},
        'epochs': {'rows': rows,
            'description': 'A closed triangular cell has three bounded loads and two opposite face classes. '
                'Its 1,296-state kernel executes the native repair and acceptance rule, with all 7,776 '
                'attempted records retained. This is a declared finite cell, with no abundance transfer to the full federation.',
            'finding': f"For independent uniform initial loads in 0–5 and initial flux zero, the exact persistent occupied-face share is {epochs['persistent_occupied_face_share']['exact_limit']['exact']} "
                f"({100*epochs['persistent_occupied_face_share']['exact_limit']['value']:.8f}%). The 128-attempt "
                f"bracket width is approximately {epochs['persistent_occupied_face_share']['width']['value']:.4g}. "
                'For every initial distribution, unresolved probability is at most 25^(−floor(n/32)). '
                'The cost is nonincreasing on every branch; it has no physical temperature or energy calibration.'},
        'species': {'cases': species_cases, 'thermal_rows': thermal_rows,
            'finding': 'For a census of declared code quanta, q = c₁+c₂+c₄+c₅ identifies the quark-labelled total. '
                'With Higgs and gauge components admitted, the lepton total can be anywhere from 0 to c₀+c₃. '
                'A fermion/boson bit within classes 0 and 3 resolves the aggregate family totals. Three label '
                'values resolve the finer up/down and charged/neutral aggregates. These are minimum information '
                'requirements; no particle decoder for native flux-face records is implemented.',
            'thermal_scope': 'Comparison only: a massless ideal Standard Model gas at 1 TeV, a common equilibrium temperature, '
                'zero chemical potentials, three active-neutrino families and no populated right-handed neutrinos. '
                'Counts include antiparticles, physical helicities and all gauge/Higgs components. Number fractions weight '
                'fermions by 3/4; energy fractions use 7/8. Their fermion-only quark/lepton split is 80%/20%. '
                'Uniform full-code counting gives 75%/25% instead. Interactions, masses and thermal-mass corrections are omitted. '
                'No early-Universe abundance match is inferred from the native runs.'},
        'symmetry': {'rows': [{'x': r['attempts'], 'single': r['single_history_odd_counts'][0],
                              'paired': r['paired_mean_odd_counts'][0]} for r in native['curve']],
            'finding': f"The solid curve is the class-1 minus class-5 count in one native history on {native['faces']} faces. "
                'The dashed curve is its exact paired mean with the conjugated history. The theorem covers '
                'all finite attempt counts under the stated symmetry premises.'},
        'hadron': {'rows': mass_rows, 'finding':
            f"In the archived diagonal-fit control, the paired contrast (mN − mρ)/√σ is {contrast['value']:.6f} ± {contrast['stat']:.6f} statistically. "
            f"Discarding covariance gives {contrast['independent_stat_control']:.6f} for that error. "
            'The common scale cancels from mN/mρ in every replica. These one-spacing quenched results '
            'do not bound quenching, volume or continuum effects; the contrast has no fit-systematic allowance.'},
        'crossover': {'finding': f"The declared-chain crossover central value is {ew['T_c_GeV']:.4f} GeV. "
            f"Missing shared-reference covariance leaves a compatible statistical SD range [{sd[0]:.5f}, {sd[1]:.5f}] GeV "
            f"under independent run sets, or [{unrestricted[0]:.5f}, {unrestricted[1]:.5f}] GeV without that premise. "
            f"These linearized SD ranges are not confidence intervals. The declared reduction allowance is {ew['reduction_allowance_GeV']:.4f} GeV; "
            'no probability law is supplied for that allowance or combined Gaussian significance. '
            f"At matched physical size Lg₃² = 8, the linear cutoff fit gives "
            f"{linear['value']:.4f} ± {linear['stat']:.4f} GeV statistically. The finite-design displacement "
            f"across fit variants reaches {cutoff['sensitivity_envelope']:.4f} GeV. A three-point linear-plus-quadratic "
            'fit has zero residual degrees of freedom. This sensitivity is separate from the declared reduction '
            'uncertainty and is not a controlled continuum or infinite-volume error bound.'},
        'repair': {'finding': f"A known binary preparation and complete addressed current records reconstruct "
            f"the pair distance using a seven-bit tracked-state index. Exact quotient powers reach 1% total-variation "
            f"accuracy after {repair['one_percent_relaxation']['attempts']} attempts for every initial distance law. "
            f"The bounded controller uses at most {memory['retained_register_bits_upper']} retained logical bits, "
            f"or {memory['total_including_incoming_packet_bits_upper']} including the incoming packet. "
            'Missing, incompatible or out-of-order records halt inference. The source halts at tape capacity. '
            'Preparation, scheduler, program storage and physical implementation are explicit separate inputs.'},
    }


def homepage_highlights(html, current):
    """Render compact source-bound numbers above the finite constructions, without fetching large receipts."""
    n=current['neutrino'];q=next(r for r in current['bare_quarks'] if r['key']=='rho')
    tuned=next(r for r in q['rows'] if r['label']=='ratio_tuned')
    begin='<!-- oph-current-highlights:start -->';end='<!-- oph-current-highlights:end -->'
    if begin in html:
        if html.count(begin)!=1 or html.count(end)!=1:raise ValueError('ambiguous home highlights')
        first=html.index(begin);last=html.index(end,first)+len(end);html=html[:first]+html[last:]
    section=f"""{begin}
<section id="current-highlights" aria-label="Conditional finite results" style="max-width:1420px;margin:24px auto 0;padding:24px;border:1px solid #355363;border-radius:16px;background:#101d2d;color:#dce8f5">
<p style="margin:0 0 8px;color:#75dcca;font-size:12px;letter-spacing:.08em">CONDITIONAL PARTICLE READOUTS · 50 SOURCE-BOUND RECEIPTS</p>
<h2 style="margin:0 0 16px;font-size:clamp(22px,3vw,31px)">Finite measurements, explicit calibration</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:20px">
<div><h3 style="margin:0 0 8px;font-size:15px">Conditional neutrino observables</h3><p style="font-size:13px;line-height:1.7;margin:0">mᵦ = {n['beta']:.7g} GeV<br>mₑₑ ∈ [{n['envelope'][0]:.7g}, {n['envelope'][1]:.7g}] GeV</p><p style="font-size:12px;color:#a9bbd1">Supplied mass and mixing inputs; full Majorana phase envelope. <a style="color:#75dcca" href="finite_results.html#neutrino-observables">Explore the phase</a></p></div>
<div><h3 style="margin:0 0 8px;font-size:15px">Bare Wilson, not identified quark masses</h3><p style="font-size:13px;line-height:1.7;margin:0">Ratio-tuned: {tuned['GeV']:.7g} GeV<br>± {tuned['stat']:.5g} statistical<br>± {tuned['fit']:.5g} fit sensitivity</p><p style="font-size:12px;color:#a9bbd1">Conditional rho-anchored action coordinate; no total physical error. <a style="color:#75dcca" href="finite_results.html#paired-quarks">Compare all scale choices</a></p></div>
<div><h3 style="margin:0 0 8px;font-size:15px">Finite-time mass spectroscopy</h3><p style="font-size:13px;line-height:1.7;margin:0">1 reusable pointer qubit + 5 bits<br>8,010 complete records<br>≥65/72 ideal coverage on one-excitation inputs</p><p style="font-size:12px;color:#a9bbd1">Calibrated source; neutrino species remain unresolved. <a style="color:#75dcca" href="finite_results.html#finite-spectroscopy">Inspect every phase bin</a></p></div>
</div><p style="margin:12px 0 0;font-size:12px"><a style="color:#75dcca" href="finite_results.html#current-results">Ten finite constructions, complete proofs and downloadable receipts →</a></p></section>
{end}"""
    anchor='<div id="constructions-host"></div>'       # the page "Finite constructions"; the Journey page carries no result block
    if html.count(anchor)!=1:raise ValueError('expected one constructions host')
    return html.replace(anchor,section+anchor)


def sync(site, *, rer=RER, check=False):
    site, rer = Path(site), Path(rer)
    receipts, sources, writes = {}, [], {}
    for key, (relative, label) in SOURCES.items():
        path = rer / 'model' / relative
        receipts[key] = load_receipt(path, rer)
        raw = path.read_bytes()
        sources.append({'file': key+'.json', 'label': label, 'path': 'model/'+relative,
                        'sha256': hashlib.sha256(raw).hexdigest()})
        writes['finite/'+key+'.json'] = raw
    summary=projection(receipts,sources)
    writes['finite/results.json'] = (json.dumps(summary, indent=2, ensure_ascii=False)+'\n').encode()
    if (site/'index.html').exists():
        writes['index.html']=homepage_highlights((site/'index.html').read_text(),summary['current_measurements']).encode()
    for name in ('finite_results.html', 'finite_results.css', 'finite_results.mjs'):
        writes[name] = (EXTRA / name).read_bytes()
    links = (site / 'links.js').read_text()
    row = "  ['Finite predictions and error bounds', './finite_results.html'],\n"
    if row not in links:
        anchor = 'export const PAPERS = [\n'
        if links.count(anchor) != 1:
            raise ValueError('expected one papers-menu anchor')
        links = links.replace(anchor, anchor+row)
    writes['links.js'] = links.encode()
    for name, raw in writes.items():
        target = site / name
        if check:
            if not target.exists() or target.read_bytes() != raw:
                raise ValueError(f'stale finite-result projection: {target}')
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(raw)
    return sorted(writes)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, default=ROOT/'site')
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    print('\n'.join(sync(args.site, check=args.check)))
