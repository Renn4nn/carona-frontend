import "server-only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth/cookies"
import { sessionTokenPayloadSchema } from "@/lib/schemas/auth.schema"

export type Session = {
  userId: string
  login: string
  role: string
}

function decodeAccessToken(token: string) {
  try {
    const payloadSegment = token.split(".")[1]

    if (!payloadSegment) {
      return null
    }

    const payload: unknown = JSON.parse(
      Buffer.from(payloadSegment, "base64url").toString("utf8"),
    )
    const result = sessionTokenPayloadSchema.safeParse(payload)

    if (!result.success || result.data.exp * 1000 <= Date.now()) {
      return null
    }

    return result.data
  } catch {
    return null
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!token) {
    return null
  }

  const payload = decodeAccessToken(token)

  if (!payload) {
    return null
  }

  return {
    userId: payload.sub,
    login: payload.login,
    role: payload.role,
  }
}

export async function requireSession() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return session
}

export async function hasRefreshSession() {
  const cookieStore = await cookies()

  return Boolean(cookieStore.get(REFRESH_TOKEN_COOKIE)?.value)
}

export async function redirectAuthenticatedUser() {
  const session = await getSession()

  if (session) {
    redirect("/inicio")
  }
}
