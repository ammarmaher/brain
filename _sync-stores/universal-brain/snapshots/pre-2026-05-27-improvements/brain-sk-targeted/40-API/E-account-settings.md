---
type: entity-reconciliation
entity: account-settings
prd: PRD-01
service: commerce
drift-count: 14
created: 2026-05-15
---
*** Entity Reconciliation E-account-settings — AccountSettings ***
*** PRD: PRD-01 Account Management · Backend service: Commerce · 2026-05-15 ***

# E-account-settings — AccountSettings

> Embedded per-account configuration block holding the security + quota knobs: password policy tier, IP allowlist, per-account limits (normal/system user count, node-depth, balance-transfer percentage). Owned by [[Commerce Service]] (source-of-truth for the IP allowlist) and read by [[Identity Service]] + [[Core Gateway Service]] for enforcement.

## PRD definition (business-conceptual)

- **PRD module:** [[01 Account Management]]
- **Source:** [ENTITIES.md](../../../Brain%20Outputs/prd/modules/01-account-management/ENTITIES.md)
- **PRD fields:**
  - `passwordSecurityLevel`: enum `Normal | Advanced` (PRD wording per BR-AM-09)
  - `allowedIps[]`: list of allowed CIDR/IP entries — enforced by Gateway via HTTP header (BR-AM-10)
  - `maxNormalUserLimit`: integer — quota on Normal Users
  - `maxSystemUserLimit`: integer — quota on System/Falcon Users (BR-AM-37)
  - `maxNodeLevels`: integer — max depth for sub-node tree
  - `balanceTransferLimitPct`: integer — percentage cap on balance-transfer operations
- **Lifecycle:** n/a (embedded; co-edited with Account)

## Backend DTO mapping (concrete request/response shapes)

- **Service:** [[Commerce Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md)
- **Validations source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md)
- **Relevant DTOs:**
  - `CreateAccountRequest.Settings` (nested `SettingsInfo`) — write at Account create. Per `DTO_DICTIONARY.md`: `ePasswordSecurityLevel, AllowedIPs[], MaxNormalUserLimit, MaxSystemUserLimit, MaxNodeLevel, BalanceTransferLimit`
  - `UpdateSettingsRequest` — `PUT /Setting` (tenant settings update post-create)
  - `GetSettingsResponse` — `GET /Setting` (password policy, IP allowlist, limits read-back)
  - `UpdateSettingsResponse` — echo of update result
  - `GetAllIpAllowlistsResponse` — `GET /Security/ip-allowlists` (east-west endpoint): `Dictionary<string, IpAllowlistEntryDto> Tenants` where entry = `{ bool Enabled, List<string> AllowedIps }`

## Field reconciliation

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `passwordSecurityLevel` | `CreateAccountRequest.Settings.PasswordSecurityLevel` `[ThrowIfNotPassed, ThrowIfNotEnumValue<ePasswordSecurityLevel>]` · `GetSettingsResponse.*` | enum `Normal/Advanced` → `ePasswordSecurityLevel` enum | ⚠ DRIFT — **enum vocabulary mismatch**: PRD uses `Normal/Advanced`; backend `ePasswordSecurityLevel` is `Low/Medium/High/Strict` per [Identity DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/identity/DTO_DICTIONARY.md) (line 76). Open question Q-UM-12. See [[V-password-security-level-enum]]. |
| `allowedIps[]` | `CreateAccountRequest.Settings.AllowedIPs[]` (write) · `GetAllIpAllowlistsResponse.Tenants[<tenant>].AllowedIps` (read, east-west) | string[] → List<string> | ✅ match shape. Casing drift: PRD `allowedIps` vs backend `AllowedIPs` (cosmetic). |
| _(none)_ | `GetAllIpAllowlistsResponse.Tenants[<tenant>].Enabled` (bool) | n/a → bool | ➕ Backend has an **Enabled** toggle per tenant separate from the list itself; PRD does not document an explicit "IP allowlist on/off" boolean — it is implicit ("if list non-empty then enforced"). Could be a UX-level switch. |
| `maxNormalUserLimit` | `CreateAccountRequest.Settings.MaxNormalUserLimit` | integer → integer | ✅ match — see [[V-account-limits-zero-means-no-limit]] (zero means no limit per BR-AM-04) |
| `maxSystemUserLimit` | `CreateAccountRequest.Settings.MaxSystemUserLimit` | integer → integer | ✅ match |
| `maxNodeLevels` | `CreateAccountRequest.Settings.MaxNodeLevel` (singular) | integer → integer | ⚠ DRIFT (cosmetic) — PRD `maxNodeLevels` (plural) vs backend `MaxNodeLevel` (singular). Semantic match. |
| `balanceTransferLimitPct` | `CreateAccountRequest.Settings.BalanceTransferLimit` | integer percentage → integer | ⚠ DRIFT (naming clarity) — PRD name carries the unit hint (`Pct`); backend name does not. Field-level docs should clarify "percentage" or rename. |
| _(none)_ | `UpdateSettingsRequest` body shape | n/a → not enumerated in DTO_DICTIONARY | ⚠ Documentation gap — `UpdateSettingsRequest` and `GetSettingsResponse` are listed but their individual fields are not enumerated in `DTO_DICTIONARY.md`. Likely mirror of `Settings` block. |

## Drift / gaps summary

- **Drift items:**
  - `passwordSecurityLevel` enum **vocabulary** mismatch (`Normal/Advanced` vs `Low/Medium/High/Strict`) — open question Q-UM-12, high-severity
  - `allowedIps` casing (`allowedIps` vs `AllowedIPs`) — cosmetic
  - `maxNodeLevels` vs `MaxNodeLevel` — cosmetic naming
  - `balanceTransferLimitPct` vs `BalanceTransferLimit` — unit hint dropped on backend name
- **Missing on backend:**
  - None known — all PRD fields surface on backend
- **Extra on backend:**
  - `Enabled` bool per tenant in `GetAllIpAllowlistsResponse` — explicit allowlist on/off toggle not documented in PRD
- **Documentation gap:**
  - `UpdateSettingsRequest` and `GetSettingsResponse` field-by-field shapes not enumerated in `DTO_DICTIONARY.md`

## Related validation rules (V-rule notes)

- [[V-password-security-level-enum]] — `Settings.PasswordSecurityLevel` `[ThrowIfNotEnumValue<ePasswordSecurityLevel>]` (notes the Normal/Advanced ↔ Low/Medium/High/Strict gap)
- [[V-account-limits-zero-means-no-limit]] — handler-level checks `InvalidAccountLimits` / `MaxNodeLevelReached` / `NormalUserLimitReached`
- [[V-account-ip-allowlist-enforcement]] — Identity-side `IpAllowlistPreProcessor` + Core Gateway Redis cache enforce `AllowedIPs`
- _no V-rule yet for `BalanceTransferLimit` percentage cap — candidate for future Phase 2C extension_
- _no V-rule yet for the `Enabled` toggle behavior — candidate for clarification_

## Pages using this entity

- [[Organization Hierarchy]] — Settings tab (view + edit modes), IP Management section, Account Limitation section
- Add Client wizard Step 2 (Settings) — not yet seeded under `10-Pages/`

## Cross-service touches

- [[Identity Service]] — consumes `PasswordSecurityLevel` for `PasswordPolicy` enforcement at create/change/forgot-password
- [[Identity Service]] — `IpAllowlistPreProcessor` reads the allowlist (via Redis cache populated from `/Security/ip-allowlists`) and rejects requests with `IpNotAllowed` (403)
- [[Core Gateway Service]] — Redis cache for the allowlist; refreshed via `commerce.tenant-ip-allowlist-changed.v1` Kafka topic
- [[Access PES Service]] — reads settings as part of permission-decision context

## Tags

#type/e-entity #prd/01 #service/access #service/commerce #service/core-gateway #service/identity #severity/high #drift #gap #security

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
