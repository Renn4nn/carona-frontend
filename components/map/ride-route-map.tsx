"use client"

import "leaflet/dist/leaflet.css"

import { useEffect, useState } from "react"
import {
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet"
import { divIcon } from "leaflet"

import { getRideRouteAction } from "@/actions/ride.actions"
import type { Ride } from "@/lib/schemas/ride.schema"

export function RideRouteMap({ ride }: { ride: Ride }) {
  const [route, setRoute] = useState<{
    geometry: GeoJSON.GeoJSON
    distanceMeters: number | null
    durationSeconds: number | null
  }>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    void getRideRouteAction(ride.id).then((result) => {
      if (result.data) setRoute(result.data)
      else setError(result.error)
    })
  }, [ride.id])

  if (
    ride.originLatitude === null ||
    ride.originLongitude === null ||
    ride.destinationLatitude === null ||
    ride.destinationLongitude === null
  )
    return null
  const center: [number, number] = [ride.originLatitude, ride.originLongitude]
  const key = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY
  const tiles = key
    ? `https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${key}`
    : "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
  const attribution = key
    ? '© OpenStreetMap contributors · <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer">Geoapify</a>'
    : "© OpenStreetMap contributors"
  const pin = (color: string) =>
    divIcon({
      className: "ride-location-pin",
      html: `<span style="background:${color}"></span>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    })

  return (
    <section className="mt-8 space-y-3">
      <h2 className="text-xl font-semibold">Trajeto da carona</h2>
      <div className="h-96 overflow-hidden rounded-2xl border">
        <MapContainer center={center} zoom={13} className="h-full w-full">
          <FitRoute
            origin={center}
            destination={[ride.destinationLatitude, ride.destinationLongitude]}
          />
          <TileLayer url={tiles} attribution={attribution} />
          <Marker position={center} icon={pin("#16a34a")}>
            <Popup>Origem</Popup>
          </Marker>
          <Marker
            position={[ride.destinationLatitude, ride.destinationLongitude]}
            icon={pin("#dc2626")}
          >
            <Popup>Destino</Popup>
          </Marker>
          {route ? (
            <GeoJSON
              data={route.geometry as GeoJSON.GeoJsonObject}
              style={{ color: "#2563eb", weight: 5 }}
            />
          ) : null}
        </MapContainer>
      </div>
      {route?.distanceMeters ? (
        <p className="text-sm text-muted-foreground">
          {(route.distanceMeters / 1000).toFixed(1)} km ·{" "}
          {route.durationSeconds
            ? `${Math.round(route.durationSeconds / 60)} min estimados`
            : "tempo indisponível"}
        </p>
      ) : null}
      {error ? <p className="text-sm text-muted-foreground">{error}</p> : null}
    </section>
  )
}

function FitRoute({
  origin,
  destination,
}: {
  origin: [number, number]
  destination: [number, number]
}) {
  const map = useMap()
  useEffect(() => {
    map.fitBounds([origin, destination], { padding: [30, 30] })
  }, [map, origin, destination])
  return null
}
