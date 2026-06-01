*** Create Contact Group — Implementation checklist ***
*** 2026-05-18 ***

# Create Contact Group — Implementation Checklist

## Verification gate

- [ ] 1. PRD anchor? → BR-CGM-01..23
- [ ] 2. Backend endpoints? → 4 (config + uploads/init + uploads/complete + contact-groups commit)
- [ ] 3. 4-stage wizard? → Upload · Column · Preview · Naming/Share
- [ ] 4. UploadSession FSM? → Init → Complete → Committed / Abandoned
- [ ] 5. Pre-signed URL flow? → Browser direct to S3
- [ ] 6. Column name rules? → BR-CGM-06
- [ ] 7. File size cap? → from `GET upload-config`
- [ ] 8. Roles? → Client users only (NOT Falcon)

## Pre-flight

- [ ] GAP-CCG-MGT-ONLY: extract management-console old-UI dossier for cross-validation.
- [ ] Q-CCG-NAME-UNIQUE-ASYNC: backend confirms async endpoint OR commit-time only.

## Frontend tasks

- [ ] Wizard shell with `<falcon-stepper>` 4 stages.
- [ ] Step 1: `<falcon-uploader>` + progress bar + pre-signed URL flow.
- [ ] Step 2: column config with header toggle + column name editor + normalizer.
- [ ] Step 3: preview table.
- [ ] Step 4: naming + share-policy multiselect.
- [ ] All 12 V-rules wired.
- [ ] Toasts via `FalconToastService`.

## Backend tasks

- [ ] Verify all 4 endpoints function correctly.
- [ ] **Q-CCG-NAME-UNIQUE-ASYNC**: build name-exists endpoint OR document commit-time enforcement.
- [ ] Cleanup cron + TTL behavior verified.

## E2E tests

- [ ] Client AO uploads CSV → wizard completes → group appears in list.
- [ ] Client AO uploads XLSX with header → columns detected correctly.
- [ ] Upload >maxSize → blocked at FE.
- [ ] Upload .txt → blocked at FE.
- [ ] Column name "First Name" → auto-normalized to "First_Name".
- [ ] Column name "email-address" → inline error.
- [ ] Duplicate column names → inline error.
- [ ] Falcon user tries to access wizard → blocked by guard (BR-CGM-13).
- [ ] User starts upload but doesn't commit → session marked Abandoned after TTL.

## See also

- [README](README.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
