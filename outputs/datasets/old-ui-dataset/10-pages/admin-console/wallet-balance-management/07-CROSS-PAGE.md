# Cross-page dependencies — wallet-balance-management

## Inbound (this feature depends on)

### From `@falcon` library (`libs/falcon`)
| Import | File / Symbol | Use |
|---|---|---|
| `AccessControlFacade` | `libs/falcon/src/core/lib/access-control/access-control.facade.ts` | PES — resolves the 4 wallet permissions ([[05-PES]]) |
| `FalconAccess` | `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` | permission key constructors |
| `TranslateService` + `TranslatePipe` | `libs/falcon/src/language/lib/*` | i18n |
| `SvgIconComponent` + `SVG_ICON_NAMES` | `libs/falcon/.../svg-icon/` ([INFERRED] not opened) | icons (TRANSFER, CURRENCY_SAR) |
| `SessionProvider` | `libs/falcon/src/core/lib/services/session-provider.service.ts` | reads `session.userType` → `isFalcon` flag |
| `USER_TYPE_STRINGS` | `libs/falcon/src/shared-types/lib/constants/user-type.constants.ts` | enum for FALCON_USER |
| `FalconIconComponent` | `libs/falcon/.../falcon-icon/` ([INFERRED]) | building/icon-by-name renderer |
| `FALCON_ROOT_NODE` | constant for synthetic Falcon root in org tree | tree root + save-guard |
| `OrganizationHierarchyTreeComponent` | `libs/falcon/src/shared-ui/lib/components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts` | left tree panel |
| `ServiceOperationResult` | `libs/falcon/src/shared-types/lib/models/service-operation-result.model.ts` | response wrapper |
| `getCssVariable` | `libs/falcon/.../utils` ([INFERRED]) | resolves `--color-text` / `--color-primary` at runtime for SVG icon colors |
| `useGateway` | `libs/falcon/src/shared-data-access/lib/runtime-config/runtime-api-config.ts:128` | sets `USE_GATEWAY_CONTEXT` so the interceptor routes through SystemGateway |
| `DrawerComponent` (`<app-drawer>`) | `libs/falcon/src/shared-ui/lib/components/drawer/drawer.component.ts` | shared right-side drawer used by `BalanceTransferComponent` |
| `shellAccessGuard` | `libs/falcon/src/core/lib/access-control/shell-access.guard.ts` | route guard (no-op here — no `data.access`) |
| `adminConsoleGuard` | `libs/falcon/src/core/lib/guards/admin-console.guard.ts` | parent route guard |

### From sibling features
| Import | File | Use |
|---|---|---|
| `OrgHierarchyApiService` | `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts:28` | loads root + children for the left tree |
| `OrgHierarchyNode` | `apps/admin-console/src/app/features/organization-hierarchy/models/org-hierarchy.models.ts` | node model |
| `mapOrgNodeToTreeNode`, `updateTreeNodeChildren` | `apps/admin-console/src/app/features/organization-hierarchy/utils/org-hierarchy.mapper.ts` | shape OrgHierarchyNode → PrimeNG `TreeNode` |

### From `primeng`
| Import | Use |
|---|---|
| `TreeNode`, `MessageService` (from `primeng/api`) | tree node typing + toast service |
| `ToastModule` | toast UI |
| `AutoCompleteModule` / `SelectModule` / `InputTextModule` / `InputNumberModule` / `TextareaModule` | transfer drawer controls |

### From `@angular`
| Import | Use |
|---|---|
| `@angular/common` → `CommonModule`, `DecimalPipe` | template directives + number pipe |
| `@angular/forms` → `FormsModule` | `[(ngModel)]` |
| `@angular/common/http` → `HttpClient`, `HttpParams` | HTTP |
| `rxjs` / `rxjs/operators` | `BehaviorSubject`, `combineLatest`, `firstValueFrom`, `tap`, `switchMap`, `of`, `skip`, `catchError`, `finalize`, `map`, `distinctUntilChanged`, `takeUntilDestroyed` |

## Outbound (other features depend on this)

[CODE] Searched repo — `WalletBalanceService`, `WalletBalanceManagementComponent`, `BalanceTransferComponent`, `IWalletDataResponse`, `IWalletSummary`, `ITransferRequest`, `Currency` from this feature are not imported from any other feature folder. The feature is a leaf.

| Outbound consumer | Symbol exposed | Notes |
|---|---|---|
| — | — | No other features import any symbol from `apps/admin-console/.../wallet-balance-management/`. |

**The page is a sink. No outbound contributions to other features.**

## Shared state
- **Reads (in-memory only):** `SessionProvider.session?.userType` (no observable wrapper used)
- **Writes (in-memory only):** none — no global stores updated
- **Persistent state:** never — the page reads from backend on every node-select / filter change, writes only via Save / Transfer endpoints
- **Snapshot/draft maps:** component-local (`Map<DraftKey, number|null>`)
- **No NgRx, no `@ngrx/signals`, no shared service singletons mutated.**

## Navigation entry points
- **Menu item** — host-shell layout sidebar / breadcrumb registers admin-console routes. Effective href: `<admin-console-base>/wallet-balance-management`. Breadcrumb: `'Wallet & Balance Management'` ([CODE] `apps/admin-console/src/app/features/routes.ts:59`).
- **Deep links** — none with parameters; no `:id` or query params. The selected node is held in-component state (`selectedOrgNodeId`).
- **Cross-page navigation FROM this page** — none. The page does not `router.navigate` anywhere. Once landed, the user only triggers loads/saves/transfers and stays on the page.

## Cross-page coupling risks (for the rebuild)

1. **`OrgHierarchyApiService` is in `features/organization-hierarchy/`** — wallet-balance imports across features. In a rebuild this service should be moved to a shared `data-access` lib (`libs/.../node`) and not held in a sibling feature folder.

2. **`mapOrgNodeToTreeNode` / `updateTreeNodeChildren` utils** — same problem: shared utility behavior split across feature `utils/` folders.

3. **`FALCON_ROOT_NODE` constant** — synthetic root for Falcon user view is in `@falcon`. The wallet save endpoint REJECTS this ID. [INFERRED] The same constraint applies to other features (org-hierarchy, marketplace-applications) — there is no shared helper `isFalconRoot(id)`, every feature open-codes the comparison.

4. **`SVG_ICON_NAMES` constants from `@falcon`** — `TRANSFER`, `CURRENCY_SAR` — these specific icons would change if SAR symbol is replaced or transfer iconography updates. The container hard-references them.

5. **`<falcon-organization-hierarchy-tree>` API surface** — 12 input props + 3 output events are bound by the container. Any breaking change to this component's surface breaks all 3 admin-console pages using it (org-hierarchy, marketplace-applications, wallet-balance-management).

6. **PrimeNG-coupled drawer** — `BalanceTransferComponent` is built on PrimeNG primitives (autoComplete + select + inputNumber + textarea). [INFERRED] The new theme migration (per project rules) is on a "PrimeNG total removal" track — every one of these controls would need to be replaced with `<falcon-*>` equivalents.
