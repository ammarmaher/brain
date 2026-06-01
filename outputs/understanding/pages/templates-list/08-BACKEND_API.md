*** Templates List — Backend API ***
*** GAP: most endpoints MISSING · 2026-05-18 ***

# Templates List — Backend API

> **HALT-AND-FLAG: Template CRUD endpoints DO NOT EXIST in backend today.** Only 3 communication-channel-config endpoints are documented. This file shows what SHOULD exist per PRD-05.

## Endpoints documented today (NOT template CRUD)

[BRAIN-OUT] `Brain Outputs/understanding/backend/templates/ENDPOINT_REGISTRY.md`:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/communication-channel-configs?TenantId=` | List per-channel config (NOT templates) |
| GET | `/api/communication-channel-configs/user-checker-levels?UserId=&TenantId=` | List checker levels per user |
| PUT | `/api/communication-channel-configs/{id}` | Bulk-update channel configs |

These are config endpoints, NOT template CRUD.

## Endpoints needed for Templates List (NOT YET BUILT)

| Method | Path | Purpose | Status |
|---|---|---|---|
| GET | `/api/templates?accountId=&channel=&status=&category=&language=&search=&pageNumber=&pageSize=` | List templates | **MISSING** |
| GET | `/api/templates/{id}` | Get template detail | **MISSING** |
| POST | `/api/templates` | Create template | **MISSING** |
| PATCH | `/api/templates/{id}` | Edit template (Maker pre-submit) | **MISSING** |
| POST | `/api/templates/{id}/submit` | Submit for Checker approval | **MISSING** |
| POST | `/api/templates/{id}/approve` | Checker approves internally | **MISSING** |
| POST | `/api/templates/{id}/reject` | Checker rejects internally | **MISSING** |
| DELETE | `/api/templates/{id}` | Delete template | **MISSING** |
| POST | `/api/webhook/meta/template-update` | External webhook from Meta (WhatsApp approval lifecycle) | **MISSING** |

[GAP-T-001] All template CRUD endpoints missing. PRD-05 implies backend implementation pending.

## Why this is OK to document anyway

Per F-019: "Template CRUD endpoints MISSING → Document as GAP, continue." So the page-mining documents what SHOULD exist per PRD.

## Response wrapper

`ServiceOperationResult<T>` standard.

## See also

- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) · [00-OVERVIEW](00-OVERVIEW.md)
