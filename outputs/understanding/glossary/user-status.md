*** Glossary — User Status ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# User Status

## English
- **Definition:** The lifecycle state of a User. Backend enum `eUserStatus`: `Active | Pending | Locked | Suspended | Deleted`. Transitions: `Pending → Active → {Suspended, Locked, Deleted}`; `Locked → Pending` (manual reset); `Deleted → Active` (Falcon usertype only).

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-02 · `Brain Outputs/prd/modules/02-user-management/ENTITIES.md:36` (status enum)
- Secondary: PRD-02 ENTITIES.md (UserStatusHistory audit trail)

## Related PRD
- [[02 User Management]]

## Related entity
- [[E-user]] · `UserStatusHistory` (append-only audit row)

## Related backend service
- [[Identity Service]]

## Related concepts
- See also: [[User]] · [[Session]] · [[OTP Challenge]] · [[Role]]

## Common confusions
- **`Locked` ≠ `Suspended`** — Locked = automatic (failed login lockout); Suspended = manual admin action.
- **`Deleted` is reversible by Falcon** — not a hard delete. Only Falcon usertype can resurrect.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
