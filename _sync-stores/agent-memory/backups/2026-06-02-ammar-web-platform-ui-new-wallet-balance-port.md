---
name: session-backup-new-wallet-balance-parity-port
description: "Net-new Angular feature \"New Wallet & Balance\" — 100% parity port of the React SoT, both apps"
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-06-02
  status: completed
  originSessionId: b41ade80-3bef-420f-ac18-dcb141bddef6
---

## What Was Done
Built NEW Angular feature `new-wallet-balance` (net-new alongside untouched `wallet-balance-management`) as a 100%-parity port of the React SoT `Falcon-Taha2/admin/wallet*.{jsx,css}`. Branch `management-console` (off polishing-v0.4). NO COMMITS.

- SHARED component `apps/host-shell/src/app/shared-components/new-wallet-balance/` (alias `@host-shell/shared/new-wallet-balance`, service-pricing precedent). Selector `app-new-wallet-balance`, one `@Input() perspective: 'picker'|'falcon'|'client'`.
- Sub-components (all selectors prefixed `app-wb-*` to satisfy @angular-eslint/component-selector): wb-view-picker, wb-clients-tree, wb-allocation-table (THE two-pane resizable centerpiece), wb-settings-card, wb-radio-pill, wb-client-view, wb-balance-transfer-drawer, wb-confirm-save-modal, wb-icons (10 inline SVG icon comps incl. RiyalMark/Points/Transfer/BrandLogo).
- data/seed.ts (verbatim SEED_ALLOC/USER_SEED/seedTree/MASTER_TOTAL=48756318.425/sub-balances + fmtNum 4-dp / fmtTotal / parseNum / findNode / clone), data/build-rows.ts (shared pure row-builder so table render + drawer holder lists agree), models/types.ts.
- Thin wrappers: admin `features/new-wallet-balance/new-wallet-balance.component.ts` (perspective="picker"), mgmt same + `.routes.ts` (perspective="client", NO data.access).
- Routes: admin app.routes.ts loadComponent + mgmt app.routes.ts loadChildren, slug `new-wallet-balance`.
- Nav: host-shell layout.component.ts — 2 path constants + doubled NavItem (admin FALCON_USER hidden:isClient / mgmt CLIENT_USER hidden:isFalcon), section 'Account Administration', FALCON_ICONS.WALLET, NO access: (permissive). Placed right after Wallet & Balance .Mng.
- i18n: top-level `newWalletBalance` block added to BOTH en.json + ar.json (60 keys, en+ar, AR gaps filled). JSON validated.
- Assets: copied 5 SoT brand logos → `apps/host-shell/src/assets/new-wallet-balance/` (aramco/snb/bupa/alrajhi/falcon). Referenced as `/assets/new-wallet-balance/*.png` (LEADING SLASH — host-shell convention; relative `assets/` would break under route URL).

## Build results (MANDATORY GATE — all green)
Stopped running `nx serve host-shell` (PID 76488) + run-executor + http-server BEFORE building (kept WebStorm LSP + nx daemon; React Vite :5173 untouched). `nx build host-shell|admin-console|management-console --configuration=production --skip-nx-cache` = ALL EXIT 0. 3-app tsc --noEmit clean. NOT re-served (orchestrator will).

## Key Decisions / Deviations
- DRAWER deviation (documented): SPEC said reuse `<falcon-angular-drawer>`. The COMMITTED admin/mgmt `balance-transfer` components DELIBERATELY render the drawer chrome directly in Angular instead — the Stencil drawer wipes the projected default-slot body under zoneless CD (header+footer paint, body empty). I followed that proven precedent: render the `.wb-drawer` 380px chrome (scrim+panel+head/body/foot) scoped, matching SoT verbatim.
- SCSS: each component SCSS aliases SoT `--teal` etc. to `var(--color-falcon-teal-700,#0d3f44)` + literal SoT hexes (#e8f0f1, #f3f8f5, #f2f4f5, #3d3d3d). Tree-rails / hover-trace / resizer-grip(position:fixed)/synced-scroll(rAF transform mirror)/48px rows ported faithfully.
- Output renames (lint @angular-eslint/no-output-native): clients-tree select→nodeSelect, drawer close→closed, confirm-modal confirm→confirmed + cancel→cancelled.
- Radio-pill: `<label>`→`<button role="radio" aria-checked>` (cleared label-has-associated-control + click/focus a11y) + SCSS native-button reset.
- Client view rows order sub-nodes-first (usersFirst=false); Falcon view node-users-first (true) — both via buildTableRows flag, matching the two SoT files.

## KNOWN / NOT achieved this pass
- 3 lint errors REMAIN on wb-confirm-save-modal backdrop `<div (click)>` (click-events-have-key-events ×2 + interactive-supports-focus ×1). These MATCH the committed `balance-transfer.component.html` which ships the identical pattern (verified: existing file has the same errors). Build is NOT gated on lint → all 3 prod builds green. Left as-is for parity + house-style consistency; could be cleared later by dropping click-outside-dismiss (ESC + X + Cancel already cover it) if the orchestrator wants lint-zero.
- NO browser/live verification done (no re-serve per instructions). Orchestrator to live-verify against SoT :5173 next.
- bmw brand logo renders inline (conic-gradient + "BMW" text) — no png asset, matches SoT BrandLogo fallback.

## Files Changed (see report) — NO COMMITS, branch management-console
Shared: 28 files under shared-components/new-wallet-balance/. Wrappers: 3. Wiring: admin+mgmt app.routes.ts, host-shell layout.component.ts, en.json, ar.json. Assets: 5 png.

## Context for Next Agent
Selector of shared comp = `app-new-wallet-balance`. Admin wrapper `<app-new-wallet-balance perspective="picker">`; mgmt `<app-new-wallet-balance perspective="client">`. Routes slug `new-wallet-balance` in both remotes. Live URLs: /admin-console/new-wallet-balance (picker→Falcon|Client), /management-console/new-wallet-balance (Client direct). Default client = Aramco; auto-opens aramco+cc+itsec rows.
