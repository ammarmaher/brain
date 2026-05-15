*** Glossary — Maker / Checker ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Maker / Checker

## English
- **Definition:** The two-role approval pattern for Templates. **Maker** = the user who drafts/submits a template; **Checker** = a user at a Checker Level who reviews and approves/rejects the submission. Each `TemplateApprovalTrail` row records `actorRole ∈ {Maker, Checker, MetaSystem}` with action `Submit | Approve | Reject | MetaUpdate`.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-05 · `Brain Outputs/prd/modules/05-templates/ENTITIES.md:16` (TemplateApprovalTrail row)
- Secondary: PRD-05 ENTITIES.md `CommChannelConfig` (LevelsCount + CheckerLevels)

## Related PRD
- [[05 Templates]]

## Related backend service
- Templates service (`UserCheckerLevels` endpoint exposed)

## Related concepts
- See also: [[Template]] · [[Checker Level]] · [[User]] · [[Role]]

## Common confusions
- Maker/Checker is a **pattern**, not an entity. The actor's *Role* (e.g. `node-admin`) is unchanged; their *role-in-this-workflow* is recorded on the approval trail.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
