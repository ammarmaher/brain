# falcon-notification — DECISION

## Brain SK final recommendation

**STATUS: READY — the canonical, live transient-message card.** The orchestrator renders THIS card (via `<falcon-toast-adapter>`) for every platform message. Use it for ALL business-status feedback, reached through the orchestrator or a facade — NOT by mounting the (superseded) stack.

## Use this component for

- Async-action results ("Saved", "Failed to publish").
- Validation feedback ("Email already in use").
- HTTP error/success feedback (400 → top-right error card; per-call success via `withSuccess()`).
- Any transient business-status message — it is THE surface.

## Avoid this component for

- Action-required decisions (confirm/cancel) → orchestrator `action-required`/`configuration-required` (modal channel via `<falcon-modal-adapter>`).
- Tooltips / drawers / dialogs → dedicated components.
- Mounting the stack → superseded by `<falcon-toast-adapter>` (already in `app.ts`); the stack's service feed returns `[]`.

## Preferred render path

Single Angular render path (no `useTailwind`). Reach it via:
1. **`FalconMessageOrchestratorService.show({ category, … })`** (most control).
2. **`FalconNotificationService.push({ intent, … })`** (legacy facade, still widely used).
3. **`FalconToastService.success/error/...`** (imperative non-HTTP).
4. **`withSuccess()`/`withMessages()`** on an HTTP call (HTTP feedback).

## Required upgrades before wider use

None — it is production and already the live surface. Quality-of-life: G1 (hover-pause), G3 (body slot), G4 (a11y `aria-live` per severity). Decide the fate of the superseded stack COMPONENT (keep the position helper, which the adapter uses).

## Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-message-orchestrator` (`FalconMessageOrchestratorService`) | The routing brain. Renders THIS card via the toast-adapter. |
| `falcon-toast-adapter` | The live renderer off `orchestrator.activeToast()`. Mounted once in `app.ts`. |
| `falcon-modal-adapter` | Sibling renderer for the orchestrator's `modal` channel (blocking confirm/ack). |
| `falcon-angular-toast` | The older PrimeNG-parity card — superseded by this one for app messaging. |
| `falcon-angular-notification-stack` | The card's own companion stack — SUPERSEDED (not mounted; `active()`→`[]`). |
| `FalconNotificationService` / `FalconToastService` | Facades routing into the orchestrator. |
| `FalconConfigurationService` | Supplies the card's appearance defaults (`notification.*` from `falcon-defaults.json`). |

## Exact rule for future implementation tasks

> Use `FalconMessageOrchestratorService.show({ category, title, message, source })` (or `FalconNotificationService.push({intent,…})` / `FalconToastService.*` / per-HTTP `withSuccess()`/`withMessages()`) for ALL transient business-status feedback. The already-mounted `<falcon-toast-adapter>` renders the result as a `<falcon-angular-notification>` card. Do NOT mount `<falcon-angular-notification-stack>` (superseded + inert). Use `<falcon-angular-notification>` directly ONLY for an inline page-fixed status card. For confirm/cancel decisions use the orchestrator's `action-required`/`configuration-required` (modal channel). `title` is required; `dismissMode="manual"` for critical errors; default duration is config-owned (`falcon-defaults.json.notification.dismissDurationSec`), NOT a hardcoded 12s. No hover-pause exists today — long messages dismiss mid-read.

## Status

**READY / canonical live surface.**

---

## Dynamic capability assessment

### 1. What is static today?
- 4 intents; 4 hardcoded inline SVG icons (and `warning` uses the `info` icon — GAP G2).
- `aria-live` always `polite` (GAP G4).
- No hover-pause (GAP G1); no body slot (GAP G3); no action button on the card (GAP G5).
- No token file (GAP G7).

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` 16 signal-inputs (open/intent/title-required/subtitle + 12 appearance knobs, all `undefined`-sentinel config-backed).
- 1 output: `dismiss` (all paths). The stack adds `position` (Wave 4.2) + 10 appearance defaults.

### 3. What is already dynamic through slots / ng-template?
None (GAP G3).

### 4. What is dynamic through token / theme overrides?
- Only via the global palette + `FalconConfigurationService.notification.*` defaults. No per-instance token file (GAP G7).

### 5. What is dynamic through Tailwind classes?
- The component IS Tailwind-direct; callers don't add Tailwind around it (it doesn't penetrate the inline template).

### 6. What is missing to make this component reusable across pages?
- Hover-pause, body slot, action button, `aria-live` per severity, `alert` icon for warning, icon-component composition, token file. (It is ALREADY reused everywhere via the orchestrator — these are polish, not blockers.)

### 7. What capability should be added to the shared component (not a page hack)?
- All of item 6 — they are library-level.

### 8. What flags / options / templates / slots would make it better?
- `[hoverPause]`, `<ng-content>` body, `[iconName]` override, `[actionLabel]`/`[actionHref]`/`(actionClick)`, an `aria-live` computed, a token file.

### 9. What is the safest upgrade path?
1. `hoverPause` (additive, default true).
2. `<ng-content>` body (additive, falls back to subtitle).
3. `aria-live` computed (a11y; behavior-additive).
4. `alert` icon for warning (visual — behind `iconName` override / minor version).
5. Action-button props threaded through orchestrator + adapter.
6. `notification.tokens.css` (additive; refactor inline `[style.*]`).
7. Resolve the superseded stack component (keep the helper).

### 10. What is risky to change because other things depend on it?
- **The 16 input names + the `undefined`-sentinel resolved-getter contract** — appearance is tuned to the T2 reference + config defaults; changing defaults shifts the look platform-wide.
- **`title` required** — relaxing it loosens every call site.
- **The single `(dismiss)` output for all paths** — splitting it would break the adapter + the stack handlers.
- **The orchestrator `category → intent` mapping in the adapter** (`business-error`→`error`, etc.) — changing it re-colors HTTP errors.
- **The `falconNotificationStackContainerClasses` helper** — reused by BOTH the stack and the toast-adapter; changing the anchor classes moves the LIVE card, not just the dead stack.
- **The `z-[100001]` / Top-Layer tier** — notifications must stay topmost (priority-1 rule).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16). Recommendation sharpened to "canonical live surface" (was "preferred alternative to toast"). CORRECTED: dismiss default is config-owned not 12s; stack is superseded; the position helper is shared with the live adapter (a hidden risk). a11y `aria-live` (G4) flagged HIGH-RISK-QUEUE.
