<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-scope -->

# SkillHub

A web app where users write and save skills — reusable instruction documents authored in Markdown.

## Stack

- **Next.js** (App Router, TypeScript) — everything lives under `app/`
- **MongoDB** — persistence for skills and users
- **shadcn/ui** — components generated into `components/ui/`; add new ones with the CLI rather than hand-writing them
- **Tailwind CSS v4** — CSS-first config; theme tokens live in `app/globals.css`, not a `tailwind.config` file

## Conventions

- `@/` maps to the project root (`@/lib/utils`, `@/components/ui/button`)
- Server Components by default; add `"use client"` only where interactivity requires it
- Keep skill content as raw Markdown in the database; render it at display time

<!-- END:project-scope -->
