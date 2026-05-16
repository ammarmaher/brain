---
type: onboarding-playbook
purpose: day-1-reading-order-for-newcomers
created: 2026-05-16
audience: anyone-new-to-the-falcon-frontend
estimated-time: ~6 hours of focused reading + ~2 hours of code-walk
tier: 4
status: living
---

*** Falcon Frontend Onboarding Playbook ***
*** Day 1 — Read these 12 docs in this order ***

# 📖 Day 1 — Frontend Onboarding Playbook

> The curated reading order for anyone joining the Falcon frontend. Designed for ~6 hours of focused reading on day one, with code spelunking deferred to days 2-3. By end of day 1, you should be able to answer the [8 verification questions](#-day-1-verification-questions).

## Who this is for

- A new frontend developer joining the Falcon platform
- An LLM agent that's about to do its first implementation task
- An architect doing due diligence before recommending changes
- Anyone returning to the codebase after a long absence

If you're not a frontend person and just want the executive summary, read the **TL;DR** in section 0 below and stop there.

---

## 🧭 Section 0 — TL;DR for non-frontend readers (5 min)

The Falcon frontend is an Nx monorepo (`C:\Falcon\Falcon\falcon-web-platform-ui`) with:

- **3 Angular 21.2.9 apps** wired together with Webpack Module Federation:
  - `host-shell` (port 4200) — owns auth + layout + the federation manifest
  - `admin-console` (port 4204) — the Falcon-admin surface (remote)
  - `management-console` (port 4301) — the client-admin surface (remote)
- **9 libraries** under `libs/`, most importantly:
  - `falcon-ui-core` — 50 Stencil-based components, dual-render (Shadow DOM + Tailwind variants)
  - `falcon` — app-shared bespoke components (form-field, mobile-number, etc.)
  - `falcon-theme` — the canonical 218-token `@theme` block
  - `sdk` — `InjectionToken` declarations for federation bridges
- **Styling**: Tailwind v4 utility classes only (no SCSS, no inline styles, no PrimeNG)
- **State**: Signals first, services for cross-component, facades for cross-app (no NgRx)
- **Auth**: Identity Service (`auth.falconhub.space/api/`) fronts Zitadel; frontend never calls Zitadel directly

Now stop reading. The rest is for the actual frontend reader.

---

## 📚 The 12-document reading order

### Reading 1 — The map (10 min)

📄 [Component Atlas](../../../../../Brain%20SK/_obsidian/00-Home/Component%20Atlas.md) (in `_obsidian/00-Home/`)

**What you'll learn:** all 62 Falcon components grouped into 6 categories (Dialogs/Overlays · Form Inputs · Data Display · Layout · Primitives · Misc), with status badges, key insights, and links to the per-component dossiers. This is the index — most of day 1 is reading docs linked from here.

**Stop and verify:**
- Can you name the 3 Angular apps and their ports?
- Which component has the most references in the workspace? (Answer: `<falcon-button>`, 31 refs in 26 files)

---

### Reading 2 — The architecture overview (15 min)

📄 [Frontend Architecture Atlas](../../../../../Brain%20SK/_obsidian/00-Home/Frontend%20Architecture%20Atlas.md)

**What you'll learn:** the hub for all 6 Tier 2 architecture deep-dives. Read this Atlas's "quick-answer" tables for each section. You don't need to dive into the deep-dives yet — just absorb the shape.

**Stop and verify:**
- What's the default state-management primitive? (Answer: signals)
- Where does the token registry live? (Answer: `libs/falcon-theme/src/falcon-tailwind-tokens.css`)

---

### Reading 3 — Folder structure (30 min)

📄 [Folder Structure Deep-Dive](../architecture/FOLDER_STRUCTURE_DEEP_DIVE.md)

**What you'll learn:** what lives where. `apps/` vs `libs/`. The 3 apps + 9 libs. The TS path aliases. The R-FE-009 one-file-per-type-folder pattern with the live `org-hierarchy-page` example.

**Important takeaways:**
- The Falcon library is split across TWO source roots:
  - `libs/falcon-ui-core/src/components/` — 50 Stencil components (Shadow + Tailwind variants)
  - `libs/falcon/src/shared-ui/lib/components/` — 11 app-shared bespoke components
- Feature folders live at `apps/<app>/src/app/features/<feature>/`
- Per the rule R-FE-009: each feature has `models/models.ts`, `services/services.ts`, optionally `resolvers/resolvers.ts` and `directives/directives.ts`

**Stop and verify:**
- If you need to write a new utility-helper class, where does it go?
- What's the difference between `libs/falcon-ui-core` and `libs/falcon`?

---

### Reading 4 — Module Federation (30 min)

📄 [Module Federation Topology](../architecture/MODULE_FEDERATION_TOPOLOGY.md)

**What you'll learn:** how the 3 Angular apps work together via webpack Module Federation. The host (host-shell) loads remotes (admin-console, management-console) at runtime via a manifest. Includes Mermaid topology + sequence diagrams.

**Important takeaways:**
- `host-shell` exposes nothing; it CONSUMES remotes
- `admin-console` exposes `./admin-console` of type `routes` (the entire route array)
- Shared singletons: `@angular/*`, `rxjs`, `@falcon`, `@falcon/sdk` — all marked `singleton: true`
- Dormant manifest entries (`demo-app`, `user-app`) are stubs for external MFEs

**Stop and verify:**
- Why is `@angular/animations` deliberately NOT shared? (Answer: avoids RUNTIME-006 double-init)
- What's the route prefix that routes traffic to the admin-console remote? (Answer: `/admin-console/*`)

---

### Reading 5 — Routing (20 min)

📄 [Routing Topology](../architecture/ROUTING_TOPOLOGY.md)

**What you'll learn:** every route in every app, every guard, every lazy boundary. 100% standalone Angular (`provideRouter()` everywhere — no `RouterModule.forRoot()`). Federation routes are injected into `host-shell.appRoutes[0].children` at bootstrap.

**Important takeaways:**
- Zero resolvers anywhere — all data fetching is component-side via signals + `ngOnInit`
- 9 guards in the codebase (most importantly `authGuard`, `shellPrimeAccessGuard`, `shellAccessMatchGuard`)
- 7 documented anti-patterns including dead redirect targets and zombie prime-ng routes

**Stop and verify:**
- Why doesn't admin-console's `''` redirect work? (Answer: redirects to `organization-hierarchy` which doesn't exist — D-2026-05-16-13)

---

### Reading 6 — Auth Flow (45 min)

📄 [Auth Flow Architecture](../architecture/AUTH_FLOW_ARCHITECTURE.md)

**What you'll learn:** how login works end-to-end. 5 flows with Mermaid sequence diagrams. The HTTP interceptor chain. Token storage. The federation auth bridge.

**Important takeaways:**
- Identity Service fronts Zitadel. Frontend NEVER calls Zitadel directly (rule R-XC-002)
- Token = `sessionStorage` (per-tab), keys `access_token` / `refresh_token`
- 3 channels deliver tokens to remotes: DI `FALCON_AUTH`, `sessionStorage` read, `window.FalconSDK`
- TWO known risks: `auth/logout` never called from FE (D-11), refresh-token race across remotes (D-14)

**Stop and verify:**
- What library does Falcon use for OIDC? (Answer: **none** — only `jwt-decode@^3.1.2` for JWT parsing)

---

### Reading 7 — State Management (20 min)

📄 [State Management Architecture](../architecture/STATE_MANAGEMENT_ARCHITECTURE.md)

**What you'll learn:** the signal-first doctrine. No NgRx. 5 cross-app facades. 1 in-app feature facade (AccessControlFacade). Canonical page-state pattern.

**Important takeaways:**
- Default: `signal()` for local + derived state
- `computed()` for pure derivations (30 uses in workspace)
- `effect()` for side effects (29 uses)
- `BehaviorSubject` ONLY at facade boundaries + auth refresh queue + i18n loader
- All 3 apps are **zoneless** (Angular 21.2.9 + `provideZonelessChangeDetection()`)

**Stop and verify:**
- When should you make a service vs leave state as signals? (Answer: when 2+ components need it)
- Why do cross-app facades use BehaviorSubject? (Answer: they cross the host/remote runtime boundary)

---

### Reading 8 — Tokens + Theming (30 min)

📄 [Token Taxonomy](../architecture/TOKEN_TAXONOMY.md)

**What you'll learn:** the canonical 218-token `@theme` block. Every CSS variable. Every Tailwind utility. The color/spacing/typography/radius/shadow/motion/z-index families.

**Important takeaways:**
- Tokens live in `libs/falcon-theme/src/falcon-tailwind-tokens.css` `@theme {}` block
- Tailwind v4 reads `@theme` natively — no `@config` file needed
- 47 per-component `*.tokens.css` files for component-specific tokens
- **`text-noor-*` does NOT exist** — the typography scale is `text-{4xs..5xl, display}`. R-NOOR-003 needs amending (D-06).
- 9 documented token gaps including a non-monotonic typography scale and a stray semicolon typo

**Stop and verify:**
- What's wrong with `--text-xl` and `--text-2xl`? (Answer: the scale is non-monotonic — 28px > 24px — G-02)

---

### Reading 9 — The rulebook (45 min)

📄 [RULES_INDEX](../../../../../Brain%20SK/_obsidian/35-Architecture/RULES_INDEX.md)

**What you'll learn:** all 39 rules that the night-shift code-audit enforces. Frontend (14) · Noor admin-console (8) · Backend (8) · Cross-cutting (9).

**Important takeaways:**
- Every rule has a detector (regex / structural / AST / semantic-llm)
- Every rule has `scope.paths` and `scope.exemptPaths` (case-insensitive globs after the morning's fix)
- The audit runs nightly via `tools/night-shift/night-shift.ps1`

**Don't read every rule.** Just understand the categories. You'll meet rules in context as you work.

**Stop and verify:**
- What's the rule for "no inline styles"? (Answer: R-FE-003)
- What's the rule for "frontend never calls Zitadel"? (Answer: R-XC-002)

---

### Reading 10 — The 8 ADRs (60 min)

Read these in this order from `Brain Outputs/understanding/frontend/decisions/`:

1. **ADR-001** — Why Falcon library instead of PrimeNG _(sets up the design system story)_
2. **ADR-002** — Why Tailwind v4 instead of SCSS _(the styling foundation)_
3. **ADR-004** — Why Stencil for shadow components _(the component primitive)_
4. **ADR-005** — Why dual-render path _(how components ship to Angular today + React/Vue tomorrow)_
5. **ADR-007** — Why @theme over @config _(how tokens flow into utility classes)_
6. **ADR-008** — Why feature-folder pattern _(the file layout convention)_
7. **ADR-003** — Why Module Federation _(how the apps come together)_
8. **ADR-006** — Why Identity Service owns user lifecycle _(auth architecture)_

**What you'll learn:** the WHY of every major architectural choice. Each ADR has a Context · Decision · Alternatives Considered · Consequences · Verification structure.

**Skip the deep-dives** — just read each ADR's Context + Decision sections. You can return to Alternatives + Consequences later.

---

### Reading 11 — Anti-patterns (30 min)

📄 [Anti-Pattern Catalog](ANTI_PATTERN_CATALOG.md)

**What you'll learn:** ~40+ "don't do this" entries with real workspace examples. Routing dead-ends, state-management traps, auth gotchas, token gaps, federation anomalies.

**The key insight:** the rulebook tells you what to do; this catalog tells you what people have actually tried and shouldn't have.

---

### Reading 12 — The flow playbooks (60 min)

📄 [IMPLEMENTATION_KNOWLEDGE_MAP](../../../../../Brain%20SK/_obsidian/00-Home/IMPLEMENTATION_KNOWLEDGE_MAP.md) and the flow playbooks it links

**What you'll learn:** how to actually implement a feature end-to-end. Each playbook (Add Client, Add User, Add Node, Edit Node) ties together PRD requirements, V-rules, backend DTOs, Falcon components, permissions, Kafka side-effects, error states, and implementation checklists.

**Read at least the Add Client playbook fully.** It's the canonical 5-step wizard example and covers every layer.

---

## 🧪 Day-1 verification questions

If you can answer all 8 with citations to specific files, you're ready to implement.

1. **Where does the 218-token `@theme` block live, and what utilities does it back?**
2. **Why doesn't the frontend use an OIDC library directly with Zitadel?**
3. **What's the difference between `<falcon-input>` and `<falcon-input-tw>`?**
4. **Where would you put a new feature called `tenant-billing` in admin-console?**
5. **Which library should a new universal component go in: `falcon-ui-core` or `falcon`?**
6. **What's the rule number for "no SCSS, no component CSS"?**
7. **What happens when a user clicks a link inside admin-console that goes to a management-console route?**
8. **Which guard protects the `/admin-console/*` route prefix, and what permission does it require?**

Answers are in the docs you just read. If you got fewer than 6 right, re-read the corresponding section.

---

## 🛠 Day 2 — Code spelunking

After day 1 reading, spend day 2 walking three real implementations:

1. **`apps/admin-console/src/app/features/org-hierarchy-page/`** — the canonical feature folder with the R-FE-009 pattern and a 675-line `HierarchyPageStateService` (don't be intimidated — this is the doctrine)
2. **`libs/falcon-ui-core/src/components/falcon-input/`** — the OG dual-render component (Shadow `.tsx` + Tailwind `-tw.tsx` + Angular wrapper + `*.tokens.css`)
3. **`apps/host-shell/src/app/features/auth/`** — the 5 auth flows in code (login, OTP, forgot-password, change-password, refresh)

For each, follow the imports outward until you've touched at least one file in each lib.

---

## 🤝 Day 3+ — First task

Pick the smallest open Decisions Queue row (anything 🟢 LOW):

- **D-2026-05-16-18** — Fix the stray semicolon typo at `falcon-tailwind-tokens.css:75` (1 min)
- **D-2026-05-16-19** — Confirm management-console intent (no code, just a decision)
- **D-2026-05-16-20** — Audit `mf-diagnostic.service.ts` + `mf-contract.ts`

These give you the full pipeline — read a rule, make a change, see the audit detect the change, commit, push — without architectural risk.

---

## 🔧 Tools you'll use daily

| Tool | Where | What it does |
|---|---|---|
| Night-shift orchestrator | `C:\Falcon\Brain SK\tools\night-shift\night-shift.ps1` | Full platform audit + morning briefing |
| Code-audit orchestrator | `C:\Falcon\Brain Outputs\understanding\rules\detectors\audit-orchestrator.ps1` | Targeted rule audit |
| Quick frontend scan | `…\detectors\quick-frontend-scan.ps1` | 10-second sanity check |
| Vault search | `C:\Falcon\Brain SK\scripts\vault-search\vault-search.mjs` | Semantic search over the Brain SK vault |
| `nx build <app>` | Repo root | Build admin-console / host-shell / management-console |
| `nx serve <app>` | Repo root | Dev server (DO NOT run as part of implementation — testing is separate per memory) |

---

## 📅 What "ongoing" looks like

After day 1-3:

- **Weekly**: read the morning briefing from any night-shift run
- **Per PR**: run the code-audit + addressing any new violations
- **Per design change**: update the relevant component dossier
- **Per architecture change**: write a new ADR (use `ADR-TEMPLATE.md`)

---

## Common mistakes newcomers make

1. **"I'll write SCSS for this one component"** — NO. Read [ADR-002](../decisions/ADR-002-tailwind-v4-over-scss.md). Use Tailwind utilities.
2. **"I'll use `oidc-client-ts` for OAuth"** — NO. Read [ADR-006](../decisions/ADR-006-identity-service-owns-user-lifecycle.md). All auth through Identity Service.
3. **"Let me add NgRx for this complex state"** — NO. Read [State Management Architecture](../architecture/STATE_MANAGEMENT_ARCHITECTURE.md). Signals + services + facades is enough.
4. **"I'll make my own input component"** — Probably NO. Read the Falcon library FIRST (R-FE-005 customization order).
5. **"I'll use `::ng-deep` to override this style"** — NO. That's why we have Shadow DOM (ADR-004) and the token system (Token Taxonomy).
6. **"I'll put my service in `libs/`"** — Maybe. If it's truly universal, yes. If it's feature-specific, put it in `apps/<app>/features/<feature>/services/services.ts` (R-FE-009).

---

## Related

- [FRONTEND_KNOWLEDGE_PATH](../FRONTEND_KNOWLEDGE_PATH.md) — the master roadmap
- [[Component Atlas]] — Tier 1
- [[Frontend Architecture Atlas]] — Tier 2
- [Anti-Pattern Catalog](ANTI_PATTERN_CATALOG.md) — Tier 4
- [[Decisions Queue]] — open decisions
- [[AMMAR_BRAIN_HOME]]

## Tags

#type/onboarding #frontend #day-1-reading #playbook #tier-4
