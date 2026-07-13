# falcon-loader-inline — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The inline loader is how Falcon tells the operator **"the system is working — wait."** Since 2026-05-19 it IS the platform's global blocking-loader surface: every long-running commit (place a do-payment order, refresh the org-hierarchy tree, transition from login to landing, fetch service pricing) raises this centered brand card over a dim teal backdrop, blocking interaction until the work resolves. In business terms it is the visible boundary of an in-flight operation — its presence means "do not click again; your request is being processed."

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| A blocking operation must show a global busy indicator | `[CODE]` app.ts:58-78 (global mount bound to `overlayVisible()`) | Any `FalconLoaderService.showOverlay(reason)` surfaces this inline card; the dim backdrop blocks the page until the counter hits 0. |
| Concurrent operations must not double-show / prematurely-hide the loader | `[CODE]` falcon-loader.service.ts:68-86 (counter + disposer) | `showOverlay` increments a counter + returns a dismiss disposer; the loader hides only when ALL holders dismiss — so two overlapping flows can't fight over visibility. |
| A do-payment commit blocks until the order finalizes | `[CODE]` do-payment-priority-popup.component.ts:248 (`showOverlay('do-payment-priority-popup')`) | The loader stays up across the whole socket-or-poll window (night-shift 2026-06-02 due-payment), not just the POST. |
| Per-region loading must not block the whole page | `[CODE]` falcon-loader.service.ts:100-127 (`showInline(target)` per-target counters) | `showInline(target)` keys visibility per region so a card can show its own loader without dimming the app (currently exercised live only by the Studio previews). |
| The loader theme is operator-configurable | `[CODE]` falcon-loader.service.ts:50-58 (`setConfig`) + the Loader Studio | The 30-group config is editable live in the Studio; `validateLoaderConfig` rejects bad input and keeps the prior config. |

## Business constraints baked in
- `[CODE]` **Counter semantics, not a boolean** — `showOverlay`/`showInline` return disposers; the loader is reference-counted (falcon-loader.service.ts:68-127). A builder must dispose their slice (`done()`), not call a "hide" — calling `hideOverlay()` force-resets ALL holders (use sparingly, e.g. a global error handler).
- `[CODE]` **`showInline(target)` requires a non-empty target** — it throws if `target` is falsy (falcon-loader.service.ts:102-104). A region loader without an id is a programming error.
- `[CODE]` **Hidden = zero cost** — the `:not([visible])` token cascade pauses every animation + sets `display:none`, so a kept-alive loader (the always-mounted global card) consumes nothing while idle. A builder must NOT conditionally `*ngIf` the loader out for "performance" — the design already handles it.
- `[CODE]` **Config validation lives in the SERVICE, not the element** — `setConfig` validates + `console.error`s on bad input (:50-58); the element itself silently falls back to defaults on malformed JSON. So a bad config surfaces as a console error from the service, never a thrown error in the UI.
- `[INFERRED]` **The global loader is the OVERLAY counter, not per-target** — `app.ts` binds `[visible]="overlayVisible()"`. So the global busy state is driven by `showOverlay()` calls platform-wide; `showInline()` is for scoped, non-global regions.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Do-Payment / Insufficient-Balance | do-payment-priority-popup | Global blocking loader while the order finalizes (socket + poll window) |
| Service pricing do-payment | service-pricing | Global loader during the pricing/payment commit |
| Org-hierarchy tree path refresh | organization-hierarchy-tree | Global loader during a tree path recompute |
| Login → landing transition | login-transition.service | Global loader bridging the auth handoff |
| Loader theming | Loader Studio | The live config editor + 3 mini-previews render the loader directly |

## Business gotchas
- The global loader's presence is a **business statement** ("a server operation is in flight") — do not suppress it to make the UI "feel faster"; it prevents double-submits.
- A loader that won't hide is almost always a **leaked disposer** — a flow that called `showOverlay()` but didn't `done()` on its completion/error path. The fix is in the CALLER, not the loader.
- The loader owns NO business data — it is a pure UI artifact. Its config is a client-side theming choice, not a persisted/per-tenant resource (`[INFERRED]` no backend persistence exists today).
- Because the global card uses the OVERLAY counter, a `showInline('x')` call will NOT surface the global card — it only flips a per-region loader bound to `isInlineVisible('x')`. Mixing the two is a common confusion.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B17 — NEW) — counter/disposer semantics (falcon-loader.service.ts:68-127), `showInline` non-empty-target throw (:102-104), the global-mount overlay-counter binding (app.ts:106-107), and the zero-cost-when-hidden token cascade (loader-inline.tokens.css:237-260) all re-confirmed in live source. ✅ Do-payment / login-transition / org-tree-refresh remain user-confirmed working flows (`[MEMORY]` due-payment night-shift 2026-06-02). Backend-persistence absence `[INFERRED]` (no save endpoint observed).
