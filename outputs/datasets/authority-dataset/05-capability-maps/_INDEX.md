---
type: index
cluster: 05-capability-maps
purpose: "Answers 'which per-role capability maps exist + how to look up role × action × verdict for any role'. Open to navigate to a specific role's full capability table."
---

# Per-Role Capability Maps — Index

> [!tldr]
> Six atomic capability maps — one per role. Each is a ~60-row table of (page × action × PES key × verdict) with code-source citations. Answers "what's the full inventory of what role X can do?" in one lookup.

## The 6 files

| Role | Namespace | Console | File | Rows |
|---|---|---|---|---|
| `sys-admin` | system | admin-console | [[sys-admin.capability]] | ~67 |
| `sys-ops` | system | admin-console | [[sys-ops.capability]] | ~67 |
| `sys-products` | system | admin-console | [[sys-products.capability]] | ~67 |
| `acc-owner` | tenant | management-console | [[acc-owner.capability]] | ~62 |
| `acc-admin` | tenant | management-console | [[acc-admin.capability]] | ~60 |
| `acc-user` | tenant | management-console | [[acc-user.capability]] | ~60 |

## Each file contains

1. Identity card (5-row summary)
2. Master capability table (page × action × PES key × verdict, ~60 rows)
3. Action highlights (unique powers · explicit denies · no-rule silent denies)
4. Role-edit reach (which roles this role can promote/demote)
5. Cross-references

## Verdict legend

- ✅ allow — PES `p`-rule grants this action
- ❌ explicit deny — PES `p`-rule explicitly blocks this action
- — silent deny — no `p`-rule defined (out-of-namespace or intentionally missing)
- ✅ own-only — allow with expression `r.obj.createdby == r.sub.userid`

## See also

- [[../01-roles/_INDEX]] — atomic role notes (the inputs)
- [[../03-pes-keys/REGISTRY-RAW]] — the 47 PES key universe
- [[../04-feature-parity-matrix/MATRIX]] — feature classification
- [[../00-VERIFICATION-GATE]] — Q15 ("For acc-admin, what's the full action inventory") answered here
