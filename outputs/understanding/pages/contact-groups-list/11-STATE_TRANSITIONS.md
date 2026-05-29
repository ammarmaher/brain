*** Contact Groups List — State transitions ***
*** 2026-05-18 ***

# Contact Groups List — State Transitions

## Contact Group lifecycle FSM

```
            ┌─────────┐
            │ Active  │ ← Default state after Create wizard commits
            └────┬────┘
                 │
       Creator   │ disable
       toggles   │
                 ▼
            ┌─────────┐
            │Inactive │
            └────┬────┘
                 │ re-enable
                 ▼
            ┌─────────┐
            │ Active  │
            └─────────┘
                 │ DELETE
                 ▼
            ┌────────────┐
            │SoftDeleted │ ← Hidden from clients; visible to Falcon
            └────────────┘
                 │ (Falcon may force-purge?)
                 ▼
            (Hard delete — not yet observed; flag Q-CGL-PURGE)
```

## Per-status visibility

| Status | Visible to creator | Visible to shared users | Visible to Falcon |
|---|---|---|---|
| Active | YES | YES | YES |
| Inactive | YES | NO | YES |
| SoftDeleted | NO | NO | YES (with badge) |

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
