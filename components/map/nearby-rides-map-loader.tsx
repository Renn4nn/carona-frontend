"use client"

import dynamic from "next/dynamic"

export const NearbyRidesMap = dynamic(
  () => import("./nearby-rides-map").then((module) => module.NearbyRidesMap),
  {
    ssr: false,
    loading: () => (
      <div className="mt-8 flex h-96 items-center justify-center rounded-3xl border bg-card text-sm text-muted-foreground">
        Carregando mapa...
      </div>
    ),
  }
)
