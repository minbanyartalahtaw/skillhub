"use client"

import Link from "next/link"
import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FormState } from "@/lib/definitions"

type AuthAction = (
  state: FormState,
  formData: FormData
) => Promise<FormState> | FormState

export function AuthForm({
  mode,
  action,
}: {
  mode: "login" | "signup"
  action: AuthAction
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    undefined
  )

  const isSignup = mode === "signup"

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{isSignup ? "Create an account" : "Welcome back"}</CardTitle>
        <CardDescription>
          {isSignup
            ? "Sign up to start saving your skills."
            : "Sign in to continue to SkillHub."}
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="flex flex-col gap-4">
          {isSignup && (
            <Field
              id="name"
              label="Name"
              placeholder="Your name"
              errors={state?.errors?.name}
            />
          )}

          <Field
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            errors={state?.errors?.email}
          />

          <Field
            id="password"
            label="Password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            errors={state?.errors?.password}
          />

          {state?.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
        </CardContent>

        <CardFooter className="mt-6 flex-col gap-4">
          <Button type="submit" disabled={pending} className="w-full">
            {pending
              ? "Please wait…"
              : isSignup
                ? "Create account"
                : "Sign in"}
          </Button>

          <p className="text-sm text-muted-foreground">
            {isSignup ? "Already have an account? " : "No account yet? "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="font-medium text-foreground underline underline-offset-4"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

function Field({
  id,
  label,
  errors,
  ...props
}: React.ComponentProps<typeof Input> & { label: string; errors?: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} aria-invalid={!!errors} {...props} />
      {errors?.map((error) => (
        <p key={error} className="text-sm text-destructive">
          {error}
        </p>
      ))}
    </div>
  )
}
