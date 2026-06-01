# falcon-tooltip — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md` etc. Business → `BUSINESS.md`.

## Owning backend module(s)
**None.** `[CODE]` `falcon-tooltip.tsx` — no HTTP calls, no service injection, no DTO binding. The tooltip is a pure presentational decorator. Its content is a plain string (`content` prop) or projected slot markup supplied by the consumer; if that content reflects backend data, the fetch happens in the consuming component.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | Tooltip is presentational. Any data shown inside it is resolved by the host component before binding `[content]`. |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | — | — | The tooltip declares no validation. It may *display* a field-format hint that explains a `V-*` rule, but it does not run or enforce one. |

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| — | — | The tooltip has no PES key. If the control it decorates is PES-gated, the parent simply renders the control disabled — the tooltip can still show (set `disabled` to mute it if the hint becomes irrelevant). |

## State / signal pattern
- `[CODE]` `falcon-tooltip.component.ts` (per `[BRAIN-OUT]` `API.md:72`) — the Angular wrapper uses **classic `@Input()` decorators**.
- `[CODE]` `falcon-tooltip.tsx:41-43` Inside Stencil, visibility is `@State() openInternal`; the panel transform is `@State() panelTransform`. The component is fully self-managed — no external state needed.
- `[CODE]` `falcon-tooltip.tsx:87-111` Show is debounced by `delay` (default 100ms); hide is debounced by a **hardcoded 80ms** (`[BRAIN-OUT]` `GAPS_AND_UPGRADES.md:17`).
- `[CODE]` `falcon-tooltip.tsx:45-48` Outputs: `falconShow` (`{ placement }`) and `falconHide` (`{ reason: 'pointer-leave' | 'blur' | 'disabled' | 'programmatic' }`).
- `[INFERRED]` No error-pipeline interaction — the tooltip never participates in HTTP error handling.

## Skeleton ↔ app-wrapper layering
Two layers, both inside the library — there is **no app-level wrapper**:
1. **Stencil skeleton** — `[CODE]` `falcon-tooltip.tsx` `<falcon-tooltip>` (Shadow DOM, `shadow: true`) and the Light-DOM twin `<falcon-tooltip-tw>`. Owns the trigger wrapper, the panel, the show/hide timers, and the JS positioning escape hatch.
2. **Angular wrapper** — `<falcon-angular-tooltip>` (`[CODE]` `falcon-tooltip.component.ts`). Bridges `@Input`/`@Output`, registers the Stencil tag on demand, re-emits CustomEvents.

**Positioning escape hatch** — `[CODE]` `falcon-tooltip.tsx:113-125,157-162` the panel position is the one exception to "all paint in tokens": `measurePanel()` sets `panel.style.transform = translate(Xpx, Ypx)` from `computeOffset(triggerRect, panelRect, placement, offset)` (`[CODE]` `falcon-tooltip.utils.ts`). The trigger-to-panel gap is read from the `--falcon-tooltip-offset` CSS var (`[CODE]` `falcon-tooltip.tsx:127-134`, default 8px). Every other visual value stays in `tooltip.tokens.css`.

Per `feedback_library_skeleton_app_api`: there is nothing app-level to layer here — the tooltip needs no services. A feature component simply composes `<falcon-angular-tooltip>` inline around a trigger.

### Overlay / z-index tier ladder
`[CODE]` `tooltip.tokens.css` exposes `--falcon-tooltip-z`; `[BRAIN-OUT]` `TOKENS.md:55`. The Falcon overlay tier ordering, low → high:
- **`falcon-tooltip` (`--falcon-tooltip-z`)** — the lightest overlay; sits above page content but is the transient, lowest-commitment tier.
- `falcon-drawer` (`--falcon-drawer-z`) — edge-anchored sheet.
- `falcon-dialog` (`--falcon-dialog-z`) — centered modal.
- `falcon-insufficient-balance-dialog` (`z: 1000`) / `falcon-sending-credentials-dialog` (`z: 1200`) — domain dialogs at the modal tier.
- `[INFERRED]` A tooltip on a control *inside* a dialog/drawer must out-rank that overlay's panel — the tooltip token z is the highest among the "non-blocking" overlays so a hint on a dialog button still renders on top.

## Integration gotchas
- `[CODE]` `falcon-tooltip.tsx:37` `disabled` has **no `@Watch`** — flipping `disabled=true` on an already-open tooltip does not close it; call `close()` (`[BRAIN-OUT]` `GAPS_AND_UPGRADES.md:13`).
- `[CODE]` `falcon-tooltip.tsx:166-176` The trigger span gets `tabIndex={0}` unconditionally — wrapping an element that already has a `tabIndex` produces a doubled focus stop (`[BRAIN-OUT]` `USAGE.md:88`).
- `[CODE]` `falcon-tooltip.tsx:107-111` Hide delay is a hardcoded 80ms — not configurable via input.
- `[CODE]` `falcon-tooltip.tsx:35` No collision/flip — a tooltip can overflow the viewport; `computeOffset` honors only the requested `placement`.
- `[CODE]` `falcon-tooltip.tsx:171` `aria-describedby` links the trigger to the panel **only while the tooltip is showing** — WAI-ARIA APG suggests a persistent link (`[BRAIN-OUT]` `GAPS_AND_UPGRADES.md:61`).
- `[CODE]` `falcon-tooltip.tsx:159-162` `maxWidth` is the only consumer-controllable inline style on the panel — everything else is the JS transform plus tokens.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-tooltip.tsx` + `falcon-tooltip.utils.ts` reference + `tooltip.tokens.css` references + `[BRAIN-OUT]` existing dossiers. No backend module, no `V-*` rules, no PES key — confirmed presentational.
