# Notification Protocol

Brain SK preserves the old voice/text alert patch as an optional helper. Notifications are allowed for status visibility, but they must not control task logic.

## Trigger events

| Event | Notification type |
|---|---|
| Bootstrap discovery completed | voice/text alert |
| Task completed | voice/text alert |
| Visual parity loop blocked | voice/text alert |
| Build/test failed | voice/text alert |
| Git auto-sync completed | voice/text alert |
| Human decision needed | voice/text alert |

## Location

Notification assets/scripts are stored under:

```text
tools/notifications/
```

## Rule

Notifications are optional. If the local environment cannot play sound, continue the task and write a text status instead.
