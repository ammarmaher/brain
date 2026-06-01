---
name: Add Client Wave 7.11 — SAR icon overlay reverts slot re-projection
description: Wave 7's iconLeft slot projection on `<falcon-angular-input-number>` made the entire input vanish inside ng-template data-table cells. Reverted to canonical sibling-overlay pattern from applications-table.
type: project
originSessionId: 3a74be81-9cee-451f-a4bb-73c7d391eee1
---
🟢 LANDED 2026-05-17 (Wave 7.11). `nx build admin-console` GREEN `3ddd642a0b0f7fc3`/19.5s.

**Bug**: Add Client wizard Step 3 (Comm Channels) + Step 4 (Applications) — the priceValue cell's `<falcon-angular-input-number iconLeft>` rendered as a fully-collapsed/invisible input inside data-table rows. Entire input element gone (not just the icon).

**File**: `apps/admin-console/.../add-client-wizard/client-service-row-table/client-service-row-table.component.html` (priceValue cell).

**Root cause — Stencil shadow:false slot re-projection across 2 component layers**:
1. Angular wrapper `<falcon-angular-input-number>` projects `<span slot="icon-left">…</span>` into outer Stencil `<falcon-input-number-tw>` via `<ng-content select="[slot=icon-left]">`.
2. Outer Stencil renders `<falcon-input-tw><slot name="icon-left" slot="icon-left" /></falcon-input-tw>` — a **re-projection** slot (`falcon-input-number-tw.tsx:320`).
3. Inner Stencil `<falcon-input-tw>` renders `<span class="absolute…"><slot name="icon-left"/></span>` (`falcon-input-tw.tsx:237-243`).

That `<slot name="icon-left" slot="icon-left">` needs Stencil's slot polyfill to BOTH capture the consumer's `<span>` AND re-project the slot element itself into the inner component's `<slot>`. **Stencil's `shadow: false` slot polyfill does not reliably support slot re-projection across 2 component boundaries** — particularly inside `<ng-template falconDataTableCell>` hosts that get re-instantiated on tab navigation under OnPush change detection. The reconciler drops the inner `<input>` while trying to splice the missing slot child → entire input disappears.

**Fix — sibling overlay pattern** (proven working in `applications-table.component.html:226-241`):
```html
<div class="relative">
  <falcon-angular-input-number … inputClass="ps-7" … />
  @if (visible) {
    <span class="pointer-events-none absolute start-2.5 top-1/2 -translate-y-1/2 z-10 inline-flex items-center text-falcon-neutral-600">
      <falcon-angular-saudi-riyal-icon [size]="14" />
    </span>
  }
</div>
```

`inputClass="ps-7"` forwards to falcon-input-tw's `inputExtraClass` and gets appended to the native `<input>` classlist at `falcon-input-tw.tsx:214`. The icon is an absolutely-positioned **sibling** — no slot, no re-projection, no polyfill in the path.

**Doctrine — Falcon canonical pattern for "icon overlay on input"**:
- **DO**: `<div class="relative">` anchor + `inputClass="ps-7"` (or `pe-7` for right) + absolutely-positioned `<span class="pointer-events-none absolute …">` sibling with the icon component.
- **DON'T**: Use `<falcon-angular-input-number iconLeft><span slot="icon-left">…</span></falcon-angular-input-number>` inside any data-table cell, OnPush re-mount context, or wherever Stencil children get re-instantiated. The Stencil slot re-projection through 2 layers (`<falcon-input-number-tw>` → `<falcon-input-tw>`) is fragile.
- The simpler `<falcon-angular-input iconLeft>` (one layer of Stencil) MAY still work — but the sibling-overlay pattern is the SoT canonical Falcon way and is 100% robust.

**Triggers to recall**: `falcon input number icon disappear` / `SAR icon overlay` / `Stencil shadow false slot re-projection` / `iconLeft slot trap` / `applications-table SAR pattern` / `Wave 7.11`.
