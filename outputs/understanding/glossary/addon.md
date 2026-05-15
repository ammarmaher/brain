*** Glossary — Addon ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Addon

## English
- **Definition:** A sub-service attached to a Contract, carrying both a free-credit bucket (`freeCreditValue`) and a rate card (`rateCardValue`). Each Addon targets a `subServiceType` (e.g. `VoiceNumber`, `NabaaTemplate`). Maps to backend DTOs `ContractQuotaRequest` (free-credit side) and `ContractOverageRateRequest` (rate-card side).

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-03 · `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md:12` (Addon row)
- Secondary: PRD-03 ENTITIES.md DTO mapping

## Related PRD
- [[03 Contract Packaging Charging Billing]]

## Related backend service
- [[Commerce Service]] · [[Charging Service]]

## Related concepts
- See also: [[Contract]] · [[Quota]] · [[CommChannel]]

## Common confusions
- **Addon ↔ Quota** — One Addon contains both a Quota (free-credit) and an overage Rate. Don't treat Addon and Quota as synonyms — Quota is one *half* of an Addon's structure.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
