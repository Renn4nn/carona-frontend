import { GraduationCap, LogOut, UserRound } from "lucide-react"

import { logoutAction } from "@/actions/auth.actions"
import { listCoursesAction, listUniversitiesAction } from "@/actions/catalog.actions"
import { getStudentProfileAction } from "@/actions/student-profile.actions"
import { listVehiclesAction } from "@/actions/vehicle.actions"
import { StudentProfileForm } from "@/app/(private)/perfil/_components/student-profile-form"
import { VehicleSettings } from "@/app/(private)/perfil/_components/vehicle-settings"
import { EmptyState } from "@/components/empty-state"
import { PageHeading } from "@/components/page-heading"
import { Button } from "@/components/ui/button"
import { requireSession } from "@/lib/auth/session"

export default async function PerfilPage() {
  const session = await requireSession()
  const [profileResult, universitiesResult, coursesResult, vehiclesResult] = await Promise.all([
    getStudentProfileAction(),
    listUniversitiesAction(),
    listCoursesAction(),
    listVehiclesAction(),
  ])
  const loadError = profileResult.error ?? universitiesResult.error ?? coursesResult.error ?? vehiclesResult.error

  const profile = profileResult.data ?? null
  const initials = profile?.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase() ?? session.login.slice(0, 2).toUpperCase()

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeading eyebrow={session.role} title="Seu perfil" description="Gerencie seu vínculo acadêmico e os veículos usados nas suas caronas." action={<form action={logoutAction}><Button type="submit" variant="outline"><LogOut aria-hidden="true" />Sair da conta</Button></form>} />
      <section className="mt-8 rounded-3xl border bg-card px-6 py-8 text-center shadow-sm sm:px-10">
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground ring-4 ring-primary/15">
          {initials}
        </span>
        <h2 className="mt-4 text-xl font-semibold">{profile?.name ?? "Complete seu perfil"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{profile ? `${profile.course.name} · ${profile.course.university.name}` : "Adicione seu vínculo acadêmico para começar"}</p>
        <div className="mx-auto mt-6 grid max-w-md grid-cols-2 divide-x rounded-2xl bg-muted/70 py-3">
          <div className="px-4"><GraduationCap className="mx-auto size-4 text-primary" aria-hidden="true" /><p className="mt-1 text-xs text-muted-foreground">Perfil acadêmico</p><p className="text-sm font-semibold">{profile?.active ? "Ativo" : "Pendente"}</p></div>
          <div className="px-4"><UserRound className="mx-auto size-4 text-primary" aria-hidden="true" /><p className="mt-1 text-xs text-muted-foreground">Veículos</p><p className="text-sm font-semibold">{vehiclesResult.data?.length ?? 0} cadastrado{(vehiclesResult.data?.length ?? 0) === 1 ? "" : "s"}</p></div>
        </div>
      </section>
      <div className="mt-6 space-y-6">
        {loadError ? <EmptyState title="Não foi possível carregar seu perfil" description={loadError} /> : <><StudentProfileForm profile={profile} universities={universitiesResult.data ?? []} courses={coursesResult.data ?? []} /><VehicleSettings vehicles={vehiclesResult.data ?? []} /></>}
      </div>
    </div>
  )
}
