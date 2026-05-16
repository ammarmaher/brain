# Rules / patterns — marketplace-applications

## Observed (good)
1. **PES via `resolveFlags({...})` bulk call** — single `await` resolves all 4 permissions, then `Object.assign(this, {...})` assigns flags. Clean, terse, no per-flag `await` chain.
2. **Defense-in-depth at action methods** — every action method (`onDoPayment`, `onEnable`, `onDisable`, `onSaveEdit`, `onEditDetail`, `onDeleteDetail`, `onVisibilityChange`) starts with `if (!this.canFlag) return;`. Good belt-and-braces pattern.
3. **Backend-controlled FSM via `row.allowedActions: FalconRowAction[]`** — UI does not encode lifecycle rules. Backend ships an array of legal actions per row; component visibility predicate just `.includes(action)`. Clean separation of concerns.
4. **`SimplePollService.watch({...})` for async order status** — pluggable polling with interval, max duration, shouldStop predicate. Cancelled via `takeUntilDestroyed(destroyRef)`.
5. **Heavy use of `<falcon-table>` features** — `column.template`, `column.render`, `column.field`, `column.width`; row-menu actions with `inlineTemplate`; details rows with `detailsTemplate` + `detailsVisible`; `detailsNotchColumn`. Genuine showcase of the Falcon Table API.
6. **Reuses `<falcon-organization-hierarchy-tree>`** (unlike contracts which rolled its own panel). Consistent tree UX.
7. **`MessageService` (PrimeNG toast) consistently used for feedback** — every mutation returns `next:` → success toast, `error:` → error toast. Standardized i18n key shape `appsServices.messages.*`.

## Observed (bad — would be flagged by the night-shift digest)
1. **`ChangeDetectionStrategy.OnPush` NOT used** — relies on Default zone-based change detection. With Angular 20+ zoneless goals, this is the wrong direction. (Sibling `contracts-cost-management` IS OnPush throughout.)
2. **`@Input()` + `@Output()` decorators throughout** — should be signal-based `input()` / `output()` under Angular v20+ idioms. (Lines 124-139 use `@ViewChild` decorator + `@Output()` not shown.)
3. **`*ngIf` and `*ngFor`** instead of `@if`/`@for` (templates show `*ngIf="!hasSelectedNode"`, `*ngFor="let c of [1,2,3,4,5,6,7]"`, etc., lines 241, 320 of HTML).
4. **PrimeNG imported directly** (`p-toast`, `p-toggleswitch`, `p-inputNumber`, `p-select`, `p-button`, `p-dialog`, `p-skeleton`) — should be `<falcon-*>` per platform memory. PrimeNG total removal program completed for the rest of the platform (per `project_falcon_primeng_total_removal_complete.md`) but this page still hard-imports it.
5. **`.scss` file present (276 lines)** — violates "Tailwind utilities only — no SCSS, no component CSS" memory rule (`project_brain_skills_primeng_purge.md`). 
6. **CSS variables hardcoded** — `var(--sb-max-width)`, `var(--palette-primary-900)`, `var(--color-border)`, `var(--color-bg)` from the SCSS. No `falcon-*-*` token usage. Needs migration to the Noor naming.
7. **Component is too large (1,249 lines)** — single class managing tree state + table state + payment state + edit state + dialog state + PES state. Could be split into 3-4 components or a state service.
8. **`destroy$: Subject<void>` declared but unused** — line 192 declares `private destroy$ = new Subject<void>()`, `ngOnDestroy()` calls `destroy$.next(); destroy$.complete()`, but **no subscription chains use it** — they all use `takeUntilDestroyed(destroyRef)`. Dead code.
9. **Inline SVG (lines 244-285 of HTML, ~42 lines of `<path>`)** for the "no selection placeholder" illustration. Should be `<falcon-svg-icon>` with a named asset or a stored asset file.
10. **`as any` cast** — line 1140: `} as any);` for `confirmationService.confirm({...})` — bypasses `ConfirmationService.confirm()` type checking.
11. **String enum string-literal comparisons** for the `details.type` field — `detailItem['type'] === 'priceType'`. Could be a proper TypeScript discriminated union.
12. **`(window as any)` access pattern** is used elsewhere — not here directly, but `runtime-config` reads `(window as any)?.[RUNTIME_CONFIG_WINDOW_KEY]`. Not a feature concern.

## Patterns worth porting
- **PES `resolveFlags({...})` bulk call** — extremely concise. Make this the standard pattern.
- **Double-gate (PES × `allowedActions`)** for row-action visibility. Backend FSM disclosure is the right approach for lifecycle.
- **Polling via `SimplePollService.watch({...})`** with explicit `intervalSeconds`, `maxDurationMinutes`, `shouldStop` predicate.
- **`OrderFailureReason` → specific UX dispatch** — clean switch on `failureReason` mapping to specific dialogs / messages.
- **`hasShownPaymentSuccess` deduplication flag** — explicit one-time-toast pattern for polling completions.
- **`notShowToaster: 'true'` header** — opt-out of global error toast. Clean per-call control.
- **`MessageService` toast wrapping** — every mutation says success or error. Always.

## Anti-patterns to NOT port to new theme
- **OnPush + signals required.** This component is the lone holdout using Default change detection.
- **Move SCSS to Tailwind utilities + falcon-* tokens.** No `:host`-scoped CSS variables — use design tokens.
- **Drop PrimeNG.** Replace `p-toast`, `p-toggleswitch`, `p-inputNumber`, `p-select`, `p-button`, `p-dialog`, `p-skeleton` with `<falcon-*>` equivalents.
- **Split the component** into:
  - `MarketplaceApplicationsPageComponent` — tree + table layout
  - `ApplicationsTableComponent` — falcon-table wrapper for AppServiceItem
  - `PaymentFlowService` — orchestrates do-payment + polling + dialog dispatch
  - PES flags injected via a `MarketplaceAccessService`
- **Replace `Set<string>` debouncing fields** (`visibilitySavingIds`, `loadingChildrenIds`, `loadedChildrenIds`) with explicit observables or signal-based state machines.
- **Remove dead `destroy$: Subject<void>`** and use only `takeUntilDestroyed(destroyRef)`.

## Architecture compliance against `Brain Outputs` / wiki rules
- ✅ Clean architecture: model→service→component direction held (except for the cross-feature reach into `organization-hierarchy/.../service/` — see [[07-CROSS-PAGE]]).
- ✅ `ServiceOperationResult<T>` envelope used (though list endpoint inconsistently unwraps).
- ✅ JWT Bearer via interceptor.
- ❌ Standard requirement: "Tailwind utilities only — no SCSS, no component CSS, no PrimeNG" — **this page violates all three.**
- ⚠️ FalconAccess registry has `services.payment/editPriceType/editPriceValue/visibility` but **lacks `services.view`** — no route-level enforcement possible.

## Total patterns observed: 7 good, 12 anti-patterns, 7 worth porting.
