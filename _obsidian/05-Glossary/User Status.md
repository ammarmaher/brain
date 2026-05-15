*** Glossary — User Status ***
*** Canonical Falcon vocabulary · 2026-05-15 ***

# User Status

## English
- **Definition:** The lifecycle state of a User. Backend enum `eUserStatus`: `Active | Pending | Locked | Suspended | Deleted`. Transitions: `Pending → Active → {Suspended, Locked, Deleted}`; `Locked → Pending` (manual); `Deleted → Active` (Falcon-only).

## Arabic
- **Term:** Not captured in available sources — surface gap
- **Definition:** Not captured in available sources — surface gap

## Source citation
- Primary: PRD-02 · [ENTITIES.md](../../../Brain%20Outputs/prd/modules/02-user-management/ENTITIES.md) status enum
- Secondary: UserStatusHistory audit

## Related PRD
- [[02 User Management]]

## Related entity
- [[E-user]]

## Related backend service
- [[Identity Service]]

## Related concepts
- See also: [[User]] · [[Session]] · [[OTP Challenge]] · [[Role]]

## Common confusions
- **Locked ≠ Suspended** — Locked = automatic; Suspended = manual.
- **Deleted is reversible by Falcon** — not a hard delete.

## Hubs
- [[GLOSSARY_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
