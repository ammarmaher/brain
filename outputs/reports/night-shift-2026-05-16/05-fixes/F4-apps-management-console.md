---
title: F4 Fix Log — apps/management-console
fixer: Fix Agent F4
scope_root: C:\Falcon\Falcon\falcon-web-platform-ui\apps\management-console
date: 2026-05-16
mode: APPLY
batch: BATCH-F4
upstream_inputs:
  - 04-audits/apps-management-console.md (A4)
  - 04-audits/cross-cutting.md (A5)
  - 05-fixes/00-AGGREGATION-AND-FIX-PLAN.md
fixes_planned: 3
fixes_applied: 3
build_status: GREEN
rollbacks: 0
---

# §0 — Executive summary

All 3 BATCH-F4 fixes landed cleanly in a single file (`apps/management-console/src/bootstrap.ts`). Build is green on a `--skip-nx-cache` run (hash `9ff968da8cf6f3d3`, 17.766s). Both excluded files (`styles.scss`, `project.json`) were not modified and retain their pre-fix mtime/size. Zero rollbacks.

`bootstrap.ts` is now reduced from 33 lines to 25 lines. The file went from 4 audit findings (1× R-09 `standalone: true`, 1× R-26 `: any`, 1× R-23 debug `console.log`, plus the orphan `ApplicationRef` import) to zero hits on the post-fix Grep verifications.

| Fix ID | Findings closed | Rule(s) | File | Lines (pre-fix) | Outcome |
|---|---|---|---|---|---|
| FIX-F4.1 | F-P2-02, F-P2-03 | R-23 + R-26 | `src/bootstrap.ts` | 28–32 | Block deleted + orphan `ApplicationRef` import dropped |
| FIX-F4.2 | F-P2-01 | R-09 | `src/bootstrap.ts` | 11 | Line deleted |
| FIX-F4.3 | — | R-09 | `src/**/*.ts` (workspace-wide grep) | n/a | No additional hits beyond FIX-F4.2; covered |

---

# §1 — Inputs read

1. `C:\Falcon\Brain Outputs\reports\night-shift-2026-05-16\04-audits\apps-management-console.md` — A4 audit report (4 findings: 1× P0 `styles.scss` deferred + 3× P2 in `bootstrap.ts`).
2. `C:\Falcon\Brain Outputs\reports\night-shift-2026-05-16\05-fixes\00-AGGREGATION-AND-FIX-PLAN.md` — fix plan; F4 scope listed as T0.5 + T3.1 (mgmt portion) + T3.4.
3. `C:\Falcon\Falcon\falcon-web-platform-ui\apps\management-console\src\bootstrap.ts` — confirmed exact lines before editing.
4. `C:\Falcon\Falcon\falcon-web-platform-ui\apps\management-console\tsconfig.app.json` + `tsconfig.json` + `tsconfig.base.json` — strict mode is on but `noUnusedLocals`/`noUnusedParameters` are NOT set; unused-import will not break the build.

Note: Cross-cutting `cross-cutting.md` was not read in full this run — F4 scope is narrowly defined, and the cross-cutting items relevant to management-console (T0.5 + T3.1 mgmt portion + T3.4) are already covered by FIX-F4.1–F4.3.

---

# §2 — Fixes applied

## FIX-F4.1 — Delete router-event console.log firehose
**Closes:** F-P2-02 (R-26 `: any`) + F-P2-03 (R-23 debug `console.log`)
**File:** `apps/management-console/src/bootstrap.ts`

### Before (lines 27–33)
```ts
  .catch((err) => console.error(err))
  .then((appRef) => {
    if (appRef instanceof ApplicationRef) {
      const router = appRef.injector.get(Router);
      router.events.subscribe((ev: any) => console.log('ROUTER EVENT →', ev));
    }
  });
```

### After (line 25)
```ts
}).catch((err) => console.error(err));
```

### Edit operations
1. Removed the `.then((appRef) => { ... })` block in its entirety (4 statements).
2. Collapsed the closing `})` onto the `.catch(...)` line so the chain reads as a single terminator on the bootstrap promise.
3. Dropped the now-orphan `ApplicationRef` named import from line 2: `import { Component, ApplicationRef } from '@angular/core'` → `import { Component } from '@angular/core'`.
4. **`Router` import was NOT removed** — per the brief instruction: *"If a `Router` import becomes unused as a result, leave it in place (a future router-injection may need it; removing is out-of-scope cleanliness)."* The TS strictness config does NOT set `noUnusedLocals`, so the unused `Router` import does not break the build (verified — see §3 below).

## FIX-F4.2 — Redundant `standalone: true,` in bootstrap.ts
**Closes:** F-P2-01 (R-09 Angular v20+ default)
**File:** `apps/management-console/src/bootstrap.ts:11` (pre-fix line numbering)

### Before
```ts
@Component({
  standalone: true,
  selector: 'app-root',
  template: `<router-outlet />`,
  imports: [RouterOutlet],
})
class EmptyHostComponent {}
```

### After
```ts
@Component({
  selector: 'app-root',
  template: `<router-outlet />`,
  imports: [RouterOutlet],
})
class EmptyHostComponent {}
```

Single-line deletion. Component remains `standalone` by Angular v20+ default.

## FIX-F4.3 — Workspace-wide `standalone: true,` sweep in mgmt-console
**Closes:** (none beyond F-P2-01)
**File scope:** `apps/management-console/src/**/*.ts`

Grep pattern `standalone:\s*true` ran across the full `apps/management-console/src/` tree. Pre-fix result: **1 hit** (bootstrap.ts:11). That hit was eliminated by FIX-F4.2. Post-fix grep: **0 hits**. No additional files required editing.

The `apps/management-console/src/app/features/` folder is empty on disk (confirmed by A4 audit §0), so there are no feature-level components carrying redundant `standalone: true` declarations in this app.

---

# §3 — Post-fix verification

## Grep verifications (per brief §"Verification" 1–2)

| Grep | Scope | Pre-fix | Post-fix |
|---|---|---|---|
| `console\.log` | `apps/management-console/src` | 1 (`bootstrap.ts:31`) | **0** |
| `standalone:\s*true` | `apps/management-console/src` | 1 (`bootstrap.ts:11`) | **0** |

Both verifications pass.

## Exclusion confirmation (per brief §"Verification" 3)

| File | Pre-fix mtime | Pre-fix size | Post-fix mtime | Post-fix size | Touched? |
|---|---|---|---|---|---|
| `apps/management-console/src/styles.scss` | 1778705302 | 232 | 1778705302 | 232 | **NO** |
| `apps/management-console/project.json` | 1778876626 | 5385 | 1778876626 | 5385 | **NO** |

Both excluded files retain their pre-fix mtime AND size to the byte. Confirmed untouched.

## Final `bootstrap.ts` (25 lines)
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
/*** Zoneless rollout from Step 3 admin-console pilot: BrowserAnimationsModule (sync) replaced by provideAnimationsAsync(). ***/
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { appConfig } from './app/app.config';

@Component({
  selector: 'app-root',
  template: `<router-outlet />`,
  imports: [RouterOutlet],
})
class EmptyHostComponent {}

bootstrapApplication(EmptyHostComponent, {
  ...appConfig,
  providers: [
    /*** Zoneless rollout from Step 3 admin-console pilot. Zone-detection provider removed; appConfig now provides provideZonelessChangeDetection(). ***/
    importProvidersFrom(BrowserModule),
    provideAnimationsAsync(),
    ...(appConfig.providers ?? []),
  ],
}).catch((err) => console.error(err));
```

Note on residual unused import: `Router` (line 3) is now unused. Left in place per brief instruction. TS `strict: true` does not enable `noUnusedLocals`, so this does NOT produce a build warning either — confirmed by the build output which only shows the three pre-existing environment-file unused warnings.

---

# §4 — Build verify

Command run (per brief):

```powershell
npx nx build management-console --skip-nx-cache 2>&1 | Select-String -Pattern "error|warning|Build complete|ERROR|chunk" | Select-Object -First 100
```

Result: **GREEN**.

- `Successfully ran target build for project management-console and 2 tasks it depends on`
- Build hash: `9ff968da8cf6f3d3`
- Build time: 17,766 ms
- Bundle generation: `Browser application bundle generation complete.` (both passes)
- Errors: **0**
- Warnings: **3 pre-existing** (all about unused `environment.ts`/`environment.prod.ts`/`environment.staging.ts` — these are not regressions, they existed before this fix; they're a known Nx-Angular file-replacements quirk where the variant the active config doesn't replace gets flagged as unused).
- Federation expose: `__federation_expose_management_console.ffac291c6275e7db.js` — 317 bytes raw / 194 bytes transfer. (App is a near-empty MF remote shell — expected.)

No new errors. No new warnings. Build is green.

---

# §5 — Rollbacks

**None.**

The build succeeded on the first attempt with all three fixes applied. No rollback was required.

---

# §6 — SCSS DEFERRED

Per BATCH-F4 hard rules, the following files were **NOT** touched in this run and are explicitly deferred to a later wave:

## `apps/management-console/src/styles.scss`
- **Status:** Untouched. Pre-fix mtime `1778705302`, size 232 bytes. Post-fix mtime `1778705302`, size 232 bytes. **Identical.**
- **Why deferred:** SCSS purge is a multi-file coordinated wave that must also remove `inlineStyleLanguage: "scss"` and the `styles[]` entry from `project.json`. Deleting `styles.scss` alone or together-with-`project.json` is the correct atomic operation but is **outside this batch's scope** per the brief.
- **Audit reference:** A4 F-P0-01 (R-02 "no SCSS in workspace").
- **Memory references:** `feedback_no_inline_styles_tokens_only` (HARDENED 2026-05-05), `project_brain_skills_primeng_purge`.

## `apps/management-console/project.json`
- **Status:** Untouched. Pre-fix mtime `1778876626`, size 5385 bytes. Post-fix mtime `1778876626`, size 5385 bytes. **Identical.**
- **Why deferred:** Bundle with the `styles.scss` removal above. The two lines/blocks that must come out in the same wave are:
  - `"inlineStyleLanguage": "scss"` (line ~18 per A4 audit reference)
  - `"apps/management-console/src/styles.scss"` entry in `styles[]` (line ~39 per A4 audit reference)
- **Future wave acceptance criteria:** SCSS toolchain entirely unwired from management-console (`inlineStyleLanguage` either dropped or set to `css`; `styles[]` no longer references any `.scss` path; `styles.scss` file deleted from disk).

**Both files retain their pre-fix mtime AND byte count to the byte. F4 did not touch SCSS.**

---

# §7 — Cross-references

## Findings closed
| Finding ID | Tier | Rule | A4 §ref | F4 fix |
|---|---|---|---|---|
| F-P2-01 | P2 | R-09 (standalone:true) | A4 §4 | FIX-F4.2 |
| F-P2-02 | P2 | R-26 (`: any`) | A4 §4 | FIX-F4.1 (block deletion subsumes the line) |
| F-P2-03 | P2 | R-23 (debug `console.log`) | A4 §4 | FIX-F4.1 |
| F-P0-01 | P0 | R-02 (SCSS file) | A4 §2 | **DEFERRED** (see §6) |

3 of 4 in-scope findings closed; 1 deferred per brief instruction.

## Aggregation plan mapping
| Plan tier | Item | Status |
|---|---|---|
| T0.5 | `bootstrap.ts:28-32` router event firehose + `: any` | **DONE** (FIX-F4.1) |
| T3.1 (mgmt portion) | Remove `standalone: true,` from mgmt-console — listed as "1 site" | **DONE** (FIX-F4.2 + F4.3 sweep — 1/1) |
| T3.4 | `bootstrap.ts:11` redundant `standalone: true` | **DONE** (FIX-F4.2) |

## Memory references
- `feedback_no_inline_styles_tokens_only` (HARDENED 2026-05-05) — applies to F-P0-01 (deferred).
- `project_brain_skills_primeng_purge` — applies to F-P0-01 (deferred).
- `feedback_clean_code_dry_minimal` — applies to FIX-F4.1 (debug firehose removed).
- `feedback_strict_task_scope` — applies to F4 itself; SCSS-out-of-scope respected.
- `feedback_no_commit_no_push_strict_2026_05_02` — F4 made zero commits and zero pushes.

---

# §8 — Standing rules compliance

| Rule | Status |
|---|---|
| READ before EDIT | ✓ — `bootstrap.ts` read before any edit; `tsconfig.app.json`/`tsconfig.json`/`tsconfig.base.json` read before commenting on unused-import safety |
| DO NOT touch `styles.scss` | ✓ — confirmed via mtime+size diff (identical pre/post) |
| DO NOT touch `project.json` | ✓ — confirmed via mtime+size diff (identical pre/post) |
| DO NOT commit | ✓ — no `git commit` executed |
| DO NOT push | ✓ — no `git push` executed |
| Roll back on build failure | ✓ N/A — build green first try, no rollback needed |

---

# §9 — Open items / handoff to next wave

1. **SCSS purge wave** must bundle:
   - Delete `apps/management-console/src/styles.scss`
   - Remove `"inlineStyleLanguage": "scss"` from `apps/management-console/project.json`
   - Remove `"apps/management-console/src/styles.scss"` from `styles[]` in same file
   - Rebuild and verify green.
2. **Residual unused `Router` import** in `bootstrap.ts:3` — left in place per brief. If a future cleanliness pass enables `noUnusedLocals` workspace-wide, this single import becomes a build error and would need removal (one-line change).
3. **A4 §3 latent items** (informational only, no severity assigned):
   - `index.html:18` `p-rtl` legacy class name → rename to `falcon-rtl` (Noor hygiene)
   - `index.html:23` `<app-management-console-entry>` vs `bootstrap.ts:11` `selector: 'app-root'` — selector mismatch, latent in MF-remote mode but breaks standalone-serve at port 4301.

These are outside BATCH-F4 scope.

---

— Fix Agent F4
