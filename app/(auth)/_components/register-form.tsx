"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, ArrowRight, LockKeyhole, UserRound } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { signUpAction } from "@/actions/auth.actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  registerUserSchema,
  type RegisterUserSchema,
} from "@/lib/schemas/user.schema"

export function RegisterForm() {
  const [serverError, setServerError] = useState<string>()
  const form = useForm<RegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: { login: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(values: RegisterUserSchema) {
    setServerError(undefined)
    const result = await signUpAction(values)

    if (result.message) {
      setServerError(result.message)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <Field
        id="register-login"
        label="Login"
        icon={UserRound}
        error={form.formState.errors.login?.message}
      >
        <Input
          id="register-login"
          autoComplete="username"
          placeholder="Escolha seu login"
          className="pl-11"
          aria-invalid={Boolean(form.formState.errors.login)}
          {...form.register("login")}
        />
      </Field>

      <Field
        id="register-password"
        label="Senha"
        icon={LockKeyhole}
        error={form.formState.errors.password?.message}
      >
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          placeholder="Crie uma senha"
          className="pl-11"
          aria-invalid={Boolean(form.formState.errors.password)}
          {...form.register("password")}
        />
      </Field>

      <Field
        id="confirm-password"
        label="Confirmar senha"
        icon={LockKeyhole}
        error={form.formState.errors.confirmPassword?.message}
      >
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="Repita sua senha"
          className="pl-11"
          aria-invalid={Boolean(form.formState.errors.confirmPassword)}
          {...form.register("confirmPassword")}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Criando conta..." : "Criar conta"}
        <ArrowRight aria-hidden="true" />
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Já possui conta?{" "}
        <Link href="/login" className="font-semibold text-foreground">
          Fazer login
        </Link>
      </p>
    </form>
  )
}

type FieldProps = {
  id: string
  label: string
  icon: typeof UserRound
  error?: string
  children: React.ReactNode
}

function Field({ id, label, icon: Icon, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        {children}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
