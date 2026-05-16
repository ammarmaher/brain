---
type: patterns-index
runId: 2026-05-16-overnight-deep-dive
generatedBy: Agent C — Falcon Overnight Brain Job
targetRepo: C:\Falcon\Falcon\falcon-web-platform-ui
ammarAgent: ammar-web-platform-ui
patternCount: 18
totalEstimatedReach: ~370 occurrences across ~50 files
totalEstimatedEffortHours: ~35
---

# Falcon Frontend Refactor Patterns — Night Shift 2026-05-16 Deep Dive

18 reusable refactor patterns surfaced by Agent C during the overnight deep-dive of `falcon-web-platform-ui`. Each pattern is a one-time refactor template that eliminates a class of rule violations across many files; landing them in the recommended order is the fastest path from "polished but rule-non-conformant" to "rule-conformant".

## All patterns (sorted by priority then by leverage)

| # | Pattern | Rules | Reach | Effort (h) | Priority |
|---|---|---|---|---|---|
| [01](PATTERN-01-raw-input-to-falcon-input.md) | Raw `<input>` → `<falcon-angular-input>` | R-FE-005, R-FE-006 | 13 / 7 | 1.5 | **high** |
| [02](PATTERN-02-raw-button-to-falcon-button.md) | Raw `<button>` → `<falcon-angular-button>` | R-FE-005, R-FE-006, R-FE-004, R-NOOR-006 | 87 / 18 | 5 | **high** |
| [03](PATTERN-03-inline-style-to-tailwind.md) | Inline `style="…"` → Tailwind + tokens | R-FE-003, R-FE-004 | 22 / 4 | 2.5 | **high** |
| [04](PATTERN-04-scss-file-to-tailwind.md) | Component `.scss` → Tailwind utilities | R-FE-001, R-FE-002 | 13 scss files | 5 | **high** |
| [06](PATTERN-06-hex-color-to-token.md) | Hardcoded hex colour → token class | R-FE-004, R-NOOR-005 | ~25 / 10 | 1.5 | **high** |
| [12](PATTERN-12-host-shell-auth-scss-rebuild.md) | Auth feature SCSS cluster rebuild (batches PATTERN-01/02/04/06/07/11) | R-FE-001/002/004/005/006, R-NOOR-007 | 5 features | 3 | **high** |
| [05](PATTERN-05-arbitrary-px-class-to-token.md) | Arbitrary `[Npx]` Tailwind values → tokens | R-FE-004, R-FE-001 | ~98 / 23 | 5 | medium |
| [07](PATTERN-07-physical-margin-padding-to-logical.md) | Physical `ml-*/mr-*` → logical `ms-*/me-*` | R-NOOR-007 | 8 / 7 | 0.5 | medium |
| [08](PATTERN-08-feature-services-folder.md) | Loose `*.service.ts` → `services/services.ts` | R-FE-009 | 16 files | 2 | medium |
| [10](PATTERN-10-close-button-replaced-by-closable.md) | Manual close button → `[closable]` on host | R-FE-005, R-FE-006 | 6 places | 0.5 | medium |
| [11](PATTERN-11-falcon-icon-class-to-icon-component.md) | `<i class="falcon-icon">` → `<falcon-angular-icon>` | R-FE-005, R-FE-006 | 38 / 11 | 1.5 | medium |
| [13](PATTERN-13-host-shell-layout-scss-rebuild.md) | host-shell layout SCSS rebuild (high-risk) | R-FE-001, R-FE-002 | 5 files | 3 | medium |
| [16](PATTERN-16-aria-label-to-i18n-key.md) | Hardcoded English `aria-label=` → translated | R-NOOR-007 | 13 / 8 | 0.5 | medium |
| [18](PATTERN-18-table-edit-row-redesign.md) | `falcon-table-edit-row` worst-offender redesign | R-FE-003/004/008, R-NOOR-005 | 1 / 1 | 1 | medium |
| [09](PATTERN-09-jsdoc-to-banner-comment.md) | Verbose JSDoc → `*** ... ***` banner | R-FE-010 | 40 / 8 | 1.5 | low |
| [14](PATTERN-14-tab-template-flex-to-grid.md) | Multi-row flex clusters → CSS Grid | R-FE-008 | 22 files | 3 | low |
| [15](PATTERN-15-falcon-icon-class-default-fallback.md) | `var(--token, #hex)` fallback → drop hex | R-FE-004 | 7 / 4 | 0.25 | low |
| [17](PATTERN-17-ng-deep-scss-purge.md) | `:host`/`::ng-deep` SCSS purge (collateral of 04) | R-FE-002, R-NOOR-008 | 25 / 14 (overlap) | 0 | low |

**Totals**
- Patterns: **18**
- Estimated reach: **~370 occurrences across ~50 files** (after de-overlap)
- Estimated effort: **~35 hours** of focused refactor work (single Ammar agent)

## Recommended execution order

**Group A — quick wins (~6 h, lowest risk):**
1. PATTERN-15 (0.25 h) — drop hex fallbacks
2. PATTERN-07 (0.5 h) — physical → logical margins/paddings
3. PATTERN-16 (0.5 h) — translate aria-labels
4. PATTERN-09 (1.5 h) — JSDoc → banner comments
5. PATTERN-06 (1.5 h) — hex → token classes (cleans up before SCSS purge)
6. PATTERN-11 (1.5 h) — icon class → component
7. PATTERN-08 (2 h) — services/services.ts consolidation

**Group B — template surgery (~14 h, medium risk):**
8. PATTERN-01 (1.5 h) — raw input → falcon-input
9. PATTERN-10 (0.5 h) — closable input on drawers/dialogs
10. PATTERN-02 (5 h) — raw button → falcon-button (skip playground)
11. PATTERN-03 (2.5 h) — inline styles → Tailwind
12. PATTERN-05 (5 h) — arbitrary `[Npx]` → tokens

**Group C — structural rebuilds (~15 h, high risk — land last):**
13. PATTERN-12 (3 h) — auth feature SCSS cluster rebuild (rolls 01/02/04/06/07/11 into one pass)
14. PATTERN-04 (5 h) — remaining SCSS files in `libs/falcon/shared-ui`
15. PATTERN-13 (3 h) — host-shell layout SCSS (largest blast radius)
16. PATTERN-18 (1 h) — falcon-table-edit-row redesign
17. PATTERN-14 (3 h) — flex clusters → Grid (after SCSS purges)
18. PATTERN-17 — auto-resolved by PATTERN-04/12/13 (no separate work)

## Top-of-funnel files (worst-offenders, hit by 5+ patterns)

1. `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` — PATTERN-01/02/06/07/09/11/12/16
2. `apps/host-shell/src/app/features/auth/change-password/change-password.component.html` — same cluster
3. `apps/admin-console/.../wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` — PATTERN-02/05/07/16 (largest `text-[Npx]` density)
4. `apps/admin-console/.../verify/otp-dialog.component.html` — PATTERN-02/03/05/06/10/16
5. `apps/admin-console/.../tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` — PATTERN-02/03/06/14/18 concentrate

## Out-of-scope / explicitly skipped

- `apps/host-shell/src/app/playground/playground.page.html` — dev-time component playground; intentionally low-level.
- `libs/falcon-ui-core/src/components/*.css` — Stencil component CSS, exempt per `libs/falcon-ui-core/CSS-EXCEPTIONS.md`.
- `libs/falcon-theme/src/falcon-tailwind-tokens.css`, `libs/falcon-ui-tokens/**/*.tokens.css` — token files, exempt.
- `libs/falcon-studio/**` — the Studio app legitimately consumes hex literals via its color editor.
- `falcon-web-platform-ui-old`, `deprecated-falcon-web-platform-ui` — discarded per `feedback_discard_old_ui.md`.

## How to read this

- **Reach** = how many occurrences this pattern eliminates (`occurrences / files`)
- **Effort** = estimated total hours to migrate all occurrences
- **Priority** = high/medium/low based on reach ÷ effort + architectural importance
- **Rules** = which rulebook entries this pattern violates (R-FE-001..014, R-NOOR-001..008)

## How to use this index

Each `PATTERN-NN-*.md` is self-contained: anti-pattern, canonical replacement, migration steps, detection regex, components involved, risk + verification. An Ammar agent can take one pattern + a list of target files, do the refactor, run `nx build`, and leave changes staged for review.

For batched groups (PATTERN-12, PATTERN-13), follow the per-pattern checklists in dependency order; do not splinter mid-batch.

After applying a pattern:
1. Update its frontmatter with `status: applied`, `appliedAt: ISO-timestamp`, `commitSha: <sha>` for traceability.
2. Re-run the detection regex from the pattern doc to confirm zero residual matches.

## Related

- [TOP_PRIORITY_FIXES.md](../TOP_PRIORITY_FIXES.md) — ranked morning actions referencing these patterns
- [APPS_RANKING.md](../per-app/APPS_RANKING.md) — which apps benefit from each pattern most
- [BACKUP_AGGREGATES.md](../BACKUP_AGGREGATES.md) — raw counts driving the patterns
