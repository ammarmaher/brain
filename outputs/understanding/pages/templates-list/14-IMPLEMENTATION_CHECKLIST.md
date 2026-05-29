*** Templates List — Implementation checklist ***
*** Blocked on backend · 2026-05-18 ***

# Templates List — Implementation Checklist

## Verification gate

- [ ] 1. PRD anchor? → PRD-05 (75% unmined)
- [ ] 2. Backend? → **BLOCKED — GAP-T-001** (endpoints missing)
- [ ] 3. Maker/Checker model understood? → YES at high level
- [ ] 4. Per-channel branches? → WhatsApp known; Voice/AI/SMS deferred
- [ ] 5. Status FSM? → 6 states + Meta substates
- [ ] 6. PES queries identified? → 6 (create/edit/approve/reject/delete/view)
- [ ] 7. Component composition? → see [09-COMPONENTS](09-COMPONENTS.md)

## Pre-flight

- [ ] **HALT (GAP-T-001):** Backend builds template CRUD endpoints first.
- [ ] **HALT (Q-TM-CHECKER-ROLE):** Product defines Checker assignment.
- [ ] **HALT (Q-TM-PRD-COVERAGE):** Deep-mine PRD-05 latest.

## Frontend tasks (post-unblock)

- [ ] List container with filters + table.
- [ ] Channel picker dialog.
- [ ] Per-row actions (view/edit/submit/approve/reject/delete).
- [ ] Per-row status pill + Meta secondary pill.

## Backend tasks (PREREQ)

- [ ] Build all 9 missing endpoints per [08-BACKEND_API](08-BACKEND_API.md).
- [ ] Build Meta webhook receiver + FSM transitions.
- [ ] Define Checker assignment model (Q-TM-CHECKER-ROLE).

## See also

- [README](README.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
