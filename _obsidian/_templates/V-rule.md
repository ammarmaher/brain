---
type: validation-rule
id: V-<short-slug>
prd: PRD-NN
service: <service-name>
severity: <high|medium|low>
status: <triangulated|drafted|approved>
drift: <true|false>
created: <YYYY-MM-DD>
---

*** Validation V-<slug> — <short title> ***
*** Origin: PRD-NN <module> · Backend: <service> · <YYYY-MM-DD> ***

# V-<slug> — <one-line rule>

> One-sentence summary of the rule and why it matters.

## Origin (PRD)

- **PRD:** [[NN <module name>]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/NN-<slug>/BUSINESS_RULES.md) (or WORKFLOWS — whichever cites it)
- **Rule id (if PRD assigns one):** `BR-XX-NN` / `Q-XX-NN` / etc.
- **PRD line reference:** verbatim quote OR file:line citation
- **Excel cell (if applicable):** sheet name + cell — or `none`

## Backend enforcement

- **Service:** [[<Service Name> Service]]
- **DTO:** `<ClassName>` / field path
- **Attribute or validator:** `[ThrowIf...]` / `[Range(...)]` / FluentValidation rule
- **Error code:** `FalconKeys.Error.<X>`
- **Source file:** [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/<service>/VALIDATIONS.md)

## Frontend implementation hint

- **Form / page section:** where this validator should live (mark `inferred` if not directly grounded)
- **Suggested validator wiring:** Angular `Validators.*` chain or custom validator
- **Page note:** [[Page Name]] if seeded, else "_page not yet seeded under 10-Pages/_"

## Cross-domain links

- **Permission gate (if any):** [[Falcon Roles Permission Matrix]] (when the rule has a role-conditional aspect)
- **Business rule cluster:** any nearby business rules
- **Related learning events:** wiki-link if any exist

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
