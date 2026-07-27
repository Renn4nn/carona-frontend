"use client"

import { CarFront, CheckCircle2, MapPin, Search } from "lucide-react"
import { useState } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { vehiclesMock } from "@/mock"
import { cn } from "@/lib/utils"

type Mode = "search" | "offer"

export function RidePlanner() {
  const [mode, setMode] = useState<Mode>("search")
  const [submitted, setSubmitted] = useState(false)

  function submitMock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <Card className="mt-8">
      <CardContent>
        <div className="grid gap-2 rounded-2xl bg-muted p-1 sm:grid-cols-2">
          <ModeButton
            active={mode === "search"}
            icon={Search}
            label="Buscar carona"
            onClick={() => {
              setMode("search")
              setSubmitted(false)
            }}
          />
          <ModeButton
            active={mode === "offer"}
            icon={CarFront}
            label="Oferecer carona"
            onClick={() => {
              setMode("offer")
              setSubmitted(false)
            }}
          />
        </div>

        <form
          className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
          onSubmit={submitMock}
        >
          <PlannerField id="origin" label="Saindo de">
            <Input id="origin" placeholder="Bairro ou endereço" required />
          </PlannerField>
          <PlannerField id="destination" label="Indo para">
            <Input id="destination" placeholder="Campus ou destino" required />
          </PlannerField>
          <PlannerField id="departure" label="Data e horário">
            <Input id="departure" type="datetime-local" required />
          </PlannerField>

          {mode === "offer" ? (
            <PlannerField id="vehicle" label="Veículo">
              <Select defaultValue={vehiclesMock[0]?.id}>
                <SelectTrigger id="vehicle" className="w-full">
                  <SelectValue placeholder="Selecione o veículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehiclesMock.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.model} · {vehicle.plate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </PlannerField>
          ) : (
            <PlannerField id="seats" label="Quantidade de vagas">
              <Input id="seats" type="number" min={1} max={4} defaultValue={1} />
            </PlannerField>
          )}

          <div className="md:col-span-2 xl:col-span-4">
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              {mode === "search" ? "Encontrar caronas" : "Publicar carona"}
            </Button>
          </div>
        </form>

        {submitted && (
          <Alert className="mt-6 border-primary/40 bg-primary/10">
            <CheckCircle2 aria-hidden="true" />
            <AlertDescription>
              Demonstração concluída. A integração será ativada quando o recurso
              de caronas estiver disponível no backend.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

type ModeButtonProps = {
  active: boolean
  icon: typeof Search
  label: string
  onClick: () => void
}

function ModeButton({ active, icon: Icon, label, onClick }: ModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </button>
  )
}

function PlannerField({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="gap-2">
        <MapPin className="size-4 text-primary" aria-hidden="true" />
        {label}
      </Label>
      {children}
    </div>
  )
}
