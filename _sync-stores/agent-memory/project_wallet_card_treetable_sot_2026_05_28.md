---
name: wallet-card-treetable-sot-2026-05-28
description: "Wallet & Balance .Mng — falcon-angular-card empty-shell root cause + fix (Angular wrapper renders chrome directly), wallet tree-table rebuilt to SoT parity, and the IPv6/CORS/static-serve verification recipe for this host."
metadata: 
  node_type: memory
  type: project
  originSessionId: 2aa31254-b9c9-461e-b783-99c10c146027
---

# Wallet & Balance .Mng — card projection fix + tree-table SoT parity (2026-05-28)

Repo: `C:\Falcon\Falcon\falcon-web-platform-ui`. Page: admin-console `/admin-console/wallet-balance-management`. Browser-verified via web-scrub (static-served). NO COMMITS.

## 1. `<falcon-angular-card>` empty white shells — ROOT CAUSE + FIX
The Wallet cards rendered as empty shells. **Root cause: Angular content-projection is fundamentally incompatible with the `falcon-card-tw` Stencil custom element under the app's ZONELESS change detection + the define-before-project warm race** (the wallet preloads `defineFalconTwComponent('falcon-card')`, so the element upgrades and Stencil renders BEFORE Angular projects → Stencil's render destroys the projected `<ng-content>` nodes; they never reappear in the DOM).

**Three Stencil-side fixes ALL FAILED (runtime-verified empty in browser):** (a) keep `<slot>` + `forceUpdate` on child-mutation; (b) remove `<slot>` + manually relocate host children into keyed mounts; (c) `scoped: true` (Stencil scoped-slot polyfill). In every capture the projected content was ENTIRELY ABSENT from the DOM — you cannot relocate/re-render content Stencil's render already destroyed, and Angular's projection doesn't go through Stencil's patched DOM methods.

**WORKING FIX = render the card chrome directly in the Angular wrapper** (`libs/falcon-ui-core/src/angular-wrapper/components/falcon-card/falcon-card.component.{ts,html}`): plain `<div>` + native `<ng-content>` using the same Tailwind token classes (helpers already mirror `card-tailwind-classes.ts`). Removed the `<falcon-card-tw>`/`<falcon-card>` delegation + `defineFalconTwComponent` + CUSTOM_ELEMENTS_SCHEMA. `useTailwind` @Input kept as a no-op. Stencil card components stay for React/Vue output targets.
**Why:** standard Angular projection into a plain div can't be wiped by Stencil. **How to apply:** for ANY light-DOM `falcon-card-tw`-style component that must project rich/deferred Angular content under zoneless CD, render chrome in the Angular wrapper — don't fight Stencil's slot timing. See [[project_wallet_reskin_2026_05_28]] (the prior double-mount theory was wrong; real cause is projection-vs-custom-element).

## 2. Wallet tree-table → source-of-truth parity
Replaced the generic `<falcon-angular-tree-table>` + paginator in the wallet with a **bespoke 3-column CSS-grid** matching the React SoT at `C:\Falcon\Source_of_truth_theme\React\Loader Studio\admin\wallet.{jsx,css}` (`.wb-table-card`/`.wb-table-head`/`.wb-tr`): Organizations(1fr) / Wallet(160px or per-channel) / Transfer(90px); header row = selected client (bold, no input); children indented depth×20px with 18px chevron (rotate-90 + primary-700 when open), 22px user avatar (user-based only), centered readonly value input (max-130/h-32, neutral-50 bg), 32px circular transfer button (hover→primary-700/white); **no paginator** (SoT is a pure scrollable tree); 56px row min-height. Added `displayRows` (recursive flatten honoring `expandedTreeIds`) + `treeGridTemplate` + `isRowExpanded`/`toggleRowExpand` to the wallet .ts. Token map: SoT `--teal`→`falcon-primary-700`, `--text`→neutral-900, `--text-muted`→neutral-600, `--text-2`→neutral-700, `--border`→neutral-200, `--border-2`→neutral-150.
**Why:** user wanted the tree-table "exactly the source of truth"; the SoT is a custom div-grid, not a generic tree-table, so matching it = custom grid in the consumer. **How to apply:** for SoT pixel-parity on a bespoke layout, replicate the SoT markup with Falcon tokens rather than bending a generic Falcon component.

## 3. Verification recipe for THIS host (IPv6/CORS gotchas — see [[infra_ado_ipv6_blocked_use_ipv4]])
- **Backend CORS allows ONLY the `localhost` hostname origin** (`http://localhost:4200`, `:4204`) — NOT `http://127.0.0.1:4200` nor `http://[::1]:4200` (verified via OPTIONS preflight to `:7256/commerce/Node`). So the browser MUST load via `localhost`, and the server must be reachable on BOTH families (Chromium's `localhost` resolution flip-flops IPv4/IPv6).
- `nx serve host-shell` defaults the HOST to `::1`-only (IPv6 loopback) → Chromium `localhost` (IPv4) refused; `--host ::`/`0.0.0.0` made the host dual-stack but the **static-remote proxy 504'd** (`:::4302` malformed-upstream / IPv4-IPv6 mismatch). MF dev-serve is too fragile here.
- **WORKING:** `nx build admin-console/management-console/host-shell --configuration=development`, then serve the built `dist/apps/{app}` with `node_modules/.bin/http-server <dir> -a :: -p <4200|4204|4301> --cors -c-1` (dual-stack, CORS on, no cache). Edit `dist/apps/host-shell/assets/module-federation.manifest.json` → set `admin-console.active=true` (build resets it to false). Navigate web-scrub to `http://localhost:4200/`. remoteEntry.mjs serves with correct MIME.
- **web-scrub harness bug fixed** (`C:\Falcon\Brain SK\tools\web-scrub\src\scrape-url.ts`): the shadow-DOM-piercing fallback click passed a FUNCTION to `page.evaluate` → tsx/esbuild `keepNames` wrapped it with `__name` (undefined in page) → `ReferenceError: __name is not defined`. Fixed to STRING-form evaluate (like the other two evaluates) + hardened to click the deepest text match (org-tree nodes are `<div>`s with Angular handlers, not `<a>`/`<button>`).
- Login: `POST http://127.0.0.1:7777/api/auth/login {"userName":"sysadmin","password":"Admin@1234"}` → `.result.tokens.accessToken/refreshToken` (token ~30min TTL — re-login per scrape).

## 4. Balance Transfer drawer — SAME projection bug as cards, fixed the same way
`<falcon-angular-drawer>` (Stencil) ALSO wiped its projected default-slot body under zoneless CD — opening the drawer showed only the header ("Balance Transfer") + footer (Cancel/Save) with an EMPTY body (no Currency/Source/Destination/Amount/Description). Footer survived because it used a NAMED slot (`slot="footer"`); the default-slot body was discarded. FIX: render the drawer chrome DIRECTLY in Angular (scrim + slide-in `<aside>` + head/body/foot per `.wb-drawer-*` in wallet.css) in `components/balance-transfer/balance-transfer.component.{ts,html,scss}` — removed `<falcon-angular-drawer>`. Field components (falcon-angular-dropdown/input-number/textarea/radio-group) take data via @Input so they render fine in Angular DOM. Added the missing Currency (SAR/Points) field. Slide-in/scrim keyframes in the component scss. Browser-verified: transfer button (Master Wallet card + every tree row) opens the drawer fully populated (Source pre-selected, Available + 25/50/Max quick-picks, etc.).
**Rule:** EVERY light-DOM `-tw` Stencil component that an Angular host projects rich `<ng-content>` into is exposed to this defect (card, drawer, …). Default fix = render the chrome in the Angular wrapper/consumer; named slots survive but default slot is wiped.

## 5. Tree-table value presentation + paginator (user's expected screenshot)
User's expected differs from wallet.jsx: values are `﷼ <grouped number>` BOLD TEXT (right-aligned), NOT readonly input boxes, AND there IS a paginator ("Showing X - Y from Z" + Rows per page 20). Switched value cells to `<falcon-svg-icon CURRENCY_SAR>` + bold text; re-added the `<falcon-angular-paginator>` footer (paginating flattened `displayRows`, default pageSize 20). Native `<select [value]>` doesn't pre-select — use `[selected]="size === pageSize()"` on the `<option>`.

## 6. Master Wallet card gradient + split settings + vertical radios + free mode-toggle
- Master Wallet card = bespoke `<div>` (NOT falcon-angular-card) with SoT gradient `linear-gradient(135deg,#DEEBE2,#E8F2EC,#DCEBE0)` + border `#C5DBC9` (inline style — exact SoT colours per user's "exactly" directive) + centered title + divider + amount + 38px circular transfer button.
- Balance Type / Wallet Type = TWO separate `<falcon-angular-card>` (were one combined card).
- **`<falcon-angular-radio-group>` Angular wrapper ships NO layout CSS** — its `.falcon-radio-group-options.is-vertical/.is-horizontal` classes have NO effect (the flex rules live only in the Shadow-DOM `<falcon-radio-group>` stylesheet, which never reaches the wrapper's light DOM). `orientation="vertical"` did nothing → radios flowed horizontally. FIX: scoped `:host ::ng-deep falcon-angular-radio-group .falcon-radio-group-options.is-vertical { display:flex; flex-direction:column; gap:10px; }` in the wallet scss.
- Balance/Wallet Type radios made FREE-TOGGLE (`[disabled]="dataLoading()"`, dropped the `settingsDisabled()` edit-gate) so changing them immediately re-fetches (`selectDistribution`/`selectStructure` → `loadWalletData`, a pure GET) and re-renders the table — matching SoT view-toggle semantics. Verified: Node→User toggles, and the table reflects the mode (user-based shows values only on USER rows; node rows blank).

## Build status
admin-console + management-console + host-shell all build green (dev config) with all changes. falcon-ui-core lib green. NO COMMITS — working tree.
