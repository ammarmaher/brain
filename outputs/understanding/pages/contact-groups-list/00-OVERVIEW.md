*** Contact Groups List — Overview ***
*** 2026-05-18 ***

# Contact Groups List — Overview

> Admin-console feature for browsing contact groups. Two tabs (Own + Shared). Detail page accessible via row click or deep-link. Falcon admin browses across clients in view-only mode; create wizard lives in management-console.

## Source-of-truth

- [PRD] PRD-04 OVERVIEW · `Brain Outputs/prd/modules/04-contact-group-management/OVERVIEW.md`
- [PRD] PRD-04 BUSINESS_RULES · `Brain Outputs/prd/modules/04-contact-group-management/BUSINESS_RULES.md` (BR-CGM-*)
- [BRAIN-OUT] Contact Group ENDPOINT_REGISTRY · `Brain Outputs/understanding/backend/contact-group/ENDPOINT_REGISTRY.md`
- [CODE] Old-UI · `Brain Outputs/datasets/old-ui-dataset/10-pages/admin-console/contact-groups/`

## Trigger / entry

- **Page:** Admin Console → "Contact Groups" → `/contact-groups` (or `/contact-groups/:groupId` for direct detail)
- **Layout:** 30% left tree (orgs) + 70% right list/detail
- **Default tab:** Own

## Tabs

| Tab | Endpoint | Data shown |
|---|---|---|
| Own | `GET contactgroup/contact-groups?NodeId={id}` | Groups owned by the selected node |
| Shared | `GET contactgroup/contact-groups/shared?NodeId={id}` | Groups shared with the selected node |

PES gate for Shared: `FalconAccess.contactGroups.viewShared()`.

## softDelete visibility

[PRD] BR-CGM-XX (per old-UI 08-RULES-APPLIED):
- **Falcon usertype:** sees ALL groups including soft-deleted (with badge).
- **Client usertypes (AO/NA/NU):** sees only non-deleted groups.

## Columns

[CODE] 02-COMPONENTS.md — 4 column templates for sharedWith / createdBy / creationDate / status.

| # | Column | Field |
|---|---|---|
| 1 | Name | `name` |
| 2 | Reference ID | `referenceId` |
| 3 | Shared With | `sharedWith` (count or list) |
| 4 | Created By | `createdBy.username` |
| 5 | Created At | date |
| 6 | Status | `status` pill |
| 7 | Actions (kebab) | View · Edit · Download · Delete (per PES) |

## Sequence

```
Admin Console → Contact Groups
   │
   ▼
Tree mounts → user picks node
   │
   ▼
GET contactgroup/contact-groups?NodeId={id}&page=1&pageSize=100
   │
   ▼
List renders
   │
   ├─ User clicks row → navigate to /contact-groups/{id}
   │   ↓
   │   GET contactgroup/contact-groups/{id} → detail
   │   GET contactgroup/contact-groups/{id}/contacts?page=&pageSize= → pagination
   │
   └─ User clicks Edit (own group) → inline edit panel opens
       ↓
       PATCH contactgroup/contact-groups/{id}
```

## Cross-flow deps

- [[Create Contact Group Flow]] — sister flow (management-console).
- [[Create Template WhatsApp Flow]] — templates can link to contact groups via BR-TM-12.

## See also

- [02-SECTION_TABS](02-SECTION_TABS.md) · [04-SECTION_DETAIL_VIEW](04-SECTION_DETAIL_VIEW.md) · [08-BACKEND_API](08-BACKEND_API.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)

## Hubs

[[04 Contact Group Management]] · [[Contact Group Service]] · [[Identity Service]]
