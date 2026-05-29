# <component> — Recognition Layer

> Cross-cutting layer. Purpose: given an external design / screenshot / React or Angular snippet, identify THIS Falcon component as the one to use, and how to compose it to parity.

## Visual fingerprint
<Anatomy and shape: the parts a viewer sees, layout, distinguishing features that separate it from siblings. Derived from component source (Stencil .tsx + .css/tokens) — all states/variants, not one frame.>

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | … | … |
| PrimeNG | … | … |
| Ant Design | … | … |
| Bootstrap | … | … |
| shadcn/Radix | … | … |
| plain HTML | … | … |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|

## Composition recipe to reach parity
<Customization order (per `feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP. The concrete knobs for matching a given design with this component.>

## Anti-patterns
<What NOT to do when adapting a design to this component — known traps.>
