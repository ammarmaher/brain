*** Error code — MaxNodeLevelReached ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.MaxNodeLevelReached`

## Throwing service(s)
- [[Commerce Service]] — `CreateSubNode` handler

## HTTP status
- **422** Unprocessable Entity (Commerce explicit)

## Scenario
- The hierarchy depth has reached the tenant's `MaxNodeLevel` setting. A value of `0` means no limit per [[V-account-limits-zero-means-no-limit]].

## UX handling
- **Inline** at the tree menu + **disable Add Sub-Node** action on leaf nodes that are at the cap.

## Related V-rule
- [[V-account-limits-zero-means-no-limit]]

## Related E-* entity
- `E-AccountLimits` · `E-Node`

## Related flow playbook
- [[Add Node Flow]]

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
