# falcon-dropdown — DECISION

## Brain SK final recommendation

**STATUS: READY for single-select. NEEDS-UPGRADE for advanced customization (per-option templates, async, multi).**

## Use this component for

- Single-value picker from a static list of options.
- Searchable picker when option count > 10.
- Type-ahead navigation (Closed dropdown picks via printable keys).
- Language / locale picker (via `iconUrl` Wave 4 pattern).

## Avoid this component for

- Multi-value selection → `<falcon-angular-multi-select>`.
- Free-text + selectable suggestions → `<falcon-angular-combobox>`.
- Server-side async loaded options → wait for G4 upgrade.
- Tree-shaped options → `<falcon-angular-tree>`.
- Country picker INSIDE phone field → `<falcon-angular-phone-field>`.

## Preferred render path

`useTailwind=true` (default). Toggle to Shadow only when you need full Stencil method access OR `slot="options"` for custom panel content.

## Required upgrades before wider use

None blocking. For specific use-cases:
- Per-option custom rendering → need G1.
- Server-side options → need G4.
- Multi-select → use different component.

## Relationship to other components

- Sibling specialist: `<falcon-angular-multi-select>`, `<falcon-angular-combobox>`.
- Shares form-control DNA with `<falcon-angular-input>`, `<falcon-angular-textarea>`, `<falcon-angular-input-number>`.
- Often composed inside `<falcon-angular-data-table>` filter rows + `<falcon-angular-filter-panel>`.

## Exact rule for future implementation

1. Single-select from known list? → `<falcon-angular-dropdown>`.
2. Set `searchable=true` if > 10 options.
3. Bind value via `formControlName` or `[(ngModel)]`.
4. Use `errorText` + `state="error"` together.
5. Set `clearable=true` for optional fields.
6. Use `iconUrl` on options for flags/avatars.
7. Use per-instance token override (host class) for visual tweaks. Never hardcode hex / px.

---

## Dynamic capability assessment

### 1. What is static today?
- Inline SVG paths for chevron / clear / search icons.
- Type-ahead drain timer (600ms hardcoded).
- Panel placement (always below trigger).
- `slot="options"` only available via raw Stencil tag.

### 2. What is already dynamic through inputs/outputs?
- 17 wrapper inputs covering size / state / variant / appearance / searchable / clearable / etc.
- 3 outputs (`valueChange`, `opened`, `closed`).
- CVA full support.
- Stencil-side: 6 outputs total + 4 methods.

### 3. What is dynamic through slots / ng-template?
- Stencil: `slot="options"` only.
- Angular wrapper: **none** (G1).

### 4. What is dynamic through tokens?
- Every visual axis (~80+ `--falcon-dropdown-*` tokens).
- Per-instance override via host class.

### 5. What is dynamic through Tailwind classes?
- `wrapperClass`, `triggerClass`, `panelClass`, `optionClass`, `labelClass` (Tailwind path).
- Host-level `class=` for layout.

### 6. What is missing for cross-page reuse?
- Per-option template (G1).
- `setFocus()` / `openPanel()` proxies (G6).
- Async option loading (G4).
- `searched` event re-emission (G7).
- Grouped options (G5).
- `errorMessage` alias (G2).

### 7. What goes in shared (not page-hack)?
- All of the above. Per-page hacks for per-option rendering or async loading would re-implement the same plumbing.

### 8. What flags / options would make it better?
- `<ng-template falconDropdownOption let-option>` directive.
- `loadOptions(query)` async source.
- `group` field on options.
- `searched` output for server-side filter.
- `virtualScroll` for large lists.

### 9. Safest upgrade path?
1. Add `setFocus()` / `openPanel()` / `clear()` Angular method proxies (additive).
2. Add `errorMessage` alias (additive, soft-deprecate `errorText`).
3. Add `searched` `@Output`.
4. Add `FalconDropdownOptionTemplateDirective` + `@ContentChild` projection.
5. Add `loadOptions` async hook (last — bigger impact).

### 10. Risky to change?
- The `pushOptions()` timing — race-fix relies on `componentOnReady`. Don't refactor without tests.
- Switching default to `useTailwind=false` — would break Shadow-host CSS rules consumers added.
- Renaming `errorText` to `errorMessage` without alias — silent breakage in templates.
- Type-ahead 600ms drain — some accessibility flows depend on this timing.
