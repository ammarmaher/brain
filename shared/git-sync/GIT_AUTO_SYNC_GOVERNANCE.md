## Non-Destructive Output Sync Rule

Brain SK must never use destructive mirror sync for generated outputs.

Forbidden:
- robocopy /MIR
- robocopy /PURGE
- deleting destination output folders before copy
- any sync command that removes existing files from `C:\Falcon\Brain SK\outputs`

Required:
- Use additive sync only.
- Preserve existing templates, reports, registries, Obsidian indexes, and scan metadata.
- Copy new/changed files from `C:\Falcon\Brain Outputs` to `C:\Falcon\Brain SK\outputs`.
- If cleanup is needed, ask Ammar first and list exactly what will be deleted.

Recommended Windows command:
`robocopy "C:\Falcon\Brain Outputs" "C:\Falcon\Brain SK\outputs" /E /XO /XD .git node_modules dist bin obj`

Stop condition:
If a command may delete files from the destination, do not run it.