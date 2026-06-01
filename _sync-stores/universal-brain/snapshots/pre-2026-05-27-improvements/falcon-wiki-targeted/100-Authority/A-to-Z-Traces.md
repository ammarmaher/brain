---
type: moc
cluster: 100-Authority
title: A-to-Z Traces — per-feature 18-layer implementation walkthroughs
projection-source: _mounts/brain-outputs/datasets/authority-dataset/18-a-to-z-traces/
verified-at: 2026-05-16
purpose: "Answers 'I need the COMPLETE picture of feature F — business intent → PRD → PES → V-rules → BR → entities → backend → frontend → tests → port → capability'. Open when implementing or auditing a single feature end-to-end."
---

> [!tldr]
> Per-feature A→Z traces — each walks one Falcon feature through 18 implementation layers, every fact source-prefixed. Cross-cuts (`Validation-by-Feature`, `Business-Rules-by-Feature`, etc.) slice the platform by one axis; traces slice by feature and gather all axes for ONE flow into one document.

# A-to-Z Traces

## Available traces (4/8)

| Feature | Status | Lines | Brain Outputs |
|---|---|---|---|
| Add Client wizard | 🟢 EXEMPLAR | 1029 | [Add-Client.trace](../_mounts/brain-outputs/datasets/authority-dataset/18-a-to-z-traces/Add-Client.trace.md) |
| Add User wizard | 🟢 COMPLETE | 1041 | [Add-User.trace](../_mounts/brain-outputs/datasets/authority-dataset/18-a-to-z-traces/Add-User.trace.md) |
| Add Node | 🟢 COMPLETE | 899 | [Add-Node.trace](../_mounts/brain-outputs/datasets/authority-dataset/18-a-to-z-traces/Add-Node.trace.md) |
| Edit Node | 🟢 COMPLETE | 979 | [Edit-Node.trace](../_mounts/brain-outputs/datasets/authority-dataset/18-a-to-z-traces/Edit-Node.trace.md) |
| Create Contact Group wizard | 🟡 TODO | — | (not yet authored) |
| Add Contract wizard | 🟡 TODO | — | (not yet authored) |
| Transfer Balance | 🟡 TODO | — | (not yet authored) |
| Do Payment (CommChannel) | 🟡 TODO | — | (not yet authored) |

## The 18-layer model

Every trace covers these layers in this order — each is uniquely determined by the one above.

| # | Layer | Question it answers |
|---|---|---|
| 1 | Business intent | What user need does this serve? |
| 2 | PRD requirement | Which PRD lines authorize this flow? |
| 3 | Permission gate | Who can run it (role × resource × action)? |
| 4 | BR-* business rules | What cross-field / workflow rules apply? |
| 5 | V-rules per step | What field-level validation rules govern each step? |
| 6 | E-* entity drift | Which entities does this create + drift items? |
| 7 | Backend DTOs | Composite request shape + `[ThrowIf*]` attributes |
| 8 | Backend endpoint + handler | Route + controller + handler flow |
| 9 | FluentValidator + handler-time gate | What runs server-side after `[ThrowIf*]`? |
| 10 | Kafka events | What downstream events fire on success? |
| 11 | Error codes | Every `FalconKeys.Error.*` that can surface |
| 12 | FE route + PES gate | Route path + `data.access` + `FalconAccess.*` key |
| 13 | FE components | Falcon UI Core components used per step |
| 14 | FE form + state | NgForm/FormGroup + wizard state machine |
| 15 | FE i18n keys | Translation keys (en + ar resolutions) |
| 16 | Test case (Gherkin) | 5+ scenarios with realistic assertions |
| 17 | Port artifact | Where it lives in admin-console; does it port to mgmt? |
| 18 | Capability map per role | 6 roles × can-run verdict |

## Trace highlights

| Trace | Key insight |
|---|---|
| Add Client | 5-step wizard, 1 composite POST → 7 entities, 4 Kafka fanout events, 2/6 roles can run |
| Add User | Most-cited trace (170 cites), 5/6 roles can run, dual-actor paths (FU + AO/AU) |
| Add Node | Single-dialog 2-field flow, 5/6 roles, Kafka emission UNVERIFIED |
| Edit Node | Most-granular PES gate in dataset — per-field PES keys, `acc-admin` field-level asymmetry uncovered |

## How to use

| You are | Read trace as |
|---|---|
| Implementing a feature | Front-to-back; layer 16 → your acceptance test |
| Auditing compliance | Layer 18 → trace back to authorizing layer 4 or 2 |
| AI agent picking up a task | Front-to-back ground; answer the 8 verification questions |
| Porting admin → mgmt | Layer 17 + the 12-step copy playbook |

## See also

- [[Master-Index]] — knowledge router
- [[Validation-by-Feature]] — V-rule cross-cut
- [[Business-Rules-by-Feature]] — BR-* cross-cut
- [[Entity-Drift-by-Feature]] — E-* cross-cut
- [[Error-Catalog]] — error-code cross-cut
- [[Capability-sys-admin]] — capability cross-cut
- [[Flow-Playbook-Integration]] — authority-lens per-flow
