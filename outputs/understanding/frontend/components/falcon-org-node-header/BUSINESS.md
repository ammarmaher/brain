# falcon-org-node-header — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Org-hierarchy feature context (per task §4)

`[CODE]` The organization-hierarchy feature (`apps/{admin,management}-console/.../features/org-hierarchy-page/`) is where a Falcon admin (admin-console) or a client operator (management-console) browses and manages the tree of org nodes — the **root** (Falcon), its **client** accounts, and their **sub-nodes** — plus the **users** under each node. When a node is selected, the page shows a tabbed surface (Hierarchy / Settings / …) headed by a **node header strip**: who am I looking at (avatar + name) and what can I do to it (add a child, add a user, edit, open the Information panel). `falcon-org-node-header` was an early, opinionated version of that strip; the live feature uses the more flexible `<falcon-node-details-section>` (`[CODE]` org-hierarchy-page-menu.component.html:151) instead.

## Business purpose

`[CODE]` falcon-org-node-header.component.ts:1 — In business terms the header answers two questions for the operator: **"which org node am I on?"** (identity: root vs client vs sub-node, by name + avatar) and **"what am I allowed to create/change here?"** (the action buttons, each gated by a `can*` boolean the parent derives from PES). It owns **no business data** — it displays the selected node's name/image and emits action intents; the parent performs the create/edit flows.

## PRD / business rules touched

| Rule | Source | How this component surfaces it (if adopted) |
|---|---|---|
| The org root is Falcon and renders with the Falcon brand mark | `[CODE]` falcon-org-node-header.component.html:9-14 (`nodeType==='root'` → brand SVG + `aria-label="Falcon"`) | Root node gets the brand-mark avatar, distinguishing the Falcon root from client/sub-nodes. |
| Node actions (Add Client / Add Node / Add User / Edit) are permission-gated | `[CODE]` ts:22-26 `can*` inputs + html `@if (can*())` guards | Each button renders ONLY when the parent passes its `can*` flag true — the parent resolves PES (see INTEGRATION_VALIDATION). |
| The Information panel toggles in-place (Information ⇄ Back to Users) | `[CODE]` html:36-51 + `infoOpen` input | The single Information button flips to "Back to Users" when the info panel is open; the Edit button flips to active "Edit Info". |
| Add Client appears only on nodes that may parent a client | `[CODE]` `canAddClient` (ts:22, default `false`) | Defaulting to `false` means a node cannot add a client unless explicitly permitted. |

> `[INFERRED]` These rules are the org-hierarchy feature's rules; this primitive merely renders/gates them via `can*`. The authoritative PES + flow logic lives in the org-hierarchy page + its state slices, NOT in the header. Because the component is unused, none of these are *actively* enforced through it today (the live `<falcon-node-details-section>` + projected `<falcon-angular-button>`s enforce them instead).

## Business constraints baked in

- `[CODE]` **Add User defaults to permitted** (`canAddUser = true`, ts:25) while the create-structure actions default to forbidden (`canAddClient`/`canAddNode`/`canEditNode = false`, ts:22-24). The default posture is "you can add a user, but adding/editing structure is opt-in" — a sane least-privilege default for the action row.
- `[CODE]` **The component cannot enable an action the parent didn't permit** — there is no internal logic that shows a button regardless of its `can*` flag. Role gating is honored by construction (hide-if-not-permitted). But note: it can only **hide**, not **disable-and-show** (no `disabled` axis) — so it cannot communicate "you could do this but not right now".
- `[CODE]` **Identity is display-only** — `nodeName`/`imageUrl`/`nodeType` are read-only inputs; the header never edits the node. Editing happens in the flow the `editNode` output triggers.

## Business flows using this component

| Flow | Page | Role of the component in the flow |
|---|---|---|
| _(none active)_ | — | The component has 0 live consumers; the org-hierarchy header flow is served by `<falcon-node-details-section>`. |
| Browse/manage org node (INTENDED) | org-hierarchy-page | Would show node identity + gated Add Client/Node/User + Edit + Information toggle, emitting intents to the page. |

## Business gotchas

- `[CODE]` **It is NOT the live header** — the org-hierarchy header is `<falcon-node-details-section>` (org-hierarchy-page-menu.component.html:151-270). Do not assume edits to `falcon-org-node-header` change what users see; they change nothing (0 consumers).
- `[CODE]` **No dark-mode styling** (TOKENS / GAP G8) — if adopted as-is on a dark canvas, the white buttons would render light-on-light, a business-visible defect.
- `[CODE]` **Actions can only be hidden, not disabled** — a business need to show a greyed-out "Add Client (not allowed here)" affordance is not supportable with the current `can*`-hide model.
- `[CODE]` **Name-collision risk** — a developer importing "FalconOrgNodeHeaderComponent" might import the app-level twin (`app-org-node-header`) instead of the shared one; identical class name, different behavior (the app twin has no `useCustomActions`/badge slot). A correctness hazard for maintainers (GAP G1).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25) — the `can*` gating inputs (ts:22-26), `nodeType==='root'` brand-mark rule (html:9-14), the Information⇄Back-to-Users toggle (html:36-51 + `infoOpen`), and the least-privilege defaults all re-confirmed in live source. Org-hierarchy feature context cross-referenced from `[CODE]` org-hierarchy-page-menu.component.ts comments (Wave 19 supersession). Business *enforcement* is theoretical — the component is unused; the live `<falcon-node-details-section>` enforces these rules instead.
