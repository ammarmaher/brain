# Lessons Learned — falcon-insufficient-balance-dialog (2026-05-15)

## L1. Loader chicken-and-egg on first build of a NEW component

**Symptom.** When you add a new `-tw` entry to `libs/falcon-ui-core/src/define-falcon-tw-component.ts` BEFORE the first build, Stencil's TypeScript pass fails with:

```
Cannot find module '../dist/components/falcon-X-tw' or its corresponding type declarations.
```

**Root cause.** Stencil's `dist-custom-elements` output target emits the dist artefact at the END of compilation. The loader's `import('../dist/components/falcon-X-tw')` is type-resolved by TS during the SAME compile pass — but the dist file doesn't exist yet on a fresh-new-component build.

**Workaround applied (one-time per new component):**
1. Author all 3 artefact files (Shadow `.tsx`, Light/TW `.tsx`, types).
2. **Skip** adding the loader entry initially.
3. Run `nx build falcon-ui-core` — Stencil emits dist artefacts (including the new one).
4. Add the loader entry now (path resolves).
5. Run `nx build falcon-ui-core` again — clean green.

**Suggested patch to strategy `08-COMMON_PITFALLS.md`:**

> ### Pitfall — Loader path can't resolve on first build of a new component
> **Symptom:** `Cannot find module '../dist/components/falcon-X-tw'`
> **When:** Adding a new component for the first time.
> **Fix:** Build once WITHOUT the loader entry to emit the dist artefact, then add the loader entry and rebuild. Future incremental builds work fine — only the very first add is affected.

**Suggested patch to strategy `06-EXECUTION_PROTOCOL.md` Phase 2:**

> Phase 2 step 1 — Add the loader entry **AFTER** confirming Stencil has emitted the dist artefact via a no-loader-entry baseline build. The chicken-and-egg is documented in 08-COMMON_PITFALLS.md.

## L2. Self-contained vs composed dialogs — decision tree

**Observation.** When a new dialog needs CONFIGURABLE visual chrome (glossy on/off, icon-color on/off, icon-background on/off, etc.), composing the canonical `<falcon-dialog>` or `<falcon-alert-dialog>` becomes fragile — overriding their CSS custom properties through Shadow boundaries works in theory but multiplies the surface area of "things that can break".

**Lesson.** Add a decision branch to `01-CANONICAL_PATTERN.md` §4:

> ### Q9 — Does my component need configurable chrome (visual variants toggling backdrop/icon/panel appearance)?
> - **Yes** → Author self-contained. Own the backdrop + panel + dismissal logic. Accept the ~80% duplication tax vs `<falcon-dialog>` because the variant clarity is worth it.
> - **No** → Compose `<falcon-dialog>` or `<falcon-alert-dialog>` and bind props through.

## L3. New showcase category — light-touch precedent

**Observation.** User asked for a new top-level category in the showcase registry: "Custom Pop-up Notification". The pattern was clean:

1. Add `{ "id": "<key>", "label": "<UI label>" }` to `categories[]`
2. Update the new component's `category` field to the new id
3. Position the new category by inserting at the right index in `categories[]` (it dictates left-nav order)

**Lesson.** Document in `07-INTEGRATION_POINTS.md`:

> ### Adding a new showcase category
> Edit `libs/falcon-ui-showcase-data/src/registry.json`:
> - Add a new `{id, label}` to `categories[]` at the desired ordinal.
> - Set the new component's `category` field to match.
> - No re-render code needed — the showcase apps consume the registry directly.

## L4. Inputs that map to dimensions — prefer tokens over runtime props

**Observation.** User asked for "configurable row height and width". Two approaches:
- (A) Add Stencil `@Prop() rowHeight?: string` — sets inline `style.height` on the row.
- (B) Tokens only — defaults in the token file, override via inline style or theme.

**Chose B.** Reasoning:
- Token approach keeps the prop surface minimal.
- Consumer can override via the documented token override pattern.
- Future-proof: if 5 more dimension props are needed, they're all tokens — no Stencil API growth.

**Lesson.** Document in `01-CANONICAL_PATTERN.md` §4:

> ### Q10 — Should this be a `@Prop()` or a token?
> - **Prop** if the value is data (label text, item list, busy state, render branch).
> - **Token** if the value is geometry, color, motion, or typography. Tokens scale by addition; props don't.

## L5. Dialog visual toggles via `:host([attr="value"])` cascades

**Observation.** `showGlossy="true"` toggles backdrop-blur. The cleanest implementation is `[reflect: true]` on the Prop + a `:host([show-glossy="true"]) .falcon-X-backdrop { backdrop-filter: ... }` CSS rule.

**Win.** No imperative class toggle in render(); no boolean ternary in classlist. Cascade does the work.

**Lesson.** Add to canonical pattern as a snippet under "Per-layer responsibilities — Shadow":

> Reflected props power CSS variant selectors: `:host([variant="X"])` is preferred over render-time `classList` toggles for variants that don't change DOM structure.

## L6. Predecessor delete must follow strategy compliance check

**Observation.** Wave 14 prototyped the dialog in `libs/falcon/src/shared-ui/lib/components/falcon-insufficient-balance-dialog/`. That was the wrong path. Wave 15 deletes it.

**Lesson.** Add to Phase 0 pre-flight in `06-EXECUTION_PROTOCOL.md`:

> Phase 0 step 6 — If a previous run authored the component in the WRONG layer (e.g. app-level feature when it should be Stencil), delete that predecessor in Phase 3 BEFORE the build-chain phase. Stale exports in `@falcon` confuse the consumer + bloat the surface.

---

## Roll-up to strategy

Recommend bumping the strategy PATCH version (v1.0 → v1.0.1) with:
- Pitfall #N: Loader chicken-and-egg (L1)
- Doctrine refinement: self-contained vs composed decision (L2)
- Doctrine refinement: prop vs token decision (L4)
- Snippet: reflected-prop CSS variant pattern (L5)
