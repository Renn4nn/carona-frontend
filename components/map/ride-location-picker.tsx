"use client"

import "leaflet/dist/leaflet.css"

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet"
import { divIcon, type LatLng, type LeafletMouseEvent } from "leaflet"
import { useEffect } from "react"

export type RideLocation = { latitude: number; longitude: number }

type Props = {
  origin?: RideLocation
  destination?: RideLocation
  active: "origin" | "destination"
  onSelectOrigin: (location: RideLocation) => void
  onSelectDestination: (location: RideLocation) => void
}

const defaultCenter: [number, number] = [-23.3103, -51.1628]

export function RideLocationPicker({
  origin,
  destination,
  active,
  onSelectOrigin,
  onSelectDestination,
}: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY
  const tileUrl = apiKey
    ? `https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${apiKey}`
    : "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
  const attribution = apiKey
    ? '© OpenStreetMap contributors · <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer">Geoapify</a>'
    : "© OpenStreetMap contributors"

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        {active === "origin"
          ? "Clique no mapa para definir a origem. Você pode ajustar o pin arrastando-o."
          : "Selecione o destino nas sugestões de endereço."}
      </p>
      <div className="h-80 overflow-hidden rounded-lg border">
        <MapContainer
          center={origin ? [origin.latitude, origin.longitude] : defaultCenter}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer url={tileUrl} attribution={attribution} />
          {origin || destination ? (
            <MapViewport point={origin ?? destination!} />
          ) : null}
          {active === "origin" ? (
            <MapClickHandler onSelect={onSelectOrigin} />
          ) : null}
          {origin ? (
            <LocationMarker
              location={origin}
              color="#16a34a"
              label="Origem"
              onSelect={onSelectOrigin}
            />
          ) : null}
          {destination ? (
            <LocationMarker
              location={destination}
              color="#dc2626"
              label="Destino"
              onSelect={onSelectDestination}
              draggable={false}
            />
          ) : null}
        </MapContainer>
      </div>
    </div>
  )
}

function MapViewport({ point }: { point: RideLocation }) {
  const map = useMap()
  useEffect(() => {
    map.setView([point.latitude, point.longitude])
  }, [map, point.latitude, point.longitude])
  return null
}

function MapClickHandler({
  onSelect,
}: {
  onSelect: (location: RideLocation) => void
}) {
  useMapEvents({
    click: (event: LeafletMouseEvent) =>
      onSelect({ latitude: event.latlng.lat, longitude: event.latlng.lng }),
  })
  return null
}

function LocationMarker({
  location,
  color,
  label,
  onSelect,
  draggable = true,
}: {
  location: RideLocation
  color: string
  label: string
  onSelect: (location: RideLocation) => void
  draggable?: boolean
}) {
  function handleDragEnd(event: { target: { getLatLng: () => LatLng } }) {
    const point = event.target.getLatLng()
    onSelect({ latitude: point.lat, longitude: point.lng })
  }

  const icon = divIcon({
    className: "ride-location-pin",
    html: `<span style="background:${color}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={icon}
      draggable={draggable}
      eventHandlers={draggable ? { dragend: handleDragEnd } : undefined}
      bubblingMouseEvents={false}
    >
      <Popup>{label}</Popup>
    </Marker>
  )
}
