# falcon-node-details-section — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

The component is **presentational — it owns no data and calls no endpoint.** The values it displays are owned by whichever module owns the node:

- **Commerce** — the org node's name / logo / identity (`selectedNodeIdentity()` is hydrated from Commerce in the org-hierarchy state).
- **Identity** — for user-scoped headers (name surfaced from Identity).
- **None for the strip itself** — it receives `label` / `imageUrl` as already-resolved inputs.

## Backend wiring

| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none — the strip calls nothing) | — | — | — | — | `[CODE]` The component has no `inject()` of any service, no HTTP, no observable. It renders `[label]` / `[imageUrl]` passed by the parent. |
| Settings PUT (triggered by the projected Save button) | `PUT` | Commerce | settings payload | System Gateway | `[MEMORY]` Wave 14 — the Save button lives in THIS strip's actions slot but the PUT is fired by the parent's `state.saveSettings()` (`[CODE]` org-hierarchy-page-menu.component.html:176). |
| Information PUT (projected Save button) | `PUT` | Commerce | `UpdateMainNodeInfoRequest` | System Gateway | `[MEMORY]` Wave 15 — same pattern; the strip only hosts the button. |

> `[CODE]` The strip is a **dumb slot host**: the projected `<falcon-angular-button>`s carry the `(falconClick)` handlers that call the parent's state methods, which own the HTTP. The strip never touches a gateway.

## Validation rules (V-*)

| V-rule | Field | Trigger | Effect |
|---|---|---|---|
| `label` required (Angular) | `[label]` | compile time | `input.required<string>` — missing input is a build error (`[CODE]` ts:38) |
| (all business validation) | — | — | **Inherited from the parent** — e.g. the Save button's `[disabled]="!settingsFormValid() \|\| …"` is the parent's form validity, not the strip's. |

> `[CODE]` The component runs **no validators**. It has no value to validate. Form validity that gates the projected Save/Edit buttons is computed in the parent (`settingsFormValid()` / `settingsFormDirty()` — org-hierarchy-page-menu.component.html:175).

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| `[CODE]` Settings section-edit flags (`canEditSecurity` / `canEditAllowedIps` / `canEditQuota`) | show the **Edit** button in this strip | `[CODE]` org-hierarchy-page-menu.component.html:183 — the Edit button (projected into THIS strip's actions slot) is `@if`-gated on at least one flag being true; denied → no Edit button |
| `[MEMORY]` Information-panel edit PES (`canEditFalconOnly` etc.) | show info-edit actions | `[CODE]` :192 — the info Cancel/Save actions are `@if`-gated by the parent's info-edit mode/PES |

`[CODE]` The strip itself has **no PES key** — it inherits the gates of the **buttons** the parent projects into its actions slot. The PES decision is the parent's; the strip just renders whatever survives the `@if`.

## State / signal pattern

`[CODE]` falcon-node-details-section.component.ts:
- **Inputs are signals** (`label` / `imageUrl` / `imageAlt` via `input()` / `input.required()`) — one-way, parent-driven; updating the parent's `selectedNodeIdentity()` re-renders the strip reactively (OnPush + signals, ts:33).
- **Slots are `contentChild()` signals** (`actionsTemplate` / `avatarTemplate`) — re-evaluated when the projected templates change.
- **Derived state is `computed()`** (`initial` / `effectiveAlt`) — pure, no side effects.
- **No subscriptions, no `DestroyRef`, no teardown needed** — fully declarative; zoneless-safe.

## Skeleton ↔ app-wrapper layering

- **There is no Stencil skeleton layer** — this is a single-render Angular component (NOT the dual-render Stencil pattern). So the "Stencil skeleton ↔ Angular wrapper" split that flagship dual-render components have is **N/A**.
- **Layering that DOES exist:** the strip is the *inner* shared component; the *outer* layer is the consumer page (`org-hierarchy-page-menu` etc.) which owns state, projects the brand-aware `<app-org-node-avatar>` (host-shell shared) into the avatar slot, and projects `<falcon-angular-button>` actions. Per `feedback_library_skeleton_app_api`, the shared strip never fetches data — the parent's state slice does.
- **Relationship to the loading state:** when the page is loading, the consumer typically shows `<falcon-page-skeleton>` (B26) instead of the real content (incl. this header) — a hard-swap, not a per-row skeleton inside the strip. The strip has no built-in loading state of its own.

## Integration gotchas

- `[CODE]` **The strip owns no behaviour** — if a projected action button does nothing, the bug is in the parent's handler, not the strip.
- `[CODE]` **Avatar precedence** — projecting `falconNodeDetailsAvatar` silently overrides `imageUrl` (html:20). If a logo isn't showing, check whether an avatar template is also projected and winning.
- `[CODE]` **`label` fallback chain lives in the consumer** — e.g. `state.selectedNodeIdentity()?.name ?? node.name` (org-hierarchy-page-menu.component.html:152). The strip just renders the resolved string; the optional-chaining/`??` happens upstream.
- `[CODE]` **No dark-mode adaptation** on the strip surface (TOKENS G5) — on a dark page the header background/label won't follow; the projected avatar/buttons will.
- `[CODE]` **Stale `border-b` comment** (html:7-10) — the divider it describes is not applied by the component; if a consumer expects a divider line, it must add `border-b` on the host (USAGE) — GAP G4.
- `[INFERRED]` **No spec coverage** (`*.spec.ts` Glob empty) — the avatar 3-tier precedence, `initial()` first-letter logic, and `effectiveAlt()` fallback are untested in CI (GAP G1).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B26, NEW dossier) — the component is presentational (no `inject`/HTTP — confirmed against ts:1-67); the PES gate (`@if canEdit…`) + validity-gated Save live in the consumer (org-hierarchy-page-menu.component.html:175/183), confirmed in live source. Backend PUTs are fired by the parent's projected buttons, not the strip. Endpoint/DTO names 🟡 CODE-DERIVED from `[MEMORY]` Wave 14/15 (user-confirmed working), not re-read from backend source.
