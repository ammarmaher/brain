# falcon-checkbox — GAPS AND UPGRADES

## Missing capabilities

### G1 — `errorText` vs `errorMessage` inconsistency (P2)

Same as dropdown / multi-select. Alias to `errorMessage`.

### G2 — No `description` or sub-label (P2)

Many designs include label + smaller description below. Today, must compose externally.

**Recommended fix:** add `@Input() description?: string` rendered as muted text below label.

### G3 — `checkedInput` is parent-bypass; not idiomatic (P3)

The `checkedInput` input is documented as the checkbox-group escape hatch. Consider renaming to `parentChecked` or moving to a directive used only inside the group, so consumers don't accidentally use it.

### G4 — No method proxies (P2)

Stencil-side methods (if any) not exposed.

### G5 — No icon customization (P3)

Check glyph is hardcoded. A `@Input() checkIcon?: string` (icon name) for branding variations could help — but most products don't need this.

### G6 — Indeterminate state resets on toggle (P3)

Matches native, but for some flows you want to retain. Consider `@Input() preserveIndeterminate = false` opt-in.

### G7 — No `description` slot / ng-content escape hatch (P3)

For rich label content (link inside agreement label), consumers must rely on default slot which the Angular wrapper projects. Verify projection works.

## Missing accessibility

- Native input handles core A11y — verify `aria-describedby` joins helper + error IDs.
- Focus ring contrast in error state — verify token.

## Missing tests

- No Angular wrapper spec located.

## Missing Tailwind / token parity

- Tailwind path needs verification on indeterminate visual.

## Performance risks

- None. Lightweight component.

## Visual / interaction risks

- Indeterminate visual must look distinct from unchecked AND checked — token verification needed.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | `errorMessage` alias | P2 |
| G2 | `description` input | P2 |
| G4 | Method proxies | P2 |
| G3 | Rename `checkedInput` | P3 |
| G6 | `preserveIndeterminate` opt-in | P3 |

## Concrete upgrade API

```ts
@Input() errorMessage?: string;        // alias
@Input() description?: string;
@Input() preserveIndeterminate = false;
async setFocus(): Promise<void>;
async toggle(): Promise<void>;
```

## Shared vs per-page

All in shared.

## Workarounds today

- For G2: wrap label content with custom HTML inside ng-content default slot.
- For G6: re-set `indeterminate` in `(valueChange)` if needed.
