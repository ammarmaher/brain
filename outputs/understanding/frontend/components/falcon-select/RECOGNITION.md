# falcon-select — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify the component to use and how to compose it. Sweep-refreshed 2026-06-03 (B04).
> **`falcon-select` is a pure TS alias of `falcon-dropdown`** (DEAD-CANDIDATE barrel, 0 real consumers — prefer `<falcon-angular-dropdown>`). Canonical recognition layer → `../falcon-dropdown/RECOGNITION.md`. This file disambiguates the alias only.

## Visual fingerprint
`[CODE] src/angular-wrapper/components/falcon-select/index.ts` — **There is nothing visually distinct.** The alias renders the exact `falcon-dropdown` UI: a labeled bordered field showing the current single selection (or placeholder) with a trailing chevron; click opens a floating option panel; optional search input, clear (×), per-option `iconUrl`.

## Cross-library equivalents
Identical to `falcon-dropdown`:
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Select>` / single `<Autocomplete>` | the spec word "Select" maps here |
| PrimeNG | `<p-select>` / `<p-dropdown>` | direct 1:1 |
| Ant Design | `<Select showSearch>` (single) | single-mode Select |
| Bootstrap | `.dropdown` / native `<select>` | upgrade target |
| shadcn / Radix | `<Select>` (Radix Select) | non-searchable variant |
| plain HTML | `<select>` | always replace |

## Use THIS vs siblings
The decisive question is **naming, not behavior** — `falcon-select` and `falcon-dropdown` are the same class:
| If the design / spec shows… | Use | Not |
|---|---|---|
| a control the spec calls "Select" | `FalconAngularSelectComponent` import — but template tag is `<falcon-angular-dropdown>` | `<falcon-angular-select>` tag (does not exist) |
| a control the codebase calls "Dropdown" | `<falcon-angular-dropdown>` directly | the alias (adds nothing) |
| **multiple** values picked | `<falcon-angular-multi-select>` | select / dropdown |
| free typing that also accepts new text | `<falcon-angular-combobox>` | select / dropdown |
| an always-visible list of checkboxes | `<falcon-angular-checkbox-group>` | select / dropdown |
| indented / expandable option rows | `<falcon-angular-tree>` | select / dropdown |

**Rule of thumb:** if you only need ONE value from a closed list → it is `falcon-dropdown`. `falcon-select` is just its spec-named import alias — never a different component.

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`) — identical to `falcon-dropdown`:
1. **Inputs** — `[options]`, `[(ngModel)]`/CVA, `[placeholder]`, `[searchable]`, `[clearable]`, `[disabled]` (property!), `size` / `variant`.
2. **Per-option icon** — `iconUrl` on each option.
3. **Token override** — restyle via `dropdown.tokens.css` (the alias has no own token file).
4. **Custom option rows** beyond `iconUrl`+`label` → GAP — raise, do not hand-roll.
5. **Wrapper** — if you genuinely need a real `<falcon-angular-select>` tag, that is a library enhancement, not app-level work.

## Anti-patterns
- Writing `<falcon-angular-select>` in a template — the alias is class-level only; the tag is `<falcon-angular-dropdown>`.
- Treating `falcon-select` as a separate component to customize — any change is a change to `falcon-dropdown`.
- Expecting native `<select>` semantics — it is a custom popover.
- Using it for multi-select or free text — wrong component (see table).

## Verification
🟡 CODE-DERIVED from `[CODE] src/angular-wrapper/components/falcon-select/index.ts` + `../falcon-dropdown/RECOGNITION.md`. Alias-only nature ✅ VERIFIED against the re-export.
