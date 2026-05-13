# Rage HTML to Falcon Angular Skill

This Claude Skill converts a one-file HTML/CSS/JS prototype into a real Falcon Angular/Nx implementation.

## Skill name

```text
rage-html-to-falcon-angular
```

## Recommended install path

```text
.claude/skills/rage-html-to-falcon-angular/
```

## What is Rage HTML?

"Rage HTML" means one generated HTML file that contains everything:

- HTML structure
- embedded CSS
- embedded JavaScript
- mock data
- animations
- interactions

This usually comes from Claude Design, Stitch, screenshot-to-code tools, or AI design generators.

## What this skill does

It tells Claude to:

1. Analyze the HTML/CSS/JS source.
2. Break it into layout zones and components.
3. Map raw UI parts to Falcon components.
4. Convert CSS to Tailwind and Falcon tokens.
5. Convert JavaScript to Angular TypeScript.
6. Split the page into Angular components where needed.
7. Remove script tags and manual DOM manipulation.
8. Produce real Angular code.

## Hard rule

The HTML file is only a reference.

The final output must be Angular/Falcon Angular, not embedded static HTML.
