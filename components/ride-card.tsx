import Link from "next/link"
import { ArrowRight, CalendarClock, MapPin, UsersRound, WalletCards } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { PublicRide } from "@/lib/schemas/ride.schema"

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
})

const moneyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function RideCard({ ride, href, privateView = false }: { ride: PublicRide; href: string; privateView?: boolean }) {
  return (
    <Link href={href} className="group block h-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
      <Card className="h-full overflow-hidden transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        <CardContent className="flex h-full flex-col gap-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <Badge variant={ride.isFull ? "outline" : "default"}>{ride.isFull ? "Lotada" : "Disponível"}</Badge>
            <span className="text-xs font-medium text-muted-foreground">{ride.status.name}</span>
          </div>

          <div className="space-y-3">
            <RoutePoint label="Saída" value={ride.originName} />
            <div className="ml-2 h-4 border-l border-dashed border-primary" />
            <RoutePoint label="Destino" value={ride.destinationName} />
          </div>

          <div className="grid gap-3 border-t pt-4 text-sm text-muted-foreground sm:grid-cols-2">
            <Info icon={CalendarClock}>{dateFormatter.format(new Date(ride.departureAt))}</Info>
            <Info icon={UsersRound}>{ride.availableSeats} de {ride.totalSeats} vagas</Info>
            <Info icon={WalletCards}>
              {Number(ride.contributionPerSeat) === 0 ? "Gratuita" : `${moneyFormatter.format(Number(ride.contributionPerSeat))} por vaga`}
            </Info>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-sm font-semibold">
            <span>{privateView ? "Ver detalhes da carona" : "Entre para ver os detalhes"}</span>
            <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function RoutePoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
        <MapPin className="size-3" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-semibold">{value}</p>
      </div>
    </div>
  )
}

function Info({ icon: Icon, children }: { icon: typeof CalendarClock; children: React.ReactNode }) {
  return <span className="flex items-center gap-2"><Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />{children}</span>
}
