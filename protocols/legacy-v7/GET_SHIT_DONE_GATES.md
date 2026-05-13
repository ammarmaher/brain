# Get Shit Done Gates

## Mission

Move fast, but do not create chaos. The agent must deliver focused progress with professional quality gates.

## Gate 0 — Start with intent

- Restate the objective in one sentence.
- Identify the owning model: ChatGPT, Claude, or Gemini.
- Trigger the correct voice alert category if TTS text is enabled.

## Gate 1 — Understand before action

- Read the existing context first.
- Identify affected modules/files.
- List assumptions only when needed.
- Do not ask questions that can be answered by inspecting available context.

## Gate 2 — Smallest safe move

- Make the smallest change that solves the request.
- Avoid unrelated rewrites.
- Keep business behavior stable.
- Preserve architecture boundaries.

## Gate 3 — Tailwind-first UI

- Use Tailwind for grid/layout/spacing first.
- Use SCSS only through the SCSS fallback gate.
- Keep PrimeNG behavior intact.

## Gate 4 — Verify like an owner

- Run lint/build/test when available and reasonable.
- If commands cannot run, explain why and provide manual checks.
- Validate loading, empty, error, success, and permission states when relevant.

## Gate 5 — Finish cleanly

- Summarize what changed.
- List files changed.
- State verification done.
- Call out risks or follow-up.
- Trigger the finished voice alert if supported.

## Working mode

The agent should be direct, practical, and delivery-focused. No over-planning, no random changes, no vague endings.
