"use client"

import { useActionState } from "react"
import Link from "next/link"
import {
  IconAlertCircle,
  IconLink,
  IconLoader2,
  IconLock,
  IconWorld,
} from "@tabler/icons-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
      <Card>
        <CardContent className="gap-5">
          <Field label="Name" htmlFor="name" errors={state?.errors?.name}>
            <Input
              id="name"
              name="name"
              defaultValue={skill?.name}
              placeholder="Writing git commits"
              maxLength={100}
              required
            />
          </Field>

          <Field
            label="Description"
            htmlFor="description"
            errors={state?.errors?.description}
          >
            <Input
              id="description"
              name="description"
              defaultValue={skill?.description}
              placeholder="Use when writing commit messages for this repo."
              maxLength={300}
              required
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        {/* The filename sits where it does on the skill page, so the thing you
            are typing into is visibly the same document you read there. */}
        <CardHeader className="border-b">
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="content" className="sr-only">
            Instructions
          </Label>
          <Textarea
            id="content"
            name="content"
            defaultValue={skill?.content}
            placeholder={"## Steps\n\n1. …"}
            className="min-h-96 resize-y bg-muted/30 font-mono text-sm leading-relaxed"
            required
          />
          {state?.errors?.content?.length ? (
            <p className="text-xs text-destructive">{state.errors.content[0]}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Tags"
              htmlFor="tags"
              hint="Comma separated. Up to ten."
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
              hint="Private skills stay with you."
              errors={state?.errors?.visibility}
            >
              <Select
                name="visibility"
                defaultValue={skill?.visibility ?? "private"}
              >
                <SelectTrigger id="visibility" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <IconLock />
                    Private
                  </SelectItem>
                  <SelectItem value="unlisted">
                    <IconLink />
                    Unlisted
                  </SelectItem>
                  <SelectItem value="public">
                    <IconWorld />
                    Public
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Pinned to the bottom of the viewport: the Markdown field is long
          enough that Save would otherwise scroll out of reach. */}
      <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 border-t bg-background/85 py-3 backdrop-blur">
        <Button type="submit" disabled={pending}>
          {pending ? <IconLoader2 className="animate-spin" /> : null}
          {pending ? "Saving…" : submitLabel}
        </Button>
        <Link href={cancelHref} className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Link>
        {state?.message ? (
          <p className="ml-auto inline-flex items-center gap-1.5 text-sm text-destructive">
            <IconAlertCircle className="size-4 shrink-0" />
            {state.message}
          </p>
        ) : null}
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
