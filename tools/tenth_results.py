"""Source-bound particle masses, weak records and spatial controls."""
from fractions import Fraction as F


def values(xs):return [float(F(x)) for x in xs]


def project(receipts):
    m=receipts['mass_catalogue'];w=receipts['lepton_widths'];b=receipts['beta_angular']
    n=receipts['spin_gradient_nuclei'];em=receipts['common_electromagnetism'];boost=receipts['boosted_records']
    matter=receipts['neutrino_matter'];valley=receipts['single_valley_leptons']
    spec=receipts['rest_spectroscopy'];colour=receipts['colour_string']
    assert all(r['a_single_interacting_baryon_mass_inferred_from_the_expectation'] is False for r in spec['members'])
    assert colour['exact_native_transfer_execution']['coloured_complement_identity_fails_and_is_retained'] is True
    assert colour['unit_elimination_control']['simultaneous_benchmark_match_possible_with_nonnegative_adjusted_U'] is False
    assert m['source_joins']['all_sources_identified_as_one_interacting_theory'] is False
    assert m['spectrum_accounting']['physical_quark_poles_supplied'] is False
    assert valley['complete_source_spectrum']['minimum_count_per_charged_family']==[1,1,1]
    assert w['held_out_tau_mu_over_e']['used_in_parameter_selection'] is False
    assert w['muon_normalization_comparison']['independent_prediction'] is False
    assert w['total_tau_width_or_lifetime_claimed'] is False
    assert b['physical_weak_clock_or_lifetime_claimed'] is False
    assert em['architecture']['transverse_photons_or_magnetic_loops'] is False
    assert boost['theorem']['photon_coupling_or_full_interacting_Lorentz_covariance'] is False
    selected=next(r for r in n['complete_nuclear_spectrum']['channels'] if (r['spin'],r['isospin'],r['cell_parity'])==(1,0,1))
    partner=next(r for r in n['complete_nuclear_spectrum']['channels'] if (r['spin'],r['isospin'],r['cell_parity'])==(0,0,-1))
    assert selected['strictly_bound_in_this_native_channel'] and partner['above_this_channel_breakup_threshold']
    return {
        'task_count':10,
        'leptons':{'rows':[r for r in m['native_and_calibrated_Dirac_masses'] if r['particle'] in ('electron','muon','tau')],
            'minima_per_family':[1,1,1],'neutral_zero_modes_retained':True},
        'neutrinos':{'rows':[r for r in m['native_and_calibrated_Dirac_masses'] if r['particle'].startswith('nu_')],
            'matter_resonance_GeV':matter['two_flavour_atmospheric_resonance_scale_GeV'],
            'matter_records':[{'antineutrino':r['antineutrino'],'momentum_GeV':r['momentum_GeV'],
                'matter_e_probability':r['complete_finite_medium_records']['e'],
                'vacuum_e_probability':r['complete_vacuum_records']['e'],
                'TV_bound':r['uniform_complete_channel_TV_bound']} for r in matter['finite_medium_executions']]},
        'strong':{'mass_fits':[{'name':r['state'],'target_GeV':float(F(r['target_GeV'])),'interval_GeV':values(r['energy_GeV_interval'])} for r in n['three_hadron_mass_calibrations']],
            'gA_interval':values(n['native_axial_ground']['gA_interval']),
            'deuteron_energy_GeV_interval':values(selected['ground_GeV_interval']),
            'deuteron_binding_MeV_interval':[1000*x for x in values(selected['binding_GeV_interval'])],
            'binding_target_MeV':1000*float(F(n['input_ancestry']['deuteron_binding_calibration_target_GeV'])),
            'partner_above_threshold_MeV_interval':[-1000*x for x in reversed(values(partner['binding_GeV_interval']))],
            'complete_singlet_dimension':n['complete_nuclear_spectrum']['complete_singlet_dimension'],
            'unassigned_bound_channels':n['unassigned_bound_native_channels'],
            'quadrupole_graph_squared_interval':values(n['selected_nuclear_record']['quadrupole_graph_squared_interval']),
            'physical_length_calibration':n['selected_nuclear_record']['physical_length_calibration']},
        'widths':{'ratio':w['held_out_tau_mu_over_e'],
            'rows':[{'parent_family':r['parent_family'],'daughter_family':r['daughter_family'],
                'width_GeV':r['massive_neutral_width_GeV_diagnostic'],
                'characteristic_seconds':r['hbar_over_width_seconds'],
                'windows':r['calibrated_massive_finite_lifetime_windows']} for r in w['all_leptonic_channels']],
            'muon_normalization_comparison':w['muon_normalization_comparison'],'total_tau_lifetime_claimed':False},
        'beta':{'coefficients':b['allowed_point_contact_angular_coefficients'],
            'cubes':[r['cube_side'] for r in b['finite_cube_records']],
            'parity_upper':max(r['exact_full_Fock_parity_upper'] for r in b['finite_cube_records']),
            'endpoint_GeV':b['strong_free_channel_endpoint_GeV'],
            'physical_lifetime':False},
        'electromagnetism':{'charged_threshold_GeV':float(F(em['positivity']['exact_charge_plus_and_minus_one_threshold_GeV'])),
            'bare_self_energy_shift_GeV':float(F(em['same_source_charged_rest_branches'][0]['bare_electric_rest_GeV_exact'])-F(em['same_source_charged_rest_branches'][0]['normalized_rest_GeV_exact'])),
            'baryon_rows':[{'name':r['assigned_channel'],'trial_mean_GeV':r['mean_energy_GeV_diagnostic'],
                'electric_mean_shift_GeV':r['electric_mean_shift_GeV_diagnostic'],
                'window_probability_lower':float(F(r['conditional_inside_probability_lower_exact']))}for r in em['changed_baryon_energy_records']['rows']],
            'transverse_photons':False},
        'boost':{'rows':boost['boosted_energy_and_velocity_checks'],
            'packet_records':[{'side':r['side'],'TV':r['same_input_continuum_complete_record_TV_diagnostic'],
                'TV_upper':float(F(r['continuum_record_TV_upper_exact']))} for r in boost['portable_Taichi_execution']['rows'] if r['case']=='electron_packet'],
            'full_interacting_Lorentz_covariance':False,'official_award':False},
        'catalogue':{'comparison_rows':m['complete_calibrated_comparison_catalogue'],
            'source_joins':m['source_joins'],'accounting':m['spectrum_accounting']},
        'spectroscopy':{'lines':[{'charge':r['electric_charge'],'rows':[{'energy_GeV_interval':values(x['conditional_energy_GeV_interval']),'probability':x['conditional_probability_diagnostic']} for x in r['lines']]} for r in spec['significant_native_lines']],
            'pointer_bin_GeV':float(F(spec['members'][0]['operational_pointer_records'][-1]['energy_bin_width_GeV'])),
            'pointer_dimension':spec['members'][0]['operational_pointer_records'][-1]['register_dimension'],
            'scope':spec['scope']},
        'colour_string':{'slope_GeV_per_cell':float(F(colour['Gauss_law_source']['slope_GeV_per_cell'])),
            'slope_source_exact':colour['Gauss_law_source']['slope_source_units_per_cell'],
            'chains':[{'sites':r['sites'],'energy_GeV_interval':values(r['selected_ground_GeV_interval']),'gA':r['native_gA_diagnostic']} for r in colour['fixed_source_chains']],
            'scope':colour['scope'],'physical_length_calibrated':False,
            'joint_length_tension_upper':colour['unit_elimination_control']['any_positivity_preserving_kappa_string_tension_upper_diagnostic'],
            'joint_length_fixed_tension_interval':colour['unit_elimination_control']['fixed_kappa_string_tension_at_that_length_GeV_per_fm_interval_diagnostic'],
            'simultaneous_quadrupole_tension_match':False},
    }
