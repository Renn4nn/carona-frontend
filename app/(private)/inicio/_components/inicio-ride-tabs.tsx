"use client"

import Link from "next/link"
import { useState } from "react"

import { EmptyState } from "@/components/empty-state"
import { RideCard } from "@/components/ride-card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PublicRide } from "@/lib/schemas/ride.schema"

type RideGroup = { rides: PublicRide[]; error?: string }

const tabs = [
  { id: "available", label: "Disponíveis", title: "Caronas disponíveis", description: "Trajetos abertos para você encontrar seu caminho." },
  { id: "participations", label: "Minhas participações", title: "Suas participações", description: "Solicitações e vagas que você acompanha." },
  { id: "offered", label: "Minhas caronas", title: "Caronas que você oferece", description: "Acompanhe passageiros e o andamento das suas publicações." },
] as const

export function InicioRideTabs({ available, participations, offered }: { available: RideGroup; participations: RideGroup; offered: RideGroup }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("available")
  const current = { available, participations, offered }[active]
  const tab = tabs.find((item) => item.id === active)!

  return (
    <section className="mt-10">
      <div className="flex gap-2 overflow-x-auto border-b pb-3 [scrollbar-width:none]">
        {tabs.map((item) => (
          <button key={item.id} type="button" onClick={() => setActive(item.id)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition", active === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-5 mt-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{tab.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{tab.description}</p>
        </div>
        {active === "available" && current.rides.length > 0 ? <Link href="/buscar-carona" className={buttonVariants({ variant: "ghost" })}>Ver mais</Link> : null}
      </div>

      {current.error ? <EmptyState title="Não foi possível carregar" description={current.error} /> : current.rides.length === 0 ? <EmptyState title="Nada por aqui ainda" description="Quando houver informações, elas aparecerão automaticamente." /> : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{current.rides.slice(0, 6).map((ride) => <RideCard key={ride.id} ride={ride} href={`/caronas/${ride.id}`} privateView />)}</div>}
    </section>
  )
}
