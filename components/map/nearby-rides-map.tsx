"use client"

import "leaflet/dist/leaflet.css"

import Link from "next/link"
import { LocateFixed, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet"
import { divIcon } from "leaflet"

import { listNearbyRidesAction } from "@/actions/ride.actions"
import { Button } from "@/components/ui/button"
import type { NearbyRideSchema } from "@/lib/schemas/ride.schema"

type Point = { latitude: number; longitude: number }
const defaultCenter: Point = { latitude: -23.3103, longitude: -51.1628 }

export function NearbyRidesMap() {
  const [userPoint, setUserPoint] = useState<Point>()
  const [rides, setRides] = useState<NearbyRideSchema[]>([])
  const [radius, setRadius] = useState(5)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>()
  const [manualMode, setManualMode] = useState(false)

  async function searchNearby(point: Point, selectedRadius = radius) {
    setUserPoint(point)
    setLoading(true)
    const result = await listNearbyRidesAction(
      point.latitude,
      point.longitude,
      selectedRadius
    )
    setRides(result.data ?? [])
    setMessage(result.error)
    setLoading(false)
  }

  function locate() {
    if (!navigator.geolocation) {
      setMessage("Seu navegador não oferece geolocalização.")
      return
    }
    setLoading(true)
    setMessage(undefined)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const point = { latitude: coords.latitude, longitude: coords.longitude }
        await searchNearby(point)
      },
      () => {
        setMessage(
          "Permita o acesso à sua localização para encontrar caronas próximas."
        )
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    )
  }

  async function changeRadius(value: number) {
    setRadius(value)
    if (!userPoint) return
    await searchNearby(userPoint, value)
  }

  const center = userPoint ?? defaultCenter
  const tileKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY
  const tileUrl = tileKey
    ? `https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${tileKey}`
    : "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
  const attribution = tileKey
    ? '© OpenStreetMap contributors · <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer">Geoapify</a>'
    : "© OpenStreetMap contributors"

  return (
    <section className="mt-8 space-y-4 rounded-3xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <MapPin className="size-5 text-primary" />
            Caronas próximas
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Encontre pontos de saída perto de você.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={locate} disabled={loading}>
            <LocateFixed />
            {loading ? "Localizando..." : "Usar minha localização"}
          </Button>
          <Button
            type="button"
            variant={manualMode ? "default" : "outline"}
            onClick={() => setManualMode((current) => !current)}
          >
            Escolher no mapa
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Raio:</span>
        {[2, 5, 10].map((value) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={radius === value ? "default" : "outline"}
            onClick={() => changeRadius(value)}
          >
            {value} km
          </Button>
        ))}
      </div>
      <div className="h-96 overflow-hidden rounded-2xl border">
        <MapContainer
          center={[center.latitude, center.longitude]}
          zoom={13}
          className="h-full w-full"
        >
          <MapViewport point={center} />
          <TileLayer url={tileUrl} attribution={attribution} />
          {manualMode ? (
            <MapClickHandler
              onSelect={(point) => {
                setManualMode(false)
                void searchNearby(point)
              }}
            />
          ) : null}
          {userPoint ? (
            <Circle
              center={[userPoint.latitude, userPoint.longitude]}
              radius={radius * 1000}
              pathOptions={{
                color: "#2563eb",
                fillColor: "#2563eb",
                fillOpacity: 0.08,
              }}
            />
          ) : null}
          {rides.map((ride) => (
            <Marker
              key={ride.id}
              position={[ride.originLatitude, ride.originLongitude]}
              icon={divIcon({
                className: "ride-location-pin",
                html: `<span style="background:#f97316"></span>`,
                iconSize: [22, 22],
                iconAnchor: [11, 11],
              })}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <strong>{ride.driver.login}</strong>
                  <p>{(ride.distanceMeters / 1000).toFixed(1)} km de você</p>
                  <Link
                    className="font-medium text-primary underline"
                    href={`/caronas/${ride.id}`}
                  >
                    Ver carona
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
      {userPoint && rides.length === 0 && !loading ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma carona encontrada neste raio.
        </p>
      ) : null}
      {rides.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {rides.map((ride) => (
            <Link
              key={ride.id}
              href={`/caronas/${ride.id}`}
              className="rounded-xl border p-3 text-sm transition hover:bg-accent"
            >
              <span className="font-medium">{ride.driver.login}</span>
              <span className="mt-1 block text-muted-foreground">
                {(ride.distanceMeters / 1000).toFixed(1)} km ·{" "}
                {ride.availableSeats} vaga(s)
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  )
}

function MapViewport({ point }: { point: Point }) {
  const map = useMap()
  useEffect(() => {
    map.setView([point.latitude, point.longitude])
  }, [map, point.latitude, point.longitude])
  return null
}

function MapClickHandler({ onSelect }: { onSelect: (point: Point) => void }) {
  useMapEvents({
    click: (event) =>
      onSelect({ latitude: event.latlng.lat, longitude: event.latlng.lng }),
  })
  return null
}
