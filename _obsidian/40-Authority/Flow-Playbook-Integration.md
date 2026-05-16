---
type: moc
cluster: 40-Authority
title: Flow Playbook Integration — 4 flows × authority lens
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\14-flow-playbook-integration\
verified-at: 2026-05-16
purpose: "Answers 'who can run each of the 4 org-hierarchy flows + which V-rules, entities, BR-* rules, errors, Kafka events apply'. Open when implementing any flow playbook."
---

> [!tldr]
> 4 existing flow playbooks (Add Client / Add User / Add Node / Edit Node) indexed against authority: roles · V-rules · entities · BR-* · status transitions · error codes · Kafka events.

# Flow Playbook Integration

## The 4 flows

| Flow | Allowed roles | Steps |
|---|---|---|
| Add Client | sys-admin · sys-products | 5 wizard steps |
| Add User | sys-admin · sys-products · sys-ops · acc-owner · acc-admin | 3 wizard tabs |
| Add Node | sys-admin · sys-products · sys-ops · acc-owner · acc-admin | inline |
| Edit Node | same as Add Node | inline + scheduled rename |

## Critical findings

- **Three-actor Add User paths** produce three different role-grant rules (matrix in MATRIX.md)
- **Username 30 vs 100 drift** appears across all 4 flows
- **PasswordSecurityLevel vocabulary drift** (Normal/Advanced vs Low/Medium/High/Strict) — Q-UM-12
- **Add Client Step 5 partial-failure trap** — Account persisted before Identity hop

## Drill into Brain Outputs

- `C:\Falcon\Brain Outputs\datasets\authority-dataset\14-flow-playbook-integration\MATRIX.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\14-flow-playbook-integration\Add-Client.integration.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\14-flow-playbook-integration\Add-User.integration.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\14-flow-playbook-integration\Add-Node-and-Edit-Node.integration.md`

## Upstream playbooks
- `C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy\Add Client\` (folder, 17 files)
- `C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy\flows\Add User.md`
- `C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy\flows\Add Node.md`
- `C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy\flows\Edit Node.md`

## See also
- [[Capability-sys-admin]] · [[Capability-acc-owner]] · [[Validation-by-Feature]] · [[Error-Catalog]]
