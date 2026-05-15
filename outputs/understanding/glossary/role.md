*** Glossary — Role ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Role

## English
- **Definition:** A User's job assignment. Backend enum `eUserRoles` keyed by **RoleKey** strings: `sys-admin | operation | product | account-owner | node-admin | normal-user`. The canonical identifier going forward is the RoleKey (per `UserRolePolicy.GetRoleFromRoleKey` in Identity).

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-02 · `Brain Outputs/prd/modules/02-user-management/ENTITIES.md:37` (eUserRoles)
- Secondary: `falcon-wiki/Glossary.md:68` (banned-term row: "Permission group" → Role)

## Related PRD
- [[02 User Management]]

## Related entity
- [[E-user]]

## Related backend service
- [[Identity Service]]

## Related concepts
- See also: [[User]] · [[Permission Group]] · [[User Type]] · [[Account Owner]] · [[Node Admin]] · [[Normal User]]

## Common confusions
- **Role ↔ Permission Group** — `falcon-wiki/Glossary.md` marks "Permission group" as a banned synonym for **Role** *when assigning policies*. But the PRD-02 ENTITIES.md treats Permission Group as a separate entity (the bundle of permissions). Resolution: **Role identifies the person's job**; **Permission Group is the assigned bundle of policies** that gives them their permissions. They are not synonyms in this glossary's strict reading.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
