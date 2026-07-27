import "server-only"

import { cookies } from "next/headers"

import type { AuthResult } from "@/lib/types/auth/auth"

export const ACCESS_TOKEN_COOKIE = "caronaAccessToken"
export const REFRESH_TOKEN_COOKIE = "refreshToken"

const secure = process.env.NODE_ENV === "production"
const refreshMaxAge = 20 * 24 * 60 * 60

export async function setSessionCookies(
  auth: AuthResult,
  refreshToken: string,
) {
  const cookieStore = await cookies()
  const baseOptions = {
    httpOnly: true,
    secure,
    sameSite: "strict" as const,
    path: "/",
  }

  cookieStore.set(ACCESS_TOKEN_COOKIE, auth.accessToken, {
    ...baseOptions,
    maxAge: auth.expiresIn,
  })
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...baseOptions,
    maxAge: refreshMaxAge,
  })
}

export async function clearSessionCookies() {
  const cookieStore = await cookies()

  cookieStore.delete(ACCESS_TOKEN_COOKIE)
  cookieStore.delete(REFRESH_TOKEN_COOKIE)
}

export function readRefreshToken(setCookieHeader: string | string[] | undefined) {
  const headers = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : setCookieHeader
      ? [setCookieHeader]
      : []

  for (const header of headers) {
    const match = header.match(/(?:^|;\s*)refreshToken=([^;]+)/)

    if (match?.[1]) {
      return decodeURIComponent(match[1])
    }
  }

  return null
}
