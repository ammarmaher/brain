---
name: Cross-framework demo trio — React 5173 / Vue 5174 / Angular 5175
description: All three Vite-based demo playgrounds verified running with shared @falcon/ui-core, T2-branded hero, and per-component docs panel reading demos/component-docs/*.md.
type: project
originSessionId: b0e16028-2dde-472a-9e8b-f14a5d5becac
---
# Status — VERIFIED RUNNING (2026-05-10, Night Shift Task #1)

Three sibling Vite playgrounds under `C:\Falcon\falcon-web-platform-ui\demos\` all consume the same in-workspace `@falcon/ui-core` Stencil components. Each one served HTTP 200 under live smoke test on 2026-05-10.

| Demo | Path | Port | Stack |
|---|---|---|---|
| React | `demos/react-playground/` | 5173 | Vite 6 + React 19 + Tailwind v4 |
| Vue | `demos/vue-playground/` | 5174 | Vite 6 + Vue 3.5 + Tailwind v4 |
| Angular | `demos/angular-playground/` | 5175 | Vite 6 + `@analogjs/vite-plugin-angular` + Angular 20 + Tailwind v4 |

## Brand parity (Wave 1)

T2 logo lives at `apps/host-shell/src/assets/falcon-icon/T2_logo.png` (42×34 PNG). Distributed to each demo's `public/T2_logo.png` and rendered inside a green-primary tile (`bg-falcon-teal-500`, `h-16 w-16`, `rounded-xl`, `shadow-falcon-md`) on the hero header. Title reads "T2 · Falcon UI Custom Components" with framework badge below ("React 19 · Vite 5173" / "Vue 3 · Vite 5174" / "Angular 20 · Vite 5175").

## Per-component docs (Wave 2)

29 markdown files at `demos/component-docs/` (28 component MDs + README). Each MD covers: mission paragraph, props table (transcribed from `@Prop()`), events table (from `@Event()`), per-state usage with HTML snippets, UI/UX best-practice bullets, cross-framework note. Average ~113 lines per file. Source of truth for all 3 demos.

## Doc viewer panels (Wave 3)

Right-rail panel inside each demo's ExpandedCard. Files added per demo:
- `studio/ComponentDocsPanel.{tsx|vue|component.ts}` — fetches markdown via `import.meta.glob('../../../component-docs/*.md', { query: '?raw', import: 'default', eager: false })`
- `studio/md-to-html.ts` — ~150 LOC dependency-free MD→HTML helper. Handles fences, tables, headings, blockquotes, hr, lists, inline (bold/italic/code/links), paragraphs. Escapes user content first; the `dangerouslySetInnerHTML` / `v-html` / `bypassSecurityTrustHtml` wrappers are safe because of that.
- `app.css` — appended `.studio-docs` prose block with token-driven typography (no `@tailwindcss/typography` plugin).

**Important:** the glob path is `'../../../component-docs/*.md'` (THREE `../`), since the panels live at `demos/{framework}/src/studio/`. An earlier draft used two `../` and resolved to a non-existent `demos/{framework}/component-docs/`.

## Known fix applied during smoke test

`demos/angular-playground/src/studio/variant-tile.component.ts:142` had a backtick-wrapped HTML comment (`signal drives \`open\``) inside a TS template literal. esbuild dep-scan failed on the orphaned backticks. Replaced with plain text `the open prop`. Use plain prose in HTML comments inside Angular `template: \`…\`` blocks.

## How to apply / resume

1. `npm install` once per demo (React + Vue had `node_modules`, Angular needed a fresh install on 2026-05-10).
2. `npm run dev` in each demo folder.
3. Verify HTTP 200 on 5173 / 5174 / 5175. Open all three side-by-side to confirm pixel parity.
4. Live plan: `demos/NIGHT-SHIFT-TASK-1.md` is the SSOT.

## Hard rules in force

- No commits, no pushes
- Tokens-only, no inline styles, no SCSS
- Tailwind v4 via existing token chain
- Iconify Solar Linear glyphs, explicit width/height
- Stay strictly inside `demos/`
- Do NOT modify `libs/falcon-ui-core`, `libs/falcon-ui-tokens`, `libs/falcon-studio`, workspace `package.json` or `tsconfig.base.json`
