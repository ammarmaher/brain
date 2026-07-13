# falcon-toast — DECISION

## Brain SK final recommendation

**STATUS: SUPERSEDED — runtime-orphaned PrimeNG-parity substrate. Do NOT use directly; do NOT grow its API.** The component is fully functional and NOT API-`@deprecated`, but it has zero `apps/**` consumers and its one composition (`<falcon-angular-message-host>`) is dead-mounted — the live transient-messaging surface is `FalconMessageOrchestratorService` → `<falcon-toast-adapter>` → `<falcon-angular-notification>`.

## Use this component for

- **Almost never directly.** New messaging → `FalconMessageOrchestratorService.show({ category, … })` (or the `FalconNotificationService` / `FalconToastService` / `withMessages` facades over it).
- The ONLY legitimate `<falcon-toast>` use is reviving the legacy `FalconMessageService` + `<falcon-angular-message-host>` path for a hard PrimeNG `MessageService`/`<p-toast>` migration — and even then, prefer porting to the orchestrator.

## Avoid this component for

- Any new code (use the orchestrator + notification card).
- Must-acknowledge errors (orchestrator `action-required`/`configuration-required` → modal channel).
- Persistent messages (toasts auto-dismiss).
- Tooltips / drawers / dialogs — wrong concept.

## Preferred render path

`useTailwind=true` (default → `<falcon-toast-tw>` Light DOM). **Caveat:** the Light-DOM `-tw` host is the one MISSING the `role="region"` landmark + reduced-motion (G3) — so the default render path is the a11y-weaker one.

## Required upgrades before wider use

None — and there should be no "wider use." If revived: G3 (`-tw` host region landmark) is the one a11y fix worth doing; G1 (`dismiss()` proxy) + G4 (info hex) are cosmetic.

## Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-message-orchestrator` (`FalconMessageOrchestratorService`) | The CANONICAL routing layer. Does NOT render `<falcon-toast>` — renders `<falcon-angular-notification>` via the toast-adapter. |
| `falcon-angular-notification` | The card the platform actually renders for toasts. The de-facto replacement. |
| `falcon-toast-adapter` | The live renderer off `orchestrator.activeToast()`. Mounted once in `app.ts`. |
| `falcon-angular-message-host` | Composes `<falcon-angular-toast>` + `<falcon-angular-toast-host>` off `FalconMessageService` — the ONE consumer, dead-mounted. |
| `falcon-angular-toast-host` | Stack positioner — independent component, same supersession status. |

## Exact rule for future implementation tasks

> Do NOT use `<falcon-angular-toast>` / `<falcon-angular-toast-host>` in any new code. For success/error/info/warning feedback, call `FalconMessageOrchestratorService.show({ category, title, message, source })`, OR use the legacy facades `FalconNotificationService.push({intent,…})` / `FalconToastService.success(...)` / per-HTTP-call `withSuccess()`/`withMessages()` — all route into the orchestrator, which renders `<falcon-angular-notification>` via the already-mounted `<falcon-toast-adapter>`. For must-acknowledge errors use the orchestrator's `action-required`/`configuration-required` categories (modal channel). Never mount `<falcon-angular-message-host>` in a new shell. Treat `<falcon-toast>` as parked plumbing.

## Status

**SUPERSEDED / runtime-orphaned.** Functional substrate; not for direct use; not for growth.

---

## Dynamic capability assessment

### 1. What is static today?
- Severity set fixed at 4 (`info`/`success`/`warning`/`error`).
- Severity icons = hardcoded inline SVG path strings (G5).
- Host positions fixed at 6.
- Auto-dismiss logic internal; no callbacks during ticking.
- No countdown bar, no progress, no grouping.
- info-severity colors hardcoded hex (G4).
- `maxToasts` declared but unimplemented (G2).
- Dismiss `aria-label` hardcoded English (G6).

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` 10 toast inputs (severity/title/message/duration/dismissible/icon/actionLabel/actionHref/useTailwind/rootClass); 5 host inputs (position/gap/maxToasts/useTailwind/rootClass).
- 2 outputs: `(falconDismiss)`, `(falconActionClick)`.
- 1 Stencil `@Method`: `dismiss()` (NOT proxied on the wrapper — G1).
- Classic `@Input()`/`@Output()` decorators (NOT signal-input).

### 3. What is already dynamic through slots / ng-template?
- Toast: default `<slot />` + `slot="action"` (both paths).
- Host: default `<slot />` (both paths).
- No `ng-template` inputs.

### 4. What is dynamic through token / theme overrides?
- Surface (bg, border, radius, shadow, padding), per-severity icon colors (one hex exception), title/message font, dismiss/action button, motion, sizing, z-index. ~14 token categories via `rootClass` host scope.

### 5. What is dynamic through Tailwind classes?
- `rootClass` flows to the Stencil tag (both paths). `action` + default slots accept full Tailwind.

### 6. What is missing to make this component reusable across pages?
- N/A — superseded. The reusable surface is the orchestrator + notification card.

### 7. What capability should be added to the shared component (not a page hack)?
- Only G3 (`-tw` host a11y landmark) IF revived. Otherwise nothing — invest in notification + orchestrator.

### 8. What flags / options / templates / slots would make it better?
- `dismiss()` wrapper proxy (G1); region landmark on `-tw` host (G3); palette token for info severity (G4); icon-component composition (G5); i18n dismiss label (G6). All low value given supersession.

### 9. What is the safest upgrade path?
- Don't grow it. If `FalconMessageService` is permanently retired, delete the whole quad + `<falcon-angular-message-host>` in lockstep with `--falcon-toast-host-z-index` (DEAD-TOKENS.md).

### 10. What is risky to change because other things depend on it?
- **`maxToasts` removal** — a public-API change (even though unused). HIGH-RISK-QUEUE.
- **The 6-position host token contract** — relocating tokens shifts any consumer that revives the host.
- **The `--falcon-toast-host-z-index` token** — still read by Stencil Shadow host paths + app `tailwind.css`; deleting it out of lockstep breaks the fallback tier.
- **The aria-live mapping** (`assertive` for warning/error) — removing degrades a11y.
- **`<falcon-angular-message-host>` composition chain** — if revived, breaking any link breaks the legacy substrate.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16). Recommendation changed to SUPERSEDED/runtime-orphaned (was "DEPRECATED per registry"). Counts: 10 toast + 5 host inputs, 2 outputs, 1 unproxied `@Method`; classic decorators (not signal). G3 a11y gap noted as the one fix worth doing if revived.
