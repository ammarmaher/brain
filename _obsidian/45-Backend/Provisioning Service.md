*** Backend Service — Provisioning ***
*** SoT: Brain Outputs/understanding/backend/provisioning/ ***
*** Repository: C:\Falcon\Falcon\falcon-core-provisioning-svc ***

# Provisioning Service

> Owns **per-account service subscriptions** — the mapping between an account and the catalog of communication channels + applications it can use. Tracks subscription status (`eProductSubscriptionStatus`), per-account service **visibility** (independent of subscription status), available actions per subscription (`eFalconServiceAction`), and account-level service provisioning (creates the initial service set for a new account).
>
> **Smallest** Clean Architecture service: 2 controllers · 6 endpoints · no Kafka activity in default config.

## Source-of-truth files

- [SERVICE_OVERVIEW](../../../Brain%20Outputs/understanding/backend/provisioning/SERVICE_OVERVIEW.md)
- [ENDPOINT_REGISTRY](../../../Brain%20Outputs/understanding/backend/provisioning/ENDPOINT_REGISTRY.md) — 6 endpoints
- [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/provisioning/DTO_DICTIONARY.md)
- [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/provisioning/VALIDATIONS.md)
- [ERRORS](../../../Brain%20Outputs/understanding/backend/provisioning/ERRORS.md)
- [FRONTEND_CONTRACT](../../../Brain%20Outputs/understanding/backend/provisioning/FRONTEND_CONTRACT.md)

## PRDs this service implements

- [[01 Account Management]] — CommChannel / App service subscriptions per account (visibility · status · actions)
- [[03 Contract Packaging Charging Billing]] — Activate Sub-Service workflow

## Pages served

- [[Organization Hierarchy]] — CommChannels & Services tab (subscription rows, status, actions) + Apps & Services tab

## Falcon components backed by this service

- [[Falcon Data Table]] — subscription rows
- [[Falcon Status Badge]] — subscription status pills
- [[Falcon Toggle]] — visibility on/off cells
- [[Falcon Button]] — per-row action buttons (`eFalconServiceAction`)

## Validation contract

Per [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/provisioning/VALIDATIONS.md) — required AccountId · service identifier enums · action enums.

## Gateway exposure

- Client traffic → [[Core Gateway Service]]
- Admin traffic → [[System Gateway Service]]

## Validation rules enforced here (shared)

PRD-01 / PRD-03 — state-transition gates rather than field-shape attributes:

- [[V-service-visibility-pricing-required]] — Provisioning's `CannotHideActiveService` / `CannotEnableNonDisabledService` state-transition gates participate when a Falcon user toggles visibility / status. Commerce owns the price-required side; Provisioning owns the state-transition side.

Full validation index: [[VALIDATION_INDEX]] → "Triangulated validation rules" section.

## Hubs

- [[BACKEND_INDEX]] · [[API_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]]
