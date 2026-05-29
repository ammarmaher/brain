*** Create Contact Group — Step 3: Preview ***
*** 2026-05-18 ***

# Create Contact Group — Step 3: Preview

> Read-only review of the first 5 rows (per BR-CGM-07). Optional re-fetch via `GET /uploads/{id}/preview` if user wants to refresh.

## UI shape

```
+--------------------------------------+
| Step 3 of 4 — Preview                |
+--------------------------------------+
|  | first_name | last_name | phone   |
|  |------------|-----------|---------|
|  | John       | Doe       | +966... |
|  | Jane       | Smith     | +966... |
|  | Ali        | Hassan    | +966... |
|  | Maryam     | Karim     | +966... |
|  | Khalid     | Saudi     | +966... |
|                                      |
|  (Total rows: ~1,234)                |
|                                      |
|       [← Previous]  [Next →]         |
+--------------------------------------+
```

## Re-fetch preview

```
GET /api/contact-groups/uploads/{uploadId}/preview
Response: ServiceOperationResult<CompleteUploadResponse>  // same shape as /complete
```

Useful if column config changes affect display.

## See also

- [03-STEP_2_COLUMN_CONFIG](03-STEP_2_COLUMN_CONFIG.md) · [05-STEP_4_NAMING_SHARE](05-STEP_4_NAMING_SHARE.md)
