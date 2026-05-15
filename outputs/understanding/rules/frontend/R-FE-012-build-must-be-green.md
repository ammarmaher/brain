---
ruleId: R-FE-012
name: Build must be green — nx build exit 0 required
category: operational
scope:
  apps:
    - admin-console
    - host-shell
    - management-console
  paths:
    - "apps/**"
    - "libs/**"
  exemptPaths: []
severity: must
detector:
  type: structural
  patterns:
    - 'nx build admin-console --configuration=development exit code != 0'
    - 'nx build host-shell --configuration=development exit code != 0'
    - 'nx build management-console --configuration=development exit code != 0'
    - 'nx build falcon-ui-core exit code != 0'
    - 'build output contains "error TS" or "error NG" or "Module not found" or "Errors while compiling"'
  exemptPatterns:
    - 'length: typehint advisories (Tailwind v4)'
    - 'google-libphonenumber CommonJS notice'
    - 'change-password.models.ts unused-include'
    - '@Prop title is reserved (Stencil advisory)'
  description: Runs nx build for each app + the Falcon UI Core library with UV_THREADPOOL_SIZE=128 (Windows EMFILE workaround). Any non-zero exit code or error-class line in output is a violation. Warnings in the standing exemption list are not blockers.
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Read the build error output. Resolve every error TS####, Cannot find module, duplicate-export, and Errors while compiling. Re-run the build until exit 0. Do not bundle the fix with new feature work.'
relatedRules: []
source:
  - file: feedback_build_must_be_green.md
    location: memory
  - file: feedback_always_build_zero_errors.md
    location: memory
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-FE-012 — Build must be green ***
*** Source: feedback_build_must_be_green (2026-05-08) + feedback_always_build_zero_errors ***
*** Detector: structural (build runner + exit code + error grep) ***

# R-FE-012 — Build must be green — `nx build` exit code 0 required

## What it says

Every phase, every wave, every reported "done" MUST end with `nx build <app> --configuration=development` passing with exit code 0 for every app touched by the change AND for `falcon-ui-core`. No row in WAVE-2-PLAN.md (or any phase tracker) is marked ✅ until both `nx build falcon-ui-core` and `nx build host-shell` (plus any other touched app) pass cleanly. Warnings on the standing exemption list are acceptable; introduced errors are not.

## Why it exists

- The user runtime-tests every component on `/playground` after a phase lands. A red build means the dev server serves stale bundles (proven by Wave 1's textarea HMR-stuck issue) or fails to recompile entirely.
- Multiple prior turns have shipped "applied" / "wired" reports with hidden TypeScript errors, missing imports, template type mismatches, or duplicate exports — forcing the user to copy-paste compiler output back. Build verification catches these locally before the user ever opens the app.
- The user has explicitly authorised running `nx build` for verification — it is NOT considered "running dev-serve" (which remains off-limits during implementation per `feedback_no_ui_testing_during_implementation.md`).

## Detector strategy

Structural runner:

1. Identify apps touched by the diff (`apps/<app>/...` paths).
2. For each touched app + `falcon-ui-core` library, run:
   ```
   UV_THREADPOOL_SIZE=128 npx nx build <target> --configuration=development
   ```
   (the `UV_THREADPOOL_SIZE=128` is the Windows EMFILE workaround established in Wave 1 logs).
3. Capture stdout + stderr + exit code.
4. Scan output for blocker patterns:
   - `error TS\d+`
   - `error NG\d+`
   - `Cannot find module`
   - `Module not found`
   - `Errors while compiling`
   - `Duplicate identifier`
   - Any non-zero exit code
5. Output any blocker → violation. Warnings on the standing exemption list → ignored (logged FYI).

## Standing warning exemptions (NOT blockers)

These print as warnings but the build does NOT fail on them. Detector ignores:

- `length:` typehint advisories (Tailwind v4) — in cleanup queue
- `google-libphonenumber` CommonJS notice — pre-existing, unrelated
- `change-password.models.ts` unused-include — pre-existing, unrelated
- Stencil `@Prop title is reserved` advisory — kept for API ergonomics, logged in Wave 1

## Blocker patterns (MUST fix immediately)

- `error TS####` from any `.ts` / `.tsx` file
- `Cannot find module` from any `import`
- `[webpack-dev-server] ERROR ... Errors while compiling. Reload prevented.`
- Any non-zero exit code from `nx build`

## Examples

### ✅ Good

```
$ UV_THREADPOOL_SIZE=128 npx nx build host-shell --configuration=development

> nx run host-shell:build:development
✓ Browser application bundle generation complete.
✓ Index html generation complete.
Build at: 2026-05-16T12:34:56.123Z - Hash: fcbef6de9dbc5d9f - Time: 14237ms

Warning: bundle 'styles' exceeded recommended budget (kept under exemption rules)

> NX Successfully ran target build for project host-shell (15s)
```
Exit code: 0 → ✅

### ❌ Bad

```
$ UV_THREADPOOL_SIZE=128 npx nx build host-shell --configuration=development

ERROR in apps/host-shell/src/app/user-row.component.ts:14:23
  error TS2305: Module '"@falcon/ui"' has no exported member 'FalconAvatar'.

ERROR in apps/host-shell/src/app/user-row.component.html:8:3
  error NG8001: 'falcon-button' is not a known element.

> NX Failed to run target build for project host-shell.
```
Exit code: 1 → ❌ Phase NOT marked done until fixed.

## Known legitimate exemptions

- Warnings listed in the standing exemption block above
- Any specific build advisory entered in `exemptions/EXEMPTIONS.md` against `R-FE-012` with an expiry date

## Fix recipe

On a red build:

1. Read the build output from the bottom up — the first error is usually the cause; downstream errors often resolve themselves.
2. **Do NOT bundle the fix with new feature work.** Dispatch a focused fix-only pass: read the error, fix the cause, re-run the build.
3. Common fixes:
   - `error TS2305 / TS2307` (missing member / module) → add missing export to the barrel, or correct the import path
   - `error TS2322 / TS2345` (type mismatch) → update the type or coerce explicitly
   - `error NG8001` (unknown element) → import the component module into the host module
   - `Duplicate identifier` → resolve the import collision (alias or remove duplicate export)
4. Re-run `nx build`. Iterate until exit 0.
5. Then — and only then — mark the phase ✅.

## Related rules

This rule is operational and stands alone; it gates every other frontend rule's "done" report.

## Sources of truth

1. `memory/feedback_build_must_be_green.md` — locked 2026-05-08, hardened pattern + exemption list
2. `memory/feedback_always_build_zero_errors.md` — same rule from an earlier session, broader scope
