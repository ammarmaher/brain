*** Wallets — State transitions ***
*** Strategy + balance lifecycle · 2026-05-18 ***

# Wallets — State Transitions

## Strategy lifecycle

```
            ┌─────────────┐
            │ None        │ ← Account created without wallet strategy
            └────┬────────┘
                 │ POST commerce/setting/wallets
                 ▼
            ┌─────────────┐
            │ Configured  │ ← Strategy set; wallets materialized
            └────┬────────┘
                 │ POST commerce/setting/wallets (different params)
                 ▼ 
        ┌─────────────────┐
        │ Reconfigured    │ ← Restructured; existing balances may need migration
        └─────────────────┘
```

[INFERRED] Reconfiguring after balances exist is sensitive — may require data migration. PRD silent on this — flag Q-WBM-RECONFIG.

## Transfer effects on balances

Each transfer:
1. Source balance decreases.
2. Destination balance increases.
3. Master aggregate stays the same (Master = sum of children, internal transfer doesn't change total) UNLESS one of the wallets is external (e.g. contract balance feeding in).

## State machine for Add Contract precondition

The wallet strategy state is the precondition for [[Add Contract Flow]]:
- `None` → Add Contract button disabled.
- `Configured` → Add Contract enabled.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) · [../contracts-list/11-STATE_TRANSITIONS.md](../contracts-list/11-STATE_TRANSITIONS.md)
