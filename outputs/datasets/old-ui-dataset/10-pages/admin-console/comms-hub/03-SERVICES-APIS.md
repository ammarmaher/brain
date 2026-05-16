# Services & APIs — comms-hub

## Services

| Service | File | Scope | Purpose |
|---|---|---|---|
| `CommsHubService` | `apps/admin-console/src/app/features/comms-hub/services/comms-hub.service.ts` | `providedIn: 'root'` | The list endpoint + two unused inline update methods (`updatePriceType`/`updatePriceValue` are dead code in this feature — the component calls `CommerceActionsService` instead). |
| `CommerceActionsService` | `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-actions.service.ts` | `providedIn: 'root'` | Thin pass-through façade around `CommerceGatewayService`. Used by both `comms-hub` and `marketplace-applications`. |
| `CommerceGatewayService` | `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-gateway.service.ts` | `providedIn: 'root'` | The actual HTTP call site for all 12 commerce mutations + the dialog dependency `CommunicationChannelsApiService`. |
| `OrgHierarchyApiService` | `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts` | `providedIn: 'root'` | Tree node loading (root + children). |
| `CommunicationChannelsApiService` | `apps/admin-console/src/app/shared/services/communication-channels-api.service.ts` | `providedIn: 'root'` | Single endpoint — `GET visible-channels` consumed by the priority dialog. |
| `OrderStatusService` | `libs/falcon/src/shared-data-access/lib/services/order-status.service.ts` | `providedIn: 'root'` | Polled inside `onDoPayment` to read order status. |
| `SimplePollService` | `libs/falcon/src/shared-data-access/lib/services/simple-poll.service.ts` | `providedIn: 'root'` | Generic interval-poll with `shouldStop` predicate. Not an HTTP service. |
| `HttpService` | `libs/falcon/src/shared-data-access/lib/services/http.service.ts` | `providedIn: 'root'` | The thin `HttpClient` wrapper every service above uses. Honors `useGateway()` `HttpContext` to suppress `baseURL` prefix so a `RuntimeBaseUrlInterceptor` can resolve per-gateway. |

## HTTP endpoints called

The base path used by every commerce call is `commerce/Node` (relative — final base URL is resolved at runtime via the System Gateway because admin-console is configured with `provideAppDefaultGateway(Gateway.SystemGateway)` — see runtime-config doc reference below).

| # | Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|---|
| 1 | GET | `commerce/Node` | `OrgHierarchyApiService.getRootNodes()` | n/a | `ServiceOperationResult<GetNodeResponse[]>` | `org-hierarchy.api.service.ts:50-69` |
| 2 | GET | `commerce/Node?NodeId={parentId}` | `OrgHierarchyApiService.getChildren(parentId)` | query: `NodeId` (omitted for FALCON_ROOT) | `ServiceOperationResult<GetNodeResponse[]>` | `org-hierarchy.api.service.ts:71-98` |
| 3 | GET | `commerce/Node/{nodeId}/comm-channels` | `CommsHubService.getList(nodeId)` | n/a | `ServiceOperationResult<CommChannelServiceItem[]>` | `comms-hub.service.ts:30-52` |
| 4 | PUT | `commerce/node/comm-channel/visibility` | `CommerceGatewayService.changeCommChannelVisibility(req)` | `ChangeAccountCommunicationChannelServiceVisibilityRequest` `{ accountId, commChannelId, visibility }` | `ServiceOperationResult<Record<string, unknown>>` | `commerce-gateway.service.ts:50-58` |
| 5 | PUT | `commerce/node/comm-channel/price-type` | `CommerceGatewayService.changeCommChannelPriceType(req)` | `ChangeCommunicationChannelPriceTypeRequest` `{ accountId, commChannelId, pricingType, effectiveDate }` | `ServiceOperationResult<Record<string, unknown>>` | `commerce-gateway.service.ts:70-78` |
| 6 | PUT | `commerce/node/comm-channel/price-value` | `CommerceGatewayService.changeCommChannelPriceValue(req)` | `ChangeCommunicationChannelPriceValueRequest` `{ accountId, commChannelId, priceValue }` | `ServiceOperationResult<Record<string, unknown>>` | `commerce-gateway.service.ts:80-88` |
| 7 | POST | `commerce/node/comm-channel/do-payment` | `CommerceGatewayService.doPaymentCommChannel(req)` | `DoPaymentCommunicationChannelRequest` `{ accountId, commChannelId, commChannelPriorityIds? }` | `ServiceOperationResult<Record<string, unknown>>` (carries `orderId`) | `commerce-gateway.service.ts:106-117` |
| 8 | POST | `commerce/node/comm-channel/disable` | `CommerceGatewayService.disableCommChannel(req)` | `DisableCommunicationChannelRequest` `{ accountId, commChannelId }` | `ServiceOperationResult<Record<string, unknown>>` | `commerce-gateway.service.ts:134-140` |
| 9 | POST | `commerce/node/comm-channel/enable` | `CommerceGatewayService.enableCommChannel(req)` | `EnableCommunicationChannelRequest` `{ accountId, commChannelId }` | `ServiceOperationResult<Record<string, unknown>>` | `commerce-gateway.service.ts:142-148` |
| 10 | DELETE | `commerce/node/comm-channel/new-price-type` (body) | `CommerceGatewayService.deleteCommChannelNewPriceType(req)` | `DeleteCommunicationChannelNewPriceTypeRequest` `{ accountId, commChannelId }` (sent as body) | `ServiceOperationResult<Record<string, unknown>>` | `commerce-gateway.service.ts:170-181` |
| 11 | DELETE | `commerce/node/comm-channel/new-price-value` (body) | `CommerceGatewayService.deleteCommChannelNewPriceValue(req)` | `DeleteCommunicationChannelNewPriceValueRequest` `{ accountId, commChannelId }` (sent as body) | `ServiceOperationResult<Record<string, unknown>>` | `commerce-gateway.service.ts:183-194` |
| 12 | GET | `commerce/Node/{nodeId}/comm-channels/visible` | `CommunicationChannelsApiService.getVisibleChannels(nodeId)` | n/a | `ServiceOperationResult<VisibleCommunicationChannelResponse[]>` | `communication-channels-api.service.ts:15-37` |
| 13 | GET | `commerce/Node/order/{orderId}/status` | `OrderStatusService.getOrderStatus(orderId)` | n/a | `ServiceOperationResult<GetOrderStatusResponse>` | `order-status.service.ts:12-26` |

(Also wired in `CommerceGatewayService` but **NOT invoked from the comms-hub feature** — they belong to the parallel applications feature and are excluded from this page's count: `application/visibility`, `application/price-type`, `application/price-value`, `application/do-payment`, `application/disable`, `application/enable`, `application/new-price-type` DELETE, `application/new-price-value` DELETE. Six methods on `CommerceActionsService` are dead code for comms-hub.)

### Counting

- **13 HTTP endpoints** actually hit by this feature.
- One unused endpoint pair lives in `CommsHubService.updatePriceType` and `CommsHubService.updatePriceValue` (lines 57-99). Their URLs `${apiEndpoint}/priceType` (PUT) and `${apiEndpoint}/priceValue` (PUT) resolve to `commerce/Node/priceType` / `commerce/Node/priceValue` — but the component calls `CommerceActionsService.changeCommChannelPriceType/Value` instead, which hits `comm-channel/price-type` / `comm-channel/price-value` paths. [INFERRED] Dead code, possibly an earlier implementation.

### Special headers / context

- **Every request** uses `useGateway()` ([CODE] `runtime-api-config.ts:128-137`) — sets `USE_GATEWAY_CONTEXT=true` on the HttpContext so `HttpService.buildUrl` skips the `baseURL` prefix (`http.service.ts:163-174`). A separate `RuntimeBaseUrlInterceptor` ([INFERRED] from the comment in `runtime-api-config.ts:33-35`) reads the configured `APP_DEFAULT_GATEWAY` and substitutes the correct base URL — `Gateway.SystemGateway` for admin-console.
- `doPaymentCommChannel` adds header `notShowToaster: 'true'` ([CODE] `commerce-gateway.service.ts:112-114`) to suppress global error-toast handling for that endpoint (the feature manages its own dialog flow).

## Base URL resolution

- Admin-console provides `Gateway.SystemGateway` as `APP_DEFAULT_GATEWAY` ([INFERRED] from comment in `runtime-api-config.ts:32` — "admin-console → Gateway.SystemGateway").
- `RuntimeEnvironmentConfig` resolves system gateway URL via `baseURLSystemGateway` ([CODE] `runtime-api-config.ts:18-20`).
- All `commerce/Node/...` paths therefore hit **System Gateway → Core Commerce service**.

## Auth / interceptors

- No interceptors are referenced from this feature directly. [INFERRED] Auth/Tenant headers are added globally in `app.config.ts` of admin-console (not read, out of scope).
- Session context is consumed via `SessionProvider` — `userType`, `tenantId`, `client_id` ([CODE] component line 227, 880-883).

## Backend service mapping

- All `commerce/Node/...` endpoints (entries 1–11, 13) route through **System Gateway → Falcon Core Commerce Service** ([INFERRED] from the URL prefix convention and the admin-console `APP_DEFAULT_GATEWAY = Gateway.SystemGateway`).
- Endpoint 12 (`commerce/Node/{nodeId}/comm-channels/visible`) — same Commerce service ([INFERRED] same URL family).
- Endpoint 13 (order/status) is also Commerce-hosted ([INFERRED] same URL family, NOT a dedicated charging path).
- **There are NO provider integration endpoints** in this feature (no Twilio / SMTP / SendGrid surface). The comms-hub manages commercial subscription state — provider configuration happens elsewhere.
- **There are NO template-related endpoints** in this feature. The "Communication Channel Templates" concept is not joined here.
