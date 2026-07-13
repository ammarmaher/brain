# falcon-org-node-header — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify the right component. **For an org-node header, that component is `<falcon-node-details-section>`, NOT `<falcon-org-node-header>`** (which is an unused, superseded duplicate — see OVERVIEW / GAPS G1).

## Visual fingerprint

A full-width **header strip** at the top of a detail surface: on the left, a round **avatar** (a brand mark for a root, an image, or a 2-letter initials chip) next to a **bold node name** (and sometimes a small mode pill beside it); on the right, a row of **action buttons** — a subtle "Information" link, one or more white/bordered secondary buttons (Add Client, Add Node, Edit), and a teal-filled primary button (Add User). When the Information panel is open, the Information link becomes a "Back to Users" button and the Edit button turns solid teal ("Edit Info"). It is the "who am I looking at + what can I do here" bar above an org-hierarchy node's tabs.

## Cross-library equivalents

| Library | Their pattern | Parity notes |
|---|---|---|
| MUI | `<Toolbar>` with `<Avatar>` + `<Typography>` + a `<Stack>` of `<Button>`s | Falcon bakes the avatar-fallback logic + i18n labels + PES `can*` gating. |
| Ant Design | `<PageHeader>` (avatar + title + `extra` actions) | Ant's PageHeader `extra` ≈ the right-side action row; `avatar`+`title` ≈ the left zone. |
| PrimeNG | `<Toolbar>` with `start`/`end` templates | `start` = avatar+name, `end` = action buttons. |
| Bootstrap | a `.d-flex justify-content-between` header with an avatar + `.btn` group | Hand-rolled equivalent. |
| Radix / shadcn | a custom flex header (Avatar + heading + Button row) | shadcn has no single "page header" — composed. |
| plain HTML | `<header>` with an `<img>`/initials + `<h*>` + `<button>`s | Exactly the markup this component emits. |

## Use THIS vs siblings

| If the design shows… | Use | Not |
|---|---|---|
| an org-node identity header (avatar + name) + node actions | **`<falcon-node-details-section>`** (project avatar via `falconNodeDetailsAvatar`, actions via `falconNodeDetailsActions`) | `<falcon-org-node-header>` (superseded duplicate) |
| a generic "avatar + label + custom actions" strip | `<falcon-node-details-section>` | `<falcon-org-node-header>` |
| just a status pill beside a name | `<falcon-status-chip>` / `<falcon-angular-tag>` | a header component |
| a view-mode switch in the header corner | `<falcon-view-toggle>` | a header component |
| a single themed action button | `<falcon-angular-button>` | a header component |

> `[CODE]` `<falcon-org-node-header>` appears in the table only to redirect AWAY from it. If a screenshot maps to "org-node header with baked actions", the answer is `<falcon-node-details-section>` + projected `<falcon-angular-button>`s (the live pattern at org-hierarchy-page-menu.component.html:151-270).

## Composition recipe to reach parity

Customization order: inputs → templates → slots → variants → token override → upgrade → wrapper. **Recipe targets the supersessor `<falcon-node-details-section>`** (the component you should actually use):

1. **Inputs** — `[label]` (node name), `[imageUrl]`.
2. **Templates** — `falconNodeDetailsAvatar` (project `<app-org-node-avatar [identity]>` for the brand/image/initials logic) + `falconNodeDetailsActions` (project the action buttons).
3. **Slots/templates for actions** — inside `falconNodeDetailsActions`, render `<falcon-angular-button variant="primary|secondary" [loading] [disabled]>` per action, each guarded by `@if (pes.can*())`.
4. **Variants** — button variants live on `<falcon-angular-button>`, not on the header.
5. **Token override** — via the falcon-button + theme tokens; the header itself is layout.
6. **Upgrade** — none needed; node-details-section is the maintained component.
7. **Wrapper** — don't wrap; consume node-details-section directly.

> If you (against this guidance) must use `<falcon-org-node-header>`: feed `[nodeName]`/`[nodeType]`/`[imageUrl]` + the `can*` booleans, wire the 5 outputs, optionally project `[slot=badge]`, or set `[useCustomActions]="true"` + project `[slot=actions]`. But first resolve GAPS G3/G5/G6/G8 (brand-logo, tokens, falcon-button, dark mode) and the G1 name collision.

## Anti-patterns

- Adopting `<falcon-org-node-header>` in new code — it is superseded/unused; use `<falcon-node-details-section>`.
- Importing `FalconOrgNodeHeaderComponent` without checking which one (shared `falcon-org-node-header` vs app `app-org-node-header` — same class name, different behavior).
- Using native `<button>` to build a header action row — use `<falcon-angular-button>` (the shared org-node-header itself violates this — don't copy it).
- Inlining the Falcon brand-mark `<path>` — use `<falcon-brand-logo>`.
- Shipping a header with no `dark:` styling — it will be illegible in dark mode (the shared org-node-header has this defect).
- Passing literal label strings — labels are i18n keys piped through `translate`.
- Expecting to disable (not just hide) an action on `<falcon-org-node-header>` — no `disabled` axis; use the supersessor's projected `<falcon-angular-button [disabled]>`.

## Verification
🟡 CODE-DERIVED from `falcon-org-node-header.component.ts`/`.html`, the app-level twin, and the live `<falcon-node-details-section>` usage (org-hierarchy-page-menu.component.html:151-270). Sibling routing table cross-checked against the shared-ui barrel + OVERVIEW. Cross-library mapping 🟡 `[INFERRED]` standard-library knowledge (MUI Toolbar / Ant PageHeader / Prime Toolbar). Primary recognition guidance: use the supersessor, not this component.
