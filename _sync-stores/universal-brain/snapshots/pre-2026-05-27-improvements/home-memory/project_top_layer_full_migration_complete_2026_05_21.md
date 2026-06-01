# Top Layer Overlay Migration — ALL 8 WAVES COMPLETE + PUSHED

**Date**: 2026-05-21
**Branch**: `polishing-v0.4`
**Commit**: `2e0693a7 z-index` (pushed to origin)
**Previous HEAD**: `d5162a31 Fixing bugs. 100%`
**Status**: ✋ FULLY PUSHED, build-green + runtime-verified (Wave 1) + spec-test-green (67/67)

## TL;DR

Every Falcon overlay surface now renders via the browser-native Top Layer. The user-reported Sending-Credentials bleed-through bug (stepper rail visible through dialog backdrop on Add Client Step 5) is fixed structurally — no z-index value on any ancestor can pull a top-layer element back down. Browser-managed LIFO + a reassert rule for toasts satisfies the user's priority order (toast > confirmation > modal > drawer > screen) with zero z-index counters.

## What shipped (43 files, +2504 / -323 lines)

### Foundation (Wave 2 — 3 new files)
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-stacking.service.ts` — singleton tracker of open overlays; reassertToasts() called on every modal/drawer register (rAF-scheduled)
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.directive.ts` — `[falconOverlay]` directive with kind input ('modal' | 'drawer' | 'popover' | 'toast') + two-way `falconOpen` model; uses `runInInjectionContext(injector, () => afterNextRender(...))` for the showModal/showPopover lifecycle
- [CODE] `libs/falcon-ui-tokens/src/components/overlay-layer.tokens.css` — shared `@layer falcon-overlay` block with default `dialog::backdrop` + `[popover]:popover-open` rules

### Modals (Wave 1 + Wave 3 + Wave 4)
- [CODE] `falcon-sending-credentials-dialog` (Wave 1 — original bug fix)
- [CODE] `falcon-completion-success-dialog` (Wave 1)
- [CODE] `falcon-popup.component.ts` — composes confirm-dialog-host + error-dialog-host (Wave 3)
- [CODE] `otp-dialog` (Wave 3) — manual `transform: translate(-50%, -50%)` positioning removed; native dialog centers automatically
- [CODE] `falcon-dialog` Angular wrapper (Wave 4) — Stencil core untouched, native `<dialog>` wraps it
- [CODE] `falcon-insufficient-balance-dialog` Angular wrapper (Wave 4) — same wrap-not-rewrite
- [CODE] `falcon-alert-dialog` Angular wrapper (Wave 4 — Phase A deviation absorbed) — auto-promotes confirm-dialog-host + error-dialog-host transitively

### Drawer (Wave 5)
- [CODE] `falcon-drawer` Angular wrapper — native `<dialog falconOverlay="drawer">` wrapping Stencil; slide-from-edge animation preserved (intrinsic to Stencil panel CSS, `transform: translateX(±100%)` → `translateX(0)`); RTL preserved (Stencil uses physical `data-position='right'|'left'`)
- `app-org-node-drawer` consumer NOT touched (it rolls its own raw Tailwind drawer per existing GAP-FALCON-UI-CORE-DRAWER-DEFAULT-SLOT-001 workaround)

### Popovers (Wave 6 — additive migration)
- 8 popover wrappers with ADDITIVE `[popover]` attribute + `showPopover()` call:
  - falcon-tooltip (popover="manual" — pointer-leave dismiss)
  - falcon-menu (popover="auto")
  - falcon-dropdown (popover="auto" + body-portal fallback retained)
  - falcon-multi-select (popover="auto")
  - falcon-combobox (popover="auto")
  - falcon-date-picker (popover="auto")
  - falcon-calendar — NOT a popover (inline date-grid); transitively gains Top Layer when wrapped in date-picker
  - falcon-phone-field country list (popover="auto")
- Body-portal logic (`FalconOverlayService.getContainer()`) + `popover-portal.ts` positioning script PRESERVED as feature-detection fallback

### Toast (Wave 7)
- [CODE] `falcon-notification-stack.component.ts` — `[falconOverlay]="'toast'"` + `[falconOpen]="hasActiveToasts()"` driving native `[popover="manual"]` + `showPopover()`/`hidePopover()`
- `FalconStackingService.reassertToasts()` now active: every modal/drawer open triggers `hidePopover()+showPopover()` on every tracked toast → pops toasts back to top of Top Layer LIFO. User's priority-1 rule satisfied.
- z-[100001] Tailwind class PRESERVED as defence-in-depth fallback

### Cleanup (Wave 8 — preservation + deprecation)
- 5 z-index tokens KEPT (live Stencil shadow-DOM + Tailwind helper consumers) — `@deprecated` JSDoc headers added; Wave 9+ deletion plan documented
- `FalconOverlayService.getContainer()` + `popover-portal.ts` KEPT as feature-detected fallbacks with deprecation headers
- ESLint `no-restricted-syntax` warn rule added in `eslint.config.mjs` flagging `z-[N≥1000]` literals in `.ts/.tsx/.html` outside an allowlist (grandfathered current consumers)
- 4 brain docs created under [BRAIN-OUT] `Brain Outputs/understanding/frontend/overlay-architecture/`: ARCHITECTURE.md · MIGRATION-NOTES.md · DEAD-TOKENS.md · BROWSER-FALLBACKS.md

## Key technical wins

1. **Bleed-through bug class STRUCTURALLY eliminated** — Top Layer paints above all ancestor stacking contexts. No transform/filter/contain/will-change can trap a top-layer element. The original `--falcon-dialog-z-index` was actually UNDEFINED in the cascade (Wave 0 baseline finding), so the bug was simultaneously a stacking-context trap AND a null-token issue. Top Layer sidesteps both.

2. **Native focus trap delivered for FREE on every modal** — `showModal()` makes the rest of the document `inert` + traps Tab focus inside the dialog. Wave 1 baseline showed 33 external tab-reachable controls behind the open Sending-Credentials modal; Wave 1 result is 0. Same a11y upgrade applies to every other modal migrated.

3. **`afterNextRender()` inside `effect()` MUST be wrapped in `runInInjectionContext(injector, () => afterNextRender(...))`** — captured once via `private readonly injector = inject(Injector)` field-init. Without this bridge, NG0203 fires at runtime even though the code type-checks and builds. This is now in the `[falconOverlay]` directive as the canonical pattern.

4. **Wrap-not-rewrite for Stencil cores** — Stencil `.tsx` files untouched across Waves 4 + 5 + 6. The Angular wrapper renders `<dialog>` / `[popover]` around the Stencil tag. Stencil shadow DOM continues to style its own shadow content. Outer `::backdrop` is light-DOM and works fine.

5. **Inner Stencil backdrop visually neutralised** via CSS-variable cascade (`--falcon-dialog-backdrop-bg: transparent` on `:host` scope) — the variable cascades into Stencil shadow root because the wrapper tag name is in the token block's `:where(...)` list. Inner backdrop click-target stays live so `closeOnBackdrop` continues to work.

6. **Toast LIFO reassert rule** — `FalconStackingService` schedules `requestAnimationFrame(() => reassertToasts())` on every modal/drawer register. Each tracked toast is `hidePopover() + showPopover()`'d in sequence, popping it to the top of the Top Layer. Modal opens between two toast displays → toasts pop back to top within one frame, invisible to humans.

## What's NOT done (deferred to future waves)

- Token deletion (Wave 9+) — 5 tokens remain referenced by Stencil shadow-DOM CSS + Tailwind class helpers + per-app `tailwind.css` `@source inline` directives. Need a deeper sweep to migrate those consumers before deletion.
- CSS Anchor Positioning adoption — `popover-portal.ts` JS fallback retained. Anchor Positioning supports Chrome 125+ / Safari 26 / Firefox flag. Adopt when Firefox ships.
- Real-browser verification of Waves 2-8 — Wave 1 was browser-verified (Add Client Step 5 flow end-to-end with WaveOneVerify01 client created). Waves 2-7 are build-green + spec-test-green but not separately browser-verified. Spec coverage at 67 tests handles the API contract; real-browser issues would need manual QA.
- ESLint rule is `warn`-level — promote to `error` after a transitional period.

## Verification matrix at final sweep

| Build / Test | Result | Notes |
|---|---|---|
| `nx build falcon-ui-tokens` | GREEN (cached) | 52 components / 3624 tokens |
| `nx build falcon-ui-core` | GREEN 45s | Pre-existing Stencil `scrollHeight` reserved-name warnings unrelated |
| `nx build host-shell --skip-nx-cache` | GREEN | Hash `cfc05f33b2ad0df1` (Phase D) |
| `nx build admin-console --skip-nx-cache` | GREEN | Hash `1fac23712b95c5ed` (Phase D) |
| `nx build management-console --skip-nx-cache` | GREEN | Hash `17ca44c92f05ab83` (final sweep) |
| `nx test host-shell` | GREEN 67/67 in 2.99s | 4 spec files, all pass |

## Investigation artifacts (deferred to brain — not committed)

Under [BRAIN-OUT] `Brain Outputs/_investigations/2026-05-21-top-layer-migration/`:
- `wave-1-impact-analysis.md` (Phase 0)
- `baseline/BASELINE.md` + `baseline/dom-analysis.json` (Wave 0 baseline)
- `wave-1/IMPLEMENTATION-REPORT.md` (Agent B)
- `wave-1/BUILD-TEST-REPORT.md` (Agent D)
- `wave-1/VERIFICATION-REPORT.md` (Agent C)
- `wave-1/GOVERNANCE-REVIEW.md` (Agent E)
- `phase-a/PHASE-A-REPORT.md` (Wave 2 + Wave 3)
- `phase-b/PHASE-B-REPORT.md` (Wave 4 + Wave 5)
- `phase-c/PHASE-C-REPORT.md` (Wave 6)
- `phase-d/PHASE-D-REPORT.md` (Wave 7 + Wave 8)

## Rule emitted (highest-priority memory)

**Falcon overlay-class rules (POST-MIGRATION CANONICAL):**

- **Every overlay surface uses native Top Layer.** Modal/drawer → `<dialog>` + `showModal()`. Popover/menu/tooltip/dropdown → `[popover]` + `showPopover()`. Never `<div class="fixed inset-0 z-[...]">` for new overlays.
- **Use `[falconOverlay]="<kind>"` + `[(falconOpen)]="<signal>"`** for all new overlay components. The directive owns the showModal/showPopover lifecycle, FalconStackingService registration, and the reassert rule.
- **`afterNextRender()` inside `effect()` → MUST wrap in `runInInjectionContext(this.injector, () => afterNextRender(...))`.** Capture injector via `private readonly injector = inject(Injector)` field-init. Otherwise NG0203 at runtime.
- **Stencil cores stay shadow-DOM; the Angular wrapper handles native `<dialog>`/`[popover]`.** Wrap-not-rewrite. Stencil `.tsx` files are not modified for overlay migrations.
- **`@if (open()) { <dialog>... }` is the canonical control flow** — preserves spec-test `querySelector(...).toBeNull()` contract on closed state.
- **`role="dialog"` / `role="alertdialog"` attribute is PRESERVED on the native `<dialog>` element** so existing test selectors + screen readers continue to match.
- **`closeOnEsc=false` semantics** via `(falconCancel)="$event.preventDefault()"` gate on the consumer side.
- **Toast LIFO reassert is automatic** — `FalconStackingService.reassertToasts()` fires on every modal/drawer register. Toasts always stay topmost.
- **`FalconOverlayService.getContainer()` body-portal + `popover-portal.ts` JS positioning are DEPRECATED but PRESERVED as feature-detected fallbacks** (Firefox until Anchor Positioning ships).
- **The 5 z-index tokens (`--falcon-dialog-z-index`, etc.) are DEPRECATED but PRESERVED** until Wave 9+ migrates remaining Stencil shadow-DOM CSS + Tailwind class helpers off them.
- **ESLint rule `no-restricted-syntax`** in `eslint.config.mjs` flags any new `z-[N≥1000]` outside an allowlist — promote to `error` after transitional period.

## Brain index entry

Add to MEMORY.md under "Platform Knowledge — Frontend Work":

> - [Top Layer overlay migration — 8 waves complete + pushed](project_top_layer_full_migration_complete_2026_05_21.md) — ✋ PUSHED commit `2e0693a7 z-index` to `polishing-v0.4`. Every Falcon overlay (modal, drawer, popover, dropdown, tooltip, menu, calendar wrapper, toast) now renders via browser-native Top Layer (`<dialog>` + `showModal()` or `[popover]` + `showPopover()`). Bleed-through bug class structurally eliminated. New `[falconOverlay]` directive + `FalconStackingService` + `@layer falcon-overlay` CSS. Toast LIFO reassert keeps notifications topmost across any modal/drawer open. Z-index tokens DEPRECATED but kept (Stencil shadow-DOM + Tailwind helper consumers remain — Wave 9+ deletion). Build matrix 5/5 GREEN, 67/67 spec tests GREEN. Investigation reports under `Brain Outputs/_investigations/2026-05-21-top-layer-migration/` (phase-a, phase-b, phase-c, phase-d).
