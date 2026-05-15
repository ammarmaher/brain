*** Glossary — Zitadel ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Zitadel

## English
- **Definition:** The third-party OAuth2/OIDC identity provider that Falcon uses for authentication primitives. Issues tokens, hosts users + tenants. Frontend NEVER calls Zitadel directly — all auth flows go through the Falcon Identity Service which fronts Zitadel and adds Falcon-specific lifecycle, claims, and policy.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: `falcon-wiki/Glossary.md:46`
- Secondary: `MEMORY.md` (feedback_frontend_auth_identity_service)

## Related PRD
- [[02 User Management]] (User lifecycle binds to Zitadel)

## Related backend service
- [[Identity Service]] (fronts Zitadel)

## Related concepts
- See also: [[Tenant]] · [[User]] · [[Session]] · [[OTP Challenge]] · [[Falcon]]

## Common confusions
- **Zitadel ↔ Identity Service** — Zitadel is the *external* OAuth provider. Identity Service is the *Falcon-owned* service that fronts Zitadel.
- **HARD RULE:** Frontend NEVER calls Zitadel directly. All auth goes through Identity Service (`auth.falconhub.space/api/`).

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
