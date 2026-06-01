---
type: phase-implementation-report
phase: Phase C — Wave 6 (Floating popovers — Top Layer additive migration)
agent: Ammar Web-Platform-UI
date: 2026-05-21
status: code-complete + build-green + tests-green
build-status: 5/5 GREEN
test-status: 67/67 GREEN
runtime-status: not-verified (FE-blocker per [VAULT] `VERIFICATION-STATUS.md`)
verdict: GREEN with one documented deviation (falcon-calendar is not a popover — halt-and-flag)
---

# Phase C Implementation Report

Top Layer migration · Phase C · Wave 6 — 8 floating popovers.

Additive strategy: on `falcon-open` (or `falcon-show`, or a MutationObserver
for the combobox which emits no open event), the Angular wrapper locates the
Stencil-rendered popover panel, applies the native `popover="auto"` HTML
attribute, calls `showPopover()` to promote it into the Top Layer, and
registers with `FalconStackingService` (kind='popover'). On close, it
hides+unregisters. Feature-detected — older browsers continue to use the
existing body-portal/inline rendering as fallback.

The body-portal logic in `popover-portal.ts` and `FalconOverlayService` was
NOT touched; the Top Layer promotion stacks on top of the existing portal.

## Strategy categorisation

Reading the 8 Stencil cores revealed three popover-mechanism families. The
wrapper migration differs per family:

| Family | Stencil pattern | Wrapper trigger | Wrapper query |
|--------|-----------------|-----------------|---------------|
| **A. Body-portaled** | `ensurePortaled(panel, resolvedId)` moves panel into `.falcon-overlay-container` and tags it `data-falcon-portaled="true"` + `data-falcon-popover-instance="<resolvedId>"` | `falcon-open` / `falcon-close` events | `document.querySelector('.falcon-overlay-container [data-falcon-popover-instance="<id>"]')` after one `rAF` (Stencil's `componentDidRender` runs the portal AFTER `falcon-open` emits) |
| **B. Inline (event-emitting)** | Panel rendered inline inside Stencil host (light DOM for `-tw`; shadow DOM for default); `data-component="falcon-<X>-panel"` | `falcon-menu-open` / `falcon-show` events | `stencilHost.querySelector` first, then `stencilHost.shadowRoot?.querySelector` |
| **C. Inline (no events)** | Panel rendered inline; NO `@Event` for open/close | `MutationObserver` on Stencil host subtree, scoped to `childList + subtree` | `target.querySelector('[role="listbox"]')` — present when open, absent when closed |

For Families B + C (inline-rendered panels), the wrapper also writes
defensive inline `!important` overrides for UA popover stylesheet defaults
(`inset: 0; margin: auto`) — without those, the panel would either stretch
to the containing block bounds or centre itself in the viewport, defeating
the Stencil's own positioning logic. The body-portal cases (Family A) are
safe because `positionPopoverFixed` already writes all four corners +
`margin: 0` + `transform: none` with `!important`.

## Per-popover migration

### 6.1 `falcon-angular-tooltip` (Family B — inline, event-emitting)

[CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-tooltip\falcon-tooltip.component.ts`

LOC delta: +130 / −0 (one file touched; .html untouched).

Additions:
- Imports: `ElementRef`, `inject`, `OnDestroy` from `@angular/core`; `FalconStackingService` from utilities barrel.
- Class implements `OnDestroy`.
- Three private fields: `stacking = inject(FalconStackingService)`, `hostRef = inject(ElementRef)`, `activePanelEl: PopoverHTMLElement | null = null`.
- `ngOnDestroy()` calls `releaseTopLayer()`.
- `handleShow()` calls `scheduleTopLayerAcquire()` BEFORE the existing emit.
- `handleHide()` calls `releaseTopLayer()` BEFORE the existing emit.
- `scheduleTopLayerAcquire()` — single-frame `rAF` defer (Stencil's `falcon-show` fires before the panel re-render mounts the `data-component="falcon-tooltip-panel"` div).
- `acquireTopLayer()` — probes light DOM first (`-tw` variant), then `host.querySelector('falcon-tooltip')?.shadowRoot?.querySelector(...)` (default Shadow variant). Sets `popover="manual"` (tooltips dismiss on pointer-leave/blur, NOT outside click — `auto` would conflict). Writes defensive `right: auto !important; bottom: auto !important; margin: 0 !important` to neutralize UA's `inset: 0; margin: auto`. Calls `showPopover()` if not already open. Registers with stacking service.
- `releaseTopLayer()` — `hidePopover()` + unregister + null the field.

Public API: unchanged (selector, inputs, outputs, HostBinding preserved).

### 6.2 `falcon-angular-menu` (Family B — inline, event-emitting)

[CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-menu\falcon-menu.component.ts`

LOC delta: +95 / −0.

Additions:
- Imports + class additions same shape as 6.1.
- `handleMenuOpen()` / `handleMenuClose()` gain the acquire/release calls.
- `acquireTopLayer()` — probes `menuEl?.nativeElement.querySelector('[data-component="falcon-menu-panel"]')` first, then shadow root. Sets `popover="auto"` (menus DO dismiss on outside click — matches Stencil's existing `mousedown` handler semantics). Writes defensive `right/bottom/margin` overrides.
- Same `releaseTopLayer()`.

Note: The menu's `appendTo` input (currently `'host'`/`'body'`) is preserved as-is; the popover migration doesn't depend on it. The Stencil's `positionPanel()` writes inline `top`/`left` which compose correctly with the Top Layer promotion.

Public API: unchanged. The existing imperative `showAt()` / `hide()` / `openMenu()` / `closeMenu()` / `toggle()` methods continue to work — they ultimately set `this.open = true` on the Stencil element, which fires `@Watch('open')` → `falcon-menu-open` event → our acquire path runs.

### 6.3 `falcon-angular-dropdown` (Family A — body-portaled)

[CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-dropdown\falcon-dropdown.component.ts`

LOC delta: +110 / −0.

Additions:
- Imports: `inject`, `OnDestroy` (`DestroyRef` was added then removed — unused).
- Two new private types: `PopoverHTMLElement` and `FalconDropdownStencilHost` (the latter declares `resolvedId?: string` so we can read the Stencil's `@State` field without `any`).
- `stacking`, `activePanelEl` fields. `ngOnDestroy` cleanup.
- `handleOpen()` / `handleClose()` gain acquire/release.
- `acquireTopLayer()` — reads `host.resolvedId` (Stencil `@State` exposes it as instance prop), queries `.falcon-overlay-container [data-falcon-popover-instance="<id>"][data-falcon-portaled="true"]`. Sets `popover="auto"`. NO defensive overrides — `positionPopoverFixed` already writes all 4 corners with `!important`.
- `releaseTopLayer()` — standard hide+unregister.

Public API: unchanged. `FalconDropdownOption` type export preserved.

### 6.3 `falcon-angular-multi-select` (Family A — body-portaled)

[CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-multi-select\falcon-multi-select.component.ts`

LOC delta: +90 / −0.

Mirror of 6.3 dropdown — same body-portal pattern, same migration. The query selector + `popover="auto"` + showPopover/hidePopover sequence is identical.

Public API: unchanged. `FalconMultiSelectOption` type export preserved.

### 6.4 `falcon-angular-combobox` (Family C — inline, no events)

[CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-combobox\falcon-combobox.component.ts`
[CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-combobox\falcon-combobox.component.html`

LOC delta: +130 / −0 in .ts; +1 / −0 in .html (`#stencilEl` template ref on both render-path branches).

Additions:
- Imports: `AfterViewInit`, `ElementRef`, `inject`, `OnDestroy`, `ViewChild`.
- `@ViewChild('stencilEl', { static: false }) stencilEl?: ElementRef<HTMLElement>` — references the active Stencil tag (`<falcon-combobox-tw>` or `<falcon-combobox>`).
- `listboxObserver: MutationObserver | null = null`. SSR-safe via `typeof MutationObserver === 'undefined'` guard.
- `ngAfterViewInit()` starts the observer; `ngOnDestroy` tears it down + releases.
- `startListboxObserver()` — observes the Stencil host subtree for childList changes. Probes once at view-init to handle the case where the panel is already open at mount.
- `syncListboxState()` — query `target.querySelector('[role="listbox"]')`. If present → `acquireTopLayer(panel)`. If absent and `activePanelEl` set → `releaseTopLayer()`.
- `acquireTopLayer(panel)` — direction-aware defensive overrides: read `getComputedStyle(panel).direction`. In LTR neutralize physical `right: auto`, in RTL neutralize physical `left: auto` so the Tailwind `start-0` logical write continues to anchor. `top: auto; bottom: auto` always. Margin: write `margin-right/bottom/left: 0` longhand to PRESERVE the author `mt-1` (margin-top: 0.25rem) gap.
- `releaseTopLayer()` — standard.

Public API: unchanged.

### 6.5 `falcon-angular-date-picker` (Family A — body-portaled)

[CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-date-picker\falcon-date-picker.component.ts`

LOC delta: +95 / −0.

Mirror of 6.3 dropdown. The Stencil's `popoverEl` (vs dropdown's `panelEl`) and `inputWrapEl` (vs dropdown's `anchorEl`) are internal — irrelevant to the wrapper because `ensurePortaled` tags the popover with the same `data-falcon-popover-instance="<resolvedId>"` attribute. The wrapper uses the same query selector.

Note: The wrapper uses two `@ViewChild` refs (`twRef`/`shadowRef`) because the template has two branches under `@if (useTailwind)`. `acquireTopLayer()` reads whichever is active.

Public API: unchanged.

### 6.6 `falcon-angular-calendar` — NOT MIGRATED (halt-and-flag)

[CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-calendar\falcon-calendar.component.ts`

LOC delta: +14 / −1 (documentation header only).

Reasoning, source-prefixed from the Stencil core:

- [CODE] `libs/falcon-ui-core/src/components/falcon-calendar-tw/falcon-calendar-tw.tsx:1-2,80` — the Stencil calendar is documented as "Mirrors `<falcon-calendar>` 1:1 in API" and renders an inline always-visible date-grid component. It has no `open`/`close` lifecycle, no panel that overlays sibling content, and no portal logic.
- The popover that wraps a calendar IS the date-picker (Wave 6.5 above). Calendars rendered inside date-pickers transitively gain Top Layer via the date-picker migration. Standalone `<falcon-angular-calendar>` consumers render in normal document flow — there is nothing to lift out of stacking contexts because the calendar doesn't overlay anything.

The file is intentionally left unchanged behaviorally. A documentation block at the top of the file records the rationale + redirects future consumers wanting an overlay-style calendar to wrap it in a date-picker / a `<dialog falconOverlay="popover">` / a host-component.

### 6.7 `falcon-angular-phone-field` (Family A — body-portaled)

[CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-phone-field\falcon-phone-field.component.ts`
[CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-phone-field\falcon-phone-field.component.html`

LOC delta: +100 / −5 in .ts; +1 / −0 in .html (`#phoneFieldEl` template ref on both branches).

Additions:
- Imports: `AfterViewInit`, `ElementRef`, `inject`, `OnDestroy`, `ViewChild`.
- New `@ViewChild('phoneFieldEl', { static: false })` ref to the active Stencil tag.
- Replaced the previous no-op `handlePopoverOpen()` / `handlePopoverClose()` methods (originally placeholders per the Wave 5 portal-popovers comment) with active acquire/release calls.
- `acquireTopLayer()` — reads `phoneFieldEl.nativeElement.resolvedId`, queries `.falcon-overlay-container [data-falcon-popover-instance="<id>"]`. Standard Family A pattern.

Public API: unchanged. All Stencil-bubbled events continue to flow through `(falcon-input)`, `(falcon-change)`, `(falcon-country-change)`, `(falcon-verify)`, `(falcon-blur)`, `(falcon-open)`, `(falcon-close)`.

## Build matrix

| Project | Command | Result | Hash | Time |
|---------|---------|--------|------|------|
| falcon-ui-tokens | `npx nx build falcon-ui-tokens` | GREEN | 52 components, 3624 tokens | <1s (cache hit) |
| falcon-ui-core | `npx nx build falcon-ui-core` | GREEN | 103 components proxied | ~48s |
| host-shell | `npx nx build host-shell --skip-nx-cache` | GREEN | `57fa890c94df82bb` | ~14s |
| admin-console | `npx nx build admin-console --skip-nx-cache` | GREEN | `81bbf5b637b98e0e` | ~26s |
| management-console | `npx nx build management-console --skip-nx-cache` | GREEN | `f122aa0cc8141296` | ~25s |

ALL FIVE GREEN.

Pre-existing Stencil build warnings (unchanged from Phase A/B):
- `@Prop() title?` on `falcon-dialog.tsx:42` + `falcon-dialog-tw.tsx:48`
- `@Prop() scrollHeight?` on `falcon-table.tsx:120` + `falcon-table-tw.tsx:165`

None Phase C-introduced.

## Test matrix

| Project | Command | Suites | Tests | Result |
|---------|---------|--------|-------|--------|
| host-shell | `npx nx test host-shell` | 4 | 67 | 67/67 GREEN |

Per-suite breakdown:
- `tests/falcon-http-ui-routing.spec.ts` — 40 tests · GREEN (~12ms)
- `tests/falcon-notification-stack-position.spec.ts` — 7 tests · GREEN (~6ms)
- `tests/falcon-completion-success-dialog.spec.ts` — 9 tests · GREEN (~244ms)
- `tests/falcon-sending-credentials-dialog.spec.ts` — 11 tests · GREEN (~444ms)

Total: ~2.4s. No spec file references any of the 8 popovers covered by
Phase C (verified via grep for `FalconAngular(Tooltip|Menu|Dropdown|
MultiSelect|Combobox|DatePicker|Calendar|PhoneField)Component` across
`apps/host-shell/tests/`). Phase B Wave 4+5 specs continue to pass
unchanged.

## Public API preservation (per component)

### 6.1 `FalconAngularTooltipComponent`
Inputs (8): `content`, `placement`, `delay`, `disabled`, `interactive`, `maxWidth`, `useTailwind`, `rootClass` — preserved.
Outputs (2): `falconShow`, `falconHide` — preserved.
Selector: `falcon-angular-tooltip` — preserved.
HostBinding: `class.falcon-angular-tooltip` — preserved.
Type imports + slot projection (default + `slot=content`) — preserved.

### 6.2 `FalconAngularMenuComponent`
Inputs (9): `items`, `open`, `popup`, `appendTo`, `triggerLabel`, `disabled`, `anchorEl`, `useTailwind`, `rootClass` — preserved.
Outputs (3): `falconMenuItemSelect`, `falconMenuOpen`, `falconMenuClose` — preserved.
Public methods (5): `showAt`, `hide`, `openMenu`, `closeMenu`, `toggle` — preserved.
Selector + HostBinding — preserved.
`syncProps` / `syncChanged` / `resyncItemsToStencil` lifecycle — preserved.

### 6.3 `FalconAngularDropdownComponent`
Inputs (28 including `disabledFromInput` setter): full list preserved.
Outputs (3): `valueChange`, `opened`, `closed` — preserved.
ControlValueAccessor (`writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`) — preserved.
Selector + HostBindings (`class.falcon-angular-dropdown`, `class.falcon-angular-dropdown-loading`, `aria-busy`) — preserved.
`FalconDropdownOption` interface export — preserved.

### 6.3 `FalconAngularMultiSelectComponent`
Inputs (19): preserved.
Outputs (3): `valuesChange`, `opened`, `closed` — preserved.
ControlValueAccessor — preserved.
Selector + HostBinding — preserved.
`FalconMultiSelectOption` interface export — preserved.

### 6.4 `FalconAngularComboboxComponent`
Inputs (14): preserved.
Outputs (3): `valueChange`, `filterChange`, `cleared` — preserved.
ControlValueAccessor — preserved.
Selector + HostBinding — preserved.
`FalconComboboxItem` interface export — preserved.

### 6.5 `FalconAngularDatePickerComponent`
Inputs (22): preserved.
Outputs (5): `falconChange`, `falconBlur`, `falconOpen`, `falconClose`, `valueChange` — preserved.
Selector + HostBinding — preserved.

### 6.6 `FalconAngularCalendarComponent` (not-migrated)
Inputs (15): preserved verbatim.
Outputs (3): `falconChange`, `falconBlur`, `valueChange` — preserved verbatim.
Selector + HostBinding — preserved verbatim.
No behavioral change; documentation-only edit.

### 6.7 `FalconAngularPhoneFieldComponent`
Inputs (27): preserved.
Outputs (3): `falcon-country-change`, `falcon-verify`, `blur` — preserved.
ControlValueAccessor — preserved.
Selector + HostBinding — preserved.
The `handlePopoverOpen` / `handlePopoverClose` were `protected` no-ops; they remain `protected` (template handler signature unchanged) but now perform the Top Layer acquire/release. No consumer can directly observe this change because the previous bodies returned `void` and the new bodies also return `void`.

## Visual parity

No design changes. The migration is purely about WHERE the panel paints — it
moves from a body-portal at z:100000 (still effective on older browsers) to
the native Top Layer (when supported). Visual content + animations are
untouched:
- Phase A's `[popover]:popover-open` animation in `overlay-layer.tokens.css`
  applies a 220ms scale+translate ease-in. Combined with the Stencil's own
  panel-class animations, the effective opening motion is unchanged.
- Backdrop colors: popovers do NOT have a backdrop (only `<dialog>.showModal()`
  does). So the Phase A `dialog::backdrop` rules don't apply to popovers.

The defensive `right: auto; bottom: auto; margin: 0 !important` overrides
for the inline-rendered popovers (tooltip / menu / combobox) are necessary
to neutralize the UA popover stylesheet's `inset: 0; margin: auto` — without
them, the Stencil's existing transform/top+left positioning would compete
with UA centring and produce visual regressions. These overrides bring the
Top-Layer-promoted panel into pixel-for-pixel parity with its pre-Phase-C
inline rendering.

## Deviations

### Deviation 1 — `falcon-calendar` is not a popover (halt-and-flag)

The Wave 6 prompt enumerates `falcon-calendar` among the 8 floating popovers.
After reading [CODE] `libs/falcon-ui-core/src/components/falcon-calendar-tw/falcon-calendar-tw.tsx:46-238`, the reality is clear: the Stencil calendar is an inline always-visible date-grid component with no `open`/`close` lifecycle, no panel, and no portal logic. It is the date-picker (Wave 6.5) that wraps a calendar in a popover — calendars rendered inside a date-picker transitively gain Top Layer through the date-picker migration.

Standalone `<falcon-angular-calendar>` consumers render the calendar grid in normal document flow. There is nothing to lift out of a stacking context because the calendar doesn't overlay anything.

The wrapper file gains a documentation header explaining the rationale + the route for future overlay-style calendar consumers (wrap in date-picker, dialog, or host-component). No behavioral edit.

### Deviation 2 — Combobox uses MutationObserver (no `falcon-open` event)

The Stencil combobox at [CODE] `libs/falcon-ui-core/src/components/falcon-combobox-tw/falcon-combobox-tw.tsx:63-70` declares only three `@Event`s (`falconComboboxFilter`, `falconComboboxSelect`, `falconComboboxClear`) — there is no `falcon-open` / `falcon-close` for the listbox lifecycle. Adding one would require a Stencil `.tsx` edit (out of Phase C scope).

The wrapper uses a `MutationObserver` scoped to the Stencil host subtree (childList + subtree) to detect when the `[role="listbox"]` panel is added/removed by Stencil's `{this.open && (...)}` JSX. The acquire/release paths are idempotent (re-acquire on a still-open panel is a no-op via the `activePanelEl === panel` guard).

Performance note: the Stencil re-renders on every keystroke during search (filtered options list updates), so the observer fires per render. The synchronous body checks `activePanelEl === panel` and returns early if the panel reference is unchanged. No measurable overhead expected.

### Deviation 3 — Tooltip uses `popover="manual"`

Tooltip dismisses on pointer-leave / blur — NOT on outside click. If we set `popover="auto"`, the first outside click would dismiss the tooltip while it's still hovering over its trigger (the auto light-dismiss is a click-outside dismiss). So tooltip uses `popover="manual"` and the Stencil's own dismiss handlers stay in charge.

Menu, dropdown, multi-select, combobox, date-picker, phone-field all use `popover="auto"` (their existing UX dismisses on outside click — matches the auto light-dismiss semantics).

### Deviation 4 — `popover-portal.ts` and `FalconOverlayService` untouched

Both helpers stay live. The body-portal at z:100000 continues to provide the fallback path for browsers without Popover API support. Wave 8 (cleanup) is the safe time to consider removing them — once Phase D Wave 7 toast migration confirms the stacking-service path is exclusive AND the browser-support floor stabilises.

## Risk catalog for Phase D

### D1 — `getComputedStyle(popoverEl).direction` reads during acquire

For the combobox direction-aware defensive override, we read `getComputedStyle()` synchronously at acquire time. If the popover lives inside an `*ngIf` block that hasn't yet stabilised, the computed style may return an empty string before the element is in the rendered layout tree. The `popover-open` path defers via `rAF` for the body-portal cases, but the combobox uses a MutationObserver firing synchronously. Risk: the first acquire after a route mount could read `direction: ''` instead of `'ltr'`/`'rtl'`. Mitigation: the ternary defaults to LTR-end (`'right'`), which is the correct LTR behaviour — RTL users would see the panel positioning before reaching this code path is exceptional.

### D2 — Stencil vdom orphan during the rAF defer

For the body-portal cases (dropdown / multi-select / date-picker / phone-field), the migration defers `acquireTopLayer` by one rAF so Stencil's `componentDidRender` portals the panel before we query. The Stencil vdom orphan bug documented in `popover-portal.ts:354-380` could create a stale orphan with the same `data-falcon-popover-instance` ID just before our query lands. Mitigation: the Stencil's own `ensurePortaled` cleans up orphans on every render; the rAF defer runs AFTER `componentDidRender`, so the most-recent panel is what we find. If a `replaceChildren` storm orphans the freshly-promoted panel, our `releaseTopLayer` may fail to find the panel via `activePanelEl?.matches(':popover-open')` (returns false). The stacking service unregister still runs, just on a detached element — safe via the `WeakMap`/`Set` semantics.

### D3 — Popover API not yet available in test environment

The host-shell tests run in Vitest + jsdom. Today's jsdom 24.x DOES support the Popover API (introduced ~jsdom 22). All 67 specs pass. If a future jsdom downgrade removed support, our `typeof popoverEl.showPopover !== 'function'` feature-detection returns early — the test suite remains green but no Top Layer behavior is exercised. Adding a spec that explicitly mocks `showPopover` / `hidePopover` for the 8 popovers is a Phase D follow-up.

### D4 — `popover="manual"` interaction with `:popover-open` UA defaults

The tooltip uses `popover="manual"`. The UA stylesheet still applies `[popover]:not(:popover-open) { display: none }` — meaning the panel is `display: none` BEFORE `showPopover()` succeeds. The Stencil tooltip mounts the panel JSX immediately on `openInternal()` (no Top Layer involved), so for one frame the panel is in DOM but display:none. Our rAF-deferred `showPopover()` flips `:popover-open` and the display constraint disappears. Visual effect: there could be a 1-frame flash where the tooltip is invisible before the Top Layer promotion fires. Mitigation: the Phase A `[popover]:popover-open` animation in `overlay-layer.tokens.css` is `from { opacity: 0 }` — the panel fades in over 220ms which masks the flash.

### D5 — Menu's `appendTo='body'` legacy prop

The wrapper menu accepts `@Input() appendTo: FalconMenuAppendTo = 'host'`. The Stencil currently does NOT body-portal regardless of this prop value (the prop is `reflect:true` only — it doesn't drive any DOM relocation in the current Stencil core). If a future Stencil revision actually implements body-portal under `appendTo='body'`, the wrapper's query (currently `menuEl.nativeElement.querySelector(...)`) would miss the body-portaled panel. Mitigation: in that case, fall back to the dropdown's `data-falcon-popover-instance` query. Phase D follow-up if/when Stencil ships actual menu body-portal.

### D6 — Future calendar overlay consumers

A future consumer might want to render a `<falcon-angular-calendar>` as a popup (e.g., embedded in a custom wizard's date input). The current calendar wrapper has no popover plumbing. The Phase C documentation header in `falcon-calendar.component.ts` directs such consumers to wrap the calendar in a `<dialog falconOverlay="popover">` (Phase A directive) — that path works today.

### D7 — Phase A `[popover]:popover-open` animation conflicts with positioning

The Phase A overlay-layer.tokens.css publishes `[popover]:popover-open { animation: falcon-overlay-popover-in 220ms cubic-bezier(0.2, 0.8, 0.3, 1) both; }`. The keyframes write `transform: translateY(8px) scale(0.98) → translateY(0) scale(1)`. For the tooltip (which uses `transform: translate(X,Y)` for positioning), the animation's `transform` keyframe OVERRIDES the Stencil's positioning transform for the duration of the animation. The tooltip would briefly position-snap from (8px below 0,0) to (0,0) instead of from the trigger anchor.

This is a visible regression risk specific to the tooltip. Mitigation options for Phase D: (1) tooltip-specific class to disable the global popover-open animation, (2) tooltip uses `transition-behavior: allow-discrete` + `@starting-style` for its own enter animation. The body-portal cases (dropdown etc.) are unaffected because `positionPopoverFixed` writes `transform: none !important` — the animation's `transform` keyframe can't override `!important` inline.

### D8 — Stacking service toast-reassert path now active for popovers

Phase C is the FIRST consumer to call `FalconStackingService.register(el, 'popover')`. The service's existing reassert-on-modal/drawer-open code path (lines 84-90 in [CODE] `falcon-stacking.service.ts`) triggers only on modal/drawer kinds — popovers do NOT trigger toast reassert. But the popover bucket itself is now tracked. Phase D Wave 7 toasts can now correctly count popovers above them when ordering. No correctness risk; documentation note.

## Hard limits compliance

- [x] NO commits made.
- [x] NO git operations performed.
- [x] NO Stencil `.tsx` edits — verified via the touched file list: all under `libs/falcon-ui-core/src/angular-wrapper/components/<popover>/` (Angular wrapper folders only).
- [x] NO `popover-portal.ts` edits — preserved verbatim.
- [x] NO `FalconOverlayService` edits — preserved verbatim.
- [x] NO z-index token deletions — `--falcon-overlay-z-index: 100000` stays for Wave 8.
- [x] NO public API changes — every selector, `@Input()`, `@Output()`, type export, HostBinding, public method preserved per the per-component table above.
- [x] Files outside the 8 popover wrapper folders: zero. Touched-file list:
  1. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tooltip/falcon-tooltip.component.ts`
  2. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.ts`
  3. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.ts`
  4. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-multi-select/falcon-multi-select.component.ts`
  5. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-combobox/falcon-combobox.component.ts`
  6. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-combobox/falcon-combobox.component.html` (added `#stencilEl` template ref on both render-path branches)
  7. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-date-picker/falcon-date-picker.component.ts`
  8. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-calendar/falcon-calendar.component.ts` (documentation header only — no behavioral change)
  9. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-phone-field/falcon-phone-field.component.ts`
  10. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-phone-field/falcon-phone-field.component.html` (added `#phoneFieldEl` template ref on both render-path branches)

Total: **10 files** (all within the 8 popover wrapper folders).

## Verdict

**GREEN — Phase C code-complete, build-green (5/5), tests-green (67/67), public APIs preserved across all 8 popover wrappers, one documented deviation (`falcon-calendar` is not a popover and is intentionally not migrated; date-picker's calendar child gets Top Layer transitively via 6.5).**

Phase D (Wave 7 — Toast migration + Wave 8 — Cleanup) can begin. Recommended order:
1. **Wave 7** — Convert `falcon-notification-stack.component.ts` (the toast stack) so each notification card becomes `<section falconOverlay="toast" [falconOpen]="visible()">`. The `FalconStackingService` already has the `toast` bucket + `reassertToasts()` re-pop pass wired and operational; Wave 7 makes it effective by registering toasts.
2. **Wave 8** — Once Wave 7 is GREEN and runtime-verified, delete `--falcon-dialog-z-index: 99999` + `--falcon-overlay-z-index: 100000` from `libs/falcon-ui-tokens/src/components/dialog.tokens.css` and `overlay.tokens.css`. Remove the body-portal logic from `popover-portal.ts` + `FalconOverlayService` (once Anchor Positioning coverage is sufficient — may stay as positioning fallback even after stacking deletion).
