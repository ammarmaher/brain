---
type: flow-single
flow-name: <Flow Name>
page-slug: <page-slug>
prd: PRD-NN
form: single-file
created: <YYYY-MM-DD>
---

*** Flow Playbook — <Flow Name> ***
*** SoT for implementation: this file ***
*** Page: <Page Name> · PRD: PRD-NN <module> · <YYYY-MM-DD> ***

# <Flow Name> — implementation playbook

> Authoritative spec for the **<Flow Name>** flow on the <Page Name> page. A future session implementing the FE forms, BE integration, or both should treat THIS file as the source of truth.

## Trigger / entry point

- **Page:** [[<Page Name>]]
- **Action:** button / menu / dialog
- **Precondition:** auth state · role · etc.

## Permission matrix (who can run this flow)

| Role | Can run? | Source |
|---|---|---|

Cross-link: [[Falcon Roles Permission Matrix]].

## Form fields (or step-by-step if multi-step)

| Field | Type | PRD rule | Backend DTO field | V-rule | Frontend validator |
|---|---|---|---|---|---|

## Backend endpoint summary

| Method | Path | Service | Request | Response | Error codes |
|---|---|---|---|---|---|

## State / status transitions

## Error states + UX

| Error | UX |
|---|---|

## Cross-flow dependencies

## Related entity reconciliation notes

## Related V-rules (all validations)

## Related Falcon components

## Implementation checklist (FE/BE)

- [ ] Read this playbook end-to-end
- [ ] Verify request DTO shape against current `Brain Outputs/understanding/backend/<service>/DTO_DICTIONARY.md`
- [ ] Apply all V-rules listed
- [ ] Honor [[Falcon Roles Permission Matrix]] permission gate
- [ ] Test all error states
- [ ] Confirm Kafka chain (if any)
- [ ] Verify drift items in linked E-* entity notes

## Hubs

- [[<Page Name>]] · [[NN <module name>]] · [[<Service Name> Service]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[COMPONENT_INDEX]] · [[API_INDEX]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[AMMAR_BRAIN_HOME]]
