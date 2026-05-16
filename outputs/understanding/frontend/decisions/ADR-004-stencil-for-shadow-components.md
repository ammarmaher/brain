---
type: adr
adr-id: ADR-004
title: Why Stencil for shadow components
status: accepted
date: 2026-05-16
deciders: [Falcon Frontend, Adnan]
supersedes: []
superseded-by: []
tier: 3
---

*** ADR-004 — Why Stencil for shadow components ***
*** The compiler choice that makes every Falcon primitive cross-framework by default ***

# ADR-004 — Why Stencil for shadow components

## Context

After **ADR-001** retired PrimeNG, Falcon owned its UI vocabulary outright. Two things were now true at the same time:

1. The platform had to ship in Angular **today** — `host-shell` (4200) + `admin-console` (4204) + `management-console` (4301) are Angular 21.2.9 + zoneless apps.
2. The platform had to be **cross-framework tomorrow**. Falcon is a SaaS multi-tenant white-label product. Future white-label partners and embedded integrations may run on React or Vue. Anything we author as a pure-Angular component locks the platform to Angular and forces a rewrite on the day a partner shows up with a Next.js or Nuxt shell.

The pain to solve was the gap between those two truths. Hand-rolling primitives twice (one Angular tree, one React tree, one Vue tree) is a maintenance bomb. Authoring them once in Angular and rewriting on demand is the same bomb, deferred. We needed **one source file per primitive** that compiles to a framework-agnostic artefact, plus thin per-framework wrappers for ergonomics.

A second forcing function: the legacy UI's `::ng-deep` chains and PrimeNG style overrides had taught the team that **style encapsulation by convention does not survive 18 months of feature pressure**. The next library had to encapsulate by *structure*, not by *discipline*. That points squarely at Shadow DOM.

## Decision

**Falcon authors every UI primitive as a Stencil component.** Stencil (`@stencil/core@^4.20.0` in `libs/falcon-ui-core/package.json`) is a compiler that takes TSX-decorated classes and emits standards-based Web Components. Each Falcon primitive is one Stencil file that fans out into:

- A native **`<falcon-X>`** custom element with Shadow DOM (`shadow: true`) — works in any framework or in vanilla HTML, paints from `var(--falcon-X-*)` tokens, encapsulates internals so nothing pierces it.
- A **`<falcon-X-tw>`** Light-DOM sibling (`shadow: false`) — same Props/Events surface, consumer-app Tailwind v4 utilities cascade in. The render-path pair is fully described in **ADR-005**.
- An **`<falcon-angular-X>`** Angular wrapper at `libs/falcon-ui-core/src/angular-wrapper/components/falcon-X/` — `@if (useTailwind) { -tw } @else { shadow }`, `CUSTOM_ELEMENTS_SCHEMA`, `OnPush`, optional `ControlValueAccessor`.
- **React + Vue wrappers** auto-emitted via Stencil's `reactOutputTarget` (`@stencil/react-output-target@^0.7.4`) into `libs/falcon-ui-react/` and via `@stencil/vue-output-target@^0.13.1` into `libs/falcon-ui-vue/`. No hand-authored wrapper code for those frameworks.
- A **`<X>.tokens.css`** contract file in `libs/falcon-ui-tokens/src/components/` — single token cascade that the Shadow CSS reads via `var()` and the Tailwind class helpers reference by name. The Studio mutates these tokens at runtime and every render path follows.

The Stencil source file and its sibling `.css` (Shadow only), `.types.ts`, and optional `.utils.ts` live together at `libs/falcon-ui-core/src/components/falcon-X/falcon-X.tsx`. The Light-DOM twin lives one folder over at `falcon-X-tw/`.

## Alternatives considered

### Lit elements — rejected

Lit is the most direct competitor — also produces Web Components, smaller runtime than Stencil. Rejected because:
- Stencil ships **mature framework-interop output targets** (Angular wrappers via `dist-custom-elements`, React via `reactOutputTarget`, Vue via the dedicated package). Lit requires manual wrapper authoring per framework, which is exactly the maintenance bomb we are trying to defuse.
- Stencil's compile-time **prop reflection, lazy loading, and pre-rendering** are first-class. With Lit we'd be rebuilding those.
- Stencil's `@Prop` decorator + `@Event({ bubbles: true, composed: true })` API maps 1:1 to Angular `@Input` / `@Output`, which makes the wrapper layer trivial.

### Pure Angular components — rejected

Author every primitive as `@Component({ selector: 'falcon-X' })` and forget about React/Vue for now. Rejected because:
- It locks the platform to Angular forever, exactly the trap **ADR-001** opened the door to escape.
- White-label partners cannot consume the library outside Angular without us rewriting it.
- Component encapsulation falls back to Angular `ViewEncapsulation.ShadowDom` — which works, but isn't portable.
- This option is the path of least resistance and the one we explicitly rejected at the v3.1 night-shift handover (memory `project_falcon_revamp_v3_1_night_shift_results`).

### Hand-rolled web components — rejected

Author directly against the `customElements` + `HTMLElement` API. Rejected because:
- The boilerplate cost per component is 5×–10× a Stencil component. Templating, attribute observation, reactivity, lifecycle, and event composition all become manual.
- No SSR helpers, no lazy chunking, no auto-generated TypeScript types.
- New developers cannot onboard against a custom in-house framework as fast as a documented public one.

### Microsoft FAST Element — rejected

Lit-class web-component framework from Microsoft. Rejected because:
- Smaller ecosystem and weaker framework-interop story than Stencil.
- Falcon already standardised on `@stencil/core@4` at the start of the UI rebuild — switching now would invalidate the 94 component folders already authored.

## Consequences

### Positive

- **Cross-framework portability is free.** Authoring `falcon-X.tsx` emits a native custom element, an Angular wrapper, a React wrapper, and a Vue wrapper without extra hand-written code. Verified by the three demos (§Verification).
- **Shadow DOM eliminates `::ng-deep`.** Every Shadow variant is style-isolated by structure, not by convention. Token cascade (`var(--falcon-X-*)`) is the only theming surface — covered by ADR-007 and the token contract in `libs/falcon-ui-tokens/`.
- **Framework-agnostic tokens at runtime.** Stencil components and `-tw` Tailwind variants both read from the same `<X>.tokens.css` file. The Studio mutating one `--color-falcon-*` value retunes Shadow + Light + Angular + React + Vue in one swipe.
- **Thin Angular wrapper layer.** The wrapper does three things: render-path switch, `CUSTOM_ELEMENTS_SCHEMA` shim, `ControlValueAccessor` for forms-aware components. Everything else is `@Input` → `[attr.*]` forwarding. No business logic, no styling, no DOM construction.
- **Lazy registration of the Light variants.** `define-falcon-tw-component.ts` registers `<falcon-X-tw>` on demand via `ngOnInit`. Apps that never opt into Tailwind mode for a given primitive ship zero `-tw` chunks. Contract C6 in `01-CANONICAL_PATTERN.md`.
- **Public surface = standards.** A future consumer doesn't need to install `@falcon/ui-core` to use the components — they can drop the Stencil-built ES bundle on a CDN, call `defineCustomElements()`, and use `<falcon-input>` from vanilla HTML.

### Negative

- **Build pipeline is more complex.** Three compile steps run per Stencil-touching change: Stencil compiles `.tsx` → `dist-custom-elements/`, Angular compiles wrappers consuming that dist, and the consumer app compiles the Tailwind class helpers used by the `-tw` variant. There is a known `dependsOn: ['^build']` race on `--skip-nx-cache` first runs documented in memory `project_falcon_ui_library.md` — Stencil dist must exist before Angular import resolves. Mitigation: `npx nx build falcon-ui-core` once, then dev-serve.
- **Two output targets to install.** `@stencil/react-output-target@^0.7.4` + `@stencil/vue-output-target@^0.13.1` add to dev-dependency surface area. No runtime cost (wrappers are emitted source code).
- **Shadow DOM has real quirks.** Four recurring layout traps are documented in memory `project_falcon_ui_core_layout_traps`:
  1. `shadow: false` host defaults to `display: inline` and produces ~24px of post-block line-box slack — must add `:host { display: block }` in a `styleUrl` (CSS comments must be `/* */`-wrapped).
  2. `min-h` + `justify-center` on empty-state wrappers creates slack — drop default min-h, opt in per consumer.
  3. Popup menus with `[appendTo]="'body'"` placed between block siblings need `<div class="h-0 overflow-visible">` wrappers because Shadow DOM portal positioning doesn't see ancestor stacking contexts.
  4. Doubled 1px borders at sibling-component boundaries — drop the internal-only side.

  Additional Shadow-related fixes landed in memory `project_zindex_calendar_portal_root_cause_fix` (overlay z-index ladder + popover-portal off-screen parking + rAF retry) — the popover-portal utility specifically exists because raw `<falcon-X-tw>` Light tags couldn't host portaled popovers reliably across Shadow boundaries.
- **Stencil event names cross the Shadow boundary only with `composed: true`.** Forgetting it causes wrapper `@Output()` listeners to silently never fire. Encoded in Contract C3 of the canonical pattern.
- **TypeScript `[prop]` Angular binding doesn't work on Stencil tags for primitive attributes** — must use `[attr.iconName]` (Contract C8). Wrappers paper over this for consumers but library authors learn it the hard way.

### Trade-offs accepted

We accepted compile-pipeline complexity in exchange for one-source cross-framework distribution. We accepted Shadow DOM quirks (4 documented traps + portal positioning subtleties) in exchange for permanent end-of-`::ng-deep`. We accepted Stencil decorator boilerplate over Lit's smaller runtime in exchange for first-class framework wrapper generation.

The reversal cost is **medium**. Migrating off Stencil would mean rewriting 62 shipped components — but the Shadow/Light/Token tri-contract is framework-agnostic enough that the migration target (Lit, Stencil v5, anything else with similar wrappers) reuses 80% of the per-component TypeScript and 100% of the token CSS and Tailwind helpers.

## Verification

Current state, verified from disk and memory on 2026-05-16:

- **`@stencil/core@^4.20.0`** declared in `libs/falcon-ui-core/package.json`. React + Vue output targets in workspace `package.json`.
- **94 component folders** under `libs/falcon-ui-core/src/components/` (`ls -d` count, 2026-05-16). Each Shadow primitive has a sibling `-tw` folder where the dual-render contract requires it; some Shadow-only or `-tw`-only variants exist for components that don't need both render paths yet.
- **62 canonical Falcon components shipped** to the Angular wrappers barrel — see `libs/falcon-ui-core/src/angular-wrapper/index.ts`.
- **Live reference component** — `libs/falcon-ui-core/src/components/falcon-input/falcon-input.tsx` (Shadow, `shadow: true`, 20+ `@Prop`s, 7+ `@Event`s, all `bubbles: true, composed: true`, `@Element() host!: HTMLElement`, `@State()` fields, `@Method()` async methods, generated id via `../../utils/id`, `joinIds + ariaBool` for a11y). Sibling `falcon-input.css` carries token-only CSS; sibling `falcon-input-tw/falcon-input-tw.tsx` mirrors the Props 1:1 in Light DOM.
- **Cross-framework demos verified running on 2026-05-10** (memory `project_falcon_ui_cross_framework_demos`):
  - React playground — port **5173** — Vite 6 + React 19 + Tailwind v4 — HTTP 200
  - Vue playground — port **5174** — Vite 6 + Vue 3.5 + Tailwind v4 — HTTP 200
  - Angular playground — port **5175** — Vite 6 + `@analogjs/vite-plugin-angular` + Angular 20 + Tailwind v4 — HTTP 200
  - All three consume the **same** `@falcon/ui-core` build (Vite aliases resolve to `libs/falcon-ui-core/dist/index.js` + `loader/index.js`). One Stencil source, three frameworks, zero per-framework rewrites.
- **29 component-docs MD files** at `demos/component-docs/` (28 component MDs + README). Wired into each demo's docs panel via `import.meta.glob('../../../component-docs/*.md', { query: '?raw', import: 'default', eager: false })` — single docs library serves all three framework playgrounds.
- **Shadow DOM trap-set documented** — 4 traps in `project_falcon_ui_core_layout_traps`, popover-portal + z-index ladder fixes in `project_zindex_calendar_portal_root_cause_fix`. Both memories are mandatory pre-reads when investigating Stencil layout regressions.
- **Token cascade chain proven** — `Component CSS → var(--falcon-input-bg) → libs/falcon-ui-tokens/src/components/input.tokens.css → var(--color-falcon-neutral-0) → libs/falcon-theme/src/falcon-tailwind-tokens.css` (workspace SSOT). Verified in `project_falcon_ui_library.md`.

## Related

- **[[ADR-001]]** — Why Falcon library instead of PrimeNG. The decision that forced ADR-004 — once we owned the components we needed a compiler.
- **[[ADR-005]]** — Why dual-render path (Shadow + Tailwind). Built directly on this ADR — the `-tw` Light variant is the second Stencil output of the same source.
- **[[ADR-007]]** — Why Tailwind v4 `@theme` over `@config`. The token cascade Stencil components read from.
- **R-FE-001** — Tailwind utilities only, no SCSS, no PrimeNG. Applies inside the `-tw` Light variant; Shadow variant uses tokens-only `.css` files but never SCSS.
- **`01-CANONICAL_PATTERN.md`** — `Brain Outputs/strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` — the 9 contracts (C1–C9) every Stencil-backed component obeys.
- **Stencil templates** — `Brain Outputs/strategies/falcon-component-creation/04-FILE_TEMPLATES/stencil-shadow-component.tsx.template` + `stencil-tw-component.tsx.template`.
- **Reference implementation** — `libs/falcon-ui-core/src/components/falcon-input/falcon-input.tsx` + `falcon-input-tw/falcon-input-tw.tsx`.
- **Memory `project_falcon_ui_library`** — live architecture lock-in for the library.
- **Memory `project_falcon_ui_cross_framework_demos`** — runtime verification of React + Vue + Angular consumption.
- **Memory `project_falcon_ui_core_layout_traps`** — the 4 known Stencil/Shadow layout quirks (mandatory pre-read for Stencil bug hunts).
- **Memory `project_zindex_calendar_portal_root_cause_fix`** — Shadow-boundary popover and z-index ladder fixes.
- **Folder structure** — `Brain Outputs/understanding/frontend/architecture/FOLDER_STRUCTURE_DEEP_DIVE.md` §5 (the `libs/falcon-ui-core/` deep-dive).

## Tags

#type/adr #frontend #architecture #stencil #web-components #shadow-dom #cross-framework #tier-3
