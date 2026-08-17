import { CalendarClock, CarFront, MapPin, UsersRound, WalletCards } from "lucide-react"

import { listMyParticipationsAction, listRideParticipantsAction } from "@/actions/participation.actions"
import { getRideAction } from "@/actions/ride.actions"
import { RideActions } from "@/app/(private)/caronas/[id]/_components/ride-actions"
import { EmptyState } from "@/components/empty-state"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { requireSession } from "@/lib/auth/session"

export default async function RideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, requireSession()])
  const rideResult = await getRideAction(id)
  if ("error" in rideResult) return <EmptyState title="Não foi possível abrir esta carona" description={rideResult.error ?? "Tente novamente."} />
  const ride = rideResult.data
  const isDriver = ride.driver.id === session.userId
  const [participantsResult, mineResult] = await Promise.all([
    isDriver ? listRideParticipantsAction(id) : Promise.resolve({ data: [] }),
    isDriver ? Promise.resolve({ data: { items: [], pageInfo: { nextCursor: null, hasNextPage: false } } }) : listMyParticipationsAction(),
  ])
  const myParticipation = mineResult.data?.items.find((item) => item.rideId === id)
  const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short" }).format(new Date(ride.departureAt))
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Detalhes da carona</p><h1 className="mt-3 break-words text-2xl font-semibold sm:text-3xl">{ride.originAddress} <span className="text-primary">→</span> {ride.destinationAddress}</h1><p className="mt-3 text-muted-foreground">Motorista: {ride.driver.login}</p></div><Badge variant={ride.status.code === "OPEN" ? "default" : "outline"}>{ride.status.name}</Badge></div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <Card><CardContent className="space-y-6 p-6"><Detail icon={MapPin} label="Origem" value={ride.originAddress} /><Detail icon={MapPin} label="Destino" value={ride.destinationAddress} /><Detail icon={CalendarClock} label="Partida" value={date} />{ride.estimatedArrivalAt ? <Detail icon={CalendarClock} label="Chegada estimada" value={new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(ride.estimatedArrivalAt))} /> : null}</CardContent></Card>
        <Card><CardContent className="space-y-6 p-6"><Detail icon={CarFront} label="Veículo" value={`${ride.vehicle.brand} ${ride.vehicle.model} · ${ride.vehicle.color} · ${ride.vehicle.year}`} /><Detail icon={UsersRound} label="Vagas" value={`${ride.availableSeats} de ${ride.totalSeats} disponíveis`} /><Detail icon={WalletCards} label="Valor" value="R$ 0,15 por km, com mínimo de R$ 5,00 por passageiro" /></CardContent></Card>
      </div>
      {ride.notes ? <section className="mt-5"><TextBlock title="Observação" text={ride.notes} /></section> : null}
      <div className="mt-8"><RideActions ride={ride} isDriver={isDriver} myParticipation={myParticipation} participants={participantsResult.data ?? []} /></div>
    </div>
  )
}

function Detail({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) { return <div className="flex gap-3"><Icon className="mt-1 size-5 shrink-0 text-primary" /><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div></div> }
function TextBlock({ title, text }: { title: string; text: string }) { return <article className="rounded-3xl border bg-card p-5"><h2 className="font-semibold">{title}</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{text}</p></article> }
