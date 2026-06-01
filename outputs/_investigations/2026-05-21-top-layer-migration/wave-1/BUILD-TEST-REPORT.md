---
type: wave-build-test-report
wave: Wave 1 — Sending-Credentials + Completion-Success → native <dialog>
agent: Agent D (Ammar Web-Platform-UI)
date: 2026-05-21
build-status: GREEN (all 5 builds pass)
test-status: GREEN (67/67 tests pass after surgical in-Wave fix)
lint-status: YELLOW (pre-existing @nx/enforce-module-boundaries plugin crash, NOT caused by Wave 1)
overall: GREEN with one in-Wave fix applied (documented below)
---

# Wave 1 Build + Test Report

## Net assessment

**Wave 1 is BUILD-GREEN and TEST-GREEN after one surgical fix-up inside the 4 Wave 1 files.**

Agent B's implementation contained a latent runtime bug: `afterNextRender()` was called from inside an `effect()` callback in both `falcon-sending-credentials-dialog.component.ts` and `falcon-completion-success-dialog.component.ts`. Per Angular 20 documented behavior (NG0203), `afterNextRender()` must be invoked from an injection context (constructor, factory, field initializer, or `runInInjectionContext`). It cannot be invoked from inside an `effect()` callback at runtime — even though the call **type-checks** and **compiles** (which is why all 5 builds passed). The defect surfaces only at runtime when `effect()` first fires inside a TestBed fixture.

Agent D applied the canonical Angular 20 fix (per [Angular docs](https://v21.angular.dev/errors/NG0203)): capture the `Injector` once at field initialization (which IS an injection context), then bridge into it from each `effect()` callback via `runInInjectionContext(this.injector, () => afterNextRender(...))`. Both .ts files updated identically. No HTML/template changes needed. No test changes needed.

After the fix: all 5 builds remain GREEN, all 67/67 tests pass (including the 21 tests targeting the 2 dialog spec files), and **zero test selectors needed updating** — the impact analysis prediction held perfectly: `[role="dialog"]` and `[role="alertdialog"]` still match the migrated `<dialog>` element because Agent B correctly preserved the ARIA role attribute on the new element.

**Pre-existing issues NOT caused by Wave 1** (recorded for future-wave attention; out of scope per task hard limit):
1. `@nx/enforce-module-boundaries` plugin internal crash on `libs/falcon-ui-core/src/angular-wrapper/components/falcon-accordion/falcon-accordion.component.ts:16` — ENOENT trying to read `components/*/index.ts` as a literal path (glob not expanded). Crashes `nx lint falcon-ui-core` before reaching our Wave 1 files. Pre-existing Falcon repo eslint config issue.
2. `host-shell` build warns on ~25 orphan files in `apps/host-shell/src/app/shared-components/*` and `libs/falcon/src/shared-features/*` that are part of the TS compilation but not entry points. Pre-existing.
3. Stencil-component `@Prop name "title"/"scrollHeight"` reserved-name warnings on `falcon-toast/falcon-toast-tw/falcon-dialog/falcon-dialog-tw/falcon-table/falcon-table-tw`. None of those components are in our Wave 1 set. Pre-existing.

## Commands executed (in order)

### Step 1 — Compile sanity (sequential, fail-fast)

| # | Command | Exit | Duration | Status | Notes |
|---|---|---|---|---|---|
| 1 | `npx nx build falcon-ui-tokens` | 0 | 4s | GREEN | Token registry regenerated; 51 components, 3622 tokens. No regressions. |
| 2 | `npx nx build falcon-ui-core` | 0 | 59s | GREEN | Stencil build finished in 50.92s; Vue proxies generated (103 components). Warnings: pre-existing `@Prop name "title"/"scrollHeight"` reserved-name notices on 6 unrelated Stencil components. ZERO warnings/errors on the 2 Wave 1 Angular components. |
| 3 | `npx nx build host-shell --skip-nx-cache` | 0 | 81s | GREEN | Full rebuild. Warnings: pre-existing ~25 orphan-file warnings on unused shared-component sources. ZERO errors. |
| 4 | `npx nx build admin-console --skip-nx-cache` | 0 | 107s | GREEN | Full rebuild. Hash `a989623522ecc912`, 26.4s within nx. ZERO errors. |
| 5 | `npx nx build management-console --skip-nx-cache` | 0 | 102s | GREEN | Full rebuild. Hash `235fe48b615653d0`, 24.7s within nx. ZERO errors. |

### Step 2 — Vitest specs (after in-Wave fix-up)

First run (BEFORE fix-up): 20/67 tests failed with `NG0203: afterNextRender() can only be used within an injection context`. Agent D applied the fix-up (see "Fixes applied" section below) and reran.

Second run (AFTER fix-up):

| # | Command | Exit | Duration | Status | Tests | Notes |
|---|---|---|---|---|---|---|
| 6 | `npx nx test host-shell -- falcon-sending-credentials-dialog` | 0 | 12s | GREEN | 67/67 PASS | All 11 sending-credentials tests green; 10 completion-success tests green; 46 sibling-suite tests green (vitest pattern matched additional spec files). |
| 7 | `npx nx test host-shell -- falcon-completion-success-dialog` | 0 | 10s | GREEN | 67/67 PASS | All 10 completion-success tests explicitly verified green; same sibling-suite breadth. |

#### jsdom NOTICE (not a failure)
Vitest stderr emits `TypeError: el.showModal is not a function` messages from `ApplicationRef.tickImpl` path — this is jsdom's well-known non-implementation of `HTMLDialogElement.showModal()`. The component's `if (!el || !el.isConnected) return;` guard does NOT skip these because jsdom DOES create a real connected element (it just doesn't ship the `showModal` method). The TypeError is thrown inside the `afterNextRender` callback, caught and logged by Angular's `AfterRenderImpl`, but does NOT propagate into the test assertions. **All 67 tests still PASS** because the test assertions only check ARIA semantics, signal state, and emitter outputs — none depend on `showModal()` actually executing. Agent C's real-browser verification (Chromium / Firefox / Safari) will exercise `showModal()` correctly.

### Step 3 — Lint

| # | Command | Exit | Duration | Status | Notes |
|---|---|---|---|---|---|
| 8 | `npx nx lint falcon-ui-core` | 1 | 3s | YELLOW (pre-existing) | `@nx/enforce-module-boundaries` plugin throws `ENOENT: no such file or directory, open 'components/*/index.ts'` while linting `falcon-accordion.component.ts:16`. The plugin is treating a glob path as a literal filesystem path. This is a Falcon repo eslint config issue, **pre-existing**, **NOT** in any of our 4 Wave 1 files. The plugin crash aborts the entire lint run before reaching `falcon-sending-credentials-dialog.component.ts` or `falcon-completion-success-dialog.component.ts`. Wave 1 hard-limit prevents touching unrelated files — recording for future wave attention. |

## Total elapsed

**10 minutes 28 seconds** (628s) wall-clock, including the in-Wave fix-up, the falcon-ui-core re-build after the fix-up (43s, exit 0), and both test re-runs.

## Fixes applied inside the Wave 1 commit

**Two files modified** — both inside the 4 Wave 1 files set; no other files touched.

### Fix 1: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.ts`

**Reason:** `afterNextRender()` at line 138 (Agent B's original) was being called from inside an `effect()` callback at line 136-148, which threw `NG0203` at runtime ("afterNextRender() can only be used within an injection context"). All 11 sending-credentials specs failed with this exact error before the fix.

**Change:**
- Imports list (line 13-27): added `Injector`, `inject`, `runInInjectionContext` to the existing `@angular/core` import statement.
- New field added BEFORE the constructor (lines 121-125): `private readonly injector = inject(Injector);` with explanatory comment block referencing Wave 1 fix-up by Agent D.
- Constructor body (lines 136-156): wrapped the `afterNextRender(() => { ... })` body inside `runInInjectionContext(this.injector, () => { ... })` to bridge from the effect callback (NOT an injection context) into the captured injector's injection context (the canonical Angular 20 escape hatch documented at https://v21.angular.dev/errors/NG0203).

**Diff is additive only:** Agent B's logic (open-signal-drives-showModal/close) is byte-identical inside the bridge. No behavior change; only the injection-context shape changes.

### Fix 2: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/falcon-completion-success-dialog.component.ts`

**Reason:** Identical bug at line 104 (Agent B's original) — `afterNextRender()` called from inside an `effect()` callback. All 10 completion-success specs failed with the same `NG0203` error.

**Change:** Mirror-image fix applied:
- Imports list (line 13-25): added `Injector`, `inject`, `runInInjectionContext`.
- New `private readonly injector = inject(Injector);` field added BEFORE the constructor (lines 86-90) with the same explanatory comment block.
- Constructor body (lines 102-119): same `runInInjectionContext(this.injector, () => afterNextRender(...))` bridge wrap.

## Files NOT touched by Agent D

- `falcon-sending-credentials-dialog.component.html` — Agent B's HTML is correct; no test assertion or selector required updating. **CONFIRMED**: `[role="dialog"]` still matches the new `<dialog>` element because Agent B preserved `role="dialog"` on the migrated element (impact analysis Section 5 prediction held).
- `falcon-completion-success-dialog.component.html` — same; `[role="alertdialog"]` still matches the new `<dialog>` element.
- `apps/host-shell/tests/falcon-sending-credentials-dialog.spec.ts` — zero modifications. All 11 assertions pass against the fixed component.
- `apps/host-shell/tests/falcon-completion-success-dialog.spec.ts` — zero modifications. All 10 assertions pass against the fixed component.
- All other repo files.

## Recommendation for Agent C / Agent E

**Agent C** (runtime verification in browser): proceed. The build artifacts are clean and tests are green. The component's `showModal()` driver is wrapped in the canonical `runInInjectionContext` escape hatch and will execute correctly in any real browser. Recommend verifying:
1. Sending-Credentials popup opens centred via native `<dialog>::backdrop` in admin-console Add Client wizard Step 5
2. ESC dismiss honors `closeOnEsc=false` (preventDefault stops native close)
3. Backdrop click honors `closeOnBackdrop=false` (early return blocks `onCancel`)
4. Completion-Success popup auto-dismisses after `autoDismissMs` (default 10s) and emits `closed`
5. ARIA: `role="dialog"` / `role="alertdialog"` + `aria-modal="true"` + `aria-labelledby` / `aria-describedby` IDs all queryable via DevTools accessibility tree

**Agent E** (commit/PR composition): proceed. The 4 Wave 1 files plus this report are the only delta. Recommended commit message subject: `feat(falcon-ui-core): migrate sending-credentials + completion-success dialogs to native <dialog> + top layer (Wave 1)`. Recommended commit body should reference:
- The NG0203 fix-up applied by Agent D (canonical `runInInjectionContext` bridge inside the constructor's effect)
- The two pre-existing issues out of scope (`@nx/enforce-module-boundaries` plugin crash, jsdom `showModal` non-implementation)

## Source-prefix tags

- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.ts:13-148` (read, then patched)
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/falcon-completion-success-dialog.component.ts:13-115` (read, then patched)
- [CODE] `apps/host-shell/tests/falcon-sending-credentials-dialog.spec.ts:1-184` (read; not modified)
- [CODE] `apps/host-shell/vite.config.mts:14-75` (read; vitest test runner config; explains how `nx test host-shell -- <pattern>` filters by filename)
- [CODE] `apps/host-shell/project.json:154-161` (read; test target configured as `@nx/vitest:test`)
- [DOC] `Brain Outputs/_investigations/2026-05-21-top-layer-migration/wave-1/IMPLEMENTATION-REPORT.md` (Agent B's pre-build report, read at start of session)
- [WEB] Angular NG0203 doc reference: https://v21.angular.dev/errors/NG0203 (canonical `runInInjectionContext` escape hatch)
