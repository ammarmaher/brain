---
name: session-backup-admin-wallet-sot-re-skin-u1-u7-v1
description: "Re-skinned the admin-console wallet page + transfer drawer to match the SoT mockup 100% while preserving the verified business wiring (M1 payload, local path matrix, 3dp). Currency UI removed everywhere; drawer 440px; errors→top banner only."
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-05-29
  status: completed
  originSessionId: 13119d5e-5c1c-4256-915c-531afe9da32a
---

## What Was Done
Re-skin of the ADMIN-console Wallet & Balance page + Balance Transfer drawer to the source-of-truth
mockup (`Source_of_truth_theme/React/new react/admin/wallet.{jsx,css}` + `wallet-drawer.jsx`, computed
styles `qa/runs/wallet-sot-parity-2026-05-29/sot/`). Edits scoped ONLY to
`apps/admin-console/src/app/features/wallet-balance-management/`. NO commits.

- **U4 (page):** removed the SAR/Points Currency card from the page HTML + removed `currencyOptions`,
  `currencyRadioOptions` getter, `selectCurrency()` from the page TS. `selectedCurrency` kept internal
  (defaults SAR; saveChanges still sends it; initial-load still seeds it).
- **U1 (drawer):** removed the Currency SAR/Points toggle from drawer HTML + removed `selectCurrency()`,
  `currencyBtnClass`, `readonly Currency` exposure from drawer TS. `selectedCurrency` field kept
  internal (seeded from context, sent in request). `Currency` import retained (type + default).
- **U2 (drawer):** removed per-input error text (amount-exceeds-balance red text + description-required
  hint). Single TOP banner is the only error surface (rebound `errorMessage`→`bannerMessage`).
- **U3 (drawer):** width 380→440px, shadow -10/30→-16/40 rgba(.08), scrim black/20→black/25, head+foot
  padding → px-6 (24px). Field order Source→(SourceWallet)→Destination→(DestWallet, locked)→Amount(Riyal
  suffix + Available + 25/50/Max)→Description. Lock hint = existing `crossChannelLocked` key + lock icon.
- **U7:** confirmed (grep) no role chip / switch-perspective in the feature dir; added none.
- **V1:** added `validationMessage` + `bannerMessage` getters → violations (sameSrcDst, invalidAmount,
  amountExceedsBalance, descriptionRequired) surface in the TOP banner, silent on pristine form. The
  hard Save-disable gate `isFormValid` preserved verbatim.

## What Remains
- Browser/runtime verification (needs Docker + MF + Falcon login). Build-green + code-traced only.
- Optional: if the literal "Locked — " prefix is desired in the lock hint, add a `lockedPrefix` i18n key
  to libs/falcon en+ar.json (deferred — out of the feature-dir scope this brief mandated).

## Key Decisions
- Used Falcon UI Core `<falcon-angular-dropdown>` (searchable) for Source/Destination instead of the SoT
  bespoke `.wb-select` popover — per the GATE "use Falcon UI Core where it exists". Functionally identical.
- Kept "Available" hint at 2dp (`1.0-2`) — matches SoT hint precision; table/Master values stay 3dp.
- Did NOT touch shared libs i18n (lock hint reuses existing key) to honor "edit ONLY under
  wallet-balance-management".

## Files Changed (4, all under the feature dir)
- `wallet-balance-management.component.ts` — removed currencyOptions/currencyRadioOptions/selectCurrency.
- `wallet-balance-management.component.html` — removed Currency card.
- `components/balance-transfer/balance-transfer.component.ts` — removed currency toggle members; added
  validationMessage + bannerMessage; preserved isFormValid, isTransferPathValid, buildTransferEndpoint.
- `components/balance-transfer/balance-transfer.component.html` — 440px, scrim .25, currency removed,
  per-input errors removed, banner→bannerMessage, lock hint.
- SCSS untouched (carries only scrim/slide animations).

## PRESERVED (re-verified)
- M1 transfer payload: `buildTransferEndpoint` non-empty walletId fallback (entity.id / wallet.id||entity.id
  / channelWallet?.id||entity.id).
- Admin LOCAL `isTransferPathValid()` matrix (still gating isFormValid). Admin does NOT use per-pair PES.
- 3dp `formatAmount` ({min:3,max:3}).
- Wire contract (endpoints/gateway/ITransferRequest) unchanged.

## Build
`nx build admin-console --skip-nx-cache` → exit 0, Hash `19ac7fb96631b23a`, 25s, 0 TS/template errors.

## Context for Next Agent
- The mgmt-console wallet drawer is a SEPARATE file with its own W1-W4 history; this session touched ADMIN
  ONLY. If a parallel mgmt re-skin is requested, the same U1/U2/U3 pattern applies but mgmt uses per-pair
  directional PES (the W4 mechanism), NOT the admin local path matrix.
- Lint baseline on these files (enforce-module-boundaries @host-shell import, label/click a11y, drawer
  non-null-assertions) is pre-existing repo noise — build is the gate.
