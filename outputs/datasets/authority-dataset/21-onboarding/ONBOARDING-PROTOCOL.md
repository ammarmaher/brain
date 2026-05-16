---
type: protocol
cluster: 21-onboarding
verified-at: 2026-05-16
purpose: "Answers 'I am brand new to Falcon (or returning after a long break) - what do I read, in what order, to be productive in <1 day'. Open once on the first session, then archive."
---

# ONBOARDING-PROTOCOL - Zero to brain-grounded in 5 steps

> [!tldr]
> Five 15-30 minute steps. End state: you can answer the 8 grounding questions, you know what every cluster is for, you have run the audit, and you have made one successful brain-grounded change end-to-end. ~3 hours total.

## Audience

| You are | Use this protocol |
|---|---|
| New human contributor | Day 1, before opening any source file |
| Fresh AI session opened on Falcon for the first time | Right after SessionStart hook fires |
| Returning after >30 days | Use as a refresher; skip steps you already mastered |
| Cross-team rotation (e.g. backend dev now doing FE) | Skip Step 1; jump to Step 2 + 3 for the new domain |

## The 5 steps

### Step 1 - Topology (30min, read-only)

Goal: know what exists, where it lives, and which agent owns what.

| Read | Why |
|---|---|
| `C:\Falcon\CLAUDE.md` | Adnan + Ammar agent roster + project routing rules |
| `Brain Outputs\datasets\authority-dataset\0-MASTER-INDEX.md` | The router across 7 knowledge stores |
| `Brain Outputs\datasets\authority-dataset\VERIFICATION-STATUS.md` | What's runtime-verified vs structurally-checked |
| `falcon-wiki\Conventions.md` | File naming, frontmatter schema, relation direction |
| `falcon-wiki\Glossary.md` | Domain vocabulary - PES vs PEP vs PEM, sys-* vs acc-* |

**Verification**: can you name (a) the 6 built-in roles (b) the 2 kingdoms (c) the 8 backend services?

### Step 2 - Authority (45min, read + skim)

Goal: understand what the brain knows about Falcon-vs-Client.

| Read | Why |
|---|---|
| `01-roles/_INDEX.md` + skim 1 sys-* + 1 acc-* note | Role catalog shape |
| `03-pes-keys/_INDEX.md` + grep for 3 keys you'll touch | PES key registry |
| `04-feature-parity-matrix/_INDEX.md` | At-a-glance kingdom map |
| `05-capability-maps/_INDEX.md` + 1 feature you care about | Capability table per role |
| `15-implementation-pitfalls/_INDEX.md` (full read) | The traps; saves 2 days of debugging |
| `18-a-to-z-traces/Add-Client.trace.md` (full read) | Exemplar A->Z for 18 layers |

**Verification**: pick a random feature; can you list (a) the gating PES keys (b) the V-rules (c) the entity drift (d) the BR-* rules?

### Step 3 - Protocols (30min, read)

Goal: know what to do when you hit a fork.

| Read | Why |
|---|---|
| `19-night-shift-readiness/SPEC-PROTOCOL.md` | How to turn prose into a falsifiable spec |
| `19-night-shift-readiness/DECISION-PROTOCOL.md` | 25 forks x 6 classes + halt-and-flag triggers |
| `19-night-shift-readiness/VISUAL-TARGETS/_INDEX.md` | Visual fidelity hierarchy |
| `19-night-shift-readiness/NIGHT-SHIFT-LOOP.md` | The 4-gate automated verification loop |
| `20-brain-maintenance/MEMORY-GROW-PROTOCOL.md` | What every session owes the brain |
| `Brain SK\CLAUDE.md` | Brain SK skill entry + 6 task-routing modes |

**Verification**: a teammate hands you "port Add User from admin to mgmt" - can you produce a SPEC.md + decision-log scaffold + verification plan without writing code?

### Step 4 - Tools (30min, run)

Goal: hands-on with the daily-driver tools.

| Run | Expected outcome |
|---|---|
| `powershell ... brain-audit.ps1` | Report at `_runtime-verification\brain-audit-<date>.md` |
| `powershell ... scan-authority.ps1 -CheckOnly` | Clean or "drift detected" output |
| `/brain-grounded` | 3 random verification questions you can answer |
| Read `MEMORY.md` index in `.claude\projects\C--Falcon\memory\` | See the shape of past learnings |
| Read `Brain Outputs\strategies\falcon-component-creation\01-CANONICAL_PATTERN.md` | Wizard/drawer/shared-component folder shape |

**Verification**: can you describe (a) what each script tells you (b) what the source-prefix tags mean (c) what an "INFERRED" claim looks like?

### Step 5 - First change (60-90min, end-to-end)

Goal: ship a tiny brain-grounded change end-to-end so the loop is muscle-memory.

Pick a starter task:
- Fix a typo in a flow playbook (uses Brain SK, not code)
- Add a missing PES key alias to `03-pes-keys/`
- Bump `verified-at:` on a cluster after re-reading it
- Reduce one `[INFERRED]` claim somewhere by tracing the actual source

Do it the canonical way:
1. **Read relevant brain artefacts first** - source-prefix the facts you'll use
2. **Edit** - small, atomic
3. **Source-prefix the PR** per [PR-TEMPLATE](PR-TEMPLATE.md)
4. **Add memory entry** per MEMORY-GROW-PROTOCOL if substantive
5. **Run brain-audit** - confirm zero new findings

**Verification**: open the PR template, fill every section honestly, get one teammate's review.

## After onboarding

You're done when:
- You can answer the [READINESS-CHECKLIST](READINESS-CHECKLIST.md) without lookup
- You can navigate from a feature name -> its 6 authority lenses without index
- You know which Ammar agent owns which project
- Source-prefixing facts is automatic, not effortful

## Cross-references

- [PR-TEMPLATE.md](PR-TEMPLATE.md) - what every PR needs after this
- [READINESS-CHECKLIST.md](READINESS-CHECKLIST.md) - the 12 gates per session
- `19-night-shift-readiness/_INDEX.md` - night-shift readiness gate (advanced)
- `16-trigger-phrase-index/_INDEX.md` - shortcut commands you'll use daily
