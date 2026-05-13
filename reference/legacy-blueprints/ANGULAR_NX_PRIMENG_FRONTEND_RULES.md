# Angular / Nx / PrimeNG Front-End Rules

## Purpose

These rules guide Claude when implementing front-end changes in the user's enterprise Angular project.

## Stack assumptions

- Angular enterprise application
- Nx workspace
- Module federation
- PrimeNG latest/current supported by project
- PrimeFlex layout utilities
- SCSS/theme tokens when needed
- Apps: host-shell, admin-console, management-console
- Shared libs under `libs/falcon/...`

Claude must inspect the actual repo before relying on any assumption.

## App/module boundaries

| Area | Responsibility |
|---|---|
| `host-shell` | Shell, auth, shared routing/container, cross-app layout |
| `admin-console` | Falcon/admin-facing features |
| `management-console` | Client/management-facing features |
| `libs/falcon/src/shared-ui` | Reusable UI components/directives/pipes |
| `libs/falcon/src/theme` | Theme tokens and PrimeNG theme mapping |

## Nx boundary rules

- Apps must not be imported by libraries.
- Apps should not import internals of other apps.
- Shared code goes to libraries.
- Respect tags and dependency constraints.
- Prefer public API exports.
- Do not weaken lint boundaries just to make an import work.

## PrimeNG UI rules

- Use PrimeNG components first.
- Use PrimeFlex for layout.
- Use SCSS only for gaps that PrimeNG/PrimeFlex cannot solve.
- Use theme tokens for colors/shadows/radii/spacing.
- Avoid hardcoded colors.
- Avoid fragile `::ng-deep` unless unavoidable.
- Use p-skeleton for loading.
- Use p-toast/MessageService for notifications.
- Use p-tooltip for truncated text/action hints.
- Ensure keyboard and focus behavior.
- Avoid horizontal scroll unless data truly requires it.

## Common UI states every feature should consider

- Initial loading
- Refresh loading
- Empty data
- API error
- Permission denied
- Form validation error
- Save success
- Save failure
- Unsaved changes
- Disabled action
- Hidden action
- Responsive layout

## Component structure rule

A component should not contain heavy business logic.

Prefer:

- Component: template state and UI events
- Service/facade: data loading and orchestration
- Models: typed DTOs and view models
- Utils: pure transformations
- Constants: stable options/status maps

## Directive rules

For reusable behavior, prefer directives.

Examples:

- Input character restrictions
- Max length behavior
- Permission-driven hidden/disabled state
- Tooltip/ellipsis behavior

Directive requirements:

- Clear selector name
- Typed inputs
- No side effects outside element behavior
- Works with PrimeNG inputs when possible
- Handles paste, keyboard, IME, and programmatic value where possible

## Chart implementation rules

When using PrimeNG Chart/Chart.js or another existing project chart wrapper:

- Do not invent chart library if one exists.
- Map API data into a typed chart view model.
- Keep chart options in constants or builder functions.
- Use tokens/theme colors.
- Handle empty/loading/error states.
- Ensure responsive behavior.
- Format numbers, dates, currencies consistently.
- Provide tooltip formatting.
- Provide accessibility labels where possible.

## Validation commands

Claude should inspect package scripts first:

```bash
cat package.json
```

Then run available commands only when appropriate:

```bash
npm run lint
npm run test
npm run build
npx nx lint <project>
npx nx test <project>
npx nx build <project>
```

Do not assume command names.
