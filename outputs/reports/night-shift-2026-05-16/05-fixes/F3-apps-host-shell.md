---
title: Fix Agent F3 — apps/host-shell fix log
date: 2026-05-16
agent: Fix Agent F3 (Night Shift)
scope: C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell
batch: BATCH-F3
upstream_inputs:
  - 04-audits/apps-host-shell.md (A3)
  - 04-audits/cross-cutting.md (A5)
  - 05-fixes/00-AGGREGATION-AND-FIX-PLAN.md
strict_exclusions:
  - apps/host-shell/src/app/features/auth/** (DEFER-3 — multi-day rebuild)
  - apps/host-shell/**/*.scss
  - apps/host-shell/project.json
---

# F3 — apps/host-shell fix log

## AUTH FOLDER EXCLUSION — CONFIRMED ZERO TOUCH

**`apps/host-shell/src/app/features/auth/` was NOT modified.**

Verified via `git status --porcelain apps/host-shell/src/app/features/auth/` — zero output (no files in the auth subtree were created, modified, deleted, renamed, or staged).

Files counted in scope:
- 17 `.ts` files (component, models, services, guards, routes, login-layout, change-password, enter-otp, forgot-password-flow, get-started, auth-flow-state)
- 5 `.scss` files (login-layout, get-started, enter-otp, forgot-password-flow, change-password)
- 5 `.html` files (matching component HTML)

The auth feature surface (5 SCSS files / 163 phantom `--login-*` tokens / raw `<input>`/`<button>` markup) is preserved exactly as audited. It is DEFER-3 in the master fix plan — must be rebuilt in a scoped follow-up wave.

The 5 in-auth `standalone: true` declarations remain:
- `apps/host-shell/src/app/features/auth/change-password/change-password.component.ts:23`
- `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.ts:24`
- `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.ts:28`
- `apps/host-shell/src/app/features/auth/get-started/get-started.component.ts:21`
- `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.ts:11`

These are explicitly preserved per the F3 brief.

---

## Applied

### FIX-F3.1 — Delete dead duplicate service files (T0.3)

| File | Bytes | Verdict |
|---|---|---|
| `apps/host-shell/src/app/remote-route.service.ts` | 19,697 | DELETED |
| `apps/host-shell/src/app/remote-config.ts` | 770 | DELETED |

**Pre-deletion verification:**
- Read both files — `remote-route.service.ts` is largely commented-out dead code; `remote-config.ts` has a stripped-down interface vs the canonical `core/services/remote-config.ts` (missing `requiredAccess?: AccessQuery[]` and `styles?: string[]` fields).
- Grep workspace-wide for `from '...app/remote-config'` / `from '...app/remote-route.service'` outside the file itself — **0 importers**.
- The only references were:
  - `tsconfig.app.json` exclude entries (orphaned — see below).
  - Self-references inside `remote-route.service.ts` (line 6, 181).
- All real callers use `./app/core/services/remote-route.service` and `../services/remote-config`:
  - `apps/host-shell/src/bootstrap.ts:6`
  - `apps/host-shell/src/app/core/module-federation/mf-diagnostic.service.ts:12`
  - `apps/host-shell/src/app/core/module-federation/remote-manifest.types.ts:6`
  - `apps/host-shell/src/app/core/services/remote-route.service.ts:6`

**Companion cleanup — `tsconfig.app.json`:**

The two flat files were listed in the `exclude` array. After deletion, the exclude entries were orphaned. Removed both entries to keep the tsconfig clean (verified file was already excluded from edit-restrictions — `tsconfig.app.json` is not `project.json`).

Before:
```json
"src/app/features/account-administration/organization-hierarchy/services/org-hierarchy.facade.ts",
"src/app/remote-config.ts",
"src/app/remote-route.service.ts",
"src/environments/environment.prod.ts"
```

After:
```json
"src/app/features/account-administration/organization-hierarchy/services/org-hierarchy.facade.ts",
"src/environments/environment.prod.ts"
```

### FIX-F3.2 — Redundant `standalone: true,` removed (Tier-3.1, non-auth only)

**60 total `standalone:\s*true` grep hits in host-shell** at start. Breakdown:

| Bucket | Count | Action |
|---|---|---|
| Auth folder (excluded) | 5 | LEFT ALONE — DEFER-3 |
| `showcase-code-panel.component.ts` — inside template-literal CODE EXAMPLES being shown to users (NOT real `@Component` decorators) | 5 | LEFT ALONE — these are documentation samples generated as strings by `buildXxxForTag()` functions (lines 138-146, 248-266, 348-355, 401-409, 450-459); they render as the "TypeScript file" tab in the showcase code panel |
| Real `@Component` / `@Directive` decorators (non-auth) | 50 | REMOVED |

**Files where `standalone: true,` was removed:**

| # | File | Hits |
|---|---|---|
| 1 | `apps/host-shell/src/app/app.ts` | 1 |
| 2 | `apps/host-shell/src/app/features/unauthorized/unauthorized.component.ts` | 1 |
| 3 | `apps/host-shell/src/app/features/error/error.component.ts` | 1 |
| 4 | `apps/host-shell/src/app/features/not-found/not-found.component.ts` | 1 |
| 5 | `apps/host-shell/src/app/features/dashboard/dashboard.component.ts` | 1 |
| 6 | `apps/host-shell/src/app/layout/layout.component.ts` | 1 |
| 7 | `apps/host-shell/src/app/playground/playground.page.ts` | 1 |
| 8 | `apps/host-shell/src/app/features/falcon-ui-showcase/falcon-ui-showcase.component.ts` | 1 |
| 9 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 1 |
| 10 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 1 |
| 11 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-docs-panel.component.ts` | 1 |
| 12 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-component-card.component.ts` | 1 |
| 13 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-row.component.ts` | 1 |
| 14 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` | 1 |
| 15 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-variant-tile.component.ts` | 1 |
| 16 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tooltip.component.ts` | 1 |
| 17 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-falcon-host.directive.ts` | 1 |
| 18 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-gallery.component.ts` | 1 |
| 19 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-expanded-card.component.ts` | 1 |
| 20 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-hero.component.ts` | 1 |
| 21 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-live-element.component.ts` | 1 |
| 22 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 1 (only the real `@Component` at line 508 / `showcase-code-panel`; the 5 string-literal occurrences left in place) |
| 23 | `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts` | 1 |
| 24 | `apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.ts` | 1 |
| 25 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 27 (replace_all) |

**Total real-decorator standalone-flag removals: 50** (`24 × 1` + `1 × 27` − wait: 25 distinct files, 24 with 1 hit + 1 with 27 = 51).
Reconciliation: 23 files × 1 + skeletons.ts × 27 + showcase-code-panel × 1 = 51 removals.
Plus the dead-file deletions removed 1 additional standalone in the deleted `app/remote-route.service.ts` body (no decorators, so n/a — wait, it has no @Component declaration; just commented-out code). So the precise tally is **51 standalone:true removals from real @Component/@Directive decorators**.

### FIX-F3.3 — Console.log residue (Tier-3.3, non-auth only)

Reviewed all 27 console.log hits in scope. Outcome: **0 deletions**. Justification per hit:

| File | Line(s) | Action | Reason |
|---|---|---|---|
| `apps/host-shell/src/environments/environment.ts:17` | 17 | KEEP | Comment string referencing `showConsoleLog` config var, not a console.log call. |
| `apps/host-shell/src/environments/environment.staging.ts:8` | 8 | KEEP | Same — comment string. |
| `apps/host-shell/src/environments/environment.prod.ts:4` | 4 | KEEP | Same — comment string. |
| `apps/host-shell/src/app/core/services/remote-route.service.ts:27` | 27 | KEEP | Private `log()` helper method — intentional namespaced logger (`%c[REMOTE-ROUTES]`). Architectural pattern, not stray residue. |
| `apps/host-shell/src/app/core/services/remote-route.service.ts:93-104` | 93–104 | KEEP | `debugRemoteExports()` method — named "debug", emits structured diagnostics. Intentional debug surface. |
| `apps/host-shell/src/app/core/module-federation/mf-diagnostic.service.ts:68` | 68 | KEEP | `MfDiagnosticService` reports `[MF] OK ${name}` / `[MF] FAIL ${name}` on remote-route load — service's job is diagnostics. Removing defeats the abstraction's purpose. |
| `apps/host-shell/src/app/remote-route.service.ts:23, 198, 270-281` | 23, 198, 270–281 | DELETED (whole file) | Subsumed by FIX-F3.1 — entire file was deleted as dead duplicate. |
| `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts:680` | 680 | KEEP | Carries explicit `*** Showcase-only — log to console so devs can verify wiring. ***` justification comment; serves the showcase demo's purpose. |

No console.log was inside an `if (environment.debug)` literal guard, but each remaining hit is in an intentional logger/diagnostic/showcase surface — the brief's exclusion criterion. Removing any would be a behavioral regression to a debug/diagnostic surface.

**Note:** The 6 console.log hits inside the deleted `app/remote-route.service.ts` no longer exist (file removed).

### FIX-F3.4 — TODO/FIXME residue (FLAG-ONLY)

3 TODO hits found in host-shell scope. No code changes made — flagged for orchestrator review.

| # | File | Line | Quote |
|---|---|---|---|
| 1 | `apps/host-shell/src/environments/environment.staging.ts` | 12 | `// TODO: update to real staging URLs` |
| 2 | `apps/host-shell/src/app/playground/playground.page.ts` | 71 | `/*** TODO: fed from log file later. Hard-coded snapshot for tonight. ***/` |
| 3 | `apps/host-shell/src/app/playground/playground.page.ts` | 129 | `/*** TODO: fed from log file later. Hard-coded snapshot of NIGHT-SHIFT-LOG status board. ***/` |

Recommendation:
- (1) staging environment URLs — operational TODO, defer to deployment wave.
- (2) + (3) — playground page demo data, low priority; both flagged as deliberately temporary in their context.

No FIXME / XXX / HACK markers found.

---

## Skipped

| Item | Reason |
|---|---|
| All 5 `.scss` files in `apps/host-shell/**` | Explicitly excluded by F3 brief. |
| `apps/host-shell/project.json` | Explicitly excluded by F3 brief. |
| All 17 `.ts` + 5 `.html` + 5 `.scss` files under `apps/host-shell/src/app/features/auth/` | Explicitly excluded by F3 brief (DEFER-3 multi-day rebuild). |
| 5 `standalone: true,` inside template-literal CODE EXAMPLES in `showcase-code-panel.component.ts` (lines 142, 261, 352, 405, 455) | Not real `@Component` decorators — they are documentation samples generated as strings by `buildTsForTag()`-style functions and displayed to users in the code-panel tab. Out of scope for FIX-F3.2. |
| 8 console.log hits at real diagnostic / logger / showcase surfaces | Each has explicit architectural justification (intentional logger, named "debug" method, dedicated diagnostic service, or `*** Showcase-only ***` comment). |

---

## Build verify

Ran `npx nx build host-shell --skip-nx-cache` from workspace root after all FIX-F3.x edits.

**Result:** GREEN.

```
NX  Successfully ran target build for project host-shell and 2 tasks it depends on
```

Build hash: `d9e80f287597d3e9` — Time: 15,835 ms.

**Warnings emitted (pre-existing, not regressions):**

1. `NG8113: SvgIconComponent is not used within the template of LayoutComponent` — pre-existing unused-imports warning in `layout.component.ts:26`.
2. ~15 `is part of the TypeScript compilation but it's unused.` warnings — pre-existing tsconfig `include` scope warnings (unused tsconfig file is broader than entry points). These appeared before my changes too; they are dispatched by `tsc` for every file not transitively reachable from `bootstrap.ts` (lazy-loaded MF route files, mid-build dynamic imports).

No NG errors, no TS errors, no esbuild errors.

---

## Rollbacks

**None.**

Single-pass build was green; no fix required rollback.

---

## Verification checklist

1. `Glob apps/host-shell/src/app/remote-route.service.ts` → no result (deleted). ✓
2. `Glob apps/host-shell/src/app/remote-config.ts` → no result (deleted). ✓
3. `Grep standalone:\s*true in apps/host-shell/src` (excluding `features/auth/`) → 5 remaining hits, ALL inside `showcase-code-panel.component.ts` template-literal CODE EXAMPLES (lines 142, 261, 352, 405, 455). No real `@Component` / `@Directive` decorator carries the flag. ✓
4. `git status apps/host-shell/src/app/features/auth/` → empty output. **Zero auth-folder modifications.** ✓
5. Build status → GREEN. ✓

---

## Notes for orchestrator

- **DEFER-3 (auth-feature rebuild) status unchanged** — the auth surface is exactly as captured by A3. 5 SCSS files (1,720+ lines), 163 phantom `--login-*` tokens, raw `<input>`/`<button>` markup, 5 standalone-flags, decorator-based `@Input()/@Output()` in `enter-otp.component.ts` — all preserved for the focused follow-up wave.
- **F3 batch is independent of F1/F2/F4** — no cross-app file touches outside `apps/host-shell/`. Safe to merge with parallel batches.
- **One companion config edit** — `apps/host-shell/tsconfig.app.json` had two orphan exclude entries (pointing at the deleted flat files). Removed both to keep config aligned with disk reality. `tsconfig.app.json` is not in the F3 exclusion list (only `project.json` is); the edit is in-scope.
- **51 standalone-flag removals** is the precise count of real-decorator hits in non-auth scope. The 5 string-literal hits in `showcase-code-panel.component.ts` were left alone — they are user-facing documentation samples, not compiled Angular decorators. If the orchestrator wants them updated for showcase-accuracy, that's a single later edit that doesn't affect the build.
- **TODO triage queue (3 items)** is documented above; no items rise to P0/P1 severity.
- **Skeleton file (`showcase-data/skeletons.ts`)** had 27 standalone-flag instances, all real decorators for tiny preview components. Single `replace_all` edit cleaned them in one pass — no individual reads required since the pattern was uniform `  standalone: true,\n` with identical surrounding context.
