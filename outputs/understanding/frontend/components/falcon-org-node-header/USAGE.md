# falcon-org-node-header — USAGE

## Real usage examples (active codebase)

### Example 0 — There are NO live render consumers

`[CODE]` grep `<falcon-org-node-header[\s>]` across `apps/` + `libs/falcon/` = **0 render sites** (only documentation + the component's own source). The app-level twin `<app-org-node-header[\s>]` = **0** too. So there is no live `<falcon-org-node-header>` usage to cite. The intended use case is now served by `<falcon-node-details-section>` — see Example 1 (the supersessor).

### Example 1 — What the live org-hierarchy header ACTUALLY uses (`<falcon-node-details-section>`, the supersessor)

`[CODE]` `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html:151-178` (mgmt mirrors it):

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
      <falcon-angular-button variant="secondary" size="md"
        [disabled]="state.settingsSubmitting()"
        (falconClick)="state.cancelSettingsEdit()">
        <span slot="label">{{ 'hierarchy.actions.cancel' | translate }}</span>
      </falcon-angular-button>
      <falcon-angular-button variant="primary" size="md"
        [loading]="state.settingsSubmitting()"
        [disabled]="!state.settingsFormValid() || !state.settingsFormDirty() || state.settingsSubmitting()"
        (falconClick)="state.saveSettings()">
        <span slot="label">{{ 'hierarchy.settings.actions.saveChanges' | translate }}</span>
      </falcon-angular-button>
    } @else if (...) { ... }
  </ng-template>
</falcon-node-details-section>
```

> This is why `falcon-org-node-header` is unused: `<falcon-node-details-section>` is more flexible — the avatar is projected via `falconNodeDetailsAvatar` (sharing `<app-org-node-avatar>` with the wizard chromes), and the actions are projected `<falcon-angular-button>`s with full `loading`/`disabled`/PES gating, rather than the fixed `can*`-boolean native buttons baked into `falcon-org-node-header`.

### Example 2 — Hypothetical usage IF you were to consume `falcon-org-node-header` (NOT recommended)

`[CODE]` Derived from falcon-org-node-header.component.ts/html (no real consumer to cite):

```html
<!-- DEFAULT mode — built-in action row, can* booleans gate each button -->
<falcon-org-node-header
  [nodeName]="node.name"
  [nodeType]="node.isRoot ? 'root' : 'client'"
  [imageUrl]="node.imageUrl"
  [canAddClient]="pes.canAddClient()"
  [canAddNode]="pes.canAddNode()"
  [canEditNode]="pes.canEditNode()"
  [canAddUser]="pes.canAddUser()"
  [canShowInfo]="true"
  [infoOpen]="infoOpen()"
  (addClient)="onAddClient()"
  (addNode)="onAddNode()"
  (editNode)="onEditNode()"
  (addUser)="onAddUser()"
  (toggleInfo)="onToggleInfo()">
  <falcon-angular-tag slot="badge" severity="info">Falcon</falcon-angular-tag>
</falcon-org-node-header>
```

```html
<!-- CUSTOM-ACTIONS mode — suppress the built-in row, project your own -->
<falcon-org-node-header [nodeName]="node.name" [useCustomActions]="true">
  <div slot="actions">
    <falcon-angular-button variant="primary" (falconClick)="save()">
      <span slot="label">Save</span>
    </falcon-angular-button>
  </div>
</falcon-org-node-header>
```

> If you find yourself reaching for this, prefer `<falcon-node-details-section>` instead (Example 1). The `useCustomActions` + `[slot=actions]` combo is functionally a worse version of node-details-section's `falconNodeDetailsActions` template (which also handles the avatar via directive).

## Recommended usage for NEW Angular pages

**Do not adopt `<falcon-org-node-header>`.** For an org-node identity header, use `<falcon-node-details-section>` (label + `[imageUrl]` + `falconNodeDetailsAvatar` template + `falconNodeDetailsActions` template). It is the team's chosen, actively-maintained header.

If a future decision un-orphans `falcon-org-node-header`, first resolve the gaps in GAPS_AND_UPGRADES (delete the app-level twin to clear the name collision; swap native `<button>` → `<falcon-angular-button>`; tokenize the arbitrary px; fix the stale SCSS comment).

## i18n

`[CODE]` All button labels are i18n keys piped through `TranslatePipe`: `hierarchy.actions.information` / `backToUsers` / `addClient` / `addNode` / `editNode` / `editInfo` / `addUser` (html:41/49/57/65/82/90). The `editNode`↔`editInfo` label switches on `infoOpen()` (html:82). Any adopter must keep these keys in `en.json` + `ar.json` (they already exist for the hierarchy feature).

## Tailwind-only / token override

`[CODE]` No token file, no `wrapperClass`/`buttonClass` inputs. Styling is inline Tailwind with several arbitrary px values (`h-[38px]`, `text-[13px]`, `rounded-[10px]`, `text-[15px]`, `duration-[120ms]`). There is NO supported customization hook; do not add consumer CSS targeting the inner buttons.

## Do / Don't

| Do | Don't |
|---|---|
| Use `<falcon-node-details-section>` for org-node headers. | Adopt `<falcon-org-node-header>` (orphaned/superseded). |
| Project actions via `falconNodeDetailsActions` (node-details-section). | Rely on `falcon-org-node-header`'s fixed `can*` native buttons. |
| Pass i18n keys; keep them in `en.json`+`ar.json`. | Pass literal label strings. |
| Gate actions with PES at the parent + `[disabled]`/hide on `<falcon-angular-button>`. | Expect a `disabled` axis on `falcon-org-node-header` buttons (none exists). |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-org-node-header[\s>]` across `apps/` + `libs/falcon/` returned **0 render sites**. Matches are documentation only:
- `apps/.../docs/_plans/W12-final-verification.md:32` (describes old `page.html:82-96` `<falcon-org-node-header>` structure)
- `apps/.../docs/_plans/baseline/react-parity-checklist.md:31` (same old structure)
- `apps/.../docs/archive/WAVE-A-OLD-STRUCTURE.md:264` (archived old structure)
- the component's own `.ts`/`.html` source.

`[CODE]` App-level twin `<app-org-node-header[\s>]` = **0 render sites**; only the supersession comment (`org-hierarchy-page-menu.component.ts:49`, both apps).

`[CODE]` Live org-node header = `<falcon-node-details-section>` (`org-hierarchy-page-menu.component.html:151-270`, both apps).

> `[INFERRED]` `falcon-org-node-header` was promoted into shared-ui and the app twin was created during the Wave 19 migration churn, but the team converged on the more flexible `<falcon-node-details-section>` for the header strip, leaving both node-header components dead. Strong candidate for deletion (GAP G1).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25). Consumer Sweep re-run: 0 render sites for both `<falcon-org-node-header>` and `<app-org-node-header>`; live header = `<falcon-node-details-section>` (Example 1 confirmed against org-hierarchy-page-menu.component.html:151-178). Example 2 is a derived hypothetical (no real consumer exists).
