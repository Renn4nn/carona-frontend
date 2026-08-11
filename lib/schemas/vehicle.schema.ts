import { z } from "zod"

const text = (label: string) =>
  z.string().trim().min(2, `${label} deve ter pelo menos 2 caracteres`).max(60)

export const vehicleInputSchema = z.strictObject({
  brand: text("Marca"),
  model: text("Modelo"),
  color: text("Cor"),
  plate: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase().replace(/[\s-]/g, ""))
    .refine((value) => /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(value), "Placa inválida"),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  passengerCapacity: z.coerce.number().int().min(1).max(20),
})

export const vehicleSchema = z.strictObject({
  id: z.uuid(),
  ownerId: z.uuid(),
  brand: z.string(),
  model: z.string(),
  color: z.string(),
  plate: z.string(),
  year: z.number().int(),
  passengerCapacity: z.number().int(),
  active: z.boolean(),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
})

export type Vehicle = z.infer<typeof vehicleSchema>
export type VehicleInput = z.input<typeof vehicleInputSchema>
