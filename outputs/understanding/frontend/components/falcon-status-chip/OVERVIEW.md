# falcon-status-chip — OVERVIEW

> Created 2026-06-03 (B24 deep-dive sweep). **Single-render Angular shared-ui component** in `libs/falcon/src/shared-ui/` — NO Stencil Shadow/`-tw` twin, NO `libs/falcon-ui-tokens` component file. It is a pure Angular template-only status pill that consumes Tailwind utilities + Falcon theme color tokens directly. (Contrast with the gold `falcon-input`, which is the dual-render Stencil reference.)

## Component purpose

A small **status indicator** (pill / chip) that renders a translated status label with a state-keyed color. `[CODE]` `falcon-status-chip.component.ts:1-7` declares it "the **single source of truth for status indicators across the Falcon platform**". One component, two visual variants:
- `filled` (default) — a soft tinted rounded pill (background + colored text + optional leading dot). Used in table cells + info cards.
- `text` — bare italic colored text (no background, no border). Used inline in dense tables (checker sub-lines, history action cells) where a filled pill would be too heavy.

Status → color comes from a `const`-record (`STATUS_TOKENS`) mapping each status to `bg-falcon-{green|amber|red|neutral}-*` / `text-falcon-*-700` / `bg-falcon-*-500` Tailwind utilities, so runtime theme changes flow through the underlying Falcon color tokens automatically (`[CODE]` ts:39-76).

## Business / UI use case

- **Templates page** status column — a template's lifecycle status (`approved` / `pending` / `review` / `rejected` / `deleted`) rendered as a filled pill inside a `<falcon-angular-data-table>` cell.
- **Checker sub-lines** — the maker/checker review state under a name, rendered as `variant="text"` italic text with no dot (`[CODE]` templates-list.component.html:225-266).
- **Falcon-status column** — a domain-specific status, with the label overridden via `[labelKey]` (`[CODE]` templates-list.component.html:335-340).
- **`none`** is the placeholder for "---" / empty cells (`[CODE]` ts:13-21,70-75 — neutral pill, `templates.status.na`).

## When to use it / when NOT to use it

**Use it for:**
- A small status badge whose status is one of the six known lifecycle states (`approved` / `pending` / `rejected` / `deleted` / `review` / `none`) — especially inside a data-table cell or info card.
- An inline status sub-line in a dense table where a full pill is too heavy → `variant="text"`.
- Any place that previously hand-rolled a tinted `<span class="status …">` for a template/maker-checker status.

**Do NOT use it for:**
- The **wider account / user lifecycle status set** (`active` / `suspended` / `locked` / `inactive` / `paid` / `expired` / `disabled`) → use the Stencil `<falcon-angular-status-badge>` from `@falcon/ui-core` (9 severities, dual-render, `min-width` + `capitalize` reference look). `falcon-status-chip` only knows 6 templates-domain statuses.
- A generic severity tag / dismissible chip (success / info / warning / danger / secondary / contrast, optional `×`) → use `<falcon-angular-tag>` from `@falcon/ui-core`.
- A numeric counter / dot badge on an icon → use `<falcon-badge>` / `<falcon-card-status>`.
- Anything needing `sm`/`md`/`lg` parity with the platform status-badge sizing scale — this chip has only `sm`/`md`.

> See `RECOGNITION.md` for the full "use-this-vs-status-badge-vs-tag" disambiguation and the **partial-duplication finding** (this chip overlaps the platform `<falcon-status-badge>` in intent but with a disjoint, templates-scoped status vocabulary — flagged G1).

## Status

**ACTIVE / IN-PRODUCTION (templates-page scoped).** `[CODE]` Consumed by the Templates list + details pages in BOTH admin-console and management-console. Standalone, signal `input()`s, `OnPush`, template-inline (no external HTML/CSS file). Tailwind-only. **NOT a deprecation candidate**, but **NOT** the platform-wide status component its own header comment claims to be — its status vocabulary is templates-specific and disjoint from `<falcon-status-badge>` (G1).

## Replaces

- `[INFERRED]` Hand-rolled tinted `<span>` status markup in the templates list/details tables (the component was extracted to centralize that pattern for the templates domain).

## Source file paths

| Layer | Path |
|---|---|
| Angular component TS (template inline) | `libs/falcon/src/shared-ui/lib/components/falcon-status-chip/falcon-status-chip.component.ts` (134 ln) |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-status-chip/index.ts` |
| HTML | **None** — template is inline (`template:` in the `@Component` decorator). |
| CSS / SCSS | **None** — Tailwind utility classes inline; no component stylesheet. |
| Token file (`libs/falcon-ui-tokens`) | **None** — single-render shared-ui component; consumes Falcon theme color tokens via `bg-falcon-*` / `text-falcon-*` utilities directly. |
| Stencil Shadow / `-tw` twin | **None** — this is NOT a dual-render Stencil component. |
| Spec / tests | **None** — no `*.spec.ts` on disk (Glob 2026-06-03). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-status-chip` |
| Stencil | None (single-render Angular). |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-status-chip[\s>]` across the repo = **28 occurrences / 8 files** (4 HTML templates + 4 TS files importing `FalconStatusChipComponent`):

- `apps/admin-console/.../templates-page/components/templates-list.component.html` (6 occ) + `.component.ts` (import).
- `apps/admin-console/.../templates-page/components/templates-details/templates-details.component.html` (6 occ) + `.component.ts` (import).
- `apps/management-console/.../templates-page/components/templates-list.component.html` (6 occ) + `.component.ts` (import).
- `apps/management-console/.../templates-page/components/templates-details/templates-details.component.html` (6 occ) + `.component.ts` (import).
- `apps/{admin,management}-console/.../templates-page/models/template.model.ts` — reference the `FalconStatusChipStatus` type (non-render type import).

See `USAGE.md` Consumer Sweep for the enumerated list.

## Related components

- **`<falcon-angular-status-badge>`** (`@falcon/ui-core`, Stencil dual-render) — the platform account/user **status badge** with a 9-severity vocabulary. Overlapping INTENT, disjoint status set. The closest sibling; the "is it a duplicate?" answer is *partial-overlap, not a true duplicate* (G1).
- **`<falcon-angular-tag>`** (`@falcon/ui-core`, Stencil) — generic severity tag / dismissible chip (success/info/warning/danger/secondary/contrast). Different axis (generic severity, not domain status).
- **`<falcon-angular-data-table>`** — the usual host: `falcon-status-chip` is projected into a `falconDataTableCell` `<ng-template>` cell (`[CODE]` templates-list.component.html:216-221).
- **`falcon-tag` / `falcon-badge` / `falcon-card-status`** Stencil components — other status/label primitives in `falcon-ui-core`.

## Ownership / responsibility

`libs/falcon/src/shared-ui` (Falcon shared-ui, single-render Angular). Owned by the Falcon FE team. No cross-framework (React/Vue) surface — Angular-only.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24, NEW). Source read in full (`falcon-status-chip.component.ts` 134 ln + `index.ts`); single-render confirmed (inline template, no HTML/CSS/SCSS/token file/Stencil twin). Consumer sweep `<falcon-status-chip[\s>]` → 28 occ / 8 files (4 HTML + 4 TS). Sibling overlap with `<falcon-status-badge>` (9-severity Stencil) + `<falcon-angular-tag>` confirmed from the `@falcon` barrel + Stencil type files. i18n key strings 🟡 CODE-DERIVED from the `STATUS_TOKENS` record (the `*.json` location was not indexed in this read).
