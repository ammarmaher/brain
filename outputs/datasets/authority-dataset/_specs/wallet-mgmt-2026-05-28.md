---
type: feature-spec
task: wallet-mgmt-reskin
class: ui-polish
ambiguity-score: 3
verdict: proceed-with-defaults
spec-author: night-shift-feature
created: 2026-05-28
purpose: "Re-skin the existing management-console wallet-balance-management feature with the T2 Falcon Admin mockup's Client view, using Falcon UI Core only and zero backend changes."
---

# SPEC · management-console Wallet & Balance .Mng (Client view)

## TL;DR

The mgmt-side wallet feature already exists on `polishing-v0.4` (Wave 11 port, 2026-05-18) and is Falcon-UI-Core-compliant. This spec re-skins it with the T2 Falcon Admin mockup's "Show as Client" view design — keeping the dropped-feature surface (no Master Wallet, no tree picker, no strategy edit) per `wallet-balance-management.compare.md`. **Master Wallet card mockup deviation halt-and-flag pending Ammar's decision** (see `_pending-questions/wallet-2026-05-28-master-on-client.md`).

## Goal

A pixel-aligned, Falcon-Library-only client-side wallet page where:
- `acc-owner` sees per-account wallet view + Transfer drawer scoped to own account
- `acc-admin` + `acc-user` cannot land (denied by `managementConsoleGuard` for `acc-user`; landing-but-no-content for `acc-admin` per parity matrix)
- Server-driven `canSave` and `canTransfer` flags gate per-button visibility (no PES key exists for mgmt wallet)
- All backend wiring identical to existing mgmt-side service (incl. explicit `useGateway(Gateway.ChargingGateway)` on transfer)

## In scope

- Replace existing mgmt `wallet-balance-management.component.html` (and SCSS if any) with the T2 "Show as Client" mockup design
- Use Falcon UI Core components per Falcon Eyes customization order
- Keep existing `wallet-balance.service.ts`, models, validators — zero service-layer edits
- Keep `BalanceTransferComponent` API surface; re-skin its template + form controls using `falcon-drawer` + Falcon form controls
- Wire `Type: SAR/Points` selector (already in `currencyOptions`)
- Drop the mockup's `Switch perspective` button (Falcon-only affordance — client users never see it)
- en+ar i18n keys for new visible strings

## Out of scope

- Adding Master Wallet card (HALT-AND-FLAG D-1 pending)
- Adding tree picker (Falcon-only per parity)
- Adding strategy-edit form (Falcon-only per parity)
- Adding new PES keys (`managementConsole.wallet.*` — G-1/G-2, requires PES seed change)
- ANY backend change (Charging, Commerce, Gateway, server-driven flags)

## Falsifiable requirements

1. **R-M1** — Route `/wallet-balance-management` lands in mgmt-console for `acc-owner` user (`POST :7777/api/auth/login` with `accowner/Admin@1234` → JWT → load route → page renders header "Wallet & Balance .Mng").
2. **R-M2** — `acc-user` cannot reach the route (`managementConsoleGuard` denies — confirmed by parity matrix).
3. **R-M3** — Page mounts with `selectedNodeId = session.tenantId || session.client_id` (NEVER tree). Confirmed by `[CODE] mgmt wallet-balance.service.ts:48-51`.
4. **R-M4** — Wallet Type segmented control bound; switching re-issues `getWalletData()` with new `walletStructure` query param.
5. **R-M5** — Currency selector (`SAR` / `Points`) bound; switching re-issues `getWalletData()` with new `currency` query param. Defaults to `Currency.SAR (=1)`.
6. **R-M6** — Data table renders rows from `IWalletDataResponse.nodeTree` per backend. Columns: Organizations, Wallet (decimal-pipe), Transfer (icon button).
7. **R-M7** — Per-row Transfer button enabled iff `canTransfer === true` (server flag). Click opens `BalanceTransferComponent` drawer with `preSelectedSource=row`.
8. **R-M8** — Drawer Save button: enabled iff `sourceId && destId && sourceId !== destId && amount > 0 && amount <= sourceBalance`. Click → `transfer(request)` via `useGateway(Gateway.ChargingGateway)` → on success: toast + close + reload; on error: inline + drawer stays open.
9. **R-M9** — Save Strategy button NOT visible (server-driven `canSave` is the gate; mgmt clients won't usually see it). If `canSave===true` is ever returned, the button mounts but per Falcon-mostly contract this path is dormant.
10. **R-M10** — Zero PrimeNG imports in mgmt-console wallet folder after re-skin (already 0 — verify preserved).
11. **R-M11** — `nx build management-console` and `nx build host-shell` both exit 0.
12. **R-M12** — PES Gate 3 matrix passes (1 role × 1 action: `accowner → transfer → server-allow`) — see PES checks block.
13. **R-M13** — Tailwind tokens only — no raw hex, no arbitrary `[px]` values.

## Authority context

- Route guard: `managementConsoleGuard` (parent, app-level)
- Per-feature gates: **none** (no PES key — server-driven `canSave`/`canTransfer` only)

## PES checks (Gate 3)

```pes-checks
accowner   app.management-console   view      allow
accowner   <server-flag>            canTransfer    server-allow
accuser    app.management-console   view      deny
accadmin   app.management-console   view      allow
accadmin   <server-flag>            canTransfer    server-deny
```

Note: `<server-flag>` rows are server-driven (response body flags), not PES — included here for completeness of the gate matrix; PES gate is just the route guard.

## Visual target

- Primary: `web-scrub/2026-05-28-0443_t2-wallet-client-view/screenshot-full.png`
- Drawer reference: same `wallet-drawer.jsx` (shared between Falcon and Client views in mockup)
- Falcon Eyes diff gate ≥ 90% parity

## Decision log (forks resolved)

- **D-1** (F-021) · Master Wallet on Client view → **HALT-AND-FLAG**. File: `_pending-questions/wallet-2026-05-28-master-on-client.md`. Plan default: **omit** (follow parity matrix). Ammar can override.
- **D-2** · `Type: SAR/Points` selector → keep (already in `currencyOptions`)
- **D-4** · `Switch perspective` button → DROP on mgmt (Falcon-only affordance)
- **F-016** · No PrimeNG on mgmt side currently — preserve
- **F-019** · Empty state during loading → `falcon-empty-state` (no data yet) + skeleton (loading)

## Conservative defaults applied

- Same as admin SPEC: SAR / NodeBased / SingleWallet / 10 rows / i18n with en fallback

## Open assumptions (max 3)

1. **[INFERRED]** The mockup's "Show as Client" matches `acc-owner` exactly (other acc-* roles either land but show nothing OR are denied at the route). Confirmed against parity matrix table §6.
2. **[INFERRED]** `BalanceTransferComponent` (existing in mgmt) doesn't need API changes — only template-level re-skin. Verify in Wave 4 by reading the component's current TS.
3. **[INFERRED]** Ammar will decide D-1 before Wave 4 (FE components). If undecided by then, Wave 4 ships **without** Master Wallet card and a follow-up wave can add it post-decision.

## Verification target

- **Build green**: `nx build management-console` + `nx build host-shell` + `nx build falcon-ui-core` all exit 0
- **Scanner clean**: `scan-authority.ps1 -CheckOnly` exit 0
- **Lint**: all gate scripts exit 0
- **Backend PES verify**: PES-checks block above
- **Visual parity**: `falcon-eyes` diff vs `screenshot-full.png` ≥ 90%
- **FE runtime**: BLOCKED on workspace compile errors (deferred per F-007)
