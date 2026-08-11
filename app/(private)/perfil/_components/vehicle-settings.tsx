"use client"

import { useRouter } from "next/navigation"
import { AlertCircle, CarFront, CheckCircle2, Plus, X } from "lucide-react"
import { useState } from "react"

import { createVehicleAction, setVehicleActiveAction, updateVehicleAction } from "@/actions/vehicle.actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Vehicle } from "@/lib/schemas/vehicle.schema"

export function VehicleSettings({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<Vehicle | "new" | null>(null)
  const [pending, setPending] = useState(false)
  const [feedback, setFeedback] = useState<{ kind: "error" | "success"; text: string }>()

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setFeedback(undefined)
    const form = new FormData(event.currentTarget)
    const input = { brand: String(form.get("brand") ?? ""), model: String(form.get("model") ?? ""), color: String(form.get("color") ?? ""), plate: String(form.get("plate") ?? ""), year: String(form.get("year") ?? ""), passengerCapacity: String(form.get("passengerCapacity") ?? "") }
    const result = editing && editing !== "new" ? await updateVehicleAction(editing.id, input) : await createVehicleAction(input)
    setPending(false)
    if (result.error) setFeedback({ kind: "error", text: result.error })
    else { setFeedback({ kind: "success", text: editing === "new" ? "Veículo cadastrado." : "Veículo atualizado." }); setEditing(null); router.refresh() }
  }

  async function toggle(vehicle: Vehicle) {
    setPending(true); setFeedback(undefined)
    const result = await setVehicleActiveAction(vehicle.id, !vehicle.active)
    setPending(false)
    if (result.error) setFeedback({ kind: "error", text: result.error })
    else { setFeedback({ kind: "success", text: vehicle.active ? "Veículo desativado." : "Veículo reativado." }); router.refresh() }
  }

  return (
    <Card id="veiculos">
      <CardHeader className="border-b"><div className="flex flex-wrap items-center justify-between gap-3"><CardTitle>Veículos cadastrados</CardTitle><Button size="sm" onClick={() => setEditing("new")}><Plus />Cadastrar veículo</Button></div></CardHeader>
      <CardContent className="space-y-5 p-5 sm:p-6">
        {feedback ? <Alert variant={feedback.kind === "error" ? "destructive" : "default"}>{feedback.kind === "error" ? <AlertCircle /> : <CheckCircle2 />}<AlertDescription>{feedback.text}</AlertDescription></Alert> : null}
        {editing ? <VehicleForm vehicle={editing === "new" ? undefined : editing} pending={pending} onSubmit={submit} onCancel={() => setEditing(null)} /> : null}
        {vehicles.length === 0 ? <div className="rounded-2xl border border-dashed p-8 text-center"><CarFront className="mx-auto size-8 text-primary" /><p className="mt-4 font-semibold">Nenhum veículo cadastrado</p><p className="mt-2 text-sm text-muted-foreground">Cadastre um veículo para poder oferecer caronas.</p></div> : vehicles.map((vehicle) => <div key={vehicle.id} className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><span className="flex size-11 items-center justify-center rounded-2xl bg-primary/15"><CarFront className="size-5" /></span><div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{vehicle.brand} {vehicle.model}</p><Badge variant={vehicle.active ? "default" : "outline"}>{vehicle.active ? "Ativo" : "Inativo"}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{vehicle.plate} · {vehicle.color} · {vehicle.year} · {vehicle.passengerCapacity} passageiros</p></div></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setEditing(vehicle)}>Editar</Button><Button variant="outline" size="sm" disabled={pending} onClick={() => toggle(vehicle)}>{vehicle.active ? "Desativar" : "Ativar"}</Button></div></div>)}
      </CardContent>
    </Card>
  )
}

function VehicleForm({ vehicle, pending, onSubmit, onCancel }: { vehicle?: Vehicle; pending: boolean; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; onCancel: () => void }) { return <form onSubmit={onSubmit} className="rounded-2xl bg-muted/60 p-5"><div className="mb-5 flex items-center justify-between"><h3 className="font-semibold">{vehicle ? "Editar veículo" : "Novo veículo"}</h3><Button type="button" variant="ghost" size="icon" onClick={onCancel} aria-label="Fechar formulário"><X /></Button></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field id="brand" label="Marca"><Input id="brand" name="brand" defaultValue={vehicle?.brand} required /></Field><Field id="model" label="Modelo"><Input id="model" name="model" defaultValue={vehicle?.model} required /></Field><Field id="color" label="Cor"><Input id="color" name="color" defaultValue={vehicle?.color} required /></Field><Field id="plate" label="Placa"><Input id="plate" name="plate" defaultValue={vehicle?.plate} placeholder="ABC1D23" required /></Field><Field id="year" label="Ano"><Input id="year" name="year" type="number" min="1900" max={new Date().getFullYear() + 1} defaultValue={vehicle?.year} required /></Field><Field id="passengerCapacity" label="Capacidade de passageiros"><Input id="passengerCapacity" name="passengerCapacity" type="number" min="1" max="20" defaultValue={vehicle?.passengerCapacity} required /></Field></div><Button type="submit" className="mt-5" disabled={pending}>{pending ? "Salvando..." : "Salvar veículo"}</Button></form> }
function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}</div> }
