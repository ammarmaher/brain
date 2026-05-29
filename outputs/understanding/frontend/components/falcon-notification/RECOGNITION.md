# falcon-notification — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-notification>` (single card) or `FalconNotificationService` + `<falcon-angular-notification-stack>` (the queue) as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-notification.component.ts:70-169` — a rounded card (default `radius:20`px — noticeably rounder than the toast's 10px) that slides in with a spring easing (`falconNotifIn`, `cubic-bezier(0.22,1,0.36,1)`):
- **Leading icon chip** — an 8×8 (`h-8 w-8`) rounded square; bare colored icon by default, or a *gradient-tinted chip with a ring* when `iconBg=true`. 16×16 stroke SVG inside (check / info-circle / X).
- **Body** — bold `title` line + optional smaller muted `subtitle` line.
- **Trailing × dismiss button** — 7×7 rounded, muted, hover-tinted.
- **Left accent border** — by default `leftAccent:2` adds 2px to the left border in the intent color (a colored vertical bar signature).
- **Countdown depletion bar** — a thin (`countdownHeight:1`px) intent-colored bar, by default at the **bottom**, that animates `scaleX(1)→scaleX(0)` over `dismissDuration`. This is the notification's headline distinguishing feature.
- **Optional glossy surface** — `glossy:true` (default) gives a `backdrop-blur-xl` + gradient frosted-glass backdrop.
- **Stacks** — `<falcon-angular-notification-stack>` parks at a viewport corner (default top-right, below the topbar) and stacks cards with a 2.5 gap.

Distinguishing signature vs the toast: *rounder corners, a left color-accent bar, a visible countdown depletion bar, optional frosted-glass backdrop, spring slide-in.*

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Snackbar>` + `<Alert variant="filled/outlined">` | MUI Snackbar = the positioned stack; the notification adds the countdown bar MUI lacks. |
| PrimeNG | `<p-toast>` with a styled template | PrimeNG has no native countdown-bar notification; this is the Falcon-modern upgrade over `<p-toast>`. |
| Ant Design | `notification.open({...})` | Ant's `notification.*` API ≈ `FalconNotificationService.push()`; Ant draws a progress line too. |
| Bootstrap | `.toast` + custom progress div | Bootstrap toast has no built-in countdown — hand-rolled equivalent. |
| shadcn / Radix | `sonner` toast / Radix `<Toast>` | `sonner` with `duration` + a progress bar is the closest twin; `sonner.success(...)` ≈ `push({intent:'success',...})`. |
| plain HTML | a hand-rolled fixed div with a CSS-animated bar | always replace with `FalconNotificationService`. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a transient card **with a visible countdown / progress bar**, modern slide-in, rounded | `<falcon-angular-notification>` + `FalconNotificationService` | toast |
| a transient corner card with **no** progress bar, PrimeNG-`MessageService` firing semantics | `FalconMessageService.add()` + `<falcon-angular-message-host>` | notification |
| a message the user **must click to acknowledge** before continuing | `<falcon-angular-popup>` / `<falcon-angular-confirm-dialog>` | notification (it auto-dismisses) |
| an inline status banner *fixed inside a form/page* (not floating) | `<falcon-angular-notification>` used **standalone** (not via the stack) — it is a plain card | the stack |
| a hover hint on an element | `<falcon-angular-tooltip>` | notification |
| an empty-data placeholder | `<falcon-angular-empty-state>` | notification |

## Composition recipe to reach parity
Customization order (per `feedback_falcon_custom_library_mandatory`):
1. **For a queue** — inject `FalconNotificationService` (root singleton); call `push({ intent, title, subtitle?, dismissMode?, dismissDuration? })`. Mount `<falcon-angular-notification-stack [position]="…" />` **once** in the app shell.
2. **For a standalone inline card** — use `<falcon-angular-notification>` directly with `[intent]`, `[title]` (required), `[subtitle]`, `[open]`, `(dismiss)`.
3. **Inputs (appearance)** — 14 inputs: `glossy`, `iconBg`, `dismissMode`, `dismissDuration`, `countdownHeight`, `countdownBarTop`/`Bottom`/`Glossy`, `borderWidth`, `leftAccent`, `rightAccent`, `radius`. Match the design's roundness / accent / bar placement here.
4. **No slots / no templates** — `title` + `subtitle` text only. If the design needs rich body content, that is a GAP (`GAPS_AND_UPGRADES.md`) — raise, do not hand-roll.
5. **Defaults via config** — leave an input *unset* (`undefined`) to inherit `FalconConfigurationService.notification.*`; set it explicitly to override per-instance.
6. **Tokens** — appearance is Tailwind-utility + Falcon palette tokens (no dedicated `notification.tokens.css`). Restyle by overriding palette tokens, never hardcoded hex.
7. **Upgrade** — notification is the *preferred* surface; if you find yourself wanting toast's PrimeNG `MessageService` API, you are migrating, not building new — use the toast substrate for that case.

## Anti-patterns
- Mixing toast and notification semantics on the same page — pick one acknowledgement stack.
- Mounting more than one `<falcon-angular-notification-stack>` — singleton service → duplicate cards.
- Expecting a ⚠ triangle for `warning` — the icon map gives `warning` the info-circle (`BUSINESS.md` gotcha).
- Putting a must-acknowledge decision in a notification — it has only a × dismiss, no confirm/cancel. Use a dialog.
- Passing `null` to an appearance input expecting a reset — only `undefined` triggers the config-default fallback.
- Trying to embed HTML/markup in `title`/`subtitle` — text only.

## Verification
🟡 CODE-DERIVED from `falcon-notification.component.ts` + `falcon-notification-stack.component.ts` + `falcon-notification.service.ts` + the 6 UI dossier files. Cross-library map is `[INFERRED]` mapping. "Preferred over toast" ✅ VERIFIED via registry + `OVERVIEW.md`.
