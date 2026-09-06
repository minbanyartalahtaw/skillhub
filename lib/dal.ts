import "server-only"

import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ObjectId } from "mongodb"

import { decrypt } from "@/lib/session"
import { getDb } from "@/lib/mongodb"
import type { UserDoc } from "@/lib/definitions"

/**
 * The real access check. Proxy only does an optimistic cookie check, so every
 * protected page and Server Function must call this before reading data.
 */
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect("/login")
  }

  return { isAuth: true as const, userId: session.userId }
})

export const getUser = cache(async () => {
  const session = await verifySession()

  const db = await getDb()
  const user = await db
    .collection<UserDoc>("users")
    .findOne(
      { _id: new ObjectId(session.userId) },
      { projection: { password: 0 } }
    )

  if (!user) return null

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  }
})
