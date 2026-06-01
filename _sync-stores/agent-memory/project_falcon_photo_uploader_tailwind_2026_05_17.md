---
name: falcon-photo-uploader Tailwind-only
description: SCSS deleted, all chrome moved to Tailwind utilities + computed signal. Build GREEN.
type: project
originSessionId: 99681f35-4ed4-46f4-b97c-f319202aecbf
---
🟢 LANDED 2026-05-17. `nx build admin-console` GREEN `3d818ddf08ca1aa0`/24.23s.

**SCSS deleted** (`libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.scss`). All visual rules ported to Tailwind utilities:

| SCSS rule | Tailwind equivalent |
|---|---|
| `:host { display: block; }` | `host: { class: 'block' }` in @Component metadata |
| `.fpu-block` base (bg-hover + dashed border + transition) | `bg-falcon-neutral-50 border border-dashed border-falcon-neutral-200 transition-colors duration-150` |
| `:host(.drag-over) .fpu-block, .fpu-block:hover` (teal border + faint teal bg) | `hover:border-falcon-teal-700 hover:bg-falcon-teal-alpha-04` (idle) + `border-falcon-teal-700 bg-falcon-teal-alpha-04` (drag-over state via computed) |
| `.fpu-avatar` (1px solid neutral-200 ring) | `border border-falcon-neutral-200` on existing avatar div |
| `:host(.view-mode) .fpu-block` (transparent + zero padding) | `bg-transparent border-transparent px-0 py-0` via computed |
| `@media (max-width:640px) { flex-direction:column; align-items:flex-start; }` | `flex-col items-start sm:flex-row sm:items-center sm:justify-between` (mobile-first) |

**Doctrine**: For state-driven Tailwind class composition in Angular components, declare class strings as **module-level constants** + emit them via a `computed<string>` signal bound to `[class]="containerClasses()"`. This (1) lets Tailwind's TS content scanner statically discover every class at build time, (2) avoids NgClass directive import for multi-source class merging, (3) keeps `:host(parent-state) .child-selector` patterns out of SCSS entirely (state moves into the Angular signal layer where it belongs).

**Token mapping used**: `--bg-hover` (#f7f7f7) → `bg-falcon-neutral-50` (#f5f7f8) · `--border` (#e5e7eb) → `border-falcon-neutral-200` (exact) · `--teal` (#0d3f44) → `falcon-teal-700` (exact) · `rgba(13,63,68,0.03)` → `bg-falcon-teal-alpha-04` (rgba(13,63,68,0.04), 1% off, visually identical) · `hover:bg-[#082a2e]` → `hover:bg-falcon-teal-900` (exact) · `hover:bg-[#fee2e2]` → `hover:bg-falcon-red-100`.

**Dropped identifier classes**: `.fpu-block`, `.fpu-avatar`, `.fpu-avatar-edit`, `.fpu-avatar-delete`, `.fpu-btn`. Confirmed zero external references via repo-wide grep before deletion.

**Dropped @HostBinding('class.drag-over' & 'class.view-mode')** since the only consumer of those host classes was the deleted SCSS. State now lives purely in signals + computed.

Trigger: `falcon-photo-uploader tailwind` / `delete photo-uploader scss` / `state-driven tailwind via computed signal`.
