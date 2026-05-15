---
type: glossary-term
term: Account Owner
prd: PRD-01
is-entity: true
created: 2026-05-15
---
*** Glossary — Account Owner ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Account Owner (AO)

## English
- **Definition:** The primary client-side admin user for a Falcon Account. Created at Step 5 of the Add Client wizard. Has full hierarchy + user-management scope inside the Main Node and its Sub-nodes, can transfer wallet balances within their scope, and can perform CommChannel `Disable` / `Do Payment` actions — but cannot edit pricing.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · [OVERVIEW.md](../../../Brain%20Outputs/prd/modules/01-account-management/OVERVIEW.md) (Actors table)
- Secondary: PRD-02 User Management · permission matrix

## Related PRD
- [[01 Account Management]] · [[02 User Management]]

## Related entity
- [[E-user]] (Account Owner is a User with role = `account-owner`)

## Related backend service
- [[Identity Service]] (user lifecycle) · [[Commerce Service]] (scope binding)

## Related concepts
- See also: [[User]] · [[Role]] · [[Node Admin]] · [[Normal User]] · [[Permission Group]] · [[Account]]

## Common confusions
- **Account Owner ↔ Node Admin** — Both are client-side admin roles. AO has full Main+Sub scope; NA has Sub-only scope.
- **Account Owner ↔ System Administrator** — Sys Admin is a Falcon-side (T2 internal) role; AO is client-side.

## Tags

#type/glossary-term #prd/01 #prd/02 #service/commerce #service/identity #gap

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
