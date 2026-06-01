---
type: template
cluster: 21-onboarding
verified-at: 2026-05-16
purpose: "Answers 'what does every Falcon PR description need to prove the change is brain-grounded'. Copy-paste at the top of every PR."
---

# PR-TEMPLATE - Brain-grounding declaration for every PR

> [!tldr]
> Every Falcon PR (Azure DevOps or otherwise) MUST carry this template. The 5 sections force the author to declare what they read, what rules applied, what they decided at forks, what was inferred, and what they did NOT verify. Reviewers reject PRs that ship without it.

## Copy-paste this into every PR description

```markdown
## What this PR changes

<one-sentence outcome from the user's perspective>

## Brain artefacts consulted

- [ ] `0-MASTER-INDEX.md` (always)
- [ ] `VERIFICATION-STATUS.md` (always)
- [ ] `01-roles/<role>.md` for affected role(s): __________
- [ ] `03-pes-keys/<feature>-pes.md` for affected PES key(s): __________
- [ ] `04-feature-parity-matrix/<feature>-compare.md` for: __________
- [ ] `05-capability-maps/<role>.md` for: __________
- [ ] `06-validation-by-feature/<feature>-validations.md` for V-rules: __________
- [ ] `08-entity-drift-by-feature/<feature>-entities.md` for E-* drift: __________
- [ ] `09-business-rules-by-feature/<feature>-rules.md` for BR-*: __________
- [ ] `10-other-gates-by-feature/<feature>-gates.md` for non-PES gates
- [ ] `13-error-catalog/` for error codes touched
- [ ] `14-flow-playbook-integration/<flow>-authority.md` for full flow context
- [ ] `15-implementation-pitfalls/_INDEX.md` (always for any code change)
- [ ] `18-a-to-z-traces/<feature>.trace.md` (if porting/copying a feature)
- [ ] Brain SK flow playbook(s): __________
- [ ] Code refs (file:line): __________

## Source-prefix audit (paste 3 random facts)

Fact 1: `[?]` __________
Fact 2: `[?]` __________
Fact 3: `[?]` __________

(Tags: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[MEMORY]` `[INFERRED]` - anything `[INFERRED]` MUST have a flag in the change description.)

## Decisions at forks

(One row per fork hit during the change. Empty if trivially deterministic.)

| Fork | Class (A-F) | Resolution | Source |
|---|---|---|---|
| | | | |

(If any fork escalated halt-and-flag - this PR should not exist yet. Open a _pending-question first.)

## Did NOT verify

(Explicit list of things this PR did NOT touch / did NOT runtime-test. Honest gaps reviewers can scrutinise.)

- __________
- __________

## Memory-grow

- [ ] If substantive, added 1-line entry to `MEMORY.md` index at: __________
- [ ] If new pattern / drift / workaround discovered, created `project_*.md`: __________
- [ ] Reason this was/was not memory-worthy per MEMORY-GROW-PROTOCOL: __________

## Verification

- [ ] `brain-audit.ps1` shows no new findings
- [ ] `scan-authority.ps1 -CheckOnly` clean (or drift documented)
- [ ] Build green: ______ (paste nx project + status)
- [ ] PES backend verified for affected role/key (if any): ______
- [ ] No new `[INFERRED]` claims unflagged
```

## Why each section exists

| Section | Defends against |
|---|---|
| Brain artefacts consulted | "I forgot the PRD says X" - forces you to LOOK |
| Source-prefix audit | "I made it up" - forces you to declare sources |
| Decisions at forks | "Why did you pick A over B?" - logged before merge |
| Did NOT verify | "I assumed this works" - explicit unknowns |
| Memory-grow | "We learned this last month" - knowledge stays |
| Verification | "Looks good to me" replaced with provable signals |

## Mandatory rules

1. **Never merge a PR without this template**, even one-line typo PRs (those still need Section 1 + 2)
2. **`[INFERRED]` facts must be flagged** in the change description, not silently in code comments
3. **Halt-and-flag forks cannot merge** - open a `_pending-question/` first
4. **Memory-grow is per-author** - reviewers can't add memory for you

## See also

- [ONBOARDING-PROTOCOL.md](ONBOARDING-PROTOCOL.md) - how to be ready to fill this template
- [READINESS-CHECKLIST.md](READINESS-CHECKLIST.md) - the per-session gates
- `20-brain-maintenance/MEMORY-GROW-PROTOCOL.md` - the contract this enforces
- `19-night-shift-readiness/DECISION-PROTOCOL.md` - where fork classes come from
