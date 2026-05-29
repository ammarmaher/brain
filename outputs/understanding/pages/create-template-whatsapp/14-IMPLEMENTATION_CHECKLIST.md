*** Create Template (WhatsApp) — Implementation checklist ***
*** Blocked on backend · 2026-05-18 ***

# Create Template (WhatsApp) — Implementation Checklist

## Verification gate

- [ ] 1. PRD anchor? → BR-TM-04..16, BR-TM-21..29
- [ ] 2. Backend? → **BLOCKED — GAP-T-001**
- [ ] 3. 2-step wizard structure? → Basic Info + Message Structure
- [ ] 4. Variable rules? → BR-TM-06..10
- [ ] 5. Header mutex? → text XOR media XOR location
- [ ] 6. Footer no variables? → BR-TM-15
- [ ] 7. Buttons ≤10? → BR-TM-16
- [ ] 8. Preview render model? → Q-TM-PREVIEW-RENDER OPEN

## Pre-flight (HALTS)

- [ ] GAP-T-001: Backend POST endpoint
- [ ] BR-TM-31: Checker assignment
- [ ] BR-TM-32: Auto-approval scope
- [ ] BR-TM-33: Edit versioning semantics
- [ ] BR-TM-34: Language clone flow

## Frontend tasks (post-unblock)

- [ ] Wizard shell with `<falcon-stepper>`.
- [ ] Step 1 form with async name uniqueness.
- [ ] Step 2 with split layout (form + preview).
- [ ] Variable editor (custom or hardened textarea).
- [ ] Live preview component (NEW component `<falcon-whatsapp-preview>`).
- [ ] Contact group linker section.
- [ ] All 22 V-rules wired.

## Backend tasks (PREREQ)

- [ ] Build `POST /api/templates`.
- [ ] Build `GET /api/templates/name-available`.
- [ ] Decide auto-approval scope.
- [ ] Define Checker role assignment.
- [ ] Build Meta integration consumer + webhook.
- [ ] Emit Kafka events.

## See also

- [README](README.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
