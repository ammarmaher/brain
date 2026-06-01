*** Create Contact Group — Gaps & drifts ***
*** 2026-05-18 ***

# Create Contact Group — Gaps & Drifts

## High-severity

### GAP-CCG-MGT-ONLY — Old-UI lives in management-console (not yet extracted)

[BRAIN-OUT] `Brain Outputs/datasets/old-ui-dataset/10-pages/admin-console/contact-groups/00-README.md` confirms:
> The Create-Contact-Group wizard itself is NOT in admin-console — it lives only in `apps/management-console/`, so admin-console has list + detail + edit only.

The management-console old-UI dossier for create flow is not yet extracted. Verify against management-console source when next deep-dive runs.

### Q-CCG-NAME-UNIQUE-ASYNC — No async name uniqueness endpoint documented

[BRAIN-OUT] endpoint registry doesn't include a name-exists check. Either:
- Endpoint exists but not yet documented.
- Uniqueness enforced only at commit.
- NEW UI: add async pre-check OR rely on commit-time error.

### GAP-CCG-COLUMN-NORMALIZE-AT-FE — Spaces-to-underscore auto-replace UX

[PRD] BR-CGM-06 says "spaces auto-converted to `_`". Must clearly show user what their typed name became after normalization. Add helper text + preview.

## Medium

### GAP-CCG-PROGRESS-BAR — Upload progress UX

Pre-signed PUT to S3 uses XMLHttpRequest's progress event (Angular HttpClient doesn't expose it cleanly). NEW UI must use raw XHR or fetch with custom progress tracking.

### Q-CCG-S3-RETRY — Retry policy for S3 failures?

Mid-upload failure — does FE retry automatically? Provide manual retry button?

### GAP-CCG-TOTAL-ROWS-DISPLAY — Where to show total row count

Some UIs show it in Step 3 preview. NEW UI should always show "Total rows: N" prominently.

## Low

### GAP-CCG-LARGE-FILE-CHUNKING — Multi-part upload not used

Pre-signed PUT is single-request. For files > 5GB (S3 limit), need multi-part upload. Likely not a concern at current size cap.

### GAP-CCG-DRAG-DROP-A11Y — Drag/drop must have keyboard fallback

`<falcon-uploader>` must support keyboard "Browse" fallback for accessibility.

## See also

- [README](README.md) · [00-OVERVIEW](00-OVERVIEW.md) · [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
