*** Validation V-account-ip-allowlist-enforcement — IP allowlist gate at gateway ***
*** Origin: PRD-01 Account Management · Backend: Commerce (source) + Identity (enforcer) · 2026-05-15 ***

# V-account-ip-allowlist-enforcement — Requests outside the Allowed-IPs list are rejected before credentials are checked

> Per-account Network Access is enforced via an HTTP-header IP value. Requests missing the header, missing the value, or carrying an IP not on the account's allowlist are rejected before any credential or business check runs. The rejection is intentionally generic to avoid leaking whether the credentials were correct (BR-UM-24).

## Origin (PRD)

- **PRD:** [[01 Account Management]] (owns the allowlist data) + [[02 User Management]] (specifies the ordering in login flow)
- **Source files:**
  - [BUSINESS_RULES (PRD-01)](../../../Brain%20Outputs/prd/modules/01-account-management/BUSINESS_RULES.md) — BR-AM-10
  - [BUSINESS_RULES (PRD-02)](../../../Brain%20Outputs/prd/modules/02-user-management/BUSINESS_RULES.md) — BR-UM-24
- **Rule ids:** `BR-AM-10` + `BR-UM-24`
- **PRD line reference:**
  - "Network Access uses an Allowed-IPs list, enforced via an agreed HTTP header parameter. Requests missing the header, missing the value, or with an IP not on the list are rejected." (`latest-prd.md:44`, PRD-01)
  - "IP check runs **before** credentials check; reject is generic to avoid leaking whether credentials are right." (`latest-prd.md:71`, PRD-02)
- **Excel cell:** none (PRD prose only)
- **Workflow context:** First Login (W2 step 2) + Regular Login (W3) + Forgot Password (W4 step 2) — IP check is the first gate after username/phone identity entry.

## Backend enforcement

- **Owning service:** [[Commerce Service]] — owns the allowlist source-of-truth (`commerce.tenant-ip-allowlist-changed.v1` Kafka topic + `GET /Security/ip-allowlists` east-west endpoint)
- **Enforcing service:** [[Identity Service]] — runs the actual gate at the auth boundary
- **Mechanism:** FastEndpoints pre-processor `IpAllowlistPreProcessor<TRequest>` at `Endpoints/Auth/PreProcessors/IpAllowlistPreProcessor.cs`
  - Resolves tenant id via `IIpAllowlistProtected.TenantResolutionStrategy` (`ByUsername` / `BySessionId`)
  - Looks up Redis-cached allowlist (sourced from Commerce via Kafka)
  - Rejects mismatched IP with HTTP 403
- **Applied to:** all `/auth/*` endpoints (login, verify-otp, refresh-token, forgot-password, etc.)
- **Error codes:**
  - `FalconKeys.Error.IpNotAllowed` (403, Identity) — IP outside allowlist
  - `FalconKeys.Error.InvalidIpAddress` (403, Commerce) — malformed IP value at the data layer
- **Source files:**
  - [VALIDATIONS (Identity)](../../../Brain%20Outputs/understanding/backend/identity/VALIDATIONS.md) — Pre-Processors section
  - [ERRORS (Identity)](../../../Brain%20Outputs/understanding/backend/identity/ERRORS.md) — IP Allowlist Errors section
  - [ERRORS (Commerce)](../../../Brain%20Outputs/understanding/backend/commerce/ERRORS.md) — 403 section
  - [DTO_DICTIONARY (Commerce)](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md) — `GetAllIpAllowlistsResponse` (east-west contract Identity reads)

## Frontend implementation hint

- **Form / page section:** No client-side input validates this — it's enforced at the gateway / pre-processor on every `/auth/*` request. **Frontend never short-circuits IP-allowlist locally** (would leak the allowlist).
- **Admin edit surface:** [[Organization Hierarchy]] `settings-ip-management` section — list/add/remove IPs in Account Settings (admin flow). Form path **inferred** under the Settings tab edit mode.
- **Suggested validator wiring (admin edit form, NOT login):**
  - For each IP row: `Validators.pattern(/^\d{1,3}(\.\d{1,3}){3}(\/\d{1,2})?$/)` IPv4 with optional CIDR suffix (or IPv6 equivalent if backend supports — confirm)
  - Server returns `InvalidIpAddress` (403) on malformed value at save
- **Login form behavior:** show generic "Login failed" message on 403 `IpNotAllowed` — DO NOT differentiate from `InvalidCredentials` (would defeat the enumeration-leak protection in BR-UM-24)
- **Page note:** [[Organization Hierarchy]] — `settings-ip-management` section is already listed in the page note

## Cross-domain links

- **Permission gate:** [[Falcon Roles Permission Matrix]] — IP allowlist edit is Falcon-only on Root/Main (per Permission sheet — verify exact rows)
- **Business rule cluster:**
  - [[01 Account Management]] BR-AM-10 (source) ↔ [[02 User Management]] BR-UM-24 (enforce-before-credentials)
  - Cross-references W2 step 2 + W3 step 1 + W4 step 2 in PRD-02 [WORKFLOWS](../../../Brain%20Outputs/prd/modules/02-user-management/WORKFLOWS.md)
- **Related learning events:** none yet

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
