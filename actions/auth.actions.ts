"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { API_ROUTES } from "@/constants/api-routes"
import { api } from "@/lib/api/axios"
import { getApiErrorMessage } from "@/lib/api/errors"
import {
  clearSessionCookies,
  readRefreshToken,
  REFRESH_TOKEN_COOKIE,
  setSessionCookies,
} from "@/lib/auth/cookies"
import { authResponseSchema } from "@/lib/schemas/auth.schema"
import {
  createUserSchema,
  registerUserSchema,
} from "@/lib/schemas/user.schema"
import type {
  SignInActionState,
  SignUpActionState,
} from "@/lib/types/auth/action"

export async function signInAction(
  input: unknown,
): Promise<SignInActionState> {
  const parsed = createUserSchema.safeParse(input)

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  try {
    const response = await api.post(API_ROUTES.AUTH.SIGN_IN, parsed.data)
    const auth = authResponseSchema.parse(response.data).data
    const refreshToken = readRefreshToken(response.headers["set-cookie"])

    if (!refreshToken) {
      return { message: "A sessão não pôde ser criada. Tente novamente." }
    }

    await setSessionCookies(auth, refreshToken)
  } catch (error) {
    return { message: getApiErrorMessage(error) }
  }

  redirect("/inicio")
}

export async function signUpAction(
  input: unknown,
): Promise<SignUpActionState> {
  const parsed = registerUserSchema.safeParse(input)

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  try {
    const response = await api.post(API_ROUTES.AUTH.SIGN_UP, parsed.data)
    const auth = authResponseSchema.parse(response.data).data
    const refreshToken = readRefreshToken(response.headers["set-cookie"])

    if (!refreshToken) {
      return { message: "A sessão não pôde ser criada. Tente novamente." }
    }

    await setSessionCookies(auth, refreshToken)
  } catch (error) {
    return { message: getApiErrorMessage(error) }
  }

  redirect("/inicio")
}

export async function refreshSessionAction() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value

  if (!refreshToken) {
    await clearSessionCookies()
    return false
  }

  try {
    const response = await api.post(
      API_ROUTES.AUTH.REFRESH,
      undefined,
      { headers: { Cookie: `refreshToken=${refreshToken}` } },
    )
    const auth = authResponseSchema.parse(response.data).data
    const rotatedToken = readRefreshToken(response.headers["set-cookie"])

    if (!rotatedToken) {
      await clearSessionCookies()
      return false
    }

    await setSessionCookies(auth, rotatedToken)
    return true
  } catch {
    await clearSessionCookies()
    return false
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value

  try {
    await api.post(API_ROUTES.AUTH.LOGOUT, undefined, {
      headers: refreshToken
        ? { Cookie: `refreshToken=${refreshToken}` }
        : undefined,
    })
  } finally {
    await clearSessionCookies()
  }

  redirect("/login")
}
