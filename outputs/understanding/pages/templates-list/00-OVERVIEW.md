*** Templates List — Overview ***
*** 2026-05-18 · Wave 4 page-mining ***

# Templates List — Overview

> List of message templates the user can author, browse, approve. **Backend CRUD endpoints DO NOT EXIST today** — flag as GAP-T-001. PRD-05 only 25% mined; many details deferred.

## Source-of-truth

- [PRD] PRD-05 OVERVIEW · `Brain Outputs/prd/modules/05-templates/OVERVIEW.md`
- [PRD] PRD-05 BUSINESS_RULES · `Brain Outputs/prd/modules/05-templates/BUSINESS_RULES.md`
- [PRD] PRD-05 ENTITIES · `Brain Outputs/prd/modules/05-templates/ENTITIES.md`
- [BRAIN-OUT] Templates backend dossier · `Brain Outputs/understanding/backend/templates/ENDPOINT_REGISTRY.md` (3 endpoints — config only, NOT template CRUD)
- Old-UI source: **NO dedicated templates feature in admin-console** — may live inside `marketplace-applications` or in management-console (need to verify)

## Trigger / entry

- **Page:** Admin Console → Templates (route TBD; not implemented in old-UI yet)
- **Default view:** list of templates for selected account/channel

## Actors per PRD-02 + PRD-05

| Actor | Can create | Can approve | Can view |
|---|---|---|---|
| Falcon System Admin | NO | (some?) | YES |
| Falcon Operation | NO | (some?) | YES |
| Falcon Product | NO | (some?) | YES |
| Account Owner | YES (Maker default) | (if Checker permission) | YES |
| Node Admin | YES (if permission) | (if Checker) | YES |
| Normal User | YES (if permission) | (if Checker) | YES |
| Checker | N/A | YES | YES |

## List columns (per PRD)

| Column | Notes |
|---|---|
| Reference ID | unique per channel + language |
| Name | template name (a-z/0-9/_ only) |
| CommChannel | WhatsApp / Voice / AI / SMS / ... |
| Category | (channel-specific; for WhatsApp: AUTHENTICATION / MARKETING / UTILITY) |
| Language | e.g. `en`, `ar` |
| Status | Pending / Approved / Rejected (+ Meta state for WhatsApp) |
| Created By (Maker) | display username |
| Created At | date |
| Actions (kebab) | View · Edit (Pending only) · Submit · Approve · Reject · Delete |

## Per-channel wizard branches

| Channel | Wizard steps | Coverage |
|---|---|---|
| WhatsApp | 2 (Basic Info + Message Structure) | PRD captured |
| Voice | TBD | Not mined (Q-TM-04) |
| AI | TBD | Not mined |
| SMS | TBD | Not mined |

## Sequence diagram

```
Maker (Account Owner / Node Admin / Normal User)
   │
   ▼
[Templates List page]
   │ Click "+ Create Template"
   ▼
[Channel picker: WhatsApp / Voice / AI / SMS]
   │ Pick WhatsApp
   ▼
[Create Template (WhatsApp) wizard] → POST /templates (when endpoint exists)
   │
   ▼
Template created in Pending state
   │
   ▼
[Maker submits for approval] → status: PendingChecker → PendingMeta (WhatsApp)
   │
   ▼
[Checker approves internally] → status: PendingMeta (WhatsApp via API)
   │
   ▼
[Meta auto-approves via webhook] → status: Approved
   │
   ▼
Template visible to consumers (Applications)
```

## Cross-flow dependencies

- **Sister flow [[Contact Groups List]]:** template variables can be linked to contact-group columns.
- **Consumed by:** Applications use templates when sending transactions.
- **External system:** Meta (WhatsApp Business API) auto-approves WhatsApp templates.

## See also

- [01-PERMISSIONS](01-PERMISSIONS.md) · [02-SECTION_LIST_TABLE](02-SECTION_LIST_TABLE.md) · [08-BACKEND_API](08-BACKEND_API.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)

## Hubs

[[05 Templates]] · [[Templates Service]] · [[Contact Groups List]]
