*** PRD Understanding - Templates - QUESTIONS ***

# 05-templates - Open Questions

> Carried forward from `understanding.md:121-131` and `latest-prd.md:107-115` plus cross-reference findings.
> NOTE: This module had only ~250 of 982 PRD lines captured. Many gaps below are because the deep content was not extracted.

## Inherited from existing understanding.md

| # | Question | Why it matters | Where to look |
|---|---|---|---|
| Q-TM-01 | Full Voice template flow - is it similar to WhatsApp minus external approval? (BR-TM-30) | Voice CommChannel coverage. | `Copy of Template Module` lines >250; ask Jawad. |
| Q-TM-02 | Who plays the Checker role by default - Account Owner? Falcon Operation? Configurable? (BR-TM-31) | Determines whether Checker is per-account or per-channel. | latest-prd.md:110; CommChannelConfig.checkerLevels in Templates service. |
| Q-TM-03 | When a template is edited, does the old version keep running until the new one is approved? (BR-TM-33) | Versioning + zero-downtime template updates. | understanding.md:60, 118; ask Jawad. |
| Q-TM-04 | How is Meta's Pause / Disable signal surfaced to the UI - webhook, poll, both? | Implementation strategy + freshness. | latest-prd.md:53-54; ask Mahmood. |
| Q-TM-05 | Distinction between `Copy of Template Module`, `Template Module`, `Template Management Module` - which governs which aspect? (BR-TM-36) | Authoritative-source ambiguity. | latest-prd.md:115; ask Jawad to resolve in Drive. |
| Q-TM-06 | Does template deletion require Checker approval, or is it Maker-side action? (BR-TM-38) | Governance + audit. | understanding.md:129. |
| Q-TM-07 | Can Falcon usertype view templates across all clients? PRD says they cannot CREATE; can they view/approve? (BR-TM-39) | Scope of Falcon read access. | understanding.md:130; ask Jawad. |

## New questions surfaced during cross-reference

| # | Question | Why it matters | Where to look |
|---|---|---|---|
| Q-TM-08 | AI template creation flow - PRD says AI has no priority and destination = Global, but flow / wizard steps for AI templates are not captured. | AI CommChannel coverage. | latest-prd.md:32; ask Jawad. |
| Q-TM-09 | The Templates microservice currently exposes only `/api/communication-channel-configs/*` (3 endpoints). Where do the template-entity CRUD endpoints live? Is the Template entity stored elsewhere (Mongo direct, or a different service)? | Architectural surprise. | Templates ENDPOINT_REGISTRY (3 endpoints only). |
| Q-TM-10 | The Templates service is NOT routed by either gateway (per integration GAP-008). Frontend cannot reach it currently. | Cannot ship template UI until gateway routing fixed. | `Brain Outputs\understanding\integration\GAP_LIST.md`. |
| Q-TM-11 | `CommChannelConfig.bodyType` (Templates service DTO) - what are the valid values (Plain / Template / Interactive / ...?)? Enum is not documented. | Validator clarity. | Templates DTO_DICTIONARY. |
| Q-TM-12 | Maker / Checker - is one user allowed to be both for the same template (self-approval prevention)? | Compliance / SOX. | PRD silent; ask Jawad. |
| Q-TM-13 | What's the Checker assignment - does a template auto-route to a specific Checker by category? By language? Round-robin? | Approval queue design. | PRD silent; `CheckerLevels[]` data shape hints multi-level but doesn't say routing. |
| Q-TM-14 | Are Marketing-category templates blocked outside business hours or by other policies? | Marketing compliance per Meta. | PRD silent; check Meta policy doc. |
| Q-TM-15 | Bulk template upload / template library import - supported? | Convenience for large accounts. | PRD silent. |
| Q-TM-16 | Variable count "20-30 limit" - is the precise cap 20 OR 30 OR somewhere between? PRD wording is ambiguous (BR-TM-10). | Validation rule. | latest-prd.md:78; ask Jawad. |
| Q-TM-17 | Quick Reply buttons "custom labels supported" - what's the character limit on the label? | Validation rule. | PRD silent. |
| Q-TM-18 | Template configuration inheritance from Main node to sub-nodes with override (root-documents backlog item Q-AM-20 / BR-TM-40) - when is this scheduled? | Cross-cuts 01 + 05. | root-documents/latest-prd.md:28. |
| Q-TM-19 | When a Contact Group is deleted but a Template references its columns - what happens? | Cross-cuts 04 + 05. | PRD silent. |
| Q-TM-20 | When a template is `Paused` by Meta, does a queued Send Transaction get re-routed to another template, or fail? | Runtime resilience. | PRD silent; cross-cuts 03 + 05. |

## Cross-cutting backlog items (from root-documents/latest-prd.md) touching Templates

| # | Topic | Action |
|---|---|---|
| Q-TM-21 | "Template configuration is currently per commchannel in template management for the account; later maybe per Main node inherited to sub-nodes." (root-documents/latest-prd.md:28) | Phase 2 feature; defer. |
| Q-TM-22 | "Confirmation / warning messages should not be hardcoded - store in DB, editable without release." (root-documents/latest-prd.md:24) | Affects template variables for system messages; cross-platform i18n. |

## Banned synonyms / glossary discipline

- The PRD uses **Template**; flag any alias "Message Template" / "Form Template" / "Layout".
- The PRD uses **Maker** and **Checker** for governance; do NOT alias "Author"/"Reviewer" or "Editor"/"Approver".
- The PRD uses **CommChannel** consistently.
- The PRD uses **Meta** for the WhatsApp provider; do NOT alias "Facebook" / "WABA-API".
- The PRD uses **Sub-category** with a hyphen for WhatsApp categorization.
- The PRD uses **Variable**; do NOT alias as "placeholder" / "merge field" / "token" in user-facing copy.
- The PRD uses **Quick Reply** for the button kind; flag "Quick Action".
- The PRD uses **Paused** and **Disabled** for Meta states; do NOT alias.
