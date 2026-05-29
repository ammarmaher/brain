*** Create Contact Group — Step 1: Upload ***
*** 2026-05-18 ***

# Create Contact Group — Step 1: Upload

## Pre-fetch config

[BRAIN-OUT] `GET /api/contact-groups/upload-config`:

```jsonc
Response: ServiceOperationResult<{
  maxFileSizeMB: number,        // e.g. 10
  allowedExtensions: string[],  // ['csv', 'xls', 'xlsx']
  previewRowCount: number       // 5 per BR-CGM-07
}>
```

## File picker

User clicks "Browse" or drags file. Constraints checked FE-side:

| Constraint | Rule | Source |
|---|---|---|
| Extension | csv / xls / xlsx | BR-CGM-04 |
| Size | ≤ `maxFileSizeMB` | BR-CGM-04 (configurable) |

## Upload session init

```
POST /api/contact-groups/uploads/init
Body: { FileName, ContentType, FileSizeBytes }
Response: ServiceOperationResult<{
  uploadId: string,
  presignedUrl: string,
  expiresInSeconds: number
}>
```

## Direct browser → S3 upload

```typescript
// Use fetch or XMLHttpRequest, not Angular HttpClient (skips interceptors)
const result = await fetch(presignedUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': contentType },
});
```

## Upload progress

UI shows progress bar via XMLHttpRequest's `progress` event:

```typescript
xhr.upload.onprogress = (event) => {
  this.progress.set(Math.round((event.loaded / event.total) * 100));
};
```

## Complete upload

```
POST /api/contact-groups/uploads/{uploadId}/complete
Response: ServiceOperationResult<{
  previewRows: Array<Dictionary<string, object>>,
  detectedColumns: Array<{ name: string, dataType: string }>,
  hasHeader: boolean
}>
```

## UI shape

```
+--------------------------------------+
| Step 1 of 4 — Upload Contact File    |
+--------------------------------------+
|                                      |
|   Drag a CSV / XLS / XLSX file here  |
|   or [Browse]                        |
|                                      |
|   ┌──────────────────────┐           |
|   │ contacts-2026.xlsx   │           |
|   │ 2.5 MB               │           |
|   │ ▓▓▓▓▓▓▓▓░░░░░░ 60%   │           |
|   └──────────────────────┘           |
|                                      |
|                       [Next →]       |
+--------------------------------------+
```

## See also

- [03-STEP_2_COLUMN_CONFIG](03-STEP_2_COLUMN_CONFIG.md) · [06-SECTION_UPLOAD_SESSION_FSM](06-SECTION_UPLOAD_SESSION_FSM.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [08-BACKEND_API](08-BACKEND_API.md)
