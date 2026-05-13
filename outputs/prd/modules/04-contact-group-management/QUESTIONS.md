*** PRD Understanding - Contact Group Management - QUESTIONS ***

# 04-contact-group-management - Open Questions

> Carried forward from `understanding.md:138-144` plus new findings from cross-reference.

## Inherited from existing understanding.md

| # | Question | Why it matters | Where to look |
|---|---|---|---|
| Q-CGM-01 | What is the App Settings max-upload-default value? (BR-CGM-30) | UX expectation + storage costs. | latest-prd.md:67; check `UploadConfigResponse.MaxFileSizeMB` actual server value. |
| Q-CGM-02 | Does "Share" for AO / Node Admin require the shared-with user to be on the same node, or any node in the hierarchy? | Determines share-user-picker scope. | latest-prd.md:32; ask Jawad. |
| Q-CGM-03 | When a shared-with Normal User is deleted, does the group disappear from others or just from that user? (BR-CGM-32) | Multi-target propagation. | understanding.md:143; ask Dina. |
| Q-CGM-04 | Is there a "Failed" status when file parsing errors? (BR-CGM-34) | Current PRD has only {In Progress, Completed}. Failed scenarios need UX. | understanding.md:136; ask UX. |
| Q-CGM-05 | Deeply nested hierarchy: does AO see groups 3+ levels below their node in the `Contact Groups` list, or only one level? (BR-CGM-35) | List scoping rules. | understanding.md:144; ask Jawad. |

## New questions surfaced during cross-reference

| # | Question | Why it matters | Where to look |
|---|---|---|---|
| Q-CGM-06 | What happens to a group when its creator's account is Deleted? Does it remain accessible to shared-with users, or disappear? (BR-CGM-36) | Account lifecycle propagation. | understanding.md:89; ask Jawad. |
| Q-CGM-07 | "First row is the header" toggled OFF after editing column names - what is the reset behavior? (BR-CGM-37) | UX edge case. | understanding.md:88; ask UX. |
| Q-CGM-08 | What's the collapsing threshold for "Shared With (+N)" display? (BR-CGM-33) | UI consistency. | understanding.md:133; ask UX. |
| Q-CGM-09 | Can a user share a group with themselves? UI should prevent but PRD silent. (BR-CGM-38) | UX validation. | understanding.md:90; ask UX. |
| Q-CGM-10 | The Permission matrix has Normal User (non-creator) = `Create Y`. Is this the general "can create groups" capability OR the per-record context? | Disambiguates per-record vs role-level capability. | understanding.md:126; cross-check `Contact Group Permissions` sheet. |
| Q-CGM-11 | Does the Falcon view show client-side share lists (who shared with whom)? Important for audit. | Audit trail completeness. | latest-prd.md:40; ask Jawad. |
| Q-CGM-12 | What's the retention policy on soft-deleted groups? Is there a hard-delete after N days? | Storage costs + compliance. | PRD silent; ask Ammar. |
| Q-CGM-13 | The `validated` file - what does validation entail given BR-CGM-08 (content NOT validated)? Is it just a schema-normalized version (header row added, column names cleaned)? | Determines file processing scope. | Contact Group `GET .../files/{fileType}` semantics + handler. |
| Q-CGM-14 | The `BrowseContactGroupContactsEndpoint` returns `PagedResult<Dictionary<string, object>>` - dynamic-keyed. The frontend must read column schema from `GetContactGroupDetailsResponse`. Is this documented in the FRONTEND_CONTRACT? | Frontend integration risk. | Contact Group DTO_DICTIONARY:54-71; check FRONTEND_CONTRACT. |
| Q-CGM-15 | `UploadSession` expiry - what's the TTL on a `POST /uploads/init` session before it's garbage-collected? | UX gotcha if user takes too long. | Internal debug endpoint `/api/_internal/cleanup/trigger` hints at GC; verify TTL. |
| Q-CGM-16 | Falcon usertype can `Download Original`. Is there an audit log of Falcon downloads (compliance reason)? | PII / compliance. | PRD silent; check Identity / Access audit features. |
| Q-CGM-17 | Are columns CASE-SENSITIVE for uniqueness (BR-CGM-06)? E.g. `name` vs `Name` allowed both? | Validation rule. | PRD silent; ask Jawad. |

## Cross-cutting concerns

| # | Topic | Action |
|---|---|---|
| Q-CGM-18 | Backend has both `/api/contact-groups` (CRUD) and `/api/_internal/cleanup/trigger` (dev-only). Make sure the internal route is gated to non-Production. | Already gated (returns 404 in non-Development). |
| Q-CGM-19 | The Contact Group service is the only one currently UNBOUND from any frontend call site (per `API_TO_COMPONENT_TRACE.md`). The `active-story-115329-handover.md` indicates frontend work is in flight. | Track when frontend lands and update API_TO_COMPONENT_TRACE. |

## Banned synonyms / glossary discipline

- The PRD uses **Contact Group**; do NOT alias as "Recipient List", "Mailing List", "Audience".
- The PRD uses **Normal User** and **Account Owner**; do NOT alias as "Customer", "Member".
- The PRD uses **Shared With**; do NOT alias as "Members" / "Recipients" / "Audience".
- The PRD uses **Uploaded Contact** for the count column; do NOT alias as "Records" / "Rows".
- The PRD uses **Soft Delete**; do NOT alias as "Hide" / "Archive".
- File types in PRD: `CSV`, `XLS`, `XLSX`. Frontend should accept exactly these (no `.tsv`, no `.json`).
