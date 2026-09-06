import { notFound } from "next/navigation"

import { SkillHeader } from "@/components/skill-header"
import { SkillMarkdown } from "@/components/skill-markdown"
import { getSkillBySlug, listSkillVersions } from "@/lib/skills"

export default async function SkillPage({
  params,
}: PageProps<"/user/skills/[slug]">) {
  const { slug } = await params
  const skill = await getSkillBySlug(slug)

  if (!skill) notFound()

  const versions = await listSkillVersions(skill.id)

  return (
    <div className="mx-auto w-full max-w-3xl">
      <SkillHeader skill={skill} saves={versions.length} />
      <div className="pt-6">
        <SkillMarkdown content={skill.content} />
      </div>
    </div>
  )
}
