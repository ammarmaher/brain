---
type: moc
cluster: 40-Authority
title: Status enums — 9 lifecycle taxonomies
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\02-statuses\
verified-at: 2026-05-16
purpose: "Answers 'which 9 lifecycle status enums exist + which int means what + which enums differ across services (e.g. service status Commerce vs Provisioning)'. Open before status-driven logic."
---

> [!tldr]
> Every lifecycle enum on the platform. 9 status enums + supporting classification enums.

# Status enums

## Statuses by entity

| Entity | Enum | Values | Service |
|---|---|---|---|
| User | `eUserStatus` | Pending(1) / Active(2) / Suspended(3) / Locked(4) / Deleted(5) | Identity + Commerce (duplicated) |
| Account creation | `eAccountCreationStatus` | Pending(1) → Completed(7) (7-stage Add-Client wizard) | Commerce |
| Service (Commerce) | `eFalconServiceStatus` | None(0) / InActive(1) / Active(2) / Expired(3) / Disabled(4) | Commerce |
| Service subscription | `eProductSubscriptionStatus` | InActive(1) / Paid(2) / Active(3) / Expired(4) / Disabled(5) | Provisioning ⚠️ different ints |
| Contract | `eContractStatus` | Pending(1) / Active(2) / Expired(3) | Commerce |
| Order | `eOrderStatus` | Pending(1) / Paid(2) / Failed(3) | Commerce |
| Job | `eJobStatus` | Scheduled(1) / Executed(2) / Failed(3) / Canceled(4) | Commerce |
| Auth stage | `eAuthenticationStage` | PasswordPending(1) → PasswordResetPending(6) | Identity |
| Node type | `eNodeType` | Main(1) / Sub(2) | Commerce (structural) |

## Drift watch

- `eUserStatus` duplicated between Identity and Commerce — keep in sync.
- `eFalconServiceStatus` and `eProductSubscriptionStatus` use **different integer values** for the same names — serialize via named enums.
- `eUserRoles` + `eUserType` duplicated three times (Identity, Commerce, Provisioning).

## Drill into Brain Outputs

- `C:\Falcon\Brain Outputs\datasets\authority-dataset\02-statuses\user-status.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\02-statuses\account-creation-status.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\02-statuses\service-status.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\02-statuses\contract-status.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\02-statuses\_INDEX.md`

## See also

- [[Roles]] — which role can drive which status
- [[Falcon-vs-Client]] — which feature uses which status
