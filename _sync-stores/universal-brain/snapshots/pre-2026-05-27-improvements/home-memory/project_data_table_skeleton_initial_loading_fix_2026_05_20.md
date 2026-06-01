# Data-table skeleton — initial-loading default fix — 2026-05-20

## Symptom

The `<falcon-angular-data-table>` skeleton briefly flashed the empty-state before the skeleton on first mount of pages like the mgmt-console Apps-Services tab and Comm-Channels tab. Some auto-loading tables never showed the skeleton at all (admin org-hierarchy-page-menu users-table — `[loading]` wasn't even bound; stale `TODO(skeleton)` since the 2026-05-20 skeleton-system task).

## Root cause

State slices and components that auto-load on mount declared `readonly loading = signal<boolean>(false)`. Angular `effect()` runs AFTER first change-detection, so the timeline was:

1. Mount → `loading=false, rows=[]` → renders **empty-state** for 1 frame
2. Effect fires → `load()` → `loading.set(true)` → skeleton appears
3. HTTP returns → `loading.set(false)` → data renders

The 1-frame empty-state flash was misread as "skeleton not working."

## Best-practice rule (applied consistently across mgmt + admin)

> A slice/component that **auto-loads on mount** must default `loading = signal<boolean>(true)`.
> A slice/component that loads only on **explicit user action** (button click, navigation) should default `false`.

`loading.set(true)` before the API call and `finalize(() => loading.set(false))` after were already correct everywhere — only the **initial default** was wrong on the auto-load surfaces.

## Files changed (10) — both apps build-green

### Mgmt-console state slices (3) — flipped default to `true`
- `apps/management-console/src/app/features/org-hierarchy-page/services/state/apps-services-state.signals.ts:48-49` — constructor effect auto-loads off `tree.selectedNode()`
- `apps/management-console/src/app/features/org-hierarchy-page/services/state/comm-channels-state.signals.ts:48-49` — same shape
- `apps/management-console/src/app/features/org-hierarchy-page/services/state/users-state.signals.ts:68` — reactive `combineLatest` pipe auto-fires on mount once `toObservable` sources flush

### Mgmt-console component-local `loading` signals (4) — flipped default to `true`
- `apps/management-console/src/app/features/comms-hub/comms-hub.component.ts`
- `apps/management-console/src/app/features/contact-groups/contact-groups-list/contact-groups-list.component.ts`
- `apps/management-console/src/app/features/contracts-cost-management/contracts-cost-management.component.ts`
- `apps/management-console/src/app/features/marketplace-applications/marketplace-applications.component.ts`

All 4 auto-load in their constructors (`loadList(accountId)` / `resolvePermissions().then(loadCurrentTab)`).

### Admin-console `usersLoading()` — closed the stale `TODO(skeleton)` (3)
- `apps/admin-console/src/app/features/org-hierarchy-page/services/state/users-state.signals.ts` — new `loading = signal<boolean>(true)`; lazy-load `switchMap` now toggles `true` before the HTTP and `false` on next/error
- `apps/admin-console/src/app/features/org-hierarchy-page/services/hierarchy-page-state.service.ts:299` — exposed as `readonly usersLoading = this.usersSlice.loading` (matches `appsServicesLoading` / `commChannelsLoading` naming)
- `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html:318` — bound `[loading]="state.usersLoading()"`; replaced 7-line stale TODO with a 3-line skeleton note

## Intentionally NOT touched

- `apps/admin-console/.../client-comm-channels-step.component.html` (Add Client Step 3) and
- `apps/admin-console/.../client-applications-step.component.html` (Add Client Step 4)

Both feed the table from `viewRows()`, a synchronous derived signal over wizard state. NO async fetch exists to wire a skeleton against. The existing `TODO(skeleton)` comments are kept and remain accurate per the 2026-05-20 skeleton-system task contract (no inventing loading signals).

## Build evidence

- `npx nx build management-console` — hash `a0aa5d38754f59af`, 28.4 s
- `npx nx build admin-console` — hash `24ea9947f675c9f7`, 25.5 s

## Pattern reference for future tables

```ts
@Injectable()
export class XxxSlice {
  readonly rows = signal<ReadonlyArray<Row>>([]);
  /*** default true — slice auto-loads on mount via constructor effect;
       prevents empty-state flash before skeleton. ***/
  readonly loading = signal<boolean>(true);
  readonly loadError = signal<string | null>(null);

  constructor() {
    effect(() => {
      const node = this.tree.selectedNode();
      if (node) this.load(node.id);
      else this.resetToEmpty();  // sets loading=false
    });
  }

  load(nodeId: string | null): void {
    if (!nodeId) { this.resetToEmpty(); return; }
    this.loading.set(true);
    this.loadError.set(null);
    this.api.getList(nodeId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: rows => this.rows.set(rows), error: () => /* ... */ });
  }

  private resetToEmpty(): void {
    this.rows.set([]);
    this.loading.set(false);
    this.loadError.set(null);
  }
}
```

## Related memory

- `[[project_data_table_skeleton_loading_system_2026_05_20]]` — the broader skeleton system + provider that this fix completes
- `[[project_falcon_studio_runtime_split_2026_05_20]]` — runtime subpath split (separate concern)
