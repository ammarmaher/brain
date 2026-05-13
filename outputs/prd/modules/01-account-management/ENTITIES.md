*** PRD Understanding - Account Management - ENTITIES ***

# 01-account-management - Domain Entities

> Inferred from `latest-prd.md` + `understanding.md`. Fields in *italics* are inferred / not explicitly named in the PRD but implied by the flow.

| Entity | Description | Key Fields | Lifecycle Status | Relationships |
|---|---|---|---|---|
| Node | Tree element in the Falcon hierarchy. Root, Main (= Client/Account), or Sub. | id, type (root\|main\|sub), parentId, *settings* | Active / Soft-deleted (inferred) | Root has no parent. Main has Root as parent. Sub-nodes recurse under Main. Account 1:1 Main node. |
| Account | The Client. Lives on a Main node. | id, nodeId, accountName (<=30, unique), accountId (auto), financeId, classificationCategory?, classificationSubCategory?, profilePicture?, officialData | Active (no explicit Disabled/Deleted state in PRD) | 1:1 with Main Node. 1:N AccountSettings, CommChannelConfig, AppConfig, Wallet, Contract. |
| AccountOfficialData | Embedded official info. | entityName, authorityLetterType (Government\|Commercial\|Charity), sector, authorityLetterId, country, city, district, street, buildingNumber, postalCode, additionalAddress, anotherId, vatRegistrationNumber | n/a | Owned by Account |
| AccountSettings | Embedded security + limits config. | passwordSecurityLevel (Normal\|Advanced), allowedIps[], maxNormalUserLimit, maxSystemUserLimit, maxNodeLevels, balanceTransferLimitPct | n/a | Owned by Account |
| CommChannelConfig | Per-account configuration of a CommChannel (visibility, pricing, status). | accountId, commChannelId, visibility (Hide/Show), pricingType (Monthly\|Yearly\|OneTime), priceValueSar, firstActivationDate?, activationDate?, renewDate?, status | InActive (First Time) -> Paid -> Active -> Expired -> InActive (Grace Period Ends) / Disabled | N:1 Account; N:1 CommChannel (master) |
| AppConfig | Per-account configuration of an Application (same shape as CommChannelConfig). | accountId, applicationId, visibility, pricingType, priceValueSar, firstActivationDate?, activationDate?, renewDate?, status | Same as CommChannelConfig | N:1 Account; N:1 Application |
| Wallet | A bucket of SAR balance. Topology depends on Balance Type x Wallet Type. | id, type (master\|comm\|user\|node\|user-comm\|node-comm), ownerId (account or user or node), commChannelId?, valueSar | n/a (lump sum is derived) | Master is virtual (aggregate of WalletRecords). Comm, User, Node, User-Comm, Node-Comm are concrete. |
| WalletRecord | Atomic credit record linked to a specific contract; nearest-expiring traversal unit. | id, walletId, contractId, valueSar, createdAt | Live (records survive Expired contracts but are excluded from lump-sums) | N:1 Wallet; N:1 Contract |
| TransferTx | A transfer of SAR between wallets. | id, srcWalletId, dstWalletId, amountSar, actorId, at, contractIds[] | n/a | N:1 source Wallet; N:1 destination Wallet; N:M Contract via contractIds[] |
| WalletTypeConfig | Per-account configuration of Wallet Topology. | accountId, balanceType (User\|Node), walletType (Single\|Multiple) | Set at create, rarely changed (assumption) | 1:1 Account |

## Inferred relationships diagram

```
Root Node ──┐
            └─ Main Node ──┬─ Sub-Node (recursive)
                           ├─ Account ─┬─ AccountSettings
                           │           ├─ AccountOfficialData
                           │           ├─ WalletTypeConfig
                           │           ├─ CommChannelConfig × N
                           │           ├─ AppConfig × N
                           │           └─ Wallet × N
                           │                └─ WalletRecord × N ─→ Contract
                           └─ User (02-user-management)
```

## Entity-level notes

- `Master Wallet` is **abstract** — its value is `SUM(WalletRecord.valueSar WHERE contract.status = Active)` (latest-prd.md:82, understanding.md:45). No physical "master wallet" row is required.
- `WalletRecord` is the load-bearing entity for contract linkage. Expired contracts retain their records but are removed from the lump sum (BR-AM-38).
- `WalletTypeConfig` is logically separate from `AccountSettings` because it is Falcon-usertype-only and has a different change-management story.
- `AccountSettings.allowedIps[]` is enforced by the Gateway via HTTP header (BR-AM-10). Cache lives in Core Gateway, populated from Commerce `GET /api/Security/ip-allowlists`.

## Status enumerations

- **CommChannelConfig.status / AppConfig.status**: `InActive (First time)`, `Paid`, `Active`, `Expired`, `InActive (Grace Period Ends)`, `Disabled` (BR-AM-20).
- **WalletTypeConfig.balanceType**: `User`, `Node`.
- **WalletTypeConfig.walletType**: `Single`, `Multiple`.
- **AccountSettings.passwordSecurityLevel**: `Normal`, `Advanced` (BR-AM-09).
- **CommChannelConfig.pricingType / AppConfig.pricingType**: `Monthly`, `Yearly`, `One Time Payment` (BR-AM-16).
- **CommChannelConfig.visibility / AppConfig.visibility**: `Hide`, `Show` (BR-AM-14).
- **Classification category** (Account): `VIP`, `Critical`, `Normal` (BR-AM-06).
- **Classification subcategory** (Account): `Bank`, `Gov`, `SemiGov`, `Large`, `Medium`, `SME` (BR-AM-07).
- **AuthorityLetterType**: `Government`, `Commercial`, `Charity` (BR-AM-08).
