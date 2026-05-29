# falcon-message-host — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify when the answer is the `FalconMessageService` + `<falcon-angular-message-host>` substrate, and how to compose it.

## Visual fingerprint
`[CODE]` `falcon-message-host.component.ts` — **the message-host has NO visual fingerprint of its own.** It is an invisible bridge component. What a viewer sees is entirely the `<falcon-angular-toast>` stack it renders (see `falcon-toast/RECOGNITION.md` for the toast's visual fingerprint: compact rounded corner card, severity icon chip, ×, auto-vanishing, stacked at a corner).

You never recognize a *message-host* from a screenshot — you recognize a **toast**, and then choose the message-host as the **mechanism** to produce it, because the design implies imperative, PrimeNG-`MessageService`-style firing from anywhere in the app.

## When the design points HERE
A design or React/Angular snippet implies the message-host substrate (not direct toast, not notification) when **all** of these hold:
- It shows a transient corner toast (no countdown bar — that would be notification).
- The firing is **imperative and global** — "any service / interceptor / component can pop a message" — i.e. a `MessageService.add()` / `toast()` pattern, not a card bound to component state.
- The codebase is **migrating from PrimeNG** `<p-toast>` + `MessageService`, or already uses `FalconMessageService`.

## Cross-library equivalents
| Library | Their equivalent | Parity notes |
|---|---|---|
| PrimeNG | `MessageService` (the injectable) driving `<p-toast>` | **direct 1:1** — `FalconMessageService` + `<falcon-angular-message-host>` is the drop-in replacement. `add/addAll/remove/clear` + `{severity,summary,detail,life,closable,icon}` preserved. |
| MUI | a `<SnackbarProvider>` (e.g. `notistack`) mounted once + `useSnackbar().enqueueSnackbar()` | the provider-mounted-once + imperative-enqueue pattern is the structural twin. |
| Ant Design | the global `message` / `notification` static API | Ant's app-wide static API ≈ the singleton `FalconMessageService`. |
| Bootstrap | a hand-rolled toast container + a JS helper | Bootstrap has no service abstraction — closest is a custom singleton. |
| shadcn / Radix | `<Toaster />` mounted once + `useToast()` / `sonner`'s `<Toaster/>` + `toast()` | mount-once container + imperative call = exact analogue. |
| plain HTML | a fixed container div + a global `showToast()` function | always replace with `FalconMessageService`. |

## Use THIS vs siblings
| If the design / scenario shows… | Use | Not |
|---|---|---|
| imperative global toast firing, PrimeNG-`MessageService` migration | `FalconMessageService.add()` + mount `<falcon-angular-message-host>` once | direct `<falcon-angular-toast>` |
| **net-new** global feedback, modern signal API, countdown bar | `FalconNotificationService.push()` + `<falcon-angular-notification-stack>` | message-host |
| a single toast bound to one component's local state | `<falcon-angular-toast>` inside a local `<falcon-angular-toast-host>` | the message-host (overkill) |
| a must-acknowledge decision | `<falcon-angular-popup>` / confirm-dialog | message-host |

## Composition recipe to reach parity
Customization order (per `feedback_falcon_custom_library_mandatory`):
1. **Mount once** — put `<falcon-angular-message-host position="top-right" />` in the app shell (`app.ts`-level), exactly one per app.
2. **Inputs** — the host has only `position` (one of 6 toast-host positions) and `useTailwind`. There is nothing else to configure on the host.
3. **Fire messages** — inject `FalconMessageService` anywhere; call `add({ severity, summary, detail, life, closable, icon })`. For PrimeNG migration, this is the only change: swap the import path.
4. **No slots / no templates** — the host composes toast + toast-host internally; there is no projection surface.
5. **Tokens** — the host has no token contract. To restyle, override `toast.tokens.css` / `toast-host.tokens.css` — you are styling the rendered toasts.
6. **Upgrade** — do not extend the message-host. For new feature work choose the notification path; the message-host stays frozen as the migration substrate.

## Anti-patterns
- Mounting more than one `<falcon-angular-message-host>` — singleton service → duplicate toasts.
- Subscribing to `FalconMessageService.messages$` from a feature component — the host already does this; double-rendering follows.
- Reaching for the message-host in **net-new** code — prefer the notification path (`BUSINESS.md`).
- Mutating `messages$` directly — always go through `add()/remove()/clear()`.
- Forgetting `takeUntilDestroyed(destroyRef)` if you ever re-implement the subscription pattern — causes `NG0203` and a blank render (`INTEGRATION_VALIDATION.md`).
- Trying to "style the message-host" — it has no surface; style the toast tokens.

## Verification
🟡 CODE-DERIVED from `falcon-message-host.component.ts` + `falcon-message-service.ts` + the 6 UI dossier files. The "no visual fingerprint — recognize the toast instead" framing is `[INFERRED]`. Cross-library map is `[INFERRED]` mapping; PrimeNG 1:1 lineage ✅ VERIFIED via `OVERVIEW.md` "Replaces".
