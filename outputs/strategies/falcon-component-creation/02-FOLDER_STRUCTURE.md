# 02 — Folder Structure

> Every Falcon component touches **exactly these paths**. Anything outside is a deviation requiring an RFC.

## 1. Tree diagram

```
libs/falcon-ui-core/src/
├── components/
│   ├── falcon-X/                              ← Stencil Shadow DOM
│   │   ├── falcon-X.tsx                       (REQUIRED — Shadow component)
│   │   ├── falcon-X.css                       (REQUIRED — tokens-only paint)
│   │   ├── falcon-X.types.ts                  (REQUIRED — shared types SSOT)
│   │   ├── falcon-X.utils.ts                  (OPTIONAL — pure helpers)
│   │   ├── readme.md                          (AUTO — Stencil docs-readme)
│   │   └── falcon-X.{d.ts,js,*.map}           (AUTO — Stencil compiled output)
│   │
│   └── falcon-X-tw/                           ← Stencil Light DOM (Tailwind)
│       ├── falcon-X-tw.tsx                    (REQUIRED — Light component)
│       ├── readme.md                          (AUTO — Stencil docs-readme)
│       └── falcon-X-tw.{d.ts,js,*.map}        (AUTO — Stencil compiled output)
│
├── tailwind/
│   └── X-tailwind-classes.ts                  (REQUIRED — pure class-string builders)
│
├── define-falcon-tw-component.ts              (PATCH — add one twLoaders entry)
│
└── angular-wrapper/
    ├── index.ts                               (PATCH — add `export * from './components/falcon-X';`)
    └── components/
        └── falcon-X/
            ├── falcon-X.component.ts          (REQUIRED — <falcon-angular-X>)
            ├── falcon-X.component.html        (REQUIRED — @if useTailwind switch)
            └── index.ts                       (REQUIRED — re-export component + types)

libs/falcon-ui-tokens/src/
├── index.css                                  (PATCH — add `@import './components/X.tokens.css';`)
└── components/
    └── X.tokens.css                           (REQUIRED — token contract)
```

[CODE] Verified against `libs/falcon-ui-core/src/components/falcon-empty-state/` (2026-05-14) — file list:
```
falcon-empty-state.css
falcon-empty-state.d.ts(.map)        ← auto
falcon-empty-state.js(.map)          ← auto
falcon-empty-state.tsx
falcon-empty-state.types.d.ts(.map)  ← auto
falcon-empty-state.types.js(.map)    ← auto
falcon-empty-state.types.ts
readme.md                            ← auto
```

## 2. Per-path owner + create-when

| Path | Owner | Status | Create when |
|---|---|---|---|
| `libs/falcon-ui-core/src/components/falcon-X/falcon-X.tsx` | Stencil Shadow | REQUIRED | Always — every component starts here |
| `libs/falcon-ui-core/src/components/falcon-X/falcon-X.css` | Stencil Shadow | REQUIRED | Always — even if minimal (`:host { display: block }`). Tokens-only paint |
| `libs/falcon-ui-core/src/components/falcon-X/falcon-X.types.ts` | Stencil Shadow (shared SSOT) | REQUIRED | Always — even if only one type alias |
| `libs/falcon-ui-core/src/components/falcon-X/falcon-X.utils.ts` | Stencil Shadow | OPTIONAL | When pure helpers exist (key-handling, ID format, filtering). Imported by both Shadow + Light variants |
| `libs/falcon-ui-core/src/components/falcon-X/readme.md` | Stencil `docs-readme` | AUTO | Generated on build — DO NOT hand-edit |
| `libs/falcon-ui-core/src/components/falcon-X/falcon-X.{d.ts,js,*.map}` | Stencil compiler | AUTO | Generated — gitignored or kept depending on project policy |
| `libs/falcon-ui-core/src/components/falcon-X-tw/falcon-X-tw.tsx` | Stencil Light | REQUIRED | Always — paired with Shadow tag |
| `libs/falcon-ui-core/src/components/falcon-X-tw/readme.md` | Stencil `docs-readme` | AUTO | Generated on build |
| `libs/falcon-ui-core/src/tailwind/X-tailwind-classes.ts` | Tailwind helper | REQUIRED | Always — produces class strings consumed by Light Stencil + (optional) Angular wrapper class methods |
| `libs/falcon-ui-core/src/define-falcon-tw-component.ts` | Loader registry | PATCH | Add one line to `twLoaders` map — see `07-INTEGRATION_POINTS.md` §1 |
| `libs/falcon-ui-core/src/angular-wrapper/components/falcon-X/falcon-X.component.ts` | Angular wrapper | REQUIRED | Always — the `<falcon-angular-X>` consumer surface |
| `libs/falcon-ui-core/src/angular-wrapper/components/falcon-X/falcon-X.component.html` | Angular wrapper | REQUIRED | Always — `@if (useTailwind) { -tw } @else { shadow }` |
| `libs/falcon-ui-core/src/angular-wrapper/components/falcon-X/index.ts` | Angular wrapper | REQUIRED | Always — re-exports `FalconAngularXComponent` + types |
| `libs/falcon-ui-core/src/angular-wrapper/index.ts` | Angular wrapper barrel | PATCH | Add `export * from './components/falcon-X';` — see `07-INTEGRATION_POINTS.md` §3 |
| `libs/falcon-ui-tokens/src/components/X.tokens.css` | Tokens lib | REQUIRED | Always — token contract |
| `libs/falcon-ui-tokens/src/index.css` | Tokens lib barrel | PATCH | Add `@import './components/X.tokens.css';` — see `07-INTEGRATION_POINTS.md` §2 |

## 3. Why this structure

| Decision | Source | Rationale |
|---|---|---|
| Shadow + Light siblings in `components/` (not nested) | [BRAIN-OUT] FALCON_WRAPPER_AND_RENDER_PATH_REPORT §1 | Stencil's `docs-readme` generator writes per-folder `readme.md`. Separate folders = separate docs files |
| Types in Shadow folder, NOT in a shared `types/` | [CODE] `empty-state.types.ts` imported by 3 layers | Conceptual ownership: types describe the component contract, which is defined first by the Shadow render |
| Angular wrapper lives INSIDE `libs/falcon-ui-core/` | [CODE] `libs/falcon-ui-core/src/angular-wrapper/` | One npm-publishable unit. Consumers get Stencil core + Tailwind helpers + Angular wrapper from a single `@falcon/ui-core` install |
| Tokens lib separate from core | [CODE] `libs/falcon-ui-tokens/` | Tokens are framework-agnostic; theme studio mutates them at runtime. Separate lib prevents accidental coupling |
| Light variant in its own folder (`falcon-X-tw/`) | [CODE] `falcon-accordion-tw/` | Allows independent `readme.md` + lets webpack chunk-split each `-tw` variant cleanly (see `define-falcon-tw-component.ts` `webpackChunkName` per entry) |

## 4. Auto-generated outputs (DO NOT hand-edit)

| Path | Generated by | When |
|---|---|---|
| `libs/falcon-ui-core/dist/` | Stencil `dist` target | `nx build falcon-ui-core` |
| `libs/falcon-ui-core/dist/components/` | Stencil `dist-custom-elements` target | `nx build falcon-ui-core` |
| `libs/falcon-ui-core/loader/` | Stencil `dist` target | `nx build falcon-ui-core` |
| `libs/falcon-ui-core/www/` | Stencil dev server | `nx serve falcon-ui-core` (dev only) |
| `libs/falcon-ui-react/src/components/FalconX.ts` | `reactOutputTarget` | Auto-emitted on `nx build falcon-ui-core` |
| `libs/falcon-ui-vue/src/components/FalconX.ts` | `generate-vue-proxies.cjs` | `npm run generate-vue-proxies` (in `libs/falcon-ui-core/`) |
| Per-folder `readme.md` | Stencil `docs-readme` target | `nx build falcon-ui-core` |

## 5. Bonus: per-component dossier (outside Nx source)

[BRAIN-OUT] Each component also gets a deep dossier at `C:\Falcon\Brain Outputs\component-registry\components\<component>\` containing:
- Component overview
- Props / Events / Slots tables
- Token list
- Cross-framework wrapper map
- Known issues / quirks

These dossiers are NOT shipped — they are Brain Output knowledge artefacts, refreshed by the agent registry.

_Last updated: 2026-05-14 — Strategy v1.0 — Author: Adnan (auto)_
