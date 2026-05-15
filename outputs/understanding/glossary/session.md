*** Glossary — Session ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# Session

## English
- **Definition:** A live authenticated session for a User. Carries id, userId, `ipAtLogin`, `createdAt`, `lastActivityAt`, `idleTimeoutAt` (createdAt + 30 min), and the bound refresh-token id. State: `Active → Expired` (on logout, idle timeout, or forced sign-out).

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-02 · `Brain Outputs/prd/modules/02-user-management/ENTITIES.md:13` (Session row)
- Secondary: PRD-02 ENTITIES.md `LoginAttempt` (audit)

## Related PRD
- [[02 User Management]]

## Related backend service
- [[Identity Service]]

## Related concepts
- See also: [[User]] · [[User Status]] · [[OTP Challenge]] · [[IP Allowlist]] · [[Zitadel]]

## Common confusions
- **Idle timeout** is 30 minutes from `createdAt` per PRD — confirm if this is sliding (refresh on activity) or fixed (PRD says "createdAt + 30 min" which reads as fixed).

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
