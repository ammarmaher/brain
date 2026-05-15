*** /light-learn — force a Light Learning Intake pass on the latest message ***

# /light-learn

Force the Page Learning Light Intake to run on the most recent user input even if auto-detection skipped it.

Behavior:

1. Resolve the page name (ask Ammar if ambiguous).
2. Save evidence to `Brain Outputs/understanding/pages/<page>/evidence/<learningId>/`.
3. Append a fully-populated event row to `LIGHT_LEARNING_EVENTS.md` with status `pending`.
4. If a rule emerges, draft a `pending` row in `PENDING_PAGE_PATTERNS.md`.
5. Append to `EVIDENCE_INDEX.md`.
6. Echo a 1–3 line acknowledgement: page, section, category, learningId, status.

Never approves. Never promotes. Never mutates scorecards.

Skill: `domains/frontend/page-learning/SKILL.md`.
