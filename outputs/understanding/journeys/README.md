*** Journeys — cross-page user flow playbooks ***
*** New top-level folder · 2026-05-15 ***

# Journeys — folder index

> Cross-page user journey playbooks. Each journey threads together **multiple pages**, **multiple flow playbooks**, **multiple backend services**, and the **Kafka event cascade**. Where a flow playbook (e.g. [[Add Client Flow]]) is the spec for one specific user action, a journey playbook is the spec for **a coherent business outcome** that crosses several actions.
>
> Load a journey playbook when:
> - You need the end-to-end picture (e.g. "what happens from tenant creation to first send?").
> - You're investigating a failure that spans multiple services / pages.
> - You're verifying that all Kafka subscriptions are wired across consumers.
> - You're explaining the platform to a newcomer.

## Available journeys (7)

| # | Journey | Folder | Crosses | Key event |
|---|---|---|---|---|
| 1 | New Tenant Onboarding | [new-tenant-onboarding](new-tenant-onboarding/README.md) | Org Hierarchy · Login · Force Change Password · OTP · Contracts · Send Transaction | `commerce.user-creation-requested.v1` + `commerce.contract-activated.v1` |
| 2 | Send Campaign | [send-campaign](send-campaign/README.md) | Contact Groups · Templates · Send Transaction | `commerce.service-order-created.v1` |
| 3 | Suspend Client | [suspend-client](suspend-client/README.md) | Org Hierarchy · Org Settings · Login · Notification | `commerce.account-status-changed.v1` |
| 4 | Renew Contract | [renew-contract](renew-contract/README.md) | Contracts list · Add Contract · Contract Detail | `commerce.contract-activated.v1` |
| 5 | First Login | [first-login](first-login/README.md) | Login · Force Change Password · OTP Challenge · default home | `identity.user-status-changed.v1` |
| 6 | Wallet Transfer | [wallet-transfer](wallet-transfer/README.md) | Wallet · Transfer Form · Wallet (refreshed) | `charging.transfer-completed.v1` |
| 7 | Edit Contract (status-aware) | [edit-contract-status-aware](edit-contract-status-aware/README.md) | Contracts list · Contract Detail · Edit Contract | `commerce.contract-updated.v1` |

## Per-folder shape

Every journey folder contains:

```
<journey-slug>/
  README.md              ← entry point + journey overview (this kind of doc)
  PLAYBOOK.md            ← full multi-page narrative (similar to flow PLAYBOOK)
```

## Relation to flow playbooks

Flow playbooks at `understanding/pages/<page>/<Flow>/` are the **spec for one user action**. Journeys reuse them; they don't replace them. When a journey wiki-links a flow that hasn't been built yet, it's marked `forward-ref (flow not yet seeded)`.

## Reading order when starting an end-to-end task

1. The journey README (folder index).
2. The journey PLAYBOOK (full narrative).
3. Drill into each `flow playbook` (wiki-linked) for action-level detail.
4. Drill into each `page note` (wiki-linked) for component / token / scorecard detail.
5. Drill into each `V-rule` (wiki-linked) for triangulated validation.
6. Drill into each `backend service note` for DTO / endpoint detail.

## Hubs

- [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[PAGES_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]]
