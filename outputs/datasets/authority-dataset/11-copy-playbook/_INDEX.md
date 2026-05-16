---
type: index
cluster: 11-copy-playbook
title: The Copy Playbook — Admin → Mgmt Feature Port Recipe
purpose: "Answers 'which files in the copy playbook cluster exist + which step each one supports'. Open to navigate to the right checklist/catalog file for a given port-recipe step."
extracted: 2026-05-16
---

# Cluster · `11-copy-playbook` — Porting Features from Admin to Mgmt

> [!tldr]
> A practical 12-step recipe for porting a `Shared with config-flip` feature from `apps/admin-console/.../<feature>/` to `apps/management-console/.../<feature>/`. Each step is grounded in observed patterns from the 7 feature compares in [`../04-feature-parity-matrix/`](../04-feature-parity-matrix/). Use this cluster as the **first** reference when planning any cross-console port.

## File index

| File | Purpose | When to use |
|---|---|---|
| [`copy-admin-feature-to-mgmt.md`](copy-admin-feature-to-mgmt.md) | The main 12-step recipe with worked examples (comms-hub + marketplace-applications) | Start here for any port |
| [`namespace-flip.checklist.md`](namespace-flip.checklist.md) | Search/replace patterns for `FalconAccess.adminConsole.*` → `FalconAccess.managementConsole.*` | Step 3 of the recipe |
| [`gateway-flip.checklist.md`](gateway-flip.checklist.md) | `Gateway.SystemGateway` → `Gateway.CoreGateway` + override-handling for `Gateway.ChargingGateway` / `Gateway.IdentityGateway` | Step 4 of the recipe |
| [`dto-divergence.catalog.md`](dto-divergence.catalog.md) | Per-feature UI-hint field additions that mgmt-side DTOs typically carry | Step 5 of the recipe |
| [`endpoint-suffix.catalog.md`](endpoint-suffix.catalog.md) | `/visible` / `/visible/details` URL-suffix variants for mgmt list endpoints | Step 6 of the recipe |
| [`session-binding.checklist.md`](session-binding.checklist.md) | The `session.tenantId \|\| session.client_id` pattern + node-id sourcing | Step 7 of the recipe |

## When to use this playbook

The 7 features in [`../04-feature-parity-matrix/MATRIX.md`](../04-feature-parity-matrix/MATRIX.md) fall into **4 classes**. Each class needs different handling:

| Class | Examples | Recipe applies? |
|---|---|---|
| **Shared with config-flip** | `comms-hub`, `marketplace-applications`, `organization-hierarchy` (view/tabs) | ✅ Full 12-step recipe |
| **Shared with Client enrichment** | `comms-hub` (mgmt-side adds child stubs + enriched DTO) | ✅ Full recipe + extra DTO work (see [`dto-divergence.catalog.md`](dto-divergence.catalog.md)) |
| **Falcon-mostly** | `wallet-balance-management`, `contracts-cost-management` | ⚠️ Cherry-pick steps — copy shared parts, drop Falcon-only sub-features (Master Wallet card, wallet-strategy edit, contract wizard, etc.) |
| **Falcon-only** | `testing-charging`; the Add Client wizard inside `organization-hierarchy` | ❌ STOP — feature is not portable. Security boundary (`testing-charging` mutates real OCS state) or by-design authority asymmetry (clients don't create clients). |
| **Client-only** | `contact-groups` create/edit/delete/share | ⚠️ Recipe runs in **reverse direction** — admin side is the subset; going admin → mgmt means **adding** the wizard, not stripping. See [`../04-feature-parity-matrix/contact-groups.compare.md`](../04-feature-parity-matrix/contact-groups.compare.md) — "Direction is unusual here: admin-side is the subset". |

## Cross-references

- **Phase 1 — feature parity master** : [`../04-feature-parity-matrix/MATRIX.md`](../04-feature-parity-matrix/MATRIX.md). Read this BEFORE the playbook so you know which class your feature is in.
- **Phase 1 — per-feature compares** : `../04-feature-parity-matrix/<feature>.compare.md` (7 files). The recipe quotes diffs from these files repeatedly.
- **Phase 1 — capability maps** : [`../05-capability-maps/`](../05-capability-maps/) — per-role × action tables for verification (Step 12).
- **Phase 2 — non-PES gates** : [`../10-non-pes-gates-by-feature/MATRIX.md`](../10-non-pes-gates-by-feature/MATRIX.md). Re-evaluate session-type / node-type / tab-visibility / composite gates during the port (Step 10).
- **Phase 2 — V-rule applicability** : [`../06-validation-by-feature/MATRIX.md`](../06-validation-by-feature/MATRIX.md). Validation rewiring (Step 10).
- **Phase 2 — entity drift** : [`../08-entity-drift-by-feature/MATRIX.md`](../08-entity-drift-by-feature/MATRIX.md). DTO enrichment context (Step 5).
- **Verification gate** : [`../00-VERIFICATION-GATE.md`](../00-VERIFICATION-GATE.md) — 10 questions the port must answer when complete.

## How this cluster was built

Source-of-truth for every pattern is `[CODE]` citations in the 6 feature compare notes (`comms-hub.compare.md`, `marketplace-applications.compare.md`, `wallet-balance-management.compare.md`, `contracts-cost-management.compare.md`, `contact-groups.compare.md`, plus the `organization-hierarchy` notes referenced indirectly) and `[BRAIN-OUT]` references to `old-ui-dataset/10-pages/management-console/_diffs/<feature>.diff.md`. No pattern in this cluster is speculative — each cites at least one feature where it was observed.
