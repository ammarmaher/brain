# Safe Change Protocol

When upgrading shared Falcon components:

1. Identify all usages.
2. Prefer backward-compatible inputs/templates/slots.
3. Do not break existing pages.
4. Add examples and update component registry.
5. Run regression checks for affected pages.
6. If old behavior is broken, revert or isolate the change.
