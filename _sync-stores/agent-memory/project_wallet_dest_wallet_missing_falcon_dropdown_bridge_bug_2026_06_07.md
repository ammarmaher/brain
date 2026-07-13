---
name: project-wallet-dest-wallet-missing-falcon-dropdown-bridge-bug-2026-06-07
description: "ROOT-CAUSED: Wallet drawer 'Destination Wallet' field missing for entity destinations is NOT a wallet-feature bug — the falcon-angular-dropdown wrapper's Stencil↔Angular ngModel bridge is broken (user click selects an option visually, Stencil host.value updates briefly, but never propagates to the Angular ngModel signal, so destId stays at its initial '__ch_voice'). Runtime-proven by force-setting destId via __wbmDrawer probe → showDestWallet flips true. Fix is in the shared lib (falcon-angular-dropdown), NOT in the wallet feature."
metadata: 
  node_type: memory
  type: project
  originSessionId: b1e85432-b3b0-4942-9a42-52c79c77e3eb
---

> 🛑 **SUPERSEDED / ROOT CAUSE WAS WRONG (2026-06-07).** The conclusion below — that the `falcon-angular-dropdown`
> Stencil↔Angular CVA bridge is broken — is **INCORRECT**. Later live re-investigation proved the dropdown works fine
> (`falcon-change` fires, `handleChange` runs, NgModel pipeline fires → the wrapper element gains `ng-dirty`, `pickDest`
> executes). The REAL cause is the orchestrator's `[source]="store.drawerSource()"` returning a **fresh object every
> change-detection cycle**, which re-fires the drawer's (re)initialise effect and **wipes the selection one tick after the
> user picks it**. Fix = memoize `drawerSource()`. See **[[project_wallet_drawer_source_thrash_rootcause_fix_2026_06_07]]**
> (FIXED + live-verified). Keep this file only as a record of the disproven hypothesis.

**User report (2026-06-07):** screenshot of the Balance Transfer drawer showing Source = Sales · Source Wallet = WhatsApp · Destination = Customer Success (an ENTITY) · **but no Destination Wallet field shown**. User insisted the rule isn't implemented, asked to verify.

**Initial analysis (wrong-direction):** I traced the wallet code (`showDestWallet = computed(() => isMulti() && dstOpt()?.type === 'entity')`, `lockChannel` returning sourceCh for entity sources, the @if block in admin/mgmt drawer templates) — all looked correct, all unit tests green (437/437). Argued from code that the rule was implemented. **User was right, code review was wrong.**

**Runtime investigation (Chrome MCP, live admin-console at localhost:4200, logged in sysadmin/Admin@1234, Mercedes account in NodeBased Multiple-wallet mode):** opened drawer from Sales row (sourceCh=voice initially), default destination auto-set to "Voice Wallet" (`__ch_voice` commch pool — correct), user picks "Customer Success" from dropdown → drawer visually updates to show Customer Success in destination, BUT no Destination Wallet field appears below.

**ROOT CAUSE (proven by direct probe):** added a temp console.log to `showDestWallet` + exposed component via `globalThis.__wbmDrawer`, rebuilt, re-tested. Log output AFTER clicking "— Customer Success" option:
```
[WBM-DBG showDestWallet] { isMulti: true, destId: "__ch_voice", dstType: "commch", dstLabel: "Voice Wallet", dstId: "__ch_voice", allOptsCount: 11, result: false }
```
**`destId` STAYED `__ch_voice` even after clicking Customer Success.** The Stencil host (`<falcon-dropdown-tw>`) `value` property momentarily reflected the entity's 24-char id (visible briefly), but the Angular signal NEVER updated. Force-setting `cmp.destId.set(entityId)` via `__wbmDrawer` → `dstType: "entity"`, `showDestWallet: true` ✓ — proves the wallet-feature logic is correct.

**THE BUG = `falcon-angular-dropdown` wrapper's Stencil→Angular event bridge.** `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.{ts,html}` exposes a CVA + listens via `(falcon-change)="handleChange($event)"` on the underlying `<falcon-dropdown-tw>` Stencil component. When the user clicks an `<option role="option">` in the dropdown menu, the Stencil component's internal `value` updates (briefly), but `falcon-change` is either not fired OR fires with a value that doesn't reach `handleChange` → `onChange` (CVA registered) → ngModelChange → `pickDest(value)` → `destId.set(...)`. Net effect: Angular's `[ngModel]="destId() || null"` then re-pushes the stale `__ch_voice` back to Stencil, reverting the visible selection. Other dropdowns (Source = Marketing, Source Wallet = Voice) appear to work because they were INITIALIZED programmatically by the constructor effect from `[source]` input, never relying on user click.

**Reproduction:** any `falcon-angular-dropdown` where the user picks an option that isn't the initial value will silently fail to update its bound ngModel signal. Wallet's Destination dropdown is just one victim. Likely affects every consumer of `falcon-angular-dropdown` across the platform.

**Files involved (don't fix wallet — fix the wrapper):**
- 🔴 SHARED LIB (the bug): `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-dropdown\falcon-dropdown.component.ts` lines 269-301 (`writeValue` / `handleChange` / `onChange`/`valueChange`) + `.html` lines 37-38, 68-69 (`(falcon-change)="handleChange($event)"`). Investigate (a) whether the underlying Stencil `<falcon-dropdown-tw>` fires `falcon-change` correctly on option-click (not just on programmatic value-set), (b) whether the event detail shape matches what `handleChange` reads (`event.detail.value`), (c) whether there's a feedback loop where `writeValue` pushes a stale value back faster than `handleChange` propagates the new one (a `microtask vs sync` race).
- 🟢 WALLET feature (CORRECT, no change needed): `apps/admin-console/.../components/wbm-balance-transfer-drawer/wbm-balance-transfer-drawer.component.{ts,html}` (`showDestWallet`, `computeLockCh`, the locked Destination Wallet @if block) + `apps/management-console/...` same file structure. Both consoles render the field correctly when destId is actually an entity id.

**Recommended fix path:**
1. Hand to `ammar-web-platform-ui` (shared lib owner) with this root-cause report. Likely fix: inspect the Stencil `<falcon-dropdown-tw>`'s emitted event name + payload (use a manual `addEventListener` on the host to capture all events fired on option-click); ensure the wrapper's `handleChange` reads the correct event detail path; consider adding a one-tick delay in `writeValue`'s Stencil push so it doesn't race with `handleChange`.
2. Affected feature audit: every other `falcon-angular-dropdown` consumer (not just wallet). The Source/Source-Wallet dropdowns LOOK fine because they're seeded programmatically, but ANY interactive change there would silently fail too — needs broader regression check across the platform.

**Status:** root-caused + runtime-proven; debug log REVERTED; admin-console rebuilt clean (build green, hash post-revert). NO WALLET FEATURE EDIT — the wallet drawer is correct. The bug is in the shared `falcon-angular-dropdown` wrapper and must be fixed there. Related [[project_wallet_admin_fe_parity_fixes_2026_06_07]] · [[reference_falcon_input_number_tw_hidden_on_rerender_rootcause_fix_2026_06_07]] (a similar shadow:false Stencil re-render bug on `falcon-input-number-tw`).
