---
ruleId: R-FE-013
ruleName: Exclude deprecated UI directories from all operations
severity: must
violationCount: 2
estimatedEffort: trivial
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

No read, edit, build, sync, search, graphify, or agent operation may target `falcon-web-platform-ui-old` or `deprecated-falcon-web-platform-ui` — no `import` / `require` / `tsconfig` `paths` entry may reference them; the active and only frontend is `falcon-web-platform-ui`.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui`:

| Pattern | Hits |
|---|---|
| `falcon-web-platform-ui-old` references | 1 |
| `deprecated-falcon-web-platform-ui` references | 1 |
| Total | **2 files** |

Offender files:

1. `tools/classify-safelist.mjs` — likely uses the deprecated path in a comment or as a literal path constant
2. `docs/_plans/W34-A-settings-tab-plan.md` — planning doc; reference in prose

Critically:
- ZERO `import` / `require` statements in TypeScript source target either deprecated tree
- ZERO `tsconfig.base.json` `paths` entries point at either tree
- `.gitignore` / `.nxignore` exclusion status: needs verification (Step 1 of fix plan)

Per app: irrelevant — this is a workspace-config issue, not per-app.

## 3. Why this matters (the architectural cost of leaving it)

Per `feedback_discard_old_ui` (absolute rule) — the deprecated directories are dead copies. Touching them creates drift: "I edited the file but the change doesn't show", stale search hits, ghost graph nodes, agents producing fixes for retired code paths. Even a single tool ref (e.g. `tools/classify-safelist.mjs` reading from the old tree) silently keeps both alive.

The 2 hits are low risk (one tool script + one planning doc), but the rule is `severity: must` because the cost of leakage compounds — a future agent reading `classify-safelist.mjs` may follow the old-tree path and operate on stale code.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Read both offender files.**
  - `tools/classify-safelist.mjs` — determine whether the reference is in a comment (cosmetic), a `import` statement (functional), or a runtime path string (operational).
  - `docs/_plans/W34-A-settings-tab-plan.md` — likely prose reference; verify whether it's "this used to live in `<old-tree>` — here's the canonical path now" (acceptable historical note) or "go look in `<old-tree>` for ..." (violation).

- **Step 2 — Fix `tools/classify-safelist.mjs`.**
  - If it's a functional dependency → retarget to the canonical `falcon-web-platform-ui` equivalent OR if no equivalent exists and the script is dead code → delete the script.
  - If it's a comment → either delete the comment or rephrase to canonical-path-only.

- **Step 3 — Fix `docs/_plans/W34-A-settings-tab-plan.md`.**
  - If the reference is a historical "as-built note" pointing back at React origin → acceptable, leave with rephrasing if it could be misread as an active path.
  - If the reference is "look here for the source of truth" → fix to canonical.

- **Step 4 — Audit ignore-list coverage.** Verify the following files exclude BOTH deprecated names:
  - `.gitignore` (if present at workspace root or parent)
  - `.nxignore` (Nx workspace exclusions)
  - `nx.json` workspace layout
  - Ripgrep global config (`%USERPROFILE%\.ripgreprc`)
  - Any graphify config

  Add missing exclusions:
  ```
  # .gitignore / .nxignore additions
  falcon-web-platform-ui-old/
  deprecated-falcon-web-platform-ui/
  ```

- **Step 5 — Audit tsconfig paths.** Open `tsconfig.base.json` and `tsconfig*.json` per app. Confirm no `paths` entry maps into deprecated trees. (Step 0 sweep confirmed clean; this is a re-verification.)

- **Step 6 — Re-run detector.** Expected: 0 hits.

## 5. Estimated effort + complexity rationale

**trivial** — 2 file edits + ignore-list verification. The 2 hits are localized; neither is a runtime code path. Realistic: 30 minutes total.

## 6. Rollback hint (how to undo if the fix is wrong)

`git checkout HEAD -- tools/classify-safelist.mjs docs/_plans/W34-A-settings-tab-plan.md` reverts both. The ignore-list additions are pure adds; revert with `git diff` shows the lines added — remove if a previously-included path now goes ignored that shouldn't.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n 'falcon-web-platform-ui-old|deprecated-falcon-web-platform-ui' .
  # Plus sanity for tsconfig paths
  rg -n 'falcon-web-platform-ui-old|deprecated' tsconfig*.json
  ```
- expected output:
  - First `rg`: zero hits (or only inside `.gitignore` / `.nxignore` exclusion lists — those are GOOD hits, not violations)
  - Second `rg`: zero hits

## 8. Risk flags (anything that could break)

- **`tools/classify-safelist.mjs` may be invoked by an automated workflow** — check `package.json` `scripts` and `nx.json` targets before deleting. If it's used (e.g. as part of a Tailwind safelist build step), retarget carefully — the script likely operated on a parallel "old vs new" diff that's no longer relevant.
- **Planning docs are historical** — preserve the value of past decisions while removing any path-leakage. Rephrase rather than delete.
- **Adding ignore-list entries** may inadvertently hide a path that some operation needs (rare; both deprecated names are unambiguous).
- **`.gitignore` at this level may not exist** — frontend workspace may have ignore rules in parent `C:\Falcon\.gitignore` or per-app. Check both.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-014** — same family (canonical-path discipline); both are about excluding non-canonical paths
- **R-FE-012** — verify build still passes after `classify-safelist.mjs` is fixed/removed (the script may participate in safelist generation)
