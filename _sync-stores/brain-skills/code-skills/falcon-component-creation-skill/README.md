*** falcon-component-creation-skill — README ***

# falcon-component-creation-skill

Canonical Brain Skill that scaffolds a brand-new Falcon UI component (Stencil + Tailwind dual render + Angular wrapper) under `libs/falcon-ui-core/`, with mandatory build verification, ≥95% confidence scoring, and cross-vault knowledge updates.

Trigger any of: `create new falcon component <name>`, `scaffold falcon component <name>`, `build falcon component <name>`, `/falcon-component <name>`, `new falcon ui component`.

The skill is a **doctrine pointer** — it does not inline the playbook. Templates, scoring rubric, execution protocol, and common pitfalls live in the strategy folder so they can be shared across agents and sessions.

## Where to look

- Full doctrine + hard rules + run output + sound signature: [`Skill.md`](./Skill.md)
- Templates, scoring rubric, execution protocol: `C:\Falcon\Brain Outputs\strategies\falcon-component-creation\`
- Per-run audit artifacts (`RUN.md`, `SCORECARD.md`, `DEVIATIONS.md`): `Brain Outputs/strategies/falcon-component-creation/runs/<date>_<component>/`
- Canonical reference components: `libs/falcon-ui-core/src/components/falcon-empty-state/` and `falcon-accordion/`

---

_Last updated: 2026-05-14 — Strategy v1.0 — Author: Adnan (auto)_
