*** Implementation Knowledge Map — source-of-truth load order ***
*** Created 2026-05-15 by Brain SK Phase 2G — flow playbooks ***

# Implementation Knowledge Map

> **The Brain SK knowledge IS the implementation spec.** When you start a new session to implement (or validate) any frontend or backend work on Falcon, this note tells you exactly which files to load — in order — so the work is grounded in the canonical source of truth.

## Permanent rule

When a session begins implementation work on a Falcon page, **load these artifacts before writing a single line of code or markup**:

1. **The flow playbook** for the user action (see "Flow playbooks" below). This is the most concentrated source — it pre-cross-references PRD + backend + V-rules + components + entities + permissions for that specific flow.
2. **The page note** in `_obsidian/10-Pages/<Page>.md` — Falcon components used · learning events · drifts on this page.
3. **The relevant PRD module(s)** — every requirement with cited PRD-line evidence.
4. **The relevant backend service notes** — DTO contracts and validation rules.
5. **The entity reconciliation notes (`E-*`)** — to know which backend fields drift from PRD.
6. **The V-rules** — every validation traced PRD → backend → frontend.
7. **The permission matrices** — who can do what.
8. **The page-level rule registries** in `Brain Outputs/understanding/pages/<page>/` — `UI_UX_RULES.md` · `VALIDATION_RULES.md` · `API_RULES.md` · `BUSINESS_RULES.md` · `GAP_REGISTRY.md`.

**If a playbook covers your flow, the playbook is enough to start. Everything else is referenced inside.** Drill deeper only when you find a gap or a drift in the playbook.

## Flow playbooks (the spec for implementation)

| Flow | Vault graph node | SoT file (canonical) | Page | PRD |
|---|---|---|---|---|
| Add Client (5-step wizard) | [[Add Client Flow]] | [`Brain Outputs/understanding/pages/organization-hierarchy/Add Client/`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/) **folder** — 17 files (`README` + 14 section files + `PLAYBOOK`). Load `README.md` first; drill into section files per task type. | [[Organization Hierarchy]] | [[01 Account Management]] |
| Add User (3-tab wizard) | [[Add User Flow]] | [`Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/flows/Add%20User.md) | [[Organization Hierarchy]] | [[02 User Management]] |
| Add Node (sub-node) | [[Add Node Flow]] | [`Brain Outputs/understanding/pages/organization-hierarchy/flows/Add Node.md`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/flows/Add%20Node.md) | [[Organization Hierarchy]] | [[01 Account Management]] |
| Edit Node (rename · scheduled rename · move ❌ · archive ❌) | [[Edit Node Flow]] | [`Brain Outputs/understanding/pages/organization-hierarchy/flows/Edit Node.md`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/flows/Edit%20Node.md) | [[Organization Hierarchy]] | [[01 Account Management]] |

Each playbook contains:
- Trigger / entry point
- Permission matrix (per-role, per-step)
- Step-by-step field tables (every field → PRD rule → backend DTO field → V-rule wiki-link → frontend validator)
- Backend endpoint summary (method · path · request · response · error codes)
- State / status transitions and Kafka side effects
- Error states + UX mapping
- Cross-flow dependencies
- Wiki-links to E-* entity notes (drift to be aware of)
- Wiki-links to V-rules (validation triangulation)
- Wiki-links to Falcon components used
- Implementation checklist (FE/BE)

## Load order for each task type

### Frontend implementation task

```text
1. IMPLEMENTATION_KNOWLEDGE_MAP (this note)
2. The flow playbook (e.g. Add Client/README.md)
3. Page note ([[Organization Hierarchy]] or the seeded page stub)
4. Falcon component notes wiki-linked in the playbook
5. V-rules wiki-linked in the playbook
6. E-* entity notes (only if drift is suspected)
7. [[35-Architecture/README]] for any architectural rule the task touches (forbidden patterns / quality gates)
8. [[ERROR_INDEX]] for any backend error code the FE must surface
```

### Backend implementation task

```text
1. IMPLEMENTATION_KNOWLEDGE_MAP (this note)
2. The flow playbook
3. Backend service note ([[Commerce Service]] / [[Identity Service]] / etc.)
4. Brain Outputs/understanding/backend/<service>/DTO_DICTIONARY.md
5. Brain Outputs/understanding/backend/<service>/VALIDATIONS.md
6. Brain Outputs/understanding/backend/<service>/ENDPOINT_REGISTRY.md
7. E-* entity reconciliation notes
8. V-rules wiki-linked in the playbook
9. [[47-Events/README]] for Kafka events the service produces or consumes
10. [[ERROR_INDEX]] for the error codes the service throws
```

### Cross-page / journey task

```text
1. IMPLEMENTATION_KNOWLEDGE_MAP (this note)
2. The journey playbook ([[16-Journeys/README]] → pick journey)
3. Each flow playbook the journey traverses
4. [[47-Events/README]] for Kafka events fired during the journey
5. [[ERROR_INDEX]] for failure-mode error codes
```

### Glossary / terminology task

```text
1. [[GLOSSARY_INDEX]] (or 05-Glossary/README.md)
2. The specific term note (e.g. [[Account]] vs [[Tenant]])
3. Related E-* entity note (if the term is an entity)
4. Related PRD note
```

### Full-stack / integration task

```text
1. IMPLEMENTATION_KNOWLEDGE_MAP (this note)
2. The flow playbook (covers FE + BE together)
3. understanding/integration/ (cross-service flows)
4. Permission matrices ([[Falcon Roles Permission Matrix]] / [[Contact Group Permission Matrix]])
5. Drill into FE or BE specifics from the playbook's wiki-links
```

### Validation task (catching drift)

```text
1. IMPLEMENTATION_KNOWLEDGE_MAP (this note)
2. VALIDATION_INDEX → 25 V-rules
3. API_INDEX → 15 E-* entity reconciliation notes
4. The relevant flow playbook's "Implementation checklist" section
```

## What "source of truth" means here

| Source | Authority |
|---|---|
| **Falcon Architecture Wiki** (`falcon-wiki/Home/Software-Architecture-Design/`) | Highest — architectural rules cannot be overridden by skill content |
| **Backend code** (`Brain Outputs/understanding/backend/<service>/`) | Concrete DTO + validator + error code authority |
| **PRD modules** (`Brain Outputs/prd/modules/`) | Business requirement authority |
| **Flow playbooks** (`Brain Outputs/understanding/pages/<page>/flows/`) | **Implementation spec — combines all of the above for a specific user action** |
| **V-rules** (`_obsidian/30-Validation/V-*.md`) | Triangulated validation: cited PRD line + backend attribute + frontend hint |
| **E-* entity notes** (`_obsidian/40-API/E-*.md`) | Side-by-side PRD entity ↔ backend DTO field reconciliation (catches drift) |
| **Page notes** (`_obsidian/10-Pages/<Page>.md`) | Page-level graph navigation |
| **Component notes** (`_obsidian/60-Components/<Component>.md`) | Falcon component dossier graph navigation |
| Falcon component dossiers (`Brain Outputs/understanding/frontend/components/<name>/`) | Component API + USAGE + TOKENS authority |
| Page learning files (`Brain Outputs/understanding/pages/<page>/PAGE_LEARNING.md` + sister files) | Page-level learning history + scorecards |

## How to verify a session is correctly grounded

Before producing any code, a session should be able to answer:

1. **Which PRD lines does this flow implement?** (cite line numbers from PRD module files)
2. **Which backend endpoint(s) will I call?** (cite from ENDPOINT_REGISTRY)
3. **What is the exact request DTO shape?** (cite from DTO_DICTIONARY)
4. **What validation will the backend enforce?** (cite from VALIDATIONS — attribute or FluentValidation rule + error code)
5. **What V-rule wiki-links apply?** (every form field should map to one)
6. **What Falcon components am I composing?** (every section/cell should map to a component note)
7. **Which permission roles can perform this action?** (cite from Falcon Roles Permission Matrix)
8. **What entity drift do I need to handle?** (cite from E-* entity reconciliation notes)

If a session cannot answer all 8 of these for the flow it's about to implement, it has not loaded enough context. Re-read the playbook + drill into its wiki-links.

## Trigger phrases for a new session

When you start a new Claude session and want to implement something:

| You type | What happens |
|---|---|
| `implement Add Client wizard` | Session loads [[Add Client Flow]] + cross-linked notes |
| `implement Add User` | Session loads [[Add User Flow]] |
| `validate Organization Hierarchy validations` | Session loads [[Organization Hierarchy]] page note + all linked V-rules |
| `what backend changes does Add Client require?` | Session loads [[Add Client Flow]] → backend-endpoint section + drilled E-* entities |
| `which V-rules apply to Settings tab?` | Session loads [[Organization Hierarchy]] → V-rules section |

## Hubs

- [[AMMAR_BRAIN_HOME]] · [[PAGE_LEARNING_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[COMPONENT_INDEX]] · [[APPROVED_PATTERNS_INDEX]]
