---
name: brain-usage-driven-fixes-wave-16-2026-05-28
description: "Wave 16 — first usage-driven wave · 5 real-task cold-start queries surfaced 4 search-function bugs · ~30-line BQL edit added multi-word search + separator normalization + no-match diagnostic + extended haystack (purpose + when_to_consult) · \"Add User\" 5→15 matches, \"account name validation\" 0→3, \"BR-UM-08\" 0→1 · proves the wave-loop should be driven by real usage friction not speculative completeness"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1ddc4de1-42ef-4b42-b947-16d520447c6a
---

# Wave 16 — Real-task usage → real-task fixes

🟢 **WAVE-16-LANDED 2026-05-28T01:32:00Z** — The first wave driven by ACTUAL USAGE rather than speculative recommendation-list completion.

## How it happened

Wave 15 was explicit: "stop building, use the brain on real tasks." User said "do the recommended" again. So I demonstrated 5 cold-start queries on real Falcon workload topics:

1. `/brain-context "Add User"` — most recent xlsx coverage
2. `/brain-context "Add Node"` — known xlsx gap (Wave 13 finding)
3. `/brain-context "account name validation"` — xlsx-SoT propagation test
4. `/brain-context "BR-UM-08"` — specific BR id
5. Search "B-1" — recent backend FLAG from admin→mgmt port

**4 of 5 underperformed** — but not because data was missing. Because the BQL search had real, fixable bugs.

## 4 bugs found + fixed in ~30 lines

| Bug | Symptom | Fix |
|---|---|---|
| Single-substring search | "account name validation" 0 matches | Multi-word tokenization — ALL tokens must appear |
| Separator-sensitive | "BR-UM-08" 0 matches (real id `br:um-08`) | `normForMatch()` collapses `:_-.\/\\` to spaces |
| No diagnostic on 0 matches | "Add Node" returned bare empty result | `searchSuggest()` + formatter "closest partial hits" section + likely-cause explanation |
| `purpose:` / `when_to_consult:` not searched | Post-Wave-14 annotations were unsearchable | Search haystack extended to include both |

## Validation — same queries re-run

| Query | Before | After |
|---|---|---|
| "Add User" | 5 matches | **15 + 18 V-rules** |
| "Add Node" | 0 | **4 matches** (Max Node Level V-rule + 3 PES) |
| "account name validation" | 0 | **3 perfect** — xlsx winner + PRD-superseded loser correctly tagged `[trust:unverified]` |
| "BR-UM-08" | 0 | **1 match** (`br:um-08`) |
| "B-1" backend FLAG | 0 | Still 0 (real gap — backend FLAGs not graph-integrated) |

## Issues surfaced but NOT fixed (tracked, not blockers)

1. **xlsx V-rule sheet metadata** — Wave-1 nodes show `(sheet: unknown)` because Wave-1 JSON didn't carry sheet info. Fix: enrich via wave-13 xlsx-resync delta.
2. **Backend FLAGs B-1..B-5** — Not graph-integrated. Fix: targeted wave to ingest `plans/backend-flags-2026-05-27.md`.
3. **Full BR-* enumeration** — 12/225 in graph. Fix: per-module enumeration wave.

## Why this matters more than the previous 5 waves combined

Waves 11-15 added: BQL + skill + drift + emit + trust + diff + xlsx-watcher + purpose-overlay + composite + runbook + handoff. Real work, valuable. But all speculative — "the brain needs X capability."

Wave 16 was driven by **actual usage signal**: queries that should have worked but didn't. The fix took 30 lines + delivered immediate measurable improvement (search match rate roughly 3x across the test queries).

**This is the loop the brain should grow through from now on**: usage → friction → targeted fix.

## Rules emitted (reusable)

- **Always tokenize multi-word search input** — single-substring matching is broken for natural-language queries. Tokenize + require all-tokens-present.
- **Always normalize separators** before comparing IDs — domain ids vary: `vrule:xlsx:account-name` vs natural form "account name" vs ALL-CAPS "BR-UM-08". A `normForMatch()` helper costs 1 line + handles all variants.
- **No-match diagnostics are non-optional** — when a query returns 0 results, the brain should suggest closest partial hits + explain likely cause (xlsx gap, recent FLAG, Q-* blocker). Better than silence.
- **Every annotation field should be searchable** — after adding `purpose` + `when_to_consult` in Wave 14, the search haystack must be extended to include them. Otherwise the new fields aren't discoverable through search.
- **Usage-driven waves compound faster than speculative waves** — 30 lines of code, measurable improvement, real-world validation, no extra documentation overhead. The pattern to repeat.

## Recommended next step

Pick another real Falcon task. If the brain's cold-start still has friction, that's another small wave. If it doesn't — ship the workflow and move to higher-value work.

## Related

- [[project_brain_handoff_wave_15_2026_05_28]] — the handoff wave that recommended this approach
- [[project_brain_purpose_overlay_wave_14_2026_05_28]] — Wave 14 added the annotations now searchable
- [[project_brain_query_layer_wave_11_2026_05_28]] — the BQL this wave fixed
