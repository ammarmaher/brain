---
type: index
cluster: 02-statuses
purpose: "Answers 'which lifecycle/status enums exist across all services + where to find each'. Open to navigate to the right status file or to spot duplicate enum definitions."
---

# Status Taxonomy — Index

> [!tldr]
> Every lifecycle enum on the platform. 9 enums total across Identity, Commerce, and Provisioning. The ones that drive UI gating + workflow are: User, Account-Creation, Service (×2), Contract, Order, Job, Auth-Stage, Product-Subscription.

## Statuses by entity

| Entity | Enum | Values | Service | Note |
|---|---|---|---|---|
| User | `eUserStatus` | Pending(1) / Active(2) / Suspended(3) / Locked(4) / Deleted(5) | Identity + Commerce (dup) | [[user-status]] |
| Account creation | `eAccountCreationStatus` | Pending(1) → Completed(7) | Commerce | [[account-creation-status]] — Add Client 5-step wizard |
| Service (commerce) | `eFalconServiceStatus` | None(0)/InActive(1)/Active(2)/Expired(3)/Disabled(4) | Commerce | [[service-status]] |
| Service subscription | `eProductSubscriptionStatus` | InActive(1)/Paid(2)/Active(3)/Expired(4)/Disabled(5) | Provisioning | [[service-status]] — different ints than Commerce! |
| Contract | `eContractStatus` | Pending(1)/Active(2)/Expired(3) | Commerce | [[contract-status]] |
| Order | `eOrderStatus` | Pending(1)/Paid(2)/Failed(3) | Commerce | (linked from contract-status) |
| Job | `eJobStatus` | Scheduled(1)/Executed(2)/Failed(3)/Canceled(4) | Commerce | (auto-renewal jobs) |
| Auth stage | `eAuthenticationStage` | PasswordPending(1)→OtpPending(2)→PasswordChangeRequired(3)→Authenticated(4)→Failed(5)→PasswordResetPending(6) | Identity | Multi-step login |
| Node type | `eNodeType` | Main(1)/Sub(2) | Commerce | Not a status — structural classification |
| Order failure reason | `eOrderFailureReason` | None(0)/InsufficientFunds(1)/CommChannelPriorityOrderRequired(2)/WalletNotConfigForTheNode(3) | Commerce | Why a payment failed |

## Non-status enums (related but classification)

- `eUserType` (Falcon=1 / Client=2) — see [[../01-roles/_INDEX]]
- `eUserRoles` (1-6) — see [[../01-roles/_INDEX]]
- `ePasswordSecurityLevel` (Normal=1 / Advanced=2)
- `eDeliveryMethod` (Email=1 / Sms=2 / Both=3)
- `eNotificationChannel` (Email=1 / Sms=2)
- `eCurrency` (SAR=1 / Points=2)
- `eWalletBalanceType` (NodeBased=1 / UserBased=2)
- `eWalletBaseType` (SingleWallet=1 / MultipleWallets=2)
- `eWalletType` (MasterWallet=1 / NodeWallet=2 / UserWallet=3 / CommChannelWallet=4)
- `eClassificationCategory` (VIP=1 / Critical=2 / Normal=3)
- `eClassificationSubCategory` (Bank/Gov/SemiGov/LargeEnterprise/MediumEntity/SME)
- `eSector` (Government=1 / Commercial=2 / Charity=3)
- `eAuthorityLetterType` (Government=1 / Commercial=2 / Charity=3)
- `ePricingType` (None=0 / Monthly=1 / Yearly=2 / OneTimePayment=3)

## Drift watch

- `eUserStatus` is **duplicated** between Identity and Commerce — keep in sync.
- `eFalconServiceStatus` (Commerce) and `eProductSubscriptionStatus` (Provisioning) overlap conceptually but use **different integer values** for the same names (Active = 2 in Commerce, 3 in Provisioning). Cross-service DTO serialization must use named enums, not int values.
- `eUserRoles` and `eUserType` are duplicated **three** times: Identity, Commerce, Provisioning. Same values; same drift risk.
