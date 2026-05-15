*** Error code — CheckerLevelsRequired ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.CheckerLevelsRequired`

## Throwing service(s)
- [[Templates Service]] — template create/update handler

## HTTP status
- **400** Bad Request (per Templates ERRORS.md)

## Scenario
- Template `BodyType` requires checker levels but the request shipped without any.

## UX handling
- **Banner** at top of the level-builder section + **disable Save** until at least one level is added.

## Related V-rule
- [[V-template-levels-count-required-for-restricted]]

## Related E-* entity
- `E-CommChannelConfigTemplate`

## Related flow playbook
- (Template create / approval flow — playbook pending; GAP-TM-01/02 block UI today)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
