import { notFound } from "next/navigation"
import { IconMarkdown } from "@tabler/icons-react"

import { CopyButton } from "@/components/copy-button"
import { SkillHeader } from "@/components/skill-header"
import { SkillMarkdown } from "@/components/skill-markdown"
import { getSkillBySlug, listSkillVersions } from "@/lib/skills"

export default async function SkillPage({ params }) {
  const { slug } = await params
  const skill = await getSkillBySlug(slug)

  if (!skill) notFound()

  const versions = await listSkillVersions(skill.id)

  return (
    <div className="mx-auto w-full max-w-3xl">
      <SkillHeader skill={skill} saves={versions.length} />

      {/* The note is the document itself, so it sits on its own surface rather
          than running straight on from the page heading. */}
      <div className="mt-6 mb-8 overflow-hidden rounded-xl border bg-muted/30">
        <div className="flex items-center justify-between gap-2 border-b bg-muted/60 py-1.5 pr-1.5 pl-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <IconMarkdown className="size-4" />
            {skill.slug}.md
          </span>
          <CopyButton value={skill.content} label="Copy Markdown" />
        </div>

        <div className="px-5 py-4">
          <SkillMarkdown content={skill.content} />
        </div>
      </div>
    </div>
  )
}
