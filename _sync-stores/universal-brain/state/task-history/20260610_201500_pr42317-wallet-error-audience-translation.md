# PR 42317 — WalletNotConfigForTheNode audience-aware translation (charging svc)

**Date:** 2026-06-10 · **Status:** COMPLETED · **Repo:** falcon-core-charging-svc · **Branch:** hotfix/wallet-error-translations

## Request
PR 42317's new error message said "Wallet is not configured for the node" / «المحفظة غير مهيأة لهذه العقدة». User: never show "node"/«العقدة»; word it as **client / tenant / account according to who's logged in**. Fix the PR.

## What shipped (commit 044a085, pushed)
- `FalconKeys.Error` + 3 keys: `WalletNotConfigForTheClient/Tenant/Account` (startup `ErrorResourceCompletenessValidator` reflects over these fields → enforces en+ar resx entries).
- NEW `Falcon.Charging.Domain/Helpers/ErrorAudienceKeyResolver.cs` — pure static policy: Falcon user → Client key; Client user with node-id==tenant-id → Tenant key (tenant ROOT node id == tenant id, verified in `falcon-essentials/seed/seed-cleanclient-status-matrix.js:15-16`); Client user otherwise → Account key; unknown → base key. OrdinalIgnoreCase id compare.
- `ErrorLocalizer` (Api) injects `ISessionProvider`, resolves audience key pre-lookup; try/catch → base key (never mask the original error); reads TenantId/NodeId ONLY for Client users (SessionProvider getters THROW for Falcon+claim-present).
- resx en+ar: base `WalletNotConfigForTheNode` → neutral "Wallet is not configured"/«المحفظة غير مهيأة»; + client/tenant/account variants («العميل»/«المستأجر»/«الحساب»).
- 13 new xunit cases in `tests/.../Localization/ErrorAudienceKeyResolverTests.cs`.

## Gates
- `dotnet build` Falcon.Charging.slnx: 0 errors (warnings pre-existing).
- `dotnet test`: **101/101 green**.

## Notes / boundaries
- Charging resx renders only on the HTTP error path (`ExceptionHandlerMiddleware`); the Kafka order flow sends the ENUM — the FE popup wording for that flow lives in FE i18n keys `paymentFailure.walletNotConfigured{Title,Body}` (separate surface, not in this PR's scope).
- Platform precedent honored: Commerce resx never says "node" (uses account/organization; AR has zero «عقدة»).
- Test project references Domain+Application only (NOT Api) → resolver placed in Domain to stay unit-testable.

**PR:** https://t2development.visualstudio.com/DefaultCollection/Falcon/_git/falcon-core-charging-svc/pullrequest/42317
