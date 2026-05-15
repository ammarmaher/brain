*** Error code — ContactGroupNameRequired ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.ContactGroupNameRequired`

## Throwing service(s)
- [[Contact Group Service]] — `CreateContactGroupRequest`

## HTTP status
- **400** Bad Request (inferred)

## Scenario
- `CreateContactGroupRequest.Name` is empty.

## UX handling
- **Inline at the Name field** in Create/Rename dialog.

## Related V-rule
- [[V-contact-group-name-required-format]]

## Related E-* entity
- `E-ContactGroup`

## Related flow playbook
- (Create Contact Group flow — playbook pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
