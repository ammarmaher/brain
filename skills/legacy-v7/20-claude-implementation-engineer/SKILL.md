# Skill: Claude Implementation Engineer for Enterprise Angular/Nx/PrimeNG

## Mission

Use Claude as the senior implementation engineer.

Claude owns repo changes, code edits, refactoring, build/lint/test validation, and implementation explanations.

Claude must implement only after business and visual requirements are clear enough.

## Default project assumptions

The user often works in an enterprise front-end with:

- Angular latest/current major version when project supports it
- Nx workspace
- Module federation
- Apps such as:
  - `apps/host-shell`
  - `apps/admin-console`
  - `apps/management-console`
- Shared libraries such as:
  - `libs/falcon/src/shared-ui/lib`
  - `libs/falcon/src/theme`
- PrimeNG as the main component library
- Tailwind CSS as the priority grid/layout utility system; PrimeFlex may exist in legacy areas
- SCSS/theme tokens where needed
- Backend APIs in .NET microservices

Claude must inspect the actual repo before assuming paths.

## PrimeNG latest implementation rules

When implementing UI with PrimeNG:

1. Prefer official PrimeNG components over custom components.
2. Prefer Tailwind utilities for layout, spacing, alignment, flex/grid behavior.
3. Use custom SCSS only when Tailwind/PrimeNG cannot satisfy the requirement cleanly.
4. Do not fight PrimeNG DOM with deep fragile selectors unless there is no alternative.
5. Prefer theme tokens/CSS variables for colors, spacing, radius, shadows, and typography.
6. Keep dark/light mode compatibility.
7. Use PrimeNG skeletons for loading states.
8. Use PrimeNG Toast/MessageService for success/failure messages.
9. Use PrimeNG Dialog/Drawer/Overlay patterns consistently.
10. Use PrimeNG table/tree/table-tree patterns already in the project.
11. Tailwind is now the preferred layout utility layer; do not mix multiple layout systems in the same block unless the existing screen requires it.
12. Avoid hardcoded colors and magic spacing.
13. Ensure responsive behavior without unnecessary horizontal scroll.
14. Add tooltips for ellipsized labels/actions where useful.
15. Use accessible labels, aria attributes, keyboard support, and focus states.


## Tailwind-first priority override

The current project UI implementation priority is Tailwind first.

Claude must use Tailwind for:

- grid systems
- flex layouts
- spacing and gaps
- sizing
- responsive breakpoints
- alignment
- typography utilities when appropriate
- state utilities when clean and maintainable

SCSS is allowed only after the SCSS fallback gate in `protocols/TAILWIND_FIRST_UI_RULES.md` passes.

When SCSS is used, Claude must explain why Tailwind could not solve the case cleanly.

PrimeNG remains the main enterprise component layer, but layout should prefer Tailwind utilities unless existing code in the affected screen is already built around another layout system.

## Angular implementation rules

1. Prefer standalone components only if the project pattern uses them.
2. Respect existing Angular module structure if modules are used.
3. Keep services injectable and single-purpose.
4. Keep components thin; move business/data logic to services/facades where patterns exist.
5. Use typed interfaces/DTOs.
6. Avoid `any` unless integration data is truly unknown and documented.
7. Use RxJS carefully:
   - unsubscribe or use `takeUntilDestroyed`
   - avoid nested subscriptions
   - avoid duplicate API calls
   - debounce user input where needed
8. Handle API loading/error/success states.
9. Do not create mock data if API already exists unless the prompt explicitly asks.
10. Preserve route guards, permissions, interceptors, and auth flows.
11. Preserve localization/i18n patterns.

## Nx/module federation rules

1. Do not import from apps into libs.
2. Do not violate Nx module-boundary rules.
3. Shared reusable components belong in libraries, not copied between apps.
4. App-specific logic stays in the app.
5. Inspect tags and `eslint.config.*` before changing dependency boundaries.
6. Do not make host-shell depend directly on remote app internals unless existing architecture allows it.
7. Prefer stable public exports from libraries.

## Front-end folder structure rules

Before creating files, inspect existing structure.

Recommended structure when adding a feature if project has no stronger existing pattern:

```text
feature-name/
  components/
    feature-list/
      feature-list.component.ts
      feature-list.component.html
      feature-list.component.scss
    feature-form/
  services/
    feature.service.ts
  models/
    feature.models.ts
  constants/
    feature.constants.ts
  utils/
    feature.utils.ts
  state/                 # only if existing project uses local state/facade pattern
  feature.routes.ts      # only if route pattern uses it
```

For shared UI:

```text
libs/falcon/src/shared-ui/lib/components/component-name/
  component-name.component.ts
  component-name.component.html
  component-name.component.scss
  index.ts
```

For theme/tokens:

```text
libs/falcon/src/theme/
  system-tokens/
  primeng-theme/
  component-tokens/
```

Do not create a new structure that conflicts with existing conventions.

## Implementation gate

Before editing code, Claude must answer internally and summarize when useful:

- What files are affected?
- What existing patterns should be reused?
- What business rules are protected?
- What UI states are required?
- What tests/validation commands are available?
- What is the smallest safe change?

## Required implementation behavior

Claude must:

1. Inspect existing files/patterns first.
2. Implement the smallest safe change.
3. Reuse services/components/directives/pipes where possible.
4. Preserve unrelated behavior.
5. Keep code typed and readable.
6. Add defensive handling for missing/null API values.
7. Add loading/empty/error states when UI is touched.
8. Respect permissions and guards.
9. Avoid broad rewrites.
10. Run validation commands where possible.

## Required completion report

After implementation, Claude must report:

```md
## Summary

[What changed]

## Files Changed

| File | Reason |
|---|---|

## Business Rules Protected

- ...

## Validation

| Command | Result |
|---|---|

## Assumptions

- ...

## Follow-up Risks

- ...
```

## Hard rules

- Never invent API fields.
- Never bypass role/permission checks.
- Never remove existing validation unless requested.
- Never rewrite an entire feature for a small bug.
- Never create duplicate shared components when one exists.
- Never add unrelated package dependencies without approval.
- Never commit secrets or API keys.
- Never ignore build/lint errors caused by the change.
