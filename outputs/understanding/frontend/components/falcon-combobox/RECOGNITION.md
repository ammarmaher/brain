# falcon-combobox — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-combobox>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE] falcon-combobox.tsx:230-317` — A labeled, bordered **text input** (not a button-trigger) with a trailing-edge icon zone. The icon zone shows either a **spinner** (`loading`) or a **clear (×)** button when there is a value. Typing into the input opens a floating panel of options below; the option whose `label` contains the query is shown. One option is highlighted as *active* (keyboard cursor) and one may be *selected*. An empty result shows a `noResultsMessage` row. The defining tell vs a dropdown: **the user types directly into the field** — the field is an `<input role="combobox">`, not a closed value display.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Autocomplete>` (`freeSolo` for free-text; default for closed) | direct match — MUI Autocomplete IS a combobox |
| PrimeNG | `<p-autoComplete>` | direct 1:1 |
| Ant Design | `<AutoComplete>` (free-text) / `<Select showSearch>` (closed) | `<AutoComplete>` ≈ `allowFreeText=true`; `<Select showSearch>` ≈ `allowFreeText=false` |
| Bootstrap | typeahead plugin / `<datalist>` | `<input list=…>` native datalist is the closest native shape |
| shadcn / Radix | `<Combobox>` (cmdk `Command` + `Popover`) | direct match — shadcn calls it "Combobox" |
| plain HTML | `<input list="…">` + `<datalist>` | always replace with this |

## Use THIS vs siblings
The four single/multi pickers overlap — pick by the **two questions: "can the user type?" and "can the user invent a new value?"**
| If the design shows… | Use | Not |
|---|---|---|
| user **types** into the field AND can submit a value **not in the list** | `<falcon-angular-combobox>` `allowFreeText=true` | dropdown / select |
| user **types to search** but must pick an existing value | `<falcon-angular-combobox>` `allowFreeText=false` — OR `<falcon-angular-dropdown searchable>` if no free-text is ever wanted | — |
| a closed value display (button-like), click to open, NO typing into the field itself | `<falcon-angular-dropdown>` / `<falcon-angular-select>` | combobox |
| **multiple** values shown as chips | `<falcon-angular-multi-select>` | combobox |
| an always-visible list of checkboxes | `<falcon-angular-checkbox-group>` | combobox |
| a search box that filters a page/grid (not a form value) | `<falcon-angular-search-input>` | combobox |

**Decision shortcut:**
- combobox = *typed input* + optional *create-new*.
- dropdown/select = *closed picker*, search is an option inside the panel, never free-text.
- multi-select = *many values, chips*.
- The single biggest confusion: a **searchable dropdown** (`<falcon-angular-dropdown searchable>`) vs a **closed combobox** (`allowFreeText=false`). Both let you type to filter. Use dropdown when the field is fundamentally a picker; use combobox when the field is fundamentally a text input that *also* suggests.

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[items]` (suggestion list), `[(ngModel)]`/CVA, `[placeholder]`, `[label]`, `[allowFreeText]`, `[clearable]`, `[loading]`, `[noResultsMessage]`, `size`.
2. **Async suggestions** — bind `(filterChange)` → an observable → re-feed `[items]`; flip `[loading]` while the request is in flight. (Stencil already debounces 250 ms — do not double-debounce.)
3. **Templates / slots** — none today. Per-option icon / sub-label is a **GAP** (`GAPS_AND_UPGRADES.md` G6) — raise, do not hand-roll an option template.
4. **Variants** — none (`GAPS_AND_UPGRADES.md` G5). Single appearance only.
5. **Token override** — restyle via `combobox.tokens.css` vars; never hardcode.
6. **Shared upgrade** — form-level error/required/`state` is a **GAP** (`G1/G2/G4`); to show inline validation today, wrap in `<falcon-form-field>`.
7. **Wrapper** — for imperative open/close/focus (`G8`) reach the inner Stencil element, or raise the proxy gap.

## Anti-patterns
- Using a combobox where a closed picker is meant — if the user must never type free-text and never invent a value, `<falcon-angular-dropdown>` is the correct, simpler control.
- Adding your own `debounceTime` on `filterChange` — the Stencil already debounces 250 ms (`falcon-combobox.tsx:197`); stacking makes the field feel laggy.
- Expecting numeric values — combobox value is `string` only (`GAPS_AND_UPGRADES.md` G9).
- Hand-rolling an error message inline — there is no `errorMessage`/`state` input; use `<falcon-form-field>` until the gap is closed.
- Native `<input list>` / `<datalist>` or PrimeNG `<p-autoComplete>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).
- Adopting it with no business policy for free-text values — see `BUSINESS.md`: who may create, and how new values are de-duped, is undefined.

## Verification
🟡 CODE-DERIVED from `[CODE] src/components/falcon-combobox/falcon-combobox.tsx` + `[CODE] src/angular-wrapper/components/falcon-combobox/falcon-combobox.component.{ts,html}`. Cross-library map [INFERRED] from rendered structure. Component has 0 production consumers — fingerprint is code-derived, not screenshot-confirmed.
