# falcon-tooltip — OVERVIEW

## Component purpose

Decorator-style wrapper that reveals a small floating panel on hover / focus of its trigger. 12 placement options (`top` / `right` / `bottom` / `left` × default + `-start` + `-end`). Interactive mode keeps the panel open while hovering the panel body (for a clickable link inside). Panel positioning is JS-computed (the documented **escape hatch** — `panel.style.transform` from `computeOffset()`); all other paint stays in tokens. Dual-render Stencil component: Shadow DOM `<falcon-tooltip>` + Light DOM `<falcon-tooltip-tw>` + Angular wrapper `<falcon-angular-tooltip>`.

`[CODE]` **The Angular wrapper additionally promotes the tooltip panel into the browser's Top Layer via the native Popover API** (Phase C / Wave 6, 2026-05-21) — `acquireTopLayer()` finds the rendered panel (`[data-component="falcon-tooltip-panel"]`), sets `popover="manual"`, calls `showPopover()`, and registers it with `FalconStackingService` so a hint on a control inside a table/dialog escapes every ancestor stacking context. The Stencil's own pointer-leave/blur handlers still drive close (`[CODE]` falcon-tooltip.component.ts:48-177). The prior dossier did NOT document this.

## Business / UI use case

- Icon-button affordance labels ("Edit", "Delete") for icon-only `<falcon-angular-button>`.
- Truncated text expansion (full value behind a `…`-truncated table cell).
- Field hints for compact forms (info-circle next to a label).
- Status-indicator legends.

## When to use it / when NOT to use it

**Use it for:**
- Pure informational hover/focus hints.
- Icon-only buttons that need a visible label for sighted users.
- Truncated labels.

**Do NOT use it for:**
- Action menus → `<falcon-angular-menu>`.
- Popovers with substantial interactive content (more than one link) → a custom popup / dropdown panel.
- Decision flows → orchestrator modal channel / confirm-dialog.
- Passive notifications → `<falcon-angular-notification>` (via orchestrator).

## Status

`[CODE]` **ACTIVE.** Wave 9.F; Top-Layer-migrated (Wave 6). Production-grade. No `@deprecated` annotation. **Under-leveraged** — zero feature-template consumers in apps (see Known consumers).

## Replaces

- `[CODE]` PrimeNG `[pTooltip]` directive (Wave PR-8).
- Native HTML `title=""` attribute (visually unstyled / uncontrollable).

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tooltip/falcon-tooltip.component.ts` (178 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tooltip/falcon-tooltip.component.html` (34 ln) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tooltip/falcon-tooltip.component.css` (`:host { display: inline-flex; }`) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tooltip/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-tooltip/falcon-tooltip.tsx` (200 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-tooltip/falcon-tooltip.css` (120 ln) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-tooltip-tw/falcon-tooltip-tw.tsx` (239 ln) |
| Types | `libs/falcon-ui-core/src/components/falcon-tooltip/falcon-tooltip.types.ts` |
| Utils (pure positioning) | `libs/falcon-ui-core/src/components/falcon-tooltip/falcon-tooltip.utils.ts` (68 ln; `splitPlacement` + `computeOffset`) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/tooltip-tailwind-classes.ts` (55 ln) |
| Token file | `libs/falcon-ui-tokens/src/components/tooltip.tokens.css` (95 ln) |
| Spec / e2e | **NONE** in `falcon-ui-core` — `[CODE]` no `*tooltip*.spec.ts` exists (verified 2026-06-03). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular | `falcon-angular-tooltip` |
| Stencil Shadow | `<falcon-tooltip>` (`shadow: true`) |
| Stencil Light | `<falcon-tooltip-tw>` (`shadow: false`) |

## Known consumers (grep verified 2026-06-03)

`[CODE]` grep `falcon-angular-tooltip` / `FalconAngularTooltipComponent` across the repo (excl. node_modules) = **NO `apps/**` consumers** (zero feature-template usage). References:

- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tooltip/` — the component's own files.
- `libs/falcon/src/shared-ui/index.ts:235` — `@falcon` barrel re-export.
- `libs/falcon-studio/src/lib/registry/{gallery-defaults.ts, examples/overlay-feedback-examples.ts}` — Falcon Studio gallery showcase (design-time).
- `libs/falcon-ui-core/SPEC-LOCK.md` · `libs/falcon-ui-tokens/src/components/tooltip.tokens.css` — doc/token refs.

> The prior dossier's `apps/host-shell/src/app/playground/playground.page.html` consumer is GONE (playground route removed; showcase moved to falcon-studio gallery). Net consumer count in real app code: **0**. Under-leveraged primitive — should be paired with icon-only buttons across the consoles.

## Related components

- `falcon-angular-button` (especially `iconOnly`) — the primary intended trigger (button-with-tooltip combo).
- `falcon-angular-icon` — common trigger child.
- `FalconStackingService` (`angular-wrapper/utilities/falcon-stacking.service.ts`) — the wrapper registers the Top-Layer'd panel here so it out-ranks drawers/dialogs. Shared with `<falcon-angular-dropdown>` (which uses body-portal + Top Layer).

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI team. Production-ready, low-risk. Token contract in `libs/falcon-ui-tokens`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16). All source paths + line counts re-confirmed; the Wave-6 Top-Layer/Popover migration in the Angular wrapper ADDED (prior dossier omitted it entirely). Consumer sweep re-run: ZERO `apps/**` consumers (playground showcase gone → falcon-studio gallery).
