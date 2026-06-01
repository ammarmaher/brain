---
type: moc
cluster: 100-Authority
title: Brain Maintenance — how the dataset stays fresh + how to prove it
projection-source: _mounts/brain-outputs/datasets/authority-dataset/20-brain-maintenance/
verified-at: 2026-05-16
purpose: "Answers 'what does every session owe the brain at start + end + how do I prove the brain is still healthy'. Open at session start/end + once per week."
---

> [!tldr]
> The authority dataset only stays valuable if it stays current. Two artefacts close that gap: a maintenance contract every session implicitly carries, and a health-audit script that proves the contract is being honored.

# Brain Maintenance

## The maintenance contract (per session)

| Phase | Obligation | Cost | Skip-if |
|---|---|---|---|
| **Start** | Read [[Master-Index]] + [[Verification-Status]] | ~30s | Never (SessionStart hook enforces) |
| **During** | Source-prefix every Falcon fact in output | inline | Never (convention violation) |
| **At fork** | Consult `DECISION-PROTOCOL`; halt-and-flag if no rule | ~1min | Trivial cosmetic + conservative default applies |
| **End** | Add 1-line memory entry if substantive | ~2min | Session changed NOTHING substantive |

Total: ~3 min/session. Total benefit: every future session inherits what this one learned.

## Memory-worthy vs not

✅ **Memory-worthy:**
- New pattern discovered (e.g. session.tenantId fallback)
- Drift between code and dataset claim
- Workspace-state trap (e.g. Stencil compile errors)
- Successful workaround for a known blocker
- Correction to a dataset claim that was wrong
- New gap discovered (Q-* numbered)
- New clean port that proves the recipe

❌ **NOT memory-worthy:**
- Trivial syntactic fixes
- One-off bugs without systemic implication
- Personal preferences
- Implementation details the file already captures
- Anything redundant with existing memory

## Weekly audit

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File ".\Brain Outputs\datasets\authority-dataset\20-brain-maintenance\brain-audit.ps1"
```

**Exit codes:** 0=GREEN, 1=YELLOW (warnings), 2=RED (critical).

**Checks 6 things:**
1. Stale `verified-at:` (>90 days)
2. Missing `purpose:` frontmatter
3. Broken wikilinks in vault projections
4. Orphan memory entries (reference deleted clusters)
5. Missing cluster `_INDEX.md`
6. Scanner state freshness

**Reports written to:** `Brain Outputs/datasets/authority-dataset/_runtime-verification/brain-audit-<date>.md`

## Per-cluster refresh schedules

| Cluster | Refresh trigger | Tool |
|---|---|---|
| `01-roles/` | `BuiltInRoleCatalog.cs` changes | Auto-detected by scanner |
| `03-pes-keys/` | `falcon-access.registry.ts` changes | Scanner |
| `04-feature-parity-matrix/` | New feature added/removed | Scanner watches routes |
| `06-validation-by-feature/` | V-rule note changes in Brain SK | Scanner |
| `08-entity-drift-by-feature/` | E-* entity note changes | Scanner |
| `13-error-catalog/` | New error code | Manual + audit |
| `14-flow-playbook-integration/` | New flow playbook | Manual + audit |
| `15-implementation-pitfalls/` | New anti-pattern observed | Manual (humans observe) |
| `18-a-to-z-traces/` | New feature gets full trace | Manual |
| `MEMORY.md` | Every substantive task | Manual (the protocol) |

## Brain growth signals (healthy)

- New `project_*.md` memory entries appear weekly
- Scanner stays clean except for intentional drift
- Verification-gate question count grows alongside cluster count
- `[INFERRED]` ratio in AI outputs decreases over time
- Pitfalls catalogue grows when new bugs surface, stable otherwise

## Brain decay signals (degrading — watch for these)

- 🔴 Memory entries reference files that no longer exist
- 🔴 Multiple memory entries describe same fact with different details
- 🔴 Scanner stays in drift state >7 days
- 🔴 `verified-at:` uniformly >90 days old
- 🔴 New code doesn't show up in any cluster
- 🔴 AI sessions cite memory entries that contradict newer code

The audit script detects most automatically.

## Drill into Brain Outputs

- [MEMORY-GROW-PROTOCOL](../_mounts/brain-outputs/datasets/authority-dataset/20-brain-maintenance/MEMORY-GROW-PROTOCOL.md) — the full contract
- `brain-audit.ps1` — the audit script
- [_INDEX](../_mounts/brain-outputs/datasets/authority-dataset/20-brain-maintenance/_INDEX.md) — cluster entry

## See also

- [[Master-Index]] — what the brain knows
- [[Verification-Status]] — what's verified vs not
- [[Night-Shift-Readiness]] — protocols that depend on freshness
- [[Onboarding]] — first-day path that flows into this maintenance
- [[Auto-Sync]] — Gate 2 implementation (scanner)
