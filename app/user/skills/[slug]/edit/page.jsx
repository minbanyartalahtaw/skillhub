import { notFound } from "next/navigation"
import { IconHistory } from "@tabler/icons-react"

import { updateSkill } from "@/app/actions/skills"
import { SkillForm } from "@/components/skill-form"
import { getSkillBySlug } from "@/lib/skills"

export default async function EditSkillPage({ params }) {
  const { slug } = await params
  const skill = await getSkillBySlug(slug)

  if (!skill) notFound()

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b pb-5">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Edit skill
          </h1>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <IconHistory className="size-3.5" />v{skill.currentVersion} · edited{" "}
          {skill.updatedAt.toLocaleDateString()}
        </span>
      </div>

      <SkillForm
        action={updateSkill.bind(null, skill.id)}
        skill={skill}
        submitLabel="Save changes"
        cancelHref={`/user/skills/${skill.slug}`}
      />
    </div>
  )
}
