---
name: Writing Git Commits
description: Use when writing a commit message, so the log explains why a change happened.
tags: git, writing
visibility: private
---

## When to use this

Any time you are about to run `git commit`. Six months from now the diff will
still be readable — the reason for it will not be.

## Steps

1. Write the subject line first, in the imperative: "add", not "added".
2. Keep the subject under 60 characters and do not end it with a period.
3. Leave a blank line, then explain **why** the change was needed. The diff
   already shows what changed.
4. If the change is not obvious, say what you rejected and why.
5. Reference the issue on its own line at the end.

## Subject line prefixes

| Prefix     | Use for                                       |
| ---------- | --------------------------------------------- |
| `feat:`    | A capability the user can see                 |
| `fix:`     | A bug that was reachable in a released build  |
| `refactor:`| Behaviour is identical, structure is not      |
| `chore:`   | Tooling, dependencies, config                 |
| `docs:`    | Documentation only                            |

## Example

```
fix: keep the session cookie on http in dev

Chrome drops a `secure` cookie on plain http, so signing in on
localhost appeared to succeed and then bounced back to /login.

Gate `secure` on NODE_ENV rather than removing it — production
still needs it.

Closes #142
```

## Avoid

- "fix bug", "update", "wip" — these tell the next reader nothing.
- Bundling an unrelated formatting sweep into a behaviour change. Split it.
- Explaining the code line by line. If it needs that, comment the code.
