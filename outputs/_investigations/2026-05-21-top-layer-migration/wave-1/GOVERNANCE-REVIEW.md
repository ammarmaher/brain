---
type: wave-governance-review
wave: Wave 1 — Sending-Credentials + Completion-Success → native <dialog>
agent: Agent E / Ammar Web-Platform-UI (governance + sign-off)
date: 2026-05-21
status: SIGN-OFF
verdict: GREEN — WAVE 1 COMPLETE
---

# Wave 1 Governance Review

Independent review against the user's Acceptance Criteria + Hard Limits. Conclusions are formed independently from each report — every finding has its own evidence path.

## Summary

- **Acceptance criteria:** 10 / 10 PASS
- **Hard-limit checks:** 8 / 8 PASS
- **Findings:** 5 SAFE / 0 RISK (with 1 minor housekeeping note that does not block sign-off)
- **Final verdict:** **GREEN — WAVE 1 COMPLETE**

The migration achieves its primary objective (eliminate the z-index bleed-through bug) and earns a measurable a11y bonus (native focus trap eliminating the baseline's 33 escape-able controls). Public API is byte-identical. No unrelated overlays touched. No tokens deleted. No risky architecture changes outside the 2 dialog wrappers.

---

## Acceptance criteria — detailed verification

### AC1. Current screenshot/z-index bug is FIXED — **PASS**

- [DOC] VERIFICATION-REPORT.md Check 1 — DOM probe returns `inTopLayer: true` (the `:modal` pseudo-class matches the live `<dialog>`).
- [DOC] VERIFICATION-REPORT.md Check 1 — `document.elementsFromPoint()` at 4 coordinates (stepper rail x395/y178, left nav x50/y200, top header x1500/y21, Step 5 field x400/y320) all return the `<DIALOG>` as the topmost element.
- [DOC] VERIFICATION-REPORT.md screenshot `ss_7503we5jv` (canonical Wave 1 evidence) vs baseline screenshot `ss_19199287p` — uniform dim everywhere vs visible bleed-through everywhere.
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.html:9` — the migrated `<dialog #dlg role="dialog">` element is the sole child of `@if (open())`, matching the directive.

The root cause identified in BASELINE.md (undefined `--falcon-dialog-z-index` CSS variable resolving to `auto`) is now irrelevant — Top Layer rendering bypasses z-index stacking entirely.

### AC2. Add Client Step 5 flow is runtime verified — **PASS**

- [DOC] VERIFICATION-REPORT.md Check 6 — `WaveOneVerify01 / FIN-W1-VERIFY-01` client created end-to-end (Step 1 → Step 5 → Save → Sending-Credentials dialog → Send Credentials → Completion-Success dialog → panel-click dismiss → new client visible in left tree).
- [DOC] VERIFICATION-REPORT.md screenshot `ss_50359r6p2` — wizard exited and "WaveOneVerify01" present in Falcon Clients tree.
- [DOC] VERIFICATION-REPORT.md screenshot manifest #5–#13 — all five wizard steps progress correctly without compile-error overlays or runtime errors.

### AC3. ESC works correctly — **PASS**

- [DOC] VERIFICATION-REPORT.md Check 2 — ESC pressed → DOM probe `{ dialogStillInDom: false }`.
- [DOC] VERIFICATION-REPORT.md screenshot `ss_3603t0oez` — clean return to Step 5 form, no overlay residue.
- [CODE] `falcon-sending-credentials-dialog.component.ts:200-204` — `onNativeCancel(event)` calls `event.preventDefault()` only when `closeOnEsc()` is false; native close path otherwise emits via `(close)="onCancel()"`.
- [CODE] `falcon-completion-success-dialog.component.ts:155-157` — `onNativeCancel(_event)` is a deliberate no-op (completion-success always allows ESC dismiss per Wave 5.1 contract).

Both ESC paths are wired correctly; the default `closeOnEsc=true` was exercised in the runtime test. The `closeOnEsc=false` branch is exercised by static code reading (the conditional preventDefault is the only path).

### AC4. Backdrop click works correctly — **PASS**

- [DOC] VERIFICATION-REPORT.md Check 3 — click at (200, 600) on backdrop area → DOM probe `{ dialogStillInDom: false }`.
- [DOC] VERIFICATION-REPORT.md screenshot `ss_3377iygkh` — clean dismiss.
- [DOC] VERIFICATION-REPORT.md Check 4 — clicks inside the panel (h3 title at 783/70, radio at 620/230) → `{ dialogOpen: true }` (does NOT dismiss).
- [CODE] `falcon-sending-credentials-dialog.component.ts:209-215` + `falcon-completion-success-dialog.component.ts:162-168` — `onDialogClick` only fires when `event.target === ref.nativeElement` (the dialog itself, i.e. a click that hit the ::backdrop pseudo-element).
- [CODE] `falcon-sending-credentials-dialog.component.html:20` and `falcon-completion-success-dialog.component.html:21` — `<section>` has `(click)="$event.stopPropagation()"` (sending-credentials) or `(click)="onPanelClick(); $event.stopPropagation()"` (completion-success), correctly preventing panel clicks from bubbling.

### AC5. Focus trap works correctly — **PASS**

- [DOC] VERIFICATION-REPORT.md Check 5 — Tab pressed 10 times; every Tab kept focus inside the dialog. Tab order: Send-via-Email radio → SMS radio → Both radio → Cancel button → Send Credentials button → wraps back to Cancel.
- Baseline showed 33 tabbable controls reachable OUTSIDE the dialog → Wave 1 reports 0 tabbable controls reachable outside. Native `<dialog>.showModal()` provides this for free.

### AC6. No major visual regression — **PASS**

Compared the HTML diff (per IMPLEMENTATION-REPORT.md) and the live final state files [CODE] `falcon-sending-credentials-dialog.component.html` + `falcon-completion-success-dialog.component.html`:

- **Panel `<section>` classes preserved** verbatim from baseline (per IMPLEMENTATION-REPORT Section "Preserved verbatim"): `max-w-[880px]` (sending) / `max-w-[560px]` (completion), `bg-falcon-neutral-0`, `rounded-[18px]`, `shadow-[0_24px_60px_rgba(0,0,0,0.18)]`, `px-12 py-12 sm:p-16`, `falcon-sc-panel-in` / `falcon-cs-panel-in`, `max-h-[calc(100vh-3rem)] overflow-y-auto`.
- **Added classes:** `mx-auto my-6` on each `<section>` (replaces centering previously done by outer `.fixed inset-0 grid place-items-center p-6` wrapper). Documented in IMPLEMENTATION-REPORT.md Deviation #3.
- **Backdrop visual style** preserved bit-for-bit: `rgba(13, 63, 68, 0.45)` background + `backdrop-filter: blur(2px)` + `animation: fscBackdropIn 160ms ease-out both` — only the rendering layer changed (Tailwind `<div>` → `dialog::backdrop` pseudo-element). [CODE] sending-credentials .ts:64-68; completion-success .ts:53-57.
- **Animations preserved** verbatim: `fscBackdropIn`/`fscPanelIn` keyframes (sending) + `fcsBackdropIn`/`fcsPanelIn` keyframes (completion) byte-identical in `styles:[]`.
- VERIFICATION-REPORT.md Finding 3 explicitly confirms "Backdrop visual style faithfully preserved" via DOM-probe of computed style.

No deleted Tailwind classes that would cause visual regression. The only removals are the broken `z-[var(--falcon-dialog-z-index)]` (was always `auto`) and the obsolete `fixed inset-0 grid place-items-center p-6 bg-falcon-neutral-900/45 backdrop-blur-[2px]` wrapper (its responsibilities now correctly live on `::backdrop`).

### AC7. No unrelated code changes — **PASS (with housekeeping note)**

`git status --porcelain` returned 5 entries — all from `libs/falcon-ui-core/`:

```
 M libs/falcon-ui-core/package-lock.json
 M libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/falcon-completion-success-dialog.component.html
 M libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/falcon-completion-success-dialog.component.ts
 M libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.html
 M libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.ts
```

The 4 Wave 1 source files are present and modified as expected. The 5th entry — `libs/falcon-ui-core/package-lock.json` — is a build artifact regenerated by npm during one of the 5 builds Agent D ran. Inspection of the diff (33 deletions, no additions) shows only removal of stray `@types/react`, `react`, `react-dom`, `csstype` entries from `node_modules/` mirror sections. This is npm self-cleanup; it is NOT a Wave 1 source-code change and does not introduce any runtime difference (the package.json on disk does not reference these packages).

The IMPLEMENTATION-REPORT.md statement "ZERO other files modified" is slightly imprecise — the report should have explicitly called out the build-artifact regeneration. This is a housekeeping note, not a hard-limit violation. Recommend either reverting `package-lock.json` (`git checkout HEAD -- libs/falcon-ui-core/package-lock.json`) OR including it in the commit with an explanatory note. Either is acceptable.

Cross-checked: NO changes to barrels, NO changes to tests, NO changes to `falcon-wizard-finalization` consumer, NO changes to `apps/host-shell/app.ts`, NO changes to overlay service, NO changes to any other angular-wrapper component, NO changes to Stencil core dialog/drawer/insufficient-balance-dialog. Verified via `git diff HEAD -- libs/falcon-ui-core/src/angular-wrapper/ ":!<4 Wave 1 files>"` returning 0 lines.

### AC8. No early cleanup — **PASS**

- [CODE] `libs/falcon-ui-tokens/src/components/dialog.tokens.css:164` — `--falcon-dialog-z-index: 99999;` definition still present (the comment above explains drawer-tier semantics; no edits).
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.service.ts:52` — `getContainer(): HTMLDivElement` method still present (line 52, body grep-confirmed).
- `git diff HEAD -- libs/falcon-ui-tokens/ libs/falcon-ui-core/src/angular-wrapper/utilities/` returned 0 lines.
- Grep for `falcon-dialog-z-index|falcon-drawer-z-index|falcon-overlay-z-index|falcon-toast-host-z-index|falcon-ib-dialog-backdrop-z` across `libs/` returned 20 files, ALL token/CSS/Stencil/Tailwind files — definitions intact.

### AC9. Build/test status is honest — **PASS**

- [DOC] BUILD-TEST-REPORT.md front-matter explicitly states `build-status: GREEN (all 5 builds pass)` / `test-status: GREEN (67/67 tests pass after surgical in-Wave fix)` / `lint-status: YELLOW (pre-existing @nx/enforce-module-boundaries plugin crash, NOT caused by Wave 1)`.
- [DOC] BUILD-TEST-REPORT.md "Net assessment" section explicitly documents the NG0203 fix-up Agent D applied + cites Angular doc reference https://v21.angular.dev/errors/NG0203.
- [DOC] BUILD-TEST-REPORT.md "jsdom NOTICE" section explicitly discloses `TypeError: el.showModal is not a function` in vitest stderr and explains why tests still pass (assertions don't depend on `showModal()` execution).
- [DOC] BUILD-TEST-REPORT.md Step 3 (lint) explicitly records the YELLOW plugin crash with pre-existing attribution.

No buried issues. The report is fully candid.

### AC10. Final report includes changed files, evidence, screenshots, risks, and next recommendation — **PASS**

Cross-report coverage:

| Aspect | Source |
|---|---|
| Changed files (list of 4) | IMPLEMENTATION-REPORT.md Section "Files touched (4)" |
| Diff summary per file | IMPLEMENTATION-REPORT.md Section "Diff summary per file" |
| Evidence (build) | BUILD-TEST-REPORT.md "Commands executed" + "Total elapsed" |
| Evidence (test) | BUILD-TEST-REPORT.md Steps 6-7 with 67/67 PASS counts |
| Evidence (runtime) | VERIFICATION-REPORT.md Checks 1-6 with DOM probes + screenshot IDs |
| Screenshots | BASELINE.md (18) + VERIFICATION-REPORT.md (20) — referenced by tool-result ID per Chrome MCP save_to_disk limitation |
| Risks (build) | BUILD-TEST-REPORT.md "Pre-existing issues NOT caused by Wave 1" |
| Risks (runtime) | VERIFICATION-REPORT.md "Findings discovered during verification" (3 informational, 0 RISK) |
| Next recommendation | BUILD-TEST-REPORT.md "Recommendation for Agent C / Agent E" + VERIFICATION-REPORT.md "Verdict" |

All five elements are covered across the three reports.

---

## Hard-limit checks

### HL1. Public API changes — **PASS (no violations)**

Reading each `input()` / `output()` declaration from the final-state component .ts files:

- **Sending-Credentials (19 inputs + 2 outputs):** [CODE] lines 74-111 — `open, ownerName, ownerPhone, ownerEmail, defaultDelivery, disableSend, title, subtitle, deliveryLabel, ownerKeyLabel, phoneKeyLabel, emailKeyLabel, sendLabel, cancelLabel, closeAriaLabel, emailMethodLabel, smsMethodLabel, bothMethodLabel, closeOnBackdrop, closeOnEsc` + outputs `cancel, send`. All names, types, and default values match the impact-analysis Section 2 surface inventory byte-for-byte.
- **Completion-Success (6 inputs + 1 output):** [CODE] lines 63-77 — `open, title, subtitle, autoDismissMs, dismissOnOverlayClick, closeAriaLabel` + output `closed`. Surface matches impact-analysis Section 2.
- Selectors: `falcon-angular-sending-credentials-dialog` + `falcon-angular-completion-success-dialog` — both unchanged.
- Type export `FalconCredentialDeliveryMethod = 'email' | 'sms' | 'both'` — preserved at line 34 of sending-credentials .ts.
- `@HostBinding('class.falcon-angular-sending-credentials-dialog')` + `@HostBinding('class.falcon-angular-completion-success-dialog')` — both preserved.

### HL2. Business behavior changes — **PASS (no violations)**

- `closeOnEsc` — honored at [CODE] `falcon-sending-credentials-dialog.component.ts:200-204` (conditional preventDefault on cancel event).
- `closeOnBackdrop` — honored at [CODE] `falcon-sending-credentials-dialog.component.ts:183-188` (existing onBackdropClick early return).
- `disableSend` — honored at [CODE] `falcon-sending-credentials-dialog.component.ts:178-181` (onSend early return).
- `autoDismissMs` — honored at [CODE] `falcon-completion-success-dialog.component.ts:97-106` (existing effect setting timer).
- `dismissOnOverlayClick` — honored at [CODE] `falcon-completion-success-dialog.component.ts:140-145` (existing onBackdropClick early return).

All five behavior gates retain their original conditional semantics.

### HL3. Unrelated overlays touched — **PASS (no violations)**

`git diff --name-only HEAD` returned only:
- 4 Wave 1 source files
- `libs/falcon-ui-core/package-lock.json` (build artifact, not source — see AC7)

No host components touched (`app.ts` notification-host/dialog-host mounts unchanged). No drawer touched. No insufficient-balance-dialog touched. No popover-portal touched. No directive abstractions touched.

### HL4. Z-index tokens deleted — **PASS (no violations)**

Grep returned 20 files containing `falcon-dialog-z-index|falcon-drawer-z-index|falcon-overlay-z-index|falcon-toast-host-z-index|falcon-ib-dialog-backdrop-z`. The canonical definition at [CODE] `libs/falcon-ui-tokens/src/components/dialog.tokens.css:164` is present and unchanged. `git diff HEAD -- libs/falcon-ui-tokens/` returns 0 lines.

### HL5. Tests disabled — **PASS (no violations)**

`git diff HEAD -- apps/host-shell/tests/falcon-sending-credentials-dialog.spec.ts apps/host-shell/tests/falcon-completion-success-dialog.spec.ts` returned 0 lines. BUILD-TEST-REPORT.md explicitly states "ZERO modifications" to both spec files. Selectors `[role="dialog"]` and `[role="alertdialog"]` still match the migrated `<dialog>` elements (verified via grep at .spec.ts:149/155/182).

### HL6. Risky architecture change — **PASS (no violations)**

Changes are scoped strictly to the 2 dialog wrappers:
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/*` (2 files)
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/*` (2 files)

`git diff HEAD -- libs/falcon-ui-core/src/components/falcon-dialog/ libs/falcon-ui-core/src/components/falcon-drawer/ libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/` returned 0 lines. The underlying `falcon-dialog` Stencil core (Wave 4 target) is untouched.

### HL7. Visual result cannot match baseline — **PASS (no violations)**

- [DOC] VERIFICATION-REPORT.md Check 1 confirms the dialog DOM still has `falcon-sc-dialog` + `falcon-sc-backdrop-in` classes on `<dialog>` and the panel `<section>` retains its full Tailwind class set + `falcon-sc-panel-in` animation.
- Visual parity: backdrop dim color + blur identical (`rgba(13, 63, 68, 0.45)` + `blur(2px)`); panel max-width identical; rounded corners identical; shadow identical; padding identical; animation keyframes byte-identical.
- The ONLY visual difference is intentional and is the bug fix: the backdrop now covers the full viewport uniformly (Top Layer) instead of leaving stepper/header/nav/form values legible through it.

### HL8. Security/accessibility risk — **PASS (no violations, with bonus)**

- ARIA preserved: `role="dialog"` + `aria-modal="true"` + `aria-labelledby="falcon-sc-title"` on sending-credentials `<dialog>`; `role="alertdialog"` + `aria-live="polite"` + `aria-labelledby="falcon-cs-title"` + `aria-describedby="falcon-cs-sub"` on completion-success `<dialog>`.
- VERIFICATION-REPORT.md Check 5 confirms native focus trap IMPROVED accessibility (33 → 0 escape-able controls; initial focus moves into the dialog automatically).
- No security risk: the `<dialog>` element is browser-native, audited by browser vendors. `showModal()` is the canonical pattern. No untrusted input is interpolated into HTML in a new way.

---

## Findings analyses

### F1. Agent D's `runInInjectionContext` fix — **SAFE**

- [CODE] `falcon-sending-credentials-dialog.component.ts:134, 147-161` and `falcon-completion-success-dialog.component.ts:93, 113-127` — both `effect()` callbacks bridge into a captured `Injector` via `runInInjectionContext(this.injector, () => afterNextRender(...))`.
- The captured `injector = inject(Injector)` field is initialized at field-declaration time, which IS an injection context per Angular DI rules.
- This is the **canonical Angular 20 escape hatch** documented at https://v21.angular.dev/errors/NG0203 — not a workaround or hack. It is the recommended pattern when you need to call an injection-context-only function (`afterNextRender`, `effect`, `takeUntilDestroyed`, etc.) from a callback whose execution context (microtask, effect callback, async chain) has already left the original injection context.
- The fix introduces NO new public API. The only surface additions are `private readonly injector` (a private field) — invisible to consumers.
- The fix is scoped to the 4 Wave 1 files. No other component was touched.

Recommendation: ACCEPT.

### F2. The Wave 0 baseline finding about `--falcon-dialog-z-index` undefined — **SAFE**

- [CODE] `libs/falcon-ui-tokens/src/components/dialog.tokens.css:164` — `--falcon-dialog-z-index: 99999;` is defined inside `@layer base` (the file's existing layer wrapper). The baseline finding ("token undefined in cascade") was because the token was scoped to `:root` inside a Tailwind layer that may not have been imported into every consumer's cascade — NOT because the token was missing from the source.
- Wave 1 deliberately did NOT delete this token (HL4 verifies). The token remains available for the legacy Stencil dialog/drawer/insufficient-balance-dialog cores that still rely on z-index stacking. Wave 8 cleanup can revisit it after Waves 4-7 are complete.
- The two Wave 1 dialogs no longer reference the token (Top Layer doesn't need z-index), but the rest of the platform still does.

Recommendation: ACCEPT. The token must stay until later waves migrate the remaining dialogs to native `<dialog>`.

### F3. Native focus trap as bonus — **SAFE**

- [DOC] VERIFICATION-REPORT.md Check 5 + Finding 1 — initial focus moves to the first focusable inside the dialog (the "Send via Email" radio); 10 Tab presses all stay inside the dialog (cycles through 5 controls: 3 radios + Cancel + Send).
- The user's Acceptance Criteria did not explicitly request a focus trap, but the baseline (BASELINE.md) flagged FAIL on focus management (33 controls reachable outside the dialog). Wave 1 fixes this as a side-effect of using `showModal()`.
- No UX flow was previously relying on focus escaping the dialog. Verified by reading [CODE] `falcon-wizard-finalization.component.html` — the parent only mounts the two dialogs and listens to `(send)` / `(cancel)` / `(closed)` outputs. No focus manipulation in the parent. No "split-screen" UX where the user is expected to interact with both the dialog and the page underneath.

Recommendation: ACCEPT. Highlight in release notes as a bonus a11y win.

### F4. Tests against jsdom — **SAFE**

- [DOC] BUILD-TEST-REPORT.md "jsdom NOTICE" explicitly discloses `TypeError: el.showModal is not a function` from jsdom's incomplete `HTMLDialogElement` implementation.
- Verified the spec assertions at [CODE] `apps/host-shell/tests/falcon-sending-credentials-dialog.spec.ts:170-183` and `apps/host-shell/tests/falcon-completion-success-dialog.spec.ts:145-156` — the tests check:
  1. `querySelector('[role="dialog"]')` / `querySelector('[role="alertdialog"]')` presence/absence based on `open` signal
  2. Owner-summary text content rendered
  3. Component method invocation (`onClose()`, `onCancel()`, `onSend()`, `pickMethod()`)
  None of these depend on `showModal()` ACTUALLY opening the dialog. They depend on the `@if (open())` block materializing the DOM, which works in jsdom.
- VERIFICATION-REPORT.md Check 1 in a real browser confirms `inTopLayer: true` — the runtime path that jsdom cannot test was verified by Agent C.

Recommendation: ACCEPT. The 67/67 PASS is genuine. The real-browser verification (Agent C) is the necessary complement to the jsdom-limited unit tests.

### F5. Pre-existing lint plugin crash — **SAFE**

- Confirmed independently: I ran `npx eslint libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.ts` in isolation.
- Output: `Error: ENOENT: no such file or directory, open 'C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\*\index.ts'` at line 32, rule `@nx/enforce-module-boundaries`.
- Line 32 in the Wave 1 file is `import { defineFalconTwComponent } from '../../../define-falcon-tw-component';`.
- Pre-Wave-1 baseline file (`git show HEAD:.../falcon-sending-credentials-dialog.component.ts`) has the SAME import at line 28 (Wave 1 only added imports above it). The lint plugin would have crashed on this exact import even before Wave 1 — confirmed pre-existing.
- The plugin treats `components/*/index.ts` (a glob configured in some Nx project config) as a literal filesystem path in its autofix code, then crashes with ENOENT.
- The crash aborts the entire lint run on the file before it can report any actual rule violations on Wave 1 code. This is a tooling bug, not a masking of Wave 1 lint issues. The Wave 1 code (which I read line-by-line) has no `any` types, uses canonical Angular 20 patterns, follows OnPush, and respects existing import conventions.

Recommendation: ACCEPT for Wave 1. File a separate ticket (or backlog entry) to fix the `@nx/enforce-module-boundaries` glob-vs-literal-path bug — out of scope for Wave 1 per hard-limit "no unrelated code changes".

---

## Final verdict

**WAVE 1 COMPLETE — GREEN**

The migration delivers:
1. **Primary objective achieved:** z-index bleed-through bug eliminated via native Top Layer rendering (4 point-probes confirm).
2. **Bonus accessibility win:** native focus trap eliminates baseline's 33 escape-able controls (0 reachable outside dialog after Wave 1).
3. **Zero public API drift:** 25 inputs + 3 outputs across both components preserved byte-for-byte.
4. **Zero unrelated overlay regressions:** Stencil core, drawer, insufficient-balance-dialog, host-shell mount components, token files, overlay service — all untouched.
5. **Honest reporting:** all 4 prior reports candidly disclose every issue (lint plugin crash, jsdom showModal gap, NG0203 fix-up, package-lock.json regeneration is the one item that slipped through documentation).
6. **End-to-end runtime evidence:** real client (`WaveOneVerify01`) created in a real browser via Agent C.

The one housekeeping note (`package-lock.json` regenerated by build) does not block sign-off; it is a build artifact, not a source change.

---

## Recommendations to user

### Is the change ready to commit?

**YES, with two preparation steps** (which the user must explicitly approve before any git mutation occurs):

1. **Decide on `package-lock.json`** — either:
   - **Option A (recommended):** revert it (`git checkout HEAD -- libs/falcon-ui-core/package-lock.json`) and re-run `npm install` in a clean post-merge state if needed. Keeps the commit purely about the 4 Wave 1 source files.
   - **Option B:** include it in the commit with an explanatory line in the commit body. Acceptable since the diff is npm self-cleanup with no runtime effect.

2. **Final sanity build** — recommend re-running `npx nx build admin-console --skip-nx-cache && npx nx build management-console --skip-nx-cache` once more after any cherry-pick adjustments, since the 5 builds in BUILD-TEST-REPORT.md were green but the package-lock.json drift means a fresh `node_modules` is technically a different starting state. (Likely no-op since the deleted entries weren't being used.)

### Can Wave 2 (foundation: directive + service + @layer CSS) begin?

**YES, immediately after Wave 1 commit lands.** Wave 1 establishes the proof point that native `<dialog>` works in the Falcon stack with Module Federation + Angular standalone + PrimeNG + Tailwind. The architectural decisions for Wave 2 (the `[falconOverlay]` directive, a thin overlay service, and `@layer` CSS layering) can build on Wave 1's verified patterns:
- `viewChild<ElementRef<HTMLDialogElement>>('dlg')` + `runInInjectionContext(injector, () => afterNextRender(...))` is the canonical idiom for the directive's host-element access.
- `(cancel)` + `preventDefault()` is the canonical pattern for `closeOnEsc` gates.
- `(click)` with `event.target === ref.nativeElement` is the canonical pattern for backdrop-click detection.
- `dialog.foo::backdrop` is the canonical pattern for backdrop styling — visual parity vs Tailwind background utilities is achievable.

No blockers for Wave 2.

### Suggested commit message draft

Subject (under 70 chars):
```
feat(falcon-ui-core): migrate 2 dialogs to native <dialog> top layer (Wave 1)
```

Body draft (the user must approve before commit):
```
Wave 1 of the Top Layer migration converts the Sending-Credentials + 
Completion-Success dialog wrappers from Tailwind-positioned <div class="fixed 
inset-0"> overlays to native <dialog> + .showModal() rendering. This 
eliminates the z-index bleed-through bug (BASELINE.md screenshot ss_19199287p) 
by promoting the dialog into the browser Top Layer, which paints above all 
page content regardless of ancestor stacking contexts.

Changes scoped to 4 files in libs/falcon-ui-core/src/angular-wrapper/:
- falcon-sending-credentials-dialog.component.{ts,html}
- falcon-completion-success-dialog.component.{ts,html}

Public API: ZERO changes. All 25 inputs + 3 outputs across both components 
preserved byte-for-byte. Test spec files unchanged (67/67 pass).

Bonus a11y improvement: native focus trap eliminates baseline's 33 
escape-able-controls-via-Tab finding (0 reachable outside dialog after fix).

Verified: 5 nx builds green, 67/67 vitest tests green, runtime-verified in 
Chrome via Add Client wizard end-to-end (WaveOneVerify01 / 
FIN-W1-VERIFY-01).

Out of scope (deferred to later waves): falcon-dialog Stencil core, 
falcon-drawer, falcon-insufficient-balance-dialog, [falconOverlay] directive 
abstraction (Wave 2), z-index token cleanup (Wave 8).
```

---

## Source-prefix audit

All facts in this report are grounded in:
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/*` (final-state read)
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/*` (final-state read)
- [CODE] `libs/falcon-ui-tokens/src/components/dialog.tokens.css:164` (token-definition read)
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.service.ts:52` (overlay-service read)
- [CODE] `apps/host-shell/tests/falcon-sending-credentials-dialog.spec.ts:182` + `apps/host-shell/tests/falcon-completion-success-dialog.spec.ts:149,155` (spec selectors)
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard-finalization/falcon-wizard-finalization.component.html` (parent consumer)
- [DOC] BASELINE.md, IMPLEMENTATION-REPORT.md, BUILD-TEST-REPORT.md, VERIFICATION-REPORT.md (cross-checked)
- Git state: `git status --porcelain`, `git diff --stat HEAD`, `git diff HEAD --` (read-only)
- Independent eslint run: `npx eslint libs/falcon-ui-core/.../falcon-sending-credentials-dialog.component.ts` (confirmed pre-existing plugin crash on import line)
- [WEB] Angular NG0203 escape hatch reference: https://v21.angular.dev/errors/NG0203
- [MEMORY] `project_docker_health_login_verify_2026_05_21` (container health + sysadmin login as baseline runtime)
