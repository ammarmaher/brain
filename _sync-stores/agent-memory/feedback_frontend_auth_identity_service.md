---
name: Frontend auth goes through Identity Service, not Zitadel directly
description: The Falcon frontend must not talk to Zitadel; all auth flows go through falcon-core-identity-svc
type: feedback
originSessionId: 02a11723-953d-4f03-ab41-1be58f7e474b
---
**Rule:** The Falcon frontend (v1 `falcon-web-platform-ui`, v2 `falcon-web-platform-v2`, and any future web/mobile client) must NEVER call Zitadel directly. All authentication, token refresh, OTP, password, and lifecycle flows go through the **Identity Service** (`falcon-core-identity-svc`) via the Identity Gateway at `https://auth.falconhub.space/api/`.

**Why:** Per `falcon-wiki/Home/Software-Architecture-Design/Security-Architecture.md` and the user's explicit correction (2026-04-18), the Identity Service owns user lifecycle (Pending, Active, Suspended, Locked, Deleted), orchestrates Zitadel on the backend, and enforces tenant + IP allowlist policies. Having the frontend talk to Zitadel would bypass that enforcement layer and leak identity-provider coupling into every UI.

**How to apply:**
- Do NOT install `angular-auth-oidc-client`, `@auth0/angular-jwt`, or any OIDC redirect-flow library on the frontend.
- Do NOT reference Zitadel client IDs, issuer URLs, or discovery endpoints in frontend code.
- Use plain HTTP calls to Identity Service endpoints: `/identity/login`, `/identity/refresh`, `/identity/logout`, `/identity/otp/*`, `/identity/password/*`, etc.
- Token storage + refresh + `Authorization: Bearer` interceptor live in `@platform/auth` — a thin service, not an OIDC library.
- If an agent sees Zitadel config in v1 environment files (e.g. `clientId: '366680327604731913'`), it is legacy/unused from the frontend side; do not port it to v2.
