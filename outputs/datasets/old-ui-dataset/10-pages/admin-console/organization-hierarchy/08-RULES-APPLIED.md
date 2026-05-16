# Rules / patterns — organization-hierarchy

## Observed (good — keep in new theme)

### Architecture
- **Standalone components throughout** — every component declares `standalone: true` and explicit `imports[]`. No NgModules anywhere in the feature.
  - Examples: `OrganizationHierarchyComponent` (`organization-hierarchy.component.ts:50-67`), every wizard step, every tab.
- **`inject()` over constructor DI** — every service is injected with `private foo = inject(FooService)`. No constructor injection.
  - Container has 8 `inject()` calls (`organization-hierarchy.component.ts:73-130`), settings tab has 8 (`node-settings-tab.component.ts:66-73`).
- **Lazy-load via `loadComponent`** — `apps/admin-console/src/app/features/routes.ts:15-17` uses `loadComponent: () => import(...)`. Splits the bundle by route.
- **PES checks via `AccessControlFacade.resolveFlags(...)` and `.ensure(...)`** — the canonical pattern. No ad-hoc `if (user.role === ...)` permission checks.
- **`ServiceOperationResult<T>` wrapper handled** — every API service unwraps `.result` and inspects `.isSuccessful` / `.errors`. Matches platform standard.
- **Trust-the-backend for action visibility** — apps/comm-channel tabs delegate row-menu visibility to `row.allowedActions: FalconRowAction[]`. This is correct because the server is the SoT for per-user, per-row, per-account permissions.
- **`useGateway()` for gateway routing** — services explicitly call `useGateway()` (default = Core Gateway) or `useGateway(Gateway.IdentityGateway)` instead of hard-coding base URLs.
- **Reactive form for IP input** (settings tab + wizard step 1) — uses `new FormControl<string>('', { nonNullable: true })` and a `FormGroup` for IP-add validation while the rest of the form is template-driven. Reasonable hybrid where it earns its weight.
- **Signal-based state in `TabsLayoutComponent`** — `selectedNodeSig`, `tabsConfigSig` + `computed(...)` for `isFalconMenuSig`, `isMainMenuSig`, `defaultTabsConfig`, `currentTabsConfig` (`tabs-layout.component.ts:80-130`). The only signals-first component in the feature.
- **`takeUntilDestroyed(this.destroyRef)`** — used to cancel subscriptions on destroy (replaces manual `Subject<void>` patterns). Most services-subscribing components use this.
- **PrimeNG modules tree-shaken** — components import only the PrimeNG modules they need (`InputText`, `TableModule`, `Select`, `ToggleSwitch`, etc.) rather than a global PrimeNG re-export.
- **Mapper utilities isolated** (`utils/org-hierarchy.mapper.ts`) — pure functions for `OrgHierarchyNode → TreeNode` mapping. Easy to port + test.
- **Status normalization** (`toFalconItemStatus` in both apps + comm-channel models) — defensive against backend payload drift; accepts both numeric and string representations.
- **Per-component `MessageService` providers** — each tab has `providers: [MessageService]` to scope toasts. Prevents cross-tab toast leakage.

### Tree handling
- **Lazy-loaded children with deduplication** (`loadNodeChildren` in `organization-hierarchy.component.ts:526-576`): tracks `loadedChildrenIds`, `loadingChildrenIds` Sets to avoid duplicate fetches.
- **Expanded-state preservation across refresh** (`refreshTreePreservingState` + `collectExpandFrontier` + `expandFrontier` + `finalizeRestore`, lines 691-815): saves expansion keys + selected id, reloads, then BFS-re-expands to the same shape.
- **Path-based deep-link expansion** (`expandAlongPath`, lines 817-880): walks the `pendingExpandPath` array level-by-level, lazy-loading children at each depth before recursing.

### Wizard
- **Form-validity-on-step-change tracking** (`CreateClientWizardComponent.checkCurrentStepValidity`, lines 183-282): merges `valueChanges + statusChanges` from all step forms (NgForm + FormGroup hybrid for settings step) and updates `isCurrentStepValid` signal. Allows the stepper to disable "Next" when any field is invalid.
- **Pre-submit transform** (`buildWizardModel`, lines 335-355): filters services to `visibility === true`, lowercases userName. Keeps the submission lean.
- **Password regenerates on settings change** (account-owner step `ngOnChanges`): cross-step reactivity is explicit and minimal.

## Observed (bad — flag for cleanup or non-port)

### Angular idioms missed
- **`*ngIf` and `*ngFor` instead of `@if` / `@for`** — `organization-hierarchy.component.html` uses `*ngIf` at lines 30, 32, 59, 70, 124, 139, 159, 191; uses `*ngFor` at line 59. Tabs layout uses `*ngFor`/`*ngIf` at lines 3, 9, 11, 32, 39, 46. Every wizard step's html (not all read) likely follows the same pattern. **Should become `@if` / `@for` in the new UI.**
- **`@Input` / `@Output` decorators** — every component still uses the legacy decorator syntax. Under Angular v20+ idioms these should be `input()` / `output()` signal-based.
  - Examples: `tabs-layout.component.ts:35-68`, `hierarchy-tab.component.ts:50-65`, every wizard step component.
- **Manual `ChangeDetectorRef.detectChanges()` / `.markForCheck()`** — used heavily in the container (`organization-hierarchy.component.ts:268, 297, 312, 326, 358, ...`), info component, both tab components. With signals + zoneless + OnPush, these calls should disappear.
- **`viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]`** (`information.component.ts:55`) — works but is a "child form participates in parent NgForm" workaround. Reactive forms would compose more cleanly.
- **Manual `Subject<void>` + `destroy$.next() / .complete()`** (`organization-hierarchy.component.ts:120-157`) — coexists with `takeUntilDestroyed(this.destroyRef)`. Pick one — DestroyRef alone is the modern idiom.
- **`setTimeout(..., 0)` and `queueMicrotask(...)`** to force CD ordering — `organization-hierarchy.component.ts:182-187`, `tabs-layout.component.ts:152-159` + `:182-187`, `apps-services-tab.component.ts:920, 933, 944`, wizard `create-client-wizard.component.ts:172-175 + :308-313`. These suggest places where the change-detection timing is fragile. Zoneless + signals should eliminate most of these.

### Style / structure
- **SCSS files** — every component has a `.scss` companion (`organization-hierarchy.component.scss`, `tabs-layout.component.scss`, each tab, each wizard step). **Per Falcon UI rules (`feedback_no_inline_styles_tokens_only.md`, `angular-tailwind-skill`), the new UI must NOT use SCSS — Tailwind utilities only.** The hand-rolled skeleton in `organization-hierarchy.component.html:32-67` (with `oh-skeleton__*` BEM classes) is a particularly large SCSS footprint to migrate.
- **Inline HTML rendering with class names from templates** — `renderUsernameWithAvatar`, `renderStatusBadge` (`hierarchy-tab.component.ts:157-188`) — these return raw HTML strings with class names like `user-avatar`, `user-avatar-initials`, `username-text`, `status-badge`, `status-dot--active`, etc. Coupled to SCSS. **Should become Angular templates / ng-template** in the new UI.
- **PrimeIcons in templates** — `<i class="pi pi-sitemap">`, `<i class="pi pi-plus-circle">` (`organization-hierarchy.component.html:142, 151, 166, 180`). **Standing rule (`project_falcon_primeng_total_removal_complete.md`): ZERO PrimeIcons.** Replace with `<falcon-icon>` / `<falcon-svg-icon>`.
- **`'pi pi-eye'` icon string in row menu** (`hierarchy-tab.component.ts:125`) — same issue.

### Hard-coded English / un-localized
- Image upload `alert('Please select an image file.')` and `alert('The file is too large...')` — wizard step 0 (`information-client-step.component.ts:351, 357`) and step 4 (`account-owner-step.component.ts:148, 154`) and info view (`information.component.ts` via uploader).
- Empty-state and error toasts fall back to hard-coded English when translation key is missing (the `|| 'Failed to load applications'` pattern in every tab). **The translation keys exist** — the fallbacks are belt-and-suspenders. But there are also several pure-English strings (e.g. `'Order ID not found in response'`, `'Payment failed'`, `'Payment or order status check failed'`).
- `confirmationService.confirm({ ... acceptButtonStyleClass: 'p-confirm-dialog-accept', rejectButtonStyleClass: 'p-confirm-dialog-reject' })` — same class strings repeated in 7+ places (settings tab, wizard, both tabs). DRY violation — should be a shared confirm helper.

### Mock / fallback data in production code
- `OrgHierarchyApiService.getRootNodes()` (`org-hierarchy.api.service.ts:63-68`) and `.getChildren()` (`93-96`) catch all errors and `return of([]).pipe(delay(500))`. Designed for backend-down dev. **DO NOT PORT** this fallback to the new UI — it silently hides API failures.
- `AppsServicesService.updatePriceType / updatePriceValue` and `CommChannelsServicesService.updatePriceType / updatePriceValue` (`apps-services.service.ts:55-99`, `comm-channels-services.service.ts:61-105`) have `catchError(() => of({ id, pricingType, effectiveDate }))` — they return the request as if it succeeded on network failure. **Dangerous** — flag for removal. These methods also appear to be dead code (no consumer in current TS), so dropping them is safe.

### Data drift / quirks
- `AccountInformationModel.classificationCategory` typed `string`, sent as `number` (`information.service.ts:58-61`). **Pick one type throughout.**
- `AccountInformationModel.profilePicture` is a heterogeneous `string | ProfilePictureInfo | null`. Backend GET returns base64 dataURL; PUT expects PascalCase `{ Extension, FileBase64String }`. The transform in `information.service.ts:31-50` is non-trivial. **Normalize to a single representation** (probably a clean `{ extension, fileBase64String }` shape with no string-form).
- `AccountInformationModel.country` and `.countryId` (also `.city` / `.cityId`) — both are `any` and `onCountrySelected` assigns the same value to both (`information.component.ts:228-245`). Suggests a half-migration that never finished. **Pick one.**
- `CreateClientServiceDto.priceType` field name vs. `AppServiceItem.pricingType` field name — same domain concept, different spelling. **Pick one.**
- `CreateClientSettingsDto.maxNodeLevel` (singular) vs. `QuotaSettingsDto.maxNodeLevels` (plural). **Pick one.**
- `'EMPTY'` literal sometimes used as a TreeNode key when `node.id === null` (`org-hierarchy.mapper.ts:13`). Implicit magic value — should be `FALCON_ROOT_NODE.id` constant.

### Hard-coded defaults that should be config
- `CreateClientSettingsStepComponent.applyDefaults` (`client-settings-step.component.ts:111-118`): hard-codes `allowedIPs = ['192.168.0.1', '95.158.55.17']`, `maxNormalUserLimit = 20`, `maxSystemUserLimit = 5`, `maxNodeLevel = 0`, `passwordSecurityLevel = Advanced`. **Likely should come from backend or environment.**
- IP-input `maxlength="32"` on the node-name (`organization-hierarchy.component.html:118`) — magic number; should be a constant.

### Misc
- `console.error(...)` calls in production: 9 occurrences across the feature (in catch blocks of every API service + create-account error path). Acceptable for dev but should route through a proper logger in production.
- `alert(`Error: ${errorMessage}`)` in `CreateClientWizardComponent.onSendCredentials` (`create-client-wizard.component.ts:372, 380`) — uses native `alert()` instead of toaster/dialog. **Definitely replace with `MessageService` or a Falcon dialog.**
- `(this as any)` and `(res.result as any)` casts at multiple sites (e.g. `apps-services-tab.component.ts:876`, `create-client-wizard.component.ts:368-372`) — accommodates response-shape uncertainty. With proper DTO typing, these should vanish.
- `[ngClass]` — searched: no occurrences. Good.
- `*ngSwitch` — not used. Good (this template uses signal-driven branching via `*ngIf` chains which would become `@switch` / `@if` in new code).

## Patterns worth porting

1. **`refreshTreePreservingState` + `collectExpandFrontier` + `expandFrontier`** (container, lines 691-815) — clean BFS-based restore of expanded tree state after a mutation refresh. Generic enough to live in the shared tree library.
2. **`buildWizardModel`** (`create-client-wizard.component.ts:335-355`) — pre-submit filter + normalize pattern is widely applicable. Move to a util when generalizing.
3. **`AccessControlFacade.resolveFlags({ flagName: query, ... })`** — bulk PES flag resolution is much cleaner than per-flag calls. Use this pattern everywhere.
4. **Server-driven row actions (`row.allowedActions`)** — preserve this contract; it correctly puts the SoT on the backend.
5. **`SimplePollService.watch({ serviceMethod, intervalSeconds, maxDurationMinutes, shouldStop })`** — generic polling primitive. Already shared via `@falcon`. Reuse for any other async-job UIs (payment, bulk imports, etc.).
6. **Tab visibility via computed signals** (`TabsLayoutComponent.defaultTabsConfig`) — sets the bar for declarative tab-config; new UI should generalize this into a reusable directive.
7. **Inline-row editing via templates + `FalconTableComponent`** — the `editPriceTypeTpl` / `editPriceValueTpl` / `detailsRowTpl` pattern is elegant; keep it.
8. **Drawer-with-template-content** (`<app-drawer [templateContent]="drawerBodyTpl">`) — composable; reuse pattern for similar in-page edit flows.

## Anti-patterns to NOT port to new theme

1. **SCSS** — anywhere in the feature.
2. **PrimeIcons (`pi pi-*`)** — anywhere.
3. **`<input pInputText>` / `<p-select>` / `<p-confirmDialog>` / `<p-tag>` / `<p-skeleton>` / `<p-tabs>` / `<p-button>` / `<p-toggleSwitch>` / `<p-inputNumber>` / `<p-tablist>` / `<p-tabpanel>` / `<p-radioButton>` / `<p-checkbox>` / `<p-chip>` / `<p-password>`** — every PrimeNG component must be replaced with a Falcon-UI-Core equivalent per `project_falcon_primeng_total_removal_complete.md`.
4. **Hand-rolled HTML strings in render functions** (`hierarchy-tab.component.ts` `renderUsernameWithAvatar`, `renderStatusBadge`) — use Angular templates.
5. **`window.history.state` cross-page contracts** — replace with a proper router state or shared service. The current contract is implicit and undiscoverable.
6. **`alert(...)` calls** — replace with PrimeNG/Falcon dialogs or toasts.
7. **PascalCase request bodies** (information service `update` method) — backend should normalize OR a uniform serializer should handle the conversion.
8. **Silent error fallbacks (`return of([])` after delay)** in API services — log + propagate via the `ServiceOperationResult` error path; show error UI.
9. **Magic-string defaults** (the IP list in wizard step 1, `'pi pi-eye'` icon string, the `'EMPTY'` magic key in the mapper).
10. **Sibling components reaching across feature boundaries via shared/components path** — `InsufficientBalancePriorityDialogComponent` lives in `apps/admin-console/src/app/shared/components/` and is consumed by these tabs via a 6-level relative import. Either promote to `libs/falcon` or keep inside the feature. (The dialog is also used by other places — likely belongs in `libs/falcon` per the wallet-balance-management memory entry mentioning a "balance management migration playbook in memory".)
11. **`as any` casts** for response shapes — fully type the responses.
12. **Mixed template-driven + reactive forms** (settings tab uses both `NgForm` for the main fields AND `FormGroup` for the IP input). Pick one — reactive throughout is the modern idiom.
13. **Cross-app deep-link via `router.navigate(['/profile'], ...)`** — the `/profile` route lives in host-shell while this code lives in admin-console. New UI should formalize this with a typed cross-app navigation helper (typed routes / config-driven targets) so the dependency is explicit.

## Per-rule digest score (high-level)

| Rule (from night-shift digest / brain-skills) | Score | Notes |
|---|---|---|
| Standalone components | ✅ 100% | every component standalone |
| Lazy-loading via `loadComponent` | ✅ 100% | route uses `loadComponent` |
| Reactive over template-driven forms | ⚠️ ~30% | mixed — settings tab + wizard step 1 use `FormGroup` for IPs only |
| `inject()` over constructor DI | ✅ 100% | |
| `input()` / `output()` signal APIs (Angular v20+) | ❌ 0% | every component uses legacy `@Input` / `@Output` |
| `@if` / `@for` over `*ngIf` / `*ngFor` | ❌ 0% | every template uses `*ngIf` / `*ngFor` |
| Tailwind utilities only — no SCSS | ❌ 0% | every component has a `.scss` companion |
| Falcon UI Core only — no PrimeNG | ❌ ~15% | feature relies heavily on PrimeNG (`p-tabs`, `p-confirmDialog`, `p-select`, `p-skeleton`, `InputText`, `Tag`, `Table`, `Skeleton`, etc.) |
| ZERO PrimeIcons | ❌ ~10% | `pi pi-sitemap`, `pi pi-plus-circle`, `pi pi-eye` all in use |
| `ServiceOperationResult<T>` everywhere | ✅ 100% | |
| `useGateway()` for routing | ✅ 100% | |
| PES via `AccessControlFacade` + `FalconAccess` | ✅ 100% | |
| `MultiLanguageName` for user-facing text | ⚠️ N/A | feature passes through backend strings; doesn't construct multilingual names client-side |
| Translation keys (no hard-coded English) | ⚠️ ~75% | most strings are keyed, but several `|| 'fallback'` defaults + `alert()` calls + ~10 raw English error strings |
| `takeUntilDestroyed(destroyRef)` | ✅ ~80% | most subscribers use it; container still has `Subject<void>` |
| OnPush change detection | ⚠️ ~0% | no `changeDetection: ChangeDetectionStrategy.OnPush` declared anywhere in the feature; relies on Zone.js + manual `markForCheck()` / `detectChanges()` |
| Signals + zoneless ready | ⚠️ ~15% | only `TabsLayoutComponent` uses signals; everything else is observables + manual CD |

**Overall**: this feature is functionally complete and the **architecture is excellent** (standalone, lazy, PES-driven, gateway-routed, signal-aware where useful), but the **rendering layer is fully PrimeNG-bound + SCSS-bound + legacy-template-syntax**. Porting to the new Falcon-UI-Core/Tailwind/signals stack is a structural rewrite of the templates and styles — the .ts logic mostly survives.
