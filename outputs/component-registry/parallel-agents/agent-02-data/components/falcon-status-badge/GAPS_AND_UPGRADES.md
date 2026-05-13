# falcon-status-badge — GAPS & UPGRADES

## Missing capabilities

### Adoption is the biggest gap

- **The admin-console organization-hierarchy page inlines its own status chip Tailwind classes** (`organization-hierarchy-menu.component.html:162-195`) instead of composing `<falcon-angular-status-badge>`. Same for the management-console parallel page. **P1 — refactor consumers to use the shared component.**
- Without consumer adoption, the shared component is unused in production. The risk is divergent palette decisions per page.

### Composition into table cells

- Could ship a typed `col.type='status'` on `FalconTableColumn` that auto-composes `<falcon-status-badge>` per cell when the row supplies a `status` severity. **P2** — cleaner than per-page `<ng-template>` repetition.

### Severity vocabulary

- 9 severities mapping to 4 visual buckets. Adding a new severity (e.g. `'archived'`) needs a token addition + bucket assignment. **No gap; well-bounded.**
- The Angular wrapper file re-declares `FalconStatusBadgeSeverity` (lines 23-32 in the wrapper) instead of importing from the Stencil types file. **P3 — single source of truth.**

### Slot vs `[label]`

- Stencil exposes a default slot that overrides `[label]` (`falcon-status-badge.tsx:43`). The Angular wrapper DOES include `<ng-content>` in both render paths (verified in `falcon-status-badge.component.html`). Angular consumers CAN put markup inside the badge — e.g. an icon next to text — when they don't use `[label]`.

### Icon support

- Default slot can hold an `<i class="falcon-icon …">` Stencil-side and `<ng-content>` projects this through the Angular wrapper. There's no first-class `[iconName]` input like `<falcon-badge>` has. **P3 — add `[iconName]` for shorthand.**

### A11y

- `ariaLabel` is on the Stencil side but NOT exposed by the Angular wrapper. Dot-only mode without text becomes meaningless to screen readers via the wrapper. **P2 — expose `[ariaLabel]` on the Angular wrapper.**

### Tests

- No specs. **P3** — pure presentational.

## Reusable upgrades needed

| ID | Title | Priority |
|---|---|---|
| FSB-01 | Refactor admin / management consoles to compose `<falcon-angular-status-badge>` | **P1** |
| FSB-02 | Typed `col.type='status'` in `FalconTableColumn` | **P2** |
| FSB-03 | Expose `[ariaLabel]` on Angular wrapper | **P2** |
| FSB-04 | Single source of truth for `FalconStatusBadgeSeverity` (import from types) | **P3** |
| FSB-05 | Add `[iconName]` shorthand on Angular wrapper | **P3** |

## Workarounds available

- Today: consumer composes `<falcon-angular-status-badge>` via `<ng-template falconDataTableCell>`. Works fine — just needs adoption.
- For icon + text: drop down to the Stencil tag with default slot:

```html
<falcon-status-badge-tw severity="active">
  <i class="falcon-icon falcon-icon-check"></i> Active
</falcon-status-badge-tw>
```

## Visual / interaction risks

- Color buckets are tested for contrast. Don't override the bg-color without revalidating.
- `dot=true` reserves 6px + 6px gap of horizontal space — make sure dense table cells account for it.

## Fix in shared component vs per-page

- Severity additions / bucket changes: shared component.
- Adoption refactor: per-page edits but should land at once across both consoles.

## Future-proof recommendation

Adopt the component. Then add `col.type='status'` to remove repetitive `<ng-template>` boilerplate.
