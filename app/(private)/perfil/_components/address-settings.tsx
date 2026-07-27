"use client"

import { MapPin } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MockFavoriteAddress } from "@/lib/types/domain"

export function AddressSettings({
  addresses,
}: {
  addresses: MockFavoriteAddress[]
}) {
  const [items, setItems] = useState(addresses)

  function makePrimary(id: string) {
    setItems((current) =>
      current.map((address) => ({
        ...address,
        primary: address.id === id,
      })),
    )
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Endereços favoritos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((address) => (
          <div
            key={address.id}
            className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <MapPin className="size-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{address.label}</p>
                  {address.primary && <Badge>Principal</Badge>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {address.address}
                </p>
              </div>
            </div>
            {!address.primary && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => makePrimary(address.id)}
              >
                Tornar principal
              </Button>
            )}
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          Endereços demonstrativos até este recurso existir no backend.
        </p>
      </CardContent>
    </Card>
  )
}
