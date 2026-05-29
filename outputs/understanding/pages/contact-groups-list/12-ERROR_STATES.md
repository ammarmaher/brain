*** Contact Groups List — Error states ***
*** 2026-05-18 ***

# Contact Groups List — Error States

## Per-action errors

| FalconKey | Origin | UX |
|---|---|---|
| `Error.ContactGroup.NotFound` | 404 | Toast + back to list |
| `Error.ContactGroup.UnauthorizedAction` | PES denied | Toast |
| `Error.ContactGroup.NameDuplicate` | name unique violation | Inline on name |
| `Error.ContactGroup.AlreadyDeleted` | re-delete | Toast |
| `Error.ContactGroup.DownloadUrlExpired` | pre-signed URL expired | Toast "Try downloading again" |
| `Error.ContactGroup.ShareeNotFound` | user not in tenant | Inline |

## Toast service

`FalconToastService` (NOT PrimeNG MessageService).

## See also

- [08-BACKEND_API](08-BACKEND_API.md)
