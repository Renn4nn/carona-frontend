import { LogOut } from "lucide-react"

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

  return (
    <>
      <PageHeading eyebrow={session.role} title="Seu perfil" description="Gerencie seu vínculo acadêmico e os veículos usados nas suas caronas." action={<form action={logoutAction}><Button type="submit" variant="outline"><LogOut aria-hidden="true" />Sair da conta</Button></form>} />
      <div className="mt-8 space-y-6">
        {loadError ? <EmptyState title="Não foi possível carregar seu perfil" description={loadError} /> : <><StudentProfileForm profile={profileResult.data ?? null} universities={universitiesResult.data ?? []} courses={coursesResult.data ?? []} /><VehicleSettings vehicles={vehiclesResult.data ?? []} /></>}
      </div>
    </>
  )
}
