*** Glossary — Password Security Level ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Password Security Level

## English
- **Definition:** An Account-level toggle controlling the complexity rules applied to all users' passwords on that Account. PRD enum: `Normal | Advanced`. Identity backend uses a finer-grained scale (`Low | Medium | High | Strict`) — see Q-UM-12.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · [ENTITIES.md](../../../Brain%20Outputs/prd/modules/01-account-management/ENTITIES.md) Status enums
- Secondary: PRD-02 [ENTITIES.md](../../../Brain%20Outputs/prd/modules/02-user-management/ENTITIES.md) `ePasswordSecurityLevel`

## Related PRD
- [[01 Account Management]] · [[02 User Management]]

## Related entity
- [[E-account-settings]] · [[V-password-security-level-enum]]

## Related backend service
- [[Identity Service]] · [[Commerce Service]]

## Related concepts
- See also: [[Account Settings]] · [[User]]

## Common confusions
- **PRD wording vs Backend enum** — PRD says `Normal | Advanced` (2 values); backend uses `Low | Medium | High | Strict` (4 values). Q-UM-12 calls out this drift.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
