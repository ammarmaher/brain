# Smart Skill Chaining v7

## Purpose

This file defines how Jakco loads specialist skills based on Ammar's natural-language task.

Ammar does not need to remember skill names.

---

## Default Flow

```txt
Read Skill.md
→ Read SKILL_REGISTRY.md
→ Identify intent
→ Choose smallest correct skill chain
→ Read specialist SKILL.md files
→ Execute
→ Retest/Restructure/Redraw if implementation changed
→ Generate artifacts if requested
```

---

## Chain 1 — React to Falcon Angular

Triggers:

```txt
React, TSX, React project, React screen, React component, convert React
```

Chain:

```txt
60 Project Abstraction
→ 61 React-to-Angular RAGE MODE
→ Component Mapping rules from Skill.md/registry
→ Component Composition rules
→ 65 PES if permissions/visibility/actions/tabs/fields exist
→ 64 Validation if forms/business rules exist
→ 66 Retest/Restructure/Redraw
```

---

## Chain 2 — HTML / Screenshot / Live UI to Falcon Angular

Triggers:

```txt
HTML, CSS, screenshot, image, live website, clone this, copy style, same UI
```

Chain:

```txt
60 Project Abstraction
→ 62 HTML-to-Falcon Angular RAGE MODE
→ Component Mapping rules
→ Component Composition rules
→ 65 PES if permissions/visibility/actions/tabs/fields exist
→ 64 Validation if forms/business rules exist
→ 66 Retest/Restructure/Redraw
```

---

## Chain 3 — PRD / PDR / Sprint / Business Analysis

Triggers:

```txt
PRD, PDR, requirements, gaps, sprint, test cases, business analysis
```

Chain:

```txt
63 PRD Intelligence
→ business-skills/prd-knowledge if installed
→ business-skills/domain-glossary if installed
→ business-skills/module-catalog if installed
→ 64 Business Rule & Validation
→ 65 PES
→ Backend skill if APIs/entities/services exist
→ Frontend architecture skill if screens/components exist
→ test-case-authoring if tests requested
→ Artifact Governance
```

If the request is broad, ask:

```txt
Do you want gaps only, sprint plan, implementation plan, test cases, PDF, or all?
```

---

## Chain 4 — PES / Permissions / Visibility

Triggers:

```txt
PES, permissions, roles, hide, show, disable, access, route, tab, menu, field visibility
```

Chain:

```txt
65 PES Enforcement
→ Falcon Wiki/code source of truth
→ 64 Validation if validations are affected
→ Frontend/backend relevant skill
→ 66 RRR if implementation changed
```

---

## Chain 5 — Business Validation

Triggers:

```txt
validation, required, unique, clean, format, error message, business rule
```

Chain:

```txt
64 Business Rule & Validation
→ 65 PES if access/visibility matters
→ Backend/API skill if server behavior is involved
→ Frontend skill if UI behavior is involved
→ test-case-authoring
→ 66 RRR
```

---

## Chain 6 — Backend/API

Triggers:

```txt
API, controller, DTO, service, entity, Mapperly, backend, Commerce, Charging, Provisioning, Identity, Gateway
```

Chain:

```txt
Relevant Ammar backend agent
→ Wiki architecture docs
→ Backend architecture skill
→ 64 Business Validation
→ Frontend traceability if UI affected
→ Tests
```

---

## Chain 7 — UI Composition / Component Feature

Triggers:

```txt
table with dropdowns, drawer form, stepper, tabs, tree, composed component, use our components
```

Chain:

```txt
60 Project Abstraction
→ Component Mapping
→ Component Composition
→ Angular Tailwind / Falcon UI Core
→ 65 PES if access/visibility/actions exist
→ 64 Validation if forms/rules exist
→ 66 RRR
```

---

## Chain 8 — PDF / Reports / Artifacts

Triggers:

```txt
PDF, report, artifact, sprint document, client-ready, charts, tables, export
```

Chain:

```txt
pdf-skills
→ Artifact Governance
→ PRD/Sprint/Business skill if content is requirement-based
```

---

## Question Policy

Ask targeted questions only when needed.

Use:

```txt
Question:
Why it matters:
Default safe assumption if not answered:
Affected files/modules:
```

Otherwise continue with a safe assumption and document it.


---

## Chain 9 — Bundle Size / Performance / Build Optimization

Triggers:

```txt
bundle size, performance, slow load, build size, chunks, lazy loading, remoteEntry, Module Federation sharing, duplicated dependencies, assets, icons, Tailwind output, CSS size, budgets, Lighthouse, initial load, Angular performance
```

Chain:

```txt
67 Bundle Performance Architect
→ Nx Workspace
→ Nx Module Federation
→ Official Angular
→ Falcon UI Component Mapping if UI imports/components/icons are involved
→ 66 Retest/Restructure/Redraw if code changes
```

Rules:

```txt
Analyze before changing code.
Compare before/after.
Do not break Module Federation.
Do not remove shared dependencies blindly.
Do not optimize tiny gains with risky architecture changes.
Prefer lazy loading, import cleanup, route-level splitting, asset optimization, icon tree-shaking, safe dependency sharing, and budget enforcement.
```
