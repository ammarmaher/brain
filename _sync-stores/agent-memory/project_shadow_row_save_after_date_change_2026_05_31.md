---
name: project_shadow_row_save_after_date_change_2026_05_31
description: "Admin (sys-admin) service-pricing shadow row — \"Save does nothing after changing the Effective Date\". One-file fix in working tree (UNCOMMITTED), runtime verification INCOMPLETE; primary root cause still has an open hypothesis."
metadata: 
  node_type: memory
  type: project
  originSessionId: b23a338c-13fb-4d9b-8f12-975d3c933e39
---

# Shadow-row "Save eaten after Effective-Date change" — status 2026-05-31

**Symptom (user):** In the **Falcon sys-admin / admin console**, service-pricing SHADOW ROW (kebab → Edit Price Type or Edit Price Value): change the Effective Date, click **Save** → *sometimes* nothing happens ("I can click Save but it's not clicked"). Intermittent. Works when the date is NOT changed.

**Surface = SYS-ADMIN ONLY (RUNTIME-VERIFIED 2026-05-31).** Logged in live as `mitsubishi-owner` (acc-owner, mgmt console): Org Hierarchy → Mitsubishi → CommChannels & Services renders the shared `app-service-pricing` table, but the row kebab offers **only "Disable"** — NO Edit Price Type/Value. Confirms `[CODE] service-pricing.component.ts:275-289` gates `canEditPriceType/Value=false` for client/acc-owner. The editable shadow (the bug) is reachable ONLY as a Falcon sys-admin. **Do NOT try to repro as an account-owner.**

## Two distinct bugs — keep them separate
1. **State-wipe (REAL, and the specialist's fix targets it).** `[CODE] service-pricing-table.component.ts` constructor `effect(rows())` → `resetTableTransientState()` unconditionally cleared `editForms`/`shadowRowModes`/expansion. A synthetic (unsaved) shadow lives ONLY in `apps()` (id `${rowId}-(pt|pv)-${ts}`), never in `rows()`, so any `rows()` re-emit during the edit wiped the open form → next Save hits `onShadowRowSave` `if(!form) return` (`:593`) and/or wrapper `onShadowAction` null-guard (`falcon-data-table.component.ts:1554-1557`) → SILENT no-op. **Tell from symptom: Save no-ops AND the shadow row collapses a beat later.**
2. **Lost-click race (HYPOTHESIS, UNVERIFIED — likely the PRIMARY trigger for the user's simple flow).** Date-picker uses TWO dismiss layers (document `mousedown` outside-click `[CODE] falcon-date-picker-tw.tsx:181-191` + native Top-Layer `popover=auto` light-dismiss, `showPopover()` via rAF `[CODE] falcon-date-picker.component.ts:154-187`). Row menus are also Top-Layer `falcon-menu-tw` popovers. A REAL mousedown on Save while/just-after the picker dismisses can detach the library-rendered Save `<button>` between mousedown↔mouseup → browser fires NO `click`. **Tell from symptom: Save no-ops but the row STAYS open.**

**Why #2 is likely primary:** `[CODE] service-pricing-state.slice.ts` writes `rows()` ONLY on `load()/reload()` + `applyOptimisticRow/applyPartialRowPatch` (mutation PUT) — NO polling/SignalR/timer/reactive-reload. `appRows=computed(state.rows())` is memoized. So in the SIMPLE flow (open edit → change date → Save, no concurrent mutation) `rows()` does NOT re-emit → bug #1 cannot fire → the user's symptom is most likely #1's sibling, the lost-click race. The specialist's repro used PROGRAMMATIC `element.click()` (always fires) so it COULD NOT detect a lost click — it only proved bug #1 exists.

## The fix in the working tree (UNCOMMITTED, builds green, NOT runtime-verified)
`[CODE] libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.ts` (+118/-7): imports `untracked`; adds `isSyntheticShadowId` (`/-(pt|pv)-\d+$/`), `mergeInProgressShadows()` (re-attach open synthetic edits onto fresh rows unless a persisted same-kind change arrived), `inProgressEditKeys()`; wraps merge+reset in `untracked()` (prevents effect feedback loop); `resetTableTransientState` now PRESERVES keepEditKeys' form/mode/expansion. Diff reviewed = correct + safe. `nx build` host-shell/admin/mgmt = EXIT 0. **Fixes bug #1 only; does NOT address #2.** Mgmt console can't open the edit → zero regression there. **NO commits/push.** Working tree on `polishing-v0.4` has many unrelated dirty files → if committing, cherry-pick ONLY this file.

## Open next step
Run the instrumented real-click test as sys-admin (probe pattern: document-capture listeners for `pointerdown/mousedown/mouseup/click` on `[data-shadow-action="save"]` + `falcon-shadow-action` + datepicker open/close/change, recording `isTrusted`). Decisive: mousedown-without-`click` = #2 confirmed → fix at date-picker/portal/table layer. Session ended with user saying "I think it's working now" — NOT a rigorous confirmation of an intermittent bug.

## Dev-env traps hit this session (RUNTIME-OBSERVED 2026-05-31)
- **Chrome MCP coordinate scale:** live viewport `innerWidth=2560` but screenshot is `1568` wide (dpr 1.5) → `computer` clicks are in SCREENSHOT space. Convert CSS `getBoundingClientRect` coords by **×0.6125** (1568/2560) before `left_click`. (Earlier clicks missed because I passed raw CSS coords.)
- **MF static-remote dist corruption:** running a `nx build` while `nx serve host-shell` is live overwrites the served `dist/` → admin `:4204` throws `ReferenceError: Cannot access 'OrgHierarchyPageMenuComponent' before initialization` (chunk-order TDZ, NOT a source circular-import — the twin mgmt org-hierarchy loaded fine) + mgmt `:4301` `ChunkLoadError` for the SignalR chunk. The SignalR retry storm keeps the network non-idle → **Chrome MCP `screenshot` and `find` time out on document_idle** (use `javascript_tool` + real `left_click`, which are NOT idle-gated). Recovery = stop serve → clean rebuild remotes → one `nx serve host-shell`. Builds run mid-serve = the trap; build with the server stopped.

Related: [[reference_504_admin_console_mf_duplicate_servers_2026_05_31]] · [[project_commkt_view_revamp_shared_lib_2026_05_30]] (shadow-row + dev-server recipe).
