*** Error code — LevelsCountRequiredForRestricted ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.LevelsCountRequiredForRestricted`

## Throwing service(s)
- [[Templates Service]] — template create/update handler

## HTTP status
- **400** Bad Request (per Templates ERRORS.md)

## Scenario
- `BodyType=Restricted` requires non-null `LevelsCount`.

## UX handling
- **Banner** at the level-builder + **disable Save** until `LevelsCount` is set when `BodyType=Restricted`.

## Related V-rule
- [[V-template-levels-count-required-for-restricted]]

## Related E-* entity
- `E-CommChannelConfigTemplate`

## Related flow playbook
- (Template create / approval flow — playbook pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
