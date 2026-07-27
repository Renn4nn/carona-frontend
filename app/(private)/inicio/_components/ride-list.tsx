import { CalendarClock, CarFront, MapPin, UsersRound } from "lucide-react"

import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { MockRide } from "@/lib/types/domain"

type RideListProps = {
  title: string
  description: string
  rides: MockRide[]
  offered?: boolean
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
})

export function RideList({
  title,
  description,
  rides,
  offered,
}: RideListProps) {
  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rides.map((ride) => (
          <Card key={ride.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <CarFront className="size-4" />
                </span>
                {offered ? "Carona que você oferece" : ride.driverName}
              </CardTitle>
              <CardDescription>
                {ride.availableSeats} de {ride.totalSeats} vagas disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 text-sm">
                <Info icon={MapPin}>
                  {ride.origin} <span className="text-primary">→</span>{" "}
                  {ride.destination}
                </Info>
                <Info icon={CalendarClock}>
                  {dateFormatter.format(new Date(ride.departureAt))}
                </Info>
                <Info icon={UsersRound}>
                  {ride.participants.length} participante(s)
                </Info>
              </div>

              {offered && ride.participants.length > 0 && (
                <div className="flex items-center justify-between gap-4 border-t pt-4">
                  <AvatarGroup>
                    {ride.participants.map((participant) => (
                      <Avatar key={participant.id}>
                        <AvatarFallback>
                          {participant.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  <div className="flex flex-wrap justify-end gap-2">
                    {ride.participants.map((participant) => (
                      <Badge
                        key={participant.id}
                        variant={
                          participant.status === "ACCEPTED"
                            ? "default"
                            : "outline"
                        }
                      >
                        {participant.name.split(" ")[0]} ·{" "}
                        {participant.status === "ACCEPTED"
                          ? "aceito"
                          : "pendente"}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function Info({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 text-muted-foreground">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <span>{children}</span>
    </div>
  )
}
