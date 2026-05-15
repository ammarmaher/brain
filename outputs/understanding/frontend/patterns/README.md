*** Frontend Patterns — global Falcon UI patterns ***
*** Path: Brain Outputs/understanding/frontend/patterns/ ***
*** Created: 2026-05-15 ***

# Frontend Patterns

Cross-page, cross-app patterns for Falcon UI. Patterns here are **promoted from page-specific approvals only when Ammar says `promote this globally`** — see [page-learning SKILL.md](../../../../Brain%20SK/domains/frontend/page-learning/SKILL.md) and [APPROVAL_LEARNING_GATE.md](../../../../Brain%20SK/protocols/APPROVAL_LEARNING_GATE.md).

## Files

| File | Scope |
|---|---|
| [TABLE_PATTERN.md](TABLE_PATTERN.md) | Data tables (incl. Falcon Data Table contract) |
| [TABS_PATTERN.md](TABS_PATTERN.md) | Tab containers, scroll, mobile collapse |
| [FORM_PATTERN.md](FORM_PATTERN.md) | Reactive form composition + validation surface |
| [BUTTON_PATTERN.md](BUTTON_PATTERN.md) | Button variants, icon usage, loading state |
| [POPUP_PATTERN.md](POPUP_PATTERN.md) | Dialog / drawer / OTP popup |
| [VALIDATION_PATTERN.md](VALIDATION_PATTERN.md) | Field-level + cross-field + async validation |
| [API_PATTERN.md](API_PATTERN.md) | Request shape, error shape, ServiceOperationResult |
| [PAGE_SECTION_PATTERN.md](PAGE_SECTION_PATTERN.md) | Section anatomy + section slug discipline |
| [FALCON_COMPONENT_CUSTOMIZATION_PATTERN.md](FALCON_COMPONENT_CUSTOMIZATION_PATTERN.md) | Customization order — inputs → templates → slots → variants → upgrade → new component → wrapper → raw (GAP) |

## Conventions

- Each pattern file starts empty / seed-state. Rules land here ONLY through `promote this globally`.
- Every promoted rule must cite its origin page + learningId.
- Never overwrite a pattern silently — append to a `Conflict` section and ping Ammar to reconcile.
- Tailwind utilities + Falcon design tokens only. No SCSS, no inline styles, no PrimeNG.
