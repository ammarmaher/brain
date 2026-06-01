# LookupController — Frontend Contract

## Public URLs

Via **Core Gateway** (client users):

```
GET /charging/Lookup/{id}
GET /charging/Lookup/{id}?name=foo
GET /charging/Lookup/{id}?code=PREFIX
GET /charging/Lookup/{id}?name=foo&code=PREFIX
```

Via **System Gateway** (Falcon admins) — same paths with `<system-gateway>/charging/...` prefix. There is no tenant-scoping on this endpoint: any authenticated user can query any lookup.

## Headers

| Header | Required | Effect |
|---|---|---|
| `Authorization: Bearer <jwt>` | yes | Class-level `[Authorize]` |
| `Accept-Language` | recommended | Drives En/Ar resolution of `hook.name` via `ITranslateHelper.GetTranslation(MultiLanguageName)` |

If `Accept-Language` is omitted, `ITranslateHelper` falls back to a service-side default — likely English. Verify with operator if Arabic should be the FE-side default for Saudi-deployment.

## Response Envelope

```jsonc
{
  "isSuccessful": true,
  "errorMessages": [],
  "result": [
    {
      "value": { "id": "65ad3e2f1c8b0e0001a3c2f5", "code": "ACTIVE" },
      "name": "Active"
    },
    {
      "value": { "id": "65ad3e2f1c8b0e0001a3c2f6", "code": "EXPIRED" },
      "name": "Expired"
    }
  ]
}
```

## Display Pattern: Dropdown / Select

```typescript
type LookupValue = { id: string; code: string };
type Hook<T> = { value: T; name: string };

const response = await api.get<ServiceOperationResult<Hook<LookupValue>[]>>(
  `/charging/Lookup/${lookupId}`,
  { headers: { 'Accept-Language': i18n.lang } }
);

const options = response.data.result.map(hook => ({
  label: hook.name,                   // localized display
  value: hook.value.id,               // persisted key
  code: hook.value.code               // business key
}));
```

The pattern matches Commerce's `LookupController` and any Falcon Angular `<falcon-angular-dropdown>` directly.

## Filter Patterns

| User Intent | Query | Server Filter |
|---|---|---|
| List all entries in a lookup | `GET /charging/Lookup/{id}` | (none) |
| Autocomplete on display name | `GET /charging/Lookup/{id}?name=in` | `Name.En.Contains('in') \|\| Name.Ar.Contains('in')` |
| Code prefix lookup | `GET /charging/Lookup/{id}?code=ACT` | `Code.StartsWith('ACT')` |
| Combined | `GET /charging/Lookup/{id}?name=ac&code=ACT` | Both filters AND-combined |

**Important** — `Name` matching is case-sensitive (`Contains` defaults to ordinal). If FE wants case-insensitive search, force lowercase on input before sending. `Code` matching is also case-sensitive prefix match.

## Empty Seed Data — Frontend Caveat

The Charging service currently ships **no seeded lookups** (`[CODE] LookupSeedData.cs`). Every `id` you query will return `200 OK` with `[]`. If you intended to fetch from Commerce, the path is `/commerce/Lookup/{id}` — verify which service owns the lookup you need before binding.

## Comparison vs Commerce Lookup

| Aspect | Charging `/charging/Lookup/{id}` | Commerce `/commerce/Lookup/{id}` |
|---|---|---|
| Same DTO shape | yes (`Hook<LookupValueResponse>`) | yes |
| Same query params | yes (`name`, `code`) | yes |
| Same auth model | yes (`[Authorize]`, no tenant filter) | yes |
| Seeded | **no** (empty) | yes (Commerce seeds country, currency, etc.) |

The Charging service intentionally mirrors Commerce's contract so a shared FE component can route to either service. Today the Charging side is dormant — kept available for future Charging-owned constants (e.g. tariff-tier labels, quota-category dropdowns).

## Idempotency

Pure GET — naturally idempotent. No need for `referenceId` or any kind of deduplication header.

## Caching

No server-side cache. FE may cache lookup responses for the duration of a session — they change rarely (only on service redeploy with new seed data).

## Error Surface

| HTTP Status | Likely Backend Code | Frontend Action |
|---|---|---|
| 200 | (none) | Render options — or "no options available" if empty |
| 401 | `Unauthorized` | Redirect to login |
| 403 | `Forbidden` | Show "not allowed" (rare for this endpoint) |
| 500 | `InternalServerError` | Show generic error, retry once |

No 400, 404, or 422 codes are expected. An invalid `id` returns `200 OK` with `[]`.

## Multi-Language

The `hook.name` field is localized server-side per `Accept-Language`. The `hook.value.code` is the language-agnostic business key — use it for persistence and conditional logic, not the display name.

## OpenAPI / Swagger

Available in dev at `https://localhost:7224/swagger`. The Swagger schema shows `Get` returning `ServiceOperationResult<List<Hook<LookupValueResponse>>>` and accepting `{id}` plus optional `name` and `code` query params.
