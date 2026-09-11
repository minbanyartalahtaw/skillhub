"use server"

import bcrypt from "bcryptjs"
import * as z from "zod"
import { redirect } from "next/navigation"

import { ensureUserIndexes, getUsers } from "@/lib/collections"
import { createSession, deleteSession } from "@/lib/session"
import { LoginFormSchema, SignupFormSchema } from "@/lib/definitions"

export async function signup(_state, formData) {
  const validated = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors }
  }

  const { name, email, password } = validated.data
  const users = await getUsers()

  // Unique index makes this race-safe; the check is here for a clean message.
  await ensureUserIndexes()

  if (await users.findOne({ email })) {
    return { message: "An account with that email already exists." }
  }

  const result = await users.insertOne({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    createdAt: new Date(),
  })

  await createSession(result.insertedId.toString())
  redirect("/user")
}

export async function login(_state, formData) {
  const validated = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors }
  }

  const { email, password } = validated.data
  const users = await getUsers()
  const user = await users.findOne({ email })

  // One message for both cases, so it can't be used to probe which emails exist.
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { message: "Invalid email or password." }
  }

  await createSession(user._id.toString())
  redirect("/user")
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}

