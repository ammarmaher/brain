# falcon-notification — API

## Selectors

- `falcon-angular-notification` — single intent-keyed card (the live renderer).
- `falcon-angular-notification-stack` — fixed corner portal that renders a queue (superseded; not mounted in `app.ts`).
- No Stencil tags — pure Angular components.

## Import

```ts
import {
  FalconAngularNotificationComponent,
  FalconAngularNotificationStackComponent,
  FalconNotificationService,
  FalconToastService,
  FalconToastMessage,
  withSuccess, withError, withMessages, withMessagesOn,
  FALCON_HTTP_MESSAGES, FALCON_HTTP_UI_CONFIG,
  type FalconNotificationIntent,
  type FalconNotificationDismissMode,
  type FalconNotificationStackPosition,
  type FalconHttpUiConfig,
} from '@falcon/ui-core/angular';
```

`[CODE]` Pure Angular — no `CUSTOM_ELEMENTS_SCHEMA` needed. The single card imports `NgClass`; the stack imports the card + `FalconOverlayDirective`.

## Inputs — `FalconAngularNotificationComponent` (signal inputs — `[CODE]` falcon-notification.component.ts:199-219)

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `input<boolean>(true)` | `true` | Visibility gate. |
| `intent` | `input<FalconNotificationIntent>('info')` | `'info'` | `success` / `info` / `warning` / `error`. |
| `title` | `input.required<string>()` | **REQUIRED** | Bold primary line. Compile-time enforced. |
| `subtitle` | `input<string>('')` | `''` | Optional secondary line. |
| `iconBg` | `input<boolean \| undefined>(undefined)` | config | Gradient icon-chip vs bare icon. |
| `glossy` | `input<boolean \| undefined>(undefined)` | config | Frosted-glass backdrop. |
| `dismissMode` | `input<FalconNotificationDismissMode \| undefined>(undefined)` | config | `auto` → timer; `manual` → user click only. |
| `dismissDuration` | `input<number \| undefined>(undefined)` | config | **Seconds** (used only when `auto`). Default comes from `FalconConfigurationService.notification.dismissDurationSec`, NOT a hardcoded `12` (corrected 2026-06-03). |
| `countdownHeight` | `input<number \| undefined>(undefined)` | config | Countdown bar height (px). |
| `countdownBarBottom` | `input<boolean \| undefined>(undefined)` | config | Bottom countdown bar. |
| `countdownBarTop` | `input<boolean \| undefined>(undefined)` | config | Top countdown bar. |
| `countdownBarGlossy` | `input<boolean \| undefined>(undefined)` | config | Full-card glossy depletion overlay. |
| `borderWidth` | `input<number \| undefined>(undefined)` | config | Uniform border (px). |
| `leftAccent` | `input<number \| undefined>(undefined)` | config | Extra px added to LEFT border (the color-accent bar). |
| `rightAccent` | `input<number \| undefined>(undefined)` | config | Extra px added to RIGHT border. |
| `radius` | `input<number \| undefined>(undefined)` | config | Border radius (px). |

> `[CODE]` **The `undefined` sentinel + resolved-getter pattern** (Wave 19, `[CODE]` falcon-notification.component.ts:204-243): every appearance input defaults to `undefined`, meaning "use the `FalconConfigurationService` default." A `resolved*` computed does `this.input() ?? this.cfg.notification.<key>`. Priority chain: **per-instance binding > config app-override > `falcon-defaults.json` default.** Passing `null` does NOT trigger the fallback — only `undefined`.

## Outputs — `FalconAngularNotificationComponent`

`[CODE]` falcon-notification.component.ts:221 — `dismiss = output<void>()`. Fires on auto-timeout, user × click, OR programmatic. Single output for ALL dismissal paths.

## Inputs — `FalconAngularNotificationStackComponent` (`[CODE]` falcon-notification-stack.component.ts:155-167)

Mirror appearance inputs (used as defaults for every queued card), **all with concrete defaults** (the stack does NOT use the `undefined`-sentinel — it has hard defaults):

| Name | Type | Default |
|---|---|---|
| `glossy` | `input<boolean>(true)` | `true` |
| `iconBg` | `input<boolean>(false)` | `false` |
| `countdownHeight` | `input<number>(1)` | `1` |
| `countdownBarBottom` | `input<boolean>(true)` | `true` |
| `countdownBarTop` | `input<boolean>(false)` | `false` |
| `countdownBarGlossy` | `input<boolean>(false)` | `false` |
| `borderWidth` | `input<number>(1)` | `1` |
| `leftAccent` | `input<number>(2)` | `2` |
| `rightAccent` | `input<number>(0)` | `0` |
| `radius` | `input<number>(20)` | `20` |
| `position` | `input<FalconNotificationStackPosition>('top-right')` | `'top-right'` | **`top-right` / `top-left` / `bottom-right` / `bottom-left`** (Wave 4.2) — the prior dossier's "stack position is fixed/hardcoded" is STALE; it IS configurable. |

> `[CODE]` The stack injects `FalconNotificationService` and renders `@for (n of active(); track n.id)`. Since the service is a Phase-5 shim whose `active()` always returns `[]`, the stack renders nothing even if mounted (see INTEGRATION_VALIDATION).

## `FalconNotificationService` API (`[CODE]` falcon-notification.service.ts:59-101)

```ts
@Injectable({ providedIn: 'root' })
export class FalconNotificationService {
  readonly active = computed<FalconNotification[]>();   // ALWAYS [] (Phase-5 shim — orchestrator owns the queue)
  push(args: FalconNotificationPushArgs): number;        // routes to orchestrator.show(); returns a stable numeric id
  dismiss(id: number): void;                             // → orchestrator.dismissByCorrelationId(`falcon-notification|${id}`)
  clear(): void;                                         // → orchestrator.clearAll()
}
interface FalconNotificationPushArgs {
  intent: FalconNotificationIntent; title: string; subtitle?: string;
  dismissMode?: FalconNotificationDismissMode; dismissDuration?: number;
}
```

`[CODE]` `push` maps `intent` → orchestrator `category` (`success`→`success`, `info`→`info`, `warning`→`warning`, **`error`→`business-error`**) and calls `orchestrator.show({ category, title, message: subtitle, source: 'falcon-notification-service', correlationId: 'falcon-notification|<id>' })` (`[CODE]` falcon-notification.service.ts:52-86). Note: `dismissMode`/`dismissDuration` from the args are NOT forwarded to the orchestrator — the rendered card uses the config defaults.

## `FalconToastService` API (`[CODE]` falcon-toast.service.ts`)

```ts
@Injectable({ providedIn: 'root' })
export class FalconToastService {
  show(message: FalconToastMessage): void;               // → notif.push({...})
  success(title: string, body?: string): void;
  error(title: string, body?: string): void;
  warning(title: string, body?: string): void;
  info(title: string, body?: string): void;
}
```

Imperative facade for NON-HTTP cases (client-side validation, optimistic UI). Routes through `FalconNotificationService` → orchestrator.

## Per-HTTP-call message API (`[CODE]` falcon-http-messages.ts`)

```ts
class FalconToastMessage {                               // immutable value object
  constructor(title, body?, intent='info', dismissMode?, dismissDuration?);
  static success/error/warning/info(title, body?): FalconToastMessage;
  withSubtitle(body) / withIntent(intent) / withDismiss(mode, durationSec?): FalconToastMessage;  // all return NEW instances
}
interface FalconHttpMessages { success?: FalconToastMessage; error?: FalconToastMessage; applicationError?: FalconToastMessage; }
const FALCON_HTTP_MESSAGES: HttpContextToken<FalconHttpMessages>;
withSuccess(title, body?) / withError(title, body?) / withMessages(messages) / withMessagesOn(base, messages): { context: HttpContext };
```

Attach as the 3rd arg of `http.{get,post,put,delete}()` — the response interceptor reads `request.context.get(FALCON_HTTP_MESSAGES)` and fires the matching slot via the dispatcher → orchestrator → this card.

## TypeScript types

```ts
type FalconNotificationIntent = 'success' | 'info' | 'warning' | 'error';
type FalconNotificationDismissMode = 'auto' | 'manual';
type FalconNotificationStackPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
interface FalconNotification { id: number; intent; title; subtitle?; dismissMode; dismissDuration; }
```

## CVA / ngModel / Reactive Forms

**NONE.** Not a form control.

## Signal compatibility

`[CODE]` **Signals-first** (unlike toast/tooltip): the card uses `input()` / `input.required()` / `output()` / `computed()` / `signal()` / `effect()` / `inject()` / `DestroyRef` (`[CODE]` falcon-notification.component.ts:8-19, 199-247). `OnPush`. The service uses `signal()` + `computed()`. This is the most modern-Angular component of the three B16 units.

## Methods

None public on the card. Service: `push`/`dismiss`/`clear`.

## Slots / ng-content

**None.** `[CODE]` The card is fully prop-driven — `title` + `subtitle` TEXT only; no `<ng-content>`, no rich/HTML content (GAP G3).

## Supported intents

`[CODE]` falcon-notification.component.ts:35-64 — `INTENTS` map:
- `success` — green border + green gradient chip + **check** icon.
- `info` — teal border + teal chip + **info** icon.
- `warning` — amber border + amber chip + **info** icon (⚠ NOT the `alert`/triangle icon — `icon:'info'` at `[CODE]` line 51; the `'alert'` case exists in the SVG `@switch` but no intent selects it — GAP G2).
- `error` — red border + red chip + **x** icon.

## Constraints

- `[CODE]` `title` is REQUIRED (`input.required`) — compile-time enforced.
- `[CODE]` Auto-dismiss runs in an `effect()` (re-runs on `open()` / `dismissMode` change) (`[CODE]` falcon-notification.component.ts:282-294). **No hover-pause** (unlike toast — GAP G1).
- `[CODE]` Countdown bar uses CSS keyframes (`falconNotifCountdown` scaleX 1→0) with `animation-duration` bound to `resolvedDismissDuration()` (`[CODE]` template lines 146-165 + styles 186-194).
- `[CODE]` `role="status"` + `aria-live="polite"` ALWAYS — never escalates to `assertive` even for `error` (unlike toast — GAP G4).
- `[CODE]` Glossy mode = `backdrop-blur-xl backdrop-saturate-150` + `from-falcon-neutral-0/85 to-falcon-neutral-0/75` gradient (`[CODE]` falcon-notification.component.ts:252).

## Accessibility

- `[CODE]` Card: `role="status"` + `aria-live="polite"` (`[CODE]` falcon-notification.component.ts:73-74).
- `[CODE]` Dismiss × button: `aria-label="Dismiss"` (`[CODE]` line 130) — hardcoded English (no i18n).
- `[CODE]` Decorative svg icons: `aria-hidden="true"` (`[CODE]` lines 95, 134); the glossy tint span + countdown spans `aria-hidden="true"`.
- `[CODE]` Stack container: `aria-live="polite"` + `aria-relevant="additions text"` (`[CODE]` falcon-notification-stack.component.ts:68-69); toast-adapter mirrors this (`[CODE]` falcon-toast-adapter.component.ts:78-79).
- `[CODE]` Only the × button is focusable inside the card — Tab reaches just the dismiss button.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16) against falcon-notification.component.ts (315 ln), falcon-notification-stack.component.ts (187 ln), falcon-notification.service.ts (101 ln), falcon-toast.service.ts, falcon-http-messages.ts, falcon-http-ui.tokens.ts. CORRECTED: `dismissDuration` default is config-driven (`undefined` sentinel), NOT 12; stack HAS a `position` input (Wave 4.2); service is a Phase-5 shim (`active()`→`[]`); added the FalconToastService + withMessages + FalconToastMessage facade APIs.
