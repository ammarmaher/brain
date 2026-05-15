*** Error code — IpNotAllowed ***
*** Catalogued 2026-05-15 by Brain SK Phase 3D ***

# `FalconKeys.Error.IpNotAllowed`

## Throwing service(s)
- [[Identity Service]] — `IpAllowlistPreProcessor` runs before authentication handlers
- [[Commerce Service]] — same code surfaces here for non-login operations (`InvalidIpAddress` is the Commerce-specific variant)

## HTTP status
- **403** Forbidden

## Scenario
- The caller's IP is not in the tenant's IP allowlist. PRD-01 BR-AM-10 and PRD-02 BR-UM-24 define this gate; tenant settings store the allowed CIDR list, cached in Redis (`tenant:<tenantId>:ipAllowlist:v1`).

## UX handling
- **Banner** at login: "Your IP address is not allowed for this account." Login form disabled.

## Related V-rule
- [[V-account-ip-allowlist-enforcement]]

## Related E-* entity
- `E-TenantSettings` · `E-Account`

## Related flow playbook
- (Login flow + Tenant IP-allowlist settings flow — playbooks pending)

## Hubs
- [[ERROR_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]]
