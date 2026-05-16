---
type: status
entity: Account (during Add-Client wizard)
enum-name: eAccountCreationStatus
namespace: commerce
purpose: "Answers 'what are the 7 Add-Client wizard stages + which int maps to which step'. Open when implementing Add-Client wizard step transitions or debugging stuck draft accounts."
source-file: Falcon/falcon-core-commerce-svc/src/Falcon.Commerce.Domain/Constants/Enums.cs:43-52
---

# Account Creation Status

> [!tldr]
> Lifecycle of the **Add Client wizard**. 7 stages: Pending → InfoCompleted → SettingsCompleted → ServicesConfigured → AppsConfigured → OwnerCreated → Completed. Each stage maps to one of the 5 wizard steps + a final commit. Falcon-only — only sys-admin / sys-products can create accounts.

## Values

| Int | Name | Wizard step | Notes |
|---|---|---|---|
| 1 | `Pending` | (Initial — wizard opened) | Empty draft |
| 2 | `InfoCompleted` | Step 1 — Info | Name/sector/classification saved |
| 3 | `SettingsCompleted` | Step 2 — Settings | Password policy / IP allowlist / quota saved |
| 4 | `ServicesConfigured` | Step 3 — Services | Initial service subscriptions selected |
| 5 | `AppsConfigured` | Step 4 — Apps | Apps allocated |
| 6 | `OwnerCreated` | Step 5 — Owner | First acc-owner user created |
| 7 | `Completed` | (Commit) | Account fully active |

## Source

```csharp
public enum eAccountCreationStatus
{
    Pending = 1,
    InfoCompleted = 2,
    SettingsCompleted = 3,
    ServicesConfigured = 4,
    AppsConfigured = 5,
    OwnerCreated = 6,
    Completed = 7
}
```

## Who can drive this lifecycle

- ✅ `sys-admin` — `sys.account.add` allow
- ✅ `sys-products` — `sys.account.add` allow
- ❌ `sys-ops` — no rule (silent deny)
- ❌ All `acc-*` — `sys.account.add` is in the `sys.*` namespace, no acc-* role has any rule on it
- ⚠️ Note: `acc-owner` has `acc.organization.add` (different resource — adds a sub-organization NODE under an existing tenant, not a new tenant Account)

## See also

- Brain Outputs flow playbook for Add Client: `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/README.md`
- [[sys-admin]] · [[sys-products]] — only roles that can drive this
- `02-statuses/node-type.md` — `eNodeType` (Main / Sub) clarifies the node level inside a completed account
