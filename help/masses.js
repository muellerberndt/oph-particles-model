// Hover help for the Masses overview (masses.js). Entry format: see help.js.
// Numbers in the texts come from results_data.js, so they equal the numbers on the page.
import { MEAS, HIGGS, register, derivedMeasured, compare, fmtDev } from '../results_data.js';

const R = register(), D = derivedMeasured();
const dMu = fmtDev(compare(R.mu_e, MEAS.mu_e.v).rel), dTau = fmtDev(compare(R.tau_e, D.tau_e.v).rel);
const name = (i) => ({ sel: '.ms-rest .mr-q > span', nth: i });

export default [
  { sel: '.ms-head h2', text: '<b>Masses.</b> The mass values of the model beside the measured values. Every number opens the page that derives it.' },

  // relative masses
  { sel: '.ms-rel .ms-kick > span', text: '<b>Relative masses.</b> The model gives the masses of electron, muon and tau as ratios, with the electron as 1. The ratios use no measured mass. Each step to the right on the axis is a factor of ten. Coloured dot: the model value. White line: the measured value. A dial turns faster for a heavier lepton; its speed follows the ratio on a logarithmic scale.' },
  { sel: '.ms-lep[data-id="mu"] .ms-dev', text: '<b>Muon over electron.</b> The model value lies ' + dMu.replace('+', '') + ' above the measured value, 1 part in 100,000. The measured ratio is known to 0.02 ppm. The model value is of leading order: radiative corrections of order (α/π)<sup>2</sup> ≈ 5 ppm are outside it.' },
  { sel: '.ms-lep[data-id="tau"] .ms-dev', text: '<b>Tau over electron.</b> The model value lies ' + dTau.replace('+', '') + ' above the measured value, 1 part in 32,000. The gap is smaller than the uncertainty of the measured tau mass.' },
  { sel: '.ms-rel .mt-n', nth: 0, text: '<b>Tau over muon.</b> The ratio of the two heavier leptons. It follows from the two ratios above.' },
  { sel: '.ms-rel .mt-n', nth: 1, text: '<b>Koide Q.</b> The sum of the three masses over the square of the sum of their square roots. The model gives 2/3. The measured value follows from the three measured masses.' },

  // rest masses
  { sel: '.ms-rest .ms-kick > span', text: '<b>Rest masses.</b> The masses in units of energy. Digits in brackets are the uncertainty of the last digits. The last column is the model value relative to the measured value.' },
  { sel: '.ms-rest .ms-input', after: true, text: '<b>Input.</b> The electron mass is the one measured input of the lepton rows. Muon and tau masses in MeV are the ratios of the model times this value.' },
  { ...name(3), text: '<b>Tree level.</b> The W and Z masses follow from the electroweak scale and the couplings of the coupling chain. Loop corrections are left out.' },
  { ...name(5), text: '<b>Higgs.</b> One relation between the Higgs mass and the top mass. It gives ' + HIGGS.lo.toFixed(2) + ' to ' + HIGGS.hi.toFixed(2) + ' GeV with the measured top mass, ' + HIGGS.m_t.toFixed(1) + ' GeV, as input.' },
  { ...name(6), text: '<b>Top quark.</b> The value of the Full spectrum page: the electroweak chart of the model with Standard Model loop corrections. The measured value is the mass from direct reconstruction.' },

  // the mass ladder
  { sel: '.ms-strip .ms-kick > span', text: '<b>Mass ladder.</b> Every Standard Model particle at its measured mass. Each step between two labels of the axis is a factor of 1,000. Photon and gluons are massless and have no place on the axis. Hover a particle for its numbers; a click opens its page.' },
  { sel: '.ms-keys', text: '<b>Model value.</b> A filled mark on the axis: the model has a value for this mass. The white line through the mark is the measured value. On this axis the two coincide. The electron carries a ring: its mass is the measured input.<br><br><b>Not derived yet.</b> A hollow mark below the axis, at the measured mass: the quark masses u, d, s, c, b. The band of the neutrinos runs from 0.05 eV to 0.45 eV.' },
];
