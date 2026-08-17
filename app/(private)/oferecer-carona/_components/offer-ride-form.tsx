"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, CarFront, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"

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
import { Textarea } from "@/components/ui/textarea"
import {
  offerRideFormSchema,
  type OfferRideFormInput,
} from "@/lib/schemas/ride.schema"
import type { Vehicle } from "@/lib/schemas/vehicle.schema"

export function OfferRideForm({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OfferRideFormInput>({
    resolver: zodResolver(offerRideFormSchema),
    defaultValues: {
      vehicleId: vehicles[0]?.id ?? "",
      originAddress: "",
      destinationAddress: "",
      departureAt: "",
      notes: "",
    },
  })

  const vehicleId = useWatch({ control, name: "vehicleId" })
  const vehicle = vehicles.find((item) => item.id === vehicleId)

  async function submit(data: OfferRideFormInput) {
    const result = await createRideAction({
      vehicleId: data.vehicleId,
      originAddress: data.originAddress,
      destinationAddress: data.destinationAddress,
      departureAt: new Date(data.departureAt).toISOString(),
      notes: data.notes || undefined,
    })

    if (result.error || !result.data) {
      setError("root.server", { message: result.error ?? "Não foi possível publicar a carona." })
      return
    }
    router.push(`/caronas/${result.data.id}`)
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="mt-8 space-y-6 rounded-lg border bg-card p-5 shadow-sm sm:p-8"
    >
      {errors.root?.server?.message ? (
        <Alert variant="destructive">
          <AlertDescription>{errors.root.server.message}</AlertDescription>
        </Alert>
      ) : null}

      <input type="hidden" {...register("vehicleId")} />

      {vehicles.length > 1 ? (
        <Field id="vehicleId" label="Veículo" error={errors.vehicleId?.message}>
          <Select
            value={vehicleId}
            onValueChange={(value) =>
              value && setValue("vehicleId", value, { shouldValidate: true })
            }
          >
            <SelectTrigger
              id="vehicleId"
              className="w-full"
              aria-invalid={Boolean(errors.vehicleId)}
              aria-describedby={errors.vehicleId ? "vehicleId-error" : undefined}
            >
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
      ) : vehicle ? (
        <div className="flex items-center gap-3 rounded-lg bg-muted p-4 text-sm">
          <CarFront className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
            <p className="text-muted-foreground">
              {vehicle.passengerCapacity} vagas serão disponibilizadas
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Field id="originAddress" label="Endereço inicial" error={errors.originAddress?.message}>
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 size-5 text-muted-foreground" aria-hidden="true" />
            <Input
              id="originAddress"
              autoComplete="street-address"
              placeholder="Ex.: Avenida Saul Elkind, Londrina - PR"
              className="pl-12"
              aria-invalid={Boolean(errors.originAddress)}
              aria-describedby={errors.originAddress ? "originAddress-error" : undefined}
              {...register("originAddress")}
            />
          </div>
        </Field>

        <Field id="destinationAddress" label="Endereço final" error={errors.destinationAddress?.message}>
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 size-5 text-muted-foreground" aria-hidden="true" />
            <Input
              id="destinationAddress"
              autoComplete="street-address"
              placeholder="Ex.: Universidade Positivo, Londrina - PR"
              className="pl-12"
              aria-invalid={Boolean(errors.destinationAddress)}
              aria-describedby={errors.destinationAddress ? "destinationAddress-error" : undefined}
              {...register("destinationAddress")}
            />
          </div>
        </Field>
      </div>

      <Field id="departureAt" label="Data e hora da partida" error={errors.departureAt?.message}>
        <Input
          id="departureAt"
          type="datetime-local"
          min={toLocalDateTime(new Date())}
          aria-invalid={Boolean(errors.departureAt)}
          aria-describedby={errors.departureAt ? "departureAt-error" : undefined}
          {...register("departureAt")}
        />
      </Field>

      <Field id="notes" label="Observação (opcional)" error={errors.notes?.message}>
        <Textarea
          id="notes"
          maxLength={1000}
          placeholder="Ex.: saída pontual, pouco espaço para bagagem"
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? "notes-error" : undefined}
          {...register("notes")}
        />
      </Field>

      <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          O valor será calculado pelo desembarque de cada passageiro, com mínimo de R$ 5,00.
        </p>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Publicando..." : "Publicar carona"}
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  const errorId = `${id}-error`
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p id={errorId} className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}

function toLocalDateTime(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}
