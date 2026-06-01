---
type: feature-detection-map
domain: frontend / overlays
last-updated: 2026-05-21
applies-to: Top-Layer migration · feature-detected fallback paths
---

# Browser Fallbacks — Feature-Detection Map

The Top-Layer migration introduces native browser APIs that are well-supported
in modern Chromium/WebKit/Firefox but require fallbacks for older browser
versions. This document maps each native API to its fallback path and where
the feature detection lives.

## Browser-support floor

Confirmed in Phase A baseline:

| Browser | Floor version | Notes |
|---------|--------------|-------|
| Chrome / Edge (Chromium) | 117+ | Full native `<dialog>` + Popover API + Top Layer + `@starting-style` + `transition-behavior: allow-discrete` |
| Safari (WebKit) | 17+ | Same surface as Chromium 117 |
| Firefox (Gecko) | 125+ | `<dialog>` + `showPopover` shipped 125. CSS Anchor Positioning still rolling out (uses JS fallback). |

Below the floor: components fall back to body-portal + JS positioning.

## Native APIs used by the migration

### 1. `<dialog>` element + `.showModal()` / `.close()`

[CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.directive.ts:153-171`

Used by overlay kinds `'modal'` and `'drawer'`. The directive checks
`dialog.open` before calling `.showModal()` (idempotent guard); wrapped in
`try { ... } catch { ... }` defensively for browsers that throw under races.

**Fallback path:** None at the directive level — if the browser doesn't
support `<dialog>`, the entire wrap-not-rewrite strategy fails for that
browser. Phase A's browser floor was chosen explicitly to require native
`<dialog>`.

### 2. `[popover]` attribute + `.showPopover()` / `.hidePopover()`

[CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.directive.ts:176-200`

Used by overlay kinds `'popover'` and `'toast'`. The directive checks:

```typescript
if (typeof popoverEl.showPopover === 'function' && typeof popoverEl.hidePopover === 'function') {
  // native path
} else {
  // skip silently — body-portal path takes over for Stencil-driven popovers
}
```

**Fallback path:** For the Phase C popovers, the Stencil core's own
`ensurePortaled()` (via `popover-portal.ts`) continues to relocate the panel
to `.falcon-overlay-container` and position it via
`positionPopoverFixed()`. The Top Layer promotion silently no-ops; the panel
still renders correctly via the legacy body-portal + z-index path.

For the Wave 7 toast stack, the inline `z-[100001]` Tailwind class on the
container acts as the fallback — the stack renders at the legacy toast tier
even when `showPopover()` is unavailable.

### 3. `:popover-open` pseudo-class

[CODE] `libs/falcon-ui-tokens/src/components/overlay-layer.tokens.css`

The Phase A overlay-layer block publishes
`[popover]:popover-open { animation: ... }`.

**Fallback:** Browsers without `:popover-open` simply don't apply the
animation. The Stencil cores' own enter animations (intrinsic to each
component's CSS) continue to drive visible motion. No degradation beyond a
slightly less polished enter transition.

### 4. `dialog::backdrop` pseudo-element

[CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dialog/falcon-dialog.component.css`

Per-component `dialog::backdrop` rules supply the dim layer (`rgba(13,63,68,0.45) + blur(2px)`).

**Fallback:** Browsers without `::backdrop` don't paint the dim layer. The
Stencil core's inner `.falcon-dialog-backdrop` div (still rendered, paint
neutralized at the wrapper level via CSS-variable overrides) is the visual
fallback. Setting `--falcon-dialog-backdrop-bg` back to a non-transparent
value on detecting old browsers would resurrect the inner paint — a future
feature-flagged path if needed.

### 5. CSS Anchor Positioning

Used by Phase C popovers for anchor-relative positioning (not yet adopted at
runtime — Stencil's `positionPopoverFixed` still does the math).

**Fallback:** Phase C popovers continue to use
[CODE] `libs/falcon-ui-core/src/utils/popover-portal.ts:positionPopoverFixed`
unconditionally. The native Anchor Positioning rollout is a future
optimization; today, every browser uses the JS fallback.

### 6. `@starting-style` + `transition-behavior: allow-discrete`

Used by Wave 1 dialogs for entry-from-`display:none` transitions.

**Fallback:** Browsers without these features see no transition (the modal
just appears). Below the floor this degrades silently; above the floor every
browser supports both.

## Feature-detection patterns

### Pattern A — Method existence (Top Layer)

```typescript
const popoverEl = host as PopoverHTMLElement;
if (typeof popoverEl.showPopover === 'function') {
  popoverEl.showPopover();
}
```

Used in: `FalconOverlayDirective.syncToNativeState` and
`FalconStackingService.reassertToasts`.

### Pattern B — Element prototype check

```typescript
const dialog = host as HTMLDialogElement;
if ('showModal' in dialog) {
  dialog.showModal();
}
```

Not currently used — Phase A's browser floor guarantees the method exists,
so the migration relies on the floor instead of runtime detection. If the
floor lowers, this pattern is the upgrade path.

### Pattern C — Try-catch defence

```typescript
try {
  popoverEl.showPopover();
} catch {
  // Some browsers throw InvalidStateError under specific races;
  // swallow and let the next event re-trigger.
}
```

Used throughout the directive + service.

## Deprecation paths (kept as fallback)

These assets are `@deprecated` per Wave 8 but **stay alive** to handle below-
floor browsers:

| Asset | Path | Why kept |
|-------|------|----------|
| `FalconOverlayService.getContainer()` | [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.service.ts` | Body-portal container target for Stencil's `ensurePortaled()`. Without it, below-floor popovers would render trapped in parent stacking contexts. |
| `popover-portal.ts` (`ensurePortaled`, `positionPopoverFixed`) | [CODE] `libs/falcon-ui-core/src/utils/popover-portal.ts` | JS-based positioning fallback for browsers without CSS Anchor Positioning. Stencil cores continue to call into these helpers from `componentDidRender`. |
| `.falcon-overlay-container` CSS | [CODE] `libs/falcon-ui-tokens/src/components/overlay.tokens.css:60-80` | The body-portal target the service creates. Kept for the fallback path. |
| `--falcon-overlay-z-index: 100000` token | [CODE] `libs/falcon-ui-tokens/src/components/overlay.tokens.css:26` | The container's z-index. Without it, below-floor body-portal popovers would render at z-index `auto` and fall behind every overlay. |
| `z-[100001]` literal class on toast stack | [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification-stack.component.ts:56` | Defence-in-depth toast positioning when Popover API is unavailable. |
| 5 z-index tokens | (see [`DEAD-TOKENS.md`](./DEAD-TOKENS.md)) | Stencil shadow-DOM cores still consume them; tokens are the fallback path's stacking authority. |

## Wave 9+ — Fallback retirement timeline

Once the supported-browser matrix shifts entirely above Phase A's floor AND
the Stencil cores complete their own native-`<dialog>` migration:

1. Delete `FalconOverlayService`.
2. Delete `popover-portal.ts`.
3. Delete `.falcon-overlay-container` CSS + the z-index token.
4. Delete the 5 legacy tier tokens (per [`DEAD-TOKENS.md`](./DEAD-TOKENS.md)).
5. Remove the `z-[100001]` defence-in-depth class from the toast stack.

Until then, the fallback path is the safety net.

## See also

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — what each native API replaces.
- [`MIGRATION-NOTES.md`](./MIGRATION-NOTES.md) — wave-by-wave changelog.
- [`DEAD-TOKENS.md`](./DEAD-TOKENS.md) — token-level retention inventory.
- [BRAIN-OUT] `Brain Outputs/_investigations/2026-05-21-top-layer-migration/baseline/BASELINE.md` — the browser-support floor decision.
