*** Create Contact Group — Backend API ***
*** 2026-05-18 ***

# Create Contact Group — Backend API

## Endpoint summary

| Method | Path | Service | Phase |
|---|---|---|---|
| GET | `/api/contact-groups/upload-config` | Contact Group | Pre-wizard config |
| POST | `/api/contact-groups/uploads/init` | Contact Group | Stage 1 init |
| (PUT — to S3 pre-signed URL) | (S3 endpoint) | S3 / blob | Stage 1 upload (direct browser→S3) |
| POST | `/api/contact-groups/uploads/{uploadId}/complete` | Contact Group | Stage 1 complete (parses preview) |
| GET | `/api/contact-groups/uploads/{uploadId}/preview` | Contact Group | Stage 3 re-fetch (optional) |
| POST | `/api/contact-groups` | Contact Group | Stage 4 commit |
| GET | `/api/identity/user?Status=2,3,4&Role=6&Search=&PageNumber=&PageSize=` | Identity | Stage 4 user picker |

## InitUploadRequest

```jsonc
{
  "fileName": "contacts-2026.xlsx",
  "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "fileSizeBytes": 2621440
}
```

Response:

```jsonc
{
  "isSuccessful": true,
  "result": {
    "uploadId": "<uuid>",
    "presignedUrl": "https://s3...",
    "expiresInSeconds": 900
  }
}
```

## CompleteUploadRequest

```jsonc
{ "uploadId": "<uuid>" }
```

Response:

```jsonc
{
  "isSuccessful": true,
  "result": {
    "uploadId": "<uuid>",
    "previewRows": [
      { "first_name": "John", "last_name": "Doe", "phone": "+966..." },
      ...
    ],
    "detectedColumns": [
      { "name": "first_name", "dataType": "string" },
      { "name": "last_name", "dataType": "string" },
      { "name": "phone", "dataType": "string" }
    ],
    "hasHeader": true,
    "totalRows": 1234
  }
}
```

## CreateContactGroupRequest (commit)

```jsonc
{
  "uploadSessionId": "<uploadId>",
  "name": "My CG 2026-Q1",
  "referenceId": "CG-2026-Q1",
  "hasHeader": true,
  "columnConfig": {
    "columns": [
      { "name": "first_name", "dataType": "string" },
      ...
    ]
  },
  "sharePolicy": {
    "sharedWithAllUsers": false,
    "sharedUsers": ["<userId1>", "<userId2>"]
  }
}
```

Response:

```jsonc
{
  "isSuccessful": true,
  "result": {
    "groupId": "<cg-id>",
    "status": "Active",
    "totalRows": 1234,
    "createdAt": "2026-05-18T..."
  }
}
```

## Gateway routing

- `contactgroup/*` → System Gateway or Core Gateway (depending on actor) → Contact Group Service.
- S3 PUT goes direct to S3 endpoint — does NOT pass through Falcon gateways.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [02-STEP_1_UPLOAD](02-STEP_1_UPLOAD.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) · [12-ERROR_STATES](12-ERROR_STATES.md)
