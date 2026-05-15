*** Backend Service — Charging (OCS) ***
*** SoT: Brain Outputs/understanding/backend/charging/ ***
*** Repository: C:\Falcon\Falcon\falcon-core-charging-svc ***

# Charging Service

> Platform's **Online Charging System (OCS)** + wallet management. Owns: wallets (master / per-comm-channel / per-owner sub-wallets), reservation lifecycle (reserve → commit | release) for usage-based billing (e.g. WhatsApp), direct debit for system-priced purchases, balance transfers, contract balance summaries (read-model for management UI), real-time charging core (Redis stream `ocs:realtime-events` for hot channels WHATSAPP / SMS / VOICE), and the **Charging Lab / Testing Charging** simulator (gated by `Settings:TestingCharging:Enabled`).

## Source-of-truth files

- [SERVICE_OVERVIEW](../../../Brain%20Outputs/understanding/backend/charging/SERVICE_OVERVIEW.md)
- [ENDPOINT_REGISTRY](../../../Brain%20Outputs/understanding/backend/charging/ENDPOINT_REGISTRY.md) — 4 controllers
- [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/charging/DTO_DICTIONARY.md)
- [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/charging/VALIDATIONS.md)
- [ERRORS](../../../Brain%20Outputs/understanding/backend/charging/ERRORS.md)
- [FRONTEND_CONTRACT](../../../Brain%20Outputs/understanding/backend/charging/FRONTEND_CONTRACT.md)

## PRDs this service implements

- [[01 Account Management]] — **primary** for wallet & balance management (Wallet · WalletRecord · WalletTypeConfig · TransferTx)
- [[03 Contract Packaging Charging Billing]] — charging cascade · Send Transaction · Active-contract nearest-expiring-first selection · Contract balance summaries · Activate Sub-Service

## Pages served

- Wallets & Balance Mgmt page (Wallet config + Transfer UI)
- [[Organization Hierarchy]] — CommChannels & Services tab pricing rows trigger charging when contract activates
- Charging Lab / Testing Charging admin tool

## Falcon components backed by this service

- [[Falcon Data Table]] — wallet ledger rows · transfer history · contract balance summary
- [[Falcon Status Badge]] — wallet status pills · reservation status
- [[Falcon Dialog]] — transfer confirmations
- [[Falcon Input]] · [[Falcon Dropdown]] · [[Falcon Button]]

## Real-time core

- Redis-backed event stream `ocs:realtime-events` for hot channels (WHATSAPP / SMS / VOICE)
- Reservation lifecycle: `reserve → commit` (final debit) or `reserve → release` (no charge)
- Direct debit path for non-reservable system-priced purchases

## Kafka topics

- **Consumes:** `WalletConfigured` · `ContractLifecycle` · `ServiceOrderCreated` from [[Commerce Service]]
- **Produces:** charging confirmation events for downstream

## Validation contract

Per [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/charging/VALIDATIONS.md) — see file for exact attributes per request DTO (transfer amounts, wallet IDs, currency enums).

## Gateway exposure

- Client traffic → [[Core Gateway Service]]
- Admin traffic → [[System Gateway Service]] (Testing Charging BFF is here — 10 admin-only endpoints)

## Hubs

- [[BACKEND_INDEX]] · [[API_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[VALIDATION_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
