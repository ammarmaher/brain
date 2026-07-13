# falcon-avatar — OVERVIEW

## Component purpose

User / account / node **identity primitive** with a **3-step fallback chain**: image (`src`) → initials (`initials`) → icon (`iconName`). Dual-render Stencil pattern (Shadow `<falcon-avatar>` + Light `<falcon-avatar-tw>` + Angular wrapper `<falcon-angular-avatar>` with the canonical `useTailwind` toggle). Token-driven sizing (5 sizes — xs/sm/md/lg/xl), 2 shapes (circle / square), optional presence-status dot (online / offline / busy / away) clipped to the bottom-right.

## Business / UI use case

- User profile avatars in headers, comment lists, member rows.
- Account / team / node logos with a letter fallback when the logo is missing.
- Org-hierarchy node imagery (square convention).
- `[CODE]` Live: the **wallet-balance-management** page header renders the account logo via `<falcon-angular-avatar>` (`src` = account logo, `iconName="building"` generic fallback) — `apps/admin-console/src/app/features/wallet-balance-management/wallet-balance-management.component.html:63`.

## When to use it / when NOT to use it

**Use it for:**
- Whenever a user / account / team / node identity needs visual representation.
- When the image MAY fail or be missing — the graceful fallback chain covers the gap.
- When a presence indicator (online/offline/busy/away) is part of the user model.

**Do NOT use it for:**
- Purely decorative imagery → raw `<img>`.
- Brand logos in nav bars → a dedicated brand asset.
- A bare glyph with no surface → `<falcon-angular-icon>` (avatar adds unnecessary geometry).
- A workflow-state pill (Active / Pending / Disabled) → `<falcon-angular-status-badge>` (avatar status is **presence**, not lifecycle).
- A count / label pill → `<falcon-angular-badge>`.
- Multi-user avatar groups with an overflow pill → **NOT YET SUPPORTED** (avatar-group is a documented GAP — see GAPS_AND_UPGRADES.md).

## Status

**ACTIVE.** Wave 9.E. Architect §5.12.1 foundation. Production-grade primitive; adoption is just beginning (1 live app consumer as of the B11 sweep — `wallet-balance-management`). Not deprecated.

## Replaces

- PrimeNG `<p-avatar>` / `<p-avatarGroup>` (Wave PR-8). (Group still unbuilt — GAP.)
- Hand-rolled raw `<img class="rounded-full">` patterns for user / node imagery.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-avatar/falcon-avatar.component.ts` (60 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-avatar/falcon-avatar.component.html` (24 ln — pure tag-switcher) |
| Angular wrapper CSS | **NONE** — `[CODE]` the wrapper has no `.component.css`; host layout is a single `@HostBinding('class')` = `'falcon-angular-avatar inline-flex align-middle'` (component.ts:55). |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-avatar/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-avatar/falcon-avatar.tsx` (79 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-avatar/falcon-avatar.css` (110 ln — token-only) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-avatar-tw/falcon-avatar-tw.tsx` (74 ln) |
| Types | `libs/falcon-ui-core/src/components/falcon-avatar/falcon-avatar.types.ts` (6 ln) |
| Utils | **NONE** — no `falcon-avatar.utils.ts`. |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/avatar-tailwind-classes.ts` (`falconAvatarRootClasses()` + `falconAvatarStatusClasses()` — cross-framework SSOT) |
| Component token file | `libs/falcon-ui-tokens/src/components/avatar.tokens.css` (57 lines) |
| Spec / e2e | **NONE** — `[CODE]` no `falcon-avatar.spec.ts` / `.e2e.ts` for any layer (verified 2026-06-03). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-avatar` |
| Stencil Shadow tag | `<falcon-avatar>` |
| Stencil Light tag | `<falcon-avatar-tw>` |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `falcon-angular-avatar` across `apps/` = **1 file** (`apps/admin-console/.../wallet-balance-management/wallet-balance-management.component.html:63` — account-logo header avatar, `size="md" shape="circle"`, `[src]` from `headerImage()`, `iconName="building"` fallback, `[altText]` = node name + " Logo"). **0 files in `libs/falcon/`.** No `management-console` consumer (the mgmt wallet header does not use it). See USAGE.md Consumer Sweep.

> **Drift corrected (B11):** the prior dossier said "Zero matches in `apps/`" / "0 consumers" (Wave 7, 2026-05-17). That is now **stale** — the wallet-balance-management header adopted it. (Same adoption-drift class corrected for B10 siblings status-badge/tag/card.)

## Related components

- `falcon-angular-icon` — composed via the `iconName` fallback (renders `<i class="falcon-icon falcon-icon-{iconName}">` directly, NOT a nested `<falcon-angular-icon>`).
- `falcon-angular-status-badge` — sibling, NOT composed. Status badge is a workflow-state pill; avatar's status dot is a user-presence indicator — different business vocabularies.
- `falcon-photo-uploader` — `[MEMORY]` the edit-mode counterpart that produces the `src` an avatar then displays.

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by the Falcon UI team. Token contract lives in `libs/falcon-ui-tokens`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B11 sweep). Source-file table re-confirmed on disk (wrapper has NO `.css`, NO utils, NO spec; 3-tier render-time fallback in `.tsx`). Consumer list refreshed: **1 app file** (wallet-balance-management) — prior "0 consumers" corrected. Dual-render pattern + token file (57 ln) confirmed.
