# Lane PD, follow-up: alignment, symmetry and responsive layout of the decoder page

## RESULT

Sections 1 to 3 of ADDENDUM_SITE are applied to the decoder page. Four shots of the real app were taken, one per
size, one after another, and each was looked at. Each shot took 23 to 30 seconds. A layout audit ran
inside every shot. All numbers below are MEASURED in headless Chrome.

| Size | Layout | Card widths in px | Row heights in px | Audit |
| --- | --- | --- | --- | --- |
| 2000 x 1200 | three columns, column of 1600 px centred | 507, 507, 507; then 1029 and 507; then 1552 | 549, 295, 354 | clean |
| 1500 x 900 | three columns | 473, 473, 473; then 963 and 473; then 1452 | 540, 295, 354 | clean |
| 1024 x 768 | two columns | 480 and 480, twice; then 976; then 976 | 539, 570, 284, 424 | clean |
| 420 x 850 | one column | 388 | 607, 594, 504, 354, 576, 913 | clean, no button under 36 px |

Clean means: no horizontal scroll of the page or the document, no element outside the page column, no element
outside the content box of its card, 13 help badges attached and none alone on a line, no script error.
Gaps between cards are 16 px at every size. Side padding is 24 px, and 16 px at 420. Card padding is 20 px, and 16 px
at 420. Title, lead line, cards and footer share one left edge. Cards of one row have equal heights.

**What changed.**

Layout
- One grid of six tracks. First row in thirds: code, particle, wheel. Second row 2 : 1: composite, bosons. The run
  strip spans the row. Below 1100 px two columns: code and particle, wheel and bosons, composite across, run strip
  across. Below 700 px one column.
- Column of at most 1600 px, centred. The title stands above the lead line. Footer links align with the cards.
- Every card starts with one header row: kicker on the left, status chip or note on the right.
- The last block of each card sits on the card's bottom edge, so bottoms line up across a row.
- Type scale of the addendum: title 26/700, card title 15/700, kicker 11 uppercase .14em, body 14, small 12.5.
- Run strip: a grid of equal cells. 10, 9, 6 and 2 columns at the four sizes.

Status and wording
- Status chips in the common form. Particle: derived. Wheel: derived. Twelve currents: derived. Copy selector:
  declared. Higgs register: declared. Register of the run: declared.
- Hadron names carry the plain note "names of the quark model" and no chip. The word "imported" appears in no file
  of the page: decoder.js, help/decoder.js, decoder.css, decoder.json.

New graphic
- The boson card shows the twelve currents as a square of moves between the five levels. Row: the level moved to.
  Column: the level left. Colour block with six gluons, weak block with W+ and W-, the diagonal, and the two empty
  blocks between colour and weak levels. Cells open to the decoded pattern are lit and can be clicked.
- The card has three forms: square beside a grid of tiles in a wide card, square beside a list in a narrow card and
  on phones, large square above the tiles in the two-column layout where it stands beside the wheel.

Defects seen in the shots, all fixed
- Subscripts inside the move chips and the square sat on the baseline. They are subscripts again.
- The bar of an antiparticle was drawn twice at two heights. It is one line over the whole symbol now.
- The move chips wrapped to a second row at 1500 px. They fit one row.
- One boson tile wrapped alone to a second row. The tiles sit on a grid of five.
- The boson card had an empty band beside the wheel at 1024 px. The square grows there and the tiles go below it.
- A field triple in the reading broke across lines on phones. Triples stay together.

Defects found by the audit or by computing widths, all fixed before they showed
- The remove button of a slot was 20 px high on phones. It is 36 px.
- The pattern dots were 11 px targets. The hit area is 18 px, and 36 px high on phones and on touch screens.
- The charge tile is too narrow for its number in a three-column card below about 1350 px. The tiles follow the
  width of their card.
- One formula line is wider than a phone card. It is three formulas that wrap.
- The lead line and its help badge could part at a line end. The last words and the badge stay together. The same
  holds for the conjugate button and its badge.
- The page showed bare words while loading. It shows the progress indicator of progress.js.

The four late edits of the first report are now seen in a browser: the two derivation links in the footer, the
certificate link that links.js now lists itself, the bar in the content line of a meson, and the narrow layout,
which is rewritten.

## EVIDENCE

Shots, all in `work/SIM/phase2/PD/shots/`:
- `decoder_2000x1200.png`, `decoder_1500x900.png`, `decoder_1024x768.png`, `decoder_420x850.png`: the real app at
  `http://localhost:8777/?page=decoder`, the four required sizes.
- `full_page_1500.png`, `full_page_1024.png`, `full_page_420_antiparticle.png`: the whole page below the fold.
  These come from a harness that loads the real index.html, decoder.js, decoder.css, help.js and decoder.json
  without the app. The audit gives the same card geometry in the app and in the harness.
- The audit script is `layout_audit.js` in the lane directory. It is the expression argument of `cdp_shot.mjs`.

Shots taken: five of the app, the four sizes and one retake at 1500 after the move chips were tightened. Twelve of
the harness, each a few seconds of page load. One more width was checked in the harness: 1120 px, the narrowest
three-column case.

Checks after the last edit:
```
cd oph-physics-sim/oph_defects/viewer2
node decoder_check.mjs                                                                    # 24 PASS lines
node work/SIM/phase2/PD/page_dryrun.mjs   # 1,739 pieces, clean
cd work/SIM/phase2/PD
env PYTHONDONTWRITEBYTECODE=1 python decoder_data.py         # 62 exact checks pass
```
The data file was regenerated for the wording: 101,563 bytes, sha256
9caea3329ae7f463db127bd60dda6a664c89cd442780efae15f92ab59f11b5d3. Every number in it is unchanged.
The harness server is stopped. No process of this lane is left running.

## WHAT THIS DOES NOT ESTABLISH

- Headless Chrome only. Safari and Firefox were not opened. The card-width rules use container queries.
- The rules for touch screens were not rendered: headless Chrome has a fine pointer. They repeat the rules seen at 420 px.
- The four app shots show the top of the page. The lower parts were seen in the harness.
- Widths other than 2000, 1500, 1120, 1024 and 420 px were not rendered.
- The loading indicator and the hover texts at phone width were not captured.
- Beauty is a judgement. The measured part is the checklist: edges, gaps, heights, overflow, badges, targets.

## NEXT

1. Coordinator: when a shared class for status chips exists, replace `.dc-st` of this page by it.
2. Still open from the first report: `PD/decoder.json` is missing in `research/manifest.json`.
3. Open one shot on a real phone or with touch emulation to see the 36 px targets at tablet width.

## FOR THE SITE

Changed files in `oph-physics-sim/oph_defects/viewer2/`:
- `decoder.js`, 469 lines. The engine half is unchanged. The page half is rebuilt.
- `style/decoder.css`, 271 lines, every rule scoped to `#page-decoder`.
- `help/decoder.js`, 13 entries. The lead-line entry now targets `.dc-map .dc-nb`. The boson text describes the square.
- `research/PD/decoder.json`, regenerated. Wording of three label strings changed.
- `decoder_check.mjs` is unchanged.

Hook lines: none. Links: `links.js` lists the certificate under `classes`, so the page no longer adds it. The page
still adds `DER + 'reports/DG.md'` and `DER + 'reports/CH_HYPERCHARGE.md'` until one of the keys `classes`, `spin`,
`gauge` returns them.

The page imports `./progress.js` inside `mount` for the loading indicator.

---

# Lane PD, first report (accepted): the decoder from the source's objects to particle names and quantum numbers

Three facts are updated since: the data file hash, the file sizes, and the statements about the page layout.

## RESULT

The decoder is complete. One exact table, one page engine, one page. The Python script passes 62 exact checks. The
page engine equals the table in 24 node checks. No measured value enters. The decoder carries no mass, no coupling
value and no mixing.

**1. The 32 patterns (EXACT).** Every pattern of the five-level code has its name, multiplet, colour index,
representations, T3, Y, Q, B, L, B - L, the integer 6Y, the class 6Y mod 6, its half of the code, the handedness of
the field, its statistics, the phase around each defect class, its complement, and the patterns one current or one
register toggle away.
- The class rule k = 3 (n2 mod 2) - 2 (n3 mod 3) mod 6 holds on all 32. The multiplicities are (4, 6, 6, 4, 6, 6).
  Classes 1 and 5 are Q and its conjugate, 4 and 2 the right-handed quarks and their conjugates, 3 the lepton
  doublet and its conjugate, 0 the right-handed leptons and their conjugates.
- Q from the level charges (-1/3, -1/3, -1/3, +1, 0) equals T3 + Y on all 32.
- n3/3 + n2/2 + Y is an integer on all 32.
- The anomaly sums vanish on the 16 and on the conjugate 16: sum Y, sum Y^3, the SU(2)^2 U(1) sum, the SU(3)^2 U(1)
  sum, and triplets minus antitriplets. Each half holds four weak doublets.
- The complement of a pattern is its charge conjugate on all 32: Y, T3, Q, B, L change sign, the colour
  representation is conjugated, k goes to 6 - k, the two halves swap.
- B - L = 1 - (2/3) n3 on all 32, the charge of report DG.
- The table equals `model.patterns()` and `results.json` of the certificate on all 32 rows. Symbols and handedness
  equal `particle_map.json` on all 32 rows.
- DECLARED: the 16 is the set of even degree (Q, u^c, d^c, L, e^c, nu^c). DECLARED: the copy order u c t, d s b,
  e mu tau. The copy changes no charge.

**2. Bosons (EXACT charges).** Twelve currents: 8 gluons, W+, W-, W3, B. Every one has 6Y = 0 and class 0. W+ and
W- carry charge +1 and -1, the others 0. On the 32 patterns the currents make 64 level moves: 48 by gluons, 8 by
W+, 8 by W-. Every move keeps the multiplet. The register makes 32 toggles. Each raises 6Y by 3, shifts the class
by 3 and swaps the half of the code. H+ adds s1 and carries charge 1. H0 adds s2 and carries charge 0. The toggles
form four chains: d_R, Q, u_R; e_R, L, nu_R; and the two conjugate chains. The counts 64 and 32 equal the current
and toggle rows of the certificate. The twelve moves between a colour level and a weak level change 6Y by 5 and
carry class 1 or 5; none is a current of the source (GL). The register is DECLARED (R8).

**3. Composites (EXACT rule, IMPORTED names).**
- A set of two or three quanta has a colour singlet component exactly when its three colour levels are filled
  equally often. Checked against the exact null space of the SU(3) generators in all 80 sectors.
- All 528 pairs and 5,984 triples of patterns: 84 pairs and 632 triples have a singlet component. Every one has
  class sum 0 or 3, integer charge and integer baryon number. 44 pairs and 316 triples are class neutral.
- A colour singlet set is class neutral exactly when it holds an even number of doublet patterns.
- Quark quanta: 48 singlet pairs, 24 of them class neutral; 128 singlet triples, 64 class neutral.
- Handedness rule: a meson is class neutral as left with left or right with right; left with right has class 3,
  the class of the Higgs register. A baryon is class neutral as RRR or LLR; LLL and LRR have class 3.
- With flavour and handedness per quantum: 72 class-neutral mesons, 182 baryons, 182 antibaryons.
- Names by flavour content, the three copies as flavours: 36 meson contents, 56 baryon contents, 56 antibaryon
  contents. The light contents give pion, kaon, eta, proton, neutron, Lambda, Sigma, Xi, Delta, Omega: 8 states of
  spin 1/2 and 10 of spin 3/2 among u, d, s. IMPORTED from the quark model and the naming scheme of the Particle
  Data Group. The charge written in every name equals the computed charge. The decoder carries no masses.
- Two quanta are a boson, three a fermion, as in the certificate.

**4. Carrier contents of run L6 (MEASURED counts, EXACT readings).** At the end 24,758 of 81,920 carriers hold
defects, in 15 contents. Over the 180 stored cuts 505 contents occur. Every one is class neutral and holds an even
number of odd classes.

| Content | Carriers | Share of occupied | Parts |
| --- | --- | --- | --- |
| {2,4} | 19,513 | 78.81 % | |
| {3,3} | 3,073 | 12.41 % | |
| {1,5} | 688 | 2.78 % | |
| {2,2,4,4} | 555 | 2.24 % | {2,4} + {2,4} |
| {2,2,2} | 335 | 1.35 % | |
| {4,4,4} | 334 | 1.35 % | |
| {2,3,3,4} | 227 | 0.92 % | {2,4} + {3,3} |
| {3,3,4,4,4} | 13 | 0.053 % | {3,3} + {4,4,4} |
| {3,3,3,3} | 6 | 0.024 % | {3,3} + {3,3} |
| {2,2,2,2,4} | 4 | 0.016 % | {2,2,2} + {2,4} |
| {2,2,2,3,3} | 3 | 0.012 % | {2,2,2} + {3,3} |
| {2,4,4,4,4} | 3 | 0.012 % | {2,4} + {4,4,4} |
| {2,2,2,4,4,4} | 2 | 0.008 % | three times {2,4} |
| {1,2,3} | 1 | 0.004 % | |
| {2,2,3,3,4,4} | 1 | 0.004 % | {2,4} + {2,4} + {3,3} |

All nine neutral contents of at most three members occur in the run. Three are absent at the end: {1,1,4} with a
peak of 4,758 carriers at depth 576, {2,5,5} with 4,742 at depth 576, {3,4,5} with 1,799 at depth 960. {1,2,3}
peaks at 1,835 at depth 1088. {1,5} peaks at 30,639 at depth 960.

Reading (SS): every content is a set of flux defects and therefore a boson of integer spin. A {2,2,2} or {4,4,4}
carrier is no baryon. A {3,3} carrier is a pair of class-3 bosons. Typed vertex of each primitive content, computed
with the certificate's functions and equal to its reaction table on all 18 reactions:

| Content | Vertex with these classes | Fields, all incoming |
| --- | --- | --- |
| {1,5} | fermion gauge current | Q, anti-Q with G, W or B |
| {2,4} | fermion gauge current | u_R, anti-u_R or d_R, anti-d_R with G or B |
| {3,3} | Yukawa and gauge currents | L, anti-H, anti-e_R; H, L, anti-nu_R; L, anti-L or H, anti-H with W or B |
| {1,2,3} | Yukawa | Q, anti-u_R, H and Q, anti-d_R, anti-H |
| {3,4,5} | Yukawa | the conjugates |
| {4,4,4} | three-fermion singlet with colour epsilon, no renormalizable vertex | u_R, d_R, d_R |
| {2,2,2} | the same | anti-u_R, anti-d_R, anti-d_R |
| {1,1,4} | the same | Q, Q, d_R |
| {2,5,5} | the same | anti-Q, anti-Q, anti-d_R |

**5. Page.** `?page=decoder` shows the five toggles, the particle, the wheel with the phase dials, the copy
selector, the map of the 32 patterns, the moves by currents and register, the composite builder, the boson strip
and the run strip. Four headless shots at 1500 by 950: no script error, 13 help badges attached, the formula typeset.

Comparison with nature: the Standard Model charge table and the hadron names were known in advance. NOT BLIND.
One convention set was computed. `CANDIDATES.md` was written before the first run.

## EVIDENCE

Rebuild, about 12 seconds:

```
cd work/SIM/phase2/PD
env PYTHONDONTWRITEBYTECODE=1 python decoder_data.py     # 62 exact checks pass
cd oph-physics-sim/oph_defects/viewer2
node decoder_check.mjs                                                                # 24 PASS lines
node work/SIM/phase2/PD/page_dryrun.mjs   # dry run clean
```

- Lane directory `work/SIM/phase2/PD/`: `CANDIDATES.md`,
  `decoder_data.py`, `decoder.json`, `page_dryrun.mjs`, `RESULT.md`.
- Data file `oph-physics-sim/oph_defects/viewer2/research/PD/decoder.json`,
  101,563 bytes, sha256 9caea3329ae7f463db127bd60dda6a664c89cd442780efae15f92ab59f11b5d3. The lane copy is identical.
  The file records the sha256 of every input: `model.py` and `results.json` of the certificate, `ss_table.json`,
  `particle_map.json`, and of run L6 `early_universe.json`, `cuts/end.npz`, `run.json`.
- `decoder_check.mjs` compares the page engine with the table: all 32 patterns in every field, the identities
  recomputed in integers, 144 meson sets, 896 baryon and antibaryon sets, all 528 pairs and 5,984 triples of
  patterns, the splitting of all 15 contents.
- `page_dryrun.mjs` renders every pattern in every copy, every chip, every preset and every palette button without
  a browser: 1,739 pieces, no undefined value.
- The end census equals `view/early_universe.json` on its 12 listed contents and on the occupied count.
- RER was read only. Commit 736c6d929. No bytecode was written there.

## WHAT THIS DOES NOT ESTABLISH

- No mass, no coupling value, no mixing, no lifetime. The order of the copies is a label.
- A colour singlet component of a set of quanta is a statement about representations. No binding, no confinement
  and no bound state of the source follows.
- Class neutrality is weaker than gauge invariance. A class-neutral set can carry integer hypercharge and weak isospin.
- A carrier content fixes centre classes only. The map from classes to fields is many to one, and a colour singlet
  and a colour octet share a class.
- The splitting of a content with more than three members is a display rule. Positions on the carrier are unused.
- Fermi statistics of the quanta rest on the three premises of the certificate.
- Hadron names are imported. The table does not say which states are observed, which is lightest, or how neutral
  states mix. Contents with a top quark have no entry.
- The singlet rule is verified for two and three quanta only.
- The census covers the stored cuts of one run, L6. The stored runs hold flux defects and no quanta, so the run
  strip decodes fluxes and the builder decodes chosen quanta.
- The layout at four sizes is covered by the follow-up above.

## NEXT

1. Coordinator: add `PD/decoder.json` to `research/manifest.json`. `bundle_research.py` copies from
   `repair-law/work/<name>`, and this lane's copy sits at `repair-law/work/SIM/phase2/PD/decoder.json`. Eight
   phase-2 files are referenced and unlisted: AV, EW, HAD, IL, LR, PD, QCD, REFRESH.
2. Coordinator: add the certificate link to `links.js` (below).
3. Extend the singlet check and `composite()` to four and five quanta. The exact null space decides whether equal
   filling of the colour levels stays sufficient.
4. Feed a run that carries quanta on carriers into `composite()`. The engine accepts any set of patterns.
5. The Classes page lists patterns per class; each row can open the decoder on that pattern.

## FOR THE SITE

Files delivered, all in `oph-physics-sim/oph_defects/viewer2/`:
- `decoder.js` (469 lines): exports `mount(host)` and the engine `decode`, `identities`, `composite`, `quarkMask`,
  `flavourCopy`, `mesonNames`, `baryonNames`, `decompose`, `setLabel`, `frac`. Modules that touch the document
  (`links.js`, `classes.js`, `math.js`) are imported inside `mount`, so the file loads in node.
- `style/decoder.css` (271 lines), every rule scoped to `#page-decoder`, loaded by the module through a link tag.
- `help/decoder.js`: 13 entries.
- `decoder_check.mjs`.
- `research/PD/decoder.json`, fetched as `'/rl/PD/decoder.json'`.

Hook lines: none missing. `app.js` has `decoder: './decoder.js'` in `EXTRA`, the navigation has the Decoder entry
under Particles, and `help.js` loads `help/decoder.js` by itself.

Links: the page uses `linkList(['classes', 'spin', 'gauge'])`. It adds links built from the exported bases
and drops each one as soon as `linkList` returns its URL. The first of the three is now listed in `links.js`:
- `['Certificate: defect classes are centre classes (61 exact checks)', RER + 'model/defect_particle_classes/PROOF.md']`.
  The file is on origin/main at 736c6d929. Suggested place: `SRC.classes`.
- `['Derivation: exact B − L, Dirac neutrinos', DER + 'reports/DG.md']`
- `['Derivation: 32 Weyl blocks per copy, three copies', DER + 'reports/CH_HYPERCHARGE.md']`
  Both files exist in the local `oph-particles-model/derivations/reports/`.

Notes for the coordinator:
- The run strip shows L6 from the data file and does not follow the run selector.
- The symbol of an antiparticle carries a bar over the whole symbol of its particle. The page names it
  "antiparticle of the left-handed up quark" and tags the field as right-handed. The Classes page calls class 5 the
  left-handed antiquark class; the two wordings name the same patterns.
- The help texts use the status words derived, declared, imported, open, and the group wording of the addendum.
