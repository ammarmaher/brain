# LookupController — Frontend Contract

## Public URLs

Via **Core Gateway** (client users — port 7038):
```
GET /provisioning/Lookup/{lookupId}?name=&code=
```

Via **System Gateway** (Falcon admins — port 7256):
```
GET /provisioning/Lookup/{lookupId}?name=&code=
```

Both gateways apply the same path transform: strip `/provisioning`, prepend `/api`. The backend sees `/api/Lookup/{id}` either way.

| Gateway | Path | YARP `AuthorizationPolicy` |
|---|---|---|
| Core (client users) | `/provisioning/Lookup/{id}` | `ClientOnly` |
| System (Falcon admins) | `/provisioning/Lookup/{id}` | `FalconOnly` |

## Authentication & Headers

| Header | Required | Notes |
|---|---|---|
| `Authorization: Bearer <jwt>` | **yes** | Zitadel-issued, validated by both gateways and the backend |
| `Accept-Language` | no | Defaults to `en`. Send `ar` or `ar-SA` to receive Arabic `Hook.Name` values. |
| `Content-Type` | no | GET — no body |

## Response Wrapper

All endpoints return `ServiceOperationResult<T>`:
```json
{
  "isSuccessful": true,
  "errorMessages": [],
  "result": [ /* List<Hook<LookupValueResponse>> */ ]
}
```

## Wire Shape

```json
{
  "isSuccessful": true,
  "errorMessages": [],
  "result": [
    {
      "value": { "id": "65a1c2d3…", "code": "SA" },
      "name": "Saudi Arabia"           // localized
    }
  ]
}
```

| Field | Type | Meaning |
|---|---|---|
| `result[i].value.id` | string | Mongo ObjectId of the `LookupValue` — use as backend FK |
| `result[i].value.code` | string | Human-readable shortcut (e.g. ISO country code) |
| `result[i].name` | string | **Localized** display label — bound from `Hook.Name` |

## Frontend Patterns

### Resolve a lookup catalog for a dropdown

```typescript
// In a typeahead/picker component
import { HttpClient } from '@angular/common/http';

interface LookupHook {
  value: { id: string; code: string };
  name: string;  // already localized by backend per Accept-Language
}

interface ServiceOperationResult<T> {
  isSuccessful: boolean;
  errorMessages: string[];
  result: T;
}

@Injectable({ providedIn: 'root' })
export class LookupService {
  constructor(private http: HttpClient) {}

  list(lookupId: string, opts?: { name?: string; code?: string }) {
    const params: Record<string, string> = {};
    if (opts?.name) params['name'] = opts.name;
    if (opts?.code) params['code'] = opts.code;

    return this.http.get<ServiceOperationResult<LookupHook[]>>(
      `provisioning/Lookup/${lookupId}`,
      { params }
    );
    // Note: Accept-Language is set globally by the language interceptor —
    // do NOT pass it per-call.
  }
}
```

### Typeahead pattern

```typescript
// Debounced search → server-side filter
this.searchControl.valueChanges.pipe(
  debounceTime(250),
  distinctUntilChanged(),
  switchMap(term => this.lookup.list(this.lookupId, { name: term }))
).subscribe(res => this.options.set(res.result));
```

Note: search is **case-sensitive** on the backend (LINQ `Contains`). To match the PRD's case-insensitive UX, the frontend can:
1. Send the user's literal input (current behavior — case-sensitive)
2. Or send both lowercase + original and merge results client-side (workaround)
3. Or escalate to backend to fix (preferred — see OVERVIEW Findings #3, ERRORS Pending Questions #2)

### Code-keyed lookup (no typeahead)

```typescript
// Want the row whose Code === "SA"
this.lookup.list('country-lookup-id').pipe(
  map(res => res.result.find(h => h.value.code === 'SA') ?? null)
).subscribe(country => this.selectedCountry.set(country));
```

### Pre-populate a form-control with Hook value

```typescript
form.patchValue({
  countryId: hook.value.id        // for backend POST/PUT
  // display the localized `hook.name` in the UI
});
```

## Multi-Language

**Server-side translation** — the response `name` is **already localized**.

| Frontend State | Header to Send | Resulting `Hook.Name` |
|---|---|---|
| English UI | `Accept-Language: en` | English |
| Arabic UI | `Accept-Language: ar` (or `ar-SA`, etc.) | Arabic |
| No header | (default `en`) | English |
| Unsupported (e.g. `fr`) | `Accept-Language: fr` | English (silent fallback) |

The frontend does **not** need to render bi-language fields — it gets a flat localized string. If both languages are needed at once (e.g. for the falcon-studio designer tool), the Lookup endpoint alone is **insufficient** — escalate as a backend change to expose `MultiLanguageName` instead of pre-localizing.

## Empty Catalog Reality

[CODE] `LookupSeedData.cs` ships **no** lookup data. **Today**, calling this endpoint against a fresh Provisioning database returns `result: []` for **every** `lookupId`. Frontend tabs that rely on Provisioning Lookup values should:
1. Not block UI rendering on Lookup population
2. Fall back to "no options available" empty state gracefully
3. Surface a console warning if a critical lookup returns empty (helps catch un-seeded environments)

For populated lookups (countries, industries, etc.), use the **Commerce** Lookup endpoint `/commerce/Lookup/{id}` — see [VAULT] (Commerce Lookup dossier when authored) — not Provisioning's.

## CORS

Empty in [CODE] `appsettings.json` → set per environment (e.g. Development sets `http://localhost:4200`).

## OpenAPI / Swagger

Dev: `https://localhost:7163/swagger`. Lookup appears as one of two controllers.

## Status Codes Reference

| Status | Cause |
|---|---|
| `200 OK` | Always on a successful auth + filter — empty list for unknown id or zero matches |
| `401 Unauthorized` | Missing/expired JWT (gateway-level) |
| `403 Forbidden` | Gateway policy mismatch (Falcon user via Core Gateway, or vice versa) |
| `500 Internal Server Error` | Mongo unreachable; framework-level handling |

## Deviations

| Standard | Status |
|---|---|
| `ServiceOperationResult<T>` | Conformant |
| Route casing | PascalCase route token (`/Lookup`), parameter `{id}` (no kebab-case sub-paths since no sub-paths) |
| MultiLanguage exposure | **Server-translates to flat string** — strips dual-language data. Same as Commerce/Charging convention. |
| HTTP idempotency | Conformant (GET) |
| FalconException usage | None raised here — endpoint is error-free in normal operation |
| East-west exposure | This endpoint **is** exposed both via gateways (browser-accessible) AND would be callable east-west from Commerce/Charging/Identity. No current internal consumer confirmed. |

## Cross-Cutting Note: Per-Service Lookup Federation

The frontend's Lookup-resolution layer must know **which service owns which lookupId**. There is no cross-service federation — calling `/commerce/Lookup/abc` and `/provisioning/Lookup/abc` will return different results (or empty for Provisioning today). Maintain a per-service lookup-catalog map in the frontend (or omit Provisioning entirely until it seeds at least one canonical catalog).
