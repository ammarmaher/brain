---
name: project-data-table-kebab-and-menu-item-hover-2026-05-20
description: Data-table per-row 3-dot kebab + popup menu-item hover/active polish. Hover = soft card + primary dots. Open = primary fill + white dots. Item hover = primary bg + white text + white icon. Scoped to the data-table row-action menu (other Falcon menus untouched).
metadata: 
  node_type: memory
  type: project
  originSessionId: eff03b33-3df5-4728-ad51-5af5aa73e727
---

# Data-table kebab + menu-item hover polish — 2026-05-20

🟢 BUILD-GREEN 2026-05-20 (admin `5a62a48a492ec4df` / mgmt `f6b58077d88e9b97` / host-shell `27547aa0c24f45ee` — after the SM-radius follow-up). Runtime visual not yet verified.

> Follow-up 2026-05-20: per Ammar's screenshot the hover card looked too rounded. `--falcon-data-table-action-btn-border-radius` switched from `--radius-md` (12 px) → `--radius-sm` (8 px) so the kebab radius now matches `--falcon-data-table-wrap-radius` (table container).

> Follow-up 2026-05-20 #2: org-hierarchy tree kebab brought to the same visual contract. **Sizes/border-widths preserved** (Ammar's explicit constraint — don't change kebab dimensions). Token tweaks in `organization-hierarchy.tokens.css`:
> - `--falcon-org-hierarchy-menu-btn-bg-hover`: `teal-100` → `neutral-50` (matches data-table soft surface)
> - NEW `--falcon-org-hierarchy-menu-btn-shadow-hover`: `0 2px 6px rgba(0,0,0,0.08), inset 0 0 0 1px var(--color-falcon-neutral-200)` — uses **inset** shadow as a fake border so the button's outer width/height and the sticky `inset-inline-end` offset never shift.
> - NEW `--falcon-org-hierarchy-menu-btn-shadow-open`: `0 2px 6px rgba(13,63,68,0.18)` — soft teal-tinted lift while popup is open
> - `--falcon-org-hierarchy-ctx-menu-item-bg-hover`: `teal-600` → `teal-700` (matches data-table popup item hover)
>
> CSS in `falcon-organization-hierarchy-tree-tw.tsx` extended: kebab `:hover` now sets `box-shadow: var(--falcon-org-hierarchy-menu-btn-shadow-hover) !important`; `[data-open="true"]` sets `box-shadow: var(--falcon-org-hierarchy-menu-btn-shadow-open) !important`; transition list adds `box-shadow`. **Pitfall caught**: the entire CSS block lives inside a tagged template literal — wrapping `!important` in backticks inside a comment terminated the literal early; fixed by dropping the backticks.

> Follow-up 2026-05-20 #3 (after Ammar reported "not applied"): **two real bugs found**:
> 1. **Token cascade gap** — `organization-hierarchy.tokens.css` `:where(...)` selector listed `falcon-organization-hierarchy` and `falcon-organization-hierarchy-tw` but the actual Stencil tag is `falcon-organization-hierarchy-tree-tw` (extra `-tree-`). So **none of the `--falcon-org-hierarchy-*` vars ever cascaded** to the rendered element — the kebab + ctx-menu fell through to inherited / undefined values. Selector expanded to include `falcon-organization-hierarchy-tree`, `falcon-organization-hierarchy-tree-tw`, `falcon-angular-organization-hierarchy`, `falcon-angular-organization-hierarchy-tree`, and the host-shell Angular wrapper `app-organization-hierarchy-tree`.
> 2. **Icon hover-flip missed** — the ctx-menu item's `<i>` icon carries its own inline `color` style tied to `item.highlight` only. `onMouseEnter` updated the BUTTON's bg + color but never touched the icon, so icons stayed at the resting `neutral-600` while the label and bg went primary. Both `onMouseEnter` and `onMouseLeave` now query the child `<i>` and flip its color in step. (Same data-table parity contract: hover = primary bg + WHITE label + WHITE icon.)
>
> Final builds: admin `d1120298f81316dc` / mgmt `e90ffc38164c05db` / host-shell `809f03c88a380d90`.

> Follow-up 2026-05-21 (after Ammar reported "still not applied"): **previous follow-up touched the WRONG component**. The real consumer of the tree kebab in host-shell is `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/` (`<falcon-tree-panel>`, used by `app-organization-hierarchy-tree`), NOT the Stencil `<falcon-organization-hierarchy-tree-tw>` I had been editing — that latter component isn't even rendered. The tree-panel mounts a single `<falcon-angular-menu>` (Light DOM via `useTailwind=true`) with an inline `rootClass` that ALREADY attempted to set `[--falcon-menu-item-bg-hover:var(--color-falcon-teal-700)]` and `[--falcon-menu-item-color-hover:var(--color-falcon-neutral-0)]` as Tailwind arbitrary properties. Tailwind compiles them, but the cascade has not been observed to land at runtime for these specific tokens — the hover stayed at default neutral-100. **Fix**: extended the scoped block in `menu.tokens.css` to cover BOTH consumers — `.falcon-data-table-row-action-menu, .falcon-tree-action-menu { --falcon-menu-item-bg-hover: teal-700; --color-hover: white; --icon-color-hover: white; }`. Dropped the two broken arbitrary-property assignments from the tree-panel's inline rootClass and replaced them with the `falcon-tree-action-menu` class. Geometry overrides (panel size, padding, radii, z-index) stayed inline because they're tree-panel-specific. The scoped block now serves as the single source of truth for the "popup action menu" hover contract; added an inline note warning future authors NOT to retry the arbitrary-property approach. Final builds: admin `06d7de9aa5e39208` / mgmt `a07169549b9fc8ce` / host-shell `75462bdc27866efd`.

## What changed

Per-row 3-dot kebab `<button class="falcon-table-row-actions-trigger">` and its popup menu (the one the data-table mounts via `<falcon-angular-menu>`) now have explicit hover + open states matching user-supplied screenshots.

### Kebab — 3 states (all token-driven)
| State | Look | Tokens |
|---|---|---|
| Default | transparent surface, neutral-900 dots, transparent border | `--falcon-data-table-action-btn-bg` / `-color` / `-border-*` |
| Hover | neutral-50 fill + 1 px neutral-200 border + soft shadow + **PRIMARY teal dots** (screenshot 1) | `--falcon-data-table-action-btn-bg-hover` / `-color-hover` / `-border-color-hover` / `-shadow-hover` |
| Open | **PRIMARY teal fill + WHITE dots** + teal border (screenshot 2) | `--falcon-data-table-action-btn-bg-active` / `-color-active` / `-border-color-active` / `-shadow-active` |

### Popup menu items — scoped to data-table row-action menus
On hover any menu item flips to PRIMARY teal background, WHITE label, WHITE icon. Other Falcon menus (account menu, generic dropdowns) keep their stock neutral hover.

## How the open state is wired

There's no `aria-expanded` on the kebab and Stencil's `<falcon-table-tw>` doesn't track which kebab is "open." The Angular wrapper handles it:

```ts
// falcon-data-table.component.ts
private openActionAnchor: HTMLElement | null = null;

private onRowActionTrigger(detail) {
  // re-anchor on different kebab: clear old data-open first
  if (this.openActionAnchor && this.openActionAnchor !== detail.anchor) {
    this.openActionAnchor.removeAttribute('data-open');
  }
  this.openActionAnchor = detail.anchor as HTMLElement;
  this.openActionAnchor.setAttribute('data-open', 'true');
  void this.rowMenu?.showAt(detail.anchor);
}

protected onRowMenuClose() {  // wired to (falconMenuClose)
  if (this.openActionAnchor) {
    this.openActionAnchor.removeAttribute('data-open');
    this.openActionAnchor = null;
  }
}
```

The CSS uses `.falcon-table-row-actions-trigger[data-open="true"]` listed AFTER the `:hover` rules so the open state wins even when the cursor is still over the kebab. Tailwind class builder mirrors this via `data-[open=true]:` + `data-[open=true]:hover:` variants.

`falconMenuClose` fires for outside-click, Escape, item-select, AND the Stencil toggle-close path (clicking the same kebab again) → covers every close path. Re-anchoring on a DIFFERENT kebab does NOT emit close from Stencil, so the wrapper explicitly clears the old `data-open` before setting the new one.

## How the menu-item hover is scoped

The `<falcon-angular-menu>` mounted by the data-table now carries `rootClass="falcon-data-table-row-action-menu"`. `menu.tokens.css` has a scoped block that overrides only the hover tokens on that class:

```css
.falcon-data-table-row-action-menu {
  --falcon-menu-item-bg-hover: var(--color-falcon-teal-700, #0d3f44);
  --falcon-menu-item-color-hover: var(--color-falcon-neutral-0, #ffffff);
  --falcon-menu-item-icon-color-hover: var(--color-falcon-neutral-0, #ffffff);
}
```

`<falcon-menu-tw>` is Light DOM so CSS vars cascade from the host element down into the menu panel + items. Other consumers of `<falcon-angular-menu>` are unaffected — they don't carry the scoped class.

### New icon-color-hover token
`--falcon-menu-item-icon-color-hover` was added (defaults to `--falcon-menu-item-icon-color` so the global default is "no flip"). Two consumption sites:

- **Shadow CSS** (`falcon-menu.css`): `.falcon-menu-item:hover .falcon-menu-item-icon { color: var(--falcon-menu-item-icon-color-hover); }` — uses descendant selector.
- **Tailwind class builder** (`menu-tailwind-classes.ts`): the item button now carries the `group` utility; the icon span carries `group-hover:text-[color:var(--falcon-menu-item-icon-color-hover)]` so it flips in step with the parent's `hover:text-...`.

## Files changed (8)

| File | Change |
|---|---|
| `libs/falcon-ui-tokens/src/components/data-table.tokens.css` | Expanded §13 (ACTION BUTTON) with 8 new state tokens: default bg/color/border-width/border-color/border-radius/shadow + hover bg/color/border-color/shadow + active bg/color/border-color/shadow |
| `libs/falcon-ui-tokens/src/components/menu.tokens.css` | Added `--falcon-menu-item-icon-color-hover` token + scoped `.falcon-data-table-row-action-menu` override block at end |
| `libs/falcon-ui-core/src/components/falcon-table/falcon-table.css` | `.falcon-table-row-actions-trigger` rewritten to consume the new tokens; added `[data-open="true"]` rule (listed after `:hover`) |
| `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts` | `falconTableRowActionTriggerClasses()` rewritten with hover + `data-[open=true]:` + `data-[open=true]:hover:` variants |
| `libs/falcon-ui-core/src/components/falcon-menu/falcon-menu.css` | Added `.falcon-menu-item:hover .falcon-menu-item-icon { color: var(--falcon-menu-item-icon-color-hover); }` |
| `libs/falcon-ui-core/src/tailwind/menu-tailwind-classes.ts` | Added `group` utility to item button base classes; added `group-hover:text-[color:var(--falcon-menu-item-icon-color-hover)]` to icon span classes |
| `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.html` | `rootClass="falcon-data-table-row-action-menu"` + `(falconMenuClose)="onRowMenuClose()"` on the rowMenu |
| `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts` | New `openActionAnchor` field; `onRowActionTrigger` stamps `data-open="true"` on the anchor and clears previous; new `onRowMenuClose` clears it |

## Build evidence

| Target | Result |
|---|---|
| `nx build falcon-ui-tokens` | OK — registry now 51 components / **3614 tokens** (was 3596 → **+18 tokens** matching the new state set) |
| `nx build falcon-ui-core` | OK 36.59 s (only pre-existing `scrollHeight` reserved-prop warnings — unrelated) |
| `nx build admin-console` | OK 32.05 s, hash `f09590cafe84aaf3` |
| `nx build management-console` | OK 29.41 s, hash `ff194351a4fe5352` |
| `nx build host-shell` | OK |

## Verification gaps

- 🔴 Runtime visual not verified. User must hover/click kebabs on Apps tab / Services tab / Users list / Comm Channels tab to confirm parity with the supplied screenshots.
- 🔴 Keyboard interaction: focus-visible on kebab still uses pre-existing focus-ring (no token change). Verify Tab + Enter on the kebab still works after the new border-color transition is on the box-shadow property list.

## Source prefixes used

- [CODE] [falcon-table-tw.tsx:1549](Falcon/falcon-web-platform-ui/libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx) — kebab button in row uses `falconTableRowActionTriggerClasses()`
- [CODE] [table-tailwind-classes.ts:322](Falcon/falcon-web-platform-ui/libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts) — TW class builder
- [CODE] [falcon-table.css:304](Falcon/falcon-web-platform-ui/libs/falcon-ui-core/src/components/falcon-table/falcon-table.css) — Shadow CSS
- [CODE] [data-table.tokens.css:155](Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/data-table.tokens.css) — section 13 (ACTION BUTTON)
- [CODE] [menu.tokens.css:67](Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/menu.tokens.css) — menu item tokens
- [CODE] [falcon-data-table.component.ts:1102](Falcon/falcon-web-platform-ui/libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts) — `onRowActionTrigger`

## See also

- [[project-data-table-skeleton-loading-system-2026-05-20]] — sibling data-table polish landed same day
- [[project-data-table-alignment-contract-v1-2026-05-20]] — table token doctrine that this change extends
