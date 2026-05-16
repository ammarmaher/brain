---
type: moc
cluster: 40-Authority
role: authority-dataset-entry
audience: developers + ai-agents
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\
verified-at: 2026-05-16
verified-by: Jakco orchestrator (Phase 0+1+2+4)
purpose: "Answers 'how to navigate the 40-Authority vault cluster + which note answers which authority question'. Open at session start as the entry MOC."
---

> [!tldr]
> Map of Content for the **Falcon vs Client authority dataset**. 6 atomic roles (3 Falcon staff · 3 Client tenant), 47 PES keys, 7 features compared admin↔mgmt, 9 status enums. **Phase 2 landed**: 6 per-role capability maps + 4 cross-cut matrices (V-rules · entity drift · business rules · non-PES gates). Brain Outputs at `Brain Outputs/datasets/authority-dataset/` is the source of truth — this vault is the graph layer.

> [!warning] 🚨 READ BEFORE TRUSTING ANY CLAIM AS RUNTIME TRUTH
> The dataset is **structurally complete** + **PES backend gate runtime-verified (21/21 PASS)** + **FE-level UI gate still 🔴 BLOCKED**. Open [[Verification-Status]] for the honest accounting.

> [!tip] 🧭 NEW SESSION? START HERE
> The single entry point for ALL Falcon knowledge across 7 stores: **[[Master-Index]]** — answers "where is every piece of Falcon knowledge + which trigger phrase loads it" with a full routing table.

> [!tip] 🌙 NIGHT-SHIFT MODE? READ THIS FIRST
> Autonomous AI runs need 4 protocols (SPEC · DECISION · VISUAL · LOOP) + a 5-check readiness gate before any unsupervised work. **[[Night-Shift-Readiness]]** has the protocols, the 25-fork catalog, the visual fidelity hierarchy, and the 4-gate verification loop script.

# 40-Authority MOC

## Quick navigate (Phase 0+1)

| Want to know… | Open |
|---|---|
| Who are the 6 roles + what each one can do? | [[Roles]] |
| Falcon-only vs Client-only vs Shared features? | [[Falcon-vs-Client]] |
| Every PES key in the platform? | [[PES-Keys]] |
| Status enum for User / Service / Contract / Account-Creation? | [[Statuses]] |
| Test user credentials + login curl? | [[Test-Users]] |
| How does the JWT carry the policy subject? | [[Session-Shape]] |

## Quick navigate (Phase 2 — capability + validation + drift + business rules + non-PES gates)

| Want to know… | Open |
|---|---|
| Full action inventory per role? | [[Capability-sys-admin]] · [[Capability-sys-ops]] · [[Capability-sys-products]] · [[Capability-acc-owner]] · [[Capability-acc-admin]] · [[Capability-acc-user]] |
| Which V-rules apply to feature F + drift watch? | [[Validation-by-Feature]] |
| Which entity drifts hit me on feature F? | [[Entity-Drift-by-Feature]] |
| What business rules govern feature F? | [[Business-Rules-by-Feature]] |
| What non-PES gates hide UI on feature F? | [[Non-PES-Gates-by-Feature]] |

## Quick navigate (Phase 3 + Phase 5)

| Want to know… | Open |
|---|---|
| How do I port a feature admin → mgmt? | [[Copy-Playbook]] (12-step recipe + 6 checklists) |
| How does drift detection work? Which files are watched? | [[Auto-Sync]] (67-file scanner + pre-push hook) |

## Quick navigate (Clusters 13-16 — supplemental)

| Want to know… | Open |
|---|---|
| Every error code + the FE error contract? | [[Error-Catalog]] (~130 codes × 7 services × 10 HTTP statuses) |
| How does each flow playbook integrate with the authority lens? | [[Flow-Playbook-Integration]] (4 flows × roles · V-rules · entities · BR · errors · Kafka) |
| What pitfalls + anti-patterns should I watch for? | [[Implementation-Pitfalls]] (25 pitfalls + 13 anti-patterns + cheat sheet) |
| Every trigger phrase that auto-loads dataset context? | [[Trigger-Phrases]] (~45 phrases × 9 categories) |

## Quick navigate (Clusters 18, 20, 21 — per-feature + maintenance + onboarding)

| Want to know… | Open |
|---|---|
| Complete A→Z picture of ONE feature (18 layers)? | [[A-to-Z-Traces]] (4 traces: Add Client · Add User · Add Node · Edit Node) |
| What does every session owe the brain + how to audit health? | [[Brain-Maintenance]] (MEMORY-GROW-PROTOCOL + brain-audit.ps1) |
| I'm new to Falcon — what do I read in what order? | [[Onboarding]] (5-step protocol + 12-gate checklist + PR template) |

## Source-of-truth boundary

- **Brain Outputs** at `C:\Falcon\Brain Outputs\datasets\authority-dataset\` — writable, the SoT.
- **This vault note set** — graph navigation only. Edit the SoT, not these notes.

## Drill into Brain Outputs

| File | Content |
|---|---|
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\00-INDEX.md` | Entry point + phase status |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\00-VERIFICATION-GATE.md` | 15 questions the dataset must answer |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\01-roles\` | One atomic note per role |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\02-statuses\` | Status enums |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\03-pes-keys\REGISTRY-RAW.md` | The full 47-key registry |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\04-feature-parity-matrix\MATRIX.md` | The master feature grid |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\05-capability-maps\` | 6 per-role action inventories (Phase 2) |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\06-validation-by-feature\MATRIX.md` | 25 V-rules × 7 features (Phase 2) |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\07-cross-cutting\` | Gateway / session / test users / permission-sheet gaps |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\08-entity-drift-by-feature\MATRIX.md` | 15 entities × 7 features (Phase 2) |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\09-business-rules-by-feature\MATRIX.md` | 180 BR-* × 7 features (Phase 2) |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\10-non-pes-gates-by-feature\MATRIX.md` | 6 gate types × 7 features (Phase 2) |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\11-copy-playbook\` | 12-step copy recipe + 6 checklists (Phase 3) |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\12-auto-sync\` | Drift scanner + pre-push hook (Phase 5) |
| `C:\Falcon\falcon-wiki\scripts\` | PowerShell scanner + git hook + INSTALL.md + drift template (Phase 5 — now watches 67 files incl. 4 flow playbooks) |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\13-error-catalog\` | ~130 error codes catalog + FE contract |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\14-flow-playbook-integration\` | 4 flows × authority lens MATRIX + per-flow integration files |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\15-implementation-pitfalls\` | 25 pitfalls + 13 anti-patterns + cheat sheet |
| `C:\Falcon\Brain Outputs\datasets\authority-dataset\16-trigger-phrases\` | ~45 trigger phrases × 9 categories |

## Cross-references in this vault

- `12-Permissions/` — sister cluster (per-page permission notes)
- `00-Home/IMPLEMENTATION_KNOWLEDGE_MAP.md` — top-of-session entry
- `30-Validation/` — V-rules per form field

## Cross-references in the sister vault (falcon-wiki)

- `falcon-wiki/100-Authority/` — mirror of this cluster
- `falcon-wiki/00-MOCs/Authorization-Security-MOC.md` — auth-model overview
- `falcon-wiki/00-MOCs/Local-Test-Users.md` — operational note
- `falcon-wiki/00-MOCs/Local-Auth-Recipe.md` — login curl
- `falcon-wiki/00-MOCs/PES-Subject-Contract.md` — the `u:<JWT.sub>@<ns>` rule
