"use client"

import { CheckCircle2 } from "lucide-react"
import { useState } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { MockStudentProfile } from "@/lib/types/domain"

export function StudentProfileForm({
  profile,
}: {
  profile: MockStudentProfile
}) {
  const [saved, setSaved] = useState(false)

  function submitMock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaved(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil acadêmico</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitMock} className="grid gap-5 sm:grid-cols-2">
          <ProfileField id="full-name" label="Nome completo">
            <Input id="full-name" defaultValue={profile.fullName} />
          </ProfileField>
          <ProfileField id="email" label="E-mail institucional">
            <Input
              id="email"
              type="email"
              defaultValue={profile.institutionalEmail}
            />
          </ProfileField>
          <ProfileField id="university" label="Universidade">
            <Input id="university" defaultValue={profile.universityName} />
          </ProfileField>
          <ProfileField id="course" label="Curso">
            <Input id="course" defaultValue={profile.courseName} />
          </ProfileField>
          <ProfileField id="registration" label="Matrícula">
            <Input
              id="registration"
              defaultValue={profile.registrationNumber}
            />
          </ProfileField>
          <div className="flex items-end">
            <Button type="submit" className="w-full sm:w-auto">
              Salvar alterações
            </Button>
          </div>
        </form>

        {saved && (
          <Alert className="mt-5 border-primary/40 bg-primary/10">
            <CheckCircle2 />
            <AlertDescription>
              Alterações aplicadas nesta demonstração. A persistência será
              habilitada quando o perfil acadêmico existir no backend.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

function ProfileField({
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
