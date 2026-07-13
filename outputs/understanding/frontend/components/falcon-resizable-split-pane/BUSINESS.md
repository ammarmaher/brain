# falcon-resizable-split-pane — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[CODE]` The **two-column ledger surface** of the wallet. In business terms it is how the operator reads a node's wallet as **"organizations on the left, their wallet/transfer values on the right,"** kept perfectly row-aligned while sharing one scroll — so the eye never loses which org a balance belongs to, and the operator can widen the org column (to read long node names) or the values column (to read amounts) by dragging the divider. It is presentation infrastructure for the wallet allocation table; it owns no money data, but it is the layout that makes the money data legible.

## PRD / business rules touched

| Rule | Source | How this component surfaces it |
|---|---|---|
| Wallet org rows and value rows must stay row-aligned (one balance per org) | `[CODE]` wb-allocation-table.component.html:2-4 (both cards iterate the SAME `tableRows()`) + the split's single synced scroll | The split mirrors the left stack to the right scroll so org row N always sits beside value row N; expand/collapse a tree node and both columns move lockstep. |
| Transfer-eligibility affects the layout | `[CODE]` wb-allocation-table.component.html:12 (`[class.wb-no-xfer]="!canTransferRows()"`) | The consumer toggles a class on the split host when rows aren't transfer-eligible — a business-state-driven layout tweak (the split is the host that carries it). |
| (no money/validation rule lives in the split itself) | — | `[CODE]` The split enforces no business rule — it is layout. Funding/transfer rules live in the wallet service + backend (see the wallet integration memory). |

> `[CODE]` Like a skeleton, this component's "rules" are presentational: keep the columns aligned, let the user resize. The business *meaning* (which org, which balance, can-transfer) is the wallet feature's; the split just renders the two columns and the divider.

## Business constraints baked in

- `[CODE]` **One scrollbar, right pane owns it** — a deliberate UX rule so the two columns can NEVER scroll out of alignment (the left mirrors via transform; its own scrollbar is hidden, ts:82-89). A builder must not "fix" the hidden left scrollbar — it is intentional (the alignment guarantee depends on it).
- `[CODE]` **Width is clamped so the right (values) pane always keeps a reserve** — `max-left = container − rightReserveWidth` (math.ts:31-33, default reserve 260px). The operator can never drag the org column so wide that the amounts column becomes unreadably narrow.
- `[CODE]` **Reset-to-default on double-click** — double-clicking the divider returns to the default column split (ts:269-272), a quick "undo my resize" affordance.
- `[CODE]` **Grip shadow is wallet-overridden for pixel-parity** — the wallet SoT grip shadow differs from the platform default, so the wallet sets `--falcon-split-pane-grip-shadow` at its scope (tokens.css:41-48). A builder porting the wallet must keep that override or the grip won't match the React SoT.

## Business flows using this component

| Flow | Page | Role of the component in the flow |
|---|---|---|
| View / manage wallet allocation (Falcon admin) | new-wallet-balance → allocation table | The Organizations ⟷ Values two-column resizable, row-aligned ledger with one synced scroll |
| `[INFERRED]` Future "two-column row-aligned ledger" surfaces | any feature | Reusable for any master/detail or two-column ledger that must stay aligned + be resizable |

## Business gotchas

- The **hidden left scrollbar** is by design (single-scroll alignment guarantee) — a reviewer who reports "the left column has no scrollbar" is seeing the intended behaviour, not a bug.
- A **drag that won't widen the org column past a point** is the right-pane reserve clamp (260px default) protecting the amounts column — intended, not stuck.
- The **idle grip nudge** (a subtle pulse, ts:113-121) is an affordance hint ("you can drag me"), disabled under `prefers-reduced-motion` — not an animation glitch.
- `[CODE]` Under **RTL**, the drag treats the visual-left pane as the resized one via `pointerX − containerLeft` (math.ts:45-51); the drag-direction semantics under RTL are **not runtime-verified** (TOKENS RTL caveat / GAP) — a reviewer testing Arabic should sanity-check that dragging widens the intended (start-side) column.
- The split owns no money — if a balance is wrong, the bug is in the wallet service/backend, not the split.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B26, NEW dossier) — the component carries no business/money logic (confirmed against ts:1-307 + math.ts: only geometry/scroll). The row-alignment guarantee (same `tableRows()` + single synced scroll) + the `wb-no-xfer` host-class toggle are read from the consumer (wb-allocation-table.component.html:2-12). Grip-shadow wallet override + right-pane reserve clamp are 🟢 code-verified (tokens.css:41-48; math.ts:31-33). RTL drag-direction is 🟡 a code-derived caveat (not runtime-verified). Wallet flow cross-referenced from `[MEMORY]` new-wallet-balance W3 wave.
