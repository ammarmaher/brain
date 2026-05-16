# Rules / patterns — testing-charging

## Observed (good)

### 1. Standalone components — applied

[CODE] The single component is correctly standalone:
```typescript
@Component({
  selector: 'app-testing-charging',
  standalone: true,
  imports: [CommonModule, FormsModule],
  ...
})
```
Source: `testing-charging.component.ts:25-31`.

### 2. `providedIn: 'root'` singleton service — applied

[CODE] `@Injectable({ providedIn: 'root' })` (`testing-charging-api.service.ts:18`). The service is tree-shakeable and DI-resolved.

### 3. `inject()` function over constructor injection — applied

[CODE] Both component and service use `private readonly api = inject(TestingChargingApiService)` / `private readonly http = inject(HttpClient)` — no constructor parameters anywhere.

### 4. Platform-standard `ServiceOperationResult<T>` envelope — applied

[CODE] Every endpoint typed as `Observable<ServiceOperationResult<T>>` and unwrapped via a shared helper — matches the cross-service platform standard from `CLAUDE.md` and `falcon-wiki` (`testing-charging-api.service.ts:107-109`).

### 5. `forkJoin` for parallel fan-out — applied

[CODE] Six detail endpoints fired simultaneously rather than serially — minimizes refresh latency (`testing-charging.component.ts:202-209`).

### 6. `encodeURIComponent` on path params — applied

[CODE] Every `accountId` and `runId` interpolation wraps the value (`testing-charging-api.service.ts:37, 44, 52, 60, 68, 88, 101`) — defensive against ids containing special characters.

### 7. trackBy on `*ngFor` — applied (partial)

[CODE] `trackByAccount`, `trackByWallet`, `trackByBucket` used on the three biggest collections (`:403-413`). However, reservations / ledger / runs / messages tables use `*ngFor` without `trackBy` (`testing-charging.component.html:177, 209, 246, 270`) — partial coverage.

### 8. Local code comments explaining nontrivial logic — applied

[CODE] Strong inline comments at `:287-290`, `:301-303`, `:356-358`, `:264-266` explaining wallet-channel resolution, simulator defaulting, and the deliberate lightweight-summary-vs-detail-document split for runs. Reads like a deliberately well-documented internal tool.

## Observed (bad — would be flagged by the night-shift digest)

### 1. Legacy structural directives (`*ngIf` / `*ngFor`) instead of `@if` / `@for` — present

[CODE] Used throughout the template — e.g. `*ngIf="error"` (`:53`), `*ngFor="let account of walletStrategyAccounts; trackBy: trackByAccount"` (`:23`), `*ngIf="activeTab === 'overview' && overview"` (`:66`), 20+ occurrences total. The new control-flow syntax `@if` / `@for` (Angular v17+ stable, v20+ idiomatic) is not used.

### 2. Class-field reactive state instead of signals — present

[CODE] Every state field is a plain class property — `accounts: TestingChargingAccount[] = []`, `selectedAccount?: TestingChargingAccount`, `overview?: TestingChargingOverview`, etc. (`testing-charging.component.ts:35-68`). No `signal()`, `computed()`, or `linkedSignal()` usage; no signal-based state store. Would be flagged by the Angular-v20 idiomatic-state digest.

### 3. `[(ngModel)]` on a non-form-grouped template — present

[CODE] All 11 simulator inputs use template-driven two-way binding without a wrapping `<form>` element or `ngForm`/`FormGroup`. There is also no `Validators` API usage. Reactive forms with `FormBuilder.group(...)` would be the canonical pattern.

### 4. Component-scoped SCSS (320 lines) — present

[CODE] `testing-charging.component.scss` with hand-rolled palette and hardcoded color literals (`#173d35`, `#2d6f5d`, `#fffdf8`, `#9d4c2f`, `#6c4b00`, `#8a2f1f`, etc.). No design tokens, no Tailwind utilities, no Falcon UI Core components. Brain skill `noor-instructions` + `feedback_no_inline_styles_tokens_only` would flag the entire SCSS file.

### 5. Zero use of Falcon UI Core (`<falcon-*>`) — present

[CODE] No `<falcon-button>`, no `<falcon-table>`, no `<falcon-input>`, no `<falcon-tabs>`, no `<falcon-dropdown>`. Every UI primitive is raw HTML — `<button>`, `<input>`, `<select>`, `<table>`. Brain skill `feedback_falcon_custom_library_mandatory` would flag this as the **first** rule violation: "Falcon library FIRST".

### 6. Mutated DTO `expanded` field on UI interaction — present

[CODE] `testing-charging.component.html:99`: `(click)="wallet.expanded = !wallet.expanded"` writes a UI-only `expanded?: boolean` field onto the server-shaped wallet DTO (declared as part of the interface at `testing-charging.models.ts:67`). This conflates server schema with view state — a separate `WalletViewState` map keyed by `walletId` would be cleaner.

### 7. String-typed enums (`priority`, `deliveryMode`, `destination`) — present

[CODE] `priority: string`, `deliveryMode: string`, `destination: string` on the request DTO (`testing-charging.models.ts:187-202`) rather than discriminated unions. Valid values are scattered between the static option lists in the component (`:81-100`) and hard-coded `<option>` tags in the template (`:333-337`) — no central enum.

### 8. Hardcoded font family literals — present

[CODE] `font-family: Georgia, 'Times New Roman', serif;` (`testing-charging.component.scss:53`) — bypasses the design system's font tokens entirely (Poppins / Inter / IBM Plex per `feedback_v02_theme_adopted`).

### 9. `radial-gradient`/`linear-gradient` background hard-baked into component — present

[CODE] `testing-charging.component.scss:7-9` paints a green→cream→blue gradient background directly on `.testing-charging-shell`. This is application-chrome behavior, not page-content — would be a layout-ownership violation under `noor-instructions`.

## Patterns worth porting

### `forkJoin` orchestration shape

The 6-endpoint refresh pattern with `finalize` cleanup is correct and idiomatic. Port verbatim; convert observables to signals or `resource()` if the new theme uses signal-driven data access.

### Inline-documented domain reasoning

The comments around WhatsApp-channel resolution (`testing-charging.component.ts:287-374`) capture **non-obvious OCS semantics** — `ALL` channel wallets, `NODE`/`USER` ownerType, bucket-derived channel id. Keep this in the rebuild — the new theme's testing surface still needs these defaulting rules.

### Composite owner-wallet key

`${ownerId}::${channelId}` (`testing-charging.component.ts:348-350`) is a sound design: dropdown values stay opaque to the user, the component decodes them on selection. Port this pattern.

### Lightweight-summary vs detail-document split for runs

The intentional decision to omit `messages[]` from the paged `getRuns` list and lazy-load via `getRun(runId)` is documented at `:264-266`. Port this — runs can have hundreds of messages and listing them all in the paged response would explode.

## Anti-patterns to NOT port to new theme

### 1. Component-scoped SCSS — replace with Tailwind utilities + Falcon UI Core components

Per `angular-tailwind-skill` and `feedback_no_inline_styles_tokens_only`, the rebuild must use **Tailwind utilities + design tokens only**. SCSS files should not appear in the new theme; the entire palette must come from the canonical `falcon.theme.css`.

### 2. Hand-painted background gradient on the component shell

Background painting is application-chrome, not feature-level. Drop the radial-/linear-gradient. Use the host-shell or app shell's surface color.

### 3. Raw HTML primitives

Replace every `<button>`, `<input>`, `<select>`, `<table>` with the corresponding Falcon UI Core component. Order per `feedback_falcon_custom_library_mandatory`: inputs → templates → slots → variants → upgrade → new lib component → wrapper → raw HTML as GAP. The testing lab should be a high-density showcase of Falcon UI components — currently it is zero-usage.

### 4. `*ngIf` / `*ngFor`

Convert to `@if` / `@for` / `@switch` — Angular v20+ idiomatic.

### 5. Template-driven `[(ngModel)]` form

Convert the 11-field simulator to a `FormGroup` with `FormBuilder` + `Validators` so that `messageCount` / `quantityPerMessage` / `parallelism` / `successRate` ranges are enforced at the Angular layer, not just the browser layer.

### 6. Class-field state without signals

Convert reactive surfaces (`accounts`, `selectedAccount`, `overview`, `wallets`, `reservations`, `ledger`, `balances`, `runs`, `selectedRun`, derived getters) to signals / computed signals. The current getter-based derived state (`walletStrategyAccounts`, `applicationOptions`, `ownerOptions`, `allBuckets`, `canCreateBatch`) re-runs on every change-detection cycle — `computed()` would give a memoized signal.

### 7. Mutating server DTOs for UI state

Move `wallet.expanded` to a `Set<string>` of expanded wallet ids on the component (or a signal map). Keep DTOs immutable from server.

### 8. String-typed enums

Define `WhatsappPriority`, `DeliveryMode`, `Destination` as proper TypeScript enums or literal unions in the models file. Drop the parallel static option lists in the component — derive `priorityOptions` from `Object.values(WhatsappPriority)`.

## Patterns count

- Good patterns observed: **8**
- Anti-patterns observed: **9**
- Patterns worth porting verbatim: **4**
- Anti-patterns to drop in rebuild: **8**
