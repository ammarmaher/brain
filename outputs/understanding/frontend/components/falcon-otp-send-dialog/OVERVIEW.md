# falcon-otp-send-dialog — OVERVIEW

## Component purpose

A two-step verify-identity dialog (Stencil dual-render **composer**) that walks a user through *choosing a delivery channel* → *receiving a code* → *transcribing it*. `[CODE]` falcon-otp-send-dialog.tsx:1-6 header: "Composer: `<falcon-dialog>` shell + step 1 channel selection (radios) + step 2 OTP entry. Composes existing components — never re-implements their internals." Step 1 (channel) → Send → Step 2 (code) with Verify + Resend. **Validation is deferred** — the dialog emits intents; the host flow performs the Identity calls.

It embeds `<falcon-dialog>` (shell, `size="sm"`, closable, dismissible) + `<falcon-radio>` rows (email / sms / both) + `<falcon-otp>` (code boxes) + `<falcon-button>` (`[CODE]` falcon-otp-send-dialog.tsx:346-364, channel radios :245-252, OTP :298-306).

## Business / UI use case

- Verify-identity / step-up-authentication ceremonies: send a code to email/sms, then confirm.
- `[INFERRED]` Account-owner verification inside an Add Client wizard; login second factor; sensitive-action confirmation.

## When to use it / when NOT to use it

**Use it for:** any OTP-send-then-verify flow that needs a channel chooser + a code-entry step in one modal.

**Do NOT use it for:**
- Inline OTP without a dialog → `<falcon-angular-otp>`.
- A generic confirm/cancel modal → `<falcon-angular-dialog>` / `<falcon-angular-popup>`.
- Channel radios with no OTP step → a `<falcon-angular-radio>` group.
- A value-bearing form control → this is an orchestrator, not a CVA control.

## Status

**ACTIVE / PREFERRED** for OTP flows. `[CODE]` 2026-06-03 — has **zero live consumers** in app/feature code right now (see Known consumers); it remains a maintained library component exercised via the showcase + the prior add-user-wizard usage that has since been removed.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-otp-send-dialog/falcon-otp-send-dialog.component.ts` (107 ln) |
| Angular wrapper HTML | `.../falcon-otp-send-dialog.component.html` (55 ln — pure `@if useTailwind` tag-switcher) |
| Angular wrapper CSS | `.../falcon-otp-send-dialog.component.css` (layout-only) |
| Angular barrel | `.../falcon-otp-send-dialog/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-otp-send-dialog/falcon-otp-send-dialog.tsx` (366 ln, `shadow: true`) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-otp-send-dialog/falcon-otp-send-dialog.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-otp-send-dialog-tw/falcon-otp-send-dialog-tw.tsx` (362 ln, `shadow: false`) |
| Types | `libs/falcon-ui-core/src/components/falcon-otp-send-dialog/falcon-otp-send-dialog.types.ts` (33 ln) |
| Utils | `libs/falcon-ui-core/src/components/falcon-otp-send-dialog/falcon-otp-send-dialog.utils.ts` (74 ln — channel/label/sub-text helpers) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/otp-send-dialog-tailwind-classes.ts` (18 class-builders, token-only) |
| Component token file | `libs/falcon-ui-tokens/src/components/otp-send-dialog.tokens.css` (149 ln — `:where()` scoped, ALSO covers `falcon-dialog*`) |
| Stencil unit spec | **NONE** (`[CODE]` grep 2026-06-03) |
| Stencil e2e | **NONE** (`[CODE]` grep 2026-06-03) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-otp-send-dialog` |
| Stencil Shadow tag | `<falcon-otp-send-dialog>` |
| Stencil Light tag | `<falcon-otp-send-dialog-tw>` |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-otp-send-dialog` across `apps/` = **0 files**; `libs/falcon/` = **0 files**. The prior dossier's 2026-05-17 consumers (`add-user-wizard.component.html/.ts` + `playground.page.html`) are **GONE** — the add-user-wizard no longer embeds it, the playground route was removed.

Non-render references only:
- `libs/falcon/src/shared-ui/index.ts` — re-export of `FalconAngularOtpSendDialogComponent`.
- `apps/admin-console/src/tailwind.css` + `apps/host-shell/src/tailwind.css` — `@source` glob (so the `-tw` utility classes are kept by the Tailwind JIT).
- `host-shell .../falcon-ui-showcase/showcase-data/registry.ts` + showcase/`demos` docs (`otp-send-dialog.md`).

> **Net: zero live app-feature consumers.** The component is maintained-but-unused in features today; it is the packaged ceremony ready for the next verify-identity flow.

## Related components

- **Composes:** `<falcon-angular-dialog>` (shell), `<falcon-angular-radio>` (channel rows), `<falcon-angular-otp>` (code boxes), `<falcon-angular-button>` (Send/Verify/Cancel).
- **Sibling verify control:** `<falcon-angular-phone-field>` (with a Verify button — often *opens* this kind of dialog).
- The token file is shared-scoped with `<falcon-dialog>` (the composed shell).

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by the Falcon UI team. Token contract in `libs/falcon-ui-tokens` (`otp-send-dialog.tokens.css`). No React/Vue wrapper (`[CODE]` grep — Stencil-core + Angular-wrapper only).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B07 sweep). Source-file table re-confirmed (wrapper 107 ln / Shadow 366 ln / `-tw` 362 ln / utils 74 ln / tokens 149 ln). Drift corrected: consumers now **0** live (was 3); added the full source-file table (utils / tailwind-helper / both Stencil CSS were missing). Composed children confirmed against the render tree.
