*** Glossary — Contact Group ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Contact Group

## English
- **Definition:** A named list of recipients owned by a single creator, stored under a specific Node in the hierarchy. Carries `contactId` (auto, immutable), `name` (≤50), `referenceId?`, `createdBy`, `uploadedCount`, `status` (`In Progress | Completed`), `sharedWith[]`, `originalFileRef`, `validatedFileRef`, `nodeId`, `tenantId`, `softDeleted` flag.

## Arabic
- **Term:** **مجموعة جهات الاتصال** (per `falcon-wiki/Brain SK/skills/imported-business/domain-glossary/resources/multilanguage-rules.md`).
- **Definition:** Not captured in available sources — only the term name is documented. Surface gap on the definition itself.

## Source citation
- Primary: PRD-04 · `Brain Outputs/prd/modules/04-contact-group-management/ENTITIES.md:9` (ContactGroup row)
- Secondary: `Brain SK/skills/imported-business/domain-glossary/resources/multilanguage-rules.md:22` (Arabic name example)

## Related PRD
- [[04 Contact Group Management]]

## Related backend service
- [[Commerce Service]]

## Related concepts
- See also: [[Share Policy]] · [[Node]] · [[Template]] · [[User]]

## Common confusions
- A user can be the creator of MANY groups (1:N). A user can be a sharer-target of MANY groups (M:N via SharePolicy).
- `softDeleted` is a flag, **not a status**. The Status field is independent (`In Progress | Completed`).

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
