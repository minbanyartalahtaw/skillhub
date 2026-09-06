"use client"

import { useActionState } from "react"
import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { SkillFormState } from "@/lib/definitions"
import type { Skill } from "@/lib/skills"

type SkillAction = (
  state: SkillFormState,
  formData: FormData
) => Promise<SkillFormState>

export function SkillForm({
  action,
  skill,
  submitLabel,
  cancelHref,
}: {
  action: SkillAction
  skill?: Skill
  submitLabel: string
  cancelHref: string
}) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field label="Name" htmlFor="name" errors={state?.errors?.name}>
        <Input
          id="name"
          name="name"
          defaultValue={skill?.name}
          placeholder="Writing git commits"
          required
        />
      </Field>

      <Field
        label="Description"
        htmlFor="description"
        hint="When should this skill be used?"
        errors={state?.errors?.description}
      >
        <Input
          id="description"
          name="description"
          defaultValue={skill?.description}
          placeholder="Use when writing commit messages for this repo."
          required
        />
      </Field>

      <Field
        label="Instructions"
        htmlFor="content"
        hint="Markdown. Rendered when the skill is viewed."
        errors={state?.errors?.content}
      >
        <Textarea
          id="content"
          name="content"
          defaultValue={skill?.content}
          placeholder={"## Steps\n\n1. …"}
          className="min-h-72 font-mono text-sm"
          required
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Tags"
          htmlFor="tags"
          hint="Comma separated."
          errors={state?.errors?.tags}
        >
          <Input
            id="tags"
            name="tags"
            defaultValue={skill?.tags.join(", ")}
            placeholder="git, writing"
          />
        </Field>

        <Field
          label="Visibility"
          htmlFor="visibility"
          errors={state?.errors?.visibility}
        >
          <Select name="visibility" defaultValue={skill?.visibility ?? "private"}>
            <SelectTrigger id="visibility" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="unlisted">Unlisted</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      {state?.message ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
        <Link href={cancelHref} className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Link>
      </div>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  hint,
  errors,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  errors?: string[]
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !errors?.length ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {errors?.length ? (
        <p className="text-xs text-destructive">{errors[0]}</p>
      ) : null}
    </div>
  )
}
