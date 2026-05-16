---
type: page-dataset
app: admin-console
feature: contact-groups
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: Deep-Dive Agent P4
---

# Contact Groups (Admin Console)

## TL;DR
Admin-console feature that lets Falcon admin users browse contact groups owned by clients (own-tab) and groups shared with them (shared-tab), drill into a single group's details, edit name/reference/share-policy when they are the creator, and download the original or validated CSV file. Tree-panel (30%) drives a node-scoped list (70%); deep-link `/admin-console/contact-groups/:groupId` opens the detail page. Backend lives in **Falcon Core Contact Group Service** (`/api/contact-groups/*`), reached via the **System Gateway** path `contactgroup/contact-groups`. Identity user-picker calls go to the **Identity Service** path `identity/user`. The Create-Contact-Group wizard itself is NOT in admin-console — it lives only in `apps/management-console/`, so admin-console has list + detail + edit only.

## Manifest
- [[01-ROUTING]] — 2 routes, 2 guards (1 wraps app, 1 per-route)
- [[02-COMPONENTS]] — 2 components (list + detail), 8 column templates, no sub-components defined locally
- [[03-SERVICES-APIS]] — 2 services, 6 HTTP endpoints
- [[04-DTOS]] — 18 DTOs/interfaces/enums across local models + libs/falcon/shared-types
- [[05-PES]] — 9 permission queries (8 contact-group scoped + 1 contactGroups.viewShared), 2 route guards, 1 row-owner overlay
- [[06-VALIDATIONS]] — 1 sync validator (name required), no async validators (note: the wizard async validator lives in management-console, not here)
- [[07-CROSS-PAGE]] — 4 inbound deps, 0 outbound services exposed
- [[08-RULES-APPLIED]] — 7 good patterns, 8 anti-patterns observed

## Source files
| File | Role |
|---|---|
| `apps/admin-console/src/app/features/routes.ts:77-95` | Route registration (list + detail) |
| `apps/admin-console/src/app/features/contact-groups/contact-groups.component.ts` | List container with tree + tabs + falcon-table |
| `apps/admin-console/src/app/features/contact-groups/contact-groups.component.html` | List template, 4 cell templates (sharedWith / createdBy / creationDate / status) |
| `apps/admin-console/src/app/features/contact-groups/contact-groups.component.scss` | Layout-only SCSS (138 lines) |
| `apps/admin-console/src/app/features/contact-groups/models/models.ts` | `ContactGroupPermissionFlags`, `RowActionFlags`, `rowFlags()` helper |
| `apps/admin-console/src/app/features/contact-groups/services/contact-groups-api.service.ts` | List + shared-list API |
| `apps/admin-console/src/app/features/contact-groups/components/contact-group-details/contact-group-details.component.ts` | Detail container — view/edit toggle, downloads, multiselect share picker |
| `apps/admin-console/src/app/features/contact-groups/components/contact-group-details/contact-group-details.component.html` | Detail template (412 lines) |
| `apps/admin-console/src/app/features/contact-groups/components/contact-group-details/contact-group-details.component.scss` | Detail layout SCSS (227 lines) |
| `apps/admin-console/src/app/features/contact-groups/components/contact-group-details/models/models.ts` | Detail DTOs + status maps + file-type enum |
| `apps/admin-console/src/app/features/contact-groups/components/contact-group-details/services/contact-group-details.service.ts` | Detail + contacts + file-download + update + user-picker API |
| `libs/falcon/src/shared-types/lib/models/contact-group.models.ts` | Shared DTOs (`ContactGroupListItemDto`, `ContactGroupTableRowVm`, `PagedResult<T>`, `ContactGroupStatus`) |
| `libs/falcon/src/shared-utils/lib/utils/contact-group.mapper.ts` | `mapContactGroupsResponseToTableRows()` |
| `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:13-25` | `FalconAccess.contactGroups.*` + `FalconAccess.contactGroup.*` PES factories |
