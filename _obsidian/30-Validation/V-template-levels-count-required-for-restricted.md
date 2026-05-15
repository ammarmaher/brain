---
type: validation-rule
id: V-template-levels-count-required-for-restricted
prd: PRD-05
service: templates
severity: high
status: triangulated
drift: false
created: 2026-05-15
---
*** Validation V-template-levels-count-required-for-restricted — BodyType=Restricted requires LevelsCount + matching CheckerLevels ***
*** Origin: PRD-05 Templates · Backend: templates · 2026-05-15 ***

# V-template-levels-count-required-for-restricted — When `CommChannelConfig.BodyType = Restricted`, `LevelsCount` is mandatory and `CheckerLevels.Count` must equal it

> The CommChannelConfig `BodyType` is the master switch that decides whether a template enters the Maker/Checker approval gate (W2) or skips straight to Approved (W4 auto-approval). When BodyType is restricted, the configuration MUST carry a non-null `LevelsCount` and the actual `CheckerLevels[]` length MUST match — otherwise the approval routing is undefined.

## Origin (PRD)

- **PRD:** [[05 Templates]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/05-templates/BUSINESS_RULES.md) + [ENTITIES](../../../Brain%20Outputs/prd/modules/05-templates/ENTITIES.md) (`CommChannelConfig` row)
- **Rule id:** `BR-TM-19` (Approved = Checker-approved; if no approval is configured, auto-approved on submit) — implicit governance gate
- **PRD line reference:** "Approved = Checker-approved; if external approval needed, also externally approved. If no approval is configured, auto-approved on submit." (`latest-prd.md:42`); auto-approval workflow per [WORKFLOWS](../../../Brain%20Outputs/prd/modules/05-templates/WORKFLOWS.md) §W4: *"CommChannelConfig.bodyType / levels indicate no approval needed → Status → Approved immediately."*
- **Excel cell:** none (PRD prose only; specific BodyType enum vocabulary is service-defined)
- **Workflow context:** Acts as the routing gate between [WORKFLOWS](../../../Brain%20Outputs/prd/modules/05-templates/WORKFLOWS.md) §W2 (Internal Approval — invoked when BodyType is restricted) and §W4 (Auto-Approval — invoked when BodyType is not restricted). The `LevelsCount` value also bounds the per-level constraints enforced by [[V-template-checker-level-integrity]].

## Backend enforcement

- **Service:** [[Templates Service]]
- **DTO:** `UpdateCommunicationChannelConfigItem { Id, BodyType, int? LevelsCount, List<CheckerLevel>? CheckerLevels }` — `LevelsCount` is `int?` (nullable) precisely because non-restricted BodyTypes don't need it.
- **Attribute:** `UpdateCommunicationChannelConfigItemValidator` — *"Per-item structural rules: Id NotEmpty, conditional rules on BodyType driving LevelsCount and CheckerLevels"* (per [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/templates/VALIDATIONS.md) DTO-Level table). The conditional gate is handler-enforced for the actual mismatch check.
- **Error codes:**
  - `FalconKeys.Error.LevelsCountRequiredForRestricted` (400) — `BodyType=Restricted` but `LevelsCount` is null
  - `FalconKeys.Error.LevelsCountMismatch` (400) — declared `LevelsCount` ≠ `CheckerLevels.Count`
  - `FalconKeys.Error.CheckerLevelsRequired` (400) — body type requires checker levels but `CheckerLevels` is null/empty
  - `FalconKeys.Error.CheckerLevelLimitExceeded` (400) — `CheckerLevels.Count` exceeds the cap that the body type allows
- **Source file:** [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/templates/VALIDATIONS.md) (Handler-Level Validation list)
- **Error catalog:** [ERRORS](../../../Brain%20Outputs/understanding/backend/templates/ERRORS.md) (Error Codes table — all four codes present)
- **DTO dictionary:** [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/templates/DTO_DICTIONARY.md) (`UpdateCommunicationChannelConfigItem` + BodyType vocabulary note)
- **Endpoint:** `PUT /communication-channel-configs/{id}` (bulk update)

**Honest call:** the BodyType enum values are **not literally enumerated** in Brain Outputs — [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/templates/DTO_DICTIONARY.md) records only "likely an enum: Plain, Template, Interactive, … (verify)". The error code `LevelsCountRequiredForRestricted` strongly implies a `Restricted` member, but the full enum (`Plain` / `Template` / `Interactive` / `Restricted`?) is in the templates Domain code, not in this knowledge graph yet. Read `Falcon.Templates.Domain` to confirm the canonical list before wiring the frontend dropdown. Also: the cap on `CheckerLevels.Count` for the `Restricted` body type (the value behind `CheckerLevelLimitExceeded`) is not recorded — read the validator source.

## Frontend implementation hint

- **Form / page section:** CommunicationChannelConfig editor — `bodyType` dropdown + `levelsCount` number input + `checkerLevels` FormArray (the same form as [[V-template-checker-level-integrity]]). Same page surface, same `PUT` endpoint. Frontend pending per GAP-TM-02 (gateway route missing).
- **Suggested validator wiring:**
  - Bind `bodyType` to a [[Falcon Dropdown]] populated from the enum (canonical list TBD per honest call).
  - Use Angular `linkedSignal` (Angular 20+) to drive a *conditional validators* effect:
    - When `bodyType === 'Restricted'`:
      - Add `Validators.required` + `Validators.min(1)` to `levelsCount`.
      - Enable the `checkerLevels` FormArray.
      - Run the cross-field check: `levelsCount === checkerLevels.length` → maps to `LevelsCountMismatch`.
      - Run the sub-rules enforced by [[V-template-checker-level-integrity]].
    - When `bodyType !== 'Restricted'`:
      - Clear validators on `levelsCount`; reset to `null`.
      - Disable + clear `checkerLevels` FormArray.
      - Hide both inputs (or render them disabled-with-hint "Auto-approved — no checker required").
  - Error surface:
    - `LevelsCountRequiredForRestricted` → attach to `levelsCount` control as a `levelsCountRequired` error.
    - `LevelsCountMismatch` → attach as a form-level error banner ("Declared levels (3) does not match configured levels (2).").
    - `CheckerLevelsRequired` → attach to the `checkerLevels` FormArray as `levelsRequired`.
  - **Inferred** path: `apps/admin-console/.../communication-channel-configs/body-type-routing.directive.ts`
- **Page note:** No page seeded yet under `10-Pages/` — surface as a follow-up once GAP-TM-02 lands.

## Cross-domain links

- **Permission gate:** Templates service group-level `RequireAuthorization()`; Falcon admin can update any tenant, Client users restricted to own tenant.
- **Business rule cluster:** [[05 Templates]] BR-TM-19 (Approved / auto-approved routing) — implicitly drives this gate
- **Sister rule:** [[V-template-checker-level-integrity]] — the inner structural rules that only apply when this outer gate is `Restricted`
- **Related learning events:** none yet
- **Open gaps:** `GAP-TM-01` + `GAP-TM-02` (template entity + gateway route both missing) — block any UI today; canonical BodyType enum list also not recorded in `DTO_DICTIONARY.md`

## Tags

#type/v-rule #status/triangulated #prd/05 #service/templates #severity/medium #gap #blocked

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
