"use client"

import { CalendarDays, CarFront, MapPin, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LandingSearch({ authenticated }: { authenticated: boolean }) {
  const router = useRouter()
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("")
  const offerRideUrl = authenticated ? "/oferecer-carona" : "/login?next=%2Foferecer-carona"

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (origin.trim()) params.set("origin", origin.trim())
    if (destination.trim()) params.set("destination", destination.trim())
    if (date) params.set("departureFrom", new Date(`${date}T00:00:00`).toISOString())
    const target = `/buscar-carona${params.size ? `?${params}` : ""}`
    router.push(authenticated ? target : `/login?next=${encodeURIComponent(target)}`)
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md" aria-label="Buscar carona">
      <div className="relative space-y-2">
        <span className="absolute left-6 top-11 h-16 border-l border-border" aria-hidden="true" />
        <SearchField icon={MapPin} label="Local de partida">
          <Input
            value={origin}
            onChange={(event) => setOrigin(event.target.value)}
            placeholder="Bairro ou endereço"
            className="h-6 border-0 bg-transparent p-0 text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
          />
        </SearchField>
        <SearchField icon={MapPin} label="Local de chegada">
          <Input
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="Universidade ou endereço"
            className="h-6 border-0 bg-transparent p-0 text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
          />
        </SearchField>
      </div>

      <label className="mt-3 flex min-h-14 items-center gap-3 rounded-lg border bg-muted/30 px-4 text-foreground">
        <CalendarDays className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-muted-foreground">Quando</span>
          <Input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-6 border-0 bg-transparent p-0 text-foreground shadow-none focus-visible:ring-0"
          />
        </span>
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" className="h-12 rounded-lg px-6">
          <Search aria-hidden="true" />
          Buscar carona
        </Button>
        <Link
          href={offerRideUrl}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-foreground underline decoration-muted-foreground/50 underline-offset-4 hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          Ou ofereça uma carona
          <CarFront className="size-4 shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </form>
  )
}

function SearchField({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="relative z-10 flex min-h-16 items-center gap-3 rounded-lg border bg-muted/30 px-4 text-foreground">
      <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-muted-foreground">{label}</span>
        {children}
      </span>
    </label>
  )
}