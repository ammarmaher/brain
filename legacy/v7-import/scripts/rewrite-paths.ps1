# *** rewrite-paths.ps1 ***
# *** One-shot literal-string rewrite from brain-skills\Brain | brain-skills\settings to Brain | Brain\settings ***
# *** Run after the consolidation copy. Idempotent. ***

$files = @(
    'C:\falcon\Brain\scripts\render-all-sequential.ps1',
    'C:\falcon\Brain\scripts\render-mindset-half.ps1',
    'C:\falcon\Brain\scripts\render-mindset.ps1',
    'C:\falcon\Brain\scripts\play-alert.ps1',
    'C:\falcon\Brain\scripts\render-alerts.ps1',
    'C:\falcon\Brain\scripts\test-keys.ps1',
    'C:\falcon\Brain\scripts\ask-gemini.ps1',
    'C:\falcon\Brain\scripts\ask-chatgpt.ps1',
    'C:\falcon\Brain\Skill.md',
    'C:\falcon\Brain\settings\sound\INSTRUCTIONS.md',
    'C:\falcon\Brain\settings\sound\CLAUDE_FREE_TTS_SETUP.md',
    'C:\falcon\Brain\jobs\full-pipeline-redesign.md',
    'C:\falcon\Brain\jobs\context-aware-alerts.md',
    'C:\falcon\Brain\jobs\analysis-output-structure.md',
    'C:\falcon\Brain\jobs\test-cases-for-all-prds.md',
    'C:\falcon\Brain\jobs\prompt-1-brain-structure.md',
    'C:\falcon\Brain\jobs\prompt-2-session-health-daemon.md',
    'C:\falcon\Brain\jobs\prompt-3-brain-integration.md',
    'C:\falcon\CLAUDE.md',
    'C:\Users\User\.claude\projects\C--falcon\memory\feedback_brain_skill.md',
    'C:\Users\User\.claude\projects\C--falcon\memory\feedback_skill_status_announcer.md',
    'C:\Users\User\.claude\projects\C--falcon\memory\feedback_brain_skills_protocol.md',
    'C:\Users\User\.claude\projects\C--falcon\memory\feedback_night_mode_trigger.md'
)
$updated = 0
foreach ($f in $files) {
    if (-not (Test-Path $f)) { continue }
    $c = [System.IO.File]::ReadAllText($f)
    $o = $c
    $c = $c.Replace('C:\falcon\brain-skills\Brain', 'C:\falcon\Brain')
    $c = $c.Replace('C:\falcon\brain-skills\settings', 'C:\falcon\Brain\settings')
    $c = $c.Replace('C:/falcon/brain-skills/Brain', 'C:/falcon/Brain')
    $c = $c.Replace('C:/falcon/brain-skills/settings', 'C:/falcon/Brain/settings')
    $c = $c.Replace('brain-skills\Brain\', 'Brain\')
    $c = $c.Replace('brain-skills/Brain/', 'Brain/')
    $c = $c.Replace('brain-skills\settings\', 'Brain\settings\')
    $c = $c.Replace('brain-skills/settings/', 'Brain/settings/')
    if ($c -ne $o) {
        [System.IO.File]::WriteAllText($f, $c, [System.Text.UTF8Encoding]::new($false))
        $updated++
        Write-Host "  + $f"
    }
}
Write-Host ""
Write-Host "Updated $updated files."
