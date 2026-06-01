*** Contact Groups List — folder index ***
*** 2026-05-18 ***

# Contact Groups List — implementation knowledge folder

> SoT for the contact-groups list view (admin-console). Two-tabs: Own + Shared. Detail page deep-linkable. Falcon admin view-only — create wizard lives in management-console (covered in `pages/create-contact-group/`).

## Files

| File | Read when... |
|---|---|
| [00-OVERVIEW](00-OVERVIEW.md) | Page summary · two-tab structure |
| [01-PERMISSIONS](01-PERMISSIONS.md) | 9 PES checks · Falcon view-only doctrine |
| [02-SECTION_TABS](02-SECTION_TABS.md) | Own tab vs Shared tab |
| [03-SECTION_LIST_TABLE](03-SECTION_LIST_TABLE.md) | Columns · sort · row actions |
| [04-SECTION_DETAIL_VIEW](04-SECTION_DETAIL_VIEW.md) | Detail page (`/contact-groups/:id`) · contacts pagination · download |
| [05-SECTION_EDIT_PANEL](05-SECTION_EDIT_PANEL.md) | Edit name/refId/share-policy · only for creators |
| [06-SECTION_USER_PICKER](06-SECTION_USER_PICKER.md) | Share-policy multiselect of Identity users |
| [07-VALIDATIONS](07-VALIDATIONS.md) | 1 sync rule (name required); async lives in create-flow |
| [08-BACKEND_API](08-BACKEND_API.md) | 6 contact-group endpoints + 1 identity |
| [09-COMPONENTS](09-COMPONENTS.md) | Falcon components used |
| [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) | (list is read-only) |
| [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) | Contact group status FSM + softDelete |
| [12-ERROR_STATES](12-ERROR_STATES.md) | Error UX |
| [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) | API casing inconsistency (Page vs page) · 8 anti-patterns |
| [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md) | Pre-code gate + tasks |
| [PLAYBOOK](PLAYBOOK.md) | Single-doc synthesis |

## Verification gate

1. PRD anchor? → PRD-04 (Contact Group Management)
2. Two tabs visible to which roles? → see [01-PERMISSIONS](01-PERMISSIONS.md)
3. softDelete handling? → Falcon sees all, clients see non-deleted
4. Detail page deep-link? → `/contact-groups/:groupId`
5. Download types? → original + validated (file/{1\|2})
6. User-picker filter? → Status[2,3,4] + Role[NormalUser=6]
7. Pagination? → client-side in FalconTable with LIST_PAGE_SIZE=100 (TODO: switch to lazy)

## Hubs

[[Contact Groups List]] · [[Create Contact Group Flow]] · [[04 Contact Group Management]] · [[Contact Group Service]] · [[Identity Service]]
