*** Glossary — Template ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Template

## English
- **Definition:** A predefined message structure for a specific CommChannel + language. Status: `Draft → Pending → Approved/Rejected` plus WhatsApp Meta sub-states. Has Header, Body, Footer, Buttons (≤10), Variables, Versions, ApprovalTrail.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-05 · [ENTITIES.md](../../../Brain%20Outputs/prd/modules/05-templates/ENTITIES.md)
- Secondary: status enums

## Related PRD
- [[05 Templates]]

## Related backend service
- (Templates microservice — partial)

## Related concepts
- See also: [[CommChannel]] · [[Maker Checker]] · [[Checker Level]] · [[Contact Group]] · [[Account]]

## Common confusions
- WhatsApp templates have TWO state machines: Falcon `status` + Meta `metaState`.
- Variable types: `{{1}}` (Number) vs `{{name}}` (Name).

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
