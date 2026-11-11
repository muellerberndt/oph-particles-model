// node decoder_check.mjs : the decoder engine of decoder.js against research/PD/decoder.json, the table that the
// exact Python script of lane PD writes (repair-law/work/SIM/phase2/PD/decoder_data.py, fractions only, checked
// against the certificate reverse-engineering-reality/model/defect_particle_classes). Two implementations, one table.
import { readFileSync } from 'node:fs';
import { decode, identities, composite, quarkMask, flavourCopy, mesonNames, baryonNames, decompose, setLabel } from './decoder.js';

const D = JSON.parse(readFileSync(new URL('./rl/PD/decoder.json', import.meta.url)));
let failed = 0;
const say = (ok, name, detail = '') => { console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? '  ' + detail : '')); if (!ok) { failed++; process.exitCode = 1; } };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// 1. the 32 patterns, every field of the table
{
  let bad = [];
  for (const row of D.patterns) {
    const p = decode(row.mask);
    for (const key of Object.keys(row)) if (!same(p[key], row[key])) bad.push(`${row.mask}.${key}`);
  }
  say(D.patterns.length === 32 && !bad.length, 'all 32 patterns equal the table in every field', `${Object.keys(D.patterns[0]).length} fields per pattern` + (bad.length ? ' differing: ' + bad.slice(0, 8).join(' ') : ''));
}
// 2. the exact identities, recomputed here in integers
{
  const I = identities(), zero = (o) => Object.values(o).every((v) => v === 0);
  say(I.class_rule, 'class rule k = 3 (n2 mod 2) - 2 (n3 mod 3) mod 6 on all 32 patterns');
  say(I.Q_is_T3_plus_Y, 'Q = T3 + Y on all 32 patterns');
  say(I.kernel, 'n3/3 + n2/2 + Y is an integer on all 32 patterns');
  say(same(I.multiplicities, [4, 6, 6, 4, 6, 6]), 'class multiplicities', I.multiplicities.join(' ') + ' expected 4 6 6 4 6 6');
  say(zero(I.anomalies_16), 'anomaly sums vanish on the 16', 'sum Y, sum Y^3, SU(2)^2 U(1), SU(3)^2 U(1), SU(3)^3: ' + Object.values(I.anomalies_16).join(' '));
  say(zero(I.anomalies_16bar), 'anomaly sums vanish on the conjugate 16', Object.values(I.anomalies_16bar).join(' '));
  say(I.complement_is_conjugate, 'the complement of a pattern is its charge conjugate on all 32');
  say(I.B_minus_L, 'B - L = 1 - (2/3) n3 on all 32 patterns');
  say(I.currents === 64 && I.toggles === 32, 'level moves and register toggles', `${I.currents} and ${I.toggles}, expected 64 and 32`);
  say(Object.values(D.checks).every(Boolean), 'every exact check of the Python script is recorded as passed', Object.keys(D.checks).length + ' checks');
}
// 3. the class of each named multiplet, as stated by the certificate
{
  const want = { Q: 1, 'anti-Q': 5, u_R: 4, d_R: 4, 'anti-u_R': 2, 'anti-d_R': 2, L: 3, 'anti-L': 3, e_R: 0, nu_R: 0, 'anti-e_R': 0, 'anti-nu_R': 0 };
  let ok = true; for (let m = 0; m < 32; m++) { const p = decode(m); if (want[p.multiplet] !== p.k) ok = false; }
  say(ok && D.multiplets.every((m) => want[m.name] === m.k), 'classes 1 and 5 left quarks, 4 and 2 right quarks, 3 lepton doublet, 0 right leptons');
  const sixteen = Array.from({ length: 32 }, (_, m) => decode(m)).filter((p) => p.half === '16').map((p) => p.left_handed_name).sort();
  say(same(sixteen, ['L', 'L', 'Q', 'Q', 'Q', 'Q', 'Q', 'Q', 'd^c', 'd^c', 'd^c', 'e^c', 'nu^c', 'u^c', 'u^c', 'u^c']), 'the 16 is Q, u^c, d^c, L, e^c, nu^c');
}
// 4. bosons: twelve currents of class 0, the register of class 3
{
  const c = D.bosons.currents, q = c.map((x) => x.dQ).sort();
  say(c.length === 12 && c.every((x) => x.six_dY === 0) && same(q, ['-1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1']), 'twelve currents, class 0, charges +1 and -1 for W, 0 otherwise');
  const h = D.bosons.higgs, add = Array.from({ length: 32 }, (_, m) => decode(m)).flatMap((p) => p.toggles.filter((t) => t.adds).map((t) => [p, decode(t.to), t]));
  say(h.k === 3 && add.every(([a, b, t]) => b.six_Y - a.six_Y === 3 && (b.k - a.k + 6) % 6 === 3 && b.num.threeQ - a.num.threeQ === (t.level === 's1' ? 3 : 0)),
    'a register toggle raises 6Y by 3; H+ carries charge 1 and H0 charge 0');
}
// 5. composites: every flavour content of the table, in every handedness assignment
{
  let bad = 0, n = 0;
  const quark = (f, anti, hand, colour) => ({ mask: quarkMask(f, anti, hand, colour), copy: flavourCopy(f) });
  for (const row of D.composites.mesons) for (const a of 'LR') for (const b of 'LR') {
    const r = composite([quark(row.quark, false, a, 1), quark(row.antiquark, true, b, 1)]); n++;
    if (!(r.singlet && r.kind === 'meson' && r.Q === row.Q && r.B === row.B && same(r.names.spin_0, row.names) && r.content === row.content
      && r.class_sum === D.composites.chirality_class_sum.meson[a + b] && r.statistics === 'boson' && same(mesonNames(row.quark, row.antiquark), row.names))) bad++;
  }
  say(!bad && D.composites.mesons.length === 36, 'mesons: 36 flavour contents in 4 handedness assignments', `${n} sets, names, charge, class sum`);
  bad = 0; n = 0;
  for (const [rows, anti, key] of [[D.composites.baryons, false, 'quarks'], [D.composites.antibaryons, true, 'antiquarks']]) for (const row of rows) for (const hands of ['LLL', 'LLR', 'LRL', 'RLL', 'LRR', 'RLR', 'RRL', 'RRR']) {
    const fl = [...row[key]], r = composite(fl.map((f, i) => quark(f, anti, hands[i], i))); n++;
    const cls = D.composites.chirality_class_sum[anti ? 'antibaryon' : 'baryon'][[...hands].sort().join('')];
    const nm = baryonNames(fl, anti);
    if (!(r.singlet && r.kind === (anti ? 'antibaryon' : 'baryon') && r.Q === row.Q && r.B === row.B && same(r.names.spin_1_2, row.spin_1_2) && same(r.names.spin_3_2, row.spin_3_2)
      && r.class_sum === cls && r.statistics === 'fermion' && same(nm.spin_1_2, row.spin_1_2))) bad++;
  }
  say(!bad && D.composites.baryons.length === 56 && D.composites.antibaryons.length === 56, 'baryons and antibaryons: 56 + 56 flavour contents in 8 handedness assignments', `${n} sets`);
  const light = Object.fromEntries(D.composites.baryons.map((r) => [r.quarks, [...r.spin_1_2, ...r.spin_3_2].join(' ')]));
  say(light.uud === 'p Δ⁺' && light.udd === 'n Δ⁰' && light.uds === 'Λ Σ⁰ Σ*⁰' && light.uss === 'Ξ⁰ Ξ*⁰' && light.sss === 'Ω⁻' && mesonNames('u', 'd')[0] === 'π⁺' && mesonNames('d', 's')[0] === 'K⁰' && mesonNames('s', 's').join(' ') === 'η η′',
    'reference names', `uud: ${light.uud} · udd: ${light.udd} · uds: ${light.uds} · uss: ${light.uss} · sss: ${light.sss} · u anti-d: ${mesonNames('u', 'd')[0]} · d anti-s: ${mesonNames('d', 's')[0]}`);
  // same colour level twice: no singlet
  say(!composite([quark('u', false, 'L', 0), quark('u', false, 'L', 0), quark('d', false, 'R', 2)]).singlet && !composite([quark('u', false, 'L', 0), quark('d', true, 'L', 1)]).singlet
    && composite([quark('u', false, 'L', 0), quark('d', true, 'R', 0)]).class_sum === 3, 'two quarks on one colour level are no singlet; a left quark with a right antiquark has class sum 3');
}
// 6. census over all sets of two and three patterns
{
  for (const size of [2, 3]) {
    const t = { sets: 0, singlet: 0, singlet_class_0: 0, singlet_class_3: 0, singlet_of_quark_quanta: 0, singlet_of_quark_quanta_class_0: 0 }; let bad = 0;
    const walk = (start, acc) => {
      if (acc.length === size) {
        const r = composite(acc.map((mask) => ({ mask, copy: 0 }))); t.sets++;
        if (!r.singlet) return;
        t.singlet++; t[r.class_sum === 0 ? 'singlet_class_0' : 'singlet_class_3']++;
        if (![0, 3].includes(r.class_sum) || r.Q.includes('/') || r.B.includes('/') || (r.class_sum === 0) !== (r.doublets % 2 === 0)) bad++;
        const quarks = acc.every((m) => [1, 2].includes(decode(m).n3));
        if (quarks) { t.singlet_of_quark_quanta++; if (r.class_sum === 0) t.singlet_of_quark_quanta_class_0++; }
        return;
      }
      for (let m = start; m < 32; m++) walk(m, [...acc, m]);
    };
    walk(0, []);
    const ref = D.composites.pattern_sets[String(size)];
    say(!bad && Object.keys(t).every((k) => t[k] === ref[k]), `all sets of ${size} patterns`,
      `${t.sets} sets, ${t.singlet} with a colour singlet component, ${t.singlet_class_0} class neutral, ${t.singlet_class_3} of class 3; integer Q and B on every singlet`);
  }
}
// 7. the carrier contents of the run
{
  const R = D.run;
  say(R.contents.every((c) => c.set.reduce((s, x) => s + x, 0) % 6 === 0 && same(decompose(c.set).map(setLabel), c.parts)) && R.not_neutral === 0,
    'every carrier content of run ' + R.run + ' is class neutral and splits into the same parts', `${R.contents.length} contents at the end, ${R.distinct_contents_over_stored_cuts} over ${R.stored_cuts} stored cuts`);
  say(R.contents.reduce((s, c) => s + c.carriers, 0) === R.occupied_carriers && R.occupied_carriers + R.empty_carriers === R.carriers, 'carrier counts add up',
    `${R.occupied_carriers} occupied of ${R.carriers}; {2,4} ${R.contents[0].carriers}, {3,3} ${R.contents[1].carriers}, {4,4,4} ${R.conjugate_balance['{4,4,4}']} against {2,2,2} ${R.conjugate_balance['{2,2,2}']}`);
  const P = Object.fromEntries(R.primitives.map((p) => [p.label, p]));
  say(R.primitives.length === 9 && R.primitives.every((p) => p.statistics === 'boson') && same(P['{1,2,3}'].vertex, ['Yukawa']) && same(P['{2,4}'].vertex, ['fermion gauge current'])
    && same(P['{4,4,4}'].fields, [['d_R', 'd_R', 'u_R']]) && P['{4,4,4}'].ss_note.includes('cannot be a baryon') && P['{3,3}'].ss_note.includes('class-3 bosons'),
    'nine primitive contents, each a boson, with their typed vertices', '{1,2,3}: ' + P['{1,2,3}'].fields.map((f) => f.join(' ')).join(' | '));
}
console.log(failed ? `${failed} check(s) FAILED` : 'all decoder checks pass');
