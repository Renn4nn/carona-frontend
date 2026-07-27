import { LogOut } from "lucide-react"

import { logoutAction } from "@/actions/auth.actions"
import { AddressSettings } from "@/app/(private)/perfil/_components/address-settings"
import { StudentProfileForm } from "@/app/(private)/perfil/_components/student-profile-form"
import { VehicleSettings } from "@/app/(private)/perfil/_components/vehicle-settings"
import { PageHeading } from "@/components/page-heading"
import { Button } from "@/components/ui/button"
import { requireSession } from "@/lib/auth/session"
import {
  favoriteAddressesMock,
  studentProfileMock,
  vehiclesMock,
} from "@/mock"

export default async function PerfilPage() {
  const session = await requireSession()

  return (
    <>
      <PageHeading
        eyebrow={session.role}
        title="Seu perfil"
        description="Gerencie seus dados acadêmicos e as preferências usadas nas suas caronas."
        action={
          <form action={logoutAction}>
            <Button type="submit" variant="outline">
              <LogOut aria-hidden="true" />
              Sair da conta
            </Button>
          </form>
        }
      />

      <div className="mt-8 space-y-6">
        <StudentProfileForm profile={studentProfileMock} />
        <VehicleSettings vehicles={vehiclesMock} />
        <AddressSettings addresses={favoriteAddressesMock} />
      </div>
    </>
  )
}
