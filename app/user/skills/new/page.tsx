import { createSkill } from "@/app/actions/skills"
import { SkillForm } from "@/components/skill-form"

export default function NewSkillPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold">New skill</h1>
      <SkillForm
        action={createSkill}
        submitLabel="Create skill"
        cancelHref="/user"
      />
    </div>
  )
}
