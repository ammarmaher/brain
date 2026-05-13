# Quality Gates

## Gate 1 — Requirement Gate

Pass only when:

- The goal is clear.
- The problem is clear.
- Expected behavior is clear.
- In-scope and out-of-scope are defined.
- Assumptions are listed.

## Gate 2 — Business Gate

Pass only when:

- Business rules are listed.
- Role/permission rules are checked.
- Status transitions are checked.
- Validation rules are checked.
- Business tests exist.
- Regression risks exist.

## Gate 3 — Visual/Chart Gate

Required when screenshots, dashboards, charts, images, or UI comparisons exist.

Pass only when:

- Gemini has extracted visual/chart requirements.
- Chart type and data mapping are specified.
- Axes/series/legend/tooltips are specified.
- Loading/empty/error states are specified.
- Responsive behavior is specified.
- Visual assumptions are marked.

## Gate 4 — Architecture Gate

Pass only when:

- Affected apps/libs are identified.
- Nx boundaries are respected.
- Shared vs app-specific logic is decided.
- Existing services/components are reused where possible.
- No unrelated rewrite is planned.

## Gate 5 — Implementation Gate

Pass only when Claude:

- Inspects existing code first.
- Implements smallest safe change.
- Uses typed DTOs/models.
- Handles API errors.
- Handles loading/empty states.
- Preserves guards/permissions.
- Avoids hardcoded theme values.

## Gate 6 — Test Gate

Pass only when:

- Business tests are documented.
- Unit/component tests are added or recommended.
- Integration/API tests are considered.
- UI state tests are considered.
- Visual/chart validation is performed when relevant.

## Gate 7 — Regression Gate

Pass only when:

- Existing behavior is preserved.
- Cross-module impacts are checked.
- Related apps/remotes are checked.
- Build/lint/test commands are run where possible.
- Remaining risks are documented.

## Gate 8 — Documentation Gate

Pass only when:

- Changed files are listed.
- Assumptions are listed.
- Validation results are listed.
- User-facing behavior is summarized.
- Follow-up tasks are clear.
