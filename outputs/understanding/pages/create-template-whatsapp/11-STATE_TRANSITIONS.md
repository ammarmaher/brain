*** Create Template (WhatsApp) — State transitions ***
*** 2026-05-18 ***

# Create Template (WhatsApp) — State Transitions

## Wizard internal FSM

```
[Open] → Step 1 → (Next valid) → Step 2 → (Finish) → POST /api/templates → close
```

## Template lifecycle FSM (post-create)

Detailed in [../templates-list/11-STATE_TRANSITIONS.md](../templates-list/11-STATE_TRANSITIONS.md).

Short version for WhatsApp:

```
Created (Draft)
   │ submit
   ▼
PendingChecker
   │ Checker approves
   ▼
PendingMeta
   │ Meta auto-approves (≤24h)
   ▼
Approved (Quality-pending → High/Medium/Low)
   │
   ▼ (Meta may transition)
Paused / Disabled  (Approved but unusable)
```

[PRD] BR-TM-26 + BR-TM-27 + BR-TM-28.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [../templates-list/11-STATE_TRANSITIONS.md](../templates-list/11-STATE_TRANSITIONS.md)
