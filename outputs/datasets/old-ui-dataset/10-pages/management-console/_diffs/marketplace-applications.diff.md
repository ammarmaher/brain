# DIFF — marketplace-applications (management-console vs admin-console)

> Mgmt-console version: `apps/management-console/src/app/features/marketplace-applications/`
> Admin-console version: `apps/admin-console/src/app/features/marketplace-applications/`

## Routing diff
| Path | Admin-console | Management-console | Why |
|---|---|---|---|
| Path slug | `marketplace-applications` | `marketplace-applications` | Same URL |
| Component loader | `loadComponent` (lazy) | `component: MarketplaceApplicationsComponent` (synchronous) | Mgmt uses synchronous imports across features |
| Guard | `shellAccessGuard` | `shellAccessGuard` | Same |
| PBAC key | **No `data.access`** | `data.access = FalconAccess.managementConsole.services.view()` | Mgmt enforces the services-view permission |

## Component diff

- **`MarketplaceApplicationsComponent`** — present in both apps with very similar structure (card/list view, filter, payment processing, insufficient-balance dialogs).

### Mgmt-only ergonomics
- Mgmt component opens an "AI Agent Builder" route: `openAiAgentBuilder() { this.router.navigate(['../ai-agent'], ...) }` (`marketplace-applications.component.ts:216-218`). This route is **declared but not implemented** in mgmt routes (the routes file only contains `marketplace-applications` root). Dead code, future placeholder.
- Mgmt component reads brand info from `SessionProvider.node?.label` / `.url` — implies a server-side resolved node at session time. Admin's equivalent — likely the same.

### Identical features
- Status pill rendering (active / inactive / disabled / expired)
- ViewMode persistence (`marketplaceAppsViewMode` localStorage key in mgmt; admin uses a different key but same logic)
- `loadingRowIds` array tracking row processing
- Backend-driven `allowedActions` array gates row menus
- Payment confirmation → polling flow identical (same `SimplePollService.watch` pattern from `@falcon`)
- Three failure-handling branches: `WalletNotConfigForTheNode`, `CommChannelPriorityOrderRequired`, `InsufficientFunds`

## Service / API diff

### Both apps call the SAME list endpoint
| Method | URL | Service | Notes |
|---|---|---|---|
| GET | `commerce/Node/{nodeId}/applications` | `MarketplaceApplicationsService.getList(nodeId)` | Identical — both versions |

### Mock-on-error divergence (subtle)
- Mgmt service's `updatePriceType/updatePriceValue` (`management-console/.../marketplace-applications.service.ts:55-99`) returns **mock data on error** via `catchError(() => of({ id, ... }))`. Same anti-pattern in admin-console version.

### Mutation endpoints — SAME (delegated to CommerceActionsService)
Both versions import from `account-administration/organization-hierarchy/components/tabs-layout/components/service/commerce-actions.service.ts`:
- `commerce-actions.service.ts:doPaymentApplication` (POST `commerce/node/application/do-payment`)
- `commerce-actions.service.ts:disableApplication` (POST `commerce/node/application/disable`)
- `commerce-actions.service.ts:enableApplication` (POST `commerce/node/application/enable`)

### Different gateway routing
- Admin → System Gateway
- Mgmt → Core Gateway

## DTO diff
- **`MarketplaceApplicationItem`** (mgmt: `models/models.ts:11-36`) extends `AppServiceItem`-like shape with UI-extras: `subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`. Admin's `AppServiceItem` is leaner (no UI-extras).
- `UpdateMarketplacePriceTypeRequest/Response` + `UpdateMarketplacePriceValueRequest/Response` — present in mgmt; admin uses generic `UpdateAppPriceType*` from organization-hierarchy.

## PES diff
| Aspect | Admin-console | Management-console |
|---|---|---|
| Route PBAC key | none | `FalconAccess.managementConsole.services.view()` |
| Component-level flags | None (relies on `row.allowedActions` from backend) | None (relies on `row.allowedActions` from backend) |
| Permission namespace | `adminConsole.*` not used here | `managementConsole.*` (one key) |

**Note**: the components themselves do not call `AccessControlFacade` in either app — row gating is backend-driven via `allowedActions` array. The only PBAC interaction is the route guard.

## Other architectural diff
- Mgmt-console resolves account ID from session as `session.tenantId || session.client_id` (Client user identifier). Admin's version likely uses a different accountId source (selectedNode from org tree).
- Both apps are module-federation remotes; not hosts.
- Mgmt-console imports `InsufficientBalancePriorityDialogComponent` + `InsufficientBalanceWarningDialogComponent` from `apps/management-console/src/app/shared/components/` (app-level shared). Admin imports similar dialogs from its own shared folder.
- Mgmt component's `MarketplaceApplicationsComponent` is verbose (886 lines) — identical card/list/payment-poll logic duplicated with `CommsHubComponent`. **Refactoring candidate**: extract shared card-list-with-actions + payment-confirmation pattern into a base class or composition.
