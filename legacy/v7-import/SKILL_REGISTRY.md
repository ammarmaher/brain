# Falcon Brain Genius v7 — Skill Registry

## Purpose

This registry lets Jakco route Ammar's natural-language requests to the right specialist skills.

Ammar does not need to remember skill names.

Jakco must read this file after `Skill.md` and before implementation.

---

## Core Router

| Intent | Trigger examples | Load skills / protocols |
|---|---|---|
| React to Angular | React, TSX, React project, React screen, convert React | `61-falcon-react-to-angular-rage-mode` + Component Mapping + Component Composition + PES/Validation if needed + `66-retest-restructure-redraw-enforcement` |
| HTML / Screenshot to Angular | HTML, CSS, screenshot, clone, copy style, live website | `62-rage-html-to-falcon-angular` + Component Mapping + Component Composition + PES/Validation if needed + `66-retest-restructure-redraw-enforcement` |
| PRD / Requirements | PRD, PDR, gaps, requirements, sprint plan, test cases | `63-prd-intelligence-and-gap-engine` + business pipeline + validation + PES + artifact governance |
| Business validation | validation, required, unique, clean, error message, field rule | `64-business-rule-validation-enforcement-engine` + PES if access/visibility is involved + backend/frontend traceability |
| PES / permissions | PES, role, permission, hide tab, disable action, field visibility, route access | `65-falcon-pes-architecture-enforcement` + Wiki/code source of truth |
| Retest / clean up / visual fix | retest, restructure, redraw, mismatch, not same, polish after implementation | `66-retest-restructure-redraw-enforcement` |
| Backend | API, controller, DTO, service, entity, Commerce, Charging, Provisioning, Identity, Gateway | Relevant Ammar backend agent + backend architecture + Wiki source of truth + validation/test skills |
| Frontend architecture | Angular, Nx, Module Federation, host-shell, admin-console, management-console | official Angular + Nx workspace + Nx Module Federation + Falcon frontend architecture |
| UI polish | polish, make better, modern, UI/UX, animation, visual QA | design-eng + polish + ui-ux-pro-max + component mapping + RRR |
| PDF / report | PDF, report, client-ready, charts, tables, export | PDF skills suite + artifact governance + PRD/sprint skills if needed |
| Bundle / performance | bundle size, performance, slow load, chunks, remoteEntry, budgets, Lighthouse | `67-falcon-bundle-performance-architect` + Nx Workspace + Nx Module Federation + Official Angular + RRR if changed |

---

## Specialist Skills

### 60 — Falcon Project Abstraction Understanding

Path:

```txt
skills/60-falcon-project-abstraction-understanding/SKILL.md
```

Use for:

```txt
Falcon architecture
Nx structure
host-shell/admin-console/management-console
Falcon UI architecture
theme/tokens
Module Federation context
```

Loads before most Falcon implementation tasks.

---

### 61 — Falcon React-to-Angular RAGE MODE

Path:

```txt
skills/61-falcon-react-to-angular-rage-mode/SKILL.md
```

Use when:

```txt
React project
React screen
React component
React route
TSX
convert React to Angular
copy React UI into Falcon Angular
```

Must also load:

```txt
Component Mapping
Component Composition
PES if access/visibility/actions exist
Validation if forms/rules exist
Retest/Restructure/Redraw
```

---

### 62 — RAGE HTML to Falcon Angular

Path:

```txt
skills/62-rage-html-to-falcon-angular/SKILL.md
```

Use when:

```txt
HTML
CSS
JS in one file
live website
screenshot clone
copy external UI
convert static design to Angular
```

Must also load:

```txt
Component Mapping
Component Composition
PES if access/visibility/actions exist
Validation if forms/rules exist
Retest/Restructure/Redraw
```

---

### 63 — PRD Intelligence and Gap Engine

Path:

```txt
skills/63-prd-intelligence-and-gap-engine/SKILL.md
```

Use when:

```txt
PRD
PDR
requirements
business analysis
gaps
sprint planning
test cases from PRD
module understanding
```

Must output:

```txt
requirements
business rules
gaps
assumptions
PES rules
validation rules
frontend/backend traceability
test cases
sprint-ready tasks
open questions
```

---

### 64 — Business Rule & Validation Enforcement

Path:

```txt
skills/64-business-rule-validation-enforcement-engine/SKILL.md
```

Use when:

```txt
validation
required
unique
clean value
format
allowed characters
error message
field rule
form rule
business rule
```

Important:

```txt
Business validation is not PES.
PES answers who can see/do/apply it.
Validation answers what is valid.
```

---

### 65 — Falcon PES Architecture Enforcement

Path:

```txt
skills/65-falcon-pes-architecture-enforcement/SKILL.md
```

Use when:

```txt
PES
permissions
roles
visibility
hide/show
disable action
route access
tab/menu/field visibility
validation visibility
data scope
```

Important:

```txt
Do not invent PES.
Do not call it PESD.
Use Falcon Wiki/code as source of truth.
Ask targeted questions if unclear.
```

---

### 66 — Retest / Restructure / Redraw Enforcement

Path:

```txt
skills/66-retest-restructure-redraw-enforcement/SKILL.md
```

Use after implementation and when:

```txt
not matching
retest
clean code
restructure
redraw
visual mismatch
polish final result
```

Must verify:

```txt
behavior
build/lint/tests where available
PES/access
validation
code simplicity
visual alignment
no regressions
```

---

## External / Existing Brain Skills

Jakco must also honor the existing brain skill catalog if installed under:

```txt
C:\falcon\brain-skills\
```

Important categories:

```txt
business-skills/
Front-End-skills/
pdf-skills/
Brain/
```

Use existing skills such as:

```txt
prd-knowledge
domain-glossary
module-catalog
test-case-authoring
official-angular
angular-tailwind
angular-upgrade
nx-workspace
nx-module-federation
noor-instructions
design-eng
polish
ui-ux-pro-max
pdf-skills
```

Do not duplicate these skills. Route to them when relevant.

---

## Natural Language Rule

If Ammar does not name a skill, infer the intent.

Do not ask: "Which skill should I use?"

Instead, say which skill chain will be used and continue.

Only ask a question if the missing information affects correctness.

---

## Skill Chain Rule

Load the smallest correct chain.

Do not load every skill blindly.

Always include architecture and RRR for implementation work.

Always include PES when access/visibility/actions/roles/tabs/fields are involved.

Always include validation when forms/business rules are involved.

Always include artifact governance when generating files/PDFs/reports.

---

### 67 — Falcon Bundle Performance Architect

Path:

```txt
skills/67-falcon-bundle-performance-architect/SKILL.md
```

Use when Ammar says:

```txt
bundle size
performance
slow load
build size
chunks
lazy loading
remoteEntry
Module Federation sharing
duplicated dependencies
assets
icons
Tailwind output
CSS size
initial JS
budgets
Lighthouse
Angular performance
```

Must also load:

```txt
Nx Workspace
Nx Module Federation
Official Angular
Falcon UI Component Mapping, if imports/components/icons are involved
Retest / Restructure / Redraw, if implementation changes
```

Must output:

```txt
build command used
current bundle/chunk findings
root cause
safe optimization plan
before/after comparison
risk level
files changed
verification commands
```
