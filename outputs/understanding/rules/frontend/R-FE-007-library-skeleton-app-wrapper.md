---
ruleId: R-FE-007
name: Library skeleton + app wrapper — no service injection in libs
category: architecture
scope:
  apps:
    - host-shell
    - admin-console
    - management-console
  paths:
    - "libs/falcon-ui-core/**/*.ts"
    - "libs/falcon/**/*.ts"
    - "apps/host-shell/src/app/shared-components/**/*.ts"
  exemptPaths:
    - "libs/falcon/src/shared-data-access/**"
    - "**/*.spec.ts"
severity: must
detector:
  type: ast
  patterns:
    - 'Angular @Component class inside libs/falcon-ui-core/** whose constructor or class body calls inject(<T>) where <T> resolves to a class with HttpClient in its dependency tree'
    - 'Angular @Component class inside libs/falcon-ui-core/** with a constructor parameter typed as HttpClient'
    - 'App-level component using <falcon-*> AND injecting an HTTP service for the same flow, instead of delegating to a wrapper in apps/host-shell/src/app/shared-components/**'
  exemptPatterns:
    - 'libs/falcon/src/shared-data-access/**'
    - 'pure utility services (SimplePollService, HttpService, formatters, validators)'
  description: AST detector — flags any Angular @Component inside libs/falcon-ui-core that injects an HTTP-talking service, and flags app components that inject domain HTTP services AND consume a library skeleton directly when a wrapper should mediate. Grandfathered pre-Wave-16 HTTP services in libs/falcon/src/shared-data-access/ are exempt.
autoFix:
  available: false
  riskLevel: high
  patchHint: 'For library violations: remove the inject() call, replace with @Input/@Output surface, author a wrapper in apps/host-shell/src/app/shared-components/<verb-noun>-popup/. For app violations: extract the orchestration into a new wrapper, expose [trigger] + (succeeded)/(failed), consume from the page.'
relatedRules:
  - R-FE-005
  - R-FE-006
source:
  - file: feedback_library_skeleton_app_api.md
    location: memory
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-FE-007 — Library = Skeleton, App = API ***
*** Source: feedback_library_skeleton_app_api (2026-05-15 Wave 16) ***
*** Detector: AST (Angular @Component + inject() shape) ***

# R-FE-007 — Library skeleton + app wrapper — no service injection in lib code

## What it says

Every Falcon component lives in exactly one of two layers:

1. **Library skeleton** in `libs/falcon-ui-core/` — pure presentational. Receives data via `@Input` / `@Prop`, emits events via `@Output`. **MUST NOT** inject any service that makes HTTP calls or subscribes to backend streams.
2. **App-level wrapper** in `apps/host-shell/src/app/shared-components/<verb-noun>-popup/` — uses the library skeleton **as a tag** in its template. This is the **only** layer where backend / domain services get injected. Owns the API orchestration (HTTP, polling, retries, state-machine). Exposes a clean `[trigger]` + `(succeeded)` / `(failed)` surface.

Consumer apps import wrappers via `@host-shell/shared/*` TS path alias. They never inject the domain HTTP services directly for these flows.

## Why it exists

- **Testability / theme-ability / reuse** — the skeleton renders in any context (showcase, generic non-commerce reuse) with mock data.
- **Bundle hygiene** — library code doesn't ship HTTP plumbing that consumers may not need.
- **Cross-app reuse** — admin-console and mgmt-console consume the wrapper from host-shell. The wrapper lives once and is consumed many times.
- Locked by user on 2026-05-15 (Wave 16) after the insufficient-balance-dialog rebuild surfaced the seam.

## Detector strategy

AST analysis on TypeScript files:

1. Parse every `*.ts` under `libs/falcon-ui-core/**`. For each Angular `@Component` class:
   - Walk constructor parameters and class-body `inject(<T>)` calls.
   - Resolve each `<T>` through the workspace `tsconfig.base.json` paths.
   - If `<T>` is a class that itself injects `HttpClient` (or extends `HttpService` / similar low-level HTTP wrapper), flag it.
   - Exception: pure utility services (`SimplePollService`, `HttpService` itself as low-level infrastructure, formatters, validators) are exempt — they don't call domain APIs.
2. Parse every page-level `*.component.ts` under `apps/**`. For each component that:
   - Has `<falcon-*>` (skeleton) tags in its template, AND
   - Injects a domain HTTP service (one that imports/uses `HttpClient` and hits a `/api/` endpoint), AND
   - The flow has an existing wrapper in `apps/host-shell/src/app/shared-components/**`,
   → flag as "should consume the wrapper, not re-orchestrate".
3. Grandfathered services in `libs/falcon/src/shared-data-access/` (`CommChannelPaymentService`, `OrderStatusService`, `AccountValidationService`, `LookupService`) are exempt — they pre-date the rule.

## Examples

### ✅ Good (library skeleton)

```ts
// libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/...
@Component({
  selector: 'falcon-angular-insufficient-balance-dialog',
  templateUrl: './insufficient-balance-dialog.component.html',
})
export class InsufficientBalanceDialogComponent {
  @Input() items: { id: string; label: string }[] = [];
  @Output('falcon-proceed') proceed = new EventEmitter<{ orderedIds: string[] }>();
  // No service injection. Pure presentation.
}
```

### ✅ Good (app-level wrapper)

```ts
// apps/host-shell/src/app/shared-components/do-payment-priority-popup/...
@Component({
  selector: 'app-do-payment-priority-popup',
  templateUrl: './do-payment-priority-popup.component.html',
})
export class DoPaymentPriorityPopupComponent {
  private payment = inject(CommChannelPaymentService);
  private orderStatus = inject(OrderStatusService);
  private poll = inject(SimplePollService);

  @Input() trigger!: Signal<TriggerPayload | null>;
  @Output() succeeded = new EventEmitter<Result>();
  @Output() failed = new EventEmitter<Failure>();
  // Owns doPayment → poll → reorder → resubmit flow.
}
```

### ✅ Good (consumer page)

```html
<!-- apps/admin-console/.../applications-table.component.html -->
<app-do-payment-priority-popup
  [trigger]="ibTrigger()"
  (succeeded)="onIbSucceeded($event)"
  (failed)="onIbFailed($event)"
/>
```

### ❌ Bad (library injecting HTTP)

```ts
// libs/falcon-ui-core/src/components/falcon-something/...
@Component({ selector: 'falcon-angular-something', ... })
export class SomethingComponent {
  private api = inject(SomethingApiService); // ❌ library injects HTTP service
  // ...
}
```

### ❌ Bad (page bypassing wrapper)

```ts
// apps/admin-console/.../applications-table.component.ts
export class ApplicationsTableComponent {
  private payment = inject(CommChannelPaymentService);   // ❌
  private orderStatus = inject(OrderStatusService);      // ❌
  // re-implements the same orchestration the wrapper already owns
}
```

```html
<!-- Then in template: -->
<falcon-angular-insufficient-balance-dialog [items]="items" (falcon-proceed)="...">
  <!-- ❌ consuming skeleton directly instead of via <app-do-payment-priority-popup> -->
</falcon-angular-insufficient-balance-dialog>
```

## Known legitimate exemptions

- `libs/falcon/src/shared-data-access/**` — pre-Wave-16 grandfathered HTTP services stay put
- Pure utility / infrastructure services that don't call domain APIs (`SimplePollService`, `HttpService` low-level wrapper, formatters, validators) — they live in libs forever
- `*.spec.ts` test fixtures
- Anything listed against `R-FE-007` in `exemptions/EXEMPTIONS.md`

## Fix recipe

**Library violation (`inject()` of HTTP service in `libs/falcon-ui-core`):**

1. Identify what data/events the component needs from the service.
2. Convert each into an `@Input` (data in) or `@Output` (event out).
3. Remove the `inject()` call.
4. Create or extend the matching wrapper in `apps/host-shell/src/app/shared-components/<verb-noun>-popup/`. Wrapper injects the service, consumes the skeleton as a tag, bridges via the new inputs/outputs.
5. Add a TS path alias entry in `tsconfig.base.json`: `"@host-shell/shared/<name>": ["./apps/host-shell/src/app/shared-components/<name>/index.ts"]`.
6. Update consumers to import the wrapper, not the skeleton.

**App violation (page injecting domain service alongside skeleton):**

1. Move the orchestration into a wrapper at `apps/host-shell/src/app/shared-components/<verb-noun>-popup/`.
2. Expose `[trigger]` + `(succeeded)` + `(failed)`.
3. Replace the page's direct skeleton use + service inject with a single `<app-<verb-noun>-popup>` tag.

Reference implementation: `<falcon-angular-insufficient-balance-dialog>` (skeleton) ↔ `<app-do-payment-priority-popup>` (wrapper). Doctrine in `Brain Outputs/strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` §6.

## Related rules

- [[R-FE-005-falcon-library-first]] — defines the library-first obligation
- [[R-FE-006-customization-order]] — step 7 of the order is the wrapper layer

## Sources of truth

1. `memory/feedback_library_skeleton_app_api.md` — absolute standing rule 2026-05-15 (Wave 16)
2. `Brain Outputs/strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` §6 — full doctrine + worked example
