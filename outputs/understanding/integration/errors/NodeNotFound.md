*** Error code — NodeNotFound ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.NodeNotFound`

## Throwing service(s)
- [[Commerce Service]] — every Node-related lookup (GET hierarchy, GET account services, etc.)

## HTTP status
- **404** Not Found (Commerce explicit)

## Scenario
- Node id unknown or soft-deleted. May also indicate the caller lacks visibility (cross-tenant access scope hides the node from them).

## UX handling
- **Toast** + redirect to the parent / hierarchy view, or **404 page** if the user landed deep-link.

## Related V-rule
- — (cross-cutting)

## Related E-* entity
- `E-Node`

## Related flow playbook
- (every node-scoped flow)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
