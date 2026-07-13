# Falcon Shared Features — SURFACE (public API / exports — full inventory)

> The complete public surface of `libs/falcon/src/shared-features/`. Each unit's barrel `index.ts` is its contract. Every fact `[CODE]`-cited from the file read 2026-06-03 (L05).

## 1. comm-mkt-view — `@falcon/comm-mkt-view`

**Barrel** ([CODE] `comm-mkt-view/index.ts:4-6`): `export { CommMktViewComponent }` + `export *` of model + config.

### Component `CommMktViewComponent` — `<app-comm-mkt-view>`
Standalone, OnPush, `host: { class: 'block h-full min-h-0' }`, **inline `styles:` block** ([CODE] `comm-mkt-view.component.ts:94` — `:host ::ng-deep [data-shadow-actions-mount]{display:none!important}`).

| Member | Kind | Type | Notes |
|---|---|---|---|
| `kind` | `@Input({required})` | `CommMktKind` | `'commChannels' \| 'appsServices'` — selects panel header/title + storage key |
| `items` | `@Input` setter/getter | `readonly CommMktItem[]` | signal-backed (`_items`); setter auto-expands pending-shadow rows ([CODE] :104-111) |
| `loading` | `@Input` | `boolean` | |
| `error` | `@Input` | `string \| null` | |
| `nodeName` | `@Input` | `string \| null` | |
| `busyRowIds` | `@Input` setter/getter | `ReadonlySet<string>` | per-row in-flight set (signal-backed) |
| `action` | `@Output` | `EventEmitter<CommMktActionEvent>` | disable/enable/doPayment forwarded to wrapper |

**Legacy decorator API** — uses `@Input/@Output/EventEmitter`, NOT `input()/output()` (AUDIT A1).

### Sub-components (exported transitively via the component, not the barrel)
- `CommMktCardComponent` — `<app-comm-mkt-card>` (grid card).
- `CommMktServiceIconComponent` — `<app-comm-mkt-service-icon>`; `@Input({required}) kind: CommMktIconKey`, `@Input() size = 24`. **Inline-SVG glyph switch** ([CODE] `comm-mkt-service-icon.component.ts:24-102`) + host `[style.color]` with hardcoded hex fallback (AUDIT C).
- `CommMktViewToggleComponent` — `<app-comm-mkt-view-toggle>`; `@Input() value: CommMktViewMode`, `@Output() valueChange`. Inline-SVG list/grid icons.

### Types + helpers (barrel `export *`)
- Types: `CommMktKind`, `CommMktViewMode` (`'grid'|'list'`), `CommMktStatusFilter`, `CommMktActionId` (`'doPayment'|'disable'|'enable'`), `CommMktPending`, `CommMktItem`, `CommMktActionEvent`, `CommMktActionDef`, `CommMktActionGate`, `CommMktDetailWire`, `CommMktIconKey`.
- Consts: `COMM_MKT_DEFAULT_VIEW_MODE` (`'grid'`), `COMM_MKT_KIND_CONFIG`, `COMM_MKT_ACTIONS`.
- Functions: `viewModeStorageKey(kind)`, `parseDetailsToPending(details)`, `resolveIconKey(item)`, `resolveDescriptionKey(name)`, `cardToneClass(status)`, `statusFilterBucket(status)`, `pricePeriodTailKey(type)`, `cardShowsPrice(status)`, `canDoPaymentForStatus(status)`, `commMktActionAllowed(item, action)`, `commMktActionVisible(item, def)`, `resolveCommMktActions(item)`.

## 2. service-pricing-table — `@falcon/service-pricing-table`

**Barrel** ([CODE] `service-pricing-table/index.ts:5-41`): component + 6 event types + kind + models (`export *`) + selected table-config exports + validations (`export *`) + transport contract.

### Component `ServicePricingTableComponent` — `<falcon-service-pricing-table>`
Standalone, OnPush, `providers: [servicePricingRulesProvider()]`. **Signals-first inputs/outputs** (`input()`, `input.required()`, `output()`).

| Input | Type | Default | Notes |
|---|---|---|---|
| `rows` | `input<ReadonlyArray<ApplicationRow>>` | `[]` | host wrapper's GET result, adapted |
| `kind` | `input.required<'application'\|'comm-channel'>` | — | drives FE card title only; endpoints resolved in wrapper |
| `accessFlags` | `input<ServiceAccessFlags>` | `DEFAULT_SERVICE_ACCESS_FLAGS` | resolved PES flags |
| `submitting` | `input<boolean>` | `false` | WHOLE-TABLE loading gate (G-27) |
| `busyRowIds` | `input<ReadonlySet<string> \| ReadonlyArray<string>>` | `new Set()` | per-row busy spinner (G-27) |

| Output | Payload |
|---|---|
| `visibilityToggle` | `ServicePricingVisibilityEvent` |
| `rowAction` | `ServicePricingRowActionEvent` (enable/disable/doPayment) |
| `priceTypeSave` | `ServicePricingPriceTypeSaveEvent` |
| `priceValueSave` | `ServicePricingPriceValueSaveEvent` |
| `scheduledDelete` | `ServicePricingScheduledDeleteEvent` |
| `doPaymentRequest` | `ServicePricingDoPaymentEvent` |

### Transport contract (`services/service-pricing-transport.ts`)
- Token: `SERVICE_PRICING_TRANSPORT = new InjectionToken<ServicePricingTransport>(...)`.
- Interface `ServicePricingTransport` — 8 `kind`-parameterised methods: `list`, `changeVisibility`, `changePriceType`, `changePriceValue`, `enable`, `disable`, `deleteNewPriceType`, `deleteNewPriceValue` (all return `Observable<…MutationResult>`).
- Request DTOs: `ServicePricingPriceTypeChange`, `ServicePricingPriceValueChange`, `ServicePricingVisibilityChange`, `ServicePricingServiceScopedRequest`. Result types: `ServicePricingMutationResult`, `ServicePricingPriceMutationResult`.

### Validations contract (`validations/validations.ts`)
- Token: `SERVICE_PRICING_VALIDATIONS` + `servicePricingRulesProvider()`.
- Pure fns: `effectiveDateRequired`, `effectiveDateMustBeInFuture`, `invalidEffectiveDateForPeriodicPricingChange`, `validateEffectiveDate` (composite), `defaultEffectiveDateIso`, `effectiveDateEnforcedFor`, `disabledDatesForRow` (date-picker predicate). Types: `EffectiveDateError`, `EffectiveDateValidationResult`, `ServicePricingEffectiveDateContext`, `ServicePricingValidationRules`.

### table-config (`models/table-config.ts`)
- `ServiceAccessFlags`, `DEFAULT_SERVICE_ACCESS_FLAGS`, `TranslateFn`, `buildServiceColumns(t)` (8 columns), `buildServiceRowActions(t, flags)` (5 kebab actions — doPayment/enable/disable/editPriceType/editPriceValue, each PES-flag AND `availableActions[]` gated).
- `models/models.ts` — wire DTOs, view-models (`ApplicationRow`, `ApplicationScheduledChange`, `ApplicationPriceType`, `ApplicationStatus`, `ServiceRow`, `AccountServiceWire`), and the `ServiceRow → ApplicationRow` adapter (`export *`).

## 3. user-details — `@falcon` (re-exported from `libs/falcon/src/index.ts`)

**Barrel** ([CODE] `user-details/index.ts:11-15`): component + models (`export *`) + signals (`export *`) + validations (`export *`).

### Component `UserDetailsPageComponent` — `<app-user-details-page>`
Standalone, OnPush, `providers: [UserDetailsStateSlice]` (per-instance), `host: { class: 'block h-full' }`. Signals-first.

| Input | Type | Default | Notes |
|---|---|---|---|
| `userId` | `input<string>` | `''` | OPTIONAL (was required) — self path loads GET user/me id-free |
| `includeDeleted` | `input<boolean>` | `false` | |
| `selfMode` | `input<boolean>` | `false` | explicit "/profile is me" flag |

| Output | Payload |
|---|---|
| `back` | `void` |
| `dirtyChange` | `boolean` |

### `UserDetailsStateSlice` (`signals/signals.ts`) — `@Injectable()` (component-provided)
Per-instance signal store. Depends on `inject(USER_DETAILS_GATEWAY)` (`@falcon/sdk` port) + `AccessControlFacade`. Public signals/computeds: `userSig`, `loading`, `errorMsg`, `permissionsReady`, `loadingOrResolving`, `editMode`, `activeTab`, `draft`, `showErrors`, `saving`, `selfMode`, `pictureDraft`, `otpOpen/otpChannel`, `phone/emailVerifiedLocal`, `roleFlags`, `permFlags`, `statusTransitionFlags`, `roleCatalog`, `user`, `currentField`, `fieldErrors`, `formInvalid`, verification computeds, `allowedTargetRoles`, `roleOptions`, `allowedStatusTransitions`, `isTargetStatusFrozen`, `canSelfEdit`, `isSaveDisabled`, etc. Methods: `fetchUser`, `fetchMe`, `resolveRoleCatalog`, `resolveRoleFlags`, `resolvePermFlags`, `resolveStatusTransitionFlags`, `enterEdit`, `cancelEdit`, `setPicture`, `deletePhoto`, `setField`, `openOtp`, `onOtpVerified`, `save`. Types: `ViewTab`, `VerificationState`, `UserFieldPermFlags`.

### validations (`validations/validations.ts`)
- Types: `RequiredFieldKey`, `FieldErrorCode`, `FieldErrorMap`, `ValidationInput`, `ExclusiveEditInput`.
- Fns: `isBlank`, `isValidEmail`, `isValidPhone`, `isValidPersonName`, `isValidUsername`, `isValidNationalId`, `buildFieldErrors`, `isFormInvalid`, `valueChangedFromVerified`, `isEmailPhoneExclusiveViolation`. (Internal `checkPersonName`/`checkUsername`/… not exported.)

### models (`models/index.ts`)
- Values: `ROLE_KEY_BY_ENUM`, `USER_STATUS_BY_NUM`, `mapUserResponseToUser`. Types: `User`, `UserStatus`, `UserRoleKey`, `CheckerLevel`. (Wire DTOs live in `@falcon/sdk`, not here.)

## 4. org-node-avatar — `@host-shell/shared/org-node-avatar`

**Barrel** ([CODE] `org-node-avatar/index.ts:4-5`): `export { OrgNodeAvatarComponent }` + types.

### Component `OrgNodeAvatarComponent` — `<app-org-node-avatar>`
Standalone, OnPush, `host: { class: 'inline-flex items-center' }`, `imports: []`. Signals-first.
- `identity = input.required<NodeIdentity>()`, `size = input<OrgNodeAvatarSize>('md')`.
- Template ([CODE] `org-node-avatar.component.html`) — 3-way `@switch (identity().kind)`: `'falcon-brand'` (inline brand SVG), `'image'` (`<img>`), `'initials'` (chip).
- Types: `NodeIdentity { name; kind; imageUrl; initials }`, `NodeIdentityKind = 'falcon-brand'|'image'|'initials'`, `OrgNodeAvatarSize = 'sm'|'md'`.

## 5. falcon-brand-logo — `@host-shell/shared/falcon-brand-logo`

**Barrel** ([CODE] `falcon-brand-logo/index.ts:1`): `export { FalconBrandLogoComponent }`.

### Component `FalconBrandLogoComponent` — `<app-falcon-brand-logo>`
Standalone, OnPush, inline template (single SVG, `fill="currentColor"`, `class="w-full h-full"`), `host: { class, role: 'img', aria-label: 'Falcon' }`. **No inputs / no outputs** — pure glyph; size via host `w-/h-` utility, color via host `text-*` utility ([CODE] `falcon-brand-logo.component.ts:15-22`).

## DI tokens introduced by this area
- `SERVICE_PRICING_TRANSPORT` (host wrapper binds `CommerceGatewayService`).
- `SERVICE_PRICING_VALIDATIONS` (component-scoped via `servicePricingRulesProvider()`).
- Consumed (not introduced): `USER_DETAILS_GATEWAY`, `FALCON_NOTIFIER`, `FalconMessageOrchestratorService`, `FalconUnsavedChangesService` (all `@falcon/sdk` / `@falcon/ui-core/angular`).

## Verification
🟢 code-verified 2026-06-03 (L05) — every barrel + every exported symbol read directly. Input/output decorator-vs-signal split, token names, and method lists transcribed from source. 🟡 sub-component selectors for `CommMktCardComponent` inferred from folder convention (card file not re-read line-by-line; the other two sub-components read in full).
