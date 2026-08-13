"use client"

import { useRouter } from "next/navigation"
import { AlertCircle, ArrowRight, Info } from "lucide-react"
import { useMemo, useState } from "react"

import { createRideAction } from "@/actions/ride.actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import type { PaymentMethod } from "@/lib/schemas/catalog.schema"
import type { Vehicle } from "@/lib/schemas/vehicle.schema"

export function OfferRideForm({
  vehicles,
  paymentMethods,
}: {
  vehicles: Vehicle[]
  paymentMethods: PaymentMethod[]
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>()
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "")
  const [paymentMethodId, setPaymentMethodId] = useState("")
  const [contribution, setContribution] = useState("0")
  const vehicle = useMemo(
    () => vehicles.find((item) => item.id === vehicleId),
    [vehicles, vehicleId]
  )
  const paymentMethod = useMemo(
    () => paymentMethods.find((item) => item.id === paymentMethodId),
    [paymentMethods, paymentMethodId]
  )

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(undefined)

    const form = new FormData(event.currentTarget)
    const departureAt = String(form.get("departureAt") ?? "")
    const estimatedArrivalAt = String(form.get("estimatedArrivalAt") ?? "")
    const result = await createRideAction({
      vehicleId,
      paymentMethodId: paymentMethodId || undefined,
      originName: String(form.get("originName") ?? ""),
      originAddress: String(form.get("originAddress") ?? ""),
      destinationName: String(form.get("destinationName") ?? ""),
      destinationAddress: String(form.get("destinationAddress") ?? ""),
      departureAt: departureAt ? new Date(departureAt).toISOString() : "",
      estimatedArrivalAt: estimatedArrivalAt
        ? new Date(estimatedArrivalAt).toISOString()
        : undefined,
      totalSeats: String(form.get("totalSeats") ?? ""),
      contributionPerSeat: contribution,
      paymentNotes: String(form.get("paymentNotes") ?? "") || undefined,
      description: String(form.get("description") ?? "") || undefined,
      rules: String(form.get("rules") ?? "") || undefined,
    })

    setPending(false)
    if ("error" in result) {
      setError(result.error)
      return
    }
    router.push(`/caronas/${result.data.id}`)
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 space-y-8 rounded-3xl border bg-card p-5 shadow-sm sm:p-8"
    >
      {error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Section
        title="Veículo e vagas"
        description="A quantidade oferecida não pode superar a capacidade cadastrada."
      >
        <Field id="vehicleId" label="Veículo">
          <Select
            value={vehicleId}
            onValueChange={(value) => value && setVehicleId(value)}
          >
            <SelectTrigger id="vehicleId" className="w-full">
              <span className="line-clamp-1 flex-1 text-left">
                {vehicle
                  ? `${vehicle.brand} ${vehicle.model} - ${vehicle.plate}`
                  : "Selecione"}
              </span>
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {vehicles.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.brand} {item.model} - {item.plate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field id="totalSeats" label="Vagas disponíveis">
          <Input
            id="totalSeats"
            name="totalSeats"
            type="number"
            min="1"
            max={vehicle?.passengerCapacity ?? 1}
            required
          />
          <p className="text-xs text-muted-foreground">
            Máximo: {vehicle?.passengerCapacity ?? 0}
          </p>
        </Field>
      </Section>

      <Section
        title="Trajeto"
        description="Informe nomes curtos para a busca e endereços completos para quem participar."
      >
        <Field id="originName" label="Nome da origem">
          <Input id="originName" name="originName" placeholder="Ex.: Centro" required />
        </Field>
        <Field id="originAddress" label="Endereço da origem">
          <Input
            id="originAddress"
            name="originAddress"
            placeholder="Rua, número e referência"
            required
          />
        </Field>
        <Field id="destinationName" label="Nome do destino">
          <Input
            id="destinationName"
            name="destinationName"
            placeholder="Ex.: Universidade Positivo"
            required
          />
        </Field>
        <Field id="destinationAddress" label="Endereço do destino">
          <Input
            id="destinationAddress"
            name="destinationAddress"
            placeholder="Rua, número e referência"
            required
          />
        </Field>
      </Section>

      <Section title="Horários" description="A partida precisa estar no futuro.">
        <Field id="departureAt" label="Partida">
          <Input id="departureAt" name="departureAt" type="datetime-local" required />
        </Field>
        <Field id="estimatedArrivalAt" label="Chegada estimada">
          <Input id="estimatedArrivalAt" name="estimatedArrivalAt" type="datetime-local" />
        </Field>
      </Section>

      <Section
        title="Contribuição combinada"
        description="O valor é apenas informativo. O pagamento acontece pessoalmente, fora da plataforma."
      >
        <Field id="contributionPerSeat" label="Valor por vaga">
          <Input
            id="contributionPerSeat"
            type="number"
            min="0"
            step="0.01"
            value={contribution}
            onChange={(event) => setContribution(event.target.value)}
            required
          />
        </Field>
        <Field id="paymentMethodId" label="Método combinado">
          <Select
            value={paymentMethodId}
            onValueChange={(value) => value && setPaymentMethodId(value)}
            disabled={Number(contribution) === 0}
          >
            <SelectTrigger id="paymentMethodId" className="w-full">
              <span className="line-clamp-1 flex-1 text-left">
                {Number(contribution) === 0
                  ? "Carona gratuita"
                  : paymentMethod?.name ?? "Selecione"}
              </span>
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.id}>
                  {method.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <div className="md:col-span-2">
          <Field id="paymentNotes" label="Instruções gerais">
            <Input
              id="paymentNotes"
              name="paymentNotes"
              placeholder="Ex.: combinar após a viagem (não informe chave PIX)"
              maxLength={300}
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Informações adicionais"
        description="Ajude os passageiros a entender como será o trajeto."
      >
        <TextField
          id="description"
          label="Descrição"
          placeholder="Conte um pouco sobre o trajeto"
        />
        <TextField
          id="rules"
          label="Regras"
          placeholder="Ex.: tolerância de 5 minutos"
        />
      </Section>

      <Alert>
        <Info />
        <AlertDescription>
          Não informe chave PIX, comprovantes, credenciais ou dados financeiros.
        </AlertDescription>
      </Alert>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Publicando..." : "Publicar carona"}
        <ArrowRight />
      </Button>
    </form>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold">{title}</legend>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 grid gap-5 md:grid-cols-2">{children}</div>
    </fieldset>
  )
}

function Field({
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
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

function TextField({
  id,
  label,
  placeholder,
}: {
  id: string
  label: string
  placeholder: string
}) {
  return (
    <Field id={id} label={label}>
      <textarea
        id={id}
        name={id}
        placeholder={placeholder}
        maxLength={1000}
        className="min-h-28 w-full rounded-2xl border bg-transparent px-4 py-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </Field>
  )
}
