# Falcon Stencil-to-Angular Bridge

> SoT for the cross-framework component reuse mechanics surfaced in the Brain SK Obsidian vault at `_obsidian/36-Theming/Falcon Stencil-to-Angular Bridge.md`. Stencil compiles once; Angular wraps for ergonomics; React/Vue consume directly.

**Created:** 2026-05-20
**Vault graph node:** `_obsidian/36-Theming/Falcon Stencil-to-Angular Bridge.md`

## The bridge graph

```
TSX source (Stencil component)
  ↓ @stencil/core build
Web Component (.js + .d.ts)
  ↓
  ├──→ Angular Wrapper (libs/falcon-ui-core/src/angular-wrapper/)
  │      Wraps with signal API + CVA + template projection
  │      ↓
  │      Angular app consumers (host-shell, admin-console, management-console)
  │
  ├──→ React app consumers (direct Web Component)
  ├──→ Vue app consumers (direct Web Component)
  └──→ Vanilla HTML / Stencil playground (direct Web Component)
```

## Token chain (same for every consumer)

```
Consumer template uses class="..." or var(--falcon-X)
  ↓
Tailwind utility class       (compiled from SSOT @theme)
  ↓
Component tokens.css         (Stencil layer contract slot)
  ↓
Stencil scoped CSS           (renders the component)
  ↓
SSOT @theme value            (the actual hex color)
```

## Shadow DOM gotcha

Stencil components with `shadow: true` are sealed — Tailwind utilities don't cascade in. **Falcon solution:** modern components use `shadow: false` so global utilities reach in.

```typescript
@Component({
  tag: 'falcon-button-tw',
  shadow: false,
  scoped: true,    // still scope Stencil's own CSS
})
export class FalconButtonTw { … }
```

Legacy components (`shadow: true`) use the `.tokens.css` contract exclusively — no Tailwind utilities in their templates.

## Stencil component vs Angular wrapper naming

| Layer | Name |
|---|---|
| Stencil component (Web Component tag) | `<falcon-button-tw>` |
| Angular wrapper (component selector) | `<falcon-angular-button>` |
| Token contract file | `button.tokens.css` |
| Token CSS variables | `--falcon-button-bg`, `--falcon-button-color`, … |

## Cross-framework score: 91% (per `falcon-tailwind-alignment-scorecard.md`)

Caveats:
- −4% — dual token namespaces (Tailwind layer + Stencil layer); bridge works but doubles maintenance
- −3% — Stencil `shadow: true` legacy components don't see utilities
- −2% — TypeScript class-builders concatenate at runtime → defensive safelist

After Wave 1 + Wave 2: 96%.

## See also

- `FALCON_WRAPPER_AND_RENDER_PATH_REPORT.md` — full architecture
- `falcon-angular-wrapper-pattern.md` — Angular-side consumption
- `falcon-design-tokens-graph.md` — two-system token chain
- `falcon-tailwind-alignment-scorecard.md` — gap + fix plan
