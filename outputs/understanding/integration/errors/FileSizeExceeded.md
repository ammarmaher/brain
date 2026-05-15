*** Error code — FileSizeExceeded ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.FileSizeExceeded`

## Throwing service(s)
- [[Commerce Service]] · [[Identity Service]] · [[Contact Group Service]] — every file-upload handler

## HTTP status
- **400** Bad Request (Commerce explicit; others inferred)

## Scenario
- File size > configured cap. Contact Group uses `FileImport:MaxFileSizeMB`; profile uploaders have their own cap.

## UX handling
- **Inline at the uploader** showing the cap (e.g. "Max 5 MB").
- FE should validate before submit using the same cap.

## Related V-rule
- [[V-contact-group-file-size-cap]]

## Related E-* entity
- `E-ContactGroupUpload` · `E-User.ProfilePicture`

## Related flow playbook
- (Contact Group upload + Profile picture flows)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
