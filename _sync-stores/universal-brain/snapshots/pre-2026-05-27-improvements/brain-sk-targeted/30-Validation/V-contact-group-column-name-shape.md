---
type: validation-rule
id: V-contact-group-column-name-shape
prd: PRD-04
service: contact-group
severity: high
status: triangulated
drift: false
created: 2026-05-15
---
*** Validation V-contact-group-column-name-shape — Column names: EN letters, no special chars, no duplicates, ≤20, spaces → _ ***
*** Origin: PRD-04 Contact Group Management · Backend: contact-group · 2026-05-15 ***

# V-contact-group-column-name-shape — Column names are English-letter-only, ≤20 chars, no duplicates, no special chars, spaces auto-converted to `_`

> Columns become template variables when the group is linked to a template (W7 → [[05 Templates]]). PRD enforces a strict naming shape so that downstream template variable substitution stays deterministic and human-readable. The "spaces → `_`" rule is an auto-transform (not a reject), the rest are rejects.

## Origin (PRD)

- **PRD:** [[04 Contact Group Management]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/04-contact-group-management/BUSINESS_RULES.md) + [ENTITIES](../../../Brain%20Outputs/prd/modules/04-contact-group-management/ENTITIES.md) (`ContactGroupColumn` + tabular column rules)
- **Rule id:** `BR-CGM-06` (column constraints) + `BR-CGM-05` (HasHeader toggle context)
- **PRD line reference:** "Column names: English letters only, no duplicates, no special chars, <=20 chars, spaces auto-converted to `_`." (`latest-prd.md:31`)
- **Excel cell:** none (PRD prose only)
- **Workflow context:** Wizard Step 2 — Preview & Configure ([WORKFLOWS](../../../Brain%20Outputs/prd/modules/04-contact-group-management/WORKFLOWS.md) §W1 step 2). Toggling `HasHeader` controls whether names come from row 1 or auto-named placeholders. Either way, the final column names must pass this rule before commit.

## Backend enforcement

- **Service:** [[Contact Group Service]]
- **DTO:** `CreateContactGroupRequest.ColumnConfig` (nested DTO — per-column `{ name, type, alias }` entries). The final accepted aliases re-surface in `BrowseContactGroupContactsEndpoint` response (dynamic alias-keyed dictionary).
- **Attribute:** FluentValidation enforces shape at the `ColumnConfig` level (server-side validator on commit). PRD-listed constraints (EN letters, ≤20, no duplicates, no special chars, spaces→`_`) are enforced via either a per-column `Matches(pattern)` rule + `Custom(...)` duplicate check, OR via handler-level logic in `CreateContactGroupCommandHandler`. **Exact attribute names not recorded in `VALIDATIONS.md`** — see honest call.
- **Error code:** No dedicated `ContactGroupColumn*` error code observed in `FalconKeys.Error` (per [ERRORS](../../../Brain%20Outputs/understanding/backend/contact-group/ERRORS.md)). The generic codes likely used:
  - `RequiredFieldMissing` (400) — empty column name
  - `MaxLengthExceeded` (400) — name > 20
  - `InvalidOperation` (422) — duplicates / disallowed chars (catch-all)
- **Source file:** [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/contact-group/VALIDATIONS.md) (`CreateContactGroupRequestValidator` row — `ColumnConfig` validation noted as "per-column type mapping & alias")
- **Error catalog:** [ERRORS](../../../Brain%20Outputs/understanding/backend/contact-group/ERRORS.md)
- **DTO dictionary:** [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/contact-group/DTO_DICTIONARY.md) (`CreateContactGroupRequest`, `ColumnConfig`)

**Honest call:** the column-shape rule is documented as a PRD requirement and the `ColumnConfig` field carries the alias mapping, but `VALIDATIONS.md` does **not** spell out the exact FluentValidation chain or a dedicated error code for the column rule (GAP-CGM-08 marked UNVERIFIABLE / likely COVERED). Frontend should treat the rule as **definitely enforced** but be prepared for generic 400 codes rather than a specific `InvalidColumnName` key. Surface in [[GAPS_INDEX]] as a candidate for a dedicated error code in a follow-up backend patch.

## Frontend implementation hint

- **Form / page section:** Create Contact Group wizard — Step 2 (Preview & Configure) — column-config table (one row per detected column, editable `name` + `type` + `alias`). Frontend pending per GAP-CGM-34.
- **Suggested validator wiring:**
  - Per-row `Validators.required` on the column name
  - Per-row `Validators.maxLength(20)`
  - Per-row `Validators.pattern(/^[A-Za-z_]+$/)` — EN letters + underscore only
  - Per-row **input transform** (NOT validator) to replace `\s+` with `_` on blur — matches PRD "spaces auto-converted to `_`"
  - FormArray-level uniqueness check (custom `CrossFieldValidator`) — rejects two rows with the same name (case-sensitive — TBD; PRD silent)
  - All maps fall back to generic backend codes (`RequiredFieldMissing`, `MaxLengthExceeded`, `InvalidOperation`) — display the form's localized message, not the raw code.
  - **Inferred** path: `apps/admin-console/.../create-contact-group/validators/column-name.validator.ts`
- **Page note:** [[Organization Hierarchy]] (Contact Groups page not yet seeded under `10-Pages/`)

## Cross-domain links

- **Permission gate:** [[Contact Group Permission Matrix]] — Create allowed for Client AO / NA / NU
- **Business rule cluster:** [[04 Contact Group Management]] BR-CGM-05 + BR-CGM-06 + BR-CGM-07 (`HasHeader` toggle context + 5-row preview)
- **Cross-PRD impact:** [[05 Templates]] — column names become template variables (W7 link-to-template flow); BR-TM-12 + BR-TM-06..10 (variable rules)
- **Sister rule:** [[V-template-checker-level-integrity]] — sibling within the templates flow that consumes these column names
- **Related learning events:** none yet
- **Open gap:** GAP-CGM-08 (UNVERIFIABLE: handler validator shape) — surface as "needs dedicated error code"

## Tags

#type/v-rule #status/triangulated #prd/04 #prd/05 #service/contact-group #severity/medium #gap

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
