---
type: rules
cluster: components
layer: composition
component: dialog-drawer
scope: angular-first
created: 2026-05-20
updated: 2026-05-20
---
*** Falcon Popup and Drawer Composition Rules ***
*** Angular-first — deep rules for every overlay composition ***
*** Read before building any dialog, popup, or drawer ***

# Falcon Popup and Drawer Composition Rules

> **Purpose:** Deep rules for overlay compositions — when to use popup vs drawer, title/body/footer structure, confirm/cancel flow, loading states, portal behavior, focus trap, and accessibility.
>
> **Matrix entry:** [[Falcon Component Combination Matrix]] → C04 (Popup + Form + Confirm)
> **Related composition:** [[Falcon Form Composition Rules]] — the form that lives inside the overlay
> **Guardrail:** [[Falcon Light Mode Visual Baseline]] — dialog backdrop `bg-black/40`, z-1200; drawer side-slide from right

---

## 1 · Popup vs Drawer Decision

| Question | → Popup / Dialog | → Drawer |
|---|---|---|
| Is the action destructive (delete, confirm payment)? | ✅ Dialog | |
| Is the form > 5 fields? | | ✅ Drawer |
| Is the form ≤ 3 fields? | ✅ Dialog | |
| Does the user need to see the page behind the overlay? | | ✅ Drawer |
| Is it a system-level confirmation (OTP, insufficient balance)? | ✅ Dialog | |
| Is it a data-entry flow (Add Node, Edit Node)? | | ✅ Drawer |
| Is it a wizard/stepper? | ✅ Dialog (full-screen wizard modal) | |
| Does it require multi-step navigation? | ✅ Dialog (wizard) | |

**Hard rule:** Never use a drawer for a simple yes/no confirmation. Never use a dialog for a complex multi-field edit form.

---

## 2 · Portal Contract (Mandatory)

```html
<!-- ALWAYS appendTo body — every Falcon dialog and drawer -->
<falcon-angular-dialog [appendTo]="'body'" />
<falcon-angular-drawer [appendTo]="'body'" />
```

**Why:** Without `[appendTo]="'body'"`, the overlay renders inside the component's DOM subtree. This causes:
- z-index bleed-through when the parent has `overflow:hidden` (table sticky header, kebab menu)
- Clipping by the parent's `border-radius`
- Stacking context isolation bugs

**Rule:** Every `<falcon-angular-dialog>` and `<falcon-angular-drawer>` MUST have `[appendTo]="'body'"`. This is the default since the IB dialog portal fix (2026-05-20) — but verify on every new usage.

**z-index ladder:**
| Layer | z value | Token |
|---|---|---|
| Drawer overlay | 1100 | `--falcon-drawer-z` |
| Dialog / Popup | 1200 | `--falcon-ib-dialog-backdrop-z` |
| Toast / Notification | 2000 | `--falcon-toast-z` |
| Loader (global) | 2000 | set in app.config.ts provideFalconLoader |

---

## 3 · Dialog Structure

```html
<falcon-angular-dialog
  [appendTo]="'body'"
  [visible]="isOpen()"
  [title]="dialogTitle"
  [size]="'md'"
  (close)="onClose()"
  (visibleChange)="isOpen.set($event)">

  <!-- Body: projected content -->
  <ng-template #body>
    <!-- Form or message content -->
    <falcon-angular-input formControlName="value" [label]="'Enter value'" />
  </ng-template>

  <!-- Footer: action buttons -->
  <ng-template #footer>
    <falcon-angular-button variant="secondary" (click)="onCancel()">Cancel</falcon-angular-button>
    <falcon-angular-button
      variant="primary"
      [disabled]="form.invalid || isSending()"
      [loading]="isSending()"
      (click)="onConfirm()">
      Confirm
    </falcon-angular-button>
  </ng-template>
</falcon-angular-dialog>
```

**Rules:**
- `[title]` is always provided — never an untitled dialog
- Dialog size: `sm` (384 px) for simple confirm · `md` (448 px) for standard form · `lg` (512 px) for complex form
- `(close)` output fires on X button and Escape key — always handles both
- `(visibleChange)` syncs the `isOpen` signal when the dialog closes itself
- Do NOT manage `visible` state with a boolean property — use a `signal<boolean>`

---

## 4 · Confirm Dialog (Destructive Action)

```html
<!-- Use falcon-angular-confirm-dialog for standard yes/no -->
<falcon-angular-confirm-dialog
  [appendTo]="'body'"
  [visible]="confirmOpen()"
  [title]="'Delete User'"
  [message]="'Are you sure you want to delete ' + targetName() + '? This cannot be undone.'"
  [confirmLabel]="'Delete'"
  [confirmDanger]="true"
  (confirm)="onDeleteConfirmed()"
  (cancel)="confirmOpen.set(false)" />
```

**Rules:**
- Destructive confirms use `[confirmDanger]="true"` — this turns the confirm button red
- Confirm label matches the action: "Delete", "Disable", "Remove" — never just "OK" or "Yes"
- Message includes the target name for clarity — never generic "Are you sure?"
- After confirming: close dialog, perform action, show toast, refresh data

---

## 5 · Alert Dialog (Info / Warning)

```html
<falcon-angular-alert-dialog
  [appendTo]="'body'"
  [visible]="alertOpen()"
  [type]="'warning'"
  [title]="'Insufficient Balance'"
  [message]="'Your wallet balance is too low to complete this payment.'"
  (close)="alertOpen.set(false)" />
```

**Rules:**
- Alert dialogs have only one button (Close / OK) — no confirm/cancel pair
- `[type]` values: `'info'` · `'warning'` · `'error'` · `'success'`
- Do NOT use `<falcon-angular-dialog>` for pure information messages — use `<falcon-angular-alert-dialog>`

---

## 6 · OTP Dialog

```html
<falcon-angular-otp-send-dialog
  [appendTo]="'body'"
  [visible]="otpOpen()"
  [channels]="availableChannels()"
  (channelSelected)="onChannelSelected($event)"
  (close)="otpOpen.set(false)" />
```

**Rules:**
- OTP channel selection is ALWAYS the finalization entry point for wizards — uses `<falcon-angular-wizard-finalization>` or `<falcon-angular-otp-send-dialog>`
- Do NOT build a custom channel-picker — reuse `<falcon-angular-otp-send-dialog>`
- After channel selected → submit POST → on success: close OTP dialog → show success dialog → trigger data refresh

---

## 7 · Loading State Inside Dialogs

```html
<!-- Option A: Loading overlay on dialog body -->
<ng-template #body>
  @if (isLoading()) {
    <div class="flex justify-center py-8">
      <app-falcon-loader [visible]="true" [inline]="true" />
    </div>
  } @else {
    <!-- actual content -->
  }
</ng-template>

<!-- Option B: Disable confirm button during submit -->
<falcon-angular-button
  variant="primary"
  [disabled]="isSending()"
  [loading]="isSending()"
  (click)="onConfirm()">
  Confirm
</falcon-angular-button>
```

**Rules:**
- Use Option A when initial data is loading (dialog opened before data arrives)
- Use Option B when the user submits — confirm button shows a spinner, dialog stays open
- Do NOT show a full-screen loader overlay inside a dialog — it adds a conflicting z-index layer
- On submit error: keep dialog open, show error inside the dialog body OR show a toast

---

## 8 · Drawer Structure

```html
<falcon-angular-drawer
  [appendTo]="'body'"
  [visible]="drawerOpen()"
  [title]="drawerTitle()"
  [width]="'480px'"
  (close)="onDrawerClose()"
  (visibleChange)="drawerOpen.set($event)">

  <!-- Body: form content -->
  <ng-template #body>
    <div class="flex flex-col gap-4 p-4">
      <!-- form fields here — see Falcon Form Composition Rules -->
    </div>
  </ng-template>

  <!-- Footer: save / cancel -->
  <ng-template #footer>
    <div class="flex items-center justify-end gap-2 p-4 border-t border-falcon-neutral-200">
      <falcon-angular-button variant="secondary" (click)="onDrawerClose()">Cancel</falcon-angular-button>
      <falcon-angular-button
        variant="primary"
        [disabled]="drawerForm.invalid || isSaving()"
        [loading]="isSaving()"
        (click)="onDrawerSave()">
        Save
      </falcon-angular-button>
    </div>
  </ng-template>
</falcon-angular-drawer>
```

**Width guide:**
| Content | Width |
|---|---|
| Simple 2-4 field form (Add Node, Edit Node) | `480px` |
| Multi-section form (Edit Client info) | `640px` |
| Complex wizard-like drawer | Use a full-screen dialog instead |

**Rules:**
- Drawer slides from the RIGHT — never from the left unless explicitly designed so
- Drawer backdrop: `bg-black/40` — darkens the main content behind it
- Escape key closes the drawer — handled by the component; do NOT intercept Escape manually
- Unsaved changes guard fires when user clicks X or Escape while form is dirty (use `FalconUnsavedChangesService`)

---

## 9 · Unsaved Changes on Close

```typescript
// In the component hosting the drawer/dialog:
onDrawerClose(): void {
  if (this.drawerForm.dirty) {
    this.unsavedChanges.confirm().subscribe(confirmed => {
      if (confirmed) {
        this.drawerOpen.set(false);
        this.drawerForm.reset();
      }
      // if not confirmed: drawer stays open
    });
  } else {
    this.drawerOpen.set(false);
  }
}
```

**Rules:**
- Check `form.dirty` on close attempt — dirty means the user has typed but not saved
- `FalconUnsavedChangesService.confirm()` opens the standard "Unsaved changes" confirm dialog
- Do NOT build a custom "are you sure you want to leave?" dialog — use the shared service
- After successful save: `form.markAsPristine()` deactivates the guard

---

## 10 · Focus Trap & Accessibility

**Rules:**
- `<falcon-angular-dialog>` and `<falcon-angular-drawer>` implement focus trap by default — first focusable element receives focus on open
- Do NOT add `tabindex=-1` on the dialog root — the component manages focus internally
- Screen reader announcement: `[title]` is the `aria-labelledby` target — always meaningful
- Close button (X) has `aria-label="Close dialog"` — built in to the component
- Gap P0-06: focus trap not always honored on nested dialogs (e.g., OTP inside wizard) — known issue, workaround: close inner before outer

---

## 11 · Dialog Anti-Patterns

| Anti-Pattern | Correct |
|---|---|
| `position:fixed` custom overlay not using Falcon dialog | Use `<falcon-angular-dialog [appendTo]="'body'">` |
| Dialog rendered inside a table row or tab body | Always portaled to `<body>` |
| `z-index: 9999` on a custom overlay | Use the established z-index ladder |
| Two dialogs open simultaneously | Close the first before opening the second |
| Raw `alert()` / `confirm()` / `prompt()` | Use `FalconToastService` / `FalconConfirmService` |
| `[visible]` bound to a boolean property | Bind to a `signal<boolean>` |
| Opening a drawer inside another drawer | Never nest drawers — use a step in the same drawer or a dialog instead |
| Dialog body with `overflow:hidden` clipping content | Dialog body uses `overflow-y-auto` by default — never override |

---

## Cross-Links

- [[Falcon Dialog]] · [[Falcon Alert Dialog]] · [[Falcon Confirm Dialog]] · [[Falcon Drawer]] · [[Falcon OTP Send Dialog]] · [[Falcon Insufficient Balance Dialog]]
- [[Falcon Popup]] — lightweight non-modal popup (tooltip-style)
- [[Falcon Form Composition Rules]] — the form that lives inside the overlay
- [[Falcon Component Combination Matrix]] → C04
- [[Falcon Component Composition Playbook]] → Composition 4
- [[Falcon Component Gap Registry]] → P0-06 (focus trap), P1-09 (Escape)
- [[Falcon New Page Implementation Checklist]] — pre-merge gate
- [[Falcon Light Mode Visual Baseline]] — visual guardrail

## Tags

#type/rules #layer/frontend #layer/composition #component/dialog #component/drawer #status/active

## Hubs

- [[Falcon Dialog]] · [[Falcon Drawer]] · [[COMPONENT_INDEX]] · [[Falcon Component Composition Playbook]]
