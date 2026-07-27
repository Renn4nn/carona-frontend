import { z } from "zod"

export const authenticatedUserSchema = z.strictObject({
  id: z.uuid(),
  login: z.string(),
  role: z.string(),
})

export const authResultSchema = z.strictObject({
  user: authenticatedUserSchema,
  accessToken: z.string().min(1),
  expiresIn: z.number().positive(),
})

export const authResponseSchema = z.strictObject({
  data: authResultSchema,
})

export const sessionTokenPayloadSchema = z.object({
  sub: z.uuid(),
  login: z.string(),
  role: z.string(),
  type: z.literal("access"),
  jti: z.uuid(),
  exp: z.number(),
})
