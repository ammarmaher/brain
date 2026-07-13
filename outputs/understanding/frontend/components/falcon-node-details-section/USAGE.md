# falcon-node-details-section — USAGE

## Real usage examples (active codebase)

### Example 1 — Flagship: org-hierarchy node header with projected brand avatar + per-mode actions

`[CODE]` `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html:151-159` (same in management-console):

```html
<falcon-node-details-section
  [label]="state.selectedNodeIdentity()?.name ?? node.name"
  [imageUrl]="node.imageUrl ?? null">
  @if (state.selectedNodeIdentity(); as id) {
    <ng-template falconNodeDetailsAvatar>
      <app-org-node-avatar [identity]="id" size="md" />
    </ng-template>
  }
  <ng-template falconNodeDetailsActions>
    @if (isSettingsTab && state.settingsEditMode()) {
      <falcon-angular-button variant="secondary" size="md" ... (falconClick)="state.cancelSettingsEdit()">
        <span slot="label">{{ 'hierarchy.actions.cancel' | translate }}</span>
      </falcon-angular-button>
      <falcon-angular-button variant="primary" size="md" [loading]="state.settingsSubmitting()" ... >
        <span slot="label">{{ 'hierarchy.settings.actions.saveChanges' | translate }}</span>
      </falcon-angular-button>
    } @else if (isSettingsTab && state.settingsMode() === 'view') {
      ... Edit button (PES-gated) ...
    }
  </ng-template>
</falcon-node-details-section>
```

This is the textbook usage: parent owns mode state (`settingsEditMode()` / `settingsMode()`), projects the brand-aware `<app-org-node-avatar>` into the avatar slot, and projects the correct buttons (Cancel/Save vs Edit) into the actions slot.

### Example 2 — Selected-node header above a data table (no actions)

`[CODE]` `apps/admin-console/src/app/features/comm-channels-services/comm-channels-services.component.html:24` (comment ts:4-6):

```html
<falcon-node-details-section [label]="state.selectedNodeIdentity()?.name ?? node.name">
  @if (state.selectedNodeIdentity(); as id) {
    ... avatar template ...
  }
</falcon-node-details-section>
```

Here the actions slot is intentionally empty — the strip is purely the identity header above the Communication Channels table. `marketplace-applications.component.html:1` uses the identical pattern (comment ts:4-6).

## Recommended usage for NEW Angular pages

```html
<falcon-node-details-section
  [label]="entity().name"
  [imageUrl]="entity().logoUrl ?? null"
  [imageAlt]="entity().name">
  <!-- Optional: custom avatar (brand SVG / status chip) -->
  <ng-template falconNodeDetailsAvatar>
    <app-my-avatar [entity]="entity()" />
  </ng-template>
  <!-- Optional: mode-aware action buttons -->
  <ng-template falconNodeDetailsActions>
    @if (editMode()) {
      <falcon-angular-button variant="secondary" (falconClick)="cancel()">
        <span slot="label">{{ 'common.cancel' | translate }}</span>
      </falcon-angular-button>
      <falcon-angular-button variant="primary" [loading]="saving()" (falconClick)="save()">
        <span slot="label">{{ 'common.save' | translate }}</span>
      </falcon-angular-button>
    } @else {
      <falcon-angular-button variant="primary" (falconClick)="enterEdit()">
        <span slot="label">{{ 'common.edit' | translate }}</span>
      </falcon-angular-button>
    }
  </ng-template>
</falcon-node-details-section>
```

Add `FalconNodeDetailsSectionComponent`, `FalconNodeDetailsActionsDirective`, and `FalconNodeDetailsAvatarDirective` (only the ones you use) to `imports: []`.

## Reactive Forms / ngModel

**N/A** — this is not a form control (no CVA). It captures no value; it only displays a label + avatar and projects actions.

## Tailwind-only usage

`[CODE]` The host carries `class="block w-full"` (ts:34). Add layout utilities via the host `class=` on the element:

```html
<falcon-node-details-section class="border-b border-falcon-neutral-150" [label]="name()" />
```

(If you need the divider line under the strip, add `border-b border-falcon-neutral-150` on the host — the component's own template no longer applies it despite the stale comment, GAP G4.)

## Per-instance token override

**N/A in the usual sense** — there is no `node-details-section.tokens.css` to override. The strip's colours come from platform Falcon-Tailwind utilities baked into the template (`bg-falcon-neutral-0`, `text-falcon-neutral-925`, `bg-falcon-teal-700`). To restyle, you would change those utilities at the component (a shared change, GAP G6) — per-page colour overrides are not supported.

## Do / Don't

| Do | Don't |
|---|---|
| Pass `[label]` (required) + optional `[imageUrl]`. | Forget `label` — it is `input.required`. |
| Project actions via `<ng-template falconNodeDetailsActions>`. | Try to pass actions as a string input — there is none. |
| Project a custom avatar via `<ng-template falconNodeDetailsAvatar>` (e.g. `<app-org-node-avatar>`). | Re-implement the brand SVG inline — project the shared avatar component instead. |
| Use `<falcon-angular-button>` inside the actions slot. | Use native `<button>` in the actions slot — house rule is Falcon components. |
| Let the parent own mode state and decide which buttons render. | Bake mode logic into the strip — it is presentational by design. |
| Add the divider via host `class="border-b …"` if needed. | Rely on the strip rendering a `border-b` itself (it doesn't — stale comment, G4). |
| Use this instead of `<falcon-org-node-header>`. | Use `<falcon-org-node-header>` / `<app-org-node-header>` — both are 0-consumer deletion candidates (B25). |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-node-details-section` across `apps/` `*.html` → **26 occurrences / 16 files**; across `libs/falcon` → **0 render sites** (the 5 lib matches are this component's own 4 source files + a descriptive comment in `falcon-info-card.component.ts`). The `falconNodeDetailsActions` / `falconNodeDetailsAvatar` directive selectors appear in **15** app files (the projecting templates).

App render-site files (occurrence counts):

- `apps/{admin,management}-console/.../org-hierarchy-page/components/org-hierarchy-page-menu.component.html` (2 each) — flagship.
- `apps/{admin,management}-console/.../org-hierarchy-page/components/tab-components/settings-tab/settings-tab.component.html` (1 each).
- `apps/{admin,management}-console/.../org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` (1 each).
- `apps/{admin,management}-console/.../templates-page/components/templates-list.component.html` (1-2).
- `apps/{admin,management}-console/.../templates-page/components/templates-wizard/templates-wizard.component.html` (2 each).
- `apps/{admin,management}-console/.../templates-page/components/templates-details/templates-details.component.html` (2 each).
- `apps/management-console/.../new-wallet-balance/components/wb-client-view/wb-client-view.component.html` (2).
- `apps/admin-console/.../comm-channels-services/comm-channels-services.component.html` (1).
- `apps/admin-console/.../marketplace-applications/marketplace-applications.component.html` (1).

> `[CODE]` This is the **highest-adoption** component in the B25/B26 shared-ui batches (26 sites vs 0 for the superseded `<falcon-org-node-header>`). It is the de-facto platform node-header.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26). Example 1 (org-hierarchy avatar + per-mode actions) confirmed at org-hierarchy-page-menu.component.html:151-190; Example 2 (comm-channels) at comm-channels-services.component.html:24 (+ ts comment). Consumer Sweep re-run (`<falcon-node-details-section` → 26 occurrences / 16 app HTML files + 0 in libs/falcon; 15 directive-projecting files).
