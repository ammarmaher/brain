---
name: session-backup-mgmt-new-wallet-balance-wb-client-view-falcon-tailwind-a2-channel-model
description: Converted management-console wb-client-view SCSS→Tailwind @theme tokens + native→Falcon components; A2 data-driven channel model in types.ts; standards spec. Part of the NEW-WALLET-BALANCE-BACKEND-INTEGRATION-PLAN P2 (convert:client-view domain).
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-06-02
  status: completed
  originSessionId: 7b4acaa0-9ab7-4eb5-9e91-7cb26c10ee95
---

## Scope (this task)
P2 `convert:client-view` domain of the mgmt-console new-wallet-balance migration (plan: `C:/Falcon/plans/wallet-balance-port/NEW-WALLET-BALANCE-BACKEND-INTEGRATION-PLAN.md`). NOT the drawer (parallel `convert:drawer` agent owns `wb-balance-transfer-drawer/**`), NOT the backend wiring (later P4/P5). Data still = seed. View + behavior IDENTICAL. NO commits.

## What Was Done (all verified)
1. **A2 DATA-DRIVEN channel MODEL change** in `apps/management-console/.../new-wallet-balance/models/types.ts`:
   - `WbChannelId` literal-union (`'whatsapp'|'voice'|'aichat'|'sms'|'email'`) → **opaque `string`** (real backend = 3 channels, Mongo ObjectId ids, localized names — per `__tests__/fixtures/hierarchy.fixture.json` `_meta`).
   - `WbAllocation` fixed-keys → `interface WbAllocation extends Record<string, number> { single: number }` (channel-id-keyed + `single` bucket).
   - Added `WbChannelIcon` = known glyphs + `'generic'` fallback; `WbChannel.icon` widened to it. NOT a UI change (same N columns render).
   - Ripple compiles clean across seed.ts / build-rows.ts / orchestrator / drawer (the 5 literal seed keys remain valid `string` Record keys).
2. **wb-client-view SCSS→Tailwind + native→Falcon** (`components/wb-client-view/`):
   - DELETED `wb-client-view.component.scss`; removed `styleUrl`.
   - `<select>` ×4 → `falcon-angular-dropdown variant="grid" size="sm"` + per-instance `[--falcon-dropdown-font-size-sm:var(--text-xs-half)]` (12.5px). Needs `FormsModule` (added) for `[ngModel]`.
   - channel-header `<input checkbox>` → `falcon-angular-checkbox` + `[--falcon-checkbox-bg-checked:var(--color-falcon-teal-700)] [--falcon-checkbox-border-color-checked:var(--color-falcon-teal-700)]` (default is teal-500; SoT wanted teal-700) + external label span. Lock (`atLeastOneChannel`) = `[readonly]` + handler guard `onToggleChannel` (no-op when length===1) + `opacity-70`/`cursor-not-allowed`.
   - transfer `<button>` (32px circle, hover teal+scale) → `falcon-angular-button variant="secondary" size="sm" [iconOnly]` + per-instance `--falcon-button-secondary-{text,bg-hover,text-hover,border-hover}` token overrides (muted icon + teal hover) + `rootClass="!rounded-falcon-full !w-6 !h-6 !min-w-0 !p-0 ... hover:scale-105"`.
   - show-all `<button>` → `falcon-angular-button variant="link" size="lg"` + `rootClass="!underline underline-offset-4 ..."`.
   - chevron `<button>` → `falcon-angular-button variant="ghost" size="sm" [iconOnly]` + `[class.rotate-90]` open / `[class.rtl:rotate-180]` closed (canonical falcon-tree-node pattern).
   - allocation table = Tailwind `<div>`-GRID of Falcon atoms; **tree rails mirror the CANONICAL `falcon-tree-node` pattern** (Tailwind `before:`/`after:` pseudo UTILITIES reading SHARED tokens `bg-falcon-rail-default`/`-guide` (from `--background-image-falcon-rail-*`), `before:bg-falcon-rail-turn`/`-trail`, `bg-falcon-teal-alpha-18`). Kept custom SVG icons (`app-wb-ic-*`) + brand-logo.
   - Column tracks = the ONE allowed `[style.gridTemplateColumns]` runtime-geometry (computed `tableGridCols`/`masterGridCols`: single `minmax(0,1fr) 200px 80px`; multiple N×(200px|162px) channel cols + 80px). Page single-col grid = static inline `style="grid-template-columns: minmax(0, 1fr)"`.
   - Removed now-dead `colsKey` computed (was for old `[attr.data-cols]`).
3. **Standards spec** `__tests__/standards-client-view.spec.ts` (25 tests): no #hex/rgba, no arbitrary px/rem design utils, only `[style.gridTemplateColumns]`, zero native interactive els, Falcon-only, no .scss/styleUrl, Angular-21 idioms, control/column inventory 1:1, A2 model assertions. **25/25 PASS.**

## Verification (code-only; USER does live testing)
- `npx nx build management-console` = **EXIT 0** (GREEN). `npx nx build host-shell` = **EXIT 0**.
- `npx nx test management-console` = **12 files / 252 tests PASS** (incl. my 25 + the parallel drawer agent's standards-drawer(16)/transfer-rules(37) + the existing wallet-balance.service.spec(23) → proves A2 type change didn't break the DTO/service contract).
- ESLint on all 4 changed/new files = 0 err / 0 warn.
- Static-value grep gate on the HTML/TS = clean: zero #hex, zero rgba, raw px only in (a) HTML comments and (b) `calc(50%±0.5px)` rail hairlines (blessed geometry, copied from canonical falcon-tree-node) + the `[style.gridTemplateColumns]` track widths.

## Key Decisions / Traps
- **Repo root = `C:/Falcon/Falcon/falcon-web-platform-ui`** (TWO Falcon segments), NOT the env cwd `C:/Falcon`.
- **Falcon component token-override mechanism** = Tailwind arbitrary-PROPERTY utilities `[--falcon-<comp>-<token>:var(--falcon-token)]` on the component host `class`. CONFIRMED blessed pattern (canonical `falcon-tree-panel` uses `[--falcon-menu-item-bg:var(--color-falcon-teal-700)]`). It references a TOKEN (no static value) so it passes the standards gate. Works because mgmt tailwind.css `@source "./"` JIT-scans the template. The Stencil `-tw` components read these vars via the `:where(falcon-X, falcon-X-tw, falcon-angular-X)` token contracts in `libs/falcon-ui-tokens/src/components/*.tokens.css` (DO NOT edit those).
- **1.5px border** (transparent chip border) = `border-[length:var(--falcon-border-width-1-5)]` (token ref, no px literal) — JIT-generated via `@source "./"`.
- **NEEDS_APPROVAL token: `--spacing-5.25` = 1.25rem (20px)** — the SoT page/card vertical padding (`py-5.25 pt-5.25`). 20px has NO existing generic spacing token (scale jumps 18px `--spacing-4.5` → 24px `--spacing-5`; the only 20px token is the Stencil-internal `--spacing-table-cell-pad`). Per standards RULE 3 I PROPOSED it (gated) and reference `*-5.25` utilities; until the token is authored in `libs/falcon-theme` those utilities are inert (interim padding falls back to 0 for that axis). **Action for whoever owns the theme SSOT: add `--spacing-5\.25: 1.25rem;`** (and optionally rename to a semantic page-pad token). DO NOT edit libs/falcon-theme without approval.
- Falcon checkbox has NO direct `[disabled]` @Input (only CVA `setDisabledState` + `[readonly]`) — used `[readonly]` + handler guard for the channel lock (same shape as the settings-radio `disabledInput` learning, but checkbox already supports `readonly`).
- Falcon button emits `falconClick` (MouseEvent) but also bubbles native `click`; golden drawer uses `(click)` — I used `(click)` for the no-arg handlers (consistent with the shipped golden reference).
- Typography token map: 11px=`text-2xs`, 12px=`text-xs`, 12.5px=`text-xs-half`, 13px=`text-xs`(amount inline)/`text-sm-half`=13.5px, 20px label≈`text-lg`(no 19px token), 24px=`text-2xl`. teal tint #f3f8f5=`bg-falcon-teal-50`; table head #f5f5f5=`bg-falcon-table-bg-soft`; hover row #f2f4f5≈`bg-falcon-neutral-100`(#f1f3f5 nearest); border #e5e7eb=`border-falcon-neutral-200`; border-2 #eef0f2=`border-falcon-neutral-150`; text-muted #6b7280=`text-falcon-neutral-600`; text #1a1a1a=`text-falcon-neutral-900`.
- **Build non-determinism trap**: early `nx build` attempts FAILED with NG5002 in the DRAWER html — that was the PARALLEL `convert:drawer` agent's mid-edit broken state (file is `AM` in git, scss `AD`), NOT my regression (a types.ts change can't cause an HTML parse error). Once their drawer settled, build went green. If you see shifting errors across runs, a parallel agent is editing the same feature.

## What Remains (NOT my scope)
- Drawer conversion (parallel agent) — appears DONE (standards-drawer.spec green).
- P4/P5: backend wiring (R/T/S), adapter (Wb*↔IWalletDataResponse with A2 crosswalk by real channelId), PES gate, remove `.slice(0,3)` user cap, retire seed as live source.
- `--spacing-5.25` token approval + authoring (NEEDS_APPROVAL).
- USER live visual/runtime parity test (single+multiple, node/user, transfer). NO commits made.

## Files Changed (absolute)
- C:/Falcon/Falcon/falcon-web-platform-ui/apps/management-console/src/app/features/new-wallet-balance/models/types.ts (A2 model)
- C:/Falcon/Falcon/falcon-web-platform-ui/apps/management-console/src/app/features/new-wallet-balance/components/wb-client-view/wb-client-view.component.ts
- C:/Falcon/Falcon/falcon-web-platform-ui/apps/management-console/src/app/features/new-wallet-balance/components/wb-client-view/wb-client-view.component.html
- DELETED: .../components/wb-client-view/wb-client-view.component.scss
- NEW: .../new-wallet-balance/__tests__/standards-client-view.spec.ts
