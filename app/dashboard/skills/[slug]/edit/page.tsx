import { notFound } from "next/navigation"

import { updateSkill } from "@/app/actions/skills"
import { SkillForm } from "@/components/skill-form"
import { getSkillBySlug } from "@/lib/skills"

export default async function EditSkillPage({
  params,
}: PageProps<"/dashboard/skills/[slug]/edit">) {
  const { slug } = await params
  const skill = await getSkillBySlug(slug)

  if (!skill) notFound()

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="mb-1 text-2xl font-semibold">Edit skill</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Saving keeps the old text as v{skill.currentVersion}.
      </p>
      <SkillForm
        action={updateSkill.bind(null, skill.id)}
        skill={skill}
        submitLabel="Save changes"
        cancelHref={`/dashboard/skills/${skill.slug}`}
      />
    </div>
  )
}
