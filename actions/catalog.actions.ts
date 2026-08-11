"use server"

import { z } from "zod"

import { API_ROUTES } from "@/constants/api-routes"
import { api } from "@/lib/api/axios"
import { getApiErrorMessage } from "@/lib/api/errors"
import {
  courseSchema,
  paymentMethodSchema,
  universitySchema,
  type Course,
  type PaymentMethod,
  type University,
} from "@/lib/schemas/catalog.schema"
import type { ActionResult } from "@/lib/types/action"

export async function listUniversitiesAction(): Promise<ActionResult<University[]>> {
  try {
    const response = await api.get(API_ROUTES.UNIVERSITIES.BASE)
    return { data: z.strictObject({ data: z.array(universitySchema) }).parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function listCoursesAction(): Promise<ActionResult<Course[]>> {
  try {
    const response = await api.get(API_ROUTES.COURSES.BASE)
    return { data: z.strictObject({ data: z.array(courseSchema) }).parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function listPaymentMethodsAction(): Promise<ActionResult<PaymentMethod[]>> {
  try {
    const response = await api.get(API_ROUTES.PAYMENT_METHODS.BASE)
    return { data: z.strictObject({ data: z.array(paymentMethodSchema) }).parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}
