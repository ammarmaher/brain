---
name: data-table-skeleton-during-external-cells-loading-fix
description: "Falcon Stencil falcon-table-tw skipped skeleton rendering when [loading]=true AND any external cell template was projected — entire <tbody> went blank during mutation-driven reloads (visibility toggle, enable/disable). Fix: drop the `!hostsExternalCells` guard on the skeleton render path; the Angular wrapper still lets `*falconDataTableLoading` consumers override."
metadata: 
  node_type: memory
  type: project
  originSessionId: 7cd33b6d-7456-41d1-a1e7-e3e252b4335e
---

# Data-table skeleton — render during loading even when external cell templates are projected

🟢 **BUILD-GREEN** 2026-05-21 rev 2 (post-NG0600 fix: falcon-ui-core PASS / host-shell `6493f913c352711f` 11.05s / admin-console `4a68198a0d4a42e9` 26.06s / management-console `186fa0daff5b1707` 20.29s). Rev 1 hashes (Stencil-only fix, pre-NG0600 patch): host-shell `75462bdc27866efd` / admin `06d7de9aa5e39208` / mgmt `a07169549b9fc8ce`.

## Follow-up: NG0600 in syncEmptyView (rev 2)

After rev 1 Stencil fix, the user reported the data still disappeared but the console now showed `NG0600 (Uncaught RuntimeError) at FalconAngularDataTableComponent.syncEmptyView ...` repeated 6+ times. RCA: the Stencil now correctly emits empty/non-empty transitions during mutation reloads, but `syncEmptyView` writes `this._isEmpty.set(...)` at 6 callsites, and `_isEmpty()` is READ by the template footer at [CODE] `falcon-data-table.component.html:77` (`[disabled]="_isEmpty()"`). The Stencil's `falcon-cells-mounted` event fires SYNCHRONOUSLY inside the Angular change-detection pass that just patched its props — the consumer scope is still active — so the signal write throws NG0600. The error crashes the render before rows can paint → table stays blank.

Fix: introduce a private helper `setIsEmptyDeferred(value: boolean)` at [CODE] `falcon-data-table.component.ts:947` that queues `this._isEmpty.set(value)` via `queueMicrotask(...)`, then replace all 6 direct callsites (lines 973, 986, 1004, 1039, 1063, 1070) with the deferred version. The `_wasEmpty` transition-tracking flag remains synchronous so the emit-once-per-transition guard logic stays correct; only the OnPush template-read signal is delayed by one microtask. 7 edits to one file. No other consumer changes needed.

## Symptom

In admin-console Apps & Services tab (org-hierarchy → BMW client), clicking any row's **Visibility** toggle:
1. Successfully fires the PUT to `commerce/Node/application/visibility`.
2. The data-table body goes BLANK — no skeleton, no rows, no empty-state — just empty `<tbody>`.
3. After the post-save GET resolves, rows reappear with the new visibility state.

Reproducible on EVERY mutation that runs through `state.reload()` and on CommChannels tab too. The user described it as "the data-table disappears."

## Root cause

[CODE] `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx:1425`

The Stencil table-tw component had THREE mutually-exclusive `<tbody>` render paths:

```tsx
{this.loading && !this.hostsExternalCells && Array.from({ length: this.skeletonRows }).map(...)}
{!this.loading && rows.length === 0 && (<tr><td>empty-state</td></tr>)}
{!this.loading && rows.map((row, idx) => (data row...))}
```

When a consumer:
- projects `<ng-template falconDataTableCell="...">` for any column (which sets `hostsExternalCells=true`), AND
- binds `[loading]=true`

…ALL THREE paths fail:
- Skeleton path: blocked by `!this.hostsExternalCells`
- Empty-state path: blocked by `!this.loading`
- Data-row path: blocked by `!this.loading`

→ `<tbody>` renders with zero children.

`service-pricing-table.component.html` projects templates for 6 columns (visibility, priceValue, firstActivation, activation, renew, status) + shadow rows, so `hostsExternalCells` is always true on that table. During `state.reload()` (after any mutation), `submitting=true` flows into `[loading]`, and the body blanks.

The `!this.hostsExternalCells` guard was over-defensive. [CODE] `renderSkeletonRow()` at `falcon-table-tw.tsx:842-857` only reads `columnsCount` + `hasSelection` — it NEVER references projected cell templates. The non-TW variant at [CODE] `falcon-table.tsx:578` correctly has no such guard.

## Fix

Single-line change in `falcon-table-tw.tsx`:

```tsx
// OLD:
{this.loading && !this.hostsExternalCells && Array.from({ length: this.skeletonRows }).map(...)}

// NEW:
{this.loading && Array.from({ length: this.skeletonRows }).map(...)}
```

The Angular wrapper's `syncLoadingView()` (`falcon-data-table.component.ts:1090`) still honors a custom `*falconDataTableLoading` template — it locates the `[data-loading-mount]` tbody and `replaceChildren(...)` with the consumer's template view. Without a custom template, the wrapper no-ops and the internal skeleton stays visible. So:

| Consumer setup | Behavior |
|---|---|
| External cells + `[loading]=true` + NO `*falconDataTableLoading` | Internal Stencil skeleton renders (NEW — was blank) |
| External cells + `[loading]=true` + custom `*falconDataTableLoading` | Wrapper replaces skeleton w/ consumer template (unchanged) |
| External cells + `[loading]=false` + rows | Data rows via mount points (unchanged) |
| External cells + `[loading]=false` + empty | Empty-state via mount (unchanged) |
| No external cells + `[loading]=true` | Internal Stencil skeleton (unchanged) |

## Files changed

- [CODE] `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx:1420-1430` — dropped `!this.hostsExternalCells` from skeleton guard; added explanatory comment.

## Why NOT the slice / wrapper / service-pricing-table

Original suspicion was that `ServicePricingStateSlice.load()` cleared `rows.set([])` during reload. **Verified false**: `load()` only clears rows in the null-nodeId / error branches, NOT during a same-nodeId reload. The `apps()` signal stays populated throughout the in-flight refetch.

`service-pricing-table.component.html` already correctly binds `[loading]="submitting()"`. The wrapper `service-pricing.component.ts` already correctly flips `state.submitting.set(true)` before each mutation and lets `load()`'s `finalize()` clear it. No app-level changes were needed.

## Scope of impact

EVERY Falcon data-table consumer that:
1. uses `<falcon-angular-data-table>` (which hosts `<falcon-table-tw>`), AND
2. projects at least one `<ng-template falconDataTableCell="...">`, AND
3. binds `[loading]` to a signal that goes true during a mutation/reload

…will now correctly show the skeleton instead of going blank. Known affected consumers (non-exhaustive):
- admin-console Apps & Services tab (via service-pricing-table)
- admin-console CommChannels & Services tab (via service-pricing-table)
- mgmt-console Apps & Services tab (when its loading signal flips — relevant once mgmt-console wires its own mutations)
- mgmt-console CommChannels tab (ditto)
- Add Client wizard Step 3 / Step 4 tables (synchronous — loading never flips, so they were unaffected)
- Every future consumer w/ projected templates

## Related memories

- [[data-table-skeleton-loading-system]] — original 2026-05-20 system that introduced `provideFalconDataTableSkeleton()` + the Stencil skeleton render path; the guard fixed here was a hold-over from before that system existed.
- [[data-table-skeleton-initial-loading-fix]] — earlier same-day fix for the OPPOSITE problem (skeleton not showing on FIRST paint because loading default was `false`). That fix changed slice defaults; this fix changes Stencil render path. Both are needed.
- [[falcon-studio-runtime-split]] / [[falcon-studio-mf-eager-root-cause]] — separate Falcon Studio MF issues, not related.

## How to apply

If a future consumer reports "data-table goes blank during reload":
1. First check if `[loading]` is being passed a signal that flips true (likely yes).
2. Check if the consumer projects any `<ng-template falconDataTableCell="...">` (likely yes).
3. With this fix in place, the blank-tbody bug should be gone — the internal Stencil skeleton renders. If still blank, look for:
   - A custom `*falconDataTableLoading` template that's mounted but rendering nothing (consumer bug)
   - `[skeletonRows]=0` (would suppress skeletons; only the bottom spinner at `falcon-table-tw.tsx:1609` would render)
   - The wrapper not propagating the Stencil's `loading` prop (would be a bug in the Angular Input setter)
