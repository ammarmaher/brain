*** Add Contract — State transitions ***
*** Wizard mode + new contract status · 2026-05-18 ***

# Add Contract — State Transitions

## Wizard step state machine

```
[Open] → Step 0 (Contract Info)
       │ Next (valid step)
       ▼
       Step 1 (Rate Card)
       │ Next
       ▼
       Step 2 (Contract Details)
       │ Next
       ▼
       Step 3 (Add-ons)
       │ Finish
       ▼
[POST] → Success → emit (saved) → close
       │
       Cancel (any step) → confirm → close
       │
       Previous (any step but 0) → back
```

Stepper config: `allowNavigation: false`, `disableBackButtonOnFirstStep: true` ([CODE] lines 78-94).

## Newly-created contract status

| Status | When set | Driven by |
|---|---|---|
| `pending` | On successful POST | Default state at creation (BR-CC-01) |

Then cron-driven:

| Transition | Trigger |
|---|---|
| `pending → active` | today >= startDate |
| `active → expired` | today > endDate |

## Cannot create

- Account without configured wallet strategy → BE rejects with `Error.Contracts.WalletStrategyNotConfigured`.
- Duplicate `farabiReferenceId` for same account → `Error.Contracts.FarabiReferenceIdDuplicate`.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) · [../contracts-list/11-STATE_TRANSITIONS.md](../contracts-list/11-STATE_TRANSITIONS.md)
