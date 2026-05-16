*** falcon-alert-dialog — OVERVIEW ***
*** Confirm/cancel modal for high-severity user decisions ***
*** Falcon library tier: Composite · Render path: Dual (Shadow + Tailwind) ***

# falcon-alert-dialog — Overview

## What it is

A centered modal dialog that asks the user to **confirm a high-consequence decision**: dangerous deletions, expensive payments, irreversible operations, or important advisories. Built on top of the lower-level `falcon-dialog` primitive but pre-styled with severity colors, a prominent icon, a title, an optional subtitle, and a two-button (Confirm / Cancel) action row.

Unlike a generic `falcon-dialog`, `falcon-alert-dialog` has an opinion: it WANTS the user to read the message before clicking. The icon is large and centered, the title is heavy, the subtitle is centered narrow text (max 460 px), and the action buttons sit in a single horizontal row separated by enough whitespace to slow the user down. The severity (danger / warning / info / success) drives both the icon glyph and the Confirm button color.

It is the canonical Falcon answer for any "are you sure?" prompt and replaces every legacy `window.confirm()` or hand-rolled "ConfirmModal" component across the platform.

## Where it lives

| Layer | Path |
|---|---|
| Stencil shadow component | `libs/falcon-ui-core/src/components/falcon-alert-dialog/falcon-alert-dialog.tsx` |
| Stencil tailwind variant | `libs/falcon-ui-core/src/components/falcon-alert-dialog/falcon-alert-dialog-tw.tsx` |
| Component tokens | `libs/falcon-ui-core/src/components/falcon-alert-dialog/falcon-alert-dialog.tokens.css` |
| Types | `libs/falcon-ui-core/src/components/falcon-alert-dialog/types.ts` |
| Angular wrapper | `libs/falcon-ui-core/angular/falcon-alert-dialog/index.ts` |
| Dossier | `Brain Outputs/understanding/frontend/components/falcon-alert-dialog/` |

## Who uses it

Currently consumed by the `falcon-insufficient-balance-dialog` app-wrapper (Add Client wizard → Payment step) and is the recommended replacement for the legacy `confirm-dialog.component.ts` usages scattered across the admin-console. See the cross-component dependency graph for the live list.

## Falcon library tier

**Composite** — `falcon-alert-dialog` is built ON TOP of the lower-level `falcon-dialog` primitive. It is itself a building block for app-level wrappers (e.g. `<app-do-payment-priority-popup>`, `<app-cancel-pending-action-confirm>`) that inject business services and own the API flow.

Per the library-skeleton + app-wrapper doctrine (R-FE-007):
- The Stencil + Angular wrapper layer is **pure presentational** — no service injection
- App-level wrappers (in `apps/.../shared-components/<name>/`) inject the actual services + call the actual APIs

## Render path

**Dual** — both Shadow DOM (`falcon-alert-dialog.tsx`) and Tailwind/Light DOM (`falcon-alert-dialog-tw.tsx`) variants exist. The Angular wrapper picks via `[useTailwind]` input (default `true`). Both variants consume the same `falcon-alert-dialog.tokens.css` source of truth — see [TOKENS.md](TOKENS.md) for the full token list.

## Status

**Production-ready.** Shipped 2026-05-13 to replace the legacy `confirm-dialog`. Dual-render path is stable; tokens are aligned with the V0.2 theme; the Angular wrapper is built and exported through `@falcon/ui-core/angular/falcon-alert-dialog`.

Open gaps tracked in [GAPS_AND_UPGRADES.md](GAPS_AND_UPGRADES.md) — mainly around the 3-button "Save / Don't Save / Cancel" variant, which is currently faked by wrapping two alert-dialogs.

## Anti-patterns (don't do this)

1. **Don't use `falcon-alert-dialog` as a generic modal.** If the user is editing data, picking a date, or filling a form — use `falcon-dialog` (the primitive) or `falcon-drawer` instead. Alert-dialog is for decisions, not editing.
2. **Don't pre-fill `severity='danger'` for routine actions.** Reserve danger for genuinely destructive operations (account deletion, irreversible transfers). Overuse trains users to ignore the red.
3. **Don't override the icon for ✅ confirmations** — use `falcon-toast` for "saved!" feedback. Alert-dialog is BEFORE the action, not after.
4. **Don't disable both `hideConfirm` AND `hideCancel`.** The dialog needs at least one action button or the user gets stuck.
5. **Don't pass HTML strings into `title` or `subtitle`.** They are plain-text inputs. For rich content, use `falcon-dialog` with its template slot.

## Related components

- [[falcon-dialog]] — the lower-level primitive this composite sits on
- [[falcon-confirm-dialog]] — legacy, deprecated; migrate to falcon-alert-dialog
- [[falcon-insufficient-balance-dialog]] — app-wrapper example consuming this
- [[falcon-toast]] — for post-action feedback (not pre-action confirmation)

## Sources of truth

- Stencil source: `libs/falcon-ui-core/src/components/falcon-alert-dialog/`
- Angular wrapper: `libs/falcon-ui-core/angular/falcon-alert-dialog/`
- App-wrapper reference: `apps/host-shell/src/app/shared-components/do-payment-priority-popup/`
- Falcon Component Registry entry: `registries/FALCON_COMPONENT_REGISTRY.md` (search `falcon-alert-dialog`)
