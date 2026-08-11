import { z } from "zod"

const isoDateSchema = z.iso.datetime({ offset: true })

export const universitySchema = z.strictObject({
  id: z.uuid(),
  name: z.string(),
  city: z.string(),
  state: z.string(),
  active: z.boolean(),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
})

export const courseSchema = z.strictObject({
  id: z.uuid(),
  universityId: z.uuid(),
  name: z.string(),
  active: z.boolean(),
  university: universitySchema,
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
})

export const paymentMethodSchema = z.strictObject({
  id: z.uuid(),
  code: z.enum(["CASH", "PIX", "BANK_TRANSFER", "OTHER"]),
  name: z.string(),
  description: z.string().nullable(),
  active: z.boolean(),
  displayOrder: z.number().int(),
})

export type University = z.infer<typeof universitySchema>
export type Course = z.infer<typeof courseSchema>
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
