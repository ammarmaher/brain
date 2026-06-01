---
name: contact-group-contact-field-alias-collapse-fix-2026-05-29
description: "Contact-group CSV contacts rendered blank (every row only id + one empty \"\" key = last column). Root cause was WRITE-side alias keying, fixed via ResolvedKey at all 4 sites. LIVE E2E PASS on Ammar's PC. Existing data still corrupt — re-import deferred."
metadata: 
  node_type: memory
  type: project
  originSessionId: f591004b-f96c-44dc-9e29-9e5602445527
---

# Contact-group contact-field empty-alias collapse — fixed 2026-05-29

`GET :7038/contactgroup/contact-groups/{id}/contacts` returned each row as `{"id":…, "":"<last column>"}` (firstname/lastname/email/mobile absent; only Company survived under a single empty-string key). Affected ALL CSV-uploaded groups (repro groups `6a18c1c2746fb1b6a1646c14`, `6a18bd0e746fb1b6a1646baf`), tenant `test-tenant-001`.

**Root cause — WRITE side, not the read projection (this corrects the natural assumption):** `[CODE] ImportRowProcessor.cs:41` did `fields[col.Alias] = value` in a loop. `ColumnDefinition.Alias` is optional and was empty for every column (create flow never required it — `[CODE] CreateContactGroupRequestValidator.cs` validated only Name). With all aliases `""`, each column overwrote the same `""` key, so Mongo stored only the last column per row. The Browse query handler faithfully returned the already-collapsed data — fixing only the read projection would have been a no-op.

**Fix landed (build-green, 163/163 xUnit pass, NO COMMITS):** new computed `ColumnDefinition.ResolvedKey => Alias if non-empty else OriginalName`, applied at all 4 keying sites — import write (`ImportRowProcessor`), browse read (`BrowseContactGroupContactsHandler` activeKeys), and both CSV exports (`ProcessImportJobHandler` validated + error report). Added create-time guard rejecting blank/duplicate (OrdinalIgnoreCase) resolved keys among non-ignored columns (`FalconKeys.Error.ContactGroupColumnKeysInvalid` + en/ar resx). Mapperly needed `[MapperIgnoreSource(nameof(ColumnDefinition.ResolvedKey))]` on the ColumnDefinition→DTO map (strict RMG020). FE already does case-insensitive columnDefinitions lookup, so no FE change required.

**Why:** the FE detail table was correctly mapping but had no firstname/lastname/email/mobile keys to read — the contract was broken upstream at write time.

**Runtime-verified 2026-05-29 (LIVE E2E on Ammar's PC):** restarted `falcon-contact-group-1` (source bind-mounted `C:\Falcon\Falcon` => /workspace, runs `dotnet run` so restart rebuilds from edited source) and ran a fresh full cycle through gateway :7038 with EMPTY aliases (the actual bug input): login accuser -> init -> presigned PUT MinIO :9000 (200) -> complete -> create -> import Completed -> GET /contacts = 5 rows, **0 empty-string keys**, all keyed by originalName (FirstName/LastName/Email/Mobile/Company) with correct values. Guard live-confirmed: duplicate aliases -> 400 "Column names must be unique and cannot be empty." NOTE: a sibling `verdict.md` in the run dir passed earlier but used NON-empty aliases (didn't exercise the bug); the decisive empty-alias proof is `verdict-emptyalias-e2e.md`. Evidence: `C:/falcon/qa/runs/2026-05-29-contact-cells-alias-verify/` (fullcycle-fix-verify.ps1 + verdict-emptyalias-e2e.md + fixverify-contacts-response.json). Gotcha: ps1 must be ASCII (PS 5.1 reads BOM-less files as ANSI); `complete` POST needs `application/json` body or 415.

**How to apply / outstanding:**
- DEFERRED (user said "Not now", 2026-05-29): existing CSV-uploaded groups are already corrupted in Mongo — the dropped columns were never persisted. Recovery = re-import from `group.Files.Original` (still in object storage) after this code ships. Not yet done; no migration/re-enqueue script written.
- If you ever see contact rows with empty-string keys again, look at the import worker write path first, not the query handler.
- Evidence bundle: `C:/falcon/qa/runs/2026-05-29-fullcycle2-contactgroup-detail/` (verdict.md + replay.ps1 regression script).
- Service is `falcon-core-contact-group-svc` (its own service; not Commerce — no dedicated Ammar agent). Related: [[project_contact_group_upload_auth_and_create_id_2026_05_29]].
