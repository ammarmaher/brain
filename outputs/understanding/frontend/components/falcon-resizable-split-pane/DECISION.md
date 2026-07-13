# falcon-resizable-split-pane — DECISION

## Brain SK final recommendation

**STATUS: READY / SHARED / NEW (W3). Use for any two-column, row-aligned, single-synced-scroll resizable layout.** It is the engineering exemplar of the B25/B26 shared-ui batch (signals + two-way model + complete teardown + pure math core + real gate-12 token file + token-only inline `styles` + strong a11y). The one genuine open item is **RTL drag-direction verification (G2)**; everything else is additive/spec/nicety. Adoption is currently 1 (the wallet alloc-table, its behavioural oracle).

## Use this component for

- Two side-by-side panes that must stay **row-aligned** while sharing ONE scrollbar, with a user-draggable divider (the wallet Organizations ⟷ Values ledger pattern).
- Master/detail or two-column ledger layouts where the user should resize the columns and both columns scroll together.
- Any future surface that needs the wallet's resizer/grip/synced-scroll behaviour — reuse this, don't re-extract it.

## Avoid this component for

- A non-resizable two-column layout → plain flex/grid.
- Two independently-scrolling panes → this enforces one synced scroll (right owns it).
- A horizontal (top/bottom) split → vertical-divider only (GAP G3).
- More than two panes → strictly two (+ optional left header).
- A loading placeholder → `<falcon-page-skeleton>` (B26).

## Preferred variant / render path

**Single render path** — pure-Angular component (no `useTailwind`/Shadow choice; dual-render concepts N/A). Compose via the three slots (`[slot=left-header]` / `[slot=left]` / `[slot=right]`); drive geometry via the numeric inputs; persist width only if needed via `[(leftWidth)]`; override the look via `--falcon-split-pane-*` tokens (grip shadow being the common one).

## Required upgrades before wider use

- **Verify RTL drag-direction (G2)** before shipping it to an Arabic-facing two-column surface — the grip centring is fine, but the drag delta assumes left=resized.
- **Add a component-wiring spec (G1)** (the math is already covered) before relying on it in more places.
- **Re-verify generality on a 2nd consumer (G4)** — it has only ever been validated against the wallet.

None of these block the current (wallet) usage.

## Relationship to other components

- **Extracted from / oracle:** the wallet allocation table (`wb-allocation-table`).
- **Consumed within:** `new-wallet-balance` (admin), which overrides `--falcon-split-pane-grip-shadow` at its own scope for SoT pixel-parity.
- **Owns:** a pure math core (`falcon-resizable-split-pane.math.ts`, 8 exported fns + `SplitPaneClampConfig`) — re-exported for consumers/tests.
- **Sibling shared-ui:** `<falcon-node-details-section>`, `<falcon-page-skeleton>` (B26), `<falcon-info-card>`, `<falcon-view-toggle>` (B25) — but THIS is the only one with a token file + inline `styles` + a math core.

## Exact rule for future implementation tasks

1. **Two resizable, row-aligned columns sharing one scroll?** Use `<falcon-resizable-split-pane>` with `[slot=left-header]`/`[slot=left]`/`[slot=right]`.
2. **Put ALL scroll content in `[slot=right]`** — the left pane mirrors (its scrollbar is hidden).
3. **Drive geometry via inputs** (`leftDefaultWidth`/`leftMinWidth`/`rightReserveWidth`/`arrowStep`); use `[(leftWidth)]` only to persist/restore.
4. **Override the look via tokens** (`--falcon-split-pane-*`, esp. grip shadow); never hand-roll Tailwind on the grip/resizer.
5. **Pass translated `resizerAriaLabel`/`resizerTitle`.**
6. **RTL?** Verify the drag direction (GAP G2) before shipping to an RTL surface.
7. **Never** reintroduce JS grip placement (the grip is CSS-centred — it fixed the old viewport-middle bug).

---

## Dynamic capability assessment

### 1. What is static today?

- The **vertical** divider / left-right split (no horizontal mode — G3).
- The **single-synced-scroll** model (right owns the bar; left mirrors) — not toggleable.
- The grip's **CSS-centred** placement + the idle nudge timing (token-driven values, but the *behaviour* is fixed).
- The drag's **left=resized** assumption (RTL caveat — G2).

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **6 inputs** (`leftDefaultWidth`/`leftMinWidth`/`rightReserveWidth`/`arrowStep`/`resizerAriaLabel`/`resizerTitle`) + **1 two-way `model`** (`leftWidth`).
- `[CODE]` **2 outputs** (`resize` → clamped px on every change; `resetWidth` → void on double-click).
- `[CODE]` `dragging` signal + `leftBasis`/`ariaNow` computed adapt the render reactively.

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` **3 `<ng-content select>` slots** — `[slot=left-header]` (static), `[slot=left]` (mirrored body), `[slot=right]` (the scroll region). Fully content-agnostic.
- No `ng-template` inputs.

### 4. What is dynamic through token/theme overrides?

- `[CODE]` **~30 `--falcon-split-pane-*` tokens** (gate-12 `:where(...)` scope) — grip dims/colour/opacity/shadow, resizer width, gap, z-indexes, motion, default/min/reserve widths, row height. Per-instance host-class override is supported (the wallet overrides grip-shadow).

### 5. What is dynamic through Tailwind classes?

- Host `class=` flows to the host (`flex flex-1 min-h-0 min-w-0` base) — layout/responsive.
- The template's token-reading arbitrary utilities (`w-[var(--…)]` etc.) are the bridge; consumers override the tokens, not the utilities.

### 6. What is missing to make this component reusable across pages?

- It is **engineered** for reuse (content-agnostic slots + numeric inputs + token file) but **proven** on only one shape (G4).
- Missing for breadth: a horizontal `orientation` (G3), an opt-out of the hidden-left-scrollbar/synced-scroll model (some consumers may want two independent scrolls), and RTL drag correctness (G2).

### 7. What capability should be added to shared component (not page hack)?

- RTL-aware drag delta (G2) and a component-wiring spec (G1) — both belong in the shared component/its math.
- An optional `orientation` (G3) IF a horizontal consumer appears.

### 8. What flags / options / templates / slots would make it better?

- `@Input() orientation` (G3); `@Input() rowHeight` to enforce `--row-h` (G6); `aria-valuetext` (A1); Home/End/PageUp/PageDown keyboard jumps (A3).
- An option to disable the synced-scroll (for independently-scrolling consumers).

### 9. What is the safest upgrade path?

1. **Phase A (verify, zero code if it passes):** test RTL drag (G2) + confirm the `split-pane-math.spec` is in CI; add a component-wiring spec (G1). If RTL is broken, fix the drag delta (additive branch).
2. **Phase B (a11y, additive):** `aria-valuetext` (A1), Home/End/PageUp/PageDown (A3). Zero visual change.
3. **Phase C (generality, on demand):** `orientation` (G3) + synced-scroll opt-out, ONLY when a second consumer needs them. Validate generality (G4) at that point.

All additive — no consumer break; the wallet usage stays stable.

### 10. What is risky to change because other pages depend on it?

- `[CODE]` The **synced-scroll alignment guarantee** (right owns scroll, left mirrors, left scrollbar hidden) — the wallet's org↔balance pairing depends on it; changing it would desync the ledger.
- `[CODE]` The **grip-shadow default + the wallet's per-instance override** — touching either could break the wallet's SoT pixel-parity (tokens.css:41-48).
- `[CODE]` The **`.falcon-split-*` global class names** (`ViewEncapsulation.None`) — renaming would break the inline-styles ↔ template binding.
- `[CODE]` The **`[(leftWidth)]` two-way semantics** — consumers binding it expect the drag to write back; changing to one-way would desync persisted widths.
- `[CODE]` The **pure math API** (8 exported fns) — re-exported for consumers/tests; signature changes could break them.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26, NEW dossier). Recommendation READY/SHARED (engineering exemplar). Counts: 6 inputs + 1 two-way `model` + 2 outputs; 3 slots; 8 exported pure math fns; ~30 gate-12 tokens; complete teardown; strong `role="separator"` a11y. RTL drag (G2) is the one genuine open caveat. Adoption = 1 (wallet alloc-table). All re-confirmed in live source.
