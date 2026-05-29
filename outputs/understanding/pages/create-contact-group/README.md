*** Create Contact Group — folder index ***
*** 2026-05-18 ***

# Create Contact Group — implementation knowledge folder

> SoT for the Create Contact Group wizard (management-console only). 4-stage flow: Upload → Column Config → Preview → Commit. Uses S3-style upload session with pre-signed URLs. Client usertypes only (AO/NA/NU).

## Files

| File | Read when... |
|---|---|
| [00-OVERVIEW](00-OVERVIEW.md) | E2E picture · 4-stage upload session lifecycle |
| [01-PERMISSIONS](01-PERMISSIONS.md) | Client AO/NA/NU only; Falcon CANNOT create |
| [02-STEP_1_UPLOAD](02-STEP_1_UPLOAD.md) | File upload via pre-signed URL |
| [03-STEP_2_COLUMN_CONFIG](03-STEP_2_COLUMN_CONFIG.md) | Header detection + column-name rules |
| [04-STEP_3_PREVIEW](04-STEP_3_PREVIEW.md) | First 5 rows preview |
| [05-STEP_4_NAMING_SHARE](05-STEP_4_NAMING_SHARE.md) | Name · Reference ID · Share policy |
| [06-SECTION_UPLOAD_SESSION_FSM](06-SECTION_UPLOAD_SESSION_FSM.md) | Init → Complete → Committed/Abandoned lifecycle |
| [07-VALIDATIONS](07-VALIDATIONS.md) | File type/size · column name rules · BR-CGM-* |
| [08-BACKEND_API](08-BACKEND_API.md) | 4 endpoints: upload-config + uploads/init + uploads/complete + contact-groups (commit) |
| [09-COMPONENTS](09-COMPONENTS.md) | `<falcon-stepper>` + uploader + column editor + preview table |
| [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) | Commit triggers group-created |
| [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) | UploadSession FSM |
| [12-ERROR_STATES](12-ERROR_STATES.md) | Upload fail · duplicate name · invalid column |
| [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) | (old-UI in management-console only — may not yet be extracted) |
| [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md) | Pre-code gate + tasks |
| [PLAYBOOK](PLAYBOOK.md) | Single-doc synthesis |

## Verification gate

1. PRD anchor? → PRD-04 BR-CGM-01..23
2. 4 stages clear? → Upload · Column Config · Preview · Naming+Share
3. Upload session FSM? → Init → Complete → Committed/Abandoned
4. Pre-signed URL flow? → Init → PUT to S3 → Complete (parses preview)
5. Column name rules? → BR-CGM-06 (English letters, ≤20, no special, no dup, spaces→_)
6. File size cap? → from `GET upload-config` (configurable per system)
7. Falcon CANNOT create? → BR-CGM-13 (View only)
8. Per-tab visibility per role? → BR-CGM-20..23

## Hubs

[[Create Contact Group Flow]] · [[Contact Groups List]] · [[04 Contact Group Management]] · [[Contact Group Service]]
