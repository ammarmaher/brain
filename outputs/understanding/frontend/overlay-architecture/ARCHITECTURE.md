---
type: architecture-primer
domain: frontend / overlays
status: canonical
last-updated: 2026-05-21
applies-to: Falcon Web Platform UI · Angular 20 + Stencil cores
---

# Overlay Architecture — Top Layer Primer

After the 8-wave Top Layer migration (Phases A-D, 2026-05-21), every Falcon
overlay (modal · drawer · popover · tooltip · toast) renders in the browser's
**native Top Layer** via the [`[falconOverlay]`](../../../../Falcon/falcon-web-platform-ui/libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.directive.ts)
directive. This document is the primer for new developers and the canonical
reference for "where do overlays live now".

## The one rule

> **Use `[falconOverlay]` for any overlay. Never invent a z-index for stacking.**

The browser's Top Layer is a parallel paint context that renders above the
entire z-index world. Any element promoted into Top Layer (via
`<dialog>.showModal()` or `[popover].showPopover()`) paints above every
z-indexed element on the page, regardless of stacking contexts or z-index
values.

## The four overlay kinds

[CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.directive.ts`

The directive accepts a `kind` from this union:

| Kind | Native API | Use case |
|------|-----------|----------|
| `'modal'` | `<dialog>.showModal()` | Confirm/alert/IB dialogs, popups |
| `'drawer'` | `<dialog>.showModal()` + slide-in panel | Side drawers |
| `'popover'` | `[popover='auto'].showPopover()` | Menus, dropdowns, date-pickers, tooltips with light-dismiss |
| `'toast'` | `[popover='manual'].showPopover()` | Notification toasts (no light-dismiss) |

The directive owns:
- `showModal()` / `close()` / `showPopover()` / `hidePopover()` lifecycle.
- Two-way `falconOpen` model binding.
- Native `close` / `cancel` / `toggle` event bridging.
- `FalconStackingService` registration (kind tracker).

## The stacking service

[CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-stacking.service.ts`

Singleton (`providedIn: 'root'`) that tracks every open overlay by kind. The
critical job: **toasts always render topmost**. When any `modal` or `drawer`
registers, the service schedules a `requestAnimationFrame` callback that
calls `reassertToasts()` — iterates every tracked toast and calls
`hidePopover() + showPopover()`, re-popping it to the top of the Top Layer
LIFO order.

[CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-stacking.service.ts:73-90`

```typescript
register(el: HTMLElement, kind: FalconOverlayKind): void {
  // ...
  if (kind === 'modal' || kind === 'drawer') {
    const raf = typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 16);
    raf(() => this.reassertToasts());
  }
}
```

## Usage examples

### Modal

[CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.html`

```html
<dialog #dlg
  falconOverlay="modal"
  [falconOpen]="open()"
  (falconClose)="onCancel()"
  (falconCancel)="onNativeCancel($event)">
  <!-- dialog content -->
</dialog>
```

### Drawer

[CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-drawer/falcon-drawer.component.html`

```html
<dialog #dlg class="falcon-angular-drawer-host"
  [attr.data-drawer-position]="position"
  falconOverlay="drawer"
  [falconOpen]="openSignal()"
  (falconClose)="onNativeDialogClose()">
  <!-- drawer content -->
</dialog>
```

### Popover (manual, e.g. tooltip)

The Phase C popovers (tooltip, menu, dropdown, multi-select, combobox,
date-picker, phone-field) use a slightly different pattern — they don't apply
the directive directly because the Stencil-rendered panel needs feature-
detected promotion. See [CODE]
`libs/falcon-ui-core/src/angular-wrapper/components/falcon-tooltip/falcon-tooltip.component.ts`
for the `acquireTopLayer` / `releaseTopLayer` pattern.

### Toast

[CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification-stack.component.ts:60-72`

```html
@if (hasActiveToasts()) {
  <div
    [class]="containerClasses()"
    aria-live="polite"
    [falconOverlay]="'toast'"
    [falconOpen]="true">
    <!-- toast cards -->
  </div>
}
```

The `@if` conditionally mounts the stack only when at least one notification
is active. The directive automatically registers + acquires Top Layer on
mount; unregisters + releases on unmount.

## Why Top Layer (vs portal-to-body + z-index)

The Top Layer was specifically designed to solve **stacking-context traps**:
- Parent with `transform`, `filter`, `opacity < 1`, or `will-change` creates a
  new stacking context.
- Any z-index inside that context is trapped — a sibling outside the context
  with higher z-index still renders on top.
- Portal-to-body lifts elements out, but every component must opt in.

Top Layer requires no DOM relocation. The browser handles stacking natively.

## Browser support

Native `<dialog>` + Popover API floor:
- Chrome / Edge 117+
- Safari 17+
- Firefox 125+

Below the floor, the migration's feature-detected fallbacks engage:
- `[falconOverlay]` directive checks `typeof el.showPopover === 'function'`.
- Body-portal path (`FalconOverlayService` + `popover-portal.ts`) is the
  fallback (Stencil cores still call `ensurePortaled()`).

See [`BROWSER-FALLBACKS.md`](./BROWSER-FALLBACKS.md).

## Anti-patterns

- Authoring new `z-[<N≥1000>]` classes in templates → blocked by ESLint
  `no-restricted-syntax` (Wave 8.4).
- Creating a `<div class="fixed inset-0 z-[99999]">` wrapper for a new modal —
  use `<dialog falconOverlay="modal">`.
- Inventing new z-index tokens like `--falcon-my-modal-z-index` — the 5
  legacy tokens are the only allowed values (and are pending deletion).
- Calling `FalconOverlayService.getContainer()` from new code — deprecated.

## See also

- [`MIGRATION-NOTES.md`](./MIGRATION-NOTES.md) — wave-by-wave changelog.
- [`DEAD-TOKENS.md`](./DEAD-TOKENS.md) — z-index tokens kept as fallback.
- [`BROWSER-FALLBACKS.md`](./BROWSER-FALLBACKS.md) — feature-detection map.
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.directive.ts`
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-stacking.service.ts`
- [CODE] `libs/falcon-ui-tokens/src/components/overlay-layer.tokens.css` — `@layer falcon-overlay` block (Phase A).
- [BRAIN-OUT] `Brain Outputs/_investigations/2026-05-21-top-layer-migration/phase-{a,b,c,d}/PHASE-*-REPORT.md` — full investigation chain.
