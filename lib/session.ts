import "server-only"

import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

import type { SessionPayload } from "@/lib/definitions"

const secretKey = process.env.AUTH_SECRET

if (!secretKey) {
  throw new Error("AUTH_SECRET is not set. Copy .env.sample to .env.")
}

const encodedKey = new TextEncoder().encode(secretKey)

const SESSION_COOKIE = "session"
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload
  } catch {
    // Missing, tampered with, or expired — all mean "not signed in".
    return undefined
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    // Plain http on localhost would drop a `secure` cookie in some browsers.
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
