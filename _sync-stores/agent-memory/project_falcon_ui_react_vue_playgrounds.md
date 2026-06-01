---
name: Cross-framework proof — React + Vue playgrounds
description: Vite-based React 19 + Vue 3 demo apps that consume @falcon/ui-core Stencil web components. Scaffolded and wired to the workspace library; runtime verification still pending.
type: project
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---

# Status — SCAFFOLDED (2026-05-09), awaiting runtime verification

Both demo apps exist on disk under `C:\Falcon\falcon-web-platform-ui\demos\` and are fully wired to the in-workspace `@falcon/ui-core` library. They have NOT yet been dev-served / built / runtime-probed.

## Layout

```
C:\Falcon\falcon-web-platform-ui\demos\
├── react-playground\   (Vite 6 + React 19 + Tailwind v4, port 5173)
│   ├── package.json    — name "@falcon/react-playground", scripts: dev / build / preview
│   ├── vite.config.ts  — aliases below
│   ├── tsconfig.json
│   ├── index.html      — mounts #root
│   ├── node_modules\   — already installed
│   └── src\
│       ├── main.tsx          — defineCustomElements() then createRoot
│       ├── App.tsx           — full dual-render playground (~28 components)
│       ├── app.css           — Tailwind v4 + token chain + frozen brand-token snapshot
│       ├── demo-data.ts
│       └── falcon-elements.d.ts
└── vue-playground\     (Vite 6 + Vue 3.5 + Tailwind v4, port 5174)
    ├── package.json    — name "@falcon/vue-playground", scripts: dev / build / preview
    ├── vite.config.ts  — aliases below; isCustomElement: tag.startsWith('falcon-')
    ├── tsconfig.json
    ├── index.html
    ├── node_modules\   — already installed
    └── src\
        ├── main.ts            — defineCustomElements() then createApp
        ├── App.vue            — mirrors React playground section-by-section
        ├── app.css
        ├── demo-data.ts
        └── shims-vue.d.ts
```

## How they link to the Angular library (Vite resolve.alias)

Both apps consume the SAME library bits the Angular host-shell uses. No publish, no copy — direct workspace path resolution:

| Alias | Resolves to (relative to demos/<app>/) | Verified exists |
|---|---|---|
| `@falcon/ui-core` | `../../libs/falcon-ui-core/dist/index.js` | ✅ |
| `@falcon/ui-core/loader` | `../../libs/falcon-ui-core/loader/index.js` | ✅ |
| `@falcon/ui-tokens` | `../../libs/falcon-ui-tokens/src/index.css` | ✅ |

Token chain reaches the workspace SSOT via `@import` inside each app's `app.css`, plus `@source "../../../libs/falcon-ui-core/src/components"` + `@source "../../../libs/falcon-ui-core/src/tailwind"` so Tailwind v4 emits every utility used by Light-DOM `<falcon-X-tw>` variants.

## Components covered (dual Shadow + Tailwind tile per row)

Form fields: input, textarea, email-field, phone-field, otp
Selectors: dropdown, multi-select, checkbox, radio, switch
Date & time: calendar, date-picker
Navigation: tabs, stepper, accordion, paginator
Data display: table, tree, tree-table, organization-hierarchy-tree (Tailwind-only)
Buttons & actions: button, dialog, otp-send-dialog, tooltip, toast
Uploads: single-uploader, uploader

## Known caveat — forward-only token snapshot in app.css

`react-playground/src/app.css` contains a frozen `@theme { --color-falcon-teal-* … }` block copied from `libs/falcon/src/theme/falcon-tailwind-tokens.css`. Comment marks it "demo-only, do not add tokens here." A token unification pass should later collapse this back onto the SSOT.

## What is NOT yet done

1. Runtime verification — neither app has been `npm run dev`'d or `npm run build`'d in this session's history.
2. Component-toggle probe scripts (the same ones that pass on the Angular `/playground`) have not been adapted for the new DOM roots.
3. Stencil `reactOutputTarget` / `vueOutputTarget` wrappers — NOT generated; the apps use raw custom elements with `(e: any)` event casts. Wrappers remain optional per original plan.

## How to apply when picking this up next

1. From each demo folder run `npm run dev` and confirm the page renders all sections without a console error.
2. If any `<falcon-*>` tag fails in React or Vue but works in Angular → library bug, fix in `libs/falcon-ui-core`, not in the demo.
3. After both demos green, optionally generate the Stencil framework wrappers if event-binding ergonomics get noisy.
4. Once verified, update this memory to **VERIFIED** and remove the "awaiting runtime verification" qualifier.

## Pre-existing in-repo notes

- `libs/falcon-ui-core/NIGHT-SHIFT-LOG.md` → "Post-waves cleanup queue" item #6 (the original spec for this work).
- Memory `project_falcon_ui_library.md` — overall library architecture; the cross-framework promise hinges on these demos passing.
