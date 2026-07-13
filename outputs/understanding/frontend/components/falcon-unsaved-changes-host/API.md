# falcon-unsaved-changes-host — API

> This unit is a **service + a (now no-op) host**, so per SWEEP-SPEC §1 the API doc covers the **SERVICE method surface** first and the host element second.

## Selectors

- Injectable: `FalconUnsavedChangesService` (`@Injectable({ providedIn: 'root' })`)
- Angular host: `falcon-unsaved-changes-host`
- Stencil: _None_

## Import

```ts
import {
  FalconUnsavedChangesService,
  FalconUnsavedChangesHostComponent,
  type FalconUnsavedChangesOptions,
} from '@falcon/ui-core/angular';
```

`[CODE]` `angular-wrapper/index.ts:53-55` re-exports the barrel. Inject the SERVICE anywhere; mount the host once in the shell (no-op).

## `FalconUnsavedChangesService` — method surface

`[CODE]` `falcon-unsaved-changes.service.ts:29-100`:

| Member | Signature | Behavior |
|---|---|---|
| `confirm` | `confirm(options?: FalconUnsavedChangesOptions): Observable<boolean>` | `[CODE]` :43-90 — opens the leave-confirmation. Returns a **cold Observable that emits exactly once** then completes: `true` = discard & leave; `false` = stay / cancel / backdrop / Esc. Phase 5: calls `orchestrator.show({ category:'action-required', title, message, source:'falcon-unsaved-changes', actionLabel, actionCallback:()=>resolve(true), cancelCallback:()=>resolve(false), correlationId })`. **Sequential:** a NEW `confirm()` while one is in-flight resolves the previous as `false` first (:46-50). On unsubscribe before settle, `dismissByCorrelationId` retracts + resolves `false` (:83-88). |
| `accept` | `accept(): void` | `[CODE]` :93-95 — courtesy shim: settles the active resolver with `true` (for pre-Phase-5 callers / the no-op host's `(confirm)`). |
| `reject` | `reject(): void` | `[CODE]` :97-99 — settles the active resolver with `false` (host's `(cancel)`). |
| `active` | `Signal<FalconUnsavedChangesOptions \| null>` | `[CODE]` :37-38 — legacy slot, **always `null` in Phase 5** (the no-op host reads it). |

### `FalconUnsavedChangesOptions`

`[CODE]` `falcon-unsaved-changes.service.ts:21-27`:

```ts
export interface FalconUnsavedChangesOptions {
  readonly titleOverride?: string;        // → orchestrator title (default 'You have unsaved changes')
  readonly bodyOverride?: string;         // → orchestrator message (default "You've edited fields…")
  readonly hintOverride?: string;         // ⚠ SILENTLY DROPPED in Phase 5 — orchestrator has no hint field (G-HINT-DROP)
  readonly confirmLabelOverride?: string; // → actionLabel (default 'Discard & leave')
  readonly cancelLabelOverride?: string;  // ⚠ NOT mapped — orchestrator action-required modal has no cancelLabel input; cancel button label comes from the modal-adapter default
}
```

> `[CODE]` All overrides are **pre-translated strings** (the file notes `@falcon/ui-core` has no `TranslateService` dep; callers pass translated copy). Defaults are hardcoded English (GAP G-I18N). `hintOverride` and `cancelLabelOverride` have NO orchestrator destination in Phase 5 (the pre-Phase-5 `<falcon-angular-popup variant="unsaved">` consumed both) — GAP G-HINT-DROP.

## `<falcon-unsaved-changes-host>` — inputs / outputs

`[CODE]` `falcon-unsaved-changes-host.component.ts:23-57` — the host has **no `@Input`s**. It reads `active = this.service.active` (always null) and, IF it ever fired, would render `<falcon-angular-popup variant="unsaved">` bound to the active request, wiring `(confirm)="service.accept()"` + `(cancel)="service.reject()"`. `@HostBinding('class.falcon-unsaved-changes-host')` (:44).

## Outputs

- Service: none (it returns an Observable from `confirm()`).
- Host: none on the host element itself.

## TypeScript types

- `FalconUnsavedChangesOptions` (above).
- `confirm()` returns `Observable<boolean>`.

## Reflected props / mutable props

**N/A** — pure Angular service + host; no Stencil props.

## CVA / ngModel / Reactive Forms

**N/A.** Not a form control. The dirty-state tracking lives in the *consumer* (e.g. `hierarchy-page-state.service.ts` computes `isAnyDirty()`); this unit only opens the confirmation when asked.

## Signal compatibility

- `[CODE]` Service holds `_active = signal<FalconUnsavedChangesOptions | null>(null)` (:37) + `active = computed(...)` (:38) — always null in Phase 5.
- `[CODE]` `confirm()` returns a cold RxJS `Observable<boolean>` (NOT a signal) — consumers `.pipe(takeUntilDestroyed(...)).subscribe(leave => ...)`.
- The orchestrator it forwards to is signal-native; the modal-adapter binds `orchestrator.activeModal()`.

## Methods

- Service: `confirm` / `accept` / `reject` (above).
- Host: `onConfirm()` → `service.accept()`, `onCancel()` → `service.reject()` (protected; never invoked since the host never renders).

## Slots / ng-content

**None.** The host's inline template is a single `@if (active())` → `<falcon-angular-popup>` (no projection surface).

## Sizes / states / variants / appearances

N/A on this unit. The (never-rendered) popup is fixed `variant="unsaved"`. The live orchestrator modal-adapter renders the action-required modal.

## Constraints

- `[CODE]` `confirm()` emits **exactly once** then completes — treat it as a one-shot.
- `[CODE]` **Sequential** — overlapping `confirm()` calls resolve the earlier one as `false`. Do not fan out two leave-gates simultaneously.
- `[CODE]` **`hintOverride` is dropped** + `cancelLabelOverride` is not mapped — do not rely on them in Phase 5.
- `[CODE]` **The host renders nothing** — do not mount it expecting a popup; the orchestrator's modal-adapter renders it.
- `[CODE]` Overrides must be **pre-translated** — no i18n hook.

## Accessibility

Inherited from the orchestrator's modal-adapter, which renders the action-required popup (`<falcon-angular-popup>`: `role="dialog"` + `aria-modal`, native-`<dialog>` Top-Layer focus containment, ESC/backdrop dismiss → `cancelCallback`). The no-op host contributes nothing.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18) against `falcon-unsaved-changes.service.ts` (100 ln) + `falcon-unsaved-changes-host.component.ts` (57 ln). `confirm()` once-emit + sequential-cancel + unsubscribe-teardown + the dropped `hintOverride`/`cancelLabelOverride` all confirmed in source. Successor mapping cross-checked against `falcon-message-orchestrator.types.ts` (`actionLabel`/`actionCallback`/`cancelCallback`/`hideCancel`; no `hint`/`cancelLabel`).
