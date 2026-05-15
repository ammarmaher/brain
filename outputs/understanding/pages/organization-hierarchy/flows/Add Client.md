*** REDIRECT — Add Client moved to a structured folder ***
*** New SoT: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***
*** Redirected: 2026-05-15 ***

# Add Client — moved

The Add Client implementation knowledge has been **restructured** from a single file into a folder of 17 focused files.

## ▶ New location

```
C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy\Add Client\
```

Start with [`README.md`](../Add%20Client/README.md) in that folder — it lists every section file and gives per-task load order (Frontend / Backend / Full-stack / Validation).

## Files inside the new folder

| Section | File |
|---|---|
| Folder index + load order | [README.md](../Add%20Client/README.md) |
| Overview · actors · end-to-end summary | [00-OVERVIEW.md](../Add%20Client/00-OVERVIEW.md) |
| Permission matrix (who can run) | [01-PERMISSIONS.md](../Add%20Client/01-PERMISSIONS.md) |
| Step 1 — Basic Info (20 fields) | [02-STEP_1_BASIC_INFO.md](../Add%20Client/02-STEP_1_BASIC_INFO.md) |
| Step 2 — Settings (6 fields) | [03-STEP_2_SETTINGS.md](../Add%20Client/03-STEP_2_SETTINGS.md) |
| Step 3 — CommChannels & Services | [04-STEP_3_COMM_CHANNELS.md](../Add%20Client/04-STEP_3_COMM_CHANNELS.md) |
| Step 4 — Apps & Services | [05-STEP_4_APPS_SERVICES.md](../Add%20Client/05-STEP_4_APPS_SERVICES.md) |
| Step 5 — Account Owner (10 fields) | [06-STEP_5_ACCOUNT_OWNER.md](../Add%20Client/06-STEP_5_ACCOUNT_OWNER.md) |
| Consolidated validations · V-rule links | [07-VALIDATIONS.md](../Add%20Client/07-VALIDATIONS.md) |
| Backend endpoint + DTO + error codes | [08-BACKEND_API.md](../Add%20Client/08-BACKEND_API.md) |
| Falcon components used per step | [09-COMPONENTS.md](../Add%20Client/09-COMPONENTS.md) |
| Kafka side-effects (Identity + Charging) | [10-KAFKA_SIDE_EFFECTS.md](../Add%20Client/10-KAFKA_SIDE_EFFECTS.md) |
| State machines (Account / User / Wallet) | [11-STATE_TRANSITIONS.md](../Add%20Client/11-STATE_TRANSITIONS.md) |
| Error code → UX mapping | [12-ERROR_STATES.md](../Add%20Client/12-ERROR_STATES.md) |
| Honest PRD↔DTO drift surfaces | [13-GAPS_AND_DRIFTS.md](../Add%20Client/13-GAPS_AND_DRIFTS.md) |
| FE / BE / Full-stack checklists | [14-IMPLEMENTATION_CHECKLIST.md](../Add%20Client/14-IMPLEMENTATION_CHECKLIST.md) |
| **Full single-doc reference (62 KB)** | [PLAYBOOK.md](../Add%20Client/PLAYBOOK.md) |

## Why this changed

The single-file playbook was too coarse for selective loading. A session implementing only the FE form for Step 1 had to load 62 KB to find ~3 KB of relevant content. The folder structure lets a session load just the section file it needs (e.g. `02-STEP_1_BASIC_INFO.md` + `07-VALIDATIONS.md` + `12-ERROR_STATES.md` for a Step 1 FE task).

## Sister flows (still single files)

Add User · Add Node · Edit Node remain as single files in this `flows/` directory. They will be migrated to folder structure on demand.

- [Add User.md](Add%20User.md)
- [Add Node.md](Add%20Node.md)
- [Edit Node.md](Edit%20Node.md)
