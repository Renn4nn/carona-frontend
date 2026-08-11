import Link from "next/link"

import { listRidesAction } from "@/actions/ride.actions"
import { RideFilters } from "@/app/(private)/buscar-carona/_components/ride-filters"
import { EmptyState } from "@/components/empty-state"
import { PageHeading } from "@/components/page-heading"
import { RideCard } from "@/components/ride-card"
import { buttonVariants } from "@/components/ui/button"
import { requireSession } from "@/lib/auth/session"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function single(value: string | string[] | undefined) { return typeof value === "string" ? value : "" }
function localDateTime(value: string) {
  if (!value) return ""
  const date = new Date(value)
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export default async function SearchRidePage({ searchParams }: { searchParams: SearchParams }) {
  await requireSession()
  const params = await searchParams
  const query = {
    origin: single(params.origin) || undefined,
    destination: single(params.destination) || undefined,
    departureFrom: single(params.departureFrom) || undefined,
    maxContribution: single(params.maxContribution) || undefined,
    cursor: single(params.cursor) || undefined,
    limit: 12,
    availableOnly: "true" as const,
  }
  const result = await listRidesAction(query)
  const rides = result.data?.items ?? []
  const pageInfo = result.data?.pageInfo

  return (
    <>
      <PageHeading eyebrow="Descobrir caronas" title="Encontre um trajeto que combina com você" description="Pesquise por regiões aproximadas, horário e contribuição. Os detalhes ficam disponíveis nesta área protegida." />
      <div className="mt-8"><RideFilters initial={{ origin: query.origin ?? "", destination: query.destination ?? "", departureFrom: localDateTime(query.departureFrom ?? ""), maxContribution: query.maxContribution ?? "" }} /></div>
      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="text-xl font-semibold">Resultados</h2><p className="mt-1 text-sm text-muted-foreground">Caronas abertas e com disponibilidade.</p></div></div>
        {result.error ? <EmptyState title="Não foi possível buscar caronas" description={result.error} /> : rides.length === 0 ? <EmptyState title="Nenhum trajeto encontrado" description="Altere os filtros ou tente novamente mais tarde." /> : (
          <><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{rides.map((ride) => <RideCard key={ride.id} ride={ride} href={`/caronas/${ride.id}`} privateView />)}</div>
          {pageInfo?.hasNextPage && pageInfo.nextCursor ? <div className="mt-8 text-center"><Link className={buttonVariants({ variant: "outline", size: "lg" })} href={{ pathname: "/buscar-carona", query: { ...query, cursor: pageInfo.nextCursor } }}>Próxima página</Link></div> : null}</>
        )}
      </section>
    </>
  )
}
