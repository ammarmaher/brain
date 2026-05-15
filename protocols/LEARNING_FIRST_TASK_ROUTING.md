*** Brain SK — Learning-First Task Routing ***
*** Path: protocols/LEARNING_FIRST_TASK_ROUTING.md ***
*** Created: 2026-05-15 ***

# Learning-First Task Routing

Every implementation, edit, bug fix, screenshot analysis, visual repair, or page task in Brain SK **starts with the correct learning process**. Brain SK must NOT jump directly into implementation when the user provides screenshots, source pages, visual bugs, or page instructions. It must first create a Light Learning event AND load the relevant page/component knowledge.

## Permanent rule

> **Brain SK must not jump directly into implementation when the user provides screenshots, source pages, visual bugs, or page instructions. It must first create a Light Learning event and load page/component knowledge before producing any code, plan, or fix.**

This rule applies to every Adnan / Ammar agent on every turn. The only exception is a one-shot trivial task that touches neither a page nor a component (e.g. updating an unrelated config file) — and even then, the agent must explicitly state "no page/component touched, skipping Light Learning."

## Six routing modes

### 1. Quick prompt / quick bug / screenshot / red X / green tick

**Always** run Light Learning Intake first.

Save:
- user prompt (verbatim)
- screenshot if provided
- visible notes (transcribed)
- red border focus if visible
- ❌ as wrong/rejected candidate
- ✅ as approved/correct candidate
- page guess
- section guess
- component guess
- a single pending learning event in `LIGHT_LEARNING_EVENTS.md`

Do NOT deeply analyse the whole page unless explicitly requested. Do NOT approve, reject, or promote anything. Echo a 1–3 line acknowledgement.

### 2. Page implementation task

Before implementation, **load** (do not skip any). All paths anchor at the canonical knowledge root [`Brain Outputs/understanding/`](../../Brain%20Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md):

**Step 0 (read first):** [`_obsidian/00-Home/IMPLEMENTATION_KNOWLEDGE_MAP.md`](../_obsidian/00-Home/IMPLEMENTATION_KNOWLEDGE_MAP.md) — top-of-session entry that tells you which flow playbook to load + per-task load order.

**Step 1:** If the user action has a **flow playbook** at `understanding/pages/<page>/flows/<Flow Name>.md`, load it FIRST. The playbook is the most concentrated source — it pre-cross-references PRD + backend + V-rules + components + permissions for that specific flow.

Available Organization Hierarchy flow playbooks (Phase 2G):
- `understanding/pages/organization-hierarchy/Add Client/` — **folder form (17 files)**. Load `README.md` first; drill into section files per task type. Sections: `00-OVERVIEW` · `01-PERMISSIONS` · `02-STEP_1_BASIC_INFO` · `03-STEP_2_SETTINGS` · `04-STEP_3_COMM_CHANNELS` · `05-STEP_4_APPS_SERVICES` · `06-STEP_5_ACCOUNT_OWNER` · `07-VALIDATIONS` · `08-BACKEND_API` · `09-COMPONENTS` · `10-KAFKA_SIDE_EFFECTS` · `11-STATE_TRANSITIONS` · `12-ERROR_STATES` · `13-GAPS_AND_DRIFTS` · `14-IMPLEMENTATION_CHECKLIST` · `PLAYBOOK` (full single-doc).
- `understanding/pages/organization-hierarchy/flows/Add User.md` (3-tab wizard) — single file
- `understanding/pages/organization-hierarchy/flows/Add Node.md` (sub-node creation) — single file
- `understanding/pages/organization-hierarchy/flows/Edit Node.md` (rename + scheduled rename) — single file

**Step 2-13:** then the standard load list:

1. `understanding/pages/<page>/PAGE_LEARNING.md` for the target page
2. `understanding/pages/<page>/PENDING_PAGE_PATTERNS.md` + `APPROVED_PAGE_PATTERNS.md`
3. Global patterns under `understanding/frontend/patterns/`
4. Component knowledge dossiers for every Falcon component touched — `understanding/frontend/components/<component>/` (`OVERVIEW`, `API`, `USAGE`, `TOKENS`, `GAPS_AND_UPGRADES`, `DECISION`)
5. Falcon Eyes reports if relevant — `Brain Outputs/reports/falcon-eyes/<run>/`
6. `understanding/pages/<page>/UI_UX_RULES.md`
7. `understanding/pages/<page>/VALIDATION_RULES.md`
8. `understanding/pages/<page>/API_RULES.md`
9. `understanding/pages/<page>/BUSINESS_RULES.md`
10. `understanding/pages/<page>/GAP_REGISTRY.md`
11. `understanding/pages/<page>/EVIDENCE_INDEX.md`
12. `understanding/pages/<page>/PAGE_SCORECARD.md`

For full-stack work, additionally load `understanding/backend/<service>/` (`SERVICE_OVERVIEW.md`, `ENDPOINT_REGISTRY.md`, `DTO_DICTIONARY.md`, `VALIDATIONS.md`, `ERRORS.md`, `FRONTEND_CONTRACT.md`) and `understanding/integration/` (`INTEGRATION_OVERVIEW.md`, `API_TO_COMPONENT_TRACE.md`, `READINESS_MATRIX.md`, `GAP_LIST.md`).

Then create a plan before coding. Implementation begins only after the plan exists.

**Verification gate:** before producing code, the session must be able to answer all 8 verification questions in [`IMPLEMENTATION_KNOWLEDGE_MAP.md`](../_obsidian/00-Home/IMPLEMENTATION_KNOWLEDGE_MAP.md) ("How to verify a session is correctly grounded"). If it can't, it has not loaded enough context.

### Canonical knowledge root — per-task load order

Every task anchors at the canonical knowledge root [`Brain Outputs/understanding/`](../../Brain%20Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md):

| Task type | Loads (in order) |
|---|---|
| Frontend | `understanding/frontend/` (registries + `patterns/` + per-component dossier) + page `understanding/pages/<page>/` if named |
| Backend | `understanding/backend/<service>/` + `understanding/integration/` if cross-service |
| Full-stack | `understanding/frontend/` + `understanding/backend/<service>/` + `understanding/integration/` + `understanding/pages/<page>/` |
| Page | `understanding/pages/<page-name>/` (all 14+ files) + relevant component dossiers + Falcon Eyes reports |
| Screenshot / bug | `understanding/pages/<page>/evidence/<learningId>/` (save first) + relevant component dossier + Falcon Eyes report if generated |

### 3. Bug fix task

Before fixing:

1. Save the bug prompt/screenshot as evidence under `evidence/<learningId>/`.
2. Map the bug to page / section / component.
3. Check approved patterns for the page + the component.
4. Check related gaps in `GAP_REGISTRY.md`.
5. Check the component knowledge dossier.
6. Fix only the required scope — no opportunistic refactors.
7. Update learning **only** if the fix is important or reusable (otherwise leave a `pending` event without promoting).

### 4. Screenshot comparison task

Use **Falcon Eyes** first.

- Save source / destination / diff images and per-screenshot reports.
- Create the semantic mismatch backlog.
- Map mismatches to Falcon components.
- Do **NOT** repair unless the prompt explicitly asks for repair.

Repair scope is whatever Ammar names in the prompt (e.g. `Run Falcon Eyes and repair only the table`) — never broader.

### 5. Deep learning task

Runs **only** when Ammar explicitly says one of:

- `deep learn`
- `update vault`
- `approve this pattern`
- `promote this globally`
- `learn this page`
- `this is the approved way`

Deep learning must:

1. Review pending learning events.
2. Update page rules (approve / reject / deprecate per Ammar's words).
3. Update `PAGE_SCORECARD.md` from APPROVED files only.
4. Update the Obsidian graph additively (page note + 00-Home hubs + component notes).
5. Promote only approved rules.
6. Keep unapproved rules pending.

### 6. Global promotion

Page-specific rule cannot become global automatically. Promotion runs **only** when Ammar explicitly approves (`promote this globally`, `promote PP-### globally`, `promote to global <pattern> pattern`). Even an approved page rule stays page-specific until Ammar says promote.

## Decision tree (use this every turn)

```
1. Is there a screenshot or source page in the prompt?
   YES → Light Learning Intake (mode 1) + then read mode 2/3/4 to decide next step.
   NO  → continue.

2. Does Ammar's prompt contain a Deep Learning trigger phrase?
   YES → mode 5 (Deep Page Learning).
   NO  → continue.

3. Does Ammar's prompt contain a global-promotion trigger phrase?
   YES → mode 6 (Global promotion gate). Verify the rule is already APPROVED.
   NO  → continue.

4. Is this a screenshot comparison / visual parity task?
   YES → mode 4 (Falcon Eyes). Repair only if prompt says so.
   NO  → continue.

5. Is this a bug fix?
   YES → mode 3 (Bug fix task).
   NO  → continue.

6. Is this a page implementation task?
   YES → mode 2 (Page implementation). LOAD all 12 artifacts, plan, then code.
   NO  → trivial / non-page task. State "no page/component touched, skipping Light Learning" and proceed.
```

## Trigger phrase reference

| Trigger phrase | Mode | What runs |
|---|---|---|
| (any prompt with page/component context) | 1 | Light Learning Intake |
| "Light learn this screenshot" | 1 | `/learn-screenshot` |
| "Run Falcon Eyes, no repair" | 4 | Falcon Eyes report only |
| "Run Falcon Eyes and repair only the table" | 4 + scoped repair | Falcon Eyes + scoped repair on `<section>` |
| "Deep learn Organization Hierarchy" | 5 | `/deep-learn-page organization-hierarchy` |
| "Approve this table pattern" | 5 | `/approve-pattern <id>` (apply to most recent pending table pattern) |
| "Promote this to global Falcon table pattern" | 6 | `/promote-pattern <id>` → `TABLE_PATTERN.md` |
| "This is the approved way" | 5 | Treat most recent pending pattern as approval candidate; ask Ammar for the explicit id. |

## Hard constraints (re-stated)

- Nothing becomes approved automatically.
- Nothing becomes global automatically.
- Screenshot interpretation is NEVER an approval — Ammar's words set status.
- Page-specific rules stay page-specific unless Ammar says `promote this globally`.
- Scorecards count APPROVED entries only.
- Any scorecard dimension < 60 % → `NEEDS ATTENTION`.
- No commits, no pushes without an explicit `commit` / `push` in the current message.
- Mirror to `Brain SK\outputs\` is additive only (`robocopy /E /XO`, never `/MIR`).
- No edits to `_obsidian/.obsidian/`, plugin `data.json`, `workspace.json`, secrets.

## Companion files

- Canonical skill: [`domains/frontend/page-learning/SKILL.md`](../domains/frontend/page-learning/SKILL.md)
- Approval gate: [`protocols/APPROVAL_LEARNING_GATE.md`](APPROVAL_LEARNING_GATE.md)
- Routing manifest: [`shared/SKILL_ROUTING_MANIFEST.md`](../shared/SKILL_ROUTING_MANIFEST.md)
- Frontend domain: [`domains/frontend/SKILL.md`](../domains/frontend/SKILL.md)
- Slash commands: [`.claude/commands/`](../.claude/commands/)
