# falcon-org-node-header — API

## Selectors

- Angular (shared-ui): `falcon-org-node-header` `[CODE]` falcon-org-node-header.component.ts:11
- Stencil: none (single-render Angular component).
- **Do not confuse** with the app-level twin selector `app-org-node-header` (same class name, different component — OVERVIEW).

## Import

```ts
import { FalconOrgNodeHeaderComponent } from '@falcon';
import type { FalconOrgNodeHeaderType } from '@falcon';
```

`[CODE]` Re-exported from the shared-ui barrel (`libs/falcon/src/shared-ui/index.ts:176-178`). Add `FalconOrgNodeHeaderComponent` to the consuming standalone component's `imports: []`. Uses plain Angular templating (`<button>`/`<img>`/`<svg>`), so **no `CUSTOM_ELEMENTS_SCHEMA` is needed**.

> Adoption note: there are 0 live consumers; prefer `<falcon-node-details-section>` (OVERVIEW). API documented for completeness + any future un-orphaning decision.

## Inputs (all on `FalconOrgNodeHeaderComponent`)

`[CODE]` falcon-org-node-header.component.ts:18-28 — **eleven** signal inputs.

| Name | Type | Default | Notes |
|---|---|---|---|
| `nodeName` | `string` | **required** (`input.required`) | `[CODE]` ts:18 — the node's display name; rendered (truncated, `[title]`) at html:21 and used to derive `initials()`. |
| `nodeType` | `FalconOrgNodeHeaderType` (`'root' \| 'client' \| 'sub-node'`) | `'client'` | `[CODE]` ts:19 — drives the avatar treatment: `root` → Falcon brand SVG (html:9-14); otherwise image-or-initials. |
| `imageUrl` | `string \| null` | `null` | `[CODE]` ts:20 — if set, renders an `<img>` avatar (html:5-8); takes precedence over the `root` brand SVG and initials. |
| `canAddClient` | `boolean` | `false` | `[CODE]` ts:22 — gates the **Add Client** button (html:52-59). |
| `canAddNode` | `boolean` | `false` | `[CODE]` ts:23 — gates the **Add Node** button (html:60-67). |
| `canEditNode` | `boolean` | `false` | `[CODE]` ts:24 — gates the **Edit Node / Edit Info** button (html:68-84). |
| `canAddUser` | `boolean` | `true` | `[CODE]` ts:25 — gates the **Add User** primary button (html:85-92). Default `true`. |
| `canShowInfo` | `boolean` | `true` | `[CODE]` ts:26 — gates the **Information / Back to Users** toggle (html:36-51). Default `true`. |
| `infoOpen` | `boolean` | `false` | `[CODE]` ts:27 — when `true`, the info toggle shows "Back to Users" (html:44-51) and the Edit button flips to the active "Edit Info" teal style + label (html:68-84). |
| `useCustomActions` | `boolean` | `false` | `[CODE]` ts:28 — when `true`, the entire built-in action row is suppressed and `<ng-content select="[slot=actions]">` is projected instead (html:32-34). **This input is the shared component's key addition over the app-level twin** (which lacks it). |

> `[CODE]` `FalconOrgNodeHeaderType = 'root' \| 'client' \| 'sub-node'` (ts:7) — exported via the barrel.

## Outputs

`[CODE]` falcon-org-node-header.component.ts:30-34 — **five** `output()` emitters, all `void`.

| Name | Payload | Notes |
|---|---|---|
| `(addClient)` | `void` | `[CODE]` ts:30 — emitted by the Add Client button click (html:55). |
| `(addNode)` | `void` | `[CODE]` ts:31 — Add Node button click (html:63). |
| `(editNode)` | `void` | `[CODE]` ts:32 — Edit Node/Info button click (html:80). |
| `(addUser)` | `void` | `[CODE]` ts:33 — Add User button click (html:88). |
| `(toggleInfo)` | `void` | `[CODE]` ts:34 — Information / Back-to-Users toggle click (html:39 + html:47). |

> `[CODE]` All outputs are payload-less — the parent already knows the selected node; these are pure "the operator clicked X" signals.

## TypeScript types

`[CODE]` falcon-org-node-header.component.ts:7:

```ts
export type FalconOrgNodeHeaderType = 'root' | 'client' | 'sub-node';
```

No other exported types. (The app-level twin re-declares an identical `FalconOrgNodeHeaderType` — duplicate type, GAP G1.)

## Reflected props

None — single-render Angular component (no Stencil `@Prop({reflect})`). Host carries a static class only (`falcon-org-node-header block`, ts:15).

## Mutable props

None. Inputs are read-only signal inputs; there is no `model()`/two-way binding. The component is **stateless display + event-emit only**; the parent owns all state and reacts to the five outputs.

## CVA / ngModel / Reactive Forms

`[CODE]` **None.** Not a form control — no `ControlValueAccessor`, no `NG_VALUE_ACCESSOR`. It is a presentational header that emits action events.

## Signal compatibility

`[CODE]` **Signals-first / zoneless-safe.** All inputs are `input()`/`input.required()`; outputs are `output()`; the one derived value `initials` is a `computed()` (ts:36-40). `OnPush` (ts:14). No lifecycle hooks, no subscriptions → nothing to tear down. Textbook Angular 21 component.

## Methods

`[CODE]` Only the derived `protected readonly initials = computed<string>(...)` (ts:36-40) — takes `nodeName()`, splits on whitespace, takes the first letter of up to 2 words (else first 2 chars), upper-cased. No public methods.

## Slots / template inputs

`[CODE]` falcon-org-node-header.component.html — **two `<ng-content>` projection slots** (this is the shared component's differentiator vs the app twin):

- `slot="badge"` — `<ng-content select="[slot=badge]">` (html:25), sits beside the node name. Intended for a Falcon/Client mode pill (per the html:23-24 comment); empty when nothing is projected.
- `slot="actions"` — `<ng-content select="[slot=actions]">` (html:33), rendered **only** when `useCustomActions()` is `true` (html:32), replacing the entire built-in action button row.

No `ng-template` inputs.

## Supported sizes / states / variants / appearances

`[CODE]` Fixed visual contract, no axis inputs:
- **Avatar size:** image/initials avatar `w-7 h-7 rounded-full` (html:6/16); root brand SVG `40×40` (html:11).
- **Buttons:** fixed `h-[38px]` (arbitrary px), `text-[13px]` (arbitrary px) — see Constraints. Primary (Add User) is teal-filled; secondary buttons are white/bordered with teal hover; the Edit button has an active (teal-filled) state when `infoOpen()`.
- **States:** `infoOpen()` flips the Information button → "Back to Users" and the Edit button → active "Edit Info"; otherwise inactive. No size/variant/appearance inputs, no disabled state on the buttons.

## Constraints

- `[CODE]` html:1 comment says *"Layout is pure Tailwind; SCSS handles button skin"* — **STALE/MISLEADING**: there is NO `.scss`/`.css` file for this component; the button skin is fully inline Tailwind (html:38/46/54/62/70-79/87). The comment is a documentation defect (FINDINGS / GAP G4).
- `[CODE]` Multiple **arbitrary px values**: `h-[38px]` (every button), `text-[13px]` (every label), `rounded-[10px]` (button radius), `text-[15px]` (node name, html:21), `duration-[120ms]` (transitions). These deviate from the Falcon token utilities used by the rest of the library (`text-xs`/`text-sm`, `rounded-md`, etc.) — tokens-over-literals house-rule deviations (FINDINGS / GAP G5).
- `[CODE]` The root brand SVG path data is **inlined verbatim** in the template (html:12) rather than using `<falcon-brand-logo>` (which the app-level twin DOES use, importing `FalconBrandLogoComponent`). Duplicated brand-mark markup (GAP G3).
- `[CODE]` Action buttons are native `<button>` elements, NOT `<falcon-angular-button>` (the app twin uses `<falcon-angular-button>`). Raw-primitive usage vs the Falcon button component — a house-rule deviation (Falcon-components-over-native) (FINDINGS / GAP G6).
- `[CODE]` No `disabled` axis on any button — a parent can only hide (`can*=false`) or show; it cannot render a disabled-but-visible button.

## Accessibility

`[CODE]` falcon-org-node-header.component.html:
- Root brand-SVG avatar: wrapper `aria-label="Falcon" role="img"` + inner `<svg aria-hidden="true">` (html:10-11) — correctly named graphic.
- Image avatar: `<img [alt]="nodeName()">` (html:7) — alt text = node name. Good.
- Initials avatar: `<span>{{ initials() }}</span>` (html:16-18) — no `role="img"`/`aria-label`; AT reads the raw initials (e.g. "AB"). Minor — the name is also present in the adjacent `<span>` (html:21).
- Action buttons: each is `type="button"` with an icon (`aria-hidden="true"`, html:40/48/56/64/81/89) + a visible translated `<span>` label — accessible name comes from the label text. Good.
- **A11y GAPS:** the node-name `<span>` is `truncate` with `[title]` (html:21) — title gives a hover tooltip but not a programmatic label for AT when truncated (A1). No landmark labeling on the `<header>` (it is a bare `<header>`, A2). No `aria-pressed`/`aria-expanded` on the Information toggle to convey open/closed state (A3 — the label changes text, which AT will read, but the toggle semantics are implicit).

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-org-node-header.component.ts (41 ln) + .html (95 ln). 11 inputs (1 required + `useCustomActions` differentiator), 5 void outputs, 2 projection slots (`badge`/`actions`), `initials()` computed, no CVA, no size/disabled axes. Stale "SCSS handles button skin" comment + arbitrary-px deviations + native `<button>` (vs `<falcon-angular-button>`) confirmed.
