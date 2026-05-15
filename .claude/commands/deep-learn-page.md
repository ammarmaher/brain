*** /deep-learn-page — Deep Page Learning for a named page ***

# /deep-learn-page <page>

Run the Deep Page Learning workflow against `<page>`. Aliases: `deep learn this page`, `learn this page`, `update vault`.

Behavior:

1. Read `LIGHT_LEARNING_EVENTS.md` and `PENDING_PAGE_PATTERNS.md` for `<page>`.
2. For each pending item, prompt Ammar: approve / reject / promote globally / deprecate / skip.
3. Apply Ammar's decision exactly — never auto-decide.
4. On approve → move to `APPROVED_PAGE_PATTERNS.md` + the matching domain file (`UI_UX_RULES.md`, `VALIDATION_RULES.md`, `API_RULES.md`, `BUSINESS_RULES.md`).
5. On reject → move to `REJECTED_PAGE_PATTERNS.md` with reason.
6. On promote → append to the matching file under `Brain Outputs/understanding/frontend/patterns/`.
7. Recompute `PAGE_SCORECARD.md` from APPROVED files only. Flag any dimension < 60 % as `NEEDS ATTENTION`.
8. Append the full audit to `LEARNING_CHANGE_HISTORY.md`.
9. Update Obsidian indexes additively.
10. Mirror + commit + push ONLY if Ammar says `commit` / `push`.

Skill: `domains/frontend/page-learning/SKILL.md`.
