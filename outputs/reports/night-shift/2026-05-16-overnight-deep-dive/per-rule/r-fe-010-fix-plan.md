---
ruleId: R-FE-010
ruleName: Comment style — short banner format only
severity: nice
violationCount: unknown_pending_llm_pass
estimatedEffort: small
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Comments must be terse and use the star-banner format (`/*** ... ***/`) or single-line `//` with non-obvious context — no JSDoc multi-paragraph blocks, no "see also" references, no rationale essays, no narration of obvious code.

## 2. What we found (counts + top 5 offender files)

Regex pre-pass on `C:\Falcon\Falcon\falcon-web-platform-ui\apps`:

| Detector pattern | Hits |
|---|---|
| Lines starting with `/**` (JSDoc-opening OR banner-opening — needs LLM verdict) | 1145 across 148 files |
| `TODO:` or `FIXME:` comments | 5 across 4 files |

**Crucial finding:** the codebase already uses the canonical `/*** ... ***/` banner format heavily — sampled `org-hierarchy-page-menu.component.ts` line 1: `/*** OrgHierarchyPageMenuComponent — admin-console Org Hierarchy page menu shell. ***/`. The regex pre-pass cannot distinguish `/** JSDoc */` from `/*** banner ***/` reliably — both match `^/\*\*`. A pure-mechanical count grossly overstates the true violation surface.

**Real violation count is unknown without an LLM pass** to triage each match into:
- `OK_TERSE_BANNER` (`/*** ... ***/` one-liner) — likely the majority
- `OK_INLINE_SINGLE_LINE` (`// short context note`)
- `VIOLATION_VERBOSE_JSDOC` (multi-line JSDoc paragraph)
- `VIOLATION_RESTATES_CODE`
- `VIOLATION_RATIONALE_ESSAY`

Top 5 candidate-dense files (by `/**` line count — pending LLM verdict):

1. `apps/admin-console/.../org-hierarchy-page-menu.component.ts` — 76 hits (sampling shows these are banner-format, likely all `OK`)
2. `apps/admin-console/.../tab-components/applications-table/applications-table.component.ts` — 62 hits
3. `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/registry.ts` — 53 hits
4. `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` — 51 hits
5. `apps/admin-console/.../falcon-org-chart/falcon-org-chart\falcon-org-chart.component.ts` — 1 hit (low; example of clean file)

TODO/FIXME survey:
- 5 hits total in 4 files — 3 in `environment.staging.ts` (likely legitimate environment-config TODOs) and 2 in `playground.page.ts` (playground experimental).

## 3. Why this matters (the architectural cost of leaving it)

The user reviews diffs carefully (`feedback_comment_style`); verbose JSDoc and rationale essays produce review fatigue. Self-documenting code with banner section-headers + minimal `//` is the contract — every long comment is potential signal noise.

That said: severity is `nice` (lowest). This rule is hygiene polish, not a blocker. Worth doing in a focused pass; not worth blocking other work for.

The TODO/FIXME backlog of 5 is small enough to triage manually in a morning sweep.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Run an LLM-assisted classification pass.** This is the only realistic detector for this rule. Pseudo-script:
  ```
  rg -n --type ts '^\s*/\*\*' apps libs > audit/r-fe-010-candidates.txt
  ```
  For each match, fetch a 20-line context window, ask an LLM to classify per the verdict template in the rule's frontmatter. Save results to `audit/r-fe-010-verdicts.jsonl`.

- **Step 2 — Filter to actionable violations.** Keep only `VIOLATION_VERBOSE_JSDOC`, `VIOLATION_RESTATES_CODE`, `VIOLATION_RATIONALE_ESSAY`. Expected: a small fraction of the 1145 (most are likely banner-shaped already).

- **Step 3 — Fix verbose JSDoc.** For each true verbose-JSDoc block:
  - If the doc-block adds no information the code lacks → delete.
  - If it captures implementation rationale → move to a sibling `.notes.md` (or a Brain Outputs file) and replace with a one-line banner pointer.
  - If it's a high-level section header → rewrite as banner: `/*** <one-line summary> ***/`.

- **Step 4 — Fix code-restatement comments.** Delete. Rename variables/extract methods if a clear name eliminates the need.

- **Step 5 — TODO/FIXME triage.** For each of the 5 hits:
  - `playground.page.ts` (2) — playground is sandbox; convert to `<!-- noor:exempt -->` or accept.
  - `environment.staging.ts` (3) — likely "TODO: replace before staging-prod cutover" markers; either complete the work or move to a project tracker.

- **Step 6 — Add a CI lint** (out of immediate scope, but plan): an ESLint rule banning `^/\*\*\s*$` followed by 3+ comment lines could catch new JSDoc blocks before merge. File as a backlog item.

- **Step 7 — Build verification not needed** for this rule (comments don't affect build) but run `nx build` for sanity since file edits happened.

## 5. Estimated effort + complexity rationale

**small** — Most of the 1145 hits are already banner-format. The LLM verdict pass is the expensive step (cost-wise) but produces a small actionable list. Once filtered, fixing the actual violations is mechanical: read, delete or rewrite, save. Realistic: 3–4 hours, of which most is the LLM pass itself.

## 6. Rollback hint (how to undo if the fix is wrong)

Comment-only changes are pure cosmetic. `git diff` shows every removed/rewritten comment; per-file revert if a deletion turns out to have removed actually-useful information.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  # Expect verdict file with mostly OK_* and a small VIOLATION_* tail
  Get-Content audit/r-fe-010-verdicts.jsonl | ConvertFrom-Json | Group-Object verdict | Format-Table
  # Sanity: builds still pass
  UV_THREADPOOL_SIZE=128 npx nx build admin-console --configuration=development
  ```
- expected output:
  - Verdict distribution: `OK_TERSE_BANNER` >> `OK_INLINE_SINGLE_LINE` > `VIOLATION_*`
  - Build: exit code 0

## 8. Risk flags (anything that could break)

- **Banner format `/*** ... ***/` matches the JSDoc opener regex** — pure-regex enforcement will produce massive false positives. LLM judgment is required.
- **Deleting "useless" comments can erase context.** Before deletion, verify there's no implementation rationale that should move to a `.notes.md` sibling. When in doubt, keep.
- **`*.d.ts` files** may legitimately use ambient JSDoc for tooling/IntelliSense — they're exempt per the rule.
- **Public library API surfaces in `libs/falcon-ui-core/**`** may use JSDoc for Storybook/Showcase metadata generation — verify before removing; exempt where needed.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-011** — clean-code DRY/minimal — the partner rule from `feedback_comment_style` + `feedback_clean_code_dry_minimal`; self-documenting code beats narration
- **R-FE-009** — folder structure pattern — same author, same era, same hygiene goal
- **R-FE-012** — build is unaffected by comment changes but run anyway for hygiene
