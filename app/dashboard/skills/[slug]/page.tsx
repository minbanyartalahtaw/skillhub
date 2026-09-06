import Link from "next/link"
import { notFound } from "next/navigation"
import { IconHistory, IconPencil } from "@tabler/icons-react"

import { SkillActions } from "@/components/skill-actions"
import { SkillMarkdown } from "@/components/skill-markdown"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { getSkillBySlug, listSkillVersions } from "@/lib/skills"

export default async function SkillPage({
  params,
}: PageProps<"/dashboard/skills/[slug]">) {
  const { slug } = await params
  const skill = await getSkillBySlug(slug)

  if (!skill) notFound()

  const versions = await listSkillVersions(skill.id)

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold">{skill.name}</h1>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/skills/${skill.slug}/edit`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <IconPencil />
            Edit
          </Link>
          <SkillActions skillId={skill.id} skillName={skill.name} />
        </div>
      </div>

      <p className="text-muted-foreground">{skill.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary">{skill.visibility}</Badge>
        {skill.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
        <span className="ml-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <IconHistory className="size-3.5" />v{skill.currentVersion}
          {versions.length > 1 ? ` · ${versions.length} saves` : null}
        </span>
      </div>

      <hr className="my-6" />

      <SkillMarkdown content={skill.content} />
    </div>
  )
}
