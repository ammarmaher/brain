# falcon-tooltip — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md` etc. Business → `BUSINESS.md`.

## Owning backend module(s)

**None.** `[CODE]` falcon-tooltip.tsx — no HTTP calls, no service injection of a data service, no DTO binding. The tooltip is a pure presentational decorator. Its content is a plain string (`content` prop) or projected `slot="content"` markup; if that content reflects backend data, the fetch happens in the consuming component.

## Backend wiring

| Endpoint | Method | Backend module | DTO | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | Tooltip is presentational. Any data shown inside it is resolved by the host before binding `[content]`. |

## Validation rules (V-*)

| V-rule | Field | Trigger | Error |
|---|---|---|---|
| — | — | — | The tooltip declares no validation. It may *display* a field-format hint explaining a `V-*` rule, but it neither runs nor enforces one. |

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| — | — | The tooltip has no PES key. If the control it decorates is PES-gated, the parent renders that control disabled — the tooltip can still show (set `disabled` to mute it). |

## State / signal pattern

- `[CODE]` falcon-tooltip.component.ts:74-87 — the Angular wrapper uses classic `@Input()`/`@Output()` decorators + `inject()` for `FalconStackingService` + `ElementRef`.
- `[CODE]` falcon-tooltip.tsx:41-43 — inside Stencil, visibility is `@State() openInternal`; panel transform is `@State() panelTransform`. Fully self-managed; no external state.
- `[CODE]` falcon-tooltip.tsx:87-111 — show debounced by `delay` (default 100ms); hide debounced by a HARDCODED 80ms.
- `[CODE]` falcon-tooltip.tsx:45-48 — outputs `falcon-show` (`{ placement }`) + `falcon-hide` (`{ reason }`).
- `[INFERRED]` No error-pipeline interaction — the tooltip never participates in HTTP error handling.

## Top Layer / Popover integration (Wave 6 — the wrapper's one piece of real plumbing)

`[CODE]` falcon-tooltip.component.ts:48-177 — **NEW vs prior dossier.** The Stencil renders the panel INLINE (light DOM for `-tw`, shadow DOM for the default) with `data-component="falcon-tooltip-panel"`, positioned by an inline `transform`. That inline panel can be clipped by an ancestor stacking context (e.g. a transformed table row, an open drawer). The Angular wrapper fixes this:

1. On `falcon-show`, `scheduleTopLayerAcquire()` defers one rAF (the panel mounts on the NEXT render) then `acquireTopLayer()`.
2. `acquireTopLayer()` probes the host subtree for `[data-component="falcon-tooltip-panel"]` (and falls back to the `<falcon-tooltip>` shadowRoot for the non-Tailwind path), sets `popover="manual"`, neutralizes the UA popover defaults (`right/bottom: auto !important; margin: 0 !important`), calls `showPopover()`, and `stacking.register(popoverEl, 'popover')`.
3. On `falcon-hide` (and `ngOnDestroy`), `releaseTopLayer()` calls `hidePopover()` + `stacking.unregister()` — idempotent.

`[CODE]` Tooltip uses `popover="manual"` (NOT `auto`) because `auto` would dismiss on the first outside click, defeating the hover-still UX — the Stencil's own pointer-leave/blur handlers stay in charge of close (`[CODE]` falcon-tooltip.component.ts:138-143).

### Overlay / z-index tier ladder

`[CODE]` tooltip.tokens.css:77 — `--falcon-tooltip-z-index: 1100`. But for the WRAPPER path the real ordering is the **Top Layer** (above all z-index), managed by `FalconStackingService`. The token `1100` is the fallback for browsers without Popover support / the raw Stencil tag. Relative to the platform tiers: drawer/popup-dialog 99999, body-portaled popover 100000, notification toast 100001 (see overlay.tokens.css) — the tooltip's Top-Layer entry is LIFO-ordered with the other popovers via the stacking service.

## Skeleton ↔ app-wrapper layering

Two library layers (NO app-level service wrapper):
1. **Stencil skeleton** — `<falcon-tooltip>` (Shadow, `shadow:true`) / `<falcon-tooltip-tw>` (Light DOM). Owns the trigger wrapper, panel, show/hide timers, and the JS positioning escape hatch.
2. **Angular wrapper** — `<falcon-angular-tooltip>`. Bridges `@Input`/`@Output`, registers the Stencil tag on demand, re-emits CustomEvents, AND performs the Top-Layer acquire/release (the one stateful behavior beyond a pure pass-through).

**Positioning escape hatch** — `[CODE]` falcon-tooltip.tsx:113-125,157-162 — `measurePanel()` sets `panel.style.transform = translate(Xpx, Ypx)` from `computeOffset(triggerRect, panelRect, placement, offset)` (`[CODE]` falcon-tooltip.utils.ts:22-48). The gap is read from `--falcon-tooltip-offset` (`[CODE]` falcon-tooltip.tsx:127-134, default 8). Every other visual value stays in `tooltip.tokens.css`. `computeOffset` is a PURE function (no CSS-var reads, no DOM) — unit-testable in isolation.

Per `feedback_library_skeleton_app_api`: the tooltip needs no DATA service — a feature simply composes `<falcon-angular-tooltip>` inline around a trigger. (`FalconStackingService` is a UI-layer overlay coordinator, not a data service.)

## Integration gotchas

- `[CODE]` falcon-tooltip.tsx:37 `disabled` has **no `@Watch`** — flipping `disabled=true` on an open tooltip does not close it; call `close()`.
- `[CODE]` falcon-tooltip.tsx:166-176 The trigger span gets `tabIndex={0}` unconditionally — wrapping an element with an existing `tabIndex` produces a doubled focus stop.
- `[CODE]` falcon-tooltip.tsx:107-111 Hide delay is hardcoded 80ms — not configurable.
- `[CODE]` falcon-tooltip.tsx:35 No collision/flip — a tooltip can overflow the VIEWPORT EDGE (the Top-Layer promotion fixes ancestor-clipping, a DIFFERENT problem). `computeOffset` honors only the requested `placement`.
- `[CODE]` falcon-tooltip.tsx:171 `aria-describedby` links trigger→panel ONLY while showing — WAI-ARIA APG suggests a persistent link.
- `[CODE]` falcon-tooltip.component.ts:111-116 The Top-Layer acquire uses a rAF fallback to `setTimeout(…, 16)` when `requestAnimationFrame` is unavailable (SSR/Node) — defensive, but in a non-DOM environment `acquireTopLayer` short-circuits when `showPopover` is absent.
- `[CODE]` falcon-tooltip.tsx:159-162 `maxWidth` is the only consumer-controllable inline style on the panel beyond the JS transform.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B16) from falcon-tooltip.tsx + falcon-tooltip.utils.ts + falcon-tooltip.component.ts + tooltip.tokens.css. ADDED the full Top-Layer/Popover/`FalconStackingService` integration (Wave 6) — the prior dossier described the inline z-index ladder only and MISSED the popover promotion entirely. No backend module, no `V-*` rules, no PES key — confirmed presentational.
