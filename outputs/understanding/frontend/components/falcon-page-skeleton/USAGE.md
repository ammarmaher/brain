# falcon-page-skeleton — USAGE

## Real usage examples (active codebase)

### Example 1 — Templates list loading overlay (parent-gating mode)

`[CODE]` `apps/admin-console/src/app/features/templates-page/components/templates-list.component.html:8-12` (same in management-console):

```html
@if (showSkeleton()) {
  <div class="absolute inset-0 z-10 bg-falcon-neutral-75 p-3 md:p-5 pointer-events-none">
    <falcon-page-skeleton [forceVisible]="true" />
  </div>
}
```

The textbook pattern: the **parent owns the gating** (`@if (showSkeleton())`), wraps the skeleton in an absolutely-positioned overlay (`absolute inset-0 z-10`, a `bg-falcon-neutral-75` scrim, `pointer-events-none` so clicks don't land on the placeholder), and passes `[forceVisible]="true"` so the skeleton always renders while the overlay is mounted.

## Recommended usage for NEW Angular pages

**Mode A — self-gating (simplest):** bind `[loading]` to your loading signal and let the component show/hide itself.

```html
<!-- The skeleton renders itself only while loading() is true -->
<falcon-page-skeleton [loading]="isLoading()" />
```

**Mode B — parent-gating overlay (the Templates pattern; preferred when you want a scrim over existing content):**

```html
@if (isLoading()) {
  <div class="absolute inset-0 z-10 bg-falcon-neutral-75 p-3 md:p-5 pointer-events-none">
    <falcon-page-skeleton [forceVisible]="true" />
  </div>
}
```

Add `FalconPageSkeletonComponent` to `imports: []`. Choose Mode B when the page already renders its shell and you want the skeleton to overlay it; Mode A when the skeleton replaces a blank region.

> **Only use this skeleton when your page IS the tree+table workspace shape** (org-hierarchy / Templates). The layout is hardcoded (GAP G2) — a different page shape will look wrong. For other shapes, build a page-specific skeleton.

## Reactive Forms / ngModel

**N/A** — not a form control (no CVA, no value).

## Tailwind-only usage

`[CODE]` The host is `block w-full h-full` (ts:76). Place it inside a sized container (an overlay or a fixed-height region). Do not add styling utilities to reshape it — its internal layout is fixed; host utilities only affect its outer box.

## Per-instance token override

**N/A** — there is no `page-skeleton.tokens.css`, and the internal colours are **raw Tailwind palette** classes (`bg-emerald-100`, `bg-slate-300/70`, etc., GAP G3), not `--falcon-*` tokens. There is no per-instance override path; to change the look you'd edit the component (a shared change).

## Do / Don't

| Do | Don't |
|---|---|
| Use it for a tree+table workspace loading state (org-hierarchy / Templates shape). | Use it for a page with a different layout — it's hardcoded to one shape (G2). |
| Gate with `[loading]` (self-gating) or wrap in `@if` + `[forceVisible]="true"` (overlay). | Render it permanently — it has no auto-timeout; you own the hide. |
| Overlay it with `pointer-events-none` so clicks don't hit the placeholder. | Let it intercept clicks meant for the (still-loading) page. |
| Accept it as a temporary placeholder until the dedup `TODO` lands. | Add a second copy — there are already two (this + `app-org-hierarchy-skeleton`); don't make a third. |
| Use it for whole-page loading. | Use it for per-row/per-cell loading inside a rendered table (that's a hard content-swap, not this overlay). |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-page-skeleton` across the workspace → **2 occurrences / 2 files**; **0 in `libs/falcon`**:

- `apps/admin-console/src/app/features/templates-page/components/templates-list.component.html` (1) — overlay + `[forceVisible]="true"`.
- `apps/management-console/src/app/features/templates-page/components/templates-list.component.html` (1) — same.

> `[CODE]` Adoption is **2** because it is a freshly-promoted shared copy used only by Templates so far. The org-hierarchy feature still renders its own `app-org-hierarchy-skeleton` (the byte-equivalent original, ts:3-6); the dedup `TODO` (ts:11-12) would migrate Hierarchy onto this shared component and raise adoption.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26). Example 1 (Templates overlay + `[forceVisible]`) confirmed at templates-list.component.html:8-12. Consumer Sweep re-run (`<falcon-page-skeleton` → 2 occurrences / 2 app HTML files + 0 in libs/falcon). Dedup-pending note read from ts:3-12.
