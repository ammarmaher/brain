---
ruleId: R-XC-002
name: Frontend never calls Zitadel directly — go through Identity Service
category: auth
scope:
  apps:
    - host-shell
    - admin-console
    - management-console
    - falcon-web-platform-ui
    - falcon-web-platform-v2
  paths:
    - "apps/**/*.ts"
    - "apps/**/*.html"
    - "apps/**/environment*.ts"
    - "libs/**/*.ts"
    - "**/*.ts"
  exemptPaths:
    - "**/node_modules/**"
    - "**/dist/**"
    - "**/falcon-web-platform-ui-old/**"
    - "**/deprecated-falcon-web-platform-ui/**"
severity: must
detector:
  type: structural
  patterns:
    - 'zitadel'
    - 'angular-auth-oidc-client'
    - '@auth0/angular-jwt'
    - 'oidc-client(-ts)?'
    - '\.well-known/openid-configuration'
    - 'clientId\s*:\s*[''"]\d{18,}[''"]'
    - 'issuer\s*:\s*[''"]https?://[^''"]*zitadel'
  exemptPatterns:
    - 'auth\.falconhub\.space/api/'
    - '// legacy.*do not port'
  description: |
    Scans frontend TS/HTML for any reference to Zitadel (string literal, import, OIDC library, discovery URL, or numeric Zitadel client ID >= 18 digits). All such references are violations unless they're inside a clearly-commented legacy block scheduled for removal. The detector also flags any HTTP call whose base URL does not resolve to the Identity Gateway (`auth.falconhub.space/api/`) when the call path matches `/login`, `/token`, `/refresh`, `/otp`, `/password`.
autoFix:
  available: false
  riskLevel: high
  patchHint: 'Auth migration — replace OIDC redirect-flow library with @platform/auth thin service. Manual.'
relatedRules:
  - R-XC-001
source:
  - file: feedback_frontend_auth_identity_service.md
    location: memory
  - file: Home/Software-Architecture-Design/Security-Architecture.md
    location: wiki
  - file: CLAUDE.md
    location: project-root
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
operationalGuardrail: true
---

*** Rule R-XC-002 — Frontend never calls Zitadel directly ***
*** Source: feedback_frontend_auth_identity_service.md + Security-Architecture.md ***
*** Detector: structural (string / import / discovery URL scan) ***

# R-XC-002 — Frontend never calls Zitadel directly

## What it says

No Falcon frontend codebase — v1 `falcon-web-platform-ui`, v2 `falcon-web-platform-v2`, future web/mobile clients — may issue an HTTP call to Zitadel, import an OIDC client library that initiates redirect-flow against Zitadel, reference a Zitadel client ID or issuer URL, or read Zitadel's `.well-known/openid-configuration`. **All** authentication, token refresh, OTP, password, lifecycle, and logout flows go through the **Identity Service** (`falcon-core-identity-svc`) via the Identity Gateway at `https://auth.falconhub.space/api/`. Token storage + refresh + `Authorization: Bearer` interceptor live in `@platform/auth` — a thin service, not a full OIDC library.

## Why it exists

Per `Security-Architecture.md` and the user's explicit 2026-04-18 correction: Identity Service is the enforcement layer for tenant policy, IP allowlist, user lifecycle states (Pending / Active / Suspended / Locked / Deleted), and Zitadel orchestration. A frontend that talks to Zitadel directly bypasses every one of those enforcement points and couples every UI to a specific identity provider. Legacy v1 environment files contain leftover Zitadel client IDs (`'366680327604731913'`) — these are unused on the frontend side and must not be ported forward.

## Detector strategy

**Structural** scan of frontend `.ts` / `.html` / `environment*.ts` / `*.config.ts` files:

1. String search for the literal `zitadel` (case-insensitive), excluding comments tagged `legacy do not port`.
2. Import-graph scan for any of: `angular-auth-oidc-client`, `@auth0/angular-jwt`, `oidc-client`, `oidc-client-ts`, `@manfredsteyer/oauth2-oidc`.
3. URL pattern scan for `.well-known/openid-configuration`, or any HTTP request whose base URL does not equal `auth.falconhub.space/api/` but whose path matches `/login`, `/token`, `/refresh`, `/otp/*`, `/password/*`.
4. Config scan for `clientId` properties holding 18+ digit numeric strings (Zitadel client ID shape) or `issuer` properties pointing to a non-`falconhub.space` host.
5. Any match → violation.

## Examples

### ✅ Good

```typescript
// file: libs/platform/auth/src/lib/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = 'https://auth.falconhub.space/api';

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.base}/identity/login`, { email, password });
  }

  refresh(refreshToken: string) {
    return this.http.post<TokenResponse>(`${this.base}/identity/refresh`, { refreshToken });
  }
}
```

### ❌ Bad

```typescript
// file: apps/host-shell/src/app/auth/auth.config.ts
import { provideAuth, OAuthService } from 'angular-auth-oidc-client';  // ❌ OIDC redirect library

export const authConfig = {
  issuer: 'https://zitadel.falconhub.space',                            // ❌ Zitadel issuer
  clientId: '366680327604731913',                                       // ❌ Zitadel client ID
  scope: 'openid profile email offline_access',
};
```

## Known legitimate exemptions

- `falcon-web-platform-ui-old/**` and `deprecated-falcon-web-platform-ui/**` — read-only legacy code, not in active dev paths.
- Type-only imports from `@types/zitadel` if Identity Service returns Zitadel-shaped DTOs (rare — prefer mapping in Identity).
- A single inline comment `// legacy zitadel reference — do not port` against a config line scheduled for deletion. The detector accepts this for ≤30 days; after that the line must be removed.
- Anything listed in `exemptions/EXEMPTIONS.md` against this ruleId.

## Fix recipe

When a violation is detected:

1. Identify the auth flow being short-circuited (login / refresh / OTP / password / logout).
2. Locate the matching Identity Service endpoint at `auth.falconhub.space/api/identity/*` (coordinate with Ammar Auth if unsure).
3. Replace the OIDC library import with `@platform/auth`. If `@platform/auth` lacks the method, add it as a thin `HttpClient` call returning `Observable<ServiceOperationResult<T>>`.
4. Strip Zitadel `clientId` / `issuer` / discovery URLs from environment files. Delete `angular-auth-oidc-client` (or sibling) from `package.json` if no other consumer.
5. Update the HTTP interceptor that attaches `Authorization: Bearer` to read from `@platform/auth`'s token store rather than from the OIDC library's session.
6. Verify with `nx build <app>` that the build is green. Smoke-test login / refresh / logout in a dev environment.

## Related rules

- [[R-XC-001-identity-owns-user-lifecycle]] — backend sibling: Identity owns user mutations
- [[R-XC-004-build-must-be-green]] — auth migration must not break the build mid-flight

## Sources of truth

1. `memory/feedback_frontend_auth_identity_service.md` — explicit 2026-04-18 user correction
2. `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Security-Architecture.md`
3. `C:\Falcon\CLAUDE.md` — "Platform Architecture" + "Key Architecture Rules"
