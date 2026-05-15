*** Journey Playbook — Renew Contract ***
*** Multi-page user flow · 2026-05-15 ***
*** Crosses: [[Contracts]] · [[Add Contract]] · [[Contract Detail]] · Master Wallet refill ***

# Renew Contract

> An Active contract is approaching expiry. The AO (or Falcon admin) opens the Contracts list, sees the upcoming expiry, and creates a successor Contract. Backend validates the rate-card + committed value + currency + dates. On Submit, Commerce persists the new Contract in `Draft` (or `Pending` if Maker/Checker applies). When the contract reaches its start-date or is explicitly activated, Commerce emits `commerce.contract-activated.v1`. Charging refills the Master Wallet's bucket for this contract; old contract balances persist until that contract expires. The nearest-expiring-contract pointer (used by [[Send Campaign]] charging cascade) re-resolves automatically.

## Actors involved

| Actor | Role |
|---|---|
| Account Owner | Most common initiator; reviews + approves renewal |
| Falcon Sales / Product | Can create contracts on behalf of tenants |
| Falcon System Administrator | Can create contracts in any tenant |
| Commerce Service | Persists Contract entity; emits activation event |
| Charging Service | Consumes activation event; funds the wallet bucket |
| Provisioning Service | If contract includes new services, activates them on activation |
| Access (PES) Service | Gates Contract create permission per [[Falcon Roles Permission Matrix]] |

## Pages traversed (in order)

1. [[Contracts]] — List of existing contracts. AO filters / sorts by expiry; identifies the contract approaching expiry. `forward-ref (page not yet seeded)`
2. [[Add Contract]] — Form / wizard for new Contract: rate-card · committed value · currency · start/end dates · CommChannel/App scope. `forward-ref (flow not yet seeded)`
3. [[Contract Detail]] — Post-create view. Shows the new Contract in `Draft` or `Pending` until activation. After activation, status flips to `Active`; wallet bucket appears. `forward-ref (page not yet seeded)`

## Flow playbooks used

- [[Add Contract Flow]] — `forward-ref (flow not yet seeded)`. PRD-03 driven. Same shape regardless of whether it's the first contract or a renewal.
- [[Contract Renewal Flow]] — `forward-ref (flow not yet seeded)`. Renewal-specific UX: pre-fills the form from the expiring contract's rate-card. Could be a thin wrapper over Add Contract.
- [[Activate Contract Flow]] — `forward-ref (flow not yet seeded)`. Server-side; usually auto on start-date. Manual activate may be an admin action.

## Backend services exercised (in order)

- [[Core Gateway Service]] (AO path) or [[System Gateway Service]] (admin path) — routes the Add Contract POST.
- [[Commerce Service]] — validates + persists Contract; later emits activation event when start-date hit (or on explicit Activate).
- [[Charging Service]] — consumes `commerce.contract-activated.v1` → funds wallet bucket on Master Wallet topology.
- [[Provisioning Service]] — consumes `commerce.service-order-created.v1` if the contract spawns new service orders.
- [[Access PES Service]] — gates create + activate actions.

## Kafka events fired

| Event | Producer → Consumer | Fires between... |
|---|---|---|
| `commerce.contract-created.v1` | Commerce → audit consumers | `forward-ref (event name TBC)`. Fires on POST commit. |
| `commerce.contract-activated.v1` | Commerce → Charging + Provisioning + audit | Fires when contract reaches activation condition (start-date ≤ now AND payment received per PRD-03). |
| `commerce.wallet-funded.v1` | Charging → audit consumers | `forward-ref (event name TBC)`. Emitted by Charging after wallet bucket creation. |
| `commerce.service-order-created.v1` | Commerce → Provisioning | If contract enables new services |

## V-rules touched

| V-rule | Where it fires |
|---|---|
| [[V-contract-committed-value-positive]] | Step 2 Add Contract — committed value must be > 0 |
| [[V-contract-rate-per-unit-non-negative]] | Step 2 Add Contract — every rate-card row ≥ 0 |
| [[V-contract-currency-enum]] | Step 2 Add Contract — currency from allowed enum |
| [[V-contract-expiration-after-start]] | Step 2 Add Contract — end-date > start-date |
| [[V-contract-edit-status-aware-fields]] | Indirect — after create, fields editable depend on status (e.g. Active contract has fewer editable fields than Draft) |
| [[V-charging-insufficient-balance]] | Indirect — not fired on renew itself but the renewal is intended to prevent this on subsequent sends |
| [[V-account-ip-allowlist-enforcement]] | Step 0 gateway enforce |

## End-to-end happy-path narrative

**Step 1.** AO opens [[Contracts]] (`forward-ref`). Dashboard / list highlights the contract with the closest expiry. AO clicks "Renew" (or simply "Add Contract").

**Step 2.** Wizard / form opens ([[Add Contract Flow]] — `forward-ref`). Fields: contract name · committed value · currency · start-date · end-date · rate-card rows (per CommChannel / App) · attached Apps and CommChannels scope.

**Step 3.** AO fills in:
- Committed value (e.g. SAR 100,000) — [[V-contract-committed-value-positive]] enforces > 0.
- Currency — [[V-contract-currency-enum]] enforces enum.
- Start-date / end-date — [[V-contract-expiration-after-start]] enforces end > start. Renewal usually starts where old one ends (or overlap by a buffer to avoid gaps).
- Rate-card rows — each rate ≥ 0 ([[V-contract-rate-per-unit-non-negative]]).

**Step 4.** AO clicks Submit. Frontend POSTs via gateway to Commerce. Commerce: validates all fields server-side; persists Contract in status `Draft` (or `Pending` if a checker step exists; `forward-ref (Maker/Checker on contracts? TBC)`); emits `commerce.contract-created.v1`.

**Step 5.** Time passes. On start-date (or immediately if start-date ≤ now and payment is recorded), Commerce activates the Contract: status → `Active`. Emits `commerce.contract-activated.v1`. Also emits `commerce.service-order-created.v1` if new services are being turned on.

**Step 6.** Charging consumes `contract-activated` → creates wallet bucket on Master Wallet aggregate, credits committed value. The Master Wallet's lump-sum (sum of buckets) increases. The nearest-expiring-contract pointer re-resolves for the next charging cascade.

**Step 7.** Provisioning consumes `service-order-created` (if applicable) → activates Apps / CommChannels that were `Show + paid` per the new contract.

**Step 8.** Old contract continues to exist as `Active` (until its end-date). Sends during the overlap period charge against the **nearest-expiring** contract — that's the old one until it expires, then the new one. Balances on old contract persist until its expiry; on expiry, status flips to `Expired` and the remaining balance is forfeited or refunded per PRD-03 policy (`forward-ref (remaining-balance-on-expiry policy not yet documented)`).

**Journey ends.** Final state:
- **New Contract:** `Active` with bucket funded
- **Old Contract:** still `Active` (until end-date) → then `Expired`
- **Master Wallet lump-sum:** = sum of all Active contract buckets (now includes the new one)
- **Send Campaign cascade:** continues uninterrupted; pointer auto-resolves

## Failure modes + recovery paths

- **Step 4 fails (validation 400/422):** Inline form errors via [[V-contract-*]] rules. AO fixes inputs.
- **Step 4 fails (PES denies):** Forbidden 403 toast; only AO / admin can create contracts.
- **Step 5 fails (Commerce activation logic blocked — e.g. payment not recorded):** Contract stays `Draft` / `Pending`. Recovery: admin marks payment received or PRD-03 payment flow runs.
- **Step 6 fails (Charging consumer down):** Activation persisted in Commerce but wallet not funded. Sends would fail with `InsufficientBalance` even though business expects coverage. Recovery: Kafka replay; Charging idempotent on `commerce.contract-activated.v1` for same contract id.
- **Step 7 fails (Provisioning consumer down):** New services not activated. Existing services unchanged. Recovery: replay.
- **Contract expires before renewal completes:** Old contract goes `Expired`; new contract still `Draft`. Tenant has a gap with zero Active contracts. [[Send Campaign]] fails with `NoActiveContract` until renewal activates. Recovery: hurry the activation; or accept the gap.
- **Renewal start-date is before old contract end-date (overlap):** Both contracts may be `Active` simultaneously. Cascade picks nearest-expiring (the old one) until it expires. Working as intended.

## Cross-journey dependencies

- **Depends on:** Tenant `Active`; old contract `Active`; AO permission to create contracts (Falcon Roles Permission Matrix).
- **Triggers downstream:** [[Send Campaign]] continues using funded buckets after activation.
- **Sibling:** [[Edit Contract Status Aware]] — once active, editable fields are restricted ([[V-contract-edit-status-aware-fields]]).

## Implementation checklist

- [ ] All page playbooks in the journey are loaded — Contracts list + Add Contract wizard + Contract Detail
- [ ] Kafka subscriptions are wired — Charging + Provisioning on `commerce.contract-activated.v1` + `commerce.service-order-created.v1`
- [ ] Error states from each step propagate correctly — validation errors inline; PES Deny toast; activation failure surface
- [ ] State transitions per actor are tested end-to-end — Contract: Draft → Active → Expired; Wallet: funded on activation; nearest-expiring pointer re-resolves
- [ ] Overlap behavior between old + new contracts is tested (both Active, cascade picks correctly)
- [ ] Expiry of old contract while new is still Draft → cascade reports NoActiveContract
- [ ] Charging idempotency tested for activation event replay

## Hubs

- [[Organization Hierarchy]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
