# Rules / patterns — account-administration

## Observed (good)
- **Standalone components throughout** — every component declares `standalone: true` with explicit `imports`.
- **`inject()` over constructor DI** — every service injection uses `inject(ServiceType)` rather than constructor parameters. Modern Angular idiom.
- **`takeUntilDestroyed(DestroyRef)`** — used in container + commChannels/apps tabs + node-settings-tab for stream cleanup (replacement for manual `destroy$`).
- **Signal-based reactive state in TabsLayoutComponent** — uses `signal()`, `computed()` for `selectedNodeSig`, `tabsConfigSig`, `defaultTabsConfig`, `currentTabsConfig`, `isFalconMenuSig`, `isMainMenuSig`. Forces redraw via `forceRedrawTabs()` for stateful tab destruction.
- **ServiceOperationResult<T> wrapper handled** — every service unwraps response, throws on `!isSuccessful`. (Platform standard from CLAUDE.md.)
- **Multi-language ready** — every UI label goes through `TranslateService.translate(key)` / `TranslatePipe`.
- **PBAC batch resolution** — single `AccessControlFacade.resolveFlags({ ... })` call per component, then `Object.assign(this, result)`. Reduces round-trips vs per-key resolution.
- **PBAC-derived UI structure** — `allowedTreeActions` array + `tabsConfig` matrix are derived from flags rather than scattered conditional template logic.
- **Defensive null handling** — every service handles `!response.isSuccessful || !response.result` and `catchError(() => of([]))` for non-critical reads.
- **Session-aware Falcon-vs-Client divergence** — synthetic `FALCON_ROOT_NODE` for Falcon users skips a round-trip and renders pseudo-root locally.
- **Backend-driven row actions** — comm-channels & apps tabs read `row.allowedActions` / `row.availableActions` from the API response and gate row menus on the array. UI is data-driven, not hardcoded.
- **Lazy tree-child loading** — children fetched on `onNodeExpand`, tracked via `Set<string>` for loading + loaded states. BFS expansion restoration after refresh.
- **History state for navigation** — `selectNodeId` + `expandPath` ride in `history.state` so URL stays clean while preserving return-from-profile context.
- **Confirmation dialogs for destructive actions** — IP delete, pending-price-change delete, payment all use `ConfirmationService` first.
- **Polling abstraction (`SimplePollService.watch`)** — payment-status polling is declarative, with interval + max-duration + stop-condition. Replaces manual setInterval.
- **Façade pattern** — `CommerceActionsService` is a thin façade over `CommerceGatewayService`. Container uses the façade; the gateway service owns the HTTP details.

## Observed (bad — would be flagged by the night-shift digest)

### Angular v20 modernization gaps
- **`*ngIf` and `*ngFor` instead of `@if`/`@for`** — `organization-hierarchy.component.html:30,57,67,127,142,162` (and likely in tab templates).
- **`@Input/@Output` decorators** — every component still uses `@Input()` / `@Output()` decorators. Angular v17+ idiom is `input()` / `output()` signal functions.
- **`[ngClass]` usage** — likely throughout (not directly confirmed in `.ts` but present in patterns).
- **Constructor-style class-property state** in `OrganizationHierarchyComponent` (Sets, Maps, dozens of plain properties). Signal-based state would be more idiomatic now.

### Style/markup
- **SCSS component files** — every `.component.scss` exists alongside its `.ts`. Platform standard (per CLAUDE.md from feedback notes) is **Tailwind utilities only — no SCSS, no component CSS**. This is an explicit anti-pattern under the new theme.
- **`pi pi-*` PrimeIcons class strings hardcoded** — `comms-hub.component.ts:135-140` (serviceIcons map) and many templates. The brain-skills + CLAUDE.md memory notes track an in-progress purge of PrimeIcons.
- **Inline JavaScript injected into template strings** — `hierarchy-tab.component.ts:208-219` (renderUsernameWithAvatar returns raw HTML string with `<img>` / `<div>` tags), `renderStatusBadge` returns `<span>` markup. Should use Falcon table column templates instead of string interpolation.
- **`document.documentElement.dir` direct DOM access** — `contracts-cost-management.component.ts:61-66, 225-230` (for RTL detection). Should go through Angular's `Document` token / I18n service.

### Service-layer issues
- **Two redundant service files for the same endpoints** — `AppsServicesService.updatePriceType/Value` and `CommChannelsServicesService.updatePriceType/Value` exist but are **never called** by their owning tabs — those flows actually use `CommerceActionsService.changeApplicationPriceType/Value` and `changeCommChannelPriceType/Value`. Dead code.
- **`AppsServicesService.updatePriceType` returns mock data on error** (`apps-services.service.ts:60-69`) — explicit `catchError(() => of({ id, ..., effectiveDate }))`. Hides failures silently. Same anti-pattern in `CommChannelsServicesService`, `MarketplaceApplicationsService`, etc.
- **PascalCase request-body construction in TS** — `information.service.ts:53-74` manually constructs C# PascalCase property names (`NodeId`, `AccountName`, ...). Brittle, mirrors backend C# class instead of going through a mapper. Better: a shared DTO mapping function in `@falcon/sdk`.
- **`useGateway()` called with no argument** in most places — relies on app-level `provideAppDefaultGateway(CoreGateway)`. Implicit. Mixing explicit (`UserApiService` line 45 uses `useGateway(Gateway.CoreGateway)`) and implicit calls.
- **`response.errors?.[0] || response.errorMessages?.[0]`** — service contract has two error fields and they coexist (`org-hierarchy.api.service.ts:48`). Legacy alias should be removed from the envelope.

### State-management smells
- **Direct mutation of input data** — `organization-hierarchy.component.ts:228-231` mutates `rootNodeData.isRootNode = true`, etc., on the result returned from the API service. Mapping should produce a new object.
- **`setTimeout(0)` for view sync** — multiple places (`comm-channels-services-tab.component.ts:979-1006`, `apps-services-tab.component.ts:955-981`, `tabs-layout.component.ts:153-156, 187-190`) use `setTimeout` to defer UI updates by one tick. Indicates change-detection timing issues that would be solved by signals + `effect`.
- **`detectChanges()` vs `markForCheck()` mix** — some places call `cdr.detectChanges()` (forces immediate render), others `cdr.markForCheck()` (next CD tick). Comments in `organization-hierarchy.component.ts:296-298` admit this is to "force PrimeNG tree to re-render". Symptom of fighting CD.

### Other anti-patterns
- **Class instantiation via `new class implements ...`** — `organization-hierarchy.component.ts:507-510`:
  ```typescript
  const updateRequest: UpdateSubNodeNameRequest = new class implements UpdateSubNodeNameRequest {
    name: string = request.name;
    parentId: string = request.id;
  }
  ```
  Should be a plain object literal `{ name: request.name, parentId: request.id }`.
- **Multiple try/catch around `localStorage`** — `comms-hub.component.ts:445-451` & `marketplace-applications.component.ts:443-449` swallow localStorage errors. Common, but indicates the platform should provide a single `StorageService`.
- **Imports from a sibling app** — `contracts-cost-management.component.ts:6-14` imports `ContractRow`, `ContractsDataTableComponent`, `ContractsNodeHeaderComponent`, `ContractsViewContractComponent` from `../../../../../admin-console/src/app/features/contracts-cost-management/...` — **cross-app sibling imports**. Architecturally fragile; should live in a shared library.

## Patterns worth porting

- **PBAC-driven UI assembly** (allowedTreeActions + tabsConfig matrix) — clean, declarative, testable
- **Backend-driven row actions** (`row.allowedActions` array) — keeps role logic on the server, UI just renders what it's told
- **Façade + Gateway service split** — separates the call surface from the URL details
- **`SimplePollService.watch({ shouldStop, intervalSeconds, maxDurationMinutes })`** — declarative polling with a clear lifecycle
- **History-state-based navigation context** — clean URLs, breadcrumb-preserving back-nav
- **Reset-to-default-tab on node change via `tabsVisible` toggle** — ensures stateful tabs don't bleed state across nodes
- **`Hook<T>` option type + `Helper.enumToOptions(EnumType, EnumI18nMap, TranslateService)`** — consistent select-option construction

## Anti-patterns to NOT port to new theme

- Component-scoped SCSS files
- `pi pi-*` PrimeIcons in component code or templates (use Falcon icon set)
- `*ngIf` / `*ngFor` / `[ngClass]` (use new control flow + class bindings)
- `@Input/@Output` decorators (use `input()` / `output()`)
- Inline HTML in column-render strings (use FalconTable column `template`)
- Direct DOM reads (`document.documentElement.dir`)
- Cross-app sibling imports (use libs)
- `new class implements ...` micro-objects
- `setTimeout(0)` for change-detection sync (use signals + effects)
- PascalCase manual request-body construction (delegate to a DTO mapper or pre-built SDK function)
- Silent `catchError(() => of(mock))` masking errors
- Synchronous component imports for non-trivial features (use `loadComponent`)
