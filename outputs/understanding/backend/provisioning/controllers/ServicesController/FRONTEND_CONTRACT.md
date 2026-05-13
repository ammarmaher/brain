# ServicesController — Frontend Contract

## Public URLs

Via **Core Gateway** (client users):

```
GET  /provisioning/Services/account/{accountId}/comm-channels
GET  /provisioning/Services/account/{accountId}/applications
```

Via **System Gateway** (Falcon admins):

```
GET  /provisioning/Services/account/{accountId}/comm-channels
GET  /provisioning/Services/account/{accountId}/applications
POST /provisioning/Services/create-account-services
PUT  /provisioning/Services/account/comm-channel/visibility
PUT  /provisioning/Services/account/application/visibility
```

## Authentication

`Authorization: Bearer <jwt>` required.

`FalconOnly` policy enforced on the 3 mutators — client users see HTTP 403 if they call them through the System Gateway path. Through the Core Gateway path, the YARP `ClientOnly` policy would also block the request.

## Response Wrapper

All endpoints return `ServiceOperationResult<T>`.

## Frontend Patterns

### Build the services table for an account

```typescript
// Pull both lists in parallel
const [cc, apps] = await Promise.all([
  api.get(`/provisioning/Services/account/${accountId}/comm-channels`),
  api.get(`/provisioning/Services/account/${accountId}/applications`),
]);

// For each row, render:
//   - service name (resolve via Commerce catalog)
//   - status (eProductSubscriptionStatus)
//   - visibility toggle (disabled if !canHide)
//   - actions menu (filter by availableActions)
```

### Toggle visibility (Falcon admin only — via System Gateway)

```typescript
await api.put('/provisioning/Services/account/comm-channel/visibility', {
  accountId: 'acct-1',
  commChannelId: 'cc-whatsapp',
  visibility: false
});
```

Backend returns the new visibility state echoed in `ChangeAccountCommunicationChannelServiceVisibilityResponse`. If the service was Active when `visibility:false` was requested → HTTP 422 with `CannotHideActiveService`.

### Provision services (machine-to-machine — usually not called from frontend)

`POST /provisioning/Services/create-account-services` is normally called by Commerce as part of the account creation orchestration. If the frontend needs to expose a manual "Provision missing services" admin button (Falcon-only), it should POST the full list of (`CommChannelId | ApplicationId`, `AccountId`, `TenantId`, `Status`, `Visibility`) per service.

## Currency / Pricing

Provisioning doesn't carry pricing. Use Commerce's `GET /commerce/Node/{id}/comm-channels` and `GET /commerce/Node/{id}/applications` to get per-account pricing — these endpoints return:
- `AccountCommunicationChannelResponse` / `AccountApplicationResponse`
- Each containing pricing type, price value, effective date, etc.

## Eventual Consistency Note

After `CreateAccountServices`, the new subscription records are immediately readable from Provisioning. But there's a downstream Kafka chain: Commerce publishes `commerce.wallet-configured.v1` → Charging materializes wallets. The frontend should not assume wallets exist immediately after provisioning — poll Charging's `GET /charging/Wallet/contract-balance-summaries` until the wallet appears.

## CORS

Empty in `appsettings.json`. Set per environment.

## Headers

`Authorization: Bearer <jwt>` only.

## OpenAPI / Swagger

In dev: `https://localhost:7163/swagger`.

## Multi-Language

None on this controller. Frontend resolves service names via Commerce catalog endpoints.

## Deviations

| Standard | Status |
|---|---|
| `ServiceOperationResult<T>` | Conformant |
| Route casing | PascalCase route token (`/Services`), kebab-case sub-paths |
| `Respose` typo in response DTO class names | Cosmetic; JSON wire shape unaffected (camelCase property names) |
| MultiLanguage | Available, unused |
| East-west call between services going over HTTP from Commerce → Provisioning | **Architectural violation** per Wiki ("internal services NEVER call each other through gateways — use gRPC/Kafka directly"). Here it's direct HTTP, not gateway-routed, so the Wiki rule is technically satisfied — but the Wiki also recommends gRPC over HTTP for east-west. Flagged. |
