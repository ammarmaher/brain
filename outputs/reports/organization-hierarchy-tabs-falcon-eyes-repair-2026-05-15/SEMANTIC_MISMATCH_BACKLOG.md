*** Semantic Mismatch Backlog — Org Hierarchy Falcon Eyes (2026-05-15) ***

## Status
BLOCKED — destination route is auth-gated. The only visible "mismatch" is at the page level, not at the component level, so per-component records cannot be opened honestly.

## Page-level mismatch (single record)
| Field | Value |
|---|---|
| mismatchId | FE-2026-05-15-page-0001 |
| section | (all 12 sections) |
| sourceExpected | Full Organization Hierarchy page — header, sidebar, tabs (Hierarchy / CommChannels & Services / Apps & Services / Settings), Aramco breadcrumb, Information / Add Node / Add User buttons, users table with status badges, List / Tree toggle, pagination |
| destinationActual | Only the "Access Check Failed — Falcon could not complete the authorization check for this request" card with a "Return to Home" button on a near-empty surface |
| category | missing component / wrong data / wrong interaction (page-level, not component-level) |
| severity | P0 (blocker for the entire visual repair task) |
| likelyCause | Auth/permission guard short-circuit. The route is protected by Identity Service and no valid session is present in this run. The page module is never instantiated. |
| relatedFalconComponent | n/a — the page component itself never mounts |
| requiredRepair | Provide an authenticated session for the destination (real OAuth through `auth.falconhub.space/api/`) OR document a dev-only auth fixture. UI repair cannot start until the page module renders. |
| likelyFileToChange | none in scope; this is environmental, not code |
| proofNeeded | A new Falcon Eyes run where `destination/_full-page.png` contains the actual Org Hierarchy tabs and tree, not the auth-denied card |
| status | open / blocked |

## Per-section component-level records
**Not opened in this run.** Opening them would require visible destination UI to compare against. Filling the per-section semantic templates with placeholders or invented findings would violate the Falcon Eyes hard rule that *"scores without proof are invalid"*.

The per-section templates produced by the tool (under `C:\Falcon\Brain Outputs\reports\falcon-eyes\2026-05-15-0450\sections\<name>\SEMANTIC_MISMATCHES.md`) are intentionally left in their "_None recorded yet._" state for that reason.
