"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  IdCard,
  LockKeyhole,
  Mail,
  UserRound,
  type LucideIcon,
} from "lucide-react"
import { useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"

import { signUpAction } from "@/actions/auth.actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import type { Course, University } from "@/lib/schemas/catalog.schema"
import {
  registerUserSchema,
  type RegisterUserInput,
  type RegisterUserSchema,
} from "@/lib/schemas/user.schema"

type RegisterFormProps = {
  next?: string
  universities: University[]
  courses: Course[]
  catalogError?: string
}

const accountFields: Array<keyof RegisterUserInput> = [
  "login",
  "password",
  "confirmPassword",
]

export function RegisterForm({
  next,
  universities,
  courses,
  catalogError,
}: RegisterFormProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [serverError, setServerError] = useState<string>()
  const [showPasswords, setShowPasswords] = useState(false)
  const form = useForm<RegisterUserInput, unknown, RegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      login: "",
      password: "",
      confirmPassword: "",
      name: "",
      universityId: "",
      courseId: "",
      registration: "",
    },
  })
  const universityId = useWatch({ control: form.control, name: "universityId" })
  const courseId = useWatch({ control: form.control, name: "courseId" })
  const selectedUniversity = useMemo(
    () => universities.find((university) => university.id === universityId),
    [universities, universityId]
  )
  const availableCourses = useMemo(
    () => courses.filter((course) => course.universityId === universityId),
    [courses, universityId]
  )
  const selectedCourse = useMemo(
    () => availableCourses.find((course) => course.id === courseId),
    [availableCourses, courseId]
  )

  async function goToAcademicStep() {
    setServerError(undefined)
    const valid = await form.trigger(accountFields, { shouldFocus: true })
    if (valid) setStep(2)
  }

  async function onSubmit(values: RegisterUserSchema) {
    setServerError(undefined)
    const result = await signUpAction(values, next)

    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        const message = messages?.[0]
        if (message) {
          form.setError(field as keyof RegisterUserInput, { message })
        }
      }
      if (
        result.fieldErrors.login ||
        result.fieldErrors.password ||
        result.fieldErrors.confirmPassword
      ) {
        setStep(1)
      }
    }
    if (result.message) setServerError(result.message)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div
        className="grid grid-cols-2 gap-2"
        aria-label="Progresso do cadastro"
      >
        <StepIndicator
          number={1}
          label="Sua conta"
          active={step === 1}
          completed={step === 2}
        />
        <StepIndicator
          number={2}
          label="Perfil acadêmico"
          active={step === 2}
        />
      </div>

      {serverError && (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <div className={step === 1 ? "space-y-5" : "hidden"}>
        <Field
          id="register-login"
          label="E-mail institucional"
          icon={Mail}
          error={form.formState.errors.login?.message}
        >
          <Input
            id="register-login"
            type="email"
            autoComplete="email"
            placeholder="voce@universidade.edu.br"
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
          trailing={
            <PasswordToggle
              visible={showPasswords}
              onClick={() => setShowPasswords((value) => !value)}
            />
          }
        >
          <Input
            id="register-password"
            type={showPasswords ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Crie uma senha"
            className="px-11"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register("password")}
          />
        </Field>
        <Field
          id="confirm-password"
          label="Confirmar senha"
          icon={LockKeyhole}
          error={form.formState.errors.confirmPassword?.message}
          trailing={
            <PasswordToggle
              visible={showPasswords}
              onClick={() => setShowPasswords((value) => !value)}
            />
          }
        >
          <Input
            id="confirm-password"
            type={showPasswords ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repita sua senha"
            className="px-11"
            aria-invalid={Boolean(form.formState.errors.confirmPassword)}
            {...form.register("confirmPassword")}
          />
        </Field>
        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={goToAcademicStep}
        >
          Próximo
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>

      <div className={step === 2 ? "space-y-5" : "hidden"}>
        {catalogError && (
          <Alert variant="destructive">
            <AlertCircle aria-hidden="true" />
            <AlertDescription>{catalogError}</AlertDescription>
          </Alert>
        )}
        <Field
          id="student-name"
          label="Nome completo"
          icon={UserRound}
          error={form.formState.errors.name?.message}
        >
          <Input
            id="student-name"
            autoComplete="name"
            placeholder="Como devemos chamar você?"
            className="pl-11"
            maxLength={120}
            aria-invalid={Boolean(form.formState.errors.name)}
            {...form.register("name")}
          />
        </Field>
        <Field
          id="university"
          label="Universidade"
          icon={Building2}
          error={form.formState.errors.universityId?.message}
        >
          <Select
            value={universityId}
            onValueChange={(value) => {
              if (!value) return
              form.setValue("universityId", value, { shouldValidate: true })
              form.setValue("courseId", "", { shouldValidate: false })
            }}
            disabled={Boolean(catalogError) || universities.length === 0}
          >
            <SelectTrigger
              id="university"
              className="w-full pl-11"
              aria-invalid={Boolean(form.formState.errors.universityId)}
            >
              <span className="line-clamp-1 flex-1 text-left">
                {selectedUniversity
                  ? `${selectedUniversity.name} - ${selectedUniversity.city}/${selectedUniversity.state}`
                  : universities.length === 0
                    ? "Nenhuma universidade disponível"
                    : "Selecione sua universidade"}
              </span>
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {universities.map((university) => (
                <SelectItem key={university.id} value={university.id}>
                  {university.name} · {university.city}/{university.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          id="course"
          label="Curso"
          icon={GraduationCap}
          error={form.formState.errors.courseId?.message}
        >
          <Select
            value={courseId}
            onValueChange={(value) => {
              if (value)
                form.setValue("courseId", value, { shouldValidate: true })
            }}
            disabled={
              !universityId ||
              availableCourses.length === 0 ||
              Boolean(catalogError)
            }
          >
            <SelectTrigger
              id="course"
              className="w-full pl-11"
              aria-invalid={Boolean(form.formState.errors.courseId)}
            >
              <span className="line-clamp-1 flex-1 text-left">
                {selectedCourse
                  ? selectedCourse.name
                  : !universityId
                    ? "Escolha primeiro a universidade"
                    : availableCourses.length === 0
                      ? "Nenhum curso disponível"
                      : "Selecione seu curso"}
              </span>
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {availableCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          id="registration"
          label="Matrícula"
          icon={IdCard}
          error={form.formState.errors.registration?.message}
        >
          <Input
            id="registration"
            placeholder="Informe sua matrícula"
            className="pl-11"
            maxLength={50}
            aria-invalid={Boolean(form.formState.errors.registration)}
            {...form.register("registration")}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => setStep(1)}
            disabled={form.formState.isSubmitting}
          >
            <ArrowLeft aria-hidden="true" />
            Voltar
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={
              form.formState.isSubmitting || Boolean(catalogError) || !courseId
            }
          >
            {form.formState.isSubmitting ? "Criando..." : "Criar conta"}
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Já possui conta?{" "}
        <Link
          href={{ pathname: "/login", query: next ? { next } : undefined }}
          className="font-semibold text-foreground"
        >
          Fazer login
        </Link>
      </p>
    </form>
  )
}

function StepIndicator({
  number,
  label,
  active,
  completed = false,
}: {
  number: number
  label: string
  active: boolean
  completed?: boolean
}) {
  return (
    <div
      className={
        active || completed
          ? "rounded-2xl bg-primary/15 px-3 py-2 text-foreground"
          : "rounded-2xl bg-muted px-3 py-2 text-muted-foreground"
      }
    >
      <span className="text-xs font-semibold">
        {label}
      </span>
    </div>
  )
}

function PasswordToggle({
  visible,
  onClick,
}: {
  visible: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-muted-foreground"
      aria-label={visible ? "Ocultar senhas" : "Mostrar senhas"}
    >
      {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  )
}

type FieldProps = {
  id: string
  label: string
  icon: LucideIcon
  error?: string
  trailing?: React.ReactNode
  children: React.ReactNode
}

function Field({
  id,
  label,
  icon: Icon,
  error,
  trailing,
  children,
}: FieldProps) {
  const errorId = `${id}-error`
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        {children}
        {trailing ? (
          <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
            {trailing}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
