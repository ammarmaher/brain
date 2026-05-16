---
type: master-index
purpose: "Answers 'where is every piece of Falcon knowledge + which cluster owns which question + which trigger phrase loads it'. Open at session start as the single entry point to ALL Falcon knowledge stores."
audience: all AI agents + developers + QA + Ammar
scope: cross-knowledge-base navigator
created: 2026-05-16
covers:
  - authority-dataset (this dataset — authority + validation + drift + BR + view-hide + port + freshness + error + flow + pitfall + trigger)
  - brain-outputs/understanding (per-page + per-component + per-service deep knowledge)
  - brain-skills (rule books — angular + tailwind + nx + UI/UX + business + PDF)
  - falcon-wiki (Obsidian SoT vault — PRD + pages + components + services + endpoints + gaps)
  - Brain SK/_obsidian (Brain SK graph vault — V-rules + E-* entities + permissions + journeys)
  - prd/modules (canonical PRD content per module)
  - old-ui-dataset (the proven-working feature inventory from origin/main)
---

# Falcon Knowledge — Master Index

> [!tldr]
> **Read this FIRST.** Every other Falcon knowledge file is downstream of this index. If you're an AI agent starting a session on any Falcon question, this file tells you exactly which knowledge store owns your answer and how to load it.

> [!warning]
> Different stores have different verification levels. See `VERIFICATION-STATUS.md` BEFORE treating any claim as production truth.

## The 7 Falcon knowledge stores

| # | Store | Path | Owns | Verification level |
|---|---|---|---|---|
| 1 | **Authority Dataset** (this) | `C:\Falcon\Brain Outputs\datasets\authority-dataset\` | Who can do what · validation · drift · business rules · view-hide · port recipe · freshness · errors · flow integration · pitfalls · trigger phrases | 🟢🟡✋ Mixed — see `VERIFICATION-STATUS.md` |
| 2 | **Brain Outputs · Understanding** | `C:\Falcon\Brain Outputs\understanding\` | Per-service deep specs (endpoints/DTOs/validations/errors) · Per-page learning · Per-component dossiers (62 of them) · Cross-service integration | 🟡 Structurally maintained by Brain SK skills |
| 3 | **Brain Skills** | `C:\Falcon\brain-skills\` + `C:\Falcon\Brain SK\skills\` | Rule books for Angular/Tailwind/Nx/PrimeNG-removal/UI-UX/Business analysis/PRD sync/test authoring/PDF generation | 🟡 Authoritative for the rule it codifies |
| 4 | **Falcon Wiki (Obsidian SoT)** | `C:\Falcon\falcon-wiki\` | Architecture wiki (Azure DevOps sync) · PRDs as typed notes · Pages · Components · Tokens · Services · Endpoints · Gaps · Questions · Tests · Authority projections (`100-Authority/`) | 🟡 Source-prefix-rule enforced |
| 5 | **Brain SK Obsidian** | `C:\Falcon\Brain SK\_obsidian\` | Pages · UI/UX rules · Validation V-rules (25) · API E-* entities (15) · Components · Gaps · Evidence · Approved patterns · Permissions matrices · Backend specs · Events · Architecture · Journeys | 🟡 Structurally maintained |
| 6 | **PRD Modules** | `C:\Falcon\Brain Outputs\prd\modules\` | Canonical PRD content (`latest-prd.md` + `BUSINESS_RULES.md` + `ENTITIES.md` + `WORKFLOWS.md` + `QUESTIONS.md` per module) | 🟢 Synced from Drive |
| 7 | **Old-UI Dataset** | `C:\Falcon\Brain Outputs\datasets\old-ui-dataset\` | Per-page 9-file dossiers extracted from `origin/main` of falcon-web-platform-ui — the PROVEN feature inventory with working backend integration | 🟢 Code-grounded |

## Routing table — "If you're asking X, look here"

Use this table to decide WHERE to load knowledge from. Trigger phrases listed.

### Authority + permissions questions

| Question | Primary store | Specific file | Trigger phrase |
|---|---|---|---|
| Who has what permission? | Authority Dataset | `01-roles/<role>.md` | `full action inventory for <role>` |
| What does each PES key check? | Authority Dataset | `03-pes-keys/REGISTRY-RAW.md` | `what does FalconAccess.X.Y check` |
| Can role X do action Y on resource Z? | Authority Dataset | `05-capability-maps/<role>.capability.md` | `can <role> do <action>` |
| What's the role-edit matrix? | Authority Dataset | `01-roles/<role>.md` Role-edit reach section | `who can promote acc-admin` |
| Does PRD agree with PES catalog? | Authority Dataset | `07-cross-cutting/permission-sheet-gaps.md` | `audit PES vs PRD sheet drift` (BLOCKED) |
| What are the test users + credentials? | Authority Dataset | `07-cross-cutting/test-users.md` | `seeded test user credentials` |

### Feature-shape questions

| Question | Primary store | Specific file | Trigger phrase |
|---|---|---|---|
| What's Falcon-only vs Client-only vs Shared? | Authority Dataset | `04-feature-parity-matrix/MATRIX.md` | `falcon vs client` · `authority dataset` |
| How does feature F differ admin vs mgmt? | Authority Dataset | `04-feature-parity-matrix/<feature>.compare.md` | `compare <feature> admin vs mgmt` |
| Full implementation context for feature F? | Brain Outputs/Understanding | `understanding/pages/<page>/` (14+ files) | `understanding for <page>` |
| Old UI shape of feature F? | Old-UI Dataset | `datasets/old-ui-dataset/10-pages/<app>/<feature>/00-08.md` | `old UI <feature> details` |

### Validation + business rules

| Question | Primary store | Specific file | Trigger phrase |
|---|---|---|---|
| Which V-rules apply to feature F? | Authority Dataset | `06-validation-by-feature/MATRIX.md` | `what V-rules apply to <feature>` |
| Detailed V-rule with PRD↔backend↔FE trace? | Brain SK Obsidian | `_obsidian/30-Validation/V-<rule>.md` | `V-<rule-id> detail` |
| What business rules govern feature F? | Authority Dataset | `09-business-rules-by-feature/MATRIX.md` | `what business rules govern <feature>` |
| Detailed BR-* in context? | PRD Modules | `prd/modules/<module>/BUSINESS_RULES.md` | `BR-AM-15 detail` (or any rule id) |

### Backend questions (DTOs · endpoints · errors · Kafka)

| Question | Primary store | Specific file | Trigger phrase |
|---|---|---|---|
| What entity drift affects feature F? | Authority Dataset | `08-entity-drift-by-feature/MATRIX.md` | `what entity drift on <feature>` |
| Detailed entity reconciliation? | Brain SK Obsidian | `_obsidian/40-API/E-<entity>.md` | `E-<entity> drift detail` |
| Service endpoint registry? | Brain Outputs/Understanding | `understanding/backend/<service>/ENDPOINT_REGISTRY.md` | `endpoints for <service>` |
| Service DTO dictionary? | Brain Outputs/Understanding | `understanding/backend/<service>/DTO_DICTIONARY.md` | `DTOs for <service>` |
| Service validators (FluentValidation + ThrowIf)? | Brain Outputs/Understanding | `understanding/backend/<service>/VALIDATIONS.md` | `validators for <service>` |
| Service error codes? | Brain Outputs/Understanding | `understanding/backend/<service>/ERRORS.md` | `errors for <service>` |
| Platform-wide error catalog with HTTP status? | Authority Dataset | `13-error-catalog/CATALOG.md` | `what error codes does <feature> surface` |
| FE error contract? | Authority Dataset | `13-error-catalog/FE-CONTRACT.md` | `frontend error contract` |
| Kafka events feature F produces/consumes? | Brain Outputs/Understanding | `understanding/pages/<page>/10-KAFKA_SIDE_EFFECTS.md` (where exists) | `Kafka for <feature>` |

### Frontend questions (components · forms · i18n · UI)

| Question | Primary store | Specific file | Trigger phrase |
|---|---|---|---|
| Which Falcon UI Core component to use? | Brain Outputs/Understanding | `understanding/frontend/components/<comp>/` (62 dossiers) | `<component-name> details` |
| Component API + props + variants? | Brain Outputs/Understanding | `understanding/frontend/components/<comp>/API.md` |  |
| Component usage in pages? | Brain Outputs/Understanding | `understanding/frontend/components/<comp>/USAGE.md` |  |
| What non-PES gates hide UI on feature F? | Authority Dataset | `10-non-pes-gates-by-feature/MATRIX.md` | `what hides UI besides PES on <feature>` |
| FE form patterns (3-layer validation)? | Authority Dataset | `06-validation-by-feature/MATRIX.md` § architecture | `3-layer validation` |
| 8 Falcon validation directives? | Authority Dataset | `06-validation-by-feature/MATRIX.md` § directives | `Falcon validation directives` |
| Angular/Tailwind/Nx coding rules? | Brain Skills | `brain-skills/Front-End-skills/<skill>/Skill.md` | `angular tailwind rules` |
| UI/UX guidelines (67 styles · 161 palettes · 99 rules)? | Brain Skills | `brain-skills/Front-End-skills/ui-ux-pro-max-skill/` | `UI UX pro max guidance` |

### Implementation + porting

| Question | Primary store | Specific file | Trigger phrase |
|---|---|---|---|
| How to copy feature admin → mgmt? | Authority Dataset | `11-copy-playbook/copy-admin-feature-to-mgmt.md` | `copy <feature> from admin to mgmt` |
| Namespace flip checklist? | Authority Dataset | `11-copy-playbook/namespace-flip.checklist.md` | `namespace flip checklist` |
| Gateway flip checklist? | Authority Dataset | `11-copy-playbook/gateway-flip.checklist.md` | `gateway flip checklist` |
| Full A→Z trace for ONE feature? | Authority Dataset | `18-a-to-z-traces/Add-Client.trace.md` | `A to Z trace for Add Client` |
| Implementation spec for a specific page? | Brain Outputs/Understanding | `understanding/pages/<page>/` | `implement <page>` |
| Flow playbook for ONE user action? | Brain Outputs/Understanding | `understanding/pages/<page>/<flow>/` (folder) or `flows/<Flow>.md` (single) | `implement <flow>` |

### Pitfalls + anti-patterns

| Question | Primary store | Specific file | Trigger phrase |
|---|---|---|---|
| What pitfalls should I watch for? | Authority Dataset | `15-implementation-pitfalls/PITFALLS.md` | `implementation pitfalls` |
| What anti-patterns NOT to copy from old UI? | Authority Dataset | `15-implementation-pitfalls/ANTI-PATTERNS.md` | `what anti-patterns should I avoid` |
| Pre-port grep checklist? | Authority Dataset | `15-implementation-pitfalls/ANTI-PATTERNS.md` § grep | `pre-port grep checklist` |
| "If I see X, check Y first" cheat sheet? | Authority Dataset | `15-implementation-pitfalls/PITFALLS.md` § cheat sheet | `if I see broken UI for X` |
| Falcon UI Core layout traps? | Memory | `feedback_falcon_ui_core_layout_traps.md` | (auto-loaded on UI tasks) |

### Operations + verification

| Question | Primary store | Specific file | Trigger phrase |
|---|---|---|---|
| Drift in source files? | Authority Dataset | `falcon-wiki/scripts/scan-authority.ps1 -CheckOnly` | `audit drift` |
| What's verified vs not? | Authority Dataset | `VERIFICATION-STATUS.md` | `verification status` |
| How to bring up local backend? | Falcon Wiki | `falcon-wiki/00-MOCs/Local-Backend-Bring-Up.md` | `bring up the backend` |
| How to login locally? | Falcon Wiki | `falcon-wiki/00-MOCs/Local-Auth-Recipe.md` | `how do I log in locally` |
| Authorization model overview? | Falcon Wiki | `falcon-wiki/00-MOCs/Authorization-Security-MOC.md` | `local auth` · `local login` |

### Architecture + governance

| Question | Primary store | Specific file |
|---|---|---|
| Architecture vision? | Falcon Wiki | `falcon-wiki/Home/Software-Architecture-Design/Architecture-Vision.md` |
| Clean architecture + DDD? | Falcon Wiki | `falcon-wiki/Home/Software-Architecture-Design/Clean-Architecture-project-structure-&-business-concepts.md` |
| Design patterns + naming? | Falcon Wiki | `falcon-wiki/Home/Software-Architecture-Design/Design-Patterns-&-Guidelines.md` |
| Frontend architecture? | Falcon Wiki | `falcon-wiki/Home/Software-Architecture-Design/Front-End-Architecture.md` |
| Security architecture? | Falcon Wiki | `falcon-wiki/Home/Software-Architecture-Design/Security-Architecture.md` |
| PBAC permissions module? | Falcon Wiki | `falcon-wiki/Home/Software-Architecture-Design/Permissions-&-Authorization-Module-(Policy-Based-Access-Control).md` |

## Session-start protocol for AI agents

When opening a new Falcon session:

1. **Read this file** — get oriented to all knowledge stores
2. **Read `VERIFICATION-STATUS.md`** in the authority dataset — know what's tested vs what's not
3. **Identify the task type** — authority? feature shape? implementation? test? port? bug? operational?
4. **Use the routing table above** to find the OWNING store for your question
5. **Load the specific file** the routing table points at
6. **If multiple stores might own the answer**, prefer in order: PRD Modules > Brain Outputs/Understanding > Authority Dataset > Falcon Wiki > Brain SK Obsidian > Brain Skills > Old-UI Dataset
7. **Source-prefix every fact** in your output: `[CODE]` (file:line), `[BRAIN-OUT]`, `[VAULT]`, `[BRAIN-SK]`, `[MEMORY]`, `[INFERRED]`

## The 12-axis question this knowledge ecosystem answers

| Axis | Owning store | Primary file |
|---|---|---|
| 1 — Authority | Authority Dataset | `05-capability-maps/<role>.capability.md` |
| 2 — Feature shape | Authority Dataset | `04-feature-parity-matrix/<feature>.compare.md` |
| 3 — Validation | Authority Dataset + Brain SK | `06-validation-by-feature/MATRIX.md` + `30-Validation/V-*.md` |
| 4 — Entity drift | Authority Dataset + Brain SK | `08-entity-drift-by-feature/MATRIX.md` + `40-API/E-*.md` |
| 5 — Business rules | Authority Dataset + PRD | `09-business-rules-by-feature/MATRIX.md` + `prd/modules/<n>/BUSINESS_RULES.md` |
| 6 — Non-PES gates | Authority Dataset | `10-non-pes-gates-by-feature/MATRIX.md` |
| 7 — Port recipe | Authority Dataset | `11-copy-playbook/copy-admin-feature-to-mgmt.md` |
| 8 — Freshness | Authority Dataset | `falcon-wiki/scripts/scan-authority.ps1` |
| 9 — Errors | Authority Dataset + Brain Outputs | `13-error-catalog/CATALOG.md` + `understanding/backend/<svc>/ERRORS.md` |
| 10 — Flow integration | Authority Dataset + Brain Outputs | `14-flow-playbook-integration/MATRIX.md` + `understanding/pages/<page>/<flow>/` |
| 11 — Pitfalls | Authority Dataset | `15-implementation-pitfalls/PITFALLS.md` + `ANTI-PATTERNS.md` |
| 12 — Trigger phrases | Authority Dataset | `16-trigger-phrases/_INDEX.md` |
| **13 — A→Z trace (NEW)** | **Authority Dataset** | **`18-a-to-z-traces/Add-Client.trace.md`** |

## Knowledge store status

| Store | Maintained by | Last sync | Notes |
|---|---|---|---|
| Authority Dataset | Manual + scanner | 2026-05-16 | Self-maintaining via `scan-authority.ps1` watching 67 source files |
| Brain Outputs/Understanding | Brain SK skills | rolling | Per-skill responsibility (incremental-scan etc.) |
| Brain Skills | Hand-maintained | n/a | Code rule books — change when stack changes |
| Falcon Wiki | Azure DevOps weekly sync + manual | last Sunday | Architecture wiki + typed PRD notes |
| Brain SK Obsidian | Brain SK skills | rolling | Permissions matrices · V-rules · E-* entities |
| PRD Modules | Drive sync (manual) | 2026-04 (PRD-02 Tab 2 still uncaptured — Q-UM-07) | |
| Old-UI Dataset | Frozen snapshot of `origin/main` of falcon-web-platform-ui | 2026-05-16 | The "what was proven to work" reference |

## What this Master Index does NOT replace

This file is a **router**. It does NOT contain:
- Detailed answers to questions (those are in the specific stores)
- Code samples beyond illustrative snippets (those are in the source code)
- Decisions about which approach is "best" (those go in ADRs — TBD)
- Cross-cluster drift audits (those would be a separate Phase 2.5)

When in doubt, follow the routing table → load the specific file → cite with source prefix.

## See also

- `00-INDEX.md` — Authority dataset's own internal index
- `00-VERIFICATION-GATE.md` — 19 falsifiable questions the dataset must answer
- `VERIFICATION-STATUS.md` — what's verified vs not at runtime
- `16-trigger-phrases/_INDEX.md` — full trigger phrase catalog (~45 phrases × 9 categories)
- `18-a-to-z-traces/Add-Client.trace.md` — the canonical A→Z trace template
- All vault projections in `falcon-wiki/100-Authority/` + `Brain SK/_obsidian/40-Authority/`

## Final word

> If you read this file and find a question that has NO entry in the routing table — that's a real gap. File an issue or add it directly. The Master Index is a living document; it should answer "where does this knowledge live?" for every Falcon question. If it can't, the knowledge ecosystem itself has a gap.
