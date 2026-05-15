*** Glossary — Session ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Session

## English
- **Definition:** A live authenticated session for a User. Carries id, userId, `ipAtLogin`, `createdAt`, `lastActivityAt`, `idleTimeoutAt` (createdAt + 30 min), refresh-token id. State: `Active → Expired`.

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-02 · [ENTITIES.md](../../../Brain%20Outputs/prd/modules/02-user-management/ENTITIES.md)
- Secondary: LoginAttempt audit

## Related PRD
- [[02 User Management]]

## Related backend service
- [[Identity Service]]

## Related concepts
- See also: [[User]] · [[User Status]] · [[OTP Challenge]] · [[IP Allowlist]] · [[Zitadel]]

## Common confusions
- Idle timeout reads as fixed 30-min from createdAt — verify if sliding.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
