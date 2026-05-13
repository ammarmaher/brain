*** Asset Download Rules ***
*** Whitelist + overwrite policy + log format for the orchestrator's asset download step ***

# Asset Download Rules

Step (d) of the sync orchestrator. Reads each module's `attachments.md` for download URLs and
fetches asset files into `prd-knowledge/modules/<slug>/assets/`. This step does NOT call the
Drive API directly. URLs must already be present in `attachments.md` (or the source map) — the
upstream `prd-knowledge` skill is responsible for placing them there.

## Allowed file extensions

Assets are downloaded only when the URL's path ends with one of these (case-insensitive):

| Group | Extensions |
|---|---|
| Spreadsheets | `.xlsx`, `.xlsm`, `.csv` |
| Documents | `.pdf`, `.docx`, `.pptx` |
| Images | `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp` |

Any other extension is logged as `ASSET_SKIPPED: unsupported-ext (<url>)` and skipped.

## Origin whitelist

A URL is downloaded only when its host is one of:

- `drive.google.com`
- `docs.google.com`
- `googleusercontent.com` (and any subdomain)
- `lh3.googleusercontent.com` / `lh4.googleusercontent.com` / `lh5.googleusercontent.com`
- `drive.usercontent.google.com`

Any host outside the whitelist is logged as `ASSET_SKIPPED: untrusted-origin (<url>)` and
skipped.

## Destination

```
brain-skills/business-skills/prd-knowledge/
  modules/
    <module-slug>/
      assets/
        <original-filename>     <- file name preserved verbatim from the URL
```

If `attachments.md` provides a `filename:` annotation, that name is used. Otherwise the last
segment of the URL path is used (URL-decoded). All filename characters outside `[A-Za-z0-9._-]`
are replaced with `_` to keep paths Windows-safe.

## Overwrite policy (per existing `prd-knowledge` Asset OVERWRITE rule)

> Every sync ALWAYS overwrites `modules/<slug>/assets/**`. No versioning, no rename, no
> skip-if-exists for the same Drive file ID.

Implementation:

1. If the file does not exist locally — download.
2. If the file exists and the response provides an `ETag` AND a local sidecar `.etag` file
   matches — skip with reason `unchanged-etag`.
3. If the file exists and content-length equals local size AND no `ETag` is available — skip
   with reason `unchanged-size`.
4. Otherwise — overwrite. Update the sidecar `.etag` file if a new ETag was returned.

The sidecar lives next to the asset (e.g. `assets/foo.xlsx` → `assets/foo.xlsx.etag`).
Sidecars are pure cache; deleting them only forces a re-download on the next run.

## Network behaviour

- `Invoke-WebRequest` with `-UseBasicParsing`.
- Default timeout: 60 seconds per URL.
- A failed download (non-2xx, timeout, parse error) is logged as
  `ASSET_FAILED: <reason> (<url>)` and the orchestrator continues with the next URL.
- Maximum file size: 100 MB. Larger responses are aborted and logged as
  `ASSET_SKIPPED: too-large (<url>)`.

## Logging — every URL produces exactly one line

| Outcome | Format |
|---|---|
| Downloaded fresh | `ASSET_DOWNLOADED: <slug>/<filename> (<bytes> B)` |
| Overwritten | `ASSET_OVERWROTE: <slug>/<filename> (<bytes> B)` |
| Skipped, ETag match | `ASSET_SKIPPED: unchanged-etag (<slug>/<filename>)` |
| Skipped, size match | `ASSET_SKIPPED: unchanged-size (<slug>/<filename>)` |
| Skipped, unsupported extension | `ASSET_SKIPPED: unsupported-ext (<url>)` |
| Skipped, off-whitelist origin | `ASSET_SKIPPED: untrusted-origin (<url>)` |
| Skipped, file too large | `ASSET_SKIPPED: too-large (<url>)` |
| Failed | `ASSET_FAILED: <reason> (<url>)` |

All lines feed the `Asset downloads` section of the sync report at
`Brain/analysis/L0-summary/sync-report.md`.

## Hard rules

1. Never download from a host outside the whitelist.
2. Never write outside `prd-knowledge/modules/<slug>/assets/**`.
3. Always overwrite — do not introduce versioning or rename schemes.
4. Continue on failure — one bad URL must not abort the whole run.
5. The script never invokes the Drive API. URL sourcing belongs to `prd-knowledge`.
