# falcon-drawer — OVERVIEW

## Component purpose
Edge-anchored slide-in panel (drawer / off-canvas). Position-driven sizing (right/left → width; top/bottom → height). ARIA `role=dialog` + `aria-modal=true`, with focus trap, focus restore on close, Esc + backdrop dismiss, and slide-from-edge `transform: translateX/translateY ±100%` transitions. One of the three core overlay primitives (with `falcon-dialog` + `falcon-popup`).

`[CODE]` **Top Layer architecture (added 2026-06-03):** since Phase B / Wave 5.1 (2026-05-21) the Angular wrapper renders the Stencil tag **inside a native `<dialog falconOverlay="drawer">`** (`[CODE]` falcon-drawer.component.html:13-20). The `[falconOverlay]` directive calls `showModal()`, so the drawer enters the browser's **Top Layer**. The slide-in animation stays **intrinsic to the Stencil panel** (`transform: translateX/Y(±100%) → 0` on `data-open='true'`); the Stencil core is untouched. Its inner `position:fixed` overlay paint is neutralised via CSS-var override (`[CODE]` falcon-drawer.component.css:36-41) so the native `::backdrop` supplies dim+blur. Z-index is fallback-only at runtime (the prior z-index ladder is superseded — see INTEGRATION_VALIDATION.md).

## Business / UI use case
- Right-side detail / transfer panels — `[CODE]` the **Balance Transfer drawer** in BOTH consoles (`wallet-balance-management/.../balance-transfer.component.html` + `new-wallet-balance/.../wb-balance-transfer-drawer.component.html`) is the heaviest live consumer.
- "Add node" / "Edit node" drawers on Org Hierarchy tree (the historical use; the live `falcon-org-node-drawer` template could NOT be re-confirmed as a `<falcon-angular-drawer>` consumer this pass — see Consumer Sweep).
- Filter panels / side-anchored wizards / mobile off-canvas nav.

## When to use it
- When a sheet should slide in from a screen edge rather than scale-fade in the center (use `falcon-angular-dialog` for centered).
- When the form / list inside is tall and benefits from full-height layout (the Balance Transfer form is the canonical case).
- For a "preview / detail / transfer" pattern docked to the side of a table.

## When NOT to use it
- For confirm / accept / cancel flows — use `falcon-angular-popup` or `falcon-angular-confirm-dialog`.
- For passive notifications — use `falcon-angular-notification`.
- For tooltips — use `falcon-angular-tooltip`.
- For destructive confirmation — too heavy; use `falcon-angular-popup variant="delete"`.

## Active / preferred / deprecated / legacy status
**ACTIVE.** Used in production (Balance Transfer drawer, both consoles + both wallet feature variants). Preferred for side-anchored panels. **The prior dossier's "0 adoption / showcase-only" finding is RESOLVED** — see Consumer Sweep.

## Replaces
- PrimeNG `<p-sidebar>` (Wave PR-8).
- Hand-rolled `.drawer` HTML patterns from V0.2.

## Paths

| Artifact | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-drawer/falcon-drawer.component.ts` (103 ln) |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-drawer/falcon-drawer.component.html` (56 ln — native `<dialog falconOverlay="drawer">` shell) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-drawer/falcon-drawer.component.css` (76 ln — native `<dialog>` reset + `::backdrop` + reduced-motion + inner-overlay neutralisation) |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-drawer/falcon-drawer.tsx` (231 ln) |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-drawer/falcon-drawer.types.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-drawer-tw/falcon-drawer-tw.tsx` (229 ln) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/drawer-tailwind-classes.ts` (class builders for the `-tw` path) |
| Token file | `libs/falcon-ui-tokens/src/components/drawer.tokens.css` (114 ln) |
| Top-Layer directive | `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.directive.ts` (shared lifecycle owner) |
| Spec / e2e | _None_ for the Stencil cores / wrapper; `apps/management-console/.../new-wallet-balance/__tests__/standards-drawer.spec.ts` is a consumer-side standards spec (not a library spec). |

## Selectors / tags
- Angular: `<falcon-angular-drawer>`
- Stencil Shadow: `<falcon-drawer>` (`shadow: true`)
- Stencil Light: `<falcon-drawer-tw>` (`shadow: false`) — **default render path** (`useTailwind=true`)

## Known consumers (grep verified 2026-06-03)
`[CODE]` grep `falcon-angular-drawer` across `apps/` = **8 files / 12 occurrences**, **0 in `libs/falcon`**. Live consumers:

- `apps/{admin,management}-console/.../wallet-balance-management/components/balance-transfer/balance-transfer.component.{html,ts}` — Balance Transfer side panel.
- `apps/{admin,management}-console/.../new-wallet-balance/components/wb-balance-transfer-drawer/wb-balance-transfer-drawer.component.{html,ts}` — the rewritten new-wallet-balance transfer drawer.
- `apps/management-console/.../new-wallet-balance/__tests__/standards-drawer.spec.ts` (test — asserts drawer standards).

See `USAGE.md` Consumer Sweep for the enumerated list + occurrence counts. (NOTE: the org-hierarchy `falcon-org-node-drawer` cited by the prior dossier did NOT appear in the 2026-06-03 grep — it may use a different shell now; flagged as unconfirmed.)

## Related components
- `falcon-angular-dialog` — sibling centered modal (same hand-rolled focus-trap idiom; same `[falconOverlay]` directive, `"modal"`).
- `falcon-angular-popup` — for action-required confirms — drawer is for detail/work, popup is for decisions.
- `falcon-angular-button` — drawer footer Cancel + Save pair (canonical pattern).
- `falcon-angular-input` / `falcon-angular-dropdown` / form controls — typical body content.
- `[falconOverlay]` directive + `FalconStackingService` — shared Top-Layer substrate.

## Ownership / responsibility
`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI Core. The focus-trap + restore logic is duplicated with `falcon-angular-dialog` (consolidation is a known gap). Token contract in `libs/falcon-ui-tokens`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14) against falcon-drawer.component.ts/.html/.css (103/56/76 ln), falcon-drawer.tsx (231) + falcon-drawer-tw.tsx (229), drawer.tokens.css (114), falcon-overlay.directive.ts. MAJOR drift corrected: native `<dialog falconOverlay="drawer">` Top Layer wrapper (was undocumented); **adoption RESOLVED — 8 app files / 12 (Balance Transfer drawer ×2 features ×2 consoles), prior "0 consumers" was stale**; z-index demoted to fallback. Org-node-drawer consumer flagged unconfirmed (not in grep).
