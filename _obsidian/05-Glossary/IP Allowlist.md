*** Glossary — IP Allowlist ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# IP Allowlist

## English
- **Definition:** Per-Account list of IP addresses (`AccountSettings.allowedIps[]`) that may access the platform. Enforced by the Core Gateway via a configurable HTTP header parameter — requests missing the header or sourcing from a non-allowed IP are rejected. Cache populated from `GET /api/Security/ip-allowlists` (Commerce).

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-01 · imported-business `understanding.md` (R4)
- Secondary: [ENTITIES.md](../../../Brain%20Outputs/prd/modules/01-account-management/ENTITIES.md) BR-AM-10

## Related PRD
- [[01 Account Management]]

## Related entity
- [[E-account-settings]]

## Related backend service
- [[Commerce Service]] · [[Core Gateway Service]] · [[Identity Service]]

## Related concepts
- See also: [[Account Settings]] · [[Session]]

## Common confusions
- IP Allowlist is enforced at the **Gateway**, not at Commerce. Commerce only owns the data and the cache-refresh endpoint.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
