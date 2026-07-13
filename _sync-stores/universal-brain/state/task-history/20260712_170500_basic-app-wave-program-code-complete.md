# Basic App wave program — CODE-COMPLETE (2026-07-12)

## What shipped (all uncommitted, polishing-v0.4)
- apps/basic-app (final placement ruling): home grids · WA compose · voice compose · channel-aware details (WA+voice) · channel-aware conversation (WA timeline + voice call log) · lifecycle (delete/edit-in-place/cancel) · marketplace card (mgmt) — all falcon-components-only after the B1 basic-only ruling (zero native HTML, zero <dialog>, FalconConfirmService, no custom charts/popovers/frames/canvases).
- Structure contract: per-component folders, models/validations/services tiers, @basic-app barrel.
- Scheduling time = date-picker + 48 half-hour-slot dropdown (falcon date components have no time mode).
- ONE shared-lib change (ruling-sanctioned generic flag): comm-mkt-view `open` action + `canOpen?` — backward compatible, flagged for user review.
- Obsidian: 20-Basic-App folder (MOC + ruling + feature notes). Docs: ORCHESTRATION_STATE (full wave log), BASIC_ONLY_PLAN, STRUCTURE_CONTRACT, REPLAN superseding banner.

## Evidence
1038/1038 admin-console tests (only pre-existing contracts-cost-management suite fails — documented), basic-app:lint 0, both console builds green, i18n en=ar lockstep.

## Open
- LIVE verification of F3+ blocked on the user restarting the stale watch (PID 35264).
- Flagged: W-PES (backend), W-DARK, L-track, optional generic showTime flag, F9 lib change review.
