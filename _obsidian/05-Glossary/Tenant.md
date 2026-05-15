*** Glossary — Tenant ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Tenant

## English
- **Definition:** The Identity-system (Zitadel) representation of a Falcon Client. One Tenant per [[Account]]. Holds the opaque `tenantId` that flows through JWTs and binds users + sessions + Identity-side records to a single client.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: `falcon-wiki/Glossary.md` ("A client company using Falcon. Has its own users, contracts, contact groups, wallets.")
- Secondary: PRD-02 [ENTITIES.md](../../../Brain%20Outputs/prd/modules/02-user-management/ENTITIES.md) (User.tenantId) · `GetAccountHierarchyResponse.TenantId` in Commerce DTOs

## Related PRD
- [[01 Account Management]] · [[02 User Management]]

## Related entity
- [[E-account]] (Account ↔ Tenant 1:1)

## Related backend service
- [[Identity Service]] (owns Zitadel binding) · [[Commerce Service]] (binds Account → Tenant)

## Related concepts
- See also: [[Account]] · [[Zitadel]] · [[User]] · [[Falcon]]

## Common confusions
- **Tenant ↔ Account** — Same business concept, two surfaces. Account = PRD/business term; Tenant = Identity/Zitadel/multi-tenancy term. Use the term that matches your context.
- Banned synonym: **"Customer"** → use Tenant (in platform context) or Account (in PRD context).

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
