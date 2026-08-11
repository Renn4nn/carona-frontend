"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react"
import { useForm } from "react-hook-form"

import { signInAction } from "@/actions/auth.actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createUserSchema,
  type CreateUserSchema,
} from "@/lib/schemas/user.schema"
import { useState } from "react"

export function LoginForm({ next }: { next?: string }) {
  const [serverError, setServerError] = useState<string>()
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { login: "", password: "" },
  })

  async function onSubmit(values: CreateUserSchema) {
    setServerError(undefined)
    const result = await signInAction(values, next)

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

      <div className="space-y-2">
        <Label htmlFor="login">Login</Label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="login"
            autoComplete="username"
            placeholder="Digite seu login"
            className="pl-11"
            aria-invalid={Boolean(form.formState.errors.login)}
            {...form.register("login")}
          />
        </div>
        {form.formState.errors.login && (
          <p className="text-sm text-destructive">
            {form.formState.errors.login.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Digite sua senha"
            className="px-11"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register("password")}
          />
          <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
        <ArrowRight aria-hidden="true" />
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Ainda não possui conta?{" "}
        <Link href={{ pathname: "/cadastro", query: next ? { next } : undefined }} className="font-semibold text-foreground">
          Criar cadastro
        </Link>
      </p>
    </form>
  )
}
