---
name: reference_wallet_balance_prd_permissions_per_user_type_2026_05_30
description: "Wallet & Balance Management — canonical per-user-type permission matrix (admin + mgmt), PRD see/do, BR-AM transfer rules, and the as-built FE-gating verdict (already fail-closed + correct). Use when asked who can see/do what in the wallet feature."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 9d91c645-025e-4b5c-9063-2592bca5e781
---

Deep-dive (3 research agents, 2026-05-30) into the WALLET & BALANCE MANAGEMENT feature: PRD + per-user-type permissions + as-built FE gating. **Verdict: the FE permission gating is ALREADY correct + FAIL-CLOSED in both consoles** (verified 3 layers); per-user-type behavior is PES-enforced (backend, runtime-verified 21/21). SoT for grants = `falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs` + tenant seed `Falcon\Falcon\falcon-essentials\zitadel\pes-account-role-rules.json` + FE registry `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` (mgmt wallet :124-141, admin :176-185).

**Canonical user types:** Falcon = sys-admin (System Admin), sys-ops (System Operation), sys-products (Products). Client = acc-owner (Account Owner), acc-admin (Node Admin), acc-user (Normal User). [CODE] BuiltInRoleCatalog.cs.

**ADMIN console (System Gateway; sys.* PES). Columns = View Master Wallet / View Strategy / Edit Strategy / Transfer:**
- sys-admin: ALLOW / ALLOW / ALLOW / ALLOW (catalog :180/:178/:179/:181)
- sys-products: ALLOW / ALLOW / ALLOW / ALLOW (catalog :281/:279/:280/:282)
- sys-ops: DENY / DENY / DENY / DENY (no sys.wallet-strategy/master-wallet/wallet rule; lands on empty page) — NOTE sys-ops DOES hold a newer `sys.wallet-balance` view/configure/transfer (catalog :232-234) but the admin FE still gates on the legacy keys it lacks, so dormant.
- acc-* : DENY (Client; explicit-deny `app.admin-console/view` — can't enter admin).
Keys: master=`sys.master-wallet/view`, strategy=`sys.wallet-strategy/view|edit`, transfer=`sys.wallet/transfer`. Master-wallet transfer button ALSO requires FE `isFalconUser()`.

**MGMT console (Core Gateway; acc.wallet-balance PES). Columns = View Wallet / Transfer (coarse) / Directional scope:**
- acc-owner: ALLOW / ALLOW / all owner directions (master↔owner, channel↔owner, owner↔owner) but NOT master↔channel (catalog :351-359, seed :33-41) — RUNTIME-VERIFIED.
- acc-admin: ALLOW / ALLOW / **owner→owner ONLY, node-subtree-scoped** via NodeScopedOwnerTransferExpression (catalog :415-423, seed :114-122).
- acc-user: DENY / DENY / — (holds balance, can't transfer) (catalog :482-490, seed :198-206).
- sys-* : DENY (can't enter mgmt).

**Per-pair directional matrix (BR-AM-30..34):** Master↔Comm = Falcon-only (BR-AM-30); Comm↔User/Node = Falcon+AO (BR-AM-31); User/Node↔User/Node = Falcon+AO+NodeAdmin (BR-AM-32, NodeAdmin node-scoped); Single-mode Master↔User/Node = Falcon+AO (BR-AM-33); transfer-limit % caps non-Master sources, Master exempt, 0=no limit (BR-AM-34). [BRAIN-OUT] prd/modules/01-account-management/BUSINESS_RULES.md (BR-AM-25..42).

**What users SEE (PRD):** Master Wallet card (abstract aggregate = sum of children, BR-AM-28), Balance Type {Node/User} × Wallet Type {Single/Multiple} 2×2 matrix (BR-AM-25/26), allocation tree (org→service→user), per-channel breakdown (Multiple mode), Wallet/Transfer columns. Admin: + tree picker (any account). Mgmt: NO tree (own account only via session.tenantId), NO master-wallet editor, view+transfer only. [BRAIN-OUT] understanding/pages/wallets-and-balance-management/ (18-file dossier) + falcon-wiki old-ui-management-console-diffs.md:70-74.

**What users DO (PRD):** Configure Balance/Wallet Type + Save = **Falcon-only** (sys-admin/sys-products config; sys-ops view-only per PRD Actors OVERVIEW.md:18); transfer per BR-AM-30..34; switch type, expand tree, select node/channel, paginate. Validation (V-*): amount>0, amount≤source balance, amount≤cap%, source≠dest, currency match, description required, path allowed. Backend (charging) is the authority: `POST charging/wallet/transfer`, handler-side validation, idempotency (Redis 24h), optimistic concurrency (Version, 409 WalletVersionConflict).

**As-built FE gating (audit):** FAIL-CLOSED at 3 layers (facade buildFlagMap false on throw; store can() allow-only; admin primeAccess try/catch sets all 4 false). Admin: 4 flags in primeAccess() gate master card / settings / edit+save / transfer column+buttons. Mgmt: route shellAccessGuard on wallet.view(); pesCanTransfer on wallet.transfer(); canSave server-driven (gates nothing in mgmt). NO fail-open (unlike settings-tab/add-user).

**GAPS (polish/dormant — NOT security holes):**
1. mgmt wallet sidebar nav was not PES-gated (acc-user saw a dead link) — **FIXED 2026-05-30**: added `access: FalconAccess.managementConsole.wallet.view()` to the mgmt wallet nav item in host-shell layout.component.ts:254 (matches services/marketplace/contracts mgmt-nav convention; admin nav stays userType-only per admin convention).
2. admin wallet route has NO feature-level guard (only adminConsoleGuard); sys-ops lands on empty page vs redirect — FLAGGED (add shellAccessGuard + data.access=walletStrategy.view(); needs runtime smoke-test).
3. mgmt per-pair directional PES is DORMANT: `PER_PAIR_PES_ENABLED=false` (mgmt balance-transfer.component.ts:138) — directional rules rely on backend POST only; flip needs live PES verification that g-link subjects carry `path`.
4. PRD gaps: Q-AM-01 (reconfig after balances exist), Q-AM-07 (transfer-limit baseline), Q-AM-10 (full per-cell transfer flows un-extracted from Drive).

**Brain dataset STALENESS flag:** authority-dataset (2026-05-16) predates the acc.wallet-balance / sys.wallet-balance PES work; it states mgmt has NO wallet PES keys — FALSE on polishing-v0.4. Live code (catalog + seed + registry) wins. Builds on [[project_wallet_multi_mode_per_pair_pes_already_disabled_2026_05_29]].
