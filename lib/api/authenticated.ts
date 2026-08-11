import "server-only"

import { cookies } from "next/headers"

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/cookies"

export async function getAuthorizationHeaders() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    throw new Error("Sessão não encontrada.")
  }

  return { Authorization: `Bearer ${accessToken}` }
}
