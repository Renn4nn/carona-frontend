"use client"

import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2, GraduationCap } from "lucide-react"
import { useMemo, useState } from "react"

import {
  saveStudentProfileAction,
  setStudentProfileActiveAction,
} from "@/actions/student-profile.actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import type { Course, University } from "@/lib/schemas/catalog.schema"
import type { StudentProfile } from "@/lib/schemas/student-profile.schema"

export function StudentProfileForm({
  profile,
  universities,
  courses,
}: {
  profile: StudentProfile | null
  universities: University[]
  courses: Course[]
}) {
  const router = useRouter()
  const initialUniversityId =
    profile?.course.universityId ?? universities[0]?.id ?? ""
  const [universityId, setUniversityId] = useState(initialUniversityId)
  const filteredCourses = useMemo(
    () => courses.filter((course) => course.universityId === universityId),
    [courses, universityId]
  )
  const [courseId, setCourseId] = useState(
    profile?.courseId ?? filteredCourses[0]?.id ?? ""
  )
  const selectedUniversity = useMemo(
    () => universities.find((university) => university.id === universityId),
    [universities, universityId]
  )
  const selectedCourse = useMemo(
    () => filteredCourses.find((course) => course.id === courseId),
    [filteredCourses, courseId]
  )
  const [pending, setPending] = useState(false)
  const [feedback, setFeedback] = useState<{
    kind: "error" | "success"
    text: string
  }>()

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setFeedback(undefined)

    const form = new FormData(event.currentTarget)
    const result = await saveStudentProfileAction(
      {
        name: String(form.get("name") ?? ""),
        courseId,
        registration: String(form.get("registration") ?? ""),
      },
      Boolean(profile)
    )

    setPending(false)
    if (result.error) {
      setFeedback({ kind: "error", text: result.error })
    } else {
      setFeedback({ kind: "success", text: "Perfil acadêmico salvo." })
      router.refresh()
    }
  }

  async function toggleActive() {
    if (!profile) return

    setPending(true)
    setFeedback(undefined)
    const result = await setStudentProfileActiveAction(!profile.active)
    setPending(false)

    if (result.error) {
      setFeedback({ kind: "error", text: result.error })
    } else {
      setFeedback({
        kind: "success",
        text: profile.active
          ? "Perfil acadêmico desativado."
          : "Perfil acadêmico reativado.",
      })
      router.refresh()
    }
  }

  return (
    <Card id="perfil-academico">
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="size-5 text-primary" />
            Perfil acadêmico
          </CardTitle>
          {profile ? (
            <Badge variant={profile.active ? "default" : "outline"}>
              {profile.active ? "Ativo" : "Inativo"}
            </Badge>
          ) : (
            <Badge variant="outline">Não cadastrado</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        {!profile ? (
          <p className="mb-5 text-sm leading-6 text-muted-foreground">
            Complete seu vínculo acadêmico para manter seu perfil preparado para
            recursos exclusivos da comunidade.
          </p>
        ) : null}
        {feedback ? (
          <Alert
            className="mb-5"
            variant={feedback.kind === "error" ? "destructive" : "default"}
          >
            {feedback.kind === "error" ? <AlertCircle /> : <CheckCircle2 />}
            <AlertDescription>{feedback.text}</AlertDescription>
          </Alert>
        ) : null}
        <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
          <Field id="profile-name" label="Nome completo">
            <Input
              id="profile-name"
              name="name"
              defaultValue={profile?.name ?? ""}
              maxLength={120}
              required
            />
          </Field>

          <Field id="university" label="Universidade">
            <Select
              value={universityId}
              onValueChange={(value) => {
                if (!value) return
                setUniversityId(value)
                setCourseId(
                  courses.find((course) => course.universityId === value)?.id ??
                    ""
                )
              }}
            >
              <SelectTrigger id="university" className="w-full">
                <span className="line-clamp-1 flex-1 text-left">
                  {selectedUniversity
                    ? `${selectedUniversity.name} - ${selectedUniversity.city}/${selectedUniversity.state}`
                    : "Selecione"}
                </span>
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                {universities.map((university) => (
                  <SelectItem key={university.id} value={university.id}>
                    {university.name} - {university.city}/{university.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field id="course" label="Curso">
            <Select
              value={courseId}
              onValueChange={(value) => value && setCourseId(value)}
              disabled={!universityId}
            >
              <SelectTrigger id="course" className="w-full">
                <span className="line-clamp-1 flex-1 text-left">
                  {selectedCourse ? selectedCourse.name : "Selecione"}
                </span>
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                {filteredCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field id="registration" label="Matrícula">
            <Input
              id="registration"
              name="registration"
              defaultValue={profile?.registration ?? ""}
              maxLength={50}
              required
            />
          </Field>

          <div className="flex flex-wrap items-end gap-3">
            <Button type="submit" disabled={pending || !courseId}>
              {pending
                ? "Salvando..."
                : profile
                  ? "Salvar alterações"
                  : "Criar perfil acadêmico"}
            </Button>
            {profile ? (
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={toggleActive}
              >
                {profile.active ? "Desativar" : "Reativar"}
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function Field({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}
