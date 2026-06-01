---
type: deprecated-token-registry
domain: frontend / overlays
last-updated: 2026-05-21
status: tokens-deprecated-but-retained
applies-to: Top-Layer migration · Wave 8.1
---

# Dead / Deprecated Overlay Tokens

After the Top-Layer migration (Phases A-D, 2026-05-21), z-index values are
**irrelevant at runtime** for every overlay that took the migration. The
browser's Top Layer paints above all z-index. However, none of the 5 legacy
overlay z-index tokens could be **deleted** in Wave 8 because all retain live
consumers in the codebase.

This document is the inventory of those tokens, their consumers, and the
deletion-readiness checklist for Wave 9+.

## Pre-deletion audit (2026-05-21)

The Wave 8 plan listed 5 tokens for deletion. The audit (grep across
`libs/` + `apps/`, excluding `Brain Outputs/`/`worktrees/`/historical reports)
found ALL 5 still have non-Brain-Outputs consumers. Per the hard rule "If
any reference remains, DO NOT delete", all 5 are retained.

### Token 1 — `--falcon-dialog-z-index` (= `99999`)

[CODE] `libs/falcon-ui-tokens/src/components/dialog.tokens.css:164`

**Live consumers:**
- [CODE] `libs/falcon-ui-core/src/components/falcon-dialog/falcon-dialog.css:24, 57` — Shadow-DOM `z-index: calc(var(--falcon-dialog-z-index) - 1)` + `z-index: var(--falcon-dialog-z-index)`.
- [CODE] `libs/falcon-ui-core/src/tailwind/dialog-tailwind-classes.ts:21, 59` (+ `.js` mirror).
- [CODE] `apps/host-shell/src/tailwind.css:1429-1430` — `@source inline()` JIT directives.
- [CODE] `apps/admin-console/src/tailwind.css:1393-1394` — same.

**Deletion plan (Wave 9+):**
1. Convert the Stencil `falcon-dialog` core to native `<dialog>` inside its own render output.
2. Delete the four `tailwind-classes` references in lockstep.
3. Remove `@source inline()` directives from app-level Tailwind entry files.
4. Delete the token definition.

### Token 2 — `--falcon-drawer-z-index` (= `99999`)

[CODE] `libs/falcon-ui-tokens/src/components/drawer.tokens.css:102`

**Live consumers:**
- [CODE] `libs/falcon-ui-core/src/components/falcon-drawer/falcon-drawer.css:20, 64`.
- [CODE] `libs/falcon-ui-core/src/tailwind/drawer-tailwind-classes.ts:21, 51` (+ `.js`).

**Deletion plan:** Same as Token 1, swapping `falcon-dialog` → `falcon-drawer`.

### Token 3 — `--falcon-overlay-z-index` (= `100000`)

[CODE] `libs/falcon-ui-tokens/src/components/overlay.tokens.css:26`

**Live consumers:**
- Self-consumed at `overlay.tokens.css:38` (the `.falcon-overlay-container` z-index).
- [CODE] `libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css:182` — `--falcon-org-hierarchy-ctx-menu-z-index: var(--falcon-overlay-z-index)`.
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.service.ts:24` — comment only, no code consumer.

**Deletion plan:**
1. Delete the body-portal `FalconOverlayService` + `popover-portal.ts` (once browser-support floor matches Top Layer everywhere).
2. Migrate `organization-hierarchy.tokens.css:182` to a context-menu-specific token or inline value.
3. Delete this token.

### Token 4 — `--falcon-toast-host-z-index` (= `100001`)

[CODE] `libs/falcon-ui-tokens/src/components/toast.tokens.css:114`

**Live consumers:**
- [CODE] `libs/falcon-ui-core/src/components/falcon-toast-host/falcon-toast-host.css:9`.
- [CODE] `libs/falcon-ui-core/src/tailwind/toast-host-tailwind-classes.ts:45` (+ `.js`).
- [CODE] `apps/host-shell/src/tailwind.css:1363` — `@source inline()`.
- [CODE] `apps/admin-console/src/tailwind.css:1327` — same.
- [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification-stack.component.ts:39` — comment + the literal `z-[100001]` in the Tailwind class string (preserved as defence-in-depth fallback per Wave 7).

**Deletion plan:**
1. Confirm Popover API support is universal in the supported browser matrix.
2. Delete the `z-[100001]` fallback class from `falcon-notification-stack.component.ts`.
3. Delete the Stencil `falcon-toast-host` core OR migrate it to `[popover]`.
4. Delete this token + tailwind class helpers.

### Token 5 — `--falcon-ib-dialog-backdrop-z` (= `99999`)

[CODE] `libs/falcon-ui-tokens/src/components/insufficient-balance-dialog.tokens.css:40`

**Live consumers:**
- [CODE] `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx:332` — Stencil JSX `z-[var(--falcon-ib-dialog-backdrop-z)]`.
- [CODE] `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.css:18`.

**Deletion plan:**
1. Migrate the IB-dialog Stencil core (`.tsx`) to native `<dialog>` internally.
2. Delete the Shadow-DOM CSS reference.
3. Delete this token.

## Other deprecated assets (Wave 8.2 + 8.3)

### `FalconOverlayService` (kept as fallback)

[CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.service.ts`

`@deprecated` Wave 8 (Phase D). Returns the body-portal `.falcon-overlay-container`
div. Phase C popovers transitively use it via Stencil's `ensurePortaled()`.
Kept as fallback for browsers without Popover API.

### `popover-portal.ts` helpers (kept as fallback)

[CODE] `libs/falcon-ui-core/src/utils/popover-portal.ts`

`@deprecated` Wave 8 (Phase D). `ensurePortaled()` + `positionPopoverFixed()`
+ helpers — the JS-based positioning fallback for browsers without CSS Anchor
Positioning (Firefox).

### `.falcon-overlay-container` CSS

[CODE] `libs/falcon-ui-tokens/src/components/overlay.tokens.css:60-80`

Still rendered by the service above. Deprecation comment added in Wave 8;
deletion alongside Token 3.

## Why no deletions happened in Wave 8

The Phase D prompt explicitly required: *"Pre-deletion check per token: grep for any consumer reference. If hits exist OUTSIDE the token definition itself, the consumer still uses it; resolve before deleting."*

All 5 tokens have such hits. Resolution requires migrating the Stencil
shadow-DOM `.css` files OR deleting the Stencil cores entirely — both are
Wave 9+ scope (out of Phase D).

The deprecation pattern (kept-with-`@deprecated`-comment) is the canonical
"safe deletion-prep" stance and aligns with the migration's wrap-not-rewrite
strategy preserved through Phases A-D.

## See also

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — what to use instead of these tokens.
- [`MIGRATION-NOTES.md`](./MIGRATION-NOTES.md) — wave-by-wave context.
- [`BROWSER-FALLBACKS.md`](./BROWSER-FALLBACKS.md) — when fallbacks engage.
- [BRAIN-OUT] `Brain Outputs/_investigations/2026-05-21-top-layer-migration/phase-d/PHASE-D-REPORT.md` — the Wave 8 audit ground-truth.
