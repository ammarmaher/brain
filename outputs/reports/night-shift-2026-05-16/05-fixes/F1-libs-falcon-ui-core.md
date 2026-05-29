# Fix Log — F1 libs/falcon-ui-core

**Agent:** Fix Agent F1
**Date:** 2026-05-16
**Scope:** `libs/falcon-ui-core` + `libs/falcon-ui-tokens` (+ 1 explicit cross-cutting hit in `libs/falcon/src/shared-ui/`)
**Build status:** GREEN (`nx build falcon-ui-core` succeeded)

## Applied

| Fix ID | File:line | Before | After | Status |
|---|---|---|---|---|
| F1.1 | `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx:308` | `z-[1000]` (raw arbitrary) | `z-falcon-modal` (canonical 1050 tier per `--z-falcon-modal`) | applied |
| F1.2 | `libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css:144` | `--falcon-org-hierarchy-ctx-menu-z-index: 9999;` | `--falcon-org-hierarchy-ctx-menu-z-index: var(--falcon-overlay-z-index);` (inherits canonical 1400) | applied |
| F1.3 | `libs/falcon/src/shared-ui/lib/directives/falcon-form-validate.directive.ts:45` | `// IMPORTANT: Use bubbling events from the FORM so it catches PrimeNG internal inputs` | `// IMPORTANT: Use bubbling events from the FORM so it catches Falcon shadow/native inputs` | applied |
| F1.4a | `libs/falcon-ui-core/src/tailwind/multi-select-tailwind-classes.ts:319` | (no comment) | added `// local stacking context — not in global z-falcon-* ladder` above `'sticky top-0 z-[1] '` | documented-as-local, not migrated |
| F1.4b | `libs/falcon-ui-core/src/tailwind/stepper-tailwind-classes.ts:114` | (no comment) | added `// local stacking context — not in global z-falcon-* ladder` above `'z-[2]'` | documented-as-local, not migrated |
| F1.4c | `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts:169` | (no comment) | added `// local stacking context — not in global z-falcon-* ladder` above `'absolute inset-0 ... z-[5] '` | documented-as-local, not migrated |
| F1.4d | `libs/falcon-ui-core/src/tailwind/tree-table-tailwind-classes.ts:241` | (no comment) | added `// local stacking context — not in global z-falcon-* ladder` above `'inline-flex ... z-[2] '` | documented-as-local, not migrated |
| F1.4e | `libs/falcon-ui-core/src/components/falcon-multi-select/falcon-multi-select.css:286` | (no comment) | added `/* local stacking context — not in global z-falcon-* ladder */` above `z-index: 1;` (sticky select-all row) | documented-as-local, not migrated |
| F1.4f | `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.css:88,93` | (no comment) | added `/* local stacking context — not in global z-falcon-* ladder */` above both `z-index: 0` and `z-index: 1` (icon-bg + icon-svg) | documented-as-local, not migrated |
| F1.4g | `libs/falcon-ui-core/src/components/falcon-tree-table/falcon-tree-table.css:248` | (no comment) | added `/* local stacking context — not in global z-falcon-* ladder */` above `z-index: 2;` (chevron) | documented-as-local, not migrated |
| F1.4h | `libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.css:81` | (no comment) | added `/* local stacking context — not in global z-falcon-* ladder */` above `z-index: 2;` (circle) | documented-as-local, not migrated |
| F1.4i | `libs/falcon-ui-core/src/components/falcon-tree/falcon-tree.css:203` | (no comment) | added `/* local stacking context — not in global z-falcon-* ladder */` above `z-index: 2;` (chevron) | documented-as-local, not migrated |
| F1.4j | `libs/falcon-ui-core/src/components/falcon-table/falcon-table.css:197` | (no comment) | added `/* local stacking context — not in global z-falcon-* ladder */` above `z-index: 5;` (loading overlay) | documented-as-local, not migrated |
| F1.5 | `libs/falcon-ui-core/src/components/falcon-organization-hierarchy-tree-tw/falcon-organization-hierarchy-tree-tw.tsx:784` | (no comment) | added JSX `/* local stacking context — not in global z-falcon-* ladder */` block comment between `type="button"` and `class="..."` (kept JSX-comment syntax to avoid TSX parser issues; `//` between JSX attributes is not valid) | documented-as-local, not migrated |
| F1.6 | 88 files across `libs/falcon-ui-core/src/angular-wrapper/components/**/*.{component.ts,directive.ts}` and `libs/falcon/src/shared-ui/**/*.{component.ts,directive.ts}` + `libs/falcon/src/language/lib/pipes/translate.pipe.ts` | `  standalone: true,` lines | line removed (Angular v20+ default) | applied — 95 lines deleted total |
| F1.7 | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-select/index.ts:1` | (no comment) | prepended `// DEAD CANDIDATE - flagged Night Shift 2026-05-16 - verify before removal` | flagged only, not deleted |

## Skipped / Deferred

| Fix ID | Reason |
|---|---|
| F1.4 (10 sites: 4 in tailwind/*.ts + 6 in components/*/*.css + 1 in *-tw.tsx) | Local stacking context per brief — comment-flagged in-file, not migrated to global ladder. Total 11 sites including F1.5. |
| F1.7 `FalconMessageService` shim | Verified NOT dead — has 2 active consumers in `apps/host-shell` (`app.config.ts:32` provider + `core/interceptors/response-interceptor.ts:4`). Did NOT flag as dead candidate. |
| F1.7 `falcon-empty-data` vs `falcon-empty-state` duplication | Both have real consumers (`applications-table.component.ts`, `host-shell` showcase, `falcon-data-table.component.ts`). Not dead — needs UX design review per the audit. Did NOT flag. |

## Build verify

- `npx nx build falcon-ui-core --skip-nx-cache` → **GREEN**
- Excerpt: `Successfully ran target build for project falcon-ui-core and 1 task it depends on`
- Build took ~39.2s. Only the pre-existing Stencil reserved-prop warning (`scrollHeight` on `<falcon-tree-table>`) — not introduced by this batch.
- The Stencil pipeline also wrote `libs/falcon-ui-vue/src/index.ts` (99 component proxies) and `libs/falcon-ui-react/src/components.ts` — both regenerated cleanly.

## Verification greps

- `Grep z-\[1000\] in libs/falcon-ui-core/src` → **0 hits** (excluding `.js` artifacts, which were not edited per hard rule).
- `Grep standalone:\s*true in libs/falcon-ui-core/src` → 1 remaining hit at `falcon-confirm-dialog.component.ts:25` — entire file is commented out (every line starts with `//`), so this is NOT a real decorator value. Whole-file comment; left as-is.
- `Grep standalone:\s*true in libs/falcon/src` → **0 hits**.

## Rollbacks

(none) — no fix triggered a build failure.

## Notes for orchestrator

1. **z-index ladder mapping landed:** F1.1 picks `z-falcon-modal` (1050) per the Tailwind `@theme` `--z-falcon-*` ladder in `02-token-registry.md:95-105`. There are TWO ladders in the workspace — the Tailwind `@theme` ladder (1000-1070) drives utility classes, while component-level tokens like `--falcon-overlay-z-index` (1400) and `--falcon-dialog-z-index` (1200) live separately. The brief said "likely `z-falcon-modal` or `z-falcon-overlay`" — modal is the closer semantic match for a backdrop dialog overlay.
2. **F1.2 inherits 1400 (overlay tier):** the ctx-menu now matches the overlay portal ladder. Other consumers of `--falcon-org-hierarchy-ctx-menu-z-index` will auto-cascade — no further edits needed.
3. **F1.4/F1.5 documented-as-local:** 11 single-digit local-stacking z-indexes now have an in-file comment so future audits won't flag them. If the orchestrator decides to add explicit CSS-var tokens (e.g. `--falcon-z-stepper-circle`, `--falcon-z-table-loading-overlay`), each site is now clearly marked for ladder migration.
4. **F1.6 swept 88 files / 95 lines:** Includes Angular wrapper components (`falcon-ui-core`), directives (`falcon-tab-actions`, `falcon-data-table-cell`, `falcon-node-details-actions`), `falcon/src/shared-ui` legacy v1 components/directives, and `translate.pipe.ts`. The shared-ui v1 cluster is still marked for retirement per cross-cutting CC3 — this batch did not touch its other rule violations (SCSS, styleUrl) since those are tier-4 DEFER per the aggregation plan.
5. **F1.7 dead-flag scoped down:** only `falcon-select/index.ts` (re-export barrel) confirmed dead in the workspace (only its own file + a `WAVE-5-GAP-CLOSE.md` doc reference it). Flag-comment added — actual removal awaits UX confirmation.
6. **TSX JSX-comment hazard:** F1.5 originally used `// local stacking...` between JSX attributes, then rewritten to `/* */` block-comment form. Reason: `//` line-comments are not valid between attributes inside a JSX element. The build only proved clean after the rewrite. Future fixers editing `*-tw.tsx` files should prefer `{/* ... */}` JSX comments or block-comments between attribute lines, never `//`.
7. **Build artifacts (.js) untouched:** per the hard rule. They regenerate from Stencil at the next dev/prod build; the build run above already refreshed them.
