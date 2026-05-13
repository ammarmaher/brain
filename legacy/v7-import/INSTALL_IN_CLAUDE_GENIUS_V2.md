# Install Falcon Brain Genius v2 in Claude

## 1. Copy the folder

Copy `Falcon_Brain_Genius_v2` into your Claude skills/brain location.

Recommended location:

```txt
.claude/skills/Falcon_Brain_Genius_v2
```

or your existing Brain location if you are replacing the older Brain.

## 2. Keep secrets local

This package does not include `config/keys.env`.

Create it locally from:

```txt
config/keys.env.example
```

Never commit real API keys.

## 3. Main instruction to Claude

Paste this into Claude once after installing:

```md
Use Falcon Brain Genius v2 as my master brain.

When I give you a React project, React screen, screenshot, HTML prototype, PRD, backend task, frontend task, sprint plan, or generated artifact request, classify the task first and load the correct skill chain.

For React-to-Angular tasks, use Falcon React-to-Angular Screen Composer — RAGE MODE.
For HTML/CSS/JS prototype tasks, use Rage HTML to Falcon Angular.
For Falcon architecture decisions, use Falcon Project Abstraction Understanding.
For PRD/business tasks, use the Business Knowledge Pipeline and ChatGPT/Codex Business Analyst mindset.
For visual QA, use Gemini Visual/Chart QA when available.

Always protect Falcon architecture, use Falcon components, use Tailwind-first styling, use tokens, avoid over-engineering, detect gaps, ask only blocking questions, and categorize generated artifacts into meaningful folders with clear names.
```

## 4. Trigger examples

```txt
use brain to convert this React screen to Falcon Angular
use RAGE MODE for this screenshot
convert this Claude Design HTML to Falcon Angular
analyze this PRD and create sprint planning PDF
link this backend API with the frontend implementation
find gaps before implementation
create a categorized implementation handoff
```

