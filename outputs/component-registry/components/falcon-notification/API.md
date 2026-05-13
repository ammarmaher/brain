# falcon-notification — API

## Angular selectors
- `<falcon-angular-notification>` — single notification card.
- `<falcon-angular-notification-stack>` — fixed top-right portal that renders the global queue.

## Stencil tags
None. Pure Angular components.

## Import path
```ts
import {
  FalconAngularNotificationComponent,
  FalconAngularNotificationStackComponent,
  FalconNotificationService,
  type FalconNotificationIntent,
  type FalconNotificationDismissMode,
  type FalconNotification,
  type FalconNotificationPushArgs,
} from '@falcon/ui-core/angular';
```

## Inputs — `<falcon-angular-notification>`

All inputs use signal-input syntax (`input<T>()`):

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `input<boolean>(true)` | `true` | Controls visibility. |
| `intent` | `input<FalconNotificationIntent>('info')` | `'info'` | One of `success` / `info` / `warning` / `error`. |
| `title` | `input.required<string>()` | (REQUIRED) | Visible primary text. |
| `subtitle` | `input<string>('')` | `''` | Optional secondary line. |
| `iconBg` | `input<boolean>(false)` | `false` | Show icon chip background (default off — bare icon). |
| `glossy` | `input<boolean>(true)` | `true` | Gradient + backdrop-blur surface. |
| `dismissMode` | `input<FalconNotificationDismissMode>('auto')` | `'auto'` | `auto` triggers timer; `manual` requires user click. |
| `dismissDuration` | `input<number>(12)` | `12` | Seconds for auto-dismiss. |
| `countdownHeight` | `input<number>(1)` | `1` | Countdown bar height in px. |
| `countdownBarBottom` | `input<boolean>(true)` | `true` | Show bottom countdown bar. |
| `countdownBarTop` | `input<boolean>(false)` | `false` | Show top countdown bar. |
| `countdownBarGlossy` | `input<boolean>(false)` | `false` | Glossy depletion overlay across whole card. |
| `borderWidth` | `input<number>(1)` | `1` | Border width in px (uniform). |
| `leftAccent` | `input<number>(2)` | `2` | Extra px added to left border width. |
| `rightAccent` | `input<number>(0)` | `0` | Extra px added to right border width. |
| `radius` | `input<number>(20)` | `20` | Border radius in px. |

## Outputs — `<falcon-angular-notification>`

| Name | Payload |
|---|---|
| `dismiss` | `void` — fires on auto-timeout, user click, or programmatic. |

## Inputs — `<falcon-angular-notification-stack>`

Mirror of `<falcon-angular-notification>` appearance inputs (used as defaults for all queued notifications):

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

The stack injects `FalconNotificationService` and renders one `<falcon-angular-notification>` per active notification.

## FalconNotificationService API

```ts
@Injectable({ providedIn: 'root' })
export class FalconNotificationService {
  readonly active = computed<FalconNotification[]>();
  
  push(args: FalconNotificationPushArgs): number;  // returns assigned id
  dismiss(id: number): void;
  clear(): void;
}

export interface FalconNotificationPushArgs {
  intent: FalconNotificationIntent;
  title: string;
  subtitle?: string;
  dismissMode?: FalconNotificationDismissMode;     // default 'auto'
  dismissDuration?: number;                        // default 12 seconds
}

export interface FalconNotification {
  id: number;
  intent: FalconNotificationIntent;
  title: string;
  subtitle?: string;
  dismissMode: FalconNotificationDismissMode;
  dismissDuration: number;
}
```

## TypeScript types

```ts
export type FalconNotificationIntent = 'success' | 'info' | 'warning' | 'error';
export type FalconNotificationDismissMode = 'auto' | 'manual';
```

## Reflected props (Stencil)
N/A (Angular-only).

## Methods
None public.

## Slots
**None.** Fully prop-driven. No rich content support beyond `title` + `subtitle`.

## CVA support
Not applicable.

## Signal compatibility
- All inputs are signal-inputs (`input<T>()`).
- Output is `output<void>()`.
- Internal state uses `signal()` + `computed()`.
- Service uses `signal<T>()` + `computed()` (modern Angular pattern).

## Supported intents
- `success` — green border + green icon chip (when iconBg=true) + check icon.
- `info` — teal border + teal icon chip + info icon.
- `warning` — amber border + amber icon chip + info icon (NOT alert — verify).
- `error` — red border + red icon chip + x icon.

## Important constraints
- **`title` is REQUIRED.** Service `push()` enforces this via the args interface.
- **Auto-dismiss timer uses `effect()`** — re-runs on `open()` change or `dismissMode` change.
- **No hover-pause** (unlike toast).
- **Countdown bar animation uses CSS keyframes** with `animation-duration` bound to `dismissDuration()`.
- **`role="status"` + `aria-live="polite"`** — always polite, no severity-based assertive switch (unlike toast).
- **Glossy mode applies `backdrop-blur-xl backdrop-saturate-150`** + gradient `from-falcon-neutral-0/85 to-falcon-neutral-0/75`.

## Accessibility attributes
- `role="status"`.
- `aria-live="polite"`.
- Stack container: `aria-live="polite"`, `aria-relevant="additions text"`.
- Dismiss button: `aria-label="Dismiss"`.

## Parts
None — Angular template, not Stencil.
