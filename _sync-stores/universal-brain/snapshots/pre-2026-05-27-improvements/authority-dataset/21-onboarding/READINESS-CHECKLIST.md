---
type: checklist
cluster: 21-onboarding
verified-at: 2026-05-16
purpose: "Answers '12 yes/no gates I must pass before touching code'. Read once per session before any substantive work; the SessionStart hook prints a similar but shorter banner."
---

# READINESS-CHECKLIST - 12 gates per session

> [!tldr]
> Twelve yes/no gates. All 12 must be Y before you write code. Whitebox version of what the SessionStart banner reminds you of. ~3 minutes to walk through; saves hours of bad code grounded in stale assumptions.

## The 12 gates

| # | Gate | What "Y" means |
|---|---|---|
| 1 | I have read `0-MASTER-INDEX.md` in the current session | I can route a question to the right cluster without searching |
| 2 | I have read `VERIFICATION-STATUS.md` in the current session | I know what's runtime-verified vs structurally-checked |
| 3 | I am NOT claiming runtime status for a structurally-checked fact | No "tested" / "validated" / "shipped" without runtime evidence |
| 4 | I know which kingdom (admin / mgmt) my change affects | sys-* vs acc-* role; admin-console vs management-console |
| 5 | I know which PES keys my change touches | Listed by name, not "permissions" |
| 6 | I know which V-rules my change crosses | Listed by id (V-AC-01 etc.) or N/A justified |
| 7 | I know which BR-* my change is bound by | Listed by id or N/A justified |
| 8 | I know which entity drift items apply (E-*) | PRD label vs backend prop vs FE label |
| 9 | I have consulted the right flow playbook (if user-action) | Brain SK folder or single-file flow listed |
| 10 | I have identified the relevant 15-implementation-pitfalls entries | At least 1 pitfall named, or "none apply" justified |
| 11 | I have a visual target (if UI) | Old-UI / PRD wireframe / component default / flagged-INFERRED |
| 12 | I will source-prefix every Falcon fact in output | `[CODE]/[BRAIN-OUT]/[VAULT]/[BRAIN-SK]/[MEMORY]/[INFERRED]` |

## What to do if a gate is N

| Gate fails | Action |
|---|---|
| 1, 2 | Read them now (~2min total) |
| 3 | Downgrade your claim language |
| 4, 5 | Open `04-feature-parity-matrix/` + `03-pes-keys/` |
| 6 | Open `06-validation-by-feature/` |
| 7 | Open `09-business-rules-by-feature/` |
| 8 | Open `08-entity-drift-by-feature/` |
| 9 | Open `Brain SK/_obsidian/00-Home/IMPLEMENTATION_KNOWLEDGE_MAP.md` |
| 10 | Open `15-implementation-pitfalls/_INDEX.md` |
| 11 | Open old-UI dataset at `Brain Outputs\datasets\old-ui-dataset\` |
| 12 | Convention violation - the rule applies regardless |

## Special cases

| Task type | Special readiness |
|---|---|
| Pure docs / typo | Gates 1, 2, 12 only |
| Refactor (no behavior change) | All 12 + extra: existing test coverage |
| New feature (greenfield) | All 12 + SPEC-PROTOCOL §SPEC.md drafted |
| Port (copy admin->mgmt) | All 12 + the 12-step copy playbook |
| Bug fix | All 12 + reproduction documented |

## Speedrun (~30 seconds)

If you're impatient and the change is small:

> Read MASTER-INDEX + VERIFICATION-STATUS once per day. Before each substantive edit, mentally tick: kingdom? PES? V-rules? BR? E-*? pitfall? visual? source-prefix? If any "no", stop and read.

## See also

- [ONBOARDING-PROTOCOL.md](ONBOARDING-PROTOCOL.md) - getting these 12 to be automatic
- [PR-TEMPLATE.md](PR-TEMPLATE.md) - the PR-level enforcement
- `20-brain-maintenance/MEMORY-GROW-PROTOCOL.md` - per-session obligations
- SessionStart hook banner (auto-printed) - condensed version of this
