# Brain SK — Full-Stack Domain · PR Review

This is the full-stack domain entry point for **PR review governance**. It links to
the canonical skill and registers the review chain for full-stack pull requests.

**Canonical skill:** [`skills/pr-review-governance/SKILL.md`](../../../skills/pr-review-governance/SKILL.md)

## When to use

Route here whenever Ammar asks to review a pull request, branch, or pre-merge
implementation that spans frontend + backend (or when the domain is unclear).
Frontend-only or backend-only PRs still use the same canonical skill — see the
domain notes in `domains/frontend/SKILL.md` and `domains/backend/SKILL.md`.

Trigger phrases: `review this PR` · `check this pull request` · `review teammate
work` · `inspect branch changes` · `compare branch with main` · `validate PR
against PRD/wiki` · `check if this implementation is correct` · `review before
merge`.

## Full-stack PR review chain

1. Identify PR scope (source/target branch, changed files, affected domains).
2. Load knowledge per the canonical knowledge load order — `understanding/frontend/`
   + `understanding/backend/<service>/` + `understanding/integration/` +
   `understanding/pages/<page>/`.
3. Run the 10-step PR review process from the canonical skill.
4. Classify every finding P0–P3.
5. Produce the 6 review docs under
   `Brain Outputs/reports/pr-reviews/<PR-or-branch>-<YYYY-MM-DD>/`.
6. Update `_obsidian/PR_REVIEW_INDEX.md`.
7. Additive output sync + safe Git sync.

## Hard rules

- Review-only — never edit implementation code.
- Source-of-truth order: diff → codebase → wiki → PRD → backend/API → page learning
  → component knowledge → registries → best practice.
- Decision is mechanical: any P0 → `BLOCK_MERGE`; any unresolved P1 →
  `REQUEST_CHANGES`.

See the canonical skill for the full process, severity table, decision rules, and
report format.
