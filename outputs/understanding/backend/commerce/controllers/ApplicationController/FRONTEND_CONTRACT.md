# ApplicationController — Frontend Contract

## Public URL

| Frontend URL | Maps to | Auth |
|---|---|---|
| `GET /commerce/Application` | Commerce `/api/Application` | Any JWT (Client or Falcon) |

## Headers

- `Authorization: Bearer <jwt>` — required
- `Accept: application/json`
- `Accept-Language: en` or `ar` (optional — drives translation; default `en`)

## Request

No body, no params.

## Response (Success)

```json
{
  "isSuccessful": true,
  "result": [
    { "id": "app-sms-blast", "name": "SMS Blast" },
    { "id": "app-bulk-mailer", "name": "Bulk Mailer" },
    { "id": "app-voice-otp", "name": "Voice OTP" }
  ],
  "errorMessages": []
}
```

- `id` is a Mongo ObjectId stringified
- `name` is a single translated string (already in caller's language)

## Response (Empty)

```json
{ "isSuccessful": true, "result": [], "errorMessages": [] }
```

## Response (Auth failure)

HTTP 401. Body not defined.

## Pagination

**Not paginated.** Full catalog returned each call.

For small catalogs (< 50 entries) this is acceptable. If the catalog grows, the frontend should implement client-side filtering on top of one cached fetch per session.

## Casing & Path Conventions

- Route: `/api/Application` (PascalCase, singular)
- Frontend HTTP service may map to `/commerce/Application` or `/commerce/applications` — **verify gateway proxy path** before assuming
- JSON wire: camelCase fields

## Cross-References

- [MEMORY] `project_commchannels_apps_tabs_phase1_2026_05_17` — Phase 1 wired the **per-account** endpoint (`commerce/Node/{nodeId}/applications`), not this global one
- [CODE] `apps/admin-console/.../tab-components/apps-services-tab/services/apps.service.ts` — per-account consumer
- [CODE] `apps/admin-console/.../org-hierarchy-page/services/applications-catalog.service.ts` (inferred — verify) — global catalog consumer

## Frontend Use Cases

1. **Add Client wizard Step 4** — fetch global app catalog to populate the rows-to-subscribe table
2. **Admin Applications page** — list all applications for Falcon admin to configure (pricing, visibility, status)
3. **Per-account Apps tab pre-load** — for the names lookup if the per-account endpoint doesn't include translated names
