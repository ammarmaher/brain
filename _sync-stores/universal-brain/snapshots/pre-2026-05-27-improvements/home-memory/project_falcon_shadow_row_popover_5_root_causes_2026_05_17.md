---
name: Shadow-Row Popover 5 Root Causes + Phase Plan
description: Calendar/dropdown mis-position inside <falcon-data-table> shadow rows (apps-services-tab) — 5 independent RCs identified, phase 1 landed
type: project
originSessionId: b15a3d2b-45c9-4773-896b-2286086ac3da
---
**🟡 PHASE 1 LANDED (2026-05-17)** — Calendar/dropdown popover mis-positions when opened inside `<falcon-angular-data-table>` shadow rows on `apps-services-tab` (and any consumer of `*falconDataTableShadowCol`). User reported calendar opens "bottom right of viewport" + dropdown afterward "shows values, which is not good". Pass-3 fix (2026-05-16) per `project_zindex_calendar_portal_root_cause_fix.md` was REAL but PARTIAL — it closed ONE race (var-publish ordering on first shadow mount) but did not address 4 other independent failure modes.

**Why:** Pass-3 was scoped to first-projection-only. The applications-table consumer ([CODE] `apps/admin-console/.../applications-table/applications-table.component.html:204-225`) exposes structural patterns the pass-3 fix never tested against: tiny form min-h (5px), `*falconDataTableShadowCol` directive applying `position:absolute + transform:translateY(-50%)` to anchor ancestor, Stencil↔Angular event-bubble cascade, and `host.replaceChildren(...)` on every shadow emit.

**How to apply:**

**The 5 independent root causes (all real in current code):**

1. **`--falcon-data-table-shadow-row-min-height: 5px`** ([CODE] `libs/falcon-ui-tokens/src/components/data-table.tokens.css:239`) — token regression; documented default is 56px. Form is 5px tall; absolutely-positioned date-picker input has rect outside the form's box. Off-by-tens-of-px popover anchor.

2. **Ghost utility class cascade after portal** — `falconDatePickerPopoverClasses()` ([CODE] `libs/falcon-ui-core/src/tailwind/date-picker-tailwind-classes.ts:141`) returns `absolute top-full start-0 ...`. When the popover re-renders (state change in same component), `componentDidRender` runs against the NEW `popoverEl` ref but the OLD node may remain in `.falcon-overlay-container` with stale inline writes. New node gets utility-class-only positioning → lands at bottom-{left,right} of viewport.

3. **`host.replaceChildren(...view.rootNodes)` on every emit** ([CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts:~1287`) — Stencil table emits `falconShadowCellsMounted` on EVERY componentDidRender ([CODE] `falcon-table-tw.tsx:593`, gated only by hasShadowRows). Angular wrapper unconditionally calls `replaceChildren`, briefly detaching the anchor element. Popover-portal reads zero-rect → parks at (-9999,-9999) → scheduled rAF tries to self-heal.

4. **Stencil-event → Angular-CD → Stencil-emit cascade** — date picker emits `falcon-change`/`falcon-open`/`falcon-close` (bubbles+composed). Each fires Angular signal mutation, which re-syncs Stencil props, which re-renders the table, which re-emits `falconShadowCellsMounted`. Pass-3 fix's stability rAF was capped at 2 retries — insufficient for the storm.

5. **Outside-click race with portaled twin** — date-picker's `handleDocumentMousedown` ([CODE] `falcon-date-picker-tw.tsx:160`) closes on dropdown click via `isOutsideClick(ev, host, popoverEl)`. Close triggers re-render cascade (#4). Dropdown's `handleTriggerClick` reads its own `anchorEl` rect mid-`replaceChildren` → opens at wrong location.

**Phase 1 LANDED (this commit, 2026-05-17):**
- **Fix 5a** `STABILITY_MAX_RETRIES` 2 → 8 ([CODE] `libs/falcon-ui-core/src/utils/popover-portal.ts:99`). Covers the multi-frame `replaceChildren` storm (~128ms worst case vs prior ~32ms).
- **Fix 5b** Zero-rect during rAF stability check no longer silently returns — re-schedules with `retryDepth+1`, bounded by the new ceiling.
- **Fix 5c** `!rectUsable` park-then-retry now bumps `retryDepth` so a persistently-zero-rect-but-connected anchor (display:none, replaceChildren storm) cannot loop forever.
- **GR-3** Debug flag documented in [BRAIN-OUT] `understanding/frontend/components/falcon-date-picker/GAPS_AND_UPGRADES.md` — turn on with `window.__FALCON_DEBUG_POPOVER__ = true` in DevTools, dumps anchor measurement chain on every popover open.

**Build:** `nx build falcon-ui-core --skip-nx-cache` GREEN in 46.20s. Dist bundle hash: `popover-portal-Dq4QeVsc.js` (esm), `popover-portal-XDh-EBcp.js` (cjs). Same 4 pre-existing reserved-prop warnings (toast.title, dialog.title, table.scrollHeight) — unrelated.

**No commits, no push** ([MEMORY] standing rule).

**Phase 0 finding (RULED OUT):** stale bundle. QA-Web confirmed live page reads `--falcon-overlay-z-index: 1400` on `:root` — matches pass-1's post-rebuild value. Webpack/HMR DOES serve the rebuilt dist. The bug is NOT a build-cache miss.

**Phase 0 blocker:** cloud staging (`auth.falconhub.space` etc.) returns 500/503; docker is down; can't auth to run actual repro. User opted to skip live capture and ship fixes blind based on the 5-RC analysis.

**Phases remaining (parked awaiting user "go"):**
- **Phase 2 — Fix 4** Split popover classes by `appendTo` — `falconDatePickerPopoverClassesPortal()` variant omits `absolute top-full start-0` so orphan popovers land at (0,0) instead of viewport corners. Risk: any consumer with custom CSS targeting `.falcon-date-picker-popover` could be affected (grep `apps/**` first).
- **Phase 3 — Fix 3 + GR-1** Anchor on inner trigger (input/button) instead of wrapper div + add shadow-rows-demo scenario 5 using `*falconDataTableShadowCol` (today's demo doesn't exercise this structural pattern, which is WHY this regression wasn't caught).
- **Phase 4 — Fix 2** Diff-guarded `host.replaceChildren` (skip when nodes already installed) + emit-gate hash on `falconShadowCellsMounted` (skip when mount set unchanged). Highest-risk fix; needs demo from Phase 3 to verify.
- **Phase 5 — Fix 1 + GR-2** Restore `--falcon-data-table-shadow-row-min-height: 56px` (saved for last — visual regression on every shadow row consumer; the only fix that's user-visibly observable) + token-floor lint rule.

**Trigger phrases to resume:** `continue shadow-row popover phase 2` / `start phase 3 demo scenario 5` / `verify phase 1 in browser` (requires docker up).

**Risk inventory if Phase 1 is the ONLY fix:** popover may still mis-position on the FIRST click in a shadow row before the rAF storm settles. The 8-retry budget gives ~128ms of self-healing — user may see a brief flash from off-screen to correct position. If that's visible, escalate to Phases 2-3 immediately.

**Reference:** Conversation `2026-05-17` — full 5-RC analysis with file:line citations + per-fix regression budget. Memory entry preserves the plan structure; recover full reasoning from session transcript if needed.

**Files modified this phase:**
- `libs/falcon-ui-core/src/utils/popover-portal.ts` (3 atomic edits: constant bump + park-retry bound + zero-rect rAF handler)
- `Brain Outputs/understanding/frontend/components/falcon-date-picker/GAPS_AND_UPGRADES.md` (GR-3 doc block)

**Files NOT modified (intentional):**
- Any consumer in `apps/admin-console/**` ([MEMORY] `feedback_falcon_ui_library_only_no_native`)
- Any other Stencil component
- Any token file (the `5px` regression survives — addressed in Phase 5)
