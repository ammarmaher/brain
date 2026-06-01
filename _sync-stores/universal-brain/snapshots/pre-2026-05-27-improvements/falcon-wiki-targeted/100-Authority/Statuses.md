---
type: moc
cluster: 100-Authority
title: Status enums — 9 lifecycle taxonomies
projection-source: _mounts/brain-outputs/datasets/authority-dataset/02-statuses/
verified-at: 2026-05-16
purpose: "Answers 'which 9 lifecycle status enums exist + which int means what + which enums differ across services (e.g. service status Commerce vs Provisioning)'. Open before status-driven logic."
---

> [!tldr]
> Every lifecycle enum on the platform. 9 status enums + supporting classification enums. The ones that drive UI gating + workflow: User, Account-Creation, Service (×2), Contract, Order, Job, Auth-Stage, Product-Subscription.

# Status enums

## Statuses by entity

| Entity | Enum | Values | Service |
|---|---|---|---|
| User | `eUserStatus` | Pending(1) / Active(2) / Suspended(3) / Locked(4) / Deleted(5) | Identity + Commerce (duplicated) |
| Account creation | `eAccountCreationStatus` | Pending(1) → InfoCompleted(2) → SettingsCompleted(3) → ServicesConfigured(4) → AppsConfigured(5) → OwnerCreated(6) → Completed(7) | Commerce |
| Service (Commerce) | `eFalconServiceStatus` | None(0) / InActive(1) / Active(2) / Expired(3) / Disabled(4) | Commerce |
| Service subscription | `eProductSubscriptionStatus` | InActive(1) / Paid(2) / Active(3) / Expired(4) / Disabled(5) | Provisioning ⚠️ different ints than Commerce |
| Contract | `eContractStatus` | Pending(1) / Active(2) / Expired(3) | Commerce |
| Order | `eOrderStatus` | Pending(1) / Paid(2) / Failed(3) | Commerce |
| Job | `eJobStatus` | Scheduled(1) / Executed(2) / Failed(3) / Canceled(4) | Commerce (auto-renewal) |
| Auth stage | `eAuthenticationStage` | PasswordPending(1) → OtpPending(2) → PasswordChangeRequired(3) → Authenticated(4) → Failed(5) → PasswordResetPending(6) | Identity |
| Node type | `eNodeType` | Main(1) / Sub(2) | Commerce (structural, not status) |

## Key supporting enums (classification, not status)

- `eUserType` — Falcon(1) / Client(2)
- `eUserRoles` — SystemAdministrator(1) / Product(2) / Operation(3) / AccountOwner(4) / NodeAdmin(5) / NormalUser(6)
- `ePasswordSecurityLevel` — Normal(1) / Advanced(2)
- `eClassificationCategory` — VIP(1) / Critical(2) / Normal(3)
- `eClassificationSubCategory` — Bank/Gov/SemiGov/LargeEnterprise/MediumEntity/SME
- `eSector` — Government(1) / Commercial(2) / Charity(3)
- `eAuthorityLetterType` — Government(1) / Commercial(2) / Charity(3)
- `eCurrency` — SAR(1) / Points(2)
- `eWalletType` — MasterWallet(1) / NodeWallet(2) / UserWallet(3) / CommChannelWallet(4)
- `ePricingType` — None(0) / Monthly(1) / Yearly(2) / OneTimePayment(3)

## Drift watch

- `eUserStatus` is **duplicated** between Identity and Commerce — keep in sync.
- `eFalconServiceStatus` (Commerce) and `eProductSubscriptionStatus` (Provisioning) overlap conceptually but use **different integer values**. Cross-service serialization must use named enums.
- `eUserRoles` and `eUserType` are duplicated **three** times: Identity, Commerce, Provisioning.

## Atomic notes per status

- [user-status](../_mounts/brain-outputs/datasets/authority-dataset/02-statuses/user-status.md)
- [account-creation-status](../_mounts/brain-outputs/datasets/authority-dataset/02-statuses/account-creation-status.md)
- [service-status](../_mounts/brain-outputs/datasets/authority-dataset/02-statuses/service-status.md)
- [contract-status](../_mounts/brain-outputs/datasets/authority-dataset/02-statuses/contract-status.md)
- [Brain Outputs / 02-statuses/_INDEX](../_mounts/brain-outputs/datasets/authority-dataset/02-statuses/_INDEX.md)

## See also

- [[Roles]] — which role can drive which status
- [[Falcon-vs-Client]] — which feature uses which status
