# React app repairs · 17 September 2026

These repairs retain the three existing application routes. They do not migrate apps or change the other catalogue entries.

## Weekly IT game

`apps/Another-IT-project-simulation/src/model.js` owns each validated weekly transition. Blank, non-finite, fractional, negative or unsafe-integer staffing inputs are rejected. The total assignment cannot exceed the existing team plus immediate new hires. Each hire costs $10,000 once; every retained developer costs $2,000 each week, including unassigned developers. Both costs must be affordable before the game draws new information. The hiring input resets to zero after a committed week.

The game keeps its initial five developers and $100,000 budget. It stops at 100% feature progress, a twelve-week horizon, or inability to afford another payroll. Completion at the last affordable week takes precedence. Quality and satisfaction remain separate outcomes bounded at 0–100; feature completion does not imply product acceptance. The default budget funds only ten weeks of the original team: that resource constraint is explicit.

The original illustrative feature, quality and satisfaction response rules remain. Market draws have explicit probabilities of 30% increased, 42% stable and 28% decreased demand; competitor releases occur with probability 20%. Each accepted decision samples fresh information. No seed, exact replay, calibrated forecast or optimal-policy claim is made. A chart and table record the current run; reset clears it.

## Sequential-decision tutorial

`apps/IT-project-seq-decisions/` retains all six tutorial steps. The page identifies the numerical scenario as illustrative, preserves the decision-before-new-information sequence, and labels matching, Monte Carlo evaluation and learning as candidate methods for future implementation. It executes navigation only, not those algorithms.

## Catalogue tag map

`apps/tag-concurrence-explorer/` keeps the existing 40-tag, 58-pair graph. Tag weights and unordered pair weights are unchanged; generation sorts JSON entries. Node size now reflects frequency, and both node clicks and an accessible tag selector inspect visible neighbours. Filtering, Grid/Concentric/Cose layouts, labels and PNG export remain. The old community-detection claim and incorrect one-big-node startup guidance are removed.

The generator refreshes `tag_concurrence_graph.json` and `tag_concurrence_metadata.json`. Metadata includes the 19 source app names, catalogue checksum, counts, refresh time and command. An unchanged catalogue retains its refresh timestamp. Malformed rows or missing required source columns fail instead of silently claiming complete coverage. The existing postbuild copies both files to the ignored build output.

## Verification

Run all tests from the repository root:

```sh
node node_modules/vitest/vitest.mjs run --root .
npm run build
```

The explicit test root is necessary because the Vite configuration otherwise selects a single app. The repaired repository passes 57 tests across 19 files, including transition invariants, invalid-input/no-draw behaviour, terminal/reset UI, all six tutorial steps, tag filtering/inspection/export/loading failures and source regeneration/provenance. All 19 apps build successfully.

The existing Pareto test logs a jsdom canvas limitation while passing. Existing large-chunk build warnings remain. These checks do not establish mathematical validity or human usability of the unrelated apps.
