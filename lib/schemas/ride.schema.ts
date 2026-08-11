import { z } from "zod"

import { paymentMethodSchema } from "@/lib/schemas/catalog.schema"

export const rideStatusSchema = z.strictObject({
  id: z.uuid(),
  code: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELED"]),
  name: z.string(),
  description: z.string().nullable(),
  active: z.boolean(),
  displayOrder: z.number().int(),
})

const rideBaseSchema = z.strictObject({
  id: z.uuid(),
  status: rideStatusSchema,
  originName: z.string(),
  destinationName: z.string(),
  departureAt: z.iso.datetime({ offset: true }),
  estimatedArrivalAt: z.iso.datetime({ offset: true }).nullable(),
  totalSeats: z.number().int(),
  availableSeats: z.number().int(),
  isFull: z.boolean(),
  contributionPerSeat: z.string(),
  paymentMethod: paymentMethodSchema.nullable(),
})

export const publicRideSchema = rideBaseSchema

export const rideSchema = rideBaseSchema.extend({
  driver: z.strictObject({ id: z.uuid(), login: z.string() }),
  vehicle: z.strictObject({
    id: z.uuid(),
    brand: z.string(),
    model: z.string(),
    color: z.string(),
    year: z.number().int(),
  }),
  originAddress: z.string(),
  originLatitude: z.number().nullable(),
  originLongitude: z.number().nullable(),
  destinationAddress: z.string(),
  destinationLatitude: z.number().nullable(),
  destinationLongitude: z.number().nullable(),
  paymentNotes: z.string().nullable(),
  description: z.string().nullable(),
  rules: z.string().nullable(),
  startedAt: z.iso.datetime({ offset: true }).nullable(),
  completedAt: z.iso.datetime({ offset: true }).nullable(),
  canceledAt: z.iso.datetime({ offset: true }).nullable(),
  cancellationReason: z.string().nullable(),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
})

export const rideQuerySchema = z.strictObject({
  cursor: z.uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  origin: z.string().trim().min(1).max(120).optional(),
  destination: z.string().trim().min(1).max(120).optional(),
  departureFrom: z.iso.datetime({ offset: true }).optional(),
  departureTo: z.iso.datetime({ offset: true }).optional(),
  maxContribution: z.coerce.number().min(0).optional(),
  availableOnly: z.enum(["true", "false"]).default("true"),
})

export const createRideInputSchema = z
  .strictObject({
    vehicleId: z.uuid("Selecione um veículo"),
    paymentMethodId: z.uuid().optional(),
    originName: z.string().trim().min(2).max(120),
    originAddress: z.string().trim().min(5).max(255),
    destinationName: z.string().trim().min(2).max(120),
    destinationAddress: z.string().trim().min(5).max(255),
    departureAt: z.iso.datetime({ offset: true }),
    estimatedArrivalAt: z.iso.datetime({ offset: true }).optional(),
    totalSeats: z.coerce.number().int().min(1),
    contributionPerSeat: z.coerce.number().min(0).default(0),
    paymentNotes: z.string().trim().max(300).optional(),
    description: z.string().trim().max(1000).optional(),
    rules: z.string().trim().max(1000).optional(),
  })
  .superRefine((data, context) => {
    if (data.originName.toLocaleLowerCase() === data.destinationName.toLocaleLowerCase()) {
      context.addIssue({ code: "custom", path: ["destinationName"], message: "Origem e destino devem ser diferentes" })
    }
    if (data.contributionPerSeat > 0 && !data.paymentMethodId) {
      context.addIssue({ code: "custom", path: ["paymentMethodId"], message: "Selecione como a contribuição será combinada" })
    }
  })

export const cursorPageSchema = <T extends z.ZodType>(item: T) =>
  z.strictObject({
    items: z.array(item),
    pageInfo: z.strictObject({ nextCursor: z.string().nullable(), hasNextPage: z.boolean() }),
  })

export type PublicRide = z.infer<typeof publicRideSchema>
export type Ride = z.infer<typeof rideSchema>
export type RideQuery = z.input<typeof rideQuerySchema>
export type CreateRideInput = z.input<typeof createRideInputSchema>
export type CursorPage<T> = { items: T[]; pageInfo: { nextCursor: string | null; hasNextPage: boolean } }
