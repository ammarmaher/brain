---
type: moc
cluster: 100-Authority
title: Copy Playbook — admin → mgmt feature port
projection-source: _mounts/brain-outputs/datasets/authority-dataset/11-copy-playbook/
verified-at: 2026-05-16
purpose: "Answers 'what are the 12 steps for porting a Shared-with-config-flip feature admin → mgmt + when to stop/cherry-pick'. Open before starting any cross-console port."
---

> [!tldr]
> The 12-step recipe for porting a feature from admin-console to management-console. Extended from the 11-step MATRIX recipe with a new Step 10 covering Phase 2 validation rewiring. Only applies to `Shared with config-flip` features — Falcon-only features stop at Step 0.

# Copy Playbook

## When does this apply?

| Feature class | What to do |
|---|---|
| Shared with config-flip | ✅ Run the full 12-step recipe |
| Falcon-mostly | ⚠ Cherry-pick — copy shared parts, drop Falcon-only sub-features (e.g. Master Wallet card) |
| Falcon-only | ❌ STOP — feature isn't portable (e.g. testing-charging) |
| Client-only authoring | n/a — already mgmt-side |

## The 12 steps (high-level)

1. Copy file tree
2. Rename Angular selectors
3. **Namespace flip** — `FalconAccess.adminConsole.X` → `FalconAccess.managementConsole.X` (see `namespace-flip.checklist.md`)
4. **Gateway flip** — `Gateway.SystemGateway` → `Gateway.CoreGateway` (see `gateway-flip.checklist.md`)
5. **DTO enrichment** — mgmt typically adds UI hint fields (see `dto-divergence.catalog.md`)
6. **Endpoint suffix** — some mgmt endpoints append `/visible/details` (see `endpoint-suffix.catalog.md`)
7. **Session-based account id** — `session.tenantId || session.client_id` (see `session-binding.checklist.md`)
8. Remove Falcon-only sub-features (Master Wallet, cross-account picker, Add Client wizard)
9. Add route to `app.routes.ts` with `data.access` set to mgmt PES key
10. **Rewire validation** — review cross-field rules tied to admin-only state (NEW — Phase 2)
11. Reseed PES if new `acc.*` resources introduced
12. Verify against per-role capability table (`05-capability-maps/<role>.capability.md`)

## Worked examples

- **comms-hub** — full 12-step walkthrough citing actual `comms-hub.compare.md:line` diffs
- **marketplace-applications** — smaller walkthrough showing the difference in non-PES gate strategy

## Drill into Brain Outputs

- [Main playbook](../_mounts/brain-outputs/datasets/authority-dataset/11-copy-playbook/copy-admin-feature-to-mgmt.md)
- [Namespace flip checklist](../_mounts/brain-outputs/datasets/authority-dataset/11-copy-playbook/namespace-flip.checklist.md)
- [Gateway flip checklist](../_mounts/brain-outputs/datasets/authority-dataset/11-copy-playbook/gateway-flip.checklist.md)
- [DTO divergence catalog](../_mounts/brain-outputs/datasets/authority-dataset/11-copy-playbook/dto-divergence.catalog.md)
- [Endpoint suffix catalog](../_mounts/brain-outputs/datasets/authority-dataset/11-copy-playbook/endpoint-suffix.catalog.md)
- [Session binding checklist](../_mounts/brain-outputs/datasets/authority-dataset/11-copy-playbook/session-binding.checklist.md)
- [_INDEX](../_mounts/brain-outputs/datasets/authority-dataset/11-copy-playbook/_INDEX.md)

## See also

- [[Falcon-vs-Client]] — feature classification
- [[Capability-acc-owner]] · [[Capability-acc-admin]] · [[Capability-acc-user]] — verification targets (Step 12)
- [[Validation-by-Feature]] — Step 10 lookup
- [[Non-PES-Gates-by-Feature]] — what gate changes during port
- [[Auto-Sync]] — Phase 5 catches drift in source files between Phases
