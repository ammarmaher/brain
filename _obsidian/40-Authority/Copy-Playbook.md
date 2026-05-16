---
type: moc
cluster: 40-Authority
title: Copy Playbook — admin → mgmt feature port
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\11-copy-playbook\
verified-at: 2026-05-16
purpose: "Answers 'what are the 12 steps for porting a Shared-with-config-flip feature admin → mgmt + when to stop/cherry-pick'. Open before starting any cross-console port."
---

> [!tldr]
> 12-step recipe for porting a feature admin → mgmt. Phase 2 added Step 10 (validation rewiring). Applies only to `Shared with config-flip` features.

# Copy Playbook

## When does this apply?

| Feature class | Action |
|---|---|
| Shared with config-flip | ✅ Full 12-step recipe |
| Falcon-mostly | ⚠ Cherry-pick (drop Falcon-only sub-features) |
| Falcon-only | ❌ STOP — not portable |

## The 12 steps

1. Copy file tree
2. Rename Angular selectors
3. **Namespace flip** — `adminConsole.X` → `managementConsole.X`
4. **Gateway flip** — `SystemGateway` → `CoreGateway`
5. **DTO enrichment** — mgmt adds UI hint fields
6. **Endpoint suffix** — `/visible/details` variants
7. **Session-based account id** — `session.tenantId || session.client_id`
8. Remove Falcon-only sub-features
9. Add route with `data.access`
10. **Rewire validation** (NEW — Phase 2)
11. Reseed PES if new `acc.*` resources
12. Verify against per-role capability table

## Drill into Brain Outputs

- `C:\Falcon\Brain Outputs\datasets\authority-dataset\11-copy-playbook\copy-admin-feature-to-mgmt.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\11-copy-playbook\namespace-flip.checklist.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\11-copy-playbook\gateway-flip.checklist.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\11-copy-playbook\dto-divergence.catalog.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\11-copy-playbook\endpoint-suffix.catalog.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\11-copy-playbook\session-binding.checklist.md`

## See also

- [[Falcon-vs-Client]] · [[Validation-by-Feature]] · [[Non-PES-Gates-by-Feature]] · [[Auto-Sync]]
- [[Capability-acc-owner]] · [[Capability-acc-admin]] · [[Capability-acc-user]] — Step 12 verification targets
