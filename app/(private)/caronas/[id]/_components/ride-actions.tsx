"use client"

import { AlertCircle, Check, Flag, Play, Send, X } from "lucide-react"
import { useState } from "react"

import { cancelParticipationAction, requestRideAction, respondToParticipantAction } from "@/actions/participation.actions"
import { transitionRideAction } from "@/actions/ride.actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { RideParticipant } from "@/lib/schemas/participation.schema"
import type { Ride } from "@/lib/schemas/ride.schema"

export function RideActions({ ride, isDriver, myParticipation, participants }: { ride: Ride; isDriver: boolean; myParticipation?: RideParticipant; participants: RideParticipant[] }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>()
  const activeParticipation = myParticipation && ["PENDING", "ACCEPTED"].includes(myParticipation.status.code)

  async function run(task: () => Promise<{ error?: string }>) {
    setPending(true); setError(undefined)
    const result = await task()
    setPending(false)
    if (result.error) setError(result.error)
  }

  if (isDriver) {
    return (
      <div className="space-y-6">
        {error ? <ErrorAlert message={error} /> : null}
        <div className="flex flex-wrap gap-3">
          {ride.status.code === "OPEN" ? <Button disabled={pending} onClick={() => run(() => transitionRideAction(ride.id, "start"))}><Play />Iniciar carona</Button> : null}
          {ride.status.code === "IN_PROGRESS" ? <Button disabled={pending} onClick={() => run(() => transitionRideAction(ride.id, "complete"))}><Flag />Concluir carona</Button> : null}
          {["OPEN", "IN_PROGRESS"].includes(ride.status.code) ? <Button variant="outline" disabled={pending} onClick={() => { const reason = window.prompt("Informe o motivo do cancelamento:"); if (reason) void run(() => transitionRideAction(ride.id, "cancel", reason)) }}><X />Cancelar carona</Button> : null}
        </div>
        <section className="rounded-3xl border bg-card p-5 sm:p-6"><h2 className="text-lg font-semibold">Solicitações de passageiros</h2><p className="mt-1 text-sm text-muted-foreground">Aceite apenas enquanto houver vagas disponíveis.</p>
          <div className="mt-5 space-y-3">{participants.length === 0 ? <p className="rounded-2xl bg-muted p-5 text-sm text-muted-foreground">Nenhuma solicitação recebida.</p> : participants.map((participant) => <div key={participant.id} className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><p className="font-semibold">{participant.user.login}</p><Badge variant="outline">{participant.status.name}</Badge></div>{participant.message ? <p className="mt-2 text-sm text-muted-foreground">{participant.message}</p> : null}</div>{participant.status.code === "PENDING" ? <div className="flex gap-2"><Button size="sm" disabled={pending} onClick={() => run(() => respondToParticipantAction(ride.id, participant.id, "accept"))}><Check />Aceitar</Button><Button size="sm" variant="outline" disabled={pending} onClick={() => run(() => respondToParticipantAction(ride.id, participant.id, "reject"))}><X />Recusar</Button></div> : null}</div>)}</div>
        </section>
      </div>
    )
  }

  if (activeParticipation) {
    return <div className="rounded-3xl border bg-card p-5 sm:p-6">{error ? <ErrorAlert message={error} /> : null}<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Sua solicitação: {myParticipation.status.name}</p><p className="mt-1 text-sm text-muted-foreground">Você pode cancelar enquanto a carona estiver aberta.</p></div>{ride.status.code === "OPEN" ? <Button variant="outline" disabled={pending} onClick={() => run(() => cancelParticipationAction(ride.id))}>Cancelar participação</Button> : null}</div></div>
  }

  if (ride.status.code !== "OPEN" || ride.isFull) return null

  return <form className="rounded-3xl border bg-card p-5 sm:p-6" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); void run(() => requestRideAction(ride.id, String(form.get("message") ?? ""))) }}><h2 className="text-lg font-semibold">Solicitar uma vaga</h2><p className="mt-1 text-sm text-muted-foreground">Envie uma mensagem curta para o motorista.</p>{error ? <div className="mt-4"><ErrorAlert message={error} /></div> : null}<div className="mt-5 flex flex-col gap-3 sm:flex-row"><Input name="message" maxLength={500} placeholder="Ex.: posso encontrar você próximo ao ponto?" /><Button type="submit" disabled={pending}>{pending ? "Enviando..." : "Solicitar vaga"}<Send /></Button></div></form>
}

function ErrorAlert({ message }: { message: string }) { return <Alert variant="destructive"><AlertCircle /><AlertDescription>{message}</AlertDescription></Alert> }
