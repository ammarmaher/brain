# falcon-multi-select — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-multi-select>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[BRAIN-OUT]` `OVERVIEW.md` + `[CODE]` falcon-multi-select.tsx — Two faces:

**Selection face (`displayMode="default"`):** a labeled, bordered field whose value area shows **multiple removable chips** (one per selected value), each with an × to remove it. When more values are selected than `maxChipsVisible` (default 3), a **"+N more" overflow pill** replaces the surplus. A trailing **chevron** opens a floating panel. The panel can carry: a **search input** at the top (`searchable`), a tri-state **"Select all"** row (`showSelectAll`), and a list of options each showing a **checkmark** + `label`. A **clear-all (×)** affordance can sit in the trigger (`clearable`). The decisive tell vs a dropdown: the trigger shows **chips**, not a single value.

**Display face (`displayMode="chip-list"` — the live look):** a borderless pill-style strip showing one (or a few) chips followed by a small teal **"+N" badge button**. No chevron, no trigger border. Clicking "+N" opens a small **dialog** listing every name with a teal circular check icon (an audience/tag viewer, e.g. a Templates "Shared with" cell) — `[CODE]` html:12-97. The tell: a compact pill strip with a teal "+N" badge and no field chrome.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Autocomplete multiple>` | renders chips in the input — direct match |
| PrimeNG | `<p-multiSelect>` | direct 1:1 — this component replaced `<p-multiSelect>` |
| Ant Design | `<Select mode="multiple">` / `mode="tags"` | `mode="multiple"` for closed list; `tags` ≈ free-create (use `falcon-combobox` instead for create-new) |
| Bootstrap | no native multi-chip; `<select multiple>` or a plugin | `<select multiple>` is the crude native form |
| shadcn / Radix | no first-class multi-select; community `MultiSelect` (cmdk-based) | community pattern — Falcon multi-select is the equivalent |
| plain HTML | `<select multiple>` | always replace with this |

## Use THIS vs siblings
The four pickers overlap — pick by **"one value or many?"** then **"closed list, typed, or checkboxes?"**
| If the design shows… | Use | Not |
|---|---|---|
| **multiple** values as removable chips in a field, opened by a chevron | `<falcon-angular-multi-select>` (default mode) | dropdown / select |
| a compact **chip strip + "+N" badge** that opens a names dialog (display-only) | `<falcon-angular-multi-select displayMode="chip-list">` | a hand-rolled chip strip |
| a **"+N more"** pill or a tri-state "Select all" row in a panel | `<falcon-angular-multi-select>` | — |
| exactly **one** value picked from a closed list | `<falcon-angular-dropdown>` / `<falcon-angular-select>` | multi-select |
| a typed input that suggests AND can create a new value | `<falcon-angular-combobox>` | multi-select |
| an **always-visible** stacked/inline list of checkboxes (no panel, no chips) | `<falcon-angular-checkbox-group>` | multi-select |
| hierarchical / indented multi-select with parent-child rows | `<falcon-angular-tree>` | multi-select |

**Decision shortcut:**
- multi-select = *many values* + *chips* + *floating panel*.
- checkbox-group = *many values* + *no panel* + *always-visible checkboxes* — use it when the list is short (≤ ~12) and should never be hidden.
- dropdown/select = *one value*, closed picker.
- combobox = *one value*, typed, optionally create-new.
- The common confusion: **multi-select vs checkbox-group**. Both commit a *set*. Multi-select hides the options behind a trigger and shows chips — right for longer lists, filter bars, compact forms. Checkbox-group shows every option inline — right for short, decision-critical lists (permissions a reviewer must see at a glance).

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[options]`, `[(ngModel)]`/CVA (array value), `[placeholder]`, `[label]`, `[searchable]`, `[clearable]`, `[showSelectAll]` + `[selectAllLabel]`, `[maxChipsVisible]`, `[required]`, `[readonly]`, `size`, `state`.
2. **Validation surface** — `[state]='error'` + `[errorText]` to show inline validation; `[helperText]` for hints.
3. **Templates / slots** — per-option / per-chip templates are a **GAP** (`GAPS_AND_UPGRADES.md` G1) — raise, do not hand-roll. No `iconUrl` on the option type yet (`G9`).
4. **Variants** — `size` only; no `variant`/`appearance`.
5. **Token override** — restyle via `multi-select.tokens.css` vars; never hardcode.
6. **Shared upgrade** — selection-count limits (`maxSelected`), grouping, async options are **GAPS** (`G3/G5/G8`) — raise.
7. **Wrapper** — for imperative open/close/focus/clear, the Stencil methods exist but are not proxied (`G7`) — raise the proxy gap or reach the inner element.

## Anti-patterns
- Using multi-select for a single value — that is `<falcon-angular-dropdown>`; an array CVA for one value is wrong shape.
- Reading selection count from visible chips — `maxChipsVisible` hides surplus behind "+N more"; the committed array is the truth.
- Expecting `maxSelected` to cap selections — no such input (`G8`); cap via parent validators.
- Binding `options` as an attribute — must be the `[options]` property or the Stencil initializer clobbers it (`falcon-multi-select.component.ts:98-103,168-188`).
- Relying on `slot="options"` in the default (Tailwind) render path — it is Shadow-only (`G11`).
- Using it for a short always-visible permission list — `<falcon-angular-checkbox-group>` is the better recognition match there.
- Native `<select multiple>` or PrimeNG `<p-multiSelect>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).

## Verification
🟢 code-verified from `falcon-multi-select.component.{ts,html}` + `falcon-multi-select.{tsx,types.ts}` + `falcon-multi-select-tw.tsx` (read 2026-06-03). Cross-library map 🟡 `[INFERRED]` from rendered structure. Live use = 4 chip-list consumers in admin/mgmt Templates (display-only "Shared with") — selection-picker face is showcase-only; fingerprint code-verified + feature-grounded.
