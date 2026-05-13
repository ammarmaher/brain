# falcon-dropdown — OVERVIEW

## What this is

The Falcon UI single-select dropdown — a searchable, clearable picker with a button trigger and a popover panel. The default replacement for `<p-dropdown>` / `<select>` across Falcon consoles.

## Render paths

- **Shadow DOM** — `<falcon-dropdown>` at `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.tsx` (`shadow: true`, 572 LOC — second-largest component after table).
- **Light DOM** — `<falcon-dropdown-tw>` at `libs/falcon-ui-core/src/components/falcon-dropdown-tw/falcon-dropdown-tw.tsx` (`shadow: false`).
- **Angular wrapper** — `<falcon-angular-dropdown>` at `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.ts`.

## Why it exists

- Replaces every PrimeNG `<p-dropdown>` / `<p-select>` instance in the codebase after Wave PR-8.
- Single source of design tokens (`--falcon-dropdown-*`) drives both render paths so the Studio can mutate appearance at runtime.
- Cross-framework — same Stencil tags are wrapped for React + Vue.

## Spec lineage

From comment in `falcon-dropdown.tsx:3-4`:

> Spec mirrored from `REFERENCE-V02-INVENTORY.md §2` (`.ac-select-wrap` form-style native select) and `§3` (`.tpl-share-search` search-over-list pattern), `§4` (panel + option visuals).

## Where it lives

| Layer | Path |
|---|---|
| Stencil Shadow tag | `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.tsx` |
| Stencil Light tag | `libs/falcon-ui-core/src/components/falcon-dropdown-tw/falcon-dropdown-tw.tsx` |
| Stencil styles | `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.css` |
| Types | `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.types.ts` |
| Utils (option filtering, active-index nav, error guard) | `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.utils.ts` |
| Tailwind helpers | `libs/falcon-ui-core/src/tailwind/dropdown-tailwind-classes.ts` |
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.{ts,html,css}` |
| Component tokens | `libs/falcon-ui-tokens/src/components/dropdown.tokens.css` |
| Re-export (Angular) | `libs/falcon/src/shared-ui/index.ts:44-45` |

## Standing rules

- **Single-select only.** Multi-select is a separate component: `falcon-angular-multi-select`. Comments in `add-user-wizard/user-role-status-step` flag a Wave 4 follow-up to add per-item template slot for live language switch — currently the consumer must translate option labels at construction time.
- **Type-ahead buffer** in non-searchable mode — a 600ms timer drains after the last keypress so users can type "Ja" to jump to "Jakarta".
- The active index reseeds when `options` changes (the `@Watch('options')` hook).
- The component owns the open / close lifecycle internally; consumers can also call `openPanel()` / `closePanel()` Stencil methods if needed.
- Search input lives **inside** the popover (not the trigger). Trigger button shows the selected option's label or the placeholder.
