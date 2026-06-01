*** Login — Section: IP Allowlist enforcement ***
*** 2026-05-18 ***

# Login — IP Allowlist

> [PRD] BR-UM-24: "IP check runs BEFORE credentials check; reject is generic to avoid leaking whether credentials are right."

## Backend processor

[BRAIN-OUT] `IpAllowlistPreProcessor` runs on every `/api/auth/*` endpoint (per ENDPOINT_REGISTRY notes "pass through IpAllowlistPreProcessor for IP allowlist enforcement keyed by username or session id").

## Per-tenant allowlist

Each tenant's allowed IPs are stored in `Account.Settings.AllowedIPs` (set at Add Client wizard Step 2 or later).

Login flow:
1. Request arrives with `req.RemoteIp`.
2. Pre-processor resolves tenant from username (or sessionId for OTP).
3. Checks if `RemoteIp ∈ tenant.AllowedIPs`.
4. If miss → return generic error (no info leak).
5. If hit → proceed to credentials check.

## Special case — Falcon users

[INFERRED] Falcon usertype may have no tenant-level allowlist (their tenant is "falcon-system"). Allowlist may apply system-wide for Falcon admins.

## FE handling

FE shows the same generic error regardless of IP-block vs wrong-password (per BR-UM-24).

[CODE] common error message: "Incorrect username or password."

## See also

- [01-PERMISSIONS](01-PERMISSIONS.md) · [02-STAGE_1_GET_STARTED](02-STAGE_1_GET_STARTED.md) · [12-ERROR_STATES](12-ERROR_STATES.md)
