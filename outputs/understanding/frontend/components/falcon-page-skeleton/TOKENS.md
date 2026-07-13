# falcon-page-skeleton — TOKENS

> **No dedicated component token file.** `[CODE]` There is no `libs/falcon-ui-tokens/src/components/page-skeleton.tokens.css` (Glob 2026-06-03). Worse for the house-rule axis, this component styles itself with a **mix of raw Tailwind palette classes** (`bg-emerald-100`, `bg-slate-300/70`, `bg-rose-100`, `border-slate-200`, …) **and** a few Falcon tokens (`bg-falcon-neutral-50`, `bg-falcon-teal-50`, `bg-falcon-teal-100`, `bg-falcon-teal-700`). The component-scoped `:where(...)` token-file layer (gate-12) is **N/A**, and this is the **least token-disciplined** component in the B25/B26 shared-ui batch (a deliberate parity copy — see below).

## Component token file

**NONE.** No `page-skeleton.tokens.css`. The skeleton has no `--falcon-page-skeleton-*` contract.

## Token categories (declared)

**None declared.** Visual values are Tailwind utility classes inline in the `template:` string. The mix:

`[CODE]` from falcon-page-skeleton.component.ts (template + `PILL_BG`):

| Utility (template) | Kind | Where |
|---|---|---|
| `bg-falcon-neutral-50` | Falcon token | outer grid bg (ts:79) |
| `bg-falcon-teal-50` | Falcon token | avatar/icon shimmer circles (ts:84/86/99/117) |
| `bg-falcon-teal-100` | Falcon token | selected-tree-row + selected-table-row bg (ts:93/146) |
| `bg-falcon-teal-700` | Falcon token | the "primary" placeholder button + selected checkbox (ts:123/148) |
| `border-falcon-teal-100` | Falcon token | tree indent guide line (ts:96) |
| `bg-emerald-100` / `bg-amber-100` / `bg-rose-100` / `bg-slate-200` | **RAW palette** | status pill backgrounds via `PILL_BG` (ts:30-35) |
| `bg-slate-300/70` / `bg-slate-200/80` / `bg-slate-50/60` | **RAW palette** | shimmer bars + header tints (throughout) |
| `border-slate-200` / `border-slate-100` | **RAW palette** | card + row borders (ts:81/105/106/…) |
| `bg-emerald-50/40` | **RAW palette** | the left tree-pane card tint (ts:81) |
| `animate-pulse` | Tailwind anim | the shimmer on every block |

> `[CODE]` The **raw-palette half is a documented deliberate choice**: ts:8 — *"Markup intentionally mirrors Hierarchy's skeleton (including its raw-palette utilities) so the loading state is pixel-identical across features."* So the raw `slate`/`emerald`/`amber`/`rose` classes are intentional parity, NOT careless drift. It remains a tokens-over-literals **house-rule deviation** (GAP G3) — pixel-parity was prioritized over token discipline, pending the dedup `TODO`.

## Related Falcon theme tokens

`[BRAIN-OUT]` The Falcon-namespaced utilities (`bg-falcon-neutral-50`, `bg-falcon-teal-*`) resolve to `--color-falcon-*` via the Tailwind→CSS-var mapping in `libs/falcon-theme/src/falcon-tailwind-tokens.css`. The raw-palette utilities (`slate`/`emerald`/`amber`/`rose`) resolve to **stock Tailwind palette values**, NOT Falcon tokens — those bypass the Falcon theme entirely.

## Tailwind utility guidance for this component

`[CODE]` The skeleton is self-styled; there is no consumer-facing styling hook. Consumers place it in a sized container and (in overlay mode) provide their own scrim (`bg-falcon-neutral-75`, templates-list.component.html:9). Do not try to recolour the shimmer per-instance — it is not exposed.

## Dark mode support

`[CODE]` **NONE.** Zero `dark:` variants. The skeleton is built on light surfaces (`bg-falcon-neutral-50`, `bg-white`, `bg-slate-*` tints) — on a dark canvas it renders as a bright light block. The consumer's scrim (`bg-falcon-neutral-75`) is also light. (GAP G4 — dark mode.) `[INFERRED]` Acceptable today because Templates (its only consumer) is used predominantly in light mode, but it WILL look wrong in dark mode.

## Density support

**N/A** — fixed layout, no density/size axis (GAP G2). Row heights (`h-10`, `h-16`, `py-4`), widths, and the `lg:grid-cols-5` split are all hardcoded.

## RTL support

`[CODE]` Mostly direction-agnostic (flex + grid + width fractions), **except** the tree indent uses a hardcoded **physical** `margin-left` via `indentStyle()` (`'margin-left: 24px'` / `'margin-left: 48px'`, ts:67-69) and an absolute `-left-3` guide line (ts:96). Under RTL the tree indentation would push the **wrong way** (left instead of right) because `margin-left` is not a logical property. (GAP G5 — RTL indent.) Not runtime-verified; flag for the theme/RTL agent.

## Static style risks

- `[CODE]` **Two inline `style` usages:**
  - `style="height: calc(95vh - 40px)"` on the left aside (ts:82) — a hardcoded viewport-relative height literal (no token).
  - `[style]="indentStyle(row.indent)"` → `'margin-left: 24px'` / `'48px'` (ts:67-69/94) — hardcoded px margins as inline style (and physical, not logical — RTL risk G5).
- `[CODE]` **Raw Tailwind palette** classes throughout (`slate`/`emerald`/`amber`/`rose`) instead of `--falcon-*` tokens (GAP G3) — deliberate parity copy (ts:8) but a token-discipline deviation.
- `[CODE]` **Arbitrary widths** `w-35` (ts:122/123) and `min-w-[860px]` (ts:132/145/159) — `w-35` is not a default Tailwind step (likely relies on a custom scale or silently no-ops), and `min-w-[860px]` is an arbitrary px value. Minor.

## No CSS / no SCSS guidance

`[CODE]` There is **no `.css`/`.scss` file** (the template is inline on the decorator). That part is fine. The deviation is the **raw-palette utilities + inline `style`** inside the inline template — which a strict token audit would flag (G3), tempered by the documented parity rationale (ts:8).

## Token usage by state

`[CODE]` The skeleton is effectively **stateless** beyond visible/not. The only per-row variation is cosmetic (selected rows + pill tone), driven by data constants, not interaction:

| "State" | Tokens / utilities |
|---|---|
| Visible | the whole light-surface tree+table shimmer (above) |
| Hidden | nothing rendered (`@if (visible())`, ts:78) |
| Selected tree/table row | `bg-falcon-teal-100` (Falcon token, ts:93/146) + selected checkbox `bg-falcon-teal-700` (ts:148) |
| Pill tone (success/warning/danger/muted) | raw `bg-emerald-100` / `bg-amber-100` / `bg-rose-100` / `bg-slate-200` (`PILL_BG`, ts:30-35) |
| Hover / Focus / Error / Disabled | _None — purely decorative, no interaction._ |

## Verification
🟡 CODE-DERIVED 2026-06-03 (B26) — no token file exists (Glob confirmed); the inline template's utilities were read directly from falcon-page-skeleton.component.ts and split into Falcon-token vs raw-palette. The raw-palette/inline-style/no-dark/physical-margin findings are 🟢 code-verified; the parity rationale is quoted from ts:8. RTL indent risk + dark-mode absence 🟡 structurally inferred, not runtime-verified.
