# PARKED TASK — comm-mkt-view toggle size + filter dropdown

**Parked:** 2026-05-31 (user pivoted to the photo-uploader → falcon-uploader migration).
**Status when parked:** in_progress (root cause confirmed, edits NOT yet applied).
**Branch:** polishing-v0.4 · **Repo:** C:/Falcon/Falcon/falcon-web-platform-ui
**No commits, not pushed.**

## What it was
taskId `commmkt-toggle-size-and-filter-dropdown-2026-05-31`:
(a) shrink view-toggle buttons to match user's DevTools edit (h-5 w-5 / 20×20),
(b) widen Show-status filter dropdown ≥1.5× so all statuses show + fix "sometimes shows nothing".

## Where it left off (resume facts)
- `[CODE]` Toggle btnClass base = `'h-[30px] w-8'` at `libs/falcon/src/shared-features/comm-mkt-view/components/view-toggle/comm-mkt-view-toggle.component.ts:65`. Target: `h-5 w-5` (SVG stays 16×16).
- `[CODE]` Dropdown at `comm-mkt-view.component.html:16` `<falcon-angular-dropdown size=sm>`; panel pinned to trigger width via `positionPopoverFixed(...,{exactWidth:true})` at `falcon-dropdown-tw.tsx:245`.
- ROOT CAUSE truncation+empty: host is `display:block;width:100%` but sits in a shrink-to-fit inline-flex parent with no definite width → trigger collapses → exactWidth panel inherits narrow width / writes width:0 on zero/stale rect.
- FIX = wrap dropdown in a definite-width box (scoped to comm-mkt-view; shared dropdown untouched). Default already `'all'`; filtration already best-practice; i18n keys present.
- Both consumers: management-console comms-hub.component.ts (commChannels) + marketplace-applications.component.ts (appsServices).

**To resume:** restore this as current-task.json and apply the 2 edits, then build mgmt `--skip-nx-cache` + runtime-verify both pages.
