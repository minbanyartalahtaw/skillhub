import Link from "next/link"
import { notFound } from "next/navigation"
import { IconArrowLeft, IconHistory } from "@tabler/icons-react"

import { updateSkill } from "@/app/actions/skills"
import { SkillForm } from "@/components/skill-form"
import { getSkillBySlug } from "@/lib/skills"

export default async function EditSkillPage({
  params,
}: PageProps<"/user/skills/[slug]/edit">) {
  const { slug } = await params
  const skill = await getSkillBySlug(slug)

  if (!skill) notFound()

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* The way back out, and the answer to "which skill am I editing?" —
          the form below only ever shows the fields, never the name in title. */}
      <Link
        href={`/user/skills/${skill.slug}`}
        className="inline-flex max-w-full items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <IconArrowLeft className="size-4 shrink-0" />
        <span className="truncate">{skill.name}</span>
      </Link>

      <div className="mt-3 mb-8 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b pb-5">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Edit skill
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Saving keeps the current text as v{skill.currentVersion}, so nothing
            is overwritten for good.
          </p>
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
