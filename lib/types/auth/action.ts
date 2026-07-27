import type {
  CreateUserSchema,
  RegisterUserSchema,
} from "@/lib/schemas/user.schema"

type SignInField = keyof CreateUserSchema
type SignUpField = keyof RegisterUserSchema

export type AuthActionState<TField extends string> = {
  message?: string
  fieldErrors?: Partial<Record<TField, string[]>>
}

export type SignInActionState = AuthActionState<SignInField>
export type SignUpActionState = AuthActionState<SignUpField>
