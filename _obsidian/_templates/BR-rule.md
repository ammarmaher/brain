---
type: business-rule
id: BR-<%* tR += tp.file.title.replace(/^BR-/, '') %>
prd: TBD
status: draft
severity: medium
created: <% tp.date.now("YYYY-MM-DD") %>
module: TBD-needs-classification
feature: TBD-needs-classification
verification: unverified
last-verified: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - "#type/business-rule"
  - "#status/draft"
  - "#verification/unverified"
supersedes: []
superseded-by: []
evidence-link: ""
up: "[[BUSINESS_INDEX]]"
parent: "[[BUSINESS_INDEX]]"
---

*** Business Rule BR-<%* tR += tp.file.title.replace(/^BR-/, '') %> — <one-line title> ***
*** Origin: PRD-TBD · Module: TBD · <% tp.date.now("YYYY-MM-DD") %> ***

# BR-<%* tR += tp.file.title.replace(/^BR-/, '') %> — <one-sentence rule>

> One-sentence statement of the business rule and why the business needs it.

## PRD reference

- **PRD module:** [[TBD]]
- **PRD source:** `BUSINESS_RULES.md` line / section reference
- **Rule id (PRD-assigned, if any):** `BR-XX-NN`
- **PRD verbatim quote:**

> "<verbatim PRD text>"

- **Excel cell (if applicable):** sheet name + cell — or `none`

## Backend enforcement

- **Service:** TBD
- **Endpoint(s):** TBD
- **Handler / validator:** TBD
- **DTO field(s) affected:** TBD
- **Error code:** `FalconKeys.Error.<X>` — or `not-emitted`
- **Source file:** [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/<service>/VALIDATIONS.md)

## Frontend enforcement

- **Form / page section:** TBD
- **Validator wiring:** Angular `Validators.*` chain or custom validator
- **Error message key:** TBD (en + ar)
- **Page note:** [[TBD]] if seeded, else `_page not yet seeded under 10-Pages/_`

## Test coverage

- **Backend tests:** TBD (file:line)
- **Frontend tests:** TBD (file:line)
- **E2E tests:** TBD (file:line)
- **Coverage status:** `unverified` / `partial` / `full`

## Related rules

- **Related V-rules (validators):** _none yet_
- **Related E-entities:** _none yet_
- **Related Q-tickets:** _none yet_

## Changelog

- <% tp.date.now("YYYY-MM-DD") %>: created · status draft

## Hubs

- [[BUSINESS_INDEX]] · [[V-rules-MOC]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
