# Pending Question — AccountHierarchyController missing client-tenant isolation

> **Wave**: 5a (Commerce Controller deep-dive)
> **Controller**: `AccountHierarchyController`
> **Topic**: tenant isolation
> **Classification**: F-004 (entity drift / contract gap)
> **Raised by**: Ammar Core-Commerce
> **Date raised**: 2026-05-18

## Why halted

`GetAccountHierarchyHandler.ExecuteAsync` does not raise `OwnerIdNotMatchWithTenantId` when a **client** user passes another tenant's `AccountId`.

Compare with `GetSettingsHandler.ValidateClientOwnership` ([CODE] `GetSettingsHandler.cs:65-69`) and `GetWalletSettingsHandler.ValidateQuery` ([CODE] `GetWalletSettingsHandler.cs:63-65`) which both **do** raise this error for cross-tenant client access.

The current `GetAccountHierarchyHandler.ValidateQuery` only checks for empty `AccountId` ([CODE] `GetAccountHierarchyHandler.cs:104-107`). The subtree is then clamped to `_currentUser.NodeId`, but the **account-level metadata** (`AccountName`, `AccountIcon`, `TenantId`, `Currency`, `WalletBalanceType`, `WalletType`) is **leaked** to a client requesting another tenant's id.

## Sources

- [CODE] `Falcon.Commerce.Application/Services/Handlers/GetAccountHierarchyHandler.cs:42-141`
- [CODE] `Falcon.Commerce.Application/Services/Handlers/GetSettingsHandler.cs:65-69` (reference for the expected check)
- [CODE] `Falcon.Commerce.Application/Services/Handlers/GetWalletSettingsHandler.cs:63-65` (reference)
- [BRAIN-OUT] `Brain Outputs/understanding/backend/commerce/controllers/AccountHierarchyController/VALIDATIONS.md` (this dossier)
- [BRAIN-OUT] `Brain Outputs/understanding/backend/commerce/controllers/AccountHierarchyController/ERRORS.md` (this dossier)

## Plausible answers

### Answer A — Add the check (gap is a real security bug)
- Add `ValidateClientOwnership(accountNode.TenantId)` immediately after node load
- Raise `OwnerIdNotMatchWithTenantId` (403) on mismatch
- Backward compat: existing client tooling should never have made such requests; if they did, they were unintentionally leaking data
- Effort: small (1 if-statement + 1 line throw)

### Answer B — Intentional, account metadata is public-by-design
- Account name, currency, etc. are arguably non-sensitive — wallet balance is hidden anyway
- Subtree narrowing already restricts the dangerous data (sub-node names) per role
- No code change; document as "intentional" in V-rule

### Answer C — Verify via gateway routing
- The Core Gateway may already prevent client cross-tenant requests at the YARP level (`commerce-proxy` route policy)
- If yes, defensive-in-depth gap; if no, real security bug
- Action: code-walk Gateway routes before deciding A or B

## Recommended question for the team

> "Should `GET /api/accounts/hierarchy` raise `OwnerIdNotMatchWithTenantId` when a Client user passes another tenant's `accountId`, mirroring the check in `GetSettingsHandler.ValidateClientOwnership`? Currently account-level metadata (name, icon, wallet config) is returned without tenant verification, while the subtree is narrowed via `_currentUser.NodeId`."

## Blast radius

| Area | Impact |
|---|---|
| Web Platform UIs | None — UIs never request other tenants' hierarchies. The bug is only exploitable via direct API calls. |
| Backend Services | Charging / Provisioning don't consume this endpoint. |
| Security | **Theoretical PII leak** — `accountName`, `accountIcon` are tenant-identifying. Severity depends on whether org names are public. |
| Test data | No impact — testing endpoints have their own anonymous gate. |
| Add Client wizard | No impact — wizard uses Settings tab and per-tab endpoints, not this aggregator. |

## Halt-and-flag classification (per `DECISION-PROTOCOL.md`)

**F-004** — entity drift / handler-level contract gap vs platform-wide convention.

## Recommended interim action

Until the team answers: **do not change code**, but flag in V-rule authoring that the gateway / handler tenant-isolation guarantee for `GET /api/accounts/hierarchy` is **partial** — only the subtree is isolated; account-level fields are not.
