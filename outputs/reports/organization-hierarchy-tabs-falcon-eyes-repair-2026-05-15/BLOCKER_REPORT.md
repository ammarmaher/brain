*** BLOCKER — Destination Org Hierarchy page is not visible behind auth gate ***
*** Date: 2026-05-15 ***

## Headline
The Falcon Angular destination at `http://localhost:4200/#/admin-console/org-hierarchy-page` does **not** render the Organization Hierarchy feature. It renders only an **"Access Check Failed — Falcon could not complete the authorization check for this request"** card. Falcon Eyes captured this card for every one of the 12 sections.

## Evidence
- `evidence/source/source_full-page.png` — source page renders the full Organization Hierarchy UI (header, sidebar, tabs, tree, users table with status badges, pagination)
- `evidence/destination/destination_full-page.png` — destination renders only the auth-denied card on a near-empty surface
- `evidence/diff/tabs-header-diff.png` — pixelmatch diff that is dominated by the (source = page) vs. (destination = empty surface) mismatch, not by anything semantically actionable
- The same destination card appears in every other section file under `C:\Falcon\Brain Outputs\reports\falcon-eyes\2026-05-15-0450\destination\`

## Root cause (standing knowledge)
- **MEMORY `feedback_frontend_auth_identity_service`** — Frontend never calls Zitadel directly; auth goes through Identity Service at `auth.falconhub.space/api/`
- The route `/admin-console/org-hierarchy-page` is protected by an auth/permission guard. With no valid session the guard short-circuits to the access-denied fallback card and the feature component is never instantiated.
- The 4200 dev server is alive (HTTP 200 on the shell) — the Angular shell is rendering, but the page module is not.

## Why this is a hard blocker for Falcon Eyes
- Falcon Eyes is a **semantic** visual difference tool — every mismatch must trace to a Falcon component and an exact dynamic-API or template repair. There are zero visible Falcon components on the destination side, so there is nothing to map.
- All 12 section diffs collapse to the same pixel-mismatch number (17.57%) because every destination screenshot is the same auth-denied card. Pixel scores at this point are meaningless.
- Falcon Eyes hard rule: *"Reports always include screenshot evidence; scores without proof are invalid."* — fabricating per-section semantic findings would violate this rule.
- The task spec is explicit: *"If source is not reachable, DO NOT continue visual comparison — record a BLOCKED status and proceed with skip notation."* The same logic applies in reverse when the **destination** is the unreachable side.

## What is needed to unblock
At least one of the following must be true:
1. An authenticated session in the Angular app for the user-scope that has Organization Hierarchy access (real OAuth/OIDC login through Identity Service at `auth.falconhub.space/api/`).
2. A local test-mode flag, dev-only auth bypass, or seeded JWT that exists in the Angular admin-console and short-circuits the access-check guard. (Status: not documented in the canonical knowledge under `C:\Falcon\Brain Outputs\understanding` for this route.)
3. A mock/E2E auth fixture that the route's guard accepts. (Status: not present in the workspace.)

None of the above can be created safely under the Night Shift's strict-scope rule, which forbids touching unrelated files (top bar, global shell, auth/identity).

## Decision
1. Falcon Eyes pixel layer is preserved at `C:\Falcon\Brain Outputs\reports\falcon-eyes\2026-05-15-0450\` as proof of the run.
2. Semantic layer is intentionally left in its "TBD" state — fabricating data would violate Falcon Eyes governance.
3. No source code is modified. No tabs, components, tokens, or templates are touched. Zero risk to the v3.2 night-shift state.
4. No commit, no push to the implementation repo. Brain SK reports / outputs are written to disk only — committed only if separately approved by the user.

## Recommended next step
Open one terminal session where the user supplies (or scripts) a real login into the admin-console before Falcon Eyes re-runs. Once the destination renders the actual Org Hierarchy page, the Falcon Eyes loop becomes meaningful and the repair plan can proceed as designed.
