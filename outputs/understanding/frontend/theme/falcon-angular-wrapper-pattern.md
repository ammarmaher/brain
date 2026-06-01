# Falcon Angular Wrapper Pattern

> SoT for the Angular-wraps-Stencil consumption pattern surfaced in the Brain SK Obsidian vault at `_obsidian/36-Theming/Falcon Angular Wrapper Pattern.md`. 49 wrappers total; 13 with consumers.

**Created:** 2026-05-20
**Vault graph node:** `_obsidian/36-Theming/Falcon Angular Wrapper Pattern.md`

## Wrapper architecture

```
Angular Wrapper Component         ← Angular-specific APIs (signals, CVA, ng-template)
└── Wraps Stencil Web Component   ← Standards-based, cross-framework
    └── Reads Token Contract      ← per-component CSS-var slots
        └── Resolves SSOT @theme  ← Tailwind primitives
```

## Wrapper inventory (per FALCON_WRAPPER_AND_RENDER_PATH_REPORT)

- **49 Stencil-backed Angular wrappers**
- **13** with real-feature consumers
- **24** lab-only (Theme Studio playgrounds)
- **12** fully unused

## Why Angular gets a wrapper

| Need | Solved by wrapper |
|---|---|
| Reactive Forms (ControlValueAccessor) | Angular-specific interface |
| Signal-based @Input / @Output | Angular's signal API ≠ Stencil's @Prop |
| Template projection (ng-template slots) | Angular template engine |
| OnPush change detection contracts | Angular CD |

React/Vue use the Stencil component directly — their reactivity models work natively with Web Component events/props.

## Stencil → Angular signal mapping

| Stencil | Angular Wrapper |
|---|---|
| `@Prop() variant` | `readonly variant = input<...>(...)` |
| `@Event() falconClick` | `readonly falconClick = output<...>()` |
| `<slot name="label">` | `<ng-content select="[slot=label]">` |
| `componentDidLoad()` | `ngAfterViewInit()` |
| `@State()` | Signal in wrapper |

## Consumer patterns by framework

### Angular (with wrapper)

```html
<falcon-angular-button
  variant="primary"
  size="lg"
  [disabled]="isSubmitting()"
  (falconClick)="onSave()">
  <span slot="label">Save</span>
</falcon-angular-button>
```

### React (Stencil direct)

```jsx
<FalconButtonTw
  variant="primary"
  size="lg"
  disabled={isSubmitting}
  onFalconClick={onSave}>
  <span slot="label">Save</span>
</FalconButtonTw>
```

### Vue (Stencil direct)

```vue
<falcon-button-tw
  variant="primary"
  :disabled="isSubmitting"
  @falconClick="onSave">
  <span slot="label">Save</span>
</falcon-button-tw>
```

### Vanilla HTML

```html
<falcon-button-tw variant="primary"><span slot="label">Save</span></falcon-button-tw>
<script>
  document.querySelector('falcon-button-tw').addEventListener('falconClick', onSave);
</script>
```

## Decision tree (per `35-Architecture/Wrapper Import Decision Tree`)

| Consumer | Use Angular wrapper? |
|---|---|
| Angular needs reactive forms | ✅ Yes |
| Angular needs signals | ✅ Yes |
| Angular projects templates | ✅ Yes |
| React | ❌ Stencil direct |
| Vue | ❌ Stencil direct |
| Vanilla HTML | ❌ Stencil direct |

## Consumer rule (per Tailwind docs)

> "Using component-based libraries like React or Vue, this often means exposing specific props for styling customizations instead of letting consumers add extra classes from outside of a component."

Falcon wrappers expose:
- `variant` / `size` / `severity` props (preferred)
- CSS-var slots via `style="--falcon-X-bg: red"` (when token override needed)

Anti-pattern:
- `<falcon-button class="bg-red-500 px-8">` — specificity conflicts

## See also

- `FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md` — full architecture
- `falcon-stencil-to-angular-bridge.md` — bridge mechanics
- `falcon-design-tokens-graph.md` — token chain
- `_obsidian/35-Architecture/Wrapper Import Decision Tree.md` — decision flow
