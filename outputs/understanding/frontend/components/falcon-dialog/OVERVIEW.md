# falcon-dialog — OVERVIEW

## Component purpose
Centred modal overlay with backdrop, header / body / footer slots, focus trap, focus restore, Esc + backdrop dismiss. Severity tones (`info` / `success` / `warning` / `danger`), 5 sizes (`sm` / `md` / `lg` / `xl` / `full`), 3 positions (`center` / `top` / `side-right`). One of the three core overlay primitives (with `falcon-drawer` + `falcon-popup`) that the rest of the dialog family composes on.

`[CODE]` **Top Layer architecture (corrected 2026-06-03):** as of the 8-wave Top Layer migration (Phase B / Wave 4.1, 2026-05-21) the Angular wrapper renders the Stencil tag **inside a native `<dialog falconOverlay="modal">`** (`[CODE]` falcon-dialog.component.html:11-17). The `[falconOverlay]` directive (`[CODE]` falcon-overlay.directive.ts) calls `showModal()`, so the overlay enters the browser's **Top Layer** (a parallel paint context above the whole z-index world). The Stencil shadow-DOM core is **untouched** — its internal `position:fixed` backdrop paint is neutralised via CSS-var override (`[CODE]` falcon-dialog.component.css:23-32) so the native `::backdrop` alone supplies dim+blur. This means z-index is irrelevant at runtime for the migrated wrapper (the prior dossier's z-index-ladder narrative is now a fallback-only story — see TOKENS.md / INTEGRATION_VALIDATION.md).

## Business / UI use case
- Generic centered modal — a custom-shaped dialog body that the canonical `falcon-angular-popup` variants don't fit.
- `[CODE]` Real production use: the **contact-groups Share dialog** (`apps/management-console/.../contact-groups/share-dialog/share-dialog.component.html:7`) — a genuine bespoke-body modal (multiselect + AllUsers toggle + error banner) with `[closable]`/`[closeOnBackdrop]`/`[closeOnEsc]` gated on a `submitting()` signal. This is the textbook justified-direct-use case.
- `[CODE]` The **new-wallet-balance confirm-save modal** (`wb-confirm-save-modal.component.ts`) composes `<falcon-angular-dialog>` directly.
- `[CODE]` The **templates-page flow-type modal** (`flow-type-modal.component.ts` in both consoles) composes it.
- The underlying primitive historically composed by `falcon-angular-confirm-dialog` (per registry note).

## When to use it
- **Rarely directly.** Prefer:
  - `falcon-angular-popup` — for the 4 canonical action-required variants (error / delete / unsaved / save).
  - `falcon-angular-confirm-dialog` — for OK / Cancel prompts with severity.
  - `falcon-angular-drawer` — for side-anchored sheets.
- Use `falcon-angular-dialog` directly only when you genuinely need a custom modal body + footer that doesn't match the popup variants (the contact-groups Share dialog is the canonical example).

## When NOT to use it
- For the 4 canonical decision flows — `popup` already does them.
- For confirms with simple OK/Cancel — `confirm-dialog` already does that.
- For side sheets — `drawer` is right (do NOT use `position="side-right"`).

## Active / preferred / deprecated / legacy status
**@deprecated for direct net-new use** (registry + project-memory governance rule), but **functional and in production**. Per the registry: `@deprecated — prefer <falcon-angular-popup> for action-required flows. Kept for slot-friendly custom dialogs (e.g. send-credentials-popup).`

`[CODE]` The Stencil source still has **no JSDoc `@deprecated`** annotation, no `console.warn`, no compile-time signal (GAP G-DEP). The wrapper class is likewise un-annotated. So the deprecation is **convention-only** — nothing stops a builder reaching for it.

**Flagging clearly: NEW CODE should not directly render `<falcon-angular-dialog>` unless the body is genuinely bespoke.**

## Replaces
- PrimeNG `<p-dialog>` (Wave PR-8).

## Paths

| Artifact | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dialog/falcon-dialog.component.ts` (129 ln) |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dialog/falcon-dialog.component.html` (68 ln — native `<dialog falconOverlay="modal">` shell) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dialog/falcon-dialog.component.css` (67 ln — native `<dialog>` reset + `::backdrop` dim/blur + inner-backdrop neutralisation) |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-dialog/falcon-dialog.tsx` (254 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-dialog/falcon-dialog.css` |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-dialog/falcon-dialog.types.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-dialog-tw/falcon-dialog-tw.tsx` (254 ln) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/dialog-tailwind-classes.ts` (188 ln — class builders for the `-tw` path) |
| Token file | `libs/falcon-ui-tokens/src/components/dialog.tokens.css` (243 ln) |
| Top-Layer directive | `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.directive.ts` (shared lifecycle owner) |
| Stacking service | `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-stacking.service.ts` (shared toast-reassert registry) |
| Spec / e2e | _None_ for any layer (Shadow, `-tw`, wrapper) — confirmed 2026-06-03 (GAP G-TEST). |

## Selectors / tags
- Angular: `<falcon-angular-dialog>`
- Stencil Shadow: `<falcon-dialog>` (`shadow: true`)
- Stencil Light: `<falcon-dialog-tw>` (`shadow: false`) — **default render path** (`useTailwind=true`)

## Known consumers (grep verified 2026-06-03)
`[CODE]` grep `falcon-angular-dialog` across `apps/` = **9 files / 19 occurrences**, plus **2 in `libs/falcon`** (one is a `shared-ui/index.ts` re-export, one in `service-pricing-table`). The prior dossier's "1 file (playground showcase only)" + "otp-dialog.component.ts" claims are **stale** (the `playground` route is gone; otp-dialog now uses `falcon-angular-popup`, not dialog). Live consumers:

- `apps/management-console/.../contact-groups/share-dialog/share-dialog.component.html` (2) — **flagship bespoke-body modal**.
- `apps/{admin,management}-console/.../templates-page/.../steps/flow/flow-type-modal.component.ts` (1 each) + `flow-editor.component.ts` (1 each) + `flow-modal-bus.ts` (1 each — TS reference).
- `apps/admin-console/.../new-wallet-balance/components/wb-confirm-save-modal/wb-confirm-save-modal.component.ts` (7) + its `__tests__/confirm-save-modal.spec.ts` (4).
- `libs/falcon/src/shared-ui/index.ts` (re-export) · `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.ts` (2).

See `USAGE.md` Consumer Sweep for the enumerated list. (NOTE: `falcon-angular-confirm-dialog` composition could not be re-verified this pass — the registry note remains the source.)

## Related components
- `falcon-angular-confirm-dialog` — composes this for confirm/accept/reject layout (per registry; not re-verified 2026-06-03).
- `falcon-angular-popup` — sibling action-required modal (DOES NOT compose this; pure-Angular template + `<falcon-button-tw>`). Same native-`<dialog falconOverlay="modal">` Top Layer pattern.
- `falcon-angular-drawer` — sibling overlay; edge-anchored slide-in; same `[falconOverlay]` directive (`falconOverlay="drawer"`).
- `falcon-angular-button` — common footer content.

## Ownership / responsibility
`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI team. Kept for backwards-compat + composition substrate. Direct usage discouraged except for genuinely bespoke modal bodies. Token contract lives in `libs/falcon-ui-tokens`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14 sweep) against falcon-dialog.component.ts (129 ln), .component.html (68 ln), .component.css (67 ln), falcon-dialog.tsx (254 ln), falcon-dialog-tw.tsx (254 ln), dialog.tokens.css (243 ln), dialog-tailwind-classes.ts (188 ln), falcon-overlay.directive.ts. MAJOR drift corrected: native `<dialog falconOverlay="modal">` Top Layer wrapper (was undocumented); consumer sweep 9 app files / 19 + 2 lib (was "1 playground"); z-index demoted to fallback. Deprecation status ✅ VERIFIED `[BRAIN-OUT]` registry note (still convention-only — no source `@deprecated`).
