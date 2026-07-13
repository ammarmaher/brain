# falcon-popup — OVERVIEW

## Component purpose
Action-required modal with **4 canonical variants** — `error`, `delete`, `unsaved`, `save`. Each variant ships:
- A pre-defined intent (danger / warning / success / primary).
- A pre-defined inline-SVG icon (one per variant).
- Default copy strings (title / body / hint / button labels), all **hardcoded English** in a `VARIANTS` const.
- A confirm tone (danger / primary).

`[CODE]` falcon-popup.component.ts:1-12 — the popup is **NOT** a Stencil dual-render component and does **NOT** compose `falcon-dialog`. It is a **pure-Angular standalone component** with an inline `template` + inline `styles`, composing the Stencil Light-DOM `<falcon-button-tw>` for its footer buttons. ARIA `role="dialog"` + `aria-modal="true"`.

`[CODE]` **Top Layer architecture (corrected 2026-06-03):** since Phase A / Wave 3.3+3.4 (2026-05-21) the inline template renders the panel inside a native `<dialog falconOverlay="modal">` (`[CODE]` falcon-popup.component.ts:101-112). The `[falconOverlay]` directive calls `showModal()` → the popup enters the browser **Top Layer**. This **supersedes the prior dossier's "outer `.fixed` wrapper + `@HostListener('document:keydown.escape')`" model** — the HostListener is gone; the native `<dialog>` `cancel` event (ESC) routes to `(falconClose)="onCancel()"`, and `showModal()` provides OS-level modal **focus containment + inertness** (mitigating the old "no focus trap P0" gap — see GAPS).

## Business / UI use case
- Confirm destructive deletion of a record (`delete`).
- Warn about unsaved changes before navigation (`unsaved`).
- Confirm publish/save with a summary hint (`save`).
- Generic error fallback when an action fails (`error`) — including the global HTTP-error surface.

## When to use it
- Whenever the page needs an action-required modal matching one of the 4 variants.
- For ANY confirmation that maps cleanly to error / delete / unsaved / save.
- As an OK-only acknowledgement (`[hideCancel]="true"`) or a dismiss-only dialog (`[hideConfirm]="true"`).

## When NOT to use it
- For passive notifications — use `falcon-angular-notification`.
- For tooltips, menus, drawers, dialogs — dedicated components.
- For confirmations with non-standard semantics (e.g. "Schedule for later", "Archive", "Restore") — the 4 variants are a closed set; use `falcon-angular-confirm-dialog`.
- When you need rich body content / a form inside the modal — popup has NO content slots; use `falcon-angular-dialog`.

## Active / preferred / deprecated / legacy status
**ACTIVE — preferred for action-required modals.** Promoted from `apps/demo/angular` (Wave 5). The canonical surface for the 4 flows; replaces direct `<falcon-angular-dialog>` use for them. Two app-shell host components (`FalconAngularHttpErrorDialogHostComponent`, `FalconUnsavedChangesHostComponent`) compose it as singletons.

## Replaces
- Hand-rolled confirm dialogs from V0.2.
- Direct `<falcon-angular-dialog>` use for delete / unsaved / save / error patterns.

## Paths

| Artifact | Path |
|---|---|
| Angular component | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-popup/falcon-popup.component.ts` (**416 lines**, INLINE template + inline `styles`) |
| Stencil sources | _None_ — Angular-only. No `falcon-popup.tsx` / `-tw.tsx` / `.types.ts` exist (verified by Glob 2026-06-03). |
| Token file | _None_ — uses Falcon palette tokens directly via Tailwind utilities (GAP G-TOKENS). |
| Footer buttons | Composes the Stencil Light-DOM `<falcon-button-tw>` directly; `ngOnInit` calls `defineFalconTwComponent('falcon-button')` (`[CODE]` :296-298). |
| Top-Layer directive | `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.directive.ts` (shared lifecycle owner) |
| Config defaults | `FalconConfigurationService.popup` (`FalconPopupDefaults` in `falcon-configuration.types.ts:87`) — supplies `glossy`/`iconBg`/`iconColor` defaults when the input is `undefined`. |
| Composing host (errors) | `falcon-http-error-dialog-host.component.ts` + `falcon-http-error-dialog.service.ts` (OK-only `error` popup) |
| Composing host (unsaved) | `falcon-unsaved-changes-host.component.ts` + `falcon-unsaved-changes.service.ts` (`unsaved` variant) |
| Spec | _None_ for the library component (verified 2026-06-03). Consumer-side: `apps/admin-console/.../new-wallet-balance/__tests__/confirm-save-modal.spec.ts`. |

## Selectors / tags
- Angular only: `<falcon-angular-popup>`
- No Stencil tag.

## Known consumers (grep verified 2026-06-03)
`[CODE]` grep `falcon-angular-popup` across `apps/` = **5 files / 9 occurrences**, **0 direct in `libs/falcon`** (but composed by 2 library host components in `falcon-ui-core`). Live consumers:

- `apps/{admin,management}-console/.../templates-page/components/templates-wizard/templates-wizard.component.ts` (1 each) — wizard discard/confirm.
- `apps/admin-console/.../new-wallet-balance/components/wb-confirm-save-modal/wb-confirm-save-modal.component.ts` (3) + `new-wallet-balance/__tests__/confirm-save-modal.spec.ts` (3, test).
- `apps/host-shell/.../falcon-ui-showcase/library-section/library-section.component.ts` (1, showcase).
- **PLUS** the two library host components in `falcon-ui-core` that compose it for the global error + unsaved-changes flows (so the *effective* reach is far wider than the direct count).

See `USAGE.md` Consumer Sweep. (NOTE: the prior dossier's org-hierarchy add-user/add-client/page-menu/applications-table + otp-dialog hits are stale — those features no longer render `<falcon-angular-popup>` directly; the wizards now route through the unsaved-changes host or the templates-wizard.)

## Related components
- `falcon-angular-dialog` — sibling base modal. Popup does NOT compose dialog (parallel implementations). Same native-`<dialog falconOverlay="modal">` Top Layer pattern.
- `falcon-angular-confirm-dialog` — alternative for OK/Cancel that DOES compose dialog. Pick popup for the 4 canonical flows; confirm-dialog for everything else.
- `falcon-button-tw` (Stencil Light DOM) — composed internally for the footer buttons (event is `(falcon-click)`, dash-separated).
- `FalconAngularHttpErrorDialogHostComponent` / `FalconUnsavedChangesHostComponent` — singleton app-shell hosts that drive popup from a service signal.

## Ownership / responsibility
`libs/falcon-ui-core`. Variants are HARDCODED in a `VARIANTS: Record<FalconPopupVariant, VariantContent>` const (`[CODE]` :47-92) — adding a 5th variant requires source changes (not configuration).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14) against falcon-popup.component.ts (416 ln), falcon-http-error-dialog-host.component.ts, falcon-unsaved-changes-host.component.ts, falcon-configuration.types.ts:87. Confirmed Angular-only (no Stencil sources — Glob clean). MAJOR drift corrected: native `<dialog falconOverlay="modal">` Top Layer (was "fixed wrapper + HostListener"); `hideCancel`/`hideConfirm` inputs; `undefined`-sentinel visual defaults via `FalconConfigurationService`; consumer sweep 5 app files / 9 + 2 lib hosts (was 8 stale files).
