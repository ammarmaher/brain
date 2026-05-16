# Lessons learned — `falcon-empty-data` (2026-05-14)

> Distilled signals from the first calibration run, framed as actionable changes for strategy v1.0 (and beyond).
> Source prefixes: `[CODE]` = `C:\Falcon\Falcon\falcon-web-platform-ui`; `[BRAIN-OUT]` = `C:\Falcon\Brain Outputs\…`; `[INFERRED]` = author reasoning.

---

## Headline

The 97.8% prediction landed at 96.2% actual — a −1.6 pp delta entirely attributable to two avoidable pre-flight oversights (loader chicken-egg + reserved HTMLElement prop). Both fixes are mechanical and roll into doctrine as pitfalls #11 and #12. With those captured, the second run should clear ≥ 98%.

The rubric correctly flagged Dim #14 (Build pipeline) as the highest-risk dimension at 80% pre-mitigation — and the M1 baseline-verify discipline successfully recovered it to 90% actual. The rubric is doing its job.

---

## Lesson 1 — Loader entry bootstrap is a first-run-only trap

### Observation

The loader entry in `[CODE]` `libs/falcon-ui-core/src/define-falcon-tw-component.ts` references `../dist/components/<name>-tw`, a path Stencil emits **during** the same build that TypeScript validates **before**. On a first-time component scaffold, that path does not exist, and the build fails at type-check.

This is invisible on iterations 2+ of an existing component (dist is already there). The first calibration run is exactly where it surfaces, by definition.

### Action

**Propagate to [08-COMMON_PITFALLS.md](../../08-COMMON_PITFALLS.md) as pitfall #11** with the two-pass bootstrap recipe in [DEVIATIONS.md §1](DEVIATIONS.md).

**Better fix (defer):** ship a pre-flight script `tools/scripts/scaffold-stencil-component.ts` that runs `nx build falcon-ui-core` once with the new `.tsx` files but no loader edit, then opens the loader entry for the author to append. Defers the human edit until the dist exists. Not in scope for this run; track as a Tier-3 enhancement.

---

## Lesson 2 — Reserved HTMLElement props need a pre-flight grep

### Observation

`@Prop() title` is forbidden by Stencil because `HTMLElement.title` is the browser-defined tooltip attribute. The compiler errors with a clear message — but only after we've already written the type contract, both Stencil components, the Angular wrapper, and the consumers. Cost: a coordinated rename across 8 surfaces (see [DEVIATIONS.md §2](DEVIATIONS.md)).

The reserved-name set is small and finite: `title`, `id`, `dir`, `lang`, `tabIndex`, `scrollHeight`, `scrollWidth`, `offsetHeight`, `offsetWidth`, `style`, `hidden`, `slot`, `inert`. A single grep before parallel agent dispatch eliminates the trap.

### Action

**Propagate to [08-COMMON_PITFALLS.md](../../08-COMMON_PITFALLS.md) as pitfall #12** (or extend an existing reserved-name pitfall) with the full blocklist + convention: append `Text` for label-style props (`titleText`), append `Value` for numeric (`tabIndexValue`), and `Hidden` is fine when you literally mean the boolean.

**Pre-flight gate to add to [06-EXECUTION_PROTOCOL.md](../../06-EXECUTION_PROTOCOL.md) Phase 0:**

```pwsh
# Before locking the types contract, sanity-check the proposed prop set:
$blocklist = 'title|id|dir|lang|tabIndex|scrollHeight|scrollWidth|offsetHeight|offsetWidth|style|hidden|slot|inert'
Get-Content "<types.ts>" | Select-String -Pattern "(?<![\w])($blocklist)(?![\w])" | ForEach-Object { Write-Warning "Reserved HTMLElement member name: $_" }
```

---

## Lesson 3 — The types file as SSOT, locked BEFORE parallel agents start

### Observation

Phase 0's most important step was **not** the file deletions — it was pre-writing `[CODE]` `falcon-empty-data.types.ts` and treating it as immutable for the duration of Wave 1. Every parallel agent (A1, A2, A3, B-series) read from the same contract. Zero merge conflicts in Wave 1. The seven-way fan-out succeeded on first turn precisely because the API was locked.

Compare against an imagined alternative where agents inferred the shape from prose: each would have picked subtly different prop names (`headline` vs `title` vs `titleText`), event names (`actionClick` vs `onAction` vs `actionTriggered`), and config shapes. Reconciliation would have been brutal.

### Action

**Promote this to a doctrine principle** in [06-EXECUTION_PROTOCOL.md](../../06-EXECUTION_PROTOCOL.md): "Phase 0 ends with the types file written and committed-to. No Wave 1 agent is dispatched until the types contract is final."

The deviation in Lesson 2 (titleText rename) is the exception that proves the rule — even with the rename mid-flight, only the types file + a deterministic set of downstream files needed touching, because everything imported from one place.

---

## Lesson 4 — Parallel agent file-ownership boundaries

### Observation

Wave 1's seven-agent fan-out (A1, A2, A3, B1, B2, B3, B4) hit zero conflicts. The reason: every agent owned a **disjoint** file set. A1's Stencil Shadow `.tsx` did not overlap with A2's Stencil Light `.tsx`; both read from A0's types file but neither wrote to the other's directory. The B-agents touched `[BRAIN-OUT]` exclusively, never `[CODE]`.

### Action

**Codify as a doctrine rule** in [06-EXECUTION_PROTOCOL.md](../../06-EXECUTION_PROTOCOL.md): "Each parallel-wave agent declares its owned file paths up front. Two agents in the same wave MAY NOT touch the same path. Shared inputs (types file, doctrine) are read-only for non-owners."

The orchestrator's brief should pre-fill the ownership manifest so each subagent gets a list like:
- **Owned (write):** `libs/falcon-ui-core/src/components/falcon-empty-data/falcon-empty-data.tsx`
- **Read-only references:** `libs/falcon-ui-core/src/components/falcon-empty-data/falcon-empty-data.types.ts`
- **Forbidden:** `libs/falcon-ui-core/src/components/falcon-empty-data-tw/*` (owned by A2)

---

## Lesson 5 — Consumer rewires fall out automatically when types are centralised

### Observation

After the `title` → `titleText` rename hit the SSOT (`falcon-empty-data.types.ts`), four downstream files needed updating: data-table integration, showcase, org-hierarchy consumer, and the public barrel. Each of those files imported `FalconEmptyDataConfig` directly from the SSOT (not from a copied/duplicated definition). Result: TypeScript's red squigglies guided the rename across all four in one pass.

Compare against an imagined alternative where each consumer had its own `interface UsersEmptyConfig { title: string; ... }` shape — there would have been no compile-time signal of drift, and stale `title:` literals would have sat in production code.

### Action

**Codify as a doctrine principle**: "Every consumer of a Falcon component imports its config interface from the component's `.types.ts` SSOT. No local interface duplication, no `as any` casts, no inline literal types that mirror the SSOT shape."

This already implicitly governed the run, but it should be explicit in [07-INTEGRATION_POINTS.md](../../07-INTEGRATION_POINTS.md).

---

## Lesson 6 — The 17-dimension rubric correctly forecast risk

### Observation

The rubric's pre-run prediction (97.8%) assigned the lowest scores to:

| Dim | Predicted | Actual | Notes |
|---|---:|---:|---|
| 14 — Build pipeline | 80% | 90% | Correctly flagged as highest-risk; M1 baseline-verify mitigated cost |
| 15 — a11y attributes | 90% | 90% | Predicted exactly |
| 8 — Loader registration | 100% | 90% | Underestimated — bootstrap chicken-egg not yet in pitfalls |

The rubric forecast 1 of 2 actual costs correctly. The miss (Dim #8 underestimate) is exactly the gap pitfall #11 closes.

### Action

**Update the rubric in [05-SCORING_RUBRIC.md](../../05-SCORING_RUBRIC.md) §8 (Loader registration)** with a note: "First-time scaffolds incur a one-time chicken-egg cost (see [08-COMMON_PITFALLS.md] pitfall #11). Predict 90% for first run of new family, 100% for subsequent iters."

This keeps the rubric honest about first-run vs nth-run expectations.

---

## Process improvements (carried to next run)

| # | Improvement | Owner | Priority |
|---|---|---|---|
| P1 | Capture `nx build --stats-json` hashes + durations into `BUILD_EVIDENCE.md` table | orchestrator | High |
| P2 | Add Phase 0 reserved-name grep gate to `06-EXECUTION_PROTOCOL.md` | doctrine | High |
| P3 | Append pitfall #11 (loader chicken-egg) to `08-COMMON_PITFALLS.md` | doctrine | High |
| P4 | Append pitfall #12 (reserved HTMLElement props) to `08-COMMON_PITFALLS.md` | doctrine | High |
| P5 | Author ownership-manifest section in `06-EXECUTION_PROTOCOL.md` parallel-wave docs | doctrine | Medium |
| P6 | Author "types as SSOT, no consumer duplication" rule in `07-INTEGRATION_POINTS.md` | doctrine | Medium |
| P7 | Update `05-SCORING_RUBRIC.md` Dim #8 with first-run note (predict 90% for new family) | doctrine | Medium |
| P8 | Track Tier-3 enhancement: `tools/scripts/scaffold-stencil-component.ts` pre-flight script | tooling | Low (post-MVP) |

---

## Standing-rule confirmations

All standing rules from `MEMORY.md` held cleanly through this run:

- `feedback_no_inline_styles_tokens_only.md` — grep gate clean, no inline styles, no hex/rgb literals.
- `feedback_shadow_is_token_ssot.md` — Shadow + tokens.css mirrored to Tailwind variant; no value drift.
- `feedback_no_ui_testing_during_implementation.md` — zero dev-serve runs, no Playwright/Cypress in scope.
- `feedback_never_commit_without_explicit_permission.md` — working tree dirty, no commits, no pushes.
- `feedback_never_push_without_explicit_permission.md` — same.
- `feedback_angular_only_scope.md` — React/Vue playground demos untouched (out of scope per `project_falcon_cross_framework_demos_inside_workspace.md` scope:demo tag).
- `feedback_clean_code_dry_minimal.md` — zero speculative abstractions; `.utils.ts` deliberately not created.
- `feedback_comment_style.md` — terse banner comments only, no JSDoc walls.

The strategy operates within the standing-rule envelope.

---

_Last updated: 2026-05-14 — Run: 2026-05-14_falcon-empty-data — Strategy: v1.0 — Author: Adnan (auto)_
