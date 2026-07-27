import { RideList } from "@/app/(private)/inicio/_components/ride-list"
import { RidePlanner } from "@/app/(private)/inicio/_components/ride-planner"
import { PageHeading } from "@/components/page-heading"
import { requireSession } from "@/lib/auth/session"
import { offeredRidesMock, participatingRidesMock } from "@/mock"

export default async function InicioPage() {
  const session = await requireSession()

  return (
    <>
      <PageHeading
        eyebrow={`Olá, ${session.login}`}
        title="Para onde vamos hoje?"
        description="Encontre uma carona para o campus ou compartilhe seu trajeto com outros estudantes."
      />
      <RidePlanner />
      <RideList
        title="Caronas que você participa"
        description="Acompanhe os próximos trajetos em que sua vaga foi solicitada."
        rides={participatingRidesMock}
      />
      <RideList
        title="Caronas que você oferece"
        description="Veja participantes e informações dos seus próximos trajetos."
        rides={offeredRidesMock}
        offered
      />
    </>
  )
}
