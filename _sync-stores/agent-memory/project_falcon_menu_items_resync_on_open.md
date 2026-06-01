---
name: Falcon menu items re-sync on imperative open
description: FalconAngularMenuComponent now re-pushes its current _items array to the underlying Stencil falcon-menu-tw element on every imperative showAt/openMenu/toggle. Closes a class of "empty popup <ul> after modal close" bugs across every Falcon menu (tree, data-table, dropdown wrappers).
type: project
originSessionId: a39cbc78-46a3-472c-beee-814a4ec78645
---
# FalconAngularMenuComponent — defensive items re-sync on imperative open

**Status (2026-05-16):** 🟢 LANDED to current working tree. `falcon-ui-core` + `admin-console` both build GREEN. No commit/push per standing rule. Working tree dirty.

## Symptom we fixed

Reported on admin-console Organization Hierarchy page: opening the root kebab menu on the Falcon root node ("ammar") **sometimes** showed an empty popup (`<falcon-menu-tw open>` with `<ul></ul>` — zero `<li>` children). User reported it as "after opening any modal, the actions for the Falcon user are corrupted and it's not seeded anything inside it."

The trigger button itself stayed visible (so upstream `rootActions().length > 0` was still true) — the popup just rendered without items.

## Root cause

[CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.ts:62-67` — the `items` `@Input` setter writes to the Stencil element (`el.items = this._items`) **only when Angular calls the setter**. Angular calls the setter only when it detects a different array reference on the bound expression.

[CODE] `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.ts:179-181` — `rootMenuItems` is a `computed` signal whose result is **cached by reference** until inputs change. After the wrapper's `permissions()` resolves once via `primeAccess()`, the cached array is stable for the lifetime of the page → Angular skips the setter on every CD cycle.

[CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.ts:119-146` — `syncProps()` is the only other write path and runs **once** in `ngAfterViewInit`. There is no re-sync hook on the imperative open methods (`showAt`/`openMenu`/`toggle`).

[INFERRED] If the Stencil prop ever drifts out of sync with Angular's `_items` (element re-attach, lifecycle race, HMR, downstream Stencil hydration timing), there is no recovery — the next `showAt` opens an empty `<ul>` and Angular has no way to know. The "after modal close" pattern is the trigger because modal mount/unmount fires parent CD without changing inputs to the OnPush tree-panel / menu wrapper.

## The fix

[CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.ts:170-194` — added `private resyncItemsToStencil()` helper and called it inside `showAt`, `openMenu`, and `toggle` right before the underlying Stencil method.

```ts
private resyncItemsToStencil(): void {
  const el = this.menuEl?.nativeElement;
  if (el) el.items = this._items;
}

async showAt(el: HTMLElement, event?: Event): Promise<void> {
  this.resyncItemsToStencil();
  await this.menuEl?.nativeElement?.showAt?.(el, event);
}
async openMenu(): Promise<void> { this.resyncItemsToStencil(); await this.menuEl?.nativeElement?.openMenu?.(); }
async toggle(): Promise<void>   { this.resyncItemsToStencil(); await this.menuEl?.nativeElement?.toggle?.();   }
```

**Why this is the right fix (not a workaround):**
- No-op when Stencil is already in sync (Stencil bails on prop equality).
- Recovery when out of sync.
- Single source of truth preserved (Angular `_items` derived from PES-gated wrapper signals → no hardcoded seed, no second registry).
- Fixes ALL Falcon menus across the platform (tree kebab, data-table row kebab, every consumer of `<falcon-angular-menu>`), not just the org-hierarchy root.
- ~20 lines including comments.

`hide()` and `closeMenu()` are NOT re-synced — items don't matter when closing.

## Why we rejected the "seed/default actions" workaround

The user's pet hypothesis was to hardcode a seed of root actions at the page-state level and always show it as a fallback. We rejected that because:

1. It adds a second source of truth for menu items that can drift from PES.
2. It hides the real bug — would mask future regressions in the items pipeline.
3. It only fixes the org-hierarchy root menu; the same bug class affects every Falcon menu on the platform.

User explicitly authorized "if you have a better plan to find the root cause and fix it, you can do that." → we did.

## Files touched (1 file, 14 lines net)

| File | Lines | What |
|---|---|---|
| `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.ts` | +20 / -3 | Added `resyncItemsToStencil()`; called from `showAt` / `openMenu` / `toggle`; doc comment cites the bug class. |

## Build verification

- `npx nx build falcon-ui-core` — 🟢 build finished in 37.89s. Warnings are pre-existing Stencil reserved-name flags (`title`, `scrollHeight`) — unrelated.
- `npx nx build admin-console` — 🟢 build finished in 15.99s, hash `01458947243c4913`.

## What user should runtime-verify

Standing rule [MEMORY] `feedback_no_ui_testing_during_implementation.md` — Claude does not auto-serve. User to verify:

1. Open admin-console org-hierarchy-page → click Falcon root kebab → 2 items appear (Add Client, Add User).
2. Click "Add User" → wizard opens → close wizard.
3. Click Falcon root kebab again → 2 items still appear. **Previously: sometimes empty `<ul>`.**
4. Repeat with Add Client wizard, Add Node drawer, Edit Node drawer. All should keep menu items after close.
5. Sub-node kebabs should also keep their 3 items (Add Node / Edit Node / Add User) across modal flows.

## How to resume

In a new session at `C:\Falcon`:
```
read memory project_falcon_menu_items_resync_on_open
```
If the fix needs hardening (e.g. add a `forceResync()` public API for consumers to call manually), the helper is already extracted and named.
