---
name: Reviewing a Pull Request
description: Use when reviewing someone else's PR, to catch what matters without stalling the change.
tags: review, collaboration
visibility: public
---

## When to use this

You have been asked to review a pull request and want to leave comments that
are worth the author's time.

## Read in this order

1. **The description.** If you cannot tell what problem this solves, that is
   the first comment to leave.
2. **The tests.** They tell you what the author believes the code should do.
3. **The diff**, last. By then you know what to expect, and surprises stand out.

## What to look for

- **Correctness first.** Wrong output, an unhandled error path, a boundary that
  is off by one. Everything else is secondary.
- **The case that is not covered.** Empty list, duplicate entry, two people
  saving at once, a network call that fails halfway.
- **Naming that lies.** A `getUser` that also writes is worse than a long name.
- **Code that already exists.** A helper reimplemented three files away is a
  cheap fix now and an expensive one later.

## Say which kind of comment you are making

Prefix each one so the author knows what blocks the merge:

```
blocking: this drops the error, so a failed save looks like a success
question: is the retry here intentional, or left over from debugging?
nit: spelling — "recieve"
```

Anything marked `nit` should never hold up a merge.

## Before you approve

- [ ] I understand what problem this solves.
- [ ] I could explain this change to someone else.
- [ ] The failure cases are handled or explicitly out of scope.
- [ ] I ran it, or I am satisfied the tests cover it.

## Avoid

- Rewriting the change in your own style. Different is not worse.
- A pile of nits with no verdict — the author cannot tell if you are happy.
- Silence. A PR with no review is a change nobody else understands.
