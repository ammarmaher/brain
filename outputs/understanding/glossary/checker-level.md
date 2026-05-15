*** Glossary — Checker Level ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Checker Level

## English
- **Definition:** One approval level in the Template Maker/Checker pipeline. Carries `levelNumber` (1..N) and `users[]` (assigned CheckerUsers). Configured per Tenant + CommChannel via `CommChannelConfig.LevelsCount` and `CommChannelConfig.checkerLevels[]`.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-05 · `Brain Outputs/prd/modules/05-templates/ENTITIES.md:18` (CheckerLevel row)
- Secondary: PRD-05 ENTITIES.md `CommChannelConfig` row

## Related PRD
- [[05 Templates]]

## Related backend service
- Templates service (`UserCheckerLevels` + `CommunicationChannelConfig` endpoints)

## Related concepts
- See also: [[Maker Checker]] · [[Template]] · [[CommChannel]] · [[User]]

## Common confusions
- Configured **per (Tenant × CommChannel)** — not global. Each Tenant + CommChannel pair has its own levels-count and per-level user list.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
