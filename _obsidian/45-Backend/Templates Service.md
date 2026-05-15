*** Backend Service — Templates ***
*** SoT: Brain Outputs/understanding/backend/templates/ ***
*** Repository: C:\Falcon\Falcon\falcon-core-templates-svc ***

# Templates Service

> Owns **communication-channel configuration templates** for tenants — body type per channel (plain / template / interactive), required checker levels, checker assignments. **Consumer-heavy:** materializes state from Commerce + Identity events and exposes a small read+update surface to the frontend.
>
> **Architectural surprise:** Template entity itself has no public API yet (GAP-TM-01) and the service is **not routed by gateways** (GAP-TM-02). The current service handles only `CommunicationChannelConfigs` — the actual Template CRUD lives somewhere else (TBD).

## Source-of-truth files

- [SERVICE_OVERVIEW](../../../Brain%20Outputs/understanding/backend/templates/SERVICE_OVERVIEW.md)
- [ENDPOINT_REGISTRY](../../../Brain%20Outputs/understanding/backend/templates/ENDPOINT_REGISTRY.md)
- [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/templates/DTO_DICTIONARY.md)
- [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/templates/VALIDATIONS.md)
- [ERRORS](../../../Brain%20Outputs/understanding/backend/templates/ERRORS.md)
- [FRONTEND_CONTRACT](../../../Brain%20Outputs/understanding/backend/templates/FRONTEND_CONTRACT.md)

## PRDs this service implements

- [[05 Templates]] — **primary** (but with major gaps — see GAP-TM-01/02 below)
- [[04 Contact Group Management]] — Link Contact Group columns → template variables
- [[01 Account Management]] — CommChannelConfig (shared with Commerce)

## Pages served

- Templates list (Maker view + Checker view) — _pending GAP-TM-01 resolution_
- Create Template wizard (WhatsApp: 2+ steps; Voice: TBD)
- Approval / Reject dialog (Checker)
- Preview pane

## Falcon components backed by this service

- [[Falcon Data Table]] (Templates list · Approval trail)
- [[Falcon Tabs]] (wizard steps) · [[Falcon Input]] · [[Falcon Dropdown]] · [[Falcon Checkbox]] · [[Falcon Button]]
- [[Falcon Status Badge]] (Pending / Approved / Rejected · Meta-state mapping for WhatsApp)
- [[Falcon Dialog]] (Approval · Reject · Preview)

## Validation contract

Per [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/templates/VALIDATIONS.md) — per-CommChannel field schema · variable-token format · checker-level integrity.

## Open architectural decisions

- **GAP-TM-01** — Template entity has no public API
- **GAP-TM-02** — Gateway route `/api/communication-channel-configs/*` missing — should be added before any UI ships
- Whether Template lives in `falcon-core-templates-svc` or moves to a new dedicated service — TBD

## Kafka activity

Consumer-heavy: receives events from [[Commerce Service]] (CommChannelConfig changes) and [[Identity Service]] (checker user assignments).

## Validation rules enforced here (2 — limited by GAP-TM-01/02)

PRD-05 Templates:
- [[V-template-checker-level-integrity]] — CheckerLevels must be sequential 1..N, ≥1 user each, no duplicates · 8 bundled error codes
- [[V-template-levels-count-required-for-restricted]] — `BodyType=Restricted` requires non-null `LevelsCount` matching `CheckerLevels.Count` · 4 error codes

**Honest gap:** ~23 of ~25 candidate PRD-05 validation rules (Template name format · variable rules · Body/Header/Footer caps · button count · etc.) have NO backend enforcement today because **GAP-TM-01** (Template entity has no public API) and **GAP-TM-02** (no gateway route). These can't be triangulated until the architectural decision lands.

Full index: [[VALIDATION_INDEX]] → "Triangulated validation rules" section.

## Hubs

- [[BACKEND_INDEX]] · [[API_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]]
