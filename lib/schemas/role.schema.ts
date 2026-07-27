import { z } from "zod"

export const roleSchema = z.strictObject({
  id: z.uuid(),
  code: z.string(),
  name: z.string(),
  active: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const userRoleSchema = roleSchema.omit({
  createdAt: true,
  updatedAt: true,
})

export type RoleSchema = z.infer<typeof roleSchema>
export type UserRoleSchema = z.infer<typeof userRoleSchema>
