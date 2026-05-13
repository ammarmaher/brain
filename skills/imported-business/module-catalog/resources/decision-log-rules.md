*** Decision Log Rules — module-catalog ***
*** ADR-style rules for modules/<slug>/decisions.md ***

# Decision Log Rules

## Format

Every decision is one Markdown block with this exact shape:

```markdown
## D-YYYY-MM-DD-<seq> — <Short title>

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Superseded by D-... | Deprecated
**Context:** <one paragraph>
**Decision:** <one paragraph — what we chose>
**Alternatives considered:**
- <Option A> — rejected because <reason>
- <Option B> — rejected because <reason>
**Consequences:** <one paragraph — implications, trade-offs>
**Links:** PRD §, Wiki, code commit, related decisions
```

## Decision ID

`D-<date>-<seq>` where `<seq>` is a 2-digit number for that day:
- First decision on 2026-04-30: `D-2026-04-30-01`
- Second: `D-2026-04-30-02`

IDs never reused or reordered.

## When to record

- Architecture choices (which service owns X)
- Trade-offs that someone might second-guess
- "Why didn't we do Y?" questions
- Anything that took more than 30 minutes of debate

## When NOT to record

- Routine implementation details
- Choices documented elsewhere (Wiki, PRD)
- Reversible decisions made in 5 minutes

## Superseding

When a later decision overturns an earlier one:
- New decision: `Status: Accepted`, links back to old decision
- Old decision: `Status: Superseded by D-...`, do NOT delete

## Validation

A decision is valid only if all 6 fields (Date, Status, Context, Decision, Alternatives, Consequences) are present and non-empty.
