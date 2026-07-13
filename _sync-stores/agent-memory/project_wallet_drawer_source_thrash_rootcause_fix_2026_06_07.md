---
name: project-wallet-drawer-source-thrash-rootcause-fix-2026-06-07
description: "SUPERSEDES the falcon-dropdown-bridge theory. The wallet Balance-Transfer drawer bugs (destination selection 'doesn't reflect/stick', locked Destination Wallet never auto-shows, can send-to-self, source resets) are caused by the orchestrator binding [source]=\"store.drawerSource()\" where drawerSource() builds a BRAND-NEW WbDrawerSource object every change-detection cycle -> the drawer 'source' input identity churns every tick -> the constructor (re)initialise effect re-fires and wipes destId/formTouched/sourceId one tick after the user picks. Fix = MEMOIZE drawerSource() on the drawerFor reference (stable identity). Plus Bug-D: gate the row Transfer button on isRowZero (admin+mgmt). All 4 LIVE-VERIFIED; admin build+837 tests green; mgmt build green."
metadata:
  node_type: memory
  type: project
  originSessionId: b1e85432-b3b0-4942-9a42-52c79c77e3eb
---

**⚠️ CORRECTS [[project_wallet_dest_wallet_missing_falcon_dropdown_bridge_bug_2026_06_07]]** — that file blamed the
`falcon-angular-dropdown` Stencil↔Angular CVA bridge. That was WRONG (disproven live). The dropdown works fine.

## User report (2026-06-07)
On the admin-console Wallet Balance-Transfer drawer (Multiple-wallet modes): (A) changing the **Destination** dropdown to
another entity "does not reflect"; (B) the **locked Destination Wallet** field (source channel, disabled) never auto-shows;
(C) "I can send to myself"; (D) zero-balance rows' Transfer buttons are disabled in some accounts but NOT others (BMW
NodeBased-Single, all 0.0000, stayed clickable) — inconsistent.

## ROOT CAUSE (A/B/C) — open-effect thrash from a fresh-object-per-CD input
- Orchestrator: `@if (store.drawerFor()) { <app-wbm-balance-transfer-drawer [source]="store.drawerSource()" ...> }`.
  `drawerSource()` is a **method** → re-run every change-detection cycle. For a per-row click it MAPPED the `WbRow` into a
  **new `WbDrawerSource` object literal each call** (`[CODE] admin services/wallet.service.ts drawerSource()`,
  `[CODE] mgmt wallet-balance-management.component.ts drawerSource()`).
- Drawer constructor effect (`[CODE] components/wbm-balance-transfer-drawer/...component.ts:240-250`) reads `this.source()`
  and on any change does `sourceId.set(resolveInitialSourceId(s))`, `destId.set('')`, `formTouched.set(false)`, etc.
- Sequence on a user pick: Stencil emits `falcon-change` ✔ → wrapper `handleChange` → NgModel pipeline runs (the wrapper
  element gains `ng-dirty`) → `pickDest()` runs (destId=entity, formTouched=true) ✔ → those writes schedule CD → orchestrator
  re-evaluates `[source]="store.drawerSource()"` → **NEW object** → drawer `source()` input "changes" → open-effect re-runs →
  **wipes destId='' + formTouched=false**. Net: selection never sticks, `showDestWallet` stays false, Cancel stays disabled.
- **Why the dropdown-bridge theory was wrong:** live `ng-dirty` on the dest wrapper PROVES NgModel view→model fired; and the
  SOURCE dropdown reset to the clicked row (Available stayed 2,535 not 50) PROVES the open-effect re-ran and overwrote it.
  Proven via Chrome MCP + DOM probes (window minimized → DOM-state evidence, stricter than pixels). Also: `[attr.value]`
  (Angular) and Stencil `.value` BOTH updated to the picked entity → `handleChange` DID run; only the drawer signals got wiped.

## FIX
- **A/B/C (keystone):** MEMOIZE `drawerSource()` on the `drawerFor` reference so it returns a STABLE object while the drawer
  is open → `source` input identity stops churning → open-effect runs ONCE → selections persist. Pattern:
  `private _drawerSrcMemo:{key,val}|null; if (memo && memo.key === d) return memo.val; ...; this._drawerSrcMemo={key:d,val};`
  Kept the `drawerSource(): WbDrawerSource {` signature (a source-regex spec pins it). Applied admin (`services/wallet.service.ts`)
  + mgmt (`wallet-balance-management.component.ts`).
- **B is delivered BY the A fix:** once destId actually = an entity, `showDestWallet = isMulti() && dstOpt()?.type==='entity'`
  turns true and the locked Destination Wallet (disabled, source channel, "cross-channel locked" hint) renders.
- **C is delivered BY the A fix:** dest options already `filter(o => o.id !== sourceId)` and `canSave` re-asserts src≠dst;
  the only reason self-transfer seemed reachable was destId never updating.
- **D (independent):** `isRowZero(row)` — Single: `getAlloc(row,'single')<=0`; Multiple: `activeChannels().every(ch=>getAlloc(row,ch)<=0)`
  — OR-ed into the row Transfer button `[disabled]`. Admin `components/wbm-allocation-table/*`, mgmt `components/wbm-client-view/*`.
  Visible-columns based (hidden funded channel re-enabled via "Show All" → no funds unreachable).

## LIVE VERIFICATION (admin, DOM-driven)
- Mercedes (NodeBased Multiple): Source=Sales → pick Destination=Marketing → **Destination Wallet APPEARS** "Voice · Locked",
  dropdownCount 3→4, **Cancel enabled**; dest options EXCLUDE Sales; change Source=Operations → **Available 2,535→50** (sticks).
- BMW (NodeBased Single, all 0.0000): both rows Transfer `disabled:true opacity:.5` (were `false/1`).
- Mercedes non-regression: funded rows (Sales/Marketing/Operations) ENABLED; zero rows (root/Customer Success/Finance/IT&Security) DISABLED.

## GATES
- admin `nx build` (dev) GREEN ×2; mgmt `nx build` (dev) GREEN. admin `nx test` **837/837** (fixed 3 brittle source-regex
  assertions: drawerSource shape + the `[disabled]` gate string; added 2 tests: the memo bugfix + the isRowZero gate).
- ⚠️ mgmt `nx test` BLOCKED by a PRE-EXISTING vite infra error `Failed to resolve import "@falcon/ui-core/angular"` that breaks
  19 UNRELATED suites (contracts/contact-groups/shared-ui) — NOT caused by these changes (admin vitest resolves it fine).
  mgmt validated via build typecheck + admin parity. **Follow-up: fix the mgmt vitest @falcon/ui-core/angular resolution.**

## ARTIFACTS
- Plan/report: `C:\Falcon\plans\wallet-comprehensive-testing\{TEST-PLAN.md, STATUS.md, REPORT.html}`.
- Dev-loop: admin-console is a static remote; FE change → `npx nx build admin-console --configuration=development --skip-nx-cache`
  → reload :4200. ⚠️ The wallet page boot freezes CDP for ~20-40s on a MINIMIZED window; recover by routing to `#/` (lighter)
  first, then back to the wallet hash. DOM `.click()` on `falcon-tree-node .client-row` selects an account.
- NO commits. LESSON: a `store.x()` METHOD bound as a component `input()` returning a fresh object each call silently re-fires
  every effect that tracks that input — memoize (or use a `computed`) for any non-primitive template-bound method feeding an input.

Related [[project_wallet_admin_fe_parity_fixes_2026_06_07]] · [[reference_wallet_balance_knowledge_map_2026_06_07]] ·
[[project_wallet_ownership_admin_no_wallet_rootcause_2026_06_07]].
