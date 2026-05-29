# CommunicationChannelController — Frontend Contract

## Public URL

| Frontend URL | Maps to | Auth |
|---|---|---|
| `GET /commerce/CommunicationChannel` | Commerce `/api/CommunicationChannel` | Any JWT |

## Headers

- `Authorization: Bearer <jwt>` — required
- `Accept: application/json`
- `Accept-Language: en` or `ar` (optional)

## Request

No body, no params.

## Response (Success)

```json
{
  "isSuccessful": true,
  "result": [
    { "id": "ch-sms", "name": "SMS" },
    { "id": "ch-voice", "name": "Voice" },
    { "id": "ch-whatsapp", "name": "WhatsApp" },
    { "id": "ch-email", "name": "Email" }
  ],
  "errorMessages": []
}
```

## Response (Empty)

```json
{ "isSuccessful": true, "result": [], "errorMessages": [] }
```

## Pagination

Not paginated.

## Casing & Path Conventions

- Route: `/api/CommunicationChannel` (PascalCase, singular — verify path-case forwarding through gateways)
- JSON: camelCase fields

## Cross-References

- [MEMORY] `project_commchannels_apps_tabs_phase1_2026_05_17` — Phase 1 wires the per-account variant, not this global list
- [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/` — Add Client wizard Step 3 dossier

## Frontend Use Cases

1. **Add Client wizard Step 3** — fetch global comm-channel catalog
2. **Admin CommChannels page** — list all channels for Falcon admin configuration
3. **Per-account CommChannels tab pre-load** — name lookup when per-account endpoint omits translated names

## Symmetry with ApplicationController

`GET /api/Application` and `GET /api/CommunicationChannel` have **identical** request/response contracts (sans path):
- No params
- Returns `{ id: string, name: string }[]` wrapped in SOR
- No paging
- No filtering
- Translated server-side

This symmetry is intentional: per [MEMORY] `project_commchannels_apps_tabs_backend_integration_plan_2026_05_17`, the per-account responses (`AccountApplicationResponse` + `AccountCommunicationChannelResponse`) are also **structurally identical** — same fields, same shape. The FE collapses both onto a single canonical `ServiceRow` type in `_shared/models/`.
