---
name: basic-app-rebuild-mf-remote-sot-13072026
description: "Basic App REBUILT 2026-07-13 from NEW SoT (13072026 Taha drop) as runnable MF remote apps/basic-app (port 4303, ./admin + ./management exposes, @basic-app aliases) + both console Marketplace menus + Send WA/IVR compose screens + falcon date-picker showTime flag; all gates green + browser-verified vs live SoT; UNCOMMITTED"
metadata: 
  node_type: memory
  type: project
  originSessionId: 14fc28fa-5c64-42b3-95c0-27f424982061
---

**REBUILT + RUNTIME-VERIFIED 2026-07-13 (uncommitted, polishing-v0.4).** The 2026-07-12 program's
uncommitted code was GONE from the working tree (tree clean, `apps/basic-app` empty) — user directed a
fresh build from the NEW SoT `Source_of_truth_theme\13072026 latest from taha\Falcon-Taha2 4\Falcon-Taha2`
(admin/basic-app.jsx 232KB + basic-app.css 141KB + basic-app-data.jsx). Plan + §9 requirement checklist:
`C:\Falcon\plans\basic-app-rebuild-plan-2026-07-13.md`. History:
`universal-brain/state/task-history/20260713_130500_basic_app_rebuild_sot_13072026.md`.

**Architecture (supersedes the 2026-07-12 "no MF remote" ruling per user 2026-07-13 directive):** hybrid —
`apps/basic-app` is a FULL Nx MF remote (port 4303; module-federation.config exposes `./basic-app`,
`./admin`, `./management`; share fn verbatim from consoles) registered in ALL 4 host manifests
(`requiredAccess: microapp.basic-app`, `localDev {projectName:'basic-app', port:4303}`) + added to
`ensure-libs.mjs --with-remotes` → the host dev-server starts "with 3 remotes" and npm start serves it;
AND the consoles consume the two variants as lazy alias chunks (`@basic-app/admin`, `@basic-app/management`
in tsconfig.base.json) under `marketplace/basic-application` routes — menu children added to BOTH
Marketplace NavItems in host `layout.component.ts`. Structure: `src/app/{admin-console,management-console,
shared/{models,services,validations,basic-app-message-panel,basic-app-compose}}` (voice-service contract).

**Falcon date-picker TIME MODE (lib, both Stencil variants + wrapper):** `showTime=false` +
`timeValue`/`defaultTime` props, `falcon-time-change` event, wrapper `timeValueChange`; TIME section
(hh/mm steppers, minutes ±5 wrap, AM/PM) + Clear/Done footer; day-select does NOT auto-close in time
mode; `value` STAYS ISO date-only → the 2 existing consumers (contracts) untouched. Tokens §15 in
calendar.tokens.css; tailwind builders in date-picker-tailwind-classes.ts. Display: `dd-MMM-yyyy · hh:mm AM`.

**Hard-won integration facts:**
- Data-table TEMPLATE CELLS render only if `FalconDataTableCellDirective` is in the component imports —
  otherwise silent fallback to raw field text. `ColumnDef.headerKey` renders RAW — pre-translate with
  `t()` (voice-account-tab precedent). `render` cbs type as `(row: unknown)`.
- falcon-dropdown / input-number are CVA-only: bind `[ngModel]` + `(ngModelChange)` (production pattern);
  their `(valueChange)` did not fire for option picks in runtime testing. search-input emits
  `(falconSearch)` `{value}` (no valueChange). Dialog: `[title]`, `(falconClose)`.
- `<falcon-angular-dialog>` WIPES Angular-projected children under zoneless CD
  (GAP-FALCON-UI-CORE-DRAWER-DEFAULT-SLOT-001) → hand-rolled overlay modals (wbm-confirm-save-modal
  waiver pattern) — used for the send-confirm.
- New Nx project after tsconfig path edits may need `npx nx reset` (stale daemon graph broke @falcon resolution).
- Stencil build failures can be NON-FATAL in the chain (build.cjs "JS artefacts verified, continuing")
  → dist can be silently STALE; check for `[ ERROR ] TypeScript` lines.
- Browser-tool synthetic ref-clicks don't activate Stencil dropdown triggers reliably; DOM
  `trigger.click()` + visible-panel option `.click()` works (verification technique).

**Login for verify:** falcon `sysadmin`/Admin@1234 (NOT system-user); client `mitsubishi-owner`/Admin@1234.
SoT served via launch config `falcon-taha-sot-1307` (python http.server :4175).

**E2E verified in browser:** menus both consoles → Falcon view (live org tree + tabs + grids + ticker
matching the SoT's own ticker) → client roles (owner/node-admin tree vs normal-user Send buttons) →
Send Whatsapp Message (cascading selects, vars chip, unlock, phone-bubble substitution 'Hi Ahmed', group
mapping 2/2, schedule 20-Jul-2026 · 09:00 AM via time-mode picker, confirm overlay 257/643, row
TXN-100857 = SoT id formula on Scheduled tab) → Send Voice IVR (no Language; Retry Logic chips No
Answer+Busy default, 1/3 attempts).

**Open next waves (flagged):** Details/Conversation screens (SoT jsx:1099-2707; Details action = honest
toast today) · voice IVR flow preview canvas (empty state ships, matches screenshot) · Survey Pro
(deliberately omitted) · PES `microapp.basic-app` backend provisioning.

Related: [[basic-app-sot-parity-token-override-mechanism]], [[project_bsa_prd06_module_intake_plan_2026_07_06]].
