# Generated Artifact Governance

## Purpose

Every generated report, plan, sprint artifact, PRD gap analysis, implementation handoff, or PDF must be categorized and named clearly.

## Root Folder

Use:

```txt
Brain Generated/
```

## Folder Structure

All generated files must be categorized by purpose. Do not dump outputs at the root. For PRD/business work, always use the module folder.

```txt
Brain Generated/
  00-inbox/
  01-prd-analysis/{module-name}/
  02-sprint-planning/{sprint-or-date}/
  03-implementation-plans/{module-name}/
  04-architecture-reports/{topic}/
  05-qa-test-cases/{module-name}/
  06-visual-qa/{module-name}/
  07-backend-analysis/{module-name}/
  08-frontend-analysis/{module-name}/
  09-handoffs/{module-name}/
  99-archive/
```

## Naming Convention

```txt
{yyyy-mm-dd}-{module-or-feature}-{artifact-type}-v{number}.{extension}
```

Examples:

```txt
2026-05-12-organization-hierarchy-prd-gap-analysis-v1.md
2026-05-12-wallet-transfer-business-test-matrix-v2.pdf
2026-05-12-admin-console-react-to-angular-rage-plan-v1.md
```

## Required Metadata

Each artifact starts with:

```txt
Title:
Module:
Artifact type:
Source:
Generated date:
Owner:
Related skill chain:
Status:
```

## PDF Rule

Generate PDF versions when the artifact is for:

- sprint planning
- PRD/BRD gap analysis
- executive/management review
- architecture review
- business requirement sign-off
- QA sign-off
- implementation wave planning

PDFs should include clean headings, tables, and visual grouping. Charts/tables must be readable and meaningful.

## Business Coverage Rule

For PRD/business artifacts include:

- Business requirement summary
- Actors/roles
- Business workflow
- Permission/status matrix
- Validation rules
- Edge cases
- Backend impact
- Frontend impact
- DTO/API impact
- Test scenarios
- Regression risks
- Gaps/questions
- Acceptance criteria



## PRD-Specific Artifact Set

For PRD work, generate these artifacts when relevant:

```txt
01-prd-analysis/{module}/
  {date}-{module}-prd-understanding-v{n}.md
  {date}-{module}-prd-gap-analysis-v{n}.md
  {date}-{module}-requirement-traceability-matrix-v{n}.md

02-sprint-planning/{sprint-or-module}/
  {date}-{module}-sprint-ready-plan-v{n}.md

03-implementation-plans/{module}/
  {date}-{module}-frontend-backend-implementation-plan-v{n}.md

05-qa-test-cases/{module}/
  {date}-{module}-business-test-matrix-v{n}.md

09-handoffs/{module}/
  {date}-{module}-claude-implementation-prompt-v{n}.md
  {date}-{module}-gemini-validation-prompt-v{n}.md
```

## PRD Metadata

Every PRD artifact must include:

```txt
Title:
Module:
PRD source/version:
Generated date:
Owner:
Related skill chain:
Status:
Linked frontend areas:
Linked backend areas:
Open gaps count:
Blocking questions count:
```

## Requirement Coverage Rule

A PRD artifact is incomplete unless it covers:

```txt
Business requirements
Actors/roles
Workflows
Permissions
Statuses/lifecycle
Validations
Frontend impact
Backend impact
DTO/API/entity impact
Known code paths
Gaps/questions
Acceptance criteria
Test scenarios
Regression risks
Implementation waves
```
