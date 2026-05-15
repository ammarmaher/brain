*** Error code — NoChangesToUpdate ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.NoChangesToUpdate`

## Throwing service(s)
- [[Commerce Service]] · [[Identity Service]] · [[Templates Service]] · [[Contact Group Service]] — generic across all PUT/PATCH handlers

## HTTP status
- **422** Unprocessable Entity (Commerce explicit; others inferred)

## Scenario
- PUT/PATCH submitted but no field actually changed value compared to current state.

## UX handling
- **Silent disable** — FE should compute dirty-state and disable the Save button when no changes exist, so this error never reaches the user.
- If it does reach the user (race / unsynced state): toast "Nothing to save".

## Related V-rule
- — (cross-cutting)

## Related E-* entity
- — (cross-cutting)

## Related flow playbook
- (every Edit flow)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
