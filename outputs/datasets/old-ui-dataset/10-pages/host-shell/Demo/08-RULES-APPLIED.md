# Rules / patterns — Demo

## Observed (good)
- Standalone components.
- Signal + computed for `rows()` in FacadeStatusComponent.

## Observed (bad — would be flagged by the night-shift digest)
- **The whole feature ships in production code**. `Demo/` is a development affordance and would be expected under a `dev-tools/` flag, not in the main bundle.
- **`app-facade-status1`** selector with a digit suffix — likely renamed when a similar component was needed; suggests collision avoidance never properly resolved.
- **`*ngFor` instead of `@for`** in `facade-status.component.html`.
- **Inline hex colors / no design tokens** (in SCSS files, not shown but referenced).
- **No i18n** — all hardcoded English.
- **`"This page is served from the host {{contextValue}}."`** — exposes infrastructure detail in plain text.

## Patterns worth porting
- The facade-status diagnostic table is a useful **developer tool** — could survive as a hidden `/dev/facade-status` route behind a feature flag in the new build.

## Anti-patterns to NOT port to new theme
- **Shipping diagnostic pages in user routes**. Move to a dev-only entry point.
- **`Demo/` folder name with capital D** — inconsistent with `apps/host-shell/src/app/features/{auth,dashboard,error,not-found,unauthorized,user-profile}` (all lowercase). New build should normalize naming.
- **Tightly coupled to "facade" abstraction** — if facade contracts change, this page silently breaks. Should use a typed interface introspection.
