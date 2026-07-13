# falcon-card-status — GAPS AND UPGRADES

## Architecture note (NOT a gap — by design)

`[CODE]` The Angular `<falcon-angular-card-status>` renders pure-Angular chrome (`<div>` + `<ng-content>`), NOT the Stencil `<falcon-card-status>` element, and has NO `useTailwind` input and NO `-tw` twin. This is **deliberate and correct** — the `<falcon-angular-card>` Defect-A fix (2026-05-28): a Stencil `-tw`/scoped element destroys Angular-projected **interactive** light-DOM content under zoneless CD + the define-before-project race. The card must project Angular-managed buttons, so Angular renders the chrome. **Do NOT "fix" this back to mounting the Stencil element** (it would re-break button projection). The Stencil `scoped:true` component is correct for the React/Vue targets. (Same class as B10 FC-ARCH-1; here it is the originating design intent, not a drift.)

## Missing capabilities (active source verified)

### G1 — Union re-declaration in the Angular wrapper (P2 — DRY/drift)

`[CODE]` falcon-card-status.component.ts:42-43 — the wrapper re-declares `FalconCardStatusType` + `FalconCardStatusSize` inline instead of importing from `falcon-card-status.types.ts` (the Stencil component DOES import them, tsx:22-25). Verified identical today; risk = silent drift if the types file gains a member.

**Recommended fix (P2):** `import type { FalconCardStatusType, FalconCardStatusSize } from '../../../components/falcon-card-status/falcon-card-status.types'` and re-export, exactly as `falcon-avatar`/`falcon-icon` wrappers do. (Same fix-shape as FSB-04.)

### G2 — No `role` / `ariaLabel` on the Angular card root (P2 — a11y)

`[CODE]` falcon-card-status.component.html:18 — the root `<div>` has no `role` and the wrapper has no `ariaLabel` input. For a grid of status cards, a screen-reader user gets no per-card landmark — they rely entirely on the projected title text + badge. Lower-impact than `falcon-card` FC-A11Y-1 (a card *tile* is less of a "named section" than a content card), but worth an optional `[ariaLabel]` → `role="group"`/`aria-label`.

**Recommended fix (P2):** add `@Input() ariaLabel?: string` → `[attr.role]="ariaLabel ? 'group' : null"` + `[attr.aria-label]="ariaLabel || null"` on the root.

### G3 — `status` carries no built-in status LABEL / badge (P3 — by design, document)

`[CODE]` The card paints the border tone but renders **no status word** — the caller must project a `<falcon-angular-status-badge>` into `slot="status"` (comm-mkt-card does). This is intentional (presentation-only), but a convenience `[statusLabel]` that auto-renders a badge could reduce caller boilerplate for the common case.

**Recommended fix (P3, optional):** an opt-in `[statusLabel]` + `[statusSeverity]` that, when set, renders a default badge in the status slot — while still allowing full slot override.

### G4 — Stencil `scoped:true` slot-preservation is React/Vue-only; Angular relies on `<ng-content>` (P3 — parity doc)

`[CODE]` The two render paths reach the same visual result by **different mechanisms** (Stencil slot polyfill vs Angular `<ng-content>`). They share the class builder + tokens, so visual parity holds — but a future change to the chrome must be applied to BOTH the Stencil `.tsx` render and the Angular `.html` template (they are hand-kept in sync). This is a maintenance footgun, not a runtime gap.

**Recommended fix (P3):** add a sync test (or a shared snapshot of the class-builder output) asserting the Stencil render and the Angular template emit the same zone structure + classes.

### G5 — No size/tone for a "loading" or "selected" card (P3)

`[CODE]` The card has 4 status tones + 3 sizes, but no `selected`/`interactive`/`loading` presentation (contrast the `falcon-card` G-INT-1 proposal). A grid that wants a selected-tile highlight or a skeleton-loading card must hand-roll it via `rootClass`.

**Recommended fix (P3):** optional `selected` border/ring token + a `loading` skeleton tone — additive, token-driven.

## Missing accessibility features

- **A1 (P2):** no `role`/`aria-label` on the root (= G2).
- **A2:** the card itself is non-interactive, so no focus management is needed — the projected buttons own their keyboard/focus behaviour (correct).

## Missing tests

- `[CODE]` **NO `.spec.ts` / `.e2e.ts` for any layer** (Stencil, Angular wrapper) — verified 2026-06-03. GAPs: (a) a wrapper spec locking the `status`/`size` → root-class mapping + the null-coercion to defaults + `rootClass` append; (b) a slot-render spec confirming all 5 zones project (the **interactive-button-projection** case is the whole reason this component exists — it MUST be regression-tested under the app's CD); (c) a parity check that the Stencil `.tsx` and the Angular `.html` emit the same class structure (G4).

## Missing Tailwind / token parity

- `[CODE]` **Token binding is EXEMPLARY** — `card-status-tailwind-classes.ts` is fully token-driven (zero hardcoded hex/px); both render paths consume the SAME `--falcon-card-status-*` via the shared builder. **No parity gap** (the cleanest of the B11 trio; contrast falcon-tag FT-07 / falcon-card FC-TOKEN-1 whose non-Shadow paths emit literal palette utilities). A per-instance `--falcon-card-status-*` override DOES bite both paths.
- The `:where()` token selector correctly omits a non-existent `-tw` tag.

## Performance risks

- Pure-Angular chrome, `OnPush`, signals + computed class strings, no subscriptions. **No real risk.** For a large grid each card is one small component — acceptable; the description-line-clamp + reserved spacer in comm-mkt-card keep layout stable without reflow churn.

## Visual / interaction risks

- `[CODE]` The top grid is `34px 1fr auto` with `items-center` — if a caller projects a tall status column (badge + price) and a short title, the icon/title visually center-align to the badge's middle. comm-mkt-card works around this by adding `self-start` to each top slot. **Document the `self-start` requirement** for callers with a tall status column.
- The hover shadow is subtle (`0 4px 14px rgba(0,0,0,0.04)`) — fine on white, slightly stronger in dark mode (re-pointed).

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Import unions from the types file (drop re-declaration) | P2 |
| G2 | Optional `[ariaLabel]` → `role="group"` on the root | P2 |
| G3 | Optional `[statusLabel]`/`[statusSeverity]` convenience badge | P3 |
| G4 | Stencil↔Angular chrome sync test | P3 |
| G5 | `selected` / `loading` presentation tone | P3 |

## Recommended upgrade API (concrete)

```ts
// Angular wrapper additions
import type { FalconCardStatusType, FalconCardStatusSize } from '../../../components/falcon-card-status/falcon-card-status.types'; // G1
@Input() ariaLabel?: string;          // G2 → role="group" + aria-label
@Input() statusLabel?: string;        // G3 → default badge in slot="status"
@Input() statusSeverity?: string;     // G3
@Input() selected = false;            // G5 → selected ring token
```

## Fix-shared-vs-per-page

All gaps belong in the **shared component**. The whole point of card-status is that the entity-card shell is centralized; per-page chrome hacks (re-rolling the 3-zone layout / action footer) would fragment the SoT card pattern.

## Workarounds (if upgrade blocked)

- For G2 today: wrap the card in an element carrying `role="group"` + `aria-label`.
- For G3 today: project a `<falcon-angular-status-badge>` into `slot="status"` (the comm-mkt-card pattern — the documented way).
- For G5 today: a `selected` highlight via the `rootClass` input (`rootClass="ring-2 ring-falcon-teal-500"`).

## Deep-Dive Sweep Findings (2026-06-03 — B11 — NEW dossier)

**Consumer count: 1 direct (comm-mkt-card), consumed transitively by the comm-mkt-view pages** ([CODE] grep `falcon-angular-card-status`).

This is a NEW dossier (no prior version). Key facts established:
- **Architecture is the `<falcon-angular-card>` Defect-A pattern** — Angular renders chrome directly (NOT the Stencil element); the Stencil `scoped:true` component is React/Vue-only; NO `-tw` twin; NO `useTailwind`. By design — do NOT change it.
- **Token binding is exemplary** — fully token-driven class builder, zero hardcoded hex/px, both paths share `--falcon-card-status-*`. No parity gap (best of the B11 trio).
- **Findings:** G1 (union re-declaration), G2 (no root `role`/`ariaLabel`), G3-G5 (optional convenience/selected/sync), no tests. **All `safe-local`** (DRY + additive a11y/convenience + tests) — **0 HIGH-RISK**. See FINDINGS/B11.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B11 — NEW) against all source layers. Architecture (Defect-A pure-Angular chrome) confirmed from source comments; token binding verified exemplary; union re-declaration (G1) + no root `role` (G2) + no tests confirmed. 0 HIGH-RISK — all findings safe-local. Component is ACTIVE.
