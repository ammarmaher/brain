*** Error code — InvalidFileType ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.InvalidFileType`

## Throwing service(s)
- [[Contact Group Service]] — upload handler

## HTTP status
- **400** Bad Request (inferred)

## Scenario
- File extension is not in the configured `FileImport:AllowedExtensions` set.

## UX handling
- **Inline at the uploader** showing the allowed-extension list.

## Related V-rule
- [[V-contact-group-file-type-allowlist]]

## Related E-* entity
- `E-ContactGroupUpload`

## Related flow playbook
- (Contact Group upload flow — playbook pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
