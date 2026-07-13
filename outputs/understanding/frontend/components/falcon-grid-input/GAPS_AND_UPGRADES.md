# falcon-grid-input — GAPS AND UPGRADES

> Refreshed 2026-06-03 against live source. Prior "verify" items resolved against code; new token/a11y findings added; consumer count corrected (0 → 2).

## Missing capabilities (active source verified)

### G1 — Single string value only, no numeric mode (P2)

`[CODE]` falcon-grid-input.tsx:30 — `value` is a `string`; the inner input is `variant="grid"` (text). For numeric cell editing (price/quota with format/step), there is no built-in coercion — the live contracts consumers commit a string and parse it themselves (`[CODE]` contract-details-step.component.ts:28-30).

**Recommended fix:** add `@Input() mode?: 'text' | 'number'` that swaps the inner primitive to `<falcon-input-number>` semantics, OR document the convention of composing `<falcon-angular-input-number>` for numeric cells. (Behaviour/contract change → HIGH-RISK-QUEUE.)

### G2 — No validation / error feedback (P2)

`[CODE]` The component forwards no `state` to the inner input and exposes no `errorMessage`/`errorState`. If a committed value is rejected server-side, there is no in-cell red ring.

**Recommended fix:** add `@Input() errorState?: boolean` + `@Input() errorMessage?: string` → forward `state="error"` to the inner input + a tooltip.

### G3 — No Angular method proxies (P2)

`[CODE]` Both Stencil tags expose `@Method async setFocus()` (falcon-grid-input.tsx:77-80 / falcon-grid-input-tw.tsx:65-68) but the wrapper proxies neither `setFocus()` nor `commit()`/`cancel()`/`selectAll()`.

**Recommended fix:** add a wrapper `setFocus()` (+ optionally `selectAll()`) forwarding to the inner Stencil element. `autoFocus=true` covers the common case, so P2.

### G4 — No `aria-label` passthrough (P1 — a11y)

`[CODE]` The wrapper has no `ariaLabel` input and forwards no label to the inner input. A matrix of editable cells is unlabelled for screen readers — a SR user editing a price cell hears no row/column context. The live contracts matrix relies on a visible header row only.

**Recommended fix (P1):** add `@Input() ariaLabel?: string` → forward to the inner input so the host can announce "edit {column} for {row}". (a11y semantics → HIGH-RISK-QUEUE.)

### G5 — `--falcon-grid-input-focus-ring-*` tokens are orphan (P2 — token correctness)

`[CODE]` grid-input.tokens.css:19-20 declares `--falcon-grid-input-focus-ring-color` + `-width`, but neither the Shadow CSS (layout-only) nor the Tailwind helper reads them. They are dead — overriding them does nothing. Additionally the colour points at the non-existent `--color-falcon-primary-400` palette → `#60a5fa` blue fallback.

**Recommended fix (safe-local):** either wire the two tokens into an active-cell ring rule (and repoint the colour to `--color-falcon-teal-400`) or delete them to avoid a misleading override surface.

### G6 — Dead Tailwind helper export (P3)

`[CODE]` `falconGridInputRootClasses()` (grid-input-tailwind-classes.ts:11-13) returns `'block w-full'` but is imported by nothing — the `-tw` twin inlines the same string (`[CODE]` falcon-grid-input-tw.tsx:120). Either use the helper in the twin (SSOT) or remove it.

### G7 — No "dirty" indicator (P3)

For multi-cell editing there is no visual hint that the current value differs from `originalValue`. The component already holds both values internally — a dirty class/token would be cheap.

### G8 — No paste sanitisation (P3)

`[CODE]` Pasting `"$1,234.56"` into a numeric-intent cell is not cleaned — consumer responsibility (ties to G1).

## Missing accessibility features (resolved from prior "verify" stubs)

- **A1 (P1):** no `aria-label` passthrough (= G4).
- **A2 (P3):** focus-on-cancel — after Escape, the component does NOT return focus to a triggering element; the host owns post-cancel focus. Document or add an opt-in.
- **A3 (P2):** Tab navigation is event-driven (Tab hijacked) — correct for grid UX, but a SR user expecting native tab order is surprised. The host MUST wire `(falconGridNavigate)` or focus is lost (this is by design but is an a11y trap).

## Missing tests

- `[CODE]` Grep 2026-06-03 → **no `*grid-input*.spec.ts` / `.e2e.ts`** for either Stencil tag or the wrapper. A spec should cover: Enter/Tab/blur each emit exactly one `falconGridCommit` (the `committed` de-dup), Escape reverts to `originalValue` + emits `falconGridCancel`, Tab emits `falconGridNavigate` with the right direction, `@Watch('value')` external sync, autoFocus respects `disabled`. **GAP — add specs.**

## Missing Tailwind / token parity

- `[CODE]` Shadow vs `-tw` are a **1:1 behavioral mirror** — identical props, identical events, identical keyboard handling + `committed` flag + autoFocus logic (falcon-grid-input.tsx ≈ falcon-grid-input-tw.tsx line-for-line). **No parity divergence found** (contrast search-input's `clearAriaLabel` gap). The only difference is `shadow:true` vs `shadow:false` and the orphan tokens applying to neither.

## Performance risks

- `[CODE]` No timers; single `committed` boolean guard; `OnPush` wrapper. **No risk.**

## Visual / interaction risks

- Auto-focus on mount can steal focus if multiple grid-inputs mount simultaneously — which is exactly why the live contracts matrix sets `[autoFocus]="false"` (whole grid editable at once). Document this as the rule: `autoFocus=false` for all-editable grids, `true` for one-cell-at-a-time.
- Orphan focus-ring tokens give a false impression of a customisation surface (= G5).

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G4 | `ariaLabel` passthrough | P1 |
| G1 | Numeric `mode` | P2 |
| G2 | Validation/error feedback | P2 |
| G3 | `setFocus()` / `selectAll()` proxies | P2 |
| G5 | Wire or delete orphan focus-ring tokens (+ palette fix) | P2 |
| G6 | Use or remove dead Tailwind helper | P3 |
| G7 | Dirty indicator | P3 |

## Concrete upgrade API

```ts
// Angular wrapper additions (additive)
@Input() mode: 'text' | 'number' = 'text';   // G1
@Input() errorState = false;                  // G2
@Input() errorMessage?: string;               // G2
@Input() ariaLabel?: string;                  // G4
async setFocus(): Promise<void>;              // G3
async selectAll(): Promise<void>;             // G3
```

## Shared vs per-page

All shared. grid-input is the single §5.12.2 cell-editor chokepoint; per-page hacks (e.g. a bespoke number-input, which both contracts features just removed) defeat the point.

## Workarounds today

- For G1/G8: parse/sanitise the committed string in the `(falconGridCommit)` handler.
- For G2: render an error indicator in a sibling cell-level element.
- For G3: `viewChild` → `nativeElement.setFocus()`.
- For G4: wrap the cell in a host element with an `aria-label`.

## Wave findings (2026-06-03 sweep)

**Consumer count: 2** (`[CODE]` grep `falcon-angular-grid-input` across `apps/` + `libs/falcon/`) — admin + management Contracts cost-management price matrix. **Adopted since Wave 7 (0 → 2).**

**New this sweep:** G4 (no `aria-label`, HIGH-RISK-QUEUE), G5 (orphan focus-ring tokens + `primary`-palette miss), G6 (dead Tailwind helper export). Prior TOKENS/USAGE drift (fictional 6-category `--falcon-grid-input-*` set) corrected this pass. Shadow↔`-tw` confirmed 1:1 parity (no divergence).
