---
type: feature-compare
feature: contracts-cost-management
purpose: "Answers 'how is the mgmt side hardcoded view-only via canEdit:false + why acc-owner is the only role that lands on it'. Open before touching any contract UI or migration."
admin-side-app: admin-console
admin-side-route: /contracts-cost-management
admin-side-gateway: SystemGateway
mgmt-side-app: management-console
mgmt-side-route: /contracts-cost-management
mgmt-side-gateway: CoreGateway
falcon-only: false
falcon-mostly: true
client-only: false
shared: true
pes-keys-admin:
  - app.admin-console / view
  - (no feature-scoped keys — soft eligibility via wallet-strategy lookup only)
pes-keys-mgmt:
  - app.management-console / view
  - acc.contract / view  (declared on data.access but NOT enforced — no shellAccessGuard)
extracted: 2026-05-16
---

# Feature compare · contracts-cost-management

> [!tldr]
> Commercial contract authoring + viewing surface. **The single most asymmetric feature in the dataset: Falcon side owns the full create / edit / wizard / rate-card / rate-matrix / addons life-cycle; Client side is hardcoded view-only with `canEdit: false` and re-imports admin-console components via cross-app relative paths.** Visibility on the Client side is restricted to a single role (`acc-owner`) via `acc.contract.view` — `acc-admin` and `acc-user` are explicitly denied.

## At a glance

| Aspect | Falcon (admin-console) | Client (management-console) | Notes |
|---|---|---|---|
| App | `admin-console` (:4204) | `management-console` (:4301) | Both MF remotes |
| Route slug | `/contracts-cost-management` | `/contracts-cost-management` | Identical URL |
| Default gateway | `Gateway.SystemGateway` (:7256) | `Gateway.CoreGateway` (:7038) | `[CODE] apps/admin-console/src/app/app.config.ts:52` |
| Mode coverage | `list \| view \| add \| edit` (full lifecycle) | `list \| view` only | `[BRAIN-OUT] contracts-cost-management.diff.md:14-31` |
| Account selection | Local `<app-contracts-accounts-panel>` flattening org tree to single-level account list | Same component re-used via cross-app relative import | `[CODE] apps/admin-console/src/app/shared/components/contracts-accounts-panel/` |
| Visibility on Client side | n/a (Falcon side) | **Only `acc-owner` can see contracts** — `acc.contract.view` denied for `acc-admin` + `acc-user` | `[CODE] falcon-access.registry.ts:85` + `[BRAIN-OUT] 01-roles/*.md` |
| Edit capability | ✅ Full wizard + tabbed edit | ❌ **Hardcoded `canEdit: false`** at `[CODE] management-console/.../contracts-api.service.ts:135, 145` | `[BRAIN-OUT] contracts-cost-management.diff.md:24, 66-68` |
| Wizard | ✅ 4-step `DynamicStepperComponent` (info → rate-card → details → addons) | ❌ Not implemented | `[BRAIN-OUT] old-ui-dataset/.../contracts-cost-management/02-COMPONENTS.md:60-73` |
| Backend (contracts) | `commerce/Contracts*` via System Gateway | `api/commerce/contracts` via Core Gateway (lowercase, with `api/` prefix) | `[BRAIN-OUT] contracts-cost-management.diff.md:33-51` |
| Backend (balance enrichment) | `charging/Wallet/contract-balance-summaries` — parallel `forkJoin` on list + detail | **Not called** — mgmt uses `contract.committedValue` + `contract.remainingBalance` from the contracts endpoint directly | `[BRAIN-OUT] contracts-cost-management.diff.md:39, 67` |
| Cross-app imports | n/a | **Mgmt imports 3 admin-console components via `../../../../../admin-console/...` relative paths** — architecturally fragile | `[BRAIN-OUT] contracts-cost-management.diff.md:15-19, 76-80` |
| Route-level PES gate | None (parent `adminConsoleGuard` only) | None enforced — `data.access` declares the key but no `shellAccessGuard` consumes it | `[BRAIN-OUT] contracts-cost-management.diff.md:11-12` |

## Per-role capability

> Source: `[BRAIN-OUT] authority-dataset/01-roles/*.md` (all 6) + `[BRAIN-OUT] authority-dataset/03-pes-keys/REGISTRY-RAW.md`.

| Role | Land on page | List contracts | View contract detail | Create contract | Edit contract | Cross-account scope |
|---|---|---|---|---|---|---|
| `sys-admin` | ✅ via `app.admin-console.view` allow | ✅ | ✅ | ✅ (no feature PES; UI button enabled iff `walletStrategy != null`) | ✅ (no feature PES; UI button enabled iff `currentContract.canEdit && canEditContractStatus(status)`) | ✅ any account |
| `sys-ops` | ✅ | ✅ | ✅ | ✅ (no PES guard in feature — anyone reaching the page) | ✅ same | ✅ any account |
| `sys-products` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ any account |
| `acc-owner` | ✅ via `app.management-console.view` allow | ✅ via `acc.contract.view` allow | ✅ | ❌ (mgmt is read-only — `canEdit: false` hardcoded) | ❌ | ❌ own account only |
| `acc-admin` | ✅ (reaches mgmt-console root) | ❌ — `acc.contract.view` **explicitly deny** at `[CODE] BuiltInRoleCatalog.cs:217-248` | ❌ | ❌ | ❌ | n/a |
| `acc-user` | ✅ (reaches mgmt-console root) | ❌ — `acc.contract.view` deny | ❌ | ❌ | ❌ | n/a |

### Notes on the per-role table

- **Falcon side has no PES protection inside the feature.** Every `sys-*` role that can reach admin-console can also see and (potentially) author contracts. There is no `adminConsole.contracts.{view,create,edit}` cluster anywhere in `[CODE] falcon-access.registry.ts:89-145`. `[BRAIN-OUT] old-ui-dataset/.../contracts-cost-management/05-PES.md:46-54` flags this as a recommended future addition.
- **The only soft eligibility check on the Falcon side** is `walletStrategy` — `onAddContract()` returns early if `!isWalletStrategyConfigured` (`[CODE] contracts-cost-management.component.ts:103-109`) and the "Add Contract" button is disabled with a warning banner. This makes `wallet-balance-management` a **hard dependency** before any contract can be created. `[BRAIN-OUT] old-ui-dataset/.../contracts-cost-management/07-CROSS-PAGE.md:58-59`.
- **`acc-admin` and `acc-user` cannot list contracts at all** — `acc.contract.view` is `❌ deny` for both. `[CODE] BuiltInRoleCatalog.cs:217-248` (acc-admin) explicitly denies; `[CODE] BuiltInRoleCatalog.cs:255-289` (acc-user) denies. The mgmt-console menu item is hidden for these roles. `[BRAIN-OUT] authority-dataset/01-roles/acc-admin.md:67` + `acc-user.md:68`.
- **`acc-owner` is the only acc-* role with `acc.contract.view` = allow** — `[CODE] BuiltInRoleCatalog.cs:171-210` line for `acc.contract / view` allow. `[BRAIN-OUT] authority-dataset/01-roles/acc-owner.md:68, 93` and `[BRAIN-OUT] 02-statuses/contract-status.md:34-38` both call this out as "acc-owner-only".
- **No client-side role can create or edit contracts.** Even acc-owner gets the view-only flow because `[CODE] management-console/.../contracts-api.service.ts:135, 145` hardcodes `canEdit: false` on every row mapping, and the create/edit components are not imported by the mgmt-console feature shell.

## PES keys consumed

### Admin side (Falcon)

| Key | Resolves to | File:line |
|---|---|---|
| `FalconAccess.adminConsole.enter()` | `{ action: 'view', resource: 'app.admin-console' }` | `[CODE] falcon-access.registry.ts:90`; consumed at `[CODE] apps/admin-console/src/app/app.routes.ts:8` |
| (no feature-scoped keys) | — | `[BRAIN-OUT] old-ui-dataset/.../contracts-cost-management/05-PES.md:1-13` confirms zero `accessControlFacade.can()` calls inside the feature scope. Soft gating via `walletStrategy` + backend-provided `canEdit`. |

### Mgmt side (Client)

| Key | Resolves to | File:line |
|---|---|---|
| `FalconAccess.managementConsole.enter()` | `{ action: 'view', resource: 'app.management-console' }` | `[CODE] falcon-access.registry.ts:37`; consumed by `managementConsoleGuard` |
| `FalconAccess.managementConsole.contract.view()` | `{ action: 'view', resource: 'acc.contract' }` | `[CODE] falcon-access.registry.ts:85`; declared on `data.access` but **NOT** enforced because the mgmt-console contracts route has **no `shellAccessGuard`** in its `canActivate` array. `[BRAIN-OUT] contracts-cost-management.diff.md:11-12` flags this gap. |

The single Client-side feature PES key (`acc.contract.view`) is the **strongest authority asymmetry in the dataset** — only `acc-owner` is allowed:

```yaml
# [BRAIN-OUT] authority-dataset/02-statuses/contract-status.md:34-38
acc-owner — acc.contract.view = allow
acc-admin — acc.contract.view = deny    ← explicit
acc-user  — acc.contract.view = deny
```

Effectively the page is "Falcon-mostly" — three sys-* roles see and edit everything across all accounts, and exactly one acc-* role sees view-only details of its own contracts.

## Differences

> Full per-section diff: `[BRAIN-OUT] old-ui-dataset/10-pages/management-console/_diffs/contracts-cost-management.diff.md`.

### Routing (`[BRAIN-OUT] contracts-cost-management.diff.md:6-13`)
- Both apps: same slug, both `loadComponent`-lazy, both rely on app-level guards (admin: `adminConsoleGuard`; mgmt: `managementConsoleGuard`).
- Admin: no explicit route guard or PBAC key.
- Mgmt: declares `data.access = FalconAccess.managementConsole.contract.view()` but does NOT add `canActivate: [shellAccessGuard]` — declaration is informational; runtime enforcement leaks down to backend authorization.

### Component shape (`[BRAIN-OUT] contracts-cost-management.diff.md:14-31, 76-80`)
- Admin owns: container + `ContractsAddWizardComponent` (4-step) + `ContractsViewContractComponent` (3 tabs) + `ContractsEditContractComponent` (4 tabs) + 4 reusable section components (rate-card, contract-details/matrix, addons, number-input). Tree: `[BRAIN-OUT] old-ui-dataset/.../contracts-cost-management/02-COMPONENTS.md:1-33`.
- Mgmt owns: only a thin wrapper container that re-imports `ContractsDataTableComponent`, `ContractsNodeHeaderComponent`, and `ContractsViewContractComponent` **from the admin-console source tree via relative paths** like `../../../../../admin-console/src/app/...`. `[BRAIN-OUT] contracts-cost-management.diff.md:15-19`. This is flagged as architecturally fragile.
- Modes: admin has `list \| add \| view \| edit`; mgmt has `list \| view`.

### Service / API endpoints

| Operation | Admin (SystemGateway) | Mgmt (CoreGateway) |
|---|---|---|
| List contracts | `GET commerce/Contracts?accountId={id}` + parallel `GET charging/Wallet/contract-balance-summaries?accountId={id}` via `forkJoin`. `[CODE] admin-console/.../contracts-api.service.ts:148-163` | `GET api/commerce/contracts` only — no balance enrichment. `[BRAIN-OUT] contracts-cost-management.diff.md:37-39` |
| Get contract detail | `GET commerce/Contracts/{contractId}` then `switchMap → getContractBalanceSummaries` (sequential). `[CODE] admin-console/.../contracts-api.service.ts:165-176` | `GET api/commerce/contracts/{contractId}` — no parallel charging call |
| Create | `POST commerce/Contracts` with `toCreatePayload(accountId, form)`. `[CODE] admin-console/.../contracts-api.service.ts:178-182` | **Not implemented** |
| Update | `PUT commerce/Contracts/{contractId}` with `toUpdatePayload(form)`. `[CODE] admin-console/.../contracts-api.service.ts:184-188` | **Not implemented** |
| Wallet strategy lookup | `GET commerce/Setting/wallets/{accountId}` (404 → null). `[CODE] admin-console/.../contracts-api.service.ts:190-215` | **Not implemented** (no create/edit, so no eligibility check needed) |
| Application lookup | `GET commerce/Node/{accountId}/applications` (filtered to `visibility !== false`). `[CODE] admin-console/.../contracts-api.service.ts:217-231` | **Not implemented** |
| Channel lookup | `GET commerce/Node/{accountId}/comm-channels/visible` (sorted by `priorityOrder`). `[CODE] admin-console/.../contracts-api.service.ts:233-247` | **Not implemented** |
| Contract balance summaries | `GET charging/Wallet/contract-balance-summaries?accountId={id}` (errors swallowed → `[]`). `[CODE] admin-console/.../contracts-api.service.ts:433-447` | **Not implemented** (balance comes inline in the contract response) |
| Tree data | `GET commerce/Node` + `GET commerce/Node?NodeId={parentId}` via shared `OrgHierarchyApiService` | Same tree component re-used cross-app |

Critical URL difference: admin uses `commerce/Contracts` (no `api/` prefix, capital C) while mgmt uses `api/commerce/contracts` (explicit `api/` prefix, lowercase). `[BRAIN-OUT] contracts-cost-management.diff.md:46-50` notes this is unusual and likely a leftover or alternate gateway route.

### DTOs (`[BRAIN-OUT] contracts-cost-management.diff.md:56-67`)
- Form / state DTOs (`ContractRow`, `ContractDetails`, `ContractUnitConversionRow`, `ContractRateRow`, `ContractRateMatrixState`, `ContractQuotaRow`, `ContractOverageRateRow`, `ContractTariffPlan`, `ContractFormValue`) — defined in `[CODE] apps/admin-console/.../contracts.models.ts` and **imported by mgmt** via cross-app relative paths.
- Catalog constants (`CONTRACT_UNIT_CONVERSION_CATALOG`, `CONTRACT_RATE_PRIORITIES`, `CONTRACT_VOICE_RATE_PRIORITIES`, `CONTRACT_RATE_DESTINATIONS`, `CONTRACT_ADDON_CATALOG`) — admin-only; mgmt never lists/edits them.
- API-wire DTOs (`ApiContractSummary`, `ApiContractResponse`, `ApiContractTariffPlan`, `ApiContractUnitConversion`, `ApiContractRate`, `ApiContractQuota`, `ApiContractOverageRate`, `ApiWalletSettings`, `ApiContractBalanceSummariesResponse`, `ApiContractBalanceSummary`, `ApiApplicationOption`, `ApiChannelOption`) — admin-only; mgmt has its own slimmer mapping that hardcodes `canEdit: false`, `currencyCode: 'SAR'`.

Full DTO surface: `[BRAIN-OUT] old-ui-dataset/10-pages/admin-console/contracts-cost-management/04-DTOS.md`.

### Gateway routing
- Admin → System Gateway → Commerce + Charging. Confirmed by `[CODE] apps/admin-console/src/app/app.config.ts:52` (`provideAppDefaultGateway(Gateway.SystemGateway)`); every `useGateway()` call in `ContractsApiService` is arg-less, inheriting the app default.
- Mgmt → Core Gateway → Commerce. The unusual `api/commerce/contracts` URL is a gateway-routing artifact, not a service difference (same backend Commerce service per `[BRAIN-OUT] contracts-cost-management.diff.md:53-54`).

## What changes when copying admin → mgmt

If you take the admin-console `contracts-cost-management` and port it to mgmt-console, these are the concrete edits:

1. **Drop the wizard.** Remove `ContractsAddWizardComponent` + the `mode === 'add'` branch from the container template + `onAddContract()` handler + the "Add Contract" header button. Result: `mode: 'list' | 'view'` only.
2. **Drop the edit flow.** Remove `ContractsEditContractComponent` + `mode === 'edit'` branch + `@ViewChild(ContractsEditContractComponent)` + `onViewEdit()` + the edit-from-detail header button. Hardcode `canEdit: false` on row mapping (see `[CODE] management-console/.../contracts-api.service.ts:135, 145`).
3. **Drop balance enrichment.** Remove the `forkJoin({contracts, balances})` in `listContracts()` and the `switchMap → getContractBalanceSummaries` in `getContract()`. Read `remainingSar` straight from `ApiContractSummary.remainingBalance` instead of from charging.
4. **Drop the lookup endpoints** that the wizard needs:
   - `GET commerce/Setting/wallets/{accountId}` — not needed when there's no wizard.
   - `GET commerce/Node/{accountId}/applications` — not needed.
   - `GET commerce/Node/{accountId}/comm-channels/visible` — not needed.
   - `GET charging/Wallet/contract-balance-summaries` — not needed (balance is inline).
5. **Flip URLs from `commerce/Contracts` to `api/commerce/contracts`** (lowercase, `api/` prefix). `[BRAIN-OUT] contracts-cost-management.diff.md:46-50`.
6. **Flip the app-default gateway** from `Gateway.SystemGateway` to `Gateway.CoreGateway` (configured on the mgmt-console app shell, not on this feature directly).
7. **Add the PES route guard.** Wire `canActivate: [shellAccessGuard]` + `data: { access: FalconAccess.managementConsole.contract.view() }` so the route enforces `acc.contract.view` rather than relying on backend authorization to return empty lists. **This is the critical authority gate** — without it, `acc-admin` and `acc-user` can hit the route directly and the page is only protected by the menu being hidden.
8. **Cross-app shared types and components** — mgmt currently imports `ContractsDataTableComponent`, `ContractsNodeHeaderComponent`, `ContractsViewContractComponent`, and `contracts.models.ts` from `../../../../../admin-console/...`. This is architecturally fragile and should ideally be moved into a shared lib in a rebuild.

If you go the other direction — **mgmt → admin** — you instead **add** the wizard component, edit component, balance-enrichment endpoints, lookup endpoints, **flip** URLs back, **flip** the app-default gateway back, and **drop** the PES route guard (admin has no `adminConsole.contracts.*` cluster — this is documented as a recommended future addition at `[BRAIN-OUT] old-ui-dataset/.../contracts-cost-management/05-PES.md:46-54`).

### Endpoints / keys that simply do not exist on the other side

| Item | Admin side | Mgmt side |
|---|---|---|
| `POST commerce/Contracts` (create) | ✅ exists | ❌ not implemented |
| `PUT commerce/Contracts/{id}` (update) | ✅ exists | ❌ not implemented |
| `GET commerce/Setting/wallets/{id}` (wallet strategy eligibility) | ✅ exists | ❌ not implemented |
| `GET commerce/Node/{id}/applications` (wizard lookup) | ✅ exists | ❌ not implemented |
| `GET commerce/Node/{id}/comm-channels/visible` (wizard lookup) | ✅ exists | ❌ not implemented |
| `GET charging/Wallet/contract-balance-summaries` (balance enrichment) | ✅ exists | ❌ not implemented |
| PES key `acc.contract.view` | n/a (sys side uses `app.admin-console.view`) | ✅ declared (registry); ✅ allow for acc-owner only; ❌ deny for acc-admin + acc-user |
| PES key `sys.contract.view` or `adminConsole.contracts.*` | **Does not exist** in the registry — `[BRAIN-OUT] 02-statuses/contract-status.md:38` notes "No `sys.contract` resource defined" | n/a (Client side) |

## Cross-references

- Role notes:
  - `[BRAIN-OUT] authority-dataset/01-roles/sys-admin.md` — full reach across all accounts (no feature PES anyway)
  - `[BRAIN-OUT] authority-dataset/01-roles/sys-ops.md` — same reach (no PES gating)
  - `[BRAIN-OUT] authority-dataset/01-roles/sys-products.md` — same reach (commercial admin persona; conceptually "owns" the contracts feature)
  - `[BRAIN-OUT] authority-dataset/01-roles/acc-owner.md` — **only acc-* role that can view contracts** (line 68, 93)
  - `[BRAIN-OUT] authority-dataset/01-roles/acc-admin.md` — `acc.contract.view` deny (line 67)
  - `[BRAIN-OUT] authority-dataset/01-roles/acc-user.md` — `acc.contract.view` deny (line 68)
- PES registry: `[BRAIN-OUT] authority-dataset/03-pes-keys/REGISTRY-RAW.md:84` (`managementConsole.contract.view` — only acc-owner allow); no `adminConsole.contracts.*` cluster exists.
- Status notes:
  - `[BRAIN-OUT] authority-dataset/02-statuses/contract-status.md` — `eContractStatus` (Pending=1 / Active=2 / Expired=3); drives `canEdit` UI logic via `canEditContractStatus()` at `[CODE] contracts.models.ts:579-581` and `hasRestrictedContractCommercialFields()` at `:583-585`
  - `[BRAIN-OUT] authority-dataset/02-statuses/service-status.md` — related `eFalconServiceStatus`; contracts depend on visible services (`marketplace-applications`) and visible channels (`comm-mgmt`) being configured first
- Old-UI source: `[BRAIN-OUT] old-ui-dataset/10-pages/admin-console/contracts-cost-management/00-README.md` through `08-RULES-APPLIED.md` (8 files); cross-app diff at `[BRAIN-OUT] old-ui-dataset/10-pages/management-console/_diffs/contracts-cost-management.diff.md`.
- Hard dependency: `wallet-balance-management` — without a wallet strategy on the selected account, the "Add Contract" button is disabled and `onAddContract()` short-circuits. See sibling compare: `wallet-balance-management.compare.md`.
