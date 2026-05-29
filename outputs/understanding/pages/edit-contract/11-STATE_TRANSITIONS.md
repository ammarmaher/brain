*** Edit Contract — State transitions ***
*** 2026-05-18 ***

# Edit Contract — State Transitions

## Edit-driven transitions

| From | To | How | Restrictions |
|---|---|---|---|
| `expired` | `active` | Extend: change endDate to future, save | Only Falcon System Admin (per [INFERRED] Q-CC-EXTEND-WHO) · Treated as fresh activation |

No other admin-driven transitions exist on this page. (Cron-driven `pending→active` and `active→expired` happen automatically — see [../contracts-list/11-STATE_TRANSITIONS.md](../contracts-list/11-STATE_TRANSITIONS.md)).

## Status determines field editability

[See [06-SECTION_FIELD_FREEZE](06-SECTION_FIELD_FREEZE.md)]

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [06-SECTION_FIELD_FREEZE](06-SECTION_FIELD_FREEZE.md) · [../contracts-list/11-STATE_TRANSITIONS.md](../contracts-list/11-STATE_TRANSITIONS.md)
