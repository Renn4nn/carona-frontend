import { ArrowRight, CarFront, Search } from "lucide-react"

import { listMyParticipationsAction } from "@/actions/participation.actions"
import { listMineRidesAction, listRidesAction } from "@/actions/ride.actions"
import { getStudentProfileAction } from "@/actions/student-profile.actions"
import { InicioRideTabs } from "@/app/(private)/inicio/_components/inicio-ride-tabs"
import { PageHeading } from "@/components/page-heading"
import { requireSession } from "@/lib/auth/session"
import Link from "next/link"

export default async function InicioPage() {
  const session = await requireSession()
  const [available, offered, participations, profileResult] = await Promise.all([
    listRidesAction({ limit: 6, availableOnly: "true" }),
    listMineRidesAction("driver"),
    listMyParticipationsAction(),
    getStudentProfileAction(),
  ])
  const name = profileResult.data?.name ?? session.login

  return (
    <>
      <PageHeading
        eyebrow={`Olá, ${name}`}
        title="Para onde vamos hoje?"
        description="Encontre uma carona para o campus ou compartilhe seu trajeto com outros estudantes."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <ActionCard
          href="/buscar-carona"
          icon={Search}
          title="Buscar carona"
          description="Filtre rotas e horários disponíveis."
        />
        <ActionCard
          href="/oferecer-carona"
          icon={CarFront}
          title="Oferecer carona"
          description="Publique os lugares livres no seu próximo trajeto."
        />
      </div>
      <InicioRideTabs
        available={{ rides: available.data?.items ?? [], error: available.error }}
        participations={{ rides: participations.data?.items.map((item) => item.ride) ?? [], error: participations.error }}
        offered={{ rides: offered.data?.items ?? [], error: offered.error }}
      />
    </>
  )
}

function ActionCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string
  icon: typeof Search
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-5 rounded-3xl border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-semibold">{title}</span>
        <span className="mt-1 block text-sm text-muted-foreground">
          {description}
        </span>
      </span>
      <ArrowRight className="size-5 transition group-hover:translate-x-1" />
    </Link>
  )
}
