---
type: architecture-rules
audit-source: State and Signals
rule-count: 9
created: 2026-05-15
---
*** Architecture Rule Set — State and Signals ***
*** SoT: Brain Outputs/understanding/frontend/architecture/STATE_AND_SIGNAL_PATTERNS.md ***
*** Indexed 2026-05-15 by Brain SK Phase 3F ***

# State and Signals

> Page-scoped feature state lives in a signal-backed service registered via `providers: [HierarchyPageStateService]` at the host component — NEVER `providedIn: 'root'` for page state. Uses `signal()` + `computed()` + `effect()` + `inject()` + `DestroyRef` + `takeUntilDestroyed()` everywhere. OnPush nuance: methods drive class strings, NOT `computed()`, because `@Input` props don't track as signal deps.

## Source-of-truth file
- [STATE_AND_SIGNAL_PATTERNS](../../outputs/understanding/frontend/architecture/STATE_AND_SIGNAL_PATTERNS.md)

## Key rules extracted

| Rule id | Rule (one-line) | Severity | Cited file/line |
|---|---|---|---|
| AR-state-01 | Page-scoped feature state services MUST use `@Injectable()` with NO `providedIn` argument — consumer registers in `providers: [...]` of host component. Each component instance gets its own state. | high | `hierarchy-page-state.service.ts` |
| AR-state-02 | All DI MUST use `inject()` at field-initializer scope — NOT constructor injection. Even HTTP interceptors use `inject()`. | high | `request-interceptor.ts` |
| AR-state-03 | Optional facade injection pattern: `inject<FalconNotifierFacade \| null>(FALCON_NOTIFIER, { optional: true })` — works in both host (concrete) and remote-standalone (mock fallback) modes. | high | `hierarchy-page-state.service.ts` |
| AR-state-04 | All subscriptions MUST use `DestroyRef` + `takeUntilDestroyed()` — replaces classic `Subject<void>` + `takeUntil()` pattern. Zoneless requires functional cleanup. | high | observed |
| AR-state-05 | `signal()` drives flags + entity state. `computed()` derives view models (memoised). `effect()` wires side-effects auto-cleaned by `DestroyRef`. | high | observed |
| AR-state-06 | Signal getters in templates MUST be invoked as functions: `{{ count() }}` NOT `{{ count }}` — triggers OnPush CD reads correctly. | high | template convention |
| AR-state-07 | Class strings driven by `@Input` props MUST use METHODS, not `computed()` — methods re-run on every CD cycle (OnPush triggers on `@Input` ref change), `computed()` only tracks signal deps. | high | `falcon-input.component.ts:106-108` explicit comment |
| AR-state-08 | Cross-app singleton state (AuthService, SessionProvider, TranslateService, FalconMessageService) MUST use classic `@Injectable({ providedIn: 'root' })`. | high | observed |
| AR-state-09 | Cross-shell state MUST be promoted to a `@falcon/sdk` facade with `provideFalconFacades({...})` in host + `provideFalconFallbackFacades()` in remote. | high | facade contract |
| AR-state-10 | Every Falcon Angular wrapper sampled uses `ChangeDetectionStrategy.OnPush` — required by zoneless. New components MUST do the same. | high | observed |

## When to use what

| Need | Use |
|---|---|
| Cross-app singleton state | `@Injectable({ providedIn: 'root' })` |
| Page-scoped view state, OnPush components | Signal-state service registered in `providers: []` |
| HTTP-only data fetch | Stateless HTTP service in `services/services.ts` |
| Form state | `FormGroup` + `toSignal()` on form value changes |
| Cross-feature state | Promote to `@falcon/sdk` facade |
| Cross-shell state | `@falcon/sdk` facade with `provideFalconFacades()` |

## Forbidden patterns
- `@Injectable({ providedIn: 'root' })` for page-scoped state services (causes shared state across instances).
- Constructor injection in new code (use `inject()`).
- `Subject<void>` + `takeUntil()` unsubscribe pattern (use `takeUntilDestroyed()`).
- `computed()` for outputs driven by `@Input` props (use methods instead — see AR-state-07).
- Bare signal getters in templates (`{{ count }}` instead of `{{ count() }}`).
- Manual `subscribe(...)` without `takeUntilDestroyed(destroyRef)`.

## Recommended template

```ts
@Injectable() // NO providedIn
export class MyFeaturePageStateService {
  private readonly api = inject(MyFeatureService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notifier = inject<FalconNotifierFacade | null>(
    FALCON_NOTIFIER, { optional: true }
  );

  readonly selectedId = signal<string | null>(null);
  readonly drawerOpen = signal(false);
  readonly selectedItem = computed(() => this.items().find(x => x.id === this.selectedId()));

  constructor() {
    effect(() => { /* side-effects */ });
  }

  openDrawer(id: string) { this.selectedId.set(id); this.drawerOpen.set(true); }
  closeDrawer() { this.drawerOpen.set(false); }
}

@Component({
  selector: 'my-feature',
  providers: [MyFeaturePageStateService],  // PAGE-SCOPED
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFeatureComponent {
  protected readonly state = inject(MyFeaturePageStateService);
}
```

## Angular signal APIs status
- `signal()` / `computed()` / `effect()` — used everywhere.
- `toObservable(signal)` — used in `hierarchy-page-state.service.ts`.
- `toSignal(observable$)` — used to bind facade Observables into templates.
- `linkedSignal()` — NOT observed (codebase pre-dates Angular 19/20 API).
- `resource()` — NOT observed (uses RxJS `switchMap` + `toObservable` instead).

## Related component notes
- [[Falcon Input]] — see explicit `falcon-input.component.ts:106-108` comment on methods-vs-computed.
- [[Falcon Drawer]] · [[Falcon Data Table]] — typical consumers of page-scoped state.

## Tags

#type/architecture-rules

## Hubs
- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
