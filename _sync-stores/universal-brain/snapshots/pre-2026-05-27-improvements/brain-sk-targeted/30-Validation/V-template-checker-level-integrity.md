---
type: validation-rule
id: V-template-checker-level-integrity
prd: PRD-05
service: templates
severity: medium
status: triangulated
drift: false
created: 2026-05-15
---
*** Validation V-template-checker-level-integrity — Checker levels must be sequential, unique, populated, and within bounds ***
*** Origin: PRD-05 Templates · Backend: templates · 2026-05-15 ***

# V-template-checker-level-integrity — CommChannelConfig checker levels are a bounded ordered list (1..N, sequential, each ≥1 user, no duplicates, no user at >1 level)

> Maker/Checker governance for templates relies on a coherent ordered list of approval levels per CommChannelConfig. The templates service enforces five tightly-coupled structural rules at the handler level — if any one fails, the whole bulk-update item is rejected.

## Origin (PRD)

- **PRD:** [[05 Templates]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/05-templates/BUSINESS_RULES.md) + [ENTITIES](../../../Brain%20Outputs/prd/modules/05-templates/ENTITIES.md) (`CheckerLevel`, `CheckerUser`)
- **Rule id:** `BR-TM-21` (Maker creates/submits) + `BR-TM-22` (Checker reviews) + `BR-TM-23` (WhatsApp two-step gate: internal Checker → Meta)
- **PRD line reference:** "Checker reviews, internally approves or rejects." (`latest-prd.md:36`); "WhatsApp approval is a TWO-STEP gate: internal Checker → Meta." (`understanding.md:47`); approval-trail audit per level implied throughout.
- **Excel cell:** none (PRD prose only; matrix deferred per QUESTIONS.md GAP-TM matrix items)
- **Workflow context:** [WORKFLOWS](../../../Brain%20Outputs/prd/modules/05-templates/WORKFLOWS.md) §W2 (Internal Approval) + W4 (Auto-Approval when no Checker is configured). The CommChannelConfig governs the routing.

## Backend enforcement

- **Service:** [[Templates Service]]
- **DTO:** `UpdateCommunicationChannelConfigItem { Id, BodyType, int? LevelsCount, List<CheckerLevel>? CheckerLevels }` (nested) → `CheckerLevel { int LevelNumber, List<CheckerUser> Users }` → `CheckerUser { string UserId }`
- **Attribute:**
  - DTO-level: `UpdateCommunicationChannelConfigsValidator` — `Configs.NotNull + Count > 0` (`RequiredFieldMissing`). `RuleLevelCascadeMode = Stop`. Per-item dispatched to `UpdateCommunicationChannelConfigItemValidator`.
  - DTO-level: `CheckerLevelValidator` — `LevelNumber` bounds (1..N) + at-least-one-user (`CheckerLevelMustHaveAtLeastOneUser`).
  - DTO-level: `CheckerUserValidator` — `UserId.NotEmpty`.
  - Handler-level (`UpdateCommunicationChannelConfigEndpoint`) enforces the structural bundle.
- **Error codes (the structural bundle):**
  - `FalconKeys.Error.CheckerLevelsRequired` (400) — body type requires checker levels but none supplied
  - `FalconKeys.Error.CheckerLevelMustHaveAtLeastOneUser` (400) — a declared level has zero users
  - `FalconKeys.Error.CheckerLevel1RequiredBeforeLevel2` (400) — gap in the sequence
  - `FalconKeys.Error.CheckerLevelLimitExceeded` (400) — more levels than the body type allows
  - `FalconKeys.Error.DuplicateCheckerLevelNumber` (400) — two levels share `LevelNumber`
  - `FalconKeys.Error.UserAssignedToMultipleCheckerLevels` (400) — one user appears at >1 level
  - `FalconKeys.Error.InvalidCheckerLevelNumber` (400) — `LevelNumber` ≤ 0 or out of range
  - `FalconKeys.Error.LevelsCountMismatch` (400) — declared `LevelsCount` ≠ actual `CheckerLevels.Count`
- **Source file:** [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/templates/VALIDATIONS.md) (DTO-Level Validation table + Handler-Level Validation list)
- **Error catalog:** [ERRORS](../../../Brain%20Outputs/understanding/backend/templates/ERRORS.md) (Error Codes table)
- **DTO dictionary:** [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/templates/DTO_DICTIONARY.md) (`UpdateCommunicationChannelConfigItem` + nested)
- **Endpoint:** `PUT /communication-channel-configs/{id}` (bulk update — applies items one-by-one, aborts at first failure per [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/templates/VALIDATIONS.md) "Failure Modes for Bulk Update")

**Honest call:** the validator rules are recorded by symbolic NAME in `VALIDATIONS.md` ("LevelNumber bounds (1..N)") — the literal value of `N` (the upper bound for `LevelNumber` and the `CheckerLevelLimitExceeded` threshold) is NOT in Brain Outputs. Read the validator source in `Falcon.Templates.Api/Endpoints/CommunicationChannelConfigs/Validators/CheckerLevelValidator.cs` to confirm. Also: `GAP-TM-01` says Templates entity has no public API yet AND `GAP-TM-02` says the CommunicationChannelConfigs route is not gateway-routed — so the frontend cannot reach this validation surface today.

## Frontend implementation hint

- **Form / page section:** CommunicationChannelConfig editor (admin / settings flow — exact page not yet seeded). The Create Template wizard (W1) consumes the *result* of this config; the editor itself is a separate admin surface. Frontend pending per GAP-TM-02 (gateway route missing first).
- **Suggested validator wiring:**
  - Form shape: `FormArray<FormGroup<{ levelNumber: number, users: FormArray<{ userId: string }> }>>` named `checkerLevels`.
  - Per-row sync validators: `Validators.required` on `levelNumber`; `Validators.min(1)`; `Validators.max(<bound from server>)`.
  - Per-row `users` FormArray: `Validators.minLength(1)` → maps to `CheckerLevelMustHaveAtLeastOneUser`.
  - FormArray-level cross-field validator (custom `CheckerLevelsValidator`):
    - **No duplicates** on `levelNumber` → `DuplicateCheckerLevelNumber`
    - **Sequential** from 1 (no gap → `CheckerLevel1RequiredBeforeLevel2`)
    - **Distinct users across levels** → `UserAssignedToMultipleCheckerLevels`
    - **Count match** between sibling `levelsCount` field and `checkerLevels.length` → `LevelsCountMismatch`
  - Disable the entire FormArray when `bodyType` indicates "no approval needed" (auto-approval path, W4) — see sister rule [[V-template-levels-count-required-for-restricted]].
  - On bulk-update failure (HTTP 400 with one code), display the error against the first invalid level row and stop the save flow (matches backend abort-at-first-failure behavior).
  - **Inferred** path: `apps/admin-console/.../communication-channel-configs/checker-levels.form.ts`
- **Page note:** No page seeded yet under `10-Pages/` — surface this as a follow-up once GAP-TM-02 (gateway route) lands.

## Cross-domain links

- **Permission gate:** [[Templates Service]] currently has only group-level `RequireAuthorization()`. Falcon admin can update any tenant; Client users restricted to own tenant (per [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/templates/VALIDATIONS.md) Tenant Resolution).
- **Business rule cluster:** [[05 Templates]] BR-TM-21 + BR-TM-22 + BR-TM-23 (+ open: BR-TM-31 default-Checker assignment, BR-TM-32 auto-approval scope)
- **Sister rule:** [[V-template-levels-count-required-for-restricted]] — the BodyType / LevelsCount gate that decides whether this whole rule applies
- **Related learning events:** none yet
- **Open gaps:** `GAP-TM-01` (Template entity has no public API), `GAP-TM-02` (CommChannelConfig route not gateway-routed) — both block the frontend surface today

## Tags

#type/v-rule #status/triangulated #prd/05 #service/templates #severity/medium #gap #blocked

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
