---
name: project_wallet_balance_mgmt_tailwind_falcon_revamp_2026_05_30
description: "Wallet-Balance-Management (admin + mgmt) revamped to zero-SCSS Tailwind-only + all-Falcon-components; build-green both consoles, NOT runtime-verified, NO commits. Includes the falcon-angular-icon vs falcon-icon import gotcha."
metadata: 
  node_type: memory
  type: project
  originSessionId: 9d91c645-025e-4b5c-9063-2592bca5e781
---

Revamped `wallet-balance-management` in BOTH consoles to Falcon structure/theming: NO CSS/SCSS (Tailwind only), Falcon UI Core components everywhere, business behavior + API byte-identical. 🟢 BUILD-GREEN both (mgmt exit0; admin exit0 hash `ee3c0510c0120d09`, 20.6s), **NOT runtime-verified** (Docker down), **NO COMMITS**, branch polishing-v0.4. Done via 8 research agents -> multi-agent Workflow `wwyjlsrj1` (U0 theme + parallel U1-U4 + build + verify) -> 1 build-fix.

**Reframe:** PrimeNG was ALREADY removed (prior Wave 3/6); templates already ~90% Tailwind. Real debt = the two ADMIN `.scss` files (mgmt was already SCSS-free, the canonical reference). Deleted admin `wallet-balance-management.component.scss` (23L, 1 live `::ng-deep` radio rule) + `balance-transfer.component.scss` (469L, ~95% DEAD PrimeNG-era; only `.bt-scrim`/`.bt-drawer` animations live). Removed `styleUrls`. Verified zero scss/css/styleUrls/`::ng-deep` across all 4 components.

**Decisions (user):** BOTH consoles; PRESERVE drawer animation in pure Tailwind; YES Falcon-ize 5 glyphs. Radio cards PRESERVED (not swapped to mgmt's dropdown).

**Changes (9 files):**
- **Radio vertical** (admin main, ×2): `::ng-deep ... .falcon-radio-group-options.is-vertical{flex-direction:column;gap:calc(var(--spacing)*2.5)}` -> scoped Tailwind arbitrary-variant on the `<falcon-angular-radio-group orientation="vertical">`: `[&_.falcon-radio-group-options.is-vertical]:flex [&_...]:flex-col [&_...]:items-start [&_...]:gap-2.5` (gap-2.5=10px exact). Tailwind emits global CSS so Angular emulation doesn't block the light-DOM descendant.
- **Drawer animation** (pure Tailwind): additive 3 keyframes (`drawerIn`/`drawerInRtl`/`scrimIn`) + 3 `--animate-*` tokens in `libs/falcon-theme/src/falcon-tailwind-tokens.css` (:385-387, :636-638), mirroring existing `--animate-menu-in`/`@keyframes menuIn`. Both drawers: scrim `animate-scrim-in`, panel `ltr:animate-drawer-in rtl:animate-drawer-in-rtl`. `@if(visible)` mount unchanged. **mgmt GAINED the animation** it had dropped -> parity.
- **Icons** (5, both consoles): chevron->`icons.CHEVRON_RIGHT`, person->`icons.USER`, transfer->`icons.WALLET_TRANSFER`, close->`icons.CLOSE` via `<falcon-svg-icon>` (SvgIconComponent + SVG_ICON_NAMES from `@falcon`); search->`<falcon-angular-icon name="search" size="sm">`. Lock + Riyal(CURRENCY_SAR) left raw (intentional, not in the 5).
- **Token hygiene:** every arbitrary `text-[Npx]` -> exact Falcon `--text-*` token (byte-exact px VERIFIED in token file: 11=`--text-2xs`, 12=`text-xs`, 12.5=`--text-xs-half`, 13=`--text-xs-3`, 13.5=`--text-sm-half`, 15=`--text-sm-3`, 22=`--text-lg-half`, 24=`text-2xl`). Zero pixel drift. `w/h/min-h/rounded-[Npx]`, hex, linear-gradients untouched.

**THE BUILD-BREAK + GOTCHA (reusable):** `<falcon-angular-icon name=... size=...>` is backed by **`FalconAngularIconComponent`** from **`@falcon/ui-core/angular`** (same barrel as `falcon-angular-dropdown/-button/-input-number`). It is NOT the `@falcon` export **`FalconIconComponent`** (selector `falcon-icon`, takes an `icon` input). Importing the wrong one => `NG8001 'falcon-angular-icon is not a known element'`. The SVG-registry element `<falcon-svg-icon>` (`SvgIconComponent` + `SVG_ICON_NAMES`) IS from `@falcon`. Admin balance-transfer initially imported the wrong class (NG8001 ×2) -> fixed by mirroring the mgmt twin (which got it right). ALSO: a wrong CSS-var name inside `text-[length:var(--x)]` does NOT fail the build (renders with no font-size) -> always verify the `--text-*` token exists in `falcon-tailwind-tokens.css` by hand.

**Frozen (untouched):** `getWalletData` GET `api/commerce/accounts/{id}/hierarchy`; `saveChanges` POST `commerce/setting/wallets`; `transfer` (admin `charging/wallet/transfer` | mgmt `wallet/transfer` + `useGateway(Gateway.ChargingGateway)` — differs BY DESIGN, both reach Charging). All DTOs + child `@Input/@Output`. `services/` + `models/` never edited. No PrimeNG regression.

**Pending:** runtime re-check (Docker) of radio-vertical + drawer animation (both compile; mgmt drawer identical so one check covers both). Reviewer revert = `git checkout -- <file>` / restore deleted scss from git.

**Why:** the user's "no CSS/SCSS, Tailwind only + all Falcon components + don't change behavior/API" maps to: delete component scss, migrate live rules to Tailwind/theme, swap raw svg->Falcon icons, tokenize exact-only, freeze the wire. **How to apply:** when a Falcon feature still ships component `.scss`, check the already-clean twin first (it's the canonical pattern); migrate `::ng-deep` to scoped Tailwind arbitrary-variants; put shared animations in the theme as `--animate-*`+`@keyframes` (like `menu-in`); and remember the two icon systems ([[project_commkt_view_revamp_shared_lib_2026_05_30]]) — font `<falcon-angular-icon>`=`FalconAngularIconComponent`@`@falcon/ui-core/angular`, SVG `<falcon-svg-icon>`=`SvgIconComponent`@`@falcon`.
