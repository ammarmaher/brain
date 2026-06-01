*** Contracts List — State transitions ***
*** Container mode + Contract entity FSM · 2026-05-18 ***

# Contracts List — State Transitions

> Two FSMs touch this page: (1) the **container mode** (list ↔ add ↔ view ↔ edit) driven by user actions, and (2) the **Contract entity status** (pending → active → expired) driven by backend cron + Kafka.

## Container mode FSM

[CODE] `contracts-cost-management.component.ts:50` `mode: 'list' | 'add' | 'view' | 'edit'`:

```
                ┌───────────────┐
                │  noNodeSel    │ ← initial · no node picked
                └──────┬────────┘
                       │ (user picks node)
                       ▼
                ┌───────────────┐
                │     list      │ ← rows visible
                └─┬─────┬───────┘
        Click Add│     │Click row
                 ▼     ▼
            ┌────────┐ ┌────────┐
            │  add   │ │  view  │
            └───┬────┘ └─┬──────┘
   Cancel/Save │        │ Click Edit
                ▼        ▼
            ┌────────┐ ┌────────┐
            │ list   │ │  edit  │
            └────────┘ └─┬──────┘
                          │
              Cancel/Save │
                          ▼
                      ┌────────┐
                      │  view  │
                      └────────┘
```

| From | To | Action | Effect |
|---|---|---|---|
| `noNodeSel` | `list` | Pick node | `forkJoin({walletStrategy, contracts})` |
| `list` | `add` | Click "+ Add Contract" | Guarded: `isWalletStrategyConfigured()` |
| `list` | `view` | Click row | `mode='view'` + `getContract(row.id)` |
| `add` | `view` | Save | Emit `(saved)` → load detail |
| `add` | `list` | Cancel | `mode='list'` |
| `view` | `edit` | Click "Edit" | Guarded: `currentContract.canEdit` |
| `view` | `list` | Back | `mode='list'` |
| `edit` | `view` | Save | `mode='view'` + refresh |
| `edit` | `list` | Cancel | `mode='list'` |

## Contract entity status FSM (backend-driven)

[PRD] `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md` (BR-CC-50..56):

```
                ┌─────────┐
                │ pending │ ← created · waiting for startDate
                └────┬────┘
        (today >=    │
         startDate)  │ — cron job
                     ▼
                ┌─────────┐
                │ active  │
                └────┬────┘
        (today >     │
         endDate)    │ — cron job OR contract balance depleted
                     ▼
                ┌─────────┐
                │ expired │ ← frozen · read-only
                └─────────┘
```

| From | To | Trigger | Notes |
|---|---|---|---|
| (nonexistent) | `pending` | `POST commerce/Contracts` | New contract starts pending |
| `pending` | `active` | Cron: today >= startDate | Auto · emits `commerce.contract-status-changed.v1` |
| `active` | `expired` | Cron: today > endDate | Auto · emits same event |
| (any) | (any) | (no admin override in PRD) | All transitions are cron-driven |

## Field freeze per status

[CODE] `view-contract.component.ts` `hasRestrictedCommercialFields`:

| Status | All fields | Commercial fields (rates, quotas, overage) |
|---|---|---|
| `pending` | editable | editable |
| `active` | partially editable (name + farabi ref OK; dates restricted) | **frozen** (read-only) |
| `expired` | nearly all frozen | **frozen** |

[PRD] BR-CC-50..56:
- Pending = full edit
- Active = limited (name/farabi only)
- Expired = read-only with optional extend

## Mode-status compatibility matrix

| Mode | pending | active | expired |
|---|---|---|---|
| `view` | ✓ | ✓ | ✓ |
| `edit` | ✓ (full) | ✓ (limited) | ✓ (extend only?) |
| `add` | N/A (creates pending) | N/A | N/A |

[INFERRED] "Extend" mode for expired contracts re-uses the same edit endpoint and flips status back to active. Per WAVE-4-PAGE-MAP "extension: re-uses same endpoint + status flips Expired→Active".

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) · `../edit-contract/`
