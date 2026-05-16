*** Save & Cancel Audit — Organization Hierarchy → CommChannels & Services tab ***

Round 5 (2026-05-15, ~13:30-14:00 local).

Evidence-backed audit of every editable surface in the Comm Channels & Services tab.
Source dive + live chrome MCP runtime evidence captured on Ammar PC Chrome.

# Editable surfaces inventory

| # | Surface | Trigger | Component | File |
|---|---|---|---|---|
| S1 | Inline edit-row (2-field mode) | Row kebab → Edit Price Type | `<app-falcon-table-edit-row>` projected into `<falcon-angular-data-table>` `slot="row-expansion"` | `apps/admin-console/.../falcon-table-edit-row/falcon-table-edit-row.component.ts` |
| S2 | Inline edit-row (1-field mode) | Row kebab → Edit Price Value | Same component, `mode='value'` input | Same |
| S3 | Visibility toggle | Click row toggle | `<falcon-angular-switch>` inside cell template | `applications-table.component.html` line 33 |
| S4 | Insufficient Balance dialog | Inactive/Expired row kebab → Do Payment | `<falcon-insufficient-balance-dialog>` (Wave-15 in-flight) wrapping `<falcon-angular-alert-dialog>` | `libs/falcon/src/shared-ui/lib/components/falcon-insufficient-balance-dialog/` (UNSTAGED) |

# Source-dive findings

## ApplicationsTableComponent.applyEdit(id) — the actual Save handler

`apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.ts:281-292` (staged version):

```ts
protected applyEdit(id: string): void {
  const next = this.editForm();
  this.apps.update((list) =>
    list.map((r) =>
      r.id === id
        ? { ...r, priceType: next.priceType, priceValue: next.priceValue, activation: next.effDate, renew: next.effDate }
        : r,
    ),
  );
  this.editingId.set(null);
  this.editingMode.set(null);
}
```

Verdict: pure local-signal mutation. No service injection, no HTTP call, no event emission upward.

## OrgHierarchyPageMenuComponent.onUserDetailsSave — explicit deferral

`apps/admin-console/.../org-hierarchy-page-menu.component.ts:315-319`:

```ts
protected onUserDetailsSave(updated: User): void {
  this.userDetails.set(null);
  void updated;
  /*** In-memory only — backend persist deferred to a later wave. ***/
}
```

The comment is canonical. This is the project-wide save pattern on the Org Hierarchy page.

## Wave-15 in-flight refactor (UNSTAGED — discovered mid-run)

Working tree contains a partial migration to a WIRED-TO-BACKEND model for the IB modal:
- `applications-table.component.ts` adds `CommChannelPaymentService`, `OrderStatusService`,
  `SimplePollService`, `processState` polling, `VisibleCommunicationChannelResponse` types
- Swaps `<app-insufficient-balance-modal>` (local component) for shared
  `<falcon-insufficient-balance-dialog>` (new lib component at `libs/falcon/src/shared-ui/`)
- Adds `doPayment` → poll order status → fetch visible channels → resubmit with priority flow
- NEW UNTRACKED files: `libs/falcon/src/shared-data-access/lib/services/comm-channel-payment.service.ts`,
  `libs/falcon/src/shared-types/lib/models/do-payment.models.ts`,
  `libs/falcon/src/shared-ui/lib/components/falcon-insufficient-balance-dialog/`
- Wave-15 inline edit-row Save handler still local-only (only the IB-modal payment path
  is being migrated to backend in this wave).

Status: NOT STAGED, working tree compiles green (verified via `nx build admin-console` at
13:46 local — hash `8d2ea4c8c3255942`, 16.4s, no errors). Dev-serve had intermittent
mismatch errors mid-session at 13:36 when only `.html` was staged and `.ts` was not.

# Surface-by-surface verdicts

## S1 — Inline edit-row (2-field mode, Edit Price Type)

### Save audit (T30)
- Action: SMS Gateway row kebab → Edit Price Type. Change price type `Monthly` → `OneTime`,
  effective date `2026-05-25` (default). Click Save.
- DOM diff (before): `["", "SMS Gateway", "Monthly", "4,500", "2/1/2024", "2/1/2025", "2/1/2026", "Active", ""]`
- DOM diff (after):  `["", "SMS Gateway", "OneTime", "9,999", "2/1/2024", "5/25/2026", "5/25/2026", "Active", ""]`
  (the priceValue 9,999 came from the subsequent S2 test — kept here to show same row)
- Edit-row collapsed after Save (`editRowOpen=false`)
- Network: ZERO POST / PUT / PATCH calls on `/api/` (verified via chrome MCP
  `read_network_requests` immediately after click)
- Console: clean for save flow (no errors / warnings tied to save)
- Persistence: page navigation (Hierarchy ↔ CommChannels & Services round-trip OR full reload)
  resets to seed data — proves data lives only in `apps` signal local to the component instance

**Verdict: LOCAL-STATE-ONLY**

### Cancel audit (T29)
- Action: WhatsApp Business row kebab → Edit Price Type. Edit-row opened with dropdown
  "OneTime" + date picker `2026-05-25`. Did NOT change values. Click Cancel.
- DOM diff (after Cancel): `["", "WhatsApp Business", "Monthly", "3,200", "6/10/2024", "6/10/2025", "6/10/2026", "Active", ""]`
- Compared against pre-Cancel snapshot: `unchanged: true`
- Edit-row collapsed cleanly (`editRowOpen=false`)
- Network: ZERO calls
- Console: clean

**Verdict: CANCEL-WORKS**

## S2 — Inline edit-row (1-field mode, Edit Price Value)

### Save audit (T30)
- Action: SMS Gateway row kebab → Edit Price Value. 1-field input "New Price Value" with
  default `2500` rendered column-aligned under Price Value column. Cancel + Save right-side
  buttons.
- Change value via form_input: `2500` → `9999`. Click Save.
- DOM diff:
  - Before: `priceValue=4,500`, `priceType=Monthly`
  - After:  `priceValue=9,999`, `priceType=OneTime` (carry from the prior 2-field save —
    sequential edits compound in local state until reload)
- Edit-row collapsed
- Network: ZERO POST/PUT/PATCH (verified via `read_network_requests` post-click)
- Console clean
- Persistence: lost on navigation

**Verdict: LOCAL-STATE-ONLY**

### Cancel audit
- Not directly re-tested for 1-field mode; the `cancelEdit()` handler is the same code path
  as 2-field. Source: `applications-table.component.ts:276-279`:
  ```ts
  protected cancelEdit(): void {
    this.editingId.set(null);
    this.editingMode.set(null);
  }
  ```
- Source contract: editForm is reset to default on next openEdit() — never written
  to the row buffer. So Cancel cannot leak changes.

**Verdict: CANCEL-WORKS (by source contract; 2-field mode runtime-verified)**

## S3 — Visibility toggle (T19)

### Toggle audit
- Action: Apple Business Chat row visibility toggle. Pre: `checked=false`. Click toggle.
- DOM after: `checked=true` (toggle flipped)
- Network: ZERO calls
- Handler: `applications-table.component.ts:208-210`:
  ```ts
  protected onToggleVisibility(id: string, checked: boolean): void {
    this.apps.update((list) => list.map((r) => (r.id === id ? { ...r, visible: checked } : r)));
  }
  ```
- Persistence: lost on navigation

**Verdict: LOCAL-STATE-ONLY (immediate flip, no save/cancel ceremony)**

## S4 — Insufficient Balance dialog (T33-T44)

### Critical defect
- **DEFECT-CCS-R5-002 (P1)**: IB modal mounts in DOM with correct Stencil hierarchy
  (`<falcon-insufficient-balance-dialog>` → `<falcon-angular-alert-dialog>` →
  `<falcon-alert-dialog-tw>` → `<falcon-dialog-tw>` → `<div data-component="falcon-dialog-backdrop">`)
  but renders with `getBoundingClientRect()` width=0, height=0 — modal is invisible on screen
  despite `position: fixed; top: 0px; right: 0px; bottom: 0px; left: 0px;` computed style.
- Reproducible: Telegram Bot row kebab → Do Payment. Stencil `open` prop = true on both
  the alert-dialog-tw and dialog-tw nested layers. Backdrop element exists.
- Hypothesis: Stencil light-DOM host visibility race — host element keeps a `display`-collapsed
  state when `open` toggles via Stencil prop assignment (vs HTML attribute). Same family of
  defects as the historic `DEFECT-CCS-R2-001` slot-projection regression but here it's a host
  display-toggle regression.
- This defect was introduced by the Wave-15 in-flight refactor (working tree, UNSTAGED).
  Previously (Round 4 staged code) the `<app-insufficient-balance-modal>` consumed
  `<falcon-angular-alert-dialog>` directly without the new dialog wrapper, and per the Round 4
  matrix the IB modal title/subtitle DID render correctly — so the new wrapper component
  has introduced this regression.

### Save audit (Proceed Payment button)
- Cannot be exercised in current bundle — modal is invisible. Source dive only.
- Wave-15 working-tree source (`applications-table.component.ts.diff`): `onIbProceed($event)`
  receives the reordered priority list, calls `CommChannelPaymentService.doPayment(...)`,
  polls `OrderStatusService.getOrderStatus(...)` via `SimplePollService`, handles
  `CommChannelPriorityOrderRequired` failure reason by re-fetching visible channels and
  resubmitting. **Backend wiring exists when `nodeId+accountId` inputs are present.**
- Without `nodeId+accountId`, falls back to a MOCK flow with 3 placeholder channels
  (`WhatsApp / Voice / AI-ChatGPT`) — same as Round 4.
- Verdict (post-Wave-15, theoretical): WIRED-TO-BACKEND when wired up by consumer with
  `nodeId+accountId`; mock-only on the Org Hierarchy page today because the
  `<app-applications-table>` doesn't pass those inputs (verified via
  `comm-channels-tab.component.html` line 2-5 — only `[rows]` and `titleKey` passed).

**Verdict: WIRED-TO-BACKEND (capability exists in working-tree code); LOCAL-STATE-ONLY
on this page because the wiring inputs aren't supplied → falls into the mock branch.
Currently UNREACHABLE due to DEFECT-CCS-R5-002.**

### Cancel audit
- Cannot be exercised. Source contract: Wave-15 `onIbCancel()` clears the dialog signals
  and emits no upstream action.

**Verdict: CANCEL-WORKS (by source contract; runtime BLOCKED by DEFECT-CCS-R5-002).**

## Multi-lane edit (T32)

Source dive: `falcon-table-edit-row.component.ts` is a single-instance projected slot. The
Stencil `<falcon-angular-data-table>` accepts a SINGLE `[expandedRowId]` — only one row can
have its expansion open at a time. Click a second row's Edit menu item → the active
expansion replaces (does not stack). This matches the SoT behavior (React replaces, doesn't
stack).

**Verdict: NOT SUPPORTED (single-lane replace semantics); matches SoT.**

# Save/Cancel semantic delta — Dest vs SoT React

| Aspect | Dest (Angular) | SoT (React) | Delta |
|---|---|---|---|
| Save persistence | Local signal, lost on reload | Local React state, lost on reload | NONE — both local-state-only |
| Save toast | No toast | No toast in apps.jsx (only an icon flip) | NONE |
| Save network call | NONE (this page) | NONE (this page) | NONE |
| Save row update | Immediate, single render tick | Immediate, single render tick | NONE |
| Cancel persistence | Edit form reset on next openEdit | Same | NONE |
| Cancel network | NONE | NONE | NONE |
| Edit-row position | Inline between edited row and next data row | Same | NONE (first-edit case verified; later-edit `DEFECT-CCS-R5-001` for second/later opens) |
| IB modal open | Telegram (Inactive) / Push Notifications (Expired) | Same | NONE on trigger; visibility BROKEN due to DEFECT-CCS-R5-002 |
| Multi-lane stacking | Single-lane replace | Single-lane replace | NONE |

# Hidden defect surfaces (introduced by Wave-15 in-flight)

These were not present in the Round 4 staged code; they appeared when the dev-serve hot-reloaded
to working-tree state mid-session:

1. `DEFECT-CCS-R5-002` — IB modal renders with 0×0 dimensions, invisible on screen
2. `DEFECT-CCS-R5-001` — Second/subsequent edit-row open renders ABOVE the table thead
   (`top=289`) instead of inline between rows (`SMS Gateway top=451`). First-edit-after-mount
   renders correctly. Suspect: the Stencil row-expansion slot redistribution loses track of
   the projection target after the first close.

# Recommendations

| Priority | Action |
|---|---|
| P0 | User must decide: continue/finish Wave-15 in-flight refactor OR revert working tree to staged R3+R4 state. The dev-serve is in mixed state. |
| P0 | Restart dev-serve + clear `.angular/cache` if user picks revert — current dev-serve may have stale chunk references from my mid-run `nx build admin-console`. |
| P1 | Fix DEFECT-CCS-R5-002 (IB modal 0×0) before Wave-15 ships. Likely needs to write `display: block` (or `block !important`) on the `:host` of `<falcon-alert-dialog-tw>` when `open=true`, OR move the Stencil host element to use a top-layer `<dialog>` portal. |
| P1 | Fix DEFECT-CCS-R5-001 (edit-row position regression) for subsequent opens. Trace the Stencil row-expansion slot reassignment in `falcon-table-tw.tsx`. |
| P2 | Wire the Org Hierarchy page IB modal flow to use the new `nodeId+accountId` inputs once Wave-15 lands, so this page exercises the real `CommChannelPaymentService` path instead of mocking. |
| P3 | Eventually add backend persistence to `applyEdit` (edit-row Save) and `onToggleVisibility` — per the explicit "backend persist deferred" comment in the source. |

# Evidence trail

- Source files read: 4 (edit-row TS+HTML, applications-table TS+HTML, page-menu TS, IB modal HTML+TS)
- Chrome MCP runtime probes: 27 across 4 batched browser_batch calls + ~15 single calls
- Screenshots captured: 11 (R5 evidence)
- Network requests probed: 9 patterns (POST, PUT, PATCH, /api/, save, visibility, falcon-ui-alert, remoteEntry, main)
- Console errors logged: 25 total messages reviewed
- `nx build admin-console --skip-nx-cache`: GREEN (hash `8d2ea4c8c3255942`, 16.4s)
- `git status` snapshot: 21 STAGED files from R3+R4; ~13 UNSTAGED files from Wave-15 in-flight
