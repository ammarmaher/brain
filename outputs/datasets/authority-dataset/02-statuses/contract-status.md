---
type: status
entity: Contract
enum-name: eContractStatus
namespace: commerce
purpose: "Answers 'what 3 lifecycle states does a Contract have + which int is which'. Open when implementing contracts-cost-management UI filters or contract domain logic."
source-file: Falcon/falcon-core-commerce-svc/src/Falcon.Commerce.Domain/Constants/Enums.cs:147-152
---

# Contract Status

> [!tldr]
> Contract lifecycle. 3 values: Pending → Active → Expired. Drives the `contracts-cost-management` page. Only `acc-owner` (on Client side) and any `sys-*` with `acc.contract.view` (Falcon side via System Gateway) can see contracts.

## Values

| Int | Name | Meaning |
|---|---|---|
| 1 | `Pending` | Drafted, not yet signed/active |
| 2 | `Active` | Live contract |
| 3 | `Expired` | Past end-date |

## Source

```csharp
public enum eContractStatus
{
    Pending = 1,
    Active = 2,
    Expired = 3
}
```

## Who can view contracts

- ✅ `acc-owner` — `acc.contract.view` = allow
- ❌ `acc-admin` — `acc.contract.view` = **deny**
- ❌ `acc-user` — `acc.contract.view` = deny
- (No `sys.contract` resource defined — Falcon side sees contracts via different paths, likely the master view on admin-console)

## Related enums

- `eOrderStatus` (Pending=1 / Paid=2 / Failed=3) — drives the payment side
- `eOrderType` (FirstActivation=1 / Renewal=2)
- `eJobStatus` (Scheduled=1 / Executed=2 / Failed=3 / Canceled=4) — drives auto-renewal jobs

## See also

- `04-feature-parity-matrix/contracts-cost-management.compare.md`
- [[acc-owner]] — the only acc-* role that can view contracts
