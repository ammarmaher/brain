# falcon-avatar — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-avatar>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` falcon-avatar.tsx:44-78 — a **small self-contained identity glyph**:
- A **circle** (default, radius 999px) or **square** (radius 8px) surface, 24–64 px across (5 sizes).
- Contents are one of: a cropped photo filling the disc; **1–2 uppercase letters** centred on a teal fill; or a **single icon** on a teal fill.
- Optional **tiny coloured dot** clipped to the bottom-right corner with a white ring — green/grey/red/amber (`online/offline/busy/away`).
- No label, no border by default, no interaction affordance — it just sits inline.

Distinguishing tell vs siblings: avatar is *identity* (a face/logo/initials), `falcon-badge` is *a count or label*, `falcon-icon` is *a bare glyph with no surface*. If the shape contains a **person's face or letters standing in for a name**, it is an avatar.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Avatar>` | direct 1:1 — MUI Avatar's `src`/`children`(initials)/icon-child mirror Falcon's `src`/`initials`/`iconName`. MUI `<AvatarGroup>` → Falcon **GAP** (no group yet). |
| PrimeNG | `<p-avatar>` | direct 1:1 — `[BRAIN-OUT]` OVERVIEW.md:27 — this component replaced `<p-avatar>` (Wave PR-8). `p-avatarGroup` → Falcon **GAP**. |
| Ant Design | `<Avatar>` / `<Avatar.Group>` | single avatar 1:1; group is a GAP. |
| Bootstrap | `.rounded-circle` on an `<img>` | always replace — Bootstrap has no avatar component, just a circle-image utility. |
| shadcn / Radix | `<Avatar>` + `<AvatarImage>` + `<AvatarFallback>` | shadcn's `AvatarFallback` (runtime image-error swap) is **richer** than Falcon today — Falcon's fallback is render-time only (`GAPS_AND_UPGRADES.md` P1). |
| plain HTML | `<img class="rounded-full">` | replace with `<falcon-angular-avatar>` for the fallback chain + status dot + tokenised sizing. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a person's photo / initials / a node logo | `<falcon-angular-avatar>` | — |
| a presence dot on the avatar (online/away) | `<falcon-angular-avatar [status]>` | a separate badge |
| a workflow-state pill (Active / Pending / Disabled) | `<falcon-angular-status-badge>` | avatar status |
| a count or "Beta"/"New" label | `<falcon-angular-badge>` | avatar |
| a bare glyph with no surface / fill | `<falcon-angular-icon>` | avatar |
| a stack of overlapping member avatars + "+5" | **GAP** — hand-roll with `-ml-2` overlap, raise avatar-group | avatar (no group) |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[src]` (photo URL), `[initials]` (computed first+last, max 2 chars, uppercase), `[iconName]` (generic fallback glyph), `size` (`xs|sm|md|lg|xl`), `shape` (`circle` for people, `square` for nodes/accounts), `[status]`, `[altText]` (always set when `src` is used — alt defaults to empty string).
2. **Fallback chain** — pass `src` AND `initials` together: image renders when present, initials cover the gap. This is the *intended* pattern, not a workaround.
3. **No templates / no slots** — `[CODE]` falcon-avatar.tsx has no `<slot>`. There is no per-instance content projection.
4. **Variants** — `shape` and `size` are the only variant axes; `status` adds the dot.
5. **Token override** — restyle via `avatar.tokens.css` vars (`--falcon-avatar-bg`, `--falcon-avatar-fg`, `--falcon-avatar-radius`, `--falcon-avatar-status-*`); never hardcode colours.
6. **Upgrade** — runtime image-error fallback, hash-coloured initials, `[name]` aria-label input are all `GAPS_AND_UPGRADES.md` proposals — raise, do not hand-roll.
7. **Wrapper** — avatar-group / stack with overflow pill is a missing companion component — raise it; do not build a one-off.

## Anti-patterns
- Wiring `[src]=""` (empty string) instead of `undefined` — risks a stray `<img src="">`; pass `undefined` to trigger the initials fallback cleanly.
- Expecting a 404'd image to fall back to initials — it will not; the broken-image graphic shows (`GAPS_AND_UPGRADES.md` P1).
- Passing a full name ("John Doe") as `initials` — overflows the disc; compute 2 uppercase chars.
- Using `[status]` for account lifecycle state — that is `<falcon-status-badge>`'s job; avatar status is *user presence* only.
- Resizing via Tailwind `w-`/`h-` utilities — use the `size` prop so the initials font-size token scales with it.
- Hand-rolling a raw `<img class="rounded-full">` for a node logo — adopt this component instead (`OVERVIEW.md:46` — org-hierarchy still does this; it is the migration target).
