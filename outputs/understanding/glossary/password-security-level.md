*** Glossary — Password Security Level ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Password Security Level

## English
- **Definition:** An Account-level toggle controlling the complexity rules applied to all users' passwords on that Account. PRD enum: `Normal | Advanced`. Identity backend uses a finer-grained scale (`Low | Medium | High | Strict`) — see Q-UM-12.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · `Brain Outputs/prd/modules/01-account-management/ENTITIES.md:47` (Status enums)
- Secondary: PRD-02 ENTITIES.md `ePasswordSecurityLevel`

## Related PRD
- [[01 Account Management]] · [[02 User Management]]

## Related entity
- [[E-account-settings]] · [[V-password-security-level-enum]]

## Related backend service
- [[Identity Service]] (enforces) · [[Commerce Service]] (stores)

## Related concepts
- See also: [[Account Settings]] · [[User]]

## Common confusions
- **PRD wording vs Backend enum** — PRD says `Normal | Advanced` (2 values); backend uses `Low | Medium | High | Strict` (4 values). Question Q-UM-12 in PRD-02 calls out this drift.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
