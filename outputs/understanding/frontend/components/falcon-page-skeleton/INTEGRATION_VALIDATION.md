# falcon-page-skeleton — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

**None.** `[CODE]` The skeleton owns no data and calls no endpoint. It is a static, data-less placeholder. The *fetch* it covers is owned by the consumer page:

- **Templates** — the templates-list fetch (Commerce/templates domain) is what `showSkeleton()` tracks; the skeleton merely overlays during that fetch.
- `[INFERRED]` org-hierarchy — its initial multi-gateway aggregation (Commerce + Identity + Charging) is covered by the byte-equivalent original today.

## Backend wiring

| Endpoint | Method | Backend module | DTO | Gateway | Notes |
|---|---|---|---|---|---|
| (none — the skeleton calls nothing) | — | — | — | — | `[CODE]` No `inject()`, no HttpClient, no observable, no service. It renders purely from local constants + two boolean inputs. |

> `[CODE]` The skeleton is **decoupled from data entirely**. The consumer fetches; when the fetch is in flight the consumer sets `showSkeleton()`/`loading()` true and renders the skeleton; when data arrives the consumer flips it false and renders the real content. The skeleton never knows what is loading.

## Validation rules (V-*)

| V-rule | Field | Trigger | Effect |
|---|---|---|---|
| (none) | — | — | `[CODE]` The component validates nothing — it has no inputs beyond two booleans and no value. |

> `[CODE]` No validators, no form, no value. Zero V-rule footprint.

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| (none) | — | — |

`[CODE]` The skeleton has **no PES gate** — it is a loading placeholder shown to anyone who can reach the page. Whatever PES gates the *real* content is enforced by the consumer when the real content renders, not by the skeleton.

## State / signal pattern

`[CODE]` falcon-page-skeleton.component.ts:
- **Inputs are signals** (`forceVisible`/`loading` via `input()`); the derived `visible` is a `computed()` (`forceVisible() || loading()`, ts:179) wrapping the whole template in `@if (visible())` (ts:78).
- **No subscriptions, no timers, no rAF, no `DestroyRef`** — purely declarative; OnPush (ts:75); zoneless-safe.
- The display data (`TREE_ROWS` / `TABLE_ROWS` / `TABS_WIDTHS` / `PILL_BG` / `INDENT_STYLE`) are **module-level frozen constants** (ts:30-70) referenced via `protected readonly` fields — never mutated.
- **Teardown:** nothing to tear down. (Contrast its sibling `<falcon-resizable-split-pane>`, which DOES need rAF/timer/listener teardown — this one has none.)

## Skeleton ↔ app-wrapper layering

- **This component IS a "skeleton" in the literal sense** (a loading placeholder), but NOT in the dual-render-Stencil "skeleton ↔ Angular wrapper" sense — there is no Stencil skeleton layer here. That dual-render layering is **N/A**.
- **The layering that matters here is skeleton ↔ real content (hard-swap):** the consumer renders EITHER the skeleton (while loading) OR the real content (when loaded), gated by `@if`. The skeleton is **not** a per-row placeholder that the data table renders internally — it is a **whole-page overlay/replacement**. Per `[MEMORY]` the Falcon data table does a **hard content-swap** on load (it does not interleave per-row skeleton rows), so the page-level skeleton is the chosen loading affordance for the whole workspace, distinct from any in-table loading.
- Per `feedback_library_skeleton_app_api`, the shared skeleton never fetches — the consumer's state slice does, and toggles `visible()`.

## Integration gotchas

- `[CODE]` **The consumer owns show/hide** — the skeleton has no auto-timeout. A stuck skeleton = the consumer never set `visible()` false (the fetch never resolved/errored). Debug the consumer's loading signal, not the skeleton.
- `[CODE]` **`forceVisible` vs `loading`** — `[forceVisible]="true"` ignores `loading` (the Templates overlay pattern, html:10). If you bind both, `forceVisible` wins (OR logic, ts:179). Pick one mode.
- `[CODE]` **Overlay must block input** — when overlaying live content, the consumer should keep `pointer-events-none` on the overlay (templates-list.component.html:9) so placeholder rows aren't clickable. The skeleton itself does not block events.
- `[CODE]` **Wrong-shape risk** — using it on a non-tree+table page renders a misleading placeholder (GAP G2). It is layout-specific.
- `[CODE]` **Dark mode** — no `dark:` variants (TOKENS G4); a dark page gets a bright flash.
- `[CODE]` **RTL indent** — the tree indent uses physical `margin-left` (ts:67-69) → wrong-side indentation under RTL (TOKENS G5).
- `[INFERRED]` **Duplicate maintenance** — fixes here must be mirrored in the byte-equivalent `app-org-hierarchy-skeleton` until the dedup `TODO` (ts:11-12) consolidates them, or the two will drift (the very thing the parity copy was trying to avoid).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B26, NEW dossier) — the component is data-less (no `inject`/HTTP/observable — confirmed against ts:1-192); show/hide is the consumer's (`showSkeleton()` → overlay, templates-list.component.html:8-12). No backend wiring, no V-rules, no PES gate (all genuinely empty — 🟢 by-design). Hard-swap (page skeleton vs in-table) relationship 🟡 CODE-DERIVED from the consumer pattern + `[MEMORY]` table-loading behaviour. Duplicate-maintenance caveat 🟡 inferred from the dedup `TODO`.
