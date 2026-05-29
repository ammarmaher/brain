*** Templates List — State transitions ***
*** Maker/Checker FSM + Meta integration · 2026-05-18 ***

# Templates List — State Transitions

## Template FSM (per PRD-05)

```
                ┌──────┐
                │Draft │ ← Maker creates · still editing
                └──┬───┘
                   │ submit
                   ▼
            ┌─────────────────┐
            │ PendingChecker  │ ← Awaiting internal Checker
            └──┬──────────┬───┘
       Approve│          │ Reject
              ▼          ▼
   (WhatsApp)│      ┌─────────────────┐
   ┌─────────────┐  │ Rejected (intl) │
   │ PendingMeta │  └─────────────────┘
   └──┬──────────┘
   Meta webhook
   ┌──┴───┬──────────┐
   ▼      ▼          ▼
 Approved Rejected Paused / Disabled
   (Meta)  (Meta)
```

## Per-channel FSM

- **WhatsApp**: Draft → PendingChecker → (Reject) → Rejected (internal) OR (Approve) → PendingMeta → (Meta) Approved / Rejected / Paused / Disabled.
- **Voice / AI / SMS**: Draft → PendingChecker → Approved (internal-only). No external approval.

[INFERRED] verify per PRD-05 deep-mining.

## Edit-ability per status

| Status | Maker can edit |
|---|---|
| Draft | YES |
| PendingChecker | NO (already submitted) |
| Rejected (internal) | YES (back to Draft on edit?) |
| PendingMeta | NO |
| Approved | NO |
| Paused | NO |
| Disabled | NO |

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [02-SECTION_LIST_TABLE](02-SECTION_LIST_TABLE.md)
