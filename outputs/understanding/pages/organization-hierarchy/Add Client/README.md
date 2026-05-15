*** Add Client — folder index ***
*** SoT for Add Client implementation · 2026-05-15 ***

# Add Client — implementation knowledge folder

> Canonical source of truth for the Falcon Add Client (5-step wizard) flow. When a Claude session is asked to implement Add Client (frontend, backend, or both), this folder is the SPEC. Load `README.md` first, then drill into the file matching your task.

## Files in this folder

| File | Read when... |
|---|---|
| [00-OVERVIEW](00-OVERVIEW.md) | You need the end-to-end picture · actors · 5-step summary |
| [01-PERMISSIONS](01-PERMISSIONS.md) | You need to know who can run this flow (role matrix) |
| [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md) | Building Step 1 form (Account name · classification · address) |
| [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md) | Building Step 2 form (password policy · IP allowlist · account limits) |
| [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md) | Building Step 3 table (per-channel visibility + pricing) |
| [05-STEP_4_APPS_SERVICES](05-STEP_4_APPS_SERVICES.md) | Building Step 4 table (per-app visibility + pricing) |
| [06-STEP_5_ACCOUNT_OWNER](06-STEP_5_ACCOUNT_OWNER.md) | Building Step 5 form (AO user creation) |
| [07-VALIDATIONS](07-VALIDATIONS.md) | Wiring frontend validators · cross-field rules · async uniqueness checks |
| [08-BACKEND_API](08-BACKEND_API.md) | Wiring the API call (method · path · DTO shape · error codes) |
| [09-COMPONENTS](09-COMPONENTS.md) | Picking Falcon components per step + customization order |
| [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) | Understanding server side effects after submit (Identity + Charging downstream) |
| [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) | Understanding Account / User / Wallet status machines |
| [12-ERROR_STATES](12-ERROR_STATES.md) | Handling backend error codes in the UI · recovery paths |
| [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) | What's broken / undocumented · PRD↔DTO drift you must handle |
| [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md) | Pre-code verification gate + FE/BE/full-stack task lists |
| [PLAYBOOK](PLAYBOOK.md) | The original single-doc playbook (62 KB) if you want everything in one file |

## Load order for implementation tasks

Frontend task:
1. README (this file)
2. 00-OVERVIEW
3. The step file matching what you're building (e.g. 02-STEP_1_BASIC_INFO)
4. 07-VALIDATIONS
5. 09-COMPONENTS
6. 12-ERROR_STATES
7. 14-IMPLEMENTATION_CHECKLIST (verification gate)

Backend task:
1. README
2. 00-OVERVIEW
3. 08-BACKEND_API
4. 07-VALIDATIONS
5. 10-KAFKA_SIDE_EFFECTS
6. 11-STATE_TRANSITIONS
7. 13-GAPS_AND_DRIFTS
8. 14-IMPLEMENTATION_CHECKLIST

Full-stack task: load all 16 files (or just PLAYBOOK.md if you want one document).

## Verification gate (before producing code)

A session has not loaded enough context until it can answer:

1. Which PRD lines does this flow implement?
2. Which backend endpoint will I call?
3. What is the exact request DTO shape?
4. What validation will the backend enforce?
5. What V-rule wiki-links apply?
6. What Falcon components am I composing?
7. Which permission roles can run this flow?
8. What entity drift do I need to handle?

Answers live inside this folder. Drill until each question has a citation.

## Hubs

- [[Add Client Flow]] · [[Organization Hierarchy]] · [[01 Account Management]] · [[02 User Management]] · [[Commerce Service]] · [[Identity Service]] · [[Charging Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[COMPONENT_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
