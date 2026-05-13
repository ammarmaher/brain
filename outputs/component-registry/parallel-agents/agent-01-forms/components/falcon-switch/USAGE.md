# falcon-switch — USAGE

## Real usage examples

### Example 1 — Feature toggle in settings

```html
<falcon-angular-switch
  [label]="'Enable notifications'"
  [(ngModel)]="notificationsEnabled">
</falcon-angular-switch>
```

### Example 2 — Channel-pill with on/off labels

```html
<falcon-angular-switch
  variant="channel-pill"
  textOn="ON"
  textOff="OFF"
  [(ngModel)]="featureFlag">
</falcon-angular-switch>
```

### Example 3 — Hidden-input variant (no knob)

```html
<falcon-angular-switch
  variant="hidden-input"
  [label]="'Mute alerts'"
  [(ngModel)]="muted">
</falcon-angular-switch>
```

## Recommended usage for NEW Angular pages

- Use `dot-knob` (default) for typical feature toggles.
- Use `channel-pill` when ON/OFF state needs explicit label inside the track.
- Use `hidden-input` for compact rows.
- Always bind via CVA.

## Reactive Forms

```ts
form = new FormGroup({
  emailAlerts: new FormControl<boolean>(true, { nonNullable: true }),
});
```

```html
<falcon-angular-switch formControlName="emailAlerts" [label]="'Email alerts'"></falcon-angular-switch>
```

## ngModel

```html
<falcon-angular-switch [(ngModel)]="value" [label]="'Toggle'"></falcon-angular-switch>
```

## Tailwind-only

```html
<falcon-angular-switch class="mt-3" ... />
```

## Token usage

```css
.brand-switch {
  --falcon-switch-track-bg-on: var(--color-falcon-teal-500);
  --falcon-switch-knob-bg: var(--color-falcon-neutral-0);
}
```

## Bad usage to avoid

- Do NOT use for tri-state — switch is strictly boolean.
- Do NOT use `textOn` / `textOff` with `dot-knob` variant — has no effect.
- Do NOT mix `[(ngModel)]` AND `[checkedInput]`.

## Do / Don't

| Do | Don't |
|---|---|
| Use for feature toggles / preferences. | Use for required form acceptance (use checkbox). |
| Use `channel-pill` when ON/OFF labels add clarity. | Apply `textOn` to other variants. |
| Bind via CVA. | Use `[value]` directly. |
