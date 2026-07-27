"use client"

import { CarFront } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MockVehicle } from "@/lib/types/domain"

export function VehicleSettings({ vehicles }: { vehicles: MockVehicle[] }) {
  const [items, setItems] = useState(vehicles)

  function toggleVehicle(id: string) {
    setItems((current) =>
      current.map((vehicle) =>
        vehicle.id === id
          ? { ...vehicle, active: !vehicle.active }
          : vehicle,
      ),
    )
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Veículos cadastrados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((vehicle) => (
          <div
            key={vehicle.id}
            className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <CarFront className="size-5" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">
                    {vehicle.brand} {vehicle.model}
                  </p>
                  <Badge variant={vehicle.active ? "default" : "outline"}>
                    {vehicle.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {vehicle.plate} · {vehicle.color} · {vehicle.year} ·{" "}
                  {vehicle.seats} assentos
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleVehicle(vehicle.id)}
            >
              {vehicle.active ? "Desativar" : "Ativar"}
            </Button>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          Configuração demonstrativa até a API de veículos estar disponível.
        </p>
      </CardContent>
    </Card>
  )
}
