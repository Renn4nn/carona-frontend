"use client"

import { useRouter } from "next/navigation"
import { CalendarDays, MapPin, Search } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LandingSearch({ authenticated }: { authenticated: boolean }) {
  const router = useRouter()
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("")

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
    <form onSubmit={submit} className="grid gap-3 rounded-[1.75rem] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur md:grid-cols-[1fr_1fr_0.75fr_auto]" aria-label="Buscar carona">
      <SearchField icon={MapPin} label="Saindo de">
        <Input value={origin} onChange={(event) => setOrigin(event.target.value)} placeholder="Bairro ou região" className="border-0 bg-transparent px-0 text-white placeholder:text-white/45 focus-visible:ring-0" />
      </SearchField>
      <SearchField icon={MapPin} label="Indo para">
        <Input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Universidade ou região" className="border-0 bg-transparent px-0 text-white placeholder:text-white/45 focus-visible:ring-0" />
      </SearchField>
      <SearchField icon={CalendarDays} label="Quando">
        <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="border-0 bg-transparent px-0 text-white scheme-dark focus-visible:ring-0" />
      </SearchField>
      <Button type="submit" size="lg" className="h-full min-h-14 rounded-2xl px-7"><Search aria-hidden="true" />Buscar</Button>
    </form>
  )
}

function SearchField({ icon: Icon, label, children }: { icon: typeof MapPin; label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-h-16 items-center gap-3 rounded-2xl bg-white/8 px-4">
      <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wider text-white/55">{label}</span>
        {children}
      </span>
    </label>
  )
}
