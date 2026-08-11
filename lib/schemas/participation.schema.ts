import { z } from "zod"

import { publicRideSchema } from "@/lib/schemas/ride.schema"

export const participantStatusSchema = z.strictObject({
  id: z.uuid(),
  code: z.enum(["PENDING", "ACCEPTED", "REJECTED", "CANCELED", "COMPLETED"]),
  name: z.string(),
  description: z.string().nullable(),
  active: z.boolean(),
  displayOrder: z.number().int(),
})

export const rideParticipantSchema = z.strictObject({
  id: z.uuid(),
  rideId: z.uuid(),
  userId: z.uuid(),
  user: z.strictObject({ id: z.uuid(), login: z.string() }),
  status: participantStatusSchema,
  message: z.string().nullable(),
  requestedAt: z.iso.datetime({ offset: true }),
  respondedAt: z.iso.datetime({ offset: true }).nullable(),
  canceledAt: z.iso.datetime({ offset: true }).nullable(),
  completedAt: z.iso.datetime({ offset: true }).nullable(),
  cancellationReason: z.string().nullable(),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
})

export const myRideParticipationSchema = rideParticipantSchema.extend({ ride: publicRideSchema })

export type RideParticipant = z.infer<typeof rideParticipantSchema>
export type MyRideParticipation = z.infer<typeof myRideParticipationSchema>
