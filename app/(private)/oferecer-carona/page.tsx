import Link from "next/link"
import { CarFront } from "lucide-react"

import { listVehiclesAction } from "@/actions/vehicle.actions"
import { OfferRideForm } from "@/app/(private)/oferecer-carona/_components/offer-ride-form"
import { EmptyState } from "@/components/empty-state"
import { PageHeading } from "@/components/page-heading"
import { buttonVariants } from "@/components/ui/button"
import { requireSession } from "@/lib/auth/session"

export default async function OfferRidePage() {
  await requireSession()
  const vehiclesResult = await listVehiclesAction()
  const activeVehicles =
    vehiclesResult.data?.filter((vehicle) => vehicle.active) ?? []

  return (
    <>
      <PageHeading
        eyebrow="Compartilhe seu caminho"
        title="Ofereça uma carona"
        description="Publique seu trajeto e combine os detalhes diretamente com outros estudantes."
      />
      {vehiclesResult.error ? (
        <div className="mt-8">
          <EmptyState
            title="Não foi possível preparar o formulário"
            description={vehiclesResult.error}
          />
        </div>
      ) : activeVehicles.length === 0 ? (
        <div className="mt-8 rounded-3xl border bg-card p-8 text-center">
          <CarFront className="mx-auto size-10 text-primary" />
          <h2 className="mt-5 text-xl font-semibold">
            Cadastre um veículo ativo primeiro
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Precisamos conhecer a capacidade do veículo antes de publicar a
            carona.
          </p>
          <Link
            href="/perfil#veiculos"
            className={`${buttonVariants({ size: "lg" })} mt-6`}
          >
            Cadastrar veículo
          </Link>
        </div>
      ) : (
        <OfferRideForm vehicles={activeVehicles} />
      )}
    </>
  )
}
