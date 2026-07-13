# falcon-notification — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify the right Falcon message surface. For a transient card, the answer is "use the orchestrator (or a facade) — it renders THIS card."

## Visual fingerprint

`[CODE]` falcon-notification.component.ts:70-169 — a rounded card (default `radius:20`px — noticeably rounder than the toast's 10px) that slides in with a spring easing (`falconNotifIn`, `cubic-bezier(0.22,1,0.36,1)`):
- **Leading icon chip** — an 8×8 (`h-8 w-8`) rounded square; bare colored icon by default, or a *gradient-tinted chip with a ring* when `iconBg=true`. 16×16 stroke SVG inside (check / info-circle / X).
- **Body** — bold `title` line + optional smaller muted `subtitle` line.
- **Trailing × dismiss** — 7×7 rounded, muted, hover-tinted.
- **Left accent border** — by default `leftAccent:2` adds 2px to the left border in the intent color (a colored vertical bar signature).
- **Countdown depletion bar** — a thin (`countdownHeight:1`px) intent-colored bar (default at the BOTTOM) animating `scaleX(1)→scaleX(0)` over the dismiss duration. **The notification's headline distinguishing feature.**
- **Optional glossy surface** — `glossy:true` gives `backdrop-blur-xl` + frosted gradient.
- In the live app the card is single (one at a time, from the orchestrator); the superseded stack would corner-anchor multiple.

Distinguishing signature vs the toast: *rounder corners, a left color-accent bar, a visible countdown depletion bar, optional frosted-glass backdrop, spring slide-in.*

## Cross-library equivalents

| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Snackbar>` + `<Alert variant="filled/outlined">` | the notification adds the countdown bar MUI lacks. |
| PrimeNG | `<p-toast>` with a styled template | no native countdown-bar; this is the Falcon-modern upgrade. |
| Ant Design | `notification.open({...})` static API | Ant's `notification.*` ≈ `FalconMessageOrchestratorService.show()` / `FalconNotificationService.push()`; Ant draws a progress line too. |
| Bootstrap | `.toast` + custom progress div | no built-in countdown — hand-rolled. |
| shadcn / Radix | `sonner` / Radix `<Toast>` | `sonner.success(...)` with `duration` + progress ≈ `orchestrator.show({category:'success', …})`. |
| plain HTML | a fixed div with a CSS-animated bar | always replace with the orchestrator. |

## Use THIS vs siblings

| If the design shows… | Use | Not |
|---|---|---|
| a transient card with a visible countdown bar, modern slide-in, rounded | `FalconMessageOrchestratorService.show(...)` (renders this card) | embedding the card directly |
| a transient corner card, simpler, PrimeNG-`MessageService` semantics | (legacy) `FalconMessageService` + `<falcon-angular-message-host>` | this card (overkill / wrong service) |
| a message the user **must click to acknowledge** before continuing | orchestrator `action-required`/`configuration-required` → `<falcon-modal-adapter>` | this card (auto-dismisses, no confirm) |
| an inline status banner FIXED inside a form/page (not floating) | `<falcon-angular-notification>` STANDALONE (a plain card) + `[open]`/`(dismiss)` | the stack / orchestrator |
| a hover hint on an element | `<falcon-angular-tooltip>` | notification |
| an empty-data placeholder | `<falcon-angular-empty-state>` | notification |

## Composition recipe to reach parity

Customization order (`feedback_falcon_custom_library_mandatory`):
1. **For platform messaging** — inject `FalconMessageOrchestratorService` and `show({ category, title, message, source })`, OR a facade (`FalconNotificationService.push`, `FalconToastService.*`, `withMessages` on an HTTP call). `<falcon-toast-adapter>` (already in `app.ts`) renders this card. Do NOT mount a stack.
2. **For a standalone inline card** — use `<falcon-angular-notification>` directly with `[intent]`, `[title]` (required), `[subtitle]`, `[open]`, `(dismiss)`.
3. **Inputs (appearance)** — 16 inputs: `glossy`/`iconBg`/`dismissMode`/`dismissDuration`/`countdownHeight`/`countdownBarTop|Bottom|Glossy`/`borderWidth`/`leftAccent`/`rightAccent`/`radius`. Match the design's roundness/accent/bar placement. Leave unset (`undefined`) to inherit `FalconConfigurationService.notification.*`.
4. **No slots / no templates** — `title` + `subtitle` text only. Rich body content is GAP G3 — raise, don't hand-roll.
5. **Tokens** — appearance is Tailwind-utility + Falcon palette (no dedicated token file — GAP G7). Restyle by overriding palette tokens / config defaults, never hardcoded hex.
6. **Upgrade** — for a confirm/cancel decision, switch to the orchestrator's `modal` channel (the card has only a × dismiss).

## Anti-patterns

- Embedding `<falcon-angular-notification>` per-feature for transient feedback — fire via the orchestrator/facades instead (the adapter renders it).
- Mounting `<falcon-angular-notification-stack>` — superseded; its service feed returns `[]`; renders nothing.
- Mounting a second `<falcon-toast-adapter>` / stack — duplicate cards.
- Expecting a ⚠ triangle for `warning` — the icon map gives `warning` the info-circle (GAP G2).
- Putting a must-acknowledge decision in a notification — only a × dismiss; use the orchestrator modal channel.
- Passing `null` to an appearance input expecting a reset — only `undefined` falls back to config.
- `auto` + `dismissDuration=0` expecting persistence — clamps to 1s; use `manual`.
- Embedding HTML/markup in `title`/`subtitle` — text only.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B16) from falcon-notification.component.ts + .service.ts + the orchestrator/adapter source. CORRECTED: this card is the canonical live surface reached via the orchestrator (not "preferred-but-thinly-adopted"); the stack is superseded. Cross-library map is `[INFERRED]`.
