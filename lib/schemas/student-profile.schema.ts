import { z } from "zod"

import { courseSchema } from "@/lib/schemas/catalog.schema"

export const studentProfileInputSchema = z.strictObject({
  courseId: z.uuid("Selecione um curso"),
  registration: z.string().trim().min(1, "Informe a matrícula").max(50),
})

export const studentProfileSchema = z.strictObject({
  id: z.uuid(),
  userId: z.uuid(),
  courseId: z.uuid(),
  registration: z.string(),
  active: z.boolean(),
  course: courseSchema,
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
})

export type StudentProfile = z.infer<typeof studentProfileSchema>
export type StudentProfileInput = z.infer<typeof studentProfileInputSchema>
