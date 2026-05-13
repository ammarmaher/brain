# Provisioning Service — Frontend Contract

## Base URLs

| Environment | Direct | Via Core Gateway (Client) | Via System Gateway (Falcon admin) |
|---|---|---|---|
| Local dev | `https://localhost:7163/api` | `https://localhost:7038/provisioning/*` | `https://localhost:7256/provisioning/*` |
| Prod | n/a (gateway-fronted) | `<core-gateway>/provisioning/*` | `<system-gateway>/provisioning/*` |

Path transform: gateway strips `/provisioning` and prepends `/api/`. So `https://core-gateway/provisioning/Services/account/{id}/applications` → Provisioning `/api/Services/account/{id}/applications`.

## Authentication

`Authorization: Bearer <zitadel-jwt>` required for all endpoints **except** `/health`.

`FalconOnly` policy enforced on:
- `POST /Services/create-account-services`
- `PUT /Services/account/comm-channel/visibility`
- `PUT /Services/account/application/visibility`

Client users can only call the GET endpoints.

## Response Wrapper

All endpoints return `ServiceOperationResult<T>`.

## Typical Frontend Flows

### Display services for an account

```typescript
// Comm channels
const cc = await api.get('/provisioning/Services/account/acct-1/comm-channels');
// Apps
const apps = await api.get('/provisioning/Services/account/acct-1/applications');
```

Both responses are arrays of per-service projections containing:
- `commChannelId` / `applicationId`
- `visibility` (boolean)
- `status` (eProductSubscriptionStatus)
- `canHide` (boolean — frontend uses this to enable/disable the "Hide" button)
- `availableActions` (array of `eFalconServiceAction` ints — frontend renders only the actions the user can perform)

### Toggle visibility (Falcon admin only)

```typescript
await api.put('/provisioning/Services/account/comm-channel/visibility', {
  accountId: 'acct-1',
  commChannelId: 'cc-whatsapp',
  visibility: false
});
```

If `visibility: false` but the service is active → 422 with `CannotHideActiveService`.

### Provision services for a new account (Falcon admin only — typically machine-to-machine)

```typescript
await api.post('/provisioning/Services/create-account-services', {
  communicationChannelServices: [
    { accountId: 'acct-1', tenantId: 'tenant-1', commChannelId: 'cc-sms', status: 1, visibility: true }
  ],
  applicationServices: [
    { accountId: 'acct-1', tenantId: 'tenant-1', applicationId: 'app-msg', status: 1, visibility: true }
  ]
});
```

In practice this is called by **Commerce** (the `CreateMainNodeProcess`) over HTTP — not the frontend.

## Pagination

None of the Provisioning endpoints are paginated. The full list is returned in one shot per account.

## Multi-Language

No multi-language fields in Provisioning responses. The `commChannelId` and `applicationId` are opaque ids — frontend resolves names via Commerce's `GET /commerce/Application` and `GET /commerce/CommunicationChannel` (which **do** return MultiLanguage names — verify per Commerce DTO_DICTIONARY).

## Currency / Pricing

Provisioning does **not** carry pricing data — that lives in Commerce (`NodeController.GetAccountCommunicationChannels` returns per-account pricing). Frontend integration:

- Provisioning: visibility + status + available actions
- Commerce: pricing details

These two read flows can be combined on the frontend, or you can use the **gateway aggregation** `/commerce/accounts/{id}/hierarchy` which merges Commerce + Identity + Charging data (Provisioning data is **not** included in that aggregation — Provisioning is queried separately).

## Cross-Service Drift Notes

`ChangeAccountCommunicationChannelServiceVisibilityRequest` exists in both Commerce contracts and Provisioning contracts with the same shape. The Commerce endpoint (`PUT /commerce/Node/comm-channel/visibility`) likely calls the Provisioning endpoint internally via HTTP (verify in `CreateMainNodeProcess` and visibility handlers). Frontend should use the **Commerce** endpoint as the canonical entry point — Provisioning's endpoint is for internal use even though it's reachable through the gateway.

## OpenAPI / Swagger

In dev:
- Swagger UI at `https://localhost:7163/swagger`
- OpenAPI JSON at `https://localhost:7163/swagger/v1/swagger.json`

## Deviations

| Standard | Status |
|---|---|
| `ServiceOperationResult<T>` | Conformant |
| Route casing | PascalCase `/api/Services`, `/api/Lookup` with kebab-case sub-paths |
| MultiLanguage | Available, unused |
| Typo `Respose` (instead of `Response`) | Present in two response DTO class names — wire impact minimal (just the JSON key, which is camelCase) but a rename is overdue |
