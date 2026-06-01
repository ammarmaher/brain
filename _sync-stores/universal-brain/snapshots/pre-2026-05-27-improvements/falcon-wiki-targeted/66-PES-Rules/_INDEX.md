---
type: moc
role: cluster-index
cluster: pes-rules
updated: 2026-05-14
---

> [!tldr]
> Projection cluster for PES (Permission Enforcement System) rules — roles × actions × pages. Owned by Brain SK skill `pes-permission-analysis`. Source of truth lives in Brain Outputs per page.

# PES / Authorization Rules

## How PES is structured in Brain Outputs
PES rules are NOT a separate file per page yet — they currently live inside each page's:
- `PAGE_OVERVIEW.md` (the "Who is supposed to use this page" + capabilities table)
- `BUSINESS_RULES.md` (role-conditional rules)
- `Brain SK/registries/PES_PERMISSION_MATRIX.md` (global matrix)

## To get full PES projection
The `pes-permission-analysis` skill needs to be **run per page** to emit a dedicated `PES_RULES.md`. The skill exists but hasn't generated per-page outputs yet.

## Trigger the skill
Tell the Brain SK agent: `analyze PES for <page-name>` — produces `Brain Outputs/understanding/pages/<page>/PES_RULES.md`. Then re-run the scanner.

## Currently known PES surfaces
- **Global matrix:** `_mounts/brain-sk/registries/PES_PERMISSION_MATRIX.md`
- **Per-page PES (when generated):** `_mounts/brain-outputs/understanding/pages/<page>/PES_RULES.md`
- **Authorization in code:** `_mounts/services/falcon-core-identity-svc/` (Identity owns the policy engine)

## Known gap (open from prior session)
On Organization Hierarchy: "Restricted users — most tabs hidden / read-only based on PES permissions (NOT yet wired)" — see `Brain Outputs/understanding/pages/organization-hierarchy/PAGE_OVERVIEW.md`.
