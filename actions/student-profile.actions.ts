"use server"

import { revalidatePath } from "next/cache"
import { isAxiosError } from "axios"
import { z } from "zod"

import { API_ROUTES } from "@/constants/api-routes"
import { api } from "@/lib/api/axios"
import { getAuthorizationHeaders } from "@/lib/api/authenticated"
import { getApiErrorMessage } from "@/lib/api/errors"
import { studentProfileInputSchema, studentProfileSchema, type StudentProfile } from "@/lib/schemas/student-profile.schema"
import type { ActionResult } from "@/lib/types/action"

const responseSchema = z.strictObject({ data: studentProfileSchema })

export async function getStudentProfileAction(): Promise<ActionResult<StudentProfile | null>> {
  try {
    const response = await api.get(API_ROUTES.STUDENT_PROFILES.ME, { headers: await getAuthorizationHeaders() })
    return { data: responseSchema.parse(response.data).data }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) return { data: null }
    return { error: getApiErrorMessage(error) }
  }
}

export async function saveStudentProfileAction(input: unknown, exists: boolean): Promise<ActionResult<StudentProfile>> {
  const parsed = studentProfileInputSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados acadêmicos inválidos." }
  try {
    const headers = await getAuthorizationHeaders()
    const response = exists
      ? await api.patch(API_ROUTES.STUDENT_PROFILES.ME, parsed.data, { headers })
      : await api.post(API_ROUTES.STUDENT_PROFILES.BASE, parsed.data, { headers })
    revalidatePath("/perfil")
    return { data: responseSchema.parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function setStudentProfileActiveAction(active: boolean): Promise<ActionResult<StudentProfile>> {
  try {
    const headers = await getAuthorizationHeaders()
    const response = active
      ? await api.patch(API_ROUTES.STUDENT_PROFILES.ACTIVATE, undefined, { headers })
      : await api.delete(API_ROUTES.STUDENT_PROFILES.ME, { headers })
    revalidatePath("/perfil")
    return { data: responseSchema.parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}
