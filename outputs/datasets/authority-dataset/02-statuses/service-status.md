---
type: status
entity: Falcon Service (per-tenant subscription)
enum-name: eFalconServiceStatus
namespace: commerce + provisioning
purpose: "Answers 'why service-status differs between Commerce and Provisioning + which int means what in each'. Open before mapping service status across the Commerce↔Provisioning boundary."
source-files:
  - Falcon/falcon-core-commerce-svc/src/Falcon.Commerce.Domain/Constants/Enums.cs:54-61
  - Falcon/falcon-core-provisioning-svc/src/Falcon.Provisioning.Domain/Constants/Enums.cs:3-10
---

# Service / Subscription Status

> [!tldr]
> Two related enums live in two services. Commerce tracks `eFalconServiceStatus` (5 values, includes `None=0`). Provisioning tracks `eProductSubscriptionStatus` (5 values, no None, but adds `Paid=2`). Mapping is similar but not identical — Provisioning's "Paid" stage doesn't exist in Commerce.

## Commerce — `eFalconServiceStatus`

| Int | Name | Meaning |
|---|---|---|
| 0 | `None` | Default / unset |
| 1 | `InActive` | Subscribed but not started |
| 2 | `Active` | Operational |
| 3 | `Expired` | Reached end-of-contract |
| 4 | `Disabled` | Manually disabled (by acc-owner or sys-products) |

## Provisioning — `eProductSubscriptionStatus`

| Int | Name | Meaning |
|---|---|---|
| 1 | `InActive` | Subscribed but not started |
| 2 | `Paid` | Payment made; awaiting activation |
| 3 | `Active` | Operational |
| 4 | `Expired` | End-of-contract reached |
| 5 | `Disabled` | Manually disabled |

## Mapping (Commerce → Provisioning)

| Commerce | Provisioning | Notes |
|---|---|---|
| `InActive(1)` | `InActive(1)` | Same |
| — | `Paid(2)` | **Provisioning-only intermediate** — payment captured, awaiting provision |
| `Active(2)` | `Active(3)` | Different ints! Watch this when crossing service boundaries |
| `Expired(3)` | `Expired(4)` | Different ints |
| `Disabled(4)` | `Disabled(5)` | Different ints |
| `None(0)` | — | Commerce-only sentinel |

**Trap**: the two enums share names but use different integer values for the same conceptual state. Always serialize through DTOs that name the enum (not int) when crossing the Commerce↔Provisioning boundary.

## Who can drive service status

- ✅ `sys-products` — full `sys.services.{payment, edit-price-type, edit-price-value, visibility}` allow
- ✅ `sys-admin` — same (full)
- ❌ `sys-ops` — no rule on `sys.services.*` (silent deny)
- ✅ `acc-owner` — `acc.services.{view, payment, disable}` allow
- ❌ `acc-admin` — `acc.services.{view, payment, disable}` **explicitly deny**
- ❌ `acc-user` — `acc.services.*` deny

## Service action enum (related)

`eFalconServiceAction` (Commerce + Provisioning, identical):
```
DoPayment = 1
Disable = 2
Enable = 3
EditPriceType = 4
EditPriceValue = 5
```

Maps to the `sys.services.*` PES actions: `payment`, `disable`, `enable`, `edit-price-type`, `edit-price-value`.

## See also

- [[sys-products]] — full service control on Falcon side
- [[acc-owner]] — full service control on Client side
- `04-feature-parity-matrix/comms-hub.compare.md` — uses `eFalconServiceStatus` heavily
