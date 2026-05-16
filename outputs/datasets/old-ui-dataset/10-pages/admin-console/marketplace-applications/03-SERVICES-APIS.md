# Services & APIs — marketplace-applications

> THIS IS THE CRITICAL BACKEND-INTEGRATION FILE.

## Services
| Service | File | Singleton? | Purpose |
|---|---|---|---|
| `MarketplaceApplicationsService` | `apps/admin-console/src/app/features/marketplace-applications/services/marketplace-applications.service.ts:17-54` | `providedIn: 'root'` | Single list endpoint — `getList(nodeId)` for the right-side table |
| `CommerceActionsService` (SHARED) | `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-actions.service.ts:42-153` | `providedIn: 'root'` | Thin facade over `CommerceGatewayService` — exposes 16 mutation methods (8 for applications + 8 for comm-channels) |
| `CommerceGatewayService` (SHARED) | `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-gateway.service.ts:42-217` | `providedIn: 'root'` | All HTTP calls under `commerce/node/*` for product lifecycle (visibility / payment / pricing / enable / disable / delete-pending) |
| `OrgHierarchyApiService` (SHARED) | `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts:30-141` | `providedIn: 'root'` | Tree data — `getRootNodes`, `getChildren` |
| `OrderStatusService` (@falcon) | `libs/falcon/src/shared-data-access/lib/services/order-status.service.ts` | `providedIn: 'root'` | Polls async order status |
| `SimplePollService` (@falcon) | `libs/falcon/src/shared-data-access/lib/services/simple-poll.service.ts` | `providedIn: 'root'` | Generic polling — used for payment-order status |
| `CommunicationChannelsApiService` (SHARED) | `apps/admin-console/src/app/shared/services/communication-channels-api.service.ts:11-38` | `providedIn: 'root'` | `commerce/Node/{id}/comm-channels/visible` — for priority dialog |

## Base URL resolution
Same as contracts — `HttpService` + `useGateway()` HttpContext → admin-console's default gateway = **System Gateway** → routes to backend services. [INFERRED] `commerce/*` → Commerce; `charging/*` → Charging.

## HTTP endpoints called

### List (Falcon Core Commerce Service — Node Controller)
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET | `commerce/Node/{nodeId}/applications` | `MarketplaceApplicationsService.getList(nodeId)` | n/a | `ServiceOperationResult<AppServiceItem[]>` (raw also exposes `availableActions: FalconRowAction[]`) | `marketplace-applications.service.ts:26-44` |

### Visibility (per-app/per-channel, Falcon Core Commerce Service)
| Method | URL pattern | Service.Method | Request | Response | Source file:line |
|---|---|---|---|---|---|
| PUT  | `commerce/node/application/visibility`        | `CommerceGatewayService.changeApplicationVisibility(req)`  | `ChangeAccountApplicationServiceVisibilityRequest`     | `Record<string, unknown>`     | `commerce-gateway.service.ts:60-68` |
| PUT  | `commerce/node/comm-channel/visibility`        | `CommerceGatewayService.changeCommChannelVisibility(req)`  | `ChangeAccountCommunicationChannelServiceVisibilityRequest` | `Record<string, unknown>`     | `commerce-gateway.service.ts:50-58` |

### Pricing (per-app/per-channel)
| Method | URL pattern | Service.Method | Request | Response | Source file:line |
|---|---|---|---|---|---|
| PUT  | `commerce/node/application/price-type`         | `CommerceGatewayService.changeApplicationPriceType(req)`    | `ChangeApplicationPriceTypeRequest`             | `Record<string, unknown>`     | `commerce-gateway.service.ts:90-96` |
| PUT  | `commerce/node/application/price-value`        | `CommerceGatewayService.changeApplicationPriceValue(req)`   | `ChangeApplicationPriceValueRequest`            | `Record<string, unknown>`     | `commerce-gateway.service.ts:98-104` |
| PUT  | `commerce/node/comm-channel/price-type`        | `CommerceGatewayService.changeCommChannelPriceType(req)`    | `ChangeCommunicationChannelPriceTypeRequest`    | `Record<string, unknown>`     | `commerce-gateway.service.ts:70-78` |
| PUT  | `commerce/node/comm-channel/price-value`       | `CommerceGatewayService.changeCommChannelPriceValue(req)`   | `ChangeCommunicationChannelPriceValueRequest`   | `Record<string, unknown>`     | `commerce-gateway.service.ts:80-88` |

### Payment (per-app/per-channel)
| Method | URL pattern | Service.Method | Request | Response | Source file:line |
|---|---|---|---|---|---|
| POST | `commerce/node/application/do-payment`         | `CommerceGatewayService.doPaymentApplication(req)`          | `DoPaymentApplicationRequest`                   | `Record<string, unknown>` (`{ orderId }`) | `commerce-gateway.service.ts:119-132` |
| POST | `commerce/node/comm-channel/do-payment`        | `CommerceGatewayService.doPaymentCommChannel(req)`          | `DoPaymentCommunicationChannelRequest`          | `Record<string, unknown>` (`{ orderId }`) | `commerce-gateway.service.ts:106-117` |

Both add a custom header `notShowToaster: 'true'` so the global error interceptor does not flash a toast (the page handles its own toaster for payment errors).

### Enable / Disable (per-app/per-channel)
| Method | URL pattern | Service.Method | Request | Response | Source file:line |
|---|---|---|---|---|---|
| POST | `commerce/node/application/enable`             | `CommerceGatewayService.enableApplication(req)`             | `EnableApplicationRequest`                      | `Record<string, unknown>`     | `commerce-gateway.service.ts:160-168` |
| POST | `commerce/node/application/disable`            | `CommerceGatewayService.disableApplication(req)`            | `DisableApplicationRequest`                     | `Record<string, unknown>`     | `commerce-gateway.service.ts:150-158` |
| POST | `commerce/node/comm-channel/enable`            | `CommerceGatewayService.enableCommChannel(req)`             | `EnableCommunicationChannelRequest`             | `Record<string, unknown>`     | `commerce-gateway.service.ts:142-148` |
| POST | `commerce/node/comm-channel/disable`           | `CommerceGatewayService.disableCommChannel(req)`            | `DisableCommunicationChannelRequest`            | `Record<string, unknown>`     | `commerce-gateway.service.ts:134-140` |

### Delete Pending Pricing (per-app/per-channel)
| Method | URL pattern | Service.Method | Request | Response | Source file:line |
|---|---|---|---|---|---|
| DELETE | `commerce/node/application/new-price-type`     | `CommerceGatewayService.deleteApplicationNewPriceType(req)`   | `DeleteApplicationNewPriceTypeRequest` (sent in `body`)     | `Record<string, unknown>`     | `commerce-gateway.service.ts:196-205` |
| DELETE | `commerce/node/application/new-price-value`    | `CommerceGatewayService.deleteApplicationNewPriceValue(req)`  | `DeleteApplicationNewPriceValueRequest` (sent in `body`)    | `Record<string, unknown>`     | `commerce-gateway.service.ts:207-216` |
| DELETE | `commerce/node/comm-channel/new-price-type`    | `CommerceGatewayService.deleteCommChannelNewPriceType(req)`   | `DeleteCommunicationChannelNewPriceTypeRequest` (in `body`) | `Record<string, unknown>`     | `commerce-gateway.service.ts:170-181` |
| DELETE | `commerce/node/comm-channel/new-price-value`   | `CommerceGatewayService.deleteCommChannelNewPriceValue(req)`  | `DeleteCommunicationChannelNewPriceValueRequest` (in `body`) | `Record<string, unknown>`     | `commerce-gateway.service.ts:183-194` |

### Visible Comm-Channels lookup (used by priority dialog)
| Method | URL pattern | Service.Method | Request | Response | Source file:line |
|---|---|---|---|---|---|
| GET | `commerce/Node/{nodeId}/comm-channels/visible` | `CommunicationChannelsApiService.getVisibleChannels(nodeId)` | n/a | `ServiceOperationResult<VisibleCommunicationChannelResponse[]>` (PascalCase keys mapped from possible camelCase) | `communication-channels-api.service.ts:15-37` |

### Order status (Falcon Core Charging Service — polled)
| Method | URL pattern | Service.Method | Request | Response | Source file:line |
|---|---|---|---|---|---|
| GET | (depends on `OrderStatusService` implementation) | `OrderStatusService.getOrderStatus(orderId)` | n/a (orderId in path) | `GetOrderStatusResponse` | invoked at `marketplace-applications.component.ts:438` |

`GetOrderStatusResponse` shape (`libs/falcon/src/shared-types/lib/models/order-status.models.ts:3-7`):
```typescript
interface GetOrderStatusResponse {
  status: ProcessState;                       // Pending=1 | Running=2 | Completed=3 | Failed=4
  failureReason?: OrderFailureReason | null;  // None=0 | InsufficientFunds=1 | CommChannelPriorityOrderRequired=2 | WalletNotConfigForTheNode=3
  walletType: WalletType;                     // SingleWallet=1 | MultipleWallets=2
}
```

### Tree data
| Method | URL pattern | Service.Method | Request | Response | Source file:line |
|---|---|---|---|---|---|
| GET | `commerce/Node`                     | `OrgHierarchyApiService.getRootNodes()`            | n/a                          | `ServiceOperationResult<GetNodeResponse[]>` | `org-hierarchy.api.service.ts:50-69` |
| GET | `commerce/Node?NodeId={parentId}`  | `OrgHierarchyApiService.getChildren(parentId)`     | HttpParams `NodeId` (optional) | `ServiceOperationResult<GetNodeResponse[]>` | `org-hierarchy.api.service.ts:71-98` |

## Total endpoint count

**Per this feature** (page uses both application + comm-channel pathways via shared mutation services, even though page itself only shows applications):

- **Direct calls from `MarketplaceApplicationsComponent`** — 9 endpoints:
  1. GET `commerce/Node/{nodeId}/applications` (list)
  2. PUT `commerce/node/application/visibility`
  3. PUT `commerce/node/application/price-type`
  4. PUT `commerce/node/application/price-value`
  5. POST `commerce/node/application/do-payment`
  6. POST `commerce/node/application/enable`
  7. POST `commerce/node/application/disable`
  8. DELETE `commerce/node/application/new-price-type`
  9. DELETE `commerce/node/application/new-price-value`
- Plus order-status polling endpoint (charging service) — 1
- Plus tree-data endpoints (commerce/Node, commerce/Node?NodeId=…) — 2 (via OrgHierarchyApiService)
- Plus `commerce/Node/{id}/comm-channels/visible` from the priority dialog — 1
- Plus 6 sibling **comm-channel mirror endpoints** — exposed via the same shared `CommerceActionsService`, **but not called from this feature** (called from `comms-hub`).

**Total endpoints reachable from this page's UI flow: ~13** (9 application + 1 list + 1 polling + 1 channel-list + 1 tree-root + 1 tree-children = 14, with overlap).

## Auth / interceptors
- Same auth + base-url interceptors as the rest of the platform.
- `notShowToaster: 'true'` custom request header on `do-payment` POSTs to suppress global error toasts.

## Backend service mapping
| Endpoint prefix | Backend service |
|---|---|
| `commerce/Node/*/applications` (GET) | Falcon Core Commerce Service |
| `commerce/node/application/*` (PUT/POST/DELETE) | Falcon Core Commerce Service |
| `commerce/Node/*/comm-channels/visible` (GET) | Falcon Core Commerce Service |
| `commerce/Node`, `commerce/Node?NodeId=` (GET, tree) | Falcon Core Commerce Service |
| Order status (polling) | Falcon Core Charging Service (mediated through Commerce → Charging Kafka chain or direct routing — see platform CLAUDE.md) |

[INFERRED] Casing inconsistency: list endpoint uses PascalCase `commerce/Node`; mutation endpoints use lowercase `commerce/node`. Per ASP.NET routing this is case-insensitive but worth noting for the new theme — consolidate to one casing.

## Polling specs
`SimplePollService.watch({...})` (line 437-443):
- `intervalSeconds: 2`
- `maxDurationMinutes: 30`
- `shouldStop: x => x?.status === ProcessState.Completed || x?.status === ProcessState.Failed`

So a payment may take up to 30 minutes to complete. The component handles all 4 terminal statuses + 2 failure-reason sub-states.

## Side-effects after each mutation
Every successful mutation calls `loadData()` to re-fetch the list. No optimistic UI. Failed visibility-change reverts the local `row.visibility` value (line 601).

## Error handling
- `MarketplaceApplicationsService.getList(nodeId)` does NOT use `unwrap()` — directly reads `res.result` and falls through with `[]` on error. (Compare with contracts which throws on `!isSuccessful`.) This is inconsistent.
- All other mutation calls funnel errors through the standard `error: () => { messageService.add({severity:'error', ...}) }` pattern.
- Payment polling uses `catchError(() => { ... return EMPTY; })` to swallow polling failures (lines 506-510).
