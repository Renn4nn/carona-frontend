"use client"

import dynamic from "next/dynamic"

import type { RideLocation } from "./ride-location-picker"

export const RideLocationPicker = dynamic(
  () =>
    import("./ride-location-picker").then(
      (module) => module.RideLocationPicker
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center rounded-lg border text-sm text-muted-foreground">
        Carregando mapa...
      </div>
    ),
  }
)

export type { RideLocation }
