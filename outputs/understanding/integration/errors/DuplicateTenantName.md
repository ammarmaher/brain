*** Error code — DuplicateTenantName ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.DuplicateTenantName`

## Throwing service(s)
- [[Commerce Service]] — handler-side uniqueness check + Zitadel layer response when creating the account
- [[Charging Service]] — also catalogued (rarely thrown — Charging mostly mirrors Commerce's tenant create)
- [[Provisioning Service]] — also catalogued

## HTTP status
- **409** Conflict (Commerce explicit; Charging/Provisioning inferred by suffix `Duplicate*`)

## Scenario
- Account Name already exists globally across Falcon. PRD-01 BR-AM-03 requires global uniqueness so admin search and Zitadel tenant provisioning stay deterministic.

## UX handling
- **Inline at field** (Step 1 — `account-name`).
- Live async check from FE against `/api/commerce/Node/account-name/exist` reduces the server-side hit, but the 409 is still authoritative.

## Related V-rule
- [[V-account-name-format-uniqueness]]

## Related E-* entity
- `E-Account` · Zitadel organization mirror

## Related flow playbook
- [[Add Client Flow]] — Step 1

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
