import Link from "next/link"
import { ArrowRight, CarFront, Search } from "lucide-react"

import { listMyParticipationsAction } from "@/actions/participation.actions"
import { listMineRidesAction, listRidesAction } from "@/actions/ride.actions"
import { EmptyState } from "@/components/empty-state"
import { PageHeading } from "@/components/page-heading"
import { RideCard } from "@/components/ride-card"
import { buttonVariants } from "@/components/ui/button"
import { requireSession } from "@/lib/auth/session"
import type { PublicRide } from "@/lib/schemas/ride.schema"

export default async function InicioPage() {
  const session = await requireSession()
  const [available, offered, participations] = await Promise.all([
    listRidesAction({ limit: 6, availableOnly: "true" }),
    listMineRidesAction("driver"),
    listMyParticipationsAction(),
  ])

  return (
    <>
      <PageHeading eyebrow={`Olá, ${session.login}`} title="Para onde vamos hoje?" description="Encontre uma carona para o campus ou compartilhe seu trajeto com outros estudantes." />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <ActionCard href="/buscar-carona" icon={Search} title="Buscar carona" description="Filtre rotas e horários disponíveis." />
        <ActionCard href="/oferecer-carona" icon={CarFront} title="Oferecer carona" description="Publique os lugares livres no seu próximo trajeto." />
      </div>
      <RideSection title="Caronas disponíveis" description="Trajetos abertos no sistema." rides={available.data?.items ?? []} error={available.error} />
      <RideSection title="Suas participações" description="Solicitações e vagas que você acompanha." rides={participations.data?.items.map((item) => item.ride) ?? []} error={participations.error} />
      <RideSection title="Caronas que você oferece" description="Acompanhe passageiros e o andamento das suas publicações." rides={offered.data?.items ?? []} error={offered.error} />
    </>
  )
}

function ActionCard({ href, icon: Icon, title, description }: { href: string; icon: typeof Search; title: string; description: string }) { return <Link href={href} className="group flex items-center gap-5 rounded-3xl border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary"><Icon className="size-5" /></span><span className="min-w-0 flex-1"><span className="font-semibold">{title}</span><span className="mt-1 block text-sm text-muted-foreground">{description}</span></span><ArrowRight className="size-5 transition group-hover:translate-x-1" /></Link> }
function RideSection({ title, description, rides, error }: { title: string; description: string; rides: PublicRide[]; error?: string }) { return <section className="mt-12"><div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>{rides.length > 0 ? <Link href="/buscar-carona" className={buttonVariants({ variant: "ghost" })}>Ver mais</Link> : null}</div>{error ? <EmptyState title="Não foi possível carregar" description={error} /> : rides.length === 0 ? <EmptyState title="Nada por aqui ainda" description="Quando houver informações, elas aparecerão automaticamente." /> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{rides.slice(0, 6).map((ride) => <RideCard key={ride.id} ride={ride} href={`/caronas/${ride.id}`} privateView />)}</div>}</section> }
