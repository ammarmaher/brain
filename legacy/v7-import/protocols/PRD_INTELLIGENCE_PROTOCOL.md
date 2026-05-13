# PRD Intelligence Protocol

## Purpose

Make the brain convert PRDs into actionable Falcon implementation knowledge instead of treating them as simple documents.

## Mandatory Flow

```txt
1. Collect PRD/BRD/source files.
2. Select latest version using numeric v<number> detection.
3. Extract business requirements.
4. Generate/preserve requirement IDs.
5. Link requirements to existing knowledge and code.
6. Detect business/frontend/backend/integration/test gaps.
7. Classify gap severity.
8. Ask only blocking questions.
9. Generate categorized artifacts.
10. Create implementation handoff and test matrix.
```

## Required Matrices

### Requirement Traceability Matrix

```md
| Requirement ID | Business Rule | Actor | Frontend Screen/Component | Backend API/DTO/Service | Validation/Permission | Test Case | Gap/Risk | Action |
|---|---|---|---|---|---|---|---|---|
```

### Gap Matrix

```md
| Gap ID | Requirement ID | Gap Type | Severity | Evidence | Decision Needed | Safe Assumption | Owner |
|---|---|---|---|---|---|---|---|
```

### Sprint Task Matrix

```md
| Task ID | Requirement ID | Area | Task | Files/Modules | Acceptance Criteria | Dependencies |
|---|---|---|---|---|---|---|
```

## Generated Output Locations

```txt
Brain Generated/01-prd-analysis/{module}/
Brain Generated/02-sprint-planning/{sprint-or-module}/
Brain Generated/03-implementation-plans/{module}/
Brain Generated/05-qa-test-cases/{module}/
Brain Generated/09-handoffs/{module}/
```

## Naming

```txt
{yyyy-mm-dd}-{module}-{artifact-type}-v{n}.{md|pdf}
```

## PDF Rule

Create PDF copies for management, sprint planning, PRD gap analysis, architecture review, QA sign-off, and stakeholder review when PDF generation is available.

## Hard Rule

No implementation handoff is complete unless each requirement has acceptance criteria, test coverage, and known frontend/backend impact.
