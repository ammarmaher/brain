*** Glossary — Template ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Template

## English
- **Definition:** A predefined message structure for a specific CommChannel + language. Carries id, accountId/tenantId, name (a-z, 0-9, _; unique per WABA+language), commChannelId, language, category/subCategory, variableType (`Number | Name`), referenceId?, status (`Draft → Pending → Approved/Rejected` plus WhatsApp Meta sub-states), createdBy, approvedBy. Has Header (optional), Body (required), Footer (optional), Buttons (≤10), Variables, Versions, and an ApprovalTrail.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-05 · `Brain Outputs/prd/modules/05-templates/ENTITIES.md:9` (Template row)
- Secondary: PRD-05 ENTITIES.md status enums

## Related PRD
- [[05 Templates]]

## Related backend service
- (Templates microservice — partial; not fully wired into a public API surface per PRD-05 GAPS.md)

## Related concepts
- See also: [[CommChannel]] · [[Maker Checker]] · [[Checker Level]] · [[Contact Group]] · [[Account]]

## Common confusions
- **WhatsApp templates have TWO state machines** — Falcon's own `status` (Draft/Pending/Approved/Rejected) AND Meta's `metaState` (In-Review/Active-*/Paused/Disabled/Rejected). Both must be tracked.
- **Template variables** can be `{{1}}` (Number) or `{{name}}` (Name) — variableType locks the form per template.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
