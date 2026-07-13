# falcon-card-status — OVERVIEW

## Component purpose

**Presentation-only status card.** It owns exactly four visual concerns and nothing behavioural:
1. **status → root border tone** (the ONLY thing `status` controls),
2. a consistent **3-zone card layout** (top grid `[media | title | status]` → body → footer),
3. a **guaranteed bottom-right action area** (`mt-auto` so it pins to the bottom regardless of body height),
4. **action alignment** (`justify-end`, `flex-wrap`).

`[CODE]` It owns **NOTHING** else — which buttons appear, their labels/i18n, visibility, permission, disabled/loading, validation, click handlers, API, error/success ALL belong to the **caller**, projected into the slots. No Do-Payment / Disable / Enable logic, no payment flow lives here (falcon-card-status.tsx:1-7, falcon-card-status.component.ts:24-25).

This is the design-system shell behind the **SoT service/app grid card** (the `.cm-card` from `admin/comm-mkt.css`).

## CRITICAL architecture — the Angular wrapper does NOT wrap the Stencil element

`[CODE]` This component is a **deliberate exception** to the dual-render `useTailwind` tag-switcher pattern (contrast `falcon-input`/`falcon-icon`/`falcon-avatar`). There are **two render paths that are NOT a Shadow/Light twin pair**:

- **Stencil `<falcon-card-status>`** — `scoped: true` (NOT `shadow:true`, NOT plain `shadow:false`), declares **no `styleUrl`**. It exists **only for the React / Vue output targets**. `scoped:true` is the canonical light-DOM slot mode (identical to `<falcon-card-tw>`): the component stays in the consumer's Light DOM (Tailwind cascades) while turning ON Stencil's slot polyfill so slotted children are tracked via reference comment nodes and **preserved across renders** (falcon-card-status.tsx:27-39).
- **Angular `<falcon-angular-card-status>`** — renders the **same chrome DIRECTLY in Angular** (plain `<div>` + native `<ng-content select="[slot=…]">`), NOT via the Stencil element, and has **NO `useTailwind` input** and **NO `-tw` twin**.

`[CODE]` **WHY** (falcon-card-status.component.ts:5-25): under the app's **zoneless change detection** + the **define-before-project race**, a `-tw` Stencil custom element's render **destroys Angular-projected light-DOM content** — verified empty in the browser across `forceUpdate` / manual-relocate / `scoped:true`. The status-**badge** survives only because it projects a plain text label; this card must project **INTERACTIVE, Angular-managed buttons** (with `(click)` + structural directives) into the actions slot — exactly the case that breaks. Rendering the chrome in Angular keeps Angular in full control of projection, so caller-projected buttons always paint. **This is the same `<falcon-angular-card>` "Defect-A fix" (2026-05-28)** documented for B10 falcon-card.

Both paths use the **SAME `card-status-tailwind-classes.ts` helpers** → one token chain, both render paths visually identical.

## Business / UI use case

- The **service / application grid card** in the Communication & Marketing ("comm-mkt") view — `[CODE]` `libs/falcon/src/shared-features/comm-mkt-view/components/card/comm-mkt-card.component.ts` is the sole live consumer.
- Any future "card with a status tone + a guaranteed action footer" pattern (subscription cards, plan cards, entity tiles).

## When to use it / when NOT to use it

**Use it for:**
- A card whose **border tone communicates a status bucket** (active/expired/disabled/inactive) AND that needs a guaranteed bottom-right action area for caller-owned buttons.
- A grid of uniform-height entity cards (the `h-full` + `mt-auto` footer keeps actions bottom-aligned across a ragged row).

**Do NOT use it for:**
- A plain content card with no status tone / no action footer → `<falcon-angular-card>` (the general card).
- A status **pill / badge** (not a card) → `<falcon-angular-status-badge>`.
- Anything where you expect the component to own the action behaviour — it is **presentation only**; the caller owns every button.
- Mapping a **domain** status enum — `status` here is a 4-bucket **presentation** input; the caller maps its domain enum (e.g. `FalconItemStatus`) down to a bucket (see comm-mkt-card `cardStatus()`).

## Status

**ACTIVE / NEW dossier (B11).** Recent component (the `scoped:true` + Angular-direct-chrome architecture postdates the `<falcon-angular-card>` Defect-A fix of 2026-05-28). One live consumer (comm-mkt-card). Not deprecated.

## Replaces

- The bespoke `.cm-card` markup from `admin/comm-mkt.css` (the SoT) — promotes it into a shared, tokenised Falcon component so the grid card + the list data-table share one shell.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-card-status/falcon-card-status.component.ts` (85 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-card-status/falcon-card-status.component.html` (35 ln — pure-Angular chrome, NOT a tag-switcher) |
| Angular wrapper CSS | **NONE** — `[CODE]` host layout via `@HostBinding('class')` = `'falcon-angular-card-status block h-full'` (component.ts:75). |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-card-status/index.ts` |
| Stencil source | `libs/falcon-ui-core/src/components/falcon-card-status/falcon-card-status.tsx` (83 ln — `scoped:true`, React/Vue only) |
| Stencil Shadow CSS | **NONE** — `[CODE]` no `styleUrl`; scoped-CSS is a no-op on the Tailwind cascade (tsx:33-34). |
| Stencil `-tw` twin | **NONE** — `[CODE]` there is no `falcon-card-status-tw`. The single `scoped` component IS the light-DOM render. |
| Types | `libs/falcon-ui-core/src/components/falcon-card-status/falcon-card-status.types.ts` (17 ln) |
| Utils | **NONE.** |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/card-status-tailwind-classes.ts` (91 ln — `falconCardStatusRootClasses()` + `…TopClasses()` + `…BodyClasses()` + `…ActionsClasses()`; shared by BOTH render paths) |
| Component token file | `libs/falcon-ui-tokens/src/components/card-status.tokens.css` (82 lines; includes a dark-mode block) |
| Spec / e2e | **NONE** — no `falcon-card-status.spec.ts` / `.e2e.ts` for any layer (verified 2026-06-03). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-card-status` |
| Stencil tag (React/Vue) | `<falcon-card-status>` (`scoped:true`) |
| Stencil `-tw` twin | **none** |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `falcon-angular-card-status` across `apps/` + `libs/falcon/` = **1 live consumer**:

- `libs/falcon/src/shared-features/comm-mkt-view/components/card/comm-mkt-card.component.ts` (`app-comm-mkt-card`) — the SoT service/app grid card. Projects `slot="media"` (service icon), `slot="title"` (name + subtitle), `slot="status"` (status badge + SAR price), the default slot (description + dates band + pending band), and `slot="actions"` (Disable / Do-Payment / Enable `<falcon-angular-button>`s). Maps `FalconItemStatus` → bucket via `cardStatus()`.

Other matches are non-render: the Stencil `<falcon-card-status>` appears in `libs/falcon-ui-core` generated artifacts (`components.d.ts`, `web-types.json`), the wrapper, the barrel, the token file.

## Related components

- `falcon-card` — the general (non-status) card with the **identical** "Angular-renders-chrome-not-the-Stencil-element" architecture (B10). card-status is the status-toned + guaranteed-action-footer specialization.
- `falcon-angular-status-badge` — composed BY comm-mkt-card into `slot="status"` (the lifecycle pill that sits next to the price).
- `falcon-angular-button` — projected into `slot="actions"` (the interactive buttons whose projection drove the Angular-direct-chrome decision).
- `falcon-angular-icon` / `falcon-svg-icon` — projected into `slot="media"` / used in the price line.

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by the Falcon UI team. Token contract in `libs/falcon-ui-tokens`. The React/Vue `<falcon-card-status>` and the Angular `<falcon-angular-card-status>` are intentionally separate renders sharing one Tailwind-class + token contract.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B11 — NEW dossier). All source layers read on disk: Stencil `scoped:true` (no `styleUrl`, no `-tw` twin), Angular wrapper renders pure-Angular chrome via `<ng-content>` (NOT the Stencil element, NO `useTailwind`), shared `card-status-tailwind-classes.ts`. Single live consumer = comm-mkt-card. Architecture = the `<falcon-angular-card>` Defect-A pattern (zoneless-CD slot-projection).
