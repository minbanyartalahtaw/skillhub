"use server"

import bcrypt from "bcryptjs"
import * as z from "zod"
import { redirect } from "next/navigation"

import { getDb } from "@/lib/mongodb"
import { createSession, deleteSession } from "@/lib/session"
import {
  LoginFormSchema,
  SignupFormSchema,
  type FormState,
  type UserDoc,
} from "@/lib/definitions"

export async function signup(_state: FormState, formData: FormData) {
  const validated = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors }
  }

  const { name, email, password } = validated.data
  const db = await getDb()
  const users = db.collection<UserDoc>("users")

  // Unique index makes this race-safe; the check is here for a clean message.
  await users.createIndex({ email: 1 }, { unique: true })

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

export async function login(_state: FormState, formData: FormData) {
  const validated = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors }
  }

  const { email, password } = validated.data
  const db = await getDb()
  const user = await db.collection<UserDoc>("users").findOne({ email })

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

