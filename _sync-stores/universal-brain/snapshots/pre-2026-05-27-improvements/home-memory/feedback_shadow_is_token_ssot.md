---
name: Stencil Shadow component is the token SSOT, Tailwind variant must mirror
description: For every dual-render-path Falcon UI component, the Stencil Shadow variant + its `*.tokens.css` contract are the source of truth for tokens. The Tailwind/Light DOM variant must consume the SAME token names from the SAME contract file — never invent new tokens, never use hardcoded values.
type: feedback
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Rule:** For every component in the Falcon UI cross-framework library at `C:\falcon\falcon-web-platform-ui\libs\falcon-ui-core`:

- The Stencil **Shadow** variant (`<falcon-x>` + `falcon-x.css`) and the per-component token contract at `libs/falcon-ui-tokens/src/components/<name>.tokens.css` are the **single source of truth** for visual tokens.
- The Stencil **Tailwind / Light** variant (`<falcon-x-tw>` + `libs/falcon-ui-core/src/tailwind/<name>-tailwind-classes.ts`) is a render-path mirror only. It MUST:
  - Reference the **exact same** `--falcon-<name>-*` token names that the Shadow CSS reads.
  - Read from the **same** `<name>.tokens.css` file (which is imported globally).
  - Never invent a token name that the Shadow side doesn't already declare.
  - Never use hardcoded values (hex, px, ms) — every visual property goes through a token.
- If the Tailwind variant needs a token the Shadow side doesn't have, **first add it to the contract**, then update the Shadow CSS to consume it where applicable. The flow is contract → Shadow → Tailwind, never Tailwind → contract directly.

**Why:** The future theming "Studio" lets the user mutate ONE token and see both render paths update simultaneously. Drift between paths breaks the Studio.

**How to apply:**

1. Whenever shipping a new component, build the Shadow variant FIRST. Lock the 14-category token contract in `<name>.tokens.css`. Then build the Tailwind variant by translating the same token names into Tailwind utility classes — never duplicate values.
2. Whenever editing a component for visual changes, edit the contract or the Shadow CSS. The Tailwind variant should pick up the change automatically because both render paths read the same `var(--falcon-<name>-*)` chain.
3. During a parity audit (run after wave completion, see `NIGHT-SHIFT-LOG.md` "Post-waves cleanup queue"), diff the three files side-by-side: contract, Shadow CSS, Tailwind classes. Any token referenced by one and not the other is a bug.
4. After any token-parity fix, re-run the runtime probe in `/playground` for the affected component AND visually compare both render paths against each other — they must look identical.

**First component flagged for this audit:** `<falcon-dropdown>`. Shadow CSS at `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.css`, contract at `libs/falcon-ui-tokens/src/components/dropdown.tokens.css`, Tailwind helpers at `libs/falcon-ui-core/src/tailwind/dropdown-tailwind-classes.ts`. The Tailwind helper currently has its own hardcoded values that need to be replaced with the same token chain the Shadow side uses, AND any new tokens the Tailwind variant needs must be added to `dropdown.tokens.css` first.

**Sequence after the night-shift waves complete:**
1. Run the parity audit on every shipped component (dropdown, checkbox, radio, multi-select, switch, textarea, …) in build order.
2. Re-run the full regression sweep — interact with every component on `/playground`, verify every probe still passes.
3. Fix any bugs surfaced by the regression.
