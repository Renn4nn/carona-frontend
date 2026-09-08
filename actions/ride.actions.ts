"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { API_ROUTES } from "@/constants/api-routes"
import { api } from "@/lib/api/axios"
import { getAuthorizationHeaders } from "@/lib/api/authenticated"
import { getApiErrorMessage } from "@/lib/api/errors"
import {
  createRideInputSchema,
  cursorPageSchema,
  publicRideSchema,
  rideQuerySchema,
  rideSchema,
  type CreateRideInput,
  type CursorPage,
  type PublicRide,
  type Ride,
  type RideQuery,
  nearbyRideSchema,
  type NearbyRideSchema,
} from "@/lib/schemas/ride.schema"
import type { ActionResult } from "@/lib/types/action"

const routeResponseSchema = z.strictObject({
  geometry: z.custom<GeoJSON.GeoJSON>((value) => Boolean(value)),
  distanceMeters: z.number().nullable(),
  durationSeconds: z.number().nullable(),
})

const publicPageResponseSchema = z.strictObject({
  data: cursorPageSchema(publicRideSchema),
})
const ridePageResponseSchema = z.strictObject({
  data: cursorPageSchema(rideSchema),
})
const rideResponseSchema = z.strictObject({ data: rideSchema })

function compactParams(input: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(input).filter(
      ([, value]) => value !== undefined && value !== ""
    )
  )
}

export async function listPublicRidesAction(
  input: RideQuery = {}
): Promise<ActionResult<CursorPage<PublicRide>>> {
  const parsed = rideQuerySchema.safeParse(input)
  if (!parsed.success)
    return { error: "Não foi possível aplicar os filtros informados." }
  try {
    const response = await api.get(API_ROUTES.PUBLIC_RIDES.BASE, {
      params: compactParams(parsed.data),
    })
    return { data: publicPageResponseSchema.parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function listRidesAction(
  input: RideQuery = {}
): Promise<ActionResult<CursorPage<Ride>>> {
  const parsed = rideQuerySchema.safeParse(input)
  if (!parsed.success)
    return { error: "Não foi possível aplicar os filtros informados." }
  try {
    const response = await api.get(API_ROUTES.RIDES.BASE, {
      params: compactParams(parsed.data),
      headers: await getAuthorizationHeaders(),
    })
    return { data: ridePageResponseSchema.parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function listNearbyRidesAction(
  latitude: number,
  longitude: number,
  radiusKm = 5
): Promise<ActionResult<NearbyRideSchema[]>> {
  try {
    const response = await api.get(API_ROUTES.RIDES.NEARBY, {
      params: { latitude, longitude, radiusKm },
      headers: await getAuthorizationHeaders(),
    })
    return { data: z.array(nearbyRideSchema).parse(response.data.data) }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function getRideRouteAction(id: string) {
  try {
    const response = await api.get(API_ROUTES.RIDES.ROUTE(id), {
      headers: await getAuthorizationHeaders(),
    })
    return { data: routeResponseSchema.parse(response.data.data) }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function listMineRidesAction(
  role: "driver" | "passenger"
): Promise<ActionResult<CursorPage<Ride>>> {
  try {
    const response = await api.get(API_ROUTES.RIDES.MINE, {
      params: { role, limit: 6, availableOnly: "false" },
      headers: await getAuthorizationHeaders(),
    })
    return { data: ridePageResponseSchema.parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function getRideAction(id: string): Promise<ActionResult<Ride>> {
  if (!z.uuid().safeParse(id).success) return { error: "Carona inválida." }
  try {
    const response = await api.get(API_ROUTES.RIDES.BY_ID(id), {
      headers: await getAuthorizationHeaders(),
    })
    return { data: rideResponseSchema.parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function createRideAction(
  input: CreateRideInput
): Promise<ActionResult<Ride>> {
  const parsed = createRideInputSchema.safeParse(input)
  if (!parsed.success)
    return {
      error: parsed.error.issues[0]?.message ?? "Dados da carona inválidos.",
    }
  try {
    const response = await api.post(API_ROUTES.RIDES.BASE, parsed.data, {
      headers: await getAuthorizationHeaders(),
    })
    revalidatePath("/inicio")
    revalidatePath("/buscar-carona")
    return { data: rideResponseSchema.parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function transitionRideAction(
  id: string,
  action: "start" | "complete" | "cancel",
  reason?: string
): Promise<ActionResult<Ride>> {
  if (!z.uuid().safeParse(id).success) return { error: "Carona inválida." }
  if (action === "cancel" && (!reason || reason.trim().length < 3))
    return { error: "Informe o motivo do cancelamento." }
  try {
    const headers = await getAuthorizationHeaders()
    const route =
      action === "start"
        ? API_ROUTES.RIDES.START(id)
        : action === "complete"
          ? API_ROUTES.RIDES.COMPLETE(id)
          : API_ROUTES.RIDES.CANCEL(id)
    const response = await api.post(
      route,
      action === "cancel" ? { reason: reason?.trim() } : undefined,
      { headers }
    )
    revalidatePath(`/caronas/${id}`)
    revalidatePath("/inicio")
    return { data: rideResponseSchema.parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}
