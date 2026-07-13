# falcon-node-details-section — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[CODE]` The platform's **"who am I looking at" header**. In business terms it answers, at the top of every node-scoped screen: *which organization node is selected, and what can I do to it right now?* The left side states the identity (logo / brand / initials + name); the right side surfaces the **mode-gated actions** the operator is allowed to take (Edit / Cancel / Save). It is the visual anchor of the org-hierarchy workspace and of every feature page that operates on a selected node (Communication Channels, Marketplace Applications, Templates, Wallet).

## PRD / business rules touched

| Rule | Source | How this component surfaces it |
|---|---|---|
| The selected org node's identity (name + logo) heads every node-scoped screen | `[CODE]` org-hierarchy-page-menu.component.html:151-153 (`[label]="state.selectedNodeIdentity()?.name ?? node.name"`) | Renders the selected node's name + avatar; the Falcon synthetic root shows the brand SVG via the projected `<app-org-node-avatar>` (`[CODE]` :155-156). |
| Settings edit is PES-gated; the Edit button hides when no section is editable | `[CODE]` org-hierarchy-page-menu.component.html:183 (`@if (canEditSecurity \|\| canEditAllowedIps \|\| canEditQuota)`) | The Edit button is projected into THIS strip's actions slot only when at least one Settings PES flag is true — so the header itself shows/hides the action per permission. |
| Save is blocked unless the form is valid + dirty + not already submitting | `[CODE]` org-hierarchy-page-menu.component.html:175 (`[disabled]="!settingsFormValid() \|\| !settingsFormDirty() \|\| settingsSubmitting()"`) | The Save Changes button (in this strip's actions slot) is disabled per the parent's form/submit signals. |
| Cancel is locked while submitting (prevents orphaned partial-Kafka state) | `[CODE]` org-hierarchy-page-menu.component.html:167 + comment :162-163 | The Cancel button (in this strip) is disabled during the in-flight PUT. |

> `[CODE]` The component **enforces none of these itself** — it is a slot host. The parent (`org-hierarchy-page-menu`) computes the PES/validation signals and decides which buttons to project; the strip simply renders them. This is the correct separation: the header is presentational, the page owns the business gates.

## Business constraints baked in

- `[CODE]` **`label` is mandatory** (`input.required`) — a node header with no name cannot be rendered; consumers fall back to `node.name` when the richer `selectedNodeIdentity()` is not yet loaded (`?? node.name`).
- `[CODE]` **Avatar precedence encodes a brand rule** — the projected `<app-org-node-avatar>` wins over `imageUrl` (html:20), which is how the **Falcon synthetic root** shows the brand SVG instead of a logo or an "F" initial (comment org-hierarchy-page-menu.component.html:149: "Falcon root → brand SVG"). A builder must NOT hardcode the brand mark in the strip — it is projected from the host's brand-aware avatar (the explicit Wave 22 design decision, ts:51-56).
- `[CODE]` **The strip owns no actions** — every button is the parent's. A builder must not add a hardcoded Edit/Back button to the component "for convenience"; that mistake is exactly what made `<falcon-org-node-header>` (B25) rigid and ultimately superseded.

## Business flows using this component

| Flow | Page | Role of the component in the flow |
|---|---|---|
| Browse / select org node | org-hierarchy-page (both consoles) | The persistent node-identity header across all tabs |
| Edit Settings (security / allowed-IPs / quota) | org-hierarchy-page → Settings tab | Hosts the PES-gated Edit → Cancel/Save action row |
| Edit Information panel | org-hierarchy-page → Information | Hosts the info-edit Cancel/Save actions |
| Manage Communication Channels | comm-channels-services | Selected-node identity header above the channels table |
| Manage Marketplace Applications | marketplace-applications | Selected-node identity header above the applications table |
| View / build Templates | templates-page (list / wizard / details) | Node-scoped header within the templates workspace |
| Client wallet view | new-wallet-balance (mgmt) | Identity header within the client wallet view |

## Business gotchas

- The action buttons appearing/disappearing in this header is a **permission statement**, not a UI glitch — e.g. a Settings tab with no Edit button means the operator lacks all three Settings edit PES flags (`[CODE]` org-hierarchy-page-menu.component.html:183).
- A disabled Save button in this header reflects the parent's "form not valid/dirty or submitting" rule — not a fault of the strip.
- The component shows whatever `label` it is given — it does **not** validate or canonicalize the node name; that is the parent's / backend's concern.
- `[CODE]` On a dark canvas the strip background/label do not adapt (no `dark:` variants — TOKENS GAP G5); a business reviewer seeing a washed-out header in dark mode is hitting that gap, not a data issue.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B26, NEW dossier) — the PES-gated Edit (`@if canEdit…`), validity/dirty-gated Save (`[disabled]=…`), submit-locked Cancel, and brand-avatar precedence all re-confirmed against the live org-hierarchy-page-menu.component.html (:151-197). The component is presentational; business gates live in the parent (`[CODE]` confirmed). PRD rule cross-references 🟡 CODE-DERIVED from the cited consumer template + `[MEMORY]` Wave 14/15 (Settings/Information edit, user-confirmed working).
