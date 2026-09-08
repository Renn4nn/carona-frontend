"use client"

import dynamic from "next/dynamic"

export const RideRouteMap = dynamic(
  () => import("./ride-route-map").then((module) => module.RideRouteMap),
  {
    ssr: false,
    loading: () => (
      <div className="mt-8 flex h-96 items-center justify-center rounded-2xl border text-sm text-muted-foreground">
        Carregando rota...
      </div>
    ),
  }
)
