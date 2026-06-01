---
name: Apps & Services / Comm Channels tabs — edit/delete/payment wired to backend
description: org-hierarchy App+Service tabs mutation wiring (visibility/price-type/price-value/enable/disable/delete-pending) to Commerce backend, PES gating, effective-date validation, and 3-reason payment-failure popups. polishing-v0.4, admin-console only.
type: project
originSessionId: 4c778b98-5a13-4c17-a9c6-018655b5ca56
---
🟢 BUILD-GREEN 2026-05-18. admin-console + host-shell both GREEN. NOT runtime-tested.

## REFACTOR UPDATE (later 2026-05-18) — shared table removed
The shared `applications-table` component + `_shared/` + `falcon-table-edit-row/` + `mock-applications.ts` were DELETED by user request. Each tab (`apps-services-tab`, `comm-channels-tab`) is now fully self-contained — its own component renders its own `<falcon-angular-data-table>`, own `signals/`/`validations/`/`models/`/`services/`. New `tab-components/shared/` holds ONLY union stateless code (table column/action builders, `ServiceRow` adapter, `CommerceGatewayService`+`CommerceActionsService`, pure `validateEffectiveDate`). No shared component, no shared signals.
Also added: success toast on every mutation; loader (data-table `[loading]`); env-configurable order-status polling (`environment.orderStatus.{pollIntervalMs:2000, pollTimeoutMs:120000}`); poll-timeout unlock handling; status-change popups matching `origin/main`.
The "What landed" section below describes the PRE-refactor state — file paths under `applications-table/` and `_shared/` no longer exist; logic moved into the per-tab components + `shared/`.

## What landed (branch polishing-v0.4, admin-console only)

App tab + Service tab in `org-hierarchy-page/components/tab-components/` — mutations were local-signal-only; now wired to the real Commerce backend.

- `applications-table.component.ts` — injects `CommerceActionsService` + `AccessControlFacade`; new `kind` input (`comm-channel`|`application`) + `mutationCommitted` output; every handler (visibility/enable/disable/shadow price-type|value save/shadow delete/do-payment) calls the real API; all optimistic `apps()` mutation deleted; mount-time `resolveFlags()` PES gating; `validateEffectiveDate` + `priceValue>=0` before price calls; `submitting` state; table-reset on `rows` input change.
- Flow: mutation → on `isSuccessful` emit `mutationCommitted` → tab calls `state.reload()` → GET re-fetch. **Mutation response bodies are never read** (they are non-uniform) — GET is the single source of truth.
- PES: row action visible = PES flag AND `row.availableActions` includes the `eFalconServiceAction` code. `resolveFlags()` fails CLOSED here.
- `do-payment-priority-popup.component.ts` (host-shell) — `handleTerminal` branches on `FailureReason`: `CommChannelPriorityOrderRequired`→existing drag-drop dialog (unchanged); `InsufficientFunds`+`WalletNotConfigForTheNode`+other→`FalconConfirmService` popup; poll window 1→2 min.

## Verified backend contract
List GET `AccountApplicationResponse`/`AccountCommunicationChannelResponse` — enums are INTEGERS. `Details[]` is untyped `List<object>`, discriminate by string `Type` (`priceType`/`priceValue`). `CanHide=Visibility&&Status==InActive` server-computed. Order poll `GET order/{id}/status` → `{status,failureReason,walletType}` — **no message field**. `eOrderFailureReason`: Commerce has 3 (incl. WalletNotConfigForTheNode=3), Charging produces only 2. Payment settles in <1s.

## Open flags
1. `falcon-table-edit-row/` folder orphaned (consumer deleted) — left in place, cleanup candidate.
2. Pre-existing lint warning: `@nx/enforce-module-boundaries` on `@host-shell/shared/do-payment-priority-popup` import — pre-existing, not a regression.
3. Phase 6 (shadow view-mode parity) was already satisfied — view+edit both column-aligned, highlight library-driven via `bgVariant`. Only inline error display added.
4. Order-status response has NO backend message — payment-failure popup text is i18n-keyed off the failure-reason enum FE-side (unavoidable without backend change).
5. "Top up balance" CTA has no navigation target in scope — button currently just closes. Needs a routing decision.

## Trigger
`apps services tabs mutation done` / `commchannels edit delete payment`
