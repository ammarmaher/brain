*** Visual Repair Plan — Org Hierarchy (2026-05-15) ***

## Status
NOT STARTED — blocked at Step 2 (Falcon Eyes destination not visible). The destination shows only the auth-denied card.

## Why no plan was written
Per the task spec, repair must be **evidence-led**. Falcon Eyes is mandatory **before** any repair. With zero visible Falcon components on the destination, every repair instruction would be a guess. The task spec and Falcon Eyes governance both forbid that.

## Plan once unblocked
1. Confirm an authenticated session in the Angular admin-console so `/admin-console/org-hierarchy-page` renders the actual Organization Hierarchy feature.
2. Re-run Falcon Eyes from the existing tool at `C:\Falcon\Brain SK\tools\falcon-eyes\` — no further patching needed; the ESM dirname fix in this run is now permanent.
3. Optionally fill the `section-capture.config.json` sourceSelector / destinationSelector pairs so each section captures only its own region (currently uses full-page fallback for all 12).
4. For every per-section `SEMANTIC_MISMATCHES.md`, open one record per visible defect using `tools/falcon-eyes/semantic-mismatch-template.md`. Map each one to a Falcon component dossier under `C:\Falcon\Brain Outputs\understanding\frontend\components\<name>\`.
5. Order the repair work by severity (P0 → P1 → P2 → P3), then by section weight.
6. Apply repairs strictly inside `apps/admin-console/src/app/features/org-hierarchy-page`. Reuse Falcon components in the order: input → template → slot → token → upgrade → new lib component → wrapper → raw-as-GAP.
7. Verify each round with a new Falcon Eyes capture; stop when avg ≥ 90% (90% min, 95% ideal) or after 5 rounds.

## Standing rules still apply
- Falcon library first (Brain Outputs understanding/frontend dossiers before markup)
- Tailwind utilities + Falcon tokens only (no SCSS, no inline, no PrimeNG)
- Strict scope — no top bar, shell, sidebar, side menu, login, unrelated backend, unrelated pages
- Build must be green (`nx build admin-console`) after every round
- No commit / no push to the implementation repo without explicit user instruction at that round
