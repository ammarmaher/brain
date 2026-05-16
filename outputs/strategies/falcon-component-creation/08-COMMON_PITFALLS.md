# 08 — Common Pitfalls

> **Purpose.** Catalogue of every known way new Falcon components break. Each pitfall has a severity, a manifestation (what the agent will see when it triggers), and a mitigation that the strategy already builds in.
>
> **Status:** v1.0 — seeded with 10 pitfalls discovered during the run-up to the `falcon-empty-data` calibration. Future entries arrive via `06-EXECUTION_PROTOCOL.md` Phase 6.

## Quick index

| # | Pitfall | Severity | Layer |
|---|---|---|---|
| 1 | EMFILE on Stencil build (Windows) | Low | Build tooling |
| 2 | rAF throttling in hidden tabs | Low | Stencil runtime |
| 3 | Lazy registration race | High | Loader |
| 4 | Angular `[class.X]` bracket clash with Tailwind arbitrary syntax | Med | Angular wrapper template |
| 5 | CSS-var inheritance through Shadow DOM | Low | Shadow CSS |
| 6 | Gradient `linear-gradient()` not expressible as Tailwind arbitrary class | Med | Tailwind helpers |
| 7 | Event name kebab-case in Angular | High | Angular wrapper template |
| 8 | `@falcon/shared-ui` → `@falcon/ui-core/angular` is a one-way dependency | High | Library wiring |
| 9 | TypeScript `private` fields in Stencil classes | Low | Stencil Shadow component |
| 10 | Stencil event subscribed via Angular `(falcon-event-name)` | Med | Stencil events |

> **Severity scale.** Low = inconvenient, builds still pass. Med = silent runtime breakage in some browsers / scenarios. High = build red or component totally non-functional.

## 1. EMFILE on Stencil build (Windows)

| Field | Value |
|---|---|
| Severity | **Low** |
| Layer | Build tooling |
| How it manifests | `nx build falcon-ui-core` fails partway through Stencil compile with `EMFILE: too many open files` on `dist-custom-elements/*.js`. Re-run sometimes succeeds. Symptom appears more on Windows than on Linux. |
| Root cause | [CODE] Stencil's default worker pool opens many files in parallel; Windows imposes a tighter handle quota than POSIX. |
| Mitigation | Already in place — `stencil.config.ts` sets `maxConcurrentWorkers: 1`. If EMFILE still appears, retry once; if it repeats, run `nx reset` before retrying. Document the retry in `EXECUTION_LOG.md`. |
| Detection | Compile output contains `EMFILE` or `too many open files`. |
| Prevention checklist | (a) Confirm `maxConcurrentWorkers: 1` is still set after any tooling refresh. (b) Don't run two `nx build falcon-ui-core` simultaneously in different shells. |

## 2. rAF throttling in hidden tabs

| Field | Value |
|---|---|
| Severity | **Low** |
| Layer | Stencil runtime |
| How it manifests | Stencil components rendered in a background tab show stale UI when the tab is foregrounded. Animations stutter or skip frames. |
| Root cause | [INFERRED] Browsers throttle `requestAnimationFrame` in hidden tabs. Stencil's default task queue is `'async'`, which piggybacks on rAF. |
| Mitigation | Already in place — `stencil.config.ts` sets `taskQueue: 'immediate'`. This schedules Stencil work on microtasks instead of rAF, which keeps rendering responsive even when the tab is hidden. |
| Detection | Manual — open the same page in two tabs, switch back, observe whether Falcon components are up-to-date. |
| Prevention checklist | (a) Don't change `taskQueue` away from `'immediate'` without a measured perf justification. (b) New components should not rely on `requestAnimationFrame` for their own internal animations; use CSS transitions or Web Animations API instead. |

## 3. Lazy registration race

| Field | Value |
|---|---|
| Severity | **High** |
| Layer | Loader |
| How it manifests | First render of a page that contains the new component shows the tag as an unknown element (no Shadow DOM, no styling). After a few hundred ms it appears correctly. Most visible inside `falcon-data-table`'s empty-state slot. |
| Root cause | [INFERRED] `defineFalconTwComponent('falcon-<X>')` returns a Promise that resolves once the dynamic import lands. Stencil's custom-element infrastructure registers the tag inside that Promise. If the wrapper's HTML template renders the tag synchronously before the Promise resolves, the browser sees an unknown element. |
| Mitigation | Two strategies, applied per consumer (see `07-INTEGRATION_POINTS.md`): **(a) Eager registration** at the consuming app's bootstrap site via `defineCustomElements()` — recommended for any internal `@falcon/ui-core` consumer. **(b) Await the Promise** inside callers that explicitly `createComponent` — for tests or programmatic creation only. |
| Detection | DevTools console shows `[Webcomponents] Element falcon-<X> not registered` followed by a normal render a beat later. |
| Prevention checklist | (a) Phase 3 of the execution protocol explicitly rewires internal consumers to eager-register. (b) Never rely on the Angular wrapper's `ngOnInit` registration when the consumer is also inside `@falcon/ui-core`. |

## 4. Angular `[class.X]` bracket clash with Tailwind arbitrary syntax

| Field | Value |
|---|---|
| Severity | **Med** |
| Layer | Angular wrapper template |
| How it manifests | Build fails with a parse error like `Lexer Error: Unexpected character` on a line such as `[class.min-h-[var(--falcon-X-h)]]="hasMin"`. |
| Root cause | [CODE] Angular's template parser uses square brackets to delimit `[class.X]` and `[style.X]` bindings. Tailwind arbitrary classes also use square brackets (`min-h-[var(...)]`). The parser eats the closing `]` of the Tailwind class as the closing `]` of the Angular binding, producing nonsense. |
| Mitigation | Don't use `[class.X]` bindings with arbitrary Tailwind classes. Instead, compute the full class string in the wrapper TS — `cls = useTailwind ? containerCls(this.size, this.variant) : ''` — and bind once via `[class]="cls"` or `class="{{ cls }}"`. The Tailwind helpers in `<X>.classes.ts` already return strings designed for this pattern. |
| Detection | Angular template-parser errors mentioning bracket characters. |
| Prevention checklist | (a) HTML templates use `[class]="cls"` only. (b) `[class.X]` bindings reserved for plain (non-arbitrary) class names like `[class.is-loading]="loading"`. (c) Helper functions return strings, not arrays — see scorecard dim #6. |

## 5. CSS-var inheritance through Shadow DOM

| Field | Value |
|---|---|
| Severity | **Low** |
| Layer | Shadow CSS |
| How it manifests | (a) Custom-property values declared on `:root` reach Falcon Shadow components correctly. (b) Tailwind utility **classes** declared on outer DOM do NOT reach the inside of a Shadow root — agents sometimes assume they do and then waste time debugging "missing styles". |
| Root cause | [INFERRED] CSS custom properties are inherited by their nature and cascade across Shadow boundaries. Tailwind generates static class rules in the global stylesheet — those rules cannot reach into a Shadow tree (style isolation works as designed). |
| Mitigation | Use custom properties for any value that must theme. The Shadow CSS reads them via `var(--falcon-<X>-…)`. The Tailwind branch reads the same properties via arbitrary class syntax (`bg-[var(--falcon-<X>-bg)]`). Never expect a Shadow component to inherit a Tailwind class like `text-blue-500` from its host. |
| Detection | A Shadow component looks unstyled even though the host page has the matching Tailwind class on a wrapper. |
| Prevention checklist | (a) When in doubt, prefer custom properties over classes for cross-Shadow theming. (b) `<X>.tokens.css` is the single declaration site — every Shadow CSS rule and Tailwind helper consumes it. |

## 6. Gradient `linear-gradient()` not expressible as Tailwind arbitrary class

| Field | Value |
|---|---|
| Severity | **Med** |
| Layer | Tailwind helpers |
| How it manifests | Tailwind compile rejects a class like `bg-[linear-gradient(135deg,_var(--a),_var(--b))]` with `Could not parse arbitrary value`. Commas inside `linear-gradient()` confuse the Tailwind v4 parser even when wrapped. |
| Root cause | [INFERRED] Tailwind's arbitrary-value parser treats commas as separators inside some contexts. Multi-stop gradients with explicit commas hit this. |
| Mitigation | For any component that paints a gradient, the Light/TW Stencil component and the Angular wrapper Tailwind branch apply the gradient via `[style.background]="gradientStyle"` (inline style binding to a token-driven expression). The Shadow CSS continues to use `linear-gradient(...)` natively. |
| Detection | Tailwind build warns about unparseable arbitrary values or silently strips the gradient. |
| Prevention checklist | (a) `<X>.classes.ts` only returns gradients when the gradient has a single stop; multi-stop gradients are bound via inline style. (b) Inline style values still reference tokens — `style.background="linear-gradient(var(--falcon-<X>-a), var(--falcon-<X>-b))"`. |

## 7. Event name kebab-case in Angular

| Field | Value |
|---|---|
| Severity | **High** |
| Layer | Angular wrapper template |
| How it manifests | Event handler bound as `(falconActionClick)="onClick($event)"` never fires. The Stencil component emits correctly (visible in DevTools event log) but Angular sees nothing. |
| Root cause | [INFERRED] Stencil emits real DOM `CustomEvent`s with the kebab-case name (`falcon-action-click`). Angular's `(event)` binding listens for the exact event name; camelCase `(falconActionClick)` listens for an event named `falconActionClick` which is never emitted. |
| Mitigation | Always bind events in kebab-case: `(falcon-action-click)="onClick($event)"`. The HTML wrapper template generated from `04-FILE_TEMPLATES/angular-wrapper.html.template` does this by default. |
| Detection | Manual — handler doesn't fire. Or scorecard dim #12 catches it in review. |
| Prevention checklist | (a) Every `@Output` in the Angular wrapper TS uses kebab-case (`@Output('falcon-action-click') click = new EventEmitter()`). (b) Every `(event)` binding in the HTML template uses kebab-case. (c) Stencil `@Event` decorators always specify the event name explicitly — never let Stencil derive it from the property name. |

## 8. `@falcon/shared-ui` → `@falcon/ui-core/angular` is a one-way dependency

| Field | Value |
|---|---|
| Severity | **High** |
| Layer | Library wiring |
| How it manifests | Importing anything from `@falcon/shared-ui` inside `@falcon/ui-core` triggers a circular-import warning at build time and may break Nx's project graph entirely. |
| Root cause | [CODE] `@falcon/shared-ui` re-exports Angular wrappers from `@falcon/ui-core/angular` for app-side convenience. Going back the other way would close the cycle. |
| Mitigation | Hard rule: **`@falcon/ui-core` never imports from `@falcon/shared-ui`.** If a component needs something currently in shared-ui, move that thing into ui-core (or into a lower-level lib like `@falcon/ui-tokens`). |
| Detection | Nx graph check (`nx graph`); circular-import warnings during build. |
| Prevention checklist | (a) Phase 3 of the execution protocol explicitly checks both barrels for the right direction. (b) Any new utility helpers go into `@falcon/ui-core/utils` or `@falcon/ui-tokens`, not `@falcon/shared-ui`. |

## 9. TypeScript `private` fields in Stencil classes

| Field | Value |
|---|---|
| Severity | **Low** |
| Layer | Stencil Shadow component |
| How it manifests | Generally fine — Stencil compiles private fields without issue. The trap is mistakenly marking a `@Prop({ reflect: true })` as private; Stencil still reflects it to the DOM attribute, exposing a "private" surface that consumers can poke. |
| Root cause | [INFERRED] `@Prop` is part of the public component contract regardless of TypeScript access modifiers. `private` is a compile-time hint; Stencil's reflection runs at runtime. |
| Mitigation | Use `private` freely for internal helper methods and state. Never combine `private` with `@Prop` decorators. Reserve `@Prop({ reflect: true })` for values that must be queryable as DOM attributes by external tooling (e.g. `[disabled]` for CSS selectors). |
| Detection | Code review — scorecard dim #2 covers reflect choices. |
| Prevention checklist | (a) `04-FILE_TEMPLATES/shadow.tsx.template` does not mark any `@Prop` as private. (b) Reviewer flags any private `@Prop` immediately. |

## 10. Stencil event subscribed via Angular `(falcon-event-name)`

| Field | Value |
|---|---|
| Severity | **Med** |
| Layer | Stencil events |
| How it manifests | The event fires correctly from inside the Shadow component but never reaches the Angular wrapper or any host listener. Visible as a missing user action in the UI. |
| Root cause | [INFERRED] Stencil dispatches a `CustomEvent`. The event needs `bubbles: true, composed: true` to cross the Shadow boundary and reach an outer listener. Default Stencil `@Event` decorators set `bubbles: true` but `composed: false`. |
| Mitigation | Every `@Event` decorator declares both options explicitly: `@Event({ bubbles: true, composed: true })`. Templates in `04-FILE_TEMPLATES/shadow.tsx.template` and `light-tw.tsx.template` already enforce this. |
| Detection | DevTools event-listener panel shows the event firing at the Shadow root but not propagating. |
| Prevention checklist | (a) Every emitter has the explicit `{ bubbles: true, composed: true }` payload. (b) Scorecard dim #12 reviews every event decorator. |

## Adding new pitfalls

When a run surfaces a new pitfall:

1. Append a new section using the same field grid (Severity / Layer / How it manifests / Root cause / Mitigation / Detection / Prevention checklist).
2. Add a row to the Quick index at the top.
3. Bump the PATCH version in `09-CHANGELOG.md` with the new entry.
4. If the same pitfall surfaces in 2+ runs, promote a one-liner about it to `01-CANONICAL_PATTERN.md` as a rule.

_Last updated: 2026-05-14 — Strategy v1.0 — Author: Adnan (auto)_
