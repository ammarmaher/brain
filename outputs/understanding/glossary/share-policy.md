*** Glossary — Share Policy ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Share Policy

## English
- **Definition:** Describes who can use a Contact Group beyond the creator. Carries `groupId`, `sharedWithAllUsers (bool)`, and `sharedUserIds[]` (Normal User IDs). `sharedWithAllUsers = true` is shorthand for "all Normal Users in the same hierarchy scope as the creator".

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-04 · `Brain Outputs/prd/modules/04-contact-group-management/ENTITIES.md:12` (SharePolicy row)

## Related PRD
- [[04 Contact Group Management]]

## Related backend service
- [[Commerce Service]]

## Related concepts
- See also: [[Contact Group]] · [[Normal User]] · [[Node]] · [[Permission Group]]

## Common confusions
- **`sharedWithAllUsers` is scope-bound** — "all users" really means "all Normal Users in the creator's hierarchy scope", not literally all Falcon-wide users.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
