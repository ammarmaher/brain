*** Glossary — Permission Group ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Permission Group

## English
- **Definition:** A named bundle of Permissions assigned to one or more Users. Each Permission is a tuple `(Menu Item, Page Tab, Function/Action, Role, Value)` where Value ∈ `Allow | Not Allow | Deny | Can be overridden by Deny`. Tied to a tenant when non-platform-wide.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-02 · `Brain Outputs/prd/modules/02-user-management/ENTITIES.md:14` (PermissionGroup + Permission rows)
- Secondary: `_mounts/brain-sk/registries/PES_PERMISSION_MATRIX.md` (referenced by PES)

## Related PRD
- [[02 User Management]]

## Related entity
- [[E-permission-group]] (no dedicated note yet — surfaces via [[E-user]])

## Related backend service
- [[Identity Service]]

## Related concepts
- See also: [[User]] · [[Role]] · [[PES]]

## Common confusions
- **Permission Group ↔ Role** — see [[Role]]. Role is the job label; Permission Group is the actual bundle of allow/deny tuples. Sometimes used interchangeably in casual conversation; keep them distinct in PRD/spec writing.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
