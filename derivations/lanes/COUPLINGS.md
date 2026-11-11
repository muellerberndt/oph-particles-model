## RESULT

**The couplings page is aligned to the site addendum and checked at the four sizes.** Sections 1 to 3 of `ADDENDUM_SITE.md` are applied. The readout has the new row 1/alpha(0). The node check passes 74 of 74.

### Follow-up: alignment, responsiveness, the row 1/alpha(0)

1. **The four shots.** Declared variant, one browser session at 13:30, app mounted after 32 s. Each shot was looked at.

   | Size | Layout seen | Measured in the page |
   | --- | --- | --- |
   | 2000 x 1200 | column 1600 centred, 200 px free on each side; two rows of cards 1024 : 512 | cards of a row 608.9 and 301.2 high; plot 984 x 469 |
   | 1500 x 900 | two rows of cards 957 : 479 | same heights; plot 917 x 469 |
   | 1024 x 768 | one column of four cards, 976 wide; readout and forms side by side in the side card | plot 936 x 430; six tiles in one row |
   | 420 x 850 | one column, cards 388 wide, padding 16 | plot 356 x 400; tiles two per row; buttons and links 36 px high |

   At all four sizes a script in the page found: no horizontal scroll, no plot label outside its box, no two plot labels on top of each other, no help badge alone on a line, no clipped text, no console error (MEASURED).
2. **Layout changed to the addendum's grid.**
   - One centred column, at most 1600 px, side padding 24 px, 16 px below 700 px.
   - Two rows of cards in the ratio 2 : 1, gaps 16 px, card padding 20 px, 16 px on narrow screens. Cards of a row have equal heights. The plot and the ratio picture fill their cards.
   - Left edges of title, lead line, status row, cards and footer coincide. Right edges of the cards coincide. The plot's tick labels start at the card's inner left edge and its grid ends at the inner right edge.
   - Type scale: title 26/700, card titles 15/700, kickers 11 px uppercase .14em, body 14, small 12.5. Numbers are tabular and right-aligned.
   - Status chips in the common form: pill, 11 px, weight 700, uppercase, .06em, 1 px border and text in the status colour, transparent fill. The item name stands beside each chip. The "not blind" tags use the neutral grey of the leptons page.
   - Every help badge hangs on a short piece that cannot wrap: the last word of a line, a chip, a legend entry. The corner badge on the ratio picture is gone; its text moved to the title's help. 37 badges.
   - The plot: legend below it, the selector labelled "matter content", the label of the rising line below that line. Below 600 px of plot width the labels take a compact arrangement: one row per scale label, the law for v on two lines, a tick every four decades.
3. **Responsive behaviour.**
   - Below 1280 px every card spans the row. Inside the side card the readout and the forms stay side by side down to 820 px.
   - The flux tiles stand 6, 3 or 2 per row by the width of their card. No tile is left alone in a row.
   - At phone width the status items form an aligned list and the four choices a two by two grid.
   - The readout table has its own scroll box. It needs none at the tested widths.
4. **Faults the shots exposed, all repaired and re-shot.**
   - The closure label crossed the anchor line.
   - At phone width the link underline stood 9 px below the text, the status items wrapped raggedly, and the fourth choice stood alone in a row.
   - At 1024 the forms column ended about 60 px above the readout column.
   - The kickers of the two upper cards stood a few pixels apart.
   - At 699 px the law for v touched the value at M_U. At 360 px the table was 4 px wider than its box.
   - The plot height differed by 2 px between variants because of a subscript in one line.
5. **New readout row** (NOT BLIND). 1/alpha(0) = 136.995 against CODATA 2022 137.035999177(21): -0.030 percent, difference -0.041 as in `CA_ANCHOR.md`. The value is the paper's declared transport at the input P (DECLARED). The other variants hold P fixed: source as built 150.952, two doublets 151.124, stack's own M_U 136.126.
6. **No progress indicator is needed.** One solve takes 6 to 7 ms in the browser and a change of matter content 5 to 7 ms (MEASURED).
7. **Departures from the addendum.**
   - The card rows go to one column below 1280 px. The addendum names two columns below 1100 px. Reason: the readout table needs 340 px and six flux tiles need 770 px.
   - The deviation track of the readout is hidden while the side card is narrower than 400 px.

### Standing result of the first report

- `couplings_chain.js` ports the reference chain. It agrees with the Python reference within 2e-13 relative on five rows (MEASURED). The declared row is reproduced in every printed digit: 1/alpha_U = 24.3166, v = 246.60 GeV, 1/alpha_2 = 29.605, alpha_s = 0.11834, sin^2 = 0.23074, 1/alpha_em = 128.31. The chain is DECLARED.
- CU's table: 40 of 40 cells. CH's table: 29 of 30 cells; the table prints 24.319 where the chain value 24.31845 rounds to 24.318.
- CH's exact ratio: 115/218 on 224 points, largest deviation 5.9e-15 (MEASURED); 5/7 and 5/9 for the other slope sets (EXACT).
- Flux counts (12/5, 3, 4, 3, 12/5) equal the certificate (EXACT).
- The paper's outer fixed point is reproduced: P = 1.630972095859, 1/alpha(0) = 136.9948351774.
- Measured values are those of PDG 2024: sin^2 = 0.23129(4), 1/alpha(m_Z) = 127.930(8). The coordinator adopted them for the site.

## EVIDENCE

- **Shots**, in `work/SIM/phase2/COUPLINGS/shots/`:
  - `couplings_2000x1200.png`, `couplings_1500x900.png`, `couplings_1024x768.png`, `couplings_420x850.png`
  - the whole page at each width: `couplings_2000x1200_whole_page.png`, `couplings_1500x900_whole_page.png`, `couplings_1024x768_whole_page.png`, `couplings_420x850_whole_page.png`
  - `couplings_1500x900_source_as_built.png`
  - the measurements of each capture as `c_<size>_<variant>.json`
- **Capture tool**: `shots/cdp_multi.mjs` with `shots/diag.js`. It loads the app once, waits until the page is mounted, then sets each size in turn, measures and captures.
- **Browser load**: six sessions, each one load of the app. 33 size settings were measured and 49 images written. The app mounted after 11 to 32 s.
- **Widths between the four sizes**, measured by the same script: 1280, 1279, 900, 819, 700, 699, 600, 360. Two faults appeared, at 699 and 360. Both are repaired and both widths were measured again without fault.
- **Checks**: `cd oph-physics-sim/oph_defects/viewer2 && node couplings_check.mjs` ends with "ALL PASS: 74 of 74 checks". `node results_data_check.mjs` of the results page still passes its 16 checks with the extended engine.
- **Wording scan** of the five files: no em dash, no retired number, no forbidden phrase.
- Lane directory `work/SIM/phase2/COUPLINGS/`: `CANDIDATES.md` with the follow-up entry, `RESULT.md`, `couplings_check.out`. The earlier screenshot of the old layout is removed.

## WHAT THIS DOES NOT ESTABLISH

- The page derives nothing. It computes the declared chain and three variants. The items of CA, CU, CH and CG stay open as reported.
- Section 4 of the addendum was outside this task. The page has no waiting computation.
- Headless Chrome only, at pixel ratios 1 and 2. No real phone, no Safari, no Firefox. The layout uses CSS container queries and `color-mix`.
- The help badges are 14 to 16 px, below the 36 px tap size. They belong to `help.js`.
- The header and the strip above the page belong to the coordinator. At 1024 and 420 px the header scrolls sideways inside itself.
- Open help tooltips were not shot again at the new sizes.
- At 2000 x 1200 the page still scrolls by 119 px. The footer links lie below the fold.
- The values of 1/alpha(0) for the three other variants are arithmetic at a fixed P. The outer equation of P is not solved again for them.

## NEXT

1. Coordinator: if a shared stylesheet for chips, kickers and the type scale arrives, replace the same rules at the top of `style/couplings.css`.
2. Coordinator: decide whether the one-column breakpoint at 1280 px stands for this page.
3. When LV2 or CH fix the prefactor of the law for v, set `VARIANTS.source.pref` in `couplings_chain.js`.

## FOR THE SITE

Files changed in this follow-up, all in `oph-physics-sim/oph_defects/viewer2/`:
- `couplings_page.js`: new markup of head, cards and footer; responsive plot; row 1/alpha(0); links through `linkList(['coupling', 'gauge', 'electroweak', 'couplingChain'])` with the duplicate paper link removed.
- `style/couplings.css`: rewritten to the grid, type scale and chip form of the addendum.
- `help/couplings.js`: selectors of the new markup, one entry for the new row, the readout and ratio texts adjusted.
- `couplings_chain.js`: `MEASURED.alpha0Inv` and `CODATA_SOURCE` added. Existing exports are unchanged.
- `couplings_check.mjs`: two checks added for 1/alpha(0).

Hook lines: none new. The page uses the key `couplingChain` that `links.js` now holds, and falls back to its own list if the key is missing. `help.js` loads `help/couplings.js` by itself. The optional line `<link rel="stylesheet" href="style/couplings.css">` in `index.html` still stands; the module adds the link itself when it is absent.
