# falcon-textarea — USAGE

## Real usage examples

### Example 1 — Description textarea with counter

```html
<falcon-angular-textarea
  [label]="'Description'"
  [placeholder]="'Add a description...'"
  [maxlength]="500"
  [showCounter]="true"
  [autoResize]="true"
  [minRows]="3"
  [maxRows]="8"
  [(ngModel)]="description">
</falcon-angular-textarea>
```

### Example 2 — Reactive Forms with error

```html
<falcon-angular-textarea
  formControlName="notes"
  [label]="'Notes'"
  [errorMessage]="form.controls.notes.touched && form.controls.notes.invalid ? 'Required' : ''"
  [state]="form.controls.notes.touched && form.controls.notes.invalid ? 'error' : 'default'">
</falcon-angular-textarea>
```

### Example 3 — In-grid editing (compact)

```html
<falcon-angular-textarea
  variant="grid"
  size="sm"
  [rows]="2"
  [(ngModel)]="row.notes">
</falcon-angular-textarea>
```

## Recommended usage for NEW Angular pages

- Use `autoResize=true` for descriptions where line count varies.
- Use `maxlength` + `showCounter=true` for length-bounded fields.
- Always bind via CVA.

## Reactive Forms

```ts
form = new FormGroup({
  description: new FormControl<string>('', [Validators.required, Validators.maxLength(500)]),
});
```

## ngModel

```html
<falcon-angular-textarea [(ngModel)]="notes"></falcon-angular-textarea>
```

## Tailwind-only

```html
<falcon-angular-textarea class="w-full" ... />
```

## Token usage

```css
.note-textarea {
  --falcon-textarea-bg: var(--color-falcon-neutral-50);
  --falcon-textarea-border-radius: 12px;
  --falcon-textarea-min-height: 120px;
}
```

## Bad usage to avoid

- Do NOT use for rich-text (no formatting).
- Do NOT bind `[value]` directly.
- Do NOT set `rows` AND `autoResize=true` simultaneously — autoResize wins.

## Do / Don't

| Do | Don't |
|---|---|
| Use for any multi-line text. | Use for rich-text. |
| Use `autoResize` for variable-length input. | Hand-roll a resize handler. |
| Bind via CVA. | Bind `[value]` directly. |
