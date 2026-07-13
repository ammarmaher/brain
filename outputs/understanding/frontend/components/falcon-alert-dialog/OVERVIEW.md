# falcon-alert-dialog — OVERVIEW

## Component purpose

A centered **decision modal** for high-consequence "are you sure?" prompts and rich acknowledgements: a large severity icon + heavy title + narrow subtitle + optional custom body + a Cancel/Confirm footer. Built ON TOP of the lower-level `<falcon-dialog>` primitive (composed inside both render paths) and pre-styled per severity. It is the **rich half of the B14 dialog substrate** — the other half being `<falcon-angular-popup>` (the 4 canonical variants). Dual-render: Shadow (`<falcon-alert-dialog>`) + Light DOM (`<falcon-alert-dialog-tw>`) + Angular CVA-less wrapper (`<falcon-angular-alert-dialog>`).

Unlike a generic dialog, alert-dialog has an opinion: it WANTS the user to read before clicking — the icon is 56px and centered, the title is bold, the subtitle is centered narrow text (max 460px), and the two buttons sit in a single right-aligned row. `severity` drives both the icon glyph and the Confirm-button color.

## Business / UI use case

- High-stakes confirmations: dangerous deletions, expensive/irreversible payments, important advisories.
- Acknowledgement-only callouts (`hideCancel`/`hideConfirm` single-CTA mode) — e.g. "configuration is locked, acknowledge".
- The **live renderer** for two host patterns: `ErrorDialogService` (`<falcon-angular-error-dialog-host>`, libs/falcon) and the message-orchestrator's `configuration-required`-without-`actionCallback` modal (`FalconModalAdapterComponent`).
- Derived from the React SoT `InsufficientBalanceModal` (centered icon + title + subtitle + body slot + Cancel/Proceed footer).

## When to use it / when NOT to use it

**Use it for:**
- A decision modal with an icon-led, read-this-first layout and a custom body (priority list, summary lines, info pill).
- Acknowledgement-only modals (single CTA via `hideCancel`).
- As the substrate that host/orchestrator services render (you usually reach it indirectly via `ErrorDialogService` or the orchestrator).

**Do NOT use it for:**
- A generic editing modal (user fills a form, picks a date) → `<falcon-angular-dialog>` (the primitive) or `<falcon-angular-drawer>`.
- One of the 4 canonical action-required flows (error / delete / unsaved / save) → `<falcon-angular-popup>`.
- Post-action "saved!" feedback → toast / `<falcon-angular-notification>` (alert-dialog is BEFORE the action).
- Disabling BOTH `hideConfirm` AND `hideCancel` (the user gets stuck with no button).
- Passing HTML into `title`/`subtitle` (plain-text inputs only).
- A simple imperative yes/no from code → inject `FalconConfirmService` (it renders `<falcon-angular-popup>`, not this).

## Status

**ACTIVE / PRODUCTION.** Round 4 (2026-05-15); native-`<dialog>` Top-Layer wrapping added Phase B / Wave 4.3 (2026-05-21). Dual-render stable. The Angular wrapper is **live and exported** (unlike the dormant `<falcon-angular-confirm-dialog>`). It is a building block for app-level wrappers (`wb-confirm-save-modal`, `do-payment-priority-popup`) and host/orchestrator renderers.

## Replaces

- Legacy `window.confirm()` and hand-rolled "ConfirmModal" components.
- It is the recommended substrate over the dormant `<falcon-angular-confirm-dialog>` for icon-led confirms.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-alert-dialog/falcon-alert-dialog.component.ts` (131 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-alert-dialog/falcon-alert-dialog.component.html` (57 ln — wraps in native `<dialog falconOverlay="modal">`) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-alert-dialog/falcon-alert-dialog.component.css` (52 ln — native `::backdrop` dim+blur + inner-backdrop neutralisation; **contains raw rgba/px** — see TOKENS static-style risks) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-alert-dialog/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-alert-dialog/falcon-alert-dialog.tsx` (184 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-alert-dialog/falcon-alert-dialog.css` (128 ln — token-driven, severity `:host([severity=…])` overrides) |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-alert-dialog/falcon-alert-dialog.types.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-alert-dialog-tw/falcon-alert-dialog-tw.tsx` (170 ln — SEPARATE folder) |
| Tailwind helper | _none_ (the `-tw` twin inlines its own Tailwind classes; there is no `alert-dialog-tailwind-classes.ts`) |
| Token file | _none of its own_ — tokens are self-declared in the Shadow CSS `:host` (`[CODE]` falcon-alert-dialog.css:5-30); chrome inherited from `dialog.tokens.css` |
| Spec/tests | _no dedicated `.spec.ts`/`.e2e.ts`_; behavior exercised via `apps/host-shell/tests/falcon-message-orchestrator.spec.ts` (the modal-adapter path) |

> ⚠️ **Drift corrected (2026-06-03):** the prior dossier listed `falcon-alert-dialog.tokens.css`, `types.ts`, an in-folder `-tw`, and `libs/falcon-ui-core/angular/falcon-alert-dialog/` — ALL stale. Real paths above: no token file (tokens in `:host`), `falcon-alert-dialog.types.ts`, `-tw` in its own folder, wrapper under `angular-wrapper/components/`.

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-alert-dialog` |
| Stencil Shadow tag | `<falcon-alert-dialog>` |
| Stencil Light tag | `<falcon-alert-dialog-tw>` |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-alert-dialog>` across `apps/` + `libs/falcon/` + `libs/falcon-ui-core/` = **12 files** (incl. the component's own wrapper/index + barrels). True render/import consumers:

- **`libs/falcon-ui-core/.../message-orchestrator/adapters/falcon-modal-adapter.component.ts`** — the LIVE renderer for `configuration-required` WITHOUT `actionCallback` (acknowledgement) (`[CODE]` :35, :46, :76-85).
- **`libs/falcon/.../shared-ui/.../falcon-error-dialog-host/`** (`.component.ts` :30/:36, `.component.html` :4-25) — `ErrorDialogService` renders alert-dialog for multi-message error lists.
- **`libs/falcon-ui-core/.../falcon-confirm-dialog-host/`** (host `.component.ts` :25/:35, `.html` :5) — legacy confirm-host template target (dead in Phase 5; `active()` always null).
- **`apps/admin-console/.../new-wallet-balance/.../wb-confirm-save-modal/`** (`.component.ts` :8/:20 — composes/documents the alert-dialog base).
- **`apps/{admin,management}-console/.../org-hierarchy-page/.../settings-tab/`** (`.component.ts` :30/:85-89 — references the alert-dialog confirm flow it replaced with an orchestrator call).
- Plus the wrapper + `falcon-http-error-dialog.service.ts` doctrine comment (`[CODE]` :6).

See `USAGE.md` Consumer Sweep for the enumerated list. Consumer count rose from the prior "2" because the Phase-5 orchestrator/error-host wiring + wb-confirm-save-modal adopted it.

## Related components

- **Composes:** `<falcon-dialog>` / `<falcon-dialog-tw>` (chrome substrate; `[CODE]` falcon-alert-dialog.tsx:137, falcon-alert-dialog-tw.tsx:115). See `[BRAIN-OUT]` `components/falcon-dialog/`.
- **Sibling substrate:** `<falcon-angular-popup>` — the 4-canonical-variant decision modal (and the actual renderer for `FalconConfirmService` / `action-required`). See `[BRAIN-OUT]` `components/falcon-popup/`.
- **Rendered BY:** `FalconModalAdapterComponent` (orchestrator), `<falcon-angular-error-dialog-host>` (`ErrorDialogService`), the legacy `<falcon-angular-confirm-dialog-host>`.
- **NOT to be confused with:** `<falcon-angular-confirm-dialog>` — a DORMANT, separate Stencil-based confirm component. The prior dossier called confirm-dialog "legacy, migrate to alert-dialog"; the accurate framing is that confirm-dialog is dead and alert-dialog is one of two live confirm substrates.

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI team. Tokens self-declared in the component CSS; chrome contract in `libs/falcon-ui-tokens` (`dialog.tokens.css`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15 sweep). Source-file table corrected (no token file; `-tw` in its own folder; `falcon-alert-dialog.types.ts`; wrapper under `angular-wrapper/components/`). Consumer list refreshed to **12** (orchestrator adapter + error-host + confirm-host + wb-confirm-save-modal + settings-tab). Native-`<dialog>` Top-Layer wrapping + raw-rgba wrapper CSS confirmed in source.
