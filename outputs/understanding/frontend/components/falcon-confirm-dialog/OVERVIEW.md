# falcon-confirm-dialog — OVERVIEW

## Component purpose

Specialised composed variant of `<falcon-dialog>` providing a **fixed confirm/reject layout** — an optional icon + message in the body, projected with a reject + accept button pair into the underlying dialog's `footer` slot. Architect §5.12.2 "specialized composed pattern" (`[CODE]` falcon-confirm-dialog.tsx:3).

> **⚠️ DORMANT — the Angular wrapper is fully commented out.** `[CODE]` `falcon-confirm-dialog.component.ts` is 100% commented (lines 1-79), `falcon-confirm-dialog.component.html` is 100% commented (lines 1-46), and `index.ts` exports `export {}` only with the live export line commented (`[CODE]` index.ts:6-7). The two Stencil tags (`<falcon-confirm-dialog>` / `<falcon-confirm-dialog-tw>`) compile and are registered (`[CODE]` stub-seeder.cjs, define-custom-elements.ts) but are **instantiated by NOTHING in the codebase**. The live "confirm" UX is delivered by a different path (see *Replaces / superseded by* below).

## Business / UI use case

- *(As-designed, currently unused)* OK / Cancel prompts that don't match the 4 `<falcon-angular-popup>` canonical variants.
- *(As-designed)* Confirmations with explicit accept/reject button labels (e.g. "Approve" / "Reject", "Continue" / "Go back") where `severity` should drive an accent.

## When to use it / when NOT to use it

**Use it for:** nothing new — it is dormant. Any "are you sure?" prompt today goes through `FalconConfirmService.confirm()` → `FalconMessageOrchestratorService` → `<falcon-angular-popup variant="error">` (`[CODE]` falcon-confirm.service.ts:91-105; falcon-modal-adapter.component.ts:51-61). For an acknowledgement-style "read this" dialog use `<falcon-angular-alert-dialog>`.

**Do NOT use it for:**
- The 4 canonical action-required flows → `<falcon-angular-popup>`.
- Form-bearing / custom-body dialogs → `<falcon-angular-dialog>` directly.
- High-severity confirm/cancel decisions → `<falcon-angular-alert-dialog>` (the live substrate that the orchestrator/error-host render).
- Re-activating this wrapper "to use it" — do not uncomment without an explicit owning decision (it duplicates the popup/alert-dialog confirm story). See `GAPS_AND_UPGRADES.md` G1.

## Status

**DORMANT / SUPERSEDED.** Wave 9.F built the Stencil pair + Angular wrapper as a `<falcon-dialog>` specialization. Since then the Angular wrapper was commented out wholesale and the confirm UX migrated to `FalconConfirmService` (Phase 5, 2026-05-24) which renders `<falcon-angular-popup>`. The Stencil pair survives but is **dead code with zero render consumers** (`[CODE]` grep 2026-06-03). NOT exported via the live Angular barrel.

## Replaces / superseded by

- **Was meant to replace** PrimeNG `<p-confirmDialog>` (Wave PR-8, per prior dossier).
- **Superseded in practice by** the orchestrator modal path: `FalconConfirmService.confirm()` (returns `Observable<boolean>`) → `FalconMessageOrchestratorService.show({ category: 'action-required' })` → `FalconModalAdapterComponent` → `<falcon-angular-popup variant="error">` (`[CODE]` falcon-confirm.service.ts:1-16, 91-105). The confirm-dialog Stencil component is NOT in that path.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-confirm-dialog/falcon-confirm-dialog.component.ts` — **100% commented (dormant)** |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-confirm-dialog/falcon-confirm-dialog.component.html` — **100% commented (dormant)** |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-confirm-dialog/index.ts` — `export {}` (live export line commented, `[CODE]` :6-7) |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-confirm-dialog/falcon-confirm-dialog.tsx` (145 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-confirm-dialog/falcon-confirm-dialog.css` (64 ln) |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-confirm-dialog/falcon-confirm-dialog.types.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-confirm-dialog-tw/falcon-confirm-dialog-tw.tsx` (108 ln) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/confirm-dialog-tailwind-classes.ts` (9 ln — `falconConfirmDialogAcceptClasses()` / `falconConfirmDialogRejectClasses()`; **not referenced by the `-tw` twin**, which inlines literals) |
| Token file | `libs/falcon-ui-tokens/src/components/confirm-dialog.tokens.css` (29 ln) |
| Stencil unit spec | _none_ (no `.spec.ts` / `.e2e.ts` on disk) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-confirm-dialog` — **declared only inside the commented-out component; not live** |
| Stencil Shadow tag | `<falcon-confirm-dialog>` |
| Stencil Light tag | `<falcon-confirm-dialog-tw>` |

## Known consumers (grep verified 2026-06-03)

**ZERO.** `[CODE]` grep `<falcon-angular-confirm-dialog[^-]` / `<falcon-confirm-dialog[^-]` across `apps/` + `libs/falcon/` + `libs/falcon-ui-core/` (excluding the component's own folders) = **0 render sites**. The only hits are the component's own source, the `confirm-dialog-tailwind-classes.ts` helper, the `confirm-dialog.tokens.css` token file, the stub-seeder/define-custom-elements registration lists, and comment references. Note: `<falcon-angular-confirm-dialog-host>` (mounted once in `host-shell/app.ts:53`) is a **different component** — it renders `<falcon-angular-alert-dialog>`, NOT this confirm-dialog.

## Related components

- **Composes:** `<falcon-dialog>` / `<falcon-dialog-tw>` (substrate; `[CODE]` falcon-confirm-dialog.tsx:100, falcon-confirm-dialog-tw.tsx:69). See `[BRAIN-OUT]` `components/falcon-dialog/`.
- **Superseded by:** `<falcon-angular-popup>` (the orchestrator's `action-required` renderer) + `<falcon-angular-alert-dialog>` (the rich confirm/cancel substrate). See `[BRAIN-OUT]` `components/falcon-alert-dialog/`.
- **Sibling host:** `<falcon-angular-confirm-dialog-host>` + `FalconConfirmService` — the imperative confirm path that does NOT use this component. See `[BRAIN-OUT]` `components/falcon-confirm-dialog-host/`.

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI team. Token contract in `libs/falcon-ui-tokens`. **Owning decision pending** on whether to delete the dormant trio (wrapper + 2 Stencil tags + helper + token file) or revive it (see `GAPS_AND_UPGRADES.md`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15 sweep). REFRESH of the prior dossier — corrected the central drift: the Angular wrapper is now **fully commented out / dormant** (prior dossier described it as live), the Tailwind helper is unused by the `-tw` twin, and the live confirm UX is the `FalconConfirmService`→popup path, not this component. Consumer count corrected to **0** (prior: "no matches", now explicitly verified across all three roots).
