export const JOURNEY_RESULTS = {
  "schema": "oph.journey_verified_results.v1",
  "date": "2026-11-12",
  "source_repository": "https://github.com/FloatingPragma/observer-patch-holography/blob/main/",
  "scope": "Conditional finite constructions; calibration, preparation and physical identification are separate.",
  "leptons": {
    "rows": [
      {
        "name": "electron",
        "mass_GeV": "0.00051099895069"
      },
      {
        "name": "muon",
        "mass_GeV": "0.10565941449590446423633845835618652"
      },
      {
        "name": "tau",
        "mass_GeV": "1.7769849708134271477856576848867574"
      }
    ],
    "muon_electron_ratio": "206.7703159727293886125503",
    "tau_electron_ratio": "3477.472837104598532313001",
    "muon_residual_ppm": "9.83358135415133740093688",
    "tau_residual_ppm": "30.93583507912398668353263",
    "comparison_type": "conditional retrospective postdiction",
    "empirical_anchor": "CODATA 2022 electron energy; muon and tau are comparison targets only.",
    "physical_interacting_identity_proved": false
  },
  "localized": {
    "energy_excess_ppm_upper": 0.0030134729576791275,
    "outside_probability_upper": 1.1026157071008068e-07,
    "time_horizon": 1000000000,
    "support_side": 1073741824,
    "periodic_side": 4294967300,
    "visibility_lower": 0.999772857370109,
    "full_volume_enumerated": false,
    "bound_scope": "Analytic finite-carrier certificate with smaller-box execution; the full analyzer compiler uses continuing controls."
  },
  "magnetic": {
    "precession_g_error_upper": 0.004862601529058231,
    "mass_parameter": 16384,
    "static_g_error_upper": 0.0018312316579754248,
    "coupling_rule": "kappa=m^-6",
    "physical_mass_or_alpha_matched": false
  },
  "neutral": {
    "success_probability_lower": 0.9999999999963906,
    "reduced_density_trace_error_upper": 2.0000005211327732e-16,
    "formal_H_applications": 30546,
    "momentum_spectrum": "exactly flat across all eight momenta on the periodic side-two source",
    "observed_neutrino_identity_proved": false
  },
  "radiation": {
    "time_in_inverse_native_mass": 50,
    "caps": [
      {
        "cap": 1,
        "pair_probability": 0.03543859160088757,
        "vacuum_probability": 0.00010193314749644393
      },
      {
        "cap": 2,
        "pair_probability": 0.028648816462954467,
        "vacuum_probability": 0.00026503639797711867
      }
    ],
    "full_evolution_probability_lower": 4.345106336805556e-38,
    "lower_bound_time_in_inverse_native_mass": "1e-8",
    "physical_scattering_rate_proved": false
  },
  "source_sha256": {
    "model/openwave_localized_rest_packet/results.json": "2c8e0a966dbe68d3916c57dbed41930b36c95fee8cfa9cfcd64d70449ee9f0ae",
    "model/lepton_cycle/physical_comparison.json": "d880464e668b4187e2190dc39160bd11f1441bc465b7b07d1bc985d9469e4c26",
    "model/openwave_rotational_g_limit/results.json": "88eff8866638bfa1853b4b44cc03bce751cfb8513a9e44d6f225b3199f225224",
    "model/openwave_neutral_preparation/results.json": "d140a7913ba526a6e1bf925f04bde0315f6b533345890f48409a79e3a81ed454",
    "model/openwave_neutral_dispersion/results.json": "325cef6b3efbcf9e6588c1dbd1fdaee87aa6041650a9d38fdfa4ad93fa347a7e",
    "model/openwave_radiative_pair/results.json": "786d9165f1c39e0db282885d379ab3c3e2f81152fe538efd0425b3973d2a5ab4"
  },
  "source_paths": {
    "packet": "model/openwave_localized_rest_packet/results.json",
    "comparison": "model/lepton_cycle/physical_comparison.json",
    "magnetic": "model/openwave_rotational_g_limit/results.json",
    "neutral": "model/openwave_neutral_preparation/results.json",
    "flatness": "model/openwave_neutral_dispersion/results.json",
    "radiation": "model/openwave_radiative_pair/results.json"
  }
};
