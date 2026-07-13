# falcon-wizard-finalization — TOKENS

## Component token file

**NONE.** `[CODE]` `falcon-wizard-finalization` is an Angular composite orchestrator with `styles: [':host { display: contents; }']` (ts:104) and **no `.css`/`.scss` file and no `libs/falcon-ui-tokens/src/components/*.tokens.css` of its own.** It renders no visible box — all visuals come from the two child components it mounts, each of which owns its own token contract:

| Child component | Token file (owned by the child) |
|---|---|
| `<falcon-angular-sending-credentials-dialog>` | its own `sending-credentials-dialog` token contract (channel cards, dialog surface, Send/Cancel buttons). |
| `<falcon-angular-completion-success-dialog>` | its own `completion-success-dialog` token contract (clipboard illustration, branded panel, auto-dismiss). |

> To restyle the finalization UX, override the **child dialogs'** `--falcon-*` tokens (or pass their label inputs through the orchestrator's passthrough inputs). There is no `--falcon-wizard-finalization-*` namespace.

## Theme tokens used directly by this component

**None.** The orchestrator writes no colors/spacing. The only CSS it emits is `display: contents` (so it adds no layout box).

## Tailwind utility guidance for this component

`[CODE]` Do NOT add Tailwind classes to `<falcon-angular-wizard-finalization>` — `display: contents` means utilities on the host have no visual effect (no box to style). Layout/spacing belong to the child dialogs (which position themselves as overlays/modals) or to the page around the wizard.

## Dark mode support

Inherited entirely from the two child dialogs' token contracts + the global Falcon dark layer. The orchestrator contributes nothing. NOT separately verified.

## Density support

n/a — no own visuals.

## RTL support

Inherited from the child dialogs (each handles its own RTL). The orchestrator's `display: contents` is direction-neutral.

## Static style risks

- `[CODE]` **The only inline style is `:host { display: contents; }`** (ts:104) — intentional (the orchestrator must not introduce a wrapping box between the page and the overlay dialogs). No raw hex/px, no token-on-`:root`, gate-12 N/A (no token file).
- All visual risk lives in the two child dialogs' token files (out of scope for this dossier — see their dossiers).

## No CSS / no SCSS guidance

- The component correctly has **no `.scss`** and only the one structural inline style. House-rule compliant.
- Consumers must NOT add component CSS to restyle the finalization UX — override the child dialogs' tokens instead.

## Token usage by state

n/a for this component (no own tokens). State (picker / loading / success / error) is expressed by which child is mounted + the central loader overlay, not by token swaps:

| Phase | What renders |
|---|---|
| `open && !submitting && !successOpen` | `<falcon-angular-sending-credentials-dialog>` (channel picker) |
| `submitting` | picker closed; `FalconLoaderService` central overlay (the loader's own tokens) |
| success | `<falcon-angular-completion-success-dialog>` (success ack) |
| error | orchestrator `business-error` toast (the toast's own tokens) |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20, NEW dossier). Confirmed the component has NO token file and NO `.css`/`.scss` — only `styles: [':host { display: contents; }']` (ts:104). Visual tokens are owned by the two child dialogs + the loader overlay + the orchestrator toast (each documented separately). House-rule compliant.
