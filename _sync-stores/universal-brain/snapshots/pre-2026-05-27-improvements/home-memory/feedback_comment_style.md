---
name: Code comment style — short banner format only
description: No verbose inline descriptions; comments must be under 2 lines in the star-banner format the user provided
type: feedback
originSessionId: cfc821d6-25b0-41dc-b1e6-5e359ea3a828
---
**Rule:** Keep code comments extremely terse. No long prose descriptions. No JSDoc-style multi-line paragraphs. When a comment is truly necessary, use the banner format below, and keep the actual comment to ONE short line (two max).

```
********************************************************************
********** <your short comment>
********************************************************************
```

**Why:** The user reviews diffs carefully and finds verbose comments noisy. The banner delimiters make section headers scannable; the body stays abstract and high-level.

**How to apply:**
- Default to no comments (self-documenting code first).
- When context is non-obvious, add ONE banner block at the top of that section.
- Keep the comment line abstract/general, not implementation-level narration.
- NEVER: long JSDoc blocks, multi-paragraph explanations, "see also" references, rationale paragraphs, "why we chose X" essays.
- Use the banner in services, components, and rule/helper files to demarcate sections — NOT on every function.

**Example — good:**
```ts
/*
********************************************************************
********** Capability resolver — PES-backed, generic dispatch
********************************************************************
*/
```

**Example — bad:**
```ts
/**
 * Handles every action in the `user.*` namespace. Returns null for any
 * other prefix so the CapabilityService can delegate to the next resolver.
 *
 * Registration (in app.config.ts):
 *   { provide: CAPABILITY_RESOLVER, useExisting: UserCapabilityResolver, multi: true }
 *
 * This keeps PES as the single source of truth. Future resolvers for
 * contact-group.*, network.*, etc. can plug in the same way without
 * touching the directive API.
 */
```

Pair this with `feedback_clean_code_dry_minimal.md`.
