*** Create Contact Group — Playbook ***
*** 2026-05-18 ***

# Create Contact Group — Playbook

## TL;DR

4-stage wizard (Upload → Column Config → Preview → Naming+Share) for creating a contact group. Uses S3-style pre-signed URL pattern for direct browser→S3 uploads. UploadSession FSM (Init→Complete→Committed/Abandoned) backed by daily cleanup cron. Only client usertypes (AO/NA/NU) can create per BR-CGM-13. Column-name normalizer enforces BR-CGM-06 rules (English letters, no special, ≤20 chars, spaces→_).

## Sections

1. Permissions — Client AO/NA/NU only; Falcon NO.
2. Stage 1 Upload — pre-signed URL → S3 PUT → complete returns preview.
3. Stage 2 Column config — header toggle + name editor + normalizer.
4. Stage 3 Preview — first 5 rows.
5. Stage 4 Naming+Share — name + refId + multiselect of users.
6. UploadSession FSM — Init / Complete / Committed / Abandoned.
7. Validations — 12 V-rules including async name-unique (TBD endpoint).
8. Backend API — 4 endpoints (config + uploads init + uploads complete + commit) + identity user picker.
9. Components — `<falcon-stepper>`, `<falcon-uploader>`, `<falcon-multiselect>`.
10. Kafka — group-created · upload-session-committed.
11. State — ContactGroup starts Active.
12. Errors — Upload + Column + Commit.
13. Gaps — old-UI in mgmt-console only · async uniqueness TBD · progress bar UX.

## Hubs

[[Create Contact Group Flow]] · [[Contact Groups List]] · [[04 Contact Group Management]] · [[Contact Group Service]]
