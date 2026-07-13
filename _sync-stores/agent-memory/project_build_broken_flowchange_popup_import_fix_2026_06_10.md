---
name: project_build_broken_flowchange_popup_import_fix_2026_06_10
description: "npm start/nx build broke (mgmt+admin) from half-applied zero-warnings edits — flowChange rename dangling in mgmt flow-card, missing FalconAngularPopupComponent import in admin templates-list; FIXED + all listed warnings cleared, builds GREEN"
metadata: 
  node_type: memory
  type: project
  originSessionId: 95d9b3ec-cb34-4088-97db-b3fda7f6df29
---

# Build broken (mgmt+admin) 2026-06-10 — FIXED, zero-warnings output

**What broke `npm start`/`nx build`:** the parallel `frontend-zero-warnings-2026-06-10` session left mirror-image half-migrations across the duplicated templates-page feature:
- mgmt `flow-card.component.ts:101,104` still called `this.change.emit` after the output rename to `flowChange` (`@angular-eslint/no-output-native`) — admin side already migrated.
- admin `templates-list.component.ts:151` listed `FalconAngularPopupComponent` in the `imports` array without the TS named import — mgmt side already had it. Template uses `<falcon-angular-popup>` (delete-confirm), so the fix is ADD the import from `@falcon/ui-core/angular`, not remove the array entry.

**Warnings fixed in the same pass (user asked for both):**
- NG8113 ×3 in BOTH apps' `templates-details.component.ts`: removed unused `FalconInfoCardComponent`/`FalconNodeDetailsActionsDirective`/`FalconNodeDetailsSectionComponent` (kept `type FalconInfoCardField` — used by `infoFields()`); refreshed the stale "import preserved per edit-in-place rule" HTML comment.
- NG8102 in BOTH apps' `flow-card.component.html:55`: `(flow().buttonText ?? '').length` → `flow().buttonText.length` (`FlowConfig.buttonText: string`, models.ts:344).
- SignalR `__non_webpack_require__` APIPlugin warnings: NEW shared `tools/webpack/ignore-known-warnings.ts` (`applyIgnoreKnownWarnings`, matcher = module `@microsoft/signalr` AND message `__non_webpack_require__`) wired into admin+mgmt `webpack.config.ts` + `webpack.prod.config.ts`. host-shell never emitted them — untouched.

**Verification:** `nx run-many --target=build --projects=management-console,admin-console --configuration=development` EXIT 0; full-output grep `warning|error NG|error TS|__non_webpack_require__` = zero hits. Parent templates bind `(flowChange)` in both apps (step2-message-structure.html:800) → rename consistent. NO commits.

**Why (lessons):**
- The templates-page feature is DUPLICATED per app (not shared lib) — any rename/import fix must land in BOTH `apps/admin-console` and `apps/management-console`; diff the sibling copy first, it usually already holds the correct version of the half you're missing.
- A stale `(change)` parent binding after an output rename compiles silently (native DOM event) — grep parent bindings, don't trust the green build.
- webpack dev-server keeps listening (ports 4200/4204) while compile fails and serves the error overlay — "server up" ≠ "build ok"; conversely don't start a second `npm start` when ports are live (concurrent session was Chrome-debugging on 4200).

**How to apply:** for "build suddenly broken" in this workspace, suspect in-flight concurrent-session edits → check `universal-brain/state/current-task.json` + sibling-app copy before deep-diving.

Related [[project_cross_tab_session_localstorage_2026_06_10]] (the session whose in-flight edits were noted as breaking admin/mgmt builds).
