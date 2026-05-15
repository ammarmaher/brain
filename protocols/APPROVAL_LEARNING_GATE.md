# Approval Learning Gate

Do not store random one-off details as approved memory.

Learning flow:

```text
Task solved → Ammar approves → extract reusable pattern → update registry/memory → auto-push brain repo
```

Unapproved results may be saved as pending notes, but must not become approved pattern memory.

## Page Learning System — two-mode rule

Brain SK runs a Page Learning System on every page under `C:\Falcon\Brain Outputs\understanding\pages\<page-name>\`. Two modes:

### Light Learning Intake (automatic)

Runs on every prompt, screenshot, bug note, red X, green tick, validation rule, API rule, business rule, UI/UX correction. It:

- Saves evidence under `evidence/<learningId>/`.
- Writes an event with status `pending` to `LIGHT_LEARNING_EVENTS.md`.
- If a rule emerged, drafts a `pending` entry in `PENDING_PAGE_PATTERNS.md`.
- Appends an entry to `EVIDENCE_INDEX.md`.

It NEVER:

- approves a rule
- modifies an approved rule
- promotes a rule globally
- mutates `PAGE_SCORECARD.md`
- commits or pushes

### Deep Page Learning (explicit only)

Runs ONLY when Ammar explicitly says one of:

- `deep learn this page`
- `update vault`
- `approve this pattern`
- `promote this globally`
- `learn this page`

It walks pending events with Ammar and applies the action Ammar names per item:

| Action | Effect |
|---|---|
| approve | move to `APPROVED_PAGE_PATTERNS.md` AND the matching domain file (`UI_UX_RULES.md`, `VALIDATION_RULES.md`, `API_RULES.md`, `BUSINESS_RULES.md`) |
| reject | move to `REJECTED_PAGE_PATTERNS.md` with reason |
| promote globally | additionally append to the matching file under `Brain Outputs/understanding/frontend/patterns/` |
| deprecate | mark approved entry as deprecated; preserve history |

It recomputes `PAGE_SCORECARD.md` from APPROVED files only, appends an audit entry to `LEARNING_CHANGE_HISTORY.md`, and updates Obsidian indexes additively.

## Hard rules

- Nothing becomes approved automatically.
- Nothing becomes global automatically.
- Page-specific rules stay page-specific unless Ammar says `promote this globally`.
- Never promote one-off hacks to global patterns.
- Screenshot annotations (red border, ❌, ✅) propose status but never set it — Ammar's words set status.
- Scorecards score APPROVED entries only.
- Any scorecard dimension < 60 % → `NEEDS ATTENTION`.
- Mirror to the brain repo is additive only — no `robocopy /MIR`, no `/PURGE`.
- No commits or pushes without Ammar saying `commit` / `push` in the current message.

## Canonical skill

[`domains/frontend/page-learning/SKILL.md`](../domains/frontend/page-learning/SKILL.md)
