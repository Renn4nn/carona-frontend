import { z } from "zod"

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
  originAddress: z.string(),
  destinationAddress: z.string(),
  departureAt: z.iso.datetime({ offset: true }),
  estimatedArrivalAt: z.iso.datetime({ offset: true }).nullable(),
  totalSeats: z.number().int(),
  availableSeats: z.number().int(),
  isFull: z.boolean(),
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
  originLatitude: z.number().nullable(),
  originLongitude: z.number().nullable(),
  destinationLatitude: z.number().nullable(),
  destinationLongitude: z.number().nullable(),
  notes: z.string().nullable(),
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
  origin: z.string().trim().min(1).max(255).optional(),
  destination: z.string().trim().min(1).max(255).optional(),
  departureFrom: z.iso.datetime({ offset: true }).optional(),
  departureTo: z.iso.datetime({ offset: true }).optional(),
  availableOnly: z.enum(["true", "false"]).default("true"),
})

const address = (label: string) =>
  z.string().trim().min(5, `${label} deve ter pelo menos 5 caracteres`).max(255)

export const createRideInputSchema = z
  .strictObject({
    vehicleId: z.uuid("Selecione um veículo"),
    originAddress: address("Endereço inicial"),
    originLatitude: z.number().min(-90).max(90).optional(),
    originLongitude: z.number().min(-180).max(180).optional(),
    destinationAddress: address("Endereço final"),
    destinationLatitude: z.number().min(-90).max(90).optional(),
    destinationLongitude: z.number().min(-180).max(180).optional(),
    departureAt: z.iso.datetime({ offset: true }),
    notes: z.string().trim().max(1000).optional(),
  })
  .superRefine((data, context) => {
    if (data.originAddress.toLocaleLowerCase() === data.destinationAddress.toLocaleLowerCase()) {
      context.addIssue({
        code: "custom",
        path: ["destinationAddress"],
        message: "Origem e destino devem ser diferentes",
      })
    }
  })

export const offerRideFormSchema = z
  .strictObject({
    vehicleId: z.uuid("Selecione um veículo"),
    originAddress: address("Endereço inicial"),
    destinationAddress: address("Endereço final"),
    departureAt: z.string().min(1, "Informe a data e hora da partida"),
    notes: z.string().trim().max(1000, "A observação deve ter no máximo 1000 caracteres"),
  })
  .superRefine((data, context) => {
    if (data.originAddress.toLocaleLowerCase() === data.destinationAddress.toLocaleLowerCase()) {
      context.addIssue({
        code: "custom",
        path: ["destinationAddress"],
        message: "Origem e destino devem ser diferentes",
      })
    }
    if (data.departureAt && new Date(data.departureAt) <= new Date()) {
      context.addIssue({
        code: "custom",
        path: ["departureAt"],
        message: "A partida deve estar no futuro",
      })
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
export type OfferRideFormInput = z.input<typeof offerRideFormSchema>
export type CursorPage<T> = { items: T[]; pageInfo: { nextCursor: string | null; hasNextPage: boolean } }
