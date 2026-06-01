# falcon-search-input — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-search-input>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A single-line, bordered field with a **leading magnifier icon** and the placeholder `Search…` `[CODE]` `falcon-search-input.tsx:34`. When it holds text, a **clear-X** appears on the trailing edge `[CODE]` `falcon-search-input.tsx:122` (`clearable` follows whether a value exists). When a search is in flight, a small **spinner** shows on the trailing side `[CODE]` `falcon-search-input.tsx:128-135`. Crucially it has **no label, no helper text, no error line** — it is a bare field, never part of a labeled form row. Same height / border / focus-ring as `<falcon-angular-input>` because it *is* one internally (`variant="search"`).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<TextField>` with a search `InputAdornment` + manual debounce | MUI has no dedicated search input — Falcon's bundles debounce + clear + spinner |
| PrimeNG | `<p-iconfield>` + `<p-inputtext>` with a search icon (or `p-autocomplete` minus suggestions) | closest analogue; debounce is app-side in PrimeNG |
| Ant Design | `<Input.Search>` (`loading`, `allowClear`) | very close 1:1 — `loading` ≈ `loading`, `allowClear` ≈ built-in clear-X |
| Bootstrap | `<input type="search" class="form-control">` with an icon | upgrade target — no debounce/spinner |
| shadcn / Radix | `<Input type="search">` + a `<Search>` lucide icon (composed by hand) | shadcn has no search primitive — Falcon's is more specialized |
| plain HTML | `<input type="search">` | always replace with this for any search box |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a search box with a magnifier + clear-X (filters a list) | `<falcon-angular-search-input>` | input |
| a search box that drops a panel of matching suggestions | `<falcon-angular-combobox>` | search-input |
| a single-select dropdown with a search field inside its panel | `<falcon-angular-dropdown [searchable]="true">` | search-input |
| a labeled free-text form field whose value is saved | `<falcon-angular-input>` | search-input (its value is never saved) |
| an in-grid cell editor | `<falcon-angular-grid-input>` | search-input |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory` — inputs → templates → slots → variants → token override → upgrade → wrapper):
1. **Inputs** — `[placeholder]`, `[value]` (for controlled reset/clear), `size`, `[disabled]`.
2. **Wiring** — handle `(falconSearch)` → call the API directly; handle `(falconSearchClear)` only if you need the *previous* term (the reset `falconSearch('')` already fires).
3. **Debounce** — leave `debounceMs` at `300`; only change it as a deliberate cost/UX trade-off. Never add a second debounce in the consumer.
4. **Loading** — set `[loading]="true"` while your request is in flight, `false` when it settles — the spinner is yours to drive.
5. **Tokens** — restyle via `search-input.tokens.css` `--falcon-search-input-*` (icon color, spinner color, tinted bg) — never hardcode.
6. **Upgrade** — CVA support, a focus shortcut, or method proxies are GAPs (`DECISION.md` G1/G7) — raise, do not hand-roll.

## Anti-patterns
- Adding RxJS `debounceTime` on top of `(falconSearch)` — the component already debounced; you get a sluggish ~600ms.
- Using `formControlName` / CVA binding — no CVA exists; bind `[value]` + `(falconSearch)`.
- Re-fetching in both `(falconSearch)` and `(falconSearchClear)` — clear already fires a `falconSearch('')`; you would fetch twice.
- Forgetting to toggle `[loading]` off — the spinner stays forever; it is consumer-controlled.
- Using it for combobox-style suggestions, a savable form field, or a searchable dropdown — wrong component (see table).

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-search-input.tsx` + `falcon-search-input.component.ts` + `falcon-search-input.component.html`. Cross-library map 🔴 INFERRED from each library's public API. Double-event-on-clear, built-in-debounce, no-CVA ✅ VERIFIED against source.
