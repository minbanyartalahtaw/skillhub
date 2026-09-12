import { createSkill } from "@/app/actions/skills"
import { SkillForm } from "@/components/skill-form"

export default function NewSkillPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8 border-b pb-5">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          New skill
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A skill is a Markdown document you can reuse — name it, say when to
          use it, then write the instructions.
        </p>
      </div>

      <SkillForm
        action={createSkill}
        submitLabel="Create skill"
        cancelHref="/user"
      />
    </div>
  )
}
