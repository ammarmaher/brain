# falcon-message-host — GAPS AND UPGRADES

## Missing capabilities

### P1 — No `maxStack` / `maxToasts` cap
The service has no upper bound on simultaneous messages. A flaky API that fires 100 error toasts overwhelms the viewport.

**Proposed:**
- Service `add()` checks against a configurable `maxStack` (e.g. 5) and silently drops older messages OR rejects new ones.
- Host `[maxStack]` input.

**Priority: P1**

### P1 — No deduplication
Identical messages fired in quick succession render multiple times. PrimeNG had a `key` prop on toasts to enable dedup; not implemented here.

**Proposed:** `key` field on `FalconMessage` + service `add()` deduplicates by key.

**Priority: P1**

### P1 — No `useTailwind` parity between host and inner toast-host
The Angular host's template hardcodes `[useTailwind]="useTailwind"` for the inner toast-host AND each toast. But the host has its OWN `useTailwind` input. If a consumer sets `useTailwind=false` on the host, all inner elements switch. Fine — but worth documenting.

**Priority: P1** — docs.

### P2 — No icon configuration
`FalconMessage.icon` is supported but limited to CSS class string. Should use `<falcon-angular-icon>` underneath.

**Priority: P2**

### P2 — No action button passthrough
The toast supports `actionLabel` / `actionHref`; the `FalconMessage` type doesn't include these fields, so the message-host can't emit toasts with actions via the service.

**Proposed:** extend `FalconMessage` with `actionLabel?`, `actionHref?`, `onAction?: (id: string) => void`.

**Priority: P2**

### P2 — Service throws no validation errors
Calling `add({})` (empty object) creates an empty toast. Should validate `summary` or `detail` is present.

**Priority: P2** — defensive.

### P3 — No persistence across route navigation
Toasts cleared / kept on route change is consumer-managed today. A `keepAcrossRoutes: true` per message would standardise.

**Priority: P3**

### P3 — No grouping by severity
For 5 simultaneous error toasts, no grouping ("3 errors collapsed").

**Priority: P3**

## Missing ng-template / template slots
- No per-message template override.
- No host header / footer slots.

## Missing flags / options / states
- `maxStack` / `maxToasts` cap.
- Dedup by `key`.
- Action button.
- Grouping.
- Per-route persistence.

## Missing accessibility features
- Inherits from toast (which has `aria-live` per severity).
- Stack as a whole has no `aria-live="polite"` wrapper — toasts are siblings with no parent landmark.

## Missing tests
- No `.spec.ts`.
- No test for `severity: 'warn'` → `'warning'` mapping.
- No test for service singleton behavior.

## Missing Tailwind / token parity
N/A — composes existing components.

## Performance risks
- BehaviorSubject emits on every `add()` / `remove()` / `clear()`. The host signal updates trigger re-render. Fine for typical counts.
- The `messages$.pipe(takeUntilDestroyed(this.destroyRef))` is correct cleanup pattern.

## Visual / interaction risks
- Without `maxStack`, viewport floods.
- `severity: 'warn'` works (mapped to 'warning') but consumers might also pass other unknown severities — typed by `FalconToastSeverity | 'warn'`. Anything else falls back to `'info'` (line 60 of service).

## Reusable upgrades needed
1. **`maxStack` cap** (P1).
2. **Dedup by key** (P1).
3. **Action button support** in FalconMessage (P2).
4. **Validation in `add()`** (P2).
5. **Migration adapter** from `FalconMessageService` to `FalconNotificationService` (long-term).

## Priority: page-level vs shared
All shared.

## Recommended upgrade API (proposed)

```ts
// Service additions
add(message: FalconMessage | FalconMessage[]): void;

// FalconMessage additions
export interface FalconMessage {
  id?: string;
  key?: string;                      // new — dedup key
  severity?: FalconToastSeverity | 'warn';
  summary?: string;
  detail?: string;
  life?: number;
  closable?: boolean;
  icon?: string;
  iconName?: string;                  // new — falcon-angular-icon
  actionLabel?: string;               // new
  actionHref?: string;                // new
  onAction?: (id: string) => void;    // new
}

// Service config
@Injectable({ providedIn: 'root' })
export class FalconMessageService {
  configure(opts: { maxStack?: number; dedup?: boolean }): void;
}

// Host additions
@Component({ selector: 'falcon-angular-message-host', ... })
export class FalconAngularMessageHostComponent {
  @Input() position: FalconToastHostPosition = 'top-right';
  @Input() maxStack?: number;        // new
  @Input() dedup = false;             // new
  @Input() useTailwind = true;
}
```

## Future-proof recommendation
**Build a migration adapter from `FalconMessageService` to `FalconNotificationService`.** Once notification has feature parity (action button, hover-pause), an adapter lets consumers switch the rendering engine without code changes:

```ts
@Injectable({ providedIn: 'root' })
export class FalconMessageService {
  // Existing PrimeNG-compat API
  add(msg: FalconMessage): void {
    // forwards to FalconNotificationService.push() internally
    this.notif.push({ intent: msg.severity ?? 'info', title: msg.summary ?? '', subtitle: msg.detail });
  }
}
```

This would let the toast component fully retire while preserving the consumer API.
