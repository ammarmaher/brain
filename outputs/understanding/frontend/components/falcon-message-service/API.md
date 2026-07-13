# falcon-message-service — API

> This unit is a **service + a (now no-op) host**, so per SWEEP-SPEC §1 the API doc covers the **SERVICE method surface** first and the host element second.

## Selectors

- Injectable: `FalconMessageService` (`@Injectable({ providedIn: 'root' })`)
- Angular host: `falcon-angular-message-host`
- Stencil: _None_

## Import

```ts
import {
  FalconMessageService,
  FalconAngularMessageHostComponent,
  type FalconMessage,
} from '@falcon/ui-core/angular';
```

> `[CODE]` `angular-wrapper/index.ts:41` re-exports the whole `falcon-message-service` barrel. **Naming trap:** the orchestrator's own `FalconMessage` type is re-exported as `FalconOrchestratorMessage` (`:89-97`) precisely so it does NOT collide with this shim's `FalconMessage`. Make sure you import the right one.

## `FalconMessageService` — method surface

`[CODE]` `falcon-message-service.ts:63-104`:

| Member | Signature | Phase-5 behavior |
|---|---|---|
| `add` | `add(message: FalconMessage \| FalconMessage[]): void` | `[CODE]` :75-87 — for each message: increments `__idSeq`, calls `orchestrator.show({ category: severityToCategory(severity), title: summary ?? '', message: detail ?? '', source: 'falcon-message-service-shim', correlationId: id ?? 'falcon-msg|{seq}' })`. **`messages$` is intentionally NOT updated.** |
| `addAll` | `addAll(messages: FalconMessage[]): void` | `[CODE]` :90-92 — alias for `add`. |
| `remove` | `remove(id: string): void` | `[CODE]` :96-98 — maps to `orchestrator.dismissByCorrelationId(id)`. |
| `clear` | `clear(): void` | `[CODE]` :101-103 — maps to `orchestrator.clearAll()` (clears every channel + dedupe ledger). |
| `messages$` | `Observable<FalconMessage[]>` | `[CODE]` :68-69 — `BehaviorSubject<FalconMessage[]>([])`.asObservable(). **ALWAYS emits `[]`** in Phase 5 (orchestrator owns the queue). Kept only so the no-op host compiles. |

### Severity → orchestrator category mapping

`[CODE]` `falcon-message-service.ts:51-61` `severityToCategory()`:

| `FalconMessage.severity` | Orchestrator `category` | Renders as |
|---|---|---|
| `'success'` | `'success'` | toast (priority 300, latestOnly) |
| `'info'` | `'info'` | toast (priority 400) |
| `'warn'` / `'warning'` | `'warning'` | toast (priority 500) |
| `'error'` | `'business-error'` | toast (priority 700) |
| anything else / `undefined` | `'info'` | toast (priority 400) |

> `[CODE]` Note the asymmetry vs the OLD dossier: the shim NEVER produces a `validation-error`, `configuration-required`, or `action-required` category — those are reachable only by calling the orchestrator directly. So a `FalconMessageService.add()` can only ever produce a **toast**, never a blocking modal.

## `FalconMessage` (shim type)

`[CODE]` `falcon-message-service.ts:32-47`:

```ts
export interface FalconMessage {
  id?: string;                              // → correlationId; auto 'falcon-msg|{seq}' when omitted
  severity?: FalconToastSeverity | 'warn';  // mapped via severityToCategory()
  summary?: string;                         // → orchestrator title
  detail?: string;                          // → orchestrator message
  life?: number;                            // ⚠ IGNORED in Phase 5 (orchestrator owns timing)
  closable?: boolean;                       // ⚠ IGNORED in Phase 5 (adapter always renders ×)
  icon?: string;                            // ⚠ IGNORED in Phase 5 (intent-driven icons)
}
```

> `[CODE]` :38-46 — the `life` / `closable` / `icon` JSDoc each says "Ignored in Phase 5". A PrimeNG-migrated caller setting `life:0` for a sticky toast will instead get the orchestrator's configured `dismissDurationSec`. **GAP G-DROP** (FINDINGS).

## `<falcon-angular-message-host>` — inputs

`[CODE]` `falcon-message-host.component.ts:30-31`:

| Name | Type | Default | Notes |
|---|---|---|---|
| `position` | `FalconToastHostPosition` | `'top-right'` | Forwarded to the inner `<falcon-angular-toast-host>` — but the host renders nothing (no messages ever arrive). |
| `useTailwind` | `boolean` | `true` | Forwarded to inner toast + toast-host — inert. |

`[CODE]` `@HostBinding('class.falcon-angular-message-host')` (:33).

## Outputs

**None** on the host or service. Each (never-rendered) `<falcon-angular-toast>` would emit `(falconDismiss)` → `service.remove(id)` (`[CODE]` html:17, ts:50-53).

## TypeScript types

- Shim: `FalconMessage` (above), `FalconToastSeverity` (re-exported from `falcon-toast.types`).
- Successor (for reference): `FalconMessageCategory` (7-value union), `FalconMessageRequest`, `FalconMessage` (orchestrator shape) — see `INTEGRATION_VALIDATION.md`.

## Reflected props / mutable props

N/A — pure Angular service + host; no Stencil props.

## CVA / ngModel / Reactive Forms

**N/A.** Not a form control.

## Signal compatibility

- `[CODE]` Host holds `messages = signal<FalconMessage[]>([])` (:38) — never populated in Phase 5.
- `[CODE]` Host subscribes `service.messages$` in `ngOnInit` with `takeUntilDestroyed(this.destroyRef)` (:45-47). **This is the `NG0203` trap the old dossier flagged — still real if anyone re-implements the subscription, but moot here since the stream is dead.**
- The successor `FalconMessageOrchestratorService` is signal-native (`activeModal` / `activeToast` are read-only `Signal`s).

## Methods

- Service: `add` / `addAll` / `remove` / `clear` (above).
- Host: `onDismiss(id)` (protected), `trackById` (protected).

## Slots / ng-content

**None.** The host composes `<falcon-angular-toast-host>` + a `@for` of `<falcon-angular-toast>` internally (`[CODE]` html:5-20) — no projection surface.

## Sizes / states / variants / appearances

N/A — driven entirely by the orchestrator's toast-adapter when the orchestrator fires.

## Constraints

- `[CODE]` `FalconMessageService.add()` can ONLY produce a toast (never a modal) — `severityToCategory` maps to toast-presentation categories only.
- `[CODE]` `life` / `closable` / `icon` are dropped — do not rely on them.
- `[CODE]` `messages$` is dead — do not subscribe.
- `[CODE]` The service is `providedIn:'root'` — re-providing it in `app.config.ts:139` is redundant (harmless).

## Accessibility

Inherited from the orchestrator's toast-adapter notification card (per-intent `role="alert"`/`role="status"` + `aria-live`). The dead host contributes nothing.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18) against `falcon-message-service.ts` (104 ln) + `falcon-message-host.component.{ts,html}`. Mapping table + dropped-fields + dead `messages$` confirmed in source. Successor type names cross-checked against `falcon-message-orchestrator.types.ts`.
