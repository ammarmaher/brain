---
type: feature-spec
task: wallet-admin-reskin-and-restore
class: ui-polish + restore
ambiguity-score: 2
verdict: proceed-with-defaults
spec-author: night-shift-feature
created: 2026-05-28
purpose: "Restore admin-console wallet-balance-management from origin/main and re-skin it with the T2 Falcon Admin mockup visual design, using Falcon UI Core only and zero backend changes."
---

# SPEC · admin-console Wallet & Balance .Mng (Falcon view)

## TL;DR

Restore the admin-console `wallet-balance-management` feature (currently missing on `polishing-v0.4`, present on `origin/main`) and re-skin it using the T2 Falcon Admin mockup's "Show as Falcon" view. Replace all PrimeNG dependencies with Falcon UI Core equivalents. No backend changes — endpoints, DTOs, gateways, and PES keys remain byte-identical to origin/main.

## Goal

Deliver a pixel-aligned, Falcon-Library-only admin-side wallet page where:
- `sys-admin` + `sys-products` see Master Wallet + tree picker + strategy edit + cross-account transfer
- `sys-ops` lands on the page but every action is hidden/disabled per PES silent-deny
- All 4 PES flags resolve at mount-time via `AccessControlFacade.resolveFlags(...)` matching origin/main shape

## In scope

- Restore admin-console wallet folder: 10 files from `origin/main:apps/admin-console/src/app/features/wallet-balance-management/`
- Re-skin component HTML + SCSS using T2 mockup's "Show as Falcon" view layout
- Replace PrimeNG `ToastModule` + `MessageService` with Falcon `falcon-toast` + `FalconNotificationService`
- Replace PrimeNG `TreeNode` import path → Falcon's own tree types (already used by `OrganizationHierarchyTreeComponent` from `@falcon`)
- Wire FE to existing service methods unchanged (`getWalletData`, `saveChanges`, `transfer`)
- Re-skin Balance Transfer drawer using `falcon-drawer` + Falcon form controls
- Wire route at `apps/admin-console/src/app/app.routes.ts` (was removed in polishing-v0.4)
- Add sidebar nav entry to admin host-shell if missing
- en+ar i18n keys for all new visible strings

## Out of scope

- ANY backend change (Charging, Commerce, Gateway, PES seed)
- Mgmt-console wallet (separate SPEC: `wallet-mgmt-2026-05-28.md`)
- The "Falcon/Client switcher" itself — it's a UX affordance for Falcon users only; mgmt users never see admin-console
- The mockup's `Viewing as` role simulator (D-3 — mockup-only design aid)
- Adding new PES keys
- Tests for the existing service layer (unchanged from origin/main)
- Falcon-only sub-features beyond wallet (out-of-band)

## Falsifiable requirements

1. **R-A1** — Route `/wallet-balance-management` lands in admin-console for `sys-admin` user (`POST :7777/api/auth/login` with `sysadmin/Admin@1234` → JWT → load route → page renders header "Wallet & Balance .Mng").
2. **R-A2** — Master Wallet card visible when `FalconAccess.adminConsole.masterWallet.view()` resolves true (i.e., `sys-admin`/`sys-products` allow; `sys-ops` deny → card NOT in DOM).
3. **R-A3** — Tree picker (`<falcon-organization-hierarchy-tree>` or wrapper) renders Falcon root + 4 clients + child nodes. Clicking a leaf node fires `getWalletData({ selectedNodeId, currency, balanceDistribution, walletStructure })`.
4. **R-A4** — Balance Type and Wallet Type segmented controls (Falcon-UI-Core) bound to `selectedDistribution$` and `selectedStructure$` BehaviorSubjects. Changing either re-issues `getWalletData()` with the new query.
5. **R-A5** — Currency selector defaults to `Currency.SAR (=1)` and changes update `selectedCurrency$`. Confirmed mapping per `[CODE] origin/main wallet-balance.models.ts:15-18`.
6. **R-A6** — Data table renders 9 rows from mockup AND from real hierarchy response shape (`IBalanceNode[]` per `[CODE] origin/main wallet-balance.models.ts`). Columns: Organizations, Wallet (decimal-pipe), Transfer (icon button).
7. **R-A7** — Per-row Transfer button opens Balance Transfer drawer with `preSelectedSource` populated. Drawer fields match wallet-drawer.jsx structure (Source, Source Wallet [multi], Destination, Destination Wallet [multi, locked when source != Master], Amount + Riyal suffix + quick-pick, Description textarea).
8. **R-A8** — Master Wallet transfer icon opens drawer with `fromMasterWallet=true` + `preSelectedSource=masterWallet`. Per `[CODE] origin/main wallet-balance-management.component.ts:479-482` (requires `isFalconUser && canTransferWallet`).
9. **R-A9** — Drawer Save button: enabled iff `sourceId && destId && sourceId !== destId && amount > 0 && amount <= sourceBalance`. Click → `transfer()` service call → on success: toast + close drawer + reload hierarchy; on error: inline error message + drawer stays open.
10. **R-A10** — Wallet strategy edit (Settings card) visible when `canViewWalletStrategy || canEditWalletStrategy`. Inputs disabled when `!canEditWalletStrategy`. Save button visible when `canSave && canEditWalletStrategy`.
11. **R-A11** — Zero PrimeNG imports in the admin-console wallet folder after the re-skin (verified by `grep -r "primeng/" apps/admin-console/.../wallet-balance-management/` returning 0).
12. **R-A12** — `nx build admin-console` and `nx build host-shell` both exit 0.
13. **R-A13** — PES Gate 3 matrix passes (3 roles × 4 actions per per-role table) — see PES checks block below.
14. **R-A14** — Tailwind tokens used everywhere — no raw hex colors, no inline `[12px]` style arbitrary values; only tokens declared in `libs/falcon-ui-tokens/src/`. Verified by `gate:hardcoded-value-lint` exit 0.

## Authority context

- Route guard: declared but data-less (`shellAccessGuard` no-op) per origin/main `[CODE] features/routes.ts:53-61`
- Parent route guard: `adminConsoleGuard` (app-level — checks `FalconAccess.adminConsole.enter()`)
- Per-feature gates (4 flags via `primeAccess()`):
  - `canViewMasterWallet` ← `FalconAccess.adminConsole.masterWallet.view()`
  - `canViewWalletStrategy` ← `FalconAccess.adminConsole.walletStrategy.view()`
  - `canEditWalletStrategy` ← `FalconAccess.adminConsole.walletStrategy.edit()`
  - `canTransferWallet` ← `FalconAccess.adminConsole.wallet.transfer()`

## PES checks (Gate 3)

```pes-checks
sysadmin   sys.master-wallet     view      allow
sysadmin   sys.wallet-strategy   view      allow
sysadmin   sys.wallet-strategy   edit      allow
sysadmin   sys.wallet            transfer  allow
sysops     sys.master-wallet     view      deny
sysops     sys.wallet-strategy   view      deny
sysops     sys.wallet-strategy   edit      deny
sysops     sys.wallet            transfer  deny
sysproducts sys.master-wallet    view      allow
sysproducts sys.wallet-strategy  view      allow
sysproducts sys.wallet-strategy  edit      allow
sysproducts sys.wallet           transfer  allow
```

Run via `POST :7777/api/auth/login` per user → JWT → `POST :5296/pes/authorize` with subject `u:<JWT.sub>@<tenant>`. Same pattern as `[BRAIN-OUT] _runtime-verification/comms-hub-2026-05-16.md`.

## Visual target

- Primary: `web-scrub/2026-05-28-0443_t2-wallet-falcon-view/screenshot-full.png`
- Drawer reference: `web-scrub/_source-jsx/wallet-drawer.jsx`
- CSS reference: `web-scrub/_source-jsx/wallet.css`
- Comparison gate: Falcon Eyes pixel diff vs target before declaring Wave 7 done (≥90% parity)

## Decision log (forks resolved)

- **D-1** (F-021) · Master Wallet on Client view → recorded; **affects mgmt-side SPEC only** (this SPEC is admin only — Master Wallet stays per parity matrix)
- **D-3** · Drop `Viewing as` role simulator (mockup design aid) — RESOLVED via DECISION-PROTOCOL "default to more explicit option"
- **D-4** · `Switch perspective` button visible only to `isFalconUser` — RESOLVED via conservative default + role table
- **D-5** · `Edit` button toggles strategy-edit mode, Save commits — RESOLVED via existing `saveChanges()` pattern preservation
- **F-016** · PrimeNG imports in origin/main → REPLACE with Falcon equivalents per UI policy
- **F-022** · `falcon-data-table` vs `falcon-tree-table` → `falcon-data-table` (flat) per existing mgmt impl pattern
- **F-019** · Empty state (no client selected) → `falcon-empty-state`
- **F-020** · Loading state → `falcon-data-table [loading]` skeleton

## Conservative defaults applied

- Currency default = `Currency.SAR (=1)`
- Wallet structure default = `WalletType.SingleWallet (=1)`
- Balance distribution default = `WalletBalanceType.NodeBased (=1)`
- Pagination default = 10 rows/page (matches existing impl + Falcon convention)
- All visible strings use translation keys (en + ar); fallback to en when ar key missing + log gap

## Open assumptions (max 3)

1. **[INFERRED]** `polishing-v0.4` dropped admin wallet intentionally as part of v0.4 polish wave — restoration is desired. **Mitigation**: confirm with Ammar before Wave 1 file-restore.
2. **[INFERRED]** The mockup's exact spacing, colors, and typography map cleanly to existing Falcon tokens. If a token doesn't exist, follow Falcon Eyes customization order (input → template → slot → token override → shared upgrade → new component) — never inline.
3. **[INFERRED]** `OrganizationHierarchyTreeComponent` from `@falcon` is the production-blessed tree picker (per origin/main usage). If a newer wrapper exists in `libs/falcon-ui-core` (e.g., `falcon-organization-hierarchy-tree-tw`), prefer the newer one.

## Verification target

- **Build green**: `nx build admin-console` exit 0; `nx build host-shell` exit 0; `nx build falcon-ui-core` exit 0
- **Scanner clean**: `falcon-wiki/scripts/scan-authority.ps1 -CheckOnly` exit 0
- **Lint**: `gate:lint` + `gate:typecheck` + `gate:hardcoded-value-lint` + `gate:token-naming-lint` all exit 0
- **Backend PES verify**: PES-checks block above — 12-row matrix (3 roles × 4 actions) all match dataset prediction
- **Visual parity**: `falcon-eyes` diff vs `screenshot-full.png` of mockup ≥ 90%
- **FE runtime**: BLOCKED on workspace compile errors (F-007 per VERIFICATION-STATUS.md). Defer to manual confirmation per existing Wave-7 deferral.
