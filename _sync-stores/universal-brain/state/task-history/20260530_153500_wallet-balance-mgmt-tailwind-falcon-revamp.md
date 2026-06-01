# Task History — Wallet-Balance-Management Tailwind/Falcon Revamp (admin + mgmt)

- taskId: wallet-balance-mgmt-tailwind-falcon-revamp-2026-05-30
- date: 2026-05-30
- status: COMPLETED (build-green both consoles; NOT runtime-verified; NO commits)
- branch: polishing-v0.4 (assumed; verify before commit)

## Goal
Revamp `apps/admin-console/.../features/wallet-balance-management/` (and its mgmt twin, per user) to follow Falcon structure/theming: NO CSS/SCSS (Tailwind only), Falcon UI Core components everywhere, correct folder structure. Preserve business behavior + API calls byte-identical.

## Method
8 research agents (deep-read all 10 files + canonical patterns + token map + mgmt-twin + drawer-animation + icon-glyph availability) -> plan -> 3 user decisions (BOTH consoles; PRESERVE drawer animation in pure Tailwind; YES Falcon-ize 5 glyphs) -> multi-agent Workflow wwyjlsrj1 (U0 theme + parallel U1-U4 + build + verify) -> build-fix.

## Outcome (build-verified)
- mgmt build GREEN (exit 0). admin build GREEN (exit 0, hash ee3c0510c0120d09) after 1 import fix.
- SCSS: deleted admin wallet-balance-management.component.scss (23L) + balance-transfer.component.scss (469L, ~95% dead PrimeNG-era). Removed styleUrls. Verified zero scss/css/styleUrls/::ng-deep across all 4 components. mgmt had no scss.
- Radio (admin main): ::ng-deep vertical -> scoped Tailwind arbitrary-variant [&_.falcon-radio-group-options.is-vertical]:flex/flex-col/items-start/gap-2.5 (x2). Cards preserved (NOT swapped to dropdown).
- Drawer animation: additive 3 keyframes (drawerIn/drawerInRtl/scrimIn) + 3 --animate-* tokens in libs/falcon-theme/src/falcon-tailwind-tokens.css (:385-387, :636-638). Both drawers: animate-scrim-in + ltr:animate-drawer-in rtl:animate-drawer-in-rtl. mgmt gained the animation (was dropped) -> parity.
- Icons: 5 glyphs Falcon-ized both consoles: chevron->icons.CHEVRON_RIGHT, person->icons.USER, transfer->icons.WALLET_TRANSFER, close->icons.CLOSE (<falcon-svg-icon>); search-><falcon-angular-icon name=search size=sm>. Lock + Riyal left raw (intentional, not in the 5).
- Token hygiene: ALL arbitrary text-[Npx] -> exact Falcon --text-* tokens (byte-exact px verified: 11=--text-2xs, 12=text-xs, 12.5=--text-xs-half, 13=--text-xs-3, 13.5=--text-sm-half, 15=--text-sm-3, 22=--text-lg-half, 24=text-2xl). Zero pixel drift. w/h/min-h/rounded/hex/gradients untouched.

## Key learning (reusable)
The font-icon element `<falcon-angular-icon name=... size=...>` is backed by **FalconAngularIconComponent** from **@falcon/ui-core/angular** (the same barrel as falcon-angular-dropdown/-button). It is NOT the `@falcon` export `FalconIconComponent` (selector `falcon-icon`, takes an `icon` input). Mixing them => NG8001 'falcon-angular-icon is not a known element'. The SVG-registry element `<falcon-svg-icon>` (SvgIconComponent + SVG_ICON_NAMES) is from `@falcon`. A wrong CSS-var token name in `text-[length:var(--x)]` will NOT fail the build (renders no font-size) -> must verify token existence by hand.

## Frozen (preserved)
getWalletData GET api/commerce/accounts/{id}/hierarchy ; saveChanges POST commerce/setting/wallets ; transfer (admin charging/wallet/transfer | mgmt wallet/transfer + useGateway(Gateway.ChargingGateway)). All DTOs + child @Input/@Output contracts. services/ + models/ never edited.

## Files changed (9)
- libs/falcon-theme/src/falcon-tailwind-tokens.css (additive)
- admin wallet-balance-management.component.{ts,html} (+deleted .scss)
- admin components/balance-transfer/balance-transfer.component.{ts,html} (+deleted .scss; import fix)
- mgmt wallet-balance-management.component.html
- mgmt components/balance-transfer/balance-transfer.component.{ts,html}

## Pending / follow-up
- Runtime re-check when Docker is up (currently down per parked task): radio-vertical arbitrary-variant + drawer slide-in/scrim-fade. Both compile; mgmt drawer now identical so one confirmation covers both.
- NO commits made. Reviewer can `git diff`; revert = `git checkout -- <file>` / restore deleted scss from git.
- Verify "check 4" was a false alarm (mgmt transfer literal differs by-design; services untouched).
