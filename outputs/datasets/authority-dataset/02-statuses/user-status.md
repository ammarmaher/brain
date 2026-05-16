---
type: status
entity: User
enum-name: eUserStatus
namespace: identity + commerce
purpose: "Answers 'what 5 user-status values exist + which can log in + which filter applies in contact-group share'. Open when implementing user state transitions or user-list status filters."
source-files:
  - Falcon/falcon-core-identity-svc/src/Falcon.Identity.Api/Domain/Constants/Enums.cs:55-62
  - Falcon/falcon-core-commerce-svc/src/Falcon.Commerce.Domain/Constants/Enums.cs:176-183
duplicated: true
---

# User Status

> [!tldr]
> User lifecycle status. Defined identically in Identity and Commerce (duplication noted). 5 values: Pending → Active → Suspended → Locked → Deleted. Seed sets new users to Active(2). Contact-group share dialog filters on Active/Suspended/Locked (`Status=2&Status=3&Status=4`).

## Values

| Int | Name | Meaning | Login? | Notes |
|---|---|---|---|---|
| 1 | `Pending` | User created, not yet activated | ❌ | Awaiting OTP / first password set |
| 2 | `Active` | Operational user | ✅ | Default for seeded test users |
| 3 | `Suspended` | Temporarily disabled by admin | ❌ | Reversible by admin |
| 4 | `Locked` | Auto-locked by failed-login or policy | ❌ | Reversible by admin |
| 5 | `Deleted` | Soft-deleted | ❌ | `isDeleted: true` in Mongo |

## Source

```csharp
public enum eUserStatus
{
    Pending = 1,
    Active = 2,
    Suspended = 3,
    Locked = 4,
    Deleted = 5
}
```

Both `Falcon.Identity.Api.Domain.Constants.eUserStatus` and `Falcon.Commerce.Domain.Constants.eUserStatus` carry the same integer values — they are kept in sync by convention, not by reference. **If you change one, change both.**

## Usage observed

- Seed script `seed-test-users.sh:149` inserts new docs with `status: NumberInt(2)` (Active).
- Mgmt-console contact-group share dialog (`ContactGroupDetailsService.getShareableUsers`) queries `identity/user?Status=2&Status=3&Status=4` — Active + Suspended + Locked are all selectable as share targets (the user just sees a state indicator).

## Transitions

- `Pending → Active` — first successful OTP + password set.
- `Active ↔ Suspended` — admin action.
- `Active → Locked` — too many failed logins (or policy).
- `Active → Deleted` — soft-delete; doc retained.
- `Suspended/Locked → Active` — admin reactivation.

## Cross-references

- [[01-roles/_INDEX]] — every role applies on top of an Active user
- [[07-cross-cutting/test-users]] — seeded users are all Active(2)
