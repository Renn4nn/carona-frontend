"use client"

import { usePathname, useRouter } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"
import { useCallback, useEffect, useRef, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Values = { origin: string; destination: string; departureFrom: string }

export function RideFilters({ initial }: { initial: Values }) {
  const router = useRouter()
  const pathname = usePathname()
  const [values, setValues] = useState(initial)
  const [hasSubmitted, setHasSubmitted] = useState(Object.values(initial).some(Boolean))
  const [pending, startTransition] = useTransition()
  const firstRender = useRef(true)

  const targetUrl = useCallback((next: Values) => {
    const params = new URLSearchParams()
    if (next.origin.trim()) params.set("origin", next.origin.trim())
    if (next.destination.trim()) params.set("destination", next.destination.trim())
    if (next.departureFrom) params.set("departureFrom", new Date(next.departureFrom).toISOString())
    return `${pathname}${params.size ? `?${params}` : ""}`
  }, [pathname])

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setHasSubmitted(true)
    startTransition(() => router.push(targetUrl(values)))
  }

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    if (!hasSubmitted) return
    const timeout = window.setTimeout(() => startTransition(() => router.replace(targetUrl(values))), 450)
    return () => window.clearTimeout(timeout)
  }, [hasSubmitted, router, targetUrl, values])

  return (
    <form onSubmit={submit} className="rounded-3xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-2"><SlidersHorizontal className="size-5 text-primary" /><h2 className="font-semibold">Filtre seu trajeto</h2></div>
      <div className="grid gap-4 md:grid-cols-3">
        <Field id="search-origin" label="Saindo de"><Input id="search-origin" value={values.origin} onChange={(event) => setValues((current) => ({ ...current, origin: event.target.value }))} placeholder="Bairro ou região" /></Field>
        <Field id="search-destination" label="Indo para"><Input id="search-destination" value={values.destination} onChange={(event) => setValues((current) => ({ ...current, destination: event.target.value }))} placeholder="Campus ou região" /></Field>
        <Field id="search-date" label="A partir de"><Input id="search-date" type="datetime-local" value={values.departureFrom} onChange={(event) => setValues((current) => ({ ...current, departureFrom: event.target.value }))} /></Field>
      </div>
      <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto" disabled={pending}><Search />{pending ? "Buscando..." : "Buscar caronas"}</Button>
    </form>
  )
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}</div>
}
