"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { API_ROUTES } from "@/constants/api-routes"
import { api } from "@/lib/api/axios"
import { getAuthorizationHeaders } from "@/lib/api/authenticated"
import { getApiErrorMessage } from "@/lib/api/errors"
import { vehicleInputSchema, vehicleSchema, type Vehicle } from "@/lib/schemas/vehicle.schema"
import type { ActionResult } from "@/lib/types/action"

const responseSchema = z.strictObject({ data: vehicleSchema })

export async function listVehiclesAction(): Promise<ActionResult<Vehicle[]>> {
  try {
    const response = await api.get(API_ROUTES.VEHICLES.BASE, { headers: await getAuthorizationHeaders() })
    return { data: z.strictObject({ data: z.array(vehicleSchema) }).parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function createVehicleAction(input: unknown): Promise<ActionResult<Vehicle>> {
  const parsed = vehicleInputSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados do veículo inválidos." }
  try {
    const response = await api.post(API_ROUTES.VEHICLES.BASE, parsed.data, { headers: await getAuthorizationHeaders() })
    revalidatePath("/perfil")
    return { data: responseSchema.parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function updateVehicleAction(id: string, input: unknown): Promise<ActionResult<Vehicle>> {
  const parsedId = z.uuid().safeParse(id)
  const parsed = vehicleInputSchema.safeParse(input)
  if (!parsedId.success || !parsed.success) return { error: parsed.error?.issues[0]?.message ?? "Veículo inválido." }
  try {
    const response = await api.patch(API_ROUTES.VEHICLES.BY_ID(id), parsed.data, { headers: await getAuthorizationHeaders() })
    revalidatePath("/perfil")
    return { data: responseSchema.parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function setVehicleActiveAction(id: string, active: boolean): Promise<ActionResult<Vehicle>> {
  if (!z.uuid().safeParse(id).success) return { error: "Veículo inválido." }
  try {
    const headers = await getAuthorizationHeaders()
    const response = active
      ? await api.patch(API_ROUTES.VEHICLES.ACTIVATE(id), undefined, { headers })
      : await api.delete(API_ROUTES.VEHICLES.BY_ID(id), { headers })
    revalidatePath("/perfil")
    return { data: responseSchema.parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}
