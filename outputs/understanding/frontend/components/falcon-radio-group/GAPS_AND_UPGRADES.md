# falcon-radio-group — GAPS AND UPGRADES

## Missing capabilities (active source verified)

### G0 — Orphaned Stencil group / Angular-composition divergence (🟠 HIGH-RISK-QUEUE)

`[CODE]` The Angular `<falcon-angular-radio-group>` does NOT render the Stencil `<falcon-radio-group>` / `<falcon-radio-group-tw>` elements. It composes `@for` over `<falcon-angular-radio>` children inside a plain `<div role="radiogroup">` (falcon-radio-group.component.html:6-46). The Stencil group (`falcon-radio-group.tsx`, 161 ln), its Shadow CSS (`falcon-radio-group.css`, 52 ln), the `-tw` twin (128 ln), and most of `radio-group.tokens.css` are **orphaned by the Angular layer** — yet `ngOnInit` still registers the element via `defineFalconTwComponent('falcon-radio-group')` (ts:82-84).

**Impact:** dead Stencil code shipped + the lib carries two "radio group" implementations that can drift; a maintainer expecting the Stencil group to be the SoT will be wrong.

**Recommended (queued, NOT auto-fixed):** decide one of — (a) delete the orphaned Stencil group + tokens; or (b) repoint the Angular wrapper to render the Stencil group (and remove the hand-composition). Both are public-render-path changes → human approval.

### G2 — Wrapper classes have no Light-DOM stylesheet (🟠 HIGH-RISK-QUEUE)

`[CODE]` The wrapper emits class names `falcon-radio-group`, `falcon-radio-group-label`, `falcon-radio-group-required`, `falcon-radio-group-options`, `is-vertical`/`is-horizontal`, `falcon-radio-group-helper`, `falcon-radio-group-error` (html:6-45) — but there is **no Light-DOM CSS** for them (the Shadow CSS only styles the orphaned element; the token file ships no rules). So the Angular group renders with default browser flow unless the consumer hand-supplies layout. The live wallet consumer compensates with `class="[&_.falcon-radio-group-options.is-vertical]:flex flex-col items-start gap-2.5"` (wallet-balance-management.component.html:203/220).

**Recommended:** add a `.component.css` (or route through `radio-group-tailwind-classes.ts`) that styles the wrapper's own classes from `--falcon-radio-group-*` tokens — OR fold into G0's "repoint to Stencil group" decision.

### G3 — Keyboard nav delegated to native grouping, no roving tabindex (🟠 HIGH-RISK-QUEUE — a11y)

`[CODE]` The group provides `role="radiogroup"` + ARIA (html:22-25) and shares `name` across native radios (html:31), so the browser supplies single-selection + arrow-key movement among same-`name` inputs. But there is no explicit roving-tabindex and no group-level keydown handler. Adequate for native radios, but unverified at runtime and undocumented.

**Recommended:** verify arrow-key + Tab behavior at runtime; document the delegation; add roving tabindex only if a defect is found.

### G1 — No per-option template / description (P1)

`[CODE]` Options are `{ value, label, disabled? }` — label-only. No per-option icon, description line, or `ng-template`. The child radios receive only `[label]` text. **Recommended:** add a `description` field to the option type + a `ContentChild` item template.

### G4 — `errorText` vs `errorMessage` alias (P2)

`[CODE]` The error input is `errorText` (ts:62) — divergent from `<falcon-angular-input>`'s `errorMessage`. `[errorMessage]` on a radio-group is a silent no-op. **Recommended:** add an `errorMessage` alias.

### G5 — Two divergent `FalconRadioGroupOption` types (P2)

`[CODE]` The wrapper's `FalconRadioGroupOption.value: string | number | boolean` (ts:22) ≠ the Stencil one `value: string` (types.ts:6). Same name, two definitions. **Recommended:** unify into one SSOT type.

### G6 — No "card" / boxed variant (P2)

`[CODE]` No `appearance: 'plain' | 'card'`. For icon+title+description pricing-card pickers use `<falcon-angular-tabs mode='radio-cards'>`. **Recommended:** consider an `appearance='card'` axis.

### G7 — No required marker styling on group label / no `iconUrl` / no `orientation='grid'` (P3)

`[CODE]` The required `*` is rendered (html:12-14) but its color token (`--falcon-radio-group-required-fg`) is only applied via the unstyled wrapper class (G2). No per-option `iconUrl`; no grid orientation.

## Missing accessibility features

- **A1 (P2):** verify arrow-key roving focus + Tab semantics at runtime (G3).
- **A2 (P3):** `aria-label` uses `groupLabel` text; consider `aria-labelledby` pointing at the rendered label `<span>` for AT consistency.
- **A3 (P3):** the required `*` is `aria-hidden`; relies on `aria-required` only — acceptable.

## Missing tests

- `[CODE]` **No spec** for the Angular wrapper. Should cover: single-value `handleSelect` (guards `!checked` + same-value), `===` selection, 3-source `isDisabled`, CVA `writeValue`/`onChange`, and `(selectedValueChange)` emission.

## Missing Tailwind / token parity

- `[CODE]` The Light path doesn't style the wrapper classes from tokens (G2) — a real parity break vs the orphaned Stencil group, which DOES (in Shadow). The `falconRadioGroupOptionsClasses` helper exists but is unused.

## Performance risks

- None typical at < 50 options. `@for` with `trackByValue` (ts:116) is efficient. `OnPush`.

## Visual / interaction risks

- Horizontal orientation with long labels wraps awkwardly (and G2 means the wrap/gap is consumer-supplied).
- Without G2's backing rule, the group label / helper / error typography falls back to browser defaults.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G0 | Resolve orphaned Stencil group (delete or repoint) | P1 (queued) |
| G2 | Light-DOM CSS for wrapper classes | P1 (queued) |
| G3 | Verify/document keyboard nav | P1 (queued, a11y) |
| G1 | Per-option description / template | P1 |
| G4 | `errorMessage` alias | P2 |
| G5 | Unify `FalconRadioGroupOption` types | P2 |
| G6 | Card appearance | P2 |
| G7 | Required marker / `iconUrl` / grid | P3 |

## Concrete upgrade API

```ts
export interface FalconRadioGroupOption {
  value: string | number | boolean;
  label: string;
  description?: string;   // G1
  iconUrl?: string;       // G7
  disabled?: boolean;
}
@Input() appearance: 'plain' | 'card' = 'plain';   // G6
@Input() errorMessage?: string;                    // G4 (alias of errorText)
@ContentChild(FalconRadioGroupItemTemplateDirective) itemTpl?;  // G1
```

## Fix-shared-vs-per-page

All gaps belong in the shared component. The current per-page workaround (the wallet consumer's arbitrary-variant layout class) is exactly what G2 should eliminate.

## Workarounds (if upgrade blocked)

- For G2 today: supply a layout `class` targeting `.falcon-radio-group-options` (the wallet pattern).
- For G6 today: use `<falcon-angular-tabs mode='radio-cards'>`.
- For G1 today: pre-format the description into the `label` (discouraged).

## Wave 7 Findings (2026-05-17)

**Consumer count: 1** (`playground.page.html` — now gone).

## Deep-Dive Sweep Findings (2026-06-03 — B06)

**Consumer count: 2 render sites in 1 file** (wallet-balance-management) ([CODE] grep `<falcon-angular-radio-group[\s>]`).

Findings this pass:
- **NEW G0 (HIGH-RISK-QUEUE)** — the Angular wrapper composes radio children and orphans the Stencil group + its CSS/tokens.
- **NEW G2 (HIGH-RISK-QUEUE)** — wrapper classes have no Light-DOM stylesheet; the live consumer hand-supplies layout.
- **NEW G3 (HIGH-RISK-QUEUE, a11y)** — keyboard nav delegated to native grouping, no roving tabindex.
- **NEW G5** — two divergent `FalconRadioGroupOption` types.
- **API drift fixed** — `selectedValue` is one-way input + output (prior dossier wrongly said two-way).
- **Consumer corrected** — `playground.page.html`/settings-tab/pricing-tier consumers are gone/unverified; only wallet-balance-management uses it live.
- The G0/G2/G3 items are queued for human approval (no fix this pass). G1/G4/G5/G6/G7 are `safe-local` doc/additive.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B06) against all source layers. G0/G2/G3/G5 added from live code; `selectedValue` two-way error corrected; consumer list re-grepped. No deletion/promotion flag is auto-applied — G0 (delete-or-repoint) is queued for human decision.
