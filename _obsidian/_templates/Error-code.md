---
type: error-code
code: <ErrorName>
http-status: <4xx|5xx>
throwing-services: [<service>]
v-rule-linked: <true|false>
cross-service: <true|false>
created: <YYYY-MM-DD>
---

*** Error code — <ErrorName> ***

# `FalconKeys.Error.<ErrorName>`

## Throwing service(s)

- [[<Service Name>]] — when it fires

## HTTP status

- 4xx / 5xx

## Scenario

- 1-2 lines on what causes this to throw

## UX handling

- Inline at field / Toast / Modal / Banner — per the page where it surfaces

## Related V-rule

- [[V-...]] (if the rule is triangulated)

## Related E-* entity

- [[E-...]] (if the error relates to an entity drift)

## Related flow playbook

- [[<Flow Name> Flow]] (if a specific flow surfaces this error)

## Cross-service overlap

- If this code is thrown by multiple services, list them and explain context-switch

## Hubs

- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]]
