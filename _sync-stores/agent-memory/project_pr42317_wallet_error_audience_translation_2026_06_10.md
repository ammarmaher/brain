---
name: project-pr42317-wallet-error-audience-translation-2026-06-10
description: "PR 42317 charging svc — WalletNotConfigForTheNode message reworded audience-aware (client/tenant/account per login, never \"node\"/«العقدة»); resolver in Domain, ErrorLocalizer session-aware; 101 tests green; pushed 044a085"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1f0c26d1-b273-4226-a50a-b12f2c71c782
---

**PR 42317 (`falcon-core-charging-svc`, branch `hotfix/wallet-error-translations`) — audience-aware wallet error translation, COMPLETED + PUSHED 2026-06-10 (commit `044a085`).**

User rule: backend error text must NEVER surface "node"/«العقدة»; it must name the business entity **per logged-in caller**: Falcon internal user → "client"/«العميل»; client user at tenant root → "tenant"/«المستأجر»; client user below root → "account"/«الحساب»; unknown → neutral "Wallet is not configured"/«المحفظة غير مهيأة».

**Load-bearing platform facts:**
- Tenant ROOT node id == tenant id ⇒ JWT claims `node-id == tenant-id` ⟺ tenant-root login ([CODE] falcon-essentials/seed/seed-cleanclient-status-matrix.js:15-16).
- `eUserType`: Falcon=1 (internal), Client=2 (external) ([CODE] charging Domain/Constants/Enums .cs:22).
- charging `SessionProvider.TenantId`/`NodeId` getters THROW FalconException for Falcon users when the claim is present — read them only for Client users.
- Charging resx renders ONLY on the HTTP path (ExceptionHandlerMiddleware→ErrorLocalizer); the Kafka order flow carries the enum and the FE do-payment popup uses FE i18n `paymentFailure.walletNotConfigured{Title,Body}` — separate surface, still says its own copy (not touched).
- `ErrorResourceCompletenessValidator` reflects over `FalconKeys.Error` const fields and requires en+ar resx entries for each at startup ⇒ adding a key to FalconKeys.Error FORCES both resx entries.
- Commerce resx precedent: nodes are worded as account/organization; AR never uses «عقدة».

**Shipped:** `FalconKeys.Error.WalletNotConfigForThe{Client,Tenant,Account}` + NEW pure `Domain/Helpers/ErrorAudienceKeyResolver` (test project refs Domain+Application only, NOT Api — that's why Domain) + `ErrorLocalizer` injects ISessionProvider with try/catch→base-key fallback + en/ar resx variants + 13 xunit cases. Gates: build 0 errors, tests **101/101**.

**How to apply:** Any future user-facing backend message touching node terminology must go through audience wording (client/tenant/account), reuse `ErrorAudienceKeyResolver` pattern; never hardcode «العقدة». Related [[project_comm_channels_500_translatehelper_nre_2026_06_10]].
