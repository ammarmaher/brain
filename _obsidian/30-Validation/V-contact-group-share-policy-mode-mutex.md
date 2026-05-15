---
type: validation-rule
id: V-contact-group-share-policy-mode-mutex
prd: PRD-04
service: contact-group
severity: high
status: triangulated
drift: false
created: 2026-05-15
---
*** Validation V-contact-group-share-policy-mode-mutex — SharedWithAllUsers flag overrides SharedUsers[] ***
*** Origin: PRD-04 Contact Group Management · Backend: contact-group · 2026-05-15 ***

# V-contact-group-share-policy-mode-mutex — When `SharedWithAllUsers = true` the `SharedUsers[]` list is ignored (mutually exclusive modes)

> The Share step is a one-of-two: "everyone in scope" (broadcast) OR "specific Normal Users" (named list). The backend treats them as mutually exclusive and the frontend must too — otherwise the UI would let the user pick names that the server silently drops.

## Origin (PRD)

- **PRD:** [[04 Contact Group Management]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/04-contact-group-management/BUSINESS_RULES.md) + [ENTITIES](../../../Brain%20Outputs/prd/modules/04-contact-group-management/ENTITIES.md) (`SharePolicy`)
- **Rule id:** `BR-CGM-09` (Share step lets creator pick specific Normal Users OR "All Users") + `BR-CGM-10` (sharing scope: Normal Users inside the same account)
- **PRD line reference:** "Share Step (optional) lets creator pick specific Normal Users OR 'All Users'." (`latest-prd.md:32`)
- **Excel cell:** none (PRD prose only)
- **Workflow context:** Wizard Step 3 — Share Group ([WORKFLOWS](../../../Brain%20Outputs/prd/modules/04-contact-group-management/WORKFLOWS.md) §W1 step 3) + post-create W3 (Share dialog). Both paths use the same DTO shape.

## Backend enforcement

- **Service:** [[Contact Group Service]]
- **DTO:**
  - `CreateContactGroupRequest.SharePolicy { bool SharedWithAllUsers, List<string> SharedUserIds }` (nested in create payload)
  - `ShareContactGroupRequest { string GroupId, bool SharedWithAllUsers, List<SharedUser> SharedUsers }` (post-create dedicated endpoint)
- **Attribute:** No dedicated FluentValidation rule mutex — enforcement is **documented as a handler-level rule** in [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/contact-group/VALIDATIONS.md) under "Sharing Rule": *"`ShareContactGroupRequest.SharedWithAllUsers` is a flag — if true, the `SharedUsers` list is ignored. Frontend must use one mode or the other consistently."* That is the canonical statement.
- **Error code:** No dedicated error code — the server **silently drops** `SharedUsers[]` when `SharedWithAllUsers = true`. There is no "InvalidShareMode" code in the catalog ([ERRORS](../../../Brain%20Outputs/understanding/backend/contact-group/ERRORS.md)). Authorization errors that may still surface: `ForbiddenToShareContactGroup` (403, non-creator outside hierarchy), `IdentityServiceError` (502, identity lookup for `SharedUserIds[]` failed).
- **Source file:** [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/contact-group/VALIDATIONS.md) ("Sharing Rule" section)
- **Error catalog:** [ERRORS](../../../Brain%20Outputs/understanding/backend/contact-group/ERRORS.md) (Authorization Errors table)
- **DTO dictionary:** [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/contact-group/DTO_DICTIONARY.md) (`SharePolicy`, `ShareContactGroupRequest`)
- **Endpoint:** `POST /api/contact-groups` (initial share via embedded `SharePolicy`) + `PATCH /api/contact-groups/{groupId}/share` (post-create change)

**Honest call:** the server does not *reject* a malformed combination — it *normalizes* by ignoring `SharedUsers[]` when the flag is true. That is fragile UX: a user who picks 5 names then toggles "All Users" loses the list silently on save. Frontend MUST enforce mutex client-side so the user sees the toggle take precedence. Consider proposing a dedicated `InvalidShareMode` error code to the backend (queue under [[GAPS_INDEX]]).

## Frontend implementation hint

- **Form / page section:** Create Contact Group wizard — Step 3 (Share Group) and post-create Share dialog (W3). Both surfaces share the same form fragment. Frontend pending per GAP-CGM-34.
- **Suggested validator wiring:**
  - Form shape: `{ sharedWithAllUsers: boolean, sharedUserIds: string[] }` (a single FormGroup).
  - When `sharedWithAllUsers` toggles to `true`:
    - Disable + clear the [[Falcon Dropdown]] / multiselect that backs `sharedUserIds`.
    - Reset the FormControl to `[]`.
    - Show a hint: "All Normal Users in your hierarchy scope will see this group."
  - When `sharedWithAllUsers` is `false`:
    - Enable the multiselect.
    - Optional async user-picker fetch (scoped to creator's hierarchy via Identity Service — never call Zitadel directly).
  - No backend error to surface for the mutex itself (backend silently normalizes). The validator is purely a UX guardrail.
  - Self-share guard (`BR-CGM-38` OPEN) — UI MUST block selecting oneself in the user picker; not backed by a backend rule yet.
  - **Inferred** path: `apps/admin-console/.../create-contact-group/share-step/share-step.form.ts`
- **Page note:** [[Organization Hierarchy]] (Contact Groups page not yet seeded under `10-Pages/`)

## Cross-domain links

- **Permission gate:** [[Contact Group Permission Matrix]] — Share permitted for Client AO (any), Client NA (any), Client NU (creator only). Falcon usertype Share = N (BR-CGM-13).
- **Business rule cluster:** [[04 Contact Group Management]] BR-CGM-09 + BR-CGM-10 + BR-CGM-11 + BR-CGM-12 (+ open: BR-CGM-38 self-share, BR-CGM-32 deleted-shared-user behavior)
- **Sister rule:** [[V-contact-group-name-required-format]] — same wizard
- **Related learning events:** none yet
- **Open gaps:** `BR-CGM-38` (self-share UI guard), `BR-CGM-32` (behavior when shared-with Normal User is deleted), `GAP-CGM-33` ("All Users" semantic expansion timing)

## Tags

#type/v-rule #status/triangulated #prd/04 #service/contact-group #severity/medium #gap

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
