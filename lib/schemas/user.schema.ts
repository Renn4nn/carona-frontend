import { z } from "zod"

import { userRoleSchema } from "@/lib/schemas/role.schema"

export const createUserSchema = z.strictObject({
  login: z
    .string({
      error: "Campo Login é obrigatório",
    })
    .min(3, "Campo Login deve ter pelo menos 3 caracteres"),
  password: z
    .string({
      error: "Campo Senha é obrigatório",
    })
    .min(6, "Campo Senha deve ter pelo menos 6 caracteres"),
})

export const registerUserSchema = z
  .strictObject({
    login: z
      .string({
        error: "Campo Login é obrigatório",
      })
      .min(3, "Campo Login deve ter pelo menos 3 caracteres"),
    password: z
      .string({
        error: "Campo Senha é obrigatório",
      })
      .min(6, "Campo Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z
      .string({
        error: "Confirmação de senha é obrigatória",
      })
      .min(6, "Confirmação de senha deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export const userSchema = z.strictObject({
  id: z.uuid(),
  login: z.string(),
  role: userRoleSchema,
  active: z.boolean(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
})

export const updateUserSchema = createUserSchema.partial()

export type UserSchema = z.infer<typeof userSchema>
export type CreateUserSchema = z.infer<typeof createUserSchema>
export type UpdateUserSchema = z.infer<typeof updateUserSchema>
export type RegisterUserSchema = z.infer<typeof registerUserSchema>
