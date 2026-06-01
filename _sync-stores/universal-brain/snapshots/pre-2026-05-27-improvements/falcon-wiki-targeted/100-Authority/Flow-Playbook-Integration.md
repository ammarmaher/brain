---
type: moc
cluster: 100-Authority
title: Flow Playbook Integration — 4 flows × authority lens
projection-source: _mounts/brain-outputs/datasets/authority-dataset/14-flow-playbook-integration/
verified-at: 2026-05-16
purpose: "Answers 'who can run each of the 4 org-hierarchy flows + which V-rules, entities, BR-* rules, errors, Kafka events apply'. Open when implementing any flow playbook."
---

> [!tldr]
> The 4 existing flow playbooks (Add Client · Add User · Add Node · Edit Node) indexed against the authority lens. For each: which roles can run it, which V-rules apply, which entities it consumes, which BR-* rules govern it, which status transitions fire, which error codes surface, which Kafka events emit.

# Flow Playbook Integration

## The 4 flows

| Flow | Trigger | Allowed roles | Steps | PRD |
|---|---|---|---|---|
| **Add Client** | Org-hierarchy "Add Client" button | sys-admin · sys-products | 5 wizard steps | PRD-01 |
| **Add User** | Org-hierarchy "Add User" button | sys-admin · sys-products · sys-ops · acc-owner · acc-admin (scope-varying) | 3 wizard tabs | PRD-02 |
| **Add Node** | Org-hierarchy "Add Sub-Node" button | sys-admin · sys-products · sys-ops · acc-owner · acc-admin | inline | PRD-01 |
| **Edit Node** | Org-hierarchy "Edit Node" action | same as Add Node | inline + scheduled rename | PRD-01 |

## Three-actor-path clarification (Add User)

The Add User wizard's Tab 2 Role dropdown is populated from `POST /pes/authorize/resources` (not a static client-side enum). The dropdown contents depend on the actor:

| Actor | Can grant which roles? |
|---|---|
| sys-admin · sys-products | Any role (any sys-* or any acc-*) |
| sys-ops | Own role + all acc-* |
| acc-owner | All acc-* (one acc-owner per tenant rule — BR-UM-03) |
| acc-admin | Only acc-admin + acc-user (cannot promote to acc-owner) |
| acc-user | Cannot add users at all |

## Critical drift surfaced across all 4 flows

- **Username 30 vs 100 cap** — PRD BR-UM-12 says 30, backend FluentValidation says 100 → FE must enforce 30
- **PasswordSecurityLevel vocabulary** — PRD `Normal/Advanced` vs backend `Low/Medium/High/Strict` (Q-UM-12)

## Add Client Step 5 partial-failure trap

Account is persisted server-side **before** the Identity hop fires. If Identity creation fails, you have an orphan Account record. FE must surface: "Account created but Account Owner creation failed — contact support" and preserve wizard state for retry.

## Drill into Brain Outputs

- [MATRIX](../_mounts/brain-outputs/datasets/authority-dataset/14-flow-playbook-integration/MATRIX.md) — 4 flows × authority columns
- [Add Client integration](../_mounts/brain-outputs/datasets/authority-dataset/14-flow-playbook-integration/Add-Client.integration.md) — 5-step × authority cross-cut
- [Add User integration](../_mounts/brain-outputs/datasets/authority-dataset/14-flow-playbook-integration/Add-User.integration.md) — 3-tab × authority cross-cut
- [Add Node + Edit Node integration](../_mounts/brain-outputs/datasets/authority-dataset/14-flow-playbook-integration/Add-Node-and-Edit-Node.integration.md)

## Upstream playbooks (in Brain Outputs)

- [Add Client folder](../_mounts/brain-outputs/understanding/pages/organization-hierarchy/Add%20Client/) — 17 files
- [Add User flow](../_mounts/brain-outputs/understanding/pages/organization-hierarchy/flows/Add%20User.md)
- [Add Node flow](../_mounts/brain-outputs/understanding/pages/organization-hierarchy/flows/Add%20Node.md)
- [Edit Node flow](../_mounts/brain-outputs/understanding/pages/organization-hierarchy/flows/Edit%20Node.md)

## See also

- [[Capability-sys-admin]] · [[Capability-acc-owner]] — who can run what
- [[Validation-by-Feature]] — which V-rules each flow uses
- [[Entity-Drift-by-Feature]] — which DTOs each flow touches
- [[Business-Rules-by-Feature]] — BR-* coverage per flow
- [[Error-Catalog]] — error codes that surface per flow
