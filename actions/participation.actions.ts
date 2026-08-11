"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { API_ROUTES } from "@/constants/api-routes"
import { api } from "@/lib/api/axios"
import { getAuthorizationHeaders } from "@/lib/api/authenticated"
import { getApiErrorMessage } from "@/lib/api/errors"
import { myRideParticipationSchema, rideParticipantSchema, type MyRideParticipation, type RideParticipant } from "@/lib/schemas/participation.schema"
import { cursorPageSchema, type CursorPage } from "@/lib/schemas/ride.schema"
import type { ActionResult } from "@/lib/types/action"

const participantResponseSchema = z.strictObject({ data: rideParticipantSchema })

export async function listRideParticipantsAction(rideId: string): Promise<ActionResult<RideParticipant[]>> {
  if (!z.uuid().safeParse(rideId).success) return { error: "Carona inválida." }
  try {
    const response = await api.get(API_ROUTES.RIDES.PARTICIPANTS(rideId), { headers: await getAuthorizationHeaders() })
    return { data: z.strictObject({ data: z.array(rideParticipantSchema) }).parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function listMyParticipationsAction(): Promise<ActionResult<CursorPage<MyRideParticipation>>> {
  try {
    const response = await api.get(API_ROUTES.RIDE_PARTICIPATIONS.ME, {
      params: { limit: 20 },
      headers: await getAuthorizationHeaders(),
    })
    return { data: z.strictObject({ data: cursorPageSchema(myRideParticipationSchema) }).parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function requestRideAction(rideId: string, message?: string): Promise<ActionResult<RideParticipant>> {
  if (!z.uuid().safeParse(rideId).success) return { error: "Carona inválida." }
  if (message && message.length > 500) return { error: "A mensagem deve ter no máximo 500 caracteres." }
  try {
    const response = await api.post(API_ROUTES.RIDES.PARTICIPANTS(rideId), { message: message?.trim() || undefined }, { headers: await getAuthorizationHeaders() })
    revalidatePath(`/caronas/${rideId}`)
    revalidatePath("/inicio")
    return { data: participantResponseSchema.parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function cancelParticipationAction(rideId: string, reason?: string): Promise<ActionResult<RideParticipant>> {
  if (!z.uuid().safeParse(rideId).success) return { error: "Carona inválida." }
  try {
    const response = await api.delete(API_ROUTES.RIDES.MY_PARTICIPATION(rideId), {
      data: { reason: reason?.trim() || undefined },
      headers: await getAuthorizationHeaders(),
    })
    revalidatePath(`/caronas/${rideId}`)
    revalidatePath("/inicio")
    return { data: participantResponseSchema.parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}

export async function respondToParticipantAction(
  rideId: string,
  participantId: string,
  action: "accept" | "reject",
): Promise<ActionResult<RideParticipant>> {
  if (!z.uuid().safeParse(rideId).success || !z.uuid().safeParse(participantId).success) return { error: "Solicitação inválida." }
  try {
    const response = await api.patch(API_ROUTES.RIDES.PARTICIPANT_ACTION(rideId, participantId, action), undefined, { headers: await getAuthorizationHeaders() })
    revalidatePath(`/caronas/${rideId}`)
    revalidatePath("/inicio")
    return { data: participantResponseSchema.parse(response.data).data }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}
