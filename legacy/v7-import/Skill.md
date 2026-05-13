# Falcon Genius Brain v7

## Purpose

This is Ammar's Falcon execution brain.

It must understand Falcon architecture, route natural-language tasks to specialist skills, analyze PRDs, detect gaps, enforce business validation, apply Falcon PES correctly, convert React/HTML/screenshot/live UI into Falcon Angular, compose Falcon components properly, and verify work through Retest / Restructure / Redraw.

Ammar does not need to remember skill names.

Jakco must infer the intent and load the correct skill chain.

---

## Required Reading Order

For every Falcon task:

```txt
1. Skill.md
2. SKILL_REGISTRY.md
3. orchestration/SMART_SKILL_CHAINING_V7.md
4. MANIFEST.md
5. Relevant specialist skills under skills/**/SKILL.md
6. Falcon Wiki/code/docs when required
```

Do not load every skill blindly.

Load the smallest correct chain.

---

## Falcon Platform Context

Falcon Front-End is an Nx Angular workspace with:

```txt
apps/host-shell
apps/admin-console
apps/management-console
libs/falcon
libs/sdk
libs/falcon-theme
libs/falcon-ui-core
libs/falcon-ui-core/angular
libs/falcon-ui-react
libs/falcon-ui-vue
libs/falcon-ui-tokens
```

Core architecture:

```txt
Angular + Nx
Module Federation
zoneless Angular
Tailwind-first styling
Falcon UI components
Falcon tokens/theme system
cross-framework UI wrappers
```

PrimeNG is being replaced. Do not introduce PrimeNG for new UI unless legacy code requires it and no Falcon replacement exists.

---

## Main Rule

Before implementation, always understand:

```txt
task intent
target project/app/module
existing architecture
required skills
business rules
PES rules, if any
validation rules, if any
frontend/backend traceability
gaps/questions
files that should not be touched
```

Do not blindly code.

Do not over-engineer.

Do not duplicate Falcon components.

Do not modify unrelated files.

---

## Intent Routing

Use `SKILL_REGISTRY.md` and `SMART_SKILL_CHAINING_V7.md`.

Main chains:

```txt
React → Angular:
60 → 61 → mapping/composition → 65 if needed → 64 if needed → 66

HTML/screenshot/live UI → Angular:
60 → 62 → mapping/composition → 65 if needed → 64 if needed → 66

PRD/PDR/requirements:
63 → business skills → 64 → 65 → frontend/backend traceability → tests/artifacts

PES/permissions/visibility:
65 → Wiki/code source → validation/frontend/backend if affected → 66 if changed

Business validation:
64 → 65 if visibility/access applies → backend/frontend → tests → 66

UI composed feature:
60 → mapping → composition → Angular/Tailwind/Falcon UI → PES/validation if needed → 66

PDF/report/artifact:
pdf-skills → artifact governance → PRD/sprint/business skills if needed

Bundle/performance:
67 → Nx Workspace → Nx Module Federation → Official Angular → UI mapping if imports/icons involved → 66
```

---

## Falcon Component Mapping

For UI work, always map source UI to existing Falcon components first.

```txt
button → Falcon button
input/textarea → Falcon input pattern
dropdown/select → Falcon dropdown
table/grid → Falcon table
modal/dialog → Falcon modal
drawer/side panel → Falcon drawer/right-side modal pattern
tabs → Falcon tabs
stepper → Falcon stepper
tree → Falcon tree
card → Falcon card/Tailwind wrapper
badge/chip → Falcon badge/chip
tooltip → Falcon tooltip
skeleton/loading → Falcon skeleton
menu/actions → Falcon menu/context menu
icon → Falcon icon mapping
uploader → Falcon upload
pagination → Falcon pagination
empty state → Falcon empty state
toast/alert → Falcon alert/toast pattern
```

Never create duplicate primitives.

---

## Falcon Component Composition

Large features must be composed from Falcon components, not built as random HTML.

Before coding composed UI, define:

```txt
Feature
Target app/route
Feature sections
Existing Falcon components to use
How components compose together
Data/state owner
Inputs/outputs/events
PES dependencies
Validation dependencies
Files to create/modify
What will not be changed
```

Ownership:

```txt
Page component: route-level layout, data loading, orchestration
Feature component: reusable business UI composition
Falcon UI primitive: visual primitive behavior
Service/facade: API/data integration
Tokens/theme: reusable styling values
```

Do not build a generic composition engine for one screen.

---

## PES Rule

PES is a Falcon architecture concept.

Do not invent what PES means.

Do not rename PES to PESD.

Do not assume database validation is part of PES unless Falcon Wiki/code explicitly says so.

Until the official PES Wiki definition is loaded, treat PES only as a controlled architecture area that may affect:

```txt
screen visibility
route access
tab/menu visibility
action visibility/enabled state
field visibility/editability
validation visibility
data scope
allowed operations
forbidden/direct-route behavior
```

If unclear, ask targeted questions or document safe assumptions.

---

## PRD Rule

For PRD/PDR work, extract:

```txt
requirements
business rules
PES rules
validation rules
gaps
assumptions
frontend/backend traceability
test cases
sprint-ready tasks
open questions
```

Trace important requirements:

```txt
PRD requirement → business rule → actor/role → PES → UI → API/DTO/service/entity → validation/status rule → test case → gap/risk → implementation action
```

If the prompt only says "PRD" or is broad, ask which output is wanted:

```txt
gaps only, sprint plan, implementation plan, test cases, PDF, or all
```

---

## RAGE MODE

For React, HTML, live UI, or screenshot conversion:

```txt
Implement → Compare → Detect differences → Find root cause → Fix → Re-check → Repeat
```

Working is not enough.

The UI must look right.

Do not mark complete while visible mismatches remain.

---

## Retest / Restructure / Redraw

After implementation:

```txt
Retest: build, lint, tests if available, interactions, validation, PES/access, no regressions.
Restructure: reduce duplication/complexity, avoid over-engineering, keep code local unless reusable.
Redraw: compare UI to source and fix layout, spacing, typography, colors, borders, shadows, density, responsiveness.
```

---

## Artifact Governance

When generating files, use:

```txt
Brain Generated/
01-prd-analysis/
02-sprint-planning/
03-implementation-plans/
04-architecture-reports/
05-qa-test-cases/
06-visual-qa/
07-backend-analysis/
08-frontend-analysis/
09-handoffs/
10-business-rules/
11-pes-matrices/
12-validation-matrices/
13-gap-analysis/
14-retest-restructure-redraw/
15-skill-routing-audits/
```

Naming:

```txt
YYYY-MM-DD__module__feature__artifact-type__v01.md
YYYY-MM-DD__module__feature__artifact-type__v01.pdf
```

---

## Gap Question Rule

Ask only when missing information affects correctness.

Use:

```txt
Question:
Why it matters:
Default safe assumption if not answered:
Affected files/modules:
```

If safe, continue and document the assumption.

---

## Hard Rules

```txt
Never ask Ammar to remember skill names.
Never ignore older skills.
Never duplicate Falcon components.
Never over-engineer.
Never create random HTML when Falcon components exist.
Never redefine PES without Wiki/code.
Never implement PRD work without gaps, rules, traceability, and tests.
Never modify unrelated files.
Never delete existing implementation unless Ammar explicitly asks.
```
