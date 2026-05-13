# Commerce Service — Frontend Contract

## Base URLs

| Environment | Direct | Via Core Gateway (Client) | Via System Gateway (Falcon admin) |
|---|---|---|---|
| Local dev | `http://localhost:7045/api` | `https://localhost:7038/commerce/*` | `https://localhost:7256/commerce/*` |
| Prod | n/a (gateway-fronted) | `<core-gateway>/commerce/*` | `<system-gateway>/commerce/*` |

Path transform: gateway strips the `/commerce` prefix and prepends `/api/` before forwarding. So `https://core-gateway/commerce/Node/{id}/applications` → Commerce `/api/Node/{id}/applications`.

## Authentication

`Authorization: Bearer <zitadel-jwt>` required for all endpoints **except**:
- `GET /api/Security/ip-allowlists` (`AllowAnonymous` — east-west)
- `GET /health` (`AllowAnonymous`)

`Authorize(Policy = AuthorizationPolicies.FalconOnly)` is applied per-action on the destructive admin operations (visibility changes, price changes, wallet config, …). These are only callable through the **System Gateway** by Falcon admins; the Core Gateway pass-through wraps them with `ClientOnly` and the policy would reject them anyway.

## Response Wrapper

All endpoints return `ServiceOperationResult<T>`:

```json
{
  "isSuccessful": true,
  "result": { /* T */ },
  "errorMessages": []
}
```

`ErrorMessages` contains **localized** strings (not error codes). HTTP status code is set from `[ErrorHttpStatus(NNN)]` on each `FalconKeys.Error.<Code>` constant — see [`ERRORS.md`](ERRORS.md).

## JSON Serialization

`AddControllers()` uses the default `System.Text.Json` options — **PascalCase** properties on the wire unless overridden. Commerce does not call `JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase` in `Program.cs`. **Important deviation** from Identity / Contact Group / Templates which all use camelCase. Frontend integration with Commerce vs. Identity must account for this.

> Update Notes: confirm casing at runtime — `Microsoft.AspNetCore.Mvc.JsonOptions` may default to camelCase since .NET 6+. Without an explicit `Configure<JsonOptions>(...)` call, the framework default applies. (Default in current versions: camelCase.)

## Pagination

`PagedResponse<T>(List<T> Items, long TotalCount, int PageNumber, int PageSize)` — matches Identity's shape. Query params on listing endpoints (when applicable): `page`, `pageSize`, `search`, plus domain-specific filters.

## Filter Query Params

- Enum fields are passed as **raw integers**: `?currency=1&balanceDistribution=0&walletStructure=2`. The handler parses them with `(eCurrency)currency.Value` casts (no validation that the int is a defined enum value — `[EnumDataType]` is applied on body-bound DTOs only).
- Lookup endpoint: `GET /api/Lookup/{lookupId}?name=&code=` — both `name` and `code` are optional case-insensitive filters; returns `List<Hook<LookupValueResponse>>`.

## Account Hierarchy Cheat-Sheet

The **gateway aggregation** version of this endpoint (`GET /commerce/accounts/{Id}/hierarchy`) is the one the frontend should call — it returns Commerce + Identity + Charging merged data. Direct calls to Commerce return only Commerce data.

Direct: `GET /api/accounts/hierarchy?accountId=...&currency=1&balanceDistribution=0&walletStructure=2`
Returns: `GetAccountHierarchyResponse { AccountId, AccountName, AccountIcon, TenantId, Currency, WalletBalanceType, WalletType, CanSave, CommChannels[], Hierarchy }` where `Hierarchy.SubNodes` is a recursive tree of `AccountHierarchyNodeResponse`.

Notes:
- `TenantId` in the response is used by the gateway to query Identity for user data.
- `WalletBalanceType == eWalletBalanceType.UserBased` triggers the gateway to merge users from Identity into the node tree.
- `CanSave == false` triggers the gateway to fetch wallet balances from Charging.

## Contracts Cheat-Sheet

CRUD pattern:
- `GET /api/Contracts?accountId=...` → list summaries (no tariff plan inline)
- `GET /api/Contracts/{contractId}` → full detail with `TariffPlan { Rates, UnitConversions, Quotas, OverageRates }`
- `POST /api/Contracts` with `CreateContractRequest` → returns `ContractResponse`
- `PUT /api/Contracts/{contractId}` with `UpdateContractRequest` → returns updated `ContractResponse`

Frontend integration:
- Use the **gateway aggregation** version `GET /commerce/contracts` and `GET /commerce/contracts/{contractId}` for read flows — it overlays `RemainingBalance` from Charging.
- Use the direct Commerce CRUD via gateway pass-through (`POST /commerce/Contracts`, `PUT /commerce/Contracts/{id}`) for write flows.
- The aggregation list forces `contract.CanEdit = false` for client users — only Falcon admins can edit contracts (via System Gateway).

## Date/Time Conventions

- `DateTime` fields use ISO-8601 UTC (the standard `System.Text.Json` shape).
- Contract DTOs also surface `StartLocalDateTime`, `EndLocalDateTime`, `BusinessTimeZone` — convenience strings for UI display in the tenant's local time.

## Multi-Language Fields

Per platform standard, `MultiLanguage { En, Ar }` is used for system-managed catalog items — `ApplicationResponse.Name`, `CommunicationChannelResponse.Name`. User-entered account names (`Info.AccountName`) are **single-language strings**, intentional.

## Error Surface for Frontend Display

The frontend should not parse `errorMessages[0]` as an error code — they are already localized. Use the HTTP status code for routing logic:

| Status | Likely UI Action |
|---|---|
| 400 | Show field-level errors next to inputs (use `errorMessages` array) |
| 401 | Trigger re-auth |
| 403 | Display "not allowed" toast |
| 404 | Display "not found" page |
| 409 | Display conflict toast (e.g. "duplicate name") |
| 422 | Display business-rule toast |
| 423 | Display "user locked" message |
| 429 | Display "too many attempts, try again" |
| 5xx | Display generic "something went wrong" toast |

## CORS

`Cors:AllowedOrigins` per appsettings — only `http://localhost:4200` in dev (no production origins committed; must be set per environment).

## OpenAPI / Swagger

Development only:
- Swagger UI at `https://localhost:7045/swagger`
- OpenAPI JSON at `https://localhost:7045/swagger/v1/swagger.json`
- BearerAuth security scheme is wired up so you can paste a JWT and try endpoints in Swagger UI.

## Deviations from Platform Standards (Frontend Impact)

| Standard | Status | Frontend Implication |
|---|---|---|
| **`ServiceOperationResult<T>` shape** | Conforms (struct in `Falcon.Commerce.Contracts`) | None |
| **camelCase JSON** | Most likely conforms (framework default), but **not explicitly configured** — Identity / FastEndpoints services *are* explicit | Test serialization shapes before relying on case |
| **MultiLanguage(En, Ar)** | Partial — catalog responses yes, account/contract names no | Display user-entered names directly; treat catalog `name` as `{ en, ar }` |
| **Camel-case route names** | **Deviation.** Routes use PascalCase controller names: `/api/Node`, `/api/CommunicationChannel`, `/api/Setting`, `/api/Information`. Other services use kebab-case (`/api/contact-groups`, `/api/communication-channel-configs`) or lowercase (`/api/user`, `/api/auth`). Frontend HttpClient base URLs must match exactly. | Use exact casing when building URLs |
