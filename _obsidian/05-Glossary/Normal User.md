---
type: glossary-term
term: Normal User
prd: PRD-01
is-entity: true
created: 2026-05-15
---
*** Glossary — Normal User ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Normal User

## English
- **Definition:** A non-admin client-side user. Holds their own wallet balance (in User-based Balance Type configurations), views their own profile, and performs transactional operations only. Cannot manage other users or change account settings.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · [OVERVIEW.md](../../../Brain%20Outputs/prd/modules/01-account-management/OVERVIEW.md) (Actors table)
- Secondary: PRD-02 User Management

## Related PRD
- [[01 Account Management]] · [[02 User Management]]

## Related entity
- [[E-user]] (Normal User is a User with role = `normal-user`)

## Related backend service
- [[Identity Service]]

## Related concepts
- See also: [[User]] · [[Role]] · [[Account Owner]] · [[Node Admin]] · [[Wallet]] · [[Balance Type]]

## Common confusions
- **Normal User ↔ System User** — In Account Limitations, `maxNormalUserLimit` and `maxSystemUserLimit` are independent counters. PRD-02 treats System User as a Normal User with a system flag (assumption — see PRD-AM understanding.md:128).

## Tags

#type/glossary-term #prd/01 #prd/02 #service/identity #gap

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
