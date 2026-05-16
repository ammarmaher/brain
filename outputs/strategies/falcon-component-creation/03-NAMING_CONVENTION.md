# 03 — Naming Convention

> Every name in every layer derives mechanically from the **component kebab-case base** (`empty-state`, `empty-data`, `phone-field`, …). No naming creativity — only this table.

## 1. The naming table

[CODE] Verified against `falcon-empty-state`, `falcon-accordion`, `falcon-empty-data` (2026-05-14).

| Element | Convention | Example (`empty-state`) | Example (`phone-field`) |
|---|---|---|---|
| Component base | `<kebab>` | `empty-state` | `phone-field` |
| Component Pascal | `<Pascal>` | `EmptyState` | `PhoneField` |
| Stencil Shadow tag | `falcon-<kebab>` | `falcon-empty-state` | `falcon-phone-field` |
| Stencil Light tag | `falcon-<kebab>-tw` | `falcon-empty-state-tw` | `falcon-phone-field-tw` |
| Angular wrapper selector | `falcon-angular-<kebab>` | `falcon-angular-empty-state` | `falcon-angular-phone-field` |
| Stencil Shadow class | `Falcon<Pascal>` | `FalconEmptyState` | `FalconPhoneField` |
| Stencil Light class | `Falcon<Pascal>Tw` | `FalconEmptyStateTw` | `FalconPhoneFieldTw` |
| Angular wrapper class | `FalconAngular<Pascal>Component` | `FalconAngularEmptyStateComponent` | `FalconAngularPhoneFieldComponent` |
| Types file | `falcon-<kebab>.types.ts` | `falcon-empty-state.types.ts` | `falcon-phone-field.types.ts` |
| Types class (size union) | `Falcon<Pascal>Size` | `FalconEmptyStateSize` | `FalconPhoneFieldSize` |
| Types class (variant union) | `Falcon<Pascal>Variant` | `FalconEmptyStateVariant` | `FalconPhoneFieldVariant` |
| Types class (event detail) | `Falcon<Pascal><Verb><Noun>Detail` | `FalconEmptyStateActionClickDetail` | `FalconPhoneFieldChangeDetail` |
| Utils file | `falcon-<kebab>.utils.ts` | `falcon-empty-state.utils.ts` | `falcon-phone-field.utils.ts` |
| Token prefix | `--falcon-<kebab>-*` | `--falcon-empty-state-padding-y` | `--falcon-phone-field-bg` |
| Token file | `<kebab>.tokens.css` | `empty-state.tokens.css` | `phone-field.tokens.css` |
| Tailwind helper module | `<kebab>-tailwind-classes.ts` | `empty-state-tailwind-classes.ts` | `phone-field-tailwind-classes.ts` |
| Tailwind helper function | `falcon<Pascal><Part>Classes` | `falconEmptyStateRootClasses` | `falconPhoneFieldInputClasses` |
| Event name (Stencil) | `falcon-<verb>-<noun>` | `falcon-action-click` | `falcon-change` |
| Angular wrapper `@Output` | `falcon<VerbNoun>` (camelCase) | `falconActionClick` | `falconChange` |
| CSS class chain | `.falcon-<kebab>-<part>` | `.falcon-empty-state-root`, `.falcon-empty-state-icon`, `.falcon-empty-state-title` | `.falcon-phone-field-input` |
| Part attribute | `part="<lower-kebab>"` | `part="root"`, `part="title"` | `part="input"` |
| Data attribute | `data-<lower-kebab>` | `data-size`, `data-state` | `data-prefix` |

## 2. Token cascade scope selector

[CODE] `libs/falcon-ui-tokens/src/components/empty-state.tokens.css` line 15.

Every token file MUST scope its declarations with the EXACT 5-target `:where()` selector:

```css
:where(falcon-X, falcon-X-tw, falcon-angular-X, .falcon-X, [data-falcon-X]) {
  --falcon-X-...: ...;
}
```

Where `X` is the kebab-case base.

Example for `empty-state`:

```css
:where(falcon-empty-state, falcon-empty-state-tw, falcon-angular-empty-state, .falcon-empty-state, [data-falcon-empty-state]) {
  --falcon-empty-state-gap: 12px;
  --falcon-empty-state-padding-y: 32px;
  /* ... */
}
```

**Why 5 targets:**

| Target | Reaches |
|---|---|
| `falcon-X` | Stencil Shadow tag host |
| `falcon-X-tw` | Stencil Light tag host |
| `falcon-angular-X` | Angular wrapper host element |
| `.falcon-X` | Utility-class fallback (hand-rolled HTML using the visual treatment) |
| `[data-falcon-X]` | Data-attr fallback (e.g. a third-party shell that can't add classes) |

[INFERRED] `:where()` keeps specificity 0,0,0 so app-level overrides never need `!important`.

## 3. Event naming sub-rules

| Stencil emit | Angular wrapper `@Output()` |
|---|---|
| `falcon-change` | `falconChange` |
| `falcon-input` | `falconInput` |
| `falcon-focus` | `falconFocus` |
| `falcon-blur` | `falconBlur` |
| `falcon-clear` | `falconClear` |
| `falcon-expand` | `falconExpand` |
| `falcon-collapse` | `falconCollapse` |
| `falcon-action-click` | `falconActionClick` |
| `falcon-cells-mounted` | `falconCellsMounted` |

[CODE] `falcon-accordion.tsx` line 57-62 — `eventName: 'falcon-change'` kebab. [INFERRED] Wrapper `@Output()` is camel `falconChange`.

**Compound verb-noun events** (`falcon-action-click`, `falcon-cells-mounted`, `falcon-tab-select`): hyphenate every word. The detail interface follows `Falcon<Pascal><VerbNoun>Detail`.

## 4. Part-attribute sub-rules

[CODE] `falcon-empty-state.tsx` — uses `part="root"`, `part="icon"`, `part="title"`, `part="description"`, `part="action"`.

| Rule | Example |
|---|---|
| One word, lowercase | `part="root"`, `part="header"`, `part="footer"` |
| Multi-word, kebab | `part="header-end"`, `part="panel-inner"` |
| Conditional part | `part={expanded ? 'panel panel-expanded' : 'panel'}` (space-separated to expose multiple part identities) |

Parts are the caller's surface to pierce Shadow DOM via `::part(root) { ... }`. **Every named slot owner gets a part.**

## 5. Slot naming sub-rules

| Stencil declaration | Angular consumer markup |
|---|---|
| `<slot />` (default) | `<falcon-angular-X>default content</falcon-angular-X>` |
| `<slot name="action" />` | `<button slot="action">Retry</button>` |
| `<slot name={`content-${item.value}`} />` (dynamic) | `<div slot="content-foo">…</div>` |

**All named slot names are lowercase-kebab.** Never camelCase. Never PascalCase.

## 6. CSS class chain naming

[CODE] `falcon-empty-state.css`.

```
.falcon-X-root          ← outermost div inside Host
.falcon-X-<part>        ← every named region (.falcon-X-header, .falcon-X-body, .falcon-X-footer, .falcon-X-icon, etc.)
.falcon-X-<part>--<modifier>  ← BEM-style modifier when needed (e.g. .falcon-X-item--disabled)
```

**Modifier on host attribute** (preferred for size / variant / state):

```css
:host([size='sm']) .falcon-X-title { font-size: var(--falcon-X-title-size-sm); }
```

[CODE] `falcon-empty-state.css` lines 74-92.

## 7. File-naming summary

| Stencil Shadow folder | `libs/falcon-ui-core/src/components/falcon-<kebab>/` |
| Stencil Light folder | `libs/falcon-ui-core/src/components/falcon-<kebab>-tw/` |
| Angular wrapper folder | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-<kebab>/` |
| Token file | `libs/falcon-ui-tokens/src/components/<kebab>.tokens.css` (note: NO `falcon-` prefix on the file name) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/<kebab>-tailwind-classes.ts` (note: NO `falcon-` prefix on the file name) |

[CODE] Verified against `empty-state.tokens.css` and `empty-state-tailwind-classes.ts` 2026-05-14 — the tokens lib and Tailwind helpers DROP the `falcon-` filename prefix because the lib directory itself is `falcon-ui-tokens` / `tailwind`.

_Last updated: 2026-05-14 — Strategy v1.0 — Author: Adnan (auto)_
