---
type: protocol
cluster: 20-brain-maintenance
purpose: "Answers 'how does the brain stay fresh over weeks/months + what does every session owe back to the brain at end-of-task'. Open at start of session (to know obligations) and end of session (to discharge them)."
audience: all AI agents + humans working in Falcon
---

# MEMORY-GROW-PROTOCOL — keep the brain fresh

> [!tldr]
> The brain is only valuable if it stays current. This protocol codifies the **maintenance contract** every Falcon session implicitly carries: read the brain at start, contribute back at end. Without it, the brain degrades into a stale snapshot that future sessions stop trusting.

## The contract — every session owes the brain

| Phase | Obligation | Cost | Skip-if |
|---|---|---|---|
| **Start** | Read `0-MASTER-INDEX.md` + `VERIFICATION-STATUS.md` | ~30s | Never (enforced by SessionStart hook) |
| **During** | Source-prefix every Falcon fact in output | inline | Never (convention violation if not) |
| **At fork** | Consult `DECISION-PROTOCOL.md`; halt-and-flag if no rule | ~1min/fork | If trivial cosmetic + conservative default applies |
| **End** | Add a 1-line summary to relevant `memory/project_*.md` + pointer in `MEMORY.md` index | ~2min | If session changed NOTHING substantive |

The maintenance cost: ~3 minutes per substantive session. The maintenance benefit: every future session inherits what this session learned.

## End-of-task obligations (the "memory-grow")

When you finish a substantive task — port · build · audit · refactor · spike · bug fix — append to memory BEFORE marking the task done.

### What counts as a "memory-worthy" finding

✅ **Memory-worthy:**
- New pattern discovered (e.g., "comms-hub mgmt-side reads `session.tenantId || session.client_id` — confirm this in copy playbook")
- Drift between code and dataset claim (e.g., "BR-CGM-09 says X but backend handler does Y")
- A workspace-state trap (e.g., "40+ Stencil compile errors block nx serve on host-shell — see VERIFICATION-STATUS")
- A successful workaround for a known blocker
- A correction to a dataset claim that was wrong
- A new gap discovered (`Q-` numbered)
- A new clean port done that proves the recipe works

❌ **NOT memory-worthy:**
- Trivial syntactic fixes that don't reveal a pattern
- One-off bugs without systemic implication
- Personal preferences that aren't team rules
- Implementation details that the file itself already captures
- Anything redundant with existing memory

### How to write the entry

Format:

```markdown
- [filename.md](filename.md) — **🟢/🟡/🔴 STATUS (YYYY-MM-DD)** One sentence summary of what changed/landed/discovered. **Trigger**: `<phrase>` to resume work or reload context.
```

Add it to `MEMORY.md` at the top of the relevant section (Platform Knowledge · Session Management · Feedback).

If the entry is substantive (50+ chars to summarize), create a dedicated `project_<topic>_YYYY_MM_DD.md` file and pointer-link from MEMORY.md.

### Memory anti-patterns

❌ **DO NOT** create a new memory entry for every micro-task — bloats the index and reduces signal-to-noise.
❌ **DO NOT** copy-paste from existing entries — link them instead.
❌ **DO NOT** write memory entries that contradict existing ones without reconciling — call out the conflict explicitly.
❌ **DO NOT** put runtime status in memory without runtime evidence — that's what VERIFICATION-STATUS.md is for.

## Start-of-session obligations (the "brain-pull")

The SessionStart hook auto-prints the brain summary, but the AI must ACT on it. Specifically:

1. **Notice the auto-loaded MEMORY.md index** — scan for recent entries (last 5 days) relevant to the task
2. **Open `0-MASTER-INDEX.md`** before any code-level work — even if "you remember" the dataset, the brain may have changed
3. **Check `VERIFICATION-STATUS.md`** — never claim runtime status for a structurally-checked claim
4. **Run `/brain-grounded`** if the task is non-trivial and you haven't read the brain in 7+ turns

## Per-cluster maintenance schedules

Different clusters need different refresh cadences:

| Cluster | Refresh trigger | Tool |
|---|---|---|
| `01-roles/` | `BuiltInRoleCatalog.cs` changes | Auto-detected by scanner (Phase 0) |
| `03-pes-keys/` | `falcon-access.registry.ts` changes | Scanner (Phase 0) |
| `04-feature-parity-matrix/` | New feature added / removed | Scanner watches `app.routes.ts` (Phase 1) |
| `06-validation-by-feature/` | V-rule note changes in Brain SK | Scanner (Phase 2 § 06) |
| `08-entity-drift-by-feature/` | E-* entity note changes | Scanner (Phase 2 § 08) |
| `13-error-catalog/` | New error code in `FalconKeys.Error.*` | Manual + audit script |
| `14-flow-playbook-integration/` | New flow playbook added | Manual + audit script |
| `15-implementation-pitfalls/` | New anti-pattern observed | Manual (humans observe, AI doesn't) |
| `18-a-to-z-traces/` | New feature gets full trace | Manual (Option 1 work) |
| `MEMORY.md` | Every substantive task | Manual (this protocol) |

The scanner handles the watched-file forks automatically. Everything else needs a human or scheduled AI to refresh.

## Weekly maintenance ritual

Run this once a week (or after a burst of changes):

```powershell
# 1. Check for drift
.\falcon-wiki\scripts\scan-authority.ps1 -CheckOnly

# 2. Run brain audit (see brain-audit.ps1 in this folder)
.\Brain Outputs\datasets\authority-dataset\20-brain-maintenance\brain-audit.ps1

# 3. Review the audit report at:
#    Brain Outputs/datasets/authority-dataset/_runtime-verification/brain-audit-<date>.md

# 4. Fix any health issues the audit surfaces
#    - Stale `verified-at:` (90+ days old)
#    - Missing `purpose:` fields
#    - Broken wikilinks
#    - Memory entries with no corresponding cluster

# 5. Mark scanner clean after fixes
.\falcon-wiki\scripts\scan-authority.ps1 -MarkChecked
```

## Brain growth signals (positive)

The brain is growing healthily when:
- New `project_*.md` memory entries appear weekly (steady learning rate)
- Scanner stays clean except for intentional drift events (controlled change)
- Verification-gate question count grows alongside cluster count (verifiable claims)
- `[INFERRED]` ratio in AI outputs decreases over time (more facts get cited)
- Pitfalls catalogue grows when new bugs surface and stays stable when they don't (selective)

## Brain decay signals (negative)

Watch for these — they mean maintenance is slipping:
- 🔴 Memory entries reference files that no longer exist
- 🔴 Multiple memory entries describe the same fact with different details
- 🔴 Scanner stays in drift state for >7 days
- 🔴 `verified-at:` frontmatter is uniformly >90 days old
- 🔴 New code in Falcon doesn't show up in any dataset cluster
- 🔴 AI sessions cite memory entries that contradict newer code

The `brain-audit.ps1` script in this folder detects most of these automatically.

## Cross-references

- `brain-audit.ps1` (same folder) — the weekly health script
- `0-MASTER-INDEX.md` — what the brain knows
- `VERIFICATION-STATUS.md` — what's verified vs not
- `falcon-wiki/scripts/scan-authority.ps1` — code-source drift detection
- `19-night-shift-readiness/_INDEX.md` — protocols that depend on brain freshness
- `MEMORY.md` (in `.claude/projects/.../memory/`) — the index file every session reads
