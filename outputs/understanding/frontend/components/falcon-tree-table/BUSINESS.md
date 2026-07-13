# falcon-tree-table — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `falcon-tree-table` is how a Falcon operator *reads tree-shaped tabular data* — a hierarchy where every node also carries the same set of measured columns. Its archetypal business case is the **wallet / accounts hierarchy**: a parent account and its sub-accounts, each row showing currency, balance, committed amount. It exists because a flat data-table cannot express parent-child aggregation and a plain tree cannot carry per-row figures. It is the `multi-N` (multi-2 / multi-3 / multi-4 / multi-5) wallet pattern from the React V0.2 reference, rendered as one CSS-Grid container.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Wallet balances aggregate up an account hierarchy | `[BRAIN-OUT]` charging/wallet domain (Charging service) | The tree shape mirrors the account hierarchy; a parent row sits above its children with the same balance/committed columns, so the operator reads roll-up and detail in one view. |
| Exactly one account is the action target | `[CODE]` falcon-tree-table.types.ts:58 (`selectionMode: 'none' \| 'radio'`) | `selectionMode='radio'` enforces single-select **across the entire tree** — only one row, at any depth, may be selected. This encodes "you act on one account at a time." No `multiple` mode exists. |
| A locked / non-actionable account cannot be chosen | `[CODE]` falcon-tree-table-tw.tsx:295 (`!row.node.disabled` gates radio select) | `node.disabled=true` is a business statement — the account is visible for context but not a valid action target. |

## Business constraints baked in
- `[CODE]` falcon-tree-table.types.ts:58 — **No multi-select.** `selectionMode` is `'none'` or `'radio'` only. A wallet bulk-action UX (select several accounts, act on all) is *not supported* — that is a documented gap (FTT-02). A builder must not promise multi-row batch actions on this component today.
- `[CODE]` falcon-tree-table.types.ts:59 — `'badge'` column type carries only `badgeVariant: 'active' | 'inactive'` — a binary business state. It does NOT compose the severity-aware `<falcon-tag>` / `<falcon-status-badge>`. A status with more than two business meanings needs a `'custom'` column.
- `[GAPS]` — **No sorting.** Header cells are `role="columnheader"` with no `aria-sort`. The tree-table presents the hierarchy in the order the data arrives; if the business needs sorted accounts, the consumer sorts the `nodes` array upstream.
- `[GAPS]` — **No pagination / virtualization.** A fully-expanded 10,000-node tree renders flat in the DOM. The component assumes a wallet-sized hierarchy.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Wallet hierarchy / accounts tree | (no production page yet) | Display the account roll-up with per-row balances; radio-select one account |
| Multi-level aggregation views | (future) | Any tree where each level carries the same measured columns |

`[CODE]`/`[USAGE]` — current consumers are playground + showcase only. **No production feature page consumes `<falcon-angular-tree-table>` yet** — it is built ahead of the wallet-hierarchy feature.

## Business gotchas
- This is **not** the org-hierarchy component. The org-hierarchy page has chrome that differs per depth (root header + child list + per-row 3-dot menus) — that is `<falcon-organization-hierarchy-tree-tw>` / `<falcon-tree-panel>`. `falcon-tree-table` is a *uniform* grid: every depth has the same columns.
- A parent row's columns are **whatever the data says** — the component does not compute aggregation. If a parent should show the sum of its children's balances, the *consumer / backend* must compute and supply that value. The tree-table only renders.
- **No expand-on-select** — setting `selectedValue` externally does not auto-expand the ancestors to reveal the selected row (FTT gap). A programmatically-selected deep account may be hidden under a collapsed parent.
- The `'radio'` column and the keyboard-focusable label cell are two separate tab stops on the same row — a minor a11y wrinkle (FTT P3), but functionally the selection still commits correctly.

## Verification
🟡 CODE-DERIVED, RE-VERIFIED 2026-06-03 (B08) from `[CODE]` falcon-tree-table.types.ts (52 ln) + falcon-tree-table-tw.tsx (668 ln) + the UI-layer dossiers. The `selectionMode` radio-only gate (types.ts:58), `node.disabled` radio-block (tsx:295-ish), and no-multi-select/no-sort/no-pagination constraints re-confirmed. **No production consumer (showcase/docs only — re-confirmed; the wallet only references it in code comments)** — business flows are 🟡 inferred from the wallet-hierarchy intent; 🔴 no user-confirmed working feature renders this component.
