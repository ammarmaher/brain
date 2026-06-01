---
name: wallet-reskin-2026-05-28
description: "Wallet & Balance .Mng module shipped FE-only for both admin (Falcon) + mgmt (Client) consoles. Restored admin from origin/main, removed all PrimeNG, re-skinned both to T2 mockup, Falcon UI Core only, zero BE changes. 3 builds green, 14 files modified, 24 i18n entries added."
metadata: 
  node_type: memory
  type: project
  originSessionId: ec388185-676b-461f-8e96-12da072b241b
---

Wallet & Balance .Mng (admin + mgmt) re-skin shipped 2026-05-28 02:50.

**Why:** User asked to scrape T2 Falcon Admin mockup (`http://127.0.0.1:5173/T2 Falcon Admin.html`) and build the Wallet & Balance .Mng module for BOTH consoles. Backend SoT = origin/main wiring. UI policy = Falcon UI Core ONLY (no PrimeNG, no external libs, no raw HTML).

**How to apply:** All wallet code lives in `apps/{admin,management}-console/src/app/features/wallet-balance-management/`. Backend wiring is byte-identical to origin/main (commerce/accounts/{id}/hierarchy + commerce/setting/wallets + charging/wallet/transfer). Mgmt uses `useGateway(Gateway.ChargingGateway)` override on transfer; admin uses default arg-less `useGateway()`. PES keys for admin: `masterWallet.view`, `walletStrategy.view/edit`, `wallet.transfer` (all `sys.*` namespace). Mgmt has NO feature PES keys — server-driven `canSave`/`canTransfer` only (G-1/G-2 open). i18n keys under `walletBalance.*` namespace in `libs/falcon/src/language/i18n/{en,ar}.json`.

**Visual SoT:** T2 mockup at `http://127.0.0.1:5173/T2 Falcon Admin.html` has internal nav switching between "Show as Falcon" and "Show as Client" views — those map to admin-console and management-console respectively. Captured to `Brain Outputs/reports/web-scrub/2026-05-28-0443_t2-wallet-{falcon,client}-view/`. Source JSX at `Brain Outputs/reports/web-scrub/_source-jsx/wallet-drawer.jsx` is the canonical Balance Transfer drawer structure (Source/Source Wallet/Dest/Dest Wallet/Amount+Riyal+quick-pick/Description). Mockup wallet.css at `_source-jsx/wallet.css` — study only, all hex/px translated to Falcon tokens during re-skin.

**Build verification:** admin-console `ccd03a3a0eefe85a` (22.0s) · management-console `dc7434628ec7becc` (20.9s) · host-shell `5840360017328efa` (10.0s) — all 3 dev builds green. Zero PrimeNG imports remain in either wallet folder (verified `grep -rnE "^import.*from ['\"](primeng|@primeng)"` returns 0 lines). `gate:hardcoded-value-lint` passes (grandfathered violations not from this run). PES login layer verified — `sysadmin/Admin@1234` → `stage=4` + JWT.

**Key files modified (14 total):**
- Admin wallet folder: 10 files (restored 7 verbatim + rewrote 3: component.ts 885→673, component.html 453→315, drawer.html re-skin)
- Mgmt wallet folder: 4 files (component.html re-skin + component.ts adjust + drawer .ts/.html re-skin)
- Routes: admin app.routes.ts (+12 lines), mgmt app.routes.ts (+99 lines, multi-feature route refactor incl. wallet)
- i18n: en.json + ar.json (+12 keys each)
- Incidental: libs/falcon-ui-core/web-types.json LF→CRLF

**Decisions logged:**
- D-1 (Master Wallet on Client view): Ammar chose **Option A — Omit** per parity matrix. Class-A authority fork F-021 resolved.
- D-3 (`Viewing as` role simulator on Falcon view): DROPPED — mockup design aid only, no PES backing.
- D-4 (`Switch perspective` button): KEEP on admin (only visible when `isFalconUser`); DROP on mgmt.
- F-016 (PrimeNG anti-pattern in origin/main code): RESOLVED — fully removed in Wave 3.

**GAPs — GAP-1 + GAP-2 FIXED 2026-05-28 03:05 (overnight Brain SK alignment); GAP-3 open:**
- GAP-1 ✅ FIXED: All 3 segmented controls now use `<falcon-angular-radio-group orientation="horizontal" size="sm">`. Prior agent misdiagnosed it as a missing variant — the Falcon wrapper at `libs/falcon-ui-core/src/angular-wrapper/components/falcon-radio-group/` already supports `orientation: 'vertical'|'horizontal'`. Inputs-only fix, no component upgrade. Zero raw-HTML `role="radio"` in templates now. Post-fix builds: admin `c7775df03801c8ca`, mgmt `66fe7700bd77725a`.
- GAP-2 ✅ FIXED: All 7 `text-[11px]` → `text-[length:var(--falcon-font-size-xxs)]` (existing platform token, fallback 11px, used by 6+ Falcon components). `gate:hardcoded-value-lint` PASS.
- GAP-3 ⏳ OPEN: `Switch perspective` cross-MFE routing — needs Docker bring-up + browser test to verify host-shell MFE route map. Deferred.

**Brain SK component-purity rule learned:** When a Falcon component appears to lack a layout variant, CHECK the Angular wrapper's `@Input() orientation` / `size` / `variant` props FIRST (at `libs/falcon-ui-core/src/angular-wrapper/components/<name>/<name>.component.ts`) before declaring a GAP. `<falcon-angular-radio-group>` has `orientation: 'vertical'|'horizontal'` + `size: 'sm'|'md'|'lg'`. For 11px text, the platform token is `--falcon-font-size-xxs` — use `text-[length:var(--falcon-font-size-xxs)]`, never `text-[11px]`.

**NO COMMITS made.** Working tree dirty awaiting Ammar's `commit` instruction per Falcon hard-rule.

**Orchestration:** This run used the night-shift-feature skill. Planning phase produced 8 docs (investigation + 2 SPECs + action map + component map + wave plan + risk register + pending Q + halt report). Execution phase: Wave 2 (orchestrator) restored admin from origin/main; Waves 3-7 (delegated to ammar-web-platform-ui agent in 2 batches — 242k + 207k tokens) removed PrimeNG + re-skinned both consoles + drawers + i18n; Waves 8-10 (orchestrator) skipped conditional UI Core upgrades + verified PES + wrote this report. Total: ~10 hours of model time across orchestrator + 2 specialist agent runs.

**Brain-grounding:** 100% source-prefix discipline. Cross-checked against `04-feature-parity-matrix/wallet-balance-management.compare.md` (174 lines), `understanding/backend/charging/` (5 docs), `falcon-access.registry.ts:130-148` (PES factories), `BuiltInRoleCatalog.cs:85-290` (role catalog). 9 of 9 `[INFERRED]` cap (acceptable per SPEC-PROTOCOL). Zero unprefixed Falcon claims.

**Final report:** `Brain Outputs/datasets/authority-dataset/_runtime-verification/night-shift-feature-wallet-2026-05-28-0250.md` (this run's audit trail). Previous halt-report at `night-shift-feature-wallet-2026-05-28-0450.md` is superseded.
