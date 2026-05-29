*** Create Contact Group — Error states ***
*** 2026-05-18 ***

# Create Contact Group — Error States

## Per-stage errors

### Stage 1 — Upload

| FalconKey | Origin | UX |
|---|---|---|
| `Error.Upload.FileTooLarge` | size > config | Inline alert |
| `Error.Upload.InvalidFileType` | extension not csv/xls/xlsx | Inline alert |
| `Error.Upload.S3PutFailed` | S3 upload error | Toast: "Upload failed. Try again." |
| `Error.Upload.SessionExpired` | uploadId expired | Toast: "Session expired. Restart upload." |
| `Error.Upload.ParseError` | file corrupt / unreadable | Toast |

### Stage 2 — Column config

| FalconKey | UX |
|---|---|
| `Error.Column.InvalidName` | per BR-CGM-06 — inline |
| `Error.Column.DuplicateName` | inline |
| `Error.Column.NameTooLong` | inline |

### Stage 4 — Commit

| FalconKey | UX |
|---|---|
| `Error.ContactGroup.NameDuplicate` | Inline on name |
| `Error.ContactGroup.UploadSessionNotCompleted` | Toast: "Upload incomplete. Go back." |
| `Error.ContactGroup.NoPermission` | Toast |
| `Error.ContactGroup.AccountQuotaExceeded` | Toast: "Account has reached its contact-group limit." |

## See also

- [07-VALIDATIONS](07-VALIDATIONS.md) · [08-BACKEND_API](08-BACKEND_API.md)
