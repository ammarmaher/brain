*** Glossary — User Type ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# User Type

## English
- **Definition:** Backend enum `eUserType` distinguishing **Falcon** (internal T2 staff users) from **Client** (tenant-side users). Drives gateway routing (Falcon → System Gateway; Client → Core Gateway) and tenant-scoping decisions in handlers.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-02 · `Brain Outputs/prd/modules/02-user-management/ENTITIES.md:38` (eUserType)
- Secondary: `falcon-wiki/Glossary.md:19-20`

## Related PRD
- [[02 User Management]]

## Related entity
- [[E-user]]

## Related backend service
- [[Identity Service]] · [[Core Gateway Service]] · [[System Gateway Service]]

## Related concepts
- See also: [[User]] · [[Role]] · [[Falcon]] · [[Tenant]]

## Common confusions
- **Falcon User ↔ Client User** — Falcon User = T2 internal (System Gateway path on port 7256). Client User = tenant user (Core Gateway path on port 7038). Don't conflate them.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
