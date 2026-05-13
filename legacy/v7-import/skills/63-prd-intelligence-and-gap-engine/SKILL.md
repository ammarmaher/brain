# Skill: PRD Intelligence and Gap Engine

## Mission

Convert PRDs, BRDs, feature documents, screenshots, acceptance notes, backend contracts, and existing Falcon knowledge into implementation-ready business intelligence.

This skill makes sure the brain does not only read PRDs. It must understand them, compare them with existing code and architecture, find gaps, ask high-value questions, and generate the right categorized artifacts for sprint planning, implementation, QA, and handoff.

---

## When to Use

Use this skill when the user mentions:

- PRD
- BRD
- requirement
- business requirement
- sprint planning
- gaps
- missing requirements
- acceptance criteria
- test cases from PRD
- implementation based on PRD
- understand module
- compare PRD with code
- latest version
- create plan from PRD
- create PDF/report from PRD

Also use it before frontend or backend implementation when the task has business rules.

---

## Inputs This Skill Can Use

```txt
PRD documents
BRD documents
Excel requirement sheets
PDF specifications
Screenshots
Figma/live UI descriptions
Backend controller/service/DTO/entity files
Frontend routes/components/services/models
Existing module docs
Existing generated reports
User notes
Sprint scope
Bug reports
```

---

## Latest PRD Version Rule

When multiple PRDs exist for the same module, choose the latest version by numeric version suffix.

Examples:

```txt
Wallet PRD v1.docx
Wallet PRD v2.docx
Wallet PRD V10.pdf
```

Latest is `v10`, not `v2`.

Rules:

```txt
1. Parse v<number> or V<number>.
2. Compare numerically, not alphabetically.
3. Prefer latest version unless the user asks for another version.
4. Keep older versions in ignored/previous list.
5. If no version exists, use modified date only as a secondary clue.
6. Never silently merge conflicting PRDs. Mark conflicts as gaps.
```

---

## PRD Understanding Output

For every PRD/module, extract:

```txt
Module name
Feature name
Business objective
Actors/roles
In scope
Out of scope
User journeys
Happy paths
Alternative paths
Edge cases
Validation rules
Permissions
Status lifecycle
Notifications/messages
Data entities
API expectations
Frontend screens
Backend responsibilities
Reports/PDF requirements
Audit/logging requirements
Integration points
Non-functional requirements
Open questions
Assumptions
```

---

## Requirement ID Rule

If the PRD already has requirement IDs, preserve them.

If it does not, generate stable IDs:

```txt
{MODULE}-BR-001     Business rule
{MODULE}-UX-001     UI/UX requirement
{MODULE}-API-001    API/backend requirement
{MODULE}-VAL-001    validation rule
{MODULE}-PERM-001   permission rule
{MODULE}-STATE-001  status/lifecycle rule
{MODULE}-QA-001     test requirement
```

Never change generated IDs once created for the same module unless there is a documented reason.

---

## Existing Knowledge Linking Rule

The skill must connect PRD knowledge to what already exists.

For each requirement, attempt to map:

```txt
Requirement
→ Existing Falcon module/folder
→ Existing frontend route/screen
→ Existing Angular component
→ Existing Falcon component mapping
→ Existing service/facade/model
→ Existing backend controller/action
→ Existing DTO/entity/enum
→ Existing validation/permission/status logic
→ Existing test/report/document
```

If something cannot be found, mark it as a gap instead of inventing it.

---

## Frontend + Backend Traceability Matrix

Every business-heavy PRD output must include a traceability matrix:

```md
| Requirement ID | Business Rule | Actor | Frontend Screen/Component | Backend API/DTO/Service | Validation/Permission | Test Case | Gap/Risk | Action |
|---|---|---|---|---|---|---|---|---|
```

This matrix is mandatory for sprint planning, implementation prompts, QA, and sign-off.

---

## Gap Detection Engine

Compare PRD requirements against existing knowledge and implementation.

Gap categories:

```txt
Business gap: missing or unclear business rule.
UX gap: missing screen, state, flow, copy, or visual behavior.
Frontend gap: no route/component/service/model implementation.
Backend gap: missing API/controller/DTO/entity/validation.
Integration gap: frontend/backend contract mismatch.
Permission gap: unclear role/security rule.
Status gap: unclear lifecycle/status transition.
Validation gap: missing field constraints or edge cases.
Data gap: missing persistence/entity/migration detail.
Test gap: missing coverage.
Document conflict: PRD versions disagree.
```

Severity:

```txt
Blocking: cannot safely implement without an answer.
Important: can proceed with documented assumption.
Minor: safe to infer or handle during implementation.
```

Ask questions only for blocking gaps.

---

## Smart Questions Rule

Do not ask generic questions like “Can you clarify?”

Ask specific, actionable questions:

```txt
I found 3 blocking PRD gaps before implementation:
1. The PRD says managers can approve leave, but does not define whether HR can override rejected requests. Should HR override be supported?
2. The PRD shows a status of Pending Approval, but the backend enum only has Pending/Approved/Rejected. Should we add PendingApproval or map it to Pending?
3. The PRD requires a PDF export, but does not define columns. Should the PDF match the visible table columns?

If you do not answer, I will assume:
1. HR override is not supported in this wave.
2. Pending Approval maps to backend Pending.
3. PDF uses visible table columns only.
```

---

## Sprint Planning Output

When asked for sprint planning, generate:

```txt
Sprint goal
Scope
Out of scope
Dependencies
Frontend tasks
Backend tasks
UI/Falcon component tasks
API/DTO tasks
Database tasks if any
QA/test tasks
Visual QA tasks
Risks
Gaps/questions
Definition of ready
Definition of done
Implementation waves
```

Each task should link back to requirement IDs.

---

## Implementation Handoff Rule

When preparing a Claude/Codex handoff, include:

```txt
Relevant PRD summary
Requirement IDs
Target app/module
Frontend code paths
Backend code paths
Falcon component mapping
Acceptance criteria
Gap assumptions
No-regression rules
Test commands
Files allowed to change
Files not allowed to change
```

The handoff must be implementation-ready, not vague.

---

## PDF and Artifact Rule

When creating management, sprint, PRD gap, architecture, or QA sign-off artifacts, generate Markdown first and PDF when tooling is available.

Store outputs under:

```txt
Brain Generated/01-prd-analysis/{module}/
Brain Generated/02-sprint-planning/{sprint-or-module}/
Brain Generated/03-implementation-plans/{module}/
Brain Generated/05-qa-test-cases/{module}/
Brain Generated/09-handoffs/{module}/
```

Naming convention:

```txt
{yyyy-mm-dd}-{module}-{artifact-type}-v{n}.{md|pdf}
```

Every artifact must contain metadata:

```txt
Title
Module
PRD source/version
Generated date
Owner
Related skill chain
Status
```

---

## No-Invention Rule

Do not invent business requirements, backend APIs, DTOs, permissions, statuses, or validations.

Use one of these labels:

```txt
Confirmed by PRD
Confirmed by code
Inferred safely
Assumption
Gap
Conflict
Needs user decision
```

---

## Completion Report

After running this skill, report:

```md
## PRD Intelligence Complete

### Source Selected
- ...

### Latest Version
- ...

### Existing Knowledge Linked
- Frontend: ...
- Backend: ...
- Falcon components: ...

### Gaps Found
| Gap | Severity | Area | Recommended Action |
|---|---|---|---|

### Generated Artifacts
- ...

### Next Skill Chain
- ...
```

---

## Hard Rules

- Always select latest PRD version correctly.
- Always create traceability from requirement to implementation.
- Always detect gaps before implementation.
- Ask only blocking questions.
- Do not invent missing business logic.
- Do not let implementation start without acceptance criteria.
- Do not create sprint tasks without requirement links.
- Do not create PDFs/reports in random folders.
- Do not ignore backend impact when PRD touches data, statuses, permissions, APIs, or validations.
