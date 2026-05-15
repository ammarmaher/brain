---
type: onboarding
purpose: vault-entry-point
created: 2026-05-15
---

*** 🟢 Start Here — vault onboarding ***
*** First note to read when opening this vault ***

# 🟢 Start Here

Welcome to the Falcon Brain SK Obsidian vault. This is the **graph/navigation layer** over the canonical Falcon knowledge stored under `C:\Falcon\Brain Outputs\understanding\`. Brain Outputs is the source of truth; this vault is the typed graph that lets you traverse it.

## If you're a human reading this for the first time

Read these 3 notes in order:

1. **[[AMMAR_BRAIN_HOME]]** — what's where: folder layout, top-level hubs, all the indexes
2. **[[IMPLEMENTATION_KNOWLEDGE_MAP]]** — how to do real implementation work: load order per task type, verification gate, trigger phrases
3. **[[How to contribute to this vault]]** — conventions, when to add a new V-rule vs amend, naming rules

After that:
- Open Graph View (`Ctrl+G`) — see the knowledge density
- Pick a hub from `00-Home/` based on your task type
- Drill into the wiki-link cluster around it

## If you're an AI session (Claude / agent) reading this

The auto-load chain is wired through `C:\Falcon\CLAUDE.md` → `C:\Falcon\Brain SK\CLAUDE.md` → `IMPLEMENTATION_KNOWLEDGE_MAP`. If you got here, that chain is working.

**Verification gate before producing code:** answer the 8 questions in `IMPLEMENTATION_KNOWLEDGE_MAP.md` ("How to verify a session is correctly grounded"). If you can't cite a file for each answer, drill deeper.

## Trigger phrases for common tasks

| You type | Brain auto-loads |
|---|---|
| `implement Add Client wizard` | [[Add Client Flow]] folder + all linked notes |
| `implement Add User` / `Add Node` / `Edit Node` | The matching flow playbook |
| `validate Organization Hierarchy validations` | [[Organization Hierarchy]] + every linked V-rule |
| `what backend changes does X require?` | Backend service note + endpoint registry + DTO dictionary |
| `define Account vs Tenant` | 05-Glossary terms + entity reconciliation |
| `what Kafka events does Commerce produce?` | [[BACKEND_INDEX]] + 47-Events filtered |
| `how should I handle the InsufficientBalance error?` | [[ERROR_INDEX]] + the specific error note + V-rule |
| `what are the forbidden frontend patterns?` | [[35-Architecture/README]] → Forbidden Patterns audit |

## Vault folder map

```
_templates/                    ← Templater starters for new notes
00-Home/                       ← Top-level hubs (you are here)
05-Glossary/                   ← 44 canonical Falcon terms (En/Ar)
10-Pages/                      ← Page notes + flow notes
12-Permissions/                ← 3 permission matrices
15-PRD/                        ← 6 PRD module notes
16-Journeys/                   ← 7 cross-page user journeys
30-Validation/                 ← 25 V-rule triangulation notes
35-Architecture/               ← 13 frontend architecture rule sets
40-API/                        ← 15 E-* entity reconciliation notes
45-Backend/                    ← 9 backend service notes
47-Events/                     ← 20 Kafka/Redis/webhook event notes
60-Components/                 ← 62 Falcon component notes
80-Evidence/                   ← Learning events + screenshots
90-Approved-Patterns/          ← Globally-promoted patterns
```

## Top-level hubs (the most important notes)

| Hub | Purpose |
|---|---|
| [[AMMAR_BRAIN_HOME]] | The main map — everyone starts here |
| [[IMPLEMENTATION_KNOWLEDGE_MAP]] | How to load context for implementation work |
| [[PRD_INDEX]] | 6 PRD modules · 48.3% effective coverage |
| [[BACKEND_INDEX]] | 9 backend services · Kafka topology |
| [[VALIDATION_INDEX]] | 25 triangulated validation rules |
| [[API_INDEX]] | 15 entity reconciliations (PRD↔DTO drift) |
| [[ERROR_INDEX]] | 233 error codes catalogued |
| [[GLOSSARY_INDEX]] | 44 canonical terms |
| [[COMPONENT_INDEX]] | 62 Falcon components |
| [[PAGE_LEARNING_INDEX]] | Page-learning system + 14 page stubs |
| [[FRONTEND_INDEX]] | Frontend registries + architecture |
| [[16-Journeys/README|Journeys Index]] | 7 cross-page user journeys |
| [[47-Events/README|Kafka Events Index]] | 20 platform events |
| [[35-Architecture/README|Architecture Rules Index]] | ~116 frontend rules |

## What is and isn't here

**Here (in this vault):**
- Navigation graph (wiki-links + frontmatter)
- Decomposed knowledge: V-rules · entities · components · events · errors · glossary · journeys · architecture rules · page stubs · flow playbooks
- Templates for new notes (`_templates/`)
- Vault-level CSS + config (`.obsidian/`)

**NOT here (in Brain Outputs SoT):**
- The actual rule content (V-rule definitions, backend DTOs, Kafka payloads, etc.)
- Page learning files (`Brain Outputs/understanding/pages/<page>/PAGE_LEARNING.md`)
- Flow playbook SoT (`Brain Outputs/understanding/pages/<page>/<Flow>/` folders or `flows/<Flow>.md` files)
- Reports (`Brain Outputs/reports/`)
- PRD analysis (`Brain Outputs/prd/`)

## Source-of-truth priority (when notes disagree)

1. **Falcon Architecture Wiki** (`falcon-wiki/`)
2. **Backend code** (`Brain Outputs/understanding/backend/<service>/`)
3. **PRD modules** (`Brain Outputs/prd/modules/`)
4. **Flow playbooks** (`Brain Outputs/understanding/pages/<page>/<Flow>/`)
5. **V-rules · E-entities** (triangulated from above)
6. **Page notes · Component notes** (graph navigation)
7. **Best-practice assumptions** (clearly marked as such)

## Hard rules (never break these)

- **Brain Outputs is the source of truth.** Don't put rule content in vault notes. Vault holds the graph; SoT holds the data.
- **Wiki-links use base names only** (`[[Falcon Data Table]]`, NEVER `[[60-Components/Falcon Data Table]]`).
- **Brain Outputs links use Markdown filepath** (`[label](../../../Brain%20Outputs/...)`).
- **3-line banner at the top of every note**, `## Hubs` at the bottom.
- **No edits to `.obsidian/plugins/*/data.json`, workspace.json, Copilot data, or any secret file.**
- **No commits/pushes by AI agents without explicit `commit` / `push` in the user's current message.**

## Next steps

If you're contributing knowledge → read [[How to contribute to this vault]].
If you're implementing code → read [[IMPLEMENTATION_KNOWLEDGE_MAP]].
If you're exploring → open [[AMMAR_BRAIN_HOME]] and follow the wiki-links.

## Tags

#type/onboarding #drift #security

## Hubs

- [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[How to contribute to this vault]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[COMPONENT_INDEX]]
